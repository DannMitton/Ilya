# Brief for Fable: critique the draft design for how Ilya seats text on notes (r1, 2026-10-20 21:5x)

You are the critic, not the builder. Write no code. Never write with git (no add, commit, push, checkout, reset, restore, clean, stash, rm, mv, merge, rebase, tag). Change no file except your one report (below). Your report goes to Dann, so write for him: he is AuDHD, so lead with what changes a decision, one idea at a time, no padding.

## What Ilya is and who is asking

Ilya is a free, open-source, bilingual (English and French) web app that reads a printed or scanned song and gives classical singers Russian lyric diction as IPA under the notes. Dann Mitton (voice teacher, DMA) owns it. Its users are highly educated and highly critical; its voice is "Calm Authority" (it informs, never declares a verdict; it never surprises the singer about which words end up under the notes). The reader (OMR and OCR) is imperfect: a scan's underlay can be garbled. A published poem can be given to Ilya as a second witness. The song may repeat, omit, or alter the poem's words.

## The object of critique

The DRAFT in `docs/memory/OPEN.md`, section "N.135 STAGE 3, HOW ILYA SEATS TEXT ON NOTES" (ten numbered defaults), from Dann's design interview of 2026-10-20. Read that section first and in full. Its substance:

1. The singer seats text in order; Ilya never guesses the composer's setting for a score with no words.
2. An insertion in Lyrics pushes later syllables only to the next undecided note.
3. With no undecided note after an insertion, the repeat stays unseated and Ilya says so.
4. An on-request control shifts text from here one note later or earlier.
5. A shift past the last note keeps the extra syllables in Lyrics, marked unseated; undo restores them.
6. A scan's word that differs from the poem's aligned word falls in three tiers. Tier 1, repaired at once and reversibly: the scan's word fails the dictionary after normalizing; the poem's aligned word passes; the difference is a known reader letter confusion, or the scan's word is gibberish or mojibake; the alignment is confident at that spot; the syllable count and anchor are unchanged. Tier 2, the composer's word, marked: the scan's word passes after normalizing, or is a known archaic or poetic variant of the poem's word, or occurs more than once in the song, or is in the table of confirmed spellings. Tier 3, shown and never applied: both words real and one letter apart; or the scan's word fails, looks like plausible Russian, and no confusion explains it while the poem's word is close; or both fail and differ.
7. A table of odd correct spellings ships with the build, read-only to singers, curated by Dann; a singer's confirming tap applies on their own device at once and queues the spelling as a candidate for Dann. A proposed rewording of `docs/memory/CONTRACT.md` section 8 ("Do not store anything derived") is attached to it.
8. The count of repairs and the review live on Lyrics' own receipt line, beside the "from score" tag: "4 words repaired from your poem", Revert for all, a tap to open the list.
9. Alignment: one word-by-word comparison of poem and sung text with no recursion; exact matches of long words are a confidence signal, never a splitter; leftover stretches are aligned letter by letter, which supplies the tiers' evidence; repeats and omissions are labelled from the alignment and never used to seat a note. Basis: `docs/sessions/memo-alignment-papers_r1_2026-10-20.md` (Yalniz and Manmatha, ICDAR 2011, read in full; Fremerey, Muller, and Clausen, ISMIR 2010).

The record of Dann's own words: `docs/sessions/draft-text-seating-design_r1_2026-10-20.md`. Related, already ruled: `docs/memory/OPEN.md` "N.135 STAGE 3: TWO VIEWS OF INPUT" (defaults 1 to 14, with default 8 widened 2026-10-16 20:58) and `docs/memory/PRODUCT.md` (search it for "THE TEXT AND THE NOTES", line 534 on never surprising the singer, line 822 on not narrating the sorting).

## How to read the files

They are on Dann's Mac, repository `~/Desktop/ilya-rewrite`. If you have no file tool for it, load `mcp__remote-devices__device_bash` with ToolSearch (query `select:mcp__remote-devices__device_bash`) and read with `cat`, `sed -n`, and `grep` under `$HOME/mnt/ilya-rewrite`. Read only what you need; do not read the whole `docs/memory` folder.

## What to critique

A. The tier tests. Where would a correct word be overwritten by tier 1, or a garbled one be kept by tier 2 or 3? Think about Russian: pre-reform spelling, stress-dependent forms, poetic truncations and diminutives, dialect or folk words (Koltsov, Mussorgsky), proclitics and enclitics, hyphenated words, ё. Is "occurs more than once in the song" safe as a tier 2 test, given that the reader may repeat the same garble on a repeated phrase? How should "gibberish or mojibake" be defined so it cannot catch a correct rare word?
B. The alignment (item 9). Does it hold for strophic songs (the music carries verse 1 under the notes while the poem has several stanzas), for a sung text much longer than the poem (repeats) or much shorter (cuts), and for an edition that prints a singing translation or a transliteration under the notes as well as the Russian? Word-level alignment against syllable-level seating: how does a repaired word's syllable count get established when the scan's word is garbled?
C. Contradictions with the existing rulings named above, or with N.157, N.160, N.163, N.186 (search `docs/memory/OPEN.md` and `STATE.md`).
D. The singer's side. Is the Lyrics receipt line the right home for the count (discoverability, surprise, cognitive load)? Offer ranked better designs if you find one, with the recommendation first and the cost of each in a clause.
E. The shipped table and the section 8 rewording: staleness, Dann's curation load, a singer's local confirmation conflicting with a later shipped entry, anything that touches privacy.
F. What the interview never asked. Name blind spots, ranked.

## Rules for evidence

A claim about what code does carries a file and line you read this session; otherwise say it is not read. A claim from the literature carries the source you read. Mark every inference as inference. NOT ESTABLISHED beats a complete invented answer.

## Output

Write the full report to `docs/sessions/review-fable-design-text-seating_r1_2026-10-20.md` (create it through device_bash with a heredoc; no `&&` or line continuation on the heredoc line). Lead with one sentence if anything changes a decision: what was believed, what is now known, what it changes. Then findings, ranked, each with: severity (blocks, change, consider), the point, the evidence, a better alternative, and its cost. Under 1,500 words. End with a section "Could not establish". House style: Canadian spelling, Oxford comma, no em dashes, sentence-case headings, no directional language, never "should", "simply", "just", "easy", "honestly", or exclamation marks.

Cost: aim under 150k tokens; stop and report at 250k tokens, saying what you did not reach. Your final message to the desk is a memo of under 200 words: the report's path, the one-sentence lead, and the number of findings at each severity.
