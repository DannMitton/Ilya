/**
 * The page's side of the time-signature reader's Worker (`metre.worker.ts`):
 * one Worker, started on the first page read and kept for the session, and a
 * promise per page.
 *
 * A page the Worker cannot read answers null, with the reason in the console,
 * and the join then reads that page as it did before the reader existed. A
 * Worker that fails outright answers null for every page asked of it, and the
 * next read starts another.
 */
import type { MetreRequest, MetreResponse } from './metre.worker';
import type { StaffBoxLike } from './metre-windows';
import type { MetreSeen } from './metre-witness';

/** One page's windows, read; or null where they could not be. */
export type ReadMetres = (image: Blob, musicXml: string, staves: readonly StaffBoxLike[]) => Promise<MetreSeen[] | null>;

let worker: Worker | null = null;
let nextId = 0;
const waiting = new Map<number, (seen: MetreSeen[] | null) => void>();

function start(): Worker {
	const w = new Worker(new URL('./metre.worker.ts', import.meta.url), { type: 'module' });
	w.onmessage = (e: MessageEvent<MetreResponse>) => {
		const r = e.data;
		const done = waiting.get(r.id);
		waiting.delete(r.id);
		if (r.ok) {
			console.info(`[omr] metre: page read in ${(r.ms / 1000).toFixed(1)} s, ${r.seen.length} windows, ${r.seen.filter((s) => s.lab).length} stating a signature${r.unfound ? `, ${r.unfound} voice staves not found` : ''}${r.small ? `, ${r.small} small staves set aside` : ''}`);
			done?.(r.seen);
		} else {
			console.warn(`[omr] metre: a page could not be read (${r.error})`);
			done?.(null);
		}
	};
	w.onerror = (e) => {
		console.warn(`[omr] metre: the reader's Worker failed (${e.message})`);
		for (const done of waiting.values()) done(null);
		waiting.clear();
		w.terminate();
		if (worker === w) worker = null;
	};
	return w;
}

/** Reads one page's windows in the Worker. Never rejects. */
export const readMetresInWorker: ReadMetres = (image, musicXml, staves) =>
	new Promise((resolve) => {
		try {
			worker ??= start();
			const id = nextId++;
			waiting.set(id, resolve);
			const req: MetreRequest = { id, image, musicXml, staves: staves.map((s) => ({ ...s })) };
			worker.postMessage(req);
		} catch (err) {
			console.warn(`[omr] metre: the reader's Worker did not start (${String((err as Error)?.message ?? err)})`);
			resolve(null);
		}
	});
