/**
 * N.203 lane 59 Step 5: a tap on the chart focuses a vowel. Overlapping zones resolve to the nearest dot; a tap outside every zone does nothing; the
 * tap is read against the view as it stands; a client point maps to chart units through the letterbox. And the screen's rule for a tap on a vowel, from
 * the button or the chart: it focuses at rest, ends the dwell, and does nothing during a take.
 */
import { describe, expect, it } from 'vitest';
import { buildChartModel } from './model';
import { project, zoomTarget } from './geometry';
import { CHART_W, CHART_H } from './model';
import { chartPoint, vowelForTap, zoneEllipse } from './tap';
import { focusFromDwell, tapEffect } from './screen-logic';
import type { CalibratedFormant, Vowel } from '../engine/types';

const READING = (f1: number, f2: number): CalibratedFormant => ({ f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', source: 'measured-user', plausibility: 'plausible' }) as CalibratedFormant;
const model = buildChartModel({}, 'bass');
const at = (v: Vowel) => {
	const p = model.placeholders.find((d) => d.vowel === v)!;
	return project(model.full, CHART_W, CHART_H, p.f1, p.f2);
};
const tap = (x: number, y: number, m = model, view = m.full) => vowelForTap(x, y, view, CHART_W, CHART_H, m.zones, m.sung, m.placeholders);

describe('a tap on the chart', () => {
	it('on a placeholder focuses that vowel', () => {
		for (const v of ['i', 'u', 'a'] as Vowel[]) {
			const p = at(v);
			expect(tap(p.x, p.y), v).toBe(v);
		}
	});

	it('inside overlapping zones resolves to the vowel whose dot is nearest the tap', () => {
		// Find a point inside two zones, then check the answer is the nearer dot of those two.
		let found = 0;
		for (let x = 0; x < CHART_W; x += 6) {
			for (let y = 0; y < CHART_H; y += 6) {
				const hits = model.zones.filter((z) => {
					const e = zoneEllipse(z, model.full, CHART_W, CHART_H);
					return ((x - e.cx) / e.rx) ** 2 + ((y - e.cy) / e.ry) ** 2 <= 1;
				});
				if (hits.length < 2) continue;
				const dist = (v: Vowel) => {
					const p = at(v);
					return Math.hypot(p.x - x, p.y - y);
				};
				const nearest = hits.map((z) => z.vowel).sort((a, b) => dist(a) - dist(b))[0];
				expect(tap(x, y), `${x},${y}`).toBe(nearest);
				found++;
			}
		}
		expect(found, 'the chart has overlapping zones to test').toBeGreaterThan(20);
	});

	it('outside every zone does nothing', () => {
		expect(tap(1, 1)).toBeNull();
		expect(tap(CHART_W - 1, CHART_H - 1)).toBeNull();
	});

	it('uses a sung dot where a vowel has one, not its placeholder', () => {
		const ph = model.placeholders.find((d) => d.vowel === 'i')!;
		const m = buildChartModel({ i: READING(ph.f1 * 1.02, ph.f2 * 0.97) }, 'bass'); // a reading a little off its placeholder, inside the zone
		const d = m.sung.find((s) => s.vowel === 'i')!;
		const p = project(m.full, CHART_W, CHART_H, d.f1, d.f2!);
		expect(tap(p.x, p.y, m)).toBe('i');
	});

	it('is read against the view as it stands: a zoomed view hits what is drawn', () => {
		const zone = model.zones.find((z) => z.vowel === 'e')!;
		const zoomed = zoomTarget(model.full, zone);
		const p = project(zoomed, CHART_W, CHART_H, model.placeholders.find((d) => d.vowel === 'e')!.f1, model.placeholders.find((d) => d.vowel === 'e')!.f2);
		expect(vowelForTap(p.x, p.y, zoomed, CHART_W, CHART_H, model.zones, model.sung, model.placeholders)).toBe('e');
	});
});

describe('a client point in chart units', () => {
	it('maps through a box of the frame’s own shape', () => {
		expect(chartPoint(100 + 242, 50 + 140, { left: 100, top: 50, width: 484, height: 280 }, 484, 280)).toEqual({ x: 242, y: 140 });
		expect(chartPoint(100 + 121, 50 + 70, { left: 100, top: 50, width: 242, height: 140 }, 484, 280)).toEqual({ x: 242, y: 140 });
	});
	it('centres the frame in a taller box and puts the letterbox outside it', () => {
		const box = { left: 0, top: 0, width: 484, height: 580 }; // 150 px of letterbox above and below
		expect(chartPoint(10, 10, box, 484, 280)).toBeNull();
		expect(chartPoint(242, 290, box, 484, 280)).toEqual({ x: 242, y: 140 });
	});
});

describe('what a tap on a vowel does, from the button or the chart', () => {
	it('focuses at rest', () => {
		expect(tapEffect('idle')).toBe('focus');
	});
	it('ends the dwell on the new dot and focuses', () => {
		expect(tapEffect('landing')).toBe('endDwellAndFocus');
	});
	it.each(['breathe', 'sing', 'shape', 'listening', 'sweep'] as const)('does nothing during a take (%s)', (phase) => {
		expect(tapEffect(phase)).toBe('ignore');
	});
});

describe('a tap during the dwell at the end of a re-take pass (follow-up fix 4)', () => {
	it('focuses the vowel and clears both the queued move and the queued return to the summary', () => {
		expect(focusFromDwell('o')).toEqual({ selected: 'o', pendingSelected: null, returnWhenIdle: false });
	});
});
