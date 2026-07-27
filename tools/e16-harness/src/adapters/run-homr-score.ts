/**
 * run-homr-score: scores homr's REAL output (already produced this session,
 * archived at output/<piece>/homr-raw/page<N>_300dpi.musicxml) against the
 * ground truth already extracted by the main harness run
 * (output/<piece>/ground-truth.json). Does not re-render, does not
 * re-extract ground truth, does not touch product code, does not commit.
 *
 * Usage: node src/adapters/run-homr-score.ts
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { homrAdaptPiece } from './homr-adapter.ts';
import { scoreVerse } from '../scorer.ts';
import type { GroundTruth } from '../ground-truth.ts';

const OUTPUT_DIR = path.resolve(import.meta.dirname, '..', '..', 'output');

const PIECES = [
	'mussorgsky---sunless-01---within-four-walls',
	'mussorgsky---sunless-02---you-did-not-recognize-me',
	'mussorgsky---sunless-03---finished-is-the-noisy-idle-day',
	'mussorgsky---sunless-04---be-bored',
	'mussorgsky---sunless-05---elegy',
	'mussorgsky---sunless-06---on-the-river'
];

function loadPageXmls(pieceDir: string): string[] {
	const rawDir = path.join(pieceDir, 'homr-raw');
	const files = readdirSync(rawDir)
		.filter((f) => f.endsWith('.musicxml'))
		.sort((a, b) => {
			const na = Number(a.match(/page(\d+)_/)?.[1] ?? 0);
			const nb = Number(b.match(/page(\d+)_/)?.[1] ?? 0);
			return na - nb;
		});
	return files.map((f) => readFileSync(path.join(rawDir, f), 'utf8'));
}

function main(): void {
	const perPiece: Record<string, unknown> = {};
	const aggregateRows: any[] = [];

	for (const pieceId of PIECES) {
		const pieceDir = path.join(OUTPUT_DIR, pieceId);
		const truth: GroundTruth = JSON.parse(readFileSync(path.join(pieceDir, 'ground-truth.json'), 'utf8'));
		const primaryVerse = truth.sungVerseNumbers[0];
		const pageXmls = loadPageXmls(pieceDir);

		// Vocal staff = 1 for every piece in this corpus (see homr-adapter.ts doc comment; verified per-piece
		// via clef sign match against ground truth below, not assumed).
		const { output, pageMeasureCounts, clefSigns } = homrAdaptPiece(pieceId, pageXmls, 1, primaryVerse);

		const groundTruthMeasureCount = truth.measureDurations.length;
		const homrMeasureCountTotal = pageMeasureCounts.reduce((a, b) => a + b, 0);

		const recognizedVerse = output.verses.find((v) => v.verseNumber === primaryVerse)!;
		const verseScore = scoreVerse(truth, primaryVerse, recognizedVerse);

		const clefMatch = clefSigns.every((s) => s === truth.clef?.sign);

		perPiece[pieceId] = {
			groundTruthMeasureCount,
			homrMeasureCountTotal,
			homrPageMeasureCounts: pageMeasureCounts,
			measureCountsAgree: groundTruthMeasureCount === homrMeasureCountTotal,
			clefSignsPerPage: clefSigns,
			groundTruthClefSign: truth.clef?.sign,
			vocalStaffClefMatchesGroundTruth: clefMatch,
			verseScore
		};

		aggregateRows.push({ pieceId, ...verseScore.notes, tessitura: verseScore.tessitura, alignment: verseScore.alignment });

		writeFileSync(path.join(pieceDir, 'homr-score.json'), JSON.stringify(perPiece[pieceId], null, 2));
	}

	// Aggregate (micro-average over matched/unmatched counts, plus macro-average of per-piece rates).
	const totalTruthNotes = aggregateRows.reduce((a, r) => a + r.truthNoteCount, 0);
	const totalRecNotes = aggregateRows.reduce((a, r) => a + r.recognizedNoteCount, 0);
	const totalMatched = aggregateRows.reduce((a, r) => a + r.matchedCount, 0);
	const totalPitchMatches = aggregateRows.reduce((a, r) => a + Math.round(r.pitchRecall * r.truthNoteCount), 0);
	const totalRhythmMatches = aggregateRows.reduce((a, r) => a + Math.round(r.rhythmRecall * r.truthNoteCount), 0);

	const macroMeanPitchShift =
		aggregateRows.filter((r) => r.meanPitchShiftSemitones !== null).reduce((a, r) => a + r.meanPitchShiftSemitones, 0) /
		Math.max(1, aggregateRows.filter((r) => r.meanPitchShiftSemitones !== null).length);

	const aggregate = {
		pieceCount: PIECES.length,
		totalTruthNotes,
		totalRecognizedNotes: totalRecNotes,
		totalMatched,
		microPitchPrecision: totalPitchMatches / Math.max(1, totalRecNotes),
		microPitchRecall: totalPitchMatches / Math.max(1, totalTruthNotes),
		microRhythmPrecision: totalRhythmMatches / Math.max(1, totalRecNotes),
		microRhythmRecall: totalRhythmMatches / Math.max(1, totalTruthNotes),
		macroMeanPitchShiftSemitones: macroMeanPitchShift
	};

	writeFileSync(path.join(OUTPUT_DIR, 'homr-scorecard.json'), JSON.stringify({ perPiece, aggregate }, null, 2));

	console.log(JSON.stringify({ perPiece, aggregate }, null, 2));
}

main();
