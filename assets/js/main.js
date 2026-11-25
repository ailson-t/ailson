/* ------------------------------------------------------------------
   MARCAS DO MOSAICO: edite esta lista.
   { name: 'Nome' } mostra o nome em texto;
   { name: 'Nome', logo: 'arquivo.png' } mostra o logo (use versão branca).
------------------------------------------------------------------ */
const BRANDS = [
  { name: 'Governo do Estado de São Paulo', logo: 'assets/img/logos/governo-sp.png' },
  { name: 'Fundação Itaú' },
  { name: 'CNPq', logo: 'assets/img/logos/cnpq.png' },
  { name: 'Datafolha', logo: 'assets/img/logos/datafolha.png' },
  { name: 'Itaú Cultural' },
  { name: 'FAPESP', logo: 'assets/img/logos/fapesp.png' },
  { name: 'Governo Federal', logo: 'assets/img/logos/governo-federal.png' },
  { name: 'CAPES' },
  { name: 'FLIP', logo: 'assets/img/logos/flip.png' },
  { name: 'Fundação Roberto Marinho', logo: 'assets/img/logos/fundacao-roberto-marinho.png' },
  { name: 'Itaú Social' },
  { name: 'USP', logo: 'assets/img/logos/usp.png' },
  { name: 'Instituto Butantan', logo: 'assets/img/logos/instituto-butantan.png' },
];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Coreografia de scroll ---------- */
const stage = document.getElementById('stage');
const dimmer = document.getElementById('stageDimmer');
const brand = document.getElementById('brandName');
const menuBtn = document.getElementById('menuBtn');
const topShade = document.getElementById('topShade');
const bottomShade = document.getElementById('bottomShade');
const shortcut = document.getElementById('shortcut');
const shortcutLabel = document.getElementById('shortcutLabel');
let atFooter = false;

let target = 0, current = 0, raf = null;
const ease = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;

function onScroll() {
  target = Math.min(Math.max(window.scrollY / ((window.innerHeight || 1) * 0.9), 0), 1);
  if (reduceMotion) { current = target; render(); return; }
  if (!raf) raf = requestAnimationFrame(tick);
}
function tick() {
  const d = target - current;
  current = Math.abs(d) > 0.0005 ? current + d * 0.14 : target;
  render();
  raf = Math.abs(target - current) > 0.0005 ? requestAnimationFrame(tick) : null;
}
function render() {
  const vw = window.innerWidth, vh = window.innerHeight;
  const e = ease(current);
  const desktop = vw >= 900;

  // Nome: o grande da home some aos poucos; o pequeno aparece fixo embaixo à direita
  document.getElementById('heroName').style.opacity = Math.max(0, 1 - current * 1.6).toFixed(3);
  brand.classList.toggle('is-visible', e > 0.85);

  // Menu: só o ícone, depois do scroll
  menuBtn.classList.toggle('is-visible', e > 0.85);
  topShade.style.opacity = e.toFixed(3);
  bottomShade.style.opacity = e.toFixed(3);

  // Rosto: centralizado na tela inteira -> coluna lateral direita
  if (desktop) {
    stage.style.width = `${(100 - 60 * e).toFixed(3)}vw`;
    stage.style.setProperty('--mask', `${(24 * e).toFixed(2)}%`);
    dimmer.style.opacity = (0.08 * e).toFixed(3);
  } else {
    stage.style.width = '100vw';
    dimmer.style.opacity = (0.15 + 0.65 * e).toFixed(3);
  }

  const show = window.scrollY > vh * 0.5;
  shortcut.classList.toggle('is-visible', show);
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => { render(); onScroll(); }, { passive: true });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(render);
onScroll(); render();

/* ---------- Atalho: contato durante a página, menu no rodapé ---------- */
shortcut.addEventListener('click', () => atFooter ? openFullMenu() : openPanel('contato'));
new IntersectionObserver(([en]) => {
  atFooter = en.isIntersecting;
  shortcutLabel.textContent = atFooter ? 'Descobrir menu' : 'Vamos trocar uma ideia?';
}, { threshold: 0.25 }).observe(document.getElementById('footer'));

/* ---------- Palavras rotativas ---------- */
const words = Array.from(document.querySelectorAll('#rotator > span'));
let wi = 0;
if (!reduceMotion && words.length > 1) {
  setInterval(() => {
    const out = words[wi]; wi = (wi + 1) % words.length; const inn = words[wi];
    out.classList.remove('is-active'); out.classList.add('is-leaving');
    inn.classList.remove('is-leaving'); inn.classList.add('is-active');
    setTimeout(() => out.classList.remove('is-leaving'), 700);
  }, 2800);
}

/* ---------- Mosaico de marcas ---------- */
(function buildMosaic() {
  const host = document.getElementById('brandsMosaic');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const tile = b => `<div class="brand-tile" title="${esc(b.name)}">${b.logo ? `<img src="${b.logo}" alt="${esc(b.name)}" />` : esc(b.name)}</div>`;
  [0, 4, 8].forEach((shift, row) => {
    const list = BRANDS.slice(shift).concat(BRANDS.slice(0, shift));
    const html = list.map(tile).join('');
    host.insertAdjacentHTML('beforeend',
      `<div class="marquee"><div class="marquee-track${row % 2 ? ' is-reverse' : ''}" style="--dur:${44 + row * 8}s">${html}<div class="contents" aria-hidden="true">${html}</div></div></div>`);
  });
})();

/* ---------- Menu de página inteira ---------- */
const fullMenu = document.getElementById('fullMenu');
const preview = document.getElementById('menuPreview');
const previewImgs = Array.from(preview.querySelectorAll('img'));
let lastFocus = null, openLayer = null;

function lockScroll() { document.body.style.overflow = (fullMenu.classList.contains('is-open') || openLayer) ? 'hidden' : ''; }

function openFullMenu() {
  lastFocus = document.activeElement;
  fullMenu.classList.add('is-open');
  fullMenu.setAttribute('aria-hidden', 'false');
  menuBtn.setAttribute('aria-expanded', 'true');
  lockScroll();
  setTimeout(() => fullMenu.querySelector('.menu-item').focus(), 60);
}
function closeFullMenu() {
  fullMenu.classList.remove('is-open');
  fullMenu.setAttribute('aria-hidden', 'true');
  menuBtn.setAttribute('aria-expanded', 'false');
  preview.classList.remove('is-visible');
  lockScroll();
  if (lastFocus) lastFocus.focus();
}

// Imagem que acompanha o mouse ao passar sobre cada item
let px = 0, py = 0, tx = 0, ty = 0, prevRaf = null;
function movePreview() {
  px += (tx - px) * 0.18; py += (ty - py) * 0.18;
  preview.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) scale(${preview.classList.contains('is-visible') ? 1 : .9})`;
  prevRaf = (Math.abs(tx - px) > .5 || Math.abs(ty - py) > .5) ? requestAnimationFrame(movePreview) : null;
}
function showPreview(i, x, y) {
  previewImgs.forEach(img => img.classList.toggle('is-active', img.dataset.i === String(i)));
  tx = x - 120; ty = y - 155;
  if (!preview.classList.contains('is-visible')) { px = tx; py = ty; }
  preview.classList.add('is-visible');
  if (!prevRaf) prevRaf = requestAnimationFrame(movePreview);
}

document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('mouseenter', e => showPreview(item.dataset.img, e.clientX + 160, e.clientY));
  item.addEventListener('mousemove', e => showPreview(item.dataset.img, e.clientX + 160, e.clientY));
  item.addEventListener('mouseleave', () => preview.classList.remove('is-visible'));
  item.addEventListener('focus', () => {
    const r = item.getBoundingClientRect();
    showPreview(item.dataset.img, Math.min(r.right - 260, window.innerWidth - 200), r.top + r.height / 2);
  });
  item.addEventListener('blur', () => preview.classList.remove('is-visible'));
  item.addEventListener('click', () => openPanel(item.dataset.panel));
});

/* ---------- Janelas de conteúdo ---------- */
let panelReturn = null;
function openPanel(name) {
  closePanel(true);
  const layer = document.getElementById('panel-' + name);
  if (!layer) return;
  panelReturn = document.activeElement;
  preview.classList.remove('is-visible');
  layer.classList.add('is-open');
  layer.setAttribute('aria-hidden', 'false');
  openLayer = layer; lockScroll();
  const btn = layer.querySelector('.close-btn');
  if (btn) setTimeout(() => btn.focus(), 50);
}
function closePanel(silent) {
  if (!openLayer) return;
  openLayer.classList.remove('is-open');
  openLayer.setAttribute('aria-hidden', 'true');
  openLayer = null; lockScroll();
  if (!silent && panelReturn) panelReturn.focus();
}
document.querySelectorAll('.menu-layer').forEach(layer => layer.addEventListener('click', e => { if (e.target === layer) closePanel(); }));
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (openLayer) closePanel(); else if (fullMenu.classList.contains('is-open')) closeFullMenu();
});

/* ---------- E-mail ---------- */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.remove('opacity-0');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.add('opacity-0'), 2600);
}
function copyEmail(email) {
  const done = () => showToast('E-mail copiado: ' + email);
  const fallback = () => {
    const i = document.createElement('input'); i.value = email; document.body.appendChild(i); i.select();
    try { document.execCommand('copy'); done(); } catch (e) {} i.remove();
  };
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(email).then(done).catch(fallback); else fallback();
}
  
