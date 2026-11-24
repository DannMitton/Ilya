# Brief: Ilya stops making a bare note, and reads the print's own evidence for a held note (Code, cloud lane), r2

Written by the desk (Opus 5), 2026-11-24 02:5x. **r1 was stopped by Fable with four blockers** (`review-fable-two-tier4-briefs_r1_2026-11-24.md`), and all four are applied. r1 is superseded and kept. **Tier 4: this lane changes behaviour on purpose.** It does not start until `cloud-lane-86`'s behaviour baseline is committed.

## What r1 got wrong, so no later desk rebuilds it

1. **r1 said `CONTRACT.md` section 0.1 had already struck the competing desk ruling of 2026-10-29. It had not.** Section 0.1 strikes a different departure (a vowelless word the transcription does not call a clitic staying a unit of its own), and `apps/web/src/lib/omr/underlay-clitics.ts:36-39` records that one as replaced. The count-only ruling at `:41-48` is a separate desk act that nothing strikes. **What governs a file is Dann's own words and nothing of the desk's:** 2026-09-04, 2026-11-02 13:46 and 14:34, and 2026-11-24 02:29 and 02:31.
2. **r1 would have replaced Dann's bounded seat with an unbounded shift.** The five conditions at `clitic-seat.ts:242-258` are each a reason to REFUSE a candidate rather than repair it, and they stay, in full. Condition 5 in particular (the file and the queue agreed up to this word) is what keeps a repair from running away down a song.
3. **r1 ordered a characterization test that already exists** (`ingestion/fixture-rule.test.ts:447-456`).
4. **r1 cited `+page.svelte:561` as a `seatCliticFolds` caller and `pairings.ts:241`; neither is right.** Every citation in this revision was read on `50315f2e`.

## The finding that reshapes the lane, measured 2026-11-24 02:5x

**The file has no bare note. Ilya makes it.**

Measured by the desk on `sunless-01-finale-lone-v.musicxml`, the copy kept byte for byte as Finale printed it: its voice part holds **97 sung notes, and every one of them carries a lyric cell**. Zero sung notes with no text, so zero for a tie or a slur to explain. The fault in the file is not a missing syllable; it is that the Cyrillic verse splits «в» from «бью» across two notes while **the file's own second verse, the IPA, already treats them as one unit and sits one note later than the Cyrillic all the way to the end**.

**Then `foldVowelessSyllables` (`ingestion/vowelless-fold.ts:115-122`) joins the text to the host, empties the clitic's note, and moves nothing else** (`:18-19`). That empty note is Ilya's own, and it is the state Dann ruled a mistake on 2026-11-02 at 14:34.

**So the order of work is the reverse of r1's.** Ilya should first be able to see which notes a print holds; then stop manufacturing a bare note; and only then close anything up.

## Item 1. The parser reads the print's mark for a held note

`packages/score-parser/src/musicxml-parser.ts` reads a `<lyric>`'s `<syllabic>`, `<text>`, and `<elision>` (`:796-806`, `:872-881`) and **no `<extend>`** (desk grep, `50315f2e`). So a file that says in standard notation "this syllable is held across these notes" is not heard.

**Build the parser path.** `apps/web/src/lib/omr/extend-convention.ts:18-20` names this as the cleaner path and says the desk may ask for it; the desk asks for it here. A `<lyric>` carrying `<extend>` marks its note as holding, and the notes it sustains become continuations.

**Ilya's own convention keeps working unchanged.** `extend-convention.ts` writes `<extend type="start"/>` plus a `ilya-extenders` field for a scan's own reading and reads it back; this item must not make that double-count. Say in the report how the two meet.

**This item alone changes nothing for the fixture above**, which carries no `<extend>` at all (desk count: 0). It is built because other software writes it and because the next item needs the idea of a continuation to be one idea.

## Item 2. A continuation is recognized from the print's evidence, by the rule Dann already set

**His ruling, 2026-10-20 03:37, transcribed as written:** *""Ilya never creates a melisma" but Ilya can detect one through slurs and observe it with it seating chocies."* **And his count gate the same minute** (*"Yes to option 1"*): a slur is observed as a melisma only where doing so makes the notes and the syllables come out even; where they disagree, one syllable per note, as today.

**What is already built:** `score/slur-seat.ts` does exactly this, and it runs on the FIRST SEATING ONLY, for a score with no words of its own (`slur-seat.ts:12-18`). A score that carries its own words goes to `seatScoreWords`, which copies the file's cells.

**What this item adds:** on the file path, a sung note that carries no cell of its own and is tied into, under a slur from a note that does, or under an extender from item 1, is a CONTINUATION. It is not a fault, it is not filled, and it is not counted as a breach. **The count gate is his and is unchanged:** where reading a slur that way does not make the counts come out even, nothing is observed and the seating is today's.

## Item 3. The bare-note check runs on the file path

`vowelsPerNote` (`omr/vowels-per-note.ts:73`) runs on the scan path (`omr/underlay-page.ts:424`) and in the poem join (`text/poem-join.ts:227`), **and nowhere on the file path** (desk grep). `ingestScoreFile` runs it over its own result, counting a sung note with no syllable only where item 2 has not called it a continuation, and reports breaches by the mechanism the scan path uses. **It counts and reports. It does not rewrite.**

## Item 4. The fold stops emptying a note, and the close-up stays bounded

Only now. `foldVowelessSyllables` fuses the clitic to its host as one unit on ONE note, and that unit takes the clitic's own note, with the tail closing up, which is Dann's 2026-09-04 ruling as `clitic-seat.ts:23-31` and `score-seat.ts:43-45` record it.

**Bounded by the five conditions at `clitic-seat.ts:242-258`, every one of them kept.** A candidate that fails any of them is REFUSED and left as the file has it, and the refusal is counted and reported by item 3. Nothing is repaired on a guess.

**Where the file carries a second verse, it is evidence and it is checked** (the fixture's IPA verse already fuses what its Cyrillic verse splits). Where the two verses disagree about a clitic, the verse that obeys one vowel per note is the one that is right, and the report says which verse decided each repair.

**Where a repair would leave any note of the song without a syllable, it is not made**, it is refused and counted. That is Fable's blocker 2 answered in the rule rather than in a special case.

## Done when

- On the kept Finale fixture, every sung note of both verses carries one vowel, and the Cyrillic verse agrees with the IPA verse note for note.
- No sung note that is not a continuation carries no syllable, in either verse, proved by item 3's check over the ingested result.
- Every candidate the five conditions refuse is counted and named in the report; none is silently repaired.
- The eight gates at their baselines except gate 4, which rises; name the new figure.
- No ratchet ceiling raised, nothing under `docs/memory/` touched, no committed approval or golden file changed.
- **The behaviour baseline's families 1 to 5 are re-captured and every difference listed and explained.**

## What this lane must not do

Delete anything, including anything in `clitic-seat.ts` that item 4 makes unreachable: report it with line counts, and deletion is its own tier 1 lane afterwards. Change any string a singer reads: **if one is needed, stop and report it.** Touch `score/reconciliation/`, `VocalLineEvent`, or `analyzePerVerse`. Rebuild `ingestion/fixture-rule.test.ts`, which already guards every tracked score.

## Cost and conduct

Sonnet. **Cap 350,000 tokens.** One commit per item. Push to its own branch only. Stage by explicit path. No `.bak`. No subagents. `ls docs/sessions/` before naming the report.

**NOT ESTABLISHED beats a complete invented answer.**

## Style

Canadian spelling, the Oxford comma, no em dashes, sentence case headings, no `simply`, `just`, `easy`, and no exclamation marks.
