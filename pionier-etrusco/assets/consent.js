/* ---------- cookie choice and Google Analytics ---------- */
// Nothing reaches Google Analytics before the visitor accepts. It only runs on the real domain: previews set no cookies, show no banner and stay out of the statistics.
(() => {
  const GA_ID = 'G-JLL505H4Y3'; // the old site's Analytics property, so the history carries on
  if (!/(^|\.)campingpionieretrusco\.it$/.test(location.hostname)) return;
  const KEY = 'cp-consenso', LIFE = 182 * 864e5; // after 6 months the choice is asked again

  const load = () => {
    try {
      const c = JSON.parse(localStorage.getItem(KEY));
      return c && Date.now() - c.t < LIFE ? c.ok : null;
    } catch { return null; }
  };
  const save = ok => { try { localStorage.setItem(KEY, JSON.stringify({ ok, t: Date.now() })); } catch {} };

  let started = false;
  const start = () => {
    window['ga-disable-' + GA_ID] = false;
    if (started) return;
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.append(s);
  };
  // a refusal after an acceptance also removes the cookies already set
  const stop = () => {
    window['ga-disable-' + GA_ID] = true;
    const host = location.hostname.split('.');
    document.cookie.split('; ').map(c => c.split('=')[0]).filter(n => n.startsWith('_ga')).forEach(n => {
      document.cookie = `${n}=; Max-Age=0; path=/`;
      for (let i = 0; i < host.length - 1; i++) document.cookie = `${n}=; Max-Age=0; path=/; domain=.${host.slice(i).join('.')}`;
    });
  };

  let box = null;
  const ask = () => {
    if (box) return;
    const now = load();
    box = document.createElement('section');
    box.className = 'cookie-box';
    box.setAttribute('aria-label', 'Scelta sui cookie');
    box.innerHTML = `<p>Con il tuo permesso usiamo Google Analytics per capire come viene visitato il sito. Sono cookie statistici, non pubblicitari. Se rifiuti, il sito funziona lo stesso.${now === null ? '' : ` <strong>Scelta attuale: ${now ? 'accettati' : 'rifiutati'}.</strong>`} <a href="privacy.html#cookie">Leggi di più</a></p>
<div class="cookie-btns"><button class="btn btn-sm" type="button" data-ok="0">Rifiuta</button><button class="btn btn-sm" type="button" data-ok="1">Accetta</button></div>`;
    box.addEventListener('click', e => {
      const b = e.target.closest('[data-ok]');
      if (!b) return;
      const ok = b.dataset.ok === '1';
      save(ok);
      ok ? start() : stop();
      box.remove();
      box = null;
    });
    document.body.append(box);
  };

  document.querySelectorAll('[data-cookie-prefs]').forEach(b => { b.hidden = false; b.addEventListener('click', ask); });
  const choice = load();
  if (choice === null) ask();
  else if (choice) start();
})();
