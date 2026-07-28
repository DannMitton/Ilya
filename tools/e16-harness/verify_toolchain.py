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
    'reader/reader.py':            ('e82093c1babdbef00bcf12b28e3e16f3', True),
    # DECLARED DRIFT 2026-07-28: AT-1 of the correction-eight ruling. The
    # _derive_rowfrac_gate docstring's span_bound MIDPOINT DERIVATION is struck
    # and the retracted phrase "GENUINE system of three staves" is corrected;
    # the identity/passage distinction and the zero-staff-line finding are
    # recorded, and "members" is defined in place as distinct coverage values.
    # DOCSTRING ONLY. No executable line changed; defaults remain
    # (floor=0.015, span_bound=0.0137, min_members=5). Proven, not asserted:
    # gates 0.2 to 0.5 re-run and note records byte-identical to baseline.
    'reader/oracle.py':            ('fb99088b1894d80c6cbba980ab5866eb', True),
    'reader/oracle-counts.json':   ('f74e6a4b234b20a8cfd2c98f2021c597', True),
    'reader/beams.py':             ('51902ff4cb854258b3ae70dc2d33fd9e', True),
    'reader/hollow.py':            ('0b9cfe27167d2db39b5fbfb87c220380', True),
    'reader/rest_templates.py':    ('24a53dee8ab43ee5050977297d7aafe5', True),
    'reader/timesig.py':           ('3b90b8635d1e038d61180ae3cd9f5cea', True),
    'reader/run_page2.py':         ('f295508083d50fa4e12df6c840116cb6', True),
    'reader/metre.py':             ('7ecc1fe418ef649db58d2f2a8ac93382', True),
    'reader/envelope.py':          ('25321bf0345f4eb4161647a7e0e0c713', True),
    'reader/test_metre.py':        ('7fb1ea802d11f2aa726d461a9254efe6', True),
    # THE GAP THIS MODULE CLOSES. These two produce every score figure in the
    # project and were pinned in no prior document.
    '_rhythm_spike/score_rng.ts':   ('0350ea7185549febf54f5cc55bf9064d', True),
    '_rhythm_spike/scorer_local.ts': ('02d8be3a20734f01de7da40d20cb3e71', True),
    # Documentation, pinned for completeness; does not feed a gate.
    'reader/README.md':            ('1e7b99c57f4575234441e22b6c2e5cc2', False),
    # DECLARED DRIFT 2026-07-28: known-limitations list corrected. Struck the
    # span_bound midpoint derivation (correction eight); answered the
    # sunless-05 p5 open question (ledger 5.2 closed); recorded that step 3
    # is ruled and the shipped code fails 3 of 10; recorded the A7 wiring and
    # its three falsifications. Documentation only; feeds no gate.
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
