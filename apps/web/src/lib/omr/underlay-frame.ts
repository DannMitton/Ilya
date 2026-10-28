/**
 * A text row framed for a reader (N.135, stage 2a, step 3).
 *
 * `cutRows` (`underlay-rows.ts`) says where a row is; this module makes the
 * crop a reader reads well. The desk's measured configuration, in this order,
 * read 2,086 of 2,538 printed syllables on the eighteen build songs against
 * 1,875 with the raw crops (on the nine photocopies, 1,026 of 1,249 against
 * 860). The four steps:
 *
 * 1. Deskew. The angle is the rotation, positive counter-clockwise on the
 *    screen, that maximises the variance of the horizontal projection of the
 *    ink (ink: grey less than 128), swept from -3.0 to +3.0 degrees in steps of
 *    0.1 over the ink pixels only, in rows padded by the crop's height plus
 *    ceil(width / 2 * sin 3 degrees) above and below, so the sweep loses no ink.
 *    Ties go to the smaller absolute angle (and to the positive one of two equal
 *    angles). The grey crop is rotated by that angle about its centre, bilinear,
 *    the border filled with the paper tone, the size kept. An angle of 0.0
 *    copies the crop.
 * 2. Closing of the ink with a square kernel of ones, `closingKernel(staffSpace)`
 *    wide: dilate then erode on the inverted grey (255 less grey), centred
 *    anchor, the window cut at the edges (OpenCV's default morphology border),
 *    then invert back. The kernel is the odd number nearest `CLOSE_SHARE` (0.1)
 *    of the staff space, the lower of two on a tie, and at least 1 (no closing):
 *    3 from a staff space of 20 (exclusive) to 40 (inclusive), so 3 at every
 *    staff space the harness measured but one (26.8 to 32.1 px). A kernel of k
 *    closes a gap of k - 1 pixels or fewer: 2 px at 30, and a gap of 3 stays
 *    open.
 * 3. Scale so that the ink's vertical extent is `inkHeight` px. The extent is
 *    the span between the row where the cumulative ink (ink pixels per row, from
 *    the top) first reaches 2 percent of the total and the row where it first
 *    reaches 98 percent, both inclusive. Both axes are resized by the factor,
 *    BICUBIC (the Keys kernel with a = -0.75, edges replicated, the source
 *    sampled at (x + 0.5) / factor - 0.5). The span is at least `MIN_ROW` staff
 *    spaces (`underlay-rows.ts`), so a speck is not enlarged to a letter. A crop
 *    with no ink is left unscaled.
 * 4. Pad every side, after the scale, by `padRatio` of `inkHeight` (0.5 by
 *    default: 16 px at 32, the measured configuration) of the paper tone: the most frequent grey of the
 *    crop (the first, on a tie).
 *
 * "Its centre" is the point (w / 2, h / 2) in pixel indices, which is what
 * OpenCV's `getRotationMatrix2D((w / 2, h / 2), ...)` takes. The exact centre
 * is half a pixel away, (w - 1) / 2; the two differ by about 0.014 px at 1.6
 * degrees, which moves 3.7 percent of the pixels of a text row by more than one
 * grey level because glyph edges are steep. The OpenCV idiom is used because
 * the measured configuration was most probably made with it: NOT ESTABLISHED.
 *
 * PROPORTION, NEVER A PIXEL COUNT (Dann, 2026-10-27 14:27). `frameRow` takes no
 * absolute pixel value except `inkHeight`, which is the reader's own preferred
 * letter size in reader pixels and so the one legitimate absolute. The padding is
 * a fraction of it, applied after the scale; the sweep's mask padding is the
 * crop's own height. The measured 16 px of padding is now 0.5 of the ink height.
 *
 * The closing (step 2) is applied before the scale, on the page's own pixels,
 * so its size cannot be a share of `inkHeight`. It is a share of the STAFF SPACE,
 * the one length Ilya knows on both of its paths. (This replaces a fixed 3 by 3,
 * argued from the print's resolution: that holds for a PDF, which Ilya rasters at
 * 400 dpi, and not for a picture, whose pixels per staff space are whatever the
 * camera gave.) Whether 0.1 is the right share at other staff spaces is NOT
 * ESTABLISHED: row 117 measured kernels of 2, 3, 4, and 5 at one resolution only
 * (+8, +38, +31, +32). DESK DEFAULT; stage 2b measures it.
 *
 * The paper tone is taken once, from the crop as given, and used for both the
 * rotation's border and the padding.
 *
 * A box read on the framed crop maps back to the original crop with
 * `unframeBox`. The mapping is EXACT for the scale and the padding. It is
 * APPROXIMATE for the angle: the stage 1 harness ignored the rotation when
 * mapping boxes. `unframePoint` turns a point back exactly (up to the
 * resampling); `unframeBox` takes the bounding box of the four turned corners,
 * which is larger than the glyph the box holds. At most 3 degrees, a point moves
 * by under 0.06 of its distance from the centre.
 *
 * Pure: typed arrays in, typed arrays out. No DOM, no canvas.
 */
import { MIN_ROW, type GreyBandLike } from './underlay-rows';

export interface FrameOptions {
	/** The ink's vertical extent in the framed crop, in px. */
	inkHeight?: number;
	/**
	 * The padding on every side, as a fraction of `inkHeight`, applied after the scale.
	 * The padding in px is `Math.round(padRatio * inkHeight)`.
	 */
	padRatio?: number;
}

/** How a framed crop relates to the crop it came from. */
export interface FrameTransform {
	/** The factor the deskewed crop was resized by; 1 where it was not. */
	scale: number;
	/** The padding on every side of the framed crop, in px. */
	pad: number;
	/** The rotation applied, in degrees, positive counter-clockwise on the screen. */
	angle: number;
	/** The size of the crop that was framed, whose centre the rotation is about. */
	width: number;
	height: number;
}

/** A framed crop: a `GreyBandLike` whose pixels are a `Uint8Array`, and whose `paper` is the tone it was padded with. */
export interface FramedCrop extends GreyBandLike {
	data: Uint8Array;
	paper: number;
}

export interface FramedRow {
	crop: FramedCrop;
	transform: FrameTransform;
}

/** A box in pixels: `x0`, `y0` the left and top edges, `x1`, `y1` the right and bottom edges. */
export interface PixelBox {
	x0: number;
	y0: number;
	x1: number;
	y1: number;
}

export const DEFAULT_INK_HEIGHT = 32;
export const DEFAULT_PAD_RATIO = 0.5;
/** Ink is darker than this grey. */
export const INK_BELOW = 128;
/** The sweep runs from minus to plus this many degrees. */
export const SWEEP_DEGREES = 3.0;
/** The sweep's step, in tenths of a degree (an integer, so the angles do not drift). */
const SWEEP_TENTHS = 30;
/** The ink extent runs from this share of the ink to its complement, as 1 over this many. */
const TAIL_DENOMINATOR = 50;
const CUBIC_A = -0.75;
/** The closing kernel is the odd number nearest this share of the staff space. */
export const CLOSE_SHARE = 0.1;

/** The most frequent grey of the crop: the first of the 256 bins at the top. */
export function paperTone(data: ArrayLike<number>): number {
	const bins = new Array<number>(256).fill(0);
	for (let i = 0; i < data.length; i++) bins[data[i]]++;
	let best = 0;
	for (let g = 1; g < 256; g++) if (bins[g] > bins[best]) best = g;
	return best;
}

/**
 * The rows added above and below for the sweep: the crop's height plus what a
 * turn of `SWEEP_DEGREES` lifts the row's far end by, half the width times the
 * sine of the angle. No turn within the sweep puts ink outside them.
 */
function sweepPad(w: number, h: number): number {
	return h + Math.ceil((w / 2) * Math.sin((SWEEP_DEGREES * Math.PI) / 180));
}

/**
 * The variance of the row sums of the ink turned by `degrees` counter-clockwise
 * about the centre of the padded crop. Only the ink pixels are turned: each is
 * carried to where the turn puts it and shares its mass between the two rows it
 * falls between (linear in the row), and ink that leaves the columns is lost.
 * The row count is fixed by the padding, so the variance compares across angles.
 */
function projectionVariance(xs: Int32Array, ys: Int32Array, w: number, pad: number, rows: number, degrees: number): number {
	const sums = new Float64Array(rows);
	if (degrees === 0) {
		for (let i = 0; i < xs.length; i++) sums[ys[i] + pad]++;
	} else {
		const rad = (degrees * Math.PI) / 180;
		const cos = Math.cos(rad);
		const sin = Math.sin(rad);
		const cx = w / 2;
		const cy = rows / 2;
		for (let i = 0; i < xs.length; i++) {
			const dx = xs[i] - cx;
			const dy = ys[i] + pad - cy;
			const xr = cx + dx * cos + dy * sin;
			if (xr < 0 || xr > w - 1) continue;
			const yr = cy - dx * sin + dy * cos;
			const r = Math.floor(yr);
			const f = yr - r;
			if (r >= 0 && r < rows) sums[r] += 1 - f;
			if (r + 1 >= 0 && r + 1 < rows) sums[r + 1] += f;
		}
	}
	let total = 0;
	let squares = 0;
	for (let y = 0; y < rows; y++) {
		total += sums[y];
		squares += sums[y] * sums[y];
	}
	return squares / rows - (total / rows) ** 2;
}

/** The deskew angle in degrees, positive counter-clockwise: see the header. */
export function skewAngle(data: Uint8Array, w: number, h: number): number {
	let n = 0;
	for (let i = 0; i < w * h; i++) if (data[i] < INK_BELOW) n++;
	const xs = new Int32Array(n);
	const ys = new Int32Array(n);
	for (let i = 0, k = 0; i < w * h; i++) {
		if (data[i] < INK_BELOW) {
			xs[k] = i % w;
			ys[k++] = Math.floor(i / w);
		}
	}
	const pad = sweepPad(w, h);
	const rows = h + 2 * pad;
	let best = 0;
	let bestVariance = projectionVariance(xs, ys, w, pad, rows, 0);
	for (let k = 1; k <= SWEEP_TENTHS; k++) {
		for (const tenths of [k, -k]) {
			const variance = projectionVariance(xs, ys, w, pad, rows, tenths / 10);
			if (variance > bestVariance) {
				bestVariance = variance;
				best = tenths;
			}
		}
	}
	return best / 10;
}

/** The grey crop rotated `degrees` counter-clockwise about its centre: bilinear, `fill` beyond the edge, same size. */
function rotateGrey(data: Uint8Array, w: number, h: number, degrees: number, fill: number): Uint8Array {
	if (degrees === 0) return Uint8Array.from(data);
	const rad = (degrees * Math.PI) / 180;
	const cos = Math.cos(rad);
	const sin = Math.sin(rad);
	const cx = w / 2;
	const cy = h / 2;
	const out = new Uint8Array(w * h);
	const at = (xx: number, yy: number) => (xx >= 0 && xx < w && yy >= 0 && yy < h ? data[yy * w + xx] : fill);
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			const dx = x - cx;
			const dy = y - cy;
			const sx = cx + dx * cos - dy * sin;
			const sy = cy + dx * sin + dy * cos;
			const x0 = Math.floor(sx);
			const y0 = Math.floor(sy);
			const fx = sx - x0;
			const fy = sy - y0;
			const v = (at(x0, y0) * (1 - fx) + at(x0 + 1, y0) * fx) * (1 - fy) + (at(x0, y0 + 1) * (1 - fx) + at(x0 + 1, y0 + 1) * fx) * fy;
			out[y * w + x] = Math.min(255, Math.max(0, Math.round(v)));
		}
	}
	return out;
}

/** A square maximum (`max`) or minimum filter `size` wide, odd, the window cut at the edges. */
function filterK(data: Uint8Array, w: number, h: number, size: number, max: boolean): Uint8Array {
	const r = (size - 1) / 2;
	const pick = max ? Math.max : Math.min;
	const across = new Uint8Array(w * h);
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			let v = data[y * w + x];
			for (let d = Math.max(0, x - r); d <= Math.min(w - 1, x + r); d++) v = pick(v, data[y * w + d]);
			across[y * w + x] = v;
		}
	}
	const out = new Uint8Array(w * h);
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			let v = across[y * w + x];
			for (let d = Math.max(0, y - r); d <= Math.min(h - 1, y + r); d++) v = pick(v, across[d * w + x]);
			out[y * w + x] = v;
		}
	}
	return out;
}

/**
 * The closing kernel for a staff space: the odd number nearest `CLOSE_SHARE * staffSpace`,
 * the lower of two where the share is an even number (1 means no closing).
 *
 * The first version took the largest odd number not above the share. At the
 * harness's own staff spaces (26.8 to 32.1 px, median 30.6) that gave no
 * closing at all on 90 of 234 systems, every system of S, T, K, and M among
 * them, where the measured configuration closed all of them with 3 by 3
 * (`measure-n135-stage2a_2026-10-27/kernel-by-staff-space.txt`). The nearest odd
 * number gives 3 on 233 of the 234.
 */
export function closingKernel(staffSpace: number): number {
	if (!Number.isFinite(staffSpace) || staffSpace <= 0) return 1;
	// Half the distance from 1, rounded down on a half (the small term keeps 0.1 * 40 from reading as above 4), then back to an odd number.
	const share = CLOSE_SHARE * staffSpace;
	// For a positive staff space this is at least 1: no floor is needed.
	return 2 * Math.ceil((share - 1) / 2 - 0.5 - 1e-9) + 1;
}

/** The ink closed with a kernel `size` wide: dilate then erode on the inverted grey, then inverted back. A size of 1 is no closing. */
function closeInk(data: Uint8Array, w: number, h: number, size: number): Uint8Array {
	if (size <= 1) return Uint8Array.from(data);
	const inverted = data.map((g) => 255 - g);
	const closed = filterK(filterK(inverted, w, h, size, true), w, h, size, false);
	return closed.map((g) => 255 - g);
}

/** The first and last row of the ink extent (2 to 98 percent of the ink, inclusive), or null for a crop with no ink. */
export function inkExtent(data: ArrayLike<number>, w: number, h: number): [number, number] | null {
	const perRow = new Array<number>(h).fill(0);
	let total = 0;
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) if (data[y * w + x] < INK_BELOW) perRow[y]++;
		total += perRow[y];
	}
	if (total === 0) return null;
	let first = -1;
	let last = -1;
	let sum = 0;
	for (let y = 0; y < h; y++) {
		sum += perRow[y];
		if (first < 0 && sum * TAIL_DENOMINATOR >= total) first = y;
		if (last < 0 && sum * TAIL_DENOMINATOR >= (TAIL_DENOMINATOR - 1) * total) last = y;
	}
	return [first, last];
}

/** The Keys cubic weights for the fraction `u` (a = -0.75), for the taps at -1, 0, +1, +2. */
function cubicWeights(u: number): [number, number, number, number] {
	const a = CUBIC_A;
	const c0 = ((a * (u + 1) - 5 * a) * (u + 1) + 8 * a) * (u + 1) - 4 * a;
	const c1 = ((a + 2) * u - (a + 3)) * u * u + 1;
	const c2 = ((a + 2) * (1 - u) - (a + 3)) * (1 - u) * (1 - u) + 1;
	return [c0, c1, c2, 1 - c0 - c1 - c2];
}

/** Both axes resized by `factor`, bicubic. */
function resizeCubic(data: Uint8Array, w: number, h: number, factor: number): { data: Uint8Array; width: number; height: number } {
	const nw = Math.max(1, Math.round(w * factor));
	const nh = Math.max(1, Math.round(h * factor));
	const taps = (n: number, size: number) => {
		const at: number[][] = [];
		const wt: Array<[number, number, number, number]> = [];
		for (let i = 0; i < n; i++) {
			const f = (i + 0.5) / factor - 0.5;
			const s = Math.floor(f);
			at.push([-1, 0, 1, 2].map((d) => Math.min(size - 1, Math.max(0, s + d))));
			wt.push(cubicWeights(f - s));
		}
		return { at, wt };
	};
	const hx = taps(nw, w);
	const vy = taps(nh, h);
	const wide = new Float32Array(nw * h);
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < nw; x++) {
			const [i0, i1, i2, i3] = hx.at[x];
			const [c0, c1, c2, c3] = hx.wt[x];
			wide[y * nw + x] = data[y * w + i0] * c0 + data[y * w + i1] * c1 + data[y * w + i2] * c2 + data[y * w + i3] * c3;
		}
	}
	const out = new Uint8Array(nw * nh);
	for (let y = 0; y < nh; y++) {
		const [j0, j1, j2, j3] = vy.at[y];
		const [c0, c1, c2, c3] = vy.wt[y];
		for (let x = 0; x < nw; x++) {
			const v = wide[j0 * nw + x] * c0 + wide[j1 * nw + x] * c1 + wide[j2 * nw + x] * c2 + wide[j3 * nw + x] * c3;
			out[y * nw + x] = Math.min(255, Math.max(0, Math.round(v)));
		}
	}
	return { data: out, width: nw, height: nh };
}

/** The crop with `pad` px of `fill` on every side. */
function padAll(data: Uint8Array, w: number, h: number, pad: number, fill: number): Uint8Array {
	const nw = w + 2 * pad;
	const out = new Uint8Array(nw * (h + 2 * pad)).fill(fill);
	for (let y = 0; y < h; y++) out.set(data.subarray(y * w, (y + 1) * w), (y + pad) * nw + pad);
	return out;
}

/**
 * The crop framed for a reader: deskewed, closed, scaled to `inkHeight`, and
 * padded by `padRatio` of `inkHeight`. A crop with no ink passes through the first three steps
 * unchanged and is padded. `staffSpace` is the staff space of the voice staff above the row, in the
 * crop's pixels, as `cutRows` takes it; it sizes the closing.
 */
export function frameRow(crop: GreyBandLike, staffSpace: number, options: FrameOptions = {}): FramedRow {
	const inkHeight = options.inkHeight ?? DEFAULT_INK_HEIGHT;
	const pad = Math.round((options.padRatio ?? DEFAULT_PAD_RATIO) * inkHeight);
	const { width, height } = crop;
	const grey = Uint8Array.from(crop.data as ArrayLike<number>);
	const paper = paperTone(grey);

	const angle = skewAngle(grey, width, height);
	const level = rotateGrey(grey, width, height, angle, paper);
	const closed = closeInk(level, width, height, closingKernel(staffSpace));

	let scaled = { data: closed, width, height };
	let scale = 1;
	const extent = inkExtent(closed, width, height);
	if (extent) {
		// The scale never exceeds what an ink extent of `MIN_ROW` staff spaces gets: a crop of one speck is not enlarged to a letter.
		const floor = Number.isFinite(staffSpace) && staffSpace > 0 ? MIN_ROW * staffSpace : 1;
		scale = inkHeight / Math.max(extent[1] - extent[0] + 1, floor);
		scaled = resizeCubic(closed, width, height, scale);
	}

	const framed = padAll(scaled.data, scaled.width, scaled.height, pad, paper);
	return {
		crop: { width: scaled.width + 2 * pad, height: scaled.height + 2 * pad, data: framed, paper },
		transform: { scale, pad, angle, width, height },
	};
}

/**
 * A point of the framed crop, in the original crop's pixel edges. Exact for the
 * scale and the padding; the angle is applied about the original crop's centre.
 */
export function unframePoint(t: FrameTransform, x: number, y: number): { x: number; y: number } {
	// The turn is about the pixel index (w / 2, h / 2), which is the edge coordinate (w / 2 + 0.5, h / 2 + 0.5).
	const cx = t.width / 2 + 0.5;
	const cy = t.height / 2 + 0.5;
	const dx = (x - t.pad) / t.scale - cx;
	const dy = (y - t.pad) / t.scale - cy;
	const rad = (t.angle * Math.PI) / 180;
	const cos = Math.cos(rad);
	const sin = Math.sin(rad);
	return { x: cx + dx * cos - dy * sin, y: cy + dx * sin + dy * cos };
}

/** A box read on the framed crop, as the bounding box of its four corners in the original crop. */
export function unframeBox(t: FrameTransform, box: PixelBox): PixelBox {
	const corners = [
		unframePoint(t, box.x0, box.y0),
		unframePoint(t, box.x1, box.y0),
		unframePoint(t, box.x0, box.y1),
		unframePoint(t, box.x1, box.y1),
	];
	const xs = corners.map((c) => c.x);
	const ys = corners.map((c) => c.y);
	return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}
