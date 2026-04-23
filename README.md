# MOQU Shopify-Theme

1:1-Port der MOQU-Website. Nach Upload + Page-Anlage sieht der Shop
**sofort aus wie das Original** — inklusive aller Bilder (Unsplash-Defaults,
jederzeit durch eigene Uploads ersetzbar).

---

## Setup — 2 Schritte

### 1. Theme hochladen
```
Shopify Admin  →  Online Store  →  Themes  →  Upload theme
  → moqu-shopify-theme.zip auswählen  →  Publish
```

### 2. Pages anlegen

Für jede Zeile unten **genau einmal** im Admin:
```
Online Store → Pages → Add page
```

| Titel         | Handle              | Vorlage           |
|---------------|---------------------|-------------------|
| Möbelbau      | `moebelbau`         | `page.moebelbau`    |
| Innenausbau   | `innenausbau`       | `page.innenausbau`  |
| Küchenbau     | `kuechenbau`        | `page.kuechenbau`   |
| Über uns      | `ueber-uns`         | `page.ueber-uns`    |
| Projekte      | `projekte`          | `page.projekte`     |
| Kontakt       | `kontakt`           | `page.kontakt`      |
| AGB           | `agb`               | Standard-Seite    |
| Datenschutz   | `datenschutz`       | Standard-Seite    |
| Impressum     | `impressum`         | Standard-Seite    |

**Die 3 Klicks pro Page**:
1. Titel eintragen
2. **Rechts in der Sidebar bei „Vorlage"** → aus der Liste die passende Vorlage wählen
3. **Handle prüfen** (unten rechts „Suchmaschinen-Eintrag bearbeiten") — muss exakt stimmen, vor allem `ueber-uns` (nicht `uber-uns`)
4. Speichern

Body bleibt **leer** — der gesamte Content steckt bereits im Template.

**Fertig.** Die Seiten haben sofort alle Inhalte + Bilder.

---

## Bilder bearbeiten

Jede Bild-Position im Theme hat **zwei Felder**:
```
Bild (hochladen)     [Datei wählen]      ← Priorität 1
Bild-URL (Fallback)  [unsplash-link…]    ← Default, wird beim Upload überschrieben
```

**Eigenes Bild einfügen:**
```
Online Store → Themes → Customize
  → Oben Dropdown: Pages → [Seite]
  → Linke Spalte: Sektion anklicken (z.B. Alt-Sections → Block 1)
  → Rechts: "Bild (hochladen)" → Datei wählen → speichern
```

Dein Upload gewinnt automatisch. Keine URL löschen, nichts — das Theme nimmt
immer das hochgeladene Bild, wenn eins da ist.

---

## Rechtstexte (AGB / Datenschutz / Impressum)

Diese Seiten nutzen die Standard-Seite-Vorlage und rendern den **Body-Text
aus dem Shopify-Pages-Admin**. Fertige HTML-Inhalte findest du in
`content/agb.html`, `content/datenschutz.html`, `content/impressum.html` —
einfach in das Inhalt-Feld einfügen (HTML-Ansicht `</>` oben in der Toolbar).

---

## Editier-Übersicht

| Bereich                | Wo?                                                  |
|------------------------|------------------------------------------------------|
| Startseite             | Customize → Home                                     |
| Möbelbau etc.          | Customize → Pages → [Seite]                          |
| Text & Bilder pro Block| Customize → Sektion → Block → Felder                 |
| Farben, Logo, Favicon  | Customize → Theme settings → Branding / Farben       |
| Footer-Kontakt         | Customize → Theme settings → Kontakt-Daten           |
| Navigation (Header)    | Customize → Header (Blöcke hinzufügen/editieren)     |
| SEO + Tracking         | Customize → Theme settings → SEO / Analytics         |
| Rechtstexte            | Admin → Pages → AGB/Datenschutz/Impressum → Inhalt   |

---

## Zusätzliche Projekt-/Stellen-Detail-Seiten

Wenn du pro Projekt oder pro Stellenanzeige eine eigene Detail-Seite willst:

```
Pages → Add page
  Titel:   [Projektname / Jobtitel]
  Vorlage: page.projekt   (bzw. page.stelle)
  Speichern
  → Customize öffnen → Seite wählen → Felder ausfüllen
```

---

## Architektur (für Techniker)

```
shopify-theme/
  layout/theme.liquid            # HTML-Grundgerüst, JSON-LD LocalBusiness, Tracking-Codes, Cookie-Banner
  sections/                      # 16 editierbare Sektionen
    hero, keywords, quality-cards, about-banner, gallery, jobs, cta,
    alt-sections, about-intro, page-header, contact-form, faq,
    project-detail, job-detail, rich-text, page-body, header, footer
  templates/
    index.json                   # Startseite
    page.moebelbau.json          # Möbelbau (Alt-Sections + FAQ + CTA, Bilder vorbelegt)
    page.innenausbau.json
    page.kuechenbau.json
    page.ueber-uns.json
    page.projekte.json           # Galerie mit 6 Bildern
    page.kontakt.json            # Shopify-natives Formular
    page.projekt.json            # Einzelprojekt-Detail
    page.stelle.json             # Einzel-Stellenanzeige
    page.liquid                  # Standard-Seite für AGB/Datenschutz/Impressum
  config/settings_schema.json    # Branding, Farben, Kontakt, SEO, Tracking
  locales/de.default.json
  assets/shared.css / shared.js
  content/                       # Fertige HTML-Snippets für Rechtstexte
```
