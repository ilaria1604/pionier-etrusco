/* Camping Pionier Etrusco · shared script (home page and detail pages) */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smoothstep = (p, e0, e1) => { const t = clamp((p - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
const RMQ = matchMedia('(prefers-reduced-motion: reduce)');
let reduced = RMQ.matches;
function rng(seed) { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

/* ---------- seeded splitting ---------- */
$$('.split').forEach((el, n) => {
  const text = el.textContent.trim().replace(/\s+/g, ' ');
  // words written inside <em> stay accent words (italic, terracotta) once split
  const accent = new Set([...el.querySelectorAll('em')].flatMap(e => e.textContent.trim().split(/\s+/)));
  const fx = el.dataset.fx;
  const band = el.closest('.band');
  const spread = band && band.dataset.spread ? +band.dataset.spread : 0.45;
  const r = rng(1953 + n * 97);
  el.textContent = '';
  const sr = document.createElement('span'); sr.className = 'sr'; sr.textContent = text;
  const vis = document.createElement('span'); vis.className = 'vis'; vis.setAttribute('aria-hidden', 'true');
  const words = text.split(' ');
  words.forEach((word, wi) => {
    const w = document.createElement('span'); w.className = accent.has(word) ? 'w k' : 'w';
    if (fx === 'drift' || fx === 'rise') w.style.setProperty('--th', (wi / Math.max(1, words.length) * 0.5).toFixed(3));
    [...word].forEach(ch => {
      const c = document.createElement('span'); c.className = 'c'; c.textContent = ch;
      if (fx === 'scatter') {
        c.style.setProperty('--th', (r() * spread).toFixed(3));
        c.style.setProperty('--jx', ((r() - .5) * 90).toFixed(1) + 'px');
        c.style.setProperty('--jy', ((r() - .5) * 70).toFixed(1) + 'px');
        c.style.setProperty('--jr', ((r() - .5) * 40).toFixed(1) + 'deg');
      }
      w.appendChild(c);
    });
    vis.appendChild(w);
    if (wi < words.length - 1) vis.appendChild(document.createTextNode(' '));
  });
  el.append(sr, vis);
});

/* ---------- the hero scrub (home page) ---------- */
const hero = $('#top.hero');
let applyHeroMode = () => {};
if (hero) {
  const stage = $('.stage', hero), video = $('#hero'), ring = $('.ring', hero);
  const posterLayer = $('.poster', hero), posterEnd = $('.poster-end', hero);
  const VIDEO_URL = '../assets/hero-scrub.mp4';
  const VIDEO_BYTES = 7047092;
  const POSTER = '../assets/hero-poster.jpg', ENDING = '../assets/hero-ending.jpg';
  const bands = $$('.band', hero).map(el => ({
    el, a: +el.dataset.a, b: +el.dataset.b, ramp: +el.dataset.ramp || 0,
    first: el.classList.contains('b1'), last: el.classList.contains('b4'), op: -1, k: -1, live: null
  }));
  let target = 0, shown = 0, rafId = null, lastTick = 0, heroOnScreen = true;
  let loadK = 0, failed = false, endOp = -1, scrubOn = false;
  const endCue = $('.end-cue', hero);

  const heroProgress = () => {
    const r = hero.getBoundingClientRect();
    const range = hero.offsetHeight - innerHeight;
    return range > 0 ? clamp(-r.top / range, 0, 1) : 0;
  };
  const updateCaptions = p => {
    for (const b of bands) {
      const f = Math.min(0.035, (b.b - b.a) / 3);
      const op = (b.first ? 1 : smoothstep(p, b.a, b.a + f)) * (b.last ? 1 : 1 - smoothstep(p, b.b - f, b.b));
      let k = clamp((p - b.a) / (b.ramp || Math.min(0.05, (b.b - b.a) * 0.35)), 0, 1);
      if (b.first) k = Math.max(k, loadK);
      if (Math.abs(op - b.op) > 0.004 || (op !== b.op && (op === 0 || op === 1))) { b.op = op; b.el.style.opacity = op.toFixed(3); }
      if (Math.abs(k - b.k) > 0.008 || (k !== b.k && (k === 0 || k === 1))) { b.k = k; b.el.style.setProperty('--k', k.toFixed(3)); }
      const live = op > 0.5;
      if (live !== b.live) { b.live = live; b.el.classList.toggle('live', live); }
    }
    if (failed) {
      const e = smoothstep(p, 0.55, 0.9);
      if (Math.abs(e - endOp) > 0.004 || (e !== endOp && (e === 0 || e === 1))) { endOp = e; posterEnd.style.opacity = e.toFixed(3); }
    }
  };

  let seekBusy = false, pendingTime = null;
  const requestSeek = t => {
    if (!video.duration || failed) return;
    if (seekBusy) { pendingTime = t; return; }
    seekBusy = true;
    video.currentTime = t;
  };
  video.addEventListener('seeked', () => {
    seekBusy = false;
    if (pendingTime !== null) { const t = pendingTime; pendingTime = null; requestSeek(t); }
  });
  video.addEventListener('error', () => { seekBusy = false; pendingTime = null; if (video.getAttribute('src')) failVideo(); });

  const tick = now => {
    const dt = Math.min(100, now - (lastTick || now));
    lastTick = now;
    const k = 0.16;
    shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));
    if (Math.abs(target - shown) < 0.0005) { shown = target; rafId = null; lastTick = 0; }
    else rafId = requestAnimationFrame(tick);
    requestSeek(shown * (video.duration || 0) * 0.999);
    updateCaptions(shown);
  };
  const onScroll = () => {
    target = heroProgress();
    if (rafId === null && heroOnScreen) rafId = requestAnimationFrame(tick);
  };

  let heroInit = false;
  const initHeroOnce = () => {
    if (heroInit) return; heroInit = true;
    posterLayer.style.backgroundImage = "url('" + POSTER + "')";
    let started = false;
    const startBlobFetch = () => { if (started) return; started = true; loadHeroBlob().catch(failVideo); };
    const img = new Image();
    img.onload = startBlobFetch; img.onerror = startBlobFetch; img.src = POSTER;
    setTimeout(startBlobFetch, 4000);
    const t0 = performance.now();
    const ramp = now => {
      const t = clamp((now - t0 - 250) / 1400, 0, 1);
      loadK = 1 - Math.pow(1 - t, 3);
      if (scrubOn) updateCaptions(shown);
      if (t < 1) requestAnimationFrame(ramp);
    };
    requestAnimationFrame(ramp);
  };

  async function loadHeroBlob() {
    const ctrl = new AbortController();
    let watchdog = setTimeout(() => ctrl.abort(), 20000);
    const res = await fetch(VIDEO_URL, { priority: 'low', signal: ctrl.signal });
    if (!res.ok) throw new Error('video ' + res.status);
    const total = Number(res.headers.get('Content-Length')) || VIDEO_BYTES;
    const reader = res.body.getReader();
    const chunks = [];
    let got = 0, lastRing = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      clearTimeout(watchdog);
      watchdog = setTimeout(() => ctrl.abort(), 20000);
      chunks.push(value);
      got += value.length;
      const frac = Math.min(1, got / total);
      const now = performance.now();
      if (now - lastRing > 100 || frac === 1) { lastRing = now; ring.style.setProperty('--ld', Math.round(126 * (1 - frac))); }
    }
    clearTimeout(watchdog);
    ring.style.setProperty('--ld', 0);
    video.src = URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }));
    video.load();
    video.addEventListener('canplay', () => {
      requestSeek(heroProgress() * video.duration * 0.999);
      stage.classList.add('video-ready');
    }, { once: true });
  }

  function failVideo() {
    if (failed) return;
    failed = true;
    stage.classList.add('video-failed');
    video.removeAttribute('src');
    posterEnd.style.backgroundImage = "url('" + ENDING + "')";
    endOp = -1;
    updateCaptions(heroProgress());
  }

  // the arrow moves the story on: next phrase while the video plays, next section from the last scene
  if (endCue) endCue.addEventListener('click', e => {
    if (!scrubOn) return;
    const p = heroProgress();
    const next = bands.slice(1).map(b => Math.min(1, b.a + (b.ramp || 0.05) + 0.01)).find(s => s > p + 0.02);
    if (next === undefined) return;
    e.preventDefault();
    const range = hero.offsetHeight - innerHeight;
    scrollTo({ top: hero.offsetTop + next * range, behavior: reduced ? 'auto' : 'smooth' });
  });
  // nobody scrolled in the usability test: after a few idle seconds at the top, show "Scorri o tocca qui"
  if (endCue) {
    const nudge = setTimeout(() => { if (scrollY < 40) endCue.classList.add('nudge'); }, 4500);
    const calm = () => { if (scrollY > 40) { clearTimeout(nudge); endCue.classList.remove('nudge'); removeEventListener('scroll', calm); } };
    addEventListener('scroll', calm, { passive: true });
  }

  new IntersectionObserver(es => { heroOnScreen = es[0].isIntersecting; if (heroOnScreen && scrubOn) onScroll(); }).observe(hero);

  const GATES = [
    '(max-width: 720px)',
    '(orientation: portrait) and (max-width: 1024px)',
    '(orientation: portrait) and (pointer: coarse)',
    '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
    '(prefers-reduced-motion: reduce)'
  ];
  const enableScrub = () => {
    if (scrubOn) return; scrubOn = true;
    initHeroOnce();
    addEventListener('scroll', onScroll, { passive: true });
    bands.forEach(b => { b.op = -1; b.k = -1; b.live = null; });
    endOp = -1;
    shown = target = heroProgress();
    updateCaptions(shown);
    onScroll();
  };
  const disableScrub = () => {
    if (!scrubOn) return; scrubOn = false;
    removeEventListener('scroll', onScroll);
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; lastTick = 0; }
  };
  applyHeroMode = () => { if (GATES.some(q => matchMedia(q).matches)) disableScrub(); else enableScrub(); };
  const MQLS = GATES.map(q => matchMedia(q));
  MQLS.forEach(m => m.addEventListener('change', applyHeroMode));
}

/* ---------- nav ---------- */
const nav = $('#nav');
let navSolid = null, overHero = !!hero;
const setNav = solid => { if (solid !== navSolid) { navSolid = solid; nav.classList.toggle('solid', solid); } };
const darkTop = $('[data-nav-over]');
if (darkTop) new IntersectionObserver(es => { overHero = es[0].isIntersecting; setNav(!overHero || menuOpen); }, { rootMargin: '-64px 0px 0px 0px' }).observe(darkTop);
else setNav(true);
const menuBtn = $('.menu-btn'), menu = $('#menu');
let menuOpen = false;
menuBtn.addEventListener('click', () => {
  menuOpen = menuBtn.getAttribute('aria-expanded') !== 'true';
  menuBtn.setAttribute('aria-expanded', String(menuOpen));
  menu.classList.toggle('open', menuOpen);
  setNav(menuOpen || !darkTop || !overHero);
});
$$('#menu a').forEach(a => a.addEventListener('click', () => { menuOpen = false; menuBtn.setAttribute('aria-expanded', 'false'); menu.classList.remove('open'); setNav(!darkTop || !overHero); }));
$$('.has-sub').forEach(li => {
  const b = $('.sub-btn', li);
  b.addEventListener('click', () => { const o = !li.classList.contains('open'); li.classList.toggle('open', o); b.setAttribute('aria-expanded', String(o)); });
  li.addEventListener('focusout', e => { if (!li.contains(e.relatedTarget)) { li.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); } });
  li.addEventListener('keydown', e => { if (e.key === 'Escape') { li.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); b.focus(); } });
});

/* ---------- the Etruscan wave: the running-dog frieze, drawn at the real width ---------- */
// one unit: up to the crest, along it, hook back, down, foot; then the long diagonal to the next crest
const DOG = [[.42, .12], [.84, .38], [.58, .53], [.50, .81], [.82, .90]];
const waves = $$('path[data-wave]');
const drawWaves = () => waves.forEach(p => {
  const svg = p.ownerSVGElement, [u, h] = p.dataset.wave.split(',').map(Number);
  const W = Math.round(svg.getBoundingClientRect().width) || 1;
  const sw = parseFloat(getComputedStyle(p).strokeWidth) || 4, pad = sw / 2 + 1, Y = f => (pad + f * (h - 2 * pad)).toFixed(1);
  let d = 'M' + (-.18 * u).toFixed(1) + ' ' + Y(.9);
  for (let x = 0; x < W + u; x += u) for (const [a, b] of DOG) d += ' L' + (x + a * u).toFixed(1) + ' ' + Y(b);
  svg.setAttribute('viewBox', `0 0 ${W} ${h}`);
  svg.style.height = h + 'px';
  p.setAttribute('d', d);
});
if (waves.length) { drawWaves(); let wt; addEventListener('resize', () => { clearTimeout(wt); wt = setTimeout(drawWaves, 150); }); }

/* ---------- scroll-drawn lines, logo ink ---------- */
const draws = $$('[data-draw]').map(el => ({ el, d: -1, on: false }));
let drawQueued = false;
function updateDraws() {
  drawQueued = false;
  const vh = innerHeight;
  for (const it of draws) {
    if (!it.on && it.d !== -1) continue;
    let d;
    if (reduced) d = 1;
    else {
      const r = it.el.getBoundingClientRect();
      d = clamp((vh * 0.92 - r.top) / (vh * 0.55 + r.height * 0.35), 0, 1);
    }
    if (Math.abs(d - it.d) > 0.004 || (d !== it.d && (d === 0 || d === 1))) { it.d = d; it.el.style.setProperty('--d', d.toFixed(3)); }
  }
}
const queueDraws = () => { if (!drawQueued) { drawQueued = true; requestAnimationFrame(updateDraws); } };
const drawIO = new IntersectionObserver(es => {
  es.forEach(e => { const it = draws.find(x => x.el === e.target); if (it) it.on = e.isIntersecting; });
  queueDraws();
});
draws.forEach(it => drawIO.observe(it.el));
addEventListener('scroll', queueDraws, { passive: true });
addEventListener('resize', queueDraws, { passive: true });

/* ---------- entrances ---------- */
const revealIO = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target; el.classList.add('in'); revealIO.unobserve(el);
  const n = $$('.rv', el).length;
  setTimeout(() => el.classList.add('done'), 1100 + n * 90);
}), { rootMargin: '0px 0px -12% 0px' });
$$('[data-reveal]').forEach(el => revealIO.observe(el));

/* living elements only run on screen */
const liveIO = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('inview', e.isIntersecting)));
$$('.famiglia,.mare,.dintorni,.voci,.richiesta').forEach(el => liveIO.observe(el));
document.addEventListener('visibilitychange', () => document.body.classList.toggle('paused', document.hidden));

/* motes */
$$('.motes').forEach((m, j) => {
  const r = rng(77 + j);
  for (let i = 0; i < 16; i++) {
    const s = document.createElement('i');
    s.style.left = (r() * 100).toFixed(1) + '%';
    s.style.top = (40 + r() * 60).toFixed(1) + '%';
    s.style.animationDuration = (11 + r() * 9).toFixed(1) + 's';
    s.style.animationDelay = (-r() * 18).toFixed(1) + 's';
    m.appendChild(s);
  }
});

/* marquee: duplicate items until each half is wider than the widest screens */
const mq = $('.marquee');
if (mq) {
  const base = [...mq.children];
  let guard = 0;
  while (mq.scrollWidth < 2600 && guard++ < 6) base.forEach(n => { const c = n.cloneNode(true); c.classList.add('dup'); mq.appendChild(c); });
  [...mq.children].forEach(n => { const c = n.cloneNode(true); c.classList.add('dup'); mq.appendChild(c); });
}

/* ---------- tabs (tariffe) ---------- */
$$('[role=tablist]').forEach(list => {
  const tabs = $$('[role=tab]', list);
  const select = (t, focus) => {
    tabs.forEach(x => {
      const on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      const p = document.getElementById(x.getAttribute('aria-controls'));
      if (on) { p.hidden = false; p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter'); }
      else p.hidden = true;
    });
    if (focus) t.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); select(tabs[j], true); }
    });
  });
});

/* ---------- the walk to the sea (one click, or dragging the dot: a quick 3-minute walk) ---------- */
const mare = $('#mare'), hold = $('#hold');
let pinWalk = () => {};
if (mare && hold) {
  const route = $('#route'), walker = $('#walker'), clock = $('#clock'), live = $('#arrive-live');
  const walkSvg = $('.walk-svg'), hit = $('#walker-hit');
  const DURATION = 1400;
  const easeInOut = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  let hp = 0, hp0 = 0, walkRaf = null, t0 = 0, arrived = false, lastClock = '';
  const routeLen = route.getTotalLength();
  const more = $('#mare-more');
  if (more) {
    // Collapse without the open/close transition, so the page does not shift after load
    more.style.transition = 'none';
    mare.classList.add('collapsible');
    more.setAttribute('aria-hidden', 'true');
    void more.offsetHeight;
    more.style.transition = '';
  }
  const renderWalk = () => {
    walkSvg.style.setProperty('--hp', hp.toFixed(4));
    hold.style.setProperty('--hp', hp.toFixed(4));
    const pt = route.getPointAtLength(routeLen * hp);
    walker.setAttribute('cx', pt.x.toFixed(1)); walker.setAttribute('cy', pt.y.toFixed(1));
    hit.setAttribute('cx', pt.x.toFixed(1)); hit.setAttribute('cy', pt.y.toFixed(1));
    walkSvg.classList.toggle('at-start', hp === 0);
    const secs = Math.round(hp * 180);
    const txt = Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0');
    if (txt !== lastClock) { lastClock = txt; clock.textContent = txt; }
  };
  const arrive = () => {
    arrived = true;
    mare.classList.add('arrived', 'open');
    if (more) more.removeAttribute('aria-hidden');
    setTimeout(() => mare.classList.add('settled'), 1600);
    hold.textContent = 'Walk it again';
    live.textContent = 'You reached the beach in 3 minutes on foot.';
  };
  const walkStep = now => {
    const t = Math.min(1, (now - t0) / DURATION);
    hp = hp0 + (1 - hp0) * easeInOut(t);
    renderWalk();
    if (t < 1) walkRaf = requestAnimationFrame(walkStep);
    else { walkRaf = null; arrive(); }
  };
  const resetWalk = () => {
    arrived = false; hp = 0; renderWalk();
    mare.classList.remove('arrived', 'settled');
    live.textContent = '';
  };
  const go = () => {
    if (walkRaf !== null) return;
    if (arrived) resetWalk();
    hold.textContent = 'On the way...';
    if (reduced) { hp = 1; renderWalk(); arrive(); return; }
    hp0 = hp; t0 = performance.now();
    walkRaf = requestAnimationFrame(walkStep);
  };
  hold.addEventListener('click', go);
  // Dragging the dot. On phones the drawing slides while the dot moves, so where the dot runs on screen is worked out on grabbing it.
  const STEPS = 120;
  const screenPath = () => {
    const leftAt = h => { walkSvg.style.setProperty('--hp', h); return walkSvg.getBoundingClientRect().left; };
    const a = leftAt(0), b = leftAt(1), scale = walkSvg.getBoundingClientRect().width / walkSvg.viewBox.baseVal.width;
    walkSvg.style.setProperty('--hp', hp.toFixed(4));
    return Array.from({ length: STEPS + 1 }, (_, i) => a + (b - a) * i / STEPS + route.getPointAtLength(routeLen * i / STEPS).x * scale);
  };
  const hpAt = (path, x) => {
    if (x <= path[0]) return 0;
    const i = path.findIndex(p => p >= x);
    return i < 0 ? 1 : (i - 1 + (x - path[i - 1]) / (path[i] - path[i - 1])) / STEPS;
  };
  let drag = null;
  const endDrag = () => { drag = null; mare.classList.remove('dragging'); };
  hit.addEventListener('pointerdown', e => {
    if (arrived || walkRaf !== null || e.button) return;
    e.preventDefault();
    const path = screenPath();
    drag = { path, grab: e.clientX - path[Math.round(hp * STEPS)] };
    hit.setPointerCapture(e.pointerId);
    mare.classList.add('dragging');
  });
  hit.addEventListener('pointermove', e => {
    if (!drag) return;
    hp = hpAt(drag.path, e.clientX - drag.grab);
    if (hp < .985) { renderWalk(); return; }
    hp = 1; endDrag(); renderWalk(); arrive();
  });
  hit.addEventListener('pointerup', endDrag);
  hit.addEventListener('pointercancel', endDrag);
  pinWalk = () => { if (!arrived) { if (walkRaf !== null) { cancelAnimationFrame(walkRaf); walkRaf = null; } hp = 1; renderWalk(); arrive(); } };
}

/* ---------- map and places: hover previews, a click picks the place on both sides ---------- */
const pts = $$('.map .pt'), placeLis = $$('.places li');
let pinnedPlace = null;
const paintPlaces = hover => {
  const cur = hover || pinnedPlace;
  pts.forEach(p => p.classList.toggle('on', p.dataset.place === cur));
  placeLis.forEach(li => { li.classList.toggle('on', li.dataset.place === cur); li.classList.toggle('sel', li.dataset.place === pinnedPlace); });
};
// bring the chosen card into view: sideways in the phone carousel, and on screen if the list is out of sight
const showPlace = place => {
  const li = placeLis.find(l => l.dataset.place === place);
  if (!li) return;
  const track = li.parentElement;
  if (track.scrollWidth > track.clientWidth + 8) track.scrollTo({ left: li.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft || 0), behavior: reduced ? 'auto' : 'smooth' });
  const r = li.getBoundingClientRect();
  if (r.top < 80 || r.bottom > innerHeight - 90) li.scrollIntoView({ block: 'center', inline: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
};
const pickPlace = place => { pinnedPlace = pinnedPlace === place ? null : place; paintPlaces(); if (pinnedPlace) showPlace(pinnedPlace); };
pts.forEach(p => {
  // a bigger invisible target, so the small circles are easy to hit with a finger
  const dot = $('circle', p);
  if (dot) { const hit = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); hit.setAttribute('class', 'hit'); hit.setAttribute('cx', dot.getAttribute('cx')); hit.setAttribute('cy', dot.getAttribute('cy')); hit.setAttribute('r', 24); p.prepend(hit); }
  const name = ($('text', p) || {}).textContent || p.dataset.place;
  p.setAttribute('tabindex', '0'); p.setAttribute('role', 'button'); p.setAttribute('aria-label', name + ': see it in the list');
  p.addEventListener('click', e => { e.stopPropagation(); pickPlace(p.dataset.place); });
  p.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickPlace(p.dataset.place); } });
  p.addEventListener('mouseenter', () => paintPlaces(p.dataset.place)); p.addEventListener('mouseleave', () => paintPlaces());
});
placeLis.forEach(li => {
  li.addEventListener('mouseenter', () => paintPlaces(li.dataset.place)); li.addEventListener('mouseleave', () => paintPlaces());
  li.addEventListener('focus', () => paintPlaces(li.dataset.place)); li.addEventListener('blur', () => paintPlaces());
  li.addEventListener('click', e => { e.stopPropagation(); pinnedPlace = pinnedPlace === li.dataset.place ? null : li.dataset.place; paintPlaces(); });
  li.addEventListener('keydown', e => { if (e.key === 'Enter') li.click(); });
});
// a click anywhere else lets go of the chosen place
document.addEventListener('click', e => { if (pinnedPlace && !e.target.closest('.map .pt, .places li, .swipe-btn')) { pinnedPlace = null; paintPlaces(); } });

/* ---------- FAQ ---------- */
$$('.q button').forEach(b => b.addEventListener('click', () => {
  const open = b.getAttribute('aria-expanded') !== 'true';
  b.setAttribute('aria-expanded', String(open));
  b.closest('.q').classList.toggle('open', open);
}));

/* ---------- lightbox: galleries, type cards, story, services and beaches open their photos here ---------- */
const lb = $('#lightbox');
if (lb && lb.showModal) {
  const big = $('img', lb), cap = $('.lb-cap', lb), count = $('.lb-count', lb);
  let items = [], cur = 0;
  const show = i => {
    cur = (i + items.length) % items.length;
    big.src = items[cur].src; big.alt = items[cur].alt || '';
    if (cap) cap.textContent = items[cur].alt || '';
    if (count) count.textContent = items.length > 1 ? `${cur + 1} of ${items.length}` : '';
    lb.classList.toggle('single', items.length < 2);
  };
  const openPhotos = (list, i = 0) => { items = list; show(i); if (!lb.open) lb.showModal(); };
  // detail page galleries: each gallery browses its own photos
  $$('.gallery').forEach(g => {
    const btns = $$('button', g);
    const list = btns.map(b => { const img = $('img', b); return { src: img.dataset.full || img.src, alt: img.alt }; });
    btns.forEach((b, i) => b.addEventListener('click', () => openPhotos(list, i)));
  });
  // photo rows in the story: each row browses its own photos
  ['.today img', '.album.archive img'].forEach(sel => {
    const imgs = $$(sel), list = imgs.map(im => ({ src: im.currentSrc || im.src, alt: im.alt }));
    imgs.forEach((im, i) => {
      im.tabIndex = 0; im.setAttribute('role', 'button');
      im.addEventListener('click', () => openPhotos(list, i));
      im.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPhotos(list, i); } });
    });
  });
  // anything carrying data-photos='[["src","alt"], ...]'
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-photos]');
    if (!t) return;
    e.preventDefault();
    openPhotos(JSON.parse(t.dataset.photos).map(([src, alt]) => ({ src, alt })), +(t.dataset.start || 0));
  });
  $('.close', lb).addEventListener('click', () => lb.close());
  $('.prev', lb).addEventListener('click', () => show(cur - 1));
  $('.next', lb).addEventListener('click', () => show(cur + 1));
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  // swipe on touch screens
  let sx = null;
  lb.addEventListener('pointerdown', e => { sx = e.clientX; });
  lb.addEventListener('pointerup', e => { if (sx === null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 50 && items.length > 1) show(cur + (dx < 0 ? 1 : -1)); });
}

/* ---------- in-page links: photos loading above the target can shift the page mid-scroll, so re-align once it settles ---------- */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || e.defaultPrevented || a.getAttribute('href').length < 2) return;
  const t = document.getElementById(a.getAttribute('href').slice(1));
  if (!t) return;
  const fix = () => { const want = parseFloat(getComputedStyle(t).scrollMarginTop) || 0; if (Math.abs(t.getBoundingClientRect().top - want) > 24) t.scrollIntoView({ block: 'start', behavior: 'instant' }); };
  if ('onscrollend' in window) addEventListener('scrollend', fix, { once: true }); else setTimeout(fix, 1200);
});

/* ---------- phones: shortcut chips under the header follow the section being read ---------- */
const quick = $('.quick');
if (quick) {
  const links = $$('a', quick), secs = links.map(l => document.getElementById(l.getAttribute('href').slice(1))).filter(Boolean);
  const seen = new Map();
  const mark = () => {
    let best = null, bestTop = -Infinity;
    seen.forEach((top, el) => { if (top > bestTop) { best = el; bestTop = top; } });
    links.forEach(l => {
      const on = best && l.getAttribute('href') === '#' + best.id;
      l.classList.toggle('on', !!on);
      if (on) l.setAttribute('aria-current', 'location'); else l.removeAttribute('aria-current');
      if (on && quick.offsetParent) { const ul = $('ul', quick); ul.scrollTo({ left: l.offsetLeft - 16, behavior: reduced ? 'auto' : 'smooth' }); }
    });
  };
  // a section counts as "current" once its top has passed under the bars
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) seen.set(e.target, e.target.offsetTop); else seen.delete(e.target); });
    mark();
  }, { rootMargin: '-120px 0px -55% 0px' });
  secs.forEach(s => io.observe(s));
}

/* ---------- price lists that stay open on wide screens and fold on phones ---------- */
$$('details[data-open-wide]').forEach(d => {
  const mq = matchMedia('(min-width:721px)');
  const sync = () => { if (mq.matches) d.open = true; };
  sync(); mq.addEventListener('change', sync);
});

/* ---------- phones: "Leggi tutta la storia" ---------- */
$$('.more-btn').forEach(b => {
  const box = document.getElementById(b.getAttribute('aria-controls'));
  b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(open));
    box.classList.toggle('open', open);
    b.textContent = open ? 'Show less' : 'Read the whole story';
  });
});

/* ---------- phones: side arrows on every row of cards that scrolls sideways ---------- */
// The arrows sit on the middle of the photos; the left one hides at the start, the right one at the end.
$$('.units, .spiagge ul, .album.archive, .choose:not(.single), .places, .reels').forEach(track => {
  const wrap = document.createElement('div');
  wrap.className = 'swipe';
  // reveal classes move to the wrapper so the arrows fade in together with the cards
  ['rv', 'rv2'].forEach(c => { if (track.classList.contains(c)) { track.classList.remove(c); wrap.classList.add(c); } });
  if (track.style.getPropertyValue('--i')) { wrap.style.setProperty('--i', track.style.getPropertyValue('--i')); }
  track.before(wrap); wrap.append(track);
  const mk = (dir, label, d) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'swipe-btn ' + dir; b.setAttribute('aria-label', label);
    b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
    wrap.append(b); return b;
  };
  const prev = mk('prev', 'Previous card', 'M15 6l-6 6 6 6'), next = mk('next', 'Next card', 'M9 6l6 6-6 6');
  const step = () => { const c = track.firstElementChild; return c ? c.getBoundingClientRect().width + 12 : track.clientWidth * .8; };
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reduced ? 'auto' : 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reduced ? 'auto' : 'smooth' }));
  const place = () => {
    const c = track.firstElementChild;
    const media = c && c.querySelector('img, video, .ph');
    const y = media && media.offsetHeight > 40 ? media.getBoundingClientRect().top - track.getBoundingClientRect().top + media.offsetHeight / 2 : track.offsetHeight / 2;
    // rows of text-only cards: the arrows go under the cards, so they never cover the words
    wrap.classList.toggle('text-only', !(media && media.offsetHeight > 40));
    wrap.style.setProperty('--arrow-y', Math.round(y) + 'px');
  };
  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    wrap.classList.toggle('scrollable', max > 8);
    prev.classList.toggle('off', track.scrollLeft < 8);
    next.classList.toggle('off', track.scrollLeft > max - 8);
  };
  track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  addEventListener('resize', () => { place(); update(); });
  addEventListener('load', () => { place(); update(); });
  track.querySelectorAll('img').forEach(i => i.addEventListener('load', place, { once: true }));
  place(); update();
});

/* ---------- keyboard for photo areas that act as buttons ---------- */
document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-photos][role="button"]')) { e.preventDefault(); e.target.click(); }
});

/* ---------- photo strips in the type cards (detail pages) ---------- */
$$('.tc-media').forEach(m => {
  const strip = $('.tc-strip', m), slides = $$('img', strip), count = $('.tc-count', m);
  if (!strip || slides.length < 2) return;
  const at = () => Math.round(strip.scrollLeft / strip.clientWidth);
  const upd = () => { if (count) count.textContent = `${at() + 1} of ${slides.length}`; };
  const go = d => { const i = (at() + d + slides.length) % slides.length; strip.scrollTo({ left: i * strip.clientWidth, behavior: reduced ? 'auto' : 'smooth' }); };
  $('.tc-prev', m).addEventListener('click', () => go(-1));
  $('.tc-next', m).addEventListener('click', () => go(1));
  strip.addEventListener('scroll', () => requestAnimationFrame(upd), { passive: true });
  // a tap on the photo opens it large, at the photo being shown
  strip.addEventListener('click', () => { strip.dataset.start = at(); });
  upd();
});

/* ---------- action bar on the detail pages: shows once the header CTAs are out of view ---------- */
const actbar = $('.actbar');
if (actbar) {
  const hideOn = $$(actbar.dataset.hide || '.page-hero, .cta-band, .foot');
  const seen = new Set();
  const io = new IntersectionObserver(es => {
    es.forEach(e => e.isIntersecting ? seen.add(e.target) : seen.delete(e.target));
    actbar.classList.toggle('show', seen.size === 0);
  }, { threshold: 0 });
  hideOn.forEach(el => io.observe(el));
}

/* ---------- reels: silent vertical clips, loaded near the viewport, playing only while visible ---------- */
const reels = $$('.reel video');
if (reels.length) {
  const load = v => { if (!v.poster && v.dataset.poster) v.poster = v.dataset.poster; if (!v.src && v.dataset.src) { v.src = v.dataset.src; v.load(); } };
  const nearIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { load(e.target); nearIO.unobserve(e.target); } }), { rootMargin: '400px 400px' });
  const playIO = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting && e.intersectionRatio >= .55 && !reduced && !v.closest('.reel').classList.contains('paused-by-user')) { load(v); v.play().catch(() => {}); }
    else v.pause();
  }), { threshold: [0, .55, 1] });
  reels.forEach(v => {
    v.muted = true;
    nearIO.observe(v); playIO.observe(v);
    const card = v.closest('.reel'), bar = $('.reel-bar i', card);
    let lastW = -1;
    v.addEventListener('timeupdate', () => { if (!v.duration) return; const w = Math.round(v.currentTime / v.duration * 1000) / 1000; if (w !== lastW) { lastW = w; bar.style.transform = 'scaleX(' + w + ')'; } });
    card.addEventListener('click', () => {
      load(v);
      if (v.paused) { card.classList.remove('paused-by-user'); v.play().catch(() => {}); }
      else { card.classList.add('paused-by-user'); v.pause(); }
    });
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); } });
    v.addEventListener('play', () => card.classList.add('playing'));
    v.addEventListener('pause', () => card.classList.remove('playing'));
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) reels.forEach(v => v.pause()); });
  $$('.reels-nav').forEach(nav => {
    const track = document.getElementById(nav.dataset.track);
    const step = () => { const r = $('.reel', track); return r ? r.getBoundingClientRect().width + 16 : 280; };
    $('.prev', nav).addEventListener('click', () => track.scrollBy({ left: -step() * 2, behavior: reduced ? 'auto' : 'smooth' }));
    $('.next', nav).addEventListener('click', () => track.scrollBy({ left: step() * 2, behavior: reduced ? 'auto' : 'smooth' }));
  });
}

/* ---------- form: sends the request to the campsite ---------- */
const form = $('#form');
if (form) {
  // Google Apps Script web app, see tools/modulo-richieste.gs. While empty, the request opens the visitor's email app.
  const FORM_URL = 'https://script.google.com/macros/s/AKfycbzNbCRQB6PlQ7caKu_94jFph8XQu2yy95aFkwDfoAan8bd9LNE-VO5Ehp8ZXJOeTxEN/exec';
  const opened = Date.now();
  const err = $('#form-err');
  const sist = $('#f-sist');
  const today = new Date().toISOString().slice(0, 10);
  $('#f-arrivo').min = today; $('#f-partenza').min = today;
  // the price calculator (and links from the detail pages) can fill in the request
  const put = (el, v) => { if (el && v !== undefined && v !== null && v !== '') el.value = v; };
  // the camping cot can only be added to the monolocale
  const COT = 'Bungalow monolocale 20 mq', cotBox = $('.f-cot', form), cot = $('#f-lettino');
  const syncCot = () => { cotBox.hidden = sist.value !== COT; };
  window.prefillRequest = o => {
    if (o.sist && [...sist.options].some(x => x.value === o.sist)) sist.value = o.sist;
    put($('#f-arrivo'), o.arrivo); put($('#f-partenza'), o.partenza);
    put($('#f-adulti'), o.adulti); put($('#f-bambini'), o.bambini);
    cot.checked = !!o.lettino;
    syncCot();
  };
  const qp = new URLSearchParams(location.search);
  prefillRequest({ sist: qp.get('sist'), arrivo: qp.get('arrivo'), partenza: qp.get('partenza'), adulti: qp.get('adulti'), bambini: qp.get('bambini'), lettino: qp.get('lettino') });
  sist.addEventListener('change', syncCot);
  $$('[data-pick]').forEach(a => a.addEventListener('click', () => { if ([...sist.options].some(o => o.value === a.dataset.pick)) sist.value = a.dataset.pick; syncCot(); }));
  $('#f-arrivo').addEventListener('change', e => { $('#f-partenza').min = e.target.value || today; });
  // every field except the message is required: each one says what is missing, right under it
  const say = (name, msg) => {
    const el = form.elements[name], box = el.closest('.f'), out = $('#e-' + name);
    box.classList.toggle('invalid', !!msg);
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    out.textContent = msg || '';
  };
  const check = () => {
    const v = n => (form.elements[n].value || '').trim();
    const digits = v('telefono').replace(/\D/g, '');
    const errs = {
      nome: v('nome') ? '' : 'Please enter your name.',
      email: !v('email') ? 'Please enter your email.' : (!form.elements.email.checkValidity() ? 'Check your email: it should look like name@example.com' : ''),
      telefono: !v('telefono') ? 'Please enter a phone number.' : (digits.length < 6 ? 'Check the phone number.' : ''),
      arrivo: v('arrivo') ? '' : 'Choose the arrival date.',
      partenza: !v('partenza') ? 'Choose the departure date.' : (v('arrivo') && v('partenza') <= v('arrivo') ? 'Departure must be after arrival.' : ''),
      sistemazione: v('sistemazione') ? '' : 'Choose your accommodation.',
      adulti: !v('adulti') || +v('adulti') < 1 ? 'Enter how many adults (at least 1).' : '',
      bambini: v('bambini') === '' || +v('bambini') < 0 ? 'Enter how many children (0 if none).' : '',
    };
    return errs;
  };
  // the line under the button counts what is still to do, and updates while the fields get fixed
  const summary = () => {
    const n = $$('.f.invalid', form).length;
    err.textContent = !n ? '' : n === 1 ? 'One field is still missing: you will find it in red.' : `${n} fields are still missing: you will find them in red.`;
  };
  // once a field has been flagged, it clears itself as soon as it is filled in correctly
  ['nome', 'email', 'telefono', 'arrivo', 'partenza', 'sistemazione', 'adulti', 'bambini'].forEach(n => {
    const el = form.elements[n];
    const recheck = () => { if (el.closest('.f').classList.contains('invalid')) { say(n, check()[n]); summary(); } };
    el.addEventListener('input', recheck); el.addEventListener('change', recheck);
  });
  form.addEventListener('submit', async e => {
    e.preventDefault();
    err.textContent = '';
    const errs = check();
    const bad = Object.keys(errs).filter(n => errs[n]);
    Object.keys(errs).forEach(n => say(n, errs[n]));
    if (bad.length) {
      summary();
      const first = form.elements[bad[0]];
      first.focus({ preventScroll: true });
      first.closest('.f').scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
      return;
    }
    const v = n => (form.elements[n].value || '').trim();
    const fmt = d => d.split('-').reverse().join('/');
    const body = [
      'Hello,', '', 'I would like to know if you have availability.', '',
      'Name: ' + v('nome'),
      'Email: ' + v('email'),
      'Phone: ' + v('telefono'),
      'Arrival: ' + fmt(v('arrivo')),
      'Departure: ' + fmt(v('partenza')),
      'Accommodation: ' + v('sistemazione'),
      'Adults: ' + v('adulti') + ', children: ' + v('bambini'),
      !cotBox.hidden && cot.checked ? 'Travel cot: yes' : null,
      v('messaggio') ? '' : null,
      v('messaggio') ? v('messaggio') : null,
      '', 'Thank you!'
    ].filter(x => x !== null).join('\n');
    const subject = 'Availability request ' + fmt(v('arrivo')) + ' - ' + fmt(v('partenza'));
    const mailto = 'mailto:info@pionieretrusco.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    const finish = byMail => {
      form.classList.toggle('by-mail', byMail);
      $('#form-back').textContent = byMail ? 'Edit the request' : 'Send another request';
      form.classList.add('sent');
      $('.done-state', form).focus();
    };
    if (!FORM_URL) { location.href = mailto; finish(true); return; }
    const btn = $('button[type=submit]', form), label = btn.textContent;
    btn.disabled = true; btn.textContent = 'Sending...';
    try {
      const res = await fetch(FORM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // a plain request, the only kind Apps Script accepts from another site
        body: JSON.stringify({
          nome: v('nome'), email: v('email'), telefono: v('telefono'), arrivo: v('arrivo'), partenza: v('partenza'),
          sistemazione: v('sistemazione'), adulti: v('adulti'), bambini: v('bambini'), lettino: !cotBox.hidden && cot.checked,
          messaggio: (document.documentElement.lang === 'en' ? '[EN] ' : '') + v('messaggio'), sito: v('sito'), ms: Date.now() - opened
        }),
        signal: AbortSignal.timeout(20000)
      });
      if (!(await res.json()).ok) throw new Error('rifiutata');
      window.gtag?.('event', 'generate_lead');
      finish(false);
    } catch {
      err.innerHTML = `We could not send your request. Try again shortly, <a href="${mailto}">send it from your own email</a> or call us on <a href="tel:+390766802807">+39 0766 802807</a>.`;
    } finally {
      btn.disabled = false; btn.textContent = label;
    }
  });
  $('#form-back').addEventListener('click', () => { form.classList.remove('sent'); $('#f-nome').focus(); });
}

/* ---------- reduced motion, live in both directions ---------- */
const pinToFinalStates = () => { reduced = true; pinWalk(); updateDraws(); };
const unpinFinalStates = () => { reduced = false; draws.forEach(it => it.d = -1); updateDraws(); };
RMQ.addEventListener('change', e => {
  if (e.matches) pinToFinalStates();
  else { unpinFinalStates(); applyHeroMode(); }
});

applyHeroMode();
if (reduced) pinToFinalStates();
updateDraws();

/* ---------- anchor landings from other pages ---------- */
// The browser jumps to #section before scripts reshape the page, so re-align once, unless the visitor already moved.
if (location.hash.length > 1) {
  const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target) {
    let moved = false;
    const stop = () => { moved = true; };
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(ev => addEventListener(ev, stop, { once: true, passive: true }));
    const align = () => { if (!moved) target.scrollIntoView({ block: 'start', behavior: 'instant' }); };
    requestAnimationFrame(align);
    addEventListener('load', () => requestAnimationFrame(align), { once: true });
  }
}
})();
