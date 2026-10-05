import xml.etree.ElementTree as ET, json, sys
from fractions import Fraction as F
TYPE={'whole':F(1),'half':F(1,2),'quarter':F(1,4),'eighth':F(1,8),'16th':F(1,16),'32nd':F(1,32),'64th':F(1,64),'breve':F(2)}
ST={'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}
def convert(files):
    events=[]; bars=[]; mi=0; pages=[]
    for f in files:
        root=ET.parse(f).getroot()
        p=root.findall('part')[0]
        metre=None; n0=len(events); m0=mi
        for m in p.findall('measure'):
            for a in m.findall('attributes'):
                t=a.find('time')
                if t is not None:
                    try: metre=dict(beats=int(t.findtext('beats')),beatType=int(t.findtext('beat-type')))
                    except Exception: metre=None
            evs=[]
            for n in m.findall('note'):
                if (n.findtext('staff') or '1')!='1': continue
                if n.find('chord') is not None: continue
                if n.find('grace') is not None: continue
                ty=n.findtext('type'); d=TYPE.get(ty)
                if d is not None:
                    dots=len(n.findall('dot')); k=d
                    for _ in range(dots): k/=2; d+=k
                    tm=n.find('time-modification')
                    if tm is not None:
                        d=d*int(tm.findtext('normal-notes'))/int(tm.findtext('actual-notes'))
                dur=None if d is None else dict(numerator=d.numerator,denominator=d.denominator)
                if n.find('rest') is not None:
                    evs.append(dict(type='rest',measureIndex=mi,duration=dur,whole=(ty=='whole' or n.find('rest').get('measure')=='yes')))
                else:
                    pt=n.find('pitch'); alter=int(float(pt.findtext('alter') or 0))
                    midi=(int(pt.findtext('octave'))+1)*12+ST[pt.findtext('step')]+alter
                    evs.append(dict(type='note',measureIndex=mi,midi=midi,duration=dur))
            # a bar holding only rests is a bar of rest: the truth files carry no event for it
            if all(e['type']=='rest' for e in evs) and (len(evs)==1): evs=[]
            for e in evs: e.pop('whole',None)
            events+=evs
            bars.append(dict(measureIndex=mi,metre=metre,measureDuration=None))
            mi+=1
        pages.append(dict(file=f,bars=mi-m0,events=len(events)-n0))
    return dict(events=events,bars=bars,pages=pages)
if __name__=='__main__':
    out=sys.argv[1]; files=sys.argv[2:]
    json.dump(convert(files),open(out,'w'))
    r=json.load(open(out)); print(out,[ (p['bars'],p['events']) for p in r['pages']])
