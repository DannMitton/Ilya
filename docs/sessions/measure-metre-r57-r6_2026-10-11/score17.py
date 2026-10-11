"""Score a drop-box read of the 17 songs: conv.py, then final-line.ts (row 55's line), unchanged.
Also lists homr's <time> at each joined bar that writes one (what Ilya states today).
Usage: python3 score17.py <reads dir>"""
import json, os, subprocess, sys, re
REPO = os.path.expanduser('~/Desktop/ilya-rewrite')
CONV = f'{REPO}/docs/sessions/measure-checks_r1_2026-10-05/scripts/scorer/conv.py'
LINE = f'{REPO}/docs/sessions/measure-final-test_r1_2026-10-08/final-line.ts'
T = f'{REPO}/tools/e16-harness/output/truth/'
H = os.path.expanduser('~/Downloads/_desk-2026-10-07/heldout-truth/')
TRUTH = {
    'tch': f'{REPO}/docs/sessions/truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.json',
    'sun1': T + 'mussorgsky_sunless-01_within-four-walls.truth.json',
    'sun4': T + 'mussorgsky_sunless-04_be-bored.truth.json',
    'sun5': T + 'mussorgsky_sunless-05_elegy.truth.json',
    'sun6': T + 'mussorgsky_sunless-06_on-the-river.truth.json',
    'k01': T + 'kabalevsky_shakespeare_t01-or-i-shall-live-your-epitaph-to-make.truth.json',
    'k02': T + 'kabalevsky_shakespeare_t02-weary-with-toil-i-haste-me-to-my-bed.truth.json',
    'k03': T + 'kabalevsky_shakespeare_t03-my-love-is-strengthend-though-more-weak-in-seeming.truth.json',
    'k04': T + 'kabalevsky_shakespeare_t04-when-to-the-sessions-of-sweet-silent-thought.truth.json',
    'k06': T + 'kabalevsky_shakespeare_t06-o-that-you-were-yourself.truth.json',
    'k07': T + 'kabalevsky_shakespeare_t07-music-to-hear-why-hearst-thou-music-sadly.truth.json',
    'k08': T + 'kabalevsky_shakespeare_t08-no-longer-mourn-for-me-when-i-am-dead.truth.json',
    'k09': T + 'kabalevsky_shakespeare_t09-then-hate-me-when-thou-wilt.truth.json',
    'k10': T + 'kabalevsky_shakespeare_t10-why-is-my-verse-so-barren-of-new-pride.truth.json',
    'gur': H + 'gurilyov_no-op-6_raskayanie.truth.json',
    'grech': H + 'grechaninov_op20-4_uznik.truth.json',
    'varl': H + 'varlamov_no-op_skazhi-zachem.truth.json',
}
MEASURE = re.compile(r'<measure\b[^>]*>.*?</measure>', re.S)
d = os.path.abspath(sys.argv[1]); keep = os.path.join(d, 'scored'); os.makedirs(keep, exist_ok=True)
times = {}
ONLY = sys.argv[2:]
for s, t in TRUTH.items():
    if ONLY and s not in ONLY: continue
    r = json.load(open(os.path.join(d, s + '.json')))
    xml = os.path.join(keep, s + '.musicxml'); open(xml, 'w').write(r['result']['musicXml'])
    rd = os.path.join(keep, s + '.read.json')
    subprocess.run(['python3', CONV, rd, xml], check=True)
    out = subprocess.run(['node', '--experimental-strip-types', '--no-warnings', LINE, 'song', s, r['result']['backend'], t, rd, keep],
                         capture_output=True, text=True, cwd=REPO)
    print(out.stdout.strip() or out.stderr.strip())
    sc = json.load(open(os.path.join(keep, s + '.score.json')))
    print('  scorer metre (by length): right %(right)d of %(paired)d paired' % sc['metre'])
    part = re.search(r'<part\b[^>]*>(.*?)</part>', r['result']['musicXml'], re.S).group(1)
    times[s] = [(k, '%s/%s' % m.groups()) for k, bar in enumerate(MEASURE.findall(part))
                for m in [re.search(r'<time\b[^>]*>\s*<beats>(\d+)</beats>\s*<beat-type>(\d+)</beat-type>', bar)] if m]
json.dump(times, open(os.path.join(keep, 'homr-times.json'), 'w'), indent=1)
