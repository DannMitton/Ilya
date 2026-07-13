/**
 * Tests for format dispatch (handover v35 §E.3; Round 9 §2 Items 1, 2, 4).
 *
 * These exercise ROUTING only, per the §B.2 seam design: every parser and
 * converter is a fake that records what it received and returns canned
 * results, so no test touches a real `DOMParser` (the sandbox has none) or a
 * real Worker. Container handling is real: `.mxl` fixtures are honest ZIP
 * archives from `zip-fixture.ts`, and the ZIP reader runs unmocked, so the
 * rootfile-resolution paths are covered end to end.
 */

import { describe, it, expect } from 'vitest';
import {
	ingestScoreFile,
	fidelityBanner,
	type IngestDeps,
	type IngestOutcome,
} from './ingest';
import { ZipReadError } from './zip-reader';
import { buildZip, utf8 } from './zip-fixture';
import type { ScoreReader } from '../engine/score-reader';
import type { ParseError, ParseResult, ScoreInput, ScoreParser } from '@ilya/score-parser';

// ── Test doubles ─────────────────────────────────────────────────

const fileOf = (name: string, bytes: Uint8Array): File => new File([bytes as BlobPart], name);

/** The dispatch layer never inspects `result.score`; a cast keeps the fake
 * minimal without pulling a real ParsedScore fixture into these routing tests. */
const parseResult = (errors: ParseError[] = []): ParseResult => ({
	score: {} as ParseResult['score'],
	warnings: [],
	errors,
});

interface RecordingParser extends ScoreParser {
	readonly calls: ScoreInput[];
}

const fakeParser = (
	result: ParseResult | ((input: ScoreInput) => ParseResult) = parseResult()
): RecordingParser => {
	const calls: ScoreInput[] = [];
	return {
		calls,
		canParse: () => true,
		parse: async (input: ScoreInput) => {
			calls.push(input);
			return typeof result === 'function' ? result(input) : result;
		},
	};
};

/** A reader that fails loudly: routes other than `.musx` must never call it. */
const inertReader: ScoreReader = {
	convert: async () => {
		throw new Error('scoreReader.convert should not be reached on this route');
	},
	dispose: () => {},
};

const fakeReader = (convert: (file: File) => Promise<string>): ScoreReader => ({
	convert,
	dispose: () => {},
});

const deps = (over: Partial<IngestDeps> = {}): IngestDeps => ({
	scoreReader: inertReader,
	mnxParser: fakeParser(),
	musicxmlParser: fakeParser(),
	...over,
});

// ── Outcome narrowing ────────────────────────────────────────────

function expectOk(o: IngestOutcome): Extract<IngestOutcome, { ok: true }>['ingested'] {
	if (!o.ok) throw new Error(`expected ok, got error ${JSON.stringify(o.error)}`);
	return o.ingested;
}

function expectErr(o: IngestOutcome): Extract<IngestOutcome, { ok: false }>['error'] {
	if (o.ok) throw new Error(`expected error, got ok ${JSON.stringify(o.ingested.provenance)}`);
	return o.error;
}

// ── Fixtures ─────────────────────────────────────────────────────

const MNX_TEXT = '{ "mnx": { "version": 1 }, "global": {}, "parts": [] }';
const PARTWISE = '<?xml version="1.0"?><score-partwise version="4.0"></score-partwise>';
const containerXml = (fullPath: string) =>
	`<container><rootfiles><rootfile full-path="${fullPath}" media-type="application/vnd.recordare.musicxml+xml"/></rootfiles></container>`;

// ── Direct text routes ───────────────────────────────────────────

describe('ingestScoreFile: direct MNX', () => {
	it('routes MNX to the MNX parser with direct provenance and no banner', async () => {
		const mnxParser = fakeParser();
		const out = await ingestScoreFile(fileOf('song.mnx', utf8(MNX_TEXT)), deps({ mnxParser }));
		const ingested = expectOk(out);
		expect(ingested.provenance).toEqual({ format: 'mnx', via: 'direct' });
		expect(fidelityBanner(ingested.provenance)).toBeNull();
		expect(mnxParser.calls).toHaveLength(1);
		expect(mnxParser.calls[0].format).toBe('mnx');
	});

	it('maps unparseable MNX JSON to INVALID_MNX_JSON', async () => {
		// Detection routes on the "mnx" key; JSON.parse then fails on the
		// truncated body, which is the honest place for the error.
		const out = await ingestScoreFile(fileOf('song.mnx', utf8('{ "mnx": ')), deps());
		expect(expectErr(out).code).toBe('INVALID_MNX_JSON');
	});
});

describe('ingestScoreFile: direct MusicXML', () => {
	it('routes MusicXML to the MusicXML parser with direct provenance', async () => {
		const musicxmlParser = fakeParser();
		const out = await ingestScoreFile(
			fileOf('song.musicxml', utf8(PARTWISE)),
			deps({ musicxmlParser })
		);
		const ingested = expectOk(out);
		expect(ingested.provenance).toEqual({ format: 'musicxml', via: 'direct' });
		expect(fidelityBanner(ingested.provenance)).toBeNull();
		expect(String(musicxmlParser.calls[0].data)).toContain('score-partwise');
	});
});

// ── Parse-result handling ────────────────────────────────────────

describe('ingestScoreFile: parse diagnostics', () => {
	it('turns a fatal parse error into PARSE_FAILED, carrying the fatal errors', async () => {
		const fatal: ParseError = { code: 'no-measures', message: 'empty score', fatal: true };
		const out = await ingestScoreFile(
			fileOf('song.mnx', utf8(MNX_TEXT)),
			deps({ mnxParser: fakeParser(parseResult([fatal])) })
		);
		const error = expectErr(out);
		if (error.code !== 'PARSE_FAILED') throw new Error(`expected PARSE_FAILED, got ${error.code}`);
		expect(error.errors).toHaveLength(1);
		expect(error.errors[0].code).toBe('no-measures');
	});

	it('lets a non-fatal parse error ride through on the result', async () => {
		const nonFatal: ParseError = { code: 'no-measures', message: 'recovered', fatal: false };
		const out = await ingestScoreFile(
			fileOf('song.mnx', utf8(MNX_TEXT)),
			deps({ mnxParser: fakeParser(parseResult([nonFatal])) })
		);
		const ingested = expectOk(out);
		expect(ingested.result.errors).toHaveLength(1);
		expect(ingested.result.errors[0].fatal).toBe(false);
	});
});

// ── .mxl container route ─────────────────────────────────────────

describe('ingestScoreFile: .mxl container', () => {
	it('resolves the manifest rootfile and routes to MusicXML with mxl provenance', async () => {
		const zip = await buildZip([
			{ name: 'META-INF/container.xml', data: utf8(containerXml('score.xml')) },
			{ name: 'score.xml', data: utf8(PARTWISE), method: 8 },
		]);
		const musicxmlParser = fakeParser();
		const out = await ingestScoreFile(fileOf('song.mxl', zip), deps({ musicxmlParser }));
		const ingested = expectOk(out);
		expect(ingested.provenance).toEqual({ format: 'musicxml', via: 'mxl' });
		expect(fidelityBanner(ingested.provenance)).toBeNull();
		expect(String(musicxmlParser.calls[0].data)).toContain('score-partwise');
	});

	it('falls back to the first score member when no manifest is present', async () => {
		const zip = await buildZip([{ name: 'score.xml', data: utf8(PARTWISE) }]);
		const musicxmlParser = fakeParser();
		const out = await ingestScoreFile(fileOf('song.mxl', zip), deps({ musicxmlParser }));
		expect(expectOk(out).provenance).toEqual({ format: 'musicxml', via: 'mxl' });
		expect(String(musicxmlParser.calls[0].data)).toContain('score-partwise');
	});

	it('falls back when the manifest points at a missing member', async () => {
		const zip = await buildZip([
			{ name: 'META-INF/container.xml', data: utf8(containerXml('ghost.xml')) },
			{ name: 'actual.xml', data: utf8(PARTWISE) },
		]);
		const musicxmlParser = fakeParser();
		const out = await ingestScoreFile(fileOf('song.mxl', zip), deps({ musicxmlParser }));
		expect(expectOk(out).provenance).toEqual({ format: 'musicxml', via: 'mxl' });
		expect(String(musicxmlParser.calls[0].data)).toContain('score-partwise');
	});

	it('maps a manifest-less, score-less archive to MXL_NO_ROOTFILE', async () => {
		const zip = await buildZip([
			{ name: 'META-INF/container.xml', data: utf8(containerXml('ghost.xml')) },
			{ name: 'notes.txt', data: utf8('no score here') },
		]);
		const out = await ingestScoreFile(fileOf('song.mxl', zip), deps());
		expect(expectErr(out).code).toBe('MXL_NO_ROOTFILE');
	});

	it('maps an unreadable ZIP to CONTAINER_UNREADABLE with the ZIP failure kind', async () => {
		// PK local-header magic, then nothing: passes detection (isZip + .mxl),
		// fails at the ZIP reader with kind not-a-zip.
		const truncated = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00]);
		const out = await ingestScoreFile(fileOf('song.mxl', truncated), deps());
		const error = expectErr(out);
		if (error.code !== 'CONTAINER_UNREADABLE') {
			throw new Error(`expected CONTAINER_UNREADABLE, got ${error.code}`);
		}
		expect(error.container).toBe('mxl');
		expect(error.zipKind).toBe('not-a-zip');
	});
});

// ── .musx denigma route ──────────────────────────────────────────

describe('ingestScoreFile: .musx via denigma', () => {
	const musxFile = async () => fileOf('song.musx', await buildZip([{ name: 'score.dat', data: utf8('x') }]));

	it('converts via the scoreReader and earns the denigma banner', async () => {
		const mnxParser = fakeParser();
		const out = await ingestScoreFile(
			await musxFile(),
			deps({ scoreReader: fakeReader(async () => MNX_TEXT), mnxParser })
		);
		const ingested = expectOk(out);
		expect(ingested.provenance).toEqual({ format: 'mnx', via: 'denigma', sourceFormat: 'musx' });
		expect(fidelityBanner(ingested.provenance)).toBe('denigma');
		expect(mnxParser.calls[0].format).toBe('mnx');
	});

	it('passes a denigma CONVERSION_FAILED through verbatim', async () => {
		const out = await ingestScoreFile(
			await musxFile(),
			deps({
				scoreReader: fakeReader(async () => {
					throw { code: 'CONVERSION_FAILED', message: 'unreadable score' };
				}),
			})
		);
		const error = expectErr(out);
		expect(error.code).toBe('CONVERSION_FAILED');
		if (error.code === 'CONVERSION_FAILED') expect(error.message).toBe('unreadable score');
	});

	it('passes a denigma WASM_LOAD_FAILED through verbatim', async () => {
		const out = await ingestScoreFile(
			await musxFile(),
			deps({
				scoreReader: fakeReader(async () => {
					throw { code: 'WASM_LOAD_FAILED', message: 'module missing' };
				}),
			})
		);
		expect(expectErr(out).code).toBe('WASM_LOAD_FAILED');
	});

	it('wraps an untyped converter throw as CONVERSION_FAILED with its message', async () => {
		const out = await ingestScoreFile(
			await musxFile(),
			deps({
				scoreReader: fakeReader(async () => {
					throw new Error('worker died');
				}),
			})
		);
		const error = expectErr(out);
		expect(error.code).toBe('CONVERSION_FAILED');
		if (error.code === 'CONVERSION_FAILED') expect(error.message).toBe('worker died');
	});
});

// ── .mscz webmscore route ────────────────────────────────────────

describe('ingestScoreFile: .mscz via webmscore', () => {
	const msczFile = async () => fileOf('song.mscz', await buildZip([{ name: 'score.mscx', data: utf8('x') }]));

	it('converts via the injected msczConvert with webmscore provenance and no banner', async () => {
		const musicxmlParser = fakeParser();
		const out = await ingestScoreFile(
			await msczFile(),
			deps({ msczConvert: async () => PARTWISE, musicxmlParser })
		);
		const ingested = expectOk(out);
		expect(ingested.provenance).toEqual({
			format: 'musicxml',
			via: 'webmscore',
			sourceFormat: 'mscz',
		});
		expect(fidelityBanner(ingested.provenance)).toBeNull();
		expect(String(musicxmlParser.calls[0].data)).toContain('score-partwise');
	});

	it('maps a missing converter to MSCZ_CONVERTER_UNAVAILABLE rather than crashing', async () => {
		const out = await ingestScoreFile(await msczFile(), deps());
		expect(expectErr(out).code).toBe('MSCZ_CONVERTER_UNAVAILABLE');
	});

	it('maps a ZipReadError from the converter to CONTAINER_UNREADABLE (mscz)', async () => {
		const out = await ingestScoreFile(
			await msczFile(),
			deps({
				msczConvert: async () => {
					throw new ZipReadError('decompress-failed', 'bad member');
				},
			})
		);
		const error = expectErr(out);
		if (error.code !== 'CONTAINER_UNREADABLE') {
			throw new Error(`expected CONTAINER_UNREADABLE, got ${error.code}`);
		}
		expect(error.container).toBe('mscz');
		expect(error.zipKind).toBe('decompress-failed');
	});

	it('wraps a generic converter throw as CONVERSION_FAILED', async () => {
		const out = await ingestScoreFile(
			await msczFile(),
			deps({
				msczConvert: async () => {
					throw new Error('webmscore blew up');
				},
			})
		);
		expect(expectErr(out).code).toBe('CONVERSION_FAILED');
	});
});

// ── Detection-failure mapping ────────────────────────────────────

describe('ingestScoreFile: detection failures', () => {
	it('maps a PDF upload to DETECTION_FAILED carrying the pdf kind', async () => {
		const out = await ingestScoreFile(fileOf('scan.pdf', utf8('%PDF-1.7\n')), deps());
		const error = expectErr(out);
		if (error.code !== 'DETECTION_FAILED') throw new Error(`expected DETECTION_FAILED, got ${error.code}`);
		expect(error.failure.kind).toBe('pdf');
	});

	it('maps a pre-2014 Finale .mus upload to DETECTION_FAILED carrying its kind', async () => {
		const out = await ingestScoreFile(fileOf('old.mus', utf8('anything')), deps());
		const error = expectErr(out);
		if (error.code !== 'DETECTION_FAILED') throw new Error(`expected DETECTION_FAILED, got ${error.code}`);
		expect(error.failure.kind).toBe('pre-2014-finale');
	});
});

// ── fidelityBanner unit coverage ─────────────────────────────────

describe('fidelityBanner', () => {
	it('banners only the denigma tier', () => {
		expect(fidelityBanner({ format: 'mnx', via: 'denigma', sourceFormat: 'musx' })).toBe('denigma');
		expect(fidelityBanner({ format: 'mnx', via: 'direct' })).toBeNull();
		expect(fidelityBanner({ format: 'musicxml', via: 'direct' })).toBeNull();
		expect(fidelityBanner({ format: 'musicxml', via: 'mxl' })).toBeNull();
		expect(fidelityBanner({ format: 'musicxml', via: 'webmscore', sourceFormat: 'mscz' })).toBeNull();
	});
});
