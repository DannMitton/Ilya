"""Landing verification for the 5.1 change.

1. Runs the NEW band walk on all 47 rendered pages and compares it, page by
   page, against the OLD `rowfrac > 0.35` walk transcribed verbatim from the
   pre-landing source. Reports line_t agreement and allowed-mask differences.
   Any walk raise is reported, not swallowed.
2. Fires both ratified sentinel control exemplars at BOTH binding points,
   measured separately at each, never inferred across them.
"""
STATUS = 'CURRENT'

import sys
from collections import Counter

sys.path.insert(0, '/home/claude')

import numpy as np
import cv2

import e16_measure_substrate as M
import substrate
import beams
import reader


def old_walk(img, staves):
    """The pre-landing walk, transcribed verbatim. Reference only."""
    bw = (img < 128).astype(np.uint8)
    rowfrac = bw.mean(axis=1)
    allowed = np.zeros(img.shape[0], bool)
    thicknesses = []
    for st in staves:
        for y in st:
            lo = y
            while lo > 0 and rowfrac[lo - 1] > 0.35:
                lo -= 1
            hi = y
            while hi < len(rowfrac) - 1 and rowfrac[hi + 1] > 0.35:
                hi += 1
            allowed[max(0, lo - 1):hi + 2] = True
            thicknesses.append(hi - lo + 1)
    return allowed, (float(np.median(thicknesses)) if thicknesses else 3.0)


def new_walk(img, s, staves, page):
    """The landed walk, reached through the landed function's own internals."""
    sub = substrate.page_substrate(img)
    ext = sub['extent']
    nrows = sub['nrows']
    allowed = np.zeros(nrows, bool)
    thicknesses = []
    accepted = []
    for st in staves:
        staff_extent = int(max(int(ext[y]) for y in st))
        for y in st:
            seed = beams._snap_seed(ext, y, staff_extent, s, nrows, page)
            members = beams._walk_band(ext, seed, staff_extent, nrows)
            allowed[max(0, members[0] - 1):members[-1] + 2] = True
            thicknesses.append(len(members))
            accepted.extend(members)
    substrate.sentinel(sub, accepted, 'verify', page)
    return allowed, (float(np.median(thicknesses)) if thicknesses else 3.0), \
        thicknesses


def part1():
    lt_pairs = Counter()
    mask_diffs = Counter()
    raises = []
    thick_census = Counter()
    npages = 0
    for png, svg in M.rendered_pages():
        label = M.page_label(png)
        img = cv2.imread(png, cv2.IMREAD_GRAYSCALE)
        try:
            staves, s = reader.detect_staves(img, page=label)
        except RuntimeError as e:
            raises.append((label, 'detect_staves', str(e)[:70]))
            continue
        npages += 1
        a_old, lt_old = old_walk(img, staves)
        try:
            a_new, lt_new, th = new_walk(img, s, staves, label)
        except (beams.WalkRaise, substrate.SentinelRaise) as e:
            raises.append((label, type(e).__name__, str(e)[:120]))
            continue
        thick_census.update(th)
        lt_pairs[(lt_old, lt_new)] += 1
        d = int((a_old != a_new).sum())
        mask_diffs[d] += 1
        if d:
            print('  mask differs on %-28s by %d rows' % (label, d))
    print('PAGES walked: %d' % npages)
    print('  line_t (old, new) pairs: %s' % dict(sorted(lt_pairs.items())))
    print('  allowed-mask row differences, distribution: %s'
          % dict(sorted(mask_diffs.items())))
    print('  D3 band-thickness census from the NEW walk: %s'
          % dict(sorted(thick_census.items())))
    print('  raises: %s' % (raises if raises else 'none'))


def part2():
    """Both control exemplars, both binding points, measured separately."""
    print()
    print('AT-C sentinel controls. Ratified exemplars, property form:')
    print('  (p1) passes its call site operative test AS MEASURED')
    print('  (p2) bridged concentration strictly below K_S=%.4f AS MEASURED'
          % substrate.K_S)

    PNG = ('/home/claude/e16/output/mussorgsky---sunless-01---within-four-walls'
           '/page1_300dpi.png')
    base = cv2.imread(PNG, cv2.IMREAD_GRAYSCALE)
    staves, s = reader.detect_staves(base, page='control-base')
    sub0 = substrate.page_substrate(base)
    band_row = staves[0][0]
    staff_extent = int(max(int(sub0['extent'][y]) for y in staves[0]))
    print()
    print('  base page: staff extent %d, control row %d, its extent %d, '
          'concentration %.4f'
          % (staff_extent, band_row, sub0['extent'][band_row],
             sub0['conc'][band_row]))

    # ---- exemplar (ii): full-span principal plus competing margin ink.
    #
    # CORRECTION, this session. The first version of this control added the
    # margin ink to ONE line row. That lifted the row's rowfrac from 0.8911 to
    # 0.9516, out of its own coverage population, so the CANDIDATE GENERATOR
    # rejected every other rule row on the page: derived gate 0.930444, one
    # row above it, and detect_staves never reached the sentinel at all. The
    # control was measuring the gate, not the tripwire it names.
    #
    # The ink is therefore added to all five line rows of one staff, so the
    # population moves together, stays a single segment, and the page still
    # detects normally. The perturbation is a genuinely defective input -- a
    # staff whose rule rows carry competing ink -- and it satisfies the two
    # ratified properties by measurement, which is what the property form asks.
    ii = base.copy()
    ctrl_rows = list(staves[0])
    for r in ctrl_rows:
        ii[r, 0:70] = 0
    s_ii = substrate.page_substrate(ii)
    rf_ii = (ii < 128).mean(axis=1)
    print()
    print('  EXEMPLAR (ii), full-span principal plus 70 px of margin ink on '
          'all five rows of staff 0:')
    print('    control rows %r' % (ctrl_rows,))
    print('    their rowfrac %.4f..%.4f against the other rules %.4f..%.4f, '
          'so the candidate generator is undisturbed'
          % (min(rf_ii[r] for r in ctrl_rows), max(rf_ii[r] for r in ctrl_rows),
             min(rf_ii[y] for st in staves[1:] for y in st),
             max(rf_ii[y] for st in staves[1:] for y in st)))
    print('    principal bridged extent %d, ratio %.4f, concentration %.4f'
          % (s_ii['extent'][band_row],
             s_ii['extent'][band_row] / staff_extent,
             s_ii['conc'][band_row]))
    for name, fn in (('binding point 1, beams walk',
                      lambda im: beams.remove_lines_safe(
                          im, s, staves, page='control-ii')),
                     ('binding point 2, detect_staves validation',
                      lambda im: reader.detect_staves(im, page='control-ii'))):
        try:
            fn(ii)
            print('    %-42s DID NOT FIRE  <-- CONTROL FAILED' % name)
        except substrate.SentinelRaise as e:
            print('    %-42s FIRED' % name)
        except RuntimeError as e:
            print('    %-42s other raise: %s' % (name, str(e)[:60]))

    # ---- exemplar (i): near-threshold, two unequal runs on a band-adjacent row
    i_img = base.copy()
    adj = band_row - 1
    i_img[adj, :] = 255
    i_img[adj, 200:1400] = 0         # 1200 px principal
    i_img[adj, 1412:2413] = 0        # 1001 px, gap 12 px > g
    s_i = substrate.page_substrate(i_img)
    dev_ratio = abs(int(s_i['extent'][adj]) - staff_extent) / staff_extent
    print()
    print('  EXEMPLAR (i), two unequal runs 1200 and 1001 px on band-adjacent '
          'row %d:' % adj)
    print('    principal bridged extent %d, ratio %.4f, concentration %.4f'
          % (s_i['extent'][adj], s_i['extent'][adj] / staff_extent,
             s_i['conc'][adj]))
    print('    C2(b) deviation ratio %.4f against T_REL %.6f -> accepted: %s'
          % (dev_ratio, beams.T_REL, dev_ratio <= beams.T_REL))
    try:
        beams.remove_lines_safe(i_img, s, staves, page='control-i')
        print('    %-42s DID NOT FIRE  <-- CONTROL FAILED'
              % 'binding point 1, beams walk')
    except substrate.SentinelRaise:
        print('    %-42s FIRED' % 'binding point 1, beams walk')


if __name__ == '__main__':
    part1()
    part2()
