# Memo: N.147, the syllables move into the loupe, and a note tap only selects

Revision 1, 2026-09-17. Built in Claude Code, on branch `Shane`, against the
brief at `brief-n147-syllables-in-the-loupe_r1_2026-09-17.md`. All five gates
run and green; see the table below.

## Step 0. The survey

### 1. Every reader of `pairingCursor` and `slotQueue`

Surveyed before any edit. Both symbols lived entirely in `+page.svelte`.

**`pairingCursor`.** Every real reader was inside the placement gesture this
brief replaces:

- `placeArmedSyllable` (old `+page.svelte:660-683`): looked it up as an index
  into `slotQueue` to find the armed syllable. Gone with the function.
- The `UndoEntry` snapshot/restore pair (old `:891`, `:915`, `:924`): carried
  it so undoing a placement rolled the cursor back too.
- `SyllableStation`'s `cursor`/`oncursor` props (old `:4441`, `:4443`): drove
  the drawer's own "armed syllable" highlight and let a tap on a syllable
  re-arm it.
- Six clamp sites (old `:636`, `:682`, `:2422`, `:2494`, `:3101`, `:3244`,
  `:3540`): kept it inside `[0, slotQueue.length)` after an upload, a
  rebuild, or a song switch.

**None of them still makes sense once the loupe no longer "places the
syllable at the cursor."** The brief's own ruling 3 ("no syllable is focused
or armed by default") retires the whole concept, not just the note-tap path:
there is no longer any stored index into the queue anywhere in the app.
`pairingCursor` is deleted in full, state declaration, `UndoEntry` field,
snapshot, restore, and all six clamp sites. **This was a bigger deletion than
the brief's own framing implied** ("the pairing cursor... loses its job in
the loupe"): it loses its job everywhere, because nothing else ever read it
for any other reason. Undo/redo need nothing in its place: `UndoEntry.selected`
already carried `selectedEventId` for an unrelated reason (N.92 slice 3, so a
gap cursor restores correctly), and a placement now moves `selectedEventId`
itself (via `setCursor`) rather than a second field, so the existing
`selected` field already restores a placement's pre-placement selection on
undo, at no extra cost.

**`slotQueue`.** Every reader that is not part of the retired placement
gesture is unaffected by this brief and reads exactly as it did:
`refreshPairings` (`+page.svelte:414`), `placedSlotCount` (`:421-431`, feeds
Shift Lyrics' header AND the drawer's closed "Input" band line, confirmed by
`inputStateLine` at `bandState.ts:67-80`, called `+page.svelte:2214-ish`),
`queueExhausted` (`:503`), `reseatByDiff` (`:2487` region), `IntakePanel`'s
`syllablesTotal` prop (deleted with the drawer's row, see below), and the two
Shift Lyrics headers' `total` prop (loupe dock and desktop drawer). The one
reader that changes is the placement site itself: `slotQueue[pairingCursor]`
is gone, and the new `placeSyllableOnSelected` instead receives the tapped
`Slot` directly as an argument from `LoupeSyllables`'s `onplace` callback.

### 2. The "next entry" step

**No such function existed.** Searched for `nextSlot`, `advanceCursor`,
`nextEntry`, "next unplaced," and found nothing. The closest relatives,
`shiftToNextOpenNote` and `shiftToEndOfLyric` (`pairings.ts`), are bulk
pairing-map rewrites for the Shift Lyrics dock verb, not a selection-navigation
primitive, though `shiftToNextOpenNote`'s inline scan (`map[eventIds[i]] ===
undefined`) is the right test for "open," and I reused it.

**Built new: `nextOpenSyllableTarget(map, eventIds, fromId)`,
`pairings.ts:1121-1131`.** Walks `eventIds` forward from just past `fromId`,
returns the first id with no entry in `map` at all (undecided; a `melisma` or
`empty` mark is a decision and does not count as open, the same distinction
`shiftToNextOpenNote` already draws), or `null` at the end. Stops rather than
wraps, the same rule `pairingCursor`'s own advance followed, for the same
reason: a wrap would silently start overwriting from the top.

### 3. Tests asserting a loupe tap places

**None existed.** No `.svelte.test.ts` file exists anywhere in this tree (a
repo-wide search confirms it; the project's whole test suite is pure-function
unit tests on `.ts` modules under `vitest`'s `node` environment, never a
mounted Svelte component), so there was no test exercising `handleLoupePick`
or `Loupe.svelte`'s `onpick` wiring to name or change. This is a genuine gap,
not a set of tests I rewrote; see "What I could not establish," DoD items 1
and 3, below.

## What changed, by file and line

**`apps/web/src/lib/shane/pairings.ts`** (+67 lines)
- `placeSyllable(map, eventIds, eventId, slot)`, `:1083-1101`. Writes one
  slot's `{cyrillic, ipa, vowel, origin}` onto one note, refusing (returns
  `null`) when the note is not in `eventIds` (N.142's rest/tie-continuation
  guard, carried over verbatim). Pulled out of the old `placeArmedSyllable`
  so it is unit-testable without mounting `+page.svelte`.
- `nextOpenSyllableTarget(map, eventIds, fromId)`, `:1121-1131`. See step 0
  answer 2.

**`apps/web/src/lib/shane/pairings.test.ts`** (+66 lines, 8 new tests)
- `describe('placeSyllable', ...)`, `:535-559`: writes the IPA, overwrites an
  already-seated note, refuses a note outside `eventIds`, does not mutate its
  input map.
- `describe('nextOpenSyllableTarget', ...)`, `:564-590`: finds the next
  undecided note, skips a `melisma`/`empty` mark, stops at the end rather than
  wrapping, searches from the start when `fromId` is not itself in
  `eventIds`.

**`apps/web/src/routes/+page.svelte`** (net -223 lines including the removed
snippet and props)
- `pairingCursor` deleted entirely: declaration, `UndoEntry` field, snapshot,
  restore, and all six clamp sites (see step 0 answer 1).
- `placeArmedSyllable` replaced by `placeSyllableOnSelected(slot: Slot)`,
  `:659-672`. Reads `selectedEventId`, calls `placeSyllable`, pushes the
  existing `loupe.undo.placed` undo entry, writes `doc.pairings`, then calls
  `nextOpenSyllableTarget` and moves the selection there via `setCursor` if
  one exists.
- `handleLoupePick`, `:710-712`, is now `setCursor({kind:'entry', id:
  eventId})` and nothing else, i.e. identical to `handleNotePick` (`:694`).
  Kept as a separate function rather than merged into one, because the two
  taps land on two different surfaces and a future ruling could still tell
  them apart; that is a name-only decision, freely reversible.
- New state: `let loupeSyllablesOpen = $state(false)`, `:1461`, the row's own
  disclosure state. Lives here rather than in `Loupe.svelte` because that
  component is destroyed and recreated on every raise and dismiss
  (`{#if loupeAvailable && loupeOpen && cursor}`), which would reset a local
  `$state` there every time instead of once per session, contradicting the
  ruling.
- `<IntakePanel>` call site: `syllablesPlaced`, `syllablesTotal`,
  `onstartover` props removed (the row and its "Start placement over" pill
  are gone; see "Decisions this brief did not settle," below).
- The `syllableLine` snippet and its `<SyllableStation>` instance are deleted
  outright.
- `<Loupe>` call site: five new props, `slots={slotQueue}`,
  `pairings={shownPairings}`, `onplace={placeSyllableOnSelected}`,
  `syllablesOpen={loupeSyllablesOpen}`,
  `ontogglesyllables={() => (loupeSyllablesOpen = !loupeSyllablesOpen)}`
  (`:4970-4977` region).
- `import SyllableStation from '$lib/shane/SyllableStation.svelte'` removed;
  `placeSyllable`, `nextOpenSyllableTarget`, `type Slot` added to the
  `pairings.ts` import.
- A number of doc comments that named the retired gesture (`placeArmedSyllable`,
  `pairingCursor`, `SyllableStation`) are corrected in place rather than left
  to mislead the next reader; none of these touch behaviour.

**`apps/web/src/lib/shane/Loupe.svelte`** (+231 lines)
- Five new props: `slots`, `pairings`, `onplace`, `syllablesOpen`,
  `ontogglesyllables` (interface `:98-132`, destructure `:150-155`).
- Markup: a hairline, a full-width `SYLLABLES` disclosure in the loupe's own
  tag style, and, when open, a `<LoupeSyllables>` instance, all inside the
  existing `.loupe` div, right after `.loupe-window` closes (`:1600-1631`
  region). Gated on `slots.length > 0`, the same "nothing to show" gate the
  drawer's retired row kept.
- New CSS: `.loupe-syl-hairline`, `.loupe-syl-toggle`, `.loupe-syl-label`
  (`.loupe-tag`'s five declarations plus `text-transform: uppercase`, kept as
  its own class rather than added to `.loupe-tag` itself, so the measure tag's
  own strings are not forced into capitals too), `.loupe-syl-chevron`
  (`:1756-1820` region).
- `Frame` gained two fields, `stageTop`/`stageBottom` (`:576-583`), the two
  bounds `centreY` was already clamped against, now carried so a second clamp
  can reuse them once the row's real height is known.
- **The viewport-containment fix**, `:1371-1424` (see "What I built beyond
  the brief's letter," below): a `ResizeObserver` on `.loupe` itself
  (`loupeEl`/`measuredHeight`, `:1401-1412`) feeding a `shownCentreY` derived
  value that reruns `centreOnPage` with the box's TRUE rendered height instead
  of the old `windowHeight + CHROME` estimate, plus a second, narrower clamp
  for the case the first one cannot resolve (see below). `top: {frame.centreY}px`
  in the markup became `top: {shownCentreY}px`.

**`apps/web/src/lib/shane/LoupeSyllables.svelte`** (new file, 309 lines).
Replaces `SyllableStation.svelte`; see "Reused or replaced," below.

**`apps/web/src/lib/shane/SyllableStation.svelte`** deleted (260 lines).

**`apps/web/src/lib/components/Drawer/IntakePanel.svelte`** (net -315 lines)
- `syllableLine`, `syllablesPlaced`, `syllablesTotal`, `onstartover` props
  removed from `Props` and the destructure.
- `syllablesOpen` local state and `showSyllables` derived removed.
- The whole `{#if showSyllables}...{/if}` markup block removed (the open
  row, the collapsed preview row, and the "Start placement over" pill).
- The `placedLine` import removed (its only callers were in the deleted
  block).
- CSS removed: `.syl-box`, `.syl-row`, `.syl-preview`, `.syl-head`,
  `.syl-start-over`, `.syl-toggle`, `.syl-count`, `.syl-chevron` and its
  `.expanded` state, their `pointer: coarse` touch floor, and the
  `--intake-row-gap` custom property (both its spends were inside this
  block).
- **Consequence, reported rather than hidden**: `.action-btn`, `.btn-ghost`,
  `.action-btn:hover:not(:disabled)`, and `.action-btn:disabled` are now ALSO
  unused in this file (the "Start placement over" pill was their last user
  here). Kept, unused, rather than deleted, extending this file's own
  existing precedent for `.btn-primary` (unused since N.145, kept "because
  this file's own header calls `.action-btn`, `.btn-ghost` and `.btn-primary`
  a twinned declaration across four files"). This is the whole of why
  web-check's warning count moves 8 → 12; see the gate table.

**`apps/web/src/lib/i18n.ts`** (+5 lines)
- One new key, `loupe.syllables`: English "Syllables," French "Syllabes"
  (ruled by Dann 2026-09-17). Sentence case in the string; capitals are
  `.loupe-syl-label`'s CSS. Doubles as the disclosure button's `aria-label`.

**`apps/web/src/lib/shane/clitic-seat.test.ts`** (2 lines changed): one
comment referencing the retired `SyllableStation`/`placeArmedSyllable` pair
corrected to describe the loupe's own row instead. No test assertion changed.

## Reused or replaced: `SyllableStation.svelte`

**Replaced.** `LoupeSyllables.svelte` is a new file; `SyllableStation.svelte`
is deleted. Reasons, all structural rather than cosmetic:

1. **The gesture inverts.** `SyllableStation` armed a syllable and waited for
   a note click elsewhere (`cursor`/`oncursor`, Finale's Lyrics-window model).
   The new row places immediately on tap, onto whatever note is already
   selected, and never arms anything (ruling 3).
2. **The old component served two sizes of one thing** (`clipped`, for the
   drawer's collapsed preview row). That whole axis is gone: the loupe's row
   only ever has the one, open, size.
3. **Different type and touch geometry**, ruled directly: drawer sans
   0.8125rem with the touch floor spent only on the "cursor" pill, versus the
   loupe's serif 16/17px with every syllable a full 44px-tall target on a
   phone (no touch-geometry exemption, per the brief's own constraint).
4. **Different layout per platform**: a horizontal 44px strip with a gliding
   scroll on a phone, a wrapped, vertically-scrolling paragraph on a desk.
   `SyllableStation` had one layout for both.

Keeping one component branching on all four axes read as harder to verify
than two components each telling one story, so this is a new file rather than
a heavily-conditional rewrite of the old one.

## What I built beyond the brief's letter, and why

The brief's own words: "the loupe must stay inside the viewport when the row
opens... report what you did." I found this needed more than reporting: the
existing `centreY` (computed once, from `windowHeight + CHROME`, an estimate
that assumed no syllable row at all) does not know how tall the box becomes
once the row opens, and a stale clamp does not protect a box it was never
computed for.

**The fix**: `.loupe` measures its own real height with a `ResizeObserver`
(the same instrument `layoutTick` already uses on the page's own container,
turned on this element instead), and a new `shownCentreY` reruns the same
`centreOnPage` clamp with that true height. `top: {centreY}px` plus
`transform: translateY(-50%)` was already keeping the box's CENTRE exactly
where the clamp put it regardless of height (the browser computes -50% off
the real rendered box), so this only had to fix what the clamp's TWO EDGE
BOUNDS were computed against.

**A second bug, found only by testing on an iPhone SE's own 375 × 667 (see
"How I verified," below), needed a second, narrower fix.** With the row
open, the box can become taller than the room between the top gutter and the
portrait dock's own top edge has to give. `centreOnPage`'s clamp resolves
that conflict in the TOP gutter's favour (documented in the new code at
`Loupe.svelte:1414-1424`), which pushed the box 70px into the dock, over the
singer's own duration and pitch controls, on the one measurement that found
it. I added a second clamp, applied only in that specific conflict (never
reached by the base frame, which is never that tall), that keeps the box
clear of the dock instead, accepting a tighter top gutter as the lesser cost:
a few pixels near a header nothing is pressing, against covering a control
surface mid-task. **NOT ESTABLISHED how often a real phone reaches this
conflict at all**; I found one measurement that does and fixed it, and I am
naming it rather than asserting the fix is complete. Ask Dann's own walk to
look for this deliberately on a short or landscape phone, not only for the
straightforward case.

I judge this within scope rather than gold-plating, because the brief named
"stay inside the viewport" as a requirement, not a suggestion, and the
un-fixed version visibly failed it on a real, common device size the moment I
tested one.

## How I verified

**Unit tests**: `placeSyllable` and `nextOpenSyllableTarget`, 8 new tests, all
passing; see the file list above.

**Static CSS sanity check**: before touching the live app, I built a
throwaway HTML mockup of the hairline, disclosure, phone strip, and desktop
paragraph from the actual CSS I had written (not retyped), to catch gross
layout mistakes cheaply. It is not part of this ship; nothing under
`docs/sessions/` or the tree references it.

**Live walk, `pnpm dev`, a real score.** I fed `tools/e16-harness/output/
mussorgsky---sunless-01---within-four-walls/score.mxl` (a real, lyric-bearing
MusicXML fixture already in the tree, used elsewhere for the page-reader
harness) into the app's own drop zone via a synthetic `DragEvent` (the
Browser pane's click/drag tools arrive as mouse events, not real drops or
touches; a synthetic `DataTransfer` was the way in). This produced a fully
seated score I could actually click into, rather than the empty page the
sandbox starts with. On it, I directly observed, in the running app:

- **A note tap in the loupe only selects.** Tapping a second note moved the
  selection outline; the SYLLABLES row's placed/unplaced state did not
  change. (DoD 1's behaviour, confirmed live; see "What I could not
  establish" for why this is not ALSO a running test.)
- **A syllable tap places on the selected note and advances the selection.**
  Tapping "Моск" wrote it onto the taken note (the note's own underlay
  updated to "mask"/"Моск," IPA over Cyrillic, on the page AND in the loupe,
  live), the row's "Моск" turned from unplaced grey to placed black, and the
  selection outline moved to the NEXT note in the measure, unprompted.
  (DoD 2.)
- **Nothing is focused when the row opens.** `document.activeElement`
  immediately after opening the row was the disclosure toggle itself (native
  behaviour of clicking a button), never a syllable. (DoD 3.)
- **The drawer shows no syllable line**, with a score attached and seven
  slots in the queue, where the old row would have shown one. (DoD 4.)
- Colours matched the ruling: unplaced grey, placed black, the placed
  syllable on the selected note outlined white-on-lavender.
- The closed Input band's own summary line ("1 lines · 3 words · 0 / 7
  placed") still computed correctly, confirming `slotQueue`/`placedSlotCount`
  survived the `pairingCursor` removal with no other reader broken.
- **Found and fixed live, not by static reading**: the phone strip's
  `padding: 0 3px` on every syllable button opened a visible gap on BOTH
  sides of a within-word hyphen ("Моск- ва" instead of "Моск-ва"), because
  the hyphen already carries the join and padding on both neighbours doubled
  it. Fixed with `.joins-prev`/`.joins-next` modifier classes that zero the
  one side that would otherwise gap a hyphen (`LoupeSyllables.svelte`
  `:164-165`, CSS `:261-266`).
- **Found and fixed live**: the viewport-containment conflict described
  above, on the iPhone SE size specifically.

**What I could not test at all: the touch-action nesting question.** The
brief asks, in its own words, to "test it on a real touch emulation first and
report" whether the phone row's `touch-action: pan-x` scrolls under the
loupe's own `touch-action: none`, and whether a downward drag starting on the
row still reaches the dismiss listener. I tried two instruments and neither
can answer it here:

1. **The built-in Browser pane's mobile preset.** I built an isolated repro
   (a `touch-action: none` ancestor with a pointer-based dismiss-swipe
   listener copied from `+page.svelte:1884-1913`'s own logic, and a
   `touch-action: pan-x` scrollable child inside it) and drove it with the
   pane's drag tool at 375 × 812. The pointerdown event it produced reported
   `pointerType: "mouse"`, confirmed by reading the log the repro itself
   wrote. `touch-action` only governs TOUCH-originated panning; a
   mouse-type pointer is unaffected by it in every browser engine, so this
   instrument cannot exercise the behaviour in question at all, only prove
   that it cannot.
2. **The iOS Simulator tool.** Refused: this machine has Xcode's
   command-line tools but not a full Xcode install, which the simulator
   needs. I did not attempt a workaround (it names the exact `sudo
   xcode-select` fix, which needs Dann's password, so I could not run it
   myself).

**NOT ESTABLISHED, honestly, rather than reasoned into false confidence.** My
own reading of the CSS Touch Action spec suggests the nesting should work the
way the brief hopes (a scrolling element's own `pan-x` is evaluated against
the ancestor chain up to whichever element would actually consume the
gesture, which here is the row itself, not `.loupe`), but this is exactly the
kind of browser-engine behaviour the brief is right to distrust reasoning
over, and I have no instrument here that tests it for real. **Ask Dann's own
phone walk (DoD 6) to check this first and specifically**: open the loupe,
open the row, and try both a sideways drag on the row (should scroll it, not
dismiss the loupe) and a downward drag starting ON the row (should still
dismiss it, same as starting anywhere else on the loupe).

## Gate table

| gate | before | after | note |
|---|---|---|---|
| phonology | 216 passed | 216 passed | untouched |
| dictionary | 235 passed | 235 passed | untouched |
| web-check | 0 errors, 8 warnings, 5 files | 0 errors, **12 warnings**, 5 files | +4, all `.action-btn`/`.btn-ghost` family in `IntakePanel.svelte`, unused now that "Start placement over" (their last caller) is gone; kept per that file's own twinned-declaration precedent, not deleted. Verified against a clean `git archive HEAD` copy (not the stale-prone `ilya-ship.sh` table) before and after, so this delta is measured, not read off a doc. |
| web-test | 1253 passed | **1261 passed** | +8, all in `pairings.test.ts` (`placeSyllable`, 4; `nextOpenSyllableTarget`, 4) |
| score-parser | 567 passed, 5 skipped (572) | 567 passed, 5 skipped (572) | untouched |

**New baseline for `ilya-ship.sh`: web-test 1261 (was 1253), web-check 12
warnings (was 8).** Tell Dann both numbers before he runs the ship script.

## Definition of done, walked against

1. A note tap writes no pairing: confirmed live (no runtime test exists to
   pin it; see above).
2. A syllable tap writes the pairing, IPA included, and advances the
   selection: confirmed live and by unit test.
3. Nothing is focused when the row opens: confirmed live (`document.
   activeElement`); no runtime test pins it, for the same reason as item 1.
4. The drawer shows no syllable line anywhere: confirmed live, with a score
   attached.
5. All five gates green, new numbers given above.
6. **Not yet walked by Dann.** WRITTEN is not DONE; this memo is the WRITTEN
   half.

## What I could not establish

- **DoD 1 and 3 cannot be proven by a running test in this codebase as it
  stands.** No `.svelte.test.ts` or component-mount test exists anywhere in
  the tree (confirmed by search); the whole suite is pure-function unit
  tests. Proving these two items by a running test would need either
  introducing a Svelte component-testing setup (`@testing-library/svelte` or
  similar, not currently a dependency) or a browser-driven end-to-end
  harness, and I judged that an architecture decision for Dann to make
  deliberately rather than one to slip in as a side effect of this brief. I
  verified both by direct observation in the running app instead (see "How I
  verified"), and by reading: `handleLoupePick` (`+page.svelte:710-712`) is
  exactly `setCursor(...)` and nothing else, with no reference to any
  pairing-writing function anywhere in its body; and no code path anywhere
  calls `.focus()` on a syllable element or sets `autofocus`.
- **The touch-action nesting question is NOT ESTABLISHED**, for the
  instrument reasons given above. This is the one item the brief itself
  flagged as needing real testing rather than inference, and I could not
  supply that test here.
- **How often the viewport-containment conflict (loupe taller than gutter-to-dock
  room) is reached on real devices is NOT ESTABLISHED.** I found and fixed
  one measurement (iPhone SE, 375 × 667, portrait, a six-cell measure); I did
  not survey other device sizes or measure counts for it.
- **Whether "Start placement over" needs a new home is NOT ESTABLISHED by
  this brief**, which named only the drawer's syllable line for removal. See
  the next section.

## Decisions this brief did not settle, marked as mine and reversible

- **"Start placement over" now has no control anywhere in the UI.** It rode
  the syllable row's own open state (`IntakePanel.svelte`'s `syl-head`,
  N.114b item 3), and ruling 1 takes that whole row out of the drawer,
  "collapsed row and all," naming no replacement surface. I left
  `handleStartPlacementOver` (`+page.svelte:592`-ish, unchanged) defined but
  called from nowhere, rather than deleting it or inventing a new home for a
  destructive, whole-song verb the brief never asked me to relocate. This is
  a real capability loss, not a cosmetic one (a singer who wants to rebuild
  every seat from the poem now has no way to ask for it), so I am naming it
  rather than deciding it quietly. **Reversible**: restoring its old call
  site, or giving it a new one, is a small, contained change once you say
  where it should live, if anywhere.
- **`handleLoupePick` stays a separate function from `handleNotePick`**, even
  though the two are now identical, on the chance a future ruling splits
  the two taps again. DESK DEFAULT; merging them later costs nothing.
- **The row's gate, `slots.length > 0`, hides the disclosure when the queue
  is empty**, carrying over the old drawer row's `showSyllables` gate (minus
  its `loaderState.isLoading` clause, which I judged unnecessary here: the
  loupe's row re-renders reactively as `slots` changes and has no separate
  "still loading" state of its own to guard). DESK DEFAULT, reversible in one
  line if a mid-transcription flash of an incomplete row turns out to bother
  a singer in practice.
- **Sizing with no pixel value in the brief** (DESK DEFAULT, each reversible
  in the one CSS rule it lives in): the hairline's own margins (`10px 0
  8px`), the phone line-break mark's width and hairline height (20px gap, 16px
  vertical mark), and the disclosure's own bottom margin (6px, matching
  `.loupe-tag`'s).

## Files to `git add`

New:
- `apps/web/src/lib/shane/LoupeSyllables.svelte`
- `docs/sessions/memo-n147-syllables-in-the-loupe_r1_2026-09-17.md` (this file)

Deleted:
- `apps/web/src/lib/shane/SyllableStation.svelte`

Modified (all listed above):
- `apps/web/src/lib/components/Drawer/IntakePanel.svelte`
- `apps/web/src/lib/i18n.ts`
- `apps/web/src/lib/shane/Loupe.svelte`
- `apps/web/src/lib/shane/clitic-seat.test.ts`
- `apps/web/src/lib/shane/pairings.test.ts`
- `apps/web/src/lib/shane/pairings.ts`
- `apps/web/src/routes/+page.svelte`

Not touched by this session, already modified when it began (the desk's own,
per the git status at session start): `docs/memory/OPEN.md`,
`docs/memory/SCHEDULE.md`, `docs/memory/STATE.md`.
