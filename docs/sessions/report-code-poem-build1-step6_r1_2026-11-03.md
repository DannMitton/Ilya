# Report: poem library build 1, step 6, the gates and the walk (Code cloud lane, r1, 2026-11-03)

Brief: `brief-code-poem-library-build1_r3_2026-11-03.md`, step 6 and "Done". Branch `cloud-lane-31`, cut from `origin/Shane` at `979fdd78`. Earlier reports: `report-code-poem-build1-step0_r1_2026-11-03.md` to `-step5_`.

## A finding that decides whether this branch can merge, first

**Two browser tests that passed at baseline now fail, and the cause is the feature reaching an existing Text-layout fault on one song.**

- `e2e/pages-without-gaps.test.ts:142`, «Tchaikovsky Op. 38 no. 3, text, en» and «..., text, fr»: *nothing on any page reaches its footer*. The failure reads «page 1: content runs 7.4 px into the footer», on screen and in print. At step 0 both passed.
- **What changed:** that fixture is «Средь шумного бала», which is in the library. Uploading the score now fills Poem, and the fill re-lines Lyrics to the poem's lines, as a pasted poem does (`adoptPoemLines`, step 0, section 2). **Measured in a browser: Lyrics were 1 line before the fill and 20 lines after it, the same 557 characters either way** (a decline puts back the 1 line). TEXT shows one row per Lyrics line, so page 1 now needs more height than its budget allows. NOT ESTABLISHED: which row, and whether the poem's presence or only the re-lined Lyrics causes it; the two come together in every state I can reach.
- **Measured, in a browser, on the same score, same session:**

| State | Page 1 `empty` (px above the footer) |
|---|---|
| Library poem filled (the new behaviour) | **-7.41** |
| "Not this poem" tapped, so Poem is empty (the old behaviour) | +56.34 |
| "Not this poem" tapped, then the same poem **pasted by hand** into Poem (no library code involved) | **-7.41**, to the digit |

So the fault is in how TEXT paginates a song whose Poem is present; the library fill reaches it automatically on this song, where before only a singer who pasted this poem by hand would. The test's comment quotes Dann's ruling of 2026-10-14 03:10 on this rule: *"That is unaccveptable and must not be allowed in production"*, transcribed as written (`pages-without-gaps.test.ts`, the block above `overlaps`).

**I did not fix it and I did not skip the tests.** TEXT breaks its pages by a row budget (`sliceLinesToPages(lines, page1Budget)`, `Paper.svelte:47`), which is Text pagination, outside this brief and not a change I would make without Dann. The two tests stay red in the log. **Recommendation:** do not merge until TEXT's page budget holds the 20-line case (a Text-pagination fix, which also repairs the same song with a hand-pasted poem). The other way out, on my side, is to fill Poem without re-lining Lyrics on a library fill. I did not take it: the brief fills "through the path a pasted poem takes, so differences and omissions work unchanged", the re-lining is that path's ruling (N.135 stage 3, ruling default 4, `relining.ts`), and the fault would remain for a hand-pasted poem. Either is Dann's call.

**The other 8 of the 10 failing browser tests are the baseline's 8, by name** (step 0, section 9): `glue-typed-marks` ×2, `heic-offline`, `heic-reader-path`, `insights-page`, `loupe-header`, `print-pages`, `singer-paths:169`. None is touched by this work and their causes are still NOT ESTABLISHED.

## What "Done" asks, and where it stands

| "Done" says | State |
|---|---|
| Steps 0 to 6 pushed with reports | Yes: seven commits and seven reports on `cloud-lane-31`. |
| Walk items 1 to 9 each shown by a test | Yes, below: a unit test and a browser test for each. |
| The eight gates at baseline plus the new tests | **Not wholly: seven at or above baseline; the browser suite has 2 new failures (the finding above).** |
| The byte count stated | Yes, below. |
| Nothing about the singer or the song leaves the device | Shown by a source check and a browser request log, below. |

## The gates, baseline to now

The brief and `CONTRACT.md` do not list "the eight gates"; I ran every suite (step 0, section 9).

| Gate | Step 0 | Now |
|---|---|---|
| phonology | 407 | 407 |
| dictionary | 248 | 248 |
| blurb | 148 | 148 |
| score-parser | 785 + 5 skipped | 785 + 5 skipped |
| web unit | 3898 + 1 skipped | **4065** + 1 skipped (+167) |
| integration (root) | 98 | **112** (+14) |
| svelte-check | 0 errors, 12 warnings | 0 errors, 12 warnings (989 files) |
| ratchets | OK | OK |
| build | succeeded | succeeded |
| e2e, chromium | 82 passed, 8 failed (90) | **97 passed, 10 failed (107)**: the 8, and the 2 above. 17 new tests, all passing. |

The e2e figures are from one run of the whole suite at the end of step 6's code; I then added one more browser test (the request log, below) and reran `e2e/poem-library.test.ts` alone: **18 of 18 pass** (4.0 min). Raw logs are not committed (scratchpad).

## The byte count (`CONTRACT.md:150`)

- **`data/dictionary.poems.a97f2074.json`: 131,622 bytes** (32,727 gzipped), served as a static file through the `static/data` symlink. Manifest: 239 to 324 bytes (+85).
- It is the only new static file. NOT MEASURED: the change in the JavaScript bundle (the matcher, the controller, the card).
- The file is in `.gitignore` (`data/dictionary.*.json`), as the dictionary shards are, and was added with `git add -f`; a merge keeps it. If a merge tool drops it, the manifest names a file the deploy lacks and the feature falls back to no fill, silently.

## The walk, item by item (each shown by a unit test and by the browser)

Browser tests are `apps/web/e2e/poem-library.test.ts`; unit tests are `poem-offer.test.ts` and its neighbours (step 4 and step 5 reports).

| Item | Browser test | What it checks |
|---|---|---|
| 1 sees a card | *the card names the poem, and nothing takes her focus* | on row 114 song 2 pasted into an empty song: heading, «Весёлый час», «Дайте бокалы!», Алексей Васильевич Кольцов, «From Russian Wikisource.», the colours line; buttons in order; in the LYRICS view; above the field; **the field still has focus**; `role="group"` named by its heading; the heading in a polite live region; tab order card then field |
| 2 her questions in order | the same test | the order of the card's text |
| 3 Keep folds the card | *Keep this poem folds the card to one quiet line, which shows under POEM only* | card gone; under LYRICS the ordinary line; under POEM «Алексей Васильевич Кольцов, «Весёлый час», from Russian Wikisource.» |
| 4 Not this poem, Undo | *Poem empties, Lyrics are as they were, and Undo restores the filled state*; *the same poem is not offered again for that song this session* | Poem empty; **the field's value equals what she pasted**; «Poem removed.» with Undo (focused) in either view; Undo restores the poem and the card |
| 5 she ignores it | *a reload of the song shows the card again* | the poem stays; after a reload the card is back; after Keep, a reload shows no card and the quiet line |
| 6 she edits | *a typed key makes the poem hers...* | card gone; «Based on …»; not under LYRICS |
| 6 and 7, a poem page | *a poem page asks before it replaces a poem she edited*; *... replaces an unedited library poem with no question* | the page's own dialog «Replace the poem?» over an edited poem; no dialog over an unedited library one; the source is gone with the poem it named |
| 8 a passage | *fixture S fills the stanzas of the fish's song only...* | «Мцыри», «a passage beginning «Дитя моё»», Михаил Юрьевич Лермонтов; Poem holds «Останься здесь со мной», not «Немного лет тому назад», and under 2,000 of the poem's 19,433 characters |
| 9 nothing later | *typing the Lyrics fills nothing*; *no poem in the library*; *a cycle of several songs*; *a song reopened after Not this poem*; *her own Poem is never filled over* | a typed 700-letter insert and a 9-second wait; the three refusals; a stored song reloaded is not filled; her own Poem stays |
| French | *the card and the line speak the desk's draft French* | the draft strings in a browser |

A paste in the test is a real paste (the clipboard and Control+V), because a typed key and a paste reach the page differently (`IntakeViews.svelte`, `arrivalOf`). **Controls** (the app broken, to see a test fail): removing the paste gate in `handlePoemInput` fails *typing the Lyrics fills nothing*; making the guard ask over an unedited library poem fails *no question*; a `fetch` that sends the song fails the request-log test (my first version of that test could not see it, because the fixture is a scan's misreading and my search words were the poem's; it now searches every word of five letters or more of the pasted Lyrics, and 20 or more such words must exist).

**A page with one line of text was read as music.** My first poem-page test used a PDF with one line; the intake took it for staves and started the score reader. A page of 14 lines is read as a poem. Noted in the test.

## Nothing leaves the device

- **The match runs on the device.** The only request the feature makes is a GET of one static file, `/data/dictionary.poems.<hash8>.json`, by `loadPoemLibrary` through the `fetchFile` that `loader.ts` lends it.
- **Source check** (`text/poem-library-privacy.test.ts`, 8 tests): the matcher, the stanza helpers, the controller, the line helpers, and the card contain no `fetch`, `XMLHttpRequest`, `sendBeacon`, `WebSocket`, or `EventSource`, and no `localStorage`, `indexedDB`, cookie, or `console` use in the matcher and controller; `poem-library.ts` reaches the network at one place, for one path built from the manifest's file name; the loader lends a plain `fetch(url)`. A `fetch` added to `poem-source.ts` fails it (control).
- **Browser check** (*a paste, a keep, and a decline make no request that carries the song*): every request of a real session is logged; none has a body, none is a write method, none carries a word of the Lyrics or the poem's title or poet in its URL or body, and the poem file is requested once, by name, with no query.

## What this branch changes for Dann to read, and what is his to rule

**Taste and rulings** (each reversible, each a DESK DEFAULT of mine unless the brief says so):
1. **The 80-letter floor** (step 3): short Lyrics filled by chance (440 of 963 six-letter windows). The brief has no floor.
2. **A closing dating line** is not a stanza the song left out (step 4): so «Весёлый час» is a whole poem, not a passage; the fill keeps the dating line, «1830», as the brief reads. Should it?
3. **The passage wording prints the stanza's first line** («Дитя моё»), not the desk's longer example (step 5).
4. **`letters` and `at` are in the file** (59% of its bytes), against `CONTRACT.md:144` ("do not store anything derived"); the brief orders them (step 1).
5. **Strings:** the 12 are drafts, as the brief says; the four choices it leaves open for Dann are still open (button order, `cardColours`, nested guillemets, `{site}` in French, which prints «Tiré de Russian Wikisource.»).
6. **Library data defects**, not touched: «1840Москва» with no break; a U+200E at the start of the last block of «С чужой стороны»; «ИЗ ГЕЙНЕ.» opening the text of «На севере диком стоит одиноко»; and 13 distinct works where the brief says 12.
7. **A decline after a reload** cannot restore the earlier line breaks (the brief keeps them in memory only); no words are lost.
8. **A paste into the Poem field** counts as an edit unless it shares no run of 20 letters with the poem (step 4).

## NOT ESTABLISHED

- The cause of each of the 8 baseline browser failures.
- A scan end to end (homr is not run in this sandbox): the scan reaches the fill by the chain in step 0, section 1; the fixtures stand in.
- Speech from a screen reader; Safari and Firefox; the card in dark mode.
- The time of one match on a phone (`rankWorks` over 13 works took 14 to 70 ms here).
- Whether Text's page budget is the right place to fix the overflow: I read where it breaks (`Paper.svelte:47`), not why this song needs one more row than the budget allows.
