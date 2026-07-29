"""E.16 bridged-run substrate, rebuilt from thread-opener v23 section 4.

Imports no reader module and no previous session's scratch. Pure geometry
and raster measurement.

Contents
  parse_svg_geometry  -- section 4.1
  row_runs            -- section 4.2
  bridge / principal  -- section 4.3
  anchor_rows         -- section 4.4, with the D4 denotation assertion
  band_members        -- section 4.5, RATIFIED membership: 0.9 span AND 0.9 solid
  join_positions      -- per SYSTEM, never pooled per page (section 4.6)
"""
STATUS = 'CURRENT'

import os
import re
import glob
import xml.etree.ElementTree as ET

import numpy as np
import cv2

H = '/home/claude/e16'

SPAN_FRAC = 0.9      # ratified membership: span >= 0.9 of system extent
SOLID_FRAC = 0.9     # ratified membership: >= 0.9 solid across that span
ANCHOR_FRAC = 0.9    # section 4.4 anchor search: raw longest_run >= 0.9 * width
ANCHOR_MAX_OFF = 3

_LINE_RE = re.compile(
    r'^\s*M\s*(-?[\d.]+)\s+(-?[\d.]+)\s*L\s*(-?[\d.]+)\s+(-?[\d.]+)\s*$')
_TRANSLATE_RE = re.compile(r'translate\(\s*(-?[\d.]+)[ ,]+(-?[\d.]+)\s*\)')


class SubstrateError(RuntimeError):
    pass


def _local(tag):
    return tag.rsplit('}', 1)[-1] if '}' in tag else tag


def _classes(e):
    return set(e.get('class', '').split())


def _find(elem, cls):
    return [e for e in elem.iter()
            if _local(e.tag) == 'g' and cls in _classes(e)]


# ---------------------------------------------------------------- section 4.1

def parse_svg_geometry(svg_path, png_w, png_h):
    """Return dict with scale, translate, and a list of systems.

    Each system: {'x_lo','x_hi' (px, ints), 'rule_rows' (px floats, sorted),
                  'joins' (px floats, interior measure joins, THIS system only),
                  'measure_spans' (list of (x_lo_px, x_hi_px) per measure)}
    """
    root = ET.parse(svg_path).getroot()

    vb_elem = None
    for e in root.iter():
        if e.get('viewBox'):
            vb_elem = e
            break
    if vb_elem is None:
        raise SubstrateError('no viewBox anywhere in %r' % svg_path)
    if vb_elem is root:
        raise SubstrateError('viewBox found on the ROOT svg of %r; section 4.1 '
                             'says it sits on an inner element' % svg_path)
    _, _, vb_w, vb_h = [float(v) for v in vb_elem.get('viewBox').split()]
    scale_x = png_w / vb_w
    scale_y = png_h / vb_h
    if abs(scale_x - scale_y) > 2e-4:
        raise SubstrateError('scales disagree: %.8f vs %.8f in %r'
                             % (scale_x, scale_y, svg_path))

    margins = [e for e in root.iter()
               if _local(e.tag) == 'g' and 'page-margin' in _classes(e)]
    if len(margins) != 1:
        raise SubstrateError('expected exactly one page-margin in %r, got %d'
                             % (svg_path, len(margins)))
    tm = _TRANSLATE_RE.search(margins[0].get('transform', ''))
    if not tm:
        raise SubstrateError('page-margin carries no translate in %r' % svg_path)
    tx, ty = float(tm.group(1)), float(tm.group(2))

    def X(x_vb):
        return (x_vb + tx) * scale_x

    def Y(y_vb):
        return (y_vb + ty) * scale_y

    systems = []
    for sys_elem in _find(root, 'system'):
        measures = _find(sys_elem, 'measure')
        if not measures:
            raise SubstrateError('system with no measures in %r' % svg_path)
        measure_spans = []
        all_x = []
        ys = []
        for meas in measures:
            mx = []
            for staff in _find(meas, 'staff'):
                for path in staff:                      # DIRECT children only
                    if _local(path.tag) != 'path':
                        continue
                    m = _LINE_RE.match(path.get('d', ''))
                    if not m:
                        continue
                    x1, y1, x2, y2 = [float(v) for v in m.groups()]
                    if y1 != y2:
                        continue
                    mx.extend([x1, x2])
                    ys.append(Y(y1))
            if not mx:
                raise SubstrateError('measure with no horizontal staff paths '
                                     'in %r' % svg_path)
            measure_spans.append((X(min(mx)), X(max(mx))))
            all_x.extend(mx)

        # x_lo / x_hi are a COORDINATE RANGE, used only to scope the join-gap
        # population under R-1' (bounds inclusive, +/-1 px tolerance).
        x_lo = int(round(X(min(all_x))))
        x_hi = int(round(X(max(all_x))))
        # `extent` is a LENGTH, and it is a different quantity from the range
        # above. Correction, this session: taking the extent as
        # x_hi - x_lo + 1 inflates it by one pixel on every system, because
        # both endpoints round outward. On repaired sunless-04 p2 that yields
        # 2234 where the drawn rule measures 2233 px of ink (row 1523 is a
        # single run, x 188..2420), and it puts AT-2(b)'s ratified ratio for
        # row 1522 at 0.9996 instead of the ruled 1.0000. The extent of a
        # continuous SVG interval [a, b] is b - a; only a run of discrete
        # pixels counts as last - first + 1. Measured here: hi - lo = 2233.06.
        extent = int(round(X(max(all_x)) - X(min(all_x))))
        rule_rows = sorted(set(round(y, 4) for y in ys))

        # Interior measure joins, THIS system only. Both abutting boundaries
        # are kept as candidates because they can round to different pixels.
        joins = []
        ordered = measure_spans           # document order
        for a, b in zip(ordered, ordered[1:]):
            joins.append(a[1])
            joins.append(b[0])
        systems.append(dict(x_lo=x_lo, x_hi=x_hi, extent=extent,
                            rule_rows=rule_rows,
                            joins=sorted(set(round(j, 4) for j in joins)),
                            measure_spans=measure_spans))
    if not systems:
        raise SubstrateError('no systems in %r' % svg_path)
    return dict(scale_x=scale_x, scale_y=scale_y, tx=tx, ty=ty,
                systems=systems)


# ---------------------------------------------------------------- section 4.2

def row_runs(ink):
    """One pass. Return (row, x_start, x_end, length) arrays for every raw run.

    ink: boolean HxW mask, True where dark.
    """
    Hh, W = ink.shape
    p = np.pad(ink, ((0, 0), (1, 1)), constant_values=False)
    flat = p.ravel().astype(np.int8)
    d = np.diff(flat)
    s = np.nonzero(d == 1)[0] + 1
    e = np.nonzero(d == -1)[0] + 1
    length = (e - s).astype(np.int64)
    row = (s // (W + 2)).astype(np.int64)
    x_start = (s % (W + 2) - 1).astype(np.int64)
    x_end = x_start + length - 1
    return row, x_start, x_end, length


def longest_run_per_row(nrows, row, length):
    best = np.zeros(nrows, dtype=np.int64)
    if len(row):
        np.maximum.at(best, row, length)
    return best


# ---------------------------------------------------------------- section 4.3

def principal_per_row(nrows, row, x_start, x_end, length, g):
    """Bridged runs at tolerance g; return (extent, mass) per row.

    extent: principal bridged run's last x - first x + 1 (gaps INCLUDED)
    mass:   sum of the chain's raw-run dark pixels (gaps EXCLUDED)
    Rows with no ink get extent 0, mass 0.
    """
    extent = np.zeros(nrows, dtype=np.int64)
    mass = np.zeros(nrows, dtype=np.int64)
    if len(row) == 0:
        return extent, mass

    gap = np.empty(len(row), dtype=np.int64)
    gap[0] = 1 << 40
    gap[1:] = x_start[1:] - x_end[:-1] - 1
    new_chain = (gap > g)
    new_chain[1:] |= (row[1:] != row[:-1])
    new_chain[0] = True
    chain = np.cumsum(new_chain) - 1
    nch = int(chain[-1]) + 1

    ch_mass = np.zeros(nch, dtype=np.int64)
    np.add.at(ch_mass, chain, length)
    first_idx = np.zeros(nch, dtype=np.int64)
    first_idx[chain[new_chain]] = np.nonzero(new_chain)[0]
    last_idx = np.zeros(nch, dtype=np.int64)
    np.maximum.at(last_idx, chain, np.arange(len(row)))
    ch_first_x = x_start[first_idx]
    ch_last_x = x_end[last_idx]
    ch_extent = ch_last_x - ch_first_x + 1
    ch_row = row[first_idx]

    # principal: greatest mass, ties by greater extent, then leftmost
    order = np.lexsort((ch_first_x, -ch_extent, -ch_mass, ch_row))
    cr = ch_row[order]
    keep = np.ones(len(cr), dtype=bool)
    keep[1:] = cr[1:] != cr[:-1]
    sel = order[keep]
    extent[ch_row[sel]] = ch_extent[sel]
    mass[ch_row[sel]] = ch_mass[sel]
    return extent, mass


# ---------------------------------------------------------------- section 4.4

def anchor_for_rule(y_px, best_raw, system_width, nrows):
    """Return (anchor_row, offset). Raises on a tie or on exhaustion."""
    y0 = int(round(y_px))
    thr = ANCHOR_FRAC * system_width
    if 0 <= y0 < nrows and best_raw[y0] >= thr:
        return y0, 0
    for off in range(1, ANCHOR_MAX_OFF + 1):
        lo, hi = y0 - off, y0 + off
        ok_lo = 0 <= lo < nrows and best_raw[lo] >= thr
        ok_hi = 0 <= hi < nrows and best_raw[hi] >= thr
        if ok_lo and ok_hi:
            raise SubstrateError('anchor tie at y0=%d off=%d' % (y0, off))
        if ok_lo:
            return lo, -off
        if ok_hi:
            return hi, off
    raise SubstrateError('anchor search exhausted at y0=%d (thr=%.1f)'
                         % (y0, thr))


# ---------------------------------------------------------------- section 4.5

def band_members(anchor, row_span_lo, row_span_hi, total_dark, sys_extent,
                 nrows):
    """RATIFIED membership, applied to anchor-1, anchor, anchor+1.

    A rule-band row spans at least 0.9 of its system's extent AND is at least
    0.9 solid across that span.
    """
    out = []
    for r in (anchor - 1, anchor, anchor + 1):
        if r < 0 or r >= nrows:
            continue
        if total_dark[r] == 0:
            continue
        span = row_span_hi[r] - row_span_lo[r] + 1
        if span < SPAN_FRAC * sys_extent:
            continue
        if total_dark[r] < SOLID_FRAC * span:
            continue
        out.append(r)
    return out


# ---------------------------------------------------------------- page loader

def rendered_pages():
    pngs = sorted(p for p in glob.glob(H + '/output/**/page*_300dpi.png',
                                       recursive=True)
                  if 'preinjection' not in p)
    if len(pngs) != 47:
        raise SubstrateError('expected 47 rendered pages, found %d' % len(pngs))
    return [(p, p.replace('_300dpi.png', '.svg')) for p in pngs]


def page_label(png):
    rel = os.path.relpath(png, H + '/output')
    parts = rel.split(os.sep)
    tag = 'REP' if 'repaired' in parts else 'LEG'
    n = re.match(r'page(\d+)_300dpi\.png$', parts[-1]).group(1)
    short = parts[0].split('---')[1] if '---' in parts[0] else parts[0]
    return '%s:%s:%s' % (tag, short, n)


def load_page(png, svg):
    img = cv2.imread(png, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise SubstrateError('unreadable png %r' % png)
    ink = img < 128
    nrows, W = ink.shape
    geom = parse_svg_geometry(svg, W, nrows)
    row, xs, xe, ln = row_runs(ink)
    best_raw = longest_run_per_row(nrows, row, ln)
    total_dark = ink.sum(axis=1).astype(np.int64)
    span_lo = np.full(nrows, -1, dtype=np.int64)
    span_hi = np.full(nrows, -1, dtype=np.int64)
    if len(row):
        # first x_start and last x_end per row; runs are already row-ordered
        firstmask = np.ones(len(row), dtype=bool)
        firstmask[1:] = row[1:] != row[:-1]
        lastmask = np.ones(len(row), dtype=bool)
        lastmask[:-1] = row[1:] != row[:-1]
        span_lo[row[firstmask]] = xs[firstmask]
        span_hi[row[lastmask]] = xe[lastmask]
    return dict(png=png, svg=svg, label=page_label(png), ink_shape=(nrows, W),
                geom=geom, row=row, xs=xs, xe=xe, ln=ln,
                best_raw=best_raw, total_dark=total_dark,
                span_lo=span_lo, span_hi=span_hi, nrows=nrows, W=W)
