# Transposition on demand: the plan. r2, 2026-11-25

**Supersedes r1.** r1 is kept. r2 applies Fable's four blockers and thirteen amendments (`review-fable-plan-transposition_r1_2026-11-25.md`, ADOPT WITH AMENDMENTS) and settles the naming question r1 left open. Every `path:line` below was read by the desk this session from the tree at `35f73818`, not taken from the review.

Ruled by Dann 2026-11-25 01:45: transposition is available on demand for any musical notation, the mode is not a gate, and both doors are wanted. Ruled 02:16 to 02:56: Ilya states only what is true, so it never names a mode the score does not state.

## 1. What the singer needs, and what happens today

A singer or teacher wants to try the song in another key, see whether it sits better, and either keep it or go back. Today that is reachable only when the file states whether the key is major or minor, and only from a line at the foot of PIECE, the band where the work is named.

Measured on the rendered page, three files, one a positive control:

| file | `<mode>` in the file | `.piece-key` on the page |
|---|---|---|
| `Mussorgsky - Sunless 04 - Be bored.musx`, via denigma | none that survived | absent |
| `tch-op38-3-from-scan_modern.musicxml`, fifths 2 | 0 | absent |
| `Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml` | 2 | present: "Key: D major, as printed"; the ruler opened, C major applied, "As printed" returned |

None of the sixteen MusicXML fixtures in `packages/score-parser/src/fixtures/` carries a `<mode>`.

## 2. The cause, read this session

- `apps/web/src/lib/melody/transposition-ruler.ts:49-51`: `printedKey` returns null unless `signature.mode` is set. `:37`: `NamedKey` requires a mode, with the comment "the only kind the ruler names".
- `packages/score-parser/src/musicxml-parser.ts:434-436`: `currentKey.mode` is set only from an explicit `<mode>` child. `types.ts:366` makes it optional. Nothing infers it.
- `apps/web/src/lib/melody/PieceKeyLine.svelte:25`, `:28`: the line derives from `keyRuler.printed` and the whole block is inside `{#if line}`.
- **INSIGHTS dies two steps earlier than r1 said.** `apps/web/src/lib/insights/InsightsPane.svelte:333` calls `keyAfterTransposition(source, semitones)`, which returns null for a source with no mode (`packages/score-parser/src/transposition.ts:561`), so `:334` never calls `stopFor`. The same null removes Ilya's pick from the ruler: `transposition.ts:602-610` attaches a target signature only when the key could be named, and `transposition-ruler.ts:154-155` drops a candidate with none (`if (!c?.targetKeySignature) return null;`). **So removing the gate alone would open a ruler that recommends nothing while INSIGHTS recommends a move on the same song.** r1's sentence "this plan changes no computation" was false; section 8 carries the clause `CONTRACT.md` section 4 requires.
- **The engine below is already mode-tolerant.** `transposition.ts:285-296` builds the stops from `fifths`, treats a missing mode as the major spelling for the pitch-class arithmetic (`tonicPitchClass`, `:257-259`), and omits `mode` from each stop when the source has none (`:292`). Its own comment at `:280-283` forbids naming a key there, "because naming a key there would be a guess".

## 3. THE NAMING, and it replaces r1 section 3c entirely

**Ruled by Dann 2026-11-25 02:54**, on his standing principle that Ilya states only what is true: a key signature states a collection of seven notes and does not state a mode, so **Ilya never names a mode the score does not state**. r1's three forms, and Fable's interval-and-signature form, are all set aside. Neither is needed.

**Where the file states no mode, Ilya names a key as the pair the signature allows:** `D major or B minor`. It is true of every file with a key signature, it is what a musician reads off two sharps, and it needs no inference.

**Ordering is not asserting.** Where Ilya has a reading of its own (`report-sonnet-key-mode-detection_r1_2026-11-25.md`), it may put the likelier candidate first in a chooser. A first-listed choice is a starting point, not a claim. **No mode detection is built in this plan**; the ordering rides later, if at all.

**A singer's own choice makes one name true**, and from then on the row and every readout use it, as the stress controls already work.

The eight places that name a key, each read this session, with the form for a score that states no mode:

| place | path:line | mode stated | no mode stated |
|---|---|---|---|
| stop face | `TranspositionRuler.svelte:126`, `TranspositionDock.svelte:189`, via `stopLabel` (`transposition-ruler.ts:84-87`) | `C` | `0`, `2♯`, `3♭` |
| stop face, enharmonic twins | same | `B` and `C♭` | `5♯` and `7♭` |
| each stop's accessible name | `TranspositionRuler.svelte:122`, `TranspositionDock.svelte:185` | the readout | the readout |
| readout, away from the print | `transposition-ruler.ts:102-110` | `Down a whole tone · C major` | `Down a whole tone · C major or A minor` |
| readout, on the printed stop | same | `D major` | `D major or B minor` |
| dock chips | `TranspositionDock.svelte:64`; `i18n.ts:2391-2392` | `As printed · D` | `As printed · 2♯` |
| the KEY row | new | `D major, printed` | `D major or B minor, printed` |
| the page header | `transposition-ruler.ts:129-140` | `Transposed down a whole tone from D major, at the singer's choice.` | `Transposed down a whole tone from the printed key, at the singer's choice.` |
| INSIGHTS | `transposition-ruler-state.svelte.ts:134-140`, called at `InsightsPane.svelte:335` | `Down a whole tone · C major` | `Down a whole tone.` (as built today) |

The signature words exist in both languages and a singer who has corrected a key has read them: `i18n.ts:582-586`.

## 4. Lane A: the gate, the naming, the KEY row, and the INSIGHTS repair

These cannot be separated: the row must name a modeless key, the ruler must open for one, and INSIGHTS must reach it.

**A1. A sibling that returns the landing signature with no mode.** `keyAfterTransposition` (`transposition.ts:557-571`) is left exactly as it is, because the watch list's naming depends on its null (`apps/web/src/lib/analysis/watchlist.ts:536-543`, `:597-600`, which has no path for a missing mode) and three tests pin it (`transposition.test.ts:162-169`, `:206`, `:210-211`). The new function returns `{fifths}` alone and is used at `InsightsPane.svelte:333` and in `openingStops` (`transposition-ruler.ts:154-158`). `InsightsPane.svelte` is at its ceiling, so `:333` changes in place.

**A2. Make the missing mode a type the compiler can see.** `NamedKey` (`transposition-ruler.ts:37`) gains a sibling shape without a mode; `keyName` and `keyTonic` (`watchlist.ts:574-594`) keep requiring one. The type check then lists every naming site, and the silent major cannot compile. **Without this, `keyTonic` treats anything not minor as major (`watchlist.ts:578`) and every stop would read as a major tonic**, which is Ilya choosing a mode the file never stated.

**A3. One naming function per place**, each with a branch for no stated mode, in the forms of section 3.

**A4. The KEY row, in both states.** As printed: the name, `printed`, and `Try another key`. Transposed: the name, `transposed`, then `As printed` and `Try another key`, the way the SCORE row carries two buttons (`IntakePanel.svelte:448-449`). `Try another key` and `As printed` exist (`i18n.ts:2363`, `:2365`); `printed` and `transposed` exist only inside the two sentences of the old line (`:2362`, `:2364`), so two short strings are owed, with their French as drafts. **Without both states a transposed song has no one-tap way back, because the pill lives in the component being removed (`PieceKeyLine.svelte:31-32`).**

**A5. Build the row as its own component in `lib/melody/`**, mounted after `ClefReceipt` at `IntakePanel.svelte:452`, taking the ruler's state as a prop on the `IntakePanel` mount at `+page.svelte:3983`. The `INCLUDE_MARKUP_INSIGHTS` guard travels with it from `+page.svelte:3915`. `+page.svelte` is at its ceiling; removing `:115` and `:3915` frees two lines and the prop costs one, so the file ends one line down.

**A6. Remove what the move orphans**: `PieceKeyLine.svelte`, `bandLine` if unused, and any `key.band.*` string left unread, with their tests. DESK DEFAULT.

**A7. The INSIGHTS suggestion returns**, through A1.

## 5. Lane B: the printed key signature opens the ruler

**B1. It is a convenience, not the door.** A score with no sharps or flats draws no key signature at all: `packages/score-parser/src/staff-renderer.ts:723` sets `ksCount = Math.abs(fifths)` and the loop at `:2150-2159` draws nothing at zero. So there is nothing to tap on such a song, and nothing to tap on a song transposed into an empty signature. The KEY row is the door that always exists. This is stated in the brief and accepted, as the time signature's tap already describes itself (`TimeSignatureControls.svelte:51-52`).

**B2. It costs no line in three files.** `MarkupPane.svelte` is at its ceiling, so the mount rides an existing line. `lib/score/` may not import `lib/melody/` (`scripts/ratchets.mjs:78-85`), so the hit lives in `lib/melody/` or `ScoreControls.svelte` takes a callback. `staff-renderer.ts` is at its ceiling and its output is pinned by approved drawings, so the hit is measured from the stamps each glyph already carries (`:2149`), joined into one box per system.

**B3. Three tap areas must coexist.** The clef's and the time signature's are each centred on their mark and widened to 44 px on a phone (`ClefControls.svelte:59-70`, `TimeSignatureControls.svelte:48-54`). A one-sharp signature sits between them.

## 6. What must not change

The ribbon itself (drawing r4, accepted 2026-09-28). The enharmonic-twin dimming and its double-accidental counts (`OPEN.md:1429`; `PRODUCT.md:913-919` holds the 21:35 ruling). `transposeScore`, `engraveInKey`, and the stop list. The ruler never prints (`CONTRACT.md:171`).

## 7. Done when

**Lane A.** 1. On `tch-op38-3-from-scan_modern.musicxml` the INPUT receipt shows a KEY row reading the pair, the ruler opens from it, a stop applies, and the row offers the way back. 2. The same on `Mussorgsky - Sunless 04 - Be bored.musx`. 3. On a song with no sharps or flats, the same. 4. **Equality measurement:** every string the positive control shows on the ruler, the dock, the row, the header, and INSIGHTS is captured in both languages before the change and is identical after. 5. INSIGHTS' "Try this key" appears on a modeless score when Ilya has a suggestion. 6. PIECE no longer carries the key line. 7. No naming function returns a tonic for a key with no mode. 8. A stored choice is applied on a modeless key exactly when it is one of that key's stops. 9. The KEY row fits the drawer's narrowest width with both buttons in French. 10. All eight gates at baseline on the Mac.

**Lane B.** 1. A tap on the printed key signature of the first system opens the ruler, on desktop and at phone width. 2. On a phone the clef, key, and time-signature tap areas do not overlap and each keeps the 16 px floor the other two use. 3. The hit hides while the ruler is open, and it is a button with an accessible name. 4. The existing phone suites for the clef and the key-signature card still pass.

## 8. The same-number line (`CONTRACT.md` section 4)

This plan changes how a transposition's landing signature is computed. Every site that computes the same number: `transposition.ts:557-571` (`keyAfterTransposition`), `:285-296` (the stops), `:334-339` (`engraveInKey`'s displacement), and `transposition-ruler.ts:258-270` (`stopForSuggestion`). What depended on `keyAfterTransposition` returning null for a missing mode: `transposition.ts:602-610`; the watch list's choice between key names and intervals (`watchlist.ts:536-543`, `:597-600`); and `transposition.test.ts:162-169`, `:206`, `:210-211`. A1 adds a sibling rather than loosening the original, so every one of those keeps its behaviour.

## 9. Tests

`transposition-ruler.test.ts:76-80` asserts the gate and is rewritten. The three engine tests above stay untouched. Added: a stored choice on a modeless key; no naming function returns a tonic without a mode; the eight naming places in both states. No browser test asserts the absence of the key line (grep of `apps/web/e2e`, `apps/web/e2e-phone`, and `tests` for `piece-key` and `key.band` returned nothing).

## 10. The search this plan ran

`grep -rn "transpos"` over `apps/web/src` and `packages/score-parser/src`: the ruler, its state, its dock, `PieceKeyLine`, and the engine. **Two entry points to the ruler exist, not one**: `PieceKeyLine.svelte:34` and INSIGHTS' `tryKey` (`transposition-ruler-state.svelte.ts:104-107`, `InsightsPane.svelte:483`, `:514`). r1 said one. Nothing proposed here duplicates something built.

## 11. Owed to Dann

Two short English strings for the KEY row (`printed`, `transposed`) and their French. The eight naming forms of section 3, as a table, English ratified and French ruled. Nothing else in either lane is his.

## 12. NOT ESTABLISHED

- Whether the `.musx` carries a mode that denigma drops, or never had one. `mnx-parser.ts:453` reads a mode when the converted file has one; the desk did not run the converter.
- How large the share of real scores without `<mode>` is.
- What a tap target on an engraved key signature measures at phone width against the 44 px floor.
- Whether the drawer closes on a phone when "Try another key" is tapped inside it.
