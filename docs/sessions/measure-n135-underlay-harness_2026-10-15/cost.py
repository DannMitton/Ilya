"""N.135 stage 1, 4.5: what a reading costs. Seconds per page on this Mac (from the .time.json each reader wrote while reading the rows of R1: recognition only, the model already loaded),
the bytes each would need in the browser, and whether it loads through the real createWorker in headless Chrome (chrome-load.json, chrome-load.mjs). (t-imap) is the teacher.
Usage: python3 cost.py -> cost.txt"""
import json, os, glob
from common2 import *
out = ['Seconds per page on this Mac (recognition on R1 rows, model loaded), by reader; pages are the songs\' raster pages that hold read notes (so pages of covers are not counted)']
pages = {L: max(e['page'] for e in events(L) if e['x'] is not None) for L in SONGS}; rows_n = {L: len(rows(L)) for L in SONGS}
for m, label in (('a', '(a) Tesseract rus best_int, Node default core, 1 thread'), ('c', '(c) Tesseract Cyrillic best, Node SIMD-LSTM core, 1 thread'), ('e', '(e) Tesseract eng, Node default core, 1 thread'), ('t-imap', '(t-imap) TrOCR ru-trocr-1700s on CPU, torch 4 threads')):
    secs = {}; ch = {}
    for L in SONGS:
        f = f'{HERE}/ocr/{L}-{m}.time.json'
        if os.path.exists(f): j = json.load(open(f)); secs[L] = j['seconds']; ch[L] = j.get('chunks')
    if not secs: out.append(f'{label}: no time recorded'); continue
    tp = sum(pages[L] for L in secs); ts = sum(secs.values())
    line = f'{label}: {ts:.0f} s over {tp} pages in {len(secs)} songs = {ts / tp:.1f} s a page; per song {min(secs[L] / pages[L] for L in secs):.1f} to {max(secs[L] / pages[L] for L in secs):.1f}'
    if m == 't-imap': line += f'; {sum(ch.values())} chunks, {ts / sum(ch.values()):.2f} s a chunk (row 88 on MPS: 0.40)'
    out.append(line)
f = f'{HERE}/ocr2/S-t-syl.time.json'
if os.path.exists(f):
    secs = {L: json.load(open(f'{HERE}/ocr2/{L}-t-syl.time.json')) for L in SONGS}; tp = sum(pages.values()); ts = sum(j['seconds'] for j in secs.values()); nc = sum(j['chunks'] for j in secs.values())
    out.append(f'(t-syl) TrOCR, one ink piece a chunk, Russian rows of R2 only, CPU 4 threads: {ts:.0f} s over {tp} pages = {ts / tp:.1f} s a page; {nc} chunks, {ts / nc:.2f} s a chunk')
out += ['', 'Bytes on disk, and in the browser (the files a worker would fetch: tesseract.min.js 62,961; worker.min.js 111,307; the core it picks 3,905,767)']
M = f'{WORK}/models'
for name, fs in (('(a) rus.traineddata.gz as the app fetches it / unzipped', [f'{M}/a/rus.traineddata.gz', f'{M}/a/rus.traineddata']), ('(c) Cyrillic.traineddata / gzipped by me', [f'{M}/c/Cyrillic.traineddata', f'{M}/c/Cyrillic.traineddata.gz']), ('(e) eng.traineddata (Homebrew 5.5.3)', [f'{M}/eng/eng.traineddata'])):
    out.append(f'{name}: ' + ' / '.join(f'{os.path.getsize(f):,}' for f in fs))
hf = glob.glob(os.path.expanduser('~/Downloads/_desk-trocr/hf/hub/models--taiga75--ru-trocr-1700s/snapshots/*/model.safetensors'))
out.append(f'(t-imap) model.safetensors, float32: {os.path.getsize(hf[0]):,} (row 88: 1,339,228,897 in 12 files); not a browser candidate.' if hf else '(t-imap): model file not found')
out += ['', 'Does it load through createWorker in headless Chrome (Chrome 155, tesseract.js 7.0.0 browser bundle)?']
for r in json.load(open(f'{HERE}/chrome-load.json')):
    core = [u for u in r['requested'] if 'core' in u]; out.append(f"{r['case']}: " + (f"FAILED: {r['error']}" if r['error'] else f"loaded (init {r['init']:.2f} s; rows read in {', '.join(f'{x['seconds']:.2f}' for x in r['rows'])} s)") + f"; core fetched: {core[0].split('/')[-1] if core else 'none'}; bytes served: {sum(v for k, v in r['bytes'].items() if 'traineddata' in k or 'core' in k):,} for the model and core")
open(f'{HERE}/cost.txt', 'w', encoding='utf8').write('\n'.join(out) + '\n'); print('\n'.join(out))
