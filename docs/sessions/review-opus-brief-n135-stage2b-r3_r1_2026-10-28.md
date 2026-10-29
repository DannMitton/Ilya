# Review: brief-code-n135-stage2b_r3_2026-10-28 (md5 a0f47a63)

I read the brief, the three measure reports, r2, and both Fable reviews in full. Everything else was targeted reads. Nothing in either tree was written. My scratch scripts are in `/home/claude/review-opus/`: `slots2.mjs`, `span2.mjs`, `inksearch2.mjs`, `boxes.mjs`, and a scratch clone `m/` used for a trial merge.

## 1. Verdict

**SEND WITH AMENDMENTS.** Steps 1 and 2 are sound. Step 3 rests on a false premise. Step 4, as written, throws away the engraver's own syllable placement on about a third of the syllables.

## 2. Lead finding

Step 3 repeats A1's claim that "homr gave no box for the piano's upper staff". The captured pages say otherwise:

- homr does box it. On these pages homr's tall box holds both piano staves, and `staffIn` keeps whichever staff most of its candidate lines fall on, which is often the lower one.
- B01 page 1: box 3 runs from y 2585 to 3063 (478 px, about 15 staff spaces). The ink lines of the upper piano staff, 2588 to 2712, lie inside it. `staffIn` returned the lower staff, top line at 2899. My command: `node --import ./reg.mjs boxes.mjs B01 B04` in `/home/claude/review-opus/`, run on A1's captured `page.raw` files.
- Over all 18 songs, 248 of 506 homr boxes are more than 2.5 times the height of the smallest box on their page (the grand staff, not a missing box).

Two consequences:

1. **The fix is the top of that box, not a new search.** homr's box top minus 1.5 spaces gives B01 p1 s2 2539 (harness 2540), B04 p1 s3 3524 (harness 3526), and B04 p2 s3 3278 (harness 3279).
2. **Step 3 as worded can do nothing.** It says to search "down to the next staff homr boxed below A". If Code stops the search at that box's top, it found a group in 0 of 23 B01 and B04 systems, falls back to today's B, and changes nothing. The brief's own test ("homr omits B") would still pass, because it models the false premise.

Step 4 has the larger risk to the singer's seating:

- It places each slot "inside its word's box in proportion to its letters". A sewn word is often several printed tokens, each standing under its own note.
- At share 0.3 that is 1,123 of 3,137 syllable tokens, in 495 words (`span2.mjs`). Step 4 as written discards their real positions.
- In 81 of those words the engine's cut differs from the print's (`со-|хра` against `сох|ра`, `ни|что` against `нич|то`): 185 syllables.
- Dann's 06:16 rule is about tokens that hold two vowels or more (230 tokens). It is not about syllables the engraver already set apart.

## 3. Amendments

**A1. Step 3, the premise and the search window. Must land.**

- **Wrong.** `:39` says "homr gave no box for the piano's upper staff in 8 of 12 B01 systems and all 11 of B04's". `:43` searches "down to the next staff homr boxed below A".
- **Evidence.**
  - `boxes.mjs`: box heights about 480 px against 140 px for a single staff. B01 p1 box 3 runs 2585 to 3063, and `staffIn` found its top line at 2899.
  - `inksearch2.mjs`: a search bounded by the box top found a group in 0 of 23 systems. A search bounded by the `staffIn` line found one in 19 of 23.
  - In B04 p1 s1 to s4 and B01 p3 s4, the topmost group across the columns sits one space above the box top: 1171 against 1203. At x 1500 the rows are 1181, 1216 … 1340, so a line one space above the staff, presumably a ledger line or note above the piano, pairs with four staff lines.
  - `metre-windows.ts:223-241`: `staffIn` keeps the staff most candidates fall on, inside the box plus a quarter of its height on each side.
- **Replacement text** for `:39`, from "homr gave no box" to the end of that sentence:

  > homr boxes the piano's grand staff as one box (on B01 p1, box 3 runs 2585 to 3063, about 15 spaces, and holds both piano staves), and `staffIn` (`metre-windows.ts:223-241`) keeps the staff most candidates fall on, which in 8 of 12 B01 systems and all 11 of B04's is the lower one, so B's top line is taken from the piano's lower staff.

  Replace `:43`'s "Search from A's bottom line … to the page's end where there is none" with:

  > Search from A's bottom line plus `MARGIN` spaces down to the bottom of the next box homr gave below A (into that box, not to its top), or to the page's end where there is none. Take the five-line group whose top line is the median across the columns that found one, never the minimum: a ledger line one space above the piano staff makes a group shifted one space up in single columns (B04 p1, 1171 against the box top 1203). Where no group is found, end the band at the top of homr's next box, then at `BELOW`.

  Add a test case:

  > a homr box twice a staff's height holding two staves, where `staffIn` returns the lower: the band ends at the upper staff's top line.

**A2. Step 3, the piano-alone claim. Must land.**

- **Wrong.** `:45` says "a two-staff system (the piano alone) holds no voice notes and gets no band (`underlay-band.ts:126`)".
- **Evidence.** K page 5 is a page of the piano alone. Its MusicXML has 1 part with `<staves>2</staves>`, and its capture has 5 systems with notes (71, 68, 57, 61, 71), each with a band. At share 0.3, systems 2 to 5 count among the 19 "systems with no Russian row" (A2), and system 1 seats 5 noise syllables. The join then removes them: `join-pages.ts:530`, `:539`, `withoutNotes`. 0 of those syllables reach `cells/d0.5_s0.3/K/K.musicxml`.
- **Replacement text** for the second sentence of `:45`:

  > On a page of the piano alone homr makes the piano the first part, so its systems do hold notes and do get bands (K page 5: five systems, all banded); the join removes their words (`join-pages.ts:530-539`, `pianoAlonePages`, `withoutNotes`). Test that a piano-alone page's words do not reach the joined MusicXML, and report how many of the 19 systems with no Russian row at the step 1 threshold are on piano-alone pages (K page 5 holds 4).

**A3. Step 4, placement keeps the print's own token boxes. Must land.**

- **Wrong.** `:51` says "Each slot becomes one unit placed inside its word's box in proportion to its letters".
- **Evidence.** `span2.mjs` over the 331 rows called Russian at 0.3:
  - 495 multi-token words, 1,123 tokens.
  - In 81 of the words where slot and token counts agree, the boundaries still differ: 185 syllables.
  - In 137 words the counts do not agree: 320 syllables.
- **Replacement text** for `:51`, from "Each slot becomes" to "as today's `mismatched`.":

  > A printed token with one vowel letter or none stays one unit at its own box, as today. A token with two vowel letters or more (the run-together case of Dann's 06:16 ruling) is cut at the slot boundaries that fall inside it, each piece placed inside that token's box in proportion to its letters, carrying the print's own letters. Where the slots' boundaries inside a word do not land on the print's token boundaries, the print's tokens stand, and the word is counted.

**A4. Step 4, the slots' letters are not the print's. Must land.**

- **Wrong.** The slots' text is modernised and has ё restored, and the brief gives no mapping back to the print.
- **Evidence.**
  - `slots2.mjs`: in 18 words the letter count changes, every one by a final ъ (`сохранишъ` to `сохраниш`). In 10 words е becomes ё (`придет` to `придёт`).
  - The modernised spelling comes from `pipeline.ts:533-537` (`readSpelling`).
  - r2 step 10 (Fable's amendment 4) rules that the words are written as read.
- **Replacement text**, appended to `:51`:

  > Take only the slot boundaries, as letter counts, from the transcription; the text comes from the print. Map a final hard sign the transcription dropped (`modernisePreReform`, `pre-reform-normalizer.ts:192`) to the last slot of its word, and treat ё for е and the pre-reform letters one for one. Count the words where the mapping fails.

**A5. Step 4, the vowel sets. Must land.**

- **Wrong.** `:51` says `buildSlotQueue` "gives one slot per vowel". It gives one slot per engine syllable (`pairings.ts:229-248`), and the engine does not count ѣ, і, or ѵ as vowels.
- **Evidence.**
  - `GraysonEngine.syllabify('дѣтямъ')` returns `["дѣтямъ"]`: one piece.
  - `slots2.mjs`: 74 of 606 words with two vowel letters or more get fewer slots than vowels (`Прислѵшай`: 2 slots, 3 vowels; `свѣтлѣйшъй`: 1 slot).
  - `pipeline.ts:903` decides vowelless clitics with `hasVowel` (`clitic-merge.ts:13-19`, no ѣ, і, ѵ). `buildSlotQueue` uses `CYRILLIC_VOWEL`, which has them (`vowel-resolver.ts:159`).
- **Replacement text**, a third cross-site bullet replacing `:60`:

  > **The vowel letters.** Step 4's path reads three sets: `CYRILLIC_VOWEL` (`score/vowel-resolver.ts:159`, with ѣ і ѵ) in `buildSlotQueue`; `hasVowel` (`clitic-merge.ts:13-19`, without them) at `pipeline.ts:903`; and the engine's syllabification, which does not cut at ѣ і ѵ (`syllabify('дѣтямъ')` gives one piece). A pre-reform word the pipeline does not modernise therefore gets fewer slots than vowel letters (74 of 606 such words at share 0.3). Step 4 retires `underlay-units.ts:24`; report the three sets and the count, and do not add a fourth. `typed-hyphens.ts:43` holds a fifth copy, outside `omr/`.

**A6. Step 4, a proclitic at the end of a row. Must land.**

- **Wrong.** `buildSlotQueue` resets the waiting proclitic at each line (`pairings.ts:207`) and drops it at the line's end (`:249-250`). A row ending in «в» loses the word.
- **Evidence.** `probe2.mjs 'тебя и мне в'` gives the slots `те | бя | и | мне`. On the captures this happened in 3 rows, all noise (`къ`, `к`, `л!`).
- **Replacement text**, appended to `:53`:

  > Send each row as one line; a vowelless word at a row's end has no host in that line and `buildSlotQueue` drops it (`pairings.ts:207`, `:249-250`): keep it as its own unit, as today, and count it.

**A7. Steps 1 to 4, measure each step, not only the sum. Must land.**

- **Wrong.** Section 7 measures once, after all four steps. A loss in step 4 would hide behind a gain in step 3.
- **Evidence.** Steps 1, 2, and 4 change only the page half. A2's replay of the page half matched the app's own `seatPage` and language calls in 1,032 checks with 0 mismatches. Step 3 changes the worker half.
- **Replacement text**, appended to section 7:

  > Before the browser run, the desk replays steps 1, 2, and 4 on A2's 18 captures (`/home/claude/a2/app/`, `tools/cells.mjs`, the scorer) and reports read right and (b) after each; step 4 is expected not to lower (b) below step 2's figure. Step 3 is measured in the browser run alone.

  Replace "words written on more than 9 of 18 songs" with:

  > words written on every song with a Russian row; systems unwritten named by song, page, and system against A2's 19.

**A8. `:39`, the junk-row count. Carry.**

- **Wrong.** "A2: 11 such rows seated over 18 songs" counts all 11 seated junk rows as rows from the piano area.
- **Evidence.** In `cost.json`, `d0.5_s0.3`, only 4 of the 11 are `app-only`: B06 p3 s4, B09 p2 s4, B10 p1 s3, and T p6 s4. The other 7 overlap harness rows labelled `other`, and some read as text («Тайны вол шебны "е сердцем в них», U6 p2 s3).
- **Replacement text:**

  > A2: 4 rows outside the harness's bands seated over 18 songs at the step 1 threshold.

**A9. The underlay stamp. Must land.**

- **Wrong.** `UNDERLAY_READER` stays at `'underlay@0'` (`stamp.ts:36`). `isCurrent` compares stamps by equality (`restore.ts:40` on the lane). So a reading kept with the switch on under stage 2b as built (no words on 13 songs) is reused under r3 and never read again.
- **Replacement text**, a new step 0:

  > `UNDERLAY_READER` becomes `'underlay@1'` (`stamp.ts:36`), so a reading kept with the switch on under stage 2b as built is read again under r3; `stamp.test.ts:22-24` holds as is.

**A10. Step 2, the banner reverses a Fable amendment. Carry.**

- **Wrong.** `:35` does not say that step 2 reverses Fable's r2 amendment 7 (r2 section 4, the song written per song).
- **Replacement text**, the first sentence of `:35`'s paragraph:

  > This reverses Fable's amendment 7 to r2 (a song's words written only when every page passes); the review rules on the reversal.

**A11. Citations. Carry.**

- `+page.svelte:2790` and `:2010` are on `Shane`. On the lane they are `:2801` and `:2021`. Write "on `Shane`".
- INBOX holds only 06:16 (line 459). The 06:19 and 06:21 rulings are in `STATE.md:39`. Cite that.
- `ocr-guard.ts` is `score/ingestion/ocr-guard.ts`. Its constants are `MIN_TOKEN_LENGTH = 3` (`:37`) and `MAX_UNKNOWN_SHARE = 0.5` (`:41`). Neither is shared with `RUSSIAN_SHARE`, which answers `:62`.
- "Step 4 removes the engine's `syllabify` from the seating path" (`:59`) is wrong. The slots are `transcribe`'s syllables (`engine.ts:1135`) by way of `processText`. Rewrite as: "the engine's cut reaches seating through `processText` (`engine.ts:1135`) instead of `cutUnits`".
- `pairings.ts:212-228` is the clitic fold. One slot per syllable is `:229-248`.

## 4. Citations checked

I checked 33 `path:line` citations and about 15 numbers.

- **Wrong, 5:** `+page.svelte:2790` and `:2010` (on the lane), INBOX 06:16 to 06:21, and `ocr-guard.ts:25` and `:53` (comments, path without its folder).
- **Partly wrong, 3:** `pairings.ts:212-228` (as "one slot per vowel"), `underlay-units.ts:19-25` (the test of the two copies is in `underlay-units.test.ts:7-8`), and `underlay-band.ts:126` (the code is right; the piano-alone claim attached to it is false).
- **Numbers:** all of A2's figures the brief quotes are right: 1,514, 1,836, 1,451, 1,671, 1,591, 1,848, 559, 638, 37 to 19, 17 to 11, minus 66 and minus 90, 3 to 4 fused, 13 then 9 songs held, and 86 vowelless. Two claims are wrong: "11 such rows" (A8) and A1's "no box" premise (A1).
- **Branch:** the retirement has landed on `Shane` (`9540610f`). `git merge-tree 1e4750e5 383187a7` in my scratch clone gave a clean tree, `59eba6a7`, with no conflicts.

## 5. Blind spots

- **The singer side of step 4.** The brief tests seating counts, not where the singer's words end up on the page. A3 is the case where a correct count hides wrong notes.
- **A clitic folded into its host spans two printed boxes** («в» and «бью»). The brief does not say whose box the folded unit takes. Taking both moves the unit's centre to the left. Under A3 the host's own token box carries the folded text: DESK DEFAULT candidate.
- **The stamp** (A9).
- **Measures after the browser run only** (A7).
- **Step 2 and the partly written song.** Behind the switch, Lyrics fills partly, with no banner and no sign that systems are bare. The brief names this. It does not say that the Lyrics text then runs from one system to the next with a gap that nothing marks.

## 6. What I could not establish

- What A3 to A6 do to (b). I did not score a step 4 variant.
- Why `staffIn` keeps the lower piano staff on some systems and the upper on others.
- Whether homr's box covers the grand staff on camera pictures.
- What the stage 2b build report on the lane says. I did not read it, in keeping with the budget.

## 7. What would make me surer

- A replay of steps 1, 2, and 4 on A2's captures, scored, for each placement rule (A7). This runs without a browser.
- The real step 3 rule (A1) run on B01 and B04 through A1's captured `page.raw`, with the bands compared against the harness's band ends.
