# Treble test set, r1 (dated draft)

Delegated by Dann 2026-10-11 14:59 (`docs/memory/STATE.md`, handover of 15:05). Written by the desk (Opus) 2026-10-11 from 16:05. A draft, not a ruling.

## Part 1. Treble repertoire, scores unopened

The list is `memo-sonnet-treble-repertoire_r1_2026-10-11.md` (Sonnet helper, 167,785 tokens, read whole by the desk). 27 songs: 13 soprano-associated, 14 mezzo-associated, 11 composers, each with an IMSLP work page and its Russian-text files. Treble association rests on recital programmes and recordings; no dedication to a named treble was found. IMSLP file numbers come from fetch summaries and need checking before use. Only one song, Rachmaninoff op. 21 no. 5 (#814660, an English and German file, not Russian), carries a printed voice designation: "High voice". **Checked against the held-out sets, 2026-10-11 16:28, by title and opus in `memo-heldout2-chosen_r1_2026-10-08.md`, `memo-heldout2-truth_r1_2026-10-08.md`, and `report-heldout-truth_r1_2026-10-07.md`; no score opened: no match.** The nearest are other works by the same composers (Cui op. 11 no. 4 and op. 62 no. 12; Arensky op. 44 no. 3). Whether run 4's lettered set A to O holds any song outside those three memos is NOT ESTABLISHED.

## Part 2. Two treble profiles, every value from a page read this session

Ilya's fields are `rangeLow`, `rangeHigh`, `tessituraLow`, `tessituraHigh`, `passaggioPrimary`, `passaggioSecondary` (`apps/web/src/lib/voice/engine/types.ts:123-137`). No treble template exists in the tree (grep for `declared-template` finds only the type).

### The sources, as printed

**Miller, R. (1986), *The Structure of Singing*, pp. 134-135, Figures 10.1 to 10.3.** Read from the page images (PDF pp. 155-156), `~/Documents/Voice Pedagogy Library/M-O/Miller_R (1986) - The Structure of Singing.pdf`. Captions read "Soprano", "Mezzo-soprano", "Contralto"; Figure 10.1 is not labelled lyric. Parentheses are Miller's alternatives.

| zone | soprano (10.1) | mezzo (10.2) | contralto (10.3) |
|---|---|---|---|
| chest | G3 to E♭4 | E3 (F3) to E4 (F4) | D3 to G4 (A♭4) |
| lower middle | B♭3 to C5 | C4 to B♭4 (B4) | F4 to A4 |
| upper middle | C♯5 to F♯5 | B4 to E5 (F5) | B♭4 to D5 |
| upper | G5 to C6 (C♯6) | F5 (F♯5) to B♭5 (B5) | E♭5 to A♭5 |
| flageolet | D6 to A6 | C6 (B6), "and above" | A5, "seldom developed" |
| primo (arrow) | E♭4 | E4 (F4) | G4 (A♭4) |
| secondo (arrow) | F♯5 | E5 (F5) | D5 |

Printed as read: the mezzo flageolet reads "C6 (B6)", though B6 lies above C6. Recorded as printed, not corrected.

**McKinney, J. (1994), *The Diagnosis and Correction of Vocal Faults*, p. 111, Figure 3, "Voice Ranges Derived from Vocal Literature".** Read by the desk from `Insights Research/_scans/mckinney-1994-selected-2/IMG_5624.jpg`, rotated. Each voice has three columns: (1) the "practical" twelfth, about 75% of the literature; (2) the "ideal" two octaves, 90 to 95%; (3) the extremes. The readings of (1) and (2) are checked against McKinney's own spans: each is exactly a twelfth and two octaves.

| | (1) practical | (2) ideal | (3) extreme |
|---|---|---|---|
| soprano | D4 to A5 | C4 to C6 | NOT ESTABLISHED (ledger lines unclear in the photograph) |
| mezzo | C4 to G5 | A3 to A5 | NOT ESTABLISHED |

**Correction to an earlier record:** `Insights Research/_extraction/claims_mckinney-1994_batch-A.csv`, MCK-041, reads the low notes as "one floor per voice type" and computes the high notes from them. The figure prints three low and three high notes per voice. Its soprano C4 and mezzo A3 are the ideal floors; its computed "practical" highs (soprano G5, mezzo E5) are not what the figure prints (A5, G5). The CSV is not edited; this paragraph is the correction.

**McKinney (1994), p. 113, Figure 5, "Transition Tones".** Read from `fig5-crop.jpg`. First series: contralto and bass D♭4; mezzo and baritone E♭4; soprano and tenor a flat note in the first space, F♭4 as printed. Second series: contralto D♭5; mezzo E♭5; soprano G♭5. This agrees with MCK-044's desk reading.

**Lamarche, Ternström, and Pabon (2010), *Journal of Voice* 24(4), p. 415, Table 4.** 16 sopranos, 8 mezzos, professional opera soloists. Means in Hz, converted to the nearest note by the desk:

| task | soprano fmin to fmax | mezzo fmin to fmax |
|---|---|---|
| discrete pitch (task 3) | 174.46 to 1295.13 Hz, F3 to E6 | 131.71 to 1147.25 Hz, C3 to D6 |
| sung excerpt (their own aria) | 258.22 to 970.61 Hz, C4 to B5 | 241.41 to 942.07 Hz, B3 to A♯5 |

These are the singers' outer limits, not a comfortable range. **Used as a cross-check only (desk recommendation 2026-10-11 16:15):** the excerpt spans sit inside McKinney's ideal range for sopranos (C4 to B5 in C4 to C6); for mezzos they reach one semitone above it (A♯5 against A5).

### The two test profiles. DESK DEFAULTS, each field naming its source

| field | soprano | mezzo | source |
|---|---|---|---|
| `rangeLow` to `rangeHigh` | C4 to C6 | A3 to A5 | McKinney Fig. 3, ideal two octaves |
| `tessituraLow` to `tessituraHigh` | D4 to A5 | C4 to G5 | McKinney Fig. 3, practical twelfth, used as a stand-in. Ilya's field holds the singer's working zone ("where you live, not your edges", `types.ts:128`); tessitura belongs to a piece, the region of the song in which the voice is most active; the singer has a most comfortable part of the range (Dann 2026-10-11 16:15; `PRODUCT.md`, "Tessitura, as Ilya uses the word"). **No source read gives a typical working zone for a soprano or a mezzo: NOT ESTABLISHED.** |
| `passaggioPrimary` | E♭4 | E4 | Miller Fig. 10.1, 10.2 (McKinney Fig. 5: F♭4 and E♭4) |
| `passaggioSecondary` | F♯5 | E5 | Miller Fig. 10.1, 10.2 (McKinney Fig. 5: G♭5 and E♭5) |

Why these: the "comfortable" wording of `rangeLow` (`types.ts:124`) fits McKinney's literature range better than Lamarche's outer limits. Miller gives the passaggi as single arrows; McKinney's second series agrees within a semitone.

### Not established

- A tessitura by voice type from the literature. Searched: the library file names; Titze 2008 and Apfelbach 2020 (methods for a song's tessitura, no voice-type values). Leads not read: Elliott 2004 (JOS 60/3, text in `_primary-text/jos-2026-09-23/`), Bozeman's lower-passaggio figure (PVA2 App. 3 p. 181, acoustic events, not zones).
- McKinney's extreme ranges (column 3).
- Echternach et al. 2017 (sopranos' passaggi by EGG) was opened; its glides run over fixed spans (A3 to A4, A4 to A5) and it prints no passaggio table in the text extracted. Not used.
