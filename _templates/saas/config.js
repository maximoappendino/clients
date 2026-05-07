/* ─── SAAS CONFIG ──────────────────────────────────────────────────────────── */
/* This is the ONLY file you need to edit to customize the site.               */

const CONFIG = {

  /* ── Brand ────────────────────────────────────────────────────────────── */
  brand: {
    name:    "AppName",
    tagline: "One line that sells the product.",
    logo:    "",           // path to logo image, or "" to use text
    favicon: "",
  },

  /* ── Theme ────────────────────────────────────────────────────────────── */
  theme: {
    scheme: "dark",        // "dark" | "light" | "custom"

    // Accent color — used for CTA buttons, highlights, badges
    accentColor:     "#6c47ff",
    accentColorText: "#ffffff",   // text on accent-colored buttons

    // Only used when scheme = "custom"
    custom: {
      "--color-bg":         "#0d0d0d",
      "--color-surface":    "#161616",
      "--color-surface-2":  "#1e1e1e",
      "--color-border":     "#2a2a2a",
      "--color-text":       "#f0f0f0",
      "--color-text-muted": "#888",
    },

    fontImport:  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
    font:        "'Inter', sans-serif",
    borderRadius: "10px",
  },

  /* ── Nav ──────────────────────────────────────────────────────────────── */
  nav: {
    links: [
      { label: "Features",  href: "#features" },
      { label: "Pricing",   href: "#pricing" },
      { label: "FAQ",       href: "#faq" },
    ],
    ctaPrimary:   { label: "Get started",  href: "#pricing" },
    ctaSecondary: { label: "Sign in",      href: "#" },
  },

  /* ── Hero ─────────────────────────────────────────────────────────────── */
  hero: {
    badge:      "Now in beta",   // small pill above headline, or ""
    headline:   "The tool your team\nactually wants to use.",
    subheadline: "One sentence that explains the core value prop. Keep it short and specific.",
    ctaPrimary:   { label: "Start for free →",  href: "#pricing" },
    ctaSecondary: { label: "See how it works",  href: "#how-it-works" },
    socialProof:  "Trusted by 2,000+ teams",     // or ""
    image:        "",    // path to hero screenshot/illustration, or ""
  },

  /* ── Logos bar (social proof) ──────────────────────────────────────────── */
  logos: {
    show:  false,
    label: "Trusted by teams at",
    items: [
      // { name: "Acme", logo: "src/assets/acme.svg" },
    ],
  },

  /* ── Features ─────────────────────────────────────────────────────────── */
  features: {
    title:    "Everything you need",
    subtitle: "No plugins. No integrations. No headaches.",
    columns:  3,     // 2 | 3
  },

  /* ── How it works ──────────────────────────────────────────────────────── */
  howItWorks: {
    show:     true,
    title:    "Up and running in minutes",
    subtitle: "",
  },

  /* ── Pricing ──────────────────────────────────────────────────────────── */
  pricing: {
    title:          "Simple, transparent pricing",
    subtitle:       "No hidden fees. Cancel anytime.",
    billingToggle:  true,            // show monthly/annual toggle
    annualDiscount: "Save 20%",      // badge text on annual toggle
    currency:       "$",
    ctaLabel:       "Get started",
    enterpriseCard: true,
  },

  /* ── Testimonials ─────────────────────────────────────────────────────── */
  testimonials: {
    show:  true,
    title: "Loved by teams worldwide",
  },

  /* ── FAQ ──────────────────────────────────────────────────────────────── */
  faq: {
    show:  true,
    title: "Frequently asked questions",
  },

  /* ── Bottom CTA ───────────────────────────────────────────────────────── */
  cta: {
    headline: "Ready to get started?",
    subtitle: "Join thousands of teams. No credit card required.",
    button:   { label: "Start for free →", href: "#pricing" },
  },

  /* ── Footer ───────────────────────────────────────────────────────────── */
  footer: {
    columns: [
      {
        title: "Product",
        links: [
          { label: "Features",  href: "#features" },
          { label: "Pricing",   href: "#pricing" },
          { label: "Changelog", href: "#" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About",   href: "#" },
          { label: "Blog",    href: "#" },
          { label: "Contact", href: "#" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy",  href: "#" },
          { label: "Terms",    href: "#" },
        ],
      },
    ],
    social: {
      twitter:  "",
      linkedin: "",
      github:   "",
    },
    copyright: "",   // "" = auto "© 2026 AppName"
  },

};
