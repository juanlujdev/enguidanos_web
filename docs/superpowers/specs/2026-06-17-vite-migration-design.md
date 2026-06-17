# Migración a Vite — Diseño

**Fecha:** 2026-06-17  
**Proyecto:** Enguídanos Web  
**Estado:** Aprobado

---

## Contexto

El sitio web de Enguídanos es una SPA React de ~7.900 líneas sin bundler. React y Babel se cargan desde CDN en versiones de desarrollo, lo que significa que Babel transpila JSX en el navegador de cada visitante en cada carga. El contenido (eventos, patrimonio, POIs, etc.) está embebido en archivos JSX de hasta 1.310 líneas, lo que hace muy incómodo actualizarlo.

**Objetivo principal:** mejorar la mantenibilidad (actualizar contenido sin tocar código de componentes) y el rendimiento de carga para usuarios públicos.

---

## Alcance

### Incluido
- Introducir Vite como bundler (build en local, deploy de estáticos)
- Mover todos los datos a archivos JSON editables en `src/data/`
- Dividir los megaarchivos JSX en un archivo por componente/página
- Eliminar las 18+ variables globales en `window`

### Excluido (fuera de alcance)
- Migración a TypeScript
- Refactorización del CSS (`styles.css` permanece sin cambios)
- Gestor de estado externo (Redux, Zustand)
- Sistema de CMS o panel de administración
- Tests unitarios
- Cambios en la lógica de negocio o UI

---

## Arquitectura objetivo

### Stack
- **Bundler:** Vite 5 + `@vitejs/plugin-react`
- **Framework:** React 18 (mismo que ahora, en versión production)
- **Datos:** JSON estáticos importados via ES modules
- **Deploy:** Hostinger hosting compartido — subir carpeta `dist/` a `public_html/`

### Flujo de trabajo post-migración
```
editar src/data/eventos.json
  → npm run build
  → subir dist/ a Hostinger vía FTP
```

### Flujo de desarrollo
```
npm run dev   → localhost:5173 con hot-reload
npm run build → genera dist/ lista para producción
```

---

## Estructura de archivos

```
enguidanos_web/
├── public/
│   └── assets/                        ← sin cambios (imágenes, PDFs)
│       ├── agenda/
│       ├── alojamientos/
│       ├── ayuntamiento/
│       └── historia/
│
├── src/
│   ├── data/                          ← NUEVO: contenido editable en JSON
│   │   ├── pueblo.json
│   │   ├── pois.json
│   │   ├── eventos.json
│   │   ├── patrimonio.json
│   │   ├── naturaleza.json
│   │   ├── restaurantes.json
│   │   ├── alojamientos.json
│   │   ├── galeria.json
│   │   ├── noticias.json
│   │   └── historia.json
│   │
│   ├── components/
│   │   ├── shared/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── InteractiveMap.jsx
│   │   │   ├── Gallery.jsx
│   │   │   ├── AgendaPreview.jsx
│   │   │   ├── Highlights.jsx
│   │   │   ├── Marquee.jsx
│   │   │   └── Icon.jsx
│   │   │
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
│   │
│   ├── tweaks/
│   │   └── TweaksPanel.jsx            ← sin cambios
│   │
│   ├── styles.css                     ← sin cambios (movido aquí)
│   └── App.jsx                        ← sin cambios de lógica
│
├── index.html                         ← simplificado (Vite gestiona scripts)
├── vite.config.js
└── package.json
```

---

## Datos en JSON

Cada entidad de contenido tiene su propio archivo JSON. Ejemplo de actualización de un evento:

**Antes** (editar `data.jsx`, línea ~200, dentro de JSX):
```jsx
const EVENTOS = [
  { date: "2026-08-16", title: "Fiesta de la Vendimia", ... },
  ...
]
window.EVENTOS = EVENTOS
```

**Después** (editar `src/data/eventos.json`):
```json
[
  {
    "date": "2026-08-16",
    "title": "Fiesta de la Vendimia",
    "cat": "fiestas",
    "lugar": "Plaza Mayor",
    "desc": "Celebración anual de la vendimia."
  }
]
```

Los componentes importan los datos directamente:
```js
import eventos from '../data/eventos.json'
```

---

## Configuración Vite

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  }
})
```

---

## Deploy en Hostinger

1. Ejecutar `npm run build` en local
2. Subir el contenido de `dist/` a la carpeta `public_html` del dominio en Hostinger (FTP o File Manager)
3. No se requiere configuración especial del servidor — el enrutado es por estado React, no por rutas URL reales

---

## Plan de migración por fases

### Fase 1 — Vite compila el proyecto actual
**Objetivo:** `npm run dev` muestra el sitio idéntico al actual.
- Crear `package.json` y `vite.config.js`
- Adaptar `Enguidanos Rediseno.html` como `index.html` de Vite
- Convertir `window.X = ...` en exports de ES modules
- Verificar que todo el sitio funciona igual

### Fase 2 — Extraer datos a JSON
**Objetivo:** el contenido se edita en JSON, sin tocar JSX.
- Crear `src/data/` con un JSON por entidad
- Actualizar imports en todos los componentes que consumen datos
- Eliminar `data.jsx` y `data-historia.jsx`
- Verificar mapa, agenda, patrimonio, naturaleza

### Fase 3 — Dividir megaarchivos JSX
**Objetivo:** un archivo por componente/página.
- Dividir `components-pages.jsx` en 10 archivos en `src/components/pages/`
- Dividir `components-shared.jsx` en archivos individuales en `src/components/shared/`
- Sin cambios de lógica ni CSS

### Fase 4 — Build de producción y verificación
**Objetivo:** `dist/` lista para subir a Hostinger.
- `npm run build` sin errores ni warnings críticos
- Probar `dist/` en local con `npx serve dist`
- Verificar: mapa Leaflet, imágenes, PDFs, dark mode, tweaks panel
- Subir a Hostinger y confirmar

---

## Métricas de éxito

| Métrica | Hoy | Objetivo |
|---|---|---|
| Peso JS inicial (sin comprimir) | ~500 KB+ | < 150 KB |
| Babel en cliente | Sí (cada carga) | No |
| Editar un evento | Buscar en 939 líneas JSX | Editar JSON |
| Archivos JSX > 500 líneas | 2 (1310 + 734) | 0 |
| Variables globales en `window` | 18+ | 0 |
