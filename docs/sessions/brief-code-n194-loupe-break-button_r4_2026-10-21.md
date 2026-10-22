# Brief for Code: N.194, the Loupe's break button (QUEUE row 152), r4, 2026-10-21

DRAFT r4, NOT YET FABLE-REVIEWED. **r4 replaces r3 (md5 `bb5494c0e86bba69845d672ee84c11e1`), changed on one finding the desk read on 2026-10-21 about 13:5x: the Lyrics field has no undo of its own to "restore the text". It is a plain `<textarea value={text}>` whose handlers are `onInput` and `onKeydown` (`apps/web/src/lib/components/Drawer/IntakeViews.svelte:225-236`, `:189`), and `onKeydown` handles only Control or Command plus Enter (`:197-202`). A Control+Z in it is the browser's own. The only named undo in the app is `UndoHistory` (`apps/web/src/routes/+page.svelte:847-863`), whose state is corrections, pairings, the selection, the gap, and `seatedText`, and does not include `doc.inputText` (`apps/web/src/lib/score/undo-history.svelte.ts:44-70`). r3's step 3 and its Control+Z instruction rested on a path that is not in the tree. r4 sends the press through the Loupe's own named Undo (section 'The undo' below).** Not to be sent to Code until Fable has reviewed it (`CONTRACT.md` section 1, item 19; Fable's weekly limit resets Sunday 2026-10-25 05:00) and Dann says send. r3 replaces r2 (`brief-code-n194-phase1-text-word-card_r2_2026-10-21.md`, md5 `327676c0a1b7618e7c67a4cdef54d265`) after Dann dropped the card (INBOX 2026-10-21 01:28) and re-ruled the design (01:35 to 02:12). r2's steps 0 to 2 (a per-song break map and an engine pass that reads it) and its step 3 (the card) are NOT carried: the break is a `#` in the Lyrics text, which batch C's B3 already makes the engine read.

For Code in a cloud session, Sonnet, on a new lane cut from `Shane` by Dann, AFTER batch C (`brief-code-batch-c_r2_2026-10-21.md`, md5 `9e4c554e9c203e8ba2e18efa183296ff`) has shipped. **"NOT ESTABLISHED beats a complete invented answer."** Every claim about the code carries a `path:line` the desk read on 2026-10-21, or says NOT ESTABLISHED or NOT READ. Do not write with git beyond one commit per step on the lane; no pull request; no branch other than the lane.

Files this brief ships beside it (Code reads them from `docs/sessions/` on `Shane`): `code-n194-syntactic-break-unit_r1_2026-10-21.ts` (md5 `e7254d46ec5eb32c5998b90408d01011`) and `code-n194-syntactic-break-unit.test_r1_2026-10-21.ts` (md5 `9f7724fb30530ca693e59f0e37e0a69b`), the desk's draft of the unit logic with 22 tests, written outside the tree and not yet run in it.

## 0. Rules for the whole brief

- **Prerequisite.** Batch C's B3 must be on the lane: a typed `#` takes no note, ends the word before it, sets a hard boundary, and is grafted after its parent syllable in the IPA. If it is not, stop and report; do not build a second mechanism. Do not wire the `#` to `phonationBreak` or to the `[#]` junction mark (Dann 2026-10-21 00:26: *"We should only see octothorpes in the IPa line, not in the staff or the Cyrillic text."*, transcribed as written; B3 "Markup already has a `[#]` path").
- Work the steps in order, one commit each, and report after each. At the start, read the ship script's gate lines and report the eight baselines.
- The ratchet table is `scripts/ratchets.json`. `+page.svelte` stood at 5606 against a ceiling of 5607 on 2026-10-21 (Fable's reading for batch C; NOT ESTABLISHED after batch C). New logic goes in new modules; `+page.svelte` receives wiring lines only. Do not raise a ceiling.
- No IPA is written by hand. Every expected IPA is an output of Ilya's engine compared with another output of the same engine.
- **No string a singer reads is invented.** Ratified, EN: "Break after this word" and "Remove break"; FR: « Frontière après ce mot » and « Retirer la frontière » (Dann 2026-10-21 00:32). **RULED by Dann 2026-10-21 13:42** (*"Yes, I like your user-facing wording best.: “Break after this word” and “Remove break”, FR « Frontière après ce mot » and « Retirer la frontière »)"*, transcribed as written): the pill's labels are the ratified pair above, not his 01:38 "Insert a syntactic break here". Not owed. Add no other string.
- Return memo format in section 6. Every step's report has a section "What I could not establish".

## 1. The need, in Dann's words (2026-10-21, transcribed as written)

- 01:28: *"we don't really need the card. Clicking the clef can invoke the right section of Corrections to alter the clef. That way we cna be consistent and stop trying to electrifyb the entire WYSIWYG."*
- 01:35: *"A tap on a syllable can absolutely achieve inserting a break. IOf the syllable is not the terminal syllable, clickinr "Insert break here" will jumo to the termianbl syllable of the word. This will contol for hyphenated and polysyllabic words, and enclitics. The idea is athat a syntactic break only happens at then end of a complete unit, and before an adjacent unit begins."*
- 01:38: *"If "Insert a syntactic break here" were one of the buttons along the bottom of the Loupe. applying it here would jump the squircle to the last syllable (-я) and insert a visible, printing octothorpe after that syllable's IPA value just like an enclitic. The octothorpe wont' be visible in Poem view but it will be visible inline in TExt and Lyrics views."* (his screenshot: song 1, m. 4, the Syllables tab, «тень неп-рог-ляд-на-я,», the squircle on «ляд»)
- 01:43 and 01:55 (said twice, STANDING): *"an implied break looks like nothing on the IPA line. It's not notated."*; *"The only way an octothorpe appears in a transcription is if it is placed manually by the user. Punctuation doesn't need an actothorpe, it's implied."* Confirmed 01:56 for a break the engine takes from a rest in the score.
- 01:40: *"The meta unit is the word."* The unit is the word with what leans on it; the answer the button needs is a syllable.

## 2. Ruled design

- One button in the Loupe's Syllables tab, in the pill row under the syllables beside Clear placements and Place from here.
- Pressed on a selected note whose syllable is not the last of its unit, it resolves to the unit's last syllable, writes a `#` into the Lyrics text after that unit, and the Loupe's selection (the squircle) jumps to the note carrying that syllable.
- A unit is a word with its proclitics (forward), its enclitics (back), and a particle the poem joined by a hyphen («велит-ли»). A polysyllabic word is one word.
- The `#` is visible inline in Lyrics and on the IPA line of Text and Markup, never in Poem, never in the Cyrillic, never on a staff. It exists only where the singer placed it.
- A break implied by punctuation, by the end of a line, or by a rest in the score draws nothing, and the button is off there. DESK DEFAULT, his to wave off: the button is off where the unit already ends in a hard boundary the engine took for itself.
- **Two avenues, one mechanism** (Dann 2026-10-21, after the desk's draft: *"users can manually put an octothorpe in Lyrics if they prefer this method of entry? WHy not? Two controls for one function is totally ok. I dont see a contradiciotn, just multiple avenues of agency for the user."*, transcribed as written). Typing a `#` in Lyrics stays as B3 builds it. The button writes the same character in the same place, so the two cannot disagree about what a break is. A typed `#` stays in the text exactly where the singer put it, and Ilya never moves it. **Ruled by Dann 2026-10-21 02:18:** *"Ilya honours it where you put it and never moves it, but it knows the grammar of an octothorpe means it takes effect at the end of a word unit, so that is where it will appear in the IPA line. I dont care that this may represent a disparity: the understood function is intact"* (transcribed as written). So a `#` typed inside a unit takes effect at the unit's end, and the IPA shows it there; the text and the IPA may differ on purpose. Step 2 builds this. **And 02:19:** *"Only careless users will put an octothorpe inside a word. We will not penalize a user for being careless when Ilya is equipped to understnad what they meant."* (transcribed as written). So a `#` anywhere in a token is read, never rejected.
- DESK DEFAULTS, his to wave off: the store is the Lyrics text (the `#` joins the word as scores already write it, «я#»), so it is per song, needs no new field, and travels with the text; the button is off while Poem is the witness Text transcribes.

## 3. What the code is today (read 2026-10-21)

- The pill row: `apps/web/src/lib/score/LoupeSyllables.svelte:193` draws `LoupePlacementRow` when `placement` is passed; `LoupePlacementRow.svelte` draws the two pills `loupe.place.clear` (with its three scopes) and `loupe.place.fromHere`, disabled by `placement.canClear` and `placement.canFromHere`. The contract is `PlacementControls` in `apps/web/src/lib/score/placement-scope.ts` (`onclear`, `onfromhere`, `hasSelection`, `canClear`, `canFromHere`). The page builds it at `apps/web/src/routes/+page.svelte:1210` (`placementControls`, a `$derived`) and passes it at `:4602`; the handlers are `handleClearPlacements` (`:633`) and `handlePlaceFromHere` (`:654`).
- The Syllables row is read-only for syllables; a tap on one calls `onplace` (`LoupeSyllables.svelte`, `tap`). A slot is `{ cyrillic, ipa, vowel, origin: { lineIndex, wordIndex, slotIndex, word } }` (`apps/web/src/lib/score/pairings.ts:77-117`). A note's `Pairing` of kind `'syllable'` carries the same `origin` (`pairings.ts:120-129`).
- Vowelless clitics own no slot: an enclitic's text and IPA are fused onto the previous slot, a proclitic's onto the next (`pairings.ts:203-229`).
- The Lyrics text is `doc.inputText`, run through `processText` at `apps/web/src/routes/+page.svelte:1844-1850`. The tokenizer: lines with text only, `split(/\s+/)`, tokens with no letters dropped, hyphenated particles expanded into their own tokens (`apps/web/src/lib/pipeline.ts:175-196`; `expandHyphenatedParticles`, `apps/web/src/lib/typed-hyphens.ts`). So a transcribed `lineIndex` and `wordIndex` are NOT raw line and token indices.
- Word flags: `isProclitic` and `isEnclitic` are on the pipeline's words (`pipeline.ts:122-123`, set at `:782-793`; `apps/web/src/lib/types.ts:100-102`). A host that had a particle split off keeps its hyphen as trailing `punctuation` (`typed-hyphens.ts`, `expandHyphenatedParticles`; `pipeline.ts:620-622`), so by the desk's reading `isEnclitic` is false for «ли» after «велит-» (`prevHasPunct`, `pipeline.ts:788`). NOT RUN. The unit logic does not depend on that flag, because `hyphenToNext` joins the pair.
- The LIVE boundary test is `apps/web/src/lib/boundaries.ts:37` (`PUNCTUATION_AT_END`), which holds the en dash and the em dash and not the ASCII hyphen; it returns early on `boundarySource === 'user'` (`:47`) and makes a line's last word hard (`:49`, `:62`) and a rest-derived break `'score'` (`:55-61`). The engine's own copy (`packages/phonology/src/engine.ts:1998-2035`) has no caller (batch C B3, site 1). The hyphen is lumped with the dashes at `pipeline.ts:53` (`TRAILING_PUNCT_REGEX`) and `apps/web/src/lib/score/pairings.ts:222` (`[-–—]`).
- A `#` already reaches the Lyrics text from scores, as «я#» (`diction-fold-live.test.ts:111-113`), and B3 treats a trailing `#` on a token and a `#` between spaces as one mark.
- READ 2026-10-21 (closes r3's NOT READ on the Lyrics field's undo): see the r4 note at the top. READ: `UndoHistory` to its end (see 'The undo'). READ 2026-10-21 13:5x: (1) `shown` is a `$derived` at `+page.svelte:459` (not `:460`, which is `marks`): `shownWitness(lyricsHas, poemHas, witnessDiffer, inputViews.witnessChoice[doc.id] ?? 'lyrics')` (`apps/web/src/lib/text/witness-lines.ts:116-119`), so it is `'poem'` only when Lyrics has text, a Poem exists, the two differ, and the singer chose Poem through `inputViews.chooseWitness` (`apps/web/src/lib/text/input-views.svelte.ts:69-71`, called from the `TextWitnessPair` at `+page.svelte:4371`); with Lyrics empty it is `'poem'` whenever a Poem exists. It is NOT the Input drawer's tab (`inputViews.view`, `input-views.svelte.ts:62-66`), and "Poem is shown" in this brief means `shown === 'poem'`: Text then transcribes `doc.publishedPoem` (`+page.svelte:461`), so a `#` written into Lyrics would change nothing the singer sees (DESK DEFAULT, his to wave off). (2) The page's `lines` are `LineData[]` (`+page.svelte:262`) of `WordStackData`, which carries `rightBoundary: string | null` and `boundarySource: string | null` (`apps/web/src/lib/types.ts:111`, `:113`), filled at `apps/web/src/lib/pipeline.ts:466-467`; compare them as strings, since `pipeline.ts:98-99` types them as unions. No component or `+page.svelte` line reads either field today (grep, 2026-10-21); `Loupe.svelte:1413` `rightBoundary` is a local geometry function with the same name and no relation. (3) `Loupe.svelte` is 3012 lines against a ceiling of 3013 (`scripts/ratchets.json:11`; counted as in `scripts/ratchets.mjs:63`, lines minus a final newline), one line of headroom; `LoupeSyllables.svelte` (316 lines) and `LoupePlacementRow.svelte` (95 lines) have NO entry in `ratchets.json` (grep, 2026-10-21), so the 1000-line limit for a file without a ceiling applies (`ratchets.json:3`, `ratchets.mjs:68`). The button's wiring therefore goes through the `placement` prop `Loupe.svelte:2567` already passes, and the brief adds no line to `Loupe.svelte`. Nothing in this brief is NOT READ except what its own sections mark.

## 4. Steps

### Step 0. Make room

Report the two ceilings that exist (`+page.svelte` and `Loupe.svelte`; `LoupeSyllables.svelte` and `LoupePlacementRow.svelte` have none, `ratchets.json`, read 2026-10-21) and the three files' lengths before step 1. The handler goes in a new module (`apps/web/src/lib/text/break-here.ts`, DESK DEFAULT name) taking its dependencies as arguments, so the page receives wiring lines only. If the room is not enough, stop and report which lines you would move. Do not raise a ceiling.

### Step 1. The unit logic

Seat `code-n194-syntactic-break-unit_r1_2026-10-21.ts` as `apps/web/src/lib/text/syntactic-break-unit.ts` and port its test to the repo's runner (vitest), keeping every assertion, the random-song property tests, and the independent oracle. Run the test against three one-line mutants (remove each of the three joining conditions in `unitEnd`) and report that each fails at least one test. Plain TypeScript, no runes (`ENVIRONMENT.md`, "Runes under vitest").

Then the adapter, in its own function in the same directory: from the pipeline's words of one line, build the `UnitWord[]`: `isProclitic` and `isEnclitic` from the word; `hyphenToNext` true when the word's trailing mark is a joining hyphen (`-`, U+2010, U+2011) and is not an en dash or an em dash. DESK DEFAULT, Dann's to wave off: a joiner is a hyphen touching letters, and a dash is an en dash, an em dash, or a hyphen with a space beside it. Establish, with a test, which field carries the hyphen for «велит-ли» and for a spaced « - »; do not assume `punctuation`.

Done when:
1. The ported tests pass, and each mutant fails.
2. For «велит-ли», «сказал бы», «не в силах», and «тень непроглядная», the adapter plus `unitEnd` gives the unit's last word, with the lines built from `processText`'s own output, not hand-built flags.
3. Say what a hyphen does where the particle is not in `HYPHENATED_PARTICLES` (`typed-hyphens.ts`).

### Step 2. A typed # takes effect at the end of its unit

**Ruled by Dann 2026-10-21 02:18** (section 2). The text keeps the `#` where it was typed; its effect, and its graft in the IPA, sit at the end of the unit that holds the word before it. This supersedes batch C B3's DESK DEFAULT that a `#` "always ends the word before it" (`brief-code-batch-c_r2_2026-10-21.md`, B3, "Ruled, as the design") wherever the word before it is not the unit's last. If B3 has shipped with the simpler rule, this step moves the field; do not build a second mechanism.

- B3 puts a field on the word before the `#` (DESK DEFAULT name `syntacticBreak: true`) and the boundary pass reads it (`boundaries.ts:47`, B3). Words get their clitic flags only later than the token split (`pipeline.ts:182` against `:782-793`), so the move belongs after the flags are set: find the unit's last word with `unitEnd` (step 1's adapter) and put the field, the hard boundary (`rightBoundary: 'hard'`, `boundarySource: 'user'`), and the IPA graft on that word. The word's Cyrillic, its punctuation, and the typed text are untouched.
- The graft goes after the unit's last SLOT: where that word is a vowelless clitic with no slot, after the slot that carries it (`pairings.ts:213-226`, `lastInLine`). The module's `terminalSlotIndex` states the rule.

- **Where a `#` sits in a token does not matter; where it takes effect does** (Dann 02:19, above). DESK DEFAULT, his to wave off: a `#` with letters to its left in the same token (trailing, as «вас#», or inside, as «ва#с») takes effect at the end of the unit that holds that token; a `#` with no letters to its left (leading, as «#вас», or standing alone) takes effect at the end of the unit before it, since it sits between the two; one at the very start of a line has nothing before it in the line and is a no-op (the previous line's end is already hard). Any number of `#` in one token is one mark. The token is stripped of every `#` before lookup, so «ва#с» looks up as «вас» (today the dictionary misses a token with a `#` in it and the engine deletes the glyph silently, `pipeline.ts:508-511`, per B3; B3 strips a trailing `#` at `pipeline.ts:182-186`, so extend that one place and add no second). The typed text keeps every `#` where it was typed.

Done when:
1. «не # в силах» and «не в силах #» give the same IPA from the engine, and the Lyrics text of the first is unchanged by the run.
2. «X # же Y» and «X же # Y» give the same IPA (B3's done-when 4, which called the first a singer's error and asked only for a report; this answers it).
3. A `#` already at a unit's end behaves as B3 built it, on the same inputs, with the same IPA: this fails on no tree and is there to catch a regression, and the report says so.
4. A `#` typed after a line's last word, or before a punctuated word, changes nothing audible (the boundary is already hard, `boundaries.ts:49`, `:62`); say what the IPA shows.
5. Removing the typed `#` (step 4's "Remove break") returns the IPA to its state before the `#`.
6. «вас благо#дать» gives the IPA of «вас# благодать»; «вас ##благодать» gives the same; «вас #благодать» gives the same; a lone `#` first on a line changes nothing from the unmarked line. In every case the Lyrics text is unchanged by the run, and the dictionary finds the word. Each fails on a tree that strips only a trailing `#`.
7. The approval corpus (`apps/web/src/lib/approval/ipa-corpus.approval.test.ts`) and all eight gates stay at baseline.

### Step 3. From a unit to a place in the Lyrics text

Goal: given the line and word of a unit's last word, the character offset in `doc.inputText` where its raw token ends.

- Do not re-implement the tokenizer. Extract the split, the filter, and the expansion at `pipeline.ts:175-196` into one shared function that returns, for every word it yields, the raw line number, the token's start and end offsets, and the word's index among the transcribed words. `processText` calls it, and so does the new code. Prove with a test that `processText`'s output is unchanged (the approval corpus, `apps/web/src/lib/approval/ipa-corpus.approval.test.ts`, and every other gate stay at baseline).
- Insert the mark attached to the end of the raw token («благодать» becomes «благодать#»), the form scores already write. Remove it by deleting an attached `#` at that token's end or a following token that is only `#`.
- A word split from a hyphenated token («ли» of «велит-ли») maps to the whole raw token's end.
- Empty lines are not lines (`pipeline.ts:175-180`): the offset must come from the shared function, not from counting newlines.

Done when:
1. For the Lyrics text of song 1 (the fixture the desk used on 2026-10-21; Code finds it and names it) and three hand-written lines with a blank line before them, an extra space, and a hyphenated particle, the offset of every transcribed word lands on the end of the raw token it came from. The test fails on a tree that counts newlines.
2. Inserting then removing a mark returns the text byte for byte.

### Step 4. The button

- Add to `PlacementControls` (`placement-scope.ts`) a break entry: its action, and its state as one of `'insert'`, `'remove'`, or `'off'`. `LoupePlacementRow.svelte` draws a third pill from it, with the ratified strings (a new i18n key for each, EN and FR, added under the Dann-ratified wording only; list the keys in your report).
- State is computed in the new module from one source of truth, the engine's verdict on the unit's last word, with no second copy of any punctuation pattern: `'off'` when no note is selected, when the selected note carries no syllable (the pairing is not `'syllable'`, or is a melisma: say what you do for a melisma note, NOT ESTABLISHED), when Poem is shown, or when the unit's last word already has `rightBoundary === 'hard'` from any source but `'user'` (punctuation, a line's end, a rest); `'remove'` when any word of the unit holds a `#` the singer placed (typed or pressed, `boundarySource === 'user'`), and a press then removes every `#` inside that unit; `'insert'` otherwise. If the pipeline's words do not expose those fields to the page, expose them through the pipeline's existing output and say where.
- On a press: resolve the unit with `unitEnd` and the terminal slot with `terminalSlotIndex` (the module's `breakTarget` is the one call); edit `doc.inputText` once and push one entry onto the Loupe's `UndoHistory` (`+page.svelte:847-863`) before the edit, with `inputText` added to `UndoState` as an OPTIONAL field that only this verb's entry carries (see 'The undo' below: a required field would change every other verb's undo), and the note `{ kind: 'text', key: ... }` or `'change'` shape that `undo-history.svelte.ts:41` allows (say which and why); the pipeline re-runs; the Loupe's selection moves to the note whose pairing carries the terminal slot's origin (`lineIndex`, `wordIndex`, `slotIndex`). If that syllable is not placed on a note, the selection stays and the `#` is still written; say what the singer sees.
- The edit comes from outside the Lyrics field. There is no custom undo in the field (`IntakeViews.svelte:197-202`). The desk's understanding is that a browser discards a textarea's native undo history when a script sets its value (browser behaviour, NOT RUN here). Do not promise a Control+Z in the field. In a browser, with the field focused, press the button, press Control+Z, and report what you observe; write no test that pins it. `UndoHistory` was read to its end on 2026-10-21 (`undo-history.svelte.ts:111-114` push, `:116-122` undo, `:124-130` redo, `:138-141` clear, `:148-152` stackLabel); what it does is in 'The undo' below.
- B3 guarantees the `#` takes no note, so no pairing moves (B3 done-when 3). Prove it here: the pairing map before and after a press differs in nothing.

Done when:
1. In song 1, m. 4, with the selection on the note under «ляд», the pill reads "Break after this word", a press writes the mark after «непроглядная», the Lyrics text is otherwise unchanged, the IPA of the slot «я» carries the grafted `#`, and the selection is on the note under «я».
2. A press on the note under «я» alone gives the same text and the same selection (the jump is idempotent).
3. The pill then reads "Remove break"; a press restores the original text byte for byte, and the Loupe's named Undo pill after the first press reads the sentence in 'The undo' below and, pressed, restores the original text byte for byte.
4. The pill is off where: no note is selected; Poem is shown; the unit ends in a comma or a period (song 1, a word before a comma); the unit is the last word of its line; the unit ends before a rest the score places (row 108's case). One test each. The "unit ends in a rest" case follows B3's phrase-end source; if it cannot be built on a fixture, say so.
5. «велит-ли»: from the host's syllable the mark lands after the whole token, and the selection jumps to the particle's note.
6. The `#` appears in no Cyrillic, no Poem, no staff drawing, and not as the `[#]` junction mark: B3's surface tests still pass and you add one for the button's output.
7. All eight gates at baseline.

## 5. Sites that compute a boundary, a unit, or a position in typed text (`CONTRACT.md` section 4)

This change computes where a `#` goes and which syllable ends a unit. Every site that computes the same thing is named. What depended on them agreeing: a `#` written at one place and read at another puts the break on the wrong word, or seats a note to it.
1. Batch C's list (B3, sites 1 to 7). Re-read it; it holds.
2. `apps/web/src/lib/boundaries.ts:37` is the live punctuation test and `packages/phonology/src/engine.ts:1999` is its dead copy; the button reads the engine's verdict, not either pattern.
3. The hyphen is a joiner in `typed-hyphens.ts` and a punctuation mark in `pipeline.ts:53` and `:788`, and a joiner-or-dash in `pairings.ts:222`. This brief changes none of them. It builds `hyphenToNext` beside them. Report whether any of the three needs a change for the break to behave, and say which; do not change them here.
4. Every other place that splits typed text on whitespace or counts its words: `grep -rn "split(/" apps/web/src --include=*.ts --include=*.svelte`, read each hit, and list it with a verdict, as B3 asks. The new shared tokenizer must be the only place that decides what a token is.

## Where would this wall a singer in? (Fable's question for every brief)

Answer it in your report: a case where a singer presses the button and the `#` lands on a word they did not mean, or cannot get out, or cannot tell why a word sounds different; or where the squircle jumps somewhere confusing; or where the pill is off and the singer cannot tell why. The brief puts one case to you: a coach marks a break after a clitic the engine has fused. A second: the singer edits the Lyrics text after pressing, and a word before the mark changes.

## 6. Return memo

One file per step, `docs/sessions/report-code-n194-r3-step<n>_r1_2026-10-21.md`, each with: what you changed (files and `path:line`); the tests added and which failed before; the eight gates before and after; a section "What I could not establish" (every NOT ESTABLISHED and NOT READ above, closed or still open); and the strings owed to Dann with a desk draft for each.

## 7. Cost and order

Code on a cloud lane, Sonnet: DESK ESTIMATE 150k to 300k tokens, a range, worst case 400k; four commits. Fable's review of this brief: worst case about 200k tokens (the last two reviews cost 137,554 and 175k against stated caps of 100k and 150k). Order: batch C, then this. The Guide paragraph on the `#` is ratified in both languages (`ratified-guide-break-paragraph_2026-10-21.md`) and is seated by its own small brief, not this one.

## 8. Not in this brief

A click or tap on a Text word, and anything in Markup beyond the Loupe's button; a card of any kind; a per-song break map; the Guide text; the French of the pill's label (Dann's); any change to `phonationBreak` or the `[#]` junction mark.

## The undo (added in r4)

Two new strings in the `loupe.undo.*` family (`apps/web/src/lib/i18n.ts:457-493`), each both languages. RATIFIED by Dann 2026-10-21 20:30 (*"yes"*, English and French as drafted; SCOPE, DESK DEFAULT, his to wave off). None is coined: « frontière » is the term of the ratified Guide paragraph (`ratified-guide-break-paragraph_2026-10-21.md`, French); « placée » is adopted from `loupe.undo.placed` « syllabe placée » (`i18n.ts:471`); « retirée » is adopted from `loupe.undo.cleared` « placement retiré » (`i18n.ts:484`). The agreement checked: « frontière » is feminine, so « placée » and « retirée ».

| key | EN | FR (draft for Dann) |
|---|---|---|
| `loupe.undo.breakPlaced` | `break placed` | `frontière placée` |
| `loupe.undo.breakRemoved` | `break removed` | `frontière retirée` |

The pill's own label stays the ratified pair (section 0). Both are ratified; list them in the report as added, not as owed.

### What `UndoHistory` does, read to its end on 2026-10-21, and what that fixes in the build

- `push(note)` snapshots the state as it stands when called and clears the redo stack (`undo-history.svelte.ts:111-114`), so the press must push BEFORE it edits `doc.inputText`.
- `undo` pushes a snapshot of the state now onto the redo stack, writes the taken entry, and pops it (`:116-122`); `redo` mirrors it (`:124-130`). Both snapshot through `#snapshot`, which calls the page's `read` with no knowledge of the verb (`:105-107`).
- `clear` empties both stacks and is called on a song switch (`:138-141`), so a break entry cannot cross songs.
- Sixteen push sites exist today, `apps/web/src/lib/score/correction-verbs.svelte.ts:201-389` and `apps/web/src/lib/score/tuplet-row.svelte.ts:78`, and `apps/web/src/lib/score/undo-history.test.ts:43` builds an `UndoState` literal.
- **The flaw in the first r4, found by this read:** adding `inputText` as a required field makes EVERY verb's undo restore `inputText` to what it was at that push. A singer who types a word in Lyrics (which pushes nothing), then presses Undo on an earlier placement, would lose the typing. Today an undo leaves `inputText` alone. That change is out of this brief's scope and walls a singer in.
- **The build:** `inputText` is optional on `UndoState`. `push` takes an option that adds the current `inputText` to the snapshot; `undo` and `redo` add the current `inputText` to the opposite stack's snapshot only when the entry being taken carries one; the page's `write` assigns `doc.inputText` only when the entry carries one. The sixteen existing sites and the test literal stay valid, and none of them touches `inputText`.
- **What the singer gets:** Undo after the press removes the `#`. Text typed after the press is lost by that undo and comes back with Redo (redo's snapshot is taken at undo time, `:119`). A new action clears Redo (`:113`), so typing after an undo and then acting loses it for good; say so in your report and do not hide it.
- **Tests, each failing before the change:** press then undo restores the text byte for byte; undo then redo returns the text with the `#`; an Undo of a different verb after typing leaves `inputText` as typed; `seatedText` and `inputText` are equal after the break's undo when they were equal at the push (the entry saves both at the same moment); a song switch empties the stacks.
- NOT ESTABLISHED: what the singer sees when the `#` press happens while the Lyrics field has focus and the browser has its own undo history (browser behaviour, NOT RUN); observe it and report.
