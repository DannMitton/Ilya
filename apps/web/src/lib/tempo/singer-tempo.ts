/**
 * singer-tempo.ts — the singer's tempo, put on a score and read back off it.
 *
 * ROW 48 (2026-10-15). `withSingerTempo` copies the stored choice onto the
 * score the panes hand down (`ParsedScore.singerTempo`), where `resolveTempo`
 * reads it as the override that tops every other source. Every derived copy of
 * a score spreads its parent, so phonation time, the cycle dose, the held-note
 * flags, and the comments follow with no argument threaded through each call.
 *
 * Pure, and none of it holds state: the choice is stored on the song
 * (`SongRecord.tempo`) and the estimate is derived, never stored.
 */
import {
	dominantTimeSignature,
	estimateBeat,
	feltBeatInWholes,
	type NoteBase,
	type ParsedScore,
	type TempoResolution,
} from '@ilya/score-parser';
import type { TempoChoice } from '$lib/library/types';

/** The score with the singer's tempo on it, or the score itself where they set none. */
export function withSingerTempo(score: ParsedScore, choice: TempoChoice | null | undefined): ParsedScore;
export function withSingerTempo(score: ParsedScore | null, choice: TempoChoice | null | undefined): ParsedScore | null;
export function withSingerTempo(score: ParsedScore | null, choice: TempoChoice | null | undefined): ParsedScore | null {
	if (!score || !choice) return score;
	return { ...score, singerTempo: { bpm: choice.bpm, beatUnit: choice.beatUnit, beatUnitDots: choice.beatUnitDots } };
}

/** Where the tempo in force came from, in the receipt's three words. A printed WORD counts as printed. */
export type TempoSource = 'printed' | 'estimated' | 'yours';

export function tempoSource(r: Pick<TempoResolution, 'provenance'>): TempoSource {
	return r.provenance === 'user' ? 'yours' : r.provenance === 'estimated' ? 'estimated' : 'printed';
}

export interface Beat {
	unit: NoteBase;
	dots: number;
}

/**
 * The same speed counted in another beat: `♩. = 60` is `♪ = 180`. Rounded to a
 * whole number, because a figure a singer cannot dial straight into a
 * metronome fails at its one job (Dann, 2026-07-31).
 */
export function convertBpm(bpm: number, from: Beat, to: Beat): number {
	const a = feltBeatInWholes(from);
	const b = feltBeatInWholes(to);
	return Math.round((bpm * a.numerator * b.denominator) / (a.denominator * b.numerator));
}

/**
 * The chips: the metre's felt beat and its second reading, in that order, and
 * the same order whichever is active, so a tap marks a chip and never moves it.
 * A 3/8 song shows the dotted quarter and the eighth; a 4/4 song the quarter
 * and the eighth. A beat in force that is neither (a printed mark in a beat of
 * its own) is shown first, since it is where the singer is.
 */
export function beatChips(score: ParsedScore, current: Beat): Beat[] {
	const estimate = estimateBeat(dominantTimeSignature(score));
	const readings: Beat[] = [
		{ unit: estimate.unit, dots: estimate.dots },
		{ unit: estimate.alternative.unit, dots: estimate.alternative.dots },
	];
	const known = readings.some((b) => b.unit === current.unit && b.dots === current.dots);
	return known ? readings : [{ unit: current.unit, dots: current.dots }, ...readings];
}

/** The bounds the control keeps a typed or stepped value inside. JUDGEMENT: wide enough for any metronome. */
export const BPM_MIN = 10;
export const BPM_MAX = 500;
export const clampBpm = (n: number): number => Math.min(BPM_MAX, Math.max(BPM_MIN, Math.round(n)));
