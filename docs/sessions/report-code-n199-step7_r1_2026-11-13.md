# Report, N.199 Step 7: the ratified words, English and French

2026-11-13, cloud lane, branch `cloud-lane-51`. Brief `brief-code-n199-steps-6b-7_r2_2026-11-13.md`, item by item. Two commits: the words (items 1 to 7), then `FrSym` in its own commit (item 8, section below). One report.

Gates before this step (after 6a): phonology 462, dictionary 248, web-check 0 errors and 12 warnings, web-test 5586 passed and 1 skipped, score-parser 785 and 5 skipped, blurb 178, integration 155, ratchets OK.

## Two rulings taken from Dann's message, not from `OPEN.md`

1. **Counts are digits in both languages** (Dann 2026-11-13 11:52). `capture.hint.toGo` fills `{count}` with a digit: "7 to go, in any order. Ilya keeps a placeholder for each until you sing it." / « Il en reste 7, dans l’ordre de votre choix. Ilya garde une valeur par défaut pour chaque voyelle jusqu’à ce que vous la chantiez. » The count words and `countWord` in `screen-logic.ts` are deleted. (This ruling is also in the merged `OPEN.md`, the last bullet of section N.199.)
2. **`sheet.legend.zones` rewritten** (ratified EN and FR 12:01, superseding the 10:48 text), copied from your message: the EN and FR as given, the French with U+2019 apostrophes. It is **not in `OPEN.md` on `Shane`**; it is in `i18n.ts` and pinned in the new test.

## What changed, with path:line

1. **The helper.** `apps/web/src/lib/i18n.ts` `tv(key, lang, vars)` (just above `stringKeys`) fills `{v}`, `{n}`, `{count}`, `{name}` over `t()`; an unfilled placeholder stays visible. The language is threaded to `hintText` and `mainButton` (`voice/chart/screen-logic.ts`), `buttonLabel` and `stopLabel` already had it, and `VowelChart.svelte` takes a `language` prop; `VowelCapture.svelte` and `VowelSpaceSheet.svelte` call `tv(..., language, ...)`.
2. **Every key moved.** The 46 keys of `draft-strings.ts` (30 `capture.*`, 16 `sheet.*`) are in `i18n.ts` at the end of the table, each with English and French. **`draft-strings.ts` and its test are deleted.** The index at the head of `i18n.ts` has two new lines (`capture.` 30, `sheet.` 16) and the total reads 1,269 keys (was 1,223); `i18n-index.test.ts` passes. The French was **extracted from `OPEN.md` by a script, not retyped**, then each string was checked: no ASCII apostrophe, a U+00A0 before every colon, no stray space.
3. **English that differs from `draft-strings.ts`, applied from `OPEN.md`** (key by key):
   - `capture.hide`: "Hide the chart and **the readout** while I sing" (was "numbers").
   - `capture.hidden`: "The chart and **the readout** are hidden while you sing. They return when this vowel is captured."
   - `sheet.legend.hull`: "The outline **surrounds** your sung vowels. It is dashed until all ten are sung." (was "joins").
   - `sheet.legend.zones`: the 12:01 text above (the 10:48 text read "...Where they cross, the colours blend."; the draft read "mix").
   - `sheet.provenance`: the corrected line (baritones from Bozeman's "Levels of Acoustic Registration", the placeholder source explained).
   - **Typography I normalised and you may strike:** `OPEN.md` writes English apostrophes and quotation marks straight; I wrote U+2019 and curly double quotes, as the tree does. No wording changed.
   Every other key's English matches `OPEN.md` after that normalisation. Keys with no English in `OPEN.md` (the cue and button rows, `sheet.col.fr1/.fr2`) kept the draft's, which is brief r5's section 7 as Dann ratified it on 01:06 and 10:48.
4. **French you have not ratified: none.** Every one of the 46 has ratified French in `OPEN.md` or in your message. Not seated here, because they are 6b's: `capture.credit.plate` and `.noPlate`. The count words had no French and are gone.
5. **The pause line** (`pacifier.pause` in `i18n.ts`): "Stop singing, but maintain the shape of your vocal tract for that vowel." / « Arrêtez de chanter, mais gardez la forme de votre conduit vocal pour cette voyelle. » **`PAUSE_MS` is 3000** (`voice/count-in.ts`, was 2000). **It reaches the wheel through `pacifier/count-in.ts`, so every singer's count-in becomes six seconds at the ship, and the new line is also what the wheel says in the pause.** Moved with it: `count-in.test.ts` (the constant and its title), `capture-ritual.test.ts` (`PAUSE`, `FRY_AT` 6000, the header), the comments in `capture-ritual.svelte.ts` and `count-in.ts`, `screen-logic.test.ts` (the French pause text), and in `e2e/calibrate-new.test.ts` the header, the count-in comment, the hide-box label, the hidden sentence, and **the cancel times, now 500, 4500, 6150, and 8200 ms** so that each of the sung count, the pause, the wait for stable fry, and the sweep is still covered (the old 5150 would have landed in the pause).
6. **The pause line on a phone** (`VowelCapture.svelte`). The readout is drawn only when there is a reading to show and no notice to read, so during a take (and while a notice is on screen) the cue has the whole row; the row is a fixed 4.75 rem. Measured on the phone (390 by 844, scale 2): the row is **76 px in the idle, sung-count, and pause states in both languages, and the buttons' top is at 619 px in both idle and pause**. The English pause line takes two lines (48 px); the French takes three (71 px, scroll height 72) and fits. Pictures: `docs/sessions/report-code-n199-step7-pictures/phone-pause-en.png` and `phone-pause-fr.png`.
7. **Pins.** `voice/chart/ratified-strings.test.ts` (new): all 46 keys, both languages, as literals; the set of `capture.` and `sheet.` keys is exactly them; the pause line; `tv`; the copy rules over the new keys (no em dash, no "goal", "target", or "held", Canadian spelling) in both languages; French apostrophes and U+00A0 before every colon. `VowelCapture.test.ts` now asserts French as French (it asserted draft English in French before); `screen-logic.test.ts` checks every hint reads in French with nothing missing, and the copy rules over the live keys.

## Gates after this commit

| Gate | Baseline | After |
|---|---|---|
| phonology | 462 | 462 passed |
| dictionary | 248 | 248 passed |
| web-check | 0 errors, 12 warnings | 0 errors, 12 warnings (5 files) |
| web-test | 5252 passed, 1 skipped | **5589 passed, 1 skipped** |
| score-parser | 785 passed, 5 skipped | 785 passed, 5 skipped |
| blurb | 178 | 178 passed |
| integration | 155 | 155 passed |
| ratchets | OK | OK |

5586 before, 5589 after: **+3 net.** The brief required deleting `draft-strings.test.ts` (4 tests); I added `ratified-strings.test.ts` (6) and replaced the count-words test with two digit tests (+1), so the net is +3. This is the one place a test count went down in a file, by the brief's instruction. The existing i18n sweeps (`i18n.test.ts` including the OQLF table over every French value, `i18n-index.test.ts`, `approval/i18n-keys.test.ts`) pass with the new keys in.

**e2e** (`calibrate-new.test.ts`, 9 tests): the first run had **8 pass and the full tour fail after 5.0 minutes**, timing out at its first click, the Vite dev server's cold start; the tour alone then **passed in 2.0 minutes** (the count-in is a second longer a take, the tour barely moved). The whole file is 7.8 minutes when the tour is run cold, and about 5 when warm. The whole chromium project is run after 6b.

## Could not establish

- **That the French reads well on every screen.** The strings are ratified; I did not look at each French screen, only the pause picture and the unit tests that render the capture screen in French.
- **The English pause line and its `PAUSE_MS` in the wheel.** The wheel now says the longer line with a 3 s pause; I did not run the wheel.
- **Whether the French summary's own strings still say "Réessayer" for what the capture screen calls « Reprendre ».** The summary's button is the tree's `calib.common.retake` (« Réessayer »); the capture screen's button is the ratified `capture.retake` (« Reprendre {v} »). Two words for one act, in French. Not mine to change; noted for Dann.
- **The credit line** still reads the English interim text in both languages until 6b.

## Item 8: `FrSym` takes small capitals (its own commit)

`apps/web/src/lib/voice/FrSym.svelte` (the `.fr-sym sub` rule): `font-variant-caps: all-small-caps`, `font-size: 0.78em`, `letter-spacing: 0.02em`, upright (board D's values). The symbol is now italic f, small-capital R, and the subscript numeral (Dann 2026-11-12, entry 17, ruling 14). **`FrSym` is on the live roster, so this reaches every singer at the ship**, not only `?calibrate=new`: the roster's two column heads and the capture screen's readout and the sheet's table.

**Pictures, the roster before and after** (Drawer on desktop, 1440 by 900, scale 2): `docs/sessions/report-code-n199-step7-pictures/roster-header-before.png` and `roster-header-after.png` (the column heads), and `roster-before.png` and `roster-after.png` (the whole table). Before, the subscript reads "R1" in full capitals at 0.72 em; after, a small-capital R beside the numeral at 0.78 em.

**Is it true small capitals, or synthesized by the browser? NOT ESTABLISHED for the face that ships.** The app takes Source Sans 3 from Google Fonts (`src/app.html:49`), which this sandbox cannot reach, so the face was "unloaded" and the page rendered in the fallback. In the fallback, with synthesis switched off the width equalled plain capitals (106.61 against 106.61) and with synthesis allowed it was 74.63, a 0.7 scaling: the fallback has no small-capital glyphs and the browser synthesizes them. Whether Source Sans 3 as Google serves it carries true small capitals I could not test; if it does not, singers see the browser's scaled capitals, which are lighter and a little smaller than designed ones. Dann's walk, with the face loaded, settles it. If he wants to be sure, the face can be self-hosted (as Lato IPA is); that is not done.

Gates after this commit: see the table above's twin below.

| Gate | Baseline | After `FrSym` |
|---|---|---|
| phonology | 462 | 462 passed |
| dictionary | 248 | 248 passed |
| web-check | 0 errors, 12 warnings | 0 errors, 12 warnings (5 files) |
| web-test | 5252 passed, 1 skipped | 5589 passed, 1 skipped (no change from the words commit) |
| score-parser | 785 passed, 5 skipped | 785 passed, 5 skipped |
| blurb | 178 | 178 passed |
| integration | 155 | 155 passed |
| ratchets | OK | OK |
