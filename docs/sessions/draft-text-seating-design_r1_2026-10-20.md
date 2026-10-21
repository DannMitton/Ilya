# Draft: how Ilya seats text on notes, a design interview, r1, 2026-10-20

A dated DRAFT, not a ruling (`CONTRACT.md` section 5: drafts stay drafts until Dann says they are ready). Started 2026-10-20 20:5x at Dann's request (`../memory/INBOX.md`, 20:50). One question at a time; his words are transcribed as written.

## Settled before this draft (OPEN.md, N.135 stage 3, ruling defaults 5, 7, 8, 11)

Lyrics holds the sung words; Poem holds the published poem; a difference from the poem is coloured sage in Lyrics; words the song omits are greyed in Poem; a scan's garbled word is replaced by the poem's aligned word only where the dictionary test says so; every difference is shown, never fixed silently. Alignment method: open.

## Q1, 2026-10-20 20:5x: a score with no words plus a poem, where the music repeats, omits, or sets a melisma

Options offered by the desk: (1) seat in order, then ask where the text goes next when the words run out; (2) propose the composer's setting by searching for repeats; (3) seat in order and stop. Desk recommendation: 1.

**Dann's answer, 20:56: option 1.** *"Right, so ultimately the functionality we want is for ILya to reconcile the placement of text underlay (syllables present in the scan, synthetic IPA to match) with the syllable underlay it perceives from the processed image (file, pdf, HEIC, jpg, whatever). So when an authoritative Poem is input, ILya will already have syllable-anchoring-to-specific note values it can draw on when it detects a missplelling or garble from a scna, and can update it instantly in repsonse to the authoritative text. Ilya will also instantly detect and applroopriately grey out surplus poem text that is not present in the tedxt underlay of the song, and colour sage any avriations (repetitions, word variants) in the song that are not present in the Poem."* And: *"I think it is unwise for us to guess. SO IMO manual sullable assignment (with some helpful tools to lessen that meticulkopus labour) is more responsibel and achievable than telepathy"*

Read by the desk against the settled defaults: the greying and the sage colouring restate defaults 11 and 5; what is new here is (a) the reconciliation runs instantly as the poem or the underlay changes, and (b) for a file with no words Ilya never guesses the composer's setting: the singer assigns syllables by hand, with tools that cut the labour.

## Open questions, in order

Q2: what the singer's gesture is to continue the text where it has run out (asked 20:5x).

## Q2 reframed, Q3 asked: what moves when text is inserted (2026-10-20 21:00 to 21:07)

Dann, 21:00, declining the hypothetical of Q2: *"my very first step would be to start at the beginning and use 'push lyrics to the right' or whatever similar control exists, to replicate the text layout to the best of my ability? If text has mid-text repeats they should be able to be inseerted straiught into Lyrics without harming anything? Syllable anchors should accept the displaced values which will give the user a sense of groundedness that meets their expectations. Lyriccs will alsways be a linear expression of the fiules anchored syllable assignmens from beginning to end."*

Dann, 21:06, his model: notes as equally spaced nodes on a number line; each holds a syllable or does not (a null or a nonprinting value, he assumes); the record of accepted syllables is the record of anchors; an unanchored note is part of a melisma or unassigned mid-task; *"entering more text mid-text will just push current syllables through the established pattern of syllable anchors, ignoring unassigned text"*; he asks whether he is overthinking and wants the match to *"human linear perception of lyrics"*.

Dann, 21:07: *"erasing mnogo in that case could replace the syllable anchors with null content. this would preserve the downstream shape of all the other seated syllables. Is this reasonable?"*

Desk, read this session: that is the behaviour already built (2026-09-07 ruling, `apps/web/src/lib/score/reseat.ts:7-11`: deleting a word vacates its notes and moves nothing else; the vacated note goes back to undecided). A note holds a syllable, a melisma, decided-empty, or undecided (`pairings.ts:128`, `reseat.ts:36-42`).

Q3 (open): how far later syllables move on an insertion: (1) to the end, (2) bounded, to the next undecided note, which absorbs the push, (3) only on request. Desk recommendation: 2, with 3 as an override. A deletion's vacated notes are the absorbers for 2.

**Q3 answered by Dann, 2026-10-20 21:08: option 2.** *"Yes optoin 2."* An insertion in Lyrics pushes the syllables after it only until the next undecided note, which absorbs the push; everything beyond stays put. (Option 3, the on-request push as an override, was the desk's addition and is not ruled.)

Q4 (open, asked 21:0x): what happens when no undecided note lies after the insertion.

**Q3's override and Q4, answered by Dann, 2026-10-20 21:09: *"I acccept your recommendation"*** (transcribed as written). The desk had put two recommendations in the two messages before it: (a) the on-request "shift from here, one note later or earlier" control, yes; (b) Q4 option 1: when no undecided note lies after an insertion, the repeat is left unseated and Ilya says so (for example "No open note after bar 59"), and nothing moves. The desk read his reply as accepting both; he can correct that.

Q5 (open, asked 21:1x): what the on-request shift does when it would push the last syllables past the end of the song.

**Q5 answered by Dann, 2026-10-20 21:15: option 2.** *"2"* The on-request shift, when it would push the last syllables past the end of the song, is allowed: the syllables that no longer fit stay in Lyrics, marked unseated, and undo brings them back. Nothing is lost.

Q6 (asked 21:1x): when a scan's word differs from the aligned word of an authoritative Poem, does Ilya replace it instantly (visible and revertible), show a review first, or only show the difference.

Dann, 21:18, finding the three options complex: *"Hm. this is complex. Maybe you can devise a useful compromise or hybrid?"* (transcribed as written), and asking for the best suggestion for honouring the composer's possible intent while Ilya stays calm and authoritative.

**Q6 answered by Dann, 2026-10-20 21:20, on the desk's three-tier hybrid:** *"Yes, I think your tiers offer the user the most conveinece paired with greater agency. make it so."* (transcribed as written). The tiers:

1. **Clear garble: repaired at once, quietly.** The scan's word fails the dictionary, the poem's aligned word passes, and the syllable count and the anchor are unchanged (settled default 8). Ilya swaps it, marks it, keeps one quiet count line ("4 words repaired from your poem"), and each swap reverts in one tap.
2. **A real word that differs: left as the composer's, marked.** Repeats and variants are coloured sage in Lyrics (default 5); poem passages the song omits are greyed in Poem (default 11). The print is the authority for what is sung.
3. **Ambiguous: shown, never applied.** Both words are real and close (for example one letter apart), so the scan may have misread a real word or the composer may have changed it. Ilya marks the spot gently and offers the poem's word on one tap. This tier is new; the existing defaults do not cover it. The case it catches is the one N.163 recorded: a misread that looks like a word to a shape test (`OPEN.md:2350-2385`).

Comparable systems (a spell-checker that autocorrects, suggests, or leaves a word alone by confidence) were named from the desk's own knowledge, not read this session.

## State at the close of the desk, 2026-10-20 21:2x

Settled: Q1 to Q6 above. Nothing is built, and nothing is in `OPEN.md` yet: the desk writes the settled design into `OPEN.md` under N.135 stage 3 when the interview ends, and Dann ratifies it.

Q7 (to ask next, one question): how near is "close" for tier 3. Desk recommendation: the poem's word is offered, never applied, when it passes the dictionary and differs from the scan's word by one letter or by a known scan confusion pair, and the alignment is confident at that spot; every other difference is the composer's and stays tier 2. Cost of each path: a looser test flags more spots and costs the singer attention; a stricter test misses a real misread.

Still open after Q7: the alignment method (pending the reading of Yalniz and Manmatha, ICDAR 2011, and Fremerey, Muller, and Clausen, ISMIR 2010, per `OPEN.md` ~2772-2830); where the review and the quiet count live on the Input band (Calm Authority); the file-receipt cue (INBOX 20:41); the sage Poem and Lyrics toggle (INBOX 20:34).


## Q7 reframed, and the table of odd correct spellings (2026-10-20 21:26 to 21:35)

Dann, 21:26, on Q7: *"Will archaic forms of words used poetically always be in the dictionary? Could that complicate otherwise perfectly correct texct? Can you offer greater nuance that will account for the most potential correct inputs that might otherwise trigger such a filter?"* (transcribed as written).

Desk, read this session: whether the dictionary holds archaic and poetic forms generally is NOT ESTABLISHED. Three misses are on record in the memory files: the absent word «моюся» (QUEUE row 91), «шумнаго» (N.12), and «не проглядная» (N.181). A failed lookup is weak evidence of garble.

DESK PROPOSAL, NOT RULED, replacing the one-letter test for tier 1 and tier 3:
- Tier 1 (repaired at once, reversible) only when all four hold: the scan's word fails the dictionary after normalizing (pre-reform endings and letters, restored ё, joined «не», particle hyphens); the poem's aligned word passes; the scan's word is reached from the poem's word by the reader's known letter confusions alone; the syllable count and the anchor are unchanged.
- Tier 2 (the composer's, marked): the scan's word passes after normalizing, or matches a known archaic or poetic variant of the poem's word, or occurs more than once in the song.
- Tier 3 (shown, never applied): both words real and one letter apart; or the scan's word fails and no confusion pair explains it while the poem's word is close; or both fail and differ.
- Not established: the list of letter confusions (it comes from row 115's measured losses, not opened), and whether the reader gives a confidence per word.

Dann, 21:28: would it be useful to keep a table of odd correct spellings. Dann, 21:32, questioning `CONTRACT.md` section 8 ("Do not store anything derived"): the desk found no recorded reason for the rule (`CONTRACT-archive.md:781` gives the rule, its two exceptions, and his words *"this is exactly the type of edict that I want challenged"*); the profile is the singer's own statement (`OPEN.md:441`), the library keeps the scan and its reading (the second exception). A DESK INFERENCE, offered when he asked why: the concern was a stored derivation going stale when the engine improves. Proposed rewording, NOT ratified: *do not store a result that a later engine could improve unless it carries the engine's version; the singer's own statements and confirmations are not derived.*

**Dann, 21:35, on the desk's option 1: "Yes to option 1".** The table of odd correct spellings ships with the build (app-wide, read-only to singers, curated by Dann, in the pattern of the dictionary supplement, which the desk has not opened). A singer's confirming tap takes effect on that singer's own device at once and queues the spelling as a candidate for Dann's review. Nothing learns a spelling silently. Not built.

**Dann, 21:38, on Q7: *"Well., loosen item 3, I think gibberish or mojibake is subject to this autocorrect"*** (transcribed as written). DESK DEFAULT reading, his to overrule: tier 1's third test becomes "the scan's word is reached from the poem's word by the reader's known letter confusions, OR it is gibberish or mojibake" (characters or sequences Russian does not use, such as a non-Cyrillic character inside a Cyrillic word). A word that fails the dictionary and looks like plausible Russian, with no confusion explaining it, stays tier 3 (it may be a correct archaic form). The tests for tier 1 still include a passing poem word, a confident alignment at that spot, and an unchanged syllable count and anchor. How gibberish is detected is a brief question, not an interview question; NOT ESTABLISHED whether the engine already has such a test. Q7 closed on this reading.

## Alignment method (2026-10-20 21:5x, the desk's to decide)

Both papers read (`memo-alignment-papers_r1_2026-10-20.md`; Yalniz and Manmatha NOT read in full, a stretch of section III dropped by the fetch). DESK PROPOSAL, not ruled, and an engineering choice that is the desk's: anchor on words that occur once in each text, keep them in order, align between anchors by word-level edit distance with the reader's known confusion pairs cheap; "confident at that spot" means bounded by exact anchors with equal word counts; repeats and omissions are labelled from the alignment, never used to seat a note. Measure on the truth files before any accuracy is promised (row 111's brief).


**Alignment method REVISED 2026-10-20 21:5x, after Dann asked (21:42) that the Yalniz and Manmatha paper be read in full.** Page 3 read (as a screenshot in a background tab of his Chrome). It changes the first proposal: at Ilya's size there is no recursion (the authors' own segment limit is 200 words), unique-word anchors are a confidence signal and never a splitter (the paper warns that short words turn unique at small scale and are confused), and the leaf stage is two-stage, words then letters, which is where Q6's tiers take their evidence. Full text of the revised DESK PROPOSAL r2 in `memo-alignment-papers_r1_2026-10-20.md`. Not ruled; an engineering choice, the desk's.

**Dann, 21:48, on the desk's question whether Lyrics' own receipt line is the home for the quiet count and the review: "yes".** (The line, beside the "from score" tag, reads in effect "4 words repaired from your poem", with Revert for all and a tap that opens the list one by one.) The interview is closed at Q7 and this answer. The design is written as a DRAFT in `../memory/OPEN.md`, section "N.135 STAGE 3, HOW ILYA SEATS TEXT ON NOTES", for Dann to ratify; nothing is built.
