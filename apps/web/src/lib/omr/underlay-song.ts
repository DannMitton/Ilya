/**
 * A song's words, written where they were read (N.135 stage 2b, brief r5 step 2).
 *
 * Each system that has a Russian row keeps its own words. A system without one,
 * a system with no band, and a page that answers null take none, and lose only
 * themselves. This reverses Fable's amendment 7 to brief r2 (a song's words
 * written only when every page passes), whose reason was that a song with one
 * bare page would show the singer no sign of the bare half. The sign is now the
 * banner ratified for it (`unread-bars.ts`, `ingest.ts`): it names the bars.
 *
 * THE BARS ARE THE SONG'S. `NotePlace.bar` is homr's bar on its own page, and
 * homr numbers every page from bar 1 (B04's three captured pages each begin
 * `<measure number="1"`); the join numbers the song's bars one after another
 * (`join-pages.ts`, `rewriteMeasure(m, n + 1, ...)`). So a song's bar is the
 * count of `<measure>` elements in the first part of every earlier page plus
 * the page's own bar (`measureCount`). A page of the piano alone is left out
 * (`pianoAlonePages`, the join's own function): the join takes its notes out
 * (`withoutNotes`), so its bars hold nothing for the voice and nothing to type
 * into. A page that answers null names every bar of its first part that holds a
 * voice note, unless it is a page of the piano alone.
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
import { pianoAlonePages } from './join-pages';
import type { UnderlayPage } from './underlay-page';
import { measureCount, voiceNotes } from './underlay-prepare';
import { writeLyrics } from './underlay-words';
import { mergeRanges, type BarRange } from './unread-bars';

/** A part of the song that took no words: for the console, and the desk's measure. */
export interface Unread {
	/** 1-based, in the pages given. */
	page: number;
	/** 1-based, top to bottom on the page; null where the whole page was not read. */
	system: number | null;
	/** The song's first and last bar of it. */
	bars: BarRange;
	/** Why: «no Russian row», «no band», «page not read», or «no staff found» (the page answered with no system on it). */
	why: string;
}

export interface SongUnderlay {
	/** The pages' MusicXML, with the words written where they were read. */
	xmls: string[];
	written: boolean;
	/** One line for the console: why the song was not written, or what was. */
	line: string;
	/** Syllables written, and syllable tokens left unseated, over the song. */
	syllables: number;
	unseated: number;
	/** Every part of the voice that took no words, with the song's bars. */
	unread: Unread[];
	/** `unread`'s bars merged: what the banner names. Empty where no voice system was written, and where none was left. */
	unreadBars: BarRange[];
}

const range = ([a, b]: BarRange): string => (a === b ? `bar ${a}` : `bars ${a} to ${b}`);

/** The song's bars of a page whose underlay was not read: every bar of its first part that holds a voice note. */
function barsWithNotes(xml: string): number[] {
	return [...new Set(voiceNotes(xml).filter((n) => !n.rest).map((n) => n.bar))];
}

export function applyUnderlay(xmls: readonly string[], pages: readonly (UnderlayPage | null)[]): SongUnderlay {
	const unseated = pages.reduce((n, p) => n + (p?.stats.unseated ?? 0), 0);
	const alone = pianoAlonePages(xmls);
	// The count of bars on every earlier page: a page's bar plus this is the song's bar.
	const before: number[] = [];
	let count = 0;
	for (const xml of xmls) {
		before.push(count);
		count += measureCount(xml);
	}
	const unread: Unread[] = [];
	let writtenSystems = 0;
	pages.forEach((page, i) => {
		if (alone[i]) return;
		if (page === null || page.systems.length === 0) {
			// Not read, or read with no system found on it: the page's notes are all unread.
			const bars = barsWithNotes(xmls[i]).map((b) => b + before[i]);
			if (bars.length > 0) unread.push({ page: i + 1, system: null, bars: [Math.min(...bars), Math.max(...bars)], why: page === null ? 'page not read' : 'no staff found' });
			return;
		}
		page.systems.forEach((system, s) => {
			if (system.written) writtenSystems++;
			else if (system.bars) unread.push({ page: i + 1, system: s + 1, bars: [system.bars[0] + before[i], system.bars[1] + before[i]], why: system.why ?? 'not written' });
		});
	});
	const syllables = pages.reduce((n, p, i) => n + (p && !alone[i] ? p.words.reduce((m, w) => m + w.syllables.length, 0) : 0), 0);
	const notRead = pages.flatMap((p, i) => (p === null ? [`page ${i + 1} could not be read`] : []));
	if (syllables === 0) {
		const why = notRead.length ? `${notRead.join('; ')}, and no other page has a word, so nothing is written` : 'no voice staff with words was found, so nothing is written';
		return { xmls: [...xmls], written: false, line: why, syllables: 0, unseated, unread, unreadBars: [] };
	}
	const left = unread.length ? `; no words in ${unread.map((u) => `page ${u.page}${u.system === null ? '' : ` system ${u.system}`} (${range(u.bars)}, ${u.why})`).join(', ')}` : '';
	return {
		xmls: xmls.map((xml, i) => (pages[i] ? writeLyrics(xml, pages[i]!.words) : xml)),
		written: true,
		line: `${syllables} syllables written on ${pages.filter((p, i) => p && !alone[i] && p.words.length > 0).length} of ${pages.length} pages${unseated ? `, ${unseated} units left unseated` : ''}${left}`,
		syllables,
		unseated,
		unread,
		unreadBars: writtenSystems > 0 ? mergeRanges(unread.map((u) => u.bars)) : [],
	};
}
