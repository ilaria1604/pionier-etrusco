// Build for publishing: copies pionier-etrusco/ into dist/ with only the files the pages actually use,
// and points the social-preview tags (og:url, og:image) at the real address.
// Usage: node tools/build.mjs https://indirizzo-del-sito
import fs from 'fs';
import path from 'path';

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
for (const f of files) {
  const rel = path.relative(SRC, f);
  const used = /\.(html|css|js)$/.test(f) || refs.includes(path.basename(f));
  if (!used) { skipped.push(rel); continue; }
  fs.mkdirSync(path.dirname(path.join(OUT, rel)), { recursive: true });
  fs.copyFileSync(f, path.join(OUT, rel));
  kept++;
}
// social previews: real address instead of the placeholder
for (const p of pages) {
  const out = path.join(OUT, path.relative(SRC, p));
  const html = fs.readFileSync(out, 'utf8')
    .replaceAll('https://example.com', SITE)
    .replace(/\s*<!-- DEPLOY STEP:[^>]*-->/g, '');
  fs.writeFileSync(out, html);
}
console.log(`dist/: ${kept} file copiati, ${skipped.length} non usati lasciati fuori`);
if (skipped.length) console.log('  fuori: ' + skipped.join(', '));
