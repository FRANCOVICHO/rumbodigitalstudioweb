# Technical Design Document

## Overview

El `BudgetCalculator.tsx` se reemplaza por un **Wizard de árbol de decisión** que califica clientes a través de preguntas ramificadas. El componente mantiene la misma exportación nombrada (`BudgetCalculator`) y los mismos atributos de sección (`id="calculadora"`, `py-24 bg-background-secondary`) para ser un drop-in replacement sin romper importaciones ni layout.

Stack: Next.js 14 App Router · TypeScript · Tailwind CSS (tokens del proyecto) · Framer Motion · Groq/Qwen via `/api/estimate`.

---

## Architecture

```
BudgetCalculator (componente raíz)
├── WizardProgress          — barra de progreso
├── AnimatePresence / motion.div — wrapper de transiciones
│   ├── QuestionNode        — nodo genérico de pregunta
│   │   └── OptionButton    — botón de opción A/B/C/D
│   └── ResultScreen        — pantalla de resultado
│       ├── RecommendationCard
│       ├── SummaryList
│       ├── ChatOfferBanner
│       └── AiChat          — chat embebido (condicional)
│
/api/estimate               — API route existente (ampliada)
```

---

## Data Model

### Nodo del árbol de decisión

```ts
type NodeId =
  | "q1" | "q2a" | "q2b" | "q2c" | "q2d"
  | "q3a" | "q3b" | "q3c" | "q3d" | "q3e" | "q3f" | "q3g" | "q3h"
  | "q4a" | "q4b"
  | "budget";

interface DecisionOption {
  id: string;           // "a" | "b" | "c" | "d"
  label: string;        // texto visible al usuario
  next: NodeId | "result"; // nodo siguiente o pantalla de resultado
  resultTag?: string;   // etiqueta de paquete si next === "result"
}

interface DecisionNode {
  id: NodeId;
  question: string;
  options: DecisionOption[];
}
```

### Contexto de sesión

```ts
interface SessionAnswer {
  nodeId: NodeId;
  question: string;
  optionId: string;
  optionLabel: string;
  resultTag?: string;
}

interface SessionContext {
  answers: SessionAnswer[];         // historial de respuestas en orden
  budgetRange: string | null;       // "< USD 150" | "USD 150–300" | ...
  budgetPackage: string | null;     // "Página básica" | ...
  recommendedPackage: string | null; // seteado post-API
}
```

### Estado del Wizard

```ts
type WizardPhase = "quiz" | "loading" | "result" | "chat";

interface WizardState {
  phase: WizardPhase;
  currentNodeId: NodeId;
  history: NodeId[];        // pila de nodos visitados, para "Volver"
  session: SessionContext;
  aiRecommendation: string | null;
  aiError: string | null;
  chatMessages: ChatMessage[];
  chatLoading: boolean;
  chatError: string | null;
  retryCount: number;       // para reintentos de API (máx 1)
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
```

---

## Decision Tree Map

El árbol completo se define como un objeto `Record<NodeId, DecisionNode>` en un archivo de datos separado: `lib/wizardTree.ts`.

```
q1 → (A→q2a, B→q2b, C→q2c, D→q2d)

q2a → (A→q3a, B→q3b, C→q3c, D→q3d)
q2b → (A→q3a, B→q3b, C→q3c, D→q3d)
q2c → (A→q3d, B→q3e, C→q3f, D→q3g)
q2d → (A→q3d, B→q3g, C→q3c, D→q3h)

q3a → (A→budget[Web básica], B→budget[Web empresarial], C→budget[Web premium], D→q4a)
q3b → (A→budget[Web empresarial básica], B→budget[Web con reservas], C→budget[Web avanzada], D→budget[Desarrollo personalizado])
q3c → (A→budget[Tienda inicial], B→budget[Ecommerce profesional], C→budget[Ecommerce avanzado], D→q4b)
q3d → (A→budget[Web básica], B→budget[Web empresarial], C→budget[Web premium], D→budget[Pack branding+web])
q3e → (A→budget[SEO+optimización], B→budget[Rediseño+conversión], C→budget[Mejora UX], D→budget[Auditoría web])
q3f → (A→budget[Optimización técnica], B→budget[Diseño responsive], C→budget[Plan mensual], D→budget[Rediseño completo])
q3g → (A→budget[Web empresarial avanzada], B→budget[Sistema personalizado], C→budget[Desarrollo con IA], D→budget[Desarrollo personalizado])
q3h → (A→budget[Sistema web personalizado], B→budget[Desarrollo completo], C→budget[Consultoría+desarrollo], D→budget[Reunión de análisis])

q4a → (A→budget[Web básica], B→budget[Web empresarial], C→budget[Web premium], D→budget[IA recomienda])
q4b → (A→budget[Plan profesional], B→budget[Paquete inicial], C→budget[Arquitectura escalable], D→budget[Consulta])

budget → 4 opciones de rango → result
```

Cuando `next === "result"` en el nodo `budget`, se activa la fase `loading` y se llama a la API.

---

## Component Design

### `BudgetCalculator` (componente raíz)

- Contiene todo el estado `WizardState` en un `useReducer`.
- Renderiza `WizardProgress` + `AnimatePresence` con la fase actual.
- Maneja `direction` (1 = avanzar, -1 = retroceder) para las animaciones.

### `WizardProgress`

- Props: `current: number`, `total: number`, `completed: boolean`
- Total de pasos: siempre 4 (Q1 → Q2 → Q3/Q4 → Budget), independiente de la rama.
- Muestra barra de progreso lineal + etiqueta "Paso X de 4".
- En `completed === true` muestra barra al 100% con ícono de check.

### `QuestionNode`

- Props: `node: DecisionNode`, `selectedOptionId: string | null`, `onSelect: (option: DecisionOption) => void`
- Renderiza la pregunta y 4 `OptionButton`s en grid `grid-cols-1 sm:grid-cols-2`.
- Si `label + desc` supera 80 chars en alguna opción → fuerza `grid-cols-1`.
- Selección auto-avanza al siguiente nodo (no requiere botón "Continuar").

### `OptionButton`

- Props: `option: DecisionOption`, `selected: boolean`, `onClick: () => void`
- Estilos: `border-white/10 bg-white/5` → activo: `border-primary-500 bg-primary-600/20`.
- Muestra letra (A/B/C/D) + label. Sin descripciones largas en las opciones del árbol.
- Touch target mínimo: `min-h-[44px]`.

### `ResultScreen`

- Props: `session: SessionContext`, `recommendation: string | null`, `loading: boolean`, `error: string | null`, `onRetry: () => void`, `onReset: () => void`, `onBack: () => void`
- Layout: `RecommendationCard` → `SummaryList` → `ChatOfferBanner` → `AiChat` (si aceptó).
- Mientras `loading === true`: spinner animado con Framer Motion rotate.
- Error: mensaje amigable + botón "Reintentar" (máx 1 reintento total).
- WhatsApp href generado desde `session` con max 300 chars de mensaje.

### `AiChat`

- Props: `initialMessages: ChatMessage[]`, `onSendMessage: (text: string) => Promise<void>`, `loading: boolean`, `error: string | null`
- Input: `maxLength={500}`, muestra contador de caracteres cuando supera 400.
- Send button deshabilitado si input vacío, loading activo, o chars > 500.
- Historial de mensajes con scroll automático al último mensaje (`useRef` + `scrollIntoView`).
- Máx 3 reintentos de chat; al agotar → deshabilita input con mensaje explicativo.

---

## API Route Changes (`/api/estimate`)

El endpoint existente se amplía para soportar dos modos sin romper el contrato actual:

### Modo estimación (existente + extendido)

**Request body:**
```ts
{
  // campos existentes (backward compat)
  projectType?: string;
  features?: string[];
  pageCount?: string;
  timeline?: string;
  imageBase64?: string;

  // campos nuevos del wizard
  wizardAnswers?: SessionAnswer[];   // historial completo del árbol
  budgetRange?: string;              // rango de presupuesto elegido
  mode?: "estimate" | "chat";        // defecto: "estimate"
  chatHistory?: ChatMessage[];       // solo en modo "chat"
}
```

**Response body:**
```ts
{
  estimate?: string;       // modo "estimate": recomendación + paquete + justificación
  reply?: string;          // modo "chat": respuesta conversacional
  error?: string;
}
```

### System prompt para modo `estimate` con wizard

```
Sos un consultor de Rumbo Digital Studio (Argentina).
El cliente completó un cuestionario. Basándote en sus respuestas, recomendá el paquete más adecuado.

Incluí en tu respuesta (máximo 5 oraciones):
1. Nombre del paquete recomendado
2. Descripción breve del paquete (máx 150 chars)
3. Una justificación que mencione al menos una respuesta concreta del cliente
4. Precio orientativo en USD acorde al rango elegido: {budgetRange}

Infiere internamente sin preguntarle al usuario:
- Urgencia (por sus respuestas sobre el negocio)
- Importancia del diseño (por su rama de navegación)
- Objetivo principal (vender / captar clientes / presencia / automatizar)

Respondé en español argentino, de forma directa y cálida.
```

### System prompt para modo `chat`

```
Sos un consultor de Rumbo Digital Studio (Argentina).
El cliente ya completó el cuestionario y recibió esta recomendación: {recommendation}.

Sus respuestas fueron:
{wizardAnswers formatted}

Tu objetivo es hacer 1–2 preguntas de profundización sobre:
1. Urgencia ("¿Para cuándo necesitás la página?")
2. Importancia del diseño ("¿Qué tan importante es el diseño visual para tu marca?")
3. Objetivo principal ("¿Qué resultado esperás de la web?")

Luego de recopilar esas respuestas, confirmá o ajustá la recomendación.
Respondé en español argentino. Sé conciso y conversacional.
```

---

## State Machine

```
INITIAL
  │
  ▼ (mount)
QUIZ [currentNodeId = "q1"]
  │
  ▼ (usuario selecciona opción → next === "result" en nodo budget)
LOADING
  │
  ├─ success ──▶ RESULT
  │                 │
  │                 ├─ "Sí, chatear" ──▶ CHAT
  │                 │                      │
  │                 │                 send message
  │                 │                      │
  │                 │              loading → reply
  │                 │
  │                 └─ "Volver" ──▶ QUIZ [último nodo del historial]
  │
  └─ error (timeout 15s / network) ──▶ RESULT [error state]
                                           │
                                      "Reintentar" (máx 1)
                                           │
                                      LOADING (reintento)

En QUIZ: "Volver" saca el último NodeId del historial y descarta answers posteriores.
"Empezar de nuevo" → INITIAL.
```

---

## Animations

Usando `AnimatePresence` con `mode="wait"` y variantes de dirección:

```ts
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

const transition = { duration: 0.3, ease: "easeInOut" };
```

- Avanzar: `direction = 1` → entrada desde derecha, salida a izquierda.
- Retroceder: `direction = -1` → entrada desde izquierda, salida a derecha.
- Pantalla resultado: `scale: [0.9, 1]` + fade-in (sin dirección).
- `prefers-reduced-motion`: si `window.matchMedia('(prefers-reduced-motion: reduce)').matches` → duración 0ms, sin translate.

---

## File Structure

```
components/sections/BudgetCalculator.tsx   ← componente raíz (reemplazado)
lib/wizardTree.ts                          ← árbol de decisión completo (datos)
app/api/estimate/route.ts                  ← ampliado (backward compat)
```

No se crean nuevos componentes en carpetas separadas; los sub-componentes (`QuestionNode`, `OptionButton`, `ResultScreen`, `AiChat`, `WizardProgress`) se definen como funciones dentro del mismo archivo `BudgetCalculator.tsx` o como exports nombrados internos para mantener el scope pequeño. Si el archivo supera 600 líneas, se extrae `lib/wizardTree.ts` y `components/sections/AiChat.tsx`.

---

## Backward Compatibility

| Aspecto | Existente | Nuevo |
|---|---|---|
| Export | `export function BudgetCalculator()` | igual |
| Section id | `id="calculadora"` | igual |
| Section classes | `py-24 bg-background-secondary` | igual |
| API route path | `/api/estimate` (POST) | igual |
| API request (modo legacy) | `{projectType, features, pageCount, timeline, imageBase64}` | sigue funcionando |
| API response | `{estimate: string}` | sigue funcionando |

---

## Error Handling

| Escenario | Comportamiento |
|---|---|
| API timeout (>15s) | Abortar fetch con `AbortController`, mostrar error + "Reintentar" |
| API network error | Mismo tratamiento que timeout |
| API respuesta vacía/malformada | Mostrar fallback con botón de WhatsApp directo |
| Reintento agotado (>1 para estimate, >3 para chat) | Deshabilitar botón, mostrar mensaje y link de contacto |
| Node ID no encontrado en árbol | Navegar a nodo "budget" como fallback |
