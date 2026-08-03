$PB = "https://pocketbase-rumbo.onrender.com"
$EMAIL = "digitalrumbostudio@gmail.com"
$PASS = "Messifranco2009"

Write-Host "Autenticando..." -ForegroundColor Cyan
$auth = Invoke-RestMethod -Method POST -Uri "$PB/api/admins/auth-with-password" -ContentType "application/json" -Body "{`"identity`":`"$EMAIL`",`"password`":`"$PASS`"}"
$TOKEN = $auth.token
Write-Host "Token obtenido: $($TOKEN.Substring(0,20))..." -ForegroundColor Green

$headers = @{ Authorization = $TOKEN; "Content-Type" = "application/json" }

function Create-Collection($schema) {
    try {
        $result = Invoke-RestMethod -Method POST -Uri "$PB/api/collections" -Headers $headers -Body $schema
        Write-Host "Creada: $($result.name)" -ForegroundColor Green
    } catch {
        Write-Host "Ya existe o error: $_" -ForegroundColor Yellow
    }
}

function Insert-Record($collection, $data) {
    try {
        Invoke-RestMethod -Method POST -Uri "$PB/api/collections/$collection/records" -Headers $headers -Body $data | Out-Null
        Write-Host "Insertado en $collection" -ForegroundColor Green
    } catch {
        Write-Host "Error insertando en $collection`: $_" -ForegroundColor Red
    }
}

# Crear colecciones
Create-Collection '{"name":"projects","type":"base","schema":[{"name":"name","type":"text","required":true},{"name":"slug","type":"text","required":true},{"name":"description","type":"text","required":true},{"name":"category","type":"select","options":{"values":["ecommerce","corporate","landing","custom"]}},{"name":"technologies","type":"json"},{"name":"imageUrl","type":"text"},{"name":"demoUrl","type":"url"},{"name":"featured","type":"bool"},{"name":"order","type":"number"}]}'

Create-Collection '{"name":"plans","type":"base","schema":[{"name":"name","type":"text","required":true},{"name":"price","type":"number"},{"name":"currency","type":"text","required":true},{"name":"period","type":"text","required":true},{"name":"description","type":"text"},{"name":"features","type":"json"},{"name":"notIncluded","type":"json"},{"name":"highlighted","type":"bool"},{"name":"badge","type":"text"},{"name":"ctaLabel","type":"text","required":true},{"name":"ctaHref","type":"text","required":true},{"name":"order","type":"number"}]}'

Create-Collection '{"name":"services","type":"base","schema":[{"name":"name","type":"text","required":true},{"name":"description","type":"text","required":true},{"name":"icon","type":"text","required":true},{"name":"color","type":"text"},{"name":"features","type":"json"},{"name":"order","type":"number"},{"name":"active","type":"bool"}]}'

Create-Collection '{"name":"faq","type":"base","schema":[{"name":"question","type":"text","required":true},{"name":"answer","type":"text","required":true},{"name":"category","type":"text"},{"name":"order","type":"number"},{"name":"active","type":"bool"}]}'

Create-Collection '{"name":"testimonials","type":"base","schema":[{"name":"name","type":"text","required":true},{"name":"role","type":"text","required":true},{"name":"company","type":"text","required":true},{"name":"content","type":"text","required":true},{"name":"rating","type":"number"},{"name":"active","type":"bool"},{"name":"order","type":"number"}]}'

Create-Collection '{"name":"contact_messages","type":"base","schema":[{"name":"name","type":"text","required":true},{"name":"email","type":"email","required":true},{"name":"phone","type":"text"},{"name":"service","type":"text"},{"name":"message","type":"text","required":true},{"name":"read","type":"bool"},{"name":"replied","type":"bool"},{"name":"ip","type":"text"}]}'

Create-Collection '{"name":"hero_config","type":"base","schema":[{"name":"title","type":"text","required":true},{"name":"subtitle","type":"text","required":true},{"name":"ctaPrimaryLabel","type":"text","required":true},{"name":"ctaPrimaryHref","type":"text","required":true},{"name":"ctaSecondaryLabel","type":"text","required":true},{"name":"ctaSecondaryHref","type":"text","required":true},{"name":"badgeText","type":"text"},{"name":"active","type":"bool"}]}'

Write-Host "`nInsertando datos..." -ForegroundColor Cyan

# Proyectos
Insert-Record "projects" '{"name":"Local Bar & Restaurant","slug":"local-bar-restaurant","description":"Sitio web moderno para negocio local con menu y reservas online.","category":"corporate","technologies":["Next.js","TypeScript","Tailwind CSS"],"imageUrl":"/screenshots/LOCAL.png","demoUrl":"https://paginaweblocalejemplo.pages.dev/","featured":true,"order":1}'
Insert-Record "projects" '{"name":"Barber Shop Premium","slug":"barber-shop-premium","description":"Landing page para barberia con sistema de turnos online.","category":"landing","technologies":["Next.js","React","CSS Modules"],"imageUrl":"/screenshots/BARBER.png","demoUrl":"https://barberejemplopagina.pages.dev/","featured":true,"order":2}'
Insert-Record "projects" '{"name":"Gym Fitness Landing","slug":"gym-fitness-landing","description":"Landing page para gimnasio con planes de membresia.","category":"landing","technologies":["Next.js","TypeScript","Tailwind CSS"],"imageUrl":"/screenshots/GYM.png","demoUrl":"https://landingpageejemplo.pages.dev/","featured":false,"order":3}'

# Planes
Insert-Record "plans" '{"name":"Basico","price":150000,"currency":"ARS","period":"proyecto","description":"Ideal para pequenos negocios.","features":["Hasta 5 paginas","Diseno responsive","Formulario de contacto","SEO basico","1 mes de soporte"],"notIncluded":["E-commerce","Panel de admin"],"highlighted":false,"ctaLabel":"Comenzar","ctaHref":"#contacto","order":1}'
Insert-Record "plans" '{"name":"Profesional","price":300000,"currency":"ARS","period":"proyecto","description":"Para empresas que buscan destacarse.","features":["Hasta 15 paginas","Diseno personalizado","Panel de admin","SEO avanzado","3 meses de soporte"],"notIncluded":["E-commerce completo"],"highlighted":true,"badge":"Mas elegido","ctaLabel":"Solicitar","ctaHref":"#contacto","order":2}'
Insert-Record "plans" '{"name":"Enterprise","price":0,"currency":"ARS","period":"proyecto","description":"Soluciones completas y personalizadas.","features":["Paginas ilimitadas","Diseno personalizado","E-commerce","Panel admin avanzado","6 meses de soporte","Hosting incluido"],"notIncluded":[],"highlighted":false,"ctaLabel":"Contactar","ctaHref":"#contacto","order":3}'

# Hero
Insert-Record "hero_config" '{"title":"Transformamos Ideas en Experiencias Digitales","subtitle":"Agencia de desarrollo web especializada en crear sitios modernos, rapidos y optimizados para tu negocio.","ctaPrimaryLabel":"Ver Proyectos","ctaPrimaryHref":"#proyectos","ctaSecondaryLabel":"Solicitar Presupuesto","ctaSecondaryHref":"#calculadora","badgeText":"Diseno + Desarrollo","active":true}'

# FAQ
Insert-Record "faq" '{"question":"Cuanto tiempo tarda el desarrollo?","answer":"Un sitio basico puede estar listo en 2-3 semanas, proyectos mas complejos entre 1 y 3 meses.","category":"General","order":1,"active":true}'
Insert-Record "faq" '{"question":"Los sitios son responsive?","answer":"Si, todos nuestros sitios estan optimizados para verse perfectamente en moviles, tablets y computadoras.","category":"Diseno","order":2,"active":true}'
Insert-Record "faq" '{"question":"Como es el proceso de pago?","answer":"Trabajamos con 50% al iniciar y 50% al finalizar. Aceptamos transferencias bancarias y Mercado Pago.","category":"Pagos","order":3,"active":true}'

Write-Host "`nSetup completado!" -ForegroundColor Green
