# Memo: overnight items A4 to A9. Desk agent, 2026-10-01

Read only. Every claim carries a `path:line` read in this run at HEAD `740dfe7`. Paths are relative to the repository root unless they start with `packages/` or `tools/`.

## A4. Notation opening expanded on mobile, hiding the metadata (inbox I.01, 2026-08-14)

**Question.** Does the Notation station still open expanded on a phone, and can a phone singer reach the metadata fields?

**What I found.**
- The drawer's open set starts as `['input']` and nothing else (`apps/web/src/lib/components/Drawer/sections.svelte.ts:53`). Notation is not in it, so it is shut on a first visit.
- Notation is never written to storage: `UNPERSISTED_STATIONS = ['notation']` (`sections.svelte.ts:62`), and the one writer filters it out before saving (`sections.svelte.ts:455-457`). On a return visit the stored set cannot carry it, so `restore` (`sections.svelte.ts:440-448`) never reopens it. `+page.svelte` builds the set with that list (`apps/web/src/routes/+page.svelte:327-331`) and restores it at `:4118`.
- The only ways to open Notation are the singer's own tap (`+page.svelte:4537-4538`) and the Guide's `open`, which the table of contents alone calls.
- The metadata fields live in the Piece band, drawn whenever Piece is open (`apps/web/src/lib/components/Drawer/Drawer.svelte:516-523`; the fields themselves at `+page.svelte:4320`). Notation is a station inside the Input band, a different tier (`sections.svelte.ts:133-135`). On a phone, opening the Piece band shuts Input, not the stations inside it (`sections.svelte.ts:371-380`), so the metadata is reached by tapping Piece, with Notation out of the way. The bottom-anchored Notation of I.01 (2026-08-14) belongs to the pre-N.108 drawer; nothing in the current tree anchors Notation to the bottom.

**Verdict.** CLOSE. Notation is shut on every visit and the metadata is one band tap away on a phone.

## A5. Colour print comes out greyscale except the flag (inbox 2026-08-24)

**Question.** What does each of the three documents print in colour today, and what is "the flag"?

**What I found.**
- "The flag" is the Canadian flag in the footer attribution: an inline SVG with `fill="#f00"` and `fill="#fff"`, inside the string `footer.attribution` in both languages (`apps/web/src/lib/i18n.ts:735-736`). It is the one saturated colour on any page. Text and Markup draw it through `PageFooter` (`apps/web/src/lib/components/Paper/PageFooter.svelte:101`); Insights draws the same string through its own foot (`apps/web/src/lib/insights/InsightsPane.svelte:359`, `:581`).
- No print rule changes any colour. The `@media print` block in `apps/web/src/app.css:260-370` sets `--paper-cream` to white (`:262`), turns page backgrounds white (`:313`), hides the screen chrome (`:335-341`) and sets `@page` to letter with no margin (`:368-371`). The per-component print blocks do the same kind of thing: box shadow off and background white (`TitlePage.svelte:253-257`, `SubsequentPage.svelte:138-142`, `MarkupPane.svelte:1296-1301`, `InsightsPane.svelte:1326-1330`), word-stack highlight off (`WordStack.svelte:392-402`), selection ring hidden (`MarkupPane.svelte:1124-1128`), Insights tap and buttons hidden (`InsightsPane.svelte:1332-1347`). There is no `print-color-adjust` anywhere in `apps/web/src` (grep, zero hits), so background fills follow the browser's default and text, border and SVG colours go to paper as set.
- What is coloured on screen, and therefore reaches paper as ink, per document:
  - **Text.** Ink is the warm grey ramp: `--ink-primary #1a1612`, `--ink-secondary #4a4540`, `--ink-tertiary #6A655F` (`app.css:28-30`). Sage `#839275` (`app.css:42`) is on the `[Ilya] 2026a` mark and version and the header rule (`TitleHeader.svelte:47` defaults, `:82-83`, `:117`), the metadata labels in `--sage-ink #455238` (`app.css:183`), the gloss line under every word in `--sage-gloss #7A8A6C` (`WordStack.svelte:291`, `app.css:44`), the clitic arrow (`WordStack.svelte:302`), the running header's rule on later pages (`RunningHeader.svelte:47`), and the footer hairline (`PageFooter.svelte:31` default, `:174`). Legend glyphs and the small print are `#78716c` (`PageFooter.svelte:144`, `:242`).
  - **Markup.** Same grey ramp for the stave: staff lines, barlines, clef, key and meter in `#3a352f`, noteheads, stems, beams, flags and dots in `#1a1612` (`packages/score-parser/src/staff-renderer.ts:2214`, `:2540`, `:3116`, `:3147`, `:3161`, `:2950`). Lavender `#9585A2` on the header mark, version and rule, `--lavender-ink` on the labels (`MarkupPane.svelte:961-964`, `:1042-1045`), on the footer hairline (`MarkupPane.svelte:976`, `:994`, `:1079`), on the turning-pitch layer (`staff-renderer.ts:859`, `:3091`, `:3103`) and the withheld sigla (`staff-renderer.ts:85`). Red `#b23b3b` on the crossing squircle (`staff-renderer.ts:3174`).
  - **Insights.** Rose `#AB7F7F` on the header mark, version and rule, `--rose-ink` on labels (`InsightsPane.svelte:606-609`), rose rules on the fit table and the foot hairline (`InsightsPane.svelte:868`, `:1172`, `:1221`), `--rose-ink` text at `:895`, `:1004`, `:1144`, `:1281`.
- So "greyscale except the flag" is the expected result of printing low-saturation sage, lavender and rose beside a pure red flag, not a rule in the tree. Dann's own printer rendered the sage rule green on 2026-09-24 (INBOX line 194), which fits.

**Verdict.** CLOSE as a finding; nothing to build here. Whether pages keep their on-screen colour on paper is D5, Dann's. One fact for that decision: the colours already reach paper as ink; what the browser drops by default is background fill, and the only background fill on a page is the page itself, forced white at print (`app.css:262`, `:313`).

## A6. Headers and footers on printed documents (inbox 2026-08-24)

**Question.** What does each page's header and footer carry today?

**What I found.**
- **First-page header, all three documents:** `TitleHeader.svelte`. The `[Ilya]` mark with version `2026a` (`:82-83`), the metadata block of title, composer line, attribution line and opus (`:53-64`, `:96`), an optional note (`:114`), and a rule (`:117`). Each document passes its own accent: sage by default for Text (`:47`), lavender for Markup (`MarkupPane.svelte:961-964`), rose for Insights (`InsightsPane.svelte:606-609`).
- **Running header, page 2 onward.** Text: `formatRunningHeader(composer, title, poet)` (`apps/web/src/lib/components/Paper/Paper.svelte:52-54`), drawn by `RunningHeader.svelte:24` over a sage rule (`:47`). Markup: the score title, else the profile subtitle (`MarkupPane.svelte:907`). Insights: score title and the identity line joined with a middle dot (`InsightsPane.svelte:492-494`).
- **Footer, Text and Markup:** `PageFooter.svelte`. Provenance legend row when there are legend items (`:52-90`), optional broad note (`:93`), a 0.5 px hairline in the document's accent (`:96`, `:174`), then the attribution text and the `dannmitton.com` link on one line (`:100-101`) with `Page n of N` / « Page n sur N » in its own cell (`:105`; strings `i18n.ts:747`, `:753`). The attribution reads, in English: "Free and open source, Ilya 2026a operationalizes Craig Grayson's Russian Lyric Diction (University of Washington, 2012). Stress data and translation glosses via kaikki.org (CC BY-SA 4.0), test text via www.lieder.net. Made with love in Canada [flag]" (`i18n.ts:735`); the French is at `:736`. A Richter credit precedes it on pages that show a Latin word (`:743-746`, `PageFooter.svelte:101`).
- **Footer, Insights:** its own `foot` snippet (`InsightsPane.svelte:570-587`): optional footnote, the method line, the same attribution with the lieder.net clause struck (`:359`) plus `dannmitton.com` (`:581`), then a 1 px rose hairline (`:584`, `:1221`) and `Page n of N` on its own line (`:585`).
- So the ask of 2026-08-24, Ilya provenance plus dannmitton.com, is already on every footer. The three feet differ in geometry, which is D4, parked on Dann.

**Verdict.** CLOSE. Provenance and dannmitton.com are on every page's footer today; the one-footer question is D4.

## A7. Where the Lamm read's metre came from (inbox 2026-08-27)

**Question.** Which code decides the time signature of a page-reader score, what did it decide for the Lamm plate, and does Ilya now draw a time signature?

**What I found.**
- The reader's metre comes from `timesig.py` (`apps/web/static/reader/timesig.py`, identical to `tools/e16-harness/reader/timesig.py` by `diff`). `search_system_signatures` (`:671-698`) opens a window from the staff's left edge to the first barline and a window 6 stave-spaces wide after every barline, and runs `read_time_signature_v2` (`:637-668`) on each: the staff is split at its middle line into a top and bottom band, Leipzig `timeSig` digit templates are matched at threshold 0.38 (`:325-360`), a coincident "1" is kept only when it dominates its cluster (`:454-500`), digits are grouped into stacks and validated (`:585-632`), and the best stack is the reading. Nothing legible means abstain, never a default (`:543-544`).
- `envelope.py` binds hits to measures: a start-window hit to the system's first measure, a barline hit to the measure after that barline, a final-barline hit to the next system's first measure (`apps/web/static/reader/envelope.py:120-148`). Then a left-to-right sweep gives each measure the printed metre or the inherited one (`:151-191`); no measure is ever given a metre the plate did not print.
- The fixture `apps/web/src/lib/score/ingestion/fixtures/recognized-mussorgsky-01-p1.json` records: measure 0, metre 6/8, `source: printed` at measure 0, an empty bar with no events (`abstain.sum: empty_bar_no_events`); measure 1, metre 12/8, `source: printed` at measure 1; measures 2 to 11, 12/8, `source: inherited` from measure 1. So the read's signature is 12/8 from measure 1 on, and the fixture itself says it was printed there, not defaulted. The docstring at `timesig.py:352-357` records the scores that matched on this plate's 12/8: "2" at 0.52 against "4" at 0.46, with "1" and "8" scoring in the 0.83 to 0.92 band.
- Ilya DOES draw a time signature now, N.139: `meterInk` (`packages/score-parser/src/staff-renderer.ts:662`) and `meterDeclaredAt` (`:694`) feed the system head (`:1998-2003`) and a declaring measure's barline (`:2541-2542`, `:2675-2676`), as `<g data-meter="b/t">` (`:1920`). The loupe reads the same handle (`apps/web/src/lib/score/Loupe.svelte:991`). Inbox I.03 (2026-09-01) is out of date.
- On the MusicXML side, a score with no `<time>` is assumed 4/4 with a warning (`packages/score-parser/src/musicxml-parser.ts:570-573`); that path does not apply to the reader's output, which emits `<time>` only where the fixture carries a metre (`apps/web/src/lib/score/ingestion/recognized-to-musicxml.ts:244-263`).

**Verdict.** CLOSE for the two questions asked. One residue below.

## A8. Arrow keys driving the loupe's stepper on desktop (inbox 2026-08-27)

**Question.** What keys do the loupe and the correction handler bind, and are arrow keys among them?

**What I found.** `handleCorrectionKey` (`apps/web/src/routes/+page.svelte:1230-1319`) is on `svelte:window` (`:4172-4173`). It yields to text fields and the tablist (`:1235`). With a modifier: Cmd/Ctrl-Z undo, Shift-Cmd-Z or Ctrl-Y redo (`:1256-1270`). With a cursor and no modifier: Left and Right walk the stepper through `handleMove` (`:1296-1301`), the same function the dock's stepper calls (`onwalk={handleMove}`, `:4956`; `handleMove` is `stationCursor.move`, `:802`); Up and Down step the pitch, with Shift an octave (`:1278-1285`); `+`/`=` and `-`/`_` a semitone (`:1286-1295`); `.` cycles the dot (`:1302-1304`); Delete and Backspace delete the note (`:1305-1309`); Escape dismisses the loupe (`:1310-1312`); a digit sets the base through `DIGIT_BASE` (`:1314`). In Syllables mode only Left, Right and Escape act (`:1275`).

**Verdict.** CLOSE. Arrow keys already drive the stepper on desktop; no brief.

## A9. Augmentation dots: stored, drawn on the page, drawn in the loupe? (inbox 2026-08-27)

**What I found.**
- Stored: `NoteCorrection.dots` (`apps/web/src/lib/score/correction.ts:51`); `handleDotCell` cycles 0, 1, 2 and writes `correct({ dots })` with an undo entry (`+page.svelte:1102-1116`); `amend` folds it into the drawn event's duration (`correction.ts:470-497`).
- Drawn on the page: the renderer reads `ev.duration.dots` and places each dot with the font's `augmentationDot` glyph, in the stave-space above a line note, pushed clear of ledger lines (`packages/score-parser/src/staff-renderer.ts:2924-2954`). The 2026-08-27 note that `:1093` called it future work describes a tree that is gone.
- Drawn in the loupe: the loupe renders through the same `renderSystemSlice` (`apps/web/src/lib/score/loupe-render.ts:26`, `:90`, `:266`), so the dot is drawn there by the same code. The loupe's held-note walk also lists dots among the `data-of-event` parts it carries (`Loupe.svelte:360`).

**Verdict.** CLOSE. Stored, drawn on the page, drawn in the loupe. N.103 (re-spacing when a dot is added) is a separate item and is not touched here.

## What I could not establish

- A5: which build Dann printed on 2026-08-24 and what else was on the page then; the identity of "the flag" rests on today's tree, where the Canadian flag is the only saturated mark.
- A7: why the fixture's measure 0 reads a printed 6/8 while measure 1 reads a printed 12/8. The fixture records both as printed and the first bar as empty; whether the 6/8 is a true pickup signature on the plate or a "1" suppressed by the cluster rule (`timesig.py:454-500`) needs the reader run on the plate with its candidate scores printed, which is a Code measurement and not a read.
- A7: whether a mid-system metre change is drawn where it falls or in the head (INBOX I.03's open half). `:2675-2676` draws at the declaring measure's barline, which answers the page; the loupe's head is `Loupe.svelte:991` and I did not trace what it does with a second `data-meter` in one system.
