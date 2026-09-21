# BRIEF. N.153 stage 3a: the loupe draws a render, not a clone

Written by the desk 2026-09-20, about 21:00, at `c3ca3f5`. Shape from `BRIEF-TEMPLATE.md`.
Stage 1 shipped `0028266`. Stage 2 shipped `c3ca3f5` and Dann walked it.

**STAGE 3 IS SPLIT IN TWO. DESK DEFAULT of 2026-09-20, not Dann's ruling, and free for
him to wave off.** `OPEN.md` §N.153 describes stage 3 as one stage carrying four
changes: swap the clone for a render, derive the spacing, collapse the panel strip,
and repoint the caret maths. **That is four things that can each fail differently.**

- **3a, this brief: swap the clone for a render at the page's own spacing.** Nothing
  about the spacing changes. The loupe must look the same and tap the same.
- **3b, not yet written: derive the spacing.** It is the part that closes the
  collisions, and it is the part nobody has costed.

**Why in this order:** 3a is verifiable against a picture that already exists, because
nothing should move. **3b changes what the singer sees, and it should not also be the
commit that changes where the pixels come from.**

## 1. What was observed

- **Measured 2026-09-18:** at phone width the separation between a caret's hit centre
  and its neighbour's runs **1.13 px to 7.89 px on all 17 held-able measures, against a
  44 px floor.** A caret is not reliably tappable on a phone anywhere in this score.
- **27 gaps on 12 of the fixture's 18 measures collide.** Three passes on 2026-09-17
  and 2026-09-18 relocated them instead of removing them, which is what a shuffle
  inside a crop can do.
- **THE FIXTURE IS T01**, `apps/web/src/lib/shane/ingestion/fixtures/sunless-01-engraved.musicxml`,
  **verified 2026-09-20: 2 `score-part` entries, 18 distinct `measure number` values,
  highest 18.** T05 is a different piece and has 90 measures. **Stage 2's brief said
  T05 and that was the desk's error**; see that brief's section 9.

## 2. What is established, each line read at `c3ca3f5` this session

**The clone, and where it comes from.** All of this lives inside ONE anonymous
`$effect` in `apps/web/src/lib/shane/Loupe.svelte`, opening `:669` and closing `:2035`.

- `:681` `const container = document.querySelector('.fit-paper-container');`
- `:684` `const own = hitsFor(container, ownIds);` (`hitsFor` at `:651`)
- `:685` `const first = own.nodes[0];`
- `:692` `const sysEl = first.closest('[data-system]');`
- `:1170` `const clone = sysEl.cloneNode(true) as Element;`

**THE TRAP THAT WILL BITE THIS STAGE, and it is already written down in the tree.**
`Loupe.svelte:1864-1873`, read in full: the ink check reads `sysEl`, the live page,
**not `clone`**, because *"`getBBox` on a detached SVG element has no layout to report:
it throws, or on some engines answers all-zero, so every candidate silently failed this
check's own `catch` until this was caught and fixed."*

**`renderAnalyzedStaff` returns a STRING** (`packages/score-parser/src/staff-renderer.ts:1868-1872`).
**A string has no layout.** So every measurement the effect takes from `sysEl` today
has to come from somewhere else once the source is a render rather than a mounted
system. **That is the whole risk of this stage, and it is why nothing else changes in it.**

**The caret and hit queries, and their scope.** Every one is scoped to a root passed
in, never to `document`. The only bare `document` lookups in the file are the two that
find `container`, at `:527` and `:681`. The queries: `:328` and `:334` (`musicInk`),
`:359`, `:364`, `:366` (`restOrNoteInk`), `:393` (`staffVerticals`), `:436`, `:457`,
`:483` (`pageMetrics`), `:656` (`hitsFor`), `:812`, `:816`, `:1236-1238`, `:1404`,
`:1429`, `:1431`, `:1906-1907`.

- **`:1236-1238` is the rename that keeps the two tap grammars apart:** every
  `[data-hit]` in the clone is read, removed, and rewritten as `data-loupe-hit`,
  because VoiceProfilePane's listener matches `[data-hit]` anywhere in `document`.
  **A render will arrive with `data-hit` attributes too, so this rename still has to happen.**

**The panel strip, and what sets its size.**
Strip container `:2249`; ring `:2251-2252`; head `:2270-2271` (gated `:2269`); meter
`:2287-2288` (gated `:2286`); carry `:2320-2321` (gated `:2319`); body `:2333-2334`,
unconditional; tail `:2392-2393` (gated `:2391`).
Widths: `:1144` head, `:1145` meter, `:1753` carry, `:1754` tail, `:1762` body,
`:1963` `stripWidth` as their sum, `:1965` the framed width.
`scale` is `drawn / totalSpan` at `:1129`.

**The renderer's spacing knobs**, `packages/score-parser/src/staff-renderer.ts`:
`StaffRenderOptions` at `:217-393`. `lineGap` `:219` (default 12, `:401`),
`leftMargin` `:220` (default 0, `:403`), `pxPerWhole` `:221` (default 240, `:404`),
`minGap` `:222` (default 40, `:405`). `DEFAULTS` at `:398-407`.
`sliceScore` at `packages/score-parser/src/page-layout.ts:98`.

**THE PRECEDENT FOR MEASURING YOUR OWN RENDER EXISTS, and stage 2's brief said it did
not. That was wrong and is corrected here.** `paginateScore` renders the last system a
second time without `targetWidth`, measures it, and conditionally swaps it in:
`page-layout.ts:319-329` the render, `:330` `const box = viewBoxOf(svg);`, `:331-332`
the tests, `:334` the swap. `viewBoxOf` is at `page-layout.ts:152` and reads the
**viewBox attribute out of the string**, with no DOM at all.

**AND ITS SAFETY ARGUMENT DOES NOT TRANSFER TO 3b.** The comment at `:312-315` says
*"Re-rendered rather than decided up front, because the natural width is not known
until it is drawn. Safe in this direction: dropping the stretch can only shorten a
system."* **3b widens. Nothing in the tree says widening is safe.** Not this stage's
problem; recorded so 3b does not inherit a reassurance that was about the other direction.

## 3. Measure before you change anything, and report before writing code

**All three on T01, not T05.**

1. **The clef question, re-asked on the right piece.** For each of T01's 18 measures,
   does `chooseClef(sliceScore(parsed, m, m))` return the same clef as
   `chooseClef(parsed)`? Report a per-measure table. **Code ran this on T05 and got 18
   of 18 agreement there; T05 carries a printed F clef on every measure and T01 may
   not.** If any measure differs, the bundle's `clef` is load-bearing and must be passed.
2. **Which maps are live on T01**, and how many entries each carries, against the vocal
   event count. **On T05, `withheldIpa` and `melismaPreview` were `undefined`.** T01 is
   NOT ESTABLISHED.
3. **How the effect can measure a render.** `renderAnalyzedStaff` returns a string and
   `getBBox` needs layout (`Loupe.svelte:1864-1873`). **Report which of these holds, and
   say which you verified rather than reasoned:**
   - the rendered string can be mounted into the existing panel elements and measured
     there, the way the clone's markup already is;
   - or the measurements the effect takes from `sysEl` can be taken from the string's
     viewBox and the renderer's own numbers, the way `viewBoxOf` does;
   - or neither, and say what the third way is.

**The cause of anything you find is yours to state. This brief supplies none.**

## 4. The rulings this serves

- **`OPEN.md` section THE CARET, ruled by Dann 2026-09-17:** clause 6, the loupe's
  spacing is its own and does not bind the page; clause 7, the loupe shows one measure
  and nothing else; clause 8, the loupe may exceed the page's width.
- **Ruled by Dann 2026-09-20** (`OPEN.md:1378-1379`): no carets in Syllables mode, and
  Corrections carries more generous spacing.
- **This stage serves none of them yet.** It changes where the pixels come from and
  nothing else. **Say so in the commit message.**

## 5. Constraints

- **The loupe must look the same and tap the same.** Same measure, same panels, same
  hit resolution on note, rest and caret.
- **Do not change the spacing.** Render at the page's own options, the ones the bundle
  carries. Deriving the spacing is 3b.
- **Do not touch `loupe.ts`'s crop helpers or their tests. That is stage 4.**
- Keep the `data-hit` to `data-loupe-hit` rename (`Loupe.svelte:1236-1238`).
- `onpagesdrawn` stays untracked; `handlePagesDrawn` stays a function declaration.
- Do not change `VocalLineEvent`, and do not rebuild anything in
  `apps/web/src/lib/shane/reconciliation/`.
- **The page's output and the print's output do not change.**
- No new strings and no French.
- **No agent commits and no agent stages.** Read-only git only.

## 6. Done when

`WRITTEN` on all of these:

- The loupe's body draws from `renderAnalyzedStaff` on a one-measure slice of the
  bundle's `readingScore`, not from `sysEl.cloneNode(true)`.
- Note, rest and caret taps resolve as they do today, verified by real clicks and not
  by a selector count. **`ENVIRONMENT.md` §`THE CARETS CARRY NO CLASS`: a caret has no
  class and no data attribute, so count the geometry, not the selector.**
- `tsc` and `svelte-check` clean, and every suite at the ship script's recorded baseline.
- The page's rendered SVG and the print output are unchanged.
- **A before-and-after screenshot of the same measure in the loupe**, at the same
  window size, taken in the same tab. If they differ, say how and stop.

`DONE` is Dann's walk. Do not report this item as done.

## 7. Report back

The commit, the results against every line of section 6, the three measurements of
section 3, and **what could not be established.**

**NOT ESTABLISHED beats a complete invented answer.**
