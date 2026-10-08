# Report: the tessituragram, refined (r1, 2026-10-07)

Answers `brief-code-tessituragram-refined_r1_2026-10-07.md` (QUEUE row 42). Written by Code (Sonnet) on branch `Shane`, base `21dbd8f`, working tree dirty with this change and the desk's untracked briefs. No git writes. **WRITTEN, not DONE: DONE is Dann's look on the alias and a printed page.**

## What changed

| Where | What |
|---|---|
| `apps/web/src/lib/insights/tessituragram-layout.ts` (new, pure) | Every position, moved out of the component so a test can check contacts. `layoutTessituragram` `:273`, `firstClear` `:175`, `slotWithLeader` `:189` (the leader), `contacts` `:663`. Constants (step 11 `:45`, bars 6 and 4.5, labels 10, title 9.5) are Design's table. |
| `apps/web/src/lib/insights/Tessituragram.svelte` (rewritten, draws only) | Ruling 1: `.halo` and its CSS are gone. Ruling 3: one treatment for both name columns (500, 10 px). Ruling 4: band from the bars' baseline to 4 px past the longest bar, slim bracket beside the barline labelled "tessitura". Ruling 6: normal bars `--rose-chip`, a bar with a finding `--rose-ink` with its label at 600, passaggio lines `--rose-ink`; colour-roles comment at the top updated. Ruling 7: the key, drawn under the figure inside the SVG, left-aligned with the bars. |
| `apps/web/src/lib/i18n.ts:1716-1718` | The three ratified key strings (`insights.figure.key.tessitura`, `.passaggi`, `.ledger`), English and French exactly as in the brief. French *passaggi* is italic through the existing `italicRuns`. No other new text. |
| `apps/web/src/lib/insights/tessituragram-layout.test.ts` (new, 22 tests) | Drawing 1 touches nothing in both languages; bars equal across languages; band and bracket geometry; the key lists only what is drawn; the extremes; the leader. |

## Decisions the code made, to check

- **No halos, labels find clear places.** "half the singing" tries above, beside, below, one line then two (French breaks after "du" when one line will not fit); "centre A3" tries level, just above, just below. Only then a slot with a leader.
- **Leader** (Ruling 2): solid, 0.6 px, `--rose-ink`, no arrowhead, a diagonal to a free slot; the leader crosses no label or bar (it may cross a faint or dashed line, because a leader to a slot past a passaggio line must). **Forced and seen**: unit case "is used by the layout when 'centre' and 'half the singing' have no near place" (a test seam, `extraObstacles`, blocks every near place); screenshot `docs/sessions/tessituragram-shots/forced-leader-en-fr.png`. That image is drawn by a small throwaway renderer from the layout, with a stand-in text measure and without clef, notes, or key; it shows the leader's geometry, not the live look. No real song has needed a leader.
- **One bar scale for both languages**: the length is the smaller of the two languages' budgets (`barMaxFor` `:344`). Tchaikovsky in the live app, English and French: both figures 570 by 217.25 and the same bars.
- **Compass notes at the new size.** The step is 22 px per staff space, so clef and heads grow with it. The barline moves right (minimum 150) if the clef plus a sharp or flat on a compass note needs room; tested for a treble clef with F♯4.
- **The dead space above Design's drawing 1 is not reproduced.** Design's figure has about 30 px between the title and the first label. The code starts content 20 px below the title baseline, so the live figure is **217 px, not 228**, and that includes the key row (about 24 px). Design's 228 had no key.
- **The key sits on its own row** under the compass words, not on the compass's row. Each mark is drawn as the figure draws it (band swatch at 22 percent, dashed rose-ink line, faint dotted line).
- **A bar's own label may sit on the band** when its bar is inside the tessitura. The contacts check allows it for bar labels only. Rose ink on the band is about 5.9:1 (computed by hand: band over `#F0EBE0`), over the 4.5:1 text needs. The grey line names never reach the band. Say if you want such labels pushed beyond the band with a leader.
- **`quiet` still draws the bars at 0.5 opacity** (no range typed). That is today's behaviour, I did not change it, and a half-opacity chip bar is under 3:1. Flagging, not fixing.

## Share-rounding check

The live code already normalizes. `insights.ts:598` runs `wholePercents` (`:673`, largest remainder) on the three zones, so they sum to 100 by construction. Design's 4, 34, 63 came from its own generator, not from the app. Nothing changed. The existing test `insights.test.ts:245` covers it.

## Which face carries ♯ and ♭

The pitch names inherit `font-family: var(--font-sans)` from the SVG, which is exactly what the prose's `.acc` rule sets (`InsightsPane.svelte:949`, `:1267`, via `accidentalParts`), so the figure and the prose use the same stack and no second face was introduced. **Which installed face actually supplies the glyph is NOT ESTABLISHED:** Source Sans 3 has no ♯ or ♭ (Design's finding), so the browser takes the next face in the stack that has it (`system-ui` first). I did not identify it. I did not change pitch names to a different face.

## Page fitting

`insights.ts:781` (`PAGE_ONE_FINDINGS = 2`) is a measured budget, not an estimate of the figure's height, and `InsightsPane.svelte`'s `fitPageOne` measures the live page and demotes things one step at a time, so no number needed correcting and I changed none. What moved, Tchaikovsky with the typed range and passaggi, French and English, letter, printed to PDF: page one holds the figure, the fit table, the verdict and the findings line; the vowel list sits on page two ("page 1 of 2", `pdf-fr-1.png`, `pdf-en-2.png`), with a spare of roughly 90 CSS px on page one. **Whether the vowel list was on page one before this change is NOT ESTABLISHED:** I did not render the old component (no stash or checkout allowed, and a second checkout poisons the live Vite cache, per memory). By arithmetic the old figure was about 70 px shorter, which would leave about 160 px of spare, less than the vowel list needs, so I expect it was on page two already, but I did not measure it. Insights does not overflow the foot; no `[Ilya] Insights page one overflows` warning appeared.

## Gates (all eight, run one by one: `ilya-ship.sh` refuses on untracked files)

| Gate | Result | Baseline |
|---|---|---|
| 1 phonology | 251 passed | 251 |
| 2 dictionary | 235 passed | 235 |
| 3 web-check | 0 errors, 12 warnings, 5 files | 0, 12, 5 |
| 4 web-test | **1977 passed** (116 files) | 1955; **+22**, all in `tessituragram-layout.test.ts` |
| 5 score-parser | 650 passed, 5 skipped (655) | same |
| 6 blurb | 145 passed | 145 |
| 7 integration | 55 passed | 55 |
| 8 ratchets | OK, 392 files | OK |

**Gate 4 moves 1955 to 1977; `ilya-ship.sh` line 79 needs the new number and a comment line** (the desk's file, not touched). Ratchets: neither `Tessituragram.svelte` (239 lines) nor `insights.ts` (unchanged) is under a ceiling, and the new files are well under the 1000-line limit for new files. The ratchet script prints two ceilings that could be lowered (`MarkupPane.svelte` 1358 to 1302, `Loupe.svelte` 3013 to 3012); they predate this work.

## Screenshots, `docs/sessions/tessituragram-shots/`

Tchaikovsky, from `docs/sessions/measure-phase1_r1_2026-10-02/tchaikovsky-op38-3-voice.musicxml`, with a test voice I seeded in localStorage (range G2 to F4, tessitura F♯3 to C♯4, primo A3, secondo E♭4, five vowels calibrated). Dev server at `http://localhost:5173`, headless Chromium, device scale 2.

- `tchaikovsky-en-desk-1440x900.png`, `-fig.png`; `tchaikovsky-fr-desk-1440x900.png`, `-fig.png`: desk at 1440 by 900.
- `tchaikovsky-{en,fr}-print.png`, `-print-fig.png` (print media emulation) and `tchaikovsky-{en,fr}-print.pdf` with `pdf-{en,fr}-{1,2,3}.png`: the printed pages on white paper at Letter. The PDF has three pages because it prints the whole app (page 3 is not Insights).
- `forced-leader-en-fr.png`: the fallback leader (see above).

Compared with drawing 1 (screen) and drawing 2 (print) by eye: same columns, same place for every label, same band, bracket, dashed lines, and shares; "centre A3" takes its second place (just above the tick) as Design said; "half the singing" sits above the bracket; the French breaks "la moitié du / temps chanté" in the forced case only (the live French fits on one line). Differences: the figure is shorter (217 against 228, see above), the key is new, and the bar length is 143 px by the stand-in measure in the unit test against Design's 152 or 137 (the live length depends on the canvas measurement; I did not read it back).

**Measured in the live render**, English and French, screen and print: every label's ink box (baseline plus 0.74 and 0.25 of the size) against every bar, line, and other label: **no contact in all four.** (A first run flagged overlaps because it used the browser's line boxes, which are 12 px tall for 10 px type; ink boxes are the right test.)

## The extremes

Each is a unit test in `tessituragram-layout.test.ts`: one pitch; two pitches a semitone apart; two octaves with a stated tempo (seconds), passaggi, no tessitura, and a bar with two findings (labels stacked 12.5 px apart, English and French); no passaggi (the bars may run longer); no tessitura (no band, no bracket, no key entry); no ledger line (no key entry); quavers (Tchaikovsky); a treble clef with a flat or sharp compass note. None was seen in the app: the app run was the Tchaikovsky song only.

## Could not establish

- Which installed face draws ♯ and ♭ (above).
- Whether the vowel list was on page one before the change (above).
- That 10 px (7.5 pt) reads on paper: I did not print to a printer. A test print of `pdf` page one at 100 percent would settle it.
- The unit tests measure text with a stand-in (5 px a character at 10 px). The live render measures with the canvas; the live contact check passed, but a different font arrival order (Source Sans 3 late) could change a bar length by a few pixels until `document.fonts.ready` fires and the figure lays out again.
- The extremes in the live app, as opposed to the unit tests: no score in the repository has a stated tempo or spans two octaves (Design found the same).
- Design's finding 3, the unnamed sung natural on a space (the E3 bar): left as it is, per the brief.
- The dev server is still running on 5173 from this session (`ilya-web`).
