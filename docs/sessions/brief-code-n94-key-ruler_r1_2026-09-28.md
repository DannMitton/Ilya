# Brief for Code: N.94, the Transposition ruler, slice 1

Written by the desk 2026-09-28 about 19:40; re-checked at `03bed5a`, 20:58. **Both start conditions now hold** (the watch-band fixes shipped in `2535f88`; the French was ruled 19:28). Originally: **Do not start until two
things are true:** Code's four watch-band fixes have shipped (this brief edits
`MarkupPane.svelte`, which that work also edits), and Dann has ruled the French
in §6 (done 2026-09-28 19:28). The desk pastes the start line when both hold.

**NAMING, ruled by Dann 2026-09-28 21:14:** *"I prefer Transposition ruler to key ruler because it is named for its function. Please adopt this everywhere."* Name the code for it: `TranspositionRuler.svelte`, `transposition-ruler.ts`, and its tests to match. The drawings keep their old file names (`drawing-key-ruler_r*.html`), as does this brief's; they are dated records.

## 0. What the singer gets

A singer whose song sits badly opens the Piece band, reads "Key: D major, as
printed", and taps "Try another key". A ruler floats over the page. It opens on
Ilya's recommendation, and the engraved page underneath is already redrawn in that
key. The singer slides to another stop, and the page redraws again. "Use this key"
keeps it, and the page's header now says so. "As printed" returns to the
composer's key in one tap. The printed score is never altered.

The design is `docs/sessions/drawing-key-ruler_r4_2026-09-28.html`, accepted by
Dann 2026-09-28. Open it before you write anything. r1 to r3 are history.

## 1. The rulings this rests on, dated, with what touched them

- **Engraving grade.** Ruling 9 of 2026-08-07 (project doc
  `claude/e31-late-rulings-and-the-transposition-control_2026-08-07.md` §1):
  "transpose the key signatures, teach `transposePitch` flat-aware spelling, and
  print the study edition in the chosen key." Not amended.
- **The page redraws during the interaction.** Ruling 12, same document. Not
  amended.
- **The page states its source key, and that the key was the singer's choice.**
  Ruling 13, same document. Realized by drawing r4's header line.
- **An informed default with a free nudge.** Ruling 10, same document. The ruler
  opens on Ilya's pick; every stop stays reachable. Ilya says nothing evaluative
  when the singer departs from it (same document, §5, the desk's reading then).
- **Placement.** The Piece band and a floating ruler, superseding the Score Markup
  placement of 2026-09-16 (`OPEN.md` §N.94, and `STATE.md` "N.94, THE TRANSPOSITION RULER").
- **The ruler never prints.** `CONTRACT.md` §6, ruled in by Dann 2026-09-28 19:23.
- **Do not change `VocalLineEvent`, and do not store anything derived.**
  `CONTRACT.md` §6.

## 2. What the desk read in the tree, at HEAD `1fda2e4`

- The engine exists: `packages/score-parser/src/transposition.ts`.
- **`transposeScore` is NOT engraving grade.** It shifts `vocalLine` pitches only
  (`transposition.ts:217-225`), leaves `keySignatures` untouched, and spells every
  pitch with naturals and sharps (`transposePitch`, `transposition.ts:63-67`, whose
  own comment says engraved spelling "is the render beat's concern").
- The renderer draws the signature from `parsed.keySignatures[0]`
  (`staff-renderer.ts:1895`) and decides each accidental against it
  (`staff-renderer.ts:2782`). Fed today's `transposeScore`, it would draw the new
  notes under the old signature, with an accidental on nearly every note.
- `measures[].keySignature` is a per-measure snapshot (`types.ts:254-255`). It must
  move with the signature.
- The key-aware speller exists: `spellPitch(midi, { key })`
  (`transposition.ts:187-193`). `keyAfterTransposition` exists
  (`transposition.ts:347-366`) but folds each interval to one fifths value, so it
  cannot tell B major from C flat major. The ruler needs both.
- **The seam is already there.** `MarkupPane.svelte`, the `octaveShift` and `readingScore` derivations (lines 560 to 563 at `03bed5a`), derives
  `readingScore` from `parsed` without touching it (the octave shift), and both the
  analysis and the render read `readingScore`. Transposition goes in the same
  derivation.
- `transposeScore` has one app caller, `watchlist.ts` (by grep of `apps/`), plus
  `suggestTranspositions` inside the package (`transposition.ts:389`). **Leave it
  as it is.** It is the cost search's tool, not the engraver's.

## 3. The work

**This brief authorizes a change to `packages/score-parser`**, in
`src/transposition.ts` only (§3.1), because engraving in a new key is that package's
job (ruling 9, §1). In the N.173 gates work a package edit was refused as "a change to
a shared package" (`report-code-n173-gates_r1_2026-09-28.md`, line 77). If your tools
refuse it again, stop at that point and report; do not route around it in the app.
Gate 5 (score-parser tests) will move; report its new count.


### 3.1 The engine: `engraveInKey`

Add to `transposition.ts` a pure function, name it as you see fit:

    engraveInKey(parsed, { semitones, fifths }) -> ParsedScore

- Rewrites every entry of `keySignatures` and every `measures[].keySignature` by
  the same fifths displacement, keeping `mode`.
- Moves each vocal pitch by `semitones` and spells it with `spellPitch` against the
  target key in force at that measure.
- A hand spelling from the singer's corrections wins, as `spellPitch`'s header
  promises (`transposition.ts:180-181`). If the tree's corrections are not
  reachable at this layer, report that; do not work around it.
- Returns the input unchanged at 0 semitones and the printed fifths.
- Changes values only. The shape of `VocalLineEvent` does not change.

### 3.2 The stops

For the printed key (fifths `f`, mode `m`): one stop for every key signature from
7 flats to 7 sharps in mode `m`. Each stop's `semitones` is the tonic's move folded
into the range -6 to +6. The tritone appears at both ends, down and up. Keys whose
tonics sound the same (B and C flat, F sharp and G flat, C sharp and D flat, in
major; their relative pairs in minor) are separate stops, side by side, under a
faint bracket. No tick marks. Order by semitones.

**A source with no mode** (`KeySignature.mode` undefined): the stops still exist by
fifths, but name them by interval only, because naming a key there would be a guess
(Dann's ruling 2026-07-20, carried at `transposition.ts:326-330`). DESK DEFAULT.

### 3.3 Where it opens

On `suggestTranspositions`' first candidate, with the second marked as runner-up.
When it returns nothing, open on the printed key. DESK DEFAULT, from ruling 10.

### 3.4 The ruler, desktop

Per drawing r4, plate 2: a floating layer over the whole page, never printed. The
printed key boxed, the selection circled, the runner-up dotted. Readout above:
interval, key, and "Ilya's recommendation" only on that stop. "Cancel" and "Use
this key". While the ruler is open, the page underneath draws the selected stop.
Cancel restores what was there before it opened.

### 3.5 After "Use this key"

- The header line in drawing r4, plate 3, prints on the page.
- The Piece band reads "Key: B major, transposed" with an "As printed" pill.
- **Storage, DESK DEFAULT:** store the choice (target fifths and semitones) on the
  song. Never store the transposed score (CONTRACT §6). The printed score is never
  altered, which is how "branch, do not mutate" is kept. Find where a song's
  settings live, and say in the report where you put it and why.

### 3.6 The Piece band line

"Key: D major, as printed" with a "Try another key" pill, in the Piece band
(`Drawer.svelte`, the `BAND_IDS.piece` band at line 516 at HEAD).

### 3.7 Not in this slice

The phone dock (drawing r4, plate 4) and Insights' "Try this key". Slice 2.

## 4. Known limit, held, not a blocker

The renderer handles one key for the whole piece (`staff-renderer.ts:520-527`). A
song that changes key mid-piece transposes every signature by the same amount, and
draws under the first, as it does today. Report any song in the fixtures where this
shows.

## 5. Gates

- Unit tests for `engraveInKey`: signature and every measure snapshot move; D major
  down a minor third lands in B major with no accidental on a diatonic note; the
  same move to C flat major spells every note with flats; 0 returns the input;
  `transposeScore`'s own tests unchanged.
- The two staff-renderer approval tests pass unchanged (no transposition applied).
- All eight ship-script gates at baseline or better, with the new test count
  reported.
- `check` 0 errors; ratchets OK, and report any ratchet this moves.
- Screenshots: the Sunless 1 fixture as printed, with the ruler open on Ilya's
  pick, and after "Use this key", in English and in French.

## 6. Strings. French RULED by Dann 2026-09-28 19:28 ("Ratified")

Drafted by the desk from `i18n.ts` (the `watch.key.*`, `watch.interval.*`, and
`watch.direction.*` families, and `upload.ask.cancel`); ratified by Dann. Who
offered it: the desk. Who ruled it in: Dann. Use exactly this text. The colon in
French takes a no-break space before it (`\u00a0`), as the watch lines do.

| key (Code may rename) | English | French |
|---|---|---|
| `key.band.asPrinted` | Key: {key}, as printed | Tonalité\u00a0: {key}, telle qu’imprimée |
| `key.band.try` | Try another key | Essayer une autre tonalité |
| `key.band.transposed` | Key: {key}, transposed | Tonalité\u00a0: {key}, après transposition |
| `key.band.backToPrinted` | As printed | Tonalité imprimée |
| `key.ruler.cancel` | Cancel | Annuler |
| `key.ruler.use` | Use this key | Utiliser cette tonalité |
| `key.ruler.readoutPick` | {interval} · {key} · Ilya’s recommendation | {interval} · {key} · recommandation d’Ilya |
| `key.ruler.readout` | {interval} · {key} | {interval} · {key} |
| `key.page.header` | Transposed {interval} from {key}, at the singer’s choice. | Transposition {interval} à partir de {key}, au choix de l’interprète. |

**The readout's interval is a standalone phrase in French**, ruled form "Une tierce
mineure plus bas" (up: "plus haut", the same pattern; the desk derived it and tells
Dann). It is NOT the `watch.interval.*` form, which begins « d’ » and needs a verb
before it. Build a new family: capitalized interval name without « d’ », then
« plus bas » or « plus haut ». English: "Down a minor third" / "Up a minor third",
from `intervalName` capitalized.

**The header's interval IS the adopted form:** `watch.interval.*` plus
`watch.direction.*` in `watch.intervalPhrase.one` order, giving « d’une tierce
mineure vers le bas ». Key names use `watch.key.*` (lowercase in French: « si
majeur », « ré majeur »).

## 7. The report

Write `docs/sessions/report-code-n94-key-ruler-slice1_r1_<date>.md`: what you
built, with `path:line`; the gate numbers; where the choice is stored; the
screenshots; and a section **What I could not establish**. NOT ESTABLISHED beats a
complete invented answer.

Do not commit, stage, or push. Dann ships.

## Addendum, 2026-09-28 21:40: two things before slice 1 ships

The desk checked slice 1 in a cloud copy: web 1,677, score-parser 631 and 5 skipped,
`check` 0 errors, ratchets OK, and all 84 captures unchanged with no key chosen.

1. **The spelling rule is ruled, and it is yours.** `PRODUCT.md`, "Transposition moves
   every note by the same interval", Dann 21:35: every note moves by the same interval,
   number and quality; double flats and double sharps that result stay. Your DESK
   DEFAULT of carrying each note's printed spelling is that rule; keep it. **Add the
   one exception:** a note that would need a triple accidental takes its enharmonic
   with fewer accidentals. Test it: B double flat moved down a chromatic semitone
   (an augmented unison) would be B triple flat; it comes out as A flat, the same
   pitch. And test that a composer's double accidental moved
   by a plain interval stays double.
2. **Restore both ceilings.** `scripts/ratchets.json` raised `MarkupPane.svelte` to
   1389 and `+page.svelte` to 6057. `ARCHITECTURE.md` invariant 12: a ceiling may
   shrink and never grow. Move the wiring out into `transposition-ruler.ts`,
   `PieceKeyLine.svelte`, or a new module until both files are back at or under 1358
   and 6028, and put the ceilings back. If a line truly cannot leave, stop and report
   which and why; do not raise a ceiling.

Re-run all eight gates and append to the slice 1 report. Do not commit, stage, stash,
check out, or restore. Dann ships.

