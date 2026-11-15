# Report: N.201, the Drawer's order (Code, cloud lane 54, r1, 2026-11-14)

Branch `cloud-lane-54`, cut from `Shane` at `463290e1`. Brief: `docs/sessions/brief-code-n201-drawer-order_r2_2026-11-14.md`, with its section AMENDMENTS, BINDING. Steps 1 to 5 are done. Nothing was pushed to `Shane` or `main`; no pull request. Code tip: `71b6433`; the commit after it carries only this report and the pictures.

Lane 55 edits `lib/voice/` and `lib/i18n.ts`. I did not touch `lib/voice/`. I did edit `lib/i18n.ts` (four keys and the key index at its head), so expect a small merge conflict at the index's total and its `analysis.` and `songs.` counts.

## The eight gates

Gates 1 to 8 are the set in `report-code-row166-step4_r1_2026-11-09.md`. Each step's gates were run in a separate git worktree at the committed state, so the edits that follow could not touch the run. Gate 4 is `pnpm --filter @ilya/web test`.

| Gate | Baseline `463290e` | Step 1 `a9c80f3` | Step 2 `683eef2` | Steps 3 and 4 `71b6433` |
| --- | --- | --- | --- | --- |
| 1 `pnpm test:phonology` | 462 | 462 | 462 | 462 |
| 2 `pnpm test:dictionary` | 248 | 248 | 248 | 248 |
| 3 `pnpm --filter @ilya/web check` | 0 errors, 12 warnings | same | same | same |
| 4 `pnpm --filter @ilya/web test` | **5662** passed, 1 skipped (311 files) | **5701** (314 files) | **5701** | **5712** (314 files) |
| 5 `pnpm --filter @ilya/score-parser test` | 785 passed, 5 skipped | same | same | same |
| 6 `pnpm test:blurb` | 178 | 178 | 178 | 178 |
| 7 `pnpm test:integration` | 155 | 155 | 155 | 155 |
| 8 `pnpm ratchets` | OK | OK | OK | OK |

Gate 4: 5662 before, 5712 after. The 50 added tests are mine. Steps 3 and 4 share one commit, so they were gated together, not separately (I edited `+page.svelte` for both before committing and did not split the hunks). That departs from "after each step"; I say so rather than hide it.

Ratchets, no ceiling moved. `+page.svelte` 5529 of 5534, `Drawer.svelte` 1981 of 1990. To stay under, I condensed six comment blocks in `Drawer.svelte` that described retired structures (the silhouette, the pinned anchors, the three-groups props, the tabpanel note, the "ONE Studio drawer" note, the path note). The rulings they record are kept in shorter form.

## Step 1. The bands and their ids

Done as written. Commit `a5940b7`, e2e helper fix `a9c80f3`.

- `repertoire` and `analysis` moved from `STATION_IDS` to `BAND_IDS`; the order is `repertoire, piece, input, analysis, scoreMarkup`; `binder` and `notation` stay stations (`sections.svelte.ts`).
- `OPEN_STATIONS_VERSION` is 4. `carryVersion3` keeps `repertoire` only if `piece` was stored and `analysis` only if `input` was stored; every other id is kept; it resets nothing. Versions below 3 land on the first-run default, as before. `restore` still writes only when something changed.
- The phone's one-open-per-tier rule applies to the five bands (tier is read from `isBandId`, unchanged).
- A2: the band head replaces the station header in `SongList.svelte` and `AnalysisStation.svelte`. `Drawer.svelte` takes `repertoireGroup` and `analysisGroup` (snippets) and `repertoireState` and `analysisState` (props). The `RootPanel` snippet is `repertoireGroup` now (it was `pieceGroup`); `notationAndAnalysis` left `IntakePanel` and became `analysisGroup`. EXPORT AND IMPORT is a station inside REPERTOIRE's body, after the list.
- A1: the six test ranges are rewritten, and the file gained the new cases (44 tests, then 47 after Step 3).

Stored sets, from the tests (`sections.test.ts`, the table is the brief review's):

| Stored (version 3) | Desk lands on | Phone lands on |
| --- | --- | --- |
| `["repertoire","scoreMarkup"]` | `["scoreMarkup"]`: VOICE open alone | `["scoreMarkup"]` |
| `["input"]` | `["input"]` | `["input"]` |
| `["piece","analysis"]` | `["piece"]` | `["piece"]` |
| `["piece","repertoire","binder"]` | all three | `["piece","binder"]` (first band, and the station) |

Also tested: `["input","analysis"]` and `["piece","repertoire"]` keep both; `restore` on a version 3 set writes version 4; a version 2 set lands on INPUT alone; a version 4 set writes nothing.

`SectionSet` itself is tested here, which its header says cannot be done. It can: in vitest's node environment `$state` is a plain assignment and `#write` swallows the missing `localStorage`; my tests install a small `localStorage` double so the writes can be read back.

**Picture** `step1-phone-arrival-from-repertoire-scoreMarkup.png`. I looked at it. Stored `{"v":3,"open":["repertoire","scoreMarkup"]}` on a 390 px phone becomes `{"v":4,"open":["scoreMarkup"]}`; five bands, two cobalt, two sage, one lavender; only VOICE open.

## Step 2. A word tap opens ANALYSIS in view

Commits `2d093ff`, `683eef2`.

- `SectionSet.reveal` (opens if closed, shuts the same tier when `exclusive`, does nothing if open, writes through `#write`). `handleWordClick` calls it and bumps `revealRequest`, a counter prop on `Drawer`.
- A9: the Drawer's effect runs after `tick`, skips while `takeoverActive`, and asks `revealScrollTop` (`Drawer/reveal-scroll.ts`, plain TypeScript, 7 tests). Phone (`isMobile`): `scrollTop = 0` on every tap. Desktop: only when ANALYSIS's head is outside the window, aligning the head to the window's top, clamped at 0. Both comments that carried the no-scroll rule are rewritten to name this exception and the takeover's.
- A8: the mark is a `selected` class on `WordStack`, keyed on `selectedKey` threaded `+page` to `Paper`, `TitlePage` and `SubsequentPage`, `VerseLine`, `WordStack`. It is the focus outline's 2 px `var(--sage)`, offset 2 px, and 5 px on `.is-inferred` so the dashed VERIFY box stays; it is not the rule that hides the box; it is off in `@media print`; it is off on the probe's copy (`selected && !probe`; `TextFitProbe` is given no key). The tap's switch to the Text document is untouched.
- Shared code, so one definition: `Paper/shown-ipa.ts` (the IPA the stack draws, and `adjacentCliticReconFlags`, which `VerseLine` computed inline) and `Paper/verify-words.ts` (A7). `WordStack` and `VerseLine` now call them.

Measured (390 by 844 phone, then 1440 desktop; scripted, text of three lines with one invented word «блорфа» for a VERIFY word):

| | Before the tap | After tap 1 | After tap 2 on the VERIFY word |
| --- | --- | --- | --- |
| Phone | INPUT open | INPUT closed to "8 words", ANALYSIS open, `scrollTop` 0 | ANALYSIS still open; one `.selected` word, and it is `.is-inferred` |
| Desktop | INPUT open | INPUT open, ANALYSIS open (nothing shut), `scrollTop` 0 | same; one `.selected`, `.is-inferred` |
| Desktop, REPERTOIRE and INPUT open, 16 songs | ANALYSIS head at y 1149, window 48 to 900 | `scrollTop` 789, head at y 360, nothing shut | |

On the last row the head did not reach the window's top (48) because the content ended: the scroll is clamped. The head is fully inside the window, which is what the brief asks.

Tests: `e2e/word-tap-opens-analysis.test.ts` (desktop: `aria-expanded="true"` on ANALYSIS after a tap and after a second tap with INPUT still open; one marked word; the mark's `outline-style` is `solid` on screen and `none` under `emulateMedia({media:'print'})`; the dashed box's `::before` stays `block`) and `e2e-phone/word-tap-opens-analysis.test.ts` (INPUT folds, ANALYSIS open, `scrollTop` 0, head inside 0 to 844, second tap leaves it open). All four pass.

**Pictures** (English and French; I looked at each): `step2-phone-tap-with-input-open`, `step2-desk-tap-with-input-open`, `step2-phone-second-tap-verify-word`, `step2-desk-second-tap-verify-word`, `step2-phone-marked-verify-word-on-page`, `step2-desk-marked-verify-word-close`, `step5-desk-tap-head-below-window-scrolls`, each with `-fr`. What they show: on the phone the word's card is in view at y 303 of 844 with INPUT folded; on the page the sage mark sits outside the dashed VERIFY box and « À VÉRIFIER » or "VERIFY" stays readable.

## Step 3. REPERTOIRE recedes

Commit `71b6433` (with Step 4).

- Arrival: `repertoireOpensOnArrival(onPhone, songCount)` in `sections.svelte.ts` (so the decision lives there, tested in 3 cases); the page calls it after `restore` with `opened?.pointer.songCount` (A5: `songs` is empty at `restore`) and opens REPERTOIRE through `sections.open`. A phone never opens it by itself.
- Folds: `onopen` folds then switches (so the song already open folds it too: `switchSong` returns early for that song); `handleNewSong` folds REPERTOIRE and reveals INPUT only after `created.ok`, before the refresh. `switchSong` is untouched (A4); `recognize.open` and Delete do not fold.
- Rename and Delete show on the open row, and on a row with a `readFailure` (the recorded reason, kept as the brief's default).
- No second save site: every change goes through `SectionSet` (`reveal`, `fold`, `open`, `restore`).

Measured, desktop 1440 with a library of 16 songs seeded through New song: arrival opens REPERTOIRE with 16 rows and 2 verbs (Rename and Delete on the open row only); a pick folds it (stored set `["input"]` after); picking the open song folds it; New song folds it and opens INPUT (the poem box is empty). With one song, the stored set stands (INPUT open alone). Phone, same library: arrival does not open REPERTOIRE; after opening it and picking, the Drawer stays raised (the pull reads "THE PAGE"), every band is folded.

Test: `e2e/repertoire-recedes.test.ts` (one song stays shut on reload; New song folds REPERTOIRE and opens INPUT; two songs open it on arrival; one Rename and one Delete button; picking the open song folds it; picking another folds it and opens that song; its own chevron opens and shuts it; opening PIECE does not shut it). Passes.

**Pictures** (EN and FR, all viewed, retaken on the final build so they include Step 4's lines): `step3-desk-arrival-16-songs`, `step3-desk-arrival-one-song`, `step3-desk-after-pick`, `step3-desk-after-new-song` ("17 songs" at that point, correct), `step3-phone-arrival-16-songs`, `step3-phone-repertoire-open-16-songs`, `step3-phone-after-pick`, each with `-fr`.

## Step 4. Closed bands say what they hold

- The four strings, seated character for character under `songs.count.one`, `songs.count.many`, `analysis.verifyCount.one`, `analysis.verifyCount.many`, each with a comment naming Dann's ratification of 2026-11-14 20:38. Digits in both languages. Two keys per count. Filled with `tv`. The index at the head of `i18n.ts` reads `analysis.` 7, `songs.` 15, total 1,275; `i18n-index.test.ts` passes. No other English or French was written.
- `bandState.ts`: `repertoireStateLine` (no line at zero), `verifyCountLine`, `analysisStateLine` (the chosen word and its IPA, joined by the band lines' own " · " separator, else the verify count, nothing at zero); 8 tests.
- The chosen word's IPA is `shownIpaAt`, the same function the stack calls, so the line and the stack cannot disagree.
- The verify count is `countVerifyWords(effectiveLines)` (A7): the lines `Paper` draws, so it follows the shown witness. "171ms" is removed from ANALYSIS's body (and the `hasResults` and `transcribeMs` props with it).

Measured closed lines (EN; the French reads « 1 chant », « 16 chants », « 2 à vérifier », « 8 mots »): fresh profile after typing, "1 song"; 16-song library with REPERTOIRE folded, "16 songs"; three lines with two invented words, ANALYSIS "2 to verify"; after a tap and ANALYSIS closed, «шумного · ˈʃum nʌ vʌ»; no verify words, no line under ANALYSIS.

**Pictures** (EN and FR, all viewed): `step4-{desk,phone}-closed-analysis-verify-count`, `-chosen-word`, `-zero-verify`, `step4-desk-closed-repertoire-count`.

## Step 5. Pictures and walk

All 43 pictures are in `docs/sessions/report-code-n201-pictures/`. Done-when list: arrival with 16 songs (step 3); arrival with one song (step 3); after a pick (step 3); after New song (step 3); a word tap with INPUT open, phone and desktop (step 2); a second word tap (step 2); ANALYSIS closed with verify words (step 4); and the A11 additions: one verify word and zero (step 4), the open row with Rename and Delete (step 3), a marked VERIFY word (step 2), a phone arrival from `["repertoire","scoreMarkup"]` (step 1).

E2e files the brief names (A11), run on the current code, chromium project, `PW_CHROMIUM_PATH` pointing at the installed browser because the pinned Playwright asks for build 1208 and 1243 is installed:

- `helpers.ts`: `expandStation('Notation')` now opens the ANALYSIS band first (NOTATION is its first row), and its comment says REPERTOIRE and ANALYSIS are bands. `singer-paths.test.ts`: the two `expandStation(page, 'Piece')` lines before `'Repertoire'` are removed.
- `core-loop.test.ts` and `singer-paths.test.ts` (25 passed, 3 failed on the first run): two failures were `Notation` (fixed by the helper; both pass now). The third, "Learn and Guide open and show their first heading in English and French", expects « La diction lyrique russe pour chanteurs » and the page shows « ... pour chanteuses et chanteurs ». That is a stale expectation in an unrelated heading; this lane did not touch that test or that string. I did not run it on the baseline tip, so "pre-existing" rests on that reading, not a run.
- `text-witness-tools`, `word-marks-saved`, `rhyme-set-aside`, `typed-hyphens`, `poem-library`: 27 passed, no change needed (they call `expandStation(page,'Analysis')` or click a word first, and `expandStation` leaves an open band alone).
- The phone project ran only the new phone test.

## Sites that decide which bands are open, and sites that count songs

Which bands are open. Every computation lives in `sections.svelte.ts`: `restore` (with `carryVersion3` and `migrateOpenStations`), `repertoireOpensOnArrival`, `reveal`, `fold`, `toggle`, `open`. Other sites only call them: `handleWordClick` (reveal), the two song handlers and `handleNewSong` (fold, reveal), the boot block (open). What depended on agreeing is `sections.exclusive` and `isMobile`: `checkMobile` (`+page.svelte`) sets both on one line, and the Drawer's scroll rule reads the same `isMobile` prop, so "phone" means one thing for the one-open rule and for the scroll.

Song counts. REPERTOIRE's closed line reads `songRows.length` (`+page.svelte`, the rows the list draws). The other readers are `songs` (the list's raw state), `pointer.songCount` (read at arrival, the only count available before `songs` loads), `RootPanel`'s `songs.length > 1` (Export all songs), and `SongList`'s `canDelete`. They agree in what I measured (a fresh profile reads "1 song"; 16 seeded songs read 16 on the closed line and 16 rows when open). They can differ for a moment after New song, before `refreshSongs` resolves. On the legacy driver `listSongs` returns `[]` (read in the review, not by me); I did not run the legacy driver, so what the closed line says there is NOT ESTABLISHED.

## For Dann's walk

- The mark's look (A8's default is built: 2 px sage, 2 px offset, 5 px on a VERIFY word).
- Whether IPA reads well in the closed line's sans face. In the pictures the stress mark is a tall tick and the open-back vowel is an upside-down v; both are legible at 390 px.
- Whether desktop arrival opens REPERTOIRE on every visit at two or more songs (built so).
- A row that cannot be read keeps Rename and Delete (built so).

## What you could not establish

NOT ESTABLISHED beats a complete invented answer.

- **PIECE's line after a phone pick.** The brief (3.5) expects "PIECE's line showing the new title". In my pictures PIECE shows no line after a pick. `pieceStateText` reads only `doc.metadata.title` and `composer`, and the seeded songs have none; a REPERTOIRE row's label is derived from the poem («лето весна»), a different value. So the expectation holds only for a song whose metadata has a title. I did not change how that line is computed (a computation change the brief does not name). I did not test a song with a title, so the case where it does show a new title is NOT ESTABLISHED by a picture.
- **How many rows a fresh library shows.** Measured: a fresh profile reads "1 song" once text is typed; I did not read a profile with no text typed (REPERTOIRE closed shows no line only at zero rows), so the zero-row case is NOT ESTABLISHED.
- **Rendered heights at 390 px** (CSS px, measured by script): with INPUT open and a two-line poem, the bands are REPERTOIRE 76 (with its "1 song" line), PIECE 44, INPUT 381, ANALYSIS 76, VOICE 44, and the Drawer's scroll window is 800 tall. After a word tap on the phone: REPERTOIRE 76, PIECE 44, INPUT 76, ANALYSIS 488, VOICE 44, and the inspector card's top is at y 303 of 844. A band head is 40 px; I did not read the 4 px difference for the bands without a line.
- **Whether MELODY has word taps that reach `handleWordClick`.** One caller, `+page.svelte` at the `Paper` element; `MarkupPane` and `ReadingAid` mention `WordStack` only in comments (grep). So no. The closed ANALYSIS count is read from `effectiveLines`, the same lines on both documents; I did not tap anything on MELODY.
- **Whether a song that cannot be read can be opened, and so deleted.** Not tested; no unreadable song was seeded.
- **The `Notation` row pushing a word below the window on a phone.** On a phone the tapped word's card is at y 303 with NOTATION closed (picture and measure above). With NOTATION open I did not look.
- **The legacy driver's closed REPERTOIRE line** (above).
- **A word tap on a phone in landscape or a tablet width (768 to 1399 px).** `isMobile` is true up to 1399 px, so those widths take the phone rule; I measured only 390 and 1440.
- **The third e2e failure's baseline status** (above).
- **Gates on the commit that holds this report.** It changes no code; the gated tip is `71b6433`.
