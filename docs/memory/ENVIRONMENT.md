# ENVIRONMENT — the traps

**A lookup table, not a read-through.** Open it when you are about to touch a tool,
a path, or a gate. Every line here cost someone an hour.

---

## Gate baselines

| gate | baseline |
|---|---|
| phonology | 216 |
| dictionary | 235 |
| web-check | 0 errors, 7 warnings, 4 files |
| web-test | **416** |
| score-parser | 442 passed, 5 skipped |

**Tell Dann the new gate number BEFORE he runs the ship script, not after.**

**A BRIEF THAT ASKS A FARMED-OUT AGENT TO RUN A GATE IS A BROKEN BRIEF.** No
gate runs anywhere but Dann's own Terminal, for the reason two sections down:
`node_modules` is macOS and every VM in reach is Linux arm64. Tell the agent
that in the brief, and make its definition of done "the tests are written and
hand-traced," with the gate run listed under what Dann must do. **Running the
task on Dann's computer instead of in the cloud does NOT fix this**: that mode
is a Linux VM too.

**The baseline lives in `~/Downloads/ilya-ship.sh:79` and only moves with
Dann's permission.** It moved 408 to 416 on 2026-08-13 for `pairings.test.ts`.

**`mscz-converter.test.ts` prints to stderr on three tests by design.** They
exercise failure paths. The ship script echoes those lines when a gate
deviates, and they are not failures. **Read the count, not the verdict.**

`vitest` never compiles a `.svelte` file. If logic needs testing it does not belong
in a `.svelte` file. `svelte-check` is what looks at components.

---

## Deploys

`WRITTEN` until a browser observation exists, then `DONE`. Builds run 26 to 27
seconds, Vercel about 90 more.

**Use the deployment's own permanent URL:** `list_deployments` with a `since`, match
`githubCommitSha`. **Do not take the newest.** Team
`team_CmkdrV66wAIF29pQLpiAb80O`, project `ilya`. There is no `.vercel/project.json`.

**Do not tell Dann to clear website data; his readings live in `localStorage`.**
Send a QR only for a build whose change he can see.

**The cloud container cannot reach `*.vercel.app`.** Chrome on his Mac is the way.

---

## Browser and extension

- **A TAB THAT LOADED WHILE HIDDEN NEVER HYDRATES.** Reload it. `document.hidden`
  first, always.
- **`document.hasFocus()` can be TRUE while `visibilityState` is `hidden`**, when
  the Chrome window is not the frontmost window on the Mac. Focus is not
  visibility. Nothing you can do from here fixes it: **ask Dann to bring the
  window to the front**, and do not report a reading taken before he has.
- **The language toggle is not a `<button>`.** `querySelectorAll('button')` misses
  `Francais`. Use `'button,a,[role=button]'`.
- **A BACKGROUNDED CHROME TAB IS NOT AN INSTRUMENT.** Throttling makes a
  two-second load look like a hang.
- The extension's tab group can drop. Recreate with `createIfEmpty: true` and
  re-navigate.
- **The Fit file input is NOT in the accessibility tree.** `read_page` with
  `filter: interactive` does not list it, and forcing it visible with a `style`
  and an `aria-label` does not make it list either, so **`file_upload` cannot be
  given a ref**. What works: build a `File` in `javascript_tool`, put it on the
  input through a `DataTransfer`, then dispatch `input` and `change`. Verified
  2026-08-14. **Record and restore any attribute you set on the page first.**
- **A fixture's JS `.length` is not its byte count.** The control file is 1757
  bytes and 1747 JS characters; the difference is exactly the ten Cyrillic
  characters in its `work-title`, at two UTF-8 bytes each. A short count after
  an injection is not evidence of truncation until you have done that sum.
- **`file_upload` needs the Fit tab ACTIVE FIRST.** With Fit active there is exactly
  one file input and its `accept` list carries `.musicxml`. Transcription's OCR
  input will take a `.musicxml` and fail. Stage first with `device_stage_files`,
  pass `/mnt/user-data/uploads/...`.
- **`form_input` triggers Svelte's binding; `computer`'s `type` did not.** Clicks
  dispatched from `javascript_tool` drove the whole flow in E.47.
- **`javascript_tool` has a 45-second CDP ceiling**, and it redacts base64-looking
  strings as `[BLOCKED: JWT token]`, so an unreadable `localStorage` key is not an
  absent one.
- **`/fit-font-lab` 404s on the deployed build.** There is no zero-setup route that
  renders a stave; you must upload a score.
- **Browsers and origins do not share state.** The branch alias and each deployment
  URL are separate origins with separate `localStorage`. Nine voice profiles exist
  in Chrome; **"Dann", 11 juillet, is the one with readings.**

---

## The device bridge

- **Connected folders to request:** `~/Desktop/ilya-rewrite`, `~/Documents/Finale
  Files`, `~/Documents/Voice Pedagogy Research`, `~/Downloads`. **Folder grants are
  PER SESSION and do not carry between sessions.** Request them with
  `device_request_folder_access`.
- `device_bash` paths are `mnt/<folder>`; it times out at 45 seconds.
  `device_stage_files` takes the full `/Users/...` path.
- **NO GATE RUNS ON THE DEVICE VM.** `node_modules` is macOS, the VM is Linux
  arm64. **A background job does not survive between `device_bash` calls**; for
  sleeps use the cloud `Bash` tool and pass its `timeout`.
- **The bridge refuses `rm`.** Move a file into `_to_delete/` and tell Dann.
- **Re-staging a path already staged this session can return a STALE copy while
  reporting the NEW size.** After re-staging, check `wc -c` against the reported
  `bytes`, or read the device directly.
- **THE BRIDGE DROPS.** `RefreshMcpTools` on `remote-devices`, then `ToolSearch` by
  exact name. **A ToolSearch that returns nothing during a drop is a dropped
  connection, not a missing tool.**
- **BSD versus GNU.** `sed -i ''` and `stat -f %z` fail on the device VM. Use
  `python3` heredocs, and **write ASCII-only Python.**
- **`grep -n` numbers lines relative to its input.** Read with Python and print
  absolute indices. Restrict searches to `src` and pass `--include` filters.
- `device_list_dir` on `~/Downloads` exceeds the token cap; use `ls -lt`.

---

## Container

- `npx --yes typescript@5 tsc` fails. `npm i -D typescript` then
  `./node_modules/.bin/tsc` works.
- `pnpm --filter` resolves from the current directory. Give Dann the `cd`.

---

## Network refusals. Do not route around any of them

`ru.wikipedia.org` and the `fr.wikipedia.org` symbol pages are cache-only to
`WebFetch`. **CanLII, the Supreme Court's site, ScienceDirect, jvoice.org, PubMed,
npmjs.com package pages, and bundlephobia all refuse.**

---

## Known instrument faults in the code

- **`welchPSD` (`dsp.ts:225-241`) does not fail on a short buffer.** It averages
  zero segments and returns an all-zero spectrum, which reads downstream as perfect
  silence rather than "no measurement." Guard on length yourself.
- **`stripBackingRect` matches `fill="#FFFFFF"` while `staff-renderer.ts` paints
  `#F0EBE0`.** Unsettled.

---

## Project knowledge capacity

Measured 2026-08-13: **2.55 bytes per unit**, and a document costs roughly 5,900
units. The estate has a hard 2,000,000-unit ceiling. **This is why the memory lives
here and not there.**

---
*SOURCED from `claude/e48-thread-opener_v1_2026-08-13.md`, read in full 2026-08-13,
plus earlier handovers quoted in it, plus the capacity figures measured directly
this session.*
