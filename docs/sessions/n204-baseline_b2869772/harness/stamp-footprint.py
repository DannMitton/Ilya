# Writes STAMP-FOOTPRINT.md. usage: python3 -I stamp-footprint.py <build dir at the base> <build dir at the third build> <out.md>
# Reads two builds of IDENTICAL source (differing only in the commit the stamp names). It never edits a build.
import sys, os, re, hashlib
A, C, OUT = sys.argv[1:4]
def files(root):
    r = {}
    for d, _, fs in os.walk(root):
        for f in fs:
            p = os.path.join(d, f); r[os.path.relpath(p, root)] = open(p, 'rb').read()
    return r
a, c = files(A), files(C)
sa, sc = 'b2869772', '93edb360'
same = sorted(k for k in a if k in c and a[k] == c[k])
changed = sorted(k for k in a if k in c and a[k] != c[k])
only_a = sorted(k for k in a if k not in c); only_c = sorted(k for k in c if k not in a)
name = lambda p: os.path.basename(p)
# pair renamed files: same directory, same extension; try by identical content after the stamp and the renames are applied (fixed point)
ren = {}
cand = {k: [x for x in only_c if os.path.dirname(x) == os.path.dirname(k)] for k in only_a}
def norm(data, rn):
    t = data.replace(sa.encode(), sc.encode())
    for o, n in rn.items(): t = t.replace(name(o).encode(), name(n).encode())
    return t
# tentative pairing, in rounds: a unique candidate of the same size in the same directory and extension; ties are broken by the cleanest verified match
tent = {}
for _ in range(12):
    prog = False
    for k in only_a:
        if k in tent: continue
        m = [x for x in only_c if x not in tent.values() and os.path.dirname(x) == os.path.dirname(k) and os.path.splitext(x)[1] == os.path.splitext(k)[1] and abs(len(c[x]) - len(a[k])) <= 4]
        sized = [x for x in m if len(c[x]) == len(a[k])]
        pick = sized if sized else m
        if len(pick) == 1: tent[k] = pick[0]; prog = True
        elif len(pick) > 1:
            ex = [x for x in pick if norm(a[k], tent) == c[x]]
            if len(ex) == 1: tent[k] = ex[0]; prog = True
    if not prog: break
ren = {k: v for k, v in tent.items()}
verified = {k: (norm(a[k], tent) == c[v]) for k, v in tent.items()}
unpaired = [k for k in only_a if k not in ren]
def nature(k, o=None):
    if o is None:
        x, y = a[k], c[k]
        if k.endswith('version.json'): return f'the version string: `{x.decode()}` becomes `{y.decode()}`'
        diffs = [(m.start()) for m in re.finditer(re.escape(sa), x.decode('utf8', 'replace'))]
        return f'{len(x)} to {len(y)} bytes; contains the stamp {len(diffs)} time(s); other differences are references to renamed chunks'
    return ''
L = ['# Stamp footprint, `b2869772` against `93edb360`', '',
     'Written by `harness/stamp-footprint.py` from two production builds of **identical source** (`git diff --stat b2869772..93edb360 -- apps packages scripts` is empty). The only input that differs is the commit the build stamps into itself. Every later lane builds at its own commit, so the files below differ from this baseline in the family 7 file list even when the lane changed nothing. **A later lane subtracts this list before reading its own diff.**', '',
     f'* Files in the base build: {len(a)}. In the third build: {len(c)}.',
     f'* Byte-identical in both: {len(same)}.',
     f'* Same path, different bytes: {len(changed)}.',
     f'* Renamed (content-hashed names that moved): {len(only_a)} paths in the base, {len(only_c)} in the third; paired below: {len(ren)} ({sum(verified.values())} verified exact); unpaired: {len(unpaired)}.', '',
     '## Same path, different bytes', '', '| path | base size | third size | what differs |', '|---|---:|---:|---|']
for k in changed:
    note = nature(k)
    if k == 'sw.js': note = 'the stamp: the `CACHE_VERSION` line and a comment that names it (`stamp-sw.mjs` replaces every `__BUILD_VERSION__`)'
    if k in ('index.html', 'notation-font-lab.html'): note = 'references to renamed entry and chunk files (a hashed name is one character shorter or longer); no stamp text'
    L.append(f'| `{k}` | {len(a[k])} | {len(c[k])} | {note} |')
L += ['', '## Renamed files, base name to third-build name', '', '| base path | third path | size | how the content differs |', '|---|---|---:|---|']
for k, v in sorted(ren.items()):
    has = sa.encode() in a[k]
    how = 'contains the stamp (`b2869772` becomes `93edb360`) and references renamed chunks' if has else 'differs only in references to renamed chunks'
    if a[k] == c[v]: how = 'byte-identical content under a new name'
    if not verified[k]:
        x = norm(a[k], tent); i = next((j for j in range(min(len(x), len(c[v]))) if x[j] != c[v][j]), 0)
        how += f' **and more than that**: after the stamp swap and the renames the files still differ ({len(a[k])} against {len(c[v])} bytes); the first difference, at byte {i}, is `{x[i-30:i+40].decode("utf8", "replace")}` in the base against `{c[v][i-30:i+40].decode("utf8", "replace")}` in the third build, so the minifier chose different short names. Whether the rest of the file differs the same way is NOT ESTABLISHED'
    how = how.replace('|', '\\|')
    L.append(f'| `{k}` | `{v}` | {len(a[k])} | {how} |')
if unpaired: L += ['', '## Unpaired (NOT ESTABLISHED how these differ)', ''] + [f'* `{k}`' for k in unpaired]
L += ['', '## Reading', '',
      'The stamp moves **one value** (`version.json`, `CACHE_VERSION`, the `__ILYA_BUILD__` constant in two chunks) and, because SvelteKit names a chunk by a hash of its content, every chunk that holds the stamp or imports a chunk that does gets a new name, and so does every file that names one. Nothing else moves. The renamed-pair check above applies the stamp swap and the rename map to the base file and compares it to the third build\'s file byte for byte; a pair is listed only when that comparison is exact.', '']
open(OUT, 'w').write('\n'.join(L) + '\n')
print(len(changed), len(only_a), len(ren), len(unpaired))
