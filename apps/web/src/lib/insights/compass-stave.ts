/**
 * compass-stave.ts: the piece's compass as a small stave of its own.
 *
 * Dann's walk of 2026-10-09 (`OPEN.md`, "THE INSIGHTS PAGE, REARRANGED", ruling
 * 1): the compass leaves the tessituragram, where it stood at several times the
 * size of the notation on the Markup page, and takes a small stave in the top
 * right corner of Insights' page one, at a normal notation size: the clef, the
 * compass's lowest and highest sung pitch as two notes, and "Compass {low} to
 * {high}" under it. Pure: text is measured by a function the caller supplies and
 * the music font's glyph sizes arrive the same way, so a test can run it
 * without a canvas.
 */
import { smuflFontSizePx, spToPx } from '@ilya/score-parser';
import { t, type Language } from '$lib/i18n';
import { pitchLabel } from '$lib/voice/note-picker';
import { diatonicOf, type TessituragramModel } from './insights';
import { STAVE_LINES, type GlyphOf, type Measure } from './tessituragram-layout';

/** A staff space in px. JUDGEMENT: the size the score's staves are set in, so the corner stave reads as notation, not as a figure. */
export const COMPASS_LINE_GAP = 8;
const LABEL = 10;
const CLEF_X = 2;

const ACC: Record<number, string> = { [-2]: 'accidentalDoubleFlat', [-1]: 'accidentalFlat', 1: 'accidentalSharp', 2: 'accidentalDoubleSharp' };

export interface CompassLayout {
	width: number;
	height: number;
	/** The stave's own right edge; the words sit under it, right-aligned to `width`. */
	staveLeft: number;
	staveRight: number;
	staveYs: number[];
	clef: { x: number; y: number } | null;
	notes: Array<{ pitch: TessituragramModel['compass']['low']; x: number; y: number; ledgers: number[]; accX: number | null }>;
	text: { text: string; x: number; y: number };
	glyphPx: number;
	lineGap: number;
	headHalf: number;
}

export function layoutCompassStave(
	compass: TessituragramModel['compass'],
	clef: TessituragramModel['clef'],
	language: Language,
	measure: Measure,
	glyph: GlyphOf,
): CompassLayout {
	const gap = COMPASS_LINE_GAP;
	const half = gap / 2;
	const sp = (n: number) => spToPx(n, gap);
	const lines = STAVE_LINES[clef];
	const bottomLine = lines[0];
	const topLine = lines[4];
	const low = compass.low;
	const high = compass.high;
	const dLow = diatonicOf(low);
	const dHigh = diatonicOf(high);
	const top = Math.max(topLine, dHigh) + 1;
	const bottom = Math.min(bottomLine, dLow) - 1;
	/* Raw y: zero at the extent's top. */
	const y = (d: number) => (top - d) * half;

	const clefG = glyph(clef === 'bass' ? 'fClef' : 'gClef');
	const headG = glyph('noteheadBlack');
	const headHalf = headG ? sp(headG.widthSp / 2) : 5;
	const accW = (alter: number | undefined) => {
		const g = alter ? glyph(ACC[alter]) : null;
		return alter ? (g ? sp(g.widthSp) : 7) + 2 : 0;
	};
	const clefRight = CLEF_X + (clefG ? sp(clefG.widthSp) : sp(2.7));
	const oneNote = diatonicOf(low) === diatonicOf(high) && low.alter === high.alter;
	const lowX = clefRight + 5 + accW(low.alter) + headHalf;
	const highX = oneNote ? lowX : Math.max(lowX + 22, lowX + 2 * headHalf + 5 + accW(high.alter));
	const staveRight = highX + headHalf + 8;

	const noteSpecs = oneNote ? [{ pitch: low, x: lowX }] : [{ pitch: low, x: lowX }, { pitch: high, x: highX }];
	const notes = noteSpecs.map((n) => {
		const d = diatonicOf(n.pitch);
		const ledgers: number[] = [];
		for (let l = bottomLine - 2; l >= d; l -= 2) ledgers.push(l);
		for (let l = topLine + 2; l <= d; l += 2) ledgers.push(l);
		const acc = n.pitch.alter ? glyph(ACC[n.pitch.alter]) : null;
		return { pitch: n.pitch, x: n.x, y: y(d), ledgers: ledgers.map(y), accX: n.pitch.alter ? n.x - headHalf - 2 - (acc ? sp(acc.widthSp) : 7) : null };
	});

	const words = t('insights.fit.compass', language).replace('{low}', pitchLabel(low)).replace('{high}', pitchLabel(high));
	const textW = measure(words, LABEL, 500);
	const width = Math.max(staveRight, textW);
	const offset = width - staveRight;
	const textBaseline = y(bottom) + 13;

	/* The clef's own top may stand above the stave's extent (a G clef's curl). */
	const clefAnchor = clef === 'bass' ? 24 : 32;
	const clefTopY = clefG ? y(clefAnchor) - sp(clefG.top) : y(topLine);
	const dy = Math.max(0, -Math.min(clefTopY, y(top)));

	const shift = <T extends { x: number; y: number }>(p: T): T => ({ ...p, x: p.x + offset, y: p.y + dy });
	return {
		width,
		height: textBaseline + dy + 4,
		staveLeft: offset,
		staveRight: width,
		staveYs: lines.map((l) => y(l) + dy),
		clef: clefG ? shift({ x: CLEF_X, y: y(clefAnchor) }) : null,
		notes: notes.map((n) => ({ ...n, x: n.x + offset, y: n.y + dy, ledgers: n.ledgers.map((l) => l + dy), accX: n.accX === null ? null : n.accX + offset })),
		text: { text: words, x: width, y: textBaseline + dy },
		glyphPx: smuflFontSizePx(gap),
		lineGap: gap,
		headHalf,
	};
}
