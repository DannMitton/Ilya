# Report: N.135 stage 2b r5, step 5, the clitic match reads the modern spelling (Code, cloud lane, 2026-10-29, r1)

Branch `cloud-lane-21`, on top of step 4 (`1eb05e7d`). Read first, as the desk asked: the brief r2 and its last section, `CONTRACT.md` §0 and §0.1, the truth extract, the Opus review, the replay report, and the survey, all from `origin/Shane` (`94aa240b`) with `git show`. The clone was shallow; `git fetch --unshallow origin` made it whole. Shane was not merged into the lane and none of those files is committed to it.

## The answer first

1. **Built.** `cliticCalls` (`apps/web/src/lib/underlay-seams.ts:51`) takes `modern` as a third parameter, and a sewn word matches a transcribed word whose letters equal its own letters **or** the letters of `modern(word)` (where `modern` gives non-null). `loadSeams` passes `modernisePreReform` (`:69`). No «ъ» is stripped by hand.
2. **Stamp.** `UNDERLAY_READER` is `'underlay@2'` (`omr/stamp.ts:45`), the comment extended, per amendment 9. Step 7A is withdrawn as a behaviour, so step 5 is the last step that changes the reader's output; the stamp is set here. Test: a reading kept as `...+underlay@1` is read again once (`omr/underlay-switch.test.ts`).
3. **Not measured here:** the replay's 1,880 / 1,710 and vowelless 79. A2's captures and `real.mjs` are the desk's. Per amendment 8, a difference from 1,880 / 1,710 is a finding to report, not a failure to tune away.

## An environment finding the desk should know

Under vitest the dictionary is not loaded: `GraysonEngine.lookupStress('в')`, `('с')`, `('мир')` all give null (run, probe not committed). So `processText('въ мир')` keeps «въ» (`cleanWord` «въ», `isProclitic` false), because the pipeline adopts a modern form only where the dictionary knows it (`pipeline.ts`, `candidateIsKnown`). The desk's replay, with the build's dictionary, got `cleanWord` «в» and a proclitic call (replay report §3). My tests therefore stand a stub in for the loaded transcription (`loaded` in `underlay-seams.test.ts`: `cleanWord` the modern form, «в» and «с» proclitics), and say so in a comment. **I did not run the real transcription with a dictionary loaded**, so the real-pipeline half of step 5 rests on the desk's replay.

## Tests and mutants

`underlay-seams.test.ts`, "cliticCalls reads the modern spelling":
- «въ мир» and «съ нею» are called proclitic as «в мир» is; they fold as «в мир» and «с нею» fold (units `въ мир`, `съ нею`).
- Mutant, comparing raw letters (no `modern`): the same calls come back `[null, null]`; the test pins that, and the first test fails if `modern` is ignored.
- A transcription that kept the pre-reform spelling («въ», proclitic) also matches, by the word's own letters (amendment 8's reason for matching either spelling).

## Other spelling differences

The match now handles any word `modernisePreReform` converts. I could not probe others with the real pipeline (no dictionary under vitest). The replay found only final «ъ» in the six rows (K p1, p4; S p1; T p2, p3, p5). Not probed: ё, і, ѣ, ѳ, a trailing «ь» in a vowelless word. NOT ESTABLISHED whether any fails.

## Gates

1 291 passed (291). 2 248 passed (248). 3 found 0 errors and 12 warnings in 5 files (a first run showed 2 errors, a duplicate import in my test; fixed and re-run). **4 3640 passed | 1 skipped (3641).** 5 775 passed | 5 skipped (780). 6 145 passed (145). 7 55 passed (55). 8 ratchets: OK.

## NOT ESTABLISHED

The replay figures after this step; the real transcription's call on «въ» in this build (replay only); other spellings. 

## Files

`apps/web/src/lib/underlay-seams.ts`, `underlay-seams.test.ts`, `omr/stamp.ts`, `omr/underlay-switch.test.ts`, this report.
