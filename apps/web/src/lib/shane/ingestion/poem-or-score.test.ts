/**
 * poem-or-score.test.ts — N.146. Every branch of the decision, including
 * "both fail", exercised without a PDF, a picture, or a page reader anywhere
 * nearby (the whole point of pulling the decision out as a pure function).
 *
 * N.146 step 2: `isKnownWord` here is a stub, not the real dictionary --
 * `ocr-guard.test.ts` is where the guard itself is tested against real
 * Russian and the walk's own garble. Every case below that reaches the OCR
 * branch uses ocr text the stub accepts (`ALWAYS_KNOWN`), except the guard
 * cases at the bottom, which use a stub that knows nothing at all
 * (`NEVER_KNOWN`) to stand in for a reading that is mostly not Russian words.
 */
import { describe, it, expect } from 'vitest';
import { decidePoemOrScore, type PoemOrScoreOutcome } from './poem-or-score';

const outcome = (over: Partial<PoemOrScoreOutcome>): PoemOrScoreOutcome => ({
	stavesFound: false,
	sungLineFound: null,
	textLayer: null,
	ocrText: '',
	...over
});

const ALWAYS_KNOWN = () => true;
const NEVER_KNOWN = () => false;

describe('N.146 decidePoemOrScore', () => {
	it('staves found and a sung line: the score, whatever else is on hand', () => {
		expect(
			decidePoemOrScore(
				outcome({ stavesFound: true, sungLineFound: true, textLayer: 'lines', ocrText: 'lines' }),
				ALWAYS_KNOWN
			)
		).toEqual({ kind: 'score' });
	});

	it('staves found, no sung line, a text layer on hand: falls through to the poem', () => {
		expect(
			decidePoemOrScore(outcome({ stavesFound: true, sungLineFound: false, textLayer: 'a poem' }), ALWAYS_KNOWN)
		).toEqual({ kind: 'poem', source: 'textLayer', text: 'a poem' });
	});

	it('staves found, no sung line, no text layer, OCR on hand: the poem, from OCR', () => {
		expect(
			decidePoemOrScore(
				outcome({ stavesFound: true, sungLineFound: false, textLayer: null, ocrText: 'слова' }),
				ALWAYS_KNOWN
			)
		).toEqual({ kind: 'poem', source: 'ocr', text: 'слова' });
	});

	it('staves found, no sung line, no text layer, no OCR: BOTH FAIL', () => {
		expect(
			decidePoemOrScore(outcome({ stavesFound: true, sungLineFound: false, textLayer: '', ocrText: '' }), ALWAYS_KNOWN)
		).toEqual({ kind: 'unreadable' });
	});

	it('no staves, a text layer on hand: the poem, from the text layer', () => {
		expect(decidePoemOrScore(outcome({ textLayer: 'a poem' }), ALWAYS_KNOWN)).toEqual({
			kind: 'poem',
			source: 'textLayer',
			text: 'a poem'
		});
	});

	it('no staves, an empty text layer, OCR on hand: falls through to OCR', () => {
		expect(decidePoemOrScore(outcome({ textLayer: '', ocrText: 'слова' }), ALWAYS_KNOWN)).toEqual({
			kind: 'poem',
			source: 'ocr',
			text: 'слова'
		});
	});

	it('no staves, no text layer (a picture), OCR on hand: the poem, from OCR', () => {
		expect(decidePoemOrScore(outcome({ textLayer: null, ocrText: 'слова' }), ALWAYS_KNOWN)).toEqual({
			kind: 'poem',
			source: 'ocr',
			text: 'слова'
		});
	});

	it('no staves, no text layer, OCR found nothing: BOTH FAIL', () => {
		expect(decidePoemOrScore(outcome({ textLayer: null, ocrText: '' }), ALWAYS_KNOWN)).toEqual({ kind: 'unreadable' });
	});

	it('no staves, a text layer of nothing but whitespace: not a real answer, falls through', () => {
		expect(decidePoemOrScore(outcome({ textLayer: '   \n  ', ocrText: 'слова' }), ALWAYS_KNOWN)).toEqual({
			kind: 'poem',
			source: 'ocr',
			text: 'слова'
		});
	});

	it('no staves, whitespace-only OCR too: BOTH FAIL', () => {
		expect(decidePoemOrScore(outcome({ textLayer: '  ', ocrText: '  \n ' }), ALWAYS_KNOWN)).toEqual({
			kind: 'unreadable'
		});
	});

	it('staves found but sungLineFound not yet known (null): treated as not found', () => {
		expect(
			decidePoemOrScore(
				outcome({ stavesFound: true, sungLineFound: null, textLayer: null, ocrText: 'слова' }),
				ALWAYS_KNOWN
			)
		).toEqual({ kind: 'poem', source: 'ocr', text: 'слова' });
	});

	// N.146 step 2: the guard, wired in.

	it('a text layer is NEVER guarded: an unknown-word stub does not touch it', () => {
		expect(decidePoemOrScore(outcome({ textLayer: 'a poem' }), NEVER_KNOWN)).toEqual({
			kind: 'poem',
			source: 'textLayer',
			text: 'a poem'
		});
	});

	it('an OCR reading the guard refuses: unreadable, not a poem, even with OCR text on hand', () => {
		expect(decidePoemOrScore(outcome({ textLayer: null, ocrText: 'три слова тут' }), NEVER_KNOWN)).toEqual({
			kind: 'unreadable'
		});
	});

	it('an OCR reading the guard passes: the poem, from OCR, same as ever', () => {
		expect(decidePoemOrScore(outcome({ textLayer: null, ocrText: 'три слова тут' }), ALWAYS_KNOWN)).toEqual({
			kind: 'poem',
			source: 'ocr',
			text: 'три слова тут'
		});
	});
});
