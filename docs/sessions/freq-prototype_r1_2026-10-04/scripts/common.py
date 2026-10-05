"""Shared helpers. Paths are fixed to the desk's scratch folder."""
import json, re, os
BASE = '/tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/freq'
RAW = BASE + '/raw'
WORK = BASE + '/work'
DICT = ['/home/claude/ilya/data/dictionary.86d83340-a.json',
        '/home/claude/ilya/data/dictionary.86d83340-b.json']

def load_dictionary(with_pos=False):
    """Return (forms, lemma_of): forms is a list in file order, lemma_of maps form -> lemma.
    With with_pos=True also return pos_of, mapping form -> part of speech."""
    forms, lemma_of, pos_of = [], {}, {}
    for p in DICT:
        with open(p, encoding='utf-8') as f:
            for line in f:
                line = line.strip().rstrip(',')
                if not line.startswith('['):
                    continue
                k, v = json.loads(line)
                forms.append(k)
                lemma_of[k] = v.get('l') or k
                pos_of[k] = v.get('p') or ''
    return (forms, lemma_of, pos_of) if with_pos else (forms, lemma_of)

OLD = str.maketrans({'ѣ': 'е', 'ѳ': 'ф', 'і': 'и', 'ѵ': 'и'})

def letter_map(w):
    """Ilya's pre-reform letter map (see packages/dictionary/src/pre-reform-normalizer.ts), lower-case input:
    yat, fita, decimal i, izhitsa replaced; word-final hard sign dropped."""
    w = w.translate(OLD)
    if w.endswith('ъ'):
        w = w[:-1]
    return w

HUSH = set('жцчшщ')
def ending_variants(w):
    """Extra keys for the pre-1918 ENDINGS that a letter map cannot reach (desk's own heuristic, not Ilya's code).
    Returns a list of additional modern spellings for a letter-mapped old word."""
    out = []
    if w.endswith('аго') and len(w) > 4:
        out.append(w[:-3] + ('его' if w[-4] in HUSH else 'ого'))
    if w.endswith('яго') and len(w) > 4:
        out.append(w[:-3] + 'его')
    if w.endswith('ыя') and len(w) > 3:
        out.append(w[:-2] + 'ые')
    if w.endswith('ия') and len(w) > 3:      # ambiguous (исторія -> история), so both keys are kept
        out.append(w[:-2] + 'ие')
    return out

def fold(w):
    return w.replace('ё', 'е')

WORD_RE = re.compile(r"[А-Яа-яЁё]+(?:-[А-Яа-яЁё]+)*")
def poem_text():
    t = open(RAW + '/poem_wikitext.txt', encoding='utf-8').read()
    a = t.index('{{f1||') + len('{{f1||')
    b = t.index('|<1851>}}')
    return t[a:b]
def poem_words():
    out = []
    for w in WORD_RE.findall(poem_text()):
        out.append(w.lower())
    return out
