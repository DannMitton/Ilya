# Voice-type norms: one table of what the literature says, per voice type

Revision 1, 2026-09-30 about 12:35. A DATED DRAFT by the desk, at Dann's suggestion (12:16: consolidate the voice-type identifiers "to make them easily comparable"). Nothing reaches the tree until he rules. Every value is read from a source this session or a harvest memo that cites a page; the desk computed nothing except the octave in Table 2's last column.

## What this table is for, and what it is not

- **For:** the consistency check (declared values against the literature for the declared type), routing sources, citations on the printout, and Dann's own comparison.
- **Not a verdict and not a limit on anyone.** These are published estimates, not population data (Boldrey calls categories "imposed and arbitrary", p. 6; Bozeman calls his values approximate; Miller: "relatively predictable" but varying by individual, tenor p. 1). The check asks; it never corrects.
- **Different kinds of quantity, kept apart.** A range is the notes a voice sings; a passaggio is a registration event; an fR1 band is a vocal-tract resonance, reported as the pitch where the first harmonic reaches it. They share note names, not meaning, so each has its own column and unit.
- **Kloiber's ranges are left out.** They are ranges of roles for casting.
- **A blank cell means no source gives it.** Nothing is filled by analogy.

## Table 1. Per Tier 1 type: range and passaggi

Scientific pitch (C4 is middle C). Boldrey's Helmholtz converted: c = C3, c' = C4.

| Tier 1 | Range, Boldrey p. 11 (extended in brackets) | Primo passaggio | Secondo passaggio | Bozeman band (Table 2) |
|---|---|---|---|---|
| Soprano | B♭3 to C6 (G3 to F6) | E♭4 (Miller soprano p. 23; Fig. 2.8 p. 25) | F♯5 (same) | soprano |
| Mezzo-soprano | G3 to B♭5 | E4, or F4 (Miller soprano Fig. 2.8 p. 25) | F5, or F♯5 (same) | tenor-mezzo |
| Contralto | F3 to F5 | G4, or A♭4 (Miller soprano Fig. 2.8 p. 25, as printed; flagged: the harvest memo notes a misprint in the soprano row of the same figure) | between D5 and E♭5 (same) | tenor-mezzo |
| Countertenor | "comparable to either soprano, mezzo-soprano, or contralto" | no source (Miller tenor pp. 13 to 14: "not a tenor category") | | union |
| Tenor | C3 to C5 (to E♭5) | lyric D4 (Miller tenor pp. 6 to 7, 11, 43); leggiero E♭4, tenorino E4 (p. 9); spinto C♯4, robusto C4 (p. 12) | lyric G4; leggiero A♭4, tenorino A4; spinto F♯4, robusto F4 (same pages) | tenor-mezzo |
| Baritone | C3 to F4 (G2 to A4) | lyric: the B3 region (Miller bass p. 57); dramatic: modification begins B♭3 (pp. 57 to 58) | lyric: E4 or E♭4 (p. 57); dramatic: about a fourth above the primo (pp. 57 to 58) | baritone |
| Bass-baritone | A♭2 to F4 (E2 to G4) | A3 (Miller bass p. 79) | D4 (p. 79) | bass (DESK DEFAULT) |
| Bass | F2 to E4 (E♭2 to F4) | A♭3 or G3, where modification begins (Miller bass p. 58); lyric bass A♭3 (Mitton 2020, Table 3.1, p. 30, Miller's values) | D4 named as pivot (Miller bass pp. 83, 85); lyric bass D♭4 (Mitton 2020, p. 35) | bass |

## Table 2. Bozeman's fR1 bands, per bucket and vowel

From the tree, `apps/web/src/lib/voice/engine/plausibility.ts` `CORE_BANDS` (Dann's transcription of Bozeman, KVP2 2021, Figs. 8 to 10, pp. 75 to 77; baritone from Bozeman's "Levels of Acoustic Registration" PDF). Each is the pitch range where the first harmonic meets the vowel's first resonance (whoop onset). The turn (open to close timbre) comes where the second harmonic meets it, an octave lower: the last column shows [ɑ]'s, the desk's arithmetic.

| Bucket | [i] | [e] | [ɛ] | [ɑ] | [o] | [u] | [ɑ] turns about |
|---|---|---|---|---|---|---|---|
| soprano | E4 to A4 | B4 to E5 | C5 to F5 | D5 to G5 | B4 to E5 | F4 to B4 | D4 to G4 |
| tenor-mezzo | D4 to G4 | B4 to E5 | C5 to F5 | D5 to G5 | A4 to E5 | E4 to A4 | D4 to G4 |
| baritone | D4 to G4 | A4 to D5 | B4 to E5 | C5 to F5 | A4 to D5 | D4 to G4 | C4 to F4 |
| bass | D4 to E4 | G4 to B4 | B4 to D5 | C5 to F5 | G4 to B4 | D4 to F4 | C4 to F4 |

## Table 3. Boldrey's "Normal Range" for his subcategories (pp. 17 to 18)

For the Tier 2 labels. **The desk's reading of two rotated photos (IMG_6289, 6290); every entry needs Dann's eye before it is used.** Brackets are Boldrey's own (notes some voices of the kind reach).

| Boldrey subcategory | Normal range | Scientific |
|---|---|---|
| Soubrette | (b♭) c' to c''' | (B♭3) C4 to C6 |
| Light lyric coloratura soprano | (a) c' to f''' | (A3) C4 to F6 |
| Light lyric soprano | (b♭) c' to c''' (c♯''') | (B♭3) C4 to C6 (C♯6) |
| Full lyric coloratura soprano | (g) c' to f''' | (G3) C4 to F6 |
| Full lyric soprano | (b♭) c' to c''' (c♯''') | (B♭3) C4 to C6 (C♯6) |
| Light dramatic coloratura soprano | c' to f''' | C4 to F6 |
| Light dramatic (spinto) soprano | (a) c' to b♭'' (c''') | (A3) C4 to B♭5 (C6) |
| Full dramatic coloratura soprano | c' to f''' | C4 to F6 |
| Full dramatic soprano | (g) b to b♭'' (c''') | (G3) B3 to B♭5 (C6) |
| High dramatic soprano | g to a'' (c''') | G3 to A5 (C6) |
| Light lyric mezzo-soprano | (g) b to c''' | (G3) B3 to C6 |
| Full lyric mezzo-soprano | g to b'' | G3 to B5 |
| Dramatic mezzo-soprano | g to b♭'' (c''') | G3 to B♭5 (C6) |
| Lyric contralto | (f) g to f'' (a'') | (F3) G3 to F5 (A5) |
| Dramatic contralto | (f) g to f'' (a'') | (F3) G3 to F5 (A5) |
| Countertenor | (d) f to a'' (c''') | (D3) F3 to A5 (C6) |
| Comic tenor | (A) c to b♭' (b') | (A2) C3 to B♭4 (B4) |
| Light lyric tenor | c to d'' (e'') | C3 to D5 (E5) |
| Full lyric tenor | c to c'' (c♯'') | C3 to C5 (C♯5) |
| Dramatic (spinto) tenor | c to c'' | C3 to C5 |
| Heroic tenor | c to b♭' (c'') | C3 to B♭4 (C5) |
| Light lyric baritone | (G) c to a♭' (a') | (G2) C3 to A♭4 (A4) |
| Full lyric baritone | (G) c to f♯' (a♭'): uncertain reading | (G2) C3 to F♯4 (A♭4) |
| Bass-baritone | (E) A♭ to f' (g') | (E2) A♭2 to F4 (G4) |
| Comic bass | (D) F to e' (f') | (D2) F2 to E4 (F4) |
| Lyric bass | (F) G to f' | (F2) G2 to F4 |
| Dramatic bass | (C) E♭ to d' (f') | (C2) E♭2 to D4 (F4) |

## Gaps the table shows

- No passaggi for the countertenor in any source read.
- Miller gives passaggi by subcategory for tenors and low voices, and only by broad type for women.
- Bozeman's buckets are four; Boldrey's parents are eight. The mapping in Table 1's last column is the tree's, with bass-baritone a DESK DEFAULT.

## Revision 2 shape, 2026-09-30 13:00: the table is generated from observation records

Dann 12:22: new experts' values must join the pool "on its own terms"; Kloiber considered thoughtfully. **The records are `voice-norms-observations_r1_2026-09-30.csv`** (one row per observation: source, page, the source's own label, Tier 1 and Tier 2 mapping, kind of value, low and high, extended values, evidence, how it was read, notes). Kinds kept apart: `range general`, `range normal`, `range role (casting)` (Kloiber, secondary via de.wiki, never a limit), `passaggio primo`, `passaggio secondo`, `fR1 band [vowel]`. **A new expert is new rows.** The pooled view, per Tier 1 type and kind, is the span the sources share with every source listed; an outlying row is shown as a point and never widens or narrows the pool on its own. How "shared" is computed (median of lows and highs, or the overlap of sources) is a DESK PROPOSAL for Dann's eye when the view is drawn.
