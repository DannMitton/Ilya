/**
 * Row 181 step 3: where each system's lyric band stood, kept as fractions of the page with the reading
 * (`kept-bands.ts`); what the song keeps (`applyUnderlay`); the strip's measure (`band-strip.ts`); and the library round trip.
 */
import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { bandFractions, bandRect, isKeptSystems, type KeptSystem } from './kept-bands';
import { cutBandStrip, maybeMeasureStrips, measureBandStrips, stripsLine, stripsMeasureOn, type StripDeps } from './band-strip';
import { applyUnderlay } from './underlay-song';
import { seatPage, type PageLayout, type Seams, type SystemLayout, type UnderlayPage, type WordBox } from './underlay-page';
import { createIndexedDbDriver, openLibraryDatabase, type SourceBytes, type StorageDriver } from '../library/driver';
import { emptySongRecord } from '../library/types';

describe('bandFractions and bandRect', () => {
	it('keeps the band and the staff space as fractions of the page, so they hold at any dpi', () => {
		const f = bandFractions({ x0: 0, x1: 2480, y0: 700, y1: 1000 }, 31, 2480, 3508);
		expect(f).toEqual({ x0: 0, x1: 1, y0: 0.19954, y1: 0.28506, space: 0.00884 });
		// The same fractions on a page rendered at half the size give the same band at half the pixels.
		const full = bandRect(f!, 2480, 3508)!;
		const half = bandRect(f!, 1240, 1754)!;
		expect(half.width).toBe(1240);
		expect(Math.abs(half.y * 2 - full.y)).toBeLessThanOrEqual(2);
		expect(Math.abs(half.height * 2 - full.height)).toBeLessThanOrEqual(2);
	});

	it('gives null for a page with no size and a rectangle inside the page for a band at its edge', () => {
		expect(bandFractions({ x0: 0, x1: 1, y0: 0, y1: 1 }, 1, 0, 100)).toBeNull();
		expect(bandRect({ x0: 0, x1: 1, y0: 0.99, y1: 1, space: 0.01 }, 100, 100)).toEqual({ x: 0, y: 99, width: 100, height: 1 });
		expect(bandRect({ x0: 0.5, x1: 0.5, y0: 0, y1: 1, space: 0.01 }, 100, 100)).toBeNull();
	});
});

describe('isKeptSystems', () => {
	const ok: KeptSystem = { page: 1, system: 2, bars: [3, 6], why: 'no Russian row', band: { x0: 0, x1: 1, y0: 0.2, y1: 0.3, space: 0.01 } };
	it('accepts a list of kept systems and refuses a malformed one, which is read as none', () => {
		expect(isKeptSystems([ok, { page: 1, system: 3, bars: [7, 8], why: null }])).toBe(true);
		expect(isKeptSystems([{ ...ok, why: 'unknown' }])).toBe(false);
		expect(isKeptSystems([{ ...ok, bars: [1] }])).toBe(false);
		expect(isKeptSystems([{ ...ok, band: { x0: 0 } }])).toBe(false);
		expect(isKeptSystems('no')).toBe(false);
	});
});

const transform = { scale: 1, pad: 16, angle: 0, width: 1200, height: 42 };
const sys = (first: number, bar: number, extra: Partial<SystemLayout>): SystemLayout => ({ staffSpace: 30, hasBand: true, notes: [{ id: first, x: 100, bar }], rows: [], ...extra });
const seams: Seams = { isWord: (w) => ['мир'].includes(w), cut: (w) => [w] };
const word = (text: string): WordBox => ({ text, x0: 16 + 90, x1: 16 + 110, y0: 16, y1: 48 });

describe('seatPage and applyUnderlay keep the bands', () => {
	const layout: PageLayout = {
		width: 1000,
		height: 2000,
		unfound: 0,
		systems: [
			sys(0, 1, { rows: [{ id: 0, transform, offsetX: 0, offsetY: 265 }], band: { x0: 0, x1: 1000, y0: 200, y1: 400 }, inkShare: 0.01, textLines: 1 }),
			sys(1, 2, { band: { x0: 0, x1: 1000, y0: 900, y1: 1100 }, inkShare: 0.02, textLines: 0 }),
			sys(2, 3, { hasBand: false }),
		],
	};

	it('gives each seated system its band as fractions of the page, and a system with no band none', () => {
		const page = seatPage(layout, [[word('мир')]], seams);
		expect(page.systems[0].band).toEqual({ x0: 0, x1: 1, y0: 0.1, y1: 0.2, space: 0.015 });
		expect(page.systems[1].band).toEqual({ x0: 0, x1: 1, y0: 0.45, y1: 0.55, space: 0.015 });
		expect(page.systems[2].band).toBeUndefined();
	});

	it('keeps a system with its page, place, song bars, reason, and band; the page is the scan\'s, not the song\'s, after a cover', () => {
		const page: UnderlayPage = { ...seatPage(layout, [[word('мир')]], seams), ms: { prepare: 0, read: 0, seat: 0 } };
		const xml = '<score-partwise><part id="P1"><measure number="1"/><measure number="2"/><measure number="3"/></part></score-partwise>';
		const song = applyUnderlay([xml], [page], [3]);
		expect(song.systems.map((s) => [s.page, s.system, s.bars, s.why, s.band !== undefined])).toEqual([
			[4, 1, [1, 1], null, true],
			[4, 2, [2, 2], 'no Russian row', true],
			[4, 3, [3, 3], 'no band', false],
		]);
		expect(isKeptSystems(song.systems)).toBe(true);
	});

	it('numbers the bars of a later page from the song, and a page not read keeps nothing', () => {
		const one = '<score-partwise><part id="P1"><measure number="1"/><measure number="2"/></part></score-partwise>';
		const page: UnderlayPage = { ...seatPage(layout, [[word('мир')]], seams), ms: { prepare: 0, read: 0, seat: 0 } };
		const song = applyUnderlay([one, one], [null, page]);
		expect(song.systems.map((s) => [s.page, s.bars])).toEqual([[2, [3, 3]], [2, [4, 4]], [2, [5, 5]]]);
	});

	it('says «no ink» for a silent system', () => {
		const silent: PageLayout = { ...layout, systems: [sys(0, 1, { notes: [{ id: 0, x: 100, bar: 1, tiedInto: true }], band: { x0: 0, x1: 1000, y0: 200, y1: 400 }, inkShare: 0, textLines: 0 })] };
		const page: UnderlayPage = { ...seatPage(silent, [], seams), ms: { prepare: 0, read: 0, seat: 0 } };
		expect(page.systems[0].silent).toBe(true);
		expect(applyUnderlay(['<score-partwise><part id="P1"><measure number="1"/></part></score-partwise>'], [page]).systems[0].why).toBe('no ink');
	});
});

describe('the strip\'s measure', () => {
	const systems: KeptSystem[] = [
		{ page: 1, system: 1, bars: [1, 2], why: null, band: { x0: 0, x1: 1, y0: 0.1, y1: 0.2, space: 0.01 } },
		{ page: 1, system: 2, bars: [3, 4], why: 'no Russian row', band: { x0: 0, x1: 1, y0: 0.5, y1: 0.6, space: 0.01 } },
		{ page: 2, system: 1, bars: [5, 6], why: 'no band' },
		{ page: 2, system: 2, bars: [7, 8], why: 'no ink', band: { x0: 0, x1: 1, y0: 0.2, y1: 0.3, space: 0.01 } },
	];
	let t = 0;
	const rendered: number[] = [];
	const deps: StripDeps = {
		render: async (_f, _k, page) => (rendered.push(page), new Blob(['page'])),
		cut: async (_page, band) => ({ blob: new Blob(['x'.repeat(Math.round((band.y1 - band.y0) * 1000))]), width: 100, height: 10 }),
		now: () => (t += 10),
	};

	it('renders each page that has a band once, cuts every band, and totals the bytes of the unread systems and of every system, per page and per song', async () => {
		rendered.length = 0;
		const m = await measureBandStrips(new File([], 'a.pdf'), 'pdf', systems, deps);
		expect(rendered).toEqual([1, 2]);
		expect(m.strips.map((s) => [s.page, s.system, s.written, s.bytes])).toEqual([[1, 1, true, 100], [1, 2, false, 100], [2, 2, false, 100]]);
		expect(m.allBytes).toEqual({ byPage: { 1: 200, 2: 100 }, song: 300 });
		expect(m.unreadBytes).toEqual({ byPage: { 1: 100, 2: 100 }, song: 200 });
		expect(stripsLine(m)).toContain('(b) unread systems only');
		expect(stripsLine(m)).toContain('(c) every system');
	});

	it('leaves out a page it cannot render and a band it cannot cut, and never rejects', async () => {
		const broken: StripDeps = { ...deps, render: async (_f, _k, page) => { if (page === 1) throw new Error('no'); return new Blob(['p']); }, cut: async () => null };
		const m = await measureBandStrips(new File([], 'a.pdf'), 'pdf', systems, broken);
		expect(m.pages.map((p) => p.page)).toEqual([2]);
		expect(m.strips).toEqual([]);
	});

	it('runs only with ?strips=measure, and says so on the console', async () => {
		const log = vi.spyOn(console, 'info').mockImplementation(() => {});
		maybeMeasureStrips(new File([], 'a.pdf'), 'pdf', systems, '?words=read', deps);
		await Promise.resolve();
		expect(log).not.toHaveBeenCalled();
		expect(stripsMeasureOn('?strips=measure')).toBe(true);
		maybeMeasureStrips(new File([], 'a.pdf'), 'pdf', systems, '?strips=measure', deps);
		await new Promise((r) => setTimeout(r, 10));
		expect(String(log.mock.calls[0]?.[0])).toContain('[omr] band strips:');
		log.mockRestore();
	});

	it('cuts nothing where the browser has no canvas for it (a unit test is not a browser)', async () => {
		expect(await cutBandStrip(new Blob(['x']), { x0: 0, x1: 1, y0: 0, y1: 1, space: 0.1 })).toBeNull();
	});
});

describe('the library keeps the bands beside the reading', () => {
	let db: IDBDatabase;
	let driver: StorageDriver;
	beforeEach(async () => {
		await new Promise<void>((resolve) => {
			const request = indexedDB.deleteDatabase('ilya-library');
			request.onsuccess = request.onerror = request.onblocked = () => resolve();
		});
		db = await openLibraryDatabase();
		driver = createIndexedDbDriver(db);
	});
	afterEach(() => db?.close());

	it('round trips a source whose reading carries bands, and one whose reading has none', async () => {
		const bands: KeptSystem[] = [{ page: 1, system: 1, bars: [1, 4], why: null, band: { x0: 0, x1: 1, y0: 0.2, y1: 0.3, space: 0.01 } }];
		const bytes = new TextEncoder().encode('scan bytes');
		const source = (id: string, reading: SourceBytes['reading']): SourceBytes => ({ songId: id, fileName: 'a.pdf', bytes: bytes.buffer.slice(0) as ArrayBuffer, byteLength: bytes.byteLength, contentHash: 'h', importedAt: '2026-11-04T00:00:00.000Z', reading });
		await driver.save(emptySongRecord('a', '2026-11-04T00:00:00.000Z'), source('a', { musicXml: '<x/>', stamp: 's', bands }));
		await driver.save(emptySongRecord('b', '2026-11-04T00:00:00.000Z'), source('b', { musicXml: '<x/>', stamp: 's' }));
		expect((await driver.loadSource('a'))?.reading?.bands).toEqual(bands);
		expect((await driver.loadSource('b'))?.reading).toEqual({ musicXml: '<x/>', stamp: 's' });
	});
});
