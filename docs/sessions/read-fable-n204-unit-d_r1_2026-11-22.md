# read-fable-n204-unit-d_r1_2026-11-22

N.204 phase 1, unit d: `apps/web/src/routes`. Read by Fable 5.2, 2026-11-22, commissioned by the Opus desk. 290,034 tokens, 38 tool uses, 8.8 min, against a 350k cap. Transcribed into the tree by the desk in the turn the memo landed (`ENVIRONMENT.md`, A FABLE REVIEW NEVER REACHES THE TREE BY ITSELF).

Read-only; nothing written to the repository by the reader.

**Tree state (ran).** The working tree was on `cloud-lane-82` at `13f34634`, one commit past `Shane` at `c470e03d`. `git diff --stat c470e03d -- apps/web/src/routes` is empty, so every line cited is the same on `Shane`.

**Size correction.** The unit is 265,173 bytes (`wc`), not about 75,000 characters. `+page.svelte` alone is 258,566 bytes over 5,533 lines.

Terms coined by the reader: "line-packing", "source-text pin", "misattached doc comment". "Tombstone comment" adopted from general usage. Every claim is "read" unless marked "ran".

## 1. The developer's paragraph

`routes/` is the whole application shell: one page, no navigation between routes. `+layout.ts` turns server rendering off. `+page.ts` opens the song library before the page exists, so the page is always built from a record already read. `+page.svelte` is the wiring loom: it owns no rule of its own by intent, and holds about 58 `$state` values, about 100 `$derived` values, and 14 `$effect`s that join the text pipeline, the song document, the score, the Loupe, the voice, and the Drawer.

Its script runs in this order: imports (1 to 225), the song document and device state (226 to 383), what TEXT shows (384 to 498), placements (499 to 790), the Loupe, cursor, and correction verbs (791 to 1440), layout and the Drawer's doors (1442 to 1833), the transcription join (1834 to 2596), a score's arrival (2598 to 2894), the binder and the library door (2896 to 3396), and preferences and boot (3397 to 3730). Markup is 3733 to 4561; CSS is 4563 to 5533.

A newcomer must know five things before changing it.

1. Declaration order is load-bearing: one long reactive scope, and several comments exist only to say why a thing sits where it does.
2. `lines` is always Lyrics' transcription and feeds placements, MELODY, and INSIGHTS. `textLines` is what TEXT shows and may be the Poem's or the score's derived words (468 to 498).
3. Every decision meant to be testable has already been moved to plain `.ts`, because runes are inert under vitest. What remains is ordering, and ordering is what no test pins.
4. The file sits exactly at its ratchet ceiling (`scripts/ratchets.json:8`, 5,533), and new work has been entering by line-packing.
5. Ten vitest files read this file's source text and pin exact spellings (section 3, relationship 1).

## 2. Findings

### Tier 4: behaviour defects, in the order a singer meets them (release lanes)

**D1. The update notice sits on the DRAWER pull on the phone layout.** Read, not ran.
- Anchor: `.update-toast` (`+page.svelte:5465-5484`, `5522-5526`) against `.drawer-pull` (`Drawer/Drawer.svelte:1546-1562`).
- The pull is fixed at `bottom: 0`, 44 px high, z-index 70, label centred. The toast is fixed at `bottom: 1.25rem` (0.75rem under 768 px), z-index 200, up to 30rem wide, centred.
- The comment at 5517 to 5521 says the clearance "has nothing left to clear"; it predates the pull's return to the bottom edge (5440 to 5453).
- What the singer meets: while "a new version is available" shows, most of the DRAWER bar cannot be pressed until the notice is dismissed.
- Proof: a phone Playwright test asserting the two boxes do not intersect while `updated.current` is true. Whether any test covers the toast today is NOT ESTABLISHED.

**D2. Switching language while the Poem is shown swaps the chosen word for the Lyrics word at the same position.** Read, not ran.
- Anchor: `runPipeline` (1848 to 1854). It re-reads `selectedWord` from Lyrics' `result`, or `derivedLines`, and never from `poemLines`.
- Reached from `handleLanguageChange` (3406 to 3407), the homograph effect (491), and the phrase-ends effect (2486).
- With `shown === 'poem'`, ANALYSIS then shows a Lyrics word while the page highlights the Poem's word. The next stress press writes `marks.assignStress(selectedKey(), selectedWord, ...)` (2250) onto the Poem's marks using the Lyrics word.
- `rerunShown` (2228 to 2232) already holds the right rule for the Poem.
- Proof: extend `e2e/text-witness-tools.test.ts`: both witnesses differing, Poem chosen, a word selected, language toggled, assert the inspector's word.

**D3. The cursor outlives the Loupe.** Read, not ran. Low severity.
- Anchor: the effect at 1415 to 1417 sets `loupeOpen = false` without `setCursor(null)`; `switchSong` (3161 to 3203) resets no cursor. `dismissLoupe` (1402 to 1407) is the only complete leave.
- What the singer meets: leave MELODY by the desk head with the Loupe up, return, and a note is still ringed with no Loupe (`{selectedEventId}` at 4392).
- Meanwhile ArrowLeft and ArrowRight are claimed on every page, because the keyboard gates on the cursor alone (`score/correction-keys.ts`, `if (!d.cursor()) return`). Pitch and delete keys are inert, because `LoupePanel.reset` returns to Syllables mode.
- After a song switch, the old song's event id is handed to the new song's page.
- Proof: e2e: raise the Loupe, change tab, assert no `.selection-ring` on return and that ArrowRight is not default-prevented.

### Tier 1: proven dead, comments, renames inside the file

**T1.1 Dead imports.** `SongRecord` (89), `UserStressOverride` (10), `firstPass` (17), `rekeyByWordChar` (174): each appears nowhere else in code (ran `grep -n`). `YoToggle` (10) is unused while 4095 writes `import('$lib/types').YoToggle` inline. Remove Dead Code. Proof: `pnpm check`, ratchets.

**T1.2 Dead declarations.** `engineReady` (227) never read, and `transcribeWord` (5) exists only for it. `triggerPaperBreathIn` (1561) never called, so `paperBreathClass` is always empty and its binding at 4285 is dead. `transcribeMs` (280) written at 1845, 2104, 3176, never read. `.placeholder-content` (5261): no element carries it. `engraving` (1445): `$state` never reassigned; a constant.

**T1.3 `handleLoupePick` (770) is `handleNotePick` (754), byte for byte in its body.** Its own comment says it stays "because a future ruling could still tell them apart". Speculative Generality; Inline Function. Proof: `e2e/loupe-*.test.ts`.

**T1.4 Line-packing against the ratchet (ran).** Fourteen lines exceed 220 characters. Line 2367 is 1,198 characters and holds a `let`, three `attach` wirings, and a trailing comment. Lines 41 and 42 hold seven and three imports. The file went from 5,641 lines and 253,898 bytes (`a6f9e3ae`, 2026-10-20) to 5,533 lines and 258,566 bytes (`5c7ba667`): lines fell while bytes rose. Analysability traded for the line ceiling. Slide Statements, one statement per line, inside the tier 3 extractions so the ceiling is never crossed. Desk decision: a byte ceiling beside the line ceiling at today's figure raises nothing.

**T1.5 False or stale comments (13).** 516-520 (claims a TDZ error that `blankUnderlay` contradicts at 599, 602, 1185); 1274-1277 and 1361-1364 (say `handleNotePick` places a syllable; 737-756 shows it only selects); 2575-2577 and 3188-3190 (a Transcribe button removed by N.145); 4376-4380 (calls MELODY "the Voice Profile envelope ... interim main pane"); 4442-4443 (Print "covers the transcription and the marked score and nothing else"; INSIGHTS is also Studio); 5517-5521 (see D1); 4018-4027 (an `isMobile` prop the `ScoreUploader` call does not pass); 372-373, 1596-1602, 2840-2842, 4143-4147 (wiring, a collapsed drawer, "Start placement over", and a Corrections station that are gone).

**T1.6 Tombstone comments (27 blocks).** 606-613, 615-624, 626-630, 632-643, 1148-1164, 1446-1451, 1619-1626, 1627-1634, 1635-1640, 2093-2100, 3344-3347, 3591-3593, 3654-3659, 3721-3723, 3755-3759, 3924-3927, 4057-4065, 4130-4155, 4158-4168, 4254-4261, 4564-4578, 4707-4710, 4711-4715, 5013-5017, 5058-5065, 5067-5074, 5297-5311. `shiftAnchorEventId`, `ShiftLyricsControl`, and `CorrectionDock` now exist only in these comments (ran grep across `src`). Those carrying Dann's ruling with date and words (606-613, 1635-1640, 2093-2100, 4057-4065, 4158-4168, 4254-4261) keep the ruling as one line at the surviving code or in a decision record. The rest come out.

**T1.7 Misattached doc comments (7).** 2308-2319, 2427-2433, 2459-2466, 2733-2740, 3305-3309, 3772-3785, 1029. Slide Statements.

**T1.8 Line-number citations (convention section 5 forbids them).** Six blocks, eight citations: 318-319, 849, 1063, 1182 (points into this file and is now wrong), 3534, 4946.

**T1.9 No opening comment.** `+page.svelte` begins with `<script>` and imports; `+layout.svelte` has none at all.

**T1.10 Shadowed names.** `shown` in `runPipeline` (1851) shadows the witness `shown` (478) and is the mechanism of D2. `eventIds` in `handleArrival` (2627) shadows `eventIds` (1185).

**T1.11 Colour tokens that do not exist or disagree (ran).** `var(--stone-600, #57534e)` at 4652, 4694: `app.css` defines no `--stone-600`. `var(--paper, #faf7f2)` at 5477: no `--paper`. `var(--paper-cream, #f5f0e6)` at 4654 disagrees with the token's `#F0EBE0` (`app.css:78`).

**T1.12 Console output in production.** `console.log` on every word tap (2194); two N.160 instruments running `planHeal` and logging per seat on each load (1804-1833). Whether N.160 still needs them is NOT ESTABLISHED; a desk question.

**T1.13 `phraseEnds` re-tokenizes the poem on every placement.** 2484 calls `wordGrid(transcribedText)` whenever `doc.pairings` changes, while 2491-2496 says `wordGrid` is costly enough that `transcribedGrid` is held to avoid it, and that grid is the same value. Cost not measured.

**T1.14 Template logic.** `wordYoToggles` is an 11-line function expression inside markup (4093-4103). Extract Function.

### Tier 2: moves across modules

**T2.1 LEARN's and GUIDE's CSS lives in the route.** `:global(.gt-*)` (4717-4858), `.learn-callout` (5222-5259), the reading heading rules (5266-5295): about 215 lines and 15 colour literals, used only by `Reading/LearnContent.svelte` (ran grep). Touches no word of LEARN or GUIDE.

**T2.2 Device preferences have no module.** Four storage keys as bare literals at ten sites. Extract Class `device-prefs.svelte.ts`. No stored format changes.

**T2.3 The confirm dialog.** `Answer`, `askToReplace`, `answerWith`, `settleCollision`, `askCollision` (2413-2457, 2695-2706, 3009-3042), markup 3814-3853, CSS 4641-4706. Extract Component. Risk: the focus order and the "press settles, not the close event" rule (2997-3002). Characterization e2e first.

**T2.4 The Loupe's readouts.** `gapAnchorName`, `readoutLine`, `loupeNoteLine` (1073-1146) are pure. Extract Function into `score/`, with vitest.

**T2.5 `%s` filling.** Eight hand `.replace('%s', ...)` chains against `fillNotice` (`library/notices.ts:226`).

**T2.6 The voice mirror.** Six `$state` values (362-371) written by one callback taking six positional parameters (3935-3942). Introduce Parameter Object. Whether `voiceSeam` (1655) holds the same six facts is NOT ESTABLISHED.

**T2.7 `isMobile` means "phone layout", true on a 1366 laptop** (3792-3797), while children's `isMobile` props receive `isPhone` (4000). Rename Variable across the prop boundary.

### Tier 3: splitting the hotspot

The file already shows the method: "audit phase 4, slices 1 to 6" moved the cursor, undo, verbs, tuplet row, press-and-hold, and keys out as classes and factories handed their dependencies as functions (799-977).

**T3.1 Arrival.** `handleArrival`, `applyArrival`, `seatFilledPoem`, `attachUploadedSource` (2598-2894, 3349-3396). A ruled twelve-step order: flush, fingerprint, recognize, ask, attach, header, fill, re-key, merge, extender melismas, re-seat, fold, seat. The steps are tested singly; the order is not. Characterization tests first. Highest risk in the unit.

**T3.2 The transcription join.** `runPipeline`, `transcribeText`, `joinText`, `flushText`, the quiet timer, `claimDerivedPoem`, the Poem handlers (1834-2091, 2320-2411, 2470-2596). Divergent Change. Baseline: `one-action.test.ts`, `e2e/core-loop.test.ts`, `e2e-phone/relining.test.ts`.

**T3.3 The library door and the binder** (2896-3303). Extract Class. Baseline: `e2e/repertoire-recedes.test.ts`, the `exchange` and `songs` vitests.

**T3.4 What TEXT shows** (408-498, 1771-1796). Baseline: `e2e/text-witness-tools.test.ts`, `text-header.test.ts`.

**T3.5 `handlePageTap`** (1278-1400): 122 lines, about 90 of them comment, two decisions and several DOM queries. Extract the dismiss test and the raise test as pure functions over rectangles.

**T3.6 The Drawer's doors.** `openVoice`, `leaveThen`, `openBand`, `openStation` (1647-1702). Baseline: `e2e/voice-links.test.ts`, `insights-links.test.ts`.

**T3.7 Performance, capacity.** LEARN and GUIDE load on demand (4413, 4418). Every MELODY, INSIGHTS, voice, and Loupe module is a static import (93-225) and so sits in the first chunk. The byte cost is NOT ESTABLISHED; it needs a build with a bundle report.

## 3. The hidden relationships

1. **Source-text pins.** Ten vitest files read `routes/+page.svelte` as a string (ran grep). `Paper/blank-states.test.ts` pins `const openInput = () => openBand(BAND_IDS.input), openVoiceBand = ...;` character for character; `Drawer/voice-pane-usable.test.ts`, `Drawer/scan-banner.test.ts`, and `score/draw-pairings.test.ts` pin expressions. A behaviour-preserving move fails them, so each extraction migrates its pins in the same lane.
2. **The keyboard is live wherever a cursor exists, not wherever the Loupe is open** (D3).
3. **Window-level listeners depend on class names owned elsewhere.** `handlePageTap` reads `.loupe`, `.dock`, `.surface`, `[data-ts-overlay]`, `[data-ks-overlay]`, `.score-page`, `[data-hit]`, `[data-verse-hit]` (1293, 1325, 1356, 1376, 1383). `markup/MarkupPane.svelte:311-321` registers its own `document` click listener for the same hits; the page's handler relies on running after it (1361-1366).
4. **`slotQueue` changes source without notice.** The singer's queue when `lines` is non-empty, otherwise the score's (413). That is why the derived poem is kept out of `lines` (437-441).
5. **`{#key doc.id}` on the uploader is the restore path** (4035). A song switch works only because the remount re-ingests `restoreSource`; `handleClearScore` must null `restoreSource` or the cleared score returns (2131-2133).
6. **`handlePagesDrawn` must be a function declaration** (1473-1482), or MELODY's redraw effect loops.
7. **Singletons attached at module scope.** `poemOffer`, `poemJoin`, `loupePrint`, `tempoUi`, `clefUi`, `barlineUi`, `keyUi`, `tsUi`, `scanBanners`, `inputViews` (907-909, 998-999, 2367). Their order relative to `doc` and `layer` matters, and nothing detaches them.
8. **`settledPoem` and Lyrics share one `quietTimer`** (2394-2398, 2521-2525, 2555-2556). `onclearpoem` (3988) writes `doc.publishedPoem` directly, a third write path that skips `handlePoemEdit`; `carryPoemEdit` covers it on the next edit (`text/witness-lines.ts:140-142`).
9. **Import's reload** (3087-3089) leaves the live document open, and that document flushes on `pagehide` (`library/document.svelte.ts:281-286`). Safe only while nothing is pending.
10. **`transcribeText` and `applyArrival` mirror each other's seat** for the two arrival orders (1986-2010 against 2859-2892).

## 4. The comment census

| measure | count |
|---|---|
| comment blocks | 441 |
| comment lines | 2,526 of 5,533 (46 percent) |
| script, markup, style | 330, 46, 65 blocks |
| cite a line number | 6 blocks, 8 citations |
| carry a ruling (Dann or Kimi named) | 81; 73 dated; 59 with quoted words |
| use history language | 88; 61 of them carry no ruling |
| fail outright (T1.5 to T1.7) | 47 |
| a ruling given three homes | 1 (the pill-ends ruling: 4678, 4956, 5351) |

The remaining blocks, about 390, curate at least in part; their common fault is narration of how the code got here mixed into what it does now. An exact per-block figure for those 390 is NOT ESTABLISHED: the instrument was a regex plus one read.

Other files: `+page.ts` 1 block, curates. `+layout.ts` 1, curates. `+layout.svelte` 0. `notation-font-lab/+page.svelte` 4, all curate, 2 carry a ruling.

## 5. The duplication census

Twenty-five facts with two or more homes. Lines are `+page.svelte` unless a path is given.

1. Word key `"line-word"`: `wordKey()` in `text-diff.ts:32`; hand templates at 2227, 2271, 4092, 4303; the slot-origin variant at 525, 529. Fourteen more `lib` files hold a template (ran grep).
2. "The dictionary is ready": 455 (negated), 488, 1615, 2367, 2547, 2589; `score/ingestion/ocr-guard.ts:107`.
3. "Lyrics is the score's words verbatim": 429, 685, 2002, and 1976 against the waiting score.
4. The score's words as one line: 418, 1976, 2835; `score/row108.support.ts:53`.
5. "The file carried no words": 2005, 2796; `score/ingestion/ingest.ts:116`.
6. `processText`'s mark options: 457-462, 1838-1844.
7. Storage keys: `ilya:activeTab` 2189, 3506, 3665; `ilya:language` 3401, 3641; `ilya:notationPrefs` 2204, 3645; `ilya:showStressDiacritics` 2212, 3650. No constant exists anywhere (ran grep).
8. "Go to TEXT and store it": 2185-2193 and 3503-3509.
9. `%s` filling: `library/notices.ts:226`; 1095, 2676, 3029, 3030, 3082, 3250, 4229, 4251.
10. A later verse's copy names its source note: 1383-1386; `markup/MarkupPane.svelte:315-316`.
11. Drawer width 520: `Drawer/layout.ts:41`; `Drawer/drawer-width.ts:39`; 1594.
12. Sheet width 816: `page-config.ts:15`; `Drawer/layout.ts:44`; 4897, 4924.
13. Phone-layout breakpoint: `Drawer/layout.ts`; CSS 5007, 5411; `Drawer.svelte` and `voice/VowelCapture.svelte`.
14. Phone test 768: 3636; CSS 5522 as 767; `components/ReadingWait.svelte:49`.
15. Pull height 44 px: `Drawer.svelte:1554`, `1887`; 5453.
16. Usable readings count: 1763, 4188, 4368.
17. Calibration request counter: 1666, 1680.
18. "Raise the drawer on a phone": 1661, 1685, 1694, 2176.
19. Reveal target plus request: 1687-1688, 1699-1700, 2182-2183.
20. Select an entry: 754, 770.
21. The readout's parts: `valueParts` with the same arguments at 1100 and 1144.
22. The seat on arrival, for each arrival order: 2000-2010; 2859-2892.
23. Placements with no note: 2627-2630; `mergeOnUploadObserving`'s `orphaned` at 2859, 2876.
24. "MELODY is on the desk": 993, 1041-1042; the TEXT form at 1528, 2185, 4296.
25. `--paper-cream`: `app.css:78`; 4654 (a different value), 5363; `notation-font-lab/+page.svelte:179`.

**Colour literals under plan section 4a (ran `census-colour-tokens.mjs --json`; tree total now 296).** `+page.svelte`, 34 literals: MIGRATE 14 (`--ink-primary` 4655, 4966, 4969, 4991, 5271, 5360, 5362, 5381; `--desk-surface` 4875; `--paper-cream` 5363, 4654; `--stone-300` 5478; `--ink-secondary` 5483, 5510, all `var()` fallbacks); NEEDS A TOKEN 5 (4652, 4694, 4702, 5477, 5497); travels with T2.1, 15 (4732, 4733, 4734, 4742, 4761, 4771, 4772, 4776, 4794, 4819, 4844, 4846, 4849, 4850, 4854). `notation-font-lab/+page.svelte`, 12 literals: LOCAL BY RIGHT. Fonts at 4813-4816: LOCAL BY RIGHT. Not counted by the script: `rgb()`/`rgba()` at 4659, 4986, 5480.

## 6. Glossary lines

- Ilya opens on the song you left, with nothing lost: `routes/+page.ts`.
- Ilya runs in your browser alone: `routes/+layout.ts`.
- The window Ilya fills, which becomes plain pages when you print: `routes/+layout.svelte`.
- The one screen where the Drawer, the page, and the Loupe meet: `routes/+page.svelte`.
- You paste or type words and the transcription appears, at once for a paste and after a short pause while typing: with `lib/one-action.ts`.
- A score that carries words fills LYRICS and seats them on its notes: with `lib/score/score-seat.ts`.
- Ilya asks before a different piece replaces your song: with `lib/library/library.ts`.
- Choosing whether TEXT shows the LYRICS or the POEM: with `lib/text/witness-lines.ts`.
- Tapping a word to see why Ilya chose its sounds, and to change its stress, yo, syllables, rhyme reading, or gloss: with `lib/text/word-marks.svelte.ts`.
- Tapping a measure to raise the Loupe, and clicking the page to send it away: with `lib/score/loupe.ts`.
- Putting a syllable on the note you have taken; Clear placements; Place from here; Melisma; shifting the lyrics: with `lib/score/pairings.ts`.
- Undo and Redo for anything done in the Loupe: `lib/score/undo-wiring.svelte.ts`.
- New song, opening, renaming, and deleting a song in REPERTOIRE: with `lib/library/songs.ts`.
- Export and Import of a binder: with `lib/library/exchange.ts`.
- Moving between TEXT, MELODY, INSIGHTS, LEARN, and GUIDE: with `lib/destinations.ts`.
- The one line a closed band shows: with `lib/components/Drawer/bandState.ts`.
- A link on a page that opens the right place in the Drawer: `routes/+page.svelte`.
- English or French, remembered on this device: `routes/+page.svelte`.
- Print, under the sheet: `routes/+page.svelte`.
- Read, the phone's reading view of TEXT: with `lib/components/ReadingAid.svelte`.
- "A new version is available": with `lib/update-check.ts`.
- What Ilya tells you when your device cannot save: with `lib/library/notices.ts`.
- Not a singer's feature: the notation font comparison page for development: `routes/notation-font-lab/+page.svelte`.

## 7. What could not be established, and the instrument that failed

1. D1, D2, D3 are read, not ran. A browser walk through the bridge was outside this unit's budget; each carries the test that would settle it.
2. Whether `scoreTextQueue` (408-410) and `cliticFolds` (560-562) differ when the score is restored before the dictionary lands. Needs a vitest calling `readScoreText` before and after the dictionary loads.
3. Whether `handleArrival` can apply a score to the wrong song. It awaits at 2634 and 2654 and then reads `doc`; a song switch in that window is not guarded. Needs Playwright with a delayed fingerprint.
4. Whether a flush with nothing pending writes. `createSaveScheduler` not read.
5. The first-chunk cost of the static imports (T3.7). Needs a build.
6. Whether the N.160 console instruments are still wanted (T1.12). A desk question.
7. Whether `voiceSeam` duplicates the six voice mirrors (T2.6). `voice/seam.ts` not read.
8. `TAB_ORDER` (1492) against the order DeskHead draws. `DeskHead.svelte` not read.
9. Five legacy `on:` directives on `<svelte:window>` (3747-3753) under Svelte `^5.50.1`. Deprecation not checked.
10. The exact pass count for the comments not named.
11. Standards documents were read through `cut` at 900 and 1,500 characters a line, so the longest rows of `ARCHITECTURE.md` and the plan were truncated.

## 8. Files read

Unit: **5 of 5, each whole.** `+layout.ts` (4 lines), `+layout.svelte` (26), `+page.ts` (27), `+page.svelte` (5,533), `notation-font-lab/+page.svelte` (186).

Standards: `docs/house-style/code-conventions.md` (whole), `ARCHITECTURE.md` (whole, long lines cut), the N.204 plan sections 3, 4, 4a, `docs/memory/README.md`.

Read in part to settle a claim: `Drawer/Drawer.svelte`, `score/correction-keys.ts`, `score/loupe-panel.svelte.ts`, `score/correction-cursor.svelte.ts`, `text/witness-lines.ts`, `library/document.svelte.ts`, `library/library.ts`, `library/songs.ts`, `library/exchange.ts`, `library/notices.ts`, `markup/MarkupPane.svelte`, `pipeline.ts`, `score/phrase-ends.ts`, `Drawer/IntakePanel.svelte`, `text/poem-offer.svelte.ts`, `components/InstallPrompt.svelte`, `app.css`, `scripts/ratchets.json`, `scripts/ratchets.mjs`.

Nothing under `apps/web/src/lib/insights/` was read.
