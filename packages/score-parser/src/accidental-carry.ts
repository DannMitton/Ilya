/**
 * The accidental rule and its carry (N.102, N.103), and, from N.192, the key in
 * force at each bar.
 *
 * MOVED OUT OF `staff-renderer.ts` (which is at its ratchet ceiling) so that the
 * key-change drawing could be added without raising it. `staff-renderer.ts`
 * re-exports every name here, so the package's surface is unchanged. The code
 * moved as it was, except for the key: where the renderer once read one
 * `keySignatures[0]` for the whole piece, the carry now takes the key of each
 * bar from the measure's own snapshot (`Measure.keySignature`), as
 * `meterDeclaredAt` does for the meter, because `sliceScore` keeps only a
 * system's first key.
 */
import type { ParsedScore, Pitch } from './types';
import { graceGroupsOf } from './grace-draw';

/**
 * The key signature's fifths at a bar, from the measure's own snapshot, else
 * the score's first key, else `fallback`.
 */
export function keyInForce(parsed: ParsedScore, measureIndex: number, fallback = 0): number {
  return parsed.measures[measureIndex]?.keySignature.fifths ?? parsed.keySignatures[0]?.signature.fifths ?? fallback;
}

/**
 * N.192. The key the bar AFTER `toMeasure` opens on, where it differs from the key
 * of `toMeasure`: what a system ending there must close with a courtesy signature.
 * Read from the whole score, because a slice cannot see the bar after it.
 */
export function outgoingKeyAfter(parsed: ParsedScore, toMeasure: number): number | undefined {
  const next = parsed.measures[toMeasure + 1]?.keySignature.fifths;
  const last = parsed.measures[toMeasure]?.keySignature.fifths;
  return next !== undefined && last !== undefined && next !== last ? next : undefined;
}

/**
 * N.192. The key a bar DECLARES: its own, where it differs from the bar before
 * it. Read from the per-measure snapshot because `sliceScore` drops the list. A
 * slice's first bar declares nothing (its head draws the key).
 */
export function keyDeclaredAt(parsed: ParsedScore, measureIndex: number): { from: number; to: number } | undefined {
  const here = parsed.measures[measureIndex]?.keySignature;
  const before = parsed.measures[measureIndex - 1]?.keySignature;
  if (!here || !before || here.fifths === before.fifths) return undefined;
  return { from: before.fifths, to: here.fifths };
}

// Order in which sharps / flats are added by the key signature.
export const SHARP_ORDER: Pitch['step'][] = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
export const FLAT_ORDER: Pitch['step'][] = ['B', 'E', 'A', 'D', 'G', 'C', 'F'];

/**
 * The key an accidental is carried under: step AND octave, so a B flat in one
 * octave says nothing about a B in another (r116, per
 * `brief-n102-courtesy-accidentals_r1_2026-09-02.md` §4).
 */
export function accidentalKey(p: Pitch): string {
  return `${p.step}${p.octave}`;
}

/** The alteration a key signature imposes on a given diatonic step. */
export function keySignatureAlter(step: Pitch['step'], fifths: number): number {
  if (fifths > 0 && SHARP_ORDER.slice(0, fifths).includes(step)) return 1;
  if (fifths < 0 && FLAT_ORDER.slice(0, -fifths).includes(step)) return -1;
  return 0;
}

/** What a note's accidental draws, once the two carry maps have had their say. */
export type AccidentalMark = 'none' | 'required' | 'courtesy';

/**
 * Decide what one note's accidental draws, and ADVANCE the two carry maps.
 *
 * N.102 increment 1b. This is the whole accidental rule, in one place, and it
 * exists so that the draw loop and `accidentalStateAtEndOf` cannot drift.
 * Before this the rule lived only inside the draw loop, so the paginator had no
 * way to ask what state a slice inherits without restating the rule and
 * inviting the two copies to disagree.
 *
 * IT MUTATES BOTH MAPS, exactly as the draw loop did when it owned the rule:
 * a drawn accidental of either kind puts the note's alter into `measureAcc`, so
 * the rest of the bar is governed by it, and a drawn courtesy also drops its key
 * from `prevMeasureAcc`, so a second recurrence in this bar draws nothing.
 *
 * @param pitch           the sung note's pitch
 * @param fifths          the key signature in force
 * @param measureAcc      what has been stated so far in THIS bar (mutated)
 * @param prevMeasureAcc  what stood at the end of the bar before (mutated)
 */
export function advanceAccidentalState(
  pitch: Pitch,
  fifths: number,
  measureAcc: Record<string, number>,
  prevMeasureAcc: Record<string, number>,
): AccidentalMark {
  const key = accidentalKey(pitch);
  const inEffect = key in measureAcc ? measureAcc[key] : keySignatureAlter(pitch.step, fifths);
  if (pitch.alter !== inEffect) {
    measureAcc[key] = pitch.alter;
    return 'required';
  }
  if (prevMeasureAcc[key] !== undefined && prevMeasureAcc[key] !== pitch.alter && !(key in measureAcc)) {
    measureAcc[key] = pitch.alter;
    delete prevMeasureAcc[key];
    return 'courtesy';
  }
  return 'none';
}

/**
 * The sung line's accidental state as it stands at the END of `measureIndex`,
 * keyed the way `measureAcc` keys it.
 *
 * N.102 increment 1b, and the reason it exists: `paginateScore` renders every
 * system through its own `renderAnalyzedStaff` call on a rebased slice, so a
 * slice's first measure had no idea what the measure before it stated and no
 * courtesy was ever drawn on a measure that opens a system. The paginator now
 * computes this and hands it in as `incomingAccidentals`.
 *
 * IT WALKS FROM MEASURE 0, and it has to: a courtesy drawn in one bar writes to
 * that bar's `measureAcc`, so the state at the end of any bar depends on the
 * whole chain before it. It walks through `advanceAccidentalState`, the same
 * call the draw loop makes, so the two cannot answer differently.
 *
 * AN EMPTY RESULT IS A REAL ANSWER, not a failure. A bar in which the singer
 * altered nothing ends with nothing carried, and so does a bar the singer does
 * not sing at all. `measureIndex` below zero means there is no bar before the
 * slice, which is the first system's case.
 *
 * THE KEY IN FORCE, bar by bar (N.192). The walk judges each bar against the key
 * that bar has (`keyInForce`), and nothing carries across a change of key: the
 * old key's accidentals say nothing about the new key's staff. `fifths` is the
 * fallback for a score with no per-measure snapshot.
 */
export function accidentalStateAtEndOf(
  parsed: ParsedScore,
  measureIndex: number,
  fifths: number,
): Record<string, number> {
  if (measureIndex < 0) return {};
  // N.103: the barline step is `carryIntoMeasure`, the same call the draw loop
  // and `layoutColumns` make. This function held the third copy of it.
  const carry = newAccidentalCarry(keyInForce(parsed, 0, fifths), undefined, (m) => keyInForce(parsed, m, fifths));
  const turningAcc: Record<string, number> = {};
  const graces = graceGroupsOf(parsed.graceNotes);
  for (const ev of parsed.vocalLine) {
    if (ev.measureIndex > measureIndex) break; // the vocal line is in measure order
    carryIntoMeasure(carry, turningAcc, ev.measureIndex);
    if (ev.type !== 'note' || !ev.pitch) continue;
    // N.187: a grace note is judged by the same carry, in the order it is sung, and governs the rest of the bar.
    const gg = graces.get(ev.id);
    for (const g of gg?.before ?? []) advanceAccidentalState(g.pitch, carry.fifths, carry.measureAcc, carry.prevMeasureAcc);
    advanceAccidentalState(ev.pitch, carry.fifths, carry.measureAcc, carry.prevMeasureAcc);
    for (const g of gg?.after ?? []) advanceAccidentalState(g.pitch, carry.fifths, carry.measureAcc, carry.prevMeasureAcc);
  }
  // The bar asked about carried no sung event at all, so it states nothing.
  return carry.curMeasure === measureIndex ? carry.measureAcc : {};
}

/** The sung line's accidental state, plus the key signature that governs it. */
export interface AccidentalCarry {
  fifths: number;
  /** What has been stated so far in THIS bar. Mutated by the walk. */
  measureAcc: Record<string, number>;
  /** What stood at the end of the bar before. Mutated by the walk. */
  prevMeasureAcc: Record<string, number>;
  /** The bar the carry currently stands in; -1 before the first. */
  curMeasure: number;
  /** N.192: the key in force at a bar. Where it names a different key from the carry's, the carry takes it and nothing carries across. */
  fifthsAt?: (measureIndex: number) => number;
}

/**
 * A fresh carry, seeded the way the draw loop seeds itself.
 *
 * `incoming` is NOT the first measure's own state: it is the closing state of
 * the measure before, standing in for a bar this walk never sees (N.102
 * increment 1b). The first `carryIntoMeasure` moves it into `prevMeasureAcc`
 * under the same guard every later measure gets.
 */
export function newAccidentalCarry(fifths: number, incoming?: Record<string, number>, fifthsAt?: (measureIndex: number) => number): AccidentalCarry {
  return { fifths, measureAcc: { ...(incoming ?? {}) }, prevMeasureAcc: {}, curMeasure: -1, fifthsAt };
}

/**
 * Step the carry to `measureIndex`, if it is not already there.
 *
 * The outgoing measure's state becomes the courtesy source, but only for the
 * measure that DIRECTLY follows it: a skipped index is a tacet run, and nothing
 * carries across one. The turning layer keeps its own per-measure state and
 * resets with no carry at all.
 *
 * ONE definition, called by the draw loop and by `layoutColumns`, so the
 * spacer's idea of what draws and the page's idea cannot diverge at a barline.
 */
export function carryIntoMeasure(
  carry: AccidentalCarry,
  turningAcc: Record<string, number>,
  measureIndex: number,
): void {
  if (measureIndex === carry.curMeasure) return;
  carry.prevMeasureAcc = measureIndex === carry.curMeasure + 1 ? carry.measureAcc : {};
  const keyHere = carry.fifthsAt?.(measureIndex);
  if (keyHere !== undefined && keyHere !== carry.fifths) {
    carry.fifths = keyHere;
    carry.prevMeasureAcc = {};
  }
  carry.curMeasure = measureIndex;
  carry.measureAcc = {};
  for (const k of Object.keys(turningAcc)) delete turningAcc[k];
}
