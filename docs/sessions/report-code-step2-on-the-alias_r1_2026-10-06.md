# Report: step 2 on the deployed alias (r1, 2026-10-06)

Code (Sonnet 5.5), runbook step 2b. Target: `https://ilya-git-shane-dannmittons-projects.vercel.app` (the production build of `bbe524b`; I did not check the deployment's commit, the desk's step says so). Driver: Dann's installed Chrome, headed, `page.bringToFront()` before each run, `document.visibilityState` printed `visible` every time, a fresh profile for each series. Same scripts as step 2, in `docs/sessions/restore-reads-with-homr_r1_2026-10-05/`. Results: `docs/sessions/step2-on-the-alias_r1_2026-10-06/`.

**The alias does not hang in front.** Every read finished and every reload drew the score at once. The 6-minute stall at 00:05 was not reproduced.

## The asked series: fresh drop, then two reloads

| Step | Console `[omr]` line | Time | Metre | Score |
|---|---|---|---|---|
| Drop the Tchaikovsky PDF | `homr read 3 of 3 pages of Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf in 46530 ms on webgpu` | drop to score 49.1 s | 3/8 | 98.28 (80 of 99 bars, 171 of 174 notes) |
| Reload 1 | none (the kept reading) | navigation to score drawn 0.39 s | 3/8 | 98.28 (stored reading, byte for byte the dropped one) |
| Reload 2 | none | 0.28 s | 3/8 | 98.28 |

After the drop the vault held the PDF (319,128 bytes) and the reading (64,771 bytes), stamp `homr-web@0.2.0-ilya.2/465`.

## One more series, because it is Dann's state

A song stored by the old reader (a PDF with page provenance, no reading), made on the alias with `?reader=ilya`, then reloaded without it:

| Step | Console `[omr]` line | Time | Metre | Score |
|---|---|---|---|---|
| Reload 1 | `homr read 3 of 3 pages … in 44662 ms on webgpu` | 46.2 s | 3/8 | 98.28; reading kept with the stamp |
| Reload 2 | none | 0.24 s | 3/8 | not rescored (the stored reading is the one scored at reload 1) |

So on the production build an old-state song restores through homr, reads once (about 46 s here), and is then instant.

## NOT ESTABLISHED

- **Why Dann's own Chrome stalled at 00:05.** Not reproduced. My runs were in front. I did not run any in a hidden window, so "Chrome holds back a hidden window" is neither confirmed nor ruled out by this. His song also has a larger vault than a fresh profile (three scan songs, per the desk's 23:52 count); I did not test the restore with several songs, or his Chrome profile, or a service worker left from an older build.
- **That the alias served `bbe524b`.** I did not read the deployment; the behaviour matches step 2's changes (kept reading, homr on restore).
- **A repeat:** one run of each series.
