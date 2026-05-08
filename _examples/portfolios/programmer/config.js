const CONFIG = {
  person: {
    name:     "Sofia Nakamura",
    title:    "Full-Stack Engineer · Open Source · Go & React",
    bio:      "Construyo software que la gente realmente usa. 6 años como ingeniera, últimamente obsesionada con performance, DX y sistemas distribuidos. Autora de 3 librerías open source con más de 8k GitHub stars combinados.",
    avatar:   "",
    email:    "sofia@sofianakamura.dev",
    location: "Córdoba, AR · Remote-first",
  },
  theme: {
    scheme:     "custom",
    custom: {
      "--color-bg":         "#09090b",
      "--color-surface":    "#111113",
      "--color-border":     "#1e1e24",
      "--color-text":       "#fafafa",
      "--color-text-muted": "#71717a",
      "--color-primary":    "#a855f7",
      "--color-accent":     "#a855f7",
    },
    fontImport: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@300;400;500;600&display=swap",
    font:        "'Inter', sans-serif",
    fontHeading: "'Inter', sans-serif",
    borderRadius: "8px",
  },
  nav: {
    links: [
      { label: "Proyectos", href: "#work" },
      { label: "Sobre mí",  href: "#about" },
      { label: "Contacto",  href: "#contact" },
    ],
  },
  hero: { layout: "center" },
  work: {
    title:          "Proyectos",
    columnsDesktop: 3,
    columnsMobile:  1,
    showCategory:   true,
    defaultFilter:  "Todos",
  },
  contact: {
    title:    "Get in touch",
    subtitle: "Open to senior roles, interesting open source collabs, and consulting for early-stage startups.",
    whatsapp:   "",
    instagram:  "",
    email:      "sofia@sofianakamura.dev",
  },
  footer: { text: "© 2026 Sofia Nakamura — Built with Go & a lot of coffee." },
};
