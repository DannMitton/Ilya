import { describe, expect, it } from 'vitest';
import type { ParsedScore, Pitch } from '@ilya/score-parser';
import { clefChoiceOf, readingClef, readingOf } from './clef-choice';
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
/** Song 2 of row 114, in shape: printed in treble, C4 to A5. */
const SONG = [P('C', 4), P('E', 4), P('G', 4), P('C', 5), P('E', 5), P('A', 5)];
const BASS_RANGE = { lowest: P('E', 2), highest: P('E', 4) };

describe('row 127: the clef and the octave a stored choice draws', () => {
	it('a printed-treble line the range reads lower draws treble with an 8 below by default', () => {
		expect(readingClef(score(TREBLE, SONG), BASS_RANGE, null)).toEqual({ shift: -1, suggestedShift: -1, clef: 'treble-8vb', shown: true });
	});
	it('bass reads it lower and draws bass', () => {
		expect(readingClef(score(TREBLE, SONG), BASS_RANGE, 'bass')).toMatchObject({ shift: -1, clef: 'bass', shown: true });
	});
	it('as written reads it as printed, in the source clef, and the row still shows', () => {
		expect(readingClef(score(TREBLE, SONG), BASS_RANGE, 'as-written')).toMatchObject({ shift: 0, suggestedShift: -1, clef: 'treble', shown: true });
	});
	it('a source treble-8vb clef with a MusicXML shift of 0 stays as it is, and shows no row', () => {
		const r = readingClef(score({ ...TREBLE, octaveChange: -1 }, [P('A', 2), P('E', 3), P('E', 4)]), BASS_RANGE, null);
		expect(r).toEqual({ shift: 0, suggestedShift: 0, clef: null, shown: false });
	});
	it('a bass-clef source asked to read higher: bass is inert, as written turns the reading off', () => {
		const song = score({ sign: 'F', line: 4 }, [P('G', 2), P('C', 3), P('E', 3)]);
		const high = { lowest: P('C', 4), highest: P('C', 6) };
		expect(readingClef(song, high, null)).toMatchObject({ shift: 1, clef: null, shown: false });
		expect(readingClef(song, high, 'bass')).toMatchObject({ shift: 1, clef: null, shown: false });
		expect(readingClef(song, high, 'as-written')).toMatchObject({ shift: 0, suggestedShift: 1, clef: null, shown: false });
	});
	it('a line that already fits the range has no shift and no row', () => {
		expect(readingClef(score(TREBLE, [P('E', 3), P('G', 3), P('C', 4)]), BASS_RANGE, 'bass')).toEqual({ shift: 0, suggestedShift: 0, clef: null, shown: false });
	});
	it('no score, or no range, draws nothing special', () => {
		expect(readingClef(null, BASS_RANGE, null)).toEqual({ shift: 0, suggestedShift: 0, clef: null, shown: false });
		expect(readingClef(score(TREBLE, SONG), undefined, null).shown).toBe(false);
	});
	it('the choice and the stored value convert both ways', () => {
		for (const stored of [null, 'bass', 'as-written'] as const) expect(readingOf(clefChoiceOf(stored))).toBe(stored);
		expect([clefChoiceOf(null), clefChoiceOf('bass'), clefChoiceOf('as-written')]).toEqual(['ottava', 'bass', 'as-written']);
	});
});

describe('row 127: one state, two doors', () => {
	const make = (octaveReading: 'as-written' | 'bass' | null) => {
		const song = { octaveReading };
		const ui = new ClefUi();
		ui.bind(() => song, () => score(TREBLE, SONG), () => BASS_RANGE);
		return { song, ui };
	};
	it('the octave line’s tap: null to as written, as written back to null, bass to as written', () => {
		for (const [from, to] of [[null, 'as-written'], ['as-written', null], ['bass', 'as-written']] as const) {
			const { song, ui } = make(from);
			ui.toggle();
			expect(song.octaveReading).toBe(to);
		}
	});
	it('the select writes the same field: the default clears it, Bass and Treble store theirs', () => {
		const { song, ui } = make('bass');
		expect(ui.choice).toBe('bass');
		ui.choose('as-written');
		expect(song.octaveReading).toBe('as-written');
		ui.choose('ottava');
		expect(song.octaveReading).toBeNull();
		ui.choose('bass');
		expect(song.octaveReading).toBe('bass');
	});
	it('the row shows exactly where a printed-treble line is read lower', () => {
		expect(make(null).ui.shown).toBe(true);
		const flat = new ClefUi();
		flat.bind(() => ({ octaveReading: null }), () => score(TREBLE, SONG), () => undefined);
		expect(flat.shown).toBe(false);
	});
});
