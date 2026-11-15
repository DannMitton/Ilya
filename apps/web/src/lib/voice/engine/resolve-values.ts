/**
 * ONE SET OF VALUES PER VOWEL (N.199 Step 1; `CONTRACT.md` section 4). The adapter's resolution of a voice's
 * stored readings into a fR1 and a fR2 for every vowel it can give one: judge what the guard never judged, take the
 * sung readings the guard allows, derive the four derivable vowels from their anchors, and fill what is left from
 * Bozeman's staff fitted to the singer. It stood inline in `analysis/analyze-score-adapter.ts`
 * (`buildVoiceProfileSnapshot`, from QUEUE row 11 through row 17 and row 166); it lives here so the forecast and the
 * calibration chart read one function, not two copies. Pure: no store, no DOM, nothing written to the stored profile.
 *
 * What depends on its agreeing with the other sites that compute these numbers: the wizard's roster and the
 * forecast showing one value for one vowel (N.109, `derivations.ts`); the chart's zone and the guard applying one
 * window (`plausibility.ts`, `windowFor`); the chart's placeholder and the forecast's stand-in being one number
 * (`stand-ins.ts`, `fillStandIns`).
 *
 * THE FLAG. The adapter withholds stand-ins from a voice that has sung nothing unless its declared type is one of
 * the five that have a placeholder profile (QUEUE row 166, `hasPlaceholderProfile`): contralto, countertenor,
 * bass-baritone, "Not sure", and no type keep the page that says nothing was measured. The calibration chart has no
 * such page to keep and shows a placeholder for every unsung vowel for every voice, so it asks for `'always'`. The
 * adapter asks for `'declared-types'`, today's rule, and its output is unchanged (`adapter-golden.test.ts`).
 */
import type { CalibratedFormant, Vowel } from './types';
import { DERIV_SOURCE, deriveFrom } from './derivations';
import { checkPlausibility, isUsable } from './plausibility';
import { fillStandIns, hasPlaceholderProfile, type Provenance, type StandInReport } from './stand-ins';

/** The six vowels the guard judges against Bozeman's bands; the other four are judged against windows derived from these. */
const BOZEMAN_VOWELS: readonly Vowel[] = ['i', 'e', 'ɛ', 'ɑ', 'o', 'u'];

/**
 * A VERDICT FOR EVERY STORED READING THE GUARD NEVER JUDGED (QUEUE row 11;
 * INBOX "I.N.110 candidate", 2026-09-02). The guard runs once, in the wizard,
 * on a just-captured reading (`CalibrationWizard.svelte`, `withPlausibility`),
 * so a reading stored before it existed, or by a build that dropped its
 * verdict (the E.26 note, b6d2828), carries none and passed every gate: Dann's
 * own [i] at 1063 Hz anchored [ɨ] and [ɪ] and Markup drew turning heads near B4.
 *
 * Here such a reading is judged as the wizard would judge it, with two
 * differences. NO VOICE TYPE: the union bands apply, the widest window, because
 * a declared voice type plays no part in choosing values (Dann, 2026-09-16,
 * INBOX `:179`); the union still fails 1063 Hz for [i]. AND TWO PASSES: the six
 * Bozeman vowels first, then the four anchor-derived ones against anchors that
 * carry a verdict other than implausible, so no derived window rests on an
 * unjudged anchor. A reading the singer kept (`plausibilityOverride`) keeps its
 * stored state and is not re-judged.
 *
 * Returns a judged COPY. Nothing is written to the stored profile: the
 * snapshot is computed per render, as every derived value here is.
 */
export function judgeUnchecked(formants: Partial<Record<Vowel, CalibratedFormant>>): Partial<Record<Vowel, CalibratedFormant>> {
	const out: Partial<Record<Vowel, CalibratedFormant>> = { ...formants };
	const unjudged = (f: CalibratedFormant | undefined): f is CalibratedFormant =>
		!!f && f.plausibility === undefined && f.plausibilityOverride !== true && typeof f.f1 === 'number' && f.f1 > 0 && f.reading !== 'estimated';
	for (const vowel of BOZEMAN_VOWELS) {
		const f = out[vowel];
		if (unjudged(f)) out[vowel] = { ...f, plausibility: checkPlausibility(f.f1, vowel).plausibility };
	}
	const anchorF1s: Partial<Record<Vowel, number>> = {};
	for (const vowel of BOZEMAN_VOWELS) {
		const f = out[vowel];
		if (f && typeof f.f1 === 'number' && f.f1 > 0 && f.reading !== 'estimated' && (f.plausibility === 'plausible' || f.plausibilityOverride === true)) {
			anchorF1s[vowel] = f.f1;
		}
	}
	for (const [vowel, f] of Object.entries(out) as [Vowel, CalibratedFormant | undefined][]) {
		if (BOZEMAN_VOWELS.includes(vowel) || !unjudged(f)) continue;
		out[vowel] = { ...f, plausibility: checkPlausibility(f.f1, vowel, undefined, anchorF1s).plausibility };
	}
	return out;
}

export interface ResolveOptions {
	/**
	 * When the stand-ins fill a voice that has sung nothing usable. `'declared-types'` (the adapter, and the default):
	 * only for a declared type that has a placeholder profile (`hasPlaceholderProfile`). `'always'` (the chart): for
	 * every voice, including no type, where `standInBucket` routes to the middle of the five staves.
	 */
	placeholders?: 'declared-types' | 'always';
}

export interface ResolvedValues {
	/** The judged copy of the sampled readings (`judgeUnchecked`). */
	formants: Partial<Record<Vowel, CalibratedFormant>>;
	fR1: Record<string, number>;
	fR2: Record<string, number>;
	fR1Source: Record<string, Provenance>;
	fR2Source: Record<string, Provenance>;
	/** Sampled vowels the guard judged implausible and the singer did not keep. */
	implausible: Vowel[];
	/** A usable sung fR1 exists. */
	anySung: boolean;
	/** QUEUE row 166's internal word: nothing sung, and the declared type has a placeholder profile. Under `'always'` it is still this, not "the stand-ins ran". */
	generic: boolean;
	/** What the stand-ins did; absent when they did not run. */
	standIns?: StandInReport;
}

export function resolveVowelValues(
	sampled: Partial<Record<Vowel, CalibratedFormant>>,
	voiceType?: string,
	options: ResolveOptions = {}
): ResolvedValues {
	const placeholders = options.placeholders ?? 'declared-types';
	// QUEUE row 11: every gate below, and `deriveFrom`, reads the judged copy.
	const formants = judgeUnchecked(sampled);
	// fR1 per vowel from the measured formants. A vowel the singer never sang,
	// or a reading with no usable f1, contributes nothing: the engine already
	// omits any event whose vowel has no fR1, so silence here is honest.
	//
	// §B.4 RULED (Dann, 2026-07-15): the same silence extends to a reading the
	// plausibility guard judged IMPLAUSIBLE, and to nothing else. Markup will not
	// build acoustic marks on a number the engine has already decided cannot be
	// that vowel (the motivating class: fR1 ≈ 1063 Hz extracted for a sung [i]).
	//
	// What is deliberately NOT excluded, and why: `reading: 'provisional'` is a
	// SIGNAL-QUALITY verdict, not a physical one. analyze.ts:30-34 sets it from
	// `confidence === 'low'`, which means no stable window, a rejected detection,
	// or SNR under 12 dB. A noisy capture of an honest vowel is still an honest
	// vowel, and analyze.ts:26-29 records that real-room captures land there
	// routinely. Excluding on `reading` would silently drop good data for any
	// singer without a quiet room. Plausibility and confidence are orthogonal by
	// ruling (engine/types.ts), and only plausibility speaks to whether the
	// number can be the vowel.
	//
	// `plausibility` absent means the guard never ran. Since QUEUE row 11 such a
	// reading is judged first (`judgeUnchecked`, above), so it reaches this gate
	// with a verdict. `unchecked`, the guard's own answer where no window exists,
	// is still kept: the tri-state ruling says absence of a window is not a failure.
	const fR1: Record<string, number> = {};
	// QUEUE row 12: where each number came from (`VoiceProfileSnapshot.fR1Source`).
	const fR1Source: Record<string, Provenance> = {};
	const fR2Source: Record<string, Provenance> = {};
	for (const [vowel, formant] of Object.entries(formants) as [Vowel, CalibratedFormant | undefined][]) {
		if (formant && typeof formant.f1 === 'number' && formant.f1 > 0 && isUsable(formant)) {
			fR1[vowel] = formant.f1;
			fR1Source[vowel] = 'sung';
		}
	}

	// fR2 per vowel, for the higher-voice second-resonance work. Mirrors the
	// fR1 gating (a positive number, not judged implausible) plus the f2-specific
	// quality: an `absent` read contributes nothing. `marginal` is KEPT, parallel
	// to fR1 keeping `provisional` above (a signal-quality verdict, not a physical
	// one); tighten this to `clear`-only if smoke shows marginal fR2 misfiring. A
	// vowel with no usable fR2 is omitted, so any fR2-based mark degrades to
	// nothing rather than guessing. A low voice may populate fR2 no event reaches:
	// honest and inert.
	const fR2: Record<string, number> = {};
	for (const [vowel, formant] of Object.entries(formants) as [Vowel, CalibratedFormant | undefined][]) {
		if (formant && typeof formant.f2 === 'number' && formant.f2 > 0 && formant.f2Quality !== 'absent' && isUsable(formant)) {
			fR2[vowel] = formant.f2;
			fR2Source[vowel] = 'sung';
		}
	}

	// N.109: the four derivable vowels reach the forecast too.
	//
	// The wizard's roster has always shown a derived fR1/fR2 for a challenging
	// vowel the singer never sang, greyed and labelled Estimated (Dann,
	// 2026-07-02). Its comment said the analysis layer used the same derive().
	// It did not: the two loops above read measured formants only, so a singer
	// who sang [i] and [u] saw an Estimated [ɨ] on the roster and got no
	// acoustic mark on a single [ɨ] in the score. The roster and the forecast
	// now read one anchor table and one usability gate (`deriveFrom`,
	// derivations.ts), so they cannot disagree, and the wizard's comment is
	// true.
	//
	// NOTHING IS WRITTEN TO THE STORED PROFILE. This is computed per snapshot,
	// from the sampled formants handed in. The standing rule holds unchanged:
	// the stored profile keeps only what was actually sung (Dann, 2026-07-02;
	// profileStore.ts's contract note), and a derived value is recomputed on
	// every render rather than persisted.
	//
	// A MEASURED READING ALWAYS WINS. Each channel is filled only where the
	// loops above left it empty, so a sung [ɨ] is never displaced by a derived
	// one. `deriveFrom` gates every anchor on a positive f1 and f2 and on the
	// plausibility guard's verdict, carrying §B.4 inward: the analysis will not build a
	// derived value on a number the engine has already decided cannot be that
	// vowel. The derived fR2 is gated as the measured fR2 loop is — the derived
	// reading carries no f2Quality and no plausibility, both of which mean "not
	// assessed" and pass, so the live condition is a positive number.
	//
	// No anchor is itself derivable, and `formants` is the sampled map, so
	// nothing here derives from a derived value.
	for (const vowel of Object.keys(DERIV_SOURCE) as Vowel[]) {
		if (fR1[vowel] !== undefined && fR2[vowel] !== undefined) continue;
		const derived = deriveFrom(vowel, formants);
		if (!derived) continue;
		if (fR1[vowel] === undefined && typeof derived.f1 === 'number' && derived.f1 > 0) {
			fR1[vowel] = derived.f1;
			fR1Source[vowel] = 'derived';
		}
		if (fR2[vowel] === undefined && typeof derived.f2 === 'number' && derived.f2 > 0) {
			fR2[vowel] = derived.f2;
			fR2Source[vowel] = 'derived';
		}
	}

	// QUEUE row 17: no vowel left blank (Dann 2026-09-16; the method ruled 2026-10-01 02:56).
	// Every gap the loops above left takes a stand-in from Bozeman's staff fitted to the
	// singer, flagged 'surrogate' (`stand-ins.ts`).
	//
	// QUEUE row 166 (Dann ratified 2026-10-31 13:19 to 13:21): with NO vowel sung, a declared
	// soprano, mezzo-soprano, tenor, baritone, or bass takes the template whole, every vowel
	// flagged 'surrogate' and `generic` true. Contralto, countertenor, bass-baritone,
	// "Not sure", and no type keep the page that says nothing was measured: DESK DEFAULT,
	// which row 167 lifts. Range, tessitura, and passaggio stay as typed, in the adapter.
	const implausible = (Object.entries(formants) as [Vowel, CalibratedFormant | undefined][])
		.filter(([, f]) => f && !isUsable(f))
		.map(([v]) => v);
	const anySung = Object.values(fR1Source).includes('sung');
	const generic = !anySung && hasPlaceholderProfile(voiceType);
	const standIns: StandInReport | undefined =
		anySung || generic || placeholders === 'always' ? fillStandIns({ fR1, fR2, fR1Source, fR2Source }, voiceType, implausible) : undefined;

	return { formants, fR1, fR2, fR1Source, fR2Source, implausible, anySung, generic, ...(standIns ? { standIns } : {}) };
}
