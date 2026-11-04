/**
 * The second look at a system's band (row 181, step 2; Dann 2026-11-04 10:12 items 6 (b) and 7).
 *
 * A system with a band that held ink but no Russian row may be one the cut missed by a little: the band cut a line of
 * words in two, or the ink was too pale for the cut. Before the banner names the bars, the band is looked at again, in
 * a few ways, and the look whose row the dictionary likes best is kept (`underlay-choose.ts`). The geometry of each look
 * is here, in staff spaces, never in fixed pixels (Dann 2026-11-04 10:26; `CONTRACT.md` §0.2).
 *
 * THE LIMIT: `LOOKS` has four entries and a system gets each at most once, so a system costs at most four further looks.
 * The reader's loop (`underlay-reader.ts`) states the same limit where it loops.
 *
 * Pure.
 */
import { paperTone } from './underlay-frame';

/** `down` and `up`: the cut shifted by half a staff space. `wide`: the band widened by a staff space each way. `stretch`: the band's own ink and paper tones stretched to black and white. */
export type Look = 'down' | 'up' | 'wide' | 'stretch';

/** The four looks, in the order they are tried. */
export const LOOKS: readonly Look[] = ['down', 'up', 'wide', 'stretch'];

/** The shift of `down` and `up`, in staff spaces. */
export const SHIFT = 0.5;
/** The widening of `wide`, in staff spaces, each way. */
export const WIDEN = 1;
/** `stretch` leaves a band alone where its ink and its paper are closer than this many grey levels: there is nothing to stretch. */
export const MIN_CONTRAST = 32;
/** The band's ink tone for `stretch`: the grey at this share of its pixels, darkest first. */
export const INK_PERCENTILE = 0.01;

/**
 * The rows `[y0, y1)` of a look at a band of `[y0, y1)` on a page `height` rows tall, or null where the look leaves no
 * row. `stretch` does not move the band.
 */
export function lookWindow(y0: number, y1: number, space: number, height: number, look: Look): [number, number] | null {
	const [a, b] =
		look === 'down' ? [y0 + SHIFT * space, y1 + SHIFT * space]
		: look === 'up' ? [y0 - SHIFT * space, y1 - SHIFT * space]
		: look === 'wide' ? [y0 - WIDEN * space, y1 + WIDEN * space]
		: [y0, y1];
	const from = Math.max(0, Math.round(a));
	const to = Math.min(height, Math.round(b));
	return to > from ? [from, to] : null;
}

/** The grey at `share` of the pixels, darkest first. */
function toneAt(data: ArrayLike<number>, share: number): number {
	const bins = new Array<number>(256).fill(0);
	for (let i = 0; i < data.length; i++) bins[data[i]]++;
	const target = Math.max(1, Math.ceil(share * data.length));
	let n = 0;
	for (let g = 0; g < 256; g++) {
		n += bins[g];
		if (n >= target) return g;
	}
	return 255;
}

/**
 * The band with its own ink tone sent to black and its own paper tone (`paperTone`, the most frequent grey) to white,
 * every grey between in proportion. Its `paper` is then 255. Returned as it was, with no `paper`, where the two tones
 * are closer than `MIN_CONTRAST`.
 */
export function stretchBand(band: { width: number; height: number; data: Uint8Array }): { width: number; height: number; data: Uint8Array; paper?: number } {
	if (band.data.length === 0) return band;
	const paper = paperTone(band.data);
	const ink = toneAt(band.data, INK_PERCENTILE);
	if (paper - ink < MIN_CONTRAST) return band;
	const out = new Uint8Array(band.data.length);
	const span = paper - ink;
	for (let i = 0; i < out.length; i++) out[i] = Math.min(255, Math.max(0, Math.round(((band.data[i] - ink) * 255) / span)));
	return { width: band.width, height: band.height, data: out, paper: 255 };
}
