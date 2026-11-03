# Review: brief row177-r1 (the scan path observes a printed slur) and brief pw-r2 (the poem as a witness) (Fable, r1, 2026-11-02)

Read in full this session, on `origin/Shane` at `e74ee1b2`: the two briefs; my plan review (`docs/sessions/review-fable-plan-one-vowel-and-underlay_r1_2026-11-02.md`, D, E, T2, T6); `CONTRACT.md` §0, §0.1, §0.2, §4; `OPEN.md:3254-3262` (the slur ruling), `:2772-2822` (two views, defaults 2, 3, 8, and 8 widened 20:58), `:2823-2850` (how Ilya seats text, items 1 as amended 22:13, 6, 9); `omr/underlay-prepare.ts` (all), `underlay-seat.ts` (all), `underlay-counts.ts` (all), `underlay-page.ts:1-262`, `underlay-reader.ts:53-60`, `underlay-clitics.ts:40-60`, `:95-140`, `underlay-seat.test.ts:394-404`, `underlay-prepare.test.ts:35-51`; `score/slur-seat.ts` (all), `pairings.ts:8-11`, `:203`, `:297`, `:386`; `+page.svelte:201`, `:2009`, `:2851`; QUEUE rows 114, 149, 176, 177. The measures: T0/T1, T2, T4/T5 reports, `scratch-t2.diff`, the sx (T3) report, the residual-causes report. The strict arm's song 1 console (`/root/desk/D/cap/s1/r114-song1.console.txt`, the per-system gate lines only; not scored).

## Verdicts

- **row177-r1: SEND WITH AMENDMENTS (8).** The gate as written is Dann's ruling. The line numbers for the gate's site are wrong, the slur pairing is underspecified in the one place that can mark a whole page, and §4's site list is short by the derived sites.
- **pw-r2: SEND WITH AMENDMENTS (8).** It follows the ratified design in every clause but one: half (b) of arm 2a is a measure the design says cannot run yet, and the brief lets the helper invent the instrument. The control is named as a choice of two; it must be one.

Amendment count: 16.

## Part 1. Brief row177-r1

### 1.1 Does the gate match the ruling as written?

Yes. The ruling (`OPEN.md:3258`): Ilya observes a slur as a melisma "when doing so makes the notes and the poem's syllables come out even; where the counts disagree ... it seats one syllable per note as today." The brief's step 2 takes the slur reading "only when the slur-aware free count equals the number of syllable units". That is "even". The typed path's gate is the same test: `slur-seat.ts:66` returns today's targets unless `queue.length === targets.length - observed.length`, strict equality, and `observed.length > 0`. So the strict arm is the ruling and the typed path, and the brief builds it.

The "equal or nearer" arm (373, the scratch's `dS < dT` at `scratch-t2.diff`, `underlay-page.ts` hunk) is not the ruling: "nearer" is a count that still disagrees, and the ruling says a disagreeing count seats as today. The brief does not build it. Right. The two outcomes:

- **Strict about +10.** The table fills in, strict and "nearer" agree within noise, and nothing else in the brief changes. Send after the amendments below.
- **Strict clearly less (say +3).** The brief still builds strict; the ruling does not bend to the number. What changes: the table then carries evidence Dann has not seen, that "nearer" would give him about 7 more syllables than "even" on this file. That is a ruling only he can make (the ruling's own words are the wall), so the brief must say so in "The ruling this builds" (A7), the measure's expectation becomes the strict number (A6), and the desk puts the one question to him with the three numbers, after the build, not before. Song 1's console under the strict arm already shows the shape: system 1 of page 1 has ties 16, slur-aware 7, units 10, so neither count is even and strict seats as today, while "nearer" would take the slur reading with 3 units left unseated. That is where the two arms part.

### 1.2 Per system against the typed path's whole song: defensible, with a line for Dann

Defensible, as DESK DEFAULT, not a ruling. The ruling names no scope (`OPEN.md:3258`); the typed path took the song because the queue is the whole song (`slur-seat.ts:59-60`); the scan path has no song-level unit count, because units are cut per row and seated per system (`underlay-page.ts:187-246`, one `seatTokens` call per seated system at `:241`). Per system is the natural scope on this path. Two costs the brief does not name, and the report must:

1. The two paths can disagree on one song: a per-system gate may take the slur in system 3 and not in system 1 (song 1's console, page 1: systems 1, 2, 4 ties-only, system 3 SLUR). The typed path, on the same song with a typed poem, takes all or none.
2. A per-system strict gate compares two noisy counts (the reader's unit count is not the engine's cut of a typed poem) over a short span, so it can pass by coincidence on a phrasing slur and a split error. The typed path's whole-song gate is harder to pass by chance. Song 1 is where homr's slurs disagree with the truth (my plan review, finding 1, 10 of 18 bars), so the report must count, per song, the systems that took the slur reading and how many of those agree with the truth's melisma marks (A5).

### 1.3 Line numbers checked against `e74ee1b2`

| brief cites | the tree | verdict |
|---|---|---|
| `underlay-prepare.ts:70` ties only | `:70` `tiedInto: /<tie\s[^>]*type="stop"/` | right |
| `slur-seat.ts:41-53` `slurContinuationIds` | `:41-53` | right |
| `underlay-seat.ts:86-94` `NotePlace` | the interface is `:83-94`; fields `:85-93` | off by three; harmless |
| `underlay-prepare.ts:113` carry into `NotePlace` | `:113` | right |
| `underlay-page.ts` "around `:196-219`, after the vowelless drop" | the vowelless drop is `assertVowelPerNote` at `:232-233`; the units count is taken at `:234`; `:196-219` is the rescue decision, the row loop, the `sung.push` at `:216`, and `cutUnits` at `:217` | **wrong**: the gate cannot sit at `:196-219`, its input does not exist there (A1) |
| `underlay-seat.ts:197` `free` | `:197` | right |
| `underlay-counts.ts:44` `freeNoteXs` | `:44`; the equality test is `underlay-seat.test.ts:394-404` | right |
| `underlay-page.ts:216` continuation flag | `:216`; but it runs before `:217-234`, so before the gate can be decided (A1) | right line, wrong order |
| `underlay-reader.ts` `counted` | `:54-60`; the per-system line is `:58` | right |
| `pairings.ts:300` (via the ruling) | `syllableTargetIds` is at `:297` on this tree | the ruling's citation has drifted; not the brief's claim |
| QUEUE row 149 shipped `b488bef9` | row 149: SHIPPED `b488bef9`; wired at `+page.svelte:2009` and `:2851` | right |

### 1.4 Are the sites complete (§4)?

Not quite. The three predicate sites are complete: `git grep tiedInto|underExtender` over `apps/web/src` (tests excluded) returns exactly `underlay-seat.ts:197`, `underlay-counts.ts:44`, `underlay-page.ts:216`, plus the declarations. The brief names all three and the console line. What it does not name, and §4 requires ("every other site that computes the same number and says what depended on them agreeing"):

- `free` at `underlay-page.ts:190`, computed once per system from `freeNoteXs` before any row is read, and consumed at `:197` (the rescue decision, `free.length > 0`), `:222` (`foldClitics`, where `free` feeds the `ownNote` count only: `underlay-clitics.ts:97-98`, `:119-126`, "Nothing depends on the count", `:52`), `:234` (`perSystem`), `:236` (`manyVowelsInUnits`), `:244` (`manyVowelsMerged`). Each is a number computed from the free set. The scratch recomputed `free` after the gate for `:234-244` and re-ran `foldClitics` with it (`scratch-t2.diff`, `prep(free)`); the brief does not say which reading these take.
- The FAR reach, `underlay-seat.ts:210`, `FAR_FACTOR * medianGap(xs)`, with `xs` the free notes (`:198`). Fewer free notes widen the median gap and so the reach, so a token FAR under the ties-only reading can be near under the slur reading. `underlay-counts.ts:40-41` says in words that this is why the two filters must agree. No test pins the flip (A8).
- `seatTokens` takes `NotePlace[]` and computes `free` inside (`:194-198`), so the gate's decision must reach it through the notes. The brief says "an `inSlur` note is a continuation at every site" but not how the per-system decision gets there. The scratch's mechanism (hand `seatTokens` a copy of `system.notes` with `inSlur` cleared where the system does not take it) is one way; a flag the predicate reads is cleaner (A3). Left unsaid, Sonnet may add a fourth boolean to two signatures and the equality test drifts.

Sites outside the scan path: none. The scan's words reach the file path as `<lyric>` elements written by `writeLyrics` (`underlay-song.ts:106`, `underlay-words.ts`), and the parser reads a melisma as the absence of a syllable (`pairings.ts:8-9`), so a slur continuation with no lyric arrives as a melisma with no new code. Say so in the report; it is why no arrival-side site is named.

### 1.5 The rest-in-slur rule

Right to take the typed path's rule, for a reason the brief does not give: on this path a rest never reaches `NotePlace` (`prepareUnderlay` filters `!n.rest && n.at !== null` at `underlay-prepare.ts:101`), so the only question is whether the span runs past the rest, and homr's `<slur type="stop">` is explicit on the note that ends it, as the file's is on the typed path. The scratch's "close at a rest" is an invented rule with no evidence behind it.

But the brief is silent on the case that matters more. The scratch keeps a `start` with no `stop` open to the end of the part (`scratch-t2.diff`, `openCount` never reset except at a rest). The typed path opens no span for a `start` without a partner (`slur-seat.ts:46-48`). If Sonnet follows the scratch's one-pass shape and the typed path's rest rule, one unmatched `start` from homr marks every later note on the page `inSlur`. The gate bounds the harm (the counts will not be even) but not to zero, and the FAR reach moves. Pairing by `number` (default 1) is in the scratch and not in the brief. A slur across a page break is a `start` on one page and a `stop` on the next; under the typed rule both pages mark nothing, which is a loss to count, not an error (A2).

### 1.6 The console line

Right, and it is the instrument my review's section D asked for. The scratch's shape (`[ties N, slur-aware N, slur notes N, SLUR|ties]` per system, `scratch-t2.diff`, `underlay-reader.ts` hunk) is what the brief describes. One addition: the breach count is already per page (`underlay-reader.ts:57-60`); per system would let the desk score each layer twice as section D asks, (b) and breaches. Optional; not an amendment.

### 1.7 The measure

"Within 2" is loose: T0 measured a spread of 0 on this machine, two passes byte-identical (T0/T1 report, "The floor is 0"). The expectation is the strict number exactly, per song, with any differing syllable named from the ledgers (A6). And the two "DESK FILLS IN" and "DESK CHECKS" items are blockers, not notes: the T2 report does not report new empty sung notes or new two-vowel notes against the control (the sx report did, for its own arm); the desk must count them from the strict ledgers before the brief leaves.

### Amendments to row177-r1 (exact text)

**A1.** In step 2, replace "In `seatPage` (`underlay-page.ts`, around `:196-219`), after the vowelless drop has produced the system's syllable units:" with: "In `seatPage` (`underlay-page.ts`), after `assertVowelPerNote` (`:232-233`) has produced the system's syllable units, at the point where `:234` counts them. The `sung.push` at `:216` runs before the units exist; move it after the gate so that its `continuation` carries the reading the system took. `NotePlace` is `underlay-seat.ts:83-94`."

**A2.** In step 1, after "overlapping or nested spans take the union", add: "Pair each `start` with the next `stop` of the same `number` (default 1) in document order, in a first pass over the part. A `start` with no `stop` in the part opens no span (the typed path's rule, `slur-seat.ts:46-48`); a `stop` with no open `start` is ignored. So a slur across a page break marks nothing on either page: count the unmatched starts and stops per song in the report, with a NOT ESTABLISHED on how many melismas they hide. A rest never reaches `NotePlace` (`underlay-prepare.ts:101`), so the rest question is only whether the span runs past it; it does, as on the typed path."

**A3.** In step 3, before item 1, add: "The decision reaches every site through the notes: where the system takes the slur reading, `seatPage` hands the sites below a copy of `system.notes` whose `inSlur` notes are continuations; where it does not, a copy with `inSlur` false. One exported predicate, `isContinuation(note)` in `underlay-seat.ts`, is the only reader of the three flags, used at `underlay-seat.ts:197` and `underlay-counts.ts:44`." After item 4, add: "5. the numbers derived from the free set in `seatPage`, each named with the reading it takes: `free` at `:190` and its readers at `:197` (the rescue decision), `:222` (`foldClitics`, the `ownNote` count only, `underlay-clitics.ts:52`), `:234`, `:236`, `:244`; and the FAR reach at `underlay-seat.ts:210`, which widens when free notes are fewer. What depended on them agreeing: the comment at `underlay-counts.ts:40-41` and the pin at `underlay-seat.test.ts:394-404`."

**A4.** In step 2, replace "only when the slur-aware free count equals the number of syllable units and the ties-only count does not, and where the system has at least one `inSlur` note" with: "only when the slur-aware free count equals the number of syllable units and at least one free note of the system is `inSlur` (so the ties-only count differs). This mirrors `observedTargets` (`slur-seat.ts:62-70`), whose gate is strict equality with `observed.length > 0`, taken over the whole song."

**A5.** In step 2, after "Per system, not per song", add: "This is DESK DEFAULT: the ruling names no scope, and the typed path's song-level gate has no song-level unit count to mirror here. The report counts, per song, the systems that took the slur reading, and for each whether its continuations agree with the truth's melisma marks; song 1 is where homr's slurs disagree with the truth (review finding 1)."

**A6.** Replace the Measure section with: "The desk re-runs row 114 songs 1 to 5 on the lane's build and expects the strict arm's number exactly, per song (T0's floor on this machine is 0); any syllable that differs is named from the two ledgers. Scored twice: (b), and the breaches per system from the console line. No new empty sung note and no new note of two vowels against the control."

**A7.** At the end of "The ruling this builds", add: "The 'equal or nearer' arm is not the ruling's 'even' and is not built. Its number is evidence for a ruling only Dann can make; the desk puts it to him after the build with the three numbers, never pre-empted here." (With strict about +10 the sentence costs nothing; with strict clearly less it is the sentence that keeps the brief honest.)

**A8.** In step 4, add three tests: "two slurs with different `number` values nested, the union; a `start` with no `stop`, which marks nothing; a token FAR under the ties-only reading that is near under the slur reading, pinning the reach at `underlay-seat.ts:210` under both."

## Part 2. Brief pw-r2

### 2.1 Does it follow the ratified design?

Against `OPEN.md`:

- Default 2 (`:2797`): Lyrics is the master for the words. The brief: yes.
- Default 3 (`:2798`): Poem is pasted, never derived. The brief supplies the poem as a paste and forbids the truth files. Yes.
- Default 8 as widened 20:58 (`:2819`): the poem informs Lyrics where a scan's word is garbled (the dictionary test) or absent. The brief: yes, (a) and (b).
- Item 1 as amended 22:13 (`:2830`): (b) holds "only where the reader saw ink under that note that it could not read. A clean blank, or a note under an extender line or a slur, stays undecided", and then: "NOT ESTABLISHED: that the reader reports blank against unread ink per note ...; **until it does, a wordless note stays undecided.**" The brief carries the first sentence and not the last. Under the design as ratified today, half (b) of arm 2a applies to no note, because the instrument does not exist. The brief's "say how 'saw ink' is decided and from what" hands the helper the design's open instrument to invent. That is the one departure (P2).
- Item 6 (`:2835-2846`): tiers, tier 3 before tier 2, tier 1's five conditions, gibberish by character set. The brief names them. But tier 1's third condition is "reached from the poem's by letter confusions the reader is known to make, or is gibberish or mojibake", and the confusion list does not exist yet (item 9: "the measure on row 114's truth files against the poems comes first, and sets ... the confusion list", `:2850`). So on this measure tier 1 holds only for character-set gibberish; a real-Cyrillic garble is tier 3, shown and never applied (`:2843`). Left unsaid, the helper writes a confusion list and the number is not the design's (P3).
- Item 9 (`:2850`): exact words first, letters in the leftover stretches, repeats and omissions labelled and never used to seat. The brief: yes.
- The 531 bar, the 2b ceiling, arm 3 on measured positions only, arm 4 as the instrument's ceiling, and the "if 2a falls short" paragraph: each matches T6 of my review as written.

### 2.2 Is "saw ink it could not read" decidable from what the app records?

Partly, and the brief must say which part. What the app records per row is the reader's `WordBox[]` (`underlay-page.ts:43-49`), text and box, and nothing of the pixels. T5 shows the two cases (T4/T5 report, section "T5"): song 1 p2 s1, the reader returned dashes and `ттт""--`, so a non-letter box under a note is evidence of ink it could not read; song 4 p4 s1, the reader returned 0 boxes for a row whose printed text the truth holds (6 syllables), so a clean blank and unread ink are the same record. From the app's records alone: decidable where a box with no letter (`kindOf` `mark` or `joint`, `underlay-seat.ts:131-137`) or an unseated token spans the note's x; not decidable where the row returned nothing. The second case is the design's own NOT ESTABLISHED; the brief should report those notes as "left to the singer by the design" and count them (its last paragraph already asks for the clean-blank count; the split is what is missing).

And the instrument: the `[t5]` dump in `/root/desk/C/scratch-t4.diff` prints the reader's raw boxes per row; without it the helper has only the sewn lyrics (the residual-causes report's own limit, section "Limit"). The brief does not name it (P5).

### 2.3 Is the control well named?

No, it is named as a choice: "373 for the 'equal or nearer' gate ... or the strict-equality arm". Only the strict arm is the ruling and only it goes to row 177; 373 is a tree no build will carry. The control must be the strict arm's tree and number, whatever that number is, with 373 at most a reference (P1). The scorer is "the scorer the desk names"; T2 and T4 scored with `/root/desk/B/score114b.py`, so name it.

My T6 placed the measure "after T2 and T3 land, because its positions must be §0.2 positions." T3 is measured and not landed: the sx report's variant B moves 2 syllables (363 to 365) and variant A none, because `splitTokens` already splits at the reader's hyphens and `cutUnits` cut 10 tokens in the whole file. So the tree's positions are still `splitTokens`' letter share, and the known cost of running pw before T3 lands is 2 syllables. Acceptable; the brief should say so (P7).

### 2.4 Two smaller points

- The dictionary test is named as "`isWord` as the app builds it (with `modernisePreReform`)". The app's test on the scan path is `wordKnown` (`underlay-language.ts`, called at `underlay-page.ts:207`), which does the modernising; name the function so the helper does not rebuild it (P8).
- The poems. lieder.net often prints the text as the composer set it, with the poet's variants in notes, and in either spelling. If the fetched text already carries the composer's repeats or alterations, arm 2a's gain is a ceiling for a real poem, not the design's number. The brief must ask the helper to say which text each page gives (P6).
- Slurs. Under the strict gate, an `inSlur` note in a system that did not take the slur reading is free and may be wordless. Item 1 says a note under a slur stays undecided, with no gate attached. So 2a takes nothing from the poem for any `inSlur` note, taken or not, and for any note after an extender (P4). These are the very notes the ties-only reading leaves empty, so without this line arm 2a quietly fills what the design leaves to the singer.
- r1's path (`~/Downloads/_desk-2026-11-02/pw/BRIEF-pw-poem-witness_r1_2026-11-02.md`) is on the Mac and not checked here.

### Amendments to pw-r2 (exact text)

**P1.** Replace the second sentence of "The control" with: "The control is the strict-equality tree (the gate row 177 builds, `/root/desk/D/`), and its number as the desk measured it; 373 ('equal or nearer', `/root/desk/B/cap/t2`) is a reference only and never the control. The scorer is `/root/desk/B/score114b.py`."

**P2.** In arm 2 (2a), replace "A sung non-continuation note with no word takes the poem's aligned syllable only where the reader saw ink under it it could not read (item 1 as amended); say how 'saw ink' is decided and from what." with: "Under item 1 as amended, a wordless note stays undecided until the reader reports unread ink per note, and it does not yet; so 2a's half (b) takes nothing, and 2a is half (a) alone. Add arm 2a-ink: 2a plus half (b) under this instrument, the desk's and not the design's: a note takes the poem's aligned syllable where a reader box with no letter (`kindOf` `mark` or `joint`, `underlay-seat.ts:131-137`) or an unseated syllable token spans the note's x in the `[t5]` dump. A note under a row that returned no boxes takes nothing and is counted as left to the singer. Report 2a and 2a-ink apart."

**P3.** In arm 2, after "(tier 1, with item 6's conditions)", add: "No confusion list is ratified (item 9), so tier 1 holds only where the scan's word is gibberish by character set (item 6's definition); a scan word of real Cyrillic letters that fails the dictionary is tier 3, shown and never applied, and is not taken. Count apart the tier 3 words that are one substitution from the poem's word: they are the confusion list's first evidence. Count apart the tier 1 candidates refused because the syllable count changed."

**P4.** In arm 2, after "Everything else stays.", add: "Every `inSlur` note, whether or not its system took the slur reading, and every note after an extender, takes nothing from the poem (item 1: undecided for the singer)."

**P5.** In Inputs, add: "The reader's boxes per row: the `[t5]` console dump of `/root/desk/C/scratch-t4.diff`, applied to the control tree, which changes no output (T4/T5 report, 'The change'). Arm 3's measured positions and arm 2a-ink's 'saw ink' come from it and from nothing else. T5 found rows with no boxes at song 4 p4 s1 and song 5 p2 s1 row 2; those take nothing."

**P6.** In Inputs, after "file each as `poems/songN.txt` with its URL", add: "Say for each whether lieder.net gives the poet's published text or the text as set (its notes name the variants), and in which spelling. Where it is the set text, the arm's number is a ceiling for a real poem and the report says so."

**P7.** In "The control", add: "The tree's syllable positions are `splitTokens`' letter share (`underlay-tokens.ts`); T3 is measured and not landed, and moves 2 syllables on this file (sx report, variant B), which is the known cost of running before it."

**P8.** In Inputs, replace "The app's dictionary test: `isWord` as the app builds it (with `modernisePreReform`), not a hand lookup." with: "The app's dictionary test: `wordKnown` (`underlay-language.ts`, called at `underlay-page.ts:207`), which modernises pre-reform spelling before the lookup; never a hand lookup, and never a reimplementation."

## What should change before either is sent

Row 177: A1 to A8, then the two blockers in the table filled from the strict ledgers (its number; no new empty sung note and no new two-vowel note). If the strict arm comes in clearly under "nearer", A7's sentence is the one that matters, and the desk brings Dann the three numbers after the build.

pw r2: P1 to P8, with P1 waiting on the same strict number. The brief then runs against the strict tree and reports 2a (the design today), 2a-ink (the design's missing instrument, the desk's definition), 2b (not the design), 3, and 4.

## What I could not establish

- The strict arm's number (songs 2 to 5 were running; I read song 1's gate lines only and scored nothing).
- Whether homr ever emits an unmatched `<slur type="start">` on these pages; A2 is written so that it cannot matter.
- Whether lieder.net holds the poet's text or the set text for the five songs; P6 asks the helper.
- Whether the melody-only arrival of a scan with slur continuations and no `<lyric>` draws anything different from a tied note today (`pairings.ts:8-9` says a missing syllable is a melisma; I did not read the renderer).
- r1 of the pw brief (Mac path).
