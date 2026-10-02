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
