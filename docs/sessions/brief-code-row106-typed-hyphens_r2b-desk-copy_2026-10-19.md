# Brief: a typed hyphen inside a word is a syllable break (row 106) (r2, 2026-10-19)

Written by the desk (Opus) 2026-10-19 against `cloud-lane-11` at `949f95e2`; r2 applies the 11 amendments of `review-opus-brief-row106_r1_2026-10-19.md`, reviewed against tip `bd505a0c`. The three commits past `949f95e2` (`eecc991e`, `757dc61c`, `bd505a0c`) change `input-views.svelte.ts` (+7), one line of `+page.svelte` in place (still 5643), `GuideContent.svelte` (+8), and tests; none touches the code this row changes. **Reviewed by Opus** (`review-opus-brief-row106_r1_2026-10-19.md`); the desk decides whether Fable's review is still owed under `QUEUE.md`. Lane: the cloud session on `cloud-lane-11`. **Row 108 is held by the desk and does not run in this session.**

Every count in this brief that names the dictionary was measured by the desk this session with a throwaway Vitest run outside the tree, loading `apps/web/static/data/dictionary.86d83340-a.json` and `-b.json` and `data/singer-supplement.json` the way `apps/web/src/lib/old-spelling.test.ts:28-40` loads them. Every "today" behaviour marked MEASURED was run through `processText` on `949f95e2`. Re-measure any number you rely on.

## 1. The singer's side

A singer types or pastes the sung words into Lyrics divided the way the score divides them: «ве-ли-кий», «про-гляд-на-я», «бы-ли». Today each of those words loses its stress, its gloss, or its identity. With this row:

- The word is still the dictionary's word: «ве-ли-кий» has великий's stress and gloss.
- Its syllables, and so the notes they sit on, follow the hyphens she typed. Where she typed none, Ilya's rule divides as it does today.
- A word whose spelling carries a hyphen (кто-то, по-русски, какой-нибудь) still reads as that word, typed either way.
- Nothing she typed is coloured as a difference from the poem (ruling default 5, already true).

The ruling: `docs/memory/OPEN.md`, "N.135 STAGE 3", default 12, a desk default Dann has not struck: *syllable hyphens shown and typeable in Lyrics, Ilya's rule supplying a break where none is typed, a typed hyphen winning.* Found by Fable's review of row 104, amendment 1 (`docs/sessions/review-fable-brief-input-two-views_r1_2026-10-16.md:9`, `:48-52`).

## 2. What the code does today (each read or run this session)

| Behaviour | Where | Evidence |
|---|---|---|
| The dictionary probe strips guillemets and a trailing dash only | `apps/web/src/lib/pipeline.ts:581-582` (`bareWord`), looked up at `:588` | read |
| `lookupStress` strips `.,!?;:"''–—`, not `-` | `packages/phonology/src/engine.ts:701` | read |
| The engine's letters have every dash stripped, so syllables come from the joined letters and ignore typed breaks | `pipeline.ts:678` (`cleanWord`, `DASH_REGEX` at `:51`); `engine.ts:1519`, `:1549` | read |
| A token ending in a particle after a hyphen is split in two (ли, ль, бы, б, же, ж) | `pipeline.ts:62-100` (`expandHyphenatedParticles`), called at `:222` | read |
| N.12's modernisation and row 25's old endings see the hyphenated token | `pipeline.ts:565-570` | read |
| The poetic-forms retry strips `–—`, not `-` | `pipeline.ts:615` | read |
| The ё-alternation probes strip a trailing dash only | `pipeline.ts:701`, `:717` | read |
| The Dictionary panel's full entry is looked up by `cleanWord` | `pipeline.ts:403`; `packages/dictionary/src/gloss.ts:53-59` | read |
| A ё toggle's character index skips `-` | `pipeline.ts:327` | read |
| The slot queue reads `w.syllables`; a slot's text slices `cleanWord`; `origin.word` is `cleanWord` | `apps/web/src/lib/score/pairings.ts:203-255`, `:154-162`, `:245` | read |
| The score's underlay resolver reads `w.result.syllables`, the engine's own array | `apps/web/src/lib/score/vowel-resolver.ts:484`; the pipeline hands the same array to both fields at `pipeline.ts:878` and `:484` | read |
| The global open-syllables switch re-cuts every word of two or more syllables; a per-word override outranks it | `apps/web/src/lib/syllable-utils.ts:252-278`, `:48-82`; Markup's drawing reads the same rule, `pairings.ts:979-997` | read |
| A re-divided word keeps its seat and brings the new text forward | `pairings.ts:449-484` (`refreshPairings`), keyed on `origin.word` (`:77-98`) | read |
| The word diff that carries marks and seats reads `cleanWord` | `pipeline.ts:250-255` (`wordGrid`); `apps/web/src/lib/text-diff.ts:161-223` | read |
| Lyrics' colour folds an inner `-`, `‐`, `‑` | `apps/web/src/lib/text/poem-compare.ts:85-89`; pinned at `poem-compare.test.ts:90-93` | read |
| `sameWords` does not fold hyphens | `apps/web/src/lib/text/same-words.ts:14-23` | read (row 108's concern) |
| Text's acute counts vowels in `word.cyrillic`; a hyphen is not a vowel | `apps/web/src/lib/components/Paper/WordStack.svelte:56-80` | read |
| Text prints `word.cyrillic`, which is `displayWord` and keeps every typed hyphen | `pipeline.ts:729`; `WordStack.svelte:152`, `:192` | read; MEASURED: «ве-ли-кий» prints «ве-ли-кий» |
| The ё toggle rebuilds the word from `cyrillic` | `pipeline.ts:322`, `:340` | read |
| `openSyllabify` has four callers: Text and Markup through `reslicedSyllables`, the score's underlay, and the Inspector twice | `syllable-utils.ts:274`; `vowel-resolver.ts:484`; `InspectorPanel.svelte:116`, `:135` | grep |
| `cleanWord` strips `-–—` only; `‐` (U+2010) and `‑` (U+2011) stay in it | `pipeline.ts:49`, `:51` | read; MEASURED: «ве‐ли‐кий» has `cleanWord` «ве‐ли‐кий», syllables «ве‐.ли‐.кий», stress unknown |
| A stored gloss survives while `glossAnchorForm(word.cleanWord)` matches its anchor | `+page.svelte:2333-2343` | read |

MEASURED today, `processText` on `949f95e2`:

| Typed | What Ilya gives today |
|---|---|
| «ве-ли-кий» | one word, stress unknown (`inferred`), no gloss, IPA `vʲe lʲi kɨj` (every vowel cardinal) |
| «до-ро-га,» | stress unknown, no gloss |
| «о-ди-но-ка-я» | stress unknown, no gloss |
| «по-русски», «кто-то» | found: stress 1 and 0, glosses "in Russian", "somebody, someone" |
| «по-рус-ски», «ка-кой-ни-будь» | stress unknown, no gloss |
| «бы-ли», «зна-ли», «у-же», «что-б» | **two words each**: «бы-» + «ли», «зна-» + «ли» (зна unknown), «у-» + «же», «что-» + «б» |
| «велит-ли» | two words, «велит-» + «ли» (correct: a particle) |
| «дѣ-ти» | not modernised (`preReformSource` null), one syllable, stress unknown |
| «шум-на-го» | the old ending not adopted, stress unknown |
| «все-таки» | всё-таки, restored, stress 0 (works) |
| «кто-то» | Dictionary panel's full entry empty (`fullGlossEn` ''), because `:403` looks up «ктото» |
| «ве-ликий» | divides ве\|ли\|кий (already), stress unknown, no gloss |
| «серд-ц-е» | сердце, two syllables серд\|це, stress unknown |
| «тя-же-лый» | stress unknown; «тяжелый» whole restores тяжёлый, stress 1 |
| «веселый» | stress unknown even typed whole: not a ё-restoring word |
| «гля-дѣ-ли» | **two words**, «гля-дѣ-» + «ли» |

On «Within Four Walls» (`apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml`), the 39 words typed in the file's own division (each word's cells joined by `-`): **25 of 39 words read as unknown** against 0 for the one-line fill; 25 of 39 words' IPA differs from the one-line fill's; the seat still places **96** (alignment strips non-letters, `vowel-resolver.ts:159-167`), and Lyrics' colour against the one-line text as a poem counts **0** differing words. Ilya's division and the file's differ on two words only: «прог-ляд-на-я» against the file's «про-гляд-на-я», and «счас-тье» against «сча-стье».

On `tchaikovsky-op38-3-voice.musicxml` (old spelling), the 90 words typed in the file's own division: **50 tokens unknown** against 0 for the one-line fill, 97 tokens against 95, and 161 slots against 172, because «гля-дѣ-ли» and «сви-рѣ-ли» each split as a particle today.

## 3. The dictionary's hyphenated words, measured

The dictionary holds 943,106 entries; the singer supplement 316, none hyphenated.

- **5,380 keys** are Cyrillic letters with one or more inner hyphens; 5,310 of them have a vowel in every part. 5,192 have two parts, 187 three, 1 five.
- Most common last parts: «то» 80, «нибудь» 41, «либо» 40. Most common first parts: «гей» 118, «тёмно» 95, «англо» 85, «вице» 82, «по» 66, «кое» 39.
- Entries read: кто-то s0 "somebody, someone"; по-русски s1 "in Russian"; какой-нибудь s1 "some, any"; кое-что s0; что-то s0; где-то s0; как-то s0; по-прежнему s1; во-первых s1; из-за s0; давным-давно s1; чуть-чуть s1; еле-еле s0; всё-таки s0; то-то s0; нет-нет s0. Their joined forms (ктото, порусски, какойнибудь) are absent.
- **98 hyphenated keys also exist joined** (e.g. афро-американец and афроамериканец, сербско-хорватский and сербскохорватский, пол-литра and поллитра, а-ля and аля, о-пер and опер). **46 of the 98 disagree on stress**: афро-американец s0 (gloss "archaic spelling…") against афроамериканец s5; сербско-хорватский s0 against s3; а-ля s1 (preposition) against аля s0 (the name).
- **3,951 of the 5,310** have every lexical hyphen on a boundary of Ilya's own division of the joined word (кто|то); **1,359** do not (жук-олень divides жу|ко|лень; сан-франциско санф|ран|цис|ко).
- **Particle collisions:** a known word that is a known host plus a particle, about: ли 3,200 (были, знали, дали, кремли), ль 240, же 100 (уже, тоже, также, даже, ниже), бы 75 (чтобы, дабы, борьбы), б 75 (чтоб, груб), ж 65 (уж, муж, нож). Rounded: the desk's run and the review's run differ by up to six, by the test for a host; neither number is load-bearing. **10,375 known words end in an Ilya syllable ли, бы, or же**, so every one of them, typed in Ilya's own syllables, is split in two today. Known joined forms of the real particle cases: велитли, местаб, такли are absent; также, тоже, уже, чтоб are present.

## 4. Which wins: the hyphenated form or the joined form

**Recommendation (DESK DEFAULT): try the token as typed, then joined, then the forms that keep some hyphens, fewest kept first; the first that the dictionary (or the supplement) holds wins.** Apply N.12's modernisation and row 25's old endings to each candidate as `pipeline.ts:565-570` does to the one word today.

Why that order. Ruling default 12 makes a typed hyphen a syllable break; the joined form is the reading in which every typed hyphen is one, so it is the default. A form keeping a hyphen reads that hyphen as part of the spelling, the exception, so it is tried only when the default finds no word. The token exactly as typed comes first because a singer who types the dictionary's own spelling (кто-то) has given the strongest evidence there is, and because the lexical words that work today must not regress.

Measured on the dictionary, each hyphenated headword typed in full syllables (every part divided by Ilya's rule):

| Rule | Hyphenated headwords, 5,310 | Plain headwords, 903,950, typed in Ilya's syllables |
|---|---|---|
| As typed, then joined, then partial fewest hyphens first (recommended) | 5,228 to the headword; 81 to its joined twin; 1 to another (мало-по-малу to мало-помалу); 0 unfound | 903,941 to themselves; 9 to a hyphenated headword (ба-бах, о-пер, и-го-го, а-ля, кун-фу, ха-ха-ха, вай-фай, нюй-шу, эс-цет) |
| As typed, then partial most hyphens first, joined last | 5,309; 0; 1 | 76 to a hyphenated twin (сербскохорватский to сербско-хорватский, аму-дарья, афро-американец) |

The cost of the recommendation, stated: the 81 compounds the dictionary lists both ways read as the joined spelling when typed in syllables, and 46 of those take the joined entry's stress; 9 ordinary words typed in Ilya's syllables read as a hyphenated headword («ба-бах» as the interjection, not the genitive plural of баба; «а-ля» as the preposition, not the name). None is a word an art song is known to set; NOT ESTABLISHED on a corpus.

**The particle split follows the same evidence (DESK DEFAULT):** `expandHyphenatedParticles` splits a trailing particle only when the whole token resolves to no word by the rule in this section. So «бы-ли», «зна-ли», «у-же» are one word each; «велит-ли» and «места-б,» split as today. The cost: a pre-reform print's «так-же» or «то-же», meaning так же or то же, reads as также or тоже (98 же collisions in all). How often a hyphenated particle that is also a word reaches Lyrics is NOT ESTABLISHED; neither fixture in the tree carries a hyphen inside a word (measured: 0 of 39 words in «Within Four Walls», 0 of 90 in `tchaikovsky-op38-3-voice.musicxml`).

**The old spelling meets the particle test.** Typed in its own division, the Tchaikovsky fixture holds two real collisions, «гля-дѣ-ли» and «сви-рѣ-ли»: a word ending in a syllable ли, in the old spelling. The whole-token test keeps them one word only if each candidate is modernised first (глядѣли → глядели), as the first paragraph of this section says. Code applies N.12 and row 25 to each candidate **before** the particle test, not after it.

## 5. What to build

1. **One new module beside the pipeline, `apps/web/src/lib/typed-hyphens.ts`** (the `ne-join.ts` pattern: the dictionary reached through a `lookup` the pipeline passes in, `ne-join.ts:17-19`, `:39-45`). It owns: which characters are a syllable hyphen (`-`, `‐`, `‑`, the set `poem-compare.ts:86` already folds; `–` and `—` inside a token keep today's behaviour); the resolution of section 4; the particle test of section 4; and the typed breaks, as character offsets into the resolved word's letters. **`‐` and `‑` are not stripped from `cleanWord` today** (`pipeline.ts:49`, `:51` hold `-–—` only; section 2). This row strips them, so `wordGrid` and `origin.word` change for a stored Lyrics holding either: a pairing whose `origin.word` carries the character no longer matches its slot and is left as stored (`pairings.ts:462-465`). Name the cost in the report.
2. **`pipeline.ts` calls it and does not grow.** It is 1064 of 1065. Move `expandHyphenatedParticles` and `HYPHENATED_PARTICLES` (`:62-100`, 39 lines) into the new module to pay for the calls; the other call sites (`:222`, `:565-582`, `:403`, `:678`) change in place. `pipeline.ts` ends at or under 1065; lower the ceiling in `scripts/ratchets.json` if it falls (the script prints the number).
3. **Resolve first, then everything else reads the resolved word.** `buildPreTranscribeWord` (`pipeline.ts:521`) takes the resolved spelling (syllable hyphens out, lexical hyphens kept), so N.12, row 25, ё restoration, `normalizePoetic`, and the ё-alternation probes all see a word they can find. `cleanWord` stays letters only (`:678`), so `wordGrid`, `origin.word`, and `cleanForAlignment` are unchanged: typing hyphens into a word changes no word in the diff, and every mark and seat stays where it is. The same holds for a stored gloss, which survives while `glossAnchorForm(word.cleanWord)` matches its anchor (`+page.svelte:2333-2343`): never put a lexical hyphen into `cleanWord`, or кто-то's stored gloss (anchor «ктото») is dropped. **`cyrillic` itself stays the typed token (item 8), and the resolved spelling rides beside it on `PreTranscribeWord`:** the ё toggle rebuilds the word from `cyrillic` (`pipeline.ts:322`, `:340`), so it keeps the typed division, and the resolved spelling is never written back into `cyrillic`.
4. **The typed breaks win, Ilya fills the rest.** Divide each part between typed breaks by Ilya's rule and keep every typed break. A part with no vowel (a hyphen that would leave «ц» alone in «серд-ц-е») is not a syllable: it joins the part before it, so «серд-ц-е» divides сердц|е (DESK DEFAULT; the rule the score's own words follow, `vowel-resolver.ts:262-272`, so a typed and an engraved division agree). A vowelless first part joins the part after it, as `leading` does there. Name each dropped break in the report. Where N.12 or row 25 changed the letters, carry the breaks across with `modernSyllables` (`vowel-resolver.ts:196-210`, letter for letter, null when the letters do not line up); on null, Ilya's rule divides the whole word (DESK DEFAULT).
5. **Apply the breaks to the engine's own syllables, not as a display override.** Re-cut right after `GraysonEngine.transcribe` (`pipeline.ts:855-861`) and before cross-word assimilation (`:891`), so the post-process at `:895-921` works on the typed division; renumber each `transcriptionLog` entry's `syllableIndex` to match (read by `vowelOfSyllable`, `vowel-resolver.ts:353-360`, and the Inspector, `InspectorPanel.svelte:196`). The syllable count does not change (one vowel per syllable either way), so the stress index and the vowels stand. `syllables` and `result.syllables` are one array today (`pipeline.ts:878`); keep them one, in place or by assigning both, or the score's underlay resolver reads Ilya's division while Text reads the typed one. `applySyllableOverride` (`syllable-utils.ts:121-171`) already re-slices Cyrillic and IPA from per-letter IPA; reuse it. `engine.ts` is 2291 of 2291 and is not touched.
6. **The global open-syllables switch leaves a typed break alone, at all four of its callers.** `openSyllabify` (`syllable-utils.ts:48-82`) is called by `reslicedSyllables` (`:274`, which serves Text and Markup's `drawPairings`), by the score's underlay resolver on the engine's array (`vowel-resolver.ts:484`), and twice by the Inspector (`InspectorPanel.svelte:116`, the header IPA; `:135`, the Ribbon). With the switch on (the default), each would open a typed «прог-ляд» to «про-гляд». Carry the typed breaks on `WordStackData` (`apps/web/src/lib/types.ts:45`); add one helper in `syllable-utils.ts` (366 lines, no ceiling) that opens only boundaries Ilya supplied; and have all four call sites use it. `InspectorPanel.svelte` is 2432 of 2432: change its two lines in place, line for line, or raise the ceiling on purpose in `scripts/ratchets.json` in the same commit and say why in the message. The Inspector's moved boundary still outranks both, as it outranks the switch today (DESK DEFAULT).
7. **The Dictionary panel reads the resolved word.** `pipeline.ts:403` looks up the resolved spelling instead of `cleanWord`, so кто-то's panel fills (empty today, section 2).
8. **What Text prints: unchanged (DESK DEFAULT, r2b, 2026-10-19; taste, Dann's to overrule).** Today Text prints what was typed: `cyrillic` is `displayWord` (`pipeline.ts:729`), which keeps every inner hyphen, and `WordStack.svelte` prints it (`:192`; the aria-label at `:152`); measured, «ве-ли-кий» prints «ве-ли-кий». Keep that: `cyrillic` stays the typed form, and the resolved spelling travels beside it on `PreTranscribeWord` as a new field for lookup, syllabification, and the ё probes only. Print is `window.print()` on the same Paper (`+page.svelte:2212`), so it follows Text unchanged. Lyrics keeps exactly what was typed, and the binder export carries Lyrics' text, hyphens included. Ilya writes no hyphen into Lyrics' text. (r2 had Text print великий; the desk reversed that because the do-nothing option holds and the r1 premise, "as today", was false.)

## 6. Tests, by letter

Load the real dictionary as `old-spelling.test.ts:28-40` does. Fixtures: the words named; «Within Four Walls» (`sunless-01-engraved.musicxml`, 194 `<lyric>` elements, 97 cells read by `collectScoreWords`, 96 slots); Tchaikovsky op. 38 no. 3 (`tchaikovsky-op38-3-voice.musicxml`, 90 words, 172 cells, 172 slots). Each test below fails on `bd505a0c` (measured where marked in section 2) and passes on a correct build.

- a. «ве-ли-кий», «до-ро-га,», «о-ди-но-ка-я»: the stress and gloss of великий, дорога, одинокая; syllables ве|ли|кий; `cleanWord` великий.
- b. A typed break wins: «прог-ляд-на-я» and «про-гляд-на-я» each divide as typed, with the same stress and the same IPA letters (spaces aside).
- c. Ilya fills the rest: «ве-ликий» divides ве|ли|кий **with великий's stress 1 and gloss** (the division alone holds today).
- d. A part without a vowel: «серд-ц-е» is сердце, divided сердц|е, stress 0 from the dictionary. The dropped break is named in Code's report, not asserted.
- d′. The other two syllable hyphens: «ве‐ли‐кий» (U+2010) and «ве‑ли‑кий» (U+2011) read exactly as «ве-ли-кий» does, `cleanWord` великий.
- e. Lexical hyphens: «кто-то», «по-русски», «какой-нибудь» as today; «по-рус-ски» and «ка-кой-ни-будь» resolve to по-русски and какой-нибудь with their stress and gloss; кто-то's Dictionary panel entry is filled.
- f. Particles: «бы-ли», «зна-ли», «у-же» are one word; «велит-ли» and «места-б,» split as today; «так-же» reads as также (the cost, pinned so a change is seen).
- f′. The old spelling and the particle: «гля-дѣ-ли» is one word, глядели, with глядели's stress (two words today).
- g. Old spelling: «дѣ-ти» is modernised to дети with its stress and two syllables; «шум-на-го» takes row 25's шумного.
- h. ё: «тя-же-лый» restores тяжёлый, stress 1, `yo-restored` (unknown today; «веселый» is not a restoring word, measured). A ё toggle on a hyphenated word lands on the same letter as on the joined word (`pipeline.ts:327`; holds today), **and after the toggle the word still divides as typed** (the clause that catches item 3's rebuild).
- i. The diff: `wordGrid` of the fixture's one-line text and of the same text in the file's division are equal; on the fixture, 96 seats before and after typing the division into Lyrics, each on the same note, and the two re-divided words' seats carry the typed syllable (про, гляд; сча, стье) through `refreshPairings`.
- j. The open-syllables switch on: «прог-ляд-на-я» stays прог|ляд|на|я on Text, in `drawPairings`, and in `buildUnderlayResolvers`' output for the score; an Ilya boundary inside an untyped part still opens. The Inspector's two call sites are checked by an existing Inspector test if one reaches them, otherwise by hand, and the report says which.
- k. Each fixture whole, in the file's division: «Within Four Walls», 0 unknown words (25 today), the one-line text's stress on all 39, and 96 seats; Tchaikovsky, 0 unknown tokens (50 today), 95 tokens, and 172 slots (161 today).
- l. Lyrics' colour: the fixture in the file's division against the one-line text as a poem, 0 differing (holds today; pin it beside `poem-compare.test.ts:90`).
- m. Text prints «ве-ли-кий» for «ве-ли-кий» (as today) and «кто-то» for «кто-то», while the stress and gloss are великий's and кто-то's (section 5, item 8).
- n. Glosses: a gloss anchored on «великий» survives `keepSurvivingGlosses`' rule (`+page.svelte:2333-2343`) when the word is retyped «ве-ли-кий»; one anchored on «ктото» survives retyping «кто-то» as «кто-то». Test the rule through `glossAnchorForm` of `cleanWord`; the page itself is not loaded.

## 7. Gates, ceilings, commit

The eight gates, baselines from `report-code-rows109-110-followup_r1_2026-10-18.md`, section 5 (the "After" column, the tip `bd505a0c`). Run them on the branch head first and say if any differs.

| Gate | Baseline |
|---|---|
| phonology | 267 |
| dictionary | 248 |
| web-check | 0 errors, 12 warnings in 5 files |
| web-test | 2764 |
| score-parser | 709 passed, 5 skipped |
| blurb | 145 |
| integration | 55 |
| ratchets | OK (`+page.svelte` 5643) |

A web-test rise is the new tests, counted per file. Ceilings: `+page.svelte` 5652 (this row needs no change there), `pipeline.ts` 1065, `engine.ts` 2291 (untouched), `InspectorPanel.svelte` 2432 (section 5, item 6). Playwright `--project=phone` (baseline 17 passed, 1 skipped) and `--project=chromium` (71 passed, 2 failed, of 73) as the follow-up report ran them; the two known failures (`e2e/insights-page.test.ts:95`, `e2e/singer-paths.test.ts:169`) are not this row's. Commit "Row 106: a typed hyphen inside a word is a syllable break", push `cloud-lane-11`.

## 8. Lane rules

Commit and push only `cloud-lane-11`; never `Shane` or `main`; no pull request; never edit anything under `docs/memory/`. No new user-facing string: none is needed for this row, and if you find one is (a line telling the singer what a hyphen does, a Guide sentence), write it as an open item for Dann in the report, not in `i18n.ts`. One report, `docs/sessions/report-code-row106_r1_2026-10-19.md`.

## 9. Open for Dann (the desk's defaults stand until he rules)

- Taste: Text prints what Lyrics holds, hyphens included, as today (section 5, item 8, DESK DEFAULT r2b). The alternative is Text printing the resolved spelling, великий for «ве-ли-кий».
- Taste: "shown" in default 12 read as "Lyrics shows the hyphens it holds"; Ilya writes no hyphen into Lyrics. The alternative has Ilya write its own division into Lyrics, which rewrites the singer's text and turns off the four score comparisons (`+page.svelte:406`, `:653`, `:2008`, `:2033`).
- Not built here, for the desk to bring to Dann: a score's words fill Lyrics with each word's cells joined and no hyphen (`vowel-resolver.ts:255`, `:344-346`). After this row the fill could write the score's own division as typed hyphens, which "THE TEXT UNDER THE NOTES: A MIXED DEFAULT" (`OPEN.md:2754-2766`, word breaks "the score's") points toward, and which would let a lexical word the engraver split («кто» «то») resolve as кто-то instead of the unknown «ктото». It changes the fill text, so `scoreText` and the four comparisons change with it; row 108's `sameWords` decision bears on it.

## 10. What the brief could not establish

NOT ESTABLISHED beats a complete invented answer.

- Whether the engine's per-letter IPA is independent of where the syllables are cut, which item 5 assumes (as `applySyllableOverride` does today). Test b is the check.
- How often a hyphenated particle that is also a word (так-же) reaches Lyrics. No corpus in the tree carries one.
- Whether a pre-reform word with a syllable hyphen and a dropped hard sign mid-word maps through `modernSyllables`; not run.
- The 9 plain words and 81 compounds of section 4 in any real song text: not searched.
- How a MusicXML file engraves a lexical hyphen in its cells («кто-» and «то», or «кто» and «то»); neither fixture has one.
- Whether any stored song holds U+2010 or U+2011 in Lyrics (section 5, item 1's cost).
- The Inspector's moved-boundary editor (`InspectorPanel.svelte:781-818`) on a word with typed breaks: not read.
- The four score comparisons (`+page.svelte:406`, `:653`, `:2008`, `:2033`) under a Lyrics holding hyphens: read as lines only, not traced.
- WebKit and Firefox: nothing here is browser-specific, but nothing was run there.
