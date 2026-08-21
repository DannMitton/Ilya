# Brief to Code: Print leaves the drawer, the handle grows, and a sigil gets its legend

**Serves N.65, plus one item that serves the paper. Written 2026-08-21.
Floor: `befd3f2`, branch `Shane`.**

**Nine items. Dann ruled every one of them walking `afc45cb` on 2026-08-21.**
Nothing here is a design question and nothing here is the desk's invention.

Read `docs/memory/CONTRACT.md` in full first, including tethers 17 and 18.

```
SEQUENCE POSITION
item:        N.65, the drawer's stations, the ship after ship B.
serves:      Nine rulings Dann made walking `afc45cb`: Print leaves the drawer,
             the phone gets the desktop's handle, the handle doubles, and a
             sigil that prints gets decoded.
blocked on:  Nothing.
done when:   §10.
displaces:   N.76, Anatomy of a Transcription, which is numbered and not
             started and is not this ship.
```

**EVERY LINE NUMBER BELOW WAS RE-READ AFTER `afc45cb`.** Ship B moved
`Drawer.svelte`, `RootPanel.svelte`, and `i18n.ts`, so any number you find in an
older document is suspect. **Each anchor here is named as well as numbered.
If a number is wrong, trust the name.**

---

## 0. What you cannot read

You cannot read `claude/`. Every ruling this brief depends on is quoted here
verbatim rather than cited. `docs/memory/STATE.md` is in the repository and you
can read it.

---

## 1. `Print` leaves the drawer for under the sheet, flush left

**Dann's ruling, 2026-08-20 night, on where it goes:** *"Can we take Print out
of the Drawer entirely and install a consistent Print button on the right side
of the Transcription / Score Markup selector on the paper GUI side?"* Then, the
same minute: *"to be clear I dont want a control on the paper. I want it to
float next to the Transcribe / Score Markup selector."*

**AMENDED BY DANN 2026-08-21, and the amendment is what you build.** He walked
the desk head on a phone and found no room: *"On mobile it looks like there is
not enough room to insert a print button where i suggested. what if we add it
under the WYSIWYG flush left? Visually it can parallel the Transcription button
above the WYSIWYG."* The desk put four placements to him with a critique of each
and he chose this one, **knowing it loses the desk head's stickiness.** Build it.

**So: `Print` sits BELOW the sheet, flush with the sheet's LEFT edge**, aligned
in the same column as the `TRANSCRIPTION` half of the pair above the sheet.

**Delete it from the drawer.** `RootPanel.svelte:365` is the `onclick={onprint}`
button, and it is the only `Print` control in the application. The row it leaves
behind is `Export this song` (`:369`) and `Import a song` (`:370`), which stay in
SOURCE exactly as ship B put them. **`Export all songs` keeps its conditional
fourth cell.** Report what the row's gap to the score box measures after the
deletion; ship B left it at 6.00 px between siblings.

**IT IS ALWAYS LIVE ON TRANSCRIPTION AND MARKED SCORE.** No disabled state, no
greying.

**IT DOES NOT APPEAR ON LEARN OR GUIDE. RULED BY DANN 2026-08-21**, reversing his
own "always live on all four" of the night before: *"we will simply not offer a
Print button for the Learn or Guide sections."* A singer can still print those
pages from the browser's own menu; Ilya just does not invite it.

**IT IS CHROME, SO IT HIDES AT PRINT.** `DeskHead.svelte` already hides itself
under `@media print` with the reasoning *"The desk head is chrome. The page
prints; the desk does not."* Do the same here. **CONTRACT §6's "do not put a
control on the paper" governs the SHEET. Below the sheet is the desk.**

**NOT ESTABLISHED and yours to settle:** whether `Print` under the sheet should
match the pair's idiom (hairline box, same height) or the action buttons' idiom.
Dann said "visually it can parallel the Transcription button," which the desk
reads as the pair's idiom in the pair's column. **Say which you built and why.**

## 2. The silhouette renders on the phone

Dann sent a picture of the desktop handle and wrote: *"This is the appearance I
want on mobile."* On the phone today he gets a painted box instead, and he
called it out by what he could see: *"I can see the left edge of the paper
handle (tab)."*

- **`Drawer.svelte:635`**, `{#if !isMobile && silhouette}`. Drop the
  `!isMobile &&`.
- **`Drawer.svelte:650`**, `class:silhouetted={!isMobile}`. Make it
  unconditional. That stops `.drawer-lip` painting its own background, hairline,
  radius, and shadow, which is the left edge he can see. **The box itself stays,
  and with it the touch target, the chevron, the focus ring, and the press.**
- **`Drawer.svelte:1436`, `filter: none` in the phone block, STAYS.** That
  exclusion is about the drop shadow, not the outline, and its reason holds: a
  full-screen filter would rasterize on every frame of the 400 ms slide.
  **He gets the silhouette without the lift.**

The comment at `Drawer.svelte:1046` that justified the exclusion reads *"The
phone keeps the painted tab, because there is no silhouette there to belong
to,"* which is circular. **Replace it rather than leave it.**

## 3. A desk strip at the drawer's right edge on the phone

**Dann's ruling, 2026-08-21:** *"I believe we need two regions of background on
top and bottom of the paper handle for the Drawer."* And his reason: *"It is a
waste of screen real estate which is why I had you cut the tab's width in half
in earlier revisions. Less waste this way, but on mobile the illusion is that
there is always a right-screen paper GUI waiting just offscreen."*

**The strip's width is the pull's protrusion, read from the tree rather than
typed:** `.drawer-lip` is `width: 20px` at `Drawer.svelte:1020`, positioned at
`left: 100%`. **The tab fills the strip exactly, so the desk shows above it and
below it and nowhere beside it.** Those two exposures are his two regions.

**`Drawer.svelte:1440`**, the phone's `width: 100% !important`, becomes the
viewport less that protrusion. **Derive it from the pull, do not hard-code 20.**

**THIS AMENDS DANN'S FULL-SCREEN OVERLAY RULING OF 2026-08-19**, which that
block's own comment records. **The motion model is untouched: the drawer still
arrives from the left, one model on every display.**

**Closed, nothing changes.** The overlay still translates off to the left and the
tab still lands at the viewport's left edge, which is how a shut drawer shows a
handle.

**MEASURE AND REPORT, DO NOT SOLVE:** the drawer's content loses that width at
every phone size. **360 x 640 is the tightest, and the score box's watermark
already collides there.** Report the collision rather than shrinking anything.

## 4. The strip takes the destination's tint

**Dann's ruling, 2026-08-21:** *"The background regions will be lavender if the
drawer is pulled from the Score Markup GUI."*

**This should cost nothing.** `app.css:82-85` already carries four desk tints,
and `+page.svelte` paints the desk per destination. **The strip exposes the desk
rather than painting anything**, so it should be `--surround-marked` on Score
Markup and `--surround-transcription` on Transcription for free.

**Two consequences Dann was told about and did not object to:** Learn takes
`--surround-learn` and Guide takes `--surround-guide` by the same rule.

**NO SECOND LAVENDER ENTERS.** If exposing the desk does not work and you have to
paint, paint the existing token and say so in the memo.

**THE TAB ITSELF STAYS CREAM ON EVERY DESTINATION.** That is the tree's existing
ruling near `Drawer.svelte:1011`: *"hue names place, and this control belongs to
the drawer, which is the same drawer on every desk. Ink names state, and the
state is the chevron's direction."*

## 5. The `#fff` hover latch, guarded on BOTH rules

**Dann, on his phone:** *"There seems to be a colour mismatch on mobile between
the Drawer surface and the paper handle. They should appear the same."* Then,
when the desk offered a test instead of an answer: *"I insist that I am seeing
two different colours."*

**MEASURED, by sampling his screenshots pixel by pixel.** The drawer surface is
`#FAF8F5` at every sample. The tab interior is `#FFFFFF` at every sample, in both
the open and the closed state. One hairline pixel at `#F7F5F2` between them and
the shadow at `#DDDCDA` beyond.

**The cause: `.drawer-lip:hover { background: #fff }` at
`Drawer.svelte:1052-1054`, with no hover guard anywhere in the file.**
`grep -n "hover: hover" apps/web/src/lib/components/Drawer/Drawer.svelte`
returns nothing. A tap on iOS latches `:hover` until the next touch elsewhere.
The desktop cannot show it because `.drawer-lip.silhouetted:hover` cancels the
background at `:1056-1058`, and `silhouetted` is true only there today.

**GUARD BOTH RULES, and the second one is the point.**
`.drawer:has(.drawer-lip:hover) .sil-fill { fill: #fff }` at
`Drawer.svelte:996-997` is harmless today only because the silhouette is
desktop-only. **Item 2 lands the silhouette on the phone, at which point that
rule latches the same way and turns the handle's fill white.**

`@media (hover: hover)` on both. **Sweep the rest of `Drawer.svelte` for other
unguarded hovers while you are in there and list what you found**, but do not
change any of them in this ship without saying why.

## 6. The format line drops its lead-in, and keeps its « ou »

**Dann's ruling, 2026-08-21:** *"If we remove 'Acceptés maintenant :/ Accepted
now:' we let the remaining French shrink to a single line and it stops the
downward displacement of elements in French. I think it's understood that the
file names are the acceptable formats."*

The line is `upload.drop.acceptedNow` at `i18n.ts:321`, rendered as
`<p class="dz-formats">` at `ScoreUploader.svelte:593`. **The lead-in goes in
both languages; the list stays exactly as written.**

**THE « ou » COMES BACK, AND THIS CORRECTS THE DESK, NOT DANN.** The desk told
him the missing conjunction could stay missing, taking the do-nothing. **That was
wrong, and the tree says so at `i18n.ts:301-304`:** *"« ou » CONFIRMED BY DANN
2026-08-20, on his walk of `39d60e0`. The English gained 'or' before the last
item and the French now mirrors it. That is the one word in this string he added
rather than the tree."* **A word Dann added by hand is a ruling, and nothing has
reversed it.** So the line ends `PDF, or photograph` and
`PDF, ou une photographie`, which is the tail of `upload.drop.placeholder`
(`i18n.ts:306`), a string he confirmed himself.

**NO NEW FRENCH IS WRITTEN.** Every word comes from two strings he has ratified.

**No terminal full stop.** Without a lead-in the line is a bare list, not a
sentence. **If Dann wants the stop back it is one character.**

**Do not touch `upload.drop.placeholder`**, which ship B correctly retained as
provenance, and do not touch the score box's own one-sentence placeholder
assembled at `ScoreUploader.svelte:99`.

**RE-MEASURE the French line's wrap at 360 x 640 and report it**, because
stopping the wrap is the whole reason for the ruling.

## 7. A shut station is the same height everywhere

**Dann, on the desktop, with every station shut:** *"the spacing of Notation
Source Repertoire and Analysis all need to be consistent. Right now these
retracted sections are irregularly sized."* Then, naming the direction:
*"I see more padding under Source and Repertoire than Metadata and Notation.
Make them Match Metadata and Notation. Even Analysis, which is the worst
offender."*

**MEASURED off his screenshot, rule to rule, in CSS pixels, at desk width:**

| station, shut | height |
|---|---|
| NOTATION | 27.2 |
| SOURCE | 33.0 |
| REPERTOIRE | 32.6 |
| ANALYSIS | 68.8 |

**THE TARGET IS NOTATION'S.**

**The 5.8 px has a name.** `.section` is `padding: 6px 0 12px` at
`RootPanel.svelte:875-888`. Dann's own ruling set that asymmetry and the comment
above it says why: *"A label belongs to the rule above it, so it stays close. A
body has finished saying its piece, so it gets air before the next rule."*
**A shut station has no body, so the 12 px is air after nothing.** NOTATION does
not show it because it sits in the top anchor, which is not a `.section`.

**THE FIX KEEPS THE RULING RATHER THAN OVERTURNING IT: the bottom padding leaves
with the body**, exactly as `.station-label.tight` at `StationHeader.svelte:139`
already drops the label's own gap when a station shuts. `isTight` at
`StationHeader.svelte:108` already knows which stations are shut. **Open, the
asymmetry stands unchanged.**

**ANALYSIS's extra 36 px is NOT ESTABLISHED.** Something sits below its header
that the other three do not have. **Decompose it and report the parts. Do not
type a number that makes it match.**

**Report all four shut heights after the change, at desk width and at 393.**

## 8. The spot-reconstitution sigil gets its legend

**Dann's ruling, 2026-08-21, and it is a principle rather than a patch:**
*"When a sigil prints to the page it must be decoded with a legend."*

**The `R` sigil prints** at `WordStack.svelte:165-166`, whenever a spot override
inverts the global reconstitution setting for one word. **Nothing produces its
legend item.**

- `PageFooter.svelte:58` already has the branch for
  `item.type === 'spot-reconstitution'`.
- `i18n.ts:207` already has `legend.spot-reconstitution`, "Spot reconstitution"
  and « Reconstitution ponctuelle ».
- **`spot-reconstitution` is in NONE of `provenance.ts`'s three tables:**
  `LEGEND_ORDER` at `:59`, `PROVENANCE_ICONS` at `:73`, `LEGEND_KEYS` at `:86`.
- So `buildProvenanceLegend` at `provenance.ts:105`, called at `Paper.svelte:65`,
  can never emit it.

**The renderer and the copy were built; the producer never was.**

**It is not a stress source**, so it does not simply join `LEGEND_ORDER`. It
comes from the `spotReconstitution` map that already flows
`Paper.svelte` to `SubsequentPage`/`TitlePage` to `VerseLine` to `WordStack`.
**Feed that map into the builder alongside the lines and emit the item when a
word on THAT PAGE carries it**, matching the per-page filtering the other five
already use. **Where it sorts in the legend is yours; say where you put it.**

**THE CLITIC ARROW IS NOT A SIGIL. RULED BY DANN 2026-08-21:** *"the clitic arrow
does not count as a sigil. The clitic arrow is fully explained in the GUIDE
section."* **`provenance.ts:114`'s deliberate clitic skip STAYS. Put his sentence
in that comment so nobody re-opens it.**

**ONE THING TO CHECK, NOT A FINDING.** `provenance.ts:78` maps `inferred` to a
`question` icon, and the desk could not find that glyph rendered in
`WordStack.svelte`; the `inferred` case appears to be carried by the VERIFY label
instead. **If the icon never prints, that is the mirror of Dann's ruling: a
legend entry decoding a mark that is not there. Establish it and report. Do not
fix it in this ship.**

**The `↺` at `WordStack.svelte:159-161` is commented out and does not print.
Out of scope.**

## 9. The paper handle doubles in height

**Dann's ruling, 2026-08-21:** *"Please double the height of the paper handle and
re-centre the chevron within the enlarged paper handle."* His reason, given
after: *"The reason for the enlargement is to increase target size for users on
both desktop and mobile."*

**TWO VALUES MOVE TOGETHER OR THE OUTLINE AND THE TAB DISAGREE:**

- `LIP_H = 76` at `Drawer.svelte:113`, which the silhouette cuts its notch from.
- `height: 76px` at `Drawer.svelte:1021`, which is the tab.

Both go to **152**.

**THE SHAPE DOES NOT CHANGE.** `R = LIP_W * (18 / 56)` at `Drawer.svelte:120`
derives from the WIDTH, so the squircle's two corners are exactly as Dann's
drawing ruled them and only the straight run between them lengthens.

**THE CHEVRON RE-CENTRES BY ITSELF.** `.drawer-lip` is `align-items: center` and
`justify-content: center` at `Drawer.svelte:1025-1026`. **Confirm it rather than
adding a second centring rule.**

**THE TOUCH EXTENSION MUST FOLLOW, AND ITS COMMENT MUST BE REPAIRED.**
`.drawer-lip::before` at `Drawer.svelte:1086-1094` is `44px` by `88px` inside
`@media (pointer: coarse)`, and the comment above it states *"The target is still
44 by 88."* **At 152 that extension covers only the middle, so the top and bottom
32 px of a visibly tappable handle would get 20 px of width instead of 44.** Its
height follows the tab's. **Repair the comment or it lies.**

**REPORT THE ACQUIRED TARGET BOX BEFORE AND AFTER, ON BOTH POINTER TYPES.**
Expected: 20 x 76 and 44 x 88 today; 20 x 152 and 44 x 152 after.

**Check `Drawer.svelte:1396`**, a second `width: 20px`, for a height twin that
needs the same change.

**NOT IN THIS SHIP, and Dann was told:** the `::before` is coarse-only, so a
mouse still meets a 20 px wide edge. Extending it to fine pointers would cost
nothing visible, but open, the tab sits over the paper and an invisible strip
there would swallow clicks meant for the words underneath. **Do not build it.**

---

## 10. Done when

Dann walks these on a deploy.

1. `Print` is gone from the drawer and sits below the sheet, flush with the
   sheet's left edge, on Transcription and Marked Score. **It is absent on Learn
   and Guide.** It is always live where it appears.
2. `Print` does not appear on the printed page. **Print one and confirm.**
3. The phone's handle is the desktop's handle: one outline, no separate box, no
   visible left edge. **A screenshot of each, side by side, in the memo.**
4. A strip of desk shows above and below the handle on the phone, and no strip
   beside it.
5. That strip is lavender on Marked Score and sage on Transcription.
6. Tapping the handle on a phone and then looking at it again shows the tab the
   same colour as the drawer. **Sample both and report the two hex values.**
7. The format line reads without its lead-in, ends `or photograph` and
   `ou une photographie`, and **does not wrap in French at 360 x 640.**
8. NOTATION, SOURCE, REPERTOIRE, and ANALYSIS are the same height shut.
   **Report all four, at desk width and at 393.**
9. A transcription containing at least one spot-reconstituted word prints a
   legend entry for `R` on the page that carries it, in both languages, and a
   page without one does not.
10. The handle measures 152 px tall, the chevron is centred in it, and the
    outline's notch matches the tab exactly on the desktop.
11. The acquired target box is reported before and after on both pointer types.
12. Five gates at baseline: 216, 235, 0 errors and 7 warnings in 4 files, 682,
    444 passed and 5 skipped. **Ask Dann before moving any count.**

---

## The memo

`docs/sessions/handle-print-and-legend_r1_2026-08-21.md`, committed with the
ship.

It carries: what shipped with `path:line`; every place the tree disagreed with
this brief and which you followed; every measurement the done-list asks for; the
gate counts; every decision this brief did not rule, stated as a decision; and
**NOT ESTABLISHED**, with what would settle each.
**NOT ESTABLISHED BEATS A COMPLETE INVENTED ANSWER.**

---

## NOT ESTABLISHED at the time of writing

1. **Which idiom `Print` takes below the sheet.** §1.
2. **What ANALYSIS's extra 36 px is made of.** §7.
3. **Whether the `inferred` question-mark icon ever prints.** §8.
4. **Whether exposing the desk gives the strip its tint for free**, or whether
   the drawer's stacking context means it has to be painted. §4.
5. **Whether a 152 px handle reads as too much of a 640 px phone.** Dann ruled
   the height; if it looks wrong to him on the walk, it is one number.

---
*Written by the coordinating desk, 2026-08-21, from nine rulings Dann made
walking `afc45cb`. Every anchor re-read after that commit.*
