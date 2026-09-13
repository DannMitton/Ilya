# Memo: the colour census, use by use

**Answers:** `docs/sessions/brief-colour-census_r1_2026-09-13.md`, read in full this session.
**Serves:** stage 1 of `docs/sessions/plan-colour-story_r1_2026-09-13.md`, read in part this session (stages 1 to 6 and the closing list).
**Date:** 2026-09-13.
**Status:** read-only audit. No file in the tree was changed. Git was not run. The one file written is this memo.

**NOT ESTABLISHED beats a complete invented answer.** Every "sits on" and every "what it colours" cell was read out of source, not observed in a browser. §8 says exactly what that costs.

---

## 1. What the census found, in eight lines

1. **Seventy-six distinct colour values** are written in the tree. `app.css` declares 39 colour tokens, which hold 29 of them; the rest are literals, fallbacks, or `rgba()` bases. §4 lists all 76.
2. **The neutrals are twelve values, not eleven tokens.** The brief's own list names ten tokens plus two literals. Two pairs are almost the same lightness: `--stone-300` and `--desk-surface` (L 0.869 and 0.870), and `--stone-700` and `--ink-secondary` (L 0.374 and 0.394).
3. **The "cool stone" is not cool.** In OKLCH the three stone tokens sit at hue 56° to 68° and the three inks at 67° to 73°: one band 17° wide, all at chroma 0.012 or less. §6.1 has the numbers.
4. **There are eight lavender values, and seven of them paint something.** One of the seven is a different violet altogether. There are twelve sage-family values, and ten paint. §5.1 and §5.2.
5. **Eleven token names are read but never declared**, and nine are declared but never read. One place, the score upload's question card and read report, reads four undeclared names with no working fallback in nine declarations. §5.3.
6. **Forty-four distinct values are written as bare literals**, and four more only as `rgba()` bases. Ten of the 48 hold exactly a token's value. Nine more sit within ΔE 0.01 of a token, too close to tell apart. §5.4.
7. **The four surfaces are three jobs and one ground.** `--paper-cream` is the page, `--drawer-bg` is the drawer's cards, `--paper-light` is paper that is not the page, and `--desk-surface` is painted on no tab. The same job, "a card inside a drawer card", is done by four different fills. §6.2.
8. **The brief's use counts do not match the tree.** Every token count in the brief is higher than the tree's, by 11 % to five times, and `#3A352F`'s is a quarter of the tree's. §3 gives both columns.

---

## 2. How this was measured

**The instrument.** A Node script, written for this audit and kept in the session scratchpad, reads every `.svelte`, `.ts`, `.css`, `.js`, and `.html` file under `apps/web/src` and the four `packages/*/src` directories: 254 files. It records every `var(--…)` reference, including a `var()` nested inside another's fallback; every custom property declaration; every hex literal; every `rgb()`, `rgba()`, and `color-mix()`; and `white` or `black` where they set a colour. It classifies each line as code, comment, or test.

**OKLCH.** Computed in the same script from Björn Ottosson's published OKLab matrices (2020), with no colour library. **Positive controls, run this session:** `#FF0000` gives L 0.62796, C 0.25768, h 29.23, and `#0000FF` gives L 0.45201, C 0.31321, h 264.05, which match Ottosson's published values. ΔE in this memo is Euclidean distance in OKLab. CSS Color 4's gamut-mapping algorithm treats **ΔE 0.02 as one just-noticeable difference**. That figure is from memory and was not read this session.

**What could make the instrument lie, and what was done about it.**

- **A reference inside a comment counted as a use.** Controlled: for every colour token, `grep -o 'var(--name'` was run beside the script. The script and grep disagreed on three tokens, and each disagreement was a comment line the script correctly excluded (`ScoreUploader.svelte:1099`, `+page.svelte:5178`, and three comment mentions of `var(--sage)`).
- **HTML entities read as colours.** `&#160;`, `&#171;`, `&#183;`, and `&#8201;` match a hex pattern. The first scan counted 368 false `#160`s in `LearnContent.svelte`. Excluded by requiring no `&` before `#`.
- **A nested `var()` missed.** `var(--notation-accent, var(--sage))` hid an inner reference. Fixed. Four such inner colour references are now rows.
- **"Undeclared" meaning "not found by a narrow search".** Controlled: each ghost name was searched as a declaration (`--name:`), as a `setProperty('--name')` call, and as a Svelte `style:--name` directive, across `apps/web/src`, `apps/web/static`, and every `packages/*/src`. All returned nothing. The positive control, `--sage:`, returned its one declaration.

**Scope left out, on purpose.** Test files (52 colour references, reported only where a test pins a value), comments (19 hex mentions), `transparent` and `currentColor` (87 occurrences, which name no colour), vendored files under `apps/web/static`, and `apps/web/build`.

**How the columns were filled.**

- **What it colours:** for stylesheet rows, the rule's selector turned into words, the English text of the first element in that component's markup that carries the class (marked "e.g." when more than one element does), and the place in the app. For script, markup, and renderer rows, 159 cells were written by hand after reading the surrounding code.
- **What it sits on:** the nearest enclosing element with a declared background, found by walking up the component's markup, then into every component that mounts it, then through snippets into the component that renders them. Where more than one mount exists, every distinct answer is listed. A background declared only in a state rule, such as `.yo-sigla.is-yo`, is named with its state, because at rest that ground is not there.
- **Swappable to:** for the twelve neutrals of §1a, the nearest other of those twelve by ΔE, with the lightness gap. For every other row, the nearest declared colour token.
- **Observation:** print context, a fallback that disagrees with its token, a literal that equals a token, an undeclared token and what CSS does with it, and alpha. One clause, never a verdict.

---

## 3. The brief's figures against the tree

The tree wins, per CONTRACT tether 3. "Token uses" counts every `var()` reference outside `app.css`'s `:root` block and outside tests and comments. "Literal paints" counts the value written bare.

| name | brief says | tree: token uses | tree: literal paints of the same value |
|---|---|---|---|
| `--ink-primary` `#1A1612` | 85 | 75 | 36: 27 in `staff-renderer.ts`, 4 in `NotePicker.svelte`, 2 in `SyllableStation.svelte`, 3 in the font lab developer route |
| `--ink-secondary` `#4A4540` | 100 | 90 | 2, both in the font lab developer route |
| `--ink-tertiary` `#6A655F` | 73 | 64 | 2: `SyllableStation.svelte:203`, `staff-renderer.ts:2702` |
| `--stone-300` `#D6D3D1` | 38 | 29, plus 1 through `--color-border` | 0 |
| `--stone-500` `#78716C` | 15 | 8 | 6 |
| `--stone-700` `#44403C` | 9 | 2 | 1 |
| `--drawer-bg` `#FAF8F5` | 17 | 8 | 0 |
| `--paper-light` `#F5F1E8` | 12 | 4 | 0 |
| `--paper-cream` `#F0EBE0` | 30 | 20 | 1: `staff-renderer.ts:2828` |
| `--desk-surface` `#D8D4C8` | 10 | 2, both fallback chains (`+page.svelte:5193`, `Drawer.svelte:2050`), plus the `--app-bg` alias at `app.css:54` | 0 |
| `#3A352F` | 9 | not a token | 38: 29 in `staff-renderer.ts`, 9 in `NotePicker.svelte` |
| `#57534E` | 7 | not a token | 0 bare; 7 as the fallback of `--stone-600` |
| `#8E7E9B` | 29 inline | 26 through `--deeper-lavender` | 18 bare paints, 1 copy in `contrast.ts:128`, and 10 fallback copies |

Three smaller corrections:

- **"Eleven tokens"** in the brief's §1a heading: its list holds ten tokens and two literals.
- **`#3A352F`'s "9 uses"** matches `NotePicker.svelte` alone. The score renderer carries 29 more.
- **`#8E7E9B`'s "29 inline"** matches bare literals plus fallback copies: 19 bare (18 paints and the `contrast.ts` copy) and 10 inside `var(--deeper-lavender, #8E7E9B)` or `var(--fit-accent, #8e7e9b)`.

The plan's evidence lines cite `Drawer.svelte:1187` for the Input band and `:1178` for the Piece band. In the tree today those declarations are at `Drawer.svelte:1188` and `:1179`. The brief's `app.css:238` for the print inversion is correct.

---

## 4. The whole palette: 76 values

Sorted by OKLCH lightness. "Token uses" sums every token that holds the value. "Inline paints" excludes the pacifier contrast checker's copies, which paint nothing.

| value | OKLCH L / C / H | token(s) | token uses | inline paints | fallback copies | rgba uses |
|---|---|---|---|---|---|---|
| `#000000` | 0.000 / 0.000 / – | none | 0 | 0 | 0 | 12 |
| `#1A1612` | 0.203 / 0.010 / 67 | `--ink-primary`, `--color-text` | 75 | 36 | 39 | 8 |
| `#282623` | 0.270 / 0.006 / 78 | none | 0 | 0 | 0 | 1 |
| `#2E2A26` | 0.288 / 0.009 / 67 | none | 0 | 0 | 0 | 5 |
| `#3A352F` | 0.332 / 0.012 / 72 | none | 0 | 38 | 0 | 0 |
| `#3C3A36` | 0.349 / 0.007 / 85 | none | 0 | 3 | 0 | 0 |
| `#44403C` | 0.374 / 0.009 / 68 | `--stone-700` | 2 | 1 | 2 | 0 |
| `#4A4540` | 0.394 / 0.011 / 68 | `--ink-secondary` | 90 | 2 | 22 | 0 |
| `#7F1D1D` | 0.396 / 0.133 / 26 | none | 0 | 1 | 0 | 0 |
| `#5A5248` | 0.443 / 0.019 / 73 | none | 0 | 0 | 2 | 0 |
| `#57534E` | 0.444 / 0.010 / 74 | none | 0 | 0 | 7 | 0 |
| `#A32D2D` | 0.480 / 0.154 / 25 | `--signal-red` | 2 | 0 | 0 | 0 |
| `#4D6387` | 0.497 / 0.064 / 260 | none | 0 | 1 | 0 | 0 |
| `#6A655F` | 0.509 / 0.011 / 73 | `--ink-tertiary`, `--color-text-muted` | 64 | 2 | 7 | 0 |
| `#B23B3B` | 0.524 / 0.155 / 24 | none | 0 | 2 | 0 | 0 |
| `#8A5C5C` | 0.524 / 0.061 / 19 | none | 0 | 1 | 0 | 0 |
| `#74677F` | 0.535 / 0.040 / 309 | none | 0 | 1 | 0 | 0 |
| `#8A6D3B` | 0.552 / 0.077 / 80 | none | 0 | 1 | 0 | 0 |
| `#78716C` | 0.553 / 0.012 / 58 | `--stone-500` | 8 | 6 | 1 | 0 |
| `#5C739E` | 0.555 / 0.073 / 263 | `--quiet-cobalt`, `--lang-chip-guide` | 11 | 0 | 10 | 3 |
| `#B45309` | 0.555 / 0.146 / 49 | none | 0 | 1 | 0 | 0 |
| `#6C7A5F` | 0.560 / 0.044 / 130 | `--lang-chip-transcription` | 2 | 0 | 1 | 0 |
| `#6B7B5E` | 0.561 / 0.047 / 131 | none | 0 | 1 | 0 | 0 |
| `#8F6A6A` | 0.562 / 0.048 / 19 | none | 0 | 2 | 0 | 0 |
| `#806E8E` | 0.567 / 0.053 / 310 | `--lang-chip-marked` | 3 | 0 | 1 | 0 |
| `#7C6BB0` | 0.573 / 0.105 / 294 | none | 0 | 1 | 0 | 1 |
| `#9A6A6A` | 0.574 / 0.062 / 19 | `--lang-chip-learn` | 2 | 0 | 2 | 0 |
| `#7A8A6C` | 0.612 / 0.048 / 131 | `--deeper-sage` | 7 | 0 | 6 | 0 |
| `#8E7E9B` | 0.618 / 0.047 / 310 | `--deeper-lavender` | 26 | 18 | 10 | 0 |
| `#8A8780` | 0.624 / 0.011 / 88 | none | 0 | 2 | 1 | 0 |
| `#A67B7B` | 0.625 / 0.054 / 19 | `--dusty-rose`, `--terracotta` | 16 | 3 | 16 | 4 |
| `#FF0000` | 0.628 / 0.258 / 29 | none | 0 | 2 | 0 | 0 |
| `#BC7E08` | 0.641 / 0.134 / 74 | `--prep-amber` | 7 | 0 | 0 | 0 |
| `#96918A` | 0.659 / 0.012 / 77 | none | 0 | 1 | 0 | 0 |
| `#D97706` | 0.666 / 0.157 / 58 | none | 0 | 3 | 0 | 1 |
| `#8B9A7D` | 0.666 / 0.045 / 130 | `--sage`, `--color-accent` | 85 | 1 | 8 | 14 |
| `#8A9B7E` | 0.668 / 0.046 / 132 | none | 0 | 0 | 1 | 0 |
| `#C28888` | 0.684 / 0.071 / 19 | none | 0 | 2 | 0 | 0 |
| `#1DB954` | 0.689 / 0.187 / 149 | `--arc-green` | 2 | 0 | 0 | 0 |
| `#8BA48B` | 0.692 / 0.046 / 145 | none | 0 | 2 | 0 | 0 |
| `#A0A09B` | 0.704 / 0.007 / 107 | none | 0 | 2 | 0 | 0 |
| `#A89BB5` | 0.709 / 0.040 / 308 | `--muted-lavender` | 1 | 0 | 1 | 0 |
| `#A8A29E` | 0.716 / 0.009 / 56 | none | 0 | 0 | 4 | 0 |
| `#AAA8A0` | 0.731 / 0.012 / 95 | none | 0 | 1 | 0 | 0 |
| `#A8B5A0` | 0.757 / 0.033 / 133 | `--light-sage` | 0 | 0 | 0 | 0 |
| `#C4BACF` | 0.804 / 0.031 / 307 | `--light-lavender` | 0 | 0 | 0 | 0 |
| `#BEC7D8` | 0.828 / 0.026 / 263 | `--surround-guide` | 1 | 0 | 1 | 0 |
| `#C8C8C3` | 0.831 / 0.007 / 107 | none | 0 | 3 | 0 | 0 |
| `#D2CBD7` | 0.851 / 0.018 / 312 | `--surround-marked` | 1 | 0 | 1 | 0 |
| `#DBCACA` | 0.853 / 0.019 / 18 | `--surround-learn`, `--surround-insights` | 2 | 0 | 2 | 0 |
| `#D4CEC8` | 0.855 / 0.011 / 68 | none | 0 | 0 | 1 | 0 |
| `#D6D3D1` | 0.869 / 0.004 / 56 | `--stone-300`, `--color-border` | 30 | 0 | 8 | 0 |
| `#D8D0E0` | 0.869 / 0.023 / 308 | `--surround-shane` | 1 | 0 | 0 | 0 |
| `#D8D4C8` | 0.870 / 0.017 / 92 | `--desk-surface`, `--app-bg`, `--color-bg` | 3 | 0 | 2 | 0 |
| `#D1D7CB` | 0.871 / 0.017 / 129 | `--surround-transcription` | 1 | 0 | 1 | 0 |
| `#DDD9D4` | 0.887 / 0.008 / 74 | none | 0 | 2 | 2 | 0 |
| `#F0D8D8` | 0.902 / 0.027 / 18 | none | 0 | 2 | 0 | 0 |
| `#E7E5E4` | 0.923 / 0.003 / – | none | 0 | 0 | 4 | 0 |
| `#EDE8E0` | 0.933 / 0.012 / 80 | none | 0 | 0 | 1 | 0 |
| `#F0EBE0` | 0.941 / 0.016 / 86 | `--paper-cream` | 20 | 1 | 4 | 0 |
| `#EBEEE8` | 0.945 / 0.009 / 129 | none | 0 | 1 | 0 | 0 |
| `#F5F0E6` | 0.956 / 0.014 / 85 | none | 0 | 0 | 1 | 0 |
| `#F5F0E8` | 0.957 / 0.012 / 80 | none | 0 | 1 | 1 | 0 |
| `#F5F1E8` | 0.959 / 0.013 / 87 | `--paper-light` | 4 | 0 | 3 | 0 |
| `#F0F3EE` | 0.960 / 0.007 / 132 | none | 0 | 1 | 0 | 0 |
| `#F8F6F0` | 0.973 / 0.008 / 91 | none | 0 | 1 | 0 | 0 |
| `#F5F7F3` | 0.974 / 0.006 / 129 | none | 0 | 1 | 0 | 0 |
| `#FDF6E8` | 0.975 / 0.020 / 85 | none | 0 | 1 | 0 | 0 |
| `#FAF7F2` | 0.977 / 0.007 / 81 | none | 0 | 1 | 1 | 0 |
| `#F9F7F5` | 0.977 / 0.003 / – | none | 0 | 2 | 1 | 0 |
| `#FAF8F4` | 0.980 / 0.006 / 85 | none | 0 | 3 | 0 | 0 |
| `#FAF8F5` | 0.980 / 0.005 / 78 | `--drawer-bg`, `--color-paper` | 8 | 0 | 2 | 0 |
| `#FDFBF6` | 0.988 / 0.007 / 89 | none | 0 | 2 | 0 | 0 |
| `#FDFBF7` | 0.989 / 0.006 / 85 | none | 0 | 0 | 1 | 0 |
| `#FCFDFC` | 0.993 / 0.002 / – | none | 0 | 1 | 0 | 0 |
| `#FFFFFF` | 1.000 / 0.000 / – | none | 0 | 62 | 0 | 2 |

---

## 5. The three §1b questions

### 5.1 How many lavenders there really are

**Eight distinct values in the lavender family, hue 294° to 312°. Seven paint something a singer can see; `#C4BACF` paints nothing. One of the seven, `#7C6BB0`, is a different violet: its chroma is twice any other.**

| value | OKLCH L / C / H | name | what it is for, from its use sites |
|---|---|---|---|
| `#74677F` | 0.535 / 0.040 / 309 | literal | the version badge in the header sigil on Marked score, `HeaderBar.svelte:165`. Its only use. |
| `#806E8E` | 0.567 / 0.053 / 310 | `--lang-chip-marked` | the Score markup band (`Drawer.svelte:1192`), the calibration takeover's band (`Drawer.svelte:1555`), and Marked score's language pill (`HeaderBar.svelte:224`). |
| `#7C6BB0` | 0.573 / 0.105 / 294 | literal | the left edge, and at 8 % the fill, of the score upload's "Read from a picture" banner, `ScoreUploader.svelte:996` and `:997`. |
| `#8E7E9B` | 0.618 / 0.047 / 310 | `--deeper-lavender` | the Marked score and voice hue itself, 44 painted uses: the header bar on Marked score (`HeaderBar.svelte:94`), the voice anchor's dot and button (`VoiceAnchor.svelte:77`, `:114`), the calibration takeover's headings and primary button (`CalibrationWizard.svelte:1648`, `:1714`), the correction stations' labels and engaged cells (`CorrectionSurface.svelte:983`, `:1049`), the Marked score page's title block and footer hairline (`VoiceProfilePane.svelte:1137` to `:1139`, `:1151`), the syllable cursor (`SyllableStation.svelte:245`), a captured vowel's ring (`Pacifier.svelte:715`), and the turning pitches in the score (`staff-renderer.ts:626`). 18 of the 44 are bare literals. |
| `#A89BB5` | 0.709 / 0.040 / 308 | `--muted-lavender` | the border of the "new version is ready" toast, `+page.svelte:5795`. Its only use, and it is not in the pacifier, under whose heading `app.css:163` files it. |
| `#C4BACF` | 0.804 / 0.031 / 307 | `--light-lavender` | **paints nothing.** Its only other appearance is the copy in `contrast.ts:127`, which `contrast.test.ts` (R20, `:233`) holds equal to `app.css`. |
| `#D2CBD7` | 0.851 / 0.018 / 312 | `--surround-marked` | Marked score's desk, `+page.svelte:5370`. |
| `#D8D0E0` | 0.869 / 0.023 / 308 | `--surround-shane` | the calibration wheel's broad band, `Pacifier.svelte:758`. |

Three pairs are close enough to name:

- **Marked score's desk and the calibration wheel's band:** `#D2CBD7` and `#D8D0E0`, ΔE 0.018, under one just-noticeable difference. `app.css:122` to `:127` records that they are kept apart because they are different surfaces: the band sits on white and the desk does not.
- **The band and the header's version badge:** `#806E8E` and `#74677F`, ΔE 0.035. The comment at `HeaderBar.svelte:160` to `:163` calls the badge a deeper shade of `--deeper-lavender`, hand-picked the way the Learn and Guide badges were, and "not a token that exists yet".
- **The hue and its band:** `#8E7E9B` and `#806E8E`, ΔE 0.051.

### 5.2 The same for sage

**Twelve distinct values in the sage family. Ten paint;** `#A8B5A0` and the fallback `#8A9B7E` do not. One painting literal, `#6B7B5E`, is ΔE 0.004 from a token and cannot be told from it.

| value | OKLCH L / C / H | name | what it is for, from its use sites |
|---|---|---|---|
| `#6C7A5F` | 0.560 / 0.044 / 130 | `--lang-chip-transcription` | the Input band (`Drawer.svelte:1188`) and Transcription's language pill (`HeaderBar.svelte:211`). |
| `#6B7B5E` | 0.561 / 0.047 / 131 | literal | the word inspector's **Dictionary** button while its panel is open, `InspectorPanel.svelte:1531`. ΔE 0.004 from `#6C7A5F`. |
| `#7A8A6C` | 0.612 / 0.048 / 131 | `--deeper-sage` | hover fills of sage controls (`InspectorPanel.svelte:1522`, `:2185`), the poem field's focus border (`IntakePanel.svelte:1060`), the version badge in the header sigil on Transcription (`HeaderBar.svelte:149`), the install button's hover (`InstallPrompt.svelte:205`), and **the gloss line under every word on the page** (`WordStack.svelte:275`). |
| `#8B9A7D` | 0.666 / 0.045 / 130 | `--sage` | Transcription's hue, 85 token uses plus 14 `rgba()` tints and 4 `color-mix()` tints: the header bar on Transcription (`HeaderBar.svelte:74`), every keyboard focus ring (`app.css:216`), the word inspector's panels, carets, and stress circles, the Notation switches when on (`NotationFields.svelte:321`), the default accent of the title block, footer, and station header, and the wheel's floor polygon (`Pacifier.svelte:768`). Also the browser's theme colour as a literal, `app.html:9`. |
| `#8A9B7E` | 0.668 / 0.046 / 132 | fallback only | the fallback in `var(--sage, #8a9b7e)` at `+page.svelte:5813`. ΔE 0.003 from `--sage`, and it never paints while `--sage` is declared. |
| `#8BA48B` | 0.692 / 0.046 / 145 | literal | the cursive letter samples in Learn's glyph table, text and underline, `+page.svelte:5089` and `:5142`. The greenest sage, 15° off the family. |
| `#A8B5A0` | 0.757 / 0.033 / 133 | `--light-sage` | **no use anywhere.** |
| `#D1D7CB` | 0.871 / 0.017 / 129 | `--surround-transcription` | Transcription's desk, `+page.svelte:5344`. |
| `#EBEEE8` | 0.945 / 0.009 / 129 | literal | the fill behind the cursive samples in Learn's glyph table, `+page.svelte:5141`. |
| `#F0F3EE` | 0.960 / 0.007 / 132 | literal | the fill of a dictionary entry cell in the word inspector, `InspectorPanel.svelte:1630`. |
| `#F5F7F3` | 0.974 / 0.006 / 129 | literal | the header cells of Learn's glyph table, `+page.svelte:5054`. |
| `#FCFDFC` | 0.993 / 0.002 / – | literal | the even rows of Learn's glyph table, `+page.svelte:5094`. At chroma 0.002 it reads as white. |

### 5.3 The ghosts

**Read but never declared: eleven names.** Each was searched as a declaration, a `setProperty` call, and a `style:--` directive, with a positive control (§2).

| name | references | fallbacks written | what paints |
|---|---|---|---|
| `--stone-600` | 7: `IntakePanel.svelte:1173`, `RootPanel.svelte:230`, `SongList.svelte:274`, `:300`, `:325`, `+page.svelte:4974`, `:5016` | `#57534E` every time | the fallback |
| `--stone-200` | 4: `InspectorPanel.svelte:1874`, `:1895`, `:2117`, `ReadingPaper.svelte:445` | `#E7E5E4` every time | the fallback |
| `--stone-400` | 4: `InspectorPanel.svelte:1454`, `:1794`, `:2128`, `:2402` | `#A8A29E` every time | the fallback |
| `--border-light` | 2: `GuideContent.svelte:569`, `:586` | `#DDD9D4` | the fallback |
| `--border` | 1: `InstallPrompt.svelte:218` | `#D4CEC8` | the fallback |
| `--fit-accent` | 1: `TextualWitnesses.svelte:177` | `#8E7E9B` | the fallback |
| `--surface-subtle` | 2 | **two different values:** `#EDE8E0` at `InstallPrompt.svelte:224`, `#F9F7F5` at `GuideContent.svelte:585` | the fallback |
| `--paper` | 3 | **three behaviours:** `#F5F0E8` at `InstallPrompt.svelte:152`, `#FAF7F2` at `+page.svelte:5794`, none at `ScoreUploader.svelte:1152` | the fallback twice; nothing once |
| `--ink` | 7, two of them nested inside `--ink-soft`'s fallback | `#1A1612` at `InstallPrompt.svelte:172`; none at `ScoreUploader.svelte:1120`, `:1127`, `:1139`, `:1151`, `:1162`, `:1166` | the fallback once; nothing six times |
| `--ink-soft` | 2: `ScoreUploader.svelte:1127`, `:1162` | `var(--ink)`, itself undeclared | nothing |
| `--rule` | 2: `ScoreUploader.svelte:1110`, `:1153` | none | nothing |

**The score upload's two questions and the read report** (`ScoreUploader.svelte:1104` to `:1167`) are where the ghosts bite. Nine declarations there read `--ink`, `--ink-soft`, `--paper`, or `--rule` with no working fallback. Under CSS's rule for an undefined custom property, "invalid at computed-value time" (CSS Custom Properties Level 1, from memory, not read this session), each of those declarations falls back to `unset`: the text inherits its parent's colour, and the card's border and the select's fill and border take their initial values. **What the singer sees there was not observed.**

**Declared but never read: nine names.**

| name | declared at | note |
|---|---|---|
| `--color-text`, `--color-text-muted`, `--color-accent`, `--color-paper`, `--color-bg` | `app.css:179` to `:184` | filed under "Backward-compatible aliases" (`app.css:176`). The sixth alias, `--color-border`, has one reader: `ReadingAid.svelte:159`. |
| `--terracotta` | `app.css:39` | "backward-compatible alias" of `--dusty-rose` |
| `--light-sage` | `app.css:34` | no reader |
| `--light-lavender` | `app.css:170` | no reader in a stylesheet; `contrast.ts:127` copies its value, and R20 (`contrast.test.ts:233`) requires that `app.css` still declares it |
| `--station-accent` | set on the element at `StationHeader.svelte:133` | no reader; `:155` mentions it in a comment |

**Tokens with exactly one reader:** `--muted-lavender`, `--surround-shane`, `--color-border`, `--app-bg` (read by `body`, `app.css:207`), and each of the five `--surround-*` tokens, which are read once to set `--desk-fill`.

### 5.4 Literals that duplicate a token

**48 distinct literal values paint**, 44 of them written bare and 4 only as `rgba()` bases. For each: whether a token holds that exact value, and the nearest other token. For a neutral literal (chroma under 0.02) the nearest is chosen from neutral tokens only.

| literal | OKLCH L | bare paints | rgba uses | token that holds this exact value | nearest other token (ΔE, ΔL) | sites |
|---|---|---|---|---|---|---|
| `#FFFFFF` | 1.000 | 62 | 2 | none | `--drawer-bg` #FAF8F5 (0.021, −0.020) | `app.css:256`, `app.css:289`, `lib/components/Drawer/Drawer.svelte:1136`, `lib/components/Drawer/Drawer.svelte:1233`, `lib/components/Drawer/Drawer.svelte:1311`, `lib/components/Drawer/Drawer.svelte:1556`, and 52 more in the full table |
| `#1A1612` | 0.203 | 36 | 8 | `--ink-primary` | `--stone-700` #44403C (0.171, +0.171) | `lib/components/DeskHead.svelte:218`, `lib/components/Drawer/Drawer.svelte:1398`, `lib/components/Drawer/Drawer.svelte:1703`, `lib/components/Drawer/InspectorPanel.svelte:2030`, `lib/components/Drawer/InspectorPanel.svelte:2257`, `lib/components/Drawer/IntakePanel.svelte:731`, and 38 more in the full table |
| `#3A352F` | 0.332 | 38 | 0 | none | `--stone-700` #44403C (0.042, +0.042) | `lib/shane/NotePicker.svelte:203`, `lib/shane/NotePicker.svelte:209`, `lib/shane/NotePicker.svelte:213`, `lib/shane/NotePicker.svelte:222`, `lib/shane/NotePicker.svelte:225`, `lib/shane/NotePicker.svelte:226`, and 31 more in the full table |
| `#8E7E9B` | 0.618 | 18 | 0 | `--deeper-lavender` | `--lang-chip-marked` #806E8E (0.051, −0.051) | `lib/components/Drawer/IntakePanel.svelte:836`, `lib/shane/SyllableStation.svelte:245`, `lib/shane/SyllableStation.svelte:257`, `lib/shane/VoiceProfilePane.svelte:1137`, `lib/shane/VoiceProfilePane.svelte:1138`, `lib/shane/VoiceProfilePane.svelte:1139`, and 12 more in the full table |
| `#8B9A7D` | 0.666 | 1 | 14 | `--sage` | `--deeper-sage` #7A8A6C (0.054, −0.054) | `app.html:9`, `lib/components/Drawer/InspectorPanel.svelte:1730`, `lib/components/Drawer/InspectorPanel.svelte:1802`, `lib/components/Drawer/InspectorPanel.svelte:1956`, `lib/components/Drawer/InspectorPanel.svelte:1989`, `lib/components/Drawer/InspectorPanel.svelte:2192`, and 9 more in the full table |
| `#000000` | 0.000 | 0 | 12 | none | `--ink-primary` #1A1612 (0.204, +0.203) | `lib/components/Drawer/NotationFields.svelte:333`, `lib/components/Drawer/SearchableSelect.svelte:329`, `lib/components/Drawer/SongList.svelte:250`, `lib/components/Drawer/SongList.svelte:263`, `lib/components/InstallPrompt.svelte:155`, `lib/components/Paper/ReadingPaper.svelte:49`, and 6 more in the full table |
| `#A67B7B` | 0.625 | 3 | 4 | `--dusty-rose` | `--lang-chip-learn` #9A6A6A (0.052, −0.051) | `lib/components/Drawer/Drawer.svelte:1818`, `lib/components/Drawer/Drawer.svelte:1819`, `lib/components/Drawer/Drawer.svelte:1835`, `lib/shane/InsightsPane.svelte:276`, `lib/shane/InsightsPane.svelte:277`, `lib/shane/InsightsPane.svelte:278`, and 1 more in the full table |
| `#78716C` | 0.553 | 6 | 0 | `--stone-500` | `--ink-tertiary` #6A655F (0.044, −0.044) | `lib/components/Paper/PageFooter.svelte:140`, `lib/components/Paper/PageFooter.svelte:238`, `lib/components/Paper/WordStack.svelte:242`, `lib/components/Paper/WordStack.svelte:315`, `lib/components/Paper/WordStack.svelte:368`, `lib/shane/InsightsPane.svelte:677` |
| `#2E2A26` | 0.288 | 0 | 5 | none | `--ink-primary` #1A1612 (0.084, −0.084) | `lib/shane/CorrectionSurface.svelte:870`, `lib/shane/CorrectionSurface.svelte:879`, `lib/shane/Loupe.svelte:956`, `lib/shane/Loupe.svelte:957`, `lib/shane/Loupe.svelte:958` |
| `#D97706` | 0.666 | 3 | 1 | none | `--prep-amber` #BC7E08 (0.052, −0.025) | `lib/components/Drawer/IntakePanel.svelte:686`, `lib/components/Drawer/IntakePanel.svelte:1104`, `lib/components/Drawer/IntakePanel.svelte:1110`, `lib/shane/ScoreUploader.svelte:1049` |
| `#5C739E` | 0.555 | 0 | 3 | `--quiet-cobalt` | `--lang-chip-marked` #806E8E (0.055, +0.012) | `lib/components/Drawer/Drawer.svelte:1941`, `lib/components/Drawer/Drawer.svelte:1942`, `lib/components/Drawer/Drawer.svelte:1947` |
| `#FAF8F4` | 0.980 | 3 | 0 | none | `--drawer-bg` #FAF8F5 (0.001, +0.000) | `lib/components/Drawer/InspectorPanel.svelte:1939`, `lib/components/Drawer/InspectorPanel.svelte:1988`, `lib/components/Drawer/InspectorPanel.svelte:2350` |
| `#3C3A36` | 0.349 | 3 | 0 | none | `--stone-700` #44403C (0.025, +0.025) | `lib/components/Reading/LearnContent.svelte:4095`, `routes/+page.svelte:5055`, `routes/+page.svelte:5064` |
| `#C8C8C3` | 0.831 | 3 | 0 | none | `--surround-learn` #DBCACA (0.030, +0.022) | `routes/+page.svelte:5056`, `routes/+page.svelte:5093`, `routes/+page.svelte:5098` |
| `#8F6A6A` | 0.562 | 2 | 0 | none | `--lang-chip-learn` #9A6A6A (0.019, +0.013) | `lib/components/HeaderBar.svelte:153`, `lib/components/HeaderBar.svelte:169` |
| `#FDFBF6` | 0.988 | 2 | 0 | none | `--drawer-bg` #FAF8F5 (0.009, −0.008) | `lib/components/Paper/ReadingPaper.svelte:129`, `lib/components/Paper/ReadingPaper.svelte:202` |
| `#8A8780` | 0.624 | 2 | 0 | none | `--stone-500` #78716C (0.071, −0.070) | `lib/components/Reading/LearnContent.svelte:4078`, `routes/+page.svelte:5083` |
| `#F0D8D8` | 0.902 | 2 | 0 | none | `--stone-300` #D6D3D1 (0.041, −0.033) | `lib/components/Reading/LearnContent.svelte:4087`, `routes/+page.svelte:5158` |
| `#C28888` | 0.684 | 2 | 0 | none | `--dusty-rose` #A67B7B (0.062, −0.059) | `lib/components/Reading/LearnContent.svelte:4088`, `routes/+page.svelte:5159` |
| `#FF0000` | 0.628 | 2 | 0 | none | `--signal-red` #A32D2D (0.181, −0.148) | `lib/i18n.ts:703`, `lib/i18n.ts:704` |
| `#7C6BB0` | 0.573 | 1 | 1 | none | `--lang-chip-marked` #806E8E (0.057, −0.006) | `lib/shane/ScoreUploader.svelte:996`, `lib/shane/ScoreUploader.svelte:997` |
| `#6A655F` | 0.509 | 2 | 0 | `--ink-tertiary` | `--stone-500` #78716C (0.044, +0.044) | `lib/shane/SyllableStation.svelte:203`, `packages/score-parser/src/staff-renderer.ts:2702` |
| `#8BA48B` | 0.692 | 2 | 0 | none | `--sage` #8B9A7D (0.029, −0.026) | `routes/+page.svelte:5089`, `routes/+page.svelte:5142` |
| `#A0A09B` | 0.704 | 2 | 0 | none | `--surround-marked` #D2CBD7 (0.149, +0.147) | `routes/+page.svelte:5168`, `routes/+page.svelte:5172` |
| `#4A4540` | 0.394 | 2 | 0 | `--ink-secondary` | `--stone-700` #44403C (0.020, −0.020) | `routes/fit-font-lab/+page.svelte:116`, `routes/fit-font-lab/+page.svelte:123` |
| `#B23B3B` | 0.524 | 2 | 0 | none | `--signal-red` #A32D2D (0.044, −0.044) | `routes/fit-font-lab/+page.svelte:127`, `packages/score-parser/src/staff-renderer.ts:2513` |
| `#DDD9D4` | 0.887 | 2 | 0 | none | `--stone-300` #D6D3D1 (0.019, −0.018) | `routes/fit-font-lab/+page.svelte:138`, `routes/fit-font-lab/+page.svelte:174` |
| `#F9F7F5` | 0.977 | 2 | 0 | none | `--drawer-bg` #FAF8F5 (0.003, +0.003) | `routes/fit-font-lab/+page.svelte:139`, `routes/fit-font-lab/+page.svelte:149` |
| `#6B7B5E` | 0.561 | 1 | 0 | none | `--lang-chip-transcription` #6C7A5F (0.004, −0.001) | `lib/components/Drawer/InspectorPanel.svelte:1531` |
| `#F0F3EE` | 0.960 | 1 | 0 | none | `--paper-light` #F5F1E8 (0.009, −0.002) | `lib/components/Drawer/InspectorPanel.svelte:1630` |
| `#FDF6E8` | 0.975 | 1 | 0 | none | `--drawer-bg` #FAF8F5 (0.016, +0.005) | `lib/components/Drawer/InspectorPanel.svelte:1950` |
| `#FAF7F2` | 0.977 | 1 | 0 | none | `--drawer-bg` #FAF8F5 (0.004, +0.003) | `lib/components/Drawer/InspectorPanel.svelte:1954` |
| `#F5F0E8` | 0.957 | 1 | 0 | none | `--paper-light` #F5F1E8 (0.003, +0.002) | `lib/components/Drawer/InspectorPanel.svelte:2250` |
| `#4D6387` | 0.497 | 1 | 0 | none | `--quiet-cobalt` #5C739E (0.059, +0.058) | `lib/components/HeaderBar.svelte:157` |
| `#74677F` | 0.535 | 1 | 0 | none | `--lang-chip-marked` #806E8E (0.035, +0.032) | `lib/components/HeaderBar.svelte:165` |
| `#44403C` | 0.374 | 1 | 0 | `--stone-700` | `--ink-secondary` #4A4540 (0.020, +0.020) | `lib/components/Paper/WordStack.svelte:323` |
| `#8A5C5C` | 0.524 | 1 | 0 | none | `--lang-chip-learn` #9A6A6A (0.050, +0.050) | `lib/shane/InsightsPane.svelte:505` |
| `#B45309` | 0.555 | 1 | 0 | none | `--signal-red` #A32D2D (0.098, −0.075) | `lib/shane/ScoreUploader.svelte:1054` |
| `#7F1D1D` | 0.396 | 1 | 0 | none | `--signal-red` #A32D2D (0.087, +0.085) | `routes/+page.svelte:5024` |
| `#F5F7F3` | 0.974 | 1 | 0 | none | `--drawer-bg` #FAF8F5 (0.008, +0.006) | `routes/+page.svelte:5054` |
| `#FCFDFC` | 0.993 | 1 | 0 | none | `--drawer-bg` #FAF8F5 (0.014, −0.013) | `routes/+page.svelte:5094` |
| `#AAA8A0` | 0.731 | 1 | 0 | none | `--surround-marked` #D2CBD7 (0.124, +0.120) | `routes/+page.svelte:5116` |
| `#EBEEE8` | 0.945 | 1 | 0 | none | `--paper-cream` #F0EBE0 (0.012, −0.004) | `routes/+page.svelte:5141` |
| `#F8F6F0` | 0.973 | 1 | 0 | none | `--drawer-bg` #FAF8F5 (0.008, +0.007) | `routes/+page.svelte:5162` |
| `#96918A` | 0.659 | 1 | 0 | none | `--stone-500` #78716C (0.106, −0.105) | `routes/+page.svelte:5164` |
| `#282623` | 0.270 | 0 | 1 | none | `--ink-primary` #1A1612 (0.066, −0.066) | `routes/+page.svelte:5797` |
| `#8A6D3B` | 0.552 | 1 | 0 | none | `--lang-chip-transcription` #6C7A5F (0.060, +0.008) | `routes/fit-font-lab/+page.svelte:169` |
| `#F0EBE0` | 0.941 | 1 | 0 | `--paper-cream` | `--paper-light` #F5F1E8 (0.018, +0.018) | `packages/score-parser/src/staff-renderer.ts:2828` |

Read against the question the brief asked:

- **Exactly a token's value: ten.** Written bare: `#1A1612`, `#8E7E9B`, `#8B9A7D`, `#A67B7B`, `#78716C`, `#6A655F`, `#44403C`, `#F0EBE0`, and `#4A4540` (the last only in the font lab developer route). Written only as an `rgba()` base: `#5C739E`. `#1A1612`, `#8B9A7D`, and `#A67B7B` also appear as `rgba()` bases.
- **Within ΔE 0.01 of a token, so the same colour to the eye: nine.** `#FAF8F4` (0.001 from `--drawer-bg`), `#F5F0E8` (0.003 from `--paper-light`), `#F9F7F5` (0.003), `#FAF7F2` (0.004), `#6B7B5E` (0.004 from `--lang-chip-transcription`), `#F5F7F3` (0.008), `#F8F6F0` (0.008), `#FDFBF6` (0.009 from `--drawer-bg`), and `#F0F3EE` (0.009 from `--paper-light`).
- **Why some literals are literals, where the tree says:** `staff-renderer.ts:615` and `:616` say the renderer is "pure and DOM-free", so it bakes `#8E7E9B` as hex, "keep in sync with the app token". No comment in the renderer gives a reason for `#3A352F`: a grep for the value with two lines either side, and for "staff" near "colour", found none. `contrast.ts:125` to `:138` copies eleven token values and white on purpose, and R20 checks the copies.

**Fallbacks that disagree with their own token.** None of these paints while the token is declared. Each is the value that would appear if the token went.

| path:line | token and its value | fallback written | ΔE |
|---|---|---|---|
| `lib/components/Drawer/Drawer.svelte:1919` | `--ink-tertiary` #6A655F | #8A8780 | 0.114 |
| `lib/components/Drawer/InspectorPanel.svelte:1580` | `--paper-cream` #F0EBE0 | #FDFBF7 | 0.049 |
| `lib/components/InstallPrompt.svelte:179` | `--ink-secondary` #4A4540 | #5A5248 | 0.050 |
| `lib/components/InstallPrompt.svelte:216` | `--ink-secondary` #4A4540 | #5A5248 | 0.050 |
| `routes/+page.svelte:4976` | `--paper-cream` #F0EBE0 | #F5F0E6 | 0.015 |
| `routes/+page.svelte:5813` | `--sage` #8B9A7D | #8A9B7E | 0.003 |

---

## 6. The three §3 questions

### 6.1 Is the warm/cool split doing work?

**By the numbers, there is no warm/cool split among the inks and stones.** The six sit in one hue band:

| token | L | C | H |
|---|---|---|---|
| `--ink-primary` `#1A1612` | 0.203 | 0.010 | 67 |
| `--stone-700` `#44403C` | 0.374 | 0.009 | 68 |
| `--ink-secondary` `#4A4540` | 0.394 | 0.011 | 68 |
| `--ink-tertiary` `#6A655F` | 0.509 | 0.011 | 73 |
| `--stone-500` `#78716C` | 0.553 | 0.012 | 58 |
| `--stone-300` `#D6D3D1` | 0.869 | 0.004 | 56 |

`--stone-700` and `--ink-secondary` have **the same hue to the degree**, chroma 0.009 against 0.011, and lightness 0.020 apart. **ΔE 0.020, which is one just-noticeable difference.** Hue angles inside the band differ by up to 17°, but at chroma near 0.01 an angle moves the colour very little: `--stone-500` and `--ink-tertiary` are 15° apart and ΔE 0.044, and all of that 0.044 is lightness. The largest hue gap between two neutrals of matching lightness is `--stone-300` (56°, chroma 0.004, nearly grey) against `--desk-surface` (92°, chroma 0.017): 0.001 apart in lightness, ΔE 0.014.

**Where `--stone-700` and `--ink-secondary` stand near each other.** `#44403C` is written in three places, and two of them sit beside `--ink-secondary`:

1. **On the page, above a word's IPA.** The provenance icons at a word's top right turn `#44403C` when the word is hovered (`WordStack.svelte:321` to `:324`). At rest they are `#78716C` at 40 % opacity (`:315`, `:316`). The IPA row directly under them is `--ink-secondary` (`:259`), and it reserves 14 px of right padding for the icons (`:303`, `:304`). So the two colours are adjacent only while the pointer is on the word, and then 0.020 apart in lightness: a 16 px ringed icon beside 1 rem text.
2. **In the word inspector, under a letter's IPA.** The ё inside the ё/е sigla is `--stone-700` (`InspectorPanel.svelte:1867`), at 9 px bold. The IPA above it in the same atom is `--ink-secondary` (`:2100`). The sigla is drawn at 25 % opacity at rest (`:1822`), 60 % when toggled (`:1858`), and full only on hover (`:1828`). At 25 % opacity the ё's rendered colour moves much further than 0.020 toward its ground.
3. **The loupe's frame** (`Loupe.svelte:931`). Nothing in `Loupe.svelte` uses `--ink-secondary`. The frame's neighbours are the loupe's own labels in `--ink-tertiary` (`:989`, `:1010`).

**Whether the difference is visible in any of the three was not observed.** At the default threshold the pair sits exactly on the line.

**Where the stone family sits against itself.** The drawer's ghost buttons draw their label in `--stone-500` (L 0.553) and their border in `#57534E` through the undeclared `--stone-600` (L 0.444): `RootPanel.svelte:227` and `:230`, `IntakePanel.svelte:1170` and `:1173`, `SongList.svelte:323` and `:325`. The border is darker than its own label, ΔL 0.109.

### 6.2 Are the four surfaces four things?

| token | L | what its use sites say it is for |
|---|---|---|
| `--drawer-bg` `#FAF8F5` | 0.980 | **the drawer's cards.** Every band's card (`Drawer.svelte:1104`), the calibration takeover's card (`:1530`), the phone's pull (`:1701`), the correction stations' dock (`CorrectionSurface.svelte:841`), and four things inside the takeover: the voice switcher's panel and its hovered header (`ProfileSwitcher.svelte:404`, `:384`), and the calibration banner and toast (`CalibrationWizard.svelte:2012`, `:2060`). |
| `--paper-light` `#F5F1E8` | 0.959 | **paper that is not the page.** The intake frame inside the Input card (`IntakePanel.svelte:733`), the reading aid beside the page (`ReadingAid.svelte:95`), the correction stations' cells (`CorrectionSurface.svelte:1028`), and the loupe (`Loupe.svelte:935`). |
| `--paper-cream` `#F0EBE0` | 0.941 | **the page.** Page one, later pages, the Learn and Guide sheet, the Insights page, and the Marked score page (`TitlePage.svelte:186`, `SubsequentPage.svelte:104`, `ReadingPaper.svelte:47`, `InsightsPane.svelte:460`, `VoiceProfilePane.svelte:1335`), plus the panels on those pages. **Also** eleven uses that are not the page: six in the word inspector, one rule for the score upload's question card and read report, the desk head's lit document, the replace dialog, and light text on two dark buttons (`ReadingAid.svelte:108`, `+page.svelte:5680`). |
| `--desk-surface` `#D8D4C8` | 0.870 | **the ground under the desk, painted on no tab.** It reaches the screen through `body` (`app.css:207` by way of `--app-bg`, `app.css:54`) and as the default of `--desk-fill` (`+page.svelte:5193`). Every one of the five tab identifiers in `destinations.ts:46` has its own desk rule that replaces that default (`+page.svelte:5343` to `:5371`). Where `body` shows through was not established. |

Lightness steps between them: `--drawer-bg` to `--paper-light` ΔE 0.023, `--paper-light` to `--paper-cream` ΔE 0.018, and `--drawer-bg` to `--paper-cream` ΔE 0.040. **The step from the page to the reading aid is under one just-noticeable difference.** The comment at `ReadingAid.svelte:3` to `:8` records Dann's rulings 4 and 5 of 2026-08-18, 26 days old and not checked this session for amendments. As recorded there, ruling 5 is "no shadow, no page edges, no header block, no colophon, and nothing on it prints". It does not name the fill.

**The same job done by different surfaces in different files.**

- **A card inside a drawer card: four fills.** `--paper-light` for the intake frame (`IntakePanel.svelte:733`) and the correction cells (`CorrectionSurface.svelte:1028`). `--paper-cream` for the score upload's question card and read report (`ScoreUploader.svelte:1112`), the dictionary panel (`InspectorPanel.svelte:1580`), and the inspector's word, letters, and choices (`:1457`, `:1929`, `:2336`, `:2404`). The literal `#F5F0E8` for the blurb box (`:2250`), ΔE 0.003 from `--paper-light`. The literal `#F0F3EE` for a dictionary entry cell (`:1630`).
- **A panel or banner that floats over another surface: five fills.** `--drawer-bg` for the voice switcher's panel. `#FAF7F2`, through the undeclared `--paper`, for the update toast (`+page.svelte:5794`), ΔE 0.004 from `--drawer-bg`. `#F5F0E8`, through the same undeclared `--paper`, for the install banner (`InstallPrompt.svelte:152`). `--paper-cream` for the replace dialog (`+page.svelte:4976`). `--paper-light` for the loupe.
- **A hovered or selected cell in the word inspector: three near-whites.** `#FAF8F4` on hover and drag (`InspectorPanel.svelte:1939`, `:1988`, `:2350`), `#FAF7F2` when selected (`:1954`), and `#FDF6E8` for a stressed vowel (`:1950`), all within ΔE 0.016 of `--drawer-bg`.

**Print.** `@media print` sets `--paper-cream` to `#FFFFFF` (`app.css:238`) and forces every `.paper-page` to white (`app.css:289`, and again in `TitlePage.svelte:246`, `SubsequentPage.svelte:139`, `InsightsPane.svelte:725`, `VoiceProfilePane.svelte:1610`). Ten of the eleven non-page `--paper-cream` uses are hidden in print: the drawer's seven (`app.css:312`), the desk head (`DeskHead.svelte:255` to `:258`), the reading aid (`ReadingAid.svelte:176` to `:180`), and the portrait action (`+page.svelte:5704` to `:5707`). The replace dialog has no print rule; whether it can print was not checked. **One literal does not follow the inversion:** the score renderer paints `#F0EBE0` behind every system (`staff-renderer.ts:2828`), and `page-layout.ts:376` embeds each system's markup, rectangle included, into the Marked score page. `VoiceProfilePane.svelte:665` strips only the page's white backing rectangle. Whether a cream rectangle prints behind each system was not observed.

### 6.3 What would break if a token went

One use per token: the one hardest to give another token, and why, in one clause. **Four of the ten, `--paper-cream` and the three inks, are also copied into `contrast.ts:130` to `:133`,** so removing or changing one fails R20 (`contrast.test.ts:233`) until the copy moves too.

| token | the hardest use | why |
|---|---|---|
| `--ink-primary` | the Cyrillic line of every word on the page, `WordStack.svelte:267` | it is the darkest ink Ilya draws, and the nearest neutral, `#3A352F`, is ΔL +0.129 lighter; the score's notes and lyrics repeat the value as 27 literals in `staff-renderer.ts`, and `staff-renderer.test.ts` writes it 8 times |
| `--ink-secondary` | the IPA line of every word on the page, `WordStack.svelte:259` | the IPA is what a singer comes for, and the nearest neutral is `--stone-700`, ΔE 0.020 away |
| `--ink-tertiary` | the ≈ badge on an estimated vowel, `Pacifier.svelte:680` | its comment records 5.77:1 on the white badge (`:674`); the nearest neutral, `--stone-500`, is ΔL +0.044 lighter, so that figure would fall. The IPA under the score repeats the value as a literal, `staff-renderer.ts:2702` |
| `--stone-300` | the track of an off switch in Notation, `NotationFields.svelte:313` | of its 29 uses, 26 are borders and hairlines; this is one of three fills, and the only one that tells a singer a switch is off, under its white thumb (`:331`). The other two are empty progress tracks (`AnalysisStation.svelte:182`, `CalibrationWizard.svelte:1776`) |
| `--stone-500` | the resting ring of the ё/е sigla, `InspectorPanel.svelte:1817` | drawn at 25 % opacity (`:1822`), the ring is the whole signal that the letter can change, and the nearest neutral, `--ink-tertiary`, is ΔL −0.044 darker |
| `--stone-700` | the loupe's 1.4 px frame, `Loupe.svelte:931` | it is the loupe's only drawn edge against the page it floats over, and the fills on either side are ΔE 0.018 apart (`:935` against the page) |
| `--drawer-bg` | the card of every band, `Drawer.svelte:1104` | every drawer tenant's colours sit on it, and the intake frame inside it is only ΔE 0.023 darker, so the frame's separation from the card is set by this one value |
| `--paper-light` | the reading aid, `ReadingAid.svelte:95` | apart from the page dress that ruling 5 removes (`:3` to `:8`), this fill is the one visual difference between the aid and the page, and it is ΔE 0.018 |
| `--paper-cream` | the page itself, the five `.paper-page` rules in §6.2 | the print inversion keys on this one name (`app.css:238`), and the renderer's system rectangle carries the value as a literal (`staff-renderer.ts:2828`) |
| `--desk-surface` | `body`'s ground through `--app-bg`, `app.css:207` | it is the only paint under the whole app outside `.app-content`, and no tab's desk shows it (§6.2), so where a change to it would appear is NOT ESTABLISHED |

The two literals:

| literal | the hardest use | why |
|---|---|---|
| `#3A352F` | the five staff lines, `staff-renderer.ts:1670` | it colours the stave's furniture (lines, clefs, key signatures, barlines, rests, ledger lines, multi-bar rest numerals) and `#1A1612` colours what is sung (noteheads, stems, beams, accidentals, ties, lyrics); the split is consistent across all 29 renderer sites and the note picker's mini staff, and `staff-renderer.test.ts` writes the literal 5 times |
| `#57534E` | the border of the replace dialog, `+page.svelte:4974` | it is the only one of the seven that frames a whole dialog rather than a button or a field, on a `--paper-cream` ground |

---

## 7. The full table, one row per use site

**822 rows**, grouped by the token or literal that supplies the colour. A line that paints the same colour to the same property more than once is one row, marked "×n". Paths drop the leading `apps/web/src/`. "Not a paint" rows are kept so the counts reconcile; there are 30. `@media print` rows are marked PRINT; there are 7.

**The one departure from the brief's column list:** the token column is the group heading rather than a repeated cell. DESK DEFAULT, because 822 repetitions of the heading add width and no information.

### 7.1 The twelve neutrals of §1a

#### `--ink-primary` · #1A1612, OKLCH L/C/H 0.203 / 0.010 / 67 · 76 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `app.css:179` | declares --color-text (global stylesheet) | `--color-text` | NOT ESTABLISHED | #3A352F (ΔL +0.129) |  |
| `app.css:206` | text of body (global stylesheet) | `color` | NOT ESTABLISHED | #3A352F (ΔL +0.129) |  |
| `lib/components/DeskHead.svelte:176` | border of pair (desk head, the document switch above the page) | `border` | .desk-head: inherit | #3A352F (ΔL +0.129) |  |
| `lib/components/DeskHead.svelte:191` | text of pair member (desk head, the document switch above the page) | `color` | own rule: var(--paper-cream, #F0EBE0) (in a state variant: .pair-member.active) | #3A352F (ΔL +0.129) |  |
| `lib/components/DeskHead.svelte:203` | left border of pair member + pair member (desk head, the document switch above the page) | `border-left` | own rule: var(--paper-cream, #F0EBE0) (in a state variant: .pair-member.active) | #3A352F (ΔL +0.129) |  |
| `lib/components/DeskHead.svelte:213` | border of pair single pair member active (desk head, the document switch above the page) | `border` | own rule: var(--paper-cream, #F0EBE0) (in a state variant: .pair-member.active) | #3A352F (ΔL +0.129) |  |
| `lib/components/DeskHead.svelte:231` | bottom border of link (desk head, the document switch above the page) | `border-bottom` | .desk-head: inherit | #3A352F (ΔL +0.129) |  |
| `lib/components/DeskHead.svelte:233` | text of link (desk head, the document switch above the page) | `color` | .desk-head: inherit | #3A352F (ΔL +0.129) |  |
| `lib/components/DeskHead.svelte:250` | focus outline of pair member on keyboard focus (desk head, the document switch above the page) | `outline` | own rule: var(--paper-cream, #F0EBE0) (in a state variant: .pair-member.active) | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/Drawer.svelte:1343` | text of band state “from score” (drawer frame) | `color` | .drawer: var(--desk-fill, var(--desk-surface, #D8D4C8)) | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/Drawer.svelte:1711` | focus outline of drawer pull on keyboard focus (drawer frame) | `outline` | own rule: var(--drawer-bg, #FAF8F5) | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/Drawer.svelte:1820` | text of toc link on hover (drawer frame) | `color` | own rule: rgba(166, 123, 123, 0.08) (in a state variant: .toc-link.active) | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/Drawer.svelte:1834` | text of toc link active (drawer frame) | `color` | own rule: rgba(166, 123, 123, 0.08) (in a state variant: .toc-link.active) | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/Drawer.svelte:1842` | text of toc link active on hover (drawer frame) | `color` | own rule: rgba(166, 123, 123, 0.08) (in a state variant: .toc-link.active) | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/Drawer.svelte:1848` | text of toc link toc title (drawer frame) | `color` | own rule: rgba(166, 123, 123, 0.08) (in a state variant: .toc-link.active) | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1465` | text of word cyrillic (drawer, word inspector) | `color` | .word-stack: var(--paper-cream) | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1677` | text of dict lemma (drawer, word inspector) | `color` | .dict-entry-cell: #F0F3EE | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1708` | text of dict senses (drawer, word inspector) | `color` | .dict-entry-cell: #F0F3EE | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2037` | text of drag ghost char (drawer, word inspector) | `color` | .drag-ghost: var(--paper-cream) | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2087` | text of atom char (drawer, word inspector) | `color` | .atom: var(--paper-cream) | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2271` | text of blurb char (drawer, word inspector) | `color` | .blurb-box: #F5F0E8 | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2289` | text of blurb text “No phonological note for this character.” (drawer, word inspector) | `color` | .blurb-box: #F5F0E8 | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2351` | text of provenance choice on hover e.g. “Dictionary” (drawer, word inspector) | `color` | own rule: var(--paper-cream) | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/IntakePanel.svelte:792` | text of intake receipt line e.g. “%s lines”, “%s words” (drawer, Input band) | `color` | .intake: var(--paper-light) | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/IntakePanel.svelte:824` | text of receipt btn on hover e.g. “Clear”, “Replace” (drawer, Input band) | `color` | .intake: var(--paper-light) | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/IntakePanel.svelte:991` | text of caption link on hover (drawer, Input band) | `color` | .intake: var(--paper-light) | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/IntakePanel.svelte:1013` | text of text input “Paste, type, or drop your poem here.” (drawer, Input band) | `color` | .intake: var(--paper-light) | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/MetadataFields.svelte:208` | text of meta input e.g. “Aria or song title”, “from score” (drawer, Piece band fields) | `color` | own rule: white | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/NotationFields.svelte:288` | text of cosmetic label left e.g. “No stress marks” (drawer, Notation station) | `color` | Drawer.svelte .group: var(--drawer-bg) | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/SearchableSelect.svelte:271` | text of select trigger (drawer, composer and poet picker) | `color` | own rule: white | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/SearchableSelect.svelte:345` | text of select search “Type to filter…” (drawer, composer and poet picker) | `color` | .select-dropdown: white | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/SearchableSelect.svelte:385` | text of option primary (drawer, composer and poet picker) | `color` | .select-option: rgba(139, 154, 125, 0.1) (in a state variant: .select-option.highlighted) | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/SongList.svelte:242` | text of song open (drawer, song library) | `color` | own rule: rgb(0 0 0 / 0.03) | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/SongList.svelte:260` | text of is open song open (drawer, song library) | `color` | own rule: rgb(0 0 0 / 0.03) | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/SongList.svelte:272` | text of song name input (drawer, song library) | `color` | own rule: white | #3A352F (ΔL +0.129) |  |
| `lib/components/Drawer/StationHeader.svelte:165` | text of station label (drawer, station header) | `color` | Drawer.svelte .group: var(--drawer-bg) | #3A352F (ΔL +0.129) |  |
| `lib/components/Paper/PageFooter.svelte:210` | text of attribution text a on hover (page footer) | `color` | NOT ESTABLISHED | #3A352F (ΔL +0.129) |  |
| `lib/components/Paper/ReadingPaper.svelte:64` | text of reading inner h1 (Learn and Guide reading sheet) | `color` | NOT ESTABLISHED | #3A352F (ΔL +0.129) |  |
| `lib/components/Paper/ReadingPaper.svelte:73` | text of reading inner h2 (Learn and Guide reading sheet) | `color` | NOT ESTABLISHED | #3A352F (ΔL +0.129) |  |
| `lib/components/Paper/ReadingPaper.svelte:82` | text of reading inner h3 (Learn and Guide reading sheet) | `color` | NOT ESTABLISHED | #3A352F (ΔL +0.129) |  |
| `lib/components/Paper/ReadingPaper.svelte:95` | text of reading inner h4 (Learn and Guide reading sheet) | `color` | NOT ESTABLISHED | #3A352F (ΔL +0.129) |  |
| `lib/components/Paper/ReadingPaper.svelte:314` | text of reading inner p (Learn and Guide reading sheet) | `color` | NOT ESTABLISHED | #3A352F (ΔL +0.129) |  |
| `lib/components/Paper/ReadingPaper.svelte:363` | text of reading inner ul (Learn and Guide reading sheet) | `color` | NOT ESTABLISHED | #3A352F (ΔL +0.129) |  |
| `lib/components/Paper/ReadingPaper.svelte:384` | text of reading inner a on hover (Learn and Guide reading sheet) | `color` | NOT ESTABLISHED | #3A352F (ΔL +0.129) |  |
| `lib/components/Paper/ReadingPaper.svelte:423` | text of reading inner table (Learn and Guide reading sheet) | `color` | NOT ESTABLISHED | #3A352F (ΔL +0.129) |  |
| `lib/components/Paper/TitleHeader.svelte:150` | text of song title “Aria or song title” (title block on page one) | `color` | TitlePage.svelte .paper-page: var(--paper-cream) \| InsightsPane.svelte .paper-page: var(--paper-cream) \| VoiceProfilePane.svelte .paper-page: var(--paper-cream) | #3A352F (ΔL +0.129) |  |
| `lib/components/Paper/WordStack.svelte:267` | text of cyrillic row (a word on the page) | `color` | SubsequentPage.svelte .paper-page: var(--paper-cream) \| TitlePage.svelte .paper-page: var(--paper-cream) \| ReadingAid.svelte .reading-aid: var(--paper-light, #F5F1E8) | #3A352F (ΔL +0.129) |  |
| `lib/components/ReadingAid.svelte:107` | fill of aid return “The page” (reading aid beside the page) | `background` | .reading-aid: var(--paper-light, #F5F1E8) | #3A352F (ΔL +0.129) |  |
| `lib/components/ReadingAid.svelte:126` | focus outline of aid return on keyboard focus “The page” (reading aid beside the page) | `outline` | own rule: var(--ink-primary, #1a1612) | #3A352F (ΔL +0.129) |  |
| `lib/shane/CalibrationWizard.svelte:1850` | text of wizard roster vowel (calibration takeover) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | #3A352F (ΔL +0.129) |  |
| `lib/shane/CorrectionSurface.svelte:811` | text of surface (correction stations) | `color` | Drawer.svelte .group: var(--drawer-bg) | #3A352F (ΔL +0.129) |  |
| `lib/shane/CorrectionSurface.svelte:929` | text of readout (correction stations) | `color` | Drawer.svelte .group: var(--drawer-bg) | #3A352F (ΔL +0.129) |  |
| `lib/shane/CorrectionSurface.svelte:1029` | text of cell (correction stations) | `color` | own rule: var(--paper-light, #f5f1e8) | #3A352F (ΔL +0.129) |  |
| `lib/shane/CorrectionSurface.svelte:1167` | text of nolet number (correction stations) | `color` | Drawer.svelte .group: var(--drawer-bg) | #3A352F (ΔL +0.129) |  |
| `lib/shane/InsightsPane.svelte:514` | text of prose e.g. “No voice has been measured, so this page…”, “Any reading of your range, your tessitur…” (Insights page) | `color` | .squircle: var(--paper-cream) | #3A352F (ΔL +0.129) |  |
| `lib/shane/InsightsPane.svelte:559` | text of fit row term e.g. “Range containment”, “Compass {low} to {high}” (Insights page) | `color` | .squircle: var(--paper-cream) | #3A352F (ΔL +0.129) |  |
| `lib/shane/InsightsPane.svelte:591` | text of verdict (Insights page) | `color` | .squircle: var(--paper-cream) | #3A352F (ΔL +0.129) |  |
| `lib/shane/InsightsPane.svelte:622` | text of finding body (Insights page) | `color` | +page.svelte .app-content: var(--desk-fill) | #3A352F (ΔL +0.129) |  |
| `lib/shane/NotePicker.svelte:302` | text of np legend (note picker) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | #3A352F (ΔL +0.129) |  |
| `lib/shane/NotePicker.svelte:318` | text of np select (note picker) | `color` | own rule: #ffffff | #3A352F (ΔL +0.129) |  |
| `lib/shane/NotePicker.svelte:349` | text of np name e.g. “Clear”, “No note set” (note picker) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | #3A352F (ΔL +0.129) |  |
| `lib/shane/pacifier/Pacifier.svelte:660` | the outline ring of a dormant vowel node, calibration wheel | `stroke (attribute)` | the vowel node’s white interior (Pacifier.svelte:793) | #3A352F (ΔL +0.129) |  |
| `lib/shane/pacifier/Pacifier.svelte:664` | the vowel glyph inside a node, default state, calibration wheel | `glyphFill` | the vowel node’s white interior (Pacifier.svelte:793) | #3A352F (ΔL +0.129) |  |
| `lib/shane/ProfileSwitcher.svelte:364` | text of ps first lede “Please name your profile so we can map y…” (voice switcher) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | #3A352F (ΔL +0.129) |  |
| `lib/shane/ProfileSwitcher.svelte:437` | text of ps voice when current=true (voice switcher) | `color` | .ps-panel: var(--drawer-bg) | #3A352F (ΔL +0.129) |  |
| `lib/shane/ProfileSwitcher.svelte:501` | text of ps input (voice switcher) | `color` | own rule: #ffffff | #3A352F (ΔL +0.129) |  |
| `lib/shane/TextualWitnesses.svelte:139` | text of witnesses title e.g. “Textual witnesses”, “Score and poem agree” (drawer, Textual witnesses) | `color` | NOT ESTABLISHED | #3A352F (ΔL +0.129) |  |
| `lib/shane/VoiceProfilePane.svelte:1379` | text of profile lede “Your repertoire-fit results will appear …” (Marked score page) | `color` | .paper-page: var(--paper-cream) | #3A352F (ΔL +0.129) |  |
| `routes/+page.svelte:4977` | text of replace dialog (app shell, +page) | `color` | own rule: var(--paper-cream, #f5f0e6) | #3A352F (ΔL +0.129) |  |
| `routes/+page.svelte:5284` | border of sheet print btn “Print” (app shell, +page) | `border` | .app-content: var(--desk-fill) | #3A352F (ΔL +0.129) |  |
| `routes/+page.svelte:5287` | text of sheet print btn “Print” (app shell, +page) | `color` | .app-content: var(--desk-fill) | #3A352F (ΔL +0.129) |  |
| `routes/+page.svelte:5309` | focus outline of sheet print btn on keyboard focus “Print” (app shell, +page) | `outline` | .app-content: var(--desk-fill) | #3A352F (ΔL +0.129) |  |
| `routes/+page.svelte:5588` | text of main content tab guide reading inner h4 (app shell, +page) | `color` | NOT ESTABLISHED | #3A352F (ΔL +0.129) |  |
| `routes/+page.svelte:5677` | border of portrait action “Read” (app shell, +page) | `border` | own rule: var(--ink-primary, #1a1612) | #3A352F (ΔL +0.129) |  |
| `routes/+page.svelte:5679` | fill of portrait action “Read” (app shell, +page) | `background` | .app-content: var(--desk-fill) | #3A352F (ΔL +0.129) |  |
| `routes/+page.svelte:5698` | focus outline of portrait action on keyboard focus “Read” (app shell, +page) | `outline` | own rule: var(--ink-primary, #1a1612) | #3A352F (ΔL +0.129) |  |

#### `#1A1612` · #1A1612, OKLCH L/C/H 0.203 / 0.010 / 67 · 37 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/NotePicker.svelte:250` | the accidental of the chosen note, note picker | `fill (attribute)` | the staff svg paints no ground of its own (NotePicker.svelte:324), so the calibration takeover card: Drawer .takeover-frame: var(--drawer-bg) | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `lib/shane/NotePicker.svelte:258` | the whole-note head of the chosen note, note picker | `fill (attribute)` | the staff svg paints no ground of its own (NotePicker.svelte:324), so the calibration takeover card: Drawer .takeover-frame: var(--drawer-bg) | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `lib/shane/NotePicker.svelte:262` | the accidental of the chosen note (text fallback), note picker | `fill (attribute)` | the staff svg paints no ground of its own (NotePicker.svelte:324), so the calibration takeover card: Drawer .takeover-frame: var(--drawer-bg) | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `lib/shane/NotePicker.svelte:266` | the notehead of the chosen note (drawn fallback), note picker | `stroke (attribute)` | the staff svg paints no ground of its own (NotePicker.svelte:324), so the calibration takeover card: Drawer .takeover-frame: var(--drawer-bg) | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `lib/shane/pacifier/contrast.ts:131` | not a paint: the pacifier contrast checker’s own copy of the token value, compared against app.css by contrast.test.ts | `` | NOT ESTABLISHED | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `lib/shane/SyllableStation.svelte:231` | text of slot is placed (syllable placement station) | `color` | own rule: #FFFFFF (in a state variant: .slot.is-cursor) | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `lib/shane/SyllableStation.svelte:243` | text of slot is cursor (syllable placement station) | `color` | own rule: #FFFFFF (in a state variant: .slot.is-cursor) | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `routes/fit-font-lab/+page.svelte:105` | text of lab (font lab developer route) | `color` | NOT ESTABLISHED | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `routes/fit-font-lab/+page.svelte:148` | fill of lab chip active (font lab developer route) | `background` | .active: #1a1612 (in a state variant: .lab-chip.active) | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `routes/fit-font-lab/+page.svelte:150` | border of lab chip active (font lab developer route) | `border-color` | own rule: #f9f7f5 | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:1570` | the beams joining eighth notes, score renderer | `stroke (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:1764` | the left hook of a tuplet bracket, score renderer | `stroke (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:1765` | the left half of a tuplet bracket, score renderer | `stroke (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:1766` | the right half of a tuplet bracket, score renderer | `stroke (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:1767` | the right hook of a tuplet bracket, score renderer | `stroke (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:1768` | the tuplet number, score renderer | `fill (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:2131` | a sung note’s accidental (font glyph), score renderer | `` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:2137` | a sung note’s accidental (text fallback), score renderer | `fill (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:2209` | the left parenthesis of a courtesy accidental, score renderer | `` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:2210` | a courtesy accidental, score renderer | `` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:2211` | the right parenthesis of a courtesy accidental, score renderer | `` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:2223` | a courtesy accidental in parentheses (text fallback), score renderer | `fill (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:2288` | the augmentation dot (font glyph), score renderer | `` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:2289` | the augmentation dot (drawn fallback), score renderer | `fill (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:2451` | a notehead (font glyph), score renderer | `` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:2454` | a hollow notehead (drawn fallback), score renderer | `stroke (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:2455` | a filled notehead (drawn fallback), score renderer | `fill (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:2486` | the stem of a beamed note, score renderer | `stroke (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:2494` | the stem of an unbeamed note, score renderer | `stroke (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:2500` | the flag on an unbeamed eighth (font glyph), score renderer | `` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:2504` | the flag on an unbeamed eighth (drawn fallback), score renderer | `stroke (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:2630` | a tie, score renderer | `fill (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:2669` | a slur over a melisma, score renderer | `stroke (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:2697` | the Cyrillic lyric under the staff, score renderer | `fill (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:2733` | the phonation-break mark in the IPA line, score renderer | `fill (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:2770` | the hyphen between lyric syllables, score renderer | `stroke (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |
| `packages/score-parser/src/staff-renderer.ts:2780` | the lyric extender line, score renderer | `stroke (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | #3A352F (ΔL +0.129) | same value as --ink-primary |

#### `--ink-secondary` · #4A4540, OKLCH L/C/H 0.394 / 0.011 / 68 · 90 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/Drawer.svelte:1723` | text of pull label “Paper”, “Drawer” (drawer frame) | `color` | .drawer-pull: var(--drawer-bg, #FAF8F5) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/Drawer.svelte:1731` | text of pull chevron “Paper”, “Drawer” (drawer frame) | `color` | .drawer-pull: var(--drawer-bg, #FAF8F5) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/Drawer.svelte:1772` | text of toc heading (drawer frame) | `color` | .drawer: var(--desk-fill, var(--desk-surface, #D8D4C8)) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/Drawer.svelte:1810` | text of toc link (drawer frame) | `color` | own rule: rgba(166, 123, 123, 0.08) (in a state variant: .toc-link.active) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/Drawer.svelte:1867` | text of toc sub (drawer frame) | `color` | .drawer: var(--desk-fill, var(--desk-surface, #D8D4C8)) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/Drawer.svelte:1882` | text of toc deep (drawer frame) | `color` | .drawer: var(--desk-fill, var(--desk-surface, #D8D4C8)) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/Drawer.svelte:1924` | text of toc chevron on hover (drawer frame) | `color` | .drawer: var(--desk-fill, var(--desk-surface, #D8D4C8)) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1473` | text of word ipa (drawer, word inspector) | `color` | .word-stack: var(--paper-cream) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1771` | text of rubric label “unstressed” (drawer, word inspector) | `color` | .organism: rgba(139, 154, 125, 0.15) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1889` | text of yo chooser label “ё ↔ е” (drawer, word inspector) | `color` | .organism: rgba(139, 154, 125, 0.15) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1910` | text of chooser label “ё ↔ е” (drawer, word inspector) | `color` | .organism: rgba(139, 154, 125, 0.15) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2050` | text of drag ghost ipa (drawer, word inspector) | `color` | .drag-ghost: var(--paper-cream) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2100` | text of atom ipa (drawer, word inspector) | `color` | .atom: var(--paper-cream) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2148` | text of ordinal num (drawer, word inspector) | `color` | .organism: rgba(139, 154, 125, 0.15) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2282` | text of blurb ipa (drawer, word inspector) | `color` | .blurb-box: #F5F0E8 | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2303` | text of blurb promotion (drawer, word inspector) | `color` | .blurb-box: #F5F0E8 | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2341` | text of provenance choice e.g. “Dictionary” (drawer, word inspector) | `color` | own rule: var(--paper-cream) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2383` | text of spot checkbox text (drawer, word inspector) | `color` | Drawer.svelte .group: var(--drawer-bg) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2405` | text of reset button (drawer, word inspector) | `color` | own rule: var(--paper-cream) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/IntakePanel.svelte:982` | text of caption link (drawer, Input band) | `color` | .intake: var(--paper-light) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/NotationFields.svelte:270` | text of notation changed “No stress marks” (drawer, Notation station) | `color` | Drawer.svelte .group: var(--drawer-bg) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/SongList.svelte:292` | text of song btn e.g. “Cancel” (drawer, song library) | `color` | Drawer.svelte .group: var(--drawer-bg) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/SongList.svelte:343` | text of song note (drawer, song library) | `color` | Drawer.svelte .group: var(--drawer-bg) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/SongList.svelte:351` | text of song error “New song” (drawer, song library) | `color` | Drawer.svelte .group: var(--drawer-bg) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Drawer/VoiceAnchor.svelte:85` | text of voice status (drawer, voice anchor line) | `color` | Drawer.svelte .group: var(--drawer-bg) | --stone-700 (ΔL −0.020) |  |
| `lib/components/InstallPrompt.svelte:179` | text of install body (install banner) | `color` | .install-prompt: var(--paper, #f5f0e8) | --stone-700 (ΔL −0.020) | fallback #5A5248 is not the token’s #4A4540 (ΔE 0.050) |
| `lib/components/InstallPrompt.svelte:216` | text of install btn ghost (install banner) | `color` | .install-prompt: var(--paper, #f5f0e8) | --stone-700 (ΔL −0.020) | fallback #5A5248 is not the token’s #4A4540 (ΔE 0.050) |
| `lib/components/Paper/PageFooter.svelte:192` | text of attribution text (page footer) | `color` | SubsequentPage.svelte .paper-page: var(--paper-cream) \| TitlePage.svelte .paper-page: var(--paper-cream) \| VoiceProfilePane.svelte .paper-page: var(--paper-cream) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Paper/PageFooter.svelte:205` | text of attribution text a (page footer) | `color` | NOT ESTABLISHED | --stone-700 (ΔL −0.020) |  |
| `lib/components/Paper/PageFooter.svelte:227` | text of page number “Page”, “of” (page footer) | `color` | SubsequentPage.svelte .paper-page: var(--paper-cream) \| TitlePage.svelte .paper-page: var(--paper-cream) \| VoiceProfilePane.svelte .paper-page: var(--paper-cream) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Paper/ReadingPaper.svelte:411` | text of reading inner figcaption (Learn and Guide reading sheet) | `color` | NOT ESTABLISHED | --stone-700 (ΔL −0.020) |  |
| `lib/components/Paper/ReadingPaper.svelte:437` | text of reading inner th (Learn and Guide reading sheet) | `color` | NOT ESTABLISHED | --stone-700 (ΔL −0.020) |  |
| `lib/components/Paper/RunningHeader.svelte:40` | text of header text (running header, page 2 on) | `color` | SubsequentPage.svelte .paper-page: var(--paper-cream) \| VoiceProfilePane.svelte .paper-page: var(--paper-cream) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Paper/TitleHeader.svelte:165` | text of metadata line (title block on page one) | `color` | TitlePage.svelte .paper-page: var(--paper-cream) \| InsightsPane.svelte .paper-page: var(--paper-cream) \| VoiceProfilePane.svelte .paper-page: var(--paper-cream) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Paper/WordStack.svelte:259` | text of ipa row (a word on the page) | `color` | SubsequentPage.svelte .paper-page: var(--paper-cream) \| TitlePage.svelte .paper-page: var(--paper-cream) \| ReadingAid.svelte .reading-aid: var(--paper-light, #F5F1E8) | --stone-700 (ΔL −0.020) |  |
| `lib/components/Reading/GuideContent.svelte:584` | text of guide step figure figcaption (Guide text) | `color` | NOT ESTABLISHED | --stone-700 (ΔL −0.020) |  |
| `lib/shane/CalibrationWizard.svelte:1661` | text of wizard lede e.g. “Fit will measure your voice to build a f…” (calibration takeover) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/CalibrationWizard.svelte:1673` | text of wizard expander “What is vocal fry?” (calibration takeover) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/CalibrationWizard.svelte:1677` | text of wizard expander summary (calibration takeover) | `color` | NOT ESTABLISHED | --stone-700 (ΔL −0.020) |  |
| `lib/shane/CalibrationWizard.svelte:1723` | text of wizard secondary e.g. “Sing the three Ilya derived for you” (calibration takeover) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/CalibrationWizard.svelte:1767` | text of wizard count “Fry now, and keep going until the bar fi…” (calibration takeover) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/CalibrationWizard.svelte:1797` | text of wizard cue “Tap the”, “vowel to arm it, tap again to begin.” (calibration takeover) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/CalibrationWizard.svelte:1878` | text of wizard roster value e.g. “Hz” (calibration takeover) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/CalibrationWizard.svelte:1901` | text of wizard roster action button (calibration takeover) | `color` | NOT ESTABLISHED | --stone-700 (ΔL −0.020) |  |
| `lib/shane/CalibrationWizard.svelte:1922` | text of wizard info glyph on hover (calibration takeover) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/CalibrationWizard.svelte:2020` | text of wizard inline banner p (calibration takeover) | `color` | NOT ESTABLISHED | --stone-700 (ΔL −0.020) |  |
| `lib/shane/CalibrationWizard.svelte:2035` | text of wizard hold actions button (calibration takeover) | `color` | NOT ESTABLISHED | --stone-700 (ΔL −0.020) |  |
| `lib/shane/CalibrationWizard.svelte:2068` | text of wizard toast p (calibration takeover) | `color` | NOT ESTABLISHED | --stone-700 (ΔL −0.020) |  |
| `lib/shane/CorrectionSurface.svelte:941` | text of mark (correction stations) | `color` | Drawer.svelte .group: var(--drawer-bg) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/CorrectionSurface.svelte:971` | text of surface context (correction stations) | `color` | Drawer.svelte .group: var(--drawer-bg) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/CorrectionSurface.svelte:1100` | text of lyric label e.g. “This note sustains the syllable” (correction stations) | `color` | Drawer.svelte .group: var(--drawer-bg) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/CorrectionSurface.svelte:1173` | text of nolet word e.g. “of”, “in the space of” (correction stations) | `color` | Drawer.svelte .group: var(--drawer-bg) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/InsightsPane.svelte:523` | text of withheld list “Any reading of your range, your tessitur…”, “Any finding about where this piece may c…” (Insights page) | `color` | .squircle: var(--paper-cream) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/InsightsPane.svelte:535` | text of fit table “Term”, “Measured in this piece” (Insights page) | `color` | .squircle: var(--paper-cream) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/InsightsPane.svelte:572` | text of fit row not fit head flag e.g. “Flag” (Insights page) | `color` | .squircle: var(--paper-cream) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/InsightsPane.svelte:652` | text of running text “The findings page one deferred” (Insights page) | `color` | .paper-page: var(--paper-cream) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/InsightsPane.svelte:699` | text of attribution (Insights page) | `color` | +page.svelte .app-content: var(--desk-fill) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/InsightsPane.svelte:703` | text of attribution a (Insights page) | `color` | NOT ESTABLISHED | --stone-700 (ΔL −0.020) |  |
| `lib/shane/InsightsPane.svelte:719` | text of page count “Page”, “of” (Insights page) | `color` | +page.svelte .app-content: var(--desk-fill) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/NotePicker.svelte:367` | text of np clear on hover “Clear”, “No note set” (note picker) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/pacifier/Pacifier.svelte:689` | the outline ring of an armed vowel node, calibration wheel | `stroke (attribute)` | the vowel node’s white interior (Pacifier.svelte:793) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/pacifier/Pacifier.svelte:692` | the vowel glyph of an armed node, calibration wheel | `glyphFill` | the vowel node’s white interior (Pacifier.svelte:793) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/pacifier/Pacifier.svelte:696` | the outline ring of a node preparing to record: amber on the pulse, ink-secondary between pulses | `` | the vowel node’s white interior (Pacifier.svelte:793) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/pacifier/Pacifier.svelte:702` | the outline ring of a listening node, calibration wheel | `stroke (attribute)` | the vowel node’s white interior (Pacifier.svelte:793) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/pacifier/Pacifier.svelte:704` | the vowel glyph of a listening node, calibration wheel | `glyphFill` | the vowel node’s white interior (Pacifier.svelte:793) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/pacifier/Pacifier.svelte:708` | the outline ring of a working (analyzing) node, calibration wheel | `stroke (attribute)` | the vowel node’s white interior (Pacifier.svelte:793) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/pacifier/Pacifier.svelte:711` | the vowel glyph of a working node, calibration wheel | `glyphFill` | the vowel node’s white interior (Pacifier.svelte:793) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/pacifier/Pacifier.svelte:720` | the ✓ badge on a captured vowel node, calibration wheel | `sigilColor` | the badge’s white disc (Pacifier.svelte:838) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/pacifier/Pacifier.svelte:894` | text of pacifier caption (calibration wheel) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/ProfileSwitcher.svelte:380` | text of ps header (voice switcher) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/ProfileSwitcher.svelte:430` | text of ps voice (voice switcher) | `color` | .ps-panel: var(--drawer-bg) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/ProfileSwitcher.svelte:467` | text of ps verbs button (voice switcher) | `color` | NOT ESTABLISHED | --stone-700 (ΔL −0.020) |  |
| `lib/shane/ProfileSwitcher.svelte:477` | text of ps confirm p (voice switcher) | `color` | NOT ESTABLISHED | --stone-700 (ΔL −0.020) |  |
| `lib/shane/ProfileSwitcher.svelte:484` | text of ps label “Rename this voice”, “What shall we call this voice?” (voice switcher) | `color` | .ps-panel: var(--drawer-bg) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/ScoreUploader.svelte:960` | text of status label (score upload) | `color` | Drawer.svelte .group: var(--drawer-bg) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/ScoreUploader.svelte:1004` | text of banner text “Read from a picture. Ilya worked the not…”, “Converted from Finale format by denigma.…” (score upload) | `color` | .banner: rgba(124, 107, 176, 0.08) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/ScoreUploader.svelte:1018` | text of banner dismiss on hover “Dismiss” (score upload) | `color` | .banner: rgba(124, 107, 176, 0.08) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/ScoreUploader.svelte:1045` | text of note text “Try another file” (score upload) | `color` | .note: rgba(0, 0, 0, 0.03) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/ScoreUploader.svelte:1087` | text of btn secondary e.g. “Cancel” (score upload) | `color` | own rule: white | --stone-700 (ΔL −0.020) |  |
| `lib/shane/TextualWitnesses.svelte:115` | text of witnesses e.g. “Textual witnesses”, “Score and poem agree” (drawer, Textual witnesses) | `color` | NOT ESTABLISHED | --stone-700 (ΔL −0.020) |  |
| `lib/shane/TextualWitnesses.svelte:143` | text of witnesses summary e.g. “Score and poem agree” (drawer, Textual witnesses) | `color` | NOT ESTABLISHED | --stone-700 (ΔL −0.020) |  |
| `lib/shane/VoiceProfilePane.svelte:1383` | text of profile status (Marked score page) | `color` | .paper-page: var(--paper-cream) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/VoiceProfilePane.svelte:1474` | text of octave notice (Marked score page) | `color` | .paper-page: var(--paper-cream) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/VoiceProfilePane.svelte:1505` | text of withheld lede (Marked score page) | `color` | .withheld: var(--paper-cream) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/VoiceProfilePane.svelte:1520` | text of withheld line (Marked score page) | `color` | .withheld: var(--paper-cream) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/VoiceProfilePane.svelte:1529` | text of withheld close (Marked score page) | `color` | .withheld: var(--paper-cream) | --stone-700 (ΔL −0.020) |  |
| `lib/shane/VoiceProfilePane.svelte:1563` | text of watch band line (Marked score page) | `color` | .watch-band: var(--paper-cream) | --stone-700 (ΔL −0.020) |  |
| `routes/+page.svelte:5014` | text of replace actions button (app shell, +page) | `color` | NOT ESTABLISHED | --stone-700 (ΔL −0.020) |  |
| `routes/+page.svelte:5800` | text of update toast “A new version of Ilya is ready.” (app shell, +page) | `color` | own rule: var(--paper, #faf7f2) | --stone-700 (ΔL −0.020) |  |
| `routes/+page.svelte:5827` | text of update toast dismiss (app shell, +page) | `color` | .update-toast: var(--paper, #faf7f2) | --stone-700 (ΔL −0.020) |  |

#### `#4A4540` · #4A4540, OKLCH L/C/H 0.394 / 0.011 / 68 · 3 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/pacifier/contrast.ts:132` | not a paint: the pacifier contrast checker’s own copy of the token value, compared against app.css by contrast.test.ts | `` | NOT ESTABLISHED | --stone-700 (ΔL −0.020) | same value as --ink-secondary |
| `routes/fit-font-lab/+page.svelte:116` | text of lab note (font lab developer route) | `color` | NOT ESTABLISHED | --stone-700 (ΔL −0.020) | same value as --ink-secondary |
| `routes/fit-font-lab/+page.svelte:123` | text of lab status (font lab developer route) | `color` | NOT ESTABLISHED | --stone-700 (ΔL −0.020) | same value as --ink-secondary |

#### `--ink-tertiary` · #6A655F, OKLCH L/C/H 0.509 / 0.011 / 73 · 65 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `app.css:180` | declares --color-text-muted (global stylesheet) | `--color-text-muted` | NOT ESTABLISHED | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/AnalysisStation.svelte:158` | text of placeholder hint (drawer, Analysis station) | `color` | Drawer.svelte .group: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/AnalysisStation.svelte:175` | text of dict progress text “Loading dictionary…” (drawer, Analysis station) | `color` | Drawer.svelte .group: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/Drawer.svelte:1362` | text of band state tag “from score” (drawer frame) | `color` | .drawer: var(--desk-fill, var(--desk-surface, #D8D4C8)) | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/Drawer.svelte:1637` | text of takeover title “Voice” (drawer frame) | `color` | .takeover-frame: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/Drawer.svelte:1919` | text of toc chevron (drawer frame) | `color` | .drawer: var(--desk-fill, var(--desk-surface, #D8D4C8)) | --stone-500 (ΔL +0.044) | fallback #8A8780 is not the token’s #6A655F (ΔE 0.114) |
| `lib/components/Drawer/InspectorPanel.svelte:1489` | text of word gloss missing (drawer, word inspector) | `color` | Drawer.svelte .group: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1685` | text of dict pos (drawer, word inspector) | `color` | .dict-entry-cell: #F0F3EE | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1695` | text of gloss lang chip (drawer, word inspector) | `color` | .dict-entry-cell: #F0F3EE | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1696` | border of gloss lang chip (drawer, word inspector) | `border` | .dict-entry-cell: #F0F3EE | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2043` | text of drag ghost arrow (drawer, word inspector) | `color` | .drag-ghost: var(--paper-cream) | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2093` | text of atom arrow (drawer, word inspector) | `color` | .atom: var(--paper-cream) | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2276` | text of blurb arrow sep (drawer, word inspector) | `color` | .blurb-box: #F5F0E8 | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2295` | text of blurb no text “No phonological note for this character.” (drawer, word inspector) | `color` | .blurb-box: #F5F0E8 | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2317` | text of blurb citation “No phonological note for this character.” (drawer, word inspector) | `color` | .blurb-box: #F5F0E8 | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/IntakePanel.svelte:689` | text of status text (drawer, Input band) | `color` | Drawer.svelte .group: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/IntakePanel.svelte:780` | text of intake receipt tag e.g. “poem”, “%s lines” (drawer, Input band) | `color` | .intake: var(--paper-light) | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/IntakePanel.svelte:803` | text of intake receipt count “%s words”, “Clear” (drawer, Input band) | `color` | .intake: var(--paper-light) | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/IntakePanel.svelte:901` | text of syl count (drawer, Input band) | `color` | .intake: var(--paper-light) | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/IntakePanel.svelte:917` | text of syl chevron (drawer, Input band) | `color` | .intake: var(--paper-light) | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/IntakePanel.svelte:960` | text of intake drop hint “Drop the other kind here, or a new file …” (drawer, Input band) | `color` | .intake: var(--paper-light) | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/IntakePanel.svelte:972` | text of intake caption (drawer, Input band) | `color` | .intake: var(--paper-light) | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/IntakePanel.svelte:1068` | text of text input placeholder “Paste, type, or drop your poem here.” (drawer, Input band) | `color` | .intake: var(--paper-light) | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/MetadataFields.svelte:197` | text of meta from score e.g. “from score” (drawer, Piece band fields) | `color` | Drawer.svelte .group: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/MetadataFields.svelte:217` | text of meta input placeholder e.g. “Aria or song title”, “from score” (drawer, Piece band fields) | `color` | own rule: white | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/NotationFields.svelte:302` | text of cosmetic label left label inactive e.g. “No stress marks” (drawer, Notation station) | `color` | Drawer.svelte .group: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/SearchableSelect.svelte:299` | text of trigger placeholder (drawer, composer and poet picker) | `color` | .select-trigger: white | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/SearchableSelect.svelte:307` | stroke of chevron (drawer, composer and poet picker) | `stroke` | .select-trigger: white | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/SearchableSelect.svelte:354` | text of select search placeholder “Type to filter…” (drawer, composer and poet picker) | `color` | .select-dropdown: white | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/SearchableSelect.svelte:391` | text of option secondary (drawer, composer and poet picker) | `color` | .select-option: rgba(139, 154, 125, 0.1) (in a state variant: .select-option.highlighted) | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/StationHeader.svelte:249` | text of station status (drawer, station header) | `color` | Drawer.svelte .group: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/components/Drawer/StationHeader.svelte:275` | text of chevron icon (drawer, station header) | `color` | Drawer.svelte .group: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/components/Paper/TitleHeader.svelte:184` | text of placeholder text e.g. “Aria or song title” (title block on page one) | `color` | TitlePage.svelte .paper-page: var(--paper-cream) \| InsightsPane.svelte .paper-page: var(--paper-cream) \| VoiceProfilePane.svelte .paper-page: var(--paper-cream) | --stone-500 (ΔL +0.044) |  |
| `lib/components/Paper/TitlePage.svelte:219` | text of empty directive “Tap Drawer at the bottom of the screen t…”, “Enter your Cyrillic text in the drawer o…” (title page) | `color` | .paper-page: var(--paper-cream) | --stone-500 (ΔL +0.044) |  |
| `lib/components/Paper/WordStack.svelte:282` | text of clitic ipa (a word on the page) | `color` | SubsequentPage.svelte .paper-page: var(--paper-cream) \| TitlePage.svelte .paper-page: var(--paper-cream) \| ReadingAid.svelte .reading-aid: var(--paper-light, #F5F1E8) | --stone-500 (ΔL +0.044) |  |
| `lib/components/ReadingAid.svelte:137` | text of aid label “Reading aid, not the page” (reading aid beside the page) | `color` | .reading-aid: var(--paper-light, #F5F1E8) | --stone-500 (ΔL +0.044) |  |
| `lib/components/ReadingAid.svelte:168` | text of aid end “· end of verse %s ·” (reading aid beside the page) | `color` | .reading-aid: var(--paper-light, #F5F1E8) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/CalibrationWizard.svelte:1682` | text of wizard expander p (calibration takeover) | `color` | NOT ESTABLISHED | --stone-500 (ΔL +0.044) |  |
| `lib/shane/CalibrationWizard.svelte:1758` | text of wizard caption “None of the ten vowels is optional. Thes…” (calibration takeover) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/CalibrationWizard.svelte:1790` | text of wizard progress “Vowel”, “of” (calibration takeover) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/CalibrationWizard.svelte:1859` | text of wizard roster reading (calibration takeover) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/CalibrationWizard.svelte:1873` | text of wizard roster noisefloor “Noise floor: Unmeasured” (calibration takeover) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/CalibrationWizard.svelte:1918` | text of wizard info glyph (calibration takeover) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/CalibrationWizard.svelte:1964` | text of charx heading e.g. “Range”, “Lowest comfortable note” (calibration takeover) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/CalibrationWizard.svelte:1972` | text of charx hint e.g. “Where you live, not your edges.”, “Tessitura floor” (calibration takeover) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/CalibrationWizard.svelte:2046` | text of wizard pause e.g. “Pause” (calibration takeover) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/CalibrationWizard.svelte:2074` | text of wizard toast dismiss (calibration takeover) | `color` | .wizard-toast: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/CorrectionSurface.svelte:992` | text of station count (correction stations) | `color` | Drawer.svelte .group: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/CorrectionSurface.svelte:1037` | text of cell when disabled (correction stations) | `color` | own rule: var(--paper-light, #f5f1e8) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/InsightsPane.svelte:555` | text of fit head in span (Insights page) | `color` | NOT ESTABLISHED | --stone-500 (ΔL +0.044) |  |
| `lib/shane/InsightsPane.svelte:577` | text of qualifier e.g. “cut at half the second-longest pitch, be…”, “a pitch sits within half a quaver of the…” (Insights page) | `color` | .squircle: var(--paper-cream) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/InsightsPane.svelte:609` | text of finding tag (Insights page) | `color` | +page.svelte .app-content: var(--desk-fill) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/InsightsPane.svelte:628` | text of finding further (Insights page) | `color` | +page.svelte .app-content: var(--desk-fill) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/Loupe.svelte:989` | text of loupe tag (loupe) | `color` | .loupe: var(--paper-light, #f5f1e8) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/Loupe.svelte:1010` | text of loupe note (loupe) | `color` | .loupe: var(--paper-light, #f5f1e8) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/NotePicker.svelte:353` | text of np name empty “No note set” (note picker) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/NotePicker.svelte:359` | text of np clear “Clear”, “No note set” (note picker) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/pacifier/Pacifier.svelte:680` | the ≈ badge on an estimated vowel node, calibration wheel | `sigilColor` | the badge’s white disc (Pacifier.svelte:838) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/pacifier/Pacifier.svelte:683` | the dashed outline ring of a deselected vowel node, calibration wheel | `stroke (attribute)` | the vowel node’s white interior (Pacifier.svelte:793) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/ProfileSwitcher.svelte:450` | text of ps date (voice switcher) | `color` | .ps-panel: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/ProfileSwitcher.svelte:534` | text of ps quiet “Cancel” (voice switcher) | `color` | .ps-panel: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/ScoreUploader.svelte:988` | text of format label “Read from a picture. Ilya worked the not…”, “Converted from Finale format by denigma.…” (score upload) | `color` | Drawer.svelte .group: var(--drawer-bg) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/ScoreUploader.svelte:1010` | text of banner dismiss “Dismiss” (score upload) | `color` | .banner: rgba(124, 107, 176, 0.08) | --stone-500 (ΔL +0.044) |  |
| `lib/shane/VoiceProfilePane.svelte:1419` | text of profile empty “Calibrate your voice to begin.” (Marked score page) | `color` | .paper-page: var(--paper-cream) | --stone-500 (ΔL +0.044) |  |
| `routes/+page.svelte:4948` | text of shane provenance (app shell, +page) | `color` | Drawer.svelte .group: var(--drawer-bg) via snippet metadataBody | --stone-500 (ΔL +0.044) |  |

#### `#6A655F` · #6A655F, OKLCH L/C/H 0.509 / 0.011 / 73 · 3 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/pacifier/contrast.ts:133` | not a paint: the pacifier contrast checker’s own copy of the token value, compared against app.css by contrast.test.ts | `` | NOT ESTABLISHED | --stone-500 (ΔL +0.044) | same value as --ink-tertiary |
| `lib/shane/SyllableStation.svelte:203` | text of station text (syllable placement station) | `color` | IntakePanel.svelte .intake: var(--paper-light) | --stone-500 (ΔL +0.044) | same value as --ink-tertiary |
| `packages/score-parser/src/staff-renderer.ts:2702` | the IPA line under the Cyrillic lyric, score renderer | `fill (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-500 (ΔL +0.044) | same value as --ink-tertiary |

#### `--stone-300` · #D6D3D1, OKLCH L/C/H 0.869 / 0.004 / 56 · 30 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `app.css:182` | declares --color-border (global stylesheet) | `--color-border` | NOT ESTABLISHED | --desk-surface (ΔL +0.001) |  |
| `lib/components/Drawer/AnalysisStation.svelte:182` | fill of dict progress track (drawer, Analysis station) | `background` | Drawer.svelte .group: var(--drawer-bg) | --desk-surface (ΔL +0.001) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1930` | border of atom (drawer, word inspector) | `border` | own rule: var(--paper-cream) | --desk-surface (ΔL +0.001) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1998` | border of drag preview slot (drawer, word inspector) | `border` | .is-stressed: var(--sage) (in a state variant: .stress-circle.is-stressed) | --desk-surface (ΔL +0.001) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2310` | top border of blurb promotion divider (drawer, word inspector) | `border-top` | .blurb-box: #F5F0E8 | --desk-surface (ΔL +0.001) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2337` | border of provenance choice e.g. “Dictionary” (drawer, word inspector) | `border` | own rule: var(--paper-cream) | --desk-surface (ΔL +0.001) |  |
| `lib/components/Drawer/MetadataFields.svelte:210` | border of meta input e.g. “Aria or song title”, “from score” (drawer, Piece band fields) | `border` | own rule: white | --desk-surface (ΔL +0.001) |  |
| `lib/components/Drawer/NotationFields.svelte:313` | fill of toggle switch (drawer, Notation station) | `background` | .active: var(--notation-accent, var(--sage)) (in a state variant: .toggle-switch.active) | --desk-surface (ΔL +0.001) |  |
| `lib/components/Drawer/SearchableSelect.svelte:267` | border of select trigger (drawer, composer and poet picker) | `border` | own rule: white | --desk-surface (ΔL +0.001) |  |
| `lib/components/Drawer/SearchableSelect.svelte:327` | border of select dropdown “Type to filter…” (drawer, composer and poet picker) | `border` | own rule: white | --desk-surface (ΔL +0.001) |  |
| `lib/components/Drawer/SearchableSelect.svelte:342` | bottom border of select search “Type to filter…” (drawer, composer and poet picker) | `border-bottom` | .select-dropdown: white | --desk-surface (ΔL +0.001) |  |
| `lib/components/Drawer/SearchableSelect.svelte:399` | top border of custom option (drawer, composer and poet picker) | `border-top` | .select-option: rgba(139, 154, 125, 0.1) (in a state variant: .select-option.highlighted) | --desk-surface (ΔL +0.001) |  |
| `lib/components/Paper/ReadingPaper.svelte:391` | top border of reading inner hr (Learn and Guide reading sheet) | `border-top` | NOT ESTABLISHED | --desk-surface (ΔL +0.001) |  |
| `lib/components/Paper/ReadingPaper.svelte:428` | bottom border of reading inner thead (Learn and Guide reading sheet) | `border-bottom` | NOT ESTABLISHED | --desk-surface (ΔL +0.001) |  |
| `lib/shane/CalibrationWizard.svelte:1724` | border of wizard secondary e.g. “Sing the three Ilya derived for you” (calibration takeover) | `border-color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --desk-surface (ΔL +0.001) |  |
| `lib/shane/CalibrationWizard.svelte:1776` | fill of readiness meter (calibration takeover) | `background` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --desk-surface (ΔL +0.001) |  |
| `lib/shane/CalibrationWizard.svelte:1836` | bottom border of wizard roster tbody tr (calibration takeover) | `border-bottom` | NOT ESTABLISHED | --desk-surface (ΔL +0.001) |  |
| `lib/shane/CalibrationWizard.svelte:1899` | border of wizard roster action button (calibration takeover) | `border` | NOT ESTABLISHED | --desk-surface (ΔL +0.001) |  |
| `lib/shane/CalibrationWizard.svelte:1956` | top border of charx group e.g. “Range”, “Lowest comfortable note” (calibration takeover) | `border-top` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --desk-surface (ΔL +0.001) |  |
| `lib/shane/CalibrationWizard.svelte:2013` | border of wizard inline banner e.g. “Paused. Resume when you're ready.”, “Resume” (calibration takeover) | `border` | own rule: var(--drawer-bg) | --desk-surface (ΔL +0.001) |  |
| `lib/shane/CalibrationWizard.svelte:2033` | border of wizard hold actions button (calibration takeover) | `border` | NOT ESTABLISHED | --desk-surface (ΔL +0.001) |  |
| `lib/shane/CorrectionSurface.svelte:869` | right border of dock tight (correction stations) | `border-right` | own rule: var(--drawer-bg, #faf8f5) | --desk-surface (ΔL +0.001) |  |
| `lib/shane/CorrectionSurface.svelte:878` | top border of dock portrait (correction stations) | `border-top` | own rule: var(--drawer-bg, #faf8f5) | --desk-surface (ΔL +0.001) |  |
| `lib/shane/CorrectionSurface.svelte:1026` | border of cell (correction stations) | `border` | own rule: var(--paper-light, #f5f1e8) | --desk-surface (ΔL +0.001) |  |
| `lib/shane/NotePicker.svelte:320` | border of np select (note picker) | `border` | own rule: #ffffff | --desk-surface (ΔL +0.001) |  |
| `lib/shane/ProfileSwitcher.svelte:402` | border of ps panel (voice switcher) | `border` | own rule: var(--drawer-bg) | --desk-surface (ΔL +0.001) |  |
| `lib/shane/ProfileSwitcher.svelte:465` | border of ps verbs button (voice switcher) | `border` | NOT ESTABLISHED | --desk-surface (ΔL +0.001) |  |
| `lib/shane/ProfileSwitcher.svelte:499` | border of ps input (voice switcher) | `border` | own rule: #ffffff | --desk-surface (ΔL +0.001) |  |
| `lib/shane/ScoreUploader.svelte:966` | border of spinner (score upload) | `border` | Drawer.svelte .group: var(--drawer-bg) | --desk-surface (ΔL +0.001) |  |
| `lib/shane/ScoreUploader.svelte:1089` | border of btn secondary e.g. “Cancel” (score upload) | `border` | own rule: white | --desk-surface (ΔL +0.001) |  |

#### `--color-border` · #D6D3D1, OKLCH L/C/H 0.869 / 0.004 / 56 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/ReadingAid.svelte:159` | top border of aid rule (reading aid beside the page) | `border-top` | .reading-aid: var(--paper-light, #F5F1E8) | --desk-surface (ΔL +0.001) |  |

#### `--stone-500` · #78716C, OKLCH L/C/H 0.553 / 0.012 / 58 · 8 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/InspectorPanel.svelte:1817` | border of yo sigla (drawer, word inspector) | `border` | own rule: var(--sage) (in a state variant: .yo-sigla.is-yo) | --ink-tertiary (ΔL −0.044) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2164` | border of stress circle (drawer, word inspector) | `border` | own rule: var(--sage) (in a state variant: .stress-circle.is-stressed) | --ink-tertiary (ΔL −0.044) |  |
| `lib/components/Drawer/IntakePanel.svelte:819` | text of receipt btn e.g. “Clear”, “Replace” (drawer, Input band) | `color` | .intake: var(--paper-light) | --ink-tertiary (ΔL −0.044) |  |
| `lib/components/Drawer/IntakePanel.svelte:1170` | text of btn ghost e.g. “Start placement over” (drawer, Input band) | `color` | .intake: var(--paper-light) | --ink-tertiary (ΔL −0.044) |  |
| `lib/components/Drawer/MetadataFields.svelte:240` | text of btn reset e.g. “Revert to score header” (drawer, Piece band fields) | `color` | Drawer.svelte .group: var(--drawer-bg) | --ink-tertiary (ΔL −0.044) |  |
| `lib/components/Drawer/RootPanel.svelte:227` | text of btn ghost e.g. “Export all songs”, “Export this song” (drawer, Piece band) | `color` | Drawer.svelte .group: var(--drawer-bg) | --ink-tertiary (ΔL −0.044) |  |
| `lib/components/Drawer/SearchableSelect.svelte:282` | border of select trigger on hover (drawer, composer and poet picker) | `border-color` | own rule: white | --ink-tertiary (ΔL −0.044) |  |
| `lib/components/Drawer/SongList.svelte:323` | text of new btn “New song” (drawer, song library) | `color` | Drawer.svelte .group: var(--drawer-bg) | --ink-tertiary (ΔL −0.044) |  |

#### `#78716C` · #78716C, OKLCH L/C/H 0.553 / 0.012 / 58 · 6 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Paper/PageFooter.svelte:140` | text of legend item (page footer) | `color` | SubsequentPage.svelte .paper-page: var(--paper-cream) \| TitlePage.svelte .paper-page: var(--paper-cream) \| VoiceProfilePane.svelte .paper-page: var(--paper-cream) | --ink-tertiary (ΔL −0.044) | same value as --stone-500 |
| `lib/components/Paper/PageFooter.svelte:238` | text of fit broad legend (page footer) | `color` | SubsequentPage.svelte .paper-page: var(--paper-cream) \| TitlePage.svelte .paper-page: var(--paper-cream) \| VoiceProfilePane.svelte .paper-page: var(--paper-cream) | --ink-tertiary (ΔL −0.044) | same value as --stone-500 |
| `lib/components/Paper/WordStack.svelte:242` | border of is inferred (before mark) (a word on the page) | `border` | SubsequentPage.svelte .paper-page: var(--paper-cream) \| TitlePage.svelte .paper-page: var(--paper-cream) \| ReadingAid.svelte .reading-aid: var(--paper-light, #F5F1E8) | --ink-tertiary (ΔL −0.044) | same value as --stone-500 |
| `lib/components/Paper/WordStack.svelte:315` | text of icon area (a word on the page) | `color` | SubsequentPage.svelte .paper-page: var(--paper-cream) \| TitlePage.svelte .paper-page: var(--paper-cream) \| ReadingAid.svelte .reading-aid: var(--paper-light, #F5F1E8) | --ink-tertiary (ΔL −0.044) | same value as --stone-500 |
| `lib/components/Paper/WordStack.svelte:368` | text of verify label “verify” (a word on the page) | `color` | own rule: var(--paper-cream) | --ink-tertiary (ΔL −0.044) | same value as --stone-500 |
| `lib/shane/InsightsPane.svelte:677` | text of apparatus “Tessitura by Pacheco’s method: the span …”, “CITATION NOT YET VERIFIED” (Insights page) | `color` | +page.svelte .app-content: var(--desk-fill) | --ink-tertiary (ΔL −0.044) | same value as --stone-500 |

#### `--stone-700` · #44403C, OKLCH L/C/H 0.374 / 0.009 / 68 · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/InspectorPanel.svelte:1867` | text of sigil yo char (drawer, word inspector) | `color` | .yo-sigla: var(--sage) (in a state variant: .yo-sigla.is-yo) | --ink-secondary (ΔL +0.020) |  |
| `lib/shane/Loupe.svelte:931` | border of loupe (loupe) | `border` | own rule: var(--paper-light, #f5f1e8) | --ink-secondary (ΔL +0.020) |  |

#### `#44403C` · #44403C, OKLCH L/C/H 0.374 / 0.009 / 68 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Paper/WordStack.svelte:323` | text of word stack on hover icon area (a word on the page) | `color` | SubsequentPage.svelte .paper-page: var(--paper-cream) \| TitlePage.svelte .paper-page: var(--paper-cream) \| ReadingAid.svelte .reading-aid: var(--paper-light, #F5F1E8) | --ink-secondary (ΔL +0.020) | same value as --stone-700 |

#### `--drawer-bg` · #FAF8F5, OKLCH L/C/H 0.980 / 0.005 / 78 · 9 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `app.css:183` | declares --color-paper (global stylesheet) | `--color-paper` | NOT ESTABLISHED | --paper-light (ΔL −0.021) |  |
| `lib/components/Drawer/Drawer.svelte:1104` | fill of group (drawer frame) | `background` | .drawer: var(--desk-fill, var(--desk-surface, #D8D4C8)) | --paper-light (ΔL −0.021) |  |
| `lib/components/Drawer/Drawer.svelte:1530` | fill of takeover frame “← Back” (drawer frame) | `background` | .drawer: var(--desk-fill, var(--desk-surface, #D8D4C8)) | --paper-light (ΔL −0.021) |  |
| `lib/components/Drawer/Drawer.svelte:1701` | fill of drawer pull (drawer frame) | `background` | +page.svelte .app-content: var(--desk-fill) | --paper-light (ΔL −0.021) |  |
| `lib/shane/CalibrationWizard.svelte:2012` | fill of wizard inline banner e.g. “Paused. Resume when you're ready.”, “Resume” (calibration takeover) | `background` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --paper-light (ΔL −0.021) |  |
| `lib/shane/CalibrationWizard.svelte:2060` | fill of wizard toast “The room sounds a little lively. Your sa…” (calibration takeover) | `background` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --paper-light (ΔL −0.021) |  |
| `lib/shane/CorrectionSurface.svelte:841` | fill of dock (correction stations) | `background` | Drawer.svelte .group: var(--drawer-bg) | --paper-light (ΔL −0.021) |  |
| `lib/shane/ProfileSwitcher.svelte:384` | fill of ps header on hover not when disabled (voice switcher) | `background` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --paper-light (ΔL −0.021) |  |
| `lib/shane/ProfileSwitcher.svelte:404` | fill of ps panel (voice switcher) | `background` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --paper-light (ΔL −0.021) |  |

#### `--paper-light` · #F5F1E8, OKLCH L/C/H 0.959 / 0.013 / 87 · 4 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/IntakePanel.svelte:733` | fill of intake “Source” (drawer, Input band) | `background` | Drawer.svelte .group: var(--drawer-bg) | --paper-cream (ΔL −0.018) |  |
| `lib/components/ReadingAid.svelte:95` | fill of reading aid “The page” (reading aid beside the page) | `background` | +page.svelte .app-content: var(--desk-fill) | --paper-cream (ΔL −0.018) |  |
| `lib/shane/CorrectionSurface.svelte:1028` | fill of cell (correction stations) | `background` | Drawer.svelte .group: var(--drawer-bg) | --paper-cream (ΔL −0.018) |  |
| `lib/shane/Loupe.svelte:935` | fill of loupe (loupe) | `background` | NOT ESTABLISHED | --paper-cream (ΔL −0.018) |  |

#### `--paper-cream` · #F0EBE0, OKLCH L/C/H 0.941 / 0.016 / 86 · 20 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/DeskHead.svelte:208` | fill of pair member active (desk head, the document switch above the page) | `background` | .active: var(--paper-cream, #F0EBE0) (in a state variant: .pair-member.active) | --paper-light (ΔL +0.018) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1457` | fill of word stack (drawer, word inspector) | `background` | Drawer.svelte .group: var(--drawer-bg) | --paper-light (ΔL +0.018) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1580` | fill of dict panel (drawer, word inspector) | `background` | Drawer.svelte .group: var(--drawer-bg) | --paper-light (ΔL +0.018) | fallback #FDFBF7 is not the token’s #F0EBE0 (ΔE 0.049) |
| `lib/components/Drawer/InspectorPanel.svelte:1929` | fill of atom (drawer, word inspector) | `background` | .organism: rgba(139, 154, 125, 0.15) | --paper-light (ΔL +0.018) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2023` | fill of drag ghost (drawer, word inspector) | `background` | .organism: rgba(139, 154, 125, 0.15) | --paper-light (ΔL +0.018) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2336` | fill of provenance choice e.g. “Dictionary” (drawer, word inspector) | `background` | .organism: rgba(139, 154, 125, 0.15) | --paper-light (ΔL +0.018) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2404` | fill of reset button (drawer, word inspector) | `background` | .word-stack: var(--paper-cream) | --paper-light (ΔL +0.018) |  |
| `lib/components/Paper/ReadingPaper.svelte:47` | fill of reading paper (Learn and Guide reading sheet) | `background` | +page.svelte .app-content: var(--desk-fill) | --paper-light (ΔL +0.018) |  |
| `lib/components/Paper/SubsequentPage.svelte:104` | fill of paper page (page 2 on) | `background` | +page.svelte .app-content: var(--desk-fill) | --paper-light (ΔL +0.018) |  |
| `lib/components/Paper/TitlePage.svelte:186` | fill of paper page (title page) | `background` | +page.svelte .app-content: var(--desk-fill) | --paper-light (ΔL +0.018) |  |
| `lib/components/Paper/WordStack.svelte:369` | fill of verify label “verify” (a word on the page) | `background` | SubsequentPage.svelte .paper-page: var(--paper-cream) \| TitlePage.svelte .paper-page: var(--paper-cream) \| ReadingAid.svelte .reading-aid: var(--paper-light, #F5F1E8) | --paper-light (ΔL +0.018) |  |
| `lib/components/ReadingAid.svelte:108` | text of aid return “The page” (reading aid beside the page) | `color` | own rule: var(--ink-primary, #1a1612) | --paper-light (ΔL +0.018) |  |
| `lib/shane/InsightsPane.svelte:460` | fill of paper page (Insights page) | `background` | +page.svelte .app-content: var(--desk-fill) via snippet content | --paper-light (ΔL +0.018) |  |
| `lib/shane/InsightsPane.svelte:475` | fill of squircle e.g. “No score has been added, so there is not…” (Insights page) | `background` | .paper-page: var(--paper-cream) | --paper-light (ΔL +0.018) |  |
| `lib/shane/ScoreUploader.svelte:1112` | fill of ask e.g. “Is this picture the poem, or the score?”, “Is this PDF the poem, or the score?” (score upload) | `background` | Drawer.svelte .group: var(--drawer-bg) | --paper-light (ΔL +0.018) |  |
| `lib/shane/VoiceProfilePane.svelte:1335` | fill of paper page (Marked score page) | `background` | +page.svelte .app-content: var(--desk-fill) | --paper-light (ΔL +0.018) |  |
| `lib/shane/VoiceProfilePane.svelte:1488` | fill of withheld (Marked score page) | `background` | .paper-page: var(--paper-cream) | --paper-light (ΔL +0.018) |  |
| `lib/shane/VoiceProfilePane.svelte:1538` | fill of watch band (Marked score page) | `background` | .paper-page: var(--paper-cream) | --paper-light (ΔL +0.018) |  |
| `routes/+page.svelte:4976` | fill of replace dialog (app shell, +page) | `background` | NOT ESTABLISHED | --paper-light (ΔL +0.018) | fallback #F5F0E6 is not the token’s #F0EBE0 (ΔE 0.015) |
| `routes/+page.svelte:5680` | text of portrait action “Read” (app shell, +page) | `color` | own rule: var(--ink-primary, #1a1612) | --paper-light (ΔL +0.018) |  |

#### `#F0EBE0` · #F0EBE0, OKLCH L/C/H 0.941 / 0.016 / 86 · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/pacifier/contrast.ts:130` | not a paint: the pacifier contrast checker’s own copy of the token value, compared against app.css by contrast.test.ts | `` | NOT ESTABLISHED | --paper-light (ΔL +0.018) | same value as --paper-cream |
| `packages/score-parser/src/staff-renderer.ts:2828` | the background rectangle behind every rendered system, score renderer | `fill (attribute)` | is itself the surface; sits inside the Fit page (VoiceProfilePane .paper-page: var(--paper-cream)) | --paper-light (ΔL +0.018) | same value as --paper-cream |

#### `--desk-surface` · #D8D4C8, OKLCH L/C/H 0.870 / 0.017 / 92 · 3 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `app.css:54` | declares --app-bg (global stylesheet) | `--app-bg` | NOT ESTABLISHED | --stone-300 (ΔL −0.001) |  |
| `lib/components/Drawer/Drawer.svelte:2050` | fill of drawer (drawer frame) | `background` | +page.svelte .app-content: var(--desk-fill) | --stone-300 (ΔL −0.001) |  |
| `routes/+page.svelte:5193` | declares --desk-fill (app shell, +page) | `--desk-fill` | own rule: var(--desk-fill) | --stone-300 (ΔL −0.001) |  |

#### `--app-bg` · #D8D4C8, OKLCH L/C/H 0.870 / 0.017 / 92 · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `app.css:184` | declares --color-bg (global stylesheet) | `--color-bg` | NOT ESTABLISHED | --stone-300 (ΔL −0.001) |  |
| `app.css:207` | fill of body (global stylesheet) | `background-color` | NOT ESTABLISHED | --stone-300 (ΔL −0.001) |  |

#### `#3A352F` · #3A352F, OKLCH L/C/H 0.332 / 0.012 / 72 · 37 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/NotePicker.svelte:203` | the five staff lines of the note picker’s mini staff | `stroke (attribute)` | the staff svg paints no ground of its own (NotePicker.svelte:324), so the calibration takeover card: Drawer .takeover-frame: var(--drawer-bg) | --stone-700 (ΔL +0.042) |  |
| `lib/shane/NotePicker.svelte:209` | the bass clef on the note picker’s mini staff | `fill (attribute)` | the staff svg paints no ground of its own (NotePicker.svelte:324), so the calibration takeover card: Drawer .takeover-frame: var(--drawer-bg) | --stone-700 (ΔL +0.042) |  |
| `lib/shane/NotePicker.svelte:213` | the treble clef on the note picker’s mini staff | `fill (attribute)` | the staff svg paints no ground of its own (NotePicker.svelte:324), so the calibration takeover card: Drawer .takeover-frame: var(--drawer-bg) | --stone-700 (ΔL +0.042) |  |
| `lib/shane/NotePicker.svelte:222` | the bass clef curve (drawn fallback), note picker | `stroke (attribute)` | the staff svg paints no ground of its own (NotePicker.svelte:324), so the calibration takeover card: Drawer .takeover-frame: var(--drawer-bg) | --stone-700 (ΔL +0.042) |  |
| `lib/shane/NotePicker.svelte:225` | the bass clef upper dot (drawn fallback), note picker | `fill (attribute)` | the staff svg paints no ground of its own (NotePicker.svelte:324), so the calibration takeover card: Drawer .takeover-frame: var(--drawer-bg) | --stone-700 (ΔL +0.042) |  |
| `lib/shane/NotePicker.svelte:226` | the bass clef lower dot (drawn fallback), note picker | `fill (attribute)` | the staff svg paints no ground of its own (NotePicker.svelte:324), so the calibration takeover card: Drawer .takeover-frame: var(--drawer-bg) | --stone-700 (ΔL +0.042) |  |
| `lib/shane/NotePicker.svelte:228` | the treble clef stem (drawn fallback), note picker | `stroke (attribute)` | the staff svg paints no ground of its own (NotePicker.svelte:324), so the calibration takeover card: Drawer .takeover-frame: var(--drawer-bg) | --stone-700 (ΔL +0.042) |  |
| `lib/shane/NotePicker.svelte:229` | the treble clef loop (drawn fallback), note picker | `stroke (attribute)` | the staff svg paints no ground of its own (NotePicker.svelte:324), so the calibration takeover card: Drawer .takeover-frame: var(--drawer-bg) | --stone-700 (ΔL +0.042) |  |
| `lib/shane/NotePicker.svelte:239` | the ledger lines of the chosen note, note picker | `stroke (attribute)` | the staff svg paints no ground of its own (NotePicker.svelte:324), so the calibration takeover card: Drawer .takeover-frame: var(--drawer-bg) | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:1670` | the five staff lines, score renderer | `stroke (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:1684` | the bass clef (font glyph), score renderer | `` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:1687` | the bass clef curve (drawn fallback), score renderer | `stroke (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:1688` | the bass clef’s two dots (drawn fallback), score renderer | `fill (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) | ×2 on this line |
| `packages/score-parser/src/staff-renderer.ts:1694` | the treble clef (font glyph), score renderer | `` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:1697` | the treble clef stem (drawn fallback), score renderer | `stroke (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:1698` | the treble clef loop (drawn fallback), score renderer | `stroke (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:1700` | the little 8 under a tenor clef (drawn fallback), score renderer | `fill (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:1717` | the key signature (font glyph), score renderer | `` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:1719` | the key signature (text fallback), score renderer | `fill (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:1949` | the barline before a run of tacet bars, score renderer | `stroke (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:1958` | the whole-bar rest in a one-bar tacet (font glyph), score renderer | `` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:1960` | the whole-bar rest in a one-bar tacet (drawn fallback), score renderer | `fill (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:1988` | the left end of the multi-bar rest H-bar, score renderer | `` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:1994` | the stretched middle of the multi-bar rest H-bar, score renderer | `fill (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:1998` | the right end of the multi-bar rest H-bar, score renderer | `` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:2002` | a narrow multi-bar rest H-bar, whole glyph, score renderer | `` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:2008` | the multi-bar rest bar body (drawn fallback), score renderer | `fill (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:2010` | the multi-bar rest end caps (drawn fallback), score renderer | `fill (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:2032` | the bar-count numerals over a multi-bar rest (font glyph), score renderer | `fill (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:2039` | the bar-count numerals over a multi-bar rest (text fallback), score renderer | `fill (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:2053` | the barline between measures, score renderer | `stroke (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:2060` | a rest in the vocal line (font glyph), score renderer | `` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:2062` | a rest in the vocal line (drawn fallback), score renderer | `fill (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:2111` | the ledger lines of a sung note, score renderer | `` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:2801` | the thin line of the final double barline, score renderer | `stroke (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:2802` | the thick line of the final double barline, score renderer | `stroke (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |
| `packages/score-parser/src/staff-renderer.ts:2804` | the closing barline at the end of a system, score renderer | `stroke (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --stone-700 (ΔL +0.042) |  |

#### `--stone-600` · fallbacks only: #57534E · 7 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/IntakePanel.svelte:1173` | border of btn ghost e.g. “Start placement over” (drawer, Input band) | `border` | .intake: var(--paper-light) | --ink-secondary (ΔL −0.051) | undeclared token; the fallback paints |
| `lib/components/Drawer/RootPanel.svelte:230` | border of btn ghost e.g. “Export all songs”, “Export this song” (drawer, Piece band) | `border` | Drawer.svelte .group: var(--drawer-bg) | --ink-secondary (ΔL −0.051) | undeclared token; the fallback paints |
| `lib/components/Drawer/SongList.svelte:274` | border of song name input (drawer, song library) | `border` | own rule: white | --ink-secondary (ΔL −0.051) | undeclared token; the fallback paints |
| `lib/components/Drawer/SongList.svelte:300` | border of song btn on hover e.g. “Cancel” (drawer, song library) | `border-color` | Drawer.svelte .group: var(--drawer-bg) | --ink-secondary (ΔL −0.051) | undeclared token; the fallback paints |
| `lib/components/Drawer/SongList.svelte:325` | border of new btn “New song” (drawer, song library) | `border` | Drawer.svelte .group: var(--drawer-bg) | --ink-secondary (ΔL −0.051) | undeclared token; the fallback paints |
| `routes/+page.svelte:4974` | border of replace dialog (app shell, +page) | `border` | own rule: var(--paper-cream, #f5f0e6) | --ink-secondary (ΔL −0.051) | undeclared token; the fallback paints |
| `routes/+page.svelte:5016` | border of replace actions button (app shell, +page) | `border` | NOT ESTABLISHED | --ink-secondary (ΔL −0.051) | undeclared token; the fallback paints |


### 7.2 The other neutrals: ghosts, near-copies, white, and black

#### `#3C3A36` · #3C3A36, OKLCH L/C/H 0.349 / 0.007 / 85 · 3 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Reading/LearnContent.svelte:4095` | border of gt scroll (Learn glyph table) | `border` | ReadingPaper.svelte .reading-paper: var(--paper-cream, #F0EBE0) | #3A352F (ΔL −0.017) |  |
| `routes/+page.svelte:5055` | bottom border of gt table thead th (Learn glyph table, styled from +page.svelte) | `border-bottom` | NOT ESTABLISHED | #3A352F (ΔL −0.017) |  |
| `routes/+page.svelte:5064` | text of gt table thead th (Learn glyph table, styled from +page.svelte) | `color` | NOT ESTABLISHED | #3A352F (ΔL −0.017) |  |

#### `#8A8780` · #8A8780, OKLCH L/C/H 0.624 / 0.011 / 88 · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Reading/LearnContent.svelte:4078` | text of gt legend (Learn glyph table) | `color` | ReadingPaper.svelte .reading-paper: var(--paper-cream, #F0EBE0) | --stone-500 (ΔL −0.070) |  |
| `routes/+page.svelte:5083` | text of gt col sub (Learn glyph table, styled from +page.svelte) | `color` | NOT ESTABLISHED | --stone-500 (ΔL −0.070) |  |

#### `#96918A` · #96918A, OKLCH L/C/H 0.659 / 0.012 / 77 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `routes/+page.svelte:5164` | text of gt obsolete gt label (Learn glyph table, styled from +page.svelte) | `color` | NOT ESTABLISHED | --stone-500 (ΔL −0.105) |  |

#### `#A0A09B` · #A0A09B, OKLCH L/C/H 0.704 / 0.007 / 107 · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `routes/+page.svelte:5168` | bottom border of gt divider td (Learn glyph table, styled from +page.svelte) | `border-bottom` | NOT ESTABLISHED | --stone-500 (ΔL −0.151) |  |
| `routes/+page.svelte:5172` | text of gt divider td (Learn glyph table, styled from +page.svelte) | `color` | NOT ESTABLISHED | --stone-500 (ΔL −0.151) |  |

#### `#AAA8A0` · #AAA8A0, OKLCH L/C/H 0.731 / 0.012 / 95 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `routes/+page.svelte:5116` | text of gt num (Learn glyph table, styled from +page.svelte) | `color` | NOT ESTABLISHED | --stone-300 (ΔL +0.138) |  |

#### `#C8C8C3` · #C8C8C3, OKLCH L/C/H 0.831 / 0.007 / 107 · 3 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `routes/+page.svelte:5056` | right border of gt table thead th (Learn glyph table, styled from +page.svelte) | `border-right` | NOT ESTABLISHED | --stone-300 (ΔL +0.037) |  |
| `routes/+page.svelte:5093` | bottom border of gt table tbody tr (Learn glyph table, styled from +page.svelte) | `border-bottom` | NOT ESTABLISHED | --stone-300 (ΔL +0.037) |  |
| `routes/+page.svelte:5098` | right border of gt table td (Learn glyph table, styled from +page.svelte) | `border-right` | NOT ESTABLISHED | --stone-300 (ΔL +0.037) |  |

#### `#DDD9D4` · #DDD9D4, OKLCH L/C/H 0.887 / 0.008 / 74 · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `routes/fit-font-lab/+page.svelte:138` | border of lab chip (font lab developer route) | `border` | own rule: #f9f7f5 | --stone-300 (ΔL −0.018) |  |
| `routes/fit-font-lab/+page.svelte:174` | border of lab score (font lab developer route) | `border` | .lab-chip: #f9f7f5 | --stone-300 (ΔL −0.018) |  |

#### `#F5F0E8` · #F5F0E8, OKLCH L/C/H 0.957 / 0.012 / 80 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/InspectorPanel.svelte:2250` | fill of blurb box (drawer, word inspector) | `background` | .organism: rgba(139, 154, 125, 0.15) | --paper-light (ΔL +0.002) |  |

#### `#F8F6F0` · #F8F6F0, OKLCH L/C/H 0.973 / 0.008 / 91 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `routes/+page.svelte:5162` | fill of gt obsolete td (Learn glyph table, styled from +page.svelte) | `background` | NOT ESTABLISHED | --drawer-bg (ΔL +0.007) |  |

#### `#F9F7F5` · #F9F7F5, OKLCH L/C/H 0.977 / 0.003 / – · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `routes/fit-font-lab/+page.svelte:139` | fill of lab chip (font lab developer route) | `background` | .active: #1a1612 (in a state variant: .lab-chip.active) | --drawer-bg (ΔL +0.003) |  |
| `routes/fit-font-lab/+page.svelte:149` | text of lab chip active (font lab developer route) | `color` | own rule: #f9f7f5 | --drawer-bg (ΔL +0.003) |  |

#### `#FAF7F2` · #FAF7F2, OKLCH L/C/H 0.977 / 0.007 / 81 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/InspectorPanel.svelte:1954` | fill of atom selected (drawer, word inspector) | `background` | .organism: rgba(139, 154, 125, 0.15) | --drawer-bg (ΔL +0.003) |  |

#### `#FAF8F4` · #FAF8F4, OKLCH L/C/H 0.980 / 0.006 / 85 · 3 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/InspectorPanel.svelte:1939` | fill of atom on hover (drawer, word inspector) | `background` | .organism: rgba(139, 154, 125, 0.15) | --drawer-bg (ΔL +0.000) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1988` | fill of atom drag highlight (drawer, word inspector) | `background` | .organism: rgba(139, 154, 125, 0.15) | --drawer-bg (ΔL +0.000) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2350` | fill of provenance choice on hover e.g. “Dictionary” (drawer, word inspector) | `background` | .organism: rgba(139, 154, 125, 0.15) | --drawer-bg (ΔL +0.000) |  |

#### `#FDF6E8` · #FDF6E8, OKLCH L/C/H 0.975 / 0.020 / 85 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/InspectorPanel.svelte:1950` | fill of atom stressed vowel (drawer, word inspector) | `background` | .organism: rgba(139, 154, 125, 0.15) | --drawer-bg (ΔL +0.005) |  |

#### `#FDFBF6` · #FDFBF6, OKLCH L/C/H 0.988 / 0.007 / 89 · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Paper/ReadingPaper.svelte:129` | the light text on a Learn or Guide chapter-opening band (Learn and Guide reading sheet) | `color` | .band-learn: var(--dusty-rose) or .band-guide: var(--quiet-cobalt) (ReadingPaper.svelte:133 on) | --drawer-bg (ΔL −0.008) |  |
| `lib/components/Paper/ReadingPaper.svelte:202` | text of reading paper reading inner chapter band band learn h2 (Learn and Guide reading sheet) | `color` | NOT ESTABLISHED | --drawer-bg (ΔL −0.008) |  |

#### `#FFFFFF` · #FFFFFF, OKLCH L/C/H 1.000 / 0.000 / – · 74 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `app.css:256` | fill of body (global stylesheet) | `background` | print: white page | --drawer-bg (ΔL −0.020) | PRINT: inside `@media print` |
| `app.css:289` | fill of paper page (global stylesheet) | `background` | print: white page | --drawer-bg (ΔL −0.020) | PRINT: inside `@media print` |
| `lib/components/Drawer/Drawer.svelte:1136` | text of group band (drawer frame) | `color` | own rule: var(--lang-chip-guide) | --drawer-bg (ΔL −0.020) |  |
| `lib/components/Drawer/Drawer.svelte:1233` | focus outline of band toggle on keyboard focus (drawer frame) | `outline` | .group-band: var(--lang-chip-guide) | --drawer-bg (ΔL −0.020) |  |
| `lib/components/Drawer/Drawer.svelte:1311` | focus outline of band action on keyboard focus (drawer frame) | `outline` | .group-band: var(--lang-chip-guide) | --drawer-bg (ΔL −0.020) |  |
| `lib/components/Drawer/Drawer.svelte:1556` | text of takeover band “← Back” (drawer frame) | `color` | own rule: var(--lang-chip-marked) | --drawer-bg (ΔL −0.020) |  |
| `lib/components/Drawer/Drawer.svelte:1597` | text of takeover back “← Back” (drawer frame) | `color` | .takeover-band: var(--lang-chip-marked) | --drawer-bg (ΔL −0.020) |  |
| `lib/components/Drawer/Drawer.svelte:1609` | focus outline of takeover back on keyboard focus “← Back” (drawer frame) | `outline` | .takeover-band: var(--lang-chip-marked) | --drawer-bg (ΔL −0.020) |  |
| `lib/components/Drawer/InspectorPanel.svelte:421` | the open-book stroke inside the stress-source circle (dictionary stress) | `stroke (attribute)` | .stress-circle: var(--sage), the stress-source circle in the word inspector | --drawer-bg (ΔL −0.020) | ×2 on this line |
| `lib/components/Drawer/InspectorPanel.svelte:424` | the beamed-eighths icon inside the stress-source circle (composer stress), five shapes | `fill (attribute)` | .stress-circle: var(--sage), the stress-source circle in the word inspector | --drawer-bg (ΔL −0.020) | ×5 on this line |
| `lib/components/Drawer/InspectorPanel.svelte:427` | the torso icon inside the stress-source circle (singer override) | `fill (attribute)` | .stress-circle: var(--sage), the stress-source circle in the word inspector | --drawer-bg (ΔL −0.020) |  |
| `lib/components/Drawer/InspectorPanel.svelte:430` | the ? inside the stress-source circle (inferred stress) | `fill (attribute)` | .stress-circle: var(--sage), the stress-source circle in the word inspector | --drawer-bg (ΔL −0.020) |  |
| `lib/components/Drawer/InspectorPanel.svelte:432` | the open-book stroke inside the stress-source circle (default case) | `stroke (attribute)` | .stress-circle: var(--sage), the stress-source circle in the word inspector | --drawer-bg (ΔL −0.020) | ×2 on this line |
| `lib/components/Drawer/InspectorPanel.svelte:1509` | text of dict button “Dictionary” (drawer, word inspector) | `color` | own rule: var(--sage) | --drawer-bg (ΔL −0.020) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1592` | fill of dict edit cell (drawer, word inspector) | `background` | .dict-panel: var(--paper-cream, #FDFBF7) | --drawer-bg (ΔL −0.020) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1604` | fill of dict gloss input (drawer, word inspector) | `background` | .dict-edit-cell: #fff | --drawer-bg (ΔL −0.020) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1850` | text of yo sigla is yo sigil yo char (drawer, word inspector) | `color` | .yo-sigla: var(--sage) (in a state variant: .yo-sigla.is-yo) | --drawer-bg (ΔL −0.020) |  |
| `lib/components/Drawer/IntakePanel.svelte:835` | fill of syl box (drawer, Input band) | `background` | .intake: var(--paper-light) | --drawer-bg (ΔL −0.020) |  |
| `lib/components/Drawer/IntakePanel.svelte:1177` | text of btn primary “Loading dictionary…”, “Transcribe and fit” (drawer, Input band) | `color` | own rule: var(--sage) | --drawer-bg (ΔL −0.020) |  |
| `lib/components/Drawer/MetadataFields.svelte:209` | fill of meta input e.g. “Aria or song title”, “from score” (drawer, Piece band fields) | `background` | Drawer.svelte .group: var(--drawer-bg) | --drawer-bg (ΔL −0.020) |  |
| `lib/components/Drawer/NotationFields.svelte:331` | fill of toggle thumb (drawer, Notation station) | `background` | .toggle-switch: var(--stone-300) | --drawer-bg (ΔL −0.020) |  |
| `lib/components/Drawer/SearchableSelect.svelte:266` | fill of select trigger (drawer, composer and poet picker) | `background` | Drawer.svelte .group: var(--drawer-bg) | --drawer-bg (ΔL −0.020) |  |
| `lib/components/Drawer/SearchableSelect.svelte:326` | fill of select dropdown “Type to filter…” (drawer, composer and poet picker) | `background` | Drawer.svelte .group: var(--drawer-bg) | --drawer-bg (ΔL −0.020) |  |
| `lib/components/Drawer/SongList.svelte:273` | fill of song name input (drawer, song library) | `background` | Drawer.svelte .group: var(--drawer-bg) | --drawer-bg (ΔL −0.020) |  |
| `lib/components/Drawer/VoiceAnchor.svelte:113` | text of voice action (drawer, voice anchor line) | `color` | own rule: var(--deeper-lavender) | --drawer-bg (ΔL −0.020) |  |
| `lib/components/HeaderBar.svelte:120` | text of sigil bracket (header bar) | `color` | .header-bar: var(--sage, #8B9A7D) (in a state variant: .header-bar.tab-transcription) | --drawer-bg (ΔL −0.020) |  |
| `lib/components/HeaderBar.svelte:128` | text of sigil name (header bar) | `color` | .header-bar: var(--sage, #8B9A7D) (in a state variant: .header-bar.tab-transcription) | --drawer-bg (ΔL −0.020) |  |
| `lib/components/HeaderBar.svelte:194` | text of lang pill (header bar) | `color` | own rule: var(--lang-chip-transcription, #6C7A5F) | --drawer-bg (ΔL −0.020) |  |
| `lib/components/HeaderBar.svelte:244` | focus outline of lang pill on keyboard focus (header bar) | `outline` | own rule: var(--lang-chip-transcription, #6C7A5F) | --drawer-bg (ΔL −0.020) |  |
| `lib/components/InstallPrompt.svelte:197` | text of install btn primary (install banner) | `color` | own rule: var(--sage, #8B9A7D) | --drawer-bg (ΔL −0.020) |  |
| `lib/components/Paper/SubsequentPage.svelte:139` | fill of paper page (page 2 on) | `background` | +page.svelte .app-content: var(--desk-fill) | --drawer-bg (ΔL −0.020) | PRINT: inside `@media print` |
| `lib/components/Paper/TitlePage.svelte:246` | fill of paper page (title page) | `background` | +page.svelte .app-content: var(--desk-fill) | --drawer-bg (ΔL −0.020) | PRINT: inside `@media print` |
| `lib/components/Paper/WordStack.svelte:385` | fill of verify label “verify” (a word on the page) | `background` | SubsequentPage.svelte .paper-page: var(--paper-cream) \| TitlePage.svelte .paper-page: var(--paper-cream) \| ReadingAid.svelte .reading-aid: var(--paper-light, #F5F1E8) | --drawer-bg (ΔL −0.020) | PRINT: inside `@media print` |
| `lib/i18n.ts:703` | the Canadian flag in the English credit line (red bands and maple leaf, and the white centre) | `fill (attribute)` | wherever the credit line renders | --drawer-bg (ΔL −0.020) |  |
| `lib/i18n.ts:704` | the Canadian flag in the French credit line (red bands and maple leaf, and the white centre) | `fill (attribute)` | wherever the credit line renders | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/CalibrationWizard.svelte:1715` | text of wizard primary e.g. “Begin” (calibration takeover) | `color` | own rule: var(--deeper-lavender) | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/CalibrationWizard.svelte:1823` | text of wizard roster thead th (calibration takeover) | `color` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/CalibrationWizard.svelte:1900` | fill of wizard roster action button (calibration takeover) | `background` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/CalibrationWizard.svelte:2034` | fill of wizard hold actions button (calibration takeover) | `background` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/engine/page-pdf.ts:172` | the white canvas painted behind a PDF page before the reader scans it for ink (never shown on screen) | `ctx.fillStyle` | not shown | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/InsightsPane.svelte:725` | fill of paper page (Insights page) | `background` | +page.svelte .app-content: var(--desk-fill) via snippet content | --drawer-bg (ΔL −0.020) | PRINT: inside `@media print` |
| `lib/shane/NotePicker.svelte:319` | fill of np select (note picker) | `background` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/pacifier/contrast.ts:134` | not a paint: the pacifier contrast checker’s own copy of the token value, compared against app.css by contrast.test.ts | `` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/pacifier/contrast.ts:225` | not a paint: a contrast obligation naming white as the fill and background it measures against | `fillToken` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/pacifier/contrast.ts:225` | not a paint: a contrast obligation naming white as the fill and background it measures against | `backgroundToken` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/pacifier/contrast.ts:232` | not a paint: a contrast obligation naming white as the fill and background it measures against | `fillToken` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/pacifier/contrast.ts:232` | not a paint: a contrast obligation naming white as the fill and background it measures against | `backgroundToken` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/pacifier/contrast.ts:238` | not a paint: a contrast obligation naming white as the fill and background it measures against | `fillToken` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/pacifier/contrast.ts:238` | not a paint: a contrast obligation naming white as the fill and background it measures against | `backgroundToken` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/pacifier/contrast.ts:244` | not a paint: a contrast obligation naming white as the fill and background it measures against | `fillToken` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/pacifier/contrast.ts:244` | not a paint: a contrast obligation naming white as the fill and background it measures against | `backgroundToken` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/pacifier/contrast.ts:250` | not a paint: a contrast obligation naming white as the fill and background it measures against | `fillToken` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/pacifier/contrast.ts:250` | not a paint: a contrast obligation naming white as the fill and background it measures against | `backgroundToken` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/pacifier/contrast.ts:311` | not a paint: a contrast obligation naming white as the fill and background it measures against | `fillToken` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/pacifier/contrast.ts:311` | not a paint: a contrast obligation naming white as the fill and background it measures against | `backgroundToken` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/pacifier/contrast.ts:325` | not a paint: a contrast obligation naming white as the fill and background it measures against | `fillToken` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/pacifier/contrast.ts:325` | not a paint: a contrast obligation naming white as the fill and background it measures against | `backgroundToken` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/pacifier/contrast.ts:341` | not a paint: a contrast obligation naming white as the fill and background it measures against | `fillToken` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/pacifier/contrast.ts:341` | not a paint: a contrast obligation naming white as the fill and background it measures against | `backgroundToken` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/pacifier/Pacifier.svelte:793` | the white interior disc of each vowel node, calibration wheel | `fill (attribute)` | the pacifier band (--surround-shane) | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/pacifier/Pacifier.svelte:838` | the white disc behind a node’s badge (≈, ✓, ↻), calibration wheel | `fill (attribute)` | the node outline and the band | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/ProfileSwitcher.svelte:434` | fill of ps voice on hover (voice switcher) | `background` | .ps-panel: var(--drawer-bg) | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/ProfileSwitcher.svelte:466` | fill of ps verbs button (voice switcher) | `background` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/ProfileSwitcher.svelte:502` | fill of ps input (voice switcher) | `background` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/ProfileSwitcher.svelte:522` | text of ps primary e.g. “Start” (voice switcher) | `color` | own rule: var(--deeper-lavender) | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/ScoreUploader.svelte:1082` | text of btn primary e.g. “The score” (score upload) | `color` | own rule: var(--sage) | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/ScoreUploader.svelte:1088` | fill of btn secondary e.g. “Cancel” (score upload) | `background` | .ask: var(--paper-cream) | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/SyllableStation.svelte:244` | fill of slot is cursor (syllable placement station) | `background` | IntakePanel.svelte .intake: var(--paper-light) | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/VoiceProfilePane.svelte:665` | not a paint: a regex that strips the renderer’s white page rect so the Fit page shows through | `fill (attribute)` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `lib/shane/VoiceProfilePane.svelte:1610` | fill of paper page (Marked score page) | `background` | +page.svelte .app-content: var(--desk-fill) | --drawer-bg (ΔL −0.020) | PRINT: inside `@media print` |
| `routes/+page.svelte:5015` | fill of replace actions button (app shell, +page) | `background` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `routes/+page.svelte:5167` | fill of gt divider td (Learn glyph table, styled from +page.svelte) | `background` | NOT ESTABLISHED | --drawer-bg (ΔL −0.020) |  |
| `routes/+page.svelte:5814` | text of update toast action (app shell, +page) | `color` | own rule: var(--sage, #8a9b7e) | --drawer-bg (ΔL −0.020) |  |
| `packages/score-parser/src/page-layout.ts:365` | the white full-page backing rect of a paginated Fit page (stripped before display, VoiceProfilePane.svelte:665) | `fill (attribute)` | not shown in the Fit view | --drawer-bg (ΔL −0.020) |  |

#### `--border` · fallbacks only: #D4CEC8 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/InstallPrompt.svelte:218` | border of install btn ghost (install banner) | `border` | .install-prompt: var(--paper, #f5f0e8) | --stone-300 (ΔL +0.014) | undeclared token; the fallback paints |

#### `--border-light` · fallbacks only: #DDD9D4 · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Reading/GuideContent.svelte:569` | border of guide step figure (Guide text) | `border` | ReadingPaper.svelte .reading-paper: var(--paper-cream, #F0EBE0) | --stone-300 (ΔL −0.018) | undeclared token; the fallback paints |
| `lib/components/Reading/GuideContent.svelte:586` | top border of guide step figure figcaption (Guide text) | `border-top` | NOT ESTABLISHED | --stone-300 (ΔL −0.018) | undeclared token; the fallback paints |

#### `--ink` · fallbacks only: #1A1612 · 7 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/InstallPrompt.svelte:172` | text of install heading (install banner) | `color` | .install-prompt: var(--paper, #f5f0e8) | #3A352F (ΔL +0.129) | undeclared token; the fallback paints |
| `lib/shane/ScoreUploader.svelte:1120` | text of ask title e.g. “Is this picture the poem, or the score?”, “Is this PDF the poem, or the score?” (score upload) | `color` | .ask: var(--paper-cream) |  | undeclared token, no fallback: invalid at computed-value time, so the text inherits its parent’s colour |
| `lib/shane/ScoreUploader.svelte:1127` | text of ask why e.g. “Ilya cannot tell from the file itself. %…”, “Cancel” (score upload) | `color` | .ask: var(--paper-cream) |  | undeclared token, no fallback: invalid at computed-value time, so the text inherits its parent’s colour |
| `lib/shane/ScoreUploader.svelte:1139` | text of ask label e.g. “Clef” (score upload) | `color` | .ask: var(--paper-cream) |  | undeclared token, no fallback: invalid at computed-value time, so the text inherits its parent’s colour |
| `lib/shane/ScoreUploader.svelte:1151` | text of ask select (score upload) | `color` | own rule: var(--paper) |  | undeclared token, no fallback: invalid at computed-value time, so the text inherits its parent’s colour |
| `lib/shane/ScoreUploader.svelte:1162` | text of report line e.g. “%s systems, %s staves” (score upload) | `color` | .read-report: var(--paper-cream) |  | undeclared token, no fallback: invalid at computed-value time, so the text inherits its parent’s colour |
| `lib/shane/ScoreUploader.svelte:1166` | text of report sub e.g. “Pitch assumed on %s notes (measures %s).” (score upload) | `color` | .read-report: var(--paper-cream) |  | undeclared token, no fallback: invalid at computed-value time, so the text inherits its parent’s colour |

#### `--ink-soft` · no value · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/ScoreUploader.svelte:1127` | text of ask why e.g. “Ilya cannot tell from the file itself. %…”, “Cancel” (score upload) | `color` | .ask: var(--paper-cream) |  | undeclared token, and its fallback var(--ink) is undeclared too: invalid at computed-value time, so the text inherits its parent’s colour |
| `lib/shane/ScoreUploader.svelte:1162` | text of report line e.g. “%s systems, %s staves” (score upload) | `color` | .read-report: var(--paper-cream) |  | undeclared token, and its fallback var(--ink) is undeclared too: invalid at computed-value time, so the text inherits its parent’s colour |

#### `--paper` · fallbacks only: #F5F0E8, #FAF7F2 · 3 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/InstallPrompt.svelte:152` | fill of install prompt (install banner) | `background` | NOT ESTABLISHED | --paper-light (ΔL +0.002) | undeclared token; the fallback paints |
| `lib/shane/ScoreUploader.svelte:1152` | fill of ask select (score upload) | `background` | .ask: var(--paper-cream) |  | undeclared token, no fallback: invalid at computed-value time, so the property takes its initial value (no border, no fill) |
| `routes/+page.svelte:5794` | fill of update toast “A new version of Ilya is ready.” (app shell, +page) | `background` | NOT ESTABLISHED | --drawer-bg (ΔL +0.003) | undeclared token; the fallback paints |

#### `--rule` · no value · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/ScoreUploader.svelte:1110` | border of ask e.g. “Is this picture the poem, or the score?”, “Is this PDF the poem, or the score?” (score upload) | `border` | own rule: var(--paper-cream) |  | undeclared token, no fallback: invalid at computed-value time, so the property takes its initial value (no border, no fill) |
| `lib/shane/ScoreUploader.svelte:1153` | border of ask select (score upload) | `border` | own rule: var(--paper) |  | undeclared token, no fallback: invalid at computed-value time, so the property takes its initial value (no border, no fill) |

#### `--stone-200` · fallbacks only: #E7E5E4 · 4 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/InspectorPanel.svelte:1874` | top border of yo chooser wrapper “ё ↔ е” (drawer, word inspector) | `border-top` | .organism: rgba(139, 154, 125, 0.15) | --paper-cream (ΔL +0.018) | undeclared token; the fallback paints |
| `lib/components/Drawer/InspectorPanel.svelte:1895` | top border of stress chooser wrapper “Syllable” (drawer, word inspector) | `border-top` | .organism: rgba(139, 154, 125, 0.15) | --paper-cream (ΔL +0.018) | undeclared token; the fallback paints |
| `lib/components/Drawer/InspectorPanel.svelte:2117` | border of clitic atom (drawer, word inspector) | `border` | .organism: rgba(139, 154, 125, 0.15) | --paper-cream (ΔL +0.018) | undeclared token; the fallback paints |
| `lib/components/Paper/ReadingPaper.svelte:445` | bottom border of reading inner td (Learn and Guide reading sheet) | `border-bottom` | NOT ESTABLISHED | --paper-cream (ΔL +0.018) | undeclared token; the fallback paints |

#### `--stone-400` · fallbacks only: #A8A29E · 4 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/InspectorPanel.svelte:1454` | border of word stack (drawer, word inspector) | `border` | own rule: var(--paper-cream) | --stone-300 (ΔL +0.153) | undeclared token; the fallback paints |
| `lib/components/Drawer/InspectorPanel.svelte:1794` | border of molecule (drawer, word inspector) | `border` | .is-stressed: var(--sage) (in a state variant: .stress-circle.is-stressed) | --stone-300 (ΔL +0.153) | undeclared token; the fallback paints |
| `lib/components/Drawer/InspectorPanel.svelte:2128` | text of atom arrow icon (drawer, word inspector) | `color` | .atom: var(--paper-cream) | --stone-300 (ΔL +0.153) | undeclared token; the fallback paints |
| `lib/components/Drawer/InspectorPanel.svelte:2402` | border of reset button (drawer, word inspector) | `border` | own rule: var(--paper-cream) | --stone-300 (ΔL +0.153) | undeclared token; the fallback paints |

#### `--surface-subtle` · fallbacks only: #EDE8E0, #F9F7F5 · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/InstallPrompt.svelte:224` | fill of install btn ghost on hover (install banner) | `background` | .install-prompt: var(--paper, #f5f0e8) | --paper-cream (ΔL +0.008) | undeclared token; the fallback paints |
| `lib/components/Reading/GuideContent.svelte:585` | fill of guide step figure figcaption (Guide text) | `background` | NOT ESTABLISHED | --drawer-bg (ΔL +0.003) | undeclared token; the fallback paints |

#### `rgba of #000000` · #000000, OKLCH L/C/H 0.000 / 0.000 / – · 12 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/NotationFields.svelte:333` | shadow of toggle thumb (drawer, Notation station) | `box-shadow` | own rule: white | --ink-primary (ΔL +0.203) | alpha 0.15 |
| `lib/components/Drawer/SearchableSelect.svelte:329` | shadow of select dropdown “Type to filter…” (drawer, composer and poet picker) | `box-shadow` | own rule: white | --ink-primary (ΔL +0.203) | alpha 0.1 |
| `lib/components/Drawer/SongList.svelte:250` | fill of song open on hover (drawer, song library) | `background` | Drawer.svelte .group: var(--drawer-bg) | --ink-primary (ΔL +0.203) | alpha 0.04 |
| `lib/components/Drawer/SongList.svelte:263` | fill of is open song open (drawer, song library) | `background` | Drawer.svelte .group: var(--drawer-bg) | --ink-primary (ΔL +0.203) | alpha 0.03 |
| `lib/components/InstallPrompt.svelte:155` | shadow of install prompt (install banner) | `box-shadow` | own rule: var(--paper, #f5f0e8) | --ink-primary (ΔL +0.203) | alpha 0.12 |
| `lib/components/Paper/ReadingPaper.svelte:49` | shadow of reading paper (Learn and Guide reading sheet) | `box-shadow` | own rule: var(--paper-cream, #F0EBE0) | --ink-primary (ΔL +0.203) | alpha 0.35 |
| `lib/components/Paper/SubsequentPage.svelte:105` | shadow of paper page (page 2 on) | `box-shadow` | own rule: var(--paper-cream) | --ink-primary (ΔL +0.203) | alpha 0.35 |
| `lib/components/Paper/TitlePage.svelte:187` | shadow of paper page (title page) | `box-shadow` | own rule: var(--paper-cream) | --ink-primary (ΔL +0.203) | alpha 0.35 |
| `lib/shane/InsightsPane.svelte:461` | shadow of paper page (Insights page) | `box-shadow` | own rule: var(--paper-cream) | --ink-primary (ΔL +0.203) | alpha 0.35 |
| `lib/shane/ScoreUploader.svelte:1040` | fill of note “Try another file” (score upload) | `background` | Drawer.svelte .group: var(--drawer-bg) | --ink-primary (ΔL +0.203) | alpha 0.03 |
| `lib/shane/VoiceProfilePane.svelte:1336` | shadow of paper page (Marked score page) | `box-shadow` | own rule: var(--paper-cream) | --ink-primary (ΔL +0.203) | alpha 0.35 |
| `routes/+page.svelte:4981` | fill of replace dialog::backdrop (app shell, +page) | `background` | NOT ESTABLISHED | --ink-primary (ΔL +0.203) | alpha 0.45 |

#### `rgba of #1A1612` · #1A1612, OKLCH L/C/H 0.203 / 0.010 / 67 · 8 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/DeskHead.svelte:218` | fill of pair member not active on hover (desk head, the document switch above the page) | `background` | .active: var(--paper-cream, #F0EBE0) (in a state variant: .pair-member.active) | #3A352F (ΔL +0.129) | alpha 0.06 |
| `lib/components/Drawer/Drawer.svelte:1398` | top border of group station (drawer frame) | `border-top` | +page.svelte .app-content: var(--desk-fill) | #3A352F (ΔL +0.129) | alpha 0.1 |
| `lib/components/Drawer/Drawer.svelte:1703` | top border of drawer pull (drawer frame) | `border-top` | own rule: var(--drawer-bg, #FAF8F5) | #3A352F (ΔL +0.129) | alpha 0.1 |
| `lib/components/Drawer/InspectorPanel.svelte:2030` | shadow of drag ghost (drawer, word inspector) | `box-shadow` | own rule: var(--paper-cream) | #3A352F (ΔL +0.129) | alpha 0.12 |
| `lib/components/Drawer/InspectorPanel.svelte:2257` | shadow of blurb box (drawer, word inspector) | `box-shadow` | own rule: #F5F0E8 | #3A352F (ΔL +0.129) | alpha 0.08 |
| `lib/components/Drawer/IntakePanel.svelte:731` | border of intake “Source” (drawer, Input band) | `border` | own rule: var(--paper-light) | #3A352F (ΔL +0.129) | alpha 0.28 |
| `lib/components/Drawer/IntakePanel.svelte:772` | bottom border of intake receipt e.g. “poem”, “%s lines” (drawer, Input band) | `border-bottom` | .intake: var(--paper-light) | #3A352F (ΔL +0.129) | alpha 0.08 |
| `routes/+page.svelte:5304` | fill of sheet print btn on hover “Print” (app shell, +page) | `background` | .app-content: var(--desk-fill) | #3A352F (ΔL +0.129) | alpha 0.06 |

#### `rgba of #282623` · #282623, OKLCH L/C/H 0.270 / 0.006 / 78 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `routes/+page.svelte:5797` | shadow of update toast “A new version of Ilya is ready.” (app shell, +page) | `box-shadow` | own rule: var(--paper, #faf7f2) | #3A352F (ΔL +0.062) | alpha 0.18 |

#### `rgba of #2E2A26` · #2E2A26, OKLCH L/C/H 0.288 / 0.009 / 67 · 5 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/CorrectionSurface.svelte:870` | shadow of dock tight (correction stations) | `box-shadow` | own rule: var(--drawer-bg, #faf8f5) | #3A352F (ΔL +0.044) | alpha 0.08 |
| `lib/shane/CorrectionSurface.svelte:879` | shadow of dock portrait (correction stations) | `box-shadow` | own rule: var(--drawer-bg, #faf8f5) | #3A352F (ΔL +0.044) | alpha 0.08 |
| `lib/shane/Loupe.svelte:956` |  of loupe (loupe) | `` | own rule: var(--paper-light, #f5f1e8) | #3A352F (ΔL +0.044) | alpha 0.2 |
| `lib/shane/Loupe.svelte:957` |  of loupe (loupe) | `` | own rule: var(--paper-light, #f5f1e8) | #3A352F (ΔL +0.044) | alpha 0.13 |
| `lib/shane/Loupe.svelte:958` |  of loupe (loupe) | `` | own rule: var(--paper-light, #f5f1e8) | #3A352F (ΔL +0.044) | alpha 0.07 |

#### `rgba of #FFFFFF` · #FFFFFF, OKLCH L/C/H 1.000 / 0.000 / – · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/HeaderBar.svelte:138` | text of sigil version (header bar) | `color` | own rule: var(--deeper-sage, #7A8A6C) | --drawer-bg (ΔL −0.020) | alpha 0.8 |
| `lib/components/HeaderBar.svelte:220` | shadow of tab guide lang pill (header bar) | `box-shadow` | own rule: var(--lang-chip-transcription, #6C7A5F) | --drawer-bg (ΔL −0.020) | alpha 0.22 |


### 7.3 Lavender

#### `--deeper-lavender` · #8E7E9B, OKLCH L/C/H 0.618 / 0.047 / 310 · 26 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/Drawer.svelte:1201` | outline of group score on keyboard focus (drawer frame) | `outline-color` | NOT ESTABLISHED | --lang-chip-marked (ΔL −0.051) |  |
| `lib/components/Drawer/VoiceAnchor.svelte:77` | fill of voice dot (drawer, voice anchor line) | `background` | Drawer.svelte .group: var(--drawer-bg) | --lang-chip-marked (ΔL −0.051) |  |
| `lib/components/Drawer/VoiceAnchor.svelte:114` | fill of voice action (drawer, voice anchor line) | `background` | Drawer.svelte .group: var(--drawer-bg) | --lang-chip-marked (ΔL −0.051) |  |
| `lib/components/HeaderBar.svelte:94` | the header bar’s fill on Marked score (header bar) | `background` | the body ground, app.css:207; the bar is the top edge of the app | --lang-chip-marked (ΔL −0.051) |  |
| `lib/shane/CalibrationWizard.svelte:1637` | top border of wizard phase e.g. “Finding Your Resonances”, “Fit will measure your voice to build a f…” (calibration takeover) | `border-top` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --lang-chip-marked (ΔL −0.051) |  |
| `lib/shane/CalibrationWizard.svelte:1648` | text of wizard phase h2 (calibration takeover) | `color` | NOT ESTABLISHED | --lang-chip-marked (ΔL −0.051) |  |
| `lib/shane/CalibrationWizard.svelte:1714` | fill of wizard primary e.g. “Begin” (calibration takeover) | `background` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --lang-chip-marked (ΔL −0.051) |  |
| `lib/shane/CalibrationWizard.svelte:1727` | border of wizard secondary on hover e.g. “Sing the three Ilya derived for you” (calibration takeover) | `border-color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --lang-chip-marked (ΔL −0.051) |  |
| `lib/shane/CalibrationWizard.svelte:1728` | text of wizard secondary on hover e.g. “Sing the three Ilya derived for you” (calibration takeover) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --lang-chip-marked (ΔL −0.051) |  |
| `lib/shane/CalibrationWizard.svelte:1822` | fill of wizard roster thead th (calibration takeover) | `background` | NOT ESTABLISHED | --lang-chip-marked (ΔL −0.051) |  |
| `lib/shane/CorrectionSurface.svelte:825` | top border of surface panel (correction stations) | `border-top` | Drawer.svelte .group: var(--drawer-bg) | --lang-chip-marked (ΔL −0.051) |  |
| `lib/shane/CorrectionSurface.svelte:960` | text of surface header “Corrections” (correction stations) | `color` | Drawer.svelte .group: var(--drawer-bg) | --lang-chip-marked (ΔL −0.051) |  |
| `lib/shane/CorrectionSurface.svelte:983` | text of station label e.g. “Duration”, “Tuplet” (correction stations) | `color` | Drawer.svelte .group: var(--drawer-bg) | --lang-chip-marked (ΔL −0.051) |  |
| `lib/shane/CorrectionSurface.svelte:1048` | border of cell engaged (correction stations) | `border-color` | own rule: var(--paper-light, #f5f1e8) | --lang-chip-marked (ΔL −0.051) |  |
| `lib/shane/CorrectionSurface.svelte:1049` | text of cell engaged (correction stations) | `color` | own rule: var(--paper-light, #f5f1e8) | --lang-chip-marked (ΔL −0.051) |  |
| `lib/shane/CorrectionSurface.svelte:1059` | focus outline of cell on keyboard focus (correction stations) | `outline` | own rule: var(--paper-light, #f5f1e8) | --lang-chip-marked (ΔL −0.051) |  |
| `lib/shane/CorrectionSurface.svelte:1194` | text of back “Duration”, “Tuplet” (correction stations) | `color` | Drawer.svelte .group: var(--drawer-bg) | --lang-chip-marked (ΔL −0.051) |  |
| `lib/shane/pacifier/Pacifier.svelte:715` | the outline ring of a captured vowel node, calibration wheel | `stroke (attribute)` | the vowel node’s white interior (Pacifier.svelte:793) | --lang-chip-marked (ΔL −0.051) |  |
| `lib/shane/pacifier/Pacifier.svelte:723` | the outline ring of a provisional (retake) vowel node, calibration wheel | `stroke (attribute)` | the vowel node’s white interior (Pacifier.svelte:793) | --lang-chip-marked (ΔL −0.051) |  |
| `lib/shane/pacifier/Pacifier.svelte:905` | the node outline at rest before and after the good-take flash (calibration wheel) | `stroke` | the pacifier band and the node’s white interior | --lang-chip-marked (ΔL −0.051) |  |
| `lib/shane/pacifier/Pacifier.svelte:914` | the node outline between the green beats of the good-take flash (calibration wheel) | `stroke` | the pacifier band and the node’s white interior | --lang-chip-marked (ΔL −0.051) |  |
| `lib/shane/pacifier/Pacifier.svelte:920` | the node outline at rest before and after the retake flash (calibration wheel) | `stroke` | the pacifier band and the node’s white interior | --lang-chip-marked (ΔL −0.051) |  |
| `lib/shane/pacifier/Pacifier.svelte:929` | the node outline between the red beats of the retake flash (calibration wheel) | `stroke` | the pacifier band and the node’s white interior | --lang-chip-marked (ΔL −0.051) |  |
| `lib/shane/ProfileSwitcher.svelte:521` | fill of ps primary e.g. “Start” (voice switcher) | `background` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --lang-chip-marked (ΔL −0.051) |  |
| `lib/shane/VoiceProfilePane.svelte:1314` | stroke of rect [selection ring] (Marked score page) | `stroke` | NOT ESTABLISHED | --lang-chip-marked (ΔL −0.051) |  |
| `routes/+page.svelte:4933` | outline of takeover panel on keyboard focus (app shell, +page) | `outline-color` | NOT ESTABLISHED | --lang-chip-marked (ΔL −0.051) |  |

#### `#8E7E9B` · #8E7E9B, OKLCH L/C/H 0.618 / 0.047 / 310 · 19 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/IntakePanel.svelte:836` | border of syl box (drawer, Input band) | `border` | own rule: #ffffff | --lang-chip-marked (ΔL −0.051) | same value as --deeper-lavender |
| `lib/shane/pacifier/contrast.ts:128` | not a paint: the pacifier contrast checker’s own copy of the token value, compared against app.css by contrast.test.ts | `` | NOT ESTABLISHED | --lang-chip-marked (ΔL −0.051) | same value as --deeper-lavender |
| `lib/shane/SyllableStation.svelte:245` | border of slot is cursor (syllable placement station) | `border` | own rule: #FFFFFF (in a state variant: .slot.is-cursor) | --lang-chip-marked (ΔL −0.051) | same value as --deeper-lavender |
| `lib/shane/SyllableStation.svelte:257` | focus outline of slot on keyboard focus (syllable placement station) | `outline` | own rule: #FFFFFF (in a state variant: .slot.is-cursor) | --lang-chip-marked (ΔL −0.051) | same value as --deeper-lavender |
| `lib/shane/VoiceProfilePane.svelte:1137` | the version badge in the Fit title block (page one) | `versionAccent` | VoiceProfilePane .paper-page: var(--paper-cream) | --lang-chip-marked (ΔL −0.051) | same value as --deeper-lavender |
| `lib/shane/VoiceProfilePane.svelte:1138` | the mark in the Fit title block (page one) | `markAccent` | VoiceProfilePane .paper-page: var(--paper-cream) | --lang-chip-marked (ΔL −0.051) | same value as --deeper-lavender |
| `lib/shane/VoiceProfilePane.svelte:1139` | the rule under the Fit title block (page one) | `ruleAccent` | VoiceProfilePane .paper-page: var(--paper-cream) | --lang-chip-marked (ΔL −0.051) | same value as --deeper-lavender |
| `lib/shane/VoiceProfilePane.svelte:1151` | the footer hairline on each Fit score page | `hairlineAccent` | VoiceProfilePane .paper-page: var(--paper-cream) | --lang-chip-marked (ΔL −0.051) | same value as --deeper-lavender |
| `lib/shane/VoiceProfilePane.svelte:1196` | the footer hairline on the Fit watch-list page | `hairlineAccent` | VoiceProfilePane .paper-page: var(--paper-cream) | --lang-chip-marked (ΔL −0.051) | same value as --deeper-lavender |
| `lib/shane/VoiceProfilePane.svelte:1244` | the version badge in the Fit title block (interim states) | `versionAccent` | VoiceProfilePane .paper-page: var(--paper-cream) | --lang-chip-marked (ΔL −0.051) | same value as --deeper-lavender |
| `lib/shane/VoiceProfilePane.svelte:1245` | the mark in the Fit title block (interim states) | `markAccent` | VoiceProfilePane .paper-page: var(--paper-cream) | --lang-chip-marked (ΔL −0.051) | same value as --deeper-lavender |
| `lib/shane/VoiceProfilePane.svelte:1246` | the rule under the Fit title block (interim states) | `ruleAccent` | VoiceProfilePane .paper-page: var(--paper-cream) | --lang-chip-marked (ΔL −0.051) | same value as --deeper-lavender |
| `lib/shane/VoiceProfilePane.svelte:1279` | the footer hairline on the Fit interim page | `hairlineAccent` | VoiceProfilePane .paper-page: var(--paper-cream) | --lang-chip-marked (ΔL −0.051) | same value as --deeper-lavender |
| `lib/shane/VoiceProfilePane.svelte:1485` | border of withheld (Marked score page) | `border` | own rule: var(--paper-cream) | --lang-chip-marked (ΔL −0.051) | same value as --deeper-lavender |
| `lib/shane/VoiceProfilePane.svelte:1497` | text of withheld heading (Marked score page) | `color` | .withheld: var(--paper-cream) | --lang-chip-marked (ΔL −0.051) | same value as --deeper-lavender |
| `lib/shane/VoiceProfilePane.svelte:1535` | border of watch band (Marked score page) | `border` | own rule: var(--paper-cream) | --lang-chip-marked (ΔL −0.051) | same value as --deeper-lavender |
| `lib/shane/VoiceProfilePane.svelte:1547` | text of watch band header (Marked score page) | `color` | .watch-band: var(--paper-cream) | --lang-chip-marked (ΔL −0.051) | same value as --deeper-lavender |
| `packages/score-parser/src/staff-renderer.ts:85` | the withheld-sigla glyph’s colour constant, score renderer | `colour` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --lang-chip-marked (ΔL −0.051) | same value as --deeper-lavender |
| `packages/score-parser/src/staff-renderer.ts:626` | the turning-pitch layer (turning accidentals and their ledger lines), score renderer | `TURNING_COLOUR` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --lang-chip-marked (ΔL −0.051) | same value as --deeper-lavender |

#### `--fit-accent` · fallbacks only: #8E7E9B · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/TextualWitnesses.svelte:177` | text of measure link “m.” (drawer, Textual witnesses) | `color` | NOT ESTABLISHED | --lang-chip-marked (ΔL −0.051) | undeclared token; the fallback paints |

#### `--lang-chip-marked` · #806E8E, OKLCH L/C/H 0.567 / 0.053 / 310 · 3 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/Drawer.svelte:1192` | fill of group score group band (drawer frame) | `background` | .drawer: var(--desk-fill, var(--desk-surface, #D8D4C8)) | --deeper-lavender (ΔL +0.051) |  |
| `lib/components/Drawer/Drawer.svelte:1555` | fill of takeover band “← Back” (drawer frame) | `background` | .takeover-frame: var(--drawer-bg) | --deeper-lavender (ΔL +0.051) |  |
| `lib/components/HeaderBar.svelte:224` | fill of tab shane lang pill (header bar) | `background` | .header-bar: var(--sage, #8B9A7D) (in a state variant: .header-bar.tab-transcription) | --deeper-lavender (ΔL +0.051) |  |

#### `#74677F` · #74677F, OKLCH L/C/H 0.535 / 0.040 / 309 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/HeaderBar.svelte:165` | fill of tab shane sigil version (header bar) | `background` | .header-bar: var(--sage, #8B9A7D) (in a state variant: .header-bar.tab-transcription) | --lang-chip-marked (ΔL +0.032) |  |

#### `--surround-marked` · #D2CBD7, OKLCH L/C/H 0.851 / 0.018 / 312 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `routes/+page.svelte:5370` | declares --desk-fill (app shell, +page) | `--desk-fill` | own rule: var(--desk-fill) | --stone-300 (ΔL +0.017) |  |

#### `--surround-shane` · #D8D0E0, OKLCH L/C/H 0.869 / 0.023 / 308 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/pacifier/Pacifier.svelte:758` | the broad lavender band the vowel nodes sit on, calibration wheel | `stroke (attribute)` | Drawer .takeover-frame: var(--drawer-bg) | --surround-marked (ΔL −0.017) |  |

#### `#D8D0E0` · #D8D0E0, OKLCH L/C/H 0.869 / 0.023 / 308 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/pacifier/contrast.ts:129` | not a paint: the pacifier contrast checker’s own copy of the token value, compared against app.css by contrast.test.ts | `` | NOT ESTABLISHED | --surround-marked (ΔL −0.017) | same value as --surround-shane |

#### `--muted-lavender` · #A89BB5, OKLCH L/C/H 0.709 / 0.040 / 308 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `routes/+page.svelte:5795` | border of update toast “A new version of Ilya is ready.” (app shell, +page) | `border` | own rule: var(--paper, #faf7f2) | --light-sage (ΔL +0.048) |  |

#### `#A89BB5` · #A89BB5, OKLCH L/C/H 0.709 / 0.040 / 308 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/pacifier/contrast.ts:126` | not a paint: the pacifier contrast checker’s own copy of the token value, compared against app.css by contrast.test.ts | `` | NOT ESTABLISHED | --light-sage (ΔL +0.048) | same value as --muted-lavender |

#### `#C4BACF` · #C4BACF, OKLCH L/C/H 0.804 / 0.031 / 307 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/pacifier/contrast.ts:127` | not a paint: the pacifier contrast checker’s own copy of the token value, compared against app.css by contrast.test.ts | `` | NOT ESTABLISHED | --surround-guide (ΔL +0.024) | same value as --light-lavender |

#### `#7C6BB0` · #7C6BB0, OKLCH L/C/H 0.573 / 0.105 / 294 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/ScoreUploader.svelte:996` | left border of banner “Read from a picture. Ilya worked the not…”, “Converted from Finale format by denigma.…” (score upload) | `border-left` | own rule: rgba(124, 107, 176, 0.08) | --lang-chip-marked (ΔL −0.006) |  |

#### `rgba of #7C6BB0` · #7C6BB0, OKLCH L/C/H 0.573 / 0.105 / 294 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/ScoreUploader.svelte:997` | fill of banner “Read from a picture. Ilya worked the not…”, “Converted from Finale format by denigma.…” (score upload) | `background` | Drawer.svelte .group: var(--drawer-bg) | --lang-chip-marked (ΔL −0.006) | alpha 0.08 |


### 7.4 Sage

#### `--sage` · #8B9A7D, OKLCH L/C/H 0.666 / 0.045 / 130 · 86 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `app.css:181` | declares --color-accent (global stylesheet) | `--color-accent` | NOT ESTABLISHED | --deeper-sage (ΔL −0.054) |  |
| `app.css:216` | focus outline of on keyboard focus (global stylesheet) | `outline` | NOT ESTABLISHED | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/AnalysisStation.svelte:134` | text of result summary (drawer, Analysis station) | `color` | Drawer.svelte .group: var(--drawer-bg) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/AnalysisStation.svelte:189` | fill of dict progress fill (drawer, Analysis station) | `background` | .dict-progress-track: var(--stone-300) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/Drawer.svelte:1824` | focus outline of toc link on keyboard focus (drawer frame) | `outline` | own rule: rgba(166, 123, 123, 0.08) (in a state variant: .toc-link.active) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/Drawer.svelte:1959` | focus outline of toc chevron on keyboard focus (drawer frame) | `outline` | .drawer: var(--desk-fill, var(--desk-surface, #D8D4C8)) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1027` | the caret pointing up at the word from the dictionary panel | `fill (attribute)` | Drawer .group: var(--drawer-bg) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1358` | the caret pointing up at the character from the blurb panel | `fill (attribute)` | Drawer .group: var(--drawer-bg) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1481` | text of word gloss (drawer, word inspector) | `color` | Drawer.svelte .group: var(--drawer-bg) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1508` | fill of dict button “Dictionary” (drawer, word inspector) | `background` | .word-stack: var(--paper-cream) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1526` | focus outline of dict button on keyboard focus “Dictionary” (drawer, word inspector) | `outline` | own rule: var(--sage) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1575` | fill of dict lip (drawer, word inspector) | `background` | Drawer.svelte .group: var(--drawer-bg) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1581` | border of dict panel (drawer, word inspector) | `border` | own rule: var(--paper-cream, #FDFBF7) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1600` | text of dict gloss input (drawer, word inspector) | `color` | own rule: #fff | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1602` | border of dict gloss input (drawer, word inspector) | `border` | own rule: #fff | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1611` | border of dict gloss input on focus (drawer, word inspector) | `border-color` | own rule: #fff | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1612` | shadow of dict gloss input on focus (drawer, word inspector) | `box-shadow` | own rule: #fff | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1618` | text of dict capacity “Maximum 20 characters” (drawer, word inspector) | `color` | .dict-edit-cell: #fff | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1625` | fill of dict separator “Full entry unavailable” (drawer, word inspector) | `background` | .dict-panel: var(--paper-cream, #FDFBF7) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1658` | fill of dict entry option on hover (drawer, word inspector) | `background` | .dict-entry-cell: #F0F3EE | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1662` | focus outline of dict entry option on keyboard focus (drawer, word inspector) | `outline` | .dict-entry-cell: #F0F3EE | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1716` | text of dict entry missing e.g. “Full entry unavailable” (drawer, word inspector) | `color` | .dict-entry-cell: #F0F3EE | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1722` | fill of dict entry divider (drawer, word inspector) | `background` | .dict-entry-cell: #F0F3EE | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1800` | border of molecule is stressed (drawer, word inspector) | `border` | .is-stressed: var(--sage) (in a state variant: .stress-circle.is-stressed) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1833` | focus outline of yo sigla on keyboard focus (drawer, word inspector) | `outline` | own rule: var(--sage) (in a state variant: .yo-sigla.is-yo) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1840` | border of yo sigla pending (drawer, word inspector) | `border-color` | own rule: var(--sage) (in a state variant: .yo-sigla.is-yo) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1845` | fill of yo sigla is yo (drawer, word inspector) | `background` | .is-yo: var(--sage) (in a state variant: .yo-sigla.is-yo) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1846` | border of yo sigla is yo (drawer, word inspector) | `border-color` | own rule: var(--sage) (in a state variant: .yo-sigla.is-yo) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1859` | border of yo sigla toggled (drawer, word inspector) | `border-color` | own rule: var(--sage) (in a state variant: .yo-sigla.is-yo) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1940` | border of atom on hover (drawer, word inspector) | `border-color` | own rule: var(--paper-cream) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1944` | focus outline of atom on keyboard focus (drawer, word inspector) | `outline` | own rule: var(--paper-cream) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1955` | border of atom selected (drawer, word inspector) | `border-color` | own rule: var(--paper-cream) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1966` | fill of atom has blurb (after mark) (drawer, word inspector) | `background` | .organism: rgba(139, 154, 125, 0.15) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:1987` | border of atom drag highlight (drawer, word inspector) | `border-color` | own rule: var(--paper-cream) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2024` | border of drag ghost (drawer, word inspector) | `border` | own rule: var(--paper-cream) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2175` | border of stress circle on hover (drawer, word inspector) | `border-color` | own rule: var(--sage) (in a state variant: .stress-circle.is-stressed) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2179` | fill of stress circle is stressed (drawer, word inspector) | `background` | .is-stressed: var(--sage) (in a state variant: .stress-circle.is-stressed) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2180` | border of stress circle is stressed (drawer, word inspector) | `border-color` | own rule: var(--sage) (in a state variant: .stress-circle.is-stressed) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2190` | border of stress circle is assigning (drawer, word inspector) | `border-color` | own rule: var(--sage) (in a state variant: .stress-circle.is-stressed) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2245` | fill of blurb lip (drawer, word inspector) | `background` | .organism: rgba(139, 154, 125, 0.15) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2251` | border of blurb box (drawer, word inspector) | `border` | own rule: #F5F0E8 | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2349` | border of provenance choice on hover e.g. “Dictionary” (drawer, word inspector) | `border-color` | own rule: var(--paper-cream) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2374` | control accent of spot checkbox (drawer, word inspector) | `accent-color` | Drawer.svelte .group: var(--drawer-bg) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2414` | border of reset button on hover (drawer, word inspector) | `border-color` | own rule: var(--paper-cream) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2415` | text of reset button on hover (drawer, word inspector) | `color` | own rule: var(--paper-cream) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2419` | focus outline of reset button on keyboard focus (drawer, word inspector) | `outline` | own rule: var(--paper-cream) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/IntakePanel.svelte:1027` | border of text input “Paste, type, or drop your poem here.” (drawer, Input band) | `border` | .intake: var(--paper-light) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/IntakePanel.svelte:1178` | fill of btn primary “Loading dictionary…”, “Transcribe and fit” (drawer, Input band) | `background` | Drawer.svelte .group: var(--drawer-bg) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/NotationFields.svelte:84` | default accent passed to the Notation station (its toggles and switches) when no caller sets one | `accent` | NOT ESTABLISHED | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/NotationFields.svelte:321` | fill of toggle switch active (drawer, Notation station) | `background` | .active: var(--notation-accent, var(--sage)) (in a state variant: .toggle-switch.active) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/SearchableSelect.svelte:286` | border of select trigger active (drawer, composer and poet picker) | `border-color` | own rule: white | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/SearchableSelect.svelte:397` | text of custom option (drawer, composer and poet picker) | `color` | .select-option: rgba(139, 154, 125, 0.1) (in a state variant: .select-option.highlighted) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/SongList.svelte:261` | left border of is open song open (drawer, song library) | `border-left` | own rule: rgb(0 0 0 / 0.03) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Drawer/StationHeader.svelte:118` | default accent of a drawer station header when no caller sets one | `accent` | NOT ESTABLISHED | --deeper-sage (ΔL −0.054) |  |
| `lib/components/HeaderBar.svelte:74` | the header bar’s fill on Transcription (header bar) | `background` | the body ground, app.css:207; the bar is the top edge of the app | --deeper-sage (ΔL −0.054) |  |
| `lib/components/InstallPrompt.svelte:153` | border of install prompt (install banner) | `border` | own rule: var(--paper, #f5f0e8) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/InstallPrompt.svelte:196` | fill of install btn primary (install banner) | `background` | .install-prompt: var(--paper, #f5f0e8) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Paper/PageFooter.svelte:28` | default colour of the footer hairline, Transcription page | `hairlineAccent` | TitlePage and SubsequentPage .paper-page: var(--paper-cream) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Paper/ReadingPaper.svelte:343` | left border of reading inner blockquote (Learn and Guide reading sheet) | `border-left` | NOT ESTABLISHED | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Paper/RunningHeader.svelte:47` | bottom border of header underline (running header, page 2 on) | `border-bottom` | SubsequentPage.svelte .paper-page: var(--paper-cream) \| VoiceProfilePane.svelte .paper-page: var(--paper-cream) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Paper/TitleHeader.svelte:33` | default colour of the title block’s version badge, mark, and header rule (three props, one line), Transcription page | `versionAccent` | TitlePage .paper-page: var(--paper-cream) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Paper/TitleHeader.svelte:33` | default colour of the title block’s version badge, mark, and header rule (three props, one line), Transcription page | `markAccent` | TitlePage .paper-page: var(--paper-cream) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Paper/TitleHeader.svelte:33` | default colour of the title block’s version badge, mark, and header rule (three props, one line), Transcription page | `ruleAccent` | TitlePage .paper-page: var(--paper-cream) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Paper/TitleHeader.svelte:117` | text of logo (title block on page one) | `color` | TitlePage.svelte .paper-page: var(--paper-cream) \| InsightsPane.svelte .paper-page: var(--paper-cream) \| VoiceProfilePane.svelte .paper-page: var(--paper-cream) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Paper/TitleHeader.svelte:137` | text of logo version (title block on page one) | `color` | TitlePage.svelte .paper-page: var(--paper-cream) \| InsightsPane.svelte .paper-page: var(--paper-cream) \| VoiceProfilePane.svelte .paper-page: var(--paper-cream) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Paper/TitleHeader.svelte:178` | bottom border of header rule (title block on page one) | `border-bottom` | TitlePage.svelte .paper-page: var(--paper-cream) \| InsightsPane.svelte .paper-page: var(--paper-cream) \| VoiceProfilePane.svelte .paper-page: var(--paper-cream) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Paper/WordStack.svelte:219` | focus outline of word stack on keyboard focus (a word on the page) | `outline` | SubsequentPage.svelte .paper-page: var(--paper-cream) \| TitlePage.svelte .paper-page: var(--paper-cream) \| ReadingAid.svelte .reading-aid: var(--paper-light, #F5F1E8) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Paper/WordStack.svelte:249` | focus outline of is inferred on keyboard focus (a word on the page) | `outline` | SubsequentPage.svelte .paper-page: var(--paper-cream) \| TitlePage.svelte .paper-page: var(--paper-cream) \| ReadingAid.svelte .reading-aid: var(--paper-light, #F5F1E8) | --deeper-sage (ΔL −0.054) |  |
| `lib/components/Paper/WordStack.svelte:286` | text of clitic arrow (a word on the page) | `color` | SubsequentPage.svelte .paper-page: var(--paper-cream) \| TitlePage.svelte .paper-page: var(--paper-cream) \| ReadingAid.svelte .reading-aid: var(--paper-light, #F5F1E8) | --deeper-sage (ΔL −0.054) |  |
| `lib/shane/CalibrationWizard.svelte:1781` | fill of readiness meter fill (calibration takeover) | `background` | .readiness-meter: var(--stone-300) | --deeper-sage (ΔL −0.054) |  |
| `lib/shane/CalibrationWizard.svelte:1905` | border of wizard roster action button on hover (calibration takeover) | `border-color` | NOT ESTABLISHED | --deeper-sage (ΔL −0.054) |  |
| `lib/shane/CalibrationWizard.svelte:1906` | text of wizard roster action button on hover (calibration takeover) | `color` | NOT ESTABLISHED | --deeper-sage (ΔL −0.054) |  |
| `lib/shane/CalibrationWizard.svelte:2039` | border of wizard hold actions button on hover (calibration takeover) | `border-color` | NOT ESTABLISHED | --deeper-sage (ΔL −0.054) |  |
| `lib/shane/CalibrationWizard.svelte:2040` | text of wizard hold actions button on hover (calibration takeover) | `color` | NOT ESTABLISHED | --deeper-sage (ΔL −0.054) |  |
| `lib/shane/Loupe.svelte:1039` | focus outline of loupe [loupe selected] (loupe) | `outline` | NOT ESTABLISHED | --deeper-sage (ΔL −0.054) |  |
| `lib/shane/Loupe.svelte:1048` | stroke of [held measure] (loupe) | `stroke` | NOT ESTABLISHED | --deeper-sage (ΔL −0.054) |  |
| `lib/shane/pacifier/Pacifier.svelte:768` | the translucent fill of the minimum-met floor polygon (14% opacity), calibration wheel | `fill (attribute)` | the pacifier band and node interiors | --deeper-sage (ΔL −0.054) |  |
| `lib/shane/pacifier/Pacifier.svelte:770` | the outline of the minimum-met floor polygon, calibration wheel | `stroke (attribute)` | the pacifier band and node interiors | --deeper-sage (ΔL −0.054) |  |
| `lib/shane/pacifier/Pacifier.svelte:792` | the keyboard focus ring round a vowel node, calibration wheel | `stroke (attribute)` | the pacifier band (--surround-shane) | --deeper-sage (ΔL −0.054) |  |
| `lib/shane/ProfileSwitcher.svelte:471` | border of ps verbs button on hover (voice switcher) | `border-color` | NOT ESTABLISHED | --deeper-sage (ΔL −0.054) |  |
| `lib/shane/ProfileSwitcher.svelte:472` | text of ps verbs button on hover (voice switcher) | `color` | NOT ESTABLISHED | --deeper-sage (ΔL −0.054) |  |
| `lib/shane/ProfileSwitcher.svelte:505` | focus outline of ps input on focus (voice switcher) | `outline` | own rule: #ffffff | --deeper-sage (ΔL −0.054) |  |
| `lib/shane/ScoreUploader.svelte:967` | border-top-color of spinner (score upload) | `border-top-color` | Drawer.svelte .group: var(--drawer-bg) | --deeper-sage (ΔL −0.054) |  |
| `lib/shane/ScoreUploader.svelte:1083` | fill of btn primary e.g. “The score” (score upload) | `background` | .ask: var(--paper-cream) | --deeper-sage (ΔL −0.054) |  |
| `routes/+page.svelte:4313` | the accent the page passes to the Notation station, Transcription | `accent` | Drawer .group: var(--drawer-bg) | --deeper-sage (ΔL −0.054) |  |
| `routes/+page.svelte:5813` | fill of update toast action (app shell, +page) | `background` | .update-toast: var(--paper, #faf7f2) | --deeper-sage (ΔL −0.054) | fallback #8A9B7E is not the token’s #8B9A7D (ΔE 0.003) |

#### `#8B9A7D` · #8B9A7D, OKLCH L/C/H 0.666 / 0.045 / 130 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `app.html:9` | the browser and phone chrome colour (theme-color meta) | `content` | the operating system’s title bar | --deeper-sage (ΔL −0.054) | same value as --sage |

#### `rgba of #8B9A7D` · #8B9A7D, OKLCH L/C/H 0.666 / 0.045 / 130 · 14 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/InspectorPanel.svelte:1730` | fill of organism (drawer, word inspector) | `background` | Drawer.svelte .group: var(--drawer-bg) | --deeper-sage (ΔL −0.054) | alpha 0.15 |
| `lib/components/Drawer/InspectorPanel.svelte:1802` | shadow of molecule is stressed (drawer, word inspector) | `box-shadow` | .is-stressed: var(--sage) (in a state variant: .stress-circle.is-stressed) | --deeper-sage (ΔL −0.054) | alpha 0.2 |
| `lib/components/Drawer/InspectorPanel.svelte:1956` | shadow of atom selected (drawer, word inspector) | `box-shadow` | own rule: var(--paper-cream) | --deeper-sage (ΔL −0.054) | alpha 0.15 |
| `lib/components/Drawer/InspectorPanel.svelte:1989` | shadow of atom drag highlight (drawer, word inspector) | `box-shadow` | own rule: var(--paper-cream) | --deeper-sage (ΔL −0.054) | alpha 0.25 |
| `lib/components/Drawer/InspectorPanel.svelte:2192` | shadow of stress circle is assigning (drawer, word inspector) | `box-shadow` | own rule: var(--sage) (in a state variant: .stress-circle.is-stressed) | --deeper-sage (ΔL −0.054) | alpha 0.3 |
| `lib/components/Drawer/IntakePanel.svelte:751` | fill of intake empty on hover “Source” (drawer, Input band) | `background` | Drawer.svelte .group: var(--drawer-bg) | --deeper-sage (ΔL −0.054) | alpha 0.06 |
| `lib/components/Drawer/IntakePanel.svelte:759` | fill of intake dragging “Source” (drawer, Input band) | `background` | Drawer.svelte .group: var(--drawer-bg) | --deeper-sage (ΔL −0.054) | alpha 0.12 |
| `lib/components/Drawer/SearchableSelect.svelte:287` | shadow of select trigger active (drawer, composer and poet picker) | `box-shadow` | own rule: white | --deeper-sage (ΔL −0.054) | alpha 0.15 |
| `lib/components/Drawer/SearchableSelect.svelte:380` | fill of select option on hover (drawer, composer and poet picker) | `background` | .highlighted: rgba(139, 154, 125, 0.1) (in a state variant: .select-option.highlighted) | --deeper-sage (ΔL −0.054) | alpha 0.1 |
| `lib/components/Paper/ReadingPaper.svelte:333` | fill of reading inner code (Learn and Guide reading sheet) | `background` | NOT ESTABLISHED | --deeper-sage (ΔL −0.054) | alpha 0.1 |
| `lib/components/Paper/ReadingPaper.svelte:344` | fill of reading inner blockquote (Learn and Guide reading sheet) | `background` | NOT ESTABLISHED | --deeper-sage (ΔL −0.054) | alpha 0.06 |
| `lib/components/Paper/ReadingPaper.svelte:451` | fill of reading inner tbody tr on hover (Learn and Guide reading sheet) | `background` | NOT ESTABLISHED | --deeper-sage (ΔL −0.054) | alpha 0.04 |
| `lib/components/Paper/ReadingPaper.svelte:459` | fill of reading inner td code (Learn and Guide reading sheet) | `background` | NOT ESTABLISHED | --deeper-sage (ΔL −0.054) | alpha 0.1 |
| `lib/components/Paper/WordStack.svelte:215` | fill of word stack on hover (a word on the page) | `background-color` | SubsequentPage.svelte .paper-page: var(--paper-cream) \| TitlePage.svelte .paper-page: var(--paper-cream) \| ReadingAid.svelte .reading-aid: var(--paper-light, #F5F1E8) | --deeper-sage (ΔL −0.054) | alpha 0.08 |

#### `color-mix` · no value · 4 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/InspectorPanel.svelte:1612` | shadow of dict gloss input on focus (drawer, word inspector) | `box-shadow` | own rule: #fff |  |  |
| `lib/components/Drawer/InspectorPanel.svelte:1625` | fill of dict separator “Full entry unavailable” (drawer, word inspector) | `background` | .dict-panel: var(--paper-cream, #FDFBF7) |  |  |
| `lib/components/Drawer/InspectorPanel.svelte:1658` | fill of dict entry option on hover (drawer, word inspector) | `background` | .dict-entry-cell: #F0F3EE |  |  |
| `lib/components/Drawer/InspectorPanel.svelte:1722` | fill of dict entry divider (drawer, word inspector) | `background` | .dict-entry-cell: #F0F3EE |  |  |

#### `--deeper-sage` · #7A8A6C, OKLCH L/C/H 0.612 / 0.048 / 131 · 7 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/InspectorPanel.svelte:1522` | fill of dict button on hover “Dictionary” (drawer, word inspector) | `background` | .word-stack: var(--paper-cream) | --lang-chip-transcription (ΔL −0.052) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2185` | fill of stress circle is stressed on hover (drawer, word inspector) | `background` | .is-stressed: var(--sage) (in a state variant: .stress-circle.is-stressed) | --lang-chip-transcription (ΔL −0.052) |  |
| `lib/components/Drawer/InspectorPanel.svelte:2186` | border of stress circle is stressed on hover (drawer, word inspector) | `border-color` | own rule: var(--sage) (in a state variant: .stress-circle.is-stressed) | --lang-chip-transcription (ΔL −0.052) |  |
| `lib/components/Drawer/IntakePanel.svelte:1060` | border of text input on focus “Paste, type, or drop your poem here.” (drawer, Input band) | `border-color` | .intake: var(--paper-light) | --lang-chip-transcription (ΔL −0.052) |  |
| `lib/components/HeaderBar.svelte:149` | fill of tab transcription sigil version (header bar) | `background` | .header-bar: var(--sage, #8B9A7D) (in a state variant: .header-bar.tab-transcription) | --lang-chip-transcription (ΔL −0.052) |  |
| `lib/components/InstallPrompt.svelte:205` | fill of install btn primary on hover (install banner) | `background` | .install-prompt: var(--paper, #f5f0e8) | --lang-chip-transcription (ΔL −0.052) |  |
| `lib/components/Paper/WordStack.svelte:275` | text of gloss row (a word on the page) | `color` | SubsequentPage.svelte .paper-page: var(--paper-cream) \| TitlePage.svelte .paper-page: var(--paper-cream) \| ReadingAid.svelte .reading-aid: var(--paper-light, #F5F1E8) | --lang-chip-transcription (ΔL −0.052) |  |

#### `--lang-chip-transcription` · #6C7A5F, OKLCH L/C/H 0.560 / 0.044 / 130 · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/Drawer.svelte:1188` | fill of group input group band (drawer frame) | `background` | .drawer: var(--desk-fill, var(--desk-surface, #D8D4C8)) | --stone-500 (ΔL −0.007) |  |
| `lib/components/HeaderBar.svelte:211` | fill of tab transcription lang pill (header bar) | `background` | .header-bar: var(--sage, #8B9A7D) (in a state variant: .header-bar.tab-transcription) | --stone-500 (ΔL −0.007) |  |

#### `#6B7B5E` · #6B7B5E, OKLCH L/C/H 0.561 / 0.047 / 131 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/InspectorPanel.svelte:1531` | fill of dict button when expanded=true “Dictionary” (drawer, word inspector) | `background` | .word-stack: var(--paper-cream) | --lang-chip-transcription (ΔL −0.001) |  |

#### `--surround-transcription` · #D1D7CB, OKLCH L/C/H 0.871 / 0.017 / 129 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `routes/+page.svelte:5344` | declares --desk-fill (app shell, +page) | `--desk-fill` | own rule: var(--desk-fill) | --desk-surface (ΔL −0.001) |  |

#### `#8BA48B` · #8BA48B, OKLCH L/C/H 0.692 / 0.046 / 145 · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `routes/+page.svelte:5089` | border-bottom-color of gt cursive h (Learn glyph table, styled from +page.svelte) | `border-bottom-color` | NOT ESTABLISHED | --sage (ΔL −0.026) |  |
| `routes/+page.svelte:5142` | text of gt cursive (Learn glyph table, styled from +page.svelte) | `color` | own rule: #ebeee8 !important (in a state variant: :global(.gt-cursive)) | --sage (ΔL −0.026) |  |

#### `#EBEEE8` · #EBEEE8, OKLCH L/C/H 0.945 / 0.009 / 129 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `routes/+page.svelte:5141` | fill of gt cursive (Learn glyph table, styled from +page.svelte) | `background` | NOT ESTABLISHED | --paper-cream (ΔL −0.004) |  |

#### `#F0F3EE` · #F0F3EE, OKLCH L/C/H 0.960 / 0.007 / 132 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/InspectorPanel.svelte:1630` | fill of dict entry cell “Full entry unavailable” (drawer, word inspector) | `background` | .dict-panel: var(--paper-cream, #FDFBF7) | --paper-light (ΔL −0.002) |  |

#### `#F5F7F3` · #F5F7F3, OKLCH L/C/H 0.974 / 0.006 / 129 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `routes/+page.svelte:5054` | fill of gt table thead th (Learn glyph table, styled from +page.svelte) | `background` | NOT ESTABLISHED | --drawer-bg (ΔL +0.006) |  |

#### `#FCFDFC` · #FCFDFC, OKLCH L/C/H 0.993 / 0.002 / – · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `routes/+page.svelte:5094` | fill of gt table tbody tr:nth child(even td) (Learn glyph table, styled from +page.svelte) | `background` | NOT ESTABLISHED | --drawer-bg (ΔL −0.013) |  |


### 7.5 Rose

#### `--dusty-rose` · #A67B7B, OKLCH L/C/H 0.625 / 0.054 / 19 · 17 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `app.css:39` | declares --terracotta (global stylesheet) | `--terracotta` | NOT ESTABLISHED | --lang-chip-learn (ΔL −0.051) |  |
| `lib/components/Drawer/Drawer.svelte:1777` | text of toc heading learn (drawer frame) | `color` | .drawer: var(--desk-fill, var(--desk-surface, #D8D4C8)) | --lang-chip-learn (ΔL −0.051) |  |
| `lib/components/Drawer/Drawer.svelte:1832` | border-left-color of toc link active (drawer frame) | `border-left-color` | own rule: rgba(166, 123, 123, 0.08) (in a state variant: .toc-link.active) | --lang-chip-learn (ΔL −0.051) |  |
| `lib/components/Drawer/Drawer.svelte:1841` | border-left-color of toc link active on hover (drawer frame) | `border-left-color` | own rule: rgba(166, 123, 123, 0.08) (in a state variant: .toc-link.active) | --lang-chip-learn (ΔL −0.051) |  |
| `lib/components/Drawer/Drawer.svelte:1928` | text of toc chevron contains active (drawer frame) | `color` | .drawer: var(--desk-fill, var(--desk-surface, #D8D4C8)) | --lang-chip-learn (ΔL −0.051) |  |
| `lib/components/HeaderBar.svelte:78` | the header bar’s fill on Learn (header bar) | `background` | the body ground, app.css:207; the bar is the top edge of the app | --lang-chip-learn (ΔL −0.051) |  |
| `lib/components/HeaderBar.svelte:104` | the header bar’s fill on Insights (header bar) | `background` | the body ground, app.css:207; the bar is the top edge of the app | --lang-chip-learn (ΔL −0.051) |  |
| `lib/components/Paper/ReadingPaper.svelte:84` | top border of reading inner h3 (Learn and Guide reading sheet) | `border-top` | NOT ESTABLISHED | --lang-chip-learn (ΔL −0.051) |  |
| `lib/components/Paper/ReadingPaper.svelte:133` | fill of reading inner band learn (Learn and Guide reading sheet) | `background` | +page.svelte .app-content: var(--desk-fill) | --lang-chip-learn (ΔL −0.051) |  |
| `lib/components/Paper/ReadingPaper.svelte:376` | text of reading inner a (Learn and Guide reading sheet) | `color` | NOT ESTABLISHED | --lang-chip-learn (ΔL −0.051) |  |
| `lib/shane/InsightsPane.svelte:473` | border of squircle e.g. “No score has been added, so there is not…” (Insights page) | `border` | own rule: var(--paper-cream) | --lang-chip-learn (ΔL −0.051) |  |
| `lib/shane/InsightsPane.svelte:659` | bottom border of running rule “The findings page one deferred” (Insights page) | `border-bottom` | .paper-page: var(--paper-cream) | --lang-chip-learn (ΔL −0.051) |  |
| `lib/shane/InsightsPane.svelte:708` | top border of foot hairline “Page”, “of” (Insights page) | `border-top` | +page.svelte .app-content: var(--desk-fill) | --lang-chip-learn (ΔL −0.051) |  |
| `routes/+page.svelte:5154` | text of gt null (Learn glyph table, styled from +page.svelte) | `color` | NOT ESTABLISHED | --lang-chip-learn (ΔL −0.051) |  |
| `routes/+page.svelte:5541` | left border of learn callout (app shell, +page) | `border-left` | NOT ESTABLISHED | --lang-chip-learn (ΔL −0.051) |  |
| `routes/+page.svelte:5558` | text of learn callout (before mark) (app shell, +page) | `color` | NOT ESTABLISHED | --lang-chip-learn (ΔL −0.051) |  |
| `routes/+page.svelte:5600` | text of main content tab learn reading inner h1 (app shell, +page) | `color` | NOT ESTABLISHED | --lang-chip-learn (ΔL −0.051) |  |

#### `#A67B7B` · #A67B7B, OKLCH L/C/H 0.625 / 0.054 / 19 · 3 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/InsightsPane.svelte:276` | the version badge in the Insights title block | `versionAccent` | InsightsPane .paper-page: var(--paper-cream) | --lang-chip-learn (ΔL −0.051) | same value as --dusty-rose |
| `lib/shane/InsightsPane.svelte:277` | the mark in the Insights title block | `markAccent` | InsightsPane .paper-page: var(--paper-cream) | --lang-chip-learn (ΔL −0.051) | same value as --dusty-rose |
| `lib/shane/InsightsPane.svelte:278` | the rule under the Insights title block | `ruleAccent` | InsightsPane .paper-page: var(--paper-cream) | --lang-chip-learn (ΔL −0.051) | same value as --dusty-rose |

#### `rgba of #A67B7B` · #A67B7B, OKLCH L/C/H 0.625 / 0.054 / 19 · 4 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/Drawer.svelte:1818` | border-left-color of toc link on hover (drawer frame) | `border-left-color` | own rule: rgba(166, 123, 123, 0.08) (in a state variant: .toc-link.active) | --lang-chip-learn (ΔL −0.051) | alpha 0.4 |
| `lib/components/Drawer/Drawer.svelte:1819` | fill of toc link on hover (drawer frame) | `background` | .drawer: var(--desk-fill, var(--desk-surface, #D8D4C8)) | --lang-chip-learn (ΔL −0.051) | alpha 0.06 |
| `lib/components/Drawer/Drawer.svelte:1835` | fill of toc link active (drawer frame) | `background` | .drawer: var(--desk-fill, var(--desk-surface, #D8D4C8)) | --lang-chip-learn (ΔL −0.051) | alpha 0.08 |
| `lib/shane/InsightsPane.svelte:544` | top border of fit row in span (Insights page) | `border-top` | NOT ESTABLISHED | --lang-chip-learn (ΔL −0.051) | alpha 0.35 |

#### `--lang-chip-learn` · #9A6A6A, OKLCH L/C/H 0.574 / 0.062 / 19 · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/HeaderBar.svelte:215` | fill of tab learn lang pill (header bar) | `background` | .header-bar: var(--sage, #8B9A7D) (in a state variant: .header-bar.tab-transcription) | --dusty-rose (ΔL +0.051) |  |
| `lib/components/HeaderBar.svelte:228` | fill of tab insights lang pill (header bar) | `background` | .header-bar: var(--sage, #8B9A7D) (in a state variant: .header-bar.tab-transcription) | --dusty-rose (ΔL +0.051) |  |

#### `#8F6A6A` · #8F6A6A, OKLCH L/C/H 0.562 / 0.048 / 19 · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/HeaderBar.svelte:153` | fill of tab learn sigil version (header bar) | `background` | .header-bar: var(--sage, #8B9A7D) (in a state variant: .header-bar.tab-transcription) | --lang-chip-learn (ΔL +0.013) |  |
| `lib/components/HeaderBar.svelte:169` | fill of tab insights sigil version (header bar) | `background` | .header-bar: var(--sage, #8B9A7D) (in a state variant: .header-bar.tab-transcription) | --lang-chip-learn (ΔL +0.013) |  |

#### `#8A5C5C` · #8A5C5C, OKLCH L/C/H 0.524 / 0.061 / 19 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/InsightsPane.svelte:505` | text of section head (Insights page) | `color` | +page.svelte .app-content: var(--desk-fill) | --lang-chip-learn (ΔL +0.050) |  |

#### `--surround-learn` · #DBCACA, OKLCH L/C/H 0.853 / 0.019 / 18 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `routes/+page.svelte:5348` | declares --desk-fill (app shell, +page) | `--desk-fill` | own rule: var(--desk-fill) | --stone-300 (ΔL +0.016) |  |

#### `--surround-insights` · #DBCACA, OKLCH L/C/H 0.853 / 0.019 / 18 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `routes/+page.svelte:5358` | declares --desk-fill (app shell, +page) | `--desk-fill` | own rule: var(--desk-fill) | --stone-300 (ΔL +0.016) |  |

#### `#C28888` · #C28888, OKLCH L/C/H 0.684 / 0.071 / 19 · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Reading/LearnContent.svelte:4088` | border of gt legend swatch (Learn glyph table) | `border` | own rule: #F0D8D8 | --dusty-rose (ΔL −0.059) |  |
| `routes/+page.svelte:5159` | shadow of gt hi (Learn glyph table, styled from +page.svelte) | `box-shadow` | own rule: #F0D8D8 !important (in a state variant: :global(.gt-hi)) | --dusty-rose (ΔL −0.059) |  |

#### `#F0D8D8` · #F0D8D8, OKLCH L/C/H 0.902 / 0.027 / 18 · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Reading/LearnContent.svelte:4087` | fill of gt legend swatch (Learn glyph table) | `background` | ReadingPaper.svelte .reading-paper: var(--paper-cream, #F0EBE0) | --stone-300 (ΔL −0.033) |  |
| `routes/+page.svelte:5158` | fill of gt hi (Learn glyph table, styled from +page.svelte) | `background` | NOT ESTABLISHED | --stone-300 (ΔL −0.033) |  |


### 7.6 Cobalt

#### `--quiet-cobalt` · #5C739E, OKLCH L/C/H 0.555 / 0.073 / 263 · 10 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `app.css:160` | declares --lang-chip-guide (global stylesheet) | `--lang-chip-guide` | NOT ESTABLISHED | --lang-chip-marked (ΔL +0.012) |  |
| `lib/components/Drawer/Drawer.svelte:1781` | text of toc heading guide (drawer frame) | `color` | .drawer: var(--desk-fill, var(--desk-surface, #D8D4C8)) | --lang-chip-marked (ΔL +0.012) |  |
| `lib/components/Drawer/Drawer.svelte:1946` | border-left-color of guide toc toc link active (drawer frame) | `border-left-color` | own rule: rgba(166, 123, 123, 0.08) (in a state variant: .toc-link.active) | --lang-chip-marked (ΔL +0.012) |  |
| `lib/components/Drawer/Drawer.svelte:1951` | border-left-color of guide toc toc link active on hover (drawer frame) | `border-left-color` | own rule: rgba(166, 123, 123, 0.08) (in a state variant: .toc-link.active) | --lang-chip-marked (ΔL +0.012) |  |
| `lib/components/Drawer/Drawer.svelte:1955` | text of guide toc toc chevron contains active (drawer frame) | `color` | .drawer: var(--desk-fill, var(--desk-surface, #D8D4C8)) | --lang-chip-marked (ΔL +0.012) |  |
| `lib/components/HeaderBar.svelte:82` | the header bar’s fill on Guide (header bar) | `background` | the body ground, app.css:207; the bar is the top edge of the app | --lang-chip-marked (ΔL +0.012) |  |
| `lib/components/Paper/ReadingPaper.svelte:137` | fill of reading inner band guide (Learn and Guide reading sheet) | `background` | +page.svelte .app-content: var(--desk-fill) | --lang-chip-marked (ΔL +0.012) |  |
| `lib/components/Reading/GuideContent.svelte:599` | text of about website a (Guide text) | `color` | NOT ESTABLISHED | --lang-chip-marked (ΔL +0.012) |  |
| `routes/+page.svelte:5607` | text of main content tab guide reading inner h1 (app shell, +page) | `color` | NOT ESTABLISHED | --lang-chip-marked (ΔL +0.012) |  |
| `routes/+page.svelte:5611` | border-top-color of main content tab guide reading inner h3 (app shell, +page) | `border-top-color` | NOT ESTABLISHED | --lang-chip-marked (ΔL +0.012) |  |

#### `rgba of #5C739E` · #5C739E, OKLCH L/C/H 0.555 / 0.073 / 263 · 3 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/Drawer.svelte:1941` | border-left-color of guide toc toc link on hover (drawer frame) | `border-left-color` | own rule: rgba(166, 123, 123, 0.08) (in a state variant: .toc-link.active) | --lang-chip-marked (ΔL +0.012) | alpha 0.4 |
| `lib/components/Drawer/Drawer.svelte:1942` | fill of guide toc toc link on hover (drawer frame) | `background` | .drawer: var(--desk-fill, var(--desk-surface, #D8D4C8)) | --lang-chip-marked (ΔL +0.012) | alpha 0.06 |
| `lib/components/Drawer/Drawer.svelte:1947` | fill of guide toc toc link active (drawer frame) | `background` | .drawer: var(--desk-fill, var(--desk-surface, #D8D4C8)) | --lang-chip-marked (ΔL +0.012) | alpha 0.08 |

#### `--lang-chip-guide` · #5C739E, OKLCH L/C/H 0.555 / 0.073 / 263 · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/Drawer.svelte:1179` | fill of group piece group band (drawer frame) | `background` | .drawer: var(--desk-fill, var(--desk-surface, #D8D4C8)) | --lang-chip-marked (ΔL +0.012) |  |
| `lib/components/HeaderBar.svelte:219` | fill of tab guide lang pill (header bar) | `background` | .header-bar: var(--sage, #8B9A7D) (in a state variant: .header-bar.tab-transcription) | --lang-chip-marked (ΔL +0.012) |  |

#### `#4D6387` · #4D6387, OKLCH L/C/H 0.497 / 0.064 / 260 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/HeaderBar.svelte:157` | fill of tab guide sigil version (header bar) | `background` | .header-bar: var(--sage, #8B9A7D) (in a state variant: .header-bar.tab-transcription) | --quiet-cobalt (ΔL +0.058) |  |

#### `--surround-guide` · #BEC7D8, OKLCH L/C/H 0.828 / 0.026 / 263 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `routes/+page.svelte:5352` | declares --desk-fill (app shell, +page) | `--desk-fill` | own rule: var(--desk-fill) | --surround-marked (ΔL +0.023) |  |


### 7.7 Signals, warnings, and one-off hues

#### `#15803D` · #15803D, OKLCH L/C/H 0.527 / 0.137 / 150 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/pacifier/contrast.ts:295` | not a paint: a hex quoted inside an obligation’s note text | `` | NOT ESTABLISHED | --lang-chip-transcription (ΔL +0.033) |  |

#### `#1DB954` · #1DB954, OKLCH L/C/H 0.689 / 0.187 / 149 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/pacifier/contrast.ts:135` | not a paint: the pacifier contrast checker’s own copy of the token value, compared against app.css by contrast.test.ts | `` | NOT ESTABLISHED | --sage (ΔL −0.023) | same value as --arc-green |

#### `#7F1D1D` · #7F1D1D, OKLCH L/C/H 0.396 / 0.133 / 26 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `routes/+page.svelte:5024` | text of replace actions replace destructive (app shell, +page) | `color` | .replace-dialog: var(--paper-cream, #f5f0e6) | --signal-red (ΔL +0.085) |  |

#### `#8A6D3B` · #8A6D3B, OKLCH L/C/H 0.552 / 0.077 / 80 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `routes/fit-font-lab/+page.svelte:169` | text of lab warnings (font lab developer route) | `color` | .lab-chip: #f9f7f5 | --lang-chip-transcription (ΔL +0.008) |  |

#### `#A32D2D` · #A32D2D, OKLCH L/C/H 0.480 / 0.154 / 25 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/pacifier/contrast.ts:136` | not a paint: the pacifier contrast checker’s own copy of the token value, compared against app.css by contrast.test.ts | `` | NOT ESTABLISHED | --lang-chip-learn (ΔL +0.094) | same value as --signal-red |

#### `#B23B3B` · #B23B3B, OKLCH L/C/H 0.524 / 0.155 / 24 · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `routes/fit-font-lab/+page.svelte:127` | text of lab error (font lab developer route) | `color` | NOT ESTABLISHED | --signal-red (ΔL −0.044) |  |
| `packages/score-parser/src/staff-renderer.ts:2513` | the red squircle round a note where the first formant crosses the pitch (analysis mark), score renderer | `stroke (attribute)` | on the system’s own cream rect (staff-renderer.ts:2828), on the Fit page | --signal-red (ΔL −0.044) |  |

#### `#B45309` · #B45309, OKLCH L/C/H 0.555 / 0.146 / 49 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/ScoreUploader.svelte:1054` | text of error text “Try another file” (score upload) | `color` | .error: rgba(217, 119, 6, 0.06) | --signal-red (ΔL −0.075) |  |

#### `#BC7E08` · #BC7E08, OKLCH L/C/H 0.641 / 0.134 / 74 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/pacifier/contrast.ts:137` | not a paint: the pacifier contrast checker’s own copy of the token value, compared against app.css by contrast.test.ts | `` | NOT ESTABLISHED | --dusty-rose (ΔL −0.016) | same value as --prep-amber |

#### `#D97706` · #D97706, OKLCH L/C/H 0.666 / 0.157 / 58 · 3 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/IntakePanel.svelte:686` | fill of status dot error (drawer, Input band) | `background` | Drawer.svelte .group: var(--drawer-bg) | --prep-amber (ΔL −0.025) |  |
| `lib/components/Drawer/IntakePanel.svelte:1104` | text of char warning “characters. Large texts may be slow to p…” (drawer, Input band) | `color` | Drawer.svelte .group: var(--drawer-bg) | --prep-amber (ΔL −0.025) |  |
| `lib/components/Drawer/IntakePanel.svelte:1110` | text of error text (drawer, Input band) | `color` | Drawer.svelte .group: var(--drawer-bg) | --prep-amber (ΔL −0.025) |  |

#### `#FF0000` · #FF0000, OKLCH L/C/H 0.628 / 0.258 / 29 · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/i18n.ts:703` | the Canadian flag in the English credit line (red bands and maple leaf, and the white centre) | `fill (attribute)` | wherever the credit line renders | --signal-red (ΔL −0.148) |  |
| `lib/i18n.ts:704` | the Canadian flag in the French credit line (red bands and maple leaf, and the white centre) | `fill (attribute)` | wherever the credit line renders | --signal-red (ΔL −0.148) |  |

#### `--arc-green` · #1DB954, OKLCH L/C/H 0.689 / 0.187 / 149 · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/pacifier/Pacifier.svelte:816` | the green progress arc round a working node, calibration wheel | `stroke (attribute)` | the pacifier band (--surround-shane) | --sage (ΔL −0.023) |  |
| `lib/shane/pacifier/Pacifier.svelte:910` | the node outline on the three green beats of the good-take flash (calibration wheel) | `stroke` | the pacifier band and the node’s white interior | --sage (ΔL −0.023) |  |

#### `--prep-amber` · #BC7E08, OKLCH L/C/H 0.641 / 0.134 / 74 · 7 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/CalibrationWizard.svelte:1665` | text of wizard guidance e.g. “You can carry on; each vowel asks for th…” (calibration takeover) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --dusty-rose (ΔL −0.016) |  |
| `lib/shane/CalibrationWizard.svelte:1863` | text of wizard roster reading is provisional (calibration takeover) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --dusty-rose (ΔL −0.016) |  |
| `lib/shane/CalibrationWizard.svelte:1885` | text of wizard roster tryagain “Try again” (calibration takeover) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --dusty-rose (ΔL −0.016) |  |
| `lib/shane/CalibrationWizard.svelte:1979` | text of charx note e.g. “The lowest note is set above the highest…” (calibration takeover) | `color` | Drawer.svelte .takeover-frame: var(--drawer-bg) | --dusty-rose (ΔL −0.016) |  |
| `lib/shane/CalibrationWizard.svelte:2061` | border of wizard toast “The room sounds a little lively. Your sa…” (calibration takeover) | `border` | own rule: var(--drawer-bg) | --dusty-rose (ΔL −0.016) |  |
| `lib/shane/pacifier/Pacifier.svelte:696` | the outline ring of a node preparing to record: amber on the pulse, ink-secondary between pulses | `stroke` | the vowel node’s white interior (Pacifier.svelte:793) | --dusty-rose (ΔL −0.016) |  |
| `lib/shane/pacifier/Pacifier.svelte:795` | the amber flash inside a node during the prep countdown | `fill (attribute)` | the vowel node’s white interior (Pacifier.svelte:793) | --dusty-rose (ΔL −0.016) |  |

#### `--signal-red` · #A32D2D, OKLCH L/C/H 0.480 / 0.154 / 25 · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/pacifier/Pacifier.svelte:728` | the ↻ retake badge on a provisional node, calibration wheel | `sigilColor` | the badge’s white disc (Pacifier.svelte:838) | --lang-chip-learn (ΔL +0.094) |  |
| `lib/shane/pacifier/Pacifier.svelte:925` | the node outline on the three red beats of the retake flash (calibration wheel) | `stroke` | the pacifier band and the node’s white interior | --lang-chip-learn (ΔL +0.094) |  |

#### `rgba of #D97706` · #D97706, OKLCH L/C/H 0.666 / 0.157 / 58 · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/shane/ScoreUploader.svelte:1049` | fill of error “Try another file” (score upload) | `background` | Drawer.svelte .group: var(--drawer-bg) | --prep-amber (ΔL −0.025) | alpha 0.06 |


### 7.8 Local carriers

These three names are declared on an element and read by its own stylesheet. They carry a colour chosen elsewhere.

#### `--desk-fill` · fallbacks only: #D8D4C8 · 2 rows

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/Drawer.svelte:2050` | fill of drawer (drawer frame) | `background` | +page.svelte .app-content: var(--desk-fill) | --stone-300 (ΔL −0.001) |  |
| `routes/+page.svelte:5194` | fill of app content (app shell, +page) | `background-color` | NOT ESTABLISHED |  |  |

#### `--footer-accent` · no value · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Paper/PageFooter.svelte:170` | top border of footer hairline (page footer) | `border-top` | SubsequentPage.svelte .paper-page: var(--paper-cream) \| TitlePage.svelte .paper-page: var(--paper-cream) \| VoiceProfilePane.svelte .paper-page: var(--paper-cream) |  |  |

#### `--notation-accent` · no value · 1 row

| path:line | what it colours | property | what it sits on | swappable to (ΔL) | observation |
|---|---|---|---|---|---|
| `lib/components/Drawer/NotationFields.svelte:321` | fill of toggle switch active (drawer, Notation station) | `background` | .active: var(--notation-accent, var(--sage)) (in a state variant: .toggle-switch.active) |  |  |


---

## 8. NOT ESTABLISHED

- **Nothing was observed rendered.** No browser was opened. Every "what it sits on" is traced through source, and every "visible or accidental" question in §6.1 stops at the number. CONTRACT tether 5 is not met by this memo.
- **"What it sits on" is wrong where the ground comes from a class the tracer cannot see.** Known cases: a class added by a Svelte expression it cannot evaluate, a component mounted through `<svelte:component>`, and a background declared only on a state such as `:hover`, which the tracer ignores. 144 rows say NOT ESTABLISHED in that column, most of them in `+page.svelte`'s Learn glyph table styles, `CalibrationWizard.svelte`, `ReadingPaper.svelte`, and `app.css`.
- **"What it colours" takes its quoted label from the first element that carries the class.** Where a class is shared, the quote is marked "e.g." and may name a sibling rather than the element a given state reaches.
- **Where `body`'s `--desk-surface` ground is visible,** if anywhere.
- **What the score upload's question card looks like** with its nine declarations that read undeclared names (§5.3).
- **Whether a cream rectangle prints behind each system** on a Marked score page (§6.2).
- **Why `#3A352F` is a separate value from `#1A1612`.** The renderer states no reason. The consistent furniture-and-sung split in §6.3 is what the code does, not a reason anyone gave.
- **Why the brief's counts differ from the tree's.** The tree's counts are in §3. How the brief's were produced is not in the brief.
- **The JND of 0.02 and the "invalid at computed-value time" rule** are cited from memory, not read this session.
- **Colours outside the scanned tree:** `apps/web/static` (vendored scripts and the PDF worker), the SMuFL fonts, and any colour a third-party script injects, such as the Vercel preview widget `app.css:323` to `:333` describes.
