"""Scratch-artifact status register. Harness hygiene, not project code.

WHY THIS EXISTS
---------------
On 2026-07-27 a farmed Sonnet worker was pointed at /home/claude/ for the
reader modules. It found `ledger52_sunless05p5.py`, a measurement script whose
per-line coverage figures had been superseded hours earlier by
`ledger52_confirm.py`, and reasoned soundly from the superseded numbers. Its
conclusion's stated cause was wrong as a result.

Nothing was broken. The reader was at its pinned revision, the corpus was
correct, and the worker was careful. The failure was that a SUPERSEDED
MEASUREMENT ARTIFACT REMAINED LIVE AND DISCOVERABLE, sitting in the same
directory as live reader code and looking exactly like it.

`verify_toolchain.py` does not cover this and cannot. It pins the INSTRUMENT:
the twelve reader modules and the two scoring modules. This file covers the
SCRATCH: the measurement scripts a session writes, whose outputs become the
claims in memos and briefs. Those are where superseded numbers live, because
a measurement script is written once, corrected once, and then never deleted.

THE CONVENTION
--------------
Every scratch script in /home/claude declares, at module level:

    STATUS = 'CURRENT'
or
    STATUS = ('SUPERSEDED', '<successor filename>', '<one-line reason>')

A superseded script must ALSO carry a banner in its first ten lines and must
refuse to run. Both are required, because the two ways an artifact does
damage are different: a worker may RUN it, or a worker may merely READ it and
quote its numbers. A runtime guard stops the first. A banner stops the second.
The Sonnet incident was the second kind.

Reader modules are exempt: they are covered by verify_toolchain.py.
"""
import ast
import os
import re
import sys

SCRATCH_DIR = '/home/claude'

# Covered by verify_toolchain.py; not scratch.
PINNED = {
    'reader.py', 'oracle.py', 'beams.py', 'hollow.py', 'rest_templates.py',
    'timesig.py', 'run_page2.py', 'metre.py', 'envelope.py', 'test_metre.py',
    'verify_toolchain.py', 'scratch_status.py',
}

BANNER_RE = re.compile(r'SUPERSEDED', re.I)


def _declared_status(path):
    """Read STATUS without importing: importing a superseded script runs it."""
    try:
        tree = ast.parse(open(path, 'r', encoding='utf-8').read(), filename=path)
    except SyntaxError as e:
        return ('UNPARSEABLE', str(e))
    for node in tree.body:
        if isinstance(node, ast.Assign):
            for t in node.targets:
                if isinstance(t, ast.Name) and t.id == 'STATUS':
                    try:
                        return ast.literal_eval(node.value)
                    except ValueError:
                        return ('UNPARSEABLE', 'STATUS is not a literal')
    return None


def audit(scratch_dir=SCRATCH_DIR, quiet=False):
    """Return {filename: verdict}. Raises on any unsafe superseded artifact."""
    verdicts = {}
    files = sorted(f for f in os.listdir(scratch_dir)
                   if f.endswith('.py') and f not in PINNED)
    for fn in files:
        path = os.path.join(scratch_dir, fn)
        status = _declared_status(path)
        head = ''.join(open(path, encoding='utf-8').readlines()[:10])
        src = open(path, encoding='utf-8').read()

        if status is None:
            verdicts[fn] = 'UNDECLARED'
        elif status == 'CURRENT':
            verdicts[fn] = 'current'
        elif isinstance(status, (tuple, list)) and status and status[0] == 'SUPERSEDED':
            successor = status[1] if len(status) > 1 else None
            problems = []
            if not successor or not os.path.exists(os.path.join(scratch_dir, successor)):
                problems.append('successor %r does not exist' % successor)
            if not BANNER_RE.search(head):
                problems.append('no SUPERSEDED banner in the first 10 lines (a reader '
                                'quoting its numbers would never see the status)')
            if 'raise SystemExit' not in src and 'sys.exit' not in src:
                problems.append('does not refuse to run')
            verdicts[fn] = 'superseded' if not problems else 'UNSAFE: ' + '; '.join(problems)
        else:
            verdicts[fn] = 'UNDECLARED (STATUS=%r)' % (status,)

    if not quiet:
        for fn in files:
            v = verdicts[fn]
            mark = '  ' if v in ('current', 'superseded') else '!!'
            print('%s %-32s %s' % (mark, fn, v))
        dist = {}
        for v in verdicts.values():
            key = v.split(':')[0]
            dist[key] = dist.get(key, 0) + 1
        print('  scratch verdicts: %s (%d files)' % (dist, len(verdicts)))

    bad = {f: v for f, v in verdicts.items() if v not in ('current', 'superseded')}
    if bad:
        raise RuntimeError(
            'scratch artifacts are not safely declared: %r. An undeclared or '
            'unsafely-superseded measurement script is discoverable by a farmed '
            'worker and will be reasoned from.' % bad)
    return verdicts


def _negative_control(scratch_dir=SCRATCH_DIR):
    """Prove the audit can fail: plant an undeclared script, require a raise."""
    import tempfile, shutil
    tmp = tempfile.mkdtemp(prefix='scratch-negctrl-')
    shutil.copy(os.path.join(scratch_dir, 'scratch_status.py'), tmp)
    with open(os.path.join(tmp, 'planted_undeclared.py'), 'w') as fh:
        fh.write('# a measurement script with no STATUS\nx = 1\n')
    try:
        audit(tmp, quiet=True)
    except RuntimeError as e:
        print('NEGATIVE CONTROL OK: an undeclared scratch script raises.')
        print('  ->', str(e)[:150])
        shutil.rmtree(tmp, ignore_errors=True)
        return True
    shutil.rmtree(tmp, ignore_errors=True)
    raise AssertionError('NEGATIVE CONTROL FAILED: the audit passed an undeclared script.')


if __name__ == '__main__':
    if '--negative-control' in sys.argv:
        _negative_control()
    else:
        audit()
        print('SCRATCH CLEAN: every measurement script declares its status, and every '
              'superseded one is both banner-marked and inert.')
