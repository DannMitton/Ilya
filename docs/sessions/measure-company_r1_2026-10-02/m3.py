import reader, clefkey, hollow, json
def main(args,paths):
    out={}
    p=paths[0]
    om=reader.merge_ossia
    def wrap(heads,nl,s,braced):
        out['before_ossia']=[(h['x'],h['y'],h['sys'],bool(h.get('hollow'))) for h in heads if abs(h['x']-2107)<150 and h['sys']==2]
        r=om(heads,nl,s,braced)
        out['after_ossia']=[(h['x'],h['y'],h['sys']) for h in r[0] if abs(h['x']-2107)<150 and h['sys']==2]
        out['alts']=r[1]
        return r
    reader.merge_ossia=wrap
    G=reader.read_page_geometry(dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m'))
    img,nl,staves,s,vocal=G['img'],G['nl_safe'],G['staves'],G['s'],G['vocal']
    h0=reader.detect_heads(img,staves,vocal,s,thr=0.84)
    out['detected']=[(h['x'],h['y'],round(h['score'],3)) for h in h0 if abs(h['x']-2107)<150 and h['sys']==2]
    out['passes_stem']=[(h['x'],h['y']) for h in h0 if h['sys']==2 and abs(h['x']-2107)<150 and reader.has_stem(nl,h['x'],h['y'],s)]
    out['final']=[(h['x'],h['y']) for h in G['heads'] if h['sys']==2 and abs(h['x']-2107)<150]
    out['hooks_near']=[k for k in G['hooks'] if k['sys']==2 and abs(k['x']-2107)<150]
    out['spans']=str(clefkey.spans_from(G['clefKeySystems']))
    return out
