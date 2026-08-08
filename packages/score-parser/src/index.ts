/**
 * @ilya/score-parser (working scope; final package name pending scaffolding)
 *
 * Public API for Shane's score-parser package.
 *
 * Exports:
 *   - All canonical types from `./types` (`ParsedScore`, `VocalLineEvent`,
 *     `SyllableInfo`, `Pitch`, `Measure`, `TempoMarking`, etc.).
 *   - `MnxScoreParser` and `MusicXmlScoreParser`, the two `ScoreParser`
 *     implementations.
 *   - `generateRendererMusicXml`, the renderer-output function.
 *   - The E.20 measurement layer: phonation aggregation, the diction-mark
 *     fold, Pacheco tessitura, and the tempo seam. See the block at the
 *     foot of this file.
 *
 * Consumers (Shane's analysis layer, the OMR runners, the rendering
 * layer) import from this barrel and do not reach into the package
 * internals. See `ARCHITECTURE_SPEC_dual_canonical.md` and the Round 9
 * specification for design rationale.
 */

export * from './types';
export * from './analysis-types';

export { MnxScoreParser } from './mnx-parser';
export { MusicXmlScoreParser } from './musicxml-parser';
export { generateRendererMusicXml } from './renderer-output';
export {
  analyzeScore,
  scoreContentId,
  pitchToHz,
  pitchToMidi,
  hzToPitch,
  centsBetween,
  type VowelResolver,
  type AnalyzeOptions,
} from './overlay-engine';
export { modificationTarget, type ModificationTarget } from './modification-engine';
export { isLongSustain, SUSTAIN_SECONDS_THRESHOLD } from './sustain';
export { sungVerseNumbers } from './verses';
export {
  resolveTempoTerm,
  TEMPO_TIER_BANDS,
  type TempoTier,
  type TempoTermResolution,
} from './tempo-terms';
export {
	renderAnalyzedStaff,
	WITHHELD_SIGLA,
	WITHHELD_SIGLA_WIDTH_PX,
	type StaffRenderOptions,
} from './staff-renderer';
export { chooseClef, clefFromSource, type RenderClef } from './clef-select';
export { resolveVocalReadingOctave, shiftVocalOctave } from './vocal-octave';
export { scoreInPerformanceOrder, type PerformanceOrderScore } from './performance-order';
export {
  suggestTranspositions,
  transposePitch,
  transposeScore,
  intervalName,
  type TranspositionCandidate,
  type TranspositionSuggestion,
  type SuggestTranspositionOptions,
} from './transposition';
export type { UnfoldFlag } from './unfold';
export {
  prepareSmuflFont,
  spToPx,
  smuflFontSizePx,
  REQUIRED_GLYPHS,
  SMUFL_CODEPOINTS,
  type PreparedSmuflFont,
  type SmuflGlyphMetrics,
  type SmuflEngravingDefaults,
  type RequiredGlyphName,
} from './smufl-metadata';
export { demoScore, demoProfile, demoResolver, renderDemo, syntheticSmuflFont } from './demo-fixture';
export {
  paginateScore,
  sliceScore,
  sliceWidth,
  type PageLayoutOptions,
  type PaginatedScore,
  type SystemSlice,
} from './page-layout';

/*
 * ── The measurement layer (built E.20, wired E.21) ───────────────────────
 *
 * Four modules, built and tested against the corpus in E.20 and exported
 * here so the app can reach them without touching package internals. Each
 * carries its own abstention discipline:
 *
 *   phonation      sums sounding duration per pitch, per vowel, and per
 *                  pitch-per-vowel. Reads `base`/`dots`/`tuplet`, NOT
 *                  `duration.fraction`, which on `musx2mxl` output omits the
 *                  tuplet adjustment and overstated Sunless 3 by 21 percent.
 *                  Carries `PhonationTrust`, naming the bars that close
 *                  under no metre.
 *   diction-marks  folds `#` out of the syllable slot it should never have
 *                  occupied (Dann's ruling, 2026-07-30: it is a non-syllabic
 *                  boundary, concatenated onto the preceding phoneme).
 *                  `vowelResolverAbstentions` distinguishes a vacated tail
 *                  event from a melisma; the two look identical afterward.
 *   tessitura      Pacheco's half-maximum band over summed durations, with
 *                  the degeneracy fallback. A DIFFERENT quantity from the
 *                  app's current 15th-to-85th-percentile band over note
 *                  counts; which one ships is open item A5.
 *   tempo-seam     singer's override, then encoded metronome mark, then
 *                  verbal term via Quantz's tiers, then ABSTAIN. Never a
 *                  default bpm. Exact rationals throughout; the decimals are
 *                  display only.
 *
 * `lookupTempoLexicon` must be consulted BEFORE `resolveTempoTerm`, which
 * fuzzy-matches and would resolve "Sehr langsam" through "langsam" alone,
 * losing the "sehr" that makes it adagio. That order is load-bearing.
 */

export {
  aggregatePhonation,
  secondsFor,
  totalFoldCycles,
  nominalOscillations,
  soundingFromNotation,
  soundingFromFraction,
  normalizeFraction,
  fractionToNumber,
  midiOf,
  hzOf,
  type PhonationOptions,
  type PhonationTotals,
  type PhonationTrust,
  type PhonationCoverage,
  type BarReading,
  type BarVerdict,
  type VowelForEvent,
  type SecondsResult,
  type FoldCycleResult,
} from './phonation';

export {
  foldDictionMarks,
  vowelResolverAbstentions,
  phonationBreakEventIds,
  PHONATION_BREAK_MARK,
  type DictionMarkFold,
  type DictionBreak,
} from './diction-marks';

export {
  pachecoTessitura,
  optimalRegion,
  thresholdAsNumber,
  DEFAULT_MARGIN,
  type TessituraResult,
  type TessituraOptions,
  type TessituraBasis,
} from './tessitura';

export {
  resolveTempo,
  tempoCaveats,
  feltBeat,
  feltBeatInWholes,
  timeSignatureAt,
  readModifiers,
  bandPosition,
  classifyCue,
  classifyGradualCue,
  rampSeconds,
  type TempoResolution,
  type TempoProvenance,
  type ResolveTempoOptions,
  type FeltBeat,
  type GradualCue,
  type ModifierEffect,
} from './tempo-seam';

export {
  lookupTempoLexicon,
  lexiconHeadTerms,
  lexiconSize,
  type LexiconHit,
  type TempoLanguage,
} from './tempo-lexicon';
