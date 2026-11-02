# Report: row 172, step 1, the tap sets the witness (Code, r1, 2026-11-02)

Branch `cloud-lane-29`. Read and edited on this cut; working tree was clean before the edit.

## What changed

- `apps/web/src/lib/components/Drawer/IntakeViews.svelte:225` (the brief's `:229`, moved): the `onchoose` of INPUT's `ViewPair` now calls `inputViews.show(id)` and then `inputViews.chooseWitness(songId, id)`. `songId` is the component's prop (`:67`).
- `apps/web/src/lib/text/input-views.svelte.ts` (`chooseWitness`, `:68` onward): the doc comment now says what the method is for and that only `IntakeViews` calls it. No logic changed.
- `open` (`:54-59`) and `land` (`:85-87`) are untouched and never touch `witnessChoice`. The default stays Lyrics until a tap (`+page.svelte:462`, `?? 'lyrics'`). `shownWitness` (`witness-lines.ts:116`) is untouched.
- The `shown` effect that clears the selected word on a witness change (`+page.svelte:470-473`) is kept.
- `chooseWitness` callers now: `IntakeViews.svelte:225` and, until step 2, `+page.svelte:4360` (the pair on TEXT). `git grep chooseWitness` confirms no others outside tests.

## Verification at phone width (390 x 844, the `phone` project)

A throwaway spec (not committed): type Lyrics `Тебя я увидел, тебя я увидел` and Poem `Тебя я увидел`; tap LYRICS in INPUT; lower the drawer; TEXT shows 6 words and the pair reads Lyrics. Raise, tap POEM, lower: TEXT shows 3 words and the pair reads Poem. Raise, tap LYRICS, lower: 6 words. PASSED (1 test, 17.9 s). Command: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium pnpm exec playwright test --project=phone <spec>` in `apps/web`.

The source line does not exist until step 3, so this step checks the words on the page and the old pair's `aria-selected`; step 2 and step 3 move the assertions to the source line.

## A finding the brief does not name

The drawer pull is found in the phone specs by `getByRole('button', { name: /paper/i })` and `/drawer/i`. The pull's label when the drawer is raised is now `drawer.paper`, "the page" (`i18n.ts:133`), not "Paper"; the lowered label is "DRAWER" (`:225`). So `/paper/i` finds nothing and the existing phone specs time out at that locator on this cut (I hit this in the throwaway spec before switching to `.drawer-pull`). Nine such locators exist across `e2e/` and `e2e-phone/` (`git grep -c "name: /paper/i"`). Step 2 rewrites `e2e-phone/text-witness.test.ts` and will use `.drawer-pull`; I do not touch the other specs. NOT ESTABLISHED: whether those other specs also fail today; I did not run them.

## Gates, after step 1

| # | Result |
|---|---|
| 1 phonology | 407 passed |
| 2 dictionary | 248 passed |
| 3 check | 0 errors, 12 warnings |
| 4 web unit | 3843 passed, 1 skipped (3844) |
| 5 root integration | 98 passed |
| 6 blurb | 148 passed |
| 7 score-parser | 785 passed, 5 skipped (790) |
| 8 ratchets | OK |

No count moved from the baseline (step 0).

## Ratchets

`pnpm ratchets` offered six lower ceilings and I took all six in `scripts/ratchets.json`: `Drawer.svelte` 1990 to 1975, `LearnContent.svelte` 4099 to 4096, `Loupe.svelte` 3013 to 3011, `CalibrationWizard.svelte` 2124 to 2112, `+page.svelte` 5586 to 5585, `staff-renderer.ts` 3427 to 3426. Only the `+page.svelte` one is this row's neighbour; the rest are earlier slack. `ratchets: OK` after. Lane 28 may also edit this file; expect a trivial merge there.
