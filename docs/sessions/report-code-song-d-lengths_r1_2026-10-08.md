# Report: song D's lengths, diagnosed (r1, 2026-10-08)

Code (Opus 5.5) on Dann's Mac, QUEUE row 53, brief `brief-code-song-d-lengths_r1_2026-10-08.md`. Song D of row 52 is **Gurilyov (A. Lvov), «Раскаяние», No. 6, for soprano** (P. Jurgenson, 1895, plate 19729), opened by Dann for diagnosis at 15:37. A, B, C, E, and F stayed unseen. No git command that writes was run.

## The result

«Раскаяние» still scores below 95: 90.2, up from 89.5. One rule went in: the collection's title page is no longer read as two bars of the song, which removes the 1 extra note and the 2 extra bars. The 15 length misreads remain. 12 of them are four printed sixteenth-note triplets that homr read with no 3; nothing in homr's output says which 12 of the bar's 16 sixteenths they are, so no rule can recover them. The other 3 come from a bar that a rule 3 change would have repaired. That change made *Sunless* 5 worse, so it was taken back out. Every other song reads byte for byte as before.

## Truth checked against the page

Each bar where the reading and the truth disagree was looked at on Ilya's own 400 dpi render of the page.

| Truth bar | The truth | The page | Verdict |
|---|---|---|---|
| 7 (page 2, system 2, bar 3) | C5 half, eighth rest, B4, A4, B4 eighths | the same | truth right |
| 25 (page 3, system 3, bar 1) | F5 quarter tied to a sixteenth, E5 D5 C5 sixteenths, then four sixteenth triplets (B A G, F♯ A G, B A G, F♮ E D) | the same, each group marked 3; the last D4 is printed with an eighth flag | truth right |

**Truth corrections: none.** In bar 25 the page prints D4, the last note of the fourth group, with an eighth flag. Only the truth's reading (F, E, D as one sixteenth triplet) makes the bar add up to 4/4, and the truth draft names this UNSURE. It is left as the draft has it.

## The causes

1. **The title page read as music: the 1 extra note and the 2 extra bars.** Page 1 is the collection's title page (Романсы и пѣсни сочиненія А. Львова). homr found one staff on it, 30 pixels tall, in the ruled border, and read a C clef, three flats, and a whole-note chord (G3 with E3) followed by a whole rest (traced with the port under Node: one system, one single staff at y 200 to 230). Ilya's reader keeps every page homr answers with music (`apps/web/src/lib/omr/homr-reader.ts:162` at `8f59ba6`, `xmls.push`) and joins them all (`:223`, `joinPages(found.xmls)`), so the title page became bars 1 and 2 of the song.
2. **Truth bar 7: 3 length misreads and 1 rest.** homr read the bar's last eighth (B4) as a quarter: a half, an eighth rest, two eighths, a quarter, one eighth too long. Rule 3 of `triplets.ts` then found exactly one run of three that fills the bar, the rest with B4 and A4, and read it as a triplet (`apps/web/src/lib/omr/triplets.ts:234` to `:238`, `onlyRunsThatFill` at `:160`). The bar then adds up, but three notes are triplets that the page does not print and the B4 is still a quarter.
3. **Truth bar 25: 12 length misreads.** homr wrote all sixteen sixteenths after the tied F5 as plain sixteenths, with no `<time-modification>`, no `<beam>`, and no tuplet anywhere on the page (0 of each in page 3's output). The bar is one quarter too long, which is exactly what 12 sixteenths under 3s account for. The triplet check leaves the bar as homr wrote it: it holds the two grace notes before the last group (`triplets.ts:214`), and even without them there are 15 ways to place four runs of three among the sixteen notes, so rule 3's "exactly one choice" test refuses it (`triplets.ts:178`). Which notes are under the 3s is printed only in the 3s, and homr did not read them.

## The fix, and what was tried and taken out

**Kept: a cover in front of the song is left out.** A page before the first page on which homr found two or more staves, on which it found a single staff, is a cover. A page of a song prints a system of two staves or more (the voice over the piano), and a title page comes before it. A page whose answer does not say how many staves it found is kept, a single staff after the music has begun is kept, and a song printed on single staves throughout is kept whole. `pagesRead` counts the pages of the song without the cover, so the app's console line reads "2 of 3 pages".

**Tried, then taken out: rule 3 refuses when one note read at twice its length would fill the bar.** That repaired truth bar 7 (Gurilyov 138 to 140). It also stopped rule 3 in *Sunless* 5, truth bar 9, a bar of the same shape (one eighth too long, a run of three eighths, a quarter that halving would also fix), where the page does print a triplet and rule 3 was right: *Sunless* 5 went from 246 to 244. Nothing in homr's output tells the two bars apart, so there is no general rule for bar 7 in the reading alone. `triplets.ts` and `triplets.test.ts` were put back to HEAD (`git show`, read only).

### Every change

| Where | What |
|---|---|
| `apps/web/src/lib/omr/homr-reader.ts:98` to `:114` | the new `withoutCovers`, with its reason |
| `apps/web/src/lib/omr/homr-reader.ts:120`, `:176`, `:184`, `:193`, `:195` | each pass records how many staves homr found on each page (`result.staves.length`, or null where the answer does not say) |
| `apps/web/src/lib/omr/homr-reader.ts:243`, `:247`, `:255` | the song is joined from `withoutCovers`, and `pagesRead` counts its pages |
| `apps/web/src/lib/omr/homr-reader.test.ts:10`, `:226` to `:253` | two new tests |

The port does not change, so there is no version bump and no packed `.tgz`. A reading kept with a song before this change keeps its stamp (`homr-web@0.2.0-ilya.5/465`) and is not read again, so a stored «Раскаяние» keeps its title-page bars until it is dropped again.

## Tests

`homr-reader.test.ts`, 2 new: `withoutCovers` on a cover, a single staff after the music, a song on single staves, and a page that does not say; and a read through `makeReader` with a fake recognizer whose first page has one staff and second six, which joins the second alone and reports 1 page read of 2.

## Gates

From the copy of `ilya-ship.sh` that cannot stage. Seven at baseline; **gate 4 moved 1998 to 2000** (the two tests).

| Gate | Result |
|---|---|
| 1 phonology | 251 passed (251) |
| 2 dictionary | 235 passed (235) |
| 3 web-check | 0 errors and 12 warnings in 5 files |
| 4 web-test | **2000 passed (2000)**, baseline 1998 |
| 5 score-parser | 650 passed, 5 skipped (655) |
| 6 blurb | 145 passed (145) |
| 7 integration | 55 passed (55) |
| 8 ratchets | OK |

## Before and after

All through the score drop box (`input[type="file"].hidden-input`, Playwright `setInputFiles`), a fresh browser context per song, the reading taken from the app's library, scored with row 49's `conv.py` and `score.ts`. Headless Google Chrome on this Mac, adapter `apple metal-3` with `shader-f16`; every read took `webgpu`.

- **Before:** the deployed site, `https://ilya-git-shane-dannmittons-projects.vercel.app`, Vercel deployment of `8f59ba6`.
- **After:** the local dev server on port 5173, with this change (a local build, as the brief allows).
- **Files:** the Tchaikovsky is `Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf`. The *Sunless* songs are their pages of `IMSLP113877-PMLP232488-Mussorgsky_-_Without_Sun.pdf` (1 to 2, 9 to 10, 11 to 17, 18 to 23), each made into its own PDF with `pdfseparate` and `pdfunite`. The Kabalevsky songs are Dann's PDFs in `~/Documents/Repertoire & Scores/Scores - vocal/`. These are PDFs dropped as a singer drops them, not row 49's kit pages, so the Tchaikovsky and *Sunless* 5 and 6 counts differ from row 49's (*Sunless* 5's footnote reads differently from the PDF).

Before, unedited:

```
tch: webgpu; 171 of 174 right; missing 0; extra 0; pitch misreads 3; length misreads 0; bars read 99 of 99; score 98.3 PASS
sun1: webgpu; 94 of 96 right; missing 0; extra 0; pitch misreads 0; length misreads 2; bars read 18 of 18; score 97.9 PASS
sun4: webgpu; 116 of 116 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 29 of 29; score 100.0 PASS
sun5: webgpu; 246 of 258 right; missing 1; extra 10; pitch misreads 9; length misreads 2; bars read 64 of 61; score 91.5 BELOW
sun6: webgpu; 155 of 161 right; missing 0; extra 0; pitch misreads 6; length misreads 0; bars read 55 of 55; score 96.3 PASS
k01: webgpu; 150 of 152 right; missing 0; extra 0; pitch misreads 1; length misreads 1; bars read 67 of 67; score 98.7 PASS
k02: webgpu; 93 of 157 right; missing 64; extra 0; pitch misreads 0; length misreads 0; bars read 41 of 70; score 59.2 BELOW
k03: webgpu; 157 of 157 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 52 of 52; score 100.0 PASS
k04: webgpu; 150 of 151 right; missing 0; extra 0; pitch misreads 1; length misreads 0; bars read 39 of 39; score 99.3 PASS
k06: webgpu; 153 of 153 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 37 of 37; score 100.0 PASS
k07: webgpu; 160 of 163 right; missing 0; extra 0; pitch misreads 0; length misreads 3; bars read 53 of 53; score 98.2 PASS
k08: webgpu; 154 of 154 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 32 of 32; score 100.0 PASS
k09: webgpu; 143 of 149 right; missing 0; extra 0; pitch misreads 6; length misreads 0; bars read 39 of 39; score 96.0 PASS
k10: webgpu; 154 of 156 right; missing 0; extra 0; pitch misreads 2; length misreads 0; bars read 83 of 83; score 98.7 PASS
gur: webgpu; 138 of 153 right; missing 0; extra 1; pitch misreads 0; length misreads 15; bars read 33 of 31; score 89.5 BELOW
grech: webgpu; 153 of 154 right; missing 0; extra 0; pitch misreads 1; length misreads 0; bars read 58 of 58; score 99.4 PASS
varl: webgpu; 61 of 63 right; missing 0; extra 1; pitch misreads 0; length misreads 2; bars read 26 of 26; score 95.2 PASS
Total: 2448 of 2567 right; missing 65; extra 12; pitch misreads 29; length misreads 25; bars read 825 of 849; score 94.9
```

After: every line is the same except these two, unedited:

```
gur: webgpu; 138 of 153 right; missing 0; extra 0; pitch misreads 0; length misreads 15; bars read 31 of 31; score 90.2 BELOW
Total: 2448 of 2567 right; missing 65; extra 11; pitch misreads 29; length misreads 25; bars read 823 of 849; score 94.9
```

Every other song's reading after is byte for byte its reading before (`cmp`, 16 of 16). «Раскаяние»'s reading after is its reading before less the two title-page bars; its first bar now states the 4/4 itself, where before the title page's bar did.

With the rule 3 change in as well (taken out), the run differed in *Sunless* 5 (`244 of 258 … length misreads 4 … score 90.7 BELOW`) and in «Раскаяние» (`140 of 153 … length misreads 13 … score 91.5 BELOW`).

## The five unseen songs

Read once, after the fix was final, on the local build, through the drop box, by `five.sh`: it took the five files row 52 had copied as letters into its private folder, wrote every per-song file into a new private folder that was never opened, and printed these lines, unedited:

```
A: webgpu; 67 of 69 right; missing 0; extra 0; pitch misreads 2; length misreads 0; bars read 12 of 12; score 97.1 PASS
B: webgpu; 79 of 79 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 16 of 16; score 100.0 PASS
C: webgpu; 126 of 126 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 17 of 17; score 100.0 PASS
E: webgpu; 230 of 231 right; missing 0; extra 0; pitch misreads 1; length misreads 0; bars read 50 of 50; score 99.6 PASS
F: webgpu; 81 of 85 right; missing 0; extra 0; pitch misreads 4; length misreads 0; bars read 20 of 20; score 95.3 PASS
Total: 583 of 590 right; missing 0; extra 0; pitch misreads 7; length misreads 0; bars read 115 of 115; score 98.8
```

Before: row 52's lines for A, B, C, E, and F, which these equal in every count.

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **A general rule for truth bar 7.** A missed flag and a missed 3 leave the same bar in homr's output; *Sunless* 5 bar 9 is the counter-case. Telling them apart needs the page (the flag or the 3), which the reader does not see.
- **A general rule for truth bar 25.** The four 3s are printed and homr did not read them. Recovering them means reading the tuplet numbers from the image, or homr's model reading them; neither was tried here.
- **Why homr's model reads no 3 in bar 25** when it reads 3s elsewhere (the cloud read of 2026-10-07 found triplets marked on some notes).
- **How the cover rule behaves on a cover whose border homr reads as two staves or more.** It would still be read as music. Only D's title page was looked at.
- **The deployed build of this change.** "After" is the local dev server; the change is not committed or deployed.
- **The rendered staff.** "Drawn" means the score's receipt was visible and a stamped reading was kept, as in row 52.
- **Truth.** «Раскаяние»'s truth is the cloud helper's draft, checked here only in the two bars that disagree.
