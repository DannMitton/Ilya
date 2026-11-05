# Design draft: the poem reads the letters (options 1 and 2 of 2026-11-04 23:4x), r1, 2026-11-05 (desk, Opus)

A design for Fable to critique before any brief. Nothing here is built or measured. Every code claim names a line read by the desk this session on `cloud-lane-34` at `05db2dac`; anything else is marked.

## The singer's need

A scan in, the melody out, IPA seated under it and Russian under that (`CONTRACT.md` §1 item 13). On row 114's first file, Ilya seats 376 of 590 printed syllables exactly; the release line is 531. On the 369 tree (T6, 2026-11-02), the 221 losses were 78 wrong letters on the right note and 143 notes with no word (about 57 in systems never seated, 61 clean blanks the current rules leave to the singer, 14 with ink and no reading). A perfect poem under today's rules reached at most 399. Tonight's join (row 181) made 77 offers on songs 2 to 5 and filled 1 (re-measure report, `docs/sessions/report-desk-row181-remeasure_r1_2026-11-04.md`).

## What Ilya does today

- The reader returns blocks with words, and Ilya keeps each word's text and box only (`apps/web/src/lib/omr/underlay-recognize.ts:55-57`). Tesseract.js 7 also returns each symbol's text, confidence, and box, and with `lstm_choice_mode=2` ranked alternatives (feasibility report, `/root/c181/match/report-desk-row181-read-as-matching-feasibility_r1_2026-11-04.md`; scores are not probabilities).
- A token with two or more vowels is cut by the engine and each piece placed in proportion to its letters (`apps/web/src/lib/omr/underlay-units.ts:2-15`); Dann objected to proportional placement (`CONTRACT.md` §0.2).
- The join (`apps/web/src/lib/text/poem-join.ts:2-31`) works on text after seating: exact word pairs by LCS, gaps aligned by letters, then tiers (repair, keep, offer) per aligned word, applied through the typed-edit path so seats follow by diff.

## The design

**Part A, option 1: fill by confidence, not by exact counts.** Where a run of notes has no word, the poem's aligned words fill it when the alignment around it is confident, not only when the run's slot count equals the poem's. Confidence, DESK DRAFT: both neighbours are exact anchors and the poem words between them have a slot count within one of the run's free notes; any surplus or shortfall goes to the singer as an offer in the Loupe (JOINING item 11). One vowel per note stays absolute (`CONTRACT.md` §0.1): no fill may put two vowels or none on a sung note. The threshold is set by measurement on row 114 f1, never guessed (principle adopted 2026-11-04 23:52, DESK DEFAULT).

**Part B, option 2: the poem aligned to the read letters, McGill's way.** de Reuse and Fujinaga (WoRMS 2019) aligned a known chant text to poor OCR by global letter alignment with affine gaps and gave each known syllable the boxes of the letters it matched (80 to 90 percent of syllables placed). For Ilya:
1. Keep each symbol's text, confidence, and box from the reader (today dropped).
2. For a system whose words the poem covers, align the poem's letters for that span against the row's read letters (Needleman-Wunsch, affine gaps, a substitution cost lowered for the reader's known confusion pairs and, later, for the reader's own second guesses).
3. Each poem syllable takes the union box of the letters it matched; the syllable sits on the note whose x is nearest that box's centre, among the system's free notes, in order (`monotone`). This replaces the proportional placement with the page's own evidence (§0.2).
4. A syllable whose letters matched nothing (all gap) is not placed by this part; Part A or the singer handles it.
5. Lyrics still wins a real-word disagreement (JOINING item 3): where the read letters form a dictionary word that differs from the poem's, the scan's word stays and the poem's goes to the singer as an offer.

## What the readers offer that this design would use (inventory, `report-desk-reader-outputs-inventory_r1_2026-11-05.md`)

- Symbol boxes and text (W18, W19): Part B's letter boxes; also replaces the letter-share split of a merged token (`underlay-tokens.ts:63-69`, read).
- Word confidence (W15): the probe's one misread word scored 32 against 82 to 92 for right words; a low word is where the poem's word is most likely right. Weighting, not a gate.
- Ranked letter alternatives (W22): the later upgrade to Part B's substitution cost.
- Grace notes and chord tones (N11, N12): the underlay path counts a grace note as a seat candidate (`underlay-prepare.ts:123-139`, per the inventory, not read by the desk); DESK INFERENCE, for the review to test against the print: a grace note usually shares the syllable of the note it ornaments, so the free-note list the alignment seats on would exclude grace notes unless the print sets a syllable under one.
- `<voice>` (N13): voice 2 notes (7 of 773) excluded from the free notes, or seated only by the singer.

## Open questions for the review

1. Ordering: the poem reaches Ilya after the scan's reading (the join runs after a POEM arrival, `poem-join.ts:4-9`). Part B needs the poem when the row's letters are aligned. Keep the letters and boxes with the stored reading (`underlay@4` keeps band geometry) and re-run the alignment when POEM arrives, or something better?
2. Which span of the poem goes with which system: by the existing word anchors, or by a whole-song alignment of all rows' letters at once?
3. Repeats and omissions (JOINING item 4) inside a letter alignment: are affine gaps enough, or does a repeat need its own handling?
4. Where does this sit against row 181 as built: replace the text-level tiers, or feed them?
5. Failure modes we have not named.

## The measure before any brief

Scratch arms on row 114 f1 in the desk's workspace, against the step 8 tip 376: A alone; B alone (letter boxes kept, alignment, nearest-note seating); A and B. Credits (a), (b), (c), with the per-syllable ledger, and new two-vowel or empty notes counted (must be 0).
