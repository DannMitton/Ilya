# Memo, overnight A16: italics on Italian loanwords in Ilya's French. 2026-10-01

Read only. Nothing changed. Everything below is PROPOSED for Dann's ruling; no brief written, because the French is his to rule first.

## The question

Dann, 2026-09-25 14:50 (`docs/memory/INBOX.md:196`): review the French across Ilya and make italics on loanwords (piano, forte, passaggio, legato, decrescendo...) consistent everywhere.

## 1. What the authorities say

**Roberge, GDRM, « Utilisation du romain, de l'italique et du gras »** (<https://roberge.mus.ulaval.ca/gdrm/08-itali.htm>, read verbatim 2026-10-01):

- Foreign words: « On met en italique les mots étrangers qui ne sont pas d'un usage courant dans la langue du texte. C'est le contexte de rédaction qui dicte si des emprunts nécessaires ou acceptés doivent être écrits en italique ou peuvent rester en romain. »
- Score indications: « On compose en italique les indications de tempo, de dynamique et d'expression. » Examples: « marqué *Andante moderato* », « se termine *ff* », « marqué *sotto voce* ».
- Words cited as words: « Les lettres ou mots qui se désignent eux-mêmes s'écrivent en italique. » Example: « Le mot *anthem* désigne... ».

**Roberge, GDRM, « Termes allemands, italiens et latins courants »** (<https://roberge.mus.ulaval.ca/gdrm/04-terme.htm>): « Les termes suivants sont généralement utilisés dans la langue d'origine (en les composant pour la plupart en italique) même lorsqu'ils possèdent un équivalent français. » The Italian list includes *crescendo*, *diminuendo*, *legato*, *staccato*, *rallentando*, *ritardando*, *rubato*, *messa di voce*, *mezza voce*, *falsetto*, *coloratura*, *bel canto*, *a cappella*, *passaggi*, *tempo*, *coda*. It does not list *piano*, *forte*, *decrescendo*, *passaggio* (singular), *zona*, *primo*, *secondo*, *vibrato*, *portamento*. The page gives one explicit roman exception, in the German list: « Ländler ... s'écrit avec une minuscule en français et n'exige pas l'utilisation de l'italique », that is, a word French has absorbed loses its italics.

**OQLF, Vitrine linguistique, « Emploi de l'italique ou du romain pour les mots en langue étrangère »** (<https://vitrinelinguistique.oqlf.gouv.qc.ca/24351/la-typographie/mise-en-relief/italique/emploi-de-litalique-ou-du-romain-pour-les-mots-en-langue-etrangere>): « Les mots en langue étrangère qui ne sont pas francisés se composent en italique », while « les mots étrangers ... qui sont devenus d'usage courant en français restent en caractères romains » (examples in roman: pizza, leitmotiv, in vitro, modus vivendi). It admits « l'usage hésite parfois entre l'italique et le romain ».

**Where they agree.** A foreign word not absorbed by French is italic; one absorbed is roman; context decides the middle. A term quoted as a score marking (« marqué *piano* ») is italic under the GDRM, and the OQLF has no rule against it.

**Where they pull apart, on exactly Dann's five words.** The GDRM composes *legato* and *crescendo* in italics as a default. The OQLF test is whether the word is francisé, and Usito (the Université de Sherbrooke dictionary of Quebec French) has headword entries, in roman, for *crescendo*, *decrescendo*, *legato*, *forte* (adv.), *piano* (adv., « De manière à produire un son doux ») and *tempo* (<https://usito.usherbrooke.ca/définitions/crescendo> and sibling pages, read 2026-10-01). It has none for *passaggio*. So under a strict OQLF reading, piano, forte, legato, crescendo and decrescendo in running French prose are roman, and only passaggio is italic. Under the GDRM they are italic, with the author's licence to leave accepted borrowings in roman. Ilya's standing authority for musical terminology is the GDRM (`docs/memory/INBOX.md:152`), and the OQLF governs punctuation (`docs/memory/PRODUCT.md:924-926`), so on terminology the GDRM leads. The disagreement is real and is stated here rather than smoothed.

## 2. Inventory: every Italian (and one English) musical loanword in Ilya's French

Files searched: `apps/web/src/lib/i18n.ts` (every `fr:` string), `data/blurb-composer.json` (every `fr` field: no musical loanwords at all), `GuideContent.svelte` lines 16 to 294 (the French branch, `{#if language === 'fr'}` at `:16`, `{:else}` at `:294`), `LearnContent.svelte` lines 15 to 2064 (French branch, `:15` and `:2064`). Terms searched: passaggio/passaggi, zona, primo/secondo, legato, crescendo, decrescendo, diminuendo, ritardando, rallentando, rubato, staccato, portamento, vibrato, falsetto, messa di voce, mezza/sotto voce, coloratura, bel canto, cantabile, dolce, tempo, coda, piano, forte, pianissimo, fortissimo, sforzando, fry, tessitura, melisma.

Legend. Italic now: Y or N. Status: FR = a French word, not a loanword, no italics ever; ABS = Italian word absorbed by French (Usito headword), the contested middle; IT = Italian, not in Usito, italic under both authorities.

| Where | French text (term in context) | Italic now | Status | English side |
|---|---|---|---|---|
| `i18n.ts:1180` | « Passaggio » (heading) | N | IT | « Passaggio », plain |
| `i18n.ts:1181` | « La zona se situe entre deux événements vocaux acoustiques » | N | IT | « The zona lies », plain |
| `i18n.ts:1182` | « Passaggio primaire » | N | IT | plain |
| `i18n.ts:1183` | « Passaggio secondaire » | N | IT | plain |
| `i18n.ts:1226` | « ou de votre passaggio » | N | IT | plain |
| `i18n.ts:760` | « le signalement des notes de passaggio » | N | IT | plain |
| `i18n.ts:1505` | « Croisements de passaggio » | N | IT | plain |
| `i18n.ts:1513` | « Non comptés sans les deux passaggi » | N | IT | plain |
| `i18n.ts:1514` | « Primo {primo}, secondo {secondo}, indiqués » | N | IT | « Primo, secondo », plain |
| `i18n.ts:1549` | « près de votre passaggio » | N | IT | plain |
| `i18n.ts:1648-1652` | « votre secondo passaggio » (4 strings) | N | IT | plain |
| `i18n.ts:1717` | « votre passaggio secondaire » | N | IT | plain |
| `i18n.ts:1729` | « la traversée de vos passaggi » | N | IT | plain |
| `i18n.ts:1758` | « La traversée des passaggi » | N | IT | plain |
| `i18n.ts:1828-1829` | « tombe près de votre passaggio » (2 watch lines) | N | IT | plain |
| `GuideContent.svelte:61` | « où la zona di passaggio risque de se situer » | N | IT | « the zona di passaggio », plain |
| `GuideContent.svelte:66` | « ambitus, tessiture et passaggio » (h4) | N | IT | plain |
| `GuideContent.svelte:68` | « le passaggio ... la zona di passaggio » | N | IT | plain |
| `GuideContent.svelte:70` | « tessiture ... passaggio » | N | IT | plain |
| `i18n.ts:1741` | « votre chant <em>piano</em> dans l'aigu » | Y | ABS | « soft singing », no Italian word |
| `i18n.ts:1742` | « chanter <em>piano</em> dans l'aigu » | Y | ABS | « sing softly » |
| `i18n.ts:1743` | « chanter <em>piano</em> dans l'aigu » | Y | ABS | « sing softly » |
| `i18n.ts:1746` | « du <em>piano</em> au <em>forte</em> » | Y | ABS | « between soft and loud » |
| `i18n.ts:1760` | « Le chant <em>piano</em> dans l'aigu » | Y | ABS | « Soft singing up high » |
| `i18n.ts:1676` | « avec un léger decrescendo » | N | ABS | « a slight decrescendo », plain |
| `i18n.ts:1678` | « chanter le saut legato » | N | ABS | « singing the leap legato », plain |
| `LearnContent.svelte:742` | « dans les passages legato » | N | ABS | `:2791` « in legato passages », plain |
| `i18n.ts:1564-1566` | « à {tempo} », « au tempo qu'indique », « aucun tempo » | N | ABS (French plural *tempos*) | plain |
| `GuideContent.svelte:179` | « plus lisible à tempo » | N | ABS | `:458` plain |
| `LearnContent.svelte:985` | « dans un tempo vif » | N | ABS | `:3034` plain |
| `LearnContent.svelte:1097` | « <em>ciao</em> ... <em>dolce</em> » (words cited as words) | Y | word-as-word | `:3144` italic too, consistent |
| `i18n.ts:1068` | « la friture vocale («&nbsp;vocal fry&nbsp;») » | N (guillemets) | English, glossed | « vocal fry » |
| `i18n.ts:1075-1153` | « friture », « friture vocale » (9 strings) | N | FR | « fry » |
| `GuideContent.svelte:61` | « échantillons de fry » | N | English loanword, bare | `:339` « fry samples » |
| `i18n.ts:391-440` | « mélisme » (4 strings) | N | FR | « melisma » |
| `i18n.ts:1175-1179, 1506, 1515-1516, 1527-1528, 1553, 1594` | « tessiture » | N | FR | « tessitura », plain |
| `i18n.ts:1782, 1787` | « Soprano colorature », « Mezzo-soprano colorature » | N | FR | « Coloratura », plain |

Three things the table shows. First, the only italics on Italian terms in Ilya's French today are the five `<em>piano</em>` / `<em>forte</em>` strings Dann ratified with N.172 on 2026-09-25 (`i18n.ts:1704`, the desk's note); every passaggio, legato, decrescendo and zona is roman. Second, the English never italicises any of these terms, including passaggio, so the two languages already differ. Third, `GuideContent.svelte:61` has the bare English « fry » where the rest of the French says « friture » (`i18n.ts:1068-1153`): a word choice, separate from italics, and Dann's.

## 3. One rule, PROPOSED, with its exceptions

**Default.** In Ilya's French, an Italian musical term is set in italics: *passaggio*, *passaggi*, *zona di passaggio*, *primo* and *secondo passaggio*, *legato*, *decrescendo*, *crescendo*, *piano* and *forte* as dynamics, and any score marking quoted as such. Authority: GDRM 08-itali (indications de dynamique et d'expression; mots étrangers) and 04-terme (« en les composant pour la plupart en italique »). This keeps the N.172 ratification as it stands and extends it.

**Depart from the default when** the word has been absorbed into French grammar: it carries a French spelling, a French plural, or a French derivation, or Usito gives it a headword AND Ilya uses it as an ordinary French noun rather than as a musical term quoted from the score. Under that condition these stay roman: *tessiture*, *mélisme*, *colorature*, *friture* (French words, not loanwords); *tempo* (« un tempo vif », « aucun tempo », plural *tempos*; `i18n.ts:1564-1566`, `GuideContent.svelte:179`, `LearnContent.svelte:985`); *coda* as a section heading (`LearnContent.svelte:2034`). This is the GDRM's own Ländler clause and the OQLF's francisé test, applied to the words where the two authorities agree.

**The genuinely open case: legato, crescendo, decrescendo.** Usito lists them (roman under the OQLF); the GDRM lists *legato* and *crescendo* in italics. Recommendation: italic, with the GDRM, because Dann named them in the instruction and because in Ilya they appear as performance instructions to the singer (« chanter le saut legato », « un léger decrescendo »), which is the GDRM's « indications d'expression » case. If Dann prefers the OQLF reading, the condition above widens to « Usito headword » alone, and legato, crescendo, decrescendo, piano and forte all go roman, which reverses N.172's `<em>piano</em>`.

**English.** The rule proposes no change to the English, which italicises none of these terms today (table). Two authorities for English are not in Ilya's files, so this memo does not pick one; Chicago (17th, 7.53-7.55) italicises isolated foreign words not in Merriam-Webster, and passaggio is not in Merriam-Webster, so italic *passaggio* in English would be defensible, but that is a separate ruling and the desk recommends leaving English alone until Dann asks.

## 4. The changes the default implies

| Where | Now | Proposed | Rendering cost |
|---|---|---|---|
| `i18n.ts:1180, 1182, 1183` | Passaggio, Passaggio primaire, Passaggio secondaire | *Passaggio*, *Passaggio* primaire, *Passaggio* secondaire | Plain `{T()}` at `CalibrationWizard.svelte:1567-1570`; needs `{@html}` or a runs renderer |
| `i18n.ts:1181` | La zona se situe | La *zona* se situe | same |
| `i18n.ts:760` | notes de passaggio | notes de *passaggio* | pushed as plain text, `analyze-score-adapter.ts:255` |
| `i18n.ts:1226` | votre passaggio | votre *passaggio* | plain `{T()}` at `InsightsPane.svelte:624` |
| `i18n.ts:1505, 1513, 1514` | Croisements de passaggio; les deux passaggi; Primo, secondo | *passaggio*; *passaggi*; *Primo*, *secondo* | plain `{T()}` at `InsightsPane.svelte:661-671` |
| `i18n.ts:1549` | près de votre passaggio | près de votre *passaggio* | plain `T()` at `InsightsPane.svelte:398` |
| `i18n.ts:1648-1652` | secondo passaggio (4) | *secondo passaggio* | free: `comment-text.ts:271-289` already turns `*…*` into italic runs |
| `i18n.ts:1676` | un léger decrescendo | un léger *decrescendo* | free, same path |
| `i18n.ts:1678` | le saut legato | le saut *legato* | free, same path |
| `i18n.ts:1717, 1729, 1758` | passaggio secondaire; vos passaggi; des passaggi | italic | free: `InsightsIntake.svelte:66, 99` render with `{@html}`; write `<em>` |
| `i18n.ts:1828-1829` | votre passaggio (2 watch lines) | italic | plain `fill(t())` at `watchlist.ts:640`; cost not established, see below |
| `GuideContent.svelte:61, 66, 68, 70` | zona di passaggio; passaggio (h4 and prose) | `<em>` | free, inline HTML |
| `LearnContent.svelte:742` | passages legato | passages `<em>legato</em>` | free, inline HTML |
| `i18n.ts:1741-1760` | `<em>piano</em>`, `<em>forte</em>` | unchanged | none |
| tempo, coda, tessiture, mélisme, colorature, friture | roman | unchanged | none |

Count: 24 French strings or passages change; 5 are already right; the English does not move. Of the 24, 13 render italics for free today and 11 need a rendering change on a plain-text path.

**One word-choice question, apart from italics (NEEDS DANN):** `GuideContent.svelte:61` « échantillons de fry » against « friture » everywhere else in the French. Recommendation: « échantillons de friture », matching `i18n.ts:1075`.

## Verdict

NEEDS DANN. One question: adopt the default above (GDRM: italics on passaggio, passaggi, zona, primo/secondo, legato, crescendo, decrescendo, piano, forte; roman for tempo, coda and the French words), or the OQLF reading (italics on passaggio and its family only, roman for the Usito headwords, reversing N.172's `<em>piano</em>`)? Recommendation: the GDRM default. It keeps what he ratified on 2026-09-25, it is his named authority for terminology, and it matches the five words he listed.

## Sources

- Roberge, GDRM, « Utilisation du romain, de l'italique et du gras »: <https://roberge.mus.ulaval.ca/gdrm/08-itali.htm> (read 2026-10-01; page dated 2026-08-05)
- Roberge, GDRM, « Termes allemands, italiens et latins courants »: <https://roberge.mus.ulaval.ca/gdrm/04-terme.htm>
- OQLF, Vitrine linguistique, « Emploi de l'italique ou du romain pour les mots en langue étrangère »: <https://vitrinelinguistique.oqlf.gouv.qc.ca/24351/la-typographie/mise-en-relief/italique/emploi-de-litalique-ou-du-romain-pour-les-mots-en-langue-etrangere>
- Usito headwords checked: crescendo, decrescendo, legato, forte, piano, tempo (present); passaggio (absent): <https://usito.usherbrooke.ca/définitions/crescendo> and siblings
- `docs/memory/INBOX.md:149-152, 196`; `docs/memory/PRODUCT.md:924-926`
- Code read this run: `apps/web/src/lib/i18n.ts` (lines cited), `GuideContent.svelte:16, 61-70, 179, 294`, `LearnContent.svelte:15, 742, 985, 1097, 2034, 2064`, `comment-text.ts:271-289`, `InsightsPane.svelte:398, 511, 624, 661-671`, `InsightsIntake.svelte:66, 76, 99`, `CalibrationWizard.svelte:1545-1570`, `analyze-score-adapter.ts:255`, `watchlist.ts:640`, `data/blurb-composer.json`

## What I could not establish

- Where the watch lines (`watch.line.*`, `watchlist.ts:640`) are finally rendered, and so whether italics there cost a template change or a print-path change. Settled by reading the consumer of `fill(t(...))` in `watchlist.ts` and the Markup pane.
- Whether Larousse or Le Robert agree with Usito on *passaggio* (absent) and *decrescendo* (present); only Usito was checked, as the Quebec reference nearest the OQLF.
- Any ruling by Dann on italics in the English, and which English authority Ilya follows; none found in `docs/memory/PRODUCT.md` or `INBOX.md` by grep for « italic ».
- Whether the GDRM's « pour la plupart » exempts *legato* and *crescendo* specifically; the page marks no term as roman except Ländler, so the exemption is inferred from the OQLF, not stated by Roberge.
