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

/**
 * Which LYRICS token each transcribed word is, keyed `lineIndex:wordIndex`. The lines are the transcription of the LYRICS text,
 * so walking their words in order against the LYRICS tokens that carry letters must agree on every folded form; if one does not
 * (a word split or dropped by the transcription), the map is null and the join does nothing.
 */
export function tokenMapOf(lines: readonly LineData[], lyrics: string): Map<string, number> | null {
	const tokens = tokenize(lyrics);
	const lettered = tokens.map((t, i) => (t.folded === '' ? -1 : i)).filter((i) => i >= 0);
	const out = new Map<string, number>();
	let next = 0;
	for (const [lineIndex, line] of lines.entries()) {
		for (const [wordIndex, word] of line.words.entries()) {
			const f = fold(word.cleanWord);
			if (f === '') continue;
			const at = lettered[next++];
			if (at === undefined || tokens[at].folded !== f) return null;
			out.set(`${lineIndex}:${wordIndex}`, at);
		}
	}
	return next === lettered.length ? out : null;
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
