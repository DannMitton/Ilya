/**
 * The two `attach` argument builders that `routes/+page.svelte` used to write inline (integration step 7e, 2026-11-09, from
 * Fable's review of row 181): what the page lends to the join of Poem to a scan's Lyrics (`joinDeps`) and to the print in the Loupe
 * (`printDeps`). WHY here: the page is at its line ceiling and a line of logic in a `.svelte` file has no test; moved, these are
 * the same expressions, unchanged, and `loupe-print-wiring.test.ts` runs them. The page's one `attach` line calls them and
 * passes only getters and the three effects `openAt` has (the tab, the drawer, the cursor).
 *
 * It checks nothing itself: each function turns the page's state into the shape the class asks for. WHEN IT GOES WRONG the join
 * runs on a song that is not a scan, or the Loupe's strip is cut from a scan that is not the open song's. It relates to
 * `text/poem-join.svelte.ts` (`JoinDeps`, `JoinState`), `loupe-print.svelte.ts` (`PrintDeps`, `firstNoteOfBar`), and `omr/banner-bars.ts` (`barsOf`).
 */
import type { LineData } from '$lib/types';
import type { PairingMap } from './pairings';
import type { KeptSystem } from '$lib/omr/kept-bands';
import type { BarRange } from '$lib/omr/unread-bars';
import type { JoinDeps } from '$lib/text/poem-join.svelte';
import type { RunEvent } from '$lib/text/poem-join-wire';
import { barsOf } from '$lib/omr/banner-bars';
import { firstNoteOfBar, type PrintDeps } from './loupe-print.svelte';

/** The parts of the page's ingested score the two builders read. */
export interface IngestedLend {
	result: {
		score: { vocalLine: readonly RunEvent[]; measures: readonly { index: number; number: string }[] };
		warnings: readonly { code: string; bars?: readonly BarRange[] }[];
	};
}

/** The bars the `words-partly-read` warning lists: the banner's bars. */
const unreadBarsOf = (ingested: IngestedLend | null): readonly BarRange[] => ingested?.result.warnings.find((w) => w.code === 'words-partly-read')?.bars ?? [];

export interface JoinLend {
	doc: JoinDeps['doc'];
	setLyrics: JoinDeps['setLyrics'];
	ingested(): IngestedLend | null;
	scoreText(): string;
	lines(): readonly LineData[];
	pairings(): PairingMap;
	/** The dictionary has loaded. */
	ready(): boolean;
	/** The scan's kept reading is present (`loupePrint.hasScan()`): the join runs only on a song read from a scan (step 7b). */
	hasScan(): boolean;
}

/** What the page lends the join: the state is null unless the score carries words, a scan's kept reading is present, and it is a scan. */
export function joinDeps(l: JoinLend): JoinDeps {
	return {
		doc: l.doc,
		setLyrics: l.setLyrics,
		state: () => {
			const ingested = l.ingested();
			return ingested && l.scoreText() !== '' && l.hasScan()
				? { scanText: l.scoreText(), lines: l.lines(), events: ingested.result.score.vocalLine, pairings: l.pairings(), unreadBars: unreadBarsOf(ingested), ready: l.ready() }
				: null;
		},
	};
}

export interface PrintLend {
	songId(): string;
	ingested(): IngestedLend | null;
	/** The stored scan of the open song: its kept bands, bytes, and file name; null where there is none. */
	stored(): { reading?: { bands?: readonly KeptSystem[] } | null; bytes: ArrayBuffer; fileName: string } | null;
	/** The note ids of the corrected line, in order, for finding a bar's first note. */
	line(): readonly { id: string; type: string; measureIndex: number }[];
	/** The Markup wall is open (`INCLUDE_MARKUP_INSIGHTS`). */
	markupOn: boolean;
	/** The page's three effects, in the order that holds on a phone: MELODY forward, the drawer lowered, the cursor on the note, the Loupe open. */
	show(id: string): void;
}

/** What the page lends the print in the Loupe. */
export function printDeps(l: PrintLend): PrintDeps {
	return {
		songId: l.songId,
		scan: () => {
			const s = l.stored();
			return s?.reading?.bands ? { systems: s.reading.bands, file: new File([s.bytes], s.fileName), kind: /\.pdf$/i.test(s.fileName) ? 'pdf' : 'image' } : null;
		},
		toCheck: () => barsOf(unreadBarsOf(l.ingested())),
		openAt: (bar) => {
			const id = firstNoteOfBar(l.ingested()?.result.score.measures ?? [], l.line(), bar);
			if (!l.markupOn || !id) return;
			l.show(id);
		},
	};
}
