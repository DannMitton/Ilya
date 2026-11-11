import numpy as np
S = 8.0

def build(lines, deg, cluster_r=1.8 * S, spur=2.2 * S, look=3.5 * S):
    """Join skeleton pieces into pen strokes: through each crossing, the pieces
    that continue each other's direction become one stroke."""
    nodes = [p for p, d in deg.items() if d != 2]
    # cluster junction pixels that sit close together (a crossing gives two or more)
    cl = {}; cents = []
    for p in nodes:
        if deg[p] == 1: continue
        for i, c in enumerate(cents):
            if (c[0] - p[0]) ** 2 + (c[1] - p[1]) ** 2 < cluster_r ** 2:
                cl[p] = i; break
        else:
            cl[p] = len(cents); cents.append(p)
    edges = []
    for l in lines:
        a, b = l[0], l[-1]
        ca, cb = cl.get(a), cl.get(b)
        fa, fb = deg.get(a) == 1, deg.get(b) == 1
        if (fa != fb) and len(l) < spur and len(lines) > 1: continue
        if ca is not None and ca == cb and len(l) < 1.0 * cluster_r: continue  # link inside a crossing
        edges.append({'pts': np.array([(p[1], p[0]) for p in l], float), 'ends': [ca, cb]})
    # direction of each edge end, pointing into the crossing
    def tip_dir(e, end):
        pts = e['pts'] if end == 1 else e['pts'][::-1]
        tip = pts[-1]; d = np.cumsum(np.r_[0, np.hypot(*np.diff(pts[::-1], axis=0).T)])
        k = np.searchsorted(d, look); back = pts[::-1][min(k, len(pts) - 1)]
        v = tip - back; n = np.hypot(*v)
        return v / n if n else v
    inc = {}
    for i, e in enumerate(edges):
        for end in (0, 1):
            c = e['ends'][end]
            if c is not None: inc.setdefault(c, []).append((i, end, tip_dir(e, end)))
    partner = {}
    for c, lst in inc.items():
        pairs = []
        for x in range(len(lst)):
            for y in range(x + 1, len(lst)):
                (i, ei, di), (j, ej, dj) = lst[x], lst[y]
                if i == j and len(lst) > 2: continue
                pairs.append((float(di @ -dj), x, y))
        used = set()
        for score, x, y in sorted(pairs, reverse=True):
            if score < np.cos(np.radians(35)) or x in used or y in used: continue
            used |= {x, y}
            (i, ei, _), (j, ej, _) = lst[x], lst[y]
            partner[(i, ei)] = (j, ej, cents[c]); partner[(j, ej)] = (i, ei, cents[c])
    seen = set(); strokes = []
    for i in range(len(edges)):
        if i in seen: continue
        # walk to one end of the chain
        cur, end = i, 0
        guard = 0
        while (cur, end) in partner and guard < 50:
            j, ej, _ = partner[(cur, end)]
            if j == i: break
            cur, end = j, 1 - ej; guard += 1
        # now traverse from (cur, end) outward
        chain = []; c, e = cur, end; guard = 0; free_start = edges[cur]['ends'][end] is None
        while guard < 50:
            seen.add(c)
            pts = edges[c]['pts'] if e == 0 else edges[c]['pts'][::-1]
            chain.append(pts)
            out = 1 - e
            if (c, out) not in partner: free_end = edges[c]['ends'][out] is None; break
            j, ej, _ = partner[(c, out)]
            if j in seen: free_end = False; break
            c, e = j, ej; guard += 1
        else:
            free_end = False
        strokes.append({'pts': np.concatenate(chain), 'free': (free_start, free_end)})
    return strokes
