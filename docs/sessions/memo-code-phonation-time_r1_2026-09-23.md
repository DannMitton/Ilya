# MEMO. Phonation time in Insights (N.123), r1

**Claude Code, 2026-09-23, branch `Shane` at `01fd5be`, tree clean before the build. WRITTEN, not DONE: done when Dann walks it.**

## Gates

1 to 3 at baseline (216, 235, 0 errors and 12 warnings). Gate 4 is 1392, was 1385: seven new tests. Gate 5 is 576 plus 5 skipped (581), was 575 (580): one new test. The ship script's baselines need moving.

## Files

- `packages/score-parser/src/phonation.ts:256`, `:367`: `elapsed`, rests included; test at `phonation.test.ts:210`.
- `apps/web/src/lib/shane/insights.ts:137`, `:408`, `:461`, `:485`, `:502`, `:520`; tests at `insights.test.ts:172`.
- `apps/web/src/lib/shane/InsightsPane.svelte:170`, `:313`, `:317`.
- `apps/web/src/lib/i18n.ts:1515` to `:1539`.

## Findings

- **`#` caveat does not hold for Insights.** All six Sunless files carry `#` in verse 2 only, and Insights resolves verse 1. The list prints with no caveat.
- **Placement:** top of page two, which now always exists. Page one is unchanged apart from string 9.
- **Tempo states, real scores:** encoded, Sunless 2 harness, "19 s of this 23 s piece, at ♩ = 120". Inferred, engraved Sunless 1, "50 s to 1 min 25 s … Andante tranquillo". None, page-reader Sunless 1, row 4 with shares 6/72/22.
- **Untrusted bar** (Sunless 1, m. 17): DESK DEFAULT, counted as written and named. Withholding blanked the whole section.
- **No passaggi:** no bar, `crossingsUncounted`.
- **Flagged vowels:** bold.

## NOT ESTABLISHED

- **French, yours to rule:** `untrustedOne` and `untrustedMany`, and `findingOne` (a singular, since "1 instances" is wrong).
- Page one, worst case in French: two three-line findings with both tessitura qualifiers. Estimated about 24 px over; not observed.
- Sunless 2's ♩ = 120 beside "Andante con moto" may be a converter default.
- Bold has no key on the page.
