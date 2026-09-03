# N.108 revision 3 return: the prototype and the six changes

**From:** Claude (design desk). **To:** Dann, and Code. **Date:** 2026-09-02.
Against your rulings on revision 2, `docs/memory/STATE.md` §N.108, all made
2026-09-02. Branch `Shane` pulled; already up to date at `0b4b236`.

Deliverable: **`docs/sessions/n108-drawer-prototype_r2_2026-09-02.html`**. It
works offline, as r1 did. Its toolbar is prototype chrome, not drawer.

**Everything ruled and closed is built and untouched:** the chip-token bands
with white text, the slab on the surround with the groups carrying the drawer
paper, the phone one-at-a-time rule, 20 px, Piece.

**Two things I did that you did not ask for, both in §4, both reversible:** the
drawer head is deleted, and Metadata gives at 1366 only. The first is why 1366
fits at all.

---

## 1. The six changes, with the line

| # | change | where in `n108-drawer-prototype_r2_2026-09-02.html` |
| --- | --- | --- |
| 1 | Transcribe station dissolved; Text holds Notation and Analysis | `:396` the Text group, two stations |
| 1 | Transcribe stays under the intake, the only control of that name | `:381` |
| 1 | word count on the receipt line | `:365`, styled `:195` |
| 1 | Clear on the receipt line, one per kind | `:366` and `:372` |
| 2 | a station opens in place, nothing scrolls itself | `:577` `toggle()`, which contains no `scrollTo` and must not |
| 2 | the one self-scroll, on entry to the ritual | `:602` |
| 2 | the singer's own scroll saved and given back | `:597`, `:599`, `:607` |
| 3 | the takeover, a sibling of the scroll, hiding it | `:479`, hidden by `:135` |
| 3 | the Score markup band across the top | `:481`, styled `:234` |
| 3 | the Back affordance on the band | `:483`, styled `:239` |
| 3 | the 20 px group surface | `.takeover-frame`, `:231` |
| 3 | the same label recipe, on the band and on the station name | `:234` and `.takeover-title` `:242`, used at `:486` |
| 3 | the in-place ritual, cut | nothing to point at; `.ritual`, `.ritual-head`, `.ritual-back` and their rules are gone |
| 4 | 1366 × 768 as a third viewport | `:283`, box `:100`, deck height `:106`, budget `:686` |
| 4 | Metadata gives at 1366 | `:170-172`, the affordance at `:323` |
| 5 | the labelled phone pull | `:544`, styled `:270-271` |
| 6 | contrast readouts out of the bands | the three `.band-ratio` spans are gone; the numbers are at `:709` |

## 2. What each change cost, where it cost something

**(1) The dissolved station.** The receipt line is 44 px tall and 458 px wide
inside a 520 px drawer, and it now carries five things: the kind tag, the
line, the count, Clear, Replace. Design's r1 copy, "Poem received, 24 lines. It
reads in the transcription.", wrapped to two lines once the count and Clear
joined it, so the two receipts stopped matching each other's height. **I cut
the copy to fit**: `24 lines · transcription` and `3 pages · score markup`, both
still marked PLACEHOLDER. What that drops is the sentence form; what it keeps
is how much arrived and which surface reads it. Both receipts are one line
again, measured 45 px each, no overflow.

**(3) Back moved from the left to the right.** Today's takeover puts Back at
the left of its head (`Drawer.svelte:619`). On a band, the left is where the
group's name goes, in all three groups. I kept the name on the left and put
Back on the right, so the band still reads as a band and the way out sits where
the drawer's own way out sat. **This is a desk call and it moves a ratified
affordance.** If you want Back on the left, it is one flex order.

**(3) The lavender rule is gone, and it is stronger for it.** You ruled
2026-08-23 that the takeover's rule matches the lavender `.wizard-phase`
border. The band replaces the rule and it is the Score markup hue, which is
that same lavender family one step down. The ruling survives; the 2 px line
does not, because a 40 px band above the surface does the same work louder.

**(5) The label is vertical.** The pull is 20 px wide and 152 tall, ruled. A
horizontal "DRAWER" cannot go in 20 px, so the label is set with
`writing-mode: vertical-rl` in the drawer's own label recipe: 0.7rem, 600,
0.12em, uppercase. Measured 17 × 57 inside the 20 × 152 tab, under the chevron,
reading downward, so the eye takes it in the order the ruling writes it. The
desktop tab is unchanged and unlabelled, which is what 2026-08-18 says: the
label is the **mobile** pull's.

## 3. The measured heights, all three viewports

Opening state: every station closed, the intake waiting, nothing toggled.
Measured live in the prototype's readout, not computed by hand.

| viewport | drawer height available | opening state | verdict |
| --- | --- | --- | --- |
| 1400 × 900 | 804 px | **702 px** | fits, **102 px slack** |
| 1366 × 768 | 672 px | **661 px** | fits, **11 px slack** |
| 430 × 932 | 932 px | **734 px** | fits, **198 px slack** |

Available height on desktop is the frame less the 56 px app bar and the deck's
20 + 20 padding. On the phone the drawer is the whole frame.

**The takeover's phases, measured, and none of them scrolls.**

| phase | 1400 | 1366 | phone |
| --- | --- | --- | --- |
| welcome | 211 | 211 | 211 |
| readiness | 329 | 329 | 353 |
| capture | 384 | 384 | 408 |
| summary | 519 | 519 | 544 |
| characteristics | 346 | 346 | 346 |
| **the body it sits in** | **764** | **632** | **892** |

Summary is the tallest, as it was in r1, and it clears its box by 113 px at the
tightest viewport. **This is the takeover's own dividend.** In r1's in-place
ritual the same five phases sat under Piece's whole map, and revision 2 measured
the phone at 1 299 px of content in 932, a 367 px scroll to reach the capture
control. The takeover replaces the drawer, so the ritual starts at the top of
its own surface and no phase needs a scroll at all.

## 4. The two things I did that you did not ask for

### The drawer head is deleted

**Metadata alone does not make 1366 fit.** Measured, in this order:

```
opening state, r2 as first built, Metadata on the map      750 px
  available at 1366 x 768                                  672 px
  short by                                                  78 px

Metadata gives (your ruling)                               -41 px  ->  709
  still short by                                             37 px
```

Thirty-seven px is more than any padding I own. What was left that is mine is
r1's **drawer head**: a 48 px row carrying the word "Drawer" and a Close
button, both marked PLACEHOLDER in r1, and **the shipped drawer has neither**.
`Drawer.svelte` has no header row; the pull carries the drawer's name
(`aria-label` from `drawer.pull`, `i18n.ts:46`) and the pull is what collapses
it (`ontogglecollapse` on `.drawer-lip`). So the head was an invention that
duplicated the pull, and deleting it moves the prototype toward the shipped
drawer, not away from it.

```
drawer head deleted                                        -48 px  ->  661
  fits, slack                                               11 px
```

Both were needed. Neither alone is enough: the head alone lands at 702 in 672,
Metadata alone at 709 in 672. It is at `:122`, one comment block, and putting a
head back is one `<div>`.

**Eleven px of slack is thin, and I am telling you rather than dressing it up.**
It will survive a longer status string; it will not survive a second station,
a coarse-pointer 44 px floor on a small laptop, or French, which is longer than
English in every string this drawer has. If you want room at 1366, the next
thing to give is a station, and which station is yours.

### Metadata gives at 1366 only

At 1400 there are 102 px of slack and on the phone 198, so Metadata stays on
the map at both. It leaves only at 1366, where it becomes a **METADATA**
affordance on the Piece band, reversed in the same label recipe, costing no
height because the band is already there. The station body is untouched and
still holds its four fields; the affordance opens it.

**The cost, and it is real:** two desktops now show different maps. A singer on
a 1366 laptop and a singer on a 1400 laptop see a different Piece group, and no
one sentence of documentation describes both. The alternative is to take
Metadata off the map everywhere, which spends a station at a size that has 102
px to spare. I took the minimum spend. **Yours to overturn either way.**

## 5. What did not change

The tokens, the three hues, the white text, the three measured ratios, the slab
and the groups, the divots, the 20 px, the four radii, the 180 ms, the intake's
four states, Replace per line, the phone one-at-a-time rule, the desktop
any-number rule, the station label recipe, the 44 px coarse floor, the 16 px
field floor, English only, and every `i18n.ts` citation r1 carried. The
migration answer of revision 2 §4.4 is unchanged and is still Code's to build.

## 6. What I walked

The file, opened from disk, at all three viewports. Console errors: **none.**

| what I did | what I saw |
| --- | --- |
| opened the file at each viewport | 702 / 804, 661 / 672, 734 / 932, all three "fits" |
| opened Notation and Underlay, scrolled to 150, opened a third station | scroll stayed at **150**, through an open and a close, with the content 276 px over the box |
| opened Notation and Voice, scrolled to 140, pressed Calibrate | takeover on, ritual body at **0**, readout: "held behind the takeover, scroll 140 px" |
| pressed Back | scroll back at **140**, Notation and Voice still open |
| stepped all five phases at all three viewports | every phase inside its box, none scrolling |
| phone: opened Notation, then Underlay | Notation closed itself; one station open, as ruled |
| set the intake to "both received" | two receipt lines, 45 px each, one line each, no overflow |
| 1366: pressed METADATA on the band | the station opened with its four fields |

## 7. NOT ESTABLISHED

- **The real height of the capture phase.** Unchanged from revision 2: the
  Pacifier (`pacifier/Pacifier.svelte`) was not read, and the mock stands in.
  Every phase number in §3 inherits that.
- **The vowel set and its count.** Seven roster rows are drawn; `ALL_VOWELS`
  and `DEFAULT_VOWELS` were not read.
- **`HeaderBar.svelte`'s real height.** 56 px is drawn, and the whole 1366
  budget moves one for one with it. If the real bar is 64, the 11 px slack
  becomes 3.
- **Whether 1366 × 768 is the right second desktop.** You named it and I
  measured it. Nothing in the tree records what a singer actually uses.
- **What the 1366 map should be.** §4 takes the minimum spend and says what it
  costs. Whether two desktops may show different maps is yours.
- **Whether Close is missed.** Deleting the head deletes a Close button that
  the shipped drawer never had. The pull collapses the drawer, so nothing is
  unreachable, but no one has walked the drawer without a Close.
- **Whether Back belongs on the right of the band.** §2. It moves a ratified
  affordance and it is a desk call.
- **The receipt line's real copy.** `24 lines · transcription` is mine and
  terse. The shipped strings for a received poem and a received score do not
  exist yet, and French will be longer.
- **The action key for Transcribe and for Clear.** Still not read, as in
  revision 2.
- **Whether the word count keeps its instrument.** The audited line reads "13
  words in 14 ms". The receipt carries the count and not the timing, because
  the timing did not fit. Whether the singer should still see it, and where, is
  open.
- **What a tap on another station does mid-recording.** The takeover makes it
  moot again, as revision 2 said it would. It returns the day the in-place
  ritual does.
- **Today's `.text-input` and drop-zone fills, borders, and placeholder copy.**
  Unchanged from revision 2: `RootPanel.svelte` was copied, not read to those
  lines.
- **The desk under the drawer when the Score markup document is showing.**
  `--surround-marked` by the four-desks ruling; the prototype still draws only
  the transcription desk.

**NOT ESTABLISHED beats a complete invented answer.**

## 8. Words

**Coined in this revision:** none.

**Carried from revision 2, still mine:** *slab*, the drawer's outer footprint;
*band*, the group header.

**Adopted:** divot, squircle, frame, station, ritual, takeover, receipt line,
map, the three group names (Piece, Text, Score markup), Underlay, and every
`i18n.ts` string named in revision 2 §3.

**Used in a new place, not coined:** *band* now also names the takeover's head,
because it is the Score markup band and not a new object.
