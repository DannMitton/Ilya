import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser, type ParsedScore, type VocalLineEvent } from '@ilya/score-parser';
import { parseXml } from './ingestion/mini-dom';
import { applyCorrections, withCorrection, type CorrectionMap } from './correction';
import { measureFill } from './entry';
import { hasLayerMarks, rebar } from './rebar';

/* The layer's arithmetic, on the synthetic fixtures of `omr/fixtures/` (QUEUE row 138, B0 and B1).
   Bars are read the way the page reads them: `MusicXmlScoreParser` on the kept bytes. */

async function load(name: string, edit: (xml: string) => string = (x) => x): Promise<ParsedScore> {
	const xml = edit(readFileSync(new URL(`../omr/fixtures/${name}.musicxml`, import.meta.url), 'utf8'));
	const { score } = await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: `${name}.musicxml` });
	return score;
}

const inBar = (line: VocalLineEvent[], bar: number) => line.filter((e) => e.measureIndex === bar);
const fills = (s: ParsedScore, line: VocalLineEvent[]) =>
	s.measures.map((m) => measureFill(line, m.index, m.timeSignature));

describe('rebar, no marks', () => {
	it('returns the inputs untouched', async () => {
		const score = await load('barline-fused');
		const r = rebar(score, score.vocalLine, {});
		expect(r.applied).toBe(false);
		expect(r.score).toBe(score);
		expect(r.line).toBe(score.vocalLine);
		expect(r.bars.identity).toBe(true);
	});
	it('a map with only note corrections is the same', async () => {
		const score = await load('barline-fused');
		const map = withCorrection({}, score.vocalLine[0].id, { dots: 1 });
		const line = applyCorrections(score.vocalLine, map);
		const r = rebar(score, line, map);
		expect(r.applied).toBe(false);
		expect(r.line).toBe(line);
		expect(hasLayerMarks(map)).toBe(false);
	});
});

describe('a barline added', () => {
	it('divides the fused bar: eight bars, every one adds up, ids unchanged, onsets from the downbeat', async () => {
		const s = await load('barline-fused');
		const fused = inBar(s.vocalLine, 3);
		const opener = fused[4];
		const map: CorrectionMap = withCorrection({}, opener.id, { barline: 'before' });
		const line = applyCorrections(s.vocalLine, map);
		const r = rebar(s, line, map);
		expect(r.applied).toBe(true);
		expect(r.score.measures).toHaveLength(8);
		expect(r.score.measures.map((m) => m.index)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
		expect(r.score.measures.map((m) => m.number)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);
		expect(fills(r.score, r.line).every((f) => f === null)).toBe(true);
		expect(r.line.map((e) => e.id)).toEqual(s.vocalLine.map((e) => e.id));
		expect(inBar(r.line, 4)[0].id).toBe(opener.id);
		expect(inBar(r.line, 4)[0].rhythmicPosition.fraction).toEqual({ numerator: 0, denominator: 1 });
		expect(inBar(r.line, 3).map((e) => e.rhythmicPosition.fraction.numerator / e.rhythmicPosition.fraction.denominator)).toEqual([0, 0.25, 0.5, 0.75]);
		// the bars after the split are renumbered by the shift
		expect(r.line.filter((e) => e.measureIndex === 7).map((e) => e.id)).toEqual(inBar(s.vocalLine, 6).map((e) => e.id));
		expect(r.bars.identity).toBe(false);
		expect(r.bars.toSong(3)).toBe(3);
		expect(r.bars.toSong(4)).toBe(5);
		expect(r.bars.toReading(4)).toBe(3);
		expect(r.bars.toReading(5)).toBe(4);
	});
	it('on the first entry of a bar is already a barline and changes nothing', async () => {
		const s = await load('barline-clean-4-4');
		const first = inBar(s.vocalLine, 2)[0];
		const map = withCorrection({}, first.id, { barline: 'before' });
		const r = rebar(s, applyCorrections(s.vocalLine, map), map);
		expect(r.score.measures).toHaveLength(8);
		expect(r.line.map((e) => e.measureIndex)).toEqual(s.vocalLine.map((e) => e.measureIndex));
	});
	it('a bar that still does not add up keeps its flag', async () => {
		const s = await load('barline-fused-rest-dropped');
		const fused = inBar(s.vocalLine, 3);
		const map = withCorrection({}, fused[4].id, { barline: 'before' });
		const r = rebar(s, applyCorrections(s.vocalLine, map), map);
		const f = fills(r.score, r.line);
		expect(f[3]).toBeNull();
		expect(f[4]).toEqual({ actual: 3, expected: 4 });
	});
});

describe('a barline removed', () => {
	it('joins two bars: the merged bar keeps the first bar and reads over', async () => {
		const s = await load('barline-clean-4-4');
		const opener = inBar(s.vocalLine, 4)[0];
		const map = withCorrection({}, opener.id, { barline: 'none' });
		const r = rebar(s, applyCorrections(s.vocalLine, map), map);
		expect(r.score.measures).toHaveLength(7);
		expect(fills(r.score, r.line)[3]).toEqual({ actual: 8, expected: 4 });
		const joined = inBar(r.line, 3);
		expect(joined).toHaveLength(8);
		// the second half's onsets continue from the first half's end
		const last = joined[joined.length - 1].rhythmicPosition.fraction;
		expect(last).toEqual({ numerator: 7, denominator: 4 });
		expect(r.bars.toSong(4)).toBe(3);
		expect(r.bars.toSong(5)).toBe(4);
	});
	it('is refused where the second bar opens a change of time signature', async () => {
		const s = await load('barline-clean-4-4', (x) => x.replace('<measure number="5">', '<measure number="5"><attributes><time><beats>3</beats><beat-type>4</beat-type></time></attributes>'));
		const opener = inBar(s.vocalLine, 4)[0];
		const map = withCorrection({}, opener.id, { barline: 'none' });
		const r = rebar(s, applyCorrections(s.vocalLine, map), map);
		expect(r.score.measures).toHaveLength(8);
	});
	it('is refused where the first bar ends a repeat', async () => {
		const s = await load('barline-clean-4-4');
		s.measures[3].repeatEnd = true;
		const opener = inBar(s.vocalLine, 4)[0];
		const map = withCorrection({}, opener.id, { barline: 'none' });
		expect(rebar(s, applyCorrections(s.vocalLine, map), map).score.measures).toHaveLength(8);
	});
});

describe('a mark on a deleted note', () => {
	it('is carried to the next entry standing', async () => {
		const s = await load('barline-fused');
		const opener = inBar(s.vocalLine, 3)[4];
		const next = inBar(s.vocalLine, 3)[5];
		let map = withCorrection({}, opener.id, { barline: 'before' });
		map = withCorrection(map, opener.id, { deleted: true });
		const line = applyCorrections(s.vocalLine, map);
		expect(line.some((e) => e.id === opener.id)).toBe(false);
		const r = rebar(s, line, map);
		expect(r.score.measures).toHaveLength(8);
		expect(inBar(r.line, 4)[0].id).toBe(next.id);
	});
});

describe('repeat flags and the lists keyed by bar follow a division', () => {
	it('the first half keeps repeatStart, the last half keeps repeatEnd and repeatTimes', async () => {
		const s = await load('barline-fused');
		s.measures[3].repeatStart = true;
		s.measures[3].repeatEnd = true;
		s.measures[3].repeatTimes = 3;
		const opener = inBar(s.vocalLine, 3)[4];
		const map = withCorrection({}, opener.id, { barline: 'before' });
		const m = rebar(s, applyCorrections(s.vocalLine, map), map).score.measures;
		expect(m[3]).toMatchObject({ repeatStart: true });
		expect(m[3].repeatEnd).toBeUndefined();
		expect(m[4]).toMatchObject({ repeatEnd: true, repeatTimes: 3 });
		expect(m[4].repeatStart).toBeUndefined();
	});
	it('a key change, a tempo, and a tempo word after the division are re-indexed', async () => {
		const s = await load('barline-fused');
		s.keySignatures.push({ measureIndex: 5, signature: { fifths: 1 } });
		s.tempoMarkings.push({ measureIndex: 3, rhythmicPosition: { fraction: { numerator: 3, denominator: 4 } }, bpm: 90, beatUnit: 'quarter', beatUnitDots: 0 });
		s.tempoMarkings.push({ measureIndex: 3, rhythmicPosition: { fraction: { numerator: 5, denominator: 4 } }, bpm: 60, beatUnit: 'quarter', beatUnitDots: 0 });
		const opener = inBar(s.vocalLine, 3)[4];
		const map = withCorrection({}, opener.id, { barline: 'before' });
		const r = rebar(s, applyCorrections(s.vocalLine, map), map).score;
		expect(r.keySignatures.find((k) => k.signature.fifths === 1)?.measureIndex).toBe(6);
		expect(r.tempoMarkings[0]).toMatchObject({ measureIndex: 3, rhythmicPosition: { fraction: { numerator: 3, denominator: 4 } } });
		expect(r.tempoMarkings[1]).toMatchObject({ measureIndex: 4, rhythmicPosition: { fraction: { numerator: 1, denominator: 4 } } });
	});
});

describe('a time signature change', () => {
	const mark = (beats: number, beatType: number, through: 'next' | 'end') => ({ beats, beatType, through });

	it('4/8 to 3/4 keeping the barlines: every bar adds up', async () => {
		const s = await load('time-signature-wrong');
		const first = s.vocalLine[0];
		const map = withCorrection({}, first.id, { timeSignature: mark(3, 4, 'end') });
		const r = rebar(s, applyCorrections(s.vocalLine, map), map);
		expect(r.applied).toBe(true);
		expect(r.score.measures.every((m) => m.timeSignature.beats === 3 && m.timeSignature.beatType === 4)).toBe(true);
		expect(r.score.measures[0].expectedDuration).toEqual({ numerator: 3, denominator: 4 });
		expect(fills(r.score, r.line).every((f) => f === null)).toBe(true);
		expect(r.score.timeSignatures).toEqual([{ measureIndex: 0, signature: { beats: 3, beatType: 4 } }]);
		expect(r.bars.identity).toBe(false);
		expect(r.bars.toSong(5)).toBe(5);
	});
	it('"to the next change" stops at the reading\'s own next change; "to the end" overrides it', async () => {
		const edit = (x: string) => x.replace('<measure number="5">', '<measure number="5"><attributes><time><beats>2</beats><beat-type>4</beat-type></time></attributes>');
		const s = await load('time-signature-wrong', edit);
		const first = s.vocalLine[0];
		const mapNext = withCorrection({}, first.id, { timeSignature: mark(3, 4, 'next') });
		const rn = rebar(s, applyCorrections(s.vocalLine, mapNext), mapNext).score.measures;
		expect(rn.slice(0, 4).every((m) => m.timeSignature.beatType === 4 && m.timeSignature.beats === 3)).toBe(true);
		expect(rn[4].timeSignature).toMatchObject({ beats: 2, beatType: 4 });
		const mapEnd = withCorrection({}, first.id, { timeSignature: mark(3, 4, 'end') });
		const re = rebar(s, applyCorrections(s.vocalLine, mapEnd), mapEnd).score.measures;
		expect(re.every((m) => m.timeSignature.beats === 3 && m.timeSignature.beatType === 4)).toBe(true);
	});
	it('a later change of her own bounds an earlier one', async () => {
		const s = await load('time-signature-wrong');
		const bar2 = inBar(s.vocalLine, 2)[0];
		let map = withCorrection({}, s.vocalLine[0].id, { timeSignature: mark(3, 4, 'end') });
		map = withCorrection(map, bar2.id, { timeSignature: mark(6, 8, 'next') });
		const m = rebar(s, applyCorrections(s.vocalLine, map), map).score.measures;
		expect(m[1].timeSignature).toMatchObject({ beats: 3, beatType: 4 });
		expect(m[2].timeSignature).toMatchObject({ beats: 6, beatType: 8 });
		expect(m[3].timeSignature).toMatchObject({ beats: 6, beatType: 8 });
	});
	it('the signature on a deleted opener is carried', async () => {
		const s = await load('time-signature-wrong');
		const bar2 = inBar(s.vocalLine, 2);
		let map = withCorrection({}, bar2[0].id, { timeSignature: mark(3, 4, 'end') });
		map = withCorrection(map, bar2[0].id, { deleted: true });
		const m = rebar(s, applyCorrections(s.vocalLine, map), map).score.measures;
		expect(m[1].timeSignature).toMatchObject({ beats: 4, beatType: 8 });
		expect(m[2].timeSignature).toMatchObject({ beats: 3, beatType: 4 });
	});
});
