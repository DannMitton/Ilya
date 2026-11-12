/**
 * N.192 step 6b: the key signature card's arithmetic, on `key-changes.musicxml` (D major bars 1 to 4, F major bars 5 to 8, D major bars 9 and 10,
 * A major bars 11 and 12; one lyric per note). Bar indices below are 0-based.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { engraveInKey, MusicXmlScoreParser, type ParsedScore } from '@ilya/score-parser';
import { parseXml } from './ingestion/mini-dom';
import { BarLayer } from './bar-layer';
import { withCorrection, type CorrectionMap } from './correction';
import { applyKeyLayer, heldKey, removeKey, setKey } from './key-signature';

async function fixture(): Promise<ParsedScore> {
	const xml = readFileSync(new URL('../../../../../packages/score-parser/src/fixtures/key-changes.musicxml', import.meta.url), 'utf8');
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: 'key-changes.musicxml' })).score;
}
const fifths = (s: ParsedScore): number[] => s.measures.map((m) => m.keySignature.fifths);
const inBar = (s: ParsedScore, line: ParsedScore['vocalLine'], bar: number) => line.filter((e) => e.measureIndex === bar && s);
const opener = (s: ParsedScore, bar: number): string => s.vocalLine.find((e) => e.measureIndex === bar)!.id;
const layer = (s: ParsedScore, map: CorrectionMap) => new BarLayer({ score: () => s, corrections: () => map });

describe('with no key mark', () => {
	it('returns the same objects', async () => {
		const s = await fixture();
		const r = applyKeyLayer(s, s.vocalLine, {});
		expect(r.score).toBe(s);
		expect(r.line).toBe(s.vocalLine);
		expect(layer(s, {}).score).toBe(s);
	});
});

describe("'follow': the notes take the new key", () => {
	// The scan misread bar 5 on: the print is D major throughout, the reader applied F major to bars 5 to 8.
	const mark = { fifths: 2, through: 'next' as const, notes: 'follow' as const };
	it('sets every bar in scope to the new key and stops at the next change of the reading', async () => {
		const s = await fixture();
		const l = layer(s, { [opener(s, 4)]: { keySignature: mark } });
		expect(fifths(l.score!)).toEqual([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3]);
		expect(l.score!.keySignatures.map((k) => [k.measureIndex, k.signature.fifths])).toEqual([[0, 2], [10, 3]]);
	});
	it('re-spells exactly the notes on the old key\'s altered letters, and no other', async () => {
		const s = await fixture();
		const l = layer(s, { [opener(s, 4)]: { keySignature: mark } });
		const pitch = (id: string) => l.line.find((e) => e.id === id)!.pitch!;
		// bar 5: F natural and B flat sat in F major. In D major they are F sharp and B natural. A and G stay.
		expect(pitch('m4-0-1')).toMatchObject({ step: 'F', alter: 1 });
		expect(pitch('m4-1-4')).toMatchObject({ step: 'B', alter: 0 });
		expect(pitch('m4-1-2')).toMatchObject({ step: 'A', alter: 0 });
		// bar 6's B natural was a stated accidental against F major: not on the old key's altered letter, so it stays.
		expect(pitch('m5-1-2')).toMatchObject({ step: 'B', alter: 0 });
		// bar 7's B flat was F major's own B flat: it becomes B natural.
		expect(pitch('m6-1-2')).toMatchObject({ step: 'B', alter: 0 });
		// bar 3 (D major, before the mark) is untouched, and so is bar 9 (the reading's own change, outside the scope).
		expect(pitch('m2-1-4')).toMatchObject({ step: 'F', alter: 1 });
		expect(pitch('m8-0-1')).toMatchObject({ step: 'F', alter: 1 });
	});
	it('leaves a pitch the singer set, and a hand entry, alone', async () => {
		const s = await fixture();
		const map: CorrectionMap = {
			[opener(s, 4)]: { keySignature: mark, pitch: { step: 'F', octave: 4, alter: 0 } },
			'hand:1': { entered: { after: 'm4-1-4' }, pitch: { step: 'F', octave: 4, alter: 0 }, base: 'quarter' },
		};
		const l = layer(s, map);
		expect(l.line.find((e) => e.id === 'm4-0-1')!.pitch).toMatchObject({ step: 'F', alter: 0 });
		expect(l.line.find((e) => e.id === 'hand:1')!.pitch).toMatchObject({ step: 'F', alter: 0 });
	});
	it('re-spells a grace note in scope as it does a note', async () => {
		const s = await fixture();
		const withGrace: ParsedScore = { ...s, graceNotes: [{ id: 'm4-0-1~g1', principalId: 'm4-0-1', pitch: { step: 'B', octave: 4, alter: -1 }, base: 'eighth' }] };
		const l = layer(withGrace, { [opener(s, 4)]: { keySignature: mark } });
		expect(l.score!.graceNotes![0].pitch).toMatchObject({ step: 'B', alter: 0 });
	});
	it('with scope "end", every later bar is judged against its own old key', async () => {
		const s = await fixture();
		const l = layer(s, { [opener(s, 4)]: { keySignature: { fifths: 2, through: 'end', notes: 'follow' } } });
		expect(fifths(l.score!)).toEqual(Array(12).fill(2));
		// bar 11 (A major in the reading) is now D major: its C sharp (3 sharps, third sharp G...) is C sharp in both; its G natural-free notes stay.
		// bar 9 (D major in the reading) is already D major: its F sharp is not moved.
		expect(l.line.find((e) => e.id === 'm8-0-1')!.pitch).toMatchObject({ step: 'F', alter: 1 });
		// bar 12's... the A major bar 11 had G sharp implied by its key; the fixture has no G, so the C sharp (alter 1) is on a letter D major also sharpens.
		expect(l.line.find((e) => e.id === 'm10-1-2')!.pitch).toMatchObject({ step: 'C', alter: 1 });
	});
});

describe("'keep': the pitches stay", () => {
	it('changes the key and no pitch', async () => {
		const s = await fixture();
		const l = layer(s, { [opener(s, 4)]: { keySignature: { fifths: 2, through: 'next', notes: 'keep' } } });
		expect(fifths(l.score!).slice(4, 8)).toEqual([2, 2, 2, 2]);
		expect(l.line.map((e) => e.pitch)).toEqual(s.vocalLine.map((e) => e.pitch));
	});
});

describe('Remove this key change', () => {
	it('takes the bar back to the key before it, with the notes following, and stops at the next change of the reading', async () => {
		const s = await fixture();
		const map = removeKey(s, s.vocalLine, {}, opener(s, 4))!;
		expect(map[opener(s, 4)].keySignature).toBe('remove');
		const l = layer(s, map);
		expect(fifths(l.score!)).toEqual([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3]);
		expect(l.line.find((e) => e.id === 'm4-0-1')!.pitch).toMatchObject({ step: 'F', alter: 1 });
	});
	it('is not offered on the first bar or on a bar that opens with no change', async () => {
		const s = await fixture();
		expect(removeKey(s, s.vocalLine, {}, opener(s, 0))).toBeNull();
		expect(removeKey(s, s.vocalLine, {}, opener(s, 5))).toBeNull();
		expect(heldKey(s, s.vocalLine, {}, opener(s, 4))).toMatchObject({ bar: 4, fifths: -1, reading: -1, before: 2, canRemove: true });
		expect(heldKey(s, s.vocalLine, {}, opener(s, 0))!.canRemove).toBe(false);
	});
	it('removing the singer\'s own change takes her mark away, with nothing else written', async () => {
		const s = await fixture();
		const set = setKey(s, s.vocalLine, {}, opener(s, 2), { fifths: 3, through: 'next', notes: 'keep' })!;
		expect(heldKey(s, s.vocalLine, set, opener(s, 2))!.canRemove).toBe(true);
		const removed = removeKey(s, s.vocalLine, set, opener(s, 2))!;
		expect(removed[opener(s, 2)]).toBeUndefined();
	});
});

describe('the two write-time rules', () => {
	it('one mark stands in a bar: a new one replaces it', async () => {
		const s = await fixture();
		let map = setKey(s, s.vocalLine, {}, opener(s, 4), { fifths: 3, through: 'next', notes: 'keep' })!;
		map = setKey(s, s.vocalLine, map, s.vocalLine.filter((e) => e.measureIndex === 4)[2].id, { fifths: 1, through: 'next', notes: 'keep' })!; // another entry of the same bar
		expect(Object.entries(map).filter(([, c]) => c.keySignature !== undefined).map(([id, c]) => [id, c.keySignature])).toEqual([[opener(s, 4), { fifths: 1, through: 'next', notes: 'keep' }]]);
	});
	it('"to the end of the song" removes her own later marks', async () => {
		const s = await fixture();
		let map = setKey(s, s.vocalLine, {}, opener(s, 6), { fifths: 3, through: 'next', notes: 'keep' })!;
		map = setKey(s, s.vocalLine, map, opener(s, 4), { fifths: 2, through: 'end', notes: 'keep' })!;
		expect(Object.values(map).filter((c) => c.keySignature !== undefined)).toHaveLength(1);
		expect(map[opener(s, 4)].keySignature).toMatchObject({ through: 'end' });
	});
	it('choosing the key the reading already has, to the next change, writes nothing and removes her mark', async () => {
		const s = await fixture();
		const set = setKey(s, s.vocalLine, {}, opener(s, 4), { fifths: 2, through: 'next', notes: 'keep' })!;
		expect(setKey(s, s.vocalLine, set, opener(s, 4), { fifths: -1, through: 'next', notes: 'keep' })).toEqual({});
	});
	it('refuses a key that is not one', async () => {
		const s = await fixture();
		expect(setKey(s, s.vocalLine, {}, opener(s, 4), { fifths: 9, through: 'next', notes: 'keep' })).toBeNull();
	});
	it('Undo is the earlier map: the corrected score returns to the reading', async () => {
		const s = await fixture();
		const set = setKey(s, s.vocalLine, {}, opener(s, 4), { fifths: 2, through: 'next', notes: 'follow' })!;
		expect(fifths(layer(s, set).score!)).not.toEqual(fifths(s));
		expect(fifths(layer(s, {}).score!)).toEqual(fifths(s));
		void inBar;
	});
});

describe('transposition moves a corrected key as it moves a read one', () => {
	it('the head, every bar, and the key list agree', async () => {
		const s = await fixture();
		const l = layer(s, { [opener(s, 4)]: { keySignature: { fifths: 2, through: 'next', notes: 'follow' } } }).score!;
		const up = engraveInKey(l, { semitones: 2, fifths: 4 }); // D major to E major
		expect(up.measures.map((m) => m.keySignature.fifths)).toEqual([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5]);
		expect(up.keySignatures.map((k) => k.signature.fifths)).toEqual([4, 5]);
		// withdrawing a stored choice when the first bar's key is corrected: the choice's `fifths` was made against the printed key.
		const corrected = layer(s, { [opener(s, 0)]: { keySignature: { fifths: 3, through: 'next', notes: 'keep' } } }).score!;
		expect(corrected.keySignatures[0].signature.fifths).toBe(3);
		const moved = engraveInKey(corrected, { semitones: 2, fifths: 5 }); // E major's neighbour: delta from the corrected 3 is 2
		expect(moved.measures[0].keySignature.fifths).toBe(5);
	});
});
