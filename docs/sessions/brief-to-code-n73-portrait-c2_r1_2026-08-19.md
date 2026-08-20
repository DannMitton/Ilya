# Brief to Code: N.73 portrait C2, the marked score's page and the gutter

**Item: N.73 portrait C2. Serves N.45.** Floor `2f14d73`. Two changes. Re-derive
every line number before you edit.

Dann walked portrait C on his iPhone. Transcription is right. Two things follow.

---

## 1. The marked score's page never got the fit

`Paper.svelte` carries the scaler. `VoiceProfilePane.svelte` carries its own
`.paper-page` and was not given one, so on the phone the marked score draws its
page at full size and overflows: the title runs off the sheet and the empty
state sits over it.

**Fix:** give the marked score's page the same fit, by the same mechanism, so
that both Studio documents miniaturize identically. Prefer extracting the scaler
so one implementation serves both over copying it. Say which you did.

Everything portrait C rules applies to this page too: the header block, the
shadow, the colophon, the true 816 by 1056 geometry, no controls on it, and the
print guard that undoes the fit.

## 2. One gutter, used three ways

**Ruled by Dann, 2026-08-19 on the walk.** The desk showing beside the page and
the desk showing above it are the same negative space and take the same value.

- Gutter: **24 px**.
- Page width becomes the viewport width minus twice the gutter. At 375 px that
  is 327 px, against 265.66 px today.
- The same 24 px sits between the desk head and the top of the page.
- The scale factor follows from the width; do not hard-code a percentage.

Declare the gutter once, as a token or a constant, and use it in all three
places. A future change moves one number.

## 3. What you do not build

- No changes to the aid, to landscape, to print, or to the desktop.
- No changes to the drawer or its pull.
- Do not put a control on the paper.
- Do not run `git`. Dann ships.

## 4. Definition of done

Dann's walk, iPhone, portrait:

1. The marked score's page is a letter-proportioned miniature, whole, like the
   transcription's.
2. Both documents show the same gutter left, right, and above the page.
3. The page is visibly larger than it was at `2f14d73`.
4. Print still emits the page at full size, from both documents.

Report the measured page width, the gutter on all three sides, and the aspect
ratio, for both documents.

Run all five gates. Baselines: phonology 216, dictionary 235, web-check 0 errors
and 7 warnings in 4 files, **web-test 682**, score-parser 444 passed and 5
skipped.

Ship with `sh ~/Downloads/ilya-ship.sh "N.73 portrait C2: the marked score's
page, and one gutter"`.

## 5. The memo

`docs/sessions/n73-portrait-c2_r1_2026-08-19.md`, same commit. Short: what
shipped, the measurements, where the tree beat this brief, the gate numbers, and
what Dann must walk.
