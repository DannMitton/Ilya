# MEMO. N.130: every ruled Insights string seated

**Claude Code, 2026-09-24, `Shane` at `d1cc2d3`, tree dirty. WRITTEN, not DONE.** This supersedes the two-string edit and keeps both lines. Each key matched once before writing. I changed eleven lines in `apps/web/src/lib/i18n.ts` and no others. No test pins any of these strings. Gates before and after: 216, 235, 0 errors and 12 warnings, 1402, 602 plus 5 skipped.

The file had no U+202F before this. `finding.passaggio` writes it as ` `, matching the file's other escapes. The page renders it: `passaggio ; `.

## Grep of `i18n.ts`, one line per key

The 250-word limit covers the prose, not this pasted block.

```
'insights.findings.heading':   { en: 'What is flagged, by how much time you spend singing it', fr: 'Ce qui est signalé, selon le temps de chant que vous y consacrez' },
'insights.findings.remainderOne': { en: 'One further finding prints in full on page 2.', fr: 'Une autre observation est imprimée en entier à la page 2.' },
'insights.findings.remainderMany': { en: '{n} further findings print in full on page 2.', fr: '{n} autres observations sont imprimées en entier à la page 2.' },
'insights.fit.colReference':   { en: 'Your references',              fr: 'Vos repères' },
'insights.finding.passaggio':  { en: 'This falls near your passaggio; expect the turn to want managing.', fr: 'Cela tombe près de votre passaggio\u202f; attendez-vous à devoir le gérer.' },
'insights.fit.crossingsCount': { en: '{primo} of the primo, {secondo} of the secondo', fr: '{primo} du primo, {secondo} du secondo' },
'insights.fit.passaggiTyped':  { en: 'Primo {primo}, secondo {secondo}, typed', fr: 'Primo {primo}, secondo {secondo}, indiqués' },
'insights.footnote.tessitura': { en: 'Tessitura by Pacheco’s method: the span from the lowest to the highest pitch sung for at least half as long as the longest-sung pitch. Alberto José Vieira Pacheco, “Angelica Catalani’s Voice According to a Method of Statistical Analysis,” <em>Journal of Singing</em> 69, no. 5 (2013), p. 559.', fr: 'Tessiture selon la méthode de Pacheco\u00a0: l\u2019étendue de la hauteur la plus grave à la hauteur la plus aiguë chantée au moins la moitié du temps de la hauteur la plus longuement chantée. Alberto José Vieira Pacheco, “Angelica Catalani\u2019s Voice According to a Method of Statistical Analysis,” <em>Journal of Singing</em> 69, no. 5 (2013), p. 559. [\u00ab\u00a0La voix d\u2019Angelica Catalani selon une méthode d\u2019analyse statistique\u00a0\u00bb.]' },
'insights.fit.nothingSung':    { en: 'Nothing sung to measure',      fr: 'Rien de chanté à mesurer' },
'insights.findings.furtherOne': { en: 'One further instance, in the score.', fr: 'Une autre occurrence, dans la partition.' },
'insights.phonation.findingOne': { en: 'One instance, {seconds} of phonation in all.', fr: 'Une occurrence, {seconds} de phonation en tout.' },
```

## Rendered

Headless Chromium, Cupid and Sunless 1, English and French, pages one and two, with a seeded test voice. I varied the voice's typed range and passaggio until each string appeared:

- **Both languages:** the heading, "Your references", the crossings count, the typed passaggi, the passaggio finding, the footnote, "One further instance" (Cupid, passaggio D4 to F4), and "One instance" (Sunless 1, the same).
- **English only:** `remainderOne`, with three findings and one deferred.
- **French only:** `remainderMany`, where the same voice defers two.

## NOT ESTABLISHED

- `fit.nothingSung` on a page. It needs a score with nothing sung.
- `remainderMany` in English and `remainderOne` in French.
- Dann's own voice.

**`git add`:** `apps/web/src/lib/i18n.ts`, this memo.
