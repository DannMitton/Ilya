# Brief: MELODY prints every verse (strophic lane A of five)

This brief is the desk's. Do not edit, rename, or replace it.

r3, 2026-11-12, written by the desk (Opus). r1 (`brief-code-strophic-reprint-and-repeats_r1_2026-11-12.md`) covered five lanes; Fable's review of r1 (verdict HOLD) split it, and Dann ruled lane A for the share and lanes B to E after it (`OPEN.md`, THE CONTROL AUDIT'S SPLIT, 01:44). r2 was lane A only. This r3 applies all twelve amendments of Fable's review of r2 (`review-fable-strophic-lane-a-r2_r1_2026-11-12.md`, SEND WITH AMENDMENTS, read at `e41e5c8`). Fable sizes lane A at 2 Code sessions, 3 if a walk finds a fix round (judgement, not timed).

Citations: Fable read every line at `Shane` `e41e5c8`. After lane 50 merges, `page-layout.ts:254`, `:446`, and `:455` read `:264`, `:456`, and `:465`; step 0 re-reads every line. The rulings of 2026-11-12 12:58, 13:21, and 13:22 are in `OPEN.md` on `Shane` from the ship that precedes this lane's cut.

## Lane

- Branch `cloud-lane-51`, cut from `Shane` at the commit the desk names when it starts the lane (after lanes 48 and 50 ship). Commit and push only that branch. Never `Shane` or `main`. No pull request.
- **This lane is A of five. It prints verses. It changes no pairing, no stored record, no selection, and nothing in the Loupe.**
- Take every "before" reading first. Read old code with `git show <sha>:<path>`. No `git stash`, `checkout` of files, `reset`, or `restore`.
- Report after each step in `docs/sessions/report-code-strophic-a-step<N>_r1_<date>.md`: what changed (file and line), tests added, gate counts, screenshots where the step draws, and "What I could not establish". NOT ESTABLISHED beats a complete invented answer.
- **Ratchets.** Fable, at `e41e5c8`: `MarkupPane.svelte` 1362 of 1364, `Loupe.svelte` 3012 of 3012. On lane 50 at `65e1ceb`: `staff-renderer.ts` 3409 with its ceiling still written as 3427, `types.ts` 1000, `page-layout.ts` 477. Step 0 re-measures. **This lane edits neither `staff-renderer.ts` nor `vowel-resolver.ts` nor `types.ts`.** Extract before adding; never raise a ceiling without saying so in the step report.

## What the singer gets

- **Every verse the score carries is printed in MELODY, each with its own words, IPA, and marks.** Every verse's pitch-and-vowel pairs are on the page.
- **Each later verse reprints the whole song, shared bars included.** Ruled by Dann 2026-11-12 01:45: "Let Ilya be of service to the user. If we try to get cute with notation conventions I believe we fail in that mission." No bar is printed once for all verses.
- **Each verse after the first starts on a new system,** under the label "Verse 2" / « Couplet 2 ». There is no forced page break (DESK DEFAULT under the same ruling). Verses flow system to system across pages.
- **Bar numbers stay the printed ones.** At each later system start in a verse, the bar number carries a verse tag: "12 · verse 2" / « 12 · couplet 2 » (ratified by Dann 2026-11-12 12:58; full word, no abbreviation). The number stays where it is drawn today and `data-bar-number` keeps the bare number (`staff-renderer.ts:2240-2244`). The tag is added at the page-layout seam on later verses' systems, not in `staff-renderer.ts`. No ink of the number or its tag falls left of the system's left edge (x below 0 in the system's own viewBox); a test asserts it and the 390 px screenshot shows it. The bracketed courtesy number after a long rest (`:2605-2609`) takes no tag.
- **A song with one verse looks exactly as it does today.**
- Later verses are printed but not yet tappable (lane B makes them correctable).

## Rulings that bind this lane

- D3, ruled by Dann in E.36 (2026-08-10): *"we need each verse to receive its own set of pitches to interact with its own vowels. ... The reason we unpack strophic text is because that text varies. Unvaried text just needs to be printed once regardless of how many times the same text would be repeated temporally."* Job A (reprint the notated score per verse) is this lane. Job B (flattening repeats) is declined. N.20 (`OPEN.md:2686`).
- 2026-11-12 01:45 (above): every later verse reprints the whole song.
- 2026-11-12 01:05 (`OPEN.md:3712-3713`) and 12:58: bar numbers and verse strings, as above.
- CONTRACT §8: "Do not delete `analyzePerVerse`; N.20 is built on it." "Do not unspool a repeat whose text does not vary." "Do not change `VocalLineEvent`."
- CONTRACT §0.1: one vowel per note, and a sung note that is not a continuation and carries no syllable is a mistake. This applies in every verse's copy.
- 2026-11-12 13:21 (Dann): "We serve the user. We ground our practice in established authorities and cite them scrupulously." 13:22: Ilya produces study editions, not performance editions.

## Design (DESK DEFAULT unless marked ruled)

0. **A verse's copy is drawn from a verse view.** Add to `packages/score-parser/src/verses.ts` one pure function that returns the score as verse N sings it: on each sung note, `syllable` is verse N's entry (its text and type, `verseNumber` 1, no `versesInfo`, no `verses`); in a one-line bar it is verse 1's syllable; anywhere else that verse N has no entry, the note has no syllable (a continuation, as `vowel-resolver.ts:270-277` treats it today). A one-line bar is a bar in which no note carries any verse's words but verse 1's. Every later verse's words, IPA, vowels, marks, and widths are computed from its view with today's verse-1 code. `vowel-resolver.ts` is not edited, and verse 1 never passes through a view. Where a bar carries some later verse's words but not verse N's, verse N is left as today and the step report lists the bars. Tests on the strophic fixture.
1. **Verses come from the score.** `sungVerseNumbers` (`verses.ts:22-34`) decides them, with one change: a lyric line whose syllables carry no Cyrillic letter is not a verse (the sunless fixtures carry IPA as `<lyric number="2">`, `sunless-01-engraved.musicxml:89-92`; a singing translation printed as a second line is dropped the same way). If no line carries a Cyrillic letter, the result is as today (the rule never empties the list). Later verses are printed only when the list starts with verse 1; otherwise MELODY prints as today and the step report says so. Labels and `data-verse` count sung verses in order, so a file with words on lines 1 and 3 and IPA on line 2 prints "Verse 2" for line 3.
2. **Pagination flows verses.** `paginateScore` (`page-layout.ts:254`) is divided into two stages: systems for one verse, and systems stacked onto pages. Verse 2 opens on the next system after verse 1 ends, with the verse label above it; `data-score-page` (`:446`) runs on across verses; only page 1 takes the shorter first-page window (`bottomOf`, `:262`; `page1WindowHeight`, `MarkupPane.svelte:797`, `:858`); `lastPage` (`page-layout.ts:461`; `MarkupPane.svelte:887-888`) is the last verse's, so the notes after the music follow the last verse. `paginateScore` keeps its signature and its output; it becomes the one-verse case of a new exported entry that takes a list of verses, each with its own score (the view), analysis, and render options, since the IPA and Cyrillic channels ride in the options (`MarkupPane.svelte:869-873`) and `sliceWidth` packs with them (`page-layout.ts:280`). The short-last-system rule (`:375-402`) stays in the stacking stage: its fill test applies to each verse's last system, its alone-on-the-final-page test to the song's last system only. The final barline (`:300`) goes on the last verse's last system only; earlier verses close with an ordinary barline (the tree's rule at `:292-293`; Dann 01:05). The verse label's text arrives as an option; its height is added above the verse's first system as part of that system's own height, so the two cannot part at a page foot, and it carries a `data-verse-label` handle. Label type: the underlay's size (`CYR_FONT_SIZE`), upright, starting at the system's left edge. Byte-identity is tested against a baseline: before step 3 changes any code, commit a file of one hash per tracked `.musicxml` (under `apps/`, `docs/`, `tools/`, and `packages/`) of `paginateScore`'s pages at `markup-pages.test.ts`'s geometry, taken on the lane's base commit; the test recomputes and compares. `markup-pages.test.ts` keeps its meaning (every bar on exactly one page).
3. **Later verses' systems are marked and made inert at the page-layout seam. Verse 1's are never changed.** A system of verse 2 or later carries `data-verse="N"` and `data-verse-system="from-to"` in place of `data-system`, and inside it `data-hit`, `data-event-id`, `data-of-event`, and `data-ipa-of` are renamed with a `data-verse-` prefix (precedent: `Loupe.svelte:1131-1141`). Verse 1's wrapper keeps `data-system` and gains nothing; the absence of `data-verse` is verse 1. So every existing lookup and every `[data-system]` sweep (`Loupe.svelte:1044`, `:1055-1058`, `loupe-ink.ts:199`) sees verse 1 only, and "system 2 of 5" (`Loupe.svelte:1996-1997`) still counts verse 1's systems. N is the verse's place among the sung verses (2, 3, ...), not the file's lyric number. Lane 50's grace notes use the same attribute names, so the rename covers them.
4. **Each verse's copy is built the way verse 1's is.** For each later verse, from its view: `buildUnderlayResolvers(view, 1, { openSyllabification })`; `resolveAdvice(analyzeScore(scoreInPerformanceOrder(view).score, adapted.snapshot, resolvers.vowel))` (the two steps verse 1 takes at `MarkupPane.svelte:591-592` and `:731-735`); the IPA channel through `applyNotationPreferences` as at `:648`; the withheld set; the modern-spelling Cyrillic. No pairings, no blanks, no transcribed lines. This lives in a new module under `apps/web/src/lib/markup/`, with its own tests; `MarkupPane.svelte` only calls it. The legend's conditions (`:807-808`) read every verse's analysis and withheld set. Verse 1 keeps today's live path unchanged. `analyzePerVerse` is left in place, untouched (lane C extends it).
5. **Strings.** `markup.verseLabel` "Verse %s" / « Couplet %s »; the bar-number tag "%m · verse %v" / « %m · couplet %v ». Both ratified 2026-11-12 12:58; pin them in `ratified-lines.test.ts`.

## Interim limits, said once in the final report

- A later verse's IPA comes from the score's words through the fallback pipeline (`vowel-resolver.ts:471-477`), with the singer's spelling settings but without Lyrics edits or hand pairings.
- Lyrics shows verse 1 only. INSIGHTS, the watch list, and phonation totals read verse 1 only (lane C).
- Repeat signs, voltas, and jump marks are not drawn, as today (`staff-renderer.ts` holds no `repeatStart`, `repeatEnd`, or volta drawing); the bars under both endings of a volta print in every verse's copy (lane D).
- Stress acutes show in verse 1 only: they are drawn from pairings (`pairings.ts:844`), and a later verse has none (lane B).
- A later verse that holds one syllable through a whole bar which verse 1 sets to words takes verse 1's words in that bar.
- A verse that ends in a new key is followed by a verse whose first system states the opening key at its head, with no courtesy signature at the verse's end. The screenshots show whether that reads well.
- Later verses cannot be tapped (lane B).

## Steps

### Step 0. Read and measure

Run all eight gates and record each count. Run `node scripts/ratchets.mjs` and record the line count of every file named in the ratchet line. Re-read every line this brief cites and report any that has moved. List every lookup of `data-hit`, `data-event-id`, `data-of-event`, and `data-ipa-of` in non-test code (Fable counted 48 at `dc078b95`: `Loupe.svelte` 20, `selection-ring.ts` 11, `loupe-ink.ts` 7, `loupe.ts` 4, `loupe-hold.ts` 3, `crossing-ring.ts` 2, `MarkupPane.svelte` 1, `+page.svelte` 1), and `Loupe.svelte:514`; read the `data-hit` family lines in `TimeSignatureControls.svelte` and `system-ground.ts`, which that list does not name. List every document-wide or container-wide read of `[data-system]` (Fable: `Loupe.svelte:1044`, `:1055-1058`, `loupe-ink.ts:199`) and every `closest('[data-system]')`. Confirm that each of these sees verse 1 only once later verses carry the renamed attributes and `data-verse-system`. On a two-line test score, establish what verse 1's copy draws today under a note where verse 1 holds a slur and verse 2 sings a syllable (`staff-renderer.ts:3149` reads the note's own syllable, which there is verse 2's, `musicxml-parser.ts:823-831`); report it, and change nothing. Establish whether the scan reader can return more than one verse. Record the byte baseline of design 2 and commit it. Change no code.

### Step 1. Fixture

Add `packages/score-parser/src/fixtures/strophic-three-verses.musicxml`: eight bars; three `<lyric number>` verses of Cyrillic words in bars 1 to 6; bars 7 and 8 with one line of words only (a refrain, verse 1's lyric number). Bars 1, 2, 5, and 6 carry exactly one syllable per sung note in every verse. Bar 3: verse 1 sings two syllables on two notes that verse 2 sings as one syllable (verse 2's second note carries no verse-2 lyric). Bar 4: the reverse (verse 1 holds one syllable over two notes; verse 2 sings two). No note carries two syllables of one verse (not designed; lane E). Its source in a head comment. The fixture is outside `markup-pages.test.ts`'s walk, which reads `apps/`, `docs/`, and `tools/` only (`:61`); that is intended. Add a smoke test that it parses with three sung verses.

### Step 2. Verses known (design 0 and 1)

The no-Cyrillic rule in `sungVerseNumbers` and the verse view in `verses.ts`, with tests. In `packages/score-parser`: the strophic fixture gives three verses; in verses 2 and 3, bars 7 and 8 carry verse 1's syllables; in verse 2, bar 3's second note has no syllable and bar 4's two notes each have one; no sung note in any view is without a syllable except a continuation. In `apps/web` (the sunless fixtures live in `apps/web/src/lib/score/ingestion/fixtures/`): both sunless fixtures give one verse. `vowel-resolver.ts` shows no diff.

### Step 3. Pagination flows verses (design 2 and 3)

Divide `paginateScore`; flow verses; the label and the bar-number tag; `data-verse` and `data-verse-system` on later verses' systems; the attribute rename. Tests: the byte baseline holds for every tracked score; the strophic fixture's verse 2 opens on a new system with its label; `data-score-page` runs on; `lastPage` is the last verse's; only the last verse's last system draws the final barline; no `data-hit` and no `data-system` exist in a later verse; no tag ink falls left of a system's left edge.

### Step 4. Each verse drawn from its own copy (design 4)

The new module under `apps/web/src/lib/markup/`; MELODY's later-verse systems carry that verse's words, IPA, and marks; the legend reads every verse. Tests on the strophic fixture: the three verses' syllables under bar 1 differ as the file has them; the vowel mark on bar 1's first note follows each verse's own vowel; words and IPA under every later-verse note come from the same syllable.

### Step 5. Close

Merge `Shane`, run all eight gates and the Playwright suite (desktop and phone), and write the final report: the counts, the interim limits above, and screenshots of the strophic fixture in MELODY at desktop width and 390 px, English and French, with a printed PDF of it.

## Computations this lane changes (CONTRACT §4)

- Which verses are sung (`sungVerseNumbers`): a lyric line with no Cyrillic letter stops counting as a verse. Its one non-test caller is `analyze-per-verse.ts:42` (Fable); step 0 names every caller and what depended on the old count.
- Pagination runs per verse and stacks across verses; `sliceWidth` and the render must still agree; one-verse output is byte-identical against the committed baseline.

## What the desk could not establish

- The text of `claude/e37-numbering-ruled_2026-08-10.md` (N.20's numbering record); only `OPEN.md:2686` summarises it.
- Whether the scan reader returns more than one verse (step 0).
- What verse 1's copy draws today under a note where verse 1 holds a slur and verse 2 sings (step 0).
- Whether the bar-number tag clips at a system's left edge (step 3's test).
- How the browser breaks MELODY's sheets when printing.
