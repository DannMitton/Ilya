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
const file: SourceOrigin = 'musicxml-direct';

describe('row 95: which wordless message an arrival draws', () => {
	it('a MusicXML file with no lyrics draws 1a', () => {
		expect(noLyricsNoticeKey(direct, file)).toBe('upload.banner.noLyrics');
	});
	it('a compressed or converted file is still a file, not a picture', () => {
		expect(noLyricsNoticeKey({ format: 'musicxml', via: 'mxl' }, file)).toBe('upload.banner.noLyrics');
		expect(noLyricsNoticeKey({ format: 'mnx', via: 'direct' }, file)).toBe('upload.banner.noLyrics');
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
});

describe('row 95: the ratified strings, byte for byte', () => {
	// Row 125: the second sentence of 1a and 1b was re-ratified by Dann 2026-10-19 22:25.
	it('1a, upload.banner.noLyrics', () => {
		expect(t('upload.banner.noLyrics', 'en')).toBe(
			'This score has no words in it. The text you add in LYRICS goes under the notes, assigned one syllable per note. Click a note to move a syllable.'
		);
		expect(t('upload.banner.noLyrics', 'fr')).toBe(
			'Cette partition ne porte aucune parole. Le texte que vous ajoutez dans le champ PAROLES se place sous les notes, réparti à raison d’une syllabe par note. Cliquez sur une note pour déplacer une syllabe.'
		);
	});
	it('1b, upload.banner.noLyricsScan', () => {
		expect(t('upload.banner.noLyricsScan', 'en')).toBe(
			'Ilya could not read any words from this image. You can add lyrics through the LYRICS pane and seat them under the right notes using the Loupe’s SYLLABLES controls.'
		);
		expect(t('upload.banner.noLyricsScan', 'fr')).toBe(
			'Ilya n’a pu lire aucune parole dans cette image. Vous pouvez ajouter les paroles dans le champ PAROLES, puis les placer sous les bonnes notes à l’aide des commandes SYLLABES de la loupe.'
		);
	});
	it('row 125: neither wordless key claims text that nobody added, in either language', () => {
		for (const key of ['upload.banner.noLyrics', 'upload.banner.noLyricsScan'] as const) {
			expect(t(key, 'en')).not.toContain('The text you added');
			expect(t(key, 'fr')).not.toContain('avez ajouté');
		}
	});
	it('2, upload.banner.reader (replaced 2026-11-09: Ilya now reads printed words)', () => {
		expect(t('upload.banner.reader', 'en')).toBe(
			'This score is Ilya’s synthesis from an image (scan or photograph). The optical recognition of musical notes and printed text is imperfect, so you should check Ilya’s reading against your original source. You may rectify any errors through the Loupe’s CORRECTIONS pane.'
		);
		expect(t('upload.banner.reader', 'fr')).toBe(
			'Cette partition est la synthèse qu’Ilya a faite à partir d’une image (numérisation ou photographie). La reconnaissance optique des notes de musique et du texte imprimé est imparfaite; vérifiez donc la lecture d’Ilya sur votre source originale. Vous pouvez corriger toute erreur dans le volet CORRECTIONS de la loupe.'
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
