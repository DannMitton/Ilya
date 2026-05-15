/**
 * MNX score parser.
 *
 * Reads MNX (Music Notation eXchange) input and produces Shane's canonical
 * `ParsedScore`. Reads the stable lyric subset of MNX (stable since October
 * 2024 per the w3c-cg/mnx repo) and the core musical structure; unrecognised
 * experimental features are noted via `'mnx-experimental-feature'` warnings
 * and ignored.
 *
 * Conversion paths that feed this parser:
 *   - Direct upload of `.mnx` or `.json` (origin `'mnx-direct'`).
 *   - denigma CLI output from `.musx` Finale files (origin
 *     `'denigma-mnx-from-musx'`).
 *
 * @invariant The parser must keep `measures[i].timeSignature` and
 *   `measures[i].keySignature` consistent with the score-wide
 *   `timeSignatures[]` and `keySignatures[]` arrays. Any future write
 *   path (correction GUI edits, measure insertion, signature changes)
 *   must update both structures atomically. Per Round 9 review (Kimi),
 *   the parallel-data redundancy is accepted for query performance;
 *   the consistency burden is on the parser and any future mutator.
 *
 * @invariant `VocalLineEvent.id` uses a deterministic composite key
 *   of the form `m{measureIndex}-{numerator}-{denominator}` (optionally
 *   suffixed with `-{voice}` if a polyphonic vocal part ever arrives).
 *   Composite keys are reproducible across re-parses, which matters for
 *   testability, renderer regression tests, and inspecting `data-note-id`
 *   in dev tools. `SyllableInfo.id` uses UUID v4 (via
 *   `crypto.randomUUID()` where available, falling back to the `uuid`
 *   package). UUID v4 is sufficient because syllables need only
 *   session-stability for the v1.x cross-tab jump, and correction-GUI
 *   mutations make deterministic syllable keys fragile.
 *
 * Status: Phase 1 stub. Real parsing deferred to Phase 2 against a
 *   test corpus (Patterson sample request in flight; Dann's own vocal
 *   `.musx` files via denigma locally).
 */

import type {
  MnxScoreInput,
  ParseResult,
  ScoreInput,
  ScoreParser,
} from './types';

export class MnxScoreParser implements ScoreParser {
  canParse(input: ScoreInput): boolean {
    return input.format === 'mnx';
  }

  async parse(input: ScoreInput): Promise<ParseResult> {
    if (!this.canParse(input)) {
      throw new Error(
        `MnxScoreParser cannot parse input of format '${input.format}'`,
      );
    }

    // Narrow type for downstream use once full parsing lands.
    void (input as MnxScoreInput);

    // TODO Phase 2: implement full MNX parsing.
    //
    // Pipeline:
    //   1. Validate MNX structure (top-level keys, version field). Emit
    //      `'incompatible-format-version'` fatal error if unsupported.
    //   2. Identify the vocal part: prefer the part with `lyrics.lines`
    //      attached to its events; fall back to the first non-instrument
    //      part. Emit `'multiple-vocal-parts'` warning if more than one
    //      candidate; emit `'no-vocal-part-identified'` fatal error if none.
    //   3. Walk `global.measures` to build `Measure[]` with snapshotted
    //      `timeSignature` and `keySignature` (see @invariant above).
    //      Track repeats, pickup detection (measure with shorter than
    //      `expectedDuration` actual content), rehearsal marks.
    //   4. Walk the vocal part's events into `VocalLineEvent[]`:
    //        a. Generate deterministic `id` from
    //           `m{measureIndex}-{rhythmicPosition.numerator}-{rhythmicPosition.denominator}`.
    //        b. Map MNX duration (`base`, `dots`, `tuplet`) to `Duration`,
    //           computing `fraction` once.
    //        c. Map MNX pitch (`step`, `octave`, `alter`) to `Pitch`.
    //        d. Extract lyric from `event.lyrics.lines.<lineId>`:
    //             - `type` field maps directly to `SyllableInfo.type`.
    //             - `verseNumber`: derived in two stages, per Patterson
    //               corrections received 2026-05-15.
    //
    //               STAGE 1 (verse detection): Scan all events in the
    //               vocal part. For each event, count the number of
    //               distinct lineIds attached to it. If the maximum
    //               across all events is 1, this is NOT a verse
    //               structure (just a single line of lyrics); assign
    //               verseNumber = 1 to every syllable. If the maximum
    //               is > 1, this is a verse structure with that many
    //               verse slots. MuseScore uses this same preprocessing
    //               approach; reference implementations exist in both
    //               mnxdom (Patterson) and MuseScore main.
    //
    //               STAGE 2 (canonical ordering of verse slots):
    //                 - Primary path: read `global.lyrics.lineOrder`,
    //                   an array of lineIds. Assign verseNumber 1..N
    //                   by its index. denigma's MNX output always
    //                   includes lineOrder (Patterson confirms).
    //                 - Fallback: if `lineOrder` is absent, use
    //                   document-order of first appearance across the
    //                   vocal part. Emit a `'lineorder-missing'`
    //                   warning. Patterson has an open issue at the
    //                   MNX spec for this deficiency; absence is the
    //                   non-canonical case.
    //
    //               Do NOT parse a numeric suffix out of the lineId.
    //               IDs are arbitrary per MNX spec. The Patterson
    //               sample (Sharp_Excerpt_fin27.mnx) demonstrates
    //               this: four verses with IDs v2, v4, v6, v8.
    //
    //             - `verseLabel`: read from
    //               `global.lyrics.lineMetadata[lineId].label` if
    //               present (e.g., "Verse 2"). Preserves the original
    //               user-facing identity from the source. May be
    //               absent; in that case leave undefined and let the
    //               UI fall back to `Verse ${verseNumber}` display.
    //               The Patterson sample contains labels for all four
    //               of its verses ("Verse 2", "Verse 4", "Verse 6",
    //               "Verse 8").
    //
    //             - `id` = UUID v4.
    //             - `wordContext` computed by buffering contiguous
    //               `start`/`middle`/`end` syllables of the same verse;
    //               on `end` or `whole`, flush the buffer and assign the
    //               concatenation to all syllables in the word.
    //        e. Map ties (`event.notes[].tied`), fermatas, articulations.
    //   5. Collect `tempoMarkings` from `global.tempos` (MNX root or
    //      per-measure direction events).
    //   6. Determine `source.fidelity` and `source.origin` based on
    //      `input.sourcePath` extension and any denigma-injected
    //      provenance fields.
    //
    // Reference: w3c-cg/mnx repo, `src/importexport/mnx/` in MuseScore
    //   main branch (lyrics import is the source of truth for `lyrics.lines`
    //   handling), and denigma's MNX output for `.musx`-specific quirks.

    throw new Error('MnxScoreParser.parse() not yet implemented');
  }
}
