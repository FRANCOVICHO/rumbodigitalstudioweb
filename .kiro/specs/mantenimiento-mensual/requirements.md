# Documento de Requisitos

## Introducción

Se requiere diseñar e implementar la sección **"Mantenimiento Mensual"** para el sitio web de Rumbo Digital Studio. Esta sección tiene como objetivo persuadir a los visitantes de contratar un plan de mantenimiento web recurrente, transmitiendo tranquilidad, profesionalismo y disponibilidad continua del equipo. La sección se integrará como componente `MaintenanceSection` en `components/sections/MaintenanceSection.tsx` y se insertará en la página principal entre `PlansSection` y `BudgetCalculator`, respetando íntegramente el design system existente del proyecto (fondo oscuro, glassmorphism, colores primarios azules, animaciones Framer Motion).

---

## Glosario

- **MaintenanceSection**: El componente React cliente que implementa toda la sección "Mantenimiento Mensual".
- **Plan_Básico**: El plan de mantenimiento mensual de menor precio ($7.900/mes).
- **Plan_Avanzado**: El plan de mantenimiento mensual de mayor precio ($24.900/mes), destacado visualmente como el más elegido.
- **Comparador**: Subcomponente visual que contrasta "Sin mantenimiento" versus "Con mantenimiento".
- **WhatsApp_Demo**: Subcomponente que simula una conversación de WhatsApp entre un cliente y Rumbo Digital Studio.
- **Stats_Grid**: Conjunto de cuatro tarjetas estadísticas animadas que resumen los beneficios clave del servicio.
- **CTA_Final**: Bloque de llamado a la acción al pie de la sección con dos botones de conversión.
- **Design_System**: El conjunto de tokens de diseño definidos en `tailwind.config.ts` del proyecto (colores, sombras, animaciones, glassmorphism).
- **Framer_Motion**: Librería de animaciones React utilizada en todo el proyecto.
- **whileInView**: Variante de animación de Framer Motion que se activa cuando el elemento entra en el viewport.
- **stagger**: Técnica de animación donde los hijos de un contenedor aparecen secuencialmente con un retardo incremental.

---

## Requisitos

### Requisito 1: Encabezado de Sección

**User Story:** Como visitante del sitio, quiero ver un encabezado claro y atractivo al inicio de la sección de mantenimiento, para entender de inmediato de qué trata el servicio y sentirme atraído a seguir leyendo.

#### Criterios de Aceptación

1. THE MaintenanceSection SHALL renderizar un título con el texto exacto "Mantenimiento mensual" aplicando el gradiente `bg-gradient-primary bg-clip-text text-transparent` del Design_System.
2. THE MaintenanceSection SHALL renderizar el subtítulo exacto: "Tu página web no termina cuando la publicamos. Con nuestros planes mantenemos tu sitio seguro, actualizado y listo para acompañar el crecimiento de tu negocio."
3. THE MaintenanceSection SHALL mostrar un conjunto de íconos de Lucide React (Server, Cloud, Shield, Settings, Activity) como ilustración decorativa relacionada al soporte técnico.
4. WHEN el encabezado entra en el viewport durante el scroll, THE MaintenanceSection SHALL animar el título y subtítulo con `initial={{ opacity: 0, y: 20 }}` y `whileInView={{ opacity: 1, y: 0 }}` usando `viewport={{ once: true }}`.

---

### Requisito 2: Tarjetas de Planes de Mantenimiento

**User Story:** Como visitante interesado en contratar mantenimiento, quiero ver los dos planes disponibles con sus precios y beneficios de forma clara, para poder compararlos y tomar una decisión informada.

#### Criterios de Aceptación

1. THE MaintenanceSection SHALL renderizar exactamente dos tarjetas: Plan_Básico a $7.900/mes y Plan_Avanzado a $24.900/mes, con los datos hardcodeados en el componente.
2. THE MaintenanceSection SHALL mostrar en la tarjeta del Plan_Básico la descripción: "Ideal para quienes solo quieren mantener su sitio funcionando sin preocupaciones." y la lista completa de 9 beneficios: Hosting incluido, Dominio incluido, Certificado SSL, Copias de seguridad automáticas, Monitoreo del sitio, Corrección de errores, Soporte por WhatsApp, Hasta 2 cambios pequeños por mes, Tiempo de respuesta estándar.
3. THE MaintenanceSection SHALL mostrar en la tarjeta del Plan_Avanzado la descripción: "Ideal para negocios que actualizan constantemente su página y quieren olvidarse completamente de la parte técnica." y la lista completa de beneficios que incluye todo lo del Plan_Básico más: Cambios de contenido prácticamente ilimitados, Nuevas secciones simples, Prioridad en soporte, Optimización continua, Ajustes de diseño, Revisión mensual del sitio, Recomendaciones para mejorar conversión, Atención rápida por WhatsApp.
4. THE MaintenanceSection SHALL aplicar al Plan_Avanzado un badge con el texto "⭐ Más elegido", borde brillante `border-primary-500`, `shadow-glow-lg` y escala visual mayor para destacarlo respecto del Plan_Básico, siguiendo el mismo patrón visual de `PlansSection` para planes `highlighted`.
5. THE MaintenanceSection SHALL renderizar en la tarjeta del Plan_Básico un botón CTA con el texto "Contratar" que al hacer clic abra WhatsApp o redirija a `#contacto`.
6. THE MaintenanceSection SHALL renderizar en la tarjeta del Plan_Avanzado un botón CTA con el texto "Quiero este plan" que al hacer clic abra WhatsApp o redirija a `#contacto`.
7. WHEN las tarjetas entran en el viewport, THE MaintenanceSection SHALL animarlas con efecto stagger usando `transition={{ delay: index * 0.15 }}` con `initial={{ opacity: 0, y: 20 }}` y `whileInView={{ opacity: 1, y: 0 }}`.
8. WHEN el cursor está sobre una tarjeta, THE MaintenanceSection SHALL aplicar un efecto hover usando `whileHover={{ y: -4 }}` de Framer_Motion.

---

### Requisito 3: Comparador "Sin mantenimiento vs Con mantenimiento"

**User Story:** Como visitante indeciso, quiero ver una comparación directa entre no tener mantenimiento y tenerlo, para entender de forma inmediata el valor del servicio.

#### Criterios de Aceptación

1. THE MaintenanceSection SHALL renderizar el Comparador con dos columnas: "Sin mantenimiento" y "Con mantenimiento".
2. THE MaintenanceSection SHALL mostrar en la columna "Sin mantenimiento" exactamente los siguientes 4 ítems precedidos del ícono ❌: "Si querés cambiar un horario tenés que pedir un presupuesto", "Si cambia un precio hay que solicitar una modificación", "Si aparece un error nadie lo controla", "Tu página queda desactualizada".
3. THE MaintenanceSection SHALL mostrar en la columna "Con mantenimiento" exactamente los siguientes 4 ítems precedidos del ícono ✅: "Nos escribís por WhatsApp", "Nosotros realizamos el cambio", "Tu sitio siempre actualizado", "Soporte continuo".
4. WHEN el Comparador entra en el viewport, THE MaintenanceSection SHALL animarlo con `initial={{ opacity: 0, x: -20 }}` / `{ opacity: 0, x: 20 }` para la columna izquierda y derecha respectivamente, y `whileInView={{ opacity: 1, x: 0 }}` con `viewport={{ once: true }}`.

---

### Requisito 4: Demo de Conversación WhatsApp

**User Story:** Como visitante que no entiende bien cómo funciona el servicio, quiero ver un ejemplo concreto de interacción, para visualizar la simplicidad y rapidez del soporte.

#### Criterios de Aceptación

1. THE MaintenanceSection SHALL renderizar un bloque con el título "¿Cómo funciona?" seguido de la WhatsApp_Demo.
2. THE MaintenanceSection SHALL mostrar en la WhatsApp_Demo una conversación con al menos dos burbujas de mensaje: una del cliente con el texto exacto "Hola, mañana lanzamos una promoción del 20%. ¿Podés agregar un banner en la página?" y una respuesta de Rumbo Digital Studio con el texto exacto "¡Listo! Ya está publicado. Mucha suerte con la promoción."
3. THE MaintenanceSection SHALL diferenciar visualmente la burbuja del cliente (alineada a la izquierda, fondo oscuro) de la burbuja de Rumbo Digital Studio (alineada a la derecha, fondo con acento de color `primary`), aplicando glassmorphism consistente con el Design_System.
4. THE MaintenanceSection SHALL mostrar debajo de la WhatsApp_Demo el texto exacto: "Así de simple. Vos te ocupás de tu negocio, nosotros nos ocupamos de tu página."
5. WHEN la WhatsApp_Demo entra en el viewport, THE MaintenanceSection SHALL animar las burbujas con efecto stagger secuencial usando `viewport={{ once: true }}`.

---

### Requisito 5: Grid de Estadísticas

**User Story:** Como visitante que evalúa el servicio, quiero ver estadísticas o beneficios clave resumidos visualmente, para reforzar mi confianza en el servicio de mantenimiento.

#### Criterios de Aceptación

1. THE MaintenanceSection SHALL renderizar el Stats_Grid con exactamente 4 tarjetas que contengan: "⚡ Respuesta rápida", "🛠 Soporte continuo", "🔒 Sitio seguro", "🌐 Monitoreo permanente".
2. THE MaintenanceSection SHALL aplicar a cada tarjeta del Stats_Grid glassmorphism con `bg-background-card`, `border border-border` y `backdrop-blur` del Design_System.
3. WHEN las tarjetas del Stats_Grid entran en el viewport, THE MaintenanceSection SHALL animarlas con efecto stagger usando `transition={{ delay: index * 0.1 }}`.
4. WHEN el cursor está sobre una tarjeta del Stats_Grid, THE MaintenanceSection SHALL aplicar `whileHover={{ scale: 1.05 }}` de Framer_Motion.

---

### Requisito 6: Llamado a la Acción Final

**User Story:** Como visitante convencido del valor del servicio, quiero encontrar un CTA claro al final de la sección, para poder tomar acción inmediata de contratación o consulta.

#### Criterios de Aceptación

1. THE MaintenanceSection SHALL renderizar el CTA_Final con el título exacto "Tu negocio cambia todos los días." y el subtítulo exacto "Tu página web también debería poder hacerlo."
2. THE MaintenanceSection SHALL renderizar un botón principal con el texto "Quiero olvidarme de la parte técnica" con estilo `bg-primary-600 hover:bg-primary-700 shadow-glow` que al hacer clic abra WhatsApp o redirija a `#contacto`.
3. THE MaintenanceSection SHALL renderizar un botón secundario con el texto "Consultar planes" con estilo `bg-glass border border-border` que al hacer clic redirija a `#contacto` o a la sección de planes de mantenimiento de la misma página.
4. WHEN el CTA_Final entra en el viewport, THE MaintenanceSection SHALL animarlo con `initial={{ opacity: 0, y: 20 }}` y `whileInView={{ opacity: 1, y: 0 }}` con `viewport={{ once: true }}`.

---

### Requisito 7: Integración en la Página Principal

**User Story:** Como desarrollador que integra la sección, quiero que el componente se integre correctamente en la página principal sin romper el flujo existente, para que los visitantes lo vean en el lugar correcto dentro del recorrido de la página.

#### Criterios de Aceptación

1. THE MaintenanceSection SHALL ser un componente React con la directiva `"use client"` al inicio del archivo, ubicado en `components/sections/MaintenanceSection.tsx`.
2. THE MaintenanceSection SHALL ser importado y renderizado en `app/page.tsx` en la posición exacta: después de `<PlansSection>` y antes de `<BudgetCalculator>`.
3. THE MaintenanceSection SHALL asignar el atributo `id="mantenimiento"` al elemento `<section>` raíz para permitir el anclaje de navegación.
4. THE MaintenanceSection SHALL utilizar exclusivamente las clases del Design_System definidas en `tailwind.config.ts` (ej: `bg-background`, `bg-background-card`, `border-border`, `text-foreground-muted`, `shadow-glow`, `bg-gradient-primary`, `bg-glass`) sin introducir valores de color inline arbitrarios.
5. THE MaintenanceSection SHALL usar exclusivamente íconos de `lucide-react` para todos los elementos decorativos e icónicos de la sección.

---

### Requisito 8: Coherencia Visual con el Design System

**User Story:** Como usuario que navega el sitio, quiero que la sección de mantenimiento se vea visualmente coherente con el resto del sitio, para tener una experiencia consistente y profesional.

#### Criterios de Aceptación

1. THE MaintenanceSection SHALL usar el color de fondo `bg-background` (#000000) para la sección principal, consistente con todas las demás secciones del sitio.
2. THE MaintenanceSection SHALL aplicar glassmorphism usando `bg-background-card` con `border border-border` y `backdrop-blur` en todas las tarjetas, igual que en `PlansSection`.
3. THE MaintenanceSection SHALL usar únicamente los tonos de azul definidos en el Design_System (`primary-600` #3d52e6, `secondary-500` #6386fa, `accent` #4A90E2) como colores de acento, sin introducir tonos violeta u otros colores fuera del Design_System.
4. IF el ancho del viewport es menor a 768px (breakpoint `md`), THEN THE MaintenanceSection SHALL colapsar el layout de tarjetas de planes y el Comparador a una sola columna para garantizar usabilidad en dispositivos móviles.
5. THE MaintenanceSection SHALL aplicar los efectos de blob animados (`animate-blob`, `animate-blob-slow`) como decoración de fondo para consistencia visual con `HeroSection` y otras secciones existentes.
