# Report: row 95, Ilya stops saying a printed song has no words

Cloud lane, branch `cloud-lane-5`, from `origin/Shane` at `50a5f85`. The brief was written against `db7fc43`; the branch point is later, and the lines the brief cites matched.

## The answer in three lines

1. A scan or photograph (any `provenance.via === 'reader'` arrival) now draws the new `upload.banner.noLyricsScan` where it drew `noLyrics`, and the scan banner ends with the ratified sentence. A file with no lyrics draws the ratified `noLyrics`.
2. The choice of key is one pure function, `noLyricsNoticeKey`, tested on both provenances.
3. No gate moved except web test: 2474 to 2483 (+9, all in the new test file). Ratchets OK with `+page.svelte` unchanged at 6003 lines.

## How a scan is told from a file

`provenance.via === 'reader'`, the field `fidelityBanner` already reads (`apps/web/src/lib/score/ingestion/ingest.ts:56` the type, `:242` where the reader sets it, `:67-71` `fidelityBanner`; the brief cited `:227`, which has since moved). The new function sits beside it, `ingest.ts:83-86`, so one mechanism serves both banners. The brief suggested a file under `lib/score/`; I put it in `ingest.ts` instead because `+page.svelte` sits exactly at its ratchet ceiling (6003) and a separate module needed a new import line. Call site: `apps/web/src/routes/+page.svelte:3204` (set on arrival), drawn at `:4458`; state declared at `:375`; import at `:214` (extended, not added).

## Each string as built (quoted from the tree)

`apps/web/src/lib/i18n.ts:1021` `upload.banner.reader`, last sentence only:
- EN: `Ilya does not read the words printed in an image; type them into the Input field.`
- FR: `Ilya ne lit pas les paroles imprimées dans une image; saisissez-les dans le champ Entrée.`

`i18n.ts:1355` `upload.banner.noLyrics` (1a):
- EN: `This score has no words in it. The text you added is under the notes, assigned one syllable per note. Click a note to move a syllable.`
- FR: `Cette partition ne porte aucune parole. Le texte que vous avez ajouté se trouve sous les notes, réparti à raison d’une syllabe par note. Cliquez sur une note pour déplacer une syllabe.`

`i18n.ts:1359` `upload.banner.noLyricsScan` (1b, new):
- EN: `Ilya does not read the words printed in an image. The text you added is under the notes, assigned one syllable per note. Click a note to move a syllable.`
- FR: `Ilya ne lit pas les paroles imprimées dans une image. Le texte que vous avez ajouté se trouve sous les notes, réparti à raison d’une syllabe par note. Cliquez sur une note pour déplacer une syllabe.`

French apostrophes are U+2019 (amendment 1): « d’une syllabe », « d’une image ».

**The `%s` placeholder.** Neither wordless string has a `%s` slot, and the string it replaced had none either. The call at `+page.svelte:4458` still runs `.replace('%s', noLyricsFile)`, which is a no-op; kept harmless, no file name added. A test pins that neither string contains `%s`. The comment above `noLyrics` in `i18n.ts` (`%s is the file name, substituted…`, `:1353-1354`) is now stale about this string; I left it and added a comment under it saying so. Dann may want it deleted.

## The tests

`apps/web/src/lib/score/no-lyrics-notice.test.ts` (new, 9 tests):
- `noLyricsNoticeKey`: `direct` and `mxl` and MNX give 1a; `reader` with `sourceFormat` `image` and `pdf` give 1b.
- Each of the five strings pinned, EN and FR, byte for byte.
- The two false sentences (`not in a picture`, `ne sont pas dans une image`) absent from all three keys.
- No `%s` in either wordless string.

The component itself is not tested: runes are inert under vitest (`ENVIRONMENT.md:653`), so what is pinned is the choice of key and the strings, not that `+page.svelte` calls the function. That the call site passes `ingested.provenance` was checked by reading it, not by a test.

## The eight gates

Baseline (this session, before row 95, `50a5f85`) and after:

| Gate | Baseline | After row 95 |
|---|---|---|
| 1 phonology | 251 passed | 251 passed |
| 2 dictionary | 248 passed | 248 passed |
| 3 web check | 0 errors, 12 warnings in 5 files | same |
| 4 web test | 2474 passed | **2483** passed (+9, `no-lyrics-notice.test.ts`) |
| 5 score-parser | 675 passed, 5 skipped | same |
| 6 blurb | 145 passed | 145 passed |
| 7 integration | 55 passed | 55 passed |
| 8 ratchets | OK (452 files) | OK (453 files) |

The first attempt put the new function in its own module and breached the `+page.svelte` ceiling by 4 lines (6007 over 6003). It was fixed by the move above, not by raising the ceiling.

## What could not be established

- **How the screen looks.** Not drawn: no scan was run through the reader in this sandbox (Pyodide does not load here, `ENVIRONMENT.md:4552`), so I did not see 1b or the new scan banner on screen.
- **Whether `ScoreUploader.svelte:993`'s banner renders the new last sentence correctly in the live app.** It is the same string drawn by the same line; only the text changed.
