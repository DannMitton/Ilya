"""4c. The key check. Lists every key each part of each page states, per system, beside the truth's key, before
the join (all parts), and measures three candidate rules. Also lists every metre each part states, beside the
truth's bar length, for the metre question of 4b.

A unit is one part on one system of one page: homr writes one <key> per part (no number attribute), so a
piano part's two staves always share one key. A unit's key is the key in force at the system's first measure.
Truth: each truth file holds one key for the song (truth['keySignature']['fifths']) and no key change.
Writes out/tables/4c-keys.csv, 4c-rules.csv, 4c-metres.csv, 4c-notes-under-misread-key.csv."""
import csv, json
from collections import Counter
from fractions import Fraction as F
from lib import SONGS, SOURCE, KIT, CHK, parse, read_measures, load_song, key_alter

T = f'{CHK}/out/tables'


def units_of_song(song):
    pages, truthf = SONGS[song]
    truth = json.load(open(f'{KIT}/truth/{truthf}'))
    tkey = truth['keySignature']['fifths']
    units, metres = [], []
    for p in pages:
        root = parse(f'{CHK}/in/{p}.musicxml')
        nparts = len(root.findall('part'))
        for pi in range(nparts):
            ms = read_measures(root, pi, '1')
            staves = 2 if root.findall('part')[pi].find('.//staves') is not None else 1
            sys_i = -1
            for m in ms:
                if m['index'] == 0 or m['new_system']:
                    sys_i += 1
                    units.append(dict(song=song, page=p, source=SOURCE[p], part=pi + 1, staves=staves, system=sys_i + 1,
                                      firstMeasure=m['number'], key=m['fifths'], stated=json.dumps(m['stated_key']),
                                      truthKey=tkey, misread=(m['fifths'] != tkey), statedMidSystem=''))
                elif m['stated_key']:
                    units[-1]['statedMidSystem'] += f"m{m['number']}:{m['stated_key']} "
                for t in m['stated_time']:
                    metres.append(dict(song=song, page=p, part=pi + 1, measure=m['number'], stated=f'{t[0]}/{t[1]}',
                                       statedLength=str(F(t[0], t[1]))))
    return units, metres, tkey, truth


def main():
    allunits, allmetres, rules = [], [], []
    for song in SONGS:
        units, metres, tkey, truth = units_of_song(song)
        # rule i: a key stated in the first measure of a later page, differing from the key in force at the end of the
        # previous page in the same part, where a later statement in that part restores the old key
        flag_i = set()
        bypart = {}
        for u in units:
            bypart.setdefault(u['part'], []).append(u)
        for part, us in bypart.items():
            for k, u in enumerate(us):
                if k == 0 or u['system'] != 1 or u['page'] == us[0]['page']:
                    continue
                prev = us[k - 1]['key']
                if u['key'] != prev:
                    later = [v for v in us[k + 1:] if v['key'] == prev]
                    if later:
                        stop = us.index(later[0])
                        for v in us[k:stop]:
                            flag_i.add(id(v))
        # rule i, same-page variant: the restoring statement must be on the same page
        flag_i_same = set()
        for part, us in bypart.items():
            for k, u in enumerate(us):
                if k == 0 or u['system'] != 1 or u['page'] == us[0]['page']:
                    continue
                prev = us[k - 1]['key']
                if u['key'] != prev:
                    later = [v for v in us[k + 1:] if v['key'] == prev and v['page'] == u['page']]
                    if later:
                        stop = us.index(later[0])
                        for v in us[k:stop]:
                            flag_i_same.add(id(v))
        # rule ii: in each system, a voice key that differs from the piano key; the voice staff differs from both piano staves
        flag_ii_voice, flag_ii_sys = set(), set()
        bysys = {}
        for u in units:
            bysys.setdefault((u['page'], u['system']), []).append(u)
        for key, us in bysys.items():
            keys = {u['key'] for u in us}
            if len(keys) > 1:
                for u in us:
                    flag_ii_sys.add(id(u))
                    if u['part'] == 1:
                        flag_ii_voice.add(id(u))
        # rule iii: a unit whose key differs from the key most units of the song state
        maj = Counter(u['key'] for u in units).most_common(1)[0][0]
        flag_iii = {id(u) for u in units if u['key'] != maj}
        for u in units:
            u['rule_i'] = id(u) in flag_i
            u['rule_i_samepage'] = id(u) in flag_i_same
            u['rule_ii_voice'] = id(u) in flag_ii_voice
            u['rule_ii_system'] = id(u) in flag_ii_sys
            u['rule_iii'] = id(u) in flag_iii
        mis = [u for u in units if u['misread']]
        row = dict(song=song, truthKey=tkey, majorityKey=maj, units=len(units),
                   voiceUnits=sum(1 for u in units if u['part'] == 1), misreadUnits=len(mis),
                   misreadVoiceUnits=sum(1 for u in mis if u['part'] == 1))
        for r in ('rule_i', 'rule_i_samepage', 'rule_ii_voice', 'rule_ii_system', 'rule_iii'):
            fl = [u for u in units if u[r]]
            row[r + '_flags'] = len(fl)
            row[r + '_right'] = sum(1 for u in fl if u['misread'])
            row[r + '_false'] = sum(1 for u in fl if not u['misread'])
            row[r + '_missed'] = sum(1 for u in mis if not u[r])
        rules.append(row)
        allunits += units
        for m in metres:
            m['truthBarLengths'] = json.dumps(dict(Counter(str(F(b['expectedDuration']['numerator'], b['expectedDuration']['denominator'])) for b in truth['measureDurations'])))
        allmetres += metres
        print(song, row)
        for u in units:
            if u['misread'] or u['statedMidSystem'] or u['rule_i'] or u['rule_ii_system'] or u['rule_iii']:
                print('   ', u['page'], 'part', u['part'], 'sys', u['system'], 'm', u['firstMeasure'], 'key', u['key'], 'truth', tkey,
                      'mid', u['statedMidSystem'], 'i', u['rule_i'], 'iiV', u['rule_ii_voice'], 'iiS', u['rule_ii_system'], 'iii', u['rule_iii'])
    for name, rows in (('4c-keys', allunits), ('4c-rules', rules), ('4c-metres', allmetres)):
        with open(f'{T}/{name}.csv', 'w', newline='') as f:
            w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
    # what a misread key does to the notes under it: the joined voice part's notes whose key in force is not the truth's
    out = []
    for song in SONGS:
        S = load_song(song)
        tkey = S['truth']['keySignature']['fifths']
        idx = {}
        for k, e in enumerate(S['events']):
            idx[id(e['note'])] = k
        mt = {m['readerIndex']: m['truthIndex'] for m in S['score']['matches']}
        for r in S['joined']:
            if r['fifths'] == tkey:
                continue
            for n in r['notes']:
                if n['rest']:
                    continue
                k = idx.get(id(n))
                te = S['tevents'][mt[k]] if k is not None and k in mt else None
                out.append(dict(song=song, bar=r['index'] + 1, page=r['page'], keyInForce=r['fifths'], truthKey=tkey,
                                step=n['step'], octave=n['octave'], alter=n['alter'], readMidi=n['midi'],
                                keyGivesStep=key_alter(r['fifths'], n['step']), truthKeyGivesStep=key_alter(tkey, n['step']),
                                truthMidi=(te['midi'] + S['score']['shift'] if te else None),
                                pitchAsTruth=(te is not None and n['midi'] - S['score']['shift'] == te['midi'])))
    with open(f'{T}/4c-notes-under-misread-key.csv', 'w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=list(out[0].keys())); w.writeheader(); w.writerows(out)
    aff = [o for o in out if o['keyGivesStep'] != o['truthKeyGivesStep']]
    print('notes under a misread key in the joined voice part:', len(out), '; on a step the two keys treat differently:', len(aff))
    for o in aff:
        print('   ', o)


if __name__ == '__main__':
    main()
