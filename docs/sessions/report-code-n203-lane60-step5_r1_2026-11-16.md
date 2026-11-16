# Report: N.203 lane 60, Step 5 (the summary becomes "Your vowel space")

2026-11-16. Code (cloud session), branch `cloud-lane-60`, on `16922501`. Brief r3 section 3 Step 5 with the review's amendments 1, 19, 20, 21, 22. Pictures: `docs/sessions/report-code-n203-lane60-pictures/step5-*.png`. Paths under `apps/web/src/`.

Test rule for this step (desk, 02:4x): only the test files for what the step changed. The eight gates and the Playwright suites run once at the end of Step 3.

## 1. What changed

- `lib/voice/CalibrationWizard.svelte` (1,726 to **1,376 lines**, 351 freed against a ceiling of 1,727). The summary phase is now: the note on readings outside Ilya's values (`OutsideNote`, as built), `SummarySheet` (title, subtitle, voice name, chart, one table, legend, sources, Print), **Finish** (filled), **Back to the ten vowels** (quiet), and **Start over** with its confirmation (quiet, shown only when a reading is stored, by `hasAnyReadings`). Removed: the title and both ledes, the roster snippet and its Re-take column, `continueTourButton`, `challengingInvite` (the three-vowel invitation), `characteristicsButton`, `displayFormant` and the `deriveFrom` import, `openChallenging` import, `challengingOffered`, `finished`, `capturedCount`, `defaultsComplete`, `hasCharacteristics`, and about 134 lines of roster CSS.
- **Finish writes nothing** (amendment 20). `finish()` calls only `onComplete?.(profile)`; it no longer calls `persist()`, which set `calibratedAt`, the date INSIGHTS prints. Every reading is already saved when captured (`commitReading`), so a singer who only looked does not re-date her readings.
- **Back to the ten vowels** (`backToTen`) follows the `record` rule of amendment 6 as far as Step 5 can: with a stored reading it opens the capture screen by `openTour(profile)` (at ten recorded, `[i]`); with none it goes to Welcome. Step 1 will route this through the `record` request.
- `routes/+page.svelte:3887` (+1 line, now 5,512 against 5,534): `onComplete={exitCalibration}` at the one mount, so Finish closes the takeover to the Drawer at rest. No new callback (amendment 1).
- `lib/voice/chart/readings.ts` (+36): `summaryRows(profile, placeholders, language)` wraps `readingListRows` and adds `marks: { provisional, beyond, noiseFloorUnmeasured }` to each recorded vowel's row. `readingListRows` is not changed, so lane 59's capture list is untouched (`readings.test.ts` pins it, still passing).
- `lib/voice/chart/VowelSpaceSheet.svelte` (+90): the table is **ten rows always**. A recorded vowel has a filled mark; a vowel not recorded has a hollow mark whose accessible name is `capture.button.placed` ("placeholder", « valeur par défaut »), not printed in the row, and its values in lighter ink. The roster's marks sit in the vowel's own cell, under the name: "Provisional", "Beyond Ilya's reference values", "Noise floor: Unmeasured", and the ⓘ beside [o] (new prop `onLearnNote`, not drawn with `forPrint`). "Try again" stays where a recorded vowel has no fR2. **The legend now sits below the table** (amendment 19). On narrow screens (max 430 px) the table steps down one size and each row holds one line; on paper the marks sit on the row's line.
- `lib/voice/chart/SummarySheet.svelte`: passes `onOpenLearnNote` through.
- `lib/i18n.ts`: new `calib.summary.backToTen` ("Back to the ten vowels" / « Retour aux dix voyelles », sheet line 25, character for character). **Retired, marked UNUSED in place:** `calib.roster.reading.estimated`, `calib.roster.actionsHeader`, `calib.challengingInvite.button`, `.caption`, `calib.characteristics.editButton`, `.addButton`, `calib.summary.title`, `.savedLede`, `.progressLedeSuffix`. Header: 1,281 keys, `calib.` 101. (`calib.anchor.*` and `calib.readiness.guidance` retire in Steps 2 and 4.) No key is added under `capture.` or `sheet.` (amendment 22).

## 2. Tests

Pinning tests for each retired key, listed before the change: none outside `i18n.ts` and the wizard itself (grep of `apps/web`, no unit or e2e file names any of the nine keys). The end-to-end sites this step breaks are in section 5.

Added or changed:
- `chart/readings.test.ts`: `summaryRows` leaves `readingListRows` output as it was and adds only marks; marks are true only where they apply, never on a placeholder.
- `chart/VowelSpaceSheet.test.ts`: the old "no table with nothing sung" pin (`:29`, amendment 22) now says ten placeholder rows; new tests for the hollow mark's name in English and French, the marks only where they apply, the ⓘ only with a handler and never on paper, and the legend after the table.

Run (desk's rule): `VowelSpaceSheet.test.ts`, `readings.test.ts`, `i18n*.test.ts`, which includes `i18n-index.test.ts` (key count 1,281): **54 passed (54)**. Earlier in the step a wider run of `src/lib/i18n`, `src/lib/voice`, and `src/lib/components/Drawer` gave 750 passed, 4 failed; the 4 were my new tests' selectors (Svelte adds a scope hash to class names in server output), fixed and re-run.

## 3. Pictures, and what I saw

`step5-{phone,desk}-{en,fr}-{one,nine,ten,marked}.png` (390 by 844 at 2x, and 1440 by 900), and `step5-print-{en,fr}-10-1.png`. I looked at: phone English ten and marked, phone French marked (twice, after two faults), desk English marked, desk French ten, and both prints. The remaining variants (one, nine) differ only in which rows are hollow (the table is always ten rows) and I did not open each. Faults the pictures showed and I fixed: marks overlapping the numbers and the fR2 column clipping at 390 px in French; at the first fix a wrapped English table; a second page on print.

**Measured, 390 by 844, head of the sheet to the table's bottom** (browser, `getBoundingClientRect`): English **695 px** (one line a row, 36 px a row; table 381); French **673 px**; with the three marks, English **777 px**, French **756 px**. Desk Drawer at 900 high: **732 px** (table 363), with marks **782 px**.

**"Done when" is NOT met as the brief words it.** "The chart and all ten rows in one view" needs the sheet's head, chart, and table to fit what the takeover shows. The takeover's scroll area is 732 px on the phone and 784 px in the desk Drawer, and the sheet's title starts about 95 px below its top, below the voice switcher block (name and chevron, about 110 px). So the sheet needs about 790 px on the phone (English) and about 830 px at the desk: over by roughly 60 px and 50 px, and over more with marks. The switcher block leaves the takeover in Step 2 (the name becomes a plain label), which frees about 80 to 100 px. I expect Step 2 to bring the unmarked case into one view, but I have not shown it: **the claim is Step 2's to verify, with new heights.**

**Print:** the sheet with ten rows and three marks (English and French) holds **one letter page** after the print-only inline marks (before it, English ran to a second page by three lines of sources). A sheet with three rows also holds one page. Method: Chromium print emulation, `page.pdf` Letter, `preferCSSPageSize`, pages counted from the PDF.

## 4. Where the usable counts disagree (brief section 4; fixture not yet run)

Unchanged from Step 0: `usableReadingCount` excludes an implausible reading not kept; `sungSet` and the table's own "recorded" test (`zones.ts` `isSung`, `readings.ts isSung`) count it. So for a voice whose readings are all implausible the table shows a **filled** mark for those vowels while the pane's sentence (Step 2, `usableReadingCount`) says nothing is recorded. I have not decided which should win for the table; the filled mark follows the chart, whose dot is also drawn. Put to the desk.

## 5. End-to-end sites this step breaks (all in `e2e/calibrate-new.test.ts`, lane 59's file until its merge; review amendment 2)

`:32` (Continue after readiness, unchanged by this step, Step 4's), `:110`, `:161`, `:170`, `:176` ("N of 10 vowels sampled", ledes gone), `:146`, `:168`, `:187`, `:396` (roster Re-take, gone), `:177`, `:331` (summary Continue, gone), `:392` (the test title names Re-take). Not edited. They are repaired after the merge of `Shane`, as amendment 2 orders. I have not run the suite; I expect those to fail until then, and say so rather than claim it.

## 6. What I could not establish

- Phone and desk "in one view": above, not met; Step 2 to re-measure.
- The three counts' disagreement as a number: no fixture run yet.
- The ⓘ's tap target at 44 px on a coarse pointer: CSS only, not touched in a browser.
- svelte-check and the eight gates: by the desk's rule, once at the end of Step 3.

## 7. For Dann's eye

- The marks sit **under** the vowel's name on screen (as the roster had them, his placement of 2026-07-10) and beside it on paper. A marked row is taller. If he wants them on the row's one line on screen too, the cost is a wider name cell at 390 px.
- The legend's words on this screen still say "sang" and "sung" (`sheet.legend.*`, `sheet.legend.hull`) against his ruling of 01:13 that the act is "record". Line 26b and supplement item 7 change them; lane 59 owns those keys. They will read wrong on this screen until that lane merges.

## 8. Addendum, written in Step 2

The "Done when" measurement in section 3 is **superseded by Step 2's report** (the voice switcher left the takeover, and I trimmed the narrow table). Short form: the sheet's head, chart, and all ten rows now fit the takeover's visible height at 390 by 844 in English (18 px to spare) and French (39 px), and in a desk Drawer at 900 high (5 px), with no note above and no marks. The pictures `step5-*.png` were retaken. With three marks showing it still does not fit (over by 43 to 65 px on the phone, 45 at the desk).
