# Report: word marks saved, step 0 (Code, cloud-lane-42, r1, 2026-11-10)

Read at branch `cloud-lane-42`, cut from `origin/cloud-lane-38` at `534d9981`, working tree clean apart from the three filed documents (commit `ddc6a0b`). Nothing changed in `apps/`, `packages/`, or `docs/memory/`.

## 1. The eight gates, run by me at the start

| # | gate | result |
|---|---|---|
| 1 | `pnpm test:phonology` | 456 passed |
| 2 | `pnpm test:dictionary` | 248 passed |
| 3 | `pnpm --filter @ilya/web check` | 0 errors, 12 warnings |
| 4 | `pnpm --filter @ilya/web test` | 4707 passed, 1 skipped |
| 5 | `pnpm --filter @ilya/score-parser test` | 785 passed, 5 skipped |
| 6 | `pnpm test:blurb` | 168 passed |
| 7 | `pnpm test:integration` | 125 passed |
| 8 | `pnpm ratchets` | OK |

These equal the desk's figures. One fact that binds the whole build: `apps/web/src/routes/+page.svelte` is at 5534 lines, and its ceiling in `scripts/ratchets.json` is 5534. Every line this work adds to the page must be paid for in the same step by a line taken out.

## 2. Section 3 of the brief, confirmed

Every cited line holds on the tip (Fable's check, and mine for the ones I opened): `word-marks.svelte.ts:18-44`, `+page.svelte:438-439`, `:464`, `:1856-1860`, `:2190-2195`, `:3129`, `library.ts:84-96`, `:111-112`, `:142-145`, `:162-163`, `types.ts:211`, `:232`. No correction. Two additions:

- `recordFromFields` is pure plain TypeScript and `fieldsFromRecord` too (`library.ts:84`, `:135`); the document's `#snapshot` (`document.svelte.ts:297-318`) is what the save effect tracks, and `#apply` (`:350-379`) is where loading happens under the `#applying` guard. The two `WordMarks` are constants of the page, so the document cannot see them (Fable's amendment 1 of brief 2 stands).
- A `$state` Map is not proxied by Svelte 5; each mark change replaces the Map, and that replacement is what an effect tracks. The document's effect will therefore see a mark change as soon as `#snapshot` reads the maps.

## 3. Census: every consumer of the four maps, and what a mark loaded at open does there

Stress and ё (inputs to the engine). A loaded mark is read by the first transcription exactly as a session mark is read by the next one, so loading must come before it (and it does, see section 5).

| site | reads | a mark loaded at open |
|---|---|---|
| `runPipeline`, `+page.svelte:1805-1809` | `lyricsMarks.stress`, `.yo` into `processText` | applied in the first run; the stored seats were made with these marks, so this is the right state |
| `derivedLines`, `:440-452` | same, for Lyrics that come from the score | needs `derivedPoem`, known only after the stored scan is read: Fable's amendment 5 |
| `witnessLines`, `witness-lines.ts:26-33`, called `:472` | `poemMarks.stress`, `.yo` | the Poem's text is on the record, so marks apply at once |
| `buildSlotQueue` and the heal, `pairings.ts:990` region, `healFrozenSeats` at `:1934` | the engine's lines (clitic promotion by a stress mark changes the queue) | a mark applied after the first transcription would let the heal judge seats against the wrong lines: marks load before it |

Spot and syllables (display time).

| site | reads | a mark loaded at open |
|---|---|---|
| `drawnUnderlay`, `:1757-1763`, `drawPairings` `pairings.ts:886-991` | `lyricsMarks.spot` (`has(key)`), `.syllables`, Lyrics only whatever witness is shown | applied at first draw |
| `effectiveLines`, `:1740-1741`, `applyOpenSyllabificationToLines` | `marks.syllables` (shown witness) | applied at first draw |
| PAPER, `:4310`; `Paper.svelte:92-96`, `VerseLine.svelte:34-79`, `WordStack.svelte:35`, `TextFitProbe`, `TitlePage`, `SubsequentPage` | `marks.spot` as `has(key)`, meaning "invert the setting" | see section 4, the 22:20 ruling |
| `buildProvenanceLegend`, `provenance.ts:174-216` (via PAPER) | `spotReconstitution.has(key)` | same |
| ReadingAid, `:4344`, `ReadingAid.svelte:28-72` | `marks.spot` | same |
| Inspector, `:4076-4092`, `InspectorPanel.svelte:42-61`, `:378`, `:1018` | `marks.yo`, `.syllables`, `.spot`, `.stress` for the selected word | shown as set; `hasEdits` (`:378`) reads `spotReconstituted` |
| `handleReset`, `:2264-2275`, `word-reset.ts` | all four, by word key | unchanged |
| `handleOpenSyllabificationChange`, `:2190-2195` | clears both witnesses' syllables | now a change the effect saves, which is the "saved as cleared" of the brief |
| `carryOverridesAcross`, `:2005-2009` | `lyricsMarks.carry(diff)` | see section 5, the pause gap |
| `carryPoemEdit`, `witness-lines.ts:129-139`, called `:2354` | `poemMarks.carry(diff)` on every Poem edit, at once | the Poem has no pause gap |
| `resetSessionState`, `:1856-1860`; `switchSong`, `:3129` | `lyricsMarks.clear()`, `poemMarks.clear()` | the two clears the brief names; see section 5 |

## 4. The 22:20 ruling changes what `spot` means; the consumers do not need to change

Today `spot` is `Map<key, true>` and presence means "the opposite of the device-wide Reconstitution setting" (`WordStack.svelte:35`, `VerseLine.svelte:34`, `InspectorPanel.svelte:54`, `pairings.ts:990`). Dann ruled (22:20, option 2) that a saved mark records the choice for the word. Plan, decided here: the stored and in-memory value becomes the choice (`true` reconstituted, `false` reduced), and the page hands every existing consumer a derived map of only the words whose choice differs from the current setting. Those consumers keep their `has(key)` reading, so none of them changes. Detail in the step 1 and 2 reports.

## 5. The mechanisms Fable named, traced

- **First transcription and `carry`.** `transcribeText` (`:1905-1913`) diffs from an empty grid on the first run (`emptyDiff()`), so `carry` does nothing and loaded keys stay. That is right only if the stored marks and the stored text describe the same words. They can part: the text is saved as typed, and the marks are re-keyed when the quiet pause fires (`joinText`, `:2515-2535`). Fable's amendment 4 stands, and the plan is to key the saved rows to the grid the marks describe (a field on the document), not to the text.
- **Three ways a song opens.** Boot (`:249-262`, `data.opened`), `switchSong` (`:3116-3141`), and the document's reload of a remote write (`document.svelte.ts:388-403`). All three construct or `#apply`, so loading belongs in `#apply`. `handleClear` and `handleNewSong` are the two that start empty.
- **The poem join at open.** It does not run at open: `poem-offer.svelte.ts:136` schedules the join only `if (how !== 'boot')`. A join rewrite later is an ordinary Lyrics edit through `handleInput` and reaches `transcribeText` and `carry` like any other.
- **The binder.** `buildBinder` writes `raw ?? record` as `song.json` (`binder.ts:158-164`), and `readBinder` passes each parsed record through `validateRecord` (`binder.ts:238`). So an unknown field is dropped on import and a known one is kept, and the field rides the record with no binder change beyond `validateRecord` (step 3 is therefore a test).
- **Size of the page.** See section 1: the page is at its ceiling.

## 6. What I could not establish

- Whether any song in a real library carries both Lyrics derived from the score and marks: there are no marks stored anywhere today, so this is a design case, not a measured one.
- How `handleNewSong` and a binder import reach the page's marks beyond reading their call sites: both go through `SongDocument.open`, so they load, but I did not walk them in a browser.
- The document's reload path (`#onRemoteWrite`) with marks: it will `#apply` another tab's marks over this tab's, and I have not decided what the page's `transcribedGrid` should do then (the old one stays).
- Anything about Playwright baselines: they run at the end (step 4), not here.
