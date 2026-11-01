# Report: row 165, step 4, the guard (r1, 2026-11-01)

One new file: `apps/web/src/lib/colour-story.test.ts` (25 tests).

## Half one: no retired colour returns

Reads every `*.svelte`, `*.ts`, `*.css`, `*.html`, `*.js`, and `*.webmanifest` under `apps/web/src`, `apps/web/static`, and each `packages/*/src`, excluding `__approved__/`, `node_modules`, `.svelte-kit`, and itself. It fails on any case-insensitive, word-bounded match of 37 retired hex values (the brief's list plus `8A5C5C`, plus the 12 family literals the census found) or of the triplets 131,146,117; 171,127,127; 116,140,185; 149,133,162; 163,134,105; 124,107,176 inside `rgb(` or `rgba(`. It exempts nothing else. `--surround-voice #D8D0E0` is deliberately not on the list. A negative control inserts a retired hex (lower case), a retired `rgba()`, and an upper-case hex into a copy of `app.css` and shows each is caught once, and that the real `app.css` is clean. A sanity test asserts it reads over 300 files. The tree passes.

## Half two: contrast, computed from `app.css`

For each of the five families: ink on paper (`#F0EBE0`), on white (print), on desk, on head, and on wash, all at least 4.5:1; white on jewel at least 4.5:1; jewel on desk at least 3:1; white on band at least 3:1, **for large text only** (the chapter title and `.band-deck`). The badge is also tested: white on the jewel veil over each band, at the percentage `HeaderBar.svelte` ships (parsed from the source), at least 4.5:1. All pass.

Not asserted, on purpose: the 22px weight-400 sigil name (white on band, 3.02 to 3.36 on four bars) is not large text, so it would fail AA; Dann ratified it by eye and the test does not pretend otherwise. Step 5 shows it in the table.

## Also guarded (CONTRACT §4 cross-site line)

`app.html` `theme-color`, `manifest.webmanifest` `background_color` and `theme_color`, and `--sage` must be one value. What depended on them agreeing is the browser chrome matching the TEXT band.

## Gates

web test 3743 passed, 1 skipped (3744): the baseline 3718 plus this file's 25. web check: found 0 errors and 12 warnings in 5 files. `pnpm ratchets`: ratchets: OK.

No French changes.
