# Brief to Code: French spacing follows the OQLF table, everywhere

From the desk, 2026-09-30 21:50. No git writes. Gates before and after.

## The ruling

**Dann, 2026-09-30 21:39:** *"Ilya agrees with whatever the conventions for modern Canadian French demand."* The resource is the OQLF's *Vitrine linguistique*, « Espacement avant et après les signes de ponctuation et les symboles » (`https://vitrinelinguistique.oqlf.gouv.qc.ca/22039/la-typographie/espacement/espacement-avant-et-apres-les-signes-de-ponctuation-et-les-symboles`), read by the desk 2026-09-30 21:47. It says the OQLF *« opte pour l'absence d'espace devant le point-virgule, le point d'exclamation et le point d'interrogation »*.

**Confirmed by the Government of Canada's *Clés de la rédaction*, « signes de ponctuation et espaces » (`https://nos-langues.canada.ca/fr/cles-de-la-redaction/signes-de-ponctuation-et-espaces`), read by the desk 2026-09-30 21:52:** « ; », « ? », « ! » take no space before; « : » takes a no-break space before; « » take a no-break space inside. It does not mention the *espace fine*. On « … » it says no space before when it marks hesitation, but a space before when it stands for omitted text.

This restores Dann's ruling of 2026-08-21 (`docs/memory/ENVIRONMENT.md`, "THE RULE FOR CANADIAN FRENCH") and **reverses the 2026-09-28 semicolon change** (`PRODUCT.md`, "French spacing before the semicolon"), which was the desk's amenity and misdescribed the OQLF as preferring the *espace fine*. Commit `86cae8b` seated it.

## The table to apply to every French string Ilya shows

| Sign | Before | After |
|---|---|---|
| « ; » « ? » « ! » | no space | space |
| « : » | no-break space (U+00A0) | space (except times, 13:52) |
| « … » | no space | space |
| « » (guillemets) | opening: space before, no-break space after; closing: no-break space before, space after | |
| « % », « $ » | no-break space before | space |
| « , » | no space | space |

## The work

1. Find every French value that breaks the table: in `apps/web/src/lib/i18n.ts`, in the French bodies of `LearnContent.svelte` and `GuideContent.svelte`, and in any French composed in code (for example `insights/comment-text.ts`, `analysis/watchlist.ts`). **Scan the built bundle as well as the source** (`ENVIRONMENT.md`: a source sweep drowns in ternaries and misses composed strings).
2. Fix them. Known: 8 « ? » with U+202F (`i18n.ts:1668` to `:1714`) and 13 « ; » with U+202F. Change spacing only; never a word.
3. Add one test that fails on any French value in `i18n.ts` with a space of any kind before « ; », « ? », or « ! », or without U+00A0 before « : » (allowing the time and URL cases you find), so this cannot drift again.
4. Update the comments that cite the semicolon ruling of 2026-09-28 to cite this one.

## Report

Counts per sign, before and after, source and bundle. `docs/sessions/report-code-french-spacing-oqlf_r1_2026-09-30.md`. NOT ESTABLISHED beats a complete invented answer.
