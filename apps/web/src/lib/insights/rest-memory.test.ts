/**
 * Round 3 of "Corrections keeps what she did": a rest the reader found, made a note, nudged above her range, and made a rest again must not be
 * named by INSIGHTS as a note outside her range. The record keeps her pitch (Dann, 2026-11-24: her nudge comes back) and keeps `type: 'rest'`,
 * which is what makes the drawn rest carry no pitch. The record's shape is asserted in `score/entry.test.ts`; this file builds the corrected line
 * and asks the reader that has no type test of its own (`firstOutsideRange`, `singer-page.ts`). It lives here because `score/` may not import `insights/`.
 */
import { describe, expect, it } from 'vitest';
import type { NoteBase, Pitch, VocalLineEvent } from '@ilya/score-parser';
import { applyCorrections, durationFraction, withCorrection } from '$lib/score/correction';
import { toggleRest } from '$lib/score/entry';
import { firstOutsideRange } from './singer-page';

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });
function ev(id: string, pitch: Pitch | undefined, base: NoteBase = 'quarter'): VocalLineEvent {
	const e: VocalLineEvent = {
		id,
		type: pitch ? 'note' : 'rest',
		measureIndex: 0,
		rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
		duration: { base, dots: 0, fraction: durationFraction(base, 0) },
	};
	if (pitch) e.pitch = pitch;
	return e;
}

describe('a rest carrying her remembered pitch, as INSIGHTS reads it', () => {
	const line = [ev('a', P('F', 3)), ev('r', undefined)];
	const high = P('A', 4); // above the range below
	const profile = { range: { lowest: P('C', 3), highest: P('G', 4) } } as never;
	const score = (vocalLine: VocalLineEvent[]) => ({ vocalLine, graceNotes: [], measures: [{ index: 0, number: 1 }] }) as never;

	it('names nothing while it is a rest, and names A4 once it is a note again', () => {
		const toNote = toggleRest({}, line, 'r', P('B', 3), line[1]);
		const nudged = withCorrection(toNote, 'r', { pitch: high });
		const toRest = toggleRest(nudged, applyCorrections(line, nudged), 'r', P('B', 3), line[1]);
		const drawn = applyCorrections(line, toRest);
		expect(drawn[1].type).toBe('rest');
		expect(firstOutsideRange(score(drawn), profile)).toBeNull();
		// The nudge comes back, and now it is a note she sings.
		const back = applyCorrections(line, toggleRest(toRest, drawn, 'r', P('B', 3), line[1]));
		expect(back[1]).toMatchObject({ type: 'note', pitch: high });
		expect(firstOutsideRange(score(back), profile)?.pitch).toEqual(high);
	});
});
