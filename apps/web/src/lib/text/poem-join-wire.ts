/**
 * ROW 181 STEP 5. WHAT THE JOIN NEEDS FROM THE PAGE, built from the page's own data (pure, but for `slotsFor` and `joinIsWord`,
 * which call the engine and the dictionary).
 *
 * `poem-join.ts` reads text and counts; it knows no note. This file turns the song into its inputs:
 * - `tokenMapOf`: which LYRICS token (as `comparePoem` numbers them) each transcribed word is, checked word by word against
 *   the folded forms, or null where the two do not line up (the join then does nothing and says so; it never guesses);
 * - `buildRuns`: the maximal runs of sung notes with no word, each with the words either side of it;
 * - `byFromScan`: who placed each LYRICS word, DERIVED from the score's own words rather than stored (a departure from the
 *   review's amendment 11, reported in the step 5 report): a word the score's text has is the print's; a word this join wrote
 *   is the poem's; any other is the singer's hand.
 */
import { modernisePreReform } from '@ilya/dictionary';
import type { VocalLineEvent } from '@ilya/score-parser';
import type { LineData } from '$lib/types';
import { isKnownWord, processText } from '$lib/pipeline';
import { buildSlotQueue, type PairingMap } from '$lib/score/pairings';
import { slurContinuationIds } from '$lib/score/slur-seat';
import type { BarRange } from '$lib/omr/unread-bars';
import { comparePoem, fold, tokenize, type Token } from './poem-compare';
import type { By, JoinRun, SlotLike } from './poem-join';

/** The dictionary as the tiers ask it: known, or known once the old spelling is modernized (`Seams.isWord`, `underlay-seams.ts`). */
export function joinIsWord(word: string): boolean {
	return isKnownWord(word) || (() => {
		const modern = modernisePreReform(word);
		return modern !== null && modern !== undefined && isKnownWord(modern);
	})();
}

/** `buildSlotQueue`'s slots for these words laid out as one line, each tagged with the index of its word in `words`. */
export function slotsFor(words: readonly string[]): SlotLike[] {
	if (words.length === 0) return [];
	const lines = processText(words.join(' '));
	return buildSlotQueue(lines).map((s) => ({ word: s.origin.wordIndex, cyrillic: s.cyrillic }));
}

/** A word's letters and digits only: what two foldings of one word must agree on. `fold` strips a token's edges and its hyphens; the pipeline's `cleanWord` strips every punctuation mark and dash (`pipeline.ts` `PUNCTUATION_REGEX`), so a dash or a bracket inside a word is in one and not the other. */
const core = (s: string): string => s.replace(/[^\p{L}\p{N}]/gu, '');

/** The first place the transcription of Lyrics and Lyrics' own words part company, for the console line (row 181 step 8c). */
export interface TokenMapFailure {
	/** 1-based line of the transcription and 0-based word in it where it was reading; null where it had run out of words. */
	line: number | null;
	word: number | null;
	/** The transcription's word, folded (`fold(cleanWord)`), and the words read toward this token so far, joined. */
	transcription: string | null;
	read: string;
	/** The LYRICS token it was matching: its index in `comparePoem`'s numbering, its raw text, its folded form; null where Lyrics had run out. */
	token: number | null;
	tokenRaw: string | null;
	tokenFolded: string | null;
	/** The counts of words with letters in the transcription and tokens with letters in Lyrics. */
	words: number;
	tokens: number;
}

export interface TokenMapReport {
	map: Map<string, number> | null;
	failure?: TokenMapFailure;
}

/**
 * Which LYRICS token each transcribed word is, keyed `lineIndex:wordIndex`, and where it first fails to be.
 *
 * The lines are the transcription of the LYRICS text. Walking their words in order against the LYRICS tokens that carry letters,
 * a token may be MORE THAN ONE transcribed word: the pipeline splits a token ending in a hyphenated particle («велит-ли»,
 * «ска-же»: `expandHyphenatedParticles`, `typed-hyphens.ts:146-161`, called at `pipeline.ts:181-183`), and both words are that
 * token. The words read toward a token, joined, must equal the token's letters. Both sides are compared as letters and digits
 * only (`core`), because `fold` leaves a dash or a bracket inside a word that `cleanWord` strips (a token «сред—ь» against the
 * word «Средь»). If a word cannot be part of the token being matched, or the counts run out unequal, there is no map and the
 * failure names the first place it happened, so the join does nothing and the console says exactly where.
 */
export function tokenMapReport(lines: readonly LineData[], lyrics: string): TokenMapReport {
	const tokens = tokenize(lyrics);
	const lettered = tokens.map((t, i) => (t.folded === '' ? -1 : i)).filter((i) => i >= 0);
	const out = new Map<string, number>();
	let words = 0;
	for (const line of lines) for (const w of line.words) if (core(fold(w.cleanWord)) !== '') words++;
	const fail = (line: number | null, word: number | null, transcription: string | null, read: string, at: number | undefined): TokenMapReport => ({
		map: null,
		failure: { line, word, transcription, read, token: at ?? null, tokenRaw: at === undefined ? null : lyrics.slice(tokens[at].start, tokens[at].end), tokenFolded: at === undefined ? null : tokens[at].folded, words, tokens: lettered.length },
	});
	let next = 0;
	let read = '';
	for (const [lineIndex, line] of lines.entries()) {
		for (const [wordIndex, word] of line.words.entries()) {
			const f = core(fold(word.cleanWord));
			if (f === '') continue;
			const at = lettered[next];
			if (at === undefined) return fail(lineIndex + 1, wordIndex, fold(word.cleanWord), read, undefined);
			const target = core(tokens[at].folded);
			const so_far = read + f;
			if (!target.startsWith(so_far)) return fail(lineIndex + 1, wordIndex, fold(word.cleanWord), read, at);
			out.set(`${lineIndex}:${wordIndex}`, at);
			if (so_far === target) {
				next++;
				read = '';
			} else read = so_far;
		}
	}
	if (read !== '' || next !== lettered.length) return fail(null, null, null, read, lettered[next]);
	return { map: out };
}

/** `tokenMapReport`'s map, or null where the transcription and Lyrics do not line up. */
export function tokenMapOf(lines: readonly LineData[], lyrics: string): Map<string, number> | null {
	return tokenMapReport(lines, lyrics).map;
}

/** One line for the console naming the first disagreement. */
export function describeFailure(f: TokenMapFailure): string {
	const where = f.line === null ? 'after the last transcribed word' : `at line ${f.line}, word ${f.word}`;
	const had = f.transcription === null ? 'no further word' : `the transcription's «${f.transcription}»${f.read ? ` (after «${f.read}»)` : ''}`;
	const want = f.token === null ? 'no further token' : `Lyrics token ${f.token} «${f.tokenRaw}» (folded «${f.tokenFolded}»)`;
	return `the transcription of Lyrics does not line up with its words, so nothing is joined: ${where}, ${had} against ${want}; ${f.words} transcribed word(s) and ${f.tokens} Lyrics token(s) with letters`;
}

/** The sung notes as the runs need them: `VocalLineEvent` satisfies it. */
export type RunEvent = Pick<VocalLineEvent, 'id' | 'type' | 'measureIndex' | 'tied'> & { slurs?: VocalLineEvent['slurs'] };

export interface RunsOut {
	runs: JoinRun[];
	/** Syllable pairings whose word the map could not place: their neighbours' runs are unanchored. */
	unmapped: number;
}

/**
 * The maximal runs of sung notes that need a word and have none, between the notes that carry one. A note needs a word where
 * it is not a continuation (a tie into it, or a melisma decision, which is how a scan's extender and a passed slur gate reach
 * the typed path) and no decision of the singer's is on it. A decided-empty note, and a syllable the map cannot place, end a run
 * with an unanchored side (`NaN`), so the join offers and fills nothing there.
 *
 * The run's counts: the notes that need a word, and the same less those under a printed slur (amendment 8; the slur gate passes
 * only when the counts agree, so the join tests both). A run in a bar the banner lists is an unread system.
 */
export function buildRuns(events: readonly RunEvent[], pairings: PairingMap, tokenOf: Map<string, number>, unreadBars: readonly BarRange[], tokenCount: number): RunsOut {
	const slurred = slurContinuationIds(events as Parameters<typeof slurContinuationIds>[0]);
	const runs: JoinRun[] = [];
	let unmapped = 0;
	let after: number = -1;
	let current: RunEvent[] = [];
	const close = (before: number): void => {
		if (current.length === 0) return;
		const bars = current.map((e) => e.measureIndex + 1);
		const first: [number, number] = [Math.min(...bars), Math.max(...bars)];
		const n = current.length;
		const unslurred = current.filter((e) => !slurred.has(e.id)).length;
		runs.push({
			id: `run-${current[0].id}`,
			kind: unreadBars.some(([a, b]) => first[0] <= b && first[1] >= a) ? 'unread' : 'blank',
			afterWord: after,
			beforeWord: before,
			needs: [...new Set([n, unslurred])],
			bars: first,
		});
		current = [];
	};
	for (const ev of events) {
		if (ev.type !== 'note') continue;
		const p = pairings[ev.id];
		if (ev.tied?.type === 'stop' || ev.tied?.type === 'continue' || p?.kind === 'melisma') continue;
		if (p === undefined) {
			current.push(ev);
			continue;
		}
		if (p.kind === 'syllable') {
			const token = tokenOf.get(`${p.origin.lineIndex}:${p.origin.wordIndex}`);
			if (token === undefined) unmapped++;
			close(token ?? Number.NaN);
			after = token ?? Number.NaN;
		} else {
			// A decided-empty note is the singer's: a run cannot cross it, and neither side is a word.
			close(Number.NaN);
			after = Number.NaN;
		}
	}
	close(tokenCount);
	return { runs, unmapped };
}

/**
 * Who placed each LYRICS token. A token the score's own text carries (paired with it by `comparePoem`) is the print's, a token
 * inside one of `written` (token indices the join wrote, still valid) is the poem's, and any other is the singer's hand.
 */
export function byFromScan(lyrics: string, scanText: string, written: ReadonlySet<number>): (token: number) => By {
	const cmp = comparePoem(lyrics, scanText);
	const printed = new Set((cmp?.pairs ?? []).map(([i]) => i));
	return (i) => (written.has(i) ? 'poem' : printed.has(i) ? 'print' : cmp ? 'hand' : 'print');
}

/** The indices of the LYRICS tokens that lie inside any of the ranges. */
export function tokensIn(text: string, ranges: readonly { start: number; end: number }[]): number[] {
	const tokens: Token[] = tokenize(text);
	return tokens.flatMap((t, i) => (t.folded !== '' && ranges.some((r) => t.start < r.end && t.end > r.start) ? [i] : []));
}
