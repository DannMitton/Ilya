# Brief for Code, r1: the Richter credit's ratified wording

Written by the desk 2026-09-27 07:03. The Latin words slice is uncommitted in your tree;
this lands in the same slice, before Dann ships.

**Ratified by Dann 2026-09-27 07:03** ("yes"), both languages. The English is the desk's,
matched to the Grayson credit in `footer.attribution`; the French is the desk's proposal,
which Dann ratified.

## The change

`apps/web/src/lib/i18n.ts`, key `footer.richter`, becomes exactly:

- **en:** `The Latin words’ IPA follows Laurence R. Richter’s <em>Mussorgsky’s Complete Song Texts</em> (Leyerle, 2002, pp. 43–49).`
- **fr:** `L’API des mots latins suit <em>Mussorgsky’s Complete Song Texts</em> de Laurence R. Richter (Leyerle, 2002, p. 43–49).`

The two strings now differ in their page abbreviation ("pp." against « p. »), so a shared
`{citation}` placeholder no longer fits. Write each string whole, as above. Keep
`RICHTER_CITATION` in `latin.ts` only if something other than this footer still reads it;
otherwise remove it and its reader. Update the comment above the key: the French is no
longer "coined and owed"; it is ratified by Dann 2026-09-27 07:03.

Use the typographic apostrophe (U+2019) and the en dash (U+2013) as written, like the
strings around it.

## Done when

- `latin.test.ts` and the i18n approval test pass with the new strings; update any
  assertion that expected the old wording or `RICHTER_CITATION`.
- All eight gates pass; state the web-test count (the desk set the ship script to 1533).
- On localhost, the footer of a page with a Latin word reads the new English, and in
  French the new French.
- Add three lines to `docs/sessions/memo-code-latin-words-on-the-page_r1_2026-09-27.md`
  saying what changed and why.

## Do not

- Do not change any other string.
- Do not use `git stash`, `checkout`, `restore`, `worktree`, or any other git command that
  writes. Do not commit.
