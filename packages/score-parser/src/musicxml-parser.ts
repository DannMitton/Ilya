/**
 * MusicXML score parser.
 *
 * Reads MusicXML input (XML string or pre-parsed Document) and produces
 * Shane's canonical `ParsedScore`. Supports MusicXML 3.1 and 4.0. Older
 * pre-3.1 features (where present) are noted via `'musicxml-pre-3-1-feature'`
 * warnings; the parser does not refuse them but may simplify their
 * representation.
 *
 * Conversion paths that feed this parser:
 *   - Direct upload of `.xml` or `.mxl` (origin `'musicxml-direct'`). The
 *     runner is responsible for `.mxl` (zip) extraction before handoff.
 *   - MuseScore CLI export from `.mscz` (origin
 *     `'musescore-cli-musicxml-from-mscz'`).
 *   - PDFtoMusic Pro user-side conversion from vector PDF (origin
 *     `'pdftomusic-pro-musicxml-from-vector-pdf'`).
 *   - homr OMR from raster PDF or image (origin
 *     `'homr-musicxml-from-image'`).
 *   - MIDI converter output (origin `'midi-converted-musicxml'`); produces
 *     a ParsedScore with `syllable: undefined` on every vocal event since
 *     MIDI carries no lyrics.
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
 *   test corpus (Round 9 §"Open questions" item on test corpus structure
 *   pending).
 */

import type {
  MusicXmlScoreInput,
  ParseResult,
  ScoreInput,
  ScoreParser,
} from './types';

export class MusicXmlScoreParser implements ScoreParser {
  canParse(input: ScoreInput): boolean {
    return input.format === 'musicxml';
  }

  async parse(input: ScoreInput): Promise<ParseResult> {
    if (!this.canParse(input)) {
      throw new Error(
        `MusicXmlScoreParser cannot parse input of format '${input.format}'`,
      );
    }

    // Narrow type and resolve string/Document polymorphism for downstream
    // use once full parsing lands.
    void (input as MusicXmlScoreInput);

    // TODO Phase 2: implement full MusicXML parsing.
    //
    // Pipeline:
    //   1. Resolve input: if `data` is a string, parse via DOMParser
    //      (browser) or @xmldom/xmldom (Node test environment). If it
    //      is already a Document, use directly. Emit
    //      `'invalid-musicxml'` fatal error on parse failure.
    //   2. Identify the vocal part: scan `<score-part>` entries for the
    //      one with `<lyric>` children attached to its notes; fall back
    //      to the first part. Emit `'multiple-vocal-parts'` warning if
    //      more than one candidate carries lyrics; emit
    //      `'no-vocal-part-identified'` fatal error if none.
    //   3. Walk `<measure>` elements to build `Measure[]` with
    //      snapshotted signatures (see @invariant above). MusicXML
    //      uses `<attributes>` blocks for key/time changes; track active
    //      state across measures.
    //   4. Walk the vocal part's `<note>` elements into `VocalLineEvent[]`:
    //        a. Generate deterministic `id` from
    //           `m{measureIndex}-{rhythmicPosition.numerator}-{rhythmicPosition.denominator}`.
    //           MusicXML uses `<duration>` in divisions-per-quarter-note;
    //           the parser converts to whole-note Fraction by dividing by
    //           (divisions * 4).
    //        b. Map `<type>`, `<dot>`, `<time-modification>` to `Duration`,
    //           computing `fraction` once.
    //        c. Map `<pitch>` (`<step>`, `<octave>`, `<alter>`) to `Pitch`.
    //        d. Extract lyric from `<lyric>` child:
    //             - `<syllabic>` (single/begin/middle/end) maps to
    //               `SyllableInfo.type` ('whole'/'start'/'middle'/'end').
    //             - `verseNumber` from `<lyric number="N">`.
    //             - `id` = UUID v4.
    //             - `wordContext` computed by buffering contiguous
    //               `start`/`middle`/`end` syllables of the same verse;
    //               on `end` or `whole`, flush the buffer and assign the
    //               concatenation to all syllables in the word.
    //        e. Map `<tie>`/`<tied>`, `<fermata>`, `<articulations>`.
    //   5. Collect tempo markings from `<direction>` blocks containing
    //      `<metronome>` or `<sound tempo="...">`. The two encoding paths
    //      can coexist in one score; prefer `<metronome>` for the visible
    //      beat-unit, fall back to `<sound>` for the BPM if `<metronome>`
    //      is absent.
    //   6. Determine `source.fidelity` and `source.origin` from
    //      `input.sourcePath` extension, `<encoding>/<software>` metadata
    //      (MuseScore, PDFtoMusic Pro, and homr all stamp themselves
    //      here), and any other runner-injected hints.
    //
    // Reference: MusicXML 4.0 spec, MusicXML Tutorial (Recordare/W3C),
    //   and the existing OCR-side reading patterns in
    //   `apps/web/src/lib/components/RootPanel.svelte` for browser DOM
    //   parsing conventions used in this codebase.

    throw new Error('MusicXmlScoreParser.parse() not yet implemented');
  }
}
