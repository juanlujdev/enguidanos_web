# Migración a Vite — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar la SPA de Enguídanos de React-sin-bundler a Vite, extrayendo datos a JSON editables y dividiendo los megaarchivos JSX en un archivo por componente/página.

**Architecture:** Vite 5 + React 18 produce un bundle estático en `dist/` listo para subir a Hostinger. Los datos de contenido (eventos, patrimonio, POIs, etc.) viven en archivos JSON en `src/data/` — editables sin tocar código de componentes. Los componentes se organizan en `src/components/shared/` y `src/components/pages/`.

**Tech Stack:** Vite 5, React 18, `@vitejs/plugin-react`, Leaflet + MarkerCluster (siguen desde CDN), Google Fonts (CDN).

---

## Estructura de archivos objetivo

```
enguidanos_web/
├── public/
│   └── assets/               ← imágenes y PDFs (movidos desde raíz)
├── src/
│   ├── data/
│   │   ├── pueblo.json
│   │   ├── highlights.json
│   │   ├── pois.json
│   │   ├── poi-cats.json
│   │   ├── agenda-cats.json
│   │   ├── eventos.json
│   │   ├── patrimonio.json
│   │   ├── patrimonio-cats.json
│   │   ├── naturaleza.json
│   │   ├── naturaleza-cats.json
│   │   ├── naturaleza-rios.json
│   │   ├── naturaleza-fuentes.json
│   │   ├── rutas.json
│   │   ├── galeria.json
│   │   ├── noticias.json
│   │   ├── areas-content.json
│   │   ├── alcalde.json
│   │   ├── restaurantes.json
│   │   ├── alojamientos.json
│   │   └── historia.json
│   ├── utils/
│   │   └── eventos.js            ← parseEvDate, expandEventos, MES_ABBR
│   ├── components/
│   │   ├── shared/
│   │   │   ├── Icon.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Marquee.jsx
│   │   │   ├── Highlights.jsx
│   │   │   ├── InteractiveMap.jsx
│   │   │   ├── Gallery.jsx
│   │   │   ├── AgendaPreview.jsx
│   │   │   ├── News.jsx
│   │   │   └── Visit.jsx
│   │   └── pages/
│   │       ├── Home.jsx
│   │       ├── HistoriaPage.jsx
│   │       ├── AgendaPage.jsx
│   │       ├── NaturalezaPage.jsx
│   │       ├── PatrimonioPage.jsx
│   │       ├── RestaurantesPage.jsx
│   │       ├── AlojamientosPage.jsx
│   │       ├── AyuntamientoPage.jsx
│   │       ├── OficinaTurismoPage.jsx
│   │       ├── TurismoPage.jsx
│   │       └── TurismoDeportivoPage.jsx
│   ├── tweaks/
│   │   └── TweaksPanel.jsx
│   ├── styles.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

---

## FASE 1 — Vite compila el proyecto

### Tarea 1: Crear package.json y vite.config.js

**Files:**
- Create: `package.json`
- Create: `vite.config.js`

- [ ] **Paso 1: Crear package.json**

```json
{
  "name": "enguidanos-web",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.0"
  }
}
```

- [ ] **Paso 2: Crear vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist' },
})
```

- [ ] **Paso 3: Instalar dependencias**

```powershell
npm install
```

Resultado esperado: carpeta `node_modules/` creada, sin errores.

- [ ] **Paso 4: Commit**

```bash
git add package.json vite.config.js package-lock.json
git commit -m "build: inicializar Vite como bundler"
```

---

### Tarea 2: Crear index.html y src/main.jsx

**Files:**
- Create: `index.html`
- Create: `src/main.jsx`

El `index.html` de Vite reemplaza a `Enguidanos Rediseno.html`. Leaflet sigue en CDN (no se instala por npm para evitar problemas con MarkerCluster). React y Babel se eliminan del CDN porque Vite los gestiona.

- [ ] **Paso 1: Crear index.html en la raíz**

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Enguídanos · Atracción Natural</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Fraunces:ital,wght@0,400;0,500;1,400&family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Libre+Caslon+Text:ital,wght@0,400;1,400&family=Manrope:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&family=Work+Sans:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" crossorigin="" />
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" crossorigin="" />
</head>
<body>
<div id="root"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
<script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js" crossorigin=""></script>
<script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

- [ ] **Paso 2: Crear src/main.jsx**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

- [ ] **Paso 3: Commit**

```bash
git add index.html src/main.jsx
git commit -m "build: añadir index.html de Vite y main.jsx"
```

---

### Tarea 3: Mover archivos al directorio src/ y convertir a ES modules

**Files:**
- Move: `styles.css` → `src/styles.css`
- Move: `tweaks-panel.jsx` → `src/tweaks/TweaksPanel.jsx`
- Move: `data.jsx` → `src/data.jsx` (temporal, hasta Fase 2)
- Move: `data-historia.jsx` → `src/data-historia.jsx` (temporal, hasta Fase 2)
- Move: `components-shared.jsx` → `src/components-shared.jsx` (temporal, hasta Fase 3)
- Move: `components-pages.jsx` → `src/components-pages.jsx` (temporal, hasta Fase 3)
- Move: `components-restaurantes.jsx` → `src/components-restaurantes.jsx` (temporal, hasta Fase 3)
- Move: `components-alojamientos.jsx` → `src/components-alojamientos.jsx` (temporal, hasta Fase 3)
- Move: `app.jsx` → `src/App.jsx`
- Move: `assets/` → `public/assets/`

- [ ] **Paso 1: Mover archivos con PowerShell**

```powershell
# Crear directorios
New-Item -ItemType Directory -Force src
New-Item -ItemType Directory -Force src/tweaks
New-Item -ItemType Directory -Force public/assets

# Mover styles
Move-Item styles.css src/styles.css

# Mover JSX a src/ (flat por ahora)
Move-Item tweaks-panel.jsx src/tweaks/TweaksPanel.jsx
Move-Item data.jsx src/data.jsx
Move-Item data-historia.jsx src/data-historia.jsx
Move-Item components-shared.jsx src/components-shared.jsx
Move-Item components-pages.jsx src/components-pages.jsx
Move-Item components-restaurantes.jsx src/components-restaurantes.jsx
Move-Item components-alojamientos.jsx src/components-alojamientos.jsx
Move-Item app.jsx src/App.jsx

# Mover assets al directorio public/
Move-Item assets/* public/assets/
Remove-Item assets -Force
```

- [ ] **Paso 2: Actualizar src/data.jsx — convertir window globals a exports**

Localizar la última línea del archivo (actualmente `Object.assign(window, { ... })`):

```js
// ELIMINAR esta línea al final de src/data.jsx:
Object.assign(window, {
  PUEBLO, HIGHLIGHTS, POIS, POI_CAT, EVENTOS, AGENDA_CATS, parseEvDate, expandEventos, TRAMITES, AREAS_CONTENT, ALCALDE, NOTICIAS, GALERIA, PATRIMONIO, PATRIMONIO_CATS,
  NATURALEZA, NATURALEZA_CATS, NATURALEZA_DESTACADO, NATURALEZA_RIOS, NATURALEZA_FUENTES, RUTAS_INFO,
});

// REEMPLAZAR con:
export {
  PUEBLO, HIGHLIGHTS, POIS, POI_CAT, EVENTOS, AGENDA_CATS, parseEvDate, expandEventos, MES_ABBR,
  TRAMITES, AREAS_CONTENT, ALCALDE, NOTICIAS, GALERIA, PATRIMONIO, PATRIMONIO_CATS,
  NATURALEZA, NATURALEZA_CATS, NATURALEZA_DESTACADO, NATURALEZA_RIOS, NATURALEZA_FUENTES, RUTAS_INFO,
};
```

- [ ] **Paso 3: Actualizar src/data-historia.jsx — convertir window globals a exports**

Localizar la última línea (actualmente `Object.assign(window, { HISTORIA, HISTORIA_META })`):

```js
// ELIMINAR:
Object.assign(window, { HISTORIA, HISTORIA_META });

// REEMPLAZAR con:
export { HISTORIA, HISTORIA_META };
```

- [ ] **Paso 4: Actualizar src/tweaks/TweaksPanel.jsx — añadir import React y exports**

Al inicio del archivo, añadir como primera línea:

```js
import React from 'react'
const { useState, useEffect, useRef } = React;
```

Al final del archivo, añadir:

```js
export { useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider, TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton };
```

- [ ] **Paso 5: Actualizar src/components-shared.jsx — añadir imports**

Reemplazar la primera línea (el comentario `/* global ... */`) con imports reales:

```js
// ELIMINAR:
/* global React, PUEBLO, HIGHLIGHTS, POIS, POI_CAT, EVENTOS, AGENDA_CATS, parseEvDate, expandEventos, TRAMITES, NOTICIAS, GALERIA, PATRIMONIO */
const { useState, useEffect, useRef, useMemo } = React;

// REEMPLAZAR con:
import React from 'react'
const { useState, useEffect, useRef, useMemo } = React;
import { PUEBLO, HIGHLIGHTS, POIS, POI_CAT, EVENTOS, AGENDA_CATS, parseEvDate, expandEventos, NOTICIAS, GALERIA, PATRIMONIO } from './data.jsx'
```

Al final del archivo, añadir:

```js
export { Icon, Header, Hero, Marquee, Highlights, CabrielFeature, InteractiveMap, AgendaPreview, Gallery, News, Visit, Footer };
```

- [ ] **Paso 6: Actualizar src/components-pages.jsx — añadir imports**

Reemplazar la primera línea (el comentario `/* global ... */`) con imports reales. Primero, leer el comentario `/* global */` actual en components-pages.jsx para saber exactamente qué consume, luego añadir:

```js
import React from 'react'
const { useState, useEffect, useRef, useMemo } = React;
import {
  PUEBLO, POIS, POI_CAT, EVENTOS, AGENDA_CATS, parseEvDate, expandEventos, MES_ABBR,
  TRAMITES, AREAS_CONTENT, ALCALDE, NOTICIAS, PATRIMONIO, PATRIMONIO_CATS,
  NATURALEZA, NATURALEZA_CATS, NATURALEZA_DESTACADO, NATURALEZA_RIOS, NATURALEZA_FUENTES, RUTAS_INFO
} from './data.jsx'
import { HISTORIA, HISTORIA_META } from './data-historia.jsx'
import { Icon, Header, Hero, Marquee, Highlights, CabrielFeature, InteractiveMap, AgendaPreview, Gallery, News, Visit, Footer } from './components-shared.jsx'
```

Al final del archivo, añadir:

```js
export { NaturalezaPage, PatrimonioPage, HistoriaPage, AgendaPage, AyuntamientoPage, OficinaTurismoPage, TurismoPage, TurismoDeportivoPage };
```

- [ ] **Paso 7: Actualizar src/components-restaurantes.jsx — añadir imports**

Reemplazar el `/* global */` inicial con:

```js
import React from 'react'
const { useState } = React;
```

Al final del archivo, añadir:

```js
export { RestaurantesPage };
```

- [ ] **Paso 8: Actualizar src/components-alojamientos.jsx — añadir imports**

Reemplazar el `/* global */` inicial con:

```js
import React from 'react'
const { useState } = React;
```

Al final del archivo, añadir:

```js
export { AlojamientosPage };
```

- [ ] **Paso 9: Reescribir src/App.jsx — imports reales y eliminar ReactDOM.createRoot**

Reemplazar completamente las primeras dos líneas actuales:

```js
// ELIMINAR estas líneas al inicio:
/* global React, ReactDOM, Header, Hero, ... */
const { useState, useEffect } = React;

// REEMPLAZAR con:
import React, { useState, useEffect } from 'react'
import { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect, TweakColor, TweakToggle } from './tweaks/TweaksPanel.jsx'
import { Header, Hero, Marquee, Highlights, InteractiveMap, AgendaPreview, Gallery, News, Visit, Footer } from './components-shared.jsx'
import { NaturalezaPage, PatrimonioPage, HistoriaPage, AgendaPage, AyuntamientoPage, OficinaTurismoPage, TurismoPage, TurismoDeportivoPage } from './components-pages.jsx'
import { RestaurantesPage } from './components-restaurantes.jsx'
import { AlojamientosPage } from './components-alojamientos.jsx'
```

Eliminar la última línea del archivo:

```js
// ELIMINAR esta línea (main.jsx ya la gestiona):
ReactDOM.createRoot(document.getElementById("root")).render(<App />);

// REEMPLAZAR con:
export default App;
```

- [ ] **Paso 10: Verificar que el servidor de desarrollo arranca**

```powershell
npm run dev
```

Abrir `http://localhost:5173` en el navegador. El sitio debe verse idéntico al original.

Si hay errores en consola, corregirlos antes de continuar. Errores comunes:
- `X is not defined` → falta un `export` en el archivo que lo define o un `import` en el que lo consume
- `Cannot find module` → revisar rutas relativas de imports

- [ ] **Paso 11: Commit**

```bash
git add src/ public/ index.html
git commit -m "build: migrar archivos a src/, convertir a ES modules"
```

---

### Tarea 4: Verificar build de producción básico

**Files:** ninguno nuevo

- [ ] **Paso 1: Ejecutar build**

```powershell
npm run build
```

Resultado esperado: carpeta `dist/` creada sin errores. Puede haber warnings (tamaño de chunks) — son normales y no bloquean.

- [ ] **Paso 2: Previsualizar la build localmente**

```powershell
npm run preview
```

Abrir `http://localhost:4173`. Verificar:
- El mapa Leaflet carga y muestra POIs
- Las imágenes se muestran (assets servidos desde `public/`)
- El dark mode funciona
- El panel de tweaks aparece

- [ ] **Paso 3: Commit**

```bash
git add dist/
git commit -m "build: primera build de producción con Vite funcional"
```

---

## FASE 2 — Datos en JSON

### Tarea 5: Crear utilidades de eventos y JSON de datos simples

**Files:**
- Create: `src/utils/eventos.js`
- Create: `src/data/pueblo.json`
- Create: `src/data/highlights.json`
- Create: `src/data/pois.json`
- Create: `src/data/poi-cats.json`
- Create: `src/data/agenda-cats.json`
- Create: `src/data/galeria.json`
- Create: `src/data/noticias.json`
- Create: `src/data/alcalde.json`

- [ ] **Paso 1: Crear src/utils/eventos.js**

Extraer las tres funciones/constantes que no pueden ir en JSON:

```js
export const MES_ABBR = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];

export function parseEvDate(date) {
  const [y, m, d] = String(date).split("-").map(Number);
  const mi = (m || 1) - 1;
  return { y, mi, day: d || null, abbr: MES_ABBR[mi] };
}

export function expandEventos(list) {
  const out = [];
  for (const e of list) {
    if (e.dias && e.dias.length) {
      e.dias.forEach((dia, i) => out.push({
        ...e,
        date: dia.date,
        dayLabel: dia.label,
        items: dia.items || [],
        when: dia.label,
        multi: true,
        key: e.title + "|" + dia.date + "|" + i,
      }));
    } else {
      out.push({ ...e, items: e.items || null, key: e.title + "|" + e.date });
    }
  }
  return out;
}
```

- [ ] **Paso 2: Crear src/data/poi-cats.json**

Copiar `POI_CAT` de `src/data.jsx` al nuevo archivo:

```json
{
  "natura":      { "label": "Naturaleza",  "color": "#4a6b3a" },
  "miradores":   { "label": "Miradores",   "color": "#b5566e" },
  "patrimonio":  { "label": "Patrimonio",  "color": "#c2562a" },
  "fuentes":     { "label": "Fuentes",     "color": "#2d8e9c" },
  "comer":       { "label": "Comer",       "color": "#d4a017" },
  "dormir":      { "label": "Dormir",      "color": "#2d6a8e" },
  "servicios":   { "label": "Servicios",   "color": "#7a6a9c" }
}
```

- [ ] **Paso 3: Crear src/data/agenda-cats.json**

Copiar `AGENDA_CATS` de `src/data.jsx`:

```json
{
  "fest":     { "label": "Fiestas",      "color": "#c2562a" },
  "cult":     { "label": "Cultura",      "color": "#4a6b3a" },
  "nat":      { "label": "Naturaleza",   "color": "#2d6a8e" },
  "gastro":   { "label": "Gastronomía",  "color": "#b07d1f" },
  "form":     { "label": "Formación",    "color": "#8a6477" },
  "servicio": { "label": "Servicios",    "color": "#5a6b78" }
}
```

- [ ] **Paso 4: Crear src/data/pueblo.json, highlights.json, pois.json, galeria.json, noticias.json, alcalde.json**

Para cada uno, copiar el valor de la constante correspondiente en `src/data.jsx` al nuevo archivo JSON. Formato de cada uno:

`src/data/pueblo.json`:
```json
{
  "nombre": "Enguídanos",
  "provincia": "Cuenca",
  "comarca": "Serranía Baja",
  "habitantes": 286,
  "altitud": 802,
  "fundacion": "Siglo XI"
}
```

`src/data/highlights.json`: copiar el array `HIGHLIGHTS` como JSON (claves con comillas dobles, sin trailing commas).

`src/data/pois.json`: copiar el array `POIS` como JSON.

`src/data/galeria.json`: copiar el array `GALERIA` como JSON.

`src/data/noticias.json`: copiar el array `NOTICIAS` como JSON.

`src/data/alcalde.json`: copiar el objeto `ALCALDE` como JSON.

- [ ] **Paso 5: Actualizar src/data.jsx — importar desde JSON y utils en lugar de definir inline**

Reemplazar las definiciones de `PUEBLO`, `HIGHLIGHTS`, `POIS`, `POI_CAT`, `AGENDA_CATS`, `MES_ABBR`, `parseEvDate`, `expandEventos`, `GALERIA`, `NOTICIAS`, `ALCALDE` con imports:

```js
import PUEBLO from './data/pueblo.json'
import HIGHLIGHTS from './data/highlights.json'
import POIS from './data/pois.json'
import POI_CAT from './data/poi-cats.json'
import AGENDA_CATS from './data/agenda-cats.json'
import GALERIA from './data/galeria.json'
import NOTICIAS from './data/noticias.json'
import ALCALDE from './data/alcalde.json'
export { MES_ABBR, parseEvDate, expandEventos } from './utils/eventos.js'
```

Mantener en `src/data.jsx` por ahora las constantes aún no migradas a JSON (EVENTOS, TRAMITES, AREAS_CONTENT, PATRIMONIO, etc.).

Actualizar el `export {}` al final para que exporte solo las variables que aún se definen en el archivo.

- [ ] **Paso 6: Verificar en dev**

```powershell
npm run dev
```

Comprobar: home carga, mapa muestra POIs, galería muestra fotos.

- [ ] **Paso 7: Commit**

```bash
git add src/utils/ src/data/
git commit -m "refactor: extraer datos simples a JSON y utilidades de eventos"
```

---

### Tarea 6: Extraer datos de contenido complejo a JSON

**Files:**
- Create: `src/data/eventos.json`
- Create: `src/data/patrimonio.json`
- Create: `src/data/patrimonio-cats.json`
- Create: `src/data/naturaleza.json`
- Create: `src/data/naturaleza-cats.json`
- Create: `src/data/naturaleza-rios.json`
- Create: `src/data/naturaleza-fuentes.json`
- Create: `src/data/rutas.json`
- Create: `src/data/areas-content.json`
- Create: `src/data/restaurantes.json`
- Create: `src/data/alojamientos.json`

- [ ] **Paso 1: Crear src/data/eventos.json**

Copiar el array `EVENTOS` de `src/data.jsx` como JSON. Ejemplo de estructura de un evento con días múltiples:

```json
[
  {
    "date": "2026-02-03",
    "title": "San Blas",
    "cat": "fest",
    "lugar": "Pueblo",
    "poster": "assets/agenda/san-blas.webp",
    "desc": "Patrón de Enguídanos...",
    "dias": [
      { "date": "2026-02-03", "label": "Martes 3", "items": ["Misa solemne", "Procesión"] }
    ]
  }
]
```

- [ ] **Paso 2: Crear src/data/patrimonio.json y src/data/patrimonio-cats.json**

Copiar `PATRIMONIO` y `PATRIMONIO_CATS` de `src/data.jsx` como JSON.

- [ ] **Paso 3: Crear src/data/naturaleza.json, naturaleza-cats.json, naturaleza-rios.json, naturaleza-fuentes.json, rutas.json**

Copiar `NATURALEZA`, `NATURALEZA_CATS`, `NATURALEZA_DESTACADO`, `NATURALEZA_RIOS`, `NATURALEZA_FUENTES` y `RUTAS_INFO` de `src/data.jsx` como JSON. `NATURALEZA_DESTACADO` puede incluirse dentro de `naturaleza.json` o en un campo `destacado` del propio array.

- [ ] **Paso 4: Crear src/data/areas-content.json y src/data/tramites.json**

Copiar `AREAS_CONTENT` de `src/data.jsx` a `areas-content.json` y `TRAMITES` a `tramites.json` como arrays JSON separados. Añadir también `tramites.json` a la estructura de archivos objetivo al inicio de este plan.

- [ ] **Paso 5: Crear src/data/restaurantes.json**

Extraer el array `RESTAURANTES` de `src/components-restaurantes.jsx`:

```json
[
  {
    "id": "hostal-cabriel",
    "name": "Hostal El Cabriel",
    "tipo": "Mesón serrano",
    "desc": "...",
    "address": "...",
    "mapUrl": "...",
    "phones": ["969 ..."],
    "fotos": ["assets/restaurantes/hostal-cabriel-1.webp"]
  }
]
```

- [ ] **Paso 6: Crear src/data/alojamientos.json**

Extraer el array `ALOJAMIENTOS` de `src/components-alojamientos.jsx` como JSON.

- [ ] **Paso 7: Crear src/data/historia.json**

Copiar `HISTORIA` y `HISTORIA_META` de `src/data-historia.jsx` como un JSON con ambos campos:

```json
{
  "meta": {
    "kicker": "...",
    "lead": "...",
    "byline": "José Saíz Valero",
    "date": "Enero 2012"
  },
  "secciones": [
    {
      "id": "antiguedad",
      "nav": "Antigüedad",
      "era": "Siglos VIII a.C.–IV d.C.",
      "title": "Antigüedad",
      "content": [
        { "type": "p", "text": "..." }
      ]
    }
  ]
}
```

- [ ] **Paso 8: Reemplazar src/data.jsx y src/data-historia.jsx con imports de JSON**

Una vez todos los JSON están creados, reescribir `src/data.jsx` para que solo re-exporte desde JSON y utils:

```js
export { default as PUEBLO } from './data/pueblo.json'
export { default as HIGHLIGHTS } from './data/highlights.json'
export { default as POIS } from './data/pois.json'
export { default as POI_CAT } from './data/poi-cats.json'
export { default as EVENTOS } from './data/eventos.json'
export { default as AGENDA_CATS } from './data/agenda-cats.json'
export { default as PATRIMONIO } from './data/patrimonio.json'
export { default as PATRIMONIO_CATS } from './data/patrimonio-cats.json'
export { default as NATURALEZA } from './data/naturaleza.json'
export { default as NATURALEZA_CATS } from './data/naturaleza-cats.json'
export { default as NATURALEZA_DESTACADO } from './data/naturaleza.json'
export { default as NATURALEZA_RIOS } from './data/naturaleza-rios.json'
export { default as NATURALEZA_FUENTES } from './data/naturaleza-fuentes.json'
export { default as RUTAS_INFO } from './data/rutas.json'
export { default as GALERIA } from './data/galeria.json'
export { default as NOTICIAS } from './data/noticias.json'
export { default as AREAS_CONTENT } from './data/areas-content.json'
export { default as TRAMITES } from './data/tramites.json'
export { default as ALCALDE } from './data/alcalde.json'
export { MES_ABBR, parseEvDate, expandEventos } from './utils/eventos.js'
```

Reescribir `src/data-historia.jsx` de forma similar:

```js
import historia from './data/historia.json'
export const HISTORIA = historia.secciones
export const HISTORIA_META = historia.meta
```

- [ ] **Paso 9: Actualizar src/components-restaurantes.jsx — importar desde JSON**

Eliminar el array `RESTAURANTES` hardcodeado y añadir en su lugar:

```js
import RESTAURANTES from './data/restaurantes.json'
```

- [ ] **Paso 10: Actualizar src/components-alojamientos.jsx — importar desde JSON**

Eliminar el array `ALOJAMIENTOS` hardcodeado y añadir:

```js
import ALOJAMIENTOS from './data/alojamientos.json'
```

- [ ] **Paso 11: Verificar en dev**

```powershell
npm run dev
```

Comprobar: agenda muestra eventos, patrimonio muestra fichas, restaurantes y alojamientos cargan sus tarjetas, historia muestra el artículo.

- [ ] **Paso 12: Commit**

```bash
git add src/data/ src/utils/ src/data.jsx src/data-historia.jsx src/components-restaurantes.jsx src/components-alojamientos.jsx
git commit -m "refactor: extraer todo el contenido a archivos JSON"
```

---

## FASE 3 — Dividir megaarchivos JSX

### Tarea 7: Crear src/components/shared/ con componentes individuales

**Files:**
- Create: `src/components/shared/Icon.jsx`
- Create: `src/components/shared/Header.jsx`
- Create: `src/components/shared/Footer.jsx`
- Create: `src/components/shared/Hero.jsx`
- Create: `src/components/shared/Marquee.jsx`
- Create: `src/components/shared/Highlights.jsx`
- Create: `src/components/shared/CabrielFeature.jsx`
- Create: `src/components/shared/InteractiveMap.jsx`
- Create: `src/components/shared/Gallery.jsx`
- Create: `src/components/shared/AgendaPreview.jsx`
- Create: `src/components/shared/News.jsx`
- Create: `src/components/shared/Visit.jsx`
- Delete: `src/components-shared.jsx`

- [ ] **Paso 1: Crear src/components/shared/**

```powershell
New-Item -ItemType Directory -Force src/components/shared
```

- [ ] **Paso 2: Crear cada archivo de componente compartido**

Para cada componente, crear el archivo con este patrón. El código de la función viene de `src/components-shared.jsx` — copiar la función completa sin modificarla.

Ejemplo para `src/components/shared/Icon.jsx`:

```jsx
import React from 'react'

const Icon = {
  // ... (copiar el objeto Icon completo desde components-shared.jsx)
};

export default Icon;
```

Ejemplo para `src/components/shared/Header.jsx`:

```jsx
import React, { useState, useRef } from 'react'

// TURISMO_MENU (copiar desde components-shared.jsx)
const TURISMO_MENU = [ /* ... */ ];

function Header({ page, setPage, scrolled, transparent }) {
  // ... (copiar la función Header completa)
}

export default Header;
```

Repetir para cada uno: `Footer.jsx`, `Hero.jsx`, `Marquee.jsx`, `Highlights.jsx`, `CabrielFeature.jsx`, `InteractiveMap.jsx`, `Gallery.jsx`, `AgendaPreview.jsx`, `News.jsx`, `Visit.jsx`.

Cada archivo que consuma datos debe importarlos directamente:

```jsx
// En InteractiveMap.jsx:
import POIS from '../../data/pois.json'
import POI_CAT from '../../data/poi-cats.json'

// En AgendaPreview.jsx:
import EVENTOS from '../../data/eventos.json'
import AGENDA_CATS from '../../data/agenda-cats.json'
import { parseEvDate, expandEventos } from '../../utils/eventos.js'

// En Gallery.jsx:
import GALERIA from '../../data/galeria.json'

// En News.jsx:
import NOTICIAS from '../../data/noticias.json'

// En Highlights.jsx:
import HIGHLIGHTS from '../../data/highlights.json'
```

- [ ] **Paso 3: Crear src/components/shared/index.js (barrel export)**

```js
export { default as Icon } from './Icon.jsx'
export { default as Header } from './Header.jsx'
export { default as Footer } from './Footer.jsx'
export { default as Hero } from './Hero.jsx'
export { default as Marquee } from './Marquee.jsx'
export { default as Highlights } from './Highlights.jsx'
export { default as CabrielFeature } from './CabrielFeature.jsx'
export { default as InteractiveMap } from './InteractiveMap.jsx'
export { default as Gallery } from './Gallery.jsx'
export { default as AgendaPreview } from './AgendaPreview.jsx'
export { default as News } from './News.jsx'
export { default as Visit } from './Visit.jsx'
```

- [ ] **Paso 4: Actualizar src/App.jsx — importar desde la nueva ruta**

Reemplazar:
```js
import { Header, Hero, Marquee, Highlights, InteractiveMap, AgendaPreview, Gallery, News, Visit, Footer } from './components-shared.jsx'
```

Con:
```js
import { Header, Hero, Marquee, Highlights, InteractiveMap, AgendaPreview, Gallery, News, Visit, Footer } from './components/shared/index.js'
```

- [ ] **Paso 5: Eliminar src/components-shared.jsx**

```powershell
Remove-Item src/components-shared.jsx
```

- [ ] **Paso 6: Verificar en dev**

```powershell
npm run dev
```

Comprobar: home completo, header, footer, mapa, galería funcionan.

- [ ] **Paso 7: Commit**

```bash
git add src/components/shared/
git commit -m "refactor: dividir components-shared.jsx en archivos individuales"
```

---

### Tarea 8: Crear src/components/pages/ con páginas individuales

**Files:**
- Create: `src/components/pages/Home.jsx`
- Create: `src/components/pages/HistoriaPage.jsx`
- Create: `src/components/pages/AgendaPage.jsx`
- Create: `src/components/pages/NaturalezaPage.jsx`
- Create: `src/components/pages/PatrimonioPage.jsx`
- Create: `src/components/pages/AyuntamientoPage.jsx`
- Create: `src/components/pages/OficinaTurismoPage.jsx`
- Create: `src/components/pages/TurismoPage.jsx`
- Create: `src/components/pages/TurismoDeportivoPage.jsx`
- Create: `src/components/pages/RestaurantesPage.jsx`
- Create: `src/components/pages/AlojamientosPage.jsx`
- Delete: `src/components-pages.jsx`
- Delete: `src/components-restaurantes.jsx`
- Delete: `src/components-alojamientos.jsx`

- [ ] **Paso 1: Crear src/components/pages/**

```powershell
New-Item -ItemType Directory -Force src/components/pages
```

- [ ] **Paso 2: Crear cada archivo de página**

Para cada página, crear el archivo con este patrón. El código de la función viene de `src/components-pages.jsx`, `src/components-restaurantes.jsx` o `src/components-alojamientos.jsx`.

Ejemplo para `src/components/pages/NaturalezaPage.jsx`:

```jsx
import React, { useState, useEffect } from 'react'
import NATURALEZA from '../../data/naturaleza.json'
import NATURALEZA_CATS from '../../data/naturaleza-cats.json'
import NATURALEZA_RIOS from '../../data/naturaleza-rios.json'
import NATURALEZA_FUENTES from '../../data/naturaleza-fuentes.json'
import RUTAS_INFO from '../../data/rutas.json'

function NaturalezaPage({ navTarget }) {
  // ... (copiar la función completa desde components-pages.jsx)
}

export default NaturalezaPage;
```

Ejemplo para `src/components/pages/AgendaPage.jsx`:

```jsx
import React, { useState, useEffect } from 'react'
import EVENTOS from '../../data/eventos.json'
import AGENDA_CATS from '../../data/agenda-cats.json'
import { parseEvDate, expandEventos, MES_ABBR } from '../../utils/eventos.js'

function AgendaPage() {
  // ... (copiar la función completa)
}

export default AgendaPage;
```

Ejemplo para `src/components/pages/Home.jsx`:

```jsx
import React from 'react'
import { Hero, Marquee, Highlights, InteractiveMap, AgendaPreview, Gallery, News, Visit } from '../shared/index.js'

function Home({ setPage, navigate }) {
  return (
    <>
      <Hero setPage={setPage} />
      <Marquee />
      <Highlights setPage={setPage} navigate={navigate} />
      <InteractiveMap />
      <AgendaPreview setPage={setPage} />
      <Gallery />
      <News setPage={setPage} />
      <Visit setPage={setPage} />
    </>
  )
}

export default Home;
```

Nota: `Home.jsx` extrae del inline de `src/App.jsx` (el bloque `{page === "home" && (...)}`) — no viene de components-pages.jsx.

- [ ] **Paso 3: Crear src/components/pages/index.js (barrel export)**

```js
export { default as Home } from './Home.jsx'
export { default as HistoriaPage } from './HistoriaPage.jsx'
export { default as AgendaPage } from './AgendaPage.jsx'
export { default as NaturalezaPage } from './NaturalezaPage.jsx'
export { default as PatrimonioPage } from './PatrimonioPage.jsx'
export { default as RestaurantesPage } from './RestaurantesPage.jsx'
export { default as AlojamientosPage } from './AlojamientosPage.jsx'
export { default as AyuntamientoPage } from './AyuntamientoPage.jsx'
export { default as OficinaTurismoPage } from './OficinaTurismoPage.jsx'
export { default as TurismoPage } from './TurismoPage.jsx'
export { default as TurismoDeportivoPage } from './TurismoDeportivoPage.jsx'
```

- [ ] **Paso 4: Actualizar src/App.jsx — imports de páginas y simplificar home**

Reemplazar los imports de páginas:

```js
// ELIMINAR:
import { NaturalezaPage, PatrimonioPage, HistoriaPage, AgendaPage, AyuntamientoPage, OficinaTurismoPage, TurismoPage, TurismoDeportivoPage } from './components-pages.jsx'
import { RestaurantesPage } from './components-restaurantes.jsx'
import { AlojamientosPage } from './components-alojamientos.jsx'

// REEMPLAZAR con:
import { Home, NaturalezaPage, PatrimonioPage, HistoriaPage, AgendaPage, AyuntamientoPage, OficinaTurismoPage, TurismoPage, TurismoDeportivoPage, RestaurantesPage, AlojamientosPage } from './components/pages/index.js'
```

Simplificar el bloque `page === "home"` en el JSX de App:

```jsx
// REEMPLAZAR el bloque inline de home:
{page === "home" && (
  <>
    <Hero setPage={goClear} />
    <Marquee />
    ...
  </>
)}

// CON:
{page === "home" && <Home setPage={goClear} navigate={navigate} />}
```

Eliminar imports de componentes compartidos que ya no se usan directamente en App.jsx (Hero, Marquee, etc., ahora los usa Home.jsx):

```js
// ELIMINAR de App.jsx si ya no se usan directamente:
import { Header, Hero, Marquee, Highlights, InteractiveMap, AgendaPreview, Gallery, News, Visit, Footer } from './components/shared/index.js'

// MANTENER solo los que usa App directamente:
import { Header, Footer } from './components/shared/index.js'
```

- [ ] **Paso 5: Eliminar archivos legacy**

```powershell
Remove-Item src/components-pages.jsx
Remove-Item src/components-restaurantes.jsx
Remove-Item src/components-alojamientos.jsx
```

- [ ] **Paso 6: Verificar en dev navegando por todas las páginas**

```powershell
npm run dev
```

Navegar manualmente por todas las páginas: home, naturaleza, patrimonio, historia, agenda, restaurantes, alojamientos, ayuntamiento, turismo, turismo-deportivo, oficina-turismo.

- [ ] **Paso 7: Commit**

```bash
git add src/components/pages/
git commit -m "refactor: dividir components-pages en un archivo por página"
```

---

## FASE 4 — Build de producción y verificación final

### Tarea 9: Build final y preparación para Hostinger

**Files:** ninguno nuevo

- [ ] **Paso 1: Build de producción**

```powershell
npm run build
```

Si hay warnings de chunks grandes (> 500 kB), no bloquean el deploy. Solo los errores detienen la build.

- [ ] **Paso 2: Previsualizar y verificar checklist completo**

```powershell
npm run preview
```

Abrir `http://localhost:4173` y verificar:

- [ ] Home carga con video/hero
- [ ] Mapa Leaflet muestra los 61 POIs y el clustering funciona
- [ ] Agenda muestra eventos y filtros de categoría
- [ ] Páginas Naturaleza y Patrimonio muestran fichas y filtros
- [ ] Restaurantes muestra las 4 tarjetas
- [ ] Alojamientos muestra los 5 establecimientos
- [ ] Historia muestra el artículo con índice lateral
- [ ] Ayuntamiento muestra áreas y PDFs son accesibles
- [ ] Dark mode (TweaksPanel) funciona
- [ ] Cambiar tipografía en TweaksPanel funciona
- [ ] Navegación entre páginas funciona (sin recarga)
- [ ] Deep-link `navTarget` funciona (ej. desde home → castillo en Patrimonio)

- [ ] **Paso 3: Verificar tamaño del bundle**

```powershell
npm run build -- --reporter verbose
```

Resultado esperado: JS total < 200 KB (gzipped). Si es mayor, revisar si Leaflet se está incluyendo en el bundle (debería no estarlo al estar en CDN).

- [ ] **Paso 4: Instrucciones de subida a Hostinger**

Para subir a Hostinger:
1. Ejecutar `npm run build` en local
2. Abrir el File Manager de Hostinger
3. Navegar a `public_html/` (o la carpeta del dominio)
4. Subir **el contenido de `dist/`** (no la carpeta `dist/` en sí, sino todo lo que hay dentro)
5. Verificar que `index.html` queda en la raíz de `public_html/`

- [ ] **Paso 5: Commit final**

```bash
git add -A
git commit -m "build: configuración de producción lista para Hostinger"
```

---

## Resumen de cambios por fase

| Fase | Resultado verificable |
|---|---|
| Fase 1 | `npm run dev` muestra el sitio idéntico al original |
| Fase 2 | Editar `src/data/eventos.json` cambia la agenda en dev |
| Fase 3 | Ningún archivo JSX supera ~200 líneas |
| Fase 4 | `dist/` lista para subir a Hostinger |
