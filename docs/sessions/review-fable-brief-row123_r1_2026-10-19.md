# Fable's review of the row 123 brief, r1

Reviewed by Fable (subagent of the desk) 2026-10-19 21:2x to 21:3x, against `cloud-lane-11` at `a6f9e3a` in the desk's workspace, read only. 152,636 tokens against a stated worst case of 200k. Verdict and amendments verbatim below; all six applied in r2 (`brief-code-row123-guide-phrase-ends_r2_2026-10-19.md`). On "Could not establish", the desk answers: `<em>` on так and засыпаю is in the ratified file (`ratified-guide-phrase-ends_2026-10-19.md`, both languages), and the ratified file carries U+00A0 before the colon (read by code point 21:2x); the U+0020 was lost in the desk's own copy into r1.

**SEND WITH AMENDMENTS**

1. **The brief's own French text fails step 3 and the French table.** In the fenced block at brief line 25, the character before the colon in `pause :` is U+0020, not U+00A0 (checked by code point). An agent that seats it "character for character" trips `i18n.test.ts:111` (`before !== ' '` → `no U+00A0 before :`), reported at `:150`; I ran the `faults` logic over the sentence: `['no U+00A0 before :']` as written, `[]` with U+00A0. The brief then says "stop and report; do not change the ratified text", which reads as a dead end. Change: put a real U+00A0 in the fenced French block and verify it by code point before sending; add to step 2: "The space before this colon is U+00A0. If your copy shows U+0020, the loss happened in transit, not in the ratified words: seat U+00A0. The Guide's other three colons in this paragraph are the model (`:38`, each a literal U+00A0)."

2. **Make the pin immune to the same copy loss.** If the agent builds the test literal from the brief or from its own seating, a lost U+00A0 or a Latin `g` passes the pin. Add to tests item 1: "In the pinned literal, write the no-break space as ` ` and the script g as `ɡ` (escapes, as `ratified-lines.test.ts:121` and `:174` write `’`), with a one-line comment naming both." Also name the anchor precisely: "the anchor is the tail quoted in step 1 or 2 (from `and the sound` / `et le son`), one space, the two sentences, one space, then `To review the authoritative poem` / `Pour consulter à tout moment`; all on one source line."

3. **Forbid the two tempting fixes.** Add to tests item 2: "Do not edit any existing test to make it pass (`i18n.test.ts`, `sources.test.ts`, `french-italics.test.ts`, `no-fit-name.test.ts`)." Add to step 4: "Do not run a formatter on the file; the paragraph stays one source line (`:38`, `:333`)." No prettier config exists, but the instruction costs nothing.

4. **Reframe the IPA note in step 3.** The Guide's own prose already sets IPA plain in brackets: `[ʌ]`, `[ə]` at `GuideContent.svelte:187`, `:210`, `:483`, `:506`; the file has zero `<code>`. Plain brackets are the Guide's convention, not a departure to be named. Change to: "Plain brackets, as the Guide sets `[ʌ]` and `[ə]` (`:483`). Learn uses `<code>` (`LearnContent.svelte:73`); that is Learn's convention, not the Guide's."

5. **`lang` attribute: one line.** Neither Reading file carries a `lang` attribute on any element (only `<script lang="ts">`). Add to step 3: "Add no `lang` attribute; the Guide uses none, and the pin would break."

6. **QUEUE.md wording.** `docs/memory/QUEUE.md` is tracked at `a6f9e3a`; it lacks row 123. Change the opening sentence to "row 123's QUEUE entry and the ratified file are not on the branch", so the agent does not go looking.

Everything else checked clean. Anchors: all four quoted anchors exist once each in the file, at `:38`, `:333`, and the heading lines `:36`, `:331`; apostrophes in the anchors are U+2019; `beside it. To review` and `l’entourent. Pour consulter` are joined by one U+0020. The brief's Cyrillic is Cyrillic throughout; `ɡ` is U+0261 in both sentences, which is what `engine.ts:2041-2047` writes (`'k': 'ɡ'`). `CITE` (`sources.test.ts:40-41`) matches nothing in either sentence: `(p. 248)` has no comma before a year and `248` is not a year. `french-italics.test.ts:25` terms: none present. `no-fit-name`: no `Fit`. `ratified-lines.test.ts:43-48` is the split the brief cites; `i18n.test.ts:148` is the decode line. Line references `phrase-ends.ts:32-36`, `engine.ts:2171`, `LearnContent.svelte:73`, `ReadingPaper.svelte:329-336`, `french-italics.test.ts:99`, `i18n.test.ts:141-154` all hold. Baseline 2847 and the eight gates match `report-code-row121_r1_2026-10-19.md:30`. `GuideContent.svelte` is 640 lines, under no ratchet ceiling, and the edit adds no lines.

The code supports the sentences. A rest in `parsed.vocalLine` between the word's last seated note and the next word's first makes `musicPhraseEnds` true (`phrase-ends.ts:33`, `:75`); `boundaries.ts:59-61` turns that into `rightBoundary = 'hard'`; `pipeline.ts:328` then `:335` carry it to `engine.ts:2171`, which skips the boundary; final devoicing leaves `k` as `k`. Sung on, `k` before `z` voices at `engine.ts:2220-2222`. `так` is in no clitic set. Row 108's report section 7 (`report-code-row108_r1_2026-10-19.md:124-131`) does owe the Guide line.

**For the desk, not this brief**

- The converse clause ("sung straight on, it takes [ɡ]") holds only where nothing else ends the phrase: no punctuation after так (`boundaries.ts:65-67`) and, when no score seats the word, not at a line end (`:62-64`). True of the Tchaikovsky line; worth knowing if a singer tests it on typed text.
- Guide prose sets Cyrillic examples plain (`:40`, `:56`, `:335`, `:351`); one French figcaption italicizes (`:170`). `<em>так</em>` is new in Guide prose. If it is ratified markup, fine; if the desk added it, it is a second departure.
- "Row 108 (shipped on `Shane`, `f06c1af` and its follow-up)": per `QUEUE.md` row 108, the ship was `e58fdabc`, a fast-forward to `f06c1af`, which is itself the follow-up. Not load-bearing for Code.
- Learn cites pages as "Grayson, p. 165"; the ratified "Grayson (p. 248)" differs. Ratified words, so noted only.

**Could not establish**

- Whether `<em>` on так and засыпаю is in the ratified file (not in the clone).
- Whether the brief's U+0020 before the colon came from the ratified file or was lost in the desk's copy.
- Nothing was run; every regex result above is from reading the code and re-running its logic in Python on the brief's sentences.
