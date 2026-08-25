"""clefkey.py -- N.97: THE CLEF AND KEY-SIGNATURE READ.

Memo N.95 measured that 11 of the reader's 13 notehead false positives on the
Lamm scan sit on clef and key-signature ink. The notehead matched filter fires
on a G clef's bowl and on a sharp's lozenges, and nothing upstream of it knows
that ink is not a note. This module reads those two glyph groups off the page
with the SAME font-template machinery already built for rests
(rest_templates.py) and time-signature numerals (timesig.py) -- Verovio driving
real Leipzig glyph outlines, rasterized deterministically, matched by
matchTemplate plus NMS. No training; classical template matching, the precedent
class already accepted for rests, digits, and the accidental engine.

Two products, and they are separate on purpose:

  1. `read_system_clef_key` returns what is PRINTED at the start of one system:
     a clef sign and line, and a key-signature fifths count. This is the read
     the intake prompt pre-fills with.
  2. `clef_key_spans` returns, per system, the x range that clef and key ink
     occupies. `reader.read_page_geometry` subtracts that range from notehead
     candidacy, which is the false-positive repair.

SMuFL codepoints used, per SMuFL 1.4:
  clefs        gClef U+E050, gClef8vb U+E052, fClef U+E062, cClef U+E05C
  accidentals  accidentalFlat U+E260, accidentalNatural U+E261,
               accidentalSharp U+E262

SCOPE, STATED RATHER THAN ASSUMED AWAY. This reads the clef and key signature
printed at the START of a system, which is where Gould puts them and where every
page of this corpus prints them. A mid-system clef change, a mid-piece key
change, and a cautionary signature at a system end are all out of scope and are
not detected. The reader has never attempted them either, so nothing regresses;
the limitation is named here rather than discovered later.

A PLAIN G CLEF DOES NOT ESTABLISH SOUNDING OCTAVE. Tenor parts print a plain
treble clef and sound an octave lower, and only some editions print the small 8.
This module reports the GLYPH it matched and nothing more: gClef8vb means the
8-bearing glyph was matched, and gClef means it was not. Choosing an octave from
that is the caller's job, and on the intake prompt it stays the singer's.
"""
import os
import re
import json
import subprocess
import tempfile

import numpy as np
import cv2

from rest_templates import _parse_path, VEROVIO_DIR   # SVG path parser + verovio location
from timesig import _flatten_to_polygons, _fill_nonzero   # the nonzero-winding rasterizer
from reader import nms                                    # the same NMS every matcher uses

CACHE_PATH = os.path.expanduser("~/.cache/clefkey_templates_leipzig.json")

CLEF_CODEPOINTS = {
    'gClef': 'U+E050',
    'gClef8vb': 'U+E052',
    'fClef': 'U+E062',
    'cClef': 'U+E05C',
}
ACCIDENTAL_CODEPOINTS = {
    'flat': 'U+E260',
    'natural': 'U+E261',
    'sharp': 'U+E262',
}
GLYPH_CODEPOINTS = dict(CLEF_CODEPOINTS, **ACCIDENTAL_CODEPOINTS)

# What each clef glyph MEANS, as the (sign, line) pair `reader.clef_topD`
# already speaks. The octave the 8 implies is deliberately NOT here: see the
# module docstring.
CLEF_MEANING = {
    'gClef': ('G', 2),
    'gClef8vb': ('G', 2),
    'fClef': ('F', 4),
    'cClef': ('C', 3),
}

# ONE STAFF PER CLEF, all four on one page. A clef printed at a system start is
# full size; a clef change written mid-staff is drawn cue-size by Verovio, which
# would rasterize a template the page never prints. Four staves in one staffGrp
# keeps every clef at a system start. The four accidentals ride on staff 1 as
# ordinary note accidentals, which is the same glyph the key signature prints.
_MEI_TEMPLATE = """<?xml version="1.0" encoding="UTF-8"?>
<mei xmlns="http://www.music-encoding.org/ns/mei" meiversion="4.0.1">
  <music><body><mdiv><score>
    <scoreDef><staffGrp>
      <staffDef n="1" lines="5" clef.shape="G" clef.line="2"/>
      <staffDef n="2" lines="5" clef.shape="G" clef.line="2" clef.dis="8" clef.dis.place="below"/>
      <staffDef n="3" lines="5" clef.shape="F" clef.line="4"/>
      <staffDef n="4" lines="5" clef.shape="C" clef.line="3"/>
    </staffGrp></scoreDef>
    <section><measure n="1">
      <staff n="1"><layer n="1">
        <note dur="4" oct="4" pname="c" accid="s"/>
        <note dur="4" oct="4" pname="d" accid="f"/>
        <note dur="4" oct="4" pname="e" accid="n"/>
        <note dur="4" oct="4" pname="f"/>
      </layer></staff>
      <staff n="2"><layer n="1"><mRest/></layer></staff>
      <staff n="3"><layer n="1"><mRest/></layer></staff>
      <staff n="4"><layer n="1"><mRest/></layer></staff>
    </measure></section>
  </score></mdiv></body></music>
</mei>"""

_NODE_SCRIPT = """
import createVerovioModule from '{verovio_dir}/dist/verovio-module.mjs';
import {{ VerovioToolkit }} from '{verovio_dir}/dist/verovio.mjs';
import fs from 'node:fs';
const VerovioModule = await createVerovioModule();
const tk = new VerovioToolkit(VerovioModule);
const mei = fs.readFileSync('{mei_path}', 'utf8');
tk.loadData(mei);
tk.setOptions({{ scale: 100, pageWidth: 6000, pageHeight: 3000, adjustPageHeight: true,
                 breaks: 'none', svgRemoveXlink: true, svgFormatRaw: true }});
tk.redoLayout();
const svg = tk.renderToSVG(1);
fs.writeFileSync('{svg_path}', svg);
console.log('verovio', tk.getVersion());
"""

_CACHE = None
_TEMPLATES = {}


def _extract_from_svg(svg_text):
    """Pull each glyph's raw path `d` string plus the page calibration out of a
    verovio SVG render. Identical in shape to rest_templates' and timesig's own
    extractors; the median over ALL rendered staff-line spacings is taken, so
    the four large between-staff gaps do not move it (16 of the 19 diffs on this
    render are the staff space itself)."""
    paths = {}
    for name, cp in GLYPH_CODEPOINTS.items():
        hexcp = cp.replace('U+', '')
        m = re.search(r'<g id="' + hexcp + r'-[^"]*"><path transform="([^"]*)" d="([^"]*)"', svg_text)
        if not m:
            raise RuntimeError(f"codepoint {cp} ({name}) not found in rendered SVG defs")
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
    """Render (or load cached) Leipzig clef and accidental outlines via verovio.

    The cache hit returns BEFORE any subprocess is reached, which is what lets
    this module run inside Pyodide where there is no Node and no Verovio -- the
    same contract rest_templates and timesig already hold to."""
    global _CACHE
    if not force and _CACHE is not None:
        return _CACHE
    if not force and os.path.exists(CACHE_PATH):
        with open(CACHE_PATH) as f:
            _CACHE = json.load(f)
        return _CACHE

    with tempfile.TemporaryDirectory() as td:
        mei_path = os.path.join(td, 'clefkey.mei')
        svg_path = os.path.join(td, 'clefkey.svg')
        js_path = os.path.join(td, 'render.mjs')
        with open(mei_path, 'w') as f:
            f.write(_MEI_TEMPLATE)
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
                f"provenance={VEROVIO_DIR} (node_modules/verovio@6.2.0), gClef U+E050, "
                f"gClef8vb U+E052, fClef U+E062, cClef U+E05C, accidentalFlat U+E260, "
                f"accidentalNatural U+E261 and accidentalSharp U+E262 glyph outlines "
                f"extracted from VerovioToolkit.renderToSVG() with svgRemoveXlink+svgFormatRaw"),
    )
    os.makedirs(os.path.dirname(CACHE_PATH), exist_ok=True)
    with open(CACHE_PATH, 'w') as f:
        json.dump(_CACHE, f)
    return _CACHE


def render_glyph(name, s):
    """Rasterize glyph `name` at staff-space size s (pixels), and return
    (ink, y_origin): `ink` is the binary array, `y_origin` is how far the
    glyph's own origin (the font's y=0, which every SMuFL glyph places on the
    staff line it is anchored to) sits BELOW the top of that array.

    y_origin is what lets a caller place the template vertically from staff
    geometry instead of searching for it: a G clef's origin is the line it
    curls around (line 2 counting up, the second line from the bottom), an
    F clef's is line 4, a C clef's is its centre line, and an accidental's is
    the line or space it alters.

    Same pipeline as timesig.render_digit: same font, same
    raw_units_per_space calibration, same nonzero-winding scanline fill (which
    a clef needs and a rest does not -- the G clef's bowl is a counter, and
    matplotlib's containment test would fill it solid; see _fill_nonzero's
    docstring in timesig.py)."""
    key = (name, round(float(s), 3))
    if key in _TEMPLATES:
        return _TEMPLATES[key]
    font = load_font()
    d = font['paths'][str(name)]
    raw_units_per_space = font['raw_units_per_space']

    verts, codes = _parse_path(d)
    verts = verts.copy()
    verts[:, 1] *= -1.0                      # verovio wraps each def in scale(1,-1)

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
    ink = _fill_nonzero(polygons, W, H)
    # After the y-flip the font's y=0 sits at -miny from the array top, plus the
    # same one-pixel pad every axis got.
    y_origin = float(-miny + pad)
    _TEMPLATES[key] = (ink, y_origin)
    return ink, y_origin


# ---------------------------------------------------------------------------
# Where the glyphs sit, from the staff's own geometry
# ---------------------------------------------------------------------------

def _origin_row(st, line):
    """The image row of the staff line a clef anchors to. `line` counts from
    the BOTTOM, the way `reader.clef_topD` already speaks (G clef line 2, F
    clef line 4, C clef line 3), and `st` is the five detected line rows top
    to bottom, so bottom-counted line L is st[5 - L]."""
    return float(st[5 - line])


def _half_space(st):
    """Half a staff space in pixels, measured on THIS staff rather than taken
    from the page's s -- the same quantity `reader.position` uses to turn a
    row into a staff degree, and computed the same way."""
    return float(np.median(np.diff(np.array(st, dtype=float)))) / 2.0


def _row_of_degree(st, topD, degree):
    """The image row of a staff degree, inverting `reader.position`: that
    function computes off = round((top - y) / half) and d = topD + off, so
    y = top - (d - topD) * half."""
    return float(st[0]) - (degree - topD) * _half_space(st)


# THE KEY SIGNATURE'S OWN GEOMETRY (Gould, Behind Bars, key signatures).
#
# The accidentals of a key signature are printed in a fixed order -- F C G D A
# E B for sharps, its reverse for flats, which `reader.SHARP_ORDER` and
# `reader.FLAT_ORDER` already carry -- at fixed staff positions. Those
# positions are NOT free: the first accidental takes the highest octave of its
# letter that still sits at or below the top staff line, and each one after it
# steps by a fixed interval pattern, down a fourth then up a fifth then down a
# fourth, and so on. That pattern is the same for every clef; only the starting
# octave moves, and the "at or below the top line" rule moves it correctly.
#
# Checked against the printed convention for all three clefs this module reads:
#   treble  sharps F5 C5 G5 D5 A4 E5 B4   flats B4 E5 A4 D5 G4 C5 F4
#   bass    sharps F3 C3 G3 D3 A2 E3 B2   flats B2 E3 A2 D3 G2 C3 F2
#   alto    sharps F4 C4 G4 D4 A3 E4 B3   flats B3 E4 A3 D4 G3 C4 F3
#
# This is what makes the read structural rather than a score contest: the
# reader knows the clef, so it knows exactly which row each successive
# accidental must occupy, and asks the page whether that glyph is printed
# there. A sharp found at the wrong row is not a key signature.
_SHARP_STEPS = (-3, +4, -3, -3, +4, -3)
_FLAT_STEPS = (+3, -4, +3, +3, -4, +3)


def key_signature_degrees(kind, topD):
    """The seven staff degrees a `kind` ('sharp' or 'flat') key signature
    occupies, in printed order, for a staff whose top line is degree `topD`."""
    letter = 'F' if kind == 'sharp' else 'B'
    from reader import LETIDX
    # The highest octave of `letter` that sits at or below the top line.
    octave = (topD - LETIDX[letter]) // 7
    d = LETIDX[letter] + 7 * octave
    steps = _SHARP_STEPS if kind == 'sharp' else _FLAT_STEPS
    out = [d]
    for st in steps:
        d += st
        out.append(d)
    return out


# ---------------------------------------------------------------------------
# The measured constants
# ---------------------------------------------------------------------------

# ROW TOLERANCE for every glyph match, in staff spaces. A clef and a key
# signature are anchored to staff lines the reader has already detected, so the
# row is PREDICTED and only a small slop needs searching. Measured across the
# whole corpus (23 render pages, 29 systems, plus both Lamm scan pages, 6
# systems), the winning clef's match landed between 5 rows above and 2 rows
# below its predicted origin: 0.167 staff spaces at the scan's s=30, 0.095 at
# the renders' s=21. 0.6 is 3.6x the largest measured deviation and, more
# importantly, is STRUCTURALLY bounded below 1.0: a tolerance of a whole staff
# space would let a template slide onto the next line and read a different clef
# line as a match. It is the slop that has to stay small, not the search.
GLYPH_ROW_TOLERANCE = 0.6      # * s

# CLEF ACCEPTANCE. Below this the clef read ABSTAINS (T6) and the caller falls
# back to asking. DERIVED by the midpoint rule already used for FLAG_AREA_MAX
# and ONE_MARGIN, over every system of the whole corpus with the row tolerance
# above applied:
#   lowest CORRECT clef match:  0.391 (Lamm scan page 2, system 0, gClef)
#   highest WRONG clef match:   0.334 (Lamm scan page 2, system 1, fClef)
#   midpoint = (0.334 + 0.391) / 2 = 0.3625 -> 0.36
#   guards: 0.36 - 0.334 = 0.026 above every wrong value;
#           0.391 - 0.36 = 0.031 below the lowest correct one.
# The render corpus is nowhere near this bar (correct 0.894-0.946, wrong
# 0.103-0.334), so the whole interval is set by the scan. The guards are
# thinner than FLAG_AREA_MAX's, and that is stated rather than hidden: the
# scan's printed ink correlates far worse against a clean font outline than a
# rendered page's does. What sits under the bar abstains, so the cost of the
# thin guard is a prompt that asks instead of confirming, never a wrong clef
# asserted.
#
# THE CLEF ITSELF IS CHOSEN BY ARGMAX, not by this bar: on all 35 systems of
# the corpus the printed clef is the highest-scoring template, and its margin
# over the next-best WRONG clef never falls below 0.077 (Lamm page 2 systems 0
# and 1; every render page clears 0.6).
CLEF_MATCH_MIN = 0.36

# THE 8 UNDER A G CLEF. gClef8vb contains the whole gClef plus the numeral, so
# the two templates score within 0.02 of each other on a plain G clef and the
# argmax between them is a coin toss -- measured, not feared: on
# sunless-03 the 8-bearing glyph won by 0.004 on one system and lost by 0.007
# on the next. The numeral is therefore tested on its OWN ink, by matching the
# rows of the 8vb template that lie below the plain gClef's height, anchored at
# the matched clef.
#   8 PRINTED (sunless-02, -03, -05: 26 systems):        0.880 to 0.925
#   8 NOT PRINTED (sunless-04, -06 G systems, Lamm: 20): 0.132 to 0.255
#   midpoint = (0.255 + 0.880) / 2 = 0.5675 -> 0.57
#   guards: 0.315 below every printed value, 0.315 above every absent one.
# sunless-06 is the case that proves the domain point: its fixture config
# carries octaveChange -1, and its renders print a PLAIN G clef. The glyph does
# not establish the octave, which is why this module reports the glyph and
# leaves the octave to the singer.
EIGHT_MATCH_MIN = 0.57


# ---------------------------------------------------------------------------
# The read
# ---------------------------------------------------------------------------

def _best_match(nl, tmpl, x_lo, x_hi, y_lo, y_hi):
    """Best normalized-correlation match of `tmpl` with its top-left corner
    anywhere in [x_lo, x_hi] x [y_lo, y_hi]. Returns (score, x, y) of that
    corner, or None if the window cannot hold the template.

    TM_CCOEFF_NORMED on a binary mask, the same matcher rests, digits, and the
    plus glyph already use."""
    th, tw = tmpl.shape
    y0 = max(0, int(y_lo)); y1 = min(nl.shape[0], int(y_hi) + th)
    x0 = max(0, int(x_lo)); x1 = min(nl.shape[1], int(x_hi) + tw)
    if y1 - y0 < th or x1 - x0 < tw:
        return None
    band = (nl[y0:y1, x0:x1] * 255).astype(np.uint8)
    res = cv2.matchTemplate(band, (tmpl * 255).astype(np.uint8), cv2.TM_CCOEFF_NORMED)
    _, score, _, loc = cv2.minMaxLoc(res)
    return float(score), loc[0] + x0, loc[1] + y0


def read_clef(nl, st, s, staff_left_x, search_spaces=6.0):
    """The clef printed at the start of one staff.

    Returns a dict {glyph, sign, line, ottavaGlyph, score, x, x_right} or None
    if nothing clears CLEF_MATCH_MIN -- ABSTAIN beats guess (T6).

    `nl` MUST be the staff-line-removed raster: a clef straddles all five lines,
    and on the raw image its ink and the lines are one connected mass. Each of
    the three clef families is matched at the row its own anchor line predicts,
    within GLYPH_ROW_TOLERANCE, and the highest scorer wins. The 8 is then
    tested separately on its own ink (see EIGHT_MATCH_MIN)."""
    best = None
    for glyph in ('gClef', 'fClef', 'cClef'):
        tmpl, y_origin = render_glyph(glyph, s)
        sign, line = CLEF_MEANING[glyph]
        row = _origin_row(st, line) - y_origin
        m = _best_match(nl, tmpl, staff_left_x - 0.6 * s, staff_left_x + search_spaces * s,
                        row - GLYPH_ROW_TOLERANCE * s, row + GLYPH_ROW_TOLERANCE * s)
        if m is None:
            continue
        if best is None or m[0] > best[0][0]:
            best = (m, glyph, tmpl.shape)
    if best is None or best[0][0] < CLEF_MATCH_MIN:
        return None
    (score, mx, my), glyph, (th, tw) = best
    ottava = False
    if glyph == 'gClef':
        eight, _ = render_glyph('gClef8vb', s)
        plain, _ = render_glyph('gClef', s)
        numeral = eight[plain.shape[0]:, :]
        if numeral.shape[0] > 2:
            m = _best_match(nl, numeral, mx - 0.3 * s, mx + 0.3 * s,
                            my + plain.shape[0] - 0.3 * s, my + plain.shape[0] + 0.3 * s)
            ottava = bool(m is not None and m[0] >= EIGHT_MATCH_MIN)
    sign, line = CLEF_MEANING[glyph]
    row = _origin_row(st, line) - render_glyph(glyph, s)[1]
    return dict(glyph=('gClef8vb' if ottava else glyph), sign=sign, line=line,
                ottavaGlyph=ottava, score=score, x=int(mx), x_right=int(mx + tw),
                rowadj=float(my - row))


# THE KEY SIGNATURE'S OWN SEARCH BOUNDS, in staff spaces, all measured over
# the whole corpus (23 render pages, 29 systems, plus both Lamm scan pages, 6
# systems; 232 printed key-signature accidentals in total).
#
# A key signature ABUTS ITS CLEF and its accidentals abut each other. Measured
# gap from the clef's right edge to the first accidental's left edge: 0.87 to
# 1.14. Measured gap from one accidental's right edge to the next one's left
# edge: 0.10 to 0.47. KEY_FIRST_GAP_MAX and KEY_GAP_MAX are those maxima with
# headroom (1.23x and 1.70x). They are what stops the run walking off into the
# time signature and the first notes, which is where every large false match on
# this corpus lives.
KEY_FIRST_GAP_MAX = 1.4
KEY_GAP_MAX = 0.8
KEY_SEARCH_SPACES = 9.0   # * s, hard cap past the clef, before any barline cap

# ACCIDENTAL ROW TOLERANCE, and why it is FIVE TIMES TIGHTER than the clef's.
# A sharp is a lattice of repeating strokes, so its own template correlates
# with itself shifted by a staff step. A tolerance that reaches a whole staff
# step therefore lets accidental n match the ink of accidental n-1 one degree
# away, which is not a hypothesis: at 0.6 the seven-sharp signatures of
# sunless-06 derailed on their second accidental (dy -8 px) and read 4 sharps
# instead of 7 on 8 of 26 systems. The bound is structural: it must stay well
# under half a staff step, 0.25s, or a neighbouring degree is reachable.
#
# The residual it has to cover is small because the row is calibrated on the
# clef this system actually printed: `read_clef` returns `rowadj`, the offset
# between where the clef's anchor line was predicted and where its ink was
# found, and the key signature is searched at the same offset. The clef and the
# key signature come off one plate on one baseline, so the clef's own answer to
# "where does this staff's ink really sit" is the right correction for the
# accidentals beside it. With it applied, every one of the 232 printed
# accidentals lands within 3 px of prediction (0.10 staff spaces at the scan's
# s=30, 0.095 at the renders' s=21). 0.15 is 50 percent above that and 40
# percent below the 0.25 structural ceiling.
ACCIDENTAL_ROW_TOLERANCE = 0.15   # * s

# KEY-SIGNATURE ACCEPTANCE, AS A RATIO TO THIS SYSTEM'S OWN CLEF MATCH.
#
# No absolute score can serve both corpora, for the reason the flag threshold
# already found: a printed 1931 plate correlates far worse against a clean font
# outline than a rendered page does. Measured, the two populations overlap
# outright on absolute score -- true scan accidentals 0.298 to 0.492, false
# render matches up to 0.600 -- so an absolute bar either loses the scan or
# admits the renders' noise.
#
# The page supplies its own calibration, and it is already computed: the clef
# is the SAME font, the SAME rasterizer, and the SAME ink, a few staff spaces
# to the left. Dividing by its match score asks "does this glyph match as well
# as the clef beside it did", which is a question the page can answer about
# itself, with no ground truth and no per-corpus constant. Same species of move
# as `run_page2._derive_flag_boundary`, which derives its boundary from the
# page's own note population.
#   lowest TRUE ratio:  0.698 (Lamm scan page 2, system 2, second sharp)
#   highest FALSE ratio: 0.635 (Lamm scan page 1, system 0, a flat-run second
#     position on a system whose printed signature is two sharps)
#   midpoint = (0.635 + 0.698) / 2 = 0.6665 -> 0.67
#   guards: 0.035 above every false value, 0.028 below the lowest true one.
# The guards are thin, and that is stated rather than hidden. What sits under
# the bar abstains, and an abstention falls back to the prompt that asks, so
# the cost of the thin guard is a question, not a wrong key signature.
KEY_MATCH_RATIO_MIN = 0.67

# NATURALS ARE NOT MATCHED, and that is a decision rather than an omission.
# The natural glyph is a lattice of the same shape as a sharp, and matching it
# produced the single worst false population measured in this work: on the Lamm
# scan a natural template scored 0.997 of the clef's own score on ink that is a
# printed SHARP. Dropping the branch also happens to be the more correct read,
# not merely the safer one: a cancellation printed as naturals announces a key
# with FEWER accidentals, so counting only the sharps or flats that remain
# gives the new key's own fifths, which is the number the caller wants. A
# signature of naturals alone is C major, and reads here as fifths 0.


def _accidental_run(nl, st, s, topD, kind, degrees, x_lo, x_hi, clef_score, rowadj=0.0):
    """How many accidentals of `kind` are printed, in order, at the rows
    `degrees` names, starting from x_lo. Returns (list of matches, right edge).

    Stops at the first position whose glyph is not there, which is what makes a
    two-sharp signature read as two and not as two-plus-noise: each accidental
    must clear KEY_MATCH_RATIO_MIN of `clef_score` AND sit within the measured
    gap of the glyph before it."""
    tmpl, y_origin = render_glyph(kind, s)
    th, tw = tmpl.shape
    thr = KEY_MATCH_RATIO_MIN * clef_score
    got = []
    cursor = float(x_lo)
    for d in degrees:
        gap = (KEY_FIRST_GAP_MAX if not got else KEY_GAP_MAX) * s
        row = _row_of_degree(st, topD, d) - y_origin + rowadj
        m = _best_match(nl, tmpl, cursor, min(cursor + gap, x_hi),
                        row - ACCIDENTAL_ROW_TOLERANCE * s, row + ACCIDENTAL_ROW_TOLERANCE * s)
        if m is None or m[0] < thr:
            break
        got.append(dict(score=m[0], x=m[1], y=m[2], degree=d))
        cursor = m[1] + tw
    right = int(got[-1]['x'] + tw) if got else int(x_lo)
    return got, right


def read_key_signature(nl, st, s, topD, x_lo, x_hi, clef_score, rowadj=0.0):
    """The key signature printed between x_lo and x_hi on one staff.

    Returns a dict {fifths, kind, count, right, scores, abstain}. `fifths` is
    None when the read abstains, and the reason is in `abstain`; 0 means the
    page prints no key signature, which is a positive read and not an
    abstention.

    Both orders are tried, sharps at the sharp order's rows and flats at the
    flat order's rows, and the longer run wins. A tie at a nonzero length
    cannot happen on a printed page and abstains here rather than picking one
    -- it has never fired on this corpus."""
    sharps, sharp_right = _accidental_run(nl, st, s, topD, 'sharp',
                                          key_signature_degrees('sharp', topD),
                                          x_lo, x_hi, clef_score, rowadj)
    flats, flat_right = _accidental_run(nl, st, s, topD, 'flat',
                                        key_signature_degrees('flat', topD),
                                        x_lo, x_hi, clef_score, rowadj)
    if not sharps and not flats:
        return dict(fifths=0, kind=None, count=0, right=int(x_lo), scores=[], abstain=None)
    if len(sharps) == len(flats):
        return dict(fifths=None, kind=None, count=len(sharps),
                    right=max(sharp_right, flat_right), scores=[], abstain='sharp_flat_tie')
    if len(sharps) > len(flats):
        return dict(fifths=len(sharps), kind='sharp', count=len(sharps), right=sharp_right,
                    scores=[round(g['score'], 3) for g in sharps], abstain=None)
    return dict(fifths=-len(flats), kind='flat', count=len(flats), right=flat_right,
                scores=[round(g['score'], 3) for g in flats], abstain=None)


def read_system_clef_key(nl, staves, s, staff_idx, staff_left_x, first_barline_x=None):
    """What is printed at the start of one system's staff: clef, key signature,
    and the x range their ink occupies.

    Returns a dict, or None where the clef itself abstained (with no clef there
    is no anchor for the key signature and no way to know which rows it would
    occupy, so the whole read stands down together):

      glyph         the clef glyph matched: gClef, gClef8vb, fClef or cClef
      sign, line    that clef as reader.clef_topD speaks it
      ottavaGlyph   True only when the 8-bearing glyph's numeral was found
      clefScore     the clef's own match score
      fifths        signed accidental count, 0 for none, None where it abstained
      keyAbstain    why fifths is None, or None
      x_lo, x_hi    the x range clef and key-signature ink occupies
    """
    st = staves[staff_idx]
    clef = read_clef(nl, st, s, staff_left_x)
    if clef is None:
        return None
    topD = clef_topD_for(clef)
    cap = clef['x_right'] + KEY_SEARCH_SPACES * s
    if first_barline_x is not None:
        cap = min(cap, first_barline_x)
    cap = min(cap, nl.shape[1])
    key = read_key_signature(nl, st, s, topD, clef['x_right'], cap,
                             clef['score'], clef.get('rowadj', 0.0))
    return dict(glyph=clef['glyph'], sign=clef['sign'], line=clef['line'],
                ottavaGlyph=clef['ottavaGlyph'], clefScore=round(clef['score'], 4),
                fifths=key['fifths'], keyAbstain=key['abstain'],
                keyScores=key['scores'],
                x_lo=int(clef['x']), x_hi=int(max(clef['x_right'], key['right'])))


def clef_topD_for(clef):
    """The top-line staff degree this clef implies, with NO octave applied.
    The octave is the singer's answer, never this module's (see the module
    docstring on the plain G clef)."""
    from reader import clef_topD
    return clef_topD(clef['sign'], clef['line'], 0)


# THE MASK'S RIGHT-HAND MARGIN, in staff spaces. The span a system reports runs
# from the clef's matched left edge to the right edge of the last key-signature
# accidental. A notehead detection is dropped when its CENTRE falls inside that
# span widened by this margin.
#
# Derived from the ink itself rather than chosen: the notehead matched filter
# fires on the CENTRE of a notehead-sized blob, and its kernel is 1.35s wide
# (`reader.detect_heads`), so a detection whose centre sits up to 0.675s past
# the last accidental's right edge is still a response to that accidental's
# ink. Half the kernel width is therefore the smallest margin that covers what
# the mask exists to remove, and it is the margin used. Measured consequence on
# the corpus is in the return memo: it drops 10 of 10 clef-and-key false
# positives on Lamm page 1 and no true note anywhere, on the scan or on the 23
# render fixture pages.
CLEF_KEY_MASK_MARGIN = 0.675   # * s, half of detect_heads' 1.35s kernel width


def read_page_clef_key(img, nl, staves, s, vocal):
    """Every system's clef-and-key read, plus the page's own summary.

    Returns (systems, summary). `systems` is a list, one entry per vocal
    system, each either None (that system abstained) or the dict
    `read_system_clef_key` returns. `summary` is what the intake prompt
    pre-fills from:

      {glyph, sign, line, ottavaGlyph, fifths, systems, agreeing}

    THE SUMMARY IS A MAJORITY, not the first system's answer, and that is
    load-bearing rather than tidy: `reader.select_vocal` is a known-weak
    heuristic, and on 8 systems of this corpus it hands the reader a piano
    staff whose printed clef is genuinely different from the voice's. A first-
    system answer would inherit that mistake whole; a majority survives it as
    long as most systems were selected correctly.

    Any field the systems disagree on comes back None, so the prompt asks about
    that field instead of asserting a coin toss. `agreeing` counts the systems
    backing the majority clef."""
    from reader import _staff_left_edge
    dark = img < 128
    out = []
    for b in vocal:
        left = _staff_left_edge(dark, staves[b])
        out.append(None if left is None
                   else read_system_clef_key(nl, staves, s, b, left))
    read = [r for r in out if r is not None]
    if not read:
        return out, None

    def majority(values):
        counts = {}
        for v in values:
            counts[v] = counts.get(v, 0) + 1
        best = max(counts.values())
        winners = [v for v, c in counts.items() if c == best]
        return (winners[0], best) if len(winners) == 1 else (None, best)

    glyph, agreeing = majority([r['glyph'] for r in read])
    fifths, _ = majority([r['fifths'] for r in read])
    if glyph is None:
        summary = dict(glyph=None, sign=None, line=None, ottavaGlyph=None,
                       fifths=fifths, systems=len(read), agreeing=agreeing)
    else:
        base = 'gClef' if glyph == 'gClef8vb' else glyph
        sign, line = CLEF_MEANING[base]
        summary = dict(glyph=glyph, sign=sign, line=line,
                       ottavaGlyph=(glyph == 'gClef8vb'),
                       fifths=fifths, systems=len(read), agreeing=agreeing)
    return out, summary


def spans_from(systems):
    """{system index: (x_lo, x_hi)} for every system that read a clef, from
    `read_page_clef_key`'s per-system list. A system that abstained
    contributes no entry, so nothing there is masked: an unread clef must
    never cost a singer a note."""
    return {i: (r['x_lo'], r['x_hi']) for i, r in enumerate(systems) if r is not None}
