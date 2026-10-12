"""Row 80, step 4: per split bar, the Russian syllables the text gives (the truth file's syllables, standing in for the poem
placed in its bars), the notes the truth counts in the bar (the Russian line, ties and melismas included), the notes homr read,
and the notes measure E keeps (from step3.py's rows). Usage: python3 step4.py <words dir> <letter> <truth.json> <bars a-b,...>"""
import json,sys,subprocess,io,contextlib,runpy
WD,L,TR,spec=sys.argv[1:5]
want=[tuple(map(int,s.split('-'))) for s in spec.split(',')]
t=json.load(open(TR)); tn=[n for n in t['verses'][0]['notes'] if n['type']=='note']
sys.argv=['step3.py',WD,L,TR]; buf=io.StringIO()
with contextlib.redirect_stdout(buf): g=runpy.run_path('step3.py')
rows=g['rows']
print(f"{'bar':>3} {'syllables':>9} {'truth notes':>11} {'read':>4} {'read, song':>10} {'E kept':>6} {'E kept, song':>12}")
for a,b in want:
    for bar in range(a,b+1):
        syl=sum(1 for n in tn if n['measureIndex']==bar and (n.get('syllable') or '_')!='_')
        tc=sum(1 for n in tn if n['measureIndex']==bar)
        r=[x for x in rows if x['bar']==bar]
        print(f"{bar:3} {syl:9} {tc:11} {len(r):4} {sum(x['status']=='song' for x in r):10} {sum(x['E'] for x in r):6} {sum(x['E'] and x['status']=='song' for x in r):12}")
