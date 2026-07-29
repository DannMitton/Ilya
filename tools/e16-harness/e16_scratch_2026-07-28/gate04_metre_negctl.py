"""Phase 0 gate 0.4 negative control: corrupt one IRREGULAR_ALTERNATIVES entry
in a COPY of metre.py, inject it under the module name via importlib +
sys.modules['metre'], then runpy test_metre.py. test_metre.py stays
byte-identical on disk; only the module it imports is defective.
"""
STATUS = 'CURRENT'

import sys
import os
import re
import hashlib
import importlib.util
import runpy

SRC = '/home/claude/metre.py'
TEST = '/home/claude/test_metre.py'
COPY = '/home/claude/_negctl_metre_copy.py'

before = hashlib.md5(open(TEST, 'rb').read()).hexdigest()

src = open(SRC, encoding='utf-8').read()
m = re.search(r'IRREGULAR_ALTERNATIVES\s*=\s*\{(.*?)\n\}', src, re.S)
assert m, 'IRREGULAR_ALTERNATIVES not found in metre.py'
block = m.group(0)
# Corrupt exactly one entry: find the first tuple-of-ints value and reverse it.
tm = re.search(r'\[\s*\(([\d,\s]+)\)', block)
assert tm, 'no grouping tuple found inside IRREGULAR_ALTERNATIVES\n' + block[:400]
orig = tm.group(0)
nums = [n.strip() for n in tm.group(1).split(',') if n.strip()]
assert len(nums) >= 2, 'first grouping tuple is too short to corrupt: %r' % nums
corrupt = '[ (' + ', '.join(list(reversed(nums))) + ')'
print('CORRUPTION applied inside IRREGULAR_ALTERNATIVES: %r -> %r'
      % (orig, corrupt))
assert orig != corrupt, 'corruption is a no-op; pick a different entry'
new_block = block.replace(orig, corrupt, 1)
open(COPY, 'w', encoding='utf-8').write(src.replace(block, new_block, 1))

spec = importlib.util.spec_from_file_location('metre', COPY)
mod = importlib.util.module_from_spec(spec)
sys.modules['metre'] = mod
spec.loader.exec_module(mod)
print('PROVENANCE sys.modules["metre"] is now %s' % mod.__file__)

try:
    runpy.run_path(TEST, run_name='__main__')
except SystemExit:
    pass

after = hashlib.md5(open(TEST, 'rb').read()).hexdigest()
print('INSTRUMENT test_metre.py md5 before=%s after=%s same=%s'
      % (before, after, before == after))
