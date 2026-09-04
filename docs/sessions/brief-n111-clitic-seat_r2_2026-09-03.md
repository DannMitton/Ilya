# Brief: N.111, the clitic seat. For Code. Revision 2

Written 2026-09-03 by the desk, from Dann's rulings of 2026-08-04 (E.24) and
2026-09-03, and from `claude/e24-the-unused-boolean_2026-08-04.md`, read in
full. Floor: `8fbc8d7`. Commit message: `N.111: the clitic seat`.

**Revision 2, same day, on Dann's direction:** *"Do you think it would be
helpful to run such text through Ilya's transcription function before
placement? We have coded-in rules to avoid these problems that can help."*
§4 is rewritten around that. The gate in r1 is gone; the pipeline is the gate.

## 1. The rule, in Dann's words

2026-09-03: *"No vowelless word in Russian can carry a pitch duration on its
own. All vowelless clitics concatenate to their parent syllables."*

2026-08-04 (E.24 §5): *"The notes exist. Their existence is not in question.
The composer decided that. It is a question of text allocation, and seating
the right text under a single note in a way that reflects the composer's
intentions and that a musician will understand."*

The direction is a table lookup, not a heuristic: `CliticEntry.type`
(`packages/phonology/src/engine.ts:91-95`) says proclitic or enclitic.

## 2. The case, read out of the primary sources 2026-09-03

Bar 8 of *Without Sun* no. 1, the vocal line after the rest: four quarters
E C D F, then a D eighth, two rests, a C eighth.

- **The printed score** (photo, `docs/sessions/n111-sunless-01-p63_2026-09-03.jpg`)
  seats `в бью` together on the first quarter, then `щем · ся · серд` on the
  other three, `це` on the D eighth, and `на` of надежда on the C eighth.
- **Dann's engraved file** (`docs/sessions/fixtures/sunless-01-engraved.musicxml`,
  copied from `~/Downloads/Mussorgsky - Sunless 01 - Within Four Walls
  (engraved).musicxml`; notes 43 to 46 in document order) seats `в` alone on
  the E quarter, and every syllable from there to the end of the phrase sits
  one note late: `бью` on C, `щем` on D, `ся` on F, `серд` on the eighth, and
  `я,` of заветная on the B of bar 9 instead of the last F eighth of bar 8.

So the file's underlay seats a vowelless clitic alone, the engraving did it
(Finale needs a note per syllable), and Ilya today draws the file as it is:
в under its own note with no IPA, and a singer has no way to fix it. His
words: *"We need controls to account for this if it happens in the real world.
At the moment there is no way for a user to resolve this."*

The file's IPA verse (lyric 2) is one note late for a different reason, the
`#` boundary marker occupying a note of its own at notes 21 and 92. **Out of
scope here.** Do not read lyric 2 as ground truth for anything.

## 3. What exists, and what does not

Exists, read this session:

- `apps/web/src/lib/shane/pairings.ts`: `buildSlotQueue` (`:179`) fuses a
  vowelless clitic into its host's cell, IPA with no space and Cyrillic with
  a no-break space (`:194-214`); `shiftToEndOfLyric` (`:608`) and
  `shiftToNextOpenNote` (`:642`) move a run of pairings by one note;
  `firstPass` (`:250`) and `mergeOnUpload` (`:300`) seat the queue.
- `+page.svelte:1233-1234` wires the two shifts to the click surface.
- `syllable-utils.ts:300, :326` and `vowel-resolver.ts:487-507` already read
  `isVowellessClitic` and tuck the clitic's IPA into the host.

Does not exist:

- Any of the pairing layer on a score that arrives WITH words. `+page.svelte:2192-2198`
  runs `firstPass` only when the file carried no lyrics, on a comment that
  names itself an inference: *"proposing over it would be Ilya claiming where
  the score already speaks. That is an INFERENCE from R3 and N.55a together,
  not a ruling of Dann's."* Dann's ruling of 2026-09-03 overrides that
  inference for exactly one case: a vowelless clitic seated alone is not the
  score speaking, it is the file being wrong by the rule in §1.
- Any detection of a vowelless clitic seated alone.
- Any way for a singer to re-seat text on a score that has words.

## 4. Build

**The method, Dann's:** the score's own words go through the transcription
pipeline before placement, and the pipeline's syllables are what get seated.
The pipeline already fuses a vowelless clitic into its host
(`pipeline.ts`, `buildSlotQueue` at `pairings.ts:179-214`), so the seat is
not a new rule, it is the existing rule reaching the other path.

Establish first, and put the answers in the memo before writing code:

- whether `pairedCyrillic` / `withPairedVowel` already override the file's
  underlay per event id at render time on a lyric-bearing score, or whether
  that path reads the file's lyrics directly;
- how `vowel-resolver.ts` reconstructs the file's words today (its move 2),
  so N.111 reuses that reconstruction rather than writing a second one.

**Increment 1, the comparison.** At ingest of a score with words: reconstruct
the text from the lyric cells the way `vowel-resolver.ts` does, run it
through `processText`, build the slot queue with `buildSlotQueue`, and walk
the file's cells against the queue. Classify each run of divergence:

- **clitic fold**: the file has a cell whose cleaned Cyrillic carries no
  vowel and whose word the pipeline marks `isVowellessClitic`, and the queue
  has that text fused into the neighbouring slot. This is the only class
  N.111 acts on.
- **anything else** (counts differ for another reason, a composer's elision,
  a hyphenation the pipeline does not share): withheld exactly as the
  resolver withholds today (E.24 §7; do not build one-vowel-per-note).

Pin with unit tests on `sunless-01-engraved.musicxml` (one clitic fold at
note 43, host 44, `в` and `бью`; every following cell of the phrase one
note late until the queue and the cells re-align) and on the no-lyrics
control (nothing to compare). Negative control: a vowel-bearing proclitic
on its own note (на, за) is not a fold and must not be touched.

**Increment 2, the seat.** For each clitic fold, one action offered in the
Corrections station and on the note: seat the clitic with its host. Accepting
writes pairings from the queue over the run: the host's cell takes the fused
slot (`в` + NBSP + `бью`, the fused IPA), and every cell after it in the run
takes the queue's next slot, so the tail closes up onto the note the clitic
vacated; the note left over at the end of the run is undecided, never
`empty` (E.46). Ilya proposes and does not apply on its own (E.24 §6: "do
not silently re-seat the text without showing it"). Report the number of
notes that would move in the proposal sentence.

**Increment 3, the hand.** On a lyric-bearing score, the click surface the
no-lyrics path already has: click a note to move a syllable, with the two
shifts, so a singer can re-seat where the comparison did not fire. N.55b's
surface reaching the other path; do not build a second one.

## 5. What the page shows. DESK DEFAULTS, Dann's to wave off

E.24 left one thing owed: what the page shows when text is re-seated.

1. Before the singer accepts: the Corrections station lists each clitic fold
   in one sentence, English only, French owed: `в sits alone on a note. Seat
   it with бью? 5 notes move.` with one button, Seat. The note itself carries no new mark
   (CONTRACT §6: no mark that says Ilya is unsure).
2. After: the host's note reads `в бью` on the Cyrillic line with the fused
   IPA above it, the tail closes up, and the count in Corrections rises by
   the number of notes that moved, the way it already counts corrections.
   Nothing on paper distinguishes a re-seated cell from any other, because
   once the singer accepts it is the singer's decision.
3. Ilya never seats on its own, even when the rule leaves one possible
   answer. Dann can rule the other way; say so in the memo if you think he
   should, with the reason.

## 6. Constraints

- Do not change `VocalLineEvent`; do not touch
  `apps/web/src/lib/shane/reconciliation/`; do not write to `ParsedScore`.
- Do not hand-roll a phonological predicate: the pipeline, the clitic table,
  and `isVowellessClitic` are the only sources of "vowelless clitic".
- Do not propose a deliberately empty note.
- No French. Every new English string listed in the memo with its key.
- Five gates at baseline before and after, or the new counts stated for
  `ilya-ship.sh:79-80`. New tests are expected here, since the gate and the
  seat are pure functions.
- Fixtures: copy the engraved file to `docs/sessions/fixtures/` (or the
  existing fixture directory if there is one; say which) and the photo as
  named in §2. Both are untracked until Dann adds them; name them in the
  memo's `git add` line.
- Walk on a local production build: drop the engraved file on the intake,
  Score markup, find bar 8. Before: в alone on the E. Accept the seat. After:
  `в бью` on the E, `щем · ся · серд · це` on C D F and the D eighth, `на`
  on the C eighth, and `я,` on the last F eighth of bar 8. Reload: it holds.
  Screenshots before and after, described in the memo.

## 7. Return

`docs/sessions/memo-n111-clitic-seat_r1_<date>.md`, with: what changed with
`path:line`; the §4 establishment; new strings with keys; gates before and
after; the walk; a NOT ESTABLISHED section. **"NOT ESTABLISHED beats a complete
invented answer."** Do not run git.

*Revision 2, 2026-09-03, the desk. Revision 1 carried a hand-written gate in
§4; Dann replaced it with the pipeline the same hour.*
