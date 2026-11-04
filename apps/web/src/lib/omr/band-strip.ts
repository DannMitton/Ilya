/**
 * The strip of the print under a system, cut from the stored scan when it is asked for (row 181, step 3; Fable's review
 * amendment 13, design (a)). Dann ruled the print is shown for every bar of a scanned song (2026-11-04 13:52), so every system
 * has a strip, and the picture is not kept: the scan is kept byte for byte, and the band is a few numbers (`kept-bands.ts`).
 *
 * THIS STEP BUILDS THE MEASURE, NOT THE LOUPE (step 6). `measureBandStrips` renders each page of the stored scan, cuts each
 * band, and says on the console what design (a), (b), and (c) of the amendment cost on that machine: the seconds to render a
 * page and to cut a band, and the bytes of the cut strip, per page and per song, for the unread systems alone and for every
 * system. It runs only with `?strips=measure` in the address, and never changes a thing the singer sees.
 *
 * TWO LIMITS, stated so the numbers are not over-read:
 * - A PDF page is rendered by `rasterizePdf(file, page)`, which renders pages 1 to `page` (there is no single-page render in
 *   `reader/page-pdf.ts`; not changed here). So the render time of a later page includes the earlier ones: an UPPER bound for
 *   a single-page render. The measure renders each page once, from page 1 on, and says so.
 * - The bytes are those of a canvas PNG (`convertToBlob`), which is 8-bit RGB with equal channels, not an 8-bit greyscale PNG;
 *   it is an UPPER bound for the lossless greyscale crop the amendment names.
 */
import { bandRect, isKeptSystems, type BandFractions, type KeptSystem } from './kept-bands';

export const STRIPS_QUERY = 'strips';
export const STRIPS_MEASURE = 'measure';

const here = (): string => (typeof location === 'undefined' ? '' : location.search);

/** True where the address carries `?strips=measure`. */
export function stripsMeasureOn(search: string = here()): boolean {
	return new URLSearchParams(search).get(STRIPS_QUERY) === STRIPS_MEASURE;
}

/** One strip: the band cut from a page, as an image and its size in pixels. */
export interface Strip {
	blob: Blob;
	width: number;
	height: number;
}

/** The band cut from a rendered page (a PNG or any image the browser decodes). Null where the band holds no pixel or the browser cannot cut. */
export async function cutBandStrip(page: Blob, band: BandFractions): Promise<Strip | null> {
	if (typeof createImageBitmap === 'undefined' || typeof OffscreenCanvas === 'undefined') return null;
	const bitmap = await createImageBitmap(page);
	try {
		const rect = bandRect(band, bitmap.width, bitmap.height);
		if (!rect) return null;
		const canvas = new OffscreenCanvas(rect.width, rect.height);
		const ctx = canvas.getContext('2d');
		if (!ctx) return null;
		ctx.drawImage(bitmap, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
		return { blob: await canvas.convertToBlob({ type: 'image/png' }), width: rect.width, height: rect.height };
	} finally {
		bitmap.close();
	}
}

/** Page `page` (1-based) of the stored scan, rendered as the read renders it (`reader/page-pdf.ts`, `reader/page-image.ts`). */
export async function renderScanPage(file: File, kind: 'image' | 'pdf', page: number): Promise<Blob> {
	if (kind === 'image') {
		const { toGreyscalePng } = await import('$lib/reader/page-image');
		return new Blob([await toGreyscalePng(file)], { type: 'image/png' });
	}
	const { rasterizePdf } = await import('$lib/reader/page-pdf');
	const pages = await rasterizePdf(file, page);
	return new Blob([pages[pages.length - 1]], { type: 'image/png' });
}

export interface StripMeasure {
	page: number;
	system: number;
	/** The system took words (`why` null) or not. */
	written: boolean;
	width: number;
	height: number;
	bytes: number;
	cutMs: number;
}

export interface PageMeasure {
	page: number;
	renderMs: number;
}

export interface StripsMeasured {
	pages: PageMeasure[];
	strips: StripMeasure[];
	/** (b): the strips of the systems that took no words, in bytes, per page and over the song. */
	unreadBytes: { byPage: Record<number, number>; song: number };
	/** (c): the strips of every system. */
	allBytes: { byPage: Record<number, number>; song: number };
}

export interface StripDeps {
	render(file: File, kind: 'image' | 'pdf', page: number): Promise<Blob>;
	cut(page: Blob, band: BandFractions): Promise<Strip | null>;
	now(): number;
}

const REAL: StripDeps = { render: renderScanPage, cut: cutBandStrip, now: () => performance.now() };

/**
 * Renders each page of the scan that has a system with a band, once, cuts each band, and totals. Never rejects: a page that
 * cannot be rendered or a band that cannot be cut is left out of the totals.
 */
export async function measureBandStrips(file: File, kind: 'image' | 'pdf', systems: readonly KeptSystem[], deps: StripDeps = REAL): Promise<StripsMeasured> {
	const out: StripsMeasured = { pages: [], strips: [], unreadBytes: { byPage: {}, song: 0 }, allBytes: { byPage: {}, song: 0 } };
	const pageNumbers = [...new Set(systems.filter((s) => s.band).map((s) => s.page))].sort((a, b) => a - b);
	for (const page of pageNumbers) {
		let rendered: Blob;
		const t0 = deps.now();
		try {
			rendered = await deps.render(file, kind, page);
		} catch {
			continue;
		}
		out.pages.push({ page, renderMs: Math.round(deps.now() - t0) });
		for (const s of systems.filter((x) => x.page === page && x.band)) {
			const t1 = deps.now();
			let strip: Strip | null = null;
			try {
				strip = await deps.cut(rendered, s.band as BandFractions);
			} catch {
				strip = null;
			}
			if (!strip) continue;
			const written = s.why === null;
			out.strips.push({ page, system: s.system, written, width: strip.width, height: strip.height, bytes: strip.blob.size, cutMs: Math.round(deps.now() - t1) });
			out.allBytes.byPage[page] = (out.allBytes.byPage[page] ?? 0) + strip.blob.size;
			out.allBytes.song += strip.blob.size;
			if (!written) {
				out.unreadBytes.byPage[page] = (out.unreadBytes.byPage[page] ?? 0) + strip.blob.size;
				out.unreadBytes.song += strip.blob.size;
			}
		}
	}
	return out;
}

/** The console line for a measure: the desk reads (a), (b), and (c) from it. */
export function stripsLine(m: StripsMeasured): string {
	const pages = m.pages.map((p) => `page ${p.page} render ${p.renderMs} ms (upper bound: pages 1 to ${p.page} are rendered)`).join('; ');
	const strips = m.strips.map((s) => `${s.page}.${s.system}${s.written ? 'w' : 'u'} ${s.width}x${s.height} ${s.bytes} B ${s.cutMs} ms`).join(', ');
	const per = (r: Record<number, number>): string => Object.entries(r).map(([p, b]) => `page ${p}: ${b} B`).join(', ') || 'none';
	return `[omr] band strips: ${pages || 'no page rendered'}; cut (page.system, w written or u unread): ${strips || 'none'}; (b) unread systems only (canvas PNG, an upper bound): ${per(m.unreadBytes.byPage)}, song ${m.unreadBytes.song} B; (c) every system: ${per(m.allBytes.byPage)}, song ${m.allBytes.song} B`;
}

/** With `?strips=measure`, measure the kept reading's bands against the stored scan and say so on the console. Otherwise nothing. Never rejects, never waited for. */
export function maybeMeasureStrips(file: File, kind: 'image' | 'pdf', systems: readonly KeptSystem[] | undefined, search: string = here(), deps: StripDeps = REAL): void {
	if (!systems || systems.length === 0 || !stripsMeasureOn(search) || !isKeptSystems(systems)) return;
	void measureBandStrips(file, kind, systems, deps).then((m) => console.info(stripsLine(m)), () => {});
}
