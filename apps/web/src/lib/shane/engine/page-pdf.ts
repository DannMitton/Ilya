/**
 * page-pdf — a PDF becomes the same greyscale ink a photograph becomes.
 *
 * N.59 step 8, on Dann's ruling of 2026-08-16 approving `pdfjs-dist` 6.2.108
 * (Apache-2.0, zero runtime dependencies, pinned exactly rather than with a
 * caret because a rasterizer that drifts changes what the reader sees).
 *
 * THIS MODULE IS NEVER IMPORTED STATICALLY. `pdf.mjs` and `pdf.worker.mjs` are
 * 174 KB and 470 KB gzipped, more than the rest of the app put together, so the
 * caller reaches it through a dynamic `import()` on a real PDF and nobody else
 * ever pays. That is the same N.26 law that governs denigma and webmscore, and
 * denigma is heavier still at 1,039,849 bytes gzipped.
 *
 * 400 DPI, per Ruling E. The reader's one measured working point was s = 17.00
 * at 300 dpi, and the ratified retention rule floors s at 20. 400 dpi scales
 * this repertoire's s of about 17 to about 23, which clears the floor with
 * margin. The cost is real and is named rather than hidden: a letter page
 * rasterizes to roughly 3400 x 4400 pixels, and a ten-page PDF is tens of
 * megabytes of ink and about twenty seconds of reading.
 *
 * WHAT IS STORED IS THE PDF, NOT THE RASTERS. That follows Dann's own ruled
 * precedent for `.musx`, which is kept byte for byte and not as its conversion,
 * because "storing the conversion would freeze the song at today's converter".
 * Rasters are today's rasterizer's opinion; the PDF is what the singer had.
 *
 * KNOWN LIMITATION, named rather than discovered later: pdf.js is given no
 * `standardFontDataUrl`, so a PDF that relies on non-embedded standard fonts
 * may render its TEXT wrong. Engraved music embeds its notation fonts, and the
 * reader looks at noteheads and staff rules rather than at text, so this is
 * stated as a boundary and not as a fix.
 */

import { greyscaleCanvasToPng } from './page-image';

/** Thrown where the PDF cannot be opened or has no pages. */
export class PdfUnreadableError extends Error {
	readonly code = 'PDF_UNREADABLE';
}

/**
 * Thrown where pdf.js's own JBIG2 decoder silently gave up. N.96: a JBIG2
 * page comes back from `page.render()` with no thrown error and a fully
 * blank canvas, so this is caught after the fact rather than at the call
 * that failed. `hasJbig2Marker` and `canvasIsBlank` are the two tests that
 * together stand in for the error pdf.js never throws.
 */
export class PdfJbig2UndecodedError extends Error {
	readonly code = 'PDF_JBIG2_UNDECODED';
}

/** Ruling E's raster resolution. PDF user space is 72 units to the inch. */
const TARGET_DPI = 400;
const PDF_UNITS_PER_INCH = 72;

/**
 * A plain byte scan for the ASCII filter name `/JBIG2Decode` in the raw PDF.
 * This is a heuristic, not a parse: it will not find the marker if it sits
 * inside a compressed object stream (a `/ObjStm`), which some PDF writers
 * use. It is only ever consulted alongside a blank-canvas result from
 * `page.render()`, so a false negative here just means the blank page falls
 * through to the generic, less specific failure instead of this one -- it
 * cannot manufacture a false JBIG2 report on its own.
 */
function hasJbig2Marker(bytes: Uint8Array): boolean {
	const marker = '/JBIG2Decode';
	const n = marker.length;
	outer: for (let i = 0; i + n <= bytes.length; i++) {
		if (bytes[i] !== 0x2f /* '/' */) continue;
		for (let j = 1; j < n; j++) {
			if (bytes[i + j] !== marker.charCodeAt(j)) continue outer;
		}
		return true;
	}
	return false;
}

/**
 * True where EVERY pixel of the rendered page is at or above a near-white
 * threshold. Exhaustive rather than sampled: a page carrying one stray mark
 * is not blank, and a sample can miss it. A JBIG2 page that pdf.js failed to decode renders as
 * a plain white rectangle -- no thrown error, just nothing painted -- so this
 * is the only signal available after the fact.
 */
function canvasIsBlank(
	ctx: OffscreenCanvasRenderingContext2D,
	width: number,
	height: number
): boolean {
	const NEAR_WHITE = 250;
	const { data } = ctx.getImageData(0, 0, width, height);
	for (let i = 0; i < data.length; i += 4) {
		if (data[i] < NEAR_WHITE) return false;
	}
	return true;
}

/**
 * Rasterize a PDF to greyscale PNG ink, in page order.
 *
 * The pages come back as an array because `envelope.run` is ctx-chained across
 * them, which is what makes measure numbering continuous over a whole piece
 * rather than restarting at each page.
 *
 * `maxPages` stops after that many, and exists for N.97's clef-and-key probe,
 * which asks about the FIRST page and would otherwise pay to rasterize a ten-
 * page score twice. Omitted, every page is rendered, which is what the read
 * itself always asks for.
 */
export async function rasterizePdf(file: File, maxPages?: number): Promise<ArrayBuffer[]> {
	const bytes = new Uint8Array(await file.arrayBuffer());

	let pdfjs: typeof import('pdfjs-dist');
	let workerSrc: string;
	try {
		[pdfjs, workerSrc] = await Promise.all([
			import('pdfjs-dist'),
			import('pdfjs-dist/build/pdf.worker.mjs?url').then((m) => m.default as string),
		]);
	} catch (err) {
		throw new PdfUnreadableError(
			`the PDF reader could not be loaded: ${err instanceof Error ? err.message : String(err)}`
		);
	}
	pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

	// SCANNED BEFORE `getDocument`, AND THE ORDER IS THE WHOLE POINT. pdf.js
	// TRANSFERS this buffer to its worker, which DETACHES it: after that call
	// `bytes.length` is 0 and any scan of it finds nothing. Reading the marker
	// afterwards reported every PDF as carrying no JBIG2, so the named failure
	// further down could never fire at all. Found 2026-08-24 by a browser
	// negative control that served `/pdfjs-wasm/` as 404: the page came back
	// blank, as it should, under the generic message rather than the JBIG2 one.
	const hasJbig2 = hasJbig2Marker(bytes);

	// Teardown lives on the LOADING TASK, not on the document proxy, which has
	// only `cleanup()`. Holding the task is the only way to release the worker.
	//
	// wasmUrl per N.96: pdf.js's own JBIG2 and JPEG 2000 decoders are WASM
	// modules it fetches lazily from this directory, which
	// `scripts/copy-pdfjs-wasm.mjs` fills at dev and build. Without the option
	// pdf.js builds the literal URL `"null" + "jbig2.wasm"`, fails that fetch,
	// fails the fallback `import()` too, and paints NOTHING: a correctly sized,
	// entirely white page with no error thrown anywhere the app can see it. The
	// trailing slash is required, because pdf.js appends filenames directly.
	const task = pdfjs.getDocument({ data: bytes, wasmUrl: '/pdfjs-wasm/' });
	let doc: Awaited<typeof task.promise>;
	try {
		doc = await task.promise;
	} catch (err) {
		await task.destroy();
		throw new PdfUnreadableError(err instanceof Error ? err.message : String(err));
	}

	try {
		if (doc.numPages < 1) throw new PdfUnreadableError('this PDF has no pages');
		const scale = TARGET_DPI / PDF_UNITS_PER_INCH;
		const pages: ArrayBuffer[] = [];
		const last = maxPages === undefined ? doc.numPages : Math.min(doc.numPages, maxPages);
		for (let n = 1; n <= last; n++) {
			const page = await doc.getPage(n);
			try {
				const viewport = page.getViewport({ scale });
				const canvas = new OffscreenCanvas(
					Math.max(1, Math.round(viewport.width)),
					Math.max(1, Math.round(viewport.height))
				);
				const ctx = canvas.getContext('2d', { willReadFrequently: true });
				if (!ctx) throw new PdfUnreadableError('no 2d context for the page canvas');
				// A PDF page is transparent where nothing is drawn, and the reader
				// binarises on `img < 128`, so an unpainted background would read as
				// ink over the whole page. Paint the paper white first.
				ctx.fillStyle = '#FFFFFF';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				await page.render({
					canvas: canvas as unknown as HTMLCanvasElement,
					canvasContext: ctx as unknown as CanvasRenderingContext2D,
					viewport,
				}).promise;
				// N.96: pdf.js's JBIG2 decoder can fail without throwing, leaving
				// the page blank. Caught here, not at the render call, because
				// blank-and-silent is the only symptom -- there is no error to
				// catch. Gated on the byte-scan too, so an ordinary blank page
				// (a real title page, a rest) is not misreported as this.
				if (hasJbig2 && canvasIsBlank(ctx, canvas.width, canvas.height)) {
					// Message here is dev-facing only. What the user sees is the
					// approved bilingual string in i18n.ts, reached by `code`
					// through `asReaderError` and `ScoreUploader`'s `classify()` --
					// the same path `PdfUnreadableError` already takes.
					throw new PdfJbig2UndecodedError(
						`page ${n} rendered blank and this PDF contains a /JBIG2Decode stream`
					);
				}
				pages.push(await greyscaleCanvasToPng(canvas, ctx));
			} finally {
				page.cleanup();
			}
		}
		return pages;
	} finally {
		await task.destroy();
	}
}
