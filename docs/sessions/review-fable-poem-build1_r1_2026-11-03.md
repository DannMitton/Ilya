# Review: the poem library, build 1 brief (Fable, r1, 2026-11-03)

Brief reviewed: `/home/claude/review/brief-code-poem-library-build1_r2_2026-11-03.md` (read whole). Design: `docs/sessions/design-onboard-poems_r2_2026-11-03.md` (read whole). Code read this session, under `apps/web/`: `src/lib/loader.ts` (:100-129, :255-349, :530-563, :635-801), `static/sw.js` (whole), `src/lib/text/input-line.ts` (whole), `src/lib/text/input-views.svelte.ts` (whole), `src/lib/i18n.ts` (:780-889 and a search), `src/lib/library/document.svelte.ts` (:90-150, :270-380), `src/lib/library/library.ts` (:60-273), `src/lib/library/types.ts` (:185-244), `src/routes/+page.svelte` (:2330-2480, :2800-2840, :3940-4020). Data: `tools/poems/library.json` (parsed, every entry's fields and folded letter count), `reference_sw_match.py` (whole), `fixtures/expected_r1.txt` (whole). Not in the uploaded tree, so NOT ESTABLISHED wherever named: `docs/house-style/interface-text.md`, `lib/one-action.ts` (`TextArrival`), `components/Drawer/IntakePanel.svelte`, `text/relining.ts`, the 12 Lyrics fixtures, and any code for "the tiers", "repair", or "Revert" on a poem (a search of `+page.svelte` for `repair`, `revert`, and `tier` finds only seat healing, stress revert, and the score header).

## Verdict

**SEND WITH AMENDMENTS.** The walk is the right shape and the card answers the singer's questions in the right order. Four things would mislead or harm her as written: the card can name a poem she cannot recognize (an excerpt of a long poem shows the poem's own title and first line, not her song's), the card lives in one view while the poem it asks about sits in the other, focus moves to a button while she may be typing, and "Not this poem" does not promise to put Lyrics back as it was. The rest is wording and code placement.

## The walk, as the singer

**Item 1, the card.** She dropped a scan. A card appears over LYRICS (a file lands her on Lyrics: `+page.svelte:2829` calls `inputViews.land('lyrics', poemBlank)`, and `input-views.svelte.ts:85-88` moves the view to Lyrics when Poem is blank and she has not tapped a view). The card says Ilya found a poem and shows a title, a first line, and a poet. Good: those are the three things she can check against her score. She reads "Coloured words in LYRICS show where the song departs from the poem" and sees colours in her words. That line explains the colours at the moment they appear, which is its job.

What she wonders that the card does not answer: *where is the poem?* The card is above LYRICS; the poem is in POEM, one tap away, and the brief shows the card "in that view" only (step 5). If she taps POEM to look, the brief does not say the card follows her. Amendment 2.

*Is it my song?* For a whole poem set whole, yes: the title and first line are hers. For an excerpt, no. Fixture S (260 letters) matches «Мцыри» (15,173 folded letters) at 0.862 (`expected_r1.txt:2`; letter counts computed this session from `library.json` with the reference fold). The card for S reads «Мцыри», «Немного лет тому назад,», Лермонтов. A singer with a romance drawn from that poem sees a title that is not on her score and a first line she does not sing. She cannot judge it, and the card invites "Not this poem" for a right answer. Amendment 1.

*Who wrote it?* For the Heine entry the data's `author` is «Генрих Гейне» and `translator` is «Фёдор Иванович Тютчев» (`library.json`, entry `419e40dd3c`). The strings have no translator slot, so the card names Heine for a Russian text that is Tyutchev's. Her score says Tyutchev. Amendment 7.

*Which name?* The walk shows «Кольцов»; the data holds «Алексей Васильевич Кольцов». The brief does not say which the card prints or how a surname would be derived. Amendment 8.

**Item 2, the order of her questions.** Right order. One wording note: "Keep it" read alone, by a screen reader on a focused button, is "Keep it, button". "Keep this poem" pairs with "Not this poem" and names the thing. Strings section.

**Item 3, Keep it.** The card folds to a quiet line under Poem. She is on LYRICS, so what she sees is the card vanishing and the Lyrics line (`intake.view.lyricsLine`, `i18n.ts:825`) still explaining the colours. Coherent. Fine.

**Item 4, Not this poem.** Poem empties, colours clear, "Poem removed." with Undo. Good. Two gaps. First, the brief promises that colours clear but not that Lyrics is restored: a poem arrival re-lines Lyrics into the poem's line breaks (`+page.svelte:2372-2375`, `adoptPoemLines` calls `handleInput(laid, how)`), and the design says a poem repairs sung words ("the dotted underline on a repair, Revert", design §scenario 7). Whether a decline undoes those is not stated. Amendment 3. Second, the decline is stored "across sessions" while its Undo lasts only until she leaves the song. A mistaken tap, then a song switch, and the poem can never be offered for that song again, not even when she drops the score again. The design said "holds the dismissal for the session" (design §scenario 3). In build 1 the match runs only on a Lyrics fill into an empty Poem, never on opening a stored song, so a stored decline does nothing for her except block a re-drop, and the code's own precedent treats a re-drop as the singer's act that fills (`+page.svelte:2819-2824`). Amendment 5.

**Item 5, she ignores the card.** The poem stays, the card waits. Fine, with one gap: if she edits the poem (item 6) the card still asks "Keep it?" about a text that is now hers, and "Not this poem" would then delete her edits. An edit is an answer. Amendment 6.

**Item 6, she edits.** "Based on …" is right and honest.

**Item 7, her own poem wins.** The replace guard (`+page.svelte:2391-2403`, `askToReplace` :2436-2449) asks "Replace the poem? … POEM already holds one. Ilya cannot undo its replacement." (`i18n.ts:840-841`). She did not put that poem there, and the question is about losing something of hers. For an unedited library poem the question is noise, and a mistaken "Keep the poem" loses her own page. Amendment 9.

**Item 8, nothing later.** Right. One hole in the code path: `claimDerivedPoem` (`+page.svelte:2348-2357`) calls `handleInput(derivedPoem)` with the default `how` of `'paste'` (:2365) on her first keystroke into a derived poem box, so a hook inside `handleInput` on `how === 'paste'` would run the match on typing. Amendment 11.

**Edge moments.**

- *Two Lermontov «Молитва».* Different works (`f1a88510` «Я, Матерь Божия…», `cc7237d9` «В минуту жизни трудную»); the card's first line tells them apart. Fine. But `f1a88510` has two entries, pre-reform (451 letters) and modern (459), near-identical. Which entry wins decides whether the card says "in modern spelling" and which `textModern` fills. The brief does not say. Amendment 10.
- *Phone.* Heading, three lines, two buttons above a textarea in the drawer; workable. The colours line is the one that wraps to two or three lines on a phone, and under LYRICS it repeats `lyricsLine`, which sits under the same field. Taste point for Dann in the strings section.
- *Screen reader.* "One group with a name" is right. Moving focus to a button on an arrival that follows an async fill is the problem: after a paste into LYRICS her caret is in the textarea; the match fires; focus jumps to the card; her next Enter or Space activates a button. Amendment 4.
- *She is on LYRICS when the card appears.* Always, for all three arrivals (`+page.svelte:2829`; a paste into Lyrics is in Lyrics). Amendment 2.
- *A cycle PDF.* The score divides by the query's letters (`reference_sw_match.py:17`), so one library poem inside a five-song Lyrics scores about one fifth of its whole-song score, which can clear 0.15 and, if no second cycle song is in the library, the margin too. Then one song's poem fills Poem for the whole cycle and four songs' words colour as departures. The brief says nothing about a multi-song Lyrics; the design says "build 0 is one song per drop" and "the match is per song" (design §What the library is). Amendment 12.
- *Offline.* Stored under `poems-<poemHash>` and read from IndexedDB: fine. A first-ever visit offline has no file and no card, silently; acceptable and stated.
- *Poem file not yet downloaded.* The file is fetched after the app is interactive (step 2). If she drops a scan in the first seconds, "a missing poem file leaves the app as it is today": no card, and the same scan on the next visit gets one. The scan takes longer than a 100 KB fetch; the match can wait for the fetch instead of skipping. Amendment 13.
- *A wrong poem filled and she ignored the card.* The card still waits, so she can still decline. But if she clears Poem with its existing Clear (`+page.svelte:3976`, `onclearpoem={() => (doc.publishedPoem = '')}`), `poemSource` is untouched and the quiet line would name a poem under an empty field. Amendment 6.

## Amendments

1. **The card shows the first line of the matched stretch, not the poem's incipit, when they differ.** Reason: for an excerpt of a long poem she recognizes her song's first line, not the poem's; fixture S matches «Мцыри» at 0.862 and would show a title and first line that are not on her score. Evidence: `expected_r1.txt:2`; `library.json` entry `c1964bc3bd` (incipit «Немного лет тому назад,», 15,173 folded letters) against S's 260 query letters. Cost: the brief's Smith-Waterman gives only the best score; the start of the stretch needs a traceback or a second pass over the reversed strings, in the pure module of step 3. Separately for Dann, a data question, not a code one: whether an entry for a passage of a long narrative poem is the passage or the whole poem (after Keep it, S's Poem holds 15,173 letters, and the omission greying covers nearly all of it). NOT ESTABLISHED which build song S is.

2. **The card shows above the field in whichever view is showing, until answered, and so does the "Poem removed." line.** Reason: the poem is in POEM and she is on LYRICS after every arrival; she must be able to look at the poem and then answer. Evidence: `+page.svelte:2829` with `input-views.svelte.ts:85-88`; brief step 5 "the card shows above the field in that view".

3. **Not this poem and Undo restore Lyrics byte for byte, and the step 6 test asserts `doc.inputText` before the fill equals `doc.inputText` after the decline.** Reason: a poem arrival rewrites Lyrics' line breaks and, per the design, repairs words; clearing Poem does not by itself put them back, and the brief promises only that colours clear. Evidence: `+page.svelte:2372-2375` (`adoptPoemLines` → `handleInput`); design §scenario 7; `text/relining.ts` not in the upload, so whether an emptied Poem re-lines back is NOT ESTABLISHED. The brief's "the tiers, and Revert work unchanged" names code not found on the tree read (search of `+page.svelte`); step 0 names what a Poem arrival does to Lyrics on `origin/Shane` today, and step 5 reverses all of it on decline.

4. **No focus move when the card arrives.** The card is `role="group"` named by its heading, placed before the field in tab order, and its heading is announced through an `aria-live="polite"` region; focus moves only when she tabs or taps. Reason: the card follows an async fill while her caret may be in the textarea, and a stolen focus turns her next Enter into a button press. Evidence: brief step 5 "Focus goes to the card's first button"; the dialog precedent focuses only inside a modal it opened (`+page.svelte:2442-2448`).

5. **Hold a decline for the session, per song, not in the record; drop `poemDeclined` from `SongRecord` in build 1.** Reason: build 1 never fills on opening a stored song, so a stored decline never spares her a nag; it only blocks a re-drop, which the code treats as her act, and it outlives its own Undo. The design's wording is "for the session". Evidence: brief step 4 rules "never when a stored song is opened"; `+page.svelte:2819-2824`; design §scenario 3. Keep it in memory beside `inputViews.#memory` (`input-views.svelte.ts:46`). Build 2 (offers on stored songs) can add the stored list when it has a use.

6. **Three transitions the brief must state.** An edit to Poem sets `edited` and `answered` (the card folds to the based-on line). Poem's existing Clear sets `poemSource` to `null`. Undo restores the state before the tap: the poem, `poemSource`, and the card if it was unanswered. Reason: otherwise "Not this poem" can delete her edits, and the quiet line can name a poem under an empty field. Evidence: `+page.svelte:3976` writes `doc.publishedPoem = ''` without passing through `handlePoemEdit`.

7. **A translator slot in the card and both source lines.** EN: "{author}, translated by {translator}" where `translator` is set. Reason: the Heine entry's Russian text is Tyutchev's, and her score names Tyutchev. Evidence: `library.json` entry `419e40dd3c` (`author` «Генрих Гейне», `translator` «Фёдор Иванович Тютчев»); step 1 already carries `translator` in the file.

8. **State what `{author}` prints.** DESK DEFAULT candidate: the data's `author` field as it stands (the full name), with no surname derivation in code. Reason: the walk shows «Кольцов», the data holds «Алексей Васильевич Кольцов», and a derivation would break on names like «Голенищев-Кутузов». Evidence: `library.json`, every entry.

9. **The replace guard does not ask when Poem holds an unedited library poem (`poemSource` set, `edited` false).** Her page replaces it without a question; the guard asks as today when `edited` is true or `poemSource` is null. Reason: the guard protects a poem she filled; this one she did not, and a mistaken "Keep the poem" loses her own page. Evidence: `+page.svelte:2391-2403` (`held: doc.publishedPoem`); `i18n.ts:840-843`.

10. **Which entry of a work fills.** The best-scoring entry; on a tie within 0.01, the `modern` entry. Reason: `f1a88510` has a pre-reform and a modern entry 8 letters apart, and the choice decides the card's "in modern spelling". Evidence: `library.json` entries `298e556367` and `6b51c54db7`.

11. **Hook the match at the three arrival sites, not inside `handleInput`.** The file fill at `+page.svelte:2829`, the Lyrics paste through `handlePoemInput` (:2360-2363, when `how` is a paste), and the scan's site that step 0 names. Reason: `claimDerivedPoem` (:2348-2357) calls `handleInput(derivedPoem)` with the default `how` of `'paste'` (:2365) on a keystroke. Also re-check at fill time that `doc.id` is the song the match started on and Poem is still empty, because the match awaits the poem file (amendment 13) and she may have switched song or pasted her own poem meanwhile.

12. **A multi-song Lyrics gets no fill.** DESK DEFAULT candidate, measured not tuned: fill only when query letters ≤ 3 × the top entry's letters. On the twelve fixtures the ratio runs from 0.017 (S) to 1.46 (r114-song2: 414 query letters, 284 poem letters), so the guard changes no expected result; a five-song cycle with one library poem sits near 5. Reason: the score divides by the query's letters (`reference_sw_match.py:17`), so one poem inside a cycle can pass 0.15 and fill Poem for all five songs. Evidence: `expected_r1.txt`; letter counts from `library.json` this session. The brief states the cycle behaviour either way.

13. **The loader exports the poem library as a promise, and the match awaits it.** `loader.ts` resolves it after the background fetch (or the IndexedDB read), `null` on failure; `cleanLegacyCache` takes the poem hash as a second argument. Reason: `cleanLegacyCache(currentHash)` knows only the dictionary hash (`loader.ts:296`, called at :730), and the page has no handle on a tier scheduled inside `loadDictionary` (:790). Step 2 as written leaves both unsaid.

14. **Name the six places a stored field lives.** `SongRecord` (`types.ts`, optional and additive, as `publishedPoem` at :199), `SongFields` (`library.ts:70`), `fieldsFromRecord` (:104), `recordFromFields` (destructure out of `base` at :121 and write only when set, :141), `validateRecord` (:264-265), and the document's `$state`, `#snapshot` (`document.svelte.ts:296`), and `#apply` (:351). `RECORD_SCHEMA` stays 1. Reason: `validateRecord` copies only fields it knows, so a field missed there is dropped on every load and the card comes back; a field missed in `recordFromFields` rides along in `...rest` from `base` and never updates. Also say what the quiet line shows when the library has no entry for the stored `work` (file not loaded, or a later library dropped it): fall back to `poemLine`, never drop attribution silently into a blank. CONTRACT §8 ("Do not store anything derived", `CONTRACT.md:144`) argues against storing title and author in the record, so the lookup is by `work`.

15. **`introLine` takes `poemSource` and returns the quiet or based-on line in the Poem view only.** Under Lyrics, `lyricsLine` stands. Reason: the brief says "while `poemSource` is set, else today's lines" without naming the view, and walk item 3 puts the line "under Poem". Evidence: `input-line.ts:12-16`.

## Strings

**English (revisions).**

| key | brief | revision | why |
|---|---|---|---|
| `intake.poemLibrary.cardHeading` | Ilya found this poem for your song: | keep | plain and warm |
| `intake.poemLibrary.cardSource` | From {site}, in modern spelling. | keep | Dann's decision 3 |
| `intake.poemLibrary.cardColours` | Coloured words in LYRICS show where the song departs from the poem. | keep, or drop (taste, for Dann) | under LYRICS it restates `lyricsLine` one field away (`i18n.ts:825`); on a phone it is the line that wraps |
| `intake.poemLibrary.keep` | Keep it | Keep this poem | names the thing for a screen reader; parallel with "Not this poem" |
| `intake.poemLibrary.notThis` | Not this poem | keep | |
| `intake.poemLibrary.by` | (none) | {author}, translated by {translator} | amendment 7 |
| `intake.view.libraryPoem` | {author}, «{title}», from {site}. | keep | |
| `intake.view.libraryPoemEdited` | Based on {author}, «{title}», from {site}. | keep | |
| `intake.poemLibrary.removed` | Poem removed. | keep | |
| `intake.poemLibrary.undo` | Undo | keep; `clitic.undo` already pairs Undo with « Annuler » (`i18n.ts:407`) | |

Button order: the brief puts Keep it first. The dialog's rule is "the last answer is the safe one" (`+page.svelte:2427`, :2434). Whether that rule covers a non-modal card is taste, for Dann; the brief states which it follows.

**French (suggestions for Dann, not final).**

- « Ilya a trouvé ce poème pour votre chant : » reads well; « chant » is the file's word (`replace.keep`, `i18n.ts:1663`).
- « Tiré de {site}, en orthographe moderne. » reads well. `{site}` in French is open, as the brief says («Wikisource en russe»).
- « Les mots en couleur du champ PAROLES montrent où le chant s'écarte du poème. » The ratified `landedLyrics` renders "where the song departs" as « où la mise en musique s'en écarte » (`i18n.ts:829`). Suggest « … montrent où la mise en musique s'écarte du poème. » for one term per concept.
- « Le garder » → « Conserver ce poème », because the file's ratified word for Keep is « Conserver » (`intake.poemReplace.keep` :843, `replace.keep` :1663).
- « Pas ce poème » reads well.
- « {author}, traduit par {translator} » for amendment 7, if adopted.
- Nested guillemets around a Russian title: open, as the brief says. An alternative that avoids nesting: « {author}, {title}, tiré de {site}. » with the title unquoted, since the field above shows it.
- « D'après … », « Poème retiré. » (consistent with `intake.clear` « Retirer », :875), and « Annuler » (:407) read well.

Terms: the brief adopted « poème », « chant », « les mots en couleur », « le champ PAROLES », « s'écarte » from the file and coined « Tiré de », « en orthographe moderne », « Le garder », « Pas ce poème », « D'après », « Poème retiré ». This review coins nothing in French; « Conserver » and « la mise en musique » are the file's.

## NOT ESTABLISHED

- Whether a Poem arrival on `origin/Shane` repairs Lyrics words or only re-lines them (`text/relining.ts` and any tier or repair code are not in the upload; the design describes repairs).
- The values of `TextArrival` and which one `IntakePanel` passes for a typed key versus a paste (`lib/one-action.ts` and `IntakePanel.svelte` not in the upload).
- Where the scan (reader) path fills Lyrics; `+page.svelte` has no `ocr` or reader site in the range searched. Step 0 names it.
- Whether `lyricsTakesPoem` returns false for a non-empty Lyrics (not in the upload); the fill through `handlePoemEdit` depends on it (`+page.svelte:2388`).
- Which build song fixture S is, and whether any build song sets an excerpt of a long poem other than S.
- Whether Dann ruled the button order or only chose the card.
- `docs/house-style/interface-text.md` is not in the upload; the strings were checked against `SKILL.md` and `i18n.ts` only.
- The cost of diffing a 15,173-letter poem against Lyrics on a phone.

Cost: about 60k tokens.
