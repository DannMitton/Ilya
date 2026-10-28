# Report: N.135 stage 2b (the page reader reads the words under the voice staff), r1

Code (Sonnet 5.5), cloud lane, 2026-10-27 to 2026-10-28. Branch `cloud-lane-19`, cut from `cloud-lane-16` at step 4's commit `641764c2`. Nothing under `docs/memory/`, no brief committed, no pull request, no git write but commit and push to this branch. The brief is r2 (Fable-reviewed); its file is not in the tree and is not committed.

## 1. The answer first

**The reader is built, wired, tested, and switched off.** With `?words=read` the page reader frames the rows under each voice staff, asks a tesseract.js Worker to read them, seats the words on the notes, and writes `<lyric>` into each page's MusicXML before the pages are joined. Without the switch the MusicXML is byte-identical to the one `641764c2` makes, and no underlay file is requested. **It has never read a word on a real page**, because no model file is in this clone: the recognizer half is built and unit-tested but its output on a real scan is NOT ESTABLISHED (section 5).

One sentence per question the stage asked:

- **Does the switch leave the app as it was? Yes, as far as this clone can show.** Same PDF (Sunless 1, two pages), switch off, `641764c2` against `cloud-lane-19`: the MusicXML and the Lyrics field are byte-identical (0 `<lyric>` tags, Lyrics 0 characters); no request names `/omr/models/underlay` or tesseract (`shot-after/*.requests.txt`: five matches for "underlay", all of them source modules the dev server serves, none a model, core, or worker file); the 1440 by 900 screenshots differ in 4 pixels, each by one level, at a rounded button corner (browser anti-aliasing; nothing outside `omr/` and the seams changed in the app).
- **Is the closing kernel right? It is now the odd number nearest a tenth of the staff space.** The first rule (largest odd not above) closed nothing on 90 of 234 harness systems. The nearest-odd rule gives 3 on 233 of 234 (commit `bea49e68`; `kernel-by-staff-space.txt`). Whether the desk wants it was a ruling; I built the one the closing-kernel note asked for.
- **Do the stage 2a review amendments 5 to 9 hold?** Built and mutation-tested; section 3.
- **Does the whole pipeline join up?** Yes on `tch-3.musicxml` with a fake `ReadUnderlay`, and a fake that throws leaves the score as it was (`underlay-integration.test.ts`, 12 tests).
- **Is the Worker half real? Partly.** In real Chromium the Worker framed 13 rows in 3.3 s and 16 rows in 2.8 s. It did not recognize a row: the model is absent.
- **Time per page.** homr: 193.1 s for 2 pages on wasm (no WebGPU adapter), about 96 s a page, in the switched-off run; this is the reader's existing cost. The words reader's added time is NOT ESTABLISHED.
- **Gates.** All green in this clone (section 3), except three e2e tests that fail identically on `641764c2`.

## 2. The tree

- **Branch and commits:** `cloud-lane-19`, from `641764c2`. Four commits: `bea49e68` (kernel, amendments 5 to 8 in frame and rows), `7ac82240` (the reader, behind the switch), `48340907` (failure lines, driver logging), `015032e7` (tesseract.js start failure says where it looked). The commit that carries this report is the head of the push. At the end `git status` was clean.
- **Not touched:** `docs/memory/`, the brief, its review. `+page.svelte`, `ScoreUploader.svelte`, and `pipeline.ts`: `git diff 641764c2 HEAD` on the three is empty. No ceiling raised. `ratchets` prints OK and lists three ceilings that could be lowered (`LearnContent.svelte` 4099 to 4086, `InsightsPane.svelte` 1351 to 760, `Loupe.svelte` 3013 to 3012); none is a file this stage touched, and I did not lower them.
- **Lines:** the longest source file this stage touched is `homr-reader.ts` at 470 (an edit); the longest underlay module is `underlay-frame.ts` at 429 (an edit). Every new file is under 1,000.
- **No new string, nothing visible to a singer.** The switch is read from the URL only; the failure line goes to the console (`[omr] underlay: ...`), not the interface.
- **Outside the tree:** `opencv-python-headless` 5.0.0 (step 3, oracle only); the homr models fetched by `fetch-omr-models.mjs` (203 MB, git-ignored `apps/web/static/omr`); Playwright's Chromium at `/opt/pw-browsers/chromium`.
- **Model files:** none committed, none copied into `static/` by a wired script. `apps/web/scripts/copy-underlay-model.mjs` exists and is **not** in `package.json`. Byte counts for the desk to pass to Dann: model `rus_prereform_r2_29000` 7,827,478; `tesseract-core-simd-lstm.wasm.js` 3,899,472; `worker.min.js` 111,307; **11,838,257 in all.** Wiring it is the desk's and Dann's call.

## 3. Each measurement

### Gates (eight, this clone, after the last commit)

| Gate | Result |
|---|---|
| `pnpm test:phonology` | 291 passed (291) |
| `pnpm test:dictionary` | 248 passed (248) |
| `svelte-check` (CI's command) | 0 errors, 12 warnings, 5 files with problems (baselines 0 and 12) |
| `pnpm --filter @ilya/web test` | 3376 passed (3376), 190 files; it was 3228 after step 4 |
| `pnpm --filter @ilya/score-parser test` | 775 passed, 5 skipped (780) |
| `pnpm test:blurb` | 145 passed (145) |
| `pnpm test:integration` | 55 passed (55) |
| `pnpm ratchets` | OK |
| `pnpm --filter @ilya/web build` | exit 0 |

The web suite's rise, +148, is in these files (test counts per file now; the two marked "edited" existed in 2a): `underlay-band` 17, `underlay-frame` 38 (edited), `underlay-integration` 12, `underlay-page` 15, `underlay-prepare` 8, `underlay-reader` 12, `underlay-recognize` 10, `underlay-rows` 24 (edited), `underlay-song` 8, `underlay-switch` 17, `underlay-tokens` 17, `underlay-units` 13, `underlay-seams` 13. I did not take a per-file count at the step 4 baseline, so I cannot split the +148 between new and edited files; NOT ESTABLISHED.

### E2E

Expectation (before): the suite passes as it did, since the switch is off. Likeliest failure: a test that counts requests or reads the scan flow.

Result: 96 passed, 1 skipped, **3 failed** (22.9 min, `chromium` project):

1. `insights-page.test.ts:95`, expected `true`, received `false`.
2. `print-pages.test.ts:20`, "markup: pages printed against sheets on screen", expected 2, received 3.
3. `singer-paths.test.ts:169`, expected "La diction lyrique russe pour chanteurs", received "La diction lyrique russe pour chanteuses et chanteurs".

I ran those three alone on a `git archive` of `641764c2` (own dev server): the same three fail with the same messages. They are not caused by this stage. The third looks like a copy change that the test has not caught up with; the first two I did not diagnose. I did not run the `phone` project.

### The closing kernel (and amendments 5 to 8)

Expectation: the nearest-odd rule closes every system the harness measured except the smallest. Likeliest failure: a system with a staff space under 30 stays at 1.

Result: kernel 3 on 233 of 234 systems (U5's 16.0 is the one at 1); the first rule gave 1 on 90 (`kernel-by-staff-space.txt`). Amendments 5 to 8 landed in `underlay-frame.ts` and `underlay-rows.ts` with tests (what I can name from the code: the skew sweep over ink pixels only, the scale cap from the ink height with `MIN_ROW`, and the paper grid at the staff space; I did not re-map each to its number from the brief here, so check the numbering against the brief); `mutants-frame.txt` (stage 2a folder, updated): 33 mutants, 29 killed, **3 known survivors** listed in the file, plus the one I removed as dead code.

### Mutation testing of the stage

Expectation: every mutant of a margin, a threshold, or the 2-space drop is killed. Likeliest failure: the margin tests agree under two mutants (1.5 to 1 above A and below B).

Result (`mutants-stage2b.txt`, from `mutate.py` and `spec-stage2b.json`): **75 killed, 0 survived.** The file is a composite of two runs: the first ran 76 mutants and was stopped when the runner hung on "no time out" (the loop has no end without its guard); I re-ran the 7 mutants whose tests I had added or strengthened. "No time out" is now killed by a test with a 1,000-poll limit. The hang also left a `/* mutant */` in `underlay-seams.ts` once, after an interrupted run; I restored it by hand and compared the file with git. Mutants named in the brief: margin under A 1.5 to 1 (killed by 7 of 15 band tests), margin over B 1.5 to 1 (5 of 15), the 20-space default, and the drop under 2 spaces (a band of exactly 2 is kept, one under it is dropped).

### The Worker half, in Chromium

Expectation: the Worker frames a page's rows and posts them back. Likeliest failure: tesseract.js cannot find its worker, core, or model.

Result: framing worked (13 rows 3.3 s; 16 rows 2.8 s). The likeliest failure happened and was diagnosed: with the model absent tesseract.js **rejects with `undefined`**, which told nothing. A direct browser probe showed a 404 on `worker.min.js`. Since then `describeError` and `startTesseract` name where the Worker looked, and the failure line reads "[omr] underlay: the page was not read (<stage> failed: <why>; the Worker had framed N rows in M ms)". With the model absent the reader degrades as designed: the page is read without words.

### The switched-off identity

Expectation: byte-identical MusicXML, no underlay request. Likeliest failure: the stamp changes the restore key.

Result: as in section 1. `scanStamp()` returns `READER_STAMP` when the switch is off, so a stored scan restores as before; with the switch on it returns `${READER_STAMP}+${UNDERLAY_READER}` (`underlay-switch.test.ts`, 17 tests, including that the two constants are separate).

My first "before" run failed twice with `locator.waitFor` timing out on `textarea.text-input`. The cause was my scratch copy of `641764c2`: its `node_modules` is a symlink outside Vite's file allow-list, so `entry.js` answered 403. I added the allow-list to the scratch copy's `vite.config.ts` (not in the repo) and it ran. Nothing in the repo caused this.

### Cross-site lines

- **Note-seat site.** `seatPage` seats on free notes through stage 2a's `seatTokens(..., 'monotone')`; the ordinal of a note counts every `<note>` of the first `<part>`, rests included, in `voiceNotes`. Tests in `underlay-prepare.test.ts` and the integration test on `tch-3`.
- **Syllable division against the engine cut.** The print's hyphens are not used where the engine cuts differently: `cutUnits(tokens, cut)` takes the engine's `syllabify` as `cut`. On the 16 harness songs: 1,349 words, 658 printed in two syllables or more, **the engine cuts 95 of them differently from the print (14.4%)**; 0 words printed whole that the engine would cut in two or more (`engine-cut.txt`, 89 different words; examples: print "ка-жет-ся", engine "ка-же-тся"; print "ко-гда", engine "ког-да"). This is why seating takes the engine's pieces and the lyric text is the engine's division.
- **Staff-space sites.** `lyricBand` and `systemsOf` take A's staff space from `staffIn` on homr's boxes; `frameRow` takes the staff space it is handed. These are the same function on the same boxes. I did not measure the two values on a real page, so that they agree on a real page is NOT ESTABLISHED.
- **Token split against the harness.** `splitTokens` against the harness's `tokens_of` on 22,488 words in 72 readings (`check-split.txt`): 267 differ. 230 are a letter outside the harness's letter set (`isalpha`, but not in its `split_internal`'s), which `splitTokens` counts as a letter; 37 are a space around the harness text, which `splitTokens` trims. The remaining differences are none. I read both as `splitTokens` being the more correct, not as a defect, but that is my reading; the desk may rule otherwise.
- **Stamp.** Covered above.

### What the pipeline does with a word it does not hold (the brief's open question)

Read at `apps/web/src/lib/pipeline.ts:225` (`isKnownWord`: `GraysonEngine.lookupStress(word) !== null`) and `:646-668`. A word with no stress data gets `stress = -2` and `stressSource = 'inferred'`: "All vowels render cardinal, no stress mark displayed. VERIFY badge shows via stressSource 'inferred'." A pre-reform spelling the engine cannot read also gets `-2` (an abstention, `:645-651`). I did not read the gloss path for a missed word in this stage; the brief says the gloss is `''` on a miss and I did not verify that. `rowLanguage` uses `isKnownWord` (through `isWord`, which tries the word as read and then its modern form, and the ё/е form) only to decide a row is Russian; it never feeds IPA.

## 4. Departures from the brief

1. **The kernel rule** (reversible, one constant and one function): the first commit built the brief's step 4 wording; `bea49e68` replaces it with nearest-odd as the closing-kernel note said.
2. **A failure line carries more than the brief asked** ("what failed and how far the Worker got"). Reversible; console only.
3. **`describeError` and `startTesseract` explain a missing worker, core, or model file.** Added after the `undefined` rejection above. Reversible.
4. **`measure.mjs` patches `window.File`** to capture the MusicXML the page makes, since there is no download. It is a driver, not app code.
5. **The mutants file is a composite of two runs**, said in its header.

## 5. What I could not establish

- **Any real reading of words.** No model file in this clone, so no row has been recognized. Whether `rus_prereform_r2_29000` loads on tesseract.js's core in Chrome (the brief's carried question) is NOT ESTABLISHED: I know only that the Worker starts, frames rows, and fails honestly when the model's 404.
- **Time per page for the words reader.** NOT ESTABLISHED. What I have is the Worker's framing time (13 rows 3.3 s; 16 rows 2.8 s) and homr's 96 s a page.
- **Which pages of each build song pass the per-song threshold with this reader.** NOT ESTABLISHED, for the same reason.
- **Whether `result.staves` is complete** on a page where homr misses a staff: NOT ESTABLISHED; I did not find a page that shows it.
- **Whether a tesseract.js `createWorker` nested in a Worker works** (I run it in the page thread, as the brief said): not measured.
- **Whether the two staff-space values agree on a real page:** NOT ESTABLISHED.
- **Why the three e2e tests fail on `641764c2`:** diagnosed for one (copy), not for the other two.
- **Pre-existing survivors:** three mutants in `underlay-frame.ts` survive (listed in `mutants-frame.txt`); I judged them equivalent or unobservable and did not prove it.
- **Dev-server only.** The switched-off proof ran on `vite dev`, not on the production build; the build passes, but I did not drive it.

## 6. The files

Source (all `apps/web/src/lib/` unless noted): `omr/underlay-band.ts`, `underlay-tokens.ts`, `underlay-units.ts`, `underlay-page.ts`, `underlay-prepare.ts`, `underlay-song.ts`, `underlay-reader.ts`, `underlay-recognize.ts`, `underlay.worker.ts`, `underlay-client.ts`, `underlay-switch.ts`, `underlay-seams.ts` (in `lib/`), each with its `.test.ts`. Edited: `omr/homr-reader.ts`, `restore.ts`, `scan.ts`, `underlay-frame.ts`, `underlay-rows.ts`, `underlay-language.ts`, and the two tests. `apps/web/scripts/copy-underlay-model.mjs` (unwired).

Measures, `docs/sessions/measure-n135-stage2b_2026-10-27/`: `measure.mjs` (flags `--pdfs --out --url --off --only --timeout-s --screenshot`), `mutate.py`, `spec-stage2b.json`, `mutants-stage2b.txt`, `check_split.py` and `.mjs` with `check-split.txt`, `engine_cut.py` and `.mjs` with `engine-cut.txt` and `engine-cut-all.txt`, `ts-register.mjs`, `ts-resolve.mjs`. In `docs/sessions/measure-n135-stage2a_2026-10-27/`: `kernel_by_staff_space.py` and `kernel-by-staff-space.txt`, `spec-frame.json`, `mutants-frame.txt`, `xcheck_frame.py`, `attrib_frame_harness.py`.

The before and after screenshots, MusicXML, and request logs are in my scratchpad, not in the tree; their comparison is quoted in section 1.
