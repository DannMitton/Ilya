# MEMO. N.131: four rulings of 2026-09-16 restored

**Claude Code, 2026-09-24, `Shane` at `2f955e6`, tree dirty. WRITTEN, not DONE.** I checked that each key matched exactly once, then changed four lines in `apps/web/src/lib/i18n.ts` and nothing else. No test pins these strings. `notePicker.clear` is unchanged. Gates before and after: 216, 235, 0 errors and 12 warnings, 1402, and 602 plus 5 skipped.

```
659:	'intake.clear':       { en: 'Clear',      fr: 'Retirer' },
664:	'intake.dropHint':    { en: 'Drop your file here.', fr: 'Déposez votre fichier ici.' },
672:	'intake.pdf.reading': { en: 'Reading the words out of the PDF…', fr: 'Lecture des mots du PDF…' },
691:	'intake.picture.reading': { en: 'Reading the words out of the picture…', fr: 'Lecture des mots de l’image…' },
1206:	'notePicker.clear':           { en: 'Clear',       fr: 'Effacer' },
```

**Walk** (dev server, `sunless.localhost`, one typed line). In English, Input shows "Drop your file here." and "Clear". In French, Entrée shows « Déposez votre fichier ici. » and « Retirer ».

## NOT ESTABLISHED

- The two reading lines on screen, because no PDF or picture was read.
- The score receipt's « Retirer », because no score was loaded.
- The comments at `i18n.ts:634` and `IntakePanel.svelte:400` and `:415` still describe the old hint. I left them unchanged.
