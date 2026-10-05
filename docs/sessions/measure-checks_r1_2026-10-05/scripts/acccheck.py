"""4d. An accidental must have a source.

Part 1: for every pitch difference of 4a, does the reading differ from the truth in the accidental only? The truth
holds MIDI numbers, not spellings. The test: the truth's pitch (with the song's octave shift) minus the natural
pitch of the reading's step and octave is -1, 0 or +1, so the truth's pitch can be written on the reading's own
step with one sign or none. Otherwise the step (the place on the staff) differs.

Part 2: the rule "a note's alteration must be explained by the key in force, by an accidental earlier in its bar
on the same step and octave, or by its own printed sign". homr writes no <accidental> element (0 on all 20 pages),
so no printed sign can be seen in the reading. What the rule can test on the reading alone: a note whose <alter>
(absent = 0) differs from the key's alteration for its step and from the alteration of the latest earlier note
in its bar on the same step and octave. Such a note needs a printed sign; homr records none, so it is flagged.
A flag is right where the scorer reports the note's pitch wrong; false where the pitch is right.
Writes out/tables/4d-pitch-differences.csv, 4d-flags.csv, 4d-summary.csv."""
import csv, json
from collections import Counter
from lib import SONGS, load_song, key_alter, ST

T = '/home/claude/checks/out/tables'


def natural(step, octave):
    return (octave + 1) * 12 + ST[step]


def main():
    prow, frows, summ = [], [], []
    for song in SONGS:
        S = load_song(song)
        shift = S['score']['shift']
        mt = {m['readerIndex']: m['truthIndex'] for m in S['score']['matches']}
        wrong = {}
        for d in S['score']['differences']:
            if 'pitch' in d['kind']:
                wrong[d['readerIndex']] = d
        # part 1
        for k, d in wrong.items():
            n = S['events'][k]['note']
            te = S['tevents'][d['truthIndex']]
            t = te['midi'] + shift
            gap = t - natural(n['step'], n['octave'])
            bar = S['joined'][d['readerBar']]
            prow.append(dict(song=song, truthBar=d['truthBar'], readerBar=d['readerBar'] + 1, page=bar['page'],
                             read=f"{n['step']}{n['octave']} alter {n['alter']}", readMidi=n['midi'], truthMidiShifted=t,
                             keyInForce=n['fifths'], keyGivesStep=key_alter(n['fifths'], n['step']),
                             truthOnReadStepNeedsAlter=(gap if gap in (-1, 0, 1) else None),
                             accidentalOnly=(gap in (-1, 0, 1)), semitonesOff=n['midi'] - t, imgpos=n['imgpos']))
        # part 2
        idx = {id(e['note']): k for k, e in enumerate(S['events'])}
        flags = Counter()
        nn = 0
        for r in S['joined']:
            seen = {}
            for n in r['notes']:
                if n['rest'] or n['grace']:
                    continue
                nn += 1
                expect = seen.get((n['step'], n['octave']), key_alter(n['fifths'], n['step']))
                src = 'carried in bar' if (n['step'], n['octave']) in seen else 'key'
                if n['alter'] != expect:
                    k = idx.get(id(n))
                    right = k is not None and k in wrong
                    pitch_ok = k is not None and k in mt and not right
                    kind = ('natural against key' if n['alter'] == 0 and expect != 0 else
                            'sign against key' if expect == 0 else 'other')
                    if src == 'carried in bar':
                        kind += ' (against earlier note in bar)'
                    status = 'right' if right else 'false' if pitch_ok else 'unmatched (extra note)'
                    flags[status] += 1
                    frows.append(dict(song=song, bar=r['index'] + 1, page=r['page'], note=f"{n['step']}{n['octave']}",
                                      alter=n['alter'], expected=expect, expectedFrom=src, kind=kind, status=status,
                                      imgpos=n['imgpos']))
                seen[(n['step'], n['octave'])] = n['alter']
        # pitch differences that the rule does not flag
        flagged_idx = set()
        for fr in frows:
            pass
        summ.append(dict(song=song, notesChecked=nn, flags=sum(flags.values()), right=flags['right'], false=flags['false'],
                         onExtraNotes=flags['unmatched (extra note)'], pitchDifferences=len(wrong)))
        print(song, summ[-1])
    # which pitch differences the rule flags
    fl = {(f['song'], f['bar'], f['note'], f['alter']) for f in frows if f['status'] == 'right'}
    for p in prow:
        p['flaggedByRule'] = any(f[0] == p['song'] and f[1] == p['readerBar'] for f in fl)
    for name, rows in (('4d-pitch-differences', prow), ('4d-flags', frows), ('4d-summary', summ)):
        with open(f'{T}/{name}.csv', 'w', newline='') as f:
            w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
    print('pitch differences:')
    for p in prow:
        print('  ', p)
    print('flags by kind and status:', Counter((f['kind'], f['status']) for f in frows))


if __name__ == '__main__':
    main()
