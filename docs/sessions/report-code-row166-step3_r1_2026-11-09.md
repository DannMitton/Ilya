# Report: row 166, step 3, the string (Code, cloud lane, r1, 2026-11-09)

Branch `cloud-lane-39`. Brief step 3. One commit with step 2 (see that report for why).

## What is seated

`insights.generic.lede` in `apps/web/src/lib/i18n.ts`, EN and FR, exactly as the brief gives them (Dann, 2026-11-09 16:13):

- EN: These findings use placeholder values for a {voiceType}, not your specific voice. You can offer samples of your own vowels in vocal fry using Calibrate in the Voice section of the Drawer.
- FR: Ces constats reposent sur des valeurs par défaut pour le type {voiceType}, et non sur votre voix en particulier. Vous pouvez fournir des échantillons de vos propres voyelles en friture vocale à l’aide de Calibrer, dans la section Voix du Tiroir.

Pinned character for character in `apps/web/src/lib/insights/ratified-lines.test.ts` ("row 166: the placeholder lede"), with an explicit check that the French carries the typographic apostrophe (`l’aide`). The French has no colon, so the OQLF spacing rule has nothing to apply to in this string. The i18n key index (`i18n.ts` head: 1,189 keys, `insights.` 189) is updated as `i18n-index.test.ts` requires.

## `{voiceType}` for the five

Filled by `voiceTypePrint`, the function the identity line calls, so the two always agree. EN lower-cased as the identity line prints it; FR as printed (asserted in `identity.test.ts`):

| Type | EN | FR |
| --- | --- | --- |
| soprano | soprano | soprano |
| mezzo-soprano | mezzo-soprano | mezzo-soprano |
| tenor | tenor | ténor |
| baritone | baritone | baryton |
| bass | bass | basse |

None of the five is capitalized in English (the capital-keeping labels are Tier 2: Baryton Martin, Heldentenor, Heldenbariton).

## What Code could not establish

- **Grammar for a finer label.** "for a {voiceType}" is right for all five Tier 1 labels, and for most finer labels, but a label beginning with a vowel sound ("an octavist", "an altino") would read wrongly, and Other's own text prints as typed. This is Dann's sentence, so I left it.
- **French agreement.** « pour le type {voiceType} » takes any label without agreement, which is why it works for « basse » and « baryton » alike.
