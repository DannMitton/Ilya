# Report: row 181, step 4 (`poem-join.ts`, pure, with tests), Code, r1, 2026-11-04

Branch `cloud-lane-34`, on top of the merge of `origin/Shane` at `f8ae34ba` and the `?looks=off` commit (`8c7829db`). Step 4 starts with Dann's taste answer 2 (brief section 9): a run the count rule refuses draws nothing on the page; its empty notes and the banner's bar open the Loupe. **Nothing here is a row 114 count**; the join has no input from a scan until step 5 wires it. NOT ESTABLISHED marks what I could not establish.

## 0. The `?looks=off` switch (the small commit before step 4)

`?words=read&looks=off` turns the second look off; the default is on. It is `looksOn` in `omr/underlay-switch.ts`, read through a new optional part `looksOn` of `makeUnderlayReader` (`omr/underlay-reader.ts`), supplied by `omr/underlay-client.ts`. It changes no stamp, so a reading kept with it off is current with it on: **read the scan fresh for each arm** (and for `?extender=b`, and after steps 1 and 2 changed the reader before step 3 moved the stamp). Tested: the address reading, the stamp's independence, and a read with the looks off that asks the Worker for nothing and leaves the system unread. Commit `8c7829db`.

## 1. What changed

| File | What |
|---|---|
| `text/poem-join.ts` (new, 372 lines) | `planJoin`, `applyProposals`, `crossCheck`, and their types; the tiers, the runs, the confusion table, the alignment |
| `text/poem-join.test.ts` (new, 28 tests) | the cases in section 4 |

No other file changed in this step. The join reads `comparePoem` (`text/poem-compare.ts:162`), `fold` (`:84`), and `vowelsPerNote` (`omr/vowels-per-note.ts:73`); it writes nothing.

## 2. How the join works

- **Input.** LYRICS and POEM as text; the provenance of each LYRICS token (`by`); two injected functions, `slotsOf` (the slots `buildSlotQueue` gives a list of words laid out as one text) and `isWord` (the dictionary after normalizing: `Seams.isWord`); and the runs (blank notes or an unread system) with the LYRICS words they follow and precede. The page builds `slotsOf` and the runs in step 5.
- **The count (amendment 7).** Every syllable count is a count of slots from `slotsOf`, never `syllabify`'s length. A word with no vowel (a clitic) has none and fuses to its host. The one-vowel check on every proposal is `vowelsPerNote` over the slots the proposal would seat: there is no vowel list in the file.
- **The alignment.** `comparePoem`'s pairs are the exact matches. Between two pairs, the unmatched LYRICS words and unmatched POEM words (the gap) are aligned one to one by position where both sides have the same count, else by edit distance with a cost of leaving a word out (`NEAR` = 0.5 of the word's length for a match, `GAP` = 0.5). A LYRICS word left over, standing between pairs (i, p) and (j, q), whose folded form equals or is one confusion pair from a POEM word in p..q, is a repeat and takes that word as its aligned word (amendment 10).
- **The tiers (amendment 5).** Tier 1, repair, applied and marked: the scan's word fails the dictionary, the poem's passes, the slot counts are equal. The 2026-10-20 character-set test is **not** a gate. Tier 3, offer: both real and one letter or one confusion pair apart (tested before tier 2, or «иль» would be kept and never offered); or the scan's word fails, the poem's passes, and the slot counts differ; or both fail. Tier 2, keep the composer's word: both real and not close, or the scan's real and the poem's not in the dictionary. A hand word is tested and gets an offer only where provably wrong (a character outside the modern alphabet, or one confusion pair from the poem's word); never applied.
- **The runs (amendment 6, 8; answer 2).** A run between two aligned words (poem tokens p and q) takes the poem's words p+1 .. q-1 where their slot count is one of the run's counts. A blank run has one count; an unread system has two (ties alone, ties with the slur), and the fill is proposed where the stretch's count equals one of them. Otherwise it is an **offer** (`count-refused`, with the words named so the Loupe's button can insert them), nothing applied. Also offers: q = p+1 (a composer's repeat with no words read), anchors out of order, an unaligned anchor, a run inside one word, and no poem. The song's start and end are anchors. **A refused run proposes nothing on the page** (answer 2); the proposal list is the Loupe's data.
- **`applyProposals`.** Returns the LYRICS text the repairs and fills make and where each written word stands. A repair puts the poem's letters in place of the scan's and keeps the scan's own punctuation at the word's ends; a fill inserts the poem's words with their own punctuation after the word the run follows. `keep-composer` and `offer` apply nothing. The page sends this text through the path a typed edit takes (step 5), so the seats follow by `score/reseat.ts` (an inserted word takes open notes, a replaced word takes the notes the old one vacated).
- **The cross-check (Dann 10:36, item 7).** `crossCheck` applies the plan, runs the tiers again on the result, and counts a repair found the second time as a fault. It does not loop. The runs are not re-checked in the pure form because the notes they stand on are not in this module; step 5's page-level re-run on the real post-application state is the check that sees them.

## 3. Departures and judgement

- **Syllables inside a paired word (original 4.2).** I do not pair syllables one to one inside a word. A repair replaces the whole word and is applied only where the slot counts are equal, so the notes the old word held take the new word's syllables one to one by the reseat. A word whose counts differ is left as the print gave it, with an offer. This is the brief's rule ("otherwise the word is not repaired syllable by syllable, and Lyrics keeps it") reached at the word.
- **Phrase-end jumps (original 4.1) are NOT BUILT.** The LCS never makes a jump, and the repeat window (amendment 10) covers the repeats the review named. `phraseEnd` (row 108's `score/phrase-ends.ts`) is not read. If a walk finds a repeated passage that the window misses, that is where it comes in.
- **Provenance `by` (amendment 11)** is an input here and is stored in step 5.
- **JUDGEMENT, not measured, and named where each stands:** `NEAR` and `GAP` (the gap alignment); the confusion table (`ин пн оа ес шщ ий ьъ тг лд бв чу цщ еэ ыи зв`). `OPEN.md` stage 3 item 9 says the measure on row 114's truth files sets the real list; mine is a placeholder. The table holds substitutions only, as the ruling says.
- **The tiers' dictionary** is whatever `isWord` the page passes; the three recorded misses of poetic and archaic forms (`OPEN.md` stage 3 item 9: QUEUE row 91, N.12, N.181) are the dictionary's, not the join's. A poetic word the dictionary lacks will be read as failing, and the poem's word offered or applied. That is how the tiers are written.

## 4. Tests (28)

The walk's six cases: a garbled word repaired (and with its punctuation kept; and not gated on the character set); the composer's word kept («иль» offered and not applied; «дума» against «мысль» kept; a poetic form not in the dictionary kept); a hand-edited word never repaired and offered only when provably wrong; a blank run filled, refused, at the song's start and end, an unread system on both counts; and the repeat and the omission (a plain repeat proposes nothing; a garbled repeat is repaired from the word it stands for; an omission with no run proposes nothing). The one-vowel refusals (a slot of two vowels, a slot of none; for a repair and for a fill). Mutants on the tier order (the real-close offer before the keep) and the bracket (a count one over or one under the poem's words must not pass). Cross-check: nothing to repair twice; a fault when the plan did not apply. Determinism, and the poem is never written. The brief's "a blank under an extender stays blank" is a property of how the page builds the runs (an extender note is a continuation and is never in a run): step 5 tests it where the runs are built.

## 5. Gates (this sandbox, Linux)

| Gate | Result |
|---|---|
| web unit | **4297 passed, 1 skipped** (240 files). After step 3: 4267. +30 tests (28 join, 1 looks-off in the reader, 1 in the switch), +1 file; the merge brought in docs only |
| web-check (`svelte-check`) | 0 errors, 12 warnings (equal to baseline) |
| ratchets | OK. `+page.svelte` 5586 (not touched), `pipeline.ts` 925, `pairings.ts` 1420 |
| others | not run: nothing outside `apps/web` changed |

## 6. Not established

How well the tiers do on real scans (the measure is step 7 and the desk's); the confusion list and `NEAR`; whether the equal-count gap alignment (the evidence is two matching anchors) ever pairs a composer's changed word with a misread one wrongly (the tiers 2 and 3 are the guard, and the cross-check); whether `phraseEnd` is needed.
