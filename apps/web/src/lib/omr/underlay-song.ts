/**
 * A song's words, written or not (N.135 stage 2b, brief section 4).
 *
 * A song's words are written only when EVERY page of it that was read answers
 * and passes: otherwise nothing is written and the song takes today's path and
 * today's banner. The banner is chosen per song, from the `no-lyrics-found`
 * warning (`ingest.ts`, `noLyricsNoticeKey`), so a song with one passing page
 * and one failing page would fill Lyrics from the first page's words, seat
 * them, and show no banner on the second page's bare notes: a half the singer
 * is not told about.
 *
 * The words are written into each page's own MusicXML, before the pages are
 * joined, by the notes' ordinals in that page's first part. `joinPages` copies
 * every note's text unchanged (its header), so a `<lyric>` rides with its note
 * through the join; and the ordinal of a note in a page is known where it is
 * read, while its place in the joined file moves with the metres, the rests
 * the join adds, and the staff it drops. This departs from the brief's step 9
 * ("on the joined MusicXML after `joinLookingAtPages`"); `homr-reader.test.ts`
 * and `underlay-song.test.ts` hold that the lyrics come through the join.
 *
 * Pure.
 */
import type { UnderlayPage } from './underlay-page';
import { writeLyrics } from './underlay-words';

export interface SongUnderlay {
	/** The pages' MusicXML, with the words written where the song is written. */
	xmls: string[];
	written: boolean;
	/** One line for the console: why the song was not written, or what was. */
	line: string;
	/** Syllables written, and syllable tokens left unseated, over the song. */
	syllables: number;
	unseated: number;
}

export function applyUnderlay(xmls: readonly string[], pages: readonly (UnderlayPage | null)[]): SongUnderlay {
	const unseated = pages.reduce((n, p) => n + (p?.stats.unseated ?? 0), 0);
	const keep = (line: string): SongUnderlay => ({ xmls: [...xmls], written: false, line, syllables: 0, unseated });
	const failed = pages.findIndex((p) => p === null);
	if (failed >= 0) return keep(`page ${failed + 1} could not be read, so the words are not written`);
	const below = pages.findIndex((p) => !p!.passes);
	if (below >= 0) return keep(`page ${below + 1} does not pass (${pages[below]!.why}), so the words are not written`);
	const syllables = pages.reduce((n, p) => n + p!.words.reduce((m, w) => m + w.syllables.length, 0), 0);
	if (syllables === 0) return keep('no voice staff with words was found, so nothing is written');
	return {
		xmls: xmls.map((xml, i) => writeLyrics(xml, pages[i]!.words)),
		written: true,
		line: `${syllables} syllables written on ${pages.filter((p) => p!.words.length > 0).length} of ${pages.length} pages${unseated ? `, ${unseated} units left unseated` : ''}`,
		syllables,
		unseated,
	};
}
