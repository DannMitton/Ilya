// walk.mjs: walk a score file into Ilya's own page in a headless browser and keep pictures. A desk trial.
import { chromium } from '@playwright/test';
const [file, tag] = process.argv.slice(2);
const out = '/tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/walk/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
const logs = [];
page.on('console', (m) => { const t = m.text(); if (/Ilya|error|fail|warn/i.test(t)) logs.push(m.type() + ': ' + t.slice(0, 300)); });
page.on('pageerror', (e) => logs.push('pageerror: ' + String(e).slice(0, 300)));
await page.goto('http://localhost:5173/', { waitUntil: 'load' });
await page.locator('textarea.text-input').waitFor({ state: 'visible', timeout: 60000 });
await page.waitForFunction(() => !document.querySelector('textarea.text-input')?.disabled, null, { timeout: 90000 });
await page.locator('input[type="file"].hidden-input').setInputFiles(file);
let ok = true;
try { await page.locator('.receipt-score').waitFor({ state: 'visible', timeout: 20000 }); } catch (e) { ok = false; logs.push('no receipt-score'); }
try { await page.waitForSelector('[data-word-index="0-0"]', { timeout: 20000 }); } catch (e) { logs.push('no word 0-0'); }
await page.waitForTimeout(2500);
const ta = await page.locator('textarea.text-input').inputValue().catch(() => '');
const words = await page.locator('[data-word-index]').count();
await page.screenshot({ path: out + tag + '-1-after-upload.png' });
await page.screenshot({ path: out + tag + '-1-full.png', fullPage: true });
console.log(JSON.stringify({ tag, receipt: ok, words, poem: ta.slice(0, 400), poemLen: ta.length }, null, 1));
console.log(logs.slice(0, 25).join('\n'));
const info = await page.evaluate(() => ({
  buttons: [...document.querySelectorAll('button')].map((x) => (x.getAttribute('aria-label') || x.textContent || '').trim().slice(0, 40)).filter(Boolean).slice(0, 80),
  svgs: document.querySelectorAll('svg').length,
}));
console.log(JSON.stringify(info));
await b.close();
