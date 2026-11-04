/**
 * Where each system's lyric band stood, kept with the reading (row 181, step 3; Dann 2026-11-04 10:12 items 1 and 8, and
 * 10:26: proportions, not fixed pixels; Fable's review amendments 12 and 13).
 *
 * The band's PICTURE is not kept. The scan is already kept byte for byte beside the reading (`CONTRACT.md` §8, the second
 * exception), so the strip the Loupe shows can be cut from the stored scan when the Loupe opens. What is new to keep is a few
 * numbers: for each voice system of each page, its place, its bars, why it took no words (if it took none), and the band as
 * FRACTIONS of the page, so that they hold at any dpi the page is rendered at again.
 *
 * Pure. No import: the reading's stamp (`stamp.ts`) and the song (`underlay-song.ts`) both import this.
 */

/** A band as fractions of its page: `x0`, `x1` over the page's width, `y0`, `y1` over its height; `space` is the system's staff space over the page's height. */
export interface BandFractions {
	x0: number;
	x1: number;
	y0: number;
	y1: number;
	space: number;
}

/** Why a system took no words: `null` where it did. */
export type SystemWhy = null | 'no ink' | 'no Russian row' | 'no band';

/**
 * One voice system of one page of the scan, as the reading found it (amendment 12). The join reads option C's inputs from this,
 * never from the banner's merged ranges; the Loupe reads `band` to cut its strip.
 */
export interface KeptSystem {
	/** 1-based page of the stored scan (a picture is page 1). A cover left out of the song does not shift it. */
	page: number;
	/** 1-based, top to bottom among the page's voice systems. */
	system: number;
	/** The song's first and last bar of it. */
	bars: readonly [number, number];
	why: SystemWhy;
	/** The band; absent where the system had none (`why` is `'no band'`). */
	band?: BandFractions;
}

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));
/** Five decimals: under a fiftieth of a pixel on a page of 3,500, and a stored band of about 100 bytes, not 170. */
const fixed = (n: number): number => Math.round(n * 1e5) / 1e5;

/** A band in page pixels as fractions of the page. Null where the page has no size. */
export function bandFractions(band: { x0: number; x1: number; y0: number; y1: number }, staffSpace: number, width: number, height: number): BandFractions | null {
	if (!(width > 0) || !(height > 0)) return null;
	return { x0: fixed(clamp01(band.x0 / width)), x1: fixed(clamp01(band.x1 / width)), y0: fixed(clamp01(band.y0 / height)), y1: fixed(clamp01(band.y1 / height)), space: fixed(staffSpace / height) };
}

/** The band's rectangle in the pixels of a page `width` by `height`: edges floored and ceiled outward, inside the page. Null where it holds no pixel. */
export function bandRect(band: BandFractions, width: number, height: number): { x: number; y: number; width: number; height: number } | null {
	const x0 = Math.max(0, Math.floor(band.x0 * width));
	const x1 = Math.min(width, Math.ceil(band.x1 * width));
	const y0 = Math.max(0, Math.floor(band.y0 * height));
	const y1 = Math.min(height, Math.ceil(band.y1 * height));
	return x1 > x0 && y1 > y0 ? { x: x0, y: y0, width: x1 - x0, height: y1 - y0 } : null;
}

/** True where the value is a `KeptSystem` list the reading can carry (every field the right shape); a malformed list is read as no list. */
export function isKeptSystems(value: unknown): value is KeptSystem[] {
	if (!Array.isArray(value)) return false;
	const num = (n: unknown): boolean => typeof n === 'number' && Number.isFinite(n);
	return value.every((s) => {
		if (typeof s !== 'object' || s === null) return false;
		const k = s as Record<string, unknown>;
		const bars = k.bars;
		const band = k.band as Record<string, unknown> | undefined;
		return (
			num(k.page) &&
			num(k.system) &&
			Array.isArray(bars) &&
			bars.length === 2 &&
			num(bars[0]) &&
			num(bars[1]) &&
			(k.why === null || k.why === 'no ink' || k.why === 'no Russian row' || k.why === 'no band') &&
			(band === undefined || (typeof band === 'object' && band !== null && ['x0', 'x1', 'y0', 'y1', 'space'].every((f) => num(band[f]))))
		);
	});
}
