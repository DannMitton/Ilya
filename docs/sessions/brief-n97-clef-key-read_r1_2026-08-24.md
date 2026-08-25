# Code brief — N.97: clef and key reading, ask becomes confirm

**r1, 2026-08-24. Serves N.97, numbered by Dann 2026-08-24. The correction-id
re-key (measure + x) was ruled by Dann in the desk session of 2026-08-24.**

Paste this into Claude Code pointed at `~/Desktop/ilya-rewrite`, branch `Shane`.

---

## Goal

The page reader learns clef and key-signature glyphs by the same Leipzig
template machinery it already uses for rests and time signatures. The payoff,
measured in `docs/sessions/memo-n95-decomposition_r1_2026-08-24.md`: 11 of 13
notehead false positives sit on clef and key ink. Three legs, one ship each or
combined as the gates allow:

1. **Read the glyphs, mask the ink.** Detect the clef at the left of each
   system and the run of sharps or flats to its right. Remove that ink from
   notehead candidacy. Emit the detected clef and fifths in the reader's
   output.
2. **Ask becomes confirm.** The intake prompt pre-fills with what was read and
   asks the user to confirm rather than answer blind. On abstention it falls
   back to the existing ask wording unchanged.
3. **Re-key correction ids to measure + x.** Ruled by Dann. Onset leaves the
   id because N.97 changes the event population and onset is a running sum
   over it.

## What the tree says now (all read by the desk, 2026-08-24)

- Ids are built as `r{measureIndex}-{onsetNum}-{onsetDen}-{x}` at
  `apps/web/static/reader/run_page2.py:427-428`; onset accumulates over the
  measure's preceding events at `:414-437`. Removing a false positive early in
  a measure renames every event after it.
- Corrections are a diff keyed by event id, applied after every re-read:
  `apps/web/src/lib/shane/correction.ts:1-24` (read in full). Ship 3's hard
  constraints stand: `VocalLineEvent` is not touched, no new save site,
  corrections stored beside `pairings`.
- Clef and key currently enter the reader as user answers:
  `run_page2.py:460-461` reads `cfg['clef']` and `cfg['key']`;
  `apps/web/src/lib/shane/ScoreUploader.svelte:334-343` supplies them from the
  ask (`CLEF_CHOICES` at `:163-166`, `fifths` at `:169`).
- Template machinery to copy: `apps/web/static/reader/timesig.py` and
  `rest_templates.py` render Leipzig glyph outlines via Verovio into cached
  JSON, listed in `apps/web/static/reader/manifest.json:15-16`. Study
  `timesig.py:438-467` before matching: it documents the same-font ghost-digit
  fault and its cure.
- The intake strings live at `apps/web/src/lib/i18n.ts:428-441`
  (`upload.ask.*`). The option labels are reused by the confirm variant; only
  the frame strings are new (table below).

## Design constraints, in the domain

- **A plain G clef on paper does not establish sounding octave.** Tenor lines
  print a plain treble clef and sound an octave lower; only some editions
  print the small 8. The confirm keeps the existing three-way clef choice.
  Detection pre-selects treble ottava only when the 8-bearing glyph matched;
  a plain G clef pre-selects plain treble; the user can still change it.
- **Behavioural invariant:** confirming unchanged values, or overriding them,
  must produce exactly the read the old ask path would have produced with the
  same answers. Whether that is a two-phase read or a re-run is Code's choice.
- **New id scheme:** `r{measureIndex}-{x}`. If two events in one measure share
  an x, disambiguate with a stable ordinal suffix on the second and later
  (`r{mi}-{x}-2`, counting in x-sorted order). Say in the return memo whether
  the corpus ever hits this.
- **Migration:** stored corrections re-key at load by stripping the onset
  segment syntactically. On a post-strip collision, the first entry wins and
  the rest are orphans. This runs once per stored song and must be idempotent.
- **Orphan report (desk recommendation, included with the ruled re-key, not a
  separate ruling):** after any re-read, corrections whose id no longer
  resolves are counted and the count surfaced in the drawer. A correction that
  fails to land never fails silently. Drawer manipulates, page displays: no
  mark on the paper.
- The false-positive claim is measured against the engraved ground truth in
  memo N.95. Re-run that comparison after masking and report the new channel
  counts. Do not trust a number your own script printed without the engraved
  cross-check.

## French, approved by Dann 2026-08-24

**Dann approved this table as written, in the desk session of 2026-08-24.**
All vocabulary is adopted from existing strings (`clé`, `armure`, option
labels unchanged); the two sentences are new.

| key | en | fr |
|---|---|---|
| `upload.confirm.title` | Two things Ilya read from the page | Deux choses qu'Ilya a lues sur la page |
| `upload.confirm.why` | Ilya read the clef and the key signature off the picture. Check them against your own paper, and change them if it read wrong. | Ilya a lu la clé et l'armure sur l'image. Vérifiez-les sur votre propre partition, et corrigez-les s'il a mal lu. |
| `notation.orphans` | %s corrections no longer find their note | %s corrections ne retrouvent plus leur note |

The `notation.orphans` row carries the drawer's orphan count from the
correction re-key leg. Dann approved it 2026-08-24, with the two rows above.

Buttons, option labels, and the abstention fallback reuse `upload.ask.*`
unchanged.

## Definition of done

WRITTEN is not DONE. DONE requires Dann's walk on a deploy.

1. Five gates at baseline. Gate 4's baseline is 754 and `ilya-ship.sh:79`
   expects it; if the bundle count moves, update the script in the same ship
   and say so.
2. Anything new or changed under `apps/web/static/` (template JSON, manifest)
   is reported with its byte count.
3. Unit evidence under vitest, node environment, no DOM: id construction,
   collision suffix, migration idempotence, and a fixture proving a correction
   survives the removal of an earlier false-positive event in its measure.
4. Corpus evidence: the N.95 decomposition re-run, false-positive count
   before and after masking.
5. Walk script for Dann, on a deploy: the Lamm scan reads; the prompt shows
   the detected clef and key pre-filled; he changes nothing and the read
   matches; corrections made in the drawer survive a reload.

## Return memo format

`docs/sessions/memo-n97-clef-key_r1_<date>.md`: what shipped (commit per
ship), the gate lines, the byte counts, the N.95 before/after table, the
collision answer, and a section headed **NOT ESTABLISHED** listing everything
the work could not establish. NOT ESTABLISHED beats a complete invented
answer.

## Do not

- Do not run git. Ask Dann to `git add` new files before any ship.
- Do not change `VocalLineEvent`. Do not add a save site. Do not rebuild
  anything in `apps/web/src/lib/shane/reconciliation/`.
- The French table above is approved; do not alter its wording.
- Do not put a mark on the page for uncertainty; the drawer carries the
  orphan count.
- Do not store anything derived; the detected clef and key are re-derived on
  every re-read, like everything else the reader emits.
