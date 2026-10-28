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
	foldDictionMarks,
	MnxScoreParser,
	MusicXmlScoreParser,
	type ParseError,
	type ParseResult,
	type ScoreParser,
	type SourceOrigin,
} from '@ilya/score-parser';
import type { ScoreReader } from '$lib/reader/score-reader';
import type { DenigmaError, ResourceError } from '$lib/reader/errors';
import {
	detectScoreFormat,
	decodeScoreText,
	type DetectionFailure,
} from './format-detection';
import { listZipEntries, readZipEntry, ZipReadError, type ZipFailureKind } from '$lib/reader/zip-reader';

// ── Provenance (drives the fidelity surface, Round 9 Item 1) ─────

export type IngestProvenance =
	| { format: 'mnx'; via: 'direct' }
	| { format: 'musicxml'; via: 'direct' }
	| { format: 'musicxml'; via: 'mxl' }
	| { format: 'mnx'; via: 'denigma'; sourceFormat: 'musx' }
	| { format: 'musicxml'; via: 'webmscore'; sourceFormat: 'mscz' };

/**
 * Which dismissible fidelity banner a provenance earns. The `reader` tier
 * left with the old page reader (2026-10-27): a scan arrives as homr's
 * MusicXML, which ingests as `via: 'direct'` and earns no banner.
 */
export const fidelityBanner = (p: IngestProvenance): 'denigma' | null => {
	if (p.via === 'denigma') return 'denigma';
	return null;
};

/**
 * QUEUE row 95. Which courtesy message a wordless arrival earns.
 *
 * A file with no lyric elements really has no words in it, and says so. A scan
 * or photograph is different: its print may carry words that Ilya's reader
 * does not read, so its wordlessness is Ilya's limit, not a fact about the
 * song. The two are told apart by the score's own `source.origin`: the
 * singer's homr route hands its reading back as a `.musicxml` file, which
 * ingests as `via: 'direct'`, but homr stamps `<software>homr</software>` and
 * the parser reads that as `'homr-musicxml-from-image'` (row 121). A pure
 * function because `+page.svelte` is inert under vitest.
 */
export type NoLyricsNoticeKey = 'upload.banner.noLyrics' | 'upload.banner.noLyricsScan';

export const noLyricsNoticeKey = (p: IngestProvenance, origin: SourceOrigin): NoLyricsNoticeKey =>
	origin === 'homr-musicxml-from-image' ? 'upload.banner.noLyricsScan' : 'upload.banner.noLyrics';

export interface IngestedScore {
	fileName: string;
	provenance: IngestProvenance;
	/** May carry non-fatal warnings; fatal parses become `IngestError`s. */
	result: ParseResult;
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
	/** A picture or PDF reached dispatch. `take()` sends every scan to homr first. */
	| { code: 'PAGE_READER_UNAVAILABLE' }
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
		case 'image':
			// A picture or PDF reaching dispatch is the uploader's fault: `take()`
			// routes every scan to homr before dispatch, and homr's MusicXML is
			// what arrives here.
			return err({ code: 'PAGE_READER_UNAVAILABLE' });

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
	return { ok: true, ingested: { fileName, provenance, result: withDictionMarksFolded(result) } };
}

/**
 * N.171, "Switch it on" (Dann, 2026-09-24): the `#` phonation-break mark is
 * folded out of the syllable slot it took, here, at the one seam every
 * arrival passes through, so Text, Markup, the seat, and every resolver read
 * the same repaired underlay.
 *
 * Dann's rule, 2026-07-30 (`diction-marks.ts:8-12`): the mark joins the
 * syllable before it and is never discarded, so the boundary survives as a
 * fact. The fold records what it did on `score.dictionMarks`, which is how
 * `buildUnderlayResolvers` abstains on the vacated tail rather than carrying a
 * vowel onto a note the verse never reached.
 *
 * A score with no mark in any verse comes back BY REFERENCE, so this is
 * exactly the old arrival wherever there is nothing to repair.
 */
function withDictionMarksFolded(result: ParseResult): ParseResult {
	// No vocal line, nothing to fold (and `foldDictionMarks` rightly throws).
	if (!Array.isArray(result.score?.vocalLine)) return result;
	const fold = foldDictionMarks(result.score);
	return fold.score === result.score ? result : { ...result, score: fold.score };
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
function asConverterError(e: unknown): IngestError {
	if (typeof e === 'object' && e !== null && 'code' in e) {
		const code = (e as { code: unknown }).code;
		if (code === 'CONVERSION_FAILED' || code === 'WASM_LOAD_FAILED' || code === 'SCORE_TOO_LARGE_FOR_DEVICE') {
			return e as DenigmaError | ResourceError;
		}
	}
	return { code: 'CONVERSION_FAILED', message: e instanceof Error ? e.message : String(e) };
}
