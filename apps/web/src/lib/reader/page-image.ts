/**
 * page-image — turning a singer's photograph into the ink the reader reads.
 *
 * N.59, Ruling E, reconciling the reader's working point with the ratified
 * retention ruling. The retention rule stores a picture "as its ink, in
 * greyscale at no less than the reader's working resolution with margin", and
 * NEVER binarised: turning grey into black and white is the extractor's own
 * first derivation, and doing it early and permanently destroys what a better
 * reader would need. Its precedent is the Xerox JBIG2 substitution incident.
 *
 * So there is ONE conversion here, greyscale, and it is the same bytes that are
 * read and stored. A re-read of a restored page therefore reproduces the first
 * read exactly, which is what makes step 7's restore honest rather than
 * approximate.
 *
 * The reader's own binarisation threshold (`img < 128`, `reader.py`) still
 * happens, but it happens inside the reader on every run, on the grey it was
 * given. Nothing persisted is ever binary.
 */

/** Thrown where the browser cannot decode the picture at all. */
export class ImageUndecodableError extends Error {
	readonly code = 'IMAGE_UNDECODABLE';
}

/**
 * A stable id for one picture: the file name's stem plus a short content hash.
 *
 * Ruling A derives `pieceId` this way, and the retention ruling already records
 * "the original's name and hash", so this is the same fact under one name
 * rather than a second one invented for the reader.
 */
export async function pieceIdFor(file: File): Promise<string> {
	const stem = file.name.replace(/\.[^.]+$/, '') || 'page';
	const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
	const hex = [...new Uint8Array(digest)]
		.slice(0, 4)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
	return `${stem}-${hex}`;
}

/**
 * Decode a picture and re-encode it as a GREYSCALE PNG.
 *
 * HEIC, named: Chromium does not decode it, so `createImageBitmap` rejects and
 * the caller turns that into a typed error asking for JPEG or PNG. Whether iOS
 * transcodes HEIC to JPEG on its way through the unfiltered picker (N.70
 * dropped the `accept` attribute on mobile) is NOT ESTABLISHED, so this path
 * exists to be honest about the failure rather than to predict it.
 *
 * PNG is chosen over JPEG deliberately: a photographed page is about to be read
 * for hairline staff rules and notehead geometry, and JPEG ringing around
 * high-contrast edges is exactly the artefact that would corrupt that. The
 * weight cost is real and is the retention ruling's own trade.
 */
export async function toGreyscalePng(file: File): Promise<ArrayBuffer> {
	let bitmap: ImageBitmap;
	try {
		bitmap = await createImageBitmap(file);
	} catch (err) {
		throw new ImageUndecodableError(err instanceof Error ? err.message : String(err));
	}
	try {
		const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
		const ctx = canvas.getContext('2d', { willReadFrequently: true });
		if (!ctx) throw new ImageUndecodableError('no 2d context for the page canvas');
		ctx.drawImage(bitmap, 0, 0);
		return greyscaleCanvasToPng(canvas, ctx);
	} finally {
		bitmap.close();
	}
}

/**
 * Flatten whatever has been drawn on a canvas to greyscale, in place, and
 * encode it as a PNG. Shared by the photograph path above and the PDF
 * rasterizer, so both produce the SAME kind of ink and the reader cannot tell
 * them apart. Exported for that reason and no other.
 */
export async function greyscaleCanvasToPng(
	canvas: OffscreenCanvas,
	ctx: OffscreenCanvasRenderingContext2D
): Promise<ArrayBuffer> {
	const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const px = image.data;
	for (let i = 0; i < px.length; i += 4) {
		// Rec. 601 luma, the same weighting OpenCV's own COLOR_BGR2GRAY uses, so
		// the grey the reader sees here matches the grey it sees when a harness
		// fixture is read from disk.
		const y = (px[i] * 299 + px[i + 1] * 587 + px[i + 2] * 114) / 1000;
		px[i] = px[i + 1] = px[i + 2] = y;
		px[i + 3] = 255;
	}
	ctx.putImageData(image, 0, 0);
	const blob = await canvas.convertToBlob({ type: 'image/png' });
	return blob.arrayBuffer();
}
