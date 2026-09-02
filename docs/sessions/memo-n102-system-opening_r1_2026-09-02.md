# Memo: N.102 increment 1b, the courtesy survives the system break

Built 2026-09-02 against `0ed0fd8`, 'N.102: the courtesy accidental across a
barline', which carries increments 1 and 1a both. The working tree was dirty at
the start with `docs/memory/STATE.md` and nothing else.

A courtesy accidental can now be drawn on a measure that opens a system.
`paginateScore` computes what each slice inherits and hands it in;
`renderAnalyzedStaff` seeds its carry from it. The rule itself moved into one
function that both the draw loop and the new walk call, so the paginator and the
renderer cannot answer differently.

**On Without Sun song 1, no system-opening measure carries a courtesy that it
did not carry before.** The document has no case. Four of its six system openers
now receive a non-empty inherited state where they previously received nothing,
and none of the four meets a note that earns a courtesy. §3 gives the four, one
line each, and says why.

**§5 is a correction.** Increments 1 and 1a moved a family of `path:line`
citations in the loupe's own source that I did not repair at the time. Thirteen
of them are repaired here, and the memo says which and why they were missed.

---

## 1. What changed

### The rule, moved into one place

- `packages/score-parser/src/staff-renderer.ts:315-317` adds
  `accidentalKey(pitch)`, the step-and-octave key both callers use.
- `:327` adds `AccidentalMark`, which is `'none' | 'required' | 'courtesy'`.
- `:348-366` adds `advanceAccidentalState(pitch, fifths, measureAcc,
  prevMeasureAcc)`. It is the whole accidental rule, it mutates both carry maps
  exactly as the draw loop did when the draw loop owned the rule, and it returns
  which mark the note draws.
- `:1552` is the draw loop's one call to it. Everything below that line now
  decides only what the mark looks like; what it is was decided in the function.
  **This half is a refactor and changes no output**: the whole suite passed on
  it before a single line of the new feature was written.

### The walk

- `:393-414` adds
  `accidentalStateAtEndOf(parsed, measureIndex, fifths)`, which walks the sung
  line from measure 0 and returns the state standing at the end of
  `measureIndex`. It walks through `advanceAccidentalState`, so it and the draw
  loop cannot drift.
- It walks from measure 0 rather than from the measure asked about, and it has
  to: a courtesy drawn in one bar writes to that bar's own state, so the state at
  the end of any bar depends on the whole chain before it.
- A negative index returns an empty state, which is the first system's case, and
  a measure holding no sung event returns an empty state, which is the truth
  about a bar the singer does not sing.

### The option

- `:255-273` adds `incomingAccidentals?: Record<string, number>` to
  `StaffRenderOptions`, the state at the end of the measure before the slice's
  first measure, keyed as `measureAcc` keys it.
- `:1284-1298` seeds `measureAcc` with it, and **that is the whole handoff**.
  The first pass through the measure-change block moves `measureAcc` into
  `prevMeasureAcc` and resets it, under the same `curMeasure + 1` guard every
  later measure gets. Seeding `prevMeasureAcc` directly would have needed a
  special case and would have got one case wrong: a slice that opens on a tacet
  measure, whose first sung event lands in rebased measure 1, must DROP the seed,
  because the bar directly before that event is the slice's own silent first bar.
  Seeding `measureAcc` gets that right without asking.

### The paginator

- `packages/score-parser/src/page-layout.ts:176-178` reads the score's key
  signature once and defines `incomingAt(fromMeasure)`, which is
  `accidentalStateAtEndOf(parsed, fromMeasure - 1, fifths)`.
- `:207` passes it on the main render of every system, and `:296` on the
  re-render of the last system that N.6c does when it falls short of the line.
  **Both call sites, because a system rendered twice must be rendered the same
  way twice.**

### The tests

- `packages/score-parser/src/staff-renderer.test.ts:1287-1400` adds
  `describe('the courtesy survives the system break (N.102 increment 1b)')`,
  eight tests: five on the pure walk and three through `paginateScore`.
- `:28` imports `paginateScore` and `:30` adds `accidentalStateAtEndOf`.

The turning layer is untouched.

---

## 2. What the tests pin

**The pure walk**, on the two-measure C-major fixture the N.102 block already
owns:

| fixture | asked | answer |
|---|---|---|
| B flat in bar 1, B natural in bar 2 | end of bar 1 | `{ B4: -1 }` |
| B flat then B natural, both in bar 1 | end of bar 1 | `{ B4: 0 }` |
| nothing altered | end of bar 1 | `{}` |
| B flat in bar 1, B natural in bar 2 | end of bar 2 | `{ B4: 0 }`, the courtesy's own write |
| the same | before bar 1 | `{}` |
| bar 2 holds no sung event | end of bar 2 | `{}` |

The fourth row is the one that proves the walk runs the courtesy rule and not
only the required one. A courtesy drawn in bar 2 writes to bar 2's state, and a
walk that only knew about required accidentals would hand bar 3 the wrong carry.

**Through `paginateScore`**, on a page too narrow to hold two measures, so every
measure gets a system of its own and the boundary under test is where the test
puts it rather than where the packing arithmetic happens to land:

- A flat in bar 1 and a natural in bar 2 draws exactly one bracketed natural, on
  the second system, bound to that system's first note.
- The same two measures with nothing altered draws none.
- The first system draws none, which pins that the option cannot make a piece
  open on a courtesy.

---

## 3. The walk, on Without Sun song 1

`pnpm --filter @ilya/web build` succeeds and writes the site to `build/`
(`stamp-sw: CACHE_VERSION is now ilya-1788327719281`). The reading is on
`pnpm --filter @ilya/web dev` at 1400 x 900, on
`tools/e16-harness/output/mussorgsky---sunless-01---within-four-walls/repaired/score.repaired.musicxml`
staged into `apps/web/static/reader/` after the server was up, read off the live
DOM. Bass clef, two sharps, 18 bars, seven systems at `0-2`, `3-5`, `6-8`,
`9-11`, `12-14`, `15-16`, `17-17`.

### No system-opening measure carries a courtesy that it did not before

The page draws the same two courtesies increment 1a drew and no others: bar 3's
B3 natural on `m2-0-1`, and bar 6's F3 sharp on `m5-1-4`. All 16 required
accidentals are unchanged. **There is no third mark, so there is no screenshot of
a new one to take.**

### What the six openers now inherit, and why none of them draws

The state at the end of a measure is exactly the set of pitches that carried a
drawn accidental there, which the page itself reports. Read that way:

| system | opens on | inherits from the bar before | why nothing is drawn |
|---|---|---|---|
| 1 | bar 1 | nothing precedes it | there is no bar before the piece |
| 2 | bar 4 | `{ B3: 0 }` | bar 4 opens on B3 **flat**, so the required rule fires first |
| 3 | bar 7 | `{ F3: 1, A3: -1 }` | bar 7 sounds neither F3 nor A3 |
| 4 | bar 10 | `{}` | bar 9 altered nothing |
| 5 | bar 13 | `{ B3: -1 }` | bar 13's B3 is flat again, so the required rule fires first |
| 6 | bar 16 | `{ B3: -1 }` | bar 16 sounds no B3 at all |
| 7 | bar 18 | `{}` | bar 17 altered nothing |

**The first system-opening measure whose previous bar carries an alteration is
bar 4**, measure index 3, inheriting `{ B3: 0 }` from bar 3's own courtesy. It
is the closest this document comes. Its first note is B3 flat, which contradicts
the key signature, so `advanceAccidentalState` returns `'required'` and the
courtesy branch is never reached. That is correct by rule 121 as the brief
distils it: a restated accidental IS the cancellation, and it is never
parenthesized.

The screenshot in this session shows bar 4 at 3x, with a 12x companion: bass
clef, two sharps, then the B3 flat drawn bare at x 66.38, with no parenthesis.
It is evidence that the new seed reaches that measure and adds nothing to it.

### That the plumbing is live, proved on the running build

A page that draws no new mark cannot, by itself, tell a working feature from an
unloaded one. So the check was made in the browser, against the dev server's own
module graph and the real Finale Maestro metrics, by importing
`page-layout.ts` and `overlay-engine.ts` through Vite and paginating a
two-measure probe onto two systems:

| probe | second system's bracketed accidentals |
|---|---|
| B flat in bar 1, B natural in bar 2 | **1**, bound to `p2`, that system's first note |
| nothing altered in bar 1, B natural in bar 2 | **0** |

The served modules export `accidentalStateAtEndOf` and `advanceAccidentalState`,
so the code the page runs is the code this memo describes. **The probe is a probe
and not the document**: it says the feature works in the running build, not that
Without Sun song 1 has a case for it.

---

## 4. Gates

Run in the maintainer's terminal, before the edit and after it.

| gate | baseline | after | moved |
|---|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` | no |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` | no |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same | no |
| 4 web-test | `920 passed (920)` | `920 passed (920)` | no |
| 5 score-parser | `496 passed \| 5 skipped (501)` | `504 passed \| 5 skipped (509)` | **yes, +8** |

`npx tsc --noEmit` over `packages/score-parser` exits 0.

**Yes, line 80 of `~/Downloads/ilya-ship.sh` must change.** It currently reads
increment 1a's baseline:

```
gate 5 score-parser "496 passed | 5 skipped (501)"              pnpm -C "$REPO" --filter @ilya/score-parser test
```

and must become

```
gate 5 score-parser "504 passed | 5 skipped (509)"              pnpm -C "$REPO" --filter @ilya/score-parser test
```

Gate 4 stays at `920 passed (920)`, so **line 79 does not change.** I did not
edit that file.

---

## 5. A correction: citations increments 1 and 1a moved and I did not repair

Increment 1a inserted `COURTESY_GAP_SP` at `staff-renderer.ts:135`, which moved
every line below it by 20. Increment 1 had already moved everything below
`:1147` by 16. **I checked only the citations I had already touched and reported
that the rest were unaffected. That was wrong**, and this increment's own
insertions made it worse.

The audit here is against `21e9ce2`, the commit before any N.102 work, so what
moved is attributable and what was already stale is not confused with it. For
each citation I read the line it named at `21e9ce2`, found that exact line in the
file today, and repointed only where the two disagree.

**Thirteen citations are repaired**, all in the loupe's own source:

| in | was | now | cites |
|---|---|---|---|
| `apps/web/src/lib/shane/loupe.ts:296` | `:1034` | `:1172` | the clef group opening |
| `loupe.ts:297` | `:1058` | `:1196` | the octave `8` |
| `loupe.ts:297` | `:1077` | `:1215` | the key signature |
| `loupe.ts:298` | `:1214` | `:1382` | the tacet pass |
| `loupe.ts:298` | `:1360` | `:1532` | the note loop |
| `loupe.ts:298`, `:316` | `:1778` | `:2044` | the Cyrillic underlay |
| `loupe.ts:306` | `:1467` | `:1731` | the note's group opening |
| `loupe.ts:309` | `:1383` | `:1559` | the accidental's `partOfEvent` call |
| `loupe.ts:310` | `:1444` | `:1708` | the dot's `partOfEvent` call |
| `loupe.ts:316` | `:1783` | `:2049` | the IPA underlay |
| `loupe.ts:325` | `:964` | `:1102` | the time-signature read |
| `Loupe.svelte:517`, `:593` | `:770` | `:908` | the clef resolution |
| `Loupe.svelte:536` | `:1250-1380` | `:1382-1512` | the tacet pass through the barline draw |
| `loupe.test.ts:445` | `:1423` | `:1559` | the accidental's `partOfEvent` call |
| `correction.ts:381` | `:926` | `:1064` | the rest branch's `continue` |

`loupe.ts:296-298` is the paint-order comment the loupe's head bound rests on,
and five of its six line numbers were wrong. **That is the one that mattered.**

One more citation is repaired because its target no longer exists at all:
`staff-renderer.test.ts:977` cited `staff-renderer.ts:1416`, the `inEffect` test,
which this increment moved into `advanceAccidentalState`. It now cites `:355`.

### Citations left alone, and why

Eight were already wrong at `21e9ce2`, before any of my work, so shifting them
would move a wrong number to a different wrong number:

| in | cites | what stood there at `21e9ce2` |
|---|---|---|
| `Loupe.svelte:396`, `loupe.ts:63`, `:132`, `:360`, `:391` | `:1007`, `:1011` | the r236 and r240 clef-spacing comments, not the hit rectangles the text describes |
| `Loupe.svelte:488` | `:541` | `estimateCyrillicWidthPx`, not the first-column barline |
| `Loupe.svelte:517` | `:739` | a beaming comment, not the head's clef and key |
| `Loupe.svelte:689`, `:707`, `CorrectionSurface.svelte:170` | `:502-505`, `:1061` | `headNameFor`'s switch, not `glyphAt` |
| `entry.ts:322` | `:841` | a bare `*` inside a comment |

**Repairing those is a separate job**, because it means working out what each
sentence meant and finding the line that says it, and getting one wrong would
put a confident number on a guess. They are recorded here so the next pass has
the list.

---

## 6. Housekeeping

- **Nothing was committed and nothing was shipped.** I do not run git.
- Untracked and needing `git add` before the ship: this memo. Seven source files
  are modified: `staff-renderer.ts`, `staff-renderer.test.ts`, `page-layout.ts`,
  and the four whose citations §5 repairs.
- The engraved MusicXML I staged at
  `apps/web/static/reader/n102-without-sun-1.musicxml` is deleted. That
  directory is gitignored and `pnpm --filter @ilya/web dev` empties and
  regenerates it, so anything staged there must be staged after the server
  starts.
- **No user-facing string was added or changed, and no French was coined.**
  `incomingAccidentals`, `advanceAccidentalState` and `accidentalStateAtEndOf`
  are code identifiers.
- Nothing derived is stored. The inherited state is computed at pagination time
  and never written into the score or the song.
- The dev server on port 5173 belongs to another session. I read its DOM, ran a
  probe through its module graph, and staged one file into its gitignored
  `static/reader/`, then removed the file. I changed no page source and left no
  overlay behind.

---

## 7. NOT ESTABLISHED

- **That any real document has a case.** Without Sun song 1 does not, and it is
  the only engraved document walked. The feature is proved by the suite and by
  the browser probe in §3, not by a mark on a page a singer would read. **The
  first document that puts an altered pitch at the end of one system and repeats
  it at the head of the next will be the first real test.**
- **What happens at a key change mid-piece.** `accidentalStateAtEndOf` walks
  under one key signature, `parsed.keySignatures[0]`, because the renderer reads
  only that one too. `sliceScore` does give each slice its own first measure's
  key signature, so a key change at a system boundary already reaches the
  renderer, and the walk would then compute the earlier measures under the wrong
  key. **No document on this machine changes key, and this is not fixed.** It is
  `page-layout.ts:176` if it ever needs fixing.
- **The cost of the walk.** `incomingAt` runs once per system and walks the whole
  sung line to that point, so the pagination cost is O(systems x events). On this
  18-bar document it is invisible. **It has not been measured on anything long**,
  and a prefix computed once would remove it if it ever matters.
- **That `:1360` is the note loop.** `loupe.ts:298` calls it that, and the line
  it named at `21e9ce2` is `highestInk = Math.min(highestInk, y - 6)`, which is
  INSIDE the note loop rather than its opening. §5 preserved the line it pointed
  at rather than improving the aim, because improving the aim is the separate job
  §5 describes.
- **Whether the eight citations §5 leaves alone can be repaired mechanically.**
  Each needs a reading of what its sentence claims. I did not do that reading.
- **That the refactor is output-identical on every input.** It is output-identical
  on the 496 tests that existed before it and on the document walked here, and
  the rule's three branches are transcribed unchanged. That is strong evidence
  and it is not a proof.

---

The commit message is `N.102: the courtesy survives the system break`.
