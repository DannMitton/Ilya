import json,sys,glob,os
def row(p):
    d=json.load(open(p)); n=d['notes']
    return d
def show(label, d):
    for song in sorted(glob.glob(d+'/song*.*.json')):
        pass
import re
def table(d):
    out=[]
    for n in range(1,8):
        for kind in ('score','totals'):
            p=f'{d}/song{n}.{kind}.json'
            if os.path.exists(p):
                j=json.load(open(p)); nn=j['notes']
                out.append((n,kind=='totals',nn['matched'],nn['pitchRight'],nn['lengthRight'],nn['lengthWrong'],nn['lengthAbstained'],nn['bothRight'],round(j['headline'],1), nn['truth']))
    return out
if __name__=='__main__':
    for d in sys.argv[1:]:
        print('##',d)
        print('song | matched | pitchRight | lenRight | lenWrong | lenAbst | bothRight | headline | truth notes')
        for r in table(d): print(' | '.join(str(x) for x in (('%d%s'%(r[0],' (test, totals)' if r[1] else ''),)+r[2:])))
