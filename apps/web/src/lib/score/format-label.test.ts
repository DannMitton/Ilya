import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser, type ScoreParser, type SourceOrigin } from '@ilya/score-parser';
import { t } from '$lib/i18n';
import { readingFile } from '$lib/omr/scan';
import { parseXml } from './ingestion/mini-dom';
import { ingestScoreFile, type IngestDeps, type IngestProvenance } from './ingestion/ingest';
import { formatLabelKey } from './format-label';

// QUEUE row 122. The two reader strings are ratified and reused; no string is new.

const file: SourceOrigin = 'musicxml-direct';
const homr: SourceOrigin = 'homr-musicxml-from-image';

describe('row 122: every provenance keeps today’s key', () => {
	it.each<[IngestProvenance, string]>([
		[{ format: 'musicxml', via: 'direct' }, 'upload.format.musicxmlDirect'],
		[{ format: 'mnx', via: 'direct' }, 'upload.format.mnxDirect'],
		[{ format: 'musicxml', via: 'mxl' }, 'upload.format.mxl'],
		[{ format: 'mnx', via: 'denigma', sourceFormat: 'musx' }, 'upload.format.musxDenigma'],
		[{ format: 'musicxml', via: 'webmscore', sourceFormat: 'mscz' }, 'upload.format.msczWebmscore'],
	])('%j', (p, key) => {
		expect(formatLabelKey(p, file)).toBe(key);
	});
	it('a scan kind does not change a file that is not a homr reading', () => {
		expect(formatLabelKey({ format: 'musicxml', via: 'direct' }, file, 'pdf')).toBe('upload.format.musicxmlDirect');
		expect(formatLabelKey({ format: 'musicxml', via: 'direct' }, file, 'image')).toBe('upload.format.musicxmlDirect');
	});
});

describe('row 122: a homr reading is named by what the singer dropped', () => {
	const direct: IngestProvenance = { format: 'musicxml', via: 'direct' };
	it('a PDF', () => {
		expect(formatLabelKey(direct, homr, 'pdf')).toBe('upload.format.pdfReader');
	});
	it('a photograph', () => {
		expect(formatLabelKey(direct, homr, 'image')).toBe('upload.format.imageReader');
	});
	it('a homr origin with no known kind keeps the direct key', () => {
		expect(formatLabelKey(direct, homr)).toBe('upload.format.musicxmlDirect');
	});
	it('the strings read as the ratified ones, in both languages', () => {
		expect(t(formatLabelKey(direct, homr, 'pdf'), 'en')).toBe('Format: PDF → MusicXML');
		expect(t(formatLabelKey(direct, homr, 'image'), 'en')).toBe('Format: photograph → MusicXML');
		expect(t(formatLabelKey(direct, homr, 'pdf'), 'fr')).toBe('Format : PDF → MusicXML');
		expect(t(formatLabelKey(direct, homr, 'image'), 'fr')).toBe('Format : photographie → MusicXML');
	});
});

// The origin signal is the parser's, not a literal. The real parser is fed through the mini DOM, as
// `no-lyrics-notice.test.ts` does, because vitest has no `DOMParser`.
const musicxmlParser: ScoreParser = {
	canParse: () => true,
	parse: (input) => new MusicXmlScoreParser().parse({ ...input, data: parseXml(input.data as string) as unknown as Document }),
};
const deps = { scoreReader: { convert: async () => { throw new Error('not reached'); }, dispose: () => {} }, musicxmlParser } as unknown as IngestDeps;
const homrReading = readFileSync(new URL('../omr/fixtures/tch-1.musicxml', import.meta.url), 'utf8');

async function arrive(f: File) {
	const out = await ingestScoreFile(f, deps);
	if (!out.ok) throw new Error('ingest failed');
	return out.ingested;
}

describe('row 122: the parser’s own origin drives the key', () => {
	it('a homr reading of a PDF and of a photograph', async () => {
		const got = await arrive(readingFile(new File([''], 'song.pdf'), homrReading));
		expect(got.provenance.via).toBe('direct');
		const origin = got.result.score.source.origin;
		expect(origin).toBe('homr-musicxml-from-image');
		expect(formatLabelKey(got.provenance, origin, 'pdf')).toBe('upload.format.pdfReader');
		expect(formatLabelKey(got.provenance, origin, 'image')).toBe('upload.format.imageReader');
		expect(formatLabelKey(got.provenance, origin)).toBe('upload.format.musicxmlDirect');
	});
	it('the same notes from a plain MusicXML file keep the direct key, whatever kind is passed', async () => {
		const got = await arrive(new File([homrReading.replace('<software>homr</software>', '<software>MuseScore</software>')], 'song.musicxml'));
		const origin = got.result.score.source.origin;
		expect(origin).not.toBe('homr-musicxml-from-image');
		expect(formatLabelKey(got.provenance, origin, 'pdf')).toBe('upload.format.musicxmlDirect');
		expect(formatLabelKey(got.provenance, origin, 'image')).toBe('upload.format.musicxmlDirect');
	});
});
