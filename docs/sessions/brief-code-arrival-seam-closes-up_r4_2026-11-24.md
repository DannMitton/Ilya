# Brief: one test decides every note, and what it cannot decide goes to Corrections (Code, cloud lane), r4

Written by the desk (Opus 5), 2026-11-24 03:2x. **r1, r2, and r3 were each stopped by Fable** and are superseded and kept; r3's "no claim" outcome in particular does not exist and no later desk revives it. **Tier 4: this lane changes behaviour on purpose.** It does not start until `cloud-lane-86`'s behaviour baseline is committed.

## The rule this lane builds, derived with Dann 2026-11-24 03:15 to 03:19

**A syllable is a vowel with the consonants attached to it. Nothing else is a syllable.** A token between spaces or hyphens in a `<lyric>` is whatever the engraver typed; what makes it a syllable is one vowel nucleus.

**So one test decides every note: count the vowel letters in the text under it.**

- **None.** The token is a fragment, not a syllable, and it joins its neighbour in the direction its own nature gives: a word-final fragment backward (`знь` onto `жи`, so the note sings `жизнь`), a proclitic forward (`в` onto `бью`), a break mark backward like an enclitic. **Fusing gives a note back.**
- **One.** A syllable. It takes its note.
- **Two or more.** Two or more adjacent syllables sitting on one note. The division falls between the nuclei and the later syllable takes the next note, cascading. **Dividing asks for a note.**

**The test is safe because sung Russian has no true polyvowel diphthong**, only vowel plus glide, and the glide is a consonant (Dann 03:18). Ilya's own vowel set already matches: ten vowel letters plus the three pre-reform ones, «й» excluded (`apps/web/src/lib/score/vowel-resolver.ts:159`).

**Then one count decides the rest.** Syllables against sung notes.

- **Equal:** seat, one vowel per note.
- **More notes than syllables:** a surplus note is a melisma ONLY where the print says so, by a tie, by an extension line, or by a slur under the count gate at `score/slur-seat.ts:55-70`. **Ilya invents no melisma.**
- **Anything left over, in either direction:** damage in the file. **Ilya invents no syllable and no melisma to cover it.** It counts the place and hands it to Corrections, which exists to give the singer agency to repair what Ilya cannot (Dann 03:05).

**Fusing never waits on evidence** (Dann 02:31: «в» always concatenates to its host). Only where the freed note goes is conditional.

## Where the freed note goes

Fusing frees a note. Two placements are lawful, both leave exactly one note of the run carrying no syllable, and the difference is where a singer meets it.

**This lane takes the close-up:** the fused unit sits on the clitic's own note and the tail moves up by one, so the page matches the print and the leftover falls at the end of the run. That is Dann's walk of 2026-09-04, and it is the one that stops a whole song reading one note late. **The leftover note is counted and handed to Corrections like any other.**

**The alternative, for the record and not for this lane:** leave the freed note where the clitic was, which is today's behaviour and is pinned at `apps/web/src/lib/score/ingestion/fixture-rule.test.ts:447-456`. **That pin changes with this lane, in the same commit as the behaviour**, to assert the close-up and the counted leftover. Changing it is the point of the lane, not a side effect.

## Step 0. Settle where the repair lives, and report before building

`foldVowelessSyllables` takes a `ParsedScore` (`ingestion/vowelless-fold.ts:83`), and so does `findCliticFolds` (`clitic-seat.ts:146`), so the object is settled: **`ParsedScore`**. What is not settled is how the five conditions at `clitic-seat.ts:242-258`, which need the pipeline's queue (`:260-287`), reach a repair that runs at arrival. Report the two candidate shapes with their costs and take one. **By reading, not run: the page's clitic seat already finds nothing on an arrived file** (`ingestion/ingest.ts:337`, `routes/+page.svelte:561`, `clitic-seat.ts:270-272`), so nothing is lost by moving the work and something is lost by leaving it.

## The four items

1. **The parser reads the print's mark for a held note.** `packages/score-parser/src/musicxml-parser.ts` reads `<syllabic>`, `<text>`, and `<elision>` (`:796-806`, `:872-881`) and no `<extend>`. Build it, adopting the span at `omr/extend-convention.ts:64-67` rather than a second idea of one, and say which reading wins where a file Ilya wrote carries both.
2. **The vowel test, applied to every token under a note on the file path**, in both directions: fuse a fragment, divide a two-vowel token. The division is the engine's, under Grayson's rules, and never a split of the text at a hyphen or a space. **No hand-rolled phonological predicate** (`CONTRACT.md` section 8).
3. **The count, and the melisma evidence.** Tie, extender, or slur under the existing gate. **On an MNX file there are no slurs** (`packages/score-parser/src/types.ts:530`), so the evidence there is tie and extender only; say so rather than reporting a slur count of zero as agreement.
4. **What is left over is counted, never covered.** Each place with its bars and its reason, in the shape the scan path already reports (`omr/vowels-per-note.ts:73`, `omr/underlay-page.ts:424`), so one reader serves both. **No string a singer reads is added here**; the telling belongs to slice 6 of `plan-corrections-build_r2_2026-11-05.md`, which Dann ruled in at 02:35.

## What the kept fixtures must show

- **`sunless-01-finale-lone-v.musicxml`**, kept byte for byte as Finale printed it: 97 sung notes against the engraved copy's 96, so **after the vowel test and the count there is damage this lane cannot repair**, and the report names it. A lane that reports a clean repair here has misread something.
- **`packages/score-parser/src/fixtures/n188-markings.musicxml`**: its texts run `жи`, `знь`, so «знь» fuses BACKWARD and the note sings «жизнь». The pins at `fixture-rule.test.ts:458-463` already assert that and must keep passing.
- **The two lone `#` of the Finale copy's IPA verse**, at its sung notes 19 and 80 (desk count, 2026-11-24): fused backward like an enclitic, never left alone under a note.

## Done when

- Every token under a note on the file path holds exactly one vowel, or the place is counted with its bars and its reason.
- Ilya empties no note anywhere on that path, and invents no melisma and no syllable.
- The close-up is proved on the Finale copy, and the leftover note is counted rather than hidden.
- `fixture-rule.test.ts` passes with no new allow-list entry, its `:447-456` pin rewritten in the behaviour commit.
- The eight gates at their baselines except gate 4, which rises; name the new figure.
- No ratchet ceiling raised, nothing under `docs/memory/` touched, no committed approval or golden file changed.
- **The behaviour baseline's families 1 to 5 are re-captured and every difference listed and explained.**

## What this lane must not do

Repair a note count. Invent a melisma or a syllable. Split text at a hyphen to make a syllable. Delete what becomes unreachable in `clitic-seat.ts`: report it with line counts for a later tier 1 lane. Touch `score/reconciliation/`, `VocalLineEvent`, or `analyzePerVerse`. Rebuild `fixture-rule.test.ts`.

## Cost and conduct

Sonnet. **Cap 350,000 tokens.** Step 0 reported before any item; one commit per item. Push to its own branch only. Stage by explicit path. No `.bak`. No subagents. `ls docs/sessions/` before naming the report.

**NOT ESTABLISHED beats a complete invented answer.**

## Style

Canadian spelling, the Oxford comma, no em dashes, sentence case headings, no `simply`, `just`, `easy`, and no exclamation marks.
