/**
 * N.187 step 6: grace notes in Corrections. The pure arithmetic: what `applyCorrections` does with a note made a
 * grace note, a grace note made a full note, and a hand-added grace note; the corrected grace list; the selection order.
 */
import { describe, expect, it } from 'vitest';
import type { GraceNote, Pitch, VocalLineEvent } from '@ilya/score-parser';
import { applyCorrections, orphanIds, withCorrection, type CorrectionMap } from './correction';
import { correctedGraceNotes, selectionOrder } from './grace-layer';

const P = (step: Pitch['step'], octave = 4, alter = 0): Pitch => ({ step, octave, alter });
const Q = { numerator: 1, denominator: 4 };
function note(id: string, measureIndex: number, pos: number, pitch: Pitch): VocalLineEvent {
	return { id, type: 'note', measureIndex, rhythmicPosition: { fraction: { numerator: pos, denominator: 4 } }, duration: { base: 'quarter', dots: 0, fraction: Q }, pitch } as VocalLineEvent;
}
const line = [note('a', 0, 0, P('C')), note('b', 0, 1, P('D')), note('c', 0, 2, P('E')), note('d', 0, 3, P('F'))];
const graces: GraceNote[] = [
	{ id: 'b~g1', principalId: 'b', pitch: P('C'), base: 'eighth', slash: true },
	{ id: 'd~a1', principalId: 'd', after: true, pitch: P('G'), base: 'eighth' },
];
const ids = (l: VocalLineEvent[]): string[] => l.map((e) => e.id);
const apply = (map: CorrectionMap, g = graces): { line: VocalLineEvent[]; graces: GraceNote[] | undefined } => {
	const l = applyCorrections(line, map, g);
	return { line: l, graces: correctedGraceNotes(g, map, line, l) };
};

describe('a read grace note, corrected', () => {
	it('with no correction the list is the read list itself', () => {
		expect(apply({}).graces).toBe(graces);
	});
	it('re-pitches, re-sizes, and slashes it by its own id', () => {
		const m = withCorrection(withCorrection(withCorrection({}, 'b~g1', { pitch: P('B', 3) }), 'b~g1', { base: '16th' }), 'b~g1', { grace: { slash: false } });
		expect(apply(m).graces![0]).toMatchObject({ id: 'b~g1', principalId: 'b', pitch: P('B', 3), base: '16th', slash: false });
		expect(ids(apply(m).line)).toEqual(['a', 'b', 'c', 'd']);
	});
	it('deleting it takes it out of the list and not out of the line', () => {
		const r = apply({ 'b~g1': { deleted: true } });
		expect(r.graces!.map((g) => g.id)).toEqual(['d~a1']);
		expect(ids(r.line)).toEqual(['a', 'b', 'c', 'd']);
	});
	it('made a full note again, it enters the line before its principal, with its base as its duration, and leaves the list', () => {
		const r = apply({ 'b~g1': { grace: 'none' } });
		expect(ids(r.line)).toEqual(['a', 'b~g1', 'b', 'c', 'd']);
		const ev = r.line[1];
		expect(ev.duration.base).toBe('eighth');
		expect(ev.pitch).toEqual(P('C'));
		expect(r.graces!.map((g) => g.id)).toEqual(['d~a1']);
	});
	it('an after-grace made a full note enters after its principal', () => {
		expect(ids(apply({ 'd~a1': { grace: 'none' } }).line)).toEqual(['a', 'b', 'c', 'd', 'd~a1']);
	});
	it('a principal deleted passes its grace notes on to the next note that stands', () => {
		const r = apply({ b: { deleted: true } });
		expect(r.graces!.find((g) => g.id === 'b~g1')).toMatchObject({ principalId: 'c' });
	});
	it('is never reported as a correction that did not land', () => {
		expect(orphanIds(line, { 'b~g1': { pitch: P('E') } })).toEqual(['b~g1']);
		expect(orphanIds(line, { 'b~g1': { pitch: P('E') } }, graces.map((g) => g.id))).toEqual([]);
	});
});

describe('a full note made a grace note', () => {
	const m: CorrectionMap = { c: { grace: { slash: true } } };
	it('leaves the line as a deleted note does, so the bar\'s sum and the onsets behave as for a deletion', () => {
		const r = apply(m);
		expect(ids(r.line)).toEqual(['a', 'b', 'd']);
		const deleted = applyCorrections(line, { c: { deleted: true } });
		expect(r.line.map((e) => [e.id, e.rhythmicPosition.fraction])).toEqual(deleted.map((e) => [e.id, e.rhythmicPosition.fraction]));
	});
	it('goes into the grace list before the next note that stands, with its own pitch and base and the stroke it was given', () => {
		expect(apply(m).graces!.find((g) => g.id === 'c')).toMatchObject({ principalId: 'd', pitch: P('E'), base: 'quarter', slash: true });
	});
	it('with no note after it, is an after-grace of the last note', () => {
		const r = apply({ d: { grace: { slash: false } } });
		expect(r.graces!.find((g) => g.id === 'd')).toMatchObject({ principalId: 'c', after: true });
	});
	it('can be made a full note again, by removing the record (Restore)', () => {
		expect(ids(apply({}).line)).toEqual(['a', 'b', 'c', 'd']);
	});
});

describe('a grace note added by hand', () => {
	const m: CorrectionMap = { 'hand:1': { entered: { after: 'a' }, grace: { slash: true }, pitch: P('D', 4), base: 'eighth' } };
	it('is not in the line, and everything else stands where it was', () => {
		expect(ids(apply(m).line)).toEqual(['a', 'b', 'c', 'd']);
	});
	it('hangs on the next note after the entry it follows', () => {
		expect(apply(m).graces!.find((g) => g.id === 'hand:1')).toMatchObject({ principalId: 'b', pitch: P('D'), base: 'eighth', slash: true });
		expect(apply(m).graces!.map((g) => g.id)).toEqual(['hand:1', 'b~g1', 'd~a1']);
	});
	it('one entered after a read grace note of the same principal follows it, in the group', () => {
		const r = apply({ 'hand:2': { entered: { after: 'b~g1' }, grace: { slash: false }, pitch: P('A', 3), base: 'eighth' } });
		expect(r.graces!.filter((g) => g.principalId === 'b').map((g) => g.id)).toEqual(['b~g1', 'hand:2']);
	});
	it('at the end of the line is an after-grace of the last note', () => {
		const r = apply({ 'hand:3': { entered: { after: 'd' }, grace: { slash: true }, pitch: P('A'), base: 'eighth' } });
		expect(r.graces!.find((g) => g.id === 'hand:3')).toMatchObject({ principalId: 'd', after: true });
	});
	it('what hangs on it still stands: a note entered after it appears in the line', () => {
		const r = apply({ ...m, 'hand:4': { entered: { after: 'hand:1' }, pitch: P('F'), base: 'quarter' } });
		expect(ids(r.line)).toEqual(['a', 'hand:4', 'b', 'c', 'd']);
	});
	it('a record is never pruned as empty (it is the entry)', () => {
		expect(withCorrection({}, 'hand:1', m['hand:1'])['hand:1']).toBeDefined();
		expect(withCorrection({ x: { grace: { slash: true } } }, 'x', { grace: undefined })).toEqual({});
	});
});

describe('the selection order', () => {
	it('walks each grace note before its principal and an after-grace after it', () => {
		const r = apply({});
		expect(selectionOrder(r.graces, r.line, {})).toEqual(['a', 'b~g1', 'b', 'c', 'd', 'd~a1']);
	});
	it('leaves a deleted note and a deleted grace note out', () => {
		const m: CorrectionMap = { c: { deleted: true } };
		const r = apply(m);
		expect(selectionOrder(r.graces, r.line, m)).toEqual(['a', 'b~g1', 'b', 'd', 'd~a1']);
	});
});
