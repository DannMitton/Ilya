/**
 * Two tacet runs side by side (a meter or key change between tacet bars ends the first run) used to draw the first as
 * a sliver: the second column's advance did not pay the width the first one owes. Found on the strophic lane's tacet
 * fixture, where it showed at a pass boundary; the same defect stood in eight tracked measure fixtures.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser } from './musicxml-parser';
import { parseXml } from './mini-xml.test-support';
import { layoutColumns, TACET_REST } from './staff-renderer';

const ROOT = new URL('../../../', import.meta.url);
const FILES = [
	'docs/sessions/measure-final-test-set3_2026-10-11/ten/drops/S.musicxml',
	'docs/sessions/measure-m-p-r74_2026-10-11/step1/drops/L.musicxml',
	'docs/sessions/measure-m-p-r74_2026-10-11/step2/drops/I.musicxml',
	'docs/sessions/measure-m-p-r74_2026-10-11/step3on/drops/L.musicxml',
	'docs/sessions/measure-set3-four-below_2026-10-11/after/drops/L.musicxml',
	'docs/sessions/measure-set3-four-below_2026-10-11/after/drops/S.musicxml',
	'docs/sessions/measure-set3-four-below_2026-10-11/before/drops/S.musicxml',
	'docs/sessions/measure-set3-four-below_2026-10-11/superseded/after-first-ilya7/drops/S.musicxml',
];

describe('a tacet run that follows another pays the width the first owes', () => {
	it.each(FILES)('%s', async (f) => {
		const xml = readFileSync(new URL(f, ROOT), 'utf8');
		const score = (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document } as never)).score;
		const lineGap = 12;
		const { columns } = layoutColumns(score, { lineGap });
		const pairs = columns.flatMap((c, i) => (c.tacet && columns[i + 1]?.tacet ? [i + 1] : []));
		expect(pairs.length, 'the file has two tacet runs side by side').toBeGreaterThan(0);
		for (const i of pairs) expect(columns[i].advance).toBeGreaterThanOrEqual(TACET_REST.measureSp * lineGap);
	});
});
