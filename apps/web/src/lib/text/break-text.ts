/**
 * N.194 r5, step 3: from a unit to a place in the Lyrics text, and the two edits the Loupe's break button makes.
 *
 * The coordinates are the page's own: `lineIndex` and `wordIndex` are the transcribed ones (`SlotOrigin`,
 * `wordGrid`), NOT raw line and token indices, so every offset comes from the pipeline's own tokenizer
 * (`splitIntoPreLines`, which carries each word's raw token as `spans`). Nothing here counts newlines or
 * splits on whitespace.
 *
 * INSERT glues the mark to the end of the unit's last raw token with a no-break space (Dann 2026-10-25 23:52):
 * «благодать» becomes «благодать\u00A0#». REMOVE deletes every # that step 2 reads into the unit, wherever the
 * singer put it, so the unit holds no mark afterwards and the pill reads "Break after this word" again. A typed
 * # is removed where it was typed; nothing else in the text moves.
 *
 * Write the no-break space as the escape `\u00A0` in source and in tests, never as a literal character.
 */
import { splitIntoPreLines } from '../pipeline';
import { tokenSpans, type TokenSpan } from '../syntactic-break';
import { unitEnd, type UnitWord } from './syntactic-break-unit';

/** What Ilya writes after a unit's last word: a no-break space, then the mark. */
export const BREAK_MARK = '\u00A0#';

/** The first word of the unit whose last word is `end`: the smallest index that resolves to it. */
export function unitStart(words: readonly UnitWord[], end: number): number {
	let start = end;
	while (start > 0 && unitEnd(words, start - 1) === end) start--;
	return start;
}

/** A transcribed line, found in the text: where its raw line starts and the raw tokens of its words. */
function locate(text: string, lineIndex: number): { lineStart: number; raw: string; spans: TokenSpan[] } | null {
	const rawLines = text.split('\n');
	const entry = splitIntoPreLines(rawLines)[lineIndex];
	if (!entry) return null;
	const lineStart = rawLines.slice(0, entry.rawIndex).reduce((n, l) => n + l.length + 1, 0);
	return { lineStart, raw: rawLines[entry.rawIndex], spans: entry.spans };
}

/** The offset in `text` where the raw token of word `wordIndex` of transcribed line `lineIndex` ends; null when there is no such word. */
export function tokenEndOffset(text: string, lineIndex: number, wordIndex: number): number | null {
	const at = locate(text, lineIndex);
	const span = at?.spans[wordIndex];
	return at && span ? at.lineStart + span.end : null;
}

/** The text with the mark glued to the end of the unit's last raw token. */
export function insertBreak(text: string, lineIndex: number, endWord: number): string | null {
	const offset = tokenEndOffset(text, lineIndex, endWord);
	return offset === null ? null : text.slice(0, offset) + BREAK_MARK + text.slice(offset);
}

/**
 * The text with every # of the unit taken out: in the raw token of each of its words (`firstWord` to
 * `endWord`), in every token between the unit's first token and the next word that is only marks (with the
 * whitespace run before it), and a leading run of # on the next word, which step 2 reads as the unit's. Each
 * deleted # takes the no-break spaces standing immediately before it. Null when there is no such unit.
 */
export function removeBreak(text: string, lineIndex: number, firstWord: number, endWord: number): string | null {
	const at = locate(text, lineIndex);
	const first = at?.spans[firstWord];
	const last = at?.spans[endWord];
	if (!at || !first || !last || firstWord > endWord) return null;

	const wordSpans = new Set(at.spans.slice(firstWord, endWord + 1).map((s) => s.start));
	const next = at.spans[endWord + 1];
	// Every token of the raw line from the unit's first to the next word, in order; the next word's own is cut at its leading marks.
	const reach = next ? next.start : at.raw.length;
	const tokens = tokenSpans(at.raw).filter((t) => t.start >= first.start && t.start < reach);

	let out = '';
	let cursor = first.start;
	for (const token of tokens) {
		const gap = at.raw.slice(cursor, token.start);
		// A leading # on the unit's first token is the PREVIOUS unit's (step 2), so it stays.
		const keep = token.start === first.start ? (/^#+/.exec(token.text)?.[0] ?? '') : '';
		const stripped = keep + token.text.slice(keep.length).replace(/\u00A0*#/g, '');
		// a token that is only marks goes with the whitespace run before it
		out += wordSpans.has(token.start) || stripped !== '' ? gap + stripped : gap.replace(/\s+$/, '');
		cursor = token.end;
	}
	if (next) {
		const lead = /^#+/.exec(at.raw.slice(next.start, next.end))?.[0] ?? '';
		out += at.raw.slice(cursor, next.start);
		cursor = next.start + lead.length;
	}
	const edited = at.raw.slice(0, first.start) + out + at.raw.slice(cursor);
	return text.slice(0, at.lineStart) + edited + text.slice(at.lineStart + at.raw.length);
}
