/**
 * Row 126: a printed slur stays outside the beam and the triplet bracket.
 *
 * The fixture is bars 9 and 10 of song 1 of row 114 as homr wrote them (notes and
 * notations; hand-typed). Bar 10's first slur is beamed, both stems up; its second
 * crosses a triplet bracket. Bar 9's slur is wholly inside a triplet.
 *
 * Every test reads the slur's own path out of the SVG, `M x1 y1 Q cx cy x2 y2`,
 * the outer edge of the closed outline (`arc-outline.ts`), because a test cannot
 * call `planPrintedSlurs` with the renderer's context. Stave: the shipping 5.5 px,
 * where the clearances are in their real proportions; (d) also runs at 12.
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
const OPTS = { font: maestro, fontFamily: 'Finale Maestro', lineGap: 5.5, staffMidY: 60 };

async function render(xml: string, lineGap = 5.5): Promise<string> {
	const res = await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document } as never);
	const analyzed = analyzeScore(res.score, { fR1: {} }, () => undefined, { generatedAt: '2026-10-20T00:00:00.000Z' });
	return renderAnalyzedStaff(res.score, analyzed, { ...OPTS, lineGap });
}
const FIXTURE = readFileSync(new URL('./fixtures/row126-song1-bars-9-10.musicxml', import.meta.url), 'utf8');

interface Arc { x1: number; y1: number; cx: number; cy: number; x2: number; y2: number }
const arcs = (svg: string): Arc[] =>
	[...svg.matchAll(/<path d="M([\d.-]+) ([\d.-]+) Q ([\d.-]+) ([\d.-]+) ([\d.-]+) ([\d.-]+)[^"]*" fill="#1a1612" data-slur-printed/g)].map((m) => ({ x1: +m[1], y1: +m[2], cx: +m[3], cy: +m[4], x2: +m[5], y2: +m[6] }));
/** The outer edge of the arc at x, from the quadratic (x is linear in t: the control stands at the middle). */
const yAt = (a: Arc, x: number): number => {
	const t = (x - a.x1) / (a.x2 - a.x1);
	return (1 - t) ** 2 * a.y1 + 2 * t * (1 - t) * a.cy + t * t * a.y2;
};
const samples = (a: Arc, from = a.x1, to = a.x2, n = 50): Array<{ x: number; y: number }> =>
	Array.from({ length: n + 1 }, (_, i) => ({ x: from + ((to - from) * i) / n, y: yAt(a, from + ((to - from) * i) / n) }));

/** The primary beam's line, y at x, from its `data-beam-level="1"` segments. */
const beams = (svg: string) => [...svg.matchAll(/<line x1="([\d.-]+)" y1="([\d.-]+)" x2="([\d.-]+)" y2="([\d.-]+)" stroke="#1a1612" stroke-width="([\d.]+)" data-beam-level="1"/g)].map((m) => ({ x1: +m[1], y1: +m[2], x2: +m[3], y2: +m[4], w: +m[5] }));
const beamTopAt = (svg: string, x: number): number | null => {
	for (const b of beams(svg)) if (x >= b.x1 - 0.01 && x <= b.x2 + 0.01) return b.y1 + ((b.y2 - b.y1) * (x - b.x1)) / (b.x2 - b.x1) - b.w / 2;
	return null;
};
const brackets = (svg: string) =>
	[...svg.matchAll(/<g data-tuplet="3"><line x1="([\d.-]+)" y1="([\d.-]+)" x2="[\d.-]+" y2="([\d.-]+)" stroke="#1a1612" stroke-width="([\d.]+)"\/><line x1="[\d.-]+" y1="[\d.-]+" x2="([\d.-]+)"[^>]*\/><line x1="([\d.-]+)" y1="[\d.-]+" x2="([\d.-]+)"/g)].map((m) => ({ xa: +m[1], yBr: +m[3], t: +m[4], midX: (+m[5] + +m[6]) / 2, xb: +m[7] }));

describe('row 126: bar 10, the first slur arches over the beam', () => {
	it('both ends stand at or above the beam’s top at their stems, and no point of the curve dips between the heads and the beam', async () => {
		const svg = await render(FIXTURE);
		const a = arcs(svg)[1]; // bar 9's slur is first, bar 10's first slur is second
		for (const x of [a.x1, a.x2]) {
			const top = beamTopAt(svg, x);
			expect(top, `a beam under the end at x ${x}`).not.toBeNull();
		}
		expect(a.y1).toBeLessThanOrEqual(beamTopAt(svg, a.x1)! + 0.01);
		expect(a.y2).toBeLessThanOrEqual(beamTopAt(svg, a.x2)! + 0.01);
		for (const p of samples(a)) expect(p.y, `x ${p.x.toFixed(1)}`).toBeLessThanOrEqual(beamTopAt(svg, p.x)! + 0.01);
	});
});

describe('row 126: bar 10, the second slur passes over the triplet bracket and its numeral', () => {
	it('no sampled point of the curve lies inside the bracket’s line or the numeral’s box', async () => {
		const svg = await render(FIXTURE);
		const br = brackets(svg)[1];
		const slur = arcs(svg)[2];
		expect(br).toBeDefined();
		const box = numeralBox({ midX: br.midX, yBr: br.yBr });
		for (const p of samples(slur, Math.max(slur.x1, br.xa), Math.min(slur.x2, br.xb))) {
			expect(p.y, `above the line at x ${p.x.toFixed(1)}`).toBeLessThan(br.yBr - br.t / 2);
			if (p.x >= box.left && p.x <= box.right) expect(p.y).toBeLessThan(box.top);
		}
	});
});

describe('row 126: a slur wholly inside a triplet goes under the bracket, and the bracket clears it', () => {
	it('bar 9: the bracket’s line is at least 8 px above the slur’s apex', async () => {
		const svg = await render(FIXTURE);
		const br = brackets(svg)[0];
		const apex = Math.min(...samples(arcs(svg)[0]).map((p) => p.y));
		expect(br.yBr).toBeLessThanOrEqual(apex - 8 + 0.01);
	});

	it('and the bracket RISES to do it where the notes stem up (the slur clears the stem tips, so it stands higher than the bracket would)', async () => {
		const note = (step: string, slur?: string, trip?: string) =>
			`<note><pitch><step>${step}</step><octave>4</octave></pitch><duration>8</duration><type>eighth</type><time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes></time-modification><notations>${trip ? `<tuplet type="${trip}" number="1"/>` : ''}${slur ? `<slur type="${slur}" number="1"/>` : ''}</notations></note>`;
		const rest = '<note><rest/><duration>72</duration><type>half</type><dot/></note>';
		const doc = (slurred: boolean) =>
			`<?xml version="1.0"?><score-partwise version="4.0"><part-list><score-part id="P1"><part-name>V</part-name></score-part></part-list><part id="P1"><measure number="1"><attributes><divisions>24</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>${note('G', slurred ? 'start' : undefined, 'start')}${note('A')}${note('G', slurred ? 'stop' : undefined, 'stop')}${rest}</measure></part></score-partwise>`;
		const withSlur = await render(doc(true));
		const without = await render(doc(false));
		const raised = brackets(withSlur)[0].yBr;
		const apex = Math.min(...samples(arcs(withSlur)[0]).map((p) => p.y));
		expect(raised).toBeLessThanOrEqual(apex - 8 + 0.01);
		expect(raised).toBeLessThan(brackets(without)[0].yBr);
	});
});

describe('row 126: what does not change', () => {
	// The paths below are what the code before this row drew (`f93b9e5`), same inputs.
	const note = (step: string, oct: number, type: string, slur?: string) =>
		`<note><pitch><step>${step}</step><octave>${oct}</octave></pitch><duration>${type === 'eighth' ? 12 : 24}</duration><type>${type}</type>${slur ? `<notations><slur type="${slur}" number="1"/></notations>` : ''}</note>`;
	const doc = (notes: string[]) =>
		`<?xml version="1.0"?><score-partwise version="4.0"><part-list><score-part id="P1"><part-name>V</part-name></score-part></part-list><part id="P1"><measure number="1"><attributes><divisions>24</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>${notes.join('')}</measure></part></score-partwise>`;
	const beamedDown = doc([note('C', 5, 'eighth', 'start'), note('D', 5, 'eighth', 'stop'), note('E', 5, 'quarter'), note('E', 5, 'quarter'), note('E', 5, 'quarter')]);
	const unbeamedUp = doc([note('E', 4, 'quarter', 'start'), note('F', 4, 'quarter', 'stop'), note('E', 4, 'quarter'), note('E', 4, 'quarter')]);
	const BEFORE: Record<string, string> = {
		'beamedDown@5.5': 'M49.26 53.25 Q 69.26 39.88 89.26 50.5 L 89.26 50.78 Q 69.26 42.35 49.26 53.53 Z',
		'beamedDown@12': 'M107.47 45.27 Q 127.47 30.27 147.47 39.27 L 147.47 39.87 Q 127.47 35.67 107.47 45.87 Z',
		'unbeamedUp@5.5': 'M49.26 67 Q 79.26 52.63 109.26 64.25 L 109.26 64.53 Q 79.26 55.1 49.26 67.28 Z',
		'unbeamedUp@12': 'M107.47 75.27 Q 137.47 59.27 167.47 69.27 L 167.47 69.87 Q 137.47 64.67 107.47 75.87 Z',
	};
	it.each(Object.keys(BEFORE))('d. %s: a slur over beamed down-stems, or over unbeamed up-stems, is the path it was', async (key) => {
		const [name, lg] = key.split('@');
		const svg = await render(name === 'beamedDown' ? beamedDown : unbeamedUp, Number(lg));
		expect(svg.match(/<path d="([^"]*)" fill="#1a1612" data-slur-printed/)![1]).toBe(BEFORE[key]);
	});
});

describe('row 126: the end-point rule moves a down-stem end toward its stem, which stands LEFT of the head', () => {
	it('e. a slur below, over down-stems and a deep inner note, ends left of its heads once it has moved', async () => {
		const note = (step: string, oct: number, slur?: string) =>
			`<note><pitch><step>${step}</step><octave>${oct}</octave></pitch><duration>24</duration><type>quarter</type>${slur ? `<notations><slur type="${slur}" number="1" placement="below"/></notations>` : ''}</note>`;
		const xml = `<?xml version="1.0"?><score-partwise version="4.0"><part-list><score-part id="P1"><part-name>V</part-name></score-part></part-list><part id="P1"><measure number="1"><attributes><divisions>24</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>${note('F', 5, 'start')}${note('C', 4)}${note('F', 5, 'stop')}${note('F', 5)}</measure></part></score-partwise>`;
		const svg = await render(xml);
		const a = arcs(svg)[0];
		const heads = [...svg.matchAll(/<g data-event-id="[^"]*"[^>]*>\s*<rect[^>]*\/>\s*<text x="([\d.-]+)"/g)].map((m) => +m[1]);
		// the head's glyph origin is its left edge; its centre is half a head to the right, so a stem on the LEFT
		// puts the end left of the centre, and the old `px - stemHalfDown` put it right of it.
		const headW = maestro.glyph('noteheadBlack').widthSp * 5.5;
		const centre0 = heads[0] + headW / 2;
		const centre2 = heads[2] + headW / 2;
		expect(a.x1).toBeLessThan(centre0);
		expect(a.x2).toBeLessThan(centre2);
	});
});
