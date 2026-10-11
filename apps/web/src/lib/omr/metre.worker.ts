/**
 * The time-signature reader's Worker (QUEUE row 57): one page in, every window
 * of its voice staves read, off the page's thread.
 *
 * The network runs on WebAssembly here, about a third of a second a window
 * (run 2 of round 6: 8.6 to 33.8 seconds a song in the page's thread, which
 * the desk ruled must not block the page). The page image is decoded here
 * too. Each request is answered with the windows the join needs
 * (`metre-witness.ts`, `MetreSeen`), or with an error string.
 */
import { loadMetreNet, readPageMetres } from './metre-model';
import { linesBeyond, type StaffBoxLike } from './metre-windows';
import type { MetreSeen } from './metre-witness';

export interface MetreRequest {
	id: number;
	image: Blob;
	musicXml: string;
	staves: StaffBoxLike[];
}

export type MetreResponse =
	| { id: number; ok: true; seen: MetreSeen[]; unfound: number; small: number; ms: number }
	| { id: number; ok: false; error: string };

const scope = self as unknown as { onmessage: ((e: MessageEvent<MetreRequest>) => void) | null; postMessage: (m: MetreResponse) => void };

scope.onmessage = async (e) => {
	const { id, image, musicXml, staves } = e.data;
	try {
		const t0 = performance.now();
		const net = await loadMetreNet();
		const bitmap = await createImageBitmap(image);
		const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error('no 2d context');
		ctx.drawImage(bitmap, 0, 0);
		bitmap.close();
		const rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
		const data = new Uint8Array(canvas.width * canvas.height);
		for (let i = 0; i < data.length; i++) data[i] = rgba[i * 4];
		const { reads, unfound, small } = await readPageMetres({ width: canvas.width, height: canvas.height, data }, musicXml, staves, net);
		const seen: MetreSeen[] = reads.map((r) => {
			const L = linesBeyond(r.window.staff, r.window.x0);
			return {
				x0: r.window.x0,
				top: L[0],
				bottom: L[4],
				space: r.window.staff.space,
				lab: r.verdict.lab,
				why: 'why' in r.verdict ? r.verdict.why : null,
				courtesy: r.courtesy,
				start: r.window.kind === 'start',
			};
		});
		scope.postMessage({ id, ok: true, seen, unfound, small, ms: performance.now() - t0 });
	} catch (err) {
		scope.postMessage({ id, ok: false, error: String((err as Error)?.message ?? err) });
	}
};
