/**
 * Shane analysis model — the `AnalyzedScore` overlay.
 *
 * Source of record: `shane-analysis-model-spec_2026-07-12.md` (LOCKED with
 * Dann for the §7.2 dimensions and the forecast-not-declaration principle,
 * and Kimi for the overlay architecture). This is a separate, non-destructive
 * layer keyed by `VocalLineEvent.id`; it never mutates `ParsedScore` (the
 * ground truth). Wiping `events` and re-running the overlay engine is free.
 *
 * Founding principle (Dann, 2026-07-12): **Fit forecasts, it does not
 * declare.** Every field here is a *forecast* derived from the singer's
 * measured resonance profile applied to the score — where the timbre will
 * probably turn, where the passaggio is likely to fall — never a
 * measurement of the singer's larynx or performance. Registration in
 * particular is represented only *positionally* (`inPassaggio` + the global
 * band), because Shane measures resonance, not the laryngeal source
 * (Roubeau's M0–M3 and Herbst & Švec's register/adduction plane describe a
 * layer Shane does not observe). The M-schema is taught in the Learn
 * glossary, not asserted per note.
 */

import type { Pitch } from './types';

/**
 * A deep-copied snapshot of the singer's calibrated profile at the moment
 * an overlay is generated (Kimi: never a reference, so a later
 * recalibration cannot retroactively alter an already-analysed score).
 * This is the minimal shape the overlay engine reads; the app adapts its
 * fuller `VoiceProfile` into this.
 */
export interface VoiceProfileSnapshot {
  /**
   * Per-vowel first-resonance frequency in Hz, keyed by IPA vowel
   * (`'i'`, `'ɛ'`, `'a'`, `'o'`, `'u'`, …). The singer's measured (or
   * derived) fR1 values; the analysis reads these to place the pitch of
   * turning (an octave below fR1) and the fR1/fo crossing.
   */
  fR1: Record<string, number>;

  /** The singer's absolute range (lowest and highest singable pitch). */
  range: { lowest: Pitch; highest: Pitch };

  /** The singer's comfortable tessitura. */
  tessitura: { low: Pitch; high: Pitch };

  /**
   * The forecast zona di passaggio band: the primo and secondo passaggio
   * pitches for this voice (from voice-type norms and the profile). A
   * forecast, not a measured boundary.
   */
  passaggio: { primo: Pitch; secondo: Pitch };

  /** Optional label carried through for the citation block (e.g. voice type). */
  label?: string;
}

/** The non-destructive analysis overlay for one parsed score. */
export interface AnalyzedScore {
  /** Content-addressable id of the `ParsedScore` this analyses (stale-detect + cache). */
  sourceScoreId: string;

  /** ISO 8601 timestamp of generation. */
  generatedAt: string;

  /** Deep copy of the profile at generation time. */
  calibrationSnapshot: VoiceProfileSnapshot;

  /** Per-event analysis, keyed by `VocalLineEvent.id`. Rests and vowel-less notes are omitted. */
  events: Record<string, AnalyzedEvent>;

  /** Song-level context. */
  global: AnalyzedGlobal;
}

export interface AnalyzedGlobal {
  /** The song's demands: its lowest and highest sung pitch. */
  range: { lowest: Pitch; highest: Pitch };

  /** Where the melody mostly sits (a percentile band of the sung pitches). */
  tessitura: { low: Pitch; high: Pitch };

  /** The singer's forecast passaggio band, carried from the profile for overlay display. */
  passaggio: { primo: Pitch; secondo: Pitch };

  /** Fifths of the initial key signature (from ParsedScore). */
  keyFifths: number;

  /** Initial time signature, `beats/beatType` (e.g. `'3/4'`). */
  timeSignature: string;
}

/**
 * Per-note forecast. Every field is derived from the profile applied to the
 * score; none is a measurement of the singer.
 */
export interface AnalyzedEvent {
  /** Matches `VocalLineEvent.id`. */
  eventId: string;

  // ── Acoustic marks (Mitton 2020 Appendix B; from fR1) ──
  /** Likely timbre: `'open'` below the turning pitch, `'close'` above. Stem down = open, up = close. */
  timbre: 'open' | 'close';

  /** The pitch of turning between open and close for this note's vowel: an octave below fR1. Grey stemless notehead. */
  turningPitch: Pitch;

  /** A forecast fR1/fo crossing (the sung fundamental sits within a semitone of fR1). Red squircle. */
  crossing: boolean;

  // ── Diction mark (Grayson; Dann's '#') ──
  /**
   * Intentional legato interruption on the first note of the pair, for
   * emphasis or comprehension. Interpretive and user-editable; the overlay
   * engine defaults it to `false` and the diction layer / correction UI
   * sets it. Not derived from fR1.
   */
  phonationBreak: boolean;

  // ── Position relative to the singer's voice (forecast) ──
  /** The note's pitch falls within the forecast zona di passaggio band. */
  inPassaggio: boolean;

  /** Where the note sits relative to the singer's tessitura and absolute range. */
  rangeStatus: 'in-tessitura' | 'in-range' | 'out-of-range';

  // ── Diction target + advice ──
  /** The operative sung vowel (IPA), from Ilya via the vowel resolver. */
  vowel: string;

  /** Cover / vowel-migration advice, with a source. Populated by the analysis-application layer, not the overlay engine. */
  vowelModification?: { text: string; citation: string };

  // ── Provenance ──
  /** User corrections overlay the forecast; a non-empty array raises the "user-corrected" tier. */
  userCorrections?: UserCorrection[];
}

export interface UserCorrection {
  field: 'timbre' | 'turningPitch' | 'crossing' | 'phonationBreak' | 'vowel' | 'syllableAssignment';
  originalValue: unknown;
  correctedValue: unknown;
  correctedAt: string;
  correctedBy: 'user';
}
