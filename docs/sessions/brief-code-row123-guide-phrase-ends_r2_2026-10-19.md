# Brief for Code, cloud lane: row 123, the Guide says why a rest keeps a word's sound, r2

r1 written by the desk (Opus) 2026-10-19 21:2x; **r2, 21:3x, applies all six of Fable's amendments** (review returned 21:3x, SEND WITH AMENDMENTS; none is Dann's to decide). QUEUE row 123. For a cloud session, Sonnet 5.5, on branch `cloud-lane-11`, after row 121 (`a6f9e3a`). Fable reviews this brief before Code gets it (`CONTRACT.md` §1 item 19). Row 123's QUEUE entry and the ratified file (`docs/sessions/ratified-guide-phrase-ends_2026-10-19.md`) are not on the branch; this brief carries what they say, and the two paragraphs below are the ratified text itself.

## What the singer sees

In the Guide, under "Why does Ilya keep both the poem and the lyrics?" (`id="guide-witnesses"`), the paragraph that explains why Text transcribes Lyrics gains two sentences: Grayson's rule that punctuation and the implied phrase stop assimilation, and Ilya's step from that rule to a rest in the vocal line, with the «так засыпаю» example. The same in the French Guide. Nothing else on any page changes.

## Why

- Row 108 (on `Shane` since `f06c1af`) made a rest in the vocal line a hard boundary for the sound: `apps/web/src/lib/score/phrase-ends.ts:32-36`. A hard boundary stops cross-word voicing assimilation: `packages/phonology/src/engine.ts:2171` (`if (leftWord.rightBoundary === 'hard') continue;`). Row 108's report measured the example: «такъ» on the Tchaikovsky reads `ˈtɑɡ` sung straight on and `ˈtɑk` with a rest before «засыпаю». Its section 7 owed the Guide an explanation.
- Dann ratified both languages 2026-10-19 21:09, after the desk read Grayson, *Russian Lyric Diction* (2012), printed pp. 248 to 255. The step from Grayson's "place of possible pause" to a printed rest is Ilya's, and the sentences say so. They claim nothing about palatalization, which Ilya does not compute across words.

## The work

1. **Seat the English** in `apps/web/src/lib/components/Reading/GuideContent.svelte`, in the paragraph after `<h4 id="guide-witnesses">Why does Ilya keep both the poem and the lyrics?</h4>` (`:331`; the paragraph is `:333` at `a6f9e3a`). Insert it directly after the sentence that ends `and the sound of a sung word depends on the words beside it.` and before `To review the authoritative poem itself anytime`, inside the same `<p>`, separated by one ordinary space on each side. The text, character for character:

   ```
   Grayson (p. 248) holds that punctuation and the implied phrase, a place where a speaker could pause, are boundaries that no assimilation crosses, not even voicing. <em>Ilya</em> treats a rest in the vocal line as such a pause: where a score sets a rest between <em>так</em> and <em>засыпаю</em>, <em>так</em> keeps its [k]; sung straight on, it takes [ɡ] before the [z].
   ```

2. **Seat the French** in the same file's French branch, in the paragraph after `<h4 id="guide-witnesses">Pourquoi Ilya conserve-t-il le poème et les paroles?</h4>` (`:36`; the paragraph is `:38`). Insert it directly after the sentence that ends `et le son d’un mot chanté dépend des mots qui l’entourent.` and before `Pour consulter à tout moment le poème qui fait autorité`, inside the same `<p>`. The text, character for character:

   ```
   Selon Grayson (p. 248), la ponctuation et la phrase implicite, là où l’on pourrait marquer une pause, sont des frontières que ne franchit aucune assimilation, pas même celle du voisement. <em>Ilya</em> traite un silence dans la ligne vocale comme une telle pause : là où une partition place un silence entre <em>так</em> et <em>засыпаю</em>, <em>так</em> garde son [k]; chanté sans interruption, il prend [ɡ] devant le [z].
   ```

3. **Characters that a copy can lose.** Check each in the file after the edit, by code point:
   - French: the space before the colon in `pause :` is U+00A0, written as a literal character as the same paragraph's three other colons are (`:38`, each a literal U+00A0), not `&#160;`. If your copy of this brief shows U+0020 there, the loss happened in transit, not in the ratified words: seat U+00A0. No space before the semicolon in `[k];`, in either language. The apostrophe in `l’on` is U+2019.
   - Both: the `ɡ` in `[ɡ]` is U+0261 (IPA script g, the character the engine writes), not U+0067. The Cyrillic in `<em>так</em>` and `<em>засыпаю</em>` is Cyrillic throughout (no Latin `a`, `c`, `o`, `p`, or `x`).
   - Both: `<em>Ilya</em>` in italics, as every other *Ilya* in the same paragraph is. The ratified file sets it plain; the words are unchanged, and the italics are the desk's one departure from the ratified markup (DESK DEFAULT 2026-10-19 21:2x, told to Dann).
   - Both: the IPA in plain square brackets, as ratified and as the Guide already sets `[ʌ]` and `[ə]` (`GuideContent.svelte:483`; also `:187`, `:210`, `:506`). Learn uses `<code>` (`LearnContent.svelte:73`); that is Learn's convention, not the Guide's. Do not add `<code>`.
   - Both: add no `lang` attribute. Neither Reading file uses one on any element, and the pin would break.
4. **Nothing else.** No other sentence of the Guide, no `i18n.ts` string, no Learn page. The Guide's prose lives in markup, not in `i18n.ts`. Do not run a formatter on the file: each paragraph stays one source line (`:38`, `:333`), and the edit adds no lines.

## Tests and the done state

1. Pin both seatings in `apps/web/src/lib/insights/ratified-lines.test.ts`, in a new `describe('ratified Guide lines (row 123)', ...)`, reading `GuideContent.svelte` as source and splitting the French and English branches exactly as the existing `describe('ratified Guide lines (rows 90 and 94)')` does (`:43-48`). Decode `&#160;` to U+00A0 before comparing, as `i18n.test.ts:148` does, so the pin holds either way the space is written. For each language, the pinned string is, on one source line: the anchor's tail as quoted in step 1 or 2 (from `and the sound` / `et le son`), one space, the two sentences, one space, then `To review the authoritative poem` / `Pour consulter à tout moment`. In the pinned literal, write the no-break space as `\u00a0` and the script g as `\u0261` (escapes, as `ratified-lines.test.ts:121` writes `\u2019`), with a one-line comment naming both, so a copy that loses either character fails the pin. One `it` per language.
2. The existing checks that read the Guide must still pass untouched: the French punctuation table (`apps/web/src/lib/i18n.test.ts:141-154`), the registry of works (`apps/web/src/lib/sources.test.ts`; `Grayson (p. 248)` carries no year, so its citation scan does not see it, and Grayson 2012 is registered already), and the Italian-terms check (`french-italics.test.ts:99`). Do not edit any existing test to make it pass. If one fails, stop and report; do not change the ratified text either.
3. All eight gates at baseline, with web-test counted (baseline after row 121: 2847 passed). No ceiling raised.
4. **DONE** is a look on the alias after the merge: the desk reads both paragraphs in the Guide, English and French, then Dann when convenient.

## The lane

Branch `cloud-lane-11`, after row 121, its own commit and push. Never `Shane` or `main`; no pull request; Dann merges. Do not edit `docs/memory/`. Never commit a `brief-code-*` file: the brief lives in `/tmp/briefs` only. Report: `docs/sessions/report-code-row123_r1_2026-10-19.md`, with the diff by file and line, the code points checked in step 3 and what each was, the test counts, and a section "Could not establish". NOT ESTABLISHED beats a complete invented answer.
