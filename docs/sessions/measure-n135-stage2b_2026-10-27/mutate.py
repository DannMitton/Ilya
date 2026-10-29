"""N.135 stage 2a: mutants. For each mutant of a source file: apply one textual change (asserted to match exactly once), run the file's vitest file, record which tests fail, restore the source, and `cmp` it against the backup.
Usage (stage 2b: paths are relative to apps/web/src/lib): python3 mutate.py <spec.json>   (run from anywhere; paths are relative to this file)"""
import subprocess, sys, shutil, json, os, tempfile
HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.abspath(f'{HERE}/../../..'); WEB = f'{REPO}/apps/web'; LIB = f'{WEB}/src/lib'
def run(testfile):
    r = subprocess.run(['npx', 'vitest', 'run', '--reporter=json', f'src/lib/{testfile}'], cwd=WEB, capture_output=True, text=True)
    out = r.stdout; i = out.find('{')
    try: j = json.loads(out[i:])
    except Exception: return None, ['<<unparsable>> ' + r.stderr[-300:] + out[-300:]]
    fails = []
    for f in j['testResults']:
        if f.get('status') == 'failed' and not f['assertionResults']: fails.append('FILE ERROR ' + f.get('message', '')[:150])
        for a in f['assertionResults']:
            if a['status'] == 'failed': fails.append(a['fullName'])
    return j['numTotalTests'], fails
def mutate(src, test, muts):
    path = f'{LIB}/{src}'; bak = os.path.join(tempfile.mkdtemp(), os.path.basename(src)); shutil.copy(path, bak); orig = open(path, encoding='utf8').read(); res = []
    for name, old, new in muts:
        assert orig.count(old) == 1, (name, orig.count(old))
        open(path, 'w', encoding='utf8').write(orig.replace(old, new))
        try: n, f = run(test)
        finally: shutil.copy(bak, path)
        assert subprocess.run(['cmp', path, bak]).returncode == 0
        res.append((name, n, f))
    return res
if __name__ == '__main__':
    for s in json.load(open(sys.argv[1])):
        for name, n, f in mutate(s['src'], s['test'], [tuple(m) for m in s['muts']]):
            print(f"{s['src']} | {name} | {'KILLED' if f else 'SURVIVED'} by {len(f)} of {n}")
            for x in f[:12]: print('      -', x)
