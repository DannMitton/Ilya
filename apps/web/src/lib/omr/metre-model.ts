/**
 * The time-signature reader's network, loaded on first use (QUEUE row 57),
 * and a page's windows read with it.
 *
 * Nothing here runs until a window of the voice staff is read: onnxruntime-web
 * is imported then, the network (689,387 bytes) and the unfamiliar-shape
 * reference (185,280 bytes) are fetched then, and both are kept for the rest
 * of the session. They are served from `/omr/models/metre/`, this app's own
 * origin, beside homr's models (`scripts/copy-metre-model.mjs`), and
 * onnxruntime's WebAssembly from `/omr/ort/`, the files homr-web's own
 * onnxruntime-web already uses (the app pins the same version, 1.30.0).
 *
 * The network runs on WebAssembly in the page's own thread: it is small,
 * and WebGPU is homr's while a scan is read.
 */
import { decide, readWindow, type Classify, type MetreSettings, type ShapeReference, type Verdict, CLASSES, CROP, FEAT } from './metre-reader';
import { bandOf, isCourtesyPlace, placesOf, staffIn, windowsOf, type Grey, type MetreWindow, type Staff, type StaffBoxLike } from './metre-windows';
import { placeOf } from './join-pages';

export const METRE_BASE = '/omr/models/metre/';
const ORT_WASM = '/omr/ort/';
const MODEL = 'metre-a-r6.onnx';
const REF = 'metre-a-r6-ref.f16';
const REF_CLASSES = 'metre-a-r6-ref.cls';

/**
 * Set on the four tuning songs and the tuning renders in run 1 of round 6
 * (`docs/sessions/report-code-the-metre-seen-and-summed_r6-run1_2026-10-11.md`,
 * sections 3 and 4). Never set from the songs the reader is measured on.
 */
export const METRE_SETTINGS: MetreSettings = {
	cut: 0.5,
	centre: 0.4,
	dist: 7.537383346557615,
	tau: 0.6,
	cLow: 0.1,
	cutHigh: 0,
	margin: 0.8,
};

export interface MetreNet {
	classify: Classify;
	ref: ShapeReference;
}

let loading: Promise<MetreNet> | null = null;

/** float16 bytes, little-endian, as numbers. */
export function halves(bytes: ArrayBuffer): Float32Array {
	const u = new Uint16Array(bytes);
	const out = new Float32Array(u.length);
	for (let i = 0; i < u.length; i++) {
		const h = u[i];
		const s = h & 0x8000 ? -1 : 1;
		const e = (h >> 10) & 0x1f;
		const f = h & 0x3ff;
		out[i] = e === 0 ? s * 2 ** -14 * (f / 1024) : e === 31 ? (f ? NaN : s * Infinity) : s * 2 ** (e - 15) * (1 + f / 1024);
	}
	return out;
}

/** The network and its reference, fetched and opened once. A failure is not kept, so the next read tries again. */
export function loadMetreNet(fetcher: typeof fetch = fetch): Promise<MetreNet> {
	loading ??= (async () => {
		const ort = await import('onnxruntime-web');
		ort.env.wasm.wasmPaths = ORT_WASM;
		const get = async (name: string) => {
			const r = await fetcher(METRE_BASE + name);
			if (!r.ok) throw new Error(`${name}: ${r.status}`);
			return r.arrayBuffer();
		};
		const [model, feats, classes] = await Promise.all([get(MODEL), get(REF), get(REF_CLASSES)]);
		const session = await ort.InferenceSession.create(new Uint8Array(model), { executionProviders: ['wasm'] });
		const classify: Classify = async (ink, n) => {
			const out = await session.run({ ink: new ort.Tensor('float32', ink, [n, 1, CROP, CROP]) });
			const probs = out.probs.data as Float32Array;
			const f = out.feats.data as Float32Array;
			if (probs.length !== n * CLASSES || f.length !== n * FEAT) throw new Error('the network answered the wrong shape');
			return { probs, feats: f };
		};
		return { classify, ref: { feats: halves(feats), classes: new Uint8Array(classes) } };
	})();
	loading.catch(() => {
		loading = null;
	});
	return loading;
}

/**
 * The voice's staves on a page: the boxes nearest the notes and rests of the
 * first part, the part Ilya sings from (`join-pages.ts`, `firstPart`).
 */
export function voiceBoxes(musicXml: string, staves: readonly StaffBoxLike[], height: number): number[] {
	const part = /<part\b[^>]*>([\s\S]*?)<\/part>/.exec(musicXml)?.[1] ?? '';
	const held = new Set<number>();
	for (const note of part.match(/<note\b[\s\S]*?<\/note>/g) ?? []) {
		const at = placeOf(note);
		if (!at) continue;
		let best = -1;
		let bestD = Infinity;
		staves.forEach((b, i) => {
			const d = Math.abs(b.cy * height - at.y);
			if (d < bestD) {
				bestD = d;
				best = i;
			}
		});
		if (best >= 0) held.add(best);
	}
	return [...held].sort((a, b) => staves[a].cy - staves[b].cy);
}

/** One window read: where, and what it states or why not. A courtesy place states nothing new, by rule. */
export interface WindowRead {
	window: MetreWindow;
	verdict: Verdict;
	courtesy: boolean;
}

/**
 * Every window of the voice staves on one page, read. A voice box whose staff
 * lines are not found (`unfound`), and a staff much smaller than the page's
 * others (`small`), are counted apart and not read.
 */
export async function readPageMetres(
	page: Grey,
	musicXml: string,
	staves: readonly StaffBoxLike[],
	net: MetreNet,
	settings: MetreSettings = METRE_SETTINGS,
): Promise<{ reads: WindowRead[]; unfound: number; small: number }> {
	const reads: WindowRead[] = [];
	let unfound = 0;
	let small = 0;
	const found: [number, Staff][] = [];
	for (const i of voiceBoxes(musicXml, staves, page.height)) {
		const st = staffIn(page, staves[i]);
		if (st) found.push([i, st]);
		else unfound++;
	}
	// A staff much smaller than the page's others is an excerpt or an ossia (a
	// footnote's variant in Sunless 5), not the song's voice: left out, as
	// round 4's clean_staves left it out.
	const usual = found.map(([, st]) => st.space).sort((a, b) => a - b)[Math.floor(found.length / 2)] ?? 0;
	for (const [i, st] of found) {
		if (st.space < 0.8 * usual) {
			small++;
			continue;
		}
		const { band, y0, k } = bandOf(page, st);
		for (const w of windowsOf(page, st, i)) {
			const { xs, seats, lines } = placesOf(w, y0, k);
			if (xs.length === 0) continue;
			const readings = await readWindow(band, xs, seats, net.classify);
			reads.push({ window: w, verdict: decide(readings, band, lines, settings, net.ref), courtesy: isCourtesyPlace(w) });
		}
	}
	return { reads, unfound, small };
}
