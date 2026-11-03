# Report: poem library build 1, step 5, the card and the lines (Code cloud lane, r1, 2026-11-03)

Brief: `brief-code-poem-library-build1_r3_2026-11-03.md`, step 5 and the singer's walk, items 1 to 8. Branch `cloud-lane-31`, on top of step 4's `fd7e997`. Earlier reports: `report-code-poem-build1-step0_r1_2026-11-03.md` to `-step4_`.

## Findings first

**1. The passage wording prints the first line of the stanza cut, not the desk's longer example.** Walk item 8 gives «Дитя моё, останься здесь со мной». The data's stanza opens `«Дитя моё,` on one line and `Останься здесь со мной:` on the next (the poem's own line break; `poem-source.test.ts` pins the line as `«Дитя моё,`). The card prints the first line, as the brief's step 5 says ("the matched stretch's first line, and for a passage the passage wording"), so it reads «Мцыри», a passage beginning «Дитя моё». I removed the data's own opening guillemet and the trailing comma (`cardLine`) so the card's marks are not doubled (`««Дитя моё,»`). **DESK DEFAULT (mine), reversible:** if Dann wants the longer line, it is a change to `resolveSource`'s `firstLine` (the first two lines of the stanza).

**2. In French the site prints in English: «Tiré de Russian Wikisource.»** The brief lists `{site}` in French («Wikisource en russe») as open for Dann. I did not choose; the data's `source.site` goes in as it is.

**3. `+page.svelte` was not touched in this step.** It stands at 5,586 of 5,586 lines. The whole of step 5 is in the Input components, which read the controller's singleton (step 4's finding 1).

**4. Nothing I wrote moves the singer's focus when the card arrives.** Measured in a browser: the field kept the focus after a paste. When she presses a button the button is removed, so the focus has to go somewhere that still exists; I chose, and say so under "Focus".

## What was built

| File | Change |
|---|---|
| `lib/components/Drawer/PoemLibraryCard.svelte` | new, 221 lines: the card, and the "Poem removed." line with Undo |
| `lib/components/Drawer/IntakeViews.svelte` | 471 to 487 lines: places the card before the field, tells the controller a song opened, fills the library lines |
| `lib/text/input-line.ts` | `introLine` takes the library state; `libraryLineOf`, `fillLibraryLine` |
| `lib/text/poem-source.ts` | `cardLine` |
| `lib/i18n.ts` | the 12 strings of the brief, English and French, marked as desk drafts; the index header (1,131 keys, `intake.` 48) |
| tests | `input-line.test.ts` +7, `poem-source.test.ts` +3, new `poem-library-strings.test.ts` 4 |

## The card (walk items 1, 2, 3, 4, 5)

Where: between the lines under the view pair and the field, in whichever view shows (`IntakeViews.svelte`; the card does not depend on the view). It stands while `doc.poemSource` is set and `answered` is false, so it is there on every visit to the song until she answers; reload brings it back because the source is stored (step 4).

What it says, in the order she wonders it (the order of the rows in the markup):

1. the heading, «Ilya found this poem for your song:»;
2. the title in guillemets, «Весёлый час»;
3. the first line of the cut in guillemets, «Дайте бокалы!», or, for a passage, «a passage beginning «Дитя моё»»;
4. the poet as the data's `author` prints it, the full name, with no surname derived, and "translated by …" only where `translator` is set (amendments 7 and 8; a test builds a Heine entry and checks the translator);
5. «From Russian Wikisource.», or «From …, in modern spelling.» when the entry's `spelling` is `pre-reform`;
6. «Coloured words in LYRICS show where the song departs from the poem.»;
7. the two buttons, **Not this poem** then **Keep this poem**.

**Accessibility** (read from the rendered page, desktop and phone):
- `role="group"`, `aria-labelledby` pointing at the heading's id; the group's name read back was «Ilya found this poem for your song:».
- The heading is also in a visually hidden `aria-live="polite"` region, which holds the heading text while the card stands and «Poem removed.» while the removed line stands.
- It is a `div`, so it adds no landmark.
- Tab order after the view tab: Not this poem, Keep this poem, the field. The card is before the field.
- No focus moves when it arrives.

**Touch geometry** (measured in Chromium with a coarse pointer): both buttons 44 px high; 32 px high on a fine pointer. "Not this poem" is 101 px wide and "Keep this poem" 109 px (English).

**Layout**: at 390 px wide the card wraps as the brief predicted: the colours line takes two lines and the buttons stay side by side (screenshot read; not committed).

## "Not this poem", "Poem removed.", and Undo (walk item 4)

Pressing "Not this poem" calls `poemOffer.decline()` (step 4). The card is replaced by one line, «Poem removed.» and an **Undo** button, in the same place, until she leaves the song or changes either text (step 4's `removedFor`). In the browser: Poem emptied; Lyrics equalled the text before the paste, byte for byte; Undo brought back the poem and the card. The song's `visit` effect (`IntakeViews.svelte`, beside `inputViews.open`) is what ends the line when another song opens.

## Focus (a choice of mine, reversible)

- After **Not this poem**, the focus goes to **Undo**, which has just appeared, so a keyboard singer can reverse it at once.
- After **Keep this poem** and after **Undo**, the focus goes to the active view's tab (`#intake-tab-poem` or `-lyrics`). It is always there, and it does not summon the on-screen keyboard on a phone, which a move into the textarea would.
- Measured: after Keep the active element was `intake-tab-poem` (the view she was on). After Not this poem the focus was on «Undo».

## The lines under the pair (walk items 3 and 6)

`introLine(view, landed, scoreWords, poemText, library)` (`text/input-line.ts`):
- In the POEM view only, with the card answered and the library holding the stored `work`, it returns `intake.view.libraryPoem` (kept as it was: «Алексей Васильевич Кольцов, «Весёлый час», from Russian Wikisource.») or `intake.view.libraryPoemEdited` (changed: «Based on …»).
- Under LYRICS, `lyricsLine` stands (amendment 15). Where the card is unanswered, where the poem is her own, or where the library has no entry for the work (not yet loaded, or a later library dropped it), `poemLine` stands.
- The Poem-empty line (`landedLyrics`) still comes first where Poem is empty.

Measured in the browser: after Keep, the POEM view showed «Алексей Васильевич Кольцов, «Весёлый час», from Russian Wikisource.»; the LYRICS view showed the ordinary line. After a typed key in Poem, the POEM view showed «Based on Алексей Васильевич Кольцов, «Весёлый час», from Russian Wikisource.» and the LYRICS view did not change.

## The strings

All twelve keys of the brief are in `i18n.ts`, English and French, exactly as the brief gives them, under a comment that says they are desk drafts, which words were adopted, which were coined, and the four choices open for Dann. `poem-library-strings.test.ts` holds each to the brief's table (the expected values are copied from the brief, not read back out of the table), checks that no other key sits under the two prefixes, that no em dash appears, and that both languages name the same placeholders. The French follows the OQLF table the suite already enforces (a no-break space before a colon, and inside guillemets); the existing test `every French value in i18n.ts follows the table` passes with them. The index test `i18n-index.test.ts` passes with the new count.

## Walk items, and what shows each

| Item | Shown by |
|---|---|
| 1 sees a card above the field | the browser run (paste of row 114 song 2: the card above the field, the field still focused), and step 4's controller tests for the data. The committed browser test is step 6's. |
| 2 the order of her questions | the markup order, read in the rendered text: heading, title, line, poet, source, colours, buttons. |
| 3 Keep folds it to one quiet line under POEM | browser run; `input-line.test.ts` for the line. |
| 4 Not this poem | browser run; step 4's tests. |
| 5 ignores it | stored `answered: false` shows the card again (step 4's test); the card's condition is that flag alone. |
| 6 edits | browser run («Based on …»); `input-line.test.ts`. |
| 7 her own poem wins | step 4's tests (no UI of its own). |
| 8 a passage | browser run on fixture S: «Мцыри», «a passage beginning «Дитя моё»», Михаил Юрьевич Лермонтов. |

## Gates after step 5

| Gate | Step 0 | Now |
|---|---|---|
| phonology, dictionary, blurb, score-parser | 407, 248, 148, 785 + 5 skipped | not rerun (no change in the packages) |
| web unit | 3898 + 1 skipped | **4057** + 1 skipped (step 4: 4043; +14) |
| integration (root) | 98 | 112 (step 1) |
| svelte-check | 0 errors, 12 warnings | 0 errors, 12 warnings (988 files) |
| ratchets | OK | OK (`+page.svelte` 5586 of 5586) |
| build | succeeded | succeeded |
| e2e | 82 passed, 8 failed | **not rerun in this step; step 6 reruns it, with the walk as committed browser tests** |

## NOT ESTABLISHED

- A screen reader's speech: the live region and the group's name were read from the DOM, not heard.
- Safari and Firefox: the browser checks ran in Chromium only.
- The card in the dark theme: the colours are the drawer's own tokens (`--sage-wash`, `--sage-head`, `--ink-*`), which the app redefines for dark; I did not look at it in dark.
- The browser runs above used a scratch script, not committed; the committed walk is step 6's.
- The card in French at a phone width: read as text, not measured.
