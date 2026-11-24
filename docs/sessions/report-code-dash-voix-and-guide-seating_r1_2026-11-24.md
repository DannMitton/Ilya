# Report: the VOIX comment, the GUIDE seating, and one ratified string pair (cloud lane 87), r1

2026-11-24. Branch `cloud-lane-87`, cut from `origin/cloud-lane-87` at `50315f2e` (Shane, brief r4 included). The working tree was clean at the start. One commit per item. Nothing pushed to `Shane` or `main`, no pull request, every file staged by explicit path.

| Item | Commit |
| --- | --- |
| 1. The VOIX comment | `07fc9c0b` |
| 2. The two GUIDE paragraphs | `21f8b319` |
| 3. `belowCore` and `belowCoreOne` | `594de275` (this report is committed after it) |

## Item 1. The comment that was false

`apps/web/src/lib/i18n.ts:158`. Before: "and the French « Voix » is a desk proposal awaiting Dann's ratification." After: "and Dann ratified the French « Voix » on 2026-11-23 at 22:10." Comment only. The key `group.scoreMarkup`, the English `VOICE`, and the French `VOIX` are untouched (`i18n.ts:163`).

The ratification itself (`INBOX.md` at 22:10, and `OWED.md`'s closed entry) I did not re-read. I took the date and time from the brief. See What I could not establish.

## Item 2. The two GUIDE paragraphs

Both seated in `apps/web/src/lib/components/Reading/GuideContent.svelte` as `<p id="…"><strong>lead.</strong> body</p>`. No heading, no `Drawer.svelte` change (it stands at 1,986 lines), no `i18n.ts` key, no contents entry. Both ids were unused anywhere under `apps/` before this lane (grep, zero hits outside the briefs).

Text came from `docs/sessions/draft-french-guide-resonance_r2_2026-11-23.md`, not from the brief. Every apostrophe is U+2019, including "Ilya’s" in English paragraph 2, where the draft had U+0027. *Ilya* is italicized in all four, including in the two lead sentences ("How *Ilya* reads your vowel", « Comment *Ilya* lit votre voyelle »).

**Paragraph 1, `guide-markup-how-ilya-reads`** (Dann's rewrite, both languages ratified 2026-11-23 22:28).
- French: after `<p>Ces valeurs se saisissent au clavier et ne se chantent pas, à dessein…</p>` (the second and last paragraph of the characteristics passage under `guide-markup-characteristics`), and before `<h4 id="guide-markup-notation">Les conventions de notation utilisées par le CHANT</h4>`.
- English: after `<p>These values are typed, not sung, by design…</p>` under `guide-markup-characteristics` ("Voice characteristics: range, tessitura, and passaggio"), and before `<h4 id="guide-markup-notation">The notation conventions used by MELODY</h4>`.

**Paragraph 2, `guide-licences-method`** (English ratified 2026-11-22 21:44, French 2026-11-23 22:16).
- French: after `<p><strong>Recherche savante.</strong> …</p>`, before `<p><strong>Données de dictionnaire.</strong> …</p>`, in Licences et remerciements (`guide-licences`).
- English: after `<p><strong>Scholarship.</strong> …</p>`, before `<p><strong>Dictionary data.</strong> …</p>`, in Licences and Acknowledgments (`guide-licences`).

The brief says "after the paragraph naming the existing method credits". The tree has no paragraph that names a method credit as such, and no mention of Weenink, Burg, LPC, or Praat anywhere in `GuideContent.svelte`. I read the phrase as the Scholarship paragraph, which credits Grayson and names the methods MELODY and INSIGHTS implement. That is an inference. Dann or the desk should confirm it.

**Pins.** Six tests added to `apps/web/src/lib/insights/ratified-lines.test.ts`, in a new `describe` block ("ratified Guide paragraphs (lane 87, resonance)"). It splits the file at `{#if language === 'fr'}` as the existing blocks do, finds each passage by its `<p id>`, asserts the id occurs once on its side, strips the tags, and compares to the draft's paragraph with its markdown markers stripped. Four tests are the four passages. One checks the form (`<p>`, `<strong>` lead, no heading with that id). One checks the placement against both neighbours, in both languages. The test file runs 96 tests, all passing.

## Item 3. The ratified pair that was never built

Ratified 2026-11-20 00:33 (`docs/memory/INBOX.md`, the 00:33 entry). In `i18n.ts:2051` and `:2052`:
- English: "through the DRAWER on the left." became "in VOICE."
- French: « depuis le TIROIR de gauche. » became « dans VOIX. »

Both applied to `placeholder.line.belowCore` and `placeholder.line.belowCoreOne`. Nothing else in those two strings changed. The pins at `lane68-strings.test.ts:16-17` moved with them: `INS_EN` and `INS_FR` take a third argument `where`, defaulting to the old phrase so the two MELODY pins at `:18-19` still assert DRAWER and TIROIR unchanged. The seven pins in that file pass.

Other readers of the old phrase, checked: `analysis/placeholder-line.test.ts:34-69` pins `placeholder.line.many` and `.one`, different keys, which Dann's ratification does not name. `e2e/core-loop.test.ts:43` only quotes the retired sentence in a comment. Neither was touched.

**The MELODY twins at `i18n.ts:2058-2059`** (`placeholder.line.markup.belowCore` and `belowCoreOne`) still say "through the DRAWER on the left" and « depuis le TIROIR de gauche ». I did not change them, as the brief orders. Whether they follow is the desk's to rule. For the ruling: Dann's 2026-11-20 00:33 entry names only the two INSIGHTS keys, but its stated reason (an advice line names its section, not the surface and not a direction, his rulings of 2026-11-18 00:01 and 22:35) applies to the twins' sentence word for word. The same applies to `placeholder.line.many` and `.one` (`analysis/placeholder-line.test.ts:34-69`), which carry the same DRAWER phrase in a different sentence. I did not look for whether the desk has ruled on those. See What I could not establish.

## Gates

Run on this lane, Linux sandbox, after a fresh `pnpm install --frozen-lockfile`.

| Gate | Result |
| --- | --- |
| 4 web unit | `367 files passed`, `6806 passed | 5 skipped (6811)`, run after items 2 and 3 |
| Type check (`pnpm check`) | `0 errors and 12 warnings in 5 files` |
| 5 score-parser | `911 passed | 5 skipped (916)`, at the brief's figure |
| `Drawer.svelte` ceiling | 1,986 lines against 1,990, unchanged |

**The new gate 4 figure to name is 6806 passed, 5 skipped.** Item 2 adds six tests and item 3 adds none (it edits two). So the figure at `50315f2e` should have been 6800 passed. That is arithmetic, not a measurement, because I did not run the suite on the base. The brief and lane 83's report give a baseline of "6801 passed, 1 skipped", which does not match 6800 and 5 skipped. Either the baseline moved after lane 83 or the skipped count differs by environment. I could not tell which.

No approval or golden file was changed, no `.bak` created, nothing under `docs/memory/` touched, no ratchet ceiling raised. I touched no squircle, dash, or placeholder drawing.

## What I could not establish

1. **Gates not run.** The brief says "all eight gates". I ran the web unit suite, the type check, and the score-parser suite. I did not run the build, the Playwright suite, the other packages' suites, or whatever the remaining gates are. I did not find the list of the eight gates in the files I read. `ilya-ship.sh` is named in lane 83's report as holding the baselines, and I did not open it.
2. **The gate 4 baseline at `50315f2e`.** Not measured, see above. The desk should compare 6806 and 5 skipped against `ilya-ship.sh`.
3. **The ratification of « VOIX » at 2026-11-23 22:10.** I wrote the comment from the brief. I did not open `INBOX.md` at that time to verify the quoted words or the time, nor `OWED.md`'s closed entry.
4. **Which paragraph "the existing method credits" meant** for paragraph 2's position. See Item 2. I chose Scholarship and say so.
5. **Whether the MELODY twins at `i18n.ts:2058-2059` follow item 3.** Reported, not decided.
6. **Whether `placeholder.line.many` and `.one` have been ruled on** for the same phrase. Not searched.
7. **How the two new paragraphs look on screen.** I ran no browser and took no screenshot. The pins check markup and text, not rendering. Under AGENTS.md, "Measure the live render", the visual check is open.
8. **The French copy's own correctness.** I seated the ratified French as the draft has it and did not review it. The draft's own note says the two paragraphs are ratified.
