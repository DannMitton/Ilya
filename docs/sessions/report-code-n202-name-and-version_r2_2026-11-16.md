# Report, Code: N.202, Ilya's name and its version (r2, all steps)

2026-11-16, lane `cloud-lane-58`. This replaces `report-code-n202-name-and-version_r1_2026-11-16.md`, which was written before Step 4 and says two things that are false at the tip: that Step 4 was not built, and that lanes 56 and 57 had not landed and the merge of `Shane` was a no-op. Both were true when r1 was written and both changed when the desk sent the ratified words and merged the lanes. r1 is left as it stands.

## The steps, by report

- Step 0 and Step 1: `report-code-n202-step1_r1_2026-11-15.md` (commit `a4998fa`).
- Step 2: `report-code-n202-step2_r1_2026-11-15.md` (`75697db`).
- Step 3: `report-code-n202-step3_r1_2026-11-15.md` (`205c8a7`).
- Step 4: `report-code-n202-step4_r1_2026-11-16.md` (`98d2d6a`, after the merge of `Shane` at `10034870`).
- The desk's follow-up (fix 2 of Fable's as-built review): the date is out of the title of `apps/web/src/lib/version.test.ts:10`, which now reads "is 2026b, a year and a lowercase letter". Fix 3 is left as built, as the desk ruled. Fix 1 is this report and the Step 4 report.

## The eight gates on the tip of this commit

Gate 4's baseline from the desk is 6352 passed, 1 skipped (6353). Tip counts:

| Gate | Result |
|---|---|
| 1 phonology | 462 passed (462) |
| 2 dictionary | 248 passed (248) |
| 3 svelte-check | found 0 errors and 12 warnings in 5 files |
| 4 web | **1 failed, 6351 passed, 1 skipped (6353)** in each of the last three runs; see below |
| 5 score-parser | 894 passed, 5 skipped (899) |
| 6 blurb | 178 passed (178) |
| 7 root integration | 159 passed (159) |
| 8 ratchets | ratchets: OK (`+page.svelte` 5512 of 5534; `Drawer.svelte` 1983 of 1990) |

**Gate 4, stated plainly.** The one failure each time is `voice/engine/open-extract.test.ts`, "gives the same reading whichever vowel is asked" (a 5000 ms timeout). The file passes when run alone, 9 of 9 in about 11 s, twice. The same file failed on the first Step 1 gate run and passed on the re-run; it passed in full on `Shane`'s tip (6313 passed, 1 skipped) and once on this lane at `98d2d6a` (6351 passed, 1 skipped (6352)); it then failed in my last three full runs on this lane, in two of which no dev server was running. The test spends about 5 s of work against its 5 s limit, which makes it sensitive to CPU load in this sandbox. I changed no file it touches; the one change since the last clean run is a test title. I did not diagnose why the last runs were slower. A clean gate 4 on a quieter machine is the check; I did not get one at this exact commit, so that count is NOT ESTABLISHED here.

## Playwright

- At the Step 3 tip: the whole suite, desktop and phone, 250 tests: 242 passed, 2 skipped, 6 failed (53 minutes). The same six fail on the untouched `2c07ab7` (checked by running them there), so they predate this lane: `e2e/calibrate-new.test.ts:392` (fr at 375 px), `e2e/loupe-header.test.ts:47`, `e2e-phone/input-views.test.ts:134`, `e2e-phone/phrase-ends.test.ts:26`, `e2e-phone/relining.test.ts:70` and `:95`. Their causes are NOT ESTABLISHED. The four e2e files that guard the sigil passed.
- At the Step 4 tip: I started the whole suite (274 tests after lane 57's additions), reached test 156, and stopped it when the desk asked for only the touched tests and the gates. It has no result. The Step 4 pictures were taken from the live app, and the tests that touch Step 4 are unit tests (all passing in the gate runs).

## Things for the desk, unchanged from r1

- Whether GitHub's "Cite this repository" accepts `CITATION.cff` is NOT ESTABLISHED (`cffconvert` could not be installed in this session).
- The binder's downloaded filename read `download` in my harness; not investigated.
- Fable's as-built review raises two further points that are outside this lane: the sentence "The footer of every page you print carries the same name" against GUIDE and LEARN pages that print no footer, and the GUIDE pictures that still show the old sigil.
