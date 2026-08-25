/**
 * Page-reader Worker: the E.16 page reader, under Pyodide, off the main thread.
 *
 * N.59. Pyodide and its packages are loaded ONCE when this Worker starts and
 * kept warm for its lifetime, the same shape as the denigma Worker beside it.
 * The reader's own modules are fetched from `/reader/` (put there by
 * `scripts/copy-reader.mjs`) and written into the Pyodide filesystem, because
 * Pyodide cannot import out of a bundle.
 *
 * PINS, and why they are pins (Ruling E, E.57). Pyodide v0.26.4 carries
 * cv2 4.9.0 and numpy 1.26.4. E.43 measured that drift changes the answer: a
 * container at cv2 4.13.0 / numpy 2.4.4 read 37 noteheads against 36 on the
 * same page. The CDN URL below is the one the measured spike used
 * (`~/Downloads/ilya-reader-spike.html`), so it is the configuration the
 * 2.9 s load and 0.867 s per page were measured on.
 *
 * MATPLOTLIB IS LOADED HERE AND WAS NOT LOADED BY THE SPIKE. Measured
 * 2026-08-16: the spike's `loadPackage` list is exactly
 * `['numpy','opencv-python']`, because it calls `reader.read_page_pitch`
 * directly. This Worker calls `envelope.run`, which imports `run_page2` and
 * `timesig`, both of which pull in `rest_templates`, which imports
 * `matplotlib.path` at module top. So the package is required by the envelope
 * path and its load cost is a real addition to E.43's floor, not a free ride.
 *
 * NO NODE, NO VEROVIO. `rest_templates.load_font` and `timesig.load_font` each
 * return the parsed JSON on a cache hit BEFORE any subprocess is reached
 * (`rest_templates.py:142-150`, `timesig.py:118-126`). The two caches are
 * written to `/home/pyodide/.cache/`, which is where `os.path.expanduser`
 * resolves inside Pyodide, so neither `load_font` ever reaches its `subprocess`
 * call. That is the whole reason no Verovio WASM ships.
 */

import type { PageReadConfig, ReadReport, RecognizedOutput } from '../ingestion/recognized';

export type { PageReadConfig, ReadReport, RecognizedOutput };

/** main thread to Worker. */
export type PageReaderRequest =
	| {
			type: 'read';
			id: number;
			/** Greyscale PNG bytes, one entry per page, read in order and ctx-chained. */
			pages: ArrayBuffer[];
			config: PageReadConfig;
	  }
	| {
			/** N.97: clef and key signature only, before the singer is asked. */
			type: 'probe';
			id: number;
			/** One page's greyscale PNG ink. The first page is what the prompt asks about. */
			page: ArrayBuffer;
	  };

/**
 * N.97. What the page PRINTS at the start of its systems, as the majority of
 * the systems that could be read. Every field is nullable because every one of
 * them abstains rather than guesses.
 */
export interface ClefKeyProbe {
	/** `gClef`, `gClef8vb`, `fClef`, `cClef`, or null where the systems disagree. */
	glyph: string | null;
	/** That clef as the reader speaks it: G/F/C and the line, counted from the bottom. */
	sign: string | null;
	line: number | null;
	/** True only where the 8-bearing glyph's numeral was found on the page. */
	ottavaGlyph: boolean | null;
	/** Signed accidental count, 0 for a page that prints none, null on abstention. */
	fifths: number | null;
	/** How many systems were read at all, and how many back the majority clef. */
	systems: number;
	agreeing: number;
}

/** Worker to main thread. */
export type PageReaderResponse =
	| { type: 'ready'; loadSeconds: number }
	| { type: 'load-error'; error: PageReaderError }
	| { type: 'result'; id: number; read: RecognizedRead }
	| { type: 'probe-result'; id: number; probe: ClefKeyProbe | null }
	| { type: 'error'; id: number; error: PageReaderError };

export type PageReaderError =
	| { code: 'READER_LOAD_FAILED'; message: string }
	| { code: 'READ_FAILED'; message: string };

/** What the Worker hands back: the `ro` the converter consumes, plus the report. */
export interface RecognizedRead {
	ro: RecognizedOutput;
	report: ReadReport;
}

const PYODIDE_INDEX = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
const PYODIDE_ENTRY = `${PYODIDE_INDEX}pyodide.mjs`;
const PACKAGES = ['numpy', 'opencv-python', 'matplotlib'];
const READER_ROOT = '/reader/';
const PY_HOME = '/home/pyodide';

interface PyodideFS {
	writeFile(path: string, data: string | Uint8Array): void;
	mkdirTree(path: string): void;
}
interface PyodideProxy {
	(...args: unknown[]): string;
	destroy(): void;
}
interface PyodideInterface {
	FS: PyodideFS;
	loadPackage(names: string[]): Promise<void>;
	runPython(code: string): unknown;
	globals: { get(name: string): PyodideProxy };
}

interface WorkerScope {
	postMessage(message: PageReaderResponse): void;
	onmessage: ((event: MessageEvent<PageReaderRequest>) => void) | null;
}
const ctx = self as unknown as WorkerScope;

const messageOf = (err: unknown): string => (err instanceof Error ? err.message : String(err));

let pyodide: PyodideInterface | null = null;

/**
 * The Python driver. It owns the ctx chain across pages and the report
 * aggregation, because both are cheap in Python and would otherwise mean
 * shipping every intermediate over postMessage.
 *
 * `measures_per_system` and `pieceId` are supplied by the module deltas
 * (step 4), so `cfg` here carries no `gt` file and none is needed.
 */
const DRIVER = `
import json, time, traceback
import cv2
import envelope

def _frac(v):
    # A safety net only: run_page2 already converts every onset and duration to
    # a {numerator, denominator} dict. Anything that slips through as a raw
    # Fraction is emitted in the SAME shape, so the TypeScript sees one form.
    if hasattr(v, 'numerator'):
        return dict(numerator=int(v.numerator), denominator=int(v.denominator))
    raise TypeError('not JSON serializable: %r' % (type(v),))

def probe_page(path):
    # N.97: the clef and key-signature read ONLY, so the intake prompt can ask
    # the singer to confirm rather than to answer blind. It runs staff
    # detection and the staff-line removal and stops; no notehead, no rhythm,
    # no pitch. It is a separate call and changes nothing about the read that
    # follows, which still takes its clef and key from the config the singer
    # confirmed.
    #
    # ABSTENTION IS A NULL, NOT AN ERROR. A page whose clef nothing could read
    # returns null and the prompt falls back to asking, which is what it did
    # before this existed.
    import reader
    got = reader.probe_clef_key(dict(png=path))
    return json.dumps(got['read'])

def read_pages(paths_json, cfg_json):
    paths = json.loads(paths_json)
    base = json.loads(cfg_json)
    t0 = time.time()
    ctx_in = None
    notes = []
    measures = []
    staff_spaces = []
    systems = 0
    staves = 0
    rest_count = 0
    fallbacks = 0
    ro_last = None
    failed = []
    first_traceback = None
    # PER-PAGE FAULT ISOLATION (N.96 ship 1b, Dann's ruling 2026-08-24). One
    # page that raises used to abort the whole upload, and the singer got the
    # generic could-not-read message with no page named and no notation at
    # all. Walked on ilya-6qb11jpa8 with the Lamm scan and reproduced in dev:
    # page 2's detect_staves raises "contaminated staff group", page 1 had
    # already read cleanly, and every one of its events was thrown away.
    #
    # A raising page is now recorded and skipped. What it does NOT do is
    # invent anything for that page: it contributes no notes, no measures, no
    # staff space, and the read report names it so the singer knows which page
    # they are not looking at.
    #
    # ctx_in IS DELIBERATELY NOT ADVANCED past a failed page. It carries
    # measure numbering across pages, and a page nobody read has no measures
    # to count. The pages that DO read stay continuously numbered with each
    # other, which is what the chaining is for.
    for page_no, path in enumerate(paths, start=1):
        try:
            img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
            if img is None:
                raise RuntimeError('OpenCV could not read page %d' % page_no)
            cfg = dict(base)
            cfg['png'] = path
            cfg['page'] = page_no
            cfg['clef'] = (base['clef'][0], int(base['clef'][1]))
            cfg['key'] = int(base['key'])
            cfg['octaveChange'] = int(base.get('octaveChange', 0))
            ro, ctx_next, msum, G, rests, events = envelope.run(cfg, ctx_in)
        except Exception:
            failed.append(page_no)
            if first_traceback is None:
                first_traceback = traceback.format_exc()
            continue
        ctx_in = ctx_next
        ro_last = ro
        notes.extend(ro['verses'][0]['notes'])
        measures.extend(ro.get('measures', []))
        staff_spaces.append(float(G['s']))
        systems += len(G['vocal'])
        staves += len(G['staves'])
        rest_count += len(rests)
        fallbacks += int(G.get('vocalFallbacks', 0))
    if ro_last is None:
        # EVERY page failed, so there is nothing to render and nothing to
        # isolate. Raise the first page's own traceback rather than an empty
        # read: a read report saying "0 notes" would be a claim, and no page
        # was read to support it.
        # No escape sequences in this string. The driver is a TS template
        # literal, so a backslash-n here reaches Python as a REAL newline and
        # breaks the literal it sits in. The traceback carries its own.
        raise RuntimeError(
            'no page of %d could be read. First failure: %s'
            % (len(paths), first_traceback))
    merged = dict(ro_last)
    merged['verses'] = [dict(verseNumber=1, notes=notes)]
    merged['measures'] = measures
    pitch_subs = {}
    dur_subs = {}
    for nd in notes:
        ab = nd.get('abstain') or {}
        if 'pitch' in ab:
            pitch_subs[nd['measureIndex']] = pitch_subs.get(nd['measureIndex'], 0) + 1
        if 'duration' in ab or 'onset' in ab:
            dur_subs[nd['measureIndex']] = dur_subs.get(nd['measureIndex'], 0) + 1
    report = dict(
        pages=len(paths),
        systems=systems,
        staves=staves,
        staffSpace=staff_spaces,
        notes=len(notes),
        rests=rest_count,
        measures=len(measures),
        pitchSubstitutions=[dict(measureIndex=k, count=v) for k, v in sorted(pitch_subs.items())],
        durationSubstitutions=[dict(measureIndex=k, count=v) for k, v in sorted(dur_subs.items())],
        staffSelectionFallbacks=fallbacks,
        failedPages=failed,
        readSeconds=round(time.time() - t0, 3),
    )
    return json.dumps(dict(ro=merged, report=report), default=_frac)
`;

/** Instantiate Pyodide, the packages, and the reader once on startup. */
void (async () => {
	const t0 = performance.now();
	try {
		// The specifier lives in a variable so Vite's import analysis leaves it
		// alone, the same trick the denigma Worker uses for its glue.
		const entry = PYODIDE_ENTRY;
		const { loadPyodide } = (await import(/* @vite-ignore */ entry)) as {
			loadPyodide: (options: { indexURL: string }) => Promise<PyodideInterface>;
		};
		pyodide = await loadPyodide({ indexURL: PYODIDE_INDEX });
		await pyodide.loadPackage(PACKAGES);

		const manifest = (await fetchJson(`${READER_ROOT}manifest.json`)) as {
			modules: string[];
			caches: string[];
		};
		pyodide.FS.mkdirTree(`${PY_HOME}/.cache`);
		await Promise.all([
			...manifest.modules.map(async (name) =>
				pyodide!.FS.writeFile(`${PY_HOME}/${name}`, await fetchText(`${READER_ROOT}${name}`))
			),
			...manifest.caches.map(async (name) =>
				pyodide!.FS.writeFile(
					`${PY_HOME}/.cache/${name}`,
					await fetchText(`${READER_ROOT}.cache/${name}`)
				)
			),
		]);

		pyodide.runPython(`import sys; sys.path.insert(0, '${PY_HOME}')`);
		pyodide.runPython(DRIVER);
		ctx.postMessage({ type: 'ready', loadSeconds: (performance.now() - t0) / 1000 });
	} catch (err) {
		ctx.postMessage({
			type: 'load-error',
			error: { code: 'READER_LOAD_FAILED', message: messageOf(err) },
		});
	}
})();

ctx.onmessage = (event: MessageEvent<PageReaderRequest>) => {
	const message = event.data;
	if (!message) return;
	if (message.type === 'probe') return handleProbe(message);
	if (message.type !== 'read') return;
	const { id, pages, config } = message;
	try {
		if (!pyodide) throw new Error('the page reader is not ready');
		const paths = pages.map((bytes, i) => {
			const path = `${PY_HOME}/page-${i + 1}.png`;
			pyodide!.FS.writeFile(path, new Uint8Array(bytes));
			return path;
		});
		const fn = pyodide.globals.get('read_pages');
		let raw: string;
		try {
			raw = fn(JSON.stringify(paths), JSON.stringify(config));
		} finally {
			fn.destroy();
		}
		ctx.postMessage({ type: 'result', id, read: JSON.parse(raw) as RecognizedRead });
	} catch (err) {
		// A Python traceback arrives as the message. It is diagnostic only: the
		// uploader shows its own copy, and inventing a cause here would be worse
		// than naming none.
		console.error('[page-reader] read failed', err);
		ctx.postMessage({
			type: 'error',
			id,
			error: { code: 'READ_FAILED', message: messageOf(err) },
		});
	}
};

/**
 * N.97's probe. Separate from the read handler rather than folded into it,
 * because it answers a different question at a different time and shares
 * nothing but the interpreter.
 */
function handleProbe(message: { id: number; page: ArrayBuffer }): void {
	const { id, page } = message;
	try {
		if (!pyodide) throw new Error('the page reader is not ready');
		const path = `${PY_HOME}/probe.png`;
		pyodide.FS.writeFile(path, new Uint8Array(page));
		const fn = pyodide.globals.get('probe_page');
		let raw: string;
		try {
			raw = fn(path);
		} finally {
			fn.destroy();
		}
		ctx.postMessage({ type: 'probe-result', id, probe: JSON.parse(raw) as ClefKeyProbe | null });
	} catch (err) {
		// A FAILED PROBE IS NOT A FAILED UPLOAD. The prompt falls back to asking,
		// which is exactly what it did before the probe existed, so this reports
		// no read rather than an error the singer has to act on.
		console.error('[page-reader] clef and key probe failed', err);
		ctx.postMessage({ type: 'probe-result', id, probe: null });
	}
}

async function fetchText(url: string): Promise<string> {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`${url} responded ${response.status}`);
	return response.text();
}

async function fetchJson(url: string): Promise<unknown> {
	return JSON.parse(await fetchText(url)) as unknown;
}
