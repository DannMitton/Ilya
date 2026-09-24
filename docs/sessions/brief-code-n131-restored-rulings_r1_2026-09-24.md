# CODE BRIEF. N.131: four rulings of 2026-09-16 restored

**Written by the desk 2026-09-24 18:55. For Claude Code, in `~/Desktop/ilya-rewrite` on branch `Shane`.** No git writes, gates before and after, Canadian spelling, no em dashes. Keep each line's escaping convention (`’` for the apostrophe).

Source: `docs/sessions/memo-audit-rulings-vs-tree_r1_2026-09-24.md`, section "DANN'S RULINGS ON THESE ROWS", ruled 2026-09-24 18:52 to 18:53.

| key (`apps/web/src/lib/i18n.ts`) | EN, target | FR, target |
|---|---|---|
| `intake.clear` | (keep "Clear") | Retirer |
| `intake.dropHint` | Drop your file here. | Déposez votre fichier ici. |
| `intake.pdf.reading` | (keep) | Lecture des mots du PDF… |
| `intake.picture.reading` | (keep) | Lecture des mots de l’image… |

**Do not touch `notePicker.clear`** (stays « Effacer »). Assert each key matches exactly once. If a test pins an old string, update it and name it.

**Done when:** gates at baseline or moved only by named tests; a grep line per key in the memo; the Entrée band seen in both languages with the new hint and « Retirer ».

**Return:** memo, at most 150 words, with "NOT ESTABLISHED", at `docs/sessions/memo-code-n131-restored-rulings_r1_2026-09-24.md`. Stop before shipping.
