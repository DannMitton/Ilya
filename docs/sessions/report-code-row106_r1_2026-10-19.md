# Report: row 106, a typed hyphen inside a word is a syllable break (Code, r1, 2026-10-19)

Branch `cloud-lane-11`. Brief: `brief-code-row106-typed-hyphens_r2_2026-10-19.md` (saved verbatim at `e661cd7`). Started from `e661cd7` (clean working tree). No pull request, nothing under `docs/memory/` touched, `Shane` and `main` untouched.

## 1. The answer

Built as the brief says. A word typed in the score's division now keeps its identity and its syllables.

- «ве-ли-кий», «до-ро-га,», «о-ди-но-ка-я» have великий's, дорога's, and одинокая's stress and gloss, and their syllables are the ones typed.
- «прог-ляд-на-я» and «про-гляд-на-я» each divide as typed, with the same stress and the same IPA letters as «проглядная».
- «кто-то», «по-русски», «какой-нибудь» read as they did; «по-рус-ски» and «ка-кой-ни-будь» now resolve to them.
- «бы-ли», «зна-ли», «у-же», «что-б», «гля-дѣ-ли» are one word each; «велит-ли» and «места-б,» still split.
- Both fixtures, typed in the file's division, now read exactly as the one-line fill does: 0 unknown words, the same stress, gloss, and cleanWord on every word, 39 and 96 for «Within Four Walls», 95 and 172 for Tchaikovsky.
- Text prints what was typed. `cleanWord` is unchanged in shape (letters only), so `wordGrid`, seats, marks, and stored glosses stay where they are.

Two things differ from the brief and are named in section 6: the open-syllables switch starts OFF in this build, and the brief's "50 unknown tokens today" for Tchaikovsky measures 44 under the definition I could reconstruct.

## 2. What changed

| File | Change |
|---|---|
| `apps/web/src/lib/typed-hyphens.ts` (new, 299 lines) | The syllable-hyphen set (`-`, U+2010, U+2011); the resolution (as typed, joined, then partial subsets with fewest kept first; at most 10 inner hyphens get partial subsets, past that only the two ends); `resolvesToWord` and `expandHyphenatedParticles` (moved from `pipeline.ts` with `HYPHENATED_PARTICLES`); breaks as letter offsets; `carryBreaks` through an old-spelling change; `settleBreaks` (the vowelless rule); `reinsertBreaks`; `cutAlongTypedBreaks`. The dictionary is reached through a `known` the pipeline passes in. |
| `apps/web/src/lib/pipeline.ts` | 1064 to 1060 lines (ceiling lowered to 1060). `buildPreTranscribeWord` now resolves first and wraps the old body, renamed `buildResolvedWord`. The lookup half became `readSpelling`, shared with `knownForm`. `cyrillic` is the typed form with hyphens reinserted. After `GraysonEngine.transcribe` the engine's own syllables are cut along the typed breaks, before cross-word assimilation. The Dictionary panel reads `lookupWord`. `DASH_REGEX`, `TRAILING_PUNCT_REGEX`, and the ё-toggle's skip set take U+2010 and U+2011. |
| `apps/web/src/lib/syllable-utils.ts` | `openSyllabify(syllables, typedBreaks?)` leaves a typed boundary alone; `reslicedSyllables` passes it. |
| `apps/web/src/lib/types.ts` | `WordStackData.typedBreaks?: number[]`. |
| `apps/web/src/lib/score/vowel-resolver.ts` | Passes `w.typedBreaks` at its `openSyllabify` call. `modernSyllables` moved to `typed-hyphens.ts` and is re-exported (see 6, item 3). |
| `apps/web/src/lib/components/Drawer/InspectorPanel.svelte` | Its two `openSyllabify` calls pass `word.typedBreaks`, line for line: 2432 of 2432, ceiling unchanged. |
| `apps/web/src/lib/old-spelling.ts` | `stripForLookup` strips a trailing U+2010 or U+2011 too. |
| `scripts/ratchets.json` | `pipeline.ts` 1065 to 1060. |
| `apps/web/src/lib/typed-hyphens.test.ts` (new), `apps/web/e2e/typed-hyphens.test.ts` (new) | Tests, section 4. |

`engine.ts` is untouched (2291 of 2291). `+page.svelte` is untouched (5643). No string was added to `i18n.ts`.

### How it works, in the order it runs

1. A token with an inner hyphen (between two letters) is resolved: each candidate is run through N.12 and row 25 as any word is, and the first the dictionary holds wins. If none is a word, the joined form stands and every typed hyphen is a break.
2. The particle split asks the same question of the whole token, so «бы-ли» is one word and «велит-ли» is two.
3. `buildResolvedWord` builds the word from the resolved spelling, so every lookup, ё restoration, and ё probe reads a word it can find. `cleanWord` is letters only.
4. The breaks are carried across any letter change and settled by the vowelless rule. The engine's syllables are then cut along them, each stretch between typed breaks divided by the engine's own `syllabify`, and the log's `syllableIndex` renumbered. `syllables` and `result.syllables` stay one array.

## 3. Gates

Run on `e661cd7` first, before any tracked edit: every baseline in the brief held.

| Gate | Baseline (brief) | On `e661cd7` | On the final tree |
|---|---|---|---|
| phonology | 267 | 267 | 267 |
| dictionary | 248 | 248 | 248 |
| web-check | 0 errors, 12 warnings in 5 files | same | same |
| web-test | 2764 | 2764 | 2802 (the 38 new tests, all in one file) |
| score-parser | 709 passed, 5 skipped | same | same |
| blurb | 145 | 145 | 145 |
| integration | 55 | 55 | 55 |
| ratchets | OK | OK | OK; `pipeline.ts` 1060 |

Playwright on the final tree:

| Project | Brief's baseline | Final tree |
|---|---|---|
| phone | 17 passed, 1 skipped | 17 passed, 1 skipped |
| chromium | 71 passed, 2 failed, of 73 | 72 passed, 2 failed, of 74 (the one new test passes) |

The two chromium failures are the two the brief names, `e2e/insights-page.test.ts:95` and `e2e/singer-paths.test.ts:169`. No other failure.

## 4. Tests, by the brief's letters

All in `apps/web/src/lib/typed-hyphens.test.ts` (38 tests), loading the real dictionary as `old-spelling.test.ts` does. Run on the old tree (the source changes stashed): **33 of 38 fail**. The five that pass there are regression guards that hold today by construction, and I name them so they are not read as proofs of the change: the `wordGrid` equality in i; l (Lyrics' colour, 0 differing, which the brief says holds today); n (`cleanWord` already strips `-`, so the anchor survives); the «велит-ли» and «места-б,» split in f; and the ё-toggle landing on the same letter in h. The clause of h that does discriminate, "after the toggle the word still divides as typed", is the added «пер-е-ход» test, because on «ве-ли-кий» Ilya's own division equals the typed one and the clause cannot fail.

| Letter | What it holds |
|---|---|
| a | ве-ли-кий, до-ро-га, о-ди-но-ка-я: stress and gloss of the whole word, syllables as typed, `cleanWord` the whole word |
| b | прог-ляд-на-я and про-гляд-на-я divide as typed, same stress, same IPA letters as проглядная; the log follows the cut; `syllables` is `result.syllables`. A second test types **every word of both fixtures** in the file's division and compares its IPA letters with the one-line fill's, and checks every typed break lands on a syllable edge |
| c | ве-ликий (stress 1, gloss); прог-лядная and про-глядная |
| d | серд-ц-е is сердце, сердц\|е, stress 0, `typedBreaks` [5], prints «серд-ц-е»; a vowelless first part (в-ечер) |
| d′ | U+2010 and U+2011 read exactly as «ве-ли-кий», and print as typed |
| e | кто-то, по-русски, какой-нибудь as today; по-рус-ски and ка-кой-ни-будь resolve; кто-то's Dictionary panel (`fullGlossEn`, `allDictEntries`) is filled |
| f, f′ | бы-ли, зна-ли, у-же, что-б one word each; велит-ли and места-б, split; так-же is также (pinned); гля-дѣ-ли is глядели, stress from the dictionary |
| g, g′ | дѣ-ти (дети, prints «де-ти», two syllables); шум-на-го (шумного, prints «шум-но-го», IPA equals шумного's); пе-чаль-ны-я (see 5, item 1) |
| h | тя-же-лый (тяжёлый, stress 1, `yo-restored`, prints «тя-жё-лый»); the toggle tests |
| i | `wordGrid` equal for the one-line and file-division text; 96 seats before and after, the same keys and origins; the two re-divided words' seats read про, гляд, на, я and сча, стье after `refreshPairings` (before: прог, ляд, на, я and счас, тье) |
| j | `openSyllabify` with and without the typed breaks; `drawPairings` and `buildUnderlayResolvers` with the switch on (typed «прог-ляд-на-я» draws `prɑɡ lʲɑd nɑ jɑ`; the same word untyped opens to `prɑ ɡlʲɑ dnɑ jɑ`) |
| k | Sunless: 0 unknown, stress, source, and gloss equal to the one-line text's on all 39, 96 slots, 58 of 58 hyphens kept as breaks. Tchaikovsky: 0 unknown, 95 tokens, 172 slots, the same `cleanWord`, stress, and source as the one-line fill on every token, 82 of 82 hyphens kept |
| l | Lyrics' colour, the file's division against the one-line text: 0 differing |
| m | Text prints «ве-ли-кий» and «кто-то» as typed |
| n | `glossAnchorForm` of `cleanWord` (the page's closure cannot be imported, so the test restates its one line) |

**The Inspector's two call sites** (`InspectorPanel.svelte:116`, the header IPA, and `:135`, the Ribbon) have no unit test that reaches them. I checked them in a browser with a new Playwright test, `e2e/typed-hyphens.test.ts`: with the open-syllables switch turned on, «прог-ляд-на-я» shows the header IPA `proɡ lʲɑd nɑ jɑ` and four Ribbon syllable groups; «проглядная» shows `pro ɡlʲɑ dnɑ jɑ`. I did not run that test on the old tree. **The Inspector's moved-boundary editor** (`:781-818`) on a word with typed breaks was not read (brief section 10); the override still outranks, as the code order shows, and nothing was run.

## 5. Costs and things found

1. **A bug the brief did not predict, found and fixed.** `lookupOnlyTwin` looks a word up on its bare letters, so «пе-чаль-ны-я» matched печальныя as typed, kept its hyphens as part of the spelling, and carried no breaks. `knownForm` now lets a twin vouch only for a form without a hyphen. A test holds it (g′).
2. **U+2010 and U+2011 are stripped from `cleanWord`** (brief section 5, item 1's named cost). A stored Lyrics holding either character changes its `wordGrid` entry, and a pairing whose `origin.word` carries the character no longer matches its slot and is left as stored (`pairings.ts:462-465`). Whether any stored song holds them was not searched.
3. **Dropped breaks (vowelless part).** «серд-ц-е»: the hyphen between «серд» and «ц» goes; the word divides сердц\|е. «в-ечер»: the hyphen after «в» goes. «что-б»: it resolves to чтоб, one syllable, and the hyphen before «б» goes. In the two fixtures, typed in the file's division, **no break is dropped**: 58 of 58 and 82 of 82 hyphens stand.
4. **The measured cost of the resolution order, already in the brief:** «так-же» reads as также, and the 81 compounds the dictionary lists both ways read as the joined spelling when typed in syllables. Pinned for «так-же» (f).
5. **An unresolved hyphenated word now divides along its hyphens.** A hyphen inside a word that no candidate form makes a dictionary word, including one that is lexical in fact, now becomes a break rather than being dropped from the letters. Its letters and `cleanWord` are as before; only its division follows the hyphen. Not measured on any real text.
6. **A part with the old spelling's letters** is carried through `carryBreaks` (same letter count: offsets stand; otherwise `modernSyllables`, and on null Ilya divides the whole word). Only the same-count path is exercised by a test (дѣ-ти, шум-на-го, гля-дѣ-ли, пе-чаль-ны-я). The null path and the dropped-hard-sign path are **not run**.
7. **The recut refuses rather than guesses.** `cutAlongTypedBreaks` leaves the engine's division in place if the syllable count would change, if the per-letter IPA does not add up to the syllables' IPA, or if the stress would move. Across all 134 words of the two fixtures it never refused (test b), but a word outside them could.

## 6. Where this differs from the brief

1. **The open-syllables switch starts OFF.** The brief says "With the switch on (the default)". In a fresh browser context the Notation switch was off; the new e2e test turns it on, and the unit tests pass `openSyllabification: true` explicitly.
2. **Tchaikovsky's "50 unknown tokens today" measures 44 here.** I counted a token as unknown when its stress source is `inferred` and its stress is -2, on the old tree, typed in the file's division. The brief's 97 tokens and 161 slots reproduce exactly, and so does 25 for «Within Four Walls». The brief's definition of "unknown token" for the 50 is **NOT ESTABLISHED**.
3. **Two edits outside the brief's list.** `modernSyllables` moved from `vowel-resolver.ts` to `typed-hyphens.ts` and is re-exported there, because `vowel-resolver.ts` imports the pipeline and the pipeline now needs it (a cycle otherwise). `old-spelling.ts`'s `stripForLookup` takes U+2010 and U+2011 so a particle host typed with either strips like one typed with `-`.
4. **`readSpelling`/`buildResolvedWord` split.** The brief said the other call sites change in place; the lookup half of `buildPreTranscribeWord` had to be callable on a candidate with no side effects, so it became its own function. Behaviour for a word with no inner hyphen is unchanged (every earlier test passes).

## 7. Open for Dann

The three the brief lists, unchanged by what I found:

- **Taste: Text prints what Lyrics holds, hyphens included.** Built as the brief's default (r2b). The alternative is Text printing the resolved spelling, великий for «ве-ли-кий».
- **Taste: Ilya writes no hyphen into Lyrics.** The alternative would rewrite the singer's text and turn off the four score comparisons.
- **Not built: a score's words fill Lyrics joined, with no hyphen.** After this row the fill could write the score's own division as typed hyphens; it changes `scoreText` and the four comparisons, and row 108's `sameWords` decision bears on it.

One more, from this build: **no sentence tells the singer that a hyphen is now a syllable break.** The brief forbids a new string, so I wrote none. A Guide line is the natural place; it would be the desk's, EN and FR, for Dann's ruling.

## 8. What I could not establish

- **Whether the engine's per-letter IPA is independent of where the syllables are cut, in general.** On the 134 words of the two fixtures, typed and untyped, it is (test b: the IPA letters match word for word and the recut never refused). Not shown for the dictionary at large.
- **How often a hyphenated particle that is also a word (так-же) reaches Lyrics.** No corpus here.
- **A pre-reform word with a dropped hard sign mid-word** through `carryBreaks`/`modernSyllables`: not run.
- **The 9 plain words and 81 compounds** of the brief's section 4 in any real song text: not searched.
- **How a MusicXML file engraves a lexical hyphen** (кто- and то, or кто and то): neither fixture has one.
- **Whether any stored song holds U+2010 or U+2011.**
- **The Inspector's moved-boundary editor on a word with typed breaks**, and **the four score comparisons** (`+page.svelte:406`, `:653`, `:2008`, `:2033`) under a Lyrics holding hyphens: read as lines only, not traced.
- **The brief's "50 unknown tokens"**: see 6, item 2.
- **WebKit and Firefox:** nothing here is browser-specific, nothing was run there.
