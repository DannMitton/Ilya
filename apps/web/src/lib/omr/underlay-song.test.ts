/**
 * applyUnderlay: a song's words are written only when every page answered and
 * passed. The rest of the proof, through the join, is in
 * `underlay-integration.test.ts`.
 */
import { describe, expect, it } from 'vitest';
import { applyUnderlay } from './underlay-song';
import type { UnderlayPage } from './underlay-page';

const xml = (n: number) => `<score-partwise><part id="P1"><measure number="1"><note><pitch/></note><note><pitch/></note></measure></part></score-partwise>#${n}`;
const stats = (unseated = 0) => ({ systems: 1, banded: 1, rows: 1, russianRows: 1, systemsRussian: 1, tokens: 1, units: 1, cuts: { cut: 0, whole: 1, mismatched: 0 }, seated: 1, unseated, words: 1, known: 1 });
const page = (texts: string[], passes = true, unseated = 0): UnderlayPage => ({
	passes,
	why: passes ? null : 'system 1 has no Russian row',
	words: texts.map((text, i) => ({ syllables: [{ note: i, text, syllabic: 'single' as const, sustained: false }] })),
	stats: stats(unseated),
	ms: { prepare: 0, read: 0, seat: 0 },
});

describe('applyUnderlay', () => {
	it('writes the words of every page where every page passes, and says how many', () => {
		const out = applyUnderlay([xml(1), xml(2)], [page(['а', 'б']), page(['в'])]);
		expect(out.written).toBe(true);
		expect(out.syllables).toBe(3);
		expect(out.xmls[0]).toContain('<text>а</text>');
		expect(out.xmls[1]).toContain('<text>в</text>');
		expect(out.line).toBe('3 syllables written on 2 of 2 pages');
	});

	it('reports the unseated units', () => {
		expect(applyUnderlay([xml(1)], [page(['а'], true, 4)]).line).toBe('1 syllables written on 1 of 1 pages, 4 units left unseated');
	});

	it('writes nothing where any page fails, and returns the pages as they were', () => {
		const out = applyUnderlay([xml(1), xml(2)], [page(['а']), page(['б'], false)]);
		expect(out.written).toBe(false);
		expect(out.xmls).toEqual([xml(1), xml(2)]);
		expect(out.line).toBe('page 2 does not pass (system 1 has no Russian row), so the words are not written');
	});

	it('writes nothing where any page answered null', () => {
		const out = applyUnderlay([xml(1), xml(2)], [page(['а']), null]);
		expect(out).toMatchObject({ written: false, xmls: [xml(1), xml(2)], line: 'page 2 could not be read, so the words are not written' });
	});

	it('names the first page that fails, null before not passing', () => {
		expect(applyUnderlay([xml(1), xml(2)], [page(['а'], false), null]).line).toContain('page 2 could not be read');
	});

	it('writes nothing where no page has a word', () => {
		const out = applyUnderlay([xml(1)], [page([])]);
		expect(out.written).toBe(false);
		expect(out.line).toBe('no voice staff with words was found, so nothing is written');
	});

	it('counts the unseated units of the pages that answered, written or not', () => {
		expect(applyUnderlay([xml(1), xml(2)], [page(['а'], true, 2), null]).unseated).toBe(2);
	});

	it('leaves a page with no words as it is while it writes the others', () => {
		const out = applyUnderlay([xml(1), xml(2)], [page([]), page(['в'])]);
		expect(out.written).toBe(true);
		expect(out.xmls[0]).toBe(xml(1));
	});
});
