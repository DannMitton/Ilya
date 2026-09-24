# CODE BRIEF. N.130: seat every ruled Insights string in the tree

**Written by the desk 2026-09-24 15:50. For Claude Code, in `~/Desktop/ilya-rewrite` on branch `Shane`.** House rules: no git writes, gates before and after, Canadian spelling, no em dashes. **This supersedes the two-string paste of 15:44; if you already made those two edits, keep them and continue here.**

## Why

Dann's French rulings of 2026-09-22 on Insights never reached the tree (the desk checked `apps/web/src/lib/i18n.ts` against `docs/sessions/insights-french-as-built_r3_2026-09-22.md` at 15:50 on 2026-09-24; none were present). Today he ratified more. Every row below is a ruling; its source is that file unless marked. **Change only these keys. Keep each line's escaping convention** (`’`, ` ` before `:`, escaped guillemets with ` ` inside).

## The strings (all keys under `insights.`)

| key | EN, target | FR, target | source |
|---|---|---|---|
| `findings.heading` | What is flagged, by how much time you spend singing it | Ce qui est signalé, selon le temps de chant que vous y consacrez | ruled 2026-09-22 |
| `findings.remainderOne` | One further finding prints in full on page 2. | Une autre observation est imprimée en entier à la page 2. | clause struck 2026-09-22; « Une » ruled 2026-09-24 15:46; EN "One" is DESK DEFAULT, to mirror |
| `findings.remainderMany` | {n} further findings print in full on page 2. | {n} autres observations sont imprimées en entier à la page 2. | ruled 2026-09-22 |
| `fit.colReference` | Your references | (keep « Vos repères ») | ruled 2026-09-22 ("align the English") |
| `finding.passaggio` | (keep) | Cela tombe près de votre passaggio ; attendez-vous à devoir le gérer. | ruled 2026-09-22 22:49; U+202F before the semicolon |
| `fit.crossingsCount` | (keep) | {primo} du primo, {secondo} du secondo | ruled 2026-09-22 |
| `fit.passaggiTyped` | (keep) | Primo {primo}, secondo {secondo}, indiqués | ruled 2026-09-22 |
| `footnote.tessitura` | (keep) | replace the tail ` », <em>Journal of Singing</em>, vol. 69, no 5, 2013, p. 559.]` with ` ».]`, nothing else on the line | ruled 2026-09-22 |
| `fit.nothingSung` | (keep) | Rien de chanté à mesurer | ruled 2026-09-24 15:37 |
| `findings.furtherOne` | One further instance, in the score. | Une autre occurrence, dans la partition. | FR ruled 2026-09-24 15:43; EN DESK DEFAULT, to mirror |
| `phonation.findingOne` | One instance, {seconds} of phonation in all. | Une occurrence, {seconds} de phonation en tout. | FR ruled 2026-09-24 15:46; EN DESK DEFAULT, to mirror |

**Assert every anchor before you write: each key must match exactly once.** If a test pins an old string, update the test to the ruled string and name it in the memo.

## Done when

- Gates at baseline, or moved only by tests you name.
- A grep of `i18n.ts` for each key shows the target text, pasted into the memo, one line per key.
- Insights rendered in French and English on a song with at least one finding, page one and page two, and described.

## Return

A memo of at most 250 words with a section headed "NOT ESTABLISHED", saved as `docs/sessions/memo-code-n130-strings_r1_2026-09-24.md`. Stop before shipping.
