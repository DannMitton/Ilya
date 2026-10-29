# Brief: N.135, the reader's syllable breaks, r1 (desk, Opus, 2026-10-29)

For an antagonistic review, then Dann's decision. Ruled in by Dann 2026-10-29 19:00 (option B of the desk's three: *"Brief the syllable-split problem next, then return to the second look on cleaner input."*). Phase 0 is measure only (a desk helper); Phase 1 becomes a Code brief only after Phase 0's numbers and Dann's yes. "Syllable breaks" is the desk's coined name for this row; "token" is the code's word for one piece of text the reader returns.

## 0. Why, in the singer's terms

A singer needs one syllable under each note. On the 18 build songs through the app's own page code (stage 2b r5 at step 7, replay on A2's captures; the browser run at step 10 gives 1,914 read right against the replay's 1,880, `report-desk-n135-stage2b-r5-browser_r1_2026-10-29.md`), 425 of the 2,538 printed syllables sit where the scorer could not pair one printed syllable with one read token. That is the largest of the misses (198 are one-to-one with wrong letters, 35 not read). This brief asks what those 425 are and which of them Ilya can fix without guessing.

## 1. What the 425 are (desk measure, 2026-10-29 19:0x)

Script `scripts/splits2.py` in the desk's workspace (to be filed with the review), on the replay's output at `d6db949a` (identical MusicXML to `5ee29ec2`'s reader half), with A2's scorer `align_syl` (groups of at most two syllables and two tokens) and `norm`. "Close" means a `difflib` ratio of 0.75 or more after `norm`.

| kind | syllables | examples (song: printed, read) |
|---|---|---|
| two printed syllables, one token, matching neither well | 182 | U5: вар\|ный, «ды»; U5: жи\|тей, «вар» |
| two syllables run together, a letter or two wrong | 86 | U4: то\|бой, «тсбой»; U4: на\|чер, «чер» |
| two syllables, one read and the other missing | 46 | U4: да\|на, «на»; U5: слив\|шись, «слив» |
| one syllable in two tokens, a letter wrong | 35 | U4: путь, «на\|путь»; U5: грю, «грю\|в» |
| one syllable in two tokens, letters right | 21 | U6: ся, «с\|я»; B04: дят, «д\|ят»; B04: всё, «вс\|е» |
| two syllables run together, letters right | 20 | U4: в\|ти, «вти»; U4: бог\|с, «богс»; P: въ\|тре, «вътре» |
| one syllable read, plus an extra token beside it | 15 | B03: для, «мно\|для» |
| one syllable in two tokens, matching neither | 20 | U6: сти, «ѵ\|гпиоі» |
| **total** | **425** | |

The 182 "matching neither" sit mostly in the photocopied songs: P 41, B10 32, B06 32, U5 19, B07 20, U6 14, B04 12, B09 10, and less elsewhere. DESK INFERENCE, not measured: most of them are misread letters or misaligned rows that the scorer's two-by-two groups happen to catch, so they belong to the letters (the reader review, QUEUE row 158), not to this row.

## 2. What the code does today (read this session)

- `cutUnits` (`apps/web/src/lib/omr/underlay-units.ts:38`) cuts a token holding two or more vowels with Ilya's syllabifier; a token with fewer than two vowels passes whole (`:47`). So a run-together token with one vowel, such as «вти» or «богс», is never cut.
- Step 4's fold joins a vowelless word the transcription calls a clitic to its host (`omr/underlay-clitics.ts`, `foldClitics`, `:87`); a vowelless token the transcription does not call a clitic stays a unit at its own box (step 7's report, case B, "step 4's named departure"). Those are the 79 "vowelless alone" of the replay.
- `CONTRACT.md` §0.1 (Dann 2026-10-29 01:18 to 01:44): one vowel per note; a word with no vowel letter takes no note and joins its host; the fused unit is *proclitic + U+00A0 + initial syllable* or *terminal syllable + U+00A0 + enclitic*; «й» is a consonant; the order of evidence is the print, then the rule, then the singer.

## 3. The design: four narrow fixes, each tested alone

**F1. A piece with no vowel joins its neighbour** (targets "one syllable in two tokens", 56, and much of the 79 vowelless alone). When a token has no vowel letter, is not a clitic the transcription names, and touches a neighbouring token on the same row (box gap under a threshold Phase 0 sets, from the 2026-10-28 report's gap figures), join it to that neighbour: «с» + «я» to «ся», «д» + «ят» to «дят». Join to the nearer side by box gap; where both sides are equally near, to the side whose joined text passes the dictionary as a syllable of a known word; else leave it (the singer repairs). This is §0.1 applied to a fragment of a word. It replaces step 7's case B for fragments only, never for a real one-letter word.

**F2. A proclitic glued to the wrong host moves to the right one** (targets part of "run together", e.g. «богс», «тясьв»). When a token ends in one consonant letter that, split off, is a proclitic the transcription knows («в», «с», «к»), and the remainder is a syllable on its own note, move the proclitic to the next syllable's unit with a no-break space. Only where the transcription of the whole row calls that letter a proclitic (`cliticCalls`, `underlay-seams.ts:57`).

**F3. A one-vowel token glued from a proclitic and a syllable is the fused unit §0.1 wants** (targets "run together, letters right" such as «вти», «вътре»). Write it in the fused form, «в ти», so the clitic stays visible and the IPA treats it as §0.1 says. No note moves.

**F4. The scorer agrees with §0.1 before anything is judged** (no app change). Today the scorer counts a fused clitic unit as a miss of two printed syllables. Phase 0 rescores so a fused unit on the right note counts both syllables read, and a clitic fused to the wrong host counts as a miss, and reports both figures.

Not in this row: a syllable the reader never read (46), and the 182 that match neither: they go to the reader review (row 158) and to a later look at row framing.

## 4. Phase 0: measure first, nothing built (desk helper, Sonnet)

On A2's captures through the replay at `5ee29ec2` (`replay-scripts_2026-10-29.tgz` and `real7.mjs`; positive controls first: 1,880 / 1,710 / 1,870 / 640 / 79, and this brief's 425 table):
1. F4 first: the rescored baseline, and how many of the 425 F4 alone reclassifies.
2. Each of F1, F2, F3 alone, as a stand-in between `seatPage` and `joinPages` in a copy of `real7.mjs`: read right, (b), (a), (c), vowelless alone, and the 425 table again; per song.
3. **Held out:** every threshold (F1's gap) set on half the songs and reported on the other half, and B01 to B10 also held out as one group (they may share one printed source).
4. **Harm count:** for each fix, the syllables it made worse, listed with song and bar.
5. The 182 "matching neither": take ten at random, look at their page crops (the PDFs in `~/Downloads/_desk-2026-10-28/a2-inputs/pdfs/`, rendered by the desk; the captures hold no page images), and say what they are. This item is the desk's, not the helper's.

**Decision gate for Dann:** a fix goes to Phase 1 only if it gains on the held-out half and its harm count is under one in ten of its changes (DESK DEFAULT).

## 5. Phase 1 (Code, cloud lane, after Phase 0 and Dann's yes)

The fixes that pass, as pure functions in `omr/` between `cutUnits` and seating, each with tests and a mutant; `UNDERLAY_READER` raised one version (`omr/stamp.ts`); behind the same hidden switch (`?words=read`, `underlay-switch.ts:20-27`). The Text view does not change (`CONTRACT.md` §0.1 scope).

## 6. Cross-site line (`CONTRACT.md` §4)

F1 to F3 change how a seated unit's text is computed. Other sites that compute or depend on it: `cutUnits` (`underlay-units.ts:38`), `foldClitics` (`underlay-clitics.ts:87`), `cliticCalls` (`underlay-seams.ts:57`), `vowelsPerNote` and step 7's counts (`omr/underlay-counts.ts`), the language call (`omr/underlay-language.ts`), and the arrival fold on the page (`seatCliticFolds`, `+page.svelte:2868`, per brief r2 of steps 5 to 9). The Phase 1 brief says what depends on them agreeing.

## 7. NOT ESTABLISHED

Every yield; what the 182 are; whether the gap threshold transfers from the harness's Tesseract boxes to the app's tokens; whether F2's proclitic list is the transcription's or needs its own; how the second look (`brief-n135-second-look_r1_2026-10-29.md`, REDESIGN) changes once these land.
