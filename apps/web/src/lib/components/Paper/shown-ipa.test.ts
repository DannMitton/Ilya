/**
 * N.201 step 4: the IPA the closed ANALYSIS line draws is the IPA the stack
 * draws. The cases are the four WordStack rules (its own header comment),
 * with the notation preferences all off so `applyNotationPreferences` leaves
 * the engine's string as it is.
 */
import { describe, it, expect } from 'vitest';
import type { NotationPreferences } from '@ilya/phonology';
import type { WordStackData } from '$lib/types';
import { adjacentCliticReconFlags, displayedWords, shownIpa, shownIpaAt } from './shown-ipa';

const prefs = (reconstitution: boolean): NotationPreferences =>
	({ reducedVowel: false, geminate: false, shcha: false, palatalNasal: false, reconstitution }) as NotationPreferences;

function w(over: Partial<WordStackData>): WordStackData {
	return {
		cyrillic: 'слово', cleanWord: 'слово', ipaDisplay: 'plain', ipaReconstituted: 'recon', ipaContent: 'demerged',
		ipaOwnReconstituted: 'own', isProclitic: false, isEnclitic: false, lineIndex: 0, wordIndex: 0, ...over,
	} as WordStackData;
}

describe('shownIpa', () => {
	it('shows a normal word plain, or reconstituted when reconstitution is active', () => {
		expect(shownIpa(w({}), prefs(false), false, false)).toBe('plain');
		expect(shownIpa(w({}), prefs(true), false, false)).toBe('recon');
		expect(shownIpa(w({}), prefs(false), true, false)).toBe('recon');
		expect(shownIpa(w({}), prefs(true), true, false)).toBe('plain');
	});
	it('shows a clitic as the pipeline arrow, or its own reconstitution', () => {
		const c = w({ isProclitic: true, ipaDisplay: '→' });
		expect(shownIpa(c, prefs(false), false, false)).toBe('→');
		expect(shownIpa(c, prefs(true), false, false)).toBe('own');
	});
	it('shows a host beside a reconstituted clitic demerged', () => {
		expect(shownIpa(w({}), prefs(false), false, true)).toBe('demerged');
	});
	it('shows nothing where the engine gave nothing', () => {
		expect(shownIpa(w({ ipaDisplay: '' }), prefs(false), false, false)).toBe('');
	});
});

describe('adjacentCliticReconFlags and shownIpaAt', () => {
	const line = {
		words: [
			w({ wordIndex: 0, isProclitic: true, ipaDisplay: '→' }),
			w({ wordIndex: 1 }),
			w({ wordIndex: 2, cyrillic: '—' }),
		],
	};
	it('flags a host whose proclitic is reconstituted, and not the clitic itself', () => {
		const spot = new Map([['0-0', true]]);
		expect(adjacentCliticReconFlags(displayedWords(line.words), prefs(false), spot)).toEqual([false, true]);
	});
	it('finds the word the singer tapped and draws its stack IPA', () => {
		expect(shownIpaAt([line], 0, 1, prefs(false), undefined)).toBe('plain');
		expect(shownIpaAt([line], 0, 1, prefs(false), new Map([['0-0', true]]))).toBe('demerged');
	});
	it('answers null for a word the page does not draw', () => {
		expect(shownIpaAt([line], 0, 2, prefs(false), undefined)).toBeNull();
		expect(shownIpaAt([line], 3, 0, prefs(false), undefined)).toBeNull();
	});
});
