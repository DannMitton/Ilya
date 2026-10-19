# Report: row 108, phrase ends from the music, Lyrics of several lines seat, Lyrics takes the poem's lines (Code, r1, 2026-10-19)

Branch `cloud-lane-11`. Brief: `brief-code-row108-lyrics-lines_r3_2026-10-19.md`, saved verbatim at `f0b8285`. Built in the brief's order, each part its own commit and push: C at `94160f0`, A at `c7104e6`, B at the commit that carries this report. No pull request, nothing under `docs/memory/` touched, `Shane` and `main` untouched.

## 1. The answer

All three parts are built, and every number the brief measured on the two fixtures reproduced.

- **C.** A word the score places ends a phrase where the music does (a rest, a breath mark, a caesura, a fermata) and nowhere else except at punctuation and the last word. Where no score places a word, a line end stays a phrase end. On «Within Four Walls» in the stand-in's six lines, all 39 words now read as on one line («полёт» is `pɑ ˈlʲod`). On Tchaikovsky, «так» (index 77) is `ˈtɑk`, and the score's own seat now reads the old spelling: 0 seats before, 172 of 172 now.
- **A.** `seatScoreWords` and `align` take several lines. The six-line layout seats 96 of 96 (it seated 0), each slot on the same note with the same text as the one-line fill; Tchaikovsky in lines of seven seats 172 of 172.
- **B.** Lyrics holding the score's words, in Ilya's own line breaks, takes the poem's lines at the three moments the brief names, only where at least half of either text's words match. A Lyrics the singer broke into lines of her own keeps them. `sameWords` folds a syllable hyphen, so a Lyrics typed in the score's syllables is the score's words too.

Three things the brief did not predict are in section 6: the stored seat IPA is stale after a phrase-end re-run, the second moment needs a microtask, and a short partial Poem passes the agreement test.

## 2. What changed

| File | Change |
|---|---|
| `apps/web/src/lib/score/phrase-ends.ts` (new) | `musicPhraseEnds`, `phraseEndsKey`, `shouldRerunForPhraseEnds` |
| `apps/web/src/lib/boundaries.ts` (new) | `autoDetectBoundaries` moved out of `pipeline.ts`, with the music step; `'score'` boundary source |
| `apps/web/src/lib/pipeline.ts` | 1060 to 1022 lines. Every line is transcribed first, cross-word assimilation runs once over all of them, then each line is finished (`transcribeWords`, `finishLine`). `phraseEnds` option. |
| `apps/web/src/lib/types.ts`, `packages/phonology/src/engine.ts` | `phraseEnds` option; `'score'` joins the boundary union (`engine.ts` one line in place, 2291 of 2291) |
| `apps/web/src/lib/score/vowel-resolver.ts`, `clitic-seat.ts` | `spellsAs` exported; `align` matches by it, and takes `lineWidths` so a slot's word is its place in the flattened lines |
| `apps/web/src/lib/score/score-seat.ts` | takes every line; the "already placed" test keyed by flat place and slot, and by `origin.word` where the seat has one; `rekeySeatsToLines` |
| `apps/web/src/lib/score/waiting-seat.ts`, `replace-seat.ts` | re-key last |
| `apps/web/src/lib/text/same-words.ts` | folds `-`, U+2010, U+2011 between two letters |
| `apps/web/src/lib/text/relining.ts` (new) | `lyricsInPoemLines`, the one decision |
| `apps/web/src/lib/text/gloss-survival.ts` (new) | `keepSurvivingGlosses` and `glossAnchorForm` lifted out of the page, behaviour unchanged, to make room |
| `apps/web/src/routes/+page.svelte` | 5643 to 5640 (ceiling lowered to 5640): one derived and one effect for the phrase ends, `adoptPoemLines` and its three calls, four comparisons through `sameWords`, five seating callers re-key last |
| `scripts/ratchets.json` | `pipeline.ts` 1060 to 1022, `+page.svelte` 5652 to 5640 |

No string was added to `i18n.ts` or `GuideContent.svelte`.

## 3. Gates

Run on `f0b8285` first (the brief's commit, the same code as `5efa88bd` plus the Guide commit): every baseline held, web-test 2802.

| Gate | Baseline | After C | After A | After B |
|---|---|---|---|---|
| phonology | 267 | 267 | 267 | 267 |
| dictionary | 248 | 248 | 248 | 248 |
| web-check | 0 errors, 12 warnings in 5 files | same | same | same |
| web-test | 2802 | 2818 (+16) | 2824 (+6) | 2839 (+15) |
| score-parser | 709 passed, 5 skipped | same | same | same |
| blurb | 145 | 145 | 145 | 145 |
| integration | 55 | 55 | 55 | 55 |
| ratchets | OK | OK | OK | OK |

The web-test rise, per file: `score/phrase-ends.test.ts` 16, `score/several-lines.test.ts` 6, `text/relining.test.ts` 15. `text/lay-out-seat.test.ts` is the changed test (k): it read `seated > 0` and `0`, and now reads 96 and 96.

Playwright, run after C and after B (the A commit changes no browser behaviour that C's run did not already cover, and was gated on the unit gates alone):

| Project | Brief's baseline | After C | After B |
|---|---|---|---|
| phone | 17 passed, 1 skipped | 18 passed, 1 skipped (+ `phrase-ends`) | 21 passed, 1 skipped (+ the 3 of `relining`; see below) |
| chromium | 72 passed, 2 failed, of 74 | 72 passed, 2 failed, of 74 | 72 passed, 2 failed, of 74 |

**One earlier test changed.** The first phone run after B failed `e2e-phone/input-views.test.ts:134` (row 104's "a poem typed into Poem moves no seat"): it compared the seats whole, `origin` included, and with B Lyrics is re-lined `33,6`, so each seat's origin moves to its new line. The note, the text, the IPA, and the slot are unchanged. I changed the assertion to compare everything except `origin`, with the reason in a comment. The whole phone project was then re-run on the final tree: 21 passed, 1 skipped.

The two chromium failures are the known `e2e/insights-page.test.ts:95` and `e2e/singer-paths.test.ts:169`, in every run.

## 4. Tests, by the brief's letters

Run on the old tree (`5efa88bd`, the source changes stashed): Part C's file had 8 of 16 failing and the 8 that pass are the guards the brief names (d, e, i, cc). Part A's tests need `rekeySeatsToLines` and so fail to run on the old tree, and `lay-out-seat.test.ts` read 0 there. Part B's file imports `relining.ts`, which the old tree lacks. I did not run Part B's tests one by one against an old `sameWords`.

**C** (`score/phrase-ends.test.ts`, 16)

| Letter | Held |
|---|---|
| a | «сад и дом», a rest after «сад»: `hard`, `'score'`, `ˈsɑt`; without the score `soft`, `ˈsɑd` |
| b | «сад\nи дом», no rest: `soft`, `'score'`, `ˈsɑd`; without the score `hard`, `ˈsɑt` |
| c | a breath mark, a caesura, a fermata each end a phrase with no rest; a fermata on the tied last note of a melisma too |
| d, e | guards: punctuation and the last word keep `hard`; an unseated word, and a seat whose `origin.word` differs from the grid, keep today's rule |
| f | «Within Four Walls», one line, arrived: «дума», «сердце», «неподвижный», «ночь» are `hard`, `'score'`; all 39 words read as recorded on `5efa88bd` |
| g | in six lines: all 39 words equal the one-line IPA; «полёт» is `pɑ ˈlʲod` (it was `pɑ ˈlʲot`) |
| h | Tchaikovsky: 172 seated (0 before); «так» is `ˈtɑk`; the other 94 tokens equal the recorded IPA |
| i | guard: without `phraseEnds`, the IPA of every word of both fixtures, one line and lines of seven, equals `phrase-ends.today.json`, recorded on `5efa88bd` |
| cc | the pure re-run test; and in the browser (`relining`, below) five letters typed into Lyrics rebuild Text once, 626 ms after the last key |

The brief's ordinals are 0-based word indices (дума 10, сердце 16, неподвижный 25, полёт 20, ночь 37, такъ 77). There are two «ночь» (35 and 37) and two «так» (22 and 77) in the fixtures, so the tests assert the word at the index.

**j** (`e2e-phone/phrase-ends.test.ts`): Tchaikovsky dropped onto an empty song seats 172 in IndexedDB and Text's «так» has the label `так: ˈtɑk`. See 6, item 1 for what the stored seat holds.

**A** (`score/several-lines.test.ts`, 6, and the changed `lay-out-seat.test.ts`)

- **k.** 96 and 96, the same cyrillic, word, and slot on every note. (The IPA is not compared: with no phrase ends passed, the six lines read «полёт» as `ˈlʲot`, and test g holds that.)
- **l.** The arrival on six lines gives 96 seats, no slot twice, and 96 live, 0 stored. Without the re-key, the same arrival draws part of its seats from stored text (the test asserts only that some do; the brief's 60 is r1's figure and I did not re-run it).
- **m.** Place from here on six lines seats 96, and after the re-key every seat's `origin` names the word standing at its coordinates.
- **n.** The waiting seat seats 96, 96 live, 0 stored; the N.157 replacement seats 96.
- Tchaikovsky in lines of seven: 172 of 172, the same notes as the one-line seat.

**B** (`text/relining.test.ts`, 15)

- **o, p.** `sameWords` folds a syllable hyphen and nothing else; the `from score` tag's comparison holds for the laid-out text and the divided text and clears on a changed capital.
- **q.** Adoption on arrival: `7,7,7,7,7,4`, 96 seats on the same notes as without a Poem.
- **r.** Adoption on a later Poem: re-lined `7,7,7,7,7,4`; the ordinary transcription path (`seatedTextDiff`, `reseatByDiff`) carries all 96 seats onto the same notes with the same text, 96 live, 0 stored.
- **s.** A divided Lyrics is re-lined `7,7,7,7,7,4` with its hyphens kept, 96 seats.
- **t, u, v, z.** The guards: an edited word, the Pushkin quatrain (against either song), unrelated songs (each shares some word with the other, so r1's any-match rule would have re-lined both; neither is), and the singer's own four lines.
- **w.** Row 104's 33-word text as Poem: Lyrics in two lines `33,6`, 96 seats, and the IPA of all 39 words equals the one-line IPA (with the phrase ends of its own seats).
- **x.** Four lines of her own and no Poem: `sameWords` holds and the score's mapping seats 96.
- **aa.** Lyrics that sing the song three times, or twice, against the stand-in: laid out.
- **dd.** The layout is a fixed point on six pairs, and a later Poem re-lines Lyrics Ilya laid out (and, given a different previous Poem as the witness, leaves it alone).

**y, bb, cc** (`e2e-phone/relining.test.ts`, 3), headless Chromium at 390 x 844:

- **y.** After the drop and a stand-in pasted into Poem, Lyrics reads back `7,7,7,7,7,4`, and the seats in IndexedDB keep their keys and their text.
- **bb.** The stand-in typed key by key (4 ms between keys): Text is not rebuilt before the last key, and after the pause Lyrics is `7,7,7,7,7,4` with the seats unchanged.
- **cc.** Five letters typed after a space at the end of Lyrics on a seated song rebuild Text in one burst, 626 ms after the last key.

## 5. The two undos (section 5, item 6)

- **The field's own undo.** In the browser, after the re-lining (six lines), focus in Lyrics and one Control+Z: Lyrics is one line again, with the same words, and the seat count in IndexedDB is unchanged. So the field's undo reaches Ilya's rewrite and takes it back in one step. Poem still holds the poem, and nothing re-lines Lyrics again until Poem next changes.
- **The Loupe's named undo.** NOT ESTABLISHED in a browser: I did not drive a placement and the Loupe's undo through the UI. By simulation in a unit test (`relining.test.ts`, the last test): the step holds `pairings` and `seatedText` and not Lyrics, so restoring the step puts one-line seats under a six-line Lyrics. Drawn at once, 18 seats are live and 78 stored (the figure r1 gave for the arrival map without a re-seat), and «полёт» reads `pɑ ˈlʲot`. The next transcription re-keys them: `seatedText` is then the one-line text, its word diff to the six-line text is not "unchanged" (it carries the line moves), and `reseatByDiff` brings all 96 back to live, 0 stored. No control and no string were built.

## 6. Where it differs from the brief, and what I found

1. **The stored seat IPA goes stale after a phrase-end re-run.** The page draws from the live slots, so Text and Markup follow, but the seat stored in IndexedDB keeps the IPA it was made with: on Tchaikovsky both stored «так» seats still read `ˈtɑɡ` while Text reads `ˈtɑk` (measured in `e2e-phone/phrase-ends.test.ts`). `refreshPairings` is not run on the phrase-end re-run, so a surface that reads the stored seat (an export, if any) would show the old IPA. The brief did not ask for a refresh and the page had 2 lines of room when C landed. Not built; a one-line change if Dann wants it.
2. **The waiting-seat moment defers its re-lining by a microtask** (`queueMicrotask`). The brief puts the call "after `seatWaitingScore` spends it", but that is inside `transcribeText`, and `adoptPoemLines` writes Lyrics through `handleInput`, which transcribes at once; called inline it would re-enter `transcribeText` while the outer run still held its diff. After the outer run ends is the same moment in effect. This path is not covered by a browser test (the dictionary would have to still be loading when the score arrives); NOT ESTABLISHED beyond the reading.
3. **A short partial Poem passes the agreement test.** The rule is "at least half of either text's words match". A Poem that is only the first few words of the song matches all of its own words, so it passes on the Poem's side, and Lyrics re-lines as the singer types a Poem key by key (the text changes at once, the transcription only after the pause, as the brief asks). At full length the result is the same. It is the rule as written; if Dann wants the Poem side to require a floor, that is his.
4. **`rekeySeatsToLines` counts the seats it cannot place but nothing reads the count.** Section 4 item 4 says "left as stored and counted"; it returns `unmatched`, and the page callers drop it.
5. **Part C costs a second engine run when a transcription moves a seat's phrase end,** as the brief states. I did not measure how often that is on a real edit.
6. **`gloss-survival.ts`.** To make room on the page I lifted `keepSurvivingGlosses` and `glossAnchorForm` out, unchanged. Row 106's test n still restates `glossAnchorForm` and could now import it; I left it.

## 7. Open for Dann

The brief's three, with what building them showed.

- **A note that Lyrics now follows the poem's lines, and a way back to one line.** Ilya rewrites Lyrics' line breaks on its own at three moments. The field's undo takes it back in one step (section 5), but nothing says so on the page. A line in the Input view, EN and FR, is his.
- **A Guide sentence on phrase ends.** Part C changes the sound of one word on Tchaikovsky and of «полёт» on a laid-out Lyrics, and nothing tells the singer that a rest ends a phrase for the sound. A Guide line is the desk's draft and his ruling.
- **The agreement floor** (section 6, item 3), and the **stale stored IPA** (section 6, item 1).

## 8. What I could not establish

- **A real published poem against either score.** None is in the tree; the stand-in, row 104's text, and the Pushkin quatrain are test texts.
- **Markup's drawn seat in a browser.** Text's label was read; Markup's draw I read from `drawPairings` and did not drive.
- **The Loupe's named undo in a browser** (section 5).
- **The waiting-seat moment in a browser** (section 6, item 2).
- **Part C on a score with a breath mark, a caesura, or a fermata outside the built score** of test c; neither fixture carries one.
- **Clitic chains across a line end,** which stay per line (pre-existing, the brief's section 10).
- **A silence with no rest event,** which an OMR-read score may produce; excluded by the brief's default, no scan run.
- **Whether the Inspector's transcription log shows a voiced final** such as `pɑ ˈlʲod`; the post-process updates the log for devoicing only.
- **Re-keying on a score with more than one fold,** and **whether `healFrozenSeats` touches a re-lined seat;** not traced.
- **The Lamm scan in this lane,** not run.
- **WebKit and Firefox,** not run.
