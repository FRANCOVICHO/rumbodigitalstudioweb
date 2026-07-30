# Requirements Document

## Introduction

Rumbo Digital Studio es una plataforma web premium para una agencia de desarrollo digital. El sistema combina una landing page de una sola página con secciones animadas, un panel de administración CMS completo, autenticación JWT con roles, y conexión a un backend PocketBase alojado externamente. El stack es Next.js 14 App Router + TypeScript + Tailwind CSS + Framer Motion + PocketBase.

Este documento de requisitos se deriva del diseño técnico aprobado y cubre todos los módulos del sistema: landing page, autenticación, panel de administración, efectos visuales, rendimiento, seguridad y funcionalidades PWA/SEO.

---

## Glossary

- **System**: La plataforma web completa Rumbo Digital Studio
- **Landing_Page**: La página principal pública accesible en la ruta `/`
- **Navbar**: Componente de navegación fijo con glassmorphism
- **Hero_Section**: Sección principal de la landing con título animado y CTA
- **Projects_Section**: Sección de portafolio con filtros y buscador
- **Services_Section**: Sección de servicios ofrecidos con cards animadas
- **HowWeWork_Section**: Sección con timeline del proceso de trabajo
- **Plans_Section**: Sección de planes de precios
- **Testimonials_Section**: Slider de testimonios de clientes
- **FAQ_Section**: Sección de preguntas frecuentes con acordeones
- **Contact_Section**: Sección con formulario de contacto
- **Footer**: Pie de página con links e información de la agencia
- **Auth_System**: Sistema de autenticación basado en JWT y PocketBase
- **Middleware**: Función `middleware.ts` de Next.js que guarda rutas protegidas
- **Admin_Panel**: Panel de administración accesible en `/admin/*`
- **PocketBase**: Backend externo usado como base de datos y API
- **PB_Client**: Instancia cliente de PocketBase en el browser (singleton)
- **PB_Server**: Instancia servidor de PocketBase (nueva por request)
- **Contact_Form**: Formulario de contacto con validación Zod + React Hook Form
- **Contact_API**: API route `/api/contact` que procesa el formulario
- **Theme_System**: Sistema de temas con soporte dark/light/matrix/party
- **Custom_Cursor**: Cursor personalizado animado
- **Loading_Screen**: Pantalla de carga inicial
- **Particle_Field**: Componente de partículas animadas
- **Konami_Code**: Easter egg activado con la secuencia Konami
- **PWA**: Progressive Web App con service worker y manifest
- **SEO**: Optimización para motores de búsqueda
- **Rate_Limiter**: Lógica de limitación de requests por IP
- **Validator**: Módulo Zod que valida datos de entrada
- **JWT**: JSON Web Token usado para autenticación
- **Admin_User**: Usuario con rol "admin" en PocketBase
- **Guest_User**: Visitante no autenticado

---

## Requirements

### Requirement 1: Carga Inicial de la Landing Page

**User Story:** Como visitante, quiero que la landing page cargue con todo el contenido de las secciones para poder conocer los servicios y proyectos de la agencia.

#### Acceptance Criteria

1. WHEN un visitante accede a la ruta `/`, THE Landing_Page SHALL renderizar en el servidor (SSR) con datos de todas las secciones obtenidos en paralelo desde PocketBase.
2. WHEN la Landing_Page se renderiza, THE System SHALL obtener en paralelo los datos de `hero_config`, `projects`, `services`, `plans`, `testimonials` y `faq` desde PocketBase usando `Promise.all`.
3. WHEN PocketBase no responde o retorna un error 5xx durante el fetch SSR inicial, THE Landing_Page SHALL mostrar contenido de fallback predefinido en lugar de una pantalla de error.
3a. IF el mecanismo de fallback primario falla al renderizar el contenido, THEN THE System SHALL mostrar un fallback secundario con contenido mínimo hardcodeado para garantizar que siempre se muestre algo al visitante.
4. WHEN el HTML servidor llega al browser, THE System SHALL hidratar los componentes client-side y montar las animaciones Framer Motion.
5. THE Landing_Page SHALL incluir las secciones: Navbar, Hero, Proyectos, Servicios, Cómo Trabajamos, Planes, Testimonios, FAQ, Contacto y Footer en ese orden.

---

### Requirement 2: Navbar

**User Story:** Como visitante, quiero una barra de navegación fija que me permita ir a cualquier sección de la página de forma fluida.

#### Acceptance Criteria

1. THE Navbar SHALL mostrar el logo, los links de navegación y un botón CTA obtenidos desde la colección `nav_items` de PocketBase.
2. WHEN el usuario hace scroll hacia abajo más de 10 píxeles, THE Navbar SHALL aplicar `backdrop-blur` y aumentar la opacidad del fondo (efecto glassmorphism).
3. WHEN el usuario hace clic en un link de navegación, THE Navbar SHALL ejecutar un smooth scroll hacia la sección correspondiente.
4. WHEN el viewport es menor a 768px, THE Navbar SHALL mostrar un menú hamburguesa en lugar de los links horizontales.
5. WHEN el menú hamburguesa es activado, THE Navbar SHALL mostrar los links de navegación en un panel desplegable animado.
6. WHEN el usuario se encuentra en cualquier sección de la página (independientemente del medio de navegación), THE Navbar SHALL resaltar el link activo correspondiente a la sección actualmente visible.

---

### Requirement 3: Hero Section

**User Story:** Como visitante, quiero ver una sección hero impactante con el mensaje principal y llamadas a la acción claras para saber qué ofrece la agencia.

#### Acceptance Criteria

1. THE Hero_Section SHALL renderizar el título, subtítulo, CTAs y badge desde los datos de la colección `hero_config`.
2. WHEN la Hero_Section entra al viewport, THE System SHALL animar el título con entrada stagger (hijos en secuencia) usando Framer Motion.
3. THE Hero_Section SHALL mostrar la imagen `hero-devices.png` con efecto parallax al hacer scroll.
4. THE Hero_Section SHALL renderizar el componente Particle_Field con partículas animadas en el fondo.
5. THE Hero_Section SHALL mostrar animaciones blob en el fondo.
6. IF el archivo `hero-devices.png` no existe, THEN THE Hero_Section SHALL mostrar el texto alternativo sin romper el layout, manteniendo activos todos los demás elementos visuales como el efecto parallax y las animaciones.

---

### Requirement 4: Sección de Proyectos

**User Story:** Como visitante, quiero ver el portafolio de proyectos con opciones de filtrado y búsqueda para encontrar proyectos relevantes a mis intereses.

#### Acceptance Criteria

1. THE Projects_Section SHALL mostrar los proyectos obtenidos desde la colección `projects` de PocketBase ordenados por el campo `order`.
2. WHEN el usuario selecciona una categoría de filtro, THE Projects_Section SHALL mostrar únicamente los proyectos cuya categoría coincida, con animación de re-layout (Framer Motion `layoutId`).
3. WHEN el usuario escribe en el buscador, THE Projects_Section SHALL filtrar proyectos por nombre, descripción o tecnologías usando debounce de al menos 300ms.
4. WHEN el usuario activa el toggle de favoritos, THE Projects_Section SHALL mostrar únicamente los proyectos marcados como favoritos en localStorage.
4a. THE System SHALL permitir marcar proyectos como favoritos independientemente de si el toggle de favoritos está activo o no.
5. WHEN el usuario marca un proyecto como favorito, THE System SHALL persistir el ID del proyecto en localStorage inmediatamente.
6. WHEN el usuario alterna entre vista lista y vista grilla, THE System SHALL persistir la preferencia de vista en localStorage.
7. THE Projects_Section SHALL mostrar effect de tilt 3D en las cards al hacer hover.
8. WHILE se aplican filtros, THE System SHALL garantizar que el conjunto resultado sea siempre un subconjunto de los proyectos originales.

---

### Requirement 5: Sección de Servicios

**User Story:** Como visitante, quiero ver los servicios de la agencia con descripciones e iconos claros para evaluar qué ofrecen.

#### Acceptance Criteria

1. THE Services_Section SHALL mostrar los servicios activos desde la colección `services` de PocketBase ordenados por el campo `order`.
2. WHEN las cards de servicios entran al viewport, THE System SHALL animar su entrada con stagger usando Intersection Observer.
3. WHEN el usuario hace hover sobre una card de servicio, THE System SHALL resaltar la card con una animación de escala y el color definido en el campo `color` del servicio.
4. THE Services_Section SHALL renderizar el icono de Lucide correspondiente al campo `icon` de cada servicio.

---

### Requirement 6: Sección Cómo Trabajamos

**User Story:** Como visitante, quiero ver el proceso de trabajo de la agencia en un formato visual para entender cómo será la colaboración.

#### Acceptance Criteria

1. THE HowWeWork_Section SHALL mostrar los 5 pasos del proceso de trabajo en una timeline animada.
2. WHEN el usuario hace scroll y la sección es visible, THE System SHALL animar la línea de progreso de la timeline de forma progresiva.
3. WHEN el usuario hace scroll y los pasos son visibles, THE System SHALL animar la entrada de cada paso con stagger.
4. WHILE el viewport es menor a 768px, THE HowWeWork_Section SHALL mostrar la timeline en orientación vertical.
5. WHILE el viewport es mayor o igual a 768px, THE HowWeWork_Section SHALL mostrar la timeline en orientación horizontal.
6. WHERE el flag de detección de dispositivo móvil contradiga el ancho real del viewport, THE System SHALL usar el flag de detección móvil como factor primario para determinar la orientación de la timeline, y el ancho de viewport como factor secundario.

---

### Requirement 7: Sección de Planes

**User Story:** Como visitante, quiero ver los planes de precios claramente diferenciados para tomar una decisión de compra informada.

#### Acceptance Criteria

1. THE Plans_Section SHALL mostrar los planes desde la colección `plans` de PocketBase ordenados por el campo `order`.
2. WHEN un plan tiene el campo `highlighted === true`, THE System SHALL resaltar ese plan con mayor escala, efecto glow y el badge definido en el campo `badge`.
3. WHEN el usuario alterna entre período mensual y anual, THE System SHALL recalcular y mostrar el precio correspondiente.
4. THE Plans_Section SHALL mostrar para cada plan: nombre, precio, moneda, período, lista de features incluidos y lista de features no incluidos.
5. THE Plans_Section SHALL renderizar un botón CTA por plan con el label y href definidos en los campos `ctaLabel` y `ctaHref`.

---

### Requirement 8: Sección de Testimonios

**User Story:** Como visitante, quiero leer testimonios de clientes anteriores para ganar confianza en los servicios de la agencia.

#### Acceptance Criteria

1. THE Testimonials_Section SHALL mostrar los testimonios activos desde la colección `testimonials` de PocketBase.
2. THE Testimonials_Section SHALL reproducir el slider automáticamente cambiando de testimonio cada 4 segundos, tolerando pequeñas variaciones de timing propias del navegador.
3. WHEN el usuario hace swipe en un dispositivo táctil, THE Testimonials_Section SHALL navegar al siguiente o anterior testimonio según la dirección del gesto.
4. THE Testimonials_Section SHALL mostrar dots de navegación que indiquen el testimonio activo y permitan navegación directa.
5. WHEN el usuario hace hover sobre el slider o interactúa con él (click en dots de navegación, swipe, etc.), THE Testimonials_Section SHALL pausar el auto-play.
6. WHEN el auto-play se reanuda, THE Testimonials_Section SHALL continuar desde el testimonio donde se pausó.

---

### Requirement 9: Sección FAQ

**User Story:** Como visitante, quiero encontrar respuestas a preguntas frecuentes en un formato fácil de navegar para resolver mis dudas.

#### Acceptance Criteria

1. THE FAQ_Section SHALL mostrar las preguntas frecuentes activas desde la colección `faq` de PocketBase ordenadas por el campo `order`.
2. WHEN el usuario hace clic en una pregunta cerrada, THE FAQ_Section SHALL animar la apertura del acordeón usando Framer Motion `AnimatePresence`.
3. WHEN el usuario abre un acordeón mientras otro ya está abierto, THE System SHALL primero animar el cierre del acordeón abierto y, una vez completada esa animación, animar la apertura del nuevo acordeón (secuencial, no simultáneo).
4. WHEN el usuario hace clic en una pregunta abierta, THE FAQ_Section SHALL animar el cierre del acordeón.
5. WHERE la colección `faq` incluya categorías, THE FAQ_Section SHALL mostrar un filtro de categorías y mostrar únicamente las preguntas de la categoría seleccionada.

---

### Requirement 10: Formulario de Contacto

**User Story:** Como visitante, quiero enviar un mensaje a la agencia fácilmente para poder solicitar información o un presupuesto.

#### Acceptance Criteria

1. THE Contact_Form SHALL contener los campos: nombre (requerido), email (requerido), teléfono (opcional), servicio de interés (opcional) y mensaje (requerido).
2. WHEN el usuario intenta enviar el formulario, THE Validator SHALL validar los datos usando el schema Zod: nombre entre 2 y 100 caracteres, email con formato válido, mensaje entre 10 y 1000 caracteres, teléfono con formato `^\+?[\d\s\-()]{7,20}$` si está presente.
3. IF la validación del formulario falla, THEN THE Contact_Form SHALL mostrar mensajes de error inline debajo de cada campo inválido y mantener el botón de submit deshabilitado.
3a. WHEN el formulario contiene datos inválidos, THE System SHALL prevenir completamente el envío del formulario sin mostrar indicador de carga.
4. WHEN el formulario es válido y el usuario hace submit, THE Contact_Form SHALL mostrar un indicador de carga y deshabilitar el botón de submit.
5. WHEN el envío es exitoso (respuesta 201 de la API), THE Contact_Form SHALL mostrar un toast de éxito y limpiar los campos del formulario.
6. IF la API retorna un error 429 durante un envío de formulario iniciado por el usuario, THEN THE Contact_Form SHALL mostrar un toast con el mensaje "Demasiados mensajes enviados. Intenta en unos minutos."
7. THE Contact_Form SHALL incluir un campo honeypot oculto llamado `website` que no debe ser visible ni rellenable por usuarios humanos.
8. THE Contact_Section SHALL mostrar información de contacto: email, teléfono, enlace a WhatsApp y enlace a Instagram.

---

### Requirement 11: API de Contacto

**User Story:** Como sistema, necesito procesar los envíos del formulario de forma segura y persistirlos en PocketBase.

#### Acceptance Criteria

1. WHEN la Contact_API recibe un POST con el campo `website` no vacío, THE Contact_API SHALL responder con HTTP 200 sin persistir ningún dato (silenciar bots).
2. WHEN la Contact_API recibe un POST y el mismo IP ha enviado 3 o más mensajes en los últimos 10 minutos, THE Contact_API SHALL responder con HTTP 429 sin persistir ningún dato.
3. WHEN la Contact_API recibe un POST con datos inválidos según el schema Zod, THE Contact_API SHALL responder con HTTP 400 e incluir los detalles de validación en el cuerpo de la respuesta.
4. WHEN la Contact_API recibe un POST con datos válidos, honeypot vacío y dentro del rate limit, THE Contact_API SHALL crear un registro en la colección `contact_messages` con `read=false` y `replied=false` y responder con HTTP 201.
5. WHEN se crea un registro exitosamente, THE System SHALL incluir la dirección IP del remitente en el campo `ip` del registro.

---

### Requirement 12: Autenticación

**User Story:** Como administrador, quiero poder iniciar sesión de forma segura para acceder al panel de administración.

#### Acceptance Criteria

1. WHEN un usuario envía email y contraseña en la página de login, THE Auth_System SHALL autenticar las credenciales contra PocketBase usando `authWithPassword`.
2. WHEN la autenticación es exitosa, THE Auth_System SHALL almacenar el JWT en una cookie `pb_auth` con flags `httpOnly`, `Secure` y `SameSite=Strict`.
3. WHEN la autenticación es exitosa y el usuario tiene `role === "admin"`, THE Auth_System SHALL redirigir al usuario a `/admin` o a la página de origen según el contexto de navegación.
4. WHEN la autenticación es exitosa y el usuario tiene un rol distinto a "admin", THE Auth_System SHALL redirigir al usuario a `/`.
5. IF la autenticación falla, THEN THE Auth_System SHALL mostrar un mensaje de error sin revelar si el email o la contraseña son incorrectos, y no mostrará mensajes de error cuando la autenticación sea exitosa.
6. WHEN el usuario hace logout, THE Auth_System SHALL eliminar la cookie `pb_auth` y redirigir a la página de inicio.
7. WHEN un usuario autenticado intenta acceder a `/login`, THE Middleware SHALL redirigir al usuario a `/admin`.

---

### Requirement 13: Middleware de Control de Acceso

**User Story:** Como sistema, necesito proteger las rutas del panel de administración para que solo usuarios admin puedan acceder.

#### Acceptance Criteria

1. WHEN una request llega a cualquier ruta `/admin/*` sin cookie `pb_auth`, THE Middleware SHALL redirigir la request a `/login`.
2. WHEN una request llega a cualquier ruta `/admin/*` con un JWT expirado, THE Middleware SHALL eliminar la cookie `pb_auth` y redirigir la request a `/login`.
3. WHEN una request llega a cualquier ruta `/admin/*` con un JWT válido pero con `role !== "admin"`, THE Middleware SHALL redirigir la request a `/`.
4. WHEN una request llega a cualquier ruta `/admin/*` con un JWT válido y `role === "admin"`, THE Middleware SHALL permitir el acceso a la ruta solicitada.
5. WHEN una request llega a `/login` con un JWT válido, THE Middleware SHALL redirigir la request a `/admin`.
6. WHEN una request llega a cualquier otra ruta pública, THE Middleware SHALL dejar pasar la request sin modificación.

---

### Requirement 14: Panel de Administración

**User Story:** Como administrador, quiero un panel completo para gestionar todo el contenido del sitio web desde una interfaz centralizada.

#### Acceptance Criteria

1. THE Admin_Panel SHALL mostrar un sidebar de navegación con accesos a cada colección administrable: proyectos, servicios, planes, testimonios, FAQ, mensajes y configuración de tema. El sidebar podrá mostrarse de forma independiente sin requerir que el dashboard esté visible.
2. THE Admin_Panel SHALL mostrar estadísticas en el dashboard: total de proyectos, total de mensajes, total de vistas y mensajes recientes.
3. WHEN el administrador selecciona una colección, THE Admin_Panel SHALL mostrar una tabla con todos los registros de esa colección obtenidos desde PocketBase.
4. WHEN el administrador hace clic en "Crear", THE Admin_Panel SHALL mostrar un formulario para crear un nuevo registro en la colección seleccionada.
5. WHEN el administrador hace clic en "Editar" en un registro, THE Admin_Panel SHALL cargar los datos del registro en un formulario editable.
6. WHEN el administrador confirma la eliminación de un registro, THE Admin_Panel SHALL eliminar el registro de PocketBase y actualizar la tabla.
7. WHEN el administrador elimina un registro, THE Admin_Panel SHALL solicitar confirmación explícita antes de proceder.
8. WHEN el administrador modifica la configuración de tema, THE Admin_Panel SHALL aplicar los cambios visuales en tiempo real en la interfaz de administración.
9. THE Admin_Panel SHALL permitir el upload de imágenes a PocketBase para los campos de tipo imagen en los formularios.

---

### Requirement 15: Sistema de Temas

**User Story:** Como visitante, quiero poder cambiar el tema visual del sitio para adaptar la experiencia a mis preferencias.

#### Acceptance Criteria

1. THE Theme_System SHALL soportar exactamente cuatro modos: `dark`, `light`, `matrix` y `party`.
2. WHEN el usuario cambia el tema, THE Theme_System SHALL eliminar todas las clases de tema previas de `document.documentElement` y agregar únicamente la clase del nuevo tema de manera atómica, garantizando que nunca exista un estado transitorio sin clase de tema.
3. WHEN el usuario cambia el tema, THE Theme_System SHALL actualizar todas las CSS custom properties del `:root` con los valores del tema seleccionado.
4. WHEN el usuario cambia el tema, THE Theme_System SHALL persistir la selección en `localStorage` con la clave `rumbo-theme`.
5. WHEN la página se carga, THE Theme_System SHALL leer el valor de `localStorage["rumbo-theme"]` y aplicar el tema guardado si es un valor válido.
6. WHILE la página está cargada, THE System SHALL garantizar que `document.documentElement.classList` contiene exactamente una clase de las cuatro clases de tema válidas en todo momento, incluyendo durante la transición entre temas.
7. WHEN se llama a `setTheme(mode)` dos veces consecutivas con el mismo `mode`, THE Theme_System SHALL producir el mismo estado que si se hubiera llamado una sola vez (idempotencia).

---

### Requirement 16: Easter Eggs y Efectos Especiales

**User Story:** Como visitante, quiero descubrir efectos especiales ocultos que hagan la experiencia del sitio más entretenida.

#### Acceptance Criteria

1. WHEN el usuario presiona la secuencia de teclas Konami (↑↑↓↓←→←→BA) en ese orden exacto, THE Konami_Code SHALL activar el modo `party` y mostrar un efecto de confetti.
2. THE Custom_Cursor SHALL reemplazar el cursor del sistema operativo con un cursor personalizado animado en toda la página, salvo cuando el usuario tenga activos modos de accesibilidad o haya deshabilitado las preferencias de cursor personalizado, en cuyo caso el cursor del sistema operativo será respetado. WHEN un modo especial (como `party` o `matrix`) está activo, THE Custom_Cursor SHALL cambiar su apariencia acorde al modo activo.
3. WHEN la página carga por primera vez, THE Loading_Screen SHALL mostrarse mientras se inicializan los recursos y desaparecer con una animación al completarse la carga.
4. THE Particle_Field SHALL renderizar partículas animadas en el fondo de la Hero_Section.
5. WHEN el modo `matrix` está activo, THE System SHALL aplicar un estilo visual temático tipo "Matrix" en toda la interfaz.
6. WHEN el modo `party` está activo, THE System SHALL aplicar colores vibrantes y animaciones festivas en toda la interfaz.

---

### Requirement 17: PocketBase Client Singleton

**User Story:** Como sistema, necesito gestionar eficientemente las instancias de PocketBase para evitar fugas de memoria y compartición de estado.

#### Acceptance Criteria

1. WHEN `getPocketBase()` es llamado múltiples veces en el contexto del browser, THE PB_Client SHALL retornar siempre la misma instancia de objeto (singleton).
2. WHEN `getPocketBase()` es llamado en el contexto del servidor, THE PB_Server SHALL retornar una instancia nueva e independiente por cada llamada (thread-safety).
3. WHEN `getPocketBase()` es llamado en el browser, THE PB_Client SHALL restaurar la sesión de autenticación desde la cookie `pb_auth` automáticamente. IF la cookie existe pero contiene datos inválidos o expirados, THEN THE System SHALL lanzar un error para que la sesión sea tratada como inexistente.
4. IF la variable de entorno `NEXT_PUBLIC_POCKETBASE_URL` no está definida, THEN THE System SHALL lanzar un error descriptivo durante la inicialización.

---

### Requirement 18: SEO y Metadatos

**User Story:** Como dueño del sitio, quiero que el sitio esté optimizado para motores de búsqueda para atraer tráfico orgánico.

#### Acceptance Criteria

1. THE System SHALL generar un archivo `sitemap.xml` dinámico que incluya todas las rutas públicas del sitio.
2. THE System SHALL servir un archivo `robots.txt` que permita el indexado de las páginas públicas.
3. THE Landing_Page SHALL incluir metadatos Open Graph para compartir en redes sociales: título, descripción, imagen y URL canónica.
4. THE Landing_Page SHALL incluir metadatos de descripción y palabras clave desde la colección `site_config` de PocketBase.
5. THE System SHALL lograr una puntuación de SEO igual o superior a 90 en Lighthouse.

---

### Requirement 19: Progressive Web App (PWA)

**User Story:** Como usuario móvil, quiero poder instalar el sitio como una aplicación para tener acceso rápido y funcionalidad offline.

#### Acceptance Criteria

1. THE System SHALL incluir un archivo `manifest.json` con nombre, íconos, colores y modo de pantalla para la PWA.
2. THE System SHALL registrar un Service Worker que cachee los assets estáticos de la landing page.
3. WHEN el usuario visita la landing page sin conexión, THE System SHALL servir el contenido desde el cache del Service Worker.
4. THE System SHALL lograr una puntuación de PWA funcional en Lighthouse.

---

### Requirement 20: Rendimiento

**User Story:** Como visitante, quiero que el sitio cargue rápidamente para tener una experiencia fluida.

#### Acceptance Criteria

1. THE System SHALL lograr una puntuación de Performance igual o superior a 90 en Lighthouse en desktop.
2. THE System SHALL lograr una puntuación de Accessibility igual o superior a 90 en Lighthouse.
3. THE System SHALL lograr una puntuación de Best Practices igual o superior a 90 en Lighthouse.
4. THE System SHALL usar el componente `next/image` para todas las imágenes, con soporte automático de formatos WebP/AVIF.
5. THE System SHALL implementar code splitting, cargando las secciones below-the-fold con `dynamic(() => import(...))`.
6. THE System SHALL cachear las respuestas de PocketBase en Server Components con revalidación cada 60 segundos.
7. THE System SHALL cargar fuentes web usando `next/font/google` para evitar layout shift y habilitar preload automático.
8. THE System SHALL usar `LazyMotion` de Framer Motion con el feature pack `domAnimation` para reducir el bundle size.

---

### Requirement 21: Seguridad

**User Story:** Como dueño del sitio, quiero que la plataforma sea segura para proteger los datos de los usuarios y el acceso al panel de administración.

#### Acceptance Criteria

1. THE Middleware SHALL verificar la firma criptográfica del JWT en cada request a rutas protegidas.
2. THE Auth_System SHALL almacenar el JWT en una cookie con los atributos `httpOnly`, `Secure` y `SameSite=Strict`.
3. THE System SHALL configurar headers de Content Security Policy (CSP) en `next.config.ts` para prevenir XSS.
4. THE System SHALL configurar las reglas de colección en PocketBase para que `contact_messages`, `analytics` y `plans` sean accesibles únicamente por usuarios con rol `admin`.
5. THE System SHALL configurar las reglas de colección en PocketBase para que las colecciones públicas (`projects`, `services`, etc.) sean de solo lectura para guests.
6. THE Validator SHALL sanitizar y validar todos los inputs de usuario mediante schemas Zod antes de persistirlos.
7. THE Contact_API SHALL implementar rate limiting de máximo 3 requests por IP en una ventana de 10 minutos.
8. THE System SHALL almacenar todas las credenciales y URLs sensibles en variables de entorno, nunca hardcodeadas en el código.

---

### Requirement 22: Validación de Modelos de Datos

**User Story:** Como sistema, necesito garantizar la integridad de los datos almacenados en PocketBase.

#### Acceptance Criteria

1. THE Validator SHALL aceptar únicamente valores de `testimonials.rating` en el rango entero [1, 5], y SHALL permitir valores null o 0 para testimonios sin calificación.
2. THE Validator SHALL aceptar únicamente valores de `plans.price` mayores o iguales a 0.
3. THE Validator SHALL aceptar únicamente valores de `theme_config.primaryColor`, `secondaryColor` y `accentColor` con formato hexadecimal válido (`#rrggbb` o `#rgb`).
4. THE System SHALL garantizar que el campo `projects.slug` sea único entre todos los proyectos y contenga únicamente caracteres en minúsculas y guiones.
5. THE Validator SHALL aceptar únicamente valores de `contact_messages.email` con formato de email válido (RFC 5321 sintáctico).
