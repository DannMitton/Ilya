/**
 * QUEUE row 17: stand-in vowel values, the tests the brief names. Expected
 * values are computed here from the template and the test's own inputs, never
 * read back from the module under test.
 */
import { describe, expect, it } from 'vitest';
import { VOWELS, type Vowel } from './types';
import { CORE_BANDS } from './plausibility';
import { derive } from './derivations';
import { BOZEMAN_VOWELS, MITTON_FR2, fillStandIns, standInBucket, template, tractScale, type Provenance } from './stand-ins';

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
			fillStandIns(m, 'bass', false);
			expect(allTen(m), JSON.stringify(sung)).toBe(true);
		}
	});

	it('never changes a sung value', () => {
		const sung = { i: [300, 2200], u: [330, 800] } as Partial<Record<Vowel, [number, number]>>;
		const m = maps(sung);
		fillStandIns(m, 'bass', false);
		expect([m.fR1.i, m.fR2.i, m.fR1.u, m.fR2.u]).toEqual([300, 2200, 330, 800]);
		expect([m.fR1Source.i, m.fR1Source.u]).toEqual(['sung', 'sung']);
	});

	it('flags a derivation built on a stand-in anchor as a stand-in', () => {
		// [ɨ] derives from [i] and [u]; only [i] is sung, so [u] is a stand-in and so is [ɨ].
		const m = maps({ i: [300, 2200] });
		const report = fillStandIns(m, 'bass', false);
		expect(m.fR1Source.u).toBe('surrogate');
		expect(m.fR1Source['ɨ']).toBe('surrogate');
		expect(report.steps['ɨ']).toBe('derived');
	});
});

describe('the tract scale (lane 67)', () => {
	const middle = template('middle');
	const sungOfShape = (scale: number, drop?: string) => {
		const sung: Partial<Record<Vowel, [number, number]>> = {};
		for (const v of BOZEMAN_VOWELS) if (v !== drop) sung[v] = [middle.f1[v] * scale, middle.f2[v] * scale];
		return sung;
	};

	it('is 1 for the shape itself and the ratio for the shape times a number, in either resonance alone', () => {
		expect(tractScale(middle.f1, middle.f2, middle)).toBeCloseTo(1, 10);
		expect(tractScale({ i: middle.f1.i * 1.2, u: middle.f1.u * 1.2 }, {}, middle)).toBeCloseTo(1.2, 10);
		expect(tractScale({}, { ɑ: middle.f2.ɑ * 0.9 }, middle)).toBeCloseTo(0.9, 10);
		expect(tractScale({}, {}, middle)).toBeNaN();
	});

	it('is the geometric mean of the ratios, both resonances where sung', () => {
		const k = tractScale({ i: middle.f1.i * 1.1, e: middle.f1.e * 1.3 }, { i: middle.f2.i * 1.2 }, middle);
		expect(k).toBeCloseTo(Math.exp((Math.log(1.1) + Math.log(1.3) + Math.log(1.2)) / 3), 10);
	});

	it('five sung core vowels give the sixth at the middle shape times k, in both resonances, whatever the declared type', () => {
		for (const type of ['bass', 'soprano', 'contralto', undefined, 'not-sure']) {
			const m = maps(sungOfShape(1.25, 'ɛ'));
			const report = fillStandIns(m, type, true);
			expect(m.fR1.ɛ, String(type)).toBeCloseTo(middle.f1.ɛ * 1.25, 0);
			expect(m.fR2.ɛ, String(type)).toBeCloseTo(middle.f2.ɛ * 1.25, 0);
			expect(m.fR1Source.ɛ).toBe('surrogate');
			expect(report.steps.ɛ).toBe('scale');
			expect(report.bucket).toBe('middle');
		}
	});

	it('takes no outlier out: one odd sung vowel moves k, and the missing vowel with it', () => {
		const even = maps(sungOfShape(1, 'ɛ'));
		fillStandIns(even, 'bass', true);
		const odd = maps({ ...sungOfShape(1, 'ɛ'), i: [middle.f1.i * 3, middle.f2.i] });
		const report = fillStandIns(odd, 'bass', true);
		expect(odd.fR1.ɛ).toBeGreaterThan(even.fR1.ɛ * 1.05);
		expect(Object.keys(report)).toEqual(['bucket', 'steps']); // no retake list
	});

	it('a sung core vowel with no usable fR2 takes shape fR2 times k for that resonance only', () => {
		const sung = sungOfShape(1.1);
		const m = maps(sung);
		delete m.fR2.e;
		delete m.fR2Source.e;
		fillStandIns(m, 'bass', true);
		expect(m.fR1Source.e).toBe('sung');
		expect(m.fR2Source.e).toBe('surrogate');
		expect(m.fR2.e).toBeCloseTo(middle.f2.e * 1.1, 0);
	});

	it('a voice with nothing sung takes the declared type\'s template whole', () => {
		const m = maps({});
		const report = fillStandIns(m, 'soprano', false);
		const t = template('soprano');
		expect(report.bucket).toBe('soprano');
		for (const v of BOZEMAN_VOWELS) { expect(m.fR1[v]).toBeCloseTo(t.f1[v], 0); expect(report.steps[v]).toBe('template'); }
	});

	it('the four derived vowels are still derived from sung anchors, and flagged as the anchors are', () => {
		const m = maps(sungOfShape(1.1));
		fillStandIns(m, 'bass', true);
		expect(m.fR1Source['ɨ']).toBe('derived');
		const missing = maps(sungOfShape(1.1, 'u'));
		fillStandIns(missing, 'bass', true);
		expect(missing.fR1Source['ɨ']).toBe('surrogate'); // built on the scaled [u]
	});
});

describe('a voice not yet personal (lane 68): every sample counts, the rest is the placeholder, nothing scaled', () => {
	const t = (b: Parameters<typeof template>[0]) => template(b);

	it('takes every missing core vowel from the declared type\'s template, unscaled, whatever the sampled ones are', () => {
		const m = maps({ i: [300, 2200], u: [330, 800], e: [900, 3000] });
		const report = fillStandIns(m, 'bass', false);
		const bass = t('bass');
		for (const v of ['ɛ', 'ɑ', 'o'] as const) {
			expect(m.fR1[v]).toBeCloseTo(bass.f1[v], 0);
			expect(m.fR2[v]).toBeCloseTo(bass.f2[v], 0);
			expect(m.fR1Source[v]).toBe('surrogate');
			expect(report.steps[v]).toBe('template');
		}
		expect(report.bucket).toBe('bass');
		expect([m.fR1.i, m.fR1.u, m.fR1.e, m.fR1Source.e]).toEqual([300, 330, 900, 'sung']);
	});

	it('a type with no placeholder profile uses its bucket: contralto and countertenor tenor-mezzo, bass-baritone bass, "Not sure" and none middle', () => {
		const want: Array<[string | undefined, Parameters<typeof template>[0]]> = [['contralto', 'tenor-mezzo'], ['countertenor', 'tenor-mezzo'], ['bass-baritone', 'bass'], ['not-sure', 'middle'], [undefined, 'middle']];
		for (const [type, bucket] of want) {
			const m = maps({ i: [300, 2200] });
			const report = fillStandIns(m, type, false);
			expect(report.bucket, String(type)).toBe(bucket);
			expect(m.fR1.u, String(type)).toBeCloseTo(t(bucket).f1.u, 0);
		}
	});

	it('derives an unsampled hard vowel from the template\'s anchors alone, never a mix with a sampled anchor', () => {
		const m = maps({ i: [300, 2200], u: [330, 800] });
		const report = fillStandIns(m, 'bass', false);
		const bass = t('bass');
		const expected = derive('ɨ', { i: { f1: bass.f1.i, f2: bass.f2.i }, u: { f1: bass.f1.u, f2: bass.f2.u } })!;
		expect(m.fR1['ɨ']).toBe(expected.f1);
		expect(m.fR2['ɨ']).toBe(expected.f2);
		expect(m.fR1Source['ɨ']).toBe('surrogate');
		expect(report.steps['ɨ']).toBe('derived');
	});

	it('uses a sampled hard vowel as sampled', () => {
		const m = maps({ ɨ: [350, 1300] });
		fillStandIns(m, 'baritone', false);
		expect([m.fR1['ɨ'], m.fR2['ɨ'], m.fR1Source['ɨ']]).toEqual([350, 1300, 'sung']);
	});
});
