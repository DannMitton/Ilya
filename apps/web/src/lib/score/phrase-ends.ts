/**
 * WHERE THE MUSIC ENDS A PHRASE (QUEUE row 108, Part C).
 *
 * A word's sound depends on its sung neighbours and on where a phrase ends
 * (`OPEN.md`, N.135 stage 3, default 7). Where a score is attached and a word
 * sits on its notes, the phrase end is the music's: a rest, a breath mark, a
 * caesura, or a fermata between that word and the next one the score places.
 * Everywhere else a line end stays a phrase end (`boundaries.ts`).
 *
 * DESK DEFAULTS, from `docs/sessions/brief-code-row108-lyrics-lines_r3_2026-10-19.md`
 * section 3:
 *
 * - A word is SEATED when a `syllable` pairing carries its `lineIndex`,
 *   `wordIndex`, and `origin.word` equal to the word standing there in the
 *   transcribed text. Whoever placed it, the music is the music.
 * - "The next word" skips a word with no vowel (it owns no slot). Any other
 *   unseated next word leaves the word with no key.
 * - The span is the vocal line from the word's last seated note up to the note
 *   before the next word's first seated note. It includes the word's melisma
 *   continuation notes, which are their own events. A silence with no rest
 *   event does not count.
 * - If the next word's first note does not come after this word's last, there
 *   is no key.
 *
 * Reads `parsed.vocalLine` directly; the score package is unchanged.
 */
import type { ParsedScore, VocalLineEvent } from '@ilya/score-parser';
import type { PairingMap } from './pairings';

const HAS_VOWEL = /[аеёиоуыэюяѣіѵ]/i;

function endsPhrase(ev: VocalLineEvent): boolean {
	if (ev.type === 'rest') return true;
	if (ev.fermata) return true;
	return (ev.articulations ?? []).some((a) => a === 'breath-mark' || a === 'caesura');
}

/**
 * Keyed `"lineIndex-wordIndex"`: `true` where the music ends a phrase after
 * the word, `false` where it does not, no key where the line-end rule applies.
 */
export function musicPhraseEnds(
	parsed: ParsedScore,
	map: PairingMap,
	grid: readonly (readonly string[])[],
): Map<string, boolean> {
	const out = new Map<string, boolean>();
	const events = parsed.vocalLine;
	const index = new Map(events.map((e, i) => [e.id, i]));

	// Each seated word's first and last note, by its address.
	const span = new Map<string, { first: number; last: number }>();
	for (const [eventId, p] of Object.entries(map)) {
		if (p.kind !== 'syllable') continue;
		const at = index.get(eventId);
		if (at === undefined) continue;
		const { lineIndex, wordIndex, word } = p.origin;
		if (word === undefined || grid[lineIndex]?.[wordIndex] !== word) continue;
		const key = `${lineIndex}-${wordIndex}`;
		const s = span.get(key);
		if (s) {
			s.first = Math.min(s.first, at);
			s.last = Math.max(s.last, at);
		} else span.set(key, { first: at, last: at });
	}

	const flat = grid.flatMap((line, l) => line.map((word, w) => ({ key: `${l}-${w}`, word })));
	flat.forEach((a, i) => {
		const mine = span.get(a.key);
		if (!mine) return;
		let next = i + 1;
		while (next < flat.length && !HAS_VOWEL.test(flat[next].word)) next++;
		const theirs = next < flat.length ? span.get(flat[next].key) : undefined;
		if (!theirs || theirs.first <= mine.last) return;
		out.set(a.key, events.slice(mine.last, theirs.first).some(endsPhrase));
	});
	return out;
}

/** A string for the set, so the page can tell whether the phrase ends changed. */
export function phraseEndsKey(ends: ReadonlyMap<string, boolean> | undefined): string {
	if (!ends) return '';
	return [...ends].map(([k, v]) => `${k}:${v ? 1 : 0}`).sort().join(',');
}

/**
 * Whether the page re-runs the pipeline for a changed set of phrase ends:
 * only when the set changed AND the transcription describes the field's text.
 * While the singer is typing the two differ, and the run waits for the pause.
 */
export function shouldRerunForPhraseEnds(
	lastKey: string,
	nextKey: string,
	transcribedText: string | null,
	inputText: string,
	hasLines: boolean,
): boolean {
	return hasLines && nextKey !== lastKey && transcribedText === inputText;
}
