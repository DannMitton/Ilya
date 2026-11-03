/**
 * Row 163 step 7 (review amendment 16): which line stands under Input's view pair.
 *
 * `intake.view.landedLyrics` ("Add the whole published poem here") points at the Poem field, so it shows only while
 * Poem is the view, Poem is empty, and Lyrics holds the score's words (Dann 2026-10-30 14:46: save the singer from
 * wondering why Lyrics is full while Poem is empty). It no longer depends on a file having just been dropped, so a song
 * reopened later shows it too. Under Lyrics the line is `lyricsLine`, never the Poem's. DESK DEFAULT, reversible.
 * `landedPoem` still follows a page that read as a poem, in whichever view is showing.
 *
 * POEM LIBRARY, BUILD 1 (2026-11-03, walk items 3 and 6): where the poem on the song is one Ilya filled from its
 * library and the singer has answered the card, Poem's line is the quiet line naming where it came from
 * (`libraryPoem`: kept as it was), or the based-on line (`libraryPoemEdited`: she has changed it, and the source still
 * shows, since attribution is never dropped silently). POEM ONLY: under LYRICS `lyricsLine` stands (review amendment 15).
 * `library` is null while the card is unanswered (the card says it), where the song's poem is her own, and where the
 * library has no entry for the stored work (the file is not loaded, or a later library dropped it): then `poemLine` stands.
 */
import type { InputView } from './input-views.svelte';

/** What the singer has done with a library poem: kept it as it was, or edited it. */
export type LibraryLine = 'kept' | 'edited' | null;

export function introLine(view: InputView, landed: InputView | null, scoreWords: boolean, poemText: string, library: LibraryLine = null): string {
	if (view === 'poem' && scoreWords && poemText.trim() === '') return 'intake.view.landedLyrics';
	if (view === 'poem' && library) return library === 'kept' ? 'intake.view.libraryPoem' : 'intake.view.libraryPoemEdited';
	if (landed === 'poem') return 'intake.view.landedPoem';
	return view === 'poem' ? 'intake.view.poemLine' : 'intake.view.lyricsLine';
}

/** Which of the two library lines the stored source asks for, once the library has the entry; null otherwise. */
export function libraryLineOf(source: { answered: boolean; edited: boolean } | null, resolved: boolean): LibraryLine {
	if (!source || !resolved || !source.answered) return null;
	return source.edited ? 'edited' : 'kept';
}

/** The poem's details, as the data prints them. */
export interface LibraryNaming {
	author: string;
	title: string;
	site: string;
}

/** Fill `{author}`, `{title}`, and `{site}` in a library line. The data's words go in as they are; nothing is derived. */
export function fillLibraryLine(template: string, naming: LibraryNaming): string {
	return template.replace('{author}', () => naming.author).replace('{title}', () => naming.title).replace('{site}', () => naming.site);
}
