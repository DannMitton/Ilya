import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser, type ParsedScore, type VocalLineEvent } from '@ilya/score-parser';
import { parseXml } from './ingestion/mini-dom';
import { applyCorrections, type CorrectionMap } from './correction';
import { barlineVerb } from './barline-marks';
import { measureFill } from './entry';
import { rebar } from './rebar';

async function load(name: string): Promise<ParsedScore> {
	const xml = readFileSync(new URL(`../omr/fixtures/${name}.musicxml`, import.meta.url), 'utf8');
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: `${name}.musicxml` })).score;
}
const inBar = (line: VocalLineEvent[], bar: number) => line.filter((e) => e.measureIndex === bar);
const verb = (s: ParsedScore, map: CorrectionMap, id: string) => barlineVerb(s, applyCorrections(s.vocalLine, map), map, id);
const bars = (s: ParsedScore, map: CorrectionMap) => rebar(s, applyCorrections(s.vocalLine, map), map).score.measures.length;

describe('the Barline verb (QUEUE row 138, B3)', () => {
	it('offers Add after a note whose neighbour is in the same bar, and writes the mark on the neighbour', async () => {
		const s = await load('barline-fused');
		const fused = inBar(s.vocalLine, 3);
		const v = verb(s, {}, fused[3].id)!;
		expect(v.kind).toBe('add');
		expect(v.nextId).toBe(fused[4].id);
		expect(v.map).toEqual({ [fused[4].id]: { barline: 'before' } });
		expect(bars(s, v.map)).toBe(8);
	});
	it('offers Remove after the last note of a bar, and writes none on the first note of the next', async () => {
		const s = await load('barline-clean-4-4');
		const v = verb(s, {}, inBar(s.vocalLine, 3)[3].id)!;
		expect(v.kind).toBe('remove');
		expect(v.nextId).toBe(inBar(s.vocalLine, 4)[0].id);
		expect(v.map).toEqual({ [v.nextId]: { barline: 'none' } });
		expect(bars(s, v.map)).toBe(7);
	});
	it('add then remove, and remove then add, each leave no record behind, in both orders', async () => {
		const s = await load('barline-fused');
		const held = inBar(s.vocalLine, 3)[3].id;
		const added = verb(s, {}, held)!;
		const removed = verb(s, added.map, held)!;
		expect(removed.kind).toBe('remove');
		expect(removed.map).toEqual({});
		const clean = await load('barline-clean-4-4');
		const heldClean = inBar(clean.vocalLine, 3)[3].id;
		const cut = verb(clean, {}, heldClean)!;
		const back = verb(clean, cut.map, heldClean)!;
		expect(back.kind).toBe('add');
		expect(back.map).toEqual({});
	});
	it('a removal and then a barline put somewhere else both stand', async () => {
		const s = await load('barline-clean-4-4');
		const a = verb(s, {}, inBar(s.vocalLine, 1)[2].id)!; // join bars 2 and 3
		const b = verb(s, a.map, inBar(s.vocalLine, 5)[0].id)!; // divide bar 6 after its first note
		expect(b.kind).toBe('add');
		expect(a.kind).toBe('remove');
		expect(bars(s, b.map)).toBe(8);
		expect(Object.keys(b.map)).toHaveLength(2);
	});
	it('offers nothing after the last entry of the song', async () => {
		const s = await load('barline-clean-4-4');
		expect(verb(s, {}, s.vocalLine[s.vocalLine.length - 1].id)).toBeNull();
	});
	it('offers no removal where the second bar opens a change of signature, or the first ends a repeat', async () => {
		const s = await load('barline-clean-4-4');
		s.measures[4].timeSignature = { beats: 3, beatType: 4 };
		expect(verb(s, {}, inBar(s.vocalLine, 3)[3].id)).toBeNull();
		const r = await load('barline-clean-4-4');
		r.measures[3].repeatEnd = true;
		expect(verb(r, {}, inBar(r.vocalLine, 3)[3].id)).toBeNull();
	});
	it('offers no removal before a bar that carries her own time signature (the signature is removed first, from the card)', async () => {
		const s = await load('barline-clean-4-4');
		const opener = inBar(s.vocalLine, 4)[0].id;
		const map: CorrectionMap = { [opener]: { timeSignature: { beats: 4, beatType: 4, through: 'next' } } };
		expect(verb(s, map, inBar(s.vocalLine, 3)[3].id)).toBeNull();
	});
	it('offers no barline inside a tuplet group, and one after its last member', async () => {
		const s = await load('barline-clean-4-4');
		const t = { actualNotes: 3, normalNotes: 2, normalType: 'eighth' as const };
		const bar0 = inBar(s.vocalLine, 0);
		for (const e of bar0.slice(0, 3)) e.duration.tuplet = t;
		expect(verb(s, {}, bar0[0].id)).toBeNull();
		expect(verb(s, {}, bar0[1].id)).toBeNull();
		expect(verb(s, {}, bar0[2].id)?.kind).toBe('add');
	});
	it('a bar that stays over-full or short after the verb is flagged as it was', async () => {
		const s = await load('barline-fused-rest-dropped');
		const v = verb(s, {}, inBar(s.vocalLine, 3)[3].id)!;
		const out = rebar(s, applyCorrections(s.vocalLine, v.map), v.map);
		expect(measureFill(out.line, 3, out.score.measures[3].timeSignature)).toBeNull();
		expect(measureFill(out.line, 4, out.score.measures[4].timeSignature)).toEqual({ actual: 3, expected: 4 });
	});
});
