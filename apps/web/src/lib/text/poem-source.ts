/**
 * poem-source.ts: what fills Poem from a library match, and what happens to the
 * song's `poemSource` as the singer answers (poem library, build 1, step 4;
 * brief `docs/sessions/brief-code-poem-library-build1_r3_2026-11-03.md`).
 *
 * PURE: text and plain objects in, text and plain objects out. The controller
 * (`poem-offer.svelte.ts`) does the filling; this file decides what is filled
 * and how the stored record changes.
 */
import type { PoemSource } from '$lib/library/types';
import type { PoemEntry } from './poem-library';

/** The stanzas of a text: blank-line blocks, as offsets into it. Each block starts at its first letter and ends after its last. */
export function stanzas(text: string): { start: number; end: number }[] {
	const blocks: { start: number; end: number }[] = [];
	let open: { start: number; end: number } | null = null;
	let at = 0;
	for (const line of text.split('\n')) {
		if (line.trim() === '') {
			if (open) blocks.push(open);
			open = null;
		} else {
			const first = at + (line.length - line.trimStart().length);
			const last = at + line.trimEnd().length;
			if (open) open.end = last;
			else open = { start: first, end: last };
		}
		at += line.length + 1;
	}
	if (open) blocks.push(open);
	return blocks;
}

/**
 * A dating line closing a poem in the library's text («1830», «Февраль 1837», «8 декабря 1840Москва»): one line, with a
 * four-digit year, of four words or fewer. `library.json` keeps it, as the source prints it, but nobody sings it: it
 * does not count as a stanza the song left out, and it is NEVER FILLED INTO POEM (Dann 2026-11-03 19:50: "keep the date
 * in the library's record but leave it out of POEM"; step 7, part 3). DESK DEFAULT (mine): the test for what a dating
 * line is, reversible. All three in the library stand in a block of their own; a dateline glued to its stanza would pass
 * through, and none exists in the file today.
 */
const isDateline = (text: string): boolean => !text.includes('\n') && /\d{4}/.test(text) && text.trim().split(/\s+/).length <= 4;

/** The stanzas of the poem itself: the blocks of `stanzas`, less any dating lines at the end. */
export function bodyStanzas(text: string): { start: number; end: number }[] {
	const blocks = stanzas(text);
	while (blocks.length > 1 && isDateline(text.slice(blocks[blocks.length - 1].start, blocks[blocks.length - 1].end))) blocks.pop();
	return blocks;
}

/** What fills Poem: the text, and where it lies in the entry's `textModern` (the stanza cut). */
export interface StanzaCut {
	text: string;
	start: number;
	end: number;
	/** True when the cut is the whole poem. */
	whole: boolean;
}

/**
 * The whole stanzas of `textModern` that hold the stretch `[start, end)`. When those are all of the poem's
 * stanzas, the whole body of the poem, from its start to the end of its last stanza, verbatim (`whole`); a song that
 * sets one passage cuts to that passage. EITHER WAY A CLOSING DATING LINE IS LEFT OUT (part 3): `whole` ends where the
 * last body stanza ends, so «Весёлый час» ends at «Видит заря!», not «1830», and is still not called a passage.
 */
export function stanzaCut(textModern: string, start: number, end: number): StanzaCut {
	const blocks = bodyStanzas(textModern);
	const bodyEnd = blocks.length > 0 ? blocks[blocks.length - 1].end : textModern.length;
	const whole: StanzaCut = { text: textModern.slice(0, bodyEnd), start: 0, end: bodyEnd, whole: true };
	if (blocks.length === 0) return whole;
	const first = blocks.findIndex((b) => b.end > start);
	let last = -1;
	blocks.forEach((b, i) => {
		if (b.start < end) last = i;
	});
	if (first < 0 || last < first) return whole;
	if (first === 0 && last === blocks.length - 1) return whole;
	const cutStart = blocks[first].start;
	const cutEnd = blocks[last].end;
	return { text: textModern.slice(cutStart, cutEnd), start: cutStart, end: cutEnd, whole: false };
}

/** The line of the text that holds `offset`, trimmed; '' where the offset is outside the text. */
export function lineAt(text: string, offset: number): string {
	if (offset < 0 || offset >= text.length) return '';
	const from = text.lastIndexOf('\n', offset - 1) + 1;
	const to = text.indexOf('\n', offset);
	return text.slice(from, to === -1 ? text.length : to).trim();
}

/** What the card and the lines print about a stored source, found again in the library. */
export interface ResolvedSource {
	entry: PoemEntry;
	/** The first line of the stanza cut, or the entry's incipit where the stored offsets are not known to fit this library. */
	firstLine: string;
	/** True when the cut is part of the poem (the card says "a passage beginning"). */
	passage: boolean;
}

/**
 * The entry a stored source names, from the library as loaded now. The title and the author are looked up here and
 * never stored. The entry is the one with the stored `id`; where a later library has dropped that id, a modern entry of
 * the same `work`, else any entry of it; where it has no entry of the work, null (the caller falls back to `poemLine`).
 * The stored offsets are trusted only for the file they were cut from (`poemHash`).
 */
export function resolveSource(source: PoemSource, library: { entries: readonly PoemEntry[]; hash?: string }): ResolvedSource | null {
	const same = library.entries.find((e) => e.id === source.id);
	const ofWork = library.entries.filter((e) => e.work === source.work);
	const entry = same ?? ofWork.find((e) => e.spelling === 'modern') ?? ofWork[0];
	if (!entry) return null;
	const fits = library.hash === source.poemHash && entry.id === source.id && source.end <= entry.textModern.length;
	if (!fits) return { entry, firstLine: entry.incipit, passage: false };
	const firstLine = lineAt(entry.textModern, source.start) || entry.incipit;
	const body = bodyStanzas(entry.textModern);
	return { entry, firstLine, passage: source.start > 0 || source.end < (body[body.length - 1]?.end ?? entry.textModern.length) };
}

/**
 * A line of the poem as the card quotes it between «» marks: the data's own opening and closing quote marks and dashes
 * are dropped so they are not doubled, and so is a trailing comma, colon, or semicolon that a line broken mid-sentence
 * ends on. A `!`, a `?`, a full stop, or an ellipsis stays. DESK DEFAULT (mine), reversible.
 */
export function cardLine(line: string): string {
	return line
		.replace(/^[\s«»"“”„‘’'—–-]+/, '')
		.replace(/[\s«»"“”„‘’']+$/, '')
		.replace(/[,;:]+$/, '')
		.trim();
}

/* ── The record's transitions (review amendment 6) ─────────────────── */

/** The singer answered the card with "Keep this poem". */
export const kept = (source: PoemSource): PoemSource => ({ ...source, answered: true });

/** The singer edited the poem: it is hers now, the card folds, and the source still shows (attribution is never dropped). */
export const edited = (source: PoemSource): PoemSource => ({ ...source, edited: true, answered: true });

/**
 * What the replace guard is told Poem holds. It asks over a poem the singer filled or edited, and not over
 * an unedited library poem, which a pasted poem or a poem page replaces with no question (amendment 9).
 */
export const heldForGuard = (source: PoemSource | null, held: string): string => (source && !source.edited ? '' : held);

/**
 * Whether a whole-text arrival in the Poem field replaces the library poem or edits it. A paste that shares no run of
 * `RUN` consecutive letters with the poem on the song is the singer's own poem; anything else is an edit of this one.
 * DESK DEFAULT, reversible. Typed keys are always edits (the caller does not ask).
 */
export const RUN = 20;
export function replacesLibraryPoem(previous: string, next: string, fold: (text: string) => string): boolean {
	const a = fold(previous);
	const b = fold(next);
	if (b === '') return true;
	if (a.length < RUN || b.length < RUN) return a !== '' && b !== '' && !a.includes(b) && !b.includes(a);
	const grams = new Set<string>();
	for (let i = 0; i + RUN <= a.length; i += 1) grams.add(a.slice(i, i + RUN));
	for (let i = 0; i + RUN <= b.length; i += 1) if (grams.has(b.slice(i, i + RUN))) return false;
	return true;
}
