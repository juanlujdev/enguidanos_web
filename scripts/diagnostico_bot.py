#!/usr/bin/env python3
"""
diagnostico_bot.py — Diagnóstico paso a paso Telegram → OpenRouter.

Ejecutar via GitHub Actions → "Diagnóstico bot" → Run workflow.
Requiere las mismas env vars que el bot principal:
  TELEGRAM_BOT_TOKEN, TELEGRAM_OWNER_ID, OPENROUTER_API_KEY
"""
import os, json, base64, sys
import requests
from PIL import Image
import io

# ── Config (igual que el bot) ─────────────────────────────────────────────────
TELEGRAM_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_OWNER = os.environ.get("TELEGRAM_OWNER_ID", "")
API_KEY        = os.environ.get("OPENROUTER_API_KEY", "")
ENDPOINT       = "https://openrouter.ai/api/v1/chat/completions"

MODEL          = "google/gemini-2.0-flash-001"      # el que usa el bot ahora (puede ser el problema)
MODEL_FALLBACK = "google/gemma-4-26b-a4b-it:free"  # el que funcionó en PowerShell

SYSTEM_PROMPT = (
    "Eres un asistente que extrae datos de publicaciones de eventos municipales. "
    "Devuelve SIEMPRE JSON válido con este esquema exacto: "
    '{"title":"...","desc":"...","date":"YYYY-MM-DD o null","when":"...o null",'
    '"place":"...o null","cat":"fest|cult|nat|gastro|form|servicio","tipo":"seccion|bando"}'
)

log_lines = []


# ── Helpers ───────────────────────────────────────────────────────────────────

def log(icon, step, detail):
    line = f"{icon} {step}\n   {detail}"
    print(line)
    log_lines.append(line)


def tg_send(text):
    if not TELEGRAM_TOKEN or not TELEGRAM_OWNER:
        print(f"[TG-SKIP] {text[:80]}")
        return
    try:
        requests.post(
            f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage",
            json={"chat_id": TELEGRAM_OWNER, "text": text},
            timeout=15,
        ).raise_for_status()
    except Exception as e:
        print(f"[TG-ERROR] {e}")


def or_call(model, messages, extra=None):
    payload = {"model": model, "messages": messages, "max_tokens": 300}
    if extra:
        payload.update(extra)
    return requests.post(
        ENDPOINT,
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
        json=payload,
        timeout=30,
    )


def make_test_images():
    """Genera JPEG y WebP de prueba (10×10 rojo) con PIL (misma lib que el bot)."""
    img = Image.new("RGB", (10, 10), color=(200, 50, 50))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    jpg_b64 = base64.b64encode(buf.getvalue()).decode()
    buf = io.BytesIO()
    img.save(buf, format="WEBP")
    webp_b64 = base64.b64encode(buf.getvalue()).decode()
    return jpg_b64, webp_b64


# ─────────────────────────────────────────────────────────────────────────────
# PASO 0 — Variables de entorno presentes
# ─────────────────────────────────────────────────────────────────────────────
missing = [name for name, val in [
    ("TELEGRAM_BOT_TOKEN", TELEGRAM_TOKEN),
    ("TELEGRAM_OWNER_ID",  TELEGRAM_OWNER),
    ("OPENROUTER_API_KEY", API_KEY),
] if not val]

if missing:
    log("❌", "PASO 0 — ENV VARS", f"Faltan: {', '.join(missing)}")
    print("Ejecuta este script via GitHub Actions con los secrets configurados.")
    sys.exit(1)

log("✅", "PASO 0 — ENV VARS", "TELEGRAM_BOT_TOKEN ✅  TELEGRAM_OWNER_ID ✅  OPENROUTER_API_KEY ✅")


# ─────────────────────────────────────────────────────────────────────────────
# PASO 1 — Telegram: mensaje a fuego (sin IA, solo verifica el bot)
# ─────────────────────────────────────────────────────────────────────────────
try:
    tg_send("🔧 [DIAG PASO 1] Telegram funciona ✅ — arrancando diagnóstico completo...")
    log("✅", "PASO 1 — TELEGRAM SEND", "Mensaje enviado. Si lo recibes en Telegram, el bot funciona.")
except Exception as e:
    log("❌", "PASO 1 — TELEGRAM SEND", str(e))


# ─────────────────────────────────────────────────────────────────────────────
# PASO 2 — OpenRouter: endpoint + API key con modelo fallback (conocido OK)
# ─────────────────────────────────────────────────────────────────────────────
try:
    r = or_call(MODEL_FALLBACK, [{"role": "user", "content": "Responde solo la palabra: OK"}])
    if r.status_code == 200:
        answer = r.json()["choices"][0]["message"]["content"].strip()[:80]
        log("✅", f"PASO 2 — ENDPOINT + API KEY [{MODEL_FALLBACK}]", f"Respuesta: '{answer}'")
    else:
        log("❌", f"PASO 2 — ENDPOINT + API KEY [{MODEL_FALLBACK}]",
            f"HTTP {r.status_code}: {r.text[:400]}")
except Exception as e:
    log("❌", "PASO 2 — ENDPOINT + API KEY", str(e))


# ─────────────────────────────────────────────────────────────────────────────
# PASO 3 — Modelo configurado en el bot (aquí puede estar el 404)
# ─────────────────────────────────────────────────────────────────────────────
try:
    r = or_call(MODEL, [{"role": "user", "content": "Responde solo la palabra: OK"}])
    if r.status_code == 200:
        answer = r.json()["choices"][0]["message"]["content"].strip()[:80]
        log("✅", f"PASO 3 — MODELO DEL BOT [{MODEL}]", f"Respuesta: '{answer}'")
    else:
        log("❌", f"PASO 3 — MODELO DEL BOT [{MODEL}]",
            f"HTTP {r.status_code}: {r.text[:400]}\n"
            f"   → Probable causa del 404 en producción. Ver PASO 3b.")

        # Buscar qué modelos Gemini sí están disponibles
        mods_r = requests.get(
            "https://openrouter.ai/api/v1/models",
            headers={"Authorization": f"Bearer {API_KEY}"},
            timeout=15,
        )
        if mods_r.status_code == 200:
            all_ids = [m["id"] for m in mods_r.json().get("data", [])]
            gemini_ids = [m for m in all_ids if "gemini" in m.lower()]
            log("ℹ️ ", "PASO 3b — MODELOS GEMINI DISPONIBLES EN TU CUENTA",
                "\n   ".join(gemini_ids) if gemini_ids else "Ninguno encontrado")
        else:
            log("⚠️ ", "PASO 3b — LISTADO DE MODELOS", f"HTTP {mods_r.status_code}")
except Exception as e:
    log("❌", f"PASO 3 — MODELO DEL BOT [{MODEL}]", str(e))


# ─────────────────────────────────────────────────────────────────────────────
# PASO 4 — System prompt + response_format json_object (sin imagen, fallback)
# ─────────────────────────────────────────────────────────────────────────────
try:
    r = or_call(
        MODEL_FALLBACK,
        [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": "Evento: Concierto de verano el 15 julio en la plaza mayor a las 21:00h"},
        ],
        {"response_format": {"type": "json_object"}, "temperature": 0.1},
    )
    if r.status_code == 200:
        raw    = r.json()["choices"][0]["message"]["content"]
        parsed = json.loads(raw)
        log("✅", f"PASO 4 — SYSTEM PROMPT + JSON [{MODEL_FALLBACK}]",
            json.dumps(parsed, ensure_ascii=False)[:250])
    else:
        log("❌", f"PASO 4 — SYSTEM PROMPT + JSON [{MODEL_FALLBACK}]",
            f"HTTP {r.status_code}: {r.text[:400]}")
except Exception as e:
    log("❌", "PASO 4 — SYSTEM PROMPT + JSON", str(e))


# ─────────────────────────────────────────────────────────────────────────────
# PASO 5 — Imagen JPEG (formato que usó PowerShell → funcionó)
# ─────────────────────────────────────────────────────────────────────────────
jpg_b64, webp_b64 = make_test_images()

try:
    user_content = [
        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{jpg_b64}"}},
        {"type": "text",      "text": "¿De qué color es la imagen? Responde en una palabra."},
    ]
    r = or_call(MODEL_FALLBACK, [{"role": "user", "content": user_content}])
    if r.status_code == 200:
        answer = r.json()["choices"][0]["message"]["content"].strip()[:120]
        log("✅", f"PASO 5 — IMAGEN JPEG [{MODEL_FALLBACK}]", f"Respuesta: '{answer}'")
    else:
        log("❌", f"PASO 5 — IMAGEN JPEG [{MODEL_FALLBACK}]",
            f"HTTP {r.status_code}: {r.text[:400]}")
except Exception as e:
    log("❌", "PASO 5 — IMAGEN JPEG", str(e))


# ─────────────────────────────────────────────────────────────────────────────
# PASO 6 — Imagen WebP (formato que convierte el bot real antes de enviar)
# ─────────────────────────────────────────────────────────────────────────────
try:
    user_content = [
        {"type": "image_url", "image_url": {"url": f"data:image/webp;base64,{webp_b64}"}},
        {"type": "text",      "text": "¿De qué color es la imagen? Responde en una palabra."},
    ]
    r = or_call(MODEL_FALLBACK, [{"role": "user", "content": user_content}])
    if r.status_code == 200:
        answer = r.json()["choices"][0]["message"]["content"].strip()[:120]
        log("✅", f"PASO 6 — IMAGEN WEBP [{MODEL_FALLBACK}]", f"Respuesta: '{answer}'")
    else:
        log("❌", f"PASO 6 — IMAGEN WEBP [{MODEL_FALLBACK}]",
            f"HTTP {r.status_code}: {r.text[:400]}")
except Exception as e:
    log("❌", "PASO 6 — IMAGEN WEBP", str(e))


# ─────────────────────────────────────────────────────────────────────────────
# PASO 7 — Flujo completo como el bot: sistema + WebP + JSON (fallback)
# ─────────────────────────────────────────────────────────────────────────────
try:
    user_content = [
        {"type": "image_url", "image_url": {"url": f"data:image/webp;base64,{webp_b64}"}},
        {"type": "text",      "text": "Cartel de fiestas de verano. 15 de julio. Plaza Mayor. 21:00h."},
    ]
    r = or_call(
        MODEL_FALLBACK,
        [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": user_content},
        ],
        {"response_format": {"type": "json_object"}, "temperature": 0.1},
    )
    if r.status_code == 200:
        raw    = r.json()["choices"][0]["message"]["content"]
        parsed = json.loads(raw)
        log("✅", f"PASO 7 — FLUJO COMPLETO sistema+webp+json [{MODEL_FALLBACK}]",
            json.dumps(parsed, ensure_ascii=False)[:250])
    else:
        log("❌", f"PASO 7 — FLUJO COMPLETO [{MODEL_FALLBACK}]",
            f"HTTP {r.status_code}: {r.text[:400]}")
except Exception as e:
    log("❌", "PASO 7 — FLUJO COMPLETO", str(e))


# ─────────────────────────────────────────────────────────────────────────────
# RESUMEN → Telegram + stdout (visible en el log de GitHub Actions)
# ─────────────────────────────────────────────────────────────────────────────
summary = "\n\n".join(log_lines)
tg_send(f"🔧 Diagnóstico finalizado:\n\n{summary}")

print("\n" + "=" * 60)
print("RESUMEN DIAGNÓSTICO")
print("=" * 60)
print(summary)
