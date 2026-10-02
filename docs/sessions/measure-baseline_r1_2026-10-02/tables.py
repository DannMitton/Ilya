import json
M=json.load(open('mismatches.json'))
C={
1:["reader error: quarter note, length abstained (`beam_scale_ink_no_beam`)",
"reader error: B♭ with its flat, pitch abstained. and the quarter read as a dotted quarter. The scan spells it B♭ and the file A♯3: the same sound, a different spelling",
"reader error: the natural sign before F is not read (read F♯), and the length abstained",
"reader error: an eighth F♮ read as F♯, length abstained",
"reader error: the printed eighth rest is not emitted",
"reader error: B on the middle line read as C",
"reader error: a quarter read as a dotted quarter",
"reader error: an eighth read as a dotted eighth",
"reader error: the printed eighth rest is not emitted",
"reader error: an eighth, length abstained",
"reader error: an eighth, length abstained",
"reader error: the printed eighth rest is not emitted",
"reader error: a quarter read as a dotted quarter",
"reader error: a quarter read as a dotted quarter",
"reader error: a dotted quarter F♮ read as F♯, length abstained",
"reader error: an eighth, length abstained",
"reader error: an eighth read as a dotted eighth",
"reader error: the printed eighth rest is not emitted",
"reader error: a quarter read as an eighth",
"reader error: an F♯ eighth read as D♯, length abstained"],
4:["reader error: the printed eighth rest is not emitted",
"reader error: a quarter, length abstained",
"reader error: an eighth, length abstained",
"reader error: the printed eighth rest is not emitted",
"reader error: the eighth rest that opens bar 2 is not emitted",
"reader error: an eighth, length abstained",
"reader error: an eighth read as a sixteenth",
"reader error: an eighth, length abstained",
"reader error: a quarter read as an eighth",
"reader error: the printed eighth rest is not emitted",
"reader error: the printed quarter rest is not emitted",
"reader error: a quarter read as a dotted eighth",
"reader error: an eighth read as a dotted eighth",
"reader error: an eighth read as a dotted eighth",
"reader error: an eighth read as a quarter",
"reader error: A♯4 (sharp sign) read as G4",
"reader error: the printed eighth rest is not emitted",
"reader error: A♯4 (the sharp carries through the bar) read as G4",
"reader error: an eighth read as a dotted eighth",
"reader error: A♮ (natural sign) pitch abstained, and a quarter read as a dotted quarter"],
5:["reader error: the half rest of the opening bar is not emitted",
"reader error: the quarter rest of the opening bar is not emitted",
"reader error: the eighth-triplet rest of the opening bar is not emitted",
"reader error, and an alignment shift with #5 and #6: the reader's one note in bar 0 is the printed D♯3 triplet eighth, read as D3 with length 1/16 (sharp and triplet unread). The aligner pairs it with the next bar's first note, which leaves this note missing",
"see #4: the reader's D3 1/16 of bar 0 stands for the printed pickup note, not for this one",
"see #4: the reader's C3 1/16 is the printed first note of bar 1, a C with a double sharp (D3), read as C3 with the double sharp unread",
"reader error: an eighth with the double sharp carried through the bar, read as C3, length abstained",
"reader error: the printed eighth rest is not emitted",
"reader error: a dotted quarter D♮ read as a dotted eighth",
"reader error: an eighth, length abstained",
"reader error: a quarter read as an eighth",
"reader error: an eighth read as a sixteenth",
"reader error: the printed eighth rest is not emitted",
"reader error: the printed quarter rest is not emitted",
"reader error: the printed eighth rest is not emitted",
"reader error: an eighth read as a sixteenth",
"reader error: a dotted eighth read as a sixteenth",
"reader error: a sixteenth G♯, length abstained",
"reader error: an eighth D♯, length abstained",
"reader error: an eighth read as a sixteenth"],
6:["reader error: the hollow half note C♯3 (on a ledger line) is not read",
"reader error: a quarter read as an eighth",
"reader error: a quarter read as an eighth",
"reader error: the hollow half note F♯3 is not read",
"reader error: a quarter read as a dotted eighth",
"reader error: a quarter read as an eighth",
"reader error: the hollow half note G♯3 is not read",
"reader error: A with a natural sign read as A♯, and a quarter read as a dotted thirty-second",
"reader error: a quarter read as an eighth",
"reader error: a dotted quarter read as a dotted eighth",
"reader error: an eighth read as a sixteenth",
"reader error: a quarter read as a dotted eighth",
"reader error: the printed quarter rest is not emitted",
"reader error: the hollow half note A♮ is not read",
"reader error: the quarter E♮ (natural sign) is not read",
"reader error: a quarter read as an eighth",
"reader error: the hollow half note A♮ is read as B (the natural sign and the position)",
"reader error: an eighth E♮ read as D, and as a sixteenth",
"reader error: the printed eighth rest is not emitted",
"reader error: a quarter read as a half note"]}
out=[]
NAMES={1:'*Sunless* 1',4:'*Sunless* 4',5:'*Sunless* 5',6:'*Sunless* 6'}
for n in ('1','4','5','6'):
    r=M[n]; out.append('### %s (the reader gives the file\'s octave +%d)\n'%(NAMES[int(n)],r['shift']))
    out.append('| # | difference | scan page, system | bar (file, reader) | the file says | the reader says | my call | crop |')
    out.append('|---|---|---|---|---|---|---|---|')
    for i,o in enumerate(r['diffs']):
        L=o['loc'] or {}
        t=o['truth']; rd=o['reader']
        ts='-' if not t else ('rest %s'%t['len'] if t['type']=='rest' else '%s %s'%(t['name'],t['len']))
        if not rd: rs='nothing'
        elif rd['type']=='rest': rs='rest %s'%rd['len']
        else:
            nm=rd['name'] if rd['name'] else ('abstained (%s assumed)'%rd['assumed'] if rd['assumed'] else 'abstained')
            rs='%s %s'%(nm,rd['len'] or 'abstained')
        tb='-' if o['truthBar'] is None else o['truthBar']
        rb='-' if o['readerBar'] is None else o['readerBar']
        out.append('| %d | %s | p. %s, system %s | %s, %s | %s | %s | %s | `crops.files/song%s-bar%s.png` |'%(i+1,o['kind'],L.get('page','-'),L.get('system','-'),tb,rb,ts,rs,C[int(n)][i],n,o['readerBar']))
    out.append('')
open('mismatch-tables.md','w').write('\n'.join(out))
print(len(out))
