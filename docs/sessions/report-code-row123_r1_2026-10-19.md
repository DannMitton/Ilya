# Report: row 123, the Guide says why a rest keeps a word's sound

Branch `cloud-lane-11`, after row 121 (`a6f9e3a`), its own commit. Brief: `brief-code-row123-guide-phrase-ends_r2_2026-10-19.md`. Cloud session, Sonnet 5.5. `Shane` was not merged into the lane.

## The diff

- `apps/web/src/lib/components/Reading/GuideContent.svelte`: **two lines changed, none added.** `:333` (English) and `:38` (French), each the `guide-witnesses` paragraph, which stays one source line. The two ratified sentences sit directly after `...depends on the words beside it.` / `...dépend des mots qui l’entourent.` and before `To review the authoritative poem` / `Pour consulter à tout moment`, inside the same `<p>`, one ordinary space either side. No other sentence, no `i18n.ts` string, no Learn page, no formatter.
- `apps/web/src/lib/insights/ratified-lines.test.ts`: a new `describe('ratified Guide lines (row 123)')`, two tests (one per language). It reads the Guide as source and splits the branches as the rows 90 and 94 block does, decodes `&#160;` to U+00A0, and pins each paragraph's whole tail as one string, written with ` ` and `ɡ` escapes (a comment names both).

## Code points checked (step 3), in the file after the edit

| check | result |
|---|---|
| French, the space before `:` in `pause :` | U+00A0, a literal character, as the same paragraph's three other colons are; no `&#160;` anywhere in the line |
| No space before the `;` in `[k];` | confirmed, both languages |
| `l’on` apostrophe | U+2019 |
| `ɡ` in `[ɡ]` | U+0261 in both languages; no `[g]` (U+0067) in either |
| `так` and `засыпаю` | Cyrillic throughout (the only Latin letters inside the `<em>` tags are the two `Ilya`) |
| `<em>Ilya</em>` | in italics, both languages (the desk's one departure from the ratified markup, as the brief says) |
| IPA | plain square brackets, no `<code>` |
| `lang` attribute | none added |

The sentences were written into the file from escapes in a script, not copied through a viewer, so none of these characters passed through a copy.

## Tests and gates

New: 2 tests (`ratified-lines.test.ts`). The existing checks that read the Guide pass untouched: `i18n.test.ts` (French punctuation table), `sources.test.ts` (registry of works), and `french-italics.test.ts` (Italian terms), run within the web gate. No existing test was edited.

| gate | baseline (after row 121) | this commit |
|---|---|---|
| phonology | 267 | 267 |
| dictionary | 248 | 248 |
| web-check | 0 errors, 12 warnings | 0 errors, 12 warnings |
| web-test | 2847 | 2849 passed (2847 plus the two new tests) |
| score-parser | 744 passed, 5 skipped | 744 passed, 5 skipped |
| blurb | 145 | 145 |
| integration | 55 | 55 |
| ratchets | OK | OK, no ceiling raised |

## Could not establish

- How the two paragraphs read on the alias: the page was not opened; the check was the source and the tests. DONE is the desk's look after the merge.
- Whether the saved copy of the brief in `/tmp/briefs` matches the sent text word for word: it is a short pointer, not the full text, so the sentences were taken from the prompt directly. It is not committed.
