# The unseen set: eight IMSLP songs and their truth drafts (r1, 2026-10-07)

> Provenance, added by the desk (Opus): an Opus helper in the desk's cloud workspace, 2026-10-06 23:40 to 2026-10-07 about 01:20, under brief A. Phase 1 chose and downloaded the songs (199,800 tokens); Dann knew none of them (00:38). Phase 2, transcribed by script, unedited, is below. Scans: `~/Downloads/_desk-2026-10-07/heldout-scans/`; truth: `~/Downloads/_desk-2026-10-07/heldout-truth/`. No reader has seen these pages. Dann has not checked any bar.

I've finished phase 2 for all eight songs. Each one has a truth file and a notes file in `/home/claude/heldout/truth/`, named `<slug>.truth.json` and `<slug>.notes.md`.

Every bar adds up to its metre, and every `onsetAbsolute` agrees with the bar lengths; a script checked both on all eight files. The files follow the Tchaikovsky r2 schema: `measureIndex` counts from 0, lengths are fractions of a whole note, a whole-bar rest has no event, the second head of a tie carries `tiedFromPrevious`, and `status` says DRAFT, read by eye. Lyrics, grace notes, turns and fermatas are left out. For the self-check I rendered each truth with verovio and laid it under a crop of the scan's voice staff, bar by bar. Nothing was written outside `scans/`, `truth/` and `work-A/`, apart from one temporary file in `/tmp`, which I deleted.

| Song | Bars | Notes (tie continuations) | Rests in bars | Bars checked | Corrections |
|---|---|---|---|---|---|
| Varlamov, Скажи, зачем? | 26 | 63 (0) | 4 | 26 | 2 |
| Gurilyov, Раскаяние | 31 | 153 (2) | 17 | 31 | 0 |
| Cui Op. 11/4 | 12 | 69 (1) | 14 | 12 | 2 |
| Nápravník Op. 25/3 | 50 | 231 (4) | 28 | 50 | 3 |
| Scriabin, Романс | 20 | 85 (0) | 13 | 20 | 0 |
| Grechaninov Op. 20/4 | 58 | 154 (19) | 26 | 58 | 3 |
| Glazunov Op. 27/2 | 17 | 126 (3) | 11 | 17 | 0 |
| Cui Op. 62/12 | 16 | 79 (0) | 4 | 16 | 0 |

**What the self-check corrected:**
- **Varlamov:** bar 23, D5 is now E♭5; bar 24, C5 and B♭4 are now D5 and C5.
- **Cui Op. 11/4:** bar 7, G4 is now A4; bar 8, C♯5 is now C♮5, carried from the natural earlier in the bar.
- **Nápravník:** bar 32, two Fs are now E♭4; bar 33, a misread head is now D♭4; bar 47, the tied half is now B♮, after I fixed a builder bug where a tie did not keep its pitch across the barline.
- **Grechaninov:** bar 1, the pickup E4 is now C♯4; bar 2, D♯4 is now D♮4, as printed; bar 4, the printed sharp is now recorded on its D♯4.

**The two things you asked for:**
- **Varlamov:** there is no second voice staff. Each system has a single "CHANT" staff over the piano, so this file is the one-voice version, and the notes file says so.
- **Glazunov:** the clef is a plain treble clef with no octave 8. I checked every system in enhanced enlargements. The truth file records `{"sign":"G","line":2}`, and the pitches are as written, so a tenor sings them an octave lower.

**UNSURE items, with their bars:**
- **Varlamov:** bar 20, a speck that could be a dot on the eighth; bar 4, the low C4 in the sixteenth triplet.
- **Gurilyov:** bar 25, whether the last F–E–D group is a triplet, given that the D carries an eighth flag; bar 29, the last head read as a sixteenth; bar 25, two grace notes left out.
- **Cui Op. 11/4:** bar 7, whether the third eighth is A4 or G4; bar 7, a glyph read as a natural that could be a sharp; bar 8, C♮5 by the printing rule, where the music may mean C♯.
- **Nápravník:**
  - Bar 3: D4 or C4.
  - Bar 19: F♯4 by the printing rule.
  - Bar 23: sixteenths read from doubled flags.
  - Bar 24: F5 or E♭5.
  - Bar 26: a pair read as eighths.
  - Bar 47: the untied quarter read as B♭4.
  - Bar 31: the piano changes to 4/4 at "Tempo I", but the voice stays in 12/8 until bar 37, and the truth follows the voice.
- **Scriabin:** bar 12, A♮4, and bar 19, G𝄪4, both by the printing rule.
- **Grechaninov:** bar 36, F♯4 carried; bar 56, the tie broken at the system break; bar 49, a sixteenth read from a doubled flag.
- **Glazunov:**
  - Bar 4: a B4 read as a sixteenth.
  - Bar 11: the printed rests do not add up to 6/4. I used a dotted half rest so the E♮5 lands where it is engraved.
  - Bar 16: A♭4 by the printing rule.
  - Bar 8: F♯5 carried.
- **Cui Op. 62/12:** bar 10, the D3 read as a plain quarter where a speck could be a dot.

## Could not establish
- Whether the composer meant the notes that the brief's rule of carrying accidentals through the bar produces. These are Scriabin bars 12 and 19, Cui Op. 11 bar 8, Nápravník bar 19, and Glazunov bars 8 and 16; each is flagged UNSURE in its notes file.
- Whether the Nápravník editor meant the voice to change to 4/4 at bar 31 rather than bar 37.
- How the scorer should handle grace notes and ornaments, which are left out because the schema has no field for them.
- Who composed song 1 (Bering-Timashov or Varlamov) and song 2 (A. Lvov or Gurilyov).
- Dann has not checked any bar.