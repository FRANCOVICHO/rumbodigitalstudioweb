#!/bin/bash
# Script para crear colecciones en PocketBase (Render)
# Ejecutar en la PC Linux: bash setup-pocketbase.sh

PB_URL="https://pocketbase-rumbo.onrender.com"
ADMIN_EMAIL="canopiagrow@gmail.com"
ADMIN_PASS="Messifranco2009"

echo "🔐 Autenticando con PocketBase..."
TOKEN=$(curl -s -X POST "$PB_URL/api/admins/auth-with-password" \
  -H "Content-Type: application/json" \
  -d "{\"identity\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASS\"}" \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Error: No se pudo obtener el token. Verificá las credenciales."
  exit 1
fi
echo "✅ Autenticado correctamente"

create_collection() {
  local NAME=$1
  local SCHEMA=$2
  echo "📦 Creando colección: $NAME"
  curl -s -X POST "$PB_URL/api/collections" \
    -H "Content-Type: application/json" \
    -H "Authorization: $TOKEN" \
    -d "$SCHEMA" | grep -o '"name":"[^"]*"' | head -1
}

# ── hero_config ────────────────────────────────────────────────────────────────
create_collection "hero_config" '{
  "name": "hero_config",
  "type": "base",
  "schema": [
    {"name":"title","type":"text","required":true},
    {"name":"subtitle","type":"text","required":true},
    {"name":"ctaPrimaryLabel","type":"text","required":true},
    {"name":"ctaPrimaryHref","type":"text","required":true},
    {"name":"ctaSecondaryLabel","type":"text","required":true},
    {"name":"ctaSecondaryHref","type":"text","required":true},
    {"name":"badgeText","type":"text"},
    {"name":"heroImageUrl","type":"text"},
    {"name":"active","type":"bool"}
  ]
}'

# ── projects ───────────────────────────────────────────────────────────────────
create_collection "projects" '{
  "name": "projects",
  "type": "base",
  "schema": [
    {"name":"name","type":"text","required":true},
    {"name":"slug","type":"text","required":true},
    {"name":"description","type":"text","required":true},
    {"name":"longDescription","type":"text"},
    {"name":"category","type":"select","required":true,"options":{"values":["ecommerce","corporate","landing","custom"]}},
    {"name":"technologies","type":"json"},
    {"name":"imageUrl","type":"text"},
    {"name":"screenshots","type":"json"},
    {"name":"demoUrl","type":"url"},
    {"name":"repoUrl","type":"url"},
    {"name":"featured","type":"bool"},
    {"name":"order","type":"number"}
  ]
}'

# ── services ───────────────────────────────────────────────────────────────────
create_collection "services" '{
  "name": "services",
  "type": "base",
  "schema": [
    {"name":"name","type":"text","required":true},
    {"name":"description","type":"text","required":true},
    {"name":"icon","type":"text","required":true},
    {"name":"color","type":"text"},
    {"name":"features","type":"json"},
    {"name":"order","type":"number"},
    {"name":"active","type":"bool"}
  ]
}'

# ── plans ──────────────────────────────────────────────────────────────────────
create_collection "plans" '{
  "name": "plans",
  "type": "base",
  "schema": [
    {"name":"name","type":"text","required":true},
    {"name":"price","type":"number","required":true},
    {"name":"currency","type":"text","required":true},
    {"name":"period","type":"text","required":true},
    {"name":"description","type":"text"},
    {"name":"features","type":"json"},
    {"name":"notIncluded","type":"json"},
    {"name":"highlighted","type":"bool"},
    {"name":"badge","type":"text"},
    {"name":"ctaLabel","type":"text","required":true},
    {"name":"ctaHref","type":"text","required":true},
    {"name":"order","type":"number"}
  ]
}'

# ── testimonials ───────────────────────────────────────────────────────────────
create_collection "testimonials" '{
  "name": "testimonials",
  "type": "base",
  "schema": [
    {"name":"name","type":"text","required":true},
    {"name":"role","type":"text","required":true},
    {"name":"company","type":"text","required":true},
    {"name":"content","type":"text","required":true},
    {"name":"rating","type":"number"},
    {"name":"avatarUrl","type":"url"},
    {"name":"active","type":"bool"},
    {"name":"order","type":"number"}
  ]
}'

# ── faq ────────────────────────────────────────────────────────────────────────
create_collection "faq" '{
  "name": "faq",
  "type": "base",
  "schema": [
    {"name":"question","type":"text","required":true},
    {"name":"answer","type":"text","required":true},
    {"name":"category","type":"text"},
    {"name":"order","type":"number"},
    {"name":"active","type":"bool"}
  ]
}'

# ── contact_messages ───────────────────────────────────────────────────────────
create_collection "contact_messages" '{
  "name": "contact_messages",
  "type": "base",
  "schema": [
    {"name":"name","type":"text","required":true},
    {"name":"email","type":"email","required":true},
    {"name":"phone","type":"text"},
    {"name":"service","type":"text"},
    {"name":"message","type":"text","required":true},
    {"name":"read","type":"bool"},
    {"name":"replied","type":"bool"},
    {"name":"ip","type":"text"}
  ]
}'

# ── nav_items ──────────────────────────────────────────────────────────────────
create_collection "nav_items" '{
  "name": "nav_items",
  "type": "base",
  "schema": [
    {"name":"label","type":"text","required":true},
    {"name":"href","type":"text","required":true},
    {"name":"order","type":"number"},
    {"name":"active","type":"bool"},
    {"name":"isCTA","type":"bool"}
  ]
}'

echo ""
echo "✅ Colecciones creadas. Cargando datos..."

# ── Insertar datos: hero_config ────────────────────────────────────────────────
echo "📝 Insertando hero_config..."
curl -s -X POST "$PB_URL/api/collections/hero_config/records" \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN" \
  -d '{"title":"Transformamos Ideas en Experiencias Digitales","subtitle":"Agencia de desarrollo web especializada en crear sitios modernos, rápidos y optimizados para tu negocio.","ctaPrimaryLabel":"Ver Proyectos","ctaPrimaryHref":"#proyectos","ctaSecondaryLabel":"Contactar","ctaSecondaryHref":"#contacto","badgeText":"🚀 Diseño + Desarrollo","heroImageUrl":"/hero-devices.png","active":true}' > /dev/null

# ── Insertar datos: projects ───────────────────────────────────────────────────
echo "📝 Insertando proyectos..."
curl -s -X POST "$PB_URL/api/collections/projects/records" \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN" \
  -d '{"name":"Local Bar & Restaurant","slug":"local-bar-restaurant","description":"Sitio web moderno para restaurante local con menú interactivo, reservas online y galería de fotos.","category":"corporate","technologies":["Next.js","TypeScript","Tailwind CSS","Framer Motion"],"imageUrl":"/screenshots/LOCAL.png","screenshots":["/screenshots/LOCAL.png"],"demoUrl":"https://paginaweblocalejemplo.pages.dev/","featured":true,"order":1}' > /dev/null

curl -s -X POST "$PB_URL/api/collections/projects/records" \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN" \
  -d '{"name":"Barber Shop Premium","slug":"barber-shop-premium","description":"Landing page elegante para barbería con sistema de turnos, galería de cortes y perfiles de barberos.","category":"landing","technologies":["Next.js","React","CSS Modules","React Hook Form"],"imageUrl":"/screenshots/BARBER.png","screenshots":["/screenshots/BARBER.png"],"demoUrl":"https://barberejemplopagina.pages.dev/","featured":true,"order":2}' > /dev/null

curl -s -X POST "$PB_URL/api/collections/projects/records" \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN" \
  -d '{"name":"Gym & Fitness Landing","slug":"gym-fitness-landing","description":"Landing page dinámica para gimnasio con planes de membresía, horarios de clases y testimonios.","category":"landing","technologies":["Next.js","TypeScript","Tailwind CSS","Animations"],"imageUrl":"/screenshots/GYM.png","screenshots":["/screenshots/GYM.png"],"demoUrl":"https://landingpageejemplo.pages.dev/","featured":false,"order":3}' > /dev/null

# ── Insertar datos: testimonials ───────────────────────────────────────────────
echo "📝 Insertando testimonios..."
curl -s -X POST "$PB_URL/api/collections/testimonials/records" \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN" \
  -d '{"name":"Carlos Méndez","role":"Dueño","company":"La Parrilla Local","content":"El equipo de Rumbo superó nuestras expectativas. El sitio es hermoso y funcional, las reservas online aumentaron un 40%.","rating":5,"active":true,"order":1}' > /dev/null

curl -s -X POST "$PB_URL/api/collections/testimonials/records" \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN" \
  -d '{"name":"Martín López","role":"Barbero Principal","company":"Barber Shop Premium","content":"Excelente trabajo. El sistema de turnos online nos ahorró muchísimo tiempo y los clientes lo encuentran súper fácil de usar.","rating":5,"active":true,"order":2}' > /dev/null

curl -s -X POST "$PB_URL/api/collections/testimonials/records" \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN" \
  -d '{"name":"Laura Gómez","role":"Gerente de Marketing","company":"Fitness Center","content":"Profesionales de primera. La landing page convierte muy bien y refleja perfectamente la identidad de nuestra marca.","rating":5,"active":true,"order":3}' > /dev/null

echo ""
echo "🎉 Setup completo! PocketBase configurado en: $PB_URL"
echo "   Admin: $PB_URL/_/"
