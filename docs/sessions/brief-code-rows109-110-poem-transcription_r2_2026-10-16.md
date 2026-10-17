# Brief: a poem with no score still gets its transcription (row 109), and the singer chooses which witness Text transcribes (row 110, N.186) (r2, 2026-10-16)

Written by the desk (Opus) 2026-10-16 about 20:25; r2 about 21:00. REVIEWED by Fable 20:56, SEND WITH AMENDMENTS (14): `review-fable-brief-rows109-110_r1_2026-10-16.md`. **Apply every amendment in that review; where it differs from the text below, the review wins.** The desk's decisions on its open choices are in section 9. Lane: the cloud session on `cloud-lane-11`, after row 104's string commit, before `cloud-lane-11` merges, so the alias never loses a poem-only transcription.

## 1. What the singer needs

Dann 2026-10-16 20:15, choosing the desk's option 1: *"Ilya was a transcription app first. A singer should absolutely be able to come to ILya with a poem and get a transcription for it. I think after a scan with lyrics has been applied the transcription may change slightly since it will now be tetherer rto lyrics and music notes? BUt a singert camn absolutely use ILya just for a simepl poem trnascription!"* (transcribed as written).

On `cloud-lane-11` today (row 104, report section 8): a singer with no score who drops a photograph or PDF of a poem gets it in Poem only, and Text stays empty, because Text transcribes Lyrics. Before row 104 the same drop filled the one field and Text transcribed it.

## 2. The ruling and the two desk defaults

- **Ruled (Dann 20:15), amending ruling default 9:** a page read as a poem still goes to Poem. When Lyrics is empty and no score is attached, it also fills Lyrics, so Text transcribes it.
- **DESK DEFAULT A (departs from N.134's wording, keeps its reason):** N.134 fills Lyrics from a score's words only into an EMPTY field, because *a singer's own words are never overwritten* (`+page.svelte`, the `fillText` const, about `:2873` on `cloud-lane-11`). A Lyrics that is still word for word the copy of Poem is not the singer's own words, and the poem stays in Poem, so it counts as empty for that fill: a score arriving with words replaces it with the score's sung words. Test of "still the copy": `sameWords(lyrics, poem)` (`apps/web/src/lib/text/same-words.ts`). Condition, because an upload never destroys placements (N.67 step 3, the merge rule beside the fill): only while the song has no placements. A Lyrics the singer has edited is never overwritten.
- **DESK DEFAULT C (added 20:3x, from Dann's 20:25 summary: "Ilya will always accept a text poem as input and dutifully render a transcription in Text tab. NO melody necessary."):** the same holds for a poem typed or pasted in the Poem view. While no score is attached, a Poem edit also writes Lyrics when Lyrics is empty or still the copy of Poem, so Text transcribes the poem whichever view the singer used. Once the singer edits Lyrics, Poem edits no longer reach it. On `cloud-lane-11` a Poem edit seats and transcribes nothing (row 104 report, section 1; `handlePoemEdit`, `+page.svelte` about `:2443`).
- **DESK DEFAULT B:** the drop does not change the view (as row 104 built it), and no string is added or changed. The landed line `intake.view.landedPoem` stays true.

## 3. The work

1. `routePoemPage` (`apps/web/src/lib/text/poem-page.ts`): after the text is put in Poem (both the direct path and the dialog's Replace), when Lyrics is empty and no score is attached, fill Lyrics with the same text through the page's input path, with the arrival kind the poem-page path used before row 104 (read it in `git show 78bfb39:apps/web/src/routes/+page.svelte`, the `onpoem` handler). Keep the function pure of the page: hand it what it needs as deps.
2. The N.134 fill in `+page.svelte`: the empty test becomes "empty, or still the copy of Poem with no placements". Put the predicate in a pure, tested function outside the page.
3. `handlePoemEdit` (`+page.svelte` about `:2443`): DESK DEFAULT C, with the same pure predicate.
4. `+page.svelte` stays at or under 5652 (`scripts/ratchets.json`); move lines out if it must grow.

## 4. Tests (pure, no browser)

a. No score, empty Lyrics, a poem page: Poem and Lyrics both hold its text. b. A score attached: Lyrics untouched. c. Lyrics not empty: Lyrics untouched. d. Lyrics still the copy of Poem, no placements, a score arrives with words: Lyrics becomes the score's words, Poem unchanged. e. Lyrics edited by the singer: not replaced. f. Lyrics the copy but placements exist: not replaced. g. No score, text typed in Poem with Lyrics empty: Lyrics follows, and keeps following while it is the copy. h. After the singer edits Lyrics, a Poem edit leaves Lyrics alone. i. With a score attached, a Poem edit leaves Lyrics alone.

## 5. Measure in headless Chromium, on the singer's path

On a new song: drop the Chromium-made one-page poem PDF row 104 used (polyfill as row 104 did, and say so). Report the words in Poem, the words in Lyrics, and the count of words Text transcribed. Then drop «Within Four Walls» (`apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml`): report Lyrics' word count (row 104 read 39), Poem unchanged, and the seat count.

## 6. Gates and delivery

All eight gates, each number against row 104's string commit. Commit "Row 109: a poem with no score still gets its transcription" on `cloud-lane-11` and push. Report `docs/sessions/report-code-row109-poem-only-transcription_r1_2026-10-16.md`. Do not touch `docs/memory/`.

## 8. Row 110 (N.186): Text transcribes Lyrics by default, or the poem on the singer's choice

Ruled by Dann 2026-10-16 20:37, amending ruling default 7 (`docs/memory/OPEN.md`, "Ruling default 7 AMENDED"): *"Lyrics should be the default in Text's transcription output. BUt the user needs a means to say 'Um, I'd just like a trasncription of the poem, even without the text repeats in lyrics, even including the mnissing text the composer didn't set.'"*

What the singer does and sees: in Text, the same pair as Input's, Poem | Lyrics, same order, same ratified labels (`intake.view.poem`, `intake.view.lyrics`), Lyrics selected on every open. The pair is drawn only when Poem holds text whose words differ from Lyrics (`sameWords`); otherwise there is nothing to choose. Choosing Poem shows the transcription of the published poem whole: its own lines, no repeats, and the words the song does not set, greyed as Input's Poem view greys them (`--ink-tertiary`, the same alignment). Choosing Lyrics returns to today's Text.

Constraints, each a DESK DEFAULT: Markup, the seats, and Insights read Lyrics as now and never the poem. Text prints what it shows (`docs/memory/PRODUCT.md`, "WYSIWYG means what it says"). The choice is remembered per song for the session, beside Input's view memory (`apps/web/src/lib/text/input-views.svelte.ts`), and not stored. No new string in the app. The Guide paragraph waits for Dann's ruling on the desk's draft and is not part of this run unless the desk sends it.

The poem enters the transcription where Lyrics enters it, at the first step, so every automatic step Lyrics gets (the old-spelling normalizer, ё, the stress dictionary, syllabification, word boundaries) runs on the poem too. Dann 2026-10-16 20:41: *"swapping in text without that filtering leads to disappintment."* Name each step the poem passes through in the report, with its file and line.

The singer's marks: stress, the ё toggles, syllable boundaries, spot reconstitutions, and glosses are keyed by Lyrics' `"lineIndex-wordIndex"` (`apps/web/src/lib/word-reset.ts:9-17` on `cloud-lane-11`), which the poem's lines and words do not share. DESK DEFAULT: each mark carries to the poem's word that the alignment pairs with its Lyrics word (`poem-compare.ts`, as Input uses it), and a poem word with no partner shows the engine's own reading. Marking a word while Text shows the poem: DESK DEFAULT, not offered in this slice; the poem's transcription shows marks and takes none, and the report names how Text shows that.

Measure first, before writing: name the component and lines where Text gets its text today, and say whether a second transcription can run beside the first without a second engine instance; report the time to transcribe the poem of «Within Four Walls» in headless Chromium. Then build. Tests: the pair absent with no Poem and when Poem equals Lyrics; Lyrics on open; Poem shows every poem word once, in the poem's lines, unset words greyed; switching back restores Lyrics' transcription unchanged; the seats unchanged across a switch.

## 7. What I could not establish

Every report carries this section. NOT ESTABLISHED beats a complete invented answer.

## 9. The desk's decisions on the review (each a DESK DEFAULT)

- Amendments 1 to 6, 9 to 11: taken as written.
- Amendment 7: taken. "No score attached" means no score, or a score that carries no words (`noLyricsFile !== null`), with its test.
- Amendment 8: taken. Clearing Poem leaves Lyrics and its transcription.
- Amendment 12: extract one `ViewPair.svelte` used by Input's pair and Text's; DeskHead's pair stays as it is in this run. The per-word grey flag on `Paper` and `VerseLine` is allowed.
- Amendment 13: time row 104's test text (built from the file's own words), and say so; no published poem is in the tree.
- Amendment 14: row 109 first, its own gates, commit "Row 109: a poem with no score still gets its transcription"; then row 110, its own gates, commit "Row 110: the singer chooses which witness Text transcribes (N.186)"; one report with a section for each, `docs/sessions/report-code-rows109-110_r1_2026-10-16.md`. Push `cloud-lane-11` after each commit.
- The review's string question (a no-score variant of `intake.view.poemLine`): not in this run; held for Dann.
