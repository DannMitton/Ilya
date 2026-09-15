# Memo: N.126, measure numbers on Score markup

Revision 1, 2026-09-15. Written by Claude Code, built to
`brief-n126-measure-numbers_r1_2026-09-15.md`.
**Not committed and not staged.**

**Sources read before building:**
- `gould-bar-numbers-p484_2026-08-29.md`, read in full.
- `drawing-bar-numbers_r1_2026-08-29.html`, opened in the Browser pane.

**Status: WRITTEN.** Measured in the dev server's pane on both scores. **Not
walked by Dann.**

**The working tree also holds N.141's IPA-width increment, uncommitted**, in
`staff-renderer.ts`, `staff-renderer.test.ts` and `VoiceProfilePane.svelte`
(`memo-n141-squircle_r1_2026-09-15.md` §8). The two sets of changes share those
three files.

---

## 1. What changed, by file and line

### `packages/score-parser/src/staff-renderer.ts`

- **`:837` `BAR_NUMBER`.** Every value, with its source on its face:
  - italic, from Gould p484-d;
  - `fontSize` equal to `CYR_FONT_SIZE`, the underlay's size, ruled by Dann
    2026-09-11;
  - `clearanceSp: 1.0`, ruled;
  - `digitHeightEm: 0.75` for the crop estimate, a DESK DEFAULT;
  - `fill: '#3a352f'`, a DESK DEFAULT from the tacet numeral;
  - `courtesyAfterBars: 2`, "multibar".
- **`:1816` the system-start number.**
  - It is emitted in the header, after the key signature, before the first music
    mark, so it cannot pull the loupe's `headBound` left.
  - It is centred on the clef's ink.
  - Its baseline sits `clearanceSp` above the top line, or above the clef's own
    ink where a clef rises above the stave.
  - It is skipped when the slice starts at the score's measure 0, the first bar
    of the piece (Gould p484-a).
  - It raises `highestInk` by the estimated digit height, so the crop holds it.
- **`:2169` the courtesy number.**
  - It is drawn after a tacet run of 2 or more bars that is followed by a measure
    in the same system, centred on the run's closing barline.
  - It is bare.
- **Handle:** both carry `data-bar-number`.
- **Face:** neither names a font family, so both inherit the page's sans, as the
  underlay and the tuplet count do.

### Other files

- **`packages/score-parser/src/index.ts:49`** exports `BAR_NUMBER`.
- **`packages/score-parser/src/page-layout.test.ts:35`**, 4 tests, on real
  `paginateScore` output:
  - every system but the first carries its first measure's number verbatim, in
    italic, at the underlay's size and fill;
  - a bass-clef system's baseline is 1.0 stave-space above the top line, and the
    crop holds the digit;
  - a two-bar rest mid-system gets a courtesy number on its closing barline;
  - a one-bar rest gets none.
- **`staff-renderer.test.ts:910`**, a one-character strict-null fix to the
  key-signature test I wrote for N.138. Only `tsc` flagged it.
- **`apps/web/src/lib/shane/Loupe.svelte`.**
  - `:1003`: the clone drops `data-bar-number`.
  - `:258`, `:350` and `:902`: the ink walk, `pageMetrics` and the band walk skip
    it, so it can neither bound nor size the loupe.
- **`apps/web/src/lib/shane/VoiceProfilePane.svelte:436`.** `ipaBaselineOf`
  skips it. A measure number shares the Cyrillic row's font size by ruling, so on
  a system with no Cyrillic it would have been read as that row, and the ring's
  bottom placed 20 units below the number.

---

## 2. The walk. 390 px and the pane's own width, pane hidden, DOM readings

### Sunless 01

8 systems, with 95 IPA and 95 Cyrillic syllables.

- **Numbered systems.** The first system carries none. Systems 2 to 8 carry 4, 7,
  9, 11, 13, 16 and 18: each is `Measure.number` of the system's first measure.
- **Placement.** Each is centred at x 35.54 on a clef whose layout box runs 27.75
  to 43.33, with its baseline exactly 1.0 stave-space above the top line. The
  computed face is `italic "Source Sans 3"`.
- **No courtesy numbers.** Sunless's only rest is the single bar of m. 1.

### T05

11 systems, with 146 Cyrillic syllables and no IPA: the fixture of N.141 §7.4.

- **System-start numbers.** Systems 2 to 11 carry 14, 20, 30, 37, 44, 57, 63,
  69, 82 and 89, each centred at x 41.78. That differs from Sunless because T05's
  key signature has one sharp, which moves its clef.
- **The first system** carries no system-start number.
- **Courtesy numbers:**
  - **9** on system 1, after the 8-bar rest that opens the piece (`data-tacet`
    0 to 7);
  - **28** on system 3, after bars 24 to 27;
  - **81** on system 9, after bars 74 to 80.
  - The 7-bar rest that ends system 6 (bars 50 to 56) gets none, because system 7
    opens with its own "57".

### The loupe

- **m. 9, the courtesy measure:** no measure number in the loupe. The head crop
  still ends on the header at 61.25, and the body opens at 125.23, just past the
  rest's barline at 122.48.
- **m. 34 on system 4, which carries "30" on the page:** no measure number in the
  loupe, and the head crop ends at 61.25.

---

## 3. The tacet collision

**Expectation, stated before measuring.** No crowding: a system-start number is
centred over the clef, and a tacet numeral is centred over a run several
stave-spaces wide.

**The brief's premise was wrong, and it was the desk's reading of my own
measurement.** T05's systems 5 and 7 open with single rests (the quarter rest on
m. 37 and the eighth rest on m. 57, N.138 memo §7.1), not with multibar runs, so
no tacet numeral stands there. **The only T05 system that opens with a run is
system 1**, and it takes no system-start number, because it holds the first bar
of the piece.

**The pairs that do share a band are each courtesy number beside its own run's
tacet numeral.** Measured from rendered ink, both numerals placed by their
advances:

| system | number | tacet run | horizontal gap | vertical overlap of their ink bands |
|---|---|---|---|---|
| 1 | 9 | bars 1 to 8 | 23.19 units, **4.22 stave-spaces** | 8.27 units |
| 3 | 28 | bars 24 to 27 | 19.55 units, **3.55 stave-spaces** | 8.27 units |
| 9 | 81 | bars 74 to 80 | 19.00 units, **3.45 stave-spaces** | 8.27 units |

**They share a height band and do not touch.** The closest pair stands 3.45
stave-spaces apart. The system-start numbers stand 70 or more stave-spaces from
any tacet numeral. **Whether 3.45 spaces reads as crowded is Dann's eye.** No
constant was nudged.

---

## 4. Page count

**Expectation, stated before measuring.** Unchanged at 3 on both scores, with
numbered systems a few units taller.

| score | before (N.141 §7.4, same fixture) | after | system heights, before → after |
|---|---|---|---|
| Sunless 01 | 3 pages, 6 + 2 | **3 pages, 6 + 2** | 107 110 105 105 107 107 104 96 → 107 111 111 111 111 111 111 111 |
| T05 | 3 pages, 6 + 5 | **3 pages, 6 + 5** | 112 107 122 107 113 112 106 107 116 124 101 → 112 111 122 111 113 112 111 111 116 124 113 |

**No page was added.**
- **Sunless:** the numbered systems grew by 1 to 15 units. The largest, 15, is
  the last system, which had the least ink above its stave.
- **T05:** 4 of 11 systems are unchanged, because their own ink already reached
  higher; the others grew by 4 to 12.
- **The "before" figures are from yesterday's count on the identical fixture, not
  from a toggle this session.**

---

## 5. Gates

| gate | result | ship script reads | moved |
|---|---|---|---|
| 1 | 216 passed (216) | 216 | no |
| 2 | 235 passed (235) | 235 | no |
| 3 | 0 errors and 7 warnings in 4 files | same | no |
| 4 | **1173 passed (1173)** | 1173 | no |
| 5 | **555 passed, 5 skipped (560)** | 550 / 555 | **+5**: 1 from N.141's uncommitted IPA-width test, 4 from N.126 |

**`~/Downloads/ilya-ship.sh:80` will refuse until it reads 555 and 560.**

---

## 6. NOT ESTABLISHED

NOT ESTABLISHED beats a complete invented answer.

- **Print, in a print preview.**
  - The numbers are plain SVG text with the stave's ink, and no print rule names
    `data-bar-number`. That is established by grep.
  - No print preview was taken.
- **A treble or treble-8vb clef.** Neither score has one, so the clef-ink rule in
  `BAR_NUMBER.clearanceSp` was not exercised.
- **The crop's digit height.** It is estimated at 0.75 of the em, not measured,
  because the renderer has no DOM.
- **A measure number that is empty, `0`, or `X`.** Empty is skipped; the others
  print verbatim. Neither score carries one.
- **How 3.45 stave-spaces between a courtesy number and its tacet numeral reads.**
- **Dann's eye on size, placement, and the courtesy numbers.**

---

## 7. Decisions the brief did not settle, or where I departed from it. All mine, all reversible

1. **Centred on the clef's ink, not on the stave's left edge.** The brief's
   default was `staveLeft`. The drawing Dann ruled from centres the number on
   the clef's ink, and "above the clef" says the same. Changing back is one
   argument in `staff-renderer.ts:1816`.
2. **Above the clef's own ink where the clef rises above the stave**, keeping the
   same 1.0 stave-space. The ruling measures from the stave, but a treble clef's
   loop would otherwise run into the number. It is untested on these scores.
3. **"Multibar" means 2 or more bars.** A single bar of rest gets no courtesy
   number.
4. **The loupe leaves measure numbers out.** A system-start number in the head's
   crop would name the wrong bar on every measure after the first, and the
   loupe's tag already names the held measure.
5. **The crop estimate uses 0.75 of the em for the digit's height.**
6. **The face is inherited, not named.** On the page that is Source Sans 3
   italic, confirmed as computed. The drawing used Source Serif 4, which was the
   page's text face on 2026-08-29.

---

## 8. Appended: the courtesy number takes square brackets

**Ruled by Dann 2026-09-15**, after the build began (brief §THE POST-REST
COURTESY NUMBER): *"square brackets in a musical score means 'this is
editorial'."* The system-start number stays bare.

**This supersedes §1's "bare" for the courtesy number.** The desk had read the
2026-09-11 ruling as covering both kinds of number.

### What changed

- **`staff-renderer.ts`, `barNumber`.** The helper takes an optional `shown`
  string for what is drawn. `data-bar-number` always carries the bare number, so
  the loupe's strip and any reader of the handle are unaffected.
- **The courtesy call site only** passes `[${text}]`. The brackets are ordinary
  text characters, U+005B and U+005D, in the numeral's own italic face, not SMuFL
  glyphs, so they can't blur with the round `accidentalParensLeft` and
  `accidentalParensRight` of a courtesy accidental.
- **The whole string is centred on the rest's closing barline.** The brackets are
  symmetric, so the numeral itself stays over the barline.
- **`page-layout.test.ts`.**
  - The courtesy test requires `[n]` as the drawn text, the bare `n` on the
    handle, and no round parentheses.
  - The system-start test requires no brackets of either kind.
  - No test was added: both are assertions inside existing tests.

### Gates

| gate | result | moved |
|---|---|---|
| 1 | 216 passed (216) | no |
| 2 | 235 passed (235) | no |
| 3 | 0 errors and 7 warnings in 4 files | no |
| 4 | 1173 passed (1173) | no |
| 5 | **555 passed, 5 skipped (560)** | no, unchanged from §5 |

### NOT ESTABLISHED, added

- **§3's gaps between a courtesy number and its tacet numeral were measured
  before the brackets and were not re-measured.** Each bracket widens the string
  by roughly one character on each side, so the gaps (4.22, 3.55 and 3.45
  stave-spaces) are now smaller by about half a bracket's width. The exact figures
  are not re-read.
- **Not walked in a browser since the brackets.**
