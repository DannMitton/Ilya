# E.16 reader — the deterministic vocal-line reader

**Status: rev7 (2026-07-27, Front 3a).** This directory is the first in-repository home for the E.16 reader's Python implementation. Until now the only copy lived in a claude.ai project document.

## What this is

A deterministic, Gould/SMuFL-grounded vocal-line reader. It reads pitch and rhythm off a rendered or scanned page of piano-vocal music, using classical computer vision and notation arithmetic. **There is no machine learning anywhere in it** (charter tripwire T3), and every stage cites either an oemer classical counterpart or a Gould/SMuFL rule (T4).

| file | stage |
|---|---|
| `reader.py` | staff detection, vocal-staff selection, notehead localization, staff-position-to-pitch arithmetic, the structural accidental classifier, barlines, dots |
| `beams.py` | non-destructive staff-line removal, beam-bar detection, stem finding |
| `hollow.py` | hollow notehead (minim) detection by annulus matched filter |
| `rest_templates.py` | SMuFL rest glyph templates, rasterized from real Leipzig outlines via Verovio |
| `timesig.py` | printed time-signature reading; since rev7, also the validated multi-window anchor search (V1-V5) that reads every printed signature in a system, not just one per page |
| `run_page2.py` | the page-level driver: durations, rests, measure segmentation, the measure-integrity flag (skip_first-free since rev7), and the abstain path |
| `metre.py` | **NEW, rev7.** Table 1 (Gould p. 155) as a static classification table (simple/compound/irregular, beat boundaries) and the irregular-grouping detector (dormant: the corpus has zero irregular measures) |
| `envelope.py` | **NEW, rev7.** The piece-level `piece_ctx` cookie, `run(cfg, ctx_in) -> ctx_out`, threading metre/grouping/key/clef/octaveChange/vocalStaff facets across pages and building the additive `measures` array |

## Source of truth: read this before editing

There are two homes for this code and **exactly one of them must be authoritative.**

1. **This directory**, versioned in git alongside the rest of the harness.
2. **The capsule**, `claude/e16-reader-code_rev*.py` in the Shane project: a single Python file holding every module as a string, plus a restore script that writes them back out. Sessions restore from it because a cloud sandbox cannot clone the repo.

The project's standing rule has been **"restore the capsule verbatim; never rebuild from prose."** That rule exists because a session once rebuilt reader code from a handover's description and silently lost behaviour. It still applies.

**Recommendation, not yet ratified:** make this directory authoritative and treat the capsule as a generated export of it. Two hand-maintained sources of the same code will drift, and the drift will be silent. Until that is ratified, the capsule remains authoritative and **this directory must be updated from it, never the reverse.**

Either way, the invariant is the same: **the repo files and the newest capsule must be byte-identical.** If you change reader code, change both, in the same working session, or the next session silently reverts your work.

## Restoring into a sandbox

The capsule restores itself. From a directory that will serve as the sandbox's module root:

```bash
python3 e16-reader-code_rev7_2026-07-27.py     # writes each module to its real path
```

Then add that directory to `sys.path` before importing. `run_page2.py` currently hardcodes `sys.path.insert(0, '/home/claude')`, which is a sandbox assumption, not a general one.

## Dependencies

```bash
pip install opencv-python-headless numpy matplotlib --break-system-packages
npm install verovio@6.2.0        # rest_templates.py and timesig.py extract Leipzig glyphs through it
```

`rest_templates.py` and `timesig.py` hardcode `VEROVIO_DIR = "/home/claude/e16/node_modules/verovio"`. That is a sandbox assumption and a known wart.

## Running a page

The legacy single-page call still works unchanged (`run_page2.run`, no metre envelope, no `measures` array):

```python
import sys; sys.path.insert(0, '<module root>')
import run_page2
cfg = dict(png='page.png', clef=('G', 2), key=0, octaveChange=0,
           measures_per_system=[6], gt='ground-truth.json')
ro, msum, G, rests, events, read_metre = run_page2.run(cfg)
```

**Since rev7, prefer `envelope.run(cfg, ctx_in)`**, which wraps `run_page2.run`, adds the piece-scoped metre read (decision 1's V1-V5 anchor sweep) and the additive `measures` array (per-measure metre, classification, beat boundaries, and integrity), and returns a `ctx_out` cookie to pass as the next page's `ctx_in`:

```python
import envelope
ro1, ctx_out, msum, G, rests, events = envelope.run(cfg_page1, None)
ro2, ctx_out, msum, G, rests, events = envelope.run(cfg_page2, ctx_out)   # inherits metre across the page break
```

`cfg` gains one optional key, `page` (int, default 1), used only for provenance stamping in `measures[i].printedAt`.

Omit `vocal` to let `select_vocal` auto-detect. **It is a known-weak heuristic** with three recorded failures; supply `vocal` explicitly where the correct staff set is known. Scoring uses the harness's own `scorer_local.ts` via `score_rng.ts`, which since rev7 also reports an additive `METRE: judged=.. matched=.. accuracy=.. abstentions=..` line from `rec.measures` (inert when that field is absent).

## The abstain path (rev6, ratified 2026-07-27)

The reader emits `null` for any facet it cannot honestly determine, plus a facet-keyed reason:

```json
{"id": "r3-1-4-1497", "type": "note", "measureIndex": 3,
 "onset": {"numerator": 1, "denominator": 4},
 "duration": null, "midi": 74,
 "abstain": {"duration": "beam_scale_ink_no_beam"}}
```

Absence of an `abstain` key means confidence. A consumer that ignores the metadata cannot do arithmetic on `null`, so the failure surfaces instead of propagating. This is the charter's abstain-beats-guess principle made real: a flagged gap is recoverable, a confident wrong answer silently corrupts. Spec: `claude/fable-spec-e16-abstain-path_2026-07-27.md`.

## Known limitations, all named rather than hidden

These are live debt-ledger items, not surprises. Do not "fix" one in passing; each is ruled and queued.

- **Tuplet durations are unread.** A triplet's notes emit as plain eighths and over-fill their measure. The measure-integrity flag catches it; the harness rhythm F1, with its 0.2 whole-note tolerance, cannot see it.
- **RESOLVED, rev7 (superseded, kept for history): "Metre was read once per page, not per measure."** `timesig.py`'s V1-V5 anchor sweep now searches every system-start block and every after-barline window, including a system's final (cautionary) barline, and `envelope.py` threads the result across pages as a piece-scoped facet. A mid-piece metre change is no longer flagged as a defect on a correctly read measure, in principle -- see the next item for a measured case where the new search itself fails to read a real signature.
- **RESOLVED, rev8 (superseded, kept for history): "V2's \"1\"-suppression can eat a genuine \"1\"."** rev7 measured it on piece 01 p1's own printed 12/8 in single-font Leipzig: a digit-"4" ghost at 0.4636 sat 4.03 px (0.192 staff-spaces) from the true "1" at 0.8549, inside V2's 1.0s radius, so the true digit was dropped and the page's `metreAccuracy` read 1/12. rev8 replaces V2 with the ratified **score-margin** form: a "1" is suppressed within its 1.0s cluster **unless it outscores the best candidate of every other digit class there by at least `ONE_MARGIN = 0.2515`**. Derived by the `FLAG_AREA_MAX` midpoint rule from two measured exemplars (must-suppress margin 0.1117, must-keep margin 0.3913), guards ±0.1398, bisected admissible interval [0.1118, 0.3913]. Piece 01 p1 now reads 12/12. Ruling: `claude/fable-ruling-e16-v2-guard_2026-07-27.md`.
- **NEW, rev8: V2 has no barline function, and V5 is the sole barline-ghost defence.** Measured on the close fixture's final-barline ghost: V2 dropped **0 of 47** top-band and **0 of 53** bottom-band candidates, because no non-"1" digit clears threshold in that cluster, so its condition cannot fire. V5 kills it alone, on two independent prongs (`beat_type` 1 is not in {2,4,8,16}; 0.690s is inside the 1.0s barline exclusion). **Do not re-derive a barline rationale for V2, and do not delete either V5 prong believing V2 covers it.** Equally: **do not remove V2**, measured, removing it makes the close fixture read `1/4` confidently instead of 4/4.
- **NEW, rev8, and larger than it looks: `detect_staves` silently loses real staves.** A staff contaminated by one extra detected line becomes a six-line group, and `staves = [st for st in staves if len(st) == 5]` then discards it **entirely**, so the staff vanishes from the list and every later index shifts. Measured across all 24 repaired pages: **11 of 24 lose at least one real staff, 30 staves in total, and only one of the eleven fails loudly.** Root cause is the `rowfrac > 0.35` gate admitting non-staff-line ink (repaired sunless-03 p4 carries 14 such rows at coverage 0.358 to 0.463 against real lines at 0.900 to 0.908); the adaptive staff-break threshold is the second victim, not the cause. **Legacy renders are affected too** (legacy sunless-03 p3 returns 4 of 6 staves, p4 returns 6 of 8), so this is pre-existing and not caused by the render repair, though the repair worsened it and pushed repaired p4 into total failure (1 staff of 9). A global gate cannot fix it: across pages the populations overlap, highest false row 0.5391 against lowest **real** staff line 0.5157 on a short final system. **Ruled** (`claude/fable-ruling-e16-detect-staves-gate_2026-07-27.md`, ratified): per-page derived gate, and **abstention replaces the silent discard**. Blocks A8. Every `detect_staves`-derived landed result in **both** render generations is quarantined pending a re-run and diff.
- **NEW, rev8: legacy and repaired renders have different staves per system, and nothing in the code says so.** Legacy renders collapsed the piano onto one staff, so a legacy page is **two** staves per system; repaired pages are **three**. `vocal=[0,2,4,6]` is right for a legacy page and wrong for a repaired one, and vice versa for `[0,3,6,9]`. This caused a piano-staff sweep during this session and is close to a T5 breach.
- **The beam stage fails in both directions.** A beam slanting at about 0.19 or steeper is annihilated by the flat horizontal opening (measured: 0% ink survival at 0.193, against 63 to 81% at 0.053 to 0.083). Separately, non-beam ink at a stem tip can be read as a beam (confirmed on piece 02 p1, where duplicated tempo text produced a false beam). Since rev6, the false negative is contained by the abstain path; **the false positive is not**, because the `nb > 0` branch emits confidently. Requeued as ledger item 2a, immediately after Front 3a and before step 6 (Item B of the Front 3a spec); **not touched by this session**.
- **`select_vocal`'s largest-gap heuristic is unsound**, not merely mistuned: within-system and between-system gap populations overlap on real pages, so no threshold separates them. Ruled for replacement by connectivity-based ownership.
- **`detect_barlines` uses an absolute `w <= 6` pixel bound** while every other threshold is staff-space-normalized. Untested at any staff size other than s ≈ 21.
- **Flag CC-area thresholds are ink-weight-calibrated**, the least font-portable values in the reader, with roughly 5% headroom on both sides under a font change.
- The stemless-semibreve path is unexercised, and whole-versus-half rest discrimination is unbuilt. Both are deliberately fenced out of the fixtures.
- **The irregular-metre grouping detector (`metre.py`) is implemented but still not wired.** The corpus contains zero irregular measures across all six pieces; `envelope.py` wires only persistence and abstain for `classification == 'irregular'`, not the live ink search (`detect_start_of_bar_numerals`, `detect_dotted_barlines`). The A7 fixture trio has landed and is **unspent**. Wiring is farmed: `claude/sonnet-brief-e16-wire-irregular-detector_2026-07-27.md`.
- **NEW, rev8: search step 3 (`narrow_by_duration_division`) is UNSOUND and can return a confident wrong grouping.** It accepts an alternative when every one of its boundary positions coincides with some note **onset**, and onset coincidence is necessary but not sufficient. Measured: a 7/8 bar printed **2+2+3** has onsets {0, 1/4, 1/2}; Table 1's (4,3) boundary 1/2 is present and (3,4)'s 3/8 is not, so it narrows uniquely and returns **(4,3)** confidently. Gould's criterion at p. 178 is "the particular division of longer notes and rests", which is about note **values**. Unreachable on the corpus, masked on A7 fixtures (a) and (b) by steps 1 and 2, correctly abstaining on (c), so no planned test catches it. **Reported, not fixed: it is a spec-level question.** Must be ruled before A7 is treated as a pass. `claude/opus-memo-e16-step3-unsound-onset-coincidence_2026-07-27.md`.
- **`scorer_local.ts` is NOT in the capsule's tracked surface, and its `scoreMetre()` was lost once already.** The Front 3a session wrote it, its memo recorded it as delivered, and it was not on disk; nothing preserved it because the capsule tracks only `score_rng.ts`. It was re-implemented from decision 6's definition, validated against two independently recorded figures, and delivered. **Whether `scorer_local.ts` joins the capsule is an open ruling.** Until it does, this can happen a third time.

## Provenance

Built under a Fable charter ratified by Dann, after a measure-first gate found no off-the-shelf OMR engine could read this corpus's vocal pitch. Validated by a blind read on a page from an engraver and font the reader had never seen (MuseScore 3.2.3, MScore), ruled **PASS WITH NAMED DEBT** on 2026-07-27: all 24 pitches correct, one duration defect, root-caused to beam-bar geometry rather than to the font change.

Key documents in the Shane project: `claude/e16-decisions-log_*.md` (charter, T1 to T6), the current `claude/e16-handover_v*.md`, `claude/fable-ruling-e16-close-blind-read_2026-07-27.md`, and `claude/fable-ruling-e16-post-close-architecture_2026-07-27.md`.
