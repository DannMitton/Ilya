# Brief: the arrival seam closes up, and the bare-note check runs on every path (Code, cloud lane), r1

Written by the desk (Opus 5), 2026-11-24 02:2x, from `read-fable-n204-unit-f_r1_2026-11-24.md` finding F4-1. **Tier 4: this lane changes behaviour on purpose.** It does not start until `cloud-lane-86`'s behaviour baseline is committed (plan r9 step 8), so that its before and after can be shown.

## What a singer meets today, and what she will meet after

**The premise, corrected by Dann 2026-11-24 02:29, and the desk had it backwards.** A correctly engraved score NEVER gives a vowelless clitic a note of its own, because a singer sings on the vowel and no pitch is sustainable without one. So «в» alone under a note is always a fault in the FILE, never a reading of the print. His words, transcribed as written: *"In order for a clitic to be printed with a note of its own, that clitic must (this is a hard rule that I keep repeating) contain a vowel... Therefore «в» can never be the sole text underlay for a note: because «в» contains no vowel."* **The file this lane is about is `sunless-01-finale-lone-v.musicxml`**, kept byte for byte as what Finale printed: the lone «в» on its own note and every syllable after it one note late. **`sunless-01-engraved.musicxml` is NOT that file any more**: it was repaired and its bar 8 holds «в бью» on one note (desk read, 2026-11-24). A guard already exists and this lane does not rebuild it: `apps/web/src/lib/score/ingestion/fixture-rule.test.ts` fails any tracked MusicXML with Cyrillic lyrics that breaks the rule, and its allow-list names the test that needs each breach.

So: a converter's output or an export sets «в» alone on one note and «бью» on the next, where the print sets them as one fused unit on one note. **Today** Ilya joins them as «в бью» on the SECOND note and leaves the first note with nothing to sing, and every later syllable in the song stays one note to the right of where the print puts it. **After this lane** the first note takes «в бью», every later syllable closes up by one, and the page matches the print.

## The ruling that governs, and it is already written down

Three rulings meet at this seam and the read handed the choice to the desk. **The desk rules that Dann's of 2026-09-04 governs, because `CONTRACT.md` section 0.1 has already struck the one that competes with it**, in these words: *"The desk departure of 2026-10-29 (`underlay-clitics.ts:28-33`) broke this and is removed by `../sessions/brief-code-n135-scan-vowelless-and-far-tokens_r2_2026-11-02.md`."*

**That removal has not happened.** The departure is live on `50315f2e` at `apps/web/src/lib/omr/underlay-clitics.ts:41-48`, read by the desk this session, in its own words: a clitic "ALWAYS joins its host, and the note the print may have given it is left empty."

**And Dann has ruled twice more that the result is a mistake:** 2026-11-02 14:34, a sung note that is not a continuation and carries no syllable is a mistake, counted by the same check (`CONTRACT.md` section 0.1); and 2026-11-02 13:46, NO EXCEPTIONS.

**So: nothing in this lane rests on a judgement of the desk's about which behaviour is right.** The desk's judgement is only that the already-written ruling applies here, where no file had noticed it did.

## The three items

### 1. The arrival fold closes up instead of emptying a note

`apps/web/src/lib/score/ingestion/vowelless-fold.ts`. Today `foldVowelessSyllables` (`:83`) joins the clitic's text to the host and empties the clitic's own note (`:115-122`), and says in its own header that no later syllable moves (`:18-19`).

**After:** the fused unit takes the FIRST of the two notes, as `CONTRACT.md` section 0.1 defines it (proclitic + U+00A0 + initial syllable), and every later syllable in that voice closes up by one note. The joiner is U+00A0, as `pairings.ts:224-226` and `:241` already build it.

**The enclitic case is the mirror and is included:** terminal syllable + U+00A0 + enclitic takes the terminal syllable's note.

**`#` is an enclitic** and is never alone on a note (`CONTRACT.md` section 0.1).

### 2. The check that counts a bare note runs on the file path

`vowelsPerNote` (`apps/web/src/lib/omr/vowels-per-note.ts:73`) is called on the scan path at `apps/web/src/lib/omr/underlay-page.ts:424` and in the poem join at `apps/web/src/lib/text/poem-join.ts:227`, and **nowhere on the file-ingestion path** (desk grep, `50315f2e`). So a file that arrives with a bare note is not counted as a breach anywhere.

**After:** `ingestScoreFile` runs the same check over its result and reports its breaches by the same mechanism the scan path uses. **The check refuses a vowelless syllable, a many-vowel syllable, and a sung note with no syllable that is not a continuation** (tied into, under a slur's melisma, under an extender), which is the whole of section 0.1's "no more and no less".

**It counts and reports; it does not silently rewrite.** Where the fold of item 1 has done its work there should be no breach left to count, and a breach that survives is the finding.

### 3. The clitic seat and its wiring, once item 1 lands

`seatCliticFolds` (`apps/web/src/lib/score/clitic-seat.ts:455-465`) looks for a word whose single cell holds no vowel (`:268-269`). After item 1 no such cell reaches it, so it returns its input unchanged on every call. Its callers are `apps/web/src/routes/+page.svelte:561`, `:687`, `:690`, `:2007`, `:2730`, `:2874`.

**Do not delete anything in this item.** Report, with line counts, exactly what becomes unreachable once item 1 lands, and what still has a caller. Deletion is a separate tier 1 lane after this one is walked, because a deletion made in the same lane as a behaviour change cannot be told apart from it in the baseline.

## Why the tests do not show any of this today

The clitic tests read the lone-«в» fixture straight from the parser and never through the arrival seam (`row108.support.ts:37-40`, `:43-49`).

**So this lane's first step is a characterization test**: run the lone-«в» fixture through `ingestScoreFile` and assert what happens TODAY, bare note and all. Then change the behaviour and change that test in the same commit, so the diff shows exactly what a singer reads differently.

## Done when

- A file whose print gives a clitic its own note arrives with the fused unit on the clitic's note and the tail closed up, proved by a test through `ingestScoreFile`.
- No note in that result carries no syllable, and the new check says so.
- The eight gates at their baselines except gate 4, which rises; name the new figure.
- No ratchet ceiling raised. Nothing under `docs/memory/` touched.
- **The behaviour baseline's families 1 to 5 are re-captured and the differences are listed and explained**, since this lane changes MELODY on purpose.

## What this lane must not do

Delete anything (item 3 reports only). Touch `score/reconciliation/`. Change `VocalLineEvent`. Make `underlay-donor.ts` the alignment engine. Change any string a singer reads: **if one is needed, stop and report it**, because strings are Dann's.

## Cost and conduct

Sonnet. **Cap 300,000 tokens.** One commit per item plus the characterization commit. Push to its own branch only. Stage by explicit path. No `.bak`. No subagents. `ls docs/sessions/` before naming the report.

**NOT ESTABLISHED beats a complete invented answer.**

## Style

Canadian spelling, the Oxford comma, no em dashes, sentence case headings, no `simply`, `just`, `easy`, and no exclamation marks.
