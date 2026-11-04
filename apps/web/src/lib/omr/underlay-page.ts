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
 * THE THRESHOLD, per system (brief r5 step 2, which replaces the page and song
 * gates of brief r2 section 4). A system takes words where it has a band and at
 * least one Russian row in it. That a Russian row has at least `RUSSIAN_SHARE`
 * (three in ten since brief r5 step 1) of its sewn words of two letters or more
 * in the dictionary is what `rowLanguage` calls Russian; `stats.words` and
 * `stats.known` report the share over the page's Russian rows. A system with
 * several Russian rows is seated from the first, the top one, which is the
 * first verse. A system without a band or without a Russian row takes no words
 * and loses only itself: the page says which (`systems`), with the bars of the
 * system's notes as homr numbers them on this page, and `underlay-song.ts` turns
 * those into the song's bars for the banner.
 *
 * Pure.
 */
import { DEFAULT_INK_HEIGHT, unframeBox, type FrameTransform } from './underlay-frame';
import { rowLanguage, wordKnown } from './underlay-language';
import { fallbackRow } from './underlay-fallback';
import type { StaffBoxLike } from './metre-windows';
import { isContinuation, seatTokens, type NotePlace, type Seat, type Token } from './underlay-seat';
import { assertVowelPerNote, wholeTokenOf } from './assert-vowel-per-note';
import { foldClitics, type CliticCall, type OwnNote } from './underlay-clitics';
import { vowelsPerNote, type Breach } from './vowels-per-note';
import { freeNoteXs, manyVowelsInUnits, manyVowelsMerged, type ManyVowelCounts } from './underlay-counts';
import { rowWordSpans, splitTokens } from './underlay-tokens';
import { markExtenderNotes, NO_EXTENDERS, type ExtenderArm, type ExtenderCounts } from './underlay-extender';
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
	/**
	 * The band's ink share (ink pixels over all, ink as `cutRows` calls it) and its count of text-line candidates
	 * (`bandInk`, `underlay-rows.ts`); absent where the layout was not made by `prepareUnderlay` or the system has no band.
	 */
	inkShare?: number;
	textLines?: number;
}

/**
 * The ink share at or under which a band that holds no text-line candidate is «no ink» (row 181 step 1, review amendment 15).
 * NOT MEASURED. It is a share of the band's pixels, to be set from row 114's own bands: the share of every band whose system
 * was written against every band that holds no text row, which the desk reads from the console line (`inkBands`). Until
 * then it is nought, and nought means exactly no ink pixel at all: a band with a hairpin, a slur, a stem, or a speck is NOT
 * «no ink», so a wrong threshold cannot make a system silent. A band with any text-line candidate is never «no ink».
 */
export const NO_INK_SHARE_MAX = 0;

/** True where the band held no ink to read: it has a band, no text-line candidate, and a share at or under `NO_INK_SHARE_MAX`. */
export function bandHeldNoInk(system: Pick<SystemLayout, 'hasBand' | 'inkShare' | 'textLines'>): boolean {
	return system.hasBand && system.inkShare !== undefined && system.textLines === 0 && system.inkShare <= NO_INK_SHARE_MAX;
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
	/**
	 * The transcription's own call for each word of a row, sent through as one line (`pipeline.ts`, `isProclitic` and
	 * `isEnclitic`): null for a word it calls neither. Absent, no clitic is folded.
	 */
	clitics?(words: string[]): CliticCall[];
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
	/** Systems no row of which passed `rowLanguage`, seated from a row the dictionary sews into words (`underlay-fallback.ts`). */
	fallback: number;
	tokens: number;
	units: number;
	cuts: CutCounts;
	seated: number;
	/** Syllable tokens no note took (a whole unseated word, or a surplus): never written. */
	unseated: number;
	/** Sewn words of two letters or more in the Russian rows, and how many of them the dictionary holds. */
	words: number;
	known: number;
	/** Vowelless words the transcription calls clitics: folded into a host (`folded`), or dropped for want of one (`left`). */
	clitics: { folded: number; left: number; ownNote: number };
	/** Units that took no note because they hold no vowel letter (`vowelless`, clitics left for want of a host among them) or are a lone і, ѣ, or ѵ (`stray`): not seated, not written. */
	dropped: { vowelless: number; stray: number };
	/**
	 * Folded clitics the print appears to give a note of their own, with the row they were in (counted, never acted on:
	 * `underlay-clitics.ts`), and the units of two vowels or more (`underlay-counts.ts`): cut, and merged on one note.
	 */
	/** The tokens the rows held that bear on a printed extender, and the notes marked under one (`underlay-extender.ts`). */
	extenders: ExtenderCounts;
	/** Per system with a band: its ink share, its text-line candidates, and the rows cut; the desk sets `NO_INK_SHARE_MAX` from these on row 114. */
	inkBands: { system: number; written: boolean; inkShare: number | null; textLines: number | null; rows: number }[];
	counted: {
		ownNote: (OwnNote & { system: number; row: number })[];
		/** `merged`: tokens a note refused (a second token on a note is unseated, never joined: `underlay-words.ts`). */
		manyVowels: ManyVowelCounts;
		/**
		 * Per seated system: its free notes against the syllable units left after rule 1's drop (`free`, ties and extenders only),
		 * the free notes if a printed slur's notes were continuations too (`slurFree`), and whether the count gate took the slur
		 * reading (`slurReading`: `slurFree` equals `units` and a free note is under a slur).
		 */
		perSystem: { system: number; free: number; slurFree: number; units: number; slurReading: boolean }[];
		breaches: Breach[];
	};
}

/** What one system of the page came to: the words it took, or why it took none. */
export interface SystemWords {
	/** True where the system has a band and a Russian row, and its words were seated. */
	written: boolean;
	/** The system's first and last bar, as homr numbers them on this page (from 1 on every page); null where it holds no voice note. */
	bars: readonly [number, number] | null;
	/** Why it took none, for one console line; null where it did. «no ink» and «no Russian row» are different (row 181 step 1). */
	why: string | null;
	/**
	 * A system whose band held no ink and whose every sung note is a continuation (a tie): it has nothing to read and
	 * nothing to say, so it is not unread (Dann 2026-11-04 10:24, item 6 (c)) and `applyUnderlay` leaves it out of the banner.
	 */
	silent?: boolean;
}

export interface UnderlayPage {
	/** One entry per system of the page that holds a voice note, top to bottom. */
	systems: SystemWords[];
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
export function seatPage(layout: PageLayout, reads: readonly (readonly WordBox[])[], seams: Seams, options: { extenderArm?: ExtenderArm } = {}): Omit<UnderlayPage, 'ms'> {
	const arm = options.extenderArm ?? 'a';
	const stats: UnderlayStats = {
		systems: layout.systems.length,
		banded: 0,
		rows: 0,
		russianRows: 0,
		systemsRussian: 0,
		fallback: 0,
		tokens: 0,
		units: 0,
		cuts: { cut: 0, whole: 0, mismatched: 0 },
		seated: 0,
		unseated: 0,
		words: 0,
		known: 0,
		clitics: { folded: 0, left: 0, ownNote: 0 },
		dropped: { vowelless: 0, stray: 0 },
		extenders: { ...NO_EXTENDERS },
		inkBands: [],
		counted: { ownNote: [], manyVowels: { cut: [], merged: [] }, perSystem: [], breaches: [] },
	};
	const seats: Seat[] = [];
	const sung: { id: number; continuation: boolean }[] = [];
	const systems: SystemWords[] = [];
	layout.systems.forEach((system, s) => {
		if (system.hasBand) stats.banded++;
		let seated = false;
		// The rows are read first (row 181 step 1, review amendment 4): the extender flag has to exist before `tiesOnly` and
		// `free` are made, because `free` feeds the rescue decision and `foldClitics`, and a syllable's seat is known only
		// at `seatTokens`. The flag comes from the token's own box (`underlay-extender.ts`); no seat is consulted.
		const read = system.rows.map((row) => {
			const tokens = pageTokens(row, reads[row.id] ?? []);
			const spans = rowWordSpans(tokens);
			return { tokens, spans, words: spans.map((w) => w.text) };
		});
		const marked = markExtenderNotes(system.notes, read.map((p) => p.tokens), arm);
		for (const k of ['extender', 'joint', 'longDash', 'marked'] as const) stats.extenders[k] += marked.counts[k];
		// `notes` are the system's notes with the extender read; `system.notes` is the layout's, which the extender has not touched.
		const notes = marked.notes;
		// The system's notes read by ties and extenders only, which is how every site read them before a slur was observed.
		// The gate below decides after the units exist whether the system takes the slur reading; until it has, and for a
		// system that does not take it, this is the reading (`inSlur` false on every note).
		const tiesOnly = notes.map((n) => (n.inSlur ? { ...n, inSlur: false } : n));
		// `free`, ties-only, is read before the gate by the rescue decision below (whether the system has a note to seat on at all)
		// and by the first `foldClitics`; after the gate, every number derived from the free set reads `seatFree`.
		const free = freeNoteXs(tiesOnly);
		// Only where no row is Russian, and the system has a note to seat on: the row the dictionary sews into words.
		const rescue = free.length > 0 && !read.some((p) => rowLanguage(p.words, seams.isWord) === 'russian') ? fallbackRow(read.map((p) => p.words), seams.isWord) : null;
		for (const [r, row] of system.rows.entries()) {
			stats.rows++;
			const { tokens, spans, words } = read[r];
			stats.tokens += tokens.length;
			if (r === rescue) stats.fallback++;
			else if (rowLanguage(words, seams.isWord) !== 'russian') continue;
			else {
				stats.russianRows++;
				for (const w of words) {
					const here = wordKnown(w, seams.isWord);
					if (here === null) continue;
					stats.words++;
					if (here) stats.known++;
				}
			}
			if (seated) continue;
			seated = true;
			const cutRow = cutUnits(tokens, seams.cut);
			const { counts } = cutRow;
			let units = cutRow.units;
			let origin = cutRow.origin;
			// `foldClitics` runs before the gate (the gate counts its units), so it first reads the ties-only free notes. The free
			// notes enter it for the `ownNote` count alone (`underlay-clitics.ts:52`: "Nothing depends on the count"), never the
			// units, so a system that takes the slur reading is counted again below on its slur-aware free notes.
			const calls = seams.clitics ? seams.clitics(words) : null;
			let folded = calls ? foldClitics(units, cutRow.origin, spans, calls, free) : null;
			if (folded) {
				units = folded.units;
				origin = folded.origin;
			}
			// One vowel per note (`CONTRACT.md` §0.1): a unit with no vowel letter takes no note, and a stray mark is no unit.
			// Whatever `foldClitics` could not join to a host is dropped here, on every path, with or without calls.
			const checked = assertVowelPerNote(units, wholeTokenOf(cutRow.origin, origin));
			units = checked.kept;
			// THE SLUR GATE, per system (row 177; Dann 2026-10-20 03:37, `OPEN.md` "A PRINTED SLUR IS A MELISMA ILYA OBSERVES, NOT ONE IT
			// CREATES"): a slur printed over the voice's notes is evidence of a melisma, and the seating observes it when doing so makes
			// the free notes and the syllable units come out EVEN; where the counts disagree the system seats one syllable per note,
			// as today. The typed path's gate is the same test (`observedTargets`, `score/slur-seat.ts`: strict equality, and at least
			// one observed continuation), taken over the whole song. This path has no whole-song unit count (units are cut per row and
			// seated per system), so the gate is per system: DESK DEFAULT, the ruling names no scope. The "equal or nearer" reading is
			// not the ruling's "even" and is not built.
			const syllableUnits = units.filter((u) => /\p{L}/u.test(u.text)).length;
			const slurFree = notes.filter((n) => !isContinuation(n)).length;
			const slurReading = slurFree === syllableUnits && notes.some((n, i) => n.inSlur === true && !isContinuation(tiesOnly[i]));
			stats.counted.perSystem.push({ system: s + 1, free: free.length, slurFree, units: syllableUnits, slurReading });
			// The decision reaches every site below through the notes (`CONTRACT.md` §4): a system that took the slur reading hands
			// them its own notes, whose `inSlur` notes are continuations (`isContinuation`); any other hands the ties-only copy, on
			// which `inSlur` changes nothing. `seatFree` is that reading's free set, for every number derived from it.
			const seatNotes = slurReading ? notes : tiesOnly;
			const seatFree = slurReading ? freeNoteXs(seatNotes) : free;
			if (folded && calls) {
				if (slurReading) folded = foldClitics(cutRow.units, cutRow.origin, spans, calls, seatFree);
				stats.clitics.folded += folded.counts.folded;
				stats.clitics.left += folded.counts.left;
				stats.clitics.ownNote += folded.counts.ownNote.length;
				stats.counted.ownNote.push(...folded.counts.ownNote.map((o) => ({ ...o, system: s + 1, row: r + 1 })));
			}
			// Every sung note of a seated system goes to the check, with its continuation from the notes the system took (ties, extenders, and the slur where the gate passed).
			sung.push(...seatNotes.map((n) => ({ id: n.id, continuation: isContinuation(n) })));
			for (const r of checked.refused) stats.dropped[r.why]++;
			stats.counted.manyVowels.cut.push(...manyVowelsInUnits(units, seatFree));
			stats.units += units.length;
			stats.cuts.cut += counts.cut;
			stats.cuts.whole += counts.whole;
			stats.cuts.mismatched += counts.mismatched;
			const placed = seatTokens(units, seatNotes, 'monotone');
			stats.seated += placed.filter((p) => p.kind === 'syllable' && p.note !== null).length;
			stats.unseated += placed.filter((p) => p.unseated).length;
			stats.counted.manyVowels.merged.push(...manyVowelsMerged(units, placed, seatFree));
			seats.push(...placed);
		}
		if (seated && rescue === null) stats.systemsRussian++;
		const bars = system.notes.map((n) => n.bar);
		const noInk = !seated && bandHeldNoInk(system);
		// Nothing to read and nothing to say: no ink in the band, and every sung note a tie's continuation (item 6 (c)).
		const silent = noInk && system.notes.length > 0 && system.notes.every((n) => n.tiedInto === true);
		if (system.hasBand) stats.inkBands.push({ system: s + 1, written: seated, inkShare: system.inkShare ?? null, textLines: system.textLines ?? null, rows: system.rows.length });
		systems.push({
			written: seated,
			bars: bars.length ? [Math.min(...bars), Math.max(...bars)] : null,
			why: seated ? null : system.hasBand ? (noInk ? 'no ink' : 'no Russian row') : 'no band',
			...(silent ? { silent: true } : {}),
		});
	});
	const words = sewWords(seats);
	// Step 6's check on the page's sewn words, as written, now over EVERY sung note of the seated systems (N.135 step 5):
	// a note with no syllable that is not a continuation is `no-syllable`. Counted, never repaired.
	const textOf = new Map<number, string>();
	for (const w of words) for (const y of w.syllables) if (!textOf.has(y.note)) textOf.set(y.note, y.text);
	stats.counted.breaches = vowelsPerNote(sung.map((n) => ({ id: n.id, text: textOf.get(n.id) ?? null, continuation: n.continuation })));
	return { systems, words, stats };
}
