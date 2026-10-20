# Brief for Code, cloud lane: N.188, Markup draws the printed slurs and note markings, r1

**SUPERSEDED 2026-10-19 20:2x by r2** (`brief-code-n188-markings-drawn_r2_2026-10-19.md`). Do not send this version.

Written by the desk (Opus) 2026-10-19 19:40. QUEUE row 120 (DESK DEFAULT number). For a cloud session, Sonnet 5.5, on branch `cloud-lane-11`. **Fable reviews this brief before it is sent** (Dann 2026-10-19 19:3x: *"I want that brief to run past Fable for review"*; `CONTRACT.md` §1 item 19). No strings change, so no French is owed.

Displaces: nothing in the cloud lane; it runs before N.192 with N.190 (`STATE.md`, close item c).

## What the singer sees

1. On a song read from a scan or a photograph, Markup draws the slurs, accents, and fermatas the print carries, where the print carries them.
2. On a song from a MusicXML file, Markup draws every slur and note marking the file carries.
3. A melisma's slur is the printed slur. Ilya does not add one of its own to a score that prints slurs.
4. A fermata over a rest is drawn, a whole-bar rest included.
5. The markings print with the page and appear in the loupe: they are notation, not controls (`CONTRACT.md` §8).
6. The words under the notes never move lower to make room for a marking.

## Why

- **Dann, 2026-10-19 12:51** (`OPEN.md` §N.188): *"We need to have our reader preserve accent markins staccati, and other note-applied markings."* (transcribed as written). N.188 was widened to slurs the same afternoon (`STATE.md`, close of 2026-10-19).
- **The principle, ruled by Dann 2026-10-19 15:26** (`PRODUCT.md`, "WHAT THE READER ALREADY HAS, ILYA DOES NOT THROW AWAY AND GUESS BACK BY RULE"): a read score starts as an accurate replication of the print; its slurs, accents, staccati, and other note markings are kept from the reader's output and drawn as printed; Ilya's own rules, the melisma slur among them, serve only what the singer enters. **Its condition:** a kind of mark is drawn once its measured accuracy on Dann's proofed pages earns it, so a detection error is not drawn as the composer's.
- **The measure, 2026-10-19 19:2x** (QUEUE row 114, `docs/sessions/report-code-row114-measure_r1_2026-10-19.md`): Dann's scans of four songs, 15 proofed pages, read on the deployed alias on WebGPU. In the reader's stored MusicXML, on the notes the scorer matched: slur starts 45 of 46 kept, 2 extra; slur stops 46 of 46, 3 extra; accents 10 of 13, none extra; fermatas 4 of 4, none extra; tenuti 0 of 3, none extra. Staccati, staccatissimi, strong accents, and breath marks: none printed on those pages, so unmeasured.

## What exists, read by the desk 2026-10-19 at `ba6f064`

- **The reader writes them.** homr-web writes `<slur number type>` with no `placement` (`third_party/homr-web/src/musicxml/generate-main.ts:388-413`, `buildSlurs`; a note that ends one slur and starts the next gets `stop` then `start`), and writes articulations and fermatas (`generate-main.ts:324-339`, per `docs/sessions/audit-sonnet-what-the-reader-discards_r1_2026-10-19.md`, rows 31 to 35).
- **The parser drops slurs.** `packages/score-parser/src/musicxml-parser.ts` has no occurrence of `slur` (desk grep). It keeps articulations through `MARKING_TO_ARTICULATION` (`:253-264`) in the notations block (`:780-797`), and keeps a fermata on notes only: `if (notations && !isRest)` (`:784`).
- **The event carries the rest:** `fermata?: FermataInfo` (`packages/score-parser/src/types.ts:518`, `FermataInfo` at `:622`), `articulations?: Articulation[]` (`:525`), the union at `:638-648`.
- **Markup draws none of them.** `packages/score-parser/src/staff-renderer.ts` reads neither `articulations` nor `fermata` (desk grep). It derives a melisma slur from syllable absence (`:2375-2410`), with the tie-on-unison exception (`:2398-2405`), and draws it with `arcOutline` (`packages/score-parser/src/arc-outline.ts`, imported at `staff-renderer.ts:53`); the syllabic slur's head anchor and clearance constants and their history are at `staff-renderer.ts:893-912`. The singer's own melisma marks draw no slur, on purpose (`:2428-2431`).
- **What already uses them:** phrase ends (`apps/web/src/lib/score/phrase-ends.ts:32-36`: a rest already ends a phrase, so a fermata kept on a rest changes nothing there) and the held-note measure (`packages/score-parser/src/conditions.ts:312`, over a chain's note members).
- **Where a scan is known:** the ingest provenance `{ format: 'musicxml'; via: 'reader'; sourceFormat: 'pdf' | 'image' }` (`apps/web/src/lib/score/ingestion/ingest.ts:56`), read already at `apps/web/src/lib/score/ScoreUploader.svelte:762`.
- **The glyphs exist in all three faces Ilya ships** (desk check of `apps/web/static/fonts/finale-maestro/FinaleMaestro.json`, `bravura/bravura_metadata.json`, `leland/leland_metadata.json`, `glyphBBoxes`): `articAccent`, `articMarcato`, `articTenuto`, `articStaccato`, `articStaccatissimo`, `articTenutoStaccato`, `articStress`, `articUnstress`, each `Above` and `Below`; `fermataAbove`, `fermataBelow`, `breathMarkComma`, `caesura`. `breathMarkTick` is absent from Leland, so the breath mark is `breathMarkComma`. Required glyphs are named in `SMUFL_CODEPOINTS` (`packages/score-parser/src/smufl-metadata.ts:134-136`).
- **Ceilings** (`scripts/ratchets.json`): `staff-renderer.ts` 3489 and `musicxml-parser.ts` 1168, each at its ceiling today; a new file may run to 1000 lines.
- **Gould,** as the project's extraction words her rules (`claude/gould-vocal-engraving-rules_v7_2026-08-05.md` in project knowledge, read as search snippets by the desk): rule 70 (p. 435), non-legato within a syllable is shown with dots, tenutos, or accents inside the slur; rule 71 (p. 436), short syllabic slurs hug the noteheads, may flip above the stave for pitches below it to keep the text level, and long ones go above the stave clear of text; rule 74 (p. 434), articulation at the notehead or above the stave, and it moves above whenever it would push the text lower; rule 174 (in the doc's summary item 26), a tie and a slur over the same notes curve in opposite directions.
- **Dann's slur end-point rule, 2026-10-19 15:5x** (`OPEN.md`, "SLURS AND TIES DRAWN WITH A SHOULDER, NOT A PARABOLA", the CORRECTED paragraph): a slur's ends sit at the noteheads by default; where anchoring both ends to heads would force a steep or deep curve to clear an inner note, the end moves off its head toward the stem to keep the arc shallow.

## What to build

**A. The parser keeps slurs, and fermatas on rests.**
1. Each event carries its printed slur ends from `<notations><slur>`: type (`start` or `stop`), number, and `placement` when the file gives one; a note that stops one slur and starts another keeps both, in document order. Name the field to fit `types.ts`.
2. A fermata on a rest is kept, as on a note.
2a. Grace notes are dropped by the parser today (`musicxml-parser.ts:706-708`; N.187 draws them later), and Dann's page 2 slurs a syllable through its graces (`~/Downloads/_colleague-pages/truth/MARKINGS.md`, p02, bar 6). A slur start on a dropped grace note moves to the next kept note; a slur stop on one moves to the last kept note before it. An end left with no partner draws nothing and adds one parser warning.
3. Nothing else in the parser's output changes. Move the notations block into a new module if that is what keeps `musicxml-parser.ts` at or under 1168.
4. MNX (the `.musx` path): report whether MNX carries slurs (`packages/score-parser/src/mnx-parser.ts:23` says slurs are not parsed there). Do not build it here.

**B. Markup draws the printed slurs.**
1. Pair a start with the next stop of the same number on the voice line, across bars and across system breaks. A slur that crosses a system break draws as two halves, the way the renderer draws a tie across a break today; read that code and follow it, and if ties are not drawn across a break either, say so in the report.
2. Direction: the file's `placement` when given; otherwise the rule the syllabic slur already follows (Gould rule 71). A printed slur and a tie over the same notes curve in opposite directions (Gould rule 174).
3. Ends: at the noteheads, at the tie's head distance the syllabic slur already uses (`staff-renderer.ts:893-912`). Dann's end-point rule decides the exception: where both ends at heads would force a steep or deep curve to clear an inner note, move an end off its head toward the stem until the arc is shallow. Write the threshold as a named constant with a comment saying where it came from.
4. The curve: `arcOutline` unchanged. The cubic "shoulder" in the same `OPEN.md` section is a later fine-tuning step, so ties and every arc drawn today keep their shape (DESK DEFAULT).
5. **The derived melisma slur:** on a score whose voice line carries any printed slur, it is not drawn; on a score that carries none, it is drawn as today. The extender, the hyphens, and the melisma's left-aligned syllable are unchanged. Source: the principle's sentence on the melisma slur (DESK DEFAULT on the whole-score test; Dann's to overrule).

**C. Markup draws the note markings and fermatas.**
1. One glyph per marking, from the `Above` and `Below` pairs listed in the facts; `detached-legato` is `articTenutoStaccato`; `breath-mark` is `breathMarkComma`; `caesura` is `caesura`. Add each to `SMUFL_CODEPOINTS`.
2. Placement: at the notehead on the side away from the stem, unless that side is under the stave, where it would push the words lower; then above the stave (Gould rule 74). Where a marking and a slur meet at a note, the marking sits between the notehead and the slur (Gould rule 70). A staccato, staccatissimo, or tenuto at the notehead sits in a space, not on a line.
3. A fermata goes above the stave, centred on its note or rest; on a whole-bar rest, over the rest at the bar's centre. A breath mark sits above the stave, after its note.
4. Markings print and appear in the loupe because they are drawn by the same renderer; check both.

**D. Which kinds are drawn on a read scan.** One list, in one place, of the kinds drawn when the provenance is `via: 'reader'`: **slurs, accents, fermatas**. Every other kind stays in the data and is not drawn on a read scan until a measure on Dann's proofed pages earns it. The test (DESK DEFAULT, from the principle's condition): of the marks of that kind the reader writes on the proofed pages, at least 9 in 10 are printed. Tonight's figures: slur ends 91 of 96 written (5 extra), accents 10 of 10, fermatas 4 of 4. On a MusicXML or MNX file every kind is drawn.

## Not in this brief

Corrections adding and removing markings (N.188 step 4, after N.177's dynamics layer); the reader's tenuti, 0 of 3 (whether those three are printed as a line or as the word *ten.* is NOT ESTABLISHED; the word form is the N.178 addendum); expressions above the staff (N.178 addendum); the cubic slur shoulder; homr's turning a slur between two notes of one pitch into a tie (`generate-main.ts:835-851`, per the audit, row 35); MNX slurs; N.190 and N.192.

## Tests and the done state

1. Parser: a slur's start, stop, and number; stop then start on one note; nested slurs numbered 1 and 2; a fermata on a rest and on a whole-bar rest. Existing parser tests pass unchanged.
2. A fixture MusicXML written into the tree beside the score-parser tests, holding: a slur over a melisma, a slur over two syllables, nested slurs, a slur across a system break, an accent above and one below, a tenuto, a staccato, a fermata on a note and one on a whole-bar rest, and a breath mark. Renderer tests assert one glyph per marking on the side section C gives, one arc (or two halves) per printed slur, no derived melisma slur on this fixture, and a derived melisma slur still drawn on a fixture that carries no slurs.
3. Section D: a render with `via: 'reader'` draws the slurs, accents, and fermatas and no tenuto or staccato; a render from a MusicXML file draws all of them.
4. Phrase ends and the held-note measure: unchanged; add one test that a fermata on a rest changes no phrase end and no held count.
5. Any existing test that pinned a derived melisma slur on a score that carries printed slurs is changed on purpose; name each in the report.
6. All eight gates at baseline, with web-test and score-parser counts reported. No ceiling in `scripts/ratchets.json` is raised; `staff-renderer.ts` and `musicxml-parser.ts` end at or under theirs, with new work in new modules.
7. Pictures: the fixture in Markup in English at 1,440 px and at 390 px, and in the print preview, saved to `docs/sessions/n188-shots/`.
8. **DONE** is Dann's look at song 1 of row 114 on the alias after the merge, the desk's walk first.

## The lane

- Branch `cloud-lane-11` (DESK DEFAULT: no new branch for Dann to make). First step: merge `origin/Shane` into it (`Shane` is ahead by docs only).
- Commit to `cloud-lane-11` and push it. Never `Shane` or `main`; no pull request; Dann merges.
- Do not edit `docs/memory/`. Commit the report and the pictures.

## Report

`docs/sessions/report-code-n188-markings-drawn_r1_2026-10-19.md`: what was built, by file and line; the test and gate counts; each changed test by name; what the end-point threshold is and why; the MNX finding; the pictures' paths; and a section "Could not establish". NOT ESTABLISHED beats a complete invented answer.
