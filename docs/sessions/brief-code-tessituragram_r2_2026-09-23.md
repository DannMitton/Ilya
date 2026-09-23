# CODE BRIEF. The tessituragram, revised after Dann's walk (N.123 part 1, N.127 increment 2), r2

**Written by the desk 2026-09-23 03:20. For Claude Code in `~/Desktop/ilya-rewrite`, branch `Shane`, on top of `0ccda31`.** It revises the figure you built from `docs/sessions/brief-code-tessituragram_r1_2026-09-23.md`. Everything in r1 still holds unless this brief replaces it. Your memos are `memo-code-tessituragram_r1_2026-09-23.md` and `memo-code-tessituragram-fit_r1_2026-09-23.md`.

**Why:** Dann walked `0ccda31` in English at 02:40. The bars had no labels, the thin paired bars meant nothing to him without a legend, and he asked for simplification *"that prioritizes the user's comprehension at a glance."* Every design choice here was offered by the desk in drawings and approved by Dann between 02:49 and 03:17, unless it's marked DESK DEFAULT.

**The drawing to build from:** `docs/sessions/tessituragram-sparse_r1_2026-09-23.html`. Its numbers and finding tags are placeholders.

**NOT ESTABLISHED beats a complete invented answer.** Re-read every `path:line` before relying on it. Where the tree disagrees, the tree wins, and you say so.

## Rules of the house

As in r1: no git writes, all five gates against baseline (216, 235, 0 errors and 12 warnings, 1395, 578 passed with 5 skipped, 583), WRITTEN is not DONE, Canadian spelling, and no em dashes.

## 1. The figure: one stave carries everything

- **One stave, full width.** From left to right: the clef (`chooseClefForSpan`, unchanged), the compass as its two notes, a thin barline, then the bars growing rightward along the same lines and spaces. **There's no gap and no second frame.** The inner rounded frame from r1 goes.
- **Under the bars, the stave lines continue at reduced opacity.** Ledger positions the bars need draw as faint dotted lines.
- **Pitch names sit on the faint lines at the bars' left edge, not by the clef.** There's no name column beside the clef; Dann ruled that redundant at 03:04. Name every stave line, and every ledger line the bars reach.
- **Only the accidentals the piece sings get a row. Dann's idea, 03:15 to 03:17: "only the accidentals that appear, as opposed to listing all of the possible accidentals."**
  - A sung sharp or flat draws at its sounding pitch, half a stave step from its letter: F♯3 just above F3, B♭3 just below B3.
  - Its name prints in the name column, in `--rose-ink`, weight 600. The line names stay in tertiary ink.
  - Take the spelling from the score: `byPitch` is keyed by MIDI (`packages/score-parser/src/phonation.ts:242`), and the vocal line carries spelled pitches (each `Finding.pitch` is "as spelled in the score", `insights.ts:96`). Say where you took it from.
  - **Enharmonics** (A♯3 and B♭3 both sung) share one row, named "A♯3 / B♭3". DESK DEFAULT.
  - When a natural and its neighbour half a step away are both sung, **both bars draw thinner**, so a visible gap stays between them. DESK DEFAULT: about 3 px bars on the page, against the usual 4 to 5.
  - **A very chromatic song:** when rows would sit closer than they can be told apart, the figure grows taller. Page one's measured fitting from `0ccda31` takes it from there. Report the threshold you chose.
- **The removed shared-place rule.** r1's thin pairs, where two spellings split one stave step, are gone. Each sounding pitch has its own row, and no "with F♯3" label is needed.
- **The tessitura** is shaded on the stave and continues behind the bars. It's labelled once, beside the stave.
- **The passaggi:** dashed `--rose-chip` lines that start just past the barline and run across the bars, named `primo` and `secondo`. Each zone's share sits at the right edge, inside its zone, using the ratified `insights.figure.zone*` strings. Draw the lines **before** the bars and labels, so a label is never struck through.
- **The singer's range field is gone.** The fit table already states range against compass. `insights.figure.rangeLabel` stays in the file, unrendered.
- **The title above the bars** is `insights.figure.caption`, or `captionQuavers` without a tempo. It's no longer under the frame.
- **Only the longest bar prints its value.** No other numbers go on the axis.

## 2. Findings on the bars: words, not numbers

- **Remove the circled numbers from the bars and from the findings list.** Dann, 03:01: *"the numbers alone mean nothing to the user."*
- **A bar is dark when a finding sits on that pitch:** the whole bar is `--rose-ink`. Every other bar is `--rose`. **The two-tone focus segment from r1 goes,** and so does `captionFocus` from the title (leave the string in the file).
- **A dark bar's end prints the finding's tag** as the findings list opens it, less the pitch, which the row already shows: the measure (`loupe.measureTagShort`) and the vowel, for example "m. 17 · [ɨ]". Put it on a paper-coloured backing so no line crosses it. Two findings on one pitch stack their tags, one per line.
- If that bar is also the longest, the value follows the tag: "m. 17 · [ɨ] · 16 s".
- **A quiet song** (no findings) keeps r1's half opacity.

## 3. The vowels: bars in a fixed order

- **The list becomes a bar chart.** One horizontal bar per vowel in `--rose`, with the value at its end. That follows Dann's own Figure 6.10.
- **The order is fixed, never by time. Ruled 2026-09-23 03:13** (`docs/memory/OPEN.md`, N.123, "THE VOWEL CHART'S ORDER"): **[i] [e] [ɪ] [ɨ] [ɛ] [a] [ɑ] [ʌ] [o] [u]**, which is the order of `VOWELS` at `engine/types.ts:26`. Use that constant; don't copy it.
- **A vowel with a finding** draws its bar and its label in `--rose-ink`, matching the dark pitch bars.
- **The heading changes. RATIFIED 2026-09-23 03:14:** `insights.phonation.byVowel` becomes "Seconds of phonation per vowel" / « Secondes de phonation par voyelle ».
- **A vowel the piece never sings** doesn't print. DESK DEFAULT.
- **Under 1 s,** print one decimal, formatted for the language ("0.4 s", « 0,4 s »). DESK DEFAULT. Dann's screenshot printed "[a] 0 s".
- The vowel chart can still move to page two by measurement, exactly as the list did.

## 4. Held, not in this build

- The worst case that still overflows page one by 107 px (your fit memo).
- The clef for a voice far from the song, and treble-8vb for a tenor.
- Figure 6.8's open and close setting, and front, central, and back grouping, both from Dann's dissertation. They're candidates, not rulings.

## Strings

**No new strings.** Every visible word is already ratified: `insights.figure.caption`, `captionQuavers`, `primo`, `secondo`, `zoneAbove`, `zoneBetween`, `zoneBelow`, `tessitura`, `insights.fit.compass` for the compass line, `loupe.measureTagShort`, and the new text of `insights.phonation.byVowel`. If you find you need a word that isn't in that list, stop and name it in the memo; don't write it.

## Done when

- Gates at baseline, or moved only by named tests you added.
- Seen rendered, in both languages, and described in the memo:
  - a piece with sung accidentals, with the rows and names shown
  - a piece with none
  - a dark bar with its tag
  - two findings on one pitch, if any fixture has it (otherwise NOT ESTABLISHED)
  - the vowel chart in the ruled order
  - page one's end against the foot, on Sunless 1
- Dann walks it in both languages on the alias.

## Return

A memo of at most 300 words with a section headed "NOT ESTABLISHED", saved as `docs/sessions/memo-code-tessituragram_r2_<date>.md`.
