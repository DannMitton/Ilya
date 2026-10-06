// node measure.cjs <profile> <label> [reload-count]  ; BASE env picks the server
const { open, vault, BASE } = require('./lib.cjs');
const fs = require('fs');
const [profile, label] = process.argv.slice(2);
(async () => {
  const { ctx, page, logs } = await open(profile);
  const t0 = Date.now();
  await page.goto(BASE, { waitUntil: 'commit' });
  await page.waitForSelector('[role=tab]', { timeout: 120000 });
  await page.getByRole('tab', { name: 'Markup' }).click();
  await page.waitForFunction(() => [...document.querySelectorAll('svg[data-score-page]')].length > 0 && document.querySelectorAll('svg[data-system]').length > 0, null, { timeout: 900000, polling: 100 });
  const drawn = Date.now() - t0;
  await page.waitForTimeout(4000);
  const facts = await page.evaluate(() => {
    const digits = (svg) => [...svg.querySelectorAll('text')].flatMap(t => [...t.textContent].map(c => c.codePointAt(0))).filter(c => c >= 0xE080 && c <= 0xE089).map(c => c - 0xE080).join('');
    const systems = [...document.querySelectorAll('svg[data-system]')].map(s => ({ range: s.getAttribute('data-system'), digits: digits(s) }));
    return { systems };
  });
  await page.screenshot({ path: `m/${label}.png` });
  const v = await vault(page);
  const kept = await page.evaluate(() => new Promise(res => { const r = indexedDB.open('ilya-library'); r.onsuccess = () => { const q = r.result.transaction('sources').objectStore('sources').getAll(); q.onsuccess = () => res((q.result[0] && q.result[0].reading && q.result[0].reading.musicXml) || null); }; }));
  if (kept) fs.writeFileSync(`m/${label}.kept.musicxml`, kept);
  const out = { label, drawnMs: drawn, firstSystemDigits: facts.systems[0]?.digits, systems: facts.systems.length, systemRanges: facts.systems.map(s => s.range).slice(0, 12), omrLines: logs.filter(l => l.includes('[omr]')), vault: v };
  fs.writeFileSync(`m/${label}.json`, JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out));
  await ctx.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
