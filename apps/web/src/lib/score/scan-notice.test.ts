/**
 * Which message a scan earns, and the words of it (brief r5 step 2): the two
 * wordless messages as ever, and the two ratified for a scan read in part, with
 * the unread bars said as Dann ratified them (EN and FR).
 */
import { describe, expect, it } from 'vitest';
import type { ParseWarning } from '@ilya/score-parser';
import { barsText, noticeText, scanNotice, type IngestProvenance } from './ingestion/ingest';

const direct: IngestProvenance = { format: 'musicxml', via: 'direct' };
const partly = (...bars: [number, number][]): ParseWarning => ({ code: 'words-partly-read', message: 'm', bars });
const noLyrics: ParseWarning = { code: 'no-lyrics-found', message: 'm' };

describe('barsText', () => {
	it('says one range and two ranges', () => {
		expect(barsText([[23, 30]], 'en')).toBe('23 to 30');
		expect(barsText([[23, 30], [41, 48]], 'en')).toBe('23 to 30 and 41 to 48');
		expect(barsText([[23, 30]], 'fr')).toBe('23 à 30');
		expect(barsText([[23, 30], [41, 48]], 'fr')).toBe('23 à 30 et 41 à 48');
	});
	it('says three ranges or more with commas and a final "and" (an Oxford comma), and in French with no comma before « et »', () => {
		expect(barsText([[4, 4], [9, 12], [39, 39]], 'en')).toBe('4, 9 to 12, and 39');
		expect(barsText([[4, 4], [9, 12], [39, 39]], 'fr')).toBe('4, 9 à 12 et 39');
		expect(barsText([[1, 2], [5, 6], [8, 9], [11, 12]], 'en')).toBe('1 to 2, 5 to 6, 8 to 9, and 11 to 12');
	});
	it('writes a range of one bar inside a list as the bar alone', () => {
		expect(barsText([[4, 4], [9, 12]], 'en')).toBe('4 and 9 to 12');
		expect(barsText([[4, 4], [9, 12]], 'fr')).toBe('4 et 9 à 12');
	});
});

describe('scanNotice', () => {
	it('is the wordless message of a scan or a file where the score has no words, naming the file', () => {
		expect(scanNotice([noLyrics], direct, 'homr-musicxml-from-image', 'a.pdf')).toEqual({ key: 'upload.banner.noLyricsScan', arg: 'a.pdf' });
		expect(scanNotice([noLyrics], direct, 'musicxml-direct', 'a.xml')).toEqual({ key: 'upload.banner.noLyrics', arg: 'a.xml' });
	});
	it('is none where the score has words and no unread bars', () => {
		expect(scanNotice([], direct, 'homr-musicxml-from-image', 'a.pdf')).toBeNull();
		expect(scanNotice([{ code: 'words-partly-read', message: 'm', bars: [] }], direct, 'homr-musicxml-from-image', 'a.pdf')).toBeNull();
	});
	it('is the ranges message for a scan read in part, and the single-bar message for one bar', () => {
		expect(scanNotice([partly([23, 30], [41, 48])], direct, 'homr-musicxml-from-image', 'a.pdf')).toEqual({ key: 'upload.banner.wordsPartlyRead', arg: '23-30,41-48' });
		expect(scanNotice([partly([39, 39])], direct, 'homr-musicxml-from-image', 'a.pdf')).toEqual({ key: 'upload.banner.wordsPartlyReadOne', arg: '39' });
		expect(scanNotice([partly([39, 40])], direct, 'homr-musicxml-from-image', 'a.pdf')?.key).toBe('upload.banner.wordsPartlyRead');
	});
	it('keeps the wordless message where a score has both, and changes no other banner', () => {
		expect(scanNotice([noLyrics, partly([1, 2])], direct, 'homr-musicxml-from-image', 'a.pdf')?.key).toBe('upload.banner.noLyricsScan');
	});
});

describe('noticeText', () => {
	it('fills the file into the wordless messages as ever', () => {
		expect(noticeText('upload.banner.noLyrics', 'en', 'a.xml')).toContain('This score has no words in it.');
	});
	it('fills the bars into the ratified messages, EN and FR', () => {
		expect(noticeText('upload.banner.wordsPartlyRead', 'en', '23-30,41-48')).toBe(
			'Ilya’s reading of printed words is still imperfect; it could not read the words in bars 23 to 30 and 41 to 48. Type the missing words into Lyrics exactly where they fall in the song. Check every word against your score.',
		);
		expect(noticeText('upload.banner.wordsPartlyRead', 'fr', '4,9-12,39')).toBe(
			'Ilya lit encore imparfaitement les paroles imprimées et n’a pas pu lire celles des mesures 4, 9 à 12 et 39. Saisissez les paroles manquantes dans Paroles, exactement à leur place dans le chant. Vérifiez chaque mot sur votre partition.',
		);
		expect(noticeText('upload.banner.wordsPartlyReadOne', 'en', '39')).toBe(
			'Ilya’s reading of printed words is still imperfect; it could not read the words in bar 39. Type the missing words into Lyrics exactly where they fall in the song. Check every word against your score.',
		);
		expect(noticeText('upload.banner.wordsPartlyReadOne', 'fr', '39')).toBe(
			'Ilya lit encore imparfaitement les paroles imprimées et n’a pas pu lire celles de la mesure 39. Saisissez les paroles manquantes dans Paroles, exactement à leur place dans le chant. Vérifiez chaque mot sur votre partition.',
		);
	});
});
