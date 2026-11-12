# Report: rhyme matcher, step 4 (the two notes) (Code, cloud lane 49, r1, 2026-11-12)

## A correction to my step 0 report first

Step 0 said, from reading the code, that the Inspector draws `inspector.noBlurb` ("No phonological note for this character.") for a stage ‑кий ⟨и⟩. **That was wrong.** Measured here before changing the data file (old `data/blurb-composer.json` taken with `git show dc078b9:…`, run through the current composer): `composeBlurb` does return null for key `velar-adjectival:и`, but `buildDisplayLog` goes through `lookupBlurb` (`composer.ts:426-437`), which turns a null into a fallback `{ blurb: { en: "и → ɨ", fr: "и → ɨ" }, citation: null }`. So **before this step the Inspector drew the ribbon header «и → ɨ» and, under it, the bare line «и → ɨ» with no citation**, not the "no note" string. `hasBlurb` is true for that fallback, so the `noBlurb` branch (`InspectorPanel.svelte:1386`) is not reached. Still read from the composer's output, not from a rendered page; the fallback text is what `blurbData.blurb` holds.

## What changed

`data/blurb-composer.json` (the one file; `apps/web/static/data` is a symlink to it), two processes added after `unstressed:и`, each with EN and FR, each `"standalone": true` (Amendment 1):

- `velar-adjectival:и`, the stage note, as ratified 2026-11-11 22:53, copied exactly. `citation`: `"pp. 301–303 + Avanesov 1989, p. 660"` (Amendment 2), which prints `(Grayson, pp. 301–303; Avanesov 1989, p. 660)`. The French colon is written ` ` in the JSON (Amendment 3); the brief's literal and `OPEN.md:3686` hold a plain space, and I followed the amendment. Pinned both ways.
- `velar-adjectival-rhyme:и`, R1, as ratified 22:54, `{word}` the partner, `citation`: `"p. 302"`, which prints `(Grayson, p. 302)`.

The French «{word}» carries no inner no-break spaces, as the ratified literal has none. The brief's R2 (the checkbox label) is step 5.

## Tests

- `packages/blurb/tests/velar-adjectival.test.ts` (new, 11 tests): each of the four strings pinned character for character; both printed citations; the ` ` and the absence of a plain space; **neither composed note contains the identity sentence** (EN "usually sounds like /i/", FR "se prononce généralement /i/"); both processes `standalone`; no em dash; same placeholders and citations in both languages; `deriveRule` yields the two keys from the engine's two exceptions.
- `packages/blurb/tests/french-parity.test.ts`: template count 194 to 196, with the comment line.
- `rhyme-reading.test.ts`: `stampRhymePartner` stamps only the `velar-adjectival-rhyme` entry and drops `<`, `>`, `&` (the Inspector prints the note through `{@html}`; a partner must be a dictionary word, so this is defence in depth).

## A finding that needs the desk: «Avanesov 1989» has no record

`sources.test.ts` failed on the new citation: the registry knows every author-and-year the app cites, or names it on `OWED`. There is no bibliographic record for Avanesov 1989 in this tree (I searched the repository for Avanesov; the only hits are the dictionary's surname entry and one comment in `consonants-clusters.test.ts` that says "Avanesov p. 528"). I did not invent a title or publisher. I added `'Avanesov 1989'` to `OWED` in `apps/web/src/lib/sources.ts` with the note that no title is on file. **The desk owes the full reference, and the work's identity is the desk's to confirm: I could not establish from the tree which Avanesov work the year 1989 and p. 660 point to.** The note's attribution is ratified text; I added only the registry gap.

## Gates after step 4

phonology 462, blurb 178 (168 + 11 new, less the template count test unchanged), integration 155, web-test 5231 passed and 1 skipped (5230 + the new stamp test), web-check 0 errors and 12 warnings, ratchets OK.

## What I could not establish

- What a rendered Inspector shows for either note (no browser run yet; step 6 runs Playwright).
- The identity of the Avanesov work (above).
- Whether `applyNotationPreferences` turning [ʌ] to [ə] inside the R1 text under the ə preference reads right in running prose; it is the same mechanism every blurb uses.
