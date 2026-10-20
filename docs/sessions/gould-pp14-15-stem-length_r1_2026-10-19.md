# Gould, *Behind Bars*, pp. 14 and 15, read for N.6 (desk, Opus, 2026-10-19 20:10)

Source: Dann's scan in Notes ("14 GROUND RULES", 2026-10-19 20:03), exported by the desk through Preview to `~/Downloads/Gould_E (2011) - Behind Bars, pp. 14-15 - Faber Music.pdf` (2 pages, 8,281,021 bytes, md5 `686cf3cb82a3af5e6c5a46587691b366`). Read in full by the desk at 110 dpi. Elaine Gould, *Behind Bars: The Definitive Guide to Music Notation* (Faber Music, 2011); her pronouns are she and her (Dann, 2026-10-19 20:03). Not yet filed in the Voice Pedagogy Library (`~/Documents` is not connected to this session).

What the pages say, paraphrased (page, heading):

1. **p. 14, "Stem length":** the standard stem is one octave long, 3½ stave-spaces, measured from the notehead's centre.
2. **p. 14, "Notes on ledger lines":** a note on more than one ledger line takes a stem that reaches the middle stave-line. Her example: a note on one ledger line keeps the standard stem; from two ledger lines on, the stem runs to the middle line, above and below the stave.
3. **p. 14, "Double-stemmed writing":** as stems fall further outside the stave (a stem pointing away from the middle), they are shortened step by step: an octave (3½), a seventh (3), a sixth (2½). Nothing is ever shorter than a sixth.
4. **p. 15, "Chords":** stem length is measured from the note nearest the stem's open end, as if that note stood alone; the same two rules apply (to the middle line from the ledger lines, shortened outside the stave, as in double-stemmed writing).
5. **p. 15, "Adding tails and beams":** the standard length leaves room for one or two tails or beams; in double-stemmed writing, 2½ spaces leaves room for one; each further tail or beam lengthens the stem (her pp. 16 and 19, NOT READ).
6. **p. 14, "Stem direction" (context):** some editions of vocal music use up-stems only, so the text can sit close to the stave.

Against the tree at `ba6f064`:

- `packages/score-parser/src/staff-renderer.ts:1808`: `STEM_LENGTH_SP = 3.5` matches item 1. Every unbeamed stem is drawn at that length (`:3105-3106`, `sy2 = stemUp ? y - stemLen : y + stemLen`); item 2 is not built.
- `:1803-1806` (the N.6 note) states item 3 as a general rule for ledger-line notes. Gould states it for stems that point away from the stave (double-stemmed writing and chords). DESK READING: in Ilya it bites wherever a stem points away from the middle line, which Ilya's stems can do, because direction follows the singer's timbre when an analysis exists (`:1542`, `:2148`: `a ? a.timbre === 'close' : …`).
- The N.6 note's "r87 lengthens the stem for each beam past the second" rests on item 5 and pages not read here.
