/**
 * The page's side of the underlay's Worker (`underlay.worker.ts`): one Worker,
 * started on the first page and kept for the session, and a promise per page;
 * on the metre client's pattern (`metre-client.ts`).
 *
 * Only a read with the hidden switch on gets here (`homr-reader.ts` imports this
 * file with a dynamic `import()` behind `underlayOn`), so a singer without the
 * switch starts no Worker and fetches nothing.
 */
import type { StaffBoxLike } from './metre-windows';
import type { PageLayout, ReadUnderlay } from './underlay-page';
import { makeUnderlayReader, type UnderlayParts } from './underlay-reader';
import { recognizeRow } from './underlay-recognize';
import type { UnderlayRequest, UnderlayResponse } from './underlay.worker';

let worker: Worker | null = null;
let nextId = 0;
const waiting = new Map<number, { resolve: (r: { layout: PageLayout; rows: Blob[]; ms: number }) => void; reject: (e: Error) => void }>();

function start(): Worker {
	const w = new Worker(new URL('./underlay.worker.ts', import.meta.url), { type: 'module' });
	w.onmessage = (e: MessageEvent<UnderlayResponse>) => {
		const r = e.data;
		const done = waiting.get(r.id);
		waiting.delete(r.id);
		if (r.ok) done?.resolve({ layout: r.layout, rows: r.rows, ms: r.ms });
		else done?.reject(new Error(r.error));
	};
	w.onerror = (e) => {
		for (const done of waiting.values()) done.reject(new Error(`the underlay's Worker failed (${e.message})`));
		waiting.clear();
		w.terminate();
		if (worker === w) worker = null;
	};
	return w;
}

function prepareInWorker(image: Blob, musicXml: string, staves: readonly StaffBoxLike[]): Promise<{ layout: PageLayout; rows: Blob[]; ms: number }> {
	return new Promise((resolve, reject) => {
		try {
			worker ??= start();
			const id = nextId++;
			waiting.set(id, { resolve, reject });
			const req: UnderlayRequest = { id, image, musicXml, staves: staves.map((s) => ({ ...s })) };
			worker.postMessage(req);
		} catch (err) {
			reject(err as Error);
		}
	});
}

/** The dictionary and the engine, as the page has them; imported only now. */
const seams: UnderlayParts<Blob>['seams'] = () => import('../underlay-seams').then(({ loadSeams }) => loadSeams());

/** Reads one page's underlay: the Worker, the reader, the seating. Never rejects. */
export const readUnderlayInWorker: ReadUnderlay = makeUnderlayReader<Blob>({
	prepare: prepareInWorker,
	recognize: recognizeRow,
	seams,
});
