# CODE BRIEF. The tessituragram, joined to phonation time (N.123 part 1, N.127 increment 2)

**Written by the desk 2026-09-23 01:55. For Claude Code, working in `~/Desktop/ilya-rewrite` on branch `Shane`.**

**Serves N.123** (the figures) **and N.127 increment 2** (the compass stave). Dann, 2026-09-16: *"we absolutely need to have this visual. Non-negotiable."* and *"'this visual' means the range and the tessituragram with passaggio zone indicated."* Dann, 2026-09-23 01:40: the phonation-time section and the tessituragram are one unit, *"so this information can be taken in simultaneously"* (`docs/memory/OPEN.md`, N.123, the ruling of that date). Dann chose the stave orientation and approved this brief's four attention devices on 2026-09-23 at 01:44 and 01:53.

**NOT ESTABLISHED beats a complete invented answer.** Every `path:line` here was read by the desk on 2026-09-23. Re-read each one before relying on it. Where the tree disagrees with this brief, the tree wins, and you say so in the memo.

## Rules of the house

- Do not commit, stage, or run any git command that writes. Tell Dann which new files need `git add`.
- Run all five gates and report each one against its baseline. The baselines are 216, 235, 0 errors and 12 warnings, 1392, and 576 passed with 5 skipped (581).
- `WRITTEN` is not `DONE`. The build is done when Dann walks it.
- Canadian spelling and no em dashes, in comments and in your memo.
- Every string in section 5 is ratified in both languages. Use them verbatim.

## The two drawings to build from

1. **Design's R3, drawing 1a, 2026-09-11:** `docs/sessions/n127-design-pack/design-return-insights_r3_2026-09-11.dc.html`. It needs `design-return-insights_r3_support.js` beside it to render. Its compass block is the SVG labelled "Range stave: the piece's compass, its tessitura, and your calibrated range". **Build its geometry:** the stave on the left, horizontal bars on the right, one shared pitch axis, the range and tessitura shading, and the passaggio lines drawn across the bars only.
2. **The desk's redraw inside the squircle:** `docs/sessions/tessituragram-squircle_r1_2026-09-23.html`. **Build its additions**, listed in section 3. Its numbers and finding text are placeholders.

## 1. What exists (desk reading, 2026-09-23)

- **The space on page one.** `InsightsPane.svelte:423-428` holds a `compass-reserve` div, 190 px tall (`:612-614`), sized to R3 drawing 1a. The unit replaces it.
- **Per-pitch time:** `aggregatePhonation` (`packages/score-parser/src/phonation.ts:298`) returns `byPitch`, keyed by MIDI number (`:242`), and `byPitchByVowel` (`:246`), which exists only when a vowel resolver is supplied.
- **The tessitura** is `pachecoTessitura` over `byPitch` (`insights.ts:277`). `TessituraRow.measured` (`insights.ts:74`) is the band to shade. `RangeRow` (`insights.ts:53-56`) holds the piece's compass and the range the singer typed.
- **Each finding** carries its anchor's `pitch` and `vowel` (`insights.ts:96-98`). The bar numbers in section 3 hang off these.
- **The phonation-time section** you built in `1dfee32` is `PhonationSection` (`insights.ts:137-162`), drawn on page two by `phonationView` (`InsightsPane.svelte:317`). Page two exists whenever the model does (`InsightsPane.svelte:167-170`).
- **The clef.** Ruled 2026-09-11 (`docs/memory/OPEN.md`, the Insights rulings): *"the compass stave's clef follows the SINGER via `chooseClef` on the declared range's median."* `chooseClef` (`packages/score-parser/src/clef-select.ts:45`) takes a `ParsedScore`, not a range. Adapt it without changing its behaviour for existing callers, or report that you couldn't.
- **The squircle:** `InsightsPane.svelte:593-607`. A 12 px radius, a 1 px `--rose` border, and cream inside. Section heads use `.section-head` (`:627-635`).

## 2. What to build: the unit

The unit sits on **page one, in the compass reserve's place**, inside the page's squircle. From top to bottom:

1. The section head, `insights.phonation.heading`.
2. The headline sentence, exactly as `1dfee32` prints it, in all three tempo states.
3. **The figure**, in its own inner rounded frame as in R3: the compass stave and the bars on one pitch axis.
4. The caption line under the bars (strings in section 5).
5. The list of time per vowel, as `1dfee32` prints it.

**Strike the three-zone bar from page two.** Its three shares now sit on the figure. Dann ruled the pairing, and the desk offered striking the bar (`OPEN.md` N.123, 2026-09-23 01:40). **Page two returns to "only when earned."** It prints when there are deferred findings or untrusted measures to name, and not otherwise. That was ruled 2026-09-11 (`OPEN.md`, the Insights rulings): *"page one fixed at one page, a second page only when earned."*

**If page one can't hold the unit and the findings, measure it and don't shrink anything.** DESK DEFAULT: the list of time per vowel moves to the top of page two first. If page one still overflows, stop and report the heights in px. Measure the worst case: French, two three-line findings, and both tessitura qualifiers. Code estimated that case at about 24 px over in `1dfee32`, and nobody observed it. This time, observe it.

### The figure's rules

- **One bar per pitch, at that pitch's stave position.** Position by spelling: letter and octave. Pitches that share a line or space split its height into thin bars, lowest pitch on the bottom (B♭3 and B3 share the B line). R3 drew one bar per stave step. That merges such pitches, and it's the one part of R3 not to copy.
- **Bar length is time, measured from a shared baseline.** When the tempo is a point, the scale is seconds. When it's a range, the scale is quavers, and the longest bar's label prints the range. When there's no tempo, the scale is quavers and labels print the share as a percentage. Never print a point where `secondsFor` gives a range, and never invent a tempo (`phonation.ts:411-427`, `:444-499`).
- **The longest bar carries its value** at its end. It's the only number on the axis.
- **The passaggi:** two dashed lines in `--rose-chip`, across the bars only, named `primo` and `secondo` where they enter the bars. Each zone's share prints at the right edge of its zone. **Zone edges:** keep the ones you wrote in `1dfee32` (below means MIDI < primo, above means MIDI > secondo), and keep the code comment that states them. **Without both passaggi,** draw no lines and no shares, and keep the `crossingsUncounted` behaviour.
- **The shading:** the singer's typed range fills the frame's field in `--rose-desk`. The piece's tessitura is a band behind the stave in `--rose`, lightly tinted. Each area is labelled where it sits, and there's no legend.

## 3. The four attention devices. All approved by Dann 2026-09-23 01:53. The desk offered all four

1. **Numbers that tie findings to bars.** Every finding in the list takes a small circled number, 1 upward, in list order, and page two's findings continue the count. The same circled number sits at the end of the bar for that finding's anchor `pitch`. When two findings share a pitch, their numbers sit side by side. The number is drawn, in `--rose-ink`, and it's not a string.
2. **One focus colour.** Inside each bar, the time sung on **any vowel that carries a finding** (from `byPitchByVowel`) draws in `--rose-ink`, starting at the baseline. The rest of the bar is `--rose`. In the list of time per vowel, those vowels print in `--rose-ink`, bold, underlined 2 px. This replaces `1dfee32`'s bold with a mark that matches the bars. **Without a resolver** (`byPitchByVowel` absent), there's no segment, no marked vowels, and the caption drops its second half.
3. **Labels where things sit.** No legend anywhere in the unit.
4. **A quiet song looks quiet.** When `findings` is empty, the bars draw in `--rose` at half opacity, with no segments and no numbers. DESK DEFAULT on the opacity.

**Colour roles, one per token, all from `app.css`:** `--rose-desk` (`:150`) is the range field. `--rose` (`:47`) is the bars and the tessitura band. `--rose-chip` (`:173`) is the passaggio lines. `--rose-ink` (`:185`) is the focus segment, the numbers, and every label in the figure. Add no new hex.

## 4. Not in this build

- The singer's own sustain capacity against the bars (Titze and Maxfield 2021, p. 659). It needs the timed legato intake test, which doesn't exist.
- The half-mass band, the centre of gravity, and cycle dose. Their sources are NOT ESTABLISHED (`OPEN.md` N.123).
- The tempo pointer string. It stays written and unrendered, as `1dfee32` left it.

## 5. Strings

Use the `insights.figure.*` prefix (DESK DEFAULT; rename if the file's conventions say otherwise). The English is the desk's. **Dann ratified every French row as written, 2026-09-23 01:57.** The desk offered them all.

| key | English | French | status |
|---|---|---|---|
| `rangeLabel` | your range, {low} to {high} | votre ambitus, {low} à {high} | RATIFIED 2026-09-23 01:57 |
| `tessitura` | tessitura | tessiture | RATIFIED 2026-09-23 01:57 |
| `lowest` | {pitch} lowest | {pitch} la plus grave | RATIFIED 2026-09-23 01:57 |
| `highest` | {pitch} highest | {pitch} la plus aiguë | RATIFIED 2026-09-23 01:57 |
| `primo` | primo | primo | RATIFIED 2026-09-23 01:57 |
| `secondo` | secondo | secondo | RATIFIED 2026-09-23 01:57 |
| `zoneAbove` | above · {share} | au-dessus · {share} | RATIFIED 2026-09-23 01:57 |
| `zoneBetween` | between · {share} | entre · {share} | RATIFIED 2026-09-23 01:57 |
| `zoneBelow` | below · {share} | au-dessous · {share} | RATIFIED 2026-09-23 01:57 |
| `caption` | Seconds of phonation per pitch | Secondes de phonation par hauteur | RATIFIED 2026-09-23 01:57 |
| `captionQuavers` | Phonation per pitch, in quavers | Phonation par hauteur, en croches | RATIFIED 2026-09-23 01:57 |
| `captionFocus` | dark: sung on {vowels} | en foncé : chanté sur {vowels} | RATIFIED 2026-09-23 01:57 |

`{share}` is `insights.phonation.share`. French typography: a no-break space before `:`, as the file already writes it (`i18n.ts:1476`).

**Also:** change the comments on `insights.phonation.findingOne`, `untrustedOne`, and `untrustedMany` from NOT RATIFIED to "RATIFIED by Dann 2026-09-23 01:35". Their French was ratified then (`docs/sessions/insights-phonation-time_r1_2026-09-22.md`, final section).

## Done when

- The gates are at baseline, or moved only by tests you added, each one named.
- The memo reports:
  - every file touched, with `path:line`
  - page one's measured height in both languages on a real score, plus the worst case
  - whether page two still appears, and why
  - the three tempo states on real scores
  - a score with no typed passaggi, and a score with no findings
  - a pitch slot shared by two spellings, seen rendered
  - what `chooseClef` did for a bass voice and a treble voice
- Dann walks it in both languages on the alias.

## Return

A memo of at most 350 words with the list above and **a section headed "NOT ESTABLISHED"**. Save it as `docs/sessions/memo-code-tessituragram_r1_<date>.md`.
