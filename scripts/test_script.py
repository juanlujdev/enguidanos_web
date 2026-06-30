#!/usr/bin/env python3
"""
test_script.py - Tests unitarios para las funciones puras de procesar_telegram.py

Cubre: slugify, build_id, parse_reply, strip_json_fences

Uso:
    python scripts/test_script.py
"""

import sys
import os

# Forzar UTF-8 en la salida estándar (necesario en Windows con cp1252)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Añadir el directorio scripts al path para importar sin env vars
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from procesar_telegram import slugify, build_id, parse_reply, strip_json_fences, is_new_event, clean_model_artifacts


_failures = []


def test(name: str, got, expected) -> None:
    if got != expected:
        _failures.append(name)
        print(f"  ✗ FAIL: {name}")
        print(f"      got:      {got!r}")
        print(f"      expected: {expected!r}")
    else:
        print(f"  ✓ {name}")


# ── slugify ────────────────────────────────────────────────────────────────────
print("── slugify ───────────────────────────────────────────────────────────")

test("basic lowercase",          slugify("Fiesta Mayor"),           "fiesta-mayor")
test("accents removed",          slugify("Café España"),            "cafe-espana")
test("max_len truncation",       slugify("a" * 50),                 "a" * 40)
# "abcdefghi " * 5 → slug de 49 chars → al truncar a 40 queda con guion al final → se elimina
test("max_len trims hyphen",     slugify("abcdefghi " * 5),         "abcdefghi-abcdefghi-abcdefghi-abcdefghi")
test("special chars → hyphens", slugify("Hello, World! 2026"),     "hello-world-2026")
test("dots and colons",          slugify("v1.0: Update"),           "v1-0-update")
test("leading/trailing spaces",  slugify("  hello  "),              "hello")
test("multiple spaces merged",   slugify("San  Blas"),              "san-blas")

# ── build_id ───────────────────────────────────────────────────────────────────
print("── build_id ──────────────────────────────────────────────────────────")

test("with date",         build_id("San Blas", "2026-02-03"),        "san-blas-20260203")
test("without date None", build_id("Evento Genérico", None),         "evento-generico")
test("without date ''",   build_id("Test", ""),                      "test")
test("accented title",    build_id("Día del Río Mira", "2026-08-15"), "dia-del-rio-mira-20260815")

# ── parse_reply ────────────────────────────────────────────────────────────────
print("── parse_reply ───────────────────────────────────────────────────────")

# Afirmativas
test("SI uppercase",        parse_reply("SI"),     ("yes", None))
test("SÍ with accent",      parse_reply("SÍ"),     ("yes", None))
test("sí lowercase",        parse_reply("sí"),     ("yes", None))
test("YES",                 parse_reply("YES"),    ("yes", None))
test("S short",             parse_reply("S"),      ("yes", None))
test("✅ emoji",             parse_reply("✅"),     ("yes", None))

# Negativas
test("NO uppercase",        parse_reply("NO"),     ("no", None))
test("no lowercase",        parse_reply("no"),     ("no", None))
test("N short",             parse_reply("N"),      ("no", None))
test("❌ emoji",             parse_reply("❌"),     ("no", None))

# Bando
test("BANDO",               parse_reply("BANDO"),           ("override_bando", None))

# Categorías
test("cat FIESTAS",         parse_reply("FIESTAS"),          ("override", "fest"))
test("cat FIESTA",          parse_reply("FIESTA"),           ("override", "fest"))
test("cat CULTURA",         parse_reply("CULTURA"),          ("override", "cult"))
test("cat CULTURAL",        parse_reply("CULTURAL"),         ("override", "cult"))
test("cat NATURALEZA",      parse_reply("NATURALEZA"),       ("override", "nat"))
test("cat GASTRONOMIA",     parse_reply("GASTRONOMIA"),      ("override", "gastro"))
test("cat GASTRONOMÍA acc", parse_reply("GASTRONOMÍA"),      ("override", "gastro"))
test("cat GASTRO",          parse_reply("GASTRO"),           ("override", "gastro"))
test("cat FORMACION",       parse_reply("FORMACION"),        ("override", "form"))
test("cat FORMACIÓN acc",   parse_reply("FORMACIÓN"),        ("override", "form"))
test("cat SERVICIOS",       parse_reply("SERVICIOS"),        ("override", "servicio"))
test("cat SERVICIO",        parse_reply("SERVICIO"),         ("override", "servicio"))

# No reconocido / vacío
test("unrecognized",        parse_reply("hola"),             None)
test("empty string",        parse_reply(""),                 None)

# ── strip_json_fences ──────────────────────────────────────────────────────────
print("── strip_json_fences ─────────────────────────────────────────────────")

test(
    "json fences",
    strip_json_fences('```json\n{"key": "value"}\n```'),
    '{"key": "value"}',
)
test(
    "plain JSON no fences",
    strip_json_fences('{"key": "value"}'),
    '{"key": "value"}',
)
test(
    "fences without json label",
    strip_json_fences('```\n{"key": "value"}\n```'),
    '{"key": "value"}',
)
test(
    "fences with surrounding whitespace",
    strip_json_fences('  ```json\n{"a": 1}\n```  '),
    '{"a": 1}',
)

# ── is_new_event ───────────────────────────────────────────────────────────────
print("── is_new_event ──────────────────────────────────────────────────────────")

test("foto es evento nuevo",
    is_new_event({"photo": [{"file_id": "abc"}], "chat": {"id": 1}}, []),
    True)
test("foto con caption es siempre evento nuevo",
    is_new_event({"photo": [{"file_id": "abc"}], "caption": "concierto", "chat": {"id": 1}}, [{"id": "x"}]),
    True)
test("documento es evento nuevo",
    is_new_event({"document": {"file_id": "abc"}, "chat": {"id": 1}}, []),
    True)
test("texto SI con pendiente no es evento nuevo",
    is_new_event({"text": "SI", "chat": {"id": 1}}, [{"id": "x"}]),
    False)
test("texto libre sin pendiente es evento nuevo",
    is_new_event({"text": "Verbena el sabado en la plaza", "chat": {"id": 1}}, []),
    True)
test("texto libre con pendiente no es evento nuevo",
    is_new_event({"text": "algo cualquiera", "chat": {"id": 1}}, [{"id": "x"}]),
    False)
test("mensaje reenviado es siempre evento nuevo",
    is_new_event({"text": "SI", "forward_origin": {"date": 123}, "chat": {"id": 1}}, [{"id": "x"}]),
    True)

# ── clean_model_artifacts (artefactos Gemma 4) ────────────────────────────────
print("── clean_model_artifacts (artefactos Gemma 4) ───────────────────────")

test(
    "톱 sustituido por espacio",
    clean_model_artifacts("propietarios톱de톱solares"),
    "propietarios de solares",
)
test(
    "<pad> eliminado",
    clean_model_artifacts("texto<pad>limpio"),
    "textolimpio",
)
test(
    "ambos artefactos combinados",
    clean_model_artifacts("<pad>hola톱mundo"),
    "hola mundo",
)
test(
    "string limpio no cambia",
    clean_model_artifacts('{"title": "Bando"}'),
    '{"title": "Bando"}',
)

import json as _json
_raw_gemma = '{"title": "Aviso", "desc": "Aviso톱a톱los톱propietarios"}'
_parsed = _json.loads(clean_model_artifacts(_raw_gemma))
test(
    "JSON con 톱 parsea correctamente tras limpiar",
    _parsed["desc"],
    "Aviso a los propietarios",
)

# ── Resultado final ────────────────────────────────────────────────────────────
print()
if _failures:
    print(f"✗ {len(_failures)} test(s) fallaron: {', '.join(_failures)}")
    sys.exit(1)
else:
    print("✓ Todos los tests pasaron")
