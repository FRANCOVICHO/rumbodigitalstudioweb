# Rumbo Digital Studio

Landing page premium para agencia de desarrollo digital construida con Next.js 14, TypeScript, Tailwind CSS y Framer Motion.

## 🚀 Características

- ✨ Diseño moderno con glassmorphism y animaciones fluidas
- 🎨 Sistema de temas (dark/light/matrix/party)
- 📱 100% responsive y optimizado para móvil
- ⚡ Rendimiento optimizado con Next.js 14 App Router
- 🎭 Animaciones interactivas con Framer Motion
- 📬 Formulario de contacto con validación y rate limiting
- 🛡️ Protección anti-spam con honeypot
- 🎯 SEO optimizado

## 📋 Proyectos Demo

Los botones de demo en la sección "Proyectos" te llevarán a:

- **LOCAL** (Bar & Restaurant): https://paginaweblocalejemplo.pages.dev/
- **BARBER** (Barber Shop): https://barberejemplopagina.pages.dev/
- **GYM** (Fitness Landing): https://landingpageejemplo.pages.dev/

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React
- **Formularios**: React Hook Form + Zod
- **Backend** (futuro): PocketBase

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local

# Iniciar servidor de desarrollo
npm run dev
```

El sitio estará disponible en [http://localhost:3000](http://localhost:3000)

## 🌐 Variables de Entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_POCKETBASE_URL=https://your-pocketbase-instance.com
```

## 📁 Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── api/               # API routes
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página de inicio
│   └── globals.css        # Estilos globales
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── sections/          # Secciones de la landing
│   └── ui/                # Componentes UI reutilizables
├── hooks/                 # React hooks personalizados
├── lib/                   # Utilidades y helpers
├── types/                 # TypeScript types
└── public/                # Assets estáticos
    ├── hero-devices.png
    └── screenshots/       # Screenshots de proyectos
```

## 🎨 Secciones

1. **Hero** - Sección principal con título animado y CTA
2. **Proyectos** - Portfolio con demos reales
3. **Servicios** - Grid de 13 servicios con iconos
4. **Cómo Trabajamos** - Timeline del proceso
5. **Planes** - Tres niveles de precios
6. **Testimonios** - Slider automático de reseñas
7. **FAQ** - Acordeones con preguntas frecuentes
8. **Contacto** - Formulario con validación

## 🚀 Comandos

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start

# Linter
npm run lint
```

## 📝 Personalización

### Colores del Tema

Los colores están definidos en `tailwind.config.ts`:

```typescript
colors: {
  primary: { ... },      // Violeta/Púrpura
  secondary: { ... },    // Fucsia
  accent: { ... },       // Cyan
}
```

### Datos del Sitio

Los datos actualmente se sirven desde `lib/fallback-data.ts`. Para conectar con PocketBase:

1. Configurar la URL en `.env.local`
2. Implementar `lib/pocketbase.ts`
3. Actualizar `app/page.tsx` para fetch de datos

### Proyectos

Para agregar/modificar proyectos, editar el array en `lib/fallback-data.ts`:

```typescript
projects: [
  {
    name: "Nombre del Proyecto",
    slug: "proyecto-slug",
    description: "...",
    imageUrl: "/screenshots/imagen.png",
    demoUrl: "https://demo.com",
    ...
  }
]
```

## 🎯 Próximos Pasos

- [ ] Conectar con PocketBase
- [ ] Implementar panel de administración
- [ ] Agregar autenticación JWT
- [ ] PWA con service worker
- [ ] Tests unitarios y E2E
- [ ] Sistema de analytics

## 📄 Licencia

Proyecto privado - Rumbo Digital Studio

## 👥 Contacto

- Email: hola@rumbodigital.com
- WhatsApp: +54 11 1234-5678
- Instagram: @rumbodigital

---

Hecho con ❤️ en Argentina
