import { describe, expect, it } from 'vitest';
import { t } from '$lib/i18n';
import { noLyricsNoticeKey, type IngestProvenance } from './ingestion/ingest';

// QUEUE row 95. The strings are ratified by Dann (2026-10-14 16:36 to 16:37).
// French apostrophes are typographic (U+2019), as every French value in
// i18n.ts writes them.

const direct: IngestProvenance = { format: 'musicxml', via: 'direct' };
const scan: IngestProvenance = { format: 'musicxml', via: 'reader', sourceFormat: 'image' };
const pdf: IngestProvenance = { format: 'musicxml', via: 'reader', sourceFormat: 'pdf' };

describe('row 95: which wordless message an arrival draws', () => {
	it('a MusicXML file with no lyrics draws 1a', () => {
		expect(noLyricsNoticeKey(direct)).toBe('upload.banner.noLyrics');
	});
	it('a compressed or converted file is still a file, not a picture', () => {
		expect(noLyricsNoticeKey({ format: 'musicxml', via: 'mxl' })).toBe('upload.banner.noLyrics');
		expect(noLyricsNoticeKey({ format: 'mnx', via: 'direct' })).toBe('upload.banner.noLyrics');
	});
	it('a photograph draws 1b', () => {
		expect(noLyricsNoticeKey(scan)).toBe('upload.banner.noLyricsScan');
	});
	it('a scanned PDF draws 1b', () => {
		expect(noLyricsNoticeKey(pdf)).toBe('upload.banner.noLyricsScan');
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
