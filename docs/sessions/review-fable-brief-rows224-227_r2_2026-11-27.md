# Review r2 (delta): brief-code-rows224-227-lyric-band-and-row-choice_r2_2026-11-26.md

2026-11-27, by Fable 5.2 (subagent), for the desk. Brief md5 `ad186484af878704d30f4b2e767394fe`, confirmed. Tree: `Shane`
at `ebc3a8b7`, confirmed; four files under `docs/memory/` are modified and nothing under `apps/` or `packages/` is.
Every code line cited was read in this session from that tree. No source file was changed and no git write was run.

## Verdict

**SEND WITH AMENDMENTS**

The redesign is sound: the lane now widens who may use machinery Ilya already ships, and leaves the seating rule and
the band alone. Three amendments are required before it goes (1, 2, and 3 below). Each is a change of wording in the
brief and none needs a new design or another review. The rest are corrections.

## The five blockers of r1

### Blocker 1, first-verse seating: PARTLY CLOSED

- Closed at the site. r2 lines 69-70 and 138-141 put `underlay-page.ts:319-320` out of scope, and no step edits
  `seatPage`'s loop. Step 3 changes only the index `fallbackRow` returns, which `seatPage` reads at `:303` and `:308`.
- `underlay-page.test.ts:93-98` is untouched by every step: its system has Russian rows, so `:303` never calls
  `fallbackRow`; it asserts by `shape(page)` and `toMatchObject` on `stats`, so step 4's new field cannot fail it.
- **Open by another road: steps 1 and 2 together can seat a lower printed line.** Trigger 3 sends a system seated from
  its true first row to the looks. `down` moves the window half a space down (`underlay-looks.ts:36`), which cuts the
  top row further. Where the top row then fails `rowLanguage`, the look's FIRST Russian row (`underlay-choose.ts:30-34`)
  is the next line down: a second verse, or the German line, which passes `rowLanguage` on systems 2, 3, 10, 11, and
  12 of this page (`step3-rows.out.txt`). Step 2's rule compares scores and nothing else, so where that lower line
  scores higher than the cut top line, it replaces the seat. See required amendment 1.

### Blocker 2, one measure: CLOSED, with amendments 4 and 5

- The dependency at `underlay-choose.ts:6-7` stays true: `scoreLook` still returns at the first Russian row
  (`:30-34`) and `:319-320` still seats it. Only the number changes.
- The share is computable from what `sewByDictionary` returns today, with no change to its return:
  it returns the sewn words (`underlay-fallback.ts:53-55`); `letterCount` is at `:30`; `wordKnown` is imported at `:23`.
  Share = letters of sewn words where `wordKnown` is true, over letters of all sewn words. `sewByDictionary`'s only
  caller in source is `fallbackRow` (`:62`).

### Blocker 3, done-when against the fault: PARTLY CLOSED

| Item | Passes with German on system 9? | Passes with system 16's noise row seated? |
|---|---|---|
| 1 | No, given amendment 3's matching rule | **Yes**, where the noise row is the key's row |
| 2 | Yes (it reads system 16 only) | **Yes**: the text is reported, not gated |
| 3 | Yes | Yes |
| 4 | Yes | Yes |
| 5 | Yes | Yes |
| 6 | Yes | Yes |

- Item 1 closes system 9. Nothing closes system 16. `QUEUE.md` row 224 says system 16's noise row IS the cut Russian
  line, so "seated from the key's row" is true of it today, before any code changes.
- Item 3 fails on the correct repair. See required amendment 2.

### Blocker 4, a look replacing a correct seat: CLOSED, with amendments 6 and 7

- The path can carry the rule. `kept` is set only at `underlay-reader.ts:154`; `more` and the renumbered rows are
  built only from `kept` (`:160-165`); `:167` runs only where `kept.size > 0`. A look that is not kept leaves no row,
  no id, and no read behind. Discarding mid-loop leaves nothing inconsistent in the layout.
- One thing it leaves wrong: `:152` writes `kept: i === best` into the report, and `:86` prints «kept». A look that
  wins among looks and loses to the seat would be reported as kept. Amendment 7.

### Blocker 5, the ruling of 2026-10-28 15:57: CLOSED, with amendment 8

- The first look, the band, and `MARGIN` are untouched. Reading above the band's top happens only in looks that ship.
- Trigger 3 is not a departure from the 10-28 ruling: it changes which systems are looked at twice, not the area the
  first look inspects.
- It IS a widening of the second look's own licence. The tree states that licence as "a system with a band that held
  ink but no Russian row" (`underlay-looks.ts:4`, `underlay-reader.ts:129`). Under r2 a system with a good seat is
  looked at again. Declare that in one line as the lane's departure. I could not find the wording of the ruling of
  2026-11-04 items 6 (b) and 7 that those comments cite, so what it permits is NOT ESTABLISHED.
- A correction: r2 line 116-117 says reading above the top happens "inside `wide`". `up` also reads half a space
  above it (`underlay-looks.ts:37`).

## Required amendments

### 1. A look may replace a seat only with the same printed line, and trigger 3 offers only the looks that answer its evidence

- **Same line.** Step 2 adds: the look's scored row replaces the seat only where it overlaps the seated row on the
  page. Both extents are already held: `offsetY` and `transform.height` (`underlay-page.ts:57-64`,
  `underlay-frame.ts:398`). Trigger 1 (no seat) keeps today's rule, since there is nothing to overlap.
- **Which looks.** Trigger 3's evidence is ink through the TOP edge. `up` and `wide` raise the top
  (`underlay-looks.ts:37-38`); `down` lowers it and `stretch` does not move it (`:36`, `:39`). For a system that
  trips trigger 3 alone, offer `up` and `wide` only. The request already takes a list per system
  (`underlay-reader.ts:30`, `:138`). This also halves that trigger's cost.
- **Done-when to add:** no system on any measured page changes its seated line to a different printed line unless the
  key names the new one.

### 2. Done-when 3 fails on the right answer

- "No system loses seated syllables" is false of a correct repair of system 9. It seats 17 syllables today from the
  German row (`step3-rows.out.txt`). Nothing makes the Russian line hold 17 or more; by my count of the first half
  the brief quotes, and my reading of the rest from the dump (an inference, not the print), it holds about 14.
  System 16's noise row seats 16.
- Restate: no system that is seated from the key's row today loses seated syllables. Systems whose seated line
  changes to the key's row are judged by item 1 and by the text gate below.
- **Add a gate on the text for systems 9 and 16**, since row identity alone passes on system 16's noise: the seated
  syllables are compared with the print by eye, the count that match is reported before and after, and it rises on
  both systems. The desk may set a stricter figure; "reported" alone is not a gate.

### 3. The key must say how a row is matched, and done-when 1 depends on step 4

- The key is "the y of the row" in the first look. A row that arrives by a look has a different `offsetY`
  (`underlay-prepare.ts:280`: the look's window top plus the row's own `y0`). Without a rule the lane picks a
  tolerance, and system 16's rows stand 16 px apart. The key records the printed line's top and bottom on the page,
  and a seated row matches where its centre falls between them.
- "Read from the seating's own output": today that output does not say which row was seated (`SystemWords`,
  `underlay-page.ts:172-188`, holds no row). Step 4's field is what item 1 reads, and step 2 needs it too
  (amendment 6). **Step 4's field is built first**, and it carries the seated row's page extent, not only an index.

## Amendments

4. **A share has no floor.** A row need only pass `rowLanguage` to be scored (`underlay-choose.ts:32`), which one
   known word in three counted satisfies (`underlay-language.ts:65`, `RUSSIAN_SHARE` 0.3). A sliver row of two short
   known words scores 1.0 and beats a full line at 0.7. Step 0 (d) reports each row's letter total beside its share,
   and the desk sets a floor from it (for example, the look's row holds no fewer letters than the seated row) or
   records that none is needed. Whether it occurs on these pages is NOT ESTABLISHED.
5. **`scoreLook`'s number is printed and typed as a count.** `LookScore.known` (`underlay-choose.ts:24-27`),
   `LookReport.known` (`underlay-page.ts:203-211`), and «Russian, N words» (`underlay-reader.ts:86`). Name what each
   becomes. And give step 0 (d) a stop: where the measure scores the German row above the key's row on any system,
   the lane stops and reports before step 2. r2's stop clause covers the chain only (line 236-237).
6. **Step 2 needs to know which row is seated, and the reader does not know.** `seatPage` returns no row identity.
   Recomputing it in the reader would be a second copy of the rule, the fault r1's blocker 3 named in the harness.
   Step 2 reads step 4's field.
7. **The report must not say «kept» for a look that lost to the seat.** `underlay-reader.ts:152`, `:86`.
8. **Trigger 3 needs a field the brief does not name.** `core` never leaves the Worker: `RowLayout` carries `id`,
   `transform`, `offsetX`, `offsetY` (`underlay-page.ts:57-64`). `prepareUnderlay` must set a flag on `SystemLayout`
   at `underlay-prepare.ts:238-244`. r2 line 115 says "Nothing else changes"; this does. Also, "`core[0]` is 0" and
   "band line 0 holds ink" are one condition: `core[0]` is the first line where `on` is true
   (`underlay-rows.ts:165`, `:179-180`, `:187`).
9. **Done-when 5's last clause cannot be met.** "The repair must not rest on step 1 alone" came from my r1 amendment,
   written when step 1 grew the row. In r2 the repair of system 9 rests wholly on the looks: step 3 changes nothing
   there, because one row qualifies (`step3-rows.out.txt`, system 9). With `?looks=off` system 9 stays German, by
   design. The switch is the desk's and not a singer's (`underlay-switch.ts:7-8`, `:22-28`). Reword: the lane reports
   what system 9 does with the looks off, and German is the expected answer.
10. **Step 4's field stays absent where it does not apply.** Nine assertions in `underlay-page.test.ts` compare
    `page.systems` with `toEqual` against exact objects (`:65`, `:82`, `:89`, `:102`, `:111`, `:115`, `:183`, `:198`,
    `:211`). r2's "where a system holds more than one row" keeps the ones I read green (`:89`, `:102-105`, `:111`
    hold one row or none). I did not read the systems at `:65`, `:183`, `:198`, `:211`.
11. **Two line numbers.** `core: [a, z]` is `underlay-rows.ts:187`, not `:188`. `sewByDictionary` is
    `underlay-fallback.ts:37-56`.

## The question r1 never asked: the cost of triggers 2 and 3

**What it could cost on this page.** The first look read 41 rows in 5,431 ms, about 132 ms a row, in a page read of
6.2 s (`step3-summary.out.txt`, the reader's console line). Trigger 2 fires on 1 system. If step 0 (b) finds
`core[0]` at 0 on all 16 systems, trigger 3 fires on 16. At four looks each and about 2.6 rows a look, that is about
165 further rows and about 22 s, on top of 6.2 s. That figure is my arithmetic from one run, not a measurement.
Amendment 1 halves it for trigger 3.

**What step 0 (d) and (e) would have to find for that to be acceptable:**

- Per look, on how many systems it would replace the seat under step 2's rule. A look that never wins for a trigger
  is dropped from that trigger.
- That the systems where a look wins are a fair share of the systems that trip trigger 3. If 16 trip it and 2 gain,
  the trigger is too wide, and the lane needs a narrower one before step 1 (for example trigger 3 only where the first
  row also scores under a floor on the measure).
- From (e), how many staged pages trip trigger 3. If most do, the second look has become the normal path of every
  page, and that is a finding for Dann, since the remedy would then be the band's edge and not the trigger.
- The projected cost itself: systems tripping, times looks offered, times rows a look, times ms a row. Step 0
  reports it per page before any code changes.

**Does done-when 5 bound it?** No. It reports milliseconds and a count of systems. It names no ceiling, so any cost
passes. The desk sets a ceiling after step 0 and before step 1, as added reader time per page, and the lane stops
where step 1 exceeds it. I have no basis to name the figure.

## New in r2, judged on its merits

- **The one-measure definition:** sound and computable. Amendments 4 and 5.
- **The three-condition trigger:** conditions 1 and 2 are sound. Condition 3 covers the second door at `:303`, as r2
  claims. Amendments 1 and 8.
- **The replacement rule:** right in kind, and "a tie does not replace" is correct. Amendments 1, 6, and 7.
- **The `SystemWords` field:** correct choice. The three readers of `why` are as r2 states (`band-strip.ts:123`,
  `kept-bands.ts:108`, `underlay-song.ts:105-107`). Amendments 3 and 10.
- **The six done-when items:** amendments 2, 3, and 9.
- **Step 0 (b):** now measures the ink and not the box, and r2 lines 206-208 add the right stop.

## What I could not establish

- Any score, on any row, on the new measure. So: whether `wide` or `up` gives system 9 a Russian row that beats the
  German row's score; which row step 3 takes anywhere; whether amendment 4's sliver case occurs.
- Whether `core[0]` is 0 on any system. I read no pixels.
- How many syllables the printed line of system 9 holds. My count rests partly on the dump.
- What Dann's ruling of 2026-11-04 items 6 (b) and 7 permits the second look to do. One grep of `INBOX.md` for
  "2026-11-04 10:12" returned line 604, which is a different matter.
- Whether tests outside `underlay-page.test.ts` compare `systems` exactly. A grep of `underlay-*.test.ts` found only
  that file and two empty-list cases in `underlay-prepare.test.ts`.

## Cost of this delta

5 tool calls. Elapsed time not measured.
