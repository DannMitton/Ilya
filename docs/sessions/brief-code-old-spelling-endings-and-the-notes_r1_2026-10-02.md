# Brief for Code: the old spelling's endings, and the old spelling under the notes

**Written by:** the desk (Fable), 2026-10-02 about 19:55. **This is the whole brief for `QUEUE.md` row 25. It runs in the cloud lane.** **Serves:** THE ONE THING in `docs/memory/STATE.md`: a scan in, a melody out, IPA seated under it and Russian seated under that. Every nineteenth-century scan is printed in the old spelling, so this is on that path. It is also N.12, increment 2, ruled in by Dann on 2026-08-08 and never built. **Runs on the tree at `c601192`.**

**This brief follows `BRIEF-TEMPLATE.md`. It has no slot for a cause, and none is given.**

**What the singer gets from it.** A song printed before 1918 reads as modern Russian does: the right sound under every note, [v] in the old genitive ending, and no note left without its transcription only because the page spells a word the old way.

---

## 1. What was observed

In the desk's own run of the app at `b709012` (dev server, headless Chromium, the score file `docs/sessions/measure-phase1_r1_2026-10-02/tchaikovsky-op38-3-voice.musicxml`, which carries the Jurgenson 1878 words as printed). The two screenshots are beside it: `observed-text-tab_b709012.png` and `observed-markup-tab_b709012.png`.

- **Text.** «шумнаго» stands in a dashed VERIFY box over `ʃum nɑ ɡo`. «печальныя» stands in a VERIFY box too; its IPA is in the screenshot and is not retyped here. Words whose only old feature is a letter or a final hard sign are modernised and transcribed: «тревоге» `ftrʲɪ ˈvo ɡʲɪ` (with «в»), «мирской» `mʲirs ˈkoj`, «увидел», «глядели».
- **Markup.** Under bar 9 the notes carry `ʃum nɑ go` over «шум-на-го», with no mark of any kind. Under «въ тре-во-гѣ мір-ской» and «у-ви-дѣлъ» each note carries the circled question mark and no IPA, the syllables are printed in the old spelling, and the page's legend reads "The score and Ilya divide this word differently, so nothing is transcribed here rather than guessed."
- **Dann, 2026-10-02 19:40,** on seeing bar 9: *"I more perplexed why Ilya isn't transcribing the suffix as [vo] instead of [go]..."* (transcribed as written).

## 2. What is established, each line carrying its `path:line`

Read by the desk in the tree at `c601192`, 2026-10-02.

- The rule that reads г as [v] in a genitive ending fires only on a word that ends in `ого` or `его`, less a list of nine exceptions (`packages/phonology/src/engine.ts:669-694`; the list at `:674`; its one caller at `:1835`).
- The moderniser maps eight abolished letters (`packages/dictionary/src/pre-reform-normalizer.ts:135-144`) and drops a hard sign that ends a word or a part of a compound (`:178`), and does nothing else (`:230` to the end of the function).
- Its header says the endings are out of its scope and names them: "-аго → -ого and -яго → -его (with -аго → -его after ж, ц, ч, ш, щ), plural -ыя/-ія → -ые/-ие, онѣ → они, and ея → ее", "RULED IN by Dann on 2026-08-08 (\"let's aim for completeness\") as N.12 increment 2", and "NOT built here" (`pre-reform-normalizer.ts:86-98`).
- At intake the modernised form is adopted only when the dictionary knows it (`apps/web/src/lib/pipeline.ts:563-571`). The engraver's spelling is kept in `preReformSource` (`:571`). A word that keeps an abolished letter gets no stress mark (`:580-581`).
- The same comment block records Dann's ruling of 2026-08-08 for the display: "Markup and Transcribe print дети" (`pipeline.ts:523-531`).
- On Markup a score word is paired with a transcribed word when the two cleaned strings are equal (`apps/web/src/lib/score/vowel-resolver.ts:476`, and `:484` for a split particle). A score word with no pair is withheld (`:507`), and so is one whose count of syllables differs from the score's (`:562`).

**Leads, from the session notes of 2026-08-08 in project knowledge, search snippets only, each to be measured again and none to be trusted as it stands:** `-ія → -ие` must run before the letter map; the ending rules resolved 120 of 320 dictionary headwords then; seven cross-lemma false matches existed and requiring the lemma to agree caught all seven; the dictionary's own lemma fields are in the old spelling, so the letter map must be applied to both sides of a lemma comparison; that header's note about a rhyme conflict was dissolved the same day and is stale.

## 3. Measure before you change anything

Report these first, then build without waiting for the desk.

1. **The song.** For every word of the Tchaikovsky text (the score file's words, 96 by the app's count): what the pipeline gives today (the form displayed, where the stress came from, the IPA), and whether the word carries an old ending, an abolished letter, or a final hard sign.
2. **The endings against the dictionary.** For each of the header's ending rules, and for the dictionary's old-spelling headwords: how many does the rule turn into a form the dictionary knows, how many of those agree in lemma, and what the false matches are. Say what order the rules and the letter map must run in, with the counts that show it.
3. **The modern words that must not move.** List every dictionary headword in modern spelling that ends in `аго` or `яго` («благо», «саго», and whatever else there is). None of them may change.
4. **The notes.** On Markup, with the score file of section 1: for each score word that is withheld, give the score's cleaned string and the transcribed word's at the comparison (`vowel-resolver.ts:476`), and the two syllable counts at `:562`. Say what differs in each.

## 4. The rulings this serves

- **Dann, 2026-08-08** (`pipeline.ts:523-531`, `:546-550`, `:573-579`): the old spelling is modernised at intake; Text and Markup print the modern form; the modernised form is adopted only when the dictionary knows it; a word that could not be resolved says so.
- **Dann, 2026-08-08** (`pre-reform-normalizer.ts:92-93`): the ending rules are ruled in, *"let's aim for completeness"*.
- **Dann, 2026-10-02 19:40:** the old genitive ending is sung with [v]. The desk takes that as: -аго and -яго are sung as -ого and -его are.
- **`CONTRACT.md`, section 6:** do not write IPA without Ilya, and do not hand-roll a phonological predicate. So no new sound rule is written. The ending becomes its modern spelling, and Ilya's own rule (`engine.ts:669`) then does what it already does.
- **The desk's choices in this brief, each a DESK DEFAULT:**
  - **-аго and -яго change for everything:** the display, the transcription, and the lookup, as the abolished letters do, with the engraver's spelling kept in `preReformSource`.
  - **-ыя and -ія, онѣ, однѣ and its forms, ея and нея change for the lookup only.** The stress and the gloss come from the modern twin. The display and the letters that feed the IPA stay as printed. How each of these is sung is Dann's to say, and he has not been asked.
  - **On Markup the Cyrillic under the notes is the modern spelling that Text shows,** divided as the score divides it.

## 5. Constraints

- **The cloud lane's rules hold** (`docs/memory/QUEUE.md`, "The cloud lane", "The prompt, for the record"): commit and push to `cloud-lane` only; never `Shane` or `main`; no pull request; do not touch `tools/e16-harness/`.
- **Do not edit `QUEUE.md`, `STATE.md`, `OWED.md`, `CONTRACT.md`, `OPEN.md`, or `PRODUCT.md`.**
- **The dictionary disposes.** No ending rule's output is adopted unless the dictionary knows the form and the lemma agrees. A word the rules cannot resolve stays exactly as it is today.
- **No modern word changes.** The words of step 3.3 are tests.
- **`VocalLineEvent` does not change.** Nothing in `apps/web/src/lib/score/reconciliation/` is rebuilt.
- **No new string for the singer.** If the work needs one, stop that part and report.
- **No ceiling in `scripts/ratchets.json` rises.** If one must, report it and do not raise it.
- **Correct the stale note** in `pre-reform-normalizer.ts`'s header about the rhyme conflict, and say there what is built now and what is lookup only.
- **Stay on Sonnet.**
- **What this displaces:** track B1 of plan r4 in the cloud lane, by one step. `QUEUE.md` rows 11, 12, and 17 wait as before.

## 6. Done when

Each test holds on every case, and each has a unit test named for it.

1. «шумнаго» is displayed as «шумного» with no VERIFY box, its IPA is exactly what Ilya gives «шумного» today, its stress comes from the dictionary, and `preReformSource` holds «шумнаго».
2. The same holds for an -яго word and for an -аго word after ж, ц, ч, ш, or щ, each chosen from the dictionary and named in the report.
3. «благо», «саго», and every word of step 3.3 give today's result, to the byte.
4. «печальныя» takes its stress and its gloss from «печальные», and its display and the letters of its IPA are as printed. The same for one -ія word. The report gives each IPA before and after.
5. On Markup, with the score file of section 1, every note whose word Text transcribes carries that word's IPA, and the Cyrillic under the notes is the modern spelling divided as the score divides it. Bar 9 reads «шум-но-го» over the IPA of test 1. A word that is still withheld is listed with the reason.
6. A song in modern spelling is unchanged: the *Sunless* 1 fixture (`apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml`) gives the same Text and the same Markup before and after.
7. All eight gates at baseline, with every moved number named and the tests that moved it. The baselines are gate 4 `1870 passed (1870)` and gate 5 `650 passed | 5 skipped (655)`; the other six are as `QUEUE.md`'s recorded prompt gives them.
8. Screenshots of Text and Markup for the song, before and after, in a `.files` folder.

## 7. Report back

A new file, `docs/sessions/report-code-old-spelling-endings-and-the-notes_r1_2026-10-02.md`: section 3's measurements first, then section 6 line by line, then **what could not be established. NOT ESTABLISHED beats a complete invented answer.** One commit and one push for the measurements, then one for each part built. WRITTEN is not DONE: DONE is Dann's walk.
