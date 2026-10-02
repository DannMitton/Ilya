"""3.5.2: one overlay sheet for each build song, for the desk's eye: the scan in grey, the drawing's ink held by the scan in blue, the
drawing's ink the scan does not hold in orange, the scan's unexplained ink in red. Frame: green = the trial's length is right by the truth,
red = wrong by the truth, grey = no matched truth note; a thin inner colour mark in the label: C = a clear case, P = taken by pass 2."""
import json, sys, base64, numpy as np, cv2
sys.path.insert(0, '.'); import agg
for song in agg.SONGS:
    r, sc = agg.load(song)
    cells = []
    for i, n in enumerate(r['notes']):
        b = r['tiles'].get(str(i))
        if b is None: continue
        im = cv2.imdecode(np.frombuffer(base64.b64decode(b), np.uint8), cv2.IMREAD_COLOR)
        j = agg.judge(n['trial']['dur'], n['truth'])
        col = {'right': (60, 170, 60), 'wrong': (30, 30, 220), 'abstained': (150, 150, 150), None: (170, 170, 170)}[j]
        im = cv2.copyMakeBorder(im, 6, 6, 6, 6, cv2.BORDER_CONSTANT, value=col)
        cells.append((im, n))
    H = max(c[0].shape[0] for c in cells) + 22; W = max(c[0].shape[1] for c in cells)
    per = max(1, 3600 // W); rows = []
    for k in range(0, len(cells), per):
        row = []
        for im, n in cells[k:k + per]:
            c = np.full((H, W, 3), 255, np.uint8); c[22:22 + im.shape[0], :im.shape[1]] = im
            tag = '%s p%d x%d %s' % ('C' if (n['kind'] and n['dotk']) else 'P', n['page'], n['x'], '/'.join(str(v) for v in n['trial']['dur']))
            cv2.putText(c, tag, (2, 15), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (0, 0, 0), 1, cv2.LINE_AA)
            row.append(c)
        while len(row) < per: row.append(np.full((H, W, 3), 255, np.uint8))
        rows.append(np.hstack(row))
    sheet = np.vstack(rows)
    cv2.imwrite('overlay-sheets.files/%s_overlay.png' % agg.NAME[song].replace(' ', '_'), sheet)
    print(agg.NAME[song], len(cells), 'tiles', sheet.shape)
