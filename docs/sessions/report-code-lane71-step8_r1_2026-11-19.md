# Report, lane 71, step 8: the as-built review's eight fixes

2026-11-19. Branch `cloud-lane-71`, on `0ea7fd54` (step 7) plus this step. Fable's as-built review: MERGE WITH FIXES, no blockers. Paths under `apps/web/src/lib/`. One commit.

## 1. The eight

1. `i18n.ts:1896`: the comment now says `{voiceType}` of `insights.generic.lede` is the label `placeholderFillLabel` gives, the staff the values came from for a contralto, countertenor, or bass-baritone (`voiceTypes.ts`), otherwise the label the identity line prints.
2. `components/Drawer/voice-pane.ts:3-4`: "the seven sentence states ... The eighth state" is now "the sentence states ... A further state". I wrote no number, so the comment cannot go stale on the count again.
3. `voice/engine/resolve-values.test.ts`: `FIVE` is renamed `EIGHT` at all six uses (`FIVE_CORE`, a different constant, is untouched).
4. `stand-in-borrowing.test.ts`: the expected value in the colon test is the escape `' '` (was a literal U+00A0, `:274`); the `.replace(/\{v\}/g, '[ɑ]')` on `sheet.provenance.undeclared` is removed (`:214`).
5. `insights/ratified-lines.test.ts:464`: retitled "the English words of the MELODY subtitle and the INSIGHTS lede (ratified 2026-11-10) are unchanged; 2026-11-19 10:08 ruled only their fill".
6. `components/Drawer/voice-pane.test.ts`: the `castrato` assertion inside the "typed, none is gone" test is dropped; the standalone "an id this build does not know reads as no type" test keeps it.
7. `voice/chart/screen-logic.ts`: `hasDeclaredType` and its doc comment removed; `screen-logic.test.ts` loses the import and its two assertions (`:49-50`). `grep -rn hasDeclaredType apps/web/src` now returns two comments only (`voice/voiceTypes.ts:121` and `voice/chart/screen-logic.ts:78`, which say "never on `hasDeclaredType`"); I left them, since you said to change nothing else, and they now name a function that does not exist.
8. The "Why these values" link: not built, as instructed.

**For the record:** when the link is built, `guide-markup-stand-ins` must also be added to the parent-chapter list in `components/Drawer/Drawer.svelte:282` (the array of Guide ids that returns `['guide-how']`, which I read in step 5), or the Drawer's contents highlight will not know which chapter the anchor sits under.

Not touched: `plausibility.ts`, `placeholder.line.many`, anything under `docs/memory/`.

## 2. The eight gates, against my Step 0 baseline

| Gate | Step 0 | Now |
| --- | --- | --- |
| 1 | `462 passed (462)` | `462 passed (462)` |
| 2 | `248 passed (248)` | `248 passed (248)` |
| 3 | `0 errors and 12 warnings in 5 files` | `0 errors and 12 warnings in 5 files` |
| 4 | `6687 passed \| 5 skipped (6692)` | `6723 passed \| 5 skipped (6728)` |
| 5 | `904 passed \| 5 skipped (909)` | `904 passed \| 5 skipped (909)` |
| 6 | `178 passed (178)` | `178 passed (178)` |
| 7 | `159 passed (159)` | `159 passed (159)` |
| 8 | `ratchets: OK.` | `ratchets: OK.` |

**Gate 4 did not move from 6723.** Fixes 6 and 7 removed assertions inside tests, not tests, so no test was removed or added. No ratchet moved; no baseline moved by me.

## NOT ESTABLISHED

1. That no Playwright test depends on anything changed here. Only unit-level files were touched, and Playwright was not re-run.
2. Whether `knip` flags anything now (`calib.pane.typedNone`, brief 9.5). None was run.
