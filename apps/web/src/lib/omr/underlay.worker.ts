/**
 * The underlay's Worker (N.135 stage 2b): one page in, its framed rows and
 * their layout out, off the page's thread.
 *
 * It decodes the page image, finds the staves, the bands, and the rows, and
 * frames each row (`underlay-prepare.ts`); a full-width row takes about 1.5 s
 * to frame in Node, which the desk ruled must not block the page. The framed
 * rows go back as PNG images for the reader, which runs in the page's thread
 * (`underlay-recognize.ts`). The request and reply have the shape of the metre
 * worker's (`metre.worker.ts`).
 */
import { prepareUnderlay } from './underlay-prepare';
import type { PageLayout } from './underlay-page';
import type { StaffBoxLike } from './metre-windows';

export interface UnderlayRequest {
	id: number;
	image: Blob;
	musicXml: string;
	staves: StaffBoxLike[];
}

export type UnderlayResponse =
	| { id: number; ok: true; layout: PageLayout; rows: Blob[]; ms: number }
	| { id: number; ok: false; error: string };

const scope = self as unknown as { onmessage: ((e: MessageEvent<UnderlayRequest>) => void) | null; postMessage: (m: UnderlayResponse) => void };

/** A greyscale row as a PNG. */
async function png(data: Uint8Array, width: number, height: number): Promise<Blob> {
	const rgba = new Uint8ClampedArray(width * height * 4);
	for (let i = 0; i < data.length; i++) {
		rgba[i * 4] = rgba[i * 4 + 1] = rgba[i * 4 + 2] = data[i];
		rgba[i * 4 + 3] = 255;
	}
	const canvas = new OffscreenCanvas(width, height);
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('no 2d context');
	ctx.putImageData(new ImageData(rgba, width, height), 0, 0);
	return canvas.convertToBlob({ type: 'image/png' });
}

scope.onmessage = async (e) => {
	const { id, image, musicXml, staves } = e.data;
	try {
		const t0 = performance.now();
		const bitmap = await createImageBitmap(image);
		const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error('no 2d context');
		ctx.drawImage(bitmap, 0, 0);
		bitmap.close();
		const rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
		const data = new Uint8Array(canvas.width * canvas.height);
		for (let i = 0; i < data.length; i++) data[i] = rgba[i * 4];
		const { layout, rows } = prepareUnderlay({ width: canvas.width, height: canvas.height, data }, musicXml, staves);
		const blobs = await Promise.all(rows.map((r) => png(r.data, r.width, r.height)));
		scope.postMessage({ id, ok: true, layout, rows: blobs, ms: performance.now() - t0 });
	} catch (err) {
		scope.postMessage({ id, ok: false, error: String((err as Error)?.message ?? err) });
	}
};
