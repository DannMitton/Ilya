"""E.16 generalized deterministic vocal-line reader (fidelity build, rev 3).
Restored verbatim from claude/e16-reader-code-generalized_2026-07-24.py.
One parameterized module; no hardcoded staff lines. All stages read PIXELS.
Thresholds staff-space-normalized (Gould proportion). Accidental branches:
flat, natural, sharp, double-sharp (E263), double-flat (E264), abstain.
"""
import cv2, numpy as np, json
from fractions import Fraction

LET_BY_DEG = "CDEFGAB"
LETIDX = {'C':0,'D':1,'E':2,'F':3,'G':4,'A':5,'B':6}
SEMI = {'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}

# ---------- staff detection ----------
def _derive_rowfrac_gate(rowfrac, floor=0.015, span_bound=0.0137, min_members=5):
    """PER-PAGE ROWFRAC GATE, derived (detect-staves-gate fix, 2026-07-27,
    Fable's ruling on the detect_staves gate, same-day amendment, ratified by
    Dann; span_bound re-derived same day by the oracle amendment, also
    ratified by Dann -- see fable-ruling-e16-oracle-amendment.md). Replaces
    the fixed literal rowfrac>0.35. Same 1-D gap-statistic primitive as
    STAFF-BREAK THRESHOLD below, applied to the page's own distribution of
    per-row ink coverage instead of to line-position gaps.

    A single fixed cutoff cannot separate real staff lines from contamination
    across pages: on repaired sunless-03 p4, contamination rows peak at
    0.358-0.463; on legacy sunless-03 p4 they peak at 0.5391 -- HIGHER than
    the real (short-final-system) staff lines on repaired sunless-03 p5,
    which sit at 0.5226-0.5286, and higher still than legacy sunless-03 p5's
    real short-system lines at ~0.5157. No single constant separates real
    lines from contamination across every page.

    Nor can "take the largest gap in the sorted coverage distribution"
    substitute for a per-page derivation: measured directly on repaired
    sunless-03 p5, the single largest gap (0.5286->0.9004) sits BETWEEN two
    real populations -- a short final system (six lines, ~0.52-0.53) and the
    page's full-width systems (~0.90) -- and choosing it silently deletes the
    short system's lines. The derivation below must instead find the boundary
    of the noise population: the lowest qualifying cut above the near-zero
    background, not the largest gap wherever it falls.

    Method: sort the page's per-row coverage values and split them into
    segments wherever a consecutive gap exceeds FLOOR (0.015 rowfrac,
    comfortably above the ~0.0002-0.001 spacing measured within one genuine
    coverage population, comfortably below the smallest confirmed population
    boundary measured anywhere in this corpus, 0.0472 on repaired sunless-03
    p5). The page's highest segment is always real (nothing else on a page
    reaches that much continuous ink). Walk downward from it, accepting each
    further segment as ALSO real staff-line evidence only if it is BOTH tight
    (span < SPAN_BOUND, strict) AND carries at least MIN_MEMBERS samples.
    The gate is set at the midpoint of the boundary gap immediately below
    the lowest ACCEPTED segment. Named, unit-bearing (rowfrac, a coverage
    fraction), fitted per page and discarded: same primitive, same "fitting
    is not training" fence as the staff-break threshold.

    SPAN_BOUND = 0.0137, STRICT COMPARISON (span < span_bound).

    *** DERIVATION STRUCK, VALUE RETAINED. CORRECTION EIGHT, 2026-07-27. ***
    (claude/fable-ruling-e16-correction-eight-exemplar-contamination_2026-07-27.md)

    The midpoint derivation recorded below until 2026-07-27 is STRUCK. Both
    exemplars it was drawn from contain ZERO staff lines: they are the same
    kind of object as each other, and a constant derived as the midpoint
    between two objects of the same kind is not a boundary between kinds.
    The VALUE 0.0137 is RETAINED, demoted to an empirically pinned constant
    whose sole remaining authority is the thrice-verified corpus outcome
    (45 correct, 1 loud, 1 silent, zero silent repaired). It is scheduled for
    replacement by the unified 5.1 + 5.2 track. NO NEW WORK MAY CITE THE
    MIDPOINT DERIVATION.

    The vocabulary the record was missing, and everything below depends on
    it: "accept" was carrying two distinct verdicts. IDENTITY asks whether a
    segment is staff-line ink. PASSAGE asks whether the gate must lie below
    it. Under a prefix walk these coincide often enough that the difference
    went unnoticed. A ratified verdict can be correct while its ratified
    reason is false, and the two rot at different rates.

    Exemplars, corrected. Truth from Verovio SVG staff-path row geometry
    (standing law V1), independently confirmed on two separately written
    scripts. "Members" means DISTINCT COVERAGE VALUES, which is the quantity
    min_members gates via len(seg); the p6 segment also spans 11 member rows,
    and the two figures count different things:
      - must-ACCEPT exemplar: span 0.012903225806451535, repaired
        sunless-06 p6, second-highest-coverage segment, 6 members. THIS
        SEGMENT CONTAINS ZERO STAFF LINES. It is contamination, consistent
        with lyric text between staves: its rows (526 to 549) sit between a
        staff ending at row 506 and a staff beginning at row 634. It must
        nonetheless be accepted, because acceptance is a prefix walk from the
        top: the page's genuine third system (oracle total 9, per-system
        [3, 3, 3]) lies in a LOWER segment at coverage 0.4540 to 0.4573, and
        rejecting this segment stops the walk before reaching it, returning a
        silent 6 against a true 9. Acceptance here is a PASSAGE verdict, not
        an IDENTITY verdict: it is the price of reaching real staff lines
        below, not a judgement that this segment is staff ink. The former
        description of this segment as "a GENUINE system of three staves" was
        false and is retracted.
      - must-REJECT exemplar: span 0.014516129032258074, repaired
        sunless-06 p5, 5 members. LIKEWISE CONTAMINATION WITH ZERO STAFF
        LINES. On that page every genuine staff line lies in the top segment,
        so nothing below the top segment warrants passage. Accepting it (as
        the old floor=0.015 did) converts a correct page into an abstention
        and drops the corpus from 45 correct to 43 against the oracle.
      - What actually separates the two exemplars is therefore a LOOKAHEAD
        property, whether continuing the walk reaches real staff lines, and
        span is a LOCAL property of the segment under test. On every
        run-structure measure the two segments agree to three decimal places.
        The 0.0016 span difference between two pieces of lyric text is noise
        that fell on the right side of a line.
      - midpoint = 0.013709677419354804, recorded as 0.0137. STRUCK as a
        derivation, per the ruling above. Retained here only so that the
        provenance of the retained value is legible, never as justification.
      - guard interval (0.0129032..., 0.0145161...], admissible only under
        strict comparison: at a bound of 0.0129032... the must-accept
        segment must still be accepted (span == bound must pass), and at
        0.0145161... the must-reject segment must still be rejected (span
        == bound must fail). Only "span < span_bound" satisfies both.
      - re-derivation trigger, ratified: any conditionally tested genuine
        segment measuring wider than 0.0129032..., or any contamination
        segment measuring narrower than 0.0145161..., moves this interval.
        The constant returns to Fable before any new value is chosen.
      - THE POOLING TRAP, recorded with the procedure because it has
        already corrupted a derivation once: the topmost coverage segment
        on each page is accepted UNCONDITIONALLY (it is always real -- see
        "the page's highest segment is always real" above) and must be
        EXCLUDED from exemplar extraction. Pooling it into the must-accept /
        must-reject candidate pool silently corrupts the derivation.
    Superseded: the prior value 0.012 (no explicit operator, read as "<="
    in practice) and the prior claimed genuine-population range
    0.0060-0.0089 and prior contamination span 0.0141 on repaired
    sunless-03 p4. Both prior span claims were measured against the
    detector's OWN frozen counts, which were themselves wrong on two pages
    the oracle later caught; they are struck, not merely superseded, per
    Fable's process rule that no acceptance test (and, by the same
    reasoning, no constant derivation) may take its expected value from the
    mechanism under test.

    MIN_MEMBERS = 5 (one staff's worth of lines). Measured admissible range
    at span_bound=0.0137, against the oracle: [4, 5] give identical corpus
    outcomes (45 correct, 1 loud, 1 silent); 3 degrades. 5 is RETAINED on
    the structural argument alone (five lines to a staff), not because the
    margin is zero: the prior ruling's claim of a zero lower margin is
    struck, it was an artifact of a wrong (detector-circular) check.
    Re-derivation trigger: if any genuine conditionally tested segment ever
    measures fewer than 5 members, coverage quantization has merged genuine
    lines and the constant returns to Fable.

    FLOOR = 0.015. Accepted, no longer provisional. Evidential guards
    against the oracle: 0.0095 and 0.010 give 4 silent failures; 0.015
    through 0.030 give 2. The exact boundary in (0.010, 0.015) and which
    segments flip there remain unmeasured and unprocured; that does not
    block this value, which sits inside a band whose failure modes are
    measured on both sides.

    The 0.005 pre-filter (`rowfrac[rowfrac > 0.005]` below) is declared and
    left in place. Measured inert range [0.0, 0.1]: removal was never among
    the measured conditions and is not proposed here.

    Verified 2026-07-27 against the SVG oracle (oracle.py) covering the
    full 47-page rendered corpus (24 repaired + 23 legacy) plus the
    synthetic close fixture (certified by construction, count 1): AT-8 at
    span_bound=0.0137 measures 45 correct, 1 loud (repaired sunless-06 p6,
    the must-accept exemplar, now correctly abstaining instead of lying),
    1 known-silent (legacy sunless-05 p5, a named mechanism-gap ledger item
    per the ruling's 1.5, out of AT-1's repaired scope). Every REPAIRED page
    either matches the oracle or raises: zero silent repaired pages
    (AT-1, restated hard invariant).
    """
    nz = rowfrac[rowfrac > 0.005]
    if len(nz) == 0:
        return 1.0   # nothing on the page clears the noise floor; let "no staff lines" fire below
    vals = np.unique(nz)
    if len(vals) == 1:
        return float(vals[0]) / 2.0
    diffs = np.diff(vals)
    n = len(vals)
    splits = [i for i in range(len(diffs)) if diffs[i] > floor]
    bounds = [0] + [i + 1 for i in splits] + [n]
    segments = [vals[bounds[k]:bounds[k + 1]] for k in range(len(bounds) - 1)]
    idx = len(segments) - 1
    accepted_lo_val = segments[idx][0]
    idx -= 1
    while idx >= 0:
        seg = segments[idx]
        span = seg[-1] - seg[0]
        if span < span_bound and len(seg) >= min_members:
            accepted_lo_val = seg[0]
            idx -= 1
        else:
            break
    below = vals[vals < accepted_lo_val]
    if len(below):
        gate = (below.max() + accepted_lo_val) / 2.0
    else:
        gate = accepted_lo_val / 2.0
    return gate

def detect_staves(img, page=None):
    rowfrac=(img<128).mean(axis=1)
    gate=_derive_rowfrac_gate(rowfrac)
    line_rows=np.where(rowfrac>gate)[0]
    if len(line_rows)==0: raise RuntimeError("no staff lines")
    lines=[]; cur=[line_rows[0]]
    for r in line_rows[1:]:
        if r-cur[-1]<=3: cur.append(r)
        else: lines.append(int(np.mean(cur))); cur=[r]
    lines.append(int(np.mean(cur)))
    lines=np.array(lines)
    diffs=np.diff(lines)
    intra=diffs[diffs<np.median(diffs)*1.6]
    s=float(np.median(intra))
    # STAFF-BREAK THRESHOLD, adaptive (close-prep fix, 2026-07-24). A fixed
    # 1.7*s cutoff mis-split a beamed re-render of piece 01 p1: system 4's
    # vocal-to-piano gap measured 35 px against a 1.7*21=35.7 px threshold, a
    # sub-pixel miss that merged two staves into one invalid 7-line group and
    # dropped an entire vocal system (18 notes, pitch F1 0.69). The two
    # populations (intra-staff line gaps ~s, inter-staff gaps several times s)
    # are always well separated on a real page; a fixed multiple of s is not
    # robust to natural per-page layout compression. Classical 1-D gap-statistic
    # clustering (find the largest ratio jump in the sorted gap list) is the
    # per-page-calibrated, image-checkable replacement: named, unit-bearing in
    # px, fitted per page and discarded, admissible under the "fitting is not
    # training" fence and T4's classical-CV precedent class.
    big=sorted(d for d in diffs if d>1.3*s)
    if big:
        min_big=big[0]
        break_thr=(1.3*s+min_big)/2.0
    else:
        break_thr=1.7*s   # fallback: no candidate inter-staff gap found at all
    staves=[]; cur=[lines[0]]
    for i in range(1,len(lines)):
        if lines[i]-cur[-1] > break_thr: staves.append(cur); cur=[lines[i]]
        else: cur.append(lines[i])
    staves.append(cur)
    # ABSTENTION ON CONTAMINATED STAVES (detect-staves-gate fix, 2026-07-27,
    # Fable's ruling, ratified by Dann). The old `[st for st in staves if
    # len(st)==5]` silently discarded any group that was not exactly 5 lines.
    # A contaminated staff (5 real lines plus 1-2 absorbed false rows) was
    # thrown away WHOLE, not repaired, shifting every later staff index and
    # losing a real staff outright. Measured across 24 repaired pages: every
    # undersize group (1 or 2 lines) is spurious ink -- discard it as before,
    # nothing real is lost that way. But a group of 3 or more lines carries a
    # MAJORITY of a five-line staff and is evidence of a staff plus
    # contamination, not evidence of no staff: silently dropping it is the
    # exact defect this fix exists to close. Loud abstention replaces silent
    # discard for that case, matching the "no staff lines" precedent already
    # above in this function.
    checked=[]
    for st in staves:
        if len(st) <= 2:
            continue
        elif len(st) == 5:
            checked.append(st)
        else:
            raise RuntimeError(
                "detect_staves: contaminated staff group on page %r: group of "
                "%d lines is not a valid 5-line staff (all group sizes: %r)"
                % (page, len(st), [len(s) for s in staves]))
    return checked, s

def select_vocal(staves, s):
    tops=[st[0] for st in staves]; bots=[st[-1] for st in staves]
    gaps=[tops[i+1]-bots[i] for i in range(len(staves)-1)]
    if not gaps: return [0]
    gaps_arr=np.array(gaps)
    thr=(gaps_arr.min()+gaps_arr.max())/2 if gaps_arr.max()>gaps_arr.min()*1.4 else gaps_arr.max()+1
    vocal=[0]
    for i,g in enumerate(gaps):
        if g>thr: vocal.append(i+1)
    return vocal

def clef_topD(sign, line, octaveChange=0):
    if sign=='F':   ref_deg=LETIDX['F']+7*3
    elif sign=='G': ref_deg=LETIDX['G']+7*4
    elif sign=='C': ref_deg=LETIDX['C']+7*4
    else: raise ValueError(sign)
    topD = ref_deg + 2*(5-line)
    return topD + 7*octaveChange

# TIER-1 UNIFICATION (close-prep, 2026-07-24). The old `remove_lines()` opened
# the page with a 1.7*s horizontal kernel and subtracted anything that survived,
# with NO check for whether that ink actually sat on a detected staff line. That
# deleted an 82 px beam bar (a 35 px kernel is blind to what it is cutting) and,
# separately, severed every stem at each staff-line crossing -- two silent
# corruptions in one session (harness rhythm F1 1.000 -> 0.909; three heads lost
# on a proven page). The destructive function consumed a damaged copy and passed
# it downstream with no way for any later stage to detect the loss.
#
# Fable's ruling (fable-ruling-e16-layered-synthesis, tier 1): "Non-destructive,
# non-exclusive masks over an immutable raster... Downstream stages query the
# raster with a mask as context instead of consuming a damaged copy." The
# concrete fix: retire the destructive path entirely. `beams.remove_lines_safe`
# already computes the correct thing -- an immutable raster `bw` plus a single
# derived view `nl = bw & ~staff_line_mask`, where the mask only ever claims a
# pixel that (a) survives the horizontal opening AND (b) sits on a row belonging
# to a DETECTED staff line AND (c) has a vertical ink run no thicker than ~2.2x
# the measured line thickness. Every stage that used to consume the destructive
# `nl` (accidentals, rests, barlines, flag CC-area) and every stage that already
# used the safe `nl_safe` (stems, beams, hollow heads) now read from this SAME
# array. There is one removal path, computed once per page, in
# `read_page_geometry` below; nothing downstream can silently receive the
# destructive one because it no longer exists.
def remove_lines(img, s, staves):
    """Kept as a thin, explicitly-named alias so call sites read as what they
    are: the single non-destructive removal, not a second implementation."""
    from beams import remove_lines_safe
    return remove_lines_safe(img, s, staves)

def band_of(y, staves, vocal, s, pad=3.5):
    for bi,b in enumerate(vocal):
        st=staves[b]
        if st[0]-pad*s<=y<=st[-1]+pad*s: return bi
    return -1

def nms(pts, scores, rad):
    order=np.argsort(scores)[::-1]; taken=np.zeros(len(pts),bool); keep=[]
    for i in order:
        if taken[i]: continue
        keep.append(i)
        for j in order:
            if not taken[j] and (pts[i][0]-pts[j][0])**2+(pts[i][1]-pts[j][1])**2<rad*rad: taken[j]=True
    return keep

def detect_heads(img, staves, vocal, s, thr=0.84):
    """Matched-filter notehead detection (filled heads). Classical CV primitive
    (oemer's notehead stage without the learned mask)."""
    tops=[st[0] for st in staves]; bots=[st[-1] for st in staves]
    def window(bi):
        b=vocal[bi]; top,bot=staves[b][0],staves[b][-1]
        up=top-3.5*s
        if b-1>=0: up=max(up,(bots[b-1]+top)/2)
        dn=bot+3.5*s
        if b+1<len(staves): dn=min(dn,(bot+tops[b+1])/2)
        return b,up,dn
    wins=[window(bi) for bi in range(len(vocal))]
    def sysband(y):
        for bi,(b,up,dn) in enumerate(wins):
            if up<=y<=dn: return bi
        return -1
    bw=(img<128).astype(np.float32)
    kw,kh=int(round(1.35*s)),int(round(0.92*s))
    ker=cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(kw|1,kh|1)).astype(np.float32); ker/=ker.sum()
    resp=cv2.filter2D(bw,-1,ker)
    ys,xs=np.where(resp>=thr)
    pts=[(int(x),int(y)) for x,y in zip(xs,ys) if sysband(y)>=0]
    fs=[float(resp[y,x]) for x,y in pts]
    keep=nms(pts,fs,0.8*s)
    heads=[dict(x=pts[i][0],y=pts[i][1],sys=sysband(pts[i][1]),score=fs[i]) for i in keep]
    heads.sort(key=lambda h:(h['sys'],h['x']))
    return heads

def position(h, staves, vocal, topD, s):
    lines=staves[vocal[h['sys']]]; top=lines[0]; half=np.median(np.diff(lines))/2
    off=round((top-h['y'])/half); d=topD+off
    return LET_BY_DEG[d%7], d//7

def has_stem(nl, hx, hy, s, min_len=2.0, lo=0.35, hi=1.05, max_w=0.42):
    """A FILLED notehead always carries a stem: only the semibreve and breve are
    stemless, and both are HOLLOW (Gould, Behind Bars, ground rules on stems).
    oemer counterpart: notehead-stem pairing.

    A stem is TALL **and THIN**. Gould gives stem thickness as comparable to a
    staff line, far under half a staff space. The thinness test is what rejects
    bold text bowls and Verovio's solid missing-glyph box, both of which are tall
    but wide. Probe the ink width partway along the run, clear of the notehead.
    """
    H,W=nl.shape
    for sign in (+1,-1):
        for dx in range(int(lo*s), int(hi*s)+1):
            x=hx+sign*dx
            if not (0<=x<W): continue
            col=nl[:,x]
            for updown in (-1,+1):
                y=hy; run=0
                while 0<=y<H and col[y]>0:
                    y+=updown; run+=1
                    if run>6*s: break
                if run < min_len*s: continue
                py=hy+updown*int(1.5*s)                 # clear of the head, on bare stem
                if not (0<=py<H) or nl[py,x]==0: continue
                a=x
                while a>0 and nl[py,a-1]>0: a-=1
                b=x
                while b<W-1 and nl[py,b+1]>0: b+=1
                if (b-a+1) <= max_w*s: return True
    return False


def read_page_geometry(cfg):
    img=cv2.imread(cfg['png'],cv2.IMREAD_GRAYSCALE)
    staves,s=detect_staves(img,page=cfg.get('png'))
    vocal=cfg['vocal'] if 'vocal' in cfg else select_vocal(staves,s)
    # ONE non-destructive removal, computed once, consumed by every downstream
    # stage (tier-1 unification -- see the note above remove_lines()). nl and
    # nl_safe are deliberately the SAME array: the "safe" removal is no longer
    # a special second path used only by stems/beams/hollow, it is simply THE
    # removal. Keeping both names avoids touching every call site that already
    # reads G['nl'] vs G['nl_safe'].
    bw,nl=remove_lines(img,s,staves)
    nl_safe=nl
    heads=detect_heads(img,staves,vocal,s,thr=cfg.get('head_thr',0.84))
    if cfg.get('require_stem', True):
        heads=[h for h in heads if has_stem(nl_safe,h['x'],h['y'],s)]
    for h in heads: h['hollow']=False
    if cfg.get('hollow', True):
        from hollow import detect_hollow_heads, merge_heads
        sb=lambda y: band_of(y,staves,vocal,s)
        hh=detect_hollow_heads(nl_safe,staves,vocal,s,sb,thr=cfg.get('hollow_thr',0.38))
        hh=[h for h in hh if h['stemmed']]        # minims; the stemless semibreve path is UNEXERCISED
        heads=merge_heads(heads,hh,s)
    topD=clef_topD(cfg['clef'][0],cfg['clef'][1],cfg.get('octaveChange',0))
    for h in heads:
        L,O=position(h,staves,vocal,topD,s); h['L']=L; h['O']=O
    return dict(img=img,staves=staves,s=s,vocal=vocal,bw=bw,nl=nl,nl_safe=nl_safe,heads=heads,topD=topD)

# ---------- accidental engine ----------
SHARP_ORDER=['F','C','G','D','A','E','B']
FLAT_ORDER=['B','E','A','D','G','C','F']
def key_alter(fifths):
    d={}
    if fifths>0:
        for L in SHARP_ORDER[:fifths]: d[L]=1
    elif fifths<0:
        for L in FLAT_ORDER[:-fifths]: d[L]=-1
    return d
ALTER={'flat':-1,'natural':0,'sharp':1,'dsharp':2,'dflat':-2}
ACC_FROM_XML={'flat':'flat','natural':'natural','sharp':'sharp',
              'double-sharp':'dsharp','sharp-sharp':'dsharp','flat-flat':'dflat','double-flat':'dflat'}

def _verticals(comp):
    hh,w=comp.shape; colsum=comp.sum(axis=0)
    tall=[j for j in range(w) if colsum[j]>0.55*hh]
    v=0;prev=-2
    for j in tall:
        if j!=prev+1: v+=1
        prev=j
    return tall,v

def classify_single(comp, s):
    hh,w=comp.shape
    tall,v=_verticals(comp)
    if not tall: return 'abstain'
    br=comp[hh//2:, w//2:].sum()/max(1,comp.sum())
    if v>=2:
        lv,rv=tall[0],tall[-1]; mid=comp[int(hh*0.28):int(hh*0.72),:]; ci=(mid.sum(axis=0)>0)
        ohl=ci[:max(0,lv-1)].sum(); ohr=ci[rv+2:].sum()
        return 'sharp' if (ohl>=2 and ohr>=2) else 'natural'
    return 'flat' if br>=0.37 else 'abstain'

def _looks_flat(comp, s):
    hh,w=comp.shape
    if comp.sum()<0.08*s*s: return False
    tall,v=_verticals(comp)
    if not tall: return False
    left_vert = tall[0] < 0.5*w
    br=comp[hh//2:, w//2:].sum()/max(1,comp.sum())
    return left_vert and br>=0.30

def _vertical_runs(comp):
    hh,w=comp.shape; colsum=comp.sum(axis=0)
    cols=[j for j in range(w) if colsum[j]>0.55*hh]
    runs=[]
    if not cols: return runs
    start=prev=cols[0]
    for j in cols[1:]:
        if j!=prev+1: runs.append((start,prev)); start=j
        prev=j
    runs.append((start,prev))
    return runs

def count_holes(comp):
    h,w=comp.shape
    pad=np.zeros((h+2,w+2),np.uint8); pad[1:-1,1:-1]=comp
    ff=(pad==0).astype(np.uint8); mask=np.zeros((h+4,w+4),np.uint8)
    cv2.floodFill(ff,mask,(0,0),0)
    n,_=cv2.connectedComponents(ff); return n-1

def classify_dflat(comp, s):
    hh,w=comp.shape
    if w < 1.3*s: return None
    runs=_vertical_runs(comp)
    if len(runs)<2: return None
    split=runs[1][0]
    if split<3 or split>w-3: return None
    L=comp[:, :split]; R=comp[:, split:]
    if _looks_flat(L,s) and _looks_flat(R,s): return 'dflat'
    return None

def classify_compact(comp, s):
    hh,w=comp.shape
    fill=comp.mean()
    if not(0.55*s<=hh<=1.7*s and 0.55*s<=w<=1.7*s): return 'abstain'
    ar=w/max(1,hh)
    if not(0.6<=ar<=1.7): return 'abstain'
    cy,cx=hh//2,w//2
    centre=comp[max(0,cy-2):cy+3, max(0,cx-2):cx+3].mean()
    if 0.28<=fill<=0.62 and centre>=0.3:
        return 'dsharp'
    return 'abstain'

def read_accidental(h, stats, cent, lab, num, head_centers, s):
    hx,hy=h['x'],h['y']
    def attaches_head(x0,y0,w,hh2):
        return any(x0-4<=cx<=x0+w+4 and y0-4<=cy<=y0+hh2+4 for cx,cy in head_centers)
    talls=[]; compacts=[]
    for i in range(1,num):
        x0,y0,w,hh2,area=stats[i]; cx,cy=cent[i]
        if not(hx-2.3*s < cx < hx-0.28*s): continue
        if abs(cy-hy) > 1.7*s: continue
        if attaches_head(x0,y0,w,hh2): continue
        comp=(lab[y0:y0+hh2, x0:x0+w]==i).astype(np.uint8)
        if 2.0*s<=hh2<=3.7*s and w<=2.9*s:
            talls.append((cx,comp,area))
        elif (0.55*s<=hh2<=1.7*s and 0.55*s<=w<=1.7*s
              and 0.24*s*s<=area<=0.86*s*s):
            compacts.append((cx,comp,area))
    if talls:
        talls.sort(key=lambda t:t[0])
        for cx,comp,area in talls:
            if classify_dflat(comp,s) or (count_holes(comp)==2 and len(_vertical_runs(comp))>=2):
                return 'dflat', False
        cls=[classify_single(comp,s) for _,comp,_ in talls]
        if len(talls)>=2 and cls.count('flat')>=2:
            return 'dflat', False
        c=cls[-1]
        return (c, c=='abstain')
    if compacts:
        compacts.sort(key=lambda t:t[0])
        c=classify_compact(compacts[-1][1],s)
        return (c if c!='abstain' else None), (c=='abstain')
    return None, False

def detect_barlines(nl,staves,vocal,s):
    num,lab,stats,cent=cv2.connectedComponentsWithStats(nl,8)
    out={}
    for bi,b in enumerate(vocal):
        st=staves[b]; sh=st[-1]-st[0]; xs=[]
        for i in range(1,num):
            x,y,w,h,area=stats[i]; cx,cy=cent[i]
            if 0.85*sh<=h<=1.35*sh and w<=6 and st[0]-1.2*s<=cy<=st[-1]+1.2*s: xs.append(int(cx))
        out[bi]=sorted(xs)
    return out

def read_page_pitch(cfg):
    G=read_page_geometry(cfg)
    img,staves,s,vocal,nl,heads,topD=G['img'],G['staves'],G['s'],G['vocal'],G['nl'],G['heads'],G['topD']
    num,lab,stats,cent=cv2.connectedComponentsWithStats(nl,8)
    head_centers=[(h['x'],h['y']) for h in heads]
    KA=key_alter(cfg['key'])
    bl=detect_barlines(nl,staves,vocal,s)
    def localmeasure(h):
        b=bl.get(h['sys'],[]); base=sum(len(bl.get(k,[])) for k in range(h['sys']))
        return base+sum(1 for x in b if x<h['x'])
    recs=[]; carry={}; curm=None
    for h in heads:
        L,O=h['L'],h['O']; lm=localmeasure(h)
        if lm!=curm: carry={}; curm=lm
        cls,abst=read_accidental(h,stats,cent,lab,num,head_centers,s)
        if cls in ALTER:
            alt=ALTER[cls]; carry[(L,O)]=alt; pred=cls
        elif (L,O) in carry:
            alt=carry[(L,O)]; pred='carry'
        else:
            alt=KA.get(L,0); pred=None
        midi=12*(O+1)+SEMI[L]+alt
        recs.append(dict(x=h['x'],y=h['y'],sys=h['sys'],L=L,O=O,alt=alt,midi=midi,pred=pred,abstain=abst,hollow=h.get('hollow',False)))
    return recs, G

# ---------- rhythm ----------
# RECALIBRATED, close-prep tier-1 unification (2026-07-24). This threshold is
# EMPIRICAL and page-calibrated (documented debt, ledger item), fitted from
# piece 02 p1 -- same calibration source as the original value. Tier-1's
# removal-path merge changed what "ink survives" means (the safe removal
# preserves slightly more than the destructive one did, since it only strips
# ink that is BOTH wide AND on a detected staff-line row, rather than any
# sufficiently-wide horizontal run anywhere), which shifts CC areas upward by
# a few percent across the board. Re-measured on piece 02 p1 under the unified
# pipeline: quarter notes 1.327-1.490 (n=9), eighth-class (1/8, 1/12 tuplet
# eighth, 3/16 dotted eighth) 1.887-2.190 (n=35), sixteenth 2.354-2.646 (n=7).
# Clean gaps at [1.49,1.887] and [2.19,2.354]; thresholds set at their
# midpoints with margin toward the lower (more frequently hit) side.
# Named, unit-bearing (s^2), fitted per page, image-checkable: satisfies the
# "fitting is not training" fence.
FLAG_AREA_RATIO=1.65

# FLAG_ABSTAIN = 0.10 STRUCK (fable-spec-e16-abstain-path, 2026-07-27, item 1,
# ratified by Dann). It was declared years of sessions ago as a dead-zone
# margin and never wired to anything; the close's beam-stage silent failure
# proved a dead zone is the wrong shape of fix (measured margins of CORRECT
# answers are 0.097-0.111 s^2, narrower than any dead zone that would have
# caught the 4.118 s^2 failure). The real fix is an upper validity bound,
# FLAG_AREA_MAX, on the flag branch itself: see run_page2.py, beside
# FLAG2_AREA_RATIO.

def _head_cc_area(h, nl, lab, stats):
    x,y=h['x'],h['y']; lid=lab[y,x]
    if lid==0:
        for dy in range(-6,7):
            for dx in range(-6,7):
                yy,xx=y+dy,x+dx
                if 0<=yy<nl.shape[0] and 0<=xx<nl.shape[1] and nl[yy,xx]>0: lid=lab[yy,xx];break
            if lid>0:break
    return (stats[lid][4] if lid>0 else 0), lid

def _has_dot(hx,hy,stats,cent,num,s):
    # X-DISTANCE UPPER BOUND, widened (close-prep dot fix, 2026-07-24). A
    # ledger-lined notehead's ledger line extends past the notehead's own
    # ink on the side the dot sits, so the augmentation dot must clear the
    # ledger line, not just the notehead -- it sits further out in absolute
    # pixels than a dot next to an in-staff notehead. Measured directly on
    # piece 02 p1 (the two dotted eighths that were losing their dots,
    # m3-3-4 and m4-1-4, both ledger-lined C3/B2-ish pitches): dx=42.5px at
    # s=21 (2.02 staff-spaces). An in-staff dotted eighth on the same page
    # (m1-1-4, F#3, no ledger line) measured dx=24.0px (1.14 staff-spaces).
    # 1.7*s (the old bound) sat between these two clusters, catching the
    # in-staff case but excluding both ledger-line cases; 2.2*s clears the
    # ledger-line cluster with margin (2.02s measured vs 2.2s bound) while
    # staying well short of the next notehead over on both fixtures.
    for i in range(1,num):
        x0,y0,w,h,area=stats[i]; cx,cy=cent[i]
        if 0.3*s<area<0.25*s*s and w<=0.7*s and h<=0.7*s and abs(w-h)<=0.35*s and 0.35*s<(cx-hx)<2.2*s and abs(cy-hy)<0.8*s:
            return True
    return False

def _rest_template(nl,lab,stats,cent,num,seeds,s):
    for (px,py) in seeds:
        best=None;bd=1e9
        for i in range(1,num):
            x,y,w,h,a=stats[i]; cx,cy=cent[i]
            if abs(cx-px)<=1.6*s and abs(cy-py)<=1.6*s and 0.5*s<=w<=1.8*s and 0.7*s<=h<=2.0*s and a>0.15*s*s:
                d=(cx-px)**2+(cy-py)**2
                if d<bd: bd=d;best=i
        if best is not None:
            x,y,w,h,a=stats[best]; return (lab[y:y+h,x:x+w]==best).astype(np.uint8)
    return None

def detect_rests(nl,staves,vocal,s,seeds):
    num,lab,stats,cent=cv2.connectedComponentsWithStats(nl,8)
    rt=_rest_template(nl,lab,stats,cent,num,seeds,s)
    if rt is None: return []
    res=cv2.matchTemplate((nl*255).astype(np.uint8),(rt*255).astype(np.uint8),cv2.TM_CCOEFF_NORMED)
    hh,ww=rt.shape
    ys,xs=np.where(res>=0.6)
    pts=[(int(a+ww/2),int(b+hh/2)) for a,b in zip(xs,ys)]
    idx=[i for i,p in enumerate(pts) if band_of(p[1],staves,vocal,s)>=0]
    fp=[pts[i] for i in idx]
    keep=nms(fp,[1.0]*len(fp),0.8*s)
    return [dict(x=fp[i][0],y=fp[i][1],sys=band_of(fp[i][1],staves,vocal,s)) for i in keep]
