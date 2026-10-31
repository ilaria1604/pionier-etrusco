// Builds the English site from the Italian one: pionier-etrusco/en/*.html and assets/*.en.js.
// Layout, photos and prices stay in the Italian sources. Only the words live in tools/en-testi.mjs.
// A text with no translation stops the script, so a half-Italian page cannot be published.
// Usage: node tools/gen-en.mjs
import fs from 'fs';
import path from 'path';
import { TEXT, MARKUP, KEEP, CODE } from './en-testi.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(ROOT, 'pionier-etrusco');
const PAGES = ['index', 'piazzole', 'bungalow', 'glamping', 'home', 'privacy'];
const SCRIPTS = ['site', 'calc', 'consent'];

const MONTHS = { gennaio: 'January', febbraio: 'February', marzo: 'March', aprile: 'April', maggio: 'May', giugno: 'June', luglio: 'July', agosto: 'August', settembre: 'September', ottobre: 'October', novembre: 'November', dicembre: 'December' };
const M = Object.keys(MONTHS).join('|');
const RANGE = new RegExp(`^dal?l?['\\s]?(\\d+)°?(?: (${M}))? all?'?l? ?(\\d+)°? (${M})$`);

const missing = new Set(), used = new Set();
const tr = raw => {
  const k = raw.trim();
  if (k in TEXT) { used.add(k); return TEXT[k]; }
  if (!k || !/\p{L}{2}/u.test(k) || KEEP.includes(k)) return k;
  let m;
  if ((m = RANGE.exec(k))) return m[2] ? `from ${m[1]} ${MONTHS[m[2]]} to ${m[3]} ${MONTHS[m[4]]}` : `from ${m[1]} to ${m[3]} ${MONTHS[m[4]]}`;
  if ((m = /^Ingrandisci: (.+)$/.exec(k))) return 'Enlarge: ' + tr(m[1]);
  if ((m = /^Video: (.+)\. Tocca per mettere in pausa o riprendere$/.exec(k))) return `Video: ${tr(m[1])}. Tap to pause or resume`;
  if ((m = /^Video (.+)\. Tocca per mettere in pausa o riprendere$/.exec(k))) return `${tr('Video ' + m[1])}. Tap to pause or resume`;
  if ((m = /^(\d+) foto$/.exec(k))) return m[1] + ' photos';
  if ((m = /^Guarda le (\d+) foto de[l]? (.+)$/.exec(k))) return `See the ${m[1]} photos of the ${tr(m[2])}`;
  if ((m = /^(.+): guarda le foto \((\d+)\)$/.exec(k))) return `${tr(m[1])}: see the photos (${m[2]})`;
  if ((m = /^Piazzola tenda (\d+)$/.exec(k))) return 'Tent pitch ' + m[1];
  if ((m = /^Piazzola (\d+)$/.exec(k))) return 'Pitch ' + m[1];
  if ((m = /^Piazzola per tenda grande, roulotte e camper (\d+)$/.exec(k))) return 'Pitch for large tent, caravan or motorhome ' + m[1];
  if ((m = /^(Bungalow|Home|Glamping) (\d+)(?: e (\d+))?$/.exec(k))) return `${m[1]} ${m[2]}${m[3] ? ' and ' + m[3] : ''}`;
  missing.add(k);
  return k;
};
const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
const unesc = s => s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&');

const page = name => {
  let h = fs.readFileSync(path.join(SRC, name + '.html'), 'utf8');
  const file = name === 'index' ? '' : name + '.html';

  // sentences with markup inside: swapped whole, and kept out of the text pass below
  const held = [];
  for (const [it, en] of MARKUP) {
    if (h.includes(it)) used.add(it);
    h = h.replaceAll(it, () => { held.push(en); return `\u0001${held.length - 1}\u0002`; });
  }
  // the form keeps the Italian value, so the request still reaches the campsite in Italian
  h = h.replace(/<option>([^<]+)<\/option>/g, (m, t) => `<option value="${t}">\u0003${tr(t)}\u0003</option>`);
  h = h.replace(/\sdata-photos="([^"]*)"/g, (m, v) => {
    const list = JSON.parse(unesc(v)).map(([src, cap]) => ['../' + src, tr(cap)]);
    return ` data-photos="${esc(JSON.stringify(list))}"`;
  });
  h = h.replace(/\b(alt|aria-label|title|placeholder|data-tip)="([^"]*)"/g, (m, a, v) => `${a}="${v ? tr(v).replace(/"/g, '&quot;') : ''}"`);
  h = h.replace(/(<meta (?:name="description"|property="og:(?:title|description)") content=")([^"]*)"/g, (m, a, v) => `${a}${tr(v).replace(/"/g, '&quot;')}"`);
  h = h.replace(/>([^<>]+)</g, (m, t) => {
    if (/[\u0001\u0003]/.test(t)) return m;
    const k = t.trim();
    return k ? '>' + t.replace(k, () => tr(k)) + '<' : m;
  });
  h = h.replace(/\u0003/g, '').replace(/\u0001(\d+)\u0002/g, (m, i) => held[i]);

  // the same page, one folder down, with English thousands
  h = h.replace(/€ (\d{1,3})\.(\d{3})\b/g, '€ $1,$2');
  h = h.replace('<html lang="it">', '<html lang="en">')
    .replace('content="it_IT"', 'content="en_GB"')
    .replace(/(<link rel="canonical" href="https:\/\/example\.com\/)/, '$1en/')
    .replace(/(<meta property="og:url" content="https:\/\/example\.com\/)/, '$1en/')
    .replace(/\b(src|href|data-src|data-poster|poster)="assets\//g, '$1="../assets/')
    .replace(/assets\/(site|calc|consent)\.js/g, 'assets/$1.en.js');

  // the language link goes back to the Italian page
  const it = '../' + (name === 'index' ? 'index.html' : file);
  h = h.replace(/<a class="lang-link" href="[^"]*" hreflang="en" lang="en" aria-label="English version">EN<\/a>/, `<a class="lang-link" href="${it}" hreflang="it" lang="it" aria-label="Versione italiana">IT</a>`)
    .replace(/<a href="en\/[^"]*" hreflang="en" lang="en">English<\/a>/, `<a href="${it}" hreflang="it" lang="it">Italiano</a>`);
  fs.mkdirSync(path.join(SRC, 'en'), { recursive: true });
  fs.writeFileSync(path.join(SRC, 'en', name + '.html'), h);
};

const script = name => {
  let js = fs.readFileSync(path.join(SRC, 'assets', name + '.js'), 'utf8');
  for (const [it, en] of CODE[name]) {
    if (!js.includes(it)) missing.add(`${name}.js: ${it}`);
    js = js.replaceAll(it, () => en);
  }
  js = js.replace(/'assets\//g, "'../assets/");
  fs.writeFileSync(path.join(SRC, 'assets', name + '.en.js'), js);
};

PAGES.forEach(page);
SCRIPTS.forEach(script);

const stale = [...Object.keys(TEXT), ...MARKUP.map(x => x[0])].filter(k => !used.has(k));
if (stale.length) console.log(`Traduzioni non più usate (${stale.length}):\n  ` + stale.join('\n  '));
if (missing.size) {
  console.error(`\nMANCANO ${missing.size} TRADUZIONI in tools/en-testi.mjs:\n  ` + [...missing].join('\n  '));
  process.exit(1);
}
console.log(`en/: ${PAGES.length} pagine e ${SCRIPTS.length} script`);
