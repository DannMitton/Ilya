# Memo: N.102 increment 1, the courtesy accidental across a barline

Built 2026-09-02 against `21e9ce2`, 'N.105: "Not now" lasts thirty days', on
branch `Shane`. The working tree was dirty at the start with
`docs/memory/INBOX.md`, `docs/memory/STATE.md`, and the untracked brief
`docs/sessions/brief-n102-courtesy-accidentals_r1_2026-09-02.md`; nothing else
was modified before I began.

Ilya now draws a courtesy accidental across a barline. Two of them appear on
Without Sun song 1, both measured on the page: a parenthesized natural in bar 3
and a parenthesized sharp in bar 6. Nothing collides. The narrowest clearance on
the document is **4.935 units**, between the barline and the bar 3 cluster, and
the narrowest the rule can produce anywhere at production size is **3.333
units**. N.103 gets no case from this document.

---

## 1. What changed

Five source files: three I built in, and two whose citations my line count moved.

### The glyph registry

- `packages/score-parser/src/smufl-metadata.ts:100-108` adds
  `accidentalParensLeft: 0xe26a` and `accidentalParensRight: 0xe26b` to
  `SMUFL_CODEPOINTS`, with the provenance in the comment above them.
  `REQUIRED_GLYPHS` goes from 38 names to 40.

### The renderer

- `packages/score-parser/src/staff-renderer.ts:1148-1163` declares
  `prevMeasureAcc`, the sung line's accidental state as it stood at the end of
  the measure before this one.
- `:1350-1353` carries the outgoing measure's state into it at a measure change,
  and only when the new index is the outgoing index plus one.
- `:1416-1488` is the courtesy itself: the `else` branch of the required
  accidental at `:1397`, its three conditions, the SMuFL cluster, the primitive
  fallback, and the two writes that make it draw once.
- `:1581-1583` records that the turning layer draws no courtesy.

### The tests

- `packages/score-parser/src/staff-renderer.test.ts:941-1157` adds
  `describe('courtesy accidentals across a barline (N.102 increment 1)')`, twelve
  tests on a fixture of its own. `:24` and `:26` add the two type imports the
  fixture needs.

### Citations this edit moved

Three live-code citations pointed past an insertion point. All three are
repaired, verified line by line against the file they cite:

| in | was | now | what it cites |
|---|---|---|---|
| `packages/score-parser/src/staff-renderer.test.ts:971` | `staff-renderer.ts:1376` | `staff-renderer.ts:1396` | the `inEffect` test |
| `apps/web/src/lib/shane/loupe.test.ts:445` | `staff-renderer.ts:1383` | `staff-renderer.ts:1403` | the accidental's `partOfEvent` call |
| `apps/web/src/lib/shane/Loupe.svelte:536` | `staff-renderer.ts:1214-1340` | `staff-renderer.ts:1230-1360` | the tacet pass through the barline draw |

Two other live citations sit below every insertion point and are untouched:
`staff-renderer.ts:1504` cites `smufl-metadata.ts:88`, and `Loupe.svelte:165`
and `:687` cite `smufl-metadata.ts:85-87`. The nine lines I added to
`smufl-metadata.ts` land at `:100`, so nothing before that line moved.

**Citations inside memos and briefs are left alone.** They record what a file
said on the day they were written, and rewriting them would make a dated record
lie about its own date.

---

## 2. The rule as built

Gould p.81, extraction v7 rule 121, in the desk's distillation at
`brief-n102-courtesy-accidentals_r1_2026-09-02.md` §2: a pitch altered in one
bar and repeated in the next carries either a restated accidental or an explicit
cancellation, even though the barline has reset it, and even where the key
signature already restores the pitch.

**The rule's own words are NOT ESTABLISHED here.**
`claude/gould-vocal-engraving-rules_v7_2026-08-05.md` is not on this machine, so
what I built is the brief's paraphrase, not a quotation. The code comments say
so at the point of use. The same holds for rule 116, whose only appearance
anywhere on this machine is the brief's own parenthetical.

The branch fires when three conditions hold together:

1. `prevMeasureAcc` carries this (step, octave), so the pitch was altered in the
   directly preceding bar.
2. Its alter there differs from the alter now.
3. No accidental has been stated for this (step, octave) yet in this bar.

Condition 3 is the one that is not decorative. Without it, a bar that states a
required natural and then repeats the pitch would draw a second, parenthesized
natural, because the previous bar's flat is still sitting in `prevMeasureAcc`.

The branch is an `else`, so it can only run where the required accidental drew
nothing. A required accidental is never parenthesized, and nothing about it
changed.

After it draws, the code writes `measureAcc[accKey]` and deletes the key from
`prevMeasureAcc`. Either write alone would make it draw once. Both are there
because the invariant is worth stating rather than inferring.

**A courtesy cluster can only ever hold a flat, a natural, or a sharp.** The
branch requires the note's alter to equal what is in effect, and with no
accidental stated this bar, what is in effect is `keySignatureAlter`, which
returns only -1, 0, or +1. A double flat or double sharp cannot reach this
branch. That is by construction, not by luck, and §4's clearance table depends
on it.

### The two desk defaults, as briefed

- **Sung line only.** The turning layer keeps its own per-measure carry and
  draws no courtesy. A test builds the exact shape that earns one on the sung
  line, using a profile whose turning pitch is D sharp 4 in bar 1 and D natural 4
  in bar 2, and asserts that the bar 1 sage sharp is drawn and no parenthesis of
  any colour reaches the page.
- **Parenthesized**, in `#1a1612`, the same ink as every required accidental.
  A test reads the fill off both parenthesis glyphs and fails on anything else,
  so the mark can never drift into the analysis layer's lavender.

Rule 122 is not built.

### What the increment does not reach

**A courtesy is never drawn on the first measure of a system.** `paginateScore`
renders each system through its own `renderAnalyzedStaff` call on a slice
(`page-layout.ts:174`), so `prevMeasureAcc` starts empty in every call and the
measure before a system break lives in a different one. This did not bite on
Without Sun song 1: §5 shows both courtesies fall inside a system. It is a real
gap and it is Dann's to rule, because closing it means giving the renderer the
previous slice's closing accidental state, which is a new option on
`StaffRenderOptions`.

**A bar of rests between two soundings clears the carry.** JUDGEMENT, and it is
mine: a bar in which the singer does not sound the pitch is not "the next bar",
so bar 3 gets nothing when bar 1 altered the pitch and bar 2 was silent. The
same guard drops the carry across a tacet run. This is the narrower reading, and
I took it because increment 1 builds rule 121 and not rule 122. A test pins it.

---

## 3. The glyphs, and what the metadata validation did

Both codepoints are real in every font the project ships. I read each font's own
`cmap` rather than trusting the registry:

| font | U+E26A | U+E26B |
|---|---|---|
| Finale Maestro 2.7 | glyph id 534 | glyph id 535 |
| Leland 0.80 | glyph id 168 | glyph id 169 |

`fontTools` is not installed on this machine, so I parsed the sfnt table
directory and the format 4 subtable directly. Bravura ships as `.woff2` with no
`.otf` beside it and was not parsed; its metadata carries both bounding boxes,
which is what the loader actually reads.

**The metadata validation did not change its verdict for any font.** Running
`prepareSmuflFont` over all three real metadata files, with Bravura as the
fallback:

| font | required glyphs | warnings |
|---|---|---|
| Bravura 1.392 | 40 | 0 |
| Finale Maestro 2.7 | 40 | 0 |
| Leland 0.80 | 40 | 4, all `restHBar*: bbox from Bravura` |

Leland's four warnings are N.104's, unchanged. Neither parenthesis produces a
warning anywhere, because all three fonts carry native `glyphBBoxes` for both.
No new `RequiredGlyphName` needed a Bravura fallback, so the fallback path this
brief anticipated is present but never taken.

---

## 4. The geometry, and the collision measured

The cluster is parens left, accidental, parens right, abutting at their bounding
boxes with no gap. Its left edge takes the same arithmetic the bare accidental
takes, with the cluster's width in place of the accidental's:

```
gx = max(nx - headHalfW - 1.5 - clusterW, newMeasure ? nx - 16 : -Infinity)
```

At the production stave (`engraving.ts:31`, `lineGap: 5.5`) in Finale Maestro,
with the notehead half-width at 3.498 units and the barline at `nx - 18` carrying
0.55 units of ink:

| accidental | bare | cluster | cluster left | floor binds | clearance to barline ink |
|---|---|---|---|---|---|
| natural | 3.630 | 7.788 | `nx - 12.786` | no | **4.939** |
| flat | 4.620 | 8.778 | `nx - 13.776` | no | **3.949** |
| sharp | 5.236 | 9.394 | `nx - 14.392` | no | **3.333** |
| double sharp | 5.544 | 9.702 | `nx - 14.700` | no | 3.025 |
| double flat | 9.570 | 13.728 | `nx - 16` | **yes** | 1.725 |

The last two rows cannot occur, for §2's reason: a courtesy carries only a flat,
a natural, or a sharp. They are in the table because they are the only rows where
the `nx - 16` floor comes near binding, and the measure-opening floor is the
thing the brief asked to be measured.

**So the floor never binds on a courtesy, and nothing collides.** The narrowest
clearance the rule can produce at production size is 3.333 units, for a sharp on
a measure-opening note. **N.103 gets no case from this document.**

The cluster's right edge sits 1.5 units from the notehead's ink, the same
constant the bare accidental takes, measured at 1.5 on both courtesies on the
page.

### The primitive mode does collide, and this names it

Primitive mode has no font to measure, so it brackets with ordinary parentheses
in the 15 px text it already draws accidentals with, shifted left by one
parenthesis width and floored at `nx - 16`. Measured in the app's own font stack
(`"Source Sans 3", system-ui, ...`) at 15 px:

| mark | bare | bracketed |
|---|---|---|
| flat | 6.20 px | 15.30 px |
| natural | 6.80 px | 15.89 px |
| sharp | 7.38 px | 16.48 px |

**On a measure-opening note in primitive mode the cluster does not fit.** The
room between the barline's ink at `nx - 17.5` and the primitive notehead's
nominal left edge at `nx - 6.2` is 11.3 px, and the widest cluster is 16.48 px.
A bracketed sharp overlaps the notehead's box by about 5.2 px, a bracketed
natural by about 4.6. Mid-measure it fits, clearing the notehead by about 2.9 px.

This is primitive mode's proportions, not the rule's: its accidental is a fixed
15 px against a 12 px `lineGap`, roughly twice the size Finale Maestro's natural
takes against the stave, and its two hand-set offsets already put a bare
measure-opening accidental within a pixel of the notehead. **I kept the courtesy
in primitive mode anyway**, because a missing cancellation is a worse thing to
hand a singer than a crowded one, and primitive mode is what the page falls back
to if the font fails to load. If Dann wants it dropped there instead, it is the
`else` branch at `:1471-1485` and nothing else.

---

## 5. The walk, on Without Sun song 1

`pnpm --filter @ilya/web build` succeeds and writes the site to `build/`
(`stamp-sw: CACHE_VERSION is now ilya-1788324396110`). The walk itself is on
`pnpm --filter @ilya/web dev` at 1400 x 900, on
`tools/e16-harness/output/mussorgsky---sunless-01---within-four-walls/repaired/score.repaired.musicxml`
staged into `apps/web/static/reader/` after the server was up, read off the live
DOM. Bass clef, two sharps, 18 bars, seven systems at `0-2`, `3-5`, `6-8`,
`9-11`, `12-14`, `15-16`, `17-17`.

**The instrument was checked against a record it did not produce.** The two key
signature sharps read at x 49.78 and 56.01 on every system, exactly as
`memo-n104-head-window-overlap_r1_2026-09-01.md` §3 recorded them.

### Every courtesy the rule drew

Two, and only two.

| # | bar | measure index | event | pitch | drawn | cluster ink | nearest ink on the left | clearance |
|---|---|---|---|---|---|---|---|---|
| 1 | 3 | 2 | `m2-0-1` | B3 | natural in parentheses | 380.500 to 388.290 | the barline, ending 375.565 | **4.935** |
| 2 | 6 | 5 | `m5-1-4` | F3 | sharp in parentheses | 466.590 to 475.984 | the previous notehead, ending 456.426 | **10.164** |

Courtesy 1 is the plain cancellation: bar 2 states B3 flat, the barline resets
it, the two-sharp key signature already gives the natural, and rule 121 says
cancel anyway. It is also the harder case geometrically, because it is the first
note of its bar, so the measure-opening arithmetic is under test on the page and
not only in the abstract. Its screenshot was taken at 3x the page's own units,
with a 12x companion, by cloning system `0-2`'s own children into a fixed
overlay with a tight viewBox. **The overlay draws the nodes the page draws.** No
page source was changed to look at it, and the overlay was removed afterwards.

Courtesy 2 is the case the brief singles out: bar 5 states F3 natural, and in
bar 6 the key signature already restores the sharp, so before N.102 the page said
nothing at all. It now restates the sharp.

**Nothing else moved.** The page draws 16 required accidentals, and all 16 are
byte-for-byte the ones an independent simulation of the pre-N.102 rule over the
raw MusicXML predicts: bars 2, 4, 5, 6, 7, 10, 11 (three), 12, 13, 14, 15, 16.
No mark was added or lost anywhere except at the two courtesies.

**Neither courtesy was suppressed by a system break.** Bar 3 sits inside system
`0-2` and bar 6 inside system `3-5`, so §2's slice limitation had nothing to
suppress here. Had the rule fired on bar 4, 7, 10, 13, 16, or 18, nothing would
have been drawn.

**No lavender reached the page**, because no voice is measured on this document,
so the turning layer drew no accidental of any kind and the sung-line-only
default is untested by this walk. The test suite covers it instead.

### The control

**Bar 9, measure index 8.** C sharp 3 recurs there from bar 8, across the
barline, and E3 and D3 and F sharp 3 do the same. Nothing was altered in bar 8:
every pitch in it conforms to the two-sharp key signature, so no accidental was
drawn there and nothing entered `prevMeasureAcc`. **Nothing is drawn in bar 9.**
System `6-8` carries exactly one ink-coloured accidental across its three bars,
the required B3 flat on `m6-3-4` in bar 7, and no parenthesis anywhere.

---

## 6. Gates

Run in the maintainer's terminal, before the edit and after it.

| gate | baseline | after | moved |
|---|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` | no |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` | no |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same | no |
| 4 web-test | `920 passed (920)` | `920 passed (920)` | no |
| 5 score-parser | `481 passed \| 5 skipped (486)` | `493 passed \| 5 skipped (498)` | **yes, +12** |

`npx tsc --noEmit` over `packages/score-parser` exits 0.

**One line of `~/Downloads/ilya-ship.sh` must change, and it is line 80:**

```
gate 5 score-parser "481 passed | 5 skipped (486)"              pnpm -C "$REPO" --filter @ilya/score-parser test
```

becomes

```
gate 5 score-parser "493 passed | 5 skipped (498)"              pnpm -C "$REPO" --filter @ilya/score-parser test
```

Gate 4 stays at `920 passed (920)`, so **line 79 does not change.** I did not
edit that file.

---

## 7. Housekeeping

- **Nothing was committed and nothing was shipped.** I do not run git.
- Untracked and needing `git add` before the ship: this memo. The brief is
  untracked and rides along. Five source files are modified: the two I built in,
  the test file, and the two whose citations I repaired.
- The engraved MusicXML I staged at
  `apps/web/static/reader/n102-without-sun-1.musicxml` is deleted. That
  directory is gitignored and `pnpm --filter @ilya/web dev` empties and
  regenerates it through `copy-reader.mjs`, so anything staged there must be
  staged after the server starts.
- **No user-facing string was added or changed. No French was coined. No control
  was added to the drawer**, which is increment 2.
- Nothing derived is stored. The courtesy is computed inside the draw loop from
  two local maps and is never written into the score or the song.
- `VocalLineEvent` is unchanged, and `apps/web/src/lib/shane/reconciliation/` was
  not touched.
- Nothing was added to `static/`, so there is no byte count to report.
- The dev server on port 5173 belongs to another session. I read its DOM and
  staged one file into its gitignored `static/reader/`, then removed the file. I
  changed no page source and left no overlay behind.

---

## 8. NOT ESTABLISHED

- **Rule 121's own words.** The extraction is not on this machine, so I built
  the brief's paraphrase. Everything downstream of that paraphrase is only as
  good as it is, including the decision to cancel where the key signature already
  agrees. **Rule 116 is in the same position**, and its only appearance anywhere
  on this machine is the brief's parenthetical.
- **That parentheses are the right form.** DESK DEFAULT, Dann's to wave off, as
  briefed. Gould allows bare or parenthesized, per the brief; I did not read the
  page that says so.
- **What the rule does at a system break.** §2 states the gap and §5 shows it did
  not bite here. **It is untested**, because no fixture in the suite paginates,
  and I did not build one.
- **What the rule does on a document with more chromaticism than this one.** Two
  courtesies on 18 bars is a thin sample. Both are the shapes the brief names,
  and neither exercises a flat drawn as a courtesy, a second courtesy in one bar,
  or a courtesy on a measure-opening note whose accidental is a sharp, which §4
  calls the tightest case the rule can produce. All three are pinned by tests
  against a synthetic font; none has been read on a page.
- **Whether the 1.5-unit gap between the cluster and the notehead is right.** It
  is the constant the bare accidental already uses, kept rather than retuned. No
  rule number backs it, here or before this change.
- **Whether primitive mode should carry the courtesy at all.** §4 measures the
  measure-opening overlap and gives my reason for keeping it. It is a judgement
  about a fallback mode, not a measurement of the page, and it is reversible in
  one branch.
- **Whether the turning layer should stay silent.** The walk could not test it,
  for §5's reason: this document has no measured voice, so no turning pitch was
  drawn. The suite pins the behaviour; a page has not shown it.
- **Whether the parentheses read at singing distance.** At 12x they are
  unmistakable. At the page's own size the natural's vertical strokes stand
  taller than the parentheses do, since Finale Maestro gives the natural a
  bounding box of 8.382 units up and 8.250 down against the parenthesis's 4.664
  and 4.686. **Whether that reads as brackets or as clutter is Dann's eye, not a
  measurement.**

---

The commit message is `N.102: the courtesy accidental across a barline`.
