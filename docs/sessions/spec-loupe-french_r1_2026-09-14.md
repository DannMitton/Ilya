# Spec: the loupe's French. Dann's rulings, 2026-09-14

**This file holds ruled French only. Nothing in it is coined by the desk unless
the line says so, and every adopted word names where it was adopted from.**

Bears on N.130 and N.131. The triage that produced it is in the session record:
of ten `loupe.*` entries whose French slot holds English, **two are identical in
French on purpose and are not defects**, and eight are genuinely untranslated.

## Not defects. Leave them

- `i18n.ts:410` `loupe.pitch.octave`, "octave". The same word in French.
- `i18n.ts:489` `loupe.station.corrections`, "Corrections". The same word in French.

## RULED 2026-09-14: « mélisme »

**Dann's ruling, in one word: « mélisme ».** Adopted from French musicology. It
had not appeared anywhere in `i18n.ts` before this ruling. It is masculine, so
its participles take no final e.

« vocalise » was put to him and ruled out by the desk before he chose, because it
collides with the exercise sense in a voice application.

| line | key | en | fr, RULED |
|---|---|---|---|
| 419 | `loupe.melisma` | `Melisma` | « Mélisme » |
| 391 | `loupe.undo.melisma` | `melisma set` | « mélisme défini » |
| 392 | `loupe.undo.melismaOff` | `melisma cleared` | « mélisme effacé » |
| 422 | `loupe.lyric.melisma` | `This note sustains the syllable` | « Cette note prolonge la syllabe » |
| 388 | `loupe.undo.placed` | `syllable placed` | « syllabe placée » |

**Line 388 was RATIFIED by Dann 2026-09-14. Nothing in it is coined.** « placées »
is in use at `intake.placed:625`, and the file's own comments at `:1339` and
`:1348` record « placement » as ratified across `upload.*`, `binder.*` and
`replace.*`.

**Line 422 is ruled by Dann's choice of option A, 2026-09-14**, which carried
« prolonge ». That string is a sentence rather than the term, so it does not use
« mélisme » at all. **« prolonge » is COINED for this file**: no form of it
appears in any other French slot. « soutient » was the alternative put beside it
and was not taken.

**Where the participles come from.** « défini » is adopted from
`i18n.ts:471`, `loupe.undo.tuplet`, « nolet défini ». « effacé » is adopted from
`i18n.ts:383`, `loupe.undo.restored`, « corrections effacées ». The whole
`loupe.undo.*` family is noun plus agreeing past participle with no article, and
these two join it unchanged.

## RULED 2026-09-14: « Refaire » moves to Redo

**Dann ruled option B.** Both words French software normally uses for Redo were
already spent in this file, so one had to move.

| line | key | en | fr, RULED |
|---|---|---|---|
| 387 | `loupe.redo` | `Redo: %s` | « Refaire\u00a0: %s » |

The hard space before the colon is adopted from the sibling string
`loupe.undo:377`, « Annuler\u00a0: %s », and follows Dann's ruling of 2026-08-21
on Canadian French colon spacing.

**« Rétablir » does NOT move.** It stays with Restore at `loupe.restore:483`,
where the comment at `:477-478` records its adoption from
`meta.revertToScore:759`. Dann was told that « Rétablir » is the more conventional
Redo in French software; the desk marked that a prior rather than a source, and he
ruled anyway.

**CONSEQUENCE, and it is the cost of B: `calib.common.retake:965` loses
« Refaire » and needs a word.** Its English is "Re-take".

**RULED BY DANN 2026-09-14: « Réessayer ».** His reason, in his words: it is
Canadian French, and *"every Canadian sees this word in the Tim Horton's Roll up
the Rim to Win campaign every year."* So it is ADOPTED from general Canadian
French usage, not coined, and not adopted from anywhere else in this file.

**The desk's « Recommencer » was the wrong word and was withdrawn.** English keeps
"Re-take" and "Start over" as two words, and « Recommencer » collapsed them,
because `station.startOver:1328` already reads « Recommencer le placement ». A
calibration re-take is another attempt rather than a restart, and « Réessayer »
keeps that distinction where « Recommencer » lost it.

| line | key | en | fr, RULED |
|---|---|---|---|
| 965 | `calib.common.retake` | `Re-take` | « Réessayer » |

**On the form, stated so Dann can correct it in one word.** The file's buttons are
infinitives: « Rétablir » (`loupe.restore:483`), « Recommencer le placement »
(`station.startOver:1328`). So the infinitive « Réessayer » is written here, with
the acute and the double e. The Roll Up the Rim cup carries the imperative,
« Réessayez »; that is the same verb in the form a cup addresses you in, and it is
not the form this file uses for controls.

## RULED 2026-09-16: the undo clause for Start placement over

**Dann chose option A, 2026-09-16.** Nothing is coined: both halves are adopted
from the button itself, `station.startOver:1328`, "Start placement over" /
« Recommencer le placement ». The line then reads « Annuler\u00a0: placement
recommencé ».

| line | key | en | fr, RULED |
|---|---|---|---|
| new, beside `:388` | `loupe.undo.startOver` (DESK DEFAULT name) | `placement started over` | « placement recommencé » |

**Put to him beside two alternatives, not taken:** "placements rebuilt" /
« placements reconstruits », and "placements reset" / « placements
réinitialisés ».

**NOT ESTABLISHED, for the build:** whether Start placement over pushes onto the
loupe's undo stack today. The clause is useless if it does not; Code checks
before wiring it.

## RULED 2026-09-16: the beat position

**Dann chose option A, 2026-09-16.** « temps » and « division » had appeared in no
French slot before this ruling. **The desk proposed them from its own prior on
French music terminology, not from a source read that session;** Dann ratified
them. « division » names what `entry.ts` counts: one pulse is `1 / division` of a
beat, with a division of 3 in compound metre and 2 otherwise.

| line | key | en | fr, RULED |
|---|---|---|---|
| 373 | `loupe.beat` | `beat %b` | « temps %b » |
| 374 | `loupe.beatPulse` | `beat %b, pulse %p` | « temps %b, division %p » |

**Not taken:** « subdivision » (longer, and usually a finer split), and
« pulsation » (in French teaching it often names the beat itself).

## STILL OPEN

Nothing in the loupe's French, as of 2026-09-16.

---
*Instrument: `i18n.ts` read in the ranges `375-395`, `468-475`, and by targeted
grep, 2026-09-14. The file was not read in full.*
