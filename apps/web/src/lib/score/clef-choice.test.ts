import { describe, expect, it } from 'vitest';
import type { ParsedScore, Pitch } from '@ilya/score-parser';
import { clefChoiceOf, clefOptions, readingClef, readingOf, type ClefChoice } from './clef-choice';
import { ClefUi } from './clef-ui.svelte';

// QUEUE row 127. A minimal score: only the clef list, the vocal line, and the source are read.
const P = (step: Pitch['step'], octave: number): Pitch => ({ step, octave, alter: 0 });
const line = (pitches: Pitch[]) => pitches.map((pitch, i) => ({ id: `n${i}`, type: 'note' as const, measureIndex: 0, pitch }));
const score = (clef: { sign: 'G' | 'F'; line: number; octaveChange?: number } | undefined, pitches: Pitch[], format: 'musicxml' | 'mnx' = 'musicxml'): ParsedScore =>
	({
		source: { format, origin: format === 'musicxml' ? 'musicxml-direct' : 'mnx-direct' },
		clefs: clef ? [{ measureIndex: 0, clef }] : [],
		vocalLine: line(pitches),
	}) as unknown as ParsedScore;

const TREBLE = { sign: 'G' as const, line: 2 };
const TREBLE_8VB = { sign: 'G' as const, line: 2, octaveChange: -1 };
const BASS = { sign: 'F' as const, line: 4 };
/** Song 2 of row 114, in shape: printed in treble, C4 to A5. */
const SONG = [P('C', 4), P('E', 4), P('G', 4), P('C', 5), P('E', 5), P('A', 5)];
const LOW_SONG = [P('G', 2), P('C', 3), P('E', 3)];
const BASS_RANGE = { lowest: P('E', 2), highest: P('E', 4) };
const HIGH_RANGE = { lowest: P('C', 4), highest: P('C', 6) };

const song = (clef: typeof TREBLE | typeof TREBLE_8VB | typeof BASS | undefined, pitches = SONG) => score(clef, pitches);

describe('row 144: every cell of the clef table', () => {
	// The desk's table: what each choice draws on each printed clef, range or no range.
	const TABLE: Array<[string, typeof TREBLE, Array<[ClefChoice, number, string]>]> = [
		['treble', TREBLE, [['as-written', 0, 'treble'], ['ottava', -1, 'treble-8vb'], ['bass', -1, 'bass']]],
		['treble-8vb', TREBLE_8VB, [['as-written', 0, 'treble-8vb'], ['ottava', 0, 'treble-8vb'], ['bass', 0, 'bass']]],
		['bass', BASS as never, [['as-written', 0, 'bass'], ['ottava', 0, 'treble-8vb'], ['bass', 0, 'bass']]],
	];
	const RANGES = [['a low range', BASS_RANGE], ['a high range', HIGH_RANGE], ['no range', undefined]] as const;
	for (const [name, clef, cells] of TABLE) {
		for (const [rangeName, range] of RANGES) {
			for (const [choice, shift, drawn] of cells) {
				it(`printed ${name}, ${rangeName}, ${choice}: ${drawn}, shift ${shift}`, () => {
					const r = readingClef(song(clef, SONG), range, readingOf(choice));
					expect(r).toMatchObject({ shift, clef: drawn, shown: true });
				});
			}
		}
	}

	it('for your range, today’s rule: a printed-treble line read lower is treble with an 8 below, shift -1', () => {
		expect(readingClef(song(TREBLE), BASS_RANGE, null)).toEqual({ shift: -1, suggestedShift: -1, clef: 'treble-8vb', shown: true });
	});
	it('for your range, a printed-treble line that fits as printed keeps shift 0 and the renderer’s own clef rule', () => {
		expect(readingClef(song(TREBLE, [P('E', 3), P('G', 3), P('C', 4)]), BASS_RANGE, null)).toEqual({ shift: 0, suggestedShift: 0, clef: null, shown: true });
	});
	it('for your range, a line asked to read higher takes the shift and the renderer’s own clef rule', () => {
		expect(readingClef(song(BASS as never, LOW_SONG), HIGH_RANGE, null)).toMatchObject({ shift: 1, suggestedShift: 1, clef: null });
		expect(readingClef(song(TREBLE_8VB, [P('A', 2), P('E', 3), P('E', 4)]), BASS_RANGE, null)).toEqual({ shift: 0, suggestedShift: 0, clef: null, shown: true });
	});
	it('an unnamed source clef has only as written and the range’s own rule', () => {
		const c = { sign: 'C' as const, line: 3 };
		expect(readingClef(score(c as never, SONG), BASS_RANGE, 'ottava').clef).toBeNull();
		expect(readingClef(score(c as never, SONG), BASS_RANGE, 'as-written')).toMatchObject({ shift: 0, clef: null });
		expect(clefOptions(score(c as never, SONG), BASS_RANGE, null).options).toContain('as-written');
	});
	it('no score draws nothing special, and an empty voice line shows nothing', () => {
		expect(readingClef(null, BASS_RANGE, null)).toEqual({ shift: 0, suggestedShift: 0, clef: null, shown: false });
		expect(readingClef(song(TREBLE, []), BASS_RANGE, null).shown).toBe(false);
	});
	it('an old stored value reads as before: bass and as written on a printed-treble line', () => {
		expect(readingClef(song(TREBLE), BASS_RANGE, 'bass')).toMatchObject({ shift: -1, clef: 'bass' });
		expect(readingClef(song(TREBLE), BASS_RANGE, 'as-written')).toMatchObject({ shift: 0, clef: 'treble' });
	});
	it('the choice and the stored value convert both ways', () => {
		for (const stored of [null, 'bass', 'as-written', 'ottava'] as const) expect(readingOf(clefChoiceOf(stored))).toBe(stored);
		expect([clefChoiceOf(null), clefChoiceOf('ottava'), clefChoiceOf('bass'), clefChoiceOf('as-written')]).toEqual(['range', 'ottava', 'bass', 'as-written']);
	});
});

describe('row 144: the choices each printed clef is offered', () => {
	it('treble: three distinct drawings, and "for your range" only once something is chosen', () => {
		expect(clefOptions(song(TREBLE), BASS_RANGE, null)).toEqual({ options: ['ottava', 'bass', 'as-written'], current: 'ottava' });
		expect(clefOptions(song(TREBLE), BASS_RANGE, 'bass')).toEqual({ options: ['range', 'ottava', 'bass', 'as-written'], current: 'bass' });
	});
	it('treble with an 8 below: "as written" and "treble with an 8 below" draw the same, so one is offered', () => {
		expect(clefOptions(song(TREBLE_8VB), BASS_RANGE, null).options).toEqual(['bass', 'as-written']);
		expect(clefOptions(song(TREBLE_8VB), BASS_RANGE, 'ottava')).toEqual({ options: ['range', 'bass', 'as-written'], current: 'as-written' });
	});
	it('bass: "bass" and "as written" draw the same, so one is offered', () => {
		expect(clefOptions(song(BASS as never, LOW_SONG), BASS_RANGE, null).options).toEqual(['ottava', 'as-written']);
		expect(clefOptions(song(BASS as never, LOW_SONG), BASS_RANGE, 'bass')).toEqual({ options: ['range', 'ottava', 'as-written'], current: 'as-written' });
	});
	it('a line asked to read higher matches no explicit choice, so "for your range" is offered as what is in force', () => {
		const o = clefOptions(song(BASS as never, LOW_SONG), HIGH_RANGE, null);
		expect(o.current).toBe('range');
		expect(o.options[0]).toBe('range');
	});
	it('the option in force is always one of the options', () => {
		for (const clef of [TREBLE, TREBLE_8VB, BASS]) {
			for (const range of [BASS_RANGE, HIGH_RANGE, undefined]) {
				for (const stored of [null, 'bass', 'as-written', 'ottava'] as const) {
					const o = clefOptions(song(clef as never), range, stored);
					expect(o.options, `${clef.sign} ${stored}`).toContain(o.current);
				}
			}
		}
	});
});

describe('row 144: one state, every door', () => {
	const make = (octaveReading: 'as-written' | 'bass' | 'ottava' | null, clefChipShown = false) => {
		const record = { octaveReading, clefChipShown };
		const ui = new ClefUi();
		ui.bind(() => record, () => song(TREBLE), () => BASS_RANGE);
		return { record, ui };
	};
	it('the octave line’s tap: null to as written, as written back to null, any other choice to as written', () => {
		for (const [from, to] of [[null, 'as-written'], ['as-written', null], ['bass', 'as-written'], ['ottava', 'as-written']] as const) {
			const { record, ui } = make(from);
			ui.toggle();
			expect(record.octaveReading).toBe(to);
		}
	});
	it('the choices write the same field: "for your range" clears it', () => {
		const { record, ui } = make('bass');
		expect(ui.choice).toBe('bass');
		ui.choose('as-written');
		expect(record.octaveReading).toBe('as-written');
		ui.choose('range');
		expect(record.octaveReading).toBeNull();
		ui.choose('ottava');
		expect(record.octaveReading).toBe('ottava');
		ui.choose('bass');
		expect(record.octaveReading).toBe('bass');
	});
	it('shows on a song with a voice line, and on none without one', () => {
		expect(make(null).ui.shown).toBe(true);
		const flat = new ClefUi();
		flat.bind(() => ({ octaveReading: null, clefChipShown: false }), () => song(TREBLE, []), () => undefined);
		expect(flat.shown).toBe(false);
	});
	it('the chip is raised once per song: the first drawing stores that it was shown, a later one does not raise it', () => {
		const { record, ui } = make(null);
		expect(ui.raiseChip()).toBe(true);
		expect(record.clefChipShown).toBe(true);
		ui.dismissChip();
		expect(ui.chipOpen).toBe(false);
		expect(ui.raiseChip()).toBe(false);
		expect(make(null, true).ui.raiseChip()).toBe(false);
	});
	it('choosing recedes the chip, and the clef button’s menu opens and closes without it', () => {
		const { ui } = make(null);
		ui.raiseChip();
		ui.choose('bass');
		expect(ui.chipOpen).toBe(false);
		ui.openMenu();
		expect(ui.menuOpen).toBe(true);
		ui.closeMenu();
		expect(ui.menuOpen).toBe(false);
	});
	it('the sentence follows the reading: lower, higher, or as written', () => {
		expect(make(null).ui.sentenceKey).toBe('octave.readLower');
		expect(make('as-written').ui.sentenceKey).toBe('octave.asWrittenState');
	});
});
