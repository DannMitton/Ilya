# Review: the ‑кий rhyme matcher on Ilya's own stress data (Fable, r1, 2026-11-10)

For the desk and Dann. Reviews the design in `brief-fable-rhyme-matcher_r1_2026-11-09.md` §2. Nothing is built, committed, or pushed. Code was read on `cloud-lane-38` (`e4eeaa96`) in `/home/claude/gates`; line numbers are the tip's. Grayson pp. 301, 302, and 303 were read as rendered pages (`/home/claude/fpt/pages/g317`, `g318`, `g319`). Rulings were read in the Mac's working copy of `OPEN.md` (lines 3547 to 3562). A prototype of the matcher was run on the real pipeline and dictionary, bundled outside the repository; its numbers are in findings 3 and 12. Terms coined here: "rhyme group", "probe" (one engine call under the literary value), "set-aside" (the per-word override). Adopted: "Stage", "Literary" (Grayson); "trigger", "partner" (the desk); "donor" (`underlay-donor.ts`).

## Verdict

**PROCEED WITH CHANGES.** The design is sound, the source supports it, and the tree already holds the two pieces my era review said were missing: the carriage from Lyrics to the notes, and the poem's line breaks on a scanned song. Seven changes:

1. Compare by a probe, not by letters: transcribe the ‑ий word under the literary value and require its tail to equal the partner's tail (finding 3).
2. Treat stressed и and ы as one vowel in the comparison (finding 3).
3. Match rhyme groups, chained, not isolated pairs (finding 6). The pairwise window misses «далёкий» in the run Grayson's own example comes from.
4. The partner is adjectival, by the dictionary's part of speech (finding 1; question 1).
5. Run the matcher inside `processText`. No flag is stored in the library; a pin test over the library does the work of Dann's 20:19 idea (finding 5).
6. The per-word control is a set-aside only, shown when a rhyme reading is in force. No control forces a rhyme (finding 9).
7. Four of the files this touches sit exactly at their ratchet ceilings (finding 11).

It does not fit inside the era lane as a second full build on Tuesday. The core fits as a short lane stacked on the era lane (same files, so never in parallel).

## Findings

### The rule against the source (question 1)

1. **The conditions are Grayson's, with one tightening.** p. 302: "rhymes were made between unstressed, adjectival endings written as -ой and those written as -ий, when following letters for velar consonants ... if the rhyme scheme of the poetry includes such a pairing, then the singer must read the -ий suffix as [ʌj]". So the partner is unstressed, adjectival, and after a velar: all three. The desk's design has unstressed and velar; it omits adjectival. The dictionary carries part of speech («глубокой» `adj`, «улыбкой» `noun`, «Волгой» `name`; read from `data/dictionary.86d83340-*.json` this session), and the pipeline keeps it on each word (`pipeline.ts:731`), so the condition is checkable. Recommended: require `adj`. It also keeps an older-verse rule off modern approximate rhymes («недолгий : Волгой», RIFMA fragment 65).
2. **The stressed syllable.** Grayson does not define rhyme; he says "rhyme scheme" and prints one pair, sharing stressed о and к. The standard definition (identity from the last stressed vowel to the line end, the desk's research §2) is the operational reading, and the design's match rule follows it. This is the desk's inference from the term, not a sentence on p. 302.
3. **Compare the engine's sounds, through a probe.** Run this session on the real engine: «сладкий» [ˈsɫɑt kɨj] and «краткой» share [ɑ t k] though the letters differ (дк, тк); a letter comparison misses it. Rule: transcribe the ‑ий candidate under `'literary'`; it matches when its sounds from the stressed vowel to the end equal the partner's. Unstressed endings, the velar, and [kʌj] then follow from one equality and need no separate tests (a stressed «рекой» can never equal a feminine tail). One fold is needed: stressed [i] and [ɨ] count as the same vowel. Grayson p. 301 calls [ɨ] an "allophone of /i/"; RIFMA's annotators mark «гибкий : зыбкой» as a rhyme twice (fragments 1496, 1548). That Russian verse treats и and ы as an exact rhyme generally is my knowledge, not read in a source this session.
4. **‑кий with ‑кий: both keep the default.** p. 302 to 303: "If, though, there is no such rhyme scheme in place, then the singer could decide between the Stage pronunciation of [ɨj] or the more contemporary". Under a modern era both go modern together. The pairing with ‑ый that p. 302 names cannot arise after a velar in modern spelling; n. 328 (non-velar endings) stays out of scope.
5. **«русский»** keeps its lexical reading. The engine's guard returns false for the family (`engine.ts:518-530`, `:631-634`), so the probe leaves it [ˈruskʲij] and no tail can match (prototype: no match with «узкой»). DESK DEFAULT: leave it so.

### Where the rhyme is found (question 2)

6. **One function, inside `processText`** (`pipeline.ts:230`), after the overrides are applied (`:268-318`) and beside the engine pass (`:329`). It already has everything: lines, `endsStanza` (`:257-260`), each word's stress, `stressSource`, `isHomograph`, and `pos` (`:729-733`). By kind of song:
   - **Typed POEM or LYRICS with line breaks:** found live. Sites `+page.svelte:1805` (Lyrics) and `witness-lines.ts:29` (Poem) both call `processText`.
   - **LYRICS without breaks:** no match; the default stands. Adding the breaks is the correction.
   - **Scanned score alone:** the words are one line (`+page.svelte:404-406`, `vowel-resolver.ts:325-327`), so `+page.svelte:443` and `vowel-resolver.ts:476` never match. Correct by the design's item 4.
   - **Song joined to a library poem:** Lyrics already take the poem's line breaks when it holds the score's words and the texts agree (`relining.ts:38-46`, called at `+page.svelte:2341-2344`). The matcher then runs on Lyrics as on any typed text.
   - **To the notes:** Markup and INSIGHTS receive Lyrics' transcription (`+page.svelte:4370`, `:4393`), and the donor rule makes the singer's transcription win word by word (`vowel-resolver.ts:522-528`, `underlay-donor.ts:67-104`). No new carriage is needed. This corrects my era review, finding 7(c), which said one was.
   - **Live against a library flag.** Live, with a pin test. A stored flag needs a new `PoemEntry` shape and offsets that break when the singer edits the poem; the live function gives the same answer on the same text. Dann's aim (checked ahead of time, by hand) is met by a test that runs the matcher over every library entry and pins the list of matches, empty today (finding 12). A new entry with a rhyme fails the test until someone reads the pair and updates the pin. This revises my era review, finding 8.
   - **Residual disagreement:** where Poem has verse lines and Lyrics does not (the singer broke Lyrics her own way, or fewer than half the words agree), Text's Poem view shows [kʌj] and Lyrics, Markup, and INSIGHTS show [kɨj]. Carrying the reading across by `comparePoem`'s pairs would close it; after the share.

### The window and the stanza (question 3)

7. **Chain the group; keep three lines.** The identity in finding 3 is strict, so two line ends that pass it rhyme by definition; the research's "anchoring" step is not needed. Prototype on the six-line run I believe Glinka sets (дней, глубокой, речей, высокий, людей, далёкий; from memory, see "could not establish"): «высокий» finds «глубокой» two lines away; «далёкий» is four away and is missed. Rule: within a stanza, line-final words whose tails are equal under the probe form a rhyme group, linked while each member is within three lines of another; if the group holds at least one adjectival ‑ой member, every ‑ий member takes the literary reading. Where the text has no blank lines the three-line link alone bounds the group.
   - **Forms covered:** AABB, ABAB, ABBA, Onegin stanza, ottava rima, terza rima, AABCCB.
   - **Forms missed:** a rhyme carried only across a stanza break (AAAB CCCB), partners more than three lines apart with no link between, a trigger followed by an enclitic or a split particle («высокий ли», «высокий-то»).
   - **False matches invited:** none found. Prototype on RIFMA: 5 matches, all 5 certified by the dataset's scheme. Refrains and a repeated stanza match consistently, since each copy finds its own partner.
   - **A known oddity:** only the line-final word changes. The same word repeated earlier in the line («далёкий, далёкий») keeps the stage reading. DESK DEFAULT: accept for the share and say so in the Guide.
8. **Uncertainty.** No match when either word's stress is unknown (`stress < 0` or `stressSource === 'inferred'`, `pipeline.ts:644-667`), or it is a homograph the singer has not resolved (`isHomograph`, `:733`, unless `stressSource` begins `user-`, the test at `:417-418`). All 24 velar ‑ий and ‑ой headwords in `homographs.json` split by stress, «дорогой» among them. Run this session: «далекий» typed without ё has no stress and does not match; toggling ё fixes it. A misread scan word fails the dictionary and falls under the same rule, so the design's separate "unread words" condition is not needed.

### The third value (question 4)

9. **`adjectival: 'stage' | 'modern' | 'literary'`** (`engine.ts:26-29`). Under `'literary'`: the velar stays hard (`:1361` becomes "not modern"), and at `:1525-1527` the vowel is `'ʌ'` with `exception: 'velar-adjectival-rhyme'`. Both are edits to existing lines. «высокий» then reads [vɨˈsokʌj] beside «глубокой» [ɡɫuˈbokʌj] (today [vɨˈsokɨj], run this session). The value is never song-wide: `processText` passes it for matched words only, at the one engine call (`pipeline.ts:805-811`).
   - **All four sites:** three get it through `processText`; the fourth through the donor (finding 6). `clitic-seat.ts:491`, `poem-join-wire.ts:34`, and `underlay-seams.ts:59` run one line with no breaks and count syllables, which the reading does not change.
   - **Notation and Reconstitution:** the ʌ-or-ə preference (`engine.ts:32-34`) renders Grayson's "[ʌj] (or /əj/)" with no new code. Reconstitution turns [ʌ] to [ɑ] by its first rule (`reconstitution.ts:63`), as it does in the partner, so the pair still rhymes.
   - **Tallies:** the note under the ending counts as [ʌ] where it counted as [ɨ] (`vowel-resolver.ts:334-341`); the partner is unchanged.

### Precedence and the Inspector (question 5)

10. **Order confirmed:** the singer's per-word choice, then the rhyme, then the date, then the default. Grayson ranks the rhyme over the singer's stage-or-modern decision (p. 302); the software override sits over it as the correction channel.
    - **The note:** a blurb on ⟨и⟩ of the ending, opened by tapping the atom, as every blurb is. Today that ⟨и⟩ has none: no `velar-adjectival` process exists and the identity is not self-sufficient, so `composeBlurb` returns null (`composer.ts:307-340`). The new process key is `velar-adjectival-rhyme`; the partner word travels in `features.word`, a variable the composer already substitutes (`composer.ts:347-357`).
    - **The set-aside:** one checkbox in the Spot Reconstitution slot (`InspectorPanel.svelte:1011-1022`), drawn only while a rhyme reading is in force on the word. Checked, the word falls to the date, then the default. It is a new map in `WordMarks` beside `spot` (`word-marks.svelte.ts:26`), passed to `processText` as the stress overrides are, carried by `carry`, cleared by the per-word reset (`word-reset.ts`), and saved with the song by whatever the 20:44 lane builds for the other maps. Until that lane lands it is session state like the rest.
    - **No "force the rhyme" control.** It would put a second pronunciation on every ‑кий word (ruling of 2026-11-01 23:16). A missed rhyme is corrected at its cause: a line break, a stress mark, a ё.
    - **With the era's per-word mark:** where the singer has set one on the word, it wins and its checkbox shows; the rhyme checkbox does not.

### What it touches (question 7)

11. **Sites and gates.**
    - **Ratchets:** `engine.ts` (2048), `pipeline.ts` (901), `InspectorPanel.svelte` (2432), and `+page.svelte` (5534) are each exactly at their ceiling in `scripts/ratchets.json`. The matcher goes in a new module beside `ne-join.ts`; every line added to those four is paid for or the ceiling is raised on purpose in the same commit.
    - **Engine tests** pin stage and modern (`notation-edge-cases.test.ts:289-327`, `engine.test.ts:306-312`); they stay green and gain a literary block.
    - **Blurb:** both copies of `blurb-composer.json` (identical today, `cmp` this session); `french-parity.test.ts`; `palatalization-comments.test.ts:216` still holds, since the velar keeps `adjectival-stage-hard`.
    - **Dictionary build:** untouched; neither build script transcribes (grep this session).
    - **LEARN's pinned rows:** single words and single lines; no rhyme can fire. LEARN's prose on the ending (`LearnContent.svelte:1723-1736`) is silent on the rhyme; a sentence there is after the share.
    - **PAPER** prints the lines the page computed (`+page.svelte:4310`).
    - **Stored songs:** nothing derived is stored, so a song saved earlier shows [kʌj] on a matched word the next time it opens, and a fresh print differs from an old one. Intended; worth one line in the release notes.

### Test set (question 6)

12. **Counts.** Shipped library, 14 entries: 2 line-final velar ‑ий words («тонкий», «звонкий», rhyming with each other), 0 true cases. Cleaned arias r2, 89 entries: 1 («широкий»), 0 true cases. RIFMA, 5,121 fragments: 52 line-final velar ‑ий words, 48 with an unstressed ending by its own stress marks; 7 paired by its scheme with an unstressed velar ‑ой, of which 4 are exact by spelling and 3 inexact. The engine-based prototype finds 5 of the 7 (12 of 52 had no usable stress or a stressed ending), none false; 3 have an adjectival partner («гибкий : зыбкой» twice, «Достоевский : Невской»). RIFMA names no sources for its poems, so its texts stay out of the repository; the counts are a bench measure only.
13. **Too few, so a hand-built set.** Fourteen cases were run through the prototype; Code rebuilds them as tests. Constructed two-line texts (mine, not verse) are right for the mechanism:

| case | expected |
|---|---|
| ‑кой then ‑кий, adjacent («глубокой» / «высокий») | literary |
| the six-line run, «далёкий» four lines from «глубокой» | literary on both, through the chain |
| «сладкий» / «краткой» | literary (sounds agree, letters differ) |
| «гибкий» / «зыбкой» | literary (и and ы) |
| «зыбкий» / «улыбкой» (noun) | default, pending question 1 |
| stressed partner («рекой» / «недалёкий») | default |
| non-velar («синий» / «длинной») | default |
| the pair on one line, no break | default |
| a blank line between the pair | default |
| four unrelated lines between | default |
| «далекий» without ё | default; literary after the ё toggle |
| homograph partner («дорогой») unresolved | default; literary once the singer sets the stress |
| «тонкий» / «звонкий» | default on both |
| «русский» / «узкой» | default |
| trigger followed by «ли» | default |

    Plus: the set-aside restores the default; Reconstitution keeps the pair rhyming; Text and Markup agree on one seated fixture; the library pin (empty).

## Build plan (question 8)

**Sizing: its own lane, stacked on the era lane, not inside it.** Both lanes edit `EngineConfig`, the engine call in `pipeline.ts`, `ProcessTextOptions`, the blurb file, the Inspector's checkbox slot, and `WordMarks`. In parallel they collide; in one lane on one day the era steps already fill it (my estimate of 2026-11-10, a judgement). Steps 1 to 4 here are small and can start when the era lane's engine and pipeline steps are in. Estimate, not timed: half a lane-day for steps 1 to 4, a full one with 5 and 6.

| step | work | done state | tests | ratified first |
|---|---|---|---|---|
| 1 | Engine: the `'literary'` value (finding 9), by editing lines in place | «высокий» under literary is [vɨˈsokʌj], velar hard, exception `velar-adjectival-rhyme`; stage and modern unchanged | new literary block; existing blocks green; «русский» unchanged | nothing |
| 2 | `rhyme-reading.ts`, pure: lines of words in, a map of word key to partner out; the probe is injected | no caller yet | the table in finding 13, on the real dictionary | question 1 |
| 3 | Wire it in `processText`: matched words go to the engine under literary; the partner is stamped on the ⟨и⟩ entry | Typing the pair on two lines shows [kʌj] in Text; Markup and INSIGHTS show it on a seated song; one line shows the default | agreement test (Text and Markup); Reconstitution test; library pin; full suite, `tsc`, ratchets | nothing |
| 4 | The note: process `velar-adjectival-rhyme` in both blurb copies | Tapping ⟨и⟩ shows R1 with "(Grayson, p. 302)" and the partner word, EN and FR | blurb test; parity; the line pinned | R1 EN, FR |
| 5 | The set-aside: map in `WordMarks`, option on `processText`, checkbox, reset | Ticking it restores the default in Text and Markup; it follows the word through an edit | toggle, carry, reset | R2 EN, FR |
| 6 | The Guide sentences | seated with Wednesday's Guide | ratified-lines pin | R3 |

**Cut order if the day runs short:** step 6, then 5, then 4 (the reading ships without its note, which I would not ship to colleagues, so cut 3 with it and hold the lane). Steps 1 and 2 are safe to merge alone: no caller, no visible change.

**Strings, drafts, not ratified.**
- **R1, EN:** "⟨{char}⟩ is [{ipa}] here, and the velar before it stays hard, so that the ending rhymes with «{word}». In older Russian verse an unstressed ⟨-ий⟩ after a velar rhymes with an unstressed ⟨-ой⟩, and Grayson gives the rhyme precedence." Citation: p. 302.
- **R1, FR (marked draft):** « ⟨{char}⟩ se prononce ici [{ipa}], et la vélaire qui le précède reste dure, afin que la terminaison rime avec «{word}». Dans la poésie russe plus ancienne, un ⟨-ий⟩ inaccentué après une vélaire rime avec un ⟨-ой⟩ inaccentué, et Grayson donne la priorité à la rime. » Built from the blurb file's own French (« vélaire », « reste », « terminaison », « inaccentué », « se prononce »). Open choices: « rime » and « rimer » are new to the file; « donne la priorité à » against « fait primer »; « plus ancienne » against « ancienne ». No glossary was consulted this session.
- **R2, EN:** "Set the rhyme aside". **FR (marked draft):** « Écarter la rime ». Open: the label's shape beside « Reconstitution ponctuelle » (`i18n.ts:2477-2478`).
- **R3, Guide scaffold, for Dann's voice:** what Ilya does when two line ends rhyme this way (p. 302); what it needs (line breaks, a known stress); what it does not do (guess; change a word inside the line); how to set it aside.

## Questions only Dann can answer

1. **Is the partner adjectival only?** Grayson's sentence says "adjectival". A noun in the instrumental («улыбкой») ends in the same sounds, and his n. 328 leans toward making any such rhyme. Recommended: adjectival only for the share, because every match is then exactly p. 302. Cost: «зыбкий : улыбкой» keeps the default.
2. **The English of R1 and R2**, and R3 in your voice.
3. **French** for R1, R2, and R3.

## What I could not establish

- **The text around Grayson's example.** p. 302 prints the two lines with ellipses and calls them "lines from Pushkin's *Ruslan and Ludmila*". The six-line run in finding 7 is my memory of Glinka's Introduction, not a source read this session (two fetches failed). Whether «высокий» and «глубокой» stand within three lines in the score Dann would use is NOT ESTABLISHED; the test text wants his eye or a vocal score.
- A real nineteenth-century poem with the pairing, for a test from verse. The other helper's memo (`/home/claude/lit/research-kij-shift_r1_2026-11-09.md`) relays «убогий / строгой» from Onegin through a secondary source; I did not locate it. The same memo quotes Ushakov 1935 giving the ending "as if spelled" ‑кой, a second witness for [kʌj]; I did not verify it.
- What the Inspector draws when `composeBlurb` returns null for ⟨и⟩ (the component's branch was not read).
- Whether the INSIGHTS tallies apply Reconstitution before counting.
- How `layOutLikePoem` places a composer's repeated words, and so where a repeated trigger lands.
- Which steps the era lane's brief holds since the 20:40 ruling; the stacking advice assumes it still edits the engine call and the Inspector slot.
- The prototype loaded the two dictionary files and the singer supplement, not `homographs.json`; the homograph rule in finding 8 rests on the code and the data file, not on a run.
- The lane-day estimates are judgements; nothing was timed.

Working files: prototype and counts under `/tmp/claude-0/-home-claude/44613f83-37e8-5e9d-a26a-acdf71654029/scratchpad/scripts/` (`m.mjs`, `count.py`, `proto.py`); RIFMA cloned beside them. Nothing was written under `/home/claude/gates`, `/home/claude/lit`, `aria-r2`, or the Mac's folders.
