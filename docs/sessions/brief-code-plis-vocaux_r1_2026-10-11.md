# Brief for Code: « plis vocaux » in Ilya's French (r1, 2026-10-11)

Written by the desk (Opus) 2026-10-11 about 04:15. For Code, Sonnet; the cloud lane or the Mac. QUEUE row 65.

## What the singer sees

A French-speaking singer reads « cordes vocales » in Learn and in the Insights cycle-dose line. Voice science in French now prefers « plis vocaux », as English moved from "vocal cords" to "vocal folds". After this row, Ilya's own French says « plis vocaux » everywhere, and the older term appears once, pointing to it.

## The ruling

Dann, 2026-10-11 04:12: *"We will also adopt « Plis vocaux » as the preferred term, with « Cordes vocales » kept only as an entry term pointing to it."* Source: the French MeSH (DeCS/BIREME), descriptor « Plis vocaux », with « Cordes vocales » as an entry term (`https://decs.bvsalud.org/fr/ths/resource/?id=15228`, read by the desk 2026-10-11). Recorded in `docs/memory/OPEN.md` and `CONTRACT.md` §6.

## What to change (found by the desk's grep, 2026-10-11)

1. `apps/web/src/lib/i18n.ts:1715`, `insights.figure.cycleDose`, French: « collisions des cordes vocales » becomes « collisions des plis vocaux ». Its comment says the string was ratified 2026-09-30; add a line that the term changed by Dann's ruling of 2026-10-11 04:12.
2. `apps/web/src/lib/components/Reading/LearnContent.svelte`: five occurrences of « cordes vocales » (grep finds them, starting near `:1806` and `:1811`). Replace each with « plis vocaux » and **fix every agreement**: « cordes » is feminine plural, « plis » masculine plural. Example: « Les cordes vocales vibrent-elles » becomes « Les plis vocaux vibrent-ils ».
3. **The entry term, once:** at the first occurrence in Learn, write « plis vocaux (souvent appelés « cordes vocales ») ». Nowhere else. (DESK DEFAULT for where the pointer lives; the French Guide's conventions section, a separate item, will also list it.)

## Leave alone

- `data/dictionary.*-gloss-a.json`: the glosses « voix, son produit par les cordes vocales » are kaikki.org dictionary text (CC BY-SA), a source's words, not Ilya's. Do not edit them.
- English: no "vocal cords" appears in `apps/web/src` (grep 2026-10-11).

## Constraints

- No git command that writes, including `add`, `commit`, `stash`, `checkout`, `restore`, `reset`, and `worktree`.
- Every changed French sentence is listed in the report, before and after, for Dann's look. No other French changes.
- All eight gates against gate 4 `2088`; say if a count moves.

## Report back

`docs/sessions/report-code-plis-vocaux_r1_2026-10-11.md`: each change with `path:line`, the sentences before and after, the gates, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Set QUEUE row 65 in one line and stop.
