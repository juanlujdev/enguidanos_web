# Agenda automática del Ayuntamiento de Enguídanos — Spec de diseño

**Fecha:** 2026-06-26  
**Estado:** Aprobado

---

## 1. Objetivo

Publicar de forma semiautomática en la web las publicaciones del Ayuntamiento (eventos de sección y bandos). El propietario reenvía cada publicación desde WhatsApp/Facebook a un bot privado de Telegram. La IA clasifica el contenido, el propietario confirma, y el resultado aparece en la web en la siguiente visita sin reconstruir nada a mano.

---

## 2. Stack

| Pieza | Tecnología |
|---|---|
| Web | React + Vite, GitHub Pages, repo público |
| Automatización | GitHub Actions (cron cada 15 min) |
| IA | Gemini Flash (capa gratuita, API key con tope de gasto) |
| Bot | Telegram (bot privado, solo acepta mensajes del propietario) |
| Script | Python 3, librerías: `Pillow`, `requests` |
| Imágenes | WebP, ancho máximo 1200 px |

---

## 3. Modelo de datos

### `public/data/eventos.json`

Fuente única de verdad para todas las publicaciones. Se mueve de `src/data/` a `public/data/` para que el frontend pueda leerlo con `fetch` en runtime (sin rebuild) y para que GitHub Actions pueda escribirlo directamente.

**Schema:**

```json
{
  "id": "concierto-verano-20260715",
  "fecha_publicacion": "2026-06-22",
  "tipo": "seccion",
  "cat": "fest",
  "title": "Concierto de verano en la plaza",
  "desc": "Descripción de hasta 5 líneas generada por Gemini o escrita manualmente.",
  "date": "2026-07-15",
  "when": "22:00",
  "place": "Plaza Mayor",
  "poster": "carteles/concierto-verano.webp",
  "pdf": null,
  "fuente": "telegram"
}
```

**Para bandos** (`tipo: "bando"`, `cat: null`, `date: null`):

```json
{
  "id": "bando-agua-20260622",
  "fecha_publicacion": "2026-06-22",
  "tipo": "bando",
  "cat": null,
  "title": "Bando — Corte de agua programado",
  "desc": "El martes 24 de junio se cortará el suministro de agua...",
  "date": null,
  "when": null,
  "place": null,
  "poster": "carteles/bando-agua.webp",
  "pdf": "carteles/bando-agua.pdf",
  "fuente": "telegram"
}
```

**Campos:**
- `id` — slug estable `<titulo-slug>-<YYYYMMDD>`. Evita duplicados si se reenvía dos veces.
- `fecha_publicacion` — fecha en que entra al sistema (ISO `YYYY-MM-DD`).
- `tipo` — `"seccion"` o `"bando"`. Primer enrutador de superficies.
- `cat` — categoría para eventos de sección: `fest`, `cult`, `nat`, `gastro`, `form`, `servicio`. `null` para bandos.
- `poster` — ruta relativa al WebP en `public/carteles/`. `null` si no hay cartel; el frontend usa `assets/escudo-enguidanos.webp` como fallback.
- `pdf` — ruta relativa a un PDF adjunto (solo bandos con documento). `null` si no aplica.
- `fuente` — `"telegram"` para los entrados por el bot; omitido en los datos históricos.
- `dias` — array de sub-días (campo heredado de eventos históricos multi-día). Los nuevos eventos del bot no generan este campo; si un evento tiene múltiples días se describe en `desc`.

### Ficheros eliminados / migrados

- `src/data/noticias.json` — eliminado. Sus entradas migran a `eventos.json` con `tipo: "seccion"`.
- Bandos estáticos de `areas-content.json` — migran a `eventos.json` con `tipo: "bando"`.

### Filtros por superficie

| Superficie | Filtro | Orden | Límite |
|---|---|---|---|
| Lo último de Enguídanos | cualquier `tipo` | `fecha_publicacion` desc | 3 |
| ¿Qué pasa en el pueblo? | `tipo="seccion"` + `date` ≥ hoy | `date` asc | 4 |
| Agenda / calendario | `tipo="seccion"` | `date` asc/desc según pestaña | todos |
| Bandos (Ayuntamiento) | `tipo="bando"` | `fecha_publicacion` desc | todos |

---

## 4. Automatización

### Secrets en GitHub Actions

| Secret | Descripción |
|---|---|
| `GEMINI_API_KEY` | Clave de la API de Gemini Flash |
| `TELEGRAM_BOT_TOKEN` | Token del bot de Telegram |
| `TELEGRAM_OWNER_ID` | ID numérico de Telegram del propietario |

Ninguna clave va en el código ni en ficheros del repo. La web pública no contiene claves.

### Ficheros de estado en el repo (no son secrets)

- `scripts/state.json` — `{"last_update_id": 0}`. Evita reprocesar mensajes ya vistos.
- `scripts/pending.json` — `[]`. Cola de publicaciones pendientes de confirmación.

### Workflow `.github/workflows/agenda.yml`

```yaml
on:
  schedule:
    - cron: '*/15 * * * *'
  workflow_dispatch:

permissions:
  contents: write
```

Pasos: checkout → setup Python 3 → `pip install requests Pillow` → ejecutar script → si hay cambios, `git commit + push` → el deploy existente se dispara automáticamente.

### Script `scripts/procesar_telegram.py`

**Flujo por cada ejecución del cron:**

```
1. Cargar state.json (last_update_id) y pending.json (cola)
2. getUpdates(offset = last_update_id + 1)
3. Para cada update nuevo:
   a. Ignorar si el remitente no es TELEGRAM_OWNER_ID
   b. Si es mensaje con foto/texto/documento (reenvío nuevo):
      → Llamar a Gemini con texto + imagen
      → Añadir propuesta al final de pending.json
      → Si la cola tenía items: "Añadido a la cola (posición N)"
      → Si era el primero: enviar propuesta de confirmación al propietario
   c. Si es texto de respuesta:
      → "SÍ"/"SI" → procesar el primer item de pending.json
      → "NO" → descartar el primer item de pending.json
      → Keyword de categoría (FIESTAS/CULTURA/NATURALEZA/GASTRONOMIA/
                              FORMACION/SERVICIOS/BANDO) → cambiar cat/tipo
                              del primer item y procesar
      → Tras resolver el primero: si quedan en cola, enviar propuesta del siguiente
4. Guardar state.json actualizado
5. Si hubo cambios en eventos.json o en carteles/: git add + commit + push
```

**Procesado de un item confirmado:**
1. Descargar imagen/PDF de Telegram
2. Si imagen: convertir a WebP con Pillow (max 1200 px de ancho)
3. Guardar en `public/carteles/<id>.webp` (y/o `.pdf`)
4. Generar `id` estable: `<title-slug>-<fecha_publicacion-sin-guiones>`
5. Comprobar que el `id` no existe ya en `eventos.json` (dedup)
6. Insertar al principio del array
7. Guardar `eventos.json`

**Prompt a Gemini** (texto + imagen base64):

```
Eres el clasificador de publicaciones del Ayuntamiento de Enguídanos.
Analiza el texto y/o imagen adjunta y devuelve SOLO un JSON con estos campos:
- tipo: "bando" o "seccion"
- cat: si tipo=seccion, una de: fest, cult, nat, gastro, form, servicio. Si bando: null
- title: título corto del evento o bando (máx 60 caracteres)
- desc: descripción clara y directa, máximo 5 líneas, para publicar en la web
- date: fecha del evento en YYYY-MM-DD (si aparece en el cartel o texto; si no, null)
- when: horario como string legible (ej: "Sábado · 20:00 h"; si no, null)
- place: lugar del evento (si aparece; si no, null)
Sin texto adicional. Solo el JSON.
Categorías de sección:
  fest=Fiestas, cult=Cultura, nat=Naturaleza, gastro=Gastronomía,
  form=Formación, servicio=Servicios
```

**Mensaje de confirmación al propietario:**

```
📋 [TIPO] · [CAT_LABEL si seccion]
📅 [date legible si existe]
📍 [place si existe]

*[title]*
[desc]

¿Publico? Responde:
✅ SÍ · ❌ NO · o una categoría para cambiarla:
FIESTAS CULTURA NATURALEZA GASTRONOMIA FORMACION SERVICIOS BANDO
```

---

## 5. Frontend

### Cambio transversal: fetch en runtime

Todos los componentes que hoy importan `eventos.json` estáticamente pasan a usar un hook compartido:

```js
// src/hooks/useEventos.js
export function useEventos() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/eventos.json')
      .then(r => r.json())
      .then(setData);
  }, []);
  return data;
}
```

`import.meta.env.BASE_URL` es `/enguidanos_web/` en producción y `/` en desarrollo, por lo que la ruta es correcta en ambos entornos.

### Cambios por componente

#### `src/components/shared/News.jsx` — "Lo último de Enguídanos"

- Usa `useEventos()`. Mientras carga: esqueleto (3 tarjetas vacías).
- Ordena por `fecha_publicacion` desc → primeros 3 (cualquier `tipo`).
- Tarjeta igual a la actual:
  - Imagen: `poster` si existe, `assets/escudo-enguidanos.webp` si no.
  - Tag: `AGENDA_CATS[cat].label` en mayúsculas (o `"BANDO"` para bandos).
  - Color de acento de la tarjeta: `AGENDA_CATS[cat].color` (o `#5a6b78` gris para bandos).
  - Título, desc (hasta 5 líneas), fecha de publicación formateada.

#### `src/components/shared/AgendaPreview.jsx` — "¿Qué pasa en el pueblo?"

- Usa `useEventos()`. Filtra `tipo === "seccion"` + `date >= hoy`. Los 4 más próximos.
- Diseño intacto (filas con fecha, título, horario, categoría).

#### `src/components/pages/AgendaPage.jsx`

- Usa `useEventos()`. Filtra `tipo === "seccion"`.
- Toda la lógica existente (calendario, tabs próximos/pasados, filtros, modal) permanece intacta.

#### `src/components/pages/AyuntamientoPage.jsx` — `BandosView`

- `BandosView` pasa a usar `useEventos()` en lugar de leer de `areas-content.json`.
- Filtra `tipo === "bando"`, ordena por `fecha_publicacion` desc.
- Muestra por bando: título, fecha de publicación, desc, cartel/logo (fallback escudo), PDF descargable si existe.
- El `BandosView` existente (con `cuerpo`, `campos`, `firmante`) se reemplaza por el nuevo formato dinámico. Los bandos históricos en `areas-content.json` se migran al JSON unificado.

#### `src/components/shared/Footer.jsx`

- Enlace "Bandos" llama a `navigate("ayuntamiento", "area:bandos")` (ya tiene la prop `navigate`).

#### `src/App.jsx`

- Sin cambios de rutas. `BandosView` sigue siendo una sub-vista dentro de `AyuntamientoPage`.

### Ficheros nuevos / movidos

| Acción | Fichero |
|---|---|
| Nuevo | `src/hooks/useEventos.js` |
| Movido | `src/data/eventos.json` → `public/data/eventos.json` |
| Nuevo (Action) | `public/carteles/` (carpeta de carteles generados) |
| Nuevo | `scripts/procesar_telegram.py` |
| Nuevo | `scripts/state.json` |
| Nuevo | `scripts/pending.json` |
| Nuevo | `.github/workflows/agenda.yml` |
| Eliminado | `src/data/noticias.json` |

---

## 6. Migración de datos existentes

1. Añadir a cada entrada existente de `eventos.json`: `tipo: "seccion"`, `id` generado, `fecha_publicacion` (= `date` como aproximación).
2. Convertir las 3 entradas de `noticias.json` a formato unificado y añadirlas a `eventos.json` con `tipo: "seccion"` (su `excerpt` pasa a `desc`, su `tag` se mapea al `cat` correspondiente).
3. Migrar los bandos de `areas-content.json` a `eventos.json` con `tipo: "bando"` (su `cuerpo` se une en un solo string para `desc`).

---

## 7. Seguridad

- Todas las claves en GitHub Actions Secrets. Nunca en el repo ni en logs.
- El script verifica `from_user.id === TELEGRAM_OWNER_ID` en cada update; ignora el resto.
- El workflow solo se dispara por `schedule` y `workflow_dispatch`. Sin `pull_request_target`.
- `GEMINI_API_KEY` dedicada a este proyecto con tope de gasto mensual en Google AI Studio.
- Los carteles se guardan en `public/carteles/` (acceso público). No se sube información sensible adicional.

---

## 8. Criterios de aceptación

- Reenviar publicación al bot → ≤15 min → propuesta de clasificación recibida por Telegram.
- Responder `SÍ` → ≤15 min → entrada en `eventos.json` + WebP commiteados, web actualizada.
- Publicación de sección futura aparece en "¿Qué pasa en el pueblo?" y en Agenda.
- Bando aparece en la sección Bandos de Ayuntamiento y en "Lo último"; NO en Agenda ni en "¿Qué pasa en el pueblo?".
- Reenvío duplicado no crea registro duplicado (dedup por `id`).
- Sin cartel → logo del Ayuntamiento en todas las superficies.
- Dos publicaciones enviadas sin confirmar → cola; el bot las presenta una a una.
- Responder con nombre de categoría → cambia la clasificación antes de publicar.
- Sin claves expuestas en el repo ni en los logs.
