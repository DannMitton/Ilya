# Brief for Code on the Mac: set 3's four songs below 95, opened and diagnosed (r1, 2026-10-11)

Written by the desk (Opus) 2026-10-11 about 19:40. QUEUE row 77. For Code on Dann's Mac, Opus (the model row 61 used for the same work). **Dann opened S, T, V, and X for diagnosis at 19:33:** *"yes, open those four songs to find out why they scored low"*. The other six (Q, R, U, W, Y, Z) stay unopened. Same shape as row 61 (`brief-code-the-four-below_r1_2026-10-09.md`, read whole), with the changes below.

## 1. What was observed

Row 76 (`report-code-the-final-test-set3_r1_2026-10-11.md`, read whole by the desk) scored held-out set 3 at 93.8 BELOW at `8e74f39`, headless Chrome on WebGPU, the deployed alias. Four lines below 95, verbatim:

```
S: webgpu; 115 of 116 right; missing 0; extra 32; pitch misreads 0; length misreads 1; bars read 86 of 86; octave shift 0; metre as printed 64 of 64 bars (22 bars with no matched note or rest not judged); score 71.6 BELOW; with 8 notes marked UNSURE set aside 70.4 BELOW
T: webgpu; 196 of 197 right; missing 0; extra 14; pitch misreads 0; length misreads 1; bars read 80 of 80; octave shift 0; metre as printed 61 of 61 bars (19 bars with no matched note or rest not judged); score 92.4 BELOW; with 8 notes marked UNSURE set aside 92.1 BELOW
V: webgpu; 123 of 130 right; missing 0; extra 0; pitch misreads 0; length misreads 7; bars read 31 of 31; octave shift 0; metre as printed 20 of 20 bars (11 bars with no matched note or rest not judged); score 94.6 BELOW; with 1 note marked UNSURE set aside 94.6 BELOW
X: webgpu; 122 of 144 right; missing 0; extra 0; pitch misreads 6; length misreads 16; bars read 35 of 35; octave shift 0; metre as printed 25 of 29 bars (6 bars with no matched note or rest not judged); score 84.7 BELOW; no note marked UNSURE
```

## 2. What is established, and what are leads

- Letters map to `~/Downloads/_desk-heldout3-private/truth/*.pdf` in the order the glob returns them, Q to Z (row 76's brief, step 3). S, T, V, X are the 3rd, 4th, 6th, and 8th.
- The truth files are drafts by two helpers, checked for sums and round trips, not proofed by Dann (row 76's brief, "Known before the run").
- **Lead, not established:** 16 of the 17 UNSURE notes sit in S and T, two songs whose voice splits between the Russian and another language's underlay; the truth records the Russian line (row 76's brief). The desk's unchecked reading is that S's 32 and T's 14 extras are the other language's notes. That is for step 2 to settle.
- **Lead, not established:** P (set 2) is held below 95 because homr writes printed duplets as other lengths (`report-code-m-and-p-after-the-metre_r1_2026-10-11.md`, step 4). If X's or V's length misreads share that cause, say so.
- **Lead:** Ilya's own reader already treats two heads of one kind on one stem as one event (QUEUE row 20, Dann's ossia). Whether homr's path does the same is not established.

## 3. Measure before you change anything

1. **Name the four.** Say each song's composer, title, and opus in the report; they are no longer sealed.
2. **Check the truth against the page first**, for every bar the scorer marks extra, misread, or missing. Where the truth departs from the print, record the bar, what the page prints, and what the truth says. Do not edit a truth file: write `*.truth.corrected.json` beside the original and score against both.
3. **For S and T, say where every extra note comes from**: which staff, which system, which page, and whether it belongs to the other language's underlay, a small-print line, a cue, or the piano. **DESK DEFAULT on the scoring rule, his to overrule:** the song a Russian singer sings is the Russian underlay's line; notes printed only for the other language's text are not the song. Where the print gives both languages one line of notes, there is nothing to separate.
4. **Diagnose the reader's faults bar by bar.** For V and X, why each length and pitch misread happens, and the four bars of X whose metre is not as printed. Tie every cause to a file and line in `third_party/homr-web/` or `apps/web/src/lib/` read this session. Where a cause matches a fault already fixed (rows 49, 53, 57, 61, 74), say which and why the fix did not reach this page.

## 4. The rulings this serves

- THE ONE THING (`docs/memory/STATE.md`): at least 95 of every 100 printed notes on unseen songs, on the singer's path.
- Dann 2026-10-04 22:27 (`CONTRACT.md`): the need is a scan in, a melody out, IPA under it and Russian under that.
- Dann 2026-10-02 15:55 (`CONTRACT.md` §5): a page that differs from expectation is never wrong; a reading that differs from the print is Ilya's misread.

## 5. Constraints

- **Fix only what is general.** A fix stays only if (a) it is a rule about notation, not about these four songs; (b) the 17 build songs and A, B, C, E, F read byte for byte as before (`cmp`), or better with each change listed; (c) K, L, M, P and G, H, I, J, N, O score no lower than row 74's lines; and (d) the six set-3 passes Q, R, U, W, Y, Z read byte for byte as before, checked by script without opening them: print only "same" or "changed" per letter. A fix that fails any of the four is taken out and described instead.
- Do not open Q, R, U, W, Y, or Z, their truth, or `keep`. Do not list the private folder.
- No git command that writes. Do not change the scorer or `final-line.ts`. Run `final-line.ts` under `tsx`, as row 76 did.
- Any new file under `apps/` or `third_party/` is listed so Dann can `git add` it before the ship. If a fix touches homr-web, bump its version past `0.2.0-ilya.6` and say so.
- Stop and report if a fix needs a change to `VocalLineEvent` or `apps/web/src/lib/score/reconciliation/` (`CONTRACT.md` §6).
- Do not edit `docs/memory/` except row 77's State in `QUEUE.md`.
- **Displaces:** nothing. The cloud lane's rows 72, 70, 73, 68, 75, 62, 67, 71 run beside it and stay out of `third_party/homr-web/` and `apps/web/src/lib/omr/`.

## 6. Done when

- Each of the four has a named cause for every extra and every misread, or NOT ESTABLISHED against it.
- Before and after lines for S, T, V, X against the original and the corrected truth.
- The regression checks of section 5 printed in full.
- All eight gates at baseline, or each moved number named with the tests that moved it.
- `WRITTEN` on the code. Any fix kept means set 3 is spent as a verdict; the desk then makes held-out set 4.

## 7. Report back

`docs/sessions/report-code-set3-four-below_r1_2026-10-11.md`: the four names; per song, the truth check (bar, print, truth), the causes with file and line, the fixes kept and taken out, the before and after lines against both truths; the regression checks; the gates; and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Set QUEUE row 77's State, say so in one line, and stop.
