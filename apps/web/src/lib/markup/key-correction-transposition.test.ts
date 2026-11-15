/**
 * N.192 step 6b: a stored transposition when the opening key is corrected. Lives in `markup/` because the ruler is there and `score/` may not import it.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser, type ParsedScore } from '@ilya/score-parser';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { BarLayer } from '$lib/score/bar-layer';
import { appliedChoice } from './transposition-ruler';

async function fixture(): Promise<ParsedScore> {
	const xml = readFileSync(new URL('../../../../../packages/score-parser/src/fixtures/key-changes.musicxml', import.meta.url), 'utf8');
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: 'key-changes.musicxml' })).score;
}
const opener = (s: ParsedScore, bar: number): string => s.vocalLine.find((e) => e.measureIndex === bar)!.id;
describe('a stored transposition when the opening key is corrected', () => {
	it('is dropped (the page opens as printed) unless it is still a stop of the corrected key, so the signature and the pitches never disagree', async () => {
		const s = await fixture();
		// chosen against D major (2 sharps): up a tone to E major (4 sharps).
		const stored = { semitones: 2, fifths: 4 };
		expect(appliedChoice(stored, { fifths: 2, mode: 'major' })).toEqual(stored);
		// the opening key is corrected to A major (3 sharps): (2, 4) is not a stop of A major (which goes up a tone to B major, 5 sharps).
		const l = new BarLayer({ score: () => s, corrections: () => ({ [opener(s, 0)]: { keySignature: { fifths: 3, through: 'next' as const, notes: 'keep' as const } } }) }).score!;
		expect(appliedChoice(stored, { fifths: l.keySignatures[0].signature.fifths, mode: 'major' })).toBeNull();
		expect(appliedChoice({ semitones: 2, fifths: 5 }, { fifths: l.keySignatures[0].signature.fifths, mode: 'major' })).toEqual({ semitones: 2, fifths: 5 });
	});
});
