/**
 * The analytical overlay engine.
 *
 * `analyzeScore(parsed, profile, vowelForEvent)` walks a `ParsedScore` and
 * produces the non-destructive `AnalyzedScore` overlay per the LOCKED §7.2
 * spec (`shane-analysis-model-spec_2026-07-12.md`). It is a **pure**
 * function: no DOM, no app state, deterministic, and sandbox-testable, so
 * it can be exercised the same way the parsers are.
 *
 * Founding principle: **Fit forecasts, it does not declare.** Every value
 * is a forecast from the singer's measured resonances applied to the score,
 * never a claim about the larynx. Registration is positional only
 * (`inPassaggio` + the global band); no per-note mechanism is asserted.
 *
 * The acoustic core, grounded in Mitton (2020) §5.3.3 and the Appendix B
 * legend:
 *   - **turning pitch** = an octave below the singer's fR1 for the note's
 *     vowel (the sung pitch at which 2·fo reaches fR1). Bozeman's vowel
 *     migration turns here.
 *   - **timbre** = `'open'` when the sung pitch is below the turning pitch
 *     (2·fo < fR1), `'close'` when above.
 *   - **crossing** = the sung fundamental fo sits within a semitone of fR1
 *     itself (rare for the low male voice, routine for treble voices).
 *   - **aboveFirstResonance** = fo sits above fR1 (fo > fR1), the whoop side
 *     of the crossing. Distinct from `timbre` (which turns an octave lower, at
 *     2·fo = fR1) and from `crossing` (the semitone band at fR1). Content-free;
 *     the advice resolver reads it to tell the whoop regime from the
 *     turned-over-but-below-crossing regime (§A.190).
 *
 * The Shane↔Ilya seam: the operative sung vowel per event is supplied by
 * the caller through `vowelForEvent` (app-side, Ilya's `processText`
 * resolves each syllable, carrying the sustained vowel across melisma
 * notes). Tests pass a stub resolver. A note with no resolvable vowel, and
 * every rest, is omitted from the overlay (the acoustic marks need fR1,
 * which needs the vowel).
 */

import type { ParsedScore, Pitch, VocalLineEvent } from './types';
import type {
  AnalyzedEvent,
  AnalyzedGlobal,
  AnalyzedScore,
  VoiceProfileSnapshot,
} from './analysis-types';
import { isLongSustain } from './sustain';

/** Resolves the operative sung vowel (IPA) for an event, or undefined if none applies. */
export type VowelResolver = (event: VocalLineEvent) => string | undefined;

// ── Pitch ↔ frequency ──────────────────────────────────────────────

/**
 * Semitone of each letter above C. Exported inside the package (not from
 * `index.ts`) so the spelling policy in `transposition.ts` reads the same
 * table this file's `pitchToMidi` reads, rather than keeping a second copy.
 */
export const STEP_SEMITONE: Record<Pitch['step'], number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
// Chromatic spelling for a synthesised pitch (turning pitch): naturals and sharps.
const SEMITONE_SPELLING: Array<{ step: Pitch['step']; alter: number }> = [
  { step: 'C', alter: 0 }, { step: 'C', alter: 1 }, { step: 'D', alter: 0 }, { step: 'D', alter: 1 },
  { step: 'E', alter: 0 }, { step: 'F', alter: 0 }, { step: 'F', alter: 1 }, { step: 'G', alter: 0 },
  { step: 'G', alter: 1 }, { step: 'A', alter: 0 }, { step: 'A', alter: 1 }, { step: 'B', alter: 0 },
];

/** MIDI note number for a pitch (middle C = C4 = 60). */
export function pitchToMidi(p: Pitch): number {
  return (p.octave + 1) * 12 + STEP_SEMITONE[p.step] + p.alter;
}

/** Frequency in Hz for a pitch (A4 = 440). */
export function pitchToHz(p: Pitch): number {
  return 440 * 2 ** ((pitchToMidi(p) - 69) / 12);
}

/** The nearest musical pitch to a frequency, spelled with naturals and sharps. */
export function hzToPitch(hz: number): Pitch {
  const midi = Math.round(69 + 12 * Math.log2(hz / 440));
  const octave = Math.floor(midi / 12) - 1;
  const spelling = SEMITONE_SPELLING[((midi % 12) + 12) % 12];
  return { step: spelling.step, octave, alter: spelling.alter };
}

/** Signed interval in cents from `a` to `b` (positive when b is higher). */
export function centsBetween(aHz: number, bHz: number): number {
  return 1200 * Math.log2(bHz / aHz);
}

// ── Percentile helper (for the song's tessitura band) ──────────────

function percentilePitch(sortedMidi: number[], p: number): number {
  if (sortedMidi.length === 0) return 0;
  const idx = Math.min(sortedMidi.length - 1, Math.max(0, Math.round((p / 100) * (sortedMidi.length - 1))));
  return sortedMidi[idx];
}

function midiToPitch(midi: number): Pitch {
  const octave = Math.floor(midi / 12) - 1;
  const spelling = SEMITONE_SPELLING[((midi % 12) + 12) % 12];
  return { step: spelling.step, octave, alter: spelling.alter };
}

// ── Content-addressable id (deterministic; for cache + stale-detect) ─

/**
 * FNV-1a 32-bit hash over a canonical serialisation of the vocal line
 * (ids, pitches, durations). Deterministic and dependency-free; sufficient
 * for overlay caching and detecting when the ground truth changed. Not a
 * cryptographic digest.
 */
export function scoreContentId(parsed: ParsedScore): string {
  let h = 0x811c9dc5;
  const feed = (s: string) => {
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
  };
  feed(parsed.vocalPart.partId);
  for (const e of parsed.vocalLine) {
    feed(e.id);
    feed(e.type);
    if (e.pitch) feed(`${e.pitch.step}${e.pitch.alter}/${e.pitch.octave}`);
    feed(`${e.duration.fraction.numerator}/${e.duration.fraction.denominator}`);
    if (e.syllable) feed(e.syllable.text);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

// ── The engine ─────────────────────────────────────────────────────

const CROSSING_TOLERANCE_CENTS = 50; // within a semitone of fR1 counts as a crossing
const RANGE_EPSILON_CENTS = 1; // guard against float noise at the boundaries

export interface AnalyzeOptions {
  /** ISO timestamp override (tests pin this for determinism). Defaults to now. */
  generatedAt?: string;
}

export function analyzeScore(
  parsed: ParsedScore,
  profile: VoiceProfileSnapshot,
  vowelForEvent: VowelResolver,
  options: AnalyzeOptions = {},
): AnalyzedScore {
  // Each pair derived only when its dimension is present. Absence here is
  // what makes `rangeStatus` and `inPassaggio` genuinely absent below,
  // rather than defaulted to a negative finding (Dann, 2026-07-15, Option A).
  const rangeLowHz = profile.range ? pitchToHz(profile.range.lowest) : undefined;
  const rangeHighHz = profile.range ? pitchToHz(profile.range.highest) : undefined;
  const tessLowHz = profile.tessitura ? pitchToHz(profile.tessitura.low) : undefined;
  const tessHighHz = profile.tessitura ? pitchToHz(profile.tessitura.high) : undefined;
  const primoHz = profile.passaggio ? pitchToHz(profile.passaggio.primo) : undefined;
  const secondoHz = profile.passaggio ? pitchToHz(profile.passaggio.secondo) : undefined;

  const events: Record<string, AnalyzedEvent> = {};
  const sungMidis: number[] = [];

  for (const ev of parsed.vocalLine) {
    if (ev.type !== 'note' || !ev.pitch) continue;
    const pitchHz = pitchToHz(ev.pitch);
    sungMidis.push(pitchToMidi(ev.pitch));

    const vowel = vowelForEvent(ev);
    if (vowel === undefined) continue; // no operative vowel → no acoustic forecast
    const fR1 = profile.fR1[vowel];
    if (typeof fR1 !== 'number' || fR1 <= 0) continue; // no fR1 for this vowel in the profile

    // Turning pitch: an octave below fR1 (where 2·fo reaches fR1).
    const turningHz = fR1 / 2;
    const timbre: 'open' | 'close' = pitchHz < turningHz ? 'open' : 'close';

    // Crossing: fo within a semitone of fR1 itself.
    const crossing = Math.abs(centsBetween(pitchHz, fR1)) <= CROSSING_TOLERANCE_CENTS;

    // Ladder fact: fo above fR1 (the whoop side of the crossing). Content-free
    // (§A.190). The advice resolver reads it to separate the whoop regime (open
    // and let fR1 track fo) from the turned-over-but-below-crossing regime (the
    // male turnover case). Its exact boundary is unshared with the crossing
    // cases, which own the ±semitone band via `crossing`.
    const aboveFirstResonance = pitchHz > fR1;

    // Positional facts. Undefined means not assessed: the profile carried no
    // passaggio or no range, so no claim, positive or negative, is made.
    const inPassaggio =
      primoHz !== undefined && secondoHz !== undefined
        ? pitchHz >= primoHz - 1e-6 && pitchHz <= secondoHz + 1e-6
        : undefined;

    let rangeStatus: AnalyzedEvent['rangeStatus'];
    if (rangeLowHz === undefined || rangeHighHz === undefined) {
      rangeStatus = undefined; // no range: nothing to assess
    } else if (
      centsBetween(rangeLowHz, pitchHz) < -RANGE_EPSILON_CENTS ||
      centsBetween(rangeHighHz, pitchHz) > RANGE_EPSILON_CENTS
    ) {
      rangeStatus = 'out-of-range';
    } else if (
      tessLowHz !== undefined &&
      tessHighHz !== undefined &&
      centsBetween(tessLowHz, pitchHz) >= -RANGE_EPSILON_CENTS &&
      centsBetween(tessHighHz, pitchHz) <= RANGE_EPSILON_CENTS
    ) {
      rangeStatus = 'in-tessitura';
    } else {
      rangeStatus = 'in-range';
    }

    // The three-gate exposure forecast for the [o]→[ɑ] cover trigger (§A.179,
    // Option B): (1) close timbre, (2) at or above the singer's declared
    // ceiling, and (3) a long sustain (§A.117). Content-free — no vowel, no
    // advice; the resolver ANDs `vowel === 'o'` and ships the sourced target.
    // Gate (2) is at-or-above, NOT the strict-above `rangeStatus ===
    // 'out-of-range'`: the documented exemplar sits exactly AT Mitton's E4
    // ceiling (§A.180). Undefined when no ceiling was declared, so the gate is
    // unassessable (Option A), matching `rangeStatus`/`inPassaggio` above.
    let sustainedCeilingExposure: boolean | undefined;
    if (rangeHighHz === undefined) {
      sustainedCeilingExposure = undefined;
    } else {
      const atOrAboveCeiling = centsBetween(rangeHighHz, pitchHz) >= -RANGE_EPSILON_CENTS;
      sustainedCeilingExposure =
        timbre === 'close' && atOrAboveCeiling && isLongSustain(ev, parsed.tempoMarkings);
    }

    events[ev.id] = {
      eventId: ev.id,
      timbre,
      turningPitch: hzToPitch(turningHz),
      crossing,
      aboveFirstResonance,
      phonationBreak: false, // set by the diction layer / correction UI
      ...(inPassaggio !== undefined ? { inPassaggio } : {}),
      ...(rangeStatus !== undefined ? { rangeStatus } : {}),
      ...(sustainedCeilingExposure !== undefined ? { sustainedCeilingExposure } : {}),
      vowel,
    };
  }

  const global = buildGlobal(parsed, profile, sungMidis);

  return {
    sourceScoreId: scoreContentId(parsed),
    generatedAt: options.generatedAt ?? new Date().toISOString(),
    calibrationSnapshot: deepCopyProfile(profile),
    events,
    global,
  };
}

function buildGlobal(parsed: ParsedScore, profile: VoiceProfileSnapshot, sungMidis: number[]): AnalyzedGlobal {
  const sorted = [...sungMidis].sort((a, b) => a - b);
  const lowestMidi = sorted[0] ?? 60;
  const highestMidi = sorted[sorted.length - 1] ?? 60;
  // Tessitura: the central band where the melody mostly sits (15th–85th percentile).
  const tessLowMidi = percentilePitch(sorted, 15);
  const tessHighMidi = percentilePitch(sorted, 85);

  const firstTime = parsed.timeSignatures[0]?.signature;
  const firstKey = parsed.keySignatures[0]?.signature;

  return {
    range: { lowest: midiToPitch(lowestMidi), highest: midiToPitch(highestMidi) },
    tessitura: { low: midiToPitch(tessLowMidi), high: midiToPitch(tessHighMidi) },
    ...(profile.passaggio
      ? { passaggio: { primo: { ...profile.passaggio.primo }, secondo: { ...profile.passaggio.secondo } } }
      : {}),
    keyFifths: firstKey?.fifths ?? 0,
    timeSignature: firstTime ? `${firstTime.beats}/${firstTime.beatType}` : '4/4',
  };
}

/** Deep copy so a later recalibration cannot alter an already-generated overlay (Kimi). */
function deepCopyProfile(p: VoiceProfileSnapshot): VoiceProfileSnapshot {
  return {
    fR1: { ...p.fR1 },
    ...(p.fR2 ? { fR2: { ...p.fR2 } } : {}),
    ...(p.range ? { range: { lowest: { ...p.range.lowest }, highest: { ...p.range.highest } } } : {}),
    ...(p.tessitura ? { tessitura: { low: { ...p.tessitura.low }, high: { ...p.tessitura.high } } } : {}),
    ...(p.passaggio
      ? { passaggio: { primo: { ...p.passaggio.primo }, secondo: { ...p.passaggio.secondo } } }
      : {}),
    ...(p.label !== undefined ? { label: p.label } : {}),
  };
}
