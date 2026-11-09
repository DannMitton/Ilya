# Report: row 181, step 8c (the join refused songs 2, 4 and 5), Code, r1, 2026-11-05

Branch `cloud-lane-34`. The join said "the transcription of Lyrics does not line up with its words" for songs 2, 4 and 5 (`tokenMapOf`, `text/poem-join-wire.ts`). **I do not have those songs' Lyrics, so I cannot say which cause hit which song.** What I can report is fact from the code and from probes run here, a fix for each cause found, and a console line that names the first disagreement so the desk can read the cause for each song. NOT ESTABLISHED marks the rest.

## What the old check required

One transcribed word for every Lyrics token that has letters, in order, with `fold(cleanWord)` equal to the token's `fold` (the old `tokenMapOf`, `text/poem-join-wire.ts:43-58` at `4e5e5dbc`). The transcription is `processText` (`pipeline.ts:229`); its words are made in `splitIntoPreLines` (`pipeline.ts:169-191`). The Lyrics tokens are `tokenize` (`text/poem-compare.ts`, using `WORD_TOKEN`, `text/break-glue.ts:15`).

## Probe

I ran the real `processText` on a synthetic lyric of each shape (this sandbox, with no dictionary loaded) and the old check. Results, as run:

| Shape | Old check | Words the pipeline made |
|---|---|---|
| plain, with a comma | lined up | one per token |
| syllable hyphens inside a word (`Ком-нат-ка`) | lined up | `Комнатка` |
| `кто-то` (a hyphenated word, no particle) | lined up | `ктото` |
| `я # на`, `я# на`, `я # на` (the three forms of the `#`) | lined up | `я`, `на` |
| a punctuation-only token (`Средь — бала`) | lined up | `Средь`, `бала` |
| `не проглядная ночь` | lined up | three |
| pre-reform letters, an old genitive ending, `ё`, guillemets, an ellipsis, a digit, a Latin word, two lines, a blank line | lined up | one per token |
| **`велит-ли он`** | **did not line up** | `велит`, `ли`, `он` for the tokens `велитли`, `он` |
| **`ска-же ты`** | **did not line up** | `ска`, `же`, `ты` for the tokens `скаже`, `ты` |
| **`Сред—ь бала`** (an em dash inside a word) | **did not line up** | `Средь` for the token folded as `сред—ь` |

## Causes found, as fact

1. **A hyphenated particle is split into two words by the pipeline; the Lyrics has one token.** `expandHyphenatedParticles` (`typed-hyphens.ts:146-161`), called at `pipeline.ts:181-183`, splits a token at its last hyphen when the part after it is `ли`, `ль`, `бы`, `б`, `же` or `ж` (`HYPHENATED_PARTICLES`, `typed-hyphens.ts:131`; the hyphen it looks for is any of `-‐‑–—`, `ANY_HYPHEN`, `typed-hyphens.ts:38`, so «ска—же» with a dash splits too) and the whole token does not resolve to a dictionary word (`!resolves(token)`). The pipeline then has one word more than Lyrics has tokens, from that point to the end, so the walk fails at the first such word. A Lyrics that carries syllable hyphens before «же», «ли», «бы» (a syllabified word such as «ска-же») meets it.
2. **A dash or bracket inside a word is stripped by `cleanWord` and kept by `fold`.** `fold` (`text/poem-compare.ts:84-89`) strips the token's edges and the characters `-`, `‐`, `‑` only. `cleanWord` has every mark of `PUNCTUATION_REGEX` removed (`pipeline.ts:54`: the full stops, commas, quotes, en and em dashes, ellipsis, brackets, guillemets). So «сред—ь» or «Сре(д)ь» folds differently on the two sides.

**Not causes** (the probe lined these up): the `#` in its three forms including the no-break space form; a punctuation-only token; pre-reform folding; the old genitive ending; `ё`; «не» before a word (`joinAfterNe`, `ne-join.ts:39`, changes stress, not the word list); guillemets, ellipsis, digits, Latin words; blank and multiple lines; syllable hyphens inside a word.

**Caveat on the probe.** The dictionary is not loaded in this sandbox. `expandHyphenatedParticles` declines to split a token the dictionary resolves, so with the dictionary loaded fewer tokens split than in my probe. The fix below does not depend on the dictionary either way. **NOT ESTABLISHED:** whether songs 2, 4 and 5 hit cause 1, cause 2, both, or something this probe did not cover; whether a scan's Lyrics carry syllable hyphens at all (`scoreWordsText` joins each word's `raw`, `score/vowel-resolver.ts:325-327`; I did not read how `raw` is built).

## The fix (`text/poem-join-wire.ts`)

- `tokenMapReport` replaces the walk. A Lyrics token may be more than one transcribed word: the words read toward a token, joined, must equal the token's letters. Both sides are compared as letters and digits only (`core`), which removes cause 2. Tested: the six particles (`-ли`, `-же`, `-б`, `-ль`, `-ж`, `-бы`) map both words to the one token; a dash and three kinds of bracket or comma inside a word line up.
- `tokenMapOf` is `tokenMapReport(...).map`; nothing else changed for its callers.
- **What it still refuses**, and says why: a word that cannot be part of the token being matched, a transcription with more words than Lyrics, Lyrics with more tokens than words. Tested with real transcriptions.

## The console line

`PoemJoin.run` now says (`text/poem-join.svelte.ts`, with `describeFailure`):

`[ilya] poem join: the transcription of Lyrics does not line up with its words, so nothing is joined: at line 1, word 2, the transcription's «бала» against Lyrics token 2 «бал» (folded «бал»); 3 transcribed word(s) and 3 Lyrics token(s) with letters`

It names the line (1-based) and word (0-based) the transcription was at, its folded word (and the words already read toward the token, when a split word is part-read), the Lyrics token's index, raw text and folded form, and the two counts. Where the transcription ran out first it says "after the last transcribed word"; where Lyrics ran out first, "against no further token".

## Tests

`text/poem-join-wire.test.ts` (+21): 17 shapes lined up through the real pipeline; the six particles; the dash and brackets inside a word; the failure's fields and its sentence for a changed word, for more transcribed words, for more Lyrics tokens, and for a split word part-read. `text/poem-join.svelte.test.ts`: the console line names the first disagreement for a stale transcription.

## Gates (this sandbox, Linux; one run for 8a, 8b, and 8c)

| Gate | Result |
|---|---|
| web unit | **4381 passed, 1 skipped** (245 files). Baseline on the tip: 4354 passed, 1 skipped. +27 tests |
| web-check (`svelte-check`) | 0 errors, 12 warnings (equal to baseline) |
| ratchets | OK |
| build, e2e, other packages | not run in this step (no package outside `apps/web` changed; the last `vite build` was step 6's) |

## Not established

Which cause hit songs 2, 4 and 5 (the console line will say); whether the dictionary being loaded removes cause 1 on the real songs; whether `raw` carries syllable hyphens; what the join then does on those songs (it will run now; its own console line is the first measure).
