import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser, type ScoreParser, type SourceOrigin } from '@ilya/score-parser';
import { t } from '$lib/i18n';
import { readingFile } from '$lib/omr/scan';
import { parseXml } from './ingestion/mini-dom';
import { ingestScoreFile, noLyricsNoticeKey, type IngestDeps, type IngestProvenance } from './ingestion/ingest';

// QUEUE row 95. The strings are ratified by Dann (2026-10-14 16:36 to 16:37).
// French apostrophes are typographic (U+2019), as every French value in
// i18n.ts writes them.

const direct: IngestProvenance = { format: 'musicxml', via: 'direct' };
const scan: IngestProvenance = { format: 'musicxml', via: 'reader', sourceFormat: 'image' };
const pdf: IngestProvenance = { format: 'musicxml', via: 'reader', sourceFormat: 'pdf' };
const file: SourceOrigin = 'musicxml-direct';

describe('row 95: which wordless message an arrival draws', () => {
	it('a MusicXML file with no lyrics draws 1a', () => {
		expect(noLyricsNoticeKey(direct, file)).toBe('upload.banner.noLyrics');
	});
	it('a compressed or converted file is still a file, not a picture', () => {
		expect(noLyricsNoticeKey({ format: 'musicxml', via: 'mxl' }, file)).toBe('upload.banner.noLyrics');
		expect(noLyricsNoticeKey({ format: 'mnx', via: 'direct' }, file)).toBe('upload.banner.noLyrics');
	});
	it('a photograph draws 1b', () => {
		expect(noLyricsNoticeKey(scan, file)).toBe('upload.banner.noLyricsScan');
	});
	it('a scanned PDF draws 1b', () => {
		expect(noLyricsNoticeKey(pdf, file)).toBe('upload.banner.noLyricsScan');
	});
});

// Row 121. The singer's scan route hands its reading back as a `.musicxml` file, which ingests as
// `via: 'direct'`; the score's own origin is what says it is a scan. The real parser is fed through the
// mini DOM, as `diction-fold-live.test.ts` does, because vitest has no `DOMParser`.
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

describe('row 121: a scan the singer drops is known as a scan by its origin', () => {
	it('a homr reading, handed back as a .musicxml file (via direct), draws 1b', async () => {
		const got = await arrive(readingFile(new File([''], 'song.pdf'), homrReading));
		expect(got.provenance.via).toBe('direct');
		expect(got.result.score.source.origin).toBe('homr-musicxml-from-image');
		expect(noLyricsNoticeKey(got.provenance, got.result.score.source.origin)).toBe('upload.banner.noLyricsScan');
	});
	it('the same notes from a plain MusicXML file draw 1a', async () => {
		const got = await arrive(new File([homrReading.replace('<software>homr</software>', '<software>MuseScore</software>')], 'song.musicxml'));
		expect(got.result.score.source.origin).not.toBe('homr-musicxml-from-image');
		expect(noLyricsNoticeKey(got.provenance, got.result.score.source.origin)).toBe('upload.banner.noLyrics');
	});
	it('the E.16 reader (via reader) still draws 1b whatever the origin', () => {
		expect(noLyricsNoticeKey(scan, 'musicxml-direct')).toBe('upload.banner.noLyricsScan');
	});
});

describe('row 95: the ratified strings, byte for byte', () => {
	it('1a, upload.banner.noLyrics', () => {
		expect(t('upload.banner.noLyrics', 'en')).toBe(
			'This score has no words in it. The text you added is under the notes, assigned one syllable per note. Click a note to move a syllable.'
		);
		expect(t('upload.banner.noLyrics', 'fr')).toBe(
			'Cette partition ne porte aucune parole. Le texte que vous avez ajouté se trouve sous les notes, réparti à raison d’une syllabe par note. Cliquez sur une note pour déplacer une syllabe.'
		);
	});
	it('1b, upload.banner.noLyricsScan', () => {
		expect(t('upload.banner.noLyricsScan', 'en')).toBe(
			'Ilya does not read the words printed in an image. The text you added is under the notes, assigned one syllable per note. Click a note to move a syllable.'
		);
		expect(t('upload.banner.noLyricsScan', 'fr')).toBe(
			'Ilya ne lit pas les paroles imprimées dans une image. Le texte que vous avez ajouté se trouve sous les notes, réparti à raison d’une syllabe par note. Cliquez sur une note pour déplacer une syllabe.'
		);
	});
	it('2, the last sentence of upload.banner.reader', () => {
		expect(t('upload.banner.reader', 'en')).toBe(
			'Read from a picture. Ilya worked the notes out from the ink, so check them against your own paper before you trust them. Ilya does not read the words printed in an image; type them into the Input field.'
		);
		expect(t('upload.banner.reader', 'fr')).toBe(
			'Lu à partir d’une image. Ilya a déduit les notes de l’encre, alors vérifiez-les sur votre propre partition avant de vous y fier. Ilya ne lit pas les paroles imprimées dans une image; saisissez-les dans le champ Entrée.'
		);
	});
	it('the two false sentences are gone, in both languages', () => {
		for (const key of ['upload.banner.reader', 'upload.banner.noLyrics', 'upload.banner.noLyricsScan'] as const) {
			for (const lang of ['en', 'fr'] as const) {
				const s = t(key, lang);
				expect(s).not.toContain('not in a picture');
				expect(s).not.toContain('ne sont pas dans une image');
			}
		}
	});
	it('neither wordless string has a %s slot, so the call site replace is harmless', () => {
		for (const key of ['upload.banner.noLyrics', 'upload.banner.noLyricsScan'] as const) {
			expect(t(key, 'en')).not.toContain('%s');
			expect(t(key, 'fr')).not.toContain('%s');
		}
	});
});
