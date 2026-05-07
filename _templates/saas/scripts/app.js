(function () {
  'use strict';

  /* ── Theme ────────────────────────────────────────────────────────────── */
  if (CONFIG.theme.fontImport) {
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = CONFIG.theme.fontImport;
    document.head.prepend(l);
  }

  const root = document.documentElement;
  root.style.setProperty('--font',         CONFIG.theme.font);
  root.style.setProperty('--radius',       CONFIG.theme.borderRadius);
  root.style.setProperty('--color-accent', CONFIG.theme.accentColor);
  root.style.setProperty('--color-accent-text', CONFIG.theme.accentColorText);

  if (CONFIG.theme.scheme === 'custom') {
    for (const [k, v] of Object.entries(CONFIG.theme.custom)) root.style.setProperty(k, v);
  } else {
    document.body.dataset.scheme = CONFIG.theme.scheme;
  }

  /* ── Brand & nav ──────────────────────────────────────────────────────── */
  document.title = CONFIG.brand.name;
  if (CONFIG.brand.favicon) {
    const f = document.createElement('link'); f.rel = 'icon'; f.href = CONFIG.brand.favicon;
    document.head.appendChild(f);
  }

  const logoEl = document.getElementById('nav-logo');
  logoEl.innerHTML = CONFIG.brand.logo
    ? `<img src="${CONFIG.brand.logo}" alt="${CONFIG.brand.name}">`
    : CONFIG.brand.name;

  document.getElementById('nav-links').innerHTML = CONFIG.nav.links
    .map(l => `<a href="${l.href}">${l.label}</a>`).join('');

  const actions = document.getElementById('nav-actions');
  actions.innerHTML = `
    <a href="${CONFIG.nav.ctaSecondary.href}" class="btn btn-ghost">${CONFIG.nav.ctaSecondary.label}</a>
    <a href="${CONFIG.nav.ctaPrimary.href}"   class="btn btn-accent">${CONFIG.nav.ctaPrimary.label}</a>`;

  /* ── Hero ─────────────────────────────────────────────────────────────── */
  const heroInner = document.getElementById('hero-inner');
  if (!CONFIG.hero.image) heroInner.classList.add('no-image');

  const badgeEl = document.getElementById('hero-badge');
  if (CONFIG.hero.badge) { badgeEl.textContent = CONFIG.hero.badge; }
  else { badgeEl.style.display = 'none'; }

  document.getElementById('hero-h1').textContent    = CONFIG.hero.headline;
  document.getElementById('hero-sub').textContent   = CONFIG.hero.subheadline;
  document.getElementById('hero-cta-primary').href  = CONFIG.hero.ctaPrimary.href;
  document.getElementById('hero-cta-primary').textContent = CONFIG.hero.ctaPrimary.label;
  document.getElementById('hero-cta-secondary').href = CONFIG.hero.ctaSecondary.href;
  document.getElementById('hero-cta-secondary').textContent = CONFIG.hero.ctaSecondary.label;

  const proofEl = document.getElementById('hero-proof');
  if (CONFIG.hero.socialProof) { proofEl.textContent = CONFIG.hero.socialProof; }
  else { proofEl.style.display = 'none'; }

  const imgWrap = document.getElementById('hero-image-wrap');
  if (CONFIG.hero.image) {
    imgWrap.innerHTML = `<div id="hero-image"><img src="${CONFIG.hero.image}" alt="${CONFIG.brand.name} screenshot"></div>`;
  } else {
    imgWrap.innerHTML = `<div id="hero-image-placeholder">[ Product screenshot ]</div>`;
  }

  /* ── Logos ────────────────────────────────────────────────────────────── */
  const logosEl = document.getElementById('logos');
  if (!CONFIG.logos.show || !CONFIG.logos.items.length) {
    logosEl.style.display = 'none';
  } else {
    document.getElementById('logos-label').textContent = CONFIG.logos.label;
    document.getElementById('logos-list').innerHTML = CONFIG.logos.items
      .map(i => `<img src="${i.logo}" alt="${i.name}">`).join('');
  }

  /* ── Features ─────────────────────────────────────────────────────────── */
  root.style.setProperty('--feat-cols', CONFIG.features.columns);
  document.getElementById('features-title').textContent    = CONFIG.features.title;
  document.getElementById('features-subtitle').textContent = CONFIG.features.subtitle;

  fetch('data/features.json').then(r => r.json()).then(items => {
    document.getElementById('features-grid').innerHTML = items.map(f => `
      <div class="feature-card">
        <div class="feature-icon">${f.icon}</div>
        <h3 class="feature-title">${f.title}</h3>
        <p class="feature-desc">${f.description}</p>
      </div>`).join('');
  });

  /* ── How it works ─────────────────────────────────────────────────────── */
  const hiwEl = document.getElementById('how-it-works');
  if (!CONFIG.howItWorks.show) { hiwEl.style.display = 'none'; }
  else {
    document.getElementById('hiw-title').textContent = CONFIG.howItWorks.title;
    const subtitleEl = document.getElementById('hiw-subtitle');
    if (CONFIG.howItWorks.subtitle) { subtitleEl.textContent = CONFIG.howItWorks.subtitle; }
    else { subtitleEl.style.display = 'none'; }

    fetch('data/how-it-works.json').then(r => r.json()).then(steps => {
      document.getElementById('steps').innerHTML = steps.map(s => `
        <div class="step">
          <div class="step-number">${s.step}</div>
          <h3 class="step-title">${s.title}</h3>
          <p class="step-desc">${s.description}</p>
        </div>`).join('');
    });
  }

  /* ── Pricing ──────────────────────────────────────────────────────────── */
  document.getElementById('pricing-title').textContent    = CONFIG.pricing.title;
  document.getElementById('pricing-subtitle').textContent = CONFIG.pricing.subtitle;

  const toggleEl = document.getElementById('billing-toggle');
  if (!CONFIG.pricing.billingToggle) { toggleEl.style.display = 'none'; }
  else {
    document.getElementById('toggle-annual-badge').textContent = CONFIG.pricing.annualDiscount;
  }

  let isAnnual = false;

  fetch('data/pricing.json').then(r => r.json()).then(plans => {
    root.style.setProperty('--plan-cols', plans.length);

    function renderPricing() {
      document.getElementById('pricing-grid').innerHTML = plans.map(p => {
        const price   = isAnnual ? p.annualPrice : p.monthlyPrice;
        const isFree  = price === 0;
        const display = isFree ? 'Free' : `${CONFIG.pricing.currency}${price}`;
        return `
          <div class="pricing-card${p.highlighted ? ' highlighted' : ''}">
            ${p.badge ? `<span class="plan-badge">${p.badge}</span>` : ''}
            <h3 class="plan-name">${p.name}</h3>
            <p class="plan-desc">${p.description}</p>
            <div class="plan-price">
              <span class="plan-amount">${display}</span>
            </div>
            <p class="plan-note">${isFree ? '' : p.priceNote}</p>
            <a href="#" class="btn ${p.highlighted ? 'btn-accent' : 'btn-ghost'} btn-lg plan-cta">
              ${p.cta || CONFIG.pricing.ctaLabel}
            </a>
            <ul class="plan-features">
              ${p.features.map(f => `<li class="plan-feature">${f}</li>`).join('')}
            </ul>
          </div>`;
      }).join('');
    }

    renderPricing();

    // Enterprise row
    const entEl = document.getElementById('pricing-enterprise');
    if (!CONFIG.pricing.enterpriseCard) { entEl.style.display = 'none'; }

    // Billing toggle
    toggleEl.querySelectorAll('.toggle-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        isAnnual = btn.dataset.billing === 'annual';
        toggleEl.querySelectorAll('.toggle-opt').forEach(b => b.classList.toggle('active', b === btn));
        renderPricing();
      });
    });
  });

  /* ── Testimonials ─────────────────────────────────────────────────────── */
  const testiEl = document.getElementById('testimonials');
  if (!CONFIG.testimonials.show) { testiEl.style.display = 'none'; }
  else {
    document.getElementById('testimonials-title').textContent = CONFIG.testimonials.title;
    fetch('data/testimonials.json').then(r => r.json()).then(items => {
      document.getElementById('testimonials-grid').innerHTML = items.map(t => {
        const initials = t.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
        return `
          <div class="testimonial-card">
            <p class="testimonial-quote">${t.quote}</p>
            <div class="testimonial-author">
              <div class="testimonial-avatar">
                ${t.avatar ? `<img src="${t.avatar}" alt="${t.name}">` : initials}
              </div>
              <div>
                <p class="testimonial-name">${t.name}</p>
                <p class="testimonial-role">${t.role} · ${t.company}</p>
              </div>
            </div>
          </div>`;
      }).join('');
    });
  }

  /* ── FAQ ──────────────────────────────────────────────────────────────── */
  const faqEl = document.getElementById('faq');
  if (!CONFIG.faq.show) { faqEl.style.display = 'none'; }
  else {
    document.getElementById('faq-title').textContent = CONFIG.faq.title;
    fetch('data/faq.json').then(r => r.json()).then(items => {
      const list = document.getElementById('faq-list');
      list.innerHTML = items.map((item, i) => `
        <div class="faq-item" data-i="${i}">
          <button class="faq-question">
            ${item.question}
            <span class="faq-chevron">▾</span>
          </button>
          <div class="faq-answer">${item.answer}</div>
        </div>`).join('');

      list.addEventListener('click', e => {
        const item = e.target.closest('.faq-item');
        if (!item) return;
        const isOpen = item.classList.contains('open');
        list.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ── Bottom CTA ───────────────────────────────────────────────────────── */
  document.getElementById('cta-headline').textContent = CONFIG.cta.headline;
  document.getElementById('cta-subtitle').textContent = CONFIG.cta.subtitle;
  const ctaBtn = document.getElementById('bottom-cta-btn');
  ctaBtn.href        = CONFIG.cta.button.href;
  ctaBtn.textContent = CONFIG.cta.button.label;

  /* ── Footer ───────────────────────────────────────────────────────────── */
  document.getElementById('footer-brand-name').textContent = CONFIG.brand.name;
  document.getElementById('footer-brand-tag').textContent  = CONFIG.brand.tagline;

  const socEl = document.getElementById('footer-social');
  const socLinks = [];
  if (CONFIG.footer.social.twitter)  socLinks.push(`<a href="https://twitter.com/${CONFIG.footer.social.twitter}"  target="_blank" rel="noopener">Twitter</a>`);
  if (CONFIG.footer.social.linkedin) socLinks.push(`<a href="https://linkedin.com/company/${CONFIG.footer.social.linkedin}" target="_blank" rel="noopener">LinkedIn</a>`);
  if (CONFIG.footer.social.github)   socLinks.push(`<a href="https://github.com/${CONFIG.footer.social.github}" target="_blank" rel="noopener">GitHub</a>`);
  socEl.innerHTML = socLinks.join('');

  const footerCols = document.getElementById('footer-cols');
  root.style.setProperty('--footer-cols', CONFIG.footer.columns.length);
  footerCols.innerHTML = CONFIG.footer.columns.map(col => `
    <div>
      <p class="footer-col-title">${col.title}</p>
      <div class="footer-col-links">
        ${col.links.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
      </div>
    </div>`).join('');

  const year = new Date().getFullYear();
  document.getElementById('footer-copy').textContent =
    CONFIG.footer.copyright || `© ${year} ${CONFIG.brand.name}. All rights reserved.`;
})();
