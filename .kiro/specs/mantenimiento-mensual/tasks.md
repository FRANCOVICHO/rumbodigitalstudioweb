# Implementation Plan: Mantenimiento Mensual

## Overview

Implementar el componente `MaintenanceSection` en TypeScript + React para el sitio de Rumbo Digital Studio, insertarlo en `app/page.tsx` entre `PlansSection` y `BudgetCalculator`, y cubrir sus propiedades de corrección con tests en Vitest + @testing-library/react + fast-check.

## Tasks

- [x] 1. Configurar el entorno de testing
  - Instalar dependencias de testing: `vitest`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `fast-check`, `jsdom`
  - Crear `vitest.config.ts` en la raíz con soporte para JSX, environment `jsdom`, y globals habilitados
  - Crear `vitest.setup.ts` que importe `@testing-library/jest-dom`
  - Agregar script `"test": "vitest --run"` al `package.json`
  - _Requisitos: 2.2, 2.3, 3.2, 3.3, 4.3, 5.1, 5.2, 8.4_

- [x] 2. Definir interfaces TypeScript y constantes de datos
  - [x] 2.1 Crear interfaces `MaintenancePlan` y `WhatsAppMessage` en `components/sections/MaintenanceSection.tsx`
    - Definir `MaintenancePlan` con campos: `id`, `name`, `price`, `period`, `currency`, `description`, `highlighted`, `badge`, `ctaLabel`, `features`
    - Definir `WhatsAppMessage` con campo `sender: "client" | "studio"` y `text`
    - _Requisitos: 2.1, 2.2, 2.3, 4.2_

  - [x] 2.2 Declarar las constantes de datos `MAINTENANCE_PLANS`, `COMPARATOR_WITHOUT`, `COMPARATOR_WITH`, `STATS`, `WHATSAPP_MESSAGES` en el mismo archivo
    - `MAINTENANCE_PLANS`: dos planes con todos los campos según diseño (precios, descripciones, listas de beneficios, badge, ctaLabel)
    - `COMPARATOR_WITHOUT`: 4 ítems exactos según Req 3.2
    - `COMPARATOR_WITH`: 4 ítems exactos según Req 3.3
    - `STATS`: 4 ítems según Req 5.1
    - `WHATSAPP_MESSAGES`: 2 mensajes con textos exactos según Req 4.2
    - _Requisitos: 2.2, 2.3, 3.2, 3.3, 4.2, 5.1_

- [x] 3. Implementar el bloque de encabezado de sección
  - [x] 3.1 Crear el esqueleto del componente `MaintenanceSection` con directiva `"use client"` y elemento `<section id="mantenimiento" className="py-24 bg-background">`
    - Incluir contenedor principal `<div className="container mx-auto px-6">`
    - Añadir blobs decorativos de fondo con clases `animate-blob` y `animate-blob-slow` (igual que `HeroSection`)
    - _Requisitos: 7.1, 7.3, 8.1, 8.5_

  - [x] 3.2 Implementar el encabezado animado con título, subtítulo e íconos decorativos
    - Usar `motion.div` con `initial={{ opacity: 0, y: 20 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true }}`
    - Renderizar título "Mantenimiento mensual" con `bg-gradient-primary bg-clip-text text-transparent`
    - Renderizar subtítulo exacto del Req 1.2
    - Renderizar íconos de Lucide: `Server`, `Cloud`, `Shield`, `Settings`, `Activity` con `aria-hidden="true"`
    - _Requisitos: 1.1, 1.2, 1.3, 1.4, 7.4, 7.5_

- [x] 4. Implementar las tarjetas de planes de mantenimiento
  - [x] 4.1 Implementar el grid de tarjetas de planes con stagger y hover
    - Crear contenedor `<div data-testid="plans-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8 ...">` 
    - Mapear `MAINTENANCE_PLANS` usando `motion.div` con `initial={{ opacity: 0, y: 20 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `transition={{ delay: index * 0.15 }}`, `whileHover={{ y: -4 }}`
    - Aplicar a cada tarjeta `bg-background-card border border-border` (glassmorphism), y al plan destacado `border-primary-500 shadow-glow-lg scale-105 bg-primary-600/10`
    - Seguir el patrón visual exacto de `PlansSection.tsx`
    - _Requisitos: 2.1, 2.4, 2.7, 2.8, 8.2, 8.4_

  - [x] 4.2 Renderizar contenido de cada tarjeta: badge, nombre, precio, descripción y lista de beneficios
    - Badge absoluto `-top-4 left-1/2 -translate-x-1/2` con texto "⭐ Más elegido" para Plan Avanzado
    - Precio formateado con `formatPrice` de `@/lib/utils`
    - Lista de `features` con ícono `Check` de Lucide, incluyendo los 9 beneficios del Plan Básico y 15 del Plan Avanzado
    - _Requisitos: 2.2, 2.3, 2.4_

  - [x] 4.3 Renderizar botones CTA de cada tarjeta
    - Plan Básico: botón/enlace "Contratar" con estilo secundario (`bg-glass border border-border`) apuntando a WhatsApp o `#contacto`
    - Plan Avanzado: botón/enlace "Quiero este plan" con estilo primario (`bg-primary-600 hover:bg-primary-700 shadow-glow`) apuntando a WhatsApp o `#contacto`
    - Usar patrón de href de WhatsApp del diseño: `https://wa.me/5402920245637?text=<mensaje_codificado>`
    - _Requisitos: 2.5, 2.6_

  - [ ]* 4.4 Escribir property test — Propiedad 1: Completitud de características de los planes
    - **Propiedad 1: Plan features completeness**
    - Usar `fc.constantFrom(...MAINTENANCE_PLANS)` y `fc.nat()` para iterar sobre cada feature de cada plan
    - Verificar que `getByText(feature)` retorna un elemento en el componente renderizado
    - **Valida: Requisitos 2.2, 2.3**

  - [ ]* 4.5 Escribir tests de ejemplo para las tarjetas de planes
    - Verificar que exactamente 2 tarjetas son renderizadas (Req 2.1)
    - Verificar que el Plan Avanzado tiene el badge "⭐ Más elegido" y la clase `border-primary-500` (Req 2.4)
    - Verificar texto del botón CTA del Plan Básico "Contratar" (Req 2.5)
    - Verificar texto del botón CTA del Plan Avanzado "Quiero este plan" (Req 2.6)
    - _Requisitos: 2.1, 2.4, 2.5, 2.6_

- [x] 5. Implementar el comparador "Sin mantenimiento vs Con mantenimiento"
  - [x] 5.1 Implementar el bloque comparador con dos columnas animadas
    - Columna izquierda "Sin mantenimiento": `motion.div` con `initial={{ opacity: 0, x: -20 }}`, `whileInView={{ opacity: 1, x: 0 }}`, `viewport={{ once: true }}`
    - Columna derecha "Con mantenimiento": `motion.div` con `initial={{ opacity: 0, x: 20 }}`, `whileInView={{ opacity: 1, x: 0 }}`, `viewport={{ once: true }}`
    - Contenedor con `className="grid grid-cols-1 md:grid-cols-2 gap-8"`
    - Mapear `COMPARATOR_WITHOUT` (con ❌) y `COMPARATOR_WITH` (con ✅) con los ítems exactos
    - Aplicar glassmorphism (`bg-background-card border border-border`) a cada columna
    - _Requisitos: 3.1, 3.2, 3.3, 3.4, 8.4_

  - [ ]* 5.2 Escribir property test — Propiedad 2: Completitud de ítems del comparador
    - **Propiedad 2: Comparator items completeness**
    - Usar `fc.constantFrom` sobre la unión de `COMPARATOR_WITHOUT` y `COMPARATOR_WITH`
    - Verificar que cada texto aparece en el HTML renderizado con `getByText`
    - **Valida: Requisitos 3.2, 3.3**

  - [ ]* 5.3 Escribir tests de ejemplo para el comparador
    - Verificar que los encabezados "Sin mantenimiento" y "Con mantenimiento" están presentes (Req 3.1)
    - _Requisitos: 3.1_

- [x] 6. Implementar la demo de conversación WhatsApp
  - [x] 6.1 Implementar el bloque WhatsApp Demo con burbujas animadas y datos de atributos de accesibilidad
    - Título "¿Cómo funciona?" (Req 4.1)
    - Contenedor de mensajes que mapea `WHATSAPP_MESSAGES` con efecto stagger secuencial y `viewport={{ once: true }}`
    - Burbuja de cliente (`sender === "client"`): `data-testid="whatsapp-bubble"`, `self-start`, fondo oscuro, `role="article"`, `aria-label` descriptivo
    - Burbuja del studio (`sender === "studio"`): `data-testid="whatsapp-bubble"`, `self-end`, fondo con acento `primary`, `role="article"`, `aria-label` descriptivo
    - Glassmorphism consistente con el Design System
    - Texto de cierre exacto: "Así de simple. Vos te ocupás de tu negocio, nosotros nos ocupamos de tu página." (Req 4.4)
    - _Requisitos: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 6.2 Escribir property test — Propiedad 3: Alineación de burbujas WhatsApp según remitente
    - **Propiedad 3: WhatsApp bubble alignment**
    - Usar `fc.constantFrom(...WHATSAPP_MESSAGES)` para iterar sobre los mensajes
    - Obtener el elemento con `data-testid="whatsapp-bubble"` más cercano y verificar clase `self-start` (cliente) o `self-end` (studio)
    - **Valida: Requisito 4.3**

  - [ ]* 6.3 Escribir tests de ejemplo para la WhatsApp Demo
    - Verificar presencia del título "¿Cómo funciona?" (Req 4.1)
    - Verificar texto exacto de ambas burbujas (Req 4.2)
    - Verificar texto de cierre exacto (Req 4.4)
    - _Requisitos: 4.1, 4.2, 4.4_

- [x] 7. Implementar el Stats Grid
  - [x] 7.1 Implementar las cuatro tarjetas de estadísticas con glassmorphism, stagger y hover
    - Contenedor en grid de 2 o 4 columnas según viewport
    - Mapear `STATS` usando `motion.div` con `transition={{ delay: index * 0.1 }}`, `whileHover={{ scale: 1.05 }}`
    - Cada tarjeta con `data-testid="stat-card"`, clases `bg-background-card border border-border backdrop-blur`
    - _Requisitos: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 7.2 Escribir property test — Propiedad 4: Renderizado completo del Stats Grid con glassmorphism
    - **Propiedad 4: Stats grid completeness and glassmorphism**
    - Usar `fc.constantFrom(...STATS)` para iterar sobre cada stat
    - Obtener el elemento con `data-testid="stat-card"` más cercano al texto y verificar clases `bg-background-card` y `border`
    - **Valida: Requisitos 5.1, 5.2**

- [x] 8. Implementar el CTA Final
  - [x] 8.1 Implementar el bloque CTA Final animado con título, subtítulo y dos botones
    - Usar `motion.div` con `initial={{ opacity: 0, y: 20 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true }}`
    - Título exacto: "Tu negocio cambia todos los días." (Req 6.1)
    - Subtítulo exacto: "Tu página web también debería poder hacerlo." (Req 6.1)
    - Botón principal "Quiero olvidarme de la parte técnica" con `bg-primary-600 hover:bg-primary-700 shadow-glow` apuntando a WhatsApp o `#contacto`
    - Botón secundario "Consultar planes" con `bg-glass border border-border` apuntando a `#contacto` o `#mantenimiento`
    - _Requisitos: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 8.2 Escribir tests de ejemplo para el CTA Final
    - Verificar título y subtítulo exactos (Req 6.1)
    - Verificar texto y clases del botón principal (Req 6.2)
    - Verificar texto y clases del botón secundario (Req 6.3)
    - _Requisitos: 6.1, 6.2, 6.3_

- [x] 9. Checkpoint — Verificar integridad visual del componente
  - Asegurarse de que todos los tests pasan, preguntar al usuario si surgen dudas.

- [x] 10. Integrar `MaintenanceSection` en `app/page.tsx`
  - [x] 10.1 Agregar la importación de `MaintenanceSection` en `app/page.tsx`
    - Añadir `import { MaintenanceSection } from "@/components/sections/MaintenanceSection";` junto a las demás importaciones
    - _Requisitos: 7.2_

  - [x] 10.2 Insertar `<MaintenanceSection />` entre `<PlansSection>` y `<BudgetCalculator>` en el JSX de `app/page.tsx`
    - Posición exacta: después de `<PlansSection plans={plans} />` y antes de `<BudgetCalculator />`
    - _Requisitos: 7.2_

  - [ ]* 10.3 Escribir property test — Propiedad 5: Layout responsivo de una sola columna en mobile
    - **Propiedad 5: Responsive single-column layout on mobile**
    - Usar `fc.constant(null)` e inspeccionar `container.querySelector("[data-testid='plans-grid']")`
    - Verificar que `className` incluye `grid-cols-1` como clase base (mobile-first)
    - **Valida: Requisito 8.4**

  - [ ]* 10.4 Escribir tests de ejemplo para integración y estructura
    - Verificar que el elemento `<section>` raíz tiene `id="mantenimiento"` (Req 7.3)
    - Verificar que el elemento `<section>` raíz tiene la clase `bg-background` (Req 8.1)
    - Verificar que los blobs decorativos tienen la clase `animate-blob` (Req 8.5)
    - _Requisitos: 7.3, 8.1, 8.5_

- [x] 11. Checkpoint Final — Asegurarse de que todos los tests pasan
  - Ejecutar `npm test` y verificar que los 23 tests (18 de ejemplo + 5 de propiedad) pasan sin errores.
  - Asegurarse de que `next build` compila sin errores de TypeScript.
  - Preguntar al usuario si surgen dudas.

## Notes

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido.
- Cada tarea referencia requisitos específicos para trazabilidad.
- Los tests de propiedad usan fast-check con mínimo 100 iteraciones (default).
- Los tests de ejemplo validan comportamientos concretos únicos que no varían con el input.
- El componente es completamente estático (sin fetch), lo que simplifica el testing.
- Seguir estrictamente los patrones visuales de `PlansSection.tsx` para coherencia.
- Usar `formatPrice` de `@/lib/utils` para mostrar precios con formato consistente (`$7.900`).
- El proyecto no tiene configuración de Vitest: la tarea 1 crea todo desde cero.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1", "2.1"] },
    { "id": 1, "tasks": ["2.2", "3.1"] },
    { "id": 2, "tasks": ["3.2"] },
    { "id": 3, "tasks": ["4.1", "5.1", "6.1", "7.1", "8.1"] },
    { "id": 4, "tasks": ["4.2", "4.3"] },
    { "id": 5, "tasks": ["4.4", "4.5", "5.2", "5.3", "6.2", "6.3", "7.2", "8.2"] },
    { "id": 6, "tasks": ["10.1"] },
    { "id": 7, "tasks": ["10.2"] },
    { "id": 8, "tasks": ["10.3", "10.4"] }
  ]
}
```
