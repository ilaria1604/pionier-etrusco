// Tiny Chrome DevTools Protocol helper (Node 22+, global WebSocket), used by the test scripts.
export async function connect(port = 9222) {
  let list;
  for (let i = 0; i < 50; i++) {
    try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (list.find(t => t.type === 'page')) break; } catch {}
    await new Promise(r => setTimeout(r, 200));
  }
  const page = list.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r, { once: true }));
  let id = 0; const pending = new Map(); const listeners = [];
  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); }
    else if (m.method) listeners.forEach(fn => fn(m));
  });
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  const on = fn => listeners.push(fn);
  const evaluate = async (expression) => { const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails)); return r.result.value; };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const shot = async (file, clip) => { const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80, ...(clip ? { clip } : {}) }); (await import('fs')).writeFileSync(file, Buffer.from(r.data, 'base64')); };
  const viewport = (width, height, mobile = false, touch = false) => Promise.all([
    send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile }),
    send('Emulation.setTouchEmulationEnabled', { enabled: touch, maxTouchPoints: 5 })
  ]);
  const nav = async (url) => { await send('Page.navigate', { url }); await sleep(1500); };
  return { send, on, evaluate, sleep, shot, viewport, nav, close: () => ws.close() };
}
