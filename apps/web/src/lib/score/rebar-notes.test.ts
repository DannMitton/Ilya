import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser, type Fraction, type ParsedScore, type VocalLineEvent } from '@ilya/score-parser';
import { parseXml } from './ingestion/mini-dom';
import { applyCorrections, withCorrection, type CorrectionMap } from './correction';
import { canTie, isEnteredId, measureFill } from './entry';
import { rebar } from './rebar';
import { syllableTargetIds } from './pairings';
import { notatable, rebarNotes, rebarNotesInForce } from './rebar-notes';
import { setSignature } from './time-signature';

async function load(name: string, edit: (xml: string) => string = (x) => x): Promise<ParsedScore> {
	const xml = edit(readFileSync(new URL(`../omr/fixtures/${name}.musicxml`, import.meta.url), 'utf8'));
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: `${name}.musicxml` })).score;
}
const inBar = (line: VocalLineEvent[], bar: number) => line.filter((e) => e.measureIndex === bar);
const pre = (s: ParsedScore, m: CorrectionMap) => applyCorrections(s.vocalLine, m);
const total = (line: VocalLineEvent[]) => line.reduce((n, e) => n + e.duration.fraction.numerator / e.duration.fraction.denominator, 0);
const fills = (s: ParsedScore, m: CorrectionMap) => {
	const r = rebar(s, pre(s, m), m);
	return r.score.measures.map((x) => measureFill(r.line, x.index, x.timeSignature));
};
const f = (n: number, d: number): Fraction => ({ numerator: n, denominator: d });

/**
 * The fixture at 6 divisions to the quarter (a triplet quarter is then a whole number of divisions), with notes `from` onward of measure `measure`
 * replaced by quarter-note triplets of the given steps: `<time-modification>` 3 in the time of 2, each 1/6 of a whole note. The notes it replaces
 * must add up to the same length (two quarters, or one half), so the song is as long as before.
 */
function triplet(xml: string, measure: number, from: number, steps: string[]): string {
	const scaled = xml.replace('<divisions>2</divisions>', '<divisions>6</divisions>').replace(/<duration>(\d+)<\/duration>/g, (_, n) => `<duration>${Number(n) * 3}</duration>`);
	const note = (step: string) =>
		`<note><pitch><step>${step}</step><octave>4</octave></pitch><duration>4</duration><voice>1</voice><type>quarter</type><time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes></time-modification></note>`;
	return scaled.replace(new RegExp(`(<measure number="${measure}">)([\\s\\S]*?)(</measure>)`), (_all, open: string, body: string, close: string) => {
		const notes = body.match(/<note>[\s\S]*?<\/note>/g)!;
		const replaced = from === 0 ? 2 : 1;
		return open + [...notes.slice(0, from), ...steps.map(note), ...notes.slice(from + replaced)].join('\n') + close;
	});
}

describe('notatable lengths', () => {
	it('a length is one value where one holds it, a chain where not, and null below the 64th', () => {
		expect(notatable(f(3, 4))).toEqual([{ base: 'half', dots: 1 }]);
		expect(notatable(f(5, 16))).toEqual([{ base: 'quarter', dots: 0 }, { base: '16th', dots: 0 }]);
		expect(notatable(f(7, 8))).toEqual([{ base: 'half', dots: 2 }]);
		expect(notatable(f(3, 2))).toEqual([{ base: 'whole', dots: 1 }]);
		expect(notatable(f(5, 4))).toEqual([{ base: 'whole', dots: 0 }, { base: 'quarter', dots: 0 }]);
		expect(notatable(f(1, 128))).toBeNull();
	});
});

describe('Rebar the notes (QUEUE row 138, T2)', () => {
	it('a 3/4 song laid out in bars of four, rebarred to 3/4 to the end: eight bars that add up, with four notes tied across a new barline', async () => {
		const s = await load('time-signature-barlines-wrong');
		expect(s.measures).toHaveLength(6);
		const map = rebarNotes(s, s.vocalLine, {}, s.vocalLine[0].id, { beats: 3, beatType: 4 }, 'end')!;
		expect(map).not.toBeNull();
		const r = rebar(s, pre(s, map), map);
		expect(r.score.measures).toHaveLength(8);
		expect(fills(s, map)).toEqual(Array(8).fill(null));
		// the music is the same music: every read note is still there, no note was lost, and the total length did not change
		for (const e of s.vocalLine) expect(r.line.some((x) => x.id === e.id)).toBe(true);
		expect(total(r.line)).toBeCloseTo(total(s.vocalLine), 10);
		// four notes crossed a boundary (2-4, 8-10, 14-16, 20-22 in quarters): four entered remainders, each tied from the part before and the same pitch
		const entered = Object.keys(map).filter(isEnteredId);
		expect(entered).toHaveLength(4);
		const line = r.line;
		for (const id of entered) {
			const i = line.findIndex((e) => e.id === id);
			expect(line[i - 1].tied?.type).toBe('start');
			expect(canTie(line, map, line[i - 1].id)).toBe(true);
			expect(line[i].pitch).toEqual(line[i - 1].pitch);
			// the remainder opens the bar it falls in
			expect(line[i].rhythmicPosition.fraction).toEqual(f(0, 1));
		}
	});

	it('does not touch the input, and leaves the first bar\'s own opener alone', async () => {
		const s = await load('time-signature-barlines-wrong');
		const input: CorrectionMap = {};
		rebarNotes(s, s.vocalLine, input, s.vocalLine[0].id, { beats: 3, beatType: 4 }, 'end');
		expect(input).toEqual({});
	});

	it('replaces the barlines in its scope, hers included, and Undo (the snapshot) restores them', async () => {
		const s = await load('time-signature-barlines-wrong');
		const hers = withCorrection({}, inBar(s.vocalLine, 1)[1].id, { barline: 'before' });
		const map = rebarNotes(s, pre(s, hers), hers, s.vocalLine[0].id, { beats: 3, beatType: 4 }, 'end')!;
		expect(fills(s, map)).toEqual(Array(8).fill(null));
		// the old snapshot is untouched: that is the whole of "Undo restores them"
		expect(hers).toEqual({ [inBar(s.vocalLine, 1)[1].id]: { barline: 'before' } });
	});

	it('a rest that crosses is split with no tie', async () => {
		const s = await load('time-signature-barlines-wrong');
		const rest = withCorrection({}, inBar(s.vocalLine, 0)[1].id, { type: 'rest' });
		const map = rebarNotes(s, pre(s, rest), rest, s.vocalLine[0].id, { beats: 3, beatType: 4 }, 'end')!;
		const entered = Object.entries(map).filter(([id]) => isEnteredId(id));
		const crossing = entered.find(([, c]) => c.entered?.after === inBar(s.vocalLine, 0)[1].id)!;
		expect(crossing[1].type).toBe('rest');
		expect(crossing[1].tied).toBeUndefined();
		expect(map[inBar(s.vocalLine, 0)[1].id].tied).toBeUndefined();
	});

	it('a real quarter-note triplet that fits whole into its new bar: eight bars add up, no member is re-valued or split, and the syllable seats are unchanged', async () => {
		// bar 2's two quarters become a triplet of three (3 in the time of 2: 1/6 each, 1/2 in all), so the length of the song is unchanged
		const s = await load('time-signature-barlines-wrong', (x) => triplet(x, 2, 0, ['A', 'G', 'A']));
		const group = s.vocalLine.filter((e) => e.duration.tuplet);
		expect(group).toHaveLength(3);
		expect(group.map((e) => e.duration.fraction)).toEqual([f(1, 6), f(1, 6), f(1, 6)]);
		const map = rebarNotes(s, s.vocalLine, {}, s.vocalLine[0].id, { beats: 3, beatType: 4 }, 'end')!;
		expect(map).not.toBeNull();
		const r = rebar(s, pre(s, map), map);
		expect(r.score.measures).toHaveLength(8);
		expect(fills(s, map)).toEqual(Array(8).fill(null));
		expect(total(r.line)).toBeCloseTo(total(s.vocalLine), 10);
		// a member may lose the reading's barline before it (it sits mid-bar now), and nothing else: no length, no tie, no entered remainder
		for (const g of group) expect(Object.keys(map[g.id] ?? {}).filter((k) => k !== 'barline')).toEqual([]);
		expect(Object.keys(map).filter((id) => isEnteredId(id) && map[id].entered?.after && group.some((g) => g.id === map[id].entered!.after))).toEqual([]);
		// one vowel per note (CONTRACT §0.1): the notes that take a syllable are the same notes, in the same order
		expect(syllableTargetIds(r.line)).toEqual(syllableTargetIds(s.vocalLine));
	});

	it('a triplet that would cross a new barline is never split: its bar stays as it is, flagged, its entries carry no record, and the rebar goes on after it', async () => {
		// bar 4's second half note becomes a triplet (quarters 14 to 16); a 3/4 barline falls at quarter 15, inside it
		const s = await load('time-signature-barlines-wrong', (x) => triplet(x, 4, 1, ['E', 'F', 'E']));
		const group = s.vocalLine.filter((e) => e.duration.tuplet).map((e) => e.id);
		expect(group).toHaveLength(3);
		const map = rebarNotes(s, s.vocalLine, {}, s.vocalLine[0].id, { beats: 3, beatType: 4 }, 'end')!;
		expect(map).not.toBeNull();
		const r = rebar(s, pre(s, map), map);
		const fl = fills(s, map);
		// the four bars before the group add up; the bar that holds the group is the half note and the group, four quarters in a bar of three
		expect(fl.slice(0, 4)).toEqual([null, null, null, null]);
		expect(fl[4]).toEqual({ actual: 4, expected: 3 });
		// the group is whole, in one bar, with no record of ours
		expect(new Set(r.line.filter((e) => group.includes(e.id)).map((e) => e.measureIndex)).size).toBe(1);
		expect(Object.keys(map).filter((id) => group.includes(id))).toEqual([]);
		// after the group the fill starts again, so the rest of the song is rebarred: two bars add up, the last holds what is left
		expect(fl.slice(5, 7)).toEqual([null, null]);
		expect(fl).toHaveLength(8);
		expect(total(r.line)).toBeCloseTo(total(s.vocalLine), 10);
		expect(syllableTargetIds(r.line)).toEqual(syllableTargetIds(s.vocalLine));
	});

	it('a rebar that cannot be done (a crossing piece shorter than a 64th) still applies the signature and keeps the barlines: it is what setSignature writes', async () => {
		// one lone triplet quarter (1/6) in place of bar 2's two quarters: the fill is then off by a sixth, so a later note crosses a barline with a remainder no note value holds
		const s = await load('time-signature-barlines-wrong', (x) => triplet(x, 2, 0, ['A']));
		expect(s.vocalLine.filter((e) => e.duration.tuplet)).toHaveLength(1);
		const sig = { beats: 3, beatType: 4 };
		const held = s.vocalLine[0].id;
		const only = setSignature(s, s.vocalLine, {}, held, sig, 'end')!;
		expect(only).not.toBeNull();
		const map = rebarNotes(s, s.vocalLine, {}, held, sig, 'end');
		expect(map).toEqual(only);
		// the signature is there, and no rebar was written: no entered remainder, no barline mark
		expect(map![held].timeSignature).toMatchObject({ beats: 3, beatType: 4, through: 'end' });
		expect(Object.keys(map!).filter(isEnteredId)).toEqual([]);
		expect(Object.values(map!).some((c) => c.barline !== undefined)).toBe(false);
	});

	it('"to the next change" ends at the reading\'s own next change of signature, and the bars after it keep theirs', async () => {
		const s = await load('time-signature-barlines-wrong', (x) => x.replace('<measure number="4">', '<measure number="4"><attributes><time><beats>2</beats><beat-type>4</beat-type></time></attributes>'));
		const map = rebarNotes(s, s.vocalLine, {}, s.vocalLine[0].id, { beats: 3, beatType: 4 }, 'next')!;
		const r = rebar(s, pre(s, map), map);
		expect(fills(s, map).slice(0, 4)).toEqual([null, null, null, null]);
		expect(r.score.measures.slice(0, 4).every((m) => m.timeSignature.beats === 3 && m.timeSignature.beatType === 4)).toBe(true);
		expect(r.score.measures[4].timeSignature).toMatchObject({ beats: 2, beatType: 4 });
		// the bars after the change are the reading's own, untouched
		expect(Object.keys(map).filter((id) => s.vocalLine.filter((e) => e.measureIndex >= 3).some((e) => e.id === id))).toEqual([]);
	});

	it('"to the end of the song" goes to the end across the reading\'s own change of signature: 2/4 stated at measure 4, eight bars that add up', async () => {
		const s = await load('time-signature-barlines-wrong', (x) => x.replace('<measure number="4">', '<measure number="4"><attributes><time><beats>2</beats><beat-type>4</beat-type></time></attributes>'));
		const map = rebarNotes(s, s.vocalLine, {}, s.vocalLine[0].id, { beats: 3, beatType: 4 }, 'end')!;
		const r = rebar(s, pre(s, map), map);
		expect(r.score.measures).toHaveLength(8);
		expect(r.score.measures.every((m) => m.timeSignature.beats === 3 && m.timeSignature.beatType === 4)).toBe(true);
		expect(fills(s, map)).toEqual(Array(8).fill(null));
		expect(syllableTargetIds(r.line)).toEqual(syllableTargetIds(s.vocalLine));
	});

	it('"to the next change" does not stop at a key change: the fill goes on, eight bars that add up', async () => {
		const s = await load('time-signature-barlines-wrong', (x) => x.replace('<measure number="4">', '<measure number="4"><attributes><key><fifths>1</fifths></key></attributes>'));
		const map = rebarNotes(s, s.vocalLine, {}, s.vocalLine[0].id, { beats: 3, beatType: 4 }, 'next')!;
		const r = rebar(s, pre(s, map), map);
		expect(r.score.measures).toHaveLength(8);
		expect(fills(s, map)).toEqual(Array(8).fill(null));
		expect(syllableTargetIds(r.line)).toEqual(syllableTargetIds(s.vocalLine));
	});

	it('a key change mid-bar of the new signature keeps its barline: the bar before it is short and flagged, no mark is written after it, and the bars after it add up', async () => {
		// the key change opens read bar 3 at quarter 8, inside the new bar that runs from quarter 6 to 9
		const s = await load('time-signature-barlines-wrong', (x) => x.replace('<measure number="3">', '<measure number="3"><attributes><key><fifths>1</fifths></key></attributes>'));
		const map = rebarNotes(s, s.vocalLine, {}, s.vocalLine[0].id, { beats: 3, beatType: 4 }, 'next')!;
		const fl = fills(s, map);
		// bars: [0,3) [3,6) [6,8) [8,11) [11,14) [14,17) [17,20) [20,23) [23,24): the third and the last are short
		expect(fl).toEqual([null, null, { actual: 2, expected: 3 }, null, null, null, null, null, { actual: 1, expected: 3 }]);
		const opener = inBar(s.vocalLine, 2)[0].id;
		expect(map[opener]?.barline).toBeUndefined();
		const r = rebar(s, pre(s, map), map);
		expect(r.line.find((e) => e.id === opener)!.rhythmicPosition.fraction).toEqual(f(0, 1));
		expect(syllableTargetIds(r.line)).toEqual(syllableTargetIds(s.vocalLine));
	});

	it('a later signature of hers ends the fill "to the next change"; "to the end" takes her later signature away first (`setSignature`) and runs on', async () => {
		const s = await load('time-signature-barlines-wrong');
		const later = inBar(s.vocalLine, 3)[0].id;
		const hers = setSignature(s, s.vocalLine, {}, later, { beats: 2, beatType: 4 }, 'end')!;
		const laterIds = s.vocalLine.filter((e) => e.measureIndex >= 3).map((e) => e.id);
		// to the next change: four bars of three before her 2/4 at quarter 12, and everything from her 2/4 on is left as it was
		const next = rebarNotes(s, pre(s, hers), hers, s.vocalLine[0].id, { beats: 3, beatType: 4 }, 'next')!;
		const rn = rebar(s, pre(s, next), next);
		expect(fills(s, next).slice(0, 4)).toEqual([null, null, null, null]);
		expect(rn.score.measures[4].timeSignature).toMatchObject({ beats: 2, beatType: 4 });
		expect(Object.keys(next).filter((id) => laterIds.includes(id))).toEqual(Object.keys(hers).filter((id) => laterIds.includes(id)));
		// to the end: her later signature is gone and all eight bars are of three
		const end = rebarNotes(s, pre(s, hers), hers, s.vocalLine[0].id, { beats: 3, beatType: 4 }, 'end')!;
		expect(end[later]?.timeSignature).toBeUndefined();
		expect(fills(s, end)).toEqual(Array(8).fill(null));
	});

	it('Rebar again with the signature already in force fills from the held bar to the next change, after a length was fixed inside the scope', async () => {
		const s = await load('time-signature-barlines-wrong');
		const once = rebarNotes(s, s.vocalLine, {}, s.vocalLine[0].id, { beats: 3, beatType: 4 }, 'end')!;
		// she fixes a misread length inside the scope: the half note that opens read bar 4 becomes a quarter, so every later barline is off by one quarter
		const target = inBar(s.vocalLine, 3)[0].id;
		const fixed = withCorrection(once, target, { base: 'quarter', dots: 0 });
		expect(fills(s, fixed).some((x) => x !== null)).toBe(true);
		const again = rebarNotesInForce(s, pre(s, fixed), fixed, s.vocalLine[0].id)!;
		expect(again).not.toBeNull();
		const ok = fills(s, again);
		// every bar but the last that holds the shortened remainder adds up; the music is one quarter shorter and nothing was invented
		expect(ok.slice(0, ok.length - 1).every((x) => x === null)).toBe(true);
	});

	it('refuses a pair that is not a time signature, and an entry that is not there', async () => {
		const s = await load('time-signature-barlines-wrong');
		expect(rebarNotes(s, s.vocalLine, {}, s.vocalLine[0].id, { beats: 3, beatType: 5 }, 'end')).toBeNull();
		expect(rebarNotes(s, s.vocalLine, {}, 'nope', { beats: 3, beatType: 4 }, 'end')).toBeNull();
	});
});
