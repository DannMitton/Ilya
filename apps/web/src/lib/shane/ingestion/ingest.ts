/**
 * Format dispatch: the ingestion API the ScoreUploader calls and live
 * wiring builds on (handover v34 §E.1; Round 9 §2 Items 1, 2, and 4).
 *
 * One entry point, `ingestScoreFile`, takes the uploaded File and returns
 * either a parsed score with its PROVENANCE (which fidelity tier the UI
 * shows, Round 9 Item 1) or a typed error the UI can map to specific,
 * persistent, inline copy. Nothing here renders or speaks; copy lives with
 * the component and the i18n table.
 *
 * Routing per format:
 * - MNX: decode, `JSON.parse`, `MnxScoreParser`. Direct tier, no banner.
 * - MusicXML: decode, `MusicXmlScoreParser`. Direct tier, no banner.
 * - `.mxl`: unzip, resolve the rootfile via `META-INF/container.xml`
 *   (falling back to the first plausible member), then the MusicXML path.
 *   Still the direct tier: decompression is not conversion.
 * - `.musx`: the existing denigma seam (`ScoreReader`, a warm WASM
 *   Worker), then the MNX path. Converted tier: dismissible banner.
 * - `.mscz`: the injected webmscore converter, then the MusicXML path.
 *   Silent acceptance with a "via MuseScore" format label (Round 9 Item 1:
 *   MuseScore's own engine is native to MuseScore, so no banner).
 *
 * Dependencies are injected so the routing logic tests as a pure seam:
 * the real parsers are the defaults; the Worker-backed converters have no
 * sandbox-runnable default and always arrive from the caller.
 */

import {
	MnxScoreParser,
	MusicXmlScoreParser,
	type ParseError,
	type ParseResult,
	type ScoreParser,
} from '@ilya/score-parser';
import type { ScoreReader } from '../engine/score-reader';
import type { DenigmaError, ResourceError } from '../engine/errors';
import {
	detectScoreFormat,
	decodeScoreText,
	type DetectionFailure,
} from './format-detection';
import { recognizedToMusicXml, type EngravingAnswers } from './recognized-to-musicxml';
import type { ReadReport, RecognizedOutput } from './recognized';
import { listZipEntries, readZipEntry, ZipReadError, type ZipFailureKind } from './zip-reader';

// ── Provenance (drives the fidelity surface, Round 9 Item 1) ─────

export type IngestProvenance =
	| { format: 'mnx'; via: 'direct' }
	| { format: 'musicxml'; via: 'direct' }
	| { format: 'musicxml'; via: 'mxl' }
	| { format: 'mnx'; via: 'denigma'; sourceFormat: 'musx' }
	| { format: 'musicxml'; via: 'webmscore'; sourceFormat: 'mscz' }
	/** N.59, Ruling C: read off a picture by the E.16 page reader under Pyodide. */
	| { format: 'musicxml'; via: 'reader'; sourceFormat: 'pdf' | 'image' };

/**
 * Which dismissible fidelity banner a provenance earns.
 *
 * N.59 adds the `reader` tier, which this function's own comment anticipated.
 * It is the LOWEST-fidelity arrival Ilya has: denigma converts one notation
 * format to another and can be wrong about details, while the reader is
 * reading ink off a photograph and can be wrong about the notes. A singer is
 * told so once, dismissibly, rather than by a mark on the page (E.47's strike).
 */
export const fidelityBanner = (p: IngestProvenance): 'denigma' | 'reader' | null => {
	if (p.via === 'denigma') return 'denigma';
	if (p.via === 'reader') return 'reader';
	return null;
};

export interface IngestedScore {
	fileName: string;
	provenance: IngestProvenance;
	/** May carry non-fatal warnings; fatal parses become `IngestError`s. */
	result: ParseResult;
	/**
	 * N.59, Ruling D. Present only on the reader route. The drawer declares
	 * these numbers; nothing here is ever drawn on the page.
	 */
	readReport?: ReadReport;
}

/** What the page-reader seam hands back (N.59). */
export interface PageRead {
	ro: RecognizedOutput;
	report: ReadReport;
}

// ── Errors ───────────────────────────────────────────────────────

/**
 * The typed failure vocabulary for the upload surface. Denigma's codes
 * (`CONVERSION_FAILED`, `WASM_LOAD_FAILED`) pass through verbatim so the
 * uploader shares copy with the existing first-load handling.
 */
export type IngestError =
	| { code: 'DETECTION_FAILED'; failure: DetectionFailure }
	| { code: 'CONTAINER_UNREADABLE'; container: 'mxl' | 'mscz'; zipKind: ZipFailureKind }
	| { code: 'MXL_NO_ROOTFILE' }
	| { code: 'INVALID_MNX_JSON' }
	| { code: 'PARSE_FAILED'; errors: ParseError[] }
	| { code: 'MSCZ_CONVERTER_UNAVAILABLE' }
	/** N.59: the page reader was never wired in (a caller without the dep). */
	| { code: 'PAGE_READER_UNAVAILABLE' }
	/** N.59: Pyodide, its packages, or the reader modules did not load. */
	| { code: 'PAGE_READER_LOAD_FAILED'; message: string }
	/** N.59: the picture loaded but the read itself failed. */
	| { code: 'PAGE_READ_FAILED'; message: string }
	/** N.59: the browser could not decode the picture at all (HEIC on Chromium). */
	| { code: 'IMAGE_UNDECODABLE' }
	/** N.59 step 8: the PDF could not be opened, or carries no pages. */
	| { code: 'PDF_UNREADABLE'; message: string }
	/** N.96: the PDF renders blank and its own bytes carry a /JBIG2Decode filter. */
	| { code: 'PDF_JBIG2_UNDECODED'; message: string }
	| DenigmaError
	| ResourceError;

export type IngestOutcome =
	| { ok: true; ingested: IngestedScore }
	| { ok: false; error: IngestError };

// ── Dependencies ─────────────────────────────────────────────────

export interface IngestDeps {
	/** The denigma seam for `.musx`. The component owns its lifecycle. */
	scoreReader: ScoreReader;

	/**
	 * The webmscore seam for `.mscz`: whole-file bytes in, MusicXML text
	 * out. Absent while the spike is pending; `.mscz` uploads then land in
	 * `MSCZ_CONVERTER_UNAVAILABLE` rather than a crash.
	 */
	msczConvert?: (bytes: Uint8Array, fileName: string) => Promise<string>;

	/**
	 * N.59, Ruling C: the page-reader seam. Whole picture in, recognized output
	 * plus a read report out. The component owns the Worker's lifecycle, the
	 * greyscale conversion, and the decode, exactly as it owns webmscore's.
	 * Absent for every caller that is not the uploader, so a picture then lands
	 * in PAGE_READER_UNAVAILABLE rather than a crash.
	 */
	readPages?: (file: File, answers: EngravingAnswers) => Promise<PageRead>;

	/**
	 * N.59, Ruling A: the singer's clef, key, and octave, answered in the
	 * uploader before the read because the reader detects none of them.
	 */
	engravingAnswers?: EngravingAnswers;

	/** Parser overrides for routing tests; real parsers by default. */
	mnxParser?: ScoreParser;
	musicxmlParser?: ScoreParser;
}

// ── Dispatch ─────────────────────────────────────────────────────

const err = (error: IngestError): IngestOutcome => ({ ok: false, error });

export async function ingestScoreFile(file: File, deps: IngestDeps): Promise<IngestOutcome> {
	const bytes = new Uint8Array(await file.arrayBuffer());
	const detected = detectScoreFormat(file.name, bytes);
	if (!detected.ok) return err({ code: 'DETECTION_FAILED', failure: detected.failure });

	const mnxParser = deps.mnxParser ?? new MnxScoreParser();
	const musicxmlParser = deps.musicxmlParser ?? new MusicXmlScoreParser();

	switch (detected.format) {
		case 'mnx':
			return parseMnxText(decodeScoreText(bytes), file.name, mnxParser, {
				format: 'mnx',
				via: 'direct',
			});

		case 'musicxml':
			return parseMusicXmlText(decodeScoreText(bytes), file.name, musicxmlParser, {
				format: 'musicxml',
				via: 'direct',
			});

		case 'mxl': {
			let xmlText: string;
			try {
				xmlText = decodeScoreText(await readMxlRootfile(bytes));
			} catch (e) {
				if (e instanceof ZipReadError) {
					return err({ code: 'CONTAINER_UNREADABLE', container: 'mxl', zipKind: e.kind });
				}
				if (e instanceof MxlRootfileError) return err({ code: 'MXL_NO_ROOTFILE' });
				throw e;
			}
			return parseMusicXmlText(xmlText, file.name, musicxmlParser, {
				format: 'musicxml',
				via: 'mxl',
			});
		}

		case 'musx': {
			let mnxText: string;
			try {
				mnxText = await deps.scoreReader.convert(file);
			} catch (e) {
				return err(asConverterError(e));
			}
			return parseMnxText(mnxText, file.name, mnxParser, {
				format: 'mnx',
				via: 'denigma',
				sourceFormat: 'musx',
			});
		}

		case 'pdf':
		case 'image': {
			if (!deps.readPages || !deps.engravingAnswers) {
				return err({ code: 'PAGE_READER_UNAVAILABLE' });
			}
			let read: PageRead;
			try {
				read = await deps.readPages(file, deps.engravingAnswers);
			} catch (e) {
				return err(asReaderError(e));
			}
			const { xml, counts } = recognizedToMusicXml(read.ro, deps.engravingAnswers);
			const outcome = await parseMusicXmlText(xml, file.name, musicxmlParser, {
				format: 'musicxml',
				via: 'reader',
				sourceFormat: detected.format,
			});
			if (!outcome.ok) return outcome;
			// The Worker counts substitutions over `ro`; the converter counts what
			// it actually EMITTED. The singer is shown the second, because that is
			// what is on their page. The geometry and timings stay the Worker's.
			return {
				ok: true,
				ingested: {
					...outcome.ingested,
					readReport: {
						...read.report,
						pitchSubstitutions: counts.pitchSubstitutions,
						durationSubstitutions: counts.durationSubstitutions,
					},
				},
			};
		}

		case 'mscz': {
			if (!deps.msczConvert) return err({ code: 'MSCZ_CONVERTER_UNAVAILABLE' });
			let xmlText: string;
			try {
				xmlText = await deps.msczConvert(bytes, file.name);
			} catch (e) {
				if (e instanceof ZipReadError) {
					return err({ code: 'CONTAINER_UNREADABLE', container: 'mscz', zipKind: e.kind });
				}
				return err(asConverterError(e));
			}
			return parseMusicXmlText(xmlText, file.name, musicxmlParser, {
				format: 'musicxml',
				via: 'webmscore',
				sourceFormat: 'mscz',
			});
		}
	}
}

// ── The two terminal parse paths ─────────────────────────────────

async function parseMnxText(
	text: string,
	fileName: string,
	parser: ScoreParser,
	provenance: IngestProvenance
): Promise<IngestOutcome> {
	let data: object;
	try {
		data = JSON.parse(text) as object;
	} catch {
		return err({ code: 'INVALID_MNX_JSON' });
	}
	return toOutcome(await parser.parse({ format: 'mnx', data, sourcePath: fileName }), fileName, provenance);
}

async function parseMusicXmlText(
	text: string,
	fileName: string,
	parser: ScoreParser,
	provenance: IngestProvenance
): Promise<IngestOutcome> {
	return toOutcome(
		await parser.parse({ format: 'musicxml', data: text, sourcePath: fileName }),
		fileName,
		provenance
	);
}

function toOutcome(
	result: ParseResult,
	fileName: string,
	provenance: IngestProvenance
): IngestOutcome {
	const fatal = result.errors.filter((e) => e.fatal);
	if (fatal.length > 0) return err({ code: 'PARSE_FAILED', errors: fatal });
	return { ok: true, ingested: { fileName, provenance, result } };
}

// ── `.mxl` rootfile resolution ───────────────────────────────────

class MxlRootfileError extends Error {}

/**
 * Resolve and read the `.mxl` archive's score member. The container spec
 * names it in `META-INF/container.xml` as the first `<rootfile>`'s
 * `full-path`; the attribute is pulled with a regex because container.xml
 * is a fixed, tiny manifest and dispatch must run where no DOM exists.
 * Archives without a manifest (seen in the wild) fall back to the first
 * `.xml`/`.musicxml` member outside `META-INF/`.
 */
async function readMxlRootfile(bytes: Uint8Array): Promise<Uint8Array> {
	const entries = listZipEntries(bytes);

	const manifest = entries.find((e) => e.name === 'META-INF/container.xml');
	if (manifest) {
		const text = decodeScoreText(await readZipEntry(bytes, manifest.name));
		const match = text.match(/<rootfile[^>]*full-path\s*=\s*(?:"([^"]+)"|'([^']+)')/);
		const path = match?.[1] ?? match?.[2];
		if (path && entries.some((e) => e.name === path)) {
			return readZipEntry(bytes, path);
		}
		// A manifest that points nowhere is treated like no manifest.
	}

	const candidate = entries.find(
		(e) =>
			!e.name.startsWith('META-INF/') &&
			(e.name.toLowerCase().endsWith('.xml') || e.name.toLowerCase().endsWith('.musicxml'))
	);
	if (!candidate) throw new MxlRootfileError('no score member found in .mxl archive');
	return readZipEntry(bytes, candidate.name);
}

// ── Converter error mapping ──────────────────────────────────────

/**
 * Narrow a thrown converter failure to the shared vocabulary. The denigma
 * facade rejects with plain `{ code, message }` objects (they cross a
 * postMessage boundary), so `instanceof` is useless here; the code field
 * is the contract (engine errors.ts).
 */
/**
 * Narrow a thrown page-reader failure. The Worker rejects with plain
 * `{ code, message }` objects across a postMessage boundary, so `instanceof`
 * is useless here and the code field is the contract, exactly as for denigma.
 */
function asReaderError(e: unknown): IngestError {
	if (typeof e === 'object' && e !== null && 'code' in e) {
		const code = (e as { code: unknown }).code;
		const message = String((e as { message?: unknown }).message ?? '');
		if (code === 'READER_LOAD_FAILED') return { code: 'PAGE_READER_LOAD_FAILED', message };
		if (code === 'READ_FAILED') return { code: 'PAGE_READ_FAILED', message };
		if (code === 'IMAGE_UNDECODABLE') return { code: 'IMAGE_UNDECODABLE' };
		if (code === 'PDF_UNREADABLE') return { code: 'PDF_UNREADABLE', message };
		if (code === 'PDF_JBIG2_UNDECODED') return { code: 'PDF_JBIG2_UNDECODED', message };
	}
	return { code: 'PAGE_READ_FAILED', message: e instanceof Error ? e.message : String(e) };
}

function asConverterError(e: unknown): IngestError {
	if (typeof e === 'object' && e !== null && 'code' in e) {
		const code = (e as { code: unknown }).code;
		if (code === 'CONVERSION_FAILED' || code === 'WASM_LOAD_FAILED' || code === 'SCORE_TOO_LARGE_FOR_DEVICE') {
			return e as DenigmaError | ResourceError;
		}
	}
	return { code: 'CONVERSION_FAILED', message: e instanceof Error ? e.message : String(e) };
}
