"""rest_templates.py -- SMuFL rest glyph templates rasterized from real font data.

SOURCE
------
Font: Leipzig, the default SMuFL font used by Verovio (and the font Verovio
6.2.0 used to render our corpus pages). No standalone Leipzig .otf ships in
the `verovio` npm package (only the WASM engine + JS glue in
/home/claude/node_modules/verovio/dist); Verovio embeds the glyph outlines
inside the WASM module itself. To recover real outlines without downloading
a separate font file, this module drives the already-installed
verovio@6.2.0 package (via Node) to render a tiny MEI score containing one
rest of each duration we need, using Verovio's `svgRemoveXlink` +
`svgFormatRaw` render options. Those options make Verovio inline each used
glyph's outline directly as an SVG <path> (in <defs>) instead of a <use>
reference to an external glyph sprite, so the exact Leipzig path data for
each rest codepoint can be read straight out of the SVG text.

Licence: Verovio itself is LGPL-3.0-or-later (rism-digital/verovio). The
SMuFL fonts Verovio bundles, including Leipzig, are documented upstream as
released under the SIL Open Font License 1.1, consistent with the other
fonts (Bravura, Gootville, Petaluma) it ships; this sandbox has no separate
Leipzig font file to check a licence header against directly, since the
outlines only exist inside the compiled WASM blob, so this is reported as
"per verovio's published font licensing", not independently re-verified
against a standalone font file.

RASTERIZATION
-------------
Verovio places each glyph as `<use ... transform="translate(tx,ty)
scale(k,k)">` against page coordinates, in the same SVG where staff lines
are drawn as literal horizontal <path> elements. That lets us calibrate
"page units per staff space" empirically from the SAME render (median
spacing between the 5 rendered staff lines), with no assumption about
Verovio's internal unit convention. Dividing by k gives "raw glyph units
per staff space" -- the conversion factor from the font's own path
coordinate system into staff spaces, which is exactly what `render_rest`
needs to place ink at the right size for a page whose measured staff
space is s pixels.

Each glyph's raw path (SVG commands M/L/H/V/C/S, upper or lower case) is
parsed into vertices/codes for `matplotlib.path.Path`, y-flipped (Verovio
wraps each glyph def in `transform="scale(1,-1)"`, undoing the font's
y-up authoring convention for SVG's y-down convention), scaled by
s / raw_units_per_staffspace, and filled with matplotlib's point-in-path
containment test (nonzero winding) on a pixel-centre grid to produce a
binary ink array. This is pure deterministic geometry -- no machine
learning anywhere in this module.

KNOWN-STALE CLAIM (close-prep, 2026-07-24, NOT corrected in this file --
flagged for whoever next touches it): the paragraph above says the
matplotlib containment test uses "nonzero winding." Close-prep's
time-signature-read work (timesig.py) found this is FALSE:
MplPath.contains_points does not implement nonzero-winding hole
subtraction at all (a minimal two-nested-squares test at every winding
combination always reported the inner square's centre as "inside"). It
does not matter for THIS file's output, because no rest glyph has an
enclosed counter/hole, so the bug is silent here -- but the mechanism
description is wrong and would corrupt any future rest-family glyph that
does have a hole. timesig.py's render_digit uses a hand-rolled nonzero-
winding scanline fill instead (`_flatten_to_polygons` + `_fill_nonzero`);
port that fix here if this module is ever extended to a glyph with a
counter.
"""
import os
import re
import json
import subprocess
import tempfile

import numpy as np
from matplotlib.path import Path as MplPath

VEROVIO_DIR = "/home/claude/e16/node_modules/verovio"
CACHE_PATH = os.path.expanduser("~/.cache/rest_templates_leipzig.json")

REST_CODEPOINTS = {
    'whole':   'U+E4E3',
    'half':    'U+E4E4',
    'quarter': 'U+E4E5',
    '8th':     'U+E4E6',
    '16th':    'U+E4E7',
    '32nd':    'U+E4E8',
}

_MEI_TEMPLATE = """<?xml version="1.0" encoding="UTF-8"?>
<mei xmlns="http://www.music-encoding.org/ns/mei" meiversion="4.0.1">
  <music><body><mdiv><score>
    <scoreDef><staffGrp>
      <staffDef n="1" lines="5" clef.shape="G" clef.line="2" meter.count="20" meter.unit="4"/>
    </staffGrp></scoreDef>
    <section><measure n="1"><staff n="1"><layer n="1">
      <rest dur="1"/><rest dur="2"/><rest dur="4"/><rest dur="8"/><rest dur="16"/><rest dur="32"/>
    </layer></staff></measure></section>
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
tk.setOptions({{ scale: 100, pageWidth: 4000, pageHeight: 2000, adjustPageHeight: true,
                 breaks: 'none', svgRemoveXlink: true, svgFormatRaw: true }});
tk.redoLayout();
const svg = tk.renderToSVG(1);
fs.writeFileSync('{svg_path}', svg);
console.log('verovio', tk.getVersion());
"""

_CACHE = None


def _extract_from_svg(svg_text):
    """Pull raw path `d` strings for each rest codepoint, plus the
    page-units-per-staffspace / glyph-use-scale calibration, out of a
    verovio SVG render."""
    paths = {}
    for name, cp in REST_CODEPOINTS.items():
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
    """Render (or load cached) Leipzig rest-glyph path data via verovio."""
    global _CACHE
    if not force and _CACHE is not None:
        return _CACHE
    if not force and os.path.exists(CACHE_PATH):
        with open(CACHE_PATH) as f:
            _CACHE = json.load(f)
        return _CACHE

    with tempfile.TemporaryDirectory() as td:
        mei_path = os.path.join(td, 'rests.mei')
        svg_path = os.path.join(td, 'rests.svg')
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
                f"provenance={VEROVIO_DIR} (node_modules/verovio@6.2.0), glyph outlines "
                f"extracted from VerovioToolkit.renderToSVG() with svgRemoveXlink+svgFormatRaw"),
    )
    os.makedirs(os.path.dirname(CACHE_PATH), exist_ok=True)
    with open(CACHE_PATH, 'w') as f:
        json.dump(_CACHE, f)
    return _CACHE


# ---------- minimal SVG path parser -> matplotlib Path ----------
_TOKEN_RE = re.compile(r'[MmLlHhVvCcSsQqTtZz]|-?\d*\.\d+(?:[eE][-+]?\d+)?|-?\d+(?:[eE][-+]?\d+)?')


def _parse_path(d):
    tokens = _TOKEN_RE.findall(d)
    i = 0
    cur = (0.0, 0.0)
    start = (0.0, 0.0)
    last_ctrl = None
    verts, codes = [], []
    cmd = None

    def nextnum():
        nonlocal i
        v = float(tokens[i])
        i += 1
        return v

    while i < len(tokens):
        tok = tokens[i]
        if tok.isalpha():
            cmd = tok
            i += 1
        if cmd in ('M', 'm'):
            x, y = nextnum(), nextnum()
            if cmd == 'm':
                x, y = cur[0] + x, cur[1] + y
            cur = (x, y)
            start = cur
            verts.append(cur); codes.append(MplPath.MOVETO)
            cmd = 'L' if cmd == 'M' else 'l'  # subsequent coord pairs are implicit lineto
            last_ctrl = None
        elif cmd in ('L', 'l'):
            x, y = nextnum(), nextnum()
            if cmd == 'l':
                x, y = cur[0] + x, cur[1] + y
            cur = (x, y)
            verts.append(cur); codes.append(MplPath.LINETO)
            last_ctrl = None
        elif cmd in ('H', 'h'):
            x = nextnum()
            if cmd == 'h':
                x = cur[0] + x
            cur = (x, cur[1])
            verts.append(cur); codes.append(MplPath.LINETO)
            last_ctrl = None
        elif cmd in ('V', 'v'):
            y = nextnum()
            if cmd == 'v':
                y = cur[1] + y
            cur = (cur[0], y)
            verts.append(cur); codes.append(MplPath.LINETO)
            last_ctrl = None
        elif cmd in ('C', 'c'):
            x1, y1, x2, y2, x, y = (nextnum() for _ in range(6))
            if cmd == 'c':
                x1, y1 = cur[0] + x1, cur[1] + y1
                x2, y2 = cur[0] + x2, cur[1] + y2
                x, y = cur[0] + x, cur[1] + y
            verts += [(x1, y1), (x2, y2), (x, y)]
            codes += [MplPath.CURVE4] * 3
            last_ctrl = (x2, y2)
            cur = (x, y)
        elif cmd in ('S', 's'):
            x2, y2, x, y = (nextnum() for _ in range(4))
            if cmd == 's':
                x2, y2 = cur[0] + x2, cur[1] + y2
                x, y = cur[0] + x, cur[1] + y
            if last_ctrl is not None:
                x1, y1 = 2 * cur[0] - last_ctrl[0], 2 * cur[1] - last_ctrl[1]
            else:
                x1, y1 = cur
            verts += [(x1, y1), (x2, y2), (x, y)]
            codes += [MplPath.CURVE4] * 3
            last_ctrl = (x2, y2)
            cur = (x, y)
        elif cmd in ('Q', 'q'):
            x1, y1, x, y = (nextnum() for _ in range(4))
            if cmd == 'q':
                x1, y1 = cur[0] + x1, cur[1] + y1
                x, y = cur[0] + x, cur[1] + y
            verts += [(x1, y1), (x, y)]
            codes += [MplPath.CURVE3] * 2
            last_ctrl = (x1, y1)
            cur = (x, y)
        elif cmd in ('T', 't'):
            x, y = nextnum(), nextnum()
            if cmd == 't':
                x, y = cur[0] + x, cur[1] + y
            if last_ctrl is not None:
                x1, y1 = 2 * cur[0] - last_ctrl[0], 2 * cur[1] - last_ctrl[1]
            else:
                x1, y1 = cur
            verts += [(x1, y1), (x, y)]
            codes += [MplPath.CURVE3] * 2
            last_ctrl = (x1, y1)
            cur = (x, y)
        elif cmd in ('Z', 'z'):
            verts.append(start); codes.append(MplPath.CLOSEPOLY)
            cur = start
            last_ctrl = None
        else:
            raise ValueError(f"unsupported SVG path command: {cmd!r}")
    return np.array(verts, dtype=float), codes


def _resolve_name(name_or_codepoint):
    if isinstance(name_or_codepoint, str) and name_or_codepoint in REST_CODEPOINTS:
        return name_or_codepoint
    if isinstance(name_or_codepoint, int):
        cp = f"U+{name_or_codepoint:04X}"
    else:
        s = str(name_or_codepoint)
        cp = s if s.upper().startswith('U+') else f"U+{s}"
    for name, c in REST_CODEPOINTS.items():
        if c.upper() == cp.upper():
            return name
    raise KeyError(f"unrecognized rest name/codepoint: {name_or_codepoint!r}")


def render_rest(name_or_codepoint, s):
    """Rasterize a rest glyph at staff-space size s (pixels).
    Returns a 2-D uint8 numpy array, 1 = ink, 0 = background."""
    font = load_font()
    name = _resolve_name(name_or_codepoint)
    d = font['paths'][name]
    raw_units_per_space = font['raw_units_per_space']

    verts, codes = _parse_path(d)
    verts = verts.copy()
    verts[:, 1] *= -1.0  # undo verovio's per-glyph transform="scale(1,-1)"

    scale = float(s) / raw_units_per_space
    verts *= scale

    minx, miny = verts.min(axis=0)
    maxx, maxy = verts.max(axis=0)
    pad = 1.0
    verts[:, 0] -= (minx - pad)
    verts[:, 1] -= (miny - pad)
    W = int(np.ceil(maxx - minx)) + 2
    H = int(np.ceil(maxy - miny)) + 2

    path = MplPath(verts, codes)
    xs = np.arange(W) + 0.5
    ys = np.arange(H) + 0.5
    gx, gy = np.meshgrid(xs, ys)
    pts = np.column_stack([gx.ravel(), gy.ravel()])
    inside = path.contains_points(pts)
    return inside.reshape(H, W).astype(np.uint8)
