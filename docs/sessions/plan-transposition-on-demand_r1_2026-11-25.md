# Transposition on demand: the plan. r1, 2026-11-25

Written by the desk after walking Marie's path on the READY build of `66dfb5f9`. Ruled by Dann 2026-11-25 01:45: transposition is available on demand for any musical notation, the modal quality is not a gate, and both doors are wanted. Every citation below was read this session from the tree at `35f73818`.

## 1. What the singer needs, and what happens today

A singer or a teacher wants to try the song in another key, see whether it sits better, and either keep it or go back. Today that is reachable only when the score file happens to state whether its key is major or minor, and only from a line at the foot of PIECE, which is the band where the work is named.

**Measured on the rendered page, 2026-11-25 01:3x to 01:4x, three files, one of them a positive control:**

| file | `<mode>` in the file | `.piece-key` on the page |
|---|---|---|
| `Mussorgsky - Sunless 04 - Be bored.musx`, converted by denigma | none that survived | absent |
| `tch-op38-3-from-scan_modern.musicxml`, Dann's own assembly, fifths 2 | 0 | absent |
| `Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml` | 2 | present: "Key: D major, as printed", ruler opens, C major applied, "As printed" pill returned |

None of the sixteen MusicXML fixtures in `packages/score-parser/src/fixtures/` carries a `<mode>`. MusicXML makes the element optional.

## 2. The cause, read rather than inferred

- `apps/web/src/lib/melody/transposition-ruler.ts:49-51`: `printedKey` returns null unless `signature.mode` is set.
- `packages/score-parser/src/musicxml-parser.ts:434-436`: `currentKey.mode` is set only from an explicit `<mode>` child; `packages/score-parser/src/types.ts:366` makes it optional. Nothing infers it.
- `apps/web/src/lib/melody/PieceKeyLine.svelte:28`: the whole line is inside `{#if line}`, and `line` derives from `keyRuler.printed`.
- `apps/web/src/lib/melody/transposition-ruler-state.svelte.ts:101`: INSIGHTS' "Try this key" suggestion is `printed && fifths !== undefined ? … : null`, so **it dies at the same gate**. Dann 01:45: *"That is an oversight. We need to fic this."*
- `:97` already names the case in its own comment: "no key (a source with no mode)".

**The engine below the gate is already mode-tolerant.** `packages/score-parser/src/transposition.ts:285-296` builds the ruler's stops from `fifths` and treats a missing mode as the major spelling for the pitch-class arithmetic (`tonicPitchClass`, `:257-259`), and omits `mode` from each stop when the source has none (`:292`). So the stops need no change.

**What is NOT mode-tolerant is the naming.** `keyAfterTransposition` (`:557-571`) returns null when the source has no mode, and `keyNameAfterTransposition` (`:542-550`) composes `"${tonic} ${mode}"`. So a destination cannot be named "C major" when the mode is unknown, and the readout, the key line, and the page header all name a key today.

## 3. The three changes

### 3a. KEY joins TEMPO and CLEF in the INPUT receipt, and leaves PIECE

The receipt already lists what Ilya read off the score and lets the singer override it: LYRICS, SCORE, `TEMPO ♩= 44 printed · Change the tempo`, `CLEF As written`, then the format line. Key is the third member of that family and is the one missing. A musician reads a score's head as clef, key, tempo; Ilya offers clef and tempo and hides key in the metadata band.

The new row reads `KEY <name> printed · Try another key` and sits between CLEF and the format line. `PieceKeyLine.svelte`'s mount at `apps/web/src/routes/+page.svelte:3915` leaves the metadata snippet. Transposing does not rename the work, so PIECE keeps title, opus, composer, poet, and translator and loses the key line.

### 3b. The printed key signature on the first system opens the same ruler

Nothing is added to the page; a mark already drawn becomes live, as a note already is for the loupe. `apps/web/src/lib/score/ClefControls.svelte` is the existing pattern for a hit area over an engraved symbol, and `TimeSignatureControls.svelte:11` says it was built on that pattern, so this is a third instance of a shape that exists twice, not a new mechanism.

### 3c. The mode gate goes, and the naming changes with it

`printedKey` returns a key for any signature. Where the mode is known, nothing a singer sees changes. Where it is not, the ruler still opens and every stop is still offered, and the three places that name a key need a form that is true without a mode: the ruler's readout, the key line, and the page header.

**This is where the design question is, and it is Dann's**, because a signature of no sharps and no flats is C major or A minor and Ilya must not pick one. Three forms, for his ruling, and the desk recommends the third:

1. Name the signature: "no sharps or flats", "two sharps".
2. Name both: "C major or A minor".
3. Name the signature and let the interval carry the sense: "Down a whole tone · two sharps fewer". 

Each is one new string in both languages, so it comes to him as a draft with the French built from the file's existing French.

## 4. What must not change

- The ribbon itself. Drawing r4 was accepted 2026-09-28 and is built; this plan moves its doors and removes a condition, and redraws nothing.
- The enharmonic-twin dimming and its double-accidental counts (`PRODUCT.md`, ruled 2026-09-28 21:41).
- `transposeScore`, `engraveInKey`, and the stop list.
- The ruler never prints (`CONTRACT.md` section 8).

## 5. Done when

1. On a score whose file states no mode, the INPUT receipt shows a KEY row, the ruler opens from it, a stop applies, and the key line offers the way back. Measured on `tch-op38-3-from-scan_modern.musicxml`.
2. The same on the `.musx`, measured on `Mussorgsky - Sunless 04 - Be bored.musx`.
3. The positive control still behaves: on `Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml` every string a singer reads is unchanged from today.
4. A tap on the printed key signature of the first system opens the ruler, on desktop and at phone width.
5. INSIGHTS' "Try this key" appears on a modeless score when Ilya has a suggestion.
6. PIECE no longer carries the key line.
7. All eight gates at baseline on the Mac.

## 6. The search this plan ran before proposing anything

`grep -rn "transpos" apps/web/src` and `packages/score-parser/src`: the ruler, its state, its dock, `PieceKeyLine`, and the engine, all listed in section 2. `grep -rn "tryAnother"`: two call sites, one of them an unrelated upload string. No second entry point to the ruler exists, and nothing proposed here duplicates something already built.

**This plan changes no computation**, so `CONTRACT.md` section 4's same-number clause does not apply, and the desk says so rather than omitting the line silently.

## 7. NOT ESTABLISHED

- Whether the `.musx` carries a mode that denigma drops, or never had one. The desk did not open the `.musx`.
- Whether any publisher's MusicXML export in common use writes `<mode>`, and so how large the affected share of real scores is.
- What a tap target on an engraved key signature measures at phone width against the 44 px floor.
