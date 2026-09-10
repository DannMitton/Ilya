# Memo: the drawer as a path, the path pass

Claude Opus 5, `~/Desktop/ilya-rewrite`, branch `Shane`, 2026-09-10. Answers `docs/sessions/brief-path-pass_r1_2026-09-10.md` r1. Not shipped, not committed.

## 1. What changed, file by file

- **`sections.svelte.ts`.** The four bands join the one `SectionSet` as `BAND_IDS` (`piece`, `input`, `text`, `scoreMarkup`). `FIRST_RUN_STATIONS` is `['input']`. `metadata` leaves `STATION_IDS`. `OPEN_STATIONS_VERSION` goes to 3, so every stored set lands once on the new opening state; `restore` now lands a reset on that first-run default instead of the literal `[]` it carried. `isBandId` names the tier, and two rules read it: `toggle`'s phone exclusivity shuts only same-tier ids, and `migrateOpenStations` keeps one survivor per tier on a phone. The ship B half of `SUCCESSOR` is deleted, because version 3 resets every set that could carry `piece`, `songs` or `shiftLyrics` before the map is reached.
- **`Drawer.svelte`.** The band is the toggle: a `<button>` filling all 40 px, `aria-expanded`, the station row's own chevron glyph and its two rotations at the right end, down closed and up open. One snippet, `bandHead`, draws all four. `.band-link` and the METADATA word are struck, and `metadataOpen`/`onmetadatatoggle` go with them; `metadataBody` now renders first inside Piece whenever Piece is open. New: `.band-state` under a closed band, one line, `nowrap`, ellipsis, tabular numerals, 14 px, primary ink with an `apparatus` modifier for secondary, plus `.band-state-tag` for `from score`. `.group-band`'s 18 px padding moved onto the button so the focus ring sits on the band's own edge.
- **`bandState.ts` (new).** `pieceStateLine`, `inputStateLine`, `placedLine`, `notationDepartures`, `textStateLine`, `scoreStateLine`. Pure, localized, no Svelte.
- **`bandState.test.ts` (new).** 22 tests, expectations taken from the brief and the plates.
- **`sections.test.ts`.** Rewritten where ship B's ids were pinned, since those ids can no longer arrive; new tests for the first run, the four band ids, the tier split, and the version 3 reset.
- **`IntakePanel.svelte`.** The caption under the field (empty field, no score) with `choose a file` as a link calling `chooseFile()`; the Choose a file pill and `.intake-actions` are struck; `intake.dropHint` and its guard are untouched; both syllable rows take `placedLine`; `lineCount` became a prop, because Input's state line needs the same number; Transcribe and fit takes `btn-primary` or `btn-ghost` from `transcribeActs`.
- **`ScoreUploader.svelte`.** One export, `hasWaitingScore()`, which is `acceptWaiting`'s own guard read rather than acted on.
- **`+page.svelte`.** `poemLineCount` and the four state-line deriveds; `transcribeActs`; `{sections}` and the five state props to `Drawer`; the two metadata props gone.
- **`engine/types.ts`.** `VOWELS` is a value and `Vowel` derives from it, so Score markup can count the denominator of `10 of 10` without reading the wizard's queue. The wizard is untouched.
- **`i18n.ts`.** New: `intake.caption`, `intake.captionLink`, `intake.placed`, `text.state.default`, `text.state.changed`, `voice.state.count`. Changed: `intake.placeholder`. Deleted: `intake.choose`, which nothing else read.

## 2. The Transcribe and fit predicate

`transcribeActs = canTranscribe && (doc.inputText !== transcribedText || uploaderEl?.hasWaitingScore() === true)`, which is `handleTranscribe` read back: that function runs the pipeline over the field's text and accepts a score standing at Continue, so it does something when the page was not built from this text or when a score is waiting. The button stays live either way; only the fill is conditional, so the 2026-09-07 ruling that it keeps its explicit act is untouched.

## 3. The walk, on a local production build

At **1400 px**:

1. Fresh profile, empty library: Piece and Score markup show their band and nothing under it, Input alone is open with the ruled placeholder and the caption, and Text shows `Grayson defaults`. Text's line is Plate A's, not the brief's step 1, which says Text shows nothing; the plate wins and Text always has something true to say.
2. Poem pasted (8 lines, 37 words). Closed, Input reads `8 lines · 37 words`.
3. Score dropped. Transcribe and fit turned filled while the score waited, and ghost again after the press. Piece's line read `Within Four Walls · Modest Mussorgsky (1839–1881)` with `from score` at the right end; Input's line gained `0 / 96 placed`. The E.16 harness scores carry no work header, so the tag was walked on a copy of one with `<work-title>` and `<creator>` added.
4. One Notation toggle flipped, Text closed: `1 of 7 changed`. Flipped back: `Grayson defaults`. Seven switches are drawn in the station, which agrees with the count.
5. Filled pills on the whole front side at rest: **zero**, with every band closed. Open Score markup and it is one, Calibrate. The wizard's own `Start` is in the DOM and `checkVisibility()` is false.
6. Reloaded with Piece and Text open: both came back open, Input and Score markup closed, `ilya:openStations` reading `{"v":3,"open":["piece","text"]}`. Notation stayed collapsed, which is its unpersisted ruling.

At **390 px**: the empty state, the ruled placeholder and the caption, the closed lines, `from score` at the right, and nothing filled all read as at 1400. Piece's long line ellipsizes on one row. The reload landed the phone on `piece` alone, dropping `text`, which is the one-band-per-tier rule; opening Repertoire left Piece open, and opening Input closed Piece and kept `repertoire` in the set. Steps 2 and 4 were walked at 1400 only.

`Calibrate` is the first-time verb on a fresh profile, confirmed. No change was needed.

## 4. Gate numbers

| gate | before | after |
|---|---|---|
| phonology | 216 | 216 |
| dictionary | 235 | 235 |
| web-check | 0 errors, 7 warnings, 4 files | 0 errors, 7 warnings, 4 files |
| web-test | 1076 | **1103** |
| score-parser | 547 passed, 5 skipped | 547 passed, 5 skipped |

The 27 are all new: 22 in `bandState.test.ts`, 5 net in `sections.test.ts`.

## 5. DESK DEFAULT

1. Input closes like its siblings, as the brief named. Wave it off and Input never closes and shows no state line.
2. `OPEN_STATIONS_VERSION` 3, so every returning singer lands once on Input alone. Without it a version 2 set names no band and the drawer comes back as four shut doors.
3. Phone exclusivity is per tier. Otherwise opening Repertoire shuts the Piece band that contains it, one frame after asking for it.
4. Text's whole state line is secondary ink, `2 of 7 changed` included: both halves are apparatus.
5. Input's placed pair needs a score, not merely a queue. `slotQueue` fills from the poem, so without this a poem alone reads `0 / 96 placed` while the syllable line inside the band draws nothing.
6. `VOWELS` moved beside the `Vowel` type rather than being read out of the wizard.
7. Score markup's state line reuses `calib.anchor.named` (`Voice: {voice}`, ratified French) instead of coining `voice.state`, per "keep the tree's naming pattern if it differs".
8. `intake.captionLink` is a second key so the ruled caption stays whole in the table; the renderer splits the sentence on it.
9. Score markup OPEN renders as today, Voice's row included. Gating the open content on there being something to say would strand Calibrate, the only way into the ritual, on a fresh profile.
10. The band ids are the brief's plain strings. `piece` is ship B's own wire value for the Metadata station, and reusing it is safe only because version 3 resets every set that could still mean that. The comment on `BAND_IDS` says so.

## 6. NOT ESTABLISHED

- Score markup's state line was **not walked**. Its two halves need a corrected note and a named voice; note selection is pixel-hunting in injected SVG and the voice needs the microphone ritual. The builder is pinned by test, and the prop plumbing is the same plumbing the three bands that did show lines use.
- The line read `You have corrected 2 notes. · Voice: Dann · 10 of 10`, not the plates' `2 notes corrected`. **Ruled and closed after this memo was first written; see §9.**
- Whether the `from score` tag should follow the composer as well as the title. It is gated on the title, which is what the brief says; a score that named only the composer draws no tag.
- Whether a band should take the 44 px coarse-pointer floor. It takes the band's own 40 px, which is what Metadata's affordance took and what you walked.
- `docs/memory/STATE.md` and `docs/sessions/LOG.md` are dirty in the tree and this session did not touch either.

## 7. French owed

- `intake.lines` (`%s lines`) and `intake.words` (`%s words`) are untranslated in the tree and now carry Input's closed state line, so the gap is newly visible. §6 gives no French for either.
- `group.piece`, `group.input`, `group.text`, `group.scoreMarkup` remain untranslated; the bands are now buttons, so those words are the accessible names too.
- Nothing new was coined. Every string this pass added took §6's ruled French.

## 8. What is yours

`git add docs/sessions/memo-path-pass_r1_2026-09-10.md apps/web/src/lib/components/Drawer/bandState.ts apps/web/src/lib/components/Drawer/bandState.test.ts`

## 9. Appended after hand-over: the corrected-note phrase

RULED BY DANN 2026-09-10, closing the one item §6 raised. Score markup's closed state line takes its own pair of keys and the plates' phrase:

| key | en | fr |
|---|---|---|
| `correct.state` | `%s notes corrected` | `%s notes corrigées` |
| `correct.stateOne` | `1 note corrected` | `1 note corrigée` |

- `bandState.ts`'s `scoreStateLine` reads the new pair. Nothing else reads it.
- `correct.count` and `correct.countOne` are **untouched and keep their one render site**, the notice inside the Corrections station body (`+page.svelte:4357-4359`). The two pairs are not folded together: one is a sentence about work done and one is a state line's phrase, and the walk at 390 px is why they are two things.
- `bandState.test.ts` pins both the phrase and its French: the whole line now reads `2 notes corrected · Voice: Dann · 10 of 10` in English and `2 notes corrigées · Voix : « Dann » · 10 sur 10` in French, and the singular reads `1 note corrected` / `1 note corrigée`.
- The five gates are unchanged by this: phonology 216, dictionary 235, web-check 0 errors and 7 warnings in 4 files, web-test 1103, score-parser 547 passed and 5 skipped. No test was added or removed; four existing tests in `bandState.test.ts` changed value or gained a French expectation.
- This amends §1's i18n list and closes §6's second bullet. Score markup's state line is still **not walked**, for the reason §6 gives.
