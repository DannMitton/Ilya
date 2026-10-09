# Report: four fixes from Dann's walk of 2026-10-09 (QUEUE row 59)

Cloud lane (Claude Code, Sonnet), branch `cloud-lane`, brief `brief-code-walk-findings_r1_2026-10-09.md`. Four parts, one commit each: `8f8b20a` (print), `f001647` (legend), `fdd0f45` (clef), `d0b65a9` («не»). Status: `WRITTEN` on the code. `DONE` is Dann's look.

Method for every part: the dev server (`vite dev`) in this container, the sandbox's Chromium 1194 driven by Playwright, the tracked fixture `sunless-01-engraved.musicxml` and seven OMR-read fixtures from the tree, English and French. The Markup screenshots and the legend measurements use a **synthetic stored voice** I wrote into `localStorage` (ten vowels with plausible readings, `voiceType: "bass"`), because Markup draws the stems key only for a singer with measured vowels, and Dann's voice is not in the repository.

## Section 3, answers first

### 3.1 Print: what makes the extra page

Measured before any change, Chromium `page.pdf` (letter, `preferCSSPageSize`), pages against the "Page N of M" on screen:

| Fixture | Markup before | Insights before | After |
|---|---|---|---|
| `sunless-01-engraved` | 3 sheets, 4 printed | 1 sheet, 2 printed | equal |
| `sun1` (joined) | 2, 3 | 1, 2 | equal |
| `sun4` | 3, 4 | 1, 2 | equal |
| `sun5` | 5, 6 | 1, 2 | equal |
| `sun6` | 4, 5 | 1, 2 | equal |
| `tch` | 3, 4 | 1, 2 | equal |
| `sun3-2` | 2, 3 | 1, 2 | equal |
| `tch-1` | 2, 3 | 1, 2 | equal |

Text printed correctly before and after (1 and 1). Every Markup and Insights print had exactly one page too many, so the cause is structural, not specific to a song.

**Cause.** `.markup-paper-container` (`apps/web/src/lib/markup/MarkupPane.svelte:1230`) and `.insights-container` (`apps/web/src/lib/insights/InsightsPane.svelte:845`) are flex columns with `gap: 2rem` and `padding-bottom: 2rem`. The print reset in `apps/web/src/app.css` (the block at `:312`) named `.paper-container`, which is Text's stack only, so these two kept their padding. With print media emulated, the Markup stack measured 3,264 px against 3 sheets of 1,056 px (3,168), and the last `.paper-page` ended at 3,232 px: 32 px of padding below the last sheet. A last sheet that exactly fills its page leaves no room for that, so Chrome prints a fourth page. The brief's `.paper-page:last-child` rule (`app.css:345-348`) was working: the extra page came from the container's trailing padding, not from a break after the last sheet.

**Fix.** `apps/web/src/app.css:312` onward: the existing reset now names all three stacks, `.paper-container, .markup-paper-container, .insights-container`. One rule, not a second mechanism.

**Guard.** `apps/web/e2e/print-pages.test.ts`: opens the tracked fixture, then for Text, Markup, and Insights asserts printed pages equal sheets on screen. Positive control: against the pre-fix `app.css` it fails with `markup: Expected 3, Received 4`; with the fix it passes. It is a Playwright test, so it is not in gate 4's count.

### 3.2 Legend: widths measured

At desk width the header's content row is 624 px. At the subtitle's 14 px:

| Language, voice name | Subtitle natural width | Legend, one line | Legend, stacked (widest item) |
|---|---|---|---|
| EN, "Dann" | 303 | 366 (171 + 12 + 183) | 183 |
| FR, "Dann" | 440 | 479 (234 + 12 + 233) | 234 |
| EN, "Dmitri Aleksandrovich Hvorostovsky-Mitton" | 568 | 366 | 183 |
| FR, same long name | 704 | 479 | 234 |

At the footer's old 9.5 px the two items were 131 and 139 px. A subtitle plus a one-line legend fits in 624 px in none of the four cases, so the ruled "stack at the right" is the normal case, not the exception.

### 3.3 Clef: where `NotePicker` is used

`apps/web/src/lib/voice/CalibrationWizard.svelte` only, six times (`:1527-1583`: range high and low, tessitura high and low, the two passaggi). The wizard already holds the stored voice type (`let voiceType = $derived(activeVoice?.voiceType)`, `:249`), so every place can reach it.

### 3.4 «не»: the count

I read every tracked `.ts`, `.json`, `.txt`, and `.musicxml` (lyrics assembled from `<syllabic>` and `<text>`) outside `data/`, and took each word that follows «не». The real dictionary (943,106 entries) and the singer supplement were loaded.

- 15 distinct words follow «не».
- 1 misses alone: «проглядная». It hits joined, as «непроглядная», stress index 2.
- 1 misses alone and hits joined; 0 miss alone and miss joined.

This is the tree's own text only, which is small. It is the 1 case Dann saw.

## The change, part by part

### Part 1: print (`8f8b20a`)
`apps/web/src/app.css:312` and the e2e guard above. Gates: web tests 2,054 (unchanged), ratchets OK.

### Part 2: the legend on the subtitle's line (`f001647`)
- `apps/web/src/lib/components/Paper/LegendItems.svelte` (new): the legend entry drawing, lifted out of `PageFooter.svelte` unchanged, with the label size read from `--legend-font-size` (9.5 px where unset).
- `apps/web/src/lib/components/Paper/PageFooter.svelte`: draws the provenance legend through `LegendItems`; 75 lines fewer.
- `apps/web/src/lib/components/Paper/TitleHeader.svelte:57` (props), `:105-106` (the two derived states), `:135-146` (markup), `:250` onward (styles): the legend sits right-aligned on the subtitle's line, at 14 px in small caps. The widths come from hidden probes carrying the live text and type, not estimates.
- `apps/web/src/lib/markup/MarkupPane.svelte:960` and `:1043`: both Markup headers (the score page and the empty envelope) pass `legendItems={markupLegend}` and `notationFont`; the footers' `legendItems` are now `[]`.
- DESK DEFAULT as briefed: the whole legend moves (stems key and, when present, the withheld sigla). The footer keeps the credits, the page number, the broad-analysis note, and the footer's own provenance legend on Text.

**Three cases, one of them outside the ruling.** (1) Subtitle and legend fit one line: same line. (2) They do not, but the subtitle fits whole beside the stacked legend: the two items stack at the right, as ruled (English with a short name). (3) **Outside the ruling, my decision:** where the subtitle would not fit whole even beside the stacked legend, the legend takes its own row under the subtitle, right-aligned, still above the rule. Without case 3 the French subtitle («Profil de formants : une carte des résonances de la voix « Dann »») was cut with an ellipsis, and it carries the voice's name, so the old footer placement never cost the singer that. Case 3 has the same height as stacking. Dann can overrule it; the code is the `below` state in `TitleHeader.svelte`. The legend's weight and ink stay as the footer had them (regular, stone); only the size and the case follow the subtitle. That is JUDGEMENT.

Screenshots, `docs/sessions/walk-findings-shots/`: `legend-header-en-short-name.png` (stacked), `legend-header-fr-short-name.png` (own row), `legend-header-en-long-name.png` (own row), `legend-header-fr-long-name.png` (own row; the long name is clipped by the existing header rule, as it was in the footer-era header).

**Page 1's systems: NOT ESTABLISHED as restored.** On this fixture with the synthetic voice, the content window goes from 700 px (header 105, footer 129) to 706 px (header 127, footer 101): the legend left the footer (−28 px) and cost the header one line (+22 px), a gain of 6 px. Page 1 still holds five systems. With the synthetic voice a system measures 118 to 123 px with a pitch of about 146 px, so a sixth needs about 850 px; with no stems analysis at all (no legend, no marks) systems are 111 px and the window is 749 px, which holds six. I cannot say whether Dann's voice, whose marks differ, gets a sixth system back, because his voice is not in the repository. The ruling's own layout (a stacked legend of two lines) costs the header one more line than the old single footer row did, so on a song that was on the edge it may not return. If it matters, the knob is the stacked legend's line height.

### Part 3: the clef (`fdd0f45`)
- `apps/web/src/lib/voice/note-picker.ts:54` (`clefForVoiceType`) and `:87` (`clefFor(p, voiceType?)`): bass, bass-baritone, and baritone take the bass clef; tenor, soprano, mezzo-soprano, contralto, and countertenor take the treble clef; no type, "Not sure", or an unknown type keeps the pitch rule. The sort uses `bucketFor` (`engine/plausibility.ts:135`), the one place a declared type is sorted; only countertenor is named here, because the ruling calls it a treble voice and `bucketFor` leaves it in `union`.
- `apps/web/src/lib/voice/NotePicker.svelte:57`, `:60`, `:122`: a `voiceType` prop.
- `apps/web/src/lib/voice/CalibrationWizard.svelte:1531-1583`: passes `{voiceType}` to all six pickers, on the same line as `{language}`, because the file sits at its ratchet ceiling of 2,124 lines.
- DESK DEFAULT: a type's clef is not used for a note the drawing box could not show (`VISIBLE_STEPS = 15` half-steps from the middle line; a tenor's C2 on a treble clef is 20 below). That one note takes the pitch rule's clef.
- Tests, `apps/web/src/lib/voice/note-picker.test.ts`: the clef for every Tier 1 type, for no type, "Not sure", and an unknown type; D♯4 on a bass is bass where the pitch rule alone gave treble; a bass's F♯4 sits on two ledger lines (`[6, 8]`); the box fallback. +6 tests.

### Part 4: «не» (`d0b65a9`)
- `apps/web/src/lib/ne-join.ts` (new): `joinAfterNe(line, lookup)`. Where a word right after «не» is not found on its own, it is looked up joined to «не», and the joined stress, one syllable on, is read onto the apart word. The printed spelling, gloss, and lemma are untouched. A word found on its own stands as printed. A joined entry stressed on «не» itself changes nothing. The dictionary arrives as a `lookup` argument, because `pipeline.ts` is the only file in the app allowed to import the engine.
- `apps/web/src/lib/pipeline.ts:44` (import) and `:359` (the call): it runs after the singer's ё toggles and stress overrides (step 1.5), so it cannot undo one.
- Tests, `apps/web/src/lib/ne-join.test.ts` (+6): «не проглядная» takes stress index 1 and keeps its spelling; «про» is [prɑ] (reduced), not [pro]; a control with no joined entry reproduces the walk's unreduced «про»; «не ловко», found both ways, stands as printed; a word with no joined entry stays at unknown stress; «не» does not reach across another word.

## The eight gates after part 4

| # | Gate | Baseline `53035bd` | After row 58 | Now |
|---|---|---|---|---|
| 1 | `pnpm test:phonology` | 251 passed (251) | 251 | 251 passed (251) |
| 2 | `pnpm test:dictionary` | 235 passed (235) | 235 | 235 passed (235) |
| 3 | `pnpm --filter @ilya/web check` | 0 errors and 12 warnings in 5 files | same | 0 errors and 12 warnings in 5 files |
| 4 | `pnpm --filter @ilya/web test` | 2035 passed (2035) | 2054 | **2066 passed (2066)** |
| 5 | `pnpm --filter @ilya/score-parser test` | 650 passed, 5 skipped (655) | same | 650 passed, 5 skipped (655) |
| 6 | `pnpm test:blurb` | 145 passed (145) | 145 | 145 passed (145) |
| 7 | `pnpm test:integration` | 55 passed (55) | 55 | 55 passed (55) |
| 8 | `pnpm ratchets` | OK | OK | OK (403 source files) |

Gate 4 moved by +12 in this brief: +6 in `note-picker.test.ts` (part 3) and +6 in the new `ne-join.test.ts` (part 4). The print guard is a Playwright test and is outside the eight.

## Could not establish

- **Page 1's sixth system on Dann's song.** Above. Not reproducible without his voice.
- **Every fixture song with a score.** I ran 8 of the 58 tracked `.musicxml` files in both languages (the tracked engraved fixture and seven OMR reads): all equal after the fix. The other 50 are mostly page-split copies of the same reads and the e16 harness fixtures; I did not run them.
- **The note picker in a browser.** The clef is tested by unit tests and type-checked, but I did not open the calibration wizard's characteristics phase to see a bass's D♯4 drawn.
- **The withheld-syllable sentence in the header.** No fixture draws a withheld syllable here, so the long sentence's wrapping in the stacked and own-row states was written but not seen.
- **ё toggles on a word after «не».** A toggled word is rebuilt before the join runs, so it is covered by the same pass; I did not write a test for it.
- **Dann's "Page 2 of 2 prints three".** On this fixture without a voice I measured 3 sheets and 4 printed, not 2 and 3. The sheet count depends on the singer's marks. The fault is the same: one printed page too many.
