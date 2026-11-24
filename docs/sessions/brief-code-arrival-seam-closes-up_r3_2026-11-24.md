# Brief: Ilya repairs what the evidence supports and accounts for what it does not (Code, cloud lane), r3

Written by the desk (Opus 5), 2026-11-24 03:0x. **r1 and r2 were both stopped by Fable** (four blockers, then three new ones) and are superseded and kept. **Tier 4: this lane changes behaviour on purpose.** It does not start until `cloud-lane-86`'s behaviour baseline is committed.

## The principle, ruled by Dann 2026-11-24 03:04 and 03:05

> *"repair what the evidence supports, and account for what it does not."*

> *"we created Corrections to give the user agency to repair whatever Ilya cannot"*

**This dissolves the corner r2 was stuck in.** Fable's blocker N2 was right: where a repair is refused, leaving the file as it stands is itself the state `CONTRACT.md` section 0.1 forbids, and so is today's fold. **Both are forbidden because both are Ilya making a claim it cannot support.** Under the ruling above there is a third state and it is the correct one: Ilya makes NO claim about that run, counts it, and hands it to Corrections, where the singer has the verbs.

## What the measure established, 2026-11-24 03:0x, by the desk

`sunless-01-finale-lone-v.musicxml`, kept byte for byte as Finale printed it, against `sunless-01-engraved.musicxml`, the same song repaired against Dann's print on 2026-10-29 (`brief-code-n135-stage2b-r5-step10_r1_2026-10-29.md`):

- **97 sung notes against 96.** The files differ in exactly one bar's note count, bar 18, and in bar 17's note values.
- **So the export carries two kinds of fault at once:** notes that are not in the print, and vowelless units given notes of their own.
- **Three of the second kind:** the lone «в» in the Cyrillic verse, and `#` alone at sung notes 19 and 80 of the IPA verse. An isolated `#` is forbidden by `CONTRACT.md` section 0.1 in Dann's own words.
- **A desk claim of 02:5x is withdrawn:** the IPA verse does NOT sit one note later throughout. The two verses agree for the first eighteen notes and the IPA falls behind only from the first lone `#`. **The second verse is evidence, not a clean witness.**

**Consequence for this lane: it is not "make the text fit the notes".** The notes can be wrong too. No repair is attempted on note counts.

## Step 0. Establish where the repair can live, and report before building

Fable's blocker N3: the five conditions at `clitic-seat.ts:242-258` need the pipeline's queue (`:260-287`), and `foldVowelessSyllables` takes only a `ParsedScore` (`vowelless-fold.ts:83`). **Settle which object carries the repair before writing any of it**, report the two candidate shapes with their costs, and take one. The desk's lean, which the lane may overturn with a reason: leave the fold where it is and give it the evidence it needs, rather than moving the seat.

## Item 1. The parser reads the print's mark for a held note

`packages/score-parser/src/musicxml-parser.ts` reads `<syllabic>`, `<text>`, and `<elision>` (`:796-806`, `:872-881`) and **no `<extend>`** (desk grep, `50315f2e`). Build that path; `omr/extend-convention.ts:18-20` names it as the cleaner one and leaves it for the desk to ask for, and the desk asks here. **Adopt the span at `extend-convention.ts:64-67` rather than a second idea of one, and say which reading wins where a file Ilya wrote carries both.**

## Item 2. A continuation is recognized from the print's own evidence

A sung note carrying no cell of its own is a CONTINUATION, not a fault, where it is tied into, under an extender from item 1, or under a slur from a note that does carry one. **The slur case keeps Dann's count gate of 2026-10-20 03:37 exactly as `score/slur-seat.ts:12-18` implements it**, and this item never widens it: it applies only to notes with no cell at all. **On an MNX file there are no slurs** (`packages/score-parser/src/types.ts:530`), so the evidence there is tie and extender only; say so in the report rather than reporting a slur count of zero as agreement.

## Item 3. The check runs on the file path, and it counts

`vowelsPerNote` (`omr/vowels-per-note.ts:73`) runs on the scan path (`omr/underlay-page.ts:424`) and in the poem join (`text/poem-join.ts:227`) and **nowhere on the file path** (desk grep). `ingestScoreFile` runs it over its own result, counting only what item 2 has not called a continuation.

**It reports, in the shape the scan path already uses, so that one reader can serve both.** Every count names its bar and its note. **It rewrites nothing.**

## Item 4. The fold stops emptying a note, and what it cannot settle it hands over

Today `foldVowelessSyllables` joins the clitic's text to its host, **empties the clitic's own note**, and moves nothing else (`ingestion/vowelless-fold.ts:115-122`, `:18-19`). That empty note is Ilya's own and is the state Dann ruled a mistake on 2026-11-02 at 14:34.

**Three outcomes, and every one of them is accounted for.**

1. **Repair.** The five conditions at `clitic-seat.ts:242-258` all hold, AND the result leaves no sung note of the song without a syllable that item 2 cannot call a continuation. Then the fused unit takes the clitic's own note and the tail closes up, which is Dann's ruling of 2026-09-04 (`clitic-seat.ts:23-31`, `score-seat.ts:43-45`).
2. **Hand over.** Any condition fails, or the repair would leave a note with nothing. **Ilya makes no claim about that run:** it seats nothing there, invents no melisma (Dann, E.46: Ilya never creates a melisma), empties no note, and records the run as unsettled with its bars and its reason. The singer meets it in Corrections.
3. **Not a clitic at all.** A vowelless unit the transcription does not call a clitic, and a clitic with no host in its row, go to outcome 2 as well. They are never seated and never dropped in silence. This answers Fable's blocker B3.

**On the kept Finale fixture, outcome 2 is the expected result for its clitic run** (61 cells against 60 slots, Fable's count, confirmed by the desk's own note count of 97 against 96). **A lane that reports a clean repair there has misread something.**

## What the singer meets, and what is NOT in this lane

**The telling is not built here.** It belongs with slice 6 of `plan-corrections-build_r1_2026-10-08.md`, the mark, the line, and the review, which Dann ruled in at 02:35. This lane produces the record that slice reads, in the scan path's existing shape, and adds no string a singer reads. **If one seems needed, stop and report it.**

## Done when

- No note is emptied by Ilya anywhere on the file path, proved by a test over the kept Finale fixture.
- Every unsettled run is counted with its bars and its reason; the Finale fixture's clitic run is one of them.
- A file whose print marks a held note is read as holding it, proved by a fixture carrying `<extend>`.
- The eight gates at their baselines except gate 4, which rises; name the new figure.
- `ingestion/fixture-rule.test.ts` still passes, with no new entry on its allow-list.
- No ratchet ceiling raised, nothing under `docs/memory/` touched, no committed approval or golden file changed.
- **The behaviour baseline's families 1 to 5 are re-captured and every difference listed and explained.**

## What this lane must not do

Repair a note count. Invent a melisma. Delete anything, including what item 4 makes unreachable in `clitic-seat.ts`: report it with line counts for a later tier 1 lane. Touch `score/reconciliation/`, `VocalLineEvent`, or `analyzePerVerse`. Rebuild `fixture-rule.test.ts`.

## Cost and conduct

Sonnet. **Cap 350,000 tokens.** One commit per item, step 0 reported before any of them. Push to its own branch only. Stage by explicit path. No `.bak`. No subagents. `ls docs/sessions/` before naming the report.

**NOT ESTABLISHED beats a complete invented answer.**

## Style

Canadian spelling, the Oxford comma, no em dashes, sentence case headings, no `simply`, `just`, `easy`, and no exclamation marks.
