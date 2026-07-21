/**
 * The long-sustain test (§A.117), lifted from apps/web's watch list into the
 * pure score-parser package so the overlay engine can compute it too.
 *
 * A note is a "long sustain" when it carries a fermata, or when its sounding
 * length at the active tempo is at least `SUSTAIN_SECONDS_THRESHOLD` seconds.
 * The overlay engine reads this as one of the three gates of the `[o]→[ɑ]`
 * cover exposure predicate (`AnalyzedEvent.sustainedCeilingExposure`: close
 * timbre + at-or-above ceiling + long sustain); the watch list's own sustain
 * tier (§A.150) reads the same test. This is the single source of truth, so
 * the two cannot drift (the watch list imports it back — a de-duplication).
 *
 * SOURCED §A.117 (Dann): a sustain is `duration.fraction` × the bpm active at
 * the note ≥ 2.5 s, OR a fermata; silent (false) when neither. Pure and
 * dependency-free, so it unit-tests the way the rest of the package does.
 *
 * Tags: SOURCED (a ruling or a value), INFERENCE (derived), JUDGEMENT (a
 * build-time default, Dann rules).
 */

import type { NoteBase, TempoMarking, VocalLineEvent } from './types';

/** Sustain threshold in seconds. SOURCED §A.117 (≥ 2.5 s OR a fermata). */
export const SUSTAIN_SECONDS_THRESHOLD = 2.5;

/** Whole-note value of each note base. SOURCED: MusicXML `<type>` semantics. */
const BASE_WHOLE_NOTES: Record<NoteBase, number> = {
  breve: 2,
  whole: 1,
  half: 1 / 2,
  quarter: 1 / 4,
  eighth: 1 / 8,
  '16th': 1 / 16,
  '32nd': 1 / 32,
  '64th': 1 / 64,
  '128th': 1 / 128,
};

/** Dot multiplier: 1 dot = 1.5, 2 = 1.75, n = 2 − 2^−n. */
function dotMultiplier(dots: number): number {
  return 2 - Math.pow(2, -dots);
}

/** aPos ≤ bPos over (measureIndex, fraction), fraction by cross-multiply (types.ts). */
function positionLE(
  aMeasure: number,
  aFrac: { numerator: number; denominator: number },
  bMeasure: number,
  bFrac: { numerator: number; denominator: number },
): boolean {
  if (aMeasure !== bMeasure) return aMeasure < bMeasure;
  return aFrac.numerator * bFrac.denominator <= bFrac.numerator * aFrac.denominator;
}

/**
 * The tempo marking active AT this note: the latest marking whose position is
 * ≤ the note's own (measureIndex, rhythmicPosition). Null when no marking
 * precedes the note (then a duration-sustain cannot be asserted; only a
 * fermata flags, which is honest — no tempo was given).
 */
function activeTempoAt(tempos: TempoMarking[], ev: VocalLineEvent): TempoMarking | null {
  let best: TempoMarking | null = null;
  for (const t of tempos) {
    if (
      !positionLE(
        t.measureIndex,
        t.rhythmicPosition.fraction,
        ev.measureIndex,
        ev.rhythmicPosition.fraction,
      )
    )
      continue;
    if (
      best === null ||
      positionLE(
        best.measureIndex,
        best.rhythmicPosition.fraction,
        t.measureIndex,
        t.rhythmicPosition.fraction,
      )
    )
      best = t;
  }
  return best;
}

/** The note's sounding length in seconds, or null when no tempo is active. */
function noteSeconds(ev: VocalLineEvent, tempos: TempoMarking[]): number | null {
  const t = activeTempoAt(tempos, ev);
  if (t === null) return null;
  const beatWholeNotes = BASE_WHOLE_NOTES[t.beatUnit] * dotMultiplier(t.beatUnitDots);
  const durWholeNotes = ev.duration.fraction.numerator / ev.duration.fraction.denominator;
  const beats = durWholeNotes / beatWholeNotes;
  return beats * (60 / t.bpm);
}

/** A long sustain: a fermata, or ≥ 2.5 s by the active tempo (§A.117). */
export function isLongSustain(ev: VocalLineEvent, tempos: TempoMarking[]): boolean {
  if (ev.fermata !== undefined) return true;
  const s = noteSeconds(ev, tempos);
  return s !== null && s >= SUSTAIN_SECONDS_THRESHOLD;
}
