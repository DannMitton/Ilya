// usage: node pyrun.mjs script.py out.json 'argsjson' in1.png in2.png ...
// script.py must define main(args, paths) -> JSON-serialisable. Pinned Pyodide 0.26.4 on the app's own reader modules.
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/package.json');
const { chromium } = require('@playwright/test');
const [script, out, argsJson, ...files] = process.argv.slice(2);
const code = fs.readFileSync(script, 'utf8');
const pngs = files.map(f => fs.readFileSync(f).toString('base64'));
const browser = await chromium.launch();
const page = await browser.newPage();
page.setDefaultTimeout(3000000);
page.on('console', m => { const t = m.text(); if (t.startsWith('PY:')) console.log(t.slice(3)); });
await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
const res = await page.evaluate(async ({ code, argsJson, pngs }) => {
  const R = '/reader/';
  const manifest = await (await fetch(R + 'manifest.json')).json();
  const { loadPyodide } = await import('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.mjs');
  const py = await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/', stdout: s => console.log('PY:' + s) });
  await py.loadPackage(['numpy', 'opencv-python', 'matplotlib']);
  py.FS.mkdirTree('/home/pyodide/.cache'); py.FS.mkdirTree('/home/pyodide/out');
  for (const n of manifest.modules) py.FS.writeFile('/home/pyodide/' + n, await (await fetch(R + n)).text());
  for (const n of manifest.caches) py.FS.writeFile('/home/pyodide/.cache/' + n, await (await fetch(R + '.cache/' + n)).text());
  py.runPython("import sys; sys.path.insert(0,'/home/pyodide')");
  const paths = pngs.map((b, i) => { const p = `/home/pyodide/in${i}.png`; py.FS.writeFile(p, Uint8Array.from(atob(b), c => c.charCodeAt(0))); return p; });
  const A = JSON.parse(argsJson);
  if (A.urls) { py.FS.mkdirTree('/home/pyodide/fx'); for (const [name, url] of Object.entries(A.urls)) { const r = await fetch(url); if (!r.ok) throw new Error(url + ' ' + r.status); py.FS.writeFile('/home/pyodide/fx/' + name, new Uint8Array(await r.arrayBuffer())); } }
  py.FS.writeFile('/home/pyodide/user.py', code);
  py.globals.set('ARGS_JSON', argsJson); py.globals.set('PATHS', paths);
  const r = py.runPython(`
import json, user
json.dumps(user.main(json.loads(ARGS_JSON), list(PATHS)), default=str)
`);
  const outFiles = {};
  for (const n of py.FS.readdir('/home/pyodide/out').filter(n => n !== '.' && n !== '..')) {
    const u = py.FS.readFile('/home/pyodide/out/' + n); let s = ''; for (let i = 0; i < u.length; i += 32768) s += String.fromCharCode.apply(null, u.subarray(i, i + 32768)); outFiles[n] = btoa(s);
  }
  return { r, outFiles };
}, { code, argsJson, pngs });
fs.writeFileSync(out, res.r);
fs.mkdirSync(out + '.files', { recursive: true });
for (const [n, b] of Object.entries(res.outFiles)) fs.writeFileSync(`${out}.files/${n}`, Buffer.from(b, 'base64'));
console.log(res.r.slice(0, 6000));
await browser.close();
