const { createRequire } = require('module');
const req = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/package.json');
const { chromium } = req('@playwright/test');
const fs = require('fs'), os = require('os'), path = require('path');
const mode = process.argv[2]; // webgpu | wasm
const OUT = path.join(__dirname, 'out');
const PDF = '/Users/dannmitton/Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf';
(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pw-chrome-'));
  const ctx = await chromium.launchPersistentContext(dir, { channel: 'chrome', headless: false, viewport: { width: 1440, height: 900 } });
  const page = ctx.pages()[0] || await ctx.newPage();
  const logs = [];
  page.on('console', m => logs.push(`[${m.type()}] ${m.text()}`));
  await page.addInitScript((mode) => {
    window.__xml = []; window.__pages = [];
    const F = window.File;
    window.File = class extends F { constructor(parts, name, o) { super(parts, name, o); if (/\.musicxml$/.test(name)) { Promise.resolve(parts[0]).then(t => window.__xml.push(t)); } } };
    const W = window.Worker;
    window.Worker = class extends W { constructor(...a) { super(...a); this.addEventListener('message', e => { try { const d = e.data; const s = JSON.stringify(d); if (s && s.includes('<score-partwise')) window.__pages.push(typeof d === 'object' ? (d.musicXml || d.result?.musicXml || s) : s); } catch {} }); } };
    if (mode === 'wasm' && navigator.gpu) { navigator.gpu.requestAdapter = async () => null; }
  }, mode);
  await page.goto('http://localhost:5199/');
  await page.waitForSelector('input[type="file"].hidden-input', { state: 'attached', timeout: 120000 });
  const adapter = await page.evaluate(async () => {
    if (!navigator.gpu) return null;
    // the override (wasm mode) hides the real adapter; read it from the prototype
    const gp = Object.getPrototypeOf(navigator.gpu);
    const a = await gp.requestAdapter.call(navigator.gpu);
    if (!a) return { adapter: null };
    const info = a.info || (a.requestAdapterInfo && await a.requestAdapterInfo());
    return { vendor: info?.vendor, architecture: info?.architecture, features: [...a.features], f16: a.features.has('shader-f16') };
  });
  console.log('adapter', JSON.stringify(adapter));
  const t0 = Date.now();
  await page.locator('input[type="file"].hidden-input').setInputFiles(PDF);
  await page.locator('.receipt-score').waitFor({ timeout: 900000 });
  const wall = Date.now() - t0;
  await page.waitForTimeout(3000);
  const xml = await page.evaluate(() => window.__xml[0]);
  const pages = await page.evaluate(() => window.__pages);
  fs.writeFileSync(`${OUT}/${mode}.joined.musicxml`, xml || '');
  pages.forEach((p, i) => fs.writeFileSync(`${OUT}/${mode}.page${i + 1}.musicxml`, p));
  fs.writeFileSync(`${OUT}/${mode}.console.log`, logs.join('\n'));
  fs.writeFileSync(`${OUT}/${mode}.meta.json`, JSON.stringify({ adapter, wallMs: wall, nPages: pages.length }, null, 1));
  await page.getByRole('tab', { name: 'Markup' }).click().catch(e => console.log('tab click', e.message));
  await page.waitForTimeout(8000);
  await page.screenshot({ path: `${OUT}/${mode}.markup.png` });
  console.log(mode, 'wall ms', wall, 'pages captured', pages.length, 'xml len', (xml||'').length);
  console.log(logs.filter(l => l.includes('[omr]')).join('\n'));
  await ctx.close();
})().catch(e => { console.error(e); process.exit(1); });
