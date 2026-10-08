/**
 * Bringing a stored scan back: homr's reading, kept or made again.
 *
 * A song whose source is a scan (a PDF, or a picture) is restored the way a
 * dropped scan is read, by homr (`scan.ts`), and never by Ilya's own page
 * reader, which stays behind `?reader=ilya`. The reading is kept with the song
 * (`stamp.ts`): where its stamp equals the reader's now, it is used as it is
 * and nothing is read; where it does not, or where the song has none (a song
 * stored before the homr reader), the scan is read once by homr and the new
 * reading is returned for the caller to keep.
 *
 * Nothing here touches the browser, the library, or the screen. `read` stands
 * in for `readScan`, so every branch is a unit test.
 */
import { READER_STAMP, type KeptReading } from './stamp';
import type { OmrProgress, OmrReadResult } from './homr-reader';
import { logRead, readingFile, readScan } from './scan';
import { readingWait, type WaitHooks } from '$lib/score/reading-wait.svelte';
import type { SongSource } from '$lib/library/types';
import type { SourceBytes } from '$lib/library/driver';
export type { KeptReading } from './stamp';

export type ScanKind = 'image' | 'pdf';

export type Restored =
	| {
			ok: true;
			/** The reading to ingest. */
			musicXml: string;
			/** `kept`: the stored reading, nothing read. `homr`: read now, and `reading` is to be kept. */
			from: 'kept' | 'homr';
			/** The reading to store with the song; present only where homr read it now. */
			reading?: KeptReading;
			/** The reader's own result, where it ran, for the console line. */
			result?: Extract<OmrReadResult, { ok: true }>;
	  }
	| { ok: false; error: string; log: string };

/** True where a kept reading was made by the reader that is installed now. */
export function isCurrent(reading: KeptReading | null | undefined, stamp: string = READER_STAMP): reading is KeptReading {
	return !!reading && reading.stamp === stamp && typeof reading.musicXml === 'string' && reading.musicXml.length > 0;
}

export async function restoreScan(
	file: File,
	kind: ScanKind,
	kept: KeptReading | null | undefined,
	read: (file: File, kind: ScanKind, onProgress?: (p: OmrProgress) => void) => Promise<OmrReadResult>,
	onProgress?: (p: OmrProgress) => void,
	stamp: string = READER_STAMP,
): Promise<Restored> {
	if (isCurrent(kept, stamp)) return { ok: true, musicXml: kept.musicXml, from: 'kept' };
	const result = await read(file, kind, onProgress);
	if (!result.ok) return { ok: false, error: result.error, log: result.log };
	return {
		ok: true,
		musicXml: result.musicXml,
		from: 'homr',
		reading: { musicXml: result.musicXml, stamp },
		result,
	};
}

/** What `restoreStoredScan` asks of the component that owns the screen. */
export interface RestoreHooks {
	/** Show a wait, named by one of the upload strings. */
	busy: (key: 'upload.status.preparingReader' | 'upload.status.readingPage') => void;
	/** Ingest the reading as a dropped MusicXML file is ingested; true where it arrived. */
	ingest: (musicXml: File) => Promise<boolean>;
	/** homr could not read the scan: the song and its scan are still stored. */
	fail: () => void;
	/** The scan was read again now: keep this reading with the song. */
	keep: (reading: KeptReading) => void;
}

/**
 * Restores a stored scan into the screen: the kept reading where it is the
 * reader's own, otherwise a read by homr, logged as a dropped scan's is. Never
 * rejects.
 */
export async function restoreStoredScan(
	file: File,
	kind: ScanKind,
	kept: KeptReading | null | undefined,
	hooks: RestoreHooks,
	read: Parameters<typeof restoreScan>[3] = readScan,
	wait: WaitHooks = readingWait,
): Promise<void> {
	if (!isCurrent(kept)) {
		hooks.busy('upload.status.preparingReader');
		wait.begin();
	}
	let reading = false;
	const restored = await restoreScan(file, kind, kept, read, (p) => {
		wait.progress(p);
		if (!reading && p.stage !== 'models') {
			reading = true;
			hooks.busy('upload.status.readingPage');
		}
	});
	if (!restored.ok) {
		wait.cancel();
		console.error(`[omr] homr did not read ${file.name}: ${restored.error}`, restored.log);
		return hooks.fail();
	}
	wait.complete();
	if (restored.result) logRead(file, restored.result);
	const arrived = await hooks.ingest(readingFile(file, restored.musicXml));
	if (arrived && restored.reading) hooks.keep(restored.reading);
}

/**
 * The stored source of a scan that was read again on restore: the same bytes
 * and provenance, with the new reading beside them (`document.keepReading`).
 */
export function storedWithReading(
	songId: string,
	stored: { fileName: string; bytes: ArrayBuffer },
	provenance: SongSource | null,
	reading: KeptReading,
): SourceBytes {
	return {
		songId,
		fileName: stored.fileName,
		bytes: stored.bytes,
		byteLength: stored.bytes.byteLength,
		contentHash: provenance?.contentHash ?? '',
		importedAt: provenance?.importedAt ?? new Date().toISOString(),
		reading,
	};
}
