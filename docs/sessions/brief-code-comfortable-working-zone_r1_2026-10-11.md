# Brief for Code: "comfortable working zone", r1

Written by the desk (Opus) 2026-10-11 16:26. For the cloud lane or Code on the Mac, Sonnet is enough.

## What the singer sees

A singer's own zone is no longer called "tessitura". Tessitura names a piece or a melody only (Dann 2026-10-11 16:16, `docs/memory/PRODUCT.md`, "Tessitura, as Ilya uses the word"). In voice setup and in Insights the singer reads "comfortable working zone" / « zone de travail confortable ».

## The work

1. In `apps/web/src/lib/i18n.ts`, replace the English and French of the eleven keys in the table of `docs/sessions/draft-comfortable-working-zone-strings_r1_2026-10-11.md`, exactly as written there. Both languages are RATIFIED (English 16:16, French 16:25). For `insights.r2.sourcesLine`, change the last clause only.
2. In the same file, set the French of `insights.r2.vowels.noTurn` to « {s}, aucune première résonance mesurée lors de votre calibration » (RATIFIED 16:11, `docs/memory/OPEN.md`).
3. Change nothing else. Code identifiers (`tessituraLow`, `tessituraHigh`, key names) stay. The keys listed as unchanged in the draft stay.

## Done when

- A grep of `i18n.ts` shows every ruled string, word for word, in both languages.
- `grep -n -i "your tessitura\|votre tessiture" apps/web/src/lib/i18n.ts` returns nothing.
- All five gates at baseline. Any test that asserts the old wording is updated to the new wording, and the report names each such test.
- Seen rendered in French and English: voice setup's Voice characteristics phase, and one Insights page with a typed zone.

## Report

`docs/sessions/report-code-comfortable-working-zone_r1_2026-10-11.md`: what changed, the gate counts, the tests touched, and a section "Could not establish". NOT ESTABLISHED beats a complete invented answer. Do not edit `docs/memory/`.
