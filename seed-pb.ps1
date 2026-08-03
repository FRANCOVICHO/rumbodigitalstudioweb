$PB = "https://pocketbase-rumbo.onrender.com"
$EMAIL = "digitalrumbostudio@gmail.com"
$PASS = "Messifranco2009"

Write-Host "Autenticando..." -ForegroundColor Cyan
$auth = Invoke-RestMethod -Method POST -Uri "$PB/api/admins/auth-with-password" -ContentType "application/json" -Body "{`"identity`":`"$EMAIL`",`"password`":`"$PASS`"}"
$TOKEN = $auth.token
Write-Host "OK - listando colecciones..." -ForegroundColor Green

$headers = @{ Authorization = $TOKEN; "Content-Type" = "application/json" }

# List collections
$cols = Invoke-RestMethod -Uri "$PB/api/collections" -Headers $headers
Write-Host "Colecciones existentes:" -ForegroundColor Yellow
$cols.items | ForEach-Object { Write-Host "  - $($_.name)" }

function Insert-Record($collection, $data) {
    try {
        Invoke-RestMethod -Method POST -Uri "$PB/api/collections/$collection/records" -Headers $headers -Body $data | Out-Null
        Write-Host "OK: $collection" -ForegroundColor Green
    } catch {
        Write-Host "ERROR $collection`: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nInsertando proyectos..." -ForegroundColor Cyan
Insert-Record "projects" '{"name":"Local Bar & Restaurant","slug":"local-bar-restaurant","description":"Sitio web moderno para negocio local con menu y reservas online.","category":"corporate","technologies":["Next.js","TypeScript","Tailwind CSS"],"imageUrl":"/screenshots/LOCAL.png","demoUrl":"https://paginaweblocalejemplo.pages.dev/","featured":true,"order":1}'
Insert-Record "projects" '{"name":"Barber Shop Premium","slug":"barber-shop-premium","description":"Landing page para barberia con sistema de turnos online.","category":"landing","technologies":["Next.js","React","CSS Modules"],"imageUrl":"/screenshots/BARBER.png","demoUrl":"https://barberejemplopagina.pages.dev/","featured":true,"order":2}'
Insert-Record "projects" '{"name":"Gym Fitness Landing","slug":"gym-fitness-landing","description":"Landing page para gimnasio con planes de membresia.","category":"landing","technologies":["Next.js","TypeScript","Tailwind CSS"],"imageUrl":"/screenshots/GYM.png","demoUrl":"https://landingpageejemplo.pages.dev/","featured":false,"order":3}'

Write-Host "`nInsertando planes..." -ForegroundColor Cyan
Insert-Record "plans" '{"name":"Basico","price":150000,"currency":"ARS","period":"proyecto","description":"Ideal para pequenos negocios.","features":["Hasta 5 paginas","Diseno responsive","Formulario de contacto","SEO basico","1 mes de soporte"],"notIncluded":["E-commerce","Panel de admin"],"highlighted":false,"ctaLabel":"Comenzar","ctaHref":"#contacto","order":1}'
Insert-Record "plans" '{"name":"Profesional","price":300000,"currency":"ARS","period":"proyecto","description":"Para empresas que buscan destacarse.","features":["Hasta 15 paginas","Diseno personalizado","Panel de admin","SEO avanzado","3 meses de soporte"],"notIncluded":["E-commerce completo"],"highlighted":true,"badge":"Mas elegido","ctaLabel":"Solicitar","ctaHref":"#contacto","order":2}'
Insert-Record "plans" '{"name":"Enterprise","price":0,"currency":"ARS","period":"proyecto","description":"Soluciones completas y personalizadas.","features":["Paginas ilimitadas","Diseno personalizado","E-commerce","Panel admin avanzado","6 meses de soporte","Hosting incluido"],"notIncluded":[],"highlighted":false,"ctaLabel":"Contactar","ctaHref":"#contacto","order":3}'

Write-Host "`nInsertando servicios..." -ForegroundColor Cyan
Insert-Record "services" '{"name":"Desarrollo Web","description":"Sitios web modernos, rapidos y responsive.","icon":"Code","color":"#4A90E2","features":["Next.js 14","React 18","TypeScript","Tailwind CSS"],"order":1,"active":true}'
Insert-Record "services" '{"name":"E-commerce","description":"Tiendas online completas con gestion de productos y pagos.","icon":"ShoppingCart","color":"#6386fa","features":["Carrito","Pagos","Panel admin","Inventario"],"order":2,"active":true}'
Insert-Record "services" '{"name":"Landing Pages","description":"Paginas optimizadas para conversion y SEO.","icon":"Rocket","color":"#a8c8f8","features":["Alto rendimiento","SEO","Formularios","Analytics"],"order":3,"active":true}'
Insert-Record "services" '{"name":"Diseno UI/UX","description":"Interfaces atractivas y experiencias intuitivas.","icon":"Palette","color":"#4A90E2","features":["Figma","Prototipos","Design System","Responsive"],"order":4,"active":true}'
Insert-Record "services" '{"name":"Apps Web","description":"Aplicaciones web progresivas con funcionalidad offline.","icon":"Smartphone","color":"#6386fa","features":["PWA","Offline","Push notifications","Instalable"],"order":5,"active":true}'
Insert-Record "services" '{"name":"SEO","description":"Mejora el posicionamiento en buscadores.","icon":"Search","color":"#a8c8f8","features":["Keywords","Meta tags","Performance","Analytics"],"order":6,"active":true}'

Write-Host "`nTodo listo!" -ForegroundColor Green
