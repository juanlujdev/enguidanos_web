#!/usr/bin/env python3
"""
procesar_telegram.py - Bot de Telegram para gestión de eventos de Enguídanos.
Clasificación automática con Gemini Flash y aprobación manual del administrador.

API keys se leen EXCLUSIVAMENTE de variables de entorno:
  TELEGRAM_BOT_TOKEN, TELEGRAM_OWNER_ID, GEMINI_API_KEY
"""

import os
import json
import base64
import datetime
import re
import unicodedata
from pathlib import Path

import requests
from PIL import Image
import io


# ── Paths (relativas a la raíz del repositorio) ───────────────────────────────
REPO_ROOT    = Path(__file__).resolve().parent.parent
STATE_FILE   = REPO_ROOT / "scripts" / "state.json"
PENDING_FILE = REPO_ROOT / "scripts" / "pending.json"
EVENTOS_FILE = REPO_ROOT / "public" / "data" / "eventos.json"
CARTELES_DIR = REPO_ROOT / "public" / "carteles"

# ── Constantes ────────────────────────────────────────────────────────────────
GEMINI_ENDPOINT = (
    "https://generativelanguage.googleapis.com/v1beta"
    "/models/gemini-2.0-flash:generateContent"
)

# Palabras clave de categoría (sin tildes; la normalización las elimina antes del lookup)
CATEGORY_KEYWORDS: dict[str, str] = {
    "FIESTAS":     "fest",
    "FIESTA":      "fest",
    "CULTURA":     "cult",
    "CULTURAL":    "cult",
    "NATURALEZA":  "nat",
    "GASTRONOMIA": "gastro",
    "GASTRO":      "gastro",
    "FORMACION":   "form",
    "SERVICIOS":   "servicio",
    "SERVICIO":    "servicio",
}


# ══════════════════════════════════════════════════════════════════════════════
# Funciones puras (con tests unitarios)
# ══════════════════════════════════════════════════════════════════════════════

def slugify(text: str, max_len: int = 40) -> str:
    """Convierte *text* a un slug ASCII en minúsculas de como máximo *max_len* caracteres."""
    # Descomponer caracteres acentuados (NFD) para poder eliminar los diacríticos
    text = unicodedata.normalize("NFD", text)
    # Quedarse solo con caracteres ASCII
    text = text.encode("ascii", "ignore").decode("ascii")
    # Minúsculas
    text = text.lower()
    # Reemplazar secuencias de caracteres no alfanuméricos por un guion
    text = re.sub(r"[^a-z0-9]+", "-", text)
    # Eliminar guiones al inicio y al final
    text = text.strip("-")
    # Truncar a max_len
    text = text[:max_len]
    # Eliminar posibles guiones al final tras el truncado
    text = text.rstrip("-")
    return text


def build_id(title: str, fecha: str | None) -> str:
    """Devuelve `{slugify(title)}-{fecha sin guiones}` o solo el slug si no hay fecha."""
    slug = slugify(title)
    if fecha:  # None y "" son falsy
        date_str = fecha.replace("-", "")
        return f"{slug}-{date_str}"
    return slug


def parse_reply(text: str) -> tuple | None:
    """Interpreta la respuesta de texto del propietario en Telegram.

    Retorna:
        ("yes", None)            para respuestas afirmativas
        ("no", None)             para respuestas negativas
        ("override_bando", None) para BANDO
        ("override", cat_key)    para palabras clave de categoría
        None                     si no se reconoce
    """
    if not text:
        return None

    # Normalizar tildes (mayúsculas y minúsculas) antes de comparar
    normalized = text.strip()
    normalized = (
        normalized
        .replace("Á", "A").replace("É", "E").replace("Í", "I")
        .replace("Ó", "O").replace("Ú", "U")
        .replace("á", "a").replace("é", "e").replace("í", "i")
        .replace("ó", "o").replace("ú", "u")
    )
    upper = normalized.upper()

    # Afirmativas
    if upper in ("SI", "YES", "S", "✅"):
        return ("yes", None)

    # Negativas
    if upper in ("NO", "N", "❌"):
        return ("no", None)

    # Bando
    if upper == "BANDO":
        return ("override_bando", None)

    # Palabras clave de categoría
    if upper in CATEGORY_KEYWORDS:
        return ("override", CATEGORY_KEYWORDS[upper])

    return None


def strip_json_fences(raw: str) -> str:
    """Elimina los delimitadores ```json … ``` que Gemini a veces añade."""
    stripped = raw.strip()
    pattern = r"^```(?:json)?\s*\n?(.*?)\n?```$"
    match = re.match(pattern, stripped, re.DOTALL)
    if match:
        return match.group(1).strip()
    return raw


# ══════════════════════════════════════════════════════════════════════════════
# Helpers de JSON
# ══════════════════════════════════════════════════════════════════════════════

def load_json(path, default):
    p = Path(path)
    if not p.exists():
        return default
    with open(p, encoding="utf-8") as f:
        return json.load(f)


def save_json(path, data):
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


# ══════════════════════════════════════════════════════════════════════════════
# Helpers de Telegram API
# ══════════════════════════════════════════════════════════════════════════════

def _telegram_base() -> str:
    """Devuelve la URL base del bot de Telegram."""
    token = os.environ["TELEGRAM_BOT_TOKEN"]
    return f"https://api.telegram.org/bot{token}"


def get_updates(offset: int) -> list:
    """Llama a Telegram getUpdates y devuelve la lista de actualizaciones."""
    url = f"{_telegram_base()}/getUpdates"
    resp = requests.get(url, params={"offset": offset, "timeout": 30}, timeout=35)
    resp.raise_for_status()
    return resp.json().get("result", [])


def send_message(chat_id, text: str) -> None:
    """Envía un mensaje de Telegram con parse_mode Markdown."""
    url = f"{_telegram_base()}/sendMessage"
    requests.post(
        url,
        json={"chat_id": chat_id, "text": text, "parse_mode": "Markdown"},
        timeout=15,
    ).raise_for_status()


def download_telegram_file(file_id: str) -> bytes:
    """Descarga los bytes de un archivo de Telegram a partir de su file_id."""
    base = _telegram_base()
    token = os.environ["TELEGRAM_BOT_TOKEN"]
    # Obtener la ruta del archivo
    url = f"{base}/getFile"
    resp = requests.get(url, params={"file_id": file_id}, timeout=15)
    resp.raise_for_status()
    file_path = resp.json()["result"]["file_path"]
    # Descargar el archivo
    download_url = f"https://api.telegram.org/file/bot{token}/{file_path}"
    data = requests.get(download_url, timeout=60)
    data.raise_for_status()
    return data.content


# ══════════════════════════════════════════════════════════════════════════════
# Helpers de imagen
# ══════════════════════════════════════════════════════════════════════════════

def image_to_webp(raw_bytes: bytes, max_width: int = 1200) -> bytes:
    """Convierte bytes de imagen a WebP, redimensionando si el ancho supera max_width."""
    img = Image.open(io.BytesIO(raw_bytes))
    # Normalizar el modo de color
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGBA")
    else:
        img = img.convert("RGB")
    # Redimensionar si es necesario
    if img.width > max_width:
        ratio = max_width / img.width
        new_height = int(img.height * ratio)
        img = img.resize((max_width, new_height), Image.LANCZOS)
    out = io.BytesIO()
    img.save(out, format="WEBP", quality=85)
    return out.getvalue()


# ══════════════════════════════════════════════════════════════════════════════
# Clasificación con Gemini
# ══════════════════════════════════════════════════════════════════════════════

_GEMINI_SYSTEM_PROMPT = """Eres un asistente que extrae datos de publicaciones de eventos municipales.
Devuelve SIEMPRE JSON válido (sin bloques de código) con este esquema exacto:
{
  "title": "Título del evento",
  "desc": "Descripción breve (1-2 frases)",
  "date": "YYYY-MM-DD o null si no se conoce",
  "when": "Texto legible de hora/día o null",
  "place": "Lugar o null",
  "cat": "fest|cult|nat|gastro|form|servicio",
  "tipo": "seccion|bando"
}
Categorías: fest=fiestas, cult=cultura/religioso, nat=naturaleza,
gastro=gastronomía, form=formación, servicio=servicios municipales.
tipo=bando para bandos municipales/avisos oficiales; tipo=seccion para el resto."""


def classify_with_gemini(text: str, image_b64: str | None = None) -> dict:
    """Llama a Gemini Flash para clasificar un mensaje reenviado. Devuelve dict."""
    api_key = os.environ["GEMINI_API_KEY"]

    parts = []
    if image_b64:
        parts.append({
            "inlineData": {
                "mimeType": "image/webp",
                "data": image_b64,
            }
        })
    parts.append({"text": text or "(sin texto)"})

    payload = {
        "system_instruction": {"parts": [{"text": _GEMINI_SYSTEM_PROMPT}]},
        "contents": [{"role": "user", "parts": parts}],
        "generationConfig": {"temperature": 0.1},
    }

    resp = requests.post(
        GEMINI_ENDPOINT,
        headers={
            "X-goog-api-key": api_key,
            "Content-Type": "application/json",
        },
        json=payload,
        timeout=30,
    )
    resp.raise_for_status()
    raw = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
    clean = strip_json_fences(raw)
    return json.loads(clean)


# ══════════════════════════════════════════════════════════════════════════════
# Lógica de publicación
# ══════════════════════════════════════════════════════════════════════════════

def format_confirmation_message(item: dict) -> str:
    """Formatea el mensaje de confirmación de Telegram para el primer elemento de la cola."""
    lines = [
        "*Nuevo evento pendiente de revisión*",
        "",
        f"*Título:* {item.get('title', '—')}",
        f"*Categoría:* {item.get('cat', '—')} · {item.get('tipo', '—')}",
        f"*Fecha:* {item.get('date') or '—'}",
        f"*Cuándo:* {item.get('when') or '—'}",
        f"*Lugar:* {item.get('place') or '—'}",
        f"*Descripción:* {item.get('desc', '—')}",
        "",
        (
            "Responde: *SI* (publicar) · *NO* (descartar) · *BANDO* "
            "· o categoría (FIESTAS, CULTURA, NATURALEZA, GASTRONOMIA, FORMACION, SERVICIOS)"
        ),
    ]
    return "\n".join(lines)


def process_confirmed_item(item: dict, chat_id) -> None:
    """Descarga imagen/PDF, convierte a WebP, guarda en carteles/, inserta en eventos.json."""
    item_id = item["id"]
    poster_path = None
    pdf_path = None

    # Asegurarse de que el directorio existe
    CARTELES_DIR.mkdir(parents=True, exist_ok=True)

    # Descargar y convertir imagen si existe
    if item.get("_photo_file_id"):
        raw = download_telegram_file(item["_photo_file_id"])
        webp_bytes = image_to_webp(raw)
        dest = CARTELES_DIR / f"{item_id}.webp"
        dest.write_bytes(webp_bytes)
        poster_path = f"carteles/{item_id}.webp"

    # Descargar PDF si existe
    if item.get("_pdf_file_id"):
        raw = download_telegram_file(item["_pdf_file_id"])
        dest = CARTELES_DIR / f"{item_id}.pdf"
        dest.write_bytes(raw)
        pdf_path = f"carteles/{item_id}.pdf"

    # Construir el registro a insertar en eventos.json
    record = {
        "id":                item_id,
        "fecha_publicacion": item.get("fecha_publicacion"),
        "tipo":              item.get("tipo"),
        "cat":               item.get("cat"),
        "title":             item.get("title"),
        "desc":              item.get("desc"),
        "date":              item.get("date"),
        "when":              item.get("when"),
        "place":             item.get("place"),
        "poster":            poster_path,
        "pdf":               pdf_path,
        "subtipo":           None,
        "fuente":            "telegram",
    }

    # Deduplicación e inserción al principio de eventos.json
    eventos = load_json(EVENTOS_FILE, [])
    existing_ids = {e.get("id") for e in eventos}
    if item_id not in existing_ids:
        eventos.insert(0, record)
        save_json(EVENTOS_FILE, eventos)


# ══════════════════════════════════════════════════════════════════════════════
# Orquestación principal
# ══════════════════════════════════════════════════════════════════════════════

def main() -> None:
    owner_id = os.environ["TELEGRAM_OWNER_ID"]

    state   = load_json(STATE_FILE, {"last_update_id": 0})
    pending = load_json(PENDING_FILE, [])

    updates = get_updates(state["last_update_id"] + 1)

    for update in updates:
        state["last_update_id"] = update["update_id"]
        # Guardar state inmediatamente para no reprocesar este update si el script falla
        save_json(STATE_FILE, state)

        msg = update.get("message") or update.get("channel_post")
        if not msg:
            continue

        chat_id = msg["chat"]["id"]
        text    = msg.get("text", "") or msg.get("caption", "") or ""

        # Verificar que el mensaje viene del propietario
        sender_id = (msg.get("from") or {}).get("id")
        if sender_id is None or str(sender_id) != owner_id:
            continue

        # Determinar si es un mensaje reenviado/con media o una respuesta del propietario
        is_forward = bool(
            msg.get("forward_from")
            or msg.get("forward_origin")
            or msg.get("forward_date")
            or msg.get("forward_from_chat")
        )
        has_media = bool(msg.get("photo") or msg.get("document"))
        is_new_publication = is_forward or has_media or (not pending and text.strip())

        if is_new_publication:
            # Clasificar con Gemini
            image_b64     = None
            photo_file_id = None
            pdf_file_id   = None

            if msg.get("photo"):
                # Tomar la foto de mayor resolución
                photo_file_id = msg["photo"][-1]["file_id"]
                raw = download_telegram_file(photo_file_id)
                webp = image_to_webp(raw)
                image_b64 = base64.b64encode(webp).decode()

            if msg.get("document"):
                doc  = msg["document"]
                mime = doc.get("mime_type", "")
                if mime == "application/pdf":
                    pdf_file_id = doc["file_id"]

            try:
                classified = classify_with_gemini(text, image_b64)
            except Exception as e:
                send_message(chat_id, f"⚠️ Error al clasificar con Gemini: {e}\nReenvía el mensaje para intentarlo de nuevo.")
                continue

            today      = datetime.date.today().isoformat()
            event_date = classified.get("date")
            item = {
                "id":                build_id(classified.get("title", "evento"), event_date),
                "fecha_publicacion": today,
                "tipo":              classified.get("tipo", "seccion"),
                "cat":               classified.get("cat"),
                "title":             classified.get("title", ""),
                "desc":              classified.get("desc", ""),
                "date":              event_date,
                "when":              classified.get("when"),
                "place":             classified.get("place"),
                "_photo_file_id":    photo_file_id,
                "_pdf_file_id":      pdf_file_id,
            }

            was_empty = len(pending) == 0
            pending.append(item)

            if was_empty:
                send_message(chat_id, format_confirmation_message(item))
            else:
                pos = len(pending)
                send_message(chat_id, f"Añadido a la cola (posición {pos})")

        else:
            # Tratar como respuesta del propietario
            if not pending:
                send_message(chat_id, "No hay eventos pendientes en la cola.")
                continue

            action  = parse_reply(text)
            current = pending[0]

            if action is None:
                send_message(
                    chat_id,
                    "No entendí la respuesta. Usa: *SI*, *NO*, *BANDO*, o una categoría "
                    "(FIESTAS, CULTURA, NATURALEZA, GASTRONOMIA, FORMACION, SERVICIOS).",
                )
                continue

            verb, cat_key = action

            if verb == "yes":
                process_confirmed_item(current, chat_id)
                pending.pop(0)
                send_message(chat_id, "✅ Publicado.")

            elif verb == "no":
                pending.pop(0)
                send_message(chat_id, "❌ Descartado.")

            elif verb == "override":
                current["cat"]  = cat_key
                current["tipo"] = "seccion"
                process_confirmed_item(current, chat_id)
                pending.pop(0)
                send_message(chat_id, f"✅ Publicado con categoría `{cat_key}`.")

            elif verb == "override_bando":
                current["tipo"] = "bando"
                current["cat"]  = None
                process_confirmed_item(current, chat_id)
                pending.pop(0)
                send_message(chat_id, "✅ Publicado como *bando*.")

            # Si quedan eventos en la cola, enviar el siguiente para revisión
            if pending:
                send_message(chat_id, format_confirmation_message(pending[0]))

    save_json(STATE_FILE, state)
    save_json(PENDING_FILE, pending)


if __name__ == "__main__":
    main()
