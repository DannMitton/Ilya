/**
 * The banner's bars as pieces, so each bar number can be a link (row 181 step 6; Dann 2026-11-04 12:02 item 8: "the banner that
 * lists the bars Ilya could not read makes each bar number tappable").
 *
 * The text is `barsText`'s (`score/ingestion/ingest.ts`), piece for piece: «4, 9 to 12, and 39» or «4, 9 à 12 et 39». A piece
 * that is a bar number carries the bar; the words and commas between do not. A range of two numbers has two links, the first
 * and the last bar (the bars between are reached with Next). Pure.
 */
import type { BarRange } from './unread-bars';

export interface BarPiece {
	text: string;
	/** The bar this piece links to; absent for the words and punctuation between. */
	bar?: number;
}

export function barPieces(ranges: readonly BarRange[], language: 'en' | 'fr'): BarPiece[] {
	const to = language === 'fr' ? ' à ' : ' to ';
	const out: BarPiece[] = [];
	const push = (piece: BarPiece): void => void out.push(piece);
	ranges.forEach(([a, b], i) => {
		if (i > 0) {
			const last = i === ranges.length - 1;
			if (language === 'fr') push({ text: last ? ' et ' : ', ' });
			else push({ text: ranges.length === 2 ? ' and ' : last ? ', and ' : ', ' });
		}
		push({ text: String(a), bar: a });
		if (b !== a) {
			push({ text: to });
			push({ text: String(b), bar: b });
		}
	});
	return out;
}

/** Every bar the ranges name, once each, in order: the walk's list (`Bar 14, 1 of 3`). */
export function barsOf(ranges: readonly BarRange[]): number[] {
	const out: number[] = [];
	for (const [a, b] of ranges) for (let bar = a; bar <= b; bar++) if (!out.includes(bar)) out.push(bar);
	return out;
}
