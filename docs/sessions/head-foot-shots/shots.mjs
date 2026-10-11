// Usage: node shots.mjs <outdir> <tag>   (tag: before|after)
import { chromium } from '/home/user/Ilya/apps/web/node_modules/@playwright/test/index.mjs';
import fs from 'fs'; import path from 'path';
const [outdir, tag] = process.argv.slice(2);
fs.mkdirSync(outdir, { recursive: true });
const FIXTURE = '/home/user/Ilya/apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml';
const P = (step, octave, alter = 0) => ({ step, octave, alter });
const FORMANTS = { i: [280, 2250], e: [400, 2100], 'ɪ': [330, 1900], 'ɨ': [350, 1500], 'ɛ': [520, 1800], a: [700, 1300], 'ɑ': [650, 1000], 'ʌ': [600, 1200], o: [450, 900], u: [320, 800] };
function storedVoice() {
  const formants = {};
  for (const [v, [f1, f2]] of Object.entries(FORMANTS)) formants[v] = { f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', plausibility: 'plausible' };
  const now = '2026-09-27T12:00:00.000Z';
  return { version: 2, activeId: 'v-test', voices: [{ id: 'v-test', name: 'Dann', createdAt: now, updatedAt: now, calibratedAt: now, formants, voiceType: 'bass',
    characteristics: { rangeLow: P('D', 2), rangeHigh: P('F', 4), tessituraLow: P('G', 2), tessituraHigh: P('D', 4), passaggioPrimary: P('A', 3), passaggioSecondary: P('E', 4, -1), source: 'manual' } }] };
}
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const report = [];
for (const lang of ['en', 'fr']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1300 } });
  const page = await ctx.newPage();
  await page.addInitScript(([l, s]) => { localStorage.setItem('ilya:language', l); localStorage.setItem('shane.profiles.v2', s); }, [lang, JSON.stringify(storedVoice())]);
  await page.goto('http://localhost:5173/');
  await page.locator('textarea.text-input').waitFor({ state: 'visible', timeout: 90000 });
  await page.waitForFunction(() => !document.querySelector('textarea.text-input')?.disabled, null, { timeout: 90000 });
  await page.locator('input[type="file"].hidden-input').setInputFiles(FIXTURE);
  await page.locator('.receipt-score').waitFor({ timeout: 30000 });
  for (const tab of ['text', 'markup', 'insights']) {
    await page.locator(`#tab-${tab}`).click();
    await page.waitForTimeout(4000);
    const pages = page.locator('.paper-page:visible');
    const n = await pages.count();
    report.push(`${lang} ${tab}: ${n} pages`);
    for (let i = 0; i < Math.min(2, n); i++) {
      await pages.nth(i).scrollIntoViewIfNeeded();
      await pages.nth(i).screenshot({ path: path.join(outdir, `${tag}-${tab}-p${i + 1}-${lang}.png`) });
    }
  }
  await ctx.close();
  // Without Sun no. 1 sets one Text page, so Text page 2 comes from its poem typed three times, with the same metadata typed into the drawer.
  {
    const c2 = await browser.newContext({ viewport: { width: 1440, height: 1300 } });
    const q = await c2.newPage();
    await q.addInitScript(([l]) => { localStorage.setItem('ilya:language', l); }, [lang]);
    await q.goto('http://localhost:5173/');
    await q.waitForFunction(() => document.querySelector('textarea.text-input') && !document.querySelector('textarea.text-input').disabled, null, { timeout: 90000 });
    const poem = `Комнатка тесная, тихая, милая;\nтень непроглядная, тень безответная;\nдума глубокая, песня унылая;\nв бьющемся сердце надежда заветная;\nбыстрый полёт за мгновеньем мгновения;\nвзор неподвижный на счастье далёкое;\nмного сомнения, много терпения.\nВот она, ночь моя, ночь одинокая.`;
    await q.locator('textarea.text-input').fill(poem + '\n\n' + poem + '\n\n' + poem);
    if (!(await q.locator('#station-metadata').count())) await q.locator('.group-piece button.band-toggle').click();
    const f = q.locator('#station-metadata input.meta-input');
    await f.nth(0).fill('Without Sun, no. 1: Within Four Walls');
    for (const [k, who] of [[3, 'Mussorgsky'], [4, 'Golenishchev']]) {
      await q.locator(`#station-metadata .meta-field-wrap:nth-child(${k}) button`).first().click();
      const inp = q.locator('input.select-search:visible').first();
      await inp.fill(who); await q.waitForTimeout(500);
      await inp.press('Enter'); await q.waitForTimeout(300);
    }
    await q.waitForTimeout(5000);
    const tp = q.locator('.paper-page:visible');
    const tn = await tp.count();
    report.push(`${lang} text, poem typed three times: ${tn} pages`);
    for (let i = 0; i < Math.min(2, tn); i++) { await tp.nth(i).scrollIntoViewIfNeeded(); await tp.nth(i).screenshot({ path: path.join(outdir, `${tag}-text-typed-p${i + 1}-${lang}.png`) }); }
    await c2.close();
  }

}
await browser.close();
console.log(report.join('\n'));
