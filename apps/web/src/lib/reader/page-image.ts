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

import { isHeifImage } from './heif-brand';
import type { HeicRgba } from './heic-decode';

/** Thrown where the browser cannot decode the picture at all. */
export class ImageUndecodableError extends Error {
	readonly code = 'IMAGE_UNDECODABLE';
}

/** The file name without its extension, `page` where nothing is left. */
const stemOf = (file: File): string => file.name.replace(/\.[^.]+$/, '') || 'page';

/**
 * A stable id for one picture: the file name's stem plus a short content hash.
 *
 * Ruling A derives `pieceId` this way, and the retention ruling already records
 * "the original's name and hash", so this is the same fact under one name
 * rather than a second one invented for the reader.
 */
export async function pieceIdFor(file: File): Promise<string> {
	const stem = stemOf(file);
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
 * HEIC, named: Chromium and Firefox do not decode it, so `createImageBitmap`
 * rejects. Row 113: when the bytes sniff as HEIF, the picture is decoded in
 * WebAssembly instead (`heic-decode.ts`, loaded only here, only then) and
 * drawn to the same canvas, so everything after the decode is the one path.
 * A browser that decodes HEIC itself (Safari may) never reaches the fallback;
 * whether iOS hands the page a HEIC or a JPEG is NOT ESTABLISHED. A picture the
 * fallback cannot decode either is the same `ImageUndecodableError` as before.
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
		return heifToGreyscalePng(file, err);
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

const messageOf = (err: unknown): string => (err instanceof Error ? err.message : String(err));

/** The fallback for a picture the browser would not decode: HEIF only, else the original refusal. */
async function heifToGreyscalePng(file: File, cause: unknown): Promise<ArrayBuffer> {
	if (!isHeifImage(new Uint8Array(await file.slice(0, 12).arrayBuffer()))) {
		throw new ImageUndecodableError(messageOf(cause));
	}
	let rgba: HeicRgba;
	try {
		const { decodeHeic } = await import('./heic-decode');
		rgba = await decodeHeic(new Uint8Array(await file.arrayBuffer()));
	} catch (err) {
		throw new ImageUndecodableError(messageOf(err));
	}
	const canvas = new OffscreenCanvas(rgba.width, rgba.height);
	const ctx = canvas.getContext('2d', { willReadFrequently: true });
	if (!ctx) throw new ImageUndecodableError('no 2d context for the page canvas');
	ctx.putImageData(new ImageData(rgba.data, rgba.width, rgba.height), 0, 0);
	return greyscaleCanvasToPng(canvas, ctx);
}

/**
 * The ink as a PNG file named for the picture it came from. The poem route
 * hands this to the OCR in place of the original, so tesseract reads the
 * greyscale the score routes read and never has to decode a HEIC, a JPEG, or a
 * PNG of its own.
 */
export function inkPng(source: File, ink: ArrayBuffer): File {
	return new File([ink], `${stemOf(source)}.png`, { type: 'image/png' });
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
