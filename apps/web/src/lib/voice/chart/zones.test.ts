/**
 * N.199 Step 1: the zones and the placeholder dots. The load-bearing facts: the zone's fR1 window IS the guard's; the
 * zones the voice type fixes do not move as vowels are sung; the placeholders do.
 */
import { describe, expect, it } from 'vitest';
import { VOWELS, type CalibratedFormant, type Vowel } from '../engine/types';
import { anchorF1sFor, checkPlausibility, windowFor } from '../engine/plausibility';
import { resolveVowelValues } from '../engine/resolve-values';
import { FR2_HALF_SPAN_SEMITONES, computeZones, type Zone } from './zones';

const f = (f1: number, f2: number): CalibratedFormant => ({ f1, f2, f2Quality: 'clear', confidence: 'high', reading: 'captured', source: 'measured-user' }) as CalibratedFormant;
const BASS: Record<Vowel, CalibratedFormant> = {
	i: f(296, 1705), e: f(381, 1532), ɪ: f(393, 1600), ɨ: f(404, 1100), ɛ: f(577, 1311),
	a: f(711, 1113), ɑ: f(617, 1013), ʌ: f(616, 1167), o: f(489, 826), u: f(346, 804),
};
const sung = (...vs: Vowel[]) => Object.fromEntries(vs.map((v) => [v, BASS[v]])) as Partial<Record<Vowel, CalibratedFormant>>;
const TYPES: Array<string | undefined> = [undefined, 'soprano', 'mezzo-soprano', 'contralto', 'tenor', 'countertenor', 'baritone', 'bass-baritone', 'bass', 'not-sure'];
const BOZ: Vowel[] = ['i', 'e', 'ɛ', 'ɑ', 'o', 'u'];
const PERSONAL: Vowel[] = ['ɪ', 'ɨ', 'a', 'ʌ'];
const byVowel = (zs: Zone[]) => Object.fromEntries(zs.map((z) => [z.vowel, z])) as Record<Vowel, Zone>;

describe('the zone set', () => {
	it('has ten zones in Grayson’s order, and a placeholder for each vowel not sung', () => {
		const { zones, placeholders } = computeZones(sung('i', 'e'), 'bass');
		expect(zones.map((z) => z.vowel)).toEqual([...VOWELS]);
		expect(placeholders.map((p) => p.vowel)).toEqual(VOWELS.filter((v) => v !== 'i' && v !== 'e'));
		expect(computeZones({}, 'bass').placeholders).toHaveLength(10);
		expect(computeZones(BASS, 'bass').placeholders).toHaveLength(0);
	});

	it('gives every zone the one fR2 half-height, a positive window, and a centre', () => {
		for (const type of TYPES) {
			for (const z of computeZones({}, type).zones) {
				expect(z.f2HalfSpanSemitones).toBe(FR2_HALF_SPAN_SEMITONES);
				expect(FR2_HALF_SPAN_SEMITONES).toBe(2.5);
				expect(z.f1High).toBeGreaterThan(z.f1Low);
				expect(z.f2Centre).toBeGreaterThan(0);
			}
		}
	});
});

describe('the zone’s fR1 window equals the guard’s', () => {
	// Every vowel, every bucket, no type; with nothing sung and with the five anchors sung.
	for (const type of TYPES) {
		for (const profile of [{}, sung('i', 'e', 'ɛ', 'ɑ', 'u'), BASS]) {
			it(`${type ?? 'no type'}, ${Object.keys(profile).length} sung`, () => {
				const anchors = anchorF1sFor(profile);
				for (const z of computeZones(profile, type).zones) {
					const w = windowFor(z.vowel, type, anchors);
					if (w) {
						expect(z.basis).toBe('guard');
						expect(z.f1Low).toBe(w.low);
						expect(z.f1High).toBe(w.high);
						// Behaviour, not only equality: a reading a hair inside the zone is plausible to the guard, a hair outside is not.
						expect(checkPlausibility(z.f1Low * 1.0002, z.vowel, type, anchors).plausibility).toBe('plausible');
						expect(checkPlausibility(z.f1High * 0.9998, z.vowel, type, anchors).plausibility).toBe('plausible');
						expect(checkPlausibility(z.f1Low * 0.9998, z.vowel, type, anchors).plausibility).toBe('implausible');
						expect(checkPlausibility(z.f1High * 1.0002, z.vowel, type, anchors).plausibility).toBe('implausible');
					} else {
						// No guard window: a personal vowel with no sung anchor, drawn on its placeholder, and never called the guard's.
						expect(PERSONAL).toContain(z.vowel);
						expect(z.basis).toBe('placeholder');
						expect(checkPlausibility(500, z.vowel, type, anchors).plausibility).toBe('unchecked');
					}
				}
			});
		}
	}

	it('a mutant margin fails: the bass [i] zone is D4 less three semitones to E4 plus two, in Hz', () => {
		const z = byVowel(computeZones({}, 'bass').zones).i;
		expect(z.f1Low).toBeCloseTo(246.94, 1);
		expect(z.f1High).toBeCloseTo(370.0, 0);
	});

	it('uses the union bands with no type, so [e] and [o] share one window', () => {
		const z = byVowel(computeZones({}, undefined).zones);
		expect(z.e.f1Low).toBe(z.o.f1Low);
		expect(z.e.f1High).toBe(z.o.f1High);
		expect(z.e.voiceTypeBucket).toBe('union');
		const b = byVowel(computeZones({}, 'bass').zones);
		expect(b.e.f1Low).toBe(b.o.f1Low); // the bass bands for [e] and [o] are in fact the same
		const s = byVowel(computeZones({}, 'soprano').zones);
		expect(s.i.f1Low).toBeGreaterThan(b.i.f1Low);
	});
});

describe('zones stay, placeholders move', () => {
	const ORDERS: Vowel[][] = [[], ['i'], ['i', 'e'], ['i', 'e', 'ɛ']];
	for (const type of ['bass', 'tenor', 'soprano', undefined] as Array<string | undefined>) {
		it(`${type ?? 'no type'}: the six Bozeman zones are the same after one, two, and three vowels are sung (a sung vowel 4 st off the template, so a fit that moved would show)`, () => {
			const first = byVowel(computeZones({}, type).zones);
			for (const vs of ORDERS) {
				// Shift every sung value up by four semitones so any fit would move.
				const shifted = Object.fromEntries(
					vs.map((v) => [v, { ...BASS[v], f1: BASS[v].f1 * 1.26, f2: BASS[v].f2! * 1.26 }])
				) as Partial<Record<Vowel, CalibratedFormant>>;
				const now = byVowel(computeZones(shifted, type).zones);
				for (const v of BOZ) expect(now[v], `${v} after ${vs.join('')}`).toEqual(first[v]);
			}
		});
	}

	it('the placeholder dots move after one, two, and three sung vowels', () => {
		// Different offsets per vowel, so the fit's mean offset differs at each step (one common factor would not move it).
		const OFFSET: Partial<Record<Vowel, number>> = { i: 1.3, e: 1.1, ɛ: 1.2 };
		const at = (vs: Vowel[]) => {
			const shifted = Object.fromEntries(vs.map((v) => [v, { ...BASS[v], f1: BASS[v].f1 * OFFSET[v]!, f2: BASS[v].f2! * OFFSET[v]! }])) as Partial<Record<Vowel, CalibratedFormant>>;
			return Object.fromEntries(computeZones(shifted, 'bass').placeholders.map((p) => [p.vowel, p]));
		};
		const p0 = at([]);
		const p1 = at(['i']);
		const p2 = at(['i', 'e']);
		const p3 = at(['i', 'e', 'ɛ']);
		// ɑ is unsung in all four: its placeholder is a fit of what is sung, so it differs at each step, in both resonances.
		const seq = [p0, p1, p2, p3].map((p) => p.ɑ);
		for (let k = 1; k < seq.length; k++) {
			expect(seq[k].f1, `fR1 step ${k}`).not.toBe(seq[k - 1].f1);
			expect(seq[k].f2, `fR2 step ${k}`).not.toBe(seq[k - 1].f2);
		}
		// The shift is toward the singer's higher values.
		expect(p3.ɑ.f1).toBeGreaterThan(p0.ɑ.f1);
		// A sung vowel has no placeholder.
		expect(p1.i).toBeUndefined();
		expect(p3.e).toBeUndefined();
	});

	it('equals the forecast’s value: the placeholder is `resolveVowelValues`’s, not a second computation', () => {
		const profile = sung('i', 'u');
		const r = resolveVowelValues(profile, 'bass', { placeholders: 'always' });
		for (const p of computeZones(profile, 'bass').placeholders) {
			expect(p.f1).toBe(r.fR1[p.vowel]);
			expect(p.f2).toBe(r.fR2[p.vowel]);
		}
	});

	it('marks derived placeholders derived and the rest surrogate', () => {
		const ps = Object.fromEntries(computeZones(sung('i', 'u'), 'bass').placeholders.map((p) => [p.vowel, p.source]));
		expect(ps['ɨ']).toBe('derived');
		expect(ps.e).toBe('surrogate');
		expect(ps['ɪ']).toBe('surrogate'); // built on a stand-in [e]
	});
});

describe('the personal vowels', () => {
	it('draw on their placeholder with the same margins until an anchor is sung, then take the guard’s window', () => {
		const before = byVowel(computeZones({}, 'bass').zones)['ɨ'];
		expect(before.basis).toBe('placeholder');
		const after = byVowel(computeZones(sung('i'), 'bass').zones)['ɨ'];
		expect(after.basis).toBe('guard');
		const w = windowFor('ɨ', 'bass', { i: 296 })!;
		expect([after.f1Low, after.f1High]).toEqual([w.low, w.high]);
		// [ɨ] needs [i]; [ɪ] needs [e]; [a] and [ʌ] need [ɑ].
		expect(byVowel(computeZones(sung('i'), 'bass').zones)['ɪ'].basis).toBe('placeholder');
		expect(byVowel(computeZones(sung('e'), 'bass').zones)['ɪ'].basis).toBe('guard');
		expect(byVowel(computeZones(sung('ɑ'), 'bass').zones)['a'].basis).toBe('guard');
		expect(byVowel(computeZones(sung('ɑ'), 'bass').zones)['ʌ'].basis).toBe('guard');
	});

	it('the placeholder-basis window is the placeholder with the guard’s margins, both sides of its value', () => {
		const z = byVowel(computeZones({}, 'bass').zones)['ɨ'];
		const v = resolveVowelValues({}, 'bass', { placeholders: 'always' }).fR1['ɨ'];
		expect(z.f1Low).toBeCloseTo(v / Math.pow(2, 3 / 12), 6);
		expect(z.f1High).toBeCloseTo(v * Math.pow(2, 2 / 12), 6);
	});
});

describe('the chart shows a placeholder for every voice (the one computation this changes)', () => {
	it('for contralto, countertenor, bass-baritone, not sure, and no type, with nothing sung', () => {
		for (const type of ['contralto', 'countertenor', 'bass-baritone', 'not-sure', undefined]) {
			const { zones, placeholders } = computeZones({}, type);
			expect(zones).toHaveLength(10);
			expect(placeholders, String(type)).toHaveLength(10);
			for (const p of placeholders) {
				expect(p.f1).toBeGreaterThan(0);
				expect(p.f2).toBeGreaterThan(0);
			}
		}
	});
});
