/**
 * N.187 step 4: the renderer draws grace notes: before the principal (after it, for an after-grace), at grace size, stem up,
 * a slur below, outside the bar's count, with no underlay. Fixture: `fixtures/grace-notes.musicxml`.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser } from './musicxml-parser';
import { parseXml } from './mini-xml.test-support';
import { analyzeScore } from './overlay-engine';
import { prepareSmuflFont } from './smufl-metadata';
import { renderSystemSlice, sliceWidth } from './page-layout';
import { scoreInPerformanceOrder } from './performance-order';
import { READ_SCAN_ORIGIN } from './printed-marks';
import { accidentalStateAtEndOf } from './accidental-carry';
import type { ParsedScore } from './types';

const fonts = new URL('../../../apps/web/static/fonts/', import.meta.url);
const readJson = (p: string): unknown => JSON.parse(readFileSync(new URL(p, fonts), 'utf8'));
const maestro = prepareSmuflFont(readJson('finale-maestro/FinaleMaestro.json'), prepareSmuflFont(readJson('bravura/bravura_metadata.json')));
const OPTS = { font: maestro, fontFamily: 'Finale Maestro', lineGap: 12, staffMidY: 60 };

async function parseXmlText(xml: string): Promise<ParsedScore> {
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document } as never)).score;
}
const fixture = (): Promise<ParsedScore> => parseXmlText(readFileSync(new URL('./fixtures/grace-notes.musicxml', import.meta.url), 'utf8'));
const analyse = (s: ParsedScore) => analyzeScore(s, { fR1: {} }, () => undefined, { generatedAt: '2026-10-20T00:00:00.000Z' });
const draw = (s: ParsedScore, a = 0, b = s.measures.length - 1): string => renderSystemSlice(s, analyse(s), OPTS, a, b, { finalBarline: b === s.measures.length - 1 });
const groups = (svg: string): string[] => [...svg.matchAll(/<g data-grace="([^"]*)"/g)].map((m) => m[1]);
const without = (s: ParsedScore): ParsedScore => ({ ...s, graceNotes: undefined });
const widthOf = (svg: string): number => Number(svg.match(/viewBox="0 [\d.-]+ ([\d.]+) /)![1]);

describe('grace notes are drawn', () => {
	it('one group per principal, in the fixture\'s order, with a group of two drawn as one', async () => {
		const svg = draw(await fixture());
		expect(groups(svg).map((g) => g.split(' ').length)).toEqual([1, 2, 1, 1, 1, 1, 1, 1, 1, 1]);
		expect(groups(svg)[1]).toBe('m1-0-1~g1 m1-0-1~g2');
		expect(groups(svg)[2]).toBe('m2-3-4~a1');
	});

	it('a grace note head is 0.7 of a full note\'s, and its stem runs up two and a quarter spaces', async () => {
		const svg = draw(await fixture(), 0, 0);
		const fonts = [...svg.matchAll(/<text [^>]*font-size="([\d.]+)px"[^>]*>()<\/text>/g)].map((m) => Number(m[1]));
		expect(fonts.length).toBe(5); // the grace head first (it is drawn before its principal), then the four quarters
		expect(fonts[0] / fonts[1]).toBeCloseTo(0.7, 2);
		const g = svg.match(/<g data-grace="[^"]*">([\s\S]*?)<\/g>/)![1];
		const stem = g.match(/<line x1="([\d.-]+)" y1="([\d.-]+)" x2="([\d.-]+)" y2="([\d.-]+)" stroke="#1a1612"/)!;
		expect(stem[1]).toBe(stem[3]); // vertical
		expect(Number(stem[2]) - Number(stem[4])).toBeCloseTo(12 * 2.25, 1); // up
	});

	it('draws a slur below each group, notehead to notehead, one per group', async () => {
		const svg = draw(await fixture());
		expect((svg.match(/data-grace-slur/g) ?? []).length).toBe(10);
	});

	it('strokes a lone flagged grace note that says slash, never a grouped one, and by default only where a scan reader wrote the file', async () => {
		const s = await fixture();
		const stroked = (svg: string): number => (svg.match(/data-grace-slash/g) ?? []).length;
		// bar 1 says slash="yes"; the other eight lone grace notes say nothing, so a hand-made file draws one stroke.
		expect(stroked(draw(s))).toBe(1);
		expect(stroked(draw(s, 1, 1))).toBe(0); // the group of two
		const scan: ParsedScore = { ...s, source: { ...s.source, origin: READ_SCAN_ORIGIN } };
		expect(stroked(draw(scan))).toBe(9); // every lone grace note: ten groups less the pair
		expect((draw(scan, 1, 1).match(/data-grace-beam/g) ?? []).length).toBe(2); // two 16ths: two beams
	});

	it('draws no underlay under a grace note, and none of its own for the lyric a print sets there', async () => {
		const s = await fixture();
		const lyrics = (svg: string): number => (svg.match(/<text [^>]*>ла<\/text>/g) ?? []).length;
		expect(lyrics(draw(s, 3, 3))).toBe(lyrics(draw(without(s), 3, 3)));
	});
});

describe('a grace note takes no time', () => {
	it('leaves every note, tie, and slur of the bar where they would be, and the bar\'s sum unchanged', async () => {
		const s = await fixture();
		const ties = (svg: string): number => (svg.match(/data-tie/g) ?? []).length;
		const slurs = (svg: string): number => (svg.match(/data-slur=/g) ?? []).length;
		expect(ties(draw(s, 4, 4))).toBe(ties(draw(without(s), 4, 4)));
		expect(ties(draw(s, 4, 4))).toBeGreaterThan(0);
		expect(slurs(draw(s))).toBe(slurs(draw(without(s))));
		for (const bar of s.measures) {
			const sum = s.vocalLine.filter((e) => e.measureIndex === bar.index).reduce((t, e) => t + e.duration.fraction.numerator / e.duration.fraction.denominator, 0);
			expect(sum).toBe(1);
		}
	});

	it('gives sliceWidth the same width as the drawing, with a grace note, a group, an after-grace, and a grace note first in a system', async () => {
		const s = await fixture();
		const a = analyse(s);
		for (const [from, to, last] of [[0, 0, false], [1, 1, false], [2, 2, false], [7, 7, false], [0, 9, true], [7, 9, true]] as const) {
			expect(widthOf(renderSystemSlice(s, a, OPTS, from, to, { finalBarline: last }))).toBeCloseTo(sliceWidth(s, from, to, OPTS, a), 1);
		}
	});

	it('makes the drawing wider by the room it takes, and no wider with no grace notes', async () => {
		const s = await fixture();
		expect(widthOf(draw(s))).toBeGreaterThan(widthOf(draw(without(s))));
		expect(widthOf(draw(without(s)))).toBeCloseTo(sliceWidth(without(s), 0, 9, OPTS, analyse(s)), 1);
	});
});

describe('primitive mode (no font loaded)', () => {
	it('draws the grace notes with the primitive head and accidental, and does not throw', async () => {
		const s = await fixture();
		const svg = renderSystemSlice(s, analyse(s), { lineGap: 12, staffMidY: 60 }, 0, s.measures.length - 1, { finalBarline: true });
		expect(groups(svg)).toHaveLength(10);
		expect(svg).toContain('<ellipse');
	});
});

describe('accidentals', () => {
	it('judges a grace note by the same carry as a note, and lets it govern the rest of the bar', async () => {
		const s = await parseXmlText(`<score-partwise><part-list><score-part id="P1"><part-name>V</part-name></score-part></part-list><part id="P1"><measure number="1"><attributes><divisions>4</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time></attributes><note><grace/><pitch><step>F</step><alter>1</alter><octave>4</octave></pitch><type>eighth</type></note><note><pitch><step>F</step><octave>4</octave></pitch><duration>8</duration><type>half</type></note><note><pitch><step>F</step><octave>4</octave></pitch><duration>8</duration><type>half</type></note></measure></part></score-partwise>`);
		// the grace F sharp states a sharp; the principal F natural then needs a natural, and the bar ends holding F natural.
		expect(accidentalStateAtEndOf(s, 0, 0)).toEqual({ F4: 0 });
		const svg = draw(s);
		expect((svg.match(/data-of-event="m0-0-1"/g) ?? []).length).toBeGreaterThan(0);
	});
});

describe('repeats', () => {
	it('a repeated bar keeps its grace notes in the performance order, so each pass draws them', async () => {
		const bar = (n: number, extra: string, notes: string): string => `<measure number="${n}">${n === 1 ? '<attributes><divisions>4</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time></attributes>' : ''}${extra}${notes}</measure>`;
		const note = (s: string, g = false): string => (g ? `<note><grace/><pitch><step>${s}</step><octave>4</octave></pitch><type>eighth</type></note>` : `<note><pitch><step>${s}</step><octave>4</octave></pitch><duration>16</duration><type>whole</type></note>`);
		const xml = `<score-partwise><part-list><score-part id="P1"><part-name>V</part-name></score-part></part-list><part id="P1">${bar(1, '<barline location="left"><repeat direction="forward"/></barline>', note('B', true) + note('C'))}${bar(2, '<barline location="right"><repeat direction="backward"/></barline>', note('D'))}</part></score-partwise>`;
		const s = await parseXmlText(xml);
		const out = scoreInPerformanceOrder(s);
		expect(out.reordered).toBe(true);
		expect(out.score.vocalLine.filter((e) => e.id === 'm0-0-1')).toHaveLength(2);
		expect(out.score.graceNotes).toBe(s.graceNotes);
		const gg = out.score.graceNotes!.filter((g) => g.principalId === 'm0-0-1');
		expect(gg).toHaveLength(1);
	});
});
