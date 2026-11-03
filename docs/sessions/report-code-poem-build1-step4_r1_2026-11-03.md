# Report: poem library build 1, step 4, the fill and the song's memory (Code cloud lane, r1, 2026-11-03)

Brief: `brief-code-poem-library-build1_r3_2026-11-03.md`, step 4. Branch `cloud-lane-31`, on top of step 3's `ec5ba13`. Earlier reports: `report-code-poem-build1-step0_r1_2026-11-03.md` to `-step3_`.

## Findings first

**1. `routes/+page.svelte` is now at its ceiling: 5,586 lines of 5,586 (`scripts/ratchets.json:8`).** It was 5,585 at step 0. The one new line is the import of the controller. Every other hook rewrote an existing line. **Step 5 cannot add a line to `+page.svelte`.** The card, the lines, and the buttons must live in the Input components, reading the controller's singleton (as `IntakeViews.svelte` already reads `inputViews`). I will do that, and I will not raise the ceiling; a raise is Dann's call.

**2. The library's text ends with a dating line in three entries, and the brief's stanza rule would have called a whole poem a passage.** `textModern` of «Весёлый час» ends `...Видит заря!\n\n1830`; of «Молитва» (modern) `...\n\nФевраль 1837`; of «Русская песня» `...\n\n8 декабря 1840Москва` (read from `tools/poems/library.json`). Row 114 song 2 sets «Весёлый час» from its first stanza to its last verse, but its stretch ends before «1830», so the plain rule cut to "the stanzas holding the stretch" and left the dating line out: a partial cut, and step 5 would then have printed "a passage beginning..." on a song that sets the whole poem. The brief's walk (step 6) expects no passage wording there. **I made trailing dating lines not count as a stanza the song left out** (`bodyStanzas` in `text/poem-source.ts`): one line, a four-digit year, four words or fewer. **DESK DEFAULT (mine), reversible.** A song that sets the whole poem fills the whole `textModern` verbatim, dating line included, as the brief says. **Question for Dann (taste):** should the dating line be in Poem? It is the source's text, and it will show as a word the song does not sing. I have left it in, as the brief reads.

**3. Three other defects in the library text, which I did not touch** (the data is the desk's; step 1 ships it verbatim):
- «Русская песня» ends `8 декабря 1840Москва`, with no break between the year and the place.
- «С чужой стороны» (`419e40dd3c`) has a left-to-right mark (U+200E) at the start of its last block.
- «На севере диком стоит одиноко» (`cb6998d772`) opens its text with `ИЗ ГЕЙНЕ.` as a first line, inside the poem.

**4. Step 0 said `nameFor` was NOT ESTABLISHED. Established now:** `lib/library/songs.ts:54` names an unnamed song from the poem's first four words when Poem is not empty (`record.publishedPoem?.trim() ? record.publishedPoem : record.poem`). A library fill into an unnamed song can therefore name it. The order in the page makes this moot on every path I read: a Lyrics paste names the song at its first `handleInput`, before the match returns, and a file or scan names it from its header or file name before the fill (`+page.svelte`, step 0 section 1). I did not run an unnamed-song case.

**5. Step 2's export gained a field.** `poemLibrary` now resolves to `LoadedPoemLibrary`, the library plus `hash`, because `poemSource.poemHash` has to be written at fill time and nothing else knew it. Step 2's tests were updated (`poem-library.test.ts`, `loader-poems.test.ts`).

## What was built

| File | Change |
|---|---|
| `lib/text/poem-source.ts` | new, 142 lines, pure: `stanzas`, `bodyStanzas`, `stanzaCut`, `lineAt`, `resolveSource`, the transitions, `replacesLibraryPoem` |
| `lib/text/poem-offer.svelte.ts` | new, 244 lines: `PoemOffer` and the singleton `poemOffer` |
| `lib/library/types.ts` | `PoemSource`; `SongRecord.poemSource?` |
| `lib/library/library.ts` | `SongFields.poemSource`; `fieldsFromRecord`; `recordFromFields`; `validateRecord` |
| `lib/library/document.svelte.ts` | the `$state`, `#snapshot`, `#apply` |
| `lib/text/poem-library.ts`, `lib/loader.ts` | the `hash` (finding 5) |
| `routes/+page.svelte` | 8 call sites, net +1 line |
| tests | `poem-source.test.ts` 25, `poem-offer.test.ts` 40, `poem-offer-wiring.test.ts` 6, `document-poem-source.test.ts` 4, `library.test.ts` +10 |

## The six places a stored field lives (amendment 14)

All six name `poemSource`. `RECORD_SCHEMA` stays 1 (a test pins it).

1. `SongRecord`: `types.ts`, optional and additive, as `publishedPoem` (`:199`).
2. `SongFields`: `library.ts`.
3. `fieldsFromRecord`: `library.ts`; `record.poemSource ? { ...record.poemSource } : null`.
4. `recordFromFields`: dropped out of `base` in the destructure, written only when set.
5. `validateRecord`: the one shape or nothing. A source the card could not have written (empty `id`, `work`, or `poemHash`; a negative or fractional `start`; `end` not after `start`; a non-boolean flag) is `malformed`, is not carried, and **the poem stays** (a test checks ten bad shapes).
6. `SongDocument`: the `$state`, `#snapshot`, `#apply`. Mutation checks: removing the line from `#snapshot` fails 1 test, from `#apply` fails 3.

The title and the author are not stored (`CONTRACT.md:144`, and the brief): a test checks the stored keys are exactly `answered, edited, end, id, poemHash, start, work`. `resolveSource` looks the entry up by `id`, else by `work` (the modern entry), and trusts the stored offsets only for the file they were cut from (`poemHash` equals the library's); otherwise it falls back to the entry's incipit and does not say passage. When the library has no entry of the work, it returns `null` and step 5's `introLine` falls back to `poemLine`.

## The fill (what, when, and through which path)

`poemOffer.offer(text)` (`poem-offer.svelte.ts`):

1. Before anything: the open song can be written, Poem is empty, and the song has no source.
2. It awaits `poemLibrary` (`null`: stop).
3. `matchPoem` (step 3); no match: stop.
4. **It checks again, because the singer can have acted while the library loaded:** the song is still the one that asked (by id), Poem is still empty, there is still no source, this work was not declined for this song, and the Lyrics' letters equal the matched text's letters (`foldLetters`; the line breaks may differ).
5. The text is `stanzaCut(textModern, start, end)`: the whole stanzas holding the matched stretch, or the whole poem verbatim when they are all of the poem's stanzas (finding 2).
6. The fill goes through `handlePoemEdit(text, 'paste')`, the path a pasted poem takes (`+page.svelte`, the `put` the page lends), so differences and omissions work unchanged.
7. Before it, `doc.inputText` and `lastLaid` are kept in memory.
8. After it, `doc.poemSource = { id, work, poemHash, start, end, answered: false, edited: false }`, with `start` and `end` the stanza cut.

**The sites.** All hook at an arrival, never inside `handleInput` (amendment 11); `poem-offer-wiring.test.ts` reads the page and fails if `poemOffer` appears in `handleInput`, `claimDerivedPoem`, `adoptPoemLines`, or `joinText`, and checks the two calls. With the line each is on at the end of this step (`+page.svelte`):

- **A Lyrics paste into an empty field**, `handlePoemInput`: `const wasEmpty = doc.inputText.trim() === ''` before `claimDerivedPoem()`, then `if (wasEmpty && how === 'paste') void poemOffer.offer(text)` after `handleInput`. **A typed key never offers. An undo, a redo, or a blur-tidy of a Lyrics that was not empty never offers**, because `wasEmpty` is false (the hazard in step 0, section 1).
- **A file's or a scan's words**, the `fillText` line in `applyArrival`: `void poemOffer.offer(fillText)`. It inherits that line's gate: `origin === 'upload'`, Lyrics empty, the score carries words. **A restore never offers** (a stored song reopened); a test pins the gate text.

**Session declines are per song and work**, kept in a set in memory, beside `inputViews`' memory in spirit. Nothing about a decline is stored.

## The transitions (amendment 6) and the guard (amendment 9)

| Event | Where | Effect on `poemSource` |
|---|---|---|
| Keep this poem | `keep()` | `answered: true` |
| A typed key in Poem | `handlePoemEdit` calls `onPoemEdit` | `edited: true`, `answered: true` |
| Poem emptied by hand | `onPoemEdit` | `null` |
| A paste in Poem that shares no run of 20 letters with the poem | `onPoemEdit`, `replacesLibraryPoem` | `null` (her own poem) |
| A paste in Poem that does share one (a typo, an added or deleted line, a variant) | same | `edited`, `answered` |
| Poem's Clear | `onclearpoem` calls `onClear` | `null` |
| A poem page | `handlePoemPage`'s `put` calls `onReplace` | `null` |
| The replace guard | `heldForGuard` | tells `routePoemPage` Poem is empty when `poemSource` is set and not `edited`, so it does not ask |

The 20-letter run is the answer to the step 0 question about a paste into the Poem field being both an edit and a replacement (step 0 section 8, item 3). **DESK DEFAULT (mine), reversible:** `RUN` in `poem-source.ts`. A paste into the Poem field has no guard today (`IntakeViews.svelte:190`), and still has none; walk item 7 already held there.

## The decline (walk item 4), exactly

"Not this poem" (`decline()`), on an unanswered card only:

- records the decline for this song and work;
- sets `poemSource` to `null` and Poem to `''` (as Poem's Clear does, directly);
- sets Lyrics back to the text kept before the fill, through the page's `handleInput`, only when it differs, and restores `lastLaid`;
- keeps what it undid, for the one Undo.

Tests (`poem-offer.test.ts`) show: on a scan-shaped song whose arrival re-lined Lyrics, `doc.inputText` equals the text before the fill **byte for byte** after the decline; `lastLaid` is restored; on a paste into an empty song, where the fill changes nothing in Lyrics, nothing is rewritten; Undo restores the poem, the source (unanswered, so the card is back), Lyrics as filled, and `lastLaid`; the same poem is not offered again for that song, and is offered for another song; another work still fills.

**"Poem removed." and Undo stand until she leaves the song, and only while nothing has changed under them.** `removedFor(songId)` is `null` once Poem is non-empty, a source exists again, or Lyrics differ from what the decline left; so Undo can never overwrite words she typed (two tests). `visit(songId)` clears the line when another song opens; step 5 calls it from `IntakeViews.svelte`'s song-open effect.

**A limit:** a decline made after a reload has no memory of the earlier Lyrics (the brief keeps them in memory only). Poem empties and Lyrics stays as stored; the fill only ever changed Lyrics' line breaks (`relining.ts`, step 0 section 2), so no words are lost. A test pins it.

## The walk, item by item (what each test shows)

| Item | Shown by |
|---|---|
| 1 sees a card | row 114 song 2 fills «Весёлый час» unanswered; the resolved source gives the title, first line «Дайте бокалы!», the full poet name, `Russian Wikisource`, no translator, not a passage; a Heine entry gives the translator. The card's rendering is step 5's. |
| 3 Keep | `answered`, poem and Lyrics unchanged, a second tap changes nothing, and "Not this poem" does nothing after it. |
| 4 Not this poem | above. |
| 5 ignores it | the stored source is unanswered and the poem stays; the reopened song shows the same source once the library has loaded; nothing is filled on the way. |
| 6 edits | a typed key, a pasted variant: `edited` and `answered`, and the source still resolves (the "Based on" line can name it); emptying ends it. |
| 7 her own poem wins | a poem page replaces an unedited library poem with no question; the guard still asks over her own poem and over an edited one; a pasted other poem and Clear end the source; her own Poem is never filled over. |
| 8 a passage | fixture S fills the stanzas of the fish's song only (under a twentieth of «Мцыри»), starting on a stanza, containing «Останься здесь со мной», not the first line of the poem; `resolveSource` says `passage` and its first line is `«Дитя моё,` (the data's own opening guillemet). |
| 9 nothing later | no fill: for a cycle of five songs; for a song with no poem in the library; over a Poem she filled or the library filled; if she changed the Lyrics, switched songs (another song with the same Lyrics included), or filled Poem herself while the library loaded; with no library; in a read-only song. |

Item 9's "no fill on typing" and "no fill when she reopens a stored song" rest on where the hooks are: the wiring test, and the gate on the file fill. A browser walk of both is step 6's.

## Controls (a rule broken, to see a test fail)

Removing, one at a time: the id re-check (1 test failed, after I added a second song with the same Lyrics; my first version of that test let it survive), the Lyrics re-check (1), the decline memory (1), the Lyrics restore (2), the Poem-empty re-check (3), the guard (1), the source-before-`put` order (4). A hook put inside `handleInput` fails 2 wiring tests. A `#filling` flag I first wrote was dead code (the source is null while `put` runs, so the page's edit hook reads nothing); I removed it and test the order instead.

## Gates after step 4

| Gate | Step 0 | Now |
|---|---|---|
| phonology, dictionary, blurb, score-parser | 407, 248, 148, 785 + 5 skipped | not rerun (no change in the packages) |
| web unit | 3898 + 1 skipped | **4043** + 1 skipped (step 3: 3958; +85) |
| integration (root) | 98 | 112 (step 1) |
| svelte-check | 0 errors, 12 warnings | 0 errors, 12 warnings (986 files) |
| ratchets | OK | OK (`+page.svelte` 5586 of 5586) |
| build | succeeded | succeeded |
| e2e | 82 passed, 8 failed | not rerun: no visible UI changed yet. Step 6 reruns it. |

## NOT ESTABLISHED

- A run in a browser: the controller's runes are inert in this suite (the class is plain assignment here), so the reactive reads that step 5's card depends on were not exercised. The svelte-check and the build pass.
- A scan end to end: homr is not run in this sandbox. The scan reaches the fill by the chain in step 0 (section 1); the fixtures stand in for what it writes.
- An unnamed song through the fill (finding 4).
