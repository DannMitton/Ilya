# Memo: the Fit legend overprinted the last system's lyrics

Returns `brief-n83-legend-collision_r1_2026-08-25.md`. Fixed, gates at
baseline, nothing committed.

## The cause

The legend was drawn out of the flow, in the band the page had already
reserved for the score.

`PageFooter.svelte` renders it as `.provenance-legend`, and before this
change three declarations positioned it: `position: absolute`, `right: 0`,
`bottom: 100%`. `bottom: 100%` anchors it to the footer's top edge, so it
drew above the footer box and contributed nothing to the footer's own
height.

The page reserves for the footer with a constant. `contentBottom` at
`VoiceProfilePane.svelte:342` was `MARGINS.vertical + FOOTER_MAX_HEIGHT +
GAP`, which is `48 + 80 + 8 = 136`, so the score window ended at y 920 on a
1056-tall page. Measured on page 1 of the engraved Sunless no. 1, 816 by
1056, in the state the brief describes:

| what | y range |
|---|---|
| score window | 171 to 920 |
| Fit legend | 867.4 to 899.9 |
| Cyrillic lyric row of the last system | ends at 876 |
| broad-analysis sentence | 907.9 to 934.5 |
| footer box | 907.9 to 1008, height 100.1 |

Two numbers carry the whole answer. The legend's 32.5 px sat wholly inside
the window's band, and the footer measured 100.1 against a reserve of 80,
because the broad-analysis sentence is in the footer's flow and the constant
never counted it either. The legend and the last system occupied the same y
by construction, on every render where the lyrics reached that far down.

Answers to the brief's three questions:

1. `apps/web/src/lib/components/Paper/PageFooter.svelte:49` renders it. It
   was positioned absolute, anchored to the footer's top edge, out of flow.
2. The page does not lack height. The content fits, and the legend and the
   last system simply occupy the same y because nothing budgets for the
   legend. The page went from one score page to two once the legend was
   budgeted, which is pagination doing its job, not the page running out.
3. Not viewport-dependent. At 932 x 430 and at 1440 x 900 the numbers are
   identical: page 816 by 1056, `transform: none`, legend 867.4 to 899.9,
   score window bottom 920. `PageFit` scales the whole sheet and changes
   nothing on it, and `engraving.ts` carries no viewport term.

## What changed

Two files, both edits named in the brief's expected shape.

`apps/web/src/lib/components/Paper/PageFooter.svelte`

- `.provenance-legend` joins the footer's normal flow: the three positioning
  declarations are gone, `margin-bottom: 8px` stays. It lands on the same
  pixels it always did, because the footer is anchored by its bottom edge and
  grows upward. What changes is that its height is now part of the footer's
  height.
- New optional `onheightchange` prop, the seam `TitleHeader` already offers,
  reporting the footer's measured `offsetHeight`.

`apps/web/src/lib/shane/VoiceProfilePane.svelte`

- `contentBottom` becomes `$derived`:
  `MARGINS.vertical + Math.max(FOOTER_MAX_HEIGHT, footerHeight) + GAP`.
  The constant becomes the floor rather than the answer, so a short footer
  reserves exactly what it reserved before and no existing document
  repaginates. Only a footer taller than 80 moves the window.
- Page one reports its height, and only page one. It carries the legend, so
  it is the tallest footer in the document, and one window geometry serves
  every page here by the rule the score pagination already follows.

Footer C is untouched. The colophon, the pagination cell, the hairline and
their type are byte-identical.

After the fix, same file, same page 1:

| what | y |
|---|---|
| score window | 171 to 859 |
| lowest score text | 847.8 |
| footer box, legend included | 867.4 to 1008, height 140.6 |
| clearance between them | 19.6 |

## One consequence to look at

Reserving the legend costs page 1 sixty-one pixels of score, so the demo
asset gains a page. My local render went from `PAGE 1 OF 1` to `PAGE 1 OF 2`;
yours was already at two, so expect three. The systems are unchanged, one
simply moves down. Say if that is not what you want for the walkthrough.

## Gates

All five at baseline. No test added, no baseline moved, `ilya-ship.sh`
untouched.

| gate | expected | got |
|---|---|---|
| 1 phonology | 216 passed (216) | 216 passed (216) |
| 2 dictionary | 235 passed (235) | 235 passed (235) |
| 3 web-check | found 0 errors and 7 warnings in 4 files | same |
| 4 web-test | 800 passed (800) | 800 passed (800) |
| 5 score-parser | 461 passed \| 5 skipped (466) | 461 passed \| 5 skipped (466) |

## What I looked at with my own eyes

Local dev server, the engraved Sunless no. 1 from your Downloads, a seeded
voice with captured and provisional readings and no voice characteristics,
so Fit sat in its broad-analysis state.

- 932 x 430 landscape, page 1, before: the two legend strings printing
  through "я, ночь о - ди - но ка". The defect as you reported it.
- 932 x 430 landscape, page 1, after: the legend below the last system,
  above the broad-analysis sentence, above the colophon. Clear.
- 1440 x 900, page 1 whole, before and after: the same overprint, then the
  same clean result. The two viewports produce identical numbers.
- Print, page 1 bottom: white page, no shadow, legend clear of the lyrics,
  `PAGE 1 OF 2`. I forced every `@media print` block to `all` and looked at
  the rendered page rather than opening the browser's print dialogue, which
  the pane cannot show me.
- The profile-only page, no score loaded: content window 171 to 894, footer
  top 902, gap 8. The legend sits above the hairline, clean.

## Not established

- **Your exact render.** My repro reaches the overprint with a three-entry
  legend, which needs one vowel carrying `noiseFloor: 'unmeasured'` and wraps
  to two rows. With a two-entry legend my local render cleared the Cyrillic
  row by 5.9 px, so I confirmed the mechanism, not your pixels. Anything that
  puts the last system 6 px lower on your machine reproduces it with two
  entries. The band is the same either way: with the two-entry legend it took
  the window's last 34.3 px, with the three-entry legend the last 52.6.
- **Why your run said page 1 of 2 and mine said 1 of 1.** The trailing notes
  page is the likely second sheet, and I did not confirm which of the octave
  notice, the watch band, or the withheld statement fired for you. It does
  not touch page 1's geometry either way.
- **The Transcription document's legend, unseen.** `PageFooter` is shared, so
  Transcribe's legend also moved into flow. Its geometry is unchanged by
  measurement: content window 169 to 920, footer top 942.5, and `TitlePage`
  and `SubsequentPage` do not read the footer height, so they reserve the
  same 136 they always did. The legend lands on the same pixels for the same
  bottom-anchor reason. I could not get a Transcribe provenance legend to
  render in the pane, so I did not look at one.
- **A print artifact I did not touch.** In print the page goes white while
  the renderer's own per-system bands stay `#F0EBE0`, so each system sits on
  a cream stripe. It comes from the SVG, not from the page, it predates this
  change, and it is invisible on screen because the paper is cream. Possibly
  the same family as your open question about colour print going greyscale.
  Left alone.
