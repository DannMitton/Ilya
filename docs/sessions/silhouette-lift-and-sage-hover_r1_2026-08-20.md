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
is built at `:142` as a closed interior, and the `.sil-fill` rule in the same
file gives it `fill: var(--drawer-bg, #FAF8F5)`. **That rule sat at `:950-952`
when this was written and the second pass moved it; find it by its selector.** The silhouette has been a filled object since
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

One declaration on the SVG, in the `.lip-silhouette` rule. **STALE AS OF THE
SECOND PASS BELOW: the shadow is not on that element any more. It sat at
`:924-947` when this was written. See §A.**

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

`:204` puts it on the box, `:213` gates the watermark on the same name, and the
`.textarea-wrapper.empty:hover` rule carries the declaration. **That rule sat at
`:530-566` when this was written and the second pass shifted it; find it by its
selector.**

```css
.textarea-wrapper.empty:hover { background: rgba(139, 154, 125, 0.06); }
```

`rgba(139, 154, 125, 0.06)` is `--sage` `#8B9A7D` at 6 percent, the twin of
`.dropzone:hover`'s `rgba(142, 126, 155, 0.06)`, which is `--deeper-lavender` at
6 percent (the `.dropzone:hover` rule in `ScoreUploader.svelte`; it sat at
`:753-755` when this was written and ship A's deletion shifted it). **Each box takes its own border's
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

---
---

# Second pass, 2026-08-20. Six walk items, and the shadow moved

**Appended to this memo rather than started fresh, because item 7 corrects §3
to §5 above and a reader must find the correction beside the thing it
corrects.** Everything above stands as the record of what was done first and
why it was wrong.

`WRITTEN`, not `DONE`. Dann has not walked any of it on a deploy.

---

## A. The seam, and the correction to my own work

**Dann's ruling:** the drawer and its handle must read as one continuous
surface, one sheet of paper with a tab, casting one shadow onto the desk. No
seam. Reference: `docs/sessions/lip-handle-silhouette_r1_2026-08-20.html`,
option C.

**§5 above predicted this defect and shipped it anyway.** It said "roughly 12 px
of the drawer's own right edge is darkened by its own shadow" and left it,
because the brief of the time said not to pre-build the confinement. **Dann has
now ruled that the seam is the defect, not a consequence to be walked**, and he
is right: on his screen the handle read as a pill floating beside the drawer,
which is the exact thing the one-silhouette ruling removed.

### What the drawing says, and why it settles the placement

Option C's filled path is `M0 0 L150 0 L150 100 L188 100 C… L150 300 L0 300 Z`
(`lip-handle-silhouette_r1_2026-08-20.html:73-74`). **It starts at x = 0.** The
filled shape is the WHOLE drawer with the handle's bump on it, not a strip. A
drop-shadow renders behind its own element, so wherever the shape is opaque its
shadow is invisible, and the only shadow that survives is the one off the right
edge, on the desk.

### Path 1 was taken and it worked

The shadow moved from `.lip-silhouette` to **`.drawer`**
(`Drawer.svelte:703`), the element that already contains the drawer body and the
handle's SVG both, so the filter traces the union of the two. The strip's own
filter is gone from the `.lip-silhouette` rule, now a comment saying where it
went; it sat at `:942-948` when this was written.
Path 2, clipping the blur, was not needed and is not built.

**The values are unchanged:** `0 3px 12px rgba(0, 0, 0, 0.35)`. So is the path
geometry, the `#D2CFCC` stroke at 2 px, and everything else on the KEEP list.

### The hazard was checked before the edit, not discovered after

`filter` creates a stacking context AND a containing block for absolute and
fixed descendants. Grepped across `lib/components/Drawer/` and `lib/shane/`:
**the only `position: fixed` in the whole drawer subtree is `.drawer` itself**,
which its own filter cannot re-root. The three absolute descendants,
`.lip-silhouette`, `.drawer-lip`, and its `::before`, already resolved against
`.drawer`, which is `position: relative` on the desk and `position: fixed` on
the phone. Nothing could move, and nothing did.

### No lift on the phone

`filter: none` in `Drawer.svelte`'s `max-width: 767px` block, which sat at
`:1425` when this was written and ship A shifted. The
silhouette is desktop-only, so on the phone there is no edge and no handle for a
shadow to belong to, the drawer is a full-screen overlay whose shadow would fall
outside the viewport entirely, and the declaration would only cost a
full-screen rasterization on every frame of the 400 ms slide.

### Done-when, verified by looking

**The 8x reading.** The right edge was magnified with a temporary
`transform: scale(8)` on `body`, origin on the drawer's right edge at the
handle's mid-height, so vector content re-rasterizes at 8x and the colours are
the real painted ones.

**What the 8x view shows:** the drawer's paper runs unbroken from well inside
the drawer, across the right edge, and into the handle's interior. **No line, no
gradient, no colour change at the edge and none at the handle's mouth.** The
only shadow visible falls on the desk, to the right of the handle and off the
edge above and below it. It is the same picture as option C.

**A NUMERIC PER-PIXEL SAMPLE WAS NOT AVAILABLE IN THIS PANE and no RGB triple is
invented here.** The Browser pane's screenshot cannot be cropped and the page
cannot read its own painted pixels. **So the claim was settled by a control
instead, and the control is stronger than a sample would have been.**

**THE CONTROL.** The shadow was temporarily driven to
`drop-shadow(0 3px 40px rgba(0,0,0,1))`: full opacity, more than three times the
blur. At 8x, **the desk beside the drawer went nearly black, and the drawer's
interior and the handle's interior did not change at all.** Not one pixel of
shadow reached inside at alpha 1.0. At the ruled 0.35 and 12 px it is clean a
fortiori. The instrument could plainly show shadow inside, and it showed none.
Both probes were then removed and `body`'s transform measured back to `none`.

### The lip, the collapsed state, and the phone: measured before and after

Read from the running app in each state, before the edit and after it.

| state | thing | before | after |
|---|---|---|---|
| desk, open | `.drawer` rect | 0, 48 → 520, 900 | **identical** |
| | `.drawer-lip` rect | 520, 436 → 540, 512 | **identical** |
| | `.lip-silhouette` rect | 518, 48 → 540, 900 | **identical** |
| | chevron transform | `matrix(-1, 0, 0, 1, -1.33, 0)` | **identical** |
| desk, collapsed | `.drawer` width | 0 | **identical** |
| | `.drawer-lip` rect | 0, 436 → 20, 512 | **identical** |
| | `.lip-silhouette` rect | −2, 48 → 20, 900 | **identical** |
| | chevron transform | `matrix(1, 0, 0, 1, -0.67, 0)` | **identical** |
| phone, collapsed | `.drawer` transform | `matrix(1, 0, 0, 1, -360, 0)` | **identical** |
| | `.drawer` filter | `none` | **`none`** |
| | `.drawer-lip` rect | 0, 282 → 20, 358 | **identical** |
| | `.drawer-lip` background | `rgb(250, 248, 245)` | **identical** |
| | silhouette | not rendered | **not rendered** |
| | chevron transform | `matrix(1, 0, 0, 1, -0.67, 0)` | **identical** |

**Nothing moved. The filter moved and nothing else did.** The flip, the
animation, and the collapsed state were exercised by clicking the real pull in
each viewport.

**The 44 by 88 coarse-pointer target was NOT re-measured**, because this pane is
a fine pointer and `.drawer-lip::before` only takes a `content` under
`@media (pointer: coarse)`. No rule touching it changed. **NOT ESTABLISHED by
measurement this pass.**

---

## B. The six walk items

### 1. Both intakes at 75 percent

**The textarea's height is not one number, which is why it is an expression.**
`app.css`'s N.23 focus-zoom rule names `textarea`, so the field renders at
14.4 px on the desk and 16 px on a phone. A fixed pixel height would have cut
the phone by 32 percent while cutting the desk by 25.

The field's height is `rows` × `line-height` plus padding and border:
6 × 1.5em + 18px. Three quarters of that is **`calc(6.75em + 13.5px)`**
(`RootPanel.svelte:632`), and `em` resolves against the field's own font, so the
fraction holds at both sizes. `rows="6"` stays as the no-CSS fallback and
`resize: vertical` is untouched.

| field | where | before | after | ratio |
|---|---|---|---|---|
| textarea | desk, 1400 x 900 | 147.56 px | **110.70 px** | 75.02% |
| textarea | 360 x 640 | 162.00 px | **121.50 px** | 75.00% |
| score box | desk, 1400 x 900 | 152.00 px | **114.00 px** | 75.00% |
| score box | 360 x 640 | 152.00 px | **138.00 px** | **90.79%** |

**THE SCORE BOX DID NOT REACH 75 PERCENT ON THE PHONE, and it cannot.**
`min-height` went 152 to 114 (the `min-height` in `ScoreUploader.svelte`'s
`.dropzone` rule, at `:738` when this was written and shifted by ship A), but at 360 px the
drop zone's sentence wraps to five lines that measure 119 px on their own, so
with the box's 19 px of vertical padding the CONTENT is 138 px and the 114 px
floor no longer binds. **Forcing 114 px there would clip the placeholder.** The
box shrank as far as its own words allow. Reported rather than forced, and
Dann's to rule.

**Where the marks land.** Both watermarks centre themselves and still do:

| mark | where | glyph top within field | offset from field centre |
|---|---|---|---|
| `text` | desk | 44.98 → **26.55 px** | −0.30 px, unchanged |
| `text` | 360 | — → **31.95 px** | −0.30 px |
| `score` | desk | 47.20 → **28.20 px** | −0.30 px, unchanged |
| `score` | 360 | — → **40.20 px** | −0.30 px |

Both glyphs are 57 px tall at both sizes and both still sit within a third of a
pixel of their field's centre. **The −0.30 px is unchanged by this pass**; it is
the glyph's own ink against its line box.

The score box's placeholder is top-left and stays there, 9.5 px below the field's
top at both sizes, so it did not move relative to the box. On the desk it now
sits 28.9 px above the box's centre rather than 47.9 px. The textarea's
placeholder is a native `::placeholder` and sits at the same top-left inset.

**A COLLISION THAT PREDATES THIS PASS AND IS NOT MADE WORSE BY IT.** At 360 the
drop zone's five-line sentence spans 9.5 to 128.5 px and the `score` glyph spans
40.2 to 97.2 px, so they overlap. `STATE.md:72-75` already records this as
measured, left alone, and Dann's to rule. Before this change the same two
overlapped across a 152 px box.

### 2. Clear and Transcribe move between the fields

`RootPanel.svelte:284` now precedes `:310`. Measured vertical order, both sizes:

| | desk | 360 |
|---|---|---|
| textarea | 340.8 | 345.0 |
| Clear / Transcribe | 457.5 | 472.5 |
| score box | 505.8 | 520.8 |
| Finale disclosure | 639.8 | 678.8 |

**Transcribe sits directly under the textarea it acts on, and the score box
follows.** `transcribeError` came with the buttons, because it is that button's
own failure.

**The Finale disclosure stayed with the score box**, measured below it at both
sizes. It needed no work: it lives inside `ScoreUploader`'s own root
(it sat at `ScoreUploader.svelte:678-694` when this was written), so it travelled
with the score box by construction. **DELETED IN SHIP A on Dann's ruling; see
`retraction-shipA_r1_2026-08-20.md`.**

### 3. No rule between the score field and Print

`RootPanel.svelte:876`, `.output-section { border-top: none; }`. Measured:
`border-top-style: none`, `border-top-width: 0px`, `padding-top: 6px`.

**The 6 px of top padding stays.** It is the space the recipe gives a label, and
without the line it reads as the gap it always was. Every other boundary in the
drawer still draws its rule, confirmed by measurement: Notation, Repertoire, and
Analysis all still read `2px solid rgb(139, 154, 125)`.

**This is a concept deleted, not a value tuned.** The recipe at `:790-807` says
one rule per boundary, drawn by the station below it, so this rule WAS the
Source-to-Output boundary. Removing it says those two are one region to the eye,
which is Dann's to say.

### 4. Songs becomes Repertoire

The `'songs.heading'` entry in `i18n.ts` now reads
`{ en: 'Repertoire', fr: 'Répertoire' }`. **It sat at `:813` when this was
written; ship A deleted six keys above it and shifted it.**
Measured in the running drawer, the station label reads **Repertoire**.

**THE KEY IS UNCHANGED and it is not a lie.** It addresses the songs feature,
whose other twenty strings still speak of one song at a time (`songs.new`
"New song", `songs.deleteConfirm` "Delete this song"), and those stay correct
English because a repertoire is made of songs. Only the STATION's name changed,
which is only what Dann ruled.

**Neither word is coined.** Both are already house vocabulary:
`profile.scoreRegionAria` is 'Repertoire fit score', and « répertoire » appears
at `profile.lede` and `calib.welcome.lede`. **Those three sat at `:604`, `:581`,
and `:463` when this was written; ship A shifted them. Find them by key.**

### 5 and 6. Lavender on Shift Lyrics

**RECORDED AS DANN EXTENDING HIS OWN RULING.** "Lavender marks the marked
score" was ruled 2026-08-19 for the BANNER and the DESK
(`claude/ruling-lavender-marks-the-marked-score_2026-08-19.md`,
`STATE.md:830-833`). This carries it into a drawer STATION. **So the drawer now
reads sage for transcription work and lavender for score work**, which is the
same hue-names-place rule that already puts a sage border on the text intake and
a lavender one on the score intake.

**The token is `--deeper-lavender` `#8E7E9B`, the one the marked score already
uses.** It is the app bar's `.header-bar.tab-shane` fill and the score intake's
own border. **`--surround-marked` is that hue at 60 percent toward white, a DESK
tint, far too light to set type in, so it is not this.** No new token entered
the palette.

**The rule**, `ShiftLyricsControl.svelte:119`, measured against a sage station
rule in the same drawer:

| | width | style | colour |
|---|---|---|---|
| Shift Lyrics | 2px | solid | `rgb(142, 126, 155)` |
| Notation, Repertoire, Analysis | 2px | solid | `rgb(139, 154, 125)` |

Same weight, same style, lavender instead of sage. The recipe's 6 px between a
rule and the label it names came with it; **the recipe's 12 px below the body
did NOT**, because Dann ruled a divider above the header and nothing about the
space beneath.

**The label**, `ShiftLyricsControl.svelte:63`, now renders through
`StationHeader` with `accent="var(--deeper-lavender)"`. Measured against the
Analysis label:

| | colour | size | letter-spacing | transform | weight |
|---|---|---|---|---|---|
| Shift Lyrics | `rgb(142, 126, 155)` | 11.2px | 1.344px | uppercase | 600 |
| Analysis | `rgb(139, 154, 125)` | 11.2px | 1.344px | uppercase | 600 |

**Only the colour differs, which is exactly what Dann ruled.**

**It could not have been done by repainting the old rule.** This file drew its
own `<h3>` at 0.6875rem and 0.08em in `#6a655f`, against the drawer recipe's
0.7rem and 0.12em. Repainting it would have left this the one label that is a
different size and a different tracking from all its neighbours. Routing it
through `StationHeader` is what makes "only the colour changes" true.

---

## C. The five gates

| gate | baseline | this run |
|---|---|---|
| phonology | 216 passed (216) | **216 passed (216)** |
| dictionary | 235 passed (235) | **235 passed (235)** |
| web-check | 0 errors and 7 warnings in 4 files | **0 errors and 7 warnings in 4 files** |
| web-test | 682 passed (682) | **682 passed (682)** |
| score-parser | 444 passed, 5 skipped (449) | **444 passed, 5 skipped (449)** |

**Nothing moved, so no permission was needed.**

---

## D. The instrument, and it is worse than §8 said

**THE BROWSER PANE RUNS ITS TAB HIDDEN, and that is the single cause behind
every stale reading in both passes.** It was proven this pass:
`requestAnimationFrame` never fired and the call timed out after 30 seconds. A
hidden tab does no rendering updates, so transitions do not advance and layout
reads lag behind the class list.

`ENVIRONMENT.md` already records the hidden tab as the reason the dictionary
never finishes parsing. **It is also why §8's three "thrown out" readings
happened, and this pass adds two more:** the phone drawer reported an identity
transform with `collapsed` in its class list, and a probe's fill read back
`#FF0000` after the probe was removed.

**The working method, and it is the one to keep:** never trust the first read
after a click, a navigation, or a resize; read again, or take a screenshot
first, which forces a paint. Never use `rAF`. **Every number in this memo is a
settled read, and the screenshot is the arbiter where they disagree.**

---

## E. NOT ESTABLISHED

**NOT ESTABLISHED BEATS A COMPLETE INVENTED ANSWER.**

- **A numeric per-pixel colour sample of the drawer's edge.** The pane cannot
  crop a screenshot and the page cannot read its own painted output. Settled
  instead by an 8x magnified view and by the alpha-1.0 control, which is
  stronger. **Settled by:** a pane that supports region capture, or Dann's eye
  on the deploy.
- **The 44 by 88 coarse-pointer target after the filter move.** Not
  re-measured; this pane is a fine pointer. No rule touching it changed.
  **Settled by:** a coarse-pointer device.
- **Whether a real window resize leaves the silhouette's height stale.** Carried
  forward from §10 and still open. It remains the one item in this memo that
  could be a live defect.
- **Whether the score box at 138 px on a phone is acceptable**, given it could
  not reach 75 percent. **Settled by:** Dann's ruling.
- **The `score` watermark's collision at 360 px.** Pre-existing, re-measured,
  not made worse. `STATE.md:72-75`. **Settled by:** Dann's ruling.
- **Safari, and any real phone.** Everything here is the Chromium pane at
  1400 x 900 and 360 x 640.

---

## F. What Dann walks

1. The drawer's paper runs unbroken to its right edge and into the handle. No
   seam, no pill, one sheet with a tab.
2. The only shadow falls on the desk.
3. The pull, the flip, the collapsed state, and the phone are as they were.
4. Both intake fields are three quarters as tall, with their marks still
   centred.
5. Transcribe sits under the textarea; the score box and its Finale disclosure
   follow.
6. No line between the score box and Print.
7. The station reads Repertoire, and Répertoire in French.
8. Shift Lyrics carries a lavender rule and a lavender label, at every other
   station label's size and tracking.

---
*Second pass written by Claude Code, 2026-08-20, against the working tree. The
seam was settled with a control that drove the shadow to full opacity, and the
six walk items were each measured at 1400 x 900 and 360 x 640.*
