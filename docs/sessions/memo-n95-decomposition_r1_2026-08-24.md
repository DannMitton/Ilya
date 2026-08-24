# N.95: error decomposition, sunless-01 p1, count/pitch/duration

Deterministic OMR reader (E.16) run against the engraved ground truth for one scanned page of Mussorgsky's "Sunless," song 1 ("Within four walls" / "В четырёх стенах" / "In vier Wänden"), 1931 Lamm piano-vocal edition, scan page 1 at 400 dpi.

## Method

- Staged `reader/`, `scans/`, and `output/mussorgsky---sunless-01---within-four-walls/` from `/mnt/user-data/uploads/ilya-rewrite/tools/e16-harness/` into a writable working copy, then copied the reader modules and the `fonts/*.json` template caches to `/home/claude/` (the path `run_page2.py` hardcodes via `sys.path.insert(0,'/home/claude')`) and to `~/.cache/{rest,timesig}_templates_leipzig.json` (the paths `rest_templates.py`/`timesig.py` read via `CACHE_PATH`), so no `verovio`/Node call was needed at run time. `md5sum` on the copies matched the staged originals.
- `pip install opencv-python-headless numpy matplotlib --break-system-packages` — opencv-python-headless 4.13.0.92 and numpy 2.4.4 were already present; no install was actually required.
- Invoked `run_page2.run(cfg)` directly (not the browser build), with `cfg = dict(png=<raster400-1.png>, clef=('G',2), key=2, octaveChange=0, pieceId=<piece id>)`, `measures_per_system` omitted so it derives from detected barlines per the module's own rule ("N.59, Ruling A").
- Ground truth (`ground-truth.json`) covers the vocal part only (`vocalPart.partName = "Bass"`, `clef.sign=F, clef.line=4`, i.e. bass clef in the Finale/MusicXML source) across the whole 18-measure song (`measureDurations`, indices 0-17), with two verses of lyric-tagged notes (verse 1 used throughout; verse 2 has an identical note/duration skeleton, different `syllableText`).
- The page-to-ground-truth correspondence (below) was established by matching the scan's printed Cyrillic lyric syllables, measure by measure and system by system, against `verses[0].notes[*].syllableText`, cross-checked against the MusicXML's own time-signature sequence (a single 6/8 measure, then 12/8 from measure 2 on — MusicXML measure numbers are 1-indexed, `measureDurations` is 0-indexed, so MusicXML measure 1 = `measureDurations[0]`) and against `expectedDuration` (3/4 for measure 0, 3/2 for the rest, i.e. 6/8 then 12/8 in whole-note units — matches).
- Reader-vs-ground-truth note matching used a hand-verified monotonic sequence alignment (Needleman-Wunsch, gap penalty 5 semitones, substitution cost = |octave-corrected reader MIDI − GT MIDI|) per system, run on the reader's raw per-note `x`-ordered output (not on `run_page2`'s own `measureIndex`, because barline detection failed on this page — see Count below). The automatic alignment was checked by eye against the scan for all three systems; it placed 4 false positives at the *start* of system index 1 as real matches (the two candidate alignments tie in DP cost), which was corrected by hand after visually confirming the true first note's position and pitch. This is flagged explicitly under "matching rule" caveats below and in NOT ESTABLISHED.
- Every surprising number (the barline-detection failure, the 4 clef/key-glyph false positives per system, the 0/28 duration exact-match rate, the constant octave offset) was checked against a pixel crop of the actual scan before being reported, per the task's sanity-check rule. Crops used: staff-line row detection via `cv2` column/row ink-sum, `PIL` crops at the relevant `x,y` ranges.

## Control expectation

cv2 version: **4.13.0** (opencv-python-headless 4.13.0.92). Reader's own output: **9 staves**, **3 systems**, vocal staves auto-selected at staff indices **[0, 3, 6]**, **55** notehead detections on the vocal staff. This matches the stated cv2-4.13.0 control expectation (55 notes, 3 systems, 9 staves) exactly. No crash, no missing systems; proceeding to the music-level report is warranted.

## Page-to-ground-truth correspondence

**ESTABLISHED.** Scan page 1 covers ground truth **measureIndex 0 through 8** (9 of the song's 18 measures), 3 measures per system:

| scan system | reader `sys` index | GT measures | vocal syllables (verse 1) |
|---|---|---|---|
| 1 ("Andante tranquillo", Canto) | 0 | 0 (rest, piano only), 1, 2 | "Комнатка тесная," / "тихая, милая;" |
| 2 ("Тень непроглядная...") | 1 | 3, 4, 5 | "Тень непроглядная," / "тень безответная;" / "Дума глубокая," |
| 3 ("песня унылая...") | 2 | 6, 7, 8 | "песня унылая;" / "В бьющемся сердце" / "надежда заветная;" |

Verified by matching every printed Russian syllable in the scan against `syllableText` in the ground truth, measure by measure, for all 9 measures; all matched. Each system is a 3-staff brace (vocal + piano treble + piano bass) — the Lamm 1931 print does not collapse the piano onto one staff on this page (matches the "repaired," three-staves-per-system convention the README warns about, not the legacy two-staff convention).

## Count

Ground truth (vocal, measures 0-8) has **48 notes** and **10 rests** (measure 0 is an all-rest measure for the voice; the piano plays alone). The reader emits **0 rests** and **55 note-type detections** for the vocal staff.

| system | GT notes | GT rests | reader detections | matched | extra (false positive) | missing |
|---|---|---|---|---|---|---|
| 0 | 12 | 3 | 15 | 12 | 3 | 0 |
| 1 | 18 | 3 | 17 | 13 | 4 | 5 |
| 2 | 18 | 4 | 23 | 17 | 6 | 1 |
| **total** | **48** | **10** | **55** | **42** | **13** | **6** |

- **42/48 (87.5%) of true GT vocal notes were recovered** by some reader detection; 6/48 (12.5%) were never detected at all (all 5 missing in system 1, clustered mid-system: про, гляд, без, на, ду — the syllables "про-гляд-на-я" and "без...на" in measures 3-4, and "ду" opening measure 5).
- **13/55 (23.6%) of the reader's detections are false positives** with no corresponding GT note. **11 of the 13 (85%) sit on the clef and key-signature glyphs** at the very start of each system — 3 in system 0, 4 in system 1, 4 in system 2, each at an x-coordinate visually confirmed (pixel crop) to overlap the treble clef loop and/or the two key-signature sharps, before any real note or barline. This is a clean, systematic false-positive source: the notehead detector fires on clef/key-signature ink. The remaining 2 (both in system 2, x=929 and x=2400) are interior to the music and their cause is **NOT ESTABLISHED** — plausibly a double-detection of one physical notehead (a stem crossing at the wrong offset) rather than genuinely spurious ink, but this was not confirmed against the raster.
- **Rests: 0/10 found.** `run_page2.detect_rests_multi` (`run_page2.py:73-93`) template-matches Leipzig rest glyphs at `thr=0.62` and found zero matches anywhere on the vocal staff across all three systems, a total miss on this page.
- **Barline detection failed on this page: 0 barlines found in all 3 systems** (`detect_barlines`, `reader.py:872-881`). Root cause, measured directly: `detect_barlines` requires `w<=6` (pixels, absolute, `reader.py:879`); at this page's staff size `s=30` (400 dpi), the true barline strokes measure **8-10 px wide** by direct column-ink-sum measurement (three independent barlines checked). The threshold is calibrated for the README's cited fixture staff size `s≈21`; it does not scale to this page's resolution. Consequence: `run_page2`'s own `measures_per_system` auto-derivation (`run_page2.py:198-201`, "N.59, Ruling A") collapsed to 1 "measure" per system, and every onset after the first note in a system keeps accumulating instead of resetting at a barline — the module's own `msum`/`measureIndex` output is **not usable** for this page's per-measure duration or onset arithmetic. This is why the Count/Pitch/Duration matching above was done by hand-verified x-order + pitch alignment against the known per-system GT span, rather than by the reader's own measure segmentation. This barline failure also means the accidental engine's per-measure "carry" reset (`reader.py:895-896`, `if lm!=curm: carry={}`) never fires within a system, since `lm` is computed from the same empty barline list — accidental carry is at risk of leaking across true barlines on this page. No leaked-accidental case was conclusively identified in the matched pitches below, but the mechanism for one is present and unverified either way.

## Pitch

**Matching rule:** the octave-corrected reader MIDI (reader MIDI − 12; justification below) was compared to GT MIDI for each of the 42 matched note pairs established above.

**The reader assumes clef and key signature; it does not read them from the page.** `clef_topD(sign, line, octaveChange)` (`reader.py:604-610`) takes the clef as an argument and is called as `clef_topD(cfg['clef'][0], cfg['clef'][1], cfg.get('octaveChange',0))` at `reader.py:749`; `key_alter(cfg['key'])` at `reader.py:888` does the same for the key signature. No clef-glyph or key-signature-glyph detector exists anywhere in `reader.py` — both are caller-supplied. For this run, `clef=('G',2)` (treble) and `key=2` (2 sharps) were supplied, matching what is literally printed on the scan (confirmed visually: G-clef, two sharps, on all three systems).

**Systematic component, confirmed on 42/42 matched notes: a constant −12 semitone (one octave) offset between the reader's literal treble-clef reading and the ground truth's MIDI values.** This is not a reader arithmetic fault: the ground truth's vocal part is sourced from a Finale file notated in **bass clef, sounding pitch** (`clef.sign=F, clef.line=4` in `ground-truth.json`), while the 1931 Lamm scan prints the same vocal line in **treble clef, one octave up from sounding pitch** — a real, if unusual, print convention for a bass voice. Supplying the printed clef (`G`,2) is the *correct* instruction for reading what's on the page; the octave gap is a property of the corpus (scan notation vs. Finale-source notation), not of `clef_topD`'s arithmetic. Every one of the 42 matched notes needed exactly this −12 correction before any further comparison was meaningful.

**Residual, after the octave correction:**

| residual pitch diff (semitones) | count | share of 41 pitched matches |
|---|---|---|
| 0 (exact) | 36 | 87.8% |
| ±1 | 3 | 7.3% |
| ±4 | 2 | 4.9% |
| pitch abstained (`accidental_unresolved`) | 1 | (of 42 total matches) |

The residual errors are **scattered, not a second constant offset** — no single non-zero value dominates. The 2 four-semitone misses (`reader.py`-computed `L,O` staff position, both in system 0: GT "я," midi 53 read as 57; GT "ла" midi 57 read as 61) are consistent with a one-staff-line vertical mis-localization of the notehead center (a line-to-line step is roughly a third, not a step, on a 5-line staff) rather than an accidental fault — a segmentation-stage error, not a clef/key/transposition fault. The 3 one-semitone misses are consistent with an accidental (sharp/flat/natural) misclassification by `read_accidental` (`reader.py:840`) rather than a positional one. One note abstained on pitch (`pitch_abstain: accidental_unresolved`, the accidental engine's own honest "I can't resolve this" path, `reader.py:897-903` / README's abstain-path spec).

## Duration

The reader abstains on a duration it judges beam-scale ink with no beam found (`dur_abstain: 'beam_scale_ink_no_beam'`, `run_page2.py:138-145`).

- **Across all 55 vocal-staff detections: 17 abstained (30.9%), 38 emitted a confident duration.** This is markedly different from the stated prior-run baseline of 50/57 abstaining (87.7%); the discrepancy is **NOT ESTABLISHED** — plausibly a different call path (browser build vs. this direct `run_page2.run` call) or a beam-detection difference at this page's resolution/font, but not confirmed either way in this session.
- **Among the 42 GT-matched notes: 14 abstained (33.3%), 28 emitted a confident duration.**
- **Of those 28 confident, matched durations: 0 are correct (0/28, 0%).** This was checked against the scan (several spot pixel crops) and is not an artifact of the matching rule — it holds across all three systems, including system 2 where the pitch channel is a clean 17/17 exact match, so it is not a mismatched-pairing artifact.

Ratio of reader duration to true duration, over the 28 compared:

| ratio (reader / true) | count | reading |
|---|---|---|
| 1/2 | 12 | one extra flag counted (e.g. true quarter read as eighth) |
| 1/4 | 7 | two extra flags counted (true quarter read as sixteenth) |
| 3/4 | 5 | 1/2 pattern plus a spurious augmentation dot |
| 3/8 | 2 | 1/4 pattern plus a spurious augmentation dot |
| 4/1, 4/3 | 1 each | both are the reader's hollow-notehead (minim) branch firing on a filled notehead (see below) |

**This is systematic, not scattered: 26/28 (93%) are explained by one mechanism — the reader over-counts flags on this page**, always in the same direction (reads a *shorter* duration than truth, i.e. more flags than are really printed), consistent with `dur = Fraction(1, 4*(2**nb))` / `nflags` classification against connected-component area (`run_page2.py:130-150`) crossing `FLAG_AREA_RATIO = 1.65` (`reader.py:923`, an `s²`-normalized ratio calibrated on a rendered page, "piece 02 p1," per the comment at `reader.py:909-922`) too early on this page's ink. The threshold is nominally DPI-portable (it is normalized by `s²`), but it is explicitly documented as **not font-portable** — "the least font-portable values in the reader, with roughly 5% headroom on both sides under a font change" (README, known-limitations list) — and this page is the first case in this session's evidence of it being tested against real scanned 1931-print ink rather than a rendered page; the gap here is far outside 5%. **The 2 outlier ratios (4/1, 4/3) are a distinct, second fault**: both are cases where the reader's hollow-notehead (minim) detector fired confidently on what the ground truth and the printed page (visually confirmed) show as an ordinary filled notehead, emitting `dur = Fraction(1,2)` unconditionally (`run_page2.py:134-135`, `if r.get('hollow'): dur = Fraction(1,2)`) — this branch **never abstains**, so a hollow-detector false positive is a confident wrong answer that the abstain path cannot catch.

## What the reader attempts, with citations

- **Notation scope: vocal staff only, by architecture.** `detect_heads(img, staves, vocal, s, ...)` (`reader.py:739`) is given the `vocal` staff-index list and never sees the other staves; nothing in `reader.py` or `run_page2.py` reads piano-staff noteheads, pitches, or durations. "All staves" is therefore not a meaningful extension of this decomposition for this reader — it is a vocal-line reader by design (its own README's title), and piano staves are 0% attempted, not merely 0% found.
- **Clefs: not attempted.** Caller-supplied (`cfg['clef']`), consumed at `reader.py:604-610, 749`. No clef-glyph detector exists.
- **Key signatures: not attempted.** Caller-supplied (`cfg['key']`), consumed at `reader.py:888` (`key_alter`). No key-signature-glyph detector exists.
- **Accidentals: attempted.** `read_accidental` (`reader.py:840-871`) classifies sharp/flat/natural glyphs near a notehead structurally, with a per-measure carry (`reader.py:893-903`) reset at each detected barline — a mechanism whose reset failed to fire anywhere on this page (see Count, barline failure).
- **Rests: attempted, found none here.** `detect_rests_multi` (`run_page2.py:73-93`), Leipzig-glyph template matching, `thr=0.62`; 0/10 true vocal rests found on this page.
- **Lyrics: not attempted.** No OCR or lyric-to-note alignment code exists anywhere in `reader.py` or `run_page2.py`.
- **Voice separation: not attempted.** `select_vocal` (`reader.py:577-602`) picks exactly one staff per system as "the vocal" via a largest-inter-staff-gap heuristic that the README itself calls "known-weak... not merely mistuned: within-system and between-system gap populations overlap on real pages, so no threshold separates them" (README, known-limitations list). Within the chosen staff, every detected notehead becomes one sequential event; there is no chord/polyphonic-voice splitting logic anywhere in the pitch or rhythm path.
- **Tuplets: not attempted** (README, known-limitations list) — not evaluated in this page's span since no tuplet appears in measures 0-8, but flagged for completeness since it's a stated abstain-blind spot.

## Systematic vs. scattered, one line per channel

- **Count:** false positives are systematic (11/13 sit on clef/key-signature ink, a single named mechanism); missed notes (6) and the 2 unexplained interior false positives are scattered / not established.
- **Pitch:** the dominant error (100% of matched notes, before correction) is systematic — a constant octave offset from the corpus's clef-convention mismatch between the scan and the Finale-sourced ground truth, not a reader fault. The residual error after correcting for that (12% of matched, pitched notes) is scattered — a mix of likely staff-line mis-localization and likely accidental misclassification, no further constant.
- **Duration:** systematic. 93% of confidently-read, matched durations are explained by one mechanism (flag-count over-classification against an ink-weight-calibrated, not-yet-scan-validated threshold, `reader.py:923`), all biased the same direction (reader reads shorter than truth). A second, smaller systematic mechanism (hollow-notehead false positives, 2 cases) compounds it and is not caught by the abstain path.

## NOT ESTABLISHED

- Why this session's duration-abstention rate (17/55, 30.9%) differs so sharply from the stated prior-run baseline (50/57, 87.7%). Not reproduced against a browser-build run in this session.
- The cause of the 2 interior (non-clef-glyph) false-positive note detections, system 2, x=929 and x=2400 — plausibly duplicate detection of one physical notehead, not confirmed against the raster.
- Whether the accidental-carry-across-barlines risk (barline detection found nothing on this page, so the per-measure carry reset never fires) actually produced any wrong pitch in the matched set. No case was positively identified as such, but the mechanism is live and unverified either way given the barline failure.
- Piano-staff count/pitch/duration accuracy: not evaluated at all, because the reader does not attempt piano staves (see above) and the supplied ground truth (`ground-truth.json`) does not cover them either — only the MusicXML has piano data, and building a piano ground truth and a chord-aware matching rule for it was out of this session's scope.
- Whether the DP alignment's tie-breaking (which required a hand correction on system 1) affected any of the other two systems in a way that wasn't caught by the pixel-crop spot check; all three systems' extras and near-boundary matches were checked, but not every interior match was individually re-verified against the raster.
