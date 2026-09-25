# French draft, r1: N.172's intake questions

Written by the desk 2026-09-25, about 04:50, while Dann was away. **A PROPOSAL for Dann to rule on.** Nothing reaches `i18n.ts` until he rules it.

**It translates an English draft that is not ruled either:** `draft-n172-intake-survey_r1_2026-09-24.md`. STATE.md still asks Dann to add, cut, or reword those questions. If the English changes, this follows it. Drafting both now saves a second sitting.

**Drafted from the French already in `apps/web/src/lib/i18n.ts`** (the tree at `b2fde8f`).

## The glossary: adopted or coined

| English | French | Source |
|---|---|---|
| range | ambitus | ADOPTED, `insights.fit.range` and the verdicts |
| upper passaggio | passaggio secondaire | ADOPTED, `calib.characteristics.passaggioSecondaryLabel` |
| observation | observation | ADOPTED, `insights.findings.remainderOne` |
| Insights | Aperçus | ADOPTED, `insights.identity` |
| in performance | en concert | COINED. **Your call:** « sur scène » is shorter; « en représentation » suits opera better. |
| in practice (the practice room) | à l'étude | COINED. **Your call:** « en travail » is the alternative. |
| songs | le répertoire | COINED. The English contrasts exercises with songs. « Les mélodies » would narrow it to art song. |
| softly | piano | COINED. **Your call:** « doucement » is plainer, but « piano » is what a singer says. |
| Not sure | Je ne sais pas | COINED |
| Skip | Passer | COINED |

**Register:** the app addresses the singer as « vous ». The answers are the singer speaking, so they are in the first person, and « cela » replaces « ça ».

**Agreement, and why the answers avoid it.** No answer uses an adjective that describes the singer. An answer such as « je suis prêt » would have to agree with the singer's gender, and the app does not know it. Every adjective here describes the voice, the notes, or the passage (N.172's spec, "French").

## The questions

**1. Le haut de votre voix, autour et au-dessus de votre passaggio secondaire.**
1. J'y chante rarement pour l'instant.
2. Je peux l'atteindre, mais c'est imprévisible.
3. Cela fonctionne à l'étude quand je le prépare.
4. C'est fiable en concert la plupart du temps.
5. C'est fiable, et je peux le colorer à mon gré.

*Referent: « le » is « le haut », masculine.*

**2. Le bas de votre ambitus.**
1. J'y chante rarement pour l'instant.
2. Les notes sortent, mais elles manquent de corps.
3. Elles portent quand je les prépare.
4. Elles portent en concert la plupart du temps.
5. Elles portent de façon fiable, et je peux les colorer à mon gré.

*Referent: « elles », « les » are « les notes », feminine plural.*

**3. Le passage par votre passaggio.**
1. J'entends un net changement dans mon son à cet endroit.
2. Je peux l'égaliser dans les exercices, pas encore dans le répertoire.
3. Il est homogène dans le répertoire quand je le prépare.
4. Il est homogène en concert la plupart du temps.
5. Il est parfaitement homogène, et je choisis où la couleur change.

*Referent: « il », « le » are « le passage », masculine. The heading names « le passage » so the pronouns have a noun to agree with; an infinitive heading (« Traverser... ») would leave them without one.*

**4. Les notes tenues longtemps.**
1. Les notes longues me fatiguent vite.
2. Je peux les tenir, mais le son vacille ou s'amincit.
3. Elles restent stables quand je prévois mon souffle.
4. Elles sont stables en concert la plupart du temps.
5. Elles sont stables, et je peux les façonner à mon gré.

*Referent: « elles », « les » are « les notes », feminine plural.*

**5. Chanter piano dans l'aigu.**
1. Chanter piano dans l'aigu ne m'est pas encore accessible.
2. Je peux chanter piano dans l'aigu, mais cela reste fragile.
3. Cela fonctionne quand je le prépare.
4. C'est fiable en concert la plupart du temps.
5. C'est fiable, et je passe librement du piano au forte à cet endroit.

*Referent: « accessible » agrees with the infinitive subject « chanter piano », masculine singular. « le » in answer 3 is the act of singing piano, masculine.*

**6. Ce que vous attendez des Aperçus.** One switch per topic:

- notes aiguës
- notes graves
- le passage par le passaggio
- notes tenues
- piano dans l'aigu
- choses à remarquer

**The line that counts hidden comments:** « {n} observations masquées par vos réglages » (« masquées » agrees with « observations », feminine plural). For one: « Une observation masquée par vos réglages ».

## What the desk is least sure of

1. **« Cela fonctionne à l'étude »** for "It works in practice". It may read as "in study" rather than "in the practice room".
2. **« prévois mon souffle »** for "plan the breath". « je planifie ma respiration » is more literal and stiffer.
3. **The heading of question 3.** « Le passage par votre passaggio » repeats the root. « La traversée de votre passaggio » avoids the repetition and keeps a feminine noun, but then every « il » in the answers becomes « elle ».
