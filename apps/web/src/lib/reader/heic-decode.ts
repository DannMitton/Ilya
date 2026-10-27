/**
 * heic-decode: a HEIC or HEIF photograph decoded to RGBA in WebAssembly.
 *
 * Row 113. A phone photograph from an iPhone is HEIC, and Chromium and Firefox
 * cannot decode it, so `createImageBitmap` rejects. page-image.ts calls this
 * only after that rejection, and only when the bytes sniff as HEIF
 * (`isHeifImage`), so a JPEG, a PNG, and a PDF never load a byte of it and the
 * page load never does either.
 *
 * The decoder is libheif-js 1.23.5, an Emscripten build of libheif with the
 * libde265 HEVC decoder, LGPL-3.0 (NOTICES.md). Its JavaScript glue is bundled
 * with the app and loaded by the dynamic `import()` below. Its `libheif.wasm`
 * is its own file, served from this origin at `/heif/libheif.wasm` by
 * scripts/copy-heif-wasm.mjs with the licence text beside it, so the library
 * can be replaced without rebuilding the app. Nothing is fetched from another
 * origin.
 *
 * libheif applies the image's rotation (`irot`) and mirroring (`imir`) and
 * crop (`clap`) itself, and reassembles a `grid` of tiles, so the RGBA comes
 * back upright and whole. This module adds no orientation step.
 *
 * It runs in the page, not a Worker: the glue is synchronous either way, and a
 * Worker also loads in Chromium (measured, step 0), so moving it is open if the
 * block on the page proves too long on a phone.
 */

/** Where scripts/copy-heif-wasm.mjs puts the binary. Absolute, as `/pdfjs-wasm/` is. */
export const HEIF_WASM_URL = '/heif/libheif.wasm';

export interface HeicRgba {
	width: number;
	height: number;
	/** RGBA, 4 bytes a pixel, row by row. */
	data: Uint8ClampedArray<ArrayBuffer>;
}

async function fetchWasm(): Promise<Uint8Array> {
	const res = await fetch(HEIF_WASM_URL);
	if (!res.ok) throw new Error(`the HEIC decoder could not be fetched (${res.status})`);
	return new Uint8Array(await res.arrayBuffer());
}

/**
 * Decode the PRIMARY image of a HEIC or HEIF file. libheif-js lists every
 * top-level image in item-ID order, not the primary first, so the primary is
 * chosen by `is_primary()`; the first is the fallback if none says so.
 *
 * Rejects when the file is not a HEIF it can read, is damaged or truncated, or
 * the decoder's files cannot be fetched. `wasmBinary` is for tests, which have
 * no origin to fetch from.
 *
 * A fresh WebAssembly instance is made for each call and left to be collected,
 * because an Emscripten heap never shrinks: a 12 megapixel photograph would
 * otherwise leave hundreds of megabytes held after the read.
 */
export async function decodeHeic(bytes: Uint8Array, wasmBinary?: Uint8Array): Promise<HeicRgba> {
	const [glue, wasm] = await Promise.all([
		import('libheif-js/libheif-wasm/libheif.js'),
		wasmBinary ?? fetchWasm()
	]);
	// A CommonJS module: `default` is `module.exports` under Vite and Node alike.
	const factory = (glue.default ?? glue) as typeof glue.default;
	if (typeof factory !== 'function') throw new Error('the HEIC decoder did not load');
	const lib = await factory({ wasmBinary: wasm });
	const images = new lib.HeifDecoder().decode(bytes);
	if (images.length === 0) throw new Error('not a HEIF image the decoder can read');
	const image = images.find((i) => i.is_primary()) ?? images[0];
	try {
		const width = image.get_width();
		const height = image.get_height();
		const out = await new Promise<{ data: Uint8ClampedArray<ArrayBuffer> }>((resolve, reject) =>
			image.display({ data: new Uint8ClampedArray(width * height * 4), width, height }, (r) =>
				r ? resolve(r) : reject(new Error('the HEIF image could not be decoded'))
			)
		);
		return { width, height, data: out.data };
	} finally {
		for (const i of images) i.free();
	}
}
