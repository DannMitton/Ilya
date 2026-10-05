"""Stage 1b. Count words in (a) the Wikisource poems extracted by wikisource_extract.py and (b) the 19th-century part of UD_Russian-Poetry.
Writes work/poetry_ws.json and work/ud_xix.json."""
import sys, json, re, collections, glob
sys.path.insert(0, '/tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/freq/scripts')
from common import *

FOREIGN = ('Гейне', 'Эдгар Аллан По', 'Готье', 'Беранже', 'Байрон', 'Мицкевич', 'Шиллер', 'Гёте', 'Гете', 'Гюго', 'Мюссе',
           'Шенье', 'Данте', 'Мур', 'Бёрнс', 'Бернс', 'Лонгфелло', 'Теннисон', 'Шамиссо', 'Уланд', 'Ламартин', 'Барбье',
           'Шекспир', 'Петрарка', 'Овидий', 'Гораций', 'Вергилий', 'Анакреон', 'Сафо', 'Шевченко', 'Леопарди', 'Тассо',
           'Мильтон', 'Лафонтен', 'Лермонтов, Ю', 'Фирдоуси', 'Саади', 'Гафиз', 'Хафиз', 'Омар', 'Леконт', 'Бодлер', 'Верлен',
           'Рембо', 'Эредиа', 'Сюлли', 'Гейбель', 'Фрейлиграт', 'Ленау', 'Платен', 'Рюккерт', 'Гёльти', 'Бюргер', 'Клопшток', 'Эйхендорф',
           'Гофман', 'Гауф', 'Мерике', 'Новалис', 'Шамфор', 'Вордсворт', 'Кольридж', 'Шелли', 'Китс', 'Скотт', 'Томас Мур', 'Эмерсон', 'Уитмен', 'Джами', 'Руставели', 'Андерсен', 'Коппе', 'Даумер', 'Гамерлинг', 'Ришпен', 'Экар', 'Лилиенкрон', 'Мендес', 'Баумбах')
re_born = re.compile(r'\((?:[^()\d]*?)(\d{4})\s*[-–—]\s*(\d{4})?')

def clean(tx):
    for mk in ('== Примечания', '==Примечания', '== Комментарии', '== Сноски', '=== Примечания'):
        i = tx.find(mk)
        if i >= 0: tx = tx[:i]
    # drop the {{Отексте ...}} header by brace matching
    i = tx.find('{{Отексте')
    if i >= 0:
        depth = 0; j = i
        while j < len(tx):
            if tx.startswith('{{', j): depth += 1; j += 2
            elif tx.startswith('}}', j):
                depth -= 1; j += 2
                if depth == 0: break
            else: j += 1
        tx = tx[:i] + tx[j:]
    tx = re.sub(r'<ref[^>]*>.*?</ref>', ' ', tx, flags=re.S)
    tx = re.sub(r'<ref[^>]*/>', ' ', tx)
    tx = re.sub(r'<!--.*?-->', ' ', tx, flags=re.S)
    tx = re.sub(r'\[\[(?:Категория|Category|Файл|File|Изображение):[^\]]*\]\]', ' ', tx)
    tx = re.sub(r'\[\[(?:[^\]|]*\|)?([^\]]*)\]\]', r'\1', tx)
    tx = re.sub(r'\{\{[^{}\n]{0,200}\}\}', ' ', tx)       # short one-line templates
    tx = re.sub(r'<[^>]+>', ' ', tx)
    return tx

def words(tx):
    return [letter_map(w.lower()) for w in WORD_RE.findall(tx)]

C = collections.Counter(); by_author = collections.defaultdict(collections.Counter)
npoems = collections.Counter(); ntok = collections.Counter(); kept = []
authors_seen = collections.Counter()
for line in open(WORK + '/wikisource_poems.jsonl', encoding='utf-8'):
    d = json.loads(line)
    a = d['author']
    name = re.sub(r'\[\[|\]\]', '', a).split('(')[0].split('|')[0].replace('?', '').strip()
    m = re.search(r'\((?:[^()\d]*?)(\d{4})', a)
    born = int(m.group(1)) if m else 0
    authors_seen[(name, born)] += 1
    if born < 1780 or born > 1850: continue
    if any(f in name for f in FOREIGN): continue
    w = words(clean(d['text']))
    if len(w) < 8: continue
    C.update(w); by_author[name].update(w); npoems[name] += 1; ntok[name] += len(w)
tot = sum(C.values())
json.dump({'C': C, 'by_author': {k: v for k, v in by_author.items()}, 'npoems': npoems, 'ntok': ntok, 'tokens': tot},
          open(WORK + '/poetry_ws.json', 'w'), ensure_ascii=False)
print('poems', sum(npoems.values()), 'tokens', tot, 'types', len(C), 'authors', len(npoems))
print(sorted(npoems.items(), key=lambda x: -x[1])[:60])
print('excluded-by-year-or-foreign authors (top):', [(k, v) for k, v in authors_seen.most_common(80) if k[0] not in npoems][:40])

# UD_Russian-Poetry, 19th century documents only
toks = []; docs = collections.Counter()
for fn in sorted(glob.glob(RAW + '/udpoetry/*.conllu')):
    doc = None
    for line in open(fn, encoding='utf-8'):
        if line.startswith('# newdoc'):
            doc = line.split('=')[1].strip()
        elif line and line[0].isdigit():
            p = line.split('\t')
            if '-' in p[0] or '.' in p[0]: continue
            if p[3] == 'PUNCT' or doc is None or not doc.startswith('xix__') or any(x in doc for x in ('plesheev', 'golenis', 'kutuz')): continue  # Pleshcheyev and Golenishchev-Kutuzov are the desk's held-out poets
            toks.append((p[1].lower(), p[2].lower(), p[3])); docs[doc.split('__')[1]] += 1
json.dump({'tokens': toks, 'docs': docs}, open(WORK + '/ud_xix.json', 'w'), ensure_ascii=False)
print('UD xix tokens', len(toks), dict(docs))
