# Report: row 163, step 6 (the French footer)

2026-11-01, Code (Sonnet), branch `mac-row163`, on `c75ac648`. Review amendment 19 applied. Ratified by Dann 2026-10-30 14:40.

## What changed

- `apps/web/src/lib/i18n.ts:921`: « Fait avec amour au Canada » is now « Fait avec cœur au Canada ». The œ is written as the file writes it, the escape `œ` (`cœur`, as in `met en œuvre` on the same line). Nothing else in the string changed.
- `apps/web/src/lib/components/footer-credit.test.ts:21` asserts `'Fait avec cœur'` instead of `'Fait avec amour'`.

## French beyond the ratified strings

None. This is the only French string touched, and it is the ratified one.

| English | Old French | New French |
|---|---|---|
| Made with love in Canada (unchanged) | Fait avec amour au Canada | Fait avec cœur au Canada |

## Gates

| Gate | Before this step | Now |
|---|---|---|
| 3 web check | 0 errors, 12 warnings, 5 files | same |
| 4 web test | 3749 | 3749 passed, 1 skipped (3750) (no test added; one assertion changed) |
| 8 ratchets | OK | OK |
