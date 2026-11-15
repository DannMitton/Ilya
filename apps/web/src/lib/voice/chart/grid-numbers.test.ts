/**
 * N.199 readings brief, Step 2: the grid's numbers never run together, in every frame. No browser: a number's width is
 * estimated at half an em a digit plus the 3-unit halo (`ChartLayers.svelte` `.numbers text`), the way the reviewer
 * measured it (`review-fable-brief-n199-readings_r1_2026-11-13.md`). The boxes below are computed here from the drawing's
 * own placement (a column centred on its line at `labelSize + 1`; a row from x = 3 at 3 above its line), not read from
 * `geometry.ts`, so the test does not check the rule against itself. The estimate is not the served face: the pictures are.
 */
import { describe, expect, it } from 'vitest';
import type { CalibratedFormant, Vowel } from '../engine/types';
import { VOWELS } from '../engine/types';
import { TIER1 } from '../voiceTypes';
import { tv } from '$lib/i18n';
import { buildChartModel } from './model';
import { gridTicks, axisWordBoxes, labelSizeFor, mixView, project, zoomTarget, type Box, type View } from './geometry';

const f = (f1: number, f2?: number, extra: Partial<CalibratedFormant> = {}): CalibratedFormant =>
	({ f1, ...(f2 === undefined ? {} : { f2 }), confidence: 'high', reading: 'captured', source: 'measured-user', ...extra }) as CalibratedFormant;
type Profile = Partial<Record<Vowel, CalibratedFormant>>;
/** Part sung: two ordinary readings, one far outside its zone (it widens the view), one with no fR2. */
const PART: Profile = { i: f(296, 1705), u: f(346, 804), ɑ: f(1100, 2900), e: f(381) };
const PROFILES: Array<[string, Profile]> = [['empty', {}], ['part sung', PART]];
const VOICES: Array<string | undefined> = [...TIER1, undefined];

const digitBox = (text: string, x: number, baseline: number, ls: number, anchor: 'middle' | 'start'): Box => {
	const w = text.length * 0.5 * ls + 3;
	const x0 = anchor === 'middle' ? x - w / 2 : x - 1.5;
	return { x0, x1: x0 + w, y0: baseline - 0.75 * ls - 1.5, y1: baseline + 1.5 };
};
const overlaps = (a: Box, b: Box) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

/** Every number box the drawing would paint for a view in a frame, labelled. */
function drawn(view: View, w: number, h: number, ls: number, words: Box[]) {
	const g = gridTicks(view, w, h, ls, words);
	const boxes: Array<{ id: string; box: Box }> = [];
	for (const hz of g.f2Numbers) boxes.push({ id: `col ${hz}`, box: digitBox(String(hz), project(view, w, h, 1, hz).x, ls + 1, ls, 'middle') });
	for (const hz of g.f1Numbers) boxes.push({ id: `row ${hz}`, box: digitBox(String(hz), 3, project(view, w, h, hz, 1).y - 3, ls, 'start') });
	return { g, boxes };
}

/** The views a screen shows: the full view, the zoom to each vowel, and the eased views between. */
function viewsOf(profile: Profile, voice: string | undefined): Array<[string, View]> {
	const m = buildChartModel(profile, voice);
	const out: Array<[string, View]> = [['full', m.full]];
	for (const v of VOWELS) {
		const z = m.zones.find((q) => q.vowel === v)!;
		const have = profile[v];
		const target = zoomTarget(m.full, z, have ? [{ f1: have.f1, f2: have.f2 }] : []);
		out.push([`zoom ${v}`, target]);
		for (const t of [0.25, 0.5, 0.75]) out.push([`mix ${v} ${t}`, mixView(m.full, target, t)]);
	}
	return out;
}

const FRAMES: Array<{ name: string; w: number; h: number; rendered: number[]; words: boolean; css: (frameW: number, rendered: number) => number }> = [
	// The capture chart: 484 by 280 units, numbers sized to hold 11 CSS px (`VowelChart.svelte`).
	{ name: 'capture chart', w: 484, h: 280, rendered: [320, 484, 700], words: true, css: (fw, r) => labelSizeFor(fw, r) },
	// The sheet on screen: 720 by 420 units, numbers 11 CSS px (Step 4).
	{ name: 'sheet on screen', w: 720, h: 420, rendered: [300, 430, 720], words: false, css: (fw, r) => labelSizeFor(fw, r) },
	// The sheet in print: 720 by 360 units, numbers 12 units as today.
	{ name: 'sheet in print', w: 720, h: 360, rendered: [720], words: false, css: () => 12 }
];

describe('the grid numbers never run together', () => {
	for (const frame of FRAMES) {
		for (const lang of frame.words ? (['en', 'fr'] as const) : (['en'] as const)) {
			it(`${frame.name}${frame.words ? ` (${lang})` : ''}: no number meets another number, an axis word, or the frame, for every voice type, view, and width`, () => {
				let checked = 0;
				for (const rendered of frame.rendered) {
					const ls = frame.css(frame.w, rendered);
					const words = frame.words
						? axisWordBoxes(frame.w, frame.h, ls, { front: tv('sheet.axis.front', lang), back: tv('sheet.axis.back', lang), open: tv('sheet.axis.open', lang) })
						: [];
					for (const voice of VOICES) {
						for (const [pname, profile] of PROFILES) {
							for (const [vname, view] of viewsOf(profile, voice)) {
								const { boxes } = drawn(view, frame.w, frame.h, ls, words);
								const where = `${frame.name} ${rendered}px ${voice ?? 'no type'} ${pname} ${vname}`;
								for (const a of boxes) {
									expect(a.box.x0, `${where}: ${a.id} past the left edge`).toBeGreaterThanOrEqual(0);
									expect(a.box.y0, `${where}: ${a.id} past the top edge`).toBeGreaterThanOrEqual(0);
									expect(a.box.x1, `${where}: ${a.id} past the right edge`).toBeLessThanOrEqual(frame.w);
									expect(a.box.y1, `${where}: ${a.id} past the bottom edge`).toBeLessThanOrEqual(frame.h);
									for (const wb of words) expect(overlaps(a.box, wb), `${where}: ${a.id} meets an axis word`).toBe(false);
								}
								for (let i = 0; i < boxes.length; i++)
									for (let j = i + 1; j < boxes.length; j++)
										expect(overlaps(boxes[i].box, boxes[j].box), `${where}: ${boxes[i].id} meets ${boxes[j].id}`).toBe(false);
								checked++;
							}
						}
					}
				}
				// Every width, ten voices (nine types and none), two profiles, and the full view with ten zooms and thirty mixes.
				expect(checked).toBe(frame.rendered.length * VOICES.length * PROFILES.length * (1 + 10 * 4));
			}, 120_000);
		}
	}

	it('positive control: with a number on every line, as before, this instrument finds column numbers running together at 320 px', () => {
		const ls = labelSizeFor(484, 320);
		let overlapping = 0;
		let views = 0;
		for (const voice of VOICES) {
			for (const [, view] of viewsOf({}, voice)) {
				views++;
				const g = gridTicks(view, 484, 280, ls);
				const cols = g.f2
					.map((hz) => ({ hz, x: project(view, 484, 280, 1, hz).x }))
					.filter((c) => c.x > 0 && c.x < 484)
					.map((c) => digitBox(String(c.hz), c.x, ls + 1, ls, 'middle'));
				if (cols.some((a, i) => cols.slice(i + 1).some((b) => overlaps(a, b)))) overlapping++;
			}
		}
		// The reviewer counted 24 of 110 at rest; these are 410 views, zooms and mixes included.
		expect(overlapping, `${overlapping} of ${views} views`).toBeGreaterThan(0);
	});

	it('keeps the lines as dense as before: thinning a number takes no line away', () => {
		const m = buildChartModel({}, 'tenor');
		const dense = gridTicks(m.full, 484, 280, 11);
		const thin = gridTicks(m.full, 484, 280, 17, axisWordBoxes(484, 280, 17, { front: 'tongue forward', back: 'tongue back', open: 'mouth more open' }));
		expect(thin.f2).toEqual(dense.f2);
		expect(thin.f1).toEqual(dense.f1);
		expect(thin.f2Numbers.length).toBeLessThan(thin.f2.length);
		for (const hz of thin.f2Numbers) expect(thin.f2).toContain(hz);
		for (const hz of thin.f1Numbers) expect(thin.f1).toContain(hz);
	});

	it('the rounder number is the one kept when two meet', () => {
		// A view 900 to 1900 Hz wide in 150 units: lines at minPx 12 every 100 Hz sit about 20 units apart, far closer than four digits at 17 units.
		const view: View = { u0: Math.log(1900), u1: Math.log(900), v0: Math.log(300), v1: Math.log(700) };
		const g = gridTicks(view, 150, 280, 17, [], 12);
		expect(g.f2.length).toBeGreaterThan(g.f2Numbers.length);
		expect(g.f2Numbers).toContain(1000);
	});

	it('draws a number for a line in a roomy frame, so the rule does not thin what fits', () => {
		const m = buildChartModel({}, 'bass');
		const g = gridTicks(m.full, 484, 280, 11, axisWordBoxes(484, 280, 11, { front: 'tongue forward', back: 'tongue back', open: 'mouth more open' }));
		expect(g.f2Numbers.length).toBeGreaterThanOrEqual(3);
		expect(g.f1Numbers.length).toBeGreaterThanOrEqual(2);
	});
});
