# Report: N.188, Markup draws the printed slurs and note markings

Branch `cloud-lane-11`, from `ba6f064` (the merge of `origin/Shane` was a fast-forward, docs only). Brief: `brief-code-n188-markings-drawn_r2_2026-10-19.md`. Cloud session, Sonnet 5.5.

## Two findings first

1. **The brief's test 4 cannot be run on `tch-1.musicxml`'s voice line, because the voice line carries no marks.** The brief says `tch-1` holds 52 slur ends and 7 staccati. It does, but all of them are in part P2, the piano. Counted on the four homr fixtures in `apps/web/src/lib/omr/fixtures/` (part by part):

   | fixture | P1 (voice) | P2 (piano) |
   |---|---|---|
   | tch-1 | 0 slurs, 0 marks | 52 slurs, 7 staccati |
   | tch-2 | 0 slurs, 0 marks | 94 slurs, 4 accents |
   | tch-3 | 0 slurs, 0 marks | 70 slurs, 9 staccati, 3 accents, 3 fermatas |
   | sun3-2 | 0 slurs, 7 breath marks, 1 fermata | 33 slurs, 2 fermatas |

   `joinPages` keeps homr's first part and first staff only, so the sung line of these pages has no slur, accent, or staccato to draw. A test now pins that (`the in-tree homr pages carry no slur ... on the VOICE part`). Section D is instead tested on the hand-written fixture, once as a plain file and once with the single `<software>homr</software>` element added. **That is a stamp in the XML, not a faked `ParsedScore`: the parser derives `source.origin` from that element alone.** It is the nearest thing to the brief's "same notes, plain file" that the tree allows, and it is the one place the brief's "do not fake a provenance" is bent. The desk should decide whether it is enough. Whether the row 114 measure (slur starts 45 of 46) was taken on a different part is NOT ESTABLISHED here.
2. **The glyph codepoints are verified for all three faces, Bravura included.** The brief said Bravura's WOFF2 cmap was not read. It was read this session (fontTools): all 20 codepoints are present in `Bravura.woff2`, `FinaleMaestro.otf`, and `Leland.otf`, and every one has a `glyphBBoxes` entry in all three metadata files. Leland's glyph names match the keys I added.

## What was built

**Parser**
- `packages/score-parser/src/notations.ts` (new, 159 lines): `readNoteNotations` (fermata, articulations, slur ends; moved out of `musicxml-parser.ts` with `MARKING_TO_ARTICULATION`), `readSlurEnds`, and `pairSlurs` (A.1, A.2). A fermata on a rest is kept; `type="inverted"` fills `placement: 'below'`; a shape in the element's text fills `shape`.
- `types.ts`: `SlurEnd`, `VocalLineEvent.slurs`, `ParsedScore.carriesPrintedSlurs`, warning code `slur-ends-unpaired` (989 lines, under the 1000 limit).
- `musicxml-parser.ts`: calls the new module; grace-note slur ends move to the next or last kept note (A.2a, `slurCarry`); pairing runs after the tie pass (step 5b); file ends at 1167, ceiling lowered from 1168.
- A rest keeps its fermata; a slur end on a rest is dropped with a warning.
- `apps/web/src/lib/omr/join-pages.ts` `silent()`: a bar whose rest carries a `<fermata>` is no longer stripped (A.4).
- MNX: see below.

**Renderer**
- `ties-and-slurs.ts` (new, 489 lines): the tie pass and the derived melisma slur moved verbatim from `staff-renderer.ts` (the tie's direction gains one clause for a printed slur that bows below), plus `planPrintedSlurs` and `drawPrintedSlurs`.
- `arc-outline.ts`: `slopedArcOutline` (y1 and y2). `arcOutline` is untouched; the approval tests are byte-stable.
- `markings.ts` (new, 200 lines): accents, tenuti, staccati and kin, breath mark, caesura, fermata. Markings are drawn before slurs and recorded per event, so the slur's walk lifts over them.
- `printed-marks.ts` (new, 105 lines): `SCAN_DRAWN_KINDS` (section D, the one list), `isReadScan` (keyed on `source.origin`), `drawsKind`, `slurEndKey`, `slurEndsAcross`, `slursThrough`.
- `smufl-metadata.ts`: 20 glyphs added to `SMUFL_CODEPOINTS`.
- `staff-renderer.ts`: options `printedSlurs`, `slurAcross`, `slurThrough`; the melisma slur is gated on `drawDerivedSlur` (never on a scan; on a file only if no slur is printed); hooks replace the moved passes. 3435 lines, ceiling lowered from 3489.
- `page-layout.ts` `renderSystemSlice`: computes the three options from the whole score, so page, print, and loupe agree.
- `Loupe.svelte`: the run-on layer also lifts `[data-slur-runon]`.

**Beyond the brief:** `slursThrough`. A slur that starts before a system and stops after it has no end in the middle system, so the brief's "two halves" would draw nothing there, and in the loupe nothing on a measure in the middle of a long slur. A middle system or loupe measure now draws it edge to edge (`data-slur-half="through"`).

## End-point threshold (B.3)

`SLUR_SHALLOW_APEX_SP = 24 / 5.5 / 2` (about 2.18 stave spaces of apex rise above the chord), `ties-and-slurs.ts`. Source: Dann's end-point rule (2026-10-19 15:5x) names no number. The value is the derived melisma slur's own cap (`Math.min(24, ...)` px of control lift at the 5.5 px stave, half of it at the apex). DESK DEFAULT. Where both ends at their heads need more rise to clear an inner note, an end whose stem points the slur's way moves toward its stem tip in 0.25 sp steps, stopping 0.25 sp short of the tip, until the arc is shallow or no end can move. Only depth is tested; a steep chord with a shallow arc is left alone. On the fixture it fires on the first slur (G4 to B4 over A4's up stem): the left end rises to G4's stem tip.

## Tests and gates

All eight gates, run on this branch, against the baseline measured on `ba6f064` in a clean worktree:

| gate | baseline | this branch |
|---|---|---|
| phonology | 267 passed | 267 |
| dictionary | 248 passed | 248 |
| web-check | 0 errors, 12 warnings | 0 errors, 12 warnings |
| web-test | 2842 passed (163 files) | **2844 passed** (163 files) |
| score-parser | 709 passed, 5 skipped (714) | **744 passed, 5 skipped (749)** |
| blurb | 145 | 145 |
| integration | 55 | 55 |
| ratchets | OK | OK; two ceilings lowered (below) |

The gate counts in the old ship script are stale; these are the measured baselines.

New tests: 35 in `packages/score-parser/src/n188-markings.test.ts` (parser, pairing policy, grace moves, fermatas on rests, renderer, markings, section D); 1 in `join-pages.test.ts` (fermata rest survives the join, A.4); 1 in `phrase-ends.test.ts` (a fermata on a rest changes no phrase end; the held-count half is in the score-parser file). `row108.support.ts` `buildScore` gained a fermata on a rest. **No existing test changed**: none pinned a derived melisma slur on a score carrying printed slurs (item 6).

Ceilings in `scripts/ratchets.json`: lowered `staff-renderer.ts` 3489 to 3435 and `musicxml-parser.ts` 1168 to 1167. None raised.

## Pictures

`docs/sessions/n188-shots/`: `markup-desk-1440.png`, `markup-desk-1440-loupe.png` (the loupe on m. 1, showing the melisma slur), `markup-phone-390.png`, `markup-print.pdf` (2 pages) and `markup-print-1.png` (page 1). Taken from the dev server (`vite dev`) in headless Chromium with the real upload route; English. The print preview ran in the lane (`page.pdf`).

## MNX finding (A.7)

Not built. `mnx-parser.ts:23` and `:233` say denigma's output carries event-level `slurs` (read on the Kabalevsky fixture, 2026-07-12) and the parser deliberately ignores them. No MNX fixture with slurs is in the tree and no test mentions slurs, so I could not re-read what the current denigma output carries. Result today: an MNX file draws no printed slur, `carriesPrintedSlurs` is absent, so the derived melisma slur still draws there. MNX articulations and fermatas are already parsed and are drawn (every kind is drawn off a scan).

## Could not establish

- **The `via`-keyed scan banners** are untouched, as briefed (row 121 is separate).
- **Dann's look at song 1 of row 114 on the alias** (the done state): not possible here; the reader does not run in the lane.
- **Whether the row 114 slur accuracy holds on the voice part.** The in-tree homr fixtures' voice parts carry none; see finding 1.
- **A fermata over a whole-bar rest "at the bar's centre":** the rest event is drawn at its column, not at the bar's centre, so the fermata is centred over the rest as drawn.
- **Inverted fermata and the words:** a fermata below the stave counts as ink (C.4). At the shipping 5.5 px stave it stays inside the underlay's minimum clearance; at larger staves it can lower the words. The default case never does (tested on the fixture).
- **A breath mark or caesura** is placed after its note with JUDGEMENT constants; it reserves no column room, so a close next note could meet it. Not seen on the fixture.
- **Nested slurs** that start on the same note leave from nearly the same point (visible on bar 3 of the fixture); no separation rule was ruled.
- **Articulation side by `placement`:** the parser does not keep an articulation's `placement`, so the side follows C.2 (stem direction and the stave-bottom test), not the file. As a consequence a mark below a stem-up note in the lower half of the stave usually goes above the stave (the fixture's accent on A4 does), which the desk should look at.
- **Primitive mode** (no font) draws printed slurs but no markings.
- The `mini-xml.test-support.ts` copy duplicates `apps/web/.../mini-dom.ts`, as that file's own header says the score-parser test file already did.
