"""E.16 toolchain pin. Harness-only.

WHY THIS EXISTS
---------------
Standing law V1: no acceptance test may take its expected value from the
mechanism under test. That law is about the EXPECTATION. This module is the
same question pointed at the INSTRUMENT.

Every F1, precision, recall, and metre-accuracy figure this project has ever
recorded was produced by `_rhythm_spike/scorer_local.ts` via
`_rhythm_spike/score_rng.ts`. Those two files were pinned NOWHERE: not in the
thread opener's hash table, not in the handover, not in `reader/README.md`.
A silent edit to `scoreVerse` would move every score gate at once and every
gate would still print PASS, because each gate compares the scorer's output
against a number the scorer itself produced on a previous run.

`scorer_local.ts` has already been lost once: the Front 3a session wrote it,
its memo recorded it as delivered, and it was not on disk. Nothing preserved
it. Nothing checks it now either. This module is that check.

SEMANTICS, and this is the part that matters
--------------------------------------------
A hard pin would halt the moment a session legitimately edits `reader.py`,
which is most sessions, so it would be disabled within a day and would then
be worse than nothing. Instead this module requires drift to be DECLARED.

    verify_toolchain.verify(root, declared={'reader/reader.py': 'ledger 5.1'})

Any file whose hash has moved and which is NOT in `declared` raises. A file in
`declared` is reported with its old and new hash and allowed. This is the same
discipline the frozen configuration record already uses: a change must state
its predicted delta before it lands, and an unpredicted delta fails and
returns to Fable.

The pins below are the hashes measured by direct `device_bash md5sum` against
the mounted repository on 2026-07-27, cross-checked against the thread opener
v20 table for the twelve `reader/` files. The two scoring modules were
measured this session and were clean against their committed state; they
appear in no prior table, which is the gap this module closes.

STANDING RULE V2 COMPLIANCE
---------------------------
A (negative control): `python3 verify_toolchain.py --negative-control` copies
  the tree, flips one byte, and requires the verifier to raise. Run it before
  believing a pass.
B (provenance): every pinned path is asserted to exist and to have been read;
  the count of files actually hashed is asserted equal to the count pinned.
C (independent cross-measure): not applicable. A hash is not a gating figure.
D (denotation): the hashed object is asserted to be `bytes` of non-zero
  length, and the digest a 32-character hex string, before any comparison.
  The distribution of verdicts is reported, not just the aggregate.
"""
import hashlib
import os
import sys

# path relative to tools/e16-harness  ->  (md5, does this file feed a gate?)
PINS = {
    'reader/reader.py':            ('e703d919d26d3cef315c8a07a2bfad57', True),
    # DECLARED DRIFT 2026-07-28 (evening), the 5.1 landing. TWO changes.
    # (1) `remove_lines` gains a `page` parameter and threads it to
    # `beams.remove_lines_safe`, so a walk or sentinel raise names the page.
    # (2) THE SENTINEL is bound at detect_staves' five-line validation, which
    # is a RULED ACCEPTANCE point. It is deliberately NOT bound at the gate
    # above it: Fable re-denoted that gate CANDIDATE GENERATION, whose
    # over-acceptance is lawful by design, and a sentinel on the candidate
    # stream would fire on rows no decider ever accepted. Downstream of every
    # decision, upstream of none.
    # `_derive_rowfrac_gate` and its defaults are UNCHANGED: floor=0.015,
    # span_bound=0.0137, min_members=5. Proven, not asserted: gates 0.2 to
    # 0.5 re-run after the change, all four byte-identical in verdict, and
    # the oracle census holds at 45 correct / 1 loud / 1 silent.
    # DECLARED DRIFT 2026-07-28: AT-1 of the correction-eight ruling. The
    # _derive_rowfrac_gate docstring's span_bound MIDPOINT DERIVATION is struck
    # and the retracted phrase "GENUINE system of three staves" is corrected;
    # the identity/passage distinction and the zero-staff-line finding are
    # recorded, and "members" is defined in place as distinct coverage values.
    # DOCSTRING ONLY. No executable line changed; defaults remain
    # (floor=0.015, span_bound=0.0137, min_members=5). Proven, not asserted:
    # gates 0.2 to 0.5 re-run and note records byte-identical to baseline.
    'reader/substrate.py':         ('5c2bc1c9b6f580a981b4f9ebefc024e6', True),
    # NEW 2026-07-28 (evening). The bridged-run substrate and the sentinel,
    # shared by both call sites. Runtime module: no oracle, no SVG. Pinned
    # from creation because every quantity the walk decides on comes from it.
    'reader/oracle.py':            ('fb99088b1894d80c6cbba980ab5866eb', True),
    'reader/oracle-counts.json':   ('f74e6a4b234b20a8cfd2c98f2021c597', True),
    'reader/beams.py':             ('65d347a95049feee4fc2efe8a3e2114e', True),
    # DECLARED DRIFT 2026-07-28 (evening), the 5.1 landing, and the lift of
    # this file's byte-identity freeze (baseline 51902ff4cb854258b3ae70dc2d33fd9e)
    # solely for this change. The literal `rowfrac > 0.35` band walk is
    # REPLACED by the ruled walk S1 to S6 on the bridged-run substrate:
    # membership is C2(b) alone at T_REL = 0.793270, structure-relative,
    # referenced to the claimed staff's own extent. Concentration is no
    # longer a membership condition -- C2's clause (a) was struck because
    # bridged concentration's keep and discard extremes coincide at 1.0000 --
    # and survives only as the sentinel, which halts rather than classifies.
    # PROVEN, NOT ASSERTED, and this is the figure that matters: across the
    # 46 pages that return, the new walk produces a BYTE-IDENTICAL allowed
    # mask (row differences {0: 46}) and an IDENTICAL line_t on every page
    # ({(1.0,1.0): 3, (1.5,1.5): 7, (2.0,2.0): 36}). The replacement is
    # derived rather than literal and changes no pixel on this corpus.
    'reader/hollow.py':            ('0b9cfe27167d2db39b5fbfb87c220380', True),
    'reader/rest_templates.py':    ('24a53dee8ab43ee5050977297d7aafe5', True),
    # DECLARED DRIFT 2026-07-29, A7 Phase 6 COMPLETION (Fable's ruling,
    # 2026-07-29, striking a′'s own restatement: "the sentence said glyphs
    # and the mechanism delivered digits"). The plus glyph (SMuFL
    # timeSigPlus, U+E08D) is now rendered through the EXACT SAME
    # font/calibration pipeline as every digit -- one added MEI measure
    # (meter.count="2+3") so the glyph appears in Verovio's rendered SVG
    # defs, one added DIGIT_CODEPOINTS entry, one thin render_plus_glyph
    # wrapper -- and identified by the SAME matchTemplate+NMS matcher, same
    # threshold (0.38), same NMS radius, in the SAME candidate pool as the
    # digits (new: _match_glyphs_in_band, extracted from the digit-only
    # loop; new: _digits_and_plus_in_band). `_digits_in_band` itself is
    # UNCHANGED in every observable way (same ten templates, same output
    # shape, verified against its own existing callers read_time_signature
    # / read_time_signature_v2, which this ruling does not touch). No new
    # numeric constant entered anywhere; the plus rides the digits'
    # existing raw_units_per_space calibration and thr=0.38 unchanged.
    # Font cache at ~/.cache/timesig_templates_leipzig.json invalidated and
    # rebuilt this session (it predated the plus and had no '+' key);
    # digit glyph outlines confirmed byte-identical (same render_digit
    # shapes for 0-9) before and after the rebuild.
    'reader/timesig.py':           ('6b774604b9445f91b8d1abcde7788a5c', True),
    'reader/run_page2.py':         ('f295508083d50fa4e12df6c840116cb6', True),
    # DECLARED DRIFT 2026-07-29, A7 implementation (Fable's ruling,
    # 2026-07-28: claude/fable-ruling-e16-a7-three-falsifications-and-the-
    # fixture-b-anomaly_2026-07-28.md). FOUR changes, all ruled: (1)
    # narrow_by_duration_division (step 3) is REIMPLEMENTED to Fable's
    # duration-completeness-then-onset-AND-length criterion, raising
    # IncompleteBarDurations first; (2) grouping_to_boundaries's domain
    # invariant is restated (unit-aware, not "sum equals the numerator")
    # and `beats` is now a REQUIRED parameter, STRUCK default removed; (3)
    # detect_irregular_grouping's step 2 (dotted barlines) now RAISES a
    # named DottedBarlineQuarantine on any nonempty hit instead of
    # returning pixel x positions under a false 'printed_dotted_barline'
    # provenance label; (4) detect_start_of_bar_numerals (step 1) is
    # REBUILT per Fable's restated three-part mechanism (extent walk,
    # existing matchTemplate+NMS digit/plus matcher, oversized-component
    # raise), losing `s_search_width` (measured unsatisfiable at every
    # page size) and gaining `next_bar_x`.
    # DECLARED DRIFT 2026-07-29 (second pass, same day), A7 Phase 6
    # COMPLETION (Fable's ruling, 2026-07-29). STRUCK entirely:
    # `_find_plus_sign`, the connected-component-then-classify plus
    # detector (0.4s-0.9s size gate) -- confirmed no other caller exists
    # (grepped the harness). `detect_start_of_bar_numerals`'s IDENTITY step
    # now calls timesig._digits_and_plus_in_band (one unified matcher call,
    # digits and plus in the same NMS pool) instead of separately calling
    # timesig._digits_in_band and the struck _find_plus_sign; no more
    # page-absolute-to-band-relative x conversion is needed, since both
    # glyph classes now arrive in the same band-relative frame. The extent
    # walk (part 1) and the oversized-component raise branch (part 3) are
    # UNCHANGED from the 2026-07-28 pin.
    'reader/metre.py':             ('0151be516cba82cbf8b3d3f70b20998f', True),
    # DECLARED DRIFT 2026-07-29, A7 implementation, Phase 2.3 (Fable's
    # ruling, confirmed a repair not design). Line 201's
    # grouping_to_boundaries(grouping, beat_type) call now passes the
    # measure's own `beats` (required as of the metre.py change above).
    # The branch is dormant on every real page (zero irregular measures in
    # the corpus); no dedicated acceptance test was ordered, since none
    # could exercise a dormant branch. The protection that matters is the
    # domain assertion now running inside grouping_to_boundaries itself.
    'reader/envelope.py':          ('9cbd7cc373e44190a7ffd8c11003d33a', True),
    # DECLARED DRIFT 2026-07-29, A7 implementation, Phase 3 (Fable's
    # ruling). Four ordered edits: (a) section D's four grouping_to_
    # boundaries assertions supplied `beats` (5,5,7,7), required as of the
    # metre.py change; (b) the struck default-beats assertion (former line
    # 138) replaced with a RAISE assertion; (c) the former line 140's
    # fixture-(b)-correspondence claim struck (Fable: cannot be true in the
    # plain sense alongside "the fixture unread and unspent"), fixture NOT
    # read to check; (d) three of Fable's four ordered new domain-invariant
    # assertions added (the fourth, "(3,2) at beats 15 yields [9/8]",
    # already existed verbatim in section F -- DEDUPE APPLIED, not added
    # twice). Count: 59 - 1 + 1 + 3 = 62 passed, 0 failed, dedupe recorded
    # in the file itself (see the F2 section note). A FIFTH, NECESSARY
    # repair beyond the four ordered edits, flagged for review: sections G
    # and H exercised narrow_by_duration_division's PRE-ruling behaviour
    # (one input, 15/8's (3,2) case, no longer sums to the bar's notated
    # length under the new completeness guard and would abort the suite;
    # two H-section assertions documented the exact onset-coincidence
    # defect Phase 1 fixed and would otherwise now read FAIL). Corrected
    # mechanically (G7's duration list fixed to mirror its own G8 pair; H's
    # two defect-illustration assertions updated to the corrected, now-
    # non-defective result) and documented in place; this correction is not
    # a threshold tuned to force a pass.
    # DECLARED DRIFT 2026-07-29 (second pass, same day), A7 Phase 6
    # COMPLETION, section 3 of Fable's ruling: the two 15/8 assertions in
    # section G are AMENDED IN LABEL ONLY, not in assertion or expected
    # value (the count stays 62; Fable ruled the arithmetic stands). Each
    # label now states, in its own words: the input is unnotatable (a 9/8
    # single-event duration is one whole note plus an eighth of it, not
    # expressible as any single notated value, dotted or double-dotted);
    # the assertion pins the compound-unit arithmetic path only; reachable
    # 15/8 behaviour is governed by the step 3 inertness ruling of
    # 2026-07-27 (claude/fable-ruling-e16-step3-duration-division_2026-07-
    # 27.md), cited by name in the label. 62 passed, 0 failed, unchanged.
    'reader/test_metre.py':        ('e10a79b4bca2c82fa59bb0a72d439619', True),
    # THE GAP THIS MODULE CLOSES. These two produce every score figure in the
    # project and were pinned in no prior document.
    '_rhythm_spike/score_rng.ts':   ('0350ea7185549febf54f5cc55bf9064d', True),
    '_rhythm_spike/scorer_local.ts': ('02d8be3a20734f01de7da40d20cb3e71', True),
    # Documentation, pinned for completeness; does not feed a gate.
    'reader/README.md':            ('56c781ba7eeed6d3e67007700448de3e', False),
    # DECLARED DRIFT 2026-07-28: known-limitations list corrected. Struck the
    # span_bound midpoint derivation (correction eight); answered the
    # sunless-05 p5 open question (ledger 5.2 closed); recorded that step 3
    # is ruled and the shipped code fails 3 of 10; recorded the A7 wiring and
    # its three falsifications. Documentation only; feeds no gate.
    # DECLARED DRIFT 2026-07-28 (evening): the legacy sunless-05 p5 bullet is
    # rewritten to say the page is UNREACHABLE by this derivation with no fix
    # pending, rather than implying one is blocked and coming; two bullets
    # added, on longest_run not denoting extent and on bridged concentration
    # not being a separator. Documentation only; feeds no gate.
}


class ToolchainDrift(RuntimeError):
    """Raised when a pinned file has moved and the move was not declared."""


def _md5(path):
    with open(path, 'rb') as fh:
        blob = fh.read()
    # PART D, denotation: prove we hashed file bytes, not a path string.
    assert isinstance(blob, bytes), 'read %r, not bytes, from %s' % (type(blob), path)
    assert len(blob) > 0, 'refusing to hash an empty file: %s' % path
    digest = hashlib.md5(blob).hexdigest()
    assert isinstance(digest, str) and len(digest) == 32, 'bad digest %r' % digest
    return digest


def verify(root, declared=None, quiet=False):
    """Verify the toolchain under `root` (a tools/e16-harness directory).

    `declared` maps a pinned relative path to a one-line reason it is expected
    to have changed. Undeclared drift raises ToolchainDrift.

    Returns a dict of relpath -> ('clean' | 'declared' | 'missing' | 'DRIFT').
    """
    declared = declared or {}
    for key in declared:
        if key not in PINS:
            raise ToolchainDrift('declared path is not pinned: %r' % key)

    verdicts = {}
    hashed = 0
    for rel, (want, _gates) in sorted(PINS.items()):
        path = os.path.join(root, rel)
        # PART B, provenance: the file we name is the file we opened.
        if not os.path.exists(path):
            verdicts[rel] = 'missing'
            continue
        got = _md5(path)
        hashed += 1
        if got == want:
            verdicts[rel] = 'clean'
        elif rel in declared:
            verdicts[rel] = 'declared'
            if not quiet:
                print('  DECLARED  %s\n            %s -> %s  (%s)' % (rel, want, got, declared[rel]))
        else:
            verdicts[rel] = 'DRIFT'
            if not quiet:
                print('  DRIFT     %s\n            pinned %s, found %s' % (rel, want, got))

    # PART B, provenance: prove the comparison set is the full pinned set.
    assert len(verdicts) == len(PINS), \
        'verified %d files, pinned %d' % (len(verdicts), len(PINS))
    assert hashed + sum(1 for v in verdicts.values() if v == 'missing') == len(PINS)

    # PART D clause 3: report the distribution, not only the aggregate.
    dist = {}
    for v in verdicts.values():
        dist[v] = dist.get(v, 0) + 1
    if not quiet:
        print('  toolchain verdicts: %s (%d pinned)' % (dist, len(PINS)))

    bad = [r for r, v in verdicts.items() if v in ('DRIFT', 'missing')]
    if bad:
        raise ToolchainDrift(
            'toolchain is not at its pinned revision, and the move was not '
            'declared: %r. Either declare it with a reason, or restore from '
            'the repository.' % bad)
    return verdicts


def _negative_control(root):
    """PART A. Copy the tree, flip one byte, require the verifier to raise."""
    import shutil, tempfile
    tmp = tempfile.mkdtemp(prefix='toolchain-negctrl-')
    dst = os.path.join(tmp, 'e16-harness')
    shutil.copytree(root, dst, symlinks=True,
                    ignore=shutil.ignore_patterns('node_modules', 'output', '.git'))
    victim = os.path.join(dst, '_rhythm_spike', 'scorer_local.ts')
    with open(victim, 'rb') as fh:
        blob = fh.read()
    # flip one byte in the middle, so the file stays syntactically plausible
    i = len(blob) // 2
    tampered = blob[:i] + bytes([blob[i] ^ 0x01]) + blob[i + 1:]
    assert tampered != blob, 'negative control failed to alter the file'
    with open(victim, 'wb') as fh:
        fh.write(tampered)
    try:
        verify(dst, quiet=True)
    except ToolchainDrift as e:
        print('NEGATIVE CONTROL OK: one flipped byte in scorer_local.ts raises.')
        print('  ->', str(e)[:140])
        shutil.rmtree(tmp, ignore_errors=True)
        return True
    shutil.rmtree(tmp, ignore_errors=True)
    raise AssertionError(
        'NEGATIVE CONTROL FAILED: the verifier passed a tampered scorer. '
        'It cannot fire, so its pass means nothing.')


if __name__ == '__main__':
    # DEFAULT ROOT, fixed 2026-07-28. This previously defaulted to the hardcoded
    # container path '/home/claude/e16/harness'. Run anywhere else, notably on
    # Dann's own machine against the real repository, every pinned file failed to
    # open and the verifier reported ALL FOURTEEN as drifted. That is a false
    # alarm indistinguishable from catastrophic drift, in the one tool whose
    # entire purpose is to be trusted about drift. The script lives in
    # tools/e16-harness and PINS are relative to that directory, so the
    # directory containing this file is the correct default everywhere.
    root = os.environ.get('E16_HARNESS', os.path.dirname(os.path.abspath(__file__)))
    if '--negative-control' in sys.argv:
        _negative_control(root)
    else:
        print('verifying toolchain under %s' % root)
        verify(root)
        print('TOOLCHAIN CLEAN: all %d pinned files at their pinned revision.' % len(PINS))
