// Build for publishing: copies pionier-etrusco/ into dist/ with only the files the pages actually use,
// and points the social-preview tags (og:url, og:image) at the real address.
// Usage: node tools/build.mjs https://indirizzo-del-sito
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(ROOT, 'pionier-etrusco');
const OUT = path.join(ROOT, 'dist');
const SITE = (process.argv[2] || 'https://example.com').replace(/\/$/, '');

const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? walk(p) : [p];
});
const files = walk(SRC).filter(f => !path.basename(f).startsWith('.'));
const pages = files.filter(f => f.endsWith('.html'));
const code = files.filter(f => /\.(html|css|js)$/.test(f));
const refs = code.map(f => fs.readFileSync(f, 'utf8')).join('\n');

fs.rmSync(OUT, { recursive: true, force: true });
let kept = 0, skipped = [];
const SIZES_DIR = path.join(SRC, 'assets', 'foto', 'sizes');
for (const f of files) {
  const rel = path.relative(SRC, f);
  if (f.startsWith(SIZES_DIR + path.sep)) continue;   // the smaller copies are copied below, only the ones the pages ask for
  const used = /\.(html|css|js)$/.test(f) || refs.includes(path.basename(f));
  if (!used) { skipped.push(rel); continue; }
  fs.mkdirSync(path.dirname(path.join(OUT, rel)), { recursive: true });
  fs.copyFileSync(f, path.join(OUT, rel));
  kept++;
}
// each page asks for the exact version of its styles and scripts, so a browser never pairs a new page with an old script
const version = rel => crypto.createHash('sha1').update(fs.readFileSync(path.join(OUT, 'assets', rel))).digest('hex').slice(0, 8);
// ---- each photo in the size the page really shows (rev 141) ----
// tools/foto-sizes.py makes assets/foto/sizes/NAME-200/400/640/960.jpg; here every <img> of a photo gets srcset and sizes.
// "sizes" comes from where the photo sits on the page (the classes of the elements around it), as measured at 1440, 1024
// and 390 px; lazy photos start with "auto", so browsers that support it use the real width instead.
const WIDTHS = [200, 400, 640, 960];
const SIZES = [
  ['pile', '54px'],                                                   // round service photos
  ['today', '(max-width:560px) 110px, 216px'],                        // Chi siamo, today
  ['pics', '(max-width:560px) 170px, 264px'],                         // Spiagge, small photos
  ['cani-band', '300px'],
  ['album', '(max-width:560px) 70vw, 320px'],                         // Chi siamo, archive
  ['ch-ph', '(max-width:560px) 92vw, (max-width:1060px) 55vw, 730px'],  // detail pages, the types
  ['m-ph', '(max-width:560px) 92vw, (max-width:1060px) 45vw, 620px'],   // detail pages, gallery
  ['bento', '(max-width:1060px) 45vw, 620px'],                        // Servizi, large photo
  ['pz-card', '(max-width:560px) 92vw, 440px'],
  ['unit', '(max-width:560px) 92vw, 440px'],                          // accommodation cards
  ['duo-tile', '(max-width:1060px) 92vw, 760px'],                     // Piazzole / Strutture tiles
];
const VOID = new Set(['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'wbr', 'area', 'base', 'col', 'embed', 'param', 'track']);
const jpegWidth = file => {
  const b = fs.readFileSync(file);
  for (let i = 2; i + 9 < b.length;) {
    if (b[i] !== 0xFF) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xC0 && m <= 0xCF && ![0xC4, 0xC8, 0xCC].includes(m)) return b.readUInt16BE(i + 7);
    i += 2 + b.readUInt16BE(i + 2);
  }
  return 0;
};
const sizedCopies = new Set();
const responsive = html => {
  // scripts and styles are left out of the reading, so text inside them is never taken for tags
  const held = [];
  let h = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, m => `\u0001${held.push(m) - 1}\u0002`);
  const stack = [];
  h = h.replace(/<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g, (m, close, tag, attrs) => {
    if (m.startsWith('<!--')) return m;
    tag = tag.toLowerCase();
    if (close) { const i = stack.map(e => e.tag).lastIndexOf(tag); if (i >= 0) stack.length = i; return m; }
    const cls = ((attrs.match(/\bclass="([^"]*)"/) || [])[1] || '').split(/\s+/).filter(Boolean);
    if (tag !== 'img') { if (!VOID.has(tag) && !/\/\s*$/.test(attrs)) stack.push({ tag, cls }); return m; }
    const src = attrs.match(/\bsrc="((?:\.\.\/)?assets\/foto\/)([\w.-]+)\.jpg"/);
    if (!src || /\bsrcset=/.test(attrs)) return m;
    const [, dir, stem] = src;
    const have = WIDTHS.filter(w => fs.existsSync(path.join(SIZES_DIR, `${stem}-${w}.jpg`)));
    if (!have.length) return m;
    const natural = jpegWidth(path.join(SRC, 'assets', 'foto', stem + '.jpg'));
    const around = new Set([...stack.flatMap(e => e.cls), ...cls]);
    const sz = (SIZES.find(([c]) => around.has(c)) || [, '100vw'])[1];
    const lazy = /\bloading="lazy"/.test(attrs);
    have.forEach(w => sizedCopies.add(`${stem}-${w}.jpg`));
    const srcset = [...have.map(w => `${dir}sizes/${stem}-${w}.jpg ${w}w`), ...(natural ? [`${dir}${stem}.jpg ${natural}w`] : [])].join(', ');
    return m.replace(/\s*\/?>$/, ` srcset="${srcset}" sizes="${lazy ? 'auto, ' : ''}${sz}">`);
  });
  return h.replace(/\u0001(\d+)\u0002/g, (m, i) => held[i]);
};

// social previews: real address instead of the placeholder
for (const p of pages) {
  const out = path.join(OUT, path.relative(SRC, p));
  const html = responsive(fs.readFileSync(out, 'utf8'))
    .replaceAll('https://example.com', SITE)
    .replace(/\s*<!-- DEPLOY STEP:[^>]*-->/g, '')
    .replace(/(href|src)="((?:\.\.\/)?assets\/)([\w.-]+\.(?:css|js))"/g, (m, a, dir, f) => `${a}="${dir}${f}?v=${version(f)}"`);
  fs.writeFileSync(out, html);
}
fs.mkdirSync(path.join(OUT, 'assets', 'foto', 'sizes'), { recursive: true });
for (const f of sizedCopies) { fs.copyFileSync(path.join(SIZES_DIR, f), path.join(OUT, 'assets', 'foto', 'sizes', f)); kept++; }
console.log(`foto: ${sizedCopies.size} copie ridotte usate dalle pagine`);
// for search engines, and the old addresses of the WordPress site
const urls = pages.map(p => path.relative(SRC, p)).filter(r => r !== '404.html').map(r => `${SITE}/${r.replace(/(^|\/)index\.html$/, '$1')}`);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
fs.copyFileSync(path.join(ROOT, 'tools/redirects.txt'), path.join(OUT, '_redirects'));
console.log(`dist/: ${kept} file copiati, ${skipped.length} non usati lasciati fuori`);
if (skipped.length) console.log('  fuori: ' + skipped.join(', '));
