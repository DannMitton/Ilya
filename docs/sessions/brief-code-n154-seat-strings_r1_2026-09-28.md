# Brief for Code: N.154, seat the ratified strings

**Desk brief r1, 2026-09-28, at `7d2fcd6`.** The rulings are the section "Rulings" at the end of `docs/sessions/n154-strings-draft_r1_2026-09-28.md`, all ratified by Dann 2026-09-28 14:54 to 14:58. **The text to seat is the ratified text there, not the table's draft where the two differ (rows 4, 9, 10, 11, 12).**

## What to change, and where (from the draft's table, read at `9ebfdc0`; re-find each by its text)

- `apps/web/src/lib/i18n.ts`: `profile.scoreRegionAria` (row 1), `profile.lede` (row 2), `calib.characteristics.lede` (row 3, first sentence only), `upload.banner.reader` (row 4, the last clause only).
- `apps/web/src/lib/components/Drawer/Drawer.svelte`: the two Guide table-of-contents entries (rows 5 and 6, both languages).
- `apps/web/src/lib/components/Reading/GuideContent.svelte`: the two shown headings, English and French (rows 7 and 8).
- `apps/web/src/lib/components/Reading/LearnContent.svelte`: rows 9 to 12, English and French. Replace only the named clause; leave the rest of each sentence as it is.

## Rules

- Edit by anchor: assert exactly one match before each replacement.
- Typography: curly apostrophes where the surrounding strings use them (`’` in `i18n.ts`); keep the file's own escape style; no raw no-break spaces (`docs/memory/ENVIRONMENT.md`).
- An approval test may pin these strings (`apps/web/src/lib/approval/i18n-keys.test.ts`). If it fails, report which key; do not run `vitest -u`. The desk will decide.
- Nothing else changes. The Guide prose and the unrendered strings in the draft are out of scope.

## Done when

- A grep of the tree shows every ratified string, in both languages, and none of the replaced text. The desk checks this against the rulings (`CONTRACT.md` tether 17).
- The gates pass. `DONE` is Dann's look at the Guide's two headings and one Learn line in French.
