# Review: lane 82 as built, the phonation-per-pitch figure (r1, 2026-11-22)

Reviewer: Fable 5.2, as a subagent, under `CONTRACT.md` section 1 item 19. Read-only git throughout. I read branch `cloud-lane-82` at `13f34634` with `git show`, against its base `c470e03d` and against `Shane` at `308d2ad0`. I ran no gate and no browser. Every `path:line` below is a line I read in this session on `cloud-lane-82` unless another ref is named. Labels: SEEN is a rendered picture I opened, RAN is code I executed, READ is source or data only. I executed no project code, so nothing here is RAN.

## Verdict

**MERGE WITH FIXES.** No fix is a code change that has to land before the merge. The lane does what it set out to do, it draws the permitted bracket, and the merge cannot conflict.

Fixes, ranked.

With the merge (records, no code):

1. **Record the departure in one line in `OPEN.md`.** The lane replaces "one row per sung pitch" with "one row per semitone" and nothing in the tree names that as a departure from Dann's ruling of 2026-09-23 03:15. Testable: `grep -n "every semitone" docs/memory/OPEN.md` returns a line that names the 2026-09-23 03:15 default, the reason, and the date.
2. **Record the lost brief** (`QUEUE.md` or `ENVIRONMENT.md`). Testable: a line that says the lane 82 brief r1 and r2 and Fable's r1 review of it are not in the tree.

Before the walk:

3. **Run the two Playwright suites the lane touches on the merge**: `e2e/insights-page.test.ts` (4 tests) and `e2e-phone/insights-label.test.ts` (4 tests). The lane reports only the first. Testable: 8 of 8 pass, and the new test's wall time is under the 60 s timeout (`apps/web/playwright.config.ts:19`).
4. **Run the footer assertion on the Tchaikovsky fixture, at `c470e03d` and at the merge.** The lane's own numbers show block bottoms past the footer on that fixture before and after (finding 9). Testable: the assertion at `apps/web/e2e/insights-page.test.ts:115-127` run with `tchaikovsky-op38-3-voice.musicxml`, English and French, zone C2 to D4, at both commits.
5. **Correct the component's header comment**, which still describes the old axis (`PitchSeconds.svelte:8-12`). Testable: the header no longer says "One row per sung pitch" or "past the nearest sung row".
6. **Unsung rows follow the piece's own spelling of that pitch class before the key's** (finding 7). I propose this as a DESK DEFAULT; the picture goes to Dann at the walk. Testable: on the Mussorgsky fixture with zone C2 to D4 the column shows `B♭2` and `A♭2`, not `A♯2` and `G♯2`.

Later:

7. **Move the row builder to a pure `.ts` function with a vitest test**, so a gate protects it (finding 11). Testable: gate 4 rises by the new tests' count.
8. **Assert what the test's own comment claims** (finding 12), and give the eleven-load test its own timeout or split it.
9. **Measure the widest name once per page load, not twice per figure** (finding 13).

## What the lane does, in a singer's terms

The figure lists pitches down its left edge and draws a bar for the time sung on each. Before the lane, only sung pitches had a line. A singer whose comfortable zone reaches below the piece saw the zone's bracket run on past the last line into empty paper, with no pitch names beside it, and the bracket's top corner struck the words "secondo passaggio D♯4".

After the lane, every semitone from the highest to the lowest of the sung pitches, the zone's two ends, and both passaggi has a line and a name. A pitch the piece never sings has a name and no bar. The bracket now begins and ends on named lines. The bracket also stands farther from the bars, by the measured width of the longest passaggio name the figure can write, so the name and the bracket's corner do not touch. The figure is taller: 45 px on Tchaikovsky op. 38 no. 3 and 15 px on Mussorgsky's Sunless no. 1 at the letter page.

## Findings

### 1. Every semitone of the scale gets a row. READ and SEEN

`PitchSeconds.svelte:120-136` builds rows from `hi` down to `lo` in steps of one MIDI number (`:131`), where `hi` and `lo` are the extremes of the sung rows (`:125`), the typed zone's ends (`:123`), and the typed passaggi (`:124`). A row with no phonation carries `quavers: 0` (`:133`) and draws no bar (`:195`). `rawY` is linear in MIDI number (`:140-142`). SEEN in `after-tchai-default-en-1440.png`: 22 named rows from E4 to G2, bars on 14.

### 2. The bracket lies inside the rows. READ and SEEN

The bracket's top and bottom are `rawY` of the typed zone's ends, inset 1 px (`:160-165`). Both ends are in the row set by `:123`, so both lie between row 0's top and the last row's bottom. SEEN in `after-tchai-default-en-1440.png` and `after-sunless-below-en-1440.png`: the bracket ends level with `G2` and `C2`. SEEN in `before-tchai-default-en-1440.png`: it ran about nine rows past `B2`.

### 3. The passaggio name clears the tick. READ and SEEN

The name starts at `X0 + BAR_W + LINE_LABEL` (`:199`). The tick spans `BRACKET_X - 4` to `BRACKET_X` (`:202`), and `BRACKET_X = X0 + BAR_W + NAMES` (`:56`) with `NAMES = LINE_LABEL + nameW + 6 + 4` (`:54`). So the widest name ends 10 px left of `BRACKET_X` and 6 px left of the tick. `nameW` is measured over both languages' two phrases, seven letters, five accidentals, and ten octave digits (`:61-73`), in a hidden `.line-name` text (`:209`) after `document.fonts.ready` (`:46-48`, `:57-60`). SEEN: in the four after pictures I opened at 1440 the name ends about 16 px before the tick; in `before-tchai-default-en-1440.png` and `before-sunless-default-fr-1440.png` the tick strikes through `D♯4`.

### 4. The typed zone's low end has a row. READ and SEEN

`:123` and `:129`. SEEN: `G2` in the default pictures, `C2` in the below pictures.

### 5. Which bracket the figure draws. READ. This is the permitted bracket

- The bracket is drawn only from the `typedTessitura` prop (`PitchSeconds.svelte:160-165`, `:201-205`), which is `profile.tessitura` (`singer-blocks.ts:307`).
- Its caption is `insights.r2.yourTessitura` (`:81`, `:203`): "your comfortable working zone, typed" and « votre zone de travail confortable, telle que vous l’avez indiquée » (`i18n.ts:2076`). Under it the typed span prints through `insights.fit.span` (`:204`; `i18n.ts:1824`): "G2 to D4", « G2 à D4 ». The legend repeats the same key (`:217`).
- « la moitié du temps chanté » is live in the string table under `insights.figure.halfMass` (`i18n.ts:1965`). Its only reader is `tessituragram-layout.ts:667`, which serves `Tessituragram.svelte:90`. No `<Tessituragram` exists under `apps/web/src`, and `SingerBlock.svelte:141` draws `PitchSeconds`. So the string is not on this figure, and the half-mass bracket and the centre tick are not drawn. `halfMass` and `centre` are still computed (`insights.ts:662-663`) and `PitchSeconds` reads neither.
- The lane changes none of this. The bracket was the typed one at the base too (`c470e03d:PitchSeconds.svelte:129-134`).

### 6. The `key` field. READ

- Additive: `key?: KeySignature | null` (`insights.ts:240-241`), set at `:660`. The only reader is `PitchSeconds.svelte:133`. The test literals that build a `TessituragramModel` (`tessituragram-layout.test.ts:64`, `:82`) omit it and still type-check because it is optional.
- **Written or sounding key: settled. It is the key the singer chose.** `tessituragram()` receives `analysisScore` (`insights.ts:792`). In the pane that is `scoreInPerformanceOrder(readingScore).score` (`InsightsPane.svelte:179`), and `readingScore` is `keyRuler.draw(printedReading)` (`:178`), which is `drawInKey` (`transposition-ruler-state.svelte.ts:130-132`), which is `engraveInKey` (`transposition-ruler.ts:177-179`). `engraveInKey` moves every entry of `keySignatures` (`packages/score-parser/src/transposition.ts:348`) and respells every sung note in the new key. `scoreInPerformanceOrder` replaces only `vocalLine` (`packages/score-parser/src/performance-order.ts:102`). So under a transposition the sung rows and the unsung rows are both spelled in the chosen key. With no key chosen it is the printed key. The lane's NOT ESTABLISHED on this point is closed.
- A piece that changes key is spelled in its first key on unsung rows only. Sung rows keep their sung spelling (`:133`). I judge the first-key choice acceptable; the visible effect is the same class as finding 7 and the repair there covers it.

### 7. One column spells a pitch class two ways. SEEN

`after-sunless-below-en-1440.png` and `after-sunless-default-fr-1440.png`: the column reads `B♭3` and `A♭3` (sung) and, lower down, `A♯2` and `G♯2` (unsung). The cause is `:133`: an unsung row falls to `spellPitch` with the key, and tier 2 of `spellPitch` puts a chromatic note on the key's side (`packages/score-parser/src/transposition.ts:192-196`), which is sharps in D major, while the piece writes its flat sixth as B♭.

A musician reads that column and sees an inconsistency. The repair is small: before the key, use the spelling the piece sings for that pitch class in another octave. I coin "pitch-class precedent" for it. The typed pitch stays ahead of both, because it matches the passaggio caption beside it.

### 8. The old test could not fail on a line. READ

At the base, `lines` held raw `SVGRect` objects and the comparison built `{ ...l, height: Math.max(l.height, 1) }` (`c470e03d:apps/web/e2e/insights-page.test.ts`, the removed lines in the diff). An `SVGRect` is a `DOMRect`; its `x`, `y`, `width`, and `height` are accessors on the prototype, so the spread copies none of them and `hit` compares against `undefined`. Text against a line or the bracket, and a passaggio line against a bar, never registered. Text against text and text against a bar did work, because those boxes were passed whole. The lane's `plain` (`insights-page.test.ts:174-177` on the branch) reads the four numbers out. I verified this by reading and by the platform's definition of `DOMRect`; I did not run a browser.

The new test fails on the old component by reading: the old rows were sung pitches only, so "no semitone missing" (`:251`) fails wherever the piece skips a semitone, and "bracket inside rows" (`:247`) fails because the old bracket ran past the last row. The lane reports it ran this and saw the second failure.

### 9. Block bottoms past the footer on Tchaikovsky, before and after. READ, from the lane's own JSON

The lane's probe records, per page, the lowest block bottom. The footer's top is at 942.48 on a 1056 page (`catalogue-shared-properties_r1_2026-11-22.md`, row 15). On the Tchaikovsky fixture with the seeded voice:

- `before-tchai-default-en-1440.json` and `after-tchai-default-en-1440.json`, page 2: last block bottom **1112 on a 1056 page**, identical before and after.
- English pages 4 and 5: 933 and 970 before, 970 and 1013 after (default); 970 and 1013 before, 1030 and 903 after (below).
- French: 984 on page 2 before and after; 985 and 1013 after (below).

Every Mussorgsky page is under 942 before and after (highest 914).

So either Tchaikovsky's INSIGHTS overruns its footer with this voice at the base already, or the probe's selector counts something a reader does not see. I did not establish which. It is pre-existing, so it is not this lane's defect, but the lane moves the breaks and its highest value rises from 1013 to 1030. The existing footer check runs on Mussorgsky only (`insights-page.test.ts:19`, `:115-127`). Fix 4 settles it.

### 10. The shared page frame. READ

The diff under `apps/` touches three files: `PitchSeconds.svelte`, four lines of `insights.ts`, and one e2e test. None is a frame file. All twenty-four catalogue rows are properties of the sheet, the headers, the footer, and the content window's edges; the figure is a block inside the column. None of the twenty-four moves by construction. I did not measure a rendered page.

The catalogue's own defect 1 is what the taller figure leans on: INSIGHTS' column has no CSS bottom, and only the capacity arithmetic (`InsightsPane.svelte:456-470`) keeps content above the footer. The moved breaks and the seventh French page are content, which the catalogue lists as a legitimate difference (its item 5).

### 11. No gate protects the lane's guarantees. READ

The row builder is a `$derived.by` inside the component (`PitchSeconds.svelte:120-136`). Its only tests are Playwright, and no gate runs Playwright (`ENVIRONMENT.md:5018`; the lane's own report, "gate 4 does not count Playwright"). The tests can fail, which the old one could not, but they fail only when someone runs them by hand.

### 12. The test asserts less than its comment says. READ

`insights-page.test.ts:252` says the zone's two ends and the passaggi each have a row; `:253-254` assert the low end only. The high end is covered indirectly by "bracket inside rows". The passaggi are not asserted. The new test also loads the app eleven times in one test with no `test.setTimeout`, under a 60 s limit (`playwright.config.ts:19`). The lane reports it passes on the Mac. I did not establish its wall time, and the workspace's two cores are slower.

### 13. 1,400 forced text measurements, twice per figure. READ

`widestLineName` sets `textContent` and calls `getComputedTextLength` 1,400 times (`:61-73`), once on mount and once after fonts (`:57-60`), for every `PitchSeconds` on the page. The answer depends only on the font. Until it lands, `NAMES` is 98 and the bracket then moves about 31 px to its measured place. I did not establish whether a singer sees the move or the cost on a phone; a performance trace on a phone settles it.

### 14. What the lane did and did not report

- The header comment (`:8-12`) still says "One row per sung pitch" and that an unsung edge "sits a row's height per semitone past the nearest sung row". Stale, not reported.
- The comment at `:40-42` about the bars' width now sits above the probe's state, thirteen lines from `BAR_W` (`:55`). The comment at `:144` lost its indent. Neither is reported; both are trivial.
- The figures folder holds 65 files (32 pictures, 32 JSON, one probe script), not 33.
- The lane's "390" pictures are the letter page scaled in a 390 px desktop viewport (`svgW` 238.9 for a 570 px figure). They are not the phone project (`playwright.config.ts:45-57`, `isMobile`). The lane does not report running `e2e-phone/insights-label.test.ts`, which measures this figure's caption at 390 px. The bracket's new place leaves the caption less room (`:82`).
- Reported and confirmed: the seeded voice renamed from `'Dann'` to `'Voice 1'` (`insights-page.test.ts:41`), the `key` field, the moved breaks.

### 15. The pre-existing glyph defect. SEEN, noted only

`before-tchai-default-en-1440.png` shows the row label as `D♯3` with an upright sign and the caption as `D ♯4` with a slanted sign and a gap. It is in the before pictures, so it is not this lane's. `INBOX.md:999` already carries it.

## The ruled design, item by item

1. **Tessituragram design, 2026-09-23, "only the sharps and flats the piece sings get a row and a name" (`OPEN.md`, the APPROVED block).** DEPARTED FROM. Design round 2 kept that default as "one row per sung pitch" (the component's own header, `:8`). The lane draws every semitone. **The departure is not reported as one**: the lane's report describes the change and calls four rows "the accepted gain" without naming the ruling, and `STATE.md:23` and `QUEUE.md:9` describe it the same way. **The reason holds** for rows beyond the piece: Dann's own report of 2026-11-22 03:37 is that the axis does not reach his typed zone (`QUEUE.md:15`), and the ruling's own condition for departing is a singer misreading a real score. For rows inside the piece's range (four on Tchaikovsky, one on Mussorgsky) the reason is a uniform scale, which is sound, and the cost is the compact, song-specific column Dann called great. That part is his to see. The other bullets hold: tessitura shaded (`:167-174`, `:191`), passaggi dashed (`:251`).
2. **No half-mass bracket, no centre tick, 2026-10-11 19:15.** KEPT. Finding 5.
3. **The chart stays plain, 2026-11-02 01:22.** KEPT. `PitchSeconds` reads no `tags` and draws no finding mark; an unsung row adds a name only.
4. **"Primo passaggio" and "secondo passaggio" in full.** KEPT. `i18n.ts:1949-1950`; the lane reserves the full term's width (`:62`) and shortens nothing. SEEN in full in all eight pictures I opened, both languages, 1440 and the scaled 390. The French term is italic; the whole `.line-name` is italic in both languages (`:235-237`), as before the lane.
5. **Pitch spelling, 2026-10-11 04:58.** KEPT. Every name goes through `pitchName` (`:33`, `:194`, `:199`, `:204`; `note-picker.ts:155-170`). Finding 7 is about which spelling, not its form.
6. **ONE VOWEL PER NOTE.** Does not bear on this lane. The lane seats nothing and reads no vowel.
7. **No control on the printed page.** KEPT. The lane adds one hidden, zero-size measuring `<svg>` (`:209`) and no control.

## The merge

- **No file is touched by both sides.** `git diff --name-only c470e03d..Shane` lists 20 files and `c470e03d..cloud-lane-82` lists 69; their intersection is empty. The merge cannot conflict textually.
- `Shane`'s side changes nothing under `apps/web/src/lib/insights`, `apps/web/e2e`, `i18n.ts`, or `apps/web/src/lib/voice`. The lane's one new import, `spellPitch`, lives in `packages/score-parser/src/transposition.ts`, which `Shane`'s side does not touch.
- `scripts/ratchets.json` on `Shane` lowers one ceiling (`staff-renderer.ts`, 3414 to 3413). The lane does not touch that file. `InsightsPane.svelte` stays at 668 against its ceiling of 668.
- **Expected gates on the merge:** gate 4 `6804 passed | 1 skipped (6805)` and gate 5 `911 passed | 5 skipped (916)`, both `Shane`'s figures unchanged, because the lane adds no vitest test and no score-parser test. Gate 3 `0 errors and 12 warnings in 5 files` and gate 8 `ratchets: OK.` as the lane measured. Gates 1, 2, 6, and 7 at 462, 248, 178, and 159 are the lane's figures; I did not measure any gate.
- Order, from `ENVIRONMENT.md:5117`: merge first, then `git add` of new files.

## The three items the lane leaves open

1. **The moved page breaks, and French gaining a page.** Not a defect of the lane and not taste. It is content following a taller figure. What is owed is fix 4, because the lane's numbers show an older overrun on the same fixture.
2. **The key spelling of unsung rows.** A small defect with a cheap repair (finding 7, fix 6), then one picture for Dann. The lane frames it as the singer's zone ends against the key; the visible fault is the piece's own flats against the key's sharps.
3. **The 6 + 4 px clearance.** Neither. It is a desk-level constant, the gap looks even in every picture I opened, and it does not need Dann. DESK DEFAULT: keep.

## What I could not establish

- I did not establish whether Tchaikovsky's INSIGHTS overruns its footer with the seeded voice (finding 9). Fix 4 settles it.
- I did not establish that `e2e-phone/insights-label.test.ts` passes on the branch, or what the figure looks like in the phone project. Fix 3 settles it.
- I did not establish the new test's wall time against its 60 s limit.
- I did not establish the measured value of `nameW`. From the pictures the bracket moves about 31 px, so `NAMES` is near 129.
- I did not establish print. No printed page was rendered by the lane or by me.
- I did not read the lost brief, its r2, or Fable's r1 review of it. None is in `docs/sessions/` on either ref; `QUEUE.md:15` is the only record that they existed.
- I opened 8 of the 32 pictures: `before-tchai-default-en-1440`, `after-tchai-default-en-1440`, `after-sunless-below-en-1440`, `after-sunless-default-fr-1440`, `before-sunless-default-fr-1440`, `after-tchai-below-fr-390`, `before-tchai-below-fr-390`, `after-sunless-default-fr-390`, and I read all 32 JSON files. `after-tchai-below-en-390` I staged and did not open.
- To open the pictures I copied nine of them out of the branch into `~/Downloads/_fable-lane82-review-2026-11-22/`, because a file outside a connected folder cannot be staged. I could not delete that folder; it is safe to remove.

## For Dann's eye (taste only)

1. **The rows inside the piece's range that the piece does not sing.** `before-tchai-default-en-1440.png` beside `after-tchai-default-en-1440.png`: the after figure adds `C4`, `F3`, and `C3` between sung rows (and `D♯4`, which is his own secondo). The scale is now even, and the column is no longer only this song's pitches. His 2026-09-23 idea was the second; the lane chose the first.
2. **`B♭3` above and `A♯2` below in one column**, `after-sunless-below-en-1440.png`, if fix 6 is not taken first.

Terms: "pitch-class precedent" is coined here. "Typed zone", "sung row", and "unsung row" are adopted from the lane's report and the component.
