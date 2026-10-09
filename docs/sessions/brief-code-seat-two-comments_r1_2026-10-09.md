# Brief for Code: seat the two ratified comment actions (r1, 2026-10-09)

Written by the desk (Opus) 2026-10-09 about 01:08. **For the cloud lane**, Sonnet, with `brief-code-bars-to-confirm_r1_2026-10-09.md`, after it. Small: two strings and two flags.

## 1. What was observed

A French page leaves out two Insights comments, because their French was owed. Their English was the desk's and unread by Dann. Both are now ratified in both languages (`docs/memory/OPEN.md`, N.168, the two lines of 2026-10-09).

## 2. What is established (read by the desk 2026-10-09)

- `apps/web/src/lib/i18n.ts:1784` is a comment saying the two entries are OWED; `:1785` is `comment.working.try.mixed.action`; `:1786` is `comment.working.try.preface.action`. Both carry the desk's old English in both slots.
- `apps/web/src/lib/insights/comment-text.ts:81` (row `mixed`) and `:85` (row `preface`) carry `frenchOwed: true`.
- Each action follows the opener `comment.opener.7`, « {author} propose {de}{action} » (`i18n.ts:1770`), so the French is an infinitive phrase.

## 3. Measure before you change anything

Find every test or snapshot that names either key, `frenchOwed`, or the old English. List them before you change anything.

## 4. The rulings this serves (Dann, 2026-10-09 01:02 to 01:06; `OPEN.md`, N.168)

Copy these exactly, characters included (the typographic apostrophe in « d’abord », the guillemets around « you », and the OQLF spaces the table in row 2g requires):

| Key | English | French |
|---|---|---|
| `comment.working.try.mixed.action` | singing the passage first entirely on [œ], then beginning each note on the briefest [œ] and moving at once to the written vowel, before returning to the text | chanter d’abord le passage entièrement sur [œ], puis commencer chaque note sur le plus bref [œ] en passant aussitôt à la voyelle écrite, avant de revenir au texte |
| `comment.working.try.preface.action` | singing “you” on a quick five-note descending scale, then dropping the [j] and singing only the [{vowel}], keeping the same shape of lips and face | chanter « you » sur cinq notes descendantes rapides, puis omettre le [j] et ne chanter que le [{vowel}], en gardant la même forme des lèvres et du visage |

Source: Miller 2004, *Solutions for Singers*, p. 79 (row 1) and p. 77 (row 2). The citation rows (`MIL04-010`, `MIL04-008`) and their pages in `comment-sources.ts` do not change.

## 5. Constraints

- Replace the OWED comment at `i18n.ts:1784` with one saying both were ratified by Dann on 2026-10-09.
- Set `frenchOwed` to false, or remove it, on rows `mixed` and `preface`, whichever the code's other rows do.
- No other string changes. Commit and push to `cloud-lane` only. **What this displaces:** nothing.

## 6. Done when

- A French page shows both comments where their conditions fire; an English page shows the new English.
- The French-spacing test (row 2g) passes on both strings.
- All eight gates, against the baselines in `brief-code-bars-to-confirm_r1_2026-10-09.md` section 7, plus any test count you changed, named.

`WRITTEN` on the code. `DONE` is Dann's look.

## 7. Report back

A section in `docs/sessions/report-code-bars-to-confirm_r1_2026-10-09.md` headed "The two comments": the change with its `path:line`, the tests, the gates, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Push, and stop.
