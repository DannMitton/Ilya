# Memo: N.145, a dropped score arrives at once

Revision 2, 2026-09-16. Built against
`docs/sessions/brief-n145-instant-score-arrival_r2_2026-09-16.md`, which
supersedes revision 1. The brief was not edited.

## 1. What changed, by file and line

**`apps/web/src/lib/shane/ScoreUploader.svelte`.**

- `UiState`'s `'done'` variant renamed `'arrived'` (`:150-156`), doc comment
  rewritten to say what the state now means: the parse already succeeded and
  `oningested` has already fired.
- `handleFile`'s success branch (`:420`) now sets `ui = { kind: 'arrived',
  ... }` instead of `'done'`, and no longer waits for a press.
- New `announceArrival()` (`:444-448`): what `accept()` used to do
  (`pageFor`, `inkFile`, the call to `oningested`) minus the `reset()` an
  explicit press earned and an instant arrival does not.
- Every UPLOAD-origin caller of `handleFile` now calls `announceArrival()`
  right after: `take()`'s direct branch (`:259`), `readAsked()` (`:560`),
  and a new `handleScoreAnswer()` (`:450-456`) that the askKind "score"
  button (`:767-771`, was an inline `onclick`) now calls instead of calling
  `handleFile` directly.
- The old `accept()`, `hasWaitingScore()`, and `acceptWaiting()` are
  removed outright (they read or were `ui.kind === 'done'`, and nothing is
  left standing at it to read or press); a short comment at their old
  location says where the logic went.
- `bannerTier`, `showBanner`, `readReport` (`:711-716`) read `'arrived'`
  instead of `'done'`.
- The restore path in `onMount` (`:590-611`) is **structurally
  unchanged**: `handleFile` is called the same way, with the same
  arguments, and the block after it still calls `oningested` itself with
  origin `'restore'` and still calls `reset()`. The only edit is the state
  name in its guard, `ui.kind === 'done'` to `ui.kind === 'arrived'`,
  because the variant itself was renamed; **it does not call
  `announceArrival`**, and a comment says so, so a reload still silently
  brings the score back with no summary panel left standing, exactly as
  before.
- Markup (`:820-911`): `{:else if ui.kind === 'arrived'}`; the old
  `.result-actions` row (Try another file, Continue to analysis) is gone; a
  new Dismiss button, reusing `upload.banner.dismiss`, sits inside
  `.read-report` (`:898-908`), calling the existing `reset()`.
- `oningested`'s own doc comment (`:74-81`) and the header comment near
  `onMount` no longer say a press accepts the score.

**`apps/web/src/lib/components/Drawer/IntakePanel.svelte`.**

- `ontranscribe: () => void` replaced with `onflush: () => void` in `Props`
  (`:54-70`), with a new doc comment naming what it now maps to
  (`+page.svelte`'s `flushText`) and why Cmd+Enter is the one thing left
  that needs its own verb.
- `transcribeActs: boolean` removed from `Props` and from the destructure.
- `handleKeydown` (`:328-336`) now calls `onflush()`, not `ontranscribe()`.
- The Transcribe and fit `<div class="intake-transcribe">` block
  (markup, was `:644-660`) is deleted; a two-line comment stands in its
  place, saying the button is gone and that `input.transcribe` and
  `input.transcribeLoading` stay in `i18n.ts` unused, on the same rule
  N.108 increment 2's dropzone strings did. `transcribeError`'s own block
  (unchanged, per the brief) sits directly after it.
- CSS: `.intake-transcribe` is deleted. `.action-btn` and `.btn-ghost`
  survive unedited (`syl-start-over` and four other buttons still use
  them). `.btn-primary` is **left in place, deliberately unused** — see §7.

**`apps/web/src/routes/+page.svelte`.**

- New import, `shouldSeatFirstTranscription` from `$lib/shane/first-seat`
  (`:149`).
- `transcribeText()`'s own header comment updated to record the removal
  (the block right above the function, unchanged otherwise).
- **Step 8, the gap itself.** A new block inside `transcribeText()`
  (`:2407-2429`), placed after the existing `scoreSeatWaiting` block and
  before the N.57 anchor check, reading:
  ```
  if (ingestedScore && shouldSeatFirstTranscription(doc.pairings, true)) {
      const parsed = ingestedScore.result.score;
      if (scoreText !== '' && doc.inputText === scoreText) {
          seatFilledPoem(ingestedScore);
      } else {
          const noLyrics = ingestedScore.result.warnings.some(
              (w) => w.code === 'no-lyrics-found'
          );
          const merged = mergeOnUpload(
              doc.pairings,
              parsed.vocalLine.filter((ev) => ev.type !== 'rest').map((ev) => ev.id),
              syllableTargetIds(parsed.vocalLine),
              buildSlotQueue(lines),
              noLyrics,
          );
          doc.pairings = seatCliticFolds(parsed, merged.map);
          if (merged.proposed) {
              pairingCursor = Math.min(Object.keys(doc.pairings).length, Math.max(0, slotQueue.length - 1));
          }
      }
      orphanedCount = 0;
  }
  ```
- `handleTranscribe()` and its header comment (were `:2490-2546`) are
  deleted outright; a six-line comment stands where the function was,
  naming everything it used to do and confirming none of it is replaced.
- `transcribeActs` and its long header comment (were `:3732-3763`) are
  deleted; `uploaderEl` itself is kept (`take()` still needs it).
- Template wiring: `ontranscribe={handleTranscribe}` and `{transcribeActs}`
  replaced with `onflush={flushText}` (`:4357`); `transcribeActs` no longer
  passed at all.

**New file, `apps/web/src/lib/shane/first-seat.ts`.** One pure function,
`shouldSeatFirstTranscription(pairings, hasScore)`, and its doc comment,
detailed in §3.

**New file, `apps/web/src/lib/shane/first-seat.test.ts`.** Five tests,
detailed in §3.

## 2. Expectation, then the check, for the parts that could be checked

**Expectation, stated before editing `ScoreUploader.svelte`:** moving the
`oningested` call from a button press into the success branch of
`handleFile`, itself shared by both the upload and restore callers, would
either fire `oningested` twice for a restore (once inside `handleFile`,
once again in `onMount`'s own block) or fire it with the wrong origin,
unless the call stayed OUTSIDE `handleFile` and was added explicitly to
each upload-origin caller instead. **Checked by reading `onMount`'s three
lines (`:590-611`) before writing anything**, which confirmed `handleFile`
never knows which caller invoked it or why; `announceArrival` was designed
around that reading, not before it, and the restore path's own logic is
untouched (§1). This is also why `handleFile`'s success branch sets `ui`
and returns, and does not itself call `oningested`.

**Expectation, stated before writing `first-seat.ts`:** the four scenarios
the brief names ("poem after wordless score", "poem after score with
words", "poem edited after placements exist", "no score attached") would
turn out to collapse to three distinct assertions rather than four, because
the wordless/worded distinction decides WHICH seat runs, not WHETHER one
does. **Confirmed while writing the tests**: both "wordless" and "worded"
cases call the predicate with the identical arguments (`{}`, `true`) and
get the identical answer; the test file keeps both as separate `it`s with a
comment explaining why, rather than silently dropping one, so the brief's
own four scenarios are still all visibly accounted for (§3).

## 3. Step 8: the check BEFORE the change, and what it built

**The brief asked to establish, before changing anything, that a poem's
first transcription over an attached score really does reach no seat at
all. Confirmed by reading, not run against a live app:**

- `transcribeText()` (`+page.svelte`) computes `const diff = prevGrid.length
  === 0 ? emptyDiff() : diffWordGrid(prevGrid, nextGrid);`. A first
  transcription has `transcribedGrid` (the previous run) still at its
  initial `[]`, so `prevGrid.length === 0` is true and `diff = emptyDiff()`.
- `emptyDiff()` (`text-diff.ts:52-54`) returns `{ ..., unchanged: true }`,
  and its own doc comment names exactly this case: "the identity diff, for
  a text that did not change and **for a first run**."
- `reseatAcross(diff, prevGrid)`, called two lines later, opens with `if
  (diff.unchanged || !ingestedScore) return;` — so it returns at once, and
  nothing else in `transcribeText()`, before this build, ever called into
  the pairing engine for a poem's first run.

**This is exactly the gap the brief describes, confirmed rather than
assumed.**

**`first-seat.ts`.** `shouldSeatFirstTranscription(pairings, hasScore)`
returns `false` without a score, and otherwise `true` exactly when no
entry in `pairings` has `kind === 'syllable'`. Read literally against the
brief's own wording ("no note holds a syllable yet"), a map holding only
`{ kind: 'melisma' }` or `{ kind: 'empty' }` marks still qualifies as
`true`: neither is a syllable this rule could destroy, and both downstream
seats (`mergeOnUpload`'s `firstPass`, and `seatScoreWords` inside
`seatFilledPoem`) already skip any note that carries a decision of its own,
so an existing melisma mark is never at risk from the seat this predicate
permits. This is pinned by name in the fifth test.

**The five tests, `first-seat.test.ts`, all passing:**

1. Seats a poem over a wordless score (`{}`, `true` → `true`).
2. Seats a poem over a score with its own words, the same way, with a
   comment explaining the two cases share one assertion (§2).
3. Refuses without a score attached (`{}`, `false` → `false`).
4. Refuses once a syllable is already placed, poem edited or not.
5. Still seats when the only decisions present are melisma or empty marks.

**The `+page.svelte` integration itself is untestable, and the memo says so
plainly rather than implying otherwise.** `find apps/web/src/routes
-iname "*.test.*"` returns nothing, the same boundary
`memo-n142-tie-prolongation_r1_2026-09-16.md` §9 and this session's own
`memo-n144-start-over-keeps-the-score_r1_2026-09-16.md` §6 both named. The
integration was checked by reading: `mergeOnUpload`'s own existing tests in
`pairings.test.ts` already prove its `firstPass` branch on a fresh map, and
`score-seat.test.ts` already proves `seatScoreWords`'s two outcomes (full
seat on a match, nothing on a mismatch), so the new block in
`transcribeText()` calls two independently-proven engines behind one new,
independently-proven guard. It was not walked live in a browser.

## 4. Every comment updated in step 7

- `IntakePanel.svelte:62-70` (`ontranscribe` → `onflush`, new doc comment).
- `IntakePanel.svelte:331` block (`handleKeydown`, new comment above it).
- `IntakePanel.svelte:642-643` (replaces "THE ONE TRANSCRIBE" and the
  N.115 fill-predicate comment above the deleted button).
- `IntakePanel.svelte`'s CSS, the "PILL ENDS" comment (button count and
  the `.btn-primary` note, §7).
- `+page.svelte:2320-2334` (`transcribeText`'s own header, the N.108-5
  comment the brief named by name).
- `+page.svelte:2497-2503` (replaces `handleTranscribe` and its header).
- `+page.svelte:3690-3693` (replaces `transcribeActs` and its header, the
  N.115 comment the brief named by name).
- `ScoreUploader.svelte:74-81` (`oningested`'s doc comment).
- `ScoreUploader.svelte:148-156` (`UiState`'s `'arrived'` variant).
- `ScoreUploader.svelte:562-567` (replaces the old `accept()` /
  `hasWaitingScore` / `acceptWaiting` block).
- `ScoreUploader.svelte:604-607` (the restore path's own guard, noting the
  rename and that it does not call `announceArrival`).

## 5. The replace-dialog finding

**Confirmed reachable, and unchanged, by reading rather than by editing
it.** `oningested` is wired in `+page.svelte` (`:4405-4406`) to `(ingested,
file, origin, page) => void handleArrival(ingested, file, origin, page)`.
`handleArrival` (`:3121` on) is untouched by this build: its own recognize
check, `arrivalDecision`, and the `askToReplace`/`pendingArrival` machinery
that shows the replace dialog (`:3065-3090`) all run exactly as they did
before, because they are keyed on the SAME call signature this brief
leaves alone. The only thing that changed is WHAT causes `oningested` to
be called: a singer's press of Continue, before; `announceArrival`, now,
called the instant a parse succeeds. A second score dropped onto a song
that already has one still reaches this exact code, now sooner.

**One consequence named, not asked for by the brief, and worth Dann's
eye.** Before this ship, a singer could look at the read report, decide the
drop was a mistake, and press Try another file, all before the replace
question was ever asked. Now `oningested` fires before the report is ever
read, so the replace dialog can appear immediately under a report the
singer has not yet looked at. This is not a defect against the brief: the
spec's own last line anticipates it exactly, "A wrong drop is undone with
the receipt's Clear or Replace," and DoD 3 asks only that the dialog still
appear, not that it appear at the old moment.

## 6. The i18n keys that became unused

- `input.transcribe` (`i18n.ts:174`, "Transcribe and fit").
- `input.transcribeLoading` (`i18n.ts:175`, "Loading dictionary…").
- `upload.continue` (`i18n.ts:878`, "Continue to analysis").

Checked by grep across `apps/web/src` after every edit: none of the three
has a remaining reference outside `i18n.ts` itself. `upload.tryAnother`
remains used (the `'soon'` and `'error'` states still offer it).
`upload.banner.dismiss` gained a second call site rather than losing one.
None of the three was deleted, per the brief.

## 7. Gate results

| gate | baseline | this run |
|---|---|---|
| phonology | 216 passed (216) | 216 passed (216) |
| dictionary | 235 passed (235) | 235 passed (235) |
| web-check | 0 errors, 7 warnings, 4 files | **0 errors, 8 warnings, 5 files** |
| web-test | 1201 passed (1201) | **1206 passed (1206)** |
| score-parser | 567 passed, 5 skipped (572) | 567 passed, 5 skipped (572), unchanged |

**Web-test moves 1201 → 1206**: the five new `first-seat.test.ts` tests, all
passing, no other test file touched or moved.

**Web-check's warning count moves 7 → 8, one new warning, named and
deliberate rather than accidental:** `IntakePanel.svelte:1182`, "Unused CSS
selector `.btn-primary`." This file's own header states a cross-file rule:
`.action-btn`, `.btn-ghost` and `.btn-primary` are declared identically in
`IntakePanel.svelte`, `RootPanel.svelte`,
`SongList.svelte`, `VoiceAnchor.svelte` and `CalibrationWizard.svelte`,
"change one and change all four." Removing the Transcribe pill leaves
`.btn-primary` with no button in THIS file to style, but deleting the rule
here alone would break that stated four-file twin without checking or
touching the other three, which is out of this brief's scope. **Left in
place on purpose, and named here rather than silently accepted**; a
comment at the CSS rule's old neighbour explains the same reasoning in the
tree. `docs/memory/ENVIRONMENT.md`'s gate table needs the web-test row
moved to 1206 and the web-check row's warning count and file count both
updated before Dann ships; not done here, the desk owns that table per its
own convention.

## 8. What could not be established

- **Whether the fix behaves correctly in a running browser, on an actual
  T05 drop or an actual poem typed after a wordless score.** Neither
  `ScoreUploader.svelte` nor `+page.svelte` carries automated coverage;
  confidence rests on reading (§3, §5) and on the two engines the new code
  calls already being proven by their own existing tests, not on a live
  walk. This is Dann's to walk, per the brief's own DoD 5.
- **Whether the "arrived" panel needs a Dismiss when it holds a fidelity
  banner but no read report** (a plain denigma or webmscore conversion with
  no per-page substitutions to report). The brief's own instruction was
  narrower than this — "Add a Dismiss to the read report if it has none" —
  and that is exactly what was built: the new Dismiss button lives inside
  `.read-report` and is not drawn when `readReport` is null. In that
  narrower case the format line and the banner (which has its own,
  separate dismiss, hiding only the banner) can be left standing with no
  way to clear the whole panel except dropping another file. Not a gap
  against the brief as written; named here because the brief's prose
  ("stay… until the singer dismisses them") reads slightly wider than its
  own instruction, and Dann may want the same control there too.
- **Whether `shouldSeatFirstTranscription`'s choice to seat past an
  existing melisma or empty mark (§3, test 5) is the reading Dann would
  pick.** The brief's own wording supports it ("no note holds a syllable
  yet"), and both downstream seats already refuse to overwrite any existing
  decision regardless, so nothing is at risk either way; this is a
  documented reading of ambiguous wording, not a guess dressed as fact.
- **Whether any song already sitting in a singer's library has a score
  attached with `doc.pairings` entirely free of syllables** (the exact
  state this fix's guard now acts on the next time that song's poem is
  touched). Not counted; no access to any browser's stored library from
  this coding session, the same limit both N.142's and N.144's memos named
  for a related question this session.

## 9. Decisions this brief did not settle, and are reversible

- **`.btn-primary` was left in `IntakePanel.svelte`, unused, rather than
  deleted** (§7). Reversible: deleting it costs one line and the one new
  warning it causes; the reasoning against deleting it is about the stated
  four-file twin, not about any risk in the deletion itself.
- **The Dismiss button was placed only inside `.read-report`, not as a
  panel-wide control**, per the brief's own narrower instruction (§8).
  Reversible: moving it out to cover the banner-only case as well is a
  markup move, not a new mechanism, since `reset()` already clears the
  whole `arrived` state regardless of where the button that calls it sits.
- **`shouldSeatFirstTranscription` refuses on ANY existing decision kind
  it can name a syllable at, but continues past melisma/empty marks**
  (§3, §8). Reversible in one line if Dann wants a stricter "map must be
  wholly empty" reading instead: the four other call sites downstream
  (`mergeOnUpload`, `seatScoreWords`) already refuse per-note regardless,
  so tightening the predicate would only ever make this rule fire LESS
  often, never unsafely.

## Files touched

- `apps/web/src/lib/shane/ScoreUploader.svelte` (tracked, modified)
- `apps/web/src/lib/components/Drawer/IntakePanel.svelte` (tracked, modified)
- `apps/web/src/routes/+page.svelte` (tracked, modified)
- `apps/web/src/lib/shane/first-seat.ts` (new, untracked)
- `apps/web/src/lib/shane/first-seat.test.ts` (new, untracked)
- `docs/sessions/memo-n145-instant-score-arrival_r2_2026-09-16.md` (this
  file, new, untracked)

Not committed and not staged. No git command that writes was run; `git
status --porcelain` and `git --no-pager diff --stat` (both read-only) were
used to confirm the file list above.
