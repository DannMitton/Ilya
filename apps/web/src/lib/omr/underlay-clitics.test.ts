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
		expect(out.counts).toMatchObject({ folded: 1, left: 0 });
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
		expect(out.counts).toMatchObject({ folded: 0, left: 0 });
	});

	it('leaves a proclitic with no host after it in the row as a unit of its own, and counts it', () => {
		const out = fold([tok('тебя', 100, 160), tok('в', 200, 210)], [null, 'proclitic']);
		expect(out.units.map((u) => u.text)).toEqual(['тебя', 'в']);
		expect(out.counts).toMatchObject({ folded: 0, left: 1 });
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

describe('foldClitics counts the clitic the print appears to give a note of its own (brief r5 step 7, count only)', () => {
	const NOTES = [100, 200, 300];
	const at = (text: string, centre: number, half = 10): Token => tok(text, centre - half, centre + half);
	/** Fold the row, with the free notes given, and say what was counted. */
	function count(tokens: Token[], calls: CliticCall[], free: number[] = NOTES) {
		const { units, origin } = cutUnits(tokens, (w) => [w]);
		return foldClitics(units, origin, rowWordSpans(tokens), calls, free);
	}

	it('counts «в» centred on a free note of its own, with its host on the next note, and still folds it (the desk\'s ruling: the clitic always joins its host)', () => {
		const out = count([at('в', 100), at('мир', 200)], ['proclitic', null]);
		expect(out.units.map((u) => u.text)).toEqual([`в${NBSP}мир`]);
		expect(out.counts.ownNote).toEqual([{ text: 'в', x: 100 }]);
	});

	it('does not count «В бью» printed as one group over one notehead: the clitic and its host nearest the same note', () => {
		const out = count([at('мир', 100), at('В', 185, 5), at('бью', 215, 5)], [null, 'proclitic', null]);
		expect(out.units.map((u) => u.text)).toEqual(['мир', `В${NBSP}бью`]);
		expect(out.counts.ownNote).toEqual([]);
	});

	it('does not count the clitic whose centre drifts onto the previous unit\'s note (the neighbour clause), and would if the clause were dropped (mutant)', () => {
		// «В» centred at 140: nearest note 100; «мир» centred at 120: also nearest 100; the host «бью» at 200 is nearest 200.
		const out = count([at('мир', 120), at('В', 140, 5), at('бью', 200)], [null, 'proclitic', null]);
		expect(out.units.map((u) => u.text)).toEqual(['мир', `В${NBSP}бью`]);
		expect(out.counts.ownNote).toEqual([]);
		// Without the neighbour, the same «В» is nearest note 100 and its host 200: counted.
		const alone = count([at('В', 140, 5), at('бью', 200)], ['proclitic', null]);
		expect(alone.counts.ownNote).toEqual([{ text: 'В', x: 140 }]);
	});

	it('counts an enclitic by the same rule, with the neighbour on its other side (after it)', () => {
		const own = count([at('друг', 100), at('ж', 200), at('мой', 300)], [null, 'enclitic', null]);
		expect(own.counts.ownNote).toEqual([{ text: 'ж', x: 200 }]);
		const drift = count([at('друг', 90), at('ж', 160, 5), at('мой', 200)], [null, 'enclitic', null]);
		// «ж» is nearest 200, as is «мой», its neighbour on the far side; its host «друг» is nearest 100.
		expect(drift.counts.ownNote).toEqual([]);
	});

	it('counts nothing where no free note is given', () => {
		expect(count([at('в', 100), at('мир', 200)], ['proclitic', null], []).counts.ownNote).toEqual([]);
	});
});
