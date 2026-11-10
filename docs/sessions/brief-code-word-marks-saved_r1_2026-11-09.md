# Brief: the Inspector's word marks are saved with the song (Code, cloud lane, r1, 2026-11-09)

Written by the desk (Opus) 2026-11-09 21:4x. For Fable's review with the barline and time signature brief and the aria brief r2, then Code. Every line below was read by the desk on `cloud-lane-38` at `534d9981` this session. NOT ESTABLISHED beats a complete invented answer.

## 1. What the singer gets

She sets a stress on a word, restores an «ё», moves a syllable boundary, or marks a word for spot reconstitution in the Inspector. Today every one of these is gone when she switches songs or reloads. After this build each stays with the song: she reopens it tomorrow, on Lyrics or on Poem, and her marks are where she left them. Nothing new appears on screen.

## 2. The ruling

Dann, 2026-11-09 20:44: "The data must be preserved over sessions." It applies to every per-word Inspector mark, for both witnesses (Lyrics and Poem). It reverses the session-only form recorded in `apps/web/src/lib/text/word-marks.svelte.ts:11-13` ("These marks are session state and are never stored … review r2, amendment 5"). It does not touch the poem join's scan-repair marks, which stay session-only (Dann, 20:32). The coming per-word choices (the ‑кий rhyme reading, Spot Reconstitution's paradigm) ride on this storage.

## 3. Where it lives today

- `WordMarks` holds four maps, keyed `"lineIndex-wordIndex"` (the ё toggles with `-charIndex`): `stress`, `yo`, `syllables`, `spot` (`word-marks.svelte.ts:18-27`); `clear()` (`:30-35`); `carry(diff)` re-keys all four across a text edit through `rekeyByWord` and `rekeyByWordChar` (`:38-44`).
- The page owns two instances, `lyricsMarks` and `poemMarks` (`+page.svelte:438-439`); the shown witness's is `marks` (`:464`).
- They are dropped on a song switch: `resetSessionState()` calls `lyricsMarks.clear()` (`+page.svelte:1856-1860`), and the open path calls `poemMarks.clear()` (`:3129`). Syllable marks are also dropped whenever the global open-syllabification setting changes (`:2190-2195`, "Spec requirement").
- The pattern to follow is the gloss override: saved on the song as rows `[key, gloss, anchor]` (`library.ts:142-145`), loaded in `fieldsFromRecord` (`library.ts:84-96`), the Poem's twin as `publishedGlosses` (`:111-112`, `:162-163`), additive and optional on `SongRecord` (`types.ts:211`, and the comment at `:232`: "an older Ilya drops it and keeps the song").

## 4. The build

Lane: the desk names the branch in the prompt. One commit and one report per step, at `docs/sessions/report-code-word-marks-step<n>_r1_2026-11-10.md`. Do not edit `docs/memory/`.

### Step 0. Read and report, change nothing

Read in full `word-marks.svelte.ts`, `library.ts` (`fieldsFromRecord`, the record builder, `validateRecord`), `library/types.ts` (`SongRecord`), `document.svelte.ts`, the binder export and import, and every `+page.svelte` site that reads, clears, or writes `lyricsMarks` or `poemMarks`. Confirm or correct §3. Census (`CONTRACT.md` §4, "every other site"): every consumer of the four maps (the pipeline's `userStressOverrides` and `yoToggles` at `+page.svelte:445-446` and `:1807-1808`; `spotReconstitution` and `syllableOverrides` at `:1760-1761`; PAPER; `witnessLines`; `carryPoemEdit` at `:2354`) and what each does with a mark loaded at open rather than set in the session. Report the eight gates' baselines, run by you.

### Step 1. The record

`SongRecord` gains one optional additive field, `wordMarks?: { lyrics?: MarkRow[]; poem?: MarkRow[] }`, where a `MarkRow` is `[key, kind, value, anchor]`: `kind` one of `'stress' | 'yo' | 'syllables' | 'spot'`; `value` the map's value as stored today; `anchor` the word's clean form, as the gloss rows carry (`library.ts:142-145`). No schema bump. `validateRecord` keeps a well-formed field and drops a malformed row (not the song). Tests: round trip of each kind for each witness; a record without the field loads as today; a malformed row is dropped alone.

### Step 2. Save and load

The record builder writes the field from both instances; `fieldsFromRecord` returns it; opening a song loads both instances from it in place of `clear()`. A loaded mark whose `anchor` no longer matches the word at its key is dropped and counted (one console line naming the song and the count), so a mark never lands on another word. `carry(diff)` is unchanged and runs on edits as today. The global open-syllabification change still clears the syllable marks (the spec requirement at `:2192`), now saved as cleared. Tests: set one mark of each kind, save, reopen, each is back; edit the text so a word moves, save, reopen, the mark follows it; delete the word, the mark is gone.

### Step 3. The binder and PAPER

Export and import carry the field; PAPER prints what the page shows, as today. Tests: export, import into an empty library, marks intact.

### Step 4. Gates and report

All eight gates and both Playwright projects; one Playwright test: set a stress and a spot reconstitution on song 1, reload, both shown.

## 5. Out of scope

The poem join's repair marks; new Inspector tools; any string (none is needed).

## 6. What Code could not establish

Every report carries a section of this name.
