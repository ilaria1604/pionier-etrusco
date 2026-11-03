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
  const PHONE = matchMedia('(max-width:720px)');
  // the phone full-screen map, where the fingers move and zoom it
  const live = () => PHONE.matches && sec.classList.contains('fs');
  let cur = VIEWS.all.slice(), raf = 0, view = 'all';

  // phone view: centre (cx, cy) and zoom k in screen pixels per map unit; the viewBox keeps the screen's proportions
  let cx = 0, cy = 0, k = 1;
  const MAXK = 6, NUMBERS_K = 1.25;
  const box = () => { const r = svg.getBoundingClientRect(); return [r.width || 1, r.height || 1]; };

  const apply = vb => {
    svg.setAttribute('viewBox', vb.map(v => v.toFixed(1)).join(' '));
    let s;
    if (live()) {
      // icons keep a size a finger can find, whatever the zoom
      const d = 18 * box()[0] / vb[2];
      s = Math.min(30, Math.max(13, d)) / d;
    } else s = Math.min(1.4, Math.max(1, vb[2] / 1400));
    marks.forEach(m => m.setAttribute('transform', `translate(${m.dataset.x} ${m.dataset.y}) scale(${s.toFixed(3)})`));
  };
  const minK = () => { const [w, h] = box(); return Math.min(w / VIEWS.all[2], h / VIEWS.all[3]); };
  const render = () => {
    const A = VIEWS.all, [w, h] = box();
    k = Math.min(MAXK, Math.max(minK(), k));
    cx = Math.min(A[0] + A[2], Math.max(A[0], cx));
    cy = Math.min(A[1] + A[3], Math.max(A[1], cy));
    cur = [cx - w / k / 2, cy - h / k / 2, w / k, h / k];
    apply(cur);
    // pitch numbers show once they are big enough to read
    const nv = k >= NUMBERS_K ? 'camp' : 'all';
    if (nv !== view) { view = nv; frame.dataset.view = nv; }
  };
  const fitK = (b, pad = 28) => { const [w, h] = box(); return Math.min((w - 2 * pad) / b[2], (h - 2 * pad) / b[3]); };
  const fly = (tx, ty, tk, done) => {
    cancelAnimationFrame(raf);
    tk = Math.min(MAXK, Math.max(minK(), tk));
    if (reduced) { cx = tx; cy = ty; k = tk; render(); if (done) done(); return; }
    const x0 = cx, y0 = cy, k0 = k, t0 = performance.now(), D = 480;
    const step = now => {
      const p = Math.min(1, (now - t0) / D), e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      cx = x0 + (tx - x0) * e; cy = y0 + (ty - y0) * e; k = k0 * Math.pow(tk / k0, e);
      render();
      if (p < 1) raf = requestAnimationFrame(step); else if (done) done();
    };
    raf = requestAnimationFrame(step);
  };
  const flyBox = (b, cap = MAXK, done) => fly(b[0] + b[2] / 2, b[1] + b[3] / 2, Math.min(cap, fitK(b)), done);
  // zoom by f keeping the map point under (px, py) in place
  const zoomTarget = (px, py, f) => {
    const [w, h] = box(), nk = Math.min(MAXK, Math.max(minK(), k * f));
    const wx = cur[0] + px / k, wy = cur[1] + py / k;
    return [wx - (px - w / 2) / nk, wy - (py - h / 2) / nk, nk];
  };
  const zoomAt = (px, py, f, animate = true, done) => {
    const [tx, ty, tk] = zoomTarget(px, py, f);
    if (animate) fly(tx, ty, tk, done); else { cancelAnimationFrame(raf); cx = tx; cy = ty; k = tk; render(); }
  };
  const bboxOf = els => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    els.forEach(el => {
      const b = el.classList.contains('mk') ? { x: +el.dataset.x - 14, y: +el.dataset.y - 14, width: 28, height: 28 } : el.getBBox();
      x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height);
    });
    return [x0, y0, x1 - x0, y1 - y0];
  };

  const go = name => {
    if (live()) { flyBox(VIEWS[name]); return; }
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
  svg.querySelector('.zone-camp').addEventListener('click', () => { if (!live() && view === 'all') go('camp'); });
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
    if (!live() && view === 'all') { go('camp'); setTimeout(() => { if (curCell === cell) showTip(cell); }, reduced ? 0 : 950); }
    else showTip(cell);
  });

  // Legend: one type or one service at a time (a service selection can hold several keys, e.g. "bagni,docce")
  const typeBtns = [...sec.querySelectorAll('.lg-type')];
  const servBtns = [...sec.querySelectorAll('.lg-serv')];
  const sheet = sec.querySelector('.cmap-sheet'), sheetBtn = sec.querySelector('.cmap-sheet-h'), selLbl = sec.querySelector('.cmap-sheet-sel');
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
    // the panel's handle says what is lit on the map
    const on = sec.querySelector('.lg-type[aria-pressed="true"], .lg-serv[aria-pressed="true"]');
    selLbl.textContent = on ? on.textContent.trim() : curCell ? curCell.dataset.tip : '';
  };
  const openSheet = on => { sheet.classList.toggle('open', on); sheetBtn.setAttribute('aria-expanded', String(on)); };
  sheetBtn.addEventListener('click', () => openSheet(!sheet.classList.contains('open')));
  // phone full screen: close the panel and fly to what was chosen
  const showHits = hit => {
    openSheet(false);
    hideTip();
    if (!hit.length) return;
    flyBox(bboxOf(hit), 2.2, () => { if (hit.length === 1 && hit[0].classList.contains('mk')) showTip(hit[0]); });
  };
  // on phones the map scrolls sideways: bring the first highlighted icon into view
  const reveal = hit => {
    if (live() || !matchMedia('(max-width:760px)').matches || !hit[0]) return;
    const r = svg.getBoundingClientRect(), vb = VIEWS[view];
    const x = (+hit[0].dataset.x - vb[0]) / vb[2] * r.width;
    scroller.scrollTo({ left: Math.max(0, x - scroller.clientWidth / 2), behavior: reduced ? 'auto' : 'smooth' });
  };
  typeBtns.forEach(b => b.addEventListener('click', () => {
    selType = selType === b.dataset.type ? null : b.dataset.type;
    curCell = null;
    selServ = null;
    paint();
    if (live()) { showHits(selType ? cells.filter(c => c.dataset.type === selType) : []); return; }
    if (selType) go('camp');
  }));
  servBtns.forEach(b => b.addEventListener('click', () => {
    selServ = selServ === b.dataset.serv ? null : b.dataset.serv;
    selType = null; curCell = null;
    paint();
    const hit = marks.filter(m => servSet().has(m.dataset.serv));
    if (live()) { showHits(hit); return; }
    if (selServ) {
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
    if (PHONE.matches) { openFs(); showHits(hit); return; }
    go(hit.length && hit.every(m => +m.dataset.x > 960) ? 'camp' : 'all');
    sec.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => reveal(hit), reduced ? 0 : 700);
  });

  // a tap anywhere else (outside the icons, the legend and the highlighted pitches) brings back the whole map
  document.addEventListener('click', e => {
    if (!selType && !selServ && !curCell) return;
    if (e.target.closest('.mk, .lg-type, .lg-serv, .cmap-view, [data-map-serv], .cell, .cmap-zoom, .cmap-sheet-h, .cmap-fsbar')) return;
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
    if (live() && e.pointerType !== 'mouse') return;
    const el = e.target.closest('.mk, .cell');
    if (el) showTip(el);
  });
  svg.addEventListener('pointerout', e => {
    if (live() && e.pointerType !== 'mouse') return;
    const el = e.target.closest('.mk, .cell');
    if (el && !el.contains(e.relatedTarget)) hideTip();
  });
  scroller.addEventListener('scroll', hideTip, { passive: true });

  // Phone full screen: one finger moves the map, two fingers zoom, a double tap zooms in
  const pts = new Map();
  let g = null, moved = 0, multi = false, suppress = false, lastTap = null;
  const local = e => { const r = svg.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const gest = sec.querySelector('.cmap-gest');
  let gestTimer = 0;
  const hideGest = () => { clearTimeout(gestTimer); gest.classList.remove('show'); };
  const startGesture = () => {
    const p = [...pts.values()];
    if (p.length === 1) g = { pinch: false, x: p[0][0], y: p[0][1], cx, cy, t: performance.now() };
    else {
      const [a, b] = p, mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      g = { pinch: true, d: Math.hypot(a[0] - b[0], a[1] - b[1]) || 1, k, wx: cur[0] + mx / k, wy: cur[1] + my / k };
    }
  };
  const onMove = e => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, local(e));
    const p = [...pts.values()], [w, h] = box();
    if (g.pinch && p.length > 1) {
      const [a, b] = p, mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      k = Math.min(MAXK, Math.max(minK(), g.k * Math.hypot(a[0] - b[0], a[1] - b[1]) / g.d));
      cx = g.wx - (mx - w / 2) / k; cy = g.wy - (my - h / 2) / k;
      moved = 99;
    } else if (!g.pinch) {
      const dx = p[0][0] - g.x, dy = p[0][1] - g.y;
      moved = Math.max(moved, Math.hypot(dx, dy));
      cx = g.cx - dx / k; cy = g.cy - dy / k;
    }
    if (moved > 6) { cancelAnimationFrame(raf); raf = requestAnimationFrame(render); }
  };
  const onUp = e => {
    if (!pts.has(e.pointerId)) return;
    const end = pts.get(e.pointerId);
    pts.delete(e.pointerId);
    if (pts.size) { startGesture(); return; }
    removeEventListener('pointermove', onMove);
    removeEventListener('pointerup', onUp);
    removeEventListener('pointercancel', onUp);
    if (multi || moved > 6 || e.type === 'pointercancel') { suppress = true; return; }
    // a quick tap: two in a row zoom in on that point
    const now = performance.now();
    if (lastTap && now - lastTap.t < 320 && Math.hypot(end[0] - lastTap.x, end[1] - lastTap.y) < 30) {
      lastTap = null; suppress = true;
      zoomAt(end[0], end[1], 2);
    } else lastTap = { t: now, x: end[0], y: end[1] };
  };
  scroller.addEventListener('pointerdown', e => {
    if (!live() || (e.pointerType === 'mouse' && e.button !== 0)) return;
    if (!pts.size) { moved = 0; multi = false; suppress = false; }
    pts.set(e.pointerId, local(e));
    if (pts.size > 1) multi = true;
    cancelAnimationFrame(raf);
    hideTip(); hideGest(); openSheet(false);
    startGesture();
    if (pts.size === 1) {
      addEventListener('pointermove', onMove);
      addEventListener('pointerup', onUp);
      addEventListener('pointercancel', onUp);
    }
  });
  scroller.addEventListener('wheel', e => {
    if (!live()) return;
    e.preventDefault();
    const [x, y] = local(e);
    zoomAt(x, y, Math.exp(-e.deltaY * .0025), false);
  }, { passive: false });
  // Safari's own pinch would zoom the whole page
  sec.addEventListener('gesturestart', e => { if (live()) e.preventDefault(); });
  // Taps after a drag do nothing; a tap on something too small to aim at zooms in on it first
  frame.addEventListener('click', e => {
    if (!live() || e.target.closest('.cmap-zoom')) return;
    if (suppress) { suppress = false; e.preventDefault(); e.stopPropagation(); return; }
    const cell = e.target.closest('.cell'), mk = e.target.closest('.mk');
    if (!cell && !mk) return;
    const [px, py] = local(e);
    if (cell) {
      const r = cell.querySelector('rect,polygon').getBoundingClientRect(), side = Math.min(r.width, r.height);
      if (side >= 24) return;
      e.preventDefault(); e.stopPropagation();
      selType = null; selServ = null; curCell = cell;
      paint();
      zoomAt(px, py, Math.min(4, Math.max(1.6, 40 / side)), true, () => { if (curCell === cell) showTip(cell); });
    } else if (k < .8) {
      e.preventDefault(); e.stopPropagation();
      zoomAt(px, py, 2.5);
    }
  }, true);
  const zoomBtn = f => () => { hideGest(); const [w, h] = box(); zoomAt(w / 2, h / 2, f); };
  sec.querySelector('.cmap-zin').addEventListener('click', zoomBtn(1.8));
  sec.querySelector('.cmap-zout').addEventListener('click', zoomBtn(1 / 1.8));
  sec.querySelector('.cmap-fit').addEventListener('click', () => { hideGest(); hideTip(); flyBox(VIEWS.all, MAXK); });
  addEventListener('resize', () => { if (live()) render(); });

  // Phones: the map sits in the page as a preview; a tap opens it full screen
  let pushed = false;
  const openFs = () => {
    if (sec.classList.contains('fs')) return;
    sec.classList.add('fs');
    document.documentElement.classList.add('fs-lock');
    // the Back button closes the map instead of leaving the page
    if (!pushed) { history.pushState({ cmap: 1 }, ''); pushed = true; }
    openSheet(false);
    scroller.scrollLeft = 0;
    const b = VIEWS.camp;
    cx = b[0] + b[2] / 2; cy = b[1] + b[3] / 2; k = fitK(b, 12);
    render();
    let seen = false;
    try { seen = sessionStorage.getItem('cmap-gest') === '1'; sessionStorage.setItem('cmap-gest', '1'); } catch (err) {}
    if (!seen) { gest.classList.add('show'); gestTimer = setTimeout(hideGest, 4500); }
    sec.querySelector('.cmap-close').focus({ preventScroll: true });
  };
  const closeFs = viaBack => {
    if (!sec.classList.contains('fs')) return;
    sec.classList.remove('fs');
    document.documentElement.classList.remove('fs-lock');
    cancelAnimationFrame(raf);
    hideTip(); hideGest(); openSheet(false);
    // the page preview shows the whole map, as before
    view = 'all'; frame.dataset.view = 'all';
    viewBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === 'all')));
    cur = VIEWS.all.slice(); apply(cur);
    // the page did not move while the map was open, so it is back where the guest left it
    if (pushed) { pushed = false; if (viaBack !== true) history.back(); }
  };
  addEventListener('popstate', () => { if (sec.classList.contains('fs')) { pushed = false; closeFs(true); } });
  // in the preview, any tap opens the full map (nothing gets selected by accident)
  frame.addEventListener('click', e => {
    if (!PHONE.matches || sec.classList.contains('fs')) return;
    e.preventDefault(); e.stopPropagation();
    openFs();
  }, true);
  sec.querySelector('.cmap-open').addEventListener('click', openFs);
  sec.querySelector('.cmap-close').addEventListener('click', closeFs);
  addEventListener('keydown', e => { if (e.key === 'Escape') closeFs(); });
  PHONE.addEventListener('change', e => { if (!e.matches) closeFs(); });
  // "Vedi le tariffe" from inside the full map: close it first, then go to the prices
  sec.querySelectorAll('.cmap-prices').forEach(a => a.addEventListener('click', e => {
    if (!sec.classList.contains('fs')) return;
    e.preventDefault();
    closeFs();
    setTimeout(() => { const t = document.querySelector(a.getAttribute('href')); if (t) t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }, 120);
  }));

  // Arriving from the Piazzole page: open straight on the zoom
  if (new URLSearchParams(location.search).get('vista') === 'piazzole') {
    view = 'camp';
    frame.dataset.view = 'camp';
    viewBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === 'camp')));
    cur = VIEWS.camp.slice();
  }
  apply(cur);
})();
