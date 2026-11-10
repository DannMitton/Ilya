import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser, resolveTempo, type ParsedScore } from '@ilya/score-parser';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { applyCorrections, withCorrection } from '$lib/score/correction';
import { rebar } from '$lib/score/rebar';
import { scoreMetrics } from './score-metrics';

/* QUEUE row 138, B1. Fable's review of 2026-11-10, amendment 7: what a corrected time signature moves downstream of the layer.
   Here, and not beside `rebar.test.ts`, because `score/` may not import `analysis/` (`scripts/ratchets.mjs`, MODULES). */

async function load(name: string): Promise<ParsedScore> {
	const xml = readFileSync(new URL(`../omr/fixtures/${name}.musicxml`, import.meta.url), 'utf8');
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: `${name}.musicxml` })).score;
}

describe('what a corrected time signature moves downstream (review of 2026-11-10, amendment 7)', () => {
	it('the felt beat moves from the eighth to the quarter, and a tempo typed without a unit HALVES every second of phonation (the review said doubles: measured the other way)', async () => {
		const s = await load('time-signature-wrong');
		const map = withCorrection({}, s.vocalLine[0].id, { timeSignature: { beats: 3, beatType: 4, through: 'end' } });
		const fixed = rebar(s, applyCorrections(s.vocalLine, map), map).score;
		const before = resolveTempo(s, { overrideBpm: 60 });
		const after = resolveTempo(fixed, { overrideBpm: 60 });
		expect(before?.beatUnit).toBe('eighth');
		expect(after?.beatUnit).toBe('quarter');
		const secondsBefore = scoreMetrics(s, { tempo: { overrideBpm: 60 } }).seconds?.seconds;
		const secondsAfter = scoreMetrics(fixed, { tempo: { overrideBpm: 60 } }).seconds?.seconds;
		expect(secondsBefore).toBeGreaterThan(0);
		/* Same notes, same typed 60: an eighth beat made each quarter two seconds, a quarter beat makes it one. Measured 0.5; the
		   review of 2026-11-10 (amendment 7) wrote "doubles", which is the wrong direction. */
		expect(secondsAfter! / secondsBefore!).toBeCloseTo(0.5, 5);
	});
	it('the phonation oracle reads the rebuilt expectedDuration, not the reading\'s', async () => {
		const s = await load('time-signature-wrong');
		const map = withCorrection({}, s.vocalLine[0].id, { timeSignature: { beats: 3, beatType: 4, through: 'end' } });
		const fixed = rebar(s, applyCorrections(s.vocalLine, map), map).score;
		expect(s.measures[0].expectedDuration).toEqual({ numerator: 1, denominator: 2 });
		expect(fixed.measures.every((m) => m.expectedDuration.numerator === 3 && m.expectedDuration.denominator === 4)).toBe(true);
	});
});
