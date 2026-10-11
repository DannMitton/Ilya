# Brief for Code: French gendered nouns, feminine first (r1, 2026-10-11)

Written by the desk (Opus) 2026-10-11 about 00:22. For Code, Sonnet; the cloud lane or the Mac. QUEUE row 63.

## What the singer sees

A French-speaking singer reads Ilya's Guide and finds the singer and the teacher named only in the masculine (« offre au chanteur », « son professeur », `apps/web/src/lib/components/Reading/GuideContent.svelte:61`). Dann ruled on 2026-10-11 at 00:19 that the Guide aligns with the house style for inclusive language: *"The Guide should align to our house style for inclusive language and gendered nouns, I agree."*

## The rule, ruled by Dann 2026-10-11 00:19

- **A noun naming a person takes the full pair, feminine first:** « votre professeure ou professeur ». Dann: *"Let's place the feminine first."*
- **The source of the form is the OQLF:** in running text, full pairs are recommended; the bracketed short form « professeur(e) » is acceptable only in tables, forms, and short posts; « professeure » is the feminine, and its use is *"tout à fait justifié et encouragé"* (OQLF, FAQ sur la féminisation lexicale et la rédaction épicène; « Qu'est-ce qu'un doublet abrégé? »).
- **A neutral wording that names no person is also acceptable** where the pair makes a repeated line heavy. Dann called « Vérifiez cette approche en cours de chant » *"very good"* (2026-10-11 00:19).
- Determiners, adjectives, and pronouns agree with the pair. Check each against its referent, as `docs/memory/CONTRACT.md` §6 requires.

## What to do

1. **Find every French string that names a person by a gendered noun** in `apps/web/src/lib/i18n.ts`, `apps/web/src/lib/components/Reading/GuideContent.svelte`, `LearnContent.svelte`, `data/blurb-composer.json`, and any other file holding French that a singer reads. Nouns to search for include chanteur, chanteuse, professeur, enseignant, élève, accompagnateur, pianiste (épicène, leave it), auteur, lecteur, utilisateur. Report the full list with `path:line`.
2. **Do not change any string.** French is Dann's to rule on (`CONTRACT.md` §6). For each hit, write the current French and a draft that follows the rule (pair, feminine first, with agreements adjusted), or a neutral wording where the pair would make the sentence heavy. Mark each draft `[FR: desk draft for Dann]`.
3. **Leave quotations and bibliographic text unchanged:** a quoted author's words, titles, and names are not Ilya's to rewrite. List them separately as left alone, with the reason.

## Constraints

- No git command that writes, including `add`, `commit`, `stash`, `checkout`, `restore`, `reset`, and `worktree`. On the cloud lane, the branch rules in `CONTRACT.md` §5 apply.
- Nothing in `apps/` changes in this row.

## Report back

`docs/sessions/report-code-french-gendered-nouns_r1_2026-10-11.md`: the table (path:line, current French, draft, pair or neutral, agreements checked), then the left-alone list, then **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Set QUEUE row 63 in one line and stop.
