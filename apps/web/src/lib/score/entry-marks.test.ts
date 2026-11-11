import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser, type ParsedScore, type VocalLineEvent } from '@ilya/score-parser';
import { parseXml } from './ingestion/mini-dom';
import { applyCorrections, withCorrection, type CorrectionMap } from './correction';
import { enterEntry } from './entry';
import { adoptBarMarks } from './entry-marks';
import { measureFill } from './entry';
import { rebar } from './rebar';

async function load(name: string): Promise<ParsedScore> {
	const xml = readFileSync(new URL(`../omr/fixtures/${name}.musicxml`, import.meta.url), 'utf8');
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: `${name}.musicxml` })).score;
}
const inBar = (line: VocalLineEvent[], bar: number) => line.filter((e) => e.measureIndex === bar);

describe('a note entered at the head caret of a bar the singer made (QUEUE row 138, B5)', () => {
	it('takes over the barline that opens the bar, and the old first entry drops it', async () => {
		const s = await load('barline-fused');
		const fused = inBar(s.vocalLine, 3);
		const cut: CorrectionMap = withCorrection({}, fused[4].id, { barline: 'before' });
		const r0 = rebar(s, applyCorrections(s.vocalLine, cut), cut);
		// the head caret of song bar 4 (the second half): anchored to the last entry of bar 3, naming song bar 4 = reading bar 3
		const gap = { kind: 'gap' as const, after: fused[3].id, measureIndex: 4 };
		const reading = { ...gap, measureIndex: r0.bars.toReading(4) };
		const { map, id } = enterEntry(cut, reading, { base: 'quarter', dots: 0, pitch: { step: 'C', alter: 0, octave: 4 } });
		const next = adoptBarMarks(map, r0.line, gap, id);
		expect(next[id].barline).toBe('before');
		expect(next[fused[4].id]).toBeUndefined();
		const r1 = rebar(s, applyCorrections(s.vocalLine, next), next);
		// the new note opens song bar 4; the old first entry is its second
		expect(r1.line.find((e) => e.id === id)?.measureIndex).toBe(4);
		expect(inBar(r1.line, 4)[0].id).toBe(id);
		expect(inBar(r1.line, 4)[1].id).toBe(fused[4].id);
		// and the bar before it is exactly as it was
		expect(inBar(r1.line, 3).map((e) => e.id)).toEqual(inBar(r0.line, 3).map((e) => e.id));
		expect(measureFill(r1.line, 3, r1.score.measures[3].timeSignature)).toBeNull();
	});

	it('moves her time signature with it', async () => {
		const s = await load('barline-fused');
		const fused = inBar(s.vocalLine, 3);
		const ts = { beats: 3, beatType: 4, through: 'next' as const };
		const cut: CorrectionMap = { [fused[4].id]: { barline: 'before', timeSignature: ts } };
		const r0 = rebar(s, applyCorrections(s.vocalLine, cut), cut);
		const gap = { kind: 'gap' as const, after: fused[3].id, measureIndex: 4 };
		const { map, id } = enterEntry(cut, gap, { base: 'quarter', dots: 0 });
		const next = adoptBarMarks(map, r0.line, gap, id);
		expect(next[id]).toMatchObject({ barline: 'before', timeSignature: ts });
		expect(next[fused[4].id]).toBeUndefined();
	});

	it('does nothing where the gap is not the head of a bar, where no measure is named, or where the first entry carries no mark', async () => {
		const s = await load('barline-fused');
		const fused = inBar(s.vocalLine, 3);
		const cut: CorrectionMap = { [fused[4].id]: { barline: 'before' } };
		const r0 = rebar(s, applyCorrections(s.vocalLine, cut), cut);
		const tail = { after: fused[2].id, measureIndex: 3 };
		expect(adoptBarMarks(cut, r0.line, tail, 'hand:1')).toBe(cut);
		expect(adoptBarMarks(cut, r0.line, { after: fused[3].id }, 'hand:1')).toBe(cut);
		const plain: CorrectionMap = { [fused[4].id]: { dots: 1 } };
		expect(adoptBarMarks(plain, r0.line, { after: fused[3].id, measureIndex: 4 }, 'hand:1')).toBe(plain);
	});

	it('a bar the reading made keeps working as it did: the entry names the reading bar and no mark moves', async () => {
		const s = await load('barline-clean-4-4');
		const line = applyCorrections(s.vocalLine, {});
		const prev = inBar(line, 3);
		const gap = { kind: 'gap' as const, after: prev[prev.length - 1].id, measureIndex: 4 };
		const { map, id } = enterEntry({}, gap, { base: 'quarter', dots: 0 });
		expect(map[id].entered).toEqual({ after: prev[prev.length - 1].id, measureIndex: 4 });
		expect(adoptBarMarks(map, line, gap, id)).toBe(map);
	});
});
