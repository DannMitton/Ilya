# Report, lane 69, Step 2: the comment order in `i18n.ts`

The two-buttons comment ("the far-off [ɨ]'s two buttons") sat above `calib.summary.unstableOne`, not above its own keys. I moved it below `calib.summary.unstableOne`, so it now sits directly above `calib.summary.keepOne` and `calib.summary.useEstimate`.

`apps/web/src/lib/i18n.ts:1349-1356` now reads, in order: the `:1349` comment, `calib.summary.unstable`, the lane 68 comment, `calib.summary.unstableOne`, the two-buttons comment, `calib.summary.keepOne`, `calib.summary.useEstimate`, `calib.summary.keepAll`.

Same keys, same order of keys, same line count (2725 before and after). No string's text touched. Git prints it as a one-line move, which is what moving one line across two is.

Tests run (the files this step touches): `pnpm exec vitest run src/lib/i18n` in `apps/web`: 2 files, 13 passed (13).
