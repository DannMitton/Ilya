import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser, type ParsedScore, type VocalLineEvent } from '@ilya/score-parser';
import { parseXml } from './ingestion/mini-dom';
import { applyCorrections, withCorrection, type CorrectionMap } from './correction';
import { measureFill } from './entry';
import { rebar } from './rebar';
import { heldBar, setSignature, validSignature } from './time-signature';

async function load(name: string): Promise<ParsedScore> {
	const xml = readFileSync(new URL(`../omr/fixtures/${name}.musicxml`, import.meta.url), 'utf8');
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: `${name}.musicxml` })).score;
}
const inBar = (line: VocalLineEvent[], bar: number) => line.filter((e) => e.measureIndex === bar);
const line = (s: ParsedScore, m: CorrectionMap) => applyCorrections(s.vocalLine, m);
const sigs = (s: ParsedScore, m: CorrectionMap) => rebar(s, line(s, m), m).score.measures.map((x) => `${x.timeSignature.beats}/${x.timeSignature.beatType}`);
const set = (s: ParsedScore, m: CorrectionMap, id: string, beats: number, beatType: number, through: 'next' | 'end') => setSignature(s, line(s, m), m, id, { beats, beatType }, through)!;

describe('the time signature card (QUEUE row 138, T1)', () => {
	it('knows which pairs are time signatures', () => {
		expect(validSignature(3, 4)).toBe(true);
		expect(validSignature(7, 16)).toBe(true);
		expect(validSignature(3, 5)).toBe(false);
		expect(validSignature(0, 4)).toBe(false);
		expect(validSignature(100, 4)).toBe(false);
		expect(validSignature(2.5, 4)).toBe(false);
	});

	it('4/8 to 3/4 from the first bar to the end, keeping the barlines: every bar adds up', async () => {
		const s = await load('time-signature-wrong');
		const m = set(s, {}, s.vocalLine[0].id, 3, 4, 'end');
		expect(m).toEqual({ [s.vocalLine[0].id]: { timeSignature: { beats: 3, beatType: 4, through: 'end' } } });
		const r = rebar(s, line(s, m), m);
		expect(r.score.measures.map((x) => measureFill(r.line, x.index, x.timeSignature))).toEqual(Array(8).fill(null));
	});

	it('"to the end" removes her own later marks, in the one write', async () => {
		const s = await load('time-signature-wrong');
		const later = inBar(s.vocalLine, 3)[0].id;
		let m = set(s, {}, later, 6, 8, 'next');
		expect(Object.keys(m)).toEqual([later]);
		m = set(s, m, s.vocalLine[0].id, 3, 4, 'end');
		expect(Object.keys(m)).toEqual([s.vocalLine[0].id]);
		expect(sigs(s, m).every((x) => x === '3/4')).toBe(true);
	});

	it('a change she makes afterwards on a later bar bounds the earlier one, in either order', async () => {
		const s = await load('time-signature-wrong');
		const bar2 = inBar(s.vocalLine, 2)[0].id;
		const a = set(s, set(s, {}, s.vocalLine[0].id, 3, 4, 'end'), bar2, 6, 8, 'next');
		expect(sigs(s, a)).toEqual(['3/4', '3/4', '6/8', '6/8', '6/8', '6/8', '6/8', '6/8']);
		// the later bar first, then the earlier "to the end": the earlier removes the later one it covers
		const b = set(s, set(s, {}, bar2, 6, 8, 'next'), s.vocalLine[0].id, 3, 4, 'end');
		expect(sigs(s, b).every((x) => x === '3/4')).toBe(true);
		// the later bar first, then the earlier "to next": the earlier is bounded by the later
		const c = set(s, set(s, {}, bar2, 6, 8, 'next'), s.vocalLine[0].id, 3, 4, 'next');
		expect(sigs(s, c)).toEqual(sigs(s, a));
	});

	it('one mark stands in a bar: a second change there replaces the first', async () => {
		const s = await load('time-signature-wrong');
		const bar2 = inBar(s.vocalLine, 2);
		const m = set(s, set(s, {}, bar2[0].id, 3, 4, 'next'), bar2[1].id, 2, 4, 'next');
		expect(Object.keys(m)).toHaveLength(1);
		expect(m[bar2[0].id].timeSignature).toEqual({ beats: 2, beatType: 4, through: 'next' });
	});

	it('choosing the reading\'s own signature "to next" is the way back: it removes her mark', async () => {
		const s = await load('time-signature-wrong');
		const m = set(s, {}, s.vocalLine[0].id, 3, 4, 'next');
		expect(Object.keys(m)).toHaveLength(1);
		expect(set(s, m, s.vocalLine[0].id, 4, 8, 'next')).toEqual({});
		// but "to the end" of the reading's own signature is a mark: it overrides the reading's later changes
		expect(Object.keys(set(s, m, s.vocalLine[0].id, 4, 8, 'end'))).toHaveLength(1);
	});

	it('a record that held other corrections keeps them when the mark goes', async () => {
		const s = await load('time-signature-wrong');
		const id = s.vocalLine[0].id;
		let m = withCorrection({}, id, { dots: 1 });
		m = set(s, m, id, 3, 4, 'next');
		expect(m[id]).toMatchObject({ dots: 1, timeSignature: { beats: 3, beatType: 4 } });
		expect(set(s, m, id, 4, 8, 'next')[id]).toEqual({ dots: 1 });
	});

	it('refuses a pair that is not a time signature', async () => {
		const s = await load('time-signature-wrong');
		expect(setSignature(s, s.vocalLine, {}, s.vocalLine[0].id, { beats: 3, beatType: 5 }, 'end')).toBeNull();
		expect(setSignature(s, s.vocalLine, {}, 'nope', { beats: 3, beatType: 4 }, 'end')).toBeNull();
	});

	it('names the held bar, its opener, both signatures, and her own mark', async () => {
		const s = await load('time-signature-wrong');
		const bar2 = inBar(s.vocalLine, 2);
		const m = set(s, {}, bar2[1].id, 3, 4, 'end');
		const h = heldBar(s, line(s, m), m, bar2[1].id)!;
		expect(h.bar).toBe(2);
		expect(h.openerId).toBe(bar2[0].id);
		expect(h.signature).toMatchObject({ beats: 3, beatType: 4 });
		expect(h.reading).toMatchObject({ beats: 4, beatType: 8 });
		expect(h.mine).toEqual({ beats: 3, beatType: 4, through: 'end' });
		// the mark was written on the bar's opener, not on the note held
		expect(Object.keys(m)).toEqual([bar2[0].id]);
	});

	it('after a bar is divided the held bar is the half, and the mark goes on its own opener', async () => {
		const s = await load('barline-fused');
		const fused = inBar(s.vocalLine, 3);
		const cut: CorrectionMap = withCorrection({}, fused[4].id, { barline: 'before' });
		const h = heldBar(s, line(s, cut), cut, fused[5].id)!;
		expect(h.bar).toBe(4);
		expect(h.openerId).toBe(fused[4].id);
		const m = setSignature(s, line(s, cut), cut, fused[5].id, { beats: 3, beatType: 4 }, 'next')!;
		expect(m[fused[4].id]).toMatchObject({ barline: 'before', timeSignature: { beats: 3, beatType: 4 } });
	});

	it('a mark on a deleted opener is found for the bar, and a new one replaces it', async () => {
		const s = await load('time-signature-wrong');
		const bar2 = inBar(s.vocalLine, 2);
		let m = set(s, {}, bar2[0].id, 3, 4, 'next');
		m = withCorrection(m, bar2[0].id, { deleted: true });
		const h = heldBar(s, line(s, m), m, bar2[1].id)!;
		expect(h.mine).toEqual({ beats: 3, beatType: 4, through: 'next' });
		expect(h.openerId).toBe(bar2[1].id);
		const next = setSignature(s, line(s, m), m, bar2[1].id, { beats: 2, beatType: 4 }, 'next')!;
		expect(next[bar2[0].id].timeSignature).toBeUndefined();
		expect(next[bar2[1].id].timeSignature).toEqual({ beats: 2, beatType: 4, through: 'next' });
	});
});
