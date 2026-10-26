# Report, batch C, row B3: the # for a syntactic break, QUEUE row 139 (r1)

Branch `cloud-lane-13`, after B2 (`752ddea`). Read and run in the Linux cloud sandbox, 2026-10-26. Every IPA below is the engine's, compared with another output of the same engine (the same words with a comma, and with nothing between them).

## What I built, in one paragraph

A typed # is peeled off the typed tokens in `splitIntoPreLines` and recorded as `syntacticBreak: true` on the word before it. It is never in `cyrillic`, `cleanWord`, or `punctuation`. `boundaries.ts` reads the field where it reads the punctuation test, so the word's right boundary is `hard` and the engine stops regressive voicing across it with no change to the engine. The # is added to the IPA alone: to the word's own four IPA strings (so an enclitic carries it into its host), to the rebuilt strings after open syllabification, to the last slot of the word before it (the words under the notes, and what a seated note draws), and to the IPA line under a score's notes in Markup.

## What I changed

New files:
- `apps/web/src/lib/syntactic-break.ts` (new, 45 lines): `peelSyntacticBreaks`, `graftBreak`, `SYNTACTIC_BREAK`.
- `apps/web/src/lib/clitic-merge.ts` (new, 143 lines): the clitic display merge, MOVED out of `pipeline.ts` `finishLine` unchanged (the second pass, formerly `pipeline.ts:921-1014`), plus `hasVowel`. It imports nothing from the engine, so `pipeline.ts` stays the one file that does. The # graft is the first step of `mergeCliticDisplay` (`clitic-merge.ts:36-47`, the loop at `:41-47`).

Changed files:
- `apps/web/src/lib/pipeline.ts`: peel at `:177-188`, with a hyphenated particle split in two taking the # on its last piece; the field on `PreTranscribeWord` (`:70`) and `TranscribedWord` (`:119`); carried across the singer's ё rebuild (`:302`); passed to the output word (`:457`, `:825`). The file went from 1022 to 925 lines.
- `apps/web/src/lib/boundaries.ts:13`, `:28`, `:51`: the field joins `PUNCTUATION_AT_END` in the `hasPunctuation` test, so the stamp at `:65-67` is `'punctuation'`.
- `apps/web/src/lib/syllable-utils.ts:316-319`: the re-cut after open syllabification rebuilds IPA from syllables (which carry no #), so it adds the # back.
- `apps/web/src/lib/score/pairings.ts:164-166`: `syllableIpa` grafts the # on a word's last syllable (three lines became one, so the file is 1422 lines).
- `apps/web/src/lib/score/vowel-resolver.ts:91`, `:617-618`: the IPA line under a score's notes in Markup.
- `apps/web/src/lib/text/same-words.ts:19-22`, `:29`: a typed # is folded, as a syllable hyphen is.
- `apps/web/src/lib/library/songs.ts:52-53`: a library title from a Poem ignores a #.
- `apps/web/src/lib/types.ts:59`: `syntacticBreak?: boolean` on `WordStackData`, set only where true, so no existing word object gains a key.
- `scripts/ratchets.json`: `pipeline.ts` ceiling lowered 1022 to 925, `pairings.ts` 1423 to 1422. Lowered, not raised.

## Sites that compute a word boundary or count typed words: verdicts

All checked against the tree. "Unchanged" means no edit, with the reason.

1. `boundaries.ts:37`, `:50`, `:65-67`: CHANGED (above). The engine's own `autoDetectBoundaries` (`engine.ts:1998`) has no caller anywhere in the tree (`grep -rn autoDetectBoundaries packages apps/web/src` finds only its definition and the app's own `boundaries.ts`); I left it alone and did not mirror the change.
2. `pipeline.ts:52-53` (`PUNCTUATION_REGEX`, `TRAILING_PUNCT_REGEX`): UNCHANGED. Neither gets a #, because a # is peeled before either reads the token.
3. `pipeline.ts` tokenization: CHANGED. A # between spaces, trailing, leading, or repeated never becomes a token that wants a note. An orphan # (nothing before it on the line) is dropped. A # inside a word is ignored.
4. `pipeline.ts` `toClean`, the trailing punctuation match, the lookup word: UNCHANGED. A # never reaches them. Proved: gloss, stress, stress source, and clitic classes of «слух # был» equal those of «слух был» (test).
5. `pipeline.ts:778-788` (the enclitic guard): UNCHANGED, as the brief required. A # does not change which words are clitics or enclitics. «Ты # же дом» shows the consequence: see "singer's errors" below.
6. `engine.ts:794-818`: UNCHANGED. No # reaches the engine.
7. Counters of typed words:
   - `same-words.ts:26`: CHANGED. `sameWords('я# на правду', 'я на правду')` is true (false before).
   - `songs.ts:52`: CHANGED, title only (see "Owed to Dann", item 3).
   - `score-seat.ts:86` (`rekeySeatsToLines`), `:107` (`seatScoreWords`), `clitic-seat.ts` `align`: UNAFFECTED, now proved by running: the same seats, on the same words, with and without a #, on one line and on two. They count pipeline words, and a # is no longer one. Before the change a standalone # was a pipeline word, which `align` refuses (`j !== pipelineWords.length`, `clitic-seat.ts:234`). The seat test is among the 38 that fail on the old tree (below).
   - `pairings.ts:203-250` (`buildSlotQueue`): CHANGED only to carry the # in `ipa`. The vowelless-clitic branch (`:213-226`) reads `ipaContent`, which now holds the # for a vowelless enclitic that carries it.
   - `vowel-resolver.ts` `spellsAs`/`cleanForAlignment` (`:160-168`): UNAFFECTED. It strips every non-letter, so «я#» and «я» align as before.
   - `poem-compare.ts:83-88`, `:99-107`, `:161-167`: UNCHANGED, proved: a # at a word's edge folds away and a standalone # folds to '' (punctuation), so the comparison colours nothing for either (test; it passes on the old tree too, as the brief expected).
   - `text/witness-lines.ts`, `score/seated-text.ts`: read the pipeline through `wordGrid`, which calls the same `splitIntoPreLines`, so they agree by construction (tested: `wordGrid` equal with and without #).
8. Other `split(/` hits (`grep -rn "split(/" apps/web/src --include=*.ts --include=*.svelte`), read, verdict NOT a reader of typed lyrics: `TitleHeader.svelte:208` and `insights/text-parts.ts`, `comment-text.ts`, `italics.ts` (markup of display strings), `page-config.ts:219` (a composer's name), `omr/metre-witness.ts:163` (XML), `score/selection-ring.ts:377`, `Loupe.svelte:584` (SVG viewBox), `insights/tessituragram-layout.ts:670` (a fixed label). Also `\S+` in `poem-compare.ts:103` (above) and `split(' ')` in `score/row108.support.ts:50` (test support).

## What depended on these agreeing, and how I proved they do

A boundary decides voicing (engine), which word punctuation belongs to and whether an enclitic attaches (pipeline), and how many tokens want a note (seating). The # now changes the first only, through one field read in one place, and the pipeline removes it before the other two count anything. Proof: the tests below, run against the pipeline, the slot queue, the seat, and the staff.

## Tests added, and which failed before

50 in two files: 32 and 18. On a fresh worktree of the commit before this one (with the 7 unit tests of the new peel module left out, because the module did not exist), 38 of 43 failed. The five that passed are the ones the brief said the unchanged tree already does: the syllables hold no # (the field is new); Lyrics keeps the # while edited; the note count is the same with and without a # (the brief: "the first alone cannot" fail); the Lyrics-to-Poem comparison colours nothing; `sameWords` still tells different words apart.

`apps/web/src/lib/syntactic-break.test.ts` (32):
- The peel: standalone, trailing, leading, orphan, repeated, after punctuation, inside a word.
- The pipeline counts the same words and `wordGrid` for six typed shapes; a # alone is no line.
- Done-when 1: three pairs, «слух # был», «лес # дремучий», «свет # дня»: each pair assimilates when nothing stands between (plain differs from comma), the IPA of X with the # is the IPA with a comma plus `#`, Y is unchanged, and the only extra symbol is the #. Alone, trailing, and leading give the same IPA. The boundary is `hard`, source `punctuation`.
- The field: set on the word before, absent from `cyrillic`, `cleanWord`, `punctuation`, `stressedCyrillic`, and every syllable's `ipa`; gloss, stress, and clitic classes unchanged; kept across a ё toggle.
- Done-when 4 (below). A # after a proclitic.
- The four IPA strings, the host of an enclitic that carries the #, the open-syllable re-cut, and the Notation switches all keep one # at the end.

`apps/web/src/lib/score/syntactic-break-surfaces.test.ts` (18), one per surface:
- Lyrics: laying the text out in the poem's lines keeps the #.
- Text's Cyrillic: no # in any field of any word.
- The words under the notes: the same number of slots with and without a #; no slot's `cyrillic` holds a #; the last slot before the # carries it in `ipa`, and no other slot does; on a word of several syllables, its last; for a vowelless enclitic and a vowel-bearing one.
- Lyrics as drawn (`drawPairings`), with and without open syllables and reconstitution: Cyrillic clean, IPA carries it.
- The comparison: nothing coloured.
- `sameWords`, and the library title.
- Markup: a real folded score rendered with the drawn Cyrillic and IPA: exactly one `<text>` holds a #, it is the IPA `…ˈjɑ#`, no Cyrillic text holds one, and the SVG holds no `phonation-break` and no `[#]`.
- Markup and Insights through the resolvers: the IPA of the first note ends in #, the others do not, and no vowel Insights reads holds one (`InsightsPane.svelte:169-175` reads only `.vowel`; I read that, I did not render the pane).
- The score's seat: four notes seated, the same words, the same seats, with and without a #.

`apps/web/src/lib/syntactic-break.support.ts`: loads the real dictionary and supplement for these tests.

## Done-when

1. **Voicing**: met, three pairs.
2. **Never in the Russian**: met on every surface above that I ran. Not run: a browser, the Lyrics `<textarea>`, and Print. By reading, Print draws `w.cyrillic`, which holds no #.
3. **No note**: met, with all three assertions (the second and third fail on the old tree).
4. **Enclitic**: met. «Ты же # дом»: же is Ты's enclitic, Ты's boundary is `clitic`, же's is `hard`, and the IPA is the comma version plus `#` after the enclitic: `ˈtɨ ʒɨ#`. For a case where the voicing difference shows, «друг ж # дом» reads `ˈdruɡʃ#`; with nothing between, `ˈdruɡʒ`; with a comma, `ˈdruɡʃ`.
5. **Gates**: at baseline. See below.

## The eight gates

Before B3, the same figures as in B1 and B2 (matching the prompt). After B3:

| Gate | After |
|---|---|
| 1 phonology | 267 passed (267) |
| 2 dictionary | 248 passed (248) |
| 3 web-check | 0 errors, 12 warnings in 5 files |
| 4 web-test | 3012 passed (3012) (2962 after B2, plus 50) |
| 5 score-parser | 775 passed, 5 skipped (780) |
| 6 blurb | 145 passed (145) |
| 7 integration | 55 passed (55) |
| 8 ratchets | OK |

Gates 1, 2, 5, 6, and 7 were last run one test file before the final tree: the only later change is the added score-seat test in `syntactic-break-surfaces.test.ts`, which no gate other than web-test reads. Gates 3, 4, and 8 were run on the final tree. The IPA corpus approval and `staff-renderer-real-fixture.approval.test.ts` did not move. That second one cannot move from this change: by its own header it reads the engraver's verse-2 IPA and never runs the pipeline, and the two marks in `sunless-01-engraved.musicxml` sit in verse 2, not in the sung verse (`diction-fold-live.test.ts:7-8`, `:66-77`). So B3 does not change Sunless 1's sung text. The effect on a score whose SUNG verse carries a mark (the Sunless 4 shape) is what the surfaces tests measure.

## Where the # lands in Markup, and the existing `[#]` code

The # lands on the IPA text of the note that carries the word's last syllable, appended to that note's IPA string after the syllable and after any vowelless enclitic's IPA, drawn in the same `<text>` element (`…ˈjɑ#`). It does not draw as a separate mark and not at a junction between two notes.

The `[#]` code: `staff-renderer.ts:3126` and `:3311-3314`, the flag `phonationBreak` (`analysis-types.ts:227`). Nothing in the app sets it now: `phonationBreakEventIds` (`diction-marks.ts:305`) has no caller outside its own test, `overlay-engine.ts:232` sets false, and only `demo-fixture.ts:163` sets true. I removed nothing. It is dead for the app and reachable from the demo fixture; the desk decides whether to remove it. The Guide text that describes it contradicts the graft (see "Owed to Dann").

## Where would this wall a singer in?

Fable's question. Cases I found, all measured on the tree:

1. **A # typed in a place that cannot hold a break does nothing, and nothing says so.** A # inside a word («сло#во» prints «слово»), at the start of a line, or alone on a line is dropped. The singer can still see it in the Lyrics field and remove it, so they are not stuck, but they cannot tell it did nothing.
2. **A # after a proclitic changes the preposition.** «в # доме» reads `ˈf#do mʲɪ` where «в доме» reads `ˈvdo mʲɪ`: the hard boundary stops the voicing, so «в» devoices, and the # shows beside it. The singer can tell why (the # is printed), and remove it. This follows the ruling to the letter ("always ends the word before it"); I did not special-case it.
3. **A # before an enclitic: «Ты # же дом».** «же» still attaches to «Ты» across the # (rule 5 of the brief), «Ты» is `hard`, and the IPA reads `ˈtɨ# ʒɨ`, with the # between host and enclitic. No error, a harder-to-read string.
4. **A score's own folded # still prints in Russian where the singer has seated nothing.** I measured it: rendering the folded Sunless 4 shape with no pairings draws `<text>я#</text>` in the Cyrillic row, because the staff falls back to the file's own syllable text (`staff-renderer.ts:1029`, `:2433`: `cyrPreview?.[id] ?? ev.syllable?.text`) and the fold concatenated the mark onto that text (`diction-marks.ts`, ruled 2026-07-30: "the mark joins the syllable before it and is never discarded"). That is a # showing where Dann's 2026-10-21 00:26 ruling says it must not. It is not from a typed #, it predates this row, and fixing it changes the 2026-07-30 ruling or the renderer's fallback, so I did not. Once the singer's Lyrics are seated, the Cyrillic comes from the pairings and is clean.
5. **A # typed in Poem also grafts in Text.** The pipeline cannot tell which field it was given. The desk default was "a # typed in Poem is ignored as punctuation"; I applied that only to the library title. In Text, a # in the Poem changes the IPA the same way a # in Lyrics does. See "Owed to Dann", item 3.
6. **The Text component's demerged branch.** `WordStack.svelte:45-49` shows a host's own IPA (`ipaContent`) when an adjacent clitic has reconstitution active. A # that an enclitic carries lives on the enclitic's own string, which is shown only where its reconstitution is active. So with a per-word reconstitution toggle on the host but not on an enclitic that carries the #, the # may not be visible. I read this and did not render it.

## What I could not establish

- Anything in a browser: the Lyrics `<textarea>` keeping the #, Text's drawn IPA, Print, and the cases in 6 above. I tested the functions and the SVG string.
- Which field feeds which `processText` call in `+page.svelte`. I did not trace it, so "a # in Poem grafts in Text" is by the pipeline's shape, not by a run of the page.
- Whether the voice analysis reads IPA characters anywhere I did not look. Insights reads only vowels (read, not run). Markup's IPA row is a string drawn as text (run).
- Whether the # in the IPA should play or audition: out of scope.
- The old-tree behaviour of the 7 peel unit tests, which cannot run there because the module did not exist. They pin the peel's own rules.

## Owed to Dann

1. **The Guide line** in both languages that explains the #. `GuideContent.svelte:380` (EN) and `:84` (FR) now contradict the graft: "A phonation break is written **[#]** on the IPA line, at the junction of the two notes it separates…" / « …à la jonction des deux notes qu'elle sépare… ». Not edited, as the brief says. French is Dann's.
2. **A ruling on a score's own folded # in the staff's Cyrillic** (finding 4): it still prints «я#» when the singer has seated nothing, contrary to the 2026-10-21 00:26 ruling.
3. **A ruling on a # typed in Poem.** I honoured it in Text (it is the same pipeline) and ignored it only in a library title. If it should be ignored in Text too, the Poem caller passes a flag to `processText`.
4. **A decision on `[#]`**: `staff-renderer.ts:3126` and `:3311-3314` are now dead for the app.
5. **Two choices I made, his to wave off:** a # inside a word is ignored; a # after a proclitic follows the proclitic's IPA (finding 2). A reversal of either is one line (`syntactic-break.ts`, `clitic-merge.ts`).

No new string a singer reads was added in this row.

## Cost

About 176k tokens for B3, including two worktree runs against the old tree. About 333k used in the session in all, including the install and baselines.
