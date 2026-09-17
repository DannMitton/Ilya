/**
 * ocr-guard.test.ts — N.146 step 2. `unknownWordShare` and
 * `passesRussianGuard`, tested with small hand-built `isKnownWord` stubs for
 * the pure branch logic, and with the walk's own two OCR readings for the
 * real cases the guard exists for.
 *
 * The walk fixtures under `__fixtures__/` are the ACTUAL `tesseract.js`
 * output this session captured from `walk-n146-poem-scan.pdf` and
 * `walk-n146-poem-photo.jpg` (memo's step 0), not retyped by hand.
 * `walk-lookup.json` is every one of those readings' own tokens' REAL
 * verdict from `GraysonEngine.lookupStress` against Ilya's live dictionary,
 * generated once by a throwaway script and frozen here so this test needs
 * neither the 90MB dictionary nor a live lookup to stay honest about what
 * the real dictionary said.
 */
import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { unknownWordShare, passesRussianGuard, dictionaryGuardMode, isKnownWordForGuard } from './ocr-guard';
import walkLookup from './__fixtures__/walk-lookup.json';

const scanOcr = readFileSync(new URL('./__fixtures__/walk-scan-ocr.txt', import.meta.url), 'utf8');
const photoOcr = readFileSync(new URL('./__fixtures__/walk-photo-ocr.txt', import.meta.url), 'utf8');

const isKnownFromWalk = (token: string): boolean => (walkLookup as Record<string, boolean>)[token.toLowerCase()] === true;

describe('N.146 step 2 unknownWordShare', () => {
	it('every token known: 0', () => {
		expect(unknownWordShare('раз два три', () => true)).toBe(0);
	});

	it('every token unknown: 1', () => {
		expect(unknownWordShare('абв where where', () => false)).toBe(1);
	});

	it('short tokens (under 3 letters) count for nothing, in either direction', () => {
		// "аб" (2) is excluded; only "три" (3) and "слова" (5) are counted, both known.
		expect(unknownWordShare('аб три слова', () => true)).toBe(0);
	});

	it('no token reaches 3 letters: null, not zero and not one', () => {
		expect(unknownWordShare('аб вг де', () => false)).toBeNull();
	});

	it('punctuation and Latin/digit noise are not word tokens at all', () => {
		expect(unknownWordShare('... 123 !!! abc', () => false)).toBeNull();
	});

	it('the walk\'s clean scan: 0 unknown, matching the memo\'s step 0 table', () => {
		expect(unknownWordShare(scanOcr, isKnownFromWalk)).toBe(0);
	});

	it('the walk\'s own garble: mostly unknown, matching the memo\'s step 0 table', () => {
		const share = unknownWordShare(photoOcr, isKnownFromWalk);
		expect(share).not.toBeNull();
		expect(share as number).toBeGreaterThan(0.5);
	});
});

describe('N.146 step 2 passesRussianGuard', () => {
	it('a clean Russian reading passes', () => {
		expect(passesRussianGuard('я вас любил безмолвно безнадежно', () => true)).toBe(true);
	});

	it('the walk\'s clean scan passes, the real dictionary\'s own verdict', () => {
		expect(passesRussianGuard(scanOcr, isKnownFromWalk)).toBe(true);
	});

	it('the walk\'s own garble fails, the real dictionary\'s own verdict', () => {
		expect(passesRussianGuard(photoOcr, isKnownFromWalk)).toBe(false);
	});

	it('exactly half known, half not: passes -- "mostly" is not met at a tie', () => {
		// 2 long tokens, one known, one not: share is exactly 0.5.
		expect(passesRussianGuard('слово абвгд', (t) => t === 'слово')).toBe(true);
	});

	it('one token past half unknown: fails', () => {
		// 3 long tokens, 2 unknown: share is 2/3, past the cutoff.
		expect(passesRussianGuard('слово абвгд ежзик', (t) => t === 'слово')).toBe(false);
	});

	it('an empty reading has nothing to guard: false, but decidePoemOrScore never asks', () => {
		expect(passesRussianGuard('', () => true)).toBe(false);
	});

	it('non-empty text with no checkable token at all: refused, not passed by default', () => {
		expect(passesRussianGuard('аб вг де', () => false)).toBe(false);
	});
});

describe('N.146 step 2b dictionaryGuardMode', () => {
	it('still loading: wait', () => {
		expect(dictionaryGuardMode({ isLoading: true, error: null, entryCount: 0 })).toBe('wait');
	});

	it('still loading, even with a stale entryCount from a previous load: wait', () => {
		expect(dictionaryGuardMode({ isLoading: true, error: null, entryCount: 943106 })).toBe('wait');
	});

	it('loaded, at least one entry: judge', () => {
		expect(dictionaryGuardMode({ isLoading: false, error: null, entryCount: 943106 })).toBe('judge');
	});

	it('finished, failed outright: skip', () => {
		expect(dictionaryGuardMode({ isLoading: false, error: 'network error', entryCount: 0 })).toBe('skip');
	});

	it('finished, no error, but somehow zero entries (not a real state today): wait, the safe default', () => {
		expect(dictionaryGuardMode({ isLoading: false, error: null, entryCount: 0 })).toBe('wait');
	});
});

describe('N.146 step 2b isKnownWordForGuard', () => {
	const NEVER_KNOWN = () => false;

	it('judge: the real predicate, unchanged', () => {
		expect(isKnownWordForGuard('judge', () => true)('анытокен')).toBe(true);
		expect(isKnownWordForGuard('judge', () => false)('анытокен')).toBe(false);
	});

	it('skip: always known, regardless of the real predicate', () => {
		expect(isKnownWordForGuard('skip', NEVER_KNOWN)('абвгд')).toBe(true);
	});

	it('wait: also always known -- the pure safety net, not the real mechanism', () => {
		expect(isKnownWordForGuard('wait', NEVER_KNOWN)('абвгд')).toBe(true);
	});

	it("a 'not ready' dictionary never produces unreadable via the guard, for ANY OCR text, pure and callerless", () => {
		// The walk's own garble -- the worst case the guard exists for -- fed
		// through 'skip' and 'wait' both still passes: neither a failed load
		// nor a load in progress can make the guard itself refuse a reading.
		expect(passesRussianGuard(photoOcr, isKnownWordForGuard('skip', NEVER_KNOWN))).toBe(true);
		expect(passesRussianGuard(photoOcr, isKnownWordForGuard('wait', NEVER_KNOWN))).toBe(true);
	});
});
