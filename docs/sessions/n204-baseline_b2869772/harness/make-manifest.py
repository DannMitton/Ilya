#!/usr/bin/env python3
"""Write FAMILY-HASHES.md and MANIFEST.sha256 for the lane folder.
Usage: python3 harness/make-manifest.py   (run from the lane folder)
Family hash = sha256 of the text of sorted lines "<sha256>  <path relative to the lane folder>" for that family's files.
MANIFEST.sha256 = sha256sum format, every file in the lane folder except itself."""
import os, hashlib, sys
root = os.getcwd()
def sha(p):
    h = hashlib.sha256()
    with open(p, 'rb') as f:
        for c in iter(lambda: f.read(1 << 20), b''): h.update(c)
    return h.hexdigest()
def files(sub):
    out = []
    for r, _, fs in os.walk(os.path.join(root, sub)):
        for f in fs: out.append(os.path.relpath(os.path.join(r, f), root))
    return sorted(out)
fams = [('1 MELODY SVG', 'capture/family1-melody'), ('2 TEXT IPA', 'capture/family2-text'),
        ('3 INSIGHTS', 'capture/family3-insights'), ('4 printed pages', 'capture/family4-print'),
        ('5 binder and saved voice', 'capture/family5-binder-voice'), ('6 i18n table', 'capture/family6-i18n'),
        ('7, 8, 9 build lists', 'capture/family-build'), ('10 Playwright', 'capture/family10-playwright')]
rows = ['# Family hashes', '',
        'Family hash: sha256 of the sorted lines `<sha256>  <path>` of the family files (paths relative to the lane folder). Regenerate with `python3 harness/make-manifest.py`.', '',
        '| Family | Files | Bytes | Family hash |', '|---|---:|---:|---|']
tb = 0
for name, sub in fams:
    fl = files(sub)
    lines = sorted(f'{sha(f)}  {f}' for f in fl)
    b = sum(os.path.getsize(f) for f in fl); tb += b
    rows.append(f'| {name} | {len(fl)} | {b:,} | `{hashlib.sha256(("\n".join(lines)+"\n").encode()).hexdigest()}` |')
rows.append(f'| Total of the families | | {tb:,} | |')
open('FAMILY-HASHES.md', 'w').write('\n'.join(rows) + '\n')
allf = [f for f in files('.') if f != 'MANIFEST.sha256']
open('MANIFEST.sha256', 'w').write(''.join(f'{sha(f)}  {f}\n' for f in allf))
print(len(allf), 'files in MANIFEST.sha256;', sum(os.path.getsize(f) for f in allf), 'bytes')
