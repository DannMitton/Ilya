# Report: N.192 and N.187, step 7 (close), r1, 2026-11-12

Lane `cloud-lane-50`, cut from `Shane` at `b1234cf4`. `Shane` (`b2d4ef8e`, docs only beyond the cut: the strophic brief, its review and scout packet, the desk's close) merged into the lane with no conflict. Nothing was pushed to `Shane` or `main`, and no pull request was opened.

## The gates, against step 0

| Gate | Step 0 (at the cut) | Step 7 (lane tip, `Shane` merged) |
|---|---|---|
| phonology | 456 passed | 456 passed |
| dictionary | 248 passed | 248 passed |
| blurb | 168 passed | 168 passed |
| score-parser | 785 passed, 5 skipped (790) | 838 passed, 5 skipped (843) (+53) |
| web | 5190 passed, 1 skipped (5191) | 5231 passed, 1 skipped (5232) (+41) |
| integration | 155 passed | 155 passed |
| svelte-check | 0 errors, 12 warnings | 0 errors, 12 warnings |
| ratchets | OK | OK |

I could not read the ship script's own numbering (it is on the maintainer's Mac), so the gates are named by command: `pnpm --filter <pkg> test` for the first four and for web, `pnpm exec vitest run --config vitest.config.ts` for integration, `svelte-check`, `node scripts/ratchets.mjs`. The desk moves its baselines: the two that moved are score-parser and web, as above.

## The Playwright suite, desktop and phone, and what is not mine

Desktop (`--project=chromium`): 162 passed, 1 skipped, 11 failed. Phone (`--project=phone`): 28 passed, 1 skipped, 6 failed on the first full run.

**One was mine, and is fixed.** The Grace note cell's accessible name in a gap, "Add a grace note before the next note" (the desk's draft), contained "next note", and `loupe-scan.test.ts` (phone, two tests) finds the Loupe's arrow with `getByRole('button', { name: 'Next note' })`, a substring match, so it resolved to two buttons and failed on strict mode. I changed the draft to "Add a grace note before the note that follows" (English only; the French slot still holds the same English, pending Dann). Both tests pass again. This is a change to a desk draft; Dann may rule another wording, and should know a name that contains "next note" or "previous note" collides with that test.

**The rest I compared against `Shane` at `b2d4ef8e`, a clean worktree of the untouched tree** (a separate worktree, since removed, with the same dependencies and a dev server of its own), running the failing files there:
- Fail identically on the untouched tree (so not this lane's): desktop `glue-typed-marks` (2), `heic-fallback`, `insights-page:95`, `loupe-header:47` (the drag), `pages-without-gaps:227`, `print-pages:20`, `singer-paths:169`; phone `input-views:134`, `phrase-ends:26`, `relining:70` and `:95`.
- `heic-reader-path.test.ts` (desktop, 3 tests, each waits for the reader's loading text): I ran "(a) the lossless staff page" on the untouched tree and it fails the same way. I did NOT run "(c) the grey photo-like page" or "a HEIC poem" there; they fail with the same family of messages, but that is an inference, not a measurement.
Count of the 17 first-run failures (11 desktop, 6 phone): 13 fail identically on the untouched tree (8 desktop and 4 phone in the list above, plus `heic-reader-path` (a)); 2 were mine (the two phone `loupe-scan` tests) and are fixed; 2 are not measured on the untouched tree (`heic-reader-path` (c) and the HEIC poem test), and I infer, without measuring, that they fail for the same reason as (a). The lane adds no failing test that I know of; those two are the gap.

## Strings added, all PENDING DANN

Built with the English drafts; the French slot of each holds the same English (no French invented), in two contiguous blocks in `apps/web/src/lib/i18n.ts` after `loupe.rest` (one place to merge beside lane 48's changes), and the hand-written key index at the head of the file is updated (1,240 keys; `correct.` +10, `loupe.` +8).
- Grace notes: `loupe.grace` "Grace note"; `correct.graceAdd` "Add a grace note before the note that follows" (changed from the brief's draft, see above); `correct.graceMake` "Make this a grace note"; `correct.graceFull` "Make this a full note again"; `loupe.graceSlash` "Slash"; `correct.graceSlash` "Add or remove the slash on this grace note"; `loupe.undo.graceAdded` "grace note added"; `loupe.undo.grace` "grace note changed"; `loupe.undo.graceSlash` "slash changed". The brief's `loupe.graceAdd` and `correct.grace` were dropped, as Fable's amendment 8 says (two cells; three accessible names by state).
- Key card: `loupe.keySignature` "Key signature"; `correct.keyChange` "Change the key from this bar"; `correct.keyToNext` "To the next key change"; `correct.keyToEnd` "To the end of the song"; `correct.keyFollow` "The notes follow the new key"; `correct.keyFollowHelp` "A note with no accidental of its own takes the new key's sharp or flat. Turn this off to keep every pitch as it is."; `correct.keyRemove` "Remove this key change"; `loupe.undo.keyChanged` "key changed"; `loupe.undo.keyRemoved` "key change removed". The fifteen signatures use the upload question's existing, ratified `upload.ask.key*` strings.
- Owed to Dann: the English and the French of all of these; the French term for a grace note (« appoggiature », « petite note », or another); and, in one line, that the 2026-11-05 00:19 ruling's "force this option manually" is met here by turning a grace note into a full note.

## Dann's three questions in Fable's review: DESK DEFAULTS built, none answered in the brief

(1) Two grace cells, not three. (2) A light double barline before a key change; a scan's lone grace note draws slashed; every grace note draws its slur to its principal. (3) English drafts as above.

## Ratchet ceilings

No ceiling was raised or moved, and `ratchets.json` is unchanged. Headroom made: `staff-renderer.ts` 3409 of 3427 (the accidental rule moved out to `accidental-carry.ts`, 149 lines, before any line was added), `musicxml-parser.ts` 1164 of 1167 (the grace branch is shorter and its code is in `grace.ts`). The desk may lower those two. At their ceilings and not past them: `types.ts` 1000 of 1000 (one line, `graceNotes?`), `Loupe.svelte` 3012 of 3012 (two in-place edits, no line added), `CorrectionSurface.svelte` 1227 of 1227 (its four lines of room, exactly), `+page.svelte` 5527 of 5534.

## What I built, in files

New: `packages/score-parser/src/`: `grace.ts`, `grace-draw.ts`, `key-change.ts`, `accidental-carry.ts`, and their tests, and `fixtures/key-changes.musicxml`, `fixtures/grace-notes.musicxml`. `apps/web/src/lib/score/`: `grace-layer.ts`, `grace-verbs.ts`, `key-signature.ts`, `key-signature-ui.svelte.ts`, `GraceCells.svelte`, `KeySignatureCard.svelte`, and tests. Playwright: `e2e/key-change-melody`, `e2e/grace-corrections`, `e2e/key-signature-card`, and the three phone twins.

## Departures from the brief, stated once

1. The grace slur is drawn in `grace-draw.ts`, not through the slur planner (step 4).
2. At a system that ends before a change of key, the system carries the courtesy signature past its closing barline, departing from the 2026-08-06 "ends at its barline" ruling at such a system only (step 3).
3. The Key signature cell shares `GraceCells.svelte`, because `CorrectionSurface.svelte` had no line of room (step 6b).
4. The `correct.graceAdd` draft was reworded (above).

## What I could not establish

- Whether a scan marks a printed natural as `<alter>0</alter>` (step 0): no page with one was available. 'Follow' is built with the known harm tagged in its file.
- Row 114's grace-note and natural counts (the truth files are not in this clone).
- Gould's rule for the barline and the courtesy at a key change (p. 152 is not in the tree): every figure there is tagged JUDGEMENT in `key-change.ts`.
- Whether a saved song with grace-note or key corrections reloads with them: the corrections are ordinary `NoteCorrection` records the library already saves, but I did not run a save-and-reload in the browser. NOT ESTABLISHED.
- Print: nothing printed in this lane, and no print was checked for the new marks.
- French, in the app and in screenshots.
- A grace note before the first note of a system at 390 px sits under the page's own clef control and cannot be tapped there (step 6). The page's hit rectangles at that width are 4.5 to 8 px wide; the Loupe is where a singer works.
