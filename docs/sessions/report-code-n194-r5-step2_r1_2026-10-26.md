# Report: Code, N.194 r5, step 2 (a typed # takes effect at the end of its unit), 2026-10-26

Lane `cloud-lane-15`, after step 1. Read and run in the Linux cloud sandbox at `Shane` `54c01bc3` plus this lane. Nothing under `docs/memory/` was edited, the brief and its companions were not edited, and no approval was re-approved (the IPA corpus approval and `staff-renderer-real-fixture.approval.test.ts` pass unchanged inside gates 4 and 5).

## What I changed

Batch C's B3 had built the simpler rule, "a typed # ends the word before it" (`syntacticBreak` on the word before it, folded into `hasPunctuation`, source `'punctuation'`). This step moves the field to the unit's last word, as you asked, and stamps that word `'user'`. No second mechanism.

- `apps/web/src/lib/boundaries.ts` (73 to 101 lines, no ceiling):
  - `moveBreaksToUnitEnds(words, sets)` (new, exported): reads every word's `syntacticBreak`, finds its unit end with `unitEnd` over `unitWordsFromPre` (step 1's pre-flag door), clears the flags, and sets them on the unit ends, in place. It is the first statement of `autoDetectBoundaries`, so it runs before any boundary is stamped and before the clitic flags exist. Idempotent.
  - `autoDetectBoundaries`: a word that carries `syntacticBreak` is `rightBoundary 'hard'`, `boundarySource 'user'`, and the branch returns. The `|| word.syntacticBreak === true` is gone from `hasPunctuation`, so a punctuation boundary stays `'punctuation'`. `BoundaryWordIn` gains `punctuation: string` (the door reads it; `PreTranscribeWord` already has it).
  - **The header comment is corrected.** It said "A `'user'` boundary wins (nothing sets one today)". It now says a typed # sets one, names the move, and says the Loupe's button reads the difference between `'user'` and `'punctuation'`.
- `apps/web/src/lib/syntactic-break.ts`: `peelSyntacticBreaks` now reads a # inside a word (`ва#с`) as belonging to that word (B3 dropped it), and takes a ` ` that stands immediately before a # with the #. New `splitTypedWords(line)` is `line.trim().split(WORD_SPLIT)`.
- `apps/web/src/lib/text/break-glue.ts` (new): `WORD_SPLIT`, `WORD_TOKEN`, `GLUED_MARK`, section 5a's shared patterns. `WORD_TOKEN` is not read until step 3; it is tested here beside its sibling.
- `apps/web/src/lib/pipeline.ts` (925 of 925, **no net line**): the import at `:42` takes `splitTypedWords`; `:177` calls it in place of `entry.line.trim().split(/\s+/)`; the stale comment at `:738-742` ("nothing sets boundarySource to 'user' anywhere yet") is reworded in the same four lines. Call lines only; nothing was moved out.

## Every reader of `boundarySource` and of `syntacticBreak`, by grep

`grep -rn "boundarySource" apps packages --include=*.ts --include=*.svelte` and the same for `syntacticBreak`, run at the end of this step.

**`boundarySource`, non-test.**
- Writers: `boundaries.ts` only, in `autoDetectBoundaries` (`'score'`, `'auto'`, `'punctuation'`, and now `'user'`). `pipeline.ts:744` is a placeholder `'auto'` that every word overwrites.
- The one reader that acts on a value: `boundaries.ts` (`if (word.boundarySource === 'user') return;` at the top of the word loop). A word the pass has already stamped `'user'` is left alone.
- Pass-through, not acting: `pipeline.ts:94`, `:136` (types), `:462` (`tw` to output), `:838` (`wordData` to the transcribed word); `types.ts:115` (`boundarySource: string | null` on `WordStackData`).
- `packages/phonology/src/engine.ts:114` (the `BoundaryWord` type) and `:2005-2036`, the engine's own `autoDetectBoundaries` copy, which has no caller anywhere. It has the same `'user'` early return and never receives a `'user'` word, because the app's `boundaries.ts` is the live pass. Untouched.
- **No component and no `+page.svelte` line reads it.** No `.svelte` file matches.

**`boundarySource`, tests.**
- `apps/web/src/lib/syntactic-break.test.ts`: two expectations moved from `'punctuation'` to `'user'` (B3's own tests, below).
- `apps/web/src/lib/score/phrase-ends.test.ts` (`:45-123`): reads `'score'`, `'auto'`, and `'punctuation'` on words with no #. Unchanged and passing.
- `packages/phonology/tests/notation-edge-cases.test.ts` and `voicing-rule2.test.ts`: hand-built `BoundaryWord` literals with `'auto'` or `'punctuation'`. Unaffected; the engine honours a `'hard'` boundary of any source (N.198 report).

**`syntacticBreak`, non-test.**
- Set: `pipeline.ts:187` (from the peel), `:302` (carried across the singer's ё rebuild, which happens BEFORE the move, so the move sees it), and now `boundaries.ts` `moveBreaksToUnitEnds`.
- Carried: `pipeline.ts:70`, `:119` (types), `:457` (`tw` to the output word), `:825` (`wordData` to `tw`); `types.ts:59` (`WordStackData`); `clitic-merge.ts:28`.
- Read to draw the mark: `clitic-merge.ts:42` (grafts onto the word's own IPA strings, so an enclitic carries it into its host), `syllable-utils.ts:316` (the open-syllable re-cut), `syntactic-break.ts` `graftBreak` (called from `pairings.ts:168`), `vowel-resolver.ts:618` (the IPA line under a score's notes).
- `boundaries.ts` (the move and the stamp).

All of the readers in the "draw" group read the field on whichever word carries it, so moving it from the typed word to the unit's last word needs nothing from them. The tests prove it for an enclitic unit end (`ˈtɨ ʒɨ#`) and a proclitic-led unit («не # в силах» gives the IPA of «не в силах #»).

**`syntacticBreak`, tests.** `syntactic-break.test.ts` (it names the field in its peel, boundary, ё, and clitic tests; the five edits below are its) and the new `text/break-at-unit-end.test.ts`. `score/syntactic-break-surfaces.test.ts` does not name the field and passes unchanged.

## Does the desk's default bite anything?

It does not bite any reader above: nothing outside `boundaries.ts` branches on `'user'` versus `'punctuation'`. Two behaviours worth knowing, both stated before and not new:

- A # on a word that also ends in punctuation («слух, #»): the # wins, so the word is `'user'` where it was `'punctuation'`. The boundary is hard either way; only the label changes, and the Loupe will offer Remove break there (step 4), which is right because a # is present.
- A # on a line's last word is `'user'`, not `'auto'`, for the same reason. The boundary is hard either way.

## B3's expectations that moved, deliberately

Five tests in `apps/web/src/lib/syntactic-break.test.ts`. They are the only existing tests that moved; the corpus, the surfaces tests, `phrase-ends`, and the rest passed untouched.

1. `peelSyntacticBreaks`, "a # inside a word is ignored, and ends nothing": now read, belongs to that word, `broken [true, false]` (Dann 02:19).
2. "the boundary is the one punctuation stamps": now `['hard', 'user']`, with «слух, был» pinned `'punctuation'` beside it.
3. «Ты же # дом»: the enclitic's `boundarySource` is `'user'`.
4. «Ты # же дом»: B3's "singer's error" (`ˈtɨ# ʒɨ`, Ты hard) is gone. The # now takes effect after the unit, `ˈtɨ ʒɨ#`, as for «Ты же # дом».
5. «в # доме»: B3's finding 2 (`ˈf#do mʲɪ`, the preposition devoiced) is closed. It now equals «в доме #», and «в» keeps its voicing.

## Tests added

`apps/web/src/lib/text/break-at-unit-end.test.ts`, **37 tests**; `syntactic-break.test.ts` 32 before and 32 after (five rewritten, none added or removed). Gate 4 moved 3113 to 3150, which is 37.

| done-when | what the tests assert |
|---|---|
| 1 | «не # в силах» and «не в силах #» give identical IPA; the Russian is «не», «в», «силах»; the flag sits on «силах» only; boundaries `clitic`, `clitic`, `hard`/`'user'`; one # printed |
| 2 | «друг/слух/сказал # же/бы …» equals the # after the enclitic, and the trailing and spaced forms |
| 3 | four B3 pairs, each as «comma version plus a bare # after the word»; this fails on no tree and is there to catch a regression |
| 4 | a # after a line's last word, and after a comma: **the IPA shows a bare # after the word, and nothing audible moves** («слух был #» is «слух был» plus `#` on the last word; «слух, # был» is «слух, был» plus `#` on the first); one # per line across two lines |
| 5 | see below |
| 6 | «ва#с благодать» is «вас# благодать»; «вас ##благодать» and «вас #благодать» too; «вас благо#дать» is «вас благодать#»; a lone # first on a line, and as `#вас`, changes nothing; the dictionary finds every word (`stressSource` equals the unmarked line's and is never `'inferred'`) |
| 7 | «вас # благодать» is «вас# благодать», `cleanWord` «вас», dictionary entry found, `wordGrid` equal; the glued form twice, inside a word, and standing alone behind a space |

Also: the four glue patterns (a plain `\s` split cuts the glued form, `WORD_SPLIT` and `WORD_TOKEN` do not), the move being idempotent and leaving a no-# word with no key, and the source labels.

**Failing before / on the mutants** (the previous peel, `boundaries.ts`, or either file edited, run against both test files, then restored and diffed identical):

| mutant | result |
|---|---|
| inner # not read (strips only a trailing #) | 5 failed: B3's rewritten peel test, «ва#с благодать» twice, «вас благо#дать», the glued-inside case |
| # stripped, ` ` left behind (the brief's done-when 7 mutant) | 3 failed: all three done-when 7 tests |
| no move | 8 failed: «не # в силах» twice, «X # же Y» three, «сказал # бы», «Ты # же дом», «в # доме» |
| source stays `'punctuation'` | 6 failed |

## Done-when 5, and what I did instead of what it says

"Removing the # returns the IPA to its state before the #" cannot be tested as "strip the printed # from the marked IPA": the # blocks voicing, so «вас# благодать» (`ˈvɑs#`) differs from «вас благодать» (`ˈvɑz`) by more than the glyph. I tested the thing that is true: the text without the # transcribes to a line with no `'user'` boundary, no `syntacticBreak` anywhere, and an IPA that differs from the marked line's. Step 3's tests run the button's own Remove and compare against the original text's transcription, which is the real test of this item.

## Where the brief contradicts itself (Dann's to rule)

**Done-when 6 as printed: «вас благо#дать» "gives the IPA of «вас# благодать»".** It cannot, alongside the step's own design bullet: a # with letters to its left in its token, "trailing, as «вас#», or inside, as «ва#с»", takes effect at the end of the unit that holds THAT token, which for «благо#дать» is «благодать», giving «вас благодать#». I implemented the bullet, which is also Dann's 02:18 and 02:19 rulings. The tests pin «ва#с благодать» as «вас# благодать» (the likely intended example) and «вас благо#дать» as «вас благодать#». If the printed done-when 6 was meant, a # inside a word would have to end the word BEFORE it, which contradicts "takes effect at the end of its unit". I picked the bullet and report the conflict.

## The eight gates

Baselines are the task's, measured on `Shane` at `54c01bc3`; my own run before step 0 matched all eight.

| gate | command | baseline | after step 2 |
|---|---|---|---|
| 1 | `pnpm test:phonology` | 291 passed (291) | 291 passed (291) |
| 2 | `pnpm test:dictionary` | 248 passed (248) | 248 passed (248) |
| 3 | `pnpm --filter @ilya/web check` | found 0 errors and 12 warnings in 5 files | found 0 errors and 12 warnings in 5 files |
| 4 | `pnpm --filter @ilya/web test` | 3057 passed (3057) | **3150 passed (3150)**: +19 +37 (steps 1 and 2) |
| 5 | `pnpm --filter @ilya/score-parser test` | 775 passed \| 5 skipped (780) | 775 passed \| 5 skipped (780) |
| 6 | `pnpm test:blurb` | 145 passed (145) | 145 passed (145) |
| 7 | `pnpm test:integration` | 55 passed (55) | 55 passed (55) |
| 8 | `pnpm ratchets` | ratchets: OK. | ratchets: OK. |

Gate 4 against step 1's 3113: +37, all in `text/break-at-unit-end.test.ts`. Ceilings: `+page.svelte` 5581 of 5597, `pipeline.ts` **925 of 925** (no net line), `Loupe.svelte` 3012 of 3013. None changed.

## Where would this wall a singer in? (step 2's part)

- **A # typed inside a word now takes effect, and it is quiet.** «благо#дать» is read as a break after «благодать», the IPA shows it at the end, and the text keeps it where it was typed. The text and the IPA differ on purpose (Dann 02:18), but nothing on the page says why the mark is not where they put it.
- **«в # доме» is no longer an error you can see.** B3 printed the preposition devoiced; now the preposition keeps its voicing and the mark appears after «доме». A coach who typed the # to cut the voicing between «в» and «доме» gets the opposite, and has to read the Guide's unit sentence to know why.
- **A # before a punctuated word or after a line's last word is accepted and does nothing audible**, and the Loupe will offer Remove break on it (step 4); the IPA shows the bare #.

## What I could not establish

- Whether the pre-flag door agrees with the real pre-flag words in every case: it is fed the finished words in step 1's tests. In this step it runs on the real pre-flag words, and every pipeline test passes, B3's clitic cases among them (after the five edits above).
- The Lyrics text in a browser, Print, and the Lyrics `<textarea>`: NOT RUN. The Lyrics text lives in `doc.inputText` and reaches `processText` by value; I tested what the words keep.
- `ва#с` and `благо#дать` as the singer would type them inside the `<textarea>`: NOT RUN.
- A # typed into Poem: it still grafts in Text (B3's open item 3); not touched.
- Whether anything stored depends on the old label `'punctuation'` for a typed #: by grep, no reader outside the tests does.

## Strings owed to Dann

None. Step 2 adds no string a singer reads.
