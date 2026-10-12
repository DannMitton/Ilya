# Report: the French Guide states its conventions (QUEUE row 67, r1)

**QUEUE row 67, state: WRITTEN, pushed to `cloud-lane`. The French Guide's « Langue. » paragraph is now Dann's ratified text: a lead sentence and five conventions, each with its authority. `DONE` is Dann's look.** The desk carries this line into `QUEUE.md`; this session does not edit `docs/memory/`.

Written by Code (cloud lane) 2026-10-12, for `docs/sessions/brief-code-french-guide-conventions_r1_2026-10-11.md` with its amendments of 2026-10-11 19:30, on `cloud-lane` after row 62 (`1ad51fdf`), clean tree before the first edit.

The brief's hold is met: row 57's run 2 has reported. The amendments are met as follows.

- **Spacing by hand, plus a test.** The text is spaced by hand: `&#160;` before every « : » and inside every « ». The French spacing test now covers the Guide's French branch; row 70 extended it, and this paragraph passes it.
- **`french-italics.test.ts` stays green.**
- **The pitch line is letters with the American index.**

## The diff

`apps/web/src/lib/components/Reading/GuideContent.svelte:283-291`, French branch only. The one-paragraph « Langue. » is replaced by:

- **A comment** naming the ruling and the draft.
- **One `<p>`:** the lead, « **Langue.** Le français d’*Ilya* suit des autorités nommées. Chaque convention est énoncée ici, avec sa source, afin que vous puissiez la vérifier. »
- **A `<ul>` of five items**, each opening with `<strong>`, verbatim from "The draft" in `docs/sessions/draft-french-guide-conventions_r1_2026-10-11.md` (RATIFIED 04:55; « Hauteurs » RATIFIED 05:02):
  - « Espacement et ponctuation. »
  - « Termes musicaux italiens. »
  - « Noms de personnes. »
  - « Hauteurs. »
  - « Plis vocaux. »
- **Italics:** *Ilya*, *passaggio*, *legato*, *crescendo*, the title *Guide des difficultés de rédaction en musique*, and *scientific pitch notation*.
- **Links:**
  - the OQLF, on « Office québécois de la langue française », with the same spacing page the old paragraph linked;
  - Roberge's guide (`https://roberge.mus.ulaval.ca/gdrm/`) on its title, as before;
  - Roberge's octave page (`https://roberge.mus.ulaval.ca/gdrm/04-notes.htm`) on his name in « Hauteurs »;
  - DeCS (`https://decs.bvsalud.org/fr/ths/resource/?id=15228`) on « DeCS » in « Plis vocaux ».
- **Apostrophes:** typographic (’), as the old paragraph's were.

The English "Language." paragraph is unchanged.

## Picture

`docs/sessions/french-guide-conventions-shots/langue-fr.png`: the French Guide on the live page, « Langue. » and its five items.

## The eight gates

All pass. Gate 4 is **2350**, unchanged: the spacing and italics checks that read this paragraph already existed.

1. `pnpm test:phonology`: 251 passed (251)
2. `pnpm test:dictionary`: 242 passed (242)
3. `pnpm --filter @ilya/web check`: 0 errors and 12 warnings in 5 files
4. `pnpm --filter @ilya/web test`: 2350 passed (2350)
5. `pnpm --filter @ilya/score-parser test`: 663 passed, 5 skipped (668)
6. `pnpm test:blurb`: 145 passed (145)
7. `pnpm test:integration`: 55 passed (55)
8. `pnpm ratchets`: OK

## Could not establish

- **The draft's three open items stay open for Dann.** They are in the draft, not in this row:
  1. the source of the feminine-first order;
  2. Quebec octave usage;
  3. the OQLF notice style for references.
- **The sources themselves.** This session did not re-read the OQLF, Roberge, or DeCS pages; it seats the ratified text and links.
