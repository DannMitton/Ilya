"""N.135 stage 1, reader (t-syl), a variant of (t-imap) that is MINE, not row 88's: the same model, revision, CPU, Latin-i map; but each ink piece of a row (the pieces row 88's chunker joins until a chunk is 8 times the crop's height:
a run of columns with ink, pieces closer than 0.3 of the row's core height already merged) is read on its own, so a chunk holds one syllable and never two. A piece whose ink is lower than 0.35 of the core, or narrower than
0.25 of the core and lower than half of it, is a dash, a period or a comma and is not read. Each token's box is its piece's own box. Only the rows R2's labels call Russian are read (4.2 and 4.4 need no others).
Usage: RULE=R2 HF_HOME=... HF_HUB_OFFLINE=1 python read_tsyl.py <crops2 dir> <labels...>  -> ocr2/<L>-t-syl.json (rows not read are written with no words), ocr2/<L>-t-syl.time.json"""
import json, os, re, sys, time, statistics
import torch
from PIL import Image
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
torch.set_num_threads(4)
HERE = os.path.dirname(os.path.abspath(__file__)); CROPS = sys.argv[1]; LABELS = sys.argv[2:]
NAME = 'taiga75/ru-trocr-1700s'; REV = 'd5563063e42e4f10104e967eca6644ae17714878'
proc = TrOCRProcessor.from_pretrained(NAME, revision=REV); model = VisionEncoderDecoderModel.from_pretrained(NAME, revision=REV, torch_dtype=torch.float32).eval()
CYR = re.compile('[Ѐ-ӿ]')
def read(img):
    pv = proc(images=img.convert('RGB'), return_tensors='pt').pixel_values
    with torch.no_grad(): ids = model.generate(pv)
    return proc.batch_decode(ids, skip_special_tokens=True)[0]
def pieces(img, core_h):
    g = img.convert('L'); W, H = g.size; px = g.load(); paper = statistics.median(px[x, y] for x in range(0, W, 3) for y in range(0, H, 3)); ink = paper - 60
    cols = [any(px[x, y] < ink for y in range(H)) for x in range(W)]; ps = []; x = 0
    while x < W:
        if not cols[x]: x += 1; continue
        a = x
        while x < W and cols[x]: x += 1
        if ps and a - ps[-1][1] <= 0.3 * core_h: ps[-1][1] = x
        else: ps.append([a, x])
    out = []
    for a, b in ps:
        ys = [y for y in range(H) if any(px[xx, y] < ink for xx in range(a, b))]; h = ys[-1] - ys[0] + 1; w = b - a
        if h < 0.35 * core_h or (w < 0.25 * core_h and h < 0.5 * core_h): continue
        out.append((a, b))
    return out
lab_all = {}
for L in LABELS:
    lab = json.load(open(f'{HERE}/labels2/{L}.json'))['rows']; rows = [json.loads(l) for l in open(f'{HERE}/rows2/{L}.jsonl')]; out = []; t_all = 0; n_ch = 0
    for r in rows:
        k = f"p{r['page']}s{r['system']}r{r['row']}"; ent = {'page': r['page'], 'system': r['system'], 'row': r['row'], 'text': '', 'words': []}
        if lab[k] == 'russian':
            img = Image.open(f"{CROPS}/{L}-{r['page']}-s{r['system']}-r{r['row']}.png"); core = r['core'][1] - r['core'][0] + 1; pad = int(round(0.3 * core)); texts = []
            for a, b in pieces(img, core):
                t0 = time.time(); ct = read(img.crop((max(0, a - pad), 0, min(img.width, b + pad), img.height))); t_all += time.time() - t0; n_ch += 1; texts.append(ct)
                for t in ct.split():
                    if CYR.search(t): t = t.replace('i', 'і').replace('I', 'І')
                    ent['words'].append({'text': t, 'conf': None, 'bbox': [r['x0'] + a, r['y0'], r['x0'] + b, r['y1']]})
            ent['text'] = ' '.join(texts)
        out.append(ent)
    json.dump(out, open(f'{HERE}/ocr2/{L}-t-syl.json', 'w'), ensure_ascii=False); json.dump({'seconds': t_all, 'chunks': n_ch, 'rows': len(rows), 'device': 'cpu', 'threads': 4}, open(f'{HERE}/ocr2/{L}-t-syl.time.json', 'w'))
    print(L, 'chunks', n_ch, round(t_all), 's', flush=True)
