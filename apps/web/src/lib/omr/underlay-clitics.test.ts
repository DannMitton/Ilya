/**
 * Folding the clitics the transcription knows (brief r5 step 4): a vowelless
 * proclitic rides in the first printed token of the next word that has a vowel,
 * an enclitic in the last of the word before it, with a no-break space; the
 * host's box stands.
 */
import { describe, expect, it } from 'vitest';
import { foldClitics, NBSP, type CliticCall } from './underlay-clitics';
import type { Token } from './underlay-seat';
import { rowWordSpans } from './underlay-tokens';
import { cutUnits } from './underlay-units';

const tok = (text: string, x0: number, x1: number): Token => ({ text, x0, x1 });
const noCut = (w: string) => [w];

/** Fold a row of tokens whose calls are `calls` by word. */
function fold(tokens: Token[], calls: CliticCall[], cut: (w: string) => string[] = noCut) {
	const { units, origin } = cutUnits(tokens, cut);
	const spans = rowWordSpans(tokens);
	return foldClitics(units, origin, spans, calls);
}

describe('foldClitics', () => {
	it('puts a proclitic in the first token of the next word, joined by U+00A0, and keeps the host\'s box (mutant: a proclitic left as its own unit)', () => {
		const out = fold([tok('в', 100, 120), tok('ти-', 150, 200), tok('ши', 210, 260)], ['proclitic', null]);
		expect(out.units).toEqual([tok(`в${NBSP}ти-`, 150, 200), tok('ши', 210, 260)]);
		expect(out.counts).toEqual({ folded: 1, left: 0 });
	});

	it('puts an enclitic in the last token of the word before it', () => {
		const out = fold([tok('друг', 100, 160), tok('ж', 170, 180), tok('мой', 200, 260)], [null, 'enclitic', null]);
		expect(out.units).toEqual([tok(`друг${NBSP}ж`, 100, 160), tok('мой', 200, 260)]);
	});

	it('puts the proclitic in the FIRST unit of a host the engine cut, and the enclitic in the LAST', () => {
		const cut = (w: string) => (w === 'тиши' ? ['ти', 'ши'] : [w]);
		const pro = fold([tok('в', 100, 120), tok('тиши', 150, 250)], ['proclitic', null], cut);
		expect(pro.units.map((u) => u.text)).toEqual([`в${NBSP}ти-`, 'ши']);
		const en = fold([tok('тиши', 100, 200), tok('ж', 210, 220)], [null, 'enclitic'], cut);
		expect(en.units.map((u) => u.text)).toEqual(['ти-', `ши${NBSP}ж`]);
	});

	it('builds a chain of proclitics from the inside', () => {
		const out = fold([tok('в', 100, 110), tok('с', 120, 130), tok('силах', 150, 250)], ['proclitic', 'proclitic', null]);
		expect(out.units.map((u) => u.text)).toEqual([`в${NBSP}с${NBSP}силах`]);
	});

	it('leaves a vowelless token the transcription does not call a clitic as a unit of its own (a misread letter), unlike buildSlotQueue', () => {
		const out = fold([tok('мой', 100, 150), tok('т', 160, 170), tok('друг', 200, 260)], [null, null, null]);
		expect(out.units.map((u) => u.text)).toEqual(['мой', 'т', 'друг']);
		expect(out.counts).toEqual({ folded: 0, left: 0 });
	});

	it('leaves a proclitic with no host after it in the row as a unit of its own, and counts it', () => {
		const out = fold([tok('тебя', 100, 160), tok('в', 200, 210)], [null, 'proclitic']);
		expect(out.units.map((u) => u.text)).toEqual(['тебя', 'в']);
		expect(out.counts).toEqual({ folded: 0, left: 1 });
	});

	it('leaves an enclitic with no host before it, and counts it', () => {
		const out = fold([tok('ж', 100, 110), tok('мой', 150, 200)], ['enclitic', null]);
		expect(out.units.map((u) => u.text)).toEqual(['ж', 'мой']);
		expect(out.counts.left).toBe(1);
	});

	it('does not fold a word that has a vowel, whatever the call', () => {
		const out = fold([tok('не', 100, 130), tok('силах', 150, 250)], ['proclitic', null]);
		expect(out.units.map((u) => u.text)).toEqual(['не', 'силах']);
	});

	it('counts ѣ, і, and ѵ as vowels, the set cutUnits uses', () => {
		const out = fold([tok('ѣ', 100, 120), tok('силах', 150, 250)], ['proclitic', null]);
		expect(out.units).toHaveLength(2);
	});
});
