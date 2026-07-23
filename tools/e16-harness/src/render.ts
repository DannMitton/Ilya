/**
 * render: `.musx` -> full-page score image, for the E.16 harness's task 1.
 *
 * THE CHAIN THIS FILE USES DOES NOT MATCH THE BRIEF'S ASSUMED CHAIN.
 * The brief expected denigma -> MNX -> Verovio (Verovio was described
 * elsewhere as having MNX support). SOURCED, this session (2026-07-22):
 * Verovio 6.2.0 (the current npm `verovio` release, and its GitHub
 * README) does NOT import MNX. `loadData()` on real denigma-derived MNX
 * JSON returns `0` (failure); there is no `mnx` token anywhere in its
 * JS/WASM build beyond coincidental base64 substrings. This is an
 * empirically-verified correction to the phase-0 options memo's claim,
 * not a guess.
 *
 * THE WORKING CHAIN, verified end to end against all six corpus pieces:
 *
 *   .musx --[musx2mxl 0.2.9, MIT, external Python CLI]--> .mxl (MusicXML 4.0)
 *        --[unzip]--> score.musicxml
 *        --[Verovio 6.2.0 npm `verovio` toolkit,
 *           options: scale=100, pageWidth=2100, pageHeight=2970,
 *           adjustPageHeight=true, breaks='auto';
 *           pageWidth/pageHeight are in TENTHS OF A MILLIMETRE, so 2100 x
 *           2970 = 210mm x 297mm = A4]--> one SVG per page
 *        --[rsvg-convert -w 2480 -b white]--> PNG
 *
 * 2480px at a 210mm page width is 2480 / (210/25.4) = 299.96 DPI: the
 * "~300 DPI" the brief asked for, confirmed by dividing the actual output
 * pixel width by the actual physical page width, not assumed.
 *
 * External prerequisites this file does NOT install for you (this
 * harness's own `npm install` only gets you the `verovio` JS dependency):
 *   - `pip install musx2mxl` (needs `libxml2-dev`/`libxslt-dev` build
 *     headers if your platform has no prebuilt `lxml` wheel; musx2mxl
 *     pins `lxml~=4.8.0`, which fails to BUILD against Python 3.10/3.11 on
 *     a from-source install — a modern `lxml` (tested: 6.1.0) works fine
 *     at runtime despite the pin, so install lxml first, then
 *     `pip install musx2mxl --no-deps`.)
 *   - `rsvg-convert` (Debian/Ubuntu: `librsvg2-bin`; macOS: `brew install
 *     librsvg`).
 *
 * KNOWN LIMITATION (documented, not hidden): musx2mxl is explicitly
 * "still a work in progress" (its own README) and its piano (accompaniment)
 * staff came out visibly wrong on every corpus piece rendered this
 * session (cross-staff / "Staff 2 cannot be found" warnings from Verovio's
 * MusicXML importer). The VOCAL line, which is what this harness actually
 * scores, rendered correctly on all six pieces, including BOTH lyric
 * verses (Cyrillic orthography and an IPA line already present in the
 * source `.musx` itself). The piano/accompaniment defect does not affect
 * ground truth (task 2, which uses the denigma/MNX path, not this one) or
 * the scorer; it affects only how faithful the rendered PAGE IMAGE looks
 * as a stand-in for a "real" piano-vocal page. Flagged for whoever adapts
 * a real OMR engine next: the rendered image is a reasonable vocal-line
 * test image today, not a faithful full-score facsimile.
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const execFileAsync = promisify(execFile);

const PAGE_WIDTH_TENTHS_MM = 2100; // 210mm, A4 width
const PAGE_HEIGHT_TENTHS_MM = 2970; // 297mm, A4 height
const TARGET_PIXEL_WIDTH = 2480; // -> ~300 DPI at 210mm; see module doc

export interface RenderedPage {
	pageNumber: number;
	svgPath: string;
	pngPath: string;
	pngWidthPx: number;
	achievedDpi: number;
}

export interface RenderResult {
	pieceId: string;
	musicXmlPath: string;
	pages: RenderedPage[];
	/** Verbatim Verovio import warnings (e.g. the piano cross-staff defect noted above). Not swallowed. */
	verovioWarnings: string[];
}

async function musxToMusicXml(musxPath: string, outDir: string): Promise<string> {
	const mxlPath = path.join(outDir, 'score.mxl');
	await execFileAsync('musx2mxl', ['--output_path', mxlPath, musxPath]);

	const extractDir = path.join(outDir, 'mxl_extract');
	mkdirSync(extractDir, { recursive: true });
	await execFileAsync('unzip', ['-o', '-q', mxlPath, '-d', extractDir]);
	return path.join(extractDir, 'score.musicxml');
}

export async function renderMusxToImages(musxPath: string, pieceId: string, outDir: string): Promise<RenderResult> {
	mkdirSync(outDir, { recursive: true });
	const musicXmlPath = await musxToMusicXml(musxPath, outDir);

	// verovio logs warnings to console.error; capture rather than let them
	// scroll past silently, so the runner can report them per piece.
	const capturedWarnings: string[] = [];
	let pages: RenderedPage[];
	{
		const createVerovioModule = (await import('verovio/wasm')).default;
		const { VerovioToolkit } = await import('verovio/esm');
		// Verovio's Emscripten glue binds its `print`/`printErr` output functions
		// once, when the module factory runs; a later `console.error` override
		// does NOT intercept them (verified this session: overriding console.error
		// AFTER the fact silently missed every warning). The factory's own
		// `printErr` option is the supported hook and does work (also verified),
		// so warnings are captured here, not by monkey-patching console.
		const verovioModule = await createVerovioModule({
			printErr: (text: string) => capturedWarnings.push(text)
		});
		const toolkit = new VerovioToolkit(verovioModule);

		const xmlText = readFileSync(musicXmlPath, 'utf8');
		const loaded = toolkit.loadData(xmlText);
		if (!loaded) {
			throw new Error(`Verovio could not load ${musicXmlPath} (loadData returned false/0)`);
		}
		toolkit.setOptions({
			scale: 100,
			pageWidth: PAGE_WIDTH_TENTHS_MM,
			pageHeight: PAGE_HEIGHT_TENTHS_MM,
			adjustPageHeight: true,
			breaks: 'auto'
		});
		toolkit.redoLayout();
		const pageCount = toolkit.getPageCount();

		pages = [];
		for (let p = 1; p <= pageCount; p++) {
			const svg = toolkit.renderToSVG(p);
			const svgPath = path.join(outDir, `page${p}.svg`);
			writeFileSync(svgPath, svg);

			const pngPath = path.join(outDir, `page${p}_${Math.round(TARGET_PIXEL_WIDTH / (PAGE_WIDTH_TENTHS_MM / 10 / 25.4))}dpi.png`);
			await execFileAsync('rsvg-convert', ['-w', String(TARGET_PIXEL_WIDTH), '-b', 'white', svgPath, '-o', pngPath]);

			const achievedDpi = TARGET_PIXEL_WIDTH / (PAGE_WIDTH_TENTHS_MM / 10 / 25.4);
			pages.push({ pageNumber: p, svgPath, pngPath, pngWidthPx: TARGET_PIXEL_WIDTH, achievedDpi });
		}
	}

	return { pieceId, musicXmlPath, pages, verovioWarnings: capturedWarnings };
}
