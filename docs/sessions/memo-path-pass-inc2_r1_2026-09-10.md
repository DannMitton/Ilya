# Memo: the path pass, increment 2

Code, `~/Desktop/ilya-rewrite`, branch `Shane`, HEAD `0f7e89d` plus this working tree. No git was run. Answers `docs/sessions/brief-path-pass-inc2_r1_2026-09-10.md`. Serves THE DRAWER AS A PATH, step 3.

**New file for Dann to `git add`:** this memo. **Files changed:** `apps/web/src/lib/components/Drawer/{Drawer.svelte, IntakePanel.svelte, sections.svelte.ts, bandState.ts, bandState.test.ts, sections.test.ts}`, `apps/web/src/lib/i18n.ts`, `apps/web/src/routes/+page.svelte`, and `docs/memory/PRODUCT.md`. Untouched: `VocalLineEvent`, `apps/web/src/lib/shane/reconciliation/`, and `underlay-donor.ts`. **Strings:** none new. **French owed:** nothing.

**The anchor memo, re-verified.** Its `Drawer.svelte` template lines were about 500 off: TEXT's `<section>` stood at `:540`, not `:1055`. Its CSS lines, its `+page.svelte` lines, and its `bandState.ts` lines held. `STATION_IDS` is declared at `sections.svelte.ts:70`.

## What shipped, per item

### 2.1 Corners on a closed band

- **Reproduction: not reproduced.** On a local production build of HEAD (`app.BbQ6v8KM.js`) at 1400 px, I closed INPUT twice: once empty, and once holding an 8-line poem with its state line showing. Both times the screenshot drew rounded corners, and so did SCORE MARKUP at rest. The Browser pane scales a 1400 px viewport to 800 px, and the pane was hidden (`document.hidden` was `true`). Either could hide a paint defect.
- **Cause: NOT ESTABLISHED.** The anchor memo's candidate, a child transform promoting a layer under the parent's clip, is untested.
- **Fix, `Drawer.svelte:1068-1093`.** The corners no longer depend on `.group`'s clip (`:1026-1031`) surviving a paint:
  - `.group-band` carries `border-radius: 20px 20px 0 0`, because the band is the one child whose fill reaches the group's corners.
  - `.group-band:last-child`, which is a closed band with no state line, carries `8px 16px` at the bottom. That curve is the one the group's own corner already cuts across a 40 px band standing on 4 px of padding, drawn a hair outside it. While the clip works, nothing on screen changes.
- **Verified** at 1400 px after closing each of the three bands (W2a, W2b, W2c), and at 390 px (W6b). Computed radius on all three bands: `20px` top, and `8px 16px` bottom while the band is the last child.

### 2.2 TEXT folds into INPUT

- **`Drawer.svelte`:**
  - TEXT's section is gone, with a comment in its place (`:542-545`).
  - The `textGroup` and `textState` props are gone (`:84`, `:124`).
  - `bandHead` loses its `apparatus` argument (`:481`), and `.band-state.apparatus` goes with it, because TEXT was its one caller.
  - `.group-text .group-band` is gone (`:1105-1112`).
- **`sections.svelte.ts`:**
  - `STATION_IDS.text` is `'text'` (`:76-87`), and `BAND_IDS` holds three ids (`:90-110`).
  - DESK DEFAULT: the fold reuses the band's wire value. A stored `text` meant "Notation and Analysis in view", and it still does, so no version bump is needed.
  - The fold is a **third tier**, set up by `tierOf` (`:128-145`) and used by `toggle` (`:387`) and the phone migration (`:205-211`). Without the tier, a phone singer opening Notation would shut the fold that contains it. Walked at W6d.
- **`IntakePanel.svelte`:**
  - Import at `:10`, props at `:120-135`, markup at `:622-653`, and CSS at `:1147-1204`.
  - The header row is `StationHeader`, reading `group.text` with the drawer's one chevron.
  - DESK DEFAULT, the brief's: the fold sits below the uploader's answers (`:620`) and above Transcribe and fit (`:660`).
  - DESK DEFAULT: one station hairline above the fold, and none below it.
  - The two stations inside drop the drawer's 18 px side inset (`:1163-1166`), because the intake already took it. Measured offset from the intake: 0.
- **`+page.svelte`:** `textGroup` moved into IntakePanel's children verbatim, as `textSection` (`:4266`). Its three props are at `:4176-4178`.
- **Persistence:** the fold joins `ilya:openStations`. Notation stays unpersisted (`sections.svelte.ts:62`), as ruled.

### 2.3 What the fold says

- **`textStateLine` is reduced, not deleted** (`bandState.ts:137-156`). It returns `''` at zero departures and the counted phrase otherwise, so the count keeps one owner.
- DESK DEFAULT: the phrase is drawn only while the fold is **closed** (`IntakePanel.svelte:646`). That is the band grammar one level down: a closed section says its state, and an open one shows its content.
- **Style:** the state line's recipe (`:1173-1180`). Measured: `14px`, `rgb(74, 69, 64)`, `tabular-nums`.
- **The deleted key:** `text.state.default` is deleted from `i18n.ts` in both languages (comment at `:63-69`). DESK READING of "its French twin": its row in the ruled French table, formerly `docs/memory/PRODUCT.md:180`, is deleted too. Restoring the row is one line.

### 2.4 One primary while a score waits

- **The predicate:** `transcribeActs` is `canTranscribe && doc.inputText !== transcribedText && uploaderEl?.hasWaitingScore() !== true` (`+page.svelte:3493-3495`, comment at `:3473-3483`). `handleTranscribe` is untouched (`:2361-2398`).
- **HEAD, after the `.musx` drop:** the filled pills were `["Continue to analysis","Transcribe and fit"]`.
- **Now:** only `["Continue to analysis"]` is filled, and Transcribe and fit is `btn-ghost` and enabled, at 1400 px (W3a) and at 390 px (W6c).
- **After Continue:** nothing is filled, because `handleArrival` flushed the text first (`:2881`).

### 2.5 INPUT's line after reload: timing, no code changed

I reloaded with Score markup active (`ilya:activeTab` = `shane`) and INPUT closed:

- **HEAD:** the line read `8 lines` at 0 ms and completed on its own to `8 lines · 50 words · 0 / 84 placed` at 4848 ms.
- **New build:** `8 lines` at 0 ms, complete at 4579 ms.
- **No tab switch was needed**, and a switch to Transcription afterwards changed nothing.

The word and placed parts wait on `hasResults` (`+page.svelte:2048`, passed at `:2112`). `hasResults` fills when the dictionary-ready effect runs `joinText('paste')` (`:2851-2858`). Dann's tab switch most likely landed after that effect. The walk ran with the hidden pane's timer clamp lifted by an inaudible tone, so real-browser timing will differ.

### 2.6 `from score` on a `.musx` arrival: the seam

- **The path:** a `.musx` goes through denigma to MNX (`apps/web/src/lib/shane/ingestion/ingest.ts:198-209`), and the walk showed `Format: Finale .musx → MNX`. The MNX parser sets no `workMetadata` (`packages/score-parser/src/mnx-parser.ts:746-749`), so `onScoreIngested` receives `undefined` and only clears (`apps/web/src/lib/metadata-provenance.ts:153-171`).
- **On a fresh profile, the same Kabalevsky file filled no PIECE field**, on HEAD and on this build. PIECE's closed line was empty after Continue (W3b).
- **So the five fields did not come from the file.** Two seams put fields there without the tag:
  - the singer's own typing (`+page.svelte:3566-3568`)
  - a library song opened by `switchSong` (`:3292`), which brings back that song's own metadata and tags (`apps/web/src/lib/library/document.svelte.ts:271`)

  One road to the second seam: a drop onto a neutral song whose fingerprint matches a stored song asks "Ilya has met this music before", and **Open that song** calls `switchSong` (`+page.svelte:2914-2926`).
- **No fix proposed.** The tag follows the file, and a `.musx` has no header to tag.

## N.121(c): what Transcribe and fit still does

Since N.112, the text transcribes itself. A paste transcribes at once, and typing transcribes after a 600 ms pause (`apps/web/src/lib/one-action.ts:41`, `:98-106`; `+page.svelte:2805-2826`). So when a singer presses the button, step 2's `transcribeText()` (`+page.svelte:2367`) usually re-runs the pipeline over text it has already read. `transcribeVerdict` would have answered `nothing` for that text (`one-action.ts:103`). The re-run clears the selected word and the error line (`+page.svelte:2190-2194`), and otherwise shows the same result. Three things remain:

1. Inside the 600 ms pause, it transcribes now rather than 600 ms later.
2. Step 3 accepts a waiting score (`:2368`, `ScoreUploader.svelte:550-554`) through the same `accept()` that **Continue to analysis** calls, so it is a second door to Continue.
3. Step 4 plays the breath-in and moves focus to the first word on the paper (`+page.svelte:2369-2396`).

Cmd+Enter in the poem field presses it as well (`IntakePanel.svelte:329-334`). Not renamed.

## The walk, on a local production build

The build is `app.Dlz97he6.js`, confirmed by the loaded entry hash. I wiped the profile's storage, service worker, and IndexedDB before steps 1 and 6. The `.musx` was staged in `build/reader/` and deleted afterwards. The screenshots W1 to W6e are in this session's transcript and are not saved to disk.

1. **W1, 1400 px, fresh:** three bands. INPUT is open with the placeholder and the caption. The Text fold is closed under the box with nothing beside it. PIECE and SCORE MARKUP are closed with nothing under them. No pill is filled. The open set is `{"v":3,"open":["input"]}`.
2. **W2a to W2c:** I closed INPUT, then opened and closed PIECE, then SCORE MARKUP. Corners are rounded on all three, with the computed radii in §2.1.
3. **W3a:** I pasted Pushkin's "Я вас любил" (public domain) and dropped `Kabalevsky - Shakespeare - T05 Cupid laid by his brand, and fell.musx`. While it waits, one pill is filled. **W3b**, after Continue: nothing is filled, PIECE is empty, and the score receipt names the file.
4. **W4a:** the fold opened, holding Notation (open) and Analysis flush with the intake, and the open set became `["input","text"]`. **W4b:** I flipped stress acutes and closed the fold, and the header read `1 of 7 changed`. With the fold open, it read nothing. **W4c:** I flipped it back, and the header read nothing.
5. **W5:** I reloaded with Score markup active. The line read `8 lines` at 0 ms, the full line at 4579 ms, and the same full line after the tab switch.
6. **390 px, fresh (W6a):** the same first state after the drawer is raised.
   - **W6b:** INPUT closed with rounded corners.
   - **W6c:** one filled pill while the score waits.
   - **W6d:** opening Notation left the fold open. The fold read `1 of 7 changed` after one toggle and nothing after the flip back.
   - **W6e:** after a reload the open set was still `["input","text"]`: INPUT open, and the fold open with Notation and Analysis.

**Seen in passing:** several screenshots (W2a, W4a, W4c, W6b) caught a chevron part-way through its rotation a second after the click, while `aria-expanded` already read correctly. I read this as the hidden pane painting late, not as a defect. NOT ESTABLISHED.

## Gates

| gate | result | baseline |
|---|---|---|
| phonology | 216 passed | 216 |
| dictionary | 235 passed | 235 |
| web-check | 0 errors, 7 warnings in 4 files | same |
| web-test | **1104 passed (1104)** | 1103 |
| score-parser | 547 passed, 5 skipped (552) | same |

**Web-test moved +1.** `sections.test.ts:85` is new: the fold is a station id in a tier of its own. In `bandState.test.ts`, `is never empty` pinned the struck behaviour and is gone. The brief's test, which checks that the phrase is absent at default and present after one toggle, is new at `:146`. That file nets zero. **Move `~/Downloads/ilya-ship.sh:79` to `1104 passed (1104)` before the ship.** The gates ran before one comment-only edit to `i18n.ts:66-69`, which removed a quoted French string.

## NOT ESTABLISHED

- **2.1, the cause, and the defect itself.** It did not reproduce on HEAD in the desk's pane: 1400 px scaled to 800, with the pane hidden. The fix is geometric and does not depend on knowing the cause. Whether Dann's square corners are gone needs his eye on a visible browser at 1400 px.
- **2.6, where Dann's five PIECE fields came from.** The file did not fill them on a fresh profile. His typing, or a stored song opened through `switchSong` (possibly through **Open that song**), are the two seams in the tree. Settling which one needs his library or his memory of the drop.
- **"Its French twin", as the desk read it.** I deleted the `Grayson defaults` row from `PRODUCT.md`'s French table. If the brief meant only the `fr` half of the `i18n.ts` key, the row comes back in one line.
- **One primary in the uploader's question states.** `ScoreUploader.svelte:759` and `:796` draw their own `btn-primary` while a PDF or picture question is open. Whether Transcribe and fit is filled beside them at that moment was not walked, and this ship does not change it.
- **Phone tiers beyond the fold.** On a phone, opening a station in PIECE, such as Repertoire, still shuts Notation, because both are stations. That is today's rule, not walked in the new layout.
- **Taste, all Dann's on the walk:** the fold's place under the uploader's answers, its hairline, the phrase hidden while the fold is open, and the 36 px inset I did not draw.
- **A stale comment:** `RootPanel.svelte:14` still names `textGroup`. It is a historical comment, and I left it.
