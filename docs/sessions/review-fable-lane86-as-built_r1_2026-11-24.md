# Review: lane 86 as built, the N.204 behaviour baseline (r1)

Written by Fable 5.2 as a review subagent, 2026-11-24, for the desk. Read from my own clone of `cloud-lane-86`. **The lane is complete: its tip is `df62de21` (pushed 07:27 UTC), four commits on `93edb360`, not `e02919ba`.** Everything below is the finished lane. Paths without a prefix are under `docs/sessions/n204-baseline_b2869772/` on the lane. Nothing was merged, pushed, or changed; this file is the only write.

**Verdict: MERGE-WORTHY AS A BASELINE, with done-when item 3 reworded first (section 3) and five corrections noted for later lanes (section 6).**

Terms. "Stamp footprint" is the lane's, adopted. "Stamp pin", "seeded pointer", and "four-field mask" are mine, coined here.

## 0. What I ran myself

Three things beyond reading, all in my own container (Linux x86_64, node 22.23.5, pnpm 10.28.0, a separate machine and pnpm store from the lane's, about four hours later):

1. **A fourth build**, at `df62de21` (source equal to `b2869772` under `apps`, `packages`, `scripts`, `data`; `git diff --stat` printed nothing), with `VERCEL_GIT_COMMIT_SHA=b2869772` and `TZ=Asia/Tokyo`, 08:49:27 to 08:50:09 UTC.
2. **The lane's `harness/live-capture.mjs`**, unmodified, against that build.
3. **The same script with one added line** seeding `localStorage['ilya:activeSongId']`, run twice, the second under `TZ=Pacific/Kiritimati`.

## 1. The determinism proof holds

**It holds, and I reproduced it independently.** `harness/build-lists.mjs` on my build wrote a file list whose sha256 is `a02a9461675adb7e580dc09e552ee89eea7684d56faa2a5c999ee5b7f3775180`, the lane's figure for builds 1 and 2 (`builds/COMPARISON.md`, "Build 1 against build 2"). 218 files, 478,881,059 bytes. My family 8 and family 9 files are byte-identical to `capture/family-build/` as well.

The lane's own evidence, checked:

- `builds/build-1-*.files.txt` and `builds/build-2-*.files.txt` are byte-identical (`cmp`), 218 lines each, sizes summing to 478,881,059.
- **Independence is asserted in prose and not recorded in an artifact.** `builds/COMPARISON.md` ("Clean state") says separate `--no-hardlinks` clones, own `node_modules`, no `.svelte-kit`, starts 2 min 5 s apart, `TZ=UTC` against `Pacific/Kiritimati`. No build script and no build log is committed; `harness/` holds capture scripts only. The shared pnpm store is disclosed. My fourth build shares nothing with the lane's and removes the doubt.
- Build 3's start time is not recorded ("after 04:41:24, before 04:42:32"). It does not bear on the proof.

**The stamp footprint accounts for 15 of the 16 files, and the sixteenth matters.** `STAMP-FOOTPRINT.md` lists 4 same-path files and 12 renames; 11 renames are verified exact by swap and rename map. The twelfth, `chunks/DQNXc5L2.js` against `CnmTm5k5.js`, differs in minifier short names after the swap (29,692 against 29,688 bytes) and the lane files the rest as NOT ESTABLISHED. So the footprint is **not a fixed list a later lane can subtract**: one chunk's content depends on the stamp's value, and a third commit hash may shift it differently. Cause: NOT ESTABLISHED. My inference, marked as inference: the minifier orders short names by character frequency in the file, and the eight stamp characters change the count.

**The stamp pin removes the footprint.** `apps/web/build-id.js:18` returns `VERCEL_GIT_COMMIT_SHA.slice(0, 8)` when the variable is set. The lane named this and did not test it. I tested it: a build at a different commit with the pin set equals the base build in all 218 files. A later lane that pins the stamp compares families 7, 8, and 9 byte for byte with no subtraction.

## 2. The two families that are not byte-stable

### Family 4, the printed pages: the cause is the PDF Info dictionary, four fields

Each PDF carries, in one object near byte 250 to 370:

- `/CreationDate (D:20261124045554+00'00')` and `/ModDate`, the browser process's wall clock. The harness fixes the page clock (`harness/live-capture.mjs`, `ctx.clock.setFixedTime`), which does not reach the PDF writer.
- `/Creator (... HeadlessChrome/158.0.0.0 ...)` and `/Producer (Skia/PDF m158)`, the browser version.

Evidence: `cmp -l` of `capture/family4-print/*.pdf` against `run2-differences/family4-print/*.pdf` gives 6 bytes per file at offsets 331 to 333 and 366 to 368, the minute and second digits of the two dates. **Six is an accident of a 78-second gap.** My capture, four hours later on Chrome for Testing 153.0.8010.12, differs from the lane's in 8 to 10 bytes per file (offsets 254, 300, 329 to 333, 364 to 368). With the four fields masked, all six of my PDFs equal the lane's byte for byte. No `/ID` entry is present. The six `*.sheets.html` files equal the lane's with no mask.

### Family 5, the binder: the desk's belief is right in effect and wrong in place

**The cause is one random song id. It is not minted at import.** It is minted when the library opens with no active-song pointer: `apps/web/src/lib/library/index.ts:181` calls `newId()`, which is `crypto.randomUUID()` at `index.ts:71`, and writes the pointer. The harness opens a fresh browser context per language, so storage is empty and each capture gets a new id. Loading a score mints nothing.

Evidence: I unpacked the four committed binders. Between runs `song.json` differs in one line, `id`; `manifest.json` differs in `songs[0].id` and `songs[0].path`; the two member paths carry the id; `source/sunless-01-engraved.musicxml` is identical (`684442…` in all four `*.members.txt`). The archive length moves with the id (8,338 to 8,342 bytes across the lane's four and my two). `createdAt`, `updatedAt`, and `exportedAt` agree only because the page clock is fixed.

**The seeded pointer makes the binder byte-stable.** With `ilya:activeSongId` set before load (`index.ts:35`, read at `index.ts:178`), no id is minted. Two runs gave identical binders, English equal to French, sha256 `3f1389eb…`, 8,235 bytes; `song.json` and `manifest.json` equal the lane's once the id is replaced. Families 3 and 4 and the saved voice were unchanged by the seed. `notices.ts:104` raises the partial-loss notice only when the vault holds other songs, so an empty vault raises none.

**The binder also carries the stamp**: `manifest.json` has `"build": "b2869772"`. `STAMP-FOOTPRINT.md` lists build files only and does not say so. The stamp pin covers it.

## 3. Recommended wording for done-when item 3

**Recommendation: adopt wording A now. It needs no change to the lane.** Wording B is tighter and costs one small follow-up (seed the pointer in the harness, re-capture four binder files).

**Wording A, replacing "the behaviour baseline equal byte for byte except the listed intended differences":**

> the behaviour baseline, re-captured with `harness/capture.sh` in the baseline's own environment on a build made with `VERCEL_GIT_COMMIT_SHA=b2869772`, equal byte for byte to `n204-baseline_b2869772/capture/` except the listed intended differences. **Two standing comparison rules apply; what they exclude is not a difference and is not listed. (a) Printed pages:** each PDF is compared after four fields of its Info dictionary are masked, the fourteen digits of `/CreationDate`, the fourteen digits of `/ModDate`, the number after `HeadlessChrome/` in `/Creator`, and the number after `Skia/PDF m` in `/Producer`; any other byte is a difference, and the six `sheets.html` files are compared unmasked. **(b) The binder:** the archive is unpacked and compared member by member with the song id replaced by one placeholder in the two member paths, in `song.json`'s `id`, and in `manifest.json`'s `songs[0].id` and `songs[0].path`; any other byte of any member is a difference. The archive's own bytes and length are not compared. **A lane reports both comparisons as run, with the command.**

**Wording B**, after the harness seeds the pointer: drop rule (b); the binder is byte for byte.

Three notes on it:

- **The mask is a comparison rule, not a normalisation of the capture.** The brief's "Normalise nothing" governs what is committed; committed files stay as captured.
- **"In the baseline's own environment" is load-bearing.** Whether a Mac capture equals this one is NOT ESTABLISHED (lane report, section 5). Plan 5c runs tier 3 lanes on the Mac; they need a Mac capture first, or the cloud.
- **The same item's "both Playwright projects pass" cannot be met against this baseline** (section 5). Suggested: "both Playwright projects return the baseline's per-test result list (`pw-run1.results.tsv`, columns project, result, file and line, title), every change named; `time-signature-card.test.ts:37` is unstable and is reported, not held."

## 4. Step 0b: capture beside. I agree

The existing mechanisms are tests re-approved with `-u`; a fixed reference is a different job, and extending them means editing files under `apps/`, which the brief forbids. The lane's reasoning is sound.

What it costs later:

1. **Two records of the same facts.** Family 1 repeats `strophic-byte-baseline.json`; family 2 repeats `ipa-corpus.txt`. A tier 4 lane that changes MELODY on purpose re-approves one and re-captures the other.
2. **No gate runs it.** The baseline holds only when a lane remembers to run the harness. Done-when item 3 is the only enforcement.
3. **The harness reaches into source.** It imports `$lib/melody/melody-pages`, `$lib/score/ingestion/mini-dom`, `$lib/score/engraving`, `$lib/pipeline`, `$lib/i18n` (`harness/melody.capture.ts:13-16`, `text.capture.ts:10-12`, `i18n.capture.ts:6`) and drives selectors such as `#tab-insights` and `.paper-page`. A tier 3 lane that moves any of them must edit the harness, and then has to show the edited harness still photographs the same thing.
4. **Size.** A full re-capture is 22 MB. Later lanes commit differences only, as `run2-differences/` does.

## 5. Family 10 and the family 9 recapture

**Family 10: the lane did what the brief asked.** `pw-run1.results.tsv` and `pw-run2.results.tsv` list 380 tests each, the same 380. I recounted: run 1, 371 passed, 7 failed, 1 timed out, 1 skipped; run 2, 370, 7, 2, 1. `RUN-COMPARISON.md` names the eight stable failures and the one unstable test.

- **The unstable test is a hang, not slowness.** `[chromium] time-signature-card.test.ts:37` passed in 6.1 s in run 1 and ran to its 180 s limit in run 2 (`pw-run1.json`, `pw-run2.json`). Cause NOT ESTABLISHED.
- **Seven of the eight stable failures are assertion failures in 9 to 65 s; one (`insights-page.test.ts:224`) is a 60 s timeout.** The report's "could be load" fits one of eight. `ENVIRONMENT.md:5036` already records `e2e/insights-page` as stale. Whether any fails on the Mac is NOT ESTABLISHED.
- **It ran against `pnpm dev`, not the build** (`apps/web/playwright.config.ts:58-59`; `harness/run-playwright.sh` says so). `RUN-COMPARISON.md`'s heading "two runs, one build" means one clone.

**Family 9: replaced where it counts, stale in three manifests.** 444,049,813 bytes in 165 files is in `capture/family-build/family9-static-bytes.json` and `run3-third-build/family-build/`; the top-level `MANIFEST.sha256` verifies clean over 311 files; the family 7, 8, 9 hash `6273ffa4…` recomputes. My own build gives the same file. **Still carrying the first capture's hash:** `capture/MANIFEST.sha256` (disclosed), and `run2-differences/MANIFEST.sha256` and `run3-third-build/MANIFEST.sha256` (not disclosed). The report's "A and B agree" on the recaptured figure has no run 2 artifact behind it; my build supports the figure itself.

## 6. What would mislead a later lane

1. **`builds/COMPARISON.md`'s table gives build 3 as 478,881,059 bytes.** Its own file list sums to 478,881,053, and the report's section 3 and `run3-third-build/family-build/family9-static-bytes.json` say 478,881,053.
2. **"The six PDFs differ by 6 bytes each"** (report, family table). True of that pair only; expect up to 28 date bytes, plus the version fields on another browser.
3. **`FAMILY-HASHES.md` gives one hash each for families 4, 5, 7 to 9, and 10 as though they were reproducible.** Family 4 and 5 hashes change every run; 7 to 9 change with the stamp; family 10's includes JSON with durations and start times. Only families 1, 2, 3, and 6 have a hash a later lane can match. The two unseeded runs' inner manifests confirm those four agree.
4. **"A later lane subtracts this list"** (`STAMP-FOOTPRINT.md`). Not safe for the stamp-bearing chunks. Pin the stamp.
5. **Coverage is narrower than the family names.** Family 1 is English, no voice (`report`, family 1). Family 3 is two scores and one bass voice. Families 4 and 5 are one score. A French-only MELODY change, or a comment that only a soprano sees, passes this baseline untouched.
6. **The inner manifests are not the record**; the top-level one is.
7. **Chromium.** The lane's `environment.txt` reads 158.0.8127.36 at `/opt/pw-browsers/chromium-1243`; the same path in my container reads 153.0.8010.12. Why is NOT ESTABLISHED. Families 3, 4 (sheets), and 5 (saved voice) were byte-identical across the two.
8. **The lane's token spend is unresolved by its own account** (report, section 6): about 387,600 new tokens against a 400,000 cap, with 18.9 million cache-read not counted.

## 7. NOT ESTABLISHED

- Why one chunk's short names move with the stamp.
- Whether a Mac capture equals the Linux one.
- The cause of the eight stable Playwright failures and of the one hang.
- Why two containers report different Chrome versions at one path.
- Whether the PDF body stays identical on a browser beyond 153 and 158.

## 8. Spend

About 170,000 tokens against a cap of 300,000, an estimate; no subagents.
