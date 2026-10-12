/* Camping Pionier Etrusco · price calculator (listino 2026)
   To update the season: change YEAR, the band dates and the prices below. */
(() => {
const boxes = document.querySelectorAll('.calc');
if (!boxes.length) return;

const YEAR = 2026;
const D = (m, d) => Date.UTC(YEAR, m - 1, d);
const DAY = 864e5;
const OPEN = D(4, 4), CLOSE = D(9, 27);
const SEASON = ['bassissima', 'bassa', 'media', 'alta'];

// Weekly stays: [from, to) with the season index. Bungalow weeks run Saturday to Saturday, glamping and home Sunday to Sunday.
const WEEK_BANDS = {
  sat: [[D(4, 4), D(5, 23), 0], [D(5, 23), D(6, 20), 1], [D(6, 20), D(8, 1), 2], [D(8, 1), D(8, 22), 3], [D(8, 22), D(8, 29), 2], [D(8, 29), D(9, 12), 1], [D(9, 12), D(9, 26), 0]],
  sun: [[D(4, 5), D(5, 24), 0], [D(5, 24), D(6, 21), 1], [D(6, 21), D(8, 2), 2], [D(8, 2), D(8, 23), 3], [D(8, 23), D(8, 30), 2], [D(8, 30), D(9, 13), 1], [D(9, 13), D(9, 27), 0]],
};
// Pitches: each night is priced by the day it starts, ranges inclusive.
const NIGHT_BANDS = [[D(4, 4), D(5, 21), 0], [D(5, 22), D(6, 19), 1], [D(6, 20), D(7, 30), 2], [D(7, 31), D(8, 25), 3], [D(8, 26), D(8, 31), 2], [D(9, 1), D(9, 14), 1], [D(9, 15), D(9, 27), 0]];
const PITCH = { pitch: [9, 11, 14, 20], adult: [10, 11, 14, 16], kid: [0, 4, 6, 8], car: [4, 5, 5, 6] };

const TYPES = {
  piaz: { cap: 8, name: 'Piazzola', sub: 'camper, roulotte o tenda', kind: 'night', pick: 'Piazzola camper' },
  mono: { cap: 2, capNote: 'più un lettino da campeggio', name: 'Bungalow Monolocale', sub: '20 mq, 2 posti', kind: 'week', band: 'sat', price: [350, 500, 750, 900], pick: 'Bungalow monolocale 20 mq' },
  tri: { cap: 4, name: 'Bungalow Trilocale', sub: '28 mq, 3 o 4 posti', kind: 'week', band: 'sat', price: [450, 650, 1000, 1250], pick: 'Bungalow trilocale 28 mq' },
  sup5: { cap: 5, name: 'Bungalow Superior', sub: '48 mq, 4 o 5 posti', kind: 'week', band: 'sat', price: [500, 700, 1150, 1400], pick: 'Bungalow trilocale superior 48 mq' },
  sup6: { cap: 6, name: 'Bungalow Superior', sub: '48 mq, 6 posti', kind: 'week', band: 'sat', price: [560, 750, 1200, 1500], pick: 'Bungalow trilocale superior 48 mq' },
  glam: { cap: 4, name: 'Glamping', sub: 'Luxury Lodge 45 mq, 4 posti', kind: 'week', band: 'sun', price: [450, 650, 1000, 1250], pick: 'Glamping Luxury Lodge' },
  home: { cap: 4, name: 'Home', sub: 'Premium Comfort 34 mq, 4 posti', kind: 'week', band: 'sun', price: [600, 800, 1150, 1450], pick: 'Home Premium Comfort' },
};

const fmtDay = new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
const fmtShort = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', timeZone: 'UTC' });
const eur = n => '€ ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const MONTHS = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
// "dal 4 luglio all'11 luglio", "dal 1° agosto all'8 agosto": Italian elision before 8 and 11
const dayWord = (t, art) => { const d = new Date(t).getUTCDate(), v = d === 8 || d === 11; return (v ? art + "ll'" : art + 'l ') + (d === 1 ? '1°' : d) + ' ' + MONTHS[new Date(t).getUTCMonth()]; };
// "5 → 12 luglio" or "26 luglio → 2 agosto": short enough for a phone
const weekLabel = (a, b) => { const A = new Date(a), B = new Date(b); return A.getUTCMonth() === B.getUTCMonth() ? `${A.getUTCDate()} → ${B.getUTCDate()} ${MONTHS[B.getUTCMonth()]}` : `${A.getUTCDate()} ${MONTHS[A.getUTCMonth()]} → ${B.getUTCDate()} ${MONTHS[B.getUTCMonth()]}`; };
const span = (a, b) => dayWord(a, 'da') + ' ' + dayWord(b, 'a');
const iso = t => new Date(t).toISOString().slice(0, 10);
const parse = s => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return m ? Date.UTC(+m[1], m[2] - 1, +m[3]) : NaN; };
const bandOf = (list, t, inclusive) => { for (const [a, b, s] of list) if (t >= a && (inclusive ? t <= b : t < b)) return s; return -1; };
const weekStarts = band => { const out = []; const first = WEEK_BANDS[band][0][0], last = WEEK_BANDS[band].at(-1)[1]; for (let t = first; t + 7 * DAY <= last; t += 7 * DAY) out.push(t); return out; };
const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many);

// how each type reads in the select, grouped
const GROUPS = [['', ['piaz']], ['Bungalow', ['mono', 'tri', 'sup5', 'sup6']], ['', ['glam', 'home']]];
const optLabel = k => ({ piaz: 'Piazzola per camper, roulotte o tenda', mono: 'Monolocale, 20 mq, 2 posti', tri: 'Trilocale, 28 mq, 3 o 4 posti', sup5: 'Superior, 48 mq, 4 o 5 posti', sup6: 'Superior, 48 mq, 6 posti', glam: 'Glamping, 45 mq, 4 posti', home: 'Home, 34 mq, 4 posti' })[k];
const WD = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
const WDLONG = ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'];
const longDay = t => fmtDay.format(t);
// days before today cannot be booked; once the listed season is over everything stays selectable (until next year's prices go in)
const TODAY = (() => { const n = new Date(); return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()); })();
const FIRST = TODAY > CLOSE ? OPEN : Math.max(OPEN, TODAY);
const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

let uid = 0;
boxes.forEach(box => {
  const id = 'calc' + (++uid);
  const allowed = (box.dataset.types || Object.keys(TYPES).join(',')).split(',').filter(k => TYPES[k]);
  const single = allowed.length === 1;
  const onHome = !!document.getElementById('form');
  let type = allowed.includes(box.dataset.preset) ? box.dataset.preset : (single ? allowed[0] : null);
  let adults = 0, kids = 0, from = null, to = null;
  let view = new Date(FIRST).getUTCMonth();
  const head = (i, t) => `<p class="calc-q" id="${id}-q${i}"><span class="n" aria-hidden="true">${i}</span>${t}</p>`;
  const stepper = (cls, label) => `<div class="stepper" role="group" aria-label="${label}"><button type="button" class="${cls}-m" aria-label="${label}: uno in meno">−</button><output class="${cls}" aria-live="polite">0</output><button type="button" class="${cls}-p" aria-label="${label}: uno in più">+</button></div>`;
  const groups = GROUPS.map(([g, keys]) => {
    const ks = keys.filter(k => allowed.includes(k));
    if (!ks.length) return '';
    const opts = ks.map(k => `<option value="${k}"${k === type ? ' selected' : ''}>${optLabel(k)}</option>`).join('');
    return g && ks.length > 1 ? `<optgroup label="${g}">${opts}</optgroup>` : opts;
  }).join('');

  // one card, three columns of the same height: what and how many / when / price
  box.innerHTML = `
    <div class="calc-card" data-step="1">
      <ol class="calc-prog" aria-hidden="true"><li>Chi e quanti</li><li>Date</li><li>Prezzo</li></ol>
      <div class="calc-col">
        <div role="group" aria-labelledby="${id}-q1">
          ${head(1, 'Dove vuoi dormire?')}
          ${single
            ? `<p class="calc-fixed"><b>${TYPES[type].name}</b><span>${TYPES[type].sub}</span></p>`
            : `<label class="fld"><span>Sistemazione</span><select class="c-type">${type ? '' : '<option value="" selected disabled>Scegli la sistemazione</option>'}${groups}</select></label>`}
        </div>
        <div class="calc-sep" role="group" aria-labelledby="${id}-q2">
          ${head(2, 'Quanti siete?')}
          <div class="fld2">
            <div class="fld"><span>Adulti</span>${stepper('c-a', 'Adulti')}</div>
            <div class="fld"><span>Bambini <small class="c-kidage"></small></span>${stepper('c-k', 'Bambini')}</div>
          </div>
          <p class="calc-cap" aria-live="polite"></p>
          <label class="chk c-car-f" hidden><input type="checkbox" class="c-car"><span>Ho una seconda auto</span></label>
        </div>
        <div class="calc-stepnav"><button type="button" class="btn c-next" data-to="2">Avanti</button></div>
      </div>
      <div class="calc-col" role="group" aria-labelledby="${id}-q3">
        ${head(3, 'Quando arrivi?')}
        <p class="cal-help"></p>
        <div class="cal">
          <div class="cal-head"><button type="button" class="cal-nav cal-prev" aria-label="Mese precedente"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button><b class="cal-m" aria-live="polite"></b><button type="button" class="cal-nav cal-next" aria-label="Mese successivo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button></div>
          <div class="cal-grid" role="grid"></div>
        </div>
        <p class="cal-sum" aria-live="polite"></p>
        <div class="calc-stepnav"><button type="button" class="c-back" data-to="1">Indietro</button><button type="button" class="btn c-next" data-to="3">Vedi il prezzo</button></div>
      </div>
      <div class="calc-col calc-out" role="group" aria-labelledby="${id}-q4">
        ${head(4, 'Il tuo prezzo')}
        <div class="calc-res" aria-live="polite"></div>
        <div class="calc-stepnav"><button type="button" class="c-back" data-to="2">Cambia le date</button><button type="button" class="c-back" data-to="1">Cambia sistemazione o persone</button></div>
      </div>
    </div>`;

  const $ = s => box.querySelector(s);
  const selType = $('.c-type'), car = $('.c-car'), res = $('.calc-res'), grid = $('.cal-grid');
  const T = () => TYPES[type];
  const weekly = () => type && T().kind === 'week';
  const starts = () => weekStarts(T().band);
  // the week a day belongs to (or null when it is not part of a bookable week)
  const weekOf = t => { for (const w of starts()) if (t >= w && t < w + 7 * DAY) return w; return null; };
  const selectable = t => {
    if (!type || t < FIRST) return false;
    if (weekly()) { const w = weekOf(t); return w !== null && w >= FIRST; }
    if (from !== null && to === null) return t > from ? t <= CLOSE : t < CLOSE;
    return t < CLOSE;
  };

  const drawCal = () => {
    const first = Date.UTC(YEAR, view, 1), days = new Date(Date.UTC(YEAR, view + 1, 0)).getUTCDate();
    const lead = (new Date(first).getUTCDay() + 6) % 7;
    $('.cal-m').textContent = MONTHS[view] + ' ' + YEAR;
    $('.cal-prev').disabled = view <= new Date(FIRST).getUTCMonth();
    $('.cal-next').disabled = view >= new Date(CLOSE).getUTCMonth();
    let html = WD.map((d, i) => `<span class="cal-wd" aria-hidden="true" title="${WDLONG[i]}">${d}</span>`).join('') + '<span></span>'.repeat(lead);
    for (let d = 1; d <= days; d++) {
      const t = Date.UTC(YEAR, view, d);
      const ok = selectable(t) || t === from || t === to;   // the chosen first and last day can always be tapped again
      const inR = from !== null && t >= from && t <= (to ?? from);
      const cls = ['cal-d', inR ? 'in' : '', t === from ? 'start' : '', t === to ? 'end' : ''].filter(Boolean).join(' ');
      html += `<button type="button" class="${cls}" data-t="${t}"${ok ? '' : ' disabled'} aria-pressed="${inR}" aria-label="${longDay(t)}">${d}</button>`;
    }
    grid.innerHTML = html;
  };

  const help = () => {
    if (!type) return 'Prima scegli la sistemazione.';
    if (weekly()) return `Si prenota a settimane, da ${T().band === 'sat' ? 'sabato a sabato' : 'domenica a domenica'}. Tocca un giorno della settimana in cui vuoi arrivare; per restare di più, tocca anche l'ultima settimana.`;
    return from !== null && to === null ? 'Ora tocca il giorno di partenza.' : 'Tocca il giorno di arrivo, poi quello di partenza.';
  };

  const people = () => {
    const cap = type ? T().cap : 8;
    $('.c-a').textContent = adults; $('.c-k').textContent = kids;
    $('.c-a-m').disabled = adults <= 0; $('.c-k-m').disabled = kids <= 0;
    $('.c-a-p').disabled = !type || adults + kids >= cap; $('.c-k-p').disabled = !type || adults + kids >= cap;
    $('.c-kidage').textContent = type && T().kind === 'night' ? '(3-8 anni)' : '';
    $('.c-car-f').hidden = !(type && T().kind === 'night');
    $('.calc-cap').textContent = !type ? '' : T().kind === 'night'
      ? 'Sotto i 3 anni non si paga. Per ogni piazzola si contano almeno 2 persone.'
      : `${T().name}: al massimo ${T().cap} persone${T().capNote ? ', ' + T().capNote : ''}.`;
  };

  const askLink = () => {
    const p = new URLSearchParams({ sist: T().pick, arrivo: iso(from), partenza: iso(to), adulti: adults, bambini: kids });
    return (onHome ? '?' : 'index.html?') + p.toString() + '#richiesta';
  };

  const result = () => {
    const missing = [['la sistemazione', !!type], ['quante persone', adults > 0], ['le date', from !== null && to !== null]];
    if (missing.some(m => !m[1])) {
      res.innerHTML = `<p class="calc-total empty"><b>€ ...</b></p><p class="calc-wait-t">Il prezzo compare quando hai scelto:</p><ul class="calc-todo">${missing.map(([t, ok]) => `<li class="${ok ? 'ok' : ''}">${CHECK}${t}</li>`).join('')}</ul>`;
      return;
    }
    let total = 0, lines = [], notes = [];
    if (weekly()) {
      for (let w = from; w < to; w += 7 * DAY) {
        const s = bandOf(WEEK_BANDS[T().band], w, false);
        total += T().price[s];
        lines.push([span(w, w + 7 * DAY), `${SEASON[s]} stagione`, T().price[s]]);
      }
      notes.push("All'arrivo si aggiungono € 50 per la pulizia dell'angolo cottura.");
    } else {
      const billed = Math.max(adults, 2 - kids);
      const per = [0, 0, 0, 0], sum = [0, 0, 0, 0];
      for (let t = from; t < to; t += DAY) {
        const s = bandOf(NIGHT_BANDS, t, true);
        per[s]++;
        sum[s] += PITCH.pitch[s] + billed * PITCH.adult[s] + kids * PITCH.kid[s] + (car.checked ? PITCH.car[s] : 0);
      }
      per.forEach((c, s) => { if (c) { total += sum[s]; lines.push([plural(c, 'notte', 'notti'), `${SEASON[s]} stagione`, sum[s]]); } });
      notes.push(`Comprende la piazzola, ${[plural(billed, 'adulto', 'adulti'), kids ? plural(kids, 'bambino', 'bambini') : '', car.checked ? 'la seconda auto' : ''].filter(Boolean).join(', ')}.`);
      if (per[3] && (to - from) / DAY < 7) notes.push('<b>In alta stagione il minimo è di 7 notti.</b>');
    }
    res.innerHTML = `
      <p class="calc-total"><b>${eur(total)}</b><small>tasse e IVA incluse</small></p>
      <ul class="calc-lines">${lines.map(l => `<li><span>${l[0]}<small>${l[1]}</small></span><b>${eur(l[2])}</b></li>`).join('')}</ul>
      ${notes.map(x => `<p class="calc-note">${x}</p>`).join('')}
      <a class="btn calc-ask" href="${askLink()}">Richiedi disponibilità</a>
      <p class="calc-note small">Prezzo indicativo: la disponibilità te la confermiamo noi.</p>`;
    if (onHome) $('.calc-ask').addEventListener('click', e => {
      e.preventDefault();
      window.prefillRequest && window.prefillRequest({ sist: T().pick, arrivo: iso(from), partenza: iso(to), adulti: adults, bambini: kids });
      const target = document.getElementById('richiesta');
      if (target) target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
  };

  const summary = () => {
    if (from === null) return '';
    if (to === null) return `Arrivo: <b>${longDay(from)}</b>. Ora scegli la partenza.<br><small>Per togliere l'arrivo toccalo di nuovo.</small>`;
    const n = (to - from) / DAY;
    return `Dal <b>${longDay(from)}</b> al <b>${longDay(to)}</b> (${weekly() ? plural(n / 7, 'settimana', 'settimane') : plural(n, 'notte', 'notti')}).<br><small>Per togliere un giorno toccalo di nuovo, oppure <button type="button" class="cal-reset">cancella le date</button>.</small>`;
  };

  // phones: one step at a time (the computer shows the three columns together)
  const card = $('.calc-card');
  const setStep = n => {
    card.dataset.step = n;
    if (matchMedia('(max-width:720px)').matches) {
      const top = card.getBoundingClientRect().top;
      if (top < 110 || top > innerHeight * .5) card.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  };
  const render = () => {
    people();
    $('.cal-help').textContent = help();
    $('.cal').classList.toggle('off', !type);
    drawCal();
    $('.cal-sum').innerHTML = summary();
    result();
    $('.c-next[data-to="2"]').disabled = !(type && adults > 0);
    $('.c-next[data-to="3"]').disabled = !(from !== null && to !== null);
  };

  const setType = k => {
    const wasWeekly = weekly(), oldBand = type && T().band;
    type = k;
    if (selType) { selType.value = k; const ph = selType.querySelector('option[value=""]'); if (ph) ph.remove(); }
    // dates only survive if the booking rhythm is the same
    if (wasWeekly !== weekly() || oldBand !== (T().band)) { from = null; to = null; }
    // people above the new maximum: drop children first, then adults
    while (adults + kids > T().cap) { if (kids > 0) kids--; else adults--; }
    render();
  };

  grid.addEventListener('click', e => {
    const b = e.target.closest('.cal-d');
    if (!b || b.disabled) return;
    const t = +b.dataset.t;
    // tapping the first day again clears the dates; tapping the last day again takes it away
    if (t === from) { from = null; to = null; }
    else if (t === to) {
      if (weekly()) to = to - 7 * DAY > from ? to - 7 * DAY : (from = null, null);   // one week less, or nothing if it was the only one
      else to = null;                                                                // back to choosing the departure
    } else if (weekly()) {
      const w = weekOf(t);
      if (from === null || w < from) { from = w; to = w + 7 * DAY; }
      else to = w + 7 * DAY;                       // a later week (or one inside the stay) sets the last week
    } else {
      if (from === null || to !== null || t < from) { from = t; to = null; }
      else to = t;
    }
    render();
  });
  // weekly booking: show the whole week under the pointer
  grid.addEventListener('pointerover', e => {
    if (!weekly()) return;
    const b = e.target.closest('.cal-d');
    grid.querySelectorAll('.hov').forEach(x => x.classList.remove('hov'));
    if (!b || b.disabled) return;
    const w = weekOf(+b.dataset.t);
    grid.querySelectorAll('.cal-d').forEach(x => { const t = +x.dataset.t; if (t >= w && t <= w + 7 * DAY) x.classList.add('hov'); });
  });
  grid.addEventListener('pointerleave', () => grid.querySelectorAll('.hov').forEach(x => x.classList.remove('hov')));
  box.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.matches('.c-next, .c-back')) { setStep(+b.dataset.to); return; }
    if (b.matches('.cal-prev')) view--; else if (b.matches('.cal-next')) view++;
    else if (b.matches('.cal-reset')) { from = null; to = null; }
    else if (b.matches('.c-a-m')) adults = Math.max(0, adults - 1); else if (b.matches('.c-a-p')) adults++;
    else if (b.matches('.c-k-m')) kids = Math.max(0, kids - 1); else if (b.matches('.c-k-p')) kids++;
    else return;
    render();
  });
  box.addEventListener('change', e => { if (e.target === selType) setType(e.target.value); else render(); });
  // buttons elsewhere on the page can preselect a type: <a href="#calcola" data-calc-pick="tri">
  document.querySelectorAll('[data-calc-pick]').forEach(a => a.addEventListener('click', () => {
    if (allowed.includes(a.dataset.calcPick)) setType(a.dataset.calcPick);
  }));
  if (type) setType(type); else render();
});
})();
