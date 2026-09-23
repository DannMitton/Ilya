/**
 * Per-note conditions: one record per sung note, for the N.168 frequency run.
 *
 * `noteConditions(parsed, profile, analyzed, options)` walks a `ParsedScore`
 * in vocal-line order and returns, for every pitched note, what the overlay
 * engine already forecasts about it plus five dimensions the engine does not
 * compute (condition map, `condition-map_r1.md`, "NOT YET COMPUTED"):
 *
 *   1. the harmonic rung n·fo against fR1, n in {3, 4, 5}: the micro-turnings
 *      of the ladder (Dann, 2026-07-20, `fit-acoustic-framework` §1). n = 2 is
 *      the existing turn and n = 1 the crossing, both already carried by the
 *      overlay, so neither is repeated here;
 *   2. the harmonic rung n·fo against fR2, n from 1 to `FR2_MAX_HARMONIC`,
 *      only where the profile carries fR2 for the vowel;
 *   3. the approach: semitones from the previous sung note;
 *   4. the phrase: its index, its length, and the note's place in it;
 *   5. the note's position in the piece, as cumulative phonation time.
 *
 * It ADDS. It changes no existing type and no existing output, and nothing in
 * the app reads it yet (brief `brief-code-n168-frequency-run_r1_2026-09-23.md`,
 * Part 1). Pure and deterministic, like the overlay engine it sits beside.
 *
 * Absence means not assessed, never a negative finding, exactly as
 * `analyzeScore` treats `inPassaggio` and `rangeStatus`: a rung is `undefined`
 * where the vowel or its resonance is unknown, and `null` where it was
 * assessed and no harmonic landed.
 *
 * Tags: SOURCED (a ruling or a value), INFERENCE (derived), JUDGEMENT (a
 * build-time default, Dann rules).
 */

import type { Fraction, ParsedScore, VocalLineEvent } from './types';
import type { AnalyzedEvent, VoiceProfileSnapshot } from './analysis-types';
import { CROSSING_TOLERANCE_CENTS, centsBetween, pitchToHz, pitchToMidi } from './overlay-engine';
import {
  aggregatePhonation,
  fractionToNumber,
  normalizeFraction,
  secondsFor,
  soundingFromFraction,
  soundingFromNotation,
} from './phonation';
import { resolveTempo, type ResolveTempoOptions } from './tempo-seam';
import { isLongSustain, SUSTAIN_SECONDS_THRESHOLD } from './sustain';

/** The micro-turnings: n·fo meeting fR1. SOURCED, Dann 2026-07-20 (the ladder). */
export const FR1_RUNGS = [3, 4, 5] as const;

/** Highest harmonic tested against fR2. JUDGEMENT (desk default in the N.168 brief). */
export const FR2_MAX_HARMONIC = 8;

/** The four fR1 bands of the condition map. `crossing` owns the 50 cents above fR1. */
export type FR1Band = 'open' | 'close' | 'crossing' | 'above';

/**
 * How the note is reached. `tie` is a tied continuation: the same pitch, not
 * re-attacked, so counting it as `repeated` would overstate repeated notes.
 * JUDGEMENT.
 */
export type ApproachBand = 'repeated' | 'step' | 'leap-up' | 'leap-down' | 'tie';

export type PhrasePosition = 'first' | 'middle' | 'last' | 'only';

/**
 * What ended a phrase. A rest; a silence, meaning a stretch of the vocal line
 * with no event at all, usually an empty interlude bar that carries no rest
 * (JUDGEMENT: silence is a rest the file did not write down); a breath mark;
 * a caesura; or the end of the line.
 */
export type PhraseBoundary = 'rest' | 'silence' | 'breath-mark' | 'caesura' | 'end';

/** The tempo the seconds were computed from. */
export type TempoState = 'stated' | 'inferred' | 'none';

export interface NoteCondition {
  eventId: string;
  /** Index among the sung notes, in the order of the score passed. */
  order: number;
  measureIndex: number;
  midi: number;
  /** The operative sung vowel, from the overlay, else from `vowelForEvent`. */
  vowel?: string;

  // ── Carried from the overlay engine. Absent where the overlay omitted the note.
  fR1Band?: FR1Band;
  inPassaggio?: boolean;
  rangeStatus?: AnalyzedEvent['rangeStatus'];
  sustainedCeilingExposure?: boolean;

  /**
   * Held (a long sustain) or short, read over the whole tie chain the note
   * belongs to. See `heldBasis` for which test decided it.
   */
  held: boolean;
  /**
   * `isLongSustain` where the score states a metronome mark, which is the
   * overlay's own test. `inferred-tempo` where the tempo was read from a word:
   * `isLongSustain` sees only metronome marks and would flag fermatas alone, so
   * the same §A.117 threshold is applied to the seconds below. `fermata-only`
   * where the score has no tempo at all. JUDGEMENT.
   */
  heldBasis: 'is-long-sustain' | 'inferred-tempo' | 'fermata-only';

  // ── The five new dimensions.
  /** n in {3, 4, 5} with n·fo within 50 cents of fR1; `null` none; `undefined` not assessed. */
  fR1Rung?: number | null;
  /** n in 1..8 with n·fo within 50 cents of fR2; `null` none; `undefined` not assessed. */
  fR2Rung?: number | null;
  /** Absent on the first sung note of the line. `afterRest` is true after a rest or a silence. */
  approach?: { semitones: number; band: ApproachBand; afterRest: boolean };
  phrase: {
    index: number;
    position: PhrasePosition;
    quavers: number;
    /** Absent when the score has no tempo. */
    seconds?: number;
  };

  /** Sounding length of this event, in quaver-equivalents. */
  quavers: number;
  /** Sounding length in seconds. Absent when the score has no tempo. */
  seconds?: number;
  /** Phonation before this note's onset, in quaver-equivalents. */
  onsetPhonationQuavers: number;
  /** Phonation before this note's onset, in seconds. Absent when no tempo. */
  onsetPhonationSeconds?: number;
}

export interface NoteConditionsResult {
  notes: NoteCondition[];
  tempo: TempoState;
  /** How many phrase boundaries each kind supplied. A mark on a note before a rest counts under both. */
  boundaryCounts: Record<PhraseBoundary, number>;
}

export interface NoteConditionsOptions {
  /** Supplies the vowel where the overlay omitted a note (no fR1 for its vowel). */
  vowelForEvent?: (event: VocalLineEvent) => string | undefined;
  /** Threaded to every tempo-consuming call, as `score-metrics.ts` does. */
  tempo?: ResolveTempoOptions;
  /**
   * The score whose bars arbitrate each note's sounding length. Pass the
   * NOTATED score when `parsed` is in performance order: a repeated bar there
   * appears twice and would sum to twice its metre. Defaults to `parsed`.
   */
  barsFrom?: ParsedScore;
}

const QUAVERS_PER_WHOLE = 8;

function rung(foHz: number, targetHz: number | undefined, ns: readonly number[]): number | null | undefined {
  if (typeof targetHz !== 'number' || !(targetHz > 0)) return undefined;
  for (const n of ns) {
    if (Math.abs(centsBetween(n * foHz, targetHz)) <= CROSSING_TOLERANCE_CENTS) return n;
  }
  return null;
}

function fr1Band(a: AnalyzedEvent): FR1Band {
  if (a.crossing) return 'crossing';
  if (a.aboveFirstResonance) return 'above';
  return a.timbre === 'open' ? 'open' : 'close';
}

function approachBand(semitones: number): Exclude<ApproachBand, 'tie'> {
  const size = Math.abs(semitones);
  if (size === 0) return 'repeated';
  if (size <= 2) return 'step';
  return semitones > 0 ? 'leap-up' : 'leap-down';
}

const endsPhraseByMark = (ev: VocalLineEvent): PhraseBoundary[] =>
  (ev.articulations ?? []).filter((a): a is 'breath-mark' | 'caesura' => a === 'breath-mark' || a === 'caesura');

export function noteConditions(
  parsed: ParsedScore,
  profile: VoiceProfileSnapshot,
  analyzed: Record<string, AnalyzedEvent>,
  options: NoteConditionsOptions = {},
): NoteConditionsResult {
  const tempoOptions = options.tempo ?? {};
  const resolution = resolveTempo(parsed, tempoOptions);
  const tempo: TempoState = !resolution ? 'none' : resolution.provenance === 'inferred' ? 'inferred' : 'stated';

  // Each bar's sounding length is read the way `aggregatePhonation` chose.
  const chosen = new Map<number, 'notation' | 'fraction'>();
  for (const bar of aggregatePhonation(options.barsFrom ?? parsed).trust.bars) {
    chosen.set(bar.measureIndex, bar.verdict === 'metre-chose-fraction' ? 'fraction' : 'notation');
  }
  const wholesOf = (ev: VocalLineEvent): Fraction =>
    (chosen.get(ev.measureIndex) === 'fraction' ? soundingFromFraction : soundingFromNotation)(ev.duration);

  // Seconds by `secondsFor`'s arithmetic. An inferred tempo's band gives the
  // midpoint of the band (brief, "The weighting").
  const secondsOfWholes = (wholes: Fraction): number | undefined => {
    const quavers = normalizeFraction({ numerator: wholes.numerator * QUAVERS_PER_WHOLE, denominator: wholes.denominator });
    const s = secondsFor(quavers, parsed, tempoOptions);
    if (!s) return undefined;
    return s.secondsRange ? (s.secondsRange[0] + s.secondsRange[1]) / 2 : s.seconds;
  };

  // Where each bar starts on the notated timeline, so a silence can be seen.
  const barLength = new Map<number, { wholes: number; pickup: boolean }>();
  parsed.measures.forEach((m, i) => {
    const e = m.expectedDuration;
    barLength.set(Number.isInteger(m.index) ? m.index : i, {
      wholes: e && e.denominator ? e.numerator / e.denominator : NaN,
      pickup: m.isPickup === true,
    });
  });
  const EPS = 1e-9;
  const onsetOf = (ev: VocalLineEvent) => ev.rhythmicPosition.fraction.numerator / ev.rhythmicPosition.fraction.denominator;
  /** True when the line falls silent between `a` and the event after it, `b`. */
  const silenceBetween = (a: VocalLineEvent, b: VocalLineEvent): boolean => {
    const aEnd = onsetOf(a) + fractionToNumber(wholesOf(a));
    if (b.measureIndex === a.measureIndex) return onsetOf(b) > aEnd + EPS;
    // A backward jump is performance order repeating a bar, not a silence.
    if (b.measureIndex < a.measureIndex) return false;
    if (b.measureIndex > a.measureIndex + 1) return true; // a whole bar with no event
    if (onsetOf(b) > EPS) return true;
    const bar = barLength.get(a.measureIndex);
    return bar !== undefined && !bar.pickup && Number.isFinite(bar.wholes) && aEnd < bar.wholes - EPS;
  };

  // ── Pass 1: sung notes, with the rests, silences, and marks that separate them.
  interface Sung {
    ev: VocalLineEvent;
    midi: number;
    wholes: Fraction;
    afterRest: boolean;
    tieContinuation: boolean;
    /** The boundaries that end the phrase AFTER this note. Empty inside a phrase. */
    endsWith: PhraseBoundary[];
  }
  const sung: Sung[] = [];
  let restSincePrevious = false;
  let previousEvent: VocalLineEvent | undefined;
  for (const ev of parsed.vocalLine) {
    const silent = previousEvent !== undefined && silenceBetween(previousEvent, ev);
    previousEvent = ev;
    if (silent) {
      restSincePrevious = true;
      if (sung.length > 0) {
        const last = sung[sung.length - 1];
        if (!last.endsWith.includes('silence')) last.endsWith.push('silence');
      }
    }
    if (ev.type === 'rest') {
      restSincePrevious = true;
      if (sung.length > 0) {
        const last = sung[sung.length - 1];
        if (!last.endsWith.includes('rest')) last.endsWith.push('rest');
      }
      continue;
    }
    if (!ev.pitch) continue;
    const midi = pitchToMidi(ev.pitch);
    const prev = sung[sung.length - 1];
    const tieContinuation =
      prev !== undefined &&
      !restSincePrevious &&
      (ev.tied?.type === 'stop' || ev.tied?.type === 'continue') &&
      prev.midi === midi;
    sung.push({
      ev,
      midi,
      wholes: wholesOf(ev),
      afterRest: restSincePrevious && prev !== undefined,
      tieContinuation,
      endsWith: endsPhraseByMark(ev),
    });
    restSincePrevious = false;
  }
  if (sung.length > 0) {
    const last = sung[sung.length - 1];
    if (last.endsWith.length === 0) last.endsWith.push('end');
  }

  const boundaryCounts: Record<PhraseBoundary, number> = { rest: 0, silence: 0, 'breath-mark': 0, caesura: 0, end: 0 };
  for (const s of sung) for (const b of s.endsWith) boundaryCounts[b] += 1;

  // ── Pass 2: tie chains, so held is read over the whole sustained note.
  const chainOf: number[] = [];
  let chainStart = 0;
  sung.forEach((s, i) => {
    if (!s.tieContinuation) chainStart = i;
    chainOf[i] = chainStart;
  });
  const heldByChain = new Map<number, { held: boolean; basis: NoteCondition['heldBasis'] }>();
  for (let start = 0; start < sung.length; ) {
    let end = start;
    while (end + 1 < sung.length && chainOf[end + 1] === start) end++;
    const members = sung.slice(start, end + 1);
    let fraction: Fraction = { numerator: 0, denominator: 1 };
    let wholes: Fraction = { numerator: 0, denominator: 1 };
    for (const m of members) {
      const f = m.ev.duration.fraction;
      fraction = normalizeFraction({
        numerator: fraction.numerator * f.denominator + f.numerator * fraction.denominator,
        denominator: fraction.denominator * f.denominator,
      });
      wholes = normalizeFraction({
        numerator: wholes.numerator * m.wholes.denominator + m.wholes.numerator * wholes.denominator,
        denominator: wholes.denominator * m.wholes.denominator,
      });
    }
    const fermata = members.some((m) => m.ev.fermata !== undefined);
    const head = members[0].ev;
    let held: boolean;
    let basis: NoteCondition['heldBasis'];
    if (tempo === 'stated') {
      // The overlay's own test, over one event spanning the chain.
      const spanning: VocalLineEvent = {
        ...head,
        duration: { ...head.duration, fraction },
        ...(fermata && !head.fermata ? { fermata: members.find((m) => m.ev.fermata)!.ev.fermata } : {}),
      };
      held = isLongSustain(spanning, parsed.tempoMarkings);
      basis = 'is-long-sustain';
    } else if (tempo === 'inferred') {
      const s = secondsOfWholes(wholes);
      held = fermata || (s !== undefined && s >= SUSTAIN_SECONDS_THRESHOLD);
      basis = 'inferred-tempo';
    } else {
      held = fermata;
      basis = 'fermata-only';
    }
    heldByChain.set(start, { held, basis });
    start = end + 1;
  }

  // ── Pass 3: phrases.
  const phraseOf: number[] = [];
  let phrase = 0;
  sung.forEach((s, i) => {
    phraseOf[i] = phrase;
    if (s.endsWith.length > 0) phrase++;
  });
  const phraseQuavers = new Map<number, number>();
  const phraseSeconds = new Map<number, number>();
  const phraseSize = new Map<number, number>();

  // ── Pass 4: the records.
  const notes: NoteCondition[] = [];
  let onsetQuavers = 0;
  let onsetSeconds = 0;
  sung.forEach((s, i) => {
    const a = analyzed[s.ev.id];
    const vowel = a?.vowel ?? options.vowelForEvent?.(s.ev);
    const fo = pitchToHz(s.ev.pitch!);
    const quavers = fractionToNumber(s.wholes) * QUAVERS_PER_WHOLE;
    const seconds = secondsOfWholes(s.wholes);
    const prev = sung[i - 1];
    const { held, basis } = heldByChain.get(chainOf[i])!;

    const fR1Rung = vowel !== undefined ? rung(fo, profile.fR1[vowel], FR1_RUNGS) : undefined;
    const fR2Rung =
      vowel !== undefined
        ? rung(fo, profile.fR2?.[vowel], Array.from({ length: FR2_MAX_HARMONIC }, (_, k) => k + 1))
        : undefined;

    const p = phraseOf[i];
    phraseQuavers.set(p, (phraseQuavers.get(p) ?? 0) + quavers);
    if (seconds !== undefined) phraseSeconds.set(p, (phraseSeconds.get(p) ?? 0) + seconds);
    phraseSize.set(p, (phraseSize.get(p) ?? 0) + 1);

    notes.push({
      eventId: s.ev.id,
      order: i,
      measureIndex: s.ev.measureIndex,
      midi: s.midi,
      ...(vowel !== undefined ? { vowel } : {}),
      ...(a ? { fR1Band: fr1Band(a) } : {}),
      ...(a?.inPassaggio !== undefined ? { inPassaggio: a.inPassaggio } : {}),
      ...(a?.rangeStatus !== undefined ? { rangeStatus: a.rangeStatus } : {}),
      ...(a?.sustainedCeilingExposure !== undefined ? { sustainedCeilingExposure: a.sustainedCeilingExposure } : {}),
      held,
      heldBasis: basis,
      ...(fR1Rung !== undefined ? { fR1Rung } : {}),
      ...(fR2Rung !== undefined ? { fR2Rung } : {}),
      ...(prev
        ? {
            approach: {
              semitones: s.midi - prev.midi,
              band: s.tieContinuation ? 'tie' : approachBand(s.midi - prev.midi),
              afterRest: s.afterRest,
            },
          }
        : {}),
      phrase: { index: p, position: 'first', quavers: 0 },
      quavers,
      ...(seconds !== undefined ? { seconds } : {}),
      onsetPhonationQuavers: onsetQuavers,
      ...(tempo !== 'none' ? { onsetPhonationSeconds: onsetSeconds } : {}),
    });
    onsetQuavers += quavers;
    if (seconds !== undefined) onsetSeconds += seconds;
  });

  // Phrase totals and positions, once every phrase is summed.
  let seenInPhrase = 0;
  notes.forEach((n, i) => {
    const p = n.phrase.index;
    seenInPhrase = i > 0 && notes[i - 1].phrase.index === p ? seenInPhrase + 1 : 0;
    const size = phraseSize.get(p)!;
    const position: PhrasePosition =
      size === 1 ? 'only' : seenInPhrase === 0 ? 'first' : seenInPhrase === size - 1 ? 'last' : 'middle';
    n.phrase = {
      index: p,
      position,
      quavers: phraseQuavers.get(p)!,
      ...(phraseSeconds.has(p) ? { seconds: phraseSeconds.get(p)! } : {}),
    };
  });

  return { notes, tempo, boundaryCounts };
}
