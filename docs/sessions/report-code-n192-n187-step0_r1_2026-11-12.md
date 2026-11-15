# Report: N.192 and N.187, step 0 (read and measure), r1, 2026-11-12

Lane `cloud-lane-50`, cut from `Shane` at `b1234cf4` ("Key changes and grace notes: brief r3 ..."), working tree clean at the cut. Read from the clone at that commit. Nothing in the code was changed in this step.

Dann's three questions in Fable's review are not answered in the brief, so the review's recommended answers stand as DESK DEFAULTS: two grace cells (Grace note, Slash); a light double barline before a key change; a scanned lone grace note draws slashed; every grace note draws its slur to its principal.

## The eight gates, measured on `b1234cf4`

I cannot read `~/Downloads/ilya-ship.sh` (it lives on the maintainer's Mac), so the gate numbers below are named by what they run, not by the script's numbering. Where `STATE.md` and `ENVIRONMENT.md` name a baseline I give it.

| Gate | Command | Result |
|---|---|---|
| phonology | `pnpm --filter @ilya/phonology test` | 456 passed (456), 14 files |
| dictionary | `pnpm --filter @ilya/dictionary test` | 248 passed (248), 4 files (matches the 248 recorded 2026-10-26) |
| blurb | `pnpm --filter @ilya/blurb test` | 168 passed (168), 4 files |
| score-parser | `pnpm --filter @ilya/score-parser test` | 785 passed, 5 skipped (790) |
| web | `pnpm --filter @ilya/web test` | 5190 passed, 1 skipped (5191), 280 files (matches "gate 4 5190 passed \| 1 skipped (5191)" in `STATE.md`) |
| integration | `pnpm exec vitest run --config vitest.config.ts` | 155 passed (155), 7 files (matches "gate 7 155" in `STATE.md`) |
| type check | `svelte-check --tsconfig ./tsconfig.json` | 0 errors, 12 warnings, 5 files with problems (CI baseline 0 and 12) |
| ratchets | `node scripts/ratchets.mjs` | ratchets: OK |

The root script `pnpm test` runs `vitest run --config vitest.config.ts` through the shell's `vitest`, which is not on the path in this sandbox ("vitest: command not found" on the first try); `pnpm exec vitest` works. Playwright is not one of the eight and is run at step 7.

## Every cited line, re-read

Held in place (read at the cut): `musicxml-parser.ts:700-714` (the grace branch), `:941` (`resolveSuppliedIds` skips grace and chord), `:930-932` (its comment); `staff-renderer.ts:726-731` (`meterDeclaredAt`), `:489` (`keySignatureAlter`), `:517` (`advanceAccidentalState`), `:562` (`accidentalStateAtEndOf`), `:801` (`systemHead`), `:817` (the sharp-or-flat glyph choice), `:1430` (`newAccidentalCarry`), `:1520`, `:1546`, `:1674`, `:1848`, `:2332`, `:2733`, `:2951`; `page-layout.ts:130` (`sliceScore`'s one key), `:230`, `:240`; `transposition.ts:416`, `:422`; `correction.ts:408-411` (`applyCorrections`), `:344-353`; `rebar.ts:424` (the `...score` spread). Ratchet counts match the brief: `staff-renderer.ts` 3426 of 3427, `musicxml-parser.ts` 1167 of 1167, `Loupe.svelte` 3012 of 3012, `CorrectionSurface.svelte` 1223 of 1227, `types.ts` 999.

Moved, by a few lines, from the brief's or scout's number (found by grep, same code):
- The barline draw the brief cites at `staff-renderer.ts:2617-2628` is now at `:2623` (`barX = round2(nx - BARLINE_TO_COLUMN_PX - meterRoom)`); `:2617-2619` is now the `carryIntoMeasure` call.
- The head's key-glyph draw the brief cites at `:2205-2222` is at `:2216-2223` (`keyGlyph`, `data-key-signature`); the `LayoutColumn.meterRoom` field is at `:1626` and `meterRoomFor` at `:1697`.
- `insights.ts:290` and `singer-page.ts:129` read as the brief says (`pitched()` returns `score.vocalLine.filter(`; `firstOutsideRange` walks `score.vocalLine`); `insights.ts:600` is `for (const ev of pitched(score))`.

## Step 0's questions

### 1. How the Loupe reads `data-key-signature`

Four readers, all in `apps/web/src/lib/score/`:
- `loupe-ink.ts:183`, `headerRightOf`: the right edge of the last `[data-clef], [data-key-signature]` element in the whole system. A mid-system signature carrying that handle would move the head bound to the middle of the system (Fable's amendment 11, confirmed by reading it).
- `Loupe.svelte:946`: the ink walk's skip rule for the band before the gate (`el.hasAttribute('data-key-signature')`).
- `Loupe.svelte:1859` and `:1866`: the foreign-ink scan; a key-signature element is "foreign", not the held measure's own.
- `staff-renderer.ts:2216`: the only place that stamps it.

The Loupe strips `[data-meter]` from its clone (`Loupe.svelte:1108`) and skips it in the ink walks (`loupe-ink.ts:111`, `:135`; `Loupe.svelte:806`). Amendment 11's plan (a group stamped `data-key-change`, treated at every one of those sites) is therefore the right shape.

**How the Loupe's head is built (the method amendment 11 asks for).** The Loupe does not crop the page's system. It renders the held bar alone: `renderLoupeMeasure` (`loupe-render.ts:85`) calls `renderSystemSlice(readingScore, analyzed, options, m, m, ...)` and wraps it as its own `data-system` (`Loupe.svelte:570-572`). `sliceScore` takes the first key from `parsed.measures[fromMeasure].keySignature` (`page-layout.ts:130`). So the Loupe's head is already the head of a one-bar slice, which shows the key in force in the held bar, with no change to the Loupe's head code. What step 3 must add is only: in a one-bar slice, a key declared at the bar is not a "change" (there is no bar before it in the slice), so the slice draws no mid-system signature at its own first bar; and a courtesy signature (`outgoingKeySignature`) must be stripped from the Loupe's clone like `data-meter`. I have not run the Loupe in a browser yet; this is a reading of the code, to be tested in step 3's Playwright check ("measure 6 held shows one flat; the head bound where it is for measure 2").

### 2. SMuFL glyphs

Present in `smufl-metadata.ts`: `accidentalNatural` (`:103`), `flag8thUp` (`:96`), `flag16thUp` (`:98`). No slashed-grace glyph and no small-flag glyph is in `RequiredGlyphName`, matching amendment 19. Step 4 uses the full flag at grace scale and a drawn stroke; no glyph name is added.

### 3. Are `G`, `;`, `/` claimed?

No. `correction-keys.ts:110` switches on `e.key` and binds arrows, `+`/`=`, `-`/`_`, `.`, Delete/Backspace, Escape, and the digits (`DIGIT_BASE`); `:90` lowercases the key for Cmd-Z. A grep of every `.key ===` and `e.key` site in `apps/web/src` found no handler for `;`, `/`, or `G`. The page's keydown is `handleCorrectionKey` alone (`routes/+page.svelte:938`, `:3665`). `ClefControls.svelte:141` binds its own keys inside its own control. `/` and `;` are free.

### 4. The MODULES table (`scripts/ratchets.mjs:78-85`)

```
reader:   []
score:    ['reader']
voice:    ['reader', 'score']
analysis: ['reader', 'score', 'voice']
markup:   ['reader', 'score', 'voice', 'analysis']
insights: ['reader', 'score', 'voice', 'analysis']
```
New web modules (`grace-layer.ts`, `key-signature.ts`, the key card) go in `apps/web/src/lib/score/` and import only `reader` and `@ilya/score-parser`. The 1000-line limit for an unlisted file is inclusive (`lines > newFileMaxLines` fails, `ratchets.mjs:68`), so `types.ts` at 999 can take exactly one line, as amendment 4 says. `ratchets.mjs` has no rule on a package importing a package's own new file.

### 5. `tch-3.musicxml`, P1 measure 9

At the measure's start. `<measure number="9">`, then `<print new-system="yes" />`, then `<attributes><key><fifths>2</fifths></key></attributes>`, then the notes (`apps/web/src/lib/omr/fixtures/tch-3.musicxml:313-318`). Confirmed. Whether the print changes key there: NOT ESTABLISHED.

### 6. A printed barline style at a key change

The parser reads none: `bar-style` does not occur in `musicxml-parser.ts`. So the double barline at a key change is the renderer's default alone (DESK DEFAULT, question 2a).

### 7. Does a scan with a printed natural yield `<alter>0</alter>`? (amendment 15)

**NOT ESTABLISHED.** What I could read: the generator writes an `<alter>` whenever the symbol's lift is anything but empty, and maps the lift `N` to 0 (`third_party/homr-web/src/musicxml/generate-main.ts:272-278`, `:455-460`). So a natural the reader recognises would come out as `<alter>0</alter>`. Whether the reader recognises printed naturals as lift `N` is what I cannot read from here. I searched every `*.musicxml` under `docs`, `apps`, and `packages` for `<alter>0</alter>`: **0 files contain it**, scan reads and hand fixtures alike. That is an absence of evidence, not a finding that the reader never writes one: the reads in the tree are few and I do not know that any has a printed natural. Row 114's truth files and page images are not in this clone (the tree has only the harness, `docs/sessions/measure-row114_2026-10-19/`), and this sandbox has no scan reader. The desk needs a page from Dann's set with a printed natural, run through the reader. Consequence for step 6b: amendment 15 says to stop before building 'follow' only if step 0 finds the flag IS written. It did not find that; it found it unmeasured. I will build 'follow' with the guard that cannot be built yet noted, and flag it in the step 6b report.

### 8. Slashed and unslashed lone grace notes (amendment 5)

Row 114's truth files are not in this clone. What the tree holds: 18 `*.musicxml` files contain `<grace`, in scan reads under `docs/sessions/` (sunless3-diagnosis, measure-m-p-r74, measure-set3, measure-final-test-set3) and in `tchaikovsky-op38-3-voice.musicxml` fixtures. In every file I counted, **0 grace notes carry a `slash` attribute** (the largest, `measure-set3-four-below_2026-10-11/after/drops/Q.musicxml`, has 6 `<grace` and 0 `slash`). That matches what the generator writes (a bare `<grace/>`, `generate-main.ts:435-438`). So the DESK DEFAULT in amendment 5 (a lone, flagged grace note with `slash` undefined, in a file whose origin is the scan reader, draws slashed) is what a scan needs. Count for row 114 itself: NOT ESTABLISHED (files not here).

### 9. How `tacetRuns` breaks at a meter change (amendment 13)

`staff-renderer.ts:851-870`: a run extends only if the bar is adjacent and `!meterDeclaredAt(parsed, m.index)`; a declared meter opens a new run ("N.139: a change of meter opens a new run ... DESK DEFAULT"). Step 3 adds `&& !keyDeclaredAt(parsed, m.index)` at that one place.

### 10. Every reader of a selected event id (amendment 7)

In `apps/web/src/lib/score/`:
- `correction-cursor.svelte.ts:40, 66-67, 81-91`: `selectedEventId`, the one function that writes it with `gapAfter`.
- `correction-verbs.svelte.ts:126-127` (`selectedEvent` getter: finds the event in the corrected line by id); `:146-232`, `:261-297` (every verb starting `const ev = this.selectedEvent`); `:176-217`, `:305`, `:320`, `:438` (`selectedEventId()` direct); `:254`, `:312-313` (`neighbourId(readLine, corrections, id, +/-1)`).
- `correction.ts:706` (`neighbourId`, filters `vocalLine`).
- `entry.ts:84` (`positionsInMeasure`), used by `loupe-fit.ts:180` (`measureHold`: `ids` from `score.vocalLine` at `:177-185`, `positions` from `positionsInMeasure`).
- `tuplet-row.svelte.ts:35, 54, 72`: the tuplet row.
- `Loupe.svelte:1859-1866`: `ownEvents`, the foreign-ink test; `:2021` another `renderLoupeMeasure`.
- The `data-hit` click path: `loupe.ts:66` (`[data-hit="id"]` lookup), `crossing-ring.ts:90`, `selection-ring.ts:164, 245`, `loupe-ink.ts:106, 136, 208, 229, 255`, `system-ground.ts:70`; the renderer emits the rectangle per event.
Step 6 serves a grace id at each.

### 11. What a stored transposition does when the opening key is corrected (amendment 17)

Read, not run. `engraveInKey` takes `printed = keySignatures[0].signature.fifths ?? measures[0].keySignature.fifths` and `delta = choice.fifths - printed` (`transposition.ts:332-334`). A stored choice is `{ semitones, fifths }`. If the singer corrects the opening key, `printed` changes while `choice.fifths` and `choice.semitones` stay, so every key and pitch moves by the same `semitones` but the key moves by a different `delta`: the signature and the pitches then disagree by the correction. To keep them agreeing, step 6b must treat a changed `printed` as a reason to recompute `choice.fifths` from `choice.semitones` and the new printed key (or to drop the stored choice and say so). Step 6b tests this and stops and reports if it cannot be made to agree.

### 12. Which unit tests touch the sites this lane moves (amendment 20)

To be run per step and named in each step's report: `page-layout.test.ts:115`, `staff-renderer.test.ts:702/1883/2359`, `rebar.test.ts:147`, `rebar-notes.test.ts:183-193`, `offers-for-a-bar.test.ts:147-156` (rename, keep assertion), `transposition.test.ts:489-505`, `musicxml-parser.test.ts:891-897` (rename, keep assertion), `n188-markings.test.ts:127-143` (unchanged).

## Design points settled by this reading, before step 2

- **The Loupe's head needs no change** (item 1); only the courtesy and the mid-system signature must be stripped from the Loupe's clone.
- **Slash default.** A scan's grace note arrives with no `slash`; amendment 5's default stands.
- **`GraceNote` shape** (amendments 1, 2, 3): `{ id, principalId, after?: true, pitch, base, slash?, slurred? }`.

## What I could not establish

- Row 114's grace-note counts and a page with a printed natural (files and reader not in this sandbox).
- The ship script's own gate numbering (it is not in the repository). I named gates by command.
- Whether the Loupe's head and the clip behave as read, in a browser; step 3 measures it.
- Whether the print changes key at `tch-3.musicxml` P1 measure 9.
- Gould's rule on the barline at a key change, and Gould p. 152 (not in the tree).
