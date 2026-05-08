/* ─── APP.JS ───────────────────────────────────────────────────────────────── */
/* Renders products, categories, search, modal.                                */
/* Depends on: CONFIG (config.js), Cart (cart.js), products.json               */

(function () {
  'use strict';

  /* ── Inject font ───────────────────────────────────────────────────────── */
  if (CONFIG.theme.fontImport) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CONFIG.theme.fontImport;
    document.head.prepend(link);
  }

  /* ── Apply theme ───────────────────────────────────────────────────────── */
  function applyTheme() {
    const root = document.documentElement;
    const scheme = CONFIG.theme.scheme;

    if (scheme === 'custom') {
      for (const [k, v] of Object.entries(CONFIG.theme.custom)) {
        root.style.setProperty(k, v);
      }
    } else {
      document.body.dataset.scheme = scheme;
      // Inject scheme class variables via a <style> tag
      const css = `[data-scheme="${scheme}"] { ${getSchemeVars(scheme)} }`;
      const s = document.createElement('style');
      s.textContent = css;
      document.head.appendChild(s);
    }

    root.style.setProperty('--font', CONFIG.theme.font);
    root.style.setProperty('--font-heading', CONFIG.theme.fontHeading || CONFIG.theme.font);
    root.style.setProperty('--radius', CONFIG.theme.borderRadius);
    root.style.setProperty('--cols', CONFIG.catalog.productsPerRow);
  }

  function getSchemeVars(scheme) {
    const schemes = {
      dark:   '--color-bg:#0f0f0f;--color-surface:#1a1a1a;--color-border:#2a2a2a;--color-text:#f0f0f0;--color-text-muted:#888;--color-primary:#ffffff;--color-accent:#e63946;',
      light:  '--color-bg:#ffffff;--color-surface:#f8f8f8;--color-border:#e8e8e8;--color-text:#1a1a1a;--color-text-muted:#666;--color-primary:#1a1a1a;--color-accent:#e63946;',
      warm:   '--color-bg:#fdf6ec;--color-surface:#fff9f2;--color-border:#e8d9c5;--color-text:#2c1810;--color-text-muted:#7a5c4a;--color-primary:#2c1810;--color-accent:#c0392b;',
      pastel: '--color-bg:#faf0f5;--color-surface:#ffffff;--color-border:#f0d6e4;--color-text:#2d1b26;--color-text-muted:#9b7080;--color-primary:#a0496a;--color-accent:#e91e63;',
    };
    return schemes[scheme] || schemes.light;
  }

  /* ── Populate static content ───────────────────────────────────────────── */
  function populateStatic() {
    document.title = CONFIG.store.name;
    if (CONFIG.store.favicon) {
      const link = document.createElement('link');
      link.rel = 'icon'; link.href = CONFIG.store.favicon;
      document.head.appendChild(link);
    }

    // Logo
    const logoEl = document.getElementById('nav-logo');
    if (CONFIG.store.logo) {
      logoEl.innerHTML = `<img src="${CONFIG.store.logo}" alt="${CONFIG.store.name}">`;
    } else {
      logoEl.textContent = CONFIG.store.name;
    }

    // Hero
    const hero = document.getElementById('hero');
    if (!CONFIG.hero.show) { hero.style.display = 'none'; }
    else {
      document.getElementById('hero-title').textContent = CONFIG.hero.title;
      document.getElementById('hero-subtitle').textContent = CONFIG.hero.subtitle;
      document.getElementById('hero-cta').textContent = CONFIG.hero.cta;
      if (CONFIG.hero.image) {
        hero.style.backgroundImage = `url('${CONFIG.hero.image}')`;
        hero.classList.add('has-image');
      }
    }

    // Nav search visibility
    if (!CONFIG.nav.showSearch) document.getElementById('nav-search').style.display = 'none';
    if (!CONFIG.nav.showCart)   document.getElementById('cart-btn').style.display = 'none';
    if (!CONFIG.nav.sticky)     document.getElementById('nav').style.position = 'relative';

    // WhatsApp float
    if (!CONFIG.whatsapp.floatingButton) {
      document.getElementById('whatsapp-float').style.display = 'none';
    } else {
      document.getElementById('whatsapp-float').href =
        `https://wa.me/${CONFIG.whatsapp.number.replace(/\D/g, '')}`;
    }

    // Footer
    if (!CONFIG.footer.show) { document.getElementById('footer').style.display = 'none'; }
    else {
      const year = new Date().getFullYear();
      document.getElementById('footer-text').textContent =
        CONFIG.footer.text || `© ${year} ${CONFIG.store.name}`;
      buildFooterSocial();
    }

    // Cart shipping note
    document.getElementById('cart-shipping-note').textContent = CONFIG.cart.shippingNote;
  }

  function buildFooterSocial() {
    const s = CONFIG.footer.social;
    const links = [];
    if (s.instagram) links.push(`<a href="https://instagram.com/${s.instagram}" target="_blank" rel="noopener">Instagram</a>`);
    if (s.facebook)  links.push(`<a href="https://facebook.com/${s.facebook}"  target="_blank" rel="noopener">Facebook</a>`);
    if (s.tiktok)    links.push(`<a href="https://tiktok.com/@${s.tiktok}"     target="_blank" rel="noopener">TikTok</a>`);
    document.getElementById('footer-social').innerHTML = links.join('');
  }

  /* ── Products ──────────────────────────────────────────────────────────── */
  let allProducts = [];
  let activeCategory = CONFIG.catalog.defaultCategory;
  let searchQuery = '';
  let activeSort = CONFIG.catalog.defaultSort || 'featured';

  async function loadProducts() {
    const res = await fetch('data/products.json');
    allProducts = await res.json();
    Cart.setProducts(allProducts);
    buildCategories();
    buildSort();
    renderProducts();
  }

  function buildCategories() {
    if (!CONFIG.catalog.showCategories) return;
    const cats = [CONFIG.catalog.defaultCategory, ...new Set(allProducts.map(p => p.category).filter(Boolean))];
    const container = document.getElementById('categories');
    container.innerHTML = cats.map(c =>
      `<button class="cat-btn${c === activeCategory ? ' active' : ''}" data-cat="${c}">${c}</button>`
    ).join('');
    container.addEventListener('click', e => {
      const btn = e.target.closest('.cat-btn');
      if (!btn) return;
      activeCategory = btn.dataset.cat;
      container.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b === btn));
      renderProducts();
    });
  }

  function buildSort() {
    const select = document.getElementById('sort-select');
    if (!CONFIG.catalog.showSort) { select.style.display = 'none'; return; }
    const options = [
      { value: 'featured',   label: 'Destacados' },
      { value: 'name-asc',   label: 'Nombre: A → Z' },
      { value: 'name-desc',  label: 'Nombre: Z → A' },
      { value: 'price-asc',  label: 'Precio: menor primero' },
      { value: 'price-desc', label: 'Precio: mayor primero' },
      { value: 'category',   label: 'Categoría' },
    ];
    select.innerHTML = options.map(o =>
      `<option value="${o.value}"${o.value === activeSort ? ' selected' : ''}>${o.label}</option>`
    ).join('');
    select.addEventListener('change', () => {
      activeSort = select.value;
      renderProducts();
    });
  }

  function getSorted(products) {
    const sorted = [...products];
    switch (activeSort) {
      case 'name-asc':   return sorted.sort((a, b) => a.name.localeCompare(b.name, 'es'));
      case 'name-desc':  return sorted.sort((a, b) => b.name.localeCompare(a.name, 'es'));
      case 'price-asc':  return sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      case 'price-desc': return sorted.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
      case 'category':   return sorted.sort((a, b) => (a.category || '').localeCompare(b.category || '', 'es'));
      default:           return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }

  function getFiltered() {
    return allProducts.filter(p => {
      const matchCat    = activeCategory === CONFIG.catalog.defaultCategory || p.category === activeCategory;
      const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery) ||
                          (p.description || '').toLowerCase().includes(searchQuery);
      const matchStock  = CONFIG.catalog.showOutOfStock || p.stock !== 0;
      return matchCat && matchSearch && matchStock;
    });
  }

  function formatPrice(price) {
    if (price == null || price === '') return null;
    return CONFIG.store.currencySymbol + Number(price).toLocaleString(CONFIG.store.locale);
  }

  function renderProducts() {
    const grid = document.getElementById('products-grid');
    const filtered = getSorted(getFiltered());
    const empty = document.getElementById('empty-state');

    if (!filtered.length) {
      grid.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';

    grid.innerHTML = filtered.map(p => {
      const img     = p.images?.[0] || '';
      const price   = formatPrice(p.price);
      const inStock = p.stock == null || p.stock > 0;
      const oos     = !inStock;
      return `
        <div class="product-card${oos ? ' out-of-stock' : ''}" data-id="${p.id}">
          <div class="product-img-wrap">
            ${img ? `<img src="${img}" alt="${p.name}" loading="lazy">` : ''}
          </div>
          <div class="product-info">
            ${p.category ? `<p class="product-category">${p.category}</p>` : ''}
            <p class="product-name">${p.name}</p>
            <div class="product-footer">
              ${price
                ? `<span class="product-price">${price}</span>`
                : `<span class="product-price no-price">Consultar precio</span>`}
              <button class="add-to-cart" data-id="${p.id}" ${oos ? 'disabled' : ''}>
                ${oos ? CONFIG.catalog.outOfStockLabel : CONFIG.catalog.addToCartLabel}
              </button>
            </div>
          </div>
        </div>`;
    }).join('');

    grid.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('.add-to-cart')) return;
        openModal(card.dataset.id);
      });
    });

    grid.querySelectorAll('.add-to-cart:not(:disabled)').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        Cart.add(btn.dataset.id);
        showToast(`Agregado al carrito ✓`);
      });
    });
  }

  /* ── Search ────────────────────────────────────────────────────────────── */
  document.getElementById('search-input').addEventListener('input', e => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderProducts();
  });

  /* ── Hero CTA ──────────────────────────────────────────────────────────── */
  document.getElementById('hero-cta').addEventListener('click', () => {
    if (CONFIG.hero.ctaScroll) {
      document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    }
  });

  /* ── Carousel ──────────────────────────────────────────────────────────── */
  function buildCarousel(container, images, altText) {
    if (!images || images.length === 0) { container.innerHTML = ''; return; }
    if (images.length === 1) {
      container.innerHTML = `<img src="${images[0]}" alt="${altText}">`;
      return;
    }
    let idx = 0;
    container.innerHTML = `
      <div class="carousel">
        <div class="carousel-track">${images.map(src => `<img src="${src}" alt="${altText}" loading="lazy">`).join('')}</div>
        <button class="carousel-btn prev" aria-label="Anterior">&#8249;</button>
        <button class="carousel-btn next" aria-label="Siguiente">&#8250;</button>
        <div class="carousel-dots">${images.map((_, i) => `<span class="carousel-dot${i === 0 ? ' active' : ''}"></span>`).join('')}</div>
      </div>`;
    const track = container.querySelector('.carousel-track');
    const dots  = container.querySelectorAll('.carousel-dot');
    function go(n) {
      idx = (n + images.length) % images.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }
    container.querySelector('.prev').addEventListener('click', () => go(idx - 1));
    container.querySelector('.next').addEventListener('click', () => go(idx + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
  }

  /* ── Modal ─────────────────────────────────────────────────────────────── */
  function openModal(id) {
    const p = allProducts.find(p => p.id === id);
    if (!p) return;
    const price = formatPrice(p.price);
    const inStock = p.stock == null || p.stock > 0;

    buildCarousel(document.getElementById('modal-img'), p.images || [], p.name);
    document.getElementById('modal-category').textContent   = p.category || '';
    document.getElementById('modal-name').textContent       = p.name;
    document.getElementById('modal-price').textContent      = price || 'Consultar precio';
    document.getElementById('modal-description').textContent = p.description || '';
    const addBtn = document.getElementById('modal-add-btn');
    addBtn.textContent = inStock ? CONFIG.catalog.addToCartLabel : CONFIG.catalog.outOfStockLabel;
    addBtn.disabled = !inStock;
    addBtn.onclick = () => {
      if (!inStock) return;
      Cart.add(id);
      showToast(`Agregado al carrito ✓`);
      closeModal();
    };

    document.getElementById('modal-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });

  /* ── Toast ─────────────────────────────────────────────────────────────── */
  let toastTimer;
  function showToast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  /* ── Promo bridge ──────────────────────────────────────────────────────── */
  function buildPromo() {
    const cfg = CONFIG.promo;
    const section = document.getElementById('promo');
    if (!cfg || !cfg.show || !cfg.items?.length) { section.style.display = 'none'; return; }

    const headingEl = document.getElementById('promo-heading');
    if (cfg.heading) { headingEl.textContent = cfg.heading; }
    else { headingEl.style.display = 'none'; }

    const layout = cfg.layout || 'cards';
    const container = document.getElementById('promo-items');
    container.className = `layout-${layout}`;

    if (layout === 'alternating') {
      container.innerHTML = cfg.items.map((item, i) => `
        <div class="promo-block${i % 2 === 1 ? ' reverse' : ''}">
          <div class="promo-block-img">
            ${item.image ? `<img src="${item.image}" alt="${item.title || ''}">` : ''}
          </div>
          <div class="promo-block-body">
            ${item.label ? `<p class="promo-label">${item.label}</p>` : ''}
            ${item.title ? `<h3 class="promo-title">${item.title}</h3>` : ''}
            ${item.text  ? `<p class="promo-text">${item.text}</p>`   : ''}
            ${item.cta   ? `<a class="promo-cta" href="${item.ctaUrl || '#catalog'}">${item.cta}</a>` : ''}
          </div>
        </div>`).join('');
    } else {
      container.innerHTML = cfg.items.map(item => `
        <div class="promo-card">
          ${item.image ? `<div class="promo-card-img"><img src="${item.image}" alt="${item.title || ''}"></div>` : ''}
          <div class="promo-card-body">
            ${item.label ? `<p class="promo-label">${item.label}</p>` : ''}
            ${item.title ? `<h3 class="promo-title">${item.title}</h3>` : ''}
            ${item.text  ? `<p class="promo-text">${item.text}</p>`   : ''}
            ${item.cta   ? `<a class="promo-cta" href="${item.ctaUrl || '#catalog'}">${item.cta}</a>` : ''}
          </div>
        </div>`).join('');
    }
  }

  /* ── Announcement ─────────────────────────────────────────────────────── */
  function buildAnnouncement() {
    const cfg = CONFIG.announcement;
    const section = document.getElementById('announcement');
    if (!cfg || !cfg.show) { section.style.display = 'none'; return; }

    const itemsEl = document.getElementById('announcement-items');
    itemsEl.innerHTML = (cfg.items || []).map(item => `
      <div class="announcement-item">
        ${item.icon ? `<span class="announcement-icon">${item.icon}</span>` : ''}
        <div class="announcement-body">
          ${item.title ? `<p class="announcement-title">${item.title}</p>` : ''}
          ${item.text  ? `<p class="announcement-text">${item.text}</p>`   : ''}
        </div>
      </div>`).join('');

    const noteEl = document.getElementById('announcement-note');
    noteEl.innerHTML = cfg.note || '';
  }

  /* ── Init ──────────────────────────────────────────────────────────────── */
  applyTheme();
  populateStatic();
  buildPromo();
  buildAnnouncement();
  loadProducts();
})();
