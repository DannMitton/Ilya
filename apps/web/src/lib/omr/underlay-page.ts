/**
 * One page's underlay, assembled (N.135 stage 2b): the rows the worker framed
 * and the reader read, taken to the words that go under the page's notes.
 *
 * The work is in two halves. `underlay-prepare.ts` runs in the Worker: the
 * staves, the bands, the rows, the frame. The reader (tesseract.js, which makes
 * its own Worker) reads each framed row in the page's thread. This file is the
 * second half, pure and run in the page's thread, because the dictionary and
 * the engine are there and not in a Worker (`Seams`): each row's boxes taken
 * back to the page (`unframeBox`), split into tokens (`splitTokens`), judged
 * Russian or not (`rowLanguage`), cut into syllables (`cutUnits`, the hybrid
 * C2), seated on the system's notes (`seatTokens`, `monotone`), and sewn into
 * words (`sewWords`).
 *
 * THE THRESHOLD (brief section 4, DESK DEFAULT). A page passes when every
 * system of it that holds a voice note has a band and at least one Russian row
 * in it. That a Russian row has at least half of its sewn words of two letters or
 * more in the dictionary is what `rowLanguage` calls Russian, so over the page's
 * Russian rows the share is at least half too; `stats.words` and `stats.known`
 * report it. A system with several Russian rows is seated from
 * the first, the top one, which is the first verse. Whether a song's words are
 * written is decided on all its pages together (`underlay-song.ts`).
 *
 * Pure.
 */
import { DEFAULT_INK_HEIGHT, unframeBox, type FrameTransform } from './underlay-frame';
import { rowLanguage, wordKnown } from './underlay-language';
import type { StaffBoxLike } from './metre-windows';
import { seatTokens, type NotePlace, type Seat, type Token } from './underlay-seat';
import { rowWords, splitTokens } from './underlay-tokens';
import { cutUnits, type CutCounts } from './underlay-units';
import { sewWords, type Word } from './underlay-words';

/** A word box the reader returned for a framed row, in the framed row's pixels. */
export interface WordBox {
	text: string;
	x0: number;
	y0: number;
	x1: number;
	y1: number;
}

/** What is kept of a framed row once its pixels have gone to the reader. */
export interface RowLayout {
	/** The row's index in the page's rows, in reading order; the reader's answer is keyed by it. */
	id: number;
	transform: FrameTransform;
	/** Where the row's crop stands on the page, in page pixels. */
	offsetX: number;
	offsetY: number;
}

export interface SystemLayout {
	/** The system's staff space, in page pixels. */
	staffSpace: number;
	/** The system's voice notes: `id` is the note's ordinal in the first part of the page's MusicXML (`writeLyrics`), `x` its `imgpos`. */
	notes: NotePlace[];
	/** Null where no band of two staff spaces fits under the staff. */
	hasBand: boolean;
	rows: RowLayout[];
}

export interface PageLayout {
	width: number;
	height: number;
	systems: SystemLayout[];
	/** Staff boxes homr gave in which no staff was found in the ink. */
	unfound: number;
}

/** What the page's thread supplies: the dictionary and the engine. */
export interface Seams {
	isWord(word: string): boolean;
	cut(word: string): string[];
}

export interface UnderlayStats {
	systems: number;
	/** Systems with a band. */
	banded: number;
	rows: number;
	/** Rows `rowLanguage` called Russian. */
	russianRows: number;
	/** Systems with at least one Russian row. */
	systemsRussian: number;
	tokens: number;
	units: number;
	cuts: CutCounts;
	seated: number;
	/** Syllable tokens no note took (a whole unseated word, or a surplus): never written. */
	unseated: number;
	/** Sewn words of two letters or more in the Russian rows, and how many of them the dictionary holds. */
	words: number;
	known: number;
}

export interface UnderlayPage {
	/** True when the page passes the threshold; the song's words are written only if every page does. */
	passes: boolean;
	/** Why it does not pass, for one console line; null when it does. */
	why: string | null;
	/** The words seated on this page's notes, by the notes' ordinals in this page's MusicXML. */
	words: Word[];
	stats: UnderlayStats;
	/** Milliseconds: the worker's preparation, the reader, and the assembly. */
	ms: { prepare: number; read: number; seat: number };
}

/** Reads the underlay of one page: the page image, homr's MusicXML for it, and homr's staff boxes. Null where it could not. */
export type ReadUnderlay = (image: Blob, musicXml: string, staves: readonly StaffBoxLike[]) => Promise<UnderlayPage | null>;

/** A reader's answer for a row, back on the page: tokens in page pixels. */
export function pageTokens(row: RowLayout, words: readonly WordBox[]): Token[] {
	const raw = words.map((w) => {
		const b = unframeBox(row.transform, w);
		return { text: w.text, x0: b.x0 + row.offsetX, x1: b.x1 + row.offsetX };
	});
	// The row's ink height on the page, for the dash that is a mark and not a joint.
	return splitTokens(raw, { inkHeight: DEFAULT_INK_HEIGHT / row.transform.scale });
}

/**
 * The page's words from its layout and the reader's answer for each row
 * (`reads[id]`, the boxes of the row `id`).
 */
export function seatPage(layout: PageLayout, reads: readonly (readonly WordBox[])[], seams: Seams): Omit<UnderlayPage, 'ms'> {
	const stats: UnderlayStats = {
		systems: layout.systems.length,
		banded: 0,
		rows: 0,
		russianRows: 0,
		systemsRussian: 0,
		tokens: 0,
		units: 0,
		cuts: { cut: 0, whole: 0, mismatched: 0 },
		seated: 0,
		unseated: 0,
		words: 0,
		known: 0,
	};
	const seats: Seat[] = [];
	const problems: string[] = [];
	layout.systems.forEach((system, s) => {
		if (system.hasBand) stats.banded++;
		else problems.push(`system ${s + 1} has no band`);
		let seated = false;
		for (const row of system.rows) {
			stats.rows++;
			const tokens = pageTokens(row, reads[row.id] ?? []);
			stats.tokens += tokens.length;
			const words = rowWords(tokens);
			if (rowLanguage(words, seams.isWord) !== 'russian') continue;
			stats.russianRows++;
			for (const w of words) {
				const here = wordKnown(w, seams.isWord);
				if (here === null) continue;
				stats.words++;
				if (here) stats.known++;
			}
			if (seated) continue;
			seated = true;
			const { units, counts } = cutUnits(tokens, seams.cut);
			stats.units += units.length;
			stats.cuts.cut += counts.cut;
			stats.cuts.whole += counts.whole;
			stats.cuts.mismatched += counts.mismatched;
			const placed = seatTokens(units, system.notes, 'monotone');
			stats.seated += placed.filter((p) => p.kind === 'syllable' && p.note !== null).length;
			stats.unseated += placed.filter((p) => p.unseated).length;
			seats.push(...placed);
		}
		if (seated) stats.systemsRussian++;
		else if (system.hasBand) problems.push(`system ${s + 1} has no Russian row`);
	});
	return { passes: problems.length === 0, why: problems.length ? problems.join('; ') : null, words: sewWords(seats), stats };
}
