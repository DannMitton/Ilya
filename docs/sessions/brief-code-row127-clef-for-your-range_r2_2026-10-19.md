# Brief for Code, cloud lane: row 127, a line read an octave lower keeps the print's notes, in treble with an 8 below, and the singer can choose bass, r2

r1 written by the desk (Opus) 2026-10-19 22:5x; **r2, 23:1x, applies all ten of Fable's amendments** (review returned 23:1x, SEND WITH AMENDMENTS; none is Dann's to decide). QUEUE row 127. For a cloud session, Sonnet 5.5, on branch `cloud-lane-11`, after row 125 (`61c4e68`). Row 127's QUEUE entry and Dann's words below are not on the branch; this brief carries them.

## What the singer sees today

Dann's voice profile is bass. He dropped the scan of song 2 of row 114 (a song printed in treble clef with three sharps, sung line C4 to A5) on the Shane alias, 2026-10-19 22:45. Ilya reads the line an octave lower for his range (QUEUE row 47) and draws it in plain treble clef at the lowered pitches, so the whole song sits on ledger lines under the stave. The only sign of why is the octave line on the trailing notes page: "Voice line read an octave lower, for your range · As written". Dann: *"It looks to me as if this song has been improperly transcribed into trebl clef? It's a likely explanation for all the ledgerlines I'm seeing"*.

## What Dann ruled

- 2026-10-19 22:50: *"Ok, I want the treble clef with an 8 below in cases liek these. If the user prefers a bass clef they can choose it manually and the score will adjust. Make it so."*
- 2026-10-19 22:49: *"I'm sure I have asked you in the past for a fast and easy optoin for the user to change the clef at will. this is trivial for ILya. Make it so."* (He had, 2026-10-14 01:57: an effortless way to change the clef on the Paper, because comparing the Paper with the printed score was hard.)

(His words are transcribed as written.)

## What the singer sees after this row

1. **The default.** Where a downward octave reading applies to a line printed in treble (`resolveVocalReadingOctave(parsed, range) < 0` and `clefFromSource(parsed.clefs?.[0]?.clef) === 'treble'`, both on the UNSHIFTED score), Markup draws the **treble clef with an 8 below** (`treble-8vb`, glyph `gClef8vb`), and every notehead and every key-signature accidental sits **where the print puts it**. The sung pitches Ilya analyses do not change: they are the lowered ones, as today. Only the drawing changes.
2. **The choice, fast.** A **Clef** row in the Input band's receipt, directly under the TEMPO row, holding one native select with three options, all existing ratified strings:
   - `upload.ask.clefTrebleOttava`, "Treble, sounding an octave lower" (the default; the octave reading on; drawn `treble-8vb`);
   - `upload.ask.clefBass`, "Bass" (the octave reading on; drawn in bass clef at the lowered pitches, so the heads move to their bass-clef places, which is what "the score will adjust" means);
   - `upload.ask.clefTreble`, "Treble" (the line as written: the octave reading OFF, which is today's "As written", `SongRecord.octaveReading === 'as-written'`).
   The row's label is `upload.ask.clef`, "Clef". **No new strings.** The row shows exactly when the condition in item 1 holds (not wherever the octave line shows: the line also shows for an upward reading, `MarkupPane.svelte:586-588`).
3. **One state, two doors.** The octave line's link and the Clef select read and write the same per-song choice. Choosing "Treble" in the select is "As written"; the octave line's "Read for your range" returns to the default, treble with an 8 below; from Bass, the octave line's "As written" goes to as written.
4. **Everywhere Markup draws the line:** the Paper's pages, the printed copy, and the Loupe in Corrections all draw the chosen clef. The Insights compass stave keeps following the singer's range (`apps/web/src/lib/insights/insights.ts:637`); not this row.
5. **Outside the shift case** (a reading of 0 or +1), `'bass'` is inert (shift and clef as today), and `'as-written'` turns a +1 reading off, as today.

DESK DEFAULTS (Dann's to overrule on his look): the row's place (under TEMPO, as its own component, the way `apps/web/src/lib/tempo/TempoReceipt.svelte` is, mounted at `apps/web/src/lib/components/Drawer/IntakePanel.svelte:464`); a select rather than a link and a panel; the row showing only in the case of item 1.

## The code today, as read (desk, then Fable)

- **Why plain treble today:** `shiftVocalOctave` sets `clefs: []` (`packages/score-parser/src/vocal-octave.ts:118-128`, pinned by `vocal-octave.test.ts:190`), so `chooseClef` (`clef-select.ts:45-56`) has no source clef on the shifted score and runs the tessitura heuristic on the lowered pitches; song 2's lowered median is exactly C4, which `clefForMedian` (`:64-66`) reads as treble. The comment at `MarkupPane.svelte:569-575` is right about the mechanism and wrong only about the outcome when the lowered median is at or above C4; correct it in one line.
- **The renderer already places sounding pitches under `treble-8vb`:** `MIDDLE_LINE['treble-8vb']` is B3 (`staff-renderer.ts:442-449`, since N.123, `ccb790c`), and both `yFor` sites use it (`:1519`, `:1851`). A sounding pitch already sits where the print puts it. **Add no second offset anywhere**, and do not shift pitches in Markup to move heads.
- **The key signature is wrong under `treble-8vb`, today:** `KS_OCTAVES` has only `bass` and `treble` (`:967`), and `:2212` routes `treble-8vb` to the treble octaves, so an F♯ sits 11 half-steps above B3, three and a half spaces above the stave, not on the top line. The comment at `:962-966` ("shares the treble tables") has been wrong since N.123; no test checks key-signature y (`staff-renderer.test.ts:2343-2356` checks x only). This row fixes it (work item 1); it affects every score with an octave clef today, not only this case.
- The glyph: `gClef8vb` at `staff-renderer.ts:811` and `:2196`; `options.clef` at `:1680`, `:1836`; `page-layout.ts:160`, `:224`, `:258`.
- **Two Markup call sites resolve the clef:** `paginateScore` at `MarkupPane.svelte:862` is called without `clef` and resolves its own (`page-layout.ts:258`); `onpagesdrawn` at `:940` resolves separately (`chooseClef(readingScore)`), and `apps/web/src/lib/score/loupe-render-bundle.ts:8-20` carries that clef to the Loupe. Both must take the mapping's clef, or the page and the Loupe disagree.
- **The per-song state:** `SongRecord.octaveReading: OctaveReading | null` (`apps/web/src/lib/library/types.ts:35`, `'as-written'` only; `library.ts:63-64`, `:99`, `:118`, `:135`, and the validator at `:240-243`, which accepts only `'as-written'` and calls `malformed()` for anything else; `document.svelte.ts:98-100`, `:290`, `:344`). Flipped by `toggleOctaveReading` (`apps/web/src/routes/+page.svelte:982-983`); passed to Markup as `octaveAsWritten` (`:4508-4509`) and to Insights (`:4473-4474`).
- **How a receipt row reaches the song:** `IntakePanel` is mounted by `+page.svelte:4017` with no song prop; `TempoReceipt` reads the module-level `tempoUi`, bound once at `+page.svelte:985` (`apps/web/src/lib/tempo/tempo-ui.svelte.ts:1-14` says why: the ceilings). The singer's range is `characteristics.rangeLow` / `rangeHigh` (`analyze-score-adapter.ts:279-286`).
- **Ceilings** (`scripts/ratchets.json`): `+page.svelte` 5641, `MarkupPane.svelte` 1371, and `staff-renderer.ts` 3432 are AT their ceilings and may not grow; `IntakePanel.svelte` is 888 lines, under the 1,000-line limit. Lower any ceiling a file falls under.

## The work

1. **The key signature under `treble-8vb`.** At `staff-renderer.ts:2224`, lower the table octave by one when `clef === 'treble-8vb'` (or give `KS_OCTAVES` a `treble-8vb` entry an octave below treble), and correct the comment at `:962-966`. Net zero lines in `staff-renderer.ts`.
2. **The mapping.** A new module beside `tempo-ui.svelte.ts`: `apps/web/src/lib/score/clef-ui.svelte.ts` (or a pure `clef-choice.ts` plus the binding; your call). A pure function takes the UNSHIFTED `parsed`, the singer's range, and the choice, and returns `{ shift, clef }`, reading the source clef with `clefFromSource(parsed.clefs?.[0]?.clef)`, never from `printedReading` or `readingScore`. In the case of item 1: default gives shift −1 and `'treble-8vb'`; `'bass'` gives −1 and `'bass'`; `'as-written'` gives 0 and the source clef. Outside that case: as today (item 5 above), and a source `treble-8vb` clef with shift 0 (MusicXML and denigma, `vocal-octave.ts:60-78`) stays `treble-8vb`.
3. **The binding**, as `tempoUi` does: `bind(() => doc, () => correctedScore?.result.score, () => voiceCharacteristics)` (use the names `+page.svelte` has), exposing `choice`, `choose`, `toggle`, and `shown`, where `shown` is the condition of item 1. `toggle` replaces `toggleOctaveReading` and becomes `choice === 'as-written' ? null : 'as-written'`. In `+page.svelte`: delete `:982-983`, add one import and one `bind` line under the row 48 comment at `:984`; net zero.
4. **The state.** Widen `OctaveReading` to `'as-written' | 'bass'`; `null` stays "for your range", which now draws treble with an 8 below in the case of item 1. Widen the validator at `library.ts:242` to accept both; the bad-value test at `library.test.ts:143-150` stands. Old stored songs read exactly as today.
5. **Markup.** `MarkupPane`'s prop `octaveAsWritten` (`:267-268`, `:300`) becomes `octaveReading?: OctaveReading | null`; `OctaveReading` joins the existing `$lib/library/types` import at `:60`; the `chooseClef` import at `:71` goes. `octaveShift` and the clef come from the mapping; pass the clef to `paginateScore` (`:862`) and to `onpagesdrawn` (`:940`). The page passes `doc.octaveReading` at `:4508`. `InsightsPane` keeps its boolean at `:4473`, unchanged (`'bass'` is not `'as-written'`, so its shift still applies). Net zero or fewer lines in `MarkupPane.svelte` and `+page.svelte`.
6. **The row.** `ClefReceipt.svelte` beside `TempoReceipt.svelte`, mounted under it in `IntakePanel.svelte`, styled with the receipt's existing values as `TempoReceipt.svelte:1-22` explains. A native `<select>`, its accessible name the label, shown when `shown`; changing it calls `choose`, so it saves and restores with the song.
7. **The octave line** (`apps/web/src/lib/components/OctaveLine.svelte`) is unchanged in words and look; `applied` is true for the default and for Bass.
8. **Nothing else.** No new or changed strings. No change to `shiftVocalOctave`, `chooseClef`, `clefFromSource`, `MIDDLE_LINE`, `resolveVocalReadingOctave`, the analysis pitches, Insights' compass stave, Corrections' controls or entry verbs, or taps on the notation (N.162).

## Tests and the done state

1. **The mapping, unit tests:** every case of work item 2, including a source `treble-8vb` with shift 0, a bass-clef source, a +1 reading with `'bass'` (inert) and with `'as-written'` (off), and no shift.
2. **The render, on a named fixture:** take `demoScore()` (`packages/score-parser/src/staff-renderer.test.ts:676-690`; bass, `fifths: 0`), set its `clefs` to G2, raise its pitches to span C4 to A5, and set `fifths: 3` in `keySignatures` and in every measure. Render (a) as written with `clef: 'treble'`; (b) `shiftVocalOctave(…, −1)` with `'treble-8vb'`; (c) the same shifted score with `'bass'`. Assert: every notehead y equal between (a) and (b); every `data-key-signature` glyph y equal between (a) and (b); `gClef8vb` in (b); `fClef` in (c). Do not use `scoreOf` from `vocal-octave.test.ts:26` (it has `measures: []`).
3. **Persistence:** a song saved with `'bass'` restores with `'bass'`; stored `null` and `'as-written'` restore as before.
4. **The toggle:** from null to `'as-written'`, from `'as-written'` to null, from `'bass'` to `'as-written'`.
5. Every existing test passes unchanged, the approved SVGs included. If an approved SVG or a test changes (for example one that pinned the key signature under `treble-8vb`), stop and report it; do not edit or re-approve it.
6. Pictures (`docs/sessions/row127-shots/`): the fixture in Markup at 1,440 px and 390 px in all three choices, and the Input band with the Clef row, closed and with the select focused.
7. Gates: phonology 267, dictionary 248, web-check 0 errors and 12 warnings, web-test 2850 plus your new tests, score-parser 753 plus your new tests (5 skipped), blurb 145, integration 55, ratchets OK. No ceiling raised.
8. **DONE** is Dann's look at song 2 on the alias after the merge.

## The lane

Branch `cloud-lane-11`, after row 125, its own commit and push. Never `Shane` or `main`; no pull request; Dann merges. Do not merge or rebase `Shane` or `main` into the lane. Do not edit `docs/memory/`. Never commit a `brief-code-*` file: the brief lives in `/tmp/briefs` only. Commit subject: `Row 127: a line read an octave lower keeps the print's notes, and the singer can choose bass`. Report: `docs/sessions/report-code-row127_r1_2026-10-19.md`, with the diff by file and line, the line counts of the three files at their ceilings before and after, the test counts, the pictures, and a section "Could not establish". NOT ESTABLISHED beats a complete invented answer.
