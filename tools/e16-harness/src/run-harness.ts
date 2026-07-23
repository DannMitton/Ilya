/**
 * run-harness: the single entry point (task 5). For each corpus piece:
 *   1. convert `.musx` -> MNX via denigma (`denigma-convert.ts`)
 *   2. extract ground truth from that MNX (`ground-truth.ts`)
 *   3. render a full-page image via the musx2mxl/Verovio/rsvg-convert
 *      chain (`render.ts`) -- INDEPENDENT of step 1/2's denigma/MNX path,
 *      deliberately: two different converters reading the SAME `.musx`,
 *      so ground truth is not circularly derived from the same tool that
 *      produced the "recognizer input" image.
 *   4. run the stub recognizer adapter (`stub-adapter.ts`) -- a real OMR
 *      engine is a LATER, separate chunk; this proves the plumbing, not
 *      recognition accuracy. (The corrupted-fixture self-test is the
 *      correctness proof for the scorer itself; run it separately via
 *      `npm run self-test`.)
 *   5. score (`scorer.ts`) and accumulate into a scorecard.
 *
 * Usage:
 *   node src/run-harness.ts <path-to-1.musx> [<path-to-2.musx> ...]
 *
 * The corpus lives OUTSIDE this repo (Dann's `Finale Files` folder), so
 * paths are passed on the command line rather than hard-coded, keeping
 * this directory self-contained and portable. See README.md for the
 * exact invocation used against the six *Sunless* pieces this session.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { musxToMnxJson, DenigmaConversionError } from './denigma-convert.ts';
import { extractGroundTruth } from './ground-truth.ts';
import { renderMusxToImages } from './render.ts';
import { stubAdapt } from './stub-adapter.ts';
import { scoreVerse } from './scorer.ts';
import type { VerseScore } from './scorer.ts';

const OUTPUT_DIR = path.resolve(import.meta.dirname, '..', 'output');

interface PieceResult {
	pieceId: string;
	musxPath: string;
	groundTruthWarnings: number;
	groundTruthErrors: number;
	sungVerseNumbers: number[];
	tempoBpm: number[];
	renderedPages: number;
	renderedDpi: number | null;
	renderError?: string;
	stubScorePrimaryVerse: VerseScore | null;
	scoreError?: string;
}

function pieceIdFromPath(musxPath: string): string {
	return path.basename(musxPath, path.extname(musxPath)).replace(/\s+/g, '-').toLowerCase();
}

async function runOnePiece(musxPath: string): Promise<PieceResult> {
	const pieceId = pieceIdFromPath(musxPath);
	const pieceOutDir = path.join(OUTPUT_DIR, pieceId);
	mkdirSync(pieceOutDir, { recursive: true });

	const result: PieceResult = {
		pieceId,
		musxPath,
		groundTruthWarnings: 0,
		groundTruthErrors: 0,
		sungVerseNumbers: [],
		tempoBpm: [],
		renderedPages: 0,
		renderedDpi: null,
		stubScorePrimaryVerse: null
	};

	// ── Ground truth (denigma -> MNX -> MnxScoreParser) ──
	const mnxJsonText = await musxToMnxJson(musxPath);
	const truth = await extractGroundTruth(pieceId, musxPath, mnxJsonText);
	writeFileSync(path.join(pieceOutDir, 'ground-truth.json'), JSON.stringify(truth, null, 2));

	result.groundTruthWarnings = truth.parser.warnings;
	result.groundTruthErrors = truth.parser.errors;
	result.sungVerseNumbers = truth.sungVerseNumbers;
	result.tempoBpm = truth.tempoMarkings.map((t) => t.bpm);

	// ── Render (musx2mxl -> MusicXML -> Verovio -> rsvg-convert) ──
	try {
		const rendered = await renderMusxToImages(musxPath, pieceId, pieceOutDir);
		result.renderedPages = rendered.pages.length;
		result.renderedDpi = rendered.pages[0]?.achievedDpi ?? null;
		writeFileSync(
			path.join(pieceOutDir, 'render-manifest.json'),
			JSON.stringify(rendered, null, 2)
		);
	} catch (err) {
		result.renderError = err instanceof Error ? err.message : String(err);
	}

	// ── Stub recognizer + score (primary verse only for the scorecard) ──
	try {
		const primaryVerse = truth.sungVerseNumbers[0];
		if (primaryVerse === undefined) {
			result.scoreError = 'no sung verses in ground truth; nothing to score';
		} else {
			const recognized = stubAdapt(truth);
			const recognizedVerse = recognized.verses.find((v) => v.verseNumber === primaryVerse);
			if (!recognizedVerse) {
				result.scoreError = `stub adapter produced no verse ${primaryVerse}`;
			} else {
				const verseScore = scoreVerse(truth, primaryVerse, recognizedVerse);
				result.stubScorePrimaryVerse = verseScore;
				writeFileSync(path.join(pieceOutDir, 'stub-score.json'), JSON.stringify(verseScore, null, 2));
			}
		}
	} catch (err) {
		result.scoreError = err instanceof Error ? err.message : String(err);
	}

	return result;
}

function formatTable(results: PieceResult[]): string {
	const header = [
		'piece',
		'gt warn/err',
		'verses',
		'tempo(bpm)',
		'pages',
		'dpi',
		'pitchF1',
		'rhythmF1',
		'AlER',
		'notes'
	];
	const rows = results.map((r) => {
		const s = r.stubScorePrimaryVerse;
		return [
			r.pieceId,
			`${r.groundTruthWarnings}/${r.groundTruthErrors}`,
			r.sungVerseNumbers.join(','),
			[...new Set(r.tempoBpm)].join(','),
			String(r.renderedPages),
			r.renderedDpi ? r.renderedDpi.toFixed(1) : r.renderError ? 'FAILED' : 'n/a',
			s ? s.notes.pitchF1.toFixed(3) : (r.scoreError ?? 'n/a'),
			s ? s.notes.rhythmF1.toFixed(3) : '',
			s && s.alignment.alignmentErrorRate !== null ? s.alignment.alignmentErrorRate.toFixed(3) : '',
			r.renderError ? `render: ${r.renderError}` : ''
		];
	});

	const widths = header.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
	const line = (cells: string[]) => cells.map((c, i) => c.padEnd(widths[i])).join('  ');
	return [line(header), widths.map((w) => '-'.repeat(w)).join('  '), ...rows.map(line)].join('\n');
}

async function main(): Promise<void> {
	const musxPaths = process.argv.slice(2);
	if (musxPaths.length === 0) {
		console.error('Usage: node src/run-harness.ts <path-to-1.musx> [<path-to-2.musx> ...]');
		process.exit(1);
	}

	mkdirSync(OUTPUT_DIR, { recursive: true });

	const results: PieceResult[] = [];
	for (const musxPath of musxPaths) {
		console.log(`Processing ${musxPath} ...`);
		try {
			results.push(await runOnePiece(musxPath));
		} catch (err) {
			if (err instanceof DenigmaConversionError) {
				console.error(`  denigma conversion failed: ${err.message}`);
			} else {
				console.error(`  FAILED: ${err instanceof Error ? err.message : String(err)}`);
			}
			results.push({
				pieceId: pieceIdFromPath(musxPath),
				musxPath,
				groundTruthWarnings: 0,
				groundTruthErrors: 0,
				sungVerseNumbers: [],
				tempoBpm: [],
				renderedPages: 0,
				renderedDpi: null,
				stubScorePrimaryVerse: null,
				scoreError: err instanceof Error ? err.message : String(err)
			});
		}
	}

	writeFileSync(path.join(OUTPUT_DIR, 'scorecard.json'), JSON.stringify(results, null, 2));

	const table = formatTable(results);
	writeFileSync(path.join(OUTPUT_DIR, 'scorecard.md'), '# E.16 harness scorecard\n\n```\n' + table + '\n```\n');

	console.log('\n' + table);
	console.log(`\nWrote ${path.join(OUTPUT_DIR, 'scorecard.json')} and scorecard.md`);
}

main();
