/**
 * run-oemer-score: scores oemer's REAL output (produced this session,
 * archived at output/<piece>/page1_300dpi.musicxml) against the ground
 * truth already extracted by the main harness run
 * (output/<piece>/ground-truth.json). Does not re-render, does not
 * re-extract ground truth, does not touch product code, does not commit.
 *
 * SCOPE, STATED PLAINLY: unlike run-homr-score.ts (all 22 pages, all 6
 * pieces), this covers ONE page of ONE piece so far --
 * mussorgsky---sunless-01---within-four-walls, page 1 only -- because that
 * is the only page oemer has actually finished processing on Dann's Mac at
 * time of writing (oemer took roughly 10-11 minutes for this one page; the
 * decision on running more pages is separate and deliberately not assumed
 * here). Extend PIECES/pages below only once more real oemer output exists;
 * do not fabricate additional rows.
 *
 * FAIRNESS NOTE: ground truth's own measure count for the FULL piece is 18
 * (12 in page 1 + 6 in page 2). Since oemer has only seen page 1 (12
 * measures), scoring oemer against the full 18-measure ground truth would
 * count every note in page 2 as a false negative that oemer never had a
 * chance to recognize, understating oemer's real page-1 performance. This
 * script truncates ground truth to its first `oemerPageMeasureCount`
 * measures (12, oemer's own page-1 measure count) before scoring, and does
 * the SAME truncation when scoring homr's own page-1-only output (loaded
 * from the already-archived output/<piece>/homr-raw/page1_300dpi.musicxml),
 * so the two engines are compared on the exact same slice of the piece
 * rather than homr's full-piece score against oemer's single-page score.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { oemerAdaptPiece } from './oemer-adapter.ts';
import { homrAdaptPiece } from './homr-adapter.ts';
import { scoreVerse } from '../scorer.ts';
import type { GroundTruth } from '../ground-truth.ts';

const OUTPUT_DIR = path.resolve(import.meta.dirname, '..', '..', 'output');
const PIECE_ID = 'mussorgsky---sunless-01---within-four-walls';
const OEMER_PAGE_MEASURE_COUNT = 12; // oemer's own page-1 measure count, confirmed by reading its MusicXML

function truncateToMeasures(truth: GroundTruth, measureCount: number): GroundTruth {
	return {
		...truth,
		measureDurations: truth.measureDurations.filter((m) => m.index < measureCount),
		verses: truth.verses.map((v) => ({
			...v,
			notes: v.notes.filter((n) => n.measureIndex < measureCount)
		}))
	};
}

function main(): void {
	const pieceDir = path.join(OUTPUT_DIR, PIECE_ID);
	const fullTruth: GroundTruth = JSON.parse(readFileSync(path.join(pieceDir, 'ground-truth.json'), 'utf8'));
	const primaryVerse = fullTruth.sungVerseNumbers[0];
	const page1Truth = truncateToMeasures(fullTruth, OEMER_PAGE_MEASURE_COUNT);

	// oemer: page 1 only, the only real output that exists so far.
	const oemerPage1Xml = readFileSync(path.join(pieceDir, 'page1_300dpi.musicxml'), 'utf8');
	const oemerAdapted = oemerAdaptPiece(PIECE_ID, [oemerPage1Xml], 1, primaryVerse);
	const oemerVerse = oemerAdapted.output.verses.find((v) => v.verseNumber === primaryVerse)!;
	const oemerScore = scoreVerse(page1Truth, primaryVerse, oemerVerse);

	// homr: same page 1, from its own already-archived raw output, truncated the same way, for a fair comparison.
	const homrPage1Xml = readFileSync(path.join(pieceDir, 'homr-raw', 'page1_300dpi.musicxml'), 'utf8');
	const homrAdapted = homrAdaptPiece(PIECE_ID, [homrPage1Xml], 1, primaryVerse);
	const homrVerse = homrAdapted.output.verses.find((v) => v.verseNumber === primaryVerse)!;
	const homrScorePage1Only = scoreVerse(page1Truth, primaryVerse, homrVerse);

	const result = {
		pieceId: PIECE_ID,
		scope: 'page 1 only (12 of 18 ground-truth measures); NOT the full piece',
		groundTruthMeasureCountThisSlice: page1Truth.measureDurations.length,
		oemer: {
			pageMeasureCount: oemerAdapted.pageMeasureCounts[0],
			clefSignOnVocalStaff: oemerAdapted.clefSigns[0],
			groundTruthClefSign: fullTruth.clef?.sign,
			vocalStaffClefMatchesGroundTruth: oemerAdapted.clefSigns[0] === fullTruth.clef?.sign,
			verseScore: oemerScore
		},
		homrSamePageForComparison: {
			pageMeasureCount: homrAdapted.pageMeasureCounts[0],
			verseScore: homrScorePage1Only
		}
	};

	writeFileSync(path.join(pieceDir, 'oemer-score-page1.json'), JSON.stringify(result, null, 2));
	console.log(JSON.stringify(result, null, 2));
}

main();
