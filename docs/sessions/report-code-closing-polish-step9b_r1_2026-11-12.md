# Report: closing polish lane, step 9b, the Licences paragraph names the poem sources (Code, cloud-lane-48, r1, 2026-11-12)

## What changed

`components/Reading/GuideContent.svelte`: at the start of the Texts paragraph, before the LiederNet sentence, English (`:585`, now with the new sentences) and French (`:289`). Words from `docs/memory/OPEN.md:3692` (EN, Dann 2026-11-11 23:02) and `:3693` (FR, 23:03), read from the file, not recalled.

Glyphs follow the file (Amendment 15): English takes ’ and “ ” (`<em>Ilya</em>’s`, `Moshkov’s`, “Russian Literature and Folklore”) where `OPEN.md` holds straight quotes; French takes a literal U+00A0 (not `&nbsp;`) before the colon and inside the guillemets (« Littérature et folklore russes »); `Ilya` is in `<em>`, and the apostrophe of « d’<em>Ilya</em> » is outside the italics. Nothing else in the paragraph changed.

## Tests

`components/Reading/guide-licences.test.ts` (three more): each language's sentences, rendered, sit at the start of the paragraph and directly before « Test texts were drawn from The LiederNet Archive » / « Les textes d’essai proviennent du LiederNet Archive »; the source has `d’<em>Ilya</em>`, `<em>Ilya</em>’s`, no `&nbsp;` in the French paragraph, and the literal no-break space before the colon. `components/Reading/`: 208 tests passed.

## What I could not establish

- The French « fiche », « Littérature et folklore russes », and « gardent ces textes en libre lecture » are the desk's coinages, ratified by Dann; I did not check them.
- The page as drawn (the paragraph's length and wrap on a phone).
