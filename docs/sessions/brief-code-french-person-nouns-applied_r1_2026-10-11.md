# Brief for Code: French person nouns, applied (QUEUE row 70, r1, 2026-10-11)

Written by the desk (Opus) 2026-10-11 about 14:50. For Code, cloud lane or the Mac, Sonnet. Applies row 63's drafts as Dann settled them 13:56 to 14:47. **Every string here is RATIFIED by Dann; seat the French verbatim.** The English is untouched except where noted.

## The source of truth

1. The table in `docs/sessions/report-code-french-gendered-nouns_r1_2026-10-11.md` (rows 1 to 130, the "Draft" column), **as amended by the rulings below**. Where a row offers "pair or neutral", the rulings choose.
2. The rulings (quoted here because `docs/memory/` may lag on the cloud lane):
   - **R1:** the French Guide addresses the reader as « vous » where it says « l'utilisateur » or « les utilisateurs ».
   - **R2:** singers named as a group take the pair when the sentence means people (« chanteuses et chanteurs »), a neutral word only when it means the art (« le chant »). So rows 4, 8, 9, 25 (but see G:61 below), 28, 31, 33, 34, 36, 39, 41, 44, 49, 61, 64, 70 take the pair.
   - **R3:** field labels take the pair (« Compositrice ou compositeur », « Traductrice ou traducteur »); phrases about a stress the score prints take « la partition » (rows 5, 7: « Choix de la partition », « Réglage de la partition »; row 3: « Informations sur la compositrice ou le compositeur, l'opus et la ou le poète »).
   - **Row 11:** « Vous pouvez progresser à travers une série de leçons séquencées qui expliquent en profondeur comment Ilya parvient à ses résultats, qu'ils soient familiers ou inattendus. »
   - **Row 12 (G:30):** « Le module LEÇONS s'adresse à vous si vous appréciez la commodité d'Ilya tout en recherchant un degré supérieur d'indépendance et d'aisance avec les textes cyrilliques. »
   - **Row 13 (G:34):** « Vous pouvez exporter des PDF comme copies papier ou les conserver pour une étude ultérieure. »
   - **Row 22:** « Vous résolvez cela en consultant la définition complète… »
   - **G:46, a sentence the table missed:** « Ilya est l'outil avec lequel il la réalise. » becomes « Ilya est l'outil avec lequel vous la réalisez. »
   - **Rows 25 and 26 (G:61):** « Certains chanteurs s'accorderont avec la prévision, d'autres non, et cette différence est elle aussi une information, non une erreur. » becomes « Votre voix s'accordera peut-être avec la prévision, peut-être pas, et cette différence est elle aussi une information, non une erreur. » Row 26 as drafted (« L'outil vous offre une connaissance de votre voix… entre vos mains et celles de votre professeure ou professeur. »). Leave the rest of G:61 (« Fit », « fry ») for N.84's rewrite.
   - **Row 38 (G:275):** « Il repose sur la générosité des contributrices et contributeurs qui font la recherche, créent les polices, entretiennent les données et maintiennent les logiciels libres. »
   - **Row 78 (L:1003):** « Les chanteuses et chanteurs formés en diction italienne ou française ont déjà intériorisé cet ajustement. Si vous venez de l'anglais ou de l'allemand, vous constaterez qu'avancer consciemment la langue de quelques millimètres produit la clarté caractéristique de l'articulation consonantique russe. »
   - **`calib.capture.paused`** (`i18n.ts:1191`): fr « En pause. Reprenez au moment qui vous convient. »
   - **G:42:** « La base de règles d'*Ilya* fonctionne avec ou sans connexion Internet. »
3. Rows 72, 106, 108, and everything the report lists under "Left alone" stay as they are.

## Constraints

- French only, except: none of the English changes. N.84 aligns the English Guide later.
- OQLF spacing: the drift test passes.
- After seating, grep the French for each old string and confirm none remains; list any that does.
- All eight gates. Commit and push to `cloud-lane` only (or report uncommitted on the Mac); never `Shane` or `main`; no edits in `docs/memory/`. NOT ESTABLISHED beats a complete invented answer.

## Report

`docs/sessions/report-code-french-person-nouns-applied_r1_2026-10-11.md`: state first; each change with its `path:line`; the grep check; gates; **Could not establish**.


## Amendments after Fable's review, 2026-10-11 19:30. THESE OVERRIDE THE TEXT ABOVE WHERE THEY DIFFER.

Reviewed by Fable against HEAD `8e74f39` (167k tokens). Anchor every `i18n.ts` edit by key, never by line number. The safe order across the i18n briefs is rows 72, 70, 73, 68, 75, 62.

- **French spacing in Svelte files:** the OQLF drift test reads only `i18n.ts` (`i18n.test.ts:100-135`), so it cannot check a `.svelte` file. Apply the OQLF table by hand to every French string you write in a Svelte file (U+00A0 or `&#160;` before « : » and inside « »; no space before « ; », « ? », « ! »), and extend the test's `faults` check to the French branch of each Svelte file you change, or report the Guide's spacing as NOT ESTABLISHED.
- Where a draft shows « … », change only the quoted words and keep the rest of the sentence as printed.
- All eight gates; report gate 4's new count.
