# BRIEF — N.119b. The acute does not draw on some words that carry stress

**Written 2026-09-21, 00:48, by the desk. For Claude Code, pointed at `~/Desktop/ilya-rewrite`, branch `Shane`.**
**Tree read for this brief at `b4320d2`, which is `N.119: the stress acutes reach Score markup`, shipped and deployed.**

**Found by Dann on the walk of `b4320d2`, on the deployed branch alias.** This is a defect
in what you just built. Read `docs/memory/CONTRACT.md` in full before you start.

---

## 1. THE TWO CASES, from Dann's own screen

Score: Without Sun no. 1, placed, **Apply stress acutes ON**, at desktop width. The header
reads `1 of 7 changed`, so the toggle is on.

### Case A: «Комнатка», the first word of the lyric

- **Transcription draws it correctly: «Ко́мнатка», IPA `ˈkom nat kʌ`.**
- **Score markup draws «Ком - нат - ка» with no acute**, and **its IPA row DOES carry the
  stress mark on the correct syllable.** Confirmed by Dann on his own screen, 2026-09-21,
  correcting a desk misreading of a low-resolution crop.

### Case B: «непроглядная», where Dann assigned the stress by hand

- **Transcription draws «прогля́дная» correctly**, IPA `ɲɪ prag ˈlʲad na ja`.
- **Score markup draws «неп - рог - ляд - на - я» with no acute**, and its IPA row
  **does** read `ˈlʲad`.

**BOTH CASES ARE THE SAME FAILURE, and this is the whole shape of the defect: the stress
mark is present in the syllable's IPA on the score, and the acute does not draw.**

**So the failure is NOT in locating the stressed syllable.** Do not spend a minute there.
The mark is found; the acute is not applied. Look at what happens after that point: the
suppression conditions, the vowel scan over the syllable's Cyrillic, and whether your
transform runs on that string at all.

---

## 2. WHAT IS WORKING

You measured 31 acutes drawing, and Dann's screenshot confirms many by eye: «те́с-на-я»,
«ти́-ха-я», «ми́-ла-я», «пе́с-ня», «у-ны́-ла-я», «се́рд-це», «де́ж-да», «бы́ст-рый»,
«ве́-ньем», «взо́р», «ви́ж-ный». **The feature works. Some words are being excluded.**

---

## 3. THE INSTRUMENT. Do this before you change a line

**Do not reason from these two words. Dump every syllable and read the pattern.**

For all 97 placed syllables on this score, in order, emit one row with:

1. event id;
2. the pairing's `cyrillic`;
3. the pairing's `ipa`, and whether it contains the engine's stress mark;
4. the pairing's `origin`;
5. **the word your code resolved from that `origin`**, its `cleanWord`, its `stressIndex`,
   its `stressSource`, and its `isProclitic` / `isEnclitic` / `stressSource === 'clitic'`;
6. which of the four suppression conditions fired, if any;
7. whether an acute was actually drawn in the SVG.

**Then group the 66 that drew no acute by which condition fired.** The answer will be in
that grouping, and the memo carries the grouping whatever the cause turns out to be.

---

## 3b. DANN'S RULING AND HIS HYPOTHESIS, 2026-09-21. THE HYPOTHESIS IS HIS, NOT THE DESK'S

**RULED: the acute updates in real time.** His words: *"We want these to update in real
time."* When the singer assigns stress by hand, Score markup follows without a reload, a
re-place, or a toggle flip. **Build to that and measure it.**

**His hypothesis, which fits the evidence better than the desk's below:** *"Is there a
timing mismatch between the process you use to decide which syllable gets an acute, and the
manual imposition of stress by the user?"* Case B is exactly that shape: he assigned the
stress by hand, Transcription followed, and the score's IPA followed, while the acute did
not.

### Two lines in your own function, read by the desk 2026-09-21 at `pairings.ts:826-850`

**Check these two before anything else. Both are silent `continue`s, which is why a miss
produces no error and no mark.**

1. **`:838`** — `if (!word || word.cleanWord !== p.origin.word) continue;`
   **`p.origin` is a snapshot taken when the syllable was placed. `word.cleanWord` is the
   word as it is now.** This compares stored data against live data and bails on any
   disagreement. **Report, for all 97 rows, whether `word.cleanWord === p.origin.word`,
   and how many rows this line rejects.**

2. **`:844`** — `if (at.length !== 1) continue;`
   **Any syllable whose drawn Cyrillic does not hold exactly one vowel is skipped.**
   The drawn text can carry trailing punctuation (N.118, punctuation travels in the slot)
   and can be the singer's own re-syllabification. **Report the vowel count this line
   computes for every rejected row, and the text it computed it from.**

**`lines` is passed live at `:829`, so the plumbing itself is reactive.** If the defect is
a staleness, it is in `origin` being a snapshot, not in the prop.

---

## 4. A DESK HYPOTHESIS, AND IT IS MARKED AS ONE

**DESK INFERENCE. Not established, and free to discard.** Your memo says the clitic and
inferred facts are *"not on the pairing"* and that you *"read them from the transcribed
word through the pairing's `origin`"*.

Both failing words sit where that resolution is most likely to slip:

- **«непроглядная» follows the proclitic «не».** If a host's syllables resolve to the
  clitic word, the clitic condition fires and the acute is correctly suppressed on a wrong
  lookup.
- **«Комнатка» is the first word of the poem**, index 0, where an off-by-one lands outside
  the array.

**Test this by comparing the resolved word's `cleanWord` against the pairing's own
`cyrillic` for all 97 rows.** Any row where the resolved word does not contain that
syllable's Cyrillic is a misresolution, and the count of those rows is the finding.

**If the dump says otherwise, follow the dump. It is the measurement and this is not.**

---

## 5. THE VOWEL SCAN, and check this early

Since the mark is found in both cases, **the vowel scan over the syllable's Cyrillic is a
prime suspect.**

- «Ком» is **capitalized**. `pairings.ts:138-159` documents that `engine.ts:1026` lowercases
  before syllabifying, which is why `cyrOfSyllable` restores the singer's case. So the
  score-side string can carry a capital where the engine's does not.
- `WordStack.svelte:66-68` scans `аеёиоуыэюяАЕЁИОУЫЭЮЯ`, which holds both cases.
  **Confirm your score-side scan uses the same set**, and say so either way.
- «ляд» is lowercase and also fails, so case alone is not sufficient. **Report what the
  scan returns for both syllables.**

---

## 6. WHAT YOU MUST NOT DO

- **Do not loosen a suppression condition to make an acute appear.** A wrong acute teaches
  a learner the wrong stress, which is worse than none. Dann's ruling of 2026-09-21 is in
  `docs/memory/PRODUCT.md` §WHAT THE STRESS ACUTES ARE FOR.
- **Do not change Transcription.** It is correct on both words.
- **Do not commit and do not stage.**

---

## 7. DEFINITION OF DONE

State your expectation before you measure (`CONTRACT.md` §5).

1. The section 3 dump, in the memo, grouped by cause.
2. **«Комнатка» and «непроглядная» both carry their acute on Score markup**, in the same
   place Transcription puts it.
3. **The suppressed list still matches Transcription's**, word for word, with `в` the only
   permitted difference (a vowelless clitic owning no slot).
4. The count of acutes drawn, before and after.
5. All five gates at baseline. Gate 4 is `1352 passed (1352)`. **Add a regression test for
   whichever case you fixed**, move the line, and back up the original.

---

## 8. WHAT YOU COULD NOT ESTABLISH

Fill it. **NOT ESTABLISHED beats a complete invented answer.**

---

## 9. RETURN MEMO

`docs/sessions/memo-n119b-acute-misses_r1_2026-09-21.md`. Short. The dump's grouping, the
cause, what changed by file and line range, and section 8.
