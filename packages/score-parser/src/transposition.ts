/**
 * Transposition suggestion (pure).
 *
 * Given a parsed score, the singer's profile snapshot, and the vowel
 * resolver, `suggestTranspositions` searches candidate transpositions and
 * returns the ones that best resolve the singer's RANGE violations while
 * adding the fewest acoustic challenges. It exists so the watch list's range
 * line can say "you may want to transpose to X or Y" with X and Y computed,
 * not guessed (Dann's ruling, 2026-07-20). When no candidate in the window
 * improves on the printed key, the suggestion list is empty and the range
 * line falls back to naming the fact.
 *
 * Design (see `claude/fit-acoustic-framework_2026-07-20.md` §6):
 *   - Minimize, do not eliminate: a mismatch handled with skill is
 *     expression, so the search reduces costly events, it does not demand
 *     zero. The printed key is always the baseline and can win; an empty
 *     result IS "this key already suits you."
 *   - Range first: an out-of-range note is a pure pitch fact (no vowel
 *     needed), and resolving it is the primary objective. Among range
 *     improvements, fewer crossings ranks higher, then the smaller shift.
 *   - This is v1. The cost is (out-of-range, then crossings); the hazard
 *     class (an open vowel forced high) and any richer weighting are the
 *     deferred refinements, to be calibrated against real scores. Every
 *     constant here is JUDGEMENT and single-point-of-change.
 *
 * Pure and non-destructive: it never mutates `parsed`; each candidate is a
 * shifted COPY, and `analyzeScore` (itself pure) does the acoustic count.
 */

import { analyzeScore, pitchToMidi, type VowelResolver } from './overlay-engine';
import type { KeySignature, ParsedScore, Pitch, VocalLineEvent } from './types';
import type { VoiceProfileSnapshot } from './analysis-types';

/** Default search window, in semitones either side (a tritone). JUDGEMENT. */
const DEFAULT_MAX_SEMITONES = 6;
/** Default number of suggestions ("X or Y" ⇒ 2). JUDGEMENT. */
const DEFAULT_MAX_SUGGESTIONS = 2;

/** Naturals-and-sharps spelling by pitch class; height-correct (render spelling is a later concern). */
const SPELLING: Array<{ step: Pitch['step']; alter: number }> = [
  { step: 'C', alter: 0 }, { step: 'C', alter: 1 }, { step: 'D', alter: 0 }, { step: 'D', alter: 1 },
  { step: 'E', alter: 0 }, { step: 'F', alter: 0 }, { step: 'F', alter: 1 }, { step: 'G', alter: 0 },
  { step: 'G', alter: 1 }, { step: 'A', alter: 0 }, { step: 'A', alter: 1 }, { step: 'B', alter: 0 },
];

/**
 * A pitch shifted by `semitones`, spelled with naturals and sharps. Height is
 * exact; enharmonic spelling for an engraved transposition is the render
 * beat's concern, not this cost search's.
 */
export function transposePitch(p: Pitch, semitones: number): Pitch {
  const midi = pitchToMidi(p) + semitones;
  const spelling = SPELLING[((midi % 12) + 12) % 12];
  return { step: spelling.step, alter: spelling.alter, octave: Math.floor(midi / 12) - 1 };
}

/**
 * A non-destructive copy of `parsed` with every vocal-line pitch shifted by
 * `semitones`. `semitones === 0` returns the input unchanged. Only pitches
 * change; ids, durations, syllables, and everything else are preserved, so
 * the id-keyed vowel resolver still applies to the shifted line.
 */
export function transposeScore(parsed: ParsedScore, semitones: number): ParsedScore {
  if (semitones === 0) return parsed;
  return {
    ...parsed,
    vocalLine: parsed.vocalLine.map((e: VocalLineEvent) =>
      e.pitch ? { ...e, pitch: transposePitch(e.pitch, semitones) } : e,
    ),
  };
}

/** Notes outside the singer's declared range (pure pitch; no vowel needed). 0 when no range. */
function countOutOfRange(parsed: ParsedScore, profile: VoiceProfileSnapshot): number {
  if (!profile.range) return 0;
  const lo = pitchToMidi(profile.range.lowest);
  const hi = pitchToMidi(profile.range.highest);
  let n = 0;
  for (const e of parsed.vocalLine) {
    if (e.type !== 'note' || !e.pitch) continue;
    const m = pitchToMidi(e.pitch);
    if (m < lo || m > hi) n++;
  }
  return n;
}

/** Forecast fR1/fo crossings under this score (needs the vowel and its fR1). */
function countCrossings(parsed: ParsedScore, profile: VoiceProfileSnapshot, vowel: VowelResolver): number {
  const analyzed = analyzeScore(parsed, profile, vowel);
  let n = 0;
  for (const ev of Object.values(analyzed.events)) if (ev.crossing) n++;
  return n;
}

export interface TranspositionCandidate {
  /** Signed shift in semitones (never 0). */
  semitones: number;
  /** Human interval, e.g. "down a whole tone". */
  intervalName: string;
  /** Out-of-range notes remaining at this transposition. */
  outOfRange: number;
  /** Forecast crossings at this transposition. */
  crossings: number;
  /** True when this transposition removes every range violation. */
  resolvesRange: boolean;
  /**
   * The named target key ("E flat major"), when the printed score declared a
   * mode; undefined when the source carried no mode, in which case the caller
   * falls back to the interval name (Dann, 2026-07-20). Spelled on the circle
   * of fifths and respelled to stay within seven accidentals.
   */
  targetKey?: string;
}

export interface TranspositionSuggestion {
  /** Out-of-range notes in the printed key (the baseline). */
  currentOutOfRange: number;
  /** Crossings in the printed key. */
  currentCrossings: number;
  /**
   * Ranked transpositions that strictly reduce the range violation, best
   * first. Empty when the printed key has no range violation, when the
   * profile carries no range, or when nothing in the window improves it: in
   * every empty case the range line names the fact and offers no transposition.
   */
  suggestions: TranspositionCandidate[];
}

export interface SuggestTranspositionOptions {
  /** Search ± this many semitones. Default 6. */
  maxSemitones?: number;
  /** Cap the returned suggestions. Default 2 ("X or Y"). */
  maxSuggestions?: number;
}

const INTERVAL_NAMES = [
  'a unison', 'a semitone', 'a whole tone', 'a minor third', 'a major third',
  'a perfect fourth', 'a tritone', 'a perfect fifth', 'a minor sixth',
  'a major sixth', 'a minor seventh', 'a major seventh', 'an octave',
];

/** "down a minor third" / "up a perfect fourth"; falls back to a semitone count past an octave. */
export function intervalName(semitones: number): string {
  const dir = semitones < 0 ? 'down' : 'up';
  const n = Math.abs(semitones);
  const name = n < INTERVAL_NAMES.length ? INTERVAL_NAMES[n] : `${n} semitones`;
  return `${dir} ${name}`;
}

// ── Key naming (for the watch-list range line's "transpose to X or Y") ──

/** Major-key tonic name by key-signature fifths; index = fifths + 7 (−7…+7). Words, not glyphs. */
const MAJOR_TONIC_BY_FIFTHS = [
  'C flat', 'G flat', 'D flat', 'A flat', 'E flat', 'B flat', 'F',
  'C', 'G', 'D', 'A', 'E', 'B', 'F sharp', 'C sharp',
];

/** Minor-key tonic name by key-signature fifths; index = fifths + 7 (−7…+7). */
const MINOR_TONIC_BY_FIFTHS = [
  'A flat', 'E flat', 'B flat', 'F', 'C', 'G', 'D',
  'A', 'E', 'B', 'F sharp', 'C sharp', 'G sharp', 'D sharp', 'A sharp',
];

/**
 * The named key a score lands in after transposing by `semitones`, spelled on
 * the circle of fifths from the printed key signature and respelled to stay
 * within seven accidentals (so "A flat major", never "G sharp major"). Returns
 * null when the source carries no mode: three flats is both E flat major and C
 * minor, so naming a key there would be a guess, and the caller falls back to
 * the interval instead (Dann's ruling, 2026-07-20). Pure.
 */
export function keyNameAfterTransposition(
  source: KeySignature | undefined,
  semitones: number,
): string | null {
  if (!source || source.mode === undefined) return null;
  // Fifths displacement for transposing up by `semitones`: seven fifths per
  // semitone on the circle, folded to the nearest representative in [−5, 6].
  const r = (((7 * semitones) % 12) + 12) % 12;
  const delta = r > 6 ? r - 12 : r;
  let fifths = source.fifths + delta;
  if (fifths > 7) fifths -= 12;
  else if (fifths < -7) fifths += 12;
  const tonic = (source.mode === 'minor' ? MINOR_TONIC_BY_FIFTHS : MAJOR_TONIC_BY_FIFTHS)[fifths + 7];
  return tonic === undefined ? null : `${tonic} ${source.mode}`;
}

/**
 * Suggest transpositions that resolve the singer's range violations with the
 * fewest added challenges. See the file header for the ranking and the
 * empty-result contract.
 */
export function suggestTranspositions(
  parsed: ParsedScore,
  profile: VoiceProfileSnapshot,
  vowel: VowelResolver,
  options: SuggestTranspositionOptions = {},
): TranspositionSuggestion {
  const window = options.maxSemitones ?? DEFAULT_MAX_SEMITONES;
  const cap = options.maxSuggestions ?? DEFAULT_MAX_SUGGESTIONS;
  const sourceKey = parsed.keySignatures[0]?.signature;

  const currentOutOfRange = countOutOfRange(parsed, profile);
  const currentCrossings = countCrossings(parsed, profile, vowel);

  // No range violation to resolve (or no declared range): nothing to suggest.
  if (currentOutOfRange === 0) {
    return { currentOutOfRange, currentCrossings, suggestions: [] };
  }

  const candidates: TranspositionCandidate[] = [];
  for (let s = -window; s <= window; s++) {
    if (s === 0) continue;
    const shifted = transposeScore(parsed, s);
    const outOfRange = countOutOfRange(shifted, profile);
    if (outOfRange >= currentOutOfRange) continue; // must strictly improve the range fit
    const targetKey = keyNameAfterTransposition(sourceKey, s);
    candidates.push({
      semitones: s,
      intervalName: intervalName(s),
      outOfRange,
      crossings: countCrossings(shifted, profile, vowel),
      resolvesRange: outOfRange === 0,
      ...(targetKey !== null ? { targetKey } : {}),
    });
  }

  // Fewest remaining range violations, then fewest crossings, then the
  // smallest move, then a stable tie-break (downward before upward).
  candidates.sort(
    (a, b) =>
      a.outOfRange - b.outOfRange ||
      a.crossings - b.crossings ||
      Math.abs(a.semitones) - Math.abs(b.semitones) ||
      a.semitones - b.semitones,
  );

  return { currentOutOfRange, currentCrossings, suggestions: candidates.slice(0, cap) };
}
