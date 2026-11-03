# Report: poem library build 1, step 0 (measure only) (Code cloud lane, r1, 2026-11-03)

Brief: `brief-code-poem-library-build1_r3_2026-11-03.md`. Branch `cloud-lane-31`, cut from `origin/Shane` at `979fdd78` (`git log -1` read at the start of the session; working tree clean, `git status --porcelain` printed 0 lines). Nothing in the tree was changed by this step except this file.

Every claim below carries the file and line read in this session. `NOT ESTABLISHED` marks what I could not establish.

## 1. The three arrival sites where Lyrics is filled

**Site A, a score file's words (and a scan's words): one site.** `apps/web/src/routes/+page.svelte:2825-2829`.

```
2825  const fillText =
2826      origin === 'upload' && !noLyrics && doc.inputText.trim() === ''
2827          ? scoreWordsText(collectScoreWords(ingested.result.score, 1))
2828          : '';
2829  if (fillText !== '') { handleInput(fillText); inputViews.land('lyrics', doc.publishedPoem.trim() === ''); }
```

- It sits in `handleArrival` (`:2590`), after `commitMetadataState(...)` (`:2803`) and before the placements merge (`:2848`).
- It runs only for `origin === 'upload'` (`:2826`). A restore passes `origin === 'restore'` (`ScoreUploader.svelte:536`), so a restore never fills. This is the reason the brief's walk item 9 ("no fill when she reopens a stored song") already holds for this site.
- It runs only when `doc.inputText` is empty (`:2826`) and the score carries lyrics (`!noLyrics`, `:2788`).

**Site B, the scan's site: ESTABLISHED, and it is Site A.** The brief says the review left it NOT ESTABLISHED. The chain, each link read:

1. `ScoreUploader.svelte:218-226`: `readScanAsScore(file, kind, { ingest: async (xml, reading) => { await handleFile(xml); ...; announceArrival({ file, reading }); } ... })`.
2. `lib/omr/scan.ts:97`: `await hooks.ingest(readingFile(file, result.musicXml), ...)`. The scan is turned into a MusicXML file named after the scan.
3. `ScoreUploader.svelte:501-504`: `announceArrival(scan)` calls `oningested(ui.ingested, ui.file, 'upload', undefined, scan)`.
4. `+page.svelte:4028-4029`: `oningested={(ingested, file, origin, page, scan) => void handleArrival(ingested, file, origin, page, scan)}`.
5. `handleArrival` stores the scan at `+page.svelte:2598` (`arrivalScan = scan ?? null`) and reaches the Site A lines above.
6. The words are in the XML because `lib/omr/homr-reader.ts:404` calls `applyUnderlay(...)`, and `lib/omr/underlay-words.ts:6-7` says `writeLyrics` writes them into homr's MusicXML as `<lyric>`.

So a scan and a score file share Site A. The two are told apart only by the `scan` argument (`+page.svelte:2595`, `:2598`). If the underlay read yields no words, the file carries the `no-lyrics-found` warning, `noLyrics` is true (`:2788`), `fillText` is `''`, and Lyrics is not filled. There is then nothing to match, and no hook is needed.

NOT ESTABLISHED: whether a scan whose underlay is partly read (some systems unread, `homr-reader.ts:402-407` `unreadBars`) fills Lyrics with the read words only. I read the call, not a run. It does not change where the hook goes.

**Site C, a Lyrics paste.** `+page.svelte:2360-2363`:

```
2360  function handlePoemInput(text: string, how: TextArrival): void {
2361      claimDerivedPoem();
2362      handleInput(text, how);
2363  }
```

The name is misleading: this is the Lyrics field's `oninput` (`+page.svelte:3982`, `oninput={handlePoemInput}`), not a Poem edit. The Poem field's edits go to `handlePoemEdit` (`:3975`). Path from the field: `IntakeViews.svelte:188-192` (`onInput`) calls `oninput(value, arrivalOf(e))` when the view is Lyrics.

`handleInput` itself (`:2365-2369`) is also called from places that are not a singer's paste, and the brief is right to keep the hook out of it:

- `claimDerivedPoem` (`:2352`), with the default `how` of `'paste'`.
- `adoptPoemLines` (`:2374`), `handlePoemEdit` (`:2388`), `createUndoHistory` (`:850`), `:1204`, and `handleArrival` (`:2829`, `:2831`).

### Hazards at Site C

- **A blur can arrive as `'paste'`.** `IntakeViews.svelte:201-207` (`onBlur`): when `lyricsOnLeave` returns a tidied text, it calls `oninput(tidy, 'paste')`. A hook keyed on `how === 'paste'` at `handlePoemInput` would also see that blur.
- **Undo and redo arrive as `'paste'`.** `IntakeViews.svelte:170-180` lists `historyUndo` and `historyRedo` in `WHOLE`, so `arrivalOf` (`:182-185`) returns `'paste'` for them.
- **Cmd+Enter** (`onflush`, `IntakeViews.svelte:210-213`) does not call `oninput`.

Both are an edit of text already in Lyrics, not an arrival of new text. Step 4 should key the match on more than `how === 'paste'` (see section 8, question 1).

## 2. What a Poem arrival does to Lyrics today

A Poem arrival is `handlePoemEdit` (`+page.svelte:2383-2390`). In order:

1. `carryPoemEdit(...)` (`:2385`) carries glosses, gloss anchors, and word marks across the edit. With an empty `before` it uses `emptyDiff()` (`witness-lines.ts:136`), and it returns `null` when there are no glosses (`witness-lines.ts:138`). So a first fill carries nothing.
2. `doc.publishedPoem = text` (`:2387`).
3. If `lyricsTakesPoem(...)` is true, `handleInput(text, 'paste')` (`:2388`). `lyricsTakesPoem` is `wordlessScore && lyrics.trim() === '' && poem.trim() !== '' && placements === 0` (`witness-lines.ts:154`).
4. Else `nameIfUnnamed()` and `adoptPoemLines(how, before)` (`:2389`), and `joinText(how)` only if a quiet timer is pending.

`adoptPoemLines` (`:2372-2375`) calls `lyricsInPoemLines(doc.inputText, doc.publishedPoem, previousPoem, scoreText, lastLaid)` and, if it returns text, sets `lastLaid` and calls `handleInput(laid, how)`.

**`lyricsInPoemLines` (`text/relining.ts:36-45`) returns `null`, and so changes nothing in Lyrics, unless all of these hold:**

- `scoreText !== ''` (`relining.ts:37`). `scoreText` is the words of an ingested score (`+page.svelte:403-405`). **On a Lyrics paste into an empty song with no score, `scoreText` is `''`, so a Poem arrival does not touch Lyrics at all.**
- Lyrics has the same words as the score (`sameWords`, `relining.ts:37`).
- The line breaks in Lyrics are Ilya's: one line, or `lastLaid`, or the layout of the previous Poem (`relining.ts:38`).
- At least half of Lyrics' distinct words are matched by the poem (`relining.ts:42`).

**Words are not repaired. Only line breaks change.** `poem-compare.ts:229-230`: "The words keep their own capitals, punctuation, and hyphens; only the whitespace between them changes." `layOutLikePoem` is at `poem-compare.ts:232`.

**What a Poem arrival can change, which step 4 must keep in memory for a decline:**

| State | Written at | When |
|---|---|---|
| `doc.inputText` | `+page.svelte:2366` (inside `handleInput`) | only when `lyricsInPoemLines` returns text (score words present) |
| `lastLaid` | `+page.svelte:2374` | same condition |
| `doc.name` | `+page.svelte:3400-3408` (`nameIfUnnamed`) | only when the song is unnamed. `nameFor` reads the record's text; a grep of `library/*.ts` for `publishedPoem` inside `nameFor` found nothing. NOT ESTABLISHED whether `nameFor` reads `inputText` or the poem (I did not read its body). |
| transcription state (`lines`, `transcribedText`) | `joinText` (`:2534-2560`) via `handleInput` | when Lyrics changes |
| `doc.publishedGlosses`, `doc.publishedGlossAnchors`, `poemMarks` | `:2385-2386` | only if the song had glosses before the fill |

For the walk's main case (a Lyrics paste into an empty song), only `doc.publishedPoem` changes, so `doc.inputText` is byte for byte what it was. For a scan or file, `doc.inputText` can change (re-lined). Step 4's snapshot still has to hold `doc.inputText` and `lastLaid`.

## 3. The replace guard and Poem's Clear

**Guard.** `handlePoemPage` (`+page.svelte:2391-2403`) calls `routePoemPage` (`text/poem-page.ts:27-33`):

```
const replace = () => { deps.put(text); deps.land('poem'); };
if (deps.held.trim() === '') replace();
else deps.ask(replace);
```

- It asks whenever Poem is non-empty (`held.trim() !== ''`). It has no notion of who filled Poem.
- `ask` opens the one replace dialog (`askToReplace`, `+page.svelte:2436`); the last answer is the safe one (`:2427`, `:2434`).
- It is reached only from `ScoreUploader`'s `onpoem` (`+page.svelte:4031`): a dropped page that reads as a poem.

**A paste into the Poem field has no guard today.** `IntakeViews.svelte:190` sends the Poem field's input straight to `onpoemedit` (`handlePoemEdit`), with no question. So walk item 7's "a paste replaces an unedited library poem with no question" already holds for the Poem field. The guard that step 4 must change is the page-drop one only.

**Clear.** `+page.svelte:3976`: `onclearpoem={() => (doc.publishedPoem = '')}`; the button is `IntakePanel.svelte:452`. It writes the field directly. It runs none of `carryPoemEdit`, `nameIfUnnamed`, or `adoptPoemLines`, so Lyrics is left as it is.

## 4. `TextArrival`, the IntakePanel values, `lyricsTakesPoem`

- `TextArrival` (`lib/one-action.ts:44-50`): `'boot' | 'paste' | 'typing'`.
- `'boot'` is passed only to `joinText` (`+page.svelte:3175`, `:3705`), never to `handleInput`, `handlePoemInput`, or `handlePoemEdit`. A restore therefore cannot reach Site C.
- A typed key gives `'typing'` and a paste gives `'paste'`: `IntakeViews.svelte:182-185`, `arrivalOf` returns `'paste'` when `inputType` is in `WHOLE` (`:167-180`: `insertFromPaste`, `insertFromPasteAsQuotation`, `insertFromDrop`, `insertFromYank`, `insertReplacementText`, `insertTranspose`, `historyUndo`, `historyRedo`), else `'typing'`. `IntakePanel.svelte` only forwards (`oninput` at `:76`, `:374`).
- **`lyricsTakesPoem` is false for a non-empty Lyrics:** `witness-lines.ts:154` requires `lyrics.trim() === ''`.

## 5. `introLine` and the six places a stored field lives

`lib/text/input-line.ts:12-16`:

```
if (view === 'poem' && scoreWords && poemText.trim() === '') return 'intake.view.landedLyrics';
if (landed === 'poem') return 'intake.view.landedPoem';
return view === 'poem' ? 'intake.view.poemLine' : 'intake.view.lyricsLine';
```

It is called at `IntakeViews.svelte:88`. Existing strings: `i18n.ts:824` (`poemLine`), `:825` (`lyricsLine`), `:829` (`landedLyrics`), `:830` (`landedPoem`).

Where `publishedPoem` lives, which `poemSource` must follow (all read):

1. `SongRecord`: `lib/library/types.ts:199` (`publishedPoem?: string;`, with the additive note at `:196-208`).
2. `SongFields`: `lib/library/library.ts:70`.
3. `fieldsFromRecord`: `library.ts:104`.
4. `recordFromFields`: the destructure out of `base` at `library.ts:121`; written only when set at `:141`.
5. `validateRecord`: `library.ts:264-265`.
6. The document: `$state` at `lib/library/document.svelte.ts:117`, `#snapshot` at `:296`, `#apply` at `:351`.

That is six places counting the document's three as one (the brief's count of six).

## 6. The input views and where an arrival lands

- `inputViews.land(where, poemBlank)` (`lib/text/input-views.svelte.ts:85-88`) sets `landed`, and switches the view to Lyrics only when `where === 'lyrics' && poemBlank && this.view === 'poem' && !this.#memory.has(this.#song)`.
- **The brief says "every arrival lands on LYRICS". That is not always so.** If the singer tapped a view for this song (`#memory`, `:46`), or the view is already Lyrics, `land` does not move it. After a library fill Poem is non-blank, so Site A's `land('lyrics', doc.publishedPoem.trim() === '')` (`:2829`) runs before the fill and sees a blank Poem; the library fill itself must call no `land`. If she had tapped POEM first, she stays on POEM, and the card must show above whichever field is showing, as the brief already says (step 5).
- `#memory` (`:46`) holds only a tapped choice, keyed by song id, never stored. The decline set can sit beside it.

## 7. The loader and the worker

- `DictionaryManifest`: `lib/loader.ts:113-120` (`version`, `hash`, `file?`, `files?`, `glossFiles?`). No `poemFiles` or `poemHash` today.
- `cleanLegacyCache(currentHash)`: defined `loader.ts:296`, called `:730` (`cleanLegacyCache(manifest.hash);`, fire-and-forget). It deletes `dict-` keys not starting `dict-${currentHash}` and `gloss-` keys not starting `gloss-${currentHash}` (`:314-318`) and the `LEGACY_CACHE_KEYS` (`:107`). It leaves other prefixes alone.
- `scheduleGlossTier`: `loader.ts:653-675`. It returns at once when the manifest has no `glossFiles` (`:657`), then runs `loadGlossTier` from `requestIdleCallback` with a 5000 ms timeout, else `setTimeout(start, 1500)`.
- `loadDictionary`: `loader.ts:683`. The tier scheduling is at `:790-791` (`scheduleGlossTier(manifest, dictionary); scheduleHomographTier(dictionary);`), after `state.isLoading = false` (`:784-787`), so it runs once the app is interactive.
- Worker exemption: `apps/web/static/sw.js:100`: `if (url.pathname.includes('dictionary.') && url.pathname.endsWith('.json')) return;`. `dictionary.poems.<hash8>.json` passes it. `dictionary-manifest.json` does not match (`dictionary-` has a hyphen) and is handled at `sw.js:114-117`.
- `data/` is served whole: `apps/web/static/data` is a symlink to `../../../data` (`ls -la`).
- The manifest today (`data/dictionary-manifest.json`): `version "2026-06-12"`, `hash "86d83340"`, `files` (2), `glossFiles` (2).

## 8. Findings that change the plan, and questions

**1. `+page.svelte` has one line of headroom.** `scripts/ratchets.json:8` sets the ceiling at 5586. `node scripts/ratchets.mjs` printed `apps/web/src/routes/+page.svelte: 5586 -> 5585`: the file is 5585 lines. The ratchet fails above 5586, so steps 4 and 5 can add at most one net line to `+page.svelte`. The hooks, the transitions, and the card must live in new modules (`lib/text/` has no module layering rule, `scripts/ratchets.mjs:78-85` lists only the six modules; a new file may hold 1000 lines, `ratchets.json:3`), with `+page.svelte` calling them in one line each. **DESK DEFAULT (mine):** I will do that, and I will not raise the ceiling. A raise is Dann's call, and I will say so if a step cannot fit.

**2. The hook should not key on `how === 'paste'` alone** (section 1, Site C): a blur tidy and an undo arrive as `'paste'`. **DESK DEFAULT (mine):** the match runs only from `handlePoemInput` when `how === 'paste'` and Lyrics was empty before this text and the new text is non-empty, so a tidy or an undo of an existing Lyrics cannot fire it. Reversible.

**3. A paste into the Poem field is both "an edit to Poem" and "a paste replacing it".** Step 4 says an edit sets `edited` and `answered`, and also that a paste replaces the poem and sets `poemSource` to `null` (walk item 7). `IntakeViews.svelte:190` gives `handlePoemEdit` an `insertFromPaste` as `'paste'`, and cannot tell a pasted word from a pasted poem. **DESK DEFAULT (mine), reversible:** in `handlePoemEdit`, a `'paste'` arrival whose text has no run of at least 20 consecutive letters in common (after the matcher's fold) with the library text replaces (`poemSource = null`); anything else, including every typed key, is an edit (`edited = true`, `answered = true`). A dropped poem page always replaces. Dann may prefer a simpler rule: any Poem-field input is an edit.

**4. Decline snapshot.** Section 2: on a Lyrics paste into an empty song nothing in Lyrics changes; on a scan or file it can be re-lined. The snapshot holds `doc.inputText`, `lastLaid`, `doc.publishedPoem`, `doc.publishedGlosses`, `doc.publishedGlossAnchors`, and `poemSource`.

**5. NOT ESTABLISHED:** whether `nameFor` reads the poem or Lyrics (section 2). Not needed for the plan: an unnamed song is named at its first `handleInput`, which precedes the async match.

## 9. Baseline, the eight gates

The brief and the contract do not list the eight gates. I read `docs/memory/STATE-archive.md:569`, which gives the baseline as "251, 248, 0 errors, 2448, 675 + 5 skipped, 145, 55, ratchets OK", and `.github/workflows/ci.yml`. **The numbers in that line are old (2026-10-15); the gate list below is mine, from `ci.yml` and the package scripts, and the live numbers are the ones I ran today.** NOT ESTABLISHED: which eight suites the owner counts. I ran every suite that exists.

Environment: fresh `pnpm install --frozen-lockfile` (pnpm 10.28.0, Node v22.23.4, Linux). Run at `979fdd78`, clean tree.

| # | Gate | Command | Result |
|---|---|---|---|
| 1 | phonology | `cd packages/phonology && pnpm test` | 13 files, 407 passed |
| 2 | dictionary | `cd packages/dictionary && pnpm test` | 4 files, 248 passed |
| 3 | blurb | `cd packages/blurb && pnpm test` | 2 files, 148 passed |
| 4 | score-parser | `cd packages/score-parser && pnpm test` | 35 files, 785 passed, 5 skipped (790) |
| 5 | web unit | `cd apps/web && pnpm test` | 222 files, 3898 passed, 1 skipped (3899) |
| 6 | integration | `pnpm test:integration` | 6 files, 98 passed |
| 7 | type check | `svelte-check --tsconfig ./tsconfig.json --output machine` | 975 files, 0 errors, 12 warnings (baseline 0 and 12, `ci.yml`) |
| 8 | ratchets | `node scripts/ratchets.mjs` | OK |
| | build | `pnpm --filter @ilya/web build` | succeeded |
| | e2e | `playwright test --project=chromium` | 82 passed, 8 failed (23.2 min) |

**The e2e baseline is not green in this sandbox: 8 of 90 failed at `979fdd78`, before any change of mine.** The eight, from the Playwright log (`PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`, project `chromium`, 1 worker):

1. `e2e/glue-typed-marks.test.ts:29` leaves «я #на» as typed, so two words are not fused (expected value mismatch)
2. `e2e/glue-typed-marks.test.ts:39` Control+Z after the blur returns the field to the ordinary space
3. `e2e/heic-offline.test.ts:43` a singer offline who never opened a HEIC can open one (1.1 min)
4. `e2e/heic-reader-path.test.ts:111` a HEIC poem with no staves reaches tesseract as a PNG (3.4 min; the log shows requests for `tesseract.js` and its `rus.traineddata.gz` from a CDN)
5. `e2e/insights-page.test.ts:95` the page runs the frame, the conclusion, then the moments, the totals, and the sources
6. `e2e/loupe-header.test.ts:47` a drag on the desk moves the card, holds while open, and resets on close
7. `e2e/print-pages.test.ts:20` Text, Markup, and Insights each print the pages Ilya numbers (`markup: pages printed against sheets on screen`)
8. `e2e/singer-paths.test.ts:169` Learn and Guide open and show their first heading in English and French

NOT ESTABLISHED: why each fails. I did not run them singly or read their assertions. Numbers 3 and 4 touch the network (offline mode, a CDN fetch), which this sandbox's proxy may block; the others I cannot attribute. Items 1 and 2 are the two glue tests that touch Lyrics blur and undo, the hazard in section 1. Later steps compare against these eight by name: a failure outside this list is mine.

Raw log: not committed (scratchpad). The eight names above are the record.
