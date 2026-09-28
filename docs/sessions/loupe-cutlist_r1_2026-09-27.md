# The cut list for `Loupe.svelte` (audit phase 4)

Read at `/home/claude/ilya-eab`, branch `Shane`, HEAD `eab54f9` (confirmed this session:
`git log --oneline -1`; `git --no-optional-locks status` shows a clean tree). Read-only
session: no write git command was run.

`apps/web/src/lib/score/Loupe.svelte` is 3,054 lines total (`wc -l`, this session), which
matches its ceiling in `scripts/ratchets.json:11` exactly, the same finding the `+page.svelte`
cutlist made for its own file. Script runs line 1 to `</script>` at line 2,423 (2,422 lines,
grepped this session); `<style>` opens at line 2,709, so markup runs 2,423 to 2,708 (286
lines) and style runs 2,709 to 3,054 (346 lines).

This is a first pass: no prior anatomy document for this file was found in `docs/sessions/`
this session, so every span below is this session's own read, not a correction of an earlier
one.

## 1. The cut table

| # | Name | Destination | Lines removed (est., script) | Risk |
|---|---|---|---|---|
| 1 | Page-ink measurement utilities | `apps/web/src/lib/score/loupe-measure.ts` (new) | ~341 | Low-medium |
| 2 | Tap resolution | `apps/web/src/lib/score/loupe.ts` (existing) | ~20 | Low |
| 3 | Measure-tag text | `apps/web/src/lib/score/loupe.ts` (existing) | ~30 | Low |
| 4 | The frame-computation engine | split across new files under `apps/web/src/lib/score/` (see detail) | ~1,440 | High |
| 5 | Panel markup (head/meter/carry/body/tail SVGs) | `apps/web/src/lib/score/LoupePanels.svelte` (new) | 0 script, markup TBD | Medium, NOT ESTABLISHED |

Running estimate after cuts 1 to 4: script down from 2,422 to roughly 590 lines. Markup
(286) and style (346) are not touched by cuts 1 to 4. See section 3 for the target size.

## 2. Each cut in detail

### Cut 1: Page-ink measurement utilities

**Job:** reading the rendered SVG's own ink to answer geometry questions the frame engine
(cut 4) needs: where a system's music starts, where its barlines and staff lines are drawn,
how far above and below the staff the page's ink reaches, and mounting a render string
off-screen so it can be measured at all.

**Exact spans (script), read this session, three contiguous blocks:**

- `apps/web/src/routes/../lib/score/Loupe.svelte:302-510`: `inkCanvas` (`:306`), `textInk`
  (`:308-318`), `musicInk` (`:328-351`), `restOrNoteInk` (`:360-377`), `staffVerticals`
  (`:382-403`), `headerRightOf` (`:409-421`), `surveys` (`:424`) and `pageMetrics`
  (`:426-510`).
- `:554-648`: `DIGIT_GLYPHS` (`:554-557`) and the type-only interfaces `StaveInk` (`:560-565`),
  `StavePanel` (`:568-572`), `MeterPanel` (`:575-580`), `Frame` (`:582-648`).
- `:652-688`: `renderHost` (`:660`), `mountRender` (`:661-672`), its `onMount` cleanup
  (`:673-676`), and `hitsFor` (`:678-688`).

Excluded on purpose: `frame` itself, the `$state<Frame | null>(null)` at `:650`, sits between
the second and third blocks and does not move; it is the component's own reactive output,
read by the markup at dozens of `frame.*` sites (`grep -c` this session: 138 whole-word hits
on `frame` across script and markup, the great majority `frame.<field>` reads in the
`{#if open && frame}` block, `:2425-2707`).

**Destination:** `apps/web/src/lib/score/loupe-measure.ts` (new file). `loupe.ts` already
holds the sibling geometry helpers (`headBound`, `measureWindow`, `ringRoom`, and the rest,
confirmed on disk and by this file's own imports at `:32-60`), but it is 908 lines (`wc -l`,
this session) with no ceiling entry in `scripts/ratchets.json`, so it is subject to the
default `newFileMaxLines` of 1,000 (`scripts/ratchets.mjs:9-10, 68`; `ratchets.json:3`).
Adding 341 lines would put it at 1,249 and breach that default, so this cut needs its own
file rather than an append to `loupe.ts`.

**Interface:** every function in this cut is called two to four times total in the whole
file (`grep -o "\b<name>\b"` counts, this session: `textInk` 2, `musicInk` 3,
`restOrNoteInk` 3, `staffVerticals` 3, `headerRightOf` 3, `pageMetrics` 4, `hitsFor` 3,
`mountRender` 2), which means one definition and one or two call sites each, all of them
inside cut 4's territory (the `attempt` closure, `:774-2196`, and the effect that contains
it). None of these names appear outside `Loupe.svelte`, confirmed by `grep -rn` across
`apps/web/src` this session. So the whole interface of this cut is "cut 4 imports these
eight names," nothing else.

**Lines removed:** ~341 (`209 + 95 + 37`, the three spans above, each `end - start + 1`).

**Risk:** Low-medium. Every function here is already pure with respect to Svelte state: each
takes DOM elements or plain values and returns plain values or throws. `mountRender` is the
one exception: it closes over the component-scoped `renderHost` element and its `onMount`
cleanup (`:673-676`), so lifting it out means either passing a host element in as a
parameter (the caller, cut 4, would then own creating and disposing it) or accepting that
the new module keeps its own module-scoped host and cleanup, which changes when the render
host is created relative to component mount/unmount. This is a real behaviour question, not
a pure mechanical move, and is why the risk is not plain "Low."

**Tests that guard it today:** none. `grep -rln` this session on every name in this cut
against `apps/web/src/lib/score/*.test.ts` and `apps/web/e2e-phone/*.ts` returns nothing:
these functions are exercised only indirectly, through the phone Playwright suite's
rendering of the whole component (`apps/web/e2e-phone/loupe-scan.test.ts`, read this
session: `test('the whole-fixture scan, and the five rules', ...)` at `:217`,
`test('real clicks resolve note, rest and caret taps on a converged measure', ...)` at
`:390`). Per `ARCHITECTURE.md:185-186`, read this session, "the phone Playwright project is
not in CI yet: one of its tests fails today." Moving these functions into their own file
makes them independently unit-testable for the first time; that is a gain from this cut, not
a risk, but it means today there is no unit-test regression net to compare against, only the
phone suite's own pixel/geometry assertions, which are not confirmed to run in CI.

### Cut 2: Tap resolution

**Job:** turning a click's `clientX`/`clientY` into a note id or a gap's `after`, inside the
loupe's own coordinate space.

**Exact span:** `:2243-2295` (the doc comment and `handleTap`), read this session. The
function itself is `:2274-2295`.

**Destination:** `apps/web/src/lib/score/loupe.ts`, which already exports `nearestTarget`
(imported at `Loupe.svelte:51` and called inside `handleTap` at `:2291`), so the resolution
logic (build the note/gap candidate lists, call `nearestTarget`, parse the `note:`/`gap:`
prefix) is a natural fit beside the function it is built on.

**Interface:** `handleTap` reads `windowEl` (`$state<HTMLElement | undefined>`, `:2303`,
5 total references, 2 outside this span: the binding at `:2440`'s markup and the wiring
effect at `:2304-2309`) and calls `onpick`/`onpickgap`, both props. A version moved into
`loupe.ts` would take the window element and the two callbacks as parameters; the component
would keep a thin `handleTap(e)` that reads `windowEl` and forwards to the moved function.

**Lines removed:** ~20 (the resolution body, `:2274-2293`, minus the two-line dispatch that
stays to call the props).

**Risk:** Low. `nearestTarget` is already extracted and tested (`loupe.test.ts:117-137`,
read this session: `describe('nearestTarget', ...)`); this cut only moves the candidate-list
construction around it, which touches no Svelte reactivity.

**Tests that guard it today:** none directly. `apps/web/e2e-phone/loupe-scan.test.ts:390`
and `:407` (`'real clicks resolve note, rest and caret taps...'`,
`'real clicks on a measure that did not converge'`) exercise real clicks against the mounted
component, so they exercise this path, but they are the phone-only suite named as not yet in
CI (see cut 1's tests section).

### Cut 3: Measure-tag text

**Job:** composing the loupe's own locator string (measure number, system, fill-flag
arithmetic) from the `fill`, `frame`, and `measureLabel` values, in the singer's language.

**Exact span:** `:2311-2348`, the `tag = $derived.by(...)` block, read this session.

**Destination:** `apps/web/src/lib/score/loupe.ts`, as a plain function taking
`(fill, frame, measureLabel, T)` and returning a string, called from a one-line
`$derived.by`.

**Interface:** reads `fill` and `measureLabel` (both props), `frame` (component state,
also read at 137 other sites, so it is not this cut's alone to take), and `T` (the local
`t(key, language)` wrapper defined at `:204`, itself trivial to pass in). `T`'s own callers:
`grep` this session finds it called in six places in the file, all in this same tag block
and the markup, so extracting it changes no other caller's shape.

**Lines removed:** ~30 (`2348 - 2311 = 37`, minus the `$derived.by` wrapper that stays).

**Risk:** Low. Pure string composition off values already fully computed; no DOM read, no
Svelte lifecycle.

**Tests that guard it today:** NOT ESTABLISHED. No test file name matched
`measureTag`/`loupe.measureTag` this session; whether any e2e test reads the tag's text is
not established without opening the phone suite's assertions in full, which this session did
not do line by line for this specific string.

### Cut 4: The frame-computation engine

**Job:** everything else inside the file's single `$effect` (`:726-2241`): given the held
measure, the taken entry, and the page's own rendered system, compute the loupe's entire
drawing (the head/meter/carry/body/tail crops, the selection ring's position, every caret's
position, the barline-nudge, the frame's width and centring) and the spacing search that
widens the render until no two carets sit closer than the tap floor.

**Exact span, read this session:** `:690-2241`, one contiguous block: `spacingCache`
(`:693`), `fingerprint` (`:696-700`), `worstSeparation` (`:703-708`), `offendingPairs`
(`:711-719`), then the `$effect` itself (`:726-2241`), inside which the `attempt` function
(`:774-2196`, 1,423 lines) is the large majority of the block.

**What must stay, and why:** the `$effect` wrapper (its guard clause at `:735-764`, the
dependency reads `void revision; void selectedEventId; ...` at `:727-732`, and the final
`frame = result ? result.frame : null` at `:2240`) is Svelte reactive glue, valid only
inside a component, the same reasoning the `+page.svelte` cutlist gave for that file's
`onMount` and `<svelte:window>` bindings. What CAN move as an ordinary function is the
`attempt` closure's body (`:774-2196`) plus the three pure helpers above it
(`fingerprint`, `worstSeparation`, `offendingPairs`, `:696-719`), leaving a shell of roughly
100 to 120 lines in the component: the guard, the `deriveMinGap` spacing-search loop
(`:2213-2238`), and the assignment.

**Destination:** NOT a single new file. `attempt`'s body, extracted whole, is 1,423 lines by
itself; `scripts/ratchets.mjs`'s size check (`:9-10, 60-71`, read this session) fails any
unlisted source file over `newFileMaxLines`, which `ratchets.json:3` sets at 1,000. **Moving
this cut into one new file breaches the ratchet on day one**, confirmed by reading both the
check and the config this session, not inferred. It needs splitting into at least two, more
likely three, modules before a coding agent takes it in one sitting: candidates visible in
the comments themselves are (a) the head/meter/carry/tail panel layout (roughly `:939-1424`,
the N.138/N.139 material), (b) the caret placement and barline-nudge block
(`:1450-1843`, the N.92 material), and (c) the body clip, sizing, and centring
(`:1844-2196`, clauses 11/12/1.0). I did not draw exact boundaries between these three this
session; the line ranges above are read from the comment headers, not from a fresh
dependency analysis of what each sub-block actually closes over.

**Interface:** `attempt` closes over, by my count this session, at least these outer
values: `notationFont` (as `font`), `bundle` (as `drawnFrom`), `isPhone`, `dockInset`,
`positions`, `mode`, `syllablesOpen`, `selectedEventId`, `measureIndex` (as `measure`), the
DOM `container`, and the module constants `MAGNIFICATION` (`:218`), `DESKTOP_TARGET_LINE_GAP`/
`DESKTOP_MIN`/`DESKTOP_MAX` (`:239-241`), `SIDE_INSET` (`:257`), `FRAME_SIDES` (`:284`), and
`INK_PAD_SP` (`:300`), all five used only inside this span (confirmed by `grep`, this
session). Two constants are NOT exclusive to this cut: `GUTTER` (`:245`) is read inside
`attempt` (`:836, 1897`) and also by `anchorTop`/`panelRoom` outside it (`:2389, 2396`), and
`CHROME` (`:269`) the same way (`:1897` inside, `:2384` outside). Both would need to be
exported from wherever this cut lands and imported back into the component, or duplicated,
which the file's own conventions (one number, never a silent second copy, stated explicitly
at `:1587-1590` about `SQUIRCLE_CLEARANCE`) argue against duplicating.

**Lines removed:** ~1,440 (`1,423` for `attempt` plus `~24` for the three pure helpers,
against a remaining in-component shell of roughly 100 to 120 lines; the effect's own guard
and dependency-tracking lines were always going to stay).

**Risk:** High. This is almost the entire file's logic, it is the region carrying nearly
every dated ruling and measured constant in the comments (the N.92, N.138, N.139, N.141,
N.153 material), and several of its sub-computations are stated in the comments themselves
as having been WRONG before a specific measured walk corrected them (for example
`:958-980`, the tacet-run head-boundary bug found 2026-08-29; `:1972-1988`, the closing-pad
bug found "this session's own walk" per the comment, at m. 8). Moving code that dense
without an automated regression net (see below) is exactly the kind of change an
84-screenshot compare would not catch, per the `+page.svelte` cutlist's own language for its
highest-risk cut.

**Tests that guard it today:** the phone-only Playwright suite
(`apps/web/e2e-phone/loupe-scan.test.ts`), specifically `'the whole-fixture scan, and the
five rules'` (`:217`), which per its own file `apps/web/e2e-phone/loupe-rules.ts` (253
lines, read as a name only this session, not opened in full) checks named geometric rules
against a fixture. Whether this suite runs in CI: `ARCHITECTURE.md:185-186` says the phone
project "is not in CI yet: one of its tests fails today," read this session, so this cut's
only behavioural coverage is not confirmed to run automatically on every push. **A cut this
large should not proceed until that suite (or an equivalent) is confirmed running and green,
or a new unit-test harness is built against the extracted pure function directly**, which
this session did not attempt.

### Cut 5: Panel markup (head/meter/carry/body/tail SVGs)

**Job:** the five stacked SVG panels inside `.loupe-strip` (`:2454-2617`) that draw the
ring, head, meter, carry, body (with its clip and carets), and tail.

**Exact span (markup):** `:2454-2617`, read this session.

**Destination:** NOT ESTABLISHED with confidence. A new `LoupePanels.svelte` inside
`apps/web/src/lib/score/` would fit the module (score already owns `Loupe.svelte`,
`LoupeSyllables.svelte`, `CorrectionSurface.svelte`), but this markup reads roughly a dozen
`frame.*` fields directly (`frame.ring`, `frame.headWidth`, `frame.headViewBox`,
`frame.meter`, `frame.carry`, `frame.viewBox`, `frame.contentWidth`, `frame.bodyClipId`,
`frame.bodyClipLeft/Right/Top/Height`, `frame.stave`, `frame.caretsMarkup`, `frame.tail`,
`frame.stripWidth`, `frame.contentHeight`), which is past the ten-field interface flag the
`+page.svelte` cutlist used for its own correction-station cut. Passing the whole `frame`
object as one prop is the obvious way to stay under that flag, but that is a design choice,
not a move, and this brief asks only for moves.

**Lines removed:** 0 script; markup NOT ESTABLISHED, since a subcomponent's own template
still has to hold all of `:2454-2617`, so nothing is deleted, only relocated.

**Risk:** Medium, NOT ESTABLISHED in detail: not measured against the phone e2e suite's own
pixel assertions this session.

**Tests that guard it today:** same as cut 4, the phone-only suite.

## 3. Order, running total, and the target size

**Order, least risky first:**

1. **Cut 1 (measurement utilities).** No Svelte reactivity involved beyond `mountRender`'s
   lifecycle question, and it is the one cut that turns currently-untestable code into
   plain, unit-testable functions, which serves the stated goal (a clear, documented
   architecture) directly.
2. **Cut 2 (tap resolution)**, then **cut 3 (measure-tag text)**: both small, both pure,
   both safe breathers between the harder cuts, the same role the `+page.svelte` cutlist
   gave its own small cuts.
3. **Cut 5 (panel markup)**, if attempted at all, before cut 4: re-pointing markup at a
   `frame` object that has not yet changed shape is safer than re-pointing it at one that
   is mid-refactor.
4. **Cut 4 (the frame-computation engine) last**, and only after it is split into the
   sub-modules named above, and only after the phone e2e suite (or a replacement) is
   confirmed to run and pass. This mirrors the `+page.svelte` cutlist's own conclusion for
   its single highest-risk region.

**Running total (script lines, estimates):**

| After cut | Script lines remaining (est.) |
|---|---|
| (start) | 2,422 |
| 1. Measurement utilities | ~2,081 |
| 2. Tap resolution | ~2,061 |
| 3. Measure-tag text | ~2,031 |
| 4. Frame-computation engine | ~591 |

Adding the untouched markup (286) and untouched style (346, no cut in this list moves any
CSS) gives a total file estimate of roughly **591 + 286 + 346 ≈ 1,220 lines** after cuts 1
through 4, before cut 5 (which trades markup lines for a new file's lines rather than
deleting any).

**A sensible target size.** This file's own ceiling (3,054) currently equals its own
length: no slack. `scripts/ratchets.mjs`'s default (`newFileMaxLines: 1,000`) is what every
OTHER file in this codebase without its own ceiling is held to, and the estimate above
(~1,220) is close enough to that figure that reaching it plausibly needs either cut 5 to
remove real lines (not just relocate them, which would mean trimming the panel markup's own
duplication rather than only moving it, a rewrite this brief does not propose) or accepting
a ceiling somewhat above 1,000 written down on purpose in `ratchets.json`, the way the file
already documents departures from a default. **Call the target 1,000 to 1,200 lines, stated
as an estimate**, not a number this session measured against a finished cut.

## 4. What must never move out of the file

- **The `$effect` at `:726-2241` and its guard clause.** Svelte's `$effect` is valid only
  inside a component; only its pure interior (cut 4) can move.
- **`onMount` at `:540-552` and `:673-676`**, and the `$effect` at `:526-532` (the
  `ResizeObserver`): all three are lifecycle hooks callable only from a component.
- **`frame` itself (`:650`) and the `Props`/`$props()` block (`:62-202`).** Every cut above
  reads or writes through one or the other; per the `+page.svelte` cutlist's own reasoning
  for its boot-state declarations, moving these would turn every other cut's interface count
  into a whole-component one.
- **`bind:offsetHeight={topH}` (`:2435`) and the `anchorTop`/`panelRoom`/`bareHeight`
  derivations that read it (`:2375-2397`).** These measure the component's own live layout
  and read `window.innerHeight`; nothing here is a pure function of props alone.

## 5. Anything else found

- **A dead prop.** `nextIds` is declared as a required prop in the `Props` interface
  (`:79-80`: "Entry ids in the next measure that carries any, for the right edge") and the
  caller passes it (`apps/web/src/routes/+page.svelte:5116`, `nextIds={nextMeasureIds}`),
  but `Loupe.svelte`'s own `let { ... }: Props = $props()` destructuring (`:173-202`) never
  lists it, and the file's own comment at `:795` confirms it: "`nextIds`, which bounded the
  window in stage 3a while the next measure shared the system's render, is no longer read."
  The prop is documented, typed, and supplied, and does nothing. Not fixed, per this brief's
  instructions; reported only.
- **A dead field on `Frame`.** `centreY` is computed and written into every `Frame` object
  (`:1897, 2189`) but the file's own comment on the field (`:637-638`) already says "since
  N.149 only `stageTop`, `stageBottom` and the height are read from this frame." Confirmed
  by `grep` this session: the only reads of `centreY` are two unrelated LOCAL variables of
  the same name, shadowing the field, inside `attempt` (`:1897`) and inside `anchorTop`
  (`:2389`); `frame.centreY` itself is never read anywhere in the file.

## 6. What I could not establish

- The exact sub-boundaries inside cut 4's 1,423-line `attempt` body, beyond the three
  candidate groupings read off the comments' own section headers. A dependency-level split
  (which locals each sub-block actually needs) was not done this session.
- Whether `apps/web/e2e-phone/loupe-scan.test.ts` and its Playwright project currently pass
  in CI, beyond the one line `ARCHITECTURE.md:185-186` gives ("one of its tests fails
  today"); I did not run the suite or read `.github/workflows/ci.yml` this session to
  confirm what it does and does not gate on merges to `Shane`.
- The full body of `apps/web/e2e-phone/loupe-rules.ts` and `loupe-probe.ts` (253 and 461
  lines): named and sized only, not opened, so exactly which of cut 4's rules each one
  checks is not established.
- Any CSS attribution for the 346-line `<style>` block to a future cut 5: not one selector
  was checked against the panel markup's own classes this session.
- A precise lines-removed figure for cut 5, since a subcomponent's markup does not shrink,
  only relocate, and no design for narrowing its prop list (passing the whole `frame` versus
  a subset) was attempted, per the instruction to propose moves and not rewrites.
