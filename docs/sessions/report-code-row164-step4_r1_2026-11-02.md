# Report: row 164, step 4, up to date with `Shane`, and the ratified French (r1, 2026-11-02)

Branch `mac-row164`. Nothing pushed, nothing merged into `Shane`, no pull request.

## What was done

1. `git fetch`, then `git merge --no-edit origin/Shane` (`bf4a45ad`, consistency batch 1). The merge commit is `0b6abe70`.
2. In `apps/web/src/lib/i18n.ts`, replaced the four `TODO-FR` values with Dann's French, ratified 2026-11-02 00:10, and removed the comments (commit `481f4e2c`):

| key | English | French |
|---|---|---|
| `loupe.title` | LOUPE | LOUPE |
| `loupe.close` | Close | Fermer |
| `loupe.moveTop` | Move the Loupe to the top | Placer la loupe en haut |
| `loupe.moveBottom` | Move the Loupe to the bottom | Placer la loupe en bas |

The comment above them now says the French is Dann's. No `TODO-FR` remains for this row.
3. The two e2e files of this row (`e2e/loupe-header.test.ts`, `e2e-phone/loupe-header.test.ts`) looked up the tab as "Markup"; batch 1 renamed it MELODY, so both now say `MELODY`. They are committed with this report.

## Conflicts

None. The merge applied textually, including `i18n.ts`, so there was nothing to keep from both sides.

## Gates on this tip

| Gate | Result |
|---|---|
| phonology | 291 passed (291) |
| dictionary | 248 passed (248) |
| web check | found 0 errors and 12 warnings in 5 files |
| web test | 3802 passed, 1 skipped (3803): the new baseline 3789 plus my 13 |
| score-parser | 785 passed, 5 skipped (790) |
| blurb | 145 passed (145) |
| integration | 55 passed (55) |
| `pnpm ratchets` | ratchets: OK. (`Loupe.svelte` 3011 of 3013, `+page.svelte` 5585 of 5586) |
| e2e chromium, `loupe-header` (5) and `loupe-head-caret` (2) | 7 passed |
| e2e phone, `loupe-header` (5) | 5 passed |

## What I could not establish

- A real iPhone: whether Safari sends `click` after a swipe from the header (the 10 px tap guard answers it either way), and how the bottom pin sits against the home indicator (no safe-area allowance).
- Chrome's own print preview; only print emulation was checked (step 1).
- Whether the French labels fit the phone header at 390 px: « Fermer » is longer than "Close" by one letter, and « Placer la loupe en bas » is screen-reader text only. I did not re-screenshot the header with the French interface.
- The two-row phone bar is unchanged (step 1).
