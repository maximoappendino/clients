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
  const schemeVars = {
    dark:   '--color-bg:#0f0f0f;--color-surface:#1a1a1a;--color-border:#2a2a2a;--color-text:#f0f0f0;--color-text-muted:#888;--color-primary:#ffffff;--color-accent:#e63946;',
    light:  '--color-bg:#ffffff;--color-surface:#f8f8f8;--color-border:#e8e8e8;--color-text:#1a1a1a;--color-text-muted:#666;--color-primary:#1a1a1a;--color-accent:#e63946;',
    warm:   '--color-bg:#fdf6ec;--color-surface:#fff9f2;--color-border:#e8d9c5;--color-text:#2c1810;--color-text-muted:#7a5c4a;--color-primary:#2c1810;--color-accent:#c0392b;',
    pastel: '--color-bg:#faf0f5;--color-surface:#ffffff;--color-border:#f0d6e4;--color-text:#2d1b26;--color-text-muted:#9b7080;--color-primary:#a0496a;--color-accent:#e91e63;',
  };
  if (CONFIG.theme.scheme !== 'custom') {
    const s = document.createElement('style');
    s.textContent = `:root { ${schemeVars[CONFIG.theme.scheme] || schemeVars.light} }`;
    document.head.appendChild(s);
  } else {
    for (const [k, v] of Object.entries(CONFIG.theme.custom)) root.style.setProperty(k, v);
  }

  /* ── Static ── */
  document.title = CONFIG.blog.name;
  document.getElementById('nav-logo').textContent = CONFIG.blog.name;

  const year = new Date().getFullYear();
  document.getElementById('footer-text').textContent = CONFIG.footer.text || `© ${year} ${CONFIG.blog.name}`;

  const soc = document.getElementById('footer-social');
  const sl = [];
  if (CONFIG.social.instagram) sl.push(`<a href="https://instagram.com/${CONFIG.social.instagram}" target="_blank">Instagram</a>`);
  if (CONFIG.social.twitter)   sl.push(`<a href="https://twitter.com/${CONFIG.social.twitter}"   target="_blank">Twitter/X</a>`);
  soc.innerHTML = sl.join('');

  /* ── Posts ── */
  let allPosts = [];
  let activeCategory = 'Todos';
  let searchQuery = '';

  fetch('data/posts.json').then(r => r.json()).then(data => {
    allPosts = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    buildNavCats();
    render();
  });

  function buildNavCats() {
    if (!CONFIG.nav.categories) return;
    const cats = ['Todos', ...new Set(allPosts.map(p => p.category).filter(Boolean))];
    const navCats = document.getElementById('nav-cats');
    navCats.innerHTML = cats.map(c =>
      `<a href="#" data-cat="${c}" class="${c === activeCategory ? 'active' : ''}">${c}</a>`
    ).join('');
    navCats.addEventListener('click', e => {
      e.preventDefault();
      const a = e.target.closest('[data-cat]');
      if (!a) return;
      activeCategory = a.dataset.cat;
      navCats.querySelectorAll('a').forEach(l => l.classList.toggle('active', l === a));
      render();
    });
  }

  function getFiltered() {
    return allPosts.filter(p => {
      const matchCat    = activeCategory === 'Todos' || p.category === activeCategory;
      const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery) || (p.excerpt || '').toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });
  }

  function fmtDate(str) {
    return new Date(str + 'T00:00:00').toLocaleDateString('es-AR', { day:'numeric', month:'long', year:'numeric' });
  }

  function render() {
    const filtered = getFiltered();
    const [featured, ...rest] = filtered;

    // Hero post
    const heroEl = document.getElementById('hero-post');
    if (featured) {
      heroEl.style.display = '';
      document.getElementById('hero-thumb').innerHTML = featured.thumbnail
        ? `<img src="${featured.thumbnail}" alt="${featured.title}" loading="lazy">` : '';
      document.getElementById('hero-cat').textContent     = featured.category || '';
      document.getElementById('hero-title').textContent   = featured.title;
      document.getElementById('hero-excerpt').textContent = featured.excerpt || '';
      document.getElementById('hero-meta').textContent    = `${fmtDate(featured.date)} · ${featured.author || CONFIG.blog.author}`;
      heroEl.onclick = () => openPost(featured);
    } else {
      heroEl.style.display = 'none';
    }

    // Grid
    const grid = document.getElementById('posts-grid');
    grid.innerHTML = rest.map(p => `
      <div class="post-card" data-id="${p.id}">
        <div class="post-thumb">${p.thumbnail ? `<img src="${p.thumbnail}" alt="${p.title}" loading="lazy">` : ''}</div>
        ${p.category ? `<p class="post-cat">${p.category}</p>` : ''}
        <h3 class="post-title">${p.title}</h3>
        ${p.excerpt ? `<p class="post-excerpt">${p.excerpt}</p>` : ''}
        <p class="post-meta">${fmtDate(p.date)}</p>
      </div>`).join('');

    grid.querySelectorAll('.post-card').forEach(card => {
      card.addEventListener('click', () => {
        const p = allPosts.find(p => p.id === card.dataset.id);
        if (p) openPost(p);
      });
    });
  }

  /* ── Search ── */
  document.getElementById('search-input').addEventListener('input', e => {
    searchQuery = e.target.value.toLowerCase().trim();
    render();
  });

  /* ── Post modal ── */
  function openPost(p) {
    document.getElementById('post-modal-img').innerHTML = p.thumbnail
      ? `<img src="${p.thumbnail}" alt="${p.title}">` : '';
    document.getElementById('post-modal-cat').textContent   = p.category || '';
    document.getElementById('post-modal-title').textContent = p.title;
    document.getElementById('post-modal-meta').textContent  = `${fmtDate(p.date)} · ${p.author || CONFIG.blog.author}`;
    document.getElementById('post-modal-content').innerHTML = p.content || '';
    document.getElementById('post-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closePost() {
    document.getElementById('post-overlay').classList.remove('open');
    document.body.style.overflow = '';
  }
  document.getElementById('post-close').addEventListener('click', closePost);
  document.getElementById('post-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('post-overlay')) closePost();
  });
})();
