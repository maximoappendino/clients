# Client Website System

Modular templates for building client websites fast. Edit one config file, drop images, and ship.

---

## Directory structure

```
clients/
│
├── _templates/          ← base templates (don't edit directly)
│   ├── e-commerce/
│   ├── saas/
│   ├── portfolio/
│   └── blog/
│
├── _examples/           ← 12 live demos, one per niche
│   ├── _shared/         ← scroll animations used by all examples
│   ├── blogs/
│   │   ├── music/       LOUDBOX — dark editorial music magazine
│   │   ├── travel/      Terrain — warm travel journal
│   │   └── devlog/      ship.log — terminal devlog
│   ├── e-commerce/
│   │   ├── bikes/       VELOCE — dark sporty bike shop
│   │   ├── school/      Papelería Koala — playful pastel stationery
│   │   └── makeup/      PLUME — luxury editorial beauty
│   ├── portfolios/
│   │   ├── salesman/    Marcus Reid — enterprise sales
│   │   ├── programmer/  Sofia Nakamura — full-stack engineer
│   │   └── chef/        Lucía Moreno — chef & gastronomía
│   └── saas/
│       ├── lawyer/      LexAI — AI legal research (gold)
│       ├── developer/   Shipfast — deploy platform (indigo)
│       └── security/    Sentinel — AI camera monitoring (red)
│
├── _shared/             ← CSS shared across all templates
│   └── styles/
│       ├── reset.css
│       └── variables.css  ← color schemes & font stacks reference
│
├── serve.sh             ← local dev server
│
└── [client-name]/       ← your actual client projects go here
```

---

## Previewing examples locally

You need a local HTTP server — opening `index.html` directly in the browser won't work because `fetch()` is blocked over `file://`.

```bash
# List all available examples
./serve.sh

# Serve a specific example
./serve.sh saas/lawyer
./serve.sh e-commerce/bikes
./serve.sh blogs/devlog
```

Then open the URL printed in the terminal — always:
```
http://localhost:3000/_examples/<category>/<name>/
```

To use a different port: `./serve.sh saas/lawyer 8080`

---

## Starting a new client project

```bash
# 1. Copy the right template
cp -r _templates/e-commerce ./tienda-rodriguez

# 2. Open the ONE config file and fill it in
code tienda-rodriguez/config.js

# 3. Preview it
./serve.sh ../tienda-rodriguez
#   └─ or: cd tienda-rodriguez && python3 -m http.server 3000
```

The config file is self-documented — every option has a comment.

---

## Template: E-commerce

**Key files:**
```
e-commerce/
├── config.js          ← store name, WhatsApp, theme, hero, cart
├── catalog/           ← drop product images here
├── data/
│   └── products.json  ← auto-generated + manually edited
└── scripts/
    └── sync-catalog.js
```

### Auto-catalog (the main time-saver)

Drop images into `catalog/` → run sync → products appear on the site.

```bash
npm run sync       # scan catalog/ → update products.json
npm run dry-run    # preview changes without writing
npm run clean      # also remove entries whose images were deleted
```

**Optional filename convention** — encode data directly in the filename:
```
vestido-rojo_12999_Ropa.jpg
└── name: "Vestido Rojo"
    price: 12999
    category: "Ropa"
```

Existing entries are **never overwritten** when you re-run sync — safe to use anytime.

### Cart → WhatsApp checkout

When the customer clicks "Pedir por WhatsApp", it opens WhatsApp with a pre-formatted message listing every cart item and the subtotal. The phone number comes from `config.js → whatsapp.number`.

### Key config options

| Key | What it controls |
|-----|-----------------|
| `store.name` | Name shown in nav, title bar, footer |
| `store.currencySymbol` | `$`, `USD`, `€`, etc. |
| `whatsapp.number` | Full number with country code, e.g. `+5491155550000` |
| `theme.scheme` | `"light"` `"dark"` `"warm"` `"pastel"` `"custom"` |
| `theme.fontImport` | Google Fonts `<link>` URL |
| `theme.font` | CSS font-family string |
| `theme.borderRadius` | `"0"` sharp · `"8px"` medium · `"16px"` very rounded |
| `hero.show` | `true` / `false` |
| `hero.image` | Path to hero background image |
| `catalog.productsPerRow` | `2`, `3`, or `4` |
| `footer.social.instagram` | Handle without `@` |

---

## Template: SaaS

**Key files:**
```
saas/
├── config.js
└── data/
    ├── features.json      ← feature cards (icon, title, description)
    ├── pricing.json       ← plans with monthly + annual prices
    ├── how-it-works.json  ← numbered steps
    ├── testimonials.json  ← customer quotes
    └── faq.json           ← accordion Q&A
```

Edit content by editing the JSON files. Edit brand, theme, and section visibility in `config.js`.

### Key config options

| Key | What it controls |
|-----|-----------------|
| `brand.name` | Product name everywhere |
| `theme.scheme` | `"dark"` or `"light"` |
| `theme.accentColor` | CTA button & highlight color, e.g. `"#6c47ff"` |
| `hero.badge` | Small pill above the headline, e.g. `"Now in beta"` |
| `hero.headline` | Main headline — use `\n` for line breaks |
| `hero.image` | Path to product screenshot or mockup |
| `pricing.billingToggle` | `true` / `false` — shows monthly/annual switch |
| `pricing.annualDiscount` | Badge text on annual option, e.g. `"Save 20%"` |
| `logos.show` | `true` / `false` — "trusted by" logo bar |
| `testimonials.show` | Toggle entire testimonials section |
| `faq.show` | Toggle entire FAQ section |

---

## Template: Portfolio

**Key files:**
```
portfolio/
├── config.js
├── data/
│   └── projects.json   ← project cards (title, category, image, description)
└── src/projects/       ← project images go here
```

### Key config options

| Key | What it controls |
|-----|-----------------|
| `person.name` | Full name in nav, hero, footer |
| `person.title` | Subtitle line under name |
| `person.bio` | Text in hero and about section |
| `hero.layout` | `"center"` or `"split"` (text + photo side by side) |
| `work.columnsDesktop` | `2` or `3` |
| `contact.whatsapp` | WhatsApp contact button |
| `contact.instagram` | Instagram link |

---

## Template: Blog

**Key files:**
```
blog/
├── config.js
└── data/
    └── posts.json   ← all posts (title, category, date, excerpt, content)
```

Post `content` is raw HTML. Write it by hand or paste output from any Markdown-to-HTML converter.

The first post in the filtered list always becomes the large **featured hero** post. Mark `"featured": true` to force one to the top.

---

## Theming

### Color schemes

Set `theme.scheme` in `config.js`:

| Scheme | Vibe |
|--------|------|
| `"light"` | Clean white, neutral |
| `"dark"` | Near-black, editorial |
| `"warm"` | Cream and earthy browns |
| `"pastel"` | Soft lavender and rose |
| `"custom"` | You set every CSS variable manually |

For `"custom"`, fill in the `theme.custom` object in `config.js`:
```js
custom: {
  "--color-bg":         "#ffffff",
  "--color-surface":    "#f8f8f8",
  "--color-border":     "#e8e8e8",
  "--color-text":       "#1a1a1a",
  "--color-text-muted": "#666666",
  "--color-primary":    "#1a1a1a",
  "--color-accent":     "#e63946",
}
```

### Fonts

Set `theme.fontImport` (Google Fonts URL) and `theme.font` (CSS font-family). Common combos from `_shared/styles/variables.css`:

| Vibe | Import + Font |
|------|--------------|
| Clean modern | Inter 300;400;500;600 |
| Editorial luxury | Cormorant Garamond (heading) + Jost (body) |
| Friendly | DM Sans |
| Technical | JetBrains Mono (heading) + Inter (body) |
| Newspaper | Playfair Display (heading) + Lato (body) |

---

## How the examples work

Each example in `_examples/` is a thin customization layer on top of a template:

```
_examples/saas/lawyer/
├── index.html       ← loads CSS/JS from ../../../_templates/saas/
├── config.js        ← custom brand, theme, copy
├── data/            ← custom JSON content
└── styles/
    └── custom.css   ← visual personality (colors, typography tweaks, animations)
```

Updating a template automatically improves all examples that use it.

The `_examples/_shared/` folder holds the scroll animation system:
- `animations.css` — fade-up, fade-left, scale, gradient text, glow, glass utilities
- `animations.js` — IntersectionObserver that auto-targets cards, headings, and sections

---

## Workflow summary

```
New client brief
      │
      ▼
Pick a template type
      │
      ├─ e-commerce  →  cp -r _templates/e-commerce ./client
      ├─ saas        →  cp -r _templates/saas ./client
      ├─ portfolio   →  cp -r _templates/portfolio ./client
      └─ blog        →  cp -r _templates/blog ./client
                              │
                              ▼
                       Edit config.js
                       (name, colors, font, WhatsApp, hero)
                              │
                              ▼
                       Add content
                       (drop images / edit JSON)
                              │
                         e-commerce?
                              │ yes
                              ▼
                       npm run sync
                              │
                              ▼
                       python3 -m http.server 3000
                       http://localhost:3000
                              │
                              ▼
                       Deploy (Netlify drag-and-drop,
                               GitHub Pages, Cloudflare Pages)
```
