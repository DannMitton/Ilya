# Brief: MELODY unfolds a strophic song continuously (strophic lane A of five)

This brief is the desk's. Do not edit, rename, or replace it.

r5, 2026-11-15 03:2x, written by the desk (Fable 5.2). r5 applies all fourteen amendments of Fable's review of r4 (`review-fable-strophic-lane-a-r4_r1_2026-11-15.md`, SEND WITH AMENDMENTS) and Dann's ruling of 2026-11-15 02:44 on that review's one question. "Where each amendment went" is the last section. r4 (2026-11-15 00:1x, the desk on Opus) replaced r3 (`brief-code-strophic-lane-a_r3_2026-11-12.md`), which Dann's ruling of 2026-11-12 13:41 superseded before it was sent: r3 printed the whole song once per verse, each verse on a new system; the ruling is one continuous line of music in the order it is sung. r4 kept every r3 mechanism the ruling leaves standing (the verse view, the no-Cyrillic rule, the inert later verses, the per-verse build, the strings, the byte baseline; r3 applied all twelve amendments of Fable's review of r2) and replaced r3's pagination design with a performance-order render score.

Citations: r4's lines were read at `Shane` `4e5b4ad9`, and the review's at `4e5b4ad9` and at lane 50's `8cf6e5c7`. On 2026-11-15 03:1x the desk mapped every cited line by script to `Shane` with lanes 50 and 52 merged (the desk's trial merge `e2a6b732`), which is the code this lane is cut from once both lanes ship. A line number stands here only where the line's exact text was found at that number in the trial merge. Step 0 re-reads every line.

## Lane

- Branch `cloud-lane-56` (DESK DEFAULT number), cut from `Shane` at the commit the desk names when it starts the lane, **after lane 50 (key changes and grace notes) and lane 52 (N.200) ship**, because lane 50 edits `staff-renderer.ts`, `page-layout.ts`, and the key-change drawing this lane reads, and both lanes edit the key index of `i18n.ts`.
- **This lane is A of five. It prints verses. It changes no pairing, no stored record, no selection, and nothing in `Loupe.svelte`.** D6 allows guards in `loupe.ts`, `loupe-ink.ts`, and `selection-ring.ts`, and nowhere else in the Loupe's code. Lanes B (verses correctable), C (INSIGHTS by verse), D (repeat signs, voltas, jump marks drawn), and E (typed verses, receipt line, "Verse not sung") follow after the release (Dann 2026-11-12 01:44).
- Take every "before" reading first. Read old code with `git show <sha>:<path>`. No `git stash`, `checkout` of files, `reset`, or `restore`.
- Report after each step in `docs/sessions/report-code-strophic-a-step<N>_r1_<date>.md`: what changed (file and line), tests added, gate counts, pictures where the step draws, and "What I could not establish". NOT ESTABLISHED beats a complete invented answer.
- **Ratchets** (`scripts/ratchets.json` and `wc -l` on the desk's trial merge, 2026-11-15 03:1x): `MarkupPane.svelte` 1362 of 1364, `staff-renderer.ts` 3412 of 3427, `Loupe.svelte` 3012 of 3012, `types.ts` 999 (an unlisted file's limit is 1000 lines, inclusive). Step 0 re-measures. **`MarkupPane.svelte` has two lines of room, so the extraction comes first:** the `paginateScore` call and its options (`MarkupPane.svelte:853-877`) move into the new `apps/web/src/lib/markup/` module in Step 4a's first commit, with no change in output (D8 holds); the wiring then lands in the room that frees. This lane edits neither `vowel-resolver.ts` nor `types.ts`. It edits `staff-renderer.ts` for one clause, the multibar rest at a pass boundary (D7, `staff-renderer.ts:764`), and for the verse label only if Step 0 shows the label cannot be placed from outside the renderer; each is named in the Step 0 report before any edit. Never raise a ceiling without saying so in the step report.

## What the singer gets (Dann 2026-11-12 13:41, `OPEN.md`, "STROPHIC SONGS: MELODY UNFOLDS THE SONG CONTINUOUSLY")

- **MELODY prints a strophic song in the order it is sung, as one continuous line of music.**
- **Bars outside the strophic passage (an introduction, an ending) print once.**
- **The strophic passage prints once per verse,** each pass carrying that verse's words, IPA, and marks, **each pass starting wherever the last ended, mid-system if that is where it falls.** No forced system or page break.
- **A bar inside the passage with one line of words (a refrain) appears in every pass with its words** (the "no print-once refrains" of 01:45).
- **A small "Verse 2" label stands above the bar where verse 2 begins.** Every bar keeps its printed number, tagged "· verse 2" where needed.
- **The repeat that bounds the passage is not drawn,** since the unfolding has carried it out. **Repeats whose words do not vary stay notated** (D3, Job B declined; CONTRACT §8: "Do not unspool a repeat whose text does not vary").
- **A song with one verse looks exactly as it does today.**
- Later verses are printed but not yet tappable (lane B).

## Rulings that bind this lane

- 2026-11-12 13:41 (above). It supersedes the 01:45 DESK DEFAULT "each verse starts on a new system under a Verse 2 label", and r2 and r3 of this brief.
- D3, E.36 (2026-08-10): *"we need each verse to receive its own set of pitches to interact with its own vowels. ... Unvaried text just needs to be printed once regardless of how many times the same text would be repeated temporally."* N.20 (`OPEN.md`, N.20). The quotation's record is the project file `claude/e36-session-record_2026-08-10.md`, section 1.14 (found by the desk's search on 2026-11-15, read as a snippet; Code cannot open that file, so the words are quoted here).
- 2026-11-15 02:44 (Dann, *"A"*, on Fable's question; `OPEN.md`, "STROPHIC SONGS: MELODY UNFOLDS THE SONG CONTINUOUSLY", last entry): on a print that stacks verses with no repeat signs, a one-line stretch after the last bar with stacked words prints once, after the last verse (D3.2).
- The strings, ratified 2026-11-12 12:58 (`OPEN.md`, "STROPHIC VERSE LABELS, EN AND FR"): label "Verse 2" / « Couplet 2 »; tag "12 · verse 2" / « 12 · couplet 2 », full word, no abbreviation.
- CONTRACT §8: "Do not delete `analyzePerVerse`; N.20 is built on it." "Do not change `VocalLineEvent`."
- CONTRACT §0.1: one vowel per note; a sung note that is not a continuation and carries no syllable is a mistake. This holds in every pass.
- 2026-11-12 13:21: "We serve the user. We ground our practice in established authorities and cite them scrupulously." 13:22: Ilya produces study editions, not performance editions.

## Design (DESK DEFAULT unless marked ruled)

### The machinery that already exists

`unfold` (`packages/score-parser/src/unfold.ts:150`) computes the sung order of source measures through repeats, voltas, and the jump family, as `UnfoldedMeasure { source, pass }` (`:85-90`), and flags rather than guesses (`:103-111`). `scoreInPerformanceOrder` (`performance-order.ts:64`) uses it for analysis only: it rebuilds `vocalLine` and leaves `measures` untouched, and each repeated event keeps the same id. MELODY paginates the notated score: `paginateScore(readingScore, ...)` at `MarkupPane.svelte:855`. The renderer draws no repeat sign or volta (scout packet `scout-packet-strophic_r1_2026-11-12.md`, section 5).

### D1. Verses known (r3 design 1, kept)

`sungVerseNumbers` (`verses.ts:22`) decides the verses, with one change: a lyric line whose syllables carry no Cyrillic letter is not a verse (the sunless fixtures carry IPA as `<lyric number="2">`). If no line carries a Cyrillic letter, the result is as today. Pass k of a passage sings the k-th sung verse, so a file with words on lines 1 and 3 and IPA on line 2 prints "Verse 2" for line 3.

### D2. The verse view (r3 design 0, kept)

One pure function in `verses.ts` returns the score as verse N sings it: on each sung note, `syllable` is verse N's entry (`verseNumber` 1, no `versesInfo`); in a one-line bar it is verse 1's syllable; anywhere else that verse N has no entry, the note has no syllable (a continuation). A one-line bar is a bar in which no note carries any verse's words but verse 1's. `vowel-resolver.ts` is not edited; verse 1 never passes through a view.

"Verse N's entry" is the note's `versesInfo` entry for N or, with no `versesInfo`, the note's syllable when its `verseNumber` is N (a note with one lyric line carries no `versesInfo`: `vowel-resolver.ts:216-221`, `musicxml-parser.ts:821`). The view's `dictionMarks` holds verse N's records only, renumbered to verse 1 (`vacatedTailEventIds` is keyed by event id and verse number, `types.ts:139`, and the resolver abstains by it, `vowel-resolver.ts:653`). Where a bar carries some later verse's words but not verse N's, verse N is left a continuation and the step report lists the bars. Step 0 establishes on a two-line test score what pass 1 prints today under a note where verse 1 holds a slur and verse 2 sings: the note's own syllable is then verse 2's (`musicxml-parser.ts:821`), and the renderer prints the note's own syllable (`staff-renderer.ts:3128`). If pass 1 prints verse 2's word there, then in a score with a kept later pass, pass 1's events take the verse-1 view's syllables (ids unchanged), and the report says so.

### D3. The passage and its passes

1. **With repeat or jump marks:** run `unfold` on the lane's own copy of the corrected score's markers (`markersFromMeasures`, `unfold.ts:677`).
   - **The pass count comes from the verses.** `unfold` plays a backward repeat twice unless the file gives `times` (`unfold.ts:249`, `:622`; `types.ts:290`), so a plain repeat over three stacked verses would print two. Before `unfold` runs, on the lane's copy: for each backward repeat that no ending governs, `times` is the larger of the file's `times` (default 2) and the count of sung verses with words inside that repeat's span. The analysis path (`MarkupPane.svelte:591`) is not changed, so MELODY can print three passes where INSIGHTS counts two; that is an interim limit (lane C).
   - **A repeat from the top with endings.** Where endings exist and no bar carries a forward repeat, bar 0 takes one on the lane's copy (the rule `unfold.ts:215` applies to a plain repeat; without it `unfold` flags `volta-multi-span`, `unfold.ts:190`).
   - **Which later passes are kept.** A later run is a maximal stretch of consecutive entries of `unfold`'s order with the same pass p above 1. It is kept when some note in its source bars carries words for the p-th sung verse (D1's count); otherwise the run is dropped and those bars print once, as notated (CONTRACT §8). Inside a kept run, a bar is a later-pass bar (derived ids, verse place p) only when its source bar was printed in an earlier pass or it carries `ending`. Every other bar of the run is outside the passage: it keeps its ids, takes no tag, and reads verse 1. (After the last ending nothing resets `unfold`'s pass, `unfold.ts:229-264`; without this rule the bars after a second ending print as "verse 2" and go inert.)
   - Voltas follow `unfold`: each pass prints only its own ending.
2. **When D3.1 keeps no later pass and the score carries later verses** (no marks, a flag from `unfold`, or marks that do not enclose the verses): the passage is the span from the first bar in which any later verse has words to the last such bar. Bars before it print once, then the passage once per verse, then the bars after it once. On this path, a bar whose `ending.passes` does not include k is left out of pass k. **A one-line stretch after the last bar that carries a later verse's words prints once, after the last verse: RULED by Dann 2026-11-15 02:44**, because nothing in such a file marks a return. The step report lists every song that took this path and every song that has such a stretch.
3. **One verse, or no later pass kept:** nothing changes; MELODY paginates the notated score by the same call as today.

### D4. The render score

One pure function in `packages/score-parser/src/` (a new module; `verses.ts` and `performance-order.ts` stay small) returns a `ParsedScore` whose `measures` and `vocalLine` are in the order D3 prints them:

- Each printed measure is a copy of its source measure with a new consecutive `index`, the source's printed `number` unchanged. Its repeat and ending markers are removed only where this function unfolded that repeat (the bounding repeat is not drawn; the renderer draws none today); a repeat that stays notated keeps its markers for lane D.
- Its events are the source measure's events from the verse view of that pass's verse (D2). In pass 1 and in bars outside the passage, events keep their ids. In a later pass, each event takes a derived id, `<id>~v<k>` (DESK DEFAULT form), so analysis, marks, and widths of different verses never share a key. Lane 50's grace ids are the principal's id plus `~g1` or `~a1` (`grace.ts:28-31`, `:149`), so Step 0 checks that no event or grace id in any tracked score contains `~v`; a later-pass grace note's id is its derived principal's id plus the grace suffix (`m3-1-2~v2~g1`), and the attribute rename of D6 matches `~v<k>` anywhere in a value.
- The function reports, per printed measure, its source index, its pass, and its verse place k, so MarkupPane can label and mark it.
- Each printed event's `measureIndex` is its bar's printed index (`sliceScore` filters and rebases by it, `page-layout.ts:139-141`).
- In a later-pass bar, every `partnerEventId` (tie and slur; `types.ts:625`, `:636`) is rewritten to the partner's copy in the same pass. Where the partner is not printed in that pass, or in the outside bar that follows or precedes it directly, the pointer is removed, and a tie whose next printed note is not its partner is removed with it (ties join the next placed note by adjacency, `ties-and-slurs.ts:133-143`; slurs look the partner up by id, `printed-marks.ts:69-70`, `:90-91`). The same test applies to pass 1's last and first bars.
- `tempoMarkings`, `keySignatures`, `timeSignatures`, `clefs`, and any other list keyed by `measureIndex` (`types.ts:371-456`; sliced at `page-layout.ts:136-138`) are rebuilt on printed indices, one entry per printed copy of the source bar.
- `graceNotes` of a later-pass principal are copied with the derived `principalId` (lane 50 keeps a grace note by its principal, `grace.ts:166`).

Corrections are applied before MELODY sees the score (`bar-layer.ts`, per the scout packet); the render score is built from the corrected score, so a correction to a shared note shows in every pass. Key and time signatures need no special case: a later pass that returns to the opening key after a modulation shows the key change where the renderer already draws one; Step 4's pictures show it.

### D5. Each verse built the way verse 1 is (r3 design 4, adapted)

For each later verse, from its view: `buildUnderlayResolvers(view, 1, { openSyllabification })` (as at `MarkupPane.svelte:606`), then `resolveAdvice(analyzeScore(...))` (as at `:733`), the IPA channel through `applyNotationPreferences`, the withheld set, and the modern-spelling Cyrillic, keyed by the derived ids. No pairings, no blanks, no transcribed lines. This lives in a new module under `apps/web/src/lib/markup/`, with its own tests; `MarkupPane.svelte` only calls it. Verse 1 keeps today's live path. The legend reads every verse. `analyzePerVerse` stays, untouched.

**How the verses meet in one call.** `paginateScore` takes one `AnalyzedScore` and one options object (`page-layout.ts:264-268`), and the renderer reads five channels by event id (`cyrPreview` `staff-renderer.ts:3128`; `ipaPreview` `:3129`; `sylTypePreview` `:943-944`, `:3147`; `melismaPreview` `:2378`, `:3127`; `withheldIpa`). So the new module returns one render score, one merged `AnalyzedScore` (verse 1's `global`; `events` is verse 1's plus each later verse's, re-keyed to derived ids), and one options object whose five channels are verse 1's plus each later verse's under derived ids. Each later verse is analysed on `scoreInPerformanceOrder(view).score`. The bundle handed to `onpagesdrawn` (`MarkupPane.svelte:925-941`) keeps the notated `readingScore`, verse 1's `analyzed`, and verse 1's channels.

### D6. Later passes are inert

Every element drawn for a later-pass event carries `data-verse="k"`, and its `data-hit`, `data-event-id`, `data-of-event`, and `data-ipa-of` are renamed with a `data-verse-` prefix (precedent: `Loupe.svelte:1131-1141`, r3 read). A system that holds any bar that is not a later-pass bar keeps `data-system`, and its value is the first and last **source** index of those bars: the wrapper writes the paginated score's range today (`page-layout.ts:465`), the Loupe parses every range (`Loupe.svelte:1055-1058`), and it looks the held bar up by its source index (`Loupe.svelte:1996`; `loupe.ts:57-58`; `+page.svelte:1048`). A system that holds later-pass bars only carries `data-verse-system`, with printed indices. So every lookup by id sees verse 1 only. **The rename does not cover walks over a system's elements in a mixed system:** `pageMetrics` walks every element of every `[data-system]` (`loupe-ink.ts:199`, `:215-252`) and skips hit rectangles by the name `data-hit` (`:229`); a system's head is its leftmost `[data-hit]` (`:255-256`); `musicInk` gates on the first `MUSIC_MARK` (`loupe-ink.ts:102`; `loupe.ts:347`); `ipaBaselineOf` reads any `<text>` at `CYR_FONT_SIZE` without `data-bar-number` as the Cyrillic row (`selection-ring.ts:193-199`). For those walks this lane may add guards in `loupe.ts`, `loupe-ink.ts`, and `selection-ring.ts` only: `rect[data-verse-hit]` and `[data-verse-label]` are skipped as ink, and a system's head and its music gate also accept the `data-verse-` names. Lane 50's grace notes use the same attribute names, so the rename covers them. Step 0 lists every reader.

### D7. The label and the tag

- **The label** "Verse %s" / « Couplet %s » (`markup.verseLabel`) stands above the staff at the first bar of each later pass, mid-system where it falls, upright, at the underlay's type size, left-aligned to that bar's first note, with a `data-verse-label` handle. The system's height includes it, so the label cannot part from its bar at a page foot. Prefer placing it at the page-layout seam from the bar's drawn position; if the render does not report that position, say so in Step 0 before touching `staff-renderer.ts`.
- **The tag** "%m · verse %v" / « %m · couplet %v »: at each system start that falls inside a later pass, the bar number carries the tag, written inside the existing `<text data-bar-number>` element (every reader names the bar number out by that handle: `selection-ring.ts:196`; `loupe-ink.ts:107`, `:136`, `:228`; `Loupe.svelte:952`, `:1102`). The number is centred on the clef (`staff-renderer.ts:2197-2198`), so a longer string grows leftward: if the centred string would cross x = 0, the element is re-anchored at its start with x = 0, and the step report says on which systems (DESK DEFAULT). No ink of the number or its tag falls left of the system's left edge; a test asserts it and the 390 px picture shows it. A system whose first bar carries the label takes no tag (DESK DEFAULT; the 13:41 ruling says "tagged where needed"). The bracketed courtesy number after a long rest takes no tag.
- **A multibar rest never spans a pass boundary.** Consecutive tacet bars merge into one rest unless the meter or the key changes (`staff-renderer.ts:754-772`; packed at `page-layout.ts:284`), so a passage that closes on a tacet bar and opens on one would hide the label's bar inside a rest counted across two passes. This needs one clause at `staff-renderer.ts:764`; name it in the Step 0 report before the edit, and add a fixture and a test.
- **The seam.** One function (in the lane's new `score-parser` module) takes a system's markup and its printed range and returns the markup with the rename (D6), the tag, and the label applied, its `viewBox` grown for the label. `paginateScore` takes it as one optional option and calls it after both `renderSystemSlice` calls (every system, `page-layout.ts:309-314`; the last system again at natural width, `:388-411`) and for the wrapper attribute (`:465`). The label changes the system's `minY` and `height` before stacking (`:313`, `:328`). With the option absent, `paginateScore`'s output is byte-identical; D8 tests that.
- Both strings are ratified (12:58); pin them in `ratified-lines.test.ts`.

### D8. Byte identity

Before Step 3 changes any code, commit a file of one hash per tracked `.musicxml` (under `apps/`, `docs/`, `tools/`, and `packages/`) of `paginateScore`'s pages at `markup-pages.test.ts`'s geometry, taken on the lane's base commit. A test recomputes and compares. Every one-verse score stays byte-identical. The baseline is taken through the function MarkupPane will call (the extracted module of Step 4a), not through `paginateScore` alone: for every tracked file other than the new fixtures, that function returns its input score by reference, and the test names any exception.

## Interim limits, said once in the final report

- A later verse's IPA comes from the score's words through the fallback pipeline, with the singer's spelling settings but without Lyrics edits or hand pairings.
- Lyrics shows verse 1 only. INSIGHTS, the watch list, and phonation totals read as today (lane C).
- Repeat signs, voltas, and jump marks that stay notated are still not drawn (lane D).
- Stress acutes show in verse 1 only (lane B).
- Later verses cannot be tapped (lane B).
- On the D3.2 path, a one-line stretch after the passage prints once (ruled 2026-11-15 02:44).
- MELODY can print three passes where INSIGHTS, the transposition ruler, and the tessitura band count two (D3.1; lane C).
- A refrain's IPA in a later pass comes from the fallback pipeline, so it can differ from pass 1's where the singer edited verse 1.

## Steps

### Step 0. Read and measure. Change no code.

The eight gates and `node scripts/ratchets.mjs`, recorded. Re-read every line this brief cites and report any that moved. List every non-test reader of `data-hit`, `data-event-id`, `data-of-event`, `data-ipa-of`, and `[data-system]` (r3's list, Fable at `dc078b95`, is a start: `Loupe.svelte`, `selection-ring.ts`, `loupe-ink.ts`, `loupe.ts`, `loupe-hold.ts`, `crossing-ring.ts`, `MarkupPane.svelte`, `+page.svelte`, `TimeSignatureControls.svelte`, `system-ground.ts`), and confirm each sees pass 1 only under D6. List every reader of the value of `data-system` and of `data-tacet`, and every walk over a system's elements (D6's list is a start). List every reader keyed by event id between the render score and the page (marks, widths, IPA, withheld set) and confirm derived ids reach each. Check that no event or grace id in any tracked score contains `~v` (D4). Confirm that the corrected score still carries repeat and ending markers (`rebar.ts:362-384` keeps them, by Fable's read). Establish, on a two-line test score, what pass 1 prints today under a note where verse 1 holds a slur and verse 2 sings (D2). Establish whether the scan reader returns more than one verse, and whether it reads repeat barlines. Establish whether the render reports a bar's drawn x position, and a derived-id event group's x, to the page-layout seam (D7). Re-measure the ratchets. Name, before any edit, the clause at `staff-renderer.ts:764` (D7). Record and commit the D8 baseline.

### Step 1. Fixtures

Add to `packages/score-parser/src/fixtures/`, each with its source in a head comment:

1. `strophic-repeat.musicxml`: a two-bar introduction without words; a passage of six bars inside a forward and backward repeat, with three Cyrillic verses in bars 3 to 6 and a one-line refrain in bars 7 and 8; a two-bar ending after the repeat. In bar 4, verse 1 sings two syllables on two notes that verse 2 sings as one; in bar 5, the reverse. The repeat carries no `times` attribute (D3.1 must find three passes from the verses). One slur lies inside the passage and one tempo mark stands on the ending (D4). A test asserts that a later pass begins mid-system at desktop width and at 390 px; lengthen the introduction until both hold.
2. `strophic-volta.musicxml` and `strophic-volta-from-top.musicxml`: a repeated passage with first and second endings and two verses, the first file with a forward repeat, the second repeating from the top with none. Each has one bar after the second ending; a test asserts that bar keeps its ids and takes no tag (D3.1).
3. `strophic-stacked.musicxml`: three verses under the music with no repeat marks, an introduction, and an ending.
4. `repeat-one-verse.musicxml`: a repeat whose words do not vary.
5. `strophic-tacet-boundary.musicxml`: a repeat from the top whose passage opens and closes on a tacet bar (a piano introduction and an interlude), for the multibar rest at a pass boundary (D7).

Smoke tests that each parses with the verses and markers stated.

### Step 2. Verses known (D1 and D2)

The no-Cyrillic rule and the verse view, with tests: the repeat fixture gives three verses; in verses 2 and 3, bars 7 and 8 carry verse 1's syllables; in verse 2, bar 4's second note has no syllable and bar 5's two notes each have one; no sung note in any view lacks a syllable except a continuation. Both sunless fixtures (`apps/web/src/lib/score/ingestion/fixtures/`) give one verse. `vowel-resolver.ts` shows no diff.

### Step 3. The render score (D3 and D4)

Pure code in `packages/score-parser`, with tests: the repeat fixture prints introduction, passage three times, ending; printed numbers repeat per pass; the volta fixture prints ending 1 in pass 1 and ending 2 in pass 2; the stacked fixture takes D3.2; the one-verse repeat fixture returns the notated score unchanged; later-pass ids are derived and unique; three passes come from three verses with no `times` (D3.1); in both volta fixtures the bar after the second ending keeps its ids; a later-pass slur and a later-pass tie point at their partners' copies in the same pass, and one that would leave its pass is removed; the tempo mark on the ending prints once, on the ending; a later-pass principal keeps its grace notes (a test score with one grace note in the passage); the D8 baseline holds.

### Step 4a. MELODY draws the passes (D5, D6, and the wiring)

First commit: the extraction named under Ratchets, with no change in output (D8 holds). Then wire the render score into MELODY's pagination in place of the notated score when D3 keeps a later pass. Tests on the repeat fixture: the three verses' syllables under bar 3 differ as the file has them; each verse's vowel mark follows its own vowel; no `data-hit` exists for a later-pass event; a system of later-pass bars only carries `data-verse-system`, and a mixed system's `data-system` holds source indices; `pageMetrics` gives the same `above` and `below` for fixture 1 as for a copy of it with lyric lines 2 and 3 removed, and any difference is reported with its cause; only the song's last bar draws the final barline. Open the Loupe on a bar after the passage and report which system it names. Pictures at desktop width and 390 px.

### Step 4b. The label and the tag (D7)

The seam function, the label, the tag, and the multibar-rest clause. Tests: the label stands above the first bar of passes 2 and 3; tags appear only at later-pass system starts, and never on a system whose first bar carries the label; no tag ink falls left of a system edge; the re-rendered last system carries no live `data-hit` for a later-pass event (`page-layout.ts:388-411`); with the option absent, `paginateScore` is byte-identical; a multibar rest stops at a pass boundary. Pictures at desktop width and 390 px, English and French.

### Step 5. Close

Merge `Shane`, run all eight gates and the Playwright suite (desktop and phone), and write the final report: the counts, the interim limits, and pictures of the repeat and volta fixtures in MELODY at desktop width and 390 px, English and French, with a printed PDF of the repeat fixture, letter size, and one picture of a key change that falls at a pass boundary (lane 50's key-change drawing reads per-bar snapshots, `accidental-carry.ts:41`, and has not been seen there). Look at every picture before reporting it.

## Computations this lane changes (CONTRACT §4)

- Which verses are sung (`sungVerseNumbers`): a lyric line with no Cyrillic letter stops counting. Its one non-test caller is `analyze-per-verse.ts:42`, and `analyzePerVerse` has no non-test caller at `4e5b4ad9` (Fable's grep; Step 0 repeats it on the lane's base).
- The sung order: MELODY's render score will differ from the three sites that call `scoreInPerformanceOrder` (`MarkupPane.svelte:591`, `InsightsPane.svelte:169`, `transposition-ruler.ts:302`) wherever D3.1 raises the pass count or D3.2 applies; phonation totals and the tessitura band then count fewer passes than MELODY prints, until lane C.
- What MELODY paginates: the render score in place of the notated score, for a song with a later pass kept. One-verse output is byte-identical against the committed baseline.

## What the desk could not establish

- Whether real strophic scores reach Ilya with repeat marks, stacked verses without marks, or both, and in what proportion. No committed fixture has a real second verse (scout packet, section 6).
- Whether the scan reader returns more than one verse or reads repeat barlines (Step 0).
- Whether the render reports a bar's x position to the page-layout seam (Step 0).
- How the browser breaks MELODY's sheets when printing a long unfolded song.
- Whether MusicXML written by Finale, Sibelius, MuseScore, or Dorico puts `times` on a repeat over three verses (D3.1 holds either way).
- How large the effect of renamed hit rectangles on the Loupe's frame is; Step 4a's `pageMetrics` test measures it.
- Whether a supplied `<note id>` in a singer's own file can contain `~v` (`musicxml-parser.ts:901-923` refuses only duplicates and cursor-shaped ids).
- Whether the Loupe's courtesy accidentals on a second ending's first bar differ from the page's, since the Loupe reads the notated predecessor.
- Fable's review ran no code: every failure mode it names is read from the cited lines, not observed on a page.
- Sizing, Fable's judgement, not timed: 3 Code sessions, 4 if Dann's walk finds a fix round (Steps 0 to 3; then 4a; then 4b and 5).

## Where each amendment went

A1: D3.1 (the pass count), fixture 1, Step 3, the interim limits. A2: D3.1 (a repeat from the top with endings) and D3.2 (its opening, `ending.passes`), fixture 2. A3: D3.1 (which later passes are kept), fixture 2, Step 3. A4: D4, fixture 1, Step 3. A5: D2, Step 0. A6: D4, Step 0. A7: D6, Step 0, Step 4a. A8: D6, the Lane section, Step 0, Step 4a. A9: D7 (the seam), Step 4b. A10: D7 (the tag, the multibar rest), Step 0, fixture 5, Step 4b. A11: D5, the interim limits. A12: the Lane section (Ratchets), Step 4a. A13: D8, Step 1, Step 3, Steps 4a and 4b, Step 0. A14: "Computations this lane changes". Fable's question: ruled by Dann 2026-11-15 02:44 (D3.2).
