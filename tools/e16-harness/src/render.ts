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
 *        --[reconstructStaves(), see below]--> repaired score.musicxml
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
 *
 * AMENDMENT, 2026-07-27 (render-fidelity repair, Sonnet, farmed task):
 * the staff-collapse limitation above is now REPAIRED for every render
 * this file produces, by `reconstructStaves()`. It is a reconstruction,
 * not a guess: musx2mxl already writes every `<staff>` reference inside
 * each part's notes and directions, and only forgets to declare the part
 * -level `<staves>` count and the `<part-group>` brace that number
 * implies. `reconstructStaves()` derives each part's staff count as the
 * maximum `<staff>` number that part's own notes reference (nothing is
 * inferred from outside the file), inserts `<staves>` in MusicXML's
 * required `<attributes>` element order, and braces any part with more
 * than one staff. It is idempotent (a part that already declares
 * `<staves>`, or is already grouped, is left untouched and logged as
 * such) and additive (it patches the extracted MusicXML in memory before
 * Verovio ever sees it; it does not touch any previously-written render).
 * Proven on piece 01 (`claude/opus-memo-e16-render-fidelity-piano-staff-
 * collapse_2026-07-27.md`): 4 "Staff 2 cannot be found" warnings -> 0,
 * 24 staff elements in the SVG -> 36, 0 braces -> 4.
 *
 * What remains UNREPAIRED, named rather than hidden: this fixes only the
 * `<staves>`/`<part-group>` omission. musx2mxl's other documented piano
 * defects (if any beyond the staff-split itself, e.g. any residual
 * cross-staff beaming/voice assignment) are NOT addressed here and were
 * not re-surveyed as part of this task; only the staff-count/grouping
 * defect was measured, proven, and repaired. If a future render still
 * shows piano-staff oddities after this patch, that is a distinct,
 * unrepaired defect, not a sign this patch failed.
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
	/** Per-part audit trail of what reconstructStaves() did to this piece's MusicXML, if anything. */
	staffReconstruction: StaffReconstructionLogEntry[];
}

// ---------------------------------------------------------------------------
// Staff/part-group reconstruction (2026-07-27 render-fidelity repair).
// ---------------------------------------------------------------------------

export interface StaffReconstructionLogEntry {
	partId: string;
	partName: string | null;
	maxStaff: number;
	/** 'inserted' | 'already-present' | 'not-needed' (maxStaff <= 1) | 'no-attributes-block' */
	stavesAction: 'inserted' | 'already-present' | 'not-needed' | 'no-attributes-block';
	/** 'inserted' | 'already-present' | 'not-needed' (maxStaff <= 1) | 'no-score-part' */
	groupAction: 'inserted' | 'already-present' | 'not-needed' | 'no-score-part';
}

export interface StaffReconstructionResult {
	xml: string;
	log: StaffReconstructionLogEntry[];
	changed: boolean;
}

/**
 * reconstructStaves: repairs musx2mxl's dropped `<staves>`/`<part-group>`
 * data, in place, on an already-extracted MusicXML string.
 *
 * A part's staff count is EXACTLY the maximum `<staff>` number its own
 * `<note>`/`<direction>` elements already reference. Nothing is inferred
 * and nothing is invented; the number is read out of data musx2mxl already
 * wrote. Never hard-codes 2 or any other count: a genuinely 3-staff piano
 * part (or any N) is handled identically.
 *
 * For every part whose derived count exceeds 1:
 *   - `<staves>N</staves>` is inserted into that part's FIRST `<attributes>`
 *     block, in MusicXML's required element order (after whichever of
 *     `<divisions>`/`<key>`/`<time>` is present and last in that order,
 *     before `<clef>`/anything else) — but ONLY if that part does not
 *     already declare `<staves>` anywhere (idempotency guard 1).
 *   - its `<score-part>` entry in `<part-list>` is wrapped in a
 *     `<part-group type="start">...<group-symbol>brace</group-symbol>...`
 *     / `<part-group type="stop">` pair — but ONLY if it is not already
 *     bracketed by a part-group (idempotency guard 2).
 *
 * Both guards mean this function is safe to run twice: the second run's
 * `changed` is `false` and its `log` reports every part as
 * 'already-present', which is Task 1's definition of done.
 */
export function reconstructStaves(xml: string): StaffReconstructionResult {
	const log: StaffReconstructionLogEntry[] = [];
	let changed = false;

	// ---- pass 1: per-part staff-count derivation and <staves> insertion ----
	// Each <part id="...">...</part> block is handled independently so that
	// editing one part's text never shifts another part's match indices.
	const partRe = /<part id="([^"]+)">([\s\S]*?)<\/part>/g;
	const staffCounts = new Map<string, number>();

	const newXmlAfterParts = xml.replace(partRe, (fullMatch: string, partId: string, body: string) => {
		const staffNums = [...body.matchAll(/<staff>(\d+)<\/staff>/g)].map((m) => parseInt(m[1], 10));
		const maxStaff = staffNums.length > 0 ? Math.max(...staffNums) : 1;
		staffCounts.set(partId, maxStaff);

		if (maxStaff <= 1) {
			log.push({ partId, partName: null, maxStaff, stavesAction: 'not-needed', groupAction: 'not-needed' });
			return fullMatch;
		}

		const attrRe = /<attributes>([\s\S]*?)<\/attributes>/; // first occurrence only: <staves> is declared once
		const attrMatch = attrRe.exec(body);
		if (!attrMatch) {
			log.push({ partId, partName: null, maxStaff, stavesAction: 'no-attributes-block', groupAction: 'not-needed' });
			return fullMatch;
		}
		const attrBody = attrMatch[1];

		if (/<staves>/.test(attrBody)) {
			log.push({ partId, partName: null, maxStaff, stavesAction: 'already-present', groupAction: 'not-needed' });
			return fullMatch;
		}

		// MusicXML required <attributes> child order: divisions, key, time,
		// staves, part-symbol, instruments, clef, staff-details, transpose, ...
		// So <staves> belongs right after the LAST of divisions/key/time that
		// is actually present, and before everything else. Scanning for all
		// three closing tags and keeping the latest match position handles
		// any subset/order musx2mxl happens to emit them in.
		const anchorRe = /<\/time>|<\/key>|<\/divisions>/g;
		let anchorEnd = -1;
		let am: RegExpExecArray | null;
		while ((am = anchorRe.exec(attrBody)) !== null) {
			anchorEnd = am.index + am[0].length;
		}

		const indentMatch = /\n([ \t]*)<(?:clef|divisions|time|key)[ >]/.exec(attrBody);
		const indent = indentMatch ? indentMatch[1] : '        ';
		const insertion = `\n${indent}<staves>${maxStaff}</staves>`;

		const newAttrBody = anchorEnd >= 0
			? attrBody.slice(0, anchorEnd) + insertion + attrBody.slice(anchorEnd)
			: insertion + attrBody; // no divisions/key/time at all: put it first

		const newAttrBlock = `<attributes>${newAttrBody}</attributes>`;
		const newBody = body.slice(0, attrMatch.index) + newAttrBlock + body.slice(attrMatch.index + attrMatch[0].length);

		changed = true;
		log.push({ partId, partName: null, maxStaff, stavesAction: 'inserted', groupAction: 'not-needed' });
		return `<part id="${partId}">${newBody}</part>`;
	});

	let newXml = newXmlAfterParts;

	// ---- pass 2: part-group bracing in <part-list>, for parts with >1 staff ----
	const partListRe = /<part-list>([\s\S]*?)<\/part-list>/;
	const partListMatch = partListRe.exec(newXml);
	if (partListMatch) {
		let partListBody = partListMatch[1];

		// Existing part-group numbers, so a newly-inserted brace never collides.
		const usedNumbers = new Set(
			[...partListBody.matchAll(/<part-group[^>]*\bnumber="(\d+)"/g)].map((m) => parseInt(m[1], 10))
		);
		let nextNumber = 1;
		const allocNumber = (): number => {
			while (usedNumbers.has(nextNumber)) nextNumber++;
			usedNumbers.add(nextNumber);
			return nextNumber++;
		};

		for (const [partId, maxStaff] of staffCounts) {
			const logIdx = log.findIndex((e) => e.partId === partId);
			if (maxStaff <= 1) continue; // logged as 'not-needed' already in pass 1

			const scorePartOpenRe = new RegExp(`<score-part id="${partId}">`);
			const openMatch = scorePartOpenRe.exec(partListBody);
			if (!openMatch) {
				if (logIdx >= 0) log[logIdx].groupAction = 'no-score-part';
				continue;
			}

			const scorePartCloseRe = new RegExp(`<score-part id="${partId}">[\\s\\S]*?<\\/score-part>`);
			const closeMatch = scorePartCloseRe.exec(partListBody);
			if (!closeMatch) {
				if (logIdx >= 0) log[logIdx].groupAction = 'no-score-part';
				continue;
			}
			const closeEnd = closeMatch.index + closeMatch[0].length;

			// A MusicXML <part-group> is NOT a wrapper: "start" and "stop" are
			// each complete, self-contained sibling elements of <score-part>
			// inside the flat <part-list> sequence (start closes with its own
			// </part-group> immediately after <group-symbol>/<group-barline>;
			// stop is a separate, typically self-closing, element). So
			// "already grouped" means: the sibling immediately before this
			// score-part is a COMPLETE type="start" part-group element, and
			// the sibling immediately after is a COMPLETE type="stop" one.
			const beforeText = partListBody.slice(0, openMatch.index).replace(/\s+$/, '');
			const lastGroupIdx = beforeText.lastIndexOf('<part-group');
			const startTail = lastGroupIdx >= 0 ? beforeText.slice(lastGroupIdx) : '';
			const alreadyStarted = /^<part-group\b[^>]*\btype="start"[^>]*>[\s\S]*<\/part-group>$/.test(startTail);

			const afterText = partListBody.slice(closeEnd).replace(/^\s+/, '');
			const alreadyStopped = /^<part-group\b[^>]*\btype="stop"[^>]*(?:\/>|>\s*<\/part-group>)/.test(afterText);

			if (alreadyStarted && alreadyStopped) {
				if (logIdx >= 0) log[logIdx].groupAction = 'already-present';
				continue;
			}

			const groupNum = allocNumber();
			const startTag = `<part-group type="start" number="${groupNum}"><group-symbol>brace</group-symbol><group-barline>yes</group-barline></part-group>`;
			const stopTag = `<part-group type="stop" number="${groupNum}" />`;

			// Insert the LATER splice point (stop, after closeEnd) first so the
			// EARLIER splice point (start, before openMatch.index) is untouched.
			partListBody = partListBody.slice(0, closeEnd) + stopTag + partListBody.slice(closeEnd);
			partListBody = partListBody.slice(0, openMatch.index) + startTag + partListBody.slice(openMatch.index);

			changed = true;
			if (logIdx >= 0) log[logIdx].groupAction = 'inserted';
		}

		newXml = newXml.slice(0, partListMatch.index) + `<part-list>${partListBody}</part-list>` + newXml.slice(partListMatch.index + partListMatch[0].length);
	}

	// Fill in partName for every log entry, from part-list, for auditability.
	for (const entry of log) {
		const nameRe = new RegExp(`<score-part id="${entry.partId}">\\s*<part-name>([^<]*)<\\/part-name>`);
		const nm = nameRe.exec(newXml);
		entry.partName = nm ? nm[1] : null;
	}

	return { xml: newXml, log, changed };
}

/** Formats a StaffReconstructionResult's log as human-readable audit lines. */
export function formatStaffReconstructionLog(pieceId: string, result: StaffReconstructionResult): string[] {
	return result.log.map((e) => {
		const name = e.partName ? `"${e.partName}"` : '(unnamed)';
		return `[reconstructStaves] ${pieceId} ${e.partId} ${name}: max <staff> ref = ${e.maxStaff}, staves=${e.stavesAction}, group=${e.groupAction}`;
	});
}

// ---------------------------------------------------------------------------
// Rendering (shared by the .musx pipeline and the direct-.mxl pipeline).
// ---------------------------------------------------------------------------

async function musxToMusicXml(musxPath: string, outDir: string): Promise<string> {
	const mxlPath = path.join(outDir, 'score.mxl');
	await execFileAsync('musx2mxl', ['--output_path', mxlPath, musxPath]);
	return extractMxl(mxlPath, outDir);
}

async function extractMxl(mxlPath: string, outDir: string): Promise<string> {
	const extractDir = path.join(outDir, 'mxl_extract');
	mkdirSync(extractDir, { recursive: true });
	await execFileAsync('unzip', ['-o', '-q', mxlPath, '-d', extractDir]);
	return path.join(extractDir, 'score.musicxml');
}

async function renderXmlTextToImages(
	xmlText: string,
	outDir: string
): Promise<{ pages: RenderedPage[]; verovioWarnings: string[] }> {
	mkdirSync(outDir, { recursive: true });

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

		const loaded = toolkit.loadData(xmlText);
		if (!loaded) {
			throw new Error(`Verovio could not load the supplied MusicXML (loadData returned false/0)`);
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

	return { pages, verovioWarnings: capturedWarnings };
}

/**
 * renderMusxToImages: the full `.musx` -> images pipeline, now with the
 * staff/part-group reconstruction applied automatically between extraction
 * and Verovio, so a fresh run from source is correct without manual
 * intervention. `outDir/mxl_extract/score.musicxml` is written as the
 * REPAIRED text (that file is this run's own fresh scratch output, not a
 * previously-delivered render, so overwriting it is not a fidelity
 * violation); nothing under a piece's existing `output/<piece>/` render
 * directories is touched by this function unless `outDir` points at one,
 * which callers must not do for already-delivered pieces.
 */
export async function renderMusxToImages(musxPath: string, pieceId: string, outDir: string): Promise<RenderResult> {
	mkdirSync(outDir, { recursive: true });
	const musicXmlPath = await musxToMusicXml(musxPath, outDir);

	const rawXml = readFileSync(musicXmlPath, 'utf8');
	const { xml: repairedXml, log: staffReconstruction } = reconstructStaves(rawXml);
	writeFileSync(musicXmlPath, repairedXml, 'utf8');

	const { pages, verovioWarnings } = await renderXmlTextToImages(repairedXml, outDir);

	return { pieceId, musicXmlPath, pages, verovioWarnings, staffReconstruction };
}

/**
 * renderMxlToImages: renders an ALREADY-CONVERTED `score.mxl` (musx2mxl
 * output already on disk; no `.musx` source or musx2mxl CLI needed), with
 * the same staff/part-group reconstruction applied. This is what Task 2
 * uses to produce `repaired/` renders beside each piece's existing,
 * untouched collapsed-layout render: `outDir` must be a NEW directory
 * (e.g. `output/<piece>/repaired/`), never a piece's existing render
 * directory, so this function never overwrites a delivered page.
 */
export async function renderMxlToImages(mxlPath: string, pieceId: string, outDir: string): Promise<RenderResult> {
	const extractDir = mkdtempSync(path.join(tmpdir(), 'e16-mxl-'));
	const musicXmlPath = await extractMxl(mxlPath, extractDir);

	const rawXml = readFileSync(musicXmlPath, 'utf8');
	const { xml: repairedXml, log: staffReconstruction } = reconstructStaves(rawXml);

	const { pages, verovioWarnings } = await renderXmlTextToImages(repairedXml, outDir);

	// Deliver the repaired MusicXML text alongside the images, additively,
	// for auditability (not required by the pipeline, but makes the patch's
	// effect on this piece inspectable without re-deriving it).
	const repairedXmlPath = path.join(outDir, 'score.repaired.musicxml');
	writeFileSync(repairedXmlPath, repairedXml, 'utf8');

	return { pieceId, musicXmlPath: repairedXmlPath, pages, verovioWarnings, staffReconstruction };
}
