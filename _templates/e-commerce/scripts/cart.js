/* ─── CART.JS ──────────────────────────────────────────────────────────────── */
/* Cart state, drawer UI, and WhatsApp checkout.                               */

const Cart = (function () {
  'use strict';

  const STORAGE_KEY = 'cart_' + location.pathname;
  let items = [];    // [{ product, qty }]
  let products = []; // filled after products.json loads — injected by app.js

  /* ── State ─────────────────────────────────────────────────────────────── */
  function load() {
    if (!CONFIG.cart.persist) return;
    try { items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { items = []; }
  }

  function save() {
    if (CONFIG.cart.persist) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function add(productId, qty = 1) {
    const existing = items.find(i => i.id === productId);
    if (existing) { existing.qty += qty; }
    else { items.push({ id: productId, qty }); }
    save();
    render();
  }

  function remove(productId) {
    items = items.filter(i => i.id !== productId);
    save();
    render();
  }

  function setQty(productId, qty) {
    if (qty < 1) { remove(productId); return; }
    const existing = items.find(i => i.id === productId);
    if (existing) existing.qty = qty;
    save();
    render();
  }

  function total() {
    return items.reduce((sum, i) => {
      const p = getProduct(i.id);
      return sum + (p ? (p.price || 0) * i.qty : 0);
    }, 0);
  }

  function count() {
    return items.reduce((s, i) => s + i.qty, 0);
  }

  function getProduct(id) {
    return (window._products || []).find(p => p.id === id);
  }

  /* ── Drawer UI ─────────────────────────────────────────────────────────── */
  function render() {
    const n = count();
    const countEl = document.getElementById('cart-count');
    countEl.textContent = n;
    countEl.style.display = n > 0 ? 'flex' : 'none';

    const itemsEl  = document.getElementById('cart-items');
    const emptyEl  = document.getElementById('cart-empty');
    const footerEl = document.getElementById('cart-footer');

    if (!items.length) {
      itemsEl.innerHTML = '';
      emptyEl.style.display = 'block';
      footerEl.style.display = 'none';
      return;
    }
    emptyEl.style.display = 'none';
    footerEl.style.display = 'block';

    itemsEl.innerHTML = items.map(i => {
      const p = getProduct(i.id);
      if (!p) return '';
      const img   = p.images?.[0] || '';
      const price = p.price
        ? CONFIG.store.currencySymbol + (p.price * i.qty).toLocaleString(CONFIG.store.locale)
        : 'Consultar';
      return `
        <div class="cart-item" data-id="${p.id}">
          ${img ? `<img class="cart-item-img" src="${img}" alt="${p.name}">` : '<div class="cart-item-img"></div>'}
          <div>
            <p class="cart-item-name">${p.name}</p>
            <p class="cart-item-price">${price}</p>
            <div class="cart-qty">
              <button class="qty-btn" data-action="dec" data-id="${p.id}">−</button>
              <span class="qty-val">${i.qty}</span>
              <button class="qty-btn" data-action="inc" data-id="${p.id}">+</button>
            </div>
          </div>
          <button class="cart-item-remove" data-remove="${p.id}">×</button>
        </div>`;
    }).join('');

    itemsEl.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id  = btn.dataset.id;
        const cur = items.find(i => i.id === id)?.qty || 0;
        setQty(id, btn.dataset.action === 'inc' ? cur + 1 : cur - 1);
      });
    });

    itemsEl.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => remove(btn.dataset.remove));
    });

    const t = total();
    document.getElementById('cart-subtotal').innerHTML =
      `<span>Subtotal</span><span>${CONFIG.store.currencySymbol}${t.toLocaleString(CONFIG.store.locale)}</span>`;
  }

  /* ── Drawer open/close ─────────────────────────────────────────────────── */
  function open()  {
    document.getElementById('cart-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    document.getElementById('cart-overlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('cart-btn').addEventListener('click', open);
  document.getElementById('cart-close').addEventListener('click', close);
  document.getElementById('cart-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('cart-overlay')) close();
  });

  /* ── WhatsApp checkout ─────────────────────────────────────────────────── */
  document.getElementById('whatsapp-checkout').addEventListener('click', () => {
    if (!items.length) return;
    const lines = items.map(i => {
      const p = getProduct(i.id);
      if (!p) return '';
      const price = p.price ? `${CONFIG.store.currencySymbol}${(p.price * i.qty).toLocaleString(CONFIG.store.locale)}` : '';
      return `• ${p.name} x${i.qty}${price ? ' — ' + price : ''}`;
    }).filter(Boolean).join('\n');

    const totalLine = total() > 0
      ? `\nTotal: ${CONFIG.store.currencySymbol}${total().toLocaleString(CONFIG.store.locale)}`
      : '';

    const msg = encodeURIComponent(
      CONFIG.whatsapp.greeting + lines + totalLine + CONFIG.whatsapp.footer
    );
    const number = CONFIG.whatsapp.number.replace(/\D/g, '');
    window.open(`https://wa.me/${number}?text=${msg}`, '_blank');
  });

  /* ── Init ──────────────────────────────────────────────────────────────── */
  load();

  // Called by app.js once products.json is loaded
  function setProducts(list) {
    window._products = list;
    render();
  }

  return { add, remove, setQty, setProducts, render };
})();
