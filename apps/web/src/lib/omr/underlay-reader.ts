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
import { seatPage, type PageLayout, type ReadUnderlay, type Seams, type SystemWords, type UnderlayPage, type UnderlayStats, type WordBox } from './underlay-page';

export interface UnderlayParts<Row> {
	/** The Worker's half: one framed image per row, in `layout`'s order. */
	prepare(image: Blob, musicXml: string, staves: readonly StaffBoxLike[]): Promise<{ layout: PageLayout; rows: Row[]; ms: number }>;
	/** The reader: the word boxes of one framed row. */
	recognize(row: Row): Promise<WordBox[]>;
	/** The dictionary and the engine, once they are ready; rejects where they are not. */
	seams(): Promise<Seams>;
	now?: () => number;
}

/**
 * What a failure says. tesseract.js rejects with a string, or with an event
 * from its Worker, as often as with an `Error`; `String(err.message)` of those is
 * the word "undefined".
 */
export function describeError(err: unknown): string {
	if (err instanceof Error && err.message) return err.message;
	if (typeof err === 'string' && err) return err;
	if (err && typeof err === 'object') {
		const o = err as { message?: unknown; type?: unknown; target?: { src?: unknown; url?: unknown } };
		if (typeof o.message === 'string' && o.message) return o.message;
		const where = o.target && (o.target.src ?? o.target.url);
		if (typeof o.type === 'string') return `${o.type} event${typeof where === 'string' ? ` from ${where}` : ''}`;
		try {
			const json = JSON.stringify(err);
			if (json && json !== '{}') return json;
		} catch {
			/* not serialisable */
		}
	}
	return 'no reason was given';
}

/** «; counted: 1 clitic with a note of its own, 0 units of many vowels cut, 1 merged»: counts only (`underlay-clitics.ts`, `underlay-counts.ts`); nothing where all are 0. */
function counted(stats: UnderlayStats): string {
	const { ownNote, manyVowels } = stats.counted;
	const { breaches } = stats.counted;
	if (ownNote.length + manyVowels.cut.length + manyVowels.merged.length + breaches.length === 0) return '';
	return `; counted: ${ownNote.length} folded clitic(s) the print gives a note of its own${ownNote.map((o) => ` (system ${o.system} row ${o.row} «${o.text}»)`).join('')}, ${manyVowels.cut.length} unit(s) of two vowels or more uncut, ${manyVowels.merged.length} merged on one note, ${breaches.length} note(s) breaking one vowel per note in the words written`;
}

/** «; no words in system 2 (no Russian row), system 5 (no band)»: the systems of the page that took none; nothing where every one did. */
function tookNone(systems: readonly SystemWords[]): string {
	const none = systems.flatMap((s, i) => (s.written ? [] : [`system ${i + 1} (${s.why})`]));
	return none.length ? `; no words in ${none.join(', ')}` : '';
}

export function makeUnderlayReader<Row>(parts: UnderlayParts<Row>): ReadUnderlay {
	const now = parts.now ?? (() => performance.now());
	return async (image, musicXml, staves) => {
		let stage = 'the Worker';
		let prepared: { rows: number; ms: number } | null = null;
		try {
			const made = await parts.prepare(image, musicXml, staves);
			prepared = { rows: made.rows.length, ms: Math.round(made.ms) };
			stage = 'the reader';
			const t1 = now();
			const reads: WordBox[][] = [];
			for (const row of made.rows) reads.push(await parts.recognize(row));
			const t2 = now();
			stage = 'the dictionary';
			const seams = await parts.seams();
			stage = 'the seating';
			const seated = seatPage(made.layout, reads, seams);
			const ms = { prepare: Math.round(made.ms), read: Math.round(t2 - t1), seat: Math.round(now() - t2) };
			const page: UnderlayPage = { ...seated, ms };
			console.info(`[omr] underlay: page read in ${((ms.prepare + ms.read + ms.seat) / 1000).toFixed(1)} s (worker ${ms.prepare} ms, reader ${ms.read} ms, seating ${ms.seat} ms): ${seated.stats.rows} rows in ${seated.stats.systems} systems, ${seated.stats.seated} syllables seated, ${seated.stats.unseated} unseated${counted(seated.stats)}${tookNone(seated.systems)}`);
			return page;
		} catch (err) {
			console.info(`[omr] underlay: the page was not read (${stage} failed: ${describeError(err)}${prepared ? `; the Worker had framed ${prepared.rows} rows in ${prepared.ms} ms` : ''})`);
			return null;
		}
	};
}
