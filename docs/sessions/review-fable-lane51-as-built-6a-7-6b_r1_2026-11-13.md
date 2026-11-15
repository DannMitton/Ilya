# Fable review: N.199 lane 51 as built, Steps 6a, 7, and 6b

**Verdict: SHIP WITH AMENDMENTS.** One blocker, tied to the planned metadata strip; six amendments; five notes.

2026-11-13. `fc089b73..ad569e42`. Paths are under `apps/web/src/lib/`; line numbers are at the tip.

## What I ran and read

- A script over the 49 N.199 keys in `i18n.ts` against `OPEN.md` section N.199 and brief r5 section 7.
- The diff of every file in the charge, the three reports, and four pictures.
- The Source Sans 3 file Google serves for `app.html:49` (v20, Latin), opened with fontTools.
- Not run: the gates, Playwright, a production build, a microphone.

## Found sound

- **Strings.** 47 of 48 new keys and `pacifier.pause` match their ratified text character for character, English and French. Every French apostrophe is U+2019 and every French colon has U+00A0 before it. No em dash. The key count is 1,271 and the index agrees (`capture.` 32, `sheet.` 16).
- **`tv()`** (`i18n.ts:2604`) fills over `t()` and leaves an unfilled placeholder visible.
- **`PAUSE_MS`** is 3000 (`voice/count-in.ts:22`). The count words are gone and `{count}` is a digit.
- **Zones.** Both branches take `ground.fR2[vowel]` (`voice/chart/zones.ts:106`, `:117`).
- **The hide toggle** is `disabled={running}` (`voice/VowelCapture.svelte:346`), so it is off through the landing too.
- **`PLATES` and `creditLine`** match the 11:35 ruling. Bolla's year is 1981 in the publisher's catalogue record, so the credit's year is right.
- **`placeLabels`** is pure, and its test covers none, three, and ten sung, bass and soprano.

## Findings

1. **`voice/chart/drawings.ts:55`, `:74`. Blocker for the amendment that strips `<metadata>`.** A moving group ends at the literal `<metadata>`. Once that block is gone, `indexOf` returns -1, `slice(…, -1)` keeps the closing tags, and nothing throws. Fix, in the same commit as the strip: in `groupInner`, `const b = svg.indexOf(until, a); if (b < 0) throw new Error(...)`, and at `:74` pass `'</svg>'` as `until`. The existing trailing `</g>` replace then holds. Add a test that no moving group contains `svg`.

2. **`i18n.ts:2546`, `sheet.legend.zones`. Amend.** The seated text ("outer vowels", "Lavender marks the inner vowels…") is not in `OPEN.md`, which still carries the 10:48 text. Step 7's report says it was ratified at 12:01 in a desk message. NOT ESTABLISHED from the tree. Fix: record the 12:01 ruling in `OPEN.md` with Dann's words, or seat the 10:48 text. Separately, a challenge for Dann: on the lane's own all-ten picture [a] is the lowest corner of the outline and [ɪ] lies on it, so "inner" is untrue of two of the four lavender vowels, and a phonetician will see it. A truer line names them as the four vowels Ilya can work out from the others. The wording is his.

3. **`voice/VowelCapture.svelte:506`. Amend.** `.cue-row` has `height: 4.75rem`, which holds three lines. A notice takes the same row, and `pacifier.error.micPermission` is 113 characters in French (four lines at 390 px), so it spills over the bar and the buttons. Fix: `min-height: 4.75rem`.

4. **`voice/chart/ChartLayers.svelte:145`. Amend.** `rotate(90)` turns the glyphs' tops toward the frame, so the fR1 label straddles the frame line (`phone-fr-4-all-ten.png`). Fix: `translate({width - 5 - labelSize} {height / 2}) rotate(90)`.

5. **`voice/chart/VowelChart.svelte:45` with `ChartLayers.svelte:141`. Amend.** At a phone's width the axis words render at about 8 CSS px and the "R2" subscript near 6, in `--ink-tertiary`. Contrast passes (about 5.2 to 1); the size does not read. Fix: bind the chart's `clientWidth` and pass `labelSize={Math.round(11 * CHART_W / width)}` so the words hold 11 CSS px, or drop the axis words on the phone and keep `capture.explain`. Dann's eye decides between the two.

6. **`voice/FrSym.svelte:27`. Amend.** Established: the served Source Sans 3 has no `smcp` or `c2sc` feature (GSUB holds `ccmp dnom frac liga locl numr pnum`). The browser therefore synthesizes the small capital: a scaled, lighter R beside a full-weight numeral, on the live roster and in the axis words. Fix, one of: self-host a Source Sans 3 cut with small capitals, or set the R as a plain capital at a fixed smaller size with matched weight. Dann sees `roster-header-after.png` at size either way.

7. **`voice/VowelCapture.svelte` `.stop` (`:606`, with `.actions` at `:582`). Amend.** « Tout recommencer » breaks to two lines and touches the pill's edge on the phone (`phone-fr-4-all-ten.png`). Fix: `.actions { flex-wrap: wrap }` with `.stop { flex: 1 0 auto; padding: 0 1rem; white-space: nowrap }`.

## Notes

8. `voice/FrSym.svelte:16`. `aria-label` on a bare `<span>` is not reliably announced, and its children are hidden, so the sheet's two column heads can both read "Hz and note". Fix: add `role="img"`. Older than this lane.
9. `voice/VowelCapture.svelte:162`. The rest effect no longer re-runs at idle. If `model.full` ever changes during a landing after the phase effect has read it, the view rests on the old extent. Not seen. A guard: `motion.to(model.full, 0)` when the landing ends.
10. `voice/chart/ChartLayers.svelte:81`. Labels are placed again on every frame of a zoom, so a symbol can change side mid-move. Watch for it on the walk.
11. `sources.ts:346`. Learn cites "Bolla 1980" for the book the credit dates 1981. The catalogue says 1981. Correct Learn (English `:3382`, French `:1352`) under its own number.
12. The live wheel now speaks the 13-word pause line, unseen. One picture of it in the pause, in French, before the ship.

## Could not establish

The landing and the cancel in motion; the e2e results; the plate numbers against the book; the 12:01 ruling's words.
