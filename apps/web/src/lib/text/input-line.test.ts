/**
 * Row 163 step 7 (review amendment 16): the line under Input's pair, and the words that were ratified.
 */
import { describe, expect, it } from 'vitest';
import { t } from '$lib/i18n';
import { fillLibraryLine, introLine, libraryLineOf } from './input-line';

describe('introLine', () => {
	it('shows the replaced Poem line while Poem is the view, is empty, and Lyrics holds the score’s words', () => {
		expect(introLine('poem', null, true, '')).toBe('intake.view.landedLyrics');
		expect(introLine('poem', null, true, '  \n')).toBe('intake.view.landedLyrics');
		expect(introLine('poem', 'lyrics', true, '')).toBe('intake.view.landedLyrics');
	});
	it('never shows it under Lyrics, where “here” would be the wrong field, even just after a drop', () => {
		expect(introLine('lyrics', 'lyrics', true, '')).toBe('intake.view.lyricsLine');
		expect(introLine('lyrics', null, true, '')).toBe('intake.view.lyricsLine');
	});
	it('does not show it once Poem holds text, or where Lyrics is the singer’s own', () => {
		expect(introLine('poem', 'lyrics', true, 'Я на правду')).toBe('intake.view.poemLine');
		expect(introLine('poem', null, false, '')).toBe('intake.view.poemLine');
	});
	it('keeps the page-read-as-a-poem line in either view', () => {
		expect(introLine('poem', 'poem', false, 'x')).toBe('intake.view.landedPoem');
		expect(introLine('lyrics', 'poem', false, '')).toBe('intake.view.landedPoem');
	});
});

describe('the ratified words', () => {
	it('has the French apostrophe the file’s French writes', () => {
		expect(t('intake.view.landedLyrics', 'fr')).toContain('s’en écarte');
		expect(t('intake.view.landedLyrics', 'fr')).not.toContain("s'en");
	});
});

describe('introLine, with a library poem on the song (poem library, build 1; walk items 3 and 6)', () => {
	it('under POEM, names the source quietly once the card is kept, and as based-on once it is edited', () => {
		expect(introLine('poem', null, false, 'Дайте бокалы!', 'kept')).toBe('intake.view.libraryPoem');
		expect(introLine('poem', null, false, 'Дайте бокалы!', 'edited')).toBe('intake.view.libraryPoemEdited');
		expect(introLine('poem', null, true, 'Дайте бокалы!', 'kept')).toBe('intake.view.libraryPoem'); // a score's words in LYRICS do not hide it
	});
	it('under LYRICS, lyricsLine stands, whatever the source (review amendment 15)', () => {
		expect(introLine('lyrics', null, false, 'x', 'kept')).toBe('intake.view.lyricsLine');
		expect(introLine('lyrics', null, true, 'x', 'edited')).toBe('intake.view.lyricsLine');
	});
	it('falls back to poemLine where there is no library line: unanswered, her own poem, or an entry the library no longer has', () => {
		expect(introLine('poem', null, false, 'x', null)).toBe('intake.view.poemLine');
		expect(introLine('poem', null, false, 'x')).toBe('intake.view.poemLine');
	});
	it('still gives the Poem-empty line first where Poem is empty', () => {
		expect(introLine('poem', null, true, '', 'kept')).toBe('intake.view.landedLyrics');
	});
	it('libraryLineOf: only an answered source, found in the library, makes a line', () => {
		const source = { answered: true, edited: false };
		expect(libraryLineOf(source, true)).toBe('kept');
		expect(libraryLineOf({ answered: true, edited: true }, true)).toBe('edited');
		expect(libraryLineOf({ answered: false, edited: false }, true)).toBeNull(); // the card is up
		expect(libraryLineOf(source, false)).toBeNull(); // the library has no entry of the work
		expect(libraryLineOf(null, true)).toBeNull();
	});
});

describe('fillLibraryLine, and the two library lines as they read', () => {
	const naming = { author: 'Алексей Васильевич Кольцов', title: 'Весёлый час', site: 'Russian Wikisource' };
	it('fills the author, the title, and the site as the data prints them', () => {
		expect(fillLibraryLine(t('intake.view.libraryPoem', 'en'), naming)).toBe('Алексей Васильевич Кольцов, «Весёлый час», from Russian Wikisource.');
		expect(fillLibraryLine(t('intake.view.libraryPoemEdited', 'en'), naming)).toBe('Based on Алексей Васильевич Кольцов, «Весёлый час», from Russian Wikisource.');
		expect(fillLibraryLine(t('intake.view.libraryPoem', 'fr'), naming)).toBe('Алексей Васильевич Кольцов, «\u00a0Весёлый час\u00a0», tiré de Russian Wikisource.');
		expect(fillLibraryLine(t('intake.view.libraryPoemEdited', 'fr'), naming)).toBe('D’après Алексей Васильевич Кольцов, «\u00a0Весёлый час\u00a0», tiré de Russian Wikisource.');
	});
	it('leaves no placeholder behind, and does not read a `$` in the data as a pattern', () => {
		const out = fillLibraryLine('{author} {title} {site}', { author: "a$&b", title: "$1", site: "$'" });
		expect(out).toBe("a$&b $1 $'");
	});
});
