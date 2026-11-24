# Brief: one test decides every note, and what it cannot decide goes to Corrections (Code, cloud lane), r5

Written by the desk (Opus 5), 2026-11-24 04:0x. **r5 applies all twelve amendments of `review-fable-arrival-seam-r4_r3-delta_2026-11-24.md` (SEND WITH AMENDMENTS).** r1 to r4 are superseded and kept; r3's "no claim" outcome does not exist and no later desk revives it. **Tier 4: this lane changes behaviour on purpose.** The behaviour baseline is complete on `cloud-lane-86` at `df62de21`; this lane runs once that is merged.

## The rule this lane builds, derived with Dann 2026-11-24 03:15 to 03:19

**A syllable is a vowel with the consonants attached to it. Nothing else is a syllable.** A token between spaces or hyphens in a `<lyric>` is whatever the engraver typed; one vowel nucleus is what makes it a syllable.

**One test decides every note: count the vowel letters in the text under it.**

- **None.** A fragment. It fuses to its neighbour by direction (below). **Fusing gives a note back.**
- **One.** A syllable. It takes its note.
- **Two or more.** That many adjacent syllables on one note. The division falls between the nuclei and the later syllables take the following notes, cascading. **Dividing asks for a note.**

**Safe because sung Russian has no true polyvowel diphthong**, only vowel plus glide, and the glide is a consonant (Dann 03:18). `apps/web/src/lib/score/vowel-resolver.ts:159` already excludes «й».

**SCOPE, amendment 3. The test runs on a verse that holds a Cyrillic letter**, as today's fold already decides (`ingestion/vowelless-fold.ts:101-102`). **An IPA verse is not counted**: its syllables hold no Cyrillic vowel letter and counting them would make every one a fragment. **The `#` fold stays `foldDictionMarks`' work and this lane does not touch it**; the two lone `#` of the Finale copy's IPA verse are a check on this lane's result, not work for it.

**NORMALIZE FIRST, amendment 7.** «й» written as two code points matches the bare «и», so NFD text counts one vowel too many and would push a syllable that does not exist through the rest of the verse. Nothing on the path normalizes today (`musicxml-parser.ts`, `ingestion/ingest.ts`, `vowelless-fold.ts`, `omr/vowels-per-note.ts`, `omr/assert-vowel-per-note.ts`: no `normalize(`). **Count on NFC.**

**THE DIVISION IS A NAMED CALL, amendment 7.** `syllabify` in the engine counts ten vowel letters (`packages/phonology/src/engine.ts:241`, `:810-812`) where this test counts thirteen (`vowel-resolver.ts:158-159`), so on «тѣни» it finds one nucleus where the test finds two. **Name the call the lane uses, require that its pieces rejoin to the token character for character, and where it returns fewer pieces than the count, divide nothing and count the place.** No hand-rolled phonological predicate (`CONTRACT.md` section 8).

**DIRECTION, amendment 8, and today's code reads only the clitic table** (`vowelless-fold.ts:107-114`) although the cell's syllabic type is carried beside it (`:49-55`).

- A fragment marked `begin` or `middle` fuses **within its own word**.
- A fragment marked `end` fuses **backward** («знь» onto «жи», so the note sings «жизнь»).
- A vowelless `single` that the clitic table calls a proclitic fuses **forward** («в» onto «бью»).
- A vowelless `single` the table does not know fuses **backward**, as today.
- **The old-spelling letter map is asked before the clitic table**, so «въ» is not thrown backward in a lane whose vowel set exists to serve old spelling. **NOT ESTABLISHED: whether the pipeline marks «въ» a clitic.** Report it.

**EVERY MOVED TEXT CARRIES ITS SYLLABIC TYPE, amendment 9** (`vowelless-fold.ts:61`). A close-up moves every later cell, and a cell that loses its type loses its hyphen on the page.

## Then one count decides the rest

Syllables against sung notes, per verse.

- **Equal:** seat, one vowel per note.
- **A surplus note is a melisma ONLY where the print says so**, by a tie, by an extension line (item 1), or by a slur under the count gate at `score/slur-seat.ts:55-70`. **Ilya invents no melisma.**
- **Anything left over, in either direction: damage.** Ilya invents no syllable and no melisma to cover it. **It counts the place and hands it to Corrections**, which exists to give the singer agency to repair what Ilya cannot (Dann 03:05).

**THE CARRIER, amendment 6.** The count travels as a `ParseWarning` with `bars` and `eventIds` (`ingestion/ingest.ts:151`, `:166`), which the bars-to-confirm work already reads. **The `Breach` shape cannot carry it.**

**THE LEFTOVER IS RECORDED, NOT MERELY COUNTED, amendment 2, and this is the one that keeps the page honest.** A note with no syllable reads as a melisma to every reader (`packages/score-parser/src/types.ts:513-514`). The `#` fold's vacated tail is the one thing that does not, because the resolver abstains on it (`packages/score-parser/src/diction-marks.ts:209-210`, `:272`; `score/vowel-resolver.ts:653`). **Record the leftover the same way, with a test that the resolver returns no vowel there.** Without it the resolver sustains the last vowel across the leftover and "Ilya invents no melisma" is false in the numbers while true on the page.

## Where the freed note goes, amendment 10

**Forward fusion:** the fused unit takes the clitic's own note and the tail closes up, so the page matches the print and the leftover falls at the end of the run (Dann's walk, 2026-09-04).

**Backward fusion closes up too:** the tail moves onto the fragment's own note, **unless a tie, an extender, or a slur under the gate claims that note**.

**No host in the verse, or a syllable the cascade pushes off the end, amendment 11:** the text leaves the notes and goes into the record with its bar. It is never dropped in silence and never seated somewhere to be rid of it.

## Step 0, rewritten on amendment 5

**The five conditions at `clitic-seat.ts:242-287` are struck from this lane, and the reason is that the rule has absorbed them.** Conditions 1 to 3 (`:268-278`) are this test and this direction. Conditions 4 and 5 (`:280-287`) ask whether the file and the pipeline's queue agree, which the count now answers, and condition 5 refuses files the rule repairs. **DESK DEFAULT, Dann's to overrule**, under his ruling of 03:15 that a ruling is a default with a reason and not a gate.

**The repair is a re-deal, per Cyrillic verse, on the `ParsedScore`.** The notes that held text keep their places; the tokens are fused and divided; the syllables are dealt back in order; what is left at either end is counted. A fusion and a later division cancel by themselves. **No import of `$lib/pipeline` into the ingestion seam.**

**Report, before building:** what in `clitic-seat.ts` no arrived file reaches once this lands. `findCliticFolds` loses its last caller on an arrived file. **Delete nothing**; that is a later tier 1 lane.

## The four items

1. **The parser reads the print's mark for a held note.** `packages/score-parser/src/musicxml-parser.ts` reads `<syllabic>`, `<text>`, and `<elision>` (`:796-806`, `:872-881`) and no `<extend>`. Build it, adopting the span at `omr/extend-convention.ts:64-67` rather than a second idea of one, and say which reading wins where a file Ilya wrote carries both.
2. **The vowel test on every token under a note**, in both directions, scoped and normalized as above.
3. **The count and the melisma evidence.** Tie, extender, or slur under the existing gate. **On an MNX file there are no slurs** (`packages/score-parser/src/types.ts:530`); the evidence there is tie and extender only, and the report says so rather than reporting a slur count of zero as agreement.
4. **What is left over is recorded, never covered**, in the carrier above, each place with its bars and its reason. **No string a singer reads is added here**; the telling belongs to slice 6R of `plan-corrections-build_r2_2026-11-05.md`, which Dann ruled in at 02:35.

## The tests that assert today's fold, amendment 4

**Rewritten in the behaviour commit**, not after it: `ingestion/fixture-rule.test.ts:447-456` (the close-up: with `at` the lone «в», `after[at]` is «в» + U+00A0 + `raw[at+1]`, `after[at+k]` is `raw[at+k+1]` to the end, and the last note is null and recorded), `ingestion/vowelless-fold.test.ts:19-23`, `:25-28`, `:30-33`, and `analysis/diction-fold-live.test.ts:102-112`.

**Removed:** the `many-vowels` filter at `ingestion/fixture-rule.test.ts:428-429`. Its comment says "A note of two vowels is another rule"; under this lane it is this rule, and the filter would hide a division the lane failed to make.

## What the kept fixtures must show

- **`sunless-01-finale-lone-v.musicxml`**, byte for byte as Finale printed it: 97 sung notes against the engraved copy's 96, so **after the test and the count there is damage this lane cannot repair**, recorded with its bars. A lane reporting a clean repair here has misread something.
- **`sunless-01-engraved.musicxml`**, the same song repaired against Dann's print: **after arrival, 96 syllables on 96 notes, no `many-vowels`, and nothing recorded.** This is the lane's only proof that dividing and fusing leave a correct file alone.
- **`packages/score-parser/src/fixtures/n188-markings.musicxml`**: its texts run `жи`, `знь`, so «знь» fuses backward and the note sings «жизнь». `fixture-rule.test.ts:458-463` keeps passing.
- **The two lone `#`** of the Finale copy's IPA verse, at its sung notes 19 and 80: untouched by this lane and still folded by `foldDictionMarks`.

## Done when

- **The only notes left with no syllable are the leftovers the count names**, and each is recorded so the resolver abstains on it.
- Ilya invents no melisma and no syllable anywhere on the file path.
- A file whose print marks a held note is read as holding it, proved by a fixture carrying `<extend>`.
- The eight gates at their baselines except gate 4, which rises; name the new figure. **Gate 4's baseline moved on 2026-11-24 to `6810 passed | 1 skipped (6811)`.**
- `fixture-rule.test.ts` passes with no new allow-list entry.
- No ratchet ceiling raised, nothing under `docs/memory/` touched, no committed approval or golden file changed.
- **The behaviour baseline's families 1 to 5 are re-captured and every difference listed and explained.**

## What this lane must not do

Repair a note count. Invent a melisma or a syllable. Split text at a hyphen to make a syllable. Import `$lib/pipeline` into the ingestion seam. Delete what becomes unreachable in `clitic-seat.ts`. Touch `score/reconciliation/`, `VocalLineEvent`, or `analyzePerVerse`. Rebuild `fixture-rule.test.ts`.

## Cost and conduct

Sonnet. **Cap 350,000 tokens.** Step 0 reported before any item; one commit per item. Push to its own branch only. Stage by explicit path. No `.bak`. No subagents. `ls docs/sessions/` before naming the report.

**NOT ESTABLISHED beats a complete invented answer.**

## Style

Canadian spelling, the Oxford comma, no em dashes, sentence case headings, no `simply`, `just`, `easy`, and no exclamation marks.
