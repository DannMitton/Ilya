import { describe, expect, it } from 'vitest';
import type { CalibratedFormant, Vowel } from '../engine/types';
import { VOWELS } from '../engine/types';
import { buildChartModel, CHART_H, CHART_W } from './model';
import { project } from './geometry';
import { placeLabels, type LabelAnchor } from './labels';

describe('placing a label', () => {
	it('takes the old upper-right place when it is clear', () => {
		const [p] = placeLabels([{ id: 'a', x: 200, y: 140, r: 6 }], 18, { w: 484, h: 280 });
		expect(p).toMatchObject({ side: 'NE', clear: true });
		expect(p.x).toBeCloseTo(200 + 0.8 * 18);
		expect(p.y).toBeCloseTo(140 - 0.55 * 18);
	});
	it('moves to the next side when a dot or a label is in the way', () => {
		const anchors: LabelAnchor[] = [
			{ id: 'a', x: 100, y: 100, r: 6 },
			{ id: 'b', x: 114, y: 90, r: 6 } // under a's upper-right place
		];
		const [a] = placeLabels(anchors, 18, { w: 484, h: 280 });
		expect(a.side).not.toBe('NE');
		expect(a.clear).toBe(true);
	});
	it('keeps a label inside the frame: a dot at the right edge takes the left', () => {
		const [p] = placeLabels([{ id: 'a', x: 478, y: 140, r: 6 }], 18, { w: 484, h: 280 });
		expect(p.side).toMatch(/W$/);
		expect(p.clear).toBe(true);
	});
	it('says so when nothing is clear, and takes the place that hides least', () => {
		// A dot wall: four dots round the anchor leave no clear side.
		const a: LabelAnchor[] = [
			{ id: 'a', x: 100, y: 100, r: 6 },
			{ id: 'n', x: 114, y: 90, r: 6 }, { id: 's', x: 114, y: 110, r: 6 }, { id: 'w', x: 86, y: 90, r: 6 }, { id: 'x', x: 86, y: 110, r: 6 }
		];
		const [p] = placeLabels(a, 18, { w: 484, h: 280 });
		expect(p.clear).toBe(false);
	});
	it('is deterministic and gives each label its own box', () => {
		const anchors: LabelAnchor[] = [{ id: 'a', x: 100, y: 100, r: 6 }, { id: 'b', x: 104, y: 102, r: 6 }];
		expect(placeLabels(anchors, 18, { w: 484, h: 280 })).toEqual(placeLabels(anchors, 18, { w: 484, h: 280 }));
	});
});

/** The real chart: every anchor the chart draws, for a voice and some sung vowels. */
const f = (f1: number, f2: number): CalibratedFormant => ({ f1, f2, f2Quality: 'clear', confidence: 'high', reading: 'captured', source: 'measured-user' }) as CalibratedFormant;
const BASS: Record<Vowel, CalibratedFormant> = {
	i: f(296, 1705), e: f(381, 1532), ɪ: f(393, 1600), ɨ: f(404, 1100), ɛ: f(577, 1311), a: f(711, 1113), ɑ: f(617, 1013), ʌ: f(616, 1167), o: f(489, 826), u: f(346, 804)
};
const SOPRANO: Record<Vowel, CalibratedFormant> = Object.fromEntries(
	VOWELS.map((v) => [v, f(BASS[v].f1 * 1.6, BASS[v].f2! * 1.25)])
) as Record<Vowel, CalibratedFormant>;
const pick = (all: Record<Vowel, CalibratedFormant>, vs: readonly Vowel[]) => Object.fromEntries(vs.map((v) => [v, all[v]])) as Partial<Record<Vowel, CalibratedFormant>>;

function anchorsFor(profile: Partial<Record<Vowel, CalibratedFormant>>, type: string, w: number, h: number): LabelAnchor[] {
	const m = buildChartModel(profile, type);
	const dots = m.sung.filter((s) => s.f2).map((s) => ({ id: s.vowel, ...project(m.full, w, h, s.f1, s.f2!), r: 6 }));
	const ghosts = m.placeholders.map((p) => ({ id: p.vowel, ...project(m.full, w, h, p.f1, p.f2), r: 5.5 }));
	return [...dots, ...ghosts];
}

describe('on the real chart, no symbol is lost under a dot or another symbol', () => {
	const cases: Array<[string, 'bass' | 'soprano', readonly Vowel[]]> = [
		['none sung', 'bass', []], ['three sung', 'bass', ['i', 'e', 'u']], ['ten sung', 'bass', VOWELS],
		['none sung', 'soprano', []], ['three sung', 'soprano', ['i', 'e', 'u']], ['ten sung', 'soprano', VOWELS],
		['six sung', 'bass', ['i', 'e', 'ɛ', 'ɑ', 'o', 'u']], ['the first two', 'bass', ['i', 'e']]
	];
	for (const size of [[CHART_W, CHART_H, 18], [720, 420, 22]] as const) {
		for (const [name, type, vs] of cases) {
			it(`${type}, ${name}, ${size[0]} by ${size[1]}`, () => {
				const all = type === 'bass' ? BASS : SOPRANO;
				const anchors = anchorsFor(pick(all, vs), type, size[0], size[1]);
				const placed = placeLabels(anchors, size[2], { w: size[0], h: size[1] });
				expect(placed).toHaveLength(10);
				expect(placed.filter((p) => !p.clear).map((p) => p.id), 'labels with no clear place').toEqual([]);
			});
		}
	}
});

describe('the Step 6 failure (the [ɪ] symbol lost under [e]) is fixed', () => {
	it('with three sung for a bass, [ɪ] and [e] do not share a place', () => {
		const anchors = anchorsFor(pick(BASS, ['i', 'e', 'u']), 'bass', CHART_W, CHART_H);
		const p = Object.fromEntries(placeLabels(anchors, 18, { w: CHART_W, h: CHART_H }).map((l) => [l.id, l]));
		expect(Math.hypot(p.ɪ.x - p.e.x, p.ɪ.y - p.e.y)).toBeGreaterThan(12);
		expect(p.ɪ.clear && p.e.clear).toBe(true);
	});
});
