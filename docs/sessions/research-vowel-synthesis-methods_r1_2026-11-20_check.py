#!/usr/bin/env python3
"""Companion to research-vowel-synthesis-methods_r1_2026-11-20.md (section 3, table 2).

What it does: on the Hillenbrand et al. (1995) American English vowel data (adult
men and women with complete F1 and F2 for the nine vowels used), it treats
[i e E A o u] as the vowels a speaker "gave" and [I V ae] as vowels to be placed,
takes ONE adult man at a time as the only informant (as Ilya takes Mitton 2020),
and scores each placement method against what the speaker really produced.

Data: h95 from the R package phonTools (S. Barreda), which repackages the data on
J. Hillenbrand's site. Convert h95.rda to CSV first (columns type, speaker, vowel,
f1, f2), then: python3 check.py h95.csv
For Peterson and Barney (1952), phonTools pb52 averaged over its two repetitions:
python3 check.py pb52.csv pb  (no [e] or [o] there, so the given vowels are
[i E A O u] and the [I] rules lean on [E]).
This is a desk check on spoken English. It is not a published result.
"""
import sys
import numpy as np
import pandas as pd

d = pd.read_csv(sys.argv[1]); d = d[d.type.isin(['m', 'w'])]
PB = len(sys.argv) > 2 and sys.argv[2] == 'pb'
A = ['i', 'E', 'A', 'O', 'u'] if PB else ['i', 'e', 'E', 'A', 'o', 'u']; T = ['I', 'V', '{']
N = 'E' if PB else 'e'   # the neighbour the [I] rules lean on
w1 = d.pivot(index='speaker', columns='vowel', values='f1')
w2 = d.pivot(index='speaker', columns='vowel', values='f2')
typ = d.drop_duplicates('speaker').set_index('speaker').type
S = [s for s in w1.index if w1.loc[s, A + T].notna().all() and w2.loc[s, A + T].notna().all()]
F = [w1.loc[S], w2.loc[S]]; typ = typ.loc[S]
M = [s for s in S if typ[s] == 'm']
print('adults:', len(S), 'of whom men (informant pool):', len(M))

def run(test):
    R = {}
    for s in test:
        for j in M:
            if j == s: continue
            fs = [F[0].loc[s], F[1].loc[s]]; fj = [F[0].loc[j], F[1].loc[j]]
            logs = [np.log(fs[k][A].values) - np.log(fj[k][A].values) for k in (0, 1)]
            k_all = np.exp(np.mean(np.concatenate(logs)))          # one scale, both resonances
            k_each = [np.exp(l.mean()) for l in logs]             # one scale per resonance
            cur = {'I': (fj[0]['I'] / fj[0][N] * fs[0][N],
                         fs[1][N] + (fj[1]['I'] - fj[1][N]) / (fj[1]['i'] - fj[1][N]) * (fs[1]['i'] - fs[1][N])),
                   'V': (fj[0]['V'] / fj[0]['A'] * fs[0]['A'],
                         fs[1]['A'] + (fj[1]['V'] - fj[1]['A']) / (fj[1]['E'] - fj[1]['A']) * (fs[1]['E'] - fs[1]['A'])),
                   '{': (fj[0]['{'] / fj[0]['A'] * fs[0]['A'], fj[1]['{'] / fj[1]['A'] * fs[1]['A'])}
            for v in T:
                for k in (0, 1):
                    a_s = fs[k][A].values; a_j = fj[k][A].values; t = fs[k][v]; tj = fj[k][v]
                    P = {'1 current form (neighbour ratios and fractions)': cur[v][k],
                         '2 one scale for the whole tract': tj * k_all,
                         '3 one scale per resonance': tj * k_each[k],
                         '4 mean and spread per resonance (Lobanov, inverted)': a_s.mean() + a_s.std() * (tj - a_j.mean()) / a_j.std(),
                         '5 range per resonance (Gerstman, inverted)': a_s.min() + (a_s.max() - a_s.min()) * (tj - a_j.min()) / (a_j.max() - a_j.min()),
                         '6 informant copied, no adjustment': tj}
                    for nm, p in P.items():
                        R.setdefault(nm, {}).setdefault(k, []).append(abs(p - t) / t * 100)
    for nm in sorted(R):
        e1 = np.array(R[nm][0]); e2 = np.array(R[nm][1])
        print('  %-52s F1 %4.1f (%4.1f)   F2 %4.1f (%4.1f)' % (nm, np.median(e1), np.percentile(e1, 90), np.median(e2), np.percentile(e2, 90)))

print('median absolute error in percent (90th percentile), targets pooled')
print('all adults:'); run(S)
print('men only:'); run(M)
print('women only:'); run([s for s in S if typ[s] == 'w'])

print('how steady is a two-vowel ratio across speakers? median (5th to 95th percentile)')
for t in ('m', 'w'):
    idx = [x for x in S if typ[x] == t]
    for a, b in (('I', 'i'), ('V', 'A'), ('{', 'A')):
        r1 = F[0].loc[idx, a] / F[0].loc[idx, b]; r2 = F[1].loc[idx, a] / F[1].loc[idx, b]
        print('  %s n=%d  %s over %s  F1 %.2f (%.2f to %.2f)   F2 %.2f (%.2f to %.2f)' % (t, len(idx), a, b, r1.median(), r1.quantile(.05), r1.quantile(.95), r2.median(), r2.quantile(.05), r2.quantile(.95)))
