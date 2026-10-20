/**
 * N.188: the parser keeps the printed slurs and the fermatas on rests, and
 * Markup draws the slurs, the note markings, and the fermatas as printed.
 *
 * The fixture is `fixtures/n188-markings.musicxml`, written by hand: a slur over
 * a melisma, a slur over two syllables, nested slurs, a long slur that a
 * narrow system forces across a break, an accent above and one below, a tenuto,
 * a staccato, a fermata on a note and one on a whole-bar rest, and a breath mark.
 *
 * The font is Finale Maestro's own metadata with Bravura's beneath it, read from
 * the app's static files, so the glyph boxes the placement arithmetic reads are
 * the real ones.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser } from './musicxml-parser';
import { parseXml } from './mini-xml.test-support';
import { analyzeScore } from './overlay-engine';
import { prepareSmuflFont, type PreparedSmuflFont } from './smufl-metadata';
import { renderAnalyzedStaff, type StaffRenderOptions } from './staff-renderer';
import { paginateScore, renderSystemSlice } from './page-layout';
import { drawsKind, isReadScan, SCAN_DRAWN_KINDS, slurEndsAcross } from './printed-marks';
import type { ParseResult, ParsedScore, VocalLineEvent } from './types';
import type { AnalyzedScore } from './analysis-types';

const fonts = new URL('../../../apps/web/static/fonts/', import.meta.url);
const readJson = (p: string): unknown => JSON.parse(readFileSync(new URL(p, fonts), 'utf8'));
const bravura = prepareSmuflFont(readJson('bravura/bravura_metadata.json'));
const maestro: PreparedSmuflFont = prepareSmuflFont(readJson('finale-maestro/FinaleMaestro.json'), bravura);

async function parseText(xml: string): Promise<ParseResult> {
	return new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document } as never);
}
const FIXTURE = readFileSync(new URL('./fixtures/n188-markings.musicxml', import.meta.url), 'utf8');
const analyse = (parsed: ParsedScore): AnalyzedScore => analyzeScore(parsed, { fR1: {} }, () => undefined, { generatedAt: '2026-10-20T00:00:00.000Z' });
const OPTS: StaffRenderOptions = { font: maestro, fontFamily: 'Finale Maestro', lineGap: 12, staffMidY: 60 };

/** A one-part score of quarter notes in 4/4 from note bodies; `body` is the inside of each `<note>` after `<pitch>`. */
function quarters(notes: string[]): string {
	const bars: string[] = [];
	for (let i = 0; i < notes.length; i += 4) bars.push(notes.slice(i, i + 4).join(''));
	const measures = bars
		.map((b, i) =>
			i === 0
				? `<measure number="1"><attributes><divisions>1</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>${b}</measure>`
				: `<measure number="${i + 1}">${b}</measure>`,
		)
		.join('');
	return `<?xml version="1.0"?><score-partwise version="4.0"><part-list><score-part id="P1"><part-name>Voice</part-name></score-part></part-list><part id="P1">${measures}</part></score-partwise>`;
}
const N = (step: string, notations = '', extra = ''): string =>
	`<note><pitch><step>${step}</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type>${extra}${notations ? `<notations>${notations}</notations>` : ''}</note>`;
const REST = (notations = ''): string => `<note><rest/><duration>1</duration><type>quarter</type>${notations ? `<notations>${notations}</notations>` : ''}</note>`;
const SLUR = (type: 'start' | 'stop', number = 1, placement?: string): string => `<slur type="${type}" number="${number}"${placement ? ` placement="${placement}"` : ''}/>`;

const slursOf = (line: readonly VocalLineEvent[]): string[] =>
	line.map((e) => (e.slurs ?? []).map((s) => `${s.type[0]}${s.number}${s.partnerEventId ? '>' + s.partnerEventId : ''}`).join(' '));

// ── A. The parser ───────────────────────────────────────────────────────────

describe('N.188 parser: printed slurs', () => {
	it('keeps a slur’s start, its stop, and the partner of each, on the fixture', async () => {
		const { score } = await parseText(FIXTURE);
		const [g4, , b4] = score.vocalLine;
		expect(g4.slurs).toEqual([{ type: 'start', number: 1, partnerEventId: b4.id }]);
		expect(b4.slurs).toEqual([{ type: 'stop', number: 1, partnerEventId: g4.id }]);
		expect(score.carriesPrintedSlurs).toBe(true);
	});

	it('keeps `placement` where the file gives one, and only then', async () => {
		const { score } = await parseText(quarters([N('C', SLUR('start', 1, 'below')), N('D'), N('E', SLUR('stop')), N('F')]));
		expect(score.vocalLine[0].slurs?.[0].placement).toBe('below');
		expect(score.vocalLine[2].slurs?.[0]).not.toHaveProperty('placement');
	});

	it('keeps both ends of a note that stops one slur and starts the next, in document order', async () => {
		const { score } = await parseText(quarters([N('C', SLUR('start')), N('D', SLUR('stop') + SLUR('start')), N('E', SLUR('stop')), N('F')]));
		const [c, d, e] = score.vocalLine;
		expect(d.slurs).toEqual([
			{ type: 'stop', number: 1, partnerEventId: c.id },
			{ type: 'start', number: 1, partnerEventId: e.id },
		]);
	});

	it('pairs nested slurs by number: 1 and 2 on the fixture’s third bar', async () => {
		const { score } = await parseText(FIXTURE);
		const bar3 = score.vocalLine.filter((e) => e.measureIndex === 2);
		const [c5, , a4, g4] = bar3;
		expect(c5.slurs).toEqual([
			{ type: 'start', number: 1, partnerEventId: g4.id },
			{ type: 'start', number: 2, partnerEventId: a4.id },
		]);
		expect(a4.slurs).toEqual([{ type: 'stop', number: 2, partnerEventId: c5.id }]);
		expect(g4.slurs).toEqual([{ type: 'stop', number: 1, partnerEventId: c5.id }]);
	});

	it('pairing policy a: a start of a number already open abandons the open one, with one warning', async () => {
		const { score, warnings } = await parseText(quarters([N('C', SLUR('start')), N('D', SLUR('start')), N('E', SLUR('stop')), N('F')]));
		const [c, d, e] = score.vocalLine;
		expect(c.slurs).toEqual([{ type: 'start', number: 1 }]);
		expect(d.slurs).toEqual([{ type: 'start', number: 1, partnerEventId: e.id }]);
		expect(warnings.filter((w) => w.code === 'slur-ends-unpaired')).toHaveLength(1);
	});

	it('pairing policy b: a stop with nothing open is left unpaired, with one warning', async () => {
		const { score, warnings } = await parseText(quarters([N('C'), N('D', SLUR('stop')), N('E'), N('F')]));
		expect(score.vocalLine[1].slurs).toEqual([{ type: 'stop', number: 1 }]);
		expect(score.carriesPrintedSlurs).toBeUndefined();
		expect(warnings.filter((w) => w.code === 'slur-ends-unpaired')).toHaveLength(1);
	});

	it('pairing policy c: an end on a rest is dropped, with a warning, and the slur it belonged to is unpaired', async () => {
		const { score, warnings } = await parseText(quarters([N('C', SLUR('start')), REST(SLUR('stop')), N('E'), N('F')]));
		expect(score.vocalLine[1].slurs).toBeUndefined();
		expect(score.vocalLine[0].slurs).toEqual([{ type: 'start', number: 1 }]);
		expect(warnings.filter((w) => w.code === 'slur-ends-unpaired').length).toBeGreaterThanOrEqual(2);
	});

	it('pairing policy d: a slur whose two ends land on one note draws nothing and says nothing', async () => {
		const { score, warnings } = await parseText(quarters([N('C', SLUR('start') + SLUR('stop')), N('D'), N('E'), N('F')]));
		expect(score.vocalLine[0].slurs).toEqual([{ type: 'start', number: 1 }, { type: 'stop', number: 1 }]);
		expect(score.carriesPrintedSlurs).toBeUndefined();
		expect(warnings.filter((w) => w.code === 'slur-ends-unpaired')).toHaveLength(0);
	});

	it('A.2a: a slur start on a grace note moves to the next kept note, a stop to the last kept note before it', async () => {
		const grace = (step: string, slur: string): string => `<note><grace/><pitch><step>${step}</step><octave>4</octave></pitch><type>eighth</type><notations>${slur}</notations></note>`;
		// grace (start) then C then D (stop): the start lands on C, so the slur is C to D.
		const a = await parseText(quarters([grace('B', SLUR('start')), N('C'), N('D', SLUR('stop')), N('E'), N('F')]));
		const [c, d] = a.score.vocalLine;
		expect(c.slurs).toEqual([{ type: 'start', number: 1, partnerEventId: d.id }]);
		// the usual grace-to-main slur: both ends end on the one kept note, and draw nothing.
		const b = await parseText(quarters([N('C'), grace('B', SLUR('start')), N('D', SLUR('stop')), N('E'), N('F')]));
		const [c2, d2] = b.score.vocalLine;
		expect(d2.slurs).toEqual([{ type: 'start', number: 1 }, { type: 'stop', number: 1 }]);
		expect(c2.slurs).toBeUndefined();
		expect(b.score.carriesPrintedSlurs).toBeUndefined();
		// a stop on a grace note moves back to the last kept note before it.
		const c3 = await parseText(quarters([N('C', SLUR('start')), N('D'), grace('E', SLUR('stop')), N('F'), N('G')]));
		const [c4, d4] = c3.score.vocalLine;
		expect(c4.slurs?.[0].partnerEventId).toBe(d4.id);
		expect(d4.slurs).toEqual([{ type: 'stop', number: 1, partnerEventId: c4.id }]);
	});

	it('a score with no slur ends carries no flag and no `slurs` field on any event', async () => {
		const { score } = await parseText(quarters([N('C'), N('D'), N('E'), N('F')]));
		expect(score.carriesPrintedSlurs).toBeUndefined();
		expect(score.vocalLine.some((e) => 'slurs' in e)).toBe(false);
	});
});

describe('N.188 parser: fermatas on rests', () => {
	it('keeps a fermata on a rest as it keeps one on a note', async () => {
		const { score } = await parseText(quarters([N('C', '<fermata/>'), REST('<fermata/>'), N('E'), N('F')]));
		expect(score.vocalLine[0].fermata).toEqual({});
		expect(score.vocalLine[1].type).toBe('rest');
		expect(score.vocalLine[1].fermata).toEqual({});
		expect(score.vocalLine[2].fermata).toBeUndefined();
	});

	it('an inverted fermata fills `placement` with below; an upright one leaves it unset', async () => {
		const { score } = await parseText(quarters([N('C', '<fermata type="inverted"/>'), REST('<fermata type="upright"/>'), N('E', '<fermata type="inverted">angled</fermata>'), N('F')]));
		expect(score.vocalLine[0].fermata).toEqual({ placement: 'below' });
		expect(score.vocalLine[1].fermata).toEqual({});
		expect(score.vocalLine[2].fermata).toEqual({ shape: 'angled', placement: 'below' });
	});

	it('the fixture’s whole-bar rest keeps its fermata', async () => {
		const { score } = await parseText(FIXTURE);
		const rest = score.vocalLine.find((e) => e.type === 'rest')!;
		expect(rest.measureIndex).toBe(6);
		expect(rest.fermata).toEqual({});
	});

	it('changes no held count: a fermata on a rest holds no note, and no note’s duration, in `noteConditions`’ sustain test', async () => {
		const withFermata = await parseText(quarters([N('C'), REST('<fermata/>'), N('E'), N('F')]));
		const without = await parseText(quarters([N('C'), REST(), N('E'), N('F')]));
		const { isLongSustain } = await import('./sustain');
		const tempos = [{ measureIndex: 0, rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } }, bpm: 60, beatUnit: 'quarter' as const, beatUnitDots: 0 }];
		const held = (s: ParsedScore): boolean[] => s.vocalLine.filter((e) => e.type === 'note').map((e) => isLongSustain(e, tempos));
		expect(held(withFermata.score)).toEqual(held(without.score));
	});
});

// ── B, C. The renderer ──────────────────────────────────────────────────────

const count = (svg: string, re: RegExp): number => (svg.match(re) ?? []).length;
const marks = (svg: string, kind: string): Array<{ y: number }> =>
	[...svg.matchAll(new RegExp(`<text data-marking="${kind}" x="[^"]*" y="([^"]*)"`, 'g'))].map((m) => ({ y: Number(m[1]) }));
/** A note head's y, from its event group's own glyph. */
const headY = (svg: string, id: string): number => Number(svg.match(new RegExp(`<g data-event-id="${id}"[^>]*>\\s*<rect[^>]*/>\\s*<text x="[^"]*" y="([^"]*)"`))![1]);
const underlayBaselines = (svg: string): string[] => [...svg.matchAll(/<text[^>]* y="([^"]*)" text-anchor="(?:middle|start)" font-size="(?:12|12\.5)"/g)].map((m) => m[1]);

describe('N.188 renderer: one arc per printed slur', () => {
	it('draws one arc for each of the fixture’s five printed slurs, and no derived melisma slur', async () => {
		const { score } = await parseText(FIXTURE);
		const svg = renderAnalyzedStaff(score, analyse(score), OPTS);
		expect(count(svg, /data-slur-printed="/g)).toBe(5);
		expect(count(svg, /data-slur="/g)).toBe(0);
	});

	it('a score that prints no slur still draws the derived melisma slur, on a file', async () => {
		const bare = FIXTURE.replace(/<slur [^>]*\/>/g, '');
		const { score } = await parseText(bare);
		expect(score.carriesPrintedSlurs).toBeUndefined();
		const svg = renderAnalyzedStaff(score, analyse(score), OPTS);
		expect(count(svg, /data-slur="/g)).toBeGreaterThanOrEqual(1);
		expect(count(svg, /data-slur-printed="/g)).toBe(0);
	});

	it('a tie under a printed slur takes the opposite bow: the slur above, the tie below', async () => {
		const tie = `<tie type="start"/>`;
		const xml = quarters([
			N('C', SLUR('start') + '<tied type="start"/>', tie + '<lyric number="1"><syllabic>single</syllabic><text>да</text></lyric>'),
			N('C', '<tied type="stop"/>', '<tie type="stop"/>'),
			N('E', SLUR('stop')),
			N('F'),
		]);
		const { score } = await parseText(xml);
		const svg = renderAnalyzedStaff(score, analyse(score), OPTS);
		expect(count(svg, /data-slur-printed="/g)).toBe(1);
		const m = svg.match(/<path d="M[\d.-]+ [\d.-]+ Q [\d.-]+ ([\d.-]+) [\d.-]+ [\d.-]+[^"]*"[^>]*data-tie="/)!;
		const endY = Number(svg.match(/<path d="M[\d.-]+ ([\d.-]+) Q [^"]*"[^>]*data-tie="/)![1]);
		expect(Number(m[1])).toBeGreaterThan(endY); // control below its ends: the tie bows down
	});

	it('draws a half slur to each system’s edge when a narrow system forces the break, and neither is cut', async () => {
		const { score } = await parseText(FIXTURE);
		const analyzed = analyse(score);
		const a = renderSystemSlice(score, analyzed, OPTS, 0, 4, { finalBarline: false, targetWidth: 900 });
		const b = renderSystemSlice(score, analyzed, OPTS, 5, 7, { finalBarline: true, targetWidth: 900 });
		expect(count(a, /data-slur-half="out"/g)).toBe(1);
		expect(count(b, /data-slur-half="in"/g)).toBe(1);
		expect(count(a, /data-slur-half="in"/g)).toBe(0);
		expect(count(b, /data-slur-half="out"/g)).toBe(0);
		// the same slur, named by its start event, on both halves
		expect(a.match(/data-slur-half="out"/)).not.toBeNull();
		const id = (s: string): string => s.match(/data-slur-printed="([^"]*)" data-slur-half/)![1];
		expect(id(a)).toBe(id(b));
		// the leaving half reaches the system's content edge: its last x is the viewBox width
		const width = Number(a.match(/viewBox="0 [\d.-]+ ([\d.]+)/)![1]);
		const end = Number(a.match(/<path d="M[\d.-]+ [\d.-]+ Q [\d.-]+ [\d.-]+ ([\d.-]+) [\d.-]+[^"]*"[^>]*data-slur-half="out"/)![1]);
		expect(end).toBeCloseTo(width, 0);
		// whole-score pagination at a narrow width splits it the same way
		const pages = paginateScore(score, analyzed, { ...OPTS, pageWidth: 520, pageHeight: 900, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 }).pages.join('\n');
		expect(count(pages, /data-slur-half="out"/g)).toBeGreaterThanOrEqual(1);
		expect(count(pages, /data-slur-half="in"/g)).toBe(count(pages, /data-slur-half="out"/g));
	});

	it('the loupe’s leaving half carries `data-slur-runon`; the page’s does not', async () => {
		const { score } = await parseText(FIXTURE);
		const analyzed = analyse(score);
		const page = renderSystemSlice(score, analyzed, OPTS, 0, 4, { finalBarline: false, targetWidth: 900 });
		const loupe = renderSystemSlice(score, analyzed, { ...OPTS, runOnTieSp: 3 }, 3, 3, { finalBarline: false });
		expect(page).not.toContain('data-slur-runon');
		expect(loupe).toContain('data-slur-runon="');
		expect(loupe).toContain('data-slur-half="out"');
	});

	it('a system between a slur’s two ends draws it edge to edge, and a loupe measure there does too', async () => {
		const { score } = await parseText(FIXTURE);
		const analyzed = analyse(score);
		const middle = renderSystemSlice(score, analyzed, OPTS, 4, 4, { finalBarline: false, targetWidth: 400 });
		expect(count(middle, /data-slur-half="through"/g)).toBe(1);
		const loupe = renderSystemSlice(score, analyzed, { ...OPTS, runOnTieSp: 3 }, 4, 4, { finalBarline: false });
		expect(loupe).toContain('data-slur-half="through"');
		expect(loupe).toContain('data-slur-runon="');
		// the notes under it take the tie’s opposite bow, as under any slur: nothing here ties, so only the arc is asserted
		expect(count(renderSystemSlice(score, analyzed, OPTS, 6, 7, { finalBarline: true, targetWidth: 400 }), /data-slur-half=/g)).toBe(0);
	});

	it('a slur whose partner is on no system draws nothing, and raises no error', async () => {
		const { score } = await parseText(FIXTURE);
		// Corrections deleted the note that ended the long slur.
		const stop = score.vocalLine.filter((e) => e.measureIndex === 5)[1];
		const edited: ParsedScore = { ...score, vocalLine: score.vocalLine.filter((e) => e.id !== stop.id) };
		const svg = renderSystemSlice(edited, analyse(edited), OPTS, 3, 5, { finalBarline: false, targetWidth: 900 });
		expect(count(svg, /data-slur-printed="/g)).toBe(0); // the long slur's start now has no partner anywhere
		expect(slurEndsAcross(edited, 3, 3).size).toBe(0);
	});
});

describe('N.188 renderer: note markings and fermatas', () => {
	it('draws one glyph per marking: two accents, a tenuto, a staccato, a breath mark, two fermatas', async () => {
		const { score } = await parseText(FIXTURE);
		const svg = renderAnalyzedStaff(score, analyse(score), OPTS);
		expect(count(svg, /data-marking="accent"/g)).toBe(2);
		expect(count(svg, /data-marking="tenuto"/g)).toBe(1);
		expect(count(svg, /data-marking="staccato"/g)).toBe(1);
		expect(count(svg, /data-marking="breath-mark"/g)).toBe(1);
		expect(count(svg, /data-marking="fermata"/g)).toBe(2);
	});

	it('puts an accent on the side away from the stem when that stays inside the stave, else above the stave', async () => {
		const { score } = await parseText(FIXTURE);
		const analyzed = analyse(score);
		const svg = renderAnalyzedStaff(score, analyzed, OPTS);
		const bar2 = score.vocalLine.filter((e) => e.measureIndex === 1);
		const aboveHead = bar2[2]; // D5; the second accent is on A4
		const [first, second] = marks(svg, 'accent');
		// D5's stem points down, so its accent stands above its head and inside the stave's reach
		expect(first.y).toBeLessThan(headY(svg, aboveHead.id));
		// A4's stem points up; an accent below it would hang under the stave, so it goes above the stave
		const staffTop = OPTS.staffMidY! - 2 * OPTS.lineGap!;
		expect(second.y).toBeLessThan(staffTop);
	});

	it('draws a staccato in a space, never on a line', async () => {
		const { score } = await parseText(FIXTURE);
		const svg = renderAnalyzedStaff(score, analyse(score), OPTS);
		const g = maestro.glyph('articStaccatoAbove');
		const ph = marks(svg, 'staccato')[0].y; // the baseline
		const ink = ph - 12 * (g.bBoxNE[1] + g.bBoxSW[1]) / 2; // the ink's centre
		const fromMid = (ink - 60) / 12;
		expect(Math.abs((fromMid % 1 + 1) % 1 - 0.5)).toBeLessThan(0.05);
	});

	it('puts a fermata above the stave and centred on its note, and over the whole-bar rest too', async () => {
		const { score } = await parseText(FIXTURE);
		const svg = renderAnalyzedStaff(score, analyse(score), OPTS);
		const staffTop = OPTS.staffMidY! - 2 * OPTS.lineGap!;
		const fermatas = [...svg.matchAll(/<text data-marking="fermata" x="([^"]*)" y="([^"]*)"/g)].map((m) => ({ x: Number(m[1]), y: Number(m[2]) }));
		expect(fermatas).toHaveLength(2);
		for (const f of fermatas) expect(f.y).toBeLessThan(staffTop);
		const g = maestro.glyph('fermataAbove');
		const note = score.vocalLine.filter((e) => e.measureIndex === 5)[3];
		const noteX = Number(svg.match(new RegExp(`<g data-event-id="${note.id}"[^>]*>\\s*<rect[^>]*/>\\s*<text x="([^"]*)"`))![1]) + 12 * 0.59; // head centre
		const centre = fermatas[0].x + 12 * (g.bBoxSW[0] + g.bBoxNE[0]) / 2;
		expect(Math.abs(centre - noteX)).toBeLessThan(2);
	});

	it('an inverted fermata goes below the stave', async () => {
		const { score } = await parseText(quarters([N('C', '<fermata type="inverted"/>', '<lyric number="1"><syllabic>single</syllabic><text>да</text></lyric>'), N('D'), N('E'), N('F')]));
		const svg = renderAnalyzedStaff(score, analyse(score), OPTS);
		const y = Number(svg.match(/<text data-marking="fermata" x="[^"]*" y="([^"]*)"/)![1]);
		expect(y).toBeGreaterThan(OPTS.staffMidY! + 2 * OPTS.lineGap!);
	});

	it('the words under the notes sit on the same baselines with and without the markings', async () => {
		const { score } = await parseText(FIXTURE);
		const bare = await parseText(
			FIXTURE.replace(/<articulations>[\s\S]*?<\/articulations>/g, '').replace(/<fermata [^>]*\/>/g, ''),
		);
		const withMarks = renderAnalyzedStaff(score, analyse(score), OPTS);
		const without = renderAnalyzedStaff(bare.score, analyse(bare.score), OPTS);
		expect(count(withMarks, /data-marking=/g)).toBe(7);
		expect(count(without, /data-marking=/g)).toBe(0);
		expect(underlayBaselines(withMarks)).toEqual(underlayBaselines(without));
		expect(underlayBaselines(withMarks).length).toBeGreaterThan(10);
	});

	it('a mark above the stave widens the viewBox upward, so nothing clips', async () => {
		const { score } = await parseText(FIXTURE);
		const top = (svg: string): number => Number(svg.match(/viewBox="0 ([\d.-]+)/)![1]);
		const without = await parseText(FIXTURE.replace(/<articulations>[\s\S]*?<\/articulations>/g, '').replace(/<fermata [^>]*\/>/g, ''));
		const t1 = top(renderAnalyzedStaff(score, analyse(score), OPTS));
		const t0 = top(renderAnalyzedStaff(without.score, analyse(without.score), OPTS));
		expect(t1).toBeLessThanOrEqual(t0);
	});

	it('marks pass clicks through to the note under them', async () => {
		const { score } = await parseText(FIXTURE);
		const svg = renderAnalyzedStaff(score, analyse(score), OPTS);
		for (const m of svg.matchAll(/<text data-marking="[^"]*"[^>]*>/g)) expect(m[0]).toContain('pointer-events="none"');
	});

	it('draws no marking without a font (primitive mode has no glyphs)', async () => {
		const { score } = await parseText(FIXTURE);
		expect(renderAnalyzedStaff(score, analyse(score), {})).not.toContain('data-marking');
	});
});

// ── D. Which kinds are drawn on a read scan ─────────────────────────────────

describe('N.188 section D: the kinds drawn on a score read from a scan', () => {
	const HOMR = '<identification><encoding><software>homr</software></encoding></identification>';
	/** The same notes, stamped the way homr stamps its own output: the parser derives the origin from this element alone. */
	const stamped = (xml: string): string => xml.replace('<work>', `${HOMR}<work>`);

	it('the list is one list: slurs, accents, fermatas', () => {
		expect([...SCAN_DRAWN_KINDS].sort()).toEqual(['accent', 'fermata', 'slur']);
	});

	it('a homr-stamped file reads as a scan; a plain one does not', async () => {
		const scan = await parseText(stamped(FIXTURE));
		const plain = await parseText(FIXTURE);
		expect(scan.score.source.origin).toBe('homr-musicxml-from-image');
		expect(isReadScan(scan.score)).toBe(true);
		expect(isReadScan(plain.score)).toBe(false);
		expect(drawsKind(scan.score, 'staccato')).toBe(false);
		expect(drawsKind(plain.score, 'staccato')).toBe(true);
	});

	it('draws the slurs, the accents, and the fermatas, and no staccato, tenuto, or breath mark, on the scan; the plain file draws all of them', async () => {
		const scan = await parseText(stamped(FIXTURE));
		const plain = await parseText(FIXTURE);
		const s = renderAnalyzedStaff(scan.score, analyse(scan.score), OPTS);
		const p = renderAnalyzedStaff(plain.score, analyse(plain.score), OPTS);
		expect(count(s, /data-slur-printed="/g)).toBe(5);
		expect(count(s, /data-marking="accent"/g)).toBe(2);
		expect(count(s, /data-marking="fermata"/g)).toBe(2);
		expect(count(s, /data-marking="staccato"/g)).toBe(0);
		expect(count(s, /data-marking="tenuto"/g)).toBe(0);
		expect(count(s, /data-marking="breath-mark"/g)).toBe(0);
		expect(count(p, /data-marking="staccato"/g)).toBe(1);
		expect(count(p, /data-marking="tenuto"/g)).toBe(1);
		expect(count(p, /data-marking="breath-mark"/g)).toBe(1);
	});

	it('draws no derived melisma slur on a scan, even on a melisma the print leaves unslurred', async () => {
		const bare = stamped(FIXTURE.replace(/<slur [^>]*\/>/g, ''));
		const scan = await parseText(bare);
		const plain = await parseText(bare.replace('homr', 'MuseScore'));
		expect(scan.score.carriesPrintedSlurs).toBeUndefined();
		expect(count(renderAnalyzedStaff(scan.score, analyse(scan.score), OPTS), /data-slur="/g)).toBe(0);
		// the same notes and syllables from a file that is not a scan: the derived slur is Ilya's rule, and it is drawn
		expect(count(renderAnalyzedStaff(plain.score, analyse(plain.score), OPTS), /data-slur="/g)).toBeGreaterThanOrEqual(1);
	});

	it('the in-tree homr pages carry no slur, accent, or staccato on the VOICE part: the marks are the piano’s', async () => {
		for (const name of ['tch-1', 'tch-2', 'tch-3', 'sun3-2']) {
			const xml = readFileSync(new URL(`../../../apps/web/src/lib/omr/fixtures/${name}.musicxml`, import.meta.url), 'utf8');
			const { score } = await parseText(xml);
			expect(isReadScan(score)).toBe(true);
			expect(score.vocalPart.partId).toBe('P1');
			expect(score.vocalLine.some((e) => e.slurs || e.articulations?.some((a) => a !== 'breath-mark'))).toBe(false);
			expect(score.carriesPrintedSlurs).toBeUndefined();
		}
	});
});

void slursOf;
