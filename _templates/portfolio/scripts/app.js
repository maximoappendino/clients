(function () {
  'use strict';

  /* ── Theme ── */
  if (CONFIG.theme.fontImport) {
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = CONFIG.theme.fontImport;
    document.head.prepend(l);
  }
  const root = document.documentElement;
  root.style.setProperty('--font',         CONFIG.theme.font);
  root.style.setProperty('--font-heading', CONFIG.theme.fontHeading || CONFIG.theme.font);
  root.style.setProperty('--radius',       CONFIG.theme.borderRadius);
  root.style.setProperty('--cols',         CONFIG.work.columnsDesktop);

  const schemeVars = {
    dark:   '--color-bg:#0f0f0f;--color-surface:#1a1a1a;--color-border:#2a2a2a;--color-text:#f0f0f0;--color-text-muted:#888;--color-primary:#ffffff;',
    light:  '--color-bg:#ffffff;--color-surface:#f8f8f8;--color-border:#e8e8e8;--color-text:#1a1a1a;--color-text-muted:#666;--color-primary:#1a1a1a;',
    warm:   '--color-bg:#fdf6ec;--color-surface:#fff9f2;--color-border:#e8d9c5;--color-text:#2c1810;--color-text-muted:#7a5c4a;--color-primary:#2c1810;',
    pastel: '--color-bg:#faf0f5;--color-surface:#ffffff;--color-border:#f0d6e4;--color-text:#2d1b26;--color-text-muted:#9b7080;--color-primary:#a0496a;',
  };
  if (CONFIG.theme.scheme !== 'custom') {
    const s = document.createElement('style');
    s.textContent = `:root { ${schemeVars[CONFIG.theme.scheme] || schemeVars.light} }`;
    document.head.appendChild(s);
  } else {
    for (const [k, v] of Object.entries(CONFIG.theme.custom)) root.style.setProperty(k, v);
  }

  /* ── Static content ── */
  document.title = CONFIG.person.name;
  document.getElementById('nav-name').textContent = CONFIG.person.name;

  // Nav links
  const navLinks = document.getElementById('nav-links');
  navLinks.innerHTML = CONFIG.nav.links.map(l => `<a href="${l.href}">${l.label}</a>`).join('');

  // Hero
  const hero = document.getElementById('hero');
  hero.classList.add(`layout-${CONFIG.hero.layout}`);
  if (CONFIG.person.avatar) {
    document.getElementById('hero-avatar').src = CONFIG.person.avatar;
  } else {
    document.getElementById('hero-avatar').style.display = 'none';
  }
  document.getElementById('hero-name').textContent  = CONFIG.person.name;
  document.getElementById('hero-title').textContent = CONFIG.person.title;
  document.getElementById('hero-bio').textContent   = CONFIG.person.bio;

  // About
  document.getElementById('about-text').textContent = CONFIG.person.bio;

  // Contact
  document.getElementById('contact-title').textContent    = CONFIG.contact.title;
  document.getElementById('contact-subtitle').textContent = CONFIG.contact.subtitle;
  const cl = document.getElementById('contact-links');
  const links = [];
  if (CONFIG.contact.whatsapp) links.push(
    `<a class="contact-link whatsapp" href="https://wa.me/${CONFIG.contact.whatsapp.replace(/\D/g,'')}" target="_blank" rel="noopener">WhatsApp</a>`);
  if (CONFIG.contact.instagram) links.push(
    `<a class="contact-link" href="https://instagram.com/${CONFIG.contact.instagram}" target="_blank" rel="noopener">Instagram</a>`);
  if (CONFIG.contact.email) links.push(
    `<a class="contact-link" href="mailto:${CONFIG.contact.email}">Email</a>`);
  cl.innerHTML = links.join('');

  // Footer
  const year = new Date().getFullYear();
  document.getElementById('footer-text').textContent =
    CONFIG.footer.text || `© ${year} ${CONFIG.person.name}`;

  // Work section title
  document.getElementById('work-title').textContent = CONFIG.work.title;

  /* ── Projects ── */
  let projects = [];
  let activeFilter = CONFIG.work.defaultFilter;

  fetch('data/projects.json').then(r => r.json()).then(data => {
    projects = data;
    buildFilters();
    renderProjects();
  });

  function buildFilters() {
    if (!CONFIG.work.showCategory) return;
    const cats = [CONFIG.work.defaultFilter, ...new Set(projects.map(p => p.category).filter(Boolean))];
    const el = document.getElementById('filters');
    el.innerHTML = cats.map(c =>
      `<button class="filter-btn${c === activeFilter ? ' active' : ''}" data-cat="${c}">${c}</button>`
    ).join('');
    el.addEventListener('click', e => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      activeFilter = btn.dataset.cat;
      el.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
      renderProjects();
    });
  }

  function renderProjects() {
    const filtered = activeFilter === CONFIG.work.defaultFilter
      ? projects
      : projects.filter(p => p.category === activeFilter);
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = filtered.map(p => `
      <div class="project-card" data-id="${p.id}">
        <div class="project-thumb">
          ${p.thumbnail ? `<img src="${p.thumbnail}" alt="${p.title}" loading="lazy">` : ''}
        </div>
        <p class="project-title">${p.title}</p>
        ${p.category || p.year ? `<p class="project-meta">${[p.category, p.year].filter(Boolean).join(' · ')}</p>` : ''}
      </div>`).join('');

    grid.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        const p = projects.find(p => p.id === card.dataset.id);
        if (p) openLightbox(p);
      });
    });
  }

  /* ── Lightbox ── */
  function openLightbox(p) {
    const img = p.images?.[0] || p.thumbnail || '';
    document.getElementById('lightbox-img').src = img;
    document.getElementById('lightbox-title').textContent = p.title;
    document.getElementById('lightbox-meta').textContent  = [p.category, p.year].filter(Boolean).join(' · ');
    document.getElementById('lightbox-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    document.getElementById('lightbox-overlay').classList.remove('open');
    document.body.style.overflow = '';
  }
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('lightbox-overlay')) closeLightbox();
  });
})();
