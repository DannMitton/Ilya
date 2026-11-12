/**
 * A key signature that changes inside the piece, as printed (N.192).
 *
 * Where a bar's key differs from the bar before it, the new signature is drawn
 * after a light double barline, with cancelling naturals first where the new key
 * gives up sharps or flats of the old one, and a courtesy signature closes the
 * system before a change that falls at a system break. This file holds the
 * arithmetic and the markup, so `staff-renderer.ts` (at its ratchet ceiling)
 * only calls it; its figures are shared by the layout (`layoutColumns`,
 * `sliceWidth`) and by the drawing, which is what keeps the two in step.
 *
 * THE RULES (Gould p. 152 is not in the repository; what follows is the
 * convention the survey of Finale, Sibelius, Dorico, and MuseScore found, and
 * each figure is tagged):
 * - INFERENCE: the cancelling naturals stand at the positions of the OLD key's
 *   accidentals that the new key does not keep; when the signature changes from
 *   sharps to flats or back, or to no accidentals, all of the old key's are
 *   cancelled. A change to more of the same kind cancels nothing and draws the
 *   new signature in full.
 * - JUDGEMENT: no gap between the naturals and the new signature beyond the
 *   glyph step the head uses; a light double barline, its two strokes half a
 *   stave-space apart (the figure Gould's r96 gives between a thin and a thick
 *   stroke); one stave-space between the barline and the signature (the head's
 *   own `METER_BARLINE_CLEAR_SP`).
 */
import type { Pitch } from './types';
import { FLAT_ORDER, SHARP_ORDER } from './accidental-carry';

/** The distance between the two strokes of the light double barline, in stave-spaces. JUDGEMENT. */
export const DOUBLE_BAR_GAP_SP = 0.5;
/** Barline to the first glyph of a key change, in stave-spaces. The head's own figure for the meter. JUDGEMENT. */
export const KEY_CHANGE_CLEAR_SP = 1;

export interface KeyChangeGlyph {
	kind: 'natural' | 'sharp' | 'flat';
	step: Pitch['step'];
	/** Which table of staff positions the glyph takes: a natural stands where the sharp or flat it cancels stood. */
	table: 'sharps' | 'flats';
}

/** The glyphs a change from `from` to `to` fifths draws, cancelling naturals first. Empty when the keys are the same. */
export function keyChangeGlyphs(from: number, to: number): KeyChangeGlyph[] {
	if (from === to) return [];
	const out: KeyChangeGlyph[] = [];
	const sameKind = Math.sign(from) === Math.sign(to) && to !== 0;
	if (from !== 0) {
		const order = from > 0 ? SHARP_ORDER : FLAT_ORDER;
		const table = from > 0 ? 'sharps' : 'flats';
		// The accidentals the new key does not keep are cancelled; a key of the same kind with as many or more cancels none.
		const first = sameKind ? Math.min(Math.abs(to), Math.abs(from)) : 0;
		for (let i = first; i < Math.abs(from); i++) out.push({ kind: 'natural', step: order[i], table });
	}
	if (to !== 0) {
		const order = to > 0 ? SHARP_ORDER : FLAT_ORDER;
		for (let i = 0; i < Math.abs(to); i++) out.push({ kind: to > 0 ? 'sharp' : 'flat', step: order[i], table: to > 0 ? 'sharps' : 'flats' });
	}
	return out;
}

export interface KeyChangeLayout {
	from: number;
	to: number;
	glyphs: KeyChangeGlyph[];
	/** The signature's width, in px: the sum of each glyph's step. */
	width: number;
}

/** The layout of a change, or nothing where there is none. `stepOf` is one glyph's width plus the head's 1 px. */
export function keyChangeLayout(from: number, to: number, stepOf: (kind: KeyChangeGlyph['kind']) => number): KeyChangeLayout | undefined {
	const glyphs = keyChangeGlyphs(from, to);
	return glyphs.length ? { from, to, glyphs, width: glyphs.reduce((t, g) => t + stepOf(g.kind), 0) } : undefined;
}

/** The thin stroke's width in px: the font's engraving default, or 1 where no font is loaded. */
export const thinBarPx = (lineGap: number, thinBarlineThickness: number | undefined): number => (thinBarlineThickness === undefined ? 1 : lineGap * thinBarlineThickness);

/** The extra room the light double barline takes, from the first stroke's centre to the second's. */
export const doubleBarExtraPx = (lineGap: number, thin: number): number => lineGap * DOUBLE_BAR_GAP_SP + thin;

/**
 * The key change's room from the barline's first stroke to the signature's right edge, in px: the double barline's
 * second stroke, the clearance, and the glyphs. A system's closing courtesy does not take the second stroke (the
 * double barline is drawn inside the width the system already has), so it is `courtesy: true`.
 */
export function keyChangeRoom(layout: KeyChangeLayout, lineGap: number, thin: number, courtesy = false): number {
	return (courtesy ? 0 : doubleBarExtraPx(lineGap, thin)) + lineGap * KEY_CHANGE_CLEAR_SP + layout.width;
}

/**
 * The signature's markup, glyphs left to right from `left`. One group stamped `data-key-change`, never
 * `data-key-signature`: the Loupe's head bound reads that handle, and a signature in the middle of a system
 * must not move it (Fable's amendment 11). `place` draws one glyph at (x, y) and returns its markup.
 */
export function keyChangeMarkup(
	layout: KeyChangeLayout,
	left: number,
	stepOf: (kind: KeyChangeGlyph['kind']) => number,
	yOf: (g: KeyChangeGlyph) => number,
	place: (kind: KeyChangeGlyph['kind'], x: number, y: number) => string,
): string {
	const out = [`<g data-key-change="${layout.from}>${layout.to}">`];
	let x = left;
	for (const g of layout.glyphs) {
		out.push(place(g.kind, x, yOf(g)));
		x += stepOf(g.kind);
	}
	out.push('</g>');
	return out.join('');
}
