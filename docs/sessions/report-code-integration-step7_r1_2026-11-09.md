# Report: integration step 7, Fable's amendments for lanes 34 and 35 (7a to 7g), 2026-11-09

Branch `cloud-lane-38`. One commit per item: 7a `e207d440`, 7b `cbb35d0e`, 7c `4f8c7415`, 7d `922e9ed7`, 7e `be73cc68` (and `lower the ceiling`), 7f `ba239d29`, 7g `f30cb8c5`; the e2e follow-ups in one commit after them. Nothing pushed to `Shane` or `main`; no pull request; `docs/memory/` untouched. The decisions are the desk's (DESK DEFAULT), as the message says.

## 7a. Row 181 fill across a melisma note (`text/poem-join.svelte.ts`)

- **What was wrong, read in the code:** `poem-join-wire.ts` skips melisma notes when it counts a run's open notes, so a run whose open notes straddle a melisma note passes the count; `reseatByDiff` (`score/reseat.ts`, the slot loop) puts each slot at the anchor plus one and counts a slot `unseated` where that note already holds a pairing. So the receipt would say 2 filled while one note stayed blank.
- **When the reseat runs** (the brief asked me to say): `setLyrics` is the page's `handleInput(text, 'paste')`; a paste's `transcribeVerdict` is `now` once the dictionary has loaded (`state().ready` requires it), so `transcribeText` and then `reseatAcross` (`reseatByDiff`) run synchronously before `setLyrics` returns. I read this in `+page.svelte` (`transcribeText`, `reseatAcross`), not by running the page.
- **The fix:** after `deps.setLyrics(...)` in `PoemJoin.run` and in `fillBar`, `#checkSeated` reads the page's state again, maps tokens with `tokenMapReport`, and counts the syllable pairings whose origin word is one of the written tokens. Fewer than the syllables written: `revert()` and one console line, `[ilya] poem join: reverted (bar N): 2 syllable(s) written, 1 seated, a note was left blank`. Where the transcription has not caught up (the token map fails), nothing can be counted: the join is kept and the console says `not checked (bar N)`. The header comment states all this.
- **The test (`poem-join.svelte.test.ts`):** the rig's `setLyrics` now runs the real `reseatByDiff` on a queue of one slot per vowel (a rig change, not only an added case), with the notes seated by queue index. The 15 existing tests pass on it after I replaced the old rig's hand-written seats (which had a melisma inside «шумного» and origins of `x`) with realistic ones; the old fixture would have been reverted by the new check, because a repair after a melisma note is the same failure. New (+3): the brief's case reverts and names the bar; the same without a melisma is kept (2 seats written, 4 syllable pairings in all); a transcription that has not caught up is kept and says so.
- **A change from the brief's case, to say plainly:** the brief inserts «три четыре» between «раз» and «два». «Четыре» has three syllables, so four slots cannot pass a count of two open notes and the run would be refused before the reseat. I inserted «три пять» (one syllable each), which is what makes the count pass and the reseat fail.
- **Consequence for the page:** a repair of a word that follows a melisma note will also be reverted (the fixture I replaced showed it). That is the check working, but it means such joins now do nothing on a song with a melisma before the repaired word. NOT measured on a real song.

## 7b. The join runs only on a song read from a scan

The page's `state()` (via `joinDeps`, 7e) returns null unless the score carries words and `loupePrint.hasScan()` holds: the scan's kept reading has a band. `hasScan` is the Loupe's own test (`score/loupe-print.svelte.ts`), which covers a scan just dropped (`dropped`) and a stored one (`restoreSource.reading.bands`). The header at the old `:10` now says it. A test (`text/poem-join-gate.test.ts`) reads the page source for the gate, and the wiring test (7e) runs the null cases. **Consequence:** a scan read before bands were kept (no `bands` in its reading) is not joined until it is read again; I did not count how many singers that is.

## 7c. The long dash ends the word (`omr/underlay-tokens.ts`)

A hyphen-only box wider than half the ink height now has text `''` and keeps `longDash: true` and its box. The comment cites `report-desk-row181-c-drop_r1_2026-11-05.md` and the desk's counts as that report gives them: 385 for the split (arm S) against 376 for the joint, on row 114's first file, control 369. (The report says one capture per arm and calls two systems' differences NOT ESTABLISHED; the desk's message says songs 2 and 5 were captured three times, identical; I cite both.) Tests moved (3): `underlay-tokens.test.ts` ×2 and `underlay-page.test.ts` ×1 now expect an empty mark, flagged long, and a word split at the dash while a hyphen still sews. `?extender=a|b` still reads the box and the flag (`underlay-extender.ts:52,57`), not the text, so it still counts the dashes. **Not measured by me:** the 385; I took it from the report and the desk.

## 7d. `crossCheck` carries `by` (`text/poem-join.ts`)

The second pass passes `by` through: a written token is `'poem'`; every other token keeps the `by` of the token it was before the edit (a fill inserts tokens, so a later token's index shifts back by the fills before it; a repair replaces one token with one). With no `by`, written tokens are `'poem'` and the rest `'print'`. Test (+1): a hand word the first pass leaves alone is no fault; the same test fails against the old `by: undefined` (I ran it with the file reverted: red; restored: green). **The index shift for a fill before a hand word is not separately tested** (I could not build a case that fills and leaves the hand word unrepaired within a small fixture); it is reasoned from the code.

## 7e. The attach builders moved (`score/loupe-print-wiring.ts`)

`joinDeps` and `printDeps` are the page's two inline argument expressions, unchanged in logic, with a lend interface each. The page's `attach` line now calls them (still one line; `+page.svelte` is 5534 lines, unchanged by this item), and two imports left it (`firstNoteOfBar`, `barsOf`). `loupe-print-wiring.test.ts` (+5) runs them: the join's state for a scan and its three nulls; the print's scan (pdf or image by name, none without bands); the bars to check; `openAt` with the wall down or no note. I **lowered the `+page.svelte` ceiling 5549 to 5534**, its line count (steps 2 and 4 had freed the room; the ceiling was never lowered). The `poem-join-gate` test (7b) now checks the page calls `joinDeps` with the `hasScan` gate.

## 7f. A silent strip becomes a console line (`score/loupe-print.svelte.ts`)

Both silent paths resolve to null through one `lost(...)`, which prints `[ilya] print strip: page P, bar B: the scan page could not be rendered` or `... the band could not be cut from the page`. The brief cited `:127` and `:132`; I put the line at the two `null` returns of the strip's promise (the render's own `.catch(() => null)` still resolves to null and is named at the next step). Test (+1) checks both lines, once each.

## 7g. Lane 35's bar key (`library/library.ts`, `score/bar-answers.ts`)

`validateRecord` and `copyBarAnswers` write each bar's key as `String(Number(key))`; `answeredBars` keeps one answer per bar index, the later entry in the field's own order winning (an integer-like key such as "7" comes before "007" in object order, so "007" is the later; I state it in the comments); `withBarAnswer` drops other spellings of the bar it answers. Tests (+4): "007" and "7" load as one bar; the copy writes the canonical key; `answeredBars` lists one; `withBarAnswer` replaces both spellings.

## Gates (baseline on Shane, then at the final code, `53f05d7b`)

See the gate table in the final summary (`report-code-integration-step6_r1_2026-11-09.md`, updated); web unit moved from 4679 (after 5d) to 4694 here: 7a +3, 7b +1, 7d +1, 7e +5, 7f +1, 7g +4 (sum 15). Web check, ratchets, and the other packages did not move.

## Playwright, both projects, after this step

`pnpm exec playwright test --project=chromium --project=phone --trace off`, Chromium `/opt/pw-browsers/chromium`, run on `e207d440`...`f30cb8c5`'s tree (the commit with the ceiling), then the two specs I changed run again on the final tree. First full run: **155 passed, 16 failed, 2 skipped** (37.7 min). After the fixes below, the two changed specs pass (`typed-hyphens` 1 of 1; `insights-key-lines` 15 of 15); the rest were not re-run, since no source changed.

| Red test in the first run | Red on Shane? | Cause / status |
|---|---|---|
| `glue-typed-marks.test.ts:29` and `:39` (chromium) | yes | as step 1 |
| `heic-reader-path.test.ts:111` | yes | as step 1 |
| `insights-page.test.ts:95` | yes | as step 1 (the lane's report also found it red on the cut) |
| `loupe-header.test.ts:47` | yes | as step 1 |
| `print-pages.test.ts:20` | yes | as step 1 |
| `singer-paths.test.ts:169` | yes | as step 1 |
| phone `input-views.test.ts:134` | yes | as step 1 |
| phone `phrase-ends.test.ts:26` | yes | as step 1 |
| phone `relining.test.ts:70` ("y.") | yes | as step 1 |
| phone `relining.test.ts:95` ("bb.") | yes | **fails at the same assertion on Shane and here** (`:108`, the lines of Lyrics, `[7,7,7,7,7,4]`). The assertion this branch's pause is meant to satisfy, `:106` (no rebuild of Text while the poem is typed), **passes here and on Shane** |
| `insights-key-lines.test.ts:96`, `:105` (desktop and phone: four tests) | spec not on Shane | **new from step 5.** The stricter key rule: `BASS_B1` now gets "No better key" and no line (was one group), `BASS_B2` two lines (was three). I rewrote those two tests to the new states (15 of 15 pass); there is no voice among the six that gives exactly one line, so no "one group" test remains. The "more groups than the cap" test (BARITONE, three lines and a reveal) still passes |
| `typed-hyphens.test.ts:26` | **no (green on Shane)** | **new from step 4.** Bisected: green at `ddb29c01` (row 172's five commits), red at my step 4 pause commits. The spec fills a restored song's Poem field and reads the Inspector at once; with the pause TEXT still shows the old poem for 600 ms, so the Inspector read the old word. I changed the spec to wait for the page to show the new text before it clicks (one assertion added). It passes. **This is the pause doing what the desk ruled; the one-pause staleness is a visible cost.** |

**Newly green:** the three phone tests of `text-witness.test.ts` (`:153`, `:193`, `:204`), which were red on Shane and in step 1, now pass (row 172 rewrote them).

## What a singer would now see (steps 5b to 7)

- **Guide:** the HEIC licence and patent sentences in the Licences section (5b).
- **INSIGHTS, Further reading:** a topic shared by the whole list prints once (5c).
- **LEARN, the letter-name table:** «и краткое» and «и десятеричное» have their first word; «гэ» uses the inventory's ɡ; nine other names follow the engine (5d). One of them, «мягкий знак», reads `[ˈmʲɑk kɨj ˈznɑk]` and I doubt it.
- **A scan joined to a poem:** the join runs only on a song read from a scan with a kept reading (7b); it takes itself back, with a console line naming the bar, when a melisma note leaves a syllable without a note (7a); it does not call a hand-typed word a fault (7d). On a scan's printed words the long dash splits a word again (7c). The Loupe's missing print is named in the console (7f).
- **Corrections slice 3:** nothing visible (7g).

## What I could not establish

- **7a on a real song,** how often a repair or fill is now reverted; and **7c's counts,** which I did not measure.
- **That "bb" can be made green by this row's pause:** it still fails at its second assertion, on Shane too.
- **The remaining 11 reds' causes** (step 1).
- **The 7d index shift** for a fill before a hand word.
