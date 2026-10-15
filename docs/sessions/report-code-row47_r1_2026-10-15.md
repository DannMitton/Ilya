# Report: row 47, the voice line read an octave up or down for the singer's range (r1, 2026-10-15)

Lane: a Claude Code cloud session on `cloud-lane-9`, after row 5 in the same session. Brief: `brief-code-octave-for-your-range_r1_2026-10-08.md` with the amendments of `review-fable-brief-row47_r1_2026-10-15.md` (all twelve applied). Row 5's ceiling for `+page.svelte` was 5638 when this row started.

WRITTEN on the code. DONE is Dann's look after his merge: a cloud branch has no Vercel preview since row 98 (`10d6553`, builds only `Shane` and `main`).

## What was built, with `path:line`

1. **The resolver reads both ways, from any present clef** (`packages/score-parser/src/vocal-octave.ts`). The `marked <= -1` block is first and unchanged in its words and its three measured notes. Past it, with a typed range and at least one pitched note, `-1`, `0`, and `+1` are scored (`vocal-octave.ts:105-113`) and the strictly greatest fraction wins; any tie with as written is `0`, and where `-1` and `+1` both beat `0` and tie each other it is `0` (DESK DEFAULT, from the review). The module header and the function's doc are rewritten in the file's own voice with Dann's words of 2026-10-08 01:11 to 01:20. **One reading of the review I should name:** "for any clef" is read as any PRESENT clef (G, F, C). An absent clef still returns `0`, because the existing test "does not shift when there is no source clef" pins it and the render's own heuristic routes that case. NOT ESTABLISHED whether Dann wants an absent clef judged by range too.
2. **The preference is stored as N.94 stores the key.** `SongRecord.octaveReading?: 'as-written'` (`apps/web/src/lib/library/types.ts:147`, the type at `:24`); `SongFields.octaveReading` (`library.ts:63`), read at `:91`, dropped from the record when null at `:105` and `:122`; `validateRecord` carries only the one allowed value and calls anything else malformed (`library.ts:221-222`); the document's `$state` with save and load (`document.svelte.ts:99`, `:267`, `:317`). **Name chosen by me** (the review left it to Code): `octaveReading`, value `'as-written'`; absent or null means "for your range", the default. A record without the field reads as today. No new save site: it rides the snapshot the document already writes.
3. **One component, both tabs** (`apps/web/src/lib/components/OctaveLine.svelte`, 104 lines): the circled 8 (a 16 px ring in the current ink, as `.legend-circle` draws Transcribe's circles), the state sentence, a middle dot, and a real button. The dot and the button do not print (`@media print`), as the page's other controls do not (`CONTRACT.md` §6). A copy a pane draws only to measure takes no focus.
   - **Insights:** a new block kind `octave` (`singer-blocks.ts:61`) pushed directly after the phonation sentence (`singer-blocks.ts:368`, the line after the `phonationHeadline` push at `:367`); `SingerBlock.svelte` draws it; `InsightsPane.svelte` computes `suggestedShift` and `octaveShift` (`:153-154`) and hands the block its input (`:395`).
   - **Markup:** `NotesColumn`'s `octave` prop is now `{ shift, applied } | null` plus `language` and `ontoggleoctave` (`NotesColumn.svelte`), and keeps its place in the column's order (after the withheld statement, before the watch band). `MarkupPane.svelte:571-581` computes the same two values and `octaveLine`.
4. **How the choice reaches the panes.** The page passes `octaveAsWritten` and `ontoggleoctave` at the two call sites, as `{keyRuler}` is passed (`+page.svelte:4480-4481` Insights, `:4513-4514` Markup), with one three-line function `toggleOctaveReading`. When the choice is "as written" each pane's `octaveShift` is `0`, and `printedReading`, `readingScore`, `keyRuler.draw`, `analysisScore`, and `underlayResolvers` follow with no second switch. Nothing else was added to `+page.svelte`. Only these two panes call the resolver (grep: no other call site).
5. **The five strings** are Dann's ratified wording of 2026-10-08 01:20, added exactly as the brief gives them, as `octave.readLower`, `octave.readHigher`, `octave.asWrittenState`, `octave.toAsWritten`, `octave.toForRange` (`i18n.ts:1330-1334`). They are the only strings added, and nothing was composed by me: this is the one place the batch's "write no new user-facing string" meets a ratified table, and I read the ratification as the exception. If that reading is wrong, the five lines and the component are the whole of it. French carries the typographic apostrophe, no colon, and no guillemets (the French gate reads every value and passes). `profile.octaveNotice` stays at `i18n.ts:1321-1326` with a comment that it is retired from Markup by row 47 and drawn by nothing. `OCTAVE_NOTICE` and `showOctaveNotice` are removed from `MarkupPane.svelte`, with their 2026-07-18 approval date carried into the new comment.

## Ceilings

- `+page.svelte`: 5638 to 5644, raised by exactly the 6 lines this row adds (four props, the three-line function, less one), as `scripts/ratchets.json:2` allows. Count in the commit message.
- `MarkupPane.svelte`: 1358 to 1363, raised by 5 and not by thinning the component. The notice's three lines left (`:569-571` at `14e2ff8`); the two new props, their defaults, the two derivations, and the comment that records the retirement came in. The component keeps the line's markup out of the pane, as the review asked.
- `InsightsPane.svelte` is 764 against a ceiling of 1351; I did not lower it (it was already lowerable by the same ratchet before this row).

## Gates, all eight

| Gate | Start (row 5's end) | Result |
|---|---|---|
| 1 phonology | 251 | 251 passed |
| 2 dictionary | 248 | 248 passed |
| 3 web-check | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files |
| 4 web-test | 2580 | **2591 passed** (+11: library 5, singer-blocks 4, i18n 2) |
| 5 score-parser | 675 passed, 5 skipped | **683 passed, 5 skipped** (+8, `vocal-octave.test.ts`) |
| 6 blurb | 145 | 145 passed |
| 7 integration | 55 | 55 passed |
| 8 ratchets | OK | OK |

Playwright, `--project=chromium`, whole suite at the head of this row: **65 passed, 2 failed, of 67** (the 58 that passed at row 5's end, plus this row's 7).  The two failures that were already there at `14e2ff8` (`insights-page.test.ts:95`, `singer-paths.test.ts:169`) are discussed in row 5's report and are not touched here.

## Tests

- `vocal-octave.test.ts` (the lines are built in the test, in MIDI numbers worked out in comments; no fixture's pitches): a treble line high for a bass (`-1`, as before); a bass-clef line low for a mezzo (`+1`, new); a treble line low for a soprano (`+1`); `+1` preferred over `-1` where it fits more; a line that fits as written, from F and C clefs, even where a shift fits equally (`0`); a line that fits neither better (`0`); `-1` and `+1` both beating as written and tying (`0`); no range, and no pitched note (`0`); the `marked <= -1` branch unchanged for MusicXML, denigma MNX, and plain MNX, with a range that would pull it up. One existing test was renamed ("never shifts a bass-clef part" became "leaves a bass-clef part that fits as written"), because the old name would now be false; its assertion is unchanged.
- `library.test.ts`: absent by default and written back absent; round trip; turning it back removes it; any other value is malformed and not carried; the key choice beside it undisturbed.
- `singer-blocks.test.ts`: the block sits directly under the phonation sentence, in the totals, followed by the sources line; absent where no shift applies; still placed where there is no sentence.
- `i18n.test.ts`: the five strings carry the ratified words in both languages and are the only `octave.*` keys; the French has the typographic apostrophe and no colon or guillemet.
- `e2e/octave-line.test.ts` (7 tests, Playwright). **Upward:** `sunless-01-engraved.musicxml` (voice part Bass, F clef) with a seeded mezzo range A3 to A5. **Downward:** `tchaikovsky-op38-3-voice.musicxml` (treble) with a seeded bass range E2 to E4. The range is seeded into `shane.profiles.v2` as `docs/sessions/n174-c2/voiced.test.ts` seeds its test voice (a desk-built voice, not a singer's). Per song: the line appears in Insights and in Markup, in the state the range asks for; a tap in Insights flips it to "as written", the Markup tab follows, and a tap there flips it back; the choice survives a reload in the same browser context (the library is IndexedDB); French shows both states in both tabs. One more test: Sunless with a range wide enough to hold the line either way shows no line in either tab. All 7 pass. Not run as a control against `14e2ff8`, because the line does not exist there to look for.

## Screenshots

`docs/sessions/octave-shots/`, 16 files, desk viewport 1,440 by 900, written by `OCTAVE_SHOTS=1` on the e2e test above: for each of the two songs, Insights and Markup, English and French, "for your range" and "as written", named `<song>-<tab>-<lang>-<state>.png`. I looked at two of them (Sunless, Markup and Insights, English, for your range): the line reads « ⑧ Voice line read an octave higher, for your range · As written », with the dot and a link-styled tap, on the trailing notes sheet in Markup and directly under the vowel figure's notes in Insights. NOT looked at: the other fourteen.

## What I saw on the page, for the desk

- **The Markup engraving follows the reading, up as well as down.** With the mezzo range, Sunless's bass line (written in F clef) is drawn in G clef, an octave up, and the tap returns it to F clef as written. The review's open question, whether the tessitura heuristic re-picks a clef for a line shifted up, is answered: it does. The brief's introduction says "the printed score untouched"; what is untouched is the stored score, as before for the downward case. Whether a singer should see the engraving change is Dann's call.
- **Where the line sits in Insights.** After the phonation block's last sentence in the totals squircle, before the sources line. The phonation sentence the brief means is the `phonationHeadline` string, and it can be null; then the line still sits where the sentence would, which is just before the sources line.
- **The line does not appear in Insights when nothing is sung or no voice is measured**, because those pages carry no totals block. In Markup it appears whenever a shift applies, measured voice or not.

## For row 48, which follows

The quiet line sits immediately after the phonation sentence in `singerBlocks`: the sentence is pushed at `apps/web/src/lib/insights/singer-blocks.ts:367` (`totals.push({ kind: 'prose', text: i.phonationHeadline })`) and the octave block at `:368`. Row 48 can rewrite the sentence and add its link inside it without touching the block, which is a separate `kind: 'octave'` entry that follows whatever the sentence says.

## Could not establish

- The other fourteen screenshots, by eye (see above).
- Whether `NotesColumn`'s measurement of `.octave-notice` tolerates a line that wraps at a narrow width. The desk-width screenshots show one line; a phone-width Markup page was not run.
- Whether Dann wants the absent-clef case judged by range (see point 1).
- Anything on a Mac, a stored library, or a real singer's range: none here. The two ranges are seeded test values.
- The 60 unvoiced captures of the 84-capture compare were not re-run for this row (they carry no typed range, so no shift can apply to them). NOT ESTABLISHED by a run.

## The harness's voiced captures change, and the desk must recapture

I ran the harness's 24 voiced captures (`docs/sessions/n174-c2/voiced.test.ts`, the desk-built test voice with range E3 to A4, Sunless) against the baseline taken from `14e2ff8` in this container: **22 of 24 differ**; the two that match are `desk-en-6-voiced-markup-c-end.png` and `desk-fr-6-voiced-markup-c-end.png`. The cause is the intended one, not a regression: against E3 to A4 the resolver now reads Sunless's bass line an octave up, so the Markup engraving is drawn in treble clef and the new line appears (I looked at `desk-en-6-voiced-markup-a-top.png`: treble clef, notes an octave up). **Any later screenshot compare against the old voiced baseline will differ for this reason; recapture the voiced baseline from this row's commit.** I did not look at the other 21 differing captures.
