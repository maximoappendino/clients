/* ─── STORE CONFIG ─────────────────────────────────────────────────────────── */
/* This is the ONLY file you need to edit to customize the store.              */

const CONFIG = {

  /* ── Store identity ───────────────────────────────────── */
  store: {
    name:    "Yo Soy Eva",
    tagline: "Cremas Alucinantes",
    logo:    "./img/logo.webp",           // path to logo image, or "" to use text
    favicon: "./img/logo.webp",           // path to favicon
    currency:       "ARS", // shown in metadata
    currencySymbol: "$",   // shown on prices
    locale:         "es-AR",
  },

  /* ── WhatsApp ─────────────────────────────────────────── */
  whatsapp: {
    number:  "+5493515426913",         // full number with country code
    greeting: "Hola! Me gustaría hacer el siguiente pedido:\n\n",
    footer:   "\n\n¿Pueden confirmar disponibilidad?",
    floatingButton: true,              // show floating WhatsApp button
    checkoutButton: true,              // show "Pedir por WhatsApp" in cart
  },

  /* ── Theme ────────────────────────────────────────────── */
  theme: {
    scheme: "pastel",    // "light" | "dark" | "warm" | "pastel" | "custom"

    // Only used when scheme = "custom" — override individual variables:
    custom: {
      "--color-bg":         "#ffffff",
      "--color-surface":    "#f8f8f8",
      "--color-border":     "#e8e8e8",
      "--color-text":       "#1a1a1a",
      "--color-text-muted": "#666666",
      "--color-primary":    "#1a1a1a",
      "--color-accent":     "#e63946",
    },

    fontImport: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap",
    font:        "'Inter', sans-serif",
    fontHeading: "",     // leave empty to use same as font
    borderRadius: "8px", // "0" for sharp, "8px" medium, "16px" rounded
  },

  /* ── Hero banner ──────────────────────────────────────── */
  hero: {
    show:     true,
    title:    "Nueva Colección",
    subtitle: "Descubrí los últimos estilos",
    image:    "./img/carrousel1.webp",          // path to hero image, or "" for color background
    cta:      "Ver Catálogo",
    ctaScroll: true,       // scroll to products on CTA click
  },

  /* ── Navigation ───────────────────────────────────────── */
  nav: {
    showSearch: true,
    showCart:   true,
    sticky:     true,
  },

  /* ── Product grid ─────────────────────────────────────── */
  catalog: {
    showCategories:    true,
    showSearch:        true,
    defaultCategory:   "Todos",
    productsPerRow:    3,           // 2 | 3 | 4
    showOutOfStock:    true,        // show cards even when stock = 0
    outOfStockLabel:   "Sin stock",
    addToCartLabel:    "Agregar",
    showPriceOnCard:   true,
    showSort:          true,
    defaultSort:       "featured",  // "featured"|"name-asc"|"name-desc"|"price-asc"|"price-desc"|"category"
  },

  promo: {
    show: true,
    layout: "alternating",
    heading: "",
    items: [
      {
        image:  "./img/carrousel1.webp",
        label:  "Cómo usar",
        title:  "Tu ritual de cuidado diario",
        text:   "Aplicá una pequeña cantidad en la piel limpia y masajeá en movimientos circulares hasta absorber. Usá mañana y noche para mejores resultados.",
        cta:    "",
        ctaUrl: "",
      },
      {
        image:  "./img/carrousel2.webp",
        label:  "Temporada de frío",
        title:  "Protección extra para el invierno",
        text:   "Las bajas temperaturas resecan la piel. Nuestras cremas forman una barrera protectora que nutre en profundidad y mantiene la hidratación por horas.",
        cta:    "Ver cremas",
        ctaUrl: "#catalog",
      },
    ],
  },

  announcement: {
    show: true,
    items: [
      { icon: "🚚", title: "Envío a todo el país", text: "Coordinamos por WhatsApp." },
      { icon: "✅", title: "Garantía",              text: "30 días desde la compra." },
      { icon: "💬", title: "Atención al cliente",   text: "Lunes a viernes de 9 a 18hs." },
    ],
    note: "",
  },

  /* ── Cart ─────────────────────────────────────────────── */
  cart: {
    persist: true,    // save cart to localStorage
    shippingNote: "El envío se coordina por WhatsApp.",
  },

  /* ── Footer ───────────────────────────────────────────── */
  footer: {
    show: true,
    text: "",          // "" auto-generates "© 2026 Nombre de la Tienda"
    social: {
      instagram: "",   // handle without @, or "" to hide
      facebook:  "",
      tiktok:    "",
    },
  },

};
