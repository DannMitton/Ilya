/**
 * After the desk's review of strophic lane A (Fable's as-built review, 2026-11-16): three defects at the seam and the
 * renderer, each shown here by a test written before its fix.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser } from './musicxml-parser';
import { parseXml } from './mini-xml.test-support';
import { analyzeScore } from './overlay-engine';
import { paginateScore } from './page-layout';
import { layoutColumns, TACET_REST } from './staff-renderer';
import { renderScoreOf, derivedId } from './render-score';
import { systemSeam } from './render-seam';
import type { ParsedScore } from './types';

async function load(name: string): Promise<ParsedScore> {
	const xml = readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document } as never)).score;
}
const TEXT = { label: (k: number) => `Verse ${k}`, tag: (bar: string, k: number) => `${bar} · verse ${k}` };
const labels = (svg: string) => [...svg.matchAll(/<text data-verse-label="(\d+)" x="([-\d.]+)"/g)].map((m) => ({ k: Number(m[1]), x: Number(m[2]) }));

function pages(score: ParsedScore, width: number) {
	const r = renderScoreOf(score);
	const analyzed = analyzeScore(r.score, { fR1: {} }, () => undefined, { generatedAt: '2026-11-16T00:00:00.000Z' });
	const out = paginateScore(r.score, analyzed, { pageWidth: width, pageHeight: 4000, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, breakRunsAt: r.boundaries, seam: systemSeam(r.bars, TEXT) });
	return { r, out };
}

describe('fix 1: the label over a pass that begins on a rest', () => {
	it('stands at the rest, not at the system edge', async () => {
		const p = await load('strophic-repeat.musicxml');
		// the passage's first note (source bar 3, first event) becomes a rest, in every verse
		const first = p.vocalLine.find((e) => e.measureIndex === 3)!;
		const at = p.vocalLine.indexOf(first);
		const { syllable: _s, pitch: _p, ...rest } = first;
		void _s;
		void _p;
		p.vocalLine[at] = { ...rest, type: 'rest' } as never;
		const { r, out } = pages(p, 624);
		const found = out.systems.flatMap((s) => labels(s.svg));
		expect(found.map((l) => l.k)).toEqual([2, 3]);
		for (const l of found) {
			const id = derivedId(first.id, l.k);
			const sys = out.systems.find((s) => s.svg.includes(`data-verse-hit="${id}"`))!;
			const i = sys.svg.indexOf(`data-verse-hit="${id}"`);
			const body = sys.svg.slice(i, sys.svg.indexOf('</g>', i));
			const glyph = Number(/<rect x="([-\d.]+)"|<text [^>]*?\bx="([-\d.]+)"/.exec(body.replace(/<rect data-verse-hit[^>]*>/, ''))!.slice(1).find(Boolean));
			expect(l.x, `label ${l.k} at the rest's own ink`).toBeCloseTo(glyph, 1);
			expect(l.x).toBeGreaterThan(0);
		}
		expect(r.bars[9].first).toBeTruthy();
	});
});

describe('fix 2: the label over a tacet bar in a system that does not start at bar 0', () => {
	it('stands over the tacet bar at a narrow page', async () => {
		const p = await load('strophic-tacet-boundary.musicxml');
		const { r, out } = pages(p, 200);
		const k2 = out.systems.filter((s) => labels(s.svg).some((l) => l.k === 2));
		expect(k2).toHaveLength(1);
		const sys = k2[0];
		expect(sys.fromMeasure, 'the system is not the first').toBeGreaterThan(0);
		expect(r.bars[sys.fromMeasure + 0].source).toBeDefined();
		const labelBar = r.bars.findIndex((b) => b.label === 2);
		const tacet = new RegExp(`<g data-tacet="${labelBar}-`).exec(sys.svg);
		expect(tacet, 'the tacet group of the labelled bar is in this system, by its printed index').not.toBeNull();
		const body = sys.svg.slice(tacet!.index, sys.svg.indexOf('</g>', tacet!.index));
		const left = Math.min(...[...body.matchAll(/\s(?:x|x1)="([-\d.]+)"/g)].map((m) => Number(m[1])));
		expect(labels(sys.svg)[0].x).toBeCloseTo(left, 1);
		expect(labels(sys.svg)[0].x).toBeGreaterThan(0);
	});
});

describe('fix 3: two tacet bars that meet at a pass boundary', () => {
	it('the second tacet column pays the width the first one owes', async () => {
		const p = await load('strophic-tacet-boundary.musicxml');
		const r = renderScoreOf(p);
		const lineGap = 12;
		const { columns } = layoutColumns(r.score, { lineGap, breakRunsAt: r.boundaries });
		const tacetAt = columns.map((c, i) => (c.tacet ? i : -1)).filter((i) => i >= 0);
		const pair = tacetAt.find((i, k) => tacetAt[k + 1] === i + 1);
		expect(pair, 'two tacet columns are adjacent').toBeDefined();
		expect(columns[pair! + 1].advance).toBeGreaterThanOrEqual(TACET_REST.measureSp * lineGap);
	});
});
