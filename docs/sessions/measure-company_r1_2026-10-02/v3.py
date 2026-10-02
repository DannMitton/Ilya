import reader
def main(args,paths):
    out=[]
    for n,p in zip(args['names'],paths):
        G=reader.read_page_geometry(dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m'))
        v=G['vocal']
        a=reader.read_page_geometry(dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m',vocal=v,company=False))
        b=reader.read_page_geometry(dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m',vocal=v))
        ha=[(h['x'],h['y'],h['sys'],h['L'],h['O'],h.get('hollow')) for h in a['heads']]; hb=[(h['x'],h['y'],h['sys'],h['L'],h['O'],h.get('hollow')) for h in b['heads']]
        out.append(dict(page=n,with_vocal_same=ha==hb,n=len(hb),byCompany=len(b['byCompany']),without_vocal_byCompany=len(G['byCompany'])))
    return out
