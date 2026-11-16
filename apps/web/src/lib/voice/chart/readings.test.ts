import { describe, expect, it } from 'vitest';
import type { CalibratedFormant, Vowel } from '../engine/types';
import { noteReading, readingListRows, summaryRows, readingRows, signedCents } from './readings';
import { computeZones } from './zones';
import { VOWELS } from '../engine/types';
import { TIER1 } from '../voiceTypes';

const f = (f1: number, f2?: number, extra: Partial<CalibratedFormant> = {}): CalibratedFormant =>
	({ f1, ...(f2 === undefined ? {} : { f2 }), confidence: 'high', reading: 'captured', source: 'measured-user', ...extra }) as CalibratedFormant;

describe('signed cents', () => {
	it('prints a plus, a true minus, and ±0', () => {
		expect(signedCents(16)).toBe('+16');
		expect(signedCents(-3)).toBe('−3');
		expect(signedCents(0)).toBe('±0');
		expect(signedCents(-3)).not.toContain('-');
	});
});

describe('a frequency as note and cents', () => {
	it('A4 at 440 Hz is A4 ±0', () => {
		const r = noteReading(440);
		expect([r.hzText, r.note, r.cents, r.centsText, r.text]).toEqual(['440', 'A4', 0, '±0', 'A4 ±0']);
	});
	it('D4 is 293.66 Hz: 296 Hz is D4 +14', () => {
		// 1200 * log2(296 / 293.6648) = 13.7, rounded to 14.
		expect(noteReading(296).text).toBe('D4 +14');
	});
	it('a reading below the nearest note carries a true minus', () => {
		// 381 Hz lies between F♯4 (369.99) and G4 (392.00); it is 49 cents under G4, so the nearest note is G4 and the cents are negative.
		const r = noteReading(381);
		expect(r.note).toBe('G4');
		expect(r.cents).toBe(-49);
		expect(r.centsText.startsWith('−')).toBe(true);
	});
	it('writes sharps with the sharp sign, as the pages do, and the digit flush to the name', () => {
		expect(noteReading(369.99).note).toBe('F♯4');
	});
	it('uses the same name in French (the page convention writes pitch as English does)', () => {
		expect(noteReading(440, 'fr').note).toBe('A4');
	});
	it('never prints −0', () => {
		for (const hz of [440, 440.01, 439.99, 261.63, 261.62, 261.64]) expect(noteReading(hz).centsText).not.toBe('−0');
	});
});

describe('the rows', () => {
	it('lists only sung vowels, in Grayson’s order, and leaves out an estimate', () => {
		const profile: Partial<Record<Vowel, CalibratedFormant>> = {
			u: f(346, 804),
			i: f(296, 1705),
			ɨ: f(404, 1100, { reading: 'estimated' }),
			ɛ: f(577, 1311, { reading: 'provisional', confidence: 'low' })
		};
		expect(readingRows(profile).map((r) => r.vowel)).toEqual(['i', 'ɛ', 'u']);
	});
	it('gives a reading with no fR2 no fR2 cell', () => {
		const [r] = readingRows({ e: f(381) });
		expect(r.fR1.hzText).toBe('381');
		expect(r.fR2).toBeUndefined();
	});
	it('is empty for an empty profile', () => {
		expect(readingRows({})).toEqual([]);
	});
});

describe('the capture screen’s readings list, as rows (readings brief, Step 1)', () => {
	// Sung and plausible; sung but far outside its zone; sung with no fR2; sung with a stored fR2 of 0; an estimate (not sung).
	const PROFILE: Partial<Record<Vowel, CalibratedFormant>> = {
		i: f(296, 1705),
		ɑ: f(1100, 2900),
		e: f(381),
		u: f(346, 0),
		o: f(489, 826, { reading: 'estimated' })
	};
	const listFor = (profile: Partial<Record<Vowel, CalibratedFormant>>, type?: string) =>
		readingListRows(profile, computeZones(profile, type).placeholders);

	for (const type of [...TIER1, undefined]) {
		it(`for ${type ?? 'no type'}: ten rows in the buttons' order; a sung vowel takes its stored values, a vowel not sung takes its placeholder's, the very number its hollow dot is drawn at`, () => {
			const rows = listFor(PROFILE, type);
			expect(rows.map((r) => r.vowel)).toEqual([...VOWELS]);
			const ph = computeZones(PROFILE, type).placeholders;
			for (const r of rows) {
				const stored = PROFILE[r.vowel];
				if (r.vowel === 'i' || r.vowel === 'ɑ' || r.vowel === 'e' || r.vowel === 'u') {
					expect(r.kind, r.vowel).toBe('sung');
					expect(r.fR1.hz).toBe(stored!.f1);
				} else {
					const p = ph.find((q) => q.vowel === r.vowel)!;
					expect(r.kind, r.vowel).toBe('placed');
					expect(r.fR1.hz).toBe(p.f1);
					expect(r.fR2!.hz).toBe(p.f2);
				}
			}
			// The estimate is not sung: a placeholder, whatever the profile stored under [o].
			expect(rows.find((r) => r.vowel === 'o')!.kind).toBe('placed');
		});
	}

	it('keeps a sung reading that lies far outside its zone, with its stored values', () => {
		const r = listFor(PROFILE, 'bass').find((x) => x.vowel === 'ɑ')!;
		expect([r.kind, r.fR1.hz, r.fR2!.hz]).toEqual(['sung', 1100, 2900]);
	});

	it('gives a sung reading with no usable fR2 no fR2, whether the field is absent or 0 (the chart’s test, f2 > 0): "0 Hz" is never a row', () => {
		const rows = listFor(PROFILE, 'bass');
		expect(rows.find((r) => r.vowel === 'e')!.fR2).toBeUndefined();
		expect(rows.find((r) => r.vowel === 'u')!.fR2).toBeUndefined();
	});

	it('is ten placeholders for an empty profile, and each is positive', () => {
		for (const type of [...TIER1, undefined]) {
			const rows = listFor({}, type);
			expect(rows).toHaveLength(10);
			for (const r of rows) {
				expect(r.kind).toBe('placed');
				expect(r.fR1.hz).toBeGreaterThan(0);
				expect(r.fR2!.hz).toBeGreaterThan(0);
			}
		}
	});

	it('leaves the sheet’s rows as they were: sung vowels only', () => {
		expect(readingRows(PROFILE).map((r) => r.vowel)).toEqual(['i', 'e', 'u', 'ɑ'].sort((a, b) => VOWELS.indexOf(a as Vowel) - VOWELS.indexOf(b as Vowel)));
	});

	it('has no row for a vowel with neither a sung reading nor a placeholder: nothing is invented', () => {
		expect(readingListRows({}, [])).toEqual([]);
	});
});

describe('the summary’s ten rows, with the roster’s marks (N.203 lane 60, Step 5)', () => {
	const profile: Partial<Record<Vowel, CalibratedFormant>> = {
		i: f(296, 1705, { reading: 'provisional' }),
		e: f(381, 1532, { plausibilityOverride: true }),
		o: f(489, 826, { noiseFloor: 'unmeasured' }),
		u: f(346, 804)
	};
	const ph = computeZones(profile, 'bass').placeholders;
	it('leaves readingListRows’ own output as the capture screen had it, and adds only marks', () => {
		const base = readingListRows(profile, ph);
		const rows = summaryRows(profile, ph);
		expect(rows.map(({ marks: _m, ...r }) => r)).toEqual(base);
	});
	it('marks a recorded vowel only where a mark applies, and never a placeholder', () => {
		const rows = summaryRows(profile, ph);
		const m = (v: Vowel) => rows.find((r) => r.vowel === v)!.marks;
		expect(m('i')).toEqual({ provisional: true, beyond: false, noiseFloorUnmeasured: false });
		expect(m('e')).toEqual({ provisional: false, beyond: true, noiseFloorUnmeasured: false });
		expect(m('o')).toEqual({ provisional: false, beyond: false, noiseFloorUnmeasured: true });
		expect(m('u')).toEqual({ provisional: false, beyond: false, noiseFloorUnmeasured: false });
		for (const r of rows.filter((x) => x.kind === 'placed')) expect(r.marks).toEqual({ provisional: false, beyond: false, noiseFloorUnmeasured: false });
	});
});
