# Requirements Document

## Introduction

El `BudgetCalculator.tsx` existente se reemplaza por un **árbol de decisión inteligente** que actúa como calificador de clientes. En lugar de exponer directamente categorías de proyecto, el componente guía al usuario a través de un cuestionario ramificado de hasta 3 niveles de profundidad. Al completar el cuestionario, la IA (vía la API route `/api/estimate`) recibe el contexto completo y genera una recomendación personalizada de paquete. El usuario puede entonces continuar con un chat de IA que ya tiene el contexto de sus respuestas para afinar la recomendación con preguntas de profundización.

El componente reside en `components/sections/BudgetCalculator.tsx`, usa Next.js 14 App Router, TypeScript, Tailwind CSS con los tokens del proyecto y Framer Motion para las animaciones.

---

## Glossary

- **Wizard**: El componente árbol de decisión que reemplaza a la calculadora de presupuesto existente.
- **Nodo**: Cada pantalla del árbol de decisión que presenta una pregunta con opciones.
- **Rama**: El camino de navegación entre nodos determinado por la respuesta del usuario.
- **Contexto de sesión**: El conjunto de pares pregunta/respuesta acumulados durante el cuestionario.
- **Recomendación**: El paquete sugerido por la IA con su descripción, generado a partir del contexto de sesión.
- **Chat IA**: El chat conversacional embebido que recibe el contexto de sesión como punto de partida.
- **Pregunta oculta**: Dimensión que la IA infiere internamente del contexto de sesión sin mostrarla al usuario como paso separado (urgencia, importancia del diseño, objetivo principal).
- **Paquete**: Una de las opciones de servicio de Rumbo Digital Studio (e.g., "Web básica", "Ecommerce profesional", "Desarrollo personalizado").
- **API_Route**: La ruta Next.js `/api/estimate` que conecta con el modelo de lenguaje Groq/Qwen.
- **Progress_Bar**: El indicador visual de avance dentro del Wizard.

---

## Requirements

### Requirement 1: Árbol de decisión ramificado

**User Story:** Como cliente potencial, quiero responder preguntas sobre mi negocio en lugar de elegir categorías técnicas, para que el sistema me guíe hacia el paquete más adecuado sin que yo necesite conocer terminología web.

#### Acceptance Criteria

1. THE Wizard SHALL presentar la Pregunta 1 ("¿Qué tipo de negocio tenés?") como primer nodo al cargar el componente.
2. WHEN el usuario selecciona una opción en la Pregunta 1, THE Wizard SHALL navegar al nodo de Pregunta 2 correspondiente a esa rama (2A, 2B, 2C o 2D), sin mostrar las demás ramas.
3. WHEN el usuario selecciona una opción en la Pregunta 2, THE Wizard SHALL navegar al nodo de Pregunta 3 correspondiente a esa sub-rama (3A–3H).
4. WHEN el usuario selecciona la opción de presupuesto en la pregunta final, THE Wizard SHALL registrar la selección en el contexto de sesión y pasar a la pantalla de resultado.
5. THE Wizard SHALL mantener en el contexto de sesión todas las respuestas del usuario, incluyendo el texto de la pregunta, la etiqueta de la opción elegida y el identificador de nodo en cada paso.
6. IF el Wizard no puede determinar el siguiente nodo a partir de la respuesta seleccionada, THEN THE Wizard SHALL mostrar el nodo de la pregunta de presupuesto como fallback final.

---

### Requirement 2: Pregunta final de presupuesto

**User Story:** Como cliente potencial, quiero indicar mi rango de presupuesto disponible, para que la recomendación final contemple mis posibilidades económicas.

#### Acceptance Criteria

1. WHEN el usuario llega al nodo de presupuesto, THE Wizard SHALL mostrar cuatro opciones de rango: "Menos de USD 150", "USD 150–300", "USD 300–700" y "Más de USD 700".
2. THE Wizard SHALL asociar cada rango de presupuesto con una orientación de paquete: "Menos de USD 150" → Página básica; "USD 150–300" → Página empresarial; "USD 300–700" → Página premium / ecommerce; "Más de USD 700" → Desarrollo personalizado.
3. THE Wizard SHALL incluir la selección de presupuesto en el contexto de sesión enviado a la API_Route.

---

### Requirement 3: Progress Bar

**User Story:** Como cliente potencial, quiero ver mi progreso en el cuestionario, para saber cuántos pasos me faltan y sentirme orientado.

#### Acceptance Criteria

1. THE Progress_Bar SHALL mostrar el paso actual y el total de pasos restimados en la rama activa.
2. WHEN el usuario avanza al siguiente nodo, THE Progress_Bar SHALL actualizarse para reflejar el nuevo paso actual.
3. WHEN el usuario se encuentra en la pantalla de resultado, THE Progress_Bar SHALL indicar el estado de completado (100%).

---

### Requirement 4: Navegación hacia atrás

**User Story:** Como cliente potencial, quiero poder retroceder al paso anterior, para corregir una respuesta sin reiniciar todo el cuestionario.

#### Acceptance Criteria

1. WHEN el usuario se encuentra en cualquier nodo posterior al primero, THE Wizard SHALL mostrar un botón "Volver".
2. WHEN el usuario pulsa "Volver", THE Wizard SHALL retroceder al nodo inmediatamente anterior y restaurar la respuesta que había seleccionado en ese nodo.
3. WHEN el usuario se encuentra en la pantalla de resultado, THE Wizard SHALL mostrar el botón "Volver" que lo lleva al último nodo del cuestionario.
4. IF el usuario retrocede y cambia su respuesta, THEN THE Wizard SHALL descartar las respuestas registradas en los nodos posteriores al nodo editado.

---

### Requirement 5: Llamada a la API de estimación con contexto completo

**User Story:** Como cliente potencial, quiero recibir una recomendación de paquete generada por IA, para obtener una sugerencia personalizada basada en mis respuestas específicas.

#### Acceptance Criteria

1. WHEN el usuario completa el cuestionario, THE Wizard SHALL enviar al endpoint `/api/estimate` (POST) un payload que incluya el contexto de sesión completo: cada pregunta con su respuesta, el rango de presupuesto y la rama recorrida.
2. THE API_Route SHALL generar una Recomendación que incluya: nombre del paquete sugerido, descripción breve del paquete, justificación basada en las respuestas del usuario e indicación de precio orientativo acorde al rango de presupuesto elegido.
3. THE API_Route SHALL inferir internamente las tres preguntas ocultas (urgencia, importancia del diseño y objetivo principal) a partir del contexto de sesión sin requerirlas explícitamente al usuario.
4. IF la llamada a la API_Route falla o tarda más de 15 segundos, THEN THE Wizard SHALL mostrar un mensaje de error amigable con la opción de reintentar.
5. WHILE la respuesta de la API_Route está pendiente, THE Wizard SHALL mostrar un estado de carga animado en la pantalla de resultado.

---

### Requirement 6: Pantalla de resultado con recomendación

**User Story:** Como cliente potencial, quiero ver una recomendación clara del paquete que necesito, para decidir si quiero continuar con la agencia.

#### Acceptance Criteria

1. WHEN la API_Route devuelve la Recomendación, THE Wizard SHALL mostrar la pantalla de resultado con: nombre del paquete recomendado, descripción del paquete, justificación personalizada basada en las respuestas y precio orientativo.
2. THE Wizard SHALL mostrar en la pantalla de resultado un resumen de las respuestas del usuario (máximo 4 ítems clave: tipo de negocio, necesidad principal, situación actual y presupuesto).
3. THE Wizard SHALL mostrar en la pantalla de resultado un botón "Consultar por WhatsApp" que genere un mensaje precompletado con el resumen de las respuestas y el paquete recomendado.
4. THE Wizard SHALL mostrar en la pantalla de resultado un botón "Empezar de nuevo" que reinicia el Wizard al estado inicial.

---

### Requirement 7: Oferta de chat con IA contextualizado

**User Story:** Como cliente potencial, quiero poder continuar con un chat de IA que ya conoce mis respuestas, para afinar la recomendación y resolver dudas sin repetir información.

#### Acceptance Criteria

1. WHEN la pantalla de resultado se muestra, THE Wizard SHALL presentar la pregunta "¿Querés continuar con un chat de IA que ya tiene el contexto de tus respuestas?" con opciones "Sí, quiero chatear" y "No, gracias".
2. WHEN el usuario selecciona "Sí, quiero chatear", THE Wizard SHALL mostrar el Chat_IA embebido en el mismo componente con el contexto de sesión ya cargado como mensaje de sistema.
3. WHEN el Chat_IA se inicializa, THE Wizard SHALL enviar a la API_Route el contexto de sesión más un indicador de modo chat, de forma que la IA formule las preguntas ocultas de profundización al usuario.
4. THE Chat_IA SHALL permitir al usuario enviar mensajes de texto de hasta 500 caracteres.
5. WHEN el usuario envía un mensaje en el Chat_IA, THE Wizard SHALL mostrar un indicador de carga mientras espera la respuesta de la API_Route.
6. IF la llamada al Chat_IA falla, THEN THE Wizard SHALL mostrar el mensaje de error inline y permitir al usuario reenviar el último mensaje.
7. WHEN el usuario selecciona "No, gracias", THE Wizard SHALL mantener la pantalla de resultado sin mostrar el Chat_IA.

---

### Requirement 8: Animaciones y transiciones

**User Story:** Como cliente potencial, quiero que el cuestionario tenga transiciones fluidas entre pasos, para que la experiencia se sienta pulida y profesional.

#### Acceptance Criteria

1. WHEN el Wizard transiciona de un nodo al siguiente, THE Wizard SHALL animar la salida del nodo actual (deslizamiento hacia la izquierda + fade out) y la entrada del nuevo nodo (deslizamiento desde la derecha + fade in) usando Framer Motion.
2. WHEN el usuario retrocede a un nodo anterior, THE Wizard SHALL invertir las direcciones de animación (salida hacia la derecha, entrada desde la izquierda).
3. WHEN la pantalla de resultado aparece, THE Wizard SHALL animar su entrada con un efecto de scale-in + fade-in.
4. THE Wizard SHALL respetar el sistema de diseño oscuro del proyecto usando exclusivamente los tokens de color definidos en `tailwind.config.ts` (bg-primary-600, text-foreground-muted, border-white/10, etc.).

---

### Requirement 9: Diseño responsivo

**User Story:** Como cliente potencial que navega desde el celular, quiero que el cuestionario se vea correctamente en pantallas pequeñas, para poder completarlo sin problemas en cualquier dispositivo.

#### Acceptance Criteria

1. THE Wizard SHALL renderizar los botones de opciones en una columna única en pantallas menores a 640px (breakpoint `sm` de Tailwind).
2. THE Wizard SHALL renderizar los botones de opciones en una grilla de dos columnas en pantallas de 640px o más, excepto cuando las opciones tienen descripciones largas.
3. THE Wizard SHALL ser completamente funcional (navegación, scroll, chat) en viewport de 320px de ancho mínimo.

---

### Requirement 10: Reemplazo del componente existente

**User Story:** Como desarrollador, quiero que el nuevo Wizard reemplace exactamente al `BudgetCalculator.tsx` existente, para no romper las importaciones ni el layout de la página principal.

#### Acceptance Criteria

1. THE Wizard SHALL exportar la función `BudgetCalculator` con la misma firma que el componente existente (sin props requeridas).
2. THE Wizard SHALL incluir el atributo `id="calculadora"` en el elemento `<section>` raíz para mantener la compatibilidad con los anchor links existentes.
3. THE Wizard SHALL mantener la misma clase base de la sección (`py-24 bg-background-secondary`) para no alterar el espaciado del layout.
