/**
 * The score reader for a scan: homr, run in the browser by homr-web.
 *
 * homr-web (https://github.com/jymen/homr-web, AGPL-3.0) is a dependency of
 * this app in a changed copy, 0.2.0-ilya.5, installed from the packed file
 * `third_party/homr-web/homr-web-0.2.0-ilya.5.tgz`. The copy's source is in
 * `third_party/homr-web/`, because the licence asks that a changed copy carry
 * its source; `CHANGES-ilya.md` there lists every change. The reader asks it
 * for homr's model 465 (`model: '465'`), which reads with that model and with
 * the code of homr's main branch at commit 560ca5c (with three departures:
 * the copy never regroups a page's staffs across a printed system, gives the
 * voice rests where a system leaves out its staff, and writes a clef read
 * inside a chord as a clef). This module is the only
 * place that imports it, and it imports it with a dynamic `import()`, so the
 * library, OpenCV, and onnxruntime are fetched only after a singer drops a
 * scan.
 *
 * One recognizer is made the first time it is needed and kept for the rest of
 * the session, because making it starts a Worker and loads OpenCV, and the
 * models it downloads on the first page are cached by the browser.
 *
 * THE FAST PATH ONLY WHERE IT WORKS. The recognizer is made with
 * `prefer: 'webgpu'` only where the browser grants a WebGPU adapter that has
 * `shader-f16` (`path-choice.ts`); everywhere else it is made for WebAssembly.
 * A read that ran on WebGPU and found no music on any page (every page
 * `not_music`, or an engine error) is made once more on WebAssembly before
 * the singer is answered, and the recognizer kept for the session is then the
 * WebAssembly one. A read that ran on WebAssembly is never made twice.
 *
 * WHERE THE FILES COME FROM. The models are served by this app under
 * `OMR_MODELS_BASE`, in homr-web's layout `<sha256>/<file name>`;
 * `scripts/fetch-omr-models.mjs` puts them there at `dev` and `build`.
 * onnxruntime's `.wasm` and `.mjs` files are served under `ORT_WASM_BASE`;
 * `scripts/copy-ort-wasm.mjs` copies them from the installed onnxruntime-web.
 */
import type { Progress, Recognizer } from 'homr-web';
import { joinPages } from './join-pages';
import { lookOverNotes, type GreyPage } from './tuplet-number';
import { loadTemplates, type TemplateMark } from './tuplet-digits';
import { OMR_MODEL } from './stamp';
import { choosePathFor, type GpuLike, type PathChoice, type PreferredBackend } from './path-choice';

/**
 * Where the models are served. Same origin by default. A deployment that
 * serves them elsewhere sets `PUBLIC_OMR_MODELS_BASE`; that host must answer
 * with CORS headers, because homr's own GitHub release does not.
 */
export const OMR_MODELS_BASE: string =
	(import.meta.env.PUBLIC_OMR_MODELS_BASE as string | undefined) || '/omr/models/';

/** Where onnxruntime-web's `.wasm` and `.mjs` files are served. */
export const ORT_WASM_BASE = '/omr/ort/';

/** Progress of a read of several pages: which page, and homr-web's own stage. */
export interface OmrProgress {
	/** 1-based. */
	page: number;
	pages: number;
	stage: Progress['stage'];
	done: number;
	total: number;
}

export type OmrReadResult =
	| {
			ok: true;
			/** One MusicXML string: the voice part of every page that held music, joined. */
			musicXml: string;
			/** Pages homr read as music, of `pages`. */
			pagesRead: number;
			pages: number;
			backend: string;
			durationMs: number;
			/** Why the read was not on WebGPU (no adapter, no `shader-f16`, or a retry). Absent when it was. For the console only. */
			pathNote?: string;
	  }
	| {
			ok: false;
			/** homr-web's error code (`not_music`, `engine_missing`, ...), or `start_failed`. */
			error: string;
			log: string;
	  };

/** What the reader needs from the outside. Real in the app; fakes in `homr-reader.test.ts`. */
export interface ReaderDeps {
	/** The feature test: which path to ask for, and why it is not WebGPU when it is not. */
	choose(): Promise<PathChoice>;
	/** Makes a recognizer that prefers `prefer`. */
	create(prefer: PreferredBackend): Promise<Recognizer>;
	/** Reads a region of a page image, to look for a printed 3 (`tuplet-number.ts`). Absent: the join reads homr's output alone. */
	decode?: DecodeRegion;
}

/** A recognizer, with why it is not on WebGPU if it was not asked to be. */
interface Held {
	recognizer: Promise<Recognizer>;
	/** What was asked for. */
	prefer: PreferredBackend;
	reason: string | null;
}

/**
 * The pages of the song, without the cover in front of it.
 *
 * homr can find a staff in the ruled border of a title page and read two bars
 * of music from it (Gurilyov, «Раскаяние», Jurgenson 1895, page 1: one staff
 * 30 pixels tall, a C clef and a whole-note chord). A page of a song prints a
 * system of two staves or more, the voice over the piano, and the title page
 * comes before it. So a page before the first page on which homr found two or
 * more staves, on which it found a single staff, is a cover and is left out. A
 * page whose answer does not say how many staves it found is kept, and so is
 * every page of a song in which no page has two staves or more.
 */
export function withoutCovers<T>(pages: readonly T[], staves: readonly (number | null)[]): T[] {
	const first = staves.findIndex((n) => n !== null && n >= 2);
	if (first <= 0) return [...pages];
	return pages.filter((_, i) => i >= first || staves[i] !== 1);
}

/** A rectangle of a page image, in its pixels. */
export interface Region {
	x: number;
	y: number;
	width: number;
	height: number;
}

/** Reads a rectangle of a page image as greyscale (0 black, 255 white), or null where it cannot. */
export type DecodeRegion = (image: Blob, region: Region) => Promise<GreyPage | null>;

/** In the browser: the region drawn on a canvas, its red channel (the pages are greyscale). */
export const decodeRegionInBrowser: DecodeRegion = async (image, region) => {
	try {
		const bitmap = await createImageBitmap(image);
		const x = Math.max(0, Math.floor(region.x));
		const y = Math.max(0, Math.floor(region.y));
		const width = Math.min(bitmap.width - x, Math.ceil(region.width));
		const height = Math.min(bitmap.height - y, Math.ceil(region.height));
		if (width <= 0 || height <= 0) return null;
		const canvas = new OffscreenCanvas(width, height);
		const ctx = canvas.getContext('2d');
		if (!ctx) return null;
		ctx.drawImage(bitmap, x, y, width, height, 0, 0, width, height);
		bitmap.close();
		const rgba = ctx.getImageData(0, 0, width, height).data;
		const data = new Uint8Array(width * height);
		for (let i = 0; i < data.length; i++) data[i] = rgba[i * 4];
		return { width, height, data, x, y } as GreyPage & { x: number; y: number };
	} catch {
		return null;
	}
};

/** How far around a group of notes the page is read: room for seven staff spaces and the staff-space columns. */
const LOOK_MARGIN = 640;

/** What the page shows over one bar, in page pixels: as `joinPages`'s `look` answers. */
type Seen = { numbers: { n: number; m: number | null; x: number }[]; centres: number[] };

/**
 * Joins the pages, looking at the page images for printed tuplet numbers
 * wherever the join asks (`joinPages`'s `look`, from `triplets.ts`, once for
 * each bar that reads longer than its metre): a first join collects the
 * questions, the regions they need are read, and the join runs again with the
 * answers (at most three times, for questions a changed bar raises). The
 * digit templates are loaded only when a bar asks.
 */
export async function joinLookingAtPages(
	xmls: readonly string[],
	images: readonly Blob[],
	decode: DecodeRegion,
	templates: () => Promise<readonly TemplateMark[]> = loadTemplates,
): Promise<{ musicXml: string; looked: number; numbers: number[] }> {
	const key = (page: number, notes: readonly { x: number; y: number }[]) => `${page}:${notes.map((n) => `${n.x},${n.y}`).join(';')}`;
	const answers = new Map<string, Seen | null>();
	let known: readonly TemplateMark[] | null = null;
	let musicXml = '';
	for (let round = 0; round < 3; round++) {
		const asked = new Map<string, { page: number; notes: { x: number; y: number }[] }>();
		musicXml = joinPages(xmls, (page, notes) => {
			const k = key(page, notes);
			if (answers.has(k)) return answers.get(k) ?? null;
			asked.set(k, { page, notes: [...notes] });
			return null;
		});
		if (asked.size === 0) break;
		known ??= await templates();
		for (const [k, q] of asked) {
			const xs = q.notes.map((n) => n.x);
			const ys = q.notes.map((n) => n.y);
			const region = {
				x: Math.min(...xs) - LOOK_MARGIN,
				y: Math.min(...ys) - LOOK_MARGIN,
				width: Math.max(...xs) - Math.min(...xs) + 2 * LOOK_MARGIN,
				height: Math.max(...ys) - Math.min(...ys) + 2 * LOOK_MARGIN,
			};
			const image = images[q.page];
			const part = image ? ((await decode(image, region)) as (GreyPage & { x?: number; y?: number }) | null) : null;
			const dx = part?.x ?? Math.max(0, Math.floor(region.x));
			const dy = part?.y ?? Math.max(0, Math.floor(region.y));
			if (!part) {
				answers.set(k, null);
				continue;
			}
			const over = lookOverNotes(part, q.notes.map((n) => ({ x: n.x - dx, y: n.y - dy })), known);
			answers.set(k, over.space === null ? null : { numbers: over.numbers.map((n) => ({ ...n, x: n.x + dx })), centres: over.centres.map((c) => c + dx) });
		}
	}
	const all = [...answers.values()].filter((a): a is Seen => a !== null);
	return { musicXml, looked: all.length, numbers: all.flatMap((a) => a.numbers.map((n) => n.n)) };
}

/** What one pass over the pages found. */
interface Pass {
	xmls: string[];
	/** For each page in `xmls`, the staves homr found on it, or null where its answer did not say. */
	staves: (number | null)[];
	/** For each page in `xmls`, the index of its image. */
	image: number[];
	/** The error that stopped the pass, if one did. `not_music` never stops it. */
	failure: { error: string; log: string } | null;
}

export interface Reader {
	read(images: readonly Blob[], onProgress?: (p: OmrProgress) => void): Promise<OmrReadResult>;
	/** True once a recognizer has been made in this session. */
	started(): boolean;
}

const WASM: PreferredBackend = 'wasm-threads';

/** Makes the reader. One per app; tests make their own with fakes. */
export function makeReader(deps: ReaderDeps): Reader {
	let held: Held | null = null;

	function acquire(prefer: PreferredBackend, reason: string | null): Held {
		const recognizer = deps.create(prefer);
		const mine: Held = { recognizer, prefer, reason };
		held = mine;
		// A recognizer that failed to start is not kept, so the next scan tries again.
		recognizer.catch(() => {
			if (held === mine) held = null;
		});
		return mine;
	}

	async function acquireFirst(): Promise<Held> {
		if (held) return held;
		const choice = await deps.choose();
		// Another read may have made one while the browser was being asked.
		return held ?? acquire(choice.prefer, choice.reason);
	}

	async function dispose(mine: Held, rec: Recognizer): Promise<void> {
		if (held === mine) held = null;
		try {
			await rec.dispose();
		} catch {
			// A recognizer that will not dispose is already unusable; the next one is made fresh.
		}
	}

	/**
	 * Reads the pages in order, one at a time (homr-web reads one page at a
	 * time per recognizer). A page homr finds no music on (`not_music`) is
	 * left out. Any other failure stops the pass.
	 */
	async function pass(
		mine: Held,
		rec: Recognizer,
		images: readonly Blob[],
		onProgress?: (p: OmrProgress) => void,
	): Promise<Pass> {
		const xmls: string[] = [];
		const staves: (number | null)[] = [];
		const image: number[] = [];
		for (let i = 0; i < images.length; i++) {
			const result = await rec.recognizePage(images[i], {
				ocr: false,
				onProgress: (p) => onProgress?.({ page: i + 1, pages: images.length, stage: p.stage, done: p.done, total: p.total }),
			});
			if (result.ok) {
				xmls.push(result.musicXml);
				staves.push(Array.isArray(result.staves) ? result.staves.length : null);
				image.push(i);
				continue;
			}
			if (result.error === 'not_music') continue;
			if (result.error === 'worker_lost') {
				// homr-web's README: a recognizer whose Worker crashed answers only
				// `worker_lost` from then on, so it is disposed and the next scan makes another.
				void dispose(mine, rec);
			}
			return { xmls, staves, image, failure: { error: result.error, log: result.log } };
		}
		return { xmls, staves, image, failure: null };
	}

	async function read(images: readonly Blob[], onProgress?: (p: OmrProgress) => void): Promise<OmrReadResult> {
		const t0 = performance.now();
		const message = (err: unknown) => String((err as Error)?.message ?? err);
		let mine = await acquireFirst();
		let note: string | undefined = mine.reason ?? undefined;
		let rec: Recognizer | null = null;
		let startError: unknown = null;
		try {
			rec = await mine.recognizer;
		} catch (err) {
			startError = err;
		}
		// A recognizer that asked for WebGPU and did not start is made again on WebAssembly.
		if (!rec && mine.prefer === 'webgpu') {
			note = `the WebGPU recognizer did not start (${message(startError)}), so WebAssembly was asked for`;
			mine = acquire(WASM, note);
			try {
				rec = await mine.recognizer;
			} catch (err) {
				startError = err;
			}
		}
		if (!rec) {
			return { ok: false, error: 'start_failed', log: `${note ? `${note}; ` : ''}${message(startError)}` };
		}
		let found = await pass(mine, rec, images, onProgress);
		// One retry: a read that ran on WebGPU and found no music on any page is read again on WebAssembly.
		if (found.xmls.length === 0 && rec.backend === 'webgpu') {
			const ended = found.failure ? `error ${found.failure.error}` : 'every page answered not_music';
			note = `the WebGPU read ended with ${ended}, so the pages were read again on WebAssembly`;
			await dispose(mine, rec);
			mine = acquire(WASM, note);
			try {
				rec = await mine.recognizer;
			} catch (err) {
				return { ok: false, error: 'start_failed', log: `${note}; the WebAssembly recognizer did not start: ${message(err)}` };
			}
			found = await pass(mine, rec, images, onProgress);
		}
		if (found.failure) {
			return { ok: false, error: found.failure.error, log: note ? `${found.failure.log} (${note})` : found.failure.log };
		}
		if (found.xmls.length === 0) {
			return { ok: false, error: 'not_music', log: `homr found no music on any page${note ? ` (${note})` : ''}` };
		}
		const song = withoutCovers(
			found.xmls.map((xml, i) => ({ xml, image: images[found.image[i]] })),
			found.staves,
		);
		let musicXml: string;
		try {
			if (deps.decode) {
				const joined = await joinLookingAtPages(song.map((p) => p.xml), song.map((p) => p.image), deps.decode);
				musicXml = joined.musicXml;
				if (joined.looked > 0) console.info(`[omr] printed tuplet numbers: looked over ${joined.looked} bars, read ${joined.numbers.length}${joined.numbers.length ? ` (${joined.numbers.join(', ')})` : ''}`);
			} else musicXml = joinPages(song.map((p) => p.xml));
		} catch (err) {
			return { ok: false, error: 'join_failed', log: message(err) };
		}
		// Where the path is not WebGPU and no reason of ours says why, homr-web's own reason does.
		if (!note && rec.backend !== 'webgpu') note = rec.backendReason;
		return {
			ok: true,
			musicXml,
			pagesRead: song.length,
			pages: images.length,
			backend: rec.backend,
			durationMs: Math.round(performance.now() - t0),
			...(note ? { pathNote: note } : {}),
		};
	}

	return { read, started: () => held !== null };
}

const reader = makeReader({
	choose: () => choosePathFor(typeof navigator === 'undefined' ? undefined : (navigator as { gpu?: GpuLike }).gpu),
	create: (prefer) =>
		import('homr-web').then(({ createRecognizer }) =>
			createRecognizer({ baseUrl: OMR_MODELS_BASE, model: OMR_MODEL, prefer, wasmPaths: ORT_WASM_BASE }),
		),
	decode: typeof OffscreenCanvas === 'undefined' ? undefined : decodeRegionInBrowser,
});

/** True once a recognizer has been made in this session. */
export function omrStarted(): boolean {
	return reader.started();
}

/**
 * Reads the pages in order, one at a time, with OCR off, because the notes
 * need none. A page homr finds no music on (`not_music`) is left out, so a
 * title page or a page of text inside a song's PDF does not stop the read.
 * Any other failure stops it, except that a read that ran on WebGPU and
 * found no music on any page is made once more on WebAssembly first. Never
 * rejects.
 */
export function readScanPages(
	images: readonly Blob[],
	onProgress?: (p: OmrProgress) => void,
): Promise<OmrReadResult> {
	return reader.read(images, onProgress);
}
