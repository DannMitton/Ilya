# Report: rhyme matcher, step 6 (close) and final report (Code, cloud lane 49, r1, 2026-11-12)

Branch `cloud-lane-49`, from `origin/Shane` at `dc078b9`. Nothing pushed to `Shane` or `main`; no pull request.

## Merge of `Shane`

`origin/Shane` is still `dc078b9`; it is an ancestor of this branch, so there was nothing to merge.

## The eight gates, step 0 against now

| gate | step 0 | now |
|---|---|---|
| phonology | 456 | 462 (+6, the literary block) |
| dictionary | 248 | 248 |
| web-check | 0 errors, 12 warnings, 5 files | same |
| web-test | 5190 passed, 1 skipped | 5252 passed, 1 skipped (+62: matcher 28, pipeline and set-aside 17, library pin 2, MELODY 4, marks, rows, reset and boxes 11) |
| score-parser | 785 passed, 5 skipped | same |
| blurb | 168 | 178 (+10) |
| integration | 155 | 155 |
| ratchets | OK | OK (`pipeline.ts` 896 of 901, `+page.svelte` 5528 of 5534, `InspectorPanel.svelte` 2396 of 2432, `engine.ts` 2048 of 2048) |

## Playwright

- **Run:** 76 specs across the Text, Inspector, poem, marks, hyphen, dictionary, and header files, plus the two new ones (chromium project, desk width, pre-installed Chromium): 73 passed, 3 failed. Both new rhyme tests and `word-marks-saved` pass.
- **The 3 failures are not from this lane.** `glue-typed-marks.test.ts:29` and `:39` and `singer-paths.test.ts:169` fail the same way on an untouched checkout of `dc078b9` (run in a separate worktree, since removed). Likely a Linux key-chord and heading issue; I did not diagnose them.
- **Not run:** the other 90 specs of the 166 (score, scan, print, Insights, and the phone project). A full run was started and stopped after one barline spec failed at 3 minutes (`barline-verb.test.ts:81`, score entry; not compared against a baseline). NOT ESTABLISHED for those.

## Strings added

- Stage note and R1, EN and FR, in `data/blurb-composer.json` as ratified 2026-11-11 22:53 and 22:54, both `standalone`, citations `pp. 301–303 + Avanesov 1989, p. 660` and `p. 302`; French colon ` ` (Fable amendment 3).
- `inspector.rhyme.stage`: "Stage reading" / « Prononciation scénique » (ruling 23:05); key coined here.
- `'Avanesov 1989'` on `OWED` in `sources.ts` (see below).

## The library pin's list

**Empty.** 327 entries, 7,345 lines, five line-final velar -ий words, none with a partner. One near miss declined for unknown stress: `2b82617c1a`, «Ночь печальна, как мечты мои…», «широкой» then «одинокий» (no stress in the dictionary). The desk should read that pair; if the stress is supplied, the pin fails and names it. Details in the step 3 report.

## For the desk and Dann

1. **Avanesov 1989 has no reference on file.** Named on `OWED`; the full record, and which Avanesov work p. 660 is, is owed. I could not establish it from the tree.
2. **A correction of mine:** the step 0 report said the Inspector showed "No phonological note" for a stage ‑кий ⟨и⟩. It drew the fallback «и → ɨ» with no citation (step 4 report).
3. **DESK DEFAULTs taken:** a `name` part of speech is not a partner («Волгой»; one line to change, `PARTNER_POS`); nearest partner is named; set-aside box drawn on every match, ticked or not (Fable amendment 4).
4. **Known limit kept (amendment 10):** where Poem has verse lines and Lyrics has none, Poem shows [kʌj] and MELODY, INSIGHTS, and Lyrics [kɨj].
5. **Ratchets:** `pipeline.ts` (901 to 896 ceiling untouched) and `+page.svelte` have headroom now; I did not lower the ceilings.
6. **Captures** for the desk: `docs/sessions/captures-rhyme-step5/` (390 px and desktop, EN and FR).
7. Not done by design: the GUIDE sentence (Fable's R3) belongs to the GUIDE rewrite.

## What I could not establish

- A real-song seat of the pair (tested on a score built in code).
- A downgrade to an older build (tested with an unknown kind).
- The 90 unrun Playwright specs and the phone project.
- The cause of the 3 baseline failures.
