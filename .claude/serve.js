// Minimal static server for local preview (no dependencies).
const http = require('http'), fs = require('fs'), path = require('path');
const port = Number(process.argv[2] || 8321);
const root = path.resolve(process.argv[3] || '.');
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.mp4':'video/mp4', '.json':'application/json', '.ico':'image/x-icon', '.webp':'image/webp' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(root, p);
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, {'Content-Type':'text/plain'}); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Content-Length': st.size, 'Cache-Control': 'no-cache' });
    fs.createReadStream(file).pipe(res);
  });
}).listen(port, process.argv[4] || '127.0.0.1', () => console.log('Serving ' + root + ' on port ' + port + ' (' + (process.argv[4] || '127.0.0.1') + ')'));
