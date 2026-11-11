/**
 * A note entered mid-bar after a rebar or a join lands where the singer put it (lane 47, Fable's amendment 1). A song bar that spans a reading
 * barline (every bar "Rebar the notes" fills across one, and every bar joined by Remove barline) must not rewrite the gap's bar as the reading
 * bar the song bar BEGINS in: that filed the note under the wrong bar and drew it before its anchor, in one probe at onset −3/4.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser, type ParsedScore, type VocalLineEvent } from '@ilya/score-parser';
import { parseXml } from './ingestion/mini-dom';
import { applyCorrections, type CorrectionMap } from './correction';
import { CorrectionVerbs } from './correction-verbs.svelte';
import { barlineVerb } from './barline-marks';
import type { Cursor } from './entry';
import { rebar } from './rebar';
import { rebarNotes } from './rebar-notes';

async function load(name: string): Promise<ParsedScore> {
	const xml = readFileSync(new URL(`../omr/fixtures/${name}.musicxml`, import.meta.url), 'utf8');
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: `${name}.musicxml` })).score;
}
const inBar = (line: VocalLineEvent[], bar: number) => line.filter((e) => e.measureIndex === bar);
const num = (e: VocalLineEvent) => e.rhythmicPosition.fraction.numerator / e.rhythmicPosition.fraction.denominator;

/** Enter a quarter in the gap after `after`, in song bar `songBar`, through the verbs with the layer's own line and bar map. */
function enterAfter(s: ParsedScore, map: CorrectionMap, after: string, songBar: number): { entered: string; line: VocalLineEvent[]; map: CorrectionMap } {
	const r = rebar(s, applyCorrections(s.vocalLine, map), map);
	let corrections = map;
	let cursor: Cursor | null = { kind: 'gap', after, measureIndex: songBar };
	const verbs = new CorrectionVerbs({
		corrections: () => corrections, setCorrections: (n) => (corrections = n), line: () => r.line, readLine: () => s.vocalLine,
		cursor: () => cursor, inGap: () => cursor?.kind === 'gap', selectedEventId: () => (cursor?.kind === 'entry' ? cursor.id : null),
		setCursor: (n) => (cursor = n), selectEntry: () => {}, keyOf: () => undefined, clef: () => ({ sign: 'G' }), label: () => '', word: (k) => k,
		pushUndo: () => {}, bars: () => r.bars,
	});
	verbs.handleDurationCell('quarter');
	const now = (): Cursor | null => cursor;
	const at = now();
	const entered = at && at.kind === 'entry' ? at.id : '';
	const after2 = rebar(s, applyCorrections(s.vocalLine, corrections), corrections);
	return { entered, line: after2.line, map: corrections };
}

describe('an entry after a rebar or a join (lane 47, amendment 1)', () => {
	it('a quarter entered mid-bar after a 3/4 rebar lands at onset 1/2 after its anchor, not at −3/4', async () => {
		const s = await load('time-signature-barlines-wrong');
		const map = rebarNotes(s, s.vocalLine, {}, s.vocalLine[0].id, { beats: 3, beatType: 4 }, 'end')!;
		const r = rebar(s, applyCorrections(s.vocalLine, map), map);
		// song bar 1 begins in reading bar 0 (the tied remainder) and holds m1-0-1, which is read bar 1's: the bar spans a reading barline
		const anchor = r.line.find((e) => e.id === 'm1-0-1')!;
		expect(anchor.measureIndex).toBe(1);
		expect(r.bars.toReading(1)).toBe(0); // the reading bar the song bar BEGINS in, not the anchor's (1)
		const out = enterAfter(s, map, 'm1-0-1', anchor.measureIndex);
		const i = out.line.findIndex((e) => e.id === out.entered);
		expect(out.line[i - 1].id).toBe('m1-0-1');
		expect(num(out.line[i])).toBeCloseTo(1 / 2, 10);
		expect(out.line[i].measureIndex).toBe(out.line[i - 1].measureIndex);
		expect(num(out.line[i])).toBeGreaterThan(num(out.line[i - 1]));
	});

	it('the same after a Remove-barline join: the note lands directly after its anchor in the joined bar', async () => {
		const s = await load('barline-clean-4-4');
		const v = barlineVerb(s, s.vocalLine, {}, inBar(s.vocalLine, 0)[3].id)!;
		expect(v.kind).toBe('remove');
		const joined = rebar(s, applyCorrections(s.vocalLine, v.map), v.map);
		const anchorId = inBar(s.vocalLine, 1)[0].id;
		const anchor = joined.line.find((e) => e.id === anchorId)!;
		expect(anchor.measureIndex).toBe(0); // the joined bar holds both reading bars
		const out = enterAfter(s, v.map, anchorId, anchor.measureIndex);
		const i = out.line.findIndex((e) => e.id === out.entered);
		expect(out.line[i - 1].id).toBe(anchorId);
		expect(out.line[i].measureIndex).toBe(0);
		expect(num(out.line[i])).toBeCloseTo(num(anchor) + anchor.duration.fraction.numerator / anchor.duration.fraction.denominator, 10);
	});

	it('at the head caret of a bar the singer made, the bar is still converted to the reading\'s (B5 is unchanged)', async () => {
		const s = await load('time-signature-barlines-wrong');
		const map = rebarNotes(s, s.vocalLine, {}, s.vocalLine[0].id, { beats: 3, beatType: 4 }, 'end')!;
		const r = rebar(s, applyCorrections(s.vocalLine, map), map);
		// the head gap of song bar 2: anchored to the last entry of song bar 1, which is in song bar 1, so the bar is converted
		const last = inBar(r.line, 1).at(-1)!;
		const out = enterAfter(s, map, last.id, 2);
		const e = out.map[out.entered];
		expect(e.entered?.after).toBe(last.id);
		expect(e.entered?.measureIndex).toBe(r.bars.toReading(2));
	});
});
