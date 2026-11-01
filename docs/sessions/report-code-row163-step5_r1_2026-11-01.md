# Report: row 163, step 5 (Input's active pill)

2026-11-01, Code (Sonnet), branch `mac-row163`, on `fc978f2d`. Review amendment 22 applied; question 1 of the review is ruled (Dann 2026-11-01 12:34): the soft sage desk tint, not the jewel step.

## What changed

- `ViewPair.svelte`: a prop `activeFill?: string` (default unset). The active member takes it as an inline `background` through `style:background`; with nothing passed no inline style is written and the member keeps `--paper-cream` from its own rule.
- `IntakeViews.svelte`: the `<ViewPair` passes `activeFill="var(--sage-desk)"`. The token, not the hex (`app.css:148`, `#CDD3C8` today), so row 165's `#D8E2D6` lands here without a second edit.
- `TextWitnessPair.svelte` (uses `ViewPair`, passes nothing) and `DeskHead.svelte` (its own rule, does not use `ViewPair`) are untouched and keep their look.
- `view-pair-fill.test.ts` (4, new): server-renders the pair; the active member alone carries the fill; no inline style without the prop; only Input passes it; the value is a token.

## Note for the review

Row 165's palette assigns active states to the jewel step (`docs/sessions/palette-ratified_2026-10-30.css:3`); the ruling for this pill is the desk tint, modelled on the Loupe (`Loupe.svelte:2761-2764`, `--lavender-desk`). Dann ruled for the desk tint on 2026-11-01 12:34, so the two readings are settled for this pill.

## Not established

- The pill was not measured on the live page: contrast of the active label (ink) on `#CDD3C8`, and how it reads beside the panel. Not run in a browser. The Playwright suite was not run.

## Gates

| Gate | Before this step | Now |
|---|---|---|
| 3 web check | 0 errors, 12 warnings, 5 files | same |
| 4 web test | 3745 | **3749 passed, 1 skipped (3750)** (+4) |
| 8 ratchets | OK | OK |
