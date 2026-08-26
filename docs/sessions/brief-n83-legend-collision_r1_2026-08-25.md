# Brief: the Fit legend overprints the last system's lyrics

Serves N.83, the Thursday walkthrough. The demo asset must render clean.
Written by the desk 2026-08-25 from a defect Dann observed on the deploy.

## The defect, as observed

On the branch alias (`ilya-git-shane-dannmittons-projects.vercel.app`),
iPhone 14 Pro Max emulation, 932 x 430 landscape, with the engraved
Without Sun song 1 file loaded
(`~/Downloads/Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml`),
page 1 of 2, bottom of the paper: the Fit legend strings
("Captured: you sang it, and it read cleanly." and "Provisional: you sang
it, but it read with less certainty. You can re-take it.",
`apps/web/src/lib/shane/fit-legend.ts:63` and `:67`) print THROUGH the last
system's IPA and Cyrillic lyric lines. The broad-analysis sentence
(`fit.broad.body`, `apps/web/src/lib/i18n.ts:288`) and Footer C render
below, uncollided. The profile's matching voice characteristics were blank
at the time, so Fit was in its broad-analysis state.

## Step 1: measure the cause before writing anything

Reproduce locally with the file above, then answer with `path:line`:

1. What element renders the legend, and what positions it? Absolute,
   anchored to the paper's bottom, or in flow?
2. Does the paper's content height overflow the page at this viewport, or
   do the legend and the last system simply occupy the same y?
3. Is the collision viewport-dependent? Check the same page at a desktop
   viewport and state what you see.

Report the cause in the return memo even if the fix is obvious.

## Step 2: fix what the measurement names

The expected shape: the legend joins the normal flow below the last system
and above the broad-analysis sentence, so it can never overprint notation
or lyrics at any viewport or page count. If the measurement names a
different cause, fix that cause instead.

If, and only if, the measurement proves the page genuinely lacks height,
STOP and report. Footer C is RATIFIED (Dann, 2026-08-24, from the rendered
drawings in `docs/sessions/footer-options_r1`). Do not touch the footer.
The desk brings that measurement to Dann and the ruling gets amended or
not; that is not Code's call.

## Constraints

- Drawer manipulates, page displays and prints. No control lands on the
  paper.
- Do not change `VocalLineEvent`. Do not rebuild anything in
  `apps/web/src/lib/shane/reconciliation/`.
- Verify the rendered result, not the source: after the fix, look at the
  bottom of page 1 at 932 x 430 AND at a desktop viewport, and open print
  preview (the walkthrough demonstrates Print).
- Five gates at baseline before handing back. Gate 4 expects 800, gate 5
  expects 461, and `ilya-ship.sh:79-80` already say so. If a legitimate
  test addition moves a baseline, say so in the memo; do not edit the ship
  script silently.
- No commits, no ship. Dann ships with `ilya-ship.sh` after his own walk.

## Return memo format

A short memo: the cause with `path:line`, what changed, gate results, what
you looked at with your own eyes (viewport, page, print preview), and a
section titled "Not established" listing anything you could not establish.
NOT ESTABLISHED beats a complete invented answer.
