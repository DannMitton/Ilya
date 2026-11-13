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
