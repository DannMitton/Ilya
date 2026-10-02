# Report: the loupe's ruled remainder, r1

Cloud session on branch `cloud-lane`, 2026-10-02, Sonnet 5.5. Brief: `brief-code-loupe-remainder_r1_2026-09-30.md` (QUEUE row 8). Started from `b709012` (`cloud-lane` fast-forwarded to `origin/Shane`; it could, so nothing stopped). `tools/e16-harness/` was not edited. `STATE.md`, `OWED.md`, `QUEUE.md`, `CONTRACT.md`, `OPEN.md`, and `PRODUCT.md` were not edited. WRITTEN is not DONE: DONE is Dann's walk.

Screenshots are in `report-code-loupe-remainder_r1_2026-10-02.files/`, taken in headless Chromium 1194 on the engraved Sunless no. 1 fixture (`sunless-01-engraved.musicxml`), desk 1440 x 900 and phone 390 x 844 at 3x. A hidden-pane frame is not a real display: timing below is read from computed style at sampled instants, not seen.

## Baseline

Fresh clone, `pnpm install --frozen-lockfile`, nothing changed, `pnpm-workspace.yaml` untouched.

| # | Gate | Baseline given | Before any change |
|---|---|---|---|
| 1 | `pnpm test:phonology` | 251 passed (251) | 251 passed (251) |
| 2 | `pnpm test:dictionary` | 235 passed (235) | 235 passed (235) |
| 3 | `pnpm --filter @ilya/web check` | 0 errors, 12 warnings, 5 files | 0 errors and 12 warnings in 5 files |
| 4 | `pnpm --filter @ilya/web test` | 1824 passed (1824) | 1824 passed (1824) |
| 5 | `pnpm --filter @ilya/score-parser test` | 644 passed, 5 skipped (649) | 644 passed, 5 skipped (649) |
| 6 | `pnpm test:blurb` | 145 passed (145) | 145 passed (145) |
| 7 | `pnpm test:integration` | 55 passed (55) | 55 passed (55) |
| 8 | `pnpm ratchets` | OK | OK (offers `MarkupPane.svelte` 1358 to 1302; not acted on) |

## Item 1: the tween, Syllables to Corrections

WRITTEN. Commit: see `git log` (one commit for this item).

**Room first.** `Loupe.svelte` stood at its ceiling, 3044 of 3044, and the brief says report a needed rise and do not raise it. So the pure ink readers moved out unchanged to `apps/web/src/lib/score/loupe-ink.ts` (`textInk`, `musicInk`, `restOrNoteInk`, `staffVerticals`, `headerRightOf`, `pageMetrics`; formerly `Loupe.svelte:310-518`). The file is now 2882 lines. I did not lower the ceiling. The ceiling stays 3044 until item 5, where I lower it to the final count.

**What changed.**
- `loupe-tween.svelte.ts` (new): `ModeTween` (direction, lock, timer), `tweenDirection`, `animatePanel`, the constants 220 ms in, 150 ms out, `ease-out`. CODE DEFAULT: the curve is `ease-out`, the one `loupe-rise` already uses; the brief gives no curve.
- `Loupe.svelte`: the carets are now built in every mode (they must exist to fade out) and carry the class `loupe-carets`; the body svg takes `.carets-on` when `mode === 'corrections' && syllablesOpen`; the CSS fades `.loupe-carets` between 0 and 1 over the 0.32 their group already carries, with `visibility: hidden` at rest so a hidden caret takes no tap. `handleTap` ignores gaps unless the carets are on. The perimeter: `$effect.pre` reads the panel's height before the DOM changes, then `animatePanel` runs a Web Animations height animation to the new height. The pills and their arrow keys are ignored while the tween runs (`chooseMode`, `handleModeKeydown`). Reduced motion: no animation, no lock (`reducedMotion()`, plus the media query).
- Tests: `loupe-tween.test.ts`, 14 tests (direction, durations, lock, restart on a new change, reduced motion, dispose, the perimeter animation).

**Observed in the browser** (`node` Playwright script, desk and phone, m. 3; caret opacity read from computed style):

| Moment | Mode | Caret opacity |
|---|---|---|
| at rest in Syllables | Syllables | 0 (hidden) |
| 60 ms after pressing Corrections | Corrections | 0.347 (desk), 0.347 (phone) |
| settled | Corrections | 1 on the group, 0.32 on the ink |
| 50 ms after pressing Syllables | Syllables | 0.512 (desk), 0.511 (phone) |
| settled | Syllables | 0, hidden |

Panel height in the desk run: 0 shut; during the way in 52, 139, 200, 219 px at 20, 80, 160, 300 ms; back out 205, 152, 140 px. The lock: a second pill pressed 60 ms into the tween left the mode unchanged; the same press after 400 ms took. The chevron toggled the panel during a tween, and Escape closed the loupe during one. Under `reducedMotion: 'reduce'` no loupe animation ran and a second press took at once.

Screenshots: `item1-desk-*` and `item1-phone-*`, five frames each: Syllables at rest, mid-tween toward Corrections, Corrections at rest, mid-tween toward Syllables, Syllables at rest.

**Gates after item 1.**

| # | Result | Moved |
|---|---|---|
| 1 | 251 passed (251) | no |
| 2 | 235 passed (235) | no |
| 3 | 0 errors and 12 warnings in 5 files | no |
| 4 | 1838 passed (1838) | +14, all in `loupe-tween.test.ts` |
| 5 | 644 passed, 5 skipped (649) | no |
| 6 | 145 passed (145) | no |
| 7 | 55 passed (55) | no |
| 8 | ratchets: OK | `Loupe.svelte` could be lowered 3044 to 2882 |

**What I could not establish.**
- **"Notes and rests move" has nothing to act on in this tree.** Since calm-loupe slice 3 the spacing is derived with the carets placed in both modes, so every note stands at the same x in either mode. Ruling 4 says Corrections carries more generous spacing; the tree does not do that. Whether Dann wants the notes to open wider in Corrections is his call; I built the carets and the perimeter and left the notes where they are.
- **The perimeter I animate is the panel region's height.** That is the only part of the card whose size changes between modes today. NOT ESTABLISHED: that it is what the ruling means by the perimeter.
- **The taken caret's lavender ring** appears and vanishes at once; it does not fade with the carets.
- **Real-display feel:** timing was read from computed style at sampled instants; no one has watched it.
- **Closing the panel mid-tween** starts the opposite tween from the current opacity (CSS reverses smoothly) and the height animation restarts from the measured height. Seen by computed style only.

## Item 2: the meter run-in, 1 stave space in the loupe only

WRITTEN as a mechanism. **No visible change was measured on any measure I could raise, and I did not force one.** Read the last two paragraphs before the walk.

**What changed.**
- `packages/score-parser/src/staff-renderer.ts`: new option `meterRunInSp` (default `METER_RUN_IN_SP`, 2), read at the head layout (`systemHead`), at a mid-system column's meter room (`meterRoomFor`), and at the tacet rest's left bound. The page passes nothing, so the page keeps 2.
- `apps/web/src/lib/score/loupe.ts`: new `LOUPE_METER_RUN_IN_SP = 1`, used by `meterLayout` (the panel tops the run-in up to it) and by `openAfterPageMeter`'s reach.
- `apps/web/src/lib/score/loupe-render.ts`: `renderLoupeMeasure` passes `meterRunInSp: LOUPE_METER_RUN_IN_SP`. `bundleRenderOptions` and `renderLoupeSystem` do not, so the stage 3a proof (the loupe renders the page's system byte for byte) still holds.
- Room: `arcOutline` moved unchanged from `staff-renderer.ts` into `packages/score-parser/src/arc-outline.ts` (3534 to 3487 lines) so the renderer file does not grow past its ceiling. No ceiling raised.
- Tests: 2 in `staff-renderer.test.ts` (head and mid-system change at 1 sp, default 2), 1 in `loupe-render.test.ts` (measure 0's loupe slice is one stave space narrower than the page's), 1 in `loupe.test.ts`; the `meterLayout` tests now state the loupe's 1.

**What I measured, and why nothing moved.** With a meter-change copy of the fixture (`<time>6/8</time>` added at m. 5, kept outside the repository) I raised the loupe on m. 5 with the constant at 2, then at 1, desk and phone. The distance from the meter panel's right edge to the first music glyph's box was 3.599 sp and 3.598 sp on the desk, 3.605 sp both on the phone. That distance is `CARET_MARGIN` (`Loupe.svelte`, `lineGap * 2 + SQUIRCLE_CLEARANCE`, 3.6 sp): the body opens 3.6 sp left of its first ink to hold the head caret, and the page meter's own run-in is cut away by `openAfterPageMeter`'s "nothing the body draws is cut" rule. So the run-in the constant governs is not the air the singer sees. Screenshots: `item2-desk-meterchange-run-in-2-sp.png` and `...-1-sp.png` (identical to the eye), `item2-desk-page-system.png` (the page).

**What I tried, and reverted.** I opened the body only `LOUPE_METER_RUN_IN_SP` left of its first ink where a meter panel draws, widening only for a caret's footprint and a taken note's ring. Gap on the desk fell from 3.6 to 2.1 to 2.8 sp. The phone loupe scan (`pnpm --filter @ilya/web exec playwright test --project=phone`) then failed rules 1 (tap floor, 7 violations), 2 (squircle clearance 1.6 line-gaps, 17), and 5a (caret in the middle of its space, every measure). At baseline (`b709012`, same run) the scan fails only rule 5b on m. 16. So the head caret needs `CARET_MARGIN` as it stands. I reverted that change; nothing of it is in the commit.

**What I could not establish, and what it needs.**
- A visible 1 sp from the meter to the first note needs the head caret to stop living in the notation's air. That is ruling 11 (*the carets occupy a different conceptual plane from the notation*) and ruling 8's `CARET_MARGIN`, which this brief lists nowhere ("Not in this brief" names only cause 1c). It is a design choice for Dann: where the head caret stands when the meter is 1 sp from the note.
- Which measures show the change today: only a measure whose slice draws a meter at its head, in the case the body is allowed to keep that air. NOT ESTABLISHED on any score I have: the stock fixture's measure that declares the meter has no sung entry, so the loupe cannot be raised on it.
- The page's 2 sp: tested at the renderer (`staff-renderer.test.ts`), not read off the browser. My browser probe of the page returned 6 sp, because box-left of a glyph is not its ink; I did not trust it and did not report it as a finding.

**Gates after item 2.**

| # | Result | Moved |
|---|---|---|
| 1 | 251 passed (251) | no |
| 2 | 235 passed (235) | no |
| 3 | 0 errors and 12 warnings in 5 files | no |
| 4 | 1840 passed (1840) | +2 (one in `loupe.test.ts`, one in `loupe-render.test.ts`) |
| 5 | 646 passed, 5 skipped (651) | +2 (`staff-renderer.test.ts`) |
| 6 | 145 passed (145) | no |
| 7 | 55 passed (55) | no |
| 8 | ratchets: OK | `staff-renderer.ts` could be lowered 3534 to 3487 |

## Item 3: the tie runs into the run-on, with a tapered end

WRITTEN. Seen in the browser on a copy of the fixture with a tie added (kept outside the repository; see below).

**What changed.**
- `staff-renderer.ts` (tie loop, formerly `:3192`): new option `runOnTieSp`. When the last note of a slice is tied forward and has no partner in the slice, the tie is drawn with the same `arcOutline` as any tie (filled, tapered at both ends, same direction rule with the note read as its own partner), from the note's head to `runOnTieSp` stave spaces past the right edge, tagged `data-tie-runon`, not `data-tie`. The page passes nothing, so the page is unchanged.
- `loupe.ts`: `CARET_ROOM_SP` (2), `SQUIRCLE_CLEARANCE_SP` (1.6), and `RUN_ON_SP` (their sum plus `EXCERPT_TAIL_SP`, 4.6). `Loupe.svelte` now builds `CARET_MARGIN` from the first two, so the margin and the tie cannot disagree.
- `loupe-render.ts`: `renderLoupeMeasure` passes `runOnTieSp: RUN_ON_SP`, and 0 on the final measure.
- `Loupe.svelte`: the tie comes off the clone (the body's clip would cut it at the barline) and is drawn on its own layer, `.loupe-runon`, over body and tail in the body's coordinates, never taking a tap. Nothing is drawn on a final bar, which has no tail.
- Tests: 4 in `staff-renderer.test.ts` (nothing without the option; drawn to `runOnTieSp` past the edge; same filled tapered shape; none for an untied note) and 3 in `loupe-render.test.ts` (drawn as `data-tie-runon`; ends at 4.6 stave spaces past the edge; none untied or on the final bar).

**Observed.** `tied.musicxml`: the fixture with a tie start on m. 4's last note (E3) and the same pitch and a tie stop on m. 5's first note. Desk and phone, loupe on m. 4: the tie leaves the note, crosses the closing barline, and ends in a point at the right end of the strip (the overlay's right edge equals the strip's right edge: 1307.2 px on the desk, 552.5 px on the phone). Nothing was found inside the body panel (`.loupe-body [data-tie-runon]` count 0). m. 3, untied, draws none. Screenshots: `item3-desk-hit-m3.png`, `item3-phone-hit-m3.png`.

**Gates after item 3.**

| # | Result | Moved |
|---|---|---|
| 1 | 251 passed (251) | no |
| 2 | 235 passed (235) | no |
| 3 | 0 errors and 12 warnings in 5 files | no |
| 4 | 1843 passed (1843) | +3 (`loupe-render.test.ts`) |
| 5 | 650 passed, 5 skipped (655) | +4 (`staff-renderer.test.ts`) |
| 6 | 145 passed (145) | no |
| 7 | 55 passed (55) | no |
| 8 | ratchets: OK | `Loupe.svelte` 3044 to 2908 possible, `staff-renderer.ts` 3534 to 3493 possible |

**What I could not establish.**
- **The stock fixture has no tie on its sung line**, so the tie in the screenshots is on a copy I edited, not on a score Dann owns. The song the ruling names (m. 12) is on the Mac.
- **Which note the tie reaches** is not drawn. The tie ends at the strip's end, 4.6 stave spaces past the barline, as the ruling asks ("as if it reached a note that is not shown"). If `CARET_MARGIN` changes (ruling 8 and 11), `RUN_ON_SP` follows it.
- **The tie's weight** in these screenshots is the primitive-mode figure; its look with Finale Maestro's own tie thickness was not checked beside the page's tie.
- **A tie that leaves the last measure of a system** is drawn the same way; I did not check it against a page where the next system starts on the tie's partner.
- **The run-on tie adds its ink to the slice's lowest or highest ink**, as a page tie does, which can move the IPA row by a pixel or two in a measure that ends in a tie. Not measured.
- The phone loupe scan was not re-run for this item: the stock fixture has no tie, so the scan's measures do not draw one.
