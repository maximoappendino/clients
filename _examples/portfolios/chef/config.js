const CONFIG = {
  person: {
    name:     "Lucía Moreno",
    title:    "Chef · Gastronomía de Autor · Buenos Aires",
    bio:      "Formada en Le Cordon Bleu Madrid y en las cocinas de tres restaurantes con estrella Michelin. De vuelta en Argentina, cocino con memoria: productos locales, técnica europea, sabor que no se olvida. Disponible para eventos privados, pop-ups y consultoría gastronómica.",
    avatar:   "",
    email:    "hola@luciamoreno.com.ar",
    location: "Buenos Aires, Argentina",
  },
  theme: {
    scheme:     "custom",
    custom: {
      "--color-bg":         "#faf8f5",
      "--color-surface":    "#f2ede6",
      "--color-border":     "#e4d8ca",
      "--color-text":       "#2a1f14",
      "--color-text-muted": "#8a7060",
      "--color-primary":    "#2a1f14",
      "--color-accent":     "#b5451b",
    },
    fontImport: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Lato:wght@300;400;700&display=swap",
    font:        "'Lato', sans-serif",
    fontHeading: "'Cormorant Garamond', serif",
    borderRadius: "4px",
  },
  nav: {
    links: [
      { label: "Trabajo",    href: "#work" },
      { label: "Filosofía",  href: "#about" },
      { label: "Contacto",   href: "#contact" },
    ],
  },
  hero: { layout: "split" },
  work: {
    title:          "Creaciones",
    columnsDesktop: 3,
    columnsMobile:  2,
    showCategory:   true,
    defaultFilter:  "Todo",
  },
  contact: {
    title:    "Trabajemos juntos",
    subtitle: "Para eventos privados, cenas de autor y consultoría de cocina.",
    whatsapp:   "+5491155550012",
    instagram:  "luciamorenococinera",
    email:      "hola@luciamoreno.com.ar",
  },
  footer: { text: "" },
};
