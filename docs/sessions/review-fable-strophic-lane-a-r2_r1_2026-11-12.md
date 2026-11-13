# Review: brief-code-strophic-lane-a_r2_2026-11-12.md

r1, 2026-11-12, Fable. Read-only. Read in full this session: the r2 brief, my r1 review, `page-layout.ts`, `verses.ts`, `markup-pages.test.ts`, lane 50's diff of `page-layout.ts`. Read in part: `vowel-resolver.ts`, `MarkupPane.svelte`, `staff-renderer.ts`, `Loupe.svelte`, `loupe.ts`, `loupe-ink.ts`, `selection-ring.ts`, `pairings.ts`, `musicxml-parser.ts`, `types.ts`, `OPEN.md`, `CONTRACT.md`, lane 50's `grace-draw.ts` and `staff-renderer.ts` diff headers. Every code line cited is from `/home/claude/review-shane` at `e41e5c8` unless it says "lane 50" (`origin/cloud-lane-50`, `65e1ceb`).

Terms I coined: "verse view" (a copy of the score in which each note carries one verse's syllable as its own), "one-line bar" (a bar in which no note carries any verse's words but verse 1's). "Verse's copy" is the brief's.

## Verdict

**SEND WITH AMENDMENTS.** Twelve amendments. The lane's shape is right and the split holds. Three of the design points do not work as written, and each has a contained repair:

1. **Design 0 and 4 would print verse 1's words under verse 2's IPA.** The words under a note are drawn from the note's own syllable, which is verse 1's (`staff-renderer.ts:3149`), and neither the resolver nor the analysis carries words. Repair: a verse view (amendment 1).
2. **Design 3 breaks the Loupe's "system 2 of 5" on any song with more than one verse,** and contradicts design 2's byte-identity. Repair: amendment 3.
3. **Design 0's note-level rule prints a wrong word wherever a later verse slurs two notes that verse 1 sings as two syllables.** Repair: a bar-level rule (amendment 1).

No question for Dann. Every open choice here is reversible and is marked DESK DEFAULT.

## Size

**2 Code sessions; 3 if a walk finds a fix round.** My r1 figure was 1 to 2. It moves up for three reasons read this session: `MarkupPane.svelte` is at 1362 of 1364 (`scripts/ratchets.json`), so the verse wiring needs a new module and an extraction first; the label, the bar-number tag, and the short-last-system rule each touch the stacking half of `paginateScore` (`page-layout.ts:313-402`); and the byte-identity test needs a baseline recorded before the change. The range is my judgement; no lane of this kind has been timed.

## 1. Amendments from r1

| r1 amendment | in r2 | finding |
|---|---|---|
| 1 (split; lane line) | Applied, verbatim | Sound |
| 2 (`data-verse` on the wrapper; rename) | Applied | Two faults, section 3.3 |
| 3 (flow; divide `paginateScore`) | Applied | Sound; four gaps, section 3.2 |
| 4 (decision 0) | Applied as design 0 | Wrong place and wrong grain, section 3.1 |
| 10 (step 0 lookup list, ratchets) | Applied | Add the `[data-system]` sweeps, amendment 9 |
| 11 (ratchet line) | Applied | Numbers move after lane 50, amendment 12 |
| 13 (transcribe the 01:05 ruling) | Done in the tree: `OPEN.md:3712` | The 12:58, 13:21, and 13:22 rulings are not in the tree, amendment 11 |
| 14 (drifted citations) | The four drifted lines are lane B to E matter and are gone from r2 | r2 carries two loose lines of my own, section 2 |

**Leaving 5 to 9, 12, and 15 to later lanes is sound, with one carry-over.** 5 and 6 are pairings and seating (lane B). 7 is Lyrics and the receipt line (B and E). 9 is lane D. 12 is met: r2 leaves the split-note bar out and says so. 15 does not apply. **Amendment 8 is lane C, except for one clause that lane A needs:** the marks on a later verse's copy have to come from the same two steps verse 1's do, the performance-order score and `resolveAdvice` (`MarkupPane.svelte:591-592`, `:731-735`). Design 4 names neither. Amendment 2.

## 2. Citations in r2

| citation | finding |
|---|---|
| `page-layout.ts:254` (`paginateScore`) | Confirmed. Lane 50: `:264` |
| `page-layout.ts:446` (`data-score-page`) | Confirmed. Lane 50: `:456` |
| `page-layout.ts:455` (`data-system`) | Confirmed. Lane 50: `:465` |
| `MarkupPane.svelte:797`, `:858` (`page1WindowHeight`) | Confirmed. Unchanged by lane 50 (no diff to the file) |
| `MarkupPane.svelte:887-888` (`lastPage`) | Confirmed |
| `verses.ts:22-34` | Confirmed |
| `vowel-resolver.ts:210-221` (`verseSyllableOf`) | Confirmed |
| `vowel-resolver.ts:268-276` | Loose, and the error is mine from r1: the continuation branch is `:270-277` (`:268` is the rest branch's `continue`) |
| `vowel-resolver.ts:472-476` | Loose: `collectScoreWords` is `:471`, `processText` `:476`, the fallback read `:477`. Cite `:471-477` |
| `Loupe.svelte:1131-1141` (rename precedent) | Confirmed (comment `:1131-1136`, code `:1137-1141`) |
| `Loupe.svelte:514` | Confirmed |
| `OPEN.md:2686` (N.20) | Confirmed |
| `OPEN.md`, RULED 2026-11-12 01:05 | Confirmed, `:3712-3713` |
| `OPEN.md`, THE CONTROL AUDIT'S SPLIT, 01:44 | Confirmed, `:3720`, `:3725` |
| 01:45 ruling | Confirmed, `OPEN.md:3727` |
| `OPEN.md`, STROPHIC VERSE LABELS (12:58) | NOT in the tree at `e41e5c8`, nor in `origin/Shane`, `cloud-lane-48`, `-49`, or `-50` |
| 13:21 ruling ("We serve the user...") | NOT in the tree at `e41e5c8` |
| CONTRACT §8, both quotations | Confirmed: "Do not unspool" at `:148`; the `analyzePerVerse` sentence at `:147` (matched by grep this session) |
| CONTRACT §0.1 | Confirmed, `:9-11` |
| The 48 lookups | My r1 count. A looser grep today finds more lines and two files not in the list: `TimeSignatureControls.svelte` (3 lines) and `system-ground.ts` (1 line). Whether those are lookups or comments is NOT ESTABLISHED; step 0 reads them |
| "all eight gates" | Confirmed as the ship script's count since 2026-09-27, `ENVIRONMENT.md:649` |
| Fixture path `packages/score-parser/src/fixtures/` | The folder exists. The sunless fixtures are elsewhere: `apps/web/src/lib/score/ingestion/fixtures/` |
| sunless lyric 2 is IPA | Confirmed: `sunless-01-engraved.musicxml:89-92` (`<lyric name="verse" number="2">`, text `ˈko`) |

No file the brief cites differs between `dc078b95` and `e41e5c8` (`git diff --stat` over `vowel-resolver.ts`, `page-layout.ts`, `verses.ts`, `MarkupPane.svelte`, `Loupe.svelte`, `staff-renderer.ts` is empty).

## 3. The design against the code

### 3.1 Design 0: where the one-line rule goes

**It does not go in the resolver.** Three facts:

- The resolver gives a verse its IPA and its vowel only (`UnderlayResolvers`, `vowel-resolver.ts:380-405`). The words under the note are drawn by the renderer from the note's own syllable: `options.cyrPreview?.[ev.id] ?? syl?.text` (`staff-renderer.ts:3149`), and the same read decides hyphens, extenders, and widths at `:1015-1018`, `:1028`, `:2380-2383`, `:2429`, `:3168`.
- The note's own syllable is the lowest verse's (`musicxml-parser.ts:823-831`), so on every note that carries two lines it is verse 1's text.
- So with design 0 in the resolver and design 4 as written, verse 2's copy draws verse 1's words over verse 2's IPA on every multi-line note. That is the false pair §0.1 forbids, on most of the page.

**Where it goes: a verse view, in `packages/score-parser/src/verses.ts`** (34 lines, no ratchet). One pure function returns the score with each note's `syllable` replaced by verse N's entry (text and type, `verseNumber` 1, no `versesInfo`), or by verse 1's on a one-line bar, or removed where verse N holds a continuation. Everything downstream is then today's verse-1 code, run on the view: `buildUnderlayResolvers(view, 1, ...)`, `scoreInPerformanceOrder(view)`, `analyzeScore`, `sliceWidth`, the renderer. Consequences:

- **Verse 1's live path is untouched by construction.** Verse 1 never passes through the view, and `vowel-resolver.ts` is not edited at all.
- **§0.1 holds by construction.** Words, IPA, vowel, marks, and widths all read the same syllable on the same note.
- It changes no type (`CONTRACT.md:147`, "Do not change `VocalLineEvent`").

**The grain: the bar, not the note.** r2's rule is "a note whose only syllable is verse 1's takes that syllable in every later verse". A note where verse 2 holds a slur over two notes that verse 1 sings as two syllables is exactly such a note: it carries verse 1's line only. The note-level rule would insert verse 1's second syllable into the middle of verse 2's word. Differing slurs between verses are ordinary in strophic song (my inference from repertoire, not from the tree), and today's code already handles them correctly as a continuation (`vowel-resolver.ts:270-277`). The bar-level rule keeps that: verse 1's words carry into a later verse only in a one-line bar. Its known failure, to be said in the report: a later verse that holds one syllable through a whole bar that verse 1 sets to words would take verse 1's words there.

**Not covered, and to be reported, not guessed:** a bar that carries verse 2's words but not verse 3's. Lane A leaves verse 3 as today (a continuation).

**A pre-existing fault that lane A makes visible.** On a note where verse 1 holds a slur and verse 2 sings a syllable, the note's own syllable is verse 2's (`types.ts:755-758`; `musicxml-parser.ts:823-831`). Verse 1's copy reads `syl?.text` (`staff-renderer.ts:3149`), so it would draw verse 2's syllable there unless a pairing or a blank covers that note. Whether one does is NOT ESTABLISHED. Step 0 establishes it on the fixture (amendments 7 and 9).

### 3.2 Design 2: dividing `paginateScore`

What works as written:

- **The page 1 window.** `bottomOf` already gives page 1 the short window and every later page the tall one (`page-layout.ts:262`). One stacking run over all verses' systems gets this with no new code.
- **`lastPage`** is set from the last page group (`:461`), so it is the last verse's with no new code.
- **Lane 50 does not touch the body of `paginateScore`.** Its diff of `page-layout.ts` is 20 lines: three imports, `graceNotes` in `sliceScore`, `keyCourtesyRoom` in `sliceWidth`, and a `courtesy` flag and an outgoing key in `renderSystemSlice`. The division meets none of them; only line numbers move, by 10. A verse's last system ends on the last bar, so it draws no courtesy signature, and a verse's first system opens at bar 0 with no carried accidentals, as today (`renderSystemSlice`, `:240`).

Four gaps:

1. **Each verse needs its own render options, not only its own analysis.** The IPA, the withheld set, and the modern-spelling Cyrillic reach the renderer inside `options` (`MarkupPane.svelte:869-873`), and `sliceWidth` packs with them (`page-layout.ts:280`). So "systems for one verse" takes that verse's score, analysis, and options, and system breaks may differ from verse to verse.
2. **The short-last-system rule sits between the two stages.** It re-renders the piece's last system after pages are assigned, because one of its two tests is "alone on the final page" (`:375-402`, `:387`). A clean cut at "systems, then pages" either loses that test or breaks byte-identity. The rule stays in the stacking stage. DESK DEFAULT for verses: the fill test applies to each verse's last system; the aloneness test to the song's last only.
3. **The final barline.** `finalBarline: i === ranges.length - 1` (`:300`) would close every verse's copy with the thin-plus-thick barline. The tree's own comment says "Only the slice that ends the piece gets Gould r96's final barline" (`:292-293`), and Dann confirmed the last-system rule at 01:05 (`OPEN.md:3714`). DESK DEFAULT: the last verse's last system only.
4. **The label needs room, and must not be left alone at a page foot.** `page-layout.ts` holds no strings and no page furniture (`:16-18`). DESK DEFAULT: the label's text arrives as an option, and its height is added to the headroom of the verse's first system, so label and system are one unit to the stacker.

**Byte-identity needs a baseline.** No test today pins `paginateScore`'s bytes; `markup-pages.test.ts` pins bar coverage only (`:81-95`), and it walks `apps/`, `docs/`, and `tools/`, not `packages/` (`:61`), so the new fixture is outside it. The baseline has to be recorded from the unchanged code on the lane's base commit (after lane 50, whose changes move bytes) and committed before step 3 edits anything.

### 3.3 Design 3: the attribute rename

The rename works for the four attributes named. Checked this session:

- The page's tap handler matches `[data-hit]` (`MarkupPane.svelte:315-318`); a renamed rectangle is inert.
- `hitsFor` finds by `[data-hit="id"]` (`loupe.ts:66`); verse 1 only.
- `pageMetrics` skips a system with no `[data-hit]` (`loupe-ink.ts:208-209`); later verses fall out.
- No stylesheet rule is keyed on any of the four, or on `data-system` (grep of `.svelte` and `.css` for `:global([data-...` finds none).
- Lane 50's grace notes use the same names (`data-event-id`, `data-hit`, `data-of-event`; lane 50 `grace-draw.ts:135-136`, `:145`), so the same rename covers them.

Two faults:

1. **`data-system` is swept document-wide, and the brief leaves it on later verses.** `Loupe.svelte:1055-1058` collects every `[data-system]` in the paper into `ranges`; `:1996-1997` reads `systems: ranges.length`; `:2175` and `:2189` print it as "system %s of %t". A three-verse song of five systems would read "system 2 of 15". The same sweep feeds `:1044` (the ring band) and `loupe-ink.ts:199`. That is a Loupe change in a lane that promises none. Repair: later verses' wrappers carry `data-verse-system` in place of `data-system`.
2. **`data-verse="1"` on verse 1's wrappers breaks design 2's byte-identity.** Design 3 says the system wrapper "gains `data-verse="N"`"; a one-verse song's wrappers would gain `data-verse="1"`. Repair: verse 1's wrapper is never changed; the attribute's absence is verse 1.

### 3.4 Design 4: per-verse analysis

"Run the existing `analyzeScore` with that verse's resolver" is two steps short of what verse 1 gets. Verse 1's marks are `resolveAdvice(analyzeScore(analysisScore, adapted.snapshot, vowelResolver))`, on the performance-order score (`MarkupPane.svelte:591-592`, `:731-735`). Without both, the same vowel on the same pitch could carry different marks in verse 1 and verse 2. Four more things verse 1 has that a later verse needs or must be said to lack:

- **The singer's spelling switches and open syllables.** Verse 1's IPA passes through `applyNotationPreferences` (`:648`) and `openSyllabification` (`:607`). These are the singer's settings, not hand edits; a later verse takes them, or its IPA is spelled differently from verse 1's on the same page.
- **Stress acutes.** They are drawn from pairings (`pairings.ts:844` returns the text unchanged with no pairing map; called at `MarkupPane.svelte:692-696`). A later verse has no pairings, so it shows none. An interim limit, to be said.
- **The legend.** Its withheld and hollow-head entries read verse 1's analysis only (`MarkupPane.svelte:807-808`). A later verse can draw a siglum the legend does not explain.
- **`analyzePerVerse`** runs on the notated score with no advice pass (`analyze-per-verse.ts:42-45`). Lane A leaves it in place and unused, which keeps §8. Its only caller of `sungVerseNumbers` (`:42`) is the one non-test caller in the tree.

### 3.5 The bar-number tag

The number is drawn inside the renderer, centred on the clef with `text-anchor="middle"` (`staff-renderer.ts:2243-2258`; lane 50 `:2194-2197`), at 12.5 px italic (`:1088`, `:1144-1148`), and the clef stands one stave-space in from the system's left edge (`:814`). "12 · verse 2" centred there extends left of the clef; whether it crosses the system's left edge is NOT ESTABLISHED (not measured). The system is a nested `<svg>` with its own viewBox (`page-layout.ts:455`), which clips what falls outside it (SVG's default; my knowledge, not read in the tree). The first system of a verse draws no number (`:2246`, `measureOffset > 0`), which agrees with the 01:05 ruling ("at each later system start in that verse"). `data-bar-number` "always carries the bare number" (`:2240-2242`); the tag must leave that so.

## 4. Amendments

Replacement text is quoted. All are DESK DEFAULT unless the brief already marks the point ruled.

**1. Design 0, replace the whole item with:**

> 0. **A verse's copy is drawn from a verse view.** Add to `packages/score-parser/src/verses.ts` one pure function that returns the score as verse N sings it: on each sung note, `syllable` is verse N's entry (its text and type, `verseNumber` 1, no `versesInfo`, no `verses`); in a one-line bar it is verse 1's syllable; anywhere else that verse N has no entry, the note has no syllable (a continuation, as `vowel-resolver.ts:270-277` treats it today). A one-line bar is a bar in which no note carries any verse's words but verse 1's. Every later verse's words, IPA, vowels, marks, and widths are computed from its view with today's verse-1 code. `vowel-resolver.ts` is not edited, and verse 1 never passes through a view. Where a bar carries some later verse's words but not verse N's, verse N is left as today and the step report lists the bars. Tests on the strophic fixture.

**2. Design 4, replace the whole item with:**

> 4. **Each verse's copy is built the way verse 1's is.** For each later verse, from its view: `buildUnderlayResolvers(view, 1, { openSyllabification })`; `resolveAdvice(analyzeScore(scoreInPerformanceOrder(view).score, adapted.snapshot, resolvers.vowel))` (the two steps verse 1 takes at `MarkupPane.svelte:591-592` and `:731-735`); the IPA channel through `applyNotationPreferences` as at `:648`; the withheld set; the modern-spelling Cyrillic. No pairings, no blanks, no transcribed lines. This lives in a new module under `apps/web/src/lib/markup/`, with its own tests; `MarkupPane.svelte` (1362 of 1364) only calls it. The legend's conditions (`:807-808`) read every verse's analysis and withheld set. Verse 1 keeps today's live path unchanged. `analyzePerVerse` is left in place, untouched (lane C extends it).

**3. Design 3, replace the whole item with:**

> 3. **Later verses' systems are marked and made inert at the page-layout seam. Verse 1's are never changed.** A system of verse 2 or later carries `data-verse="N"` and `data-verse-system="from-to"` in place of `data-system`, and inside it `data-hit`, `data-event-id`, `data-of-event`, and `data-ipa-of` are renamed with a `data-verse-` prefix (precedent: `Loupe.svelte:1131-1141`). Verse 1's wrapper keeps `data-system` and gains nothing; the absence of `data-verse` is verse 1. So every existing lookup and every `[data-system]` sweep (`Loupe.svelte:1044`, `:1055-1058`, `loupe-ink.ts:199`) sees verse 1 only, and "system 2 of 5" (`Loupe.svelte:1996-1997`) still counts verse 1's systems. N is the verse's place among the sung verses (2, 3, ...), not the file's lyric number.

**4. Design 2, add after its last sentence:**

> `paginateScore` keeps its signature and its output; it becomes the one-verse case of a new exported entry that takes a list of verses, each with its own score (the view), analysis, and render options, since the IPA and Cyrillic channels ride in the options (`MarkupPane.svelte:869-873`) and `sliceWidth` packs with them. The short-last-system rule (`page-layout.ts:375-402`) stays in the stacking stage: its fill test applies to each verse's last system, its alone-on-the-final-page test to the song's last system only. The final barline (`:300`) goes on the last verse's last system only; earlier verses close with an ordinary barline (the tree's rule at `:292-293`). The verse label's text arrives as an option; its height is added above the verse's first system as part of that system's own height, so the two cannot part at a page foot, and it carries a `data-verse-label` handle. Label type: the underlay's size (`CYR_FONT_SIZE`), upright, starting at the system's left edge. Byte-identity is tested against a baseline: before step 3 changes any code, commit a file of one hash per tracked `.musicxml` (under `apps/`, `docs/`, `tools/`, and `packages/`) of `paginateScore`'s pages at `markup-pages.test.ts`'s geometry, taken on the lane's base commit; the test recomputes and compares.

**5. "What the singer gets", bar numbers bullet, add:**

> The number stays where it is drawn today and `data-bar-number` keeps the bare number (`staff-renderer.ts:2240-2244`). The tag is added at the page-layout seam on later verses' systems, not in `staff-renderer.ts`. No ink of the number or its tag falls left of the system's left edge (x below 0 in the system's own viewBox); a test asserts it and the 390 px screenshot shows it. The bracketed courtesy number after a long rest (`:2605-2609`) takes no tag.

**6. Design 1, add after its last sentence:**

> If no line carries a Cyrillic letter, the result is as today (the rule never empties the list). Later verses are printed only when the list starts with verse 1; otherwise MELODY prints as today and the step report says so. Labels and `data-verse` count sung verses in order, so a file with words on lines 1 and 3 and IPA on line 2 prints "Verse 2" for line 3.

**7. Step 1, replace the fixture sentence beginning "Every verse carries exactly one syllable" with:**

> Bars 1, 2, 5, and 6 carry exactly one syllable per sung note in every verse. Bar 3: verse 1 sings two syllables on two notes that verse 2 sings as one syllable (verse 2's second note carries no verse-2 lyric). Bar 4: the reverse (verse 1 holds one syllable over two notes; verse 2 sings two). No note carries two syllables of one verse (not designed; lane E). The fixture is outside `markup-pages.test.ts`'s walk, which reads `apps/`, `docs/`, and `tools/` only (`:61`); that is intended.

**8. Step 2, replace the whole body with:**

> The no-Cyrillic rule in `sungVerseNumbers` and the verse view in `verses.ts`, with tests. In `packages/score-parser`: the strophic fixture gives three verses; in verses 2 and 3, bars 7 and 8 carry verse 1's syllables; in verse 2, bar 3's second note has no syllable and bar 4's two notes each have one; no sung note in any view is without a syllable except a continuation. In `apps/web` (the sunless fixtures live in `apps/web/src/lib/score/ingestion/fixtures/`): both sunless fixtures give one verse. `vowel-resolver.ts` shows no diff.

**9. Step 0, add:**

> List every document-wide or container-wide read of `[data-system]` (found by Fable at `e41e5c8`: `Loupe.svelte:1044`, `:1055-1058`, `loupe-ink.ts:199`) and every `closest('[data-system]')`, and confirm that each sees verse 1 only once later verses carry `data-verse-system`. Read the `data-hit` family lines in `TimeSignatureControls.svelte` and `system-ground.ts`, which Fable's r1 list does not name. On a two-line test score, establish what verse 1's copy draws today under a note where verse 1 holds a slur and verse 2 sings a syllable (`staff-renderer.ts:3149` reads the note's own syllable, which there is verse 2's, `musicxml-parser.ts:823-831`); report it, and change nothing. Record the byte baseline of amendment 4.

**10. Interim limits, replace the third bullet and add two:**

> - Repeat signs, voltas, and jump marks are not drawn, as today (`staff-renderer.ts` holds no `repeatStart`, `repeatEnd`, or volta drawing); the bars under both endings of a volta print in every verse's copy (lane D).
> - Stress acutes show in verse 1 only: they are drawn from pairings (`pairings.ts:844`), and a later verse has none (lane B).
> - A later verse that holds one syllable through a whole bar which verse 1 sets to words takes verse 1's words in that bar.

**11. Header and rulings, correct and add:**

> `vowel-resolver.ts:268-276` reads `:270-277`; `:472-476` reads `:471-477`. After lane 50 merges, `page-layout.ts:254`, `:446`, and `:455` read `:264`, `:456`, and `:465`. The rulings of 2026-11-12 12:58 (the verse label and bar-number tag strings, both languages), 13:21, and 13:22 are transcribed into `OPEN.md` with Dann's words before the lane is cut; at `e41e5c8` none of the three is in the tree.

**12. Ratchets line, replace "(Fable, at `dc078b95`; step 0 re-measures)" with:**

> (Fable, at `e41e5c8`: `MarkupPane.svelte` 1362 of 1364, `Loupe.svelte` 3012 of 3012. On lane 50 at `65e1ceb`: `staff-renderer.ts` 3409 with its ceiling still written as 3427, `types.ts` 1000, `page-layout.ts` 477. Step 0 re-measures.) This lane edits neither `staff-renderer.ts` nor `vowel-resolver.ts` nor `types.ts`.

## 5. Lane 50 against design 2 and 3

- `page-layout.ts`: no conflict with the division; section 3.2. `renderSystemSlice` gains an optional `courtesy` flag that only the Loupe sets (lane 50 `loupe-render.ts`), so the paginator's calls are unchanged in shape.
- `staff-renderer.ts`: lane 50 rewrites large parts (361 lines changed) and brings the file down to 3409. With amendments 1 and 5, lane A does not edit this file, so there is nothing to meet.
- Grace notes: covered by the rename (section 3.3). They ride in `parsed.graceNotes` (lane 50 `page-layout.ts`, `sliceScore`), which a verse view carries through unchanged since it replaces syllables only.
- Key changes: a verse that ends in a new key is followed by a verse whose first system states the opening key at its head, since every system draws its own signature (`page-layout.ts:18-19`). No courtesy signature is drawn at the verse's end, because `outgoingKeyAfter` looks at the bar after the system's last and there is none. Whether that reads well is for the screenshots; lane 50's `key-changes.musicxml` has one verse, so no fixture shows it.
- Lane 50 adds `[data-key-change]` to three Loupe-side selectors (`Loupe.svelte`, `loupe-ink.ts`), all scoped to a system or a clone; no new document-wide lookup.

## What I could not establish

- The text of the 12:58, 13:21, and 13:22 rulings. They are in the brief and in the task I was given; no tree I can read holds them.
- Whether verse 1's copy draws another verse's syllable today on a note where verse 1 holds a slur (section 3.1). I read the path; I did not run it.
- Whether the tagged bar number would be clipped at the system's left edge. I read the anchor, the size, and the clef's position; I did not measure the text.
- Whether the nested system `<svg>` clips in the app as SVG's default says; no `overflow` setting was searched for.
- Whether a system's width packing differs enough between verses to change system breaks in practice.
- How often a later verse differs from verse 1 in its slurs, and how often a file carries a third line that is neither a verse nor IPA. My remarks on repertoire are inference.
- Whether the scan reader returns more than one verse (the brief's step 0 item; not traced).
- How the browser breaks MELODY's sheets in print with a label above a system.
- Whether the two extra files in the lookup grep (`TimeSignatureControls.svelte`, `system-ground.ts`) hold lookups or comments.
- Whether Gould says anything on barlines between written-out verses. The final-barline default rests on the tree's own comment (`page-layout.ts:292-293`), not on a page of Gould read this session.
- The session count is judgement.
