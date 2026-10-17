# Review: brief for rows 109 and 110 (Fable, r1, 2026-10-16)

Reviewer: Fable, a subagent of the desk (Opus), 2026-10-16 20:43 to 20:56, against `cloud-lane-11` at `6836250` and the brief r1 `brief-code-row109-poem-only-transcription_r1_2026-10-16.md`. Cost: 137,554 tokens, against the desk's stated worst case of 100k. Transcribed by the desk from the agent's return, unedited below this line.

VERDICT: SEND WITH AMENDMENTS (14)

## Amendments

1. **Section 3 item 1, the arrival kind.** Name it: the old `onpoem` handler was `onpoem={(text) => handleInput(text)}` (`git show 78bfb39:apps/web/src/routes/+page.svelte`, line 4088), so the kind was `handleInput`'s default `'paste'` (`apps/web/src/routes/+page.svelte:2433` on `cloud-lane-11`; `TextArrival` at `apps/web/src/lib/one-action.ts:44-50`). Write `'paste'` in the brief so Code does not read the old tree.

2. **Section 3 item 1, "still the copy" on Replace.** `routePoemPage`'s dialog path replaces a Poem that already holds text (`poem-page.ts:27-34`), so Lyrics at that moment is the copy of the OLD poem (`held`), never of the new text. The predicate must compare Lyrics against `held` before `put` runs, or Replace leaves Lyrics holding the old poem while Poem holds the new one. State it: "Lyrics is empty, or `sameWords(lyrics, held)` with no placements."

3. **Section 3 item 3, the same for a Poem keystroke.** `handlePoemEdit` assigns `doc.publishedPoem = text` (`+page.svelte:2443-2446`). Under C the predicate compares Lyrics with the Poem's previous value, captured before the assignment, not with the keystroke's new text. Say so, and give the pure function the signature `(lyrics, poemBefore, placementCount)`.

4. **Section 3 item 3, the arrival kind on a Poem edit.** `onpoemedit` is `(text: string) => void` (`IntakeViews.svelte:57`, called at `:191`); `oninput` carries `arrivalOf(e)` (`:183-192`), `'typing'` or `'paste'`. Widen `onpoemedit` to carry the same `TextArrival`, so a keystroke in Poem reaches Lyrics as `'typing'` (the quiet timer) and a paste as `'paste'`. Without it every keystroke transcribes at once.

5. **Section 2, name the two facts in code.** "No score attached" is `ingestedScore === null` (`+page.svelte:348`; set null by `handleClearScore`, `:2172-2173`). "No placements" is `Object.keys(doc.pairings).length === 0` (`:2417`, `:2937`). Code should not reach for `doc.source` (`document.svelte.ts:139`), which `handleClearScore` also clears but which lags the uploader's restore.

6. **Section 2 default A, the restore gate.** Say the predicate sits inside the existing `origin === 'upload'` test (`+page.svelte:2876-2877`) and that gate is unchanged, so a restored song whose Lyrics equals its Poem is not refilled on boot (the 2026-09-14 reason, `:2866-2874`). Reload is covered: `publishedPoem` is stored (row 104 report, section 2, `library.ts:132`), so after a reload the copy still reads as the copy and no new state is needed.

7. **Section 2, a case the brief misses: a score with no words.** `noLyrics` (`+page.svelte:2839-2840`) is a score attached whose words come from Lyrics (`mergeOnUpload`'s `scoreCarriesNoLyrics` branch is `firstPass`'s only caller, `:2887-2889`). Under the ruling's literal "no score attached", a singer with a wordless score who drops a poem page gets Poem filled, Lyrics empty, nothing seated, Text empty. DESK DEFAULT I recommend, departing from the wording and keeping his reason: "no score attached, or a score that carries no words" (`noLyricsFile !== null`, `:357`). Add a test: wordless score attached, poem page, Lyrics follows and seats.

8. **Section 2, the Clear buttons.** Clear on Lyrics (`handleClear`, `:2138-2155`) empties `doc.inputText` and leaves Poem; the next Poem edit under C refills it, which is right. Clear on Poem is `onclearpoem={() => (doc.publishedPoem = '')}` (`:4030`), not `handlePoemEdit`; afterwards `sameWords('', lyrics)` is false and Lyrics reads as the singer's own, so a later score's words no longer replace it. DESK DEFAULT: clearing Poem leaves Lyrics and its transcription (he came for a transcription), and the brief says so. Add test: Poem cleared, Lyrics unchanged.

9. **Section 8, where Text gets its text.** `runPipeline` calls `processText(doc.inputText, …)` (`+page.svelte:1849-1856`); `lines` (`:253`) feeds `textLines` (`:437`), `effectiveLines` (`:1786-1791`), and `<Paper lines={effectiveLines} …>` (`:4414`) and `ReadingAid` (`:4443-4445`). A second transcription beside the first needs no second engine: `GraysonEngine` is a module-level const (`packages/phonology/src/engine.ts:187`), `processText` is a pure function (`pipeline.ts:268-279`), and `derivedLines` (`+page.svelte:423-435`) already runs one beside `lines`. Write these in the brief so Code's "measure first" is a confirmation, not a search. Print: `handlePrint` is `window.print()` (`:2204`) and `Paper` prints what it holds (`Paper.svelte:62`), so the switch must feed the one `Paper` the poem's lines, not mount a second `Paper`.

10. **Section 8, the carry-over rule is not buildable as written.** `comparePoem`'s `pairs` are indices into whitespace tokens that keep punctuation-only tokens (`poem-compare.ts:57-58`, `tokenize` at `:99-112`); the pipeline drops punctuation-only tokens and expands hyphenated particles (`pipeline.ts:214-222`), so token index is not `wordIndex`. Specify the bridge: map each non-punctuation token to the pipeline word of the same line by order; a token `expandHyphenatedParticles` splits carries nothing (reported). Stress and ё are INPUTS to `processText` (`pipeline.ts:301-310`), so Code builds poem-keyed copies of those two maps and passes them; syllables, spot, and glosses are display-time (`+page.svelte:1786-1788`, `VerseLine.svelte:30`). The ё key carries a char index (`word-reset.ts:9`, `+page.svelte:2297`), and `fold` reads ё as е and modernises spelling (`poem-compare.ts:16-25`), so carry ё only where the two raw tokens are equal strings. Never write the Lyrics-keyed maps.

11. **Section 8, "takes none".** `onwordclick` on `Paper` is optional (`Paper.svelte:22`); pass none while Text shows the poem, so no word selects and the inspector's writes (`+page.svelte:2255-2327`) have no target. One line, and it is how Text shows it.

12. **Section 8, the pair markup.** No shared pair component exists: `IntakeViews.svelte:221-237` and `DeskHead.svelte:113-116` each carry their own `.pair` and `.pair-member` CSS (`IntakeViews.svelte:295-330`, `DeskHead.svelte:193-260`). A third copy or an extracted `ViewPair.svelte` is Code's choice; say which (I recommend extracting, since `+page.svelte` has four lines of headroom, 5648 of 5652, `scripts/ratchets.json:8`, and Text's pair must live in a component). Greying needs a per-word flag on `Paper` and `VerseLine`, a new prop; name it as allowed.

13. **Section 8, the poem to time.** The repo holds the score (`sunless-01-engraved.musicxml`) and no published poem for it; row 104 built a test text from the file's own words (report section 1). Say which text Code times, or that Dann supplies the poem.

14. **Structure.** Section 8 precedes section 7; section 6 names gates, commit, and report for row 109 only. Reorder, and give row 110 its own commit ("Row 110: …"), its own gate run, and a report section, or a second report.

## Taste or ruling questions for Dann

One, optional; the brief can ship without it under default B. The Poem view's standing line `intake.view.poemLine` reads "The sung words come from your score; edit them in Lyrics." Under C with no score, a Poem edit also writes Lyrics and no score exists. Whether a no-score variant is wanted is a new string, EN and FR, so his. Nothing else: the rest is reversible.

## What I could not establish

- The time to transcribe the poem in headless Chromium: not measured here; the brief leaves it to Code.
- Whether `--ink-tertiary` survives print CSS as grey: not read this session.
- Whether a poem page can arrive during the `pendingArrival` window (`+page.svelte:2466`): not traced.
- The e2e test that pinned row 104's measures (`e2e-phone/input-views.test.ts`) is not in the sparse checkout; whether its PDF polyfill is reusable is not read.
