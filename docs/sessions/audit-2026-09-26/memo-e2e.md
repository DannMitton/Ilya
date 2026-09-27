# E2E repair and coverage memo

Branch `audit`, repo `/home/claude/ilya`. Files touched:
`apps/web/e2e/core-loop.test.ts`, `apps/web/e2e/helpers.ts` (new),
`apps/web/e2e/singer-paths.test.ts` (new), `apps/web/playwright.config.ts`
(only the `PW_CHROMIUM_PATH` override, in both projects). No file under
`apps/web/src/` or `packages/` touched; `git status --porcelain` shows only
these four.

## Repaired (all 21 tests kept, none deleted)

Every test still describes real behaviour; none was deleted. Two shared
helpers broke every test and were replaced in `e2e/helpers.ts`:

1. `.status-ok` was removed at commit 5f6a2f3 (N.108-5); comment at
   `IntakePanel.svelte:233`. Replaced with waiting for the intake textarea
   (`textarea.text-input`) to be enabled — its `disabled` is bound to
   `loaderState.isLoading` (`IntakePanel.svelte:375`).
2. The Transcribe button (`.btn-primary`, `handleTranscribe`) was removed
   2026-09-16, N.145 (`+page.svelte:660`, "yes, remove the button"). Typing
   now transcribes itself via `joinText`/`QUIET_MS` (`+page.svelte:3186`,
   `one-action.ts:41`, 600 ms). Replaced `transcribe()` with fill + wait for
   the first word.

Selector/copy repairs, each cited at its test:
- Empty-state copy changed to `paper.empty` (i18n.ts:699, `.empty-directive`,
  `TitlePage.svelte:167-168`); old copy is gone from the tree.
- Intake's Clear button is now `.receipt-btn` (`IntakePanel.svelte:463`), not
  `.btn-secondary` (that class now belongs only to `ScoreUploader.svelte`).
- **The Inspector no longer opens on word selection alone.** `InspectorPanel`
  now mounts only inside the Analysis station's `consoleContent` snippet,
  itself `{#if expanded}` (`AnalysisStation.svelte:73,82-83`; wired at
  `+page.svelte:4776`), and Analysis starts collapsed. Five tests
  (click-opens-Inspector, Clear-dismisses, Enter-opens, ribbon test, clitic
  Inspector) now expand Analysis first via a new `expandStation()` helper.
- **The Notation switches only render when Notation is expanded**
  (`NotationFields.svelte`'s own `StationHeader`, label "Notation"). Two
  tests (toggle test, open-syllabification test) now expand Notation first.
- **The first WordStack no longer autofocuses after transcription.** That was
  part of the removed Transcribe handler ("a focus move onto the first word
  ... nothing replaces them", `+page.svelte:660-666`). The Tab test now
  focuses the first word explicitly, then tests Tab moves to the second.
- The provenance-icon test used "молоко", a plain dictionary word.
  `showProvenance()` (`provenance.ts:40-45`) explicitly returns `false` for
  `stressSource: 'dictionary'` ("normal operation, no icon"), so that word
  can never show a provenance icon or VERIFY label — this was true of the
  mechanism, not a regression. Swapped to "бабамба", a non-dictionary word,
  which exercises the `.verify-label` path the test was meant to pin.

**Root cause of most of the above:** Playwright's `Desktop Chrome` device is
1280px wide. The app's own desk/phone breakpoint,
`isDeskLayout(viewportWidth)` (`layout.ts:62-64`), needs
`DESK_LAYOUT_MIN_WIDTH` = 520 + 816 + 64 = **1400px**. At 1280px the whole
suite silently ran the **phone layout** (a bottom drawer sheet, "Tap Drawer
at the bottom of the screen…"), explaining why nearly every test failed
identically at first. Both new test files set
`test.use({ viewport: { width: 1440, height: 900 } })`.

Nothing was marked `test.fixme`: every failure traced to a real, deliberate
app change (cited above with file:line), not a defect worth flagging.

## Added (7 new tests, `singer-paths.test.ts`)

- (a) Opens `apps/web/src/lib/shane/ingestion/fixtures/sunless-01-engraved.musicxml`
  through the real hidden file input (`IntakePanel.svelte:499-505`), asserts
  the score receipt and a rendered, transcribed score (39 words).
- (b) Edits a word's gloss via the Inspector's dictionary panel
  (`.dict-gloss-input`, `InspectorPanel.svelte:1038-1043`), confirms it
  updates the Paper immediately, survives reselecting the word, and survives
  a reload after a 2s autosave window.
- (c) Two tests: EN/FR toggle on the Fit pane's `profile-empty` message and
  on the Insights pane's identity line.
- (d) Creates a second song via the Repertoire station's "New song", types
  into it, reloads, confirms the second song is still active with its text,
  then reopens the first song from the list and confirms its own text.
- (e) Learn and Guide open and show their first heading (`#learn-title`,
  `main h1`) in both languages.
- (f) Fit tab with no calibration shows `.profile-empty`
  ("Calibrate your voice to begin.") and the Calibrate control in the Voice
  station, no microphone touched.

All 7 pass. One correction along the way: the Insights identity line's DOM
text is genuinely all-caps ("NOT CALIBRATED") because `TitleHeader.svelte:60`
uppercases the `poet` prop passed through it — a real render step, not a
stale test, cited in the test's comment.

## Three chromium runs

| run | result | time |
|---|---|---|
| 1 | 28/28 passed | 4.5m |
| 2 | 28/28 passed | 4.4m |
| 3 | 28/28 passed | 4.5m |

No flakiness; per-test timings were stable across runs (7.7-9.8s for most,
18-20s for the two tests that reload the page).

## Phone project (run once, unchanged)

3 tests in `e2e-phone/loupe-scan.test.ts` (pre-existing, not touched):
- `the whole-fixture scan, and the five rules`: **failed**, two soft-assertion
  violations: rule 1 (44px tap floor) at m.10, and rule 5a (caret centring)
  at m.17, both reported with exact pixel deltas in the test's own output.
- `real clicks resolve note, rest and caret taps on a converged measure`:
  **passed** (55.3s).
- `real clicks on a measure that did not converge`: **skipped**.

This failure is in code I was told not to touch and is outside this task's
scope; reporting it, not fixing it.

## What I could not establish

- Whether the phone project's rule 1/5a failures are pre-existing or newly
  introduced; I ran it once, as instructed, with no `src/` changes to
  compare against.
- Whether AGENTS.md's "the user-facing tab is Fit... never translated" is a
  not-yet-shipped ruling or simply out of date next to `tab.markedScore` =
  "Markup"/"Annotation" (i18n.ts:118). Not mine to resolve; flagged below.

## Surprises

- **The tab AGENTS.md calls "Fit" reads "Markup" (EN) / "Annotation" (FR) in
  the live app.** `DeskHead.svelte`'s own comment says this was ruled by Dann
  2026-09-13 (N.132): "It is not called Fit here." Directly contradicts
  AGENTS.md's invariant. New tests target what the app actually shows, per
  the characterization brief, and flag rather than resolve the conflict.
- The 1400px/1280px breakpoint mismatch above is the root cause of nearly
  every original failure; worth locking layout-sensitive tests to an
  explicit viewport rather than the `Desktop Chrome` device default.
- Drawer stations (Notation, Analysis, Piece, Voice) start collapsed but
  persist open/closed state to `localStorage` across reloads.
  `expandStation()` checks `aria-expanded` before clicking for exactly this
  reason; an unconditional click can toggle a station reload left open.
- Gloss overrides and poem text persist through IndexedDB only after a short
  autosave window; a reload right after typing can race the write. Both
  reload-dependent tests wait ~2s first.
