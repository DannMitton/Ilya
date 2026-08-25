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

import { analyzeScore, pitchToMidi, STEP_SEMITONE, type VowelResolver } from './overlay-engine';
import type { KeySignature, ParsedScore, Pitch, VocalLineEvent } from './types';
import type { VoiceProfileSnapshot } from './analysis-types';

/** Default search window, in semitones either side (a tritone). JUDGEMENT. */
const DEFAULT_MAX_SEMITONES = 6;
/** Default number of suggestions ("X or Y" ⇒ 2). JUDGEMENT. */
const DEFAULT_MAX_SUGGESTIONS = 2;

/**
 * Naturals-and-sharps spelling by pitch class; height-correct. This is the
 * SHARP SIDE of the spelling policy below, and it is also what
 * `transposePitch` uses on its own: a caller that wants height without a
 * spelling opinion opts out of the policy by calling that.
 */
const SPELLING: Array<{ step: Pitch['step']; alter: number }> = [
  { step: 'C', alter: 0 }, { step: 'C', alter: 1 }, { step: 'D', alter: 0 }, { step: 'D', alter: 1 },
  { step: 'E', alter: 0 }, { step: 'F', alter: 0 }, { step: 'F', alter: 1 }, { step: 'G', alter: 0 },
  { step: 'G', alter: 1 }, { step: 'A', alter: 0 }, { step: 'A', alter: 1 }, { step: 'B', alter: 0 },
];

/** Naturals-and-flats spelling by pitch class; the FLAT SIDE of the policy. */
const FLAT_SPELLING: Array<{ step: Pitch['step']; alter: number }> = [
  { step: 'C', alter: 0 }, { step: 'D', alter: -1 }, { step: 'D', alter: 0 }, { step: 'E', alter: -1 },
  { step: 'E', alter: 0 }, { step: 'F', alter: 0 }, { step: 'G', alter: -1 }, { step: 'G', alter: 0 },
  { step: 'A', alter: -1 }, { step: 'A', alter: 0 }, { step: 'B', alter: -1 }, { step: 'B', alter: 0 },
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

// ── The spelling policy (N.92 slice 2, ruled by Dann 2026-08-24) ──────

/** What `spellPitch` is allowed to know. See `spellPitch` for the tiers. */
export interface SpellingContext {
  /**
   * The key in force where the note sounds. Absent means no tonal anchor, which
   * is tier 3, and is NOT the same as a key of no sharps and no flats.
   */
  key?: KeySignature;
  /** The note before this one in the line, read only by tier 3. */
  previous?: Pitch;
}

/** The seven letters in fifths order: the first n take a key's n sharps. */
const FIFTHS_ORDER: Pitch['step'][] = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];

/** Letter positions for interval arithmetic (C = 0 … B = 6). */
const STEP_INDEX: Record<Pitch['step'], number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };

/**
 * Semitone spans each letter distance can carry and still be a plain interval:
 * a perfect, major, or minor one, the kind a singer names without the word
 * "augmented" in it. A fourth is 5 and a fifth is 7, so the tritone is absent
 * from both by construction, which is the point.
 *
 * THE UNISON ROW CARRIES 0 ALONE, so a chromatic inflection of one letter (A to
 * A sharp) is NOT plain and a diatonic semitone (A to B flat) is. That was
 * measured, not assumed: over the six songs of Mussorgsky's Sunless as Dann
 * engraved them, 1934 vocal notes, a fallback holding the strict table agreed
 * with the engraving on 97.6 per cent, and one that also called the chromatic
 * inflection plain agreed on 96.2 per cent. The case that separates them is the
 * one on the page at Sunless 1, measure 2: A A A up to the flat sixth, engraved
 * B flat, which the strict table spells B flat and the loose one spells A
 * sharp.
 */
const PLAIN_INTERVAL: number[][] = [[0], [1, 2], [3, 4], [5], [7], [8, 9], [10, 11]];

/** The seven spellings a key signature gives, by pitch class. */
function diatonicSpellings(fifths: number): Map<number, { step: Pitch['step']; alter: number }> {
  const out = new Map<number, { step: Pitch['step']; alter: number }>();
  for (let i = 0; i < 7; i++) {
    const step = FIFTHS_ORDER[i];
    // Sharps run forward from F; flats run backward from B, which is the same
    // order read from the other end, so one index serves both.
    const alter = fifths >= 0 ? (i < fifths ? 1 : 0) : i >= 7 + fifths ? -1 : 0;
    out.set(((STEP_SEMITONE[step] + alter) % 12 + 12) % 12, { step, alter });
  }
  return out;
}

/**
 * A spelling placed in the octave that makes it sound at `midi`. Subtracting
 * the alteration before the division is what carries B sharp and C flat across
 * the octave boundary correctly.
 */
function atOctave(spelling: { step: Pitch['step']; alter: number }, midi: number): Pitch {
  return {
    step: spelling.step,
    alter: spelling.alter,
    octave: Math.floor((midi - spelling.alter) / 12) - 1,
  };
}

/** True when `a` to `b` is a perfect, major, or minor interval (any octave). */
function isPlainInterval(a: Pitch, b: Pitch): boolean {
  let letters = Math.abs(
    a.octave * 7 + STEP_INDEX[a.step] - (b.octave * 7 + STEP_INDEX[b.step]),
  );
  let semitones = Math.abs(pitchToMidi(a) - pitchToMidi(b));
  while (letters >= 7 && semitones >= 12) {
    letters -= 7;
    semitones -= 12;
  }
  return letters <= 6 && PLAIN_INTERVAL[letters].includes(semitones);
}

/**
 * THE ONE SPELLER. Everything in the app that has to decide whether a pitch
 * class is written G sharp or A flat asks `spellPitch`. Gould rule 66 is the
 * source: a note is spelled in its harmonic context, not by a fixed table.
 *
 * `transposePitch` above keeps the sharps-only table, and that is the OPT-OUT,
 * stated rather than hidden: the transposition cost search wants height and has
 * no engraving opinion, so it takes the table. Nothing else hand-rolls a second
 * speller.
 *
 * THREE TIERS, in order.
 *
 *   1. A DIATONIC NOTE OF THE KEY IS SPELLED AS THE KEY SPELLS IT. In C sharp
 *      major that makes pitch class 0 a B sharp, and in C flat major it makes
 *      pitch class 11 a C flat, which is why the octave arithmetic below cannot
 *      use `Math.floor(midi / 12)`: those two spellings wrap the letter across
 *      the octave boundary.
 *   2. A CHROMATIC NOTE SPELLS TO THE KEY'S SIDE: flats in flat keys, sharps in
 *      sharp keys. A key of no sharps and no flats takes the sharp side, which
 *      is what this repertoire's chromatic notes in C major are written as and
 *      what the reader already did (JUDGEMENT, carried from the table it
 *      replaces).
 *   3. NO KEY AT ALL, NO TONAL ANCHOR: prefer the spelling that makes a plain
 *      melodic interval from the previous note (rule 66's own fallback). A
 *      plain interval is a perfect, major, or minor one; an augmented or
 *      diminished interval is what the wrong spelling produces. Where both
 *      spellings are plain or neither is, direction decides: rising takes the
 *      sharp, falling the flat. With no previous note either, the sharp side.
 *      See `PLAIN_INTERVAL`, whose one row of judgement was measured against
 *      the corpus rather than assumed.
 *
 * WHAT THIS DOES NOT KNOW: the harmony. Only the key, the note, and the note
 * before it are in evidence, so a chromatic note whose correct spelling depends
 * on the chord under it (the raised fourth of F major is an F sharp in a D
 * major chord and a G flat in an A flat chord) is spelled by tier 2 alone. That
 * limit is the reason the accidental verbs exist: a hand spelling always wins,
 * and nothing in this file ever overwrites one.
 *
 * `midi` is the sounding height (middle C = 60), so the caller never has to
 * hold a pitch class and an octave apart. Pure: same arguments, same spelling,
 * always.
 */
export function spellPitch(midi: number, context: SpellingContext = {}): Pitch {
  const pc = ((midi % 12) + 12) % 12;

  if (context.key) {
    const diatonic = diatonicSpellings(context.key.fifths).get(pc);
    if (diatonic) return atOctave(diatonic, midi);
    return atOctave(context.key.fifths < 0 ? FLAT_SPELLING[pc] : SPELLING[pc], midi);
  }

  const sharp = atOctave(SPELLING[pc], midi);
  // The seven white keys are spelled the same on both sides, so there is
  // nothing to choose and tier 3 never runs for them.
  if (SPELLING[pc].step === FLAT_SPELLING[pc].step) return sharp;

  const flat = atOctave(FLAT_SPELLING[pc], midi);
  const previous = context.previous;
  if (!previous) return sharp;

  const sharpPlain = isPlainInterval(previous, sharp);
  const flatPlain = isPlainInterval(previous, flat);
  if (sharpPlain !== flatPlain) return sharpPlain ? sharp : flat;
  return pitchToMidi(previous) <= midi ? sharp : flat;
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
