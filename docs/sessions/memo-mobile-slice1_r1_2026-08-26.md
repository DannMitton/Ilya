# Memo: mobile slice 1, portrait renders the true page

For Dann. Branch `Shane`, floor `98bba71`, working tree dirty with exactly
the three modified files named here plus the untracked brief. No commits,
no ship.

## What changed

Three files, all deletions. Nothing was added to the paper, and no
component gained a mobile branch.

- `apps/web/src/lib/shane/VoiceProfilePane.svelte:1212`. The
  `@media (max-width: 767px)` block is gone. It held three rules:
  `.score-page ~ .score-page { display: none }`,
  `.score-page .score-window { display: none }`, and
  `.score-page .rotate-notice { display: block }`. The `.rotate-notice`
  rule that sat under it is gone too. A comment stands in their place
  recording what was deleted and why. **Nothing replaces the block**:
  this document now carries no portrait-only declaration at all, so what a
  phone draws is what the desk draws, scaled by `PageFit`.
- `apps/web/src/lib/shane/VoiceProfilePane.svelte:805`. The
  `<p class="rotate-notice">` element and its `{#if i === 0}` wrapper are
  deleted from the page-1 branch. `PageFooter` is now the article's last
  child, as it is on every other sheet.
- `apps/web/src/lib/i18n.ts:702`. `profile.rotateForScore` and
  `profile.rotateForScoreMarked` are deleted with their two comments,
  English and French. `showWithheld`, which chose between them, is
  untouched and still governs the withheld statement on the notes page.
  Nothing else in the tree referenced either key.
- `docs/memory/INBOX.md:48`. The centred-placement line is struck through
  in place, with a clause saying why. **I did not delete it**, because
  that file's own rule is that an item leaves it only when you rule it
  into the tracker. If you would rather the line were gone, say so and it
  goes.

Untouched, deliberately: `PageFit.svelte`, `Paper.svelte`, `page-config.ts`,
the print rules in either file, the transcription document, `app.html`'s
viewport tag, and every tap handler on the score.

## What I looked at with my own eyes

I drove a headless Chromium against the dev server on `localhost:5173`,
because the in-app browser pane went hidden and froze every async call.
The score is `tools/e16-harness/output/mussorgsky---sunless-06---on-the-river/score.mxl`,
a real Russian song that paginates to two score sheets plus the notes
sheet. No voice is calibrated in the walk, so the notes sheet carries the
withheld statement. Every number below is a measurement, not a reading of
the CSS.

### Portrait, 430 x 932, with the score loaded

The whole engraved page renders. Page 1 is **382 x 494.4 CSS px** at a
uniform scale of **0.468137**, which is `382 / 816`. Six systems, staff,
clef, key signature, IPA underlay, and Cyrillic underlay all drawn, with
the title block above and the colophon below. Page 2 renders whole at the
same size with its running head. Page 3, the notes sheet, follows. Every
system is the renderer's own: `paginateScore` was handed the same
`pageWidth` and `pageHeight` it is handed on the desk, so no system was
re-broken and no second renderer exists.

`document.body.scrollWidth` is 430, so the sheet does not push the desk
sideways.

**Pagination is honest.** The three footers read `Page 1 of 3`,
`Page 2 of 3`, `Page 3 of 3`, and three sheets draw. On the floor commit
the same footers claimed the same three numbers while sheet 2 measured
0 x 0 under `display: none`, so the document was lying about itself.

**The rotate notice is gone from the DOM**, not merely hidden:
`document.querySelectorAll('.rotate-notice').length` is 0.

**The N.83 fix survives.** On page 1 the score window's bottom edge is at
y 546.2 and the footer's top edge is at y 549.9, a 3.7 px gap at scale,
which is 7.9 px on the true page. Working back from the geometry, the
measured footer reserved 90 px, above the `FOOTER_MAX_HEIGHT` floor of 80,
so the measured path is live and not falling through to the constant. It
survives the transform because `PageFooter` measures with
`bind:offsetHeight`, which is a layout number and immune to a CSS scale.

### Landscape, 932 x 430

Unchanged from the floor commit, measured on both. The page is
**816 x 1056**, `transform` is `none`, both score sheets are present, and
the notation draws. The deleted rules lived under a 767 px breakpoint, so
932 never saw them.

### Print preview

**Unchanged.** I took `page.pdf()` at Letter on the floor commit and on
this tree, then compared the extracted text.

- Desk width, 1400 px: the extracted text is **byte-identical** before and
  after, 11,072 bytes, four PDF pages each.
- Phone width, 430 px: identical content after normalizing whitespace, four
  PDF pages each. The only diff `pdftotext -layout` reports is column
  jitter in its own text extraction, with the same syllables in the same
  order.
- After the change, the phone's print artifact and the desk's print
  artifact extract to identical text. The phone prints what the desk
  prints.

The reason the print artifact is unchanged is that Chromium lays print out
against the **paper** width, 816 px at Letter, so `max-width: 767px` never
matched during a real print and the withholding never reached the printed
sheet.

## Gate results, run just now in this terminal

All five at baseline. Nothing in `ilya-ship.sh` was edited, and no
baseline moved.

| gate | expected | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same |
| 4 web-test | `800 passed (800)` | `800 passed (800)` |
| 5 score-parser | `461 passed \| 5 skipped (466)` | same |

`ilya-ship.sh` will refuse until the brief and this memo are tracked or
moved, because it refuses on untracked files anywhere in the repository.

## Two things I found and did not fix

Both predate this slice. I measured each on the floor commit as well as on
this tree, and neither is in the five items the brief ruled.

**1. The desk's Print control sits under the paper on a phone, and it did
before.** `.paper-fit` is a flex item in `.main-content` with the default
`flex-shrink: 1`. Its inline height is correct: 1528 px, which is the
stack's natural 3264 px times the scale. Its measured box is **793.4 px**,
because the flex column shrinks it. Everything after the paper is then
placed as though the stack were 793 px tall, so the **Print** button lands
at y 913.6 while the sheets run to y 1633.2, and `.paper-scale` is
absolutely positioned, so it paints over the button. On the floor commit
the same shrink happens and the same button is covered by the notes sheet,
which ran to y 1123.9. The one-line change would be `flex-shrink: 0` on
`.paper-fit`, which is what `.paper-page` already carries and for the same
reason. It touches both Studio documents, so it is yours to rule, not
mine to slip in.

**2. `Aria or song title` and the formant-profile line are what the score
sheets carry as title and running head.** The walk fed the score through
the uploader without typing metadata, so `scoreTitle` is empty and
`runningHeader` falls back to the profile subtitle. This is the §A.6
deferred behaviour that `VoiceProfilePane.svelte` already names in its own
comment, unchanged by this slice, and visible in every screenshot.

## Not established

- **What iOS Safari does with a width media query while printing.** My
  print evidence is Chromium's, where print lays out against the paper
  width. I could not test Safari on a phone from here. This matters only
  for the floor commit's behaviour, since this tree has no width query on
  this document at all, and after the change there is nothing left for
  either browser to disagree about.
- **Why the score reverted to the empty envelope in three of six baseline
  runs.** On the floor commit, three automated runs showed the score pages
  render and then, six seconds later, the pane back to the envelope page
  reading `Page 1 of 1`. On this tree it held in five of five. I cannot
  explain the asymmetry, and I do not believe a CSS deletion can cause it,
  so I suspect a race in the ingest or restore path that the two trees
  happen to lose differently. It may equally be my harness, which
  dispatches a click on **Continue to analysis** rather than really
  tapping it, because the drawer is off-screen at 430 px. **Worth its own
  look. I did not chase it.**
- **The dense-page case.** The walk used one Mussorgsky song at six systems
  a page. Whether a denser plate stays legible at 0.468 is still the open
  question the design session left open, and one score does not answer it.
- **Whether tap behaviour on the portrait page is right.** The brief keeps
  it exactly as it is, and it is exactly as it was: the delegated
  `data-hit` listener is untouched. I did not test tapping a note on a
  scaled page, because slice 2 owns it.
- **French.** No new French was written. Two French strings were deleted.

## Housekeeping

I copied a score fixture into `apps/web/static/reader/` to feed the
browser and deleted it afterwards. That directory is gitignored and
regenerated by `copy-reader.mjs`. The dev server started for the walk is
still running on port 5173.
