# Report: a piano staff is never read as the voice (r1, 2026-10-08)

Code (Opus 5.5) on Dann's Mac, QUEUE row 49, brief `brief-code-piano-is-not-the-voice_r1_2026-10-08.md`. Run before rows 47 and 48 at Dann's instruction, so the gate 4 baseline is 1997. Tree at `07c7ba2` on `Shane`, clean at the start. No git command that writes was run. Nothing is staged or committed.

## What the singer sees now

On Grechaninov op. 20 no. 4 and Varlamov «Скажи, зачем?», no piano note is drawn as sung any longer: the extra notes go from 38 to 0 and from 22 to 1, and the bars from 70 to 58 (58 printed) and from 37 to 26 (26 printed). The one extra note left in Varlamov is a misread in the voice (bar 16), not the piano. Every one of the 14 build songs reads byte for byte as before. The six unseen songs read 721 of 743 printed notes right, with the same counts of extra notes, pitch misreads, and length misreads as the cloud read of 2026-10-07.

## How it was read

- **The path:** Ilya's own reader, `readScanPages` (`apps/web/src/lib/omr/homr-reader.ts:264`), called from the page in Google Chrome (headless, launched by Playwright 1.58.2, `channel: 'chrome'`) against Ilya's dev server on port 5173. Every read ran on `webgpu`, adapter `apple metal-3` with `shader-f16`. The two songs and the Kabalevsky songs went in as PDFs through Ilya's own `rasterizePdf` (`apps/web/src/lib/reader/page-pdf.ts:143`), as `readScan` does (`apps/web/src/lib/omr/scan.ts:31`). The Tchaikovsky and *Sunless* songs went in as the 400 dpi pages of `resume-kit.tgz`, as on 2026-10-05. The intake UI was not driven.
- **Scoring:** `conv.py` and `score.ts` from `docs/sessions/measure-checks_r1_2026-10-05/scripts/scorer/`, unchanged, under Node 24.13.
- **Instrument check:** the "before" reads of the two songs on this Mac equal the cloud's WebAssembly read of 2026-10-07 in every count (Grechaninov 153 of 154, 38 extra, 1 pitch; Varlamov 61 of 63, 22 extra, 2 length). The build songs' "before" reads equal the 2026-10-05 WebGPU baseline in every count.
- **The diagnosis instrument:** a copy of the port in the scratchpad, with two `globalThis` hooks added to `parseStaffs` that report each page's detected systems and each staff's tokens, run under Node (WebAssembly) on the PNGs that `rasterizePdf` made. Its page 3 of Varlamov differs from the WebGPU page in the XML (character 1414), but the layout it reports explains every bar of the WebGPU reading. The hooks are not in the tree.

## The diagnosis, bar by bar

The page images confirm the desk's pattern with one correction: Varlamov's page 3 first-system voice is not lost. Ilya's bars 20 to 24 are that voice and equal truth bars 20 to 24.

"v" is a single staff and "g" a grand staff (the piano, a brace found); a bar separates the systems homr detected.

| Song, page | What is printed | What homr detected | What the voice took |
|---|---|---|---|
| Grechaninov p. 2 | 3 systems, voice over piano | `v \| g \| v \| g \| v v v` | each system's first staff: v, **g**, v, **g**, v |
| Grechaninov p. 5 | 4 systems, voice over piano | `v g \| v g \| v g \| v \| v v` | v, v, v, v, **v** (piano upper staff) |
| Varlamov p. 2 | 4 systems, voice over piano | `v \| g \| v \| g \| v \| g \| v \| g` | regrouped by 2: v, v, v, v (correct) |
| Varlamov p. 3 | 2 systems, voice over piano, then blank staves after the final double bar | `v v v \| v \| g` | regrouped by 1: v, **v** (piano upper), **v** (piano lower), v; the last g dropped |

- **Grechaninov.** Ilya's bars 5 to 8 are the piano of page 2's first system (the `g` at y 874); bars 14 to 18 the piano of its second system (y 1546). Bars 68 to 70 are the upper piano staff of page 5's last system, whose brace homr did not find; that system's voice, which rests, is bars 65 to 67. So the postlude is not a system with only the piano: the voice staff is printed above it.
- **Varlamov.** Ilya's bars 25 to 29 are the upper piano staff of page 3's first system and bars 30 to 34 its lower staff (octaves such as A♭2 with A♭1). Bars 35 and 36 are the voice of the second system. Bar 37 is the blank voice staff after the final double bar, written by homr as a bar holding only an `<ending type="stop">` bar line.

## The cause

1. homr scored no brace for the piano pair of three systems, so each piano arrived as two single staffs (`third_party/homr-web/src/geometry/braces.ts:289` to `:307`, `findBracesBracketsAndGrandStaffLines`, and `createGrandstaffs` at `:248`). homr also detected the voice of some systems as a system of its own, apart from its piano (Grechaninov p. 2, systems 1 and 2; Varlamov p. 2, every system; Varlamov p. 3, system 2). Why it did not join them is NOT ESTABLISHED.
2. With systems of different shapes, `ensureSameNumberOfStaffsMain` (`third_party/homr-web/src/pipeline/staff-image.ts:178`) regroups by the period of the grand-staff flags (`:187`). On Grechaninov p. 2 (flags F T F T F F F) the best period cuts the last system, so the systems stay as detected (`:189`, `:190`). On Varlamov p. 3 (F F F F T) the best period is 1 with the grand staff trimmed; each row lies inside one system, which `regroupingCutsASystem` allows (`:247`), so the page becomes four one-staff rows (`:197`). On Grechaninov p. 5 the systems stay as detected.
3. `parseStaffs` then gives voice *n* the *n*th staff of every system (`third_party/homr-web/src/pipeline/parse-staffs.ts:242` at `07c7ba2`), with the number of voices the largest system's (`:229`). A lone grand staff, or a piano staff in a one-staff row, becomes the first voice.
4. Ilya keeps homr's first part as the sung line (`apps/web/src/lib/omr/join-pages.ts:315` at `07c7ba2`, `firstPart`), so the piano reaches the singer.
5. Varlamov bar 37: homr writes the blank stretch after the final double bar as a bar, and the join kept it (`join-pages.ts:318` to `:323` at `07c7ba2`).

The other misreads, all in the voice and untouched by this brief:

- **Varlamov bar 16:** the last sixteenth reads F4 where the page prints E♭4. **Bar 17:** a whole-note E♭4 appears in a second voice beside the printed line. The scorer aligns these as 1 extra note and 2 length misreads (truth bar 16 E♭4 sixteenth against a read eighth; truth bar 17 E♭4 eighth against the stray whole). Why the model wrote the whole note is NOT ESTABLISHED.
- **Grechaninov bar 46:** the A double sharp (sounding B4) reads A4. Day 4 found double sharps read as naturals in Kabalevsky no. 9 and named it the model's own.

## The fix

Two rules, each a musician's reading of the page:

1. **A piano whose brace homr did not find is joined into its grand staff.** On a page where a single staff stands directly above a grand staff (a voice over its piano), a system of two or more single staffs and no grand staff has its bottom two merged into one grand staff, as homr merges a pair it finds a brace for. A system with a grand staff directly below it is left alone, because its single staffs are voices over that piano (a duet). Pages with no voice over a grand staff, systems that hold a grand staff, and model 396 read as before. After the merge, homr main's own regrouping matches every printed system on the three pages: Grechaninov p. 2 `vg, vg, vg`; p. 5 `vg` four times; Varlamov p. 3 `vg, vg`.
2. **Blank staves after the final double bar are not a bar.** Bars at the end of the song that come after its last double bar line and hold no note and no rest in homr's own output are left out. A silent bar is kept, because homr writes a silent bar with a rest. A blank bar inside the song is kept.

### Every change

| Where | What |
|---|---|
| `third_party/homr-web/src/pipeline/parse-staffs.ts:170` to `:227` | the new `joinUnbracedPianos` |
| `third_party/homr-web/src/pipeline/parse-staffs.ts:288` to `:292` | `parseStaffs` calls it before `ensureSameNumberOfStaffs` |
| `third_party/homr-web/src/pipeline/parse-staffs.ts:1`, `:14` to `:20` | the file's change line; imports of `DetectionError`, `createMultiStaff`, `mergeStaffs`, `Staff` |
| `apps/web/src/lib/omr/join-pages.ts:312` to `:330` | the new `dropBarsAfterTheEnd` |
| `apps/web/src/lib/omr/join-pages.ts:348` | `joinPages` calls it |
| `apps/web/src/lib/omr/join-pages.ts:41` to `:43` | the header's list of what the join does |
| `apps/web/src/lib/omr/join-pages.test.ts:203` | one new test |
| `apps/web/src/lib/omr/stamp.ts:17` | `HOMR_WEB_VERSION` `0.2.0-ilya.5`, so readings stamped ilya.4 are read again |
| `apps/web/package.json:24`, `apps/web/src/lib/omr/homr-reader.ts:5` to `:6`, `NOTICES.md:59` | version `0.2.0-ilya.5` |
| `third_party/homr-web/package.json:3`, `README.md:3`, `README-ilya.md:5`, `:11` to `:17`, `:37`, `CHANGES-ilya.md:4`, `:62` to `:64`, `:170` to the end | version `0.2.0-ilya.5`, the change recorded with the pages it was found on |
| `third_party/homr-web/homr-web-0.2.0-ilya.5.tgz` | **new, untracked**: the packed port. md5 `bb21cc06e85436e78cf54a35a2e19b4c`, 286,305 bytes |
| `pnpm-lock.yaml` | 6 lines: the ilya.4 file name, integrity, and version replaced by ilya.5's (`sha512-ttL30GFl…`). md5 `4ecf8633d39667654be6af03121298aa`. `pnpm install --frozen-lockfile` accepts it |

How it was packed and installed: the port's full working copy from `~/Downloads/_desk-2026-10-05/homr-web-main-worktree.tgz`, with `src/` and the package files replaced by the tree's, `npm ci`, `npm run build`, `npm pack`, as `README-ilya.md` says. Built from the ilya.4 source the same way, `dist/` equals the ilya.4 package's except `pipeline/parse-staffs.js` and `.d.ts`, so this build matches day 4's. Then `pnpm install` at the root. pnpm 10.29.2 on this Mac also added 18 `libc:` lines for Linux packages; those were left out, so the lockfile is what pnpm wrote less those 18 lines, and carries the homr-web lines only. The ilya.2, ilya.3, and ilya.4 packages stay in `third_party/homr-web/`, as day 4 left them.

**Before shipping, Dann adds `third_party/homr-web/homr-web-0.2.0-ilya.5.tgz` with `git add`** (the ship script refuses on untracked files).

## Tests

- **Port:** `test/pianos-ilya5.test.ts`, 8 tests: the three layouts (Grechaninov p. 2 and p. 5, Varlamov p. 3), the merged staff's extent, a duet left alone, a system holding a grand staff left alone (*Sunless* 3 p. 4), pages with no voice over a grand staff, model 396 unchanged. Kept outside the tree, as day 4's were: `~/Downloads/_desk-2026-10-08/pianos-ilya5.test.ts`, md5 `b3bee3ad61847090f86a3a59e2ea8f86`. The port's whole suite on this Mac: **before** 927 passed, 1 failed, 42 skipped; **after** 935 passed, 1 failed, 42 skipped. The one failure is the same test both times (`vocabulary-cleanup.test.ts`, "writes a float16 [1, 1, 256, 1280] tensor pixel by pixel"): it compares float16 values against raw 16-bit codes, and day 4's run in the cloud passed it (928). Its cause on this Mac is NOT ESTABLISHED; Node 24.13 here against Node 22 in the cloud is the likeliest difference, untested.
- **Ilya:** `join-pages.test.ts`, 1 new test: the blank bar after the double bar is left out; a rest bar after it stays; a blank last bar with no double bar before it stays; a blank bar inside the song stays.

## Gates

From a copy of `ilya-ship.sh` that cannot stage (the untracked package stops the real one). Seven at baseline; **gate 4 moved 1997 to 1998** (the join-pages test).

| Gate | Result |
|---|---|
| 1 phonology | 251 passed (251) |
| 2 dictionary | 235 passed (235) |
| 3 web-check | 0 errors and 12 warnings in 5 files |
| 4 web-test | **1998 passed (1998)**, baseline 1997 |
| 5 score-parser | 650 passed, 5 skipped (655) |
| 6 blurb | 145 passed (145) |
| 7 integration | 55 passed (55) |
| 8 ratchets | OK |

The ship script's gate 4 line is the desk's to move. Rows 47 and 48 have not run, so their counts are not in 1998.

## Before and after

Notes right, of the printed notes. WebGPU on this Mac, one read each.

| Song | Before | After | Missing | Extra | Pitch | Length | Bars read / printed |
|---|---|---|---|---|---|---|---|
| Grechaninov op. 20 no. 4 | 153 of 154 | 153 of 154 | 0 → 0 | **38 → 0** | 1 → 1 | 0 → 0 | **70 → 58** / 58 |
| Varlamov «Скажи, зачем?» | 61 of 63 | 61 of 63 | 0 → 0 | **22 → 1** | 0 → 0 | 2 → 2 | **37 → 26** / 26 |

Bars all right: Grechaninov 54 to 55, Varlamov 22 to 22.

The build songs. Every reading after is byte for byte the reading before, so each count is unchanged.

| Song | Right | Missing | Extra | Pitch | Length | Bars read / printed |
|---|---|---|---|---|---|---|
| Tchaikovsky op. 38 no. 3 | 172 of 174 | 0 | 0 | 2 | 0 | 99 / 99 |
| *Sunless* 1 | 94 of 96 | 0 | 0 | 0 | 2 | 18 / 18 |
| *Sunless* 4 | 116 of 116 | 0 | 0 | 0 | 0 | 29 / 29 |
| *Sunless* 5 | 247 of 258 | 0 | 28 | 8 | 3 | 69 / 61 |
| *Sunless* 6 | 156 of 161 | 0 | 0 | 5 | 0 | 55 / 55 |
| Kabalevsky op. 52 no. 1 | 150 of 152 | 0 | 0 | 1 | 1 | 67 / 67 |
| no. 2 | 93 of 157 | 64 | 0 | 0 | 0 | 41 / 70 |
| no. 3 | 157 of 157 | 0 | 0 | 0 | 0 | 52 / 52 |
| no. 4 | 150 of 151 | 0 | 0 | 1 | 0 | 39 / 39 |
| no. 6 | 153 of 153 | 0 | 0 | 0 | 0 | 37 / 37 |
| no. 7 | 160 of 163 | 0 | 0 | 0 | 3 | 53 / 53 |
| no. 8 | 154 of 154 | 0 | 0 | 0 | 0 | 32 / 32 |
| no. 9 | 143 of 149 | 0 | 0 | 6 | 0 | 39 / 39 |
| no. 10 | 154 of 156 | 0 | 0 | 2 | 0 | 83 / 83 |

The brief asked for the Tchaikovsky and *Sunless*; the Kabalevsky songs were added because nos. 4 and 7 hold the piano-only systems of ilya.4, the nearest layouts to this rule. Kabalevsky PDFs from `~/Documents/Repertoire & Scores/Scores - vocal/`, truth from `tools/e16-harness/output/truth/`. *Sunless* 5's 28 extra notes are the footnote and the ossia (2026-10-05 report); no. 2's scan stops at bar 41 (day 4). The "before" readings were taken with the tree put back for the purpose (HEAD's `join-pages.ts` and the ilya.4 package) and then restored; `md5` of the restored `join-pages.ts` is `31b785027c3ea040219e7f6859009e3e`.

## The six unseen songs

Read once, after the fix was final, by `unseen.sh` in the scratchpad: it globs the scans, leaves out the two opened songs, writes every per-song file into a folder that was never opened, and prints this line, unedited:

```
six unseen songs: 6 of 6 read and scored (webgpu); 721 of 743 printed notes right; missing 0; extra 1; pitch misreads 7; length misreads 15; bars read 148 of 146
```

Before (cloud, WebAssembly, 2026-10-07): 721 of 743 right, 1 extra, 7 pitch, 15 length; bars read 147 of 146, from the per-song lines of `report-heldout-blind-read_r1_2026-10-07.md`.

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **The one bar more on the six unseen songs (147 to 148 read).** The before is WebAssembly in the cloud on ilya.4; the after is WebGPU on this Mac on ilya.5. Neither rule adds a bar (the join rule only removes bars, and the port rule leaves every build song unchanged), but which of the path or the fix moved it is not established without a second read of the six, which the brief does not allow.
- **Whether the rule fires on any of the six unseen songs.** Their counts did not move, so if it fired, no note changed.
- **Why the model wrote a whole-note E♭4 in Varlamov bar 17, and F4 for E♭4 in bar 16.**
- **Why homr scored no brace** for those three piano pairs. The rule repairs the result, not the brace detection.
- **The port's float16 test failure on this Mac.** Present before and after; its cause is not established.
- **A page that holds only the piano** (day 4's open case, "a postlude page would still be read as the voice"). Neither song has such a page: Grechaninov's postlude has the voice staff above it, resting. That page would still read as the voice; the rule needs a single staff over a grand staff on the same page.
- **A duet whose voices homr joins to the piano and whose brace it misses** (one system of four single staffs). The rule would read the top two as voices and the bottom two as the piano, which is right, but no such page was read.
- **Anything through the intake UI, on WebAssembly, or on Dann's iMac.** All reads here are Ilya's reader in headless Chrome on this Mac's WebGPU.
- **Truth.** The two songs' truth files are the cloud helper's drafts by eye, not proofed by Dann.

## Seen, not fixed

- **Grechaninov bar 10, the printed 6/8, is stated as 4/8** in the reading, before and after (the notes add to 6/8). The scorer does not score metres. homr reads only a time signature's lower figure and works out the upper one from the bar lengths (`apps/web/src/lib/omr/join-pages.ts:235` to `:241`).
- **One of the six unseen songs' readings may draw one bar more than printed** (148 of 146 in total); its place is not looked at, by the brief's limits.

## What was looked at, under the strict limits

Opened: the two songs' PDFs, their truth and notes, and the page images Ilya rasterized from them. The six unseen songs: only the one line above. `heldout-out.tgz` was not opened. The scan folder was never listed; the script's glob read it. `report-heldout-blind-read_r1_2026-10-07.md`, which the brief cites, was read whole before the work began; it names the six songs and gives their per-song counts, and those counts were used only for the "bars read" before figure in the six-song section.

The working tree also holds six untracked files in `docs/sessions/` that this session did not write (Design briefs r2 and r3, four Sonnet memos).
