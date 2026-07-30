# Implementation Plan: Rumbo Digital Studio

## Overview

Plan de implementación incremental para la plataforma web completa de Rumbo Digital Studio: landing page premium animada, autenticación JWT, panel de administración CMS, efectos visuales avanzados y PWA/SEO. Cada tarea construye sobre las anteriores, comenzando por la infraestructura base y terminando con optimización y tests.

## Tasks

- [ ] 1. Setup inicial del proyecto y configuración base
  - [-] 1.1 Inicializar proyecto Next.js 14 con TypeScript, Tailwind CSS y App Router
    - Ejecutar `npx create-next-app@14 . --typescript --tailwind --app --src-dir=false --import-alias="@/*"`
    - Configurar `tsconfig.json` con paths estrictos (`strict: true`, `baseUrl`, `paths`)
    - Configurar `tailwind.config.ts` con colores personalizados del tema (purple/violet palette), `darkMode: "class"`, fuentes y animaciones custom
    - Instalar dependencias runtime: `pocketbase framer-motion react-hook-form zod lucide-react`
    - Instalar dependencias dev: `vitest @testing-library/react @testing-library/jest-dom fast-check @vitejs/plugin-react jsdom`
    - Configurar `vitest.config.ts` con environment `jsdom` y setup files
    - _Requirements: 1.1, 20.7_
  - [ ] 1.2 Crear archivo `.env.local` y configurar variables de entorno
    - Crear `.env.local` con `NEXT_PUBLIC_POCKETBASE_URL=https://jeans-statement-wave-transactions.trycloudflare.com`
    - Crear `.env.example` documentando todas las variables requeridas
    - Agregar `.env.local` al `.gitignore`
    - _Requirements: 21.8_
  - [~] 1.3 Inicializar shadcn/ui y configurar componentes base
    - Ejecutar `npx shadcn-ui@latest init` con estilo "new-york", color base "violet"
    - Instalar componentes: `button`, `input`, `textarea`, `select`, `toast`, `dialog`, `badge`, `card`, `table`, `form`, `label`
    - _Requirements: 1.4_
  - [~] 1.4 Copiar imagen hero y crear estructura de directorios `public/`
    - Copiar `ChatGPT Image 29 jul 2026, 09_02_25 p.m..png` → `public/hero-devices.png`
    - Crear directorios: `public/icons/`, `public/screenshots/`
    - _Requirements: 3.3, 3.6_

- [ ] 2. Tipos TypeScript, schemas Zod y utilidades base
  - [~] 2.1 Crear `types/index.ts` con todas las interfaces del dominio
    - Definir interfaces: `SiteConfig`, `HeroConfig`, `Project`, `Service`, `Plan`, `Testimonial`, `FAQItem`, `ContactMessage`, `NavItem`, `ThemeConfig`, `AnalyticsEvent`, `AuthUser`
    - Exportar tipos derivados: `ProjectCategory`, `ThemeMode`, `ContactFormData`
    - _Requirements: 1.2, 4.1, 5.1, 7.1, 8.1, 9.1_
  - [~] 2.2 Crear `schemas/contact.ts` con schema Zod de contacto
    - Implementar `contactSchema` con validaciones: `name` (2-100), `email` (RFC5321), `phone` (regex opcional), `message` (10-1000), `website` (honeypot)
    - Exportar `ContactFormData` inferido del schema
    - _Requirements: 10.2, 22.5_
  - [ ]* 2.3 Escribir property test para el schema de contacto
    - **Property 8: Validación del schema de contacto** — `contactSchema.safeParse` devuelve `success: true` para datos válidos y `success: false` para datos que violan restricciones
    - **Validates: Requirements 10.2, 22.5**
    - _Usar fast-check: `fc.string`, `fc.emailAddress`, `fc.integer`_
  - [~] 2.4 Crear `lib/utils.ts` con utilidades generales
    - Implementar `cn()` helper para clases Tailwind condicionales (usando `clsx` + `tailwind-merge`)
    - Implementar `formatPrice()`, `slugify()`, `debounce()`, `isValidHex()`
    - _Requirements: 7.3, 22.3, 22.4_
  - [~] 2.5 Crear schemas de validación adicionales para datos del dominio
    - Schema para `testimonials.rating` (entero [1,5]), `plans.price` (≥0), `theme_config` (colores hex, `activeTheme` enum)
    - Schema para `projects.slug` (lowercase, guiones únicamente)
    - _Requirements: 22.1, 22.2, 22.3, 22.4_
  - [ ]* 2.6 Escribir property tests para validación de integridad de datos
    - **Property 17: Validación de integridad de datos del dominio** — rating ∈ [1,5], price ≥ 0, color hex válido
    - **Validates: Requirements 22.1, 22.2, 22.3**

- [ ] 3. Cliente PocketBase y capa de datos
  - [~] 3.1 Implementar `lib/pocketbase.ts` — singleton client-side
    - Implementar `getPocketBase()` con lógica singleton para browser: `if (!pbInstance) { ... loadFromCookie(...) }`
    - Lanzar error descriptivo si `NEXT_PUBLIC_POCKETBASE_URL` no está definida
    - _Requirements: 17.1, 17.3, 17.4_
  - [~] 3.2 Implementar `lib/pocketbase-server.ts` — instancia server-side
    - Implementar función que retorna siempre una nueva instancia (no singleton) para uso en RSC y API routes
    - _Requirements: 17.2_
  - [ ]* 3.3 Escribir property tests para el singleton de PocketBase
    - **Property 15: getPocketBase() es singleton en el cliente** — todas las llamadas en browser retornan la misma referencia
    - **Property 16: getPocketBase() retorna instancia nueva en el servidor** — llamadas en servidor retornan referencias distintas
    - **Validates: Requirements 17.1, 17.2**
  - [~] 3.4 Implementar `lib/auth.ts` — utilidades de autenticación JWT
    - Implementar `decodeJWT(token: string)` para extraer payload sin verificación criptográfica (solo lectura)
    - Implementar `isTokenExpired(exp: number): boolean`
    - Implementar `getAuthCookieOptions()` con flags `httpOnly: true`, `secure: true`, `sameSite: "strict"`
    - _Requirements: 12.2, 13.1, 13.2, 21.1, 21.2_

- [ ] 4. Middleware de autenticación y control de acceso
  - [~] 4.1 Crear `middleware.ts` en la raíz del proyecto
    - Implementar la lógica completa: verificar cookie `pb_auth`, decodificar JWT, comprobar expiración, verificar `role === "admin"`
    - Rutas `/admin/*` sin token → redirect `/login`
    - Rutas `/admin/*` con token expirado → eliminar cookie + redirect `/login`
    - Rutas `/admin/*` con role distinto a admin → redirect `/`
    - Ruta `/login` con token válido → redirect `/admin`
    - Configurar `config.matcher` para excluir assets estáticos
    - _Requirements: 12.7, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 21.1_
  - [ ]* 4.2 Escribir property tests para el middleware
    - **Property 11: Middleware de control de acceso** — todas las combinaciones de estado de token y ruta producen la respuesta correcta
    - **Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.5**

- [ ] 5. API Routes del backend Next.js
  - [~] 5.1 Crear `app/api/auth/login/route.ts`
    - Recibir `{ token, record }`, crear cookie `pb_auth` con `httpOnly`, `Secure`, `SameSite=Strict`
    - _Requirements: 12.1, 12.2, 21.2_
  - [~] 5.2 Crear `app/api/auth/logout/route.ts`
    - Eliminar cookie `pb_auth`, retornar redirect a `/`
    - _Requirements: 12.6_
  - [~] 5.3 Crear `app/api/auth/refresh/route.ts`
    - Verificar token vigente, refrescar con PocketBase si es posible, actualizar cookie
    - _Requirements: 12.1, 21.1_
  - [~] 5.4 Crear `app/api/contact/route.ts` con rate limiting y honeypot
    - Implementar `checkRateLimit(ip, { max: 3, windowMinutes: 10 })` usando Map en memoria (o similar)
    - Verificar honeypot `body.website` → responder 200 silencioso si está presente
    - Validar con `contactSchema.safeParse` → 400 con detalles si falla
    - Crear registro en `contact_messages` con `read: false`, `replied: false`, campo `ip`
    - Responder 201 en éxito, 429 en rate limit excedido
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 21.7_
  - [ ]* 5.5 Escribir property tests para la API de contacto
    - **Property 9: Rate limiting de la API de contacto** — después de 3 envíos exitosos, el 4to retorna 429
    - **Property 10: Envío exitoso crea registro con estado inicial correcto** — registro creado tiene `read=false`, `replied=false`, campo `ip`
    - **Validates: Requirements 11.2, 11.4, 11.5, 21.7**
  - [~] 5.6 Crear `app/api/analytics/route.ts`
    - Recibir evento `{ event, path, referrer, sessionId }`, persistir en colección `analytics`
    - _Requirements: 14.2_

- [ ] 6. Sistema de temas y hooks globales
  - [~] 6.1 Implementar `hooks/useTheme.ts`
    - Implementar hook con `useState<ThemeMode>`, leer de `localStorage` en `useEffect`, función `setTheme(mode)` que llama `applyTheme(mode)` y persiste en localStorage
    - Implementar `applyTheme(mode)`: eliminar clases previas de `documentElement`, agregar nueva clase, aplicar CSS custom properties de `THEME_CONFIGS[mode]`
    - Definir `THEME_CONFIGS` con variables para dark, light, matrix, party
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7_
  - [ ]* 6.2 Escribir property tests para el sistema de temas
    - **Property 12: applyTheme mantiene exactamente una clase de tema activa** — después de `applyTheme(mode)`, `classList` contiene exactamente una clase de tema
    - **Property 13: Tema persiste y se restaura (round-trip)** — `setTheme` → `localStorage` → re-init produce mismo estado DOM
    - **Property 14: setTheme es idempotente** — llamar dos veces produce el mismo estado que llamar una vez
    - **Validates: Requirements 15.2, 15.3, 15.4, 15.5, 15.6, 15.7**
  - [~] 6.3 Implementar `hooks/useScrollProgress.ts`
    - Hook que retorna `scrollProgress: number` (0-1) y `scrollY: number` usando `window.scrollY`
    - _Requirements: 2.2_
  - [~] 6.4 Implementar `hooks/useAuth.ts`
    - Hook que expone `user`, `isAdmin`, `logout()`, `isLoading`
    - Leer estado de autenticación desde PocketBase client singleton
    - _Requirements: 12.3, 12.4, 12.6_
  - [~] 6.5 Implementar `hooks/usePocketBase.ts`
    - Hook que retorna el cliente PocketBase singleton, con estado de conexión
    - _Requirements: 17.1, 17.3_

- [ ] 7. Root Layout, providers y configuración global de la app
  - [~] 7.1 Crear `app/layout.tsx` con providers globales
    - Configurar fuentes con `next/font/google` (Inter o similar)
    - Envolver la app con `ThemeProvider` (contexto del useTheme)
    - Incluir `CustomCursor`, `LoadingScreen` y `KonamiCode` a nivel global
    - Configurar metadatos base con `metadata` export de Next.js
    - _Requirements: 1.4, 16.2, 16.3, 20.7_
  - [~] 7.2 Crear `app/not-found.tsx` — página 404 personalizada
    - Diseño consistente con el resto del sitio, botón para volver al inicio
    - _Requirements: 1.5_
  - [~] 7.3 Crear `next.config.ts` con headers de seguridad y optimizaciones
    - Configurar `Content-Security-Policy` header
    - Configurar `images.domains` para PocketBase
    - Habilitar `swcMinify: true` y `reactStrictMode: true`
    - _Requirements: 21.3_

- [ ] 8. Componentes UI base y efectos visuales
  - [~] 8.1 Implementar `components/ui/CustomCursor.tsx`
    - Cursor personalizado con `position: fixed`, animado con Framer Motion siguiendo el mouse
    - Efecto de "magnetic" en elementos interactivos (botones, links)
    - Ocultar cursor nativo con `cursor: none` en `body`
    - _Requirements: 16.2_
  - [~] 8.2 Implementar `components/ui/LoadingScreen.tsx`
    - Pantalla de carga con logo/nombre animado usando Framer Motion
    - `useEffect` que setea `isLoading = false` cuando `document.readyState === 'complete'`
    - Animación de salida con `AnimatePresence`
    - _Requirements: 16.3_
  - [~] 8.3 Implementar `components/ui/ParticleField.tsx`
    - Canvas 2D con partículas animadas (posición, velocidad, opacidad random)
    - `useEffect` con `requestAnimationFrame` loop
    - Responsive: `canvas.width/height` actualiza en resize
    - _Requirements: 3.4_
  - [~] 8.4 Implementar `components/ui/BlobAnimation.tsx`
    - SVG o div con `border-radius` animado via Framer Motion `animate` y `keyframes`
    - Colores del gradiente según tema activo
    - _Requirements: 3.5_
  - [~] 8.5 Implementar `components/ui/ScrollProgress.tsx`
    - Barra de progreso fija en la parte superior usando `useScrollProgress` hook
    - Animada con Framer Motion `scaleX` transformando el ancho
    - _Requirements: 2.2_
  - [~] 8.6 Implementar `components/ui/ThemeToggle.tsx`
    - Botón/select para cambiar entre los 4 modos de tema usando `useTheme`
    - Iconos Lucide para cada modo (Moon, Sun, Terminal, Party)
    - _Requirements: 15.1_
  - [~] 8.7 Implementar `components/ui/KonamiCode.tsx`
    - Escuchar `keydown` events, comparar con secuencia KONAMI
    - Al completar: llamar `setTheme("party")` y disparar confetti (usando `canvas-confetti` o CSS)
    - _Requirements: 16.1_

- [ ] 9. Componentes de layout: Navbar y Footer
  - [~] 9.1 Implementar `components/layout/Navbar.tsx`
    - Renderizar logo, links de `nav_items` y botón CTA
    - `useScrollProgress` para aplicar glassmorphism (`backdrop-blur`, opacidad) al superar 10px de scroll
    - Smooth scroll con `scrollIntoView({ behavior: 'smooth' })` al hacer clic en links
    - Resaltado del link activo usando `IntersectionObserver` (sección visible actual)
    - _Requirements: 2.1, 2.2, 2.3, 2.6_
  - [~] 9.2 Implementar menú mobile en Navbar
    - Botón hamburguesa visible en viewport < 768px (Tailwind `md:hidden`)
    - Panel desplegable animado con Framer Motion `AnimatePresence`
    - Cierre al hacer clic en link o fuera del menú
    - _Requirements: 2.4, 2.5_
  - [~] 9.3 Implementar `components/layout/Footer.tsx`
    - Links a redes sociales (WhatsApp, Instagram), email, copyright
    - Links de navegación secundaria
    - _Requirements: 1.5_

- [ ] 10. Sección Hero
  - [~] 10.1 Implementar `components/sections/HeroSection.tsx`
    - Renderizar título, subtítulo, CTAs y badge desde prop `HeroConfig`
    - Animación de entrada stagger con Framer Motion (`variants`, `staggerChildren`)
    - Imagen `hero-devices.png` con `next/image` y `priority={true}`, efecto parallax via `useTransform` de Framer Motion sobre `scrollY`
    - Incluir `<ParticleField />` y `<BlobAnimation />` en fondo
    - Fallback si imagen no existe: mostrar solo texto (prop `alt` en Image)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 20.4_

- [ ] 11. Sección Proyectos con filtrado
  - [~] 11.1 Implementar lógica de filtrado `filterProjects()`
    - Implementar función pura con parámetros: `projects`, `category`, `searchQuery`, `showFavoritesOnly`, `favorites`
    - Filtro por categoría (si != "all"), filtro por búsqueda (debounce 300ms en componente), filtro por favoritos
    - Retornar subconjunto preservando orden original
    - _Requirements: 4.2, 4.3, 4.4, 4.8_
  - [ ]* 11.2 Escribir property tests para filterProjects()
    - **Property 1: Filtrado preserva subconjunto** — resultado siempre ⊆ proyectos originales, sin duplicados
    - **Property 2: Filtro por categoría devuelve solo proyectos coincidentes** — todos los resultados tienen `category === c`
    - **Property 3: Filtro por búsqueda devuelve solo proyectos que contienen la query** — coincidencia en name/description/technologies
    - **Property 4: Filtro por favoritos devuelve solo proyectos con ID en el set**
    - **Validates: Requirements 4.2, 4.3, 4.4, 4.8**
  - [~] 11.3 Implementar `components/sections/ProjectsSection.tsx`
    - Grid/lista de proyectos con `Framer Motion layoutId` para re-layout animado
    - Buscador con estado local y debounce 300ms, toggle de vista lista/grid
    - Persistencia de preferencias en `localStorage` (vista, favoritos)
    - Cards con hover tilt 3D (usando `onMouseMove` + `useMotionValue` o CSS `perspective`)
    - Botones de favorito con toggle inmediato
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_
  - [ ]* 11.4 Escribir property tests de persistencia de favoritos y vista
    - **Property 5: Favoritos persisten en localStorage (round-trip)** — marcar/desmarcar favorito y leer localStorage
    - **Property 6: Preferencia de vista persiste en localStorage (round-trip)** — cambiar vista y leer localStorage
    - **Validates: Requirements 4.5, 4.6**

- [ ] 12. Secciones de contenido: Servicios, Cómo Trabajamos, Planes
  - [~] 12.1 Implementar `components/sections/ServicesSection.tsx`
    - Grid de cards con icono Lucide (campo `icon`), nombre, descripción
    - Stagger animation al entrar al viewport con `whileInView` + `Intersection Observer`
    - Hover: escala + `boxShadow` con el color del servicio (campo `color`)
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  - [~] 12.2 Implementar `components/sections/HowWeWorkSection.tsx`
    - Timeline de 5 pasos con ícono, número de paso, título y descripción
    - Línea de progreso animada al hacer scroll (usando `useInView` + Framer Motion `scaleX`)
    - Stagger de entrada para cada paso
    - Layout vertical en mobile (`flex-col`), horizontal en desktop (`flex-row`)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [~] 12.3 Implementar `components/sections/PlansSection.tsx`
    - 3 cards de plan con toggle mensual/anual (estado local)
    - Plan `highlighted`: escala mayor, efecto glow con `box-shadow`, badge animado
    - Mostrar features incluidos (checkmark verde) y no incluidos (X rojo)
    - Botón CTA por plan
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 13. Secciones de engagement: Testimonios y FAQ
  - [~] 13.1 Implementar `components/sections/TestimonialsSection.tsx`
    - Slider con estado `currentIndex`, auto-play con `setInterval` cada 4 segundos
    - Pausa del auto-play en `onMouseEnter`, reanudación en `onMouseLeave`
    - Dots de navegación como botones
    - Swipe gesture con Framer Motion `drag="x"` y `onDragEnd` para detectar dirección
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_
  - [~] 13.2 Implementar `components/sections/FAQSection.tsx`
    - Estado `openIndex: number | null`, máximo un acordeón abierto
    - Animación de apertura/cierre con Framer Motion `AnimatePresence` + `motion.div` con `height: "auto"`
    - Filtro por categoría si las preguntas tienen campo `category`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  - [ ]* 13.3 Escribir unit tests para FAQ y Testimonials
    - Test de FAQSection: al abrir un acordeón, el anterior se cierra (máx 1 abierto)
    - **Property 7: FAQ: máximo un acordeón abierto simultáneamente**
    - Test de TestimonialsSection: auto-play avanza índice, hover pausa, swipe cambia slide
    - **Validates: Requirements 8.2, 8.5, 9.3**

- [ ] 14. Formulario de contacto y sección de contacto
  - [~] 14.1 Implementar `components/forms/ContactForm.tsx`
    - Formulario con `react-hook-form` + `zodResolver(contactSchema)`
    - Campos: nombre, email, teléfono (opcional), servicio (select opcional), mensaje, website (honeypot oculto con `display:none` y `tabIndex=-1`)
    - Mensajes de error inline bajo cada campo inválido
    - Loading state durante submit, botón deshabilitado en loading o formulario inválido
    - Toast de éxito (limpiar campos) o toast de error (rate limit / error genérico)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_
  - [~] 14.2 Implementar `components/sections/ContactSection.tsx`
    - Incluir `<ContactForm />`
    - Panel con info de contacto: email, teléfono, enlace WhatsApp, enlace Instagram
    - _Requirements: 10.8_

- [ ] 15. Landing page principal (page.tsx)
  - [~] 15.1 Crear `app/page.tsx` — Server Component con fetch paralelo
    - `Promise.all` para obtener datos de `hero_config`, `projects`, `services`, `plans`, `testimonials`, `faq`
    - Try/catch con datos de fallback si PocketBase no responde
    - Cache con `{ next: { revalidate: 60 } }` en cada fetch
    - Lazy loading de secciones below-the-fold con `dynamic(() => import(...))`
    - Renderizar todas las secciones en orden: Navbar, Hero, Projects, Services, HowWeWork, Plans, Testimonials, FAQ, Contact, Footer
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 20.5, 20.6_
  - [~] 15.2 Agregar metadatos Open Graph y SEO a `app/page.tsx`
    - Export `metadata` con `title`, `description`, `keywords` desde `site_config`
    - `openGraph`: title, description, image, url
    - _Requirements: 18.3, 18.4_

- [~] 16. Checkpoint — Validar landing page completa
  - Verificar que todas las secciones renderizan correctamente con datos de PocketBase
  - Verificar animaciones Framer Motion, temas (dark/light/matrix/party), cursor custom, loading screen
  - Verificar formulario de contacto end-to-end (validación + API)
  - Asegurarse de que todos los tests pasan. Consultar al usuario si surgen dudas.

- [ ] 17. Sistema de autenticación — páginas y flujo completo
  - [~] 17.1 Crear `app/(auth)/login/page.tsx` — LoginPage Client Component
    - Formulario de email + password con `react-hook-form`
    - Llamar a PocketBase `authWithPassword`, luego `POST /api/auth/login` para setear cookie
    - Redirect a `/admin` si `role === "admin"`, a `/` si otro rol
    - Mostrar mensaje de error genérico en fallo (sin revelar si es email o password)
    - Si hay query `?reason=session_expired`, mostrar mensaje correspondiente
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  - [~] 17.2 Crear `app/(auth)/register/page.tsx` y `app/(auth)/forgot-password/page.tsx`
    - Formularios básicos de registro y recuperación de contraseña via PocketBase
    - _Requirements: 12.1_
  - [~] 17.3 Crear `app/admin/layout.tsx` — Admin Layout con verificación de auth
    - Server Component que lee cookie `pb_auth` y verifica rol
    - Renderizar `<AdminSidebar />` + slot `{children}`
    - _Requirements: 14.1_

- [ ] 18. Panel de administración — componentes base
  - [~] 18.1 Implementar `components/admin/AdminSidebar.tsx`
    - Links a: Dashboard, Proyectos, Servicios, Planes, Testimonios, FAQ, Mensajes, Tema
    - Resaltado de sección activa, botón de logout
    - _Requirements: 14.1_
  - [~] 18.2 Implementar `components/admin/StatsCard.tsx`
    - Componente reutilizable para mostrar una estadística (título, valor, ícono, variación)
    - _Requirements: 14.2_
  - [~] 18.3 Implementar `components/admin/DataTable.tsx`
    - Tabla genérica con columnas configurables, paginación, ordenamiento
    - Botones de acción por fila: Editar, Eliminar (con modal de confirmación)
    - Botón "Crear" en la parte superior
    - _Requirements: 14.3, 14.6, 14.7_
  - [~] 18.4 Implementar `components/admin/EntityForm.tsx`
    - Formulario genérico para crear/editar entidades en PocketBase
    - Soporte para tipos: text, textarea, number, select, boolean, image upload
    - Image upload: enviar a PocketBase como `FormData`
    - Handlers `saveEntity(data, id?)` y `deleteEntity(id)`
    - _Requirements: 14.4, 14.5, 14.9_

- [ ] 19. Panel de administración — páginas de cada colección
  - [~] 19.1 Crear `app/admin/page.tsx` — Dashboard con estadísticas
    - Fetches: count de `projects`, count de `contact_messages`, count de `analytics` (views), últimos 5 mensajes
    - Renderizar 4 `<StatsCard />` y tabla de mensajes recientes
    - _Requirements: 14.2_
  - [~] 19.2 Crear páginas CRUD para cada colección administrable
    - `app/admin/projects/page.tsx` — lista con DataTable + Crear
    - `app/admin/services/page.tsx` — lista con DataTable + Crear
    - `app/admin/plans/page.tsx` — lista con DataTable + Crear
    - `app/admin/testimonials/page.tsx` — lista con DataTable + Crear
    - `app/admin/faq/page.tsx` — lista con DataTable + Crear
    - `app/admin/messages/page.tsx` — lista de mensajes de contacto (solo lectura + marcar leído)
    - Cada página usa `DataTable` y `EntityForm` genéricos con configuración específica de columnas y campos
    - _Requirements: 14.3, 14.4, 14.5, 14.6, 14.7_
  - [~] 19.3 Crear `app/admin/theme/page.tsx` — editor de tema en tiempo real
    - Formulario con color pickers para `primaryColor`, `secondaryColor`, `accentColor`, `bgColor`
    - Select para `borderRadius`, `shadowStyle`, `fontFamily`, `activeTheme`
    - `onChange` en cada campo aplica cambios en tiempo real al DOM via `applyTheme()`
    - Guardar en colección `theme_config` de PocketBase
    - _Requirements: 14.8_

- [~] 20. Checkpoint — Panel de administración funcional
  - Verificar flujo completo: login → dashboard → CRUD en cada colección → logout
  - Verificar middleware protege rutas `/admin/*` correctamente
  - Verificar upload de imágenes a PocketBase
  - Verificar cambios de tema en tiempo real
  - Asegurarse de que todos los tests pasan. Consultar al usuario si surgen dudas.

- [ ] 21. SEO y generación de metadatos dinámicos
  - [~] 21.1 Crear `app/sitemap.ts` — sitemap dinámico
    - Retornar array de `{ url, lastModified }` para todas las rutas públicas
    - Incluir rutas estáticas: `/`, `/login`
    - _Requirements: 18.1_
  - [~] 21.2 Crear `app/robots.ts` — robots.txt dinámico
    - Permitir indexado de rutas públicas, bloquear `/admin/*`
    - _Requirements: 18.2_
  - [~] 21.3 Actualizar `app/layout.tsx` con metadatos globales de SEO
    - `metadata.description` y `metadata.keywords` desde `site_config` de PocketBase
    - Configurar `viewport`, `themeColor`
    - _Requirements: 18.4, 18.5_

- [ ] 22. PWA — manifest y service worker
  - [~] 22.1 Crear `app/manifest.ts` — PWA manifest dinámico
    - Retornar objeto con `name`, `short_name`, `description`, `icons`, `theme_color`, `background_color`, `display: "standalone"`
    - Iconos de distintos tamaños (192x192, 512x512) en `public/icons/`
    - _Requirements: 19.1_
  - [~] 22.2 Crear `public/sw.js` — Service Worker para cache de assets
    - Estrategia cache-first para assets estáticos: JS, CSS, imágenes, fuentes
    - Estrategia network-first para HTML y requests a API
    - Workbox o implementación manual con eventos `install`, `activate`, `fetch`
    - _Requirements: 19.2, 19.3_
  - [~] 22.3 Registrar el Service Worker en `app/layout.tsx`
    - Client Component o script inline que llama `navigator.serviceWorker.register('/sw.js')`
    - _Requirements: 19.2_

- [ ] 23. Optimización de rendimiento
  - [~] 23.1 Auditar y optimizar bundle con `@next/bundle-analyzer`
    - Instalar `@next/bundle-analyzer`, generar reporte de bundle
    - Verificar que Framer Motion use `LazyMotion` con `domAnimation` en todos los componentes animados
    - Verificar que secciones below-the-fold usen `dynamic(() => import(...), { ssr: true })`
    - _Requirements: 20.5, 20.8_
  - [~] 23.2 Optimizar imágenes y fuentes
    - Verificar que todas las imágenes usen `next/image` con `width`, `height`, `priority` solo en hero
    - Verificar que fuentes usen `next/font/google`
    - _Requirements: 20.4, 20.7_
  - [~] 23.3 Verificar caching de PocketBase en Server Components
    - Agregar `{ next: { revalidate: 60 } }` o `cache: "force-cache"` a todos los fetches SSR
    - _Requirements: 20.6_
  - [~] 23.4 Configurar headers de seguridad completos en `next.config.ts`
    - Headers: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`
    - CSP completo incluyendo dominios de PocketBase y fuentes de Google
    - _Requirements: 21.3_

- [ ] 24. Tests de integración E2E con Playwright
  - [ ]* 24.1 Escribir test E2E del flujo de autenticación
    - Test: login con credenciales válidas → redirect a `/admin`
    - Test: acceso directo a `/admin` sin autenticación → redirect a `/login`
    - Test: logout → redirect a `/`
    - _Requirements: 12.1, 12.3, 12.6, 13.1_
  - [ ]* 24.2 Escribir test E2E del formulario de contacto
    - Test: envío con datos válidos → toast de éxito + campos limpios
    - Test: envío con datos inválidos → mensajes de error inline
    - _Requirements: 10.2, 10.5, 10.6_
  - [ ]* 24.3 Escribir test E2E de la landing page
    - Test: navegación smooth scroll desde Navbar
    - Test: filtrado de proyectos por categoría y búsqueda
    - Test: persistencia de favoritos en localStorage entre recargas
    - Test: activación de Konami Code → modo party
    - _Requirements: 2.3, 4.2, 4.3, 4.5, 16.1_

- [~] 25. Checkpoint final — Calidad y producción
  - Ejecutar `vitest --run` y verificar que todos los tests unitarios y de propiedad pasan
  - Ejecutar `npx playwright test` y verificar que los E2E pasan
  - Ejecutar `next build` y verificar que no hay errores de TypeScript ni build
  - Revisar Lighthouse en modo desktop (Performance, Accessibility, Best Practices, SEO ≥ 90)
  - Asegurarse de que todos los tests pasan y el build es exitoso. Consultar al usuario si surgen dudas.

## Notes

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia requisitos específicos para trazabilidad
- Los checkpoints (tareas 16, 20, 25) validan el estado del sistema en puntos clave del desarrollo
- Las property tests usan la librería **fast-check** según lo definido en la estrategia de testing del diseño
- Los tests E2E usan **Playwright** para flujos críticos del sistema
- El orden de implementación sigue las dependencias técnicas: tipos → datos → lógica → UI → integración → optimización
- PocketBase requiere configurar las reglas de colección manualmente desde su admin UI (no es una tarea de código)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "1.4", "2.1"] },
    { "id": 2, "tasks": ["2.2", "2.4", "2.5"] },
    { "id": 3, "tasks": ["2.3", "2.6", "3.1", "3.2"] },
    { "id": 4, "tasks": ["3.3", "3.4", "6.3", "6.4", "6.5"] },
    { "id": 5, "tasks": ["4.1", "5.1", "5.2", "5.3", "6.1", "7.3"] },
    { "id": 6, "tasks": ["4.2", "5.4", "5.6", "6.2", "7.1", "7.2"] },
    { "id": 7, "tasks": ["5.5", "8.1", "8.2", "8.3", "8.4", "8.5", "8.6", "8.7"] },
    { "id": 8, "tasks": ["9.1", "9.2", "9.3"] },
    { "id": 9, "tasks": ["10.1", "11.1", "12.1", "12.2", "12.3"] },
    { "id": 10, "tasks": ["11.2", "11.3", "13.1", "13.2", "14.1"] },
    { "id": 11, "tasks": ["11.4", "13.3", "14.2", "15.1"] },
    { "id": 12, "tasks": ["15.2", "17.1", "17.2"] },
    { "id": 13, "tasks": ["17.3", "18.1", "18.2", "18.3"] },
    { "id": 14, "tasks": ["18.4", "19.1"] },
    { "id": 15, "tasks": ["19.2", "19.3"] },
    { "id": 16, "tasks": ["21.1", "21.2", "21.3", "22.1", "22.2"] },
    { "id": 17, "tasks": ["22.3", "23.1", "23.2", "23.3", "23.4"] },
    { "id": 18, "tasks": ["24.1", "24.2", "24.3"] }
  ]
}
```
