import { raise } from './raise.mjs';
const { browser, page } = await raise({ width: 1400, height: 900 });
await page.emulateMedia({ media: 'print' });
console.log('print: .loupe display =', await page.locator('.loupe').evaluate((e) => getComputedStyle(e).display), '| header visible =', await page.locator('.loupe-header').isVisible());
await browser.close();
