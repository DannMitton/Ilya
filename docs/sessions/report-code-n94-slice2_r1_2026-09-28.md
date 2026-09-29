# Report from Code: N.94 slice 2, the Transposition ruler on the phone, the twins, and Insights

Written by Code (Claude Opus) 2026-09-28, about 23:20, against the brief
`brief-code-n94-slice2_r1_2026-09-28.md`. Read on branch `Shane` at HEAD
`e8c4732`. The working tree was clean at the start. The Markup legend brief
had already reported (`report-code-markup-legend-four-out_r1_2026-09-28.md`),
and its work is in `e8c4732`. Nothing is committed, staged, stashed, or
pushed. Dann ships.

## What the singer gets now

On a desk, the Transposition ruler dims the busier of two keys that sound the
same. On Sunless 1, C♭, D♭, and G♭ dim, and C♭'s readout says "Carries 16
double flats". A dimmed stop stays tappable. Ilya's pick always lands on the
cleaner twin.

On a phone, **Try another key** is offered now. It opens the ruler docked at
the bottom edge, as plate 4 draws it: two chips (**As printed · D** and
**Ilya's pick · B**), a window of 44 px stops with faded edges, the readout,
and **Cancel** and **Use this key**. A swipe settles on the stop nearest the
centre, and the page above redraws in it.

In Insights, a range finding that carries a suggested key has a **Try this
key** pill. It brings Markup forward with the ruler open on that key. After
**Use this key**, Insights reads the song in the chosen key: its compass, its
flags, and its findings move, and its header prints the same line as Markup's.

Test it on `http://localhost:5173`, the dev server that is already running.
The Vercel preview does not show this until you commit and push.

## What changed

### The count, in the package

- `doubleAccidentalsDrawn`, `packages/score-parser/src/transposition.ts:414`,
  with its type `DoubleAccidentalCount` at `:396`. It counts the double flats
  and double sharps the sung line DRAWS, by the renderer's own walk
  (`advanceAccidentalState` under `carryIntoMeasure`, the calls
  `accidentalStateAtEndOf` makes). A second B double flat in the same bar
  draws no sign, so it does not count.
- Exported at `packages/score-parser/src/index.ts:81`.
- **DESK DEFAULT, a departure from the brief's wording.** The brief says to
  count in `transposition-ruler.ts`. The count needs the renderer's
  accidental rule, and that rule lives in the package and is not exported. I
  put the count beside it, so there is one copy of the rule.
  `transposition-ruler.ts` calls it.

### The twins, `apps/web/src/lib/markup/transposition-ruler.ts`

- `stopId` (`:184`) and `stopGroups` (`:187`). `stopGroups` moved here from
  the component, so the desk ruler and the dock share it.
- `twinCounts` (`:206`): engraves the printed reading in each twin stop (the
  page's own preview) and counts it. Stops without a twin are not counted.
- `dimmedStops` (`:222`): in each pair, the twin with the higher total of
  double flats and double sharps together dims. A tie dims neither. There is
  no threshold.
- `cleanerTwin` (`:233`): a dimmed stop's twin.
- `countLines` (`:243`): the ruled count strings, one line per kind, flats
  first.
- `rulerOpening` (`:294`) now returns `counts` and `dimmed`, and moves the
  pick to the cleaner twin. **DESK DEFAULT:** the runner-up and a key asked
  for by **Try this key** move the same way, because both are Ilya's
  recommendation too.
- `stopForSuggestion` (`:258`): see Insights.

### The desk ruler, `apps/web/src/lib/markup/TranspositionRuler.svelte`

- The dimmed class (`:119`), at `opacity: 0.4` unless selected. JUDGEMENT,
  the desk's value.
- The count line under the readout (`:105`), in the tertiary ink. The dimmed
  stop's `aria-label` carries it too.
- On a phone it hands over to the dock (`:99`).

### The phone dock, `apps/web/src/lib/markup/TranspositionDock.svelte` (new, 387 lines)

- Plate 4's values: the dock, the chips, the 44 px stops, the fades, the
  readout, and the pills set apart. Every tap target is 44 px tall, measured
  live: stops 44 by 44, both chips 44, both pills 44. The chip and pill are
  drawn at the plate's size inside a 44 px button.
- **The dock leaves the page stack for the body** (`toBody`, `:68`). On a
  phone the sheet is scaled by a transform (`PageFit.svelte`), and a fixed
  box inside a transformed one is fixed to that box, not to the screen.
  Measured live: the dock's parent is `BODY`, and it spans 0 to 375 px at the
  bottom edge.
- The swipe settles 120 ms after the last scroll event on the stop nearest
  the centre (`settle`, `:78`). Scroll snapping centres each stop.
- **DESK DEFAULT, the chips above the window.** The brief's prose says "the
  chips below". Plate 4 draws them above, and the ruling names the drawing.
- **DESK DEFAULT, the dock docks at the bottom in landscape too.** Plate 4
  draws portrait only. The loupe's dock moves to the left edge in landscape;
  the ruler does not.
- "The phone" is `isPhone`, the smallest-side test under 768 px, as slice 1
  used. The brief says "below the desk breakpoint", and the desk breakpoint in
  code (`isDeskLayout`) is a 1400 px width. Between the two, the floating
  ruler fits the page, so I kept the plate's word, phone. DESK DEFAULT.

### The wiring

- `transposition-ruler-state.svelte.ts`: a `phone` thunk (`:42`), `stopFor`
  (`:96`), `tryKey` (`:101`), and `prepare` (`:119`), which now passes a
  requested key to the opening and clears it after.
- `MarkupPane.svelte:684`: the opening takes the requested key. No other
  line in the pane changed.
- `+page.svelte:1346` passes `() => isPhone`; `:4337` drops `isPhone` from
  the band line; `:4851` gives Insights the ruler state.
- `PieceKeyLine.svelte`: **Try another key** shows on a phone now.

### Insights

- `insights.ts:132`: a finding carries its anchor's `transposition` (`:433`).
- `insights.ts:54`: `SungKey`, the shape Insights uses. **insights/ may not
  import markup/** (the module map in `scripts/ratchets.mjs`), so Insights
  declares the shape it needs and the page shell passes the ruler state,
  which has it.
- `InsightsPane.svelte:136-137`: the printed reading, then that engraved in
  the song's key. Every derivation after it (the watch list, the findings,
  the fit table, the comments) reads the song's key. Curation rule 3.
- `InsightsPane.svelte:609`: the header line, Markup's own string.
- `InsightsPane.svelte:510`: the pill, on a range finding only, and only when
  the ruler offers the suggested key. It never prints (`:1346`).
- **How a suggestion becomes a stop**, `stopForSuggestion`. After **Use this
  key**, the watch list suggests moves from the key on the page, but the
  ruler's stops are moves from the printed key. The function adds the song's
  move, folds it, and finds the stop by the suggestion's own signature, so B
  major never lands on C flat. A tritone lands on the side the move went.
- **What "Analysis gates" means here.** `analysis/gates.ts` is called only by
  `MarkupPane.svelte:98`, and Markup already read the transposed score after
  slice 1. Insights does not call the gates yet. Both now read the song's key.

### To hold the ceiling on `InsightsPane.svelte`

`textParts` and `accidentalParts` moved to `apps/web/src/lib/insights/text-parts.ts`
(new) unchanged, with their comments. The pane is 1350 lines, its ceiling
exactly.

## Strings

All seven rows of the ruled table are in `i18n.ts:1793-1799`, verbatim. The
apostrophe in "Ilya's" and « d'Ilya » is the typographic one, as
`key.ruler.readoutPick` already writes it. The chips' tonic is `stopLabel`,
so French reads « ré », « si ». I coined no word.

## Gates

| Gate | Baseline (`ilya-ship.sh`) | Now |
|---|---|---|
| 1 phonology | 251 passed | 251 passed |
| 2 dictionary | 235 passed | 235 passed |
| 3 web-check | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files |
| 4 web-test | 1671 passed | **1682 passed** (+8 `transposition-ruler.test.ts`, +3 `insights.test.ts`) |
| 5 score-parser | 633 passed, 5 skipped (638) | **636 passed, 5 skipped (641)** (+3 `transposition.test.ts`) |
| 6 blurb | 145 passed | 145 passed |
| 7 integration | 55 passed | 55 passed |
| 8 ratchets | OK | **OK, no ceiling raised** |

`ilya-ship.sh` needs its gate 4 and gate 5 strings moved to `1682 passed
(1682)` and `636 passed | 5 skipped (641)`, or it refuses. I did not edit it.
The ratchet script says two ceilings could be lowered: `MarkupPane.svelte`
1358 to 1302 and `+page.svelte` 6028 to 6012. I left them.

The tests:

- `packages/score-parser/src/transposition.test.ts:566`: a double accidental
  counts where it draws, not every note spelled with one; double sharps and
  double flats apart; and Sunless 1's flat sixth, which draws one double flat
  in C flat major and none in B major.
- `apps/web/src/lib/markup/transposition-ruler.test.ts:89`: the counts on
  Sunless 1's bar 2 for all three pairs; the dimming, with a tie that dims
  nothing; the pick moving to the cleaner twin, through `rulerOpening` with a
  real search (C major, the search names D flat major, the pick lands on C
  sharp major); and the count lines in both languages.
- `transposition-ruler.test.ts:170`: `stopForSuggestion` from the printed
  page, from a transposed page, at the tritone, and with no stop.
- `apps/web/src/lib/insights/insights.test.ts:518`: a range finding carries
  the watch list's key; after the move, Insights' compass moves and the range
  finding goes; and `groupFindings` keeps the transposition.

## Screenshots

Sunless 1, in the Browser pane on `http://keyruler.localhost:5173`, the
origin slice 1 used. Desk captures at 1440 by 1000, phone at 375 by 812.

- `docs/sessions/n94-slice2-en-1-dimmed-twin_2026-09-28.jpg`: C♭ selected, dimmed twins, "Carries 16 double flats".
- `docs/sessions/n94-slice2-fr-1-dimmed-twin_2026-09-28.jpg`: « do♭ », « Comporte 16 doubles bémols ».
- `docs/sessions/n94-slice2-en-2-insights-try-this-key_2026-09-28.jpg`: the range finding with **Try this key**.
- `docs/sessions/n94-slice2-fr-2-insights-try-this-key_2026-09-28.jpg`: « Essayer cette tonalité ».
- `docs/sessions/n94-slice2-en-3-insights-after-use_2026-09-28.jpg`: Insights in B major, compass A♯2 to B3, "Contained", the header line.
- `docs/sessions/n94-slice2-fr-3-insights-after-use_2026-09-28.jpg`: the same, « INCLUS ».
- `docs/sessions/n94-slice2-en-4-phone-dock_2026-09-28.jpg`: the dock, opened from Insights on B.
- `docs/sessions/n94-slice2-fr-4-phone-dock_2026-09-28.jpg`: « ré♭ » selected and dimmed, « Comporte 11 doubles bémols ».

Also walked: **Try this key** brought Markup forward with the ruler on B;
**Use this key** kept it; Insights then showed no range finding and no pill.
On the phone, scrolling the window three stops settled on C♯ and the page
header redrew to "down a semitone"; both chips jumped; **Cancel** closed the
dock and removed the header. No error in the console at the end of the walk.

**To show Insights' findings I gave the test voice measured formants for a
while.** The test voice on that origin had none, so Insights withheld every
finding. I set five captured fR1 values in its `localStorage` record, walked,
and then set them back to empty. The origin is as I found it: as printed, in
English, the voice with no formants.

## What I could not establish

1. **A real swipe.** The pane's drag is a mouse drag, which does not scroll an
   overflow box. I moved the window with `scrollBy`, which fires the same
   scroll events, and the settle worked. NOT ESTABLISHED on glass: the feel of
   the snap, and whether iOS Safari's momentum ends inside 120 ms of its last
   scroll event.
2. **The dock covers the bottom of the page.** It is 173 px tall on a 375 by
   812 phone. The page scrolls under it, but the last system cannot rise above
   it. The plate says the dock "never covers the music", as the loupe's dock
   does. The loupe's dock reserves room (`dockInset`); the ruler's does not.
   Yours to rule whether it should.
3. **The pill and Insights' paging.** The pill adds about 30 px to a range
   finding on screen and nothing in print. Insights measures its first page on
   screen to decide how many findings fit. NOT ESTABLISHED whether a printed
   page can now carry fewer findings than it has room for.
4. **The faint show-through.** The dock's background is the plate's 98 %
   opaque paper. On the phone capture, the staff behind it and the drawer
   handle show faintly. It is the plate's value; whether to make it opaque is
   taste.
5. **A printed double accidental reaching a twin.** Sunless 1's counts come
   from its chromatic notes carried into flat keys. I did not survey the other
   fixtures' counts.
6. **Printing.** The dock and the pill carry `display: none` in print, and I
   confirmed the rules are in the component styles. I did not print a page.
7. **A twin tie on a real score.** The unit test shows a tie dims nothing. On
   Sunless 1 no pair ties, so I have not seen it live.

## One thing in the tree that is not mine

`docs/memory/SCHEDULE.md` was modified at 22:49, one line changed. I did not
write it and did not touch it.

## Addendum, 2026-09-29 about 00:40: the brief's addendum of 23:55, carried out

Read on branch `Shane` at HEAD `e8c4732`, working tree dirty with slice 2 as
above, plus the desk's own edits to `docs/memory/OPEN.md`,
`docs/memory/SCHEDULE.md`, and the brief. Nothing is committed, staged,
stashed, or pushed.

### 1. The pill no longer costs page one any height

**Which fix: neither of the two the addendum named.** I tried the first,
inline at the end of the finding's text, and measured it on Sunless 1. The
text of a range finding runs close to a full line, so the pill wrapped onto a
line of its own anyway: the finding grew from 39 px to 59 px. Inline adds no
line only when the text happens to leave room. The second option, counting
the pill's height in page one's fit, keeps the finding but spends the same
20 px, so something else leaves page one instead.

**What I did, DESK DEFAULT:** the pill sits at the right end of the finding's
tag row ("m. 17 · E3 · [i] · одинокая"), positioned out of flow inside that
row's 18 px. It takes no height in any language or on any score.

- `InsightsPane.svelte:504`: the pill follows the body in the markup, so a
  screen reader meets the tag, the finding, then the pill.
- `InsightsPane.svelte:1022`: `.finding` is the pill's positioning box.
- `InsightsPane.svelte:1053`: the pill, `position: absolute` at the tag row's
  top right, `font: 500 0.75rem/16px`, 18 px tall with its border.
- `wordOf` moved unchanged to `apps/web/src/lib/insights/text-parts.ts:11`,
  to hold the pane under its ceiling (1349 of 1350).

**Measured on Sunless 1, 1440 by 1400, the test voice ranged F♯3 to G4 with
measured vowels** (the desk's exact voice is not in this tree; see "What I
could not establish"):

- The range finding ("The note drops below the range you typed", m. 17) is
  first on page one, with 22 px of page one to spare. A pill on its own line
  (18 px plus its 4 px margin, 59 − 39 = 20 px measured) would have pushed it
  to page 2, which is the desk's finding.
- The finding measures 59 px with the pill and 59 px with the pill hidden.
- The pill spans the tag row exactly (864.2 to 882.2 px) and ends 1.5 px above
  the body text. The tag's words end at x = 828; the pill starts at x = 1187.
- In French, « Essayer cette tonalité » sits in the same place, and the range
  finding keeps first place on page one. The second finding goes to page 2 on
  French length alone: page one has 55 px left and that finding needs 78 px.
  It carries no pill.

Screenshots of page one:

- `docs/sessions/n94-slice2-addendum-en-1-page-one-range-pill_2026-09-28.jpg`
- `docs/sessions/n94-slice2-addendum-fr-1-page-one-range-pill_2026-09-28.jpg`

### 2. The dock reserves room under the page

- `TranspositionDock.svelte:79` and the effect after it: while the dock is
  open, the page's scroller takes a bottom padding of the dock's height plus
  0.5rem, the clearance the drawer's pull gets. It follows the dock's height,
  and the scroller's own value comes back on close. The background stays 98 %.

**This needed a second change, outside the ruler, in a shared component.**
`apps/web/src/lib/components/Paper/PageFit.svelte:94`: `flex-shrink: 0` on
`.paper-fit.fitting`. The padding alone did nothing, and the reason predates
this slice:

- On a phone the desk's scroller is a flex column, and the fitted sheet's
  only child is out of flow. The column shrank the fitted box: 1368 px
  declared, 661 px laid out (headless Chromium, 390 by 844). The pages
  overflowed it, and any bottom padding sat inside that overflow.
- **With the dock closed, before this change, the last sheet already ended
  35 px below the screen**, under the drawer's pull, although `+page.svelte`
  reserves 44 px for the pull. The change fixes that too.
- It applies only while a sheet is fitted, which is the phone and any frame
  narrower than the page. Markup, Insights, and `Paper.svelte` all use
  `PageFit`, so all three now keep their reserved height on a phone.

Measured headless at 390 by 844 on a fresh origin, Sunless 1, after the change:

| | Last sheet's bottom | Dock's top | Scroller's bottom padding |
|---|---|---|---|
| Dock closed | 768 px | none | 52 px |
| Dock open | 639 px | 671 px | 181 px |
| After Cancel | | none | 52 px |

The last sheet clears the dock by 32 px. The drawer's pull and the Print pill
sit under the dock while it is open; neither is music.

Screenshot: `docs/sessions/n94-slice2-addendum-en-2-phone-dock-clear_2026-09-28.png`,
scrolled to the bottom with the dock open.

**Why headless.** The Browser pane was hidden for this walk, and a hidden
pane never runs a ResizeObserver. `PageFit` sizes itself with one, so in the
pane the fitted box stayed stale and the layout could not be measured. The
headless script lives only in my scratchpad; nothing was added to the repo
but the screenshot.

### Gates, re-run after both changes

| Gate | Baseline (`ilya-ship.sh`) | Now |
|---|---|---|
| 1 phonology | 251 passed | 251 passed |
| 2 dictionary | 235 passed | 235 passed |
| 3 web-check | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files |
| 4 web-test | 1671 passed | **1682 passed** (unchanged from slice 2) |
| 5 score-parser | 633 passed, 5 skipped (638) | **636 passed, 5 skipped (641)** (unchanged from slice 2) |
| 6 blurb | 145 passed | 145 passed |
| 7 integration | 55 passed | 55 passed |
| 8 ratchets | OK | OK, no ceiling raised |

`ilya-ship.sh` still needs its gate 4 and gate 5 strings moved to `1682 passed
(1682)` and `636 passed | 5 skipped (641)`.

### What I could not establish, for this addendum

1. **The desk's own test voice.** The addendum names a range finding at m. 5.
   I reproduced the same failure with another range (the finding at m. 17), not
   the desk's exact case. NOT ESTABLISHED on m. 5.
2. **The phone Playwright suite** (`apps/web/e2e-phone/`, the loupe scan) is
   not one of the eight gates, and I did not run it. `PageFit`'s change moves
   where the sheet's bottom and the Print pill sit on a phone. NOT ESTABLISHED
   whether any rule in that scan reads them.
3. **A visible pane or a real phone.** Both measurements of the dock are
   headless. I did not see the change on glass.
4. **A range finding whose tag row is long.** The pill takes the row's right
   end. A tag long enough to reach it (a long word at a narrow width) would
   run under the pill. The range finding's tag on Sunless 1 ends 359 px short of it.
   NOT ESTABLISHED on other scores.

The test origin `http://keyruler.localhost:5173` is back as I found it: as
printed, in English, the test voice with no formants and its range A♭2 to B3.
