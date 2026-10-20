/**
 * Row 129: a beamed triplet is drawn as the publisher draws it (Dann 2026-10-19 23:21):
 * no bracket, the numeral centred on the middle note, and the slur given the room
 * the missing bracket leaves.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser } from './musicxml-parser';
import { parseXml } from './mini-xml.test-support';
import { analyzeScore } from './overlay-engine';
import { prepareSmuflFont } from './smufl-metadata';
import { renderAnalyzedStaff } from './staff-renderer';
import { numeralBox } from './tuplet-bracket';

const fonts = new URL('../../../apps/web/static/fonts/', import.meta.url);
const readJson = (p: string): unknown => JSON.parse(readFileSync(new URL(p, fonts), 'utf8'));
const maestro = prepareSmuflFont(readJson('finale-maestro/FinaleMaestro.json'), prepareSmuflFont(readJson('bravura/bravura_metadata.json')));

async function render(xml: string): Promise<string> {
	const res = await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document } as never);
	const analyzed = analyzeScore(res.score, { fR1: {} }, () => undefined, { generatedAt: '2026-10-20T00:00:00.000Z' });
	return renderAnalyzedStaff(res.score, analyzed, { font: maestro, fontFamily: 'Finale Maestro', lineGap: 5.5, staffMidY: 60 });
}

const trip = (actual: number, normal: number) => `<time-modification><actual-notes>${actual}</actual-notes><normal-notes>${normal}</normal-notes></time-modification>`;
const note = (step: string, oct: number, type: string, dur: number, extra = '', notations = '') =>
	`<note><pitch><step>${step}</step><octave>${oct}</octave></pitch><duration>${dur}</duration><type>${type}</type>${extra}${notations ? `<notations>${notations}</notations>` : ''}</note>`;
const doc = (body: string) =>
	`<?xml version="1.0"?><score-partwise version="4.0"><part-list><score-part id="P1"><part-name>V</part-name></score-part></part-list><part id="P1"><measure number="1"><attributes><divisions>24</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>${body}</measure></part></score-partwise>`;
const halfRest = '<note><rest/><duration>72</duration><type>half</type><dot/></note>';
const T3 = trip(3, 2);

/** The numeral groups: x and y of the 3, and whether any line is drawn with it. */
const groups = (svg: string) =>
	[...svg.matchAll(/<g data-tuplet="(\d+)">(.*?)<\/g>/g)].map((g) => {
		const num = g[2].match(/<text x="([\d.-]+)" y="([\d.-]+)"/)!;
		return { n: +g[1], x: +num[1], y: +num[2], lines: (g[2].match(/<line /g) ?? []).length };
	});
/** Each note's own group: the head glyph's x and y, and the stem line's x. */
const notesOf = (svg: string) =>
	svg.split('<g data-event-id=').slice(1).map((chunk) => {
		const head = chunk.match(/<text x="([\d.-]+)" y="([\d.-]+)"/)!;
		const stem = chunk.match(/<line x1="([\d.-]+)"/);
		return { headX: +head[1], headY: +head[2], stemX: stem ? +stem[1] : NaN };
	});
const headW = maestro.glyph('noteheadBlack').widthSp * 5.5;

describe('row 129: a beamed triplet has no bracket', () => {
	it('stems up: no line, and the 3 stands over the middle stem', async () => {
		const svg = await render(doc(note('G', 4, 'eighth', 8, T3) + note('A', 4, 'eighth', 8, T3) + note('G', 4, 'eighth', 8, T3) + halfRest));
		const g = groups(svg);
		expect(g).toHaveLength(1);
		expect(g[0].lines).toBe(0);
		expect(svg).toContain('data-beam-level="1"');
		expect(Math.abs(g[0].x - notesOf(svg)[1].stemX)).toBeLessThanOrEqual(0.5);
	});

	it('stems down: no line, and the 3 stands over the middle notehead', async () => {
		const svg = await render(doc(note('D', 5, 'eighth', 8, T3) + note('E', 5, 'eighth', 8, T3) + note('D', 5, 'eighth', 8, T3) + halfRest));
		const g = groups(svg);
		expect(g).toHaveLength(1);
		expect(g[0].lines).toBe(0);
		expect(Math.abs(g[0].x - (notesOf(svg)[1].headX + headW / 2))).toBeLessThanOrEqual(0.5);
		// the numeral stands above the middle notehead
		const midHeadY = notesOf(svg)[1].headY;
		expect(g[0].y).toBeLessThan(midHeadY);
	});

	it('two beamed notes and one unbeamed keep the bracket', async () => {
		const svg = await render(doc(note('G', 4, 'eighth', 8, T3) + note('A', 4, 'eighth', 8, T3) + note('G', 4, 'quarter', 16, T3) + halfRest));
		const g = groups(svg);
		expect(g).toHaveLength(1);
		expect(g[0].lines).toBe(4);
	});

	it('an even-count run keeps the bracket', async () => {
		const svg = await render(doc(note('G', 4, 'eighth', 12, trip(2, 3)) + note('A', 4, 'eighth', 12, trip(2, 3)) + halfRest));
		expect(svg).toContain('data-beam-level="1"');
		const g = groups(svg);
		expect(g).toHaveLength(1);
		expect(g[0].n).toBe(2);
		expect(g[0].lines).toBe(4);
	});

	it('an unbeamed triplet of quarters keeps the bracket', async () => {
		const svg = await render(doc(note('G', 4, 'quarter', 16, T3) + note('A', 4, 'quarter', 16, T3) + note('G', 4, 'quarter', 16, T3)));
		expect(groups(svg)[0].lines).toBe(4);
	});
});

describe('row 129: the slur has only the numeral to clear', () => {
	const arcs = (svg: string) =>
		[...svg.matchAll(/<path d="M([\d.-]+) ([\d.-]+) Q ([\d.-]+) ([\d.-]+) ([\d.-]+) ([\d.-]+)[^"]*" fill="#1a1612" data-slur-printed/g)].map((m) => ({ x1: +m[1], y1: +m[2], cx: +m[3], cy: +m[4], x2: +m[5], y2: +m[6] }));
	const yAt = (a: ReturnType<typeof arcs>[number], x: number): number => {
		const t = (x - a.x1) / (a.x2 - a.x1);
		return (1 - t) ** 2 * a.y1 + 2 * t * (1 - t) * a.cy + t * t * a.y2;
	};
	const slurOver = (slur: string | undefined, end: string | undefined) =>
		doc(
			note('G', 4, 'eighth', 8, T3, slur ? `<slur type="start" number="1"/>` : '') +
				note('A', 4, 'eighth', 8, T3) +
				note('G', 4, 'eighth', 8, T3) +
				note('C', 5, 'quarter', 24, '', end ? `<slur type="stop" number="1"/>` : '') +
				halfRest,
		);

	it('a slur passing over a bracketless triplet clears the numeral’s box', async () => {
		const svg = await render(slurOver('s', 'e'));
		const g = groups(svg)[0];
		const a = arcs(svg)[0];
		const box = numeralBox({ midX: g.x, yBr: g.y - 3.5 });
		expect(g.lines).toBe(0);
		for (let x = Math.max(a.x1, box.left); x <= Math.min(a.x2, box.right); x += 0.5) expect(yAt(a, x)).toBeLessThan(box.top);
	});

	it('the slur at bar 10 of song 1 ends at the head and the beam, where the bracket line held it higher', async () => {
		// Before this row the second slur of the fixture began at y 39.33 raised to the bracket's line, 31.33 (`f93b9e5`+), and its numeral stood off-centre at x 557.47.
		const xml = readFileSync(new URL('./fixtures/row126-song1-bars-9-10.musicxml', import.meta.url), 'utf8');
		const svg = await render(xml);
		const a = arcs(svg)[2];
		expect(a.y1).toBeGreaterThan(31.33);
		const g = groups(svg)[1];
		expect(g.lines).toBe(0);
		expect(g.x).toBeCloseTo(560.72, 1);
	});
});
