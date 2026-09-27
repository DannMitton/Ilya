/**
 * Notation-only overlay: the typed AnalyzedScore stand-in that lets a
 * parsed score render with NO acoustic marks (Dann's slice-1 scope ruling,
 * 2026-07-13: notation first; the acoustic overlay waits for real inputs).
 *
 * Why this is honest rather than a fudge: the staff renderer reads ONLY
 * `analyzed.events` (audited against staff-renderer.ts, 2026-07-13; the
 * `global` block is carried in the artifact for downstream consumers, not
 * read at render time). An empty events map therefore renders the plain
 * vocal line, underlay included, with zero acoustic claims. This is the
 * engine's own semantics, not a bypass: analyzeScore omits every event
 * whose vowel cannot be resolved, so "no resolvable vowels anywhere" and
 * this helper produce the same rendered result.
 *
 * The remaining fields exist to satisfy the AnalyzedScore type without
 * fabricating measurements:
 * - `global.range` and `global.tessitura` carry the SCORE's observed
 *   pitches (facts of the score, computed the way buildGlobal does).
 * - `global.passaggio` and the calibrationSnapshot's singer fields are
 *   structurally required but unread; they carry the score's own range
 *   bounds as inert placeholders, and `calibrationSnapshot.fR1` is `{}`,
 *   which is the truthful statement that no resonances informed this
 *   overlay.
 *
 * Replaced by a real `analyzeScore()` call when the two named follow-ups
 * land: range/tessitura/passaggio capture in the profile, and the
 * GraysonEngine vowel resolver (the Shane↔Ilya seam).
 */

import {
	pitchToMidi,
	scoreContentId,
	type AnalyzedScore,
	type ParsedScore,
	type Pitch,
} from '@ilya/score-parser';

/** Neutral fallback for a score with no sung pitches at all. */
const MIDDLE_C: Pitch = { step: 'C', octave: 4, alter: 0 };

export function notationOnlyOverlay(parsed: ParsedScore): AnalyzedScore {
	// The score's observed extremes, from the actual Pitch objects (so no
	// midi-to-pitch respelling is invented here).
	let lowest: Pitch | null = null;
	let highest: Pitch | null = null;
	for (const ev of parsed.vocalLine) {
		if (ev.type !== 'note' || !ev.pitch) continue;
		const midi = pitchToMidi(ev.pitch);
		if (lowest === null || midi < pitchToMidi(lowest)) lowest = ev.pitch;
		if (highest === null || midi > pitchToMidi(highest)) highest = ev.pitch;
	}
	const lo = lowest ?? MIDDLE_C;
	const hi = highest ?? MIDDLE_C;

	const firstKey = parsed.keySignatures[0]?.signature;
	const firstTime = parsed.timeSignatures[0]?.signature;

	return {
		sourceScoreId: scoreContentId(parsed),
		generatedAt: new Date().toISOString(),
		calibrationSnapshot: {
			fR1: {}, // truthfully empty: no resonances informed this overlay
			range: { lowest: { ...lo }, highest: { ...hi } },
			tessitura: { low: { ...lo }, high: { ...hi } },
			passaggio: { primo: { ...lo }, secondo: { ...hi } },
			label: 'notation-only (no profile applied)',
		},
		events: {}, // the whole point: nothing analyzed, nothing marked
		global: {
			range: { lowest: { ...lo }, highest: { ...hi } },
			tessitura: { low: { ...lo }, high: { ...hi } },
			passaggio: { primo: { ...lo }, secondo: { ...hi } },
			keyFifths: firstKey?.fifths ?? 0,
			timeSignature: firstTime ? `${firstTime.beats}/${firstTime.beatType}` : '4/4',
		},
	};
}
