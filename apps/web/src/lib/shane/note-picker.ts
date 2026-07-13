/**
 * Note-picker helpers (E.5 slice 3, Kimi's Q5 ruling, handover v39 §A.31).
 *
 * The pure logic behind NotePicker.svelte: clef choice, staff position,
 * ledger-line placement, and the visible/spoken note names. Kept out of
 * the component so it is testable under vitest's node environment (the
 * same discipline as vowel-resolver.ts).
 *
 * Positioning vocabulary matches the score-parser's staff renderer
 * (staff-renderer.ts, not exported from the package barrel, so the two
 * small constants below are a documented duplication): pitches map to a
 * diatonic number (octave * 7 + step index, C = 0), and a note's offset
 * from the staff's middle line is measured in half-line-gap steps,
 * positive above.
 *
 * `Pitch` is the score-parser's canonical spelled pitch — enharmonic-
 * preserving, so clef choice uses the SOUNDING pitch (pitchToMidi) while
 * staff position uses the SPELLED step and octave, exactly as engraving
 * requires (a C♭4 sits on the C4 staff position but sounds B3).
 */

import { pitchToMidi, type Pitch } from '@ilya/score-parser';

export type Step = Pitch['step'];
export type PickerClef = 'treble' | 'bass';

/** Select-control order: the diatonic letters from C. */
export const STEPS: Step[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

const DIATONIC: Record<Step, number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };

/** Middle staff line as a diatonic number (staff-renderer convention). */
const MIDDLE_LINE: Record<PickerClef, number> = {
	bass: 3 * 7 + DIATONIC.D, // D3
	treble: 4 * 7 + DIATONIC.B // B4
};

function diatonicNumber(p: Pitch): number {
	return p.octave * 7 + DIATONIC[p.step];
}

/**
 * The preview clef: bass below middle C, treble from middle C up, by
 * SOUNDING pitch. Auto-chosen per note so every field of the picker
 * (a bass's low D2, a soprano's high C6) renders near its staff.
 */
export function clefFor(p: Pitch): PickerClef {
	return pitchToMidi(p) < 60 ? 'bass' : 'treble';
}

/**
 * The note's offset from the middle staff line, in half-line-gap steps,
 * positive above (y = staffMidY - offset * halfGap).
 */
export function staffOffset(p: Pitch, clef: PickerClef): number {
	return diatonicNumber(p) - MIDDLE_LINE[clef];
}

/**
 * Ledger-line positions (same half-step units as staffOffset) a note at
 * offset `d` needs: every even position from ±6 out to the note,
 * inclusive. A note in the space just beyond a ledger line (|d| odd)
 * still needs the lines beneath/above it.
 */
export function ledgerOffsets(d: number): number[] {
	const out: number[] = [];
	const sign = d < 0 ? -1 : 1;
	const reach = Math.floor(Math.abs(d) / 2) * 2;
	for (let k = 6; k <= reach; k += 2) out.push(sign * k);
	return out;
}

/** Visible accidental text by alteration (empty for natural). */
const ALTER_GLYPH: Record<number, string> = {
	[-2]: '♭♭',
	[-1]: '♭',
	0: '',
	1: '♯',
	2: '♯♯'
};

/** Spoken accidental word by alteration (empty for natural). */
const ALTER_WORD: Record<number, string> = {
	[-2]: 'double flat',
	[-1]: 'flat',
	0: '',
	1: 'sharp',
	2: 'double sharp'
};

/** The compact visible name, "F♯4" style (aria-hidden in the markup). */
export function pitchLabel(p: Pitch): string {
	return `${p.step}${ALTER_GLYPH[p.alter] ?? ''}${p.octave}`;
}

/**
 * The speakable name, §4.6 discipline: accidental glyphs read as noise
 * or nothing, so screen readers get words ("F sharp 4").
 */
export function spokenPitchLabel(p: Pitch): string {
	const word = ALTER_WORD[p.alter] ?? '';
	return `${p.step}${word ? ` ${word}` : ''} ${p.octave}`;
}
