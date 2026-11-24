# Report: MELODY's two legend lines, and « conduit vocal »

r1, 2026-11-24 (the brief is dated 2026-11-23), by the cloud lane. Brief carried out: `brief-code-melody-wording_r4_2026-11-23.md`, md5 `c7976f79751ceb0f969908977b06433a`, read in full. Branch `cloud-lane-85`, cut from `dd67be0` (a clean tree, `Shane`'s `ac06d520` plus the brief). One commit. No pull request. Nothing written under `docs/memory/`. No `.bak` file created.

## 1. The section 3 sweep, run before any change

Command: recursive grep over `apps`, `packages`, and `tests`, excluding `node_modules`, `.svelte-kit`, `build`, and `dist`. Line numbers below are from the tree **before** my edits. `tests/` holds no hits for any of the three.

### "from your voice": 7 lines

| file:line | what it is | in the brief's scope |
|---|---|---|
| `apps/web/src/lib/melody/legend.ts:67` | doc comment above `MARKUP_TURN_COPY` | yes, section 3 |
| `apps/web/src/lib/melody/legend.ts:75` | the English filled entry | yes, section 2a |
| `apps/web/src/lib/melody/legend.ts:108` | shorthand in `buildMarkupLegend`'s doc comment | yes, section 3 |
| `apps/web/src/lib/melody/legend.test.ts:105` | test title | yes, section 3 |
| `apps/web/src/lib/melody/legend.test.ts:115` | assertion on both English strings | yes, section 3 |
| `apps/web/src/lib/i18n.ts:2622` | a comment quoting an old string, "from your voice type", about the `capture.hint.placed` keys | **no**, a different phrase, left alone |
| `apps/web/e2e/insights-no-score.test.ts:38` | the INSIGHTS method line, "computes from your voice" | **no**, a different string on a different page, left alone |

### « d’après » (typographic or straight apostrophe, or the `\u2019` escape): 16 lines

| file:line | in the brief's scope |
|---|---|
| `apps/web/src/lib/melody/legend.ts:68` (comment, straight apostrophe) | yes, section 3 |
| `apps/web/src/lib/melody/legend.ts:76` (escape) | yes |
| `apps/web/src/lib/melody/legend.ts:80` (escape) | yes |
| `apps/web/src/lib/melody/legend.test.ts:116` (literal U+2019) | yes |
| `apps/web/src/lib/voice/chart/ratified-strings.test.ts:73`, `:74`, `:88` | no, other strings |
| `apps/web/src/lib/voice/chart/drawings.test.ts:114` | no |
| `apps/web/src/lib/tempo/tempo.test.ts:81`, `:212` | no |
| `apps/web/src/lib/i18n.ts:2073`, `:2623`, `:2624`, `:2640` | no |
| `apps/web/src/lib/stand-in-borrowing.test.ts:196` | no |
| `apps/web/e2e/tempo.test.ts:169` | no |

Twelve of the sixteen are other ratified strings and are untouched. The brief's greps reach only the four `legend` lines.

### "tractus": 3 lines (case-insensitive)

- `apps/web/src/lib/components/Reading/GuideContent.svelte:53`
- `apps/web/src/lib/components/Reading/GuideContent.svelte:93`
- `apps/web/src/lib/insights/ratified-lines.test.ts:472`

Exactly the three sites of section 2b. After the edits the grep returns nothing in `apps`, `packages`, or `tests`.

## 2. Every changed string, before and after

Nothing but the words below changed in any string.

### MELODY legend, `apps/web/src/lib/melody/legend.ts` (`MARKUP_TURN_COPY`)

| entry | language | before | after |
|---|---|---|---|
| filled | en | `= the pitch where this vowel turns, from your voice` | `= your pitch of turning for this vowel` |
| filled | fr | `= la hauteur où cette voyelle change de timbre, d’après votre voix` | `= votre hauteur de changement de timbre pour cette voyelle` |
| hollow | en | `= the same, from a placeholder value` | `= the same, but using a placeholder value` |
| hollow | fr | `= la même, d’après une valeur par défaut` | `= la même, mais à partir d’une valeur par défaut` |

Source of the English: Dann, 2026-11-22 12:45. Source of the French: Dann, 2026-11-22 14:52, as the brief transcribes it. I did not independently check those rulings against `docs/memory/`; the brief cites them and I took them from the brief.

### GUIDE, `apps/web/src/lib/components/Reading/GuideContent.svelte`

| line | language | before (the changed words) | after |
|---|---|---|---|
| 53 | fr | « des instructions chorégraphiques pour le **tractus** vocal » | « des instructions chorégraphiques pour le **conduit** vocal » |
| 93 | fr | « car la résonance suit la longueur du **tractus** vocal plutôt que l’étendue chantée » | « car la résonance suit la longueur du **conduit** vocal plutôt que l’étendue chantée » |

No English changes: the GUIDE strings in question are French only. A word-level diff of both files shows exactly one removed word and one added word per sentence (`tractus` to `conduit`). The agreement stands, as the brief says.

### Pin, `apps/web/src/lib/insights/ratified-lines.test.ts:472`

The `FR` constant, the same sentence as `GuideContent.svelte:93`: `tractus` to `conduit`, in the same commit (`CONTRACT.md` section 1 item 11a, per the brief). I did not open `CONTRACT.md` or `OPEN.md`; I rely on the brief's citation of both.

## 3. Pins and comments

### `legend.test.ts`

| line | before | after |
|---|---|---|
| 105 | title: `...with no filled head on the page the "from your voice" entry is left out; the default keeps it` | title: `...with no filled head on the page the "your pitch of turning for this vowel" entry is left out; the default keeps it` |
| 113 | title: `says what Dann ratified at 20:01, in both languages, the apostrophes typographic` | title: `says what Dann ruled at 12:45 and 14:52 on 2026-11-22, in both languages, the apostrophes typographic` |
| 115 | the old English pair | `['= your pitch of turning for this vowel', '= the same, but using a placeholder value']` |
| 116 | the old French pair | `['= votre hauteur de changement de timbre pour cette voyelle', '= la même, mais à partir d’une valeur par défaut']`, literal U+2019 |

### `legend.ts` comments

- The doc comment above `MARKUP_TURN_COPY` (was `:65-68`, now three lines). Before: cited the 2026-10-11 20:01 ratification, explained "from your voice" over "from your sample", and described the straight apostrophes in « d'après ». After: cites Dann's 2026-11-22 12:45 (English) and 14:52 (French) rulings and says the apostrophe in « d’une » is written as a Unicode escape for U+2019 with the accented letters literal. The sentence "each is drawn with its head, in lavender, before the words" is kept.
- `buildMarkupLegend`'s doc comment (was `:108`): `("from your voice")` is now `("your pitch of turning for this vowel")`.
- I dropped the old comment's pointer to the `OPEN.md` heading "PLACEHOLDER TURNING NOTES ARE HOLLOW" and to « n’est » below. The first belongs to the superseded ratification. The second compared the escape to « n’est », but « n’est » in `MARKUP_WITHHELD_COPY` is a literal U+2019, not an escape, so that comparison would have been false.

## 4. Where the brief and the tree disagree, and what I decided

**The `:80` apostrophe.** Section 2a says the file writes the apostrophe as an escape ("exactly as the line is written today") and then prints the target line with a literal `’`. The tree today is `d\u2019après`, an escape. I followed the stated rule and the file's existing practice: `'= la même, mais à partir d\u2019une valeur par défaut'`. The rendered string is identical either way (U+2019), and `legend.test.ts:116` pins it with the literal character, so the test would catch a straight apostrophe. If Dann wants the literal character in `legend.ts`, it is a one-character change.

## 5. Gates

`~/Downloads/ilya-ship.sh` is not in this container, so I ran each gate from the repository's own scripts on a fresh `pnpm install --frozen-lockfile`, with my edits in the working tree. Whether those commands equal the script's is **NOT ESTABLISHED**. The gate names follow the lane 83 report's table.

| Gate | Command | Result | Baseline |
|---|---|---|---|
| 1 phonology | `pnpm --filter @ilya/phonology test` | 462 passed | 462 |
| 2 dictionary | `pnpm --filter @ilya/dictionary test` | 248 passed | 248 |
| 3 web check | `pnpm --filter @ilya/web check` | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files |
| 4 web test | `pnpm --filter @ilya/web test` | **6800 passed, 5 skipped (6805)** | `:185`'s no-numpy figure, 6800 passed, 5 skipped (6805) |
| 5 score-parser | `pnpm --filter @ilya/score-parser test` | 911 passed, 5 skipped (916) | 911 passed, 5 skipped (916) |
| 6 blurb | `pnpm --filter @ilya/blurb test` | 178 passed | 178 |
| 7 integration | `pnpm test:integration` | 159 passed | 159 |
| 8 ratchets | `pnpm ratchets` | OK | OK |

- Gate 4 is the **numpy and scipy not installed** variant: `python3 -c "import numpy, scipy"` fails here on scipy. The total, 6805, did not move. No test was added or removed. The only count the brief sets a ceiling on is that total, and it holds.
- Gate 8 printed a list of ceilings that could be lowered, in files I did not touch (`Drawer.svelte`, `InspectorPanel.svelte`, `LearnContent.svelte`, `pipeline.ts`, `ScoreUploader.svelte`, `pairings.ts`, `CalibrationWizard.svelte`, `musicxml-parser.ts`). It exits OK. I did not lower any ceiling.
- I did not run the Playwright suites, including the two phone tests the brief names as known failures. They are not among the eight gates.

## 6. Section 6: no computation moved

No number Ilya computes changed. `CONTRACT.md` section 4 does not apply. I found nothing to the contrary.

## 7. NOT ESTABLISHED, and what the sweep did establish

- **Forms the section 3 greps would miss.** I also searched the whole repository outside `docs/` for the English fragments `where this vowel turns` and `from a placeholder value`, the French `la même, d`, `d’après votre voix`, `d’après une valeur par défaut`, and `change de timbre, d`, and for `tractus`, the `\u2019` escape, and the HTML entities `&rsquo;` and `&#8217;` beside « d'apr ». Every hit is a line already listed above. I found none outside `legend.ts`, `legend.test.ts`, and the `GuideContent.svelte` and `ratified-lines.test.ts` sites. That rules out the forms I searched for. It does not rule out a string assembled from fragments at run time, which a grep cannot see.
- **Snapshots, fixtures, generated artefacts.** No `*.snap`, `__snapshots__`, or `*.golden*` file exists under `apps`, `packages`, or `tests`. I did not inspect build output (`.svelte-kit`, `build`, `dist`), and none exists in this fresh clone. A generated artefact in the maintainer's own tree is NOT ESTABLISHED.
- **`tractus` beyond the three sites.** None in `apps`, `packages`, or `tests`. It does appear in 12 files under `docs/`: `docs/memory/` (`QUEUE.md`, `STATE.md`, `DANN.md`, `OPEN.md`, `STATE-archive.md`) and `docs/sessions/` (the brief's r2, r3, and r4, `draft-french-guide-resonance_r1_2026-11-22.md`, `ratified-voice-type-stand-ins_2026-11-19.md`, `memo-open-work-decisions_r1_2026-10-14.md`, `draft-sing-first-cue_r1_2026-09-30.md`). I checked file names only and did not read those hits, and I did not edit any of them: they are outside the brief's lane and the brief forbids writing under `docs/memory/`. Whether any is a stray in a document that should say « conduit » is NOT ESTABLISHED.
- **The two rulings (12:45 and 14:52) and the « conduit vocal » ruling** are taken from the brief's own account. I did not read `docs/memory/INBOX.md`, `OPEN.md`, or `CONTRACT.md` to confirm them.
- **MELODY on screen.** I did not run the app or look at the legend. The change is verified by the unit test that pins `buildMarkupLegend`'s output and by the gates, not by a rendered page.

## 8. Not touched, per section 4

`i18n.ts`'s `placeholder.line.markup.*` keys, `analysis/placeholder-line.ts` and its test, `lane68-strings.test.ts`, `packages/score-parser/src/placeholder-mark.ts`, and `melody/MarkupPane.svelte`. No identifier, key, file name, selector, or stored value was renamed; `MARKUP_TURN_COPY`, `MARKUP_TURN_FILLED_TYPE`, and `MARKUP_TURN_HOLLOW_TYPE` keep their names. Fourteen other lines the sweep found (`i18n.ts:2622`, `insights-no-score.test.ts:38`, and the twelve other « d’après » lines) are different text and stay as they are.

## 9. Files in the commit

- `apps/web/src/lib/melody/legend.ts` (modified)
- `apps/web/src/lib/melody/legend.test.ts` (modified)
- `apps/web/src/lib/components/Reading/GuideContent.svelte` (modified)
- `apps/web/src/lib/insights/ratified-lines.test.ts` (modified)
- `docs/sessions/report-code-melody-wording_r1_2026-11-23.md` (new, this report)
