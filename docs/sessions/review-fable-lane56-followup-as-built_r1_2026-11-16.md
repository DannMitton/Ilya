# Fable review, lane 56 follow-up as built (cloud-lane-56 at 6fab2ca8), r1, 2026-11-16

Filed verbatim by the desk (Opus 5.5) at 12:3x. Harness count 198,204 tokens, 23 tool uses, 4.2 min; cap told to Dann 300k.

# Review of the lane 56 follow-up (cloud-lane-56 at 6fab2ca8), as built

## Verdict

**MERGE WITH FIXES.** The five fixes do what the desk asked on the lane's fixtures, and each has a test that fails on the old code (fix 5 excepted, which is a time limit). Reading the code finds four defects on the new tap path. The first I confirmed by running the lane's code in memory; the other three are reasoned from the code and not run in a browser.

## Blockers

None.

## Fixes

1. **Two live elements can share one id (confirmed by run).**
   - Cause: `render-score.ts:342-344` marks every later-pass copy of a bar that has no pass-1 copy as live, and `render-seam.ts:45` strips `~v<k>` from each.
   - Result: an ending sung on two later passes yields two sets of identical handles. On the volta fixture altered in memory to three verses with endings "1" and "2, 3", `m4-0-1`, `m4-1-4`, `m4-1-2`, and `m4-3-4` each appear twice, and two systems carry `data-system="4-4"`. Four verses with "1, 3" and "2, 4" give the same.
   - What the singer meets: by-id lookups take the first match (`MarkupPane.svelte:359`, `loupe.ts:66`, `crossing-ring.ts:90`), so a tap on the later copy rings and counts the earlier one.
   - Not affected: endings "1 | 2", "1, 2 | 3", and "1 | 2 | 3" (run, no duplicates).
   - Fix: make only the first such copy live at `render-score.ts:343`, and add a test with a "2, 3" ending.

2. **A tap on a later-pass grace note names an id that does not exist (reasoned, not run).**
   - Cause: a later-pass grace note's id is `<id>~v<k>~g<n>` (`render-score.ts:323`, `grace.ts:28-31`) and it has its own hit rectangle (`grace-draw.ts:136`). The three new strips use `/~v\d+$/`, anchored at the end, so they leave it whole: `MarkupPane.svelte:317`, `+page.svelte:1382`, `TimeSignatureControls.svelte:45`.
   - Result: `+page.svelte:1392-1395` sets the cursor to that id and opens the Loupe. A time-signature control whose nearest note is a later-pass grace binds to it too.
   - Fix: drop the `$` in all three, as `render-seam.ts:45` already does. Add a grace note to one strophic fixture's passage.

3. **A text correction through the live second ending does not reach the page (reasoned, not run).**
   - The live bar's handles carry the source id, so the Loupe opens the source event and a notation correction (pitch, rhythm, meter) edits source bar 4. That part holds by construction: `derivedId` is `${id}~v${k}` (`render-score.ts:60`) and the seam removes exactly that.
   - The page draws that bar from `<id>~v2` channels, built by the fallback path (`melody-pages.ts:85-103`, `:142-147`). Verse 1's channels stay under the bare id (`:138-141`), and nothing maps one to the other.
   - So a syllable, IPA, or pairing correction made there would change verse 1's channel and not what the page prints under the second ending. The follow-up report lists this as not established; the code says it fails.
   - Fix needs a rule: for a live bar whose words are verse 1's own line, draw from verse 1's channels.

4. **`ClefControls.svelte:66` still reads `[data-hit]` only, and fix 4 turned it into a defect.**
   - It clips the clef's tap box so it stops short of the first note (the N.187 comment at `:62-64`).
   - On a system that opens with later-pass notes, no clip is applied. Before fix 4 those notes were inert. Now they take taps, so at phone width the 44 px clef box can take a tap aimed at the first note.
   - Fix: `[data-hit], [data-verse-hit]` at `:66`. No other reader needs the change: `loupe-ink.ts:214` reads staff geometry within `[data-system]` systems, `Loupe.svelte:1133` works on the Loupe's own clone, and the rest are by-id lookups.

5. Smaller.
   - `render-seam.ts:127` renames before `:100` looks up `b.first`, which is still the `~v` id. A labelled live bar would put its label at x = 0. It needs a pass that begins on a live bar; I found no shape that does (the "1 | 2 | 3" run kept its labels at 66).
   - The fix 4 unit test does not pin the system's range: `render-seam-review.test.ts:104-106` asserts only that the attribute starts with `data-system="`.
   - `melody-pages.test.ts:100` computes its expectation with the same formula as `render-seam.ts:125`, so it cannot catch an error in that formula.

## The five fixes, as asked

| Fix | Does what was asked | Test fails on old code |
| --- | --- | --- |
| 1. Tacet sliver | Yes. Guard gone at `staff-renderer.ts:1631`. `owedByTacet` is non-zero at `openRun` only after another tacet column (set `:1638`, spent `:1661-1664`), so no other score moves | Yes, `tacet-adjacent-runs.test.ts`, all eight files |
| 2. Loupe count | Yes. `Loupe.svelte:1054` through `page-systems.ts:12-18`; `ranges` is read only at `:1992-1993`. A one-verse page gets the same list as before | Yes, `strophic-melody.test.ts:113` |
| 3. Time-signature binding | Yes, `TimeSignatureControls.svelte:41-45`. The list is keyed by index (`:122`), so repeated source ids do not collide | Yes, `strophic-melody.test.ts:124-146` |
| 4. Second ending | Yes on the fixture: printed order `0 1 2 3 0' 1' 2' 4'(live) 5`, 24 live hits, no duplicate, no stray `~v` in a live attribute (my run) | Yes, `strophic-melody-taps.test.ts`, and `render-seam-review.test.ts:88-108` |
| 5. 20 s limit | Yes, `open-extract.test.ts:22`, `:50`, `:92`; assertions unchanged | Not applicable |

**Byte baseline.** The JSON diff changes eight lines and no others, and the eight paths are the eight the report lists. Entries: 207 before, 207 after. The new hashes pair up as the old ones did (three L files share one, the S files share two). I did not recompute any hash.

**Tests.** None deleted. The four removed test lines are edits in place.

**Ratchets.** `node scripts/ratchets.mjs` prints "ratchets: OK." `Loupe.svelte` is 3008 of 3008 (lowered from 3012), `staff-renderer.ts` 3414 of 3414, `loupe.ts` 990 unlisted. No ceiling was raised.

## Merge result

`git merge-tree --write-tree origin/Shane origin/cloud-lane-56` exits 0 with tree `f9c4d919` and no conflicts. Shane (16ab22d0) is ahead of the merge base (b32b6989) by four files under `docs/memory/` only.

## Pictures looked at

Six, three of which the report says it did not open.

- `fix1-before-desktop-en-p1.png` (report opened): the first system's opening rest is a sliver, with "5" and "[6]" printed on top of each other.
- `fix1-after-desktop-en-p1.png` (report opened): a full rest marked 5, "[6]", the two-sharp key change, a rest marked 2, "[8]". System 2 opens at 12 where it opened at 13. Matches the report.
- `fix1-after-desktop-en-p2.png` (NOT opened by the report): page 2 of 3, systems at 43, 49, 54, 60, 66, 69. No sliver and no collision. The last system is widely spaced under one long slur that runs off the right edge; nothing ties that to this fix.
- `fix4-latercopy-desktop-en.png` (NOT opened): the Loupe reads "m. 2 · system 1 of 3" and shows verse 1's words (ре-кой ту ман); the ring is on the pass-1 copy in the top system, and "Verse 2" stands over system 2. The singer tapped a verse 2 note and is shown verse 1's words. That is what the desk asked for.
- `fix4-ending2-phone-en.png` (NOT opened): "m. 5 · system 2 of 3", Вот и ко-нец. The last syllable and its IPA are cut at the Loupe's right edge. The clef chip covers the page head.
- `fix3-card-phone-fr.png` (NOT opened): the sheet « Chiffrage de mesure » with 4/4 lit and 4 over 4 in the fields. The page behind shows « Couplet 2 », 2/2 in system 2, and 4/4 restated in system 3.

## Questions for Dann

None of taste. Fix 3 needs a rule on which channels a live bar draws from; that is a design ruling for the desk.

## NOT ESTABLISHED

- That the 207 hashes in the JSON match the lane's code. I ran no vitest file, and `apps/web` in the worktree has no vitest binary. The report's "6357 passed" is its word.
- Anything in a browser: what the Loupe shows for the grace-note id in fix 2, the page after a text correction in fix 3, and the clef box overlap in fix 4.
- Whether the cut last syllable in `fix4-ending2-phone-en.png` is the Loupe's usual phone behaviour or new.
- Whether the "before" picture came from the guard put back by hand, as the report says.
- Whether any real score reaching Ilya has a "2, 3" or "2, 4" ending.
- The Playwright counts in the follow-up report.

## What I ran

- Read-only git commands.
- `node scripts/ratchets.mjs`.
- One `tsx` script fed on standard input, importing the lane's source in place, on six in-memory variants of the volta fixture.

No file was written and `git status` in the worktree is clean. Nothing from memory was used as a fact.
