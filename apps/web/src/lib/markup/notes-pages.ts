/**
 * Markup's trailing notes, split across as many sheets as they need.
 *
 * WHY (Dann's look, 2026-09-28 16:17): on «Скучай» the "Places to watch" box
 * ran past the one notes sheet, and the window's `overflow: hidden` cut its
 * last line through. The acceptance criterion outranks page count: nothing
 * may be cut. So the notes flow on to a further sheet, as the score does.
 *
 * HOW. `NotesColumn` lays the whole column out once, unbounded and unseen, at
 * the page's text width, and reports where each piece sits (`NotesMeasure`).
 * This module packs those pieces into sheets of the window's height. It is
 * pure, so the packing is unit-tested without a browser.
 *
 * THE UNITS. The withheld statement and the octave notice are each one piece
 * and never split. The watch band splits between lines, never inside one; a
 * band that continues on the next sheet repeats its heading there, in a box of
 * its own (DESK DEFAULT, 2026-09-28: a box with no heading reads as orphaned).
 */

/** Where each piece sits in the unbounded column, in px from its top. */
export interface NotesMeasure {
	/** The withheld statement, when it prints. */
	withheld?: { top: number; bottom: number };
	/** The octave notice, when it prints. */
	octave?: { top: number; bottom: number };
	/** The watch band, when it prints. */
	band?: {
		top: number;
		bottom: number;
		/** Each line of the band, in order. */
		lines: Array<{ top: number; bottom: number }>;
	};
}

/** One sheet's share of the notes. `lines` is a half-open range into the band's lines. */
export interface NotesSheet {
	withheld: boolean;
	octave: boolean;
	lines: [number, number] | null;
}

/**
 * Packs the measured column into sheets whose window is `height` px tall.
 * Always returns at least one sheet. A single piece taller than a whole
 * window is placed alone on its sheet; nothing on the notes page is that tall.
 */
export function packNotes(m: NotesMeasure, height: number): NotesSheet[] {
	const sheets: NotesSheet[] = [{ withheld: false, octave: false, lines: null }];
	let start = 0; // the column offset the current sheet's window begins at
	let empty = true;
	const fits = (bottom: number) => bottom - start <= height + 0.5; // sub-pixel guard

	const place = (piece: { top: number; bottom: number }, key: 'withheld' | 'octave') => {
		if (!empty && !fits(piece.bottom)) {
			sheets.push({ withheld: false, octave: false, lines: null });
			start = piece.top;
		}
		sheets[sheets.length - 1][key] = true;
		empty = false;
	};
	if (m.withheld) place(m.withheld, 'withheld');
	if (m.octave) place(m.octave, 'octave');

	const band = m.band;
	if (band && band.lines.length > 0) {
		const first = band.lines[0];
		const last = band.lines[band.lines.length - 1];
		const head = first.top - band.top; // border, padding, and heading above the first line
		const foot = band.bottom - last.bottom; // padding and border below the last line
		for (let i = 0; i < band.lines.length; i++) {
			const line = band.lines[i];
			const sheet = sheets[sheets.length - 1];
			const opening = sheet.lines === null;
			// A line opening a box carries the box's head with it.
			if (opening && !empty && !fits(line.bottom + foot)) {
				sheets.push({ withheld: false, octave: false, lines: [i, i + 1] });
				start = line.top - head;
			} else if (opening) {
				sheet.lines = [i, i + 1];
			} else if (fits(line.bottom + foot)) {
				sheet.lines = [sheet.lines![0], i + 1];
			} else {
				sheets.push({ withheld: false, octave: false, lines: [i, i + 1] });
				start = line.top - head;
			}
			empty = false;
		}
	}
	return sheets;
}
