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
 *    geometric centre of its band. That chart is fR1 only (Bozeman gives fR2 elsewhere: PVA 2nd ed. p. 35 and Fig. 5.3), so the fR2
 *    template is Mitton (2020) Table 5.3's fR2 for the six vowels (p. 81),
 *    scaled into the bucket by the geometric mean of the bucket's fR1 template
 *    over the bass bucket's (DESK DEFAULT in the brief, flagged).
 * 2. A PERSONAL VOICE (five of the six core vowels sung, `sung.ts`, `isPersonal`; lane 67) takes its missing core vowel from the singer's own tract:
 *    the `middle` template times one number, the tract scale k (`tractScale`), the geometric mean of the sung value over the shape's value, over every
 *    sung core vowel and both resonances where sung (quarter-wave reasoning: the vowels are shapes of one tract; Dann 2026-11-17 23:25). The shape is
 *    `middle` whatever the declared type, so the voice type's values never mix with the singer's own vowels. A sung core vowel with no usable fR2
 *    takes shape fR2 times k for that resonance only. No spread, no outlier removal: one number. (Before lane 67 a fitted shift and spread, with the
 *    off-shape vowels set aside for a retake; measured against it in `tools/n200-score/lane67-core.ts`.)
 * 3. A voice with nothing sung (or below five core vowels, which resolves as nothing sung) takes the declared type's template whole, as before.
 * 4. A sung value is never changed: sung beats derived beats surrogate.
 * 5. [ɨ], [ɪ], [ʌ], and [a] keep their derivations (`derivations.ts`), from
 *    the best anchors there are; one built on a stand-in anchor is itself a
 *    stand-in.
 *
 * Computed per snapshot and never stored (`CONTRACT.md` §6).
 */
import { CORE_BANDS, type BozemanVowel } from './plausibility';
import { DERIVE_ANCHORS, derive } from './derivations';
import type { Vowel } from './types';

export type StandInBucket = 'soprano' | 'tenor-mezzo' | 'baritone' | 'bass' | 'middle';
export type Provenance = 'sung' | 'derived' | 'surrogate';
/** The step that made a value: Dann's step 4, "every stand-in is flagged with the step that made it". */
export type StandInStep = 'template' | 'scale' | 'derived';

export const BOZEMAN_VOWELS: readonly BozemanVowel[] = ['i', 'e', 'ɛ', 'ɑ', 'o', 'u'];

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

/**
 * QUEUE row 166: the five declared types (Tier 1 ids, `voiceTypes.ts`) whose
 * stand-ins alone make a working profile, so INSIGHTS and MELODY can compute
 * from the template when nothing is sung. Contralto, countertenor,
 * bass-baritone, "Not sure", and no type are left out on purpose: they keep
 * the page that says nothing was measured until row 167 rules their staves
 * (DESK DEFAULT, Dann ratified the four profiles 2026-10-31 13:19 to 13:21).
 * The singer's word for these values is "placeholder"; "generic" is internal.
 */
export const PLACEHOLDER_PROFILE_TYPES = ['soprano', 'mezzo-soprano', 'tenor', 'baritone', 'bass'] as const;

/** Whether a declared type alone may stand in for a voice that has sung nothing usable. */
export function hasPlaceholderProfile(voiceType?: string): boolean {
	const t = (voiceType ?? '').trim().toLowerCase();
	return (PLACEHOLDER_PROFILE_TYPES as readonly string[]).includes(t);
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

type Shape = { f1: Record<BozemanVowel, number>; f2: Record<BozemanVowel, number> };

/**
 * THE TRACT SCALE k (lane 67): the geometric mean, over every sung core vowel and both resonances where sung, of the sung value over the shape's value. One
 * number per voice. `sungF1` and `sungF2` hold the sung values by core vowel (fR1 always; fR2 only where the resolver took it). NaN when nothing is sung.
 */
export function tractScale(sungF1: Partial<Record<BozemanVowel, number>>, sungF2: Partial<Record<BozemanVowel, number>>, shape: Shape): number {
	const logs: number[] = [];
	for (const v of BOZEMAN_VOWELS) {
		if (typeof sungF1[v] === 'number' && sungF1[v]! > 0) logs.push(Math.log(sungF1[v]! / shape.f1[v]));
		if (typeof sungF2[v] === 'number' && sungF2[v]! > 0) logs.push(Math.log(sungF2[v]! / shape.f2[v]));
	}
	return logs.length ? Math.exp(logs.reduce((a, x) => a + x, 0) / logs.length) : NaN;
}

export interface StandInInput {
	fR1: Record<string, number>;
	fR2: Record<string, number>;
	fR1Source: Record<string, Provenance>;
	fR2Source: Record<string, Provenance>;
}

export interface StandInReport {
	/** The shape the stand-ins came from: the declared type's staff for a voice with nothing sung, `middle` for a personal voice (scaled by the tract scale). */
	bucket: StandInBucket;
	/** The step that made each stand-in, by vowel. */
	steps: Record<string, StandInStep>;
}

/**
 * Fill every gap in the ten vowels. Mutates the four maps handed in (the
 * snapshot builder's own locals) and returns what it did. A sung or derived
 * value is never touched; only a vowel with no number gets one.
 */
export function fillStandIns(m: StandInInput, voiceType: string | undefined): StandInReport {
	const sungOf = (map: Record<string, number>, src: Record<string, Provenance>) => {
		const out: Partial<Record<BozemanVowel, number>> = {};
		for (const v of BOZEMAN_VOWELS) if (src[v] === 'sung' && map[v] > 0) out[v] = map[v];
		return out;
	};
	// A voice with sung core vowels is personal (the resolver sends nothing else here with anything sung): `middle` times the tract scale. Otherwise the type's template, whole.
	const k = tractScale(sungOf(m.fR1, m.fR1Source), sungOf(m.fR2, m.fR2Source), template('middle'));
	const scaled = Number.isFinite(k);
	const bucket: StandInBucket = scaled ? 'middle' : standInBucket(voiceType);
	const shape = template(bucket);
	const step: StandInStep = scaled ? 'scale' : 'template';
	const steps: Record<string, StandInStep> = {};
	for (const v of BOZEMAN_VOWELS) {
		if (m.fR1[v] === undefined) {
			m.fR1[v] = Math.round(shape.f1[v] * (scaled ? k : 1) * 10) / 10;
			m.fR1Source[v] = 'surrogate';
			steps[v] = step;
		}
		if (m.fR2[v] === undefined) {
			m.fR2[v] = Math.round(shape.f2[v] * (scaled ? k : 1) * 10) / 10;
			m.fR2Source[v] = 'surrogate';
			steps[v] ??= step;
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
	return { bucket, steps };
}
