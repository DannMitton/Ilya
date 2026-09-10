# Brief: the drawer as a path, the path pass

**From:** the desk (Fable), for Dann. **To:** Claude Code, `~/Desktop/ilya-rewrite`, branch `Shane`. **Date:** 2026-09-10. **Revision 1.**

**Self-contained.** Every anchor below comes from `docs/sessions/memo-anchors-path-pass_r1_2026-09-10.md` (Sonnet, read-only, 2026-09-10). Re-read each one before you edit it; the tree wins over the memo. The rulings come from `docs/memory/PRODUCT.md` §The drawer grammar and the path, and the drawing is `docs/sessions/drawing-drawer-front-side_r2_2026-09-10.html`, Plates A to D. Open both before you start.

**NOT ESTABLISHED beats a complete invented answer.**

## 0. Ground rules

- No git. Dann ships with `ilya-ship.sh`. Ask him to `git add` any new file.
- The five gates hold at baseline: phonology 216, dictionary 235, web-check 0 errors and 7 warnings in 4 files, web-test 1076, score-parser 547 passed and 5 skipped. Report any movement with its cause.
- Edit by anchor: assert each anchor matches once before you write.
- Do not touch `VocalLineEvent`, `apps/web/src/lib/shane/reconciliation/`, or `underlay-donor.ts`.
- Do not write French that is not in §6. Where a string needs French and §6 has none, leave `fr` equal to `en` and list it in the memo under French owed.
- Do not build the phone landing (a step's primary action landing the singer on the page). That is its own item.
- Do not redesign Corrections (N.120), the Notation toggles' reach (N.119), or the capture surface (N.122).

## 1. The goal, from the singer's seat

The drawer is a path read top to bottom: Piece, Input, Text, Score markup. Each band opens and closes. A closed band shows one line under it, its state; an open band shows its content, and the content is the state. Nothing is filled at rest; exactly one thing is next, and only that pill is filled, last in its row. An empty drawer opens Input alone; Piece, Text, and Score markup show their band and nothing under it.

## 2. Band state, the mechanism

Today the four bands render unconditionally with no open or closed state (`Drawer.svelte:435-489`); only sub-stations toggle through `SectionSet` (`sections.svelte.ts`), and `FIRST_RUN_STATIONS = []` (`:54`). Piece's fields hang on a separate `metadataOpen` boolean (`Drawer.svelte:101`, `:140`, `:448-460`).

**DESK DEFAULT:** the four bands become members of the same `SectionSet`, ids `piece`, `input`, `text`, `scoreMarkup`, so one mechanism persists both bands and stations. `FIRST_RUN_STATIONS` becomes `['input']`. The band itself is the toggle: the whole 40 px band is a button with `aria-expanded`, its right end a bare chevron (ruled 2026-08-19), pointing up when open and down when closed, on every band alike. If `SectionSet` cannot take the bands without a wider change, say so and put band state beside it in the same file, but do not invent a third store.

Voice inside Score markup keeps its ruling: it cannot collapse (`sections.svelte.ts:85-89`, N.114a). Corrections keeps its toggle. Repertoire and Export and import keep theirs inside Piece.

## 3. The changes, in order

### 3.1 Piece

- Strike the METADATA link (`Drawer.svelte:448-456`, `.band-link`) and the `metadataOpen` state. The fields (`MetadataFields.svelte`) render whenever Piece is open; Repertoire and Export and import follow them as today (`RootPanel.svelte:113-127`, `:148-180`).
- Closed, one state line: the title, a middle dot, the composer, in primary ink, with the `from score` tag (`.meta-from-score`, `meta.fromScore`, `MetadataFields.svelte:99-146`) at the right when the title came from the score. **DESK DEFAULT:** when only one of title and composer exists, show that one; when neither exists, show nothing under the band.

### 3.2 Input

- Input joins the band mechanism like its siblings. **DESK DEFAULT**, because no ruling says Input alone stays open: siblings behave identically (slate rule 11), and Plate C draws it closed. Dann can wave this off; if he does, Input never closes and shows no state line.
- Closed, one state line: `8 lines · 37 words · 37 / 94 placed`. Sources: `lineCount` (`IntakePanel.svelte:157`), `wordCount` (`+page.svelte:2073`), `placedSlotCount` and `slotQueue.length` (`+page.svelte:386`). Drop any part that is zero or absent; an empty song shows nothing under the band.
- The syllable line's row keeps its count and gains the word: `37 / 94 placed` in both the open and closed rows (`IntakePanel.svelte:500`, `:513`), through a new key, §6.
- The empty field's placeholder becomes the ruled sentence, §6 (`intake.placeholder`, `i18n.ts:570`).
- Under the field, shown only while the field is empty and no score is in, a caption in the intake hint's place (`IntakePanel.svelte:406-408`): the ruled sentence, §6, with its last three words, `choose a file`, as a link that calls `chooseFile()` (`:199`). The Choose a file pill (`:531-535`, `intake.choose`) goes. The existing drop hint (`intake.dropHint`) and its guard for the non-empty case stay exactly as they are; its wording is ruled unchanged (2026-09-09).
- Transcribe and fit (`IntakePanel.svelte:565`, `.btn-primary`) is filled only while its act does something. `handleTranscribe` (`+page.svelte:2287-2299`) always transcribes and calls `acceptWaiting()`. **Read what makes that act non-empty** (a waiting score, text with nothing yet drawn) and fill the pill only then; ghost otherwise. State the predicate you used in the memo, in one sentence. If no honest predicate exists, leave it filled and say so.

### 3.3 Text

- Closed, one state line: `Grayson defaults` in secondary ink when all seven toggles sit at default; otherwise `2 of 7 changed`. The seven: the five `NotationPreferences` fields (`packages/phonology/src/engine.ts:25-36`), `showStressDiacritics` (`+page.svelte:1918`), and `doc.openSyllabification` (`:1919`, `:2435`). Sonnet found no function that counts departures; write one beside `NotationFields.svelte`'s data, with a test. Confirm `doc.openSyllabification`'s default at its declaration; the memo did not.

### 3.4 Score markup

- Empty song, no score, no voice: band and nothing under it. Today Voice's block renders unconditionally under `INCLUDE_SHANE` (`+page.svelte:4294-4307`). Gate the closed state line and the open content on there being something to say; Voice's row itself, when Score markup is open, stays as today.
- Closed, one state line, built from the parts that exist: `2 notes corrected` (`correctedCount`, `+page.svelte:655`, keys `correct.count` and `correct.countOne` rendered at `:4250-4256`, reuse them), then `Voice: Dann`, then `10 of 10` if a sampled-vowel count is reachable from the profile store (`hasAnyReadings`, `profileStore.ts:119`, and whatever `CalibrationWizard.svelte:315` reads for `capturedCount`). If the count is not reachable without reaching into the wizard, show `Voice: Dann` alone and mark the count NOT ESTABLISHED in the memo.
- Calibrate against Re-calibrate is already derived at `VoiceAnchor.svelte:44-46` with keys `calib.anchor.calibrate` and `calib.anchor.recalibrate`. Confirm on a fresh profile that the first-time verb reads `Calibrate`. If it does, this item is a confirmation, not a change.
- One filled pill on the surface: Calibrate or Re-calibrate (`.voice-action`, `VoiceAnchor.svelte:107-119`). Nothing else on Score markup's front side is filled.

### 3.5 Every band

- Air under a band and between rows as N.114b left them (`--band-inset`, `--intake-row-gap`). Nothing centred; everything on the inset.
- A state line is one line: `white-space: nowrap`, ellipsis on overflow, tabular numerals, 14 px, primary ink for the singer's own content and secondary for apparatus (`Grayson defaults`).

## 4. Tests

- `sections.test.ts`: first run opens `input` alone; each band toggles and persists; `voice` still cannot collapse.
- A unit test for the departures counter (§3.3): all default gives 0; each toggle alone gives 1.
- The state-line builders (Piece, Input, Text, Score markup) as pure functions with a test each, so the empty cases are pinned.

## 5. The walk you run before you hand over, on a local production build

1. Fresh profile, empty library: Input open with the placeholder and the caption; Piece, Text, Score markup closed with nothing under them.
2. Paste a poem: Input's line count and word count appear when Input is closed.
3. Drop a score: Piece's line shows title · composer with `from score`; Input's line gains `37 / 94 placed`; Score markup's line shows what exists.
4. Flip one Notation toggle and close Text: `1 of 7 changed`. Flip it back: `Grayson defaults`.
5. Count filled pills on the whole front side at rest: at most one.
6. Reload: every band as you left it.

Record what you saw for each, at 390 px and at 1400 px.

## 6. Strings

| key | en | fr | source |
|---|---|---|---|
| `intake.placeholder` | Paste, type, or drop your poem here. | Collez, saisissez ou déposez votre poème ici. | ruled 2026-09-10 |
| `intake.caption` (new) | A score or a photograph can go here too, or you can choose a file. | Une partition ou une photographie peut aussi aller ici, ou vous pouvez choisir un fichier. | ruled 2026-09-10; the link is the last three words in en and « choisir un fichier » in fr |
| `intake.placed` (new) | %s / %s placed | %s / %s placées | ruled 2026-09-10 |
| `text.state.default` (new) | Grayson defaults | Grayson par défaut | ruled 2026-09-10 |
| `text.state.changed` (new) | %s of %s changed | %s sur %s modifiés | ruled 2026-09-10 |
| `voice.state` (new) | Voice: %s | Voix : %s | ruled 2026-09-10; U+00A0 before the colon in fr |
| `voice.state.count` (new) | %s of %s | %s sur %s | ruled 2026-09-10 |

Key names are DESK DEFAULT; keep the tree's naming pattern if it differs. `intake.choose` may be deleted if nothing else reads it; say so.

## 7. The memo

`docs/sessions/memo-path-pass_r1_2026-09-10.md`, under 120 lines: what changed, file by file; the Transcribe and fit predicate; the walk's six observations at both widths; gate numbers before and after; a section NOT ESTABLISHED; a section French owed. Ask Dann to `git add` the memo and any new file, then stop. Do not ship.
