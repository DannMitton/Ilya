"""timesig.py -- E.16 close-prep item 2: THE TIME-SIGNATURE READ.

Replaces the struck mode-based metre inference (tuplet_catch(), STRUCK by
Fable's beam-session-close ruling) with an honest metre SOURCE: read the
printed time-signature numerals directly off the page, using the SAME
font-template machinery already built for rests (rest_templates.py) --
driving Verovio to inline real Leipzig glyph outlines, then rasterizing them
deterministically. No training; classical template matching, same precedent
class already accepted for rests and the accidental engine.

SMuFL time-signature digit codepoints (timeSigX): U+E080 (0) through
U+E089 (9), per the SMuFL 1.4 "Time signatures" range. This module renders a
tiny MEI score cycling meter.count through 0-9 (forcing every digit glyph to
appear at least once as a numerator), extracts each digit's raw path from the
rendered SVG defs exactly as rest_templates.py does for rests, and rasterizes
each at the page's measured staff-space size for template matching.

READING A PAGE'S TIME SIGNATURE (Gould / SMuFL convention, both numerals):
A time signature sits at the start of a system, after the clef and key
signature, before the first note. It is TWO STACKED numeral groups centred on
the staff's middle line: the numerator occupies the staff's top two spaces,
the denominator the bottom two spaces, with NO dividing line (unlike a written
fraction). Detection: search a horizontal band between the key signature's
end (or clef's end, if no key signature) and the first notehead, at the
FIRST system containing the vocal staff on the page. Within that band, split
into a top half (y in [staff_top, staff_mid]) and bottom half (y in
[staff_mid, staff_bottom]); template-match each connected component in each
half against the ten digit templates; concatenate the winning digits in
x-order to form the numerator and denominator integers.

Scope, honestly stated: this reads the time signature printed at the START of
a system. A mid-piece metre change would need re-triggering per system; that
is out of scope for close-prep (none of the close-prep fixtures contain one)
and is named here rather than silently assumed away.
"""
import os
import re
import json
import subprocess
import tempfile

import numpy as np
import cv2
from matplotlib.path import Path as MplPath

from rest_templates import _parse_path, VEROVIO_DIR  # reuse the SVG path parser + verovio location
from reader import nms  # reuse the same NMS used by detect_heads/detect_rests_multi

CACHE_PATH = os.path.expanduser("~/.cache/timesig_templates_leipzig.json")

DIGIT_CODEPOINTS = {str(d): f'U+{0xE080+d:04X}' for d in range(10)}
# PLUS GLYPH, added by Fable's ruling, 2026-07-29 (struck a′'s own
# restatement: "glyphs are identified by the matchTemplate plus NMS matcher
# run within component extents" had left the plus on the struck
# connected-component _find_plus_sign gate, the one glyph the strike did
# not cover). SMuFL "Time signatures" range, timeSigPlus, U+E08D -- the
# same range as timeSigX U+E080-U+E089 above. The anti-invention citation
# is SMuFL itself, not a measurement of this corpus.
DIGIT_CODEPOINTS['+'] = 'U+E08D'

_MEI_TEMPLATE = """<?xml version="1.0" encoding="UTF-8"?>
<mei xmlns="http://www.music-encoding.org/ns/mei" meiversion="4.0.1">
  <music><body><mdiv><score>
    <scoreDef><staffGrp>
      <staffDef n="1" lines="5" clef.shape="G" clef.line="2" meter.count="10" meter.unit="4"/>
    </staffGrp></scoreDef>
    <section>
      {measures}
    </section>
  </score></mdiv></body></music>
</mei>"""

_MEASURE_TEMPLATE = """<scoreDef meter.count="{count}" meter.unit="4"/>
      <measure n="{n}"><staff n="1"><layer n="1"><mRest/></layer></staff></measure>"""

_NODE_SCRIPT = """
import createVerovioModule from '{verovio_dir}/dist/verovio-module.mjs';
import {{ VerovioToolkit }} from '{verovio_dir}/dist/verovio.mjs';
import fs from 'node:fs';
const VerovioModule = await createVerovioModule();
const tk = new VerovioToolkit(VerovioModule);
const mei = fs.readFileSync('{mei_path}', 'utf8');
tk.loadData(mei);
tk.setOptions({{ scale: 100, pageWidth: 6000, pageHeight: 2000, adjustPageHeight: true,
                 breaks: 'none', svgRemoveXlink: true, svgFormatRaw: true }});
tk.redoLayout();
const svg = tk.renderToSVG(1);
fs.writeFileSync('{svg_path}', svg);
console.log('verovio', tk.getVersion());
"""

_CACHE = None


def _extract_from_svg(svg_text):
    paths = {}
    for name, cp in DIGIT_CODEPOINTS.items():
        hexcp = cp.replace('U+', '')
        m = re.search(r'<g id="' + hexcp + r'-[^"]*"><path transform="([^"]*)" d="([^"]*)"', svg_text)
        if not m:
            raise RuntimeError(f"codepoint {cp} (digit {name}) not found in rendered SVG defs")
        paths[name] = m.group(2)

    m = re.search(r'translate\([\d.,\s-]+\)\s*scale\(([\d.]+),\s*([\d.]+)\)', svg_text)
    if not m:
        raise RuntimeError("no glyph <use> transform found for scale calibration")
    use_scale = float(m.group(1))

    line_ys = sorted(set(int(y) for y in re.findall(r'<path d="M0 (\d+) L\d+ \1"', svg_text)))
    if len(line_ys) < 2:
        raise RuntimeError("could not find rendered staff-line paths for calibration")
    diffs = np.diff(np.array(line_ys, dtype=float))
    page_units_per_space = float(np.median(diffs))
    raw_units_per_space = page_units_per_space / use_scale
    return paths, raw_units_per_space, use_scale, page_units_per_space


def load_font(force=False):
    global _CACHE
    if not force and _CACHE is not None:
        return _CACHE
    if not force and os.path.exists(CACHE_PATH):
        with open(CACHE_PATH) as f:
            _CACHE = json.load(f)
        return _CACHE

    measures = []
    for d in range(10):
        measures.append(_MEASURE_TEMPLATE.format(count=d if d > 0 else 10, n=d + 1))
    # digit 0 alone is not a legal meter.count; render "10" for that measure and
    # separately force a lone "0" via a two-digit count "20" (tens digit already
    # covered by 10's '1'; ones digit '0' covered here) so every digit 0-9
    # appears at least once somewhere in the sequence of rendered numerators.
    measures.append(_MEASURE_TEMPLATE.format(count=20, n=11))
    # PLUS GLYPH (Fable's ruling, 2026-07-29). An additive meter.count, per
    # MEI's own convention, forces Verovio to emit the printed '+' between
    # its two numerals -- SMuFL timeSigPlus, U+E08D -- into the same
    # rendered SVG defs the digits are extracted from. "2+3" is arbitrary
    # only in its digit values (already covered above); what matters is
    # that a plus is printed at all. Same render pass, same font, same
    # calibration as every digit measure.
    measures.append(_MEASURE_TEMPLATE.format(count="2+3", n=12))
    mei = _MEI_TEMPLATE.format(measures="\n      ".join(measures))

    with tempfile.TemporaryDirectory() as td:
        mei_path = os.path.join(td, 'timesig.mei')
        svg_path = os.path.join(td, 'timesig.svg')
        js_path = os.path.join(td, 'render.mjs')
        with open(mei_path, 'w') as f:
            f.write(mei)
        with open(js_path, 'w') as f:
            f.write(_NODE_SCRIPT.format(verovio_dir=VEROVIO_DIR, mei_path=mei_path, svg_path=svg_path))
        r = subprocess.run(['node', js_path], capture_output=True, text=True, timeout=60)
        if r.returncode != 0:
            raise RuntimeError(f"verovio render failed (rc={r.returncode}): {r.stderr}")
        with open(svg_path) as f:
            svg_text = f.read()
        paths, raw_units_per_space, use_scale, page_units_per_space = _extract_from_svg(svg_text)
        verovio_version = r.stdout.strip()

    _CACHE = dict(
        paths=paths,
        raw_units_per_space=raw_units_per_space,
        use_scale=use_scale,
        page_units_per_space=page_units_per_space,
        source=(f"{verovio_version}; font=Leipzig (verovio default SMuFL font); "
                f"provenance={VEROVIO_DIR} (node_modules/verovio@6.2.0), timeSig0-9 and timeSigPlus "
                f"(U+E08D, added 2026-07-29, Fable's ruling) glyph outlines extracted from "
                f"VerovioToolkit.renderToSVG() with svgRemoveXlink+svgFormatRaw"),
    )
    os.makedirs(os.path.dirname(CACHE_PATH), exist_ok=True)
    with open(CACHE_PATH, 'w') as f:
        json.dump(_CACHE, f)
    return _CACHE


def _flatten_to_polygons(verts, codes, n_samples=12):
    """Convert a matplotlib-style (verts, codes) path -- which may contain
    CURVE3 (quadratic) and CURVE4 (cubic) bezier segments -- into a list of
    closed straight-edge polygons, one per subpath, by sampling curves.
    Needed by _fill_nonzero, which requires straight edges."""
    polygons = []
    cur_poly = []
    cur_pt = None
    i = 0
    n = len(codes)
    while i < n:
        code = codes[i]
        if code == MplPath.MOVETO:
            if len(cur_poly) > 1:
                polygons.append(np.array(cur_poly, dtype=float))
            cur_poly = [tuple(verts[i])]
            cur_pt = tuple(verts[i])
            i += 1
        elif code == MplPath.LINETO:
            cur_poly.append(tuple(verts[i]))
            cur_pt = tuple(verts[i])
            i += 1
        elif code == MplPath.CURVE3:
            p0, p1, p2 = np.array(cur_pt), np.array(verts[i]), np.array(verts[i + 1])
            for t in np.linspace(0, 1, n_samples)[1:]:
                pt = (1 - t) ** 2 * p0 + 2 * (1 - t) * t * p1 + t ** 2 * p2
                cur_poly.append(tuple(pt))
            cur_pt = tuple(p2)
            i += 2
        elif code == MplPath.CURVE4:
            p0, p1, p2, p3 = (np.array(cur_pt), np.array(verts[i]),
                               np.array(verts[i + 1]), np.array(verts[i + 2]))
            for t in np.linspace(0, 1, n_samples)[1:]:
                pt = ((1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * p1
                      + 3 * (1 - t) * t ** 2 * p2 + t ** 3 * p3)
                cur_poly.append(tuple(pt))
            cur_pt = tuple(p3)
            i += 3
        elif code == MplPath.CLOSEPOLY:
            if cur_poly:
                cur_poly.append(cur_poly[0])
            i += 1
        else:
            i += 1
    if len(cur_poly) > 1:
        polygons.append(np.array(cur_poly, dtype=float))
    return polygons


def _fill_nonzero(polygons, W, H):
    """Rasterize `polygons` (each a closed Nx2 polygon in pixel coordinates)
    with the standard NONZERO WINDING RULE scanline algorithm, so counters
    (holes) render correctly for glyphs like digits 0/6/8/9.

    This replaces MplPath.contains_points, which turned out (close-prep
    debugging, 2026-07-24) NOT to implement nonzero-winding hole
    subtraction at all: a minimal two-nested-squares test -- outer square
    plus an inner square subpath, tried at all four combinations of
    winding direction -- had contains_point() report the inner square's
    centre as "inside" in every case, i.e. it behaves as a plain union of
    the subpaths' filled interiors, never a hole. Rests never exercised
    this (no rest glyph has an enclosed counter), so the bug was silent
    until digit glyphs "8" (measured: rendered as one solid filled blob,
    both counters missing) exposed it. Nonzero winding is the correct
    fill rule here: SMuFL/font glyph outlines wind counters opposite to
    their outer contour specifically so a nonzero-winding fill punches
    the hole; even-odd would also happen to work for these simple
    non-self-intersecting contours, but nonzero is the rule the font
    format actually specifies."""
    img = np.zeros((H, W), dtype=np.uint8)
    edges = []
    for poly in polygons:
        for j in range(len(poly) - 1):
            x0, y0 = poly[j]
            x1, y1 = poly[j + 1]
            if y0 == y1:
                continue
            wind = 1
            if y0 > y1:
                wind = -1
                x0, y0, x1, y1 = x1, y1, x0, y0
            edges.append((y0, y1, x0, (x1 - x0) / (y1 - y0), wind))
    for row in range(H):
        y = row + 0.5
        xs = [(x0 + (y - y0) * slope, wind) for (y0, y1, x0, slope, wind) in edges if y0 <= y < y1]
        if not xs:
            continue
        xs.sort(key=lambda t: t[0])
        wnum = 0
        for k in range(len(xs) - 1):
            wnum += xs[k][1]
            if wnum != 0:
                c0 = max(0, int(np.ceil(xs[k][0] - 0.5)))
                c1 = min(W, int(np.floor(xs[k + 1][0] - 0.5)) + 1)
                if c1 > c0:
                    img[row, c0:c1] = 1
    return img


def render_digit(digit, s):
    """Rasterize digit (0-9, str or int) at staff-space size s (pixels).
    A time-signature numeral is TWO staff-spaces tall (spans the top or bottom
    half of the staff), unlike a rest glyph which is sized in normal notehead
    units -- Verovio/SMuFL author digits at a size matching that convention
    already, so we scale by the same raw_units_per_space/s ratio as rests.

    Uses the nonzero-winding scanline fill (_fill_nonzero), not
    MplPath.contains_points -- see _fill_nonzero's docstring for why."""
    font = load_font()
    name = str(digit)
    d = font['paths'][name]
    raw_units_per_space = font['raw_units_per_space']

    verts, codes = _parse_path(d)
    verts = verts.copy()
    verts[:, 1] *= -1.0

    scale = float(s) / raw_units_per_space
    verts *= scale

    minx, miny = verts.min(axis=0)
    maxx, maxy = verts.max(axis=0)
    pad = 1.0
    verts[:, 0] -= (minx - pad)
    verts[:, 1] -= (miny - pad)
    W = int(np.ceil(maxx - minx)) + 2
    H = int(np.ceil(maxy - miny)) + 2

    polygons = _flatten_to_polygons(verts, codes)
    return _fill_nonzero(polygons, W, H)


def render_plus_glyph(s):
    """Rasterize the printed time-signature '+' glyph (SMuFL timeSigPlus,
    U+E08D) at staff-space size s (pixels), through the EXACT SAME pipeline
    as render_digit: same font, same calibration (raw_units_per_space),
    same nonzero-winding fill rule. A thin, purely-for-readability wrapper
    around render_digit('+', s) -- render_digit itself is UNCHANGED and
    already resolves any glyph name present in font['paths'] via
    str(digit), so no new rasterization logic exists here.

    Fable's ruling, 2026-07-29: STRIKES the separate connected-component
    _find_plus_sign detector (metre.py). The plus is now identified by the
    SAME matchTemplate + NMS matcher as the digits, not by CC
    classification -- see _match_glyphs_in_band below."""
    return render_digit('+', s)


def _match_glyphs_in_band(band, s, glyph_names, thr=0.38, nms_rad_frac=1.0):
    """Sliding-window matched-filter glyph detection over `band` (a 2D 0/1
    array already restricted to one staff-half's rows), for every glyph
    name in `glyph_names` at once -- the SAME matchTemplate+NMS pattern
    already used for rests (detect_rests_multi, run_page2.py), not
    connected-component-then-classify (a CC-then-classify approach was
    tried first; sliding-window matching is more robust to touching ink
    between neighbouring glyphs since it does not depend on isolating a
    clean per-glyph bounding box first).

    EXTRACTED, 2026-07-29 (Fable's ruling), from what was `_digits_in_band`'s
    own body, so the plus glyph can compete in the SAME candidate pool and
    the SAME NMS pass as the digits, rather than being found by a separate,
    CC-based mechanism that does not share this robustness. `_digits_in_band`
    below now calls this with glyph_names=range(10), UNCHANGED in every
    observable way (same templates, same threshold, same NMS, same digit-only
    output shape) from its pre-extraction behaviour.

    thr=0.38, not the higher bars used elsewhere in this codebase (rests
    use 0.62, noteheads 0.84): measured directly on the two available
    fixtures with real time signatures. Glyphs with a simple stroke shape
    score high regardless of context ("1": 0.86-0.92, "4": 0.88, "8":
    0.83). Glyphs with a flowing calligraphic tail score meaningfully
    lower even when correctly matched, because the thin curled tail is
    disproportionately sensitive to sub-pixel misalignment under
    normalized cross-correlation on a binary mask, and score lower still
    when the search band's left edge clips a neighbouring key-signature
    accidental ("2" on piece 01 p1's "12/8", clean: 0.52; "2" on piece 02
    p1's "2/4" pickup, with a sharp sign's vertical stroke leaking into
    the band: 0.45). Both are still the clear argmax at their location by
    a healthy margin over the next-best wrong digit (piece 01: "2" 0.52 vs
    "4" 0.46; piece 02: "2" 0.45 vs "9" 0.39) -- 0.38 is set with margin
    below the lower of the two measured genuine matches, not tuned to
    force a single case through. The plus glyph shares this same threshold
    unchanged (Fable's ruling: "at the same threshold").

    Returns a list of (cx, label, score), left-to-right, after NMS collapses
    overlapping hits from different glyph templates at the same location to
    the single best-scoring one. `label` is an int 0-9 for a digit or the
    string '+' for the plus."""
    if band.size == 0:
        return []
    band_u8 = (band * 255).astype(np.uint8)
    bh, bw = band_u8.shape
    cands = []
    for name in glyph_names:
        tmpl = render_digit(name, s)
        th, tw = tmpl.shape
        if th > bh or tw > bw:
            continue
        tmpl_u8 = (tmpl * 255).astype(np.uint8)
        res = cv2.matchTemplate(band_u8, tmpl_u8, cv2.TM_CCOEFF_NORMED)
        ys, xs = np.where(res >= thr)
        for yy, xx in zip(ys, xs):
            cx, cy = xx + tw / 2.0, yy + th / 2.0
            cands.append(dict(x=cx, y=cy, score=float(res[yy, xx]), digit=name))
    if not cands:
        return []
    # V2, COINCIDENT-"1" ARBITRATION (Front 3a decision 1, as AMENDED by
    # Fable's V2 ruling of 2026-07-27; renamed from "1"-suppression, and its
    # previous rationale withdrawn as measured false -- see
    # _suppress_ones_in_clusters' docstring). Cluster radius 1.0s unchanged
    # and still SOURCED; the new constant is the score margin ONE_MARGIN.
    # A plus candidate here is just another non-'1' rival class: the
    # function's own `o['digit'] == 1` check already treats any non-1 label
    # (int or the '+' string) identically, so no change was needed to admit
    # the plus into this arbitration.
    cands = _suppress_ones_in_clusters(cands, s, cluster_rad_frac=1.0)
    if not cands:
        return []
    pts = [(c['x'], c['y']) for c in cands]
    sc = [c['score'] for c in cands]
    keep = nms(pts, sc, nms_rad_frac * s)
    out = [(cands[i]['x'], cands[i]['digit'], cands[i]['score']) for i in keep]
    out.sort(key=lambda t: t[0])
    return out


def _digits_in_band(band, s, thr=0.38, nms_rad_frac=1.0):
    """Digits only. UNCHANGED in every observable way since before the
    2026-07-29 extraction of _match_glyphs_in_band (same ten templates,
    same threshold, same NMS radius, same output shape): a thin call
    through to _match_glyphs_in_band with glyph_names=range(10). Existing
    callers (read_time_signature, read_time_signature_v2) are unaffected.

    Returns a list of (cx, digit, score), left-to-right; digit is always an
    int 0-9, never '+' (the plus never enters this glyph set)."""
    return _match_glyphs_in_band(band, s, range(10), thr, nms_rad_frac)


def _digits_and_plus_in_band(band, s, thr=0.38, nms_rad_frac=1.0):
    """Digits AND the plus, in one shared matchTemplate+NMS candidate pool
    (Fable's ruling, 2026-07-29: "glyphs are identified by the matchTemplate
    plus NMS matcher run within component extents" -- glyphs, plural,
    covering the plus as well as the digits, not the plus on a separate
    connected-component gate). Used by metre.py's step 1 detector
    (detect_start_of_bar_numerals) in place of the STRUCK _find_plus_sign.

    Returns a list of (cx, label, score), left-to-right; label is an int
    0-9 for a digit or the string '+' for the plus."""
    return _match_glyphs_in_band(band, s, list(range(10)) + ['+'], thr, nms_rad_frac)


# V2's score margin (Fable's V2 ruling, 2026-07-27). A digit-"1" candidate
# survives its cluster only if it outscores the best candidate of EVERY OTHER
# digit class there by at least this much.
#
# DERIVED, NOT TUNED, by the midpoint rule already used for FLAG_AREA_MAX:
#   must-suppress exemplar: close fixture sys0 start window, the ghost "1"
#     (0.6236, x=225.5..226.5) rides the foreign "4" (0.5119) and OUTSCORES
#     it; the "1" leads by 0.1117, and it must still be suppressed, so the
#     margin must exceed 0.1117.
#   must-keep exemplar: piece 01 p1 sys0 bar0 window, the true "1" of "12"
#     (0.8549, x=690.5) leads a same-font Leipzig ghost "4" (0.4636, x=686.5,
#     4.03 px = 0.192 staff-spaces away) by 0.3913, and it must be kept, so
#     the margin must not exceed 0.3913.
#   midpoint = (0.1117 + 0.3913) / 2 = 0.2515; guards 0.1398 on BOTH sides,
#     in dimensionless normalized-correlation units on a 0..1 scale.
#   empirically bisected at 0.0001 resolution: the three-page anchor sweep
#     reads all five printed signatures with zero wrong and zero spurious for
#     every M in [0.1118, 0.3913], and fails at 0.1117 and at 0.3914.
# RE-DERIVATION TRIGGER (ratified with the constant): if a future measured
# exemplar lands INSIDE [0.1117, 0.3913], M is re-derived as the midpoint of
# the narrowed interval and re-ratified. It is never nudged silently. If an
# exemplar ever inverts the interval (a must-suppress margin at or above a
# must-keep margin), G2 is falsified and the guard returns to Fable.
ONE_MARGIN = 0.2515


def _suppress_ones_in_clusters(cands, s, cluster_rad_frac=1.0, margin=None):
    """V2, COINCIDENT-"1" ARBITRATION (Front 3a decision 1 as amended by
    Fable's V2 ruling, 2026-07-27; ratified by Dann).

    Within an NMS cluster of radius cluster_rad_frac*s, a digit-"1" candidate
    is suppressed UNLESS its score exceeds the score of the best-scoring
    candidate of EVERY OTHER DIGIT CLASS in that cluster by at least `margin`
    (default ONE_MARGIN). A "1" with no rival of another digit class in its
    cluster is kept unconditionally, and the whole cluster is then left to
    V5; that case is load-bearing and is measured (the close fixture's
    final-barline ghost cluster is 47 "1" candidates and nothing else).

    Rationale: the "1" template is a bare vertical stroke and correlates with
    sub-strokes of wider digits IN ANY FONT, Leipzig's own included;
    conversely a wider digit's template can ride a true "1"'s stroke. Score
    dominance, not mere co-occurrence, is the signal that separates the true
    glyph from the rider.

    TWO WITHDRAWN CLAIMS, left visible rather than tidied away, per this
    project's standing practice:
      1. The pre-amendment guard's safety claim -- "It cannot mask a true '1',
         because adjacent true digits sit at least 1.5s apart centre to
         centre, so a true '1' never shares a cluster with a true neighbour"
         -- was the wrong safety condition. True NEIGHBOURS are indeed far
         apart, but a GHOST companion is not a neighbour, and piece 01 p1's
         ghost "4" sits 0.192 staff-spaces from the true "1" of its printed
         12/8. Unconditional suppression therefore deleted the true digit,
         the window read "42", V5 rejected numerator 42, and the page's
         metreAccuracy fell to 1/12.
      2. This guard has NO BARLINE FUNCTION, despite its history. Measured on
         the close fixture's final-barline ghost: V2 dropped 0 of 47 top-band
         and 0 of 53 bottom-band candidates, because no non-"1" digit clears
         threshold anywhere in that cluster, so the condition cannot fire.
         The barline ghost is killed by V5 alone, on two independent prongs
         (beat_type 1 is not in {2,4,8,16}; 0.690s is inside the 1.0s
         barline exclusion). Do not re-derive a barline rationale for V2, and
         do not delete either V5 prong on the belief that V2 covers it.

    KNOWN RESIDUAL RISK, recorded not fixed (Fable's ruling, point 6): a true
    "1" whose margin over a rider is below ONE_MARGIN is suppressed. On the
    measured corpus the resulting reading was always illegal and was rejected
    by V5, degrading to abstention or inheritance rather than to a confident
    wrong metre, but that is an observation, not a guarantee by construction.
    """
    if margin is None:
        margin = ONE_MARGIN
    rad = cluster_rad_frac * s
    out = []
    for c in cands:
        if c['digit'] == 1:
            best_rival = None
            for o in cands:
                if o is c or o['digit'] == 1:
                    continue
                if (o['x'] - c['x']) ** 2 + (o['y'] - c['y']) ** 2 < rad * rad:
                    if best_rival is None or o['score'] > best_rival:
                        best_rival = o['score']
            if best_rival is not None and (c['score'] - best_rival) < margin:
                continue
        out.append(c)
    return out


def read_time_signature(nl, staves, s, vocal_staff_idx, x_lo, x_hi):
    """Read the time signature printed in [x_lo, x_hi) on the staff at
    `vocal_staff_idx` (an index into `staves`, i.e. the ACTUAL staff row
    group, not a position in the `vocal` list). `nl` MUST be the staff-line-
    removed image (tier-1's single non-destructive removal) -- raw ink
    merges the digits and the staff lines into one connected component,
    since a time signature straddles all five lines.

    The numerator and denominator bands are cropped and template-matched
    SEPARATELY, split at the staff's geometric mid-line. An ink-count valley
    search (picking a split row near, but not at, the mid-line) was tried
    first, on the theory that the "2" numeral's downward tail touching the
    "8" denominator below it (no zero-ink row between them at all on piece
    01 p1's "12/8") meant the mid-line itself was contaminated. That theory
    was WRONG, and the valley search actively hurt (verified by sweeping
    every candidate split row: score at the geometric mid-line was 0.83,
    dropping to 0.30 by the valley search's chosen row eight rows below it).
    The real bug was upstream, in render_digit's rasterizer (see
    _fill_nonzero's docstring): it silently filled in the counters
    (holes) of digits like "8", "0", "6", "9" as solid blobs, so no split
    position could have matched well. With that fixed, the plain
    geometric mid-line -- which is where SMuFL actually centres the
    numerator/denominator, per the module docstring -- is the correct,
    simplest split; the small amount of touching ink at the mid-line
    does not meaningfully hurt a correctly-shaped template's match score.

    Returns (beats, beat_type) or (None, None) if nothing legible is found
    -- ABSTAIN beats guess (T6)."""
    st = staves[vocal_staff_idx]
    top, bot = st[0], st[-1]
    mid = (top + bot) / 2.0
    # Padding must leave room for a full digit template (~2.1*s tall, see
    # _digits_in_band's gate note) on BOTH sides of the split.
    band_top = int(top - 0.5 * s)
    band_bot = int(bot + 0.6 * s)
    split_abs = int(mid)
    if band_top >= split_abs or split_abs >= band_bot:
        return None, None
    top_band = (nl[band_top:split_abs, int(x_lo):int(x_hi)] > 0).astype(np.uint8)
    bot_band = (nl[split_abs:band_bot, int(x_lo):int(x_hi)] > 0).astype(np.uint8)
    top_digits = _digits_in_band(top_band, s)
    bot_digits = _digits_in_band(bot_band, s)
    if not top_digits or not bot_digits:
        return None, None
    beats = int(''.join(str(d) for _, d, _ in top_digits))
    beat_type = int(''.join(str(d) for _, d, _ in bot_digits))
    return beats, beat_type


# ---------------------------------------------------------------------------
# Front 3a decision 1: the generalized anchor search with the V1-V5
# validation stack. read_time_signature above (V1 plus, now, V2) stays as
# the single-window narrow reader it always was, used by read_page_metre's
# legacy call site so confident records stay byte-identical (brief item 2,
# spec Item A decision 1). The functions below are the NEW generalized
# search: multiple windows per system (W-start, W-bar(k) for every barline
# including the final one), each validated by V3 (grouping), V4 (stack
# pairing), and V5 (legality + barline exclusion), all SOURCED measured
# constants from the spec, none tuned here.
# ---------------------------------------------------------------------------

GROUP_GAP_FRAC = 2.0       # V3: max in-group digit spacing, staff-spaces
PAIR_ALIGN_FRAC = 0.35     # V4: top/bottom stack-centre alignment tolerance
BARLINE_EXCLUDE_FRAC = 1.0  # V5: minimum stack-centre distance from a barline
LEGAL_BEAT_TYPES = {2, 4, 8, 16}   # V5
LEGAL_NUMERATOR_RANGE = (1, 15)    # V5


def _group_digits(digits, s, group_gap_frac=GROUP_GAP_FRAC):
    """V3, grouping. `digits` is a left-to-right sorted (x, digit, score)
    list (already page-absolute x). A gap > group_gap_frac*s between
    consecutive digit centres starts a new group. Measured: in-group
    spacing 1.6s ("12"); distinct-group spacings 2.1s+ and 3.2s."""
    if not digits:
        return []
    groups = [[digits[0]]]
    for d in digits[1:]:
        if d[0] - groups[-1][-1][0] <= group_gap_frac * s:
            groups[-1].append(d)
        else:
            groups.append([d])
    return groups


def _group_value(group):
    """(integer value, summed score, x-centre) for a digit group."""
    value = int(''.join(str(d[1]) for d in group))
    score = sum(d[2] for d in group)
    centre = (group[0][0] + group[-1][0]) / 2.0
    return value, score, centre


def _validate_stacks(top_groups, bot_groups, s, barline_xs,
                      pair_align_frac=PAIR_ALIGN_FRAC,
                      barline_excl_frac=BARLINE_EXCLUDE_FRAC):
    """V4 (stack pairing, 0.35s alignment) then V5 (legality: beat_type in
    {2,4,8,16}, numerator 1..15; barline exclusion, stack centre >= 1.0s
    from any detected barline). Returns validated stacks, highest-summed-
    score first."""
    out = []
    for tg in top_groups:
        tval, tscore, tcx = _group_value(tg)
        for bg in bot_groups:
            bval, bscore, bcx = _group_value(bg)
            if abs(tcx - bcx) > pair_align_frac * s:
                continue
            if not (LEGAL_NUMERATOR_RANGE[0] <= tval <= LEGAL_NUMERATOR_RANGE[1]):
                continue
            if bval not in LEGAL_BEAT_TYPES:
                continue
            centre = (tcx + bcx) / 2.0
            if barline_xs:
                min_d = min(abs(centre - bx) for bx in barline_xs)
                if min_d < barline_excl_frac * s:
                    continue
            out.append(dict(beats=tval, beat_type=bval, score=tscore + bscore, centre=centre))
    out.sort(key=lambda c: -c['score'])
    return out


def read_time_signature_v2(nl, staves, s, vocal_staff_idx, x_lo, x_hi, barline_xs=None):
    """Decision 1's validated read: same top/bottom band split as
    read_time_signature, but candidates go through the full V1-V5 stack
    (V1/V2 inside _digits_in_band, V3/V4/V5 here) instead of naive
    left-to-right concatenation. Returns (beats, beat_type, flagged):
    flagged is True iff more than one stack survived validation (a
    tripwire, per the spec, never measured to actually fire)."""
    st = staves[vocal_staff_idx]
    top, bot = st[0], st[-1]
    mid = (top + bot) / 2.0
    band_top = int(top - 0.5 * s)
    band_bot = int(bot + 0.6 * s)
    split_abs = int(mid)
    if band_top >= split_abs or split_abs >= band_bot:
        return None, None, False
    x_lo_i, x_hi_i = int(x_lo), int(x_hi)
    if x_hi_i <= x_lo_i:
        return None, None, False
    top_band = (nl[band_top:split_abs, x_lo_i:x_hi_i] > 0).astype(np.uint8)
    bot_band = (nl[split_abs:band_bot, x_lo_i:x_hi_i] > 0).astype(np.uint8)
    top_digits = [(x + x_lo_i, d, sc) for x, d, sc in _digits_in_band(top_band, s)]
    bot_digits = [(x + x_lo_i, d, sc) for x, d, sc in _digits_in_band(bot_band, s)]
    if not top_digits or not bot_digits:
        return None, None, False
    top_groups = _group_digits(top_digits, s)
    bot_groups = _group_digits(bot_digits, s)
    stacks = _validate_stacks(top_groups, bot_groups, s, barline_xs or [])
    if not stacks:
        return None, None, False
    flagged = len(stacks) > 1
    best = stacks[0]
    return best['beats'], best['beat_type'], flagged


def search_system_signatures(nl, staves, s, vocal_staff_idx, staff_left_x,
                              barline_xs, page_width, w_bar_width_frac=6.0):
    """Decision 1's anchor set for ONE system: W-start (staff left edge to
    the first barline) plus W-bar(k) after EVERY detected barline, including
    the system's final barline (Gould's cautionary position, p. 152). Width
    6s past a barline, per read_page_metre's original measured docstring.

    Returns a list of dicts, one per window that yields a validated
    signature: {window, is_final_barline, x_lo, x_hi, beats, beat_type,
    flagged}. `window` is 'start' or an integer k (index into barline_xs).
    Binding rule (spec decision 1) on how a hit maps to a measure index is
    the caller's job (envelope.py), since it needs page/system-level
    knowledge this function does not have."""
    windows = []
    first_bar = barline_xs[0] if barline_xs else None
    if first_bar is not None and first_bar > staff_left_x:
        windows.append(('start', staff_left_x, first_bar, False))
    n = len(barline_xs)
    for k, bx in enumerate(barline_xs):
        x_hi = min(page_width, bx + w_bar_width_frac * s)
        windows.append((k, bx, x_hi, k == n - 1))
    hits = []
    for name, x_lo, x_hi, is_final in windows:
        beats, beat_type, flagged = read_time_signature_v2(nl, staves, s, vocal_staff_idx, x_lo, x_hi, barline_xs)
        if beats is not None:
            hits.append(dict(window=name, is_final_barline=is_final, x_lo=x_lo, x_hi=x_hi,
                              beats=beats, beat_type=beat_type, flagged=flagged))
    return hits
