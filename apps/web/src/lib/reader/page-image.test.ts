/**
 * Row 113. The dispatch in `toGreyscalePng`, with the browser's decoder and the
 * canvas stubbed on `globalThis` (Node has neither): a picture the browser
 * decodes never loads the HEIC decoder, a HEIF the browser refuses does, once,
 * and anything else the browser refuses is the same refusal as before.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const decoder = vi.hoisted(() => ({ loaded: 0, calls: 0, fail: false }));
vi.mock('./heic-decode', () => {
	decoder.loaded++;
	return {
		decodeHeic: async () => {
			decoder.calls++;
			if (decoder.fail) throw new Error('not a HEIF image the decoder can read');
			return { width: 2, height: 1, data: new Uint8ClampedArray([10, 10, 10, 255, 200, 200, 200, 255]) };
		}
	};
});

import { ImageUndecodableError, inkPng, toGreyscalePng } from './page-image';

const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const JPEG = [0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46, 0x49, 0x46, 0, 1];
const HEIC = [0, 0, 0, 0x18, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63, 0, 0, 0, 0];
const AVIF = [0, 0, 0, 0x18, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66, 0, 0, 0, 0];
const file = (head: number[], name: string) => new File([new Uint8Array(head)], name);

let putImageData: ReturnType<typeof vi.fn>;
let drawn: { width: number; height: number }[];

beforeEach(() => {
	decoder.calls = 0;
	decoder.fail = false;
	drawn = [];
	putImageData = vi.fn();
	// What the browser does: it decodes a PNG or JPEG, and refuses HEIC and AVIF.
	vi.stubGlobal('createImageBitmap', async (f: File) => {
		const head = new Uint8Array(await f.slice(0, 4).arrayBuffer());
		if (head[0] === 0x89 || head[0] === 0xff) return { width: 3, height: 2, close() {} };
		throw new DOMException('The source image cannot be decoded.', 'InvalidStateError');
	});
	vi.stubGlobal(
		'OffscreenCanvas',
		class {
			constructor(
				public width: number,
				public height: number
			) {
				drawn.push({ width, height });
			}
			getContext() {
				return {
					drawImage() {},
					getImageData: (_x: number, _y: number, w: number, h: number) => ({ data: new Uint8ClampedArray(w * h * 4) }),
					putImageData
				};
			}
			async convertToBlob() {
				return new Blob([new Uint8Array(PNG)], { type: 'image/png' });
			}
		}
	);
	vi.stubGlobal('ImageData', class { constructor(public data: Uint8ClampedArray, public width: number, public height: number) {} });
});

afterEach(() => vi.unstubAllGlobals());

describe('toGreyscalePng', () => {
	it('resolves a PNG and a JPEG without loading the HEIC decoder', async () => {
		await expect(toGreyscalePng(file(PNG, 'page.png'))).resolves.toBeInstanceOf(ArrayBuffer);
		await expect(toGreyscalePng(file(JPEG, 'page.jpg'))).resolves.toBeInstanceOf(ArrayBuffer);
		expect(decoder.loaded).toBe(0);
		expect(decoder.calls).toBe(0);
	});

	it('decodes a HEIF the browser refuses, loading the decoder once however many it reads', async () => {
		const out = await toGreyscalePng(file(HEIC, 'IMG_0001.HEIC'));
		expect(new Uint8Array(out).slice(0, 4)).toEqual(new Uint8Array(PNG.slice(0, 4)));
		await toGreyscalePng(file(HEIC, 'IMG_0002.HEIC'));
		expect(decoder.loaded).toBe(1);
		expect(decoder.calls).toBe(2);
		expect(drawn[0]).toEqual({ width: 2, height: 1 });
		const [image] = putImageData.mock.calls[0];
		expect([image.width, image.height]).toEqual([2, 1]);
	});

	it('throws ImageUndecodableError when the decoder fails too', async () => {
		decoder.fail = true;
		const err = await toGreyscalePng(file(HEIC, 'broken.heic')).catch((e) => e);
		expect(err).toBeInstanceOf(ImageUndecodableError);
		expect(err.code).toBe('IMAGE_UNDECODABLE');
	});

	it('leaves an AVIF, which is not HEIF, as the same refusal without loading the decoder', async () => {
		await expect(toGreyscalePng(file(AVIF, 'photo.avif'))).rejects.toBeInstanceOf(ImageUndecodableError);
		expect(decoder.calls).toBe(0);
	});

	it('throws ImageUndecodableError for bytes nothing can decode', async () => {
		await expect(toGreyscalePng(file([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 'x.bin'))).rejects.toBeInstanceOf(ImageUndecodableError);
		expect(decoder.calls).toBe(0);
	});
});

describe('inkPng', () => {
	it('is an image/png File named for the picture it came from', async () => {
		const ink = new Uint8Array(PNG).buffer;
		const f = inkPng(new File([], 'IMG_0001.HEIC'), ink);
		expect(f).toBeInstanceOf(File);
		expect(f.name).toBe('IMG_0001.png');
		expect(f.type).toBe('image/png');
		expect(new Uint8Array(await f.arrayBuffer())).toEqual(new Uint8Array(PNG));
	});

	it('names a picture with no stem page.png, and keeps only the last extension off', () => {
		expect(inkPng(new File([], '.hidden'), new ArrayBuffer(0)).name).toBe('page.png');
		expect(inkPng(new File([], 'Op.38 No.3.jpeg'), new ArrayBuffer(0)).name).toBe('Op.38 No.3.png');
	});
});
