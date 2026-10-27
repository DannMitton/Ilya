/**
 * N.135 STAGE 3. THE POEM AGAINST THE LYRICS, A WORD ALIGNMENT DONE ON RENDER.
 *
 * Input has two views (`IntakePanel`): the poet's published text and the sung
 * text. Every word of the sung text that the poem does not carry is coloured
 * in Lyrics, and every word of the poem the song does not set is greyed in
 * Poem (Dann 2026-10-16 00:40 and 00:51, `OPEN.md`, "N.135 STAGE 3", defaults
 * 5 and 11). This module is the comparison and nothing else: two strings in,
 * which word is matched out. It is NOT stage 3's reconciliation (default 8),
 * which decides which letters win; this decides only what to colour.
 *
 * NOTHING HERE IS STORED (`CONTRACT.md` §8, store nothing derived). The
 * alignment is recomputed whenever either text changes.
 *
 * THE TOKENS are the whitespace-separated words of each text. A word is
 * compared by its folded form: case folded, punctuation at its ends stripped,
 * ё read as е, any hyphen inside it joined (Dann 00:40: a syllable hyphen is
 * "a necessary lyrics marker" and never a diversion from the poet's text), and
 * the old spelling read in the modern (`modernisePreReform`, as the pipeline
 * does at `pipeline.ts`). THE OLD GENITIVE ENDINGS (-аго, -яго) are read the
 * other way round: `oldEndingCandidates` proposes the modern forms and a word
 * matches the poem's when the poem's word is one of them, so a print's
 * «шумнаго» matches a poem's «шумного». No dictionary gate here, as the
 * pipeline has (`old-spelling.ts`): the poem's own word in that place is the
 * evidence, which is stronger than the lemma check that gate stands in for.
 * DESK DEFAULT, beyond the brief's `modernisePreReform` alone.
 * A token with no letters in it ("—") is punctuation, takes no part, and is
 * never coloured.
 *
 * THE ALIGNMENT is a longest common subsequence over the two folded lists, in
 * order. A composer's repeat is therefore an extra, unmatched copy in the
 * Lyrics, a composer's omission an unmatched poem word, an altered word is
 * unmatched on both sides, and a reordered passage shows as both, which is
 * the truth of it.
 */
import { modernisePreReform, oldEndingCandidates } from '@ilya/dictionary';
import { WORD_TOKEN } from './break-glue';

/* A word, or a line break. The word pattern is `break-glue.ts`'s, so Ilya's own «я\u00A0#» stays one token (N.194, Dann 2026-10-25 23:52). */
const WORD_OR_NEWLINE = new RegExp(`${WORD_TOKEN.source}|\n`, 'g');

/** One word of a text, where it stands in that text, and how it compares. */
export interface Token {
	/** Offset of the first character in the text the token came from. */
	start: number;
	/** Offset one past the last character. */
	end: number;
	/** The folded form compared, or '' for a token that is only punctuation. */
	folded: string;
	/** The zero-based line the token stands on (newlines before it). */
	line: number;
	/** The modern forms an old genitive ending proposes, folded; empty for any other word. */
	alts: string[];
}

export interface Comparison {
	lyrics: Token[];
	poem: Token[];
	/** Per Lyrics token: true when it matches a poem word. Punctuation-only tokens read true (never coloured). */
	lyricsMatched: boolean[];
	/** Per Poem token: true when the song sets it. Punctuation-only tokens read true (never greyed). */
	poemMatched: boolean[];
	/** Lyrics words that differ from the poem: a repeat, a change, or an addition. */
	differing: number;
	/** Poem words the song does not set. */
	omitted: number;
	/** The matched words as [Lyrics token index, Poem token index], in order. */
	pairs: [number, number][];
}

/** A piece of a text with its mark; the pieces joined are the text, character for character. */
export interface Segment {
	text: string;
	kind: 'plain' | 'differs' | 'omitted';
}

/**
 * THE LARGEST TABLE THIS WILL FILL, in cells. 4,000,000 is 2000 words against
 * 2000, about 16 MB of `Int32Array`, which no song reaches (a long cycle is a
 * few hundred sung words). Past it the comparison declines (returns null) and
 * the field shows no colour, which is the honest answer; a wrong colouring
 * would not be. DESK DEFAULT.
 */
const MAX_CELLS = 4_000_000;

/* Letters and digits in any script. A word with none is punctuation. */
const EDGE = /^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu;

export function fold(word: string): string {
	const stripped = word.replace(EDGE, '').replace(/[-‐‑]/g, '').toLowerCase().replace(/ё/g, 'е');
	if (stripped === '') return '';
	return modernisePreReform(stripped)?.toLowerCase().replace(/ё/g, 'е') ?? stripped;
}

/** The old genitive endings' modern spellings, folded. */
function altsOf(word: string): string[] {
	const folded = fold(word);
	return folded === '' ? [] : oldEndingCandidates(folded).map(fold);
}

const same = (a: Token, b: Token): boolean => a.folded === b.folded || a.alts.includes(b.folded) || b.alts.includes(a.folded);

export function tokenize(text: string): Token[] {
	const out: Token[] = [];
	let line = 0;
	let at = 0;
	for (const m of text.matchAll(WORD_OR_NEWLINE)) {
		if (m[0] === '\n') {
			line += 1;
			continue;
		}
		at = m.index ?? at;
		out.push({ start: at, end: at + m[0].length, folded: fold(m[0]), line, alts: altsOf(m[0]) });
	}
	return out;
}

/**
 * Pairs [lyricsIndex, poemIndex] of the longest common subsequence of the folded
 * words, or null past the cap. THE EARLIEST COPY MATCHES: where the Lyrics
 * carry a passage twice and the poem once, the first copy is the poet's and
 * the second is the composer's repeat, so the repeat is what gets coloured.
 * Only a common prefix is trimmed, for that reason; trimming a common suffix
 * would hand the match to the LAST copy.
 */
function align(a: Token[], b: Token[]): [number, number][] | null {
	let lo = 0;
	while (lo < a.length && lo < b.length && same(a[lo], b[lo])) lo += 1;
	const n = a.length - lo;
	const m = b.length - lo;
	if (n * m > MAX_CELLS) return null;
	const pairs: [number, number][] = [];
	for (let i = 0; i < lo; i += 1) pairs.push([i, i]);
	if (n > 0 && m > 0) {
		const w = m + 1;
		const t = new Int32Array((n + 1) * w);
		for (let i = n - 1; i >= 0; i -= 1) {
			for (let j = m - 1; j >= 0; j -= 1) {
				t[i * w + j] = same(a[lo + i], b[lo + j]) ? t[(i + 1) * w + j + 1] + 1 : Math.max(t[(i + 1) * w + j], t[i * w + j + 1]);
			}
		}
		let i = 0;
		let j = 0;
		while (i < n && j < m) {
			if (same(a[lo + i], b[lo + j])) {
				pairs.push([lo + i, lo + j]);
				i += 1;
				j += 1;
			} else if (t[(i + 1) * w + j] >= t[i * w + j + 1]) i += 1;
			else j += 1;
		}
	}
	return pairs;
}

/**
 * Compare the sung text with the poem. Null when there is nothing to compare
 * against (the Poem is empty: "stays blank until the real poem is pasted",
 * Dann 00:38, so nothing is coloured or greyed), when the Lyrics are empty, or
 * when the texts are too long to align (`MAX_CELLS`).
 */
export function comparePoem(lyricsText: string, poemText: string): Comparison | null {
	const lyrics = tokenize(lyricsText);
	const poem = tokenize(poemText);
	const lw = lyrics.filter((x) => x.folded !== '');
	const pw = poem.filter((x) => x.folded !== '');
	if (lw.length === 0 || pw.length === 0) return null;
	const pairs = align(lw, pw);
	if (!pairs) return null;
	const lyricsMatched = lyrics.map((x) => x.folded === '');
	const poemMatched = poem.map((x) => x.folded === '');
	const lAt = new Map(lyrics.map((x, i) => [x, i]));
	const pAt = new Map(poem.map((x, i) => [x, i]));
	const whole: [number, number][] = [];
	for (const [i, j] of pairs) {
		const li = lAt.get(lw[i])!;
		const pj = pAt.get(pw[j])!;
		lyricsMatched[li] = true;
		poemMatched[pj] = true;
		whole.push([li, pj]);
	}
	return {
		lyrics,
		poem,
		lyricsMatched,
		poemMatched,
		differing: lyricsMatched.filter((v) => !v).length,
		omitted: poemMatched.filter((v) => !v).length,
		pairs: whole,
	};
}

/** The text cut into plain and marked pieces. Joined, the pieces are the text exactly. */
function cut(text: string, tokens: Token[], matched: boolean[], mark: 'differs' | 'omitted'): Segment[] {
	const out: Segment[] = [];
	let at = 0;
	tokens.forEach((tok, i) => {
		if (matched[i]) return;
		if (tok.start > at) out.push({ text: text.slice(at, tok.start), kind: 'plain' });
		out.push({ text: text.slice(tok.start, tok.end), kind: mark });
		at = tok.end;
	});
	if (at < text.length) out.push({ text: text.slice(at), kind: 'plain' });
	return out;
}

/** The Lyrics with each word the poem does not carry marked `differs`. */
export function lyricsSegments(text: string, cmp: Comparison | null): Segment[] {
	return cmp ? cut(text, cmp.lyrics, cmp.lyricsMatched, 'differs') : [{ text, kind: 'plain' }];
}

/** The Poem with each word the song does not set marked `omitted`. */
export function poemSegments(text: string, cmp: Comparison | null): Segment[] {
	return cmp ? cut(text, cmp.poem, cmp.poemMatched, 'omitted') : [{ text, kind: 'plain' }];
}

/**
 * THE LYRICS LAID OUT IN THE POEM'S LINES (ruling default 4, Dann 00:32: "adopt
 * the poems line breaks as a means of direct comparison").
 *
 * A matched word stands on its poem word's line. A word the poem does not
 * carry stays inline when the matched words either side of it stand on one
 * line (an altered word, a word repeated inside a line); otherwise it sits
 * between two lines, and a run of such words is a line of its own (a repeated
 * or reordered passage). The poem's blank lines between stanzas are NOT
 * carried over: the brief asks for line ends only.
 *
 * Returns null where there is nothing to adopt: no comparison, or no matched
 * word at all. The words keep their own capitals, punctuation, and hyphens;
 * only the whitespace between them changes.
 */
export function layOutLikePoem(lyricsText: string, poemText: string): string | null {
	const cmp = comparePoem(lyricsText, poemText);
	if (!cmp || cmp.pairs.length === 0) return null;
	const n = cmp.lyrics.length;
	const lineOf = new Array<number | null>(n).fill(null);
	const poemAt = new Array<number | null>(n).fill(null);
	for (const [i, j] of cmp.pairs) {
		lineOf[i] = cmp.poem[j].line;
		poemAt[i] = j;
	}
	const lastOnLine = (j: number): boolean => cmp.poem[j + 1]?.line !== cmp.poem[j].line;
	const firstOnLine = (j: number): boolean => j === 0 || cmp.poem[j - 1].line !== cmp.poem[j].line;
	// The matched word at or after each position.
	const nextAt = new Array<number | null>(n + 1).fill(null);
	for (let i = n - 1; i >= 0; i -= 1) nextAt[i] = poemAt[i] ?? nextAt[i + 1];
	const key: string[] = [];
	let run = 0;
	let previous: number | null = null;
	for (let i = 0; i < n; i += 1) {
		if (poemAt[i] !== null) {
			previous = poemAt[i];
			key.push(`p${lineOf[i]}`);
			continue;
		}
		if (cmp.lyrics[i].folded === '' && i > 0) {
			// Punctuation on its own stays with the word before it.
			key.push(key[i - 1]);
			continue;
		}
		const next = nextAt[i + 1];
		const before = previous === null ? null : cmp.poem[previous].line;
		const after = next === null ? null : cmp.poem[next].line;
		// Inline when the matched words either side stand on one poem line, or
		// when one side has none and the poem still has words on that line to
		// stand in for (an altered last or first word).
		const inline =
			(before !== null && before === after) ||
			(before !== null && next === null && !lastOnLine(previous!)) ||
			(previous === null && after !== null && !firstOnLine(next!));
		if (inline) key.push(`p${before ?? after}`);
		else {
			if (i === 0 || !key[i - 1].startsWith('r')) run += 1;
			key.push(`r${run}`);
		}
	}
	const lines: string[][] = [];
	cmp.lyrics.forEach((tok, i) => {
		const word = lyricsText.slice(tok.start, tok.end);
		if (i > 0 && key[i] === key[i - 1]) lines[lines.length - 1].push(word);
		else lines.push([word]);
	});
	return lines.map((l) => l.join(' ')).join('\n');
}
