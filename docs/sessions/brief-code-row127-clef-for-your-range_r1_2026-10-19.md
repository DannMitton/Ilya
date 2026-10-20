# Brief for Code, cloud lane: row 127, a line read an octave lower keeps the print's notes, in treble with an 8 below, and the singer can choose bass, r1

> **SUPERSEDED by r2** (`brief-code-row127-clef-for-your-range_r2_2026-10-19.md`, 2026-10-19 23:1x), which applies Fable's ten amendments (`review-fable-brief-row127_r1_2026-10-19.md`). r1 misdiagnosed why the line draws in plain treble and did not know the renderer already offsets `treble-8vb`. Kept for the record; do not send.

Written by the desk (Opus) 2026-10-19 22:5x. QUEUE row 127. For a cloud session, Sonnet 5.5, on branch `cloud-lane-11`, after row 125 (`61c4e68`). Fable reviews this brief before Code gets it (`CONTRACT.md` §1 item 19). Row 127's QUEUE entry and Dann's words below are not on the branch; this brief carries them.

## What the singer sees today

Dann's voice profile is bass. He dropped the scan of song 2 of row 114 (a song printed in treble clef, sung line C4 to A5) on the Shane alias, 2026-10-19 22:45. Ilya reads the line an octave lower for his range (QUEUE row 47) and draws it in plain treble clef at the lowered pitches, so the whole song sits on ledger lines under the stave. The only sign of why is the octave line on the trailing notes page: "Voice line read an octave lower, for your range · As written". Dann: *"It looks to me as if this song has been improperly transcribed into trebl clef? It's a likely explanation for all the ledgerlines I'm seeing"*.

## What Dann ruled

- 2026-10-19 22:50: *"Ok, I want the treble clef with an 8 below in cases liek these. If the user prefers a bass clef they can choose it manually and the score will adjust. Make it so."*
- 2026-10-19 22:49: *"I'm sure I have asked you in the past for a fast and easy optoin for the user to change the clef at will. this is trivial for ILya. Make it so."* (He had, 2026-10-14 01:57, walking «Средь шумного бала»: an effortless way to change the clef on the Paper, because comparing the Paper with the printed score was hard.)

(His words are transcribed as written.)

## What the singer sees after this row

1. **The default.** Where a downward octave reading applies to a line printed in treble (the case the octave line already detects: `suggestedShift < 0`, `apps/web/src/lib/markup/MarkupPane.svelte:577-587`, and the source clef is a G clef with no octave change), Markup draws the **treble clef with an 8 below** (`treble-8vb`, glyph `gClef8vb`), and every notehead sits **where the print puts it**. The sung pitches Ilya analyses do not change: they are the lowered ones, as today. Only the drawing changes.
2. **The choice, fast.** A **Clef** row in the Input band's receipt, directly under the TEMPO row, holding one select with three options, all existing ratified strings:
   - `upload.ask.clefTrebleOttava`, "Treble, sounding an octave lower" / « Clé de sol, à l’octave inférieure » (the default; the octave reading on; drawn `treble-8vb`, heads as printed);
   - `upload.ask.clefBass`, "Bass" / « Clé de fa » (the octave reading on; drawn in bass clef; the heads move to their bass-clef places, which is what "the score will adjust" means);
   - `upload.ask.clefTreble`, "Treble" / « Clé de sol » (the line as written: the octave reading OFF, which is today's "As written", `SongRecord.octaveReading === 'as-written'`).
   The row's label is `upload.ask.clef`, "Clef" / « Clé ». **No new strings.** The row shows only where the octave line shows today (a downward reading applies to a treble line); elsewhere nothing changes.
3. **One state, two doors.** The octave line's "As written" / "Read for your range" link and the Clef select read and write the same per-song choice, so each always shows the other's state. Choosing "Treble" in the select is "As written"; the octave line's "Read for your range" returns to the default, treble with an 8 below.
4. **Everywhere Markup draws the line:** the Paper's pages, the printed copy, and the Loupe in Corrections all draw the chosen clef. The Insights compass stave keeps following the singer's range (`apps/web/src/lib/insights/insights.ts:637`, ruled 2026-09-11); it is not this row.

DESK DEFAULTS (Dann's to overrule on his look): the row's place (under TEMPO, as its own component, the way `apps/web/src/lib/tempo/TempoReceipt.svelte` is, mounted at `apps/web/src/lib/components/Drawer/IntakePanel.svelte:464`); a select rather than a link and a panel (one tap to the choice, and no new string); the row showing only in the shift case.

## The code today, as the desk read it

- `packages/score-parser/src/clef-select.ts:45-56`: `chooseClef` returns the **source** clef when it can draw it (`clefFromSource`, `:33-37`), so a shifted treble line keeps `'treble'`; the tessitura heuristic runs only without a source clef. `RenderClef` is `'treble' | 'treble-8vb' | 'bass'` (`:24`). The renderer already draws `gClef8vb` (`staff-renderer.ts:810`, `:2195`) and takes `options.clef` (`:1680`, `:1836`; `page-layout.ts:160`, `:224`, `:258`).
- `MarkupPane.svelte:577-580`: `octaveShift` is `suggestedShift` unless `octaveAsWritten`; `printedReading` is `shiftVocalOctave(parsed, octaveShift)`; `:940` passes `chooseClef(readingScore)` to `onpagesdrawn`. The comment at `:569-575` says a shifted-down line "lands in bass clef via the tessitura heuristic", which `chooseClef`'s source-clef branch no longer lets happen; correct the comment.
- `apps/web/src/lib/score/loupe-render-bundle.ts:8-20` carries the clef `paginateScore` resolved.
- The choice is stored per song as `SongRecord.octaveReading: OctaveReading | null` (`apps/web/src/lib/library/types.ts:35`, `'as-written'` only; `library.ts:63-64`, `:99`, `:118`; `document.svelte.ts:98-100`, `:290`, `:344`), flipped by `toggleOctaveReading` (`apps/web/src/routes/+page.svelte:983`) and passed to Markup as `octaveAsWritten` (`:4473-4474`, `:4508-4509`).
- **Ceilings** (`scripts/ratchets.json`): `+page.svelte` 5641 and `MarkupPane.svelte` 1371 are AT their ceilings and may not grow; move code out to a module if you add any. `IntakePanel.svelte` is 888 lines, under the 1,000-line limit for a file with no ceiling. Lower any ceiling a file falls under.

## The work

1. **The drawing.** When a downward reading is applied to a line whose first source clef maps to `'treble'`, render with `'treble-8vb'`, and make sure a `treble-8vb` staff puts each SOUNDING pitch one octave above its treble place, so the heads land where the print has them. Read how `staff-renderer.ts` positions notes under `'treble-8vb'` today and say in the report what you found; if it does not offset, add the offset there, not in Markup. When the singer chooses Bass, render with `'bass'` at the lowered pitches. When the singer chooses Treble (as written), nothing is shifted and the source clef is drawn, as today.
2. **The state.** Widen `OctaveReading` to `'as-written' | 'bass'`; `null` stays "for your range", which now draws treble with an 8 below. Old stored songs read exactly as today (null or `'as-written'`). One function (new module, not `+page.svelte`) maps the choice and the parsed score to the shift and the render clef, and Markup, the Loupe, and print all call it.
3. **The row.** A new `ClefReceipt.svelte` beside `TempoReceipt.svelte`, mounted under it in `IntakePanel.svelte`, styled with the receipt's existing values as `TempoReceipt.svelte:1-22` explains. A native `<select>` (keyboard and screen-reader accessible as is), its accessible name the label. It appears only in the shift case. Changing it writes the per-song choice through the same path the octave line's toggle uses, so it saves and restores with the song.
4. **The octave line** (`apps/web/src/lib/components/OctaveLine.svelte`) is unchanged in words and look; it reads `applied` from the same state (Bass and Treble-8 are both "applied").
5. **Nothing else.** No new or changed strings. No change to how the shift is detected (`resolveVocalReadingOctave`), to the analysis pitches, to Insights' compass stave, to Corrections' controls, or to taps on the notation (N.162).

## Tests and the done state

1. Unit tests for the mapping function: default on a treble source with a downward shift gives shift −1 and `'treble-8vb'`; Bass gives −1 and `'bass'`; as written gives 0 and the source clef; a bass-clef source, an upward shift, and no shift are unchanged from today.
2. A render test on a fixture: a treble line spanning C4 to A5 (copy the pitches of the first eight notes of any existing treble fixture if one fits; otherwise write eight notes) read with a downward shift: the SVG carries the `gClef8vb` glyph, and each notehead's y equals its y in the as-written render (heads where the print has them). With Bass: the `fClef` glyph, heads at bass positions.
3. Persistence: a song saved with `'bass'` restores with `'bass'`; a stored song with `null` or `'as-written'` restores as before.
4. Every existing test passes unchanged, the approved SVGs included (no approved fixture is a downward-shift case; if one is, stop and report it). If a test pinned plain treble for a shifted line, stop and report it; do not edit it.
5. Pictures (`docs/sessions/row127-shots/`): the fixture in Markup at 1,440 px and 390 px in all three choices, and the Input band with the Clef row, closed and with the select focused.
6. Gates: phonology 267, dictionary 248, web-check 0 errors and 12 warnings, web-test 2850 plus your new tests, score-parser 753 plus your new tests (5 skipped), blurb 145, integration 55, ratchets OK. No ceiling raised.
7. **DONE** is Dann's look at song 2 on the alias after the merge.

## The lane

Branch `cloud-lane-11`, after row 125, its own commit and push. Never `Shane` or `main`; no pull request; Dann merges. Do not merge or rebase `Shane` or `main` into the lane. Do not edit `docs/memory/`. Never commit a `brief-code-*` file: the brief lives in `/tmp/briefs` only. Commit subject: `Row 127: a line read an octave lower keeps the print's notes, and the singer can choose bass`. Report: `docs/sessions/report-code-row127_r1_2026-10-19.md`, with what you found about `treble-8vb` positioning, the diff by file and line, the test counts, the pictures, and a section "Could not establish". NOT ESTABLISHED beats a complete invented answer.
