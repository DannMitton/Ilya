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
import { extenderArm } from './underlay-switch';
import type { LookRows, UnderlayRequest, UnderlayResponse } from './underlay.worker';
import type { Look } from './underlay-looks';

let worker: Worker | null = null;
let nextId = 0;
const waiting = new Map<number, { resolve: (r: Extract<UnderlayResponse, { ok: true }>) => void; reject: (e: Error) => void }>();

function start(): Worker {
	const w = new Worker(new URL('./underlay.worker.ts', import.meta.url), { type: 'module' });
	w.onmessage = (e: MessageEvent<UnderlayResponse>) => {
		const r = e.data;
		const done = waiting.get(r.id);
		waiting.delete(r.id);
		if (r.ok) done?.resolve(r);
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

function ask(req: Omit<UnderlayRequest, 'id'>): Promise<Extract<UnderlayResponse, { ok: true }>> {
	return new Promise((resolve, reject) => {
		try {
			worker ??= start();
			const id = nextId++;
			waiting.set(id, { resolve, reject });
			worker.postMessage({ ...req, id } satisfies UnderlayRequest);
		} catch (err) {
			reject(err as Error);
		}
	});
}

async function prepareInWorker(image: Blob, musicXml: string, staves: readonly StaffBoxLike[]): Promise<{ layout: PageLayout; rows: Blob[]; ms: number }> {
	const r = await ask({ image, musicXml, staves: staves.map((s) => ({ ...s })) });
	if (!('layout' in r)) throw new Error("the underlay's Worker answered the page with looks");
	return { layout: r.layout, rows: r.rows, ms: r.ms };
}

/** The second looks (row 181 step 2): the Worker decodes the page again and cuts each wanted system as each look says. */
async function looksInWorker(image: Blob, musicXml: string, staves: readonly StaffBoxLike[], wants: { system: number; looks: Look[] }[]): Promise<LookRows[]> {
	const r = await ask({ image, musicXml, staves: staves.map((s) => ({ ...s })), wants });
	if (!('looks' in r)) throw new Error("the underlay's Worker answered the looks with a page");
	return r.looks;
}

/** The dictionary and the engine, as the page has them; imported only now. */
const seams: UnderlayParts<Blob>['seams'] = () => import('../underlay-seams').then(({ loadSeams }) => loadSeams());

/** Reads one page's underlay: the Worker, the reader, the seating. Never rejects. */
export const readUnderlayInWorker: ReadUnderlay = makeUnderlayReader<Blob>({
	prepare: prepareInWorker,
	looks: looksInWorker,
	recognize: recognizeRow,
	seams,
	arm: () => extenderArm(),
});
