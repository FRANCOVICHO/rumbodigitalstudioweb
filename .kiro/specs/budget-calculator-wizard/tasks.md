# Implementation Tasks

## Task 1: Crear el árbol de decisión en `lib/wizardTree.ts`

- [ ] 1.1 Definir los tipos `NodeId`, `DecisionOption`, `DecisionNode` en `lib/wizardTree.ts`
- [ ] 1.2 Implementar el mapa completo del árbol con todos los nodos q1, q2a–q2d, q3a–q3h, q4a, q4b y budget
- [ ] 1.3 Exportar el mapa como `WIZARD_TREE: Record<NodeId, DecisionNode>` y la constante `INITIAL_NODE: NodeId = "q1"`
- [ ] 1.4 Verificar que cada nodo tiene exactamente 4 opciones y que cada `next` apunta a un NodeId válido o a `"result"`

**Relevant requirements:** Requirement 1 (árbol de decisión ramificado), Requirement 2 (pregunta de presupuesto)

---

## Task 2: Definir los tipos y el estado del Wizard

- [ ] 2.1 Definir los tipos `SessionAnswer`, `SessionContext`, `ChatMessage`, `WizardPhase`, `WizardState` en `BudgetCalculator.tsx`
- [ ] 2.2 Implementar el `useReducer` con acciones: `SELECT_OPTION`, `GO_BACK`, `SET_RECOMMENDATION`, `SET_AI_ERROR`, `OPEN_CHAT`, `SEND_CHAT_MESSAGE`, `SET_CHAT_REPLY`, `SET_CHAT_ERROR`, `RESET`
- [ ] 2.3 La acción `SELECT_OPTION` debe: registrar la respuesta en `session.answers`, actualizar `history`, calcular el siguiente nodo o activar fase `loading` si el nodo resuelto es `budget` con opción seleccionada
- [ ] 2.4 La acción `GO_BACK` debe: sacar el último elemento de `history`, restaurar `currentNodeId` al anterior, descartar las answers con índice >= posición actual

**Relevant requirements:** Requirement 1 (AC5), Requirement 4 (navegación hacia atrás)

---

## Task 3: Implementar `WizardProgress`

- [ ] 3.1 Crear el sub-componente `WizardProgress` con props `current: number`, `total: number`, `completed: boolean`
- [ ] 3.2 Renderizar barra de progreso lineal con fill `bg-primary-600` proporcional a `current/total`
- [ ] 3.3 Mostrar etiqueta "Paso {current} de {total}" junto a la barra
- [ ] 3.4 Cuando `completed === true`, mostrar la barra al 100% con ícono `Check` (lucide-react)
- [ ] 3.5 Calcular `current` desde la longitud del historial de nodos visitados (máx 4)

**Relevant requirements:** Requirement 3 (Progress Bar)

---

## Task 4: Implementar `OptionButton` y `QuestionNode`

- [ ] 4.1 Crear `OptionButton` con props `letter: string`, `label: string`, `selected: boolean`, `onClick: () => void`; aplicar `min-h-[44px]`, estilos de selección activa/inactiva con tokens del proyecto
- [ ] 4.2 Crear `QuestionNode` con props `node: DecisionNode`, `selectedOptionId: string | null`, `onSelect: (option: DecisionOption) => void`
- [ ] 4.3 Renderizar la pregunta con tipografía `text-xl font-bold` y las opciones en `grid-cols-1 sm:grid-cols-2`
- [ ] 4.4 Si la suma de caracteres de `label` de cualquier opción supera 80 → forzar `grid-cols-1` en toda la pregunta
- [ ] 4.5 Selección auto-avanza (llama `onSelect` inmediatamente al hacer click, sin botón "Continuar")

**Relevant requirements:** Requirement 1 (AC1–AC3), Requirement 9 (diseño responsivo)

---

## Task 5: Implementar animaciones con Framer Motion

- [ ] 5.1 Definir las variantes `enter`, `center`, `exit` con `x: ±60` y `opacity` parametrizadas por `direction: number`
- [ ] 5.2 Envolver `QuestionNode` y `ResultScreen` en `AnimatePresence mode="wait"` con `motion.div` usando las variantes y `transition: { duration: 0.3, ease: "easeInOut" }`
- [ ] 5.3 Mantener estado `direction: 1 | -1` en el reducer: `SELECT_OPTION` → `1`, `GO_BACK` → `-1`
- [ ] 5.4 Para `ResultScreen`: usar variante de `scale: [0.9, 1]` + `opacity: [0, 1]` sin translate
- [ ] 5.5 Detectar `prefers-reduced-motion` con `useReducedMotion()` de Framer Motion y reducir duración a 0 y translate a 0 cuando está activo

**Relevant requirements:** Requirement 8 (animaciones y transiciones)

---

## Task 6: Ampliar `/api/estimate` para soportar el modo wizard

- [ ] 6.1 Agregar parsing de los nuevos campos del body: `wizardAnswers`, `budgetRange`, `mode`, `chatHistory`
- [ ] 6.2 Implementar el system prompt para `mode === "estimate"` con wizard (paquete + descripción + justificación con referencia a una respuesta + precio orientativo en USD)
- [ ] 6.3 Implementar el system prompt para `mode === "chat"` con contexto de sesión y objetivo de preguntas de profundización
- [ ] 6.4 Mantener el comportamiento existente cuando los campos nuevos no están presentes (backward compatibility)
- [ ] 6.5 Devolver `{ estimate: string }` para `mode === "estimate"` y `{ reply: string }` para `mode === "chat"`

**Relevant requirements:** Requirement 5 (API con contexto completo), Requirement 7 (chat contextualizado AC3)

---

## Task 7: Implementar `ResultScreen`

- [ ] 7.1 Mostrar spinner animado (Framer Motion rotate) mientras `loading === true`
- [ ] 7.2 Mostrar `RecommendationCard` con el texto de `aiRecommendation` cuando está disponible
- [ ] 7.3 Mostrar `SummaryList` con máximo 4 ítems del contexto de sesión (tipo de negocio, necesidad principal, situación/rama, presupuesto)
- [ ] 7.4 Implementar botón "Consultar por WhatsApp" que genere href `https://wa.me/5402920245637?text=...` con mensaje precompletado (máx 300 chars) incluyendo paquete recomendado + 4 ítems del resumen
- [ ] 7.5 Implementar botón "Empezar de nuevo" que despacha la acción `RESET`
- [ ] 7.6 Implementar botón "Volver" que despacha `GO_BACK`
- [ ] 7.7 En estado de error (`aiError !== null`): mostrar mensaje amigable + botón "Reintentar" (deshabilitado si `retryCount >= 1`) + link de contacto por WhatsApp como fallback

**Relevant requirements:** Requirement 6 (pantalla de resultado), Requirement 5 (AC4–AC6)

---

## Task 8: Implementar `ChatOfferBanner` y `AiChat`

- [ ] 8.1 Crear `ChatOfferBanner` con la pregunta "¿Querés continuar con un chat de IA?" y botones "Sí, quiero chatear" / "No, gracias"
- [ ] 8.2 Cuando el usuario acepta, despachar `OPEN_CHAT` e inicializar el chat llamando a `/api/estimate` con `mode: "chat"` y el contexto completo para obtener el mensaje de apertura de la IA
- [ ] 8.3 El mensaje de apertura debe referenciar al menos una respuesta del wizard antes de que el usuario escriba
- [ ] 8.4 Crear `AiChat` con lista de `ChatMessage` renderizados, input `maxLength={500}`, contador de caracteres visible cuando `content.length > 400`
- [ ] 8.5 Send button deshabilitado si input vacío, `chatLoading === true`, o `content.length > 500`
- [ ] 8.6 Auto-scroll al último mensaje con `useRef` + `scrollIntoView({ behavior: "smooth" })` cada vez que `chatMessages` cambia
- [ ] 8.7 En error de chat: mostrar mensaje de error inline + botón "Reenviar"; después de 3 errores consecutivos deshabilitar input y mostrar link de WhatsApp

**Relevant requirements:** Requirement 7 (oferta de chat con IA)

---

## Task 9: Ensamblar `BudgetCalculator` raíz y verificar compatibilidad

- [ ] 9.1 Exportar `export function BudgetCalculator()` (named export, sin props) con `<section id="calculadora" className="py-24 bg-background-secondary">`
- [ ] 9.2 Conectar el reducer con los sub-componentes: `WizardProgress`, `QuestionNode` (fase quiz), `ResultScreen` + `AiChat` (fase result/chat)
- [ ] 9.3 Implementar el fetch a `/api/estimate` con `AbortController` y timeout de 15 segundos; en timeout despachar `SET_AI_ERROR`
- [ ] 9.4 Verificar que la importación en `app/page.tsx` (o donde se use) no requiere cambios
- [ ] 9.5 Probar el flujo completo en desarrollo: Q1→Q2→Q3→Budget→Result→Chat

**Relevant requirements:** Requirement 10 (reemplazo del componente), Requirement 5 (AC4)

---

## Task 10: Validación responsiva y accesibilidad mínima

- [ ] 10.1 Verificar que en viewport de 320px no hay overflow horizontal (usar DevTools o CSS `overflow-x: hidden` check)
- [ ] 10.2 Todos los botones de opciones tienen `min-h-[44px]` para touch targets accesibles
- [ ] 10.3 Botón "Volver" y "Empezar de nuevo" tienen `aria-label` descriptivos
- [ ] 10.4 El input del chat tiene `aria-label="Escribir mensaje"` y el botón de envío tiene `aria-label="Enviar mensaje"`
- [ ] 10.5 `WizardProgress` tiene `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`

**Relevant requirements:** Requirement 9 (diseño responsivo), Requirement 8 (AC4 tokens del proyecto)
