# Report: N.204 step 1, the behaviour baseline (cloud lane `cloud-lane-86`)

Written by Code (Sonnet) on `cloud-lane-86`, from base `93edb360d397265bcea7dde693dbda81643351ac` (documents only; no code under `apps/`, `packages/`, or `scripts/` differs from `b2869772`, checked with `git diff --stat b2869772..93edb360 -- apps packages scripts`, which printed nothing). Working tree clean at the start (`git status --short` empty). Brief: `brief r2`, pasted in the prompt (not committed). Everything below was run in this session's container (Linux x86_64, node 22.23.5, pnpm 10.28.0).

Sections are added one per commit. This is the report as of the commit that carries it.

## 1. Step 0b: what Ilya already photographs, and the gap

**What I searched** (the grep this brief owes): `git ls-files` filtered for `__approved__`, `__golden__`, `__snapshots__`, `baseline*.json`, and `golden`; `grep` of `apps` and `packages` for `toMatchSnapshot`, `toMatchFileSnapshot`, and `toMatchInlineSnapshot` (five approval test files use `toMatchFileSnapshot` against the stored files in the table: `ipa-corpus`, `staff-renderer-real-fixture`, and the three in `packages/score-parser/src/approval/`; no test uses `toMatchSnapshot` or `toMatchInlineSnapshot`; I corrected this sentence after the first commit, which had said the grep matched only the word); and a read of each file below. **What it returned** is the table. Two further golden folders turned up that the brief did not name: `third_party/homr-web/src/golden/` (the reader's own tolerance tests) and `tools/n200-score/__golden__/` (two JSON files and a runner). I **named them and did not read them**; they concern the reader and the score tool, and none maps to a family below.

| What exists | How it captures | Family it covers | What it does not reach |
|---|---|---|---|
| `apps/web/src/lib/approval/__approved__/ipa-corpus.txt` (94 lines; line 1 is the loaded dictionary's entry count, 943,106) | `ipa-corpus.approval.test.ts`: reads the real dictionary shards from disk, runs `processText` on 40 lines from six public-domain poems, compares byte for byte. Re-approved with `vitest -u`. | **2 (TEXT), in part.** | The poem library's 7,349 non-blank lines in 327 poems (`data/dictionary.poems.83fa37e8.json`); anything but this one dictionary load. It is a test, so it records nothing outside `pnpm test`. |
| `apps/web/src/lib/approval/__approved__/sunless-01-engraved.primitive.svg` (98,818 bytes) | `staff-renderer-real-fixture.approval.test.ts`: `renderAnalyzedStaff` on one real fixture, with a vowel resolver read off the fixture's own verse 2 (the test's header says so), one `generatedAt` fixed. | **1 (MELODY), in part.** | It is the staff renderer's output for one fixture, **not the paginated pages MELODY draws** (`paginateMelody`), and it uses no voice and one language. 217 other fixtures are not covered. |
| `packages/score-parser/src/approval/__approved__/` (11 files: two `parsed-score.json`, two `warnings.json`, six `renderDemo*.svg` for the primitive and the SMuFL path) | `mnx-parser`, `musicxml-parser`, and `staff-renderer` approval tests; syllable ids normalised (each test's header says so). | **1, in part, and none of the ten.** The parser's output and the demo staff. | The ten families do not name a parser. This is a parser and renderer pin, not a page photograph. |
| `apps/web/src/lib/analysis/__golden__/adapter-snapshots.json` (144 entries), with `adapter-golden.test.ts` | Every voice type against twelve sets of sung readings, passed through `buildVoiceProfileSnapshot`; compared to the stored JSON. `UPDATE_ADAPTER_GOLDEN=1` rewrites it. | **3 (INSIGHTS), only its input**: the voice profile snapshot that INSIGHTS reads. | No figure, no comment, no language. It pins a function that feeds INSIGHTS and not what INSIGHTS draws. |
| `apps/web/src/lib/analysis/stand-ins-snapshot.test.ts` | Assertions only; **no stored file**. | None. | Not a capture. |
| `apps/web/src/lib/melody/strophic-byte-baseline.json` (29,726 bytes, **208 entries**), with `strophic-byte-baseline.test.ts` | One sha256 per tracked `.musicxml` of `paginateMelody`'s pages joined by NUL, at 624 x 727 points, English, no voice. Written once with `UPDATE_STROPHIC_BASELINE=1`. The test lists ten fixtures the baseline does not hold (`FIXTURES_ADDED_BY_THE_LANE`). | **1 (MELODY), in part: the hash of exactly the pages family 1 needs.** | **It holds a hash and no SVG**, so a failure says that a page changed and not which element. French is not covered. |
| `apps/web/src/lib/approval/i18n-keys.test.ts` | Checks that every literal key passed to `t()` exists in both languages. | **6, no.** | It stores no table and no hash. A changed string passes it. |
| `apps/web/src/lib/approval/invariants.test.ts` | Checks the approved corpus stays inside Grayson's IPA inventory. | None. | An invariant, not a photograph. |
| 30 tracked `.svg` files: 7 under the two approval folders, 10 under `apps/web/src/lib/voice/chart/sagittal`, 11 under `docs/sessions/n199-calibrate/drawings-r4`, 2 elsewhere under `docs/sessions` | Not examined for a test. | NOT ESTABLISHED. | I did not check whether a test reads the ten sagittal files. |

**Not covered by anything I found:** **3** (INSIGHTS figures and comments, English and French), **4** (printed pages), **5** (an exported `.ilya` binder, the saved voice), **7** (the build's file list), **8** (the precache list), **9** (`static/` bytes), and **10** (no test run is recorded anywhere; the suite is run and its pass count read).

**Which is better, extending these mechanisms or capturing beside them: capture beside, and I did.** The mechanisms are tests that compare against files the author re-approves with `-u`, so they are built to move when the code moves and to be moved by hand. A baseline that must stay put while many lanes change code is the opposite job. Extending them would also mean editing committed approval files or their tests under `apps/web/src/`, which the brief forbids ("a behaviour change and this lane stops"), and this lane must change nothing under `apps/`. **Capturing beside costs nothing already pinned:** I read the committed files and compared against them, never wrote them (families 1 and 2 report agreement below), and the harness stores the **full SVG** where the strophic baseline stores a hash. The desk decides, as the brief asks. **I did not stop to ask, because the brief gives this lane no way to ask mid-run and capturing beside changes no committed file; if the desk prefers extension, nothing here needs undoing.** A single follow-up would fold the ten approval-test files and the strophic hashes into one re-approval command: that is a desk decision and not done here.

## 2. Step 1: three builds, the determinism proof, and the stamp footprint

Full detail: `n204-baseline_b2869772/builds/COMPARISON.md`; footprint: `n204-baseline_b2869772/STAMP-FOOTPRINT.md`; file lists: `n204-baseline_b2869772/builds/*.files.txt` (`sha256  size  path`, sorted by path).

* **The two base builds are identical.** Build 1 (`b2869772`, `TZ=UTC`, 04:40:53 UTC) and build 2 (`b2869772`, `TZ=Pacific/Kiritimati`, 04:42:58 UTC, 2 minutes 5 seconds later, fresh clone) each wrote 218 files, 478,881,059 bytes, and the two lists are equal path for path, size for size, hash for hash (list sha256 `a02a9461675adb7e580dc09e552ee89eea7684d56faa2a5c999ee5b7f3775180`). **A discarded earlier build 2, started 39 seconds after build 1, matched too.**
* **The third build (`93edb360`, identical source) differs from the base in 16 files out of 218:** 4 at the same path (`_app/version.json`, `sw.js`, `index.html`, `notation-font-lab.html`) and 12 renamed (`_app/immutable/` chunks, entries, and nodes). **202 are byte-identical.** Eleven of the twelve renames were proved exact by applying the stamp swap and the rename map to the base file and comparing; the twelfth also differs in minifier-chosen short names (`b6 as Ne` against `b6 as je`; 29,692 against 29,688 bytes). The rest of that file is NOT ESTABLISHED.
* **How the stamp is computed** (read: `build-id.js:17-23`, `svelte.config.js:19-25`, `vite.config.ts:12`, `scripts/stamp-sw.mjs`): the first eight characters of `VERCEL_GIT_COMMIT_SHA`, else `git rev-parse --short=8 HEAD`, else `'unknown'`. **It can be pinned** by setting `VERCEL_GIT_COMMIT_SHA`. I did not pin it.
* **The determinism history agrees with the tree.** `svelte.config.js` sets `kit.version.name` from `buildId()`; the repair is `4a8100b4`. The builds prove it holds here.
* **The build completed with every fetched asset present.** All five homr model files downloaded (`apps/web/static/omr/models/<sha256>/`, 212,615,781 bytes by the script's own table; the whole `omr/models` folder is larger because it also holds the metre and underlay models) and the build wrote `build/omr`. **So the reader's model files reach a cloud container, at least at build time** (that closes one of the desk's four open questions in part: whether the reader *runs* from them is not tested).

## 3. Step 2: the ten families

**Where it all is:** `docs/sessions/n204-baseline_b2869772/`. Top level: `MANIFEST.sha256` (311 files, every file except itself, `sha256sum -c` clean), `FAMILY-HASHES.md` (the family hashes below), `STAMP-FOOTPRINT.md`, `builds/`, `harness/`, `capture/` (run 1, the copy of record), `run2-differences/` (only the files of run 2 that differ from run 1, plus its manifest), and `run3-third-build/`.

**One command:** `bash docs/sessions/n204-baseline_b2869772/harness/capture.sh <repo root> <out dir>` runs families 1 to 9 against a built clone, and `bash docs/sessions/n204-baseline_b2869772/harness/run-playwright.sh <repo root> <out dir> <label>` runs family 10. `python3 harness/make-manifest.py` regenerates the two hash files. The harness records its input list in `capture/inputs.txt`. Nothing was normalised. No committed approval or golden file was written to (the MELODY and TEXT captures read `strophic-byte-baseline.json` and `ipa-corpus.txt` and compare; they do not write them).

**Runs.** Run 1 is build A (`b2869772`, `TZ=UTC`). Run 2 is build B (`b2869772`, `TZ=Pacific/Kiritimati`, a fresh clone, 2 min 5 s after A). Run 3 is build C (`93edb360`, `TZ=America/St_Johns`). Family hashes are of run 1.

| Family | Files | Bytes | Family hash (sha256) | Runs 1 and 2 agree |
|---|---:|---:|---|---|
| 1 MELODY SVG | 219 | 17,107,029 | `9ff7d17df47f80cce143974825521fd4cd007eabf39b6d7ab08103e15f214eb6` | Yes, byte-identical |
| 2 TEXT IPA | 4 | 798,001 | `ec3b7cf9f17f10aba6ce213d5af6263c93c7ab6547177a9a759cb2f31f14e226` | Yes |
| 3 INSIGHTS | 8 | 239,209 | `b83df1d529844e0a5c377fd5862ba484f3970807dd5b367d6c5f436001d6931e` | Yes |
| 4 printed pages | 12 | 1,926,766 | `a0119ae7bd8df382e4547e07e5ba5610e2c408d9bd6fedfde31887b631b34041` | No: the six PDFs differ by 6 bytes each (dates); the six sheets HTML files agree |
| 5 binder and saved voice | 8 | 21,024 | `b3c061d193d1b773864fcfd2cd15bad76f642e0ca9c2b277c64e2225b731205b` | Saved-voice JSON yes; binders no (random song id) |
| 6 i18n table | 2 | 184,203 | `de9e4888cc8d9a1007455e04da17e94e9c01ed8de24a2b3a13e3f4c0f57f7a9b` | Yes |
| 7, 8, 9 build lists | 3 | 26,997 | `6273ffa42727ab1f3a33f07d7ac4ba1e5c1d277fa0c9b851744290272d9211cd` | Yes (build C differs in family 9 only in `buildDirBytes`, 478,881,053 against 478,881,059, because C is a different commit) |
| 10 Playwright | 13 | 1,394,432 | `9640b99ab0842b7a364de57e064c1462a8834c02274e96b1a9a845196ba4d697` | 379 of 380 tests agree; see below |
| **Total of the families** | | **21,697,661** | | |

The inner `capture/MANIFEST.sha256` was written by the harness at capture time and still lists the first, wrong `family9-static-bytes.json`; the top-level `MANIFEST.sha256` is the one to trust. The whole lane folder is 23,577,934 bytes in 311 files. No family is near 20 MB (the largest is family 1 at 17.1 MB), and the total is under 60 MB, so neither stop condition was reached. The `.ilya` binders, PDFs and Playwright JSON are the only binary or large text files.

### Family 1: MELODY SVG per page per fixture

Input: the 218 tracked `.musicxml` files (listed in `capture/inputs.txt`). Method: `paginateMelody` at 624 by 727, English, no voice, one SVG per page. Output: `family1-melody/<path with / as __>.pages.svg` and `fixtures.json` (per fixture: source class, pages, bytes in and out, per-page sha256, and whether it agrees with `strophic-byte-baseline.json`). Result: 425 pages, 0 parse errors.

**Scanned-source fixtures are reported apart, not dropped.** 185 carry the homr software tag (scanned source). 33 are file-source: 31 with no software tag, whose provenance I did not establish, and 2 tagged `musx2mxl 0.2.9`. The class is a read of the `<software>` tag, not proof of origin. Of the 218, 208 agree page by page with `strophic-byte-baseline.json`, and 10 are not in it, so they have no prior record. These 10 are listed in `fixtures.json`.

### Family 2: TEXT IPA for the corpus

Real dictionary loaded the way the approval test loads it. `approval-corpus.ipa.txt` is identical to the committed `ipa-corpus.txt` (`approval-corpus.vs-committed.txt` records the comparison). `poem-library.ipa.txt` renders every non-blank line of the poem library: 327 poems, 7,349 lines, against 943,106 dictionary entries. `summary.json` holds the counts.

### Family 3: INSIGHTS figures and comments, English and French

Two scores (`sunless-01-engraved`, `tchaikovsky-op38-3-voice`), two languages, each as `.html` and `.txt`. **Voice input:** the end-to-end suite's `storedVoice('bass')`, a typed-range voice with `source: 'manual'`, fixed dates `2026-11-01T09:00:00.000Z`, and hand-set formants. It is not the dev-only capture stub. The browser clock is fixed to 2026-11-24T12:00:00Z. These output files do not change with the build stamp (run 3 matches).

### Family 4: printed pages

Format: a PDF from `page.pdf({ preferCSSPageSize, printBackground })` plus the `.paper-page` markup (`*.sheets.html`), for TEXT, MELODY and INSIGHTS, in both languages (the MELODY files are still named `markup.*`). **Not byte-stable as PDFs:** each differs between runs in 6 bytes, all inside `/CreationDate` and `/ModDate`, which come from the real process clock that the page clock does not reach. The sheets HTML files are identical, and each PDF's page count equals the sheets on screen. I did not normalise the dates.

### Family 5: exported binder and saved voice

`binder.en.ilya` and `binder.fr.ilya` come from the UI (REPERTOIRE band, then EXPORT AND IMPORT band, then the export-this-song button) and a download event. Member lists are in `*.members.txt`. Zip member timestamps are `(1980, 0, 0, 0, 0, 0)`. **The binders differ between runs** in the random song id in the member paths and in `manifest.json`, and build C's `manifest.json` also carries its own `build` field. `suggestedFilename()` returned `download`, not an `.ilya` name; I did not establish why. **The saved voice:** the app has no standalone voice-export file (the binder is its only download site), so the "saved-voice JSON" is `localStorage['shane.profiles.v2']` as read from the page (`saved-voice.en.json`, `saved-voice.fr.json`). Both runs and build C agree.

### Family 6: sorted i18n table

1,348 keys, sorted, JSONL. Hash in `i18n-table.sha256`: `cb75977b38ab67fa3f8d4db8e0e81af669d40d3552a629cf8ec2b32f494c5fe8`.

### Families 7, 8, 9: build files, `sw.js` precache, `static/` bytes

- **7:** 218 files in `build/`, 478,881,059 bytes, each with size and sha256. Builds A and B are identical.
- **8:** the `APP_SHELL` and `DECODER_FILES` lists from `static/sw.js` (source) and `build/sw.js` (built). They match across A and B.
- **9: measured in `apps/web/static/` after `pnpm build`.** The step copies the pdf.js, ort, heif, metre and underlay files into it and fetches the five homr model files, so it is not the committed size. **`static/data` is a symlink to the repository-root `data/`, and the first capture did not follow it (269,554,504 bytes in 157 files, which was wrong).** I fixed `build-lists.mjs` and recaptured: **444,049,813 bytes in 165 files**, of which `data` is 174,499,405 and `omr` is 256,389,897. A and B agree. For comparison, `git ls-tree` at `b2869772` lists 126 tracked entries totalling 10,107,329 bytes under `apps/web/static`, and `build/` is 478,881,059 bytes.

### Family 10: both Playwright projects, twice

Command: `playwright test --reporter=list,json --trace off`, no update flags, one run after the other, on clone A. Both `chromium` and `phone`: 380 tests per run. Per-test lists: `pw-run1.results.tsv`, `pw-run2.results.tsv`; the comparison is `RUN-COMPARISON.md`.

| | Run 1 | Run 2 |
|---|---:|---:|
| passed | 371 | 370 |
| failed | 7 | 7 |
| timed out | 1 | 2 |
| skipped | 1 | 1 |
| wall time | 1.1 h | 1.2 h |

**Eight tests fail in both runs (stable on this machine).** I name them, I did not diagnose them, and I did not touch them:

1. `[chromium]` `heic-offline.test.ts:43`, "a singer offline who never opened a HEIC can open one" (waits 60 s for the reading banner, finds nothing).
2. `[chromium]` `insights-page.test.ts:224`, "the passaggio names clear the bracket..." (timed out both times).
3. `[chromium]` `loupe-header.test.ts:47`, "a drag on the desk moves the card...".
4. `[chromium]` `repertoire-recedes.test.ts:13`, "REPERTOIRE opens on arrival at two songs, folds on each of its three events" (a strict-mode locator match on two INPUT buttons is in the log).
5. `[phone]` `input-views.test.ts:134`, "a poem typed into Poem moves no seat of «Within Four Walls»".
6. `[phone]` `phrase-ends.test.ts:26`, "Tchaikovsky onto an empty song: 172 seats...".
7. `[phone]` `relining.test.ts:70`, "y. a poem pasted into Poem lays Lyrics out...".
8. `[phone]` `relining.test.ts:95`, "bb. a poem typed key by key lays Lyrics out after the pause...".

**One test is unstable:** `[chromium]` `time-signature-card.test.ts:37`, "4/8 to 3/4 to the end, keeping the barlines...", passed in run 1 and timed out in run 2.

Whether these eight also fail on Dann's Mac is NOT ESTABLISHED. The suite is heavy (two files run 9 to 11 minutes each), so some failures could be load, timeout, or Linux-specific. I cannot tell which from two runs.

## 4. Gates

These are **my** figures, measured in clone A on Linux x86_64 in the cloud, where `scipy` is absent. Dann's figures are from his Mac.

| Gate | Baseline (Mac, brief) | Mine (Linux, no `scipy`) |
|---|---|---|
| 4: web unit suite | 6804 passed, 1 skipped (6805) | **6800 passed, 5 skipped (6805)** |
| 5: score-parser | 911 passed, 5 skipped (916) | **911 passed, 5 skipped (916)** |

The web difference is four tests, all `it.skipIf(!havePython)` in `voice/engine/burg.test.ts`. They skip because `scipy` is missing, and the total (6805) equals the Mac's. I read that as the expected `scipy` effect and not as drift, but I did not run them with `scipy` to prove it. This is the only gate that differs from the brief's figure, and I did not treat it as a stop condition for that reason; it is the desk's call.

Also measured, no baseline given in the brief: phonology 462, dictionary 248, blurb 178, integration 159, the ratchets exit 0, and `svelte-check` reports 0 errors and 12 warnings. **The brief refers to "eight gates", and their definition is not in the repository** (`ilya-ship.sh` is not in the tree), so I ran the suites above and cannot say they are the eight.

## 5. Environment

Linux 6.18.44 x86_64 (a cloud container). node v22.23.5, pnpm 10.28.0, Playwright 1.58.2, Chrome for Testing 158.0.8127.36 (`/opt/pw-browsers/chromium-1243`), Python 3 for the harness helpers, `scipy` absent. Run 1 `TZ=UTC`, run 2 `TZ=Pacific/Kiritimati`, run 3 `TZ=America/St_Johns`. The three clones share one pnpm store, so "fresh clone" is not a fresh store.

**Whether a Linux capture equals a Mac capture is NOT ESTABLISHED.** I have no Mac capture to compare. The font files, SVG text, and PDF writer are the likely places for a difference, and I tested none of them.

## 6. Token spend

The cap was 400,000 tokens. From the usage fields in this session's transcript (107 distinct assistant messages; the transcript was compacted once, and a count taken from it could miss turns that the compaction summarised): **input 211, cache-creation 297,882, output 89,514, cache-read 18,915,359.** New input plus output is about 387,600 tokens. The 18.9 million cache-read figure is repeated re-reading of the same context, and I do not know whether the cap counts it. If it does, I am far over; if it counts only new input and output, I am under it by a small margin. The desk should read that as unresolved and not as a pass.

## 7. What I could not establish

1. **Whether a Linux capture equals a Mac capture.** NOT ESTABLISHED (section 5).
2. **Whether the eight stable Playwright failures are Linux-only, load-related, or real.** I ran each suite twice and diagnosed none.
3. **Whether the reader runs from the model files, not only downloads them.** The build fetched all five homr files, so they reach the container, but `heic-offline` fails and I do not know whether that touches the reader.
4. **A cloud session can complete a production build and a full Playwright run: yes, both, here.** Build 1 ran 04:40:53 to 04:41:24 UTC (31 s), and each Playwright run took 1.1 to 1.2 hours.
5. **How the stamp is computed:** read and named in section 2, and it can be pinned with `VERCEL_GIT_COMMIT_SHA`. I did not pin it, so I did not test a pinned build.
6. **The one chunk that differs beyond the stamp** (`DQNXc5L2.js` against `CnmTm5k5.js`, 29,692 against 29,688 bytes, with minifier short names `Ne` against `je`). The cause is NOT ESTABLISHED. It is named in `STAMP-FOOTPRINT.md`.
7. **Why `suggestedFilename()` returned `download`** for the binder.
8. **How the binder and PDFs behave with the clock unfixed.** I fixed the page clock; `exportedAt` agreed because of that.
9. **Provenance of the 31 file-source fixtures with no software tag**, and why 10 MELODY fixtures are missing from `strophic-byte-baseline.json`.
10. **Whether any test reads the ten MELODY fixtures that are absent from the strophic baseline.** I did not trace this.
11. **The two golden folders I named and did not read** (`third_party/homr-web/src/golden/`, `tools/n200-score/__golden__/`).
12. **Whether the `static/` pnpm shared store affected the builds.** The two base builds are identical, so I saw no effect.
13. **Step 0b pause:** the brief said to decide at step 0b and let the desk decide. I recommended "capture beside" and proceeded without waiting. Nothing I did edits a committed approval file, so it is reversible.
