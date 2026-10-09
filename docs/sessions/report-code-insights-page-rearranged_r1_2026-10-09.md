# Report: the Insights page, rearranged (QUEUE row 60)

Cloud lane (Claude Code, Sonnet), branch `cloud-lane`, brief `brief-code-insights-page-rearranged_r1_2026-10-09.md`, after row 59. Status: `WRITTEN` on the code. `DONE` is Dann's look.

Method: the dev server (`vite dev`) in this container and the sandbox's Chromium 1194 driven by Playwright, at desk width (1440 px wide), English and French, on the tracked engraved fixture (`sunless-01-engraved.musicxml`) and seven OMR-read fixtures from the tree (`sun1`, `sun4`, `sun5`, `sun6`, `tch` from `docs/sessions/baseline-on-the-singers-path_r1_2026-10-06/joined/`, and `sun3-2` and `tch-1` from `apps/web/src/lib/omr/fixtures/`, read only): 8 songs, 16 pages. Insights draws its figure only for a singer with measured vowels and typed characteristics, and Dann's voice is not in the repository, so every capture uses a **synthetic stored voice** I wrote into `localStorage`: ten vowels with plausible readings, a bass, range D2 to F4, tessitura G2 to D4, primo A3, secondo E♭4. The songs' own marks and findings come from that voice, not from his.

## Section 3: the counts, first

**Before any change, a page-one label that touches another label, a line, or a bar: 0 of 16 pages.** I counted on the live render, with the layout's own box convention (a label's box is 0.74 of its size above its baseline and 0.25 below), over every `<text>` in the figure against every other, every bar, and every horizontal rule. `contacts()` in `tessituragram-layout.ts` is that count, and its test passed before the change too: this figure never touched. Per page the figure carried 23 to 28 text items before.

So the "visual traffic jam" is crowding, not touching. In the before captures (`docs/sessions/insights-rearranged-shots/before/`) every sung pitch is named twice over: naturals in one column and sharps and flats in a second, both set to the left of the bars, at least 10.5 px apart (`NAME_GAP`) beside rows only 5.5 px apart, so the letters drift away from their bars, and the sharps' column sits against the naturals' wherever two semitones share a position (Dann's screenshot). That gave this change a measure a test can hold: a label must be at least half a pixel clear of anything, not merely not touching (`crowded()` in `tessituragram-layout.test.ts`). The before figure's compass stave stood 217 px wide of a 570 px figure at a 22 px line gap, against 8 px for the score's own staves.

## What the singer sees now

(`docs/sessions/insights-rearranged-shots/after/`, same 8 songs, same 2 languages.)

1. **The compass** is a small stave in the header's top-right corner: a clef, the compass's low and high pitch as two notes, and "Compass C♯3 to D4" (« Ambitus C♯3 à D4 ») under it. It stands 96 px from the page's right edge and 48 px from its top on **all 16 pages**, 69 to 77 px high and 70 to 80 px wide, at a line gap of 8 px.
2. **The histogram** runs over a quiet grey stave (five lines at 25 % ink) with its clef at 30 % ink, no notes. Each bar's height on the stave is its pitch. The freed width went to the bars: the longest bar may now run to 320 px (it was capped at 196), and the bars start about 75 px from the figure's left, after the clef.
3. **Each bar has one label, its own pitch.** A bar no semitone neighbour crowds has its label at its end. A run of semitone neighbours (rows 5.5 px apart under labels 10 px tall) keeps its labels in one aligned column past the run's longest bar, in pitch order, a label's height apart, each joined to its bar by a 0.6 px hairline that runs along its own row and then fans in; the hairlines cannot cross because the labels keep their order. A dark bar's findings and the longest bar's value follow its pitch on the same label (« F♯3 · 20 % », « C♯4 · m. 3 · [i] »).
4. **The order of page one:** phonation sentence, histogram, "Ilya reads your compatibility from these three measurements.", the table, **"Your compatibility, in short"**, the findings list where there is one, then the cycle dose, then the method line (the foot's, as before). "Nothing in this piece is flagged for your voice" now sits under the closing-verdict heading, and the findings heading shows only where findings exist.

## The change, with `path:line`

- `apps/web/src/lib/insights/tessituragram-layout.ts`
  - `:58` `BAR_CAP` 196 to 320; `:65` `FAN` 26 px between a run's longest bar and its label column.
  - `:118` `spreadByGaps` (a label's spread to a gap that depends on its height); `:157` `planLabelClusters` (which labels stand together, from the rows' places and line counts only, so the bar scale can reserve the room before the bars are drawn).
  - `:345` `barLabels`: one label a bar, the pitch first. `:397` `layoutTessituragram`: the compass, the barline, and the two name columns are gone; the stave lines run from the clef to the band as quiet lines; the key stands under the lowest label (`:743`).
- `apps/web/src/lib/insights/compass-stave.ts` (new): `layoutCompassStave`, line gap `COMPASS_LINE_GAP = 8` (`:20`), pure like the figure's layout.
- `apps/web/src/lib/insights/CompassStave.svelte` (new), `Tessituragram.svelte` (the compass, barline, solid stave, and the dose paragraph removed; the grey clef added).
- `apps/web/src/lib/insights/cycle-dose.ts` (new): `cycleDoseSentence`, the figure's own words and arithmetic, now a sentence of the page's.
- `apps/web/src/lib/insights/InsightsPane.svelte`: the corner stave through `TitleHeader`'s new `aside` slot (`:623`); the table is a component (`:648`); the closing verdict section (`:651-665`) with `noneInVerdict` (`:496`) and `verdictSectionShown` (`:497`); the dose after the findings (`:681`).
- `apps/web/src/lib/insights/FitTable.svelte` (new): the compatibility table, lifted out of `InsightsPane.svelte` unchanged with its helpers and styles, because the pane sat at its ratchet ceiling of 1,351 lines and the new work needed room. The pane is now 1,242 lines.
- `apps/web/src/lib/components/Paper/TitleHeader.svelte:67` (`aside` prop), `:103` and `:128-129`: the corner slot, and the title and metadata leave exactly its measured width.
- `apps/web/src/lib/i18n.ts:1625`: `insights.verdict.heading`, « Your compatibility, in short » / « Votre compatibilité, en bref », as ruled, and no other string.

**Desk decisions, outside or beside the ruling:**
- **The cycle dose leaves page one last, when nothing else can.** The page-one fit already defers the vowel list and then all but one finding to page two. The new closing-verdict heading costs a section of height, so on a French page that already overflowed its foot in the before capture (`sunless01` fr) the dose now goes to page two, where it stands last before that page's method line (`InsightsPane.svelte:334`). Result: 15 of 16 pages fit above their foot; `sun4` fr still overflows by 41 px and logs "nothing left to move", and it overflowed in the before capture too (the tessitura row's long French reason, visible in `before/sun4-fr.png`).
- **A label column rather than a label at every bar's end.** I built "label at the bar's end, step right if blocked" first. On Tchaikovsky's fourteen pitches, nine of them semitone neighbours, 3 of 14 labels found no place, because the rows are 5.5 px apart and the bars beside them are longer. The column with hairlines is what holds on a fully chromatic song, at the cost of a leader for each crowded bar.
- The stave's ink and the clef's: the lines at 25 % and the clef at 30 % of the stave ink are JUDGEMENT.

## Tests

- `tessituragram-layout.test.ts` (rewritten, 38 tests): touches nothing and crowds nothing, in both languages; one label a bar with its own pitch; no compass, barline, or left column; the bars' extra width; a label at its bar's end where nothing crowds it; one aligned column and a hairline each where semitones crowd; the labels in pitch order with non-crossing hairlines; dense chromatic runs, a treble run, two octaves of every semitone with passaggi, the half and the centre; the key, the band, the leader for "half the singing" and "centre", and the planning functions.
- `compass-stave.test.ts` (new, 8) and `cycle-dose.test.ts` (new, 3).
- `e2e/insights-page.test.ts` (new, Playwright, outside the eight gates): the compass stave is 96 px from the page's right edge and 48 px from its top in English, in French, and for a tenor's clef; the sections run in the ruled order and page one fits above its foot; and the live render has no label touching another label, a bar, or a line, in both languages.

## The eight gates

| # | Gate | Baseline `53035bd` | After row 59 | Now |
|---|---|---|---|---|
| 1 | `pnpm test:phonology` | 251 passed (251) | 251 | 251 passed (251) |
| 2 | `pnpm test:dictionary` | 235 passed (235) | 235 | 235 passed (235) |
| 3 | `pnpm --filter @ilya/web check` | 0 errors and 12 warnings in 5 files | same | 0 errors and 12 warnings in 5 files |
| 4 | `pnpm --filter @ilya/web test` | 2035 passed (2035) | 2066 | **2086 passed (2086)** |
| 5 | `pnpm --filter @ilya/score-parser test` | 650 passed, 5 skipped (655) | same | 650 passed, 5 skipped (655) |
| 6 | `pnpm test:blurb` | 145 passed (145) | 145 | 145 passed (145) |
| 7 | `pnpm test:integration` | 55 passed (55) | 55 | 55 passed (55) |
| 8 | `pnpm ratchets` | OK | OK | OK (409 source files) |

Gate 4 moved by +20 in this brief: +9 in `tessituragram-layout.test.ts` (29 tests became 38), +8 in the new `compass-stave.test.ts`, and +3 in the new `cycle-dose.test.ts`. The Playwright file `e2e/insights-page.test.ts` (3 tests) and the row 59 print guard both passed in the same run; they are outside the eight. `InsightsPane.svelte` now sits 109 lines under its ratchet ceiling (1,351), so `scripts/ratchets.json` can be lowered; I did not touch it.

## Could not establish

- **Dann's voice and songs.** Every capture is a synthetic voice on tracked fixtures. The bars, findings, and system heights on his own pages will differ.
- **The overflow before and after, in numbers.** I measured overflow after (above) but did not record the before; the before screenshots show the French `sunless01` and `sun4` pages overflowing their foot.
- **That the leaders read well to Dann.** The hairlines in a crowded run are the part of this I would want him to look at first. If they read as noise, the alternative on the table is shorter bars' labels at the bar's end with an angled leader to a free slot, which `slotWithLeader` already does for "half the singing" and "centre"; it failed on dense runs in this build.
- **Print.** `e2e/print-pages.test.ts` (row 59) still passes with this page, so an Insights print holds the pages it numbers. I did not look at a printed Insights page 2 holding the cycle dose.
- **Page two and three.** Pages 2 and 3 were not rearranged beyond the dose; I checked that they still draw, not their layout.

## Round two, after Dann's walk of 2026-10-09 (later that morning)

Dann's rulings: the histogram leads the page and the phonation sentence moves under it, above the compatibility table; the verdict and "nothing flagged" are one paragraph; the closing-verdict heading is **option A**, « How this key sits for you » / « Comment cette tonalité vous convient » (`i18n.ts:1625`, replacing "Your compatibility, in short"); a subtitle that wraps keeps the legend flush right on its last line (`TitleHeader.svelte`, the `wraps` state); and the shaded tessitura band is not negotiable, so one doubtful bar must not take it away.

**The tessitura and a doubtful bar.** The band used to be withheld whenever any bar failed the metre check (`tessituraRow`), because Pacheco's cut can turn on half a quaver. In *Without Sun*, no. 1 the doubtful bar is measure 17: 3/2 asks for 12 quavers, the notation reads 9/4, the parser's fractions 7/4, and it holds only E3. The new `apps/web/src/lib/insights/tessitura-robust.ts` cuts the band again under every reading the score offers of each doubtful bar: as written, as the fractions give it, as the metre asks, the bar absent, each bar alone absent. The band prints only if all give the same two ends; otherwise it is withheld as before. Measure 17's bar cannot move it, so *Without Sun* prints D3 to B♭3, the same band as the OMR read of the same song (`sun1`). Seven of eight captured songs drew the band before; now all eight do. The check is a sensitivity test over those readings, not a proof: where the metre itself was misread, the true bar may lie outside them, and the doubtful bars are still named on page two (`untrustedMeasures`).

Tests: `insights.test.ts` (the old "withholds when a measure does not add up" case became two: a doubtful bar that cannot move the band prints it unchanged, and a doubtful bar that holds the only G3 still withholds it and names the bar).

Gates after round two: all eight at baseline except gate 4; see the commit.
