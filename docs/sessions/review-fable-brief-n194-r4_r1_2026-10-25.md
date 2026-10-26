# Fable review: brief for Code, N.194 the Loupe's break button, r4 (2026-10-25)

Brief reviewed: `docs/sessions/brief-code-n194-loupe-break-button_r4_2026-10-21.md`, md5 `5dd309ee3c3e5b1718946a8c1533d3da` (checked in the clone at `e0f4ad9`). Companions: `code-n194-syntactic-break-unit_r1_2026-10-21.ts` (md5 `e7254d46ec5eb32c5998b90408d01011`) and `code-n194-syntactic-break-unit.test_r1_2026-10-21.ts` (md5 `9f7724fb30530ca693e59f0e37e0a69b`), both as the brief states.

Every `path:line` below was read by Fable this session; nothing was run. NOT ESTABLISHED beats a complete invented answer.

Batch C has not shipped. Every line below that says "B3" names code the brief assumes batch C will add; the tree at `e0f4ad9` has no `syntacticBreak` field, no `#` strip at `pipeline.ts:182-186`, and no `#` fold in `same-words.ts:26` (grep this session).

## Verdict: SEND WITH AMENDMENTS

Three amendments change what Code would build and, unbuilt, would fail the brief's own done-when lines (1, 2, 3). Two name room the brief says it has and does not (4, 5). The rest name sites, drop dead code, and tighten tests that would pass for the wrong reason.

## Amendments, ranked

### 1. A bare write to `doc.inputText` transcribes nothing, so the press and the undo both miss the pipeline

Evidence. The page has exactly two writers of `doc.inputText`: `handleClear` (`+page.svelte:2124`) and `handleInput` (`:2376-2380`: `doc.inputText = text; nameIfUnnamed(); joinText(how)`). Transcription runs only through `joinText` (`:2545-2575`) and `transcribeVerdict` (`one-action.ts:98-106`, `'now'` for `'paste'`), which calls `transcribeText` (`:1925-1981`). No `$effect` re-runs the pipeline when `doc.inputText` changes: the two effects that read it return early when `transcribedText !== doc.inputText` (`:1815`, `:1837`). `transcribeText` is also where the session marks are re-keyed (`:1953-1956`) and the seats follow the text (`:1971-1981`, `seatedTextDiff` then `reseatAcross`). The brief's step 4 says "edit `doc.inputText` once ... the pipeline re-runs" and 'The undo' says "the page's `write` assigns `doc.inputText` only when the entry carries one". Neither names the call that makes the pipeline run.

Cost if not amended. The `#` sits in the text, the IPA does not change, the squircle has no new slot to jump to, and step 4's done-when 1, 3, and 5 fail; an undo restores the text and leaves the old IPA on the page.

Replace, in step 4's press bullet, "edit `doc.inputText` once" with:

> write the text through `handleInput(nextText, 'paste')` (`+page.svelte:2376-2380`), the one path that transcribes (`joinText`, `:2545-2575`; `transcribeVerdict`, `one-action.ts:98-106`, answers `'now'` for `'paste'`) and that re-keys the marks and lets the seats follow (`transcribeText`, `:1953-1981`). Never assign `doc.inputText` directly: nothing re-runs the pipeline on that assignment (`:1815`, `:1837` return early).

Add to 'The undo', after "the page's `write` assigns `doc.inputText` only when the entry carries one":

> through `handleInput(entry.inputText, 'paste')`, AFTER `doc.pairings` and `doc.seatedText` are restored (`:855-861`), so the transcription that follows diffs the restored seated text against the restored input (`:1971`) and reseats nothing. Test: undo after the press leaves `lines` equal to the pre-press `lines` and `doc.pairings` equal to the pre-press map.

### 2. Step 2's move runs after the boundary pass has already read the field

Evidence. `autoDetectBoundaries` runs in `processText` step 2 at `pipeline.ts:327`, over `PreTranscribeWord[]`. `isProclitic` and `isEnclitic` are set in `transcribeWords`, step 3, at `:782-793`. B3 (batch C r2, "Ruled, as the design") has `boundaries.ts:50` read `syntacticBreak` as it reads `PUNCTUATION_AT_END`. So the field is read at `:327`, before the flags the brief says the move needs exist. The brief's own sentence: "Words get their clitic flags only later than the token split (`pipeline.ts:182` against `:782-793`), so the move belongs after the flags are set" puts the move after the pass that consumes it. `boundaries.ts:51-54` already computes a proclitic and a next-enclitic from the clitic sets on `cleanWord` and `promotedFromClitic`, without the flags; that is the material the move has.

Cost if not amended. Code builds the move at step 3, the boundary already stamped at step 2 stays on the typed word, and step 2's done-when 1 and 6 fail, or Code re-runs the boundary pass and two passes disagree.

Replace step 2's first bullet with:

> B3 puts a field on the word before the `#` (DESK DEFAULT name `syntacticBreak: true`) and the boundary pass reads it (`boundaries.ts:50`, B3). That pass runs at `pipeline.ts:327`, before the clitic flags of `:782-793` exist, so the move happens inside or immediately before `autoDetectBoundaries`, from `PreTranscribeWord` and the clitic sets, the way `boundaries.ts:51-54` already tests a proclitic and a next enclitic. The step 1 adapter therefore has two entry points over one `unitEnd`: one from `PreTranscribeWord[]` plus `CliticSets` (for the pipeline), one from `WordStackData[]` (for the button, step 4). The pre-flag adapter adds the `prevHasPunct` guard of `pipeline.ts:788` (a word after punctuation is not an enclitic), which `boundaries.ts:52-54` lacks; a test proves the two adapters give the same unit end on `processText`'s own output for the four lines of step 1's done-when 2. The hard boundary (`rightBoundary: 'hard'`, `boundarySource: 'user'`) and the IPA graft land on the unit's last word.

### 3. "Off while Poem is shown" is reasoned from Text, and the button lives on Markup

Evidence. The Loupe is available only on the Markup document (`+page.svelte:1026-1030`). Markup seats and draws from `lines` (`:4455`, `transcribedLines={lines}`), the transcription of `doc.inputText` (`:1847`), and its slot queue is `poemQueue` from `lines` (`:395-396`). `shown === 'poem'` changes what TEXT draws (`:472`, `textLines`), not what Markup draws. So when a singer has chosen Poem on Text and then works in the Loupe, the Loupe shows Lyrics' IPA, a `#` written into Lyrics WOULD change what they see, and the brief's reason for the off state ("a `#` written into Lyrics would change nothing the singer sees") does not hold on the surface the button is on. The case where a `#` into Lyrics changes nothing is a different one: Lyrics empty, `lines` empty, and the queue falling to `scoreTextQueue` (`:396`); writing into an empty Lyrics then puts text there for the first time and replaces the derived poem (`:431`).

Cost if not amended. A singer on Markup finds the pill greyed for a reason they can only see on another document. That is the wall for this brief.

Replace, in step 4's state bullet, "when Poem is shown" with:

> when `lines.length === 0` (Lyrics holds no transcribed text and the queue is the score's own, `+page.svelte:395-396`, `:431`), since a `#` written into an empty Lyrics would seat the song from new text;

and strike section 3's DESK DEFAULT "the button is off while Poem is the witness Text transcribes" and section 2's "the button is off while Poem is the witness Text transcribes", replacing each with the line above. The `shown` reading at `:459` is correct as a fact and stays in section 3 as a fact.

### 4. `+page.svelte` has one line of headroom and the wiring needs more than one

Evidence. `scripts/ratchets.json:8` holds 5607; the file is 5606 lines (wc this session). The brief's wiring: a `break` entry in `placementControls` (`:1210-1216`, an object literal; at least one line, more for the state), a new import, `inputText` in the `UndoHistory` read (`:848-855`) and its write (`:856-862`, and amendment 1 makes that a `handleInput` call with an `if`). That is four lines at the least. Step 0 says "If the room is not enough, stop and report which lines you would move".

Cost if not amended. Code stops at step 0 on a fact the desk can state now, and a round trip is spent.

Replace step 0's last two sentences with:

> The room is not enough (one line of headroom against at least four wiring lines: the `placementControls` entry at `:1210-1216`, the import, the `UndoHistory` read at `:848-855` and write at `:856-862`). Move first, DESK DEFAULT, Code's to vary: lift the `UndoHistory` construction (`:847-865`) into `apps/web/src/lib/score/undo-wiring.svelte.ts`, taking `doc`, `stationCursor`, and `handleInput` as arguments, and have it own the optional `inputText` read and write. Report the line count after the move and before step 1. Batch C may have moved the count; read the file, not this brief.

### 5. Step 3 asks for a shared tokenizer that already exists, and does not name its callers

Evidence. `splitIntoPreLines` (`pipeline.ts:173-196`) is already the one tokenizer, "lifted rather than copied" (`:160-171`), with two callers: `processText` (`:257`) and `wordGrid` (`:217-221`). `wordGrid` is read by `witness-lines.ts:93` and `:136`, `seated-text.ts:30` and `:32`, and `+page.svelte:1953` and `:2487` (grep this session). The brief's "Extract the split, the filter, and the expansion at `pipeline.ts:175-196` into one shared function" would make a second one. Offsets cannot come from `.trim().split(/\s+/)` (`:181-182`), which discards positions; a `matchAll(/\S+/g)` over the untrimmed raw line gives them (`poem-compare.ts:103` already tokenizes that way for its own purpose).

Cost if not amended. Two tokenizers, which is the drift `:160-171` was written to prevent, and a `wordGrid` whose coordinates the new offsets do not share.

Replace step 3's first bullet with:

> Do not re-implement the tokenizer. `splitIntoPreLines` (`pipeline.ts:173-196`) is the one tokenizer, called by `processText` (`:257`) and `wordGrid` (`:217-221`). Extend it to carry, on each word it yields, the raw line index it already has (`rawIndex`), and the token's start and end offsets in that raw line, taken from a `matchAll(/\S+/g)` over the untrimmed line rather than from `split`, so a line with a leading space keeps its offsets. A word split from a hyphenated token carries the whole token's offsets. `processText` and `wordGrid` are unchanged in what they return; prove it with the approval corpus and every gate at baseline, and with `wordGrid`'s six readers (`witness-lines.ts:93`, `:136`; `seated-text.ts:30`, `:32`; `+page.svelte:1953`, `:2487`) untouched.

### 6. The cross-site line misses the sites that compute a unit

Evidence. Section 5 names the boundary sites and the hyphen sites and sends Code to a grep for `split(/`. The quantity this brief introduces is the UNIT (a word with what leans on it). Three sites compute that today and none is named: the clitic merge pass in `pipeline.ts:928-990` (proclitic chains forward, enclitic chains back, "processed as units"), `resolveCliticChain` in `packages/phonology/src/clitics.ts:76-110` (a proclitic's host, scanning past intervening proclitics), and `boundaries.ts:51-54` (a proclitic or a next enclitic makes the boundary `'clitic'`, with no punctuation guard, so «велит-» before «ли» is `'clitic'` there while `pipeline.ts:788` makes «ли» NOT an enclitic because the host's `punctuation` is `-`). The slot fusion at `pairings.ts:213-226` and `seatCliticFolds` (`clitic-seat.ts`, header `:1-30`) compute the same thing on the score side. The grep for `split(/` (run this session) finds `same-words.ts:26`, `songs.ts:52`, `pipeline.ts:182`, and `page-config.ts:219` as whitespace splits of text; `row108.support.ts:50` splits on a single space and is test support.

Cost if not amended. `unitEnd` can disagree with the merge pass about which word is the host, and the `#` grafts after one word while the IPA display fused the clitic onto another.

Add to section 5:

> 5. Sites that compute a unit today: the clitic merge pass, `pipeline.ts:928-990`; `resolveCliticChain`, `packages/phonology/src/clitics.ts:76-110`; `boundaries.ts:51-54` (no `prevHasPunct` guard, unlike `pipeline.ts:788`: «велит-» before «ли» is `'clitic'` there and «ли» is not `isEnclitic` here); `pairings.ts:213-226` and `clitic-seat.ts` on the score side. `unitEnd` is a sixth. Test: for every word of `processText`'s output on the four lines of step 1's done-when 2, `unitEnd` names the word whose slot the merge pass fused the clitic's IPA into. Where the two disagree, stop and report; do not pick one.

### 7. The module seats two functions r4's design does not use, and one of them contradicts the ruling

Evidence. `code-n194-syntactic-break-unit_r1_2026-10-21.ts:55-81`: `toggleBreak` and `normalizeBreaks` operate on an index list of breaks, the per-song break map of brief r2 that r3 dropped ("r2's steps 0 to 2 ... are NOT carried"). r4's step 4 calls `breakTarget`, `unitEnd`, and `terminalSlotIndex`; nothing calls the other two. `normalizeBreaks`'s header (`:68-73`) says a stored break "moves to the end of the unit it now falls in", and Dann's 02:18 ruling (brief section 2) says "Ilya honours it where you put it and never moves it". The test file's three tests at `:84-105` exercise them. The module header's "Insert break here" (`:48-49`) is the label Dann set aside at 13:42.

Cost if not amended. Dead code shipped with tests that pin a rule the ruling forbids; the next desk reads it as design.

Replace step 1's first sentence with:

> Seat `code-n194-syntactic-break-unit_r1_2026-10-21.ts` as `apps/web/src/lib/text/syntactic-break-unit.ts` WITHOUT `toggleBreak` and `normalizeBreaks` (`:55-81`, the per-song map of r2, which r4 does not store; `normalizeBreaks` moves a break, which the 02:18 ruling forbids) and without their three tests (`.test:84-105`); change the header's "Insert break here" to the ratified "Break after this word". Port the remaining 19 tests to vitest, keeping every assertion, the property tests, and the independent oracle.

### 8. Two step 4 tests pass or fail for the wrong reason

Evidence. (a) "the pairing map before and after a press differs in nothing": `doc.pairings` is untouched by the press (B3's no-note guarantee plus amendment 1's path, which reseats nothing when the seated text follows), but `shownPairings` is `refreshPairings(doc.pairings, slotQueue)` (`+page.svelte:488`), and `refreshPairings` rewrites a pairing's `ipa` when the slot's IPA changes (`pairings.ts:466-469`, the N.119b branch), which the graft does. A test on `shownPairings` fails on a correct build; a test on `doc.pairings` is the one meant. (b) The press writes into a Lyrics that, on song 1, arrived from the score; `poemFromScore` (`:412`), the score's seat path (`:659`), and the waiting seat (`:1990`) all read `sameWords(doc.inputText, scoreText)`. They stay true only because batch C's item 7 folds the `#` in `same-words.ts:26` (Fable's amendment 3, applied in r2). Nothing in this brief checks that the press keeps them true.

Cost if not amended. (a) a false failure; (b) a press on a score-filled Lyrics silently turns off the `from score` tag and the score's own seat if B3's fold is missing or incomplete, and no test here would notice.

Replace step 4's last bullet with:

> B3 guarantees the `#` takes no note. Prove it here on `doc.pairings`: every key and every `origin` is the same before and after a press (`shownPairings`' `ipa` WILL change, `pairings.ts:466-469`, and is not the test). And prove the press keeps `sameWords(doc.inputText, scoreText)` true on song 1 (`+page.svelte:412`, `:659`, `:1990` depend on it; B3's `same-words.ts:26` fold is what makes it so): a test that fails when the fold is removed.

### 9. Step 3's removal and step 4's "remove" disagree about what is removed

Evidence. Step 3: "Remove it by deleting an attached `#` at that token's end or a following token that is only `#`." Step 4: "a press then removes every `#` inside that unit." Step 2's rule adds a third place: a leading `#` on the token AFTER the unit («вас #благодать») takes effect at the end of the unit before it.

Cost if not amended. "Remove break" leaves a leading `#` on the next token, the pill still reads "Remove break", and the singer presses it again to no effect.

Replace step 3's removal sentence with:

> Remove by deleting every `#` in every raw token of the unit (trailing, inside, or leading, per step 2), every standalone `#` token between the unit's first token and the next token with letters, and a leading run of `#` on that next token. Then the unit holds no mark by step 2's rule, and the pill reads "Break after this word" again; test that.

### 10. Small cites and counts

- Section 3 and 'The undo': the push sites are nineteen, not sixteen: thirteen in `correction-verbs.svelte.ts` (`:201`, `:210`, `:239`, `:257`, `:265`, `:274`, `:288`, `:296`, `:331`, `:354`, `:376`, `:381`, `:389`), one in `tuplet-row.svelte.ts:78`, and five in `+page.svelte` (`:636`, `:667`, `:702`, `:1243`, `:1273`). The conclusion (an optional field leaves all of them valid) holds for nineteen as for sixteen.
- `undo-history.svelte.ts`: `UndoState` is `:44-71`; `#snapshot` is `:104-106`; the page's constructor call is `:847-864` with the destructure at `:865`.
- `boundaries.ts`: a line's last word is made hard at `:62-64` (`:49` only defines `isLastWord`); the score branch is `:59-61`; the punctuation stamp is `:65-67`.
- `pairings.ts`: `SlotOrigin` is `:77-98` and `Slot` is `:109-117`.
- Step 1: "which field carries the hyphen for «велит-ли»": by reading, `punctuation` (`TRAILING_PUNCT_REGEX`, `pipeline.ts:53`, holds `-`, U+2010, U+2011, and both dashes; the host token «велит-» comes out of `expandHyphenatedParticles`, `typed-hyphens.ts:146-166`, with the hyphen as its last character). The brief is right to ask for the test; the expectation is `punctuation === '-'`, and `hyphenToNext` reads that field.
- Step 4, "a new i18n key for each": name them in the brief (DESK DEFAULT `loupe.place.breakAfter` and `loupe.place.breakRemove`, in the `loupe.place.*` family at `i18n.ts:479-483`), because the Guide brief's label pin reads them by name and otherwise waits on Code's report.
- Step 4, "the pairing is not `'syllable'`, or is a melisma": `Pairing` is `'syllable' | 'melisma' | 'empty'` (`pairings.ts:120-129`); `'off'` for both non-syllable kinds, and for a tie's continuation, which is a note and not a target (`+page.svelte:1206-1209`).

## Checks that passed

- `IntakeViews.svelte:189-194` (`onInput`), `:197-202` (`onKeydown`, Control or Command plus Enter only), `:225-236` (the textarea): as the brief says; no custom undo in the field.
- `+page.svelte:459-461` (`shown`, `marks`, `shownText`), `witness-lines.ts:116-119`, `input-views.svelte.ts:62-71`, `:4371`: as the brief says.
- `LoupeSyllables.svelte:193` draws `LoupePlacementRow`; `placement-scope.ts:35-44` is the contract; `+page.svelte:1210-1216` builds it, `:4602` passes it, `Loupe.svelte:2567` passes it on; handlers at `:633` and `:654`.
- `Loupe.svelte` 3012 lines against 3013 (`ratchets.json:11`); `LoupeSyllables.svelte` 316 and `LoupePlacementRow.svelte` 95 with no ceiling (`ratchets.json:3`, `ratchets.mjs:63`, `:68`). No line of `Loupe.svelte` is needed.
- `types.ts:111`, `:113` string unions; `pipeline.ts:98-99`, `:466-467`; no component reads `rightBoundary` or `boundarySource` today (grep); `Loupe.svelte:1413` is geometry.
- `engine.ts:1998-2035` has no caller; `boundaries.ts:37` is live; `pipeline.ts:53` and `pairings.ts:222` lump the hyphen with the dashes; `typed-hyphens.ts:131` holds the six particles.
- The ratified strings (section 0, 'The undo') match `OPEN.md:3296-3297`; « placée » and « retirée » are in `i18n.ts:471` and `:484`; no colon, so the OQLF spacing test (`i18n.test.ts:101-116`) has nothing to fail on.
- The unit module's `unitEnd` matches the oracle by construction and the laws it states (`.test:71-82`); `terminalSlotIndex` takes the last slot in the tapped-to-end range, so a tap on a host jumps to a voweled enclitic's own slot and to the host's last slot for a vowelless one (`.test:135-139`), which is what Dann's 01:35 words ask for.
- No IPA is written by hand in any done-when.
- `diction-fold-live.test.ts:111-113` and `sunless-01-engraved.musicxml` (two `<text>#</text>` lyrics, counted this session): a `#` reaches Lyrics from scores today.

## Where would this wall a singer in?

- The pill is off while Poem is shown on Text, with the singer on Markup where the Loupe is (amendment 3).
- The press does not transcribe (amendment 1): the singer sees the text change and the IPA not, and nothing says why.
- A score's own `#` («я#», two in song 1) reads, after B3, as a break the singer placed: the pill offers "Remove break" on a mark they never set, and the ruling's words (01:55, "the only way an octothorpe appears ... is if it is placed manually by the user") did not foresee it. Dann's (below).
- A spaced dash («слово – слово») is not a boundary today: the lone dash token has no letters and is dropped at `pipeline.ts:182-186`, so the word before it is `'soft'` and the pill is ON there, where the singer may expect a break the punctuation already implies. An engine fact older than this brief; the brief's "a break implied by punctuation ... the button is off there" is not true for a spaced dash.
- The brief's own two cases (a break after a fused clitic; an edit after the press) stand and Code answers them.

## Questions for Dann

1. Taste. A `#` that arrived in Lyrics from a score («я#», song 1 carries two) will show "Remove break" in the Loupe and a grafted `#` on the IPA line as if you had placed it. Desk default: it reads as placed and can be removed. Keep that, or have a score's own mark drawn but not offered for removal?
2. Taste, and older than this brief. A spaced dash between words is not a boundary in Ilya today, so the button is on there and a `#` there changes the IPA. Leave it (the singer decides), or add the spaced dash to the punctuation that implies a break (a change to `boundaries.ts:37` and the token filter, its own row)?

## What I could not establish

- Everything batch C builds: the field name, where the strip lands, whether B3 shipped with the simpler "ends the word before it" rule, the gate baselines and `+page.svelte`'s length after batch C.
- What the browser does to a textarea's native undo history when a script sets its value (the brief marks it NOT RUN; right).
- Whether a tap inside the Loupe itself selects a note, or only a tap on Markup (`+page.svelte:1411` is the only `loupeOpen = true`); it bears on the Guide sentence, not on this brief.
- Whether the "rest the score places" case (step 4, done-when 4) can be built on a fixture: `phraseEnds` needs `ingestedScore` and seats (`+page.svelte:2487`), read not run.
- Whether `wordGrid` with offsets changes any byte of `processText`'s output: by reading, no; the approval corpus is the instrument.
