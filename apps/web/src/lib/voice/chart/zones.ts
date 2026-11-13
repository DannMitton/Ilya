/**
 * THE CHART'S NUMBERS (N.199 Step 1). For each of the ten vowels, the zone the chart draws and, for each vowel not
 * yet sung, the placeholder dot. Nothing here draws; `geometry.ts` turns these into a view and `VowelChart.svelte`
 * (Step 4a) turns that into pixels.
 *
 * ONE WINDOW. The zone's fR1 extent is the plausibility guard's window, from the same function and the same inputs the
 * wizard gives it at `CalibrationWizard.svelte`'s `withPlausibility` (`windowFor` in `engine/plausibility.ts`, the
 * declared type, and `anchorF1sFor(profile)`). The zone a singer sees is the window the guard applies.
 *
 *   - The six Bozeman vowels [i e ɛ ɑ o u]: the band fixed by the declared voice type, margins applied; with no type,
 *     the union bands. It does not move when vowels are sung (Dann 2026-11-12 23:49, "1"; 2026-11-13 00:04).
 *   - The four personal vowels [ɪ ɨ a ʌ]: the guard centres their window on the singer's own anchors
 *     (`expectedF1`). With an anchor sung, the zone IS that window (`basis: 'guard'`) and so moves once, when the
 *     anchor arrives. With none, the guard has no window ("unchecked"); the zone is then drawn around the type's
 *     placeholder value with the same margins and carries `basis: 'placeholder'`, so the legend never calls it the
 *     guard's.
 *
 * ONE SET OF VALUES. The fR2 centre and every placeholder dot come from `resolveVowelValues` with
 * `placeholders: 'always'`, the function the forecast reads. A Bozeman zone's fR2 centre is the type's template with
 * nothing sung, so the zone does not slide under the dot; a placeholder dot is the value the fit gives for that
 * vowel now, so it moves as Ilya learns the voice. THE ONE COMPUTATION THIS CHANGES: the chart shows a placeholder for
 * every voice, including the types the adapter withholds them from (contralto, countertenor, bass-baritone, "Not
 * sure", and no type); the forecast's own behaviour is unchanged (`resolve-values.ts`, the flag).
 */
import type { CalibratedFormant, Vowel } from '../engine/types';
import { VOWELS } from '../engine/types';
import { anchorF1sFor, applyMargins, bucketFor, windowFor, type VoiceTypeBucket } from '../engine/plausibility';
import { resolveVowelValues } from '../engine/resolve-values';

/**
 * The half-height of every zone along the second resonance, in semitones (a zone spans twice this).
 *
 * JUDGEMENT, and the DESK'S PLACEHOLDER (brief r5, Step 1.3). Bozeman gives the whole axis and the span within one
 * voice, not a band for each vowel: second resonances lie between about F5 and D7, mostly G5 to C7, and within one
 * voice span about a tenth (*Practical Vocal Acoustics*, 2nd ed. (2025), p. 35; Fig. 5.3, p. 31, a model of F1 and F2
 * for nine vowels on one scale). What he does not chart is an fR2 band for each vowel by voice type, as his boxed
 * charts do for fR1 (`CONTRACT.md` section 8). A zone's width along fR2 is therefore Ilya's own estimate, and the
 * sheet's provenance line says so. The figure matches board D's.
 */
export const FR2_HALF_SPAN_SEMITONES = 2.5;

/** What a zone's fR1 extent rests on: the guard's own window, or the desk's placeholder around a placeholder value. */
export type ZoneBasis = 'guard' | 'placeholder';

export interface Zone {
	vowel: Vowel;
	/** The fR1 window, Hz, unrounded: the guard's, margins applied. */
	f1Low: number;
	f1High: number;
	/** The fR2 centre, Hz. */
	f2Centre: number;
	/** Half the zone's extent along fR2, in semitones (`FR2_HALF_SPAN_SEMITONES`). */
	f2HalfSpanSemitones: number;
	basis: ZoneBasis;
	/** The bucket the guard routed this vowel by; `union` when no type is declared. */
	voiceTypeBucket: VoiceTypeBucket;
}

export interface PlaceholderDot {
	vowel: Vowel;
	f1: number;
	f2: number;
	/** `derived`: from sung anchors by the four derivations. `surrogate`: Bozeman's staff fitted to the singer, or the template. */
	source: 'derived' | 'surrogate';
}

export interface ZoneSet {
	/** All ten, in Grayson's inventory order (`VOWELS`). */
	zones: Zone[];
	/** One for every vowel with no stored reading, in the same order. */
	placeholders: PlaceholderDot[];
}

/** Whether a stored reading counts as sung: a positive fR1 that is not an estimate (the guard's own test, `anchorF1sFor`). */
const isSung = (f: CalibratedFormant | undefined): f is CalibratedFormant => !!f && f.reading !== 'estimated' && typeof f.f1 === 'number' && f.f1 > 0;

/**
 * @param profile the stored readings of the active voice (what the wizard calls `profile`).
 * @param voiceType the declared voice type, as the wizard passes it to the guard.
 */
export function computeZones(profile: Partial<Record<Vowel, CalibratedFormant>>, voiceType?: string): ZoneSet {
	const anchors = anchorF1sFor(profile);
	// The values the voice would have with nothing sung: the zones' fixed ground.
	const ground = resolveVowelValues({}, voiceType, { placeholders: 'always' });
	// The values it has now: the placeholders, and the personal vowels' derived fR2.
	const now = resolveVowelValues(profile, voiceType, { placeholders: 'always' });

	const zones: Zone[] = [];
	const placeholders: PlaceholderDot[] = [];
	for (const vowel of VOWELS) {
		const w = windowFor(vowel, voiceType, anchors);
		if (w) {
			zones.push({
				vowel,
				f1Low: w.low,
				f1High: w.high,
				// A Bozeman zone stays on the type's template; a personal one follows its anchors, as its guard window does.
				f2Centre: w.anchorSource === 'bozeman' ? ground.fR2[vowel] : now.fR2[vowel],
				f2HalfSpanSemitones: FR2_HALF_SPAN_SEMITONES,
				basis: 'guard',
				voiceTypeBucket: w.voiceTypeBucket
			});
		} else {
			const m = applyMargins(ground.fR1[vowel], ground.fR1[vowel]);
			zones.push({
				vowel,
				f1Low: m.low,
				f1High: m.high,
				f2Centre: ground.fR2[vowel],
				f2HalfSpanSemitones: FR2_HALF_SPAN_SEMITONES,
				basis: 'placeholder',
				voiceTypeBucket: bucketFor(voiceType)
			});
		}
		if (!isSung(profile[vowel])) {
			const src = now.fR1Source[vowel];
			placeholders.push({ vowel, f1: now.fR1[vowel], f2: now.fR2[vowel], source: src === 'derived' ? 'derived' : 'surrogate' });
		}
	}
	return { zones, placeholders };
}
