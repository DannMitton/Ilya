# CODE BRIEF. N.168: six test voices for the frequency run

**Written by the desk 2026-09-24 00:45. For Claude Code, in `~/Desktop/ilya-rewrite` on branch `Shane`.** Follows `brief-code-n168-frequency-run_r1_2026-09-23.md`, its passaggio addendum, and the memo. Same house rules: no git writes, gates before and after, Canadian spelling, no em dashes, `WRITTEN` is not `DONE`.

**NOT ESTABLISHED beats a complete invented answer.** Re-read every `path:line` cited here before relying on it; the tree wins.

## Why

Dann ruled 2026-09-24 (`docs/memory/PRODUCT.md`, "Ilya serves every voice; Dann is the exemplar for basses", and "A singer-specific claim is a template, and every populated sentence is checked"): every Insights connection must be tested across voice types, not only against his measured profile. The run today has Mitton (measured) and Godin (partial). Add six literature-built test voices. **They are test fixtures only, never shown to a singer as labels** (the no-voice-type ruling stands).

## The six voices (DESK DEFAULTS; every value carries its source in a code comment)

**fR1 per vowel.** Use the Bozeman bands already in the tree: `CORE_BANDS` in `apps/web/src/lib/shane/engine/plausibility.ts` (about `:50`; sources listed about `:88`), taking the geometric midpoint of each band. Buckets: bass → bass; baritone → baritone; tenor and mezzo → `tenor-mezzo`; soprano → soprano. **Contralto:** no Bozeman bucket: use `tenor-mezzo` and mark the contralto voice's resonances as a stand-in in the output. Vowels outside Bozeman's six (ɪ, ɨ, ʌ, a): if `engine/derivations.ts` derives a missing vowel from measured ones, use it and mark "derived"; otherwise leave it absent (not assessed). No fR2 for any of the six (no generic source: `_synthesis/gaps_pass01.md` §4); fR2 dimensions are "not assessed" for them.

**Passaggi (primo, secondo).** Richard Miller, *The Structure of Singing* (1986): male table p. 117 (verified by the desk against the page): basso cantante A3/D4; baritono lirico B3/E4 (the book prints B4, a misprint; B3 is the desk's correction, see `_extraction/claims_millers_2026-09-23.csv` RMR-024); tenore lirico D4/G4. Female figures pp. 134 to 135 (verified): soprano E-flat4 / F-sharp5; mezzo E4 / E5; contralto G4 / D5. (McKinney 1994 Figure 5, verified by Dann: first series bass D-flat4, baritone E-flat4, tenor G-flat4; second series contralto D-flat5, mezzo E-flat5, soprano G-flat5. Report both sources' positions in the memo; use Miller for the run.)

**Range.** McKinney 1994 Figure 3 floors (read from the noteheads): bass F2, baritone A-flat2, tenor C3, contralto G3, mezzo A3, soprano C4; ceiling DESK DEFAULT two octaves above the floor (McKinney's "ideal two octaves"; computed, not printed). Tessitura: leave absent.

## The run

1. Add the six profiles to `tools/n168-frequency-run/` beside Mitton and Godin.
2. **Transposition:** for each voice and song, choose the whole-tone-or-semitone shift that puts the most sung time inside that voice's range (use `suggestTranspositions`, `packages/score-parser/src/transposition.ts:347`, if it fits; otherwise the simplest search), and report the shift per song per voice. Mitton stays in the file's key.
3. Regenerate the outputs with all eight voices: per-dimension shares and top regions per voice.
4. **New, per note, for all eight voices:** write `out/notes-<voice>.csv` with one row per sung note: song, bar, beat, pitch, vowel, seconds, fR1 band, turning pitch, semitones from turning pitch, passaggio (below primo / inside / above secondo), distance in semitones to primo and to secondo, harmonic rungs at fR1 and fR2, held, approach, phrase index and position, and whether the note is the highest of its phrase. No lyric text (count and positions only). These feed the known-answer tests for Insights connections.
5. **Count, per voice:** how many notes would fire a candidate "P1a" rule: a note within one semitone of the declared secondo (for treble voices, also within one semitone of the declared primo) AND (held OR highest of its phrase OR its vowel's turning pitch within two semitones below it OR a crossing OR an fR2 rung). Report counts and share of sung time, per voice. This is a measurement for Dann's vetting, not a feature.

No change to `packages/` or `apps/` unless the runner genuinely cannot work without an export; if one is needed, say why. Gates should not move.

## Done when

Outputs regenerated for eight voices, the per-note CSVs exist, the P1a counts are reported, and a memo addendum lists every DESK DEFAULT applied and a **NOT ESTABLISHED** section.
