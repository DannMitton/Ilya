/**
 * ROW 181 STEP 4. JOINING POEM TO LYRICS ON A SCAN: THE JOIN, PURE.
 *
 * Where the reader of a scan gave a garbled word, or left notes with no word, the poem Ilya filled from its library
 * (or the singer pasted) can say what the print most likely shows. This module decides, and only decides. It reads LYRICS
 * and POEM as text, never writes either; its answer is a list of proposals and, for the ones that apply, the LYRICS text
 * they would make (`applyProposals`). The page puts that text through the paths a typed edit takes (`handleInput`), so the
 * seats follow by the diff (`score/reseat.ts`: a replaced word takes the notes the old one vacated, an inserted word takes
 * open notes). POEM is never altered (Dann 2026-11-04 10:12 item 3). Same input, same output: Ilya is not AI.
 *
 * THE RULINGS THIS BUILDS: `OPEN.md` "JOINING POEM TO LYRICS ON A SCAN" items 1 to 16; "N.135 STAGE 3, HOW ILYA SEATS TEXT
 * ON NOTES" (the tiers, the rule over all of it); `CONTRACT.md` §0.1 (one vowel per note, no exceptions).
 *
 * THE COUNT (review amendment 7). Every count of syllables here is the number of SLOTS `buildSlotQueue` gives the words in
 * question (one per vowel-bearing unit, clitics fused), through the injected `slotsOf`. Never `syllabify`'s length, and no
 * vowel list of this file's own: a proposal's slots go through `vowelsPerNote`, the check the scan path counts with.
 *
 * THE ALIGNMENT. `comparePoem`'s pairs are the words that match exactly (an LCS, the earliest copy matching). Between two
 * pairs the unmatched LYRICS words and unmatched POEM words (the gap) are aligned by letters: one to one by position where
 * the gap has as many on both sides (two matching anchors are the evidence), else by edit distance (`NEAR`). A LYRICS word
 * the gap leaves over, standing between pairs (i, p) and (j, q), whose folded form equals or is one confusion pair from a
 * POEM word in p..q (amendment 10), is a REPEAT and takes that word as its aligned word. A jump back in the poem is not used
 * to seat anything: the LCS never makes one, and `phraseEnd` (row 108) is NOT BUILT here (reported).
 *
 * THE TIERS, per aligned pair of words that differ (amendment 5 for tier 1):
 *  1. REPAIR, applied, marked: the scan's word fails the dictionary and the poem's passes, and both have the same number
 *     of slots. The character-set test of 2026-10-20 is not a gate (Dann 2026-11-04 10:12 item 1: "garbled or not").
 *  2. KEEP THE COMPOSER'S WORD, marked, nothing applied: both are real words and not close; or the scan's is real and the
 *     poem's is not in the dictionary (a poetic form).
 *  3. OFFER, never applied: both real and one letter or one confusion pair apart; or the scan's fails and the poem's
 *     passes but the slot counts differ; or both fail.
 * A word the singer typed or placed by hand (`by` 'hand') is still tested, and only where provably wrong (a character outside
 * the allowed set, or one confusion pair from the poem's word) gets a tier 3 offer; never applied (the rule over all of it).
 *
 * THE RUNS. A run of notes with no word (a maximal run of non-continuation sung notes with no syllable, or an unread system)
 * standing between two words that are aligned to poem words p and q takes the poem's words p+1 .. q-1, only where their slot
 * count is one of the run's counts (a blank run has one; an unread system has two, ties alone and ties with the slur,
 * amendment 8). Else, or where q = p+1 (a composer's repeat with no words read), it is an OFFER and its bar stays in the
 * banner; the Loupe's "Fill from the poem" is the door (Dann 2026-11-04 14:00). The song's start and end are anchors.
 *
 * EVERY PROPOSAL PASSES THE ONE-VOWEL CHECK before it is returned (`CONTRACT.md` §0.1): a proposal whose slots break it is
 * dropped and counted (`dropped`). `crossCheck` runs the word-level tiers a second time on the plan's own output; a second
 * pass that finds anything to repair is a FAULT, counted and reported, never looped further (Dann 10:36, item 7).
 *
 * NUMBERS THAT ARE JUDGEMENT, not measured (row 114 sets them): `NEAR`, `GAP`, and the confusion table. Each is named where
 * it stands. Pure.
 */
import { vowelsPerNote } from '$lib/omr/vowels-per-note';
import { comparePoem, fold, type Comparison } from './poem-compare';

/** Who placed a word: the print (a scan's reader), the poem (this join), the singer's hand, or a score file. */
export type By = 'print' | 'poem' | 'hand' | 'file';

/** One slot, as `buildSlotQueue` gives it: the word (index into the words asked about) and the syllable's Cyrillic. */
export interface SlotLike {
	word: number;
	cyrillic: string;
}

export interface JoinRun {
	id: string;
	kind: 'blank' | 'unread';
	/** The LYRICS word (token index, as `comparePoem` numbers them) the run follows; -1 at the song's start. */
	afterWord: number;
	/** The LYRICS word the run precedes; the number of LYRICS tokens at the song's end. */
	beforeWord: number;
	/** The counts of notes that need a word: a blank run has one; an unread system two (ties alone, ties with the slur). */
	needs: number[];
	bars: readonly [number, number];
}

export interface JoinInput {
	lyrics: string;
	poem: string;
	/** Provenance of each LYRICS token (`comparePoem`'s token index); absent, `'print'`. */
	by?: (lyricsToken: number) => By;
	/** `buildSlotQueue`'s slots for these words laid out as one text (clitics fuse within it). */
	slotsOf: (words: readonly string[]) => SlotLike[];
	/** The dictionary after normalizing (`isKnownWord`, then `modernisePreReform`: `Seams.isWord`). */
	isWord: (word: string) => boolean;
	runs?: readonly JoinRun[];
}

/** Why a proposal is an offer and nothing more. */
export type OfferWhy = 'real-close' | 'count' | 'both-fail' | 'hand-wrong' | 'unanchored' | 'inside-word' | 'repeat' | 'order' | 'count-refused' | 'no-poem' | 'vowel';

export type Proposal =
	| { kind: 'repair'; lyricsToken: number; poemToken: number; from: string; to: string }
	| { kind: 'keep-composer'; lyricsToken: number; poemToken: number }
	| { kind: 'fill'; run: string; afterWord: number; poemFrom: number; poemTo: number; slots: number }
	| { kind: 'offer'; lyricsToken: number | null; poemToken: number | null; run?: string; why: OfferWhy; poemFrom?: number; poemTo?: number };

export interface JoinResult {
	proposals: Proposal[];
	/** Proposals dropped by the one-vowel check, by the proposal's kind. */
	dropped: { repair: number; fill: number };
	/** The aligned poem token of each LYRICS token that has one, and how. */
	aligned: Map<number, { poem: number; how: 'pair' | 'gap' | 'repeat' }>;
	comparison: Comparison | null;
}

/**
 * Normalized edit distance at or under which two words in a gap are taken for one another when the gap has unequal sides.
 * JUDGEMENT, not measured.
 */
export const NEAR = 0.5;
/** The cost of leaving a word unaligned in the gap's alignment, against a distance in 0..1. JUDGEMENT. */
export const GAP = 0.5;

/**
 * OCR confusions of Cyrillic print, symmetric, substitutions only (the list never holds a deletion: «иль» from «или» is not
 * overwritten; `OPEN.md` stage 3 item 6). A PLACEHOLDER: the measure on row 114's truth files sets the real list
 * (`OPEN.md` item 9). JUDGEMENT.
 */
const CONFUSIONS = ['ин', 'пн', 'оа', 'ес', 'шщ', 'ий', 'ьъ', 'тг', 'лд', 'бв', 'чу', 'цщ', 'еэ', 'ыи', 'зв'];
const CONFUSED = new Set(CONFUSIONS.flatMap((p) => [`${p[0]}${p[1]}`, `${p[1]}${p[0]}`]));

/** Letters outside the modern Russian alphabet (ё included) and the old letters ѣ і ѵ ѳ: the character-set test of 2026-10-20, kept for a hand-edited word. */
const ALLOWED = /^[а-яё]+$/u;

export function distance(a: string, b: string): number {
	const m = a.length;
	const n = b.length;
	let prev = Array.from({ length: n + 1 }, (_, j) => j);
	for (let i = 1; i <= m; i++) {
		const cur = [i];
		for (let j = 1; j <= n; j++) cur.push(Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)));
		prev = cur;
	}
	return prev[n];
}

/** One letter apart (a substitution, an insertion, or a deletion), or the same length and every differing letter a known confusion pair. */
export function isClose(a: string, b: string): boolean {
	if (a === b) return false;
	if (distance(a, b) === 1) return true;
	if (a.length !== b.length) return false;
	let differing = 0;
	for (let i = 0; i < a.length; i++) {
		if (a[i] === b[i]) continue;
		if (!CONFUSED.has(`${a[i]}${b[i]}`)) return false;
		differing++;
	}
	return differing > 0;
}

/** Same length, at least one letter differs, and every differing letter is a confusion pair. */
function confusionPairApart(a: string, b: string): boolean {
	if (a === b || a.length !== b.length) return false;
	return [...a].every((c, i) => c === b[i] || CONFUSED.has(`${c}${b[i]}`));
}

const normalized = (a: string, b: string): number => distance(a, b) / Math.max(a.length, b.length, 1);

/** The raw text of a token: its slice of the text it came from. */
const rawOf = (text: string, t: { start: number; end: number }): string => text.slice(t.start, t.end);

/** The word's letters only: the edges stripped, as `fold` strips them, without lower-casing or the modern spelling. */
export function coreOf(raw: string): string {
	return raw.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
}

/** Align a gap's LYRICS tokens with its POEM tokens (indices into the comparison's token lists): pairs in order. */
function alignGap(cmp: Comparison, l: number[], p: number[]): [number, number][] {
	if (l.length === 0 || p.length === 0) return [];
	if (l.length === p.length) return l.map((li, k) => [li, p[k]] as [number, number]);
	const cost = (a: number, b: number): number => normalized(cmp.lyrics[a].folded, cmp.poem[b].folded);
	// Monotone alignment by dynamic programming: match at the distance, or leave a word out at GAP.
	const n = l.length;
	const m = p.length;
	const t: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
	for (let i = n; i >= 0; i--) {
		for (let j = m; j >= 0; j--) {
			if (i === n) t[i][j] = (m - j) * GAP;
			else if (j === m) t[i][j] = (n - i) * GAP;
			else t[i][j] = Math.min(t[i + 1][j + 1] + cost(l[i], p[j]), t[i + 1][j] + GAP, t[i][j + 1] + GAP);
		}
	}
	const out: [number, number][] = [];
	let i = 0;
	let j = 0;
	while (i < n && j < m) {
		const here = t[i][j];
		if (Math.abs(here - (t[i + 1][j + 1] + cost(l[i], p[j]))) < 1e-9) {
			if (cost(l[i], p[j]) <= NEAR) out.push([l[i], p[j]]);
			i++;
			j++;
		} else if (Math.abs(here - (t[i + 1][j] + GAP)) < 1e-9) i++;
		else j++;
	}
	return out;
}

/** The aligned poem token of each LYRICS token that has one (a pair, a gap alignment, or a repeat). */
function alignWords(cmp: Comparison): Map<number, { poem: number; how: 'pair' | 'gap' | 'repeat' }> {
	const out = new Map<number, { poem: number; how: 'pair' | 'gap' | 'repeat' }>();
	for (const [i, j] of cmp.pairs) out.set(i, { poem: j, how: 'pair' });
	const lAll = cmp.lyrics.map((_, i) => i).filter((i) => cmp.lyrics[i].folded !== '');
	const pAll = cmp.poem.map((_, i) => i).filter((i) => cmp.poem[i].folded !== '');
	const bounds: [number, number][] = [[-1, -1], ...cmp.pairs, [cmp.lyrics.length, cmp.poem.length]];
	for (let k = 0; k + 1 < bounds.length; k++) {
		const [i, p] = bounds[k];
		const [j, q] = bounds[k + 1];
		const l = lAll.filter((x) => x > i && x < j && !out.has(x));
		const pg = pAll.filter((x) => x > p && x < q && !cmp.poemMatched[x]);
		const taken = new Set<number>();
		for (const [li, pi] of alignGap(cmp, l, pg)) {
			out.set(li, { poem: pi, how: 'gap' });
			taken.add(li);
		}
		// A repeat (amendment 10): a word left over whose folded form equals, or is one confusion pair from, a poem word in the window p..q.
		for (const li of l) {
			if (taken.has(li)) continue;
			const f = cmp.lyrics[li].folded;
			const hit = pAll.find((x) => x >= Math.max(p, 0) && x <= Math.min(q, cmp.poem.length - 1) && (cmp.poem[x].folded === f || confusionPairApart(f, cmp.poem[x].folded)));
			if (hit !== undefined) out.set(li, { poem: hit, how: 'repeat' });
		}
	}
	return out;
}

/** The slots of each word, from one call: `perWord[k]` are the slots of `words[k]`, and `okWord[k]` that none of them breaks the one-vowel check (`vowelsPerNote`). */
function slotsFor(input: JoinInput, words: readonly string[]): { perWord: SlotLike[][]; okWord: boolean[]; ok: boolean } {
	const slots = input.slotsOf(words);
	const perWord: SlotLike[][] = words.map(() => []);
	for (const s of slots) perWord[s.word]?.push(s);
	const okWord = perWord.map((w) => vowelsPerNote(w.map((s, id) => ({ id, text: s.cyrillic })), { noSyllable: false }).length === 0);
	return { perWord, okWord, ok: okWord.every(Boolean) };
}

/** Plan the join. */
export function planJoin(input: JoinInput): JoinResult {
	const cmp = comparePoem(input.lyrics, input.poem);
	const result: JoinResult = { proposals: [], dropped: { repair: 0, fill: 0 }, aligned: new Map(), comparison: cmp };
	if (!cmp) {
		for (const run of input.runs ?? []) result.proposals.push({ kind: 'offer', lyricsToken: null, poemToken: null, run: run.id, why: 'no-poem' });
		return result;
	}
	const by = input.by ?? (() => 'print' as By);
	result.aligned = alignWords(cmp);
	const lyricsOf = (i: number): string => coreOf(rawOf(input.lyrics, cmp.lyrics[i]));
	const poemOf = (j: number): string => coreOf(rawOf(input.poem, cmp.poem[j]));

	// Word by word: the tiers, for each aligned pair whose folded forms differ.
	for (const [i, { poem: j, how }] of [...result.aligned.entries()].sort((a, b) => a[0] - b[0])) {
		const lf = cmp.lyrics[i].folded;
		const pf = cmp.poem[j].folded;
		if (how === 'pair' || lf === pf) continue;
		if (by(i) === 'poem') continue;
		const lw = lyricsOf(i);
		const pw = poemOf(j);
		const hand = by(i) === 'hand';
		const scanKnown = input.isWord(lf);
		const poemKnown = input.isWord(pf);
		if (hand) {
			// A hand word is tested, and only where provably wrong does it get an offer.
			if (!ALLOWED.test(lf) || confusionPairApart(lf, pf)) result.proposals.push({ kind: 'offer', lyricsToken: i, poemToken: j, why: 'hand-wrong' });
			continue;
		}
		if (!scanKnown && poemKnown) {
			const { perWord, okWord } = slotsFor(input, [lw, pw]);
			if (perWord[0].length !== perWord[1].length) result.proposals.push({ kind: 'offer', lyricsToken: i, poemToken: j, why: 'count' });
			else if (!okWord[1] || perWord[1].length === 0) result.dropped.repair++;
			else result.proposals.push({ kind: 'repair', lyricsToken: i, poemToken: j, from: lw, to: pw });
		} else if (scanKnown && poemKnown) {
			if (isClose(lf, pf)) result.proposals.push({ kind: 'offer', lyricsToken: i, poemToken: j, why: 'real-close' });
			else result.proposals.push({ kind: 'keep-composer', lyricsToken: i, poemToken: j });
		} else if (scanKnown && !poemKnown) result.proposals.push({ kind: 'keep-composer', lyricsToken: i, poemToken: j });
		else result.proposals.push({ kind: 'offer', lyricsToken: i, poemToken: j, why: 'both-fail' });
	}

	// The runs: a stretch of notes with no word, between two aligned words.
	for (const run of input.runs ?? []) {
		const a = run.afterWord < 0 ? { poem: -1 } : result.aligned.get(run.afterWord);
		const b = run.beforeWord >= cmp.lyrics.length ? { poem: cmp.poem.length } : result.aligned.get(run.beforeWord);
		const offer = (why: OfferWhy, extra: { poemFrom?: number; poemTo?: number } = {}): void => {
			result.proposals.push({ kind: 'offer', lyricsToken: null, poemToken: null, run: run.id, why, ...extra });
		};
		if (run.afterWord >= 0 && run.afterWord === run.beforeWord) {
			offer('inside-word');
			continue;
		}
		if (!a || !b) {
			offer('unanchored');
			continue;
		}
		if (b.poem <= a.poem) {
			offer('order');
			continue;
		}
		if (b.poem === a.poem + 1) {
			offer('repeat');
			continue;
		}
		const from = a.poem + 1;
		const to = b.poem - 1;
		const words: number[] = [];
		for (let x = from; x <= to; x++) if (cmp.poem[x].folded !== '') words.push(x);
		const { perWord, ok } = slotsFor(input, words.map(poemOf));
		const count = perWord.reduce((n, s) => n + s.length, 0);
		if (!run.needs.includes(count)) offer('count-refused', { poemFrom: from, poemTo: to });
		else if (!ok || count === 0) {
			result.dropped.fill++;
			offer('vowel', { poemFrom: from, poemTo: to });
		} else result.proposals.push({ kind: 'fill', run: run.id, afterWord: run.afterWord, poemFrom: from, poemTo: to, slots: count });
	}
	return result;
}

/** A word the join wrote into LYRICS, where it stands in the text `applyProposals` returned: for the dotted underline. */
export interface Written {
	start: number;
	end: number;
	kind: 'repair' | 'fill';
	/** The scan's word that stood there (a repair); '' for a fill. */
	was: string;
}

/**
 * The LYRICS text the applying proposals make, and where the written words stand in it. A repair puts the poem's letters in
 * place of the scan's, keeping the scan's own punctuation at the word's ends; a fill inserts the poem's words, with their
 * own punctuation, after the word the run follows. Nothing else changes. `keep-composer` and `offer` apply nothing.
 */
export function applyProposals(input: Pick<JoinInput, 'lyrics' | 'poem'>, result: JoinResult): { text: string; written: Written[] } {
	const cmp = result.comparison;
	if (!cmp) return { text: input.lyrics, written: [] };
	type Edit = { at: number; end: number; text: string; kind: 'repair' | 'fill'; was: string };
	const edits: Edit[] = [];
	for (const p of result.proposals) {
		if (p.kind === 'repair') {
			const t = cmp.lyrics[p.lyricsToken];
			const raw = rawOf(input.lyrics, t);
			const core = coreOf(raw);
			const at = t.start + raw.indexOf(core);
			edits.push({ at, end: at + core.length, text: p.to, kind: 'repair', was: core });
		} else if (p.kind === 'fill') {
			const after = p.afterWord < 0 ? 0 : cmp.lyrics[p.afterWord].end;
			const words: string[] = [];
			for (let x = p.poemFrom; x <= p.poemTo; x++) if (cmp.poem[x].folded !== '') words.push(rawOf(input.poem, cmp.poem[x]));
			edits.push({ at: after, end: after, text: p.afterWord < 0 ? `${words.join(' ')} ` : ` ${words.join(' ')}`, kind: 'fill', was: '' });
		}
	}
	edits.sort((a, b) => a.at - b.at || a.end - b.end);
	let text = '';
	let at = 0;
	const written: Written[] = [];
	for (const e of edits) {
		text += input.lyrics.slice(at, e.at);
		const lead = e.kind === 'fill' && e.text.startsWith(' ') ? 1 : 0;
		const start = text.length + lead;
		text += e.text;
		written.push({ start, end: text.length - (e.kind === 'fill' && e.text.endsWith(' ') && e.at === 0 ? 1 : 0), kind: e.kind, was: e.was });
		at = e.end;
	}
	return { text: text + input.lyrics.slice(at), written };
}

/**
 * The cross-check (Dann 2026-11-04 10:36, item 7): the word-level tiers run again on the text the plan made. A repaired word
 * now matches the poem's; a second pass that finds anything to REPAIR is a fault. Counted and returned, never looped further.
 * The runs are not re-checked here: the notes they stand on are not in this module; the page runs the join again on the real
 * post-application state (step 5) and reports the same fault count.
 */
export function crossCheck(input: JoinInput, result: JoinResult): { text: string; fault: number } {
	const applied = applyProposals(input, result);
	// Words this join wrote are the poem's now: mark them so the second pass leaves them to the poem.
	const second = planJoin({ ...input, lyrics: applied.text, runs: [], by: undefined });
	return { text: applied.text, fault: second.proposals.filter((p) => p.kind === 'repair').length };
}

/** `fold`, re-exported so a caller keys words the way the join does. */
export { fold };
