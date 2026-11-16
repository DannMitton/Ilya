import { describe, expect, it } from 'vitest';
import { FINAL, FIRST_FRAME, HOLD_MS, IMAGE_COUNT, LAST_IMAGE, LEAVE_MS, SHEET_LEAVE_MS, STATION_AT, STATION_OF_IMAGE, WIPE_MS, plan, totalMs, turns } from './welcome-motion';

describe('the plate\'s motion (the ratified prototype\'s script: WIPE 720, HOLD 380, FIRST 700, STATION [0,0,1,2,2,-1])', () => {
	it('is six images and five turns', () => {
		expect(IMAGE_COUNT).toBe(6);
		expect(turns().map((t) => t.image)).toEqual([1, 2, 3, 4, 5]);
	});

	it('turns once, in order, each a wipe then a rest', () => {
		const ts = turns();
		for (let i = 1; i < ts.length; i++) expect(ts[i].startMs - ts[i - 1].startMs).toBe(WIPE_MS + HOLD_MS);
		expect(ts[0].startMs).toBe(250 + 700);
		expect(ts.map((t) => t.startMs)).toEqual([950, 2050, 3150, 4250, 5350]);
	});

	it('runs about 5.5 seconds in all, from the first frame to the last wipe\'s end', () => {
		expect(totalMs()).toBe(5350 + 720);
		expect(totalMs()).toBeGreaterThan(5000);
		expect(totalMs()).toBeLessThan(6500);
	});

	it('lights a station label 45 percent of the way into the wipe that brings its image', () => {
		for (const t of turns()) expect(t.stationMs - t.startMs).toBe(Math.round(WIPE_MS * STATION_AT));
	});

	it('names the station each image belongs to: TEXT, TEXT, MELODY, INSIGHTS, INSIGHTS, then all at rest', () => {
		expect(STATION_OF_IMAGE).toEqual([0, 0, 1, 2, 2, -1]);
		expect(STATION_OF_IMAGE).toHaveLength(IMAGE_COUNT);
	});

	it('starts with image 0 shown and TEXT lit, so everything is readable on the first frame (nothing is hidden)', () => {
		expect(FIRST_FRAME).toEqual({ turned: 0, station: 0 });
	});

	it('ends with every image turned and the three labels resting', () => {
		expect(FINAL).toEqual({ turned: LAST_IMAGE, station: -1 });
	});

	it('leaves in 260 ms for the scrim and 180 ms for the sheet, as the prototype has them (the sheet stays mounted for the longer)', () => {
		expect(LEAVE_MS).toBe(260);
		expect(SHEET_LEAVE_MS).toBe(180);
		expect(LEAVE_MS).toBeGreaterThanOrEqual(SHEET_LEAVE_MS);
	});

	describe('prefers-reduced-motion', () => {
		it('shows the final state with no motion: no turn, no timer', () => {
			const p = plan(true);
			expect(p.animate).toBe(false);
			expect('turns' in p).toBe(false);
			if (!p.animate) expect(p.state).toEqual({ turned: 5, station: -1 });
		});
		it('otherwise plans the five turns', () => {
			const p = plan(false);
			expect(p.animate).toBe(true);
			if (p.animate) expect(p.turns).toHaveLength(5);
		});
	});
});
