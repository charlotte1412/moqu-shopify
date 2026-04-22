# MOQU · Shopify Theme (Dawn-Fork)

Stand: Phase 1 — **Basis + Home + Header/Footer**

## Was schon drin ist

| Section | Datei | Status |
|---|---|---|
| MOQU · Header (Nav mit Dropdown, Mobile-Burger) | `sections/moqu-header.liquid` | ✅ |
| MOQU · Footer (3-spaltig + Kontakt) | `sections/moqu-footer.liquid` | ✅ |
| MOQU · Hero (Vollbild, Bild + CTA) | `sections/moqu-hero.liquid` | ✅ |
| MOQU · Keywords (Icon-Strip) | `sections/moqu-keywords.liquid` | ✅ |
| MOQU · Quality Cards (4 Karten) | `sections/moqu-quality.liquid` | ✅ |
| MOQU · About-Banner (Vollbild-Intro) | `sections/moqu-about-banner.liquid` | ✅ |
| MOQU · Alt-Sections (abwechselnd Bild/Text) | `sections/moqu-alt-sections.liquid` | ✅ |
| MOQU · CTA (dunkler Streifen) | `sections/moqu-cta.liquid` | ✅ |
| MOQU · Page Header (für Unterseiten) | `sections/moqu-page-header.liquid` | ✅ |
| MOQU · Rich Text (freier Fließtext) | `sections/moqu-richtext.liquid` | ✅ |
| MOQU · Projects (listet Metaobjects) | `sections/moqu-projects.liquid` | ✅ |
| Home-Template mit vorgefertigten Sections | `templates/index.json` | ✅ |

## Phase 2 (kommt als nächstes)
- Leistungsseiten-Templates (`page.moebelbau`, `page.innenausbau`, `page.kuechenbau`) mit FAQ
- Projekt-Detail-Template (Metaobject-Detail mit Galerie)
- Stellen-Template
- Kontaktformular-Section mit EmailJS/Shopify Contact Form

## Upload ins Shopify-Backend

1. Ordner `shopify-theme/` als **ZIP** packen:
   ```bash
   cd shopify-theme && zip -r ../moqu-theme.zip . -x '*.DS_Store'
   ```
2. Shopify-Admin → **Online Store → Themes → Add theme → Upload zip file**
3. **Customize** klicken → das Theme rendert bereits die MOQU-Startseite.
4. **Actions → Publish** wenn bereit (oder erstmal als Preview lassen).

## Pages anlegen (einmalig)

Shopify-Admin → **Online Store → Pages → Add page**. Bitte folgende Handles setzen (bei „Search engine listing preview → Edit website SEO → URL handle"):

| Handle | Template-Suffix | Inhalt |
|---|---|---|
| `ueber-uns`    | (Standard) | Leer lassen, Sections werden im Theme-Editor gepflegt |
| `projekte`     | (Standard) | Leer lassen |
| `moebelbau`    | (Standard) | Leer lassen |
| `innenausbau`  | (Standard) | Leer lassen |
| `kuechenbau`   | (Standard) | Leer lassen |
| `kontakt`      | (Standard) | Leer lassen |
| `datenschutz`  | (Standard) | Rechtstext in Editor einfügen |
| `agb`          | (Standard) | Rechtstext |
| `impressum`    | (Standard) | Rechtstext |

Für jede Seite dann im Theme-Editor die passenden Sections einfügen (Page Header → Inhalt → CTA).

## Projekte als Metaobjects anlegen

Shopify-Admin → **Content → Metaobjects → Add definition** (oder in Settings → Custom data → Metaobjects).

**Definition:**
- **Name:** Project
- **Handle:** `project`
- **Access:** Storefronts ✓ (damit im Theme verfügbar)

**Felder:**
| Field name | Type | Notes |
|---|---|---|
| title       | Single line text | Required |
| category    | Single line text | z.B. „Einbauschrank", „Küche" |
| cover       | File reference → Image | Cover-Bild für die Karte |
| images      | List of files → Images | Galerie im Detail |
| year        | Integer | z.B. 2025 |
| description | Multi-line text | Kurze Beschreibung für Übersicht |
| body        | Rich text | Langer Beschreibungstext im Detail |
| client      | Single line text | „Auftraggeber" |
| service     | Single line text | „Leistung" |
| location    | Single line text | „Standort" |

Nach dem Anlegen: **Content → Metaobjects → Project → Add entry** für jedes Projekt.

## Jobs / Stellenanzeigen

Empfehlung: Als zweites Metaobject `job` mit Feldern `title`, `type`, `location`, `description`, `intro`, `tasks` (list), `profile` (list), `offer` (list). Wird in Phase 3 als eigene Section mit Template `page.stellen` eingebunden.

Alternative: **Blog** erstellen (`Online Store → Blog posts`), Handle `stellen` — weniger flexibel, aber schneller startklar.

## Tracking & SEO

- **Analytics:** Shopify-Admin → Online Store → Preferences → Google Analytics / Facebook Pixel. Plausible kann als Custom Script in `layout/theme.liquid` zwischen `</head>` eingefügt werden.
- **SEO-Meta:** Pro Seite im Editor unter „Search engine listing" pflegbar. OG-Tags zieht Shopify automatisch.
- **Sitemap:** Shopify erzeugt `/sitemap.xml` automatisch.

## Design-Tokens

Alle Farben und Schriften aus `assets/moqu.css` — siehe `:root` Variablen:
- `--moqu-bg: #fcfbf7`
- `--moqu-accent: #c8772a`
- `--moqu-font-heading: 'MuseoModerno'`
- `--moqu-font-body: 'Open Sans'`

Fonts laden via Google Fonts in `layout/theme.liquid`.
