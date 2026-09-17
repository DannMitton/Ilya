/**
 * staff-detect — one fast, boolean answer: does this page show staves?
 *
 * N.146. Every PDF and picture used to ask which it was (`intake.pdf.title` /
 * `intake.picture.title`). This answers instead, cheaply enough to run on
 * every drop before anything is decided.
 *
 * THIS IS THE "LIGHT CHECK" FROM THE BRIEF'S STEP 0, chosen over the photo
 * reader's own `detect_staves` (`tools/e16-harness/reader/reader.py:352`)
 * because it agreed with that function on all fifteen pages measured for the
 * brief (memo `../../../../../../docs/sessions/memo-n146-poem-or-score-detected_r1_2026-09-16.md`,
 * step 0), at a fraction of the cost: `detect_staves` runs in well under
 * 40ms once loaded, but reaching it at all means Pyodide plus numpy, opencv
 * and matplotlib, a warm-up N.59 measured at 2.9s and N.26 ruled that "a
 * drop of one kind never pays for another's warm-up". Every text PDF and
 * every photographed poem would pay that warm-up for nothing were the
 * reader's own detector used here instead.
 *
 * THE SHAPE IS THE READER'S OWN, simplified. `detect_staves` derives an
 * adaptive gate per page, groups candidate rows into line centres within 3px
 * (`_lines_from_rows`), and validates five-line groups; it also carries a
 * fallback path for a page whose primary gate collapses (a skewed staff
 * rule, N.96 Part 2) and a sentinel that halts rather than guesses. NONE OF
 * THAT SURVIVES HERE. This only needs a yes-or-no answer to "is there at
 * least one staff on this page anywhere", not a precise line-by-page
 * geometry to read notes from, so ONE plausible five-line group anywhere on
 * the page is enough: a single damaged staff among dozens on a real page of
 * music costs this function nothing, because it is not the only one it
 * looks at.
 */

export interface StaffDetectOptions {
	/** A pixel at or below this luma is "ink". Matches `img < 128` in reader.py. */
	darkThreshold?: number;
	/** A row counts as a line candidate once this fraction of the full page
	 *  width is ink. Fixed, not adaptive: `detect_staves` derives its gate
	 *  per page precisely because it needs to survive pages this function
	 *  does not have to get right (see the file header). */
	rowGate?: number;
	/** How far a line-to-line gap may drift from its group's mean and still count as "even". */
	spacingTolerance?: number;
}

const DEFAULTS: Required<StaffDetectOptions> = {
	darkThreshold: 128,
	rowGate: 0.4,
	spacingTolerance: 0.15,
};

/**
 * `pixels` is RGBA, the shape `CanvasRenderingContext2D.getImageData` returns
 * and the shape `greyscaleCanvasToPng` (`page-image.ts`) has already flattened
 * every page to before this ever runs: R, G and B already agree, so only the
 * first channel of each pixel is read.
 */
export function detectStavesLight(
	pixels: Uint8ClampedArray,
	width: number,
	height: number,
	options: StaffDetectOptions = {}
): boolean {
	const { darkThreshold, rowGate, spacingTolerance } = { ...DEFAULTS, ...options };
	if (width === 0 || height === 0) return false;

	const rowfrac = new Float64Array(height);
	for (let y = 0; y < height; y++) {
		let dark = 0;
		const rowBase = y * width * 4;
		for (let x = 0; x < width; x++) {
			if (pixels[rowBase + x * 4] < darkThreshold) dark++;
		}
		rowfrac[y] = dark / width;
	}

	const candidateRows: number[] = [];
	for (let y = 0; y < height; y++) if (rowfrac[y] > rowGate) candidateRows.push(y);
	if (candidateRows.length === 0) return false;

	// Proximity grouping, `_lines_from_rows`' own 3px chain (reader.py:341-350).
	const lines: number[] = [];
	let group: number[] = [candidateRows[0]];
	for (let i = 1; i < candidateRows.length; i++) {
		if (candidateRows[i] - group[group.length - 1] <= 3) {
			group.push(candidateRows[i]);
		} else {
			lines.push(Math.round(group.reduce((a, b) => a + b, 0) / group.length));
			group = [candidateRows[i]];
		}
	}
	lines.push(Math.round(group.reduce((a, b) => a + b, 0) / group.length));

	for (let i = 0; i + 4 < lines.length; i++) {
		const five = lines.slice(i, i + 5);
		const gaps = five.slice(1).map((v, j) => v - five[j]);
		const meanGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
		if (meanGap <= 0) continue;
		if (gaps.every((g) => Math.abs(g - meanGap) <= spacingTolerance * meanGap)) return true;
	}
	return false;
}

/**
 * Decode a greyscale PNG, the shape `toGreyscalePng` and `rasterizePdf`
 * (page-image.ts, page-pdf.ts) both hand back, and answer the same question
 * for a caller that only has the encoded bytes. The decode is a real cost
 * named rather than hidden: `rasterizePdf` already held this page as pixels
 * before it encoded them, and this decodes them straight back. Avoiding that
 * round trip would mean changing what `rasterizePdf` and `toGreyscalePng`
 * return, which every OTHER caller of those two functions would then carry
 * too; this is the smaller cost of the two, and it is once per drop.
 */
export async function hasStaves(png: ArrayBuffer, options?: StaffDetectOptions): Promise<boolean> {
	const bitmap = await createImageBitmap(new Blob([png], { type: 'image/png' }));
	try {
		const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
		const ctx = canvas.getContext('2d', { willReadFrequently: true });
		// NOTHING HERE CAN FAIL THE UPLOAD (the same law `probeFile` states in
		// ScoreUploader.svelte): a canvas that cannot be read abstains to "no
		// staves found", and the poem route that follows reports its own
		// failure in its own words if this page turns out not to be one.
		if (!ctx) return false;
		ctx.drawImage(bitmap, 0, 0);
		const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
		return detectStavesLight(data, width, height, options);
	} finally {
		bitmap.close();
	}
}
