# End-to-end coverage map (phase 0 baseline)

Read at `/home/claude/ilya`, branch `Shane`, HEAD `b7c2fc6`, working tree
clean. Sources read: `apps/web/e2e/core-loop.test.ts` (313 lines),
`apps/web/e2e-phone/loupe-scan.test.ts` (424 lines), `loupe-probe.ts` (461
lines), `loupe-rules.ts` (251 lines), `apps/web/playwright.config.ts`, and
(for the singer paths) `apps/web/src/routes/+page.svelte`,
`apps/web/src/lib/shane/ScoreUploader.svelte`.

## Config

`playwright.config.ts` defines two projects: `chromium` (`testDir: './e2e'`,
desktop viewport) and `phone` (`testDir: './e2e-phone'`, 390x844 @3x,
touch/mobile). `webServer` runs `pnpm dev` against `localhost:5173`.

## Tests found, and the path each exercises

### `e2e/core-loop.test.ts` — 21 tests, `chromium` project

| Test | User path exercised |
|---|---|
| shows empty state before transcription | App boot, empty-state copy |
| transcribes Russian text and shows IPA on Paper | Paste text → transcribe → IPA row renders |
| handles multi-word input across lines | Multi-word transcription |
| clicking a word opens the Inspector | Word click → Inspector panel |
| Clear button dismisses Word Console | Clear button resets selection/Inspector |
| keyboard navigation: Tab between WordStacks | Keyboard focus traversal |
| Enter on WordStack opens Inspector | Keyboard-only Inspector open |
| notation toggle updates switch state | Notation preference toggle (Reduced vowel) |
| provenance icons are visible on transcribed words | Dictionary provenance / verify labelling |
| clitics show no provenance icon | Clitic-specific rendering |
| Inspector shows ribbon for transcribed word | Inspector ribbon content |
| language pill switches the app and then offers the way back | EN/FR toggle, pill label/lang attribute |
| French empty state shows French placeholder | FR empty-state copy |
| language toggle updates gloss language after transcription | Gloss re-render on language switch |
| Paper renders transcription in main content area | Paper/main content layout |
| word stacks show three rows: IPA, Cyrillic, gloss | WordStack three-row structure |
| VERIFY treatment wraps inferred stress words | Inferred-stress verify labelling |
| proclitic is identified with is-clitic class | Clitic class on proclitic |
| clitic has reduced padding for visual connection to host | Clitic visual styling |
| Inspector shows full IPA for clitic word | Inspector + clitic combination |
| open syllabification toggle changes IPA spacing on Paper | Open-syllabification toggle |

### `e2e-phone/loupe-scan.test.ts` — 3 tests, `phone` project only

| Test | User path exercised |
|---|---|
| the whole-fixture scan, and the five rules | Upload a MusicXML score (`sunless-01-engraved.musicxml` fixture) via the hidden file input, switch to the Markup tab, walk the loupe (magnifier) through every note/gap of an 18-measure score at phone width, and check five tap-target/positioning rules (tap floor, squircle clearance, no adjacent-measure marks, no opening-barline mark, caret centring) |
| real clicks resolve note, rest and caret taps on a converged measure | Real pointer clicks on notes/rests/carets under the Loupe |
| real clicks on a measure that did not converge | Same, for a measure whose engraving search did not converge |

## Singer paths enumerated from the app source, and their coverage

Read from `+page.svelte` (`TAB_ORDER` at line 2093: `transcription`, `shane`,
`insights`, `learn`, `guide`) and `ScoreUploader.svelte`.

| Path | Covered? | Evidence |
|---|---|---|
| Paste/type text and transcribe | **Covered** | `core-loop.test.ts` `transcribe()` helper, used by most of its 21 tests |
| Correct a word (pitch/duration/tie/tuplet/rest edits via the Correction Station) | **Not covered** | No test clicks into `CorrectionSurface` or exercises `handleStep`/`handleOctave`/`handleTie`/etc. (`+page.svelte` lines 639–1385). Not referenced in either test file. |
| Switch EN/FR | **Covered** | `bilingual interface` describe block, 3 tests |
| Open a score: MusicXML | **Partly covered** | `loupe-scan.test.ts` uploads a `.musicxml` fixture, but only on the `phone` project, and only to drive the loupe scan, not to check the upload UI/error states themselves |
| Open a score: MNX | **Not covered** | No test references `.mnx`; `ScoreUploader.svelte` line 149 lists `.mnx` as a supported "direct" format alongside `.musicxml` |
| Open a score: `.mxl` | **Not covered** | Referenced only in source (`ScoreUploader.svelte` line 812, `upload.format.mxl`), no test |
| Open a score: `.musx` (denigma) | **Not covered** | Source has an entire denigma/WASM conversion path (`ScoreUploader.svelte` lines 9, 543–571, 810, 822–823); no test drives a `.musx` upload |
| Open a score: `.mscz` (webmscore) | **Not covered** | Same pattern as `.musx`, via `webmscore` converter |
| Open a score: PDF | **Not covered** | `ScoreUploader.svelte` has a PDF read path with dedicated errors (`PdfJbig2UndecodedError`, `PdfUnreadableError`, lines 364–367) and an OCR fallback for scanned PDFs (line 378); no test exercises it |
| Open a score: photo | **Not covered** | Same file, `intake.picture.title`, OCR path (lines 51, 297, 376–405); no test |
| Open a score: MIDI | **Not established as a supported format at all.** Grepped `apps/web/src/lib/shane` and `packages/score-parser/src` for `.midi`/`.mid` as an *input* extension; the only `midi` hits found are pitch-numbering fields (`insights.ts`, `insights.test.ts` — MIDI note numbers, not a file format). No evidence Ilya/Fit accepts a MIDI file upload. |
| Calibrate the voice | **Not covered** | `CalibrationWizard.svelte`, `enterCalibration`/`exitCalibration` (`+page.svelte` lines 2291–2304); no test opens or steps through it |
| Fit (repertoire-fit analysis, the `shane` tab) | **Not covered** | No test navigates to the `shane`/Fit tab (`TAB_ORDER[1]`) |
| Insights | **Not covered** | No test navigates to the `insights` tab (`TAB_ORDER[2]`) |
| Learn | **Not covered** | No test navigates to the `learn` tab |
| Guide | **Not covered** | No test navigates to the `guide` tab |
| Print | **Not covered** | `handlePrint()` exists at `+page.svelte` line 2794; not referenced in either test file |
| Save to and reopen from the library | **Not covered** | `switchSong`, `handleNewSong`, `handleRenameSong`, `handleDeleteSong` etc. (lines 3750–3972) have no test coverage |

## Running the suite

I ran Playwright, not merely inspected it. Both projects are broken, for two
different reasons; I did not modify the repository to get this signal (see
method below).

### `chromium` project (`e2e/core-loop.test.ts`): 21/21 fail, and the suite
### cannot currently pass

Root cause, established from source, not guessed: every test in this file
goes through a shared `waitForDictionary()` helper that waits on
`page.locator('.status-ok')`. That selector no longer exists anywhere in the
app. `apps/web/src/lib/components/Drawer/IntakePanel.svelte` lines 233–237
say so directly:

> `` `dictReady` IS GONE with `.root-panel`. It set a `status-ok` class on
> that wrapper, and nothing in this file or any other ever declared a rule
> for it, so the wrapper's removal took its only reader and left a derived
> value that computed an answer nobody asked. Deleted rather than moved.
> N.108 increment 1. ``

`git log --oneline -S"status-ok" -- apps/web/src` confirms the removal
happened at commit `5f6a2f3` ("N.108-5: the cleanup, the Input band, and the
transcription that is always there"). `git log --oneline --follow --
apps/web/e2e/core-loop.test.ts` shows the test file's last real edit was
`0e5ed6e` ("N.73: ..."), which is earlier than N.108. So the test file was
never updated after the class it depends on was deleted; every one of its 21
tests times out at 45 seconds on the very first line of `beforeEach`, before
any of the 21 tests' own assertions run. I confirmed the app itself loads
correctly (a Playwright page snapshot on timeout shows the full UI: header,
tabs, drawer, "Choose File" — the class removal is real, the app is not
broken, only the test's wait condition is stale.

### `phone` project (`e2e-phone/loupe-scan.test.ts`): ran, one real (product,
### not infra) failure observed, remaining two tests not reached in the time
### available

Test 1 ("the whole-fixture scan, and the five rules") ran to completion and
printed its own report table (18 measures, tap-floor and squircle-clearance
measurements per measure). It surfaced two rule violations of the kind the
test itself is designed to catch:

- **Rule 1 (tap floor)**: "m.10 step 131 (note) drawn: m9-5-4 to m10-0-1
  44.00 px" — one caret pair below the 44px tap-floor clause.
- **Rule 5a (caret centring)**: "m.17 caret after m17-5-4: +4.46 px off the
  middle of m17-5-4 to closing barline."

This is real product signal, not an infra failure. My run was cut off by my
own time budget before the pass/fail verdict text and the remaining two
tests (`real clicks resolve note, rest and caret taps...`,
`real clicks on a measure that did not converge`) printed, so I cannot give
a final pass/fail count for this file. NOT ESTABLISHED: whether test 1 as
written treats these two logged violations as a failing `expect()`, and
whether tests 2 and 3 pass.

### Method (why two Playwright runs were needed, without editing the repo)

The repo's installed `@playwright/test` (`1.58.2`, resolved at
`node_modules/.pnpm/playwright-core@1.58.2/...`) requires Chromium revision
**1208**, but the environment's preinstalled browsers at
`/opt/pw-browsers` are revision **1194** (confirmed by reading both
`browsers.json` files). Running `apps/web`'s own `playwright.config.ts`
as-is fails immediately with "Executable doesn't exist at
.../chromium_headless_shell-1208/...". I did not run `playwright install`
(forbidden by the task). Instead, from `/tmp/cxwork/pwrun/`, I wrote two
standalone Playwright config files (outside the repo, not committed, not
copied over the tracked config) that point `testDir` at the real
`e2e`/`e2e-phone` folders and force `launchOptions.executablePath` at the
already-installed `chromium-1194` full browser. I started `pnpm dev` myself
on port 5199 (not 5173/4173) via `nohup`, ran
`playwright test -c /tmp/cxwork/pwrun/playwright*.config.ts` against it, and
killed both the dev server and the browser process afterward. This is a
version-mismatch environment issue, independent of anything in the
repository; it would block anyone in this sandbox from running the suite
via the plain `pnpm --filter @ilya/web exec playwright test` command the
test files themselves document.

## What I could not establish for this section

- Whether the second, near-duplicate `phone` test file's remaining 2 tests
  pass, given my run was cut short.
- Whether `+page.svelte`'s markup (post-script) branches contain any other
  singer path not visible from the tab list and upload-format grep (a full
  markup read was out of scope for the time available; see `page-anatomy.md`).
