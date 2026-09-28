# Memo: loupe window sizing, r1

Read-only investigation, `/home/claude/ilya-9eb`, branch `Shane`, HEAD `9ebfdc0` (confirmed with `git log --oneline -1`). No repository file was changed and no writing git command was run.

## 1. How the window's height is computed, and where ink is measured

`frame.windowHeight` is set at `apps/web/src/lib/score/Loupe.svelte:1886`:

```
const windowHeight = cropHeight * unitPx * magnification;
```

`cropHeight` comes from `crop = inkCrop(ringBand, staffTop, lineGap, INK_PAD_SP, { top: sysMinY, height: sysHeight })` at `Loupe.svelte:1251`, with `cropHeight = crop.top` and `crop.height` at `Loupe.svelte:1255-1256`. `inkCrop` itself is defined at `apps/web/src/lib/score/loupe.ts:809-819`: it returns `{ top: staffTop - page.above - pad, height: page.above + page.below + pad * 2 }`, falling back to the system's declared box only when `page` cannot be measured.

`page.above` and `page.below` (the page-wide ink extent) are the output of `pageMetrics()`, `Loupe.svelte:426-510`. This walks every element of every `[data-system]` (`Loupe.svelte:443`), excluding only the analysis layer, the held-measure rectangle, the selection ring, and bar numbers (`Loupe.svelte:451-457`). It takes `getBBox()` for graphic elements and a canvas-measured ink box for `<text>` (`textInk`, `Loupe.svelte:308-318`), and folds every element's top/bottom into page-wide `above`/`below` maxima (`Loupe.svelte:475-476`). Ledger lines carry no exclusion in this walk, so a ledger line's `<line>` element is included in the survey: this is where "the rendered page's own ink, including ledger lines" is measured.

`ringRoom` (`loupe.ts:754-768`) widens `page.above`/`page.below` further, by whatever the selection ring's reach adds past the half-space pad, before `inkCrop` uses it — this is `ringBand` at `Loupe.svelte:1250`.

`INK_PAD_SP = 0.5` (half a stave space, `Loupe.svelte:300`) is the padding term in `inkCrop`.

`unitPx` (CSS px per page-native unit) is set at `Loupe.svelte:760`; `magnification` at `Loupe.svelte:1064`.

Note: `contentHeight` (`Loupe.svelte:1257`, `= cropHeight * scale` where `scale = unitPx * magnification`, `Loupe.svelte:1226`) is arithmetically identical to `windowHeight` — both are `cropHeight * unitPx * magnification`. They are two names for the same number; nothing currently makes them diverge, unlike the width, where `windowScale` (`loupe.ts:837-840`) can shrink the horizontal scale independently.

## 2. Every place `windowHeight`, `bareHeight`, or `topH` is read, and what it drives

`frame.windowHeight`:
- Set into the frame object at `Loupe.svelte:2188`.
- Read at `Loupe.svelte:2440`, sets `.loupe-window`'s CSS `height` directly: `style="height: {frame.windowHeight}px;"`. This is the strip SVG stage's own height (all the panel `<svg>`s inside `.loupe-strip` — ring, head, meter, carry, body, tail — take `height={frame.contentHeight}`, the same number, at `Loupe.svelte:2459/2479/2496/2529/2542/2601`).
- Read once more inside `bareHeight` (below).

`topH` (`let topH = $state(0)`, `Loupe.svelte:2375`):
- Bound to the measured `offsetHeight` of the `.loupe-top` div via `bind:offsetHeight={topH}` at `Loupe.svelte:2435`.
- `.loupe-top` is the wrapper that contains the tag, the note line, `.loupe-window` (and so the strip/ring/carets), the hairline, and `.loupe-bar` (the mode pill and the disclosure toggle) — confirmed by matching the opening `<div class="loupe-top" ...>` at `Loupe.svelte:2435` to its closing `</div>` at `Loupe.svelte:2690`. So `topH` is the measured height of the whole fixed part of the card, window included, once the DOM has rendered it.

`bareHeight` (`Loupe.svelte:2384`):
```
const bareHeight = $derived(frame ? (topH ? topH : frame.windowHeight + CHROME + BAR_ESTIMATE) + CARD_FURNITURE : 0);
```
Uses the measured `topH` once available, or an estimate built from `frame.windowHeight` (plus `CHROME = 46.5`, `Loupe.svelte:269`, and `BAR_ESTIMATE = 19 + 44`, `Loupe.svelte:2382`) before the first paint. Drives:
- `anchorTop` (`Loupe.svelte:2386-2391`): `centreY = centreOnPage(frame.stageTop, frame.stageBottom, viewportHeight, bareHeight, GUTTER)`, then `anchorTop = centreY - bareHeight / 2`. This is the card's CSS `top` (`Loupe.svelte:2433`).
- `panelRoom` (`Loupe.svelte:2393-2397`): `Math.max(0, viewportHeight - PANEL_FOOT - (anchorTop + bareHeight))`. This is the `max-height` of `.loupe-panel` (`Loupe.svelte:2695`), the accordion region that holds the correction cells (`{@render corrections?.()}` at `Loupe.svelte:2702`).

Mechanism confirmed for the reported bug: because `anchorTop = centreY - bareHeight / 2` and `.loupe-panel` sits in normal flow immediately after `.loupe-top` closes, growing `windowHeight` grows `topH`/`bareHeight`, which moves the card's top up by only half the growth while its bottom (and so the panel, and so the correction buttons) moves down by the other half. A taller ledger-line window pushes the correction row down, which is the reported "buttons slide out from under a held pointer."

## 3. Where the selected note's y position is known

`pageRing` (`Loupe.svelte:1364-1370`) is computed from the selected event: `ringBox(hit, group, selectedEventId)`, imported from `apps/web/src/lib/score/selection-ring.ts:241` (`import ... from '$lib/score/selection-ring'` at `Loupe.svelte:24`). `ringBox` returns a box in the system's own native coordinates (built off the hit rectangle's `y`/`height` and the event's own ink, `selection-ring.ts:246-267`).

That box is converted to the strip's own local pixel space (0 at the top of `contentHeight`) by `stripRing` (`loupe.ts:719-734`):
```
y: (ring.y - cropTop) * scale
```
`frame.ring.y`/`frame.ring.height` (`Loupe.svelte:631`, consumed at `Loupe.svelte:2466`) are therefore the selected note's own vertical position and extent, already expressed in the same pixel space as `.loupe-strip`'s content. This is the value a scroll-to-selection could read to compute a scroll offset.

## 4. What `.loupe-panel` does today to scroll inside itself

CSS, `Loupe.svelte:2957-2961`:
```
.loupe-panel {
	overflow-y: auto;
	overscroll-behavior: contain;
	touch-action: pan-x pan-y;
}
```
Script: no scroll-position logic at all. The panel's `max-height` is set inline from the derived `panelRoom` value (`Loupe.svelte:2695`, `style="max-height: {panelRoom}px;"`), and the browser's native overflow scrolling does the rest. This is "the same grammar" available to a scrolling music window: a fixed/derived `max-height` (or `height`) in CSS plus `overflow-y: auto`, no bespoke scroll-tracking script.

By contrast, `.loupe-window` today is deliberately NOT vertically scrollable: `overflow-x: auto; overflow-y: hidden;` (`Loupe.svelte:2828-2829`), with content centred by `align-items: center; justify-content: safe center;` (`Loupe.svelte:2818-2820`). The comment at `Loupe.svelte:2815-2816` states the current design intent directly: "The window is a constant height and the drawing is centred in it, so a short system sits in air rather than moving the frame." Making the window internally scrollable would mean revisiting this block specifically (both the `overflow-y` value and the `touch-action`, which today claims only `pan-x` for the loupe's own horizontal pan, `Loupe.svelte:2830`, leaving vertical swipe for the dismiss gesture per the comment at `Loupe.svelte:2823-2827`).

## 5. Where a pitch bound would best live

`stepPitch`, `octavePitch`, and `semitonePitch` (`apps/web/src/lib/score/correction.ts:164-194`) contain no bound of any kind today; none clamps or rejects an out-of-range result. Their callers, `handleStep` (`apps/web/src/routes/+page.svelte:960-967`), `handleOctave` (`:969-976`), and `handleSemitone` (`:999-1006`), also contain no bound: each reads the current pitch, calls the step function, pushes an undo entry, and applies the correction unconditionally.

`pitchToMidi` (`packages/score-parser/src/overlay-engine.ts:66-68`) is a pure formula, `(octave + 1) * 12 + STEP_SEMITONE[step] + alter`, with no range check; it accepts and returns values for any octave. `spellPitch` (`packages/score-parser/src/transposition.ts:187-208`) is likewise unbounded: it reduces `midi` to a pitch class via `((midi % 12) + 12) % 12` and reconstructs the octave from the raw `midi` value (via `atOctave`, not read in full this session — NOT ESTABLISHED beyond the call site's own arithmetic), so neither function imposes a ceiling or floor on its own; a bound has to be added by the caller.

Existing tests of the three step functions are in `apps/web/src/lib/score/correction.test.ts`, under `describe('N.92 pitch operations', ...)` (`correction.test.ts:73-108`): they cover diatonic stepping and the accidental carried across a step (`:74-77`), the octave carry at the B/C boundary (`:78-81`), plain octave movement (`:83-86`), and semitone spelling both key-less and in flat/sharp keys (`:88-102`). None of these tests exercises a boundary condition near C1 or C7 — NOT ESTABLISHED that any existing test covers the edges the owner now wants bounded.

Trade-off, from what is read this session: `correction.ts` is where the pure, already-tested pitch arithmetic lives, and a bound placed there is exercised by the same direct unit tests as the rest of N.92's pitch operations. The page handlers (`+page.svelte:960-1006`) are where the undo entry (`pushUndo`) and the correction map write (`correct(...)`) happen; a bound placed there instead (or as well) could skip the undo push and the correction entirely when a step would cross C1/C7, rather than writing a clamped-but-unchanged pitch into the correction map. Both are workable from what is read here; which one the owner wants depends on whether "step at the bound" should register as a no-op undo step or not, which is a product decision, not something this session's reading resolves — NOT ESTABLISHED.

## 6. What would make a fixed-maximum window hard

Read this session, the ring and the carets are NOT positioned in page/viewport coordinates: both live inside `.loupe-strip`, in the same native-unit coordinate space as the rest of the panel content.
- The ring's CSS pixel box comes from `stripRing` (`loupe.ts:719-734`), which expresses `x`/`y` relative to `cropTop`/`viewLeft` and the strip's own scale, and it is drawn as an `<svg>` sized `width={frame.stripWidth} height={frame.contentHeight}` (`Loupe.svelte:2456-2472`), a sibling of the other strip panels.
- The carets (`caretsMarkup`, built at `Loupe.svelte:1792-1841`) are injected inside the `.loupe-body` `<svg>` itself (`Loupe.svelte:2591`, `{@html frame.caretsMarkup}`), whose own `viewBox` is `frame.viewBox` (native units) — also content-relative, not page-relative.

So both would scroll naturally with their container if `.loupe-window` became internally scrollable; no page-coordinate dependency was found that would fight a capped, scrolling window. `handleTap` (`Loupe.svelte:2274-2295`) resolves hits via `getBoundingClientRect()` against `e.clientX`/`e.clientY`, which is scroll-position-agnostic by construction (the browser already reports post-scroll rectangles), so it would keep working unmodified under internal scroll.

What is NOT ESTABLISHED this session: whether anything downstream of `frame.contentHeight`/`frame.windowHeight` (outside `Loupe.svelte` and `loupe.ts`) assumes the whole strip is always fully visible without scrolling — the search this session was scoped to `Loupe.svelte`, `loupe.ts`, `correction.ts`, and `+page.svelte`'s handlers, and did not walk every consumer of the `Loupe` component's own props/events.

## What could not be established

- Whether `spellPitch`'s `atOctave` helper (not read this session) itself imposes any implicit ceiling or floor via how it reconstructs the octave from a raw MIDI number.
- Whether any test anywhere in the suite currently exercises a step/octave/semitone operation at or near C1 or C7.
- Whether any consumer of `Loupe.svelte` outside the four files read this session relies on the strip being fully visible without internal scrolling.
