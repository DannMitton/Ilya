/**
 * correction.test.ts — the correction minimum's rules, N.92 first slice.
 *
 * Every case here is one the ship's definition of done or its hard constraints
 * name: a step moves the notehead, a digit sets the base, a dot toggles, a
 * delete removes, and a corrected pitch KEEPS ITS SYLLABLE. The last of those
 * is a constraint rather than a feature, so it is asserted rather than assumed.
 */
import { describe, it, expect } from 'vitest';
import type { NoteBase, Pitch, VocalLineEvent } from '@ilya/score-parser';
import {
	applyCorrections,
	clearCorrection,
	currentDuration,
	currentPitch,
	DIGIT_BASE,
	durationFraction,
	firstNoteId,
	neighbourId,
	octavePitch,
	semitonePitch,
	stepPitch,
	withCorrection,
	type CorrectionMap
} from './correction';

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });

function note(
	id: string,
	pitch: Pitch | undefined,
	base: NoteBase = 'quarter',
	dots = 0,
	syllable?: string
): VocalLineEvent {
	const ev: VocalLineEvent = {
		id,
		type: pitch ? 'note' : 'rest',
		measureIndex: 0,
		rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
		duration: { base, dots, fraction: durationFraction(base, dots) }
	};
	if (pitch) ev.pitch = pitch;
	if (syllable) {
		ev.syllable = {
			id: `${id}-syl`,
			text: syllable,
			type: 'whole',
			verseNumber: 1,
			wordContext: syllable
		};
	}
	return ev;
}

describe('N.92 pitch operations', () => {
	it('steps one diatonic step and keeps the accidental, so F sharp goes to G sharp', () => {
		expect(stepPitch(P('F', 4, 1), 1)).toEqual(P('G', 4, 1));
	});

	it('carries the octave across the B to C boundary in both directions', () => {
		expect(stepPitch(P('B', 4), 1)).toEqual(P('C', 5));
		expect(stepPitch(P('C', 5), -1)).toEqual(P('B', 4));
	});

	it('moves an octave without touching the spelling', () => {
		expect(octavePitch(P('E', 3, -1), 1)).toEqual(P('E', 4, -1));
		expect(octavePitch(P('E', 3, -1), -1)).toEqual(P('E', 2, -1));
	});

	it('spells a semitone with the app own speller, naturals and sharps', () => {
		// transposePitch spells sharp, so down from D natural is C sharp rather
		// than D flat. Asserted so the choice is visible, not discovered later.
		expect(semitonePitch(P('D', 4), -1)).toEqual(P('C', 4, 1));
		expect(semitonePitch(P('C', 4, 1), 1)).toEqual(P('D', 4));
	});
});

describe('N.92 durations', () => {
	it('maps Finale digits to bases', () => {
		expect(DIGIT_BASE['3']).toBe('16th');
		expect(DIGIT_BASE['4']).toBe('eighth');
		expect(DIGIT_BASE['5']).toBe('quarter');
		expect(DIGIT_BASE['6']).toBe('half');
		expect(DIGIT_BASE['7']).toBe('whole');
	});

	it('computes a dotted length as half again, reduced', () => {
		expect(durationFraction('quarter', 0)).toEqual({ numerator: 1, denominator: 4 });
		expect(durationFraction('quarter', 1)).toEqual({ numerator: 3, denominator: 8 });
		expect(durationFraction('quarter', 2)).toEqual({ numerator: 7, denominator: 16 });
		expect(durationFraction('whole', 1)).toEqual({ numerator: 3, denominator: 2 });
	});
});

describe('N.92 the correction map', () => {
	it('folds a second change into the same note without losing the first', () => {
		let m: CorrectionMap = {};
		m = withCorrection(m, 'a', { pitch: P('G', 4) });
		m = withCorrection(m, 'a', { base: 'half' });
		expect(m.a).toEqual({ pitch: P('G', 4), base: 'half' });
	});

	it('drops an entry that ends up saying nothing, so an undone edit stores nothing', () => {
		let m: CorrectionMap = withCorrection({}, 'a', { pitch: P('G', 4) });
		expect(Object.keys(m)).toEqual(['a']);
		m = withCorrection(m, 'a', { pitch: undefined });
		expect(m).toEqual({});
	});

	it('clears a whole correction back to what the reader read', () => {
		const m = withCorrection({}, 'a', { deleted: true });
		expect(clearCorrection(m, 'a')).toEqual({});
		expect(clearCorrection({}, 'missing')).toEqual({});
	});

	it('reports the current pitch and duration with the correction folded in', () => {
		const ev = note('a', P('F', 4), 'quarter', 0);
		const m = withCorrection({}, 'a', { pitch: P('G', 4), base: 'half', dots: 1 });
		expect(currentPitch(ev, m)).toEqual(P('G', 4));
		expect(currentDuration(ev, m)).toEqual({ base: 'half', dots: 1 });
		expect(currentPitch(ev, {})).toEqual(P('F', 4));
		expect(currentDuration(ev, {})).toEqual({ base: 'quarter', dots: 0 });
	});
});

describe('N.92 applying corrections to the line', () => {
	const line = [
		note('a', P('F', 4), 'quarter', 0, 'Ком'),
		note('r1', undefined),
		note('b', P('G', 4), 'eighth', 0, 'нат'),
		note('c', P('A', 4), 'eighth', 0, 'ка')
	];

	it('returns the identical array where nothing is corrected', () => {
		expect(applyCorrections(line, {})).toBe(line);
	});

	it('KEEPS THE ATTACHED SYLLABLE through a pitch change, which is the constraint', () => {
		const out = applyCorrections(line, { a: { pitch: P('E', 4) } });
		expect(out[0].pitch).toEqual(P('E', 4));
		expect(out[0].syllable?.text).toBe('Ком');
		expect(out[0].id).toBe('a');
	});

	it('recomputes the sounding fraction when the base or dots move', () => {
		const out = applyCorrections(line, { a: { base: 'half', dots: 1 } });
		expect(out[0].duration).toEqual({
			base: 'half',
			dots: 1,
			fraction: { numerator: 3, denominator: 4 }
		});
	});

	it('removes a deleted note and leaves every other event alone', () => {
		const out = applyCorrections(line, { b: { deleted: true } });
		expect(out.map((e) => e.id)).toEqual(['a', 'r1', 'c']);
	});

	it('does not mutate the events it was given', () => {
		const before = JSON.stringify(line);
		applyCorrections(line, { a: { pitch: P('E', 4), base: 'whole' } });
		expect(JSON.stringify(line)).toBe(before);
	});

	it('leaves a tuplet fraction to the parser rather than inventing arithmetic', () => {
		const t: VocalLineEvent = {
			...note('t', P('C', 4), 'eighth', 0),
			duration: {
				base: 'eighth',
				dots: 0,
				tuplet: { actualNotes: 3, normalNotes: 2, normalType: 'eighth' },
				fraction: { numerator: 1, denominator: 12 }
			}
		};
		const out = applyCorrections([t], { t: { base: 'quarter' } });
		expect(out[0].duration.base).toBe('quarter');
		expect(out[0].duration.fraction).toEqual({ numerator: 1, denominator: 12 });
	});
});

describe('N.92 moving along the line', () => {
	const line = [
		note('a', P('F', 4)),
		note('r1', undefined),
		note('b', P('G', 4)),
		note('c', P('A', 4))
	];

	it('skips rests', () => {
		expect(neighbourId(line, {}, 'a', 1)).toBe('b');
		expect(neighbourId(line, {}, 'b', -1)).toBe('a');
	});

	it('skips a note already deleted', () => {
		expect(neighbourId(line, { b: { deleted: true } }, 'a', 1)).toBe('c');
	});

	it('stops at both ends rather than wrapping', () => {
		expect(neighbourId(line, {}, 'a', -1)).toBeNull();
		expect(neighbourId(line, {}, 'c', 1)).toBeNull();
	});

	it('returns null for an id the line does not carry', () => {
		expect(neighbourId(line, {}, 'nope', 1)).toBeNull();
	});

	it('finds the first selectable note, skipping rests and deletions', () => {
		expect(firstNoteId(line, {})).toBe('a');
		expect(firstNoteId(line, { a: { deleted: true } })).toBe('b');
		expect(firstNoteId([note('r', undefined)], {})).toBeNull();
	});
});
