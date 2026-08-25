# Code brief — N.92 slice 2: accidental control and the spelling policy

**r1, 2026-08-24. Serves N.92, second slice, ruled by Dann at the close of the
OMR day and designed in the desk session of 2026-08-24. Runs AFTER the N.97
ship** (`docs/sessions/brief-n97-clef-key-read_r1_2026-08-24.md`): this slice
consumes the detected key and the re-keyed correction ids.

Paste this into Claude Code pointed at `~/Desktop/ilya-rewrite`, branch `Shane`.

---

## Rulings this brief carries (all Dann, 2026-08-24)

1. **The interface model is Finale's Simple Entry palette**, adopted
   deliberately. This amends ship 3's Speedy-only template. Speedy's digit
   mapping for durations stays exactly as shipped; the accidental cluster
   arrives in palette form.
2. **Accidentals are cumulative, and two clicks reach doubles.** Flat lowers
   the spelling one degree per click (B, B♭, B𝄫), sharp raises it, natural
   resets to the plain letter. Capped at doubles: a third click in the same
   direction does nothing. Sound follows spelling.
3. **The reader spells its own output in harmonic context** (Gould rule 66,
   held in `claude/gould-vocal-engraving-rules_v7_2026-08-05.md`), using the
   key N.97 gives it. No respell verb ships: key-aware spelling removes the
   systematic case, and the residual case waits until one is caught in the
   wild.

## Goal

Three legs:

1. **The spelling policy, one pure function.** In
   `packages/score-parser/src/transposition.ts`, beside `transposePitch`
   (`:51-55`): given a pitch class, a key signature, and the previous pitch,
   return a spelling. Diatonic spellings of the key win; a chromatic note
   spells to the key's side (flats in flat keys, sharps in sharp keys); with
   no tonal anchor, prefer the spelling that makes the recognizable melodic
   interval from the previous note, which is rule 66's own fallback. The
   sharps-only `SPELLING` table (`:40-44`) stays for callers that opt out;
   nothing else hand-rolls a second speller.
2. **Verbs and nudges.** In `apps/web/src/lib/shane/correction.ts`: three
   cumulative accidental verbs per ruling 2, and `semitonePitch` (`:133-135`)
   re-routed through the policy so nudging D down in E♭ major gives D♭, not
   C♯. `stepPitch` (`:115-120`) is untouched: a staff step already keeps its
   accidental on purpose. A hand spelling in the correction map is never
   rewritten by the policy; the verbs always win.
3. **The palette cluster in the drawer.** Three accidental tools (♭, ♮, ♯) in
   the NOTATION anchor beside ship 3's verbs. Sage anchor, 44 px floor, no
   new exemption, `@media (pointer: coarse)` for modality, per the Studio
   ruling (`claude/e44-fable-ruling-studio-architecture_2026-08-13.md`,
   §AUDIT A.2). Drawer manipulates, page displays: nothing lands on the
   paper.

## What the tree says now (read by the desk, 2026-08-24)

- `NoteCorrection` stores a full `Pitch` (step, alter, octave), so every
  spelling is already representable (`correction.ts:44-49`). Only the verbs
  cannot produce one.
- `transposePitch` spells sharps-only by table (`transposition.ts:40-44`) and
  says so in its own comment: render spelling was deferred, and this slice is
  that deferral coming due for the vocal line.
- `transposeScore` (`transposition.ts:63`) is NOT in scope. N.94 adopts the
  policy later; do not touch it here.
- Reader output: `run_page2.py` emits midi; the pitch is spelled downstream
  in the recognized-to-MusicXML path
  (`apps/web/src/lib/shane/ingestion/recognized-to-musicxml.ts`). Leg 3's
  wiring point is there or wherever midi first becomes a `Pitch`; locate it,
  cite it in the memo.

## French, approved by Dann 2026-08-24

Bémol and dièse are adopted from `i18n.ts:436-439`; bécarre is adopted from
standard usage, new to the app, coined by nobody.

| key | en | fr |
|---|---|---|
| `notation.tool.flat` | Flat | Bémol |
| `notation.tool.sharp` | Sharp | Dièse |
| `notation.tool.natural` | Natural | Bécarre |

## Definition of done

WRITTEN is not DONE. DONE requires Dann's walk on a deploy.

1. Five gates at baseline; if a baseline moves, update `ilya-ship.sh` in the
   same ship and say so. Byte counts for anything under `apps/web/static/`.
2. Unit evidence, vitest, node environment, no DOM: the policy across all
   fifteen key signatures; cumulative verb behaviour including the double cap
   and natural's reset; the nudge in a flat key; a hand spelling surviving a
   policy pass.
3. A domain check a musician would accept, not a proxy: spell a known
   chromatic passage from the corpus and compare against its engraved source.
   Do not trust a number your own script printed.
4. Walk script for Dann, on a deploy: in a flat-key score, a nudged note
   shows the flat-side spelling; flat-flat reaches a double flat and a third
   click does nothing; natural resets it; a corrected spelling survives a
   reload; the palette tools sit in the NOTATION anchor at 44 px.

## Return memo format

`docs/sessions/memo-n92-slice2_r1_<date>.md`: what shipped, gate lines, the
policy's wiring point in the ingestion path with `path:line`, the corpus
spelling comparison, and a section headed **NOT ESTABLISHED** listing
everything the work could not establish. NOT ESTABLISHED beats a complete
invented answer.

## Do not

- Do not run git. Ask Dann to `git add` new files before any ship.
- Do not change `VocalLineEvent`, add a save site, or touch
  `apps/web/src/lib/shane/reconciliation/`.
- Do not touch `transposeScore` or the transposition suggestions.
- Do not add a respell verb; it is ruled out of this slice.
- Do not alter the approved French.
- Do not put any accidental control on the paper; the palette lives in the
  drawer.
- Do not hand-roll a second speller anywhere; one policy function, imported
  by both consumers.
