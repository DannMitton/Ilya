// Row 57 r6 run 3: the count behind the "does not add up" words (r2 section 6), before and after, on the 17.
// Each joined reading is parsed by Ilya's MusicXmlScoreParser in the browser and summed by aggregatePhonation;
// untrustedBars is the count the Insights page names (insights.ts, untrustedMeasures).
// Usage: node addup.mjs <before dir> <after dir> <out.json>
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(path.resolve(process.env.HOME, 'Desktop/ilya-rewrite/apps/web/package.json'));
const { chromium } = require('@playwright/test');
const [bdir, adir, out] = process.argv.slice(2);
const SONGS = ['tch', 'sun1', 'sun4', 'sun5', 'sun6', 'k01', 'k02', 'k03', 'k04', 'k06', 'k07', 'k08', 'k09', 'k10', 'gur', 'grech', 'varl'];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await (await browser.newContext({ serviceWorkers: 'block' })).newPage();
await page.goto('http://localhost:5173/');
await page.waitForLoadState('networkidle');
const res = {};
for (const s of SONGS) {
	const xmls = [bdir, adir].map((d) => JSON.parse(fs.readFileSync(path.join(d, s + '.json'), 'utf8')).result.musicXml);
	res[s] = await page.evaluate(async (xmls) => {
		const sp = await import('/@fs/Users/dannmitton/Desktop/ilya-rewrite/packages/score-parser/src/index.ts');
		const out = [];
		for (const xml of xmls) {
			const score = (await new sp.MusicXmlScoreParser().parse({ format: 'musicxml', data: new DOMParser().parseFromString(xml, 'application/xml') })).score;
			const t = sp.aggregatePhonation(score);
			out.push({ untrusted: t.trust.untrustedBars, measures: t.trust.untrustedMeasureIndices });
		}
		return out;
	}, xmls);
	console.log(s, 'before', res[s][0].untrusted, 'after', res[s][1].untrusted);
}
fs.writeFileSync(out, JSON.stringify(res, null, 1));
await browser.close();
