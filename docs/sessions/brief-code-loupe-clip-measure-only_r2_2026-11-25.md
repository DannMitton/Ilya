# Brief: measure the Loupe's one-measure clip (Code, Mac lane), r2 — MEASURE ONLY, KEEPS NOTHING

Written by the desk 2026-11-25, from Dann's walk of that evening and Fable's review of r1
(`review-fable-brief-loupe-clip_r1_2026-11-25.md`, verdict DO NOT SEND, 28 amendments, all applied).
Every `path:line` below was read by the desk from the working tree at `Shane` `0ebddf0a` in the session
that wrote this. Where r1's citation was wrong, the correction is marked.

**THE LANE SPLIT.** r1 asked for a measure and a build in one brief. Fable's blockers 1 to 4 showed the
build rests on numbers nobody has, and on a repair whose shape r1 had wrong. **This brief carries step 0
alone. It keeps nothing, changes no file under `apps/`, and stops at the desk.** The build brief is written
from this one's report. Per `CONTRACT.md:49`, a brief that only measures may start while its own review runs.

**THIS IS A MAC LANE.** The scans are on Dann's Mac and untracked, and `CONTRACT.md:106` keeps the scan
reader on the Mac.

**IT RUNS AFTER `mac-staff-finder` MERGES.** That lane's step 0d decides the ink level `extent` and the
bar-line reader read at (`brief-code-staff-finder-light-scan_r2_2026-11-25.md:89`, `:96`), and those are
exactly what this brief measures. Measuring first would measure a reader about to change. **The
`metre-windows.ts` line numbers below will have moved by then: find `barLines`, `extent`, and `staffIn` by
name on the merged tree and state the lines you read.**

## The ask, in his words

**2026-11-25 18:14, the clip:** *"We want to see both. / I want Ilya to reproduce the music and its text underlay as a one-meaure clip featured in Loupe so the user always sees the source material and can be vigilant against Ilya's reproduction in code"*

**18:08, the bound:** *"ion the Loupe;s score detail we should see the barlines that define the measure being examined."*

**18:12, the bound at a system start:** *"the initial bar of a system will not feature a barline on the left, but rather the clef and key signature and sometimes a meter signature. If these are present in the target bar in the score, all these elements should be carried into the phoitographic sample."*

**18:15, the looseness:** *"The left and right bounds are loose, there is no need to clip them religiously, and showing a little of the preceding or following bar is a nice way of underpinning the fact that the measure ddoes not exisst in isolation"*

**17:50, the size:** *"The strip should not be drawn to fill the panel's width... thats unnecessary. It needs to be legible and one bar needs to fit in the Loupe"*

**18:10, the stepper:** *"Pardon my saying so, but I acted as many humans will. SO we need to accommodate my use, not try to force the user to adopt our expected path"*

The full record, with the desk's derivations marked as the desk's, is `../memory/OPEN.md`, sections
THE LOUPE'S CLIP IS ONE MEASURE OF THE PRINT, THE SCAN STRIP FITS THE BAR AND STAYS LEGIBLE, and
THE LOUPE'S CUT RUNS BARLINE TO BARLINE, AND THE STEPPER WALKS MEASURES. Rows 212, 213, and 217
(`../memory/QUEUE.md`).

## What the singer meets today

Dann tapped a rest at m. 19 of a scanned Tchaikovsky and the Loupe filled with two Cyrillic letters the
height of his hand: *"When I tap a rest to spawen the Loupe it looks CRAZY."* He found no arrows to step
to the neighbouring bars.

**Five faults, each read from the tree:**

1. **The clip is a fragment, because rests are dropped before a measure's edges are found.**
   `underlay-prepare.ts:211` filters the voice notes with `!n.rest && n.at !== null`; the survivors reach
   `barExtents` (`underlay-page.ts:416`), which sets `start = b.first - BAR_LEAD * space` (`kept-bands.ts:67`)
   from the first SURVIVING note. A measure opening with a rest begins, for the clip, at its first sounding
   note. The right edge is the next bar's first note less the same lead (`:68`), so the clip is generous
   right and clipped left, which reads as a zoom.

2. **A measure of nothing but rests gets no edges, and sometimes no clip at all.**
   *(r1 had only the first half of this.)* It never enters `byBar` (`kept-bands.ts:64-65`). **Inside** a
   system's bar range, `stripRect` (`:128-133`) falls back to the band's own `x0`/`x1` and shows the whole
   system. **At a system's first or last place** it falls outside the range `bars` records
   (`underlay-page.ts:404`, `:412`, sounding notes only), `systemOfBar` (`kept-bands.ts:118-121`) returns
   null, and no clip is drawn. A system in which the voice has no sounding note is not a kept system at
   all (`underlay-band.ts:116-121`, "the systems of a page that hold voice notes"), so an introduction,
   interlude, or postlude system has no entry.

3. **The clip holds no music.** `kept-bands.ts` keeps the system's LYRIC band, and `stripRect` caps the
   height at `STRIP_MAX_SPACES * space` with `STRIP_MAX_SPACES = 5` (`:116`), whose own comment marks it
   JUDGEMENT, sized for "two lines of words and room".

4. **A clip narrower than the panel is stretched to fill it. This, not the height, is the explosion.**
   *(Fable's blocker 4; the desk verified it.)* `stripScale` returns
   `Math.min(native, Math.max(1, open * zoom * pinch))` (`loupe-print.svelte.ts:203`) with
   `native = Math.max(1, strip.width / windowPx)` (`:199`), so it never returns below 1. The image is drawn
   at `boxW * scale` (`LoupePrintStrip.svelte:131`) where `boxW` is the panel's own `clientWidth`
   (`:122`). A one-bar clip is therefore drawn at the panel's full width whatever its real size.

5. **The stepper has its own rest filter, and the arrows are gated one layer above where r1 looked.**
   The arrow row is drawn only inside `{#if listed}` (`LoupePrintStrip.svelte:134`), which is why no arrow
   appeared, not `:45-46`. `goto` calls `openAt` (`loupe-print.svelte.ts:88-90`), and `openAt` finds the
   bar's first NON-REST event (`firstNoteOfBar`, `:206-210`, `ev.type !== 'rest'`), returning without
   opening where there is none (`loupe-print-wiring.ts:84-87`). An arrow onto a rest-only measure is a dead
   click.

**r1's central claim was false, and it was the desk's alpha-rule failure.** r1 said `barLines` and `extent`
"already run during the read and their results are discarded". Only `extent` does. `extent` runs inside
`staffIn` at `underlay-prepare.ts:215`, and `prepareUnderlay` then reads only `placed[...].staff.space`
(`:229`), so the staff's `x0`/`x1` are dropped. **`barLines` does not run in that read.** Its one non-test
caller is `windowsOf` (`metre-windows.ts:360`); `windowsOf`'s one non-test caller is `readPageMetres`
(`metre-model.ts:151`); that runs in `metre.worker.ts:42`. The underlay read runs in a different worker
(`underlay.worker.ts:77`), and the tree says so itself at `underlay-prepare.ts:15`: neither reads the
other's output. The same false sentence stood in `OPEN.md` and has been corrected there.

## The rule that assigns a barline to a bar

**Step 0a cannot produce a table without this, so the desk states it here rather than leaving Code to
invent one.** Evidence order per `CONTRACT.md` §0.2; every clause is a position from ink.

1. **A bar's span of ink** is the min and max x of its own events, taken from `voiceNotes(musicXml)` **with
   no rest filter**. Every `<note>` element carries homr's `<!-- imgpos: x, y -->` through `placeOf`
   (`underlay-prepare.ts:147`; `join-pages.ts:439`), and a MusicXML rest is a `<note>` element, so a rest
   has an x wherever homr emitted one. `placeOf` returns null where it did not.
2. **The strokes** are `barLines(page, staff)` on that system's staff, left to right.
3. **A bar's left bound** is the rightmost stroke lying right of the previous bar's last event x and left of
   this bar's first event x. **Its right bound** is the leftmost stroke lying right of this bar's last event
   x and left of the next bar's first event x.
4. **At a system's first measure** the left bound is the staff's `x0` from `extent`, not a stroke, because
   the clef group stands there and Dann ruled it into the clip (18:12).
5. **Where no stroke lies in the interval clause 3 names, the bound is NOT FOUND.** Report the measure as
   unbounded. Do not fall back to a count, do not interpolate, and do not shift the assignment to make the
   counts agree. **Counting strokes left to right from the system's first bar is forbidden**, because it
   shifts every bar on the system wherever a stroke is missed or a bar opens with a rest.
6. **Where a bar's events have no x at all** (clause 1 returned null for every one), report that too. It is
   a different failure from clause 5 and the build brief needs them apart.

**NOT ESTABLISHED: whether every rest in homr's output carries an `imgpos`.** Fable found one that does
(`measure-m-p-r74_2026-10-11/rule-on/drops/B.musicxml`, measure 15, read by Fable, not by the desk).
Clause 6 is how often it does not, and it is one of this measure's findings.

## The control rule

**The desk's expectation before the measurement**, per `CONTRACT.md:115`: `barLines` finds most strokes on
a clean engraving and misses them on a light photocopy at the shipped ink level, which is why this lane
waits for the staff finder's level. The desk expects clause 5 to fire on a minority of measures on the
Sunless scan and more often on the Tchaikovsky. **The desk's likeliest failure mode: clause 3 finding TWO
strokes in one interval** at a repeat sign, a double bar, or a thick final barline, which the rule as
written does not resolve. Report every interval holding more than one stroke; do not choose between them.

## The steps

### Step 0a. The horizontal bounds

**The set, three songs, named rather than described** *(r1 said "one Sunless, one Kabalevsky", which two
people would resolve differently)*:

- `tools/e16-harness/scans/sunless-01-v-chetyryokh-stenakh_lamm-scan.pdf`, all pages. This one is tracked
  and the desk read its path from the tree.
- **The Tchaikovsky Op. 38 No. 3 scan Dann walked, and one Kabalevsky scan. Their paths are NOT
  ESTABLISHED by the desk.** Find them on the Mac, state the full path and page count of each in the
  report, and say how you found them. If no Kabalevsky scan is there, say so and measure the two.

**Raster each page as the read rasters it**, through the app's own `rasterizePdf`. **Start from the harness
already on the Mac**, `docs/sessions/measure-staff-finder-light-scan_2026-11-25/`, where `raster.mjs`
rasters a page through `reader/page-pdf.ts` under Playwright and `stepbars.mts` already calls `staffIn` and
`barLines` (`CONTRACT.md:104`, practice 3: measures start warm).

**Report, per measure, as signed numbers in staff spaces, with no threshold applied** *(r1 asked for
"every measure where the two disagree by more than half a staff space"; three quantities were listed so
"the two" was undefined, and half a staff space has no source in the tree or in `OPEN.md`)*:

- (left bound from the rule above) minus (`barExtents` `x0` for that bar)
- (right bound from the rule above) minus (`barExtents` `x1` for that bar)

`barExtents` starts 1.5 spaces left of the first note by construction (`kept-bands.ts:51`, `:67`), so a
difference on nearly every measure is expected and is not a finding by itself.

**Also report:**

- Every measure where clause 5 fired (a bound NOT FOUND), with which side.
- Every measure where clause 6 fired (no event carried an x).
- Every interval holding more than one stroke (the desk's named failure mode).
- Every measure that `barExtents` gives no extent at all today.
- Per system, the count of `barLines` strokes plus one, beside the count of `<measure>` elements whose
  notes or rests sit on that staff, as two numbers. **Where they differ, that is a finding to report, not a
  thing to reconcile.**
- The staff's `x0` and `x1` from `extent` per system.

### Step 0b. The vertical bounds

*(r1 said "the topmost and bottommost ink belonging to the system", which is undefined: tempo words,
dynamics, the piano staff below, and the system above are all nearby ink.)*

**Report per system, in staff spaces from the staff's top line, signed:**

- The highest ink row between the staff's top line and the lowest ink of the system above, or the page's
  top for the first system.
- The bottom of the last text row `cutRows` found.

**Save one crop per system at those bounds, beside the table, so the desk can look** (`CONTRACT.md` §0.3).

**On a tilted page one y per system is not enough.** `metre-windows.ts:186-190` records a page tilted two
degrees. Report the staff's top-line and bottom-line y at the staff's `x0`, at each stroke, and at `x1`,
using `linesBeyond(staff, x)` (`metre-windows.ts:138`), which the metre worker already uses this way
(`metre.worker.ts:44-48`).

**Propose no replacement constant.** `STRIP_MAX_SPACES` (`kept-bands.ts:116`) is being replaced by a
per-system measurement, not by a different fixed number. Its comment records why a constant cannot hold:
a band can run twenty spaces under the last system, nearly all of it paper.

### Step 0c. Margin candidates, rendered

*(r1 asked "what margin shows the neighbouring barline", which has no answer: a cut starting at the barline
shows it at zero margin.)*

For the **narrowest** and the **widest** measure in the set, render the clip at margins of **0, 1, 2, 3,
and 4 staff spaces each side**. For each, report the target measure's own width as a share of the clip's
width. **Save the ten crops. Recommend nothing.**

The desk's one derived limit, from Dann's two sentences of 18:15 and his to strike: the target measure
still dominates the clip, read as its share being above one half. **That share is the only reading the word
"dominates" itself supplies; any other number is taste and his.** Report the shares; the choice is Dann's
from the crops.

### Step 0d. The legibility floor, rendered

*(r1 asked what is "comfortably readable", which has no observer in a Code session.)*

- **Measure from the ink** the printed letter height as a share of the staff space on these scans, to
  replace `LETTER_OF_SPACE = 0.8` (`loupe-print.svelte.ts:189`, marked JUDGEMENT), which the floor is
  computed through (`:200`).
- Render one underlay row at letter heights of **10, 12, 14, 16, 18, and 20 CSS pixels** at a **390 px**
  and a **1440 px** viewport. **Save the twelve pictures.** Dann chooses the floor from them.
  `MIN_LETTER_PX = 18` (`:187`) is a judgement and is what the measurement replaces.

### STOP

**Step 0 returns to the desk. Nothing is built in this lane.** The margin, the floor, the narrow-measure
size, and the vertical rule are Dann's to choose from the crops and the tables. Code recommends none of
them, and builds on none of them.

## Constraints

- **No file under `apps/` changes.** This brief keeps nothing. Harness scripts go in
  `docs/sessions/measure-loupe-clip_2026-11-25/`, and the harness is saved as a tarball in
  `~/Downloads/_desk-2026-11-25/` when the measure ends (`CONTRACT.md:104`, practice 3).
- **Geometry in staff spaces, never fixed pixels** (`CONTRACT.md` §0.2), except step 0d's CSS-pixel letter
  heights, which are a screen measurement by nature.
- **No agent writes with git** (`CONTRACT.md:105`). Forbidden: `add`, `commit`, `push`, `checkout`,
  `reset`, `restore`, `clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, `tag`. Allowed: `status`, `log`,
  `diff`, `show`, `ls-files`, `check-ignore`. This lane has no branch of its own because it writes nothing
  under `apps/`.
- **`CONTRACT.md:99`'s same-number line is omitted on its own condition:** this brief changes no
  computation.
- **What the desk's search returned** (`CONTRACT.md:111`): searched the tree for anything that already
  keeps a staff's place or a barline with the reading. `KeptSystem` keeps neither (`kept-bands.ts:29-48`).
  `MetreSeen` carries `top`, `bottom`, and `x0` per metre window but is not kept with the reading
  (`metre.worker.ts:43-55`). `measureBandStrips` (`band-strip.ts:102`, the `?strips=measure` instrument)
  already measures cut cost on the Mac and is the instrument the build brief's cost step will want.
  Nothing already keeps what this clip needs.

## NOT ESTABLISHED

**NOT ESTABLISHED beats a complete invented answer.**

- Every number step 0 is asked to produce. None is supplied here on purpose.
- Whether every rest in homr's output carries an `imgpos` (clause 6 reports it).
- Whether `barLines` finds every stroke on a photocopied page (step 0a reports its misses).
- The file paths of the Tchaikovsky and Kabalevsky scans, and whether any song in the set holds a
  common-time measure.
- Whether the clip's new height leaves the Loupe's magnified score too short on a phone. Dann **reported**
  at 18:01 that the strip crowded it (*"it looks CRAZY"*); that the clip takes at most a third of the
  Loupe's height is the **desk's unmeasured default, his to overrule**. *(r1 wrote this as a ruling of his.
  It was not.)*
- What a re-read does to a singer's corrections on a stored song. The build brief's cost step reports it;
  Dann rules.

## Return memo

One file at `docs/sessions/report-code-loupe-clip-measure-only_r1_2026-11-25.md`: step 0a's tables with the
file and page each figure came from; the three scan paths as found; step 0b's table and its crops; step
0c's ten crops with their shares; step 0d's twelve pictures and the measured letter share; the two counts
per system side by side; every clause-5, clause-6, and multiple-stroke case listed rather than totalled;
the desk's expectation and named failure mode answered against; and what you could not establish.

---

## Carried forward to the build brief, not to be rediscovered

Fable's review found these against r1's build steps. They are recorded here because the build brief is
written from this file, and each was read from the tree by Fable at `0ebddf0a` unless marked.

- **Keeping the bar-lines is a new `barLines` call in `prepareUnderlay`** (`underlay-prepare.ts:224-246`,
  where `page` and `placed[system.staff].staff` are both in hand), **plus plumbing through four sites**:
  `SystemLayout` (`underlay-page.ts:64-80`), the per-system result that carries `barXs`
  (`underlay-page.ts:187`), `underlay-page.ts:410-417`, and **`underlay-song.ts:105`, which copies `band`
  and `barXs` by name and would silently drop a new field**. The added cost of a `strokes` pass per voice
  staff in the underlay worker is NOT ESTABLISHED and the build brief must report it.
- **`bars` cannot be widened quietly** to include rest-only bars: the join reads it
  (`kept-bands.ts:26-27`). A system's true first and last bar goes in a NEW field.
- **`isKeptSystems` guards nothing on the load path.** Its one non-test caller is the `?strips=measure`
  instrument (`band-strip.ts:146`); the Loupe takes `reading.bands` unvalidated
  (`loupe-print-wiring.ts:80`). A done-when resting on it proves nothing about loading.
- **The reader's stamp.** `UNDERLAY_READER` (`stamp.ts:54`) is "Bumped when the reader's output changes"
  (`:34-36`), `isCurrent` compares by equality (`restore.ts:41-42`), and a stale reading is read again on
  opening (`:53-54`). A build lane that changes the reader's output and follows that comment would bump it,
  which is a silent re-read of every stored scan. **The build brief must say explicitly whether the stamp
  is bumped, and that choice is Dann's, with the cost reported first.** NOT ESTABLISHED: what a re-read
  does to a singer's corrections on a stored song. Also NOT ESTABLISHED: whether `mac-staff-finder` bumps
  it; its r2 brief contains neither "stamp" nor `UNDERLAY_READER`.
- **The arrows' accessible names become false** once they walk every measure. They are
  "Previous bar to check" and "Next bar to check" with French at `i18n.ts:738-739`. **The English is the
  desk's to draft for Dann's ratification and the French is his**; the build brief does not touch them
  until both exist, and its report says the labels are false until then.
- **The arrow row also holds the focus twin** (`LoupePrintStrip.svelte:137`) **and "Fill from the poem"**
  (`:140-142`, gated on `listed` at `:47`). Ungating the arrows from `listed` decides what happens to those
  two as well. r1 cited neither.
- **NOT ESTABLISHED: whether the stepper walks the print's bar numbering or the singer's** after she
  divides or joins a bar. `Loupe.svelte:2294` hands the strip the PRINT's bar via `readingLabelOf`.
- **A mid-system key or meter change needs no detector.** Such a change is printed right of the barline,
  so a cut starting at or before the barline already holds it. Build nothing to find them.
- **`BAR_LEAD` and `BAR_TAIL`** (`kept-bands.ts:51`, `:53`, both marked JUDGEMENT) survive only for
  readings kept before the build lane. The build brief's report says so, so a later desk knows when they go.
- **The stepper can ship ahead of the cut.** It touches only `lib/score/` and reads nothing the staff
  finder changes. It needs the dead-click fault answered first (fault 5 above).
- **A rule the build brief needs and r1 lacked:** what happens to a measure in a system the voice never
  sings in (no kept system exists for it). Dann has not ruled it.
- **Where the build brief does not decide a question, Code stops and reports it.** It does not decide it.
  *(r1 said "when in doubt, show more of the print, not less", which licensed a wider cut wherever Code was
  unsure and contradicted the dominance limit.)*
