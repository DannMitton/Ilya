import json,sys
d=json.load(open(sys.argv[1]))['results']
for k,v in d.items():
    if 'error' in v: print(k,'ERROR',v['error'][:100]); continue
    print('==',k,'pages',len(v['pages']),'htmlFont',v['htmlFontSize'])
    for i,p in enumerate(v['pages']):
        f=p.get('footer') or {}
        h=p.get('header') or {}
        w=p.get('window') or {}
        ctl=p.get('lines') or p.get('systems') or p.get('parts')
        print(f" p{i+1} hdr={h.get('offsetHeight')} run={p.get('runningHeaderOffsetHeight')} rule={round(h.get('ruleBottom',0),2)} win=({round(w.get('t',0),1)},{round(w.get('b',0),1)},l{round(w.get('l',0),1)}) foot={f.get('offsetHeight')} hair={f.get('hairlineTopFromSheetBottom')} fc={f.get('footerContentHeight')} band={f.get('bandHeight')} credit={f.get('creditLines')}{'R' if f.get('creditHasRichter') else ''} pc={round(f.get('paginationCellWidth') or 0,1)} aside={p.get('headerAsideClientWidth')} glyph={(p.get('firstGlyph') or {}).get('left')} ctl={ctl} below={p.get('rowsEndingBelowWindow')}")
