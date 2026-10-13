"""Row 88: `taiga75/ru-trocr-1700s` reads row 81's 55 Russian underlay rows, on this Mac, offline.

Forms (brief r2, section 3 step 4):
  t-row  each row whole (the processor squashes it to 384 x 384; a control), max_new_tokens 256;
  t      each row cut into chunks by ink gaps: ink projected onto x; a cut at every gap wider than 0.3 of the row's
         height (its core, from row 81's rows.jsonl); pieces grouped left to right until a chunk's width would pass
         8 times the crop's height; each chunk padded by 0.3 of the row's height (DESK DEFAULTS);
  t3     each of row 81's (c) word boxes (`ocr/<L>-c.json`), padded by 0.3 of the row's height (inherits (c)'s misses).
Every output is written in row 81's step 2 shape, `ocr/<L>-<form>.json`: one entry per row, its words split on
whitespace, a token holding a hyphen split into the part before, the hyphen, and the part after; each word's box is its
chunk's (or the row's, or the (c) box's); confidence null. Ink is darker than the crop's median tone less 60, as
`systems.py:11` takes it on the page. Device: two rows read on CPU and on MPS first; MPS is used only if they match.
Usage: HF_HOME=... HF_HUB_OFFLINE=1 venv/bin/python read.py <crops dir> <rasters dir> -> prints the checks and timings."""
import json, os, re, sys, time, statistics
import torch
from PIL import Image
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

HERE = os.path.dirname(os.path.abspath(__file__))
R81 = f'{HERE}/../measure-underlay-baseline_2026-10-12'
CROPS, RASTERS = sys.argv[1], sys.argv[2]
OFF = dict(S=0, T=0, K=1, M=2)
NAME = 'taiga75/ru-trocr-1700s'
REV = 'd5563063e42e4f10104e967eca6644ae17714878'

proc = TrOCRProcessor.from_pretrained(NAME, revision=REV)
model = VisionEncoderDecoderModel.from_pretrained(NAME, revision=REV, torch_dtype=torch.float32).eval()
EOS = model.generation_config.eos_token_id

def poem_rows():
    out = {}
    for l in open(f'{R81}/poem.txt', encoding='utf8'):
        if l.startswith('#') or not l.strip(): continue
        k = l.split(':', 1)[0].split(); out.setdefault(k[0], []).append(k[1])
    return out

def read(img, device, max_new=None):
    pv = proc(images=img.convert('RGB'), return_tensors='pt').pixel_values.to(device)
    kw = {'max_new_tokens': max_new} if max_new else {}
    with torch.no_grad():
        ids = model.generate(pv, **kw)
    seq = ids[0].tolist()
    text = proc.batch_decode(ids, skip_special_tokens=True)[0]
    return text, len(seq), EOS in seq[1:]

def tokens(text):
    out = []
    for w in text.split():
        m = re.match(r'^(.*?)([-–—])(.*)$', w)
        if m:
            for part in (m.group(1), m.group(2), m.group(3)):
                if part: out.append(part)
        else: out.append(w)
    return out

def chunks(img, core_h):
    g = img.convert('L'); W, H = g.size; px = g.load()
    paper = statistics.median(px[x, y] for x in range(0, W, 3) for y in range(0, H, 3)); ink = paper - 60
    cols = [any(px[x, y] < ink for y in range(H)) for x in range(W)]
    pieces = []; x = 0
    while x < W:
        if not cols[x]: x += 1; continue
        a = x
        while x < W and cols[x]: x += 1
        if pieces and a - pieces[-1][1] <= 0.3 * core_h: pieces[-1][1] = x
        else: pieces.append([a, x])
    groups = []
    for a, b in pieces:
        if groups and b - groups[-1][0] <= 8 * H: groups[-1][1] = b
        else: groups.append([a, b])
    pad = int(round(0.3 * core_h))
    return [(max(0, a - pad), min(W, b + pad)) for a, b in groups]

rows81 = {L: {f"p{r['page']}s{r['system']}r{r['row']}": r for r in map(json.loads, open(f'{R81}/{L}.rows.jsonl'))} for L in 'STKM'}
P = poem_rows()
crop = lambda L, r: Image.open(f"{CROPS}/{L}-{r['page']}-s{r['system']}-r{r['row']}.png")

# ── The device check: two rows, whole, on CPU and on MPS ──
device = 'cpu'
if torch.backends.mps.is_available():
    two = [('S', rows81['S'][P['S'][0]]), ('T', rows81['T'][P['T'][0]])]
    cpu = [read(crop(L, r), 'cpu', 256)[0] for L, r in two]
    model.to('mps')
    mps = [read(crop(L, r), 'mps', 256)[0] for L, r in two]
    same = cpu == mps
    print('device check, two rows whole:', 'CPU and MPS match' if same else 'CPU and MPS DIFFER', flush=True)
    for c, m in zip(cpu, mps): print('   cpu:', c, '| mps:', m, flush=True)
    device = 'mps' if same else 'cpu'
    model.to(device)
print('device used:', device, flush=True)

os.makedirs(f'{HERE}/ocr', exist_ok=True)
times = {'row': [], 'chunk': [], 'box': []}
longest = 0; unended = []
chunk_counts = {}
first = True
for L in 'STKM':
    pages = {}
    c81 = {f"p{r['page']}s{r['system']}r{r['row']}": r for r in json.load(open(f'{R81}/ocr/{L}-c.json'))}
    out = {'t-row': [], 't': [], 't3': []}
    for k in P[L]:
        r = rows81[L][k]; img = crop(L, r); core = r['core'][1] - r['core'][0] + 1
        box = lambda x0, x1: [r['x0'] + x0, r['y0'], r['x0'] + x1, r['y1']]
        # whole row
        t0 = time.time(); text, n, ended = read(img, device, 256); dt = time.time() - t0
        if not first: times['row'].append(dt)
        first = False
        longest = max(longest, n)
        if not ended: unended.append(f'{L} {k}')
        out['t-row'].append({'page': r['page'], 'system': r['system'], 'row': r['row'], 'text': text, 'words': [{'text': w, 'conf': None, 'bbox': box(0, img.width)} for w in tokens(text)]})
        # chunks
        cs = chunks(img, core); chunk_counts[f'{L} {k}'] = len(cs); words = []; texts = []
        for a, b in cs:
            t0 = time.time(); ct, _, _ = read(img.crop((a, 0, b, img.height)), device); times['chunk'].append(time.time() - t0)
            texts.append(ct); words += [{'text': w, 'conf': None, 'bbox': box(a, b)} for w in tokens(ct)]
        out['t'].append({'page': r['page'], 'system': r['system'], 'row': r['row'], 'text': ' '.join(texts), 'words': words, 'chunks': [[a, b] for a, b in cs], 'chunkTexts': texts})
        # (c)'s word boxes
        p = r['page']
        if p not in pages: pages[p] = Image.open(f"{RASTERS}/{L}-{p + OFF[L]}.png")
        pad = int(round(0.3 * core)); words = []; texts = []
        for w in sorted(c81[k]['words'], key=lambda w: w['bbox'][0]):
            x0, y0, x1, y1 = w['bbox']
            t0 = time.time(); bt, _, _ = read(pages[p].crop((max(0, x0 - pad), max(0, y0 - pad), x1 + pad, y1 + pad)), device); times['box'].append(time.time() - t0)
            texts.append(bt); words += [{'text': t, 'conf': None, 'bbox': [x0, y0, x1, y1]} for t in tokens(bt)]
        out['t3'].append({'page': r['page'], 'system': r['system'], 'row': r['row'], 'text': ' '.join(texts), 'words': words})
        print(f'{L} {k}: {len(cs)} chunks', flush=True)
    for form, rows in out.items():
        json.dump(rows, open(f'{HERE}/ocr/{L}-{form}.json', 'w', encoding='utf8'), ensure_ascii=False)
print('longest whole-row output, tokens:', longest)
print('whole rows that ended without the end token:', len(unended), unended)
print('chunks per row:', json.dumps(chunk_counts))
for k, v in times.items():
    if v: print(f'seconds per {k} on {device}: mean {statistics.mean(v):.2f}, median {statistics.median(v):.2f}, n {len(v)}')
