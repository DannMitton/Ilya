import json, glob, os, collections, numpy as np
W=os.path.expanduser('~/Downloads/_desk-row105'); P=[]; fonts=collections.Counter(); f1=collections.Counter(); st=collections.Counter()
for f in glob.glob(W+'/raw/kind2/_render_*.json'):
    for i,s,p in json.load(open(f)):
        st[s]+=1
        if s=='ok': P.append(p); fonts[p['font']]+=1
for f in glob.glob(W+'/raw/kind1/_render_*.json'):
    for i,s,p in json.load(open(f)):
        if s=='ok': f1[p['font']]+=1
out={'kind2_status':dict(st),'kind2_font_counts':dict(fonts),'kind1_font_counts':dict(f1)}
def q(k):
    v=np.array([p[k] for p in P if k in p],dtype=float); return None if len(v)==0 else [round(float(x),3) for x in (v.min(),np.percentile(v,50),v.max())]
for k in ['H','sw','rot_deg','fade','erode_share','erode_k_over_sw','dil_share','dil_k_over_sw','salt','pepper','asc_over_H','desc_over_H','cut_asc_frac','cut_desc_frac','bold_1px_over_sw']: out[k+'_min_median_max']=q(k)
for k in ['cut_through_ascenders','staff','stems','barline']: out[k+'_share']=round(sum(1 for p in P if p.get(k))/len(P),3)
out['bold_share']=round(sum(1 for p in P if p.get('bold_1px_over_sw'))/len(P),3)
json.dump(out,open('damage-summary.json','w'),indent=1); print(json.dumps(out,indent=1))
