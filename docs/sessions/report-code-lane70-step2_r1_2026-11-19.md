# Report, lane 70, step 2: the one test that named the old root

2026-11-19. Branch `cloud-lane-70`, on top of the step 1 commit. Brief section 3, step 2.

## 1. What changed

One file: `apps/web/e2e/insights-key-lines.test.ts`. Three lines, read from `git diff`:

- `:42` the comment now reads: "The page's own root: the letter pages, for both viewports. A phone sees the same pages scaled by `PageFit`, so the root no longer depends on the width."
- `:43` is now `const rootOf = (_width: 'desktop' | 'phone') => '.insights-container';`
- `:69` is now `await page.locator('.insights-container .paper-page').first().screenshot(...)`, with no phone branch.

The `width` parameter is kept everywhere it was: `rootOf`, `openInsights`, `shoot`, `shootWithReveal`, `lines`, and the `for ... of [['desktop', ...], ['phone', ...]]` loop with both viewports (1440 by 1300 and 390 by 844). In `rootOf` it is named `_width` because the function no longer reads it. No assertion was changed (the diff shows no `expect` line touched).

## 2. What I ran

Command, from `apps/web`, against the dev server already on `:5173`, with the system Chromium:

```
PW_CHROMIUM_PATH=/opt/pw-browsers/chromium pnpm exec playwright test --project=chromium insights-key-lines --trace off
```

Result: `15 passed (1.9m)`. That is seven key-line tests at 1440 px, the same seven at 390 px, and the one desktop test that follows a key line to MELODY and back.

The phone half passing is the evidence that matters for this lane: at 390 px, `.insights-container .block-conclusion` is found and visible, the key lines read the same words as at 1440 px, and `getByText` finds each answer once inside the root, so the off-screen measurer (outside `.insights-container`) is not matched.

## 3. Note on the stale-name search

After this step, `grep -rnE "insights-flow|flow-head|flow-body|flow-foot|flowWidth|flowSegments" apps/` is expected to return nothing. Step 4 runs it again as the final check.

## NOT ESTABLISHED

1. Whether the `_width` parameter in `rootOf` trips any lint rule against unused parameters. `svelte-check` is the gate here and covers it in step 4; this step ran only Playwright.
2. Whether the other `e2e/` and `e2e-phone/` files pass. Steps 3 and 4 run the ones the brief names.
3. The screenshots this file can save (`N182_SHOTS`) were not saved in this step; the default run asserts words only.
