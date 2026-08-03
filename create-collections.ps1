$PB = "https://pocketbase-rumbo.onrender.com"
$auth = Invoke-RestMethod -Method POST -Uri "$PB/api/admins/auth-with-password" -ContentType "application/json" -Body "{`"identity`":`"digitalrumbostudio@gmail.com`",`"password`":`"Messifranco2009`"}"
$h = @{ Authorization = $auth.token; "Content-Type" = "application/json" }

Write-Host "Creando coleccion projects..." -ForegroundColor Cyan
try {
    $r = Invoke-RestMethod -Method POST -Uri "$PB/api/collections" -Headers $h -Body (@{
        name = "projects"
        type = "base"
        schema = @(
            @{name="name";type="text";required=$true}
            @{name="slug";type="text";required=$true}
            @{name="description";type="text";required=$true}
            @{name="category";type="text"}
            @{name="technologies";type="json"}
            @{name="imageUrl";type="text"}
            @{name="demoUrl";type="text"}
            @{name="featured";type="bool"}
            @{name="order";type="number"}
        )
    } | ConvertTo-Json -Depth 5)
    Write-Host "Creada: $($r.name)" -ForegroundColor Green
} catch { Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red }

Write-Host "Creando coleccion plans..." -ForegroundColor Cyan
try {
    $r = Invoke-RestMethod -Method POST -Uri "$PB/api/collections" -Headers $h -Body (@{
        name = "plans"
        type = "base"
        schema = @(
            @{name="name";type="text";required=$true}
            @{name="price";type="number"}
            @{name="currency";type="text"}
            @{name="period";type="text"}
            @{name="description";type="text"}
            @{name="features";type="json"}
            @{name="notIncluded";type="json"}
            @{name="highlighted";type="bool"}
            @{name="badge";type="text"}
            @{name="ctaLabel";type="text"}
            @{name="ctaHref";type="text"}
            @{name="order";type="number"}
        )
    } | ConvertTo-Json -Depth 5)
    Write-Host "Creada: $($r.name)" -ForegroundColor Green
} catch { Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red }

Write-Host "Creando coleccion services..." -ForegroundColor Cyan
try {
    $r = Invoke-RestMethod -Method POST -Uri "$PB/api/collections" -Headers $h -Body (@{
        name = "services"
        type = "base"
        schema = @(
            @{name="name";type="text";required=$true}
            @{name="description";type="text";required=$true}
            @{name="icon";type="text"}
            @{name="color";type="text"}
            @{name="features";type="json"}
            @{name="order";type="number"}
            @{name="active";type="bool"}
        )
    } | ConvertTo-Json -Depth 5)
    Write-Host "Creada: $($r.name)" -ForegroundColor Green
} catch { Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red }

Write-Host "`nInsertando datos en projects..." -ForegroundColor Cyan
$projs = @(
    @{name="Local Bar & Restaurant";slug="local-bar-restaurant";description="Sitio web para negocio local con menu y reservas online.";category="corporate";technologies=@("Next.js","TypeScript","Tailwind CSS");imageUrl="/screenshots/LOCAL.png";demoUrl="https://paginaweblocalejemplo.pages.dev/";featured=$true;order=1},
    @{name="Barber Shop Premium";slug="barber-shop-premium";description="Landing para barberia con sistema de turnos online.";category="landing";technologies=@("Next.js","React","CSS Modules");imageUrl="/screenshots/BARBER.png";demoUrl="https://barberejemplopagina.pages.dev/";featured=$true;order=2},
    @{name="Gym Fitness Landing";slug="gym-fitness-landing";description="Landing para gimnasio con planes de membresia.";category="landing";technologies=@("Next.js","TypeScript","Tailwind CSS");imageUrl="/screenshots/GYM.png";demoUrl="https://landingpageejemplo.pages.dev/";featured=$false;order=3}
)
foreach ($p in $projs) {
    try {
        Invoke-RestMethod -Method POST -Uri "$PB/api/collections/projects/records" -Headers $h -Body ($p | ConvertTo-Json) | Out-Null
        Write-Host "OK: $($p.name)" -ForegroundColor Green
    } catch { Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red }
}

Write-Host "`nInsertando datos en plans..." -ForegroundColor Cyan
$planes = @(
    @{name="Basico";price=150000;currency="ARS";period="proyecto";description="Ideal para pequenos negocios.";features=@("Hasta 5 paginas","Diseno responsive","SEO basico","1 mes soporte");notIncluded=@("E-commerce","Panel admin");highlighted=$false;badge="";ctaLabel="Comenzar";ctaHref="#contacto";order=1},
    @{name="Profesional";price=300000;currency="ARS";period="proyecto";description="Para empresas que buscan destacarse.";features=@("Hasta 15 paginas","Panel admin","SEO avanzado","3 meses soporte");notIncluded=@("E-commerce completo");highlighted=$true;badge="Mas elegido";ctaLabel="Solicitar";ctaHref="#contacto";order=2},
    @{name="Enterprise";price=0;currency="ARS";period="proyecto";description="Soluciones completas y personalizadas.";features=@("Paginas ilimitadas","E-commerce","6 meses soporte","Hosting incluido");notIncluded=@();highlighted=$false;badge="";ctaLabel="Contactar";ctaHref="#contacto";order=3}
)
foreach ($p in $planes) {
    try {
        Invoke-RestMethod -Method POST -Uri "$PB/api/collections/plans/records" -Headers $h -Body ($p | ConvertTo-Json) | Out-Null
        Write-Host "OK: $($p.name)" -ForegroundColor Green
    } catch { Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red }
}

Write-Host "`nInsertando servicios..." -ForegroundColor Cyan
$svcs = @(
    @{name="Desarrollo Web";description="Sitios web modernos y rapidos.";icon="Code";color="#4A90E2";features=@("Next.js","React","TypeScript");order=1;active=$true},
    @{name="E-commerce";description="Tiendas online completas.";icon="ShoppingCart";color="#6386fa";features=@("Carrito","Pagos","Panel admin");order=2;active=$true},
    @{name="Landing Pages";description="Paginas optimizadas para conversion.";icon="Rocket";color="#a8c8f8";features=@("SEO","Formularios","Analytics");order=3;active=$true},
    @{name="Diseno UI/UX";description="Interfaces atractivas e intuitivas.";icon="Palette";color="#4A90E2";features=@("Figma","Prototipos","Design System");order=4;active=$true},
    @{name="SEO";description="Mejora el posicionamiento en buscadores.";icon="Search";color="#6386fa";features=@("Keywords","Meta tags","Performance");order=5;active=$true},
    @{name="Mantenimiento";description="Soporte tecnico continuo.";icon="Wrench";color="#a8c8f8";features=@("Updates","Backup","Monitoreo");order=6;active=$true}
)
foreach ($s in $svcs) {
    try {
        Invoke-RestMethod -Method POST -Uri "$PB/api/collections/services/records" -Headers $h -Body ($s | ConvertTo-Json) | Out-Null
        Write-Host "OK: $($s.name)" -ForegroundColor Green
    } catch { Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red }
}

Write-Host "`nSetup completado!" -ForegroundColor Green
