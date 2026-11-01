/**
 * Row 163 step 7 (review amendment 16): which line stands under Input's view pair.
 *
 * `intake.view.landedLyrics` ("Add the whole published poem here") points at the Poem field, so it shows only while
 * Poem is the view, Poem is empty, and Lyrics holds the score's words (Dann 2026-10-30 14:46: save the singer from
 * wondering why Lyrics is full while Poem is empty). It no longer depends on a file having just been dropped, so a song
 * reopened later shows it too. Under Lyrics the line is `lyricsLine`, never the Poem's. DESK DEFAULT, reversible.
 * `landedPoem` still follows a page that read as a poem, in whichever view is showing.
 */
import type { InputView } from './input-views.svelte';

export function introLine(view: InputView, landed: InputView | null, scoreWords: boolean, poemText: string): string {
	if (view === 'poem' && scoreWords && poemText.trim() === '') return 'intake.view.landedLyrics';
	if (landed === 'poem') return 'intake.view.landedPoem';
	return view === 'poem' ? 'intake.view.poemLine' : 'intake.view.lyricsLine';
}
