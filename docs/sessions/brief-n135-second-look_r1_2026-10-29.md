# Brief: N.135, the reader's second look, r1 (desk, Opus, 2026-10-29)

A design and a phased plan, for an antagonistic review before Dann decides whether and how to build it. Phase 0 is measure only and may be run by a desk helper; phases 1 to 3 become Code briefs only after Phase 0's numbers and Dann's decision. "Second look" is the desk's coined name for the whole; "confusion table", "post-reading correction", and "orthotactics" are adopted terms.

## 0. Why, in the singer's terms

A singer drops a scan and expects the words under the notes. Today, on the 18 build songs through the app's own page code (stage 2b r5 at step 7, replay on A2's captures, the desk's measure 2026-10-29), Ilya reads 1,880 of 2,538 printed syllables right. Of the 658 it misses: 425 lie where the reader split one printed syllable into pieces or merged several into one; 198 are read as one syllable with wrong letters; 35 are not read at all (`~/Downloads/_desk-2026-10-29/confusion-table_2026-10-29.tgz`, `confusion.json`).

Dann, 2026-10-29 16:12 (`docs/memory/INBOX.md`): the singer will always correct some errors; the aim is *"Fewer necessary corrections is better than more."* He asked that a misread making a different real word be anticipated and flagged by its context. This brief serves the 198 wrong-letter syllables and that flag. It does not serve the 425 split or merged ones (section 8).

## 1. What already exists (read this session, line by line)

- The reader's seams: `makeSeams(known, cut, modern, clitics)` (`apps/web/src/lib/underlay-seams.ts:34`), supplied in the app with `isKnownWord`, `GraysonEngine.syllabify`, and `modernisePreReform` (`:81`); `isKnownWord` is `apps/web/src/lib/pipeline.ts:225`.
- The page: `seatPage` (`apps/web/src/lib/omr/underlay-page.ts:152`) seats tokens; `sewWords` (`apps/web/src/lib/omr/underlay-words.ts:101`) joins syllables into words; `writeLyrics` (`:208`) writes the MusicXML. Step 7's counts (`omr/underlay-counts.ts:40-52`) and step 6's `vowelsPerNote` report and change nothing.
- `apps/web/src/lib/score/ingestion/ocr-guard.ts` judges a whole OCR'd poem (refused when most tokens of three letters or more are unknown, `:1-35`, `:71`); it repairs nothing and does not run on the underlay.
- The ratified text-seating design (`docs/memory/OPEN.md`, "N.135 STAGE 3, HOW ILYA SEATS TEXT ON NOTES", ruled 2026-10-20 22:43) already defines three tiers for a scan's word against **the poem's** aligned word: tier 1 repaired at once, quietly, reversible in one tap, with a dotted underline and a count on Lyrics' receipt line; tier 2 the composer's, marked; tier 3 shown, never applied. Over all of it: *"A manual edit always outranks an automatic repair"* (a default, not a wall). Tier 1 already allows evidence of "letter confusions the reader is known to make". THE LIMIT (same file): Ilya changes only spelling that leaves the sound unchanged.
- Dictionary size: `data/dictionary.86d83340-a.json` and `-b.json`, 47,485,378 and 48,896,620 bytes, already shipped and loaded.

## 2. The design: the same tiers, with no poem

When a poem is present, stage 3's tiers govern and nothing here changes them. When there is none (the common case for a scan), the second look supplies the evidence the poem would have given:

**Evidence, per read word (after `sewWords`):**
1. **Dictionary:** does the word pass `isKnownWord`, after `modernisePreReform`?
2. **Confusion candidates:** every word reachable by swapping letters only along measured confusion pairs (section 3), at most two swaps, that passes the dictionary.
3. **Notes:** the candidate's syllable count (`syllabify`) equals the number of notes the read word was seated on. A candidate that changes the count is not a candidate.
4. **Orthotactic score:** the likelihood of the candidate's letter trigrams, counted from Ilya's own dictionary at build time; a score that ranks, never a gate (Dann agreed 2026-10-29 16:08).
5. **Letter check (Phase 2 only):** for a pair whose distinguishing stroke is known (Dann 2026-10-29 15:56: и, н, п differ only in the connector between two stems), look at the letter's patch of the page for that stroke.

**Tiers, mirroring stage 3 (tier 3 tested before tier 1, as stage 3's Fable finding 1 orders it):**
- **Repair (stage 3 tier 1's shape):** the read word fails the dictionary; exactly one candidate passes all three of 2 to 4, or one leads the next by a margin Phase 0 sets; repaired quietly, dotted underline, one tap to revert, counted on the receipt line.
- **Flag (stage 3 tier 3's shape):** the read word passes the dictionary **and** a confusion candidate also passes and fits the notes (a "confusion twin"); or the read word fails and two or more candidates tie. Shown with its alternatives, never applied. Only words with a confusion twin are flagged, never every uncertain word (`CONTRACT.md` §8: a mark on everything says nothing).
- **Leave:** everything else.
- A word the singer typed or placed by hand is never repaired (stage 3's rule over all of it).

**What the singer sees:** nothing new for a repair beyond stage 3's dotted underline and receipt count; for a flag, stage 3's tier 3 offer. The strings are stage 3's, already owed as desk drafts; this brief adds none. The Text view is unchanged (`CONTRACT.md` §0.1, scope, 2026-10-29 01:23).

## 3. The confusion table becomes data

From Phase 0 (section 5), a small JSON file of pairs with counts, printed to read, measured on the build songs' readings, never on row 114's sealed songs. Today's counts (one-to-one misreads, 198): ь→ъ 14; ы→ъ, ь, ът, ьт 16; й→и, н, ш 13; с→е 10; и→н 9; г→т 7, and г dropped 7; о→с 3, с→о 2, п→н 2. A pair seen fewer than 3 times is not used (DESK DEFAULT, set by Phase 0). The table is per reader version: a new model (row 105) means a new table, measured the same way, before it ships.

## 4. Footprint

Code: one pure module under `apps/web/src/lib/omr/` plus its tests. Data: the confusion table (expected under 10 KB) and the trigram table (DESK INFERENCE: tens to a few hundred KB, measured in Phase 1 and told to Dann in bytes before anything enters `static/`, `CONTRACT.md` §8). No new model. The dictionary is already loaded. Phase 2's letter check is code only.

## 5. Phase 0: measure first, nothing built (desk helper, Sonnet)

On A2's captures through the replay (`~/Downloads/_desk-2026-10-29/replay-scripts_2026-10-29.tgz`, `real7.mjs` in `confusion-table_2026-10-29.tgz`), at `cloud-lane-21` `5ee29ec2`, with Ilya's real dictionary and syllabifier:
1. **The word-level split.** Of the read words that are wrong, how many fail the dictionary (repair's ground), how many pass (a different real word: flag's ground), and how many of each have the right word among their confusion candidates that fit the notes.
2. **The oracle and the real yield.** Apply the repair rule offline to every read word and score read right and (b) with A2's scorer: how many repairs are right, how many wrong, and the net against 1,880 / 1,710. Sweep the margin and the minimum pair count; report the table. For comparison: the 2026-10-27 note-count witness, which swapped any letter for any letter, fixed 40 words and broke 32 (`report-desk-n135-note-witness_r1_2026-10-27.md`).
3. **The flag count.** How many words per song would be flagged, and how many of those are truly wrong. A flag rate that marks most words fails `CONTRACT.md` §8.
4. **Orthotactic score's share:** with and without item 4 of the evidence.
5. **Letter-check feasibility (pairs и/н/п and ь/ъ only):** on the build songs' crops, for each misread of those pairs, is the distinguishing stroke present as grey ink in the patch (recoverable) or gone (not)? Count both.
6. **Italic:** count the build songs' and row 114's printed syllables set in italic (Dann's point of 16:01; all six training fonts were upright, `report-code-prereform-model_r1_2026-10-12.md:35-40`). If non-zero, row 105's next brief adds italic faces.

Positive controls first: the replay reproduces 1,880 / 1,710 / 1,870 / 640 / 79 at `d6db949a`; the confusion table's 198 / 425 / 35 reproduce.

**Decision gate for Dann after Phase 0:** build Phase 1 only if the net gain is positive with wrong repairs under one in ten repairs (DESK DEFAULT, his to change), and the flag rate stays under one word in twenty per song (DESK DEFAULT).

## 6. Phase 1: the module (Code, cloud lane, after Phase 0 and Dann's yes)

`secondLook(words, seats, seams, table)` in `omr/`, pure, between `sewWords` and `writeLyrics`; returns the words, each with `repaired: {from, to, evidence}` or `flagged: {alternatives}`, and counts for the reader's console line. Behind the same hidden switch as stage 2b's reader. `UNDERLAY_READER` raised one version (`omr/stamp.ts`), so readings kept with `underlay@2` are read again. The trigram table built from the dictionary by a script at build time; its bytes reported. The repaired and flagged marks reach Lyrics through stage 3's provenance (stage 3's precondition (a): a hand-or-not fact per word, not stored today, `pairings.ts:119-128`), so Phase 1 waits on, or carries, that precondition; the review should say which.

## 7. Phase 2 and 3

- **Phase 2:** the letter check (evidence 5), only for pairs Phase 0 item 5 shows recoverable.
- **Phase 3:** the singer-facing flag and its review, built with stage 3's tier 3 offer, its strings ratified by Dann EN and FR before build.

## 8. What this does not do

- The 425 split or merged syllables: a separate row (the reader's syllable breaks, the token-splitting report of 2026-10-28); the largest loss.
- Better letters at the source: row 105 (r5, the Mac, tonight).
- Context sense from a Russian language model: not proposed; footprint (DESK INFERENCE: the confusion twins, the notes, and the singer cover most of it).
- The poem as a source: stage 3, and Dann's open ethics question of 2026-10-28 15:48.

## 9. Cross-site line (`CONTRACT.md` §4)

Phase 1 changes how a seated word's text is computed. Other sites that compute or judge a read word: `ocr-guard.ts` (`isKnownWordForGuard`, `:128`), `omr/underlay-language.ts` (the Russian-row call, which reads `isKnownWord`), `cliticCalls` (`underlay-seams.ts:57`, matches words by letters, so a repaired word must be repaired before or after it consistently), and stage 3's tiers when a poem is present. The Phase 1 brief names what depends on them agreeing.

## 10. NOT ESTABLISHED

Every yield above; the trigram table's size; whether the hand-or-not precondition must land first; whether B01 to B10 share one printed source (if so, the confusion table generalizes within it only, and row 114 is the test that counts); how often a confusion twin is truly the printed word.
