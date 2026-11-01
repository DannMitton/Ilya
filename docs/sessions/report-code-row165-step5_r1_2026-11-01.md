# Report: row 165, step 5, the measure (r1, 2026-11-01)

Measured on the live dev build (`PUBLIC_INCLUDE_MARKUP_INSIGHTS=true`, Chromium 1440 px wide, the Sunless no. 1 fixture `sunless-01-engraved.musicxml`, a stored bass voice so INSIGHTS draws, drawer bands open). The measuring script was written for this step; the screenshots and raw numbers are committed under `docs/sessions/row165-step5/`.

## One correction to steps 2 and 4: the badge is 58 percent, not 57

The live measure caught it. At 57 percent the sage badge read **4.48:1** in the browser (the veil's alpha is held in 8 bits), under the 4.5 floor Dann ruled. `HeaderBar.svelte` now ships **58 percent**, and the guard test rounds alpha to 8 bits the way the browser does (I checked it fails at 56). Live badge ratios at 58 percent, identical in English and French: **sage 4.55, lavender 4.86, rose 4.87, cobalt 5.26, slate 7.86.** The ruled 22 percent would have measured 3.49 to 3.97 on four bars. The step 2 and step 4 reports say 57; this report supersedes them on that number.

## What is committed

- `docs/sessions/row165-step5/{en,fr}-{text,markup,insights,guide,learn}.png`: the five destinations at 1440 x 1000, drawer open (Piece is scrolled above the fold on TEXT, MARKUP, and INSIGHTS; the Input and Voice headers are in frame).
- `{en,fr}-{text,markup,insights}-print.png`: the three documents under `emulateMedia('print')`. That is a screenshot of the print stylesheet, **not** a PDF page; the print path itself is guarded by `e2e/print-pages.test.ts`, which I did not run in this step.
- `contrast-live.json`: raw measurements (text colour, composited background, ratio, size, weight), both languages.

## Live contrast table (English; French ratios identical to the hundredth: True)

| Document | Element | Text | Behind it | Ratio | Size / weight | Passes |
|---|---|---|---|---|---|---|
| text | top bar: sigil name | #FFFFFF | #7D9D76 | 3.02 | 22px / 400 | NO (22px, 400 is not large text; ratified by eye) |
| text | top bar: 2026A badge | #FFFFFF | #5C7F54 | 4.55 | 10px / 600 | yes (4.5:1) |
| text | language pill | #FFFFFF | #45693C | 6.29 | 13px / 500 | yes (4.5:1) |
| text | gloss line | #365E2D | #F0EBE0 | 6.32 | 12.8px / 400 | yes (4.5:1) |
| text | drawer header Piece | #1D4BA7 | #B9CBEB | 4.89 | 11.2px / 600 | yes (4.5:1) |
| text | drawer header Input | #365E2D | #C4D3C1 | 4.81 | 11.2px / 600 | yes (4.5:1) |
| text | drawer header Voice | #623F84 | #D4C8E1 | 5.13 | 11.2px / 600 | yes (4.5:1) |
| markup | top bar: sigil name | #FFFFFF | #9F85BC | 3.2 | 22px / 400 | NO (22px, 400 is not large text; ratified by eye) |
| markup | top bar: 2026A badge | #FFFFFF | #8265A0 | 4.86 | 10px / 600 | yes (4.5:1) |
| markup | language pill | #FFFFFF | #6C4D8C | 6.82 | 13px / 500 | yes (4.5:1) |
| insights | top bar: sigil name | #FFFFFF | #AF858E | 3.2 | 22px / 400 | NO (22px, 400 is not large text; ratified by eye) |
| insights | top bar: 2026A badge | #FFFFFF | #916570 | 4.87 | 10px / 600 | yes (4.5:1) |
| insights | language pill | #FFFFFF | #7C4E59 | 6.79 | 13px / 500 | yes (4.5:1) |
| guide | top bar: sigil name | #FFFFFF | #788DB1 | 3.36 | 22px / 400 | NO (22px, 400 is not large text; ratified by eye) |
| guide | top bar: 2026A badge | #FFFFFF | #4A6BAA | 5.26 | 10px / 600 | yes (4.5:1) |
| guide | language pill | #FFFFFF | #2953A6 | 7.29 | 13px / 500 | yes (4.5:1) |
| guide | chapter title | #FDFBF6 | #788DB1 | 3.25 | 40px / 700 | yes (large text, 3:1) |
| guide | band-deck | #FFFFFF | #788DB1 | 3.36 | 18.7px / 700 | yes (large text, 3:1) |
| guide | reading heading h2 (ink) | | | | | NOT MEASURED (no element matched on the live page) |
| guide | reading link | #1D4BA7 | #F0EBE0 | 6.75 | 16.8px / 400 | yes (4.5:1) |
| learn | top bar: sigil name | #FFFFFF | #5B6E80 | 5.27 | 22px / 400 | yes |
| learn | top bar: 2026A badge | #FFFFFF | #3D546A | 7.86 | 10px / 600 | yes (4.5:1) |
| learn | language pill | #FFFFFF | #27425A | 10.43 | 13px / 500 | yes (4.5:1) |
| learn | chapter title | #FDFBF6 | #5B6E80 | 5.09 | 40px / 700 | yes (large text, 3:1) |
| learn | band-deck | #FFFFFF | #5B6E80 | 5.27 | 18.7px / 700 | yes (large text, 3:1) |
| learn | reading heading h2 (ink) | #254057 | #F0EBE0 | 9.06 | 21.6px / 600 | yes (4.5:1) |
| learn | reading link | | | | | NOT MEASURED (no element matched on the live page) |

Reading it:

- **The sigil name fails AA on four bars** (white, 22px, weight 400: 3.02 sage, 3.20 lavender, 3.20 rose, 3.36 cobalt; slate 5.27 passes). Dann ratified it by eye on 2026-10-30 16:08 to 16:22. Not changed, and the guard does not pretend it passes. His call.
- The chapter title (`#fdfbf6`, 40px) is 3.25 on cobalt and 5.09 on slate; it is large text, so it passes 3:1.
- Ink on paper, the gloss line, the Guide link, and the drawer headers (Piece 4.89, Input 4.81, Voice 5.13) clear 4.5.
- Not measured live: the Guide's h2 (my selector matched nothing; the screenshot shows cobalt-ink headings, and the guard pairs cobalt ink on paper at 6.75) and the Learn page's link (none in frame). Those two rest on the guard's token arithmetic, not a live reading.

## What I looked at

TEXT, MARKUP, INSIGHTS, and GUIDE render in their new families (sage, lavender, rose, cobalt); the drawer headers are the light head tints with ink labels; the turning noteheads are visibly smaller, lavender jewel, and stand apart from the black heads (MARKUP screenshot and its print view); the INSIGHTS bar and legend use the rose jewel. I did not review the French pages beyond confirming they render and measure the same. I did not open the LEARN screenshot by eye.

## Things for Dann (collected)

1. **The badge:** 22 percent cannot meet 4.5; 58 percent does.
2. **INSIGHTS "finding" bars:** rose jewel `#7C4E59` and rose ink `#73414E` are 1.19:1 apart, so `Tessituragram`'s cue (finding bar in ink, others in the bar colour) nearly vanishes. The fixture here has 0 bars above the zone, so I could not see it live; look at a piece with findings.
3. **The sigil name** fails AA on four bars (above).
4. **Turning accidentals and ledger lines** stay full size (only the head was ruled 82 percent). NOT ESTABLISHED whether he wants them scaled.
5. **Icons:** `static/icons/*.png` are `#8B9A7D` and `#64705A`, neither the old nor the new sage. NOT ESTABLISHED whether to redraw them.
6. **Pacifier captured outline** 2.28 to 2.14:1 (step 1). `--surround-voice` untouched.
7. **`syntactic-break-unit.test.ts`** (the 20,000-line property test) is a pre-existing near-timeout, not caused by this row: alone it takes 4.5 to 4.9 s against vitest's 5 s default, and `git diff bddc1e27 -- apps/web/src/lib/text` is empty. It failed ("Test timed out in 5000ms") in four of seven full web runs in this session, passing in the rest, and passed at the baseline. When it times out, the web result reads 3742 passed, 1 failed, 1 skipped; when it does not, 3743 passed, 1 skipped (3744). The fix (a longer timeout on that one test) is not mine to make here.
8. Row 163 builds INPUT's active Poem | Lyrics side (`--sage-desk`); in these screenshots it is still the old black-bordered toggle, as expected. The merge with `mac-row163` is the desk's.

No French changes in this row.

## Final gates

web check: found 0 errors and 12 warnings in 5 files. `pnpm ratchets`: ratchets: OK. score-parser: 776 passed, 5 skipped (781) (the baseline 775/780 plus one new test). integration 55 passed, phonology 291 passed, dictionary 248 passed, blurb 145 passed (all unchanged and last run after step 3; nothing since touches them). web test: 3743 passed, 1 skipped (3744) when the timing test passes (baseline 3718 plus 25 new guard tests), see item 7.
