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
	flatPitch,
	migrateCorrectionIds,
	naturalPitch,
	neighbourId,
	octavePitch,
	orphanIds,
	pitchToMidi,
	semitonePitch,
	sharpPitch,
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

	it('spells a semitone with the app own speller, sharps where nothing says otherwise', () => {
		// With no key and no previous note the policy takes the sharp side, so
		// down from D natural is C sharp. Asserted so the choice is visible.
		expect(semitonePitch(P('D', 4), -1)).toEqual(P('C', 4, 1));
		expect(semitonePitch(P('C', 4, 1), 1)).toEqual(P('D', 4));
	});

	/* N.92 slice 2, and the case Dann ruled from: a nudge in a flat key must
	   land on the note the page would print. */
	it('nudges to the flat side in a flat key, so D down in E flat major is D flat', () => {
		expect(semitonePitch(P('D', 4), -1, { key: { fifths: -3 } })).toEqual(P('D', 4, -1));
	});

	it('nudges to the sharp side in a sharp key', () => {
		expect(semitonePitch(P('G', 4), 1, { key: { fifths: 2 } })).toEqual(P('G', 4, 1));
	});
});

/**
 * THE ACCIDENTAL VERBS (N.92 slice 2, ruled by Dann 2026-08-24). Cumulative,
 * two clicks reach doubles, a third does nothing, and natural resets.
 */
describe('N.92 accidental verbs', () => {
	it('lowers the spelling one degree per click, B to B flat to B double flat', () => {
		const b = P('B', 4);
		const bFlat = flatPitch(b);
		expect(bFlat).toEqual(P('B', 4, -1));
		expect(flatPitch(bFlat)).toEqual(P('B', 4, -2));
	});

	it('raises the spelling one degree per click, F to F sharp to F double sharp', () => {
		const f = P('F', 4);
		const fSharp = sharpPitch(f);
		expect(fSharp).toEqual(P('F', 4, 1));
		expect(sharpPitch(fSharp)).toEqual(P('F', 4, 2));
	});

	it('caps at a double, so a third click in the same direction does nothing', () => {
		const doubleFlat = P('B', 4, -2);
		expect(flatPitch(doubleFlat)).toBe(doubleFlat);
		const doubleSharp = P('F', 4, 2);
		expect(sharpPitch(doubleSharp)).toBe(doubleSharp);
	});

	it('resets to the plain letter on natural, from either side', () => {
		expect(naturalPitch(P('B', 4, -2))).toEqual(P('B', 4));
		expect(naturalPitch(P('F', 4, 2))).toEqual(P('F', 4));
		// Already plain: the same object, so nothing is recorded.
		const plain = P('G', 4);
		expect(naturalPitch(plain)).toBe(plain);
	});

	it('crosses a verb with a nudge and back, and the note is where it started', () => {
		// Flat then sharp returns the spelling, and the sound follows it.
		expect(sharpPitch(flatPitch(P('B', 4)))).toEqual(P('B', 4));
	});

	it('never moves the letter or the octave, so sound follows spelling', () => {
		const b = P('B', 4);
		expect(pitchToMidi(b) - pitchToMidi(flatPitch(b))).toBe(1);
		expect(flatPitch(b).step).toBe('B');
		expect(flatPitch(b).octave).toBe(4);
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

	/* N.92 slice 2. THE HAND SPELLING ALWAYS WINS. A singer who wrote G flat in
	   D major, a key whose own spelling of that sound is F sharp, keeps the G
	   flat: the policy is consulted when a nudge has to choose a spelling, and
	   never afterwards. Both the reading and the applied line are asserted,
	   because those are the two places a re-spelling could creep in. */
	it('keeps a hand spelling the policy would have spelled the other way', () => {
		const gFlat = P('G', 4, -1);
		const map: CorrectionMap = { b: { pitch: gFlat } };
		// The policy, asked the same question, says F sharp in D major.
		expect(semitonePitch(P('G', 4), -1, { key: { fifths: 2 } })).toEqual(P('F', 4, 1));
		expect(currentPitch(line[2], map)).toEqual(gFlat);
		expect(applyCorrections(line, map)[2].pitch).toEqual(gFlat);
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

/**
 * N.97. The id re-key, its migration, and the thing the whole re-key exists to
 * protect: a correction on a note must survive the removal of an earlier event
 * in its own measure.
 */
describe('N.97 the correction id migration', () => {
	it('strips the two onset segments from an old id', () => {
		expect(migrateCorrectionIds({ 'r3-1-4-1408': { dots: 1 } })).toEqual({
			'r3-1408': { dots: 1 }
		});
	});

	it('strips an abstained onset, which the reader wrote as na-na', () => {
		expect(migrateCorrectionIds({ 'r0-na-na-560': { deleted: true } })).toEqual({
			'r0-560': { deleted: true }
		});
	});

	it('leaves an already-migrated id alone, so a second run changes nothing', () => {
		const once = migrateCorrectionIds({ 'r3-1-4-1408': { dots: 1 }, 'r0-na-na-560': { deleted: true } });
		expect(migrateCorrectionIds(once)).toEqual(once);
		// And a third, because idempotence is the property, not the second run.
		expect(migrateCorrectionIds(migrateCorrectionIds(once))).toEqual(once);
	});

	it('leaves a collision-suffixed new id alone, three segments and all', () => {
		const map: CorrectionMap = { 'r2-804-2': { base: 'half' }, 'r2-804-3': { base: 'whole' } };
		expect(migrateCorrectionIds(map)).toBe(map);
	});

	it('migrates a mixed map, old entries and new side by side', () => {
		expect(migrateCorrectionIds({ 'r1-0-1-515': { deleted: true }, 'r1-1266': { dots: 1 } })).toEqual({
			'r1-515': { deleted: true },
			'r1-1266': { dots: 1 }
		});
	});

	it('gives the first entry the id on a post-strip collision, and orphans the rest', () => {
		// Two old ids in one measure at one x: only their onsets differed, so
		// they strip to the same new id. First written wins.
		const migrated = migrateCorrectionIds({
			'r4-0-1-796': { base: 'half' },
			'r4-1-4-796': { base: 'whole' }
		});
		expect(migrated).toEqual({ 'r4-796': { base: 'half' } });
	});

	it('returns the same object where nothing needed migrating, so no reactive churn', () => {
		const map: CorrectionMap = { 'r1-1266': { dots: 1 } };
		expect(migrateCorrectionIds(map)).toBe(map);
		const empty: CorrectionMap = {};
		expect(migrateCorrectionIds(empty)).toBe(empty);
	});
});

describe('N.97 orphaned corrections are counted, never silent', () => {
	const line = [note('r0-1266', P('E', 4)), note('r0-1408', P('F', 4))];

	it('counts nothing where every correction lands', () => {
		expect(orphanIds(line, { 'r0-1266': { dots: 1 } })).toEqual([]);
	});

	it('names the corrections the current read no longer carries', () => {
		expect(orphanIds(line, { 'r0-1266': { dots: 1 }, 'r0-9999': { deleted: true } })).toEqual([
			'r0-9999'
		]);
	});

	it('counts a deletion whose target is gone, because that instruction did not land', () => {
		expect(orphanIds(line, { 'r0-515': { deleted: true } })).toEqual(['r0-515']);
	});

	it('costs nothing on a score with no corrections', () => {
		expect(orphanIds(line, {})).toEqual([]);
	});
});

describe('N.97 a correction survives the removal of an earlier event in its measure', () => {
	// Measure 0 as the reader emitted it BEFORE N.97 masked the clef and key
	// ink: two false positives on the G clef and the two sharps, at x 515 and
	// 560, then three real notes. Under the old scheme the ids carried the
	// running onset, so the third real note's id was r0-1-2-1734.
	const singerCorrected = 'r0-1734';

	const afterMasking: VocalLineEvent[] = [
		note('r0-1266', P('E', 4)),
		note('r0-1408', P('F', 4)),
		note('r0-1734', P('G', 4))
	];

	it('lands on the same note after two false positives are removed', () => {
		// The correction was made on the third note when the line still carried
		// the two false positives. x does not move when a neighbour is removed,
		// so the id is the same string on both sides of the removal.
		const map: CorrectionMap = { [singerCorrected]: { base: 'half' } };
		expect(orphanIds(afterMasking, map)).toEqual([]);
		const corrected = applyCorrections(afterMasking, map);
		expect(corrected[2].duration.base).toBe('half');
		expect(corrected[2].id).toBe('r0-1734');
	});

	it('would have been orphaned under the old onset-bearing id', () => {
		// The same correction stored the old way. Every onset after a removed
		// event shifts, so the id it names is not the id the re-read produced.
		// This is the defect the re-key exists to remove, asserted rather than
		// asserted-about.
		const old: CorrectionMap = { 'r0-1-2-1734': { base: 'half' } };
		expect(orphanIds(afterMasking, old)).toEqual(['r0-1-2-1734']);
		// And the migration is what rescues it.
		expect(orphanIds(afterMasking, migrateCorrectionIds(old))).toEqual([]);
	});
});
