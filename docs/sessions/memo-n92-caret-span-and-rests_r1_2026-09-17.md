# Memo: the caret inside the squircle, and the rest that has no edges

**Reply to `brief-n92-caret-span-and-rests_r1_2026-09-17.md`.** Built in
Claude Code, branch `Shane`, on top of `7e28272`. Nothing else changed the
tree this session, and no commit was made. **WRITTEN, not DONE**: section 5
below says exactly where this stands against the brief's own definition of
done.

## 1. What changed, by file and line

**`apps/web/src/lib/shane/Loupe.svelte:1291-1322`.** The squircle clearance
gained a floor and a ceiling: after the existing neighbour clamp computes
`pushed`, the LEFT branch takes `Math.min(pushed, ringX - ringStroke / 2)`
and the RIGHT branch takes `Math.max(pushed, ringX + ringW + ringStroke /
2)`. §2 is why this was needed: the neighbour clamp, shipped in the previous
brief, can be stricter than clearing the squircle's own stroke, and where it
is, it was winning outright, leaving a caret inside the squircle. The floor
and ceiling make clearing the stroke the one requirement that always holds.
The neighbour clamp still governs everything short of that conflict, which
on the fixture is every OTHER caret.

**`packages/score-parser/src/staff-renderer.ts:2626-2662`.** A rest now
draws the same hit rectangle a note does: same `prevXById`/`nextXById`
extent, same `pointer-events`/`cursor` treatment, same `data-hit="${ev.id}"`,
emitted first so the glyph paints over it. It is wrapped in its own `<g
pointer-events="none">`, matching the note branch's own reason (N.71: a
click landing on the glyph's own painted pixels must fall through to the
rectangle beneath it), but **not named `data-event-id`** the way the note's
wrapper is. §3 is why: that attribute is also half of `Loupe.svelte`'s own
test for telling a rest's glyph from a note's, and naming the rest's group
that would have broken it the moment this shipped.

No changes to `entry.ts`, to `positionsInMeasure`, to `handleLoupePickGap`,
to `setCursor`, or to `handleTap`'s one-pool resolution. The brief's own
instruction, "do not special-case the caret geometry to fake a rest's
edges," held: the caret's own x-derivation code (unchanged since the first
caret ship) already fell back to a neighbour's edge when an entry had none,
and that fallback already computed the exact position a rest's own hit
rectangle now supplies, so nothing there needed to know a rest exists.

## 2. Why the squircle-inside bug needed a floor, not just a wider check

I first read clause 5's own diagnosis (a gap deep in the squircle's span
"caught by neither band") as describing two separate 1.2-line-gap margins
with nothing checked in between. `Loupe.svelte`'s actual check
(`mark.x <= bandLeft || mark.x >= bandRight`) was never two bands: `bandLeft`
and `bandRight` already sit 1.2 line-gaps past EACH stroke, so together they
already bound the squircle's whole span, centre included. A caret deep
inside it was never skipped by that check.

**MEASURED live on the fixture, m. 6 of Without Sun song 1**, walking to the
note Dann's own screenshot shows (`A♭3 · Eighth · ка`, id `m5-9-8`, the
squircle N.141 draws for it spanning `558.15` to `583.33` in system units):
the gap after it (`after="m5-9-8"`) computed its full outward push correctly,
`bandRight = 589.93`, but the neighbour clamp (guarding against the NEXT
note, `m5-5-4`, whose hit rectangle starts at `581.89`, close enough that
`hitHalf` short of its own centre is `580.495`) capped the push at
`580.495`, short of the squircle's own outer stroke at `583.33`. The clamp,
built to keep a caret from colliding with the wrong note, was silently
allowed to leave one standing inside the right one, because nothing compared
its result to the stroke it was supposed to be clearing in the first place.

The fix does not remove the neighbour clamp: it still runs first and still
wins whenever it can, so a caret keeps the full `hitHalf` separation from its
neighbour everywhere that separation and squircle-clearance do not conflict.
Only where they conflict does the stroke floor override it, and only by as
much as the conflict demands: re-measured after the fix, the same gap
renders at `583.332...`, exactly the squircle's own outer stroke edge, no
further.

**No other caret in the fixture needed the override.** I walked every
measure with a squircle (every note I selected across m. 2 to m. 18 across
this and the two prior caret briefs), and this is the only case on record
where the neighbour clamp and the stroke conflicted. The rest of the
fixture's clamps (m. 8, m. 9, from the previous brief's own memo) had enough
room for both.

## 3. The rest's hit rectangle, and what else reads `data-event-id`

Before drawing it, I read every place in the tree that keys off
`data-event-id`, since a rest never carried one and I did not want to hand
it one by accident:

- **`Loupe.svelte`'s `restOrNoteInk`** (used for the opening-barline search)
  tests `el.tagName === 'text' && !el.closest('[data-event-id]')` as HALF of
  how it tells a rest's glyph from a note's. Naming the rest's new wrapper
  `data-event-id` would have made every rest fail that test the moment this
  shipped, silently breaking barline-opening detection for any measure that
  opens on one.
- **`Loupe.svelte`'s `firstGroup`/`firstId`** (also barline-opening) and
  **`VoiceProfilePane.svelte`'s own `data-event-id` queries** (selection-ring
  and ink highlighting) both walk `[data-event-id]` generically. Leaving
  rests out of that set is what keeps their behaviour exactly as it was
  before this ship, since neither was asked to change here.

So the rest's wrapper is an anonymous `<g pointer-events="none">`, carrying
none of that. The only new identity a rest carries is `data-hit`/(in the
loupe's clone) `data-loupe-hit`, which is the one thing this brief asked
for.

**What else changed, as asked.** `restOrNoteInk` also scans for
`el.hasAttribute('data-of-event')` and OR's it into `isNote`. A rest's own
rectangle carries neither `data-of-event` nor `data-event-id`, so it is
picked up by that function's OTHER branch, `isRest`, exactly as before. Its
own hit rectangle changes nothing about how that function classifies it,
only that a rest can now additionally be found by `data-hit`, which nothing
there queries. I did not find anywhere else in `Loupe.svelte`,
`VoiceProfilePane.svelte`, or `+page.svelte` that assumed a rest carries no
`data-hit`. `heldMeasureIds` in `+page.svelte` (`ev.type !== 'rest'`, the
list that sizes the loupe's OWN frame) filters by `ev.type`, not by whether a
rectangle exists, so it is untouched and a rest still contributes nothing to
that particular list. **NOT ESTABLISHED beyond what I read**: this was a
read of the three files the caret and selection code lives in, not a search
of the whole tree for every possible reader of `[data-hit]`.

## 4. Live walk

`pnpm dev`, the same fixture as the prior two caret memos
(`tools/e16-harness/output/mussorgsky---sunless-01---within-four-walls/score.mxl`,
staged and removed from the gitignored `apps/web/static/reader/`), desktop
width.

- **The squircle bug, before and after.** Selected `m5-9-8` in m. 6: before
  the fix, the gap after it rendered inside the squircle's span (confirmed
  by direct comparison against the ring's own stroke edges). After, zero
  gaps render inside the span (`caretsInsideSquircle: []`, checked against
  every gap in the measure).
- **The rest, before and after.** Before this session's edits (still on
  `7e28272`), the measure's hit-rectangle list held 16 ids, none of them the
  three rests present (`m4-11-8`, `m5-3-8`, `m5-11-8`). After, it holds 19,
  all three included, each carrying `cursor="pointer"` and
  `pointer-events="all"` exactly like a note.
- **No two carets stand contiguous.** The two gaps flanking the rest
  `m5-3-8` render 16.5 system units apart (the narrowest separation in the
  measure, but not zero), and the rest's own new hit rectangle spans exactly
  that gap, `467.01` to `483.51`: the two carets now bracket something, per
  Dann's own "parentheses" framing.
- **A tap on the rest selects it, on the page and in the loupe.** A REAL
  click (this pane's `computer` tool, not a synthetic DOM dispatch) on the
  rest's own glyph on the page, with the loupe closed, raised the loupe on
  m. 6 and read `Rest · beat 2 · Eighth` on the loupe's own second line,
  matching a note's own format exactly. The same tap inside the loupe's own
  clone read `Rest · Eighth`.
- **A tap on a note and a tap on a caret still resolve as before.** Both
  confirmed by real clicks. A note tap read its own pitch and syllable, and
  a caret tap read `after Ком · the next duration enters here`.
- No console errors across the walk.

**One methodology note, not a product finding.** Synthetic
`element.dispatchEvent(new MouseEvent(...))` calls, used freely in the two
prior memos' testing, proved unreliable for this session's page-tap tests
specifically: several produced an unexplained empty selection that a REAL
click at the same coordinates did not. I could not fully trace the cause
before concluding it was a test-harness artifact (most likely
`gestureBeganOnSurface` or a related pointer-capture flag that only a true
`pointerdown`/`pointerup`/`click` sequence sets correctly), not a defect in
the shipped code: every real click, on every scenario section 5 asks about,
resolved correctly. Recorded here so a future session does not re-chase the
same false trail.

## 5. Definition of done, walked against

1. **Yes.** No caret's drawn mark stands anywhere between the squircle's two
   strokes. Measured directly against the ring's own stroke edges for every
   gap in the one measure the bug was found on, and the fixed formula stops
   exactly at the outer edge, never past it.
2. **Yes.** The rest in m. 6 carries a caret on each side, and the narrowest
   separation found anywhere in the fixture (the rest's own two flanking
   gaps) is 16.5 system units, never zero.
3. **Yes.** A tap on a rest selects that rest, confirmed on the page and in
   the loupe, by real clicks.
4. **Yes.** A tap on a note and a tap on a caret resolve as they did before
   this session, confirmed by real clicks.
5. **Yes, none moved.** phonology 216, dictionary 235, score-parser 567
   passed + 5 skipped (572, **unchanged**, despite touching
   `staff-renderer.ts`: the new rectangle changes no existing assertion),
   web-test 1265 (unchanged, no new test file), web-check 0 errors, 12
   warnings, 5 files (unchanged).

## 6. What I could not establish

- Whether the stroke-floor override (§2) is ever itself in tension with the
  neighbour clamp badly enough to put a caret INSIDE the neighbour note's own
  hit rectangle past its centre, rather than merely short of the full
  `hitHalf` margin. On the one fixture case it fires (m. 6), the override
  lands at `583.33`, which is `7.24` units short of the neighbour's own
  centre (`590.575`), comfortably inside the safe margin the previous
  brief's own fix established. But I did not construct a case where the
  squircle and the very next note are close enough that even the bare
  stroke edge would cross a neighbour's centre. Not encountered here, and
  not proven impossible.
- Whether every reader of `[data-hit]`/`data-loupe-hit` in the tree
  tolerates a rest carrying one now. §3 names the three files I read
  (`Loupe.svelte`, `VoiceProfilePane.svelte`, `+page.svelte`). I did not
  search the rest of the app.
- The synthetic-dispatch unreliability named in §4. I have a plausible
  cause and no confirmed one.

## 7. Files to `git add`

No new source files. Two existing files changed:

- `apps/web/src/lib/shane/Loupe.svelte`
- `packages/score-parser/src/staff-renderer.ts`

`docs/memory/OPEN.md` was already modified when this session started,
carrying the brief's own clause 5 ruling. It was not touched further here.

One new file, this memo:
`docs/sessions/memo-n92-caret-span-and-rests_r1_2026-09-17.md`.
