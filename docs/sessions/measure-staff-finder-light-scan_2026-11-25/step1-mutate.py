# Step 1's mutation check: swap each reader's level in turn, run the reader tests that draw pages, restore the exact
# bytes. Run from apps/web: python3 -I ../../docs/sessions/measure-staff-finder-light-scan_2026-11-25/step1-mutate.py
import subprocess, sys, hashlib
P = 'src/lib/omr/metre-windows.ts'
orig = open(P, 'rb').read()
s = orig.decode()
def m(a, b, n=1):
    assert s.count(a) == n, (a, s.count(a))
    return s.replace(a, b)
mutants = {
  'lineRows reads glyph': m('inkAt(g, x, y0 + y, ink.rule)', 'inkAt(g, x, y0 + y, ink.glyph)'),
  'extent reads glyph': m('inkAt(g, x, yy, ink.rule)', 'inkAt(g, x, yy, ink.glyph)'),
  'strokes reads rule': m('inkAt(g, xx + d, y, ink.glyph)', 'inkAt(g, xx + d, y, ink.rule)'),
  'meanInk reads rule': m('inkAt(g, x, y, ink.glyph)', 'inkAt(g, x, y, ink.rule)'),
  'levels swapped': m('return { rule: Math.round(anchor + RULE_SHARE * (paperTone(g.data) - anchor)), glyph: GLYPH_INK };', 'return { glyph: Math.round(anchor + RULE_SHARE * (paperTone(g.data) - anchor)), rule: GLYPH_INK };'),
}
try:
    for name, text in mutants.items():
        open(P, 'w').write(text)
        r = subprocess.run(['npx', 'vitest', 'run', 'src/lib/omr/metre-windows.test.ts', 'src/lib/omr/underlay-below.test.ts', 'src/lib/omr/underlay-prepare.test.ts'], capture_output=True, text=True)
        out = r.stdout + r.stderr
        fails = sorted({l.strip() for l in out.splitlines() if l.strip().startswith('FAIL')})
        print(f'== {name}: exit {r.returncode}')
        for l in fails: print('   ', l)
finally:
    open(P, 'wb').write(orig)
    print('restored', hashlib.md5(open(P,'rb').read()).hexdigest() == hashlib.md5(orig).hexdigest())
