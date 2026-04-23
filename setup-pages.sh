#!/usr/bin/env bash
# ────────────────────────────────────────────────────────────────────────────
# MOQU Shopify Setup – legt alle Pages an und füllt sie mit fertigem Content.
# Kann beliebig oft erneut laufen (idempotent) — bestehende Pages werden
# aktualisiert, neue angelegt.
#
# Voraussetzungen
#   1. Shopify Admin API Access Token  (Custom App → Install → Reveal Token)
#      Scopes: read_content, write_content
#   2. Shop-Domain (z.B. deinshop.myshopify.com)
#
# Aufruf
#   export SHOPIFY_STORE=deinshop.myshopify.com
#   export SHOPIFY_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxx
#   bash setup-pages.sh
# ────────────────────────────────────────────────────────────────────────────
set -euo pipefail

if [[ -z "${SHOPIFY_STORE:-}" || -z "${SHOPIFY_TOKEN:-}" ]]; then
  cat <<'EOF'
❌  SHOPIFY_STORE und SHOPIFY_TOKEN müssen gesetzt sein.

Beispiel:
  export SHOPIFY_STORE=deinshop.myshopify.com
  export SHOPIFY_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxx
  bash setup-pages.sh
EOF
  exit 1
fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
CONTENT_DIR="$SCRIPT_DIR/content"
API_BASE="https://${SHOPIFY_STORE}/admin/api/2024-10"

# JSON-escape helper (Python ist auf macOS immer vorhanden)
json_escape() {
  python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))'
}

# Gibt die ID einer bestehenden Page mit passendem Handle zurück – oder leer.
find_page_id() {
  local handle="$1"
  curl -sS "${API_BASE}/pages.json?handle=${handle}&limit=1&fields=id" \
    -H "X-Shopify-Access-Token: $SHOPIFY_TOKEN" \
    | python3 -c 'import json,sys;d=json.load(sys.stdin);print(d["pages"][0]["id"] if d.get("pages") else "")'
}

# Upsert: Page anlegen oder aktualisieren.
upsert_page() {
  local title="$1"
  local handle="$2"
  local suffix="$3"   # Template-Suffix (leer = Standard-Seite)
  local content_file="$4"

  local body_escaped
  if [[ -f "$content_file" ]]; then
    body_escaped="$(cat "$content_file" | json_escape)"
  else
    body_escaped='""'
  fi

  local title_escaped
  title_escaped="$(printf '%s' "$title" | json_escape)"

  local handle_escaped
  handle_escaped="$(printf '%s' "$handle" | json_escape)"

  local suffix_json
  if [[ -z "$suffix" ]]; then
    suffix_json="null"
  else
    suffix_json="\"$suffix\""
  fi

  local existing_id
  existing_id="$(find_page_id "$handle" || echo "")"

  if [[ -n "$existing_id" ]]; then
    echo "↺  $title  (aktualisiere bestehende Page #$existing_id)"
    local payload="{\"page\":{\"id\":$existing_id,\"title\":$title_escaped,\"handle\":$handle_escaped,\"body_html\":$body_escaped,\"template_suffix\":$suffix_json,\"published\":true}}"
    curl -sS -X PUT "${API_BASE}/pages/${existing_id}.json" \
      -H "X-Shopify-Access-Token: $SHOPIFY_TOKEN" \
      -H "Content-Type: application/json" \
      -d "$payload" > /dev/null
  else
    echo "+  $title  (lege neue Page an)"
    local payload="{\"page\":{\"title\":$title_escaped,\"handle\":$handle_escaped,\"body_html\":$body_escaped,\"template_suffix\":$suffix_json,\"published\":true}}"
    curl -sS -X POST "${API_BASE}/pages.json" \
      -H "X-Shopify-Access-Token: $SHOPIFY_TOKEN" \
      -H "Content-Type: application/json" \
      -d "$payload" > /dev/null
  fi
}

echo "📦  MOQU-Pages synchronisieren auf $SHOPIFY_STORE …"
echo ""

# Leistungs- & Info-Seiten → strukturierte Templates (Theme-Editor: Bilder + Text pro Block)
upsert_page "Möbelbau"     "moebelbau"    "moebelbau"    "$CONTENT_DIR/moebelbau.html"
upsert_page "Innenausbau"  "innenausbau"  "innenausbau"  "$CONTENT_DIR/innenausbau.html"
upsert_page "Küchenbau"    "kuechenbau"   "kuechenbau"   "$CONTENT_DIR/kuechenbau.html"
upsert_page "Über uns"     "ueber-uns"    "ueber-uns"    "$CONTENT_DIR/ueber-uns.html"

# Projekte + Kontakt → eigene Vorlagen (Galerie / Formular)
upsert_page "Projekte"     "projekte"     "projekte"     "$CONTENT_DIR/projekte.html"
upsert_page "Kontakt"      "kontakt"      "kontakt"      "$CONTENT_DIR/kontakt.html"

# Rechtstexte → Standard-Seite (voll CMS-bearbeitbar via Pages-Admin)
upsert_page "AGB"          "agb"          ""             "$CONTENT_DIR/agb.html"
upsert_page "Datenschutz"  "datenschutz"  ""             "$CONTENT_DIR/datenschutz.html"
upsert_page "Impressum"    "impressum"    ""             "$CONTENT_DIR/impressum.html"

# Beispiel-Stellenanzeigen → Stelle-Template (Theme-Editor: Aufgaben, Profil, Angebot pro Stelle)
upsert_page "Tischler für nachhaltige Möbel"       "stelle-tischler-nachhaltig"      "stelle" ""
upsert_page "Möbeltischler für kreative Projekte"  "stelle-moebeltischler-kreativ"   "stelle" ""
upsert_page "Tischler für Möbelproduktion"         "stelle-tischler-produktion"      "stelle" ""

echo ""
echo "✅  Fertig. Öffne den Shopify-Admin → Online Store → Pages und editiere frei!"
