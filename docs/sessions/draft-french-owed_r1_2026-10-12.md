# French owed from rows 66, 67, and 70: drafts for Dann's ruling (r1, 2026-10-12)

Drafted by the desk (Opus) 2026-10-12 about 01:44, under `CONTRACT.md` §4 (the desk drafts the French; Dann rules). **Nothing here is in the tree.** Each draft is built from French already ratified in `apps/web/src/lib/i18n.ts` (read this session, lines 1733 to 1799 and 2097 to 2102); the source of each wording is named on its row. No word is coined: every term is adopted from a ratified neighbour, named in the row.

## A. Row 66: the twelve Insights strings still in English (`[FR: desk draft owed]`)

**RATIFIED by Dann 2026-10-12 11:48, all twelve as drafted** (*"I ratify the twelve as drafted"*), including the drafts of C1 (« de leur voyelle »), C2 (« à un triton ou moins »), and C3 (« Transposée {interval} plus bas », which needs the lower-case interval in French). Row 4 drew his word at 11:47: *"This is elegant."* Not yet in the tree; a Code row seats them. **Open beside it:** Dann's unease of 11:46 with "secondo" and "primo" used alone; if he rules the full term, rows 1, 2, 7, and 9 change with it.

Read in the tree 2026-10-12: `apps/web/src/lib/i18n.ts:1749-1788`, filled by `apps/web/src/lib/insights/singer-blocks.ts:151-245`. The thirteenth string Code listed, `insights.r2.vowels.noTurn`, already carries French in the tree, so twelve remain.

| # | Key | English | Draft French | Built from (ratified) | Agreement checked |
|---|---|---|---|---|---|
| 1 | `unlikely.share` | In this key, {n} percent of the singing lies above your primo passaggio, {primo}. | Dans cette tonalité, {n} % du chant se situe au-dessus de votre *primo passaggio*, {primo}. | `unlikely.shareHeld`, its first clause verbatim | « se situe » with « {n} % du chant » (singular, as ratified) |
| 2 | `unlikely.held` | In this key, bar {bar} holds {a} {pitch} {vowel} for about {s} seconds, above your secondo, {secondo}. | Dans cette tonalité, la mesure {bar} prolonge un {vowel} sur {pitch} pendant environ {s} secondes, au-dessus de votre *secondo*, {secondo}. | `unlikely.shareHeld`, its second clause verbatim | « un {vowel} »: a sound named alone is masculine (`CONTRACT.md` §6). `{a}` is not used in French, as in `shareHeld` |
| 3 | `unlikely.range` | Bar {bar} reaches {a} {pitch}, outside the range you typed, {low} to {high}. | La mesure {bar} atteint {pitch}, hors de votre ambitus, {low} à {high}, tel que vous l'avez indiqué. | `range.inside` (« le vôtre, {lo} à {hi}, tel que vous l'avez indiqué ») | « indiqué » agrees with « ambitus », masculine |
| 4 | `unlikely.alone` | This makes the song unlikely to sit comfortably in your voice as written. | Cet élément fait que la pièce, telle qu'écrite, a peu de chances de reposer avec aisance dans votre voix. | `unlikely.together` (« Ensemble, ces éléments font que … ») | « telle » with « pièce »; « Cet élément » singular for one reason |
| 5 | `noBetterKey` | No other key within a tritone fits your voice better. | Aucune autre tonalité, à un triton ou moins, ne convient mieux à votre voix. | « convient à votre voix » from `better.tone`; « triton » from `key.ruler.interval.6` | « Aucune autre tonalité » feminine singular, verb singular |
| 6 | `better.interval` | This key suits your voice. {A} lower would keep more of the line below your passaggio. | Cette tonalité convient à votre voix. {A} plus bas garderait une plus grande part de la ligne sous votre *passaggio*. | `better.tone` verbatim, with « Un ton » replaced by `{A}` | `{A}` is the capitalized French interval (`key.ruler.interval.*`, « Une tierce mineure »); « plus bas » is adverbial and does not agree |
| 7 | `inKeyShare` | In {key}, {n} percent of the singing lies at or above your primo. | En {key}, {n} % du chant se situe sur votre *primo* ou au-dessus. | `inKey`, its first clause verbatim | as row 1 |
| 8 | `range.outside` | Compass {low} to {high} reaches outside your range, {lo} to {hi}, typed. | L'ambitus de la pièce, {low} à {high}, dépasse le vôtre, {lo} à {hi}, tel que vous l'avez indiqué. | `range.inside` verbatim, « entre dans » replaced by « dépasse » | « tel … indiqué » with « le vôtre » (ambitus), masculine |
| 9 | `primo.some` | {n} percent of the singing lies at or above your primo passaggio, {p}, and {m} percent above your secondo, {s}. | {n} % du chant se situe sur votre *primo passaggio*, {p}, ou au-dessus, et {m} % au-dessus de votre *secondo*, {s}. | `primo.none` verbatim, « et rien au-dessus » replaced by « et {m} % au-dessus » | as row 1 |
| 10 | `compare` | A key {interval} lower would bring that to {m} percent, and the compass, {low} to {high}, stays inside your range. | Transposée {interval} plus bas, la pièce ramènerait cette part à {m} %, et son ambitus, {low} à {high}, resterait dans le vôtre. | « ambitus », « le vôtre » from `range.inside`; « transposer un ton plus bas » is the usual French construction, without a preposition | « Transposée » with « la pièce ». **Code dependency:** the French `{interval}` must be lower case here (« une tierce mineure »), and `key.ruler.interval.*` carries it capitalized. A brief would add a lower-case form or lower the first letter in French |
| 11 | `fr1.many` | {count} notes meet a vowel's first resonance (fR1), in "{heading}." | {count} notes rencontrent la première résonance (fR1) de leur voyelle, dans « {heading} ». | `fr1.one` (« rencontre la première résonance (fR1) d'une voyelle … dans « {heading} » ») | « leur voyelle »: each note meets its own vowel's resonance; « d'une voyelle » with a plural subject would read as one shared vowel. **Open choice, see C1** |
| 12 | `nearPassaggioOne` | Notes in bar {bars} sit near your passaggio. | Dans la mesure {bars}, des notes se situent près de votre *passaggio*. | `nearPassaggio` verbatim, singular | « des notes se situent » plural |

**The two lines Code drafted for row 21, as built, for your eye:** `insights.r2.sourcesLine` French (`i18n.ts:1818`) and `insights.r2.pitchKey`, which now reads « (A4 = 440 Hz) » in both languages after your ruling of 2026-10-11 04:58 (`i18n.ts:1823`). The « la3 » Code's report mentions is no longer in the tree.

## B. Row 70: the five desk-derived sentences, as built

Built by Code (`docs/sessions/report-code-french-person-nouns-applied_r1_2026-10-11.md`, "For Dann"; shipped `fd1c86a`). Each follows your rulings of 2026-10-11 13:56 to 14:47, but its words were not given. The desk read each against its ruling and has no change to offer; they are listed so you can ratify or edit them.

**RATIFIED by Dann 2026-10-12 20:28, all five as built** (*"Ratified"*). Already in the tree since `fd1c86a`; nothing to build.

| # | Where | As built |
|---|---|---|
| 1 | Guide, row 15 | « … prioriser votre autonomie croissante, plutôt que de préconiser un modèle où vous restez tributaire de la disponibilité de ressources imprimées … » (« tributaire » is épicène, so no « limité(e) ») |
| 2 | Guide, row 23 | « … vous permettant de repérer les enjeux phonologiques les plus significatifs. » |
| 3 | Guide, row 24 | « … ne sont limitées que par votre intérêt et votre capacité à enrichir Ilya … » |
| 4 | Learn, row 103 | « Si elle est appariée, cherchez un agent à sa droite. » (its old « il » meant the singer, whom the ratified draft removed) |
| 5 | Learn, row 104 | « … laisse passer, vous avez intériorisé le système. » (completes the ratified « Si vous pouvez expliquer ») |

## C. Row 67: the three open items in `draft-french-guide-conventions_r1_2026-10-11.md`

**RATIFIED by Dann 2026-10-12 20:30, both draft lines (items 1 and 3) as drafted** (*"I ratify both."*). Not in the tree; QUEUE row 90 seats them in the Guide's conventions list.

1. **The source of feminine-first order. Now sourced.** The OQLF says the order in a doublet is generally free, and that a fixed order may be adopted, masculine-first or feminine-first (« Qu'est-ce qu'un doublet? », *Banque de dépannage linguistique*, https://vitrinelinguistique.oqlf.gouv.qc.ca/23991/, read 2026-10-12 about 01:42). The same page prefers the masculine noun nearest an agreeing adjective, which feminine-first gives. **Draft line for the Guide's conventions list:** « Le féminin en premier : l'OQLF laisse l'ordre libre et recommande de placer le masculin le plus près de l'adjectif qui s'accorde; Ilya place donc le féminin en premier. » Your choice remains yours: the OQLF permits it, it does not require it.
2. **Quebec octave usage. Closed by your ruling, nothing owed.** Your ruling of 2026-10-11 04:58 (letters with the American index, after Roberge) replaced the French index, so Quebec's own octave usage no longer decides anything Ilya prints. The pitch key « (A4 = 440 Hz) » stays for a French reader whose index puts 440 Hz at la3 (`i18n.ts:1822`, desk's comment).
3. **The OQLF page for references. Now named.** « Éléments des notices bibliographiques », *Banque de dépannage linguistique*, https://vitrinelinguistique.oqlf.gouv.qc.ca/23245/ (read 2026-10-12 about 01:42): place, comma, publisher (« Paris, Larousse, 1995 »); an article's title in « » in roman, the journal in italics, then « vol. 8, no 4, décembre 2001, p. 35-48. » This matches what QUEUE row 2i built (`fullReference`). **Draft line for the conventions list:** « Références : selon la notice bibliographique de l'OQLF (lieu, éditeur, année). » Seating it is a small Code row once you rule.

## Choices that are yours

- **C1, `fr1.many`:** « de leur voyelle » (each note's own vowel, the desk's draft) or « d'une voyelle » (mirrors `fr1.one` word for word).
- **C2, `noBetterKey`:** « à un triton ou moins » (draft) or « dans l'intervalle d'un triton ».
- **C3, `compare`:** the « Transposée … » construction (draft) needs the lower-case interval; « Une tonalité plus basse de {interval} … » would need the same, plus « de » eliding before « un » and « une ».
