"""N.135 stage 1, reader (t-imap): `taiga75/ru-trocr-1700s` (revision d5563063e42e4f10104e967eca6644ae17714878), row 88's ink-gap chunks
(row 88's `chunks()` and `tokens()`, logic unchanged), on CPU (torch.set_num_threads(4)); row 82's training holds MPS. Row 88's Latin-i map (imap.py) is applied.
Every row of every song is read (language decisions need the non-Russian rows), a row of more than 12 chunks is read on its first 12 (stated in the output).
Each token's box: its chunk's box shared among the chunk's tokens in proportion to their letters (a hyphen counts half a letter): MY ADDITION for seating, not the model's output.
RULE=R2 reads rows2/ (and crops2) and writes ocr2/, copying the reading of any row whose crop is the same as an R1 row's (same page, system, y0, y1, x0, x1).
Usage: HF_HOME=... HF_HUB_OFFLINE=1 python read_t.py <crops dir> <labels...>  -> ocr/<L>-t-imap.json, ocr/<L>-t-imap.time.json"""
import json, os, re, sys, time, statistics
import torch
from PIL import Image
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
torch.set_num_threads(4)
HERE = os.path.dirname(os.path.abspath(__file__)); D = '' if os.environ.get('RULE', 'R1') == 'R1' else '2'; os.makedirs(f'{HERE}/ocr{D}', exist_ok=True)
CROPS = sys.argv[1]; LABELS = sys.argv[2:]
NAME = 'taiga75/ru-trocr-1700s'; REV = 'd5563063e42e4f10104e967eca6644ae17714878'; MAXCH = 12
proc = TrOCRProcessor.from_pretrained(NAME, revision=REV)
model = VisionEncoderDecoderModel.from_pretrained(NAME, revision=REV, torch_dtype=torch.float32).eval()
CYR = re.compile('[Ѐ-ӿ]')
def read(img):
    pv = proc(images=img.convert('RGB'), return_tensors='pt').pixel_values
    with torch.no_grad(): ids = model.generate(pv)
    return proc.batch_decode(ids, skip_special_tokens=True)[0]
def tokens(text):
    out = []
    for w in text.split():
        m = re.match(r'^(.*?)([-–—])(.*)$', w)
        if m:
            for part in (m.group(1), m.group(2), m.group(3)):
                if part: out.append(part)
        else: out.append(w)
    return out
def chunks(img, core_h):  # row 88's, unchanged
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
def wt(t): return 0.5 if t in '-–—' else max(1, len(t))
for L in LABELS:
    rows = [json.loads(l) for l in open(f'{HERE}/rows{D}/{L}.jsonl')]; out = []; times = []; capped = 0; same = {}
    if D:
        r1 = [json.loads(l) for l in open(f'{HERE}/rows/{L}.jsonl')]; o1 = json.load(open(f'{HERE}/ocr/{L}-t-imap.json'))
        same = {(a['page'], a['system'], a['y0'], a['y1'], a['x0'], a['x1']): b for a, b in zip(r1, o1)}
    for r in rows:
        hit = same.get((r['page'], r['system'], r['y0'], r['y1'], r['x0'], r['x1']))
        if hit:
            out.append(dict(hit, row=r['row'])); times.append((0, 0)); continue
        img = Image.open(f"{CROPS}/{L}-{r['page']}-s{r['system']}-r{r['row']}.png"); core = r['core'][1] - r['core'][0] + 1
        cs = chunks(img, core); n_all = len(cs)
        if n_all > MAXCH: cs = cs[:MAXCH]; capped += 1
        words = []; texts = []; t0 = time.time()
        for a, b in cs:
            ct = read(img.crop((a, 0, b, img.height))); texts.append(ct)
            toks = [CYR.search(t) and t.replace('i', 'і').replace('I', 'І') or t for t in tokens(ct)]
            x = r['x0'] + a; tot = sum(wt(t) for t in toks) or 1
            for t in toks:
                w = (b - a) * wt(t) / tot; words.append({'text': t, 'conf': None, 'bbox': [round(x), r['y0'], round(x + w), r['y1']]}); x += w
        times.append((time.time() - t0, len(cs)))
        out.append({'page': r['page'], 'system': r['system'], 'row': r['row'], 'text': ' '.join(texts), 'words': words, 'chunks': len(cs), 'chunksAll': n_all})
    json.dump(out, open(f'{HERE}/ocr{D}/{L}-t-imap.json', 'w'), ensure_ascii=False)
    json.dump({'seconds': sum(t for t, _ in times), 'chunks': sum(c for _, c in times), 'rows': len(rows), 'rowsCapped': capped, 'device': 'cpu', 'threads': 4}, open(f'{HERE}/ocr{D}/{L}-t-imap.time.json', 'w'))
    print(L, len(rows), 'rows', sum(c for _, c in times), 'chunks', round(sum(t for t, _ in times)), 's', 'capped', capped, flush=True)
