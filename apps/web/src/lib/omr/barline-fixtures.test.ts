import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser, type ParsedScore, type VocalLineEvent } from '@ilya/score-parser';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { measureFill } from '$lib/score/entry';

/* QUEUE row 138, B0: the five synthetic fixtures read the way the brief says. Built by hand to the shapes of
   `docs/sessions/review-fable-barline-correction_r1_2026-11-10.md` (the f1 song 1 reading and the Lamm scan's kept MusicXML are
   on the maintainer's Mac, not on this lane); none is a reading of a scan. */

async function load(name: string): Promise<ParsedScore> {
	const xml = readFileSync(new URL(`./fixtures/${name}.musicxml`, import.meta.url), 'utf8');
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: `${name}.musicxml` })).score;
}
const inBar = (line: VocalLineEvent[], bar: number) => line.filter((e) => e.measureIndex === bar);
const fills = (s: ParsedScore) => s.measures.map((m) => measureFill(s.vocalLine, m.index, m.timeSignature));

describe('the barline and time signature fixtures', () => {
	it('the fused fixture has seven bars and bar 4 holds eight quarters', async () => {
		const s = await load('barline-fused');
		expect(s.measures).toHaveLength(7);
		expect(fills(s)[3]).toEqual({ actual: 8, expected: 4 });
	});
	it('the dropped-rest fixture holds seven quarters in the fused bar', async () => {
		const s = await load('barline-fused-rest-dropped');
		expect(fills(s)[3]).toEqual({ actual: 7, expected: 4 });
	});
	it('the Gretchaninov shape states 4/8 over bars of three quarters, every bar over-full', async () => {
		const s = await load('time-signature-wrong');
		expect(s.measures[0].timeSignature).toMatchObject({ beats: 4, beatType: 8 });
		expect(fills(s).every((f) => f?.actual === 6 && f.expected === 4)).toBe(true);
	});
});

describe('the control and the fourth-bar shapes', () => {
	it('the clean fixture has eight bars that all add up', async () => {
		const s = await load('barline-clean-4-4');
		expect(s.measures).toHaveLength(8);
		expect(fills(s).every((f) => f === null)).toBe(true);
	});
	it('the wrong-barlines fixture states 4/4 over six bars of four quarters, which add up under 4/4 and not under 3/4', async () => {
		const s = await load('time-signature-barlines-wrong');
		expect(s.measures).toHaveLength(6);
		expect(fills(s).every((f) => f === null)).toBe(true);
		expect(inBar(s.vocalLine, 1).length).toBeGreaterThan(0);
		for (const m of s.measures) expect(measureFill(s.vocalLine, m.index, { beats: 3, beatType: 4 })).toEqual({ actual: 4, expected: 3 });
	});
	it('the fused bar (bars 4 and 5) holds the second bar\'s rest in the fixture that lost it', async () => {
		const whole = await load('barline-fused');
		const lost = await load('barline-fused-rest-dropped');
		expect(inBar(whole.vocalLine, 3).filter((e) => e.type === 'rest')).toHaveLength(1);
		expect(inBar(lost.vocalLine, 3).filter((e) => e.type === 'rest')).toHaveLength(0);
	});
});
