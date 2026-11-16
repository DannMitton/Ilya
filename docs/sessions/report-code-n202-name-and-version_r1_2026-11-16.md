# Report, Code: N.202, Ilya's name and its version (Steps 0 to 3, and the close)

2026-11-16 (the run crossed midnight), lane `cloud-lane-58`, cut from `Shane` at `2c07ab75`. Brief `brief-code-n202-name-and-version_r2_2026-11-15.md`. Step 4 (the GUIDE's two entries) is NOT built: it waits for the desk's message with the ratified words. Pictures: `report-code-n202-pictures/`.

## The steps, by report

- **Step 0** (read and report, nothing changed): in `report-code-n202-step1_r1_2026-11-15.md`, first section. Baseline matched exactly on all eight gates. One difference from the task: the local `Shane` stood at `649fe49`; `origin/Shane` stood at `2c07ab7`, and the lane was cut from that.
- **Step 1** (the constant, the footer, the binder): `…-step1_r1_…`; commit `a4998fa`.
- **Step 2** (the sigil and the guard): `…-step2_r1_…`; commit `75697db`.
- **Step 3** (the citation file): `…-step3_r1_…`; commit `205c8a7`.

## Gate 4's count across the lane

| After | Gate 4 |
|---|---|
| Baseline, untouched tip | 5817 passed, 1 skipped (5818) |
| Step 1 | 5826 passed, 1 skipped (5827) |
| Step 2 | 5836 passed, 1 skipped (5837) |
| Step 3 | 5840 passed, 1 skipped (5841) |

The other seven gates were at baseline after every step: 462 (462); 248 (248); 0 errors and 12 warnings in 5 files; 842 passed, 5 skipped (847); 178 (178); 159 (159); ratchets OK. The lane's last code commit is Step 3; the close added only reports, so the Step 3 gate run is the final one.

## The close

- **Merge of `Shane`:** `origin/Shane` was re-fetched at the close and still stands at `2c07ab7`, which is already an ancestor of the lane. The merge is a no-op. Lanes 56 and 57 had not landed in `Shane`, so none of their changes are in this tree.
- **Playwright, desktop (`chromium`) and phone, the whole suite** (`--trace off`, Chromium 1243 at `/opt/pw-browsers/chromium`, against `pnpm dev`): 250 tests, **242 passed, 2 skipped, 6 failed** (53.0 minutes). The six:
  1. `e2e/calibrate-new.test.ts:392` fr at 375 px, "Re-take [i] on one line"
  2. `e2e/loupe-header.test.ts:47` "a drag on the desk moves the card, holds while open, and resets on close"
  3. `e2e-phone/input-views.test.ts:134` "a poem typed into Poem moves no seat"
  4. `e2e-phone/phrase-ends.test.ts:26` "Tchaikovsky onto an empty song: 172 seats"
  5. `e2e-phone/relining.test.ts:70` "a poem pasted into Poem lays Lyrics out in its lines"
  6. `e2e-phone/relining.test.ts:95` "a poem typed key by key lays Lyrics out after the pause"
- **These six fail the same way on the untouched tip.** I checked out `2c07ab7` (detached), ran the same six tests, and the same six failed (the English twin of test 1 passed on both). I then returned to `cloud-lane-58`. They are therefore not caused by this lane. Their causes are NOT ESTABLISHED: I read only that the assertions failed (for example `relining` expected line lengths `[7, 7, 7, 7, 7, 4]` and received a different split), and I did not diagnose them. The four e2e files the brief names for the sigil (`markup-pages-lose-no-bars`, `pages-without-gaps`, `print-pages`, `insights-page`) all passed, both in Step 2's focused run and in this full run.

## Things for the desk

- **Step 4 needs the ratified words and lanes 56 and 57 merged.** `OPEN.md` at this tip still lists two contents-list labels that Dann withdrew; I did not build from it.
- The long label of the first guide picture check, and the footer legibility in the other guide pictures, are in the Step 1 report as NOT ESTABLISHED.
- `cffconvert` could not be installed here (the session's permission check refused the attempt), so GitHub's "Cite this repository" acceptance of `CITATION.cff` is NOT ESTABLISHED. The file parses as YAML.
- The harness's `suggestedFilename()` returned `download` for the exported binder; not investigated.
- The first run of gate 4 failed one DSP test on a 5 s timeout while a dev server ran beside it (Step 1 report). Gates were run with the dev server stopped after that.
- The brief's pattern cannot see the footer string's source (` 2026a`); the guard sweeps the table by value for that reason (Step 2 report).
