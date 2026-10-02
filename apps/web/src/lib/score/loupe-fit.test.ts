/**
 * One notation size per song, and the zoom (loupe remainder brief, item 4,
 * 2026-10-02). Expected values are written by hand from the rulings and the
 * code defaults `loupe-fit.ts` names.
 */
import { describe, expect, it } from 'vitest';
import type { ParsedScore } from '@ilya/score-parser';
import {
	denseMeasures,
	fitSong,
	floorFactor,
	LEGIBLE_STAVE_SPACE_PX,
	measureHold,
	median,
	singingMeasures,
	songKey,
	zoomFactor,
	ZOOM_LIMIT,
	ZOOM_STEP,
} from './loupe-fit';
import { loupeZoom, songSizes } from './loupe-fit.svelte';

describe('the zoom', () => {
	it('steps by a quarter either way and stops at three steps each side', () => {
		expect(zoomFactor(0)).toBe(1);
		expect(zoomFactor(1)).toBeCloseTo(1.25, 10);
		expect(zoomFactor(-1)).toBeCloseTo(0.8, 10);
		expect(zoomFactor(99)).toBeCloseTo(ZOOM_STEP ** ZOOM_LIMIT, 10);
		expect(zoomFactor(-99)).toBeCloseTo(ZOOM_STEP ** -ZOOM_LIMIT, 10);
	});

	it('holds its steps and refuses to pass its limits', () => {
		loupeZoom.steps = 0;
		for (let i = 0; i < 10; i++) loupeZoom.zoomIn();
		expect(loupeZoom.steps).toBe(ZOOM_LIMIT);
		expect(loupeZoom.canIn).toBe(false);
		expect(loupeZoom.canOut).toBe(true);
		for (let i = 0; i < 10; i++) loupeZoom.zoomOut();
		expect(loupeZoom.steps).toBe(-ZOOM_LIMIT);
		expect(loupeZoom.canOut).toBe(false);
		loupeZoom.steps = 0;
		expect(loupeZoom.factor).toBe(1);
	});
});

describe('which measures are dense', () => {
	it('median of odd and even lists', () => {
		expect(median([3, 1, 2])).toBe(2);
		expect(median([4, 1, 3, 2])).toBe(2.5);
		expect(median([])).toBe(0);
	});

	it('calls a strip wider than 1.6 times the median dense, and nothing under three strips', () => {
		expect(denseMeasures([100, 100, 100, 100, 161])).toEqual([false, false, false, false, true]);
		expect(denseMeasures([100, 100, 100, 100, 160])).toEqual([false, false, false, false, false]);
		expect(denseMeasures([100, 900])).toEqual([false, false]);
	});
});

describe('the legible floor', () => {
	it('lowers a desk figure to the printed stave space and leaves a smaller one alone', () => {
		expect(LEGIBLE_STAVE_SPACE_PX).toBe(6.5);
		expect(floorFactor(13)).toBeCloseTo(0.5, 10);
		expect(floorFactor(12)).toBeCloseTo(6.5 / 12, 10);
		expect(floorFactor(6.2)).toBe(1);
		expect(floorFactor(6.5)).toBe(1);
	});
});

describe('fitSong', () => {
	const now = () => Promise.resolve();
	const fit = (widths: Record<number, (f: number) => number>, room: number, floor = 0.5, alive = () => true) =>
		fitSong({
			measures: Object.keys(widths).map(Number),
			widthAt: (m, f) => widths[m](f),
			room,
			floor,
			yieldTurn: now,
			alive,
		});

	it('answers 1 when every measure fits', async () => {
		expect(await fit({ 0: () => 400, 1: () => 500, 2: () => 450 }, 600)).toBe(1);
	});

	it('lowers the size to the widest ordinary measure, and a dense one scrolls', async () => {
		// Linear strips: the 800 sets the size (600 / 800 = 0.75); the 1500 is dense (1500 > 1.6 x median 700).
		const f = await fit({ 0: (k) => 700 * k, 1: (k) => 800 * k, 2: (k) => 600 * k, 3: (k) => 1500 * k }, 600);
		expect(f).toBe(0.75);
	});

	it('measures a limiting strip again at the new size', async () => {
		// width(k) = 400 + 400k, room 700, medians keep it ordinary. Pass 1: 800 > 700, k = 0.875 -> 0.88 (settled).
		// Measured again: 752. That shrank 6% against the notation's 12%, so it answers (over a quarter of the drop).
		// Pass 2: 752 > 700, k = 0.88 x 700 / 752 = 0.82; measured: 728. Pass 3: 728 > 700, k = 0.82 x 700 / 728 = 0.79.
		const f = await fit({ 0: (k) => 400 + 400 * k, 1: () => 650, 2: () => 650 }, 700);
		expect(f).toBe(0.79);
	});

	it('sets aside a strip that does not shrink at all, and does not drag the others down', async () => {
		// Measure 0 is all tap floor: 700 whatever the size. Measure 1 scales and needs 0.75.
		const f = await fit({ 0: () => 700, 1: (k) => 800 * k, 2: (k) => 400 * k }, 600);
		expect(f).toBe(0.75);
	});

	it('answers 1 when the only strips that limit it do not answer to the size', async () => {
		expect(await fit({ 0: () => 700, 1: () => 300, 2: () => 300 }, 600)).toBe(1);
	});

	it('never goes below the floor', async () => {
		expect(await fit({ 0: (k) => 2000 * k, 1: (k) => 1000 * k, 2: (k) => 1000 * k }, 500, 0.7)).toBe(0.7);
	});

	it('answers 1 without measuring anything where the base is already at the floor', async () => {
		let calls = 0;
		const f = await fitSong({ measures: [0, 1], widthAt: () => (calls++, 9999), room: 100, floor: 1, yieldTurn: now, alive: () => true });
		expect([f, calls]).toEqual([1, 0]);
	});

	it('answers null when the loupe goes away part way', async () => {
		let n = 0;
		expect(await fit({ 0: () => 900, 1: () => 900, 2: () => 900 }, 600, 0.5, () => n++ < 1)).toBeNull();
	});

	it('skips a measure that cannot be drawn', async () => {
		const f = await fitSong({ measures: [0, 1, 2], widthAt: (m, k) => (m === 1 ? null : 700 * k), room: 600, floor: 0.5, yieldTurn: now, alive: () => true });
		expect(f).toBeCloseTo(0.86, 2);
	});
});

describe('a song and its measures', () => {
	const ev = (id: string, measureIndex: number, type: 'note' | 'rest' = 'note') => ({ id, measureIndex, type }) as never;
	const score = {
		workMetadata: { title: 'Sunless' },
		measures: [
			{ index: 0, timeSignature: { beats: 12, beatType: 8 } },
			{ index: 1, timeSignature: { beats: 6, beatType: 8 } },
		],
		vocalLine: [ev('a', 0), ev('b', 0, 'rest'), ev('c', 1)],
	} as unknown as ParsedScore;

	it('names the measures the song sings in', () => {
		expect(singingMeasures(score.vocalLine)).toEqual([0, 1]);
	});

	it('rebuilds a measure\'s hold: ids without rests, positions, and its own meter', () => {
		const h = measureHold(score, 0);
		expect(h.ids).toEqual(['a']);
		expect(h.meter).toEqual({ beats: 12, beatType: 8 });
		expect(h.positions.length).toBeGreaterThan(0);
		expect(measureHold(score, 1).meter).toEqual({ beats: 6, beatType: 8 });
	});

	it('keys a song by title, measure count, first event, and the room, not by its event count', () => {
		const k = songKey(score, 1200, false);
		expect(k).toBe('Sunless|2|a|150|d');
		const more = { ...score, vocalLine: [...score.vocalLine, ev('d', 1)] } as ParsedScore;
		expect(songKey(more, 1200, false)).toBe(k);
		expect(songKey(score, 1203, false)).toBe(k);
		expect(songKey(score, 900, false)).not.toBe(k);
	});
});

describe('the session\'s sizes', () => {
	it('is 1 until a fit finishes, starts one fit per song, and holds the answer', () => {
		expect(songSizes.get('t|1')).toBe(1);
		expect(songSizes.begin('t|1')).toBe(true);
		expect(songSizes.begin('t|1')).toBe(false); // running
		songSizes.finish('t|1', 0.8);
		expect(songSizes.get('t|1')).toBe(0.8);
		expect(songSizes.begin('t|1')).toBe(false); // has a size
	});

	it('lets an abandoned fit begin again', () => {
		expect(songSizes.begin('t|2')).toBe(true);
		songSizes.finish('t|2', null);
		expect(songSizes.get('t|2')).toBe(1);
		expect(songSizes.begin('t|2')).toBe(true);
	});
});
