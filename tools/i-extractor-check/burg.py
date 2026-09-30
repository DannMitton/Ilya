#!/usr/bin/env python3
"""
An independent reading of fR1 and fR2 from a capture WAV
(docs/sessions/brief-code-i-extractor_r1_2026-09-30.md, step 4).

It shares no code with the app. It follows Praat's "To Formant (burg)" recipe as Praat
documents it, with its defaults for an adult male voice: resample to twice the formant
ceiling (5000 Hz, so 10 kHz), pre-emphasis from 50 Hz, 25 ms effective window (a Gaussian
50 ms long), 6.25 ms steps, Burg's method with 2 x 5 coefficients, and formants taken
as the roots of the predictor between 50 Hz and ceiling - 50 Hz. The reading is the median
of the frames' first and second formants across the stretch.

A different algorithm on purpose: the app reads fR1 from the closed phase, pulse by pulse
(`apps/web/src/lib/voice/engine/closed-phase.ts`); this reads every frame, open phase and all,
the way a phonetician's default would. When the two agree, neither is merely echoing itself.

Usage:
  python3 tools/i-extractor-check/burg.py <capture.wav> [--from S --to S] [--json]
With the sidecar JSON beside the WAV, the stretch defaults to the guard's `segmentS`.

Needs numpy and scipy.
"""
import argparse, json, os, sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import resample_poly

CEILING = 5000.0
N_FORMANTS = 5
WIN_S = 0.025        # effective duration; the Gaussian window is twice this
STEP_S = 0.00625
PREEMPH_HZ = 50.0


def burg(x, order):
    """Burg's method: predictor coefficients a[0..order], a[0] = 1."""
    f = x.astype(float).copy()
    b = x.astype(float).copy()
    a = np.array([1.0])
    for m in range(order):
        ff, bb = f[m + 1:], b[m:-1]
        den = np.dot(ff, ff) + np.dot(bb, bb)
        if den <= 0:
            break
        k = -2.0 * np.dot(ff, bb) / den
        a = np.concatenate([a, [0.0]])
        a = a + k * a[::-1]
        f_new = ff + k * bb
        b_new = bb + k * ff
        f[m + 1:] = f_new
        b[m + 1:] = b_new
    return a


def frame_formants(frame, sr):
    a = burg(frame, 2 * N_FORMANTS)
    roots = np.roots(a)
    roots = roots[np.imag(roots) > 0]
    freqs = np.angle(roots) * sr / (2 * np.pi)
    bws = -np.log(np.abs(roots)) * sr / np.pi
    keep = (freqs > 50) & (freqs < CEILING - 50)
    order = np.argsort(freqs[keep])
    return freqs[keep][order], bws[keep][order]


def analyse(y, sr):
    sr2 = int(2 * CEILING)
    g = np.gcd(int(sr), sr2)
    x = resample_poly(y, sr2 // g, int(sr) // g)
    alpha = np.exp(-2 * np.pi * PREEMPH_HZ / sr2)
    x = np.append(x[0], x[1:] - alpha * x[:-1])
    n = int(round(2 * WIN_S * sr2))
    t = np.arange(n) - (n - 1) / 2
    # Praat's Gaussian window: exp(-12 (t/T)^2) - edge, normalised
    w = (np.exp(-12.0 * (t / n) ** 2) - np.exp(-12.0 * 0.25)) / (1 - np.exp(-12.0 * 0.25))
    hop = int(round(STEP_S * sr2))
    f1s, f2s = [], []
    for s in range(0, len(x) - n, hop):
        fr = x[s:s + n] * w
        if not np.any(fr):
            continue
        f, _ = frame_formants(fr, sr2)
        if len(f) >= 1:
            f1s.append(f[0])
        if len(f) >= 2:
            f2s.append(f[1])
    f1s, f2s = np.array(f1s), np.array(f2s)
    q = lambda v: [float(np.percentile(v, p)) for p in (25, 50, 75)] if len(v) else [None] * 3
    return {'frames': int(len(f1s)), 'f1': q(f1s), 'f2': q(f2s)}


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
    ap.add_argument('wav')
    ap.add_argument('--from', dest='t0', type=float)
    ap.add_argument('--to', dest='t1', type=float)
    ap.add_argument('--json', action='store_true')
    a = ap.parse_args()
    sr, data = wavfile.read(a.wav)
    y = data.astype(float)
    if data.dtype == np.int16:
        y /= 32768.0
    if y.ndim > 1:
        y = y.mean(axis=1)
    t0, t1 = a.t0, a.t1
    side = os.path.splitext(a.wav)[0] + '.json'
    if t0 is None and os.path.exists(side):
        seg = (json.load(open(side)).get('outcome') or {}).get('guard', {}).get('segmentS')
        if seg:
            t0, t1 = seg
    i0 = int(round((t0 or 0) * sr))
    i1 = int(round(t1 * sr)) if t1 is not None else len(y)
    r = analyse(y[i0:i1], sr)
    r.update({'file': os.path.basename(a.wav), 'stretchS': [i0 / sr, i1 / sr]})
    if a.json:
        print(json.dumps(r))
    else:
        f1, f2 = r['f1'], r['f2']
        fmt = lambda v: 'n/a' if v is None else f'{v:.0f}'
        print(f"{r['file']}  {r['stretchS'][0]:.2f}-{r['stretchS'][1]:.2f} s, {r['frames']} frames")
        print(f"  fR1 median {fmt(f1[1])} Hz (quartiles {fmt(f1[0])} to {fmt(f1[2])})")
        print(f"  fR2 median {fmt(f2[1])} Hz (quartiles {fmt(f2[0])} to {fmt(f2[2])})")


if __name__ == '__main__':
    sys.exit(main())
