/**
 * N.160 step 3. THE RE-SEAT DIFFS AGAINST THE SEATED TEXT.
 *
 * The seats describe one text: the poem as it was the last time they were
 * re-seated (`SongRecord.seatedText`). Before this, the re-seat diffed the
 * new poem against the SESSION's previous grid, which a Clear, a reload, and
 * a song switch all empty while the seats survive, so the first
 * transcription after any of them found no previous text and moved nothing.
 * That is the freeze (`memo-n160b-the-approach_r1_2026-09-21.md` s0).
 *
 * The diff itself is `text-diff.ts`'s, and the rules it feeds are
 * `reseat.ts`'s, ruled by Dann 2026-09-07. Nothing here matches, guesses, or
 * guards: this only chooses the right BEFORE text.
 */
import { wordGrid } from '$lib/pipeline';
import { diffWordGrid, emptyDiff, type TextDiff } from '$lib/text-diff';

/**
 * The diff from the text the seats describe to the poem now, and the grid of
 * that text, which `reseatByDiff` reads as `before` to tell a seat made from
 * this text from one made from the score's own words.
 *
 * An empty seated text has no words to diff from, and gives the identity
 * diff, exactly as an empty session grid did.
 */
export function seatedTextDiff(
	seatedText: string,
	poem: string,
): { diff: TextDiff; before: string[][] } {
	const before = wordGrid(seatedText);
	if (before.length === 0 || seatedText === poem) return { diff: emptyDiff(), before };
	return { diff: diffWordGrid(before, wordGrid(poem)), before };
}
