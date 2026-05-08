/* ─── SCROLL REVEALS ────────────────────────────────────────────────────────── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// Stagger siblings that share a parent
document.querySelectorAll('.reveal').forEach(el => {
  const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
  el.style.transitionDelay = siblings.indexOf(el) * 110 + 'ms';
  observer.observe(el);
});

/* ─── FILMSTRIP DRAG ────────────────────────────────────────────────────────── */
const track = document.getElementById('strip-track');
let isDragging = false, startX = 0, scrollLeft = 0;

track.addEventListener('mousedown', e => {
  isDragging = true;
  track.classList.add('dragging');
  startX    = e.pageX - track.offsetLeft;
  scrollLeft = track.scrollLeft;
});
document.addEventListener('mouseup',    () => { isDragging = false; track.classList.remove('dragging'); });
document.addEventListener('mouseleave', () => { isDragging = false; track.classList.remove('dragging'); });
track.addEventListener('mousemove', e => {
  if (!isDragging) return;
  e.preventDefault();
  const x  = e.pageX - track.offsetLeft;
  track.scrollLeft = scrollLeft - (x - startX) * 1.6;
});
track.addEventListener('touchstart', e => {
  startX     = e.touches[0].pageX - track.offsetLeft;
  scrollLeft = track.scrollLeft;
}, { passive: true });
track.addEventListener('touchmove', e => {
  const x = e.touches[0].pageX - track.offsetLeft;
  track.scrollLeft = scrollLeft - (x - startX);
}, { passive: true });

/* ─── FILMSTRIP HOLES ───────────────────────────────────────────────────────── */
function buildHoles(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  for (let i = 0; i < 60; i++) {
    const hole = document.createElement('div');
    hole.className = 'strip-hole';
    el.appendChild(hole);
  }
}
buildHoles('holes-top');
buildHoles('holes-bottom');

/* ─── POLAROID 3D TILT ──────────────────────────────────────────────────────── */
document.querySelectorAll('.polaroid').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r   = card.getBoundingClientRect();
    const dx  = ((e.clientX - r.left) / r.width  - .5) * 2;
    const dy  = ((e.clientY - r.top)  / r.height - .5) * 2;
    const rot = parseFloat(card.style.getPropertyValue('--r')) || 0;
    card.style.transform = `
      rotate(${rot * .4}deg)
      translateX(var(--tx,0))
      translateY(calc(var(--ty,0) - 12px))
      rotateX(${-dy * 10}deg)
      rotateY(${dx * 10}deg)
      scale(1.06)
    `;
    card.style.perspective = '800px';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.perspective = '';
  });
});

/* ─── CULTURE IMAGES PARALLAX ───────────────────────────────────────────────── */
const cImgs = document.querySelectorAll('.c-img');
const cultSection = document.getElementById('culture');

if (cultSection) {
  window.addEventListener('scroll', () => {
    const rect  = cultSection.getBoundingClientRect();
    const progress = -rect.top / (rect.height + window.innerHeight);
    cImgs.forEach((img, i) => {
      const base  = ['-2.5deg', '3deg', '-1deg'][i];
      const speed = [18, -14, 10][i];
      img.style.transform = `rotate(${base}) translateY(${progress * speed}px)`;
    });
  }, { passive: true });
}

/* ─── HERO TITLE GLITCH (subtle) ───────────────────────────────────────────── */
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  setInterval(() => {
    if (Math.random() > 0.94) {
      heroTitle.style.textShadow = `${(Math.random()-.5)*6}px 0 rgba(184,92,56,.7)`;
      setTimeout(() => { heroTitle.style.textShadow = ''; }, 80);
    }
  }, 1200);
}
