/**
 * The cycle dose as a sentence of the page's own (QUEUE row 60, ruling 4 of "THE
 * INSIGHTS PAGE, REARRANGED"). It was drawn under the figure; the words and the
 * arithmetic are the figure's, so these pin the words.
 */
import { describe, expect, it } from 'vitest';
import { cycleDoseSentence } from './cycle-dose';

describe('the cycle dose sentence', () => {
	it('says nothing without a dose', () => {
		expect(cycleDoseSentence(null, 'en')).toBeNull();
	});

	it('names a single figure, in English and in French', () => {
		const en = cycleDoseSentence({ kind: 'point', cycles: 12000 }, 'en')!;
		expect(en.startsWith('Cycle dose: about ')).toBe(true);
		expect(en.endsWith('(number of fold collisions in this piece)')).toBe(true);
		const fr = cycleDoseSentence({ kind: 'point', cycles: 12000 }, 'fr')!;
		expect(fr.startsWith('Dose de cycles : environ ')).toBe(true);
	});

	it('names a range as "{low} to {high}", from the same span words the table uses', () => {
		const en = cycleDoseSentence({ kind: 'range', low: 9800, high: 17000 }, 'en')!;
		expect(en).toBe('Cycle dose: about 9,800 to 17,000 (number of fold collisions in this piece)');
	});
});
