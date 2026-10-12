/**
 * Seen and summed (`metre-witness.ts`, wired in `join-pages.ts`): a time
 * signature the reader saw is stated where the bars it governs add up to it,
 * on hand-built pages of homr's output.
 */
import { describe, expect, it } from 'vitest';
import { joinPages } from './join-pages';
import { barFacts, barOfWindow, countable, labelOf, lengthOf, witness, type MetreSeen } from './metre-witness';

/** A quarter (or other value) at page place x, on a staff whose middle is at y 100. */
const note = (x: number, type = 'quarter', dur = 1) =>
	`<note><!-- imgpos: ${x}, 100 --><pitch><step>C</step><octave>5</octave></pitch><duration>${dur}</duration><voice>1</voice><type>${type}</type></note>`;
/** Bar k (0-based on its page) holding `beats` quarters, notes from x = 100k + 20. */
const bar = (k: number, beats: number, attrs = '') =>
	`<measure number="${k + 1}">${attrs ? `<attributes>${attrs}</attributes>` : ''}${Array.from({ length: beats }, (_, i) => note(100 * k + 20 + 15 * i)).join('')}</measure>`;
const page = (bars: string[]) =>
	`<score-partwise version="4.0"><part-list><score-part id="P1"><part-name>Voice</part-name></score-part></part-list><part id="P1">${bars.join('')}</part></score-partwise>`;
const homr44 = '<divisions>1</divisions><time><beats>4</beats><beat-type>4</beat-type></time>';
/** The reader's window at the start of bar k. */
const seen = (k: number, lab: string | null, courtesy = false): MetreSeen => ({ x0: 100 * k, top: 80, bottom: 120, space: 10, lab, why: null, courtesy, start: false });
const times = (xml: string) => [...xml.matchAll(/<measure number="(\d+)">(?:(?!<\/measure>)[\s\S])*?(<time[^>]*>[\s\S]*?<\/time>)/g)].map((m) => [Number(m[1]), labelOf(m[2])]);

describe('the bar rule and the sums', () => {
	it('counts quarters, leaves out a short first bar, and reads cut C as four quarters', () => {
		const bars = barFacts([bar(0, 1, '<divisions>1</divisions>'), bar(1, 3), bar(2, 3)]);
		expect(bars.map((b) => b.len.n / b.len.d)).toEqual([1, 3, 3]);
		expect(countable(bars, 0, lengthOf('3/4'))).toBe(false);
		expect(countable(bars, 1, lengthOf('3/4'))).toBe(true);
		expect(lengthOf('cut')).toEqual({ n: 4, d: 1 });
	});

	it('states a proposal only with two countable bars among the first four, all adding up', () => {
		const bars = barFacts([bar(0, 3, '<divisions>1</divisions>'), bar(1, 3), bar(2, 4), bar(3, 3)]);
		expect(witness(bars, [0, 1], '3/4', null, null).stated).toBe(true);
		expect(witness(bars, [0], '3/4', null, null).stated).toBe(false);
		expect(witness(bars, [0, 1, 2, 3], '3/4', null, null).why).toBe('bar 3 holds 4/1 quarters, not 3/1');
	});
});

describe('barOfWindow', () => {
	it('gives a system start the first bar on its staff, though homr placed that bar’s rest right of the next bar', () => {
		const rest = (x: number) => `<note><!-- imgpos: ${x}, 100 --><rest/><duration>4</duration><voice>1</voice><type>whole</type></note>`;
		const bars = [`<measure>${rest(300)}</measure>`, `<measure>${rest(150)}</measure>`, `<measure>${rest(260)}</measure>`];
		expect(barOfWindow(bars, { ...seen(0, '4/4'), start: true })).toBe(0);
		expect(barOfWindow(bars, { ...seen(0, '4/4'), start: false })).toBe(1);
	});
});

describe('joinPages with what the reader saw', () => {
	const fourBarsOfThree = page([bar(0, 3, homr44), bar(1, 3), bar(2, 3), bar(3, 3)]);

	it('states a signature seen and summed, in place of homr’s', () => {
		const log: string[] = [];
		const xml = joinPages([fourBarsOfThree], undefined, { pages: [[seen(0, '3/4')]], log });
		expect(times(xml)).toEqual([[1, '3/4']]);
		expect(log).toEqual(['bar 1 (page 1): 3/4 stated: 4 bars add up to 3/4']);
	});

	it('does not state a signature seen and not summed, and says so (bars made triplets only to fit it are not counted)', () => {
		const log: string[] = [];
		const xml = joinPages([fourBarsOfThree], undefined, { pages: [[seen(0, '2/4')]], log });
		expect(xml).toBe(joinPages([fourBarsOfThree]));
		expect(log[0]).toMatch(/2\/4 not stated: 0 countable bars before the next signature, not 2/);
	});

	it('changes nothing where bars add up to another metre and no signature is seen', () => {
		expect(joinPages([fourBarsOfThree], undefined, { pages: [[seen(0, null), seen(2, null)]] })).toBe(joinPages([fourBarsOfThree]));
	});

	it('writes C and cut C as their symbols', () => {
		const four = page([bar(0, 4, homr44), bar(1, 4), bar(2, 4)]);
		expect(joinPages([four], undefined, { pages: [[seen(0, 'C')]] })).toContain('<time symbol="common"><beats>4</beats><beat-type>4</beat-type></time>');
		expect(joinPages([four], undefined, { pages: [[seen(0, 'cut')]] })).toContain('<time symbol="cut"><beats>2</beats><beat-type>2</beat-type></time>');
	});

	it('states a one-bar change between printed signatures when its bar adds up (the desk’s exception)', () => {
		const p = page([bar(0, 4, homr44), bar(1, 4), bar(2, 2), bar(3, 4), bar(4, 4)]);
		const log: string[] = [];
		const xml = joinPages([p], undefined, { pages: [[seen(0, '4/4'), seen(2, '2/4'), seen(3, '4/4')]], log });
		expect(times(xml)).toEqual([[1, '4/4'], [3, '2/4'], [4, '4/4']]);
		expect(log[1]).toBe('bar 3 (page 1): 2/4 stated: one bar, between printed signatures, adds up to 2/4');
	});

	it('does not state a one-bar change that the next signature does not return from', () => {
		const p = page([bar(0, 4, homr44), bar(1, 4), bar(2, 2), bar(3, 3), bar(4, 3)]);
		const log: string[] = [];
		joinPages([p], undefined, { pages: [[seen(0, '4/4'), seen(2, '2/4'), seen(3, '3/4')]], log });
		expect(log[1]).toMatch(/2\/4 not stated: 1 countable bar before the next signature, not 2/);
	});

	it('states a change for the bars that add up to it, and gives homr’s metre back at a return the reader did not see', () => {
		// «Ночь» (Rimsky-Korsakov op. 8 no. 2): C, two bars of 3/2, then C again, and the reader saw the 3/2 alone
		const p = page([bar(0, 4, homr44), bar(1, 4), bar(2, 6), bar(3, 6), bar(4, 4), bar(5, 4)]);
		const log: string[] = [];
		const xml = joinPages([p], undefined, { pages: [[seen(2, '3/2')]], log });
		expect(times(xml)).toEqual([[1, '4/4'], [3, '3/2'], [5, '4/4']]);
		expect(xml).not.toContain('<time-modification>');
		expect(log[0]).toBe('bar 3 (page 1): 3/2 stated: 2 bars add up to 3/2; bar 5 holds 4/1 quarters, the metre before it: a return not seen');
		// one bar of the change is not enough, and a bar of another length is not a return
		const one = page([bar(0, 4, homr44), bar(1, 4), bar(2, 6), bar(3, 4), bar(4, 4)]);
		expect(joinPages([one], undefined, { pages: [[seen(2, '3/2')]] })).toBe(joinPages([one], undefined, { pages: [[]] }));
		const other = page([bar(0, 4, homr44), bar(1, 4), bar(2, 6), bar(3, 6), bar(4, 5), bar(5, 4)]);
		expect(times(joinPages([other], undefined, { pages: [[seen(2, '3/2')]] }))).not.toContainEqual([3, '3/2']);
	});

	it('sets a courtesy signature aside', () => {
		const log: string[] = [];
		const xml = joinPages([fourBarsOfThree], undefined, { pages: [[seen(3, '3/4', true)]], log });
		expect(xml).toBe(joinPages([fourBarsOfThree]));
		expect(log[0]).toMatch(/set aside as a courtesy signature/);
	});

	it('holds a stated signature until the next one: homr’s own change in between is left out', () => {
		const p = page([bar(0, 4, homr44), bar(1, 4), bar(2, 4, '<time><beats>2</beats><beat-type>2</beat-type></time>'), bar(3, 4)]);
		expect(times(joinPages([p]))).toEqual([[1, '4/4'], [3, '2/2']]);
		expect(times(joinPages([p], undefined, { pages: [[seen(0, 'C')]] }))).toEqual([[1, 'C']]);
	});

	it('gives homr’s metre back where the next signature seen is not stated', () => {
		const p = page([bar(0, 3, homr44), bar(1, 3), bar(2, 3), bar(3, 3)]);
		const xml = joinPages([p], undefined, { pages: [[seen(0, '3/4'), seen(2, '5/4')]] });
		expect(times(xml)).toEqual([[1, '3/4'], [3, '4/4']]);
	});

	it('runs the tuplet checks under the stated signature', () => {
		// homr's 4/4 and a bar of three halves: as 3/4 it is not a bar of triplets, as 4/4 it is (rule 1)
		const half = (x: number) => note(x, 'half', 2);
		const halves = (k: number, attrs = '') => `<measure number="${k + 1}">${attrs ? `<attributes>${attrs}</attributes>` : ''}${[0, 1, 2].map((i) => half(100 * k + 20 + 15 * i)).join('')}</measure>`;
		const p = page([halves(0, '<divisions>1</divisions><time><beats>2</beats><beat-type>2</beat-type></time>'), halves(1), halves(2)]);
		const plain = joinPages([p]);
		expect(plain).toContain('<time-modification>');
		const xml = joinPages([p], undefined, { pages: [[seen(0, '3/2')]] });
		expect(xml).not.toContain('<time-modification>');
		expect(times(xml)).toEqual([[1, '3/2']]);
	});
});
