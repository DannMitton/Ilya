# Night 1: Sunless 3 diagnosed and fixed (r1, 2026-10-06)

> Provenance, added by the desk (Opus): an Opus helper in the desk's cloud workspace, 2026-10-06 overnight, on a clone of `Shane` at `bbe524b`, under `/home/claude/night/brief-night-1.md`. 382,121 tokens, 194 tool uses. The helper's tool policy refused to write this file, so the desk transcribed its final message here, condensed only where marked. Its claims are its own. The desk checked: the md5 of every file delivered into Dann's tree against the clone (`triplets.ts` `9fd9bc36…`, `homr-web-0.2.0-ilya.3.tgz` `d0dd3b09…`, `page-pdf.ts` `26bfc904…`, `pnpm-lock.yaml` `503e6ca7…`). One claim is wrong and is corrected here: the helper wrote that the Guide still says homr and homr-web "run unchanged"; the tree at `bbe524b` carries the corrected sentence ratified by Dann 2026-10-05 14:53.

## The instrument
Ilya's own `makeReader` and `joinPages` with the app's `createRecognizer` (homr-web `0.2.0-ilya.2`, model 465), driven by Playwright in headless Chromium 141 on WebAssembly. Scored with `conv.py` then `score.ts` from `measure-checks_r1_2026-10-05`. Before any change it reproduced the iMac: Tchaikovsky 172/174, Sunless 1 94/96, 4 116/116, 5 248/258 (one above the iMac's 247), 6 156/161, 3 143/222.

The kit's pages are `pdftoppm -r 400 -gray` (poppler) renders, byte for byte. Ilya's pdf.js render in Chromium differs in antialiasing (Tchaikovsky 3598 px wide against 3599), so both paths were measured.

## Sunless 3: 79 note differences, by cause (kit path)
| Cause | Notes | Truth bars | Whose |
|---|---|---|---|
| The last system of page 4 never reached Ilya. System 1 adds a third piano staff, homr's `_ensure_same_number_of_staffs` regroups staffs in rows of 3, system 3's voice lands in part 3, and `joinPages` keeps part 1 only | 22 missing (and 9 rests) | 36 to 40 | homr's page and Ilya's join |
| Quarter-note triplets read with no 3 | 39 lengths (and 6 rest lengths) | 16 to 23, 27, 28 | homr |
| Eighth-note triplet runs marked only at their start | 16 lengths | 31, 33 to 35 | homr |
| A sixteenth read as a thirty-second | 1 | 14 | homr |
| A natural on B read as B flat | 1 pitch | 14 | homr |
| A triplet's printed 3 read as a whole note | 2 extras | 19, 20 | homr |

Code on the Mac reached the same causes independently (`report-code-sunless3-diagnosis_r1_2026-10-06.md`).

## The fix
- **Part A, the port as `0.2.0-ilya.3`:** a printed system is never split between two rows, and each part keeps its place from the top of every system. `third_party/homr-web/src/pipeline/staff-image.ts:229` (`regroupingCutsASystem`), `:189`; `parse-staffs.ts:133` (voices from the largest system). `CHANGES-ilya.md` has an ilya.3 section. Ilya follows: `apps/web/package.json:24`, `pnpm-lock.yaml`, `stamp.ts:17` (a reading stamped ilya.2 is read again), `NOTICES.md:59`. The port's own new test is in the desk's workspace only (`out/port-test/regrouping-ilya3.test.ts`); the tree does not carry the port's `test/` folder.
- **Part B, a triplet check in the join:** `apps/web/src/lib/omr/triplets.ts`, applied in `join-pages.ts:221-232`. Rule 1 (`triplets.ts:175`): a bar with no triplet and no dot whose lengths are exactly one and a half times the metre is read as triplets throughout. Rule 2 (`:179`): in a bar that holds triplets and is too long, the rest become triplets when that, and nothing less, fills the bar exactly. Bars with chords, grace notes, a second voice, or other tuplets are left alone. 9 tests in `triplets.test.ts`.

## Before and after
| Song | Kit path before | after | pdf.js before | after |
|---|---|---|---|---|
| Tchaikovsky | 172/174 | 172/174 | 171/174 | 171/174 |
| Sunless 1 | 94/96 | 94/96 | 94/96 | 94/96 |
| Sunless 4 | 116/116 | 116/116 | 116/116 | 116/116 |
| Sunless 5 | 248/258 | 248/258 | 245/258 | 245/258 |
| Sunless 6 | 156/161 | 156/161 | 155/161 | 155/161 |
| **Sunless 3** | **143/222 (64.41)** | **201/222 (90.54)** | **145/222** | **206/222 (92.79)** |

The five other songs' homr output and joined part are byte for byte the same before and after. Part A alone: 161; Part B alone: 183; both: 201.

Left on Sunless 3: the printed 3 read as a whole note (bars 19, 20); bar 23 too long by 9/16; bar 35's 3/2 written as 2/2; bar 36 triplets marked in part; bar 14.

## Gates
All eight at baseline except web test, 1921 to 1930 (the 9 triplet tests). Ratchets OK on 384 files.

## Not established
How the iMac read Sunless 3's pages; whether pdf.js in Dann's Chrome renders like poppler; WebGPU (no GPU in the cloud; Part A acts on staff geometry before the transformer, which is an inference); whether the triplet rules hold on other music (they were written after seeing Sunless 3; their risk is a printed metre change homr misses); why the port writes one eighth rest fewer than desktop homr in the last bar.

## For ENVIRONMENT.md
The kit's pages are `pdftoppm` renders. A `svelte-kit sync` reloads the dev page and kills a running driver, so gates run between reads. `pgrep -f "vite/bin/vite.js dev"` matched the helper's own shell; use `ps -eo pid,cmd | grep … | grep -v grep` and kill by number.
