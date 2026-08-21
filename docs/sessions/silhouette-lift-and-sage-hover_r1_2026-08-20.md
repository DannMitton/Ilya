# The silhouette's lift, and the text intake's sage hover

**Built by Code, 2026-08-20, from Dann's walk of `0e5ed6e`. `WRITTEN`, not
`DONE`: Dann has not walked it on a deploy.**

**This is a new file rather than an append to
`docs/sessions/language-toggle_r1_2026-08-20.md`.** That memo carries the header
pill, which is a different control and a closed item. This is N.65's drawer.

Read in full this session: `docs/memory/CONTRACT.md`,
`apps/web/src/lib/components/Drawer/Drawer.svelte` at the silhouette,
`apps/web/src/lib/components/Drawer/RootPanel.svelte` at the source intake,
`apps/web/src/lib/shane/ScoreUploader.svelte` at `.dropzone`.

---

## 0. The headline, because one of the three items was already built

**Item 1, the fill, was already in the tree and already painting.** Nothing was
built for it. Item 2, the shadow, was genuinely absent and is built. Item 3, the
sage hover, is built with Dann's emptiness correction. §2 carries the evidence
for the first claim, because it contradicts the instruction and it should not be
taken on my word.

---

## 1. Measured before anything was changed

| thing | measured at rest, before the edit |
|---|---|
| handle fill, `.sil-fill` computed | `rgb(250, 248, 245)`, which is `#FAF8F5`, `--drawer-bg` |
| outline, `.sil-line` computed stroke | `rgb(210, 207, 204)`, which is `#D2CFCC` |
| outline width | `2px` |
| `.lip-silhouette` computed filter | **`none`** |

**So the stroke and the fill were both already correct, and only the shadow was
missing.**

---

## 2. Item 1. The fill did not need to return, because it never left

**The brief's premise:** "The silhouette path is currently stroke-only, so the
handle is see-through and the desk shows through where the drawer's paper should
be."

**That is false against the tree, and the tree wins.** `Drawer.svelte:647`
renders `<path class="sil-fill" d={silhouette.fill} />`, a second path whose `d`
is built at `:142` as a closed interior, and `Drawer.svelte:950-952` gives it
`fill: var(--drawer-bg, #FAF8F5)`. The silhouette has been a filled object since
`1f201f2`.

**It was not settled by reading the stylesheet, because that is the fault CONTRACT
tether 18 names.** It was settled with a positive control: `.sil-fill` was forced
to `#FF0000` from a temporary injected stylesheet, and the handle turned solid
red, exactly filling the protrusion and nothing else. The probe was then removed
and the fill measured back to `rgb(250, 248, 245)`. **The fill paints, it is the
drawer's own paper, and it covers the handle's whole interior.**

**Both states were looked at, not just one:** open, the handle reads as filled
paper continuous with the drawer; collapsed, it reads as a filled paper tab
against the desk.

**What is already true, which the brief wanted restored:**
`docs/sessions/ilya-lip-options_r1_2026-08-18.html` option A asks for
"drawer-paper fill, hairline border." The tree has drawer-paper fill
(`--drawer-bg`) and a hairline border (`#D2CFCC` at 2 px). Option A is satisfied.

**Nothing was changed for item 1.** Writing a fill onto a path that already has
one would have produced a commit that changed no pixel and a memo that claimed a
repair.

**What I cannot rule out, and it is the honest limit of this finding:** Dann saw
something. Every measurement here is Chromium on this Mac at 800 x 620 and
1400 x 900. If he is seeing the desk through the handle, it is in a browser,
a viewport, or a state this session did not reach, and the thing to do is ask
him which of the two screenshots in §7 matches what he has. **I did not find a
state where the handle is see-through.**

---

## 3. Item 2. The lift is built

`Drawer.svelte:924-947`, one declaration on the SVG:

```css
filter: drop-shadow(0 3px 12px rgba(0, 0, 0, 0.35));
```

Measured after the edit: `drop-shadow(rgba(0, 0, 0, 0.35) 0px 3px 12px)`.

- **The values are the paper's, copied and not tuned.** `0 3px 12px rgba(0, 0,
  0, 0.35)` is N.73 S1b's one ruled shadow.
- **`drop-shadow()`, not `box-shadow`, and the reason is not style.** The SVG's
  box is a 22 px strip running the drawer's whole height, so a `box-shadow`
  would draw a tall rectangle unrelated to the shape. `drop-shadow()` follows
  the painted alpha, so the shadow is the silhouette's own outline.
- **One filter on the SVG, not one per path.** Two filters would be two objects
  casting two shadows, which is what the ruling ends. The filter takes the union
  of the fill and the stroke, so the drawer's edge and the handle lift as one.

---

## 4. Item 3. The filter region does not clip, and that was checked rather than assumed

**Stated before the measurement:** I expected no clipping, because the brief's
warning is about the SVG `<filter>` element, whose `x`/`y`/`width`/`height`
default to `-10%`/`-10%`/`120%`/`120%`. A CSS `filter: drop-shadow()` on an
element is a filter *function* and does not use that region, and the element
already carries `overflow: visible`.

**The control.** Guessing from the spec is not a measurement, so the filter was
temporarily replaced with `drop-shadow(60px 0 0 rgba(255,0,0,1))`: a hard red
shadow, no blur, thrown 60 px right. A clipped region would have cut it off
within a few pixels of the 22 px box.

**Result: it rendered in full.** The red copy of the silhouette appeared
complete 60 px to the right, its vertical run unbroken from the drawer's top
edge to its bottom edge and the handle's blob whole. **Nothing clips, at the
sides or at the ends.** The probe was removed and the ruled filter measured back
in place.

**So the region was not widened, because widening it would have been a change
with no observable effect.** If a future session moves this to an SVG `<filter>`
element, the brief's warning becomes live again and the region must be set.

---

## 5. Item 4. The lift is not confined to the handle, and one consequence is Dann's to rule

**Built as ruled.** The stroke runs the drawer's whole height, so the shadow
falls from the whole edge, which is what one object casting one shadow means.
Confirmed in the 60 px control: the shadow's vertical run is continuous top to
bottom.

**THE CONSEQUENCE, OBSERVED AND NOT CURED.** The ruled value has no horizontal
offset, so the 12 px blur blooms in both directions, and `.lip-silhouette` sits
at `z-index: 1` above `.drawer-clip`. **So roughly 12 px of the drawer's own
right edge is darkened by its own shadow**, alongside the 12 px that falls
outward onto the desk. A sheet of paper does not shadow itself; this does,
because the object casting the shadow is the edge line rather than the whole
drawer body.

**It was left exactly as ruled.** The brief says the lift falls from the whole
edge, that Dann has seen it drawn that way and ruled it, and that if he wants it
confined after walking, the answer is a filter region on this same object and
**not** a second element, and not to pre-build that. **It is not pre-built.**
This paragraph exists so that he is looking for it on the walk rather than
discovering it.

---

## 6. Item 5. The sage hover, on the wrapper, and only while the field is empty

`RootPanel.svelte:96-100` names the condition once, at `:100`:

```js
const sourceIsEmpty = $derived(inputText === '');
```

`:204` puts it on the box, `:213` gates the watermark on the same name, and
`:530-566` carries the rule:

```css
.textarea-wrapper.empty:hover { background: rgba(139, 154, 125, 0.06); }
```

`rgba(139, 154, 125, 0.06)` is `--sage` `#8B9A7D` at 6 percent, the twin of
`.dropzone:hover`'s `rgba(142, 126, 155, 0.06)`, which is `--deeper-lavender` at
6 percent (`ScoreUploader.svelte:753-755`, the tint at `:754`). **Each box takes its own border's
hue, because hue names place.** `.textarea-wrapper` also takes `.dropzone`'s own
`transition: background 0.15s ease`, so the two intakes tint at one speed.

**No drag state.** `.dropzone.dragging` doubles to 12 percent because it takes a
drop. The textarea takes none.

### Which element, and why

**`.textarea-wrapper`, not `.text-input`.** Two reasons, and the second is
measured.

1. **`.text-input` is transparent at `z-index: 1`, above the watermark.** A
   background on it would paint over `text` and hide the mark the wrapper was
   built to reveal. The wrapper sits *below* the watermark, so the tint goes
   behind the mark and the mark stays on top of it.
2. **The wrapper's box is the textarea's border box exactly.** Measured at
   800 x 620: both are `left 16, right 502, top 340.76, bottom 488.32`,
   `486 x 147.56`, and a JSON comparison of the two rectangles is identical.
   **So the hover target is the whole bordered field, which is the same target
   the score box gets from its one div.** The textarea is `display: block;
   width: 100%` and the wrapper has no padding of its own, which is why they
   coincide.

### The watermark, measured rather than assumed

| | cursor off the field | cursor on the empty field |
|---|---|---|
| watermark's own colour | `#A8B5A0` (`--light-sage`) | `#A8B5A0`, **unchanged** |
| the ground behind it | `#FFFFFF` | `#F3F2EE` |
| watermark against its ground | 2.15:1 | **1.92:1** |

The mark's own colour does not change; what changes is what sits behind it. The
ground on hover is `rgba(139, 154, 125, 0.06)` composited over `.drawer-body`'s
measured `rgb(250, 248, 245)`, because the tint replaces the wrapper's white
exactly as `.dropzone`'s hover replaces its own. **The watermark loses 0.23 of a
ratio point and is not hidden**, which was confirmed by looking at it as well as
by computing it.

**Both numbers are far below any WCAG text threshold, and that is by design and
not new.** The mark is `aria-hidden` decoration, and it measured 2.15:1 before
this change.

### Dann's correction, verified in both directions

| state | wrapper background | watermark |
|---|---|---|
| empty, cursor on | `rgba(139, 154, 125, 0.06)` | `text` present |
| «Я вас любил» typed, cursor on | `rgb(255, 255, 255)`, **no tint** | gone |

`.empty` leaves the class list the instant the field takes content, so the
singer's poem is never tinted. **This is the whole point of the correction:** the
score box's hover disappears because the drop zone unmounts once a score
arrives, and the textarea never unmounts.

---

## 7. What survives, checked

- **The 44 by 88 coarse-pointer target.** Untouched: it is
  `.drawer-lip::before` under `@media (pointer: coarse)`, and nothing in this
  pass touched `.drawer-lip` or its pseudo-element.
- **The chevron and its measured nudge.** Untouched: `-0.67px` closed,
  `-1.33px` open, both still declared.
- **The flip, the animation, the collapsed state.** Walked in the browser: the
  pull was clicked closed and open, the 1500 ms width transition ran, and the
  chevron flipped. Both end states were screenshotted.
- **The phone.** `{#if !isMobile && silhouette}` still gates the whole SVG, so
  the phone draws no silhouette, takes no filter, and keeps its painted tab.
  Not re-measured this pass, because no rule that touches it was changed.

---

## 8. Instrument notes. Three readings were thrown out rather than reported

Recorded because each one would have been a false finding in this memo.

1. **A programmatic viewport resize leaves `bind:clientHeight` stale.** The first
   reading put the drawn handle at page-y 346 and the pull at 436, a 90 px
   disagreement that would have been a serious defect. On a clean reload at the
   same viewport they agree to **0 px**. The silhouette's `height` attribute had
   kept a height from before the resize. **Whether a real window resize does the
   same is NOT ESTABLISHED**; only a programmatic one was tested.
2. **`getComputedStyle` in the same evaluation as the click returns the
   pre-transition value.** It bit three times: the pill chip in the previous
   pass, `.sil-fill` reading `#FF0000` after the probe was already removed, and
   the wrapper reading white while hovered. Every colour in this memo was read
   in a separate call after the transition settled.
3. **An unscoped `.intake-watermark` selector finds the score box's mark.** It
   reported the text watermark still in the DOM with a poem in the field. Scoped
   to `.textarea-wrapper`, it is correctly absent.

---

## 9. The five gates

| gate | baseline | this run |
|---|---|---|
| phonology | 216 passed (216) | **216 passed (216)** |
| dictionary | 235 passed (235) | **235 passed (235)** |
| web-check | 0 errors and 7 warnings in 4 files | **0 errors and 7 warnings in 4 files** |
| web-test | 682 passed (682) | **682 passed (682)** |
| score-parser | 444 passed, 5 skipped (449) | **444 passed, 5 skipped (449)** |

**Nothing moved, so no permission was needed.**

---

## 10. NOT ESTABLISHED

**NOT ESTABLISHED BEATS A COMPLETE INVENTED ANSWER.**

- **What Dann saw when he reported the handle as see-through.** No state was
  found in which it is. **Settled by:** showing him the two screenshots and
  asking which matches his screen, or by his browser and viewport.
- **Whether the inward 12 px bloom is wanted.** Built as ruled and reported.
  **Settled by:** his walk.
- **The shadow on a real deploy over the paper.** Every observation here is a
  dev server at 800 x 620 and 1400 x 900 in the Chromium pane. **Settled by:**
  his walk.
- **Whether a real window resize leaves the silhouette's height stale**, as the
  programmatic one did. If it does, the handle and the pull would separate on a
  resized desktop window. **Settled by:** dragging a real window edge and
  re-measuring. **This is the one item in this memo that could be a live defect
  and it is not this pass's to fix.**
- **The textarea could not be typed into.** The dictionary never finished
  loading in this pane, so `.text-input` stays `disabled` and the poem was put
  in by dispatching an `input` event through the component's own handler. The
  real typing path was not exercised.
- **Safari, and any phone.**

---

## 11. What Dann walks

1. The handle is filled with the drawer's paper and reads as one object with the
   drawer, open and closed.
2. The whole edge lifts off the desk, not only the handle, and the shadow does
   not stop short at the top or the bottom.
3. Whether the shadow falling about 12 px back onto the drawer's own right edge
   is right or wants confining.
4. Hovering the empty text box tints it sage, the way the score box tints
   lavender, and `text` stays visible on the tint.
5. Hovering the text box with a poem in it does nothing at all.

---
*Written by Claude Code, 2026-08-20, against the working tree. Every colour,
rectangle, and ratio here was read out of a running browser, and the two claims
that contradict the brief were each settled with a positive control.*
