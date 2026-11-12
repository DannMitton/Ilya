/**
 * N.187 step 2: the parser keeps grace notes in `ParsedScore.graceNotes`, keyed
 * by their principal note, and leaves `vocalLine` exactly as it was.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser } from './musicxml-parser';
import { parseXml } from './mini-xml.test-support';
import { sliceScore } from './page-layout';
import { engraveInKey, transposeScore } from './transposition';
import type { ParseResult, ParsedScore } from './types';

async function parseText(xml: string): Promise<ParseResult> {
	return new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document } as never);
}
const FIXTURE = readFileSync(new URL('./fixtures/grace-notes.musicxml', import.meta.url), 'utf8');
const load = async (): Promise<ParsedScore> => (await parseText(FIXTURE)).score;

/** A one-part 4/4 score from bar bodies (divisions 4: quarter 4, eighth 2). */
const song = (bars: string[]): string =>
	`<score-partwise><part-list><score-part id="P1"><part-name>V</part-name></score-part></part-list><part id="P1">${bars
		.map((b, i) => `<measure number="${i + 1}">${i === 0 ? '<attributes><divisions>4</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time></attributes>' : ''}${b}</measure>`)
		.join('')}</part></score-partwise>`;
const N = (step: string, type = 'quarter', dur = 4): string => `<note><pitch><step>${step}</step><octave>4</octave></pitch><duration>${dur}</duration><type>${type}</type></note>`;
const REST = (dur = 4): string => `<note><rest/><duration>${dur}</duration><type>quarter</type></note>`;
const G = (step: string, attrs = ''): string => `<note><grace${attrs}/><pitch><step>${step}</step><octave>4</octave></pitch><type>eighth</type></note>`;

describe('the parser keeps grace notes', () => {
	it('reads the fixture into eleven grace notes and leaves the vocal line at 27 notes', async () => {
		const score = await load();
		expect(score.vocalLine).toHaveLength(27);
		expect(score.vocalLine.every((e) => !e.id.includes('~'))).toBe(true);
		const ids = score.graceNotes!.map((g) => g.id);
		expect(ids).toEqual(['m0-0-1~g1', 'm1-0-1~g1', 'm1-0-1~g2', 'm2-3-4~a1', 'm3-0-1~g1', 'm4-1-2~g1', 'm5-0-1~g1', 'm6-1-4~g1', 'm7-0-1~g1', 'm8-0-1~g1', 'm9-0-1~g1']);
		const lineIds = new Set(score.vocalLine.map((e) => e.id));
		for (const g of score.graceNotes!) expect(lineIds.has(g.principalId)).toBe(true);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('a group takes its order; a lone grace note has its own slash; a bare <grace/> leaves slash undefined', async () => {
		const g = (await load()).graceNotes!;
		const byId = (id: string) => g.find((x) => x.id === id)!;
		expect(byId('m1-0-1~g1')).toMatchObject({ base: '16th', pitch: { step: 'A', octave: 4, alter: 0 } });
		expect(byId('m1-0-1~g2')).toMatchObject({ base: '16th', pitch: { step: 'B', octave: 4, alter: 0 } });
		expect(byId('m0-0-1~g1').slash).toBe(true);
		expect('slash' in byId('m9-0-1~g1')).toBe(false);
	});

	it('an after-grace hangs on the last note of its bar and says so', async () => {
		const a = (await load()).graceNotes!.find((x) => x.id === 'm2-3-4~a1')!;
		expect(a).toMatchObject({ after: true, principalId: 'm2-3-4', pitch: { step: 'G', octave: 5 } });
	});

	it('a grace note with a lyric takes no syllable and gives none to the line', async () => {
		const score = await load();
		const g = score.graceNotes!.find((x) => x.principalId === 'm3-0-1')!;
		expect(g).not.toHaveProperty('syllable');
		expect(score.vocalLine.filter((e) => e.measureIndex === 3)).toHaveLength(1);
	});

	it('a grace note between two tied notes does not break the tie and takes none', async () => {
		const score = await load();
		const [c1, c2] = score.vocalLine.filter((e) => e.measureIndex === 4 && e.pitch?.step === 'C');
		expect(c1.tied).toBeDefined();
		expect(c2.tied).toBeDefined();
		expect(score.graceNotes!.find((x) => x.principalId === c2.id)).toBeDefined();
	});

	it('records slurred where a slur starts on the grace note, and leaves the carry onto the line as it was', async () => {
		const score = await load();
		const a = score.graceNotes!.find((g) => g.id === 'm5-0-1~g1')!;
		expect(a.slurred).toBe(true);
		const [c, d] = score.vocalLine.filter((e) => e.measureIndex === 5);
		expect(c.slurs).toEqual([{ type: 'start', number: 1, partnerEventId: d.id }]);
		expect(d.slurs).toEqual([{ type: 'stop', number: 1, partnerEventId: c.id }]);
		// the usual grace-to-main slur: both ends on the principal, nothing drawn between two notes.
		const b = score.graceNotes!.find((g) => g.id === 'm6-1-4~g1')!;
		expect(b.slurred).toBe(true);
		expect(score.vocalLine.find((e) => e.id === 'm6-1-4')!.slurs).toEqual([{ type: 'start', number: 1 }, { type: 'stop', number: 1 }]);
	});

	it('a grace note carries its own accidental and is ids-stable across a re-parse', async () => {
		const one = await load();
		const two = await load();
		expect(two.graceNotes).toEqual(one.graceNotes);
		expect(one.graceNotes!.find((g) => g.principalId === 'm8-0-1')!.pitch.alter).toBe(0);
		expect(one.vocalLine.find((e) => e.id === 'm8-0-1')!.pitch?.alter).toBe(1);
	});

	it('a file with no grace note carries no graceNotes field', async () => {
		const { score } = await parseText(song([N('C') + N('D') + N('E') + N('F')]));
		expect(score).not.toHaveProperty('graceNotes');
	});
});

describe('the principal rule covers every case (amendment 3)', () => {
	it('with no kept note in the bar the grace note takes the next note in the line', async () => {
		const { score } = await parseText(song([N('C') + N('D') + N('E') + N('F'), REST() + G('B') + REST() + REST() + REST(), N('G', 'whole', 16)]));
		expect(score.graceNotes).toHaveLength(1);
		expect(score.graceNotes![0]).toMatchObject({ principalId: 'm2-0-1' });
		expect(score.graceNotes![0].after).toBeUndefined();
	});

	it('with no note after it at all it takes the last note before it, as an after-grace', async () => {
		const { score } = await parseText(song([N('C') + N('D') + N('E') + N('F'), REST() + G('B') + REST() + REST() + REST()]));
		expect(score.graceNotes![0]).toMatchObject({ principalId: 'm0-3-4', after: true });
	});

	it('with no note in the line at all it is dropped with a warning', async () => {
		const { score, warnings } = await parseText(song([REST() + G('B') + REST() + REST() + REST()]));
		expect(score.graceNotes).toBeUndefined();
		expect(warnings.some((w) => w.message.startsWith('grace note dropped'))).toBe(true);
	});

	it('a supplied <note id> on a grace note is never honoured', async () => {
		const xml = song([`<note id="x1"><pitch><step>C</step><octave>4</octave></pitch><duration>16</duration><type>whole</type></note>`.replace('<note id="x1">', '<note id="x1">')]);
		const withGrace = xml.replace('<note id="x1">', `<note id="x0"><grace/><pitch><step>B</step><octave>3</octave></pitch><type>eighth</type></note><note id="x1">`);
		const { score } = await parseText(withGrace);
		expect(score.graceNotes![0].id).toMatch(/~g1$/);
		expect(score.graceNotes![0].id).not.toBe('x0');
	});
});

describe('slice, transposition', () => {
	it('sliceScore keeps a grace note when its principal is in the slice, and no other', async () => {
		const score = await load();
		const slice = sliceScore(score, 1, 2);
		expect(slice.graceNotes!.map((g) => g.id)).toEqual(['m1-0-1~g1', 'm1-0-1~g2', 'm2-3-4~a1']);
		// the slice rebases its measure indices but the principal's id is the file's own, so the link stands.
		expect(slice.vocalLine.some((e) => e.id === slice.graceNotes![0].principalId)).toBe(true);
	});

	it('transposeScore moves a grace note with the rest, and keeps its other fields', async () => {
		const score = await load();
		const up = transposeScore(score, 2);
		const g0 = score.graceNotes![0];
		expect(up.graceNotes![0]).toMatchObject({ id: g0.id, principalId: g0.principalId, base: g0.base, slash: true, pitch: { step: 'C', octave: 5, alter: 1 } });
		expect(transposeScore(score, 0)).toBe(score);
	});

	it('engraveInKey moves a grace note by the same semitones, and returns the same score when nothing moves', async () => {
		const score = await load();
		const keyed = engraveInKey(score, { semitones: 2, fifths: 2 });
		const principal = keyed.vocalLine.find((e) => e.id === 'm0-0-1')!;
		expect(keyed.graceNotes![0].pitch).toMatchObject({ step: 'C', octave: 5 });
		expect(principal.pitch).toMatchObject({ step: 'D', octave: 5 });
		expect(engraveInKey(score, { semitones: 0, fifths: 0 })).toBe(score);
	});
});
