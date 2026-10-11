/**
 * QUEUE row 17: stand-in vowel values, the tests the brief names. Expected
 * values are computed here from the template and the test's own inputs, never
 * read back from the module under test.
 */
import { describe, expect, it } from 'vitest';
import { VOWELS, type Vowel } from './types';
import { CORE_BANDS } from './plausibility';
import { BOZEMAN_VOWELS, MITTON_FR2, fillStandIns, fitResonance, standInBucket, template, type Provenance } from './stand-ins';

const centre = (b: keyof typeof CORE_BANDS, v: (typeof BOZEMAN_VOWELS)[number]) => Math.sqrt(CORE_BANDS[b][v][0] * CORE_BANDS[b][v][1]);

function maps(sung: Partial<Record<Vowel, [number, number]>>) {
	const fR1: Record<string, number> = {};
	const fR2: Record<string, number> = {};
	const fR1Source: Record<string, Provenance> = {};
	const fR2Source: Record<string, Provenance> = {};
	for (const [v, [f1, f2]] of Object.entries(sung)) {
		fR1[v] = f1;
		fR2[v] = f2;
		fR1Source[v] = 'sung';
		fR2Source[v] = 'sung';
	}
	return { fR1, fR2, fR1Source, fR2Source };
}

describe('the starting staff', () => {
	it('picks Bozeman’s staff from the declared voice type', () => {
		const cases: Array<[string | undefined, string]> = [
			['soprano', 'soprano'],
			['mezzo-soprano', 'tenor-mezzo'],
			['contralto', 'tenor-mezzo'],
			['tenor', 'tenor-mezzo'],
			['countertenor', 'tenor-mezzo'],
			['baritone', 'baritone'],
			['bass-baritone', 'bass'],
			['bass', 'bass'],
			['not-sure', 'middle'],
			[undefined, 'middle'],
		];
		for (const [type, bucket] of cases) expect(standInBucket(type), String(type)).toBe(bucket);
	});

	it('takes each Bozeman vowel’s template at its band’s geometric centre, and fR2 from Mitton (2020) scaled to the staff', () => {
		const bass = template('bass');
		for (const v of BOZEMAN_VOWELS) {
			expect(bass.f1[v]).toBeCloseTo(centre('bass', v), 6);
			expect(bass.f2[v]).toBeCloseTo(MITTON_FR2[v], 6); // the bass staff's scale is 1
		}
		const sop = template('soprano');
		const scale = Math.exp(BOZEMAN_VOWELS.reduce((a, v) => a + Math.log(centre('soprano', v) / centre('bass', v)), 0) / 6);
		expect(sop.f2.i).toBeCloseTo(MITTON_FR2.i * scale, 6);
	});
});

describe('no vowel left blank', () => {
	const allTen = (m: ReturnType<typeof maps>) => VOWELS.every((v) => m.fR1[v] > 0 && m.fR2[v] > 0);

	it('fills all ten from zero, one, two, and five sung vowels', () => {
		const sets: Array<Partial<Record<Vowel, [number, number]>>> = [
			{},
			{ i: [300, 2200] },
			{ i: [300, 2200], u: [330, 800] },
			{ i: [300, 2200], e: [420, 1900], ɛ: [540, 1600], ɑ: [640, 1050], u: [330, 800] },
		];
		for (const sung of sets) {
			const m = maps(sung);
			fillStandIns(m, 'bass');
			expect(allTen(m), JSON.stringify(sung)).toBe(true);
		}
	});

	it('never changes a sung value', () => {
		const sung = { i: [300, 2200], u: [330, 800] } as Partial<Record<Vowel, [number, number]>>;
		const m = maps(sung);
		fillStandIns(m, 'bass');
		expect([m.fR1.i, m.fR2.i, m.fR1.u, m.fR2.u]).toEqual([300, 2200, 330, 800]);
		expect([m.fR1Source.i, m.fR1Source.u]).toEqual(['sung', 'sung']);
	});

	it('flags a derivation built on a stand-in anchor as a stand-in', () => {
		// [ɨ] derives from [i] and [u]; only [i] is sung, so [u] is a stand-in and so is [ɨ].
		const m = maps({ i: [300, 2200] });
		const report = fillStandIns(m, 'bass');
		expect(m.fR1Source.u).toBe('surrogate');
		expect(m.fR1Source['ɨ']).toBe('surrogate');
		expect(report.steps['ɨ']).toBe('derived');
	});
});

describe('the fit', () => {
	it('slides the template by the mean log offset of two sung vowels', () => {
		const t = template('bass').f1;
		const sung = { i: 330, u: 300 };
		const shift = (Math.log(330 / t.i) + Math.log(300 / t.u)) / 2;
		const fit = fitResonance(t, sung);
		expect(fit.step).toBe('shift');
		for (const v of BOZEMAN_VOWELS) expect(fit.predict[v]).toBeCloseTo(t[v] * Math.exp(shift), 6);
	});

	it('recovers a known shift and spread from three vowels across the arc', () => {
		const t = template('baritone').f1;
		// A synthetic singer: log f = c + b (log T − m), with b = 1.3 and c, m chosen here.
		const m = Math.log(450);
		const c = Math.log(470);
		const b = 1.3;
		const truth = (v: (typeof BOZEMAN_VOWELS)[number]) => Math.exp(c + b * (Math.log(t[v]) - m));
		const fit = fitResonance(t, { i: truth('i'), ɑ: truth('ɑ'), u: truth('u') });
		expect(fit.step).toBe('shift-and-spread');
		for (const v of BOZEMAN_VOWELS) expect(fit.predict[v]).toBeCloseTo(truth(v), 6);
	});

	it('uses a shift alone for three vowels that do not span the arc', () => {
		const t = template('bass').f1;
		expect(fitResonance(t, { i: 300, e: 420, u: 330 }).step).toBe('shift');
	});
});
