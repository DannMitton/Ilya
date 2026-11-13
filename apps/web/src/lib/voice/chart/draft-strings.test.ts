import { describe, expect, it } from 'vitest';
import { DRAFT, ds } from './draft-strings';

describe('the draft words', () => {
	const all = Object.entries(DRAFT);
	it('has no em dash, no "goal", no "target", and no "held" (copy rules, AGENTS.md; brief section 1)', () => {
		for (const [k, v] of all) {
			expect(v, k).not.toContain('—');
			expect(v.toLowerCase(), k).not.toMatch(/\bgoals?\b|\btargets?\b|\bheld\b/);
		}
	});
	it('names the legend’s four entries and the provenance with the sources the brief requires', () => {
		expect(DRAFT['sheet.provenance']).toContain('Bozeman');
		expect(DRAFT['sheet.provenance']).toContain('p. 35');
		expect(DRAFT['sheet.provenance']).toContain('Mitton (2020)');
		expect(DRAFT['sheet.provenance']).toContain('Ilya’s own estimate');
	});
	it('uses Canadian spelling where it matters here (neighbourhood, colour)', () => {
		expect(DRAFT['sheet.legend.zones']).toContain('neighbourhood');
		expect(DRAFT['sheet.legend.zones']).toContain('colour');
		for (const [k, v] of all) expect(v, k).not.toMatch(/neighborhood|\bcolor\b/);
	});
	it('fills placeholders', () => {
		expect(ds('sheet.title')).toBe('Your vowel space');
	});
});
