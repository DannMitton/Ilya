import { describe, it, expect } from 'vitest';
import { adoptPickupMeter } from './pickup';
import type { Measure, TimeSignatureChange } from './types';

const bar = (index: number, beats: number, beatType: number): Measure => ({
	index,
	number: String(index + 1),
	timeSignature: { beats, beatType },
	keySignature: { fifths: 2 },
	expectedDuration: { numerator: beats, denominator: beatType },
});

describe('adoptPickupMeter (walk finding 2026-09-24, Sunless 2)', () => {
	it('a 2/4 bar 1 before 4/4 becomes a pickup under 4/4, with no meter change at bar 2', () => {
		const measures = [bar(0, 2, 4), bar(1, 4, 4), bar(2, 3, 4)];
		const times: TimeSignatureChange[] = [
			{ measureIndex: 0, signature: { beats: 2, beatType: 4 } },
			{ measureIndex: 1, signature: { beats: 4, beatType: 4 } },
			{ measureIndex: 2, signature: { beats: 3, beatType: 4 } },
		];
		expect(adoptPickupMeter(measures, times)).toBe(true);
		expect(measures[0]).toMatchObject({ timeSignature: { beats: 4, beatType: 4 }, expectedDuration: { numerator: 4, denominator: 4 }, isPickup: true });
		expect(times).toEqual([
			{ measureIndex: 0, signature: { beats: 4, beatType: 4 } },
			{ measureIndex: 2, signature: { beats: 3, beatType: 4 } },
		]);
	});

	it('Sunless 1 shape: 6/8 before 12/8 becomes a pickup under 12/8', () => {
		const measures = [bar(0, 6, 8), bar(1, 12, 8)];
		const times: TimeSignatureChange[] = [
			{ measureIndex: 0, signature: { beats: 6, beatType: 8 } },
			{ measureIndex: 1, signature: { beats: 12, beatType: 8 } },
		];
		expect(adoptPickupMeter(measures, times)).toBe(true);
		expect(measures[0].timeSignature).toEqual({ beats: 12, beatType: 8 });
		expect(times).toEqual([{ measureIndex: 0, signature: { beats: 12, beatType: 8 } }]);
	});

	it('leaves a longer bar 1, a same-meter bar 1, a flagged pickup, and a one-bar score alone', () => {
		for (const measures of [[bar(0, 4, 4), bar(1, 2, 4)], [bar(0, 4, 4), bar(1, 4, 4)], [bar(0, 4, 4)]]) {
			const before = structuredClone(measures);
			expect(adoptPickupMeter(measures, [])).toBe(false);
			expect(measures).toEqual(before);
		}
		const flagged = [{ ...bar(0, 2, 4), isPickup: true }, bar(1, 4, 4)];
		expect(adoptPickupMeter(flagged, [])).toBe(false);
		expect(flagged[0].timeSignature).toEqual({ beats: 2, beatType: 4 });
	});
});
