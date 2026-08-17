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

/** Ruling E's raster resolution. PDF user space is 72 units to the inch. */
const TARGET_DPI = 400;
const PDF_UNITS_PER_INCH = 72;

/**
 * Rasterize every page of a PDF to greyscale PNG ink, in page order.
 *
 * The pages come back as an array because `envelope.run` is ctx-chained across
 * them, which is what makes measure numbering continuous over a whole piece
 * rather than restarting at each page.
 */
export async function rasterizePdf(file: File): Promise<ArrayBuffer[]> {
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

	// Teardown lives on the LOADING TASK, not on the document proxy, which has
	// only `cleanup()`. Holding the task is the only way to release the worker.
	const task = pdfjs.getDocument({ data: bytes });
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
		for (let n = 1; n <= doc.numPages; n++) {
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
