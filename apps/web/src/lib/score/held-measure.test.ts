import { describe, expect, it } from 'vitest';
import type { VocalLineEvent } from '@ilya/score-parser';
import { heldMeasureReads } from './held-measure';

const ev = (id: string, measureIndex: number, type: 'note' | 'rest' = 'note'): VocalLineEvent =>
	({ id, type, measureIndex, rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } }, duration: { base: 'quarter', dots: 0, fraction: { numerator: 1, denominator: 4 } } }) as VocalLineEvent;

describe('the held measure\'s reads', () => {
	const line = [ev('a', 0), ev('r', 0, 'rest'), ev('b', 1), ev('c', 1), ev('d', 3)];
	it('is empty with nothing held', () => {
		expect(heldMeasureReads(line, null)).toEqual({ ids: [], nextIds: [], positions: [] });
	});
	it('lists the measure\'s notes (not rests), the next measure that has an entry, and the run of places', () => {
		const h = heldMeasureReads(line, 1);
		expect(h.ids).toEqual(['b', 'c']);
		expect(h.nextIds).toEqual(['d']);
		expect(h.positions.filter((p) => p.kind === 'entry').map((p) => (p as { id: string }).id)).toEqual(['b', 'c']);
	});
	it('has no next ids after the last entry', () => {
		expect(heldMeasureReads(line, 3).nextIds).toEqual([]);
	});
});
