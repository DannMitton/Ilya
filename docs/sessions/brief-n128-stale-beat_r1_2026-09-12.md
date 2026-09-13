# Brief: N.128, the beat a note thinks it is on

Numbered by Dann 2026-09-12. UNPLACED: this brief does not displace anything
until he places it.

**The item is not the beaming. Dann's words:** *"I really don't care whether
this kind of figure is beamed or flagged, but whatever it is, it has to follow
a rule. This doesn't seem to, and I want to scrutinize what looks like
arbitrary typesetting."*

So the test of this work is not that a particular pair beams. It is that the
rule the page obeys is stated, applied to every figure alike, and pinned by a
test that fails when it stops being true.

Read `docs/memory/CONTRACT.md` before you start.

## 1. What was measured, 2026-09-12, by the desk

On Dann's own Sunless 01 page, system 1, read out of the live SVG in his
browser. « на–я » draws two flagged eighths; « ла–я » draws two beamed eighths.

- **The two passages are drawn identically.** `тес→на` 54.78 px and `ми→ла`
  54.78 px; `на→я` 20.14 against `ла→я` 19.67; `я→rest` 15.68 against 15.69.
- **Timbre did not break the group.** All four stems point down.
- **No rest and no barline falls between either pair.** The only eighth rests
  (SMuFL `e4e6`) sit at x 353.2, 490.85 and 602.5, each after the second « я ».
- The system's single beam runs x 563.89 to 583.56.

## 2. The cause, read this session

- The beam group key is
  `${ev.measureIndex}|${beatIndexOf(ev.rhythmicPosition.fraction, ts)}|${timbre}`
  (`staff-renderer.ts:1611`). The beat comes from the stored rhythmic position.
- **`modification-engine.ts` contains ZERO references to `rhythmicPosition`**
  (grep over the file, 0 hits). A duration correction changes the duration.
  Nothing recomputes where the following events in that measure sit.
- The x layout advances by duration, so the page redraws with the new spacing
  while the stored beat stays where the parser left it.
- On the page: `на` is event `m1-1-1`, 1/1 of a whole note, 4.0 quarters, beat
  3 of a 12/8 bar; `я` is `m1-5-4`, 5.0 quarters, beat 4. The other pair is
  `m2-9-8`, 4.5 quarters, and `m2-5-4`, 5.0: both beat 4.
- Event ids are built from the parse-time position
  (`musicxml-parser.ts:725`, `mnx-parser.ts:899`), so an id is evidence of the
  ORIGINAL onset and never of the current one. Do not read an id as a position.
- Corroborating: the source file has `тес` as a PLAIN quarter at 3.0 quarters
  (`~/Downloads/Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml`,
  md5 `265f7cb5fa359942b54826795cf10c4f`, byte-identical to
  `apps/web/src/lib/shane/ingestion/fixtures/sunless-01-engraved.musicxml`),
  while the page draws it a dotted quarter wide.

## 3. The decision this brief does NOT make

There are two candidate fixes and the desk is not choosing between them,
because the choice belongs to whoever has read the modification path in full:

1. **Recompute positions at the edit.** After a duration change, re-derive
   `rhythmicPosition` for every following event in that measure.
2. **Derive the beat at render time** from the running sum of durations, and
   stop reading `rhythmicPosition` in the beam pass.

**State which you chose and why, in the memo, before you write the code.** Say
what each costs. If a third option is better, name it.

## 4. What to build

- The chosen fix, and nothing else in the same commit.
- **A test that pins the rule**, not the symptom: given a measure whose first
  note is lengthened, the following notes' beats are what the durations say
  they are. It must fail against today's tree.
- **State the rule in the memo, in one paragraph a singer could read.** It goes
  to Dann for the Guide (N.84). The desk's reading of the current rule, for you
  to correct: a beam joins two or more consecutive flagged notes inside one
  measure, one beat, and one timbre, and it breaks at a rest, a barline, a beat
  boundary, an unanalysed note, or a timbre change.

## 5. What NOT to do

- Do not change what the rule IS. Dann has not ruled on beaming policy, only
  that whatever the policy is must be applied consistently.
- Do not change `VocalLineEvent`'s shape, per CONTRACT §6.
- Do not touch `page-layout.ts:376`.
- Do not read an event id as a rhythmic position anywhere.

## 6. Establish, do not assume

**Two other consumers compare the same field against a tempo or marking
position:** `sustain.ts:67-79` and `watchlist.ts:232-240`. Say whether a
corrected duration can mis-assign a sustain marking or a watch-list entry, and
if it can, say so plainly rather than fixing it in this commit.

## 7. Definition of done

- On Dann's Sunless 01, the two pairs in system 1 are marked the same way as
  each other, whichever way that is.
- The new test fails on the current tree and passes after the fix.
- Five gates at baseline; if gate 4 moves, say the number and move
  `~/Downloads/ilya-ship.sh:79` before the ship.

## 8. The return memo

`docs/sessions/memo-n128-stale-beat_r1_<date>.md`. The choice from §3 with its
reasoning. Files changed with `path:line`. The rule paragraph from §4. The §6
answer. A section listing what you could not establish.

**NOT ESTABLISHED beats a complete invented answer.**
