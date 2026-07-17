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
export { sungVerseNumbers } from './verses';
export {
  resolveTempoTerm,
  TEMPO_TIER_BANDS,
  type TempoTier,
  type TempoTermResolution,
} from './tempo-terms';
export { renderAnalyzedStaff, type StaffRenderOptions } from './staff-renderer';
export { chooseClef, clefFromSource, type RenderClef } from './clef-select';
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
