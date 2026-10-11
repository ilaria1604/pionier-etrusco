/* Camping map: zoom views, legend filters, tooltips */
(() => {
  const sec = document.querySelector('.cmap-sec');
  if (!sec) return;
  const svg = sec.querySelector('.cmap');
  const frame = sec.querySelector('.cmap-frame');
  const scroller = sec.querySelector('.cmap-scroll');
  const tip = sec.querySelector('.cmap-tip');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const VIEWS = { all: [10, 262, 1960, 788], camp: [925, 515, 1030, 414] };
  const marks = [...svg.querySelectorAll('.mk')];
  const cells = [...svg.querySelectorAll('.cell')];
  const viewBtns = [...sec.querySelectorAll('.cmap-view button')];
  let cur = VIEWS.all.slice(), raf = 0, view = 'all';

  const apply = vb => {
    svg.setAttribute('viewBox', vb.map(v => v.toFixed(1)).join(' '));
    const s = Math.min(1.4, Math.max(1, vb[2] / 1400));
    marks.forEach(m => m.setAttribute('transform', `translate(${m.dataset.x} ${m.dataset.y}) scale(${s.toFixed(3)})`));
  };
  const go = name => {
    if (name === view) return;
    view = name;
    frame.dataset.view = name;
    viewBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === name)));
    hideTip();
    const to = VIEWS[name];
    cancelAnimationFrame(raf);
    if (reduced) { cur = to.slice(); apply(cur); return; }
    const from = cur.slice(), t0 = performance.now(), D = 900;
    const step = now => {
      const k = Math.min(1, (now - t0) / D);
      const e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      cur = from.map((v, i) => v + (to[i] - v) * e);
      apply(cur);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    scroller.scrollTo({ left: 0, behavior: reduced ? 'auto' : 'smooth' });
  };
  viewBtns.forEach(b => b.addEventListener('click', () => go(b.dataset.view)));
  svg.querySelector('.zone-camp').addEventListener('click', () => { if (view === 'all') go('camp'); });
  // tapping an icon on the map selects that service; tapping it again shows the whole map again
  svg.querySelector('.marks').addEventListener('click', e => {
    const mk = e.target.closest('.mk');
    if (!mk) return;
    selServ = selServ === mk.dataset.serv ? null : mk.dataset.serv;
    selType = null; curCell = null;
    paint();
    if (selServ) showTip(mk); else hideTip();
  });
  // tapping a pitch (or a bungalow, glamping, home) outlines and names it, the rest of the map stays as it is;
  // tapping the same one again removes the outline
  svg.querySelector('.cells').addEventListener('click', e => {
    const cell = e.target.closest('.cell');
    if (!cell) return;
    e.stopPropagation();
    if (cell === curCell) { curCell = null; paint(); hideTip(); return; }
    selType = null; selServ = null; curCell = cell;
    paint();
    if (view === 'all') { go('camp'); setTimeout(() => { if (curCell === cell) showTip(cell); }, reduced ? 0 : 950); }
    else showTip(cell);
  });

  // Legend: one type or one service at a time (a service selection can hold several keys, e.g. "bagni,docce")
  const typeBtns = [...sec.querySelectorAll('.lg-type')];
  const servBtns = [...sec.querySelectorAll('.lg-serv')];
  let selType = null, selServ = null, curCell = null;
  const servSet = () => new Set((selServ || '').split(',').filter(Boolean));
  const paint = () => {
    const set = servSet();
    typeBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.type === selType)));
    servBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.serv === selServ)));
    // a type or a service switches the rest off; a single pitch only gets outlined, everything else stays as it is
    const dim = !!selType || !!selServ;
    svg.classList.toggle('dim-type', dim);
    cells.forEach(c => { c.classList.toggle('on', c.dataset.type === selType); c.classList.toggle('cur', c === curCell); });
    svg.classList.toggle('dim-serv', dim);
    marks.forEach(m => m.classList.toggle('on', set.has(m.dataset.serv)));
  };
  // on phones the map scrolls sideways: bring the first highlighted icon into view
  const reveal = hit => {
    if (!matchMedia('(max-width:760px)').matches || !hit[0]) return;
    const r = svg.getBoundingClientRect(), vb = VIEWS[view];
    const x = (+hit[0].dataset.x - vb[0]) / vb[2] * r.width;
    scroller.scrollTo({ left: Math.max(0, x - scroller.clientWidth / 2), behavior: reduced ? 'auto' : 'smooth' });
  };
  typeBtns.forEach(b => b.addEventListener('click', () => {
    selType = selType === b.dataset.type ? null : b.dataset.type;
    curCell = null;
    selServ = null;
    paint();
    if (selType) go('camp');
  }));
  servBtns.forEach(b => b.addEventListener('click', () => {
    selServ = selServ === b.dataset.serv ? null : b.dataset.serv;
    selType = null; curCell = null;
    paint();
    if (selServ) {
      const hit = marks.filter(m => servSet().has(m.dataset.serv));
      const inCamp = hit.every(m => +m.dataset.x > 960);
      go(inCamp ? view : 'all');
      reveal(hit);
    }
  }));
  // links elsewhere on the page ("Vedi sulla mappa", the service list): scroll here and highlight
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-map-serv]');
    if (!a) return;
    e.preventDefault();
    selServ = a.dataset.mapServ; selType = null; curCell = null;
    paint();
    const hit = marks.filter(m => servSet().has(m.dataset.serv));
    go(hit.length && hit.every(m => +m.dataset.x > 960) ? 'camp' : 'all');
    sec.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => reveal(hit), reduced ? 0 : 700);
  });

  // a tap anywhere else (outside the icons, the legend and the highlighted pitches) brings back the whole map
  document.addEventListener('click', e => {
    if (!selType && !selServ && !curCell) return;
    if (e.target.closest('.mk, .lg-type, .lg-serv, .cmap-view, [data-map-serv], .cell')) return;
    selType = null; selServ = null; curCell = null;
    paint(); hideTip();
  });

  // Tooltip
  function hideTip() { tip.classList.remove('show'); }
  const showTip = (el) => {
    const label = el.dataset.tip;
    if (!label) return;
    tip.textContent = label;
    const fr = frame.getBoundingClientRect();
    const r = (el.querySelector('.dot') || el.querySelector('rect,polygon')).getBoundingClientRect();
    let x = r.left + r.width / 2 - fr.left;
    const half = tip.offsetWidth / 2 + 8;
    x = Math.max(half, Math.min(fr.width - half, x));
    tip.style.left = x + 'px';
    tip.style.top = Math.max(tip.offsetHeight + 16, r.top - fr.top) + 'px';
    tip.classList.add('show');
  };
  svg.addEventListener('pointerover', e => {
    const el = e.target.closest('.mk, .cell');
    if (el) showTip(el);
  });
  svg.addEventListener('pointerout', e => {
    const el = e.target.closest('.mk, .cell');
    if (el && !el.contains(e.relatedTarget)) hideTip();
  });
  scroller.addEventListener('scroll', hideTip, { passive: true });

  // Arriving from the Piazzole page: open straight on the zoom
  if (new URLSearchParams(location.search).get('vista') === 'piazzole') {
    view = 'camp';
    frame.dataset.view = 'camp';
    viewBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === 'camp')));
    cur = VIEWS.camp.slice();
  }
  apply(cur);
})();
