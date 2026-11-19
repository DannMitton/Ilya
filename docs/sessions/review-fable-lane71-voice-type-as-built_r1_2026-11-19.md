# Review, lane 71 as built: voice-type stand-ins

VERDICT: MERGE WITH FIXES

Reviewed `cloud-lane-71` at `0ea7fd54` against `Shane` `6c0bb4fc`, in my own clone at `/home/claude/lane71`. Brief r4 (md5 `5ceb548a`), the ruling (md5 `8d3f8a4f`, section 8 first), and all eight step reports read in full. Paths are under `apps/web/src/lib/` unless they start elsewhere. "ran" marks a claim that rests on a run in a `/tmp` copy, since deleted. Nothing was written into the clone (`git status --short`: 0 lines) and no `.bak` exists.

The build tells a singer the truth about whose numbers they are reading at every site I rendered. Nothing below is a blocker. The six fixes are comments and test hygiene, each a few minutes.

## Fixes before merge

1. `i18n.ts:1896`: the comment still says `{voiceType}` in `insights.generic.lede` "is the label the identity line prints". For the three borrowing types it is now the staff (`voiceTypes.ts:136-141`). Stale, and it describes the exact rule this lane changed.
2. `components/Drawer/voice-pane.ts:3`: "the seven sentence states ... The eighth state". `typed-none` is gone from `PaneState` (`:33`), so the count is off by one. The lane's step 3 report lists this as unchecked; the test's title dropped its "seven" and the header kept it.
3. `voice/engine/resolve-values.test.ts:16`: `const FIVE` now holds eight ids. Rename it.
4. `stand-in-borrowing.test.ts:274`: the expected value in `toBe(' ')` is a literal U+00A0 (bytes `302 240`, read with `od -c`). It is invisible, and an editor that normalizes whitespace would turn the assertion into its opposite. Write `' '`, as `insights/ratified-lines.test.ts` does. At `:214`, `.replace(/\{v\}/g, '[ɑ]')` acts on a string with no `{v}`; remove it.
5. `insights/ratified-lines.test.ts:464`: the title says "the six sentences ratified 2026-11-19 10:08 keep their words". It pins two strings, English only, and their words date from 2026-11-10; 10:08 ratified the fill. Retitle.
6. `components/Drawer/voice-pane.test.ts:46` and `:49` assert the same thing twice (`castrato` is `none`). Drop one.

## Decide, then merge or queue

7. `voice/chart/screen-logic.ts:31`, `hasDeclaredType`: no non-test caller remains (grep of `apps/web/src`, non-test: its declaration and comments only). It is kept alive by `screen-logic.test.ts:49-50`. Dead export in a tree about to be audited. Remove it with its two assertions, or leave it with a reason.
8. The link "Why these values" / « Pourquoi ces valeurs » is ratified (ruling section 3) and is NOT on any page. The lane says so (step 4 report, section 4): `components/Paper/TitleHeader.svelte:202-203` renders a note as plain text. The disclosure itself is on the page, so I would ship without the link, and queue it. When it is built, `guide-markup-stand-ins` is missing from the parent list at `components/Drawer/Drawer.svelte:282`.

## 1. What a singer meets

ran: a throwaway vitest probe through the pages' own functions (both languages, nothing sampled, three core vowels, five core vowels), and a throwaway Playwright probe that loaded `sunless-01-engraved.musicxml` and read MELODY and INSIGHTS from the DOM for contralto (EN), mezzo-soprano (EN), countertenor (FR), tenor (FR), contralto with three core vowels (EN), and "Not sure" (EN).

| Voice, nothing sampled | Subtitle, lede, caption | VOICE pane | Borrowing line | Sheet note | Method |
|---|---|---|---|---|---|
| contralto | "a generic mezzo-soprano" | "for a mezzo-soprano voice" | names contralto and mezzo-soprano | "the mezzo-soprano staff" | "placeholder values" |
| countertenor (haute-contre stored) | "a generic mezzo and tenor" | "for a mezzo and tenor voice" | names countertenor and mezzo and tenor | "the mezzo and tenor staff" | "placeholder values" |
| bass-baritone | "a generic bass" | "for a bass voice" | names bass-baritone and bass | "the bass staff" | "placeholder values" |
| "Not sure", with or without Other's text | none; pages withhold | ratified 11:59 sentence | none | "the middle of Ilya’s five staves" | `noScore.none` |
| no type | none; pages withhold | `calib.pane.none` | none | undeclared form | `noScore.none` |
| unknown id (`castrato`, Other set) | none | `calib.pane.none` | none | undeclared form | `noScore.none` |

- No two sentences on one page disagree for any of the six cases. ran.
- The declared type's own name appears in no borrowed-value fill; it appears in the borrowing line and in the identity line ("INSIGHTS for Dann · contralto"), which names the singer and not the values (`insights/identity.ts:28`). ran.
- No `{` or `}` reached the DOM on any of the twelve pages rendered. ran.
- Other's text and a Tier 2 label do not reach a borrowing type's fill. ran.
- In the browser the vowel chart's caption reads "against where each vowel turns in a generic mezzo-soprano" for a contralto, through `singerBlocks` itself (`insights/singer-blocks.ts:337`). ran. The lane's own test 2 does not go through `singerBlocks`.

## 2. The amendment held

- `voice/engine/stand-ins.ts:80-89`: eight ids. `not-sure` is out; `hasPlaceholderProfile` (`:92-95`) is false for no type.
- Golden, ran (parsed both versions of `analysis/__golden__/adapter-snapshots.json`): 144 rows before and after, same keys. Three rows changed and only three: `contralto | none`, `countertenor | none`, `bass-baritone | none`. `not-sure` 12 rows, 0 changed; `(undefined)` 12, 0 changed; `''` 12, 0 changed. Each changed row equals its twin (`mezzo-soprano | none`, `tenor | none`, `bass | none`).
- The withdrawn "average" sentences are nowhere in `i18n.ts`: its only changed or added keys are the twelve the brief names. ran (base and tip parsed and compared).

## 3. `borrowedStaffLabel`

`voice/voiceTypes.ts:123-127`. Clause 1 at `:125`. Clause 2 at `:126`, `voiceTypePrint` on the id alone. Clauses 3 and 4 at `:124`, tested before `voiceTypePrint` is called, so Other's text under "Not sure" cannot reach it. ran: `undefined` for "Not sure" with Other set, for no type, and for `castrato`.

Sites branch on that `undefined`: `voice/chart/screen-logic.ts:66` (hint) and `:83-84` (sheet). No site reads `hasDeclaredType`.

One deviation, disclosed by the lane (step 2 report, section 3): 4.1, 4.2, and 4.3 fill through a new `placeholderFillLabel` (`voiceTypes.ts:136-141`), which uses the staff for the three and `voiceTypePrint` on the whole choice for the five. The brief's text said `borrowedStaffLabel` at those sites; its 9.6 said keep today's behaviour. See "For Dann's eye" 5.

## 4. The draw rule

`analysis/placeholder-line.ts:108-118`: `!isBorrowingType(voiceType) || isPersonal(formants)` returns null. Both halves present. ran: draws for a contralto with nothing sampled, with three core vowels, on MELODY and INSIGHTS with a score (browser), and on INSIGHTS with no score (`e2e/insights-no-score.test.ts`, 8 of 8 passed here). Does not draw for a tenor, a mezzo-soprano, a contralto with five stable core vowels, "Not sure", no type, or an unknown id. At five stable core vowels the bucket is `middle` (probe output), so the silence is correct.

## 5. The strings

ran: a script decoded `i18n.ts` at the tip and at the base and searched the brief and the ruling, whitespace-normalized with U+00A0 preserved.

- Whole strings found verbatim, EN and FR: the three Method strings, `calib.pane.notSure` (brief and ruling), `capture.hint.placed.typed`, `placeholder.borrowing`, the three staff labels.
- Clause swaps: `analysis.broad.body.generic`, `sheet.provenance`, and `sheet.provenance.undeclared` each equal the base string with only the brief's clause exchanged.
- No straight apostrophe in any of the twelve. Every French colon has U+00A0 before it.
- The Guide passage (`components/Reading/GuideContent.svelte:93` French, `:399` English), with `<em>` removed, is found verbatim in the ruling, whole, the middle-of-five-staves sentence included; its French colon has U+00A0.
- `calib.pane.typedNone` kept and marked unused (`i18n.ts:1433`). `placeholder.line.many` and its siblings untouched.

## 6. Tests

All sixteen groups exist (`stand-in-borrowing.test.ts`, 277 lines; two blocks in `insights/ratified-lines.test.ts`). Every repaired test I read is a faithful update, not a loosening. Four groups are weaker than the brief's words, and the lane's step 7 report says so for each:

- Test 7's "on MELODY" half is a regex over the pane's source (`stand-in-borrowing.test.ts:168-175`). No kept test renders MELODY, or INSIGHTS with a score, for a borrowing type. My browser probe did, once, and it is not in the tree.
- Test 13 reads pure functions, not a page (`:235-262`).
- Test 9 passes the id `bass`, never a stored choice with `octavist` (`:189-200`).
- Test 2's caption bypasses `singerBlocks` (`:55`).

I would queue one kept Playwright case: a contralto with a score, MELODY and INSIGHTS, both languages.

## 7. Comments

Every comment in brief section 2's list is repaired; I read each in the diff. Three stale ones remain: fixes 1, 2, and 3.

## Section 9 items: confirmed left alone

`voice/engine/plausibility.ts` is not in `git diff --stat`; `bucketFor` is untouched. Seen, as the brief predicted: a contralto with five stable core vowels still reads "from its mezzo-soprano values" in the hint (probe output), and a countertenor's page says "mezzo and tenor" beside union zones (`plausibility.ts:135-142`). One relative of 9.1 the brief does not name: the sheet's note says "scaled to the mezzo-soprano staff" for that same personal voice. Same cause, same standing before this lane.

## Gates

All ran, on a copy of the tip.

| Gate | Result |
|---|---|
| 1 phonology | 462 passed (462) |
| 2 dictionary | 248 passed (248) |
| 3 web-check | 0 errors and 12 warnings in 5 files |
| 4 web-test | 6727 passed, 1 skipped (6728), as the sum of two runs |
| 5 score-parser | 904 passed, 5 skipped (909) |
| 6 blurb | 178 passed (178) |
| 7 integration | 159 passed (159) |
| 8 ratchets | OK |

Gate 4, both halves: my sandbox has scipy, so it runs the Mac's form. The main run read "6689 passed | 1 skipped (6690)" with `score/ingestion/fixture-rule.test.ts` collecting 0 tests, because my copy had no `.git` when the run started. That is my artefact. Rerun alone with `.git` present: 38 passed. 6689 + 38 = 6727 passed, 1 skipped, which is the lane's predicted scipy figure and equals 6691 + 36. Against the lane's own Step 0 baseline (6687 passed, 5 skipped): its final 6723 passed, 5 skipped is +36 passed, +0 skipped, and I counted the same 36 added tests in the diff. The ship script's gate 4 strings need +36 on merge.

Ratchets: no ceiling moved (`scripts/` has no diff). No ratcheted file changed length; I compared all sixteen at base and tip. `markup/MarkupPane.svelte` 1349 of 1349 and `insights/InsightsPane.svelte` 677 of 677, before and after: each pane's change is inside an existing line. The nine "can be lowered" notices are identical at base and tip. The only difference in the tool's output is 904 to 905 source files.

Playwright: `e2e/voice-pane.test.ts` and `e2e/insights-no-score.test.ts`, 32 passed. `e2e-phone/insights-links.test.ts`, 5 passed in one run; the known flake at `:32` did not fire.

## NOT ESTABLISHED

1. Gate 4 in the no-scipy form on this tip. I did not rerun it; the lane's 6723 and 5 is its own figure.
2. Gate 4 as one clean run. Mine is a sum of two.
3. Whether a stored voice type can carry a padded or capitalized id. If it can, `hasPlaceholderProfile` (`stand-ins.ts:93`, trims and lower-cases) says yes while `isTier1` (`voiceTypes.ts:60-62`, exact match) says no: ran, `' Contralto'` gives placeholder values with "a map of Dann’s resonances" and no borrowing line. The radio control writes exact ids (`e2e/voice-pane.test.ts`); imports and old stores were not read.
4. Pagination on any score but the one I loaded. On it the sheet count was 2 with and without the line.
5. `e2e-phone/voice-stations.test.ts:62`, which the lane saw fail once. Not run here.
6. `knip` on `calib.pane.typedNone` and `hasDeclaredType`. Not run.
7. Print output. No PDF was made.
8. Whether the "Voice line as written" card in "For Dann's eye" 7 appears for a returning singer.

## For Dann's eye

1. A contralto taps "Contralto" in VOICE and reads "Ilya is using generic values for a mezzo-soprano voice until you record your own." The pane names the neighbour and gives no reason. The reason is on MELODY and INSIGHTS only. Of everything here, this is the one I expect a singer to take for a mis-tap.
2. "A generic mezzo and tenor", "for a mezzo and tenor voice", « une voix type de mezzo et ténor ». The staff label reads as one voice type in three ratified sentences.
3. A contralto with one to four core vowels sampled reads "A map of Dann’s resonances", "Calibrated 2026-11-10", and then "until you sample your own vowels in VOICE". She has sampled some. The below-core sentence beside it explains; the first three do not.
4. The header gains a paragraph: 45 px in English, 44 to 62 px in French, measured in the browser. A borrowing singer on INSIGHTS reads three paragraphs before the first finding, and the remedy twice, once as "the DRAWER on the left" and once as "VOICE".
5. A bass who chose octavist reads "placeholder values for a generic octavist" on MELODY and INSIGHTS, "a bass voice" in VOICE, and "the bass staff" on the sheet. Ilya has no octavist values. The lane kept this on purpose; `voiceTypes.ts:140` is the one line that changes it.
6. The Guide now says "If you have not named a type, Ilya starts from the middle of its five staves." A singer with no type and nothing sampled opens INSIGHTS and reads "Nothing is claimed about your voice". The sentence is true of the chart and of a partly sampled voice, and not of that page.
7. On MELODY's first arrival with my fixture, a "Voice line as written" card sat over the header and covered the start of the borrowing line. It is not this lane's, and it covers the placeholder line for a mezzo-soprano too.
8. "Not sure" with a score: MELODY's subtitle reads "a map of Dann’s resonances" above a page with no profile. Standing before this lane; the ruling's section 8 leaves it to the blank states.
