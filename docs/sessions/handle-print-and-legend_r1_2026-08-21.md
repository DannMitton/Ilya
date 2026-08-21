# Print leaves the drawer, the handle grows, and a sigil gets its legend

**Serves N.65. Built by Code, 2026-08-21. Floor `502d571`, branch `Shane`.
`WRITTEN`, not `DONE`: Dann has not walked it on a deploy.**

Brief: `docs/sessions/brief-to-code-handle-print-and-legend_r1_2026-08-21.md`,
read in full this session.

Read in full this session: `docs/memory/CONTRACT.md` including tethers 17 and
18, `README.md`, the brief. **Snippet only:** `docs/memory/STATE.md`, whose head
and gate lines were read; the file is 145 KB and the rest of it was not opened.
**Not read:** `claude/`, which this environment cannot reach.

Thirteen files changed, **483 insertions and 125 deletions**. Seven carry the
work: `Drawer.svelte`, `RootPanel.svelte`, `Paper.svelte`, `i18n.ts`,
`provenance.ts`, `ScoreUploader.svelte`, and `+page.svelte`. Six changed only to
repair citations; see §2.5. No file added, none deleted.

---

## 1. What shipped

### 1.1 `Print` leaves the drawer for under the sheet

**Deleted from the drawer.** `RootPanel.svelte:359` is the row, now Export and
Import with the conditional `Export all songs` third cell. The `onprint` and
`printDisabled` props left the component's `Props` with the button. The
`.btn-secondary` rule went with them: Print was its only call site, and left in
place it raised an eighth `svelte-check` warning, which moves a gate count.

**`+page.svelte:568`.** `printDisabled` is gone. It read
`studioDocument === 'shane' ? !ingestedScore && !voiceCalibrated : !hasResults`.
The control under the sheet is always live, so there is no guard to keep.
`voiceCalibrated` stays; the voice anchor reads it.

**`+page.svelte:2397`.** `<div class="sheet-print">` holding one button, inside
`<main>`, after the destination block, gated on `destination === 'studio'`.
`handlePrint` is unchanged and always lived in this file.

**`+page.svelte:2752`, `.sheet-print`.** Flush left by the desk head's own
mechanism: `align-self: center`, `width: 100%`, `max-width: var(--sheet-width)`,
`justify-content: flex-start`. `--sheet-width` is the same per-destination token
`DeskHead.svelte` reads, so Print lands in the `TRANSCRIPTION` column by
construction rather than by a number.

**`+page.svelte:2810`.** `@media print { .sheet-print { display: none } }`, the
rule `DeskHead.svelte` already carries, with its reasoning: the page prints, the
desk does not.

**The transient note in `RootPanel.svelte` is discharged.** It said Print stayed
only because deleting it would leave no way to print until the desk-head ship,
and that "that ship removes it". This is that ship, so the note and the
consequence it named both go.

### 1.2 The silhouette renders on the phone

- **`Drawer.svelte:656`**, `{#if silhouette}`. The `!isMobile &&` is gone.
- **`Drawer.svelte:675`**, `class="drawer-lip silhouetted"`. Unconditional. It
  is written into the class attribute rather than left as `class:silhouetted=
  {true}`, because a directive that cannot be false is a condition nobody can
  read.
- **`Drawer.svelte:1493`.** `filter: none` in the phone block **stays**, as
  ruled. Its comment is repaired: the half that argued "the silhouette is
  desktop-only" is struck, and the half that matters is untouched, that a
  full-screen filter rasterizes on every frame of the 400 ms slide.
- **`Drawer.svelte:1606`.** The phone's `border-right: none` on `.drawer-body`
  becomes `2px solid transparent`, the desktop's own declaration. The
  silhouette's vertical run lands in that reserved 2 px; with no reservation the
  drawer's content sits under the line. **The brief did not ask for this and the
  tree requires it.**

**The circular comment is replaced, not left.** `Drawer.svelte`'s
`.drawer-lip.silhouetted` block used to justify the exclusion with "the phone
keeps the painted tab, because there is no silhouette there to belong to". That
assumed its own conclusion. Dann's picture and his sentence "This is the
appearance I want on mobile" are in its place.

### 1.3 A desk strip at the drawer's right edge on the phone

**`Drawer.svelte:1520`.** `width: 100% !important` becomes
`calc(100% - var(--lip-w, 20px)) !important`.

**`Drawer.svelte:299`.** The root `<aside>` publishes `--lip-w: {LIP_W}px` and
`--lip-h: {LIP_H}px`. The strip's width is the pull's protrusion **read from the
one constant, not typed**: before this ship the protrusion was written twice, as
`LIP_W` and as `.drawer-lip { width: 20px }`, and the height twice as `LIP_H`
and `height: 76px`. That duplication is how an outline and a tab come to
disagree, which is the failure item 9 exists to prevent.

**`Drawer.svelte:1557`. A rule the brief did not name is deleted, and it had
to be.** See §2.1.

### 1.4 The strip takes the destination's tint

**Nothing was painted.** The strip exposes `.main-content`, which
`+page.svelte` already tints per destination. Measured in §3.4. No second
lavender enters, because no lavender was written.

**The tab itself stays cream on every destination.** The tree's ruling near
`Drawer.svelte`'s `.drawer-lip` block is untouched.

### 1.5 The `#fff` hover latch, guarded on both rules

- **`Drawer.svelte:1030`**, `@media (hover: hover)` around
  `.drawer:has(.drawer-lip:hover) .sil-fill { fill: #fff }`. **This is the one
  that mattered.** It was harmless only while the silhouette was desktop-only;
  item 1.2 lands it on the phone, where a tap latches `:hover` and would turn
  the handle's fill white.
- **`Drawer.svelte:1107`**, `@media (hover: hover)` around both
  `.drawer-lip:hover { background: #fff }` and its cancel
  `.drawer-lip.silhouetted:hover { background: none }`. Both sit inside the
  guard so the cancel cannot outlive the thing it cancels.

`grep -n "hover: hover" Drawer.svelte` returned nothing before this ship. It
returns two hits now.

**The rest of the file's hovers, found and not changed**, as instructed:
`Drawer.svelte:906` `.takeover-back:hover`, `:1296` `.toc-link:hover`, `:1319`
`.toc-link.active:hover`, `:1350` `.toc-sub:hover`, `:1365` `.toc-deep:hover`,
`:1402` `.toc-chevron:hover`, `:1419` `.guide-toc .toc-link:hover`, `:1429`
`.guide-toc .toc-link.active:hover`. Eight rules, all unguarded. Every one is a
colour or a border change on a table-of-contents link or the takeover's back
affordance, none of them a fill that must match a neighbouring surface, so none
of them produces the mismatch Dann reported. **Not changed this ship.**

### 1.6 The format line drops its lead-in and keeps its « ou »

**`i18n.ts:342`.** `upload.drop.acceptedNow` is now:

- `MNX, MusicXML, .mxl, Finale (.musx), MuseScore (.mscz), PDF, or photograph`
- `MNX, MusicXML, .mxl, Finale (.musx), MuseScore (.mscz), PDF, ou une photographie`

The lead-in goes in both languages. **No new French is written.** The tail is
`upload.drop.placeholder`'s own tail, the string Dann added the conjunction to
by hand on 2026-08-20. No terminal full stop: without a lead-in the line is a
bare list, not a sentence.

`upload.drop.placeholder` is untouched. So is the score box's own one-sentence
placeholder assembled in `ScoreUploader.svelte`. The render site,
`ScoreUploader.svelte:600`, is unchanged; only its comment is.

### 1.7 A shut station is the same height everywhere

**`RootPanel.svelte:211`, `:380`, `:420`.** Each `.section` wrapper takes
`class:shut` from the same `sections.has(...)` its header reads.

**`RootPanel.svelte:913`.** `.section.shut { padding-bottom: 6px }`.

**The ruling is kept, not overturned.** Open, `padding: 6px 0 12px` stands
unchanged, so a label still sits close to the rule that names it and a body
still gets air before the next rule. A shut station has no body, so the 12 px is
air after nothing. This is the move `.station-label.tight` already makes in
`StationHeader.svelte`.

**6 px, not 0.** See §2.2. Measured in §3.6.

### 1.8 The spot-reconstitution sigil gets its legend

**`provenance.ts:84`**, `SPOT_RECONSTITUTION`, a constant rather than a sixth
member of `LEGEND_ORDER`, because that array is the allowlist the stress scan
tests words against and no word's `stressSource` is ever this.

**`provenance.ts:98`**, `LEGEND_DISPLAY_ORDER`, derived from `LEGEND_ORDER` by
splicing the one non-stress mark in before `inferred`. Two hand-maintained lists
would drift; this one cannot.

**`provenance.ts:116`**, icon `'R'`. The mark is the character, as it is for
`yo-restored`'s `'ё'`. **`provenance.ts:130`**, key
`legend.spot-reconstitution`, which already existed at `i18n.ts:207`.

**`provenance.ts:149`.** `buildProvenanceLegend` takes a third parameter,
`spotReconstitution?: Map<string, boolean>`. Optional, so every existing caller
and test keeps its behaviour exactly.

**`provenance.ts:190`.** A separate scan, deliberately not subject to the clitic
skip above it: `WordStack.svelte:165` prints the `R` for any word it renders,
clitics included, and that skip is about a stress source, which this is not. The
key and the predicate are `VerseLine.svelte`'s own, `${lineIndex}-${wordIndex}`
and the Cyrillic test, so the builder cannot emit a legend for a mark the page
never drew.

**`Paper.svelte:69`.** The map goes in beside the lines.

**Where it sorts: before `inferred`.** A spot override is the singer's own
decision about one word, so it belongs with the user-attributed marks, and
`LEGEND_ORDER`'s own rule "inferred last (the warning state)" still holds.

**`provenance.ts:160` carries Dann's sentence verbatim**, so the clitic skip is
recorded as ruled rather than incidental: *"the clitic arrow does not count as a
sigil. The clitic arrow is fully explained in the GUIDE section."*

### 1.9 The paper handle doubles in height

- **`Drawer.svelte:127`**, `LIP_H = 152`.
- **`Drawer.svelte:1056`**, the tab reads `var(--lip-w)` and `var(--lip-h)`.
- **`Drawer.svelte:1156`**, the coarse touch extension's height reads
  `var(--lip-h)`. It was a fixed `88px`, which at 152 would have covered only
  the middle: the top and bottom 32 px of a visibly tappable handle would have
  acquired 20 px of width instead of 44. **The comment that claimed "the target
  is still 44 by 88" is repaired.**

**The shape does not change.** `R = LIP_W * (18 / 56)` derives from the width,
so only the straight run between the two corners lengthens.

**The chevron re-centres by itself**, confirmed rather than assumed, and no
second centring rule was added. See §3.2.

**`Drawer.svelte:1460`, the second `width: 20px`, needs nothing.** It is
`.toc-chevron-nested`, a table-of-contents chevron whose `height: 20px` twin is
its own square glyph. Nothing to do with the pull.

**The coarse-only `::before` is not extended to fine pointers**, as ruled.

---

## 2. Where the tree disagreed with the brief

**Tether 3: the tree wins.** Four disagreements, all followed toward the tree.

### 2.1 The open tab's position override had to be deleted

**The brief's §3 says "Closed, nothing changes" and describes the tab filling
the strip. It does not mention `.drawer:not(.collapsed) .drawer-lip { left:
auto; right: 0 }`, which the phone block carried.** That rule existed because
the open drawer used to be the whole screen, so a tab at `left: 100%` would hang
off the right edge.

**Left in place, it defeats two of the nine items.** The drawer is now the
screen less the tab's own width, so the tab would sit *inside* the drawer at
x 373 to 393 minus 20, leaving desk visible **beside** the handle for the
drawer's full height. That is the opposite of Dann's "two regions of background
on top and bottom of the paper handle". And `.lip-silhouette` is `left: 100%` on
every display, so the outline would draw in the strip while the tab sat 20 px to
its left: the outline and the tab disagreeing, which is the exact failure item 9
warns about.

**Deleted at `Drawer.svelte:1557`**, with the reasoning in its place. The touch
extension's own override at `Drawer.svelte:1582` **stays**, and its reason is
unchanged and still true: the open tab's outward edge is the viewport's right
edge, so a 44 px extension has to reach back into the drawer.

### 2.2 NOTATION is a `.section`, and the brief's arithmetic does not close

**The brief says NOTATION "sits in the top anchor, which is not a `.section`".
It is a `.section`**, declared in `NotationFields.svelte`. So is METADATA, in
`MetadataFields.svelte`. There are three scoped `.section` rules in the drawer,
not one, and **that is the whole cause of the irregularity**:

| station | own rule | padding | source of the rule |
|---|---|---|---|
| METADATA | none | `6px 0` | `MetadataFields.svelte` |
| NOTATION | 2 px | `6px 0` | `NotationFields.svelte` |
| SOURCE | none | `6px 0 12px` | `RootPanel.svelte` |
| REPERTOIRE | 2 px | `6px 0 12px` | `RootPanel.svelte` |
| ANALYSIS | 2 px | `6px 0 12px` | `RootPanel.svelte` |

**So the fix is 6 px, not 0.** The brief says the bottom padding "leaves with
the body", which lands the three on 22.8 px and 24.8 px against METADATA's 28.8
and NOTATION's 30.8: irregular again, in the other direction. Dann's own words
are the target and they are literal: *"Make them Match Metadata and Notation."*
6 px is that, and it introduces no new value, being this recipe's own top step.

**The brief's 5.8 px is not the difference between any two of these.** The real
differences are 6 px of bottom padding and a 2 px boundary rule.

### 2.3 ANALYSIS has no extra 36 px

**The brief says ANALYSIS shut measures 68.8 and that "something sits below its
header that the other three do not have". Nothing does.** Measured with every
station shut, ANALYSIS is **36.8**, identical to REPERTOIRE, from the identical
recipe: 2 px rule, 6 px, a 16.8 px label, 12 px. It was decomposed rather than
matched to a number, as instructed, and the decomposition shows no extra part.

The nearest real number below ANALYSIS is `.root-panel`'s own
`padding-bottom: 40px`, which sits there because ANALYSIS is last in the scroll.
Measuring ANALYSIS's rule to the next mark down gives 76.8. That is the likeliest
reading behind "the worst offender", and the padding is the column's foot rather
than the station's height, so it is not part of it. **68.8 itself is NOT
ESTABLISHED; see §6 item 2.**

### 2.4 Two anchors in the brief are off by one line

Both are named correctly, so per the brief's own instruction the name was
trusted.

- **`Paper.svelte:65`** is the `{#each}`. `buildProvenanceLegend` is called on
  **`:66`** at the floor, now `:69`.
- **`ScoreUploader.svelte:99`** is the template literal. `const dropPlaceholder`
  opens on **`:98`**.

**Every other numbered anchor in the brief was exact**, including
`RootPanel.svelte:365`, `:369`, `:370`, `RootPanel.svelte:875-888`,
`StationHeader.svelte:108` and `:139`, `Drawer.svelte:113`, `:635`, `:650`,
`:996-997`, `:1020`, `:1021`, `:1025-1026`, `:1046`, `:1052-1054`,
`:1056-1058`, `:1086-1094`, `:1436`, `:1440`, `provenance.ts:59`, `:73`, `:78`,
`:86`, `:105`, `:114`, `i18n.ts:207`, `:301-304`, `:306`, `:321`,
`PageFooter.svelte:58`, `WordStack.svelte:159-161`, `:165-166`, and
`app.css:82-85`.

### 2.5 Fourteen stale citations repaired

This ship shifts `+page.svelte` by one line below `voiceCalibrated`. Thirteen
citations into it, in six files, were repaired **by naming their targets rather
than by writing new numbers**, per CONTRACT §5: `library/types.ts` (two),
`library/library.ts`, `library/driver.ts` (four), `library/library.test.ts`,
and `library/driver.test.ts` (two).

**A fourteenth was already stale before this ship.**
`shane/pacifier/Pacifier.svelte` cited `HeaderBar.svelte:103` and
`Drawer.svelte:587` for a `user-select` house form. HeaderBar's rule is at
`:93`, and **`Drawer.svelte` carries no `user-select` at all**, at `:587` or
anywhere else. Repaired by naming, and the correction recorded in the comment.

---

## 3. Measurements

Every number below is read off the running app at `localhost:5173`. Each was
preceded by a stated expectation and a named failure mode.

### 3.1 Instrument check, and one false alarm

**A stale `bind:clientHeight` after a synthetic window resize made the notch and
the tab appear to disagree by 40 px.** The silhouette redraws from
`drawerHeight`, and the harness's `resize_window` does not always flush the
observer before the next read. It corrects on reload. **Pre-existing, not this
ship's, and not a defect on a real display**, where a viewport change is a real
layout change. Every geometry below was taken after a clean load.

Two strip readings were also taken while the drawer was mid-slide and discarded.
The 400 ms transition has to finish before `elementFromPoint` means anything.

### 3.2 The handle, desktop, 1280 × 800

| | value |
|---|---|
| tab | x 520, y 348, **20 × 152** |
| tab centre | y **424** |
| chevron centre | y **424** |
| outline notch | y 348 to 500, height **152**, centre **424** |

**The notch matches the tab exactly.** The chevron is centred by
`align-items: center` alone; no second rule was added.

The `<aside>`'s inline style reads `--lip-w: 20px; --lip-h: 152px; width:
520px`, so both numbers reach the stylesheet from the JS constants rather than
from CSS fallbacks. The wiring is real, not a coincidence of equal defaults.

### 3.3 The acquired target box, before and after

| pointer | before | after |
|---|---|---|
| fine | 20 × 76 | **20 × 152** |
| coarse | 44 × 88 | **44 × 152** |

Measured after: on the desktop `pointer: coarse` is false and `::before`
computes `content: none`, so the acquired box is the tab itself, 20 × 152. On
the emulated phone `::before` computes 44 px × 152 px, `right: 0`, reaching back
into the drawer and entirely on-screen. Before is read from the tree at the
floor: `LIP_H = 76`, `height: 76px`, `::before` 44 × 88.

**This matches the brief's stated expectation exactly.**

### 3.4 The strip, phone, 393 × 852

| | value |
|---|---|
| `pointer: coarse` | true |
| `hover: hover` | **false** |
| drawer width | **373**, the viewport less the 20 px pull |
| tab | x **373 to 393**, filling the strip exactly |
| tab's own background | `rgba(0, 0, 0, 0)` |
| tab border-right, box-shadow, radius | `0px`, `none`, `0px` |

**The painted box is gone, so there is no left edge to see**, which is the thing
Dann named.

Strip tint, read as the painting element under a point in the strip:

| destination | above the handle | below the handle | token |
|---|---|---|---|
| Transcription | **#D1D7CB** | **#D1D7CB** | `--surround-transcription` |
| Marked score | **#D2CBD7** | **#D2CBD7** | `--surround-marked` |

In both cases the painting element is `.main-content` itself. **Nothing was
painted; the desk is exposed.** On the handle's own rows the topmost element is
the silhouette, which is the tab filling the strip. At 360 the drawer measures
**340**, the same rule.

Learn and Guide take `--surround-learn` and `--surround-guide` by the same
mechanism, as Dann was told.

### 3.5 The hover latch, and the two hex values

Read out of the cascade on the emulated phone, not inferred:

| rule | media | matches |
|---|---|---|
| `.drawer:has(.drawer-lip:hover) .sil-fill { fill: #fff }` | `(hover: hover)` | **false** |
| `.drawer-lip:hover { background: #fff }` | `(hover: hover)` | **false** |
| `.drawer-lip.silhouetted:hover { background: none }` | `(hover: hover)` | **false** |

**No `#fff` rule can fire on a coarse-pointer device.** Sampled before and after
a tap on the handle:

| | before | after |
|---|---|---|
| drawer surface | **#FAF8F5** | **#FAF8F5** |
| tab fill | **#FAF8F5** | **#FAF8F5** |

The tab's own background is transparent in both states; it paints nothing. The
instrument is the computed value, where Dann's original instrument was pixel
sampling of his screenshots.

### 3.6 The shut stations

Every station shut. Rule to rule, in CSS pixels.

**At desk width, 1280 viewport, 520 px drawer:**

| station, shut | before | after |
|---|---|---|
| METADATA | 28.8 | **28.8** |
| NOTATION | 30.8 | **30.8** |
| SOURCE | 34.8 | **28.8** |
| REPERTOIRE | 36.8 | **30.8** |
| ANALYSIS | 36.8 | **30.8** |

Every station is now 6 + 16.8 + 6 = **28.8 px of box**, plus a 2 px rule where
one is drawn. NOTATION, REPERTOIRE, and ANALYSIS draw one; METADATA and SOURCE
do not, because each sits directly under an anchor's own rule. **The 2 px that
remains is a mark on the page, not padding**, and it is already consistent.

**Open, the asymmetry stands unchanged**, confirmed: SOURCE open computes
`padding-top: 6px`, `padding-bottom: 12px`.

**At 393, 373 px drawer:**

| station, shut | before | after |
|---|---|---|
| METADATA | 56 | **56** |
| NOTATION | 58 | **58** |
| SOURCE | 62 | **56** |
| REPERTOIRE | 64 | **58** |
| ANALYSIS | 64 | **58** |

**The scale differs and the regularity is the same.** Every station is
6 + 44 + 6 = **56 px of box**, plus the same 2 px rule. **The label is 44 px
here, not 16.8**, because `StationHeader`'s coarse-pointer rule gives the whole
header row the 44 px touch target. That is the ruled floor and this ship does
not touch it. The before column was measured by putting the 12 px back on the
live elements rather than computed from the after column.

### 3.7 The format line

Line boxes counted with `getClientRects()` on the real element.

**At desk width, 486 px box:**

| | before | after |
|---|---|---|
| English | 1 line | **1 line** |
| French | 2 lines, 38.39 px | **1 line, 19.2 px** |

**Dann's ruling is satisfied where he made it.**

**At 360 × 640, 262 px box:**

| | before | after |
|---|---|---|
| English | 2 lines | **2 lines** |
| French | 3 lines, 57.59 px | **2 lines, 38.39 px** |

**Done-item 7's literal test fails on the tightest phone: the French still
wraps.** It wraps to two lines rather than three, which is the same count as the
English, so **the downward displacement of French against English is gone**,
which is what the ruling was for. One line is not reachable at 262 px: the list
is 78 characters at 12.8 px. **Reported, not solved**, as instructed.

### 3.8 `Print` under the sheet

At 1600 × 900 with the drawer closed, where the 816 px sheet fits its column:

| | left edge |
|---|---|
| desk head pair | **392** |
| sheet, `.paper-page` | **392** |
| `Print` | **392** |

**Flush, all three.** Gap from the sheet's bottom to Print's top: 41.59 px.

At 1280 with the drawer open the desk is only 696 px, so the 816 px sheet
overflows its column by 60 px each side and Print reads 552 against the sheet's
492. **The desk head does exactly the same thing at that width and this predates
the ship.** Print and the pair share one column in every state measured.

Across the four destinations:

| destination | `Print` |
|---|---|
| Transcription | present, `disabled: false` |
| Marked score | present, `disabled: false` |
| Learn | **absent** |
| Guide | **absent** |

`@media print { .sheet-print { display: none } }` is present in the cascade.
`.sheet-print-btn:hover` is inside `(hover: hover)`.

The drawer's row now reads `Clear text`, `Transcribe`, `Export this song`,
`Import a song`. **No `Print`.**

### 3.9 The legend producer

The dictionary would not finish loading in the dev pane, so the producer was
exercised directly against the real module in the running build. Nothing in this
ship touches the dictionary path; see §6 item 4.

| call | result |
|---|---|
| page without a spot word, no map | `inferred` only |
| page without a spot word, **with** the map | `inferred` only |
| page **with** the spot word, English | `yo-restored`, **`spot-reconstitution` / icon `R` / "Spot reconstitution"**, `inferred` |
| page with the spot word, French | `yo-restored`, **« Reconstitution ponctuelle »**, `inferred` |
| page with the spot word, map omitted | `yo-restored`, `inferred` |

**Per-page filtering works**, both languages work, the order puts the sigil
before the warning, and omitting the map reproduces the old behaviour exactly.

---

## 4. The gates

Run twice: after the nine items, and again after the citation repairs, because
two of those are test files.

| gate | baseline | result |
|---|---|---|
| 1 phonology | `216 passed (216)` | **216 passed (216)** |
| 2 dictionary | `235 passed (235)` | **235 passed (235)** |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | **0 errors, 7 warnings, 4 files** |
| 4 web-test | `682 passed (682)` | **682 passed (682)** |
| 5 score-parser | `444 passed \| 5 skipped (449)` | **444 passed, 5 skipped (449)** |

**All five at baseline. No count moved, so nothing needed asking.**

One warning appeared mid-build and was fixed rather than carried:
`.btn-secondary` in `RootPanel.svelte` became unused when Print left. Gate 3's
four files are `InspectorPanel.svelte`, `ReadingPaper.svelte`,
`LearnContent.svelte`, and `+page.svelte`, read from the run. `RootPanel.svelte`
is not among them, so leaving the rule would have made gate 3 read eight
warnings in five files.

---

## 5. Decisions this brief did not rule

1. **`Print` takes the pair's idiom, in the pair's column.** Hairline ink box,
   4 px radius, transparent fill, `0.7rem` uppercase at `600` and `0.1em`, and
   `0.3rem 0.7rem` of padding. Every value is `.pair` and `.pair-member` from
   `DeskHead.svelte`, so no new vocabulary enters. **It is not drawn as a card:**
   the cream fill is how the pair says which document you are looking at, and
   Print is an act rather than a place. Dann's words settle it: *"Visually it can
   parallel the Transcription button above the WYSIWYG."*
2. **`Print` takes the pair's box on a coarse pointer too**, which is under the
   44 px floor, exactly as its twin `TRANSCRIPTION` is. Giving Print a floor its
   twin does not have would stop it paralleling the twin, which is the thing
   Dann ruled. **No new touch-geometry exemption is created, and none is
   removed.**
3. **`.output-row` keeps `repeat(3, 1fr)`.** The cell that used to wrap to a
   second row now takes the column Print left empty, so it is two buttons on one
   row with one song and three with more. Narrowing to two columns is a separate
   ruling.
4. **The spot sigil sorts before `inferred`**, keeping "inferred last (the
   warning state)".
5. **`LEGEND_DISPLAY_ORDER` is derived from `LEGEND_ORDER`** rather than written
   as a second list, so the two cannot drift.
6. **The strip's gap under the sheet is `0.6rem` on the desk and
   `--portrait-gutter` on the phone**, which is the desk head's own gap to the
   sheet spent on the other side of it.
7. **`.drawer-lip:hover` is guarded rather than deleted**, though `silhouetted`
   being unconditional already makes it dead on specificity. Deleting the tab's
   painted hover is a separate ruling.
8. **`.sheet-print-btn:hover` was written with its guard**, not added to §1.5's
   list, because it is new code rather than an existing rule.

---

## 6. NOT ESTABLISHED

**NOT ESTABLISHED BEATS A COMPLETE INVENTED ANSWER.**

1. **Whether a 152 px handle reads as too much of a 640 px phone.** Dann ruled
   the height. **Settled by:** his walk. If it looks wrong it is one number,
   `LIP_H` at `Drawer.svelte:127`, and the tab, the outline, and the touch
   extension all follow it now.
2. **Where the brief's 68.8 px for shut ANALYSIS came from.** It is not
   reproducible: ANALYSIS measures 36.8 before the change, identical to
   REPERTOIRE, and 76.8 if measured to the next mark below including
   `.root-panel`'s 40 px foot. **Settled by:** the screenshot the brief measured
   off, or Dann re-measuring on the deploy.
3. **Whether the French format line at 360 × 640 is acceptable at two lines.**
   One line is not reachable in a 262 px box. **Settled by:** Dann on the walk.
   Shortening the list or the phone's gutter would both be new rulings.
4. **Why the dictionary will not finish loading in the dev pane.** It fetches
   the manifest, then requests no shard, with the IndexedDB cache cleared and
   without. All four shard files are present, 171 MB total. **Nothing in this
   ship touches the loader, the dictionary packages, or the data.** Gates 1 and
   2 pass, so the dictionary code itself is sound. **Settled by:** the deploy,
   where the shards are served built rather than through Vite dev.
5. **Whether the rendered `R` legend prints on the page.** The producer is
   measured in §3.9 and the renderer's branch exists at `PageFooter.svelte:58`,
   but §6 item 4 blocked a rendered observation. **Settled by:** Dann transcribing a
   text, spot-reconstituting one word, and printing.

### 6.1 Established, and reported rather than fixed

**The `inferred` question-mark icon never prints on the page.**
`provenance.ts:78` maps `inferred` to `'question'`, and `WordStack.svelte`
excludes `inferred` from its provenance icon span twice, at `:119` and at
`:146`, rendering a `VERIFY` text label at `:193` instead. **So the legend draws
a traced question mark for a glyph that is nowhere on the page.**

This is the mirror of Dann's ruling: a legend entry decoding a mark that is not
there. It is milder than it sounds, because the legend does decode something
present, the word `VERIFY`, just with the wrong mark. `LegendItem.textOnly`
exists for exactly this shape and is what a fix would use. **Not fixed in this
ship**, as instructed.

**The `↺` at `WordStack.svelte:159-161` is still commented out.** Out of scope,
confirmed unchanged.

---

## 7. What is `WRITTEN` and what needs the walk

Nine of nine items are built and measured. **None is `DONE`.**

Dann's walk closes §10 of the brief. Two items need him specifically:

- **Done-item 2**, printing a page and confirming `Print` is absent from it. The
  `@media print` rule is in the cascade; the printed sheet is not observable
  here.
- **Done-item 9**, the rendered `R` legend, blocked by §6 item 4.

Everything else in §10 is measured in §3 above.

---

*Written by Code, 2026-08-21, from the nine rulings Dann made walking
`afc45cb`. Floor `502d571`. Every anchor asserted at write time by a
one-match-or-refuse editor.*
