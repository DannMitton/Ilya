# Report, lane 74, step 1: item 2, the two comments

Brief section 4. Both lines were read in this session before the edit.

## What was there

`grep -rn hasDeclaredType apps/web/src` on the untouched tree returned two lines and nothing else (the same two the brief names):

- `apps/web/src/lib/voice/voiceTypes.ts:121`: "...and every site branches on it, never on `hasDeclaredType`."
- `apps/web/src/lib/voice/chart/screen-logic.ts:77`: "...`undefined`, never on `hasDeclaredType`: "Not sure", no type, ..."

## What changed

Each comment keeps what it established (that "undeclared" means exactly `undefined` from `borrowedStaffLabel`, and that sites branch on that value) and drops the reference to code that does not exist.

- `voiceTypes.ts:121`, clause 4 of `borrowedStaffLabel`'s contract, now ends: "...and every site branches on that value."
- `screen-logic.ts:77`, on `sheetProvenance`, now reads: "The branch is on `borrowedStaffLabel` being `undefined`: "Not sure", no type, and an id this build does not know all draw the undeclared form, and a declared type never draws a raw token."

No code line changed.

## Checks

- `grep -rn hasDeclaredType apps packages --include=*.ts --include=*.svelte --exclude-dir=node_modules` returns nothing (exit 1).
- `vitest run src/lib/voice/voiceTypes.test.ts src/lib/voice/chart`: `Test Files  19 passed (19)`, `Tests  272 passed (272)`.
