/**
 * notationOnlyOverlay tests (§E.7 slice 1, Dann's notation-first ruling,
 * 2026-07-13). The contract under test: a typed AnalyzedScore whose events
 * map is empty (so the staff renderer draws no acoustic marks), whose
 * global block carries the SCORE's observed facts, and whose calibration
 * snapshot truthfully declares that no resonances were applied.
 */

import { describe, expect, it } from 'vitest';
import { demoScore, pitchToMidi, type ParsedScore } from '@ilya/score-parser';
import { notationOnlyOverlay } from './notation-overlay';

describe('notationOnlyOverlay', () => {
	const parsed = demoScore();
	const overlay = notationOnlyOverlay(parsed);

	it('marks nothing: the events map is empty', () => {
		expect(Object.keys(overlay.events)).toEqual([]);
	});

	it('carries the score-observed range in global', () => {
		const midis = parsed.vocalLine
			.filter((e) => e.type === 'note' && e.pitch)
			.map((e) => pitchToMidi(e.pitch!));
		expect(pitchToMidi(overlay.global.range.lowest)).toBe(Math.min(...midis));
		expect(pitchToMidi(overlay.global.range.highest)).toBe(Math.max(...midis));
	});

	it('carries the score key and time signature', () => {
		const firstKey = parsed.keySignatures[0]?.signature;
		const firstTime = parsed.timeSignatures[0]?.signature;
		expect(overlay.global.keyFifths).toBe(firstKey?.fifths ?? 0);
		expect(overlay.global.timeSignature).toBe(
			firstTime ? `${firstTime.beats}/${firstTime.beatType}` : '4/4'
		);
	});

	it('declares the empty profile truthfully', () => {
		expect(overlay.calibrationSnapshot.fR1).toEqual({});
		expect(overlay.calibrationSnapshot.label).toContain('no profile applied');
	});

	it('degrades to middle C bounds for a score with no sung pitches', () => {
		const empty: ParsedScore = { ...parsed, vocalLine: [] };
		const o = notationOnlyOverlay(empty);
		expect(o.global.range.lowest).toEqual({ step: 'C', octave: 4, alter: 0 });
		expect(o.global.range.highest).toEqual({ step: 'C', octave: 4, alter: 0 });
	});
});
