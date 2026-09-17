/**
 * poem-or-score.test.ts — N.146. Every branch of the decision, including
 * "both fail", exercised without a PDF, a picture, or a page reader anywhere
 * nearby (the whole point of pulling the decision out as a pure function).
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

describe('N.146 decidePoemOrScore', () => {
	it('staves found and a sung line: the score, whatever else is on hand', () => {
		expect(
			decidePoemOrScore(outcome({ stavesFound: true, sungLineFound: true, textLayer: 'lines', ocrText: 'lines' }))
		).toEqual({ kind: 'score' });
	});

	it('staves found, no sung line, a text layer on hand: falls through to the poem', () => {
		expect(
			decidePoemOrScore(outcome({ stavesFound: true, sungLineFound: false, textLayer: 'a poem' }))
		).toEqual({ kind: 'poem', source: 'textLayer', text: 'a poem' });
	});

	it('staves found, no sung line, no text layer, OCR on hand: the poem, from OCR', () => {
		expect(
			decidePoemOrScore(outcome({ stavesFound: true, sungLineFound: false, textLayer: null, ocrText: 'ocr text' }))
		).toEqual({ kind: 'poem', source: 'ocr', text: 'ocr text' });
	});

	it('staves found, no sung line, no text layer, no OCR: BOTH FAIL', () => {
		expect(
			decidePoemOrScore(outcome({ stavesFound: true, sungLineFound: false, textLayer: '', ocrText: '' }))
		).toEqual({ kind: 'unreadable' });
	});

	it('no staves, a text layer on hand: the poem, from the text layer', () => {
		expect(decidePoemOrScore(outcome({ textLayer: 'a poem' }))).toEqual({
			kind: 'poem',
			source: 'textLayer',
			text: 'a poem'
		});
	});

	it('no staves, an empty text layer, OCR on hand: falls through to OCR', () => {
		expect(decidePoemOrScore(outcome({ textLayer: '', ocrText: 'ocr text' }))).toEqual({
			kind: 'poem',
			source: 'ocr',
			text: 'ocr text'
		});
	});

	it('no staves, no text layer (a picture), OCR on hand: the poem, from OCR', () => {
		expect(decidePoemOrScore(outcome({ textLayer: null, ocrText: 'ocr text' }))).toEqual({
			kind: 'poem',
			source: 'ocr',
			text: 'ocr text'
		});
	});

	it('no staves, no text layer, OCR found nothing: BOTH FAIL', () => {
		expect(decidePoemOrScore(outcome({ textLayer: null, ocrText: '' }))).toEqual({ kind: 'unreadable' });
	});

	it('no staves, a text layer of nothing but whitespace: not a real answer, falls through', () => {
		expect(decidePoemOrScore(outcome({ textLayer: '   \n  ', ocrText: 'ocr text' }))).toEqual({
			kind: 'poem',
			source: 'ocr',
			text: 'ocr text'
		});
	});

	it('no staves, whitespace-only OCR too: BOTH FAIL', () => {
		expect(decidePoemOrScore(outcome({ textLayer: '  ', ocrText: '  \n ' }))).toEqual({ kind: 'unreadable' });
	});

	it('staves found but sungLineFound not yet known (null): treated as not found', () => {
		expect(
			decidePoemOrScore(outcome({ stavesFound: true, sungLineFound: null, textLayer: null, ocrText: 'text' }))
		).toEqual({ kind: 'poem', source: 'ocr', text: 'text' });
	});
});
