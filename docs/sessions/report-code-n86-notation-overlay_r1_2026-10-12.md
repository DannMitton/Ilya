# Report: N.86's remainder, the dead notation-only overlay (r1, 2026-10-12)

QUEUE row 84, from `docs/sessions/brief-code-n86-notation-overlay_r2_2026-10-12.md` as it stands at 72b564f. Cloud lane, branch `cloud-lane-2`.

## Commit and starting state

- `cloud-lane-2` was fast-forwarded to `origin/Shane`, then sat at **72b564f**, which holds rows 78a to 79. The desk's `<sha>` is 72b564f, so the whole brief was done, including both `MarkupPane.svelte` comment rewrites.
- Clean tree at the start. Fresh `pnpm install --frozen-lockfile` on Linux. The result commit is the one that carries this report on `cloud-lane-2`.
- Nothing under `docs/memory/` was touched. The brief file was not edited.

## Section 3: measured before the change

`git grep -n -e 'notation-overlay' -e 'notationOnlyOverlay' -- . ':!docs'` at 72b564f:

```
apps/web/src/lib/analysis/notation-overlay.test.ts:2:  * notationOnlyOverlay tests (§E.7 slice 1, Dann's notation-first ruling,
apps/web/src/lib/analysis/notation-overlay.test.ts:11: import { notationOnlyOverlay } from './notation-overlay';
apps/web/src/lib/analysis/notation-overlay.test.ts:13: describe('notationOnlyOverlay', () => {
apps/web/src/lib/analysis/notation-overlay.test.ts:15:  const overlay = notationOnlyOverlay(parsed);
apps/web/src/lib/analysis/notation-overlay.test.ts:45:  const o = notationOnlyOverlay(empty);
apps/web/src/lib/analysis/notation-overlay.ts:41:export function notationOnlyOverlay(parsed: ParsedScore): AnalyzedScore {
apps/web/src/lib/markup/MarkupPane.svelte:125:  * notation-overlay.ts for why that is the engine's own semantics).
apps/web/src/lib/markup/MarkupPane.svelte:535:  // only, correctly (§A.35). This replaces notationOnlyOverlay: with no
apps/web/src/lib/markup/MarkupPane.svelte:967:  acoustic marks; see notation-overlay.ts). -->
```

(Leading whitespace trimmed.) This is exactly the expected set: the two files and `MarkupPane.svelte` at the two comments and `:535`. No dynamic import, ratchet, allow-list, tsconfig or vitest include, e2e test, or README names it. No finding, so I proceeded.

What the page renders today, read at `MarkupPane.svelte:535-540` (before) and the `scorePages` block: `analyzed` comes from `analyzeScore` against the active profile, so acoustic marks draw wherever a vowel resolves, and the plain vocal line draws when none does. Both old comments' "no acoustic marks" was false. I read the `:719-723`, `:788`, and `:837-839` claims in the brief from the brief's own citations; I did not re-trace them line by line.

## Changes

- Removed `apps/web/src/lib/analysis/notation-overlay.ts` and `notation-overlay.test.ts`.
- `MarkupPane.svelte`, the `ingested` prop doc comment, now: "When present, the envelope's content window carries the rendered score pages instead of the interim copy: real systems and underlay through paginateScore, with the acoustic marks analyzeScore resolves against the active profile (see the overlay block below). With no resolvable vowel or no fR1, analyzeScore omits every event and the plain vocal line renders; that is the engine's own semantics, not a bypass." (Rewrapped across lines as in the source.)
- `MarkupPane.svelte`, the HTML comment above the pages, now ends: "The SVG pages come from paginateScore over the analysed score; marks appear only where a vowel resolved against the profile, and an empty events map draws the plain vocal line."
- **One departure from the brief, for you to rule on.** The brief says the comment at `:535-537` "needs no change", but its sentence "This replaces notationOnlyOverlay:" names the removed helper, which conflicts with section 6 ("No file in the tree names ... `notationOnlyOverlay`"). I deleted only that sentence fragment and kept the reasoning. It now reads: "... renders notation only, correctly (§A.35). With no resolvable vowels or no fR1, analyzeScore omits every event, so the plain vocal line renders, no acoustic claim made." This is a DESK DEFAULT; revert it if you want the old wording and a looser done-when.
- `AGENTS.md`: asserted the anchor "- **No agent commits. No agent opens a pull request.** Ever." matched exactly once, then inserted your line verbatim directly after it.
- Kept as ruled: `optimalRegion` and `apps/web/src/routes/notation-font-lab/`.

## Section 6 results

- After the change, the same `git grep` (excluding `docs/`) returns nothing.
- Gates, before then after, run in a Linux cloud sandbox from a fresh install:

| Gate | Baseline you gave | Before (measured here) | After |
|---|---|---|---|
| 1 phonology | 251 | 251 | 251 |
| 2 dictionary | 248 | 248 | 248 |
| 3 web-check | 0 errors, 12 warnings, 5 files | same | same |
| 4 web-test | 2433 | 2433 | **2428** |
| 5 score-parser | 675 passed, 5 skipped (680) | same | same |
| 6 blurb | 145 | 145 | 145 |
| 7 integration | 55 | 55 | 55 |
| 8 ratchets | OK | OK | OK |

- **Gate 4 fell by 5, from 2433 to 2428**, as the brief expected. That is the 5 tests in `notation-overlay.test.ts`. No other number moved.
- Gate 8 prints "ceilings can be lowered" headroom lines. The only one I changed is `MarkupPane.svelte`, whose measured length went from 1349 to 1352 lines (ceiling 1358), because the rewritten comments are 3 lines longer. Ceilings were not edited.
- The Playwright suite is not one of the eight and was not run.

## Could not establish

- The first step was done at 72b564f, but I did not check that the desk's Mac working tree matches it; the desk said it holds uncommitted edits to `docs/memory/` and the brief, which I cannot see.
- Whether the `ingested` doc comment's "(see the overlay block below)" points at the intended block: I took it from the brief's draft wording and did not locate a block by that name. It is the `analyzeScore` derivation near `MarkupPane.svelte:719`.
- I did not render the page, so "the page is unchanged" rests on the diff being comments and two dead files, not on a visual check.
- Whether the Mac's gate counts and this sandbox's agree beyond the eight numbers: they agree on every count you supplied.
