import glob, os, json
import numpy as np
from staff import load, find_staves, clean_staves, lines_at
import pickle
allst = {}
for f in sorted(glob.glob('pages_d/*.png')):
    name = os.path.basename(f)[:-4]
    g = load(f)
    sts = clean_staves(find_staves(g))
    allst[name] = sts
    if not sts: print(name, 'none'); continue
    sp = np.median([s['space'] for s in sts])
    tops = [lines_at(s, (s['x0']+s['x1'])/2) for s in sts]
    gaps = [round((tops[i+1][0]-tops[i][4])/sp,1) for i in range(len(sts)-1)]
    ext = [round((s['x1']-s['x0'])/g.shape[1],2) for s in sts]
    print(name, len(sts), 'gaps', gaps, 'x0', [int(s['x0']/sp) for s in sts])
pickle.dump(allst, open('staves.pkl','wb'))
