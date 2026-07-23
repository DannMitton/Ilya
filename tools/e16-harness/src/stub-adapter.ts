/**
 * stub-adapter: the "perfect recognizer" fixture. It does no recognition at
 * all; it just re-shapes ground truth into `RecognizedOutput`. Scoring its
 * output against the SAME ground truth must yield zero error on every
 * metric family (see `self-test.ts`). This is the harness's positive
 * control: if the stub does not score as perfect, the scorer itself is
 * broken, not the (nonexistent) recognizer.
 */

import type { GroundTruth } from './ground-truth.ts';
import type { RecognizedOutput, RecognizedVerse } from './normalized-format.ts';

export function stubAdapt(truth: GroundTruth): RecognizedOutput {
	const verses: RecognizedVerse[] = truth.verses.map((v) => ({
		verseNumber: v.verseNumber,
		notes: v.notes.map((n) => ({
			id: n.id,
			type: n.type,
			measureIndex: n.measureIndex,
			onset: n.onset,
			duration: n.duration,
			midi: n.midi,
			syllableText: n.syllableText
		}))
	}));

	return {
		pieceId: truth.pieceId,
		clef: truth.clef,
		keySignature: truth.keySignature,
		tempoBpm: truth.tempoMarkings[0]?.bpm,
		verses
	};
}
