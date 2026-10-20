# Report: row 144, the clef choice on the Paper, once, then in the clef itself

Branch `cloud-lane-12`, after row 143 (`dd0fc3b`) and the row 133 e2e follow-up (`73b8efe`). Brief: batch A r2, row 144.

## The diff, by file

- `apps/web/src/lib/score/clef-choice.ts` (rewritten): `readingClef` implements the desk's table (documented in its header) for four stored values: `null` ("for your range"), `'as-written'`, `'bass'`, and the new `'ottava'`; `ClefChoice` gains `'range'`; `shown` now means "the score has a voice line". New `clefOptions(parsed, range, stored)`: the choices to offer, equal drawings collapsed onto "As written", "Read for your range" offered when something is stored or when `null` matches no explicit choice, and the option in force.
- `apps/web/src/lib/score/clef-ui.svelte.ts`: `CLEF_CHOICE_KEY` (the ratified string behind each choice), `menu`, `sentenceKey`, `chipOpen`, `menuOpen`, `raiseChip` (once per song; stores `clefChipShown`), `dismissChip`, `openMenu`, `closeMenu`; `choose` closes both. `bind`'s song closure now carries `clefChipShown` (the one call in `apps/web/src/routes/+page.svelte:986` needed no edit: `doc` has the field).
- `apps/web/src/lib/score/ClefControls.svelte` (new): the chip, the clef buttons, the menu, and the phone sheet (below).
- `apps/web/src/lib/score/ClefReceipt.svelte`: shows on every song with a voice line, offers `clefUi.menu.options`, labels from `CLEF_CHOICE_KEY` (so "As written" is `octave.toAsWritten` on every song, not "Treble").
- `apps/web/src/lib/library/types.ts`, `library.ts`, `document.svelte.ts`: `OctaveReading` gains `'ottava'`; `SongRecord.clefChipShown?: boolean` (additive; validated `true` or nothing, anything else malformed; absent reads false; stored only while true).
- `apps/web/src/lib/insights/InsightsPane.svelte`: the boolean prop `octaveAsWritten` is replaced by `octaveReading`; its `suggestedShift` and `octaveShift` come from `readingClef`, as Markup's do (item 8). `apps/web/src/routes/+page.svelte` (5618, unchanged length) passes `octaveReading={doc.octaveReading}`.
- `apps/web/src/lib/markup/MarkupPane.svelte` (1366 to 1364, ceiling lowered): mounts `<ClefControls {language} pages={scorePages} />` after `</PageFit>`; a comment shortened.
- Tests: `clef-choice.test.ts` (rewritten, 45 tests: every cell of the table for a low range, a high range, and no range; the null column's three cases; the choices each printed clef is offered; the shown-once flag; old stored values), `library.test.ts` (+1), `apps/web/e2e/clef-controls.test.ts` (2) and `apps/web/e2e-phone/clef-controls.test.ts` (2).
- `scripts/ratchets.json`: `MarkupPane.svelte` 1366 to 1364.

## The behaviour

- **The chip** floats over the Paper beside page 1's first clef (above it where there is room, else below), shows `octave.readLower` (or `readHigher`, or `asWrittenState`) and the choices, once per song, on the song's first drawing in Markup. It recedes when the singer chooses, presses Escape, or scrolls page 1's first clef out of view. All text is ratified: the sentence, `upload.ask.clefTrebleOttava`, `upload.ask.clefBass`, `octave.toAsWritten`, and `octave.toForRange` where offered. No new string.
- **The clef button** is an invisible button over each drawn clef (`[data-clef]`), named `upload.ask.clef` plus the choice in force ("Clef: Bass"); the first is a tab stop, the others are for taps. It opens the same choices.
- **Menu and sheet**: a menu beside the clef on a fine pointer, a sheet from the foot of the screen on a coarse one (`(pointer: coarse)`); arrows move through the choices, Enter picks, Escape closes and returns focus to the clef button; each target at least 44 px tall.
- The overlay is moved to `<body>` and is `position: fixed`, outside `PageFit`'s scaling transform (a first version inside it shrank to 18 px choices at 390 px; the phone test caught it), z-index 45 for the clef buttons (under the drawer's 60) and 80 for the chip, menu, and sheet (over the drawer's pull bar at 70, under the update toast at 200 and the loupe at 9100). Everything is `display: none` under `@media print`.

## Decisions I made

- **"For your range" on a printed-treble line whose range asks for no shift.** The table says "treble, shift 0"; I kept today's rule there, `clef: null`, so the renderer's own clef rule stands (treble for a line that fits as printed). Forcing `'treble'` could draw a low line in treble that the renderer would have put in bass; old songs keep reading as before. If you want it forced, it is one line in `readingClef`'s `todays`.
- **Stored `'bass'` on a bass-printed or treble-with-8-below line** now follows the table (bass, shift 0). Before row 144 it was inert there; it could only have been stored from the row's old condition (printed treble read lower), where it reads as before.
- **A clef the score draws in none of the three** (a C clef): only "As written" and "Read for your range" are offered.

## Gates

phonology 267, dictionary 248, blurb 145, integration 55, web-test 2927 (2927) (2892 plus 35), web-check 0 errors and 12 warnings, score-parser 775 passed and 5 skipped (780), ratchets OK.

## The Playwright run (not part of the eight gates)

Run by me against a dev server, `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome pnpm --filter @ilya/web exec playwright test --project=chromium clef-controls` and `--project=phone clef-controls`: 2 and 2 passed. They check: the chip on the first drawing with the sentence and the choice in force; choosing recedes it and the clef changes; another tab and back does not raise it again; the clef button's name; the menu's four choices in order; Escape; arrow and Enter selection; French strings; at 390 px (touch) the chip's targets, the clef button's box (at least 44 by 44 after the page's scale, which was below 0.7), and the sheet's bottom at the viewport's foot with every target at least 44 px; the overlay is hidden under print media. I also ran `octave-line`, `tempo`, and `insights-page` (chromium): 13 passed, 2 failed. `tempo` failed on its pin of the chip name (`/Quarter .* Dot/`), which row 133 changed; I fixed it in `73b8efe` and `tempo` now passes (5 of 5). `insights-page` fails on "the page runs the frame...": it looks for the text "Ilya does not invent advice", which no longer exists anywhere in `apps/web/src` (the teacher line was reworded); it fails the same with this row's changes stashed, so it is not this row's, and I did not fix it.

## Pictures

`docs/sessions/batch-a-shots/row144-{chip,menu}-{en,fr}-1440.png` (menu: both languages at 1,440; chip: both), `row144-chip-{en,fr}-390.png`, `row144-sheet-{en,fr}-390.png`. Tchaikovsky op. 38 no. 3 with a seeded bass range, English and French.

## Shared numbers

The reading's octave shift and clef are computed by `readingClef` (`clef-choice.ts`), which calls `resolveVocalReadingOctave` (score-parser). Its consumers: Markup (`MarkupPane.svelte:577`: the page, the analysis, the print, and through the `onpagesdrawn` bundle's `clef`, the loupe), Insights (`InsightsPane.svelte`, changed here, so the two tabs now read one octave), `ClefUi` (the Input band row, the chip, the clef button), and the octave line (`octaveLine`, which still reads `suggestedShift` and `shift`). Insights' compass stave follows the range through `chooseClefForSpan` and is unchanged. What depended on them agreeing is that the page, the marks, the sung-order analysis, and Insights' figures describe the same pitches.

## Could not establish

- **The chip on the Paper at 1,440 px overlaps the title block** (it stands above the first clef, over "Средь шумного бала" and the legend). It is transient and floating, and it never covers the first system; whether that overlap is acceptable to Dann's "nothing collides" is his look.
- That **Insights and Markup agree** in the browser: they call one function with one input; I did not compare the two pages' figures on a song with an explicit `'ottava'` or `'bass'`.
- **The loupe's clef** for the new `'ottava'` and for bass-printed lines: I did not open the loupe.
- **Scrolling the clef out of view recedes the chip**, **Tab order**, and **screen readers** (the roles `menu`, `menuitemradio`, `dialog`, `group`): written, not tested with a reader or a scroll test.
- **Printing**: the overlay is `display: none` under print media (asserted), not printed.
- **A clef button on every system**: there is one per drawn clef, only on those in view; I did not test a long score's count.
- The Input band's Clef row on a bass-printed or treble-8vb song in the browser: covered by `clefOptions`' unit tests, not looked at.
