const CONFIG = {

  person: {
    name:       "Tu Nombre",
    title:      "Diseñadora / Fotógrafa / Artista",
    bio:        "Una frase corta sobre vos y tu trabajo.",
    avatar:     "",   // path to photo, or "" to hide
    email:      "",
    location:   "",
  },

  theme: {
    scheme:      "light",   // "light" | "dark" | "warm" | "pastel" | "custom"
    custom:      {},
    fontImport:  "https://fonts.googleapis.com/css2?family=Cormorant:wght@400;600&family=Jost:wght@300;400;500&display=swap",
    font:        "'Jost', sans-serif",
    fontHeading: "'Cormorant', serif",
    borderRadius: "4px",
  },

  nav: {
    links: [
      { label: "Trabajo",   href: "#work" },
      { label: "Sobre mí",  href: "#about" },
      { label: "Contacto",  href: "#contact" },
    ],
  },

  hero: {
    layout: "split",   // "center" | "split"
  },

  work: {
    title:          "Trabajos",
    columnsDesktop: 3,
    columnsMobile:  2,
    showCategory:   true,
    defaultFilter:  "Todos",
  },

  contact: {
    title:       "Hablemos",
    subtitle:    "Estoy disponible para proyectos freelance.",
    whatsapp:    "",   // number with country code, or ""
    instagram:   "",
    email:       "",
  },

  footer: {
    text: "",
  },

};
