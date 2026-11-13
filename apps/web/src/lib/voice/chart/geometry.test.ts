import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { computeZones } from './zones';
import {
	BOZEMAN_FR2_HZ, EXTRACTOR_FR1_HZ, EXTRACTOR_FR2_HZ, ZOOM_MAX, ZOOM_MIN,
	ease, fullView, hull, mixView, project, zoomFactor, zoomTarget, type View
} from './geometry';

const L = Math.log;

describe('the extractor ranges are the extractor’s', () => {
	it('reads extract.ts line 9 and fails if the two numbers drift', () => {
		const src = readFileSync(join(__dirname, '../engine/extract.ts'), 'utf8');
		const m = src.match(/const F1R: \[number, number\] = \[(\d+), (\d+)\], F2R: \[number, number\] = \[(\d+), (\d+)\]/);
		expect(m, 'extract.ts no longer declares F1R and F2R in this shape').not.toBeNull();
		expect([+m![1], +m![2]]).toEqual([EXTRACTOR_FR1_HZ.low, EXTRACTOR_FR1_HZ.high]);
		expect([+m![3], +m![4]]).toEqual([EXTRACTOR_FR2_HZ.low, EXTRACTOR_FR2_HZ.high]);
	});
	it('Bozeman’s F5 and D7 are the equal-tempered frequencies', () => {
		expect(BOZEMAN_FR2_HZ.low).toBeCloseTo(440 * Math.pow(2, (77 - 69) / 12), 1); // F5 is MIDI 77
		expect(BOZEMAN_FR2_HZ.high).toBeCloseTo(440 * Math.pow(2, (98 - 69) / 12), 1); // D7 is MIDI 98
	});
});

describe('the full view', () => {
	const contains = (v: View, f1: number, f2: number) => L(f2) <= v.u0 && L(f2) >= v.u1 && L(f1) >= v.v0 && L(f1) <= v.v1;

	it('runs fR2 high to low from left to right and fR1 low to high from top to bottom', () => {
		const v = fullView(computeZones({}, 'bass').zones);
		expect(v.u0).toBeGreaterThan(v.u1);
		expect(v.v1).toBeGreaterThan(v.v0);
	});

	for (const type of ['bass', 'tenor', 'soprano', undefined] as Array<string | undefined>) {
		it(`holds every zone centre and every placeholder, ${type ?? 'no type'}`, () => {
			const { zones, placeholders } = computeZones({}, type);
			const v = fullView(zones, placeholders);
			for (const z of zones) expect(contains(v, Math.sqrt(z.f1Low * z.f1High), z.f2Centre), z.vowel).toBe(true);
			for (const p of placeholders) expect(contains(v, p.f1, p.f2), p.vowel).toBe(true);
		});
	}

	it('holds a reading that lands far outside the zones, and one with no fR2 by its fR1', () => {
		const { zones } = computeZones({}, 'bass');
		const v = fullView(zones, [{ f1: 1000, f2: 2800 }, { f1: 180 }]);
		expect(contains(v, 1000, 2800)).toBe(true);
		expect(L(180)).toBeGreaterThanOrEqual(v.v0);
	});

	it('never goes beyond the extractor’s search range, however far a point lies', () => {
		const v = fullView([], [{ f1: 5000, f2: 9000 }, { f1: 20, f2: 100 }]);
		expect(v.u0).toBeLessThanOrEqual(L(EXTRACTOR_FR2_HZ.high) + 1e-12);
		expect(v.u1).toBeGreaterThanOrEqual(L(EXTRACTOR_FR2_HZ.low) - 1e-12);
		expect(v.v0).toBeGreaterThanOrEqual(L(EXTRACTOR_FR1_HZ.low) - 1e-12);
		expect(v.v1).toBeLessThanOrEqual(L(EXTRACTOR_FR1_HZ.high) + 1e-12);
	});

	it('holds fR2 to Bozeman’s F5 to D7 where the data lie inside it, and lets data outside it through', () => {
		const inside = fullView([], [{ f1: 300, f2: 800 }, { f1: 600, f2: 1500 }]);
		expect(inside.u1).toBeGreaterThanOrEqual(L(BOZEMAN_FR2_HZ.low) - 1e-12);
		expect(inside.u0).toBeLessThanOrEqual(L(BOZEMAN_FR2_HZ.high) + 1e-12);
		const outside = fullView([], [{ f1: 300, f2: 560 }, { f1: 600, f2: 2800 }]);
		expect(outside.u1).toBeLessThan(L(560));
		expect(outside.u0).toBeGreaterThan(L(2800));
	});

	it('frames nothing as the extractor’s own range', () => {
		const v = fullView([]);
		expect(v.u0).toBeCloseTo(L(3000));
		expect(v.v1).toBeCloseTo(L(1200));
	});
});

describe('the zoom to one vowel', () => {
	const { zones } = computeZones({}, 'bass');
	const full = fullView(zones, []);
	const z = Object.fromEntries(zones.map((q) => [q.vowel, q]));

	it('lies between 1.4 and 3.2 times, and is centred on the zone', () => {
		for (const q of zones) {
			const t = zoomTarget(full, q);
			const k = zoomFactor(full, t);
			expect(k).toBeGreaterThanOrEqual(ZOOM_MIN - 1e-9);
			expect(k).toBeLessThanOrEqual(ZOOM_MAX + 1e-9);
			expect((t.u0 + t.u1) / 2).toBeCloseTo(L(q.f2Centre), 6);
			expect((t.v0 + t.v1) / 2).toBeCloseTo((L(q.f1Low) + L(q.f1High)) / 2, 6);
		}
	});

	it('is widened to contain a reading that lands outside its zone, with room', () => {
		const q = z.i;
		const plain = zoomTarget(full, q);
		const far = { f1: 600, f2: 900 };
		expect(L(far.f2)).toBeLessThan(plain.u1);
		const wide = zoomTarget(full, q, [far]);
		expect(L(far.f2)).toBeGreaterThan(wide.u1);
		expect(L(far.f1)).toBeLessThan(wide.v1);
		expect(zoomFactor(full, wide)).toBeLessThan(zoomFactor(full, plain));
		// A reading already inside changes nothing.
		expect(zoomTarget(full, q, [{ f1: Math.sqrt(q.f1Low * q.f1High), f2: q.f2Centre }])).toEqual(plain);
	});

	it('a reading with no fR2 widens along fR1 only', () => {
		const q = z.i;
		const plain = zoomTarget(full, q);
		const wide = zoomTarget(full, q, [{ f1: 800 }]);
		expect(wide.u0).toBe(plain.u0);
		expect(wide.u1).toBe(plain.u1);
		expect(wide.v1).toBeGreaterThan(plain.v1);
	});
});

describe('the eased mix', () => {
	const a: View = { u0: 8, u1: 6, v0: 5, v1: 7 };
	const b: View = { u0: 7.5, u1: 7, v0: 5.5, v1: 6 };
	it('starts at a, ends at b, passes the middle at the middle, and is clamped', () => {
		expect(mixView(a, b, 0)).toEqual(a);
		expect(mixView(a, b, 1)).toEqual(b);
		expect(mixView(a, b, -3)).toEqual(a);
		expect(mixView(a, b, 9)).toEqual(b);
		expect(ease(0.5)).toBeCloseTo(0.5);
		expect(mixView(a, b, 0.5).u0).toBeCloseTo((a.u0 + b.u0) / 2);
		expect(ease(0.25)).toBeLessThan(0.25);
		expect(ease(0.75)).toBeGreaterThan(0.75);
	});
});

describe('project', () => {
	const v: View = { u0: L(2000), u1: L(500), v0: L(200), v1: L(800) };
	it('puts high fR2 at the left and low fR1 at the top', () => {
		expect(project(v, 400, 300, 200, 2000)).toEqual({ x: 0, y: 0 });
		const br = project(v, 400, 300, 800, 500);
		expect(br.x).toBeCloseTo(400);
		expect(br.y).toBeCloseTo(300);
		expect(project(v, 400, 300, 400, 1000).x).toBeCloseTo(200);
		expect(project(v, 400, 300, 400, 1000).y).toBeCloseTo(150);
	});
});

describe('the hull', () => {
	it('is empty for fewer than three points or collinear ones', () => {
		expect(hull([])).toEqual([]);
		expect(hull([[0, 0], [1, 1]])).toEqual([]);
		expect(hull([[0, 0], [1, 1], [2, 2]])).toEqual([]);
	});
	it('drops an interior point and keeps the corners', () => {
		const h = hull([[0, 0], [4, 0], [4, 4], [0, 4], [2, 2]]);
		expect(h).toHaveLength(4);
		expect(h).not.toContainEqual([2, 2]);
	});
	it('of a triangle is the triangle', () => {
		expect(hull([[0, 0], [3, 0], [0, 3]])).toHaveLength(3);
	});
});
