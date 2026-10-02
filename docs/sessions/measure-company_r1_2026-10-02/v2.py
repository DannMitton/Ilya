import reader, json
def main(args,paths):
    out=[]
    for n,p in zip(args['names'],paths):
        try:
            G0=reader.read_page_geometry(dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m',company=False))
            G1=reader.read_page_geometry(dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m'))
            h0=[(h['x'],h['y'],h['sys'],h['L'],h['O']) for h in G0['heads']]; h1=[(h['x'],h['y'],h['sys'],h['L'],h['O']) for h in G1['heads']]
            out.append(dict(page=n,same=h0==h1,n=len(h1),byCompany=len(G1['byCompany']),systems=len(G1['vocal'])))
        except Exception as e:
            out.append(dict(page=n,error=str(e)[:80]))
    return out
