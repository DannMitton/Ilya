# Report: N.192 and N.187, step 9 (the 18 ratified French lines), r1, 2026-11-12

Lane `cloud-lane-50`.

## What changed

The French slot of the 18 keys (nine grace note, nine key signature) now holds exactly the text Dann ratified on 2026-11-12 at 12:54, with typographic apostrophes (’). English is unchanged from what was built (including `correct.graceAdd` "Add a grace note before the note that follows"). The two comment blocks above them in `apps/web/src/lib/i18n.ts` no longer say "PENDING DANN". `apps/web/src/lib/insights/ratified-lines.test.ts` gained a describe block that pins all 18 English and French pairs character for character (2 tests: the 18 pairs, and no straight apostrophe in the five key strings that carry one). No key was added or removed, so the key index at the head of `i18n.ts` is unchanged (1,241).

## A fault of mine found by the suite

`sources.test.ts` scans `i18n.ts` for a capitalised word before a year, and my block comment "RATIFIED 2026-11-12 ..." read as a citation to a work "RATIFIED 2026" (my first wording, "Dann 2026", read as one too). Reworded to "ratified on 2026-11-12 at 12:54 by Dann"; the test passes. Only block comments are affected; the file's `//` comments are stripped by that test.

## Collisions of French accessible names with Playwright locators

- Searched `e2e/` and `e2e-phone/` for any locator or expected name that is a substring of, or equal to, the new French names: the only hits are in `time-signature-card.test.ts` (French "Jusqu’à la fin du chant" and "Jusqu’au prochain changement de chiffrage"). They are `card.getByText(...)` scoped to the time signature card (`[data-ts-card]`), and the key card is a separate overlay, so they do not collide. The time signature cell's name is matched whole.
- The English-only precedent ("next note") has a French twin in the Loupe: « Note suivante » and « Note précédente ». None of the new names contains them. Measured in the app in French at 390 px with a grace note held in Corrections: `getByRole('button', { name })` resolves to exactly one button for « Note suivante », « Note précédente », « Supprimer », « Silence », « Liaison », « Armure », « Petite note » and « Barre oblique » (three for « Mesure », which existed before). The three new cells carry the ratified names (« Redonner à cette note sa pleine valeur », « Ajouter ou retirer la barre oblique de cette petite note », « Changer l’armure à partir de cette mesure »). « Rétablir » resolved to none because no correction had been made on the held note (Restore reads disabled), not because of a name.
- **The phone `loupe-scan` tests do not support French**: they name the arrows in English (`'Next note'`), so I could not run them in French. NOT ESTABLISHED for that suite as such; the check above is the equivalent. In English both `loupe-scan` tests pass on this tree (2 of 2).

## The eight gates

| Gate | Result |
|---|---|
| phonology | 462 passed |
| dictionary | 248 passed |
| svelte-check | 0 errors, 12 warnings |
| web | 5298 passed, 1 skipped (5299) (+2 over step 8's expected 5296, my two new tests) |
| score-parser | 838 passed, 5 skipped (843) |
| blurb | 178 passed |
| integration | 155 passed |
| ratchets | OK (`+page.svelte` 5513 of 5534) |

(The first full web run of this step had one failure, the `sources.test.ts` one above, fixed; the rerun is clean. The step 8 property test that failed once did not fail in either run.)

## What I could not establish

- The French in a screenshot of the card and cells: not taken this step.
- The phone `loupe-scan` suite in French (unsupported, above).
