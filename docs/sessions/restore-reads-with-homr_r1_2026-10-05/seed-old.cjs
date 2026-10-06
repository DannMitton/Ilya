const { open, vault, PDF, BASE } = require('./lib.cjs');
const profile = process.argv[2];
(async () => {
  const { ctx, page, logs } = await open(profile);
  await page.goto(BASE + '?reader=ilya');
  await page.waitForSelector('input[type="file"].hidden-input', { state: 'attached', timeout: 120000 });
  await page.locator('input[type="file"].hidden-input').setInputFiles(PDF);
  await page.getByRole('button', { name: /Read this page/ }).click({ timeout: 60000 });
  const t0 = Date.now();
  await page.locator('.receipt-score').waitFor({ timeout: 900000 });
  console.log('old reader read ms', Date.now() - t0);
  await page.waitForTimeout(3000);
  console.log(JSON.stringify(await vault(page)));
  await ctx.close();
})();
