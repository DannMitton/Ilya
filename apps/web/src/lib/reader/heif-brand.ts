/**
 * heif-brand: is a picture HEIC or HEIF, by its bytes.
 *
 * Row 113. This lived in `score/ingestion/format-detection.ts`. page-image.ts
 * needs it to decide whether to load the HEIC decoder, and `reader/` may not
 * import `score/` (scripts/ratchets.mjs, MODULES), so the brand list and the
 * sniff moved here and format-detection.ts imports them. The AVIF brands stay
 * in format-detection.ts: an AVIF is not HEIF and never loads the decoder.
 *
 * An ISO-BMFF file opens with a four-byte box size, then `ftyp` at offset 4,
 * then the major brand at offset 8 (see format-detection.ts for the measured
 * iPhone headers).
 */

/** HEIF major brands: still images, image sequences, and the generic HEIF brands. */
export const HEIF_BRANDS = [
	'heic', 'heix', 'heim', 'heis', // HEIF still images
	'hevc', 'hevx', 'hevm', 'hevs', // HEIF image sequences
	'mif1', 'msf1' // generic HEIF image / image-sequence brands
];

const FTYP = [0x66, 0x74, 0x79, 0x70]; // "ftyp"

/**
 * Is this picture HEIC or HEIF, by its bytes? Asked only after a browser
 * has failed to decode a picture, so that failure can load the decoder or
 * name the format and its way out (`upload.err.imageHeic`).
 */
export function isHeifImage(bytes: Uint8Array): boolean {
	if (!FTYP.every((b, i) => bytes[4 + i] === b)) return false;
	const brand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]).toLowerCase();
	return HEIF_BRANDS.includes(brand);
}
