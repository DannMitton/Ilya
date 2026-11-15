# Report, N.199 Step 6a: three fixes to what is built

2026-11-13, cloud lane, branch `cloud-lane-51`. Brief `brief-code-n199-steps-6b-7_r2_2026-11-13.md`, in its order: this step, then 7, then 6b.

## The merge

`origin/Shane` (`fc089b73`) merged into `cloud-lane-51` (merge commit `9a4d0fc`): no conflict. It carries the brief, its review, the finished drawings (`docs/sessions/n199-calibrate/drawings-r4/`), and `docs/memory/` with the ratified strings. Nothing outside `docs/` changed. Not merged to `Shane`.

Gates on the merged tree, before this step: phonology 462, dictionary 248, web-check 0 errors and 12 warnings, web-test **5586** passed and 1 skipped, score-parser 785 and 5 skipped, blurb 178, integration 155, ratchets OK. The web-test figure is Step 6's 5585 plus one: the zones test below was written while that run was in flight and was in it. The merge itself adds no test.

## What changed, with path:line

1. **Zones stay** (`apps/web/src/lib/voice/chart/zones.ts:105-106`). Every zone's fR2 centre is now `ground.fR2[vowel]`, the type's template with nothing sung. A personal zone no longer centres on the singer's own reading, so it does not move on a re-take of its own vowel. Its fR1 window still follows its anchors, because that is the guard's window. The header comment (`:12-17`, `:25-27`) now says so. `now` is still used, for the placeholder dots. Test (`zones.test.ts`, "a personal zone stays put when its own vowel is sung"): for six voice types, each of [ɨ ɪ a ʌ] sung four semitones off leaves its fR2 centre equal to its centre before and equal to its centre with nothing sung.
2. **The quick move out after a cancel or an error** (`voice/VowelCapture.svelte:157-165`). The rest effect now reads the phase inside `untrack`, so it re-runs only when `model.full` changes, and no longer ends the 400 ms move in the same flush. **Tested in the browser**, not by unit test (nothing mounts the component's effects without a DOM): the new e2e test measures the [i] zone's radius at rest, zoomed, 100 ms after a cancel, and 800 ms after. With the fix the 100 ms reading lies between rest and zoomed; **I put the old code back and the test failed** ("a snap would read the rest radius at once": expected over 63, received 60), then restored the fix.
3. **The hide toggle during a take** (`VowelCapture.svelte:354-358`). The checkbox is `disabled={running}`, so it is off from the tap until the landing ends, matching the record's visibility being fixed at the tap. Tested in the same e2e test (enabled before, disabled during, enabled after).

## The e2e file

`apps/web/e2e/calibrate-new.test.ts` is in CI (`playwright.config` `testDir` `./e2e`; `.github/workflows/ci.yml:134` runs the whole chromium project; I did not re-read that line this step, I am taking the brief's word). Run after this step: **9 passed in 4.6 minutes** (the eight of Step 6 and the new one). The whole chromium project is run once after Step 6b, as the brief says.

## Gates after 6a

| Gate | Baseline | After 6a |
|---|---|---|
| phonology | 462 | 462 passed |
| dictionary | 248 | 248 passed |
| web-check | 0 errors, 12 warnings | 0 errors, 12 warnings (5 files) |
| web-test | 5252 passed, 1 skipped | **5586 passed, 1 skipped** |
| score-parser | 785 passed, 5 skipped | 785 passed, 5 skipped |
| blurb | 178 | 178 passed |
| integration | 155 | 155 passed |
| ratchets | OK | OK |

## Could not establish

- **The unit-test count's split.** The one new vitest test is in both the "before" and "after" runs for the reason above, so 5586 is both. The step's only new unit test is the zones test; the other new test is Playwright.
- **That a personal zone's fR2 centre on the template is a good place for it.** Ruling 5 says zones stay; the centre is the type's template for the six Bozeman vowels and, for the four personal ones, the template's derived value. Whether a derived value on a stand-in anchor is a sensible neighbourhood centre is Dann's to see on the screen.
