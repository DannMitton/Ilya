# Report: integration step 4, row 172 (TEXT follows INPUT's Poem | Lyrics pill), 2026-11-09

Branch `cloud-lane-38`. Brief `brief-code-row172-finish_r2_2026-11-05.md`, its "Amendments" winning, except its step 0's branch: row 172's five commits are cherry-picked onto this branch, not a branch `cloud-lane-36`. Nothing pushed to `Shane` or `main`, no pull request, `docs/memory/` untouched. **Playwright not run** (the desk's order of 12:4x). The brief's step 0 and step 4 asked for both projects; that order supersedes them, so the phone test "bb" below is **not verified by me**.

## What was done (the commits on this branch)

| Brief step | Commit(s) |
|---|---|
| step 0, the pick | `07868671`, `0a2d4303`, `e691201e`, `a65f36c7`, `ddb29c01` (the lane's `c4584256`, `3c7a93ae`, `e3598327`, `5628f270`, `89357814`, in order) |
| steps 1 and 2 | `192df457` |
| step 3 | `67033c4d` |

## Step 0: the conflicts, each and how I resolved it

The pick stopped three times.

| Pick | File | Resolution |
|---|---|---|
| step 1 (`3c7a93ae`) | `scripts/ratchets.json` | Context only: the lane's lowered ceilings against this branch's. Kept this branch's values (HEAD). No ceiling raised. |
| step 2 (`e3598327`) | `apps/web/src/routes/+page.svelte` | HEAD had `{#if witnessDiffer}<TextWitnessPair {language} witness={shown} onchoose={(w) => inputViews.chooseWitness(doc.id, w)} />{/if}` then `<Paper … witness={shown} …/>`; the lane had `<Paper …>` without `witness`. **Kept HEAD's `<Paper … witness={shown} …/>`, deleted the `TextWitnessPair` line**, as amendment A1 says. |
| step 2 | `scripts/ratchets.json` | As above, kept HEAD. |
| step 3 (`5628f270`) | `apps/web/src/routes/+page.svelte` | HEAD: `<Paper … witness={shown} …/>`; the lane: `{#if witnessDiffer}<TextSourceLine {language} witness={shown} />{/if}` then `<Paper …>` without `witness`. **Kept the lane's `TextSourceLine` line first, then HEAD's `<Paper … witness={shown} …/>`**, as A1 says. |
| step 3 | `apps/web/src/lib/i18n.ts` | The header total: HEAD `1,147 keys` (row 181 added to Shane's count), lane `1,121`. Neither is right now: **`1,149`** (1,147 plus the two `text.source.*` keys). `i18n-index.test.ts` passes with it. The key index line for `text.` (2 keys) came from the lane unchanged. |
| step 3 | `scripts/ratchets.json` | Kept HEAD. |

**What each `+page.svelte` line does** (read in the resolved file and in `Paper.svelte` / `TextSourceLine.svelte`):
- `<TextSourceLine {language} witness={shown} />`, shown only while `witnessDiffer` (the two texts differ), renders `<p class="text-source" id="text-source">` with `text.source.poem` or `text.source.lyrics` (`TextSourceLine.svelte:23`): the quiet line above the sheet. It is text, not a control, and does not print.
- `<Paper … witness={shown} …/>`: Shane's line (from the "Text header names the text" work). `Paper.svelte` takes `witness` (`:34`, default `'lyrics'`) and passes it on to the page's header and running head (`:181`, `:204`), so the header says TEXT: POEM or TEXT: LYRICS. Both lines stay (the Guide sentence Dann ratified names "a line above the page").
- `<TextWitnessPair …/>` (deleted): the choice control on TEXT. INPUT's pill is now the one chooser.

**A2 (ratchets).** The brief said set `+page.svelte` to Shane's 5586. I did not: this branch's value after step 2 is **5549** (lower, from row 181's own lowering), and raising a ceiling is forbidden. `+page.svelte` is 5534 lines now (see below).

## Step 1: the quiet pause for POEM (amendment A4)

**Where Lyrics's pause is, and what I reused.** The one timer is `quietTimer` (`apps/web/src/routes/+page.svelte`, the `let quietTimer` after `transcribeWhenDictionaryReady`), scheduled in `joinText` with `QUIET_MS` (`one-action.ts:41`, 600 ms). I wrote no second timer.

**What I built** (all in `+page.svelte` unless stated):
- `let settledPoem = $state<string | null>(null)`. `null` means "Text follows the live poem". `poemLines` and `mutedWords` read `settledPoem ?? doc.publishedPoem`.
- `poemWaitsForPause(how)` in `one-action.ts`: true for `'typing'` only. It is the rule, pinned by a test, because a rule inside a `.svelte` file cannot be (`one-action.ts` says so of itself).
- `settlePoem(how, held)`, called last in `handlePoemEdit`: for a typed key it takes `held` (the settled poem, or the poem before the first key) on the one `quietTimer`; for any other arrival it clears `settledPoem` at once. `held` is read at the start of `handlePoemEdit`, before any cancel can run. It runs last so that `if (quietTimer) joinText(how)` (a pending Lyrics pause) cannot cancel it.
- `settledPoem = null` is added on the existing `quietTimer = null;` lines in `joinText`'s callback and in `cancelQuietTimer`. So whoever's timer fires or is cancelled (a song switch calls `cancelQuietTimer`), Text follows the live poem again, and the join is asked again as before (`joinText('paste')`).
- `witnessDiffer` and the source line stay on the live `doc.publishedPoem`, as A4 says.

**Room under the ceiling.** `+page.svelte` was at its ceiling (5549 of 5549). Before adding anything I moved `scrollToAnchor` (31 lines, reads no page state) verbatim to `apps/web/src/lib/scroll-to-anchor.ts`, with a header comment. The page is now **5534**, so this step added 15 net lines. The ceiling stays 5549; I did not lower it (ratchets offers 5534), to keep the headroom for steps 5 and 6.

**The other places that time or trigger a rebuild of TEXT, and whether they agree:**
1. `joinText` / `quietTimer` (Lyrics typing): the one timer; agrees, and now also settles a typed poem.
2. `adoptPoemLines` (`+page.svelte`, after `lastLaid`): called from `handlePoemEdit`, for the typed key too. It re-lays **Lyrics** into the poem's lines (`handleInput(laid, how)`), at once, not Text's poem witness. Not paused by this step. The "bb" test asserts Lyrics is laid out after the pause; I did not read `lyricsInPoemLines` to establish whether it lays out per key. NOT ESTABLISHED.
3. `poemOffer.onPoemEdit` (`text/poem-offer.svelte.ts:134`): calls `poemJoin.schedule()` for every edit but boot. `PoemJoin.schedule` uses **its own** 600 ms timer (`poem-join.svelte.ts:76`, `JOIN_PAUSE_MS` at `:33`), not `quietTimer`. It agrees in length (both 600) but is a second timer. I did not touch it (the brief says reuse; this is row 181's, and it acts on Lyrics, not on the poem witness). A typed poem on a scan therefore still schedules the join per key, as before.
4. The dictionary-ready effect (`+page.svelte`, the `$effect` after `joinText`): spends `transcribeWhenDictionaryReady` with `joinText('paste')`. Agrees (not a typing path).
5. `transcribeText` (`+page.svelte`, the function): the one transcription for Lyrics; reached by `joinText` ('now') and by nothing for the poem witness, whose lines come from `witnessLines` through the `poemLines` derived.

**The one-pause blank on the first differing key (reported, not fixed, as A4 says).** With Lyrics holding text and Poem empty, the first typed key makes `poemHas` true; `held` is the empty string; so `poemLines` is `[]` for one pause, and TEXT shows the poem witness blank until the timer fires. I read this from the code; I did not see it in a browser.

**Test.** `one-action.test.ts` (+2): a typed key waits and `transcribeVerdict` agrees ('soon'); a paste or boot restore does not. The page wiring (that `handlePoemEdit` calls `settlePoem`) is not unit-pinned; the phone test "bb" is the check, and I did not run it.

## Step 2: the stale tests (amendment A5)

`apps/web/e2e/text-header.test.ts`: the pair click became `#intake-tab-poem`; the no-pair check became `#text-source` count 0; state 4's setup taps `#intake-tab-lyrics` after the poem (the helper `put` taps the pill, so the INPUT view ends on POEM otherwise). I also renamed two state names ("the pair on LYRICS/POEM" to "INPUT on LYRICS/POEM") and the header comment, since the pair is gone; **no assertion about the header changed**. These end-to-end tests were **not run**. `grep` finds no remaining `text-tab-poem` or `TextWitnessPair` under `e2e`, `e2e-phone`, or `src`.

## Step 3: the ratified French (amendments A6, A7, A8)

- `text.source.lyrics` FR « D’après PAROLES »; `text.source.poem` FR « D’après POÈME » (U+2019). The `TODO-FR` comment in `i18n.ts` is replaced by a note that Dann ratified it 2026-11-05 08:10.
- `GuideContent.svelte`, the poem-and-lyrics paragraph: the last two sentences, EN and FR, exactly as in the brief ("transcribes" / « transcrit »), the FR colon as a literal U+00A0 byte (the brief's bytes). The old « choisissez Poème dans l’onglet Texte » sentence and the `TODO-FR` comment are gone.
- Pins: `insights/ratified-lines.test.ts` row 123 block (+2: EN, and FR with the literal U+00A0, and a check the old « l’onglet Texte » is gone); `components/text-source-line.test.ts` (+1: the French line for both witnesses).
- Source check: I compared the Guide text with the brief (which carries U+00A0). `docs/memory/OPEN.md` carries the same FR sentence with an ordinary space before the colon in its copy; the brief says the brief's text is authoritative, so I followed the brief's bytes. The desk may want to correct that copy.

## Gates (baseline on Shane, then this branch)

| Gate | Baseline | Now | Move |
|---|---|---|---|
| 1 phonology | 407 passed (407) | 435 passed (435) | +28, row 157 (unchanged by this step) |
| 2 dictionary | 248 passed (248) | 248 passed (248) | none |
| 3 web check | 0 errors and 12 warnings in 5 files | 0 errors and 12 warnings in 5 files | none |
| 4 web unit | 4198 passed, 1 skipped (4199) | 4455 passed, 1 skipped (4456) | +257: 249 before this step, +8 now: 5 are mine (+2 `one-action`, +2 `ratified-lines`, +1 `text-source-line`), and the other 3 are the lane's net (its new tests less the tests the removed pair took with it; derived by subtraction, not itemised) |
| 5 score-parser | 785 passed, 5 skipped (790) | same | none |
| 6 blurb | 148 passed (148) | 164 passed (164) | +16, row 157 (unchanged by this step) |
| 7 integration | 125 passed (125) | 125 passed (125) | none |
| 8 ratchets | OK. | OK. (685 source files) | none. It offers `+page.svelte` 5549 to 5534 now, besides the five Shane-own lowerings; I lowered none |

## What a singer would now see (that she did not on Shane)

1. **TEXT follows the Poem | Lyrics pill in INPUT.** Tapping POEM in INPUT makes TEXT transcribe the whole poem as published; tapping LYRICS returns it. The choice control that used to sit on TEXT (the pair) is gone.
2. **A quiet line above the sheet names the source** («From LYRICS» or «From POEM»; French « D’après PAROLES » or « D’après POÈME »), shown only while the two texts differ. It does not print.
3. **The page's header still says TEXT: POEM or TEXT: LYRICS** (unchanged).
4. **Typing a poem does not make TEXT rebuild on every key.** TEXT takes the typed poem after the same 600 ms pause Lyrics typing waits for. On the first key into an empty Poem, TEXT may show blank for one pause (read from the code, not seen).
5. **The Guide's poem paragraph** ends with the ratified two sentences (English and French) in place of the old ones, which pointed to a control the app no longer has.

## What I could not establish

- **Any browser behaviour, including the phone test "bb"** (`e2e-phone/relining.test.ts`) that this step's pause is meant to turn green. It was red on Shane in step 1's list; whether it is green now is NOT ESTABLISHED until the Playwright run after step 7.
- **Whether `adoptPoemLines` lays Lyrics out per key** (item 2 above), which the "bb" test also watches.
- **That the lane's red-on-Shane tests moved.** Not run.
- **The 3 unitemised tests** (the lane's net).
- **Whether the lane's French `OPEN.md` copy** (ordinary space before the colon) is meant to stay.
