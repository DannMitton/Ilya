"""Row 88, Code's post-map (not the model's output): the model writes Latin i (U+0069) where the print has decimal i
(U+0456), and Latin I for І. Inside a token holding a Cyrillic letter, Latin i and I become і and І. Writes ocr/<L>-t-imap.json
from ocr/<L>-t.json. Usage: python3 imap.py"""
import json, re
CYR = re.compile('[Ѐ-ӿ]')
for L in 'STKM':
    rows = json.load(open(f'ocr/{L}-t.json', encoding='utf8'))
    for r in rows:
        for w in r['words']:
            if CYR.search(w['text']): w['text'] = w['text'].replace('i', 'і').replace('I', 'І')
    json.dump(rows, open(f'ocr/{L}-t-imap.json', 'w', encoding='utf8'), ensure_ascii=False)
