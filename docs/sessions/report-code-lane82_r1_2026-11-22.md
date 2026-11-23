# Report: lane 82, the phonation-per-pitch figure (r1, 2026-11-22)

Branch `cloud-lane-82`, cut from `origin/Shane` at `c470e03d` (clean tree). Nothing committed to `Shane`, no pull request, nothing under `docs/memory/`. Read on the working tree of that branch.

## Step 0: the citations

Every citation in the brief matched before any edit: `PitchSeconds.svelte` `:93` (rows), `:129-134` (bracket), `:168` (name), `:44` (BRACKET_X = X0 + BAR_W + 98), `:46-91` (the caption wrap); `insights.ts:617-630` (figure.rows) and `:658-660` (halfMassBand, centreOfGravity, cycleDose); `e2e/insights-page.test.ts:34`, `:39`, `:124-153`; `spellPitch` at `transposition.ts:189`. `spellPitch` **is exported from the package index** (`packages/score-parser/src/index.ts:89`).

## What changed

Files: `apps/web/src/lib/insights/PitchSeconds.svelte`, `apps/web/src/lib/insights/insights.ts` (4 lines, see Deviation), `apps/web/e2e/insights-page.test.ts`. `InsightsPane.svelte` untouched (668, at its ceiling). No strings, in either language.

### 1. Rows

`PitchSeconds.svelte` builds its own rows: every semitone from the lowest to the highest of the union of the sung pitches (`figure.rows`), the typed zone's two ends, and both typed passaggi. `figure.rows` in `insights.ts` is not touched. A row with no phonation draws its name and no bar. Because every semitone now has a row, `rawY` is one line (`(top midi - midi) * ROW + ROW/2`), so the bracket and the passaggio lines lie inside the rows by construction.

**Naming rule used**, in this order: (1) a sung row keeps its first sung spelling (as before); (2) otherwise the typed pitch on that semitone (zone high, zone low, secondo, primo, first one found wins where two share a semitone); (3) otherwise `spellPitch(midi, { key })` with the piece's first key signature. If the piece has no key, `spellPitch` runs with no key (its own tier 3 with no previous note: sharp spelling).

**Deviation from "LOCAL to PitchSeconds.svelte".** The figure carried no key, so the key could not reach the component without touching `InsightsPane` (at its ceiling). I added one optional field, `key?: KeySignature | null`, to `TessituragramModel` and set it in `tessituragram()` to `score.keySignatures[0]?.signature ?? null`. It is additive; nothing reads it but `PitchSeconds`. A piece that changes key mid-way is spelled in its first key only. Whether `score` here is the written or the sounding key under a transposition is NOT ESTABLISHED; I read `keySignatures[0]` as the printed one.

### 2. The bracket and the names

The 98 is now `NAMES = LINE_LABEL (14) + widest name + 6 + 4`: the name's start past the bars, the widest name, the bracket's own 6 px clearance (the one between its tick and its caption), and the tick's 4 px. `BAR_W` and `BRACKET_X` both use it, so the bracket and its caption move in as one unit and the caption keeps its place against the bracket. They are not flushed to the right edge. The widest name is measured in a hidden `.line-name` text (the page's real italic) after `document.fonts.ready`, over every case: both languages' "secondo/primo passaggio" × letters A to G × accidentals `♭♭ ♭ ♮ ♯ x` × octave digits 0 to 9 (1,400 strings). One reservation for both languages. Until it is measured the old 98 holds, then it settles.

**The widest name is `secondo passaggio G♭♭4`**, found by the test's own enumeration over the page's font, not assumed. Its measured width in px is NOT ESTABLISHED in this report (the reservation is computed on the page, not written down); the old reservation left the name about 80 px.

## Numbers: rows and pixels

Letter width (1440 viewport), seeded bass voice with a secondo of D♯4, typed zone G2 to D4 ("default") or C2 to D4 ("below"). Rows are `text.name` rows; figure height is the SVG's.

| Fixture, zone | Rows before | Rows after | SVG height before | after |
|---|---|---|---|---|
| Tchaikovsky op. 38/3, default | 14 | 22 | 205 | 250 |
| Tchaikovsky op. 38/3, below | 14 | 29 | 282 | 327 |
| Mussorgsky (Sunless), default | 13 | 21 | 224 | 239 |
| Mussorgsky (Sunless), below | 13 | 28 | 301 | 316 |

For Tchaikovsky the piece sings B2 to E4: 18 semitones, 14 sung, so **the accepted gain inside the piece's own range is 4 rows, 44 px** (11 px each). The other 4 rows (default) or 11 (below) are the typed zone reaching below B2. The figure is only 45 px taller, not 88, because the old figure already extended for the bracket past its last row.

**Page breaks move for Tchaikovsky.** Blocks per page (from the rendered INSIGHTS pages): default English 5, 5, 8, 6, 8, 2 becomes 5, 5, 7, 7, 8, 2; default French 5, 5, 6, 4, 9, 5 becomes 5, 5, 6, 3, 9, 5; below English 5, 5, 7, 7, 8, 2 becomes 5, 5, 6, 8, 7, 2; **below French goes from 6 pages to 7**. The page count is unchanged in the other three Tchaikovsky cases. The Mussorgsky page breaks do not move in any of the four. Not judged here whether any move is a defect; the last-block-above-footer check in `insights-page.test.ts` still passes on the fixture it runs (Mussorgsky).

## The test: why it passed, and what it is now

**Why it passed before. Two reasons, both found by running it.**

1. **The line check could not fire.** The old (and my first) test built the line boxes as `{ ...l, height: ... }` where `l` is an `SVGRect`. An `SVGRect`'s `x`, `y`, `width`, `height` are getters on the prototype, so the spread is `{}` and every comparison is against NaN: **text against a line or the bracket never registered, for any label.** I proved this by putting a 70 px widening on the passaggio name and seeing the old-style check still pass, then fixing it and seeing it fail. The test now reads the four numbers out (`plain`).
2. **Its one voice could not collide.** A secondo of E♭4 puts the passaggio line a full row above the bracket's top (zone high D4), so the name cannot touch the tick whatever its width. A secondo of D♯4 puts the name level with the bracket's top corner.

**What it is now** (extended in place, `e2e/insights-page.test.ts`):

- `figureCounts` is the old collision set (text-text, text-bar, text-line, line-bar) as a helper, with the `plain` fix, plus the rows read from the DOM.
- The existing test "no label of the pitch chart touches ...": same assertions, now able to fail.
- New test "the passaggio names clear the bracket whatever the secondo is, and the bracket lies inside the rows, in both languages": the secondo at E♭4, at D♯4, and at the widest name (found on the page by enumeration, seeded as G♭♭4), each with the default zone and, for D♯4 and the widest, a zone reaching below the piece (C2 to D4). In each: the collision set is `[0,0,0,0]`; the bracket's top and bottom lie inside the rows' extent; no semitone twice and none missing (names parsed to MIDI); the zone's low end has a row.
- `storedVoice` takes a seed (secondo, zone). The seeded voice is renamed `'Dann'` to `'Voice 1'`; no voice type changed.

**Checks of the checks.** (a) Old `PitchSeconds` (from `HEAD`) against the new test: fails at the first case on "bracket inside rows" (bracket 1 to 208 against rows 0 to 143). (b) New component with the name deliberately lengthened by 12 px of widening text: both collision tests fail; with the widening removed they pass. The old component against the collision set alone at D♯4 was not run separately: NOT ESTABLISHED.

## Gates (run on the Mac working tree, branch `cloud-lane-82`, dev server up)

All eight at the baselines in `ilya-ship.sh`: gate 1 462, gate 2 248, **gate 3 first read 9 errors** (my declaration order: `NAMES` used before `nameW` and `fontsTick`), fixed, now `0 errors and 12 warnings in 5 files`, gate 4 **6801 passed | 1 skipped (6802)** (numpy and scipy present; unchanged), gate 5 904 passed | 5 skipped (909), gate 6 178, gate 7 159, gate 8 `ratchets: OK.` with no ceiling raised. Gate 4's count: I added **no vitest test**; the tests I changed are Playwright (one extended, one added; gate 4 does not count Playwright). They protect: the label-and-bracket collision set, the bracket lying in the rows, one row per semitone, and the widest passaggio name clearing the bracket. I re-ran gate 3 and gate 8 after the last source edit; gates 1, 2, 4 to 7 ran before the declaration reorder and the e2e edits, neither of which they cover. Playwright `insights-page.test.ts`: 4 of 4 pass, chromium.

## Pictures

In `docs/sessions/lane82-figures/`, `before-` and `after-` `<fixture>-<zone>-<en|fr>-<1440|390>.png` (and the `.json` numbers behind the table), for fixtures `tchai` and `sunless`, zones `default` (G2 to D4, which reaches below Tchaikovsky's B2 and Mussorgsky's C♯3 by a few rows; the piece's own lowest sung note is the limit, so "a zone that does not reach below" was not seeded: NOT ESTABLISHED as a picture) and `below` (C2 to D4, below the piece's lowest note), both languages, at 1440 (letter page) and 390, device scale 2. Before: the bracket runs past the last row and its tick collides with "secondo passaggio D♯4". After: every semitone has a row, the bracket lies in them, the name clears the tick. `lane82-probe.test.ts.txt` is the script that took them (rename to `.ts` under `apps/web/e2e/` to run; set `OUT` and `TAG`).

I read `before-tchai-below-fr-390` and `after-tchai-below-fr-390` and `before`/`after-sunless-below-en-1440` by eye; the other pictures were generated and not individually read.

## Open for Dann

- Tchaikovsky's INSIGHTS page breaks move (above); French "below" gains a page.
- The key spelling of unsung rows comes from the first printed key signature; the singer might expect flats or sharps by their own zone ends. JUDGEMENT, unreviewed.
- `NAMES` adds the 6 + 4 px clearance (the figure's own bracket-to-caption 6, plus the tick's 4). That clearance is JUDGEMENT.
