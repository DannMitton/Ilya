# E.16 reader — the deterministic vocal-line reader

**Status: rev9 (2026-07-27, the `detect_staves` gate and the SVG oracle).** This directory is the first in-repository home for the E.16 reader's Python implementation. Until now the only copy lived in a claude.ai project document.

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
| `oracle.py` | **NEW, rev9.** The SVG frozen-truth oracle. **Harness-only; never imported by the runtime path** |
| `envelope.py` | **NEW, rev7.** The piece-level `piece_ctx` cookie, `run(cfg, ctx_in) -> ctx_out`, threading metre/grouping/key/clef/octaveChange/vocalStaff facets across pages and building the additive `measures` array |

## Source of truth: read this before editing

**THIS DIRECTORY IS AUTHORITATIVE.** Ratified by Dann, 2026-07-27. The capsule is now a **generated export**, produced from this directory when one is wanted, never hand-maintained and never the source.

The previous convention had it the other way round, and it was measured wrong. On 2026-07-27 the coordinating session checked four ways and found: **there is no `claude/` directory on disk, no capsule file anywhere in this repository, and `git log --all --diff-filter=A -- 'claude/*'` returns nothing.** The capsule existed only as a claude.ai project document. So the artifact the README called authoritative had no durable, checkable, version-controlled existence, while the one it called derived was committed and hashed exactly.

The `claude/...` paths throughout the project documents are **project-knowledge paths, not filesystem paths.** They look like repository paths and are not. That naming is the trap that hid this for months.

Three consequences, all live:

- **Change reader code here.** Do not transcribe modules by hand into a capsule; hand-transcription of eight modules is the operation most likely to introduce silent drift, which is the failure the old rule existed to prevent and was instead causing.
- **`scorer_local.ts`, `oracle.py`, and `oracle-counts.json` were orphans** under the old convention: real project code the capsule never tracked. `scorer_local.ts`'s `scoreMetre()` was lost once for exactly that reason and had to be re-implemented. Under this ruling they are covered like everything else in the repository.
- **The old rule's substance survives in a better form:** never rebuild reader code from a handover's prose. Restore it from git.

Sessions still need the code inside a cloud sandbox. Stage it from the repository, and **verify by direct `device_bash md5sum` against the committed hashes, never by re-staging**, which can return a stale cached copy.

## Restoring into a sandbox

**Stage the modules from this directory**, which is authoritative as of 2026-07-27. Do not restore from a capsule; a capsule is now a generated export and may lag.

```bash
# in the sandbox, after staging tools/e16-harness/reader/ across the device bridge
cp <staged>/reader/*.py /home/claude/
md5sum /home/claude/*.py       # compare against a DIRECT device_bash md5sum, not a re-stage
```

**Verify by direct `device_bash md5sum` of the mounted file, never by re-staging.** `device_stage_files` can return a stale cached copy after a write; this has bitten on 2026-07-23 and twice on 2026-07-27.

Then add that directory to `sys.path` before importing. `run_page2.py` currently hardcodes `sys.path.insert(0, '/home/claude')`, which is a sandbox assumption, not a general one. `oracle.py` is deliberately **not** part of that import surface: it is a harness truth source and must stay out of the runtime path.

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
- **RESOLVED, rev9 (2026-07-27): `detect_staves`'s silent staff loss is closed, and an independent ORACLE now certifies it.** The `rowfrac > 0.35` gate is replaced by a **per-page derived gate** using a population-shape criterion: segment the page's own coverage distribution at `floor = 0.015`, accept the top segment unconditionally, then walk downward accepting each further segment only if it is both tight (`span < span_bound`, **strict**) and populous (`len >= min_members`). Ratified constants, frozen as **one configuration record**: `span_bound = 0.0137` (**DERIVATION STRUCK, 2026-07-27, correction eight. Both exemplars, repaired sunless-06 p6 span `0.012903225806451535` and repaired sunless-06 p5 span `0.014516129032258074`, contain ZERO staff lines. Both are contamination consistent with lyric text between staves, verified against Verovio SVG staff-path geometry and independently confirmed. A midpoint between two objects of the same kind is not a boundary between kinds. The VALUE 0.0137 is RETAINED as an empirically pinned constant whose sole authority is the thrice-verified corpus outcome recorded below, and it is scheduled for replacement by the unified 5.1 + 5.2 track. DO NOT CITE THE MIDPOINT DERIVATION.** `claude/fable-ruling-e16-correction-eight-exemplar-contamination_2026-07-27.md`), `min_members = 5` (measured margin **[4, 5]**, retained structurally: five lines to a staff), `floor = 0.015`, and a declared `0.005` pre-filter with measured inert range `[0.0, 0.1]`. **Silent discard is abolished**: a group of three or more lines that is not exactly five now **raises**, carrying the page identity and the full group-size list; groups of one or two are still discarded as ink. Measured against the oracle across 47 rendered pages: **45 correct, 1 loud, 1 silent**. **AT-1 passes: zero silent repaired pages.** Rulings: `claude/fable-ruling-e16-detect-staves-mechanism_2026-07-27.md`, `claude/fable-ruling-e16-oracle-amendment_2026-07-27.md`, `claude/fable-ruling-e16-at10-reconciliation_2026-07-27.md`.
- **NEW, rev9: `oracle.py` is the frozen-truth source, and it is HARNESS-ONLY.** Every page in this corpus is a Verovio render whose `.svg` states systems and staves directly. `oracle.py` reads it, counts staff elements in each system's first measure, and **sums per system**; it never multiplies by an assumed uniform staves-per-system, and it **raises** if systems on a page differ. `oracle-counts.json` freezes all 48 counts (47 renders plus the close fixture at 1, certified by construction). **It must NEVER be imported by `reader.py` or by anything in the runtime path.** If the detector can read the answer key, its acceptance tests mean nothing. Standing law, ratified: **no acceptance test may take its expected value from the mechanism under test.**
- **NEW, rev9: `beams.py` carries a SECOND hardcoded `rowfrac > 0.35`**, at lines 58 and 60 of `remove_lines_safe`, deciding how far each staff line's ink extends. It is the same struck constant, in a second file, and it has never been examined. Unreachable by the gate fix because that item's AT-7 required `beams.py` byte-identical. **Ratified as its own ledger item, resolved BEFORE ledger 2a**, since it sits upstream of every beam measurement.
- **NEW, rev9: legacy sunless-05 p5 returns 6 staves against a true 8**, at every `span_bound` from 0.0105 to 0.05. Its gate comes from the unconditionally accepted top segment, so the conditional walk never reaches it. It is AT-14's **single named exception**. **ANSWERED, 2026-07-27: the 0.0222 segment holds ZERO staff lines. The missing staves are in segment 2, coverage 0.3190 to 0.3367, which is the page's short final system at 36.4% of full width. The two-parameter (span, membership) form is STRUCK as a sufficient classifier: none of 2,664 swept triples returns the true 8, so this is a counterexample to the mechanism rather than a reach gap.** Ledger 5.2 is CLOSED as a question. Its replacement criterion is **blocked**: `run_concentration` alone cannot separate the populations at this call site, because any row whose ink is a single run scores 1.0 and 5,537 non-band rows across the corpus do. See the current handover. `claude/fable-ruling-e16-ledger-5-2-and-candidate-inadmissibility_2026-07-27.md`.
- **SUPERSEDED, rev8, retained for history: `detect_staves` silently loses real staves.** A staff contaminated by one extra detected line becomes a six-line group, and `staves = [st for st in staves if len(st) == 5]` then discards it **entirely**, so the staff vanishes from the list and every later index shifts. Measured across all 24 repaired pages: **11 of 24 lose at least one real staff, 30 staves in total, and only one of the eleven fails loudly.** Root cause is the `rowfrac > 0.35` gate admitting non-staff-line ink (repaired sunless-03 p4 carries 14 such rows at coverage 0.358 to 0.463 against real lines at 0.900 to 0.908); the adaptive staff-break threshold is the second victim, not the cause. **Legacy renders are affected too** (legacy sunless-03 p3 returns 4 of 6 staves, p4 returns 6 of 8), so this is pre-existing and not caused by the render repair, though the repair worsened it and pushed repaired p4 into total failure (1 staff of 9). A global gate cannot fix it: across pages the populations overlap, highest false row 0.5391 against lowest **real** staff line 0.5157 on a short final system. **Ruled** (`claude/fable-ruling-e16-detect-staves-gate_2026-07-27.md`, ratified): per-page derived gate, and **abstention replaces the silent discard**. Blocks A8. Every `detect_staves`-derived landed result in **both** render generations is quarantined pending a re-run and diff.
- **NEW, rev8: legacy and repaired renders have different staves per system, and nothing in the code says so.** Legacy renders collapsed the piano onto one staff, so a legacy page is **two** staves per system; repaired pages are **three**. `vocal=[0,2,4,6]` is right for a legacy page and wrong for a repaired one, and vice versa for `[0,3,6,9]`. This caused a piano-staff sweep during this session and is close to a T5 breach.
- **The beam stage fails in both directions.** A beam slanting at about 0.19 or steeper is annihilated by the flat horizontal opening (measured: 0% ink survival at 0.193, against 63 to 81% at 0.053 to 0.083). Separately, non-beam ink at a stem tip can be read as a beam (confirmed on piece 02 p1, where duplicated tempo text produced a false beam). Since rev6, the false negative is contained by the abstain path; **the false positive is not**, because the `nb > 0` branch emits confidently. Requeued as ledger item 2a, immediately after Front 3a and before step 6 (Item B of the Front 3a spec); **not touched by this session**.
- **`select_vocal`'s largest-gap heuristic is unsound**, not merely mistuned: within-system and between-system gap populations overlap on real pages, so no threshold separates them. Ruled for replacement by connectivity-based ownership.
- **`detect_barlines` uses an absolute `w <= 6` pixel bound** while every other threshold is staff-space-normalized. Untested at any staff size other than s ≈ 21.
- **Flag CC-area thresholds are ink-weight-calibrated**, the least font-portable values in the reader, with roughly 5% headroom on both sides under a font change.
- The stemless-semibreve path is unexercised, and whole-versus-half rest discrimination is unbuilt. Both are deliberately fenced out of the fixtures.
- **NEW, 2026-07-28: the irregular-grouping detector has been WIRED, and two of its three printed-search routes are FALSIFIED.** The wiring itself is verified: both gates reproduce exactly, note records are byte-identical to pre-change baselines, only `envelope.py` differs, and the branch is unreachable on the corpus because it contains zero irregular measures across all six pieces. **The modified `envelope.py` is deliberately NOT delivered** and is held pending rulings. The three falsifications, all confirmed independently: **(step 1)** `detect_start_of_bar_numerals` searches a window of `3.0 * s`, but its digit templates measure 1.29 s to 1.76 s wide, so two of the widest need 3.52 s before any plus sign while the function requires two digits **and** a plus sign. Both widths are multiples of `s`, so the deficit is scale-invariant and **the function cannot satisfy its own acceptance condition at any page size**. **(step 2)** `detect_dotted_barlines` returns pixel x-positions, and `detect_irregular_grouping` returns them to its caller **as a grouping tuple**, whose members are counts of beat units; nothing converts a pixel position into a position in the bar's duration. Two hits crash the `Fraction` arithmetic; **one hit silently returns an empty boundary list**, and one hit is the common case. **(step 3)** see the previous item. **The A7 fixture trio remains UNSPENT** and was never staged into the working container. `claude/sonnet-brief-e16-wire-irregular-detector_2026-07-27.md`.
- **NEW, rev8: search step 3 (`narrow_by_duration_division`) is UNSOUND and can return a confident wrong grouping.** It accepts an alternative when every one of its boundary positions coincides with some note **onset**, and onset coincidence is necessary but not sufficient. Measured: a 7/8 bar printed **2+2+3** has onsets {0, 1/4, 1/2}; Table 1's (4,3) boundary 1/2 is present and (3,4)'s 3/8 is not, so it narrows uniquely and returns **(4,3)** confidently. Gould's criterion at p. 178 is "the particular division of longer notes and rests", which is about note **values**. Unreachable on the corpus, masked on A7 fixtures (a) and (b) by steps 1 and 2, correctly abstaining on (c), so no planned test catches it. **RULED, 2026-07-27** (`claude/fable-ruling-e16-step3-duration-division_2026-07-27.md`): candidate 1, the **group-length event criterion**, governs. An alternative qualifies iff, for **every** group, an event (note or rest, ties not merged, exact rationals, no tolerance) has onset equal to the group start **and** duration equal to the group length. **The shipped code still implements the struck onset-coincidence test and fails 3 of that ruling's own 10 acceptance tests, T1, T2, and T5, as confident wrong answers rather than abstentions (measured 2026-07-28).** `narrow_by_duration_division(beats, beat_type, durations)` takes only durations and never compares an event's duration to a group's length, so **its signature cannot express the ruled criterion**. Returns to Fable under Q4's `MECHANISM SUBSTITUTED` rule; **do not fix it without a ruling.** `claude/opus-memo-e16-step3-unsound-onset-coincidence_2026-07-27.md`.
- **`scorer_local.ts` is NOT in the capsule's tracked surface, and its `scoreMetre()` was lost once already.** The Front 3a session wrote it, its memo recorded it as delivered, and it was not on disk; nothing preserved it because the capsule tracks only `score_rng.ts`. It was re-implemented from decision 6's definition, validated against two independently recorded figures, and delivered. **Whether `scorer_local.ts` joins the capsule is an open ruling.** Until it does, this can happen a third time.

## Provenance

Built under a Fable charter ratified by Dann, after a measure-first gate found no off-the-shelf OMR engine could read this corpus's vocal pitch. Validated by a blind read on a page from an engraver and font the reader had never seen (MuseScore 3.2.3, MScore), ruled **PASS WITH NAMED DEBT** on 2026-07-27: all 24 pitches correct, one duration defect, root-caused to beam-bar geometry rather than to the font change.

Key documents in the Shane project: `claude/e16-decisions-log_*.md` (charter, T1 to T6), the current `claude/e16-handover_v*.md`, `claude/fable-ruling-e16-close-blind-read_2026-07-27.md`, and `claude/fable-ruling-e16-post-close-architecture_2026-07-27.md`.
