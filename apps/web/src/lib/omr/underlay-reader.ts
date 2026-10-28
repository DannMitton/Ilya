/**
 * Reads one page's underlay (N.135 stage 2b): the two halves joined, with
 * everything that touches the browser passed in, so every branch is a unit test.
 *
 * `prepare` is the Worker's half (`underlay-prepare.ts`, by way of
 * `underlay.worker.ts`): the page in, the framed rows out as images for the
 * reader and the layout to put its answer back with. `recognize` is the reader
 * (tesseract.js, `underlay-recognize.ts`): one framed row in, its word boxes
 * out. `seams` is the dictionary and the engine (`underlay-seams.ts`).
 * `seatPage` is the page's half (`underlay-page.ts`).
 *
 * NEVER REJECTS. Where the Worker throws, the model does not load, a fetch
 * fails, or the reader throws on a row, the page answers null with one
 * `console.info` line saying why, and the song is joined as it was before this
 * stage existed (`underlay-song.ts`).
 */
import type { StaffBoxLike } from './metre-windows';
import { seatPage, type PageLayout, type ReadUnderlay, type Seams, type UnderlayPage, type WordBox } from './underlay-page';

export interface UnderlayParts<Row> {
	/** The Worker's half: one framed image per row, in `layout`'s order. */
	prepare(image: Blob, musicXml: string, staves: readonly StaffBoxLike[]): Promise<{ layout: PageLayout; rows: Row[]; ms: number }>;
	/** The reader: the word boxes of one framed row. */
	recognize(row: Row): Promise<WordBox[]>;
	/** The dictionary and the engine, once they are ready; rejects where they are not. */
	seams(): Promise<Seams>;
	now?: () => number;
}

export function makeUnderlayReader<Row>(parts: UnderlayParts<Row>): ReadUnderlay {
	const now = parts.now ?? (() => performance.now());
	return async (image, musicXml, staves) => {
		let stage = 'the Worker';
		try {
			const prepared = await parts.prepare(image, musicXml, staves);
			stage = 'the reader';
			const t1 = now();
			const reads: WordBox[][] = [];
			for (const row of prepared.rows) reads.push(await parts.recognize(row));
			const t2 = now();
			stage = 'the dictionary';
			const seams = await parts.seams();
			stage = 'the seating';
			const seated = seatPage(prepared.layout, reads, seams);
			const ms = { prepare: Math.round(prepared.ms), read: Math.round(t2 - t1), seat: Math.round(now() - t2) };
			const page: UnderlayPage = { ...seated, ms };
			console.info(`[omr] underlay: page read in ${((ms.prepare + ms.read + ms.seat) / 1000).toFixed(1)} s (worker ${ms.prepare} ms, reader ${ms.read} ms, seating ${ms.seat} ms): ${seated.stats.rows} rows in ${seated.stats.systems} systems, ${seated.stats.seated} syllables seated, ${seated.stats.unseated} unseated${seated.passes ? '' : `; does not pass (${seated.why})`}`);
			return page;
		} catch (err) {
			console.info(`[omr] underlay: the page was not read (${stage} failed: ${String((err as Error)?.message ?? err)})`);
			return null;
		}
	};
}
