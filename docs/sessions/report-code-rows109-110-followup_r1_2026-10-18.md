# Report: follow-up to rows 109 and 110 (r1, 2026-10-18)

Lane: `cloud-lane-11`, pushed after each step. Headless Chromium 141.0.7390.37, Linux, `pnpm dev` on this tree. Each step is its own commit.

## 1. The Shane merge

`git fetch origin Shane` gave tip `d3adabe`; `git merge origin/Shane` was clean (commit `949f95e`). `git diff --name-only ORIG_HEAD HEAD` outside `docs/` listed nothing, so the merge was docs only.

## 2. Lyrics takes focus over a blank Poem (Dann 2026-10-16 00:36, `OPEN.md:2777`)

`inputViews.land(where, poemBlank)` (`apps/web/src/lib/text/input-views.svelte.ts`): where the content landed in Lyrics, Poem is blank, and Input is showing the Poem, it shows Lyrics, keeping the landing line. It does not switch when Poem holds text, and it does not override a view the singer chose by tapping: `show()` (a tap) records the choice in the per-song session memory, and a first-open default does not, so the memory is the test. The page passes the blank test on the fill line (`+page.svelte`, `inputViews.land('lyrics', doc.publishedPoem.trim() === '')`); `+page.svelte` stays 5643.

- Unit (`input-views.test.ts`, +4): blank Poem switches; Poem holding text does not; a tapped Poem is kept; a landing in Poem moves nothing.
- Phone (`e2e-phone/text-witness.test.ts`, +2): a new song, «Within Four Walls» dropped, `intake-tab-lyrics` selected with no tap and the field not empty; and a Poem the singer tapped stays when the score arrives. Both pass.
- `e2e/singer-paths.test.ts:19`: the extra Lyrics tap is removed; it reads the field as it opens and passes.

## 3. The Guide paragraph

`GuideContent.svelte`: a new `<h4 id="guide-witnesses">` and one paragraph, English and French, directly after the paste paragraph (French at `:36`, English at `:329`), text verbatim from `draft-guide-two-witnesses_r2_2026-10-18.md`, the desk note not applied. The typographic apostrophes are kept, each of the three French colons carries a literal U+00A0 (the file's own habit, checked in the existing French), and the heading's question mark has no space before it. **One departure from literal, named:** I set *Ilya* in `<em>` inside the paragraphs, as every other Guide paragraph does and as the draft, being Markdown, cannot show; the headings stay plain, as the others are. The anchor `guide-witnesses` is new in both languages; `guide-anchors`, `i18n`, `no-fit-name`, `french-italics`, `ratified-lines`, and `approval` tests pass.

## 4. The whole Playwright suite, on the final tree

- `--project=chromium`: **71 passed, 2 failed, of 73.** The two are the known ones: `e2e/insights-page.test.ts:95` and `e2e/singer-paths.test.ts:169`. **No failure beyond them.**
- `--project=phone`: **17 passed, 1 skipped, 0 failed.** The skipped test is the loupe scan, as in earlier reports.

## 5. The eight gates

| Gate | Before (after row 110) | After |
|---|---|---|
| phonology | 267 | 267 |
| dictionary | 248 | 248 |
| web-check | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files |
| web-test | 2760 | 2764 (+4, the unit tests above) |
| score-parser | 709 passed, 5 skipped | 709 passed, 5 skipped |
| blurb | 145 | 145 |
| integration | 55 | 55 |
| ratchets | OK (`+page.svelte` 5643) | OK (5643) |

## 6. What I could not establish

- WebKit and Firefox: nothing here runs them.
- The Guide's rendered French and English in a browser: the text is in the tree and the string-level tests pass, but I did not open the Guide and read the new section on a page.
- Whether the « sauge » coinage and the English line the desk flagged read as Dann wants: both are verbatim as ratified, and not mine to judge.
- The two known failures were not re-run on a pristine tree here; "known" rests on the earlier reports.
