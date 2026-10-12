"""Row 77: print the first part's measure(s) of an opened song's reading, by 0-based index. Usage: python3 meas.py <musicxml> <i>..."""
import re,sys
x=open(sys.argv[1]).read()
p=x[x.index('<part '):]; p=p[:p.index('</part>')]
ms=re.findall(r'<measure[\s\S]*?</measure>',p)
for i in map(int,sys.argv[2:]): print(f'--- {i}'); print(ms[i])
