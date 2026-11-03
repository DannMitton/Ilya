# Brief: the poem as a witness on row 114, to the ratified design (desk, r3, 2026-11-02 21:xx). Measure only.

r3 applies all eight amendments of Fable's review (`review-fable-row177-and-pw-r2_r1_2026-11-02.md`, part 2) to r2, which replaced r1 (`~/Downloads/_desk-2026-11-02/pw/BRIEF-pw-poem-witness_r1_2026-11-02.md`). It applies T6 of Fable's plan review (`docs/sessions/review-fable-plan-one-vowel-and-underlay_r1_2026-11-02.md`, section E, T6): r1's arm 2 let the poem replace a print word the dictionary knows, which the ratified design forbids. r1 and r2 are superseded; do not work from them.

## Question
When the singer supplies the poem, how many of row 114's 590 printed syllables (first file, songs 1 to 5) does Ilya seat exactly, under the design Dann ratified? The gate is 531 (9 of 10).

## The control
The scan-alone tree after row 176 (shipped, `Shane` `e74ee1b2`) and the slur reading (T2, Dann's count rule, the arm that goes to row 177). The control is the strict-equality tree (the gate row 177 builds, `/root/desk/D/`), and its number as the desk measured it: **369 of 590** (48, 136, 29, 82, 74; captures `/root/desk/D/cap/`, ledger `/root/desk/D/ledger-t2s.tsv`); 373 ('equal or nearer', `/root/desk/B/cap/t2`) is a reference only and never the control. The scorer is `/root/desk/B/score114b.py`. The tree's syllable positions are `splitTokens`' letter share (`underlay-tokens.ts`); T3 is measured and not landed, and moves 2 syllables on this file (sx report, variant B), which is the known cost of running before it. Reproduce that number first, with the scorer the desk names, and say whether it matched.

## The design this measure follows
Read in `docs/memory/OPEN.md` first: "N.135 STAGE 3: TWO VIEWS OF INPUT" (defaults 2, 3, and 8, ratified by Dann 2026-10-16, widened 20:58) and "N.135 STAGE 3, HOW ILYA SEATS TEXT ON NOTES" (ratified 2026-10-20, items 1 as amended 22:13, 6, and 9). In short, and the file's text wins where this differs:

- Lyrics is the master for the words. The print's words anchor each syllable to its note.
- The poem informs Lyrics only (a) where the scan's word fails the dictionary and the poem's aligned word passes, or (b) where a note has no word read under it and the reader saw ink under that note it could not read (item 1 as amended). A clean blank, or a note under an extender or a slur, stays undecided for the singer.
- A print word the dictionary knows is never replaced by the poem's word.
- Every difference is shown, never fixed silently. Here: scored as applied, and counted separately.
- Item 6, the three tiers (tier 3 tested before tier 2; tier 1 needs a scan word failing the dictionary, a passing poem word, a known confusion or a character-set garble, a confident alignment, and an unchanged syllable count). Item 9, the alignment (exact word matches first, then letters in the leftover stretches; repeats and omissions labelled from the alignment and never used to seat a note).
- `CONTRACT.md` §0.1: one vowel per note, no more and no less, none on a sung non-continuation note, no exceptions; «й» a consonant; clitics fuse with U+00A0. §0.2: positions from the page's ink, never an arbitrary proportion.

## Inputs
- The poems: the Russian texts of the five songs from lieder.net (Emily Ezust's LiederNet Archive), fetched with WebFetch; file each as `poems/songN.txt` with its URL. Say for each whether lieder.net gives the poet's published text or the text as set (its notes name the variants), and in which spelling. Where it is the set text, the arm's number is a ceiling for a real poem and the report says so. Never use the truth files as the poem (they are the sung text; the measure would be circular) except in arm 4.
- The engine's cut of typed text: `apps/web/src/lib/score/pairings.ts` `buildSlotQueue`.
- The app's dictionary test: `wordKnown` (`underlay-language.ts`, called at `underlay-page.ts:207`), which modernises pre-reform spelling before the lookup; never a hand lookup, and never a reimplementation.
- The reader's boxes per row: the `[t5]` console dump of `/root/desk/C/scratch-t4.diff`, applied to the control tree, which changes no output (T4/T5 report, 'The change'). Arm 3's measured positions and arm 2a-ink's 'saw ink' come from it and from nothing else. T5 found rows with no boxes at song 4 p4 s1 and song 5 p2 s1 row 2; those take nothing.
- The scan's per-syllable positions: the control tree's seated tokens, and for arm 3 the rows the control did not seat.

## Arms (scratch, in the helper's workspace)
1. **Control.** Reproduce the named number.
2. **2a, the ratified rule.** The scan seats as the control does. Cut the poem with the engine; align poem syllables to the scan's tokens (item 9). A seated word that fails `isWord` and whose aligned poem word passes takes the poem's word (tier 1, with item 6's conditions). No confusion list is ratified (item 9), so tier 1 holds only where the scan's word is gibberish by character set (item 6's definition); a scan word of real Cyrillic letters that fails the dictionary is tier 3, shown and never applied, and is not taken. Count apart the tier 3 words that are one substitution from the poem's word: they are the confusion list's first evidence. Count apart the tier 1 candidates refused because the syllable count changed. Under item 1 as amended, a wordless note stays undecided until the reader reports unread ink per note, and it does not yet; so 2a's half (b) takes nothing, and 2a is half (a) alone. Add arm 2a-ink: 2a plus half (b) under this instrument, the desk's and not the design's: a note takes the poem's aligned syllable where a reader box with no letter (`kindOf` `mark` or `joint`, `underlay-seat.ts:131-137`) or an unseated syllable token spans the note's x in the `[t5]` dump. A note under a row that returned no boxes takes nothing and is counted as left to the singer. Report 2a and 2a-ink apart. Everything else stays. Every `inSlur` note, whether or not its system took the slur reading, and every note after an extender, takes nothing from the poem (item 1: undecided for the singer). Count tiers 2 and 3 apart.
3. **2b, r1's arm as written, a ceiling only.** The poem gives every letter and the scan gives positions only. Report it as "not the design".
4. **3, arm 2a plus the unused rows.** The rows the control seated nothing from (the 57 "row not cut or read" losses; helper C found these rows ARE cut, and the reader returned nothing or dashes in 3 of 4 clean systems) give measured positions from their ink only, and the poem's aligned syllables take them. If a row has no ink positions at all, it takes nothing.
5. **4, the truth as poem.** Arm 2a-ink with the truth's sung text in place of the poem: the instrument's ceiling, not a result.

Report per song and per arm; the stage split; every repeat the music makes that the poem does not print and how the alignment met it; any note left empty or holding two vowels (both must be zero new against the control); and, separately, the clean-blank sung notes the poem could have filled but the design leaves to the singer.

## If 2a falls short and 2b clears 531
The gap is then the known-but-wrong print word (a dictionary word misread as another dictionary word, the «деви»/«девы» kind). That is evidence for a change only Dann can rule on: whether a known print word may yield to the poem's aligned word when the two differ by one letter and the poem's word fits the note count. Do not pre-empt it. Report the count and every example.

## Bar
531 of 590 for 2a or 3. Cost: worst case 220,000 Sonnet tokens; report at 200,000 with what you have. Report to `report-desk-pw-poem-witness_r2_2026-11-02.md` in the helper's folder. NOT ESTABLISHED beats a complete invented answer.
