# French for Insights, Design round 2: desk drafts for Dann (r1, 2026-10-11)

Drafted by the desk (Opus) 2026-10-11 about 04:00 for every string the accepted canvas marks `[FR: desk draft owed]` (`https://claude.ai/artifact/LKANkyy67TcChk4hAkQfRW`). Built from the French already in `apps/web/src/lib/i18n.ts`. Pitches in French follow the ruling of 2026-10-11 03:17 (solfège, French octave index). Spacing follows the OQLF table (non-breaking space before « : », none before « ; »).

## Glossary, adopted from the tree

| English | French | Source |
|---|---|---|
| turn, where a vowel turns | change de timbre, la hauteur où … change de timbre (autour de …) | `i18n.ts:1753`, `:1755` |
| first resonance | première résonance | `:1751`, `:1752` |
| range; compass | ambitus | `:1270`, `:1606` |
| tessitura | tessiture | `:1274`, `:1696` |
| typed (by the singer) | que vous avez indiqué(e) | `:1628`, `:1629` |
| vocal folds | cordes vocales | `:1715` |
| this piece | cette pièce | `:1640`, ruled heading |
| Seconds of phonation per vowel / per pitch | Secondes de phonation par voyelle / par hauteur | `:1671`, `:1704` |
| This key seems like a good fit for you. | Cette tonalité semble vous convenir. | `:1627` (as built) |
| Nothing in this piece is flagged for your voice. | Rien dans cette pièce n'est signalé pour votre voix. | `:1640` (as built) |

## The drafts

| # | English (as on the canvas) | French, desk draft | Agreement checked |
|---|---|---|---|
| 1 | This key suits your voice. A tone lower would keep more of the line below your passaggio. | Cette tonalité convient à votre voix. Un ton plus bas garderait une plus grande part de la ligne sous votre *passaggio*. | « une plus grande part », feminine |
| 2 | In {key}, {n} percent of the singing lies at or above your primo, and the {pitch} of bar {bar} becomes {pitch2}, under your secondo. | En {key}, {n} % du chant se situe sur votre *primo* ou au-dessus, et le {pitch} de la mesure {bar} devient {pitch2}, sous votre *secondo*. | « le {pitch} », a note named alone is masculine |
| 3 | Range | Ambitus | as built |
| 4 | What another key would change | Ce que changerait une autre tonalité | |
| 5 | What practice changes | Ce qui se travaille | heading with no noun, masculine singular |
| 6 | Compass {low} to {high} sits inside your range, {lo} to {hi}, typed. | L'ambitus de la pièce, {low} à {high}, entre dans le vôtre, {lo} à {hi}, tel que vous l'avez indiqué. | « tel » and « indiqué » agree with « le vôtre » (ambitus), masculine |
| 7 | {n} percent of the singing lies at or above your primo passaggio, {p}, and none above your secondo, {s}. | {n} % du chant se situe sur votre *primo passaggio*, {p}, ou au-dessus, et rien au-dessus de votre *secondo*, {s}. | |
| 8 | One note meets a vowel's first resonance (fR1): the [u] of bar 6, in "Where this piece meets your voice." | Une note rencontre la première résonance (fR1) d'une voyelle : le [u] de la mesure 6, dans « Là où cette pièce rencontre votre voix ». | |
| 9 | Notes in eleven bars sit near your passaggio: {bars}. | Dans onze mesures, des notes se situent près de votre *passaggio* : {bars}. | |
| 10 | The measures behind these reasons | Les données derrière ces constats | « mesures » avoided: in French it reads as bars |
| 11 | Your vocal folds contact about {n} times while singing this piece from beginning to end. | Vos cordes vocales entrent en contact environ {n} fois pendant que vous chantez cette pièce du début à la fin. | |
| 12 | {n} under your tessitura | {n} sous votre tessiture | |
| 13 | {n} within your tessitura, {low} to {high}, typed | {n} dans votre tessiture, {low} à {high}, telle que vous l'avez indiquée | « telle », « indiquée » agree with « tessiture », feminine |
| 14 | {n} above your tessitura | {n} au-dessus de votre tessiture | |
| 15 | against where each vowel turns in your voice | selon la hauteur où chaque voyelle change de timbre dans votre voix | |
| 16 | {n}% of your singing lies past the turn. | {n} % de votre chant se situe après le changement de timbre. | |
| 17 | before the turn / past the turn | avant le changement de timbre / après le changement de timbre | |
| 18 | {s}, all past the turn | {s}, entièrement après le changement | |
| 19 | {s}, {p} past | {s}, dont {p} après le changement | |
| 20 | turns about {pitch} | change de timbre autour de {pitch} | as `:1753` |
| 21 | A vowel turns about an octave under its first resonance in your voice (sources). The cycle dose counts vocal-fold cycles (source), set beside your tessitura after Titze 2008. | Dans votre voix, une voyelle change de timbre environ une octave sous sa première résonance (sources). La dose de cycles compte les cycles des cordes vocales (source) ; elle est placée à côté de votre tessiture d'après Titze 2008. | « placée » agrees with « la dose », feminine. Note: OQLF puts no space before « ; »; corrected in the tree copy |
| 22 | this piece's tessitura | la tessiture de la pièce | |
| 23 | your tessitura, typed | votre tessiture, telle que vous l'avez indiquée | feminine |

## Open choices for Dann

1. **Row 5, "What practice changes":** « Ce qui se travaille » (what can be worked on, the desk's pick) or « Ce que le travail peut changer » (closer to the English).
2. **Row 10, "The measures behind these reasons":** « Les données derrière ces constats » (the desk's pick, avoiding « mesures », which a French singer reads as bars) or « Ce sur quoi reposent ces constats ».
3. **Rows 11 and 21, the vocal folds:** « cordes vocales », as the tree has it (`:1715`), or « plis vocaux », the term current in voice science.

Coined by the desk: every sentence above that is not marked "as built". Adopted: the glossary terms, each with its line.

## Dann's rulings, 2026-10-11 04:12

- Row 4: « Ce que changerait une autre tonalité » (as drafted).
- Row 5: « Ce que le travail peut changer ».
- Row 10: « Ce sur quoi reposent ces constats ».
- Rows 11 and 21: « plis vocaux » (preferred), « cordes vocales » an entry term only (DeCS/MeSH). Row 11 becomes « Vos plis vocaux entrent en contact environ {n} fois pendant que vous chantez cette pièce du début à la fin. »; row 21's « des cordes vocales » becomes « des plis vocaux ».
- **The other rows: RATIFIED by Dann 04:14** (*"They read very well, yes."*). The whole table is ruled.

