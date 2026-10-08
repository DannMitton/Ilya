/**
 * A dropped scan, read by homr: the file in, one MusicXML string out.
 *
 * `ScoreUploader.svelte` calls `readScanAsScore` for a PDF or a picture that
 * shows staves, unless the address carries `?reader=ilya` (`useIlyaReader`),
 * which keeps Ilya's own page reader for comparison. The MusicXML that comes
 * back is ingested the way a dropped MusicXML file is, through the
 * component's own `handleFile`, which the component passes in as `ingest`.
 *
 * The pages are rasterized by the same functions Ilya's own reader uses:
 * `rasterizePdf` (every page of a PDF, greyscale PNG at 400 dpi) and
 * `toGreyscalePng` (a picture). homr-web and pdf.js are both imported only
 * here, with dynamic `import()`, so a drop of any other kind pays for neither.
 */
import { toGreyscalePng } from '$lib/reader/page-image';
import type { OmrProgress, OmrReadResult } from './homr-reader';
import { READER_STAMP, type KeptReading } from './stamp';
import { readingWait, type WaitHooks } from '$lib/score/reading-wait.svelte';

export type { OmrProgress, OmrReadResult };
/** The app's one wait, re-exported for the component that echoes it in the drawer. */
export { readingWait };

/** True where the address asks for Ilya's own page reader: `?reader=ilya`. */
export function useIlyaReader(search: string): boolean {
	return new URLSearchParams(search).get('reader') === 'ilya';
}

/** Reads every page of the scan with homr. Never rejects. */
export async function readScan(
	file: File,
	kind: 'image' | 'pdf',
	onProgress?: (p: OmrProgress) => void,
): Promise<OmrReadResult> {
	let inks: ArrayBuffer[];
	try {
		if (kind === 'pdf') {
			const { rasterizePdf } = await import('$lib/reader/page-pdf');
			inks = await rasterizePdf(file);
		} else {
			inks = [await toGreyscalePng(file)];
		}
	} catch (err) {
		return { ok: false, error: 'bad_input', log: String((err as Error)?.message ?? err) };
	}
	const { readScanPages } = await import('./homr-reader');
	return readScanPages(
		inks.map((ink) => new Blob([ink], { type: 'image/png' })),
		onProgress,
	);
}

/** What `readScanAsScore` asks of the component that owns the screen. */
export interface ScanHooks {
	/** Show a wait, named by one of the upload strings. */
	busy: (key: 'upload.status.preparingReader' | 'upload.status.readingPage') => void;
	/**
	 * Ingest this MusicXML file as a dropped MusicXML file is ingested. `reading`
	 * is the same MusicXML with the reader's stamp, for the caller to keep with
	 * the song (`stamp.ts`).
	 */
	ingest: (musicXml: File, reading: KeptReading) => Promise<void>;
	/** homr found no music on any page: try the poem route instead. */
	poem: () => Promise<void>;
	/** homr could not read the scan for any other reason. */
	fail: () => void;
}

/**
 * Reads a scan with homr and hands the joined MusicXML to `hooks.ingest` as
 * a file named after the scan (`song.pdf` becomes `song.musicxml`). The wait
 * is named `upload.status.preparingReader` until homr reports its first
 * stage after the models, then `upload.status.readingPage`. The wait drawn on
 * the Paper follows the same progress (`wait`). `read` is `readScan` and `wait`
 * is the app's one wait, except in tests.
 */
export async function readScanAsScore(
	file: File,
	kind: 'image' | 'pdf',
	hooks: ScanHooks,
	read: typeof readScan = readScan,
	wait: WaitHooks = readingWait,
): Promise<void> {
	hooks.busy('upload.status.preparingReader');
	wait.begin();
	let reading = false;
	const result = await read(file, kind, (p) => {
		wait.progress(p);
		if (!reading && p.stage !== 'models') {
			reading = true;
			hooks.busy('upload.status.readingPage');
		}
	});
	if (!result.ok) {
		wait.cancel();
		console.error(`[omr] homr did not read ${file.name}: ${result.error}`, result.log);
		if (result.error === 'not_music') return hooks.poem();
		return hooks.fail();
	}
	wait.complete();
	logRead(file, result);
	await hooks.ingest(readingFile(file, result.musicXml), { musicXml: result.musicXml, stamp: READER_STAMP });
}

/** The console line for a read that succeeded: pages, time, and the path. */
export function logRead(file: File, result: Extract<OmrReadResult, { ok: true }>): void {
	console.info(
		`[omr] homr read ${result.pagesRead} of ${result.pages} pages of ${file.name} in ${result.durationMs} ms on ${result.backend}` +
			(result.pathNote ? ` (${result.pathNote})` : ''),
	);
}

/** A reading as a file to ingest: `song.pdf` becomes `song.musicxml`. */
export function readingFile(scan: File, musicXml: string): File {
	const stem = scan.name.replace(/\.[^.]+$/, '') || 'score';
	return new File([musicXml], `${stem}.musicxml`, { type: 'application/vnd.recordare.musicxml+xml' });
}
