"""N.135 stage 1, 4.3: the language of a row, without a poem. Four decisions per reader, scored against the row labels (label.py: russian / other / notext).
1. Dictionary witness: sew a row's tokens (row 81's 'joint' sewing), modernise (modernisePreReform, fold); a row is Russian where at least half of its sewn words of two or more letters
   are entries of the dictionary (data/dictionary*.json keys, ё folded, hyphens out: ~/Downloads/_desk-n135/wordlists/ru.txt, built by wordlists.py).
2. Two readings: the row is read by the reader (Russian) and by Tesseract `eng` (Homebrew's 5.5.3 model on disk; no French model on this Mac); the row goes to Russian where the
   reader's sewn words held by the Russian list outnumber the `eng` reading's sewn words held by the English list (/usr/share/dict/words) or the French list (words of the dictionary's `f` glosses).
3. Position: the first row of each system whose core is not taller than 2.2 staff spaces is Russian.
4. Dictionary witness with the poem (row 81's `syll`): a row is Russian where at least half of its sewn words of two or more letters equal a whole word, or a whole printed syllable, of the
   transcription of the song (the ceiling when a poem is given).
A row of two or fewer countable words is 'short' and reported apart. Also the threshold of section 5 (pages that pass).
Usage: RULE=R1|R2 python3 score43.py -> score43-<RULE>.txt, calls43-<RULE>.json"""
import json, collections
from common2 import *
ru = {w.replace('-', '') for w in wordlist('ru')}; en = wordlist('en-usr-share-dict-words'); fr = wordlist('fr-from-dictionary-f-glosses')
oth = {w for w in en | fr}
Ps = {L: transcription(L) for L in SONGS}; readers = [m for m in READERS43 if all(os.path.exists(f'{HERE}/ocr{D}/{L}-{m}.json') for L in SONGS)]
alltok = [w['text'] for L in SONGS for m in readers for r in ocr(L, m) for w in sew(r['words'])] + [s for L in SONGS for v in Ps[L].values() for s in v] + [w for L in SONGS for w in poem_words(Ps[L])]
prime(alltok)
def latin(t): return re.sub(r'[^a-zàâäçéèêëîïôöùûüÿœæ]', '', t.lower())
def words_ru(row): return [norm(w['text']) for w in sew(row['words'])]
def count(ws): return [w for w in ws if len(w) >= 2]
calls = {}; table = []
for L in SONGS:
    R = rows(L); lab = labels(L)['rows']; PW = {norm(w) for w in poem_words(Ps[L])} | {norm(s) for v in Ps[L].values() for s in v}
    E = {rid(r): r for r in ocr(L, 'e')}
    first = {}
    for r in R:
        k = (r['page'], r['system'])
        if k not in first and (r['core'][1] - r['core'][0] + 1) <= 2.2 * r['space']: first[k] = rid(r)
    for m in readers:
        O = {rid(r): r for r in ocr(L, m)}; c = calls.setdefault(L, {}).setdefault(m, {})
        for r in R:
            k = rid(r); cnt = count(words_ru(O[k])); hit = [w for w in cnt if w in ru]
            d1 = bool(cnt) and len(hit) >= len(cnt) / 2
            ew = [latin(w['text']) for w in sew(E[k]['words'])]; eh = sum(1 for w in ew if len(w) >= 2 and w in oth)
            d2 = len(hit) > eh and len(hit) >= 1
            d3 = first.get((r['page'], r['system'])) == k
            h4 = [w for w in cnt if w in PW]; d4 = bool(cnt) and len(h4) >= len(cnt) / 2
            c[k] = dict(d1=d1, d2=d2, d3=d3, d4=d4, n=len(cnt), hit=len(hit), short=len(cnt) <= 2)
json.dump(calls, open(f'{HERE}/calls43-{RULE}.json', 'w'))
def tally(Ls, m, d):
    t = collections.Counter()
    for L in Ls:
        lab = labels(L)['rows']
        for k, v in calls[L][m].items():
            l = lab[k]; called = v[d]; sh = 's' if v['short'] else ''
            if l == 'russian': t['R' + sh] += 1; t['Rcalled' + sh] += called; t['Rmissed' + sh] += not called
            else: t[l + sh] += 1; t[l + 'called' + sh] += called
    return t
lines = [f'RULE {RULE}. Language of a row, four decisions (1 dictionary witness; 2 two readings by dictionary count; 3 position; 4 dictionary witness with the transcription as poem).',
         'Per song and reader: Russian rows called Russian / other-language rows called Russian / not-text rows called Russian / Russian rows missed; short rows (two or fewer countable words) in brackets as Russian called of Russian, false calls']
for L in SONGS:
    for m in readers:
        row = []
        for d in ('d1', 'd2', 'd3', 'd4'):
            t = tally([L], m, d); row.append(f"{d}: {t['Rcalled']}/{t['otherscalled'] if 0 else t['othercalled']}/{t['notextcalled']}/{t['Rmissed']} of R{t['R']} o{t['other']} n{t['notext']} [short R {t['Rcalleds']}/{t['Rs']}, false {t['othercalleds'] + t['notextcalleds']}]")
        lines.append(f'{L} ({m}) ' + ' | '.join(row))
groups = [('U1-6', [s for s in SONGS if s[0] == 'U']), ('P', ['P']), ('B', [s for s in SONGS if s[0] == 'B']), ('S,T,K,M', list(FOUR)), ('all', SONGS)]
lines += ['', 'By group']
for g, Ls in groups:
    for m in readers:
        row = []
        for d in ('d1', 'd2', 'd3', 'd4'):
            t = tally(Ls, m, d); row.append(f"{d}: {t['Rcalled']}/{t['othercalled']}/{t['notextcalled']}/{t['Rmissed']} of R{t['R']} o{t['other']} n{t['notext']} [short R {t['Rcalleds']}/{t['Rs']}, false {t['othercalleds'] + t['notextcalleds']}]")
        lines.append(f'{g} ({m}) ' + ' | '.join(row))
# section 5's threshold: pages that pass, decision 1
lines += ['', "Pages that pass section 5's DESK DEFAULT (decision 1 calls at least one Russian row in every system of the page, and at least half of the sewn words of the called rows are in the dictionary), per song and reader: passing pages / pages"]
for L in SONGS:
    R = rows(L); S = systems(L); pages = sorted({s['page'] for s in S}); out = []
    for m in readers:
        O = {rid(r): r for r in ocr(L, m)}; ok = 0
        for p in pages:
            sy = [s['system'] for s in S if s['page'] == p]; good = True; nw = nh = 0
            for s in sy:
                called = [rid(r) for r in R if (r['page'], r['system']) == (p, s) and calls[L][m][rid(r)]['d1']]
                if not called: good = False
                for k in called: cnt = count(words_ru(O[k])); nw += len(cnt); nh += sum(1 for w in cnt if w in ru)
            ok += good and nw > 0 and nh >= nw / 2
        out.append(f'({m}) {ok}/{len(pages)}')
    lines.append(f'{L}: ' + ' '.join(out))
open(f'{HERE}/score43-{RULE}.txt', 'w', encoding='utf8').write('\n'.join(lines) + '\n'); print('\n'.join(lines))
