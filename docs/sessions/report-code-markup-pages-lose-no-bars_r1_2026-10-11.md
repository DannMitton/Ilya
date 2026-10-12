# Report: Markup's pages lose no bars (QUEUE row 72, r1)

**QUEUE row 72, state: WRITTEN, pushed to `cloud-lane`. Every bar of every tracked score now draws once, whole, with its underlay, on screen and in print.** The desk carries this line into `QUEUE.md`; this session does not edit `docs/memory/`.

Written by Code (cloud lane) 2026-10-11, for `docs/sessions/brief-code-markup-pages-lose-no-bars_r1_2026-10-11.md`, on `cloud-lane` after merging `origin/Shane` at `8e74f39e` (merge `b8b07f8e`, pushed). Clean tree before the first edit.

**The Fable amendments.** The desk's message says this brief ends with "Amendments after Fable's review". The brief on the remote at `8e74f39e` has no such section, so it was built as written. NOT ESTABLISHED: what the amendments say.

## The answer: two causes

### 1. A stylesheet rule sized every system to the whole page

This was the fault on the Tchaikovsky song.

- **Where:** `apps/web/src/lib/markup/MarkupPane.svelte`, the rule `.score-window :global(svg) { display: block; width: 100%; height: auto; }`. Before this change it stood at `:1284`.
- **What it was meant to do:** size the page's own `<svg>`.
- **What it did:** a descendant selector also matched every nested system `<svg>` that `paginateScore` places inside the page (`packages/score-parser/src/page-layout.ts:415`). CSS `height: auto` outranks a nested `<svg>`'s `height` attribute, so each system grew to the page's full height and centred its staff inside it.
- **Measured on the live page, page 1 of the Tchaikovsky song:**
  - Each system's `y` attribute is correct: 0, 143.75, 301.5, 451.25, and 609, in a 727-tall page.
  - Each was drawn about 270 px lower than that: the first system's box started at 462 against a window top of 193.
  - So page 1 showed three systems after a tall empty band. Bar 26's system was cut by the footer, and bars 33 to 40 were drawn below the page's clip.
  - The same shift applied on every page, which is why the lost span moved when the layout changed.
- **The fix:** the rule is now `.score-window > :global(svg)`, so it reaches the page's `<svg>` alone. A comment beside it says why.

### 2. The last page could push its last system off the page

The sweep over every score found this second fault.

- **Where:** `packages/score-parser/src/page-layout.ts`, the page layout loop.
- **What happened:** the short last page reuses the spacing the full pages settled on (`establishedGap`, Dann's ruling of 2026-08-06). The pages are packed at the narrow floor (`o.systemGap`), so a wider carried gap could push the last system past the page's bottom.
- **Measured:** this hit four scores, three Grechaninov reads in `docs/sessions/measure-m-p-r74_2026-10-11/` and one Sunless 3 page read. Their systems ended 14 to 38 units below the page.
- **The fix:** the carried gap is capped at what still fits, never below the floor. A page that fits keeps the established rhythm, as ruled; one that would overflow tightens only as far as it must.

### Did row 64 introduce it?

No.

- The rule is present, unchanged, in the commit just before row 64 (`eec57e07~1`, line 1250), and row 64 does not touch it.
- When it began is NOT ESTABLISHED. This clone is shallow, and its oldest commit, `86944241`, already has the rule.

### The empty band and the layout rule

No layout rule calls for a band above the first system: `paginateScore` puts the first system on the window's top edge ("The slack goes BETWEEN systems only"). The band was cause 1. It is gone.

### Text

Text draws no score systems; only Markup paginates a score (`paginateScore` has one caller, `MarkupPane.svelte`). The only other `:global(svg)` rule is in the development font lab, `routes/notation-font-lab/+page.svelte:182`. It draws one system with no nested `<svg>`, so it is unaffected.

## The tests

- **`apps/web/src/lib/markup/markup-pages.test.ts` (new, 127 tests):**
  - **The stylesheet (2).** It finds the score window's `svg` rule, and says that every rule there which sets a width or height uses the child selector.
  - **Every score in the tree (125, one per `.musicxml` under `apps/`, `docs/`, and `tools/`).** Paginated at Markup's geometry, every bar appears exactly once across the pages, in order, and every system ends inside its page.
  - **Run against the old code:** 5 fail, the stylesheet test and the four scores of cause 2. All 127 pass now.
- **`apps/web/e2e/markup-pages-lose-no-bars.test.ts` (new, Playwright, outside the gates).** It opens the Tchaikovsky and Sunless fixtures on Markup. On the live page it says that every bar is drawn once, and that every system's staff box, read from its own screen transform, stands inside its page's score window. It was not run through `pnpm test:e2e` here; the same check was run as a script.
- **The live sweep (scratch script, not committed).** It ran the same check on every tracked `.musicxml` (`git ls-files`, 124 files) in Chromium at 1440 px.
  - Result: **124 of 124 pass**, every bar drawn once and inside its window.
  - No other song loses bars after the fix.
  - Before the fix every song was affected by cause 1, since the rule applied to every system. The sweep was not rerun on the old code.

## Pictures

`docs/sessions/markup-pages-shots/`, the Tchaikovsky song (`tchaikovsky-op38-3-voice.musicxml`).

- **Screen, desktop:**
  - `before-tchaikovsky-p1.png`: three systems after an empty band.
  - `after-tchaikovsky-p1.png`: five whole systems with their underlay.
  - `before-tchaikovsky-p2.png` and `after-tchaikovsky-p2.png`.
  - These screens use a calibrated bass voice, so the song reads in the bass clef.
- **Print preview, pages 1 and 2:**
  - `before-print-{1,2}.png`: page 1 ends on bar 26's staff, cut, with no underlay.
  - `after-print-{1,2}.png`: page 1 holds bars 1 to 47 whole, and page 2 opens at bar 48.
  - The print picture uses no calibrated voice, so the song reads in the treble clef and the systems fall differently from the screen.

## The changes

- `apps/web/src/lib/markup/MarkupPane.svelte`, the `.score-window` style: the selector is now a child selector, with a comment giving the cause.
- `packages/score-parser/src/page-layout.ts`, page layout: the last page's carried gap is capped at what fits.
- Tests as listed in "The tests".

## The eight gates

All pass.

1. `pnpm test:phonology`: 251 passed (251)
2. `pnpm test:dictionary`: 242 passed (242)
3. `pnpm --filter @ilya/web check`: 0 errors and 12 warnings in 5 files
4. `pnpm --filter @ilya/web test`: **2328** passed (2328). That is the 127 new tests over 2201, a baseline computed by subtraction, not run on its own.
5. `pnpm --filter @ilya/score-parser test`: 663 passed, 5 skipped (668)
6. `pnpm test:blurb`: 145 passed (145)
7. `pnpm test:integration`: 55 passed (55)
8. `pnpm ratchets`: OK

## Could not establish

- **When cause 1 began.** The clone is shallow.
- **Other browsers.** Whether Safari and Firefox apply `height: auto` to a nested `<svg>` the same way was not tested. The fix is correct in every browser: the rule no longer reaches the systems.
- **The Playwright spec in its own runner.** It was not run with `pnpm test:e2e` in this session; its check was run as a script over all 124 files.
- **What Fable's amendments to this brief say.** They are not on the remote.

## Fable's amendments, checked after the commit

The amendments (2026-10-11 19:30) reached the remote at `7bb929a4`, after this row was pushed as `9dd24fe4`. Read then, each is met:

- **"If the bar set can only be read from a rendered page, write the test as a Playwright test beside `apps/web/e2e/print-pages.test.ts`."** Done. `apps/web/e2e/markup-pages-lose-no-bars.test.ts` reads the live page.
  - The pagination half also has a unit test (`markup-pages.test.ts`), which reads `paginateScore`'s output directly and needs no rune.
- **"`insights/paginate.ts` is Insights' paginator, not Markup's: not a lead."** Agreed. Neither fix touches it: cause 1 is in `MarkupPane.svelte` and cause 2 in `packages/score-parser/src/page-layout.ts`.
- **"All eight gates; report gate 4's new count."** 2328, as in "The eight gates".
