# Brief for Code: N.94 slice 2, the Transposition ruler on the phone, the twins, and Insights

Written by the desk 2026-09-28 22:30, at `de31e22`. Slice 1 shipped in that commit;
its report is `docs/sessions/report-code-n94-key-ruler-slice1_r1_2026-09-28.md`.
**Runs after the Markup legend brief** (`brief-code-markup-legend-four-out_r1_2026-09-28.md`)
has reported, since both touch `markup/`.

## What the singer gets

On a phone, "Try another key" docks the ruler at the bottom edge instead of floating
it. Where two spellings of one key sound the same (C♭ and B, G♭ and F♯, D♭ and C♯),
the harder one to read is dimmed and says why, and Ilya's pick is always the easier
one. In Insights, a finding that recommends a transposition offers "Try this key",
which opens the same ruler set to that key; after "Use this key", Insights reads the
song in the key the singer will sing.

## The rulings

- **Design:** drawing `docs/sessions/drawing-key-ruler_r4_2026-09-28.html`, plate 4
  (the phone dock), accepted by Dann 2026-09-28. The phone: a dock at the bottom edge,
  a scrolling window of about seven stops at 44 px, fading edges, the chips below, the
  same readout and pills as the desk.
- **Name:** the Transposition ruler (Dann 21:14, `PRODUCT.md` §Naming).
- **Spelling:** every note moves by the same interval (Dann 21:35, `PRODUCT.md`).
- **The twins, Dann 21:41** (`OPEN.md` §N.94, slice 2): for each twin pair, count the
  double accidentals each twin would draw; the twin with more is dimmed but stays
  tappable, and its readout adds the count; Ilya's pick always lands on the cleaner
  twin; keys without a twin never dim. No threshold.
- **Insights follows the chosen key:** curation rule 3 (Dann, 2026-09-24,
  `docs/sessions/draft-curation-rules_r1_2026-09-24.md`): comments are "computed in
  the key the singer will sing". The gates (`analysis/gates.ts`) and Insights' figures
  both read the transposed score after "Use this key".
- **Nothing prints but the header line** (`CONTRACT.md` §6, passing layers).

## The work

1. **Twins.** In `transposition-ruler.ts`, count the double flats and double sharps each
   stop would draw (the preview already moves every note). For a twin pair, dim the
   one with more; tie: neither dims. Ilya's recommendation moves to the cleaner twin
   when it lands on a pair. The dimmed stop stays tappable, and its readout gains the
   count line (strings below).
2. **Phone dock.** Below the desk breakpoint, the ruler docks at the bottom edge per
   plate 4, with the two chips. Tap targets 44 px.
3. **Insights.** A range finding that recommends a transposition carries a "Try this
   key" pill that opens the ruler on that key (switching to Markup, as the Piece
   band's pill does from Text). After "Use this key", Insights computes from the
   transposed score. Its header states the transposition as Markup's does, with the
   same string.
4. **Tests** for the count, the dimming, the pick moving to the cleaner twin, and
   Insights reading the transposed score.

## Strings. French RULED by Dann 2026-09-28 22:27 ("Ratified"); drafted by the desk

| key (Code may rename) | English | French |
|---|---|---|
| `key.ruler.doubleFlatOne` | Carries 1 double flat | Comporte 1 double bémol |
| `key.ruler.doubleFlatMany` | Carries {n} double flats | Comporte {n} doubles bémols |
| `key.ruler.doubleSharpOne` | Carries 1 double sharp | Comporte 1 double dièse |
| `key.ruler.doubleSharpMany` | Carries {n} double sharps | Comporte {n} doubles dièses |
| `key.dock.asPrinted` | As printed · {tonic} | Tonalité imprimée · {tonic} |
| `key.dock.pick` | Ilya's pick · {tonic} | Choix d'Ilya · {tonic} |
| `insights.tryKey` | Try this key | Essayer cette tonalité |

Tonic names in French come from `watch.key.letter.*` (lowercase: « ré », « si »).

## Gates

All eight at baseline or better; report gates 4 and 5. `check` 0 errors; ratchets OK
and **no ceiling raised** (invariant 12: move wiring into modules instead). Screenshots
of the phone dock, a dimmed twin with its count, and Insights after a transposition,
in both languages.

## The report

`docs/sessions/report-code-n94-slice2_r1_<date>.md`: what changed with `path:line`,
gates, screenshots, and **What I could not establish**. NOT ESTABLISHED beats a
complete invented answer. Do not commit, stage, stash, check out, or restore. Dann ships.

## Addendum, 2026-09-28 23:55: two fixes before slice 2 ships

The desk checked slice 2 in a cloud copy: web 1,682, score-parser 636 and 5 skipped,
`check` 0 errors, ratchets OK. Two findings.

1. **The pill pushes the range finding off Insights' page one.** On Sunless 1 with the
   desk's test voice, the "Try this key" pill on its own line adds enough height that
   the range finding ("The note drops below the range you typed", m. 5) no longer fits
   page one and moves to "The findings page one deferred" on page 2. The finding that
   carries the most useful action is the one deferred. **Fix, DESK DEFAULT:** set the
   pill inline at the end of the finding's text, wrapping with it, so it adds no line
   of its own; or count its height in page one's fit so the finding keeps its place.
   Report which, and show Sunless 1's page one with the range finding and its pill.
2. **The phone dock covers the last line of music.** DESK DEFAULT: reserve room under
   the page while the dock is open, as the loupe's dock does, so nothing the singer is
   judging sits under it. Keep the dock's 98% background, as plate 4 draws it.

Re-run all eight gates, append to the slice 2 report. Do not commit, stage, stash,
check out, or restore. Dann ships.
