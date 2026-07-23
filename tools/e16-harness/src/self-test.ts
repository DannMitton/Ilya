/**
 * self-test: the scorer's own positive/negative control, per the brief's
 * definition of done ("the perfect-output fixture scores 0 error; the
 * corrupted fixture scores nonzero, in the right direction, on the right
 * metric"). Runs against a small SYNTHETIC ground truth embedded right
 * here, deliberately independent of the corpus / denigma / musx2mxl /
 * Verovio, so this self-test always runs, with no external tool
 * dependency and no network, and can be re-run in five seconds any time
 * the scorer changes.
 *
 * Run: `node tools/e16-harness/src/self-test.ts`
 */

import type { GroundTruth } from './ground-truth.ts';
import { stubAdapt } from './stub-adapter.ts';
import { corruptedAdapt } from './corrupted-adapter.ts';
import { scoreVerse } from './scorer.ts';

// 8 quarter notes, 4/4 time (2 measures), diatonic scale C4..G4 stepwise
// then back down, one syllable-bearing note every second note (simulating
// a melisma continuation on the intervening note, same convention the
// product uses: absence of `syllableText` = melisma continuation).
const NOTE_MIDIS = [60, 62, 64, 65, 67, 65, 64, 62];
const SYLLABLES: (string | undefined)[] = ['Ты', undefined, 'не', undefined, 'у', undefined, 'знал', undefined];

function buildSyntheticGroundTruth(): GroundTruth {
	const notes = NOTE_MIDIS.map((midi, i) => {
		const measureIndex = Math.floor(i / 4);
		const beatInMeasure = i % 4;
		return {
			id: `synthetic-${i}`,
			type: 'note' as const,
			measureIndex,
			onset: { numerator: beatInMeasure, denominator: 4 },
			duration: { numerator: 1, denominator: 4 },
			onsetAbsolute: measureIndex * 1 + beatInMeasure / 4,
			midi,
			syllableText: SYLLABLES[i],
			syllableType: SYLLABLES[i] ? ('whole' as const) : undefined
		};
	});

	return {
		pieceId: 'synthetic-selftest',
		sourceMusxPath: '(synthetic, no source file)',
		parser: { warnings: 0, errors: 0, errorDetail: [] },
		vocalPart: { partId: 'P1', partName: 'Voice' },
		clef: { sign: 'G', line: 2 },
		keySignature: { fifths: 0 },
		tempoMarkings: [{ measureIndex: 0, bpm: 100 }],
		sungVerseNumbers: [1],
		measureDurations: [
			{ index: 0, expectedDuration: { numerator: 1, denominator: 1 } },
			{ index: 1, expectedDuration: { numerator: 1, denominator: 1 } }
		],
		verses: [{ verseNumber: 1, notes }]
	};
}

function assert(condition: boolean, message: string): void {
	if (!condition) throw new Error(`SELF-TEST FAILED: ${message}`);
}

function runSelfTest(): void {
	const truth = buildSyntheticGroundTruth();

	// ── Perfect fixture: must score exactly zero error everywhere ──
	const perfectOutput = stubAdapt(truth);
	const perfectScore = scoreVerse(truth, 1, perfectOutput.verses[0]);

	assert(perfectScore.notes.pitchPrecision === 1, `perfect pitchPrecision should be 1, got ${perfectScore.notes.pitchPrecision}`);
	assert(perfectScore.notes.pitchRecall === 1, `perfect pitchRecall should be 1, got ${perfectScore.notes.pitchRecall}`);
	assert(perfectScore.notes.pitchF1 === 1, `perfect pitchF1 should be 1, got ${perfectScore.notes.pitchF1}`);
	assert(perfectScore.notes.rhythmF1 === 1, `perfect rhythmF1 should be 1, got ${perfectScore.notes.rhythmF1}`);
	assert(perfectScore.notes.unmatchedTruth === 0, `perfect unmatchedTruth should be 0, got ${perfectScore.notes.unmatchedTruth}`);
	assert(perfectScore.notes.unmatchedRecognized === 0, `perfect unmatchedRecognized should be 0, got ${perfectScore.notes.unmatchedRecognized}`);
	assert(perfectScore.notes.meanPitchShiftSemitones === 0, `perfect meanPitchShiftSemitones should be 0, got ${perfectScore.notes.meanPitchShiftSemitones}`);
	assert(perfectScore.notes.meanOnsetShiftWholeNotes === 0, `perfect meanOnsetShiftWholeNotes should be 0, got ${perfectScore.notes.meanOnsetShiftWholeNotes}`);
	assert(perfectScore.notes.meanDurationShiftWholeNotes === 0, `perfect meanDurationShiftWholeNotes should be 0, got ${perfectScore.notes.meanDurationShiftWholeNotes}`);
	assert(perfectScore.tessitura.minDelta === 0, `perfect tessitura minDelta should be 0, got ${perfectScore.tessitura.minDelta}`);
	assert(perfectScore.tessitura.maxDelta === 0, `perfect tessitura maxDelta should be 0, got ${perfectScore.tessitura.maxDelta}`);
	assert(perfectScore.tessitura.meanDelta === 0, `perfect tessitura meanDelta should be 0, got ${perfectScore.tessitura.meanDelta}`);
	assert(perfectScore.alignment.alignmentErrorRate === 0, `perfect AlER should be 0, got ${perfectScore.alignment.alignmentErrorRate}`);

	console.log('PASS: perfect fixture scores zero error on every metric family.');

	// ── Corrupted fixture: must score nonzero, in the right direction ──
	const corruptedOutput = corruptedAdapt(truth);
	const corruptedScore = scoreVerse(truth, 1, corruptedOutput.verses[0]);

	// (1) dropped note -> recall must fall below 1, and there must be exactly one unmatched truth note.
	assert(corruptedScore.notes.pitchRecall < 1, `corrupted pitchRecall should be < 1 (a note was dropped), got ${corruptedScore.notes.pitchRecall}`);
	assert(corruptedScore.notes.unmatchedTruth >= 1, `corrupted unmatchedTruth should be >= 1, got ${corruptedScore.notes.unmatchedTruth}`);

	// (2) shifted pitch -> mean pitch shift must move away from 0 in the POSITIVE direction (recognized = truth + 2).
	assert(
		corruptedScore.notes.meanPitchShiftSemitones !== null && corruptedScore.notes.meanPitchShiftSemitones > 0,
		`corrupted meanPitchShiftSemitones should be > 0, got ${corruptedScore.notes.meanPitchShiftSemitones}`
	);
	assert(corruptedScore.notes.pitchPrecision < 1, `corrupted pitchPrecision should be < 1 (a pitch was shifted), got ${corruptedScore.notes.pitchPrecision}`);

	// (3) mis-attached syllable -> AlER must be nonzero.
	assert(
		corruptedScore.alignment.alignmentErrorRate !== null && corruptedScore.alignment.alignmentErrorRate > 0,
		`corrupted alignmentErrorRate should be > 0, got ${corruptedScore.alignment.alignmentErrorRate}`
	);

	console.log('PASS: corrupted fixture scores nonzero error, in the expected direction, on all three targeted metrics.');
	console.log('\nSelf-test summary:');
	console.log('  perfect  :', JSON.stringify({ pitchF1: perfectScore.notes.pitchF1, rhythmF1: perfectScore.notes.rhythmF1, AlER: perfectScore.alignment.alignmentErrorRate }));
	console.log('  corrupted:', JSON.stringify({
		pitchPrecision: corruptedScore.notes.pitchPrecision,
		pitchRecall: corruptedScore.notes.pitchRecall,
		meanPitchShiftSemitones: corruptedScore.notes.meanPitchShiftSemitones,
		unmatchedTruth: corruptedScore.notes.unmatchedTruth,
		AlER: corruptedScore.alignment.alignmentErrorRate
	}));
}

runSelfTest();
