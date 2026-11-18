/**
 * ONE SET OF VALUES PER VOWEL (N.199 Step 1; `CONTRACT.md` section 4). The adapter's resolution of a voice's
 * stored readings into a fR1 and a fR2 for every vowel it can give one: take
 * every sung reading, at any count (lane 68); for a personal voice (five stable core vowels, `sung.ts`) derive the four derivable vowels from their anchors; and fill what is left from
 * Bozeman's staff, scaled to the singer (the tract scale, `stand-ins.ts`) when personal and the declared type's own, unscaled, when not. It stood inline in `analysis/analyze-score-adapter.ts`
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
import { isPersonal, isSung } from './sung';
import { fillStandIns, hasPlaceholderProfile, type Provenance, type StandInReport } from './stand-ins';

export interface ResolveOptions {
	/**
	 * When the stand-ins fill a voice that has sung nothing usable. `'declared-types'` (the adapter, and the default):
	 * only for a declared type that has a placeholder profile (`hasPlaceholderProfile`). `'always'` (the chart): for
	 * every voice, including no type, where `standInBucket` routes to the middle of the five staves.
	 */
	placeholders?: 'declared-types' | 'always';
}

export interface ResolvedValues {
	fR1: Record<string, number>;
	fR2: Record<string, number>;
	fR1Source: Record<string, Provenance>;
	fR2Source: Record<string, Provenance>;
	/** A sung fR1 exists (`isSung`). */
	anySung: boolean;
	/** QUEUE row 166's internal word: nothing sung (not one sampled vowel, lane 68), and the declared type has a placeholder profile. Under `'always'` it is still this, not "the stand-ins ran". */
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
	// EVERY SAMPLE COUNTS FROM THE FIRST (lane 68; Dann 2026-11-18 13:42: "we use whatever the user provides"). Every sampled reading enters, at any count. Five
	// stable core vowels (`sung.ts`, `isPersonal`) complete the profile: the sixth core vowel from the tract scale and the four hard vowels from sampled anchors. Below
	// five, the vowels not sampled are placeholders from the declared type's template, unscaled, and no hard vowel is built from a sampled anchor (`stand-ins.ts`).
	const formants = sampled;
	const personal = isPersonal(sampled);
	// fR1 per vowel from the measured formants. A vowel the singer never sang,
	// or a reading with no usable f1, contributes nothing: the engine already
	// omits any event whose vowel has no fR1, so silence here is honest.
	//
	// EVERY SUNG READING COUNTS (lane 66, Step 5; Dann 2026-11-13, `docs/memory/PRODUCT.md:1269-1273`: "The neighbourhood is a
	// description set beside the reading, never applied to it. It never demotes, discards, or blocks a reading."). The plausibility
	// verdict is stored by the wizard and gates nothing here: a reading judged implausible enters the
	// snapshot exactly as a kept one did. This replaces §B.4 (Dann, 2026-07-15), which excluded the number the guard judged
	// implausible; the ruling of 2026-11-13 supersedes it. A stand-in never replaces a sung reading ("a user-provided sample is real
	// data versus our placeholder data", `docs/memory/OPEN.md:3799`). The test of "sung" is `isSung` (`sung.ts`).
	//
	// `reading: 'provisional'` is a SIGNAL-QUALITY verdict, not a physical one (`analyze.ts` sets it from `confidence === 'low'`: no
	// stable window, a rejected detection, or SNR under 12 dB), and a noisy capture of an honest vowel is still an honest vowel.
	// Plausibility and confidence are orthogonal by ruling (`engine/types.ts`), and neither gates a number.
	//
	// The verdict (`plausibility`) is stored by the wizard and read by nothing here: a reading the guard never judged counts like any other.
	const fR1: Record<string, number> = {};
	// QUEUE row 12: where each number came from (`VoiceProfileSnapshot.fR1Source`).
	const fR1Source: Record<string, Provenance> = {};
	const fR2Source: Record<string, Provenance> = {};
	for (const [vowel, formant] of Object.entries(formants) as [Vowel, CalibratedFormant | undefined][]) {
		if (isSung(formant)) {
			fR1[vowel] = formant.f1;
			fR1Source[vowel] = 'sung';
		}
	}

	// fR2 per vowel, for the higher-voice second-resonance work. Mirrors the
	// fR1 gating (a sung reading, `isSung`) plus the f2-specific
	// quality: an `absent` read contributes nothing. `marginal` is KEPT, parallel
	// to fR1 keeping `provisional` above (a signal-quality verdict, not a physical
	// one); tighten this to `clear`-only if smoke shows marginal fR2 misfiring. A
	// vowel with no usable fR2 is omitted, so any fR2-based mark degrades to
	// nothing rather than guessing. A low voice may populate fR2 no event reaches:
	// honest and inert.
	const fR2: Record<string, number> = {};
	for (const [vowel, formant] of Object.entries(formants) as [Vowel, CalibratedFormant | undefined][]) {
		if (isSung(formant) && typeof formant.f2 === 'number' && formant.f2 > 0 && formant.f2Quality !== 'absent') {
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
	// one. `deriveFrom` gates every anchor on a sung reading with a positive f2 (`usableAnchor`),
	// and not on the plausibility verdict: a derived value rests on whatever the singer sang. The derived fR2 is gated as the measured fR2 loop is — the derived
	// reading carries no f2Quality, which means "not assessed" and passes, so
	// the live condition is a positive number.
	//
	// No anchor is itself derivable, and `formants` is the sampled map, so
	// nothing here derives from a derived value.
	// Only for a personal voice (lane 68, amendment 1): below five stable core vowels an unsampled hard vowel is a placeholder, derived from the template's anchors alone
	// in `fillStandIns`, so no value is built from a mix of a sampled anchor and a template anchor.
	for (const vowel of personal ? (Object.keys(DERIV_SOURCE) as Vowel[]) : []) {
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
	// Every gap the loops above left takes a stand-in from Bozeman's staff, flagged 'surrogate' (`stand-ins.ts`): scaled to the singer (the tract scale)
	// when the voice is personal, else the declared type's own, unscaled.
	//
	// QUEUE row 166 (Dann ratified 2026-10-31 13:19 to 13:21): with NO vowel sung, a declared
	// soprano, mezzo-soprano, tenor, baritone, or bass takes the template whole, every vowel
	// flagged 'surrogate' and `generic` true. Contralto, countertenor, bass-baritone,
	// "Not sure", and no type keep the page that says nothing was measured: DESK DEFAULT,
	// which row 167 lifts. Range, tessitura, and passaggio stay as typed, in the adapter.
	const anySung = Object.values(fR1Source).includes('sung');
	const generic = !anySung && hasPlaceholderProfile(voiceType);
	const standIns: StandInReport | undefined =
		anySung || generic || placeholders === 'always' ? fillStandIns({ fR1, fR2, fR1Source, fR2Source }, voiceType, personal) : undefined;

	return { fR1, fR2, fR1Source, fR2Source, anySung, generic, ...(standIns ? { standIns } : {}) };
}
