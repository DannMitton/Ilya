#!/usr/bin/env python3
"""
Reference helper for the Burg tests (`apps/web/src/lib/voice/engine/burg.test.ts`, `tools/n200-score/burg-check.run.ts`).
It imports `tools/i-extractor-check/burg.py` unedited and prints, as JSON, what its functions give. Writes no bytecode.

  burg_ref.py coeffs <file.json>   file: {"x": [...], "order": 10, "sr": 10000}
      -> {"a": [...], "freqs": [...]}   (Burg coefficients, and the upper-half-plane roots' frequencies, ascending)
  burg_ref.py frames <file.wav> [--between LO HI]
      -> frame count, per-frame (F1, F2) quartiles as burg.py computes them, and, with --between, the share of frames whose
         poles hold one strictly between LO and HI Hz.  At a rate other than 10 kHz it resamples with `resample_poly` as burg.py's `analyse` does; at 10 kHz that changes nothing.
  burg_ref.py resample <file48k.f64> <file10k.f64>
      -> level difference in dB, `resample_poly` against the second file, in 1 kHz bands to 5 kHz (Welch, same settings).
"""
import json, os, sys
sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'i-extractor-check'))
import numpy as np
import burg as B


def main():
    mode = sys.argv[1]
    if mode == 'coeffs':
        d = json.load(open(sys.argv[2]))
        a = B.burg(np.array(d['x'], dtype=float), d['order'])
        r = np.roots(a)
        r = r[np.imag(r) > 0]
        fr = sorted(float(v) for v in np.angle(r) * d['sr'] / (2 * np.pi))
        print(json.dumps({'a': [float(v) for v in a], 'freqs': fr}))
    elif mode == 'frames':
        from scipy.io import wavfile
        sr, data = wavfile.read(sys.argv[2])
        y = data.astype(float) / 32768.0
        lo = hi = None
        if '--between' in sys.argv:
            i = sys.argv.index('--between'); lo, hi = float(sys.argv[i + 1]), float(sys.argv[i + 2])
        if sr != 2 * B.CEILING:  # as burg.py's `analyse` does it
            from scipy.signal import resample_poly
            sr2 = int(2 * B.CEILING); g = int(np.gcd(int(sr), sr2))
            y = resample_poly(y, sr2 // g, int(sr) // g); sr = sr2
        x = np.append(y[0], y[1:] - np.exp(-2 * np.pi * B.PREEMPH_HZ / sr) * y[:-1])
        n = int(round(2 * B.WIN_S * sr)); t = np.arange(n) - (n - 1) / 2
        w = (np.exp(-12.0 * (t / n) ** 2) - np.exp(-12.0 * 0.25)) / (1 - np.exp(-12.0 * 0.25))
        hop = int(round(B.STEP_S * sr))
        f1s, f2s, between, frames = [], [], 0, 0
        for s in range(0, len(x) - n, hop):
            fr = x[s:s + n] * w
            if not np.any(fr):
                continue
            f, _ = B.frame_formants(fr, sr)
            frames += 1
            if len(f) >= 1: f1s.append(float(f[0]))
            if len(f) >= 2: f2s.append(float(f[1]))
            if lo is not None and any(lo < v < hi for v in f): between += 1
        q = lambda v: [float(np.percentile(v, p)) for p in (25, 50, 75)]
        print(json.dumps({'frames': frames, 'f1': q(f1s), 'f2': q(f2s), 'f1n': len(f1s), 'f2n': len(f2s), 'between': between}))
    elif mode == 'resample':
        from scipy.signal import resample_poly, welch
        a = np.fromfile(sys.argv[2], dtype='<f8'); b = np.fromfile(sys.argv[3], dtype='<f8')
        ref = resample_poly(a, 5, 24)
        m = min(len(ref), len(b))
        out = []
        for lo in range(0, 5000, 1000):
            fa, pa = welch(ref[:m], fs=10000, nperseg=2048); fb, pb = welch(b[:m], fs=10000, nperseg=2048)
            sel = (fa >= lo) & (fa < lo + 1000)
            out.append(float(10 * np.log10(pb[sel].sum() / pa[sel].sum())))
        print(json.dumps({'bands_db_ts_minus_scipy': out}))


main()
