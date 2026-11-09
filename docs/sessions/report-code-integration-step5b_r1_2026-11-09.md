# Report: integration step 5b, QUEUE row 159 (the Guide's HEIC licence and patent sentences), 2026-11-09

Branch `cloud-lane-38`, commit `8d9b5c02`. Source text: `docs/sessions/ratified-guide-heic-licences_2026-10-28.md` (ratified by Dann 2026-10-28 15:28). Nothing pushed to `Shane` or `main`; no pull request; `docs/memory/` untouched. **Playwright not run** (it runs once more, after step 7).

## What was done

- **Seated, verbatim**, in the Software paragraph of the Guide's Licences section (`apps/web/src/lib/components/Reading/GuideContent.svelte`), English and French, at the placement the file gives: after the sentence on onnxruntime-web and OpenCV.js and before the Svelte sentence. I located the spot by its words ("OpenCV.js (Apache License 2.0). The interface is built" and « OpenCV.js (licence Apache 2.0). L’interface est construite »), not by the line numbers the file cites (`:591`, `:304`, read at `fb2d2e37`). Each sentence pair sits in its paragraph with one space either side. The text is copied from the ratified file by script, so apostrophes are U+2019 and `<em>Ilya</em>` is as ratified.
- **Pinned in `apps/web/src/lib/insights/ratified-lines.test.ts`**, a new block "ratified Guide lines (row 159, HEIC licences and patents)" (+2 tests: English, French). That file already pins the Guide's other ratified lines (row 123, row 172), so I used it rather than a separate pin file. Each test checks the whole ratified passage with its two neighbouring phrases, so it also pins the placement.

## Gates (baseline on Shane, then this commit)

| Gate | Baseline | Now | Move |
|---|---|---|---|
| 1 phonology | 407 | 435 | +28 (row 157, earlier) |
| 2 dictionary | 248 | 248 | none |
| 3 web check | 0 errors, 12 warnings, 5 files | same | none |
| 4 web unit | 4198, 1 skipped | 4596, 1 skipped (4597) | +398: 396 before this step, +2 now |
| 5 score-parser | 785, 5 skipped | same | none |
| 6 blurb | 148 | 164 | +16 (row 157) |
| 7 integration | 125 | 125 | none |
| 8 ratchets | OK. | OK. | none |

(Run on a clean worktree of this commit.)

## What a singer would now see

The Guide's Licences section, in the Software paragraph, names libheif, libde265, and Kiril Vatev's libheif-js build with their copyright holders under the GNU LGPL version 3, and says that HEVC, the compression inside a HEIC photograph, is covered by patents licensed through pools (Access Advance's HEVC Advance among them) and that Ilya holds no licence from them. English and French.

## What I could not establish

- **That the facts in the ratified sentences are true.** The ratified file itself lists NOT ESTABLISHED items (whether the 1.23 build's notice matches 1.21's; which libde265 release libheif-js 1.23.5 contains; Via LA's pool). I seated the text as ratified and checked none of them.
- **How the paragraph looks on the page.** Not seen in a browser.
