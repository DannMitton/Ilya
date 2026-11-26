# Brief: the Loupe's clip is one measure of the print (Code, Mac lane), r1

Written by the desk 2026-11-25 from Dann's walk of the same hour. Every line citation was read by the desk in this session from `Shane` at `0ebddf0a`.

**THIS IS A MAC LANE, and it runs AFTER `mac-staff-finder` lands.** The scans it measures are on Dann's Mac and untracked, `CONTRACT.md:106` keeps the scan reader on the Mac, and the staff finder lane is changing `metre-windows.ts`, whose `extent` and `barLines` this lane reads from. Two Mac lanes at once is not how Dann runs Code.

## The ask, in his words

**2026-11-25 18:14, the clip:** *"We want to see both. / I want Ilya to reproduce the music and its text underlay as a one-meaure clip featured in Loupe so the user always sees the source material and can be vigilant against Ilya's reproduction in code"*

**18:08, the bound:** *"ion the Loupe;s score detail we should see the barlines that define the measure being examined."*

**18:12, the bound at a system start:** *"the initial bar of a system will not feature a barline on the left, but rather the clef and key signature and sometimes a meter signature. If these are present in the target bar in the score, all these elements should be carried into the phoitographic sample."*

**18:15, the looseness:** *"The left and right bounds are loose, there is no need to clip them religiously, and showing a little of the preceding or following bar is a nice way of underpinning the fact that the measure ddoes not exisst in isolation"*

**17:50, the size:** *"The strip should not be drawn to fill the panel's width... thats unnecessary. It needs to be legible and one bar needs to fit in the Loupe"*

**18:10, the stepper:** *"Pardon my saying so, but I acted as many humans will. SO we need to accommodate my use, not try to force the user to adopt our expected path"*

The full record with the desk's derivations is `../memory/OPEN.md`, THE LOUPE'S CLIP IS ONE MEASURE OF THE PRINT and THE SCAN STRIP FITS THE BAR AND STAYS LEGIBLE.

## What the singer meets today, and the desk watched her meet it

Dann tapped a rest at m. 19 of a scanned Tchaikovsky and the Loupe filled with two Cyrillic letters the height of his hand. He said: *"When I tap a rest to spawen the Loupe it looks CRAZY."* He also found no arrows to step to the neighbouring bars.

**Three faults, all established from the tree, not inferred:**

1. **The clip is a fragment, because rests are dropped before a measure's edges are found.** `underlay-prepare.ts:211` filters the voice notes with `!n.rest`; those surviving notes reach `barExtents` (`underlay-page.ts:416`); `barExtents` (`kept-bands.ts:61-71`) sets `start = b.first - BAR_LEAD * space` (`:67`) from the first SURVIVING note. So a measure opening with a rest begins, for the clip, at its first sounding note. The right edge is the next measure's first note less the same lead (`:68`), so the clip is generous right and clipped left, which reads as a zoom.
2. **A measure of nothing but rests gets no edges at all.** It never enters `byBar` (`:63-64`), so `stripRect` (`kept-bands.ts:128-133`) falls back to the band's own `x0`/`x1` and shows the whole system.
3. **The clip holds no music.** `kept-bands.ts` keeps the system's LYRIC band (its own first line), and `stripRect` caps the height at `STRIP_MAX_SPACES * space` with `STRIP_MAX_SPACES = 5` (`:116`), whose comment says it was sized for two lines of words.

**And the stepper is absent on an ordinary route.** `LoupePrintStrip.svelte:45-46` derives `prev` and `next` from `loupePrint.neighbour` (`loupe-print.svelte.ts:100-104`), which indexes `toCheck()`, the bars the banner flagged, and returns null at both ends. On a bar outside that list no arrow is drawn.

## What to build

**The clip is one measure of the print, music and words together, as the source a singer checks Ilya against.** That purpose decides every open question in this brief: when in doubt, show more of the print, not less.

### The rectangle

**Left bound,** whatever bounds the measure on the left in the print: a barline; at a system's first measure the clef with its key and meter signatures; a key change or meter change printed at a measure's head mid-system.

**Right bound:** the next measure's left bound.

**Top and bottom:** from above the staff down through the underlay rows, measured from the system's own ink. **`STRIP_MAX_SPACES` goes.** A clef reaches above and below the staff, ledger lines go higher, and a slur can arc above the notes; a cap sized for two lines of words cannot hold music.

**The bounds are loose and carry a margin into the neighbouring measures.** Starting before the measure and ending after it is correct, not sloppy. **The one limit: the target measure still dominates the clip**, so the margin is the smaller of a few staff spaces and a share of the measure's own width. **Both numbers come from step 0, not from this brief.** Stated in staff spaces, never pixels (`CONTRACT.md` §0.2; Dann 2026-11-04 10:26).

### The size in the Loupe

The whole measure fits the Loupe's width; that is the target, not the ceiling. Letters never fall below a legible floor, **on every device**: the floor at `loupe-print.svelte.ts:201` is gated on `o.phone` and stops being so, and its value (`MIN_LETTER_PX = 18`, `:187`, marked JUDGEMENT) is measured in step 0 rather than inherited. Never past the scan's own pixels (`native`, unchanged). Where fitting would push letters under the floor, the floor wins and the clip pans, which the panel already does.

### The stepper

The arrows walk measures, however the Loupe was opened. The banner's flagged list stops gating them and becomes what the tag reports (`loupe.measureTagCheck`, already built).

## The steps

### Step 0: measure, keep nothing

0a. **On at least three real scanned songs on the Mac** (the Tchaikovsky Op. 38 No. 3 Dann walked, one Sunless, one Kabalevsky), report per measure: the x of its bounding barlines as `barLines` (`metre-windows.ts:344`) finds them; the staff's `x0`/`x1` as `extent` (`:156`) finds them; and the x range `barExtents` produces today. **Name every measure where the two disagree by more than half a staff space, and every measure that gets no extent at all.**

0b. **The vertical range.** For the same systems, report the topmost and bottommost ink belonging to the system, in staff spaces from the staff's top line, separating the clef, ledger lines, slurs above, and the underlay rows below. This replaces `STRIP_MAX_SPACES`.

0c. **The two margin numbers.** Report, for the narrowest and widest measures in the set, what margin in staff spaces shows the neighbouring barline, and what share of the clip the target measure then occupies. Recommend a pair that keeps the target measure dominant on the narrowest measure in the set.

0d. **The legibility floor.** Report the printed letter height in CSS pixels at which the underlay is comfortably readable on a desktop and on a phone, on these scans. `MIN_LETTER_PX = 18` is a judgement and is being replaced by a measurement.

**Done when:** four tables exist, each figure naming the file it was printed from, and the recommended numbers are stated with the measurement that chose them.

### Step 1: the reading keeps what it already measures

`barLines` and `extent` already run during the read and their results are discarded. Keep them with the reading beside the band, as fractions of the page, the way `bandFractions` (`kept-bands.ts:78`) already does.

**Done when:** a reading carries, per system, the staff's x range and the barline x positions; `isKeptSystems` (`:92`) validates them; and a reading written before this change still loads and still draws a clip by the old path.

### Step 2: the cut

`stripRect` takes the measure's bounds from the kept barlines and the staff, with the step 0c margin, and the step 0b vertical range. **Rests no longer decide anything.**

**Done when:** on the step 0a set, every measure yields a clip that contains its own bounding barlines or its clef group; no measure yields the whole system; and a measure of only rests yields its own measure.

### Step 3: the size and the stepper

The scale rule above; the floor ungated from `o.phone`; the arrows walking measures.

**Done when:** on a 3/8 measure and on a wide common-time measure, the whole measure is inside the Loupe's width with letters at or above the step 0d floor, and the arrows step to the neighbouring measure from a Loupe opened by tapping a note, by tapping a rest, and from the banner.

### Step 4: scans read before this lane

Say what happens to them: a re-read, or the Loupe finding the staff and barlines again on the stored scan when it opens. **Report the cost of each; do not choose.** This is Dann's.

## The sites this changes

| site | what |
|---|---|
| `omr/kept-bands.ts:61-71` `barExtents` | no longer the source of a measure's edges |
| `omr/kept-bands.ts:116` `STRIP_MAX_SPACES` | removed; the vertical range is measured |
| `omr/kept-bands.ts:128-133` `stripRect` | takes barlines, staff, margin, measured height |
| `omr/kept-bands.ts` `KeptSystem`, `:92` `isKeptSystems` | carries and validates the new geometry |
| `omr/underlay-page.ts:416` | keeps what `barLines` and `extent` found |
| `score/loupe-print.svelte.ts:187`, `:197-203` | the floor ungated and measured; the fit rule |
| `score/loupe-print.svelte.ts:100-104` `neighbour` | walks measures, not the flagged list |
| `score/LoupePrintStrip.svelte:45-46`, `:131` | the arrows; the width |

**What depended on them agreeing:** `underlay-prepare.ts:211`'s rest filter is correct for seating words and is NOT changed; it is only the clip's edges that must stop depending on it.

## Constraints

- No file outside `apps/web/src/lib/omr/` and `apps/web/src/lib/score/` and their tests changes.
- A stored reading written before this lane still loads. No stored-format change that breaks one.
- One vowel per note (`CONTRACT.md` §0.1) is untouched; nothing here writes text to notes.
- Geometry in staff spaces, never fixed pixels (§0.2).
- All eight gates at baseline. No baseline moves without saying which and why.
- No `git add`, `commit`, `push`, `checkout`, `reset`, `merge`, or `rebase` on `Shane` or `main`. Own branch; Dann merges.

## NOT ESTABLISHED

**NOT ESTABLISHED beats a complete invented answer.**

- Every number in this brief that step 0 is asked to produce. None is supplied here on purpose.
- Whether `barLines` finds every barline on a photocopied page. Step 0a reports its misses rather than assuming them away.
- What happens to readings stored before this lane. Step 4 reports; Dann rules.
- Whether the clip's new height makes the Loupe's own magnified score too short on a phone. Dann ruled at 18:01 that the strip must not crowd it; the desk's unmeasured default is that the clip takes at most a third of the Loupe's height. Measure it; do not ship the third on faith.

## Return memo

One file at `docs/sessions/report-code-loupe-clip-one-measure_r1_2026-11-25.md`: step 0's four tables with the file each figure came from; the numbers chosen and the measurement that chose them; step 2's and step 3's done-when results per measure; step 4's two costs; and what you could not establish.
