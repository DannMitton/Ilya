# Report: row 114 measure, r1, 2026-10-19

Deployment ID unchanged across the run: `dpl_3JVrtoMyWfAJGYyRMcLRSqd8qUcj`.

## Deployment

- Before and after, identical: `dpl_3JVrtoMyWfAJGYyRMcLRSqd8qUcj`, state READY, `aliasError` null, `githubCommitRef` Shane, `githubCommitSha` `ba6f064778a6982260c9d68d5dace02089047fe2`. Checked with Vercel `get_deployment` on `ilya-git-shane-dannmittons-projects.vercel.app`.
- `curl -I` on the alias: HTTP/2 200, no sign-in, both times.
- `git --no-optional-locks ls-remote origin refs/heads/Shane`: `ba6f064778a6982260c9d68d5dace02089047fe2`, both times. No `git diff` was needed.

## Versions

Google Chrome 155.0.8059.80; Playwright 1.58.2 (pnpm store: `playwright@1.58.2`, `playwright-core@1.58.2`); node v24.13.0; tsx v4.23.15.

## Rehearsal (`rehearse.py`), verbatim

```
K: read on webgpu, 1.19 min
K: stamp homr-web@0.2.0-ilya.7/465 (as required)
original: K: webgpu; 133 of 134 right; missing 0; extra 0; pitch misreads 0; length misreads 1; bars read 51 of 53; octave shift 0; metre as printed 33 of 33 bars (20 bars with no matched note or rest not judged); score 99.3 PASS; with 1 note marked UNSURE set aside 100.0 PASS
corrected: K: webgpu; 134 of 134 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 51 of 53; octave shift 0; metre as printed 33 of 33 bars (20 bars with no matched note or rest not judged); score 100.0 PASS; with 1 note marked UNSURE set aside 100.0 PASS
M: read on webgpu, 0.78 min
M: stamp homr-web@0.2.0-ilya.7/465 (as required)
original: M: webgpu; 62 of 62 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 26 of 26; octave shift 0; metre as printed 19 of 19 bars (7 bars with no matched note or rest not judged); score 100.0 PASS; no note marked UNSURE
corrected: M: webgpu; 62 of 62 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 26 of 26; octave shift 0; metre as printed 19 of 19 bars (7 bars with no matched note or rest not judged); score 100.0 PASS; no note marked UNSURE
rehearsal lines equal row 76: yes
```

No drop refused; stamps as required. The script itself reports the lines equal to row 76's; I did not compare them to row 76 by hand.

## The four songs (`songs.py`), verbatim

```
song1: read on webgpu, 0.72 min
song1: stamp homr-web@0.2.0-ilya.7/465 (as required)
song1: webgpu; 122 of 126 right; missing 0; extra 1; pitch misreads 0; length misreads 4; bars read 28 of 31; octave shift 0; metre as printed NOT SCORED (the truth carries no figures); score 96.0 PASS; no note marked UNSURE
song1 markings: slurStart 27 of 28 kept, 1 extra; slurStop 28 of 28 kept, 2 extra; accent 7 of 10 kept, 0 extra; fermata 4 of 4 kept, 0 extra; all 66 of 70 kept, 3 extra
song2: read on webgpu, 1.35 min
song2: stamp homr-web@0.2.0-ilya.7/465 (as required)
song2: webgpu; 197 of 197 right; missing 0; extra 6; pitch misreads 0; length misreads 0; bars read 109 of 109; octave shift 0; metre as printed NOT SCORED (the truth carries no figures); score 97.0 PASS; no note marked UNSURE
song2 markings: slurStart 6 of 6 kept, 0 extra; slurStop 6 of 6 kept, 0 extra; accent 3 of 3 kept, 0 extra; tenuto 0 of 3 kept, 0 extra; all 15 of 18 kept, 0 extra
song2: 6 extra notes fall in the 5 ossia bars; without them the score is 100.0
song3: read on webgpu, 1.72 min
song3: stamp homr-web@0.2.0-ilya.7/465 (as required)
song3: webgpu; 60 of 71 right; missing 4; extra 0; pitch misreads 7; length misreads 0; bars read 55 of 55; octave shift 0; metre as printed NOT SCORED (the truth carries no figures); score 84.5 BELOW; with 10 notes marked UNSURE set aside 88.5 BELOW
song3 markings: slurStart 1 of 1 kept, 1 extra; slurStop 1 of 1 kept, 1 extra; all 2 of 2 kept, 2 extra
song4: read on webgpu, 1.44 min
song4: stamp homr-web@0.2.0-ilya.7/465 (as required)
song4: webgpu; 134 of 135 right; missing 0; extra 0; pitch misreads 0; length misreads 1; bars read 48 of 52; octave shift 0; metre as printed NOT SCORED (the truth carries no figures); score 99.3 PASS; no note marked UNSURE
song4 markings: slurStart 11 of 11 kept, 0 extra; slurStop 11 of 11 kept, 0 extra; all 22 of 22 kept, 0 extra
Total of 4 songs: webgpu; 513 of 529 right; missing 4; extra 7; pitch misreads 7; length misreads 5; bars read 240 of 247; score 95.7 PASS; with 10 notes marked UNSURE set aside 96.3 PASS; songs below 95.0 with UNSURE set aside: 1 of 4
all four, markings: fermata 4 of 4 kept, 0 extra; slurStart 45 of 46 kept, 2 extra; slurStop 46 of 46 kept, 3 extra; accent 10 of 13 kept, 0 extra; tenuto 0 of 3 kept, 0 extra
```

## Refusals and load faults

None. All four songs and both rehearsal drops read on webgpu on the first drop, each with a drop line and the required stamp. No `REDROP=1` run was made.

## Could not establish

- Whether the rehearsal lines equal row 76's by my own comparison: only the script's own "equal row 76: yes" is recorded.
- Why song 3 scores below 95 (4 missing, 7 pitch misreads), or any other per-song cause. Not diagnosed, as the brief directs; `keep/`, readings, and scans were not opened.
- Metre, which is not scored on the songs (the truth carries no figures).
- Markings on whole-bar rests, which are not scored.

Nothing tracked was changed, no git command that writes was run, and `docs/memory/` was not edited.
