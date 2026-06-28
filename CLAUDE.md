# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Cómo ejecutar el proyecto

No hay bundler ni proceso de build. Abrir `Enguidanos Rediseno.html` directamente en el navegador:

```powershell
# Windows — abrir en el navegador predeterminado
Start-Process "Enguidanos Rediseno.html"
```

Para desarrollo con recarga automática, usar un servidor local (evita restricciones CORS de `file://`):

```powershell
# Python (si disponible)
python -m http.server 8080

# Node.js (si disponible)
npx serve .
```

No hay linter, tests, ni dependencias de Node. Todo se carga desde CDN (unpkg, Google Fonts).

## Arquitectura

Aplicación React de una sola página sin bundler. React, ReactDOM y Babel se cargan como scripts UMD desde unpkg. Babel standalone compila JSX en el navegador en tiempo de carga.

### Flujo de archivos

```
Enguidanos Rediseno.html   ← entrada; carga todos los scripts en orden
  tweaks-panel.jsx         ← sistema de tweaks de diseño (standalone utility)
  data.jsx                 ← constantes de contenido: PUEBLO, HIGHLIGHTS, POIS, EVENTOS, etc.
  data-historia.jsx        ← datos de la sección Historia (HISTORIA, HISTORIA_META)
  components-shared.jsx    ← componentes compartidos: Header, Footer, Hero, Marquee,
                              InteractiveMap, Gallery, AgendaPreview, Icon, ...
  components-pages.jsx     ← páginas: HistoriaPage, AgendaPage, AyuntamientoPage,
                              NaturalezaPage, PatrimonioPage, OficinaTurismoPage, TurismoPage
  components-restaurantes.jsx  ← RestaurantesPage
  components-alojamientos.jsx  ← AlojamientosPage
  app.jsx                  ← componente App raíz; enrutado y sistema de tweaks
styles.css                 ← estilos globales con variables CSS
```

El orden de los `<script>` en el HTML importa: cada archivo asume que los anteriores ya han declarado sus globales.

### Enrutado

`app.jsx` gestiona el estado `page` con `useState`. No hay React Router. La función `navigate(dest, target)` cambia de página y opcionalmente pasa un `navTarget` para que la página destino haga scroll hasta un elemento concreto al montar.

### Sistema de tweaks

`tweaks-panel.jsx` expone `useTweaks`, `TweaksPanel`, `TweakSection`, `TweakColor`, `TweakToggle`, `TweakSelect`, `TweakRadio`. El objeto `TWEAK_DEFAULTS` en `app.jsx` (marcado con `/*EDITMODE-BEGIN*/` / `/*EDITMODE-END*/`) define los valores iniciales de acento, fuentes y densidad. Los cambios se aplican vía CSS custom properties en `document.documentElement`.

### Estilos

`styles.css` define todas las variables en `:root`: paleta (`--terracota`, `--bosque`, `--rio`, `--sol`), tipografía (`--font-serif`, `--font-sans`), sombras y radios. El modo oscuro se activa con `[data-theme="dark"]` en `<html>`. Las animaciones de aparición usan la clase `.reveal` + `.in` gestionada por un `IntersectionObserver` en `app.jsx`.

### Mapa interactivo

Leaflet + MarkerCluster cargados desde unpkg. Los POIs están en el array `POIS` de `data.jsx` con categorías (`natura`, `patrimonio`, `miradores`, `comer`, `dormir`, `fuentes`, `servicios`).

### Assets

Imágenes en `assets/` organizadas por sección (`agenda/`, `alojamientos/`, `ayuntamiento/`, `historia/`). PDFs de ordenanzas y plenos en `assets/ayuntamiento/`.

---

## Bot de Telegram — agenda automática

El bot clasifica eventos enviados por foto/texto al bot de Telegram y los publica en la web sin intervención manual (salvo confirmar con SI/NO).

### Flujo completo

```
Telegram → Cloudflare Worker → GitHub Actions → procesar_telegram.py → eventos.json → Deploy
```

### Ficheros clave

```
scripts/procesar_telegram.py   ← lógica principal; modos --mode scan|confirm
scripts/test_script.py         ← tests de funciones puras (44 tests)
scripts/pending.json           ← cola de eventos pendientes de confirmar
scripts/state.json             ← último update_id procesado
cloudflare/worker.js           ← webhook receiver; despacha a GitHub Actions
.github/workflows/agenda-scan.yml    ← clasifica mensajes nuevos con IA
.github/workflows/agenda-confirm.yml ← procesa SI/NO del propietario
.github/workflows/deploy.yml         ← se activa tras scan o confirm
```

### Credenciales y configuración externa

- **Cloudflare Worker**: `enguidanos-telegram-bot.juanilloxyz.workers.dev`
- **Cuenta Cloudflare**: juanilloxyz@gmail.com
- **GitHub repo**: `juanlujdev/enguidanos_web` (el usuario GitHub es `juanlujdev`, NO `lujanlopezjuan`)
- **Secrets del Worker** (Cloudflare → Settings → Variables and Secrets):
  - `GH_PAT` — Personal Access Token de GitHub con permiso Actions R/W (debe incluir el prefijo `github_pat_`)
  - `GH_REPO` — `juanlujdev/enguidanos_web`
  - `TELEGRAM_OWNER_ID` — ID numérico del propietario en Telegram
  - `TELEGRAM_SECRET_TOKEN` — token hexadecimal para validar el webhook

### Gotchas importantes

- El usuario GitHub es `juanlujdev`, no `lujanlopezjuan` (que es solo el nombre en git config)
- El `GH_PAT` en Cloudflare **debe incluir el prefijo `github_pat_`** completo — sin él, GitHub devuelve 401
- La API de GitHub requiere header `User-Agent` — ya incluido en `cloudflare/worker.js`
- Telegram bloquea `getUpdates` (error 409) mientras el webhook esté activo; el script lo maneja
- Al actualizar variables en Cloudflare con versioning activado, la nueva versión se despliega automáticamente
