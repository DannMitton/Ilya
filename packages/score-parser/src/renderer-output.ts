/**
 * Renderer output: simplified MusicXML for Verovio.
 *
 * Generates a minimal MusicXML representation of the isolated vocal line
 * from a `ParsedScore`, suitable for `verovio.toolkit.loadData()`. This is
 * an output-only artifact: the produced XML is consumed by Verovio and
 * rendered to SVG. It is not stored, not exported to the user, and not
 * part of any round-trip. If Verovio adds MNX support later (architecture
 * spec §"Renderer-output step"), this function is replaced with
 * `generateRendererMnx` and the rest of Shane is untouched.
 *
 * Output contains:
 *   - One staff (the isolated vocal line; accompaniment is not rendered).
 *   - Verovio-renderable basics: pitches, rhythms, lyrics, measure
 *     structure, key and time signature, tempo markings.
 *   - Shane analytical overlays via Verovio's notation primitives:
 *       - Stem direction (down = open timbre, up = close timbre).
 *       - Grey stemless noteheads for vowel migration turning points.
 *   - Stable data attributes on notes and syllables, mapping to
 *     `VocalLineEvent.id` and `SyllableInfo.id` / `wordContext` /
 *     `verseNumber` per Round 9 §4.2.
 *
 * Red boxes for fR1/f0 crossings (architecture spec §Layer 4) are layered
 * as SVG overlays after Verovio renders; they are not part of this
 * function's output.
 *
 * Status: Phase 1 stub. Real generation deferred to Phase 2.
 *
 * @param parsed The canonical ParsedScore to render.
 * @returns A MusicXML string suitable for `verovio.toolkit.loadData()`.
 */

import type { ParsedScore } from './types';

export function generateRendererMusicXml(parsed: ParsedScore): string {
  // TODO Phase 2: implement.
  //
  // Output shape (MusicXML 4.0):
  //
  //   <?xml version="1.0" encoding="UTF-8" standalone="no"?>
  //   <!DOCTYPE score-partwise PUBLIC ...>
  //   <score-partwise version="4.0">
  //     <work><work-title>...</work-title></work>
  //     <part-list>
  //       <score-part id="V"><part-name>{vocalPart.partName}</part-name></score-part>
  //     </part-list>
  //     <part id="V">
  //       <measure number="1">
  //         <attributes>
  //           <divisions>...</divisions>
  //           <key><fifths>{keySignature.fifths}</fifths>...</key>
  //           <time><beats>{timeSignature.beats}</beats><beat-type>...</beat-type></time>
  //           <staves>1</staves>
  //           <clef><sign>G</sign><line>2</line></clef>
  //         </attributes>
  //         <direction><sound tempo="{bpm}"/></direction>
  //         <note>
  //           <pitch>...</pitch>
  //           <duration>...</duration>
  //           <type>{NoteBase}</type>
  //           <stem>up | down</stem>
  //           <notehead>...</notehead>
  //           <lyric number="{verseNumber}">
  //             <syllabic>{single|begin|middle|end}</syllabic>
  //             <text>{text}</text>
  //           </lyric>
  //         </note>
  //         ...
  //       </measure>
  //       ...
  //     </part>
  //   </score-partwise>
  //
  // Steps:
  //   1. Compute a divisions value sufficient for the smallest fractional
  //      duration in `parsed.vocalLine` (LCM of all duration denominators).
  //   2. Emit measures in order, with `<attributes>` blocks at the first
  //      measure and at every measure where `parsed.timeSignatures[]` or
  //      `parsed.keySignatures[]` records a change.
  //   3. Emit each `VocalLineEvent` as `<note>` (or `<note><rest/></note>`).
  //      Apply analytical overlays:
  //        - `<stem>` from the timbre overlay (lookup keyed on the event id).
  //        - `<notehead color="#808080">` and `<stem>none</stem>` for
  //          vowel migration turning points (lookup keyed on event id).
  //   4. Emit tempo markings as `<direction>` blocks at the appropriate
  //      measure and rhythmic position.
  //
  // OPEN QUESTION: data-attribute pass-through to Verovio SVG output.
  //
  //   The four Round 9 §4.2 attributes (`data-note-id`, `data-syllable-id`,
  //   `data-word-context`, `data-verse-number`) need to appear on the
  //   rendered SVG. MusicXML has no first-class mechanism for arbitrary
  //   data attributes. Three candidate paths:
  //
  //     A. Use MusicXML's `<other-notation>` or `<other-direction>` with
  //        a Shane-namespaced attribute soup, and depend on Verovio
  //        passing them through. Needs Verovio behaviour verification;
  //        Verovio 6.1 strips unknown elements by default.
  //
  //     B. Use MEI as the intermediate format instead of MusicXML, since
  //        MEI is Verovio's native input and supports arbitrary `@xml:id`
  //        attributes that Verovio reliably propagates to SVG. This
  //        changes the rendering pipeline non-trivially and contradicts
  //        the architecture spec's "MusicXML for now" choice. Defer.
  //
  //     C. Post-process Verovio's SVG output after rendering: match each
  //        rendered `<g class="note">` group to the corresponding
  //        `VocalLineEvent` by walking the score in document order, and
  //        inject `data-*` attributes. This is the most robust path
  //        because it bypasses MusicXML's encoding limits entirely, but
  //        it requires the Shane rendering layer to keep the ParsedScore
  //        and the SVG output in lockstep order.
  //
  //   Recommendation pending Verovio 6.1 behaviour test: prefer C if
  //   Verovio preserves note-event ordering reliably in its SVG output
  //   (which it appears to, from a quick read of the Verovio source).
  //   Confirm before committing.

  void parsed; // Suppress unused-parameter warning for the stub.

  throw new Error('generateRendererMusicXml() not yet implemented');
}
