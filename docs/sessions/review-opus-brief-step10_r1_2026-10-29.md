# Review: brief step 10 r1 (Opus, standing in for Fable, 2026-10-29)

Clone at `3fa4a218`. All paths are relative to the clone root unless absolute. Bars are 1-based. MusicXML `<measure number>` in this file equals the 1-based bar (P1 `number="17"` at line 1856, `number="18"` at line 1932 of the fixture). The parser's `measureIndex` is the bar minus 1.

## Verdict

SEND WITH AMENDMENTS. There are 6 amendments. Amendments 1 to 3 would each make Code stop or guess.

## What checks clean

- **Section 1's table against the truth file.** Verse 1, `measureIndex` 16 and 17: every onset, duration, MIDI number, text, and syllabic agree (`m16-0-1` 1/2, 52, «ночь» whole; rest 1/2 for 1/4; `m16-3-4` 3/8, 52, «о» start; `m16-9-8` 3/8, 52, «ди» middle; `m17-0-1` 3/8, 54, «но» middle; `m17-3-8` 1/8, 50, «ка» middle; `m17-1-2` 1/4, 50, «я.» end; rests at 3/4 for 1/2 and 5/4 for 1/4). `measureDurations` 16 and 17 are 3/2.
- **Verse 2 against the extract** (`truth-sunless-01-underlay_2026-10-29.json`, bars 17 and 18): `notʃʲ` whole, `ɑ` start, `dʲi` middle, `ˈno` middle, `kɑ` middle, `jɑ` end. The truth file's verse 2 agrees. The table writes `whole` as `single` and `start` as `begin` for verse 1 without saying so, but the values are right.
- **Pitches.** Fixture bar 17 is E3 (52) three times. Bar 18 is F#3 (54), then D3 (50) three times. These agree with the truth file.
- **Section 1's description of today's fixture.** Fixture lines 1856 to 2019, at `<divisions>16</divisions>` (line 35): bar 17 has durations 32, 16, 32, 32. That gives onsets 0, 1/2, 3/4, 5/4 and a 7/4 total. Bar 18 has 24 (dotted quarter), 8, 8, 8, 32 (rest), 16 (rest). The `.bak` bar 18 has 24, 8, 16, as the brief says. The description is right on onsets but incomplete; see amendment 1.
- **Piano alignment.** P2 bar 17 (`number="17"`, line 4795) and bar 18 (line 4870) each run 96 divisions, by `<backup>96`. After the change, the voice's bar 17 is 32+16+24+24 = 96 and bar 18 is 24+8+16+32+16 = 96. The piano part needs no change.
- **Other markup.** The fixture has no `<print>` element and no `width=` attribute. Bars 17 and 18 of P1 carry no `<tie>` or `<tied>`.
- **Question 5.** `clitic-seat.test.ts:46-47` reads `sunless-01-finale-lone-v.musicxml`. Its `truncatedXml` (lines 52 to 60) edits that same `xml`. Removing N.156's eighth from the main fixture does not touch it.

## Amendments

### 1. Bar 17's two halves are a 2:3 tuplet. The brief does not say so.

Evidence: fixture lines 1888 to 1893 and 1912 to 1917 carry `<time-modification><actual-notes>2</actual-notes><normal-notes>3</normal-notes>` and `<tuplet number="1" type="start"/>` and `type="stop"`. The `.bak` has the same at lines 1888 and 1912. The parser reads the tuplet into `duration.tuplet` (`packages/score-parser/src/musicxml-parser.ts:747-754`). The approved parsed score holds it at lines 5075 and 5127, and the approved SVG has one `tuplet="2"` bracket. Code would face a half note marked as a duplet and have to decide what to do with the marking.

In section 1, after "**half at 3/4, half at 5/4**", insert:

> (each `<duration>32</duration>`, `<type>half</type>`, with a 2:3 `<time-modification>` and a `<tuplet>` start or stop in `<notations>`, fixture lines 1888 to 1917)

Add this to section 2 item 1:

> In bar 17, each of the two notes at 3/4 and 9/8 becomes `<duration>24</duration>`, `<type>quarter</type>`, `<dot/>`. Remove its `<time-modification>`, and remove its `<notations>` element, which holds only the `<tuplet>`. The print's dotted quarters in 12/8 are not a tuplet.

### 2. The file holds no beams. "Beams as the converter writes them" names nothing.

Evidence: `grep -c '<beam'` on the fixture returns 0, and so does `<stem`. The converter is `musx2mxl 0.2.9` (fixture line 10).

In section 2 item 1, replace "beams as the converter writes them for the same values elsewhere in the file," with:

> no `<beam>` or `<stem>` (the file has none anywhere; the renderer beams by itself),

### 3. The bar 17 and 18 exemption is a `Set`, not an allow-list entry, and three tests use it.

Evidence: `fixture-rule.test.ts:319` reads `const UNREPAIRED = new Set([17, 18]);`. The `Set` is used at lines 325, 333, 345, and 350. Line 331 pins `toHaveLength(97)`. Line 350 filters the copy's comparison through `UNREPAIRED`. `ALLOWED` (line 105 on) has no bar 17 or 18 entry. `SHIFTED_READERS` (line 102) and the `LONE_V` reason at line 114 say "Re-point them when the tail is repaired."

Replace the last sentence of section 2 item 2 with:

> In `fixture-rule.test.ts`, delete `UNREPAIRED` (line 319) and its filters at 325, 333, and 345. Rewrite the test at 329 to 333 as 96 extract notes, 96 fixture notes, and no difference. At line 350, keep the copy's check and drop only the filter (the copy has more than 50 differences either way). Rewrite `SHIFTED_READERS` and the `LONE_V` reason at line 114 to name only the readers that stay on the copy, and drop the words "while its bars 17 and 18 are unrepaired". The comparison then runs on every bar.

### 4. Section 2 item 3 does not name the 13 files, and `replace-seat.test.ts` depends on N.156's eighth.

Evidence: `replace-seat.test.ts:10-12` and lines 68 to 70 split `m17-5-8`, «я.» as an eighth (`<duration>8</duration>` to `4`), and line 197 pins `m17-5-8`. After the change, the main fixture has no `m17-5-8`. «я.» becomes `m17-1-2` with duration 16, so `editNote(xml, at('m17-5-8'), ...)` finds nothing. Other dependencies: `punctuation-slot.test.ts:78-83` has an N.156 branch, "a cell short", that the repaired file will no longer take. `score-seat.test.ts:64` reads "whole since N.156". Step 8's report lists 11 items, with `row108.support.ts` standing for 3 more (report lines 24 and 60). It never states which 13.

After item 3's first sentence, insert:

> The files are: `score/score-seat.test.ts`, `score/punctuation-slot.test.ts`, `score/seated-text.test.ts`, `score/waiting-seat.test.ts`, `score/replace-seat.test.ts`, `text/lay-out-seat.test.ts`, `text/break-text.test.ts`, `typed-hyphens.test.ts` (its `load` calls at lines 281, 287, 316, 340, and 370), `score/row108.support.ts` `SUNLESS` (read by `text/relining.test.ts`, `score/several-lines.test.ts`, and `score/phrase-ends.test.ts`), and `e2e-phone/relining.test.ts`. `clitic-seat.test.ts` stays on the copy (N.111's lone «в»). `replace-seat.test.ts` splits the eighth `m17-5-8`, which the repaired file no longer has. Either keep it on the copy (its subject is an added note, not the eighth) or re-target its split to `m17-1-2`, a quarter, as two eighths. Report which you chose and why; this is a DESK DEFAULT. Where a comment or branch names N.156's split (`punctuation-slot.test.ts:78-83`, `score-seat.test.ts:64`), say whether it still holds on the main fixture.

### 5. Section 4's list leaves out files that read the main fixture.

Evidence: grep for `sunless-01-engraved` outside `docs/` turns up these readers, which section 4 does not name. Unit tests: `old-spelling.test.ts:141`, `score/correction.test.ts:538`, `score/loupe-render.test.ts:25` (pins 18 measures at line 97 and, for every measure, `stuck` `['head>a']` and `minGap` within 0.5 of 38.18 at lines 98 to 103, which bar 17's new spacing may move), `tempo/tempo.test.ts:129`, `text/break-here.test.ts:51`, `approval/staff-renderer-real-fixture.approval.test.ts:66`, and `packages/score-parser/src/approval/musicxml-parser.approval.test.ts:140`. Playwright: `e2e-phone/input-views.test.ts:26`, `e2e-phone/loupe-scan.test.ts:43`, `e2e-phone/text-witness.test.ts:128`, and `e2e/insights-page`, `markup-pages-lose-no-bars`, `octave-line` (line 35), `pages-without-gaps`, `print-pages`, `singer-paths`, and `tempo`.

At the end of section 4, add:

> Also read the main fixture, and run: `old-spelling.test.ts`, `score/correction.test.ts`, `score/loupe-render.test.ts` (watch its per-measure `minGap` on measure index 16), `tempo/tempo.test.ts`, `text/break-here.test.ts`, and both approval tests. Run the Playwright files that read it, as step 8 did: `e2e-phone/input-views`, `loupe-scan`, `text-witness`, `relining`, and `e2e/insights-page`, `markup-pages-lose-no-bars`, `octave-line`, `pages-without-gaps`, `print-pages`, `singer-paths`, and `tempo`. Step 8's baseline: `insights-page` and `print-pages` fail on the original too, and `singer-paths` fails one French heading. Report any change from that baseline.

### 6. Section 2 item 5 and item 6 need to expect the tuplet and the md5.

Evidence: step 8's report (line 8) found no duration field in its parsed-score diff. This step changes durations, `base`, `dots`, and `tuplet` on two notes, and it changes the ids `m16-5-4` to `m16-9-8` and `m17-5-8` to none. The warnings file at `packages/score-parser/src/approval/__approved__/sunless-01-engraved.warnings.json` holds exactly the two warnings the brief expects to go.

Append to item 5:

> Expect in the parsed score: bar 17's last two notes change `base`, `dots`, `fraction`, and lose `tuplet`; ids `m16-5-4` and `m17-5-8` go and `m16-9-8` arrives; bar 18's third note becomes a quarter. Expect in the SVG: the one `tuplet="2"` bracket goes. Expect the warnings file to become `[]`. Any other moved field is a finding: report it and stop.

Append to item 6:

> Give the new md5.

## NOT ESTABLISHED

- What "gates as in brief r2 section 8" are, and what gate 4 counts. The r2 brief is not in this clone. Step 8's report line 11 gives figures only.
- Whether the SVG's "plain noteheads" count separates open (half) from filled noteheads. If it does, the two bar 17 noteheads change glyph as well as the count dropping from 97 to 96. I did not read the renderer.
- Whether `loupe-render.test.ts`'s per-measure `minGap` bounds survive bar 17's new rhythm. I did not run any test.
- Whether 12/8 (the file's time signature, fixture lines 66 and 67) and the truth file's 3/2 come from the same musx setting. The lengths are equal.
- The exact count of "13" in step 8's own reckoning.
- The "12:4x" in the brief's DESK DEFAULT time is a placeholder. The desk needs to fill it in.
