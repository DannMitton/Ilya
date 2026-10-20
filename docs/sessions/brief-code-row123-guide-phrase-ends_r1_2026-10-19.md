# Brief for Code, cloud lane: row 123, the Guide says why a rest keeps a word's sound, r1

> **SUPERSEDED by r2** (`brief-code-row123-guide-phrase-ends_r2_2026-10-19.md`, 2026-10-19 21:3x), which applies Fable's six amendments (`review-fable-brief-row123_r1_2026-10-19.md`). Its French block lost the no-break space before the colon. Kept for the record; do not send.

Written by the desk (Opus) 2026-10-19 21:2x. QUEUE row 123. For a cloud session, Sonnet 5.5, on branch `cloud-lane-11`, after row 121 (`a6f9e3a`). Fable reviews this brief before Code gets it (`CONTRACT.md` §1 item 19). The desk's files cited below (`docs/memory/QUEUE.md`, `docs/sessions/ratified-guide-phrase-ends_2026-10-19.md`) are not on the branch; this brief carries what they say, and the two paragraphs below are the ratified text itself.

## What the singer sees

In the Guide, under "Why does Ilya keep both the poem and the lyrics?" (`id="guide-witnesses"`), the paragraph that explains why Text transcribes Lyrics gains two sentences: Grayson's rule that punctuation and the implied phrase stop assimilation, and Ilya's step from that rule to a rest in the vocal line, with the «так засыпаю» example. The same in the French Guide. Nothing else on any page changes.

## Why

- Row 108 (shipped on `Shane`, `f06c1af` and its follow-up) made a rest in the vocal line a hard boundary for the sound: `apps/web/src/lib/score/phrase-ends.ts:32-36`. A hard boundary stops cross-word voicing assimilation: `packages/phonology/src/engine.ts:2171` (`if (leftWord.rightBoundary === 'hard') continue;`). Row 108's report measured the example: «такъ» on the Tchaikovsky reads `ˈtɑɡ` sung straight on and `ˈtɑk` with a rest before «засыпаю». Its section 7 owed the Guide an explanation.
- Dann ratified both languages 2026-10-19 21:09, after the desk read Grayson, *Russian Lyric Diction* (2012), printed pp. 248 to 255. The step from Grayson's "place of possible pause" to a printed rest is Ilya's, and the sentences say so. They claim nothing about palatalization, which Ilya does not compute across words.

## The work

1. **Seat the English** in `apps/web/src/lib/components/Reading/GuideContent.svelte`, in the paragraph after `<h4 id="guide-witnesses">Why does Ilya keep both the poem and the lyrics?</h4>` (`:331`; the paragraph is `:333` at `a6f9e3a`). Insert it directly after the sentence that ends `and the sound of a sung word depends on the words beside it.` and before `To review the authoritative poem itself anytime`, inside the same `<p>`, separated by one ordinary space on each side. The text, character for character:

   ```
   Grayson (p. 248) holds that punctuation and the implied phrase, a place where a speaker could pause, are boundaries that no assimilation crosses, not even voicing. <em>Ilya</em> treats a rest in the vocal line as such a pause: where a score sets a rest between <em>так</em> and <em>засыпаю</em>, <em>так</em> keeps its [k]; sung straight on, it takes [ɡ] before the [z].
   ```

2. **Seat the French** in the same file's French branch, in the paragraph after `<h4 id="guide-witnesses">Pourquoi Ilya conserve-t-il le poème et les paroles?</h4>` (`:36`; the paragraph is `:38`). Insert it directly after the sentence that ends `et le son d’un mot chanté dépend des mots qui l’entourent.` and before `Pour consulter à tout moment le poème qui fait autorité`, inside the same `<p>`. The text, character for character:

   ```
   Selon Grayson (p. 248), la ponctuation et la phrase implicite, là où l’on pourrait marquer une pause, sont des frontières que ne franchit aucune assimilation, pas même celle du voisement. <em>Ilya</em> traite un silence dans la ligne vocale comme une telle pause : là où une partition place un silence entre <em>так</em> et <em>засыпаю</em>, <em>так</em> garde son [k]; chanté sans interruption, il prend [ɡ] devant le [z].
   ```

3. **Characters that a copy can lose.** Check each in the file after the edit, by code point:
   - French: the space before the colon in `pause :` is U+00A0, written as a literal character as the same paragraph's three other colons are (`:38`), not `&#160;`. No space before the semicolon in `[k];`, in either language. The apostrophe in `l’on` is U+2019.
   - Both: the `ɡ` in `[ɡ]` is U+0261 (IPA script g, the character the engine writes), not U+0067. The Cyrillic in `<em>так</em>` and `<em>засыпаю</em>` is Cyrillic throughout (no Latin `a`, `c`, `o`, `p`, or `x`).
   - Both: `<em>Ilya</em>` in italics, as every other *Ilya* in the same paragraph is. The ratified file sets it plain; the words are unchanged, and the italics are the desk's one departure from the ratified markup (DESK DEFAULT 2026-10-19 21:2x, told to Dann).
   - Both: the IPA is plain text in square brackets, as ratified. Learn sets IPA specimens in `<code>` (`LearnContent.svelte:73`; styled at `apps/web/src/lib/components/Paper/ReadingPaper.svelte:329-336`). Do not add `<code>`; name the difference in the report.
4. **Nothing else.** No other sentence of the Guide, no `i18n.ts` string, no Learn page. The Guide's prose lives in markup, not in `i18n.ts`.

## Tests and the done state

1. Pin both seatings in `apps/web/src/lib/insights/ratified-lines.test.ts`, in a new `describe('ratified Guide lines (row 123)', ...)`, reading `GuideContent.svelte` as source and splitting the French and English branches exactly as the existing `describe('ratified Guide lines (rows 90 and 94)')` does (`:43-48`). Decode `&#160;` to U+00A0 before comparing, as `i18n.test.ts:148` does, so the pin holds either way the space is written. For each language: the branch contains the anchor sentence immediately followed by one space and the two new sentences, immediately followed by one space and the next sentence's first words (`To review the authoritative poem` / `Pour consulter à tout moment`). One `it` per language.
2. The existing checks that read the Guide must still pass untouched: the French punctuation table (`apps/web/src/lib/i18n.test.ts:141-154`), the registry of works (`apps/web/src/lib/sources.test.ts`; `Grayson (p. 248)` carries no year, so its citation scan does not see it, and Grayson 2012 is registered already), and the Italian-terms check (`french-italics.test.ts:99`). If any fails, stop and report; do not change the ratified text to make it pass.
3. All eight gates at baseline, with web-test counted (baseline after row 121: 2847 passed). No ceiling raised.
4. **DONE** is a look on the alias after the merge: the desk reads both paragraphs in the Guide, English and French, then Dann when convenient.

## The lane

Branch `cloud-lane-11`, after row 121, its own commit and push. Never `Shane` or `main`; no pull request; Dann merges. Do not edit `docs/memory/`. Never commit a `brief-code-*` file: the brief lives in `/tmp/briefs` only. Report: `docs/sessions/report-code-row123_r1_2026-10-19.md`, with the diff by file and line, the code points checked in step 3 and what each was, the test counts, and a section "Could not establish". NOT ESTABLISHED beats a complete invented answer.
