/**
 * STAND-IN VOWEL VALUES: no vowel left blank (QUEUE row 17). Ruled by Dann
 * 2026-10-01 02:56 (`docs/memory/OPEN.md`, "THE STAND-IN VOWEL VALUES"):
 * "ok I rule in this design, with the voice-type mapping, as the method for
 * the stand-in values." It carries out his ruling of 2026-09-16 (`PRODUCT.md`,
 * "Ten vowels, Grayson's, and no others"): no vowel is ever blank; a gap is
 * filled from Bozeman, flagged, until the singer sings it. The brief is
 * `docs/sessions/brief-code-stand-in-vowels_r1_2026-10-01.md`.
 *
 * THE METHOD, in the ruling's steps:
 * 1. A TEMPLATE, the Bozeman staff for the singer's voice type ("Approximate
 *    First Formant Locations", *Practical Vocal Acoustics*, 2013), held in
 *    `plausibility.ts` as `CORE_BANDS`: each Bozeman vowel's value is the
 *    geometric centre of its band. Bozeman charts fR1 only, so the fR2
 *    template is Mitton (2020) Table 5.3's fR2 for the six vowels (p. 81),
 *    scaled into the bucket by the geometric mean of the bucket's fR1 template
 *    over the bass bucket's (DESK DEFAULT in the brief, flagged).
 * 2. ONE OR TWO SUNG VOWELS slide the whole template by their mean log offset,
 *    per resonance: uniform scaling (Anikin, Barreda & Reby 2024, *Behavior
 *    Research Methods* 56(6): 5588-5604).
 * 3. THREE OR MORE spanning the arc (one of [i] or [e], one of [ɛ] or [ɑ], one
 *    of [o] or [u]) also fit a spread about the mean by least squares in log
 *    frequency: the arc's height for fR1, the diagonal's slope for fR2. The
 *    desk's extension, ruled in by Dann 2026-10-01 02:56.
 * 4. A sung value is never changed: sung beats derived beats surrogate.
 * 5. A sung vowel more than `OFF_SHAPE_SEMITONES` from its fitted value is not
 *    absorbed: it leaves the fit and is reported as a retake candidate. Its
 *    stored reading is not touched.
 * 6. [ɨ], [ɪ], [ʌ], and [a] keep their derivations (`derivations.ts`), from
 *    the best anchors there are; one built on a stand-in anchor is itself a
 *    stand-in.
 *
 * Computed per snapshot and never stored (`CONTRACT.md` §6).
 */
import { CORE_BANDS, FLOOR_MARGIN_SEMITONES, type BozemanVowel } from './plausibility';
import { DERIVE_ANCHORS, derive } from './derivations';
import type { Vowel } from './types';

export type StandInBucket = 'soprano' | 'tenor-mezzo' | 'baritone' | 'bass' | 'middle';
export type Provenance = 'sung' | 'derived' | 'surrogate';
/** The step that made a value: Dann's step 4, "every stand-in is flagged with the step that made it". */
export type StandInStep = 'template' | 'shift' | 'shift-and-spread' | 'derived';

export const BOZEMAN_VOWELS: readonly BozemanVowel[] = ['i', 'e', 'ɛ', 'ɑ', 'o', 'u'];

/**
 * A sung vowel this far from its fitted value, in semitones, is reported for a
 * retake rather than absorbed. DESK DEFAULT in the brief, matching the guard's
 * floor margin (`plausibility.ts`, `FLOOR_MARGIN_SEMITONES`).
 */
export const OFF_SHAPE_SEMITONES = FLOOR_MARGIN_SEMITONES;

/** Mitton (2020), Table 5.3, p. 81: fR2 in Hz for the six Bozeman vowels, a bass's (read by the desk 2026-10-01). */
export const MITTON_FR2: Readonly<Record<BozemanVowel, number>> = { i: 1705, e: 1532, ɛ: 1311, ɑ: 1013, o: 826, u: 804 };

/**
 * The starting staff for a declared voice type (the ruling's mapping). Mezzo,
 * contralto, tenor, and countertenor share Bozeman's tenor-mezzo staff, which
 * agrees with the 2013 page's Mezzo and Tenor staves on every vowel Ilya uses.
 * COUNTERTENOR BY THE TRACT: DESK INFERENCE, flagged in the ruling. "Not sure"
 * or none: the middle of all five staves.
 */
export function standInBucket(voiceType?: string): StandInBucket {
	const t = (voiceType ?? '').trim().toLowerCase();
	if (t === 'soprano') return 'soprano';
	if (t === 'mezzo-soprano' || t === 'mezzo' || t === 'contralto' || t === 'tenor' || t === 'countertenor') return 'tenor-mezzo';
	if (t === 'baritone') return 'baritone';
	if (t === 'bass' || t === 'bass-baritone') return 'bass';
	return 'middle';
}

const geo = (xs: readonly number[]) => Math.exp(xs.reduce((a, x) => a + Math.log(x), 0) / xs.length);

/**
 * The template, fR1 and fR2, for a bucket. "The middle of all five" is the
 * geometric middle of Bozeman's five staves, where Mezzo and Tenor are the
 * one `tenor-mezzo` set counted for each (DESK DEFAULT: the ruling's five,
 * where the brief wrote four).
 */
export function template(bucket: StandInBucket): { f1: Record<BozemanVowel, number>; f2: Record<BozemanVowel, number> } {
	const centre = (b: keyof typeof CORE_BANDS, v: BozemanVowel) => Math.sqrt(CORE_BANDS[b][v][0] * CORE_BANDS[b][v][1]);
	const five: Array<keyof typeof CORE_BANDS> = ['soprano', 'tenor-mezzo', 'tenor-mezzo', 'baritone', 'bass'];
	const f1 = {} as Record<BozemanVowel, number>;
	for (const v of BOZEMAN_VOWELS) f1[v] = bucket === 'middle' ? geo(five.map((b) => centre(b, v))) : centre(bucket, v);
	const scale = geo(BOZEMAN_VOWELS.map((v) => f1[v] / centre('bass', v)));
	const f2 = {} as Record<BozemanVowel, number>;
	for (const v of BOZEMAN_VOWELS) f2[v] = MITTON_FR2[v] * scale;
	return { f1, f2 };
}

const spansArc = (vs: readonly BozemanVowel[]) =>
	vs.some((v) => v === 'i' || v === 'e') && vs.some((v) => v === 'ɛ' || v === 'ɑ') && vs.some((v) => v === 'o' || v === 'u');

/** A fitted resonance: the prediction for every Bozeman vowel, and the step that made it. */
export interface Fit {
	predict: Record<BozemanVowel, number>;
	step: 'template' | 'shift' | 'shift-and-spread';
	/** The sung vowels the fit used. */
	used: BozemanVowel[];
}

/**
 * Fit one resonance's template to the sung values. Shift alone for one or two,
 * or for three that do not span the arc; shift and spread for three or more
 * that do. In log frequency: x is the template, y the sung value; the spread is
 * the least-squares slope about the means, the shift the means' difference.
 */
export function fitResonance(tmpl: Record<BozemanVowel, number>, sung: Partial<Record<BozemanVowel, number>>): Fit {
	const used = BOZEMAN_VOWELS.filter((v) => typeof sung[v] === 'number' && sung[v]! > 0);
	if (used.length === 0) return { predict: { ...tmpl }, step: 'template', used };
	const xs = used.map((v) => Math.log(tmpl[v]));
	const ys = used.map((v) => Math.log(sung[v]!));
	const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
	const my = ys.reduce((a, b) => a + b, 0) / ys.length;
	let slope = 1;
	let step: Fit['step'] = 'shift';
	const sxx = xs.reduce((a, x) => a + (x - mx) ** 2, 0);
	if (used.length >= 3 && spansArc(used) && sxx > 1e-9) {
		slope = xs.reduce((a, x, k) => a + (x - mx) * (ys[k] - my), 0) / sxx;
		step = 'shift-and-spread';
	}
	const predict = {} as Record<BozemanVowel, number>;
	for (const v of BOZEMAN_VOWELS) predict[v] = Math.exp(my + slope * (Math.log(tmpl[v]) - mx));
	return { predict, step, used };
}

const semitones = (a: number, b: number) => 12 * Math.log2(a / b);

/**
 * Fit, then take out the worst sung vowel while it lies more than
 * `OFF_SHAPE_SEMITONES` from the fit, and fit again. Only with three or more
 * sung vowels: with two, nothing says which of them is off (DESK DEFAULT).
 */
export function fitWithoutOutliers(
	tmpl: Record<BozemanVowel, number>,
	sung: Partial<Record<BozemanVowel, number>>,
): { fit: Fit; offShape: Array<{ vowel: BozemanVowel; semitones: number }> } {
	const pool: Partial<Record<BozemanVowel, number>> = { ...sung };
	const offShape: Array<{ vowel: BozemanVowel; semitones: number }> = [];
	for (;;) {
		const fit = fitResonance(tmpl, pool);
		if (fit.used.length < 3) return { fit, offShape };
		let worst: { vowel: BozemanVowel; semitones: number } | null = null;
		for (const v of fit.used) {
			const d = semitones(pool[v]!, fit.predict[v]);
			if (!worst || Math.abs(d) > Math.abs(worst.semitones)) worst = { vowel: v, semitones: d };
		}
		if (!worst || Math.abs(worst.semitones) <= OFF_SHAPE_SEMITONES) return { fit, offShape };
		offShape.push(worst);
		delete pool[worst.vowel];
	}
}

export interface StandInInput {
	fR1: Record<string, number>;
	fR2: Record<string, number>;
	fR1Source: Record<string, Provenance>;
	fR2Source: Record<string, Provenance>;
}

export interface StandInReport {
	bucket: StandInBucket;
	/** The step that made each stand-in, by vowel. */
	steps: Record<string, StandInStep>;
	/** Sung vowels left out of the fit, to offer for a retake. */
	retake: Array<{ vowel: Vowel; reason: 'off-shape' | 'implausible'; semitones?: number }>;
}

/**
 * Fill every gap in the ten vowels. Mutates the four maps handed in (the
 * snapshot builder's own locals) and returns what it did. A sung or derived
 * value is never touched; only a vowel with no number gets one.
 */
export function fillStandIns(m: StandInInput, voiceType: string | undefined, implausible: readonly Vowel[] = []): StandInReport {
	const bucket = standInBucket(voiceType);
	const tmpl = template(bucket);
	const steps: Record<string, StandInStep> = {};
	const sungOf = (map: Record<string, number>, src: Record<string, Provenance>) => {
		const out: Partial<Record<BozemanVowel, number>> = {};
		for (const v of BOZEMAN_VOWELS) if (src[v] === 'sung' && map[v] > 0) out[v] = map[v];
		return out;
	};
	const r1 = fitWithoutOutliers(tmpl.f1, sungOf(m.fR1, m.fR1Source));
	const r2 = fitWithoutOutliers(tmpl.f2, sungOf(m.fR2, m.fR2Source));
	for (const v of BOZEMAN_VOWELS) {
		if (m.fR1[v] === undefined) {
			m.fR1[v] = Math.round(r1.fit.predict[v] * 10) / 10;
			m.fR1Source[v] = 'surrogate';
			steps[v] = r1.fit.step;
		}
		if (m.fR2[v] === undefined) {
			m.fR2[v] = Math.round(r2.fit.predict[v] * 10) / 10;
			m.fR2Source[v] = 'surrogate';
			steps[v] ??= r2.fit.step;
		}
	}
	// The four derived vowels, from whatever anchors now stand; a stand-in anchor makes a stand-in.
	for (const [vowel, anchors] of Object.entries(DERIVE_ANCHORS) as [Vowel, Vowel[]][]) {
		if (m.fR1[vowel] !== undefined && m.fR2[vowel] !== undefined) continue;
		const cap: Record<string, { f1: number; f2: number }> = {};
		for (const a of anchors) cap[a] = { f1: m.fR1[a], f2: m.fR2[a] };
		const d = derive(vowel, cap);
		if (!d) continue;
		const fromStandIn = anchors.some((a) => m.fR1Source[a] === 'surrogate' || m.fR2Source[a] === 'surrogate');
		const src: Provenance = fromStandIn ? 'surrogate' : 'derived';
		if (m.fR1[vowel] === undefined) {
			m.fR1[vowel] = d.f1;
			m.fR1Source[vowel] = src;
		}
		if (m.fR2[vowel] === undefined) {
			m.fR2[vowel] = d.f2 as number;
			m.fR2Source[vowel] = src;
		}
		steps[vowel] = 'derived';
	}
	const retake: StandInReport['retake'] = [
		...implausible.map((vowel) => ({ vowel, reason: 'implausible' as const })),
		...r1.offShape.map((o) => ({ vowel: o.vowel as Vowel, reason: 'off-shape' as const, semitones: Math.round(o.semitones * 10) / 10 })),
	];
	return { bucket, steps, retake };
}
