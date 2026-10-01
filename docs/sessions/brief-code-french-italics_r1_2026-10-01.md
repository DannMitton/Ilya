# Brief to Code: italics on Italian musical terms in the French

From the desk, 2026-10-01 03:05. No git writes. Gates before and after.

**The ruling:** Dann, 2026-10-01 02:58 (`docs/memory/PRODUCT.md`, "ITALICS ON FOREIGN WORDS IN THE FRENCH"): Italian musical terms take italics, per Roberge's GDRM; every other foreign word follows the OQLF.

**The inventory, from the overnight agent (NOT re-checked by the desk):** `docs/sessions/memo-overnight-A16_r1_2026-10-01.md` lists 29 French occurrences in `i18n.ts`, `GuideContent.svelte`, and `LearnContent.svelte`, of which 24 change. 13 render italics already (`comment-text.ts:271-289` `*…*` runs; `InsightsIntake.svelte` `{@html}`; Guide and Learn inline HTML); 11 sit on plain `{T()}` paths (`CalibrationWizard.svelte:1567-1570`, `InsightsPane.svelte:398`, `:624`, `:661-671`, `watchlist.ts:640`).

**The work:**
1. Re-run the inventory yourself across every French string and French prose file, and report it as a table: file:line, the term, before, after. The memo's table is a lead, not the list.
2. Apply italics to the Italian musical terms in the French only. The English is not in scope.
3. For the 11 plain-text paths, render the italics with the mechanism the tree already uses (`comment-text.ts`'s `*…*` runs), not a new one, and never through `{@html}` on a string that carries user data.
4. Do not change any word; italics only. A term you cannot classify as Italian musical or francized goes in the report as a case for Dann, unchanged.
5. A test that the listed terms are italic in the French build, so the rule cannot drift.

6. **A second ratified French change rides with this brief** (Dann 2026-10-01 03:02, `docs/memory/PRODUCT.md`, « FRITURE VOCALE », NEVER « FRY »): `calib.welcome.fryQuestion` French (`i18n.ts:1068`) becomes exactly « Qu'est-ce que la friture vocale? » (typographic apostrophe, as the string has now). Then grep the French of `i18n.ts`, `GuideContent.svelte`, and `LearnContent.svelte` for « fry » and report every hit; change only the one string named here.

**Report:** `docs/sessions/report-code-french-italics_r1_2026-10-01.md`, with the table.
