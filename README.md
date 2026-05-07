# clients — Template System

Modular website templates. Each new client gets a copy of a template folder.

## Structure

```
clients/
├── _templates/
│   ├── e-commerce/     ← online store with WhatsApp checkout
│   ├── portfolio/      ← personal/creative portfolio
│   └── blog/           ← article blog
├── _shared/
│   └── styles/         ← reset.css, color scheme & font references
└── [client-name]/      ← copy of a template, customized per client
```

## Starting a new client

```bash
# Copy the template you need
cp -r _templates/e-commerce ./nueva-tienda

# Edit the ONE config file
code nueva-tienda/config.js

# (E-commerce only) drop images → run sync
cd nueva-tienda
npm run sync

# Preview locally
npm run dev        # opens localhost:3000
```

---

## E-commerce

### Auto-catalog workflow

1. Drop `.jpg / .png / .webp` images into `catalog/`
2. Run `npm run sync`
3. New entries appear in `data/products.json` — fill in prices/descriptions
4. Re-run `npm run sync` anytime you add more images — existing entries are never overwritten

**Image naming shortcut** (optional):  
`nombre-producto_precio_Categoria.jpg`  
→ `"name": "Nombre Producto", "price": precio, "category": "Categoria"`

### config.js quick reference

| Key | What it controls |
|-----|-----------------|
| `store.name` | Store name in nav, title, footer |
| `store.currencySymbol` | `$`, `USD`, `€`, etc. |
| `whatsapp.number` | Full number with country code |
| `theme.scheme` | `"light"` `"dark"` `"warm"` `"pastel"` `"custom"` |
| `theme.fontImport` | Google Fonts URL |
| `theme.font` | CSS font-family string |
| `hero.show` | Toggle the hero banner |
| `catalog.productsPerRow` | `2`, `3`, or `4` |
| `footer.social.instagram` | Instagram handle (no @) |

### Cart → WhatsApp checkout

When the customer clicks "Pedir por WhatsApp", it opens WhatsApp with a pre-formatted message listing all items + subtotal.

---

## Portfolio

Edit `config.js` → fill `data/projects.json` with your project objects → add images to `src/projects/`.

---

## Blog

Edit `config.js` → add entries to `data/posts.json`. Post `content` is raw HTML — write it directly or use a Markdown-to-HTML converter.

---

## Color schemes

See `_shared/styles/variables.css` for all schemes and font stack options.

| Scheme | Vibe |
|--------|------|
| `light` | Clean, neutral |
| `dark` | Bold, editorial |
| `warm` | Cozy, earthy |
| `pastel` | Soft, feminine |
| `custom` | Full control via CSS variables |
