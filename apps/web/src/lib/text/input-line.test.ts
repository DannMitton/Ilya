/**
 * Row 163 step 7 (review amendment 16): the line under Input's pair, and the words that were ratified.
 */
import { describe, expect, it } from 'vitest';
import { t } from '$lib/i18n';
import { introLine } from './input-line';

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
