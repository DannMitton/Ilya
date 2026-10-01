# Report from Code: the Text page says "Enter your Cyrillic text" while the Input holds the poem (QUEUE row 2j)

Code, 2026-09-30. Brief: `brief-code-text-page-empty-with-poem_r1_2026-09-30.md`. Code read on branch `Shane`, working tree dirty with rows 2b to 2i; the live reading was made on the branch alias, `93bc639`. No git writes.

## 1. The cause (written before any change)

**Reproduced in Dann's Chrome**, on the branch alias (`https://ilya-git-shane-dannmittons-projects.vercel.app/`), in a new tab Code opened, read-only. The song is "Without Sun, no. 1: Within Four Walls". The poem box holds the stored 8-line poem, and Text shows only `paper.empty`, with 0 verse rows.

**The dictionary had not finished loading, and Text says "enter your text" while it waits.** What the tab showed, 94 s after load:

- `document.visibilityState` is `hidden`.
- The drawer shows "Loading dictionary…" with an indeterminate bar.
- Only `dictionary-manifest.json` has been fetched. `singer-supplement.json` and `blurb-composer.json` come after the dictionary is parsed (`loader.ts`, `loadDictionary`, step 3), and neither has been fetched.
- The cache is intact: `ilya-data` holds 1154 keys under the current hash `86d83340`.

**Two defects compound.**

1. **The loader crawls in a hidden tab.** `mergeNDJSON` yields with `setTimeout(r, 0)` every 1500 lines (`loader.ts:383`), and the cache read yields the same way (`loader.ts:142`, `:431`). Chrome clamps timers in a hidden tab to about once a second, so each yield costs a second instead of nothing. The project has met this before, in the Browser pane: about 20 minutes to load (memory "Hidden pane throttles the dictionary"). The desk's tab, like Code's, was not the frontmost tab.
2. **Text cannot tell "no poem" from "poem waiting for the dictionary".** While the loader runs:
   - `lines` is empty, because the boot join answers `wait` (`+page.svelte:2994-2996`, `one-action.ts:104`).
   - `derivedLines` is empty by its own guard (`+page.svelte:438`).
   - So `textLines` is empty (`+page.svelte:451`), and `TitlePage.svelte:165-170` draws `paper.empty`, "Enter your Cyrillic text in the drawer on the left." That sentence is false whenever the box holds a poem. This breaks Dann's ruling of 2026-09-24 09:57.

**Ruled out:**

- **The pipeline on this poem.** The exact text from the box, run through `processText` with the real dictionary in a scratch probe, gives 8 lines and 37 words without throwing.
- **The join.** `transcribedText` is written in one place, `+page.svelte:2315`, just before `runPipeline()`. Every path that empties `lines` (`:2518`, `:3588`) also resets it.
- **A restore race.** `+page.ts` opens the song before the component exists (`+page.svelte:236-241`).
- **On localhost, visible headless Chromium:** a stored 8-line poem with Sunless 01 draws 8 rows before and after a reload. The defect needs the slow load.

**Observation 2, the grey poem: not placeholder style.** The box's computed colour is `rgb(26, 22, 18)`, `--ink-primary`, the colour of typed text. Its placeholder is `--ink-tertiary` (`IntakePanel.svelte:835-836`). What the desk read as lighter grey is NOT ESTABLISHED; it was not the placeholder.

## 2. The fix, smallest first

- **(a) Text tells the truth while it waits.** When the poem box holds text and the dictionary is still loading, Text shows the loader's own "Loading dictionary…" (an existing string) instead of `paper.empty`. Built differently on one point: a failed load draws no sentence on Text, because the drawer already shows the error and the loader's message is not singer copy (§3). This alone ends the false sentence.
- **(b) The loader stops crawling in a hidden tab.** The three `setTimeout(r, 0)` yields become a `MessageChannel` yield, which Chrome does not clamp in a hidden tab. Same yielding, same order, no other change.

## 3. What was changed

- **(a) `emptyTextNotice(shownPoem, loaderState)`** in `apps/web/src/lib/one-action.ts`, a pure function beside `transcribeVerdict`, and threaded down as one optional prop (`+page.svelte` → `Paper.svelte` → `TitlePage.svelte`). It returns one of three answers:
  - `enter`: the box is empty, so `paper.empty` is drawn, as before.
  - `loading`: a poem waits on the dictionary, so `dict.loading` is drawn, an existing string ("Loading dictionary…" / « Chargement du dictionnaire… »).
  - `quiet`: any other wait, a 600 ms typing pause or a failed load the drawer already reports, so no sentence is drawn.

  No new copy. `shownPoem` is what the box shows, so a derived poem counts. `+page.svelte` stays at 6016 lines.
- **(b) `yieldTurn()`** in `apps/web/src/lib/loader.ts` replaces the three `setTimeout(r, 0)` yields with a `MessageChannel` message, and keeps the timer where `MessageChannel` is missing.

## 4. Verified

**In the Browser pane, hidden** (`document.visibilityState` `hidden`), at `http://fitcheck.localhost:5173/` in French, with a stored poem and a cached dictionary, reloading on Text:

| Build | While loading, Text says | Poem drawn at |
|---|---|---|
| (a) with the old `setTimeout` yield, put back temporarily for this run | « Chargement du dictionnaire… » | 7.6 s |
| (a) and (b) | « Chargement du dictionnaire… » | 3.8 s |

- **(a) is verified:** the false sentence no longer appears.
- **(b) halves the hidden load in the pane.** The pane does not reproduce the once-a-second clamp Dann's Chrome showed (still loading at 94 s), so the size of the gain there is **NOT ESTABLISHED** until Dann's walk. Chrome clamps chained timers harder still in a tab hidden for more than a few minutes; `MessageChannel` tasks are not timers.
- **The fix is not on the branch alias yet.** Dann's walk needs `http://localhost:5173/` until this ships. To reproduce: open the song, switch to another tab for a minute, then come back.

## 5. The test

`apps/web/src/lib/one-action.test.ts`, "what the Text page says with no lines to draw", 3 tests. They pin the rule against Dann's poem shape: `enter` only for an empty box, `loading` while a restored poem waits, `quiet` otherwise.

**Not added: an end-to-end restore test.** The brief asks for one that restores a song and asserts Text draws it. In visible headless Chromium the old code passes it too, because the defect needs a throttled load. A test that cannot fail on the defect would only look like coverage. The unit tests pin the decision that was wrong.

## 6. The string (brief, last section)

`i18n.ts:1609`, `insights.figure.halfMass` FR « la moitié du temps chanté », RATIFIED by Dann 2026-09-30 23:21, replacing Code's « la moitié du chant ». « centre » is ratified as built. The comment at `i18n.ts:1601-1606` carries the ratification.

**Checked:** on Sunless 05 and T01 in French (headless, device scale 3), the longer label sits above the bracket, clear of the bars and their labels. On T01 it crosses the dotted C4 ledger line on its paper halo.

## Gates

| Gate | Before (after row 2i) | After |
|---|---|---|
| 1 phonology | 251 passed (251) | 251 passed (251) |
| 2 dictionary | 235 passed (235) | 235 passed (235) |
| 3 web-check | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files |
| 4 web-test | 1776 passed (1776) | **1779 passed (1779)**, +3 |
| 5 score-parser | 636 passed, 5 skipped (641) | 636 passed, 5 skipped (641) |
| 6 blurb | 145 passed (145) | 145 passed (145) |
| 7 integration | 55 passed (55) | 55 passed (55) |
| 8 ratchets | OK | OK |

The ship script's gate 4 baseline is still 1760; rows 2h to 2j move it to 1779.

## Files

`apps/web/src/lib/one-action.ts`, `one-action.test.ts`, `loader.ts`, `components/Paper/Paper.svelte`, `components/Paper/TitlePage.svelte`, `routes/+page.svelte` (one import, one prop), `i18n.ts`.

## Dann's Chrome

Code opened one tab on the branch alias, read the page, the console, the poem box, and the `ilya-data` cache keys, and closed the tab. Nothing was clicked, typed, or written. The app's own boot ran there as it does on any open.
