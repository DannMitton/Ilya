import json,sys
a=json.load(open(sys.argv[1]))['results']; b=json.load(open(sys.argv[2]))['results']
keys=['sheetW','sheetH']
def pick(p):
    f=p.get('footer') or {}; h=p.get('header') or {}; w=p.get('window') or {}
    return dict(hdr=h.get('offsetHeight'),rule=round(h.get('ruleBottom',0),2),run=p.get('runningHeaderOffsetHeight'),win=[round(w.get(k,0),2) for k in 'tbl'] if w else None,
      winr=round(w.get('r',0),2) if w else None, foot=f.get('offsetHeight'),hair=f.get('hairlineTopFromSheetBottom'),fl=f.get('left'),fr=f.get('right'),
      glyph=(p.get('firstGlyph') or {}).get('left'),lines=p.get('lines'),systems=p.get('systems'),parts=p.get('parts'),aside=p.get('headerAsideClientWidth'),below=p.get('rowsEndingBelowWindow'),pc=f.get('paginationCellWidth'),cr=f.get('creditLines'))
diffs=0
for k in a:
    if 'error' in a[k] or 'error' in b.get(k,{'error':1}): print(k,'ERROR'); diffs+=1; continue
    pa,pb=a[k]['pages'],b[k]['pages']
    if len(pa)!=len(pb): print(k,'PAGE COUNT',len(pa),len(pb)); diffs+=1; continue
    for i,(x,y) in enumerate(zip(pa,pb)):
        X,Y=pick(x),pick(y)
        d={n:(X[n],Y[n]) for n in X if X[n]!=Y[n]}
        if d: print(k,'p',i+1,d); diffs+=1
print('differences:',diffs)
