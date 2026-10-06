const { open, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open(process.argv[2]);
  await page.goto(BASE); await page.waitForSelector('[role=tab]', { timeout: 120000 }); await page.waitForTimeout(2000);
  console.log(await page.evaluate(() => new Promise(res => { const r = indexedDB.open('ilya-library'); r.onsuccess = () => { const tx = r.result.transaction('sources', 'readwrite'); const st = tx.objectStore('sources'); st.getAll().onsuccess = e => { const x = e.target.result[0]; x.reading.stamp = 'homr-web@0.2.0-ilya.1/396'; st.put(x); }; tx.oncomplete = () => res('stamp changed'); }; })));
  await ctx.close();
})();
