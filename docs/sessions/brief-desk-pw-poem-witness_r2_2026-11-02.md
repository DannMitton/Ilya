# Brief: the poem as a witness on row 114, to the ratified design (desk, r2, 2026-11-02 21:xx). Measure only.

r2 replaces r1 (`~/Downloads/_desk-2026-11-02/pw/BRIEF-pw-poem-witness_r1_2026-11-02.md`). It applies T6 of Fable's plan review (`docs/sessions/review-fable-plan-one-vowel-and-underlay_r1_2026-11-02.md`, section E, T6): r1's arm 2 let the poem replace a print word the dictionary knows, which the ratified design forbids. r1 is superseded; do not work from it.

## Question
When the singer supplies the poem, how many of row 114's 590 printed syllables (first file, songs 1 to 5) does Ilya seat exactly, under the design Dann ratified? The gate is 531 (9 of 10).

## The control
The scan-alone tree after row 176 (shipped, `Shane` `e74ee1b2`) and the slur reading (T2, Dann's count rule, the arm that goes to row 177). The desk names the exact tree and its number when it sends this brief: 373 for the "equal or nearer" gate measured 2026-11-02 (`/root/desk/B/cap/t2`), or the strict-equality arm being measured at r2's writing (`/root/desk/D/`). Reproduce that number first, with the scorer the desk names, and say whether it matched.

## The design this measure follows
Read in `docs/memory/OPEN.md` first: "N.135 STAGE 3: TWO VIEWS OF INPUT" (defaults 2, 3, and 8, ratified by Dann 2026-10-16, widened 20:58) and "N.135 STAGE 3, HOW ILYA SEATS TEXT ON NOTES" (ratified 2026-10-20, items 1 as amended 22:13, 6, and 9). In short, and the file's text wins where this differs:

- Lyrics is the master for the words. The print's words anchor each syllable to its note.
- The poem informs Lyrics only (a) where the scan's word fails the dictionary and the poem's aligned word passes, or (b) where a note has no word read under it and the reader saw ink under that note it could not read (item 1 as amended). A clean blank, or a note under an extender or a slur, stays undecided for the singer.
- A print word the dictionary knows is never replaced by the poem's word.
- Every difference is shown, never fixed silently. Here: scored as applied, and counted separately.
- Item 6, the three tiers (tier 3 tested before tier 2; tier 1 needs a scan word failing the dictionary, a passing poem word, a known confusion or a character-set garble, a confident alignment, and an unchanged syllable count). Item 9, the alignment (exact word matches first, then letters in the leftover stretches; repeats and omissions labelled from the alignment and never used to seat a note).
- `CONTRACT.md` §0.1: one vowel per note, no more and no less, none on a sung non-continuation note, no exceptions; «й» a consonant; clitics fuse with U+00A0. §0.2: positions from the page's ink, never an arbitrary proportion.

## Inputs
- The poems: the Russian texts of the five songs from lieder.net (Emily Ezust's LiederNet Archive), fetched with WebFetch; file each as `poems/songN.txt` with its URL. Never use the truth files as the poem (they are the sung text; the measure would be circular) except in arm 4.
- The engine's cut of typed text: `apps/web/src/lib/score/pairings.ts` `buildSlotQueue`.
- The app's dictionary test: `isWord` as the app builds it (with `modernisePreReform`), not a hand lookup.
- The scan's per-syllable positions: the control tree's seated tokens, and for arm 3 the rows the control did not seat.

## Arms (scratch, in the helper's workspace)
1. **Control.** Reproduce the named number.
2. **2a, the ratified rule.** The scan seats as the control does. Cut the poem with the engine; align poem syllables to the scan's tokens (item 9). A seated word that fails `isWord` and whose aligned poem word passes takes the poem's word (tier 1, with item 6's conditions). A sung non-continuation note with no word takes the poem's aligned syllable only where the reader saw ink under it it could not read (item 1 as amended); say how "saw ink" is decided and from what. Everything else stays. Count tiers 2 and 3 apart.
3. **2b, r1's arm as written, a ceiling only.** The poem gives every letter and the scan gives positions only. Report it as "not the design".
4. **3, arm 2a plus the unused rows.** The rows the control seated nothing from (the 57 "row not cut or read" losses; helper C found these rows ARE cut, and the reader returned nothing or dashes in 3 of 4 clean systems) give measured positions from their ink only, and the poem's aligned syllables take them. If a row has no ink positions at all, it takes nothing.
5. **4, the truth as poem.** Arm 2a with the truth's sung text in place of the poem: the instrument's ceiling, not a result.

Report per song and per arm; the stage split; every repeat the music makes that the poem does not print and how the alignment met it; any note left empty or holding two vowels (both must be zero new against the control); and, separately, the clean-blank sung notes the poem could have filled but the design leaves to the singer.

## If 2a falls short and 2b clears 531
The gap is then the known-but-wrong print word (a dictionary word misread as another dictionary word, the «деви»/«девы» kind). That is evidence for a change only Dann can rule on: whether a known print word may yield to the poem's aligned word when the two differ by one letter and the poem's word fits the note count. Do not pre-empt it. Report the count and every example.

## Bar
531 of 590 for 2a or 3. Cost: worst case 220,000 Sonnet tokens; report at 200,000 with what you have. Report to `report-desk-pw-poem-witness_r2_2026-11-02.md` in the helper's folder. NOT ESTABLISHED beats a complete invented answer.
