/* ─── SCROLL OBSERVER ──────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* Auto-target known structural elements */
  const SELECTORS = [
    '#hero-text', '#hero-badge', '#hero-h1', '#hero-sub', '#hero-actions',
    '#hero-inner > *',
    '.feature-card', '.product-card', '.post-card', '.project-card',
    '.step', '.testimonial-card', '.pricing-card',
    '#features-header', '#pricing-header', '#testimonials-header',
    '#faq-header', '#how-it-works-header',
    '.section-title', '#work-title', '#contact',
    '#about-inner > *', '#hero-proof', '.cart-empty',
    '#bottom-cta > *',
  ];

  function init() {
    document.querySelectorAll(SELECTORS.join(',')).forEach((el, i) => {
      if (!el.classList.contains('anim') && !el.classList.contains('anim-left') && !el.classList.contains('anim-scale')) {
        el.classList.add('anim');
      }
    });

    /* Stagger grid children */
    document.querySelectorAll(
      '#products-grid, #features-grid, #testimonials-grid, #projects-grid, #posts-grid, #steps, #pricing-grid'
    ).forEach(grid => {
      Array.from(grid.children).forEach((child, i) => {
        child.style.setProperty('--d', (i * 0.07) + 's');
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.anim, .anim-left, .anim-right, .anim-scale').forEach(el => {
      observer.observe(el);
    });
  }

  /* Run after templates render their content */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 80));
  } else {
    setTimeout(init, 80);
  }
})();
