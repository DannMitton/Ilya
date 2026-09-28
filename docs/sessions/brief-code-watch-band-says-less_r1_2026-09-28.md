# Brief for Code: the watch band says less

> **UPDATED 2026-09-28 16:28. The fixed count of three is WITHDRAWN** (Dann, 16:23). **Build the gates instead:** `docs/sessions/draft-curation-rules_r1_2026-09-24.md`, section "Revision r4 … THE GATES", with its ruling of 16:28 (one set of gates for Markup's box and Insights; about two entries per printed page). **The stakes threshold is a STARTING VALUE for trial:** choose one, state it and its reasoning, and report what the box shows on «Скучай» and on Sunless 1 at that value, so Dann can judge by reading. **The page limit is a trial too** (Dann, 16:30): list any entry the limit dropped, per page, so he can see where it bit. Where a gate needs data Ilya does not yet have (dynamics are not parsed; a sourced "thing to try" exists only for some kinds), say so and let that gate pass or fail conservatively. §"The ruling" below is superseded by this note.

**Desk brief r1, 2026-09-28.**

## The ruling

**RULED by Dann 2026-09-28 16:21** (*"YEs!!!!!! :) :)"*), offered by the desk after his critique: *"I think it might be best to say less than more"* and *"Won't a user find value in receiving advice for the really tricky spots? General commentary is fine, but I feel like it is of little value."* Also his, 16:20: the grouped "one sentence per kind, naming its bars" form is *"a last resort."*

**Default:** Markup's « Points à surveiller » box shows **the three hardest spots only**, each with its advice sentence where the band has one. Every other place stays marked on the score (turning heads, crossing boxes) and is not narrated. **Exception:** if fewer than three places rise to the band at all, it shows those; if none, the box does not render. No grouped or summary line (DESK DEFAULT; the grouped form is Dann's last resort, not a default).

**"Hardest"** is the band's existing severity ranking (`apps/web/src/lib/analysis/watchlist.ts:2-9`, `buildWatchList`). The ranking's rules belong to N.173, the curation rules (`docs/sessions/draft-curation-rules_r1_2026-09-24.md`, a living draft), so Markup and Insights never disagree about what matters most. Report how the ranking is computed today, with `path:line`, so the desk can carry it into N.173.

## Four fixes found on Dann's look, 2026-09-28 16:17 (DESK DEFAULT)

1. **The heading is too faint to find.** Dann did not see « Points à surveiller ». Make it read as the box's title, in the band's existing type scale (report the change).
2. **The box is clipped at the page's bottom edge** on «Скучай», page 3 of 3: the last line is cut through. Nothing may be cut; with three entries this may vanish, but check it on the longest possible three.
3. **Strip punctuation from quoted words** (« разлуки, » should read « разлуки »), as Insights does (`InsightsPane.svelte:399-402`).
4. **No duplicate line**: two entries that would print the same sentence for the same bar are one.

## Constraints and done when

No new strings are expected. If any are needed, draft the French from `i18n.ts` and bring it to the desk. `MarkupPane.svelte` must not grow past its ceiling. Gates pass. `DONE` is Dann's look on «Скучай» in both languages.
