// usage: node appread.mjs <out.json> <clef sign> <line> <key> file1.png file2.png ...   (per-page, in own Pyodide + app worker)
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/package.json');
const { chromium } = require('@playwright/test');
const [out, sign, line, key, ...files] = process.argv.slice(2);
const pages = files.map(f => fs.readFileSync(f).toString('base64'));
const browser = await chromium.launch();
const page = await browser.newPage();
page.setDefaultTimeout(900000);
await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
const res = await page.evaluate(async ({ pages, sign, line, key }) => {
  const R = '/reader/';
  const manifest = await (await fetch(R + 'manifest.json')).json();
  const { loadPyodide } = await import('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.mjs');
  const t0 = performance.now();
  const py = await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/' });
  await py.loadPackage(['numpy', 'opencv-python', 'matplotlib']);
  py.FS.mkdirTree('/home/pyodide/.cache');
  for (const n of manifest.modules) py.FS.writeFile('/home/pyodide/' + n, await (await fetch(R + n)).text());
  for (const n of manifest.caches) py.FS.writeFile('/home/pyodide/.cache/' + n, await (await fetch(R + '.cache/' + n)).text());
  py.runPython("import sys; sys.path.insert(0,'/home/pyodide')");
  const loadS = (performance.now() - t0) / 1000;
  py.runPython(`
import json, time, traceback, cv2, numpy as np
import reader, envelope
def probe(path, sign, line, key, ctx_in_json):
    out = dict()
    img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    out['shape'] = list(img.shape)
    reader.FALLBACK_FIRINGS = 0
    try:
        t = time.time()
        staves, s = reader.detect_staves(img, page=path)
        out['detect_s'] = round(time.time()-t, 3)
        out['staves'] = len(staves); out['s'] = float(s)
        out['staveCentres'] = [int(st[2]) for st in staves]
        out['sliceFallbackFired'] = reader.FALLBACK_FIRINGS
        vocal, fb = reader.select_vocal(staves, s, img)
        out['vocal'] = [int(v) for v in vocal]; out['fallbacks'] = int(fb)
    except Exception as e:
        out['detect_error'] = repr(e)[:300]
    try:
        cfg = dict(png=path, page=1, clef=(sign, int(line)), key=int(key), octaveChange=0, pieceId='m')
        ctx_in = json.loads(ctx_in_json) if ctx_in_json else None
        t = time.time()
        ro, ctx_next, msum, G, rests, events = envelope.run(cfg, ctx_in)
        out['run_s'] = round(time.time()-t, 3)
        notes = ro['verses'][0]['notes']
        out['notes'] = len(notes); out['rests'] = len(rests); out['measures'] = len(ro.get('measures', []))
        out['metres'] = [ (m.get('metre') or {}).get('beats', None) and '%s/%s' % (m['metre']['beats'], m['metre']['beatType']) for m in ro.get('measures', [])]
        out['ids'] = [n['id'] for n in notes]
        out['systems'] = len(G['vocal']); out['G_staves'] = len(G['staves']); out['G_vocal'] = [int(v) for v in G['vocal']]
        out['vocalFallbacks'] = int(G.get('vocalFallbacks', 0))
    except Exception as e:
        out['run_error'] = repr(e)[:400]
        out['tb'] = traceback.format_exc()[-1500:]
    return json.dumps(out)
`);
  const probe = py.globals.get('probe');
  const results = [];
  for (let i = 0; i < pages.length; i++) {
    const u = Uint8Array.from(atob(pages[i]), c => c.charCodeAt(0));
    py.FS.writeFile(`/home/pyodide/p${i}.png`, u);
    const t = performance.now();
    const r = JSON.parse(probe(`/home/pyodide/p${i}.png`, sign, line, key, ''));
    r.wallS = (performance.now() - t) / 1000;
    results.push(r);
  }
  return { loadS, results };
}, { pages, sign, line, key });
fs.writeFileSync(out, JSON.stringify(res, null, 1));
for (const r of res.results) console.log(JSON.stringify({ ...r, ids: r.ids && r.ids.length, metres: r.metres && [...new Set(r.metres)], tb: undefined, staveCentres: undefined }));
console.log('pyodide load s', res.loadS);
await browser.close();
