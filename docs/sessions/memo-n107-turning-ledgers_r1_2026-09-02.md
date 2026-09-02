# Memo: N.107, the turning head counts its ledger lines

Built 2026-09-02 against `62967a7`, 'N.103: the spacer sees ink'. The working
tree was clean at the start.

A turning head outside the stave now draws ledger lines, in lavender at the
head's own 0.85 opacity, centred on the turning head's `tx` and never on the
sung head's `nx`. The sung line and the turning layer draw them through one
function, `drawLedgerLines`, so the two cannot drift. **The sung line's own
ledger markup is byte-identical**, proven by rendering both the old and the new
renderer over 9,408 scores plus the four-measure demo in both modes and
comparing the strings.

On Without Sun song 1, with the demo bass profile seeded as N.106's walk did,
**37 of the page's 95 turning heads sit outside the stave and all 37 now carry
exactly the lines the arithmetic calls for**, with nothing left over.

**Two things the walk could not show you on that page, and both are recorded in
§6:** every one of those 37 sits at the same stave position, one ledger above,
and every one belongs to an aligned unit. No turning head fell below the stave
and none of N.106's 22 displaced units fell outside it.

**Gate 5 moves to `534 passed | 5 skipped (539)`, so `ilya-ship.sh` line 80 must
change.** I did not edit that file. §5 gives the line.

---

## 1. What changed

One source file and its test file.

### The helper

`packages/score-parser/src/staff-renderer.ts:1996-2032` replaces the sung line's
two ledger loops with one function and a call to it.

```ts
const drawLedgerLines = (x: number, ly0: number, colour: string, opacity: number): string[] => {
  const out: string[] = [];
  const op = opacity === 1 ? '' : ` opacity="${opacity}"`;
  const line = (ly: number): string =>
    `<line x1="${round2(x - ledgerHalf)}" y1="${ly}" x2="${round2(x + ledgerHalf)}" y2="${ly}" stroke="${colour}" stroke-width="${ledgerT}"${op}/>`;
  for (let ly = o.staffMidY - 3 * o.lineGap; ly >= ly0 - 1; ly -= o.lineGap) out.push(line(ly));
  for (let ly = o.staffMidY + 3 * o.lineGap; ly <= ly0 + 1; ly += o.lineGap) out.push(line(ly));
  return out;
};
parts.push(...drawLedgerLines(nx, y, '#3a352f', 1));
```

The two loops are the sung line's own, unchanged in their arithmetic and in
their order: above first from the first ledger position outward, then below.

It takes the four arguments your ruling names and no fifth. It is declared
inside the event loop, after `ledgerHalf` and `ledgerT`, so it closes over them
rather than taking a notehead base. That is what makes "spanning the same
`ledgerHalf`" true by construction rather than by a second call that could
answer differently. §6 records what that costs.

`opacity` is emitted only when it is not 1. That single conditional is the whole
reason the sung line's output survives the refactor byte for byte.

The helper returns the lines instead of pushing them, because the turning caller
has to stamp each one with `data-analysis` before it reaches the page.

### The turning caller

`:2327-2341`, immediately after `tx` is settled and before the turning
accidental and head are drawn.

```ts
for (const l of drawLedgerLines(tx, ty, TURNING_COLOUR, 0.85)) {
  parts.push(analysisMark(l, 'turning-ledger'));
}
```

**It sits after the placement, not beside the sung line's call, and that is the
point.** A displaced unit's head is a unit's width right of the sung head, so
ledgers drawn at `nx` would sit under the sung note and state the wrong pitch
about the turning one.

The lines are pushed before the accidental and the head, so the head paints over
its own ledger, which is what the sung line already does.

### The handle

Ledger lines are engraving ink everywhere else in this file. These are not: they
belong to the lavender layer, they say nothing about the sung note, and they have
to leave when the layer leaves. They carry `data-analysis="turning-ledger"`, so
the loupe's filter at `Loupe.svelte:664` drops them with the rest of the layer
and needed no edit.

`:18-20` adds the turning head to the file's own list of what it draws.

### Primitive mode

Runs the same helper with its own numbers, 11 px each side and 1 px thick, as
ruled. No branch anywhere distinguishes the modes for this mark.

---

## 2. Nothing in your ruling had to be corrected

The arithmetic you named is the arithmetic the sung loop already carried, and it
transferred without a change of meaning. The one place the ruling leaves a choice
is the width, and §6 records the choice and its cost.

---

## 3. The tests

Six new tests at
`packages/score-parser/src/staff-renderer.test.ts:491-592`, primitive mode
throughout so every number is arithmetic you can check. The stave is the
renderer's own: `staffMidY` 96 and `lineGap` 12, so the stave lines are 72, 84,
96, 108 and 120, the first ledger position above is 60 and the first below is
132.

| case | what it asserts |
|---|---|
| one line above | sung B4, turning A5: exactly one lavender line, at `y` 60, centred on `turningCx`, carrying `data-analysis="turning-ledger"` and `opacity="0.85"` |
| three lines above | sung B4, turning E6: lines at 60, 48 and 36, in that order |
| below the stave | sung B4, turning C4: one line at 132, the second loop held to the same rule |
| inside the stave | sung B4, turning D5: no lavender line at all |
| a displaced unit | sung A5, turning B5, a second, so N.106 displaces the unit right. Both heads need the first ledger above. The black line stays centred on `nx`, the lavender one on `turningCx`, and the lavender one is to the right of the black one |
| byte-identity | sung C4, turning D5: the page's only ledger equals the exact string the old loop wrote, attribute order and all, with no `opacity` |

A ledger cannot be told from a stave line by ink, because both are `#3a352f` at
1 px. The test helper tells them apart by width: a ledger is 22 px and a stave
line runs the system.

### Two edits to tests that already existed

`:336-390` hoists `P`, `scene`, `sungCx` and `turningCx` out of the N.106
describe to module scope. The N.107 block asks the same question of the same
picture, and a second copy of that fixture is the thing this whole ruling is
against. No assertion changed and the count of N.106's tests is unchanged.

`:623-636` adds `turning-ledger` to the analysis-mark census, which asserts that
the count of `data-analysis` attributes equals the sum of the kinds it knows.
Without the edit the census reads 27 where it expects 20, because the demo score
puts seven lavender ledger lines on the page.

### The byte-identity proof, outside the suite

A temporary copy of the renderer with the pre-refactor loops restored was
rendered beside the new one and the strings compared, with the new output's
`turning-ledger` lines stripped:

- every pitch of four octaves for the sung note against every pitch of four
  octaves for the turning note, at whole, half, quarter and eighth, in treble,
  in bass, and in SMuFL mode against the synthetic font. **9,408 renders, every
  one identical.**
- the four-measure demo, primitive and SMuFL. **Identical.**

Both temporary files were deleted. The check is a one-off, so it is not in the
suite. The byte-identity test in the N.107 case table is what stays.

---

## 4. The walk, on Without Sun song 1

`pnpm --filter @ilya/web build` succeeds (`stamp-sw: CACHE_VERSION is now
ilya-1788378353237`). The walk is on that production build served by
`pnpm --filter @ilya/web preview` at port 4173, viewport 1400 × 900, on
`tools/e16-harness/output/mussorgsky---sunless-01---within-four-walls/repaired/score.repaired.musicxml`
staged into `apps/web/static/reader/` and deleted afterwards, read off the live
DOM. The page renders 8 systems, `lineGap` 5.5 units. No console error at any
point.

**Two staging facts cost time and are worth keeping.** `pnpm --filter @ilya/web
build` runs `scripts/copy-reader.mjs` first, and that script clears
`static/reader`, so a file staged before the build is gone by the time Vite runs.
Stage it after `copy-reader.mjs` and before `vite build`. And `vite preview`
serves only the assets that existed when the build ran: a file dropped into
`build/` afterwards returns 404 however many times the server restarts.

**The document carries no measured voice, so a fabricated one was seeded**, the
same one N.106's walk used: the project's own demo bass profile from
`demo-fixture.ts:61` written into `localStorage` under `shane.profiles.v2`, with
`ɪ` 380, `ɨ` 330 and `ʌ` 600 added for the vowels this text reaches, range C2 to
E4, tessitura F2 to C3. **It is not a singer.** It was cleared when the walk
ended. The page draws 95 turning noteheads, the same 95 N.106 counted, which is
how I know the seeding matched.

### Every turning head outside the stave

**37 of the 95.** Every one of them draws exactly the lines the renderer's own
arithmetic calls for, and the page holds 37 lavender ledger lines in total, so
nothing is drawn that no head asked for.

| what | count |
|---|---|
| turning heads on the page | 95 |
| outside the stave | 37 |
| above the stave | 37 |
| below the stave | 0 |
| carrying exactly the right lines | 37 |
| lavender ledger lines on the page | 37 |
| lines belonging to no head | 0 |

Each line's centre sits on its head's own ink centre to within 0.00 units. Every
line is `stroke="#8E7E9B"`, `stroke-width="0.61"`, `opacity="0.85"`, 9.74 units
wide, which is the font's own notehead width plus its own leger-line extension at
this stave size.

**All 37 sit at the same stave position**, seven steps above the middle line, in
the space above the first ledger, so each takes one line. The seeded profile
reaches no higher turning pitch anywhere on this document. **All 37 belong to
aligned units**, so `tx` equals `nx` for every one of them, and none of N.106's
22 displaced units falls outside the stave. The displaced case and the multi-line
case are covered by the tests in §3 and by the second seeding in this section,
not by this profile on this page.

The sung line draws 5 black ledger lines on the document, and they are where they
were.

### The two panels you asked to see

Each is the page's own system SVG cloned into a fixed overlay with a tight
viewBox, the same instrument N.102 and N.106 used. **The overlay draws the nodes
the page draws.** No page source was changed to look at it, and the overlay was
removed afterwards. The pane captures a 1400-wide viewport into an 800-wide
image, so the on-screen scale carries a 1.75 factor to make the saved image a
true 3×.

- **Above**: system `0-2`, viewBox `176 71.5 26 26`. The lavender head sits in
  the space above the first ledger, with one lavender line at 79.5 running
  under it and out both sides. The sung head is on the top stave line below,
  with the turning sharp to the left.
- **Below**: viewBox `139.25 100 26 32`, and it needed the second seeding named
  in this section. Three lavender lines below the stave, evenly spaced at the
  stave's own gap, with the head sitting on the third.

### The second seeding, and why there is one

No turning pitch on this document falls below the stave under the demo bass
profile, so the below-stave case had nothing to photograph. Dividing every `fR1`
in that profile by 4 drops every turning pitch two octaves, which is a
fabrication on top of a fabrication and is not a voice in any sense. It is worth
recording because of what it exercised:

| lines needed | heads |
|---|---|
| 1 | 37 |
| 2 | 11 |
| 3 | 29 |
| 4 | 11 |
| 5 | 7 |

All 95 turning heads then sit below the stave, **all 95 draw exactly the right
lines**, the page holds 225 lavender ledger lines, and none belongs to no head.
That is the multi-line loop exercised 58 times on real notation. This seeding was
cleared with the first.

---

## 5. Gates

| gate | baseline | after | moved |
|---|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` | no |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` | no |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | `found 0 errors and 7 warnings in 4 files` | no |
| 4 web-test | `920 passed (920)` | `920 passed (920)` | no |
| 5 score-parser | `528 passed \| 5 skipped (533)` | `534 passed \| 5 skipped (539)` | **yes, +6** |

`npx tsc --noEmit` over `packages/score-parser` exits 0.

**One line of `~/Downloads/ilya-ship.sh` must change, and it is line 80.** I did
not edit that file.

```
gate 5 score-parser "528 passed | 5 skipped (533)"              pnpm -C "$REPO" --filter @ilya/score-parser test
```

becomes

```
gate 5 score-parser "534 passed | 5 skipped (539)"              pnpm -C "$REPO" --filter @ilya/score-parser test
```

The +6 is six new tests. The census test and the four hoisted helpers were edited
in place, so they add nothing to the count.

**`docs/memory/STATE.md` changed on disk at 15:46 during this session and I did
not write it.** `ilya-ship.sh` runs `git add -u`, so that file goes into this
commit unless you deal with it first.

---

## 6. NOT ESTABLISHED

- **That a turning ledger should be as wide as the SUNG head's, which is what it
  now is.** Your ruling names "the same `ledgerHalf`" and a four-argument helper,
  and the two together settle it: the helper closes over the sung note's
  `ledgerHalf` and has no argument to take another. In primitive mode this costs
  nothing, because that mode's ledger is 11 px whatever the note. In SMuFL mode
  the turning head is always `noteheadBlack`, so it costs nothing under a quarter
  or shorter either. **Under a half, whole or breve sung note the turning ledger
  is a little wider than the head it carries**, because those heads are wider
  than a black one. Nothing on Without Sun song 1 shows it: the 37 heads outside
  the stave all belong to quarters. The alternative is a fifth argument and two
  answers to "how wide is a ledger", which is what this ruling was against.
- **Whether the turning ledger should be lighter than the head, or the same.**
  It is the same, 0.85, on your ruling. A ledger line at a notehead's own opacity
  is heavier ink per square unit than the notehead is, because the head is a
  filled shape and the line is a hairline. Whether that reads as right is your
  eye. The 3× panels are the closest thing here to the page's own size.
- **That the lines should stop at the head rather than continue past it.** They
  do neither: they span the head plus the font's own leger-line extension on each
  side, which is what the sung line does and what "exactly the sung loop's
  arithmetic" gives. Nobody has asked whether an analysis-layer ledger should be
  shorter than an engraving one so the two read as different marks when they
  share a stave position.
- **What two ledgered heads at the same position look like when the unit is
  displaced.** The test in §3 holds the geometry: the black line stays on `nx`,
  the lavender on `tx`, and they do not overlap at the page's clearance. **No
  such pair exists on Without Sun song 1**, so no photograph of one exists. It is
  the case I would want your eye on next.
- **What a walk on a real measured voice shows.** Both seedings in §4 are
  fabricated, so which heads fall outside the stave is an artifact of the numbers
  I seeded. The geometry is the page's; the census is not a claim about any
  singer.
- **Whether column spacing should reserve room for a ledgered turning head.** It
  does not, and N.106 recorded the same gap for the displaced unit. A ledger is
  wider than the head it serves, so a ledgered turning head occupies more
  horizontal room than `columnInk` credits it with. It does not collide anywhere
  on this document. Closing it means teaching the layout pass another
  analysis-layer measurement, which is yours to rule.
- **Whether the loupe should show these at all.** They carry `data-analysis`, so
  the loupe drops them with the layer, and a loupe crop of a ledgered turning
  head therefore shows the sung ledger and not the lavender one. That follows
  your ruling that they toggle with the layer. It is recorded because the loupe
  is where a reader goes to check a ledger count.
