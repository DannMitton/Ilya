/**
 * N.199 Step 2: the sheet, rendered on the server (no browser): what it draws for a stored profile, and what it must never say.
 * The pixels (letter page, legibility at 390 px and 484 px) are measured in the browser in Step 6.
 */
import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import type { CalibratedFormant, Vowel } from '../engine/types';
import { VOWELS } from '../engine/types';
import VowelSpaceSheet from './VowelSpaceSheet.svelte';
import { DRAFT } from './draft-strings';

const f = (f1: number, f2?: number): CalibratedFormant =>
	({ f1, ...(f2 === undefined ? {} : { f2 }), f2Quality: f2 === undefined ? 'absent' : 'clear', confidence: 'high', reading: 'captured', source: 'measured-user' }) as CalibratedFormant;
const BASS: Record<Vowel, CalibratedFormant> = {
	i: f(296, 1705), e: f(381, 1532), ɪ: f(393, 1600), ɨ: f(404, 1100), ɛ: f(577, 1311),
	a: f(711, 1113), ɑ: f(617, 1013), ʌ: f(616, 1167), o: f(489, 826), u: f(346, 804)
};
const pick = (...vs: Vowel[]) => Object.fromEntries(vs.map((v) => [v, BASS[v]])) as Partial<Record<Vowel, CalibratedFormant>>;
const html = (props: Record<string, unknown>) => render(VowelSpaceSheet, { props: { profile: {}, voiceType: 'bass', language: 'en', ...props } as never }).body;
const count = (h: string, re: RegExp) => (h.match(re) ?? []).length;

describe('the sheet', () => {
	it('draws a zone for each of the ten vowels, with nothing sung', () => {
		const h = html({});
		for (const v of VOWELS) expect(h).toContain(`data-zone="${v}"`);
		expect(count(h, /data-zone=/g)).toBe(10);
		expect(count(h, /data-placeholder=/g)).toBe(10);
		expect(count(h, /data-sung=/g)).toBe(0);
		expect(h).not.toContain('class="readings"');
	});

	it('draws a filled dot for each sung vowel and a hollow one for each not, never both for one vowel', () => {
		const h = html({ profile: pick('i', 'e', 'u') });
		expect(count(h, /data-sung=/g)).toBe(3);
		expect(count(h, /data-placeholder=/g)).toBe(7);
		for (const v of ['i', 'e', 'u'] as Vowel[]) expect(h).not.toContain(`data-placeholder="${v}"`);
	});

	it('dashes the hull until all ten are sung, then draws it whole', () => {
		const nine = html({ profile: pick('i', 'e', 'ɪ', 'ɨ', 'ɛ', 'a', 'ɑ', 'ʌ', 'o') });
		expect(nine).toMatch(/class="[^"]*hull[^"]*dashed/);
		const ten = html({ profile: BASS });
		expect(ten).toMatch(/class="[^"]*hull/);
		expect(ten).not.toMatch(/class="[^"]*hull[^"]*dashed/);
		expect(count(ten, /data-placeholder=/g)).toBe(0);
		// With two sung there is no hull at all.
		expect(html({ profile: pick('i', 'u') })).not.toMatch(/<polygon/);
	});

	it('prints each reading as Hz, note, and signed cents, in Grayson’s order, and a missing fR2 as the tree’s Try again', () => {
		const h = html({ profile: { ...pick('u', 'i'), e: f(381) } });
		expect(h).toContain('296 Hz');
		expect(h).toContain('D4 +14');
		expect(h).toContain('Try again');
		const order = ['296 Hz', '381 Hz', '346 Hz'].map((s) => h.indexOf(s));
		expect(order).toEqual([...order].sort((a, b) => a - b));
		expect(order.every((i) => i > 0)).toBe(true);
	});

	it('carries the legend’s four entries, the provenance line, and the symbol for fR1 and fR2', () => {
		const h = html({ profile: pick('i') }).replace(/&#39;|&#x27;/g, "'");
		for (const k of ['sheet.legend.sung', 'sheet.legend.placeholder', 'sheet.legend.hull'] as const) expect(h).toContain(DRAFT[k]);
		expect(h).toContain('Bozeman');
		expect(h).toContain('p. 35');
		expect(h).toContain('Mitton (2020)');
		expect(h).toContain('aria-label="f R 1"');
		expect(h).toContain('aria-label="f R 2"');
	});

	it('says nothing that reads as a goal or a verdict', () => {
		const text = html({ profile: pick('i', 'e', 'u') }).replace(/<[^>]*>/g, ' ').toLowerCase();
		expect(text).not.toMatch(/\bgoals?\b|\btargets?\b|\bwrong\b|\bimplausible\b|\bfault/);
	});

	it('draws the print control only on the screen copy and only when handed a handler', () => {
		expect(html({})).not.toContain('sheet-print-btn');
		expect(html({ onprint: () => {} })).toContain('sheet-print-btn');
		expect(html({ onprint: () => {}, forPrint: true })).not.toContain('sheet-print-btn');
		expect(html({ forPrint: true })).toContain('for-print');
	});

	it('works for every voice type and none, with nothing sung (a placeholder for every voice)', () => {
		for (const voiceType of [undefined, 'soprano', 'mezzo-soprano', 'contralto', 'countertenor', 'tenor', 'baritone', 'bass-baritone', 'bass', 'not-sure']) {
			const h = html({ voiceType });
			expect(count(h, /data-placeholder=/g), String(voiceType)).toBe(10);
		}
	});

	it('names the voice when given one', () => {
		expect(html({ voiceName: 'Dann' })).toContain('Dann');
	});
});
