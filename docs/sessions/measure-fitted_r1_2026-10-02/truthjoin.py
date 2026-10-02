"""Join the extracted notes to the truth through the scorer's `matches` (readerIndex -> truthIndex). Native analysis only."""
import json
from fractions import Fraction
TR = '/Users/dannmitton/Desktop/ilya-rewrite/tools/e16-harness/output/truth/'
TRUTH = {1: TR + 'mussorgsky_sunless-01_within-four-walls.truth.json', 2: TR + 'mussorgsky_sunless-02_you-did-not-recognize-me.truth.json',
         3: TR + 'mussorgsky_sunless-03_finished-is-the-noisy-idle-day.truth.json', 4: TR + 'mussorgsky_sunless-04_be-bored.truth.json',
         5: TR + 'mussorgsky_sunless-05_elegy.truth.json', 6: TR + 'mussorgsky_sunless-06_on-the-river.truth.json',
         7: '/Users/dannmitton/Desktop/ilya-rewrite/docs/sessions/truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.json'}

def truth_events(song):
    tj = json.load(open(TRUTH[song]))
    ev = sorted(tj['verses'][0]['notes'], key=lambda n: n['onsetAbsolute'])
    return ev

def base_of(d):
    """(base, dotted) of a duration {numerator, denominator}: base in 1/2, 1/4, 1/8, 1/16, ... or None; dotted True/False."""
    f = Fraction(d['numerator'], d['denominator'])
    for b in (Fraction(1, 1), Fraction(1, 2), Fraction(1, 4), Fraction(1, 8), Fraction(1, 16), Fraction(1, 32)):
        if f == b: return b, False
        if f == b * Fraction(3, 2): return b, True
    return None, None

def join(song, pages, scoredir):
    """-> dict ro_global -> truth note (or None). `pages` is the extraction's pages list."""
    sc = json.load(open(f'{scoredir}/song{song}.score.json'))
    ev = truth_events(song)
    m = {mm['readerIndex']: ev[mm['truthIndex']] for mm in sc['matches']}
    return m, sc
