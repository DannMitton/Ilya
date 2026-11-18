/**
 * The sheet's readings table, as data (N.199 Step 2): for each vowel the singer has sung, its two resonances in Hz with
 * the nearest note and the signed cents from it, "D4 +16". Note names come from `pitchName` (`voice/note-picker.ts`,
 * the letter plus the American octave index, A4 = 440 Hz); the pitch and the interval from the tree's own
 * `hzToPitch`, `pitchToHz`, and `centsBetween` (`packages/score-parser/src/overlay-engine.ts`), so no second tuning
 * table exists.
 */
import { centsBetween, hzToPitch, pitchToHz } from '@ilya/score-parser';
import type { CalibratedFormant, Vowel } from '../engine/types';
import { VOWELS } from '../engine/types';
import { pitchName } from '../note-picker';
import type { PlaceholderDot } from './zones';

export interface NoteReading {
	hz: number;
	/** The rounded Hz as printed. */
	hzText: string;
	/** "D4". */
	note: string;
	/** Whole cents from that note, signed (positive above). */
	cents: number;
	/** "+16", "−3", or "±0": a true minus sign, and ±0 for none. */
	centsText: string;
	/** "D4 +16". */
	text: string;
}

export interface ReadingRow {
	vowel: Vowel;
	fR1: NoteReading;
	/** Absent when the reading has no usable fR2. */
	fR2?: NoteReading;
}

/** The signed cents as text. A true minus (U+2212) so it reads as a number, not a hyphen; ±0 for none. */
export function signedCents(cents: number): string {
	if (cents === 0) return '±0';
	return cents > 0 ? `+${cents}` : `−${Math.abs(cents)}`;
}

/** A frequency as the table prints it, in the reader's page convention (`pitchName`). */
export function noteReading(hz: number, language: 'en' | 'fr' = 'en'): NoteReading {
	const pitch = hzToPitch(hz);
	// `Math.round(x) + 0` turns a rounded -0 into 0, so "−0" never prints.
	const cents = Math.round(centsBetween(pitchToHz(pitch), hz)) + 0;
	const note = pitchName(pitch, language);
	const centsText = signedCents(cents);
	return { hz, hzText: String(Math.round(hz)), note, cents, centsText, text: `${note} ${centsText}` };
}

const isSung = (f: CalibratedFormant | undefined): f is CalibratedFormant => !!f && f.reading !== 'estimated' && typeof f.f1 === 'number' && f.f1 > 0;

/** The rows for the stored profile: every sung vowel, in Grayson's inventory order. A reading with no fR2 has no `fR2`. */
export function readingRows(profile: Partial<Record<Vowel, CalibratedFormant>>, language: 'en' | 'fr' = 'en'): ReadingRow[] {
	const rows: ReadingRow[] = [];
	for (const vowel of VOWELS) {
		const f = profile[vowel];
		if (!isSung(f)) continue;
		rows.push({
			vowel,
			fR1: noteReading(f.f1, language),
			...(typeof f.f2 === 'number' && f.f2 > 0 ? { fR2: noteReading(f.f2, language) } : {})
		});
	}
	return rows;
}

/** One line of the capture screen's readings list: a sung vowel's stored reading, or the placeholder the chart draws for one not yet sung. */
export interface ListRow {
	vowel: Vowel;
	/** `sung`: the stored reading; `placed`: the chart's placeholder (`ZoneSet.placeholders`), the same number as its hollow dot. */
	kind: 'sung' | 'placed';
	fR1: NoteReading;
	/** Absent when a sung reading has no usable fR2 (the chart's test, `f2 > 0`, not the readout's `typeof`). */
	fR2?: NoteReading;
}

/**
 * The capture screen's readings list (N.199 readings brief, Step 1), as data: all ten vowels in Grayson's order, the ten buttons'.
 * A sung vowel ("sung" is the chart's own test, `zones.ts` `isSung`) takes its stored values; one not yet sung takes the values of the
 * placeholder handed in, which is what the chart draws its hollow dot from, so a dot and its row are one number. No second call to
 * `resolveVowelValues`: a vowel with neither a sung reading nor a placeholder has no row.
 */
export function readingListRows(
	profile: Partial<Record<Vowel, CalibratedFormant>>,
	placeholders: readonly PlaceholderDot[],
	language: 'en' | 'fr' = 'en'
): ListRow[] {
	const rows: ListRow[] = [];
	for (const vowel of VOWELS) {
		const f = profile[vowel];
		if (isSung(f)) {
			rows.push({ vowel, kind: 'sung', fR1: noteReading(f.f1, language), ...(typeof f.f2 === 'number' && f.f2 > 0 ? { fR2: noteReading(f.f2, language) } : {}) });
			continue;
		}
		const p = placeholders.find((q) => q.vowel === vowel);
		if (!p || !(p.f1 > 0)) continue;
		rows.push({ vowel, kind: 'placed', fR1: noteReading(p.f1, language), ...(typeof p.f2 === 'number' && p.f2 > 0 ? { fR2: noteReading(p.f2, language) } : {}) });
	}
	return rows;
}

/** The roster's marks, kept in the summary's one table (N.203 lane 60, Step 5; sheet line 26). Each is true only where it applies. */
export interface RowMarks {
	/** The reading is Provisional: its own evidence left it so (a stored reading the old guard or the old [ɨ] pass demoted keeps that status until sung again). */
	provisional: boolean;
	/** The singer kept a reading beyond Ilya's reference values. */
	beyond: boolean;
	/** The room's noise floor could not be measured for this reading. */
	noiseFloorUnmeasured: boolean;
}

export interface SummaryRow extends ListRow {
	marks: RowMarks;
}

/**
 * The summary's ten rows: `readingListRows`, unchanged (it is the capture screen's list), with the marks of each sung vowel beside it.
 * A vowel not recorded has a placeholder row and no marks.
 */
export function summaryRows(
	profile: Partial<Record<Vowel, CalibratedFormant>>,
	placeholders: readonly PlaceholderDot[],
	language: 'en' | 'fr' = 'en'
): SummaryRow[] {
	return readingListRows(profile, placeholders, language).map((row) => {
		const f = row.kind === 'sung' ? profile[row.vowel] : undefined;
		return {
			...row,
			marks: {
				provisional: f?.reading === 'provisional',
				beyond: !!f?.plausibilityOverride,
				noiseFloorUnmeasured: f?.noiseFloor === 'unmeasured'
			}
		};
	});
}
