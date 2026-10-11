// Worst-frame legibility audit for the home hero captions.
// Usage: start Chrome with --remote-debugging-port=9222, then: node audit-hero.mjs 1440x900
// For each band it hides the glyphs (the scrims stay), screenshots the frame and takes the lightest
// pixel behind the words: plain words are checked in cream, accent words (.w.k) in light terracotta.
import { connect } from './cdp.mjs';
const [VW, VH] = (process.argv[2] || '1440x900').split('x').map(Number);
const CREAM = [243, 238, 231], TERRA = [232, 162, 122];
const BANDS = [['.b1', [0, 0.12, 0.26]], ['.b2', [0.42, 0.52, 0.62]], ['.b4', [0.93, 0.965, 1]]];
const c = await connect();
await c.send('Page.enable'); await c.send('Runtime.enable');
await c.viewport(VW, VH);
await c.nav('http://localhost:8321/?audit=' + Date.now());
for (let i = 0; i < 80; i++) { if (await c.evaluate("document.querySelector('.stage').classList.contains('video-ready')")) break; await c.sleep(250); }
await c.sleep(1500);
const range = await c.evaluate("document.getElementById('top').offsetHeight - innerHeight");
const lum = `const L=([r,g,b])=>{const f=v=>{v/=255;return v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4};return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)};`;
console.log(`== ${VW}x${VH}`);
for (const [sel, pts] of BANDS) {
  let wPlain = 99, wKey = 99;
  for (const p of pts) {
    await c.evaluate(`scrollTo(0, ${Math.round(p * range)})`); await c.sleep(1700);
    const rects = await c.evaluate(`(()=>{const b=document.querySelector('${sel}');const box=e=>{const q=e.getBoundingClientRect();return [q.x,q.y,q.width,q.height]};
      const r={plain:[...b.querySelectorAll('.hero-h .w:not(.k)')].map(box),key:[...b.querySelectorAll('.hero-h .w.k')].map(box),op:b.style.opacity};
      const st=document.createElement('style');st.id='__h';st.textContent='${sel} .vis{visibility:hidden!important}';document.head.appendChild(st);return JSON.stringify(r)})()`);
    await c.sleep(120);
    const shot = await c.send('Page.captureScreenshot', { format: 'png' });
    await c.evaluate("document.getElementById('__h').remove();1");
    const res = await c.evaluate(`(async()=>{${lum}const R=${rects};const bm=await createImageBitmap(await (await fetch('data:image/png;base64,${shot.data}')).blob());
      const cv=new OffscreenCanvas(bm.width,bm.height);const x=cv.getContext('2d');x.drawImage(bm,0,0);
      const worst=list=>{let w=0;for(const [rx,ry,rw,rh] of list){if(rw<1)continue;const d=x.getImageData(Math.max(0,rx|0),Math.max(0,ry|0),Math.max(1,rw|0),Math.max(1,rh|0)).data;for(let i=0;i<d.length;i+=4){const l=L([d[i],d[i+1],d[i+2]]);if(l>w)w=l}}return w};
      const cr=(t,b)=>+((t+.05)/(b+.05)).toFixed(2);
      return JSON.stringify({op:R.op,plain:R.plain.length?cr(L(${JSON.stringify(CREAM)}),worst(R.plain)):null,key:R.key.length?cr(L(${JSON.stringify(TERRA)}),worst(R.key)):null})})()`);
    const r = JSON.parse(res);
    if (+r.op > .98) { if (r.plain !== null) wPlain = Math.min(wPlain, r.plain); if (r.key !== null) wKey = Math.min(wKey, r.key); }
  }
  console.log(`${sel}  worst plain ${wPlain === 99 ? '-' : wPlain}  worst accent ${wKey === 99 ? '-' : wKey}`);
}
c.close();
