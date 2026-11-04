/**
 * Row 181 step 6: the print in the Loupe (`loupe-print.svelte.ts`): the list the Loupe steps through, the strip cut to the bar and
 * kept, the Loupe opening itself once, the scale the strip is drawn at, and the ratified strings exactly as ratified.
 */
import { describe, expect, it, vi } from 'vitest';
import { t } from '$lib/i18n';
import { barExtents, stripRect, systemOfBar, STRIP_MAX_SPACES, type KeptSystem } from '$lib/omr/kept-bands';
import { LoupePrint, firstNoteOfBar, stripScale, MIN_LETTER_PX, type PrintDeps } from './loupe-print.svelte';

const sys = (over: Partial<KeptSystem> = {}): KeptSystem => ({
	page: 2,
	system: 1,
	bars: [10, 12],
	why: 'no Russian row',
	band: { x0: 0, x1: 1, y0: 0.4, y1: 0.5, space: 0.01 },
	barXs: [{ bar: 10, x0: 0, x1: 0.3 }, { bar: 11, x0: 0.3, x1: 0.6 }, { bar: 12, x0: 0.6, x1: 1 }],
	...over,
});

function rig(over: Partial<PrintDeps> = {}) {
	const opened: number[] = [];
	const cuts: unknown[] = [];
	const renders: number[] = [];
	let id = 'song-1';
	const deps: PrintDeps = {
		songId: () => id,
		scan: () => ({ systems: [sys()], file: new File(['x'], 'a.pdf'), kind: 'pdf' }),
		toCheck: () => [10, 12],
		openAt: (bar) => void opened.push(bar),
		render: async (_f, _k, page) => (renders.push(page), new Blob(['page']) as Blob),
		cut: async (_p, band) => (cuts.push(band), { blob: new Blob(['strip']), width: 400, height: 50 }),
		url: () => 'blob:strip',
		...over,
	};
	const p = new LoupePrint();
	p.attach(deps);
	return { p, opened, cuts, renders, setSong: (s: string) => (id = s) };
}

describe('the list the Loupe steps through', () => {
	it('places a bar in the banner\'s list, and steps to the one before and after without wrapping', () => {
		const { p } = rig();
		expect(p.position(10)).toEqual({ index: 1, total: 2 });
		expect(p.position(11)).toBeNull();
		expect(p.neighbour(10, 1)).toBe(12);
		expect(p.neighbour(10, -1)).toBeNull();
		expect(p.neighbour(12, 1)).toBeNull();
		expect(p.neighbour(11, 1)).toBeNull();
	});

	it('replaces the Loupe\'s tag for a listed bar, with the ratified string, and leaves it for any other', () => {
		const { p } = rig();
		expect(p.tagFor('10', 'en')).toBe('m. 10 · to check, 1 of 2');
		expect(p.tagFor('12', 'fr')).toBe('mes. 12 · à vérifier, 2 sur 2');
		expect(p.tagFor('11', 'en')).toBeNull();
		expect(p.tagFor(null, 'en')).toBeNull();
	});

	it('opens the Loupe on a bar when asked (the banner\'s link, Previous, Next)', () => {
		const { p, opened } = rig();
		p.goto(12);
		expect(opened).toEqual([12]);
	});
});

describe('the strip', () => {
	it('is cut to the bar\'s extent and no taller than the cap, from the page of the system that holds it', async () => {
		const { p, cuts, renders } = rig();
		const strip = await p.strip(11);
		expect(renders).toEqual([2]);
		expect(cuts).toEqual([{ x0: 0.3, x1: 0.6, y0: 0.4, y1: 0.45, space: 0.01 }]);
		expect(strip).toMatchObject({ url: 'blob:strip', width: 400, height: 50 });
		expect(strip!.spacePx).toBeCloseTo(0.01 / 0.05 * 50, 6);
	});

	it('renders each page once and cuts each bar once for the session', async () => {
		const { p, renders, cuts } = rig();
		await Promise.all([p.strip(10), p.strip(11), p.strip(12), p.strip(10)]);
		expect(renders).toEqual([2]);
		expect(cuts).toHaveLength(3);
	});

	it('is null where the song is not a scan with bands, where the bar is in no system, or where the scan cannot be cut', async () => {
		expect(await rig({ scan: () => null }).p.strip(10)).toBeNull();
		expect(await rig().p.strip(99)).toBeNull();
		expect(await rig({ cut: async () => null }).p.strip(10)).toBeNull();
		expect(await rig({ render: async () => { throw new Error('no'); } }).p.strip(10)).toBeNull();
	});

	it('is drawn on every bar of a scan with bands, listed or not (item 13), and on none of a song without', () => {
		expect(rig().p.hasScan()).toBe(true);
		expect(rig({ scan: () => ({ systems: [sys({ band: undefined })], file: new File([], 'a.pdf'), kind: 'pdf' }) }).p.hasScan()).toBe(false);
		expect(rig({ scan: () => null }).p.hasScan()).toBe(false);
	});

	it('uses the scan a drop just read before the stored one, for that song only', async () => {
		const { p, setSong } = rig({ scan: () => null });
		p.dropped('song-1', new File(['x'], 'b.png'), [sys()]);
		expect(p.hasScan()).toBe(true);
		setSong('song-2');
		expect(p.hasScan()).toBe(false);
	});

	it('gives the print\'s alt text as the ratified sentence', () => {
		const { p } = rig();
		expect(p.altFor(14, 'en')).toBe('Bar 14 as printed in your score');
		expect(p.altFor(14, 'fr')).toBe('La mesure 14 telle qu’imprimée dans votre partition');
	});
});

describe('the Loupe opening itself, once', () => {
	it('opens on the first bar to check, once for the song, and takes focus once', () => {
		const { p, opened } = rig();
		expect(p.arrived()).toBe(true);
		expect(opened).toEqual([10]);
		expect(p.focusRequest).toBe(1);
		expect(p.arrived()).toBe(false);
		expect(opened).toEqual([10]);
	});

	it('opens for the next song\'s drop, and for none with nothing to check or no scan to show', () => {
		const a = rig();
		a.p.arrived();
		a.setSong('song-2');
		expect(a.p.arrived()).toBe(true);
		expect(rig({ toCheck: () => [] }).p.arrived()).toBe(false);
		expect(rig({ scan: () => null }).p.arrived()).toBe(false);
	});

	it('gives focus back to where it was when the Loupe closes', () => {
		const el = { focus: vi.fn(), isConnected: true };
		vi.stubGlobal('document', { activeElement: el });
		const { p } = rig();
		p.arrived();
		p.closed();
		expect(el.focus).toHaveBeenCalledTimes(1);
		p.closed();
		expect(el.focus).toHaveBeenCalledTimes(1);
		vi.unstubAllGlobals();
	});
});

describe('stripScale', () => {
	const strip = { width: 2000, spacePx: 30 };
	it('shows the whole strip at 1, with the Loupe\'s zoom and her pinch multiplying it, never past the scan\'s own pixels', () => {
		expect(stripScale(strip, 400, { phone: false, zoom: 1, pinch: 1 })).toBe(1);
		expect(stripScale(strip, 400, { phone: false, zoom: 1.5, pinch: 2 })).toBe(3);
		expect(stripScale(strip, 400, { phone: false, zoom: 4, pinch: 4 })).toBe(5);
	});

	it('opens a phone\'s strip large enough to keep the print\'s letters at the floor, and leaves a desk\'s alone', () => {
		// 30 px of staff space at 2000 px shown in 300 px: letters are 0.8 * 30 * 0.15 = 3.6 px.
		const scale = stripScale(strip, 300, { phone: true, zoom: 1, pinch: 1 });
		expect(scale).toBeCloseTo(MIN_LETTER_PX / 3.6, 6);
		expect(stripScale(strip, 300, { phone: false, zoom: 1, pinch: 1 })).toBe(1);
		// Already readable: no enlargement.
		expect(stripScale({ width: 400, spacePx: 30 }, 300, { phone: true, zoom: 1, pinch: 1 })).toBe(1);
	});

	it('is 1 for a window or a strip with no width', () => {
		expect(stripScale(strip, 0, { phone: true, zoom: 2, pinch: 2 })).toBe(1);
		expect(stripScale({ width: 0, spacePx: 1 }, 300, { phone: true, zoom: 2, pinch: 2 })).toBe(1);
	});
});

describe('firstNoteOfBar', () => {
	const measures = [{ index: 0, number: '1' }, { index: 1, number: '2' }, { index: 2, number: '' }];
	const line = [{ id: 'r', type: 'rest', measureIndex: 1 }, { id: 'n1', type: 'note', measureIndex: 1 }, { id: 'n2', type: 'note', measureIndex: 2 }];
	it('finds the first sung note of the measure numbered for the bar, else the bar-th measure', () => {
		expect(firstNoteOfBar(measures, line, 2)).toBe('n1');
		expect(firstNoteOfBar(measures, line, 3)).toBe('n2');
		expect(firstNoteOfBar(measures, line, 9)).toBeNull();
		expect(firstNoteOfBar(measures, [], 2)).toBeNull();
	});
});

describe('the bar\'s extent on the page (kept-bands.ts)', () => {
	it('begins a bar left of its first note, ends it where the next begins, and ends the last right of its last note, inside the band', () => {
		const got = barExtents([{ x: 200, bar: 1 }, { x: 300, bar: 1 }, { x: 600, bar: 2 }, { x: 900, bar: 2 }], 20, { x0: 100, x1: 1000 }, 1000);
		expect(got).toEqual([{ bar: 1, x0: 0.17, x1: 0.57 }, { bar: 2, x0: 0.57, x1: 0.98 }]);
	});

	it('gives nothing for a page with no width or a system with no notes', () => {
		expect(barExtents([], 20, { x0: 0, x1: 100 }, 1000)).toEqual([]);
		expect(barExtents([{ x: 1, bar: 1 }], 20, { x0: 0, x1: 100 }, 0)).toEqual([]);
	});

	it('finds the system of a bar and its rectangle, the whole band where no extents were kept, and caps the height', () => {
		const a = sys();
		expect(systemOfBar([a], 11)).toBe(a);
		expect(systemOfBar([a], 13)).toBeNull();
		expect(stripRect(sys({ barXs: undefined }), 11)).toMatchObject({ x0: 0, x1: 1 });
		const tall = sys({ band: { x0: 0, x1: 1, y0: 0.1, y1: 0.9, space: 0.01 } });
		expect(stripRect(tall, 10)!.y1).toBeCloseTo(0.1 + STRIP_MAX_SPACES * 0.01, 9);
	});
});

describe('the ratified strings, exactly (strings-row181_r1_2026-11-04.md)', () => {
	it('are as Dann ratified them in English and French', () => {
		expect(t('loupe.checkPrev', 'en')).toBe('Previous bar to check');
		expect(t('loupe.checkPrev', 'fr')).toBe('Mesure précédente à vérifier');
		expect(t('loupe.checkNext', 'en')).toBe('Next bar to check');
		expect(t('loupe.checkNext', 'fr')).toBe('Mesure suivante à vérifier');
		expect(t('loupe.fillFromPoem', 'en')).toBe('Fill from the poem');
		expect(t('loupe.fillFromPoem', 'fr')).toBe('Compléter à partir du poème');
		expect(t('lyrics.receipt.fromPoemOne', 'en')).toBe('1 syllable filled from your poem');
		expect(t('lyrics.receipt.fromPoemOne', 'fr')).toBe('1 syllabe complétée à partir de votre poème');
		expect(t('lyrics.receipt.fromPoem', 'en').replace('{n}', '6')).toBe('6 syllables filled from your poem');
		expect(t('lyrics.receipt.fromPoem', 'fr').replace('{n}', '6')).toBe('6 syllabes complétées à partir de votre poème');
		expect(t('lyrics.filled.note', 'en').replace('{scan}', 'тсб')).toBe('Filled from your poem. Your score’s print read “тсб”.');
		expect(t('lyrics.filled.note', 'fr').replace('{scan}', 'тсб')).toBe('Complété à partir de votre poème. Votre partition portait « тсб ».');
	});

	it('are as ratified for the banner: Choose, Choisissez, and the last sentence kept', () => {
		expect(t('upload.banner.wordsPartlyRead', 'en')).toBe('Ilya’s reading of printed words is still imperfect; it could not read the words in bars {bars}. Choose a bar to see your score’s print there and fill the missing words. Check every word against your score.');
		expect(t('upload.banner.wordsPartlyReadOne', 'en')).toContain('Choose the bar to see your score’s print there and fill the missing words.');
		expect(t('upload.banner.wordsPartlyRead', 'fr')).toContain('Choisissez une mesure pour voir l’imprimé de votre partition et compléter les paroles manquantes. Vérifiez chaque mot sur votre partition.');
		expect(t('upload.banner.wordsPartlyReadOne', 'fr')).toContain('Choisissez la mesure pour voir l’imprimé de votre partition et compléter les paroles manquantes.');
		expect(t('upload.banner.wordsPartlyRead', 'en')).not.toMatch(/Touch|Type the missing/);
	});
});
