"""Stream a ruwikisource pages-articles dump (bz2, on stdin as decompressed XML) and write the poems of
19th-century authors to JSONL (one page per line). Selection rule, all of it read from the page itself:
  - namespace 0, no '/' in title, the page has a {{Отексте}} header and a category starting 'Поэзия' or 'Стихотворения';
  - the header's АВТОР line gives a birth year <= 1850 (so the poet is a 19th-century poet);
  - authors held out by the desk are skipped: Голенищев-Кутузов, Плещеев (their poems are the desk's held-out test songs);
  - the test poem itself (page id 9610) is skipped.
"""
import sys, re, json
SKIP_AUTHORS = ('Голенищев-Кутузов', 'Плещеев')
SKIP_IDS = {'9610'}
out = open(sys.argv[1], 'w', encoding='utf-8')
re_title = re.compile(r'<title>(.*?)</title>')
re_ns = re.compile(r'<ns>(\d+)</ns>')
re_id = re.compile(r'<id>(\d+)</id>')
re_auth = re.compile(r'\|\s*АВТОР\s*=\s*([^\n]*)')
re_born = re.compile(r'\((?:[^()\d]*?)(\d{4})\s*[-–—]\s*(\d{4})?')
re_cat = re.compile(r'\[\[Категория:([^\]|]+)')
import html
n_pages = n_sel = 0
buf = []
inpage = False
for raw in sys.stdin.buffer:
    line = raw.decode('utf-8', 'replace')
    if '<page>' in line:
        inpage = True; buf = []
    if inpage:
        buf.append(line)
        if '</page>' in line:
            inpage = False
            n_pages += 1
            s = ''.join(buf)
            m = re_ns.search(s)
            if not m or m.group(1) != '0':
                continue
            t = re_title.search(s).group(1)
            if '/' in t or 'Отексте' not in s:
                continue
            cats = re_cat.findall(s)
            if not any(c.startswith(('Поэзия', 'Стихотворения')) for c in cats):
                continue
            pid = re_id.search(s).group(1)
            if pid in SKIP_IDS:
                continue
            a = re_auth.search(s)
            if not a:
                continue
            auth = a.group(1)
            if any(x in auth for x in SKIP_AUTHORS):
                continue
            b = re_born.search(auth)
            if not b or int(b.group(1)) > 1850:
                continue
            tx = s[s.index('<text'):]
            tx = tx[tx.index('>') + 1:]
            tx = tx[:tx.rindex('</text>')] if '</text>' in tx else tx
            tx = html.unescape(tx)
            n_sel += 1
            out.write(json.dumps({'id': pid, 'title': html.unescape(t), 'author': auth.strip(), 'text': tx}, ensure_ascii=False) + '\n')
print('pages', n_pages, 'selected', n_sel, file=sys.stderr)
