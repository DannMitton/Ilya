// Usage: node shots66.mjs <outdir> <tag>
import { chromium } from '/home/user/Ilya/apps/web/node_modules/@playwright/test/index.mjs';
import fs from 'fs'; import path from 'path';
const [outdir, tag] = process.argv.slice(2);
fs.mkdirSync(outdir, { recursive: true });
const FIXTURE = '/home/user/Ilya/apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml';
const P = (step, octave, alter = 0) => ({ step, octave, alter });
const FORMANTS = { i: [280, 2250], e: [400, 2100], 'ɪ': [330, 1900], 'ɨ': [350, 1500], 'ɛ': [520, 1800], a: [700, 1300], 'ɑ': [650, 1000], 'ʌ': [600, 1200], o: [450, 900], u: [240, 800] };
const CASES = {
  quiet:    { rangeLow: P('B', 1, -1), rangeHigh: P('F', 4, 1), tessituraLow: P('D', 3), tessituraHigh: P('B', 3, -1), passaggioPrimary: P('A', 3), passaggioSecondary: P('D', 4, 1), source: 'manual' },
  better:   { rangeLow: P('B', 1, -1), rangeHigh: P('F', 4, 1), tessituraLow: P('B', 2), tessituraHigh: P('B', 3, -1), passaggioPrimary: P('A', 3), passaggioSecondary: P('D', 4, 1), source: 'manual' },
  unlikely: { rangeLow: P('D', 2), rangeHigh: P('C', 4), tessituraLow: P('B', 2), tessituraHigh: P('A', 3), passaggioPrimary: P('G', 3), passaggioSecondary: P('C', 4), source: 'manual' },
};
function store(ch) {
  const formants = {};
  for (const [v, [f1, f2]] of Object.entries(FORMANTS)) formants[v] = { f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', plausibility: 'plausible' };
  const now = '2026-09-27T12:00:00.000Z';
  return { version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Dann', createdAt: now, updatedAt: now, calibratedAt: now, formants, voiceType: 'bass', characteristics: ch }] };
}
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const report = [];
const runs = [['quiet', 'en', false], ['better', 'en', false], ['unlikely', 'en', false], ['unlikely', 'fr', false], ['unlikely', 'en', true]];
for (const [name, lang, phone] of runs) {
  const ctx = await browser.newContext(phone ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true } : { viewport: { width: 1440, height: 1300 } });
  const page = await ctx.newPage();
  await page.addInitScript(([l, s]) => { localStorage.setItem('ilya:language', l); localStorage.setItem('shane.profiles.v2', s); }, [lang, JSON.stringify(store(CASES[name]))]);
  await page.goto('http://localhost:5173/');
  await page.waitForFunction(() => document.querySelector('input[type="file"].hidden-input'), null, { timeout: 90000 });
  await page.waitForTimeout(phone ? 4000 : 1000);
  await page.locator('input[type="file"].hidden-input').setInputFiles(FIXTURE);
  await page.waitForTimeout(6000);
  await page.evaluate(() => document.querySelector('#tab-insights')?.click());
  await page.waitForTimeout(5000);
  await page.addStyleTag({ content: '.desk-head{visibility:hidden !important}' });
  // The phone's column is captured piece by piece: a screenshot of one element taller than the viewport comes back blank.
  const pages = phone ? page.locator('.insights-flow .flow-head:visible, .insights-flow .flow-body > *:visible, .insights-flow .flow-foot:visible, .insights-container .paper-page:visible') : page.locator('.insights-container .paper-page:visible');
  const n = await pages.count();
  report.push(`${name} ${lang}${phone ? ' phone' : ''}: ${n} pages`);
  for (let i = 0; i < n; i++) {
    await pages.nth(i).scrollIntoViewIfNeeded();
    await pages.nth(i).screenshot({ path: path.join(outdir, `${tag}-${name}-${lang}${phone ? '-phone' : ''}-p${i + 1}.png`) });
  }

  await ctx.close();
}
await browser.close();
console.log(report.join('\n'));
