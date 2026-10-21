# Memo: the two alignment papers, r1, 2026-10-20 21:5x (desk, read this session)

Serves N.135 stage 3 (QUEUE rows 111, 150; `OWED.md:1038`). Paraphrased; no passage is quoted.

## Yalniz and Manmatha, ICDAR 2011, pp. 754-758 (RETAS)

Read in full 2026-10-20 21:5x. The fetch tool dropped page 3 on both UMass copies, and the shell was refused (403), so page 3 was read as a screenshot in a background tab of Dann's Chrome at https://maroo.cs.umass.edu/pub/web/getpdf.php?id=982 (the tab was closed after).

- Method: find the words that occur once in each text; take the longest common subsequence of those words, which keeps their order and removes the need for the n-gram check of the earlier method (Feng and Manmatha, JCDL 2006); split both texts at those anchors; recurse into each segment with that segment's own unique words; at the leaves, align by edit distance, first by word, then by character. A table cap of 2 million cells: a stretch with no common unique word and too large for the cap is aligned against null (treated as missing or extra text).
- Cost: O(nK) on average, with K the leaf length; the worst case is quadratic, when no unique word is shared.
- Measured: synthetic noise on a 63,000-word English text, character alignment accuracy at or above 99 percent up to 20 percent noise (word error over 75 percent at 20); real books, word accuracy 0.934 English, 0.883 French, 0.878 German, 0.900 Spanish, all Latin script; other scripts are listed by the authors as future work.
- Named failure: an error that turns a unique word into another word that is also in the ground truth ("ball" to "call"), called rare.

## Fremerey, Muller, and Clausen, ISMIR 2010, pp. 243-248 (JumpDTW)

Read in full at the audiolabs-erlangen.com copy of the PDF.

- Method: dynamic time warping between score features and audio features, with extra predecessor cells so the path may jump from the end of any block to the start of any other. Blocks are cut at structural marks in the score (double bars, repeat signs, ending brackets, segno, coda, fine, a new title). Jumps are allowed only at block boundaries, never inside a block.
- Measured on 54 Beethoven sonata movements (8,832 score bars, 11,836 bars performed): plain DTW matched 74.6 percent of performed bars; JumpDTW 99.2; with a jump penalty 99.4. At block level, the plain version inserted 28 blocks (9.2 percent); the penalised version inserted 29 and omitted 17.
- Named failures: a block that is a variation on an earlier one with the same harmonies read as a repeat; a performance tempo more than twice the estimate. A single jump penalty fixed some movements and broke others (short alternative-ending blocks skipped); no value fixed both.

## SUPERSEDED: DESK PROPOSAL r1 (written before page 3 was read; see r2 below)

1. The text is small (a poem of about 100 to 200 words), so size is no problem. What the first paper offers is robustness to chunks the song omits or repeats, and a way to say where the alignment is trustworthy.
2. Anchors: words that occur once in the poem and once in the sung text, after normalizing (case, restored ё, pre-reform spelling, joined «не»), kept in order by the longest common subsequence. Between anchors, align by word-level edit distance, where a substitution of a known reader confusion pair costs less than any other.
3. "The alignment is confident at that spot" (Q7's test) becomes: the word lies in a segment bounded by exact anchors on both sides, and the segment holds the same number of words in the poem and in the sung text.
4. Repeats (the second paper's idea, adapted): a stretch of sung words with no poem partner whose neighbours match an earlier poem block is a repeat, so it is coloured sage; poem blocks with no sung partner are omitted, so they are greyed. The jump points are the phrase ends the music already marks (row 108). This labels what the print already shows. It never seats a note, so it keeps Dann's ruling of 20:56 that Ilya does not guess the composer's setting.
5. Not adopted: the DTW over features (there is no continuous signal) and a tuned jump penalty (the second paper found none that worked everywhere).

NOT ESTABLISHED: that the first paper's accuracy transfers to Russian underlay of this size; the measure is a task for row 111's brief, run on the truth files of row 114 against the poems (fetched from lieder.net) before any accuracy is promised.


## Page 3 of Yalniz and Manmatha, read 21:5x (paraphrased)

- Unique words that an OCR error creates have no partner in the other text, so they never become anchors.
- Stopping rule: recursion continues until a segment is smaller than a size K (the authors used 200 words), or until no common unique word is left. The authors warn against a small K: at sentence scale, stopwords become unique, and confusions such as in and on, or at and it, produce wrong segmentation.
- Leaf stage: each pair of short segments is aligned first at word level (identical words are paired), then, for the words that did not pair, at character level. A null character stands for a missing space, so a word the OCR split or joined (the example is "ata" against "at a") still aligns. The authors report that word then character is more efficient than character alone.
- The leaf algorithm is the standard edit-distance dynamic programme with costs 1 for insertion, 1 for deletion, and 2 for replacement.
- Even at a 50 percent word error rate the authors estimate 5 to 7 unique-word anchors per page (a 200-page book of 500 words a page), because OCR errors rarely produce another word that is present.

## DESK PROPOSAL r2 (after page 3; not ruled)

1. At Ilya's scale there is no recursion. A poem near or under 200 words (its count NOT ESTABLISHED; song 2's has 24 lines) is at or below the paper's own K, so the paper itself would align it directly. One word-level edit-distance pass over the whole poem and the whole sung text does it; the table is tiny.
2. Anchors are a confidence signal, never a splitter. The paper's warning about short words is the То/Го case (N.163): a short word turned into another word that is present would anchor wrongly. So only an exact match of a long word counts as an anchor; the length floor is a number to measure, not to guess.
3. Two stages, as the paper does: words that match exactly are paired first; the words left over, in stretches of one or more on each side, are aligned letter by letter. The letter stage is where the tiers get their evidence: a stretch whose letter differences are all known reader confusions, or whose characters are gibberish, is tier 1; one letter apart between two real words is tier 3. A stretch lets a split or joined word (a scan's «Люблю ли» for «Люблю-ли») align as the paper's null space does.
4. Costs: the paper's 1, 1, 2 cannot tell a different word from a garbled one (a replacement costs the same as a deletion plus an insertion), so similarity of two words is measured separately for the tiers, and an unrelated replacement costs more than a gap so a stanza the song omits resolves as a gap.
5. Repeats and omissions, from the second paper's idea and not from RETAS: sung words with no poem partner whose neighbours match an earlier poem block are a repeat (sage); poem blocks with no sung partner are omitted (grey). Phrase ends from the music (row 108) are the only places a repeat may begin. This labels what the print shows and never seats a note.
6. Not established: that the paper's accuracy transfers. Its noise was random edits and Latin-script books; Russian scan garble is systematic. The measure in row 111's brief, on row 114's truth files against the poems, comes before any accuracy is promised.

Filed 2026-10-20 21:5x in Dann's library: `V-Z/Yalniz_I_Manmatha_R (2011) - A Fast Alignment Scheme for Automatic OCR Evaluation of Books - ICDAR 2011 754-758.pdf` (623,378 bytes) and `D-F/Fremerey_C et al (2010) - Handling Repeats and Jumps in Score-Performance Synchronization - ISMIR 2010 243-248.pdf` (491,820 bytes). Both were saved from Chrome's viewer; Chrome left their temporary copies in `~/Downloads` as `.com.google.Chrome.*` files (hidden).
