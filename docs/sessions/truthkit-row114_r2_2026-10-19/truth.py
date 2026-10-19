#!/usr/bin/env python3
"""Truth kit: a compact voice-line notation -> MusicXML (for Verovio rendering) and the harness's truth JSON.

Changes of 2026-10-19 (Dann's proof findings, desk decisions):
  1. Accidentals as printed: a note draws its sign only when its alteration differs from the key and the signs
     already drawn in the bar (step and octave; cleared at each barline; a tie's second note draws none), or when
     the draft marks the print's own sign: `!` after the pitch (a sign the rule would omit), `()` (a sign in
     parentheses). Truth JSON: printedAccidental, printedAccidentalParenthesized. Double sharp `##`, double flat `bb`.
  2. Key changes on the page: `b7 key=-1:` (with a metre: `b7 3/4 key=-1:`). The cancelled signature is drawn;
     a change at a system's first bar also draws a courtesy signature at the end of the previous system. Mid-system,
     the cancelling naturals stand before the barline and the new signature after it, as this edition prints them.
     Truth JSON: measureKeys [{index, fifths}] for every measure.
  3. Whole-bar rest `R` (alone in its bar): the bar's metre, drawn as a centred semibreve rest (measure="yes").
  4. `// system N (piano only)`: a system with no voice staff, written as R bars; truth JSON marks
     measureDurations[i].pianoOnly.
  5. Vocal beaming: only the notes of one syllable's melisma (and tied notes) are beamed, split at the beat.
  6. A hyphenated syllable that is the last of its system draws its hyphen (text with a visible trailing hyphen).
  7. Time signature drawn only where the print shows one: header `showtime: yes` for the page's first system,
     and at every metre change; elsewhere `<time print-object="no">` (render.js removes it from the SVG).
     A metre in force but not printed is written in brackets: `b3 [12/8]:`.
  8. Markings after the value: @acc @sacc @stacc @staccissimo @ten @ferm @breath; `^` or `_` after one forces
     above or below. Truth JSON: articulations [...], fermata: true.
  9. Bar option `err="..."` (after the number, metre, and key): truth JSON measureDurations[i].printError.
 10. Ossia: a line `b18 oss: <events>` directly under `b18:` holds the lower option; it must sum like the bar. Drawn as
     voice 2 on the same staff (stems down, voice 1 stems up in that bar), lyrics on voice 1 only. Truth JSON:
     ossia [{measureIndex, notes:[... option: "lower"]}]. Its accidentals follow the same rule, voice by voice.
 12. Slurs (2026-10-19): `(` after a note's value (after its dots) starts a slur on it, `)` ends one on it; they may
     stand in any order with `~` and the @marks (`D5/8( "ми-" | C#5/8) -`; `B4/4)(` ends one slur and starts the next).
     Slurs nest only as written: a `)` closes the most recently opened slur. A tie stays `~` and is never a slur.
     MusicXML: <slur type="start|stop" number="L"/> (L the lowest level free when it starts). A slur that crosses a
     system break is drawn open on both sides (an invisible grace note carries each far end, as for ties); a `(` with
     no `)` on the page leaves the page; a `)` with no `(` arrives from the previous page. Truth JSON: slurStart: n and
     slurStop: n on the note, n the slur's number on the page (1, 2, ... in order of their starts; a slur arriving from
     the previous page is numbered where it stops); a note that starts or stops two slurs carries a list.
 11. Ties across a break: `~` before a pitch marks the end of a tie that arrives from the previous page (truth JSON
     tieStop: true). A tie that leaves the page, or crosses a system break, draws its arc on both sides: Verovio
     draws no arc for a tie with one end missing, so the kit ties to an invisible grace note (print-object="no").

Format (one bar per line):
  b<n> [<num>/<den> | [<num>/<den>]] [key=<fifths>] [err="<text>"]: <event> | <event> | ...
  b<n> oss: <event> | ...   the ossia's lower option for the bar above
Events:
  C#5/8 "syl"      a note: pitch (letter, accidental # b n ## bb, octave), slash, written value (1 2 4 8 16 32 64), dots as '.'
  Bn4!/4           the print's own sign where the rule would omit it;  Bb4()/2  a sign in parentheses
  C#5/8 -          a melisma continuation (no syllable)
  r/8              a rest;   R   a whole-bar rest (alone in its bar)
  g:E5/16          a grace note (not counted in the bar sum)
  t3[ ... ]        a tuplet, 3 in the time of 2 (t5 = 5 in 4, t7 = 7 in 4, t3:2 explicit)
  ~ after a note   tie to the next note (the next carries no syllable)
  ( ) after a note a slur starts / stops on this note (see 12)
  @acc ...         markings, after the value, dots, and tie
  // text          a comment
Header lines: key: 3 ; time: 4/4 ; clef: G2 ; title: ... ; page: ... ; anacrusis: yes ; showtime: yes
"""
import json, re, sys
from fractions import Fraction

STEP = {'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}
FIFTHS_SHARPS = ['F','C','G','D','A','E','B']
FIFTHS_FLATS = ['B','E','A','D','G','C','F']
TYPE = {1:'whole',2:'half',4:'quarter',8:'eighth',16:'16th',32:'32nd',64:'64th'}
ACC_ALTER = {'#':1,'b':-1,'n':0,'##':2,'bb':-2}
ALTER_NAME = {1:'sharp',-1:'flat',0:'natural',2:'double-sharp',-2:'flat-flat'}
ALTER_TRUTH = {1:'sharp',-1:'flat',0:'natural',2:'double-sharp',-2:'double-flat'}
MARKS = {'acc':'accent','sacc':'strong-accent','stacc':'staccato','staccissimo':'staccatissimo','ten':'tenuto','breath':'breath-mark','ferm':'fermata'}
PITCH = r'([A-G])(##|bb|#|b|n)?(\d)(!)?(\(\))?'

def parse(src):
    hdr = {'key':0,'time':(4,4),'clef':('G',2),'title':'','page':'','anacrusis':False,'showtime':False}
    bars = []; systems = []; piano = []
    for raw in src.splitlines():
        if raw.strip().startswith('// system'):
            systems.append(len(bars)); piano.append('piano only' in raw); continue
        line = raw.split('//')[0].strip()
        if not line: continue
        m = re.match(r'^(key|time|clef|title|page|anacrusis|showtime):\s*(.*)$', line)
        if m:
            k, v = m.group(1), m.group(2).strip()
            if k == 'key': hdr['key'] = int(v)
            elif k == 'time': a, b = v.split('/'); hdr['time'] = (int(a), int(b))
            elif k == 'clef': hdr['clef'] = (v[0], int(v[1]))
            elif k in ('anacrusis', 'showtime'): hdr[k] = v.lower().startswith('y')
            else: hdr[k] = v
            continue
        mo = re.match(r'^b(\d+)\s+oss:\s*(.*)$', line)
        if mo:
            if not bars or bars[-1]['n'] != int(mo.group(1)): raise SystemExit(f'oss line must follow its bar: {raw}')
            bars[-1]['oss'] = parse_events(mo.group(2)); continue
        m = re.match(r'^b(\d+)(?:\s+(\[?)(\d+)/(\d+)\]?)?(?:\s+key=(-?\d+))?(?:\s+err="([^"]*)")?:\s*(.*)$', line)
        if not m: raise SystemExit(f'bad line: {raw}')
        n = int(m.group(1)); tsig = (int(m.group(3)), int(m.group(4))) if m.group(3) else None
        tsig_hidden = bool(m.group(2))
        evs = parse_events(m.group(7))
        if any(e.get('measure_rest') for e in evs) and len(evs) != 1: raise SystemExit(f'R must stand alone in its bar: {raw}')
        bars.append({'n': n, 'tsig': tsig, 'tsig_hidden': tsig_hidden, 'key': int(m.group(5)) if m.group(5) is not None else None,
                     'err': m.group(6), 'events': evs, 'piano': False, 'oss': None})
    if not systems: systems = [0]; piano = [False]
    hdr['systems'] = systems; hdr['piano'] = piano
    for si, st in enumerate(systems):
        end = systems[si + 1] if si + 1 < len(systems) else len(bars)
        for b in bars[st:end]: b['piano'] = piano[si]
    return hdr, bars

def parse_events(s):
    toks = tokenize(s)
    def take(toks):
        ev = []
        while toks:
            t = toks.pop(0)
            if t == '|': continue
            if t == ']': return ev
            tm = re.match(r'^t(\d+)(?::(\d+))?\[$', t)
            if tm:
                actual = int(tm.group(1)); normal = int(tm.group(2)) if tm.group(2) else {3:2,5:4,6:4,7:4}[actual]
                inner = take(toks)
                for e in inner: e['tuplet'] = (actual, normal)
                ev.append({'kind':'tuplet','actual':actual,'normal':normal,'events':inner})
                continue
            grace = t.startswith('g:')
            if grace: t = t[2:]
            tie_in = t.startswith('~')
            if tie_in: t = t[1:]
            rm = re.match(r'^R((?:@[a-z]+[\^_]?)*)$', t)
            if rm:
                ev.append({'kind':'rest','pitch':'r','value':1,'dots':0,'tie':False,'grace':False,'syl':None,
                           'measure_rest':True,'marks':marks_of(rm.group(1))}); continue
            nm = re.match(r'^(r|' + PITCH + r')/(\d+)(\.*)((?:~|\(|\)|@[a-z]+[\^_]?)*)$', t)
            if not nm: raise SystemExit(f'bad token: {t}')
            sfx = nm.group(9)
            if sfx.count('~') > 1: raise SystemExit(f'bad token (two ties): {t}')
            e = {'kind':'rest' if nm.group(1)=='r' else 'note', 'pitch':nm.group(1), 'value':int(nm.group(7)),
                 'dots':len(nm.group(8)), 'tie':'~' in sfx, 'grace':grace, 'syl':None, 'marks':marks_of(sfx),
                 'tie_in': tie_in, 'slur_ops': re.findall(r'[()]', re.sub(r'@[a-z]+[\^_]?', '', sfx))}
            if e['slur_ops'] and e['kind'] != 'note': raise SystemExit(f'a slur starts and stops on a note: {t}')
            if e['kind'] == 'note':
                e['step'], e['acc'], e['oct'] = nm.group(2), nm.group(3) or '', int(nm.group(4))
                e['force'] = bool(nm.group(5)); e['paren'] = bool(nm.group(6))
            if toks and toks[0].startswith('"'):
                e['syl'] = toks.pop(0).strip('"')
            elif toks and toks[0] == '-':
                toks.pop(0); e['syl'] = '-'
            ev.append(e)
        return ev
    return take(toks)

def marks_of(s):
    out = []
    for name, pl in re.findall(r'@([a-z]+)([\^_]?)', s):
        if name not in MARKS: raise SystemExit(f'unknown marking: @{name}')
        out.append((name, {'^':'above','_':'below'}.get(pl)))
    return out

def tokenize(s):
    mk = r'(?:@[a-z]+[\^_]?)*'
    pat = (r'"[^"]*"|t\d+(?::\d+)?\[|\]|\||R' + mk + r'(?=\s|\||$)|(?:g:)?~?(?:r|[A-G](?:##|bb|#|b|n)?\d!?(?:\(\))?)/\d+\.*(?:~|\(|\)|@[a-z]+[\^_]?)*|-')
    return re.findall(pat, s)

def number_slurs(bars, field='events'):
    """Number the page's slurs and give each a MusicXML level. Sets e['slur_start'] / e['slur_stop'] = [(n, level)]
    on every event and b[field + '_slur_in'] = the slurs open as bar b begins; returns the slurs open at the page's end."""
    stack = []; nxt = 1; arriving = []
    for b in bars:
        b[field + '_slur_in'] = list(stack)
        for e in flat(b[field] or []):
            e['slur_start'] = []; e['slur_stop'] = []
            for op in e.get('slur_ops', []):
                if op == '(':
                    used = {l for _, l in stack}; L = 1
                    while L in used: L += 1
                    s = (nxt, L); nxt += 1; stack.append(s); e['slur_start'].append(s)
                elif stack:
                    e['slur_stop'].append(stack.pop())
                else:   # arrives from the previous page
                    s = (nxt, 1); nxt += 1; e['slur_stop'].append(s); arriving.append(s)
    for s in arriving:   # open from the page's start until its stop
        for b in bars:
            b[field + '_slur_in'] = [s] + b[field + '_slur_in']
            if any(s in e['slur_stop'] for e in flat(b[field] or [])): break
    return list(stack)

def dur(e, metre=None):
    if e.get('measure_rest'): return metre
    d = Fraction(1, e['value']); add = d
    for _ in range(e['dots']): add /= 2; d += add
    if e.get('tuplet'): a, n = e['tuplet']; d = d * n / a
    return d

def flat(events):
    for e in events:
        if e['kind'] == 'tuplet': yield from flat(e['events'])
        else: yield e

def key_alter(step, key):
    if key > 0 and step in FIFTHS_SHARPS[:key]: return 1
    if key < 0 and step in FIFTHS_FLATS[:-key]: return -1
    return 0

def alter_of(e, key):
    return ACC_ALTER[e['acc']] if e['acc'] else key_alter(e['step'], key)

def midi_of(e, key):
    return 12 * (e['oct'] + 1) + STEP[e['step']] + alter_of(e, key)

def context(hdr, bars):
    """metre and key in force at each bar"""
    t = hdr['time']; k = hdr['key']; out = []
    for b in bars:
        if b['tsig']: t = b['tsig']
        if b['key'] is not None: k = b['key']
        out.append((t, k))
    return out

def accidental_plan(bars, ctx, field='events'):
    """per note (by id): (alter, parenthesized) of the sign drawn, or None"""
    plan = {}; prev_tied = False   # a tie carries across the barline
    for bi, b in enumerate(bars):
        key = ctx[bi][1]; seen = {}
        for e in flat(b[field] or []):
            if e['kind'] != 'note': continue
            a = alter_of(e, key); here = seen.get((e['step'], e['oct']), key_alter(e['step'], key))
            if (prev_tied or e.get('tie_in')) and not e['force'] and not e['paren']:
                plan[id(e)] = None
            elif a != here or e['force'] or e['paren']:
                plan[id(e)] = (a, e['paren']); seen[(e['step'], e['oct'])] = a
            else:
                plan[id(e)] = None
            prev_tied = e['tie']
    return plan

def key_xml(prev_key, key):
    cancel = prev_key and ((prev_key > 0) != (key > 0) or abs(key) < abs(prev_key))
    return f'<key><cancel>{prev_key}</cancel><fifths>{key}</fifths></key>' if cancel else f'<key><fifths>{key}</fifths></key>'

def hidden_grace(e, key, voice, kind):
    # an invisible grace note that carries the far end of a tie whose real partner is on another system or page
    alter = alter_of(e, key)
    return (f'<note print-object="no"><grace/><pitch><step>{e["step"]}</step>{f"<alter>{alter}</alter>" if alter else ""}<octave>{e["oct"]}</octave></pitch>'
            f'<tie type="{kind}"/><voice>{voice}</voice><type>eighth</type><notations><tied type="{kind}"/></notations></note>')

def hidden_slur_grace(e, key, voice, kind, slurs):
    # an invisible grace note that carries the far end of slurs whose real partner is on another system or page
    alter = alter_of(e, key); sl = ''.join(f'<slur type="{kind}" number="{l}"/>' for _, l in slurs)
    return (f'<note print-object="no"><grace/><pitch><step>{e["step"]}</step>{f"<alter>{alter}</alter>" if alter else ""}<octave>{e["oct"]}</octave></pitch>'
            f'<voice>{voice}</voice><type>eighth</type><notations>{sl}</notations></note>')

def emit_notes(out, evs, metre, key, voice, stem, beams, tup_edges, accs, st, divisions, last_lyric, lyrics, close_tie, shared=()):
    """st: per-voice state {'tied': bool, 'first': bool, 'incoming': bool}; shared: ids of ossia events that the upper
    option already draws (same onset, pitch, and value): drawn invisible, so the print's single head shows once"""
    for ei, e in enumerate(evs):
        is_note = e['kind'] == 'note'
        arriving = is_note and (e.get('tie_in') or (st['first'] and st['incoming'] and not st['tied']))
        if arriving: out.append(hidden_grace(e, key, voice, 'start')); st['tied'] = True
        if is_note or e['kind'] == 'rest': st['first'] = False
        prev_tied = st['tied']
        out.append('<note print-object="no">' if id(e) in shared else '<note>')
        if e['grace']: out.append('<grace/>')
        if e.get('measure_rest'): out.append('<rest measure="yes"/>')
        elif e['kind'] == 'rest': out.append('<rest/>')
        else:
            alter = alter_of(e, key)
            out.append(f'<pitch><step>{e["step"]}</step>{f"<alter>{alter}</alter>" if alter else ""}<octave>{e["oct"]}</octave></pitch>')
        if not e['grace']:
            d = dur(e, metre); out.append(f'<duration>{int(d * 4 * divisions)}</duration>')
        if is_note and e['tie']: out.append('<tie type="start"/>')
        if is_note and prev_tied: out.append('<tie type="stop"/>')
        out.append(f'<voice>{voice}</voice>')
        out.append(f'<type>{TYPE[e["value"]]}</type>' + '<dot/>' * e['dots'])
        if is_note and accs.get(id(e)):
            a, par = accs[id(e)]
            out.append(f'<accidental{" parentheses=\"yes\"" if par else ""}>{ALTER_NAME[a]}</accidental>')
        if e.get('tuplet'):
            a, nn = e['tuplet']; out.append(f'<time-modification><actual-notes>{a}</actual-notes><normal-notes>{nn}</normal-notes></time-modification>')
        if stem and is_note: out.append(f'<stem>{stem}</stem>')
        nots = []
        if is_note and e['tie']: nots.append('<tied type="start"/>')
        if is_note and prev_tied: nots.append('<tied type="stop"/>')
        if beams[ei]: out.append(f'<beam number="1">{beams[ei]}</beam>')
        for _, l in e.get('slur_stop', []): nots.append(f'<slur type="stop" number="{l}"/>')
        for _, l in e.get('slur_start', []): nots.append(f'<slur type="start" number="{l}"/>')
        te = tup_edges.get(id(e))
        if te: nots.append(f'<tuplet type="{te}" bracket="yes" show-number="actual"/>')
        arts = []
        for name, pl in e.get('marks', []):
            plc = f' placement="{pl}"' if pl else ''
            if name == 'ferm': nots.append(f'<fermata type="{"inverted" if pl == "below" else "upright"}"/>')
            elif name == 'sacc': arts.append(f'<strong-accent type="up"{plc}/>')
            else: arts.append(f'<{MARKS[name]}{plc}/>')
        if arts: nots.append('<articulations>' + ''.join(arts) + '</articulations>')
        if nots: out.append('<notations>' + ''.join(nots) + '</notations>')
        if lyrics and is_note and e['syl'] and e['syl'] != '-' and not prev_tied:
            s = e['syl']; hy = s.endswith('-'); text = s.rstrip('-')
            if hy and id(e) == last_lyric:
                out.append(f'<lyric number="1"><syllabic>single</syllabic><text>{xml(text)}-</text></lyric>')
            else:
                out.append(f'<lyric number="1"><syllabic>{"begin" if hy else "single"}</syllabic><text>{xml(text)}</text></lyric>')
        out.append('</note>')
        if is_note: st['tied'] = e['tie']; st['last'] = e
        elif e['kind'] == 'rest': st['tied'] = False
    if close_tie and st['tied'] and st.get('last') is not None:
        out.append(hidden_grace(st['last'], key, voice, 'stop')); st['tied'] = False

def to_musicxml(hdr, bars, ctx, divisions=96, show_first_time=True, courtesy_key=None, system_end=False, incoming=False, incoming2=False, slur_out=()):
    tn, td = ctx[0][0]; key = ctx[0][1]
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<score-partwise version="4.0"><part-list><score-part id="P1"><part-name>Голос</part-name></score-part></part-list><part id="P1">']
    accs = accidental_plan(bars, ctx); accs.update(accidental_plan(bars, ctx, 'oss'))
    last_lyric = None
    if system_end:
        for b in bars:
            pt = False
            for e in flat(b['events']):
                if e['kind'] == 'note' and e['syl'] and e['syl'] != '-' and not pt: last_lyric = id(e)
                pt = e['kind'] == 'note' and e['tie']
    prev_key = key
    st1 = {'tied': False, 'first': True, 'incoming': incoming}; st2 = {'tied': False, 'first': True, 'incoming': incoming2}
    for bi, b in enumerate(bars):
        n = b['n']; metre = Fraction(*ctx[bi][0]); key = ctx[bi][1]
        if bi == 0:
            out.append(f'<measure number="{n}"{" implicit=\"yes\"" if hdr["anacrusis"] else ""}>')
            hide = '' if show_first_time else ' print-object="no"'
            out.append(f'<attributes><divisions>{divisions}</divisions><key><fifths>{key}</fifths></key><time{hide}><beats>{tn}</beats><beat-type>{td}</beat-type></time><clef><sign>{hdr["clef"][0]}</sign><line>{hdr["clef"][1]}</line></clef></attributes>')
        else:
            at = ''
            if b['key'] is not None and key != prev_key and prev_key and ((prev_key > 0) != (key > 0) or abs(key) < abs(prev_key)):
                # the edition prints the cancelling naturals before the barline and the new signature after it (f1-003,
                # Dann 2026-10-19): bar n-1 loses its barline, an empty measure carries the naturals, then its barline
                out.insert(len(out) - 1, '<barline location="right"><bar-style>none</bar-style></barline>')
                out.append(f'<measure number="{n}-cancel"><attributes><key><fifths>0</fifths></key></attributes></measure>')
                if key: at += f'<key><fifths>{key}</fifths></key>'
            elif b['key'] is not None and key != prev_key: at += key_xml(prev_key, key)
            out.append(f'<measure number="{n}">')
            if b['tsig']: at += f'<time{" print-object=\"no\"" if b["tsig_hidden"] else ""}><beats>{b["tsig"][0]}</beats><beat-type>{b["tsig"][1]}</beat-type></time>'
            if at: out.append(f'<attributes>{at}</attributes>')
        prev_key = key
        last = bi == len(bars) - 1
        oss = b.get('oss')
        evs = list(flat(b['events']))
        first_note = next((e for e in evs if e['kind'] == 'note' and not e['grace']), None)
        last_note = next((e for e in reversed(evs) if e['kind'] == 'note' and not e['grace']), None)
        if bi == 0 and b.get('events_slur_in') and first_note is not None:
            out.append(hidden_slur_grace(first_note, key, 1, 'start', b['events_slur_in']))   # slurs arriving from before
        emit_notes(out, evs, metre, key, 1, 'up' if oss else None, beam_plan(evs, metre), tuplet_edges(b['events']),
                   accs, st1, divisions, last_lyric, True, last)
        if last and slur_out and last_note is not None:
            out.append(hidden_slur_grace(last_note, key, 1, 'stop', slur_out))   # slurs leaving the system or page
        if oss:
            out.append(f'<backup><duration>{int(metre * 4 * divisions)}</duration></backup>')
            ev2 = list(flat(oss))
            def sig(evl):
                on = Fraction(0); r = {}
                for e in evl:
                    r[(on, e['pitch'].rstrip('!').replace('()', ''), e['value'], e['dots'])] = e; on += Fraction(0) if e['grace'] else dur(e, metre)
                return r
            up = sig(evs); shared = {id(e) for k, e in sig(ev2).items() if k in up}
            emit_notes(out, ev2, metre, key, 2, 'down', beam_plan(ev2, metre, vocal=False), tuplet_edges(oss),
                       accs, st2, divisions, None, False, last or not (bi + 1 < len(bars) and bars[bi + 1].get('oss')), shared)
        out.append('</measure>')
    if courtesy_key is not None and courtesy_key != prev_key:
        out.append(f'<measure number="courtesy"><attributes>{key_xml(prev_key, courtesy_key)}</attributes><barline location="right"><bar-style>none</bar-style></barline></measure>')
    out.append('</part></score-partwise>')
    return '\n'.join(out)

def beam_plan(evs, metre, vocal=True):
    # vocal beaming: beam only the notes of one syllable's melisma (a syllable's note, its '-' continuations, and tied notes),
    # inside one beat (a quarter, or a dotted quarter in compound metre); rests and grace notes break a beam
    beat = Fraction(3, 8) if metre.denominator == 8 and metre.numerator % 3 == 0 else Fraction(1, 4)
    plan = [''] * len(evs); onset = Fraction(0); groups = []; cur = []; cur_on = None
    mel = None; prev_note = False; prev_tied = False; mid = 0
    for i, e in enumerate(evs):
        d = Fraction(0) if e['grace'] else dur(e, metre)
        if e['kind'] == 'note' and not e['grace']:
            if not vocal and prev_note: pass
            elif (e['syl'] == '-' and prev_note) or (prev_tied and prev_note): pass
            else: mid += 1
            this = mid; prev_note = True; prev_tied = e['tie']
        else:
            this = None; prev_note = False; prev_tied = False; mid += 1
        beamable = this is not None and e['value'] >= 8
        if beamable and cur and (this == mel) and (onset // beat) == (cur_on // beat):
            cur.append(i)
        else:
            if cur: groups.append(cur)
            cur = [i] if beamable else []; cur_on = onset; mel = this
        onset += d
    if cur: groups.append(cur)
    for g in groups:
        if len(g) < 2: continue
        for k, i in enumerate(g): plan[i] = 'begin' if k == 0 else ('end' if k == len(g) - 1 else 'continue')
    return plan

def tuplet_edges(events):
    edges = {}
    for e in events:
        if e['kind'] == 'tuplet':
            inner = list(flat(e['events']))
            if inner: edges[id(inner[0])] = 'start'; edges[id(inner[-1])] = 'stop'
    return edges

def xml(s): return s.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')

def check(hdr, bars, ctx):
    msgs = []
    for bi, b in enumerate(bars):
        expect = Fraction(*ctx[bi][0])
        total = sum(dur(e, expect) for e in flat(b['events']) if not e['grace'])
        if total != expect and not (bi == 0 and hdr['anacrusis']) and bi != len(bars) - 1:
            msgs.append(f'bar {b["n"]}: sums to {total}, expected {expect}')
        if b.get('oss'):
            t2 = sum(dur(e, expect) for e in flat(b['oss']) if not e['grace'])
            if t2 != expect: msgs.append(f'bar {b["n"]} ossia: sums to {t2}, expected {expect}')
    return msgs

def note_records(evs, bi, key, expect, abs_onset, accs, prefix='m'):
    recs = []; onset = Fraction(0)
    for e in flat(evs):
        d = Fraction(0) if e['grace'] else dur(e, expect)
        rec = {'id': f'{prefix}{bi}-{onset.numerator}-{onset.denominator}', 'type': e['kind'], 'measureIndex': bi,
               'onset': {'numerator': onset.numerator, 'denominator': onset.denominator},
               'duration': {'numerator': d.numerator, 'denominator': d.denominator},
               'onsetAbsolute': float(abs_onset + onset)}
        if e['grace']: rec['grace'] = True
        if e.get('measure_rest'): rec['measureRest'] = True
        if e['kind'] == 'note':
            rec['midi'] = midi_of(e, key)
            if e['syl'] and e['syl'] != '-':
                rec['syllableText'] = e['syl'].rstrip('-'); rec['syllableType'] = 'start' if e['syl'].endswith('-') else 'single'
            elif e['syl'] == '-': rec['syllableType'] = 'melisma'
            if e['tie']: rec['tieStart'] = True
            if e.get('tie_in'): rec['tieStop'] = True
            if accs.get(id(e)):
                a, par = accs[id(e)]; rec['printedAccidental'] = ALTER_TRUTH[a]
                if par: rec['printedAccidentalParenthesized'] = True
        for fld, key_ in (('slur_start', 'slurStart'), ('slur_stop', 'slurStop')):
            ns = [n for n, _ in e.get(fld, [])]
            if ns: rec[key_] = ns[0] if len(ns) == 1 else ns
        arts = [MARKS[nm] for nm, _ in e.get('marks', []) if nm != 'ferm']
        if arts: rec['articulations'] = arts
        if any(nm == 'ferm' for nm, _ in e.get('marks', [])): rec['fermata'] = True
        recs.append(rec); onset += d
    return recs

def to_truth(hdr, bars, ctx, piece_id):
    notes = []; abs_onset = Fraction(0); mdur = []; mkeys = []; ossia = []
    accs = accidental_plan(bars, ctx); accs2 = accidental_plan(bars, ctx, 'oss')
    for bi, b in enumerate(bars):
        expect = Fraction(*ctx[bi][0]); key = ctx[bi][1]
        md = {'index': bi, 'expectedDuration': {'numerator': expect.numerator, 'denominator': expect.denominator}}
        if b['piano']: md['pianoOnly'] = True
        if b['err']: md['printError'] = b['err']
        mdur.append(md); mkeys.append({'index': bi, 'fifths': key})
        notes += note_records(b['events'], bi, key, expect, abs_onset, accs)
        if b.get('oss'):
            on = note_records(b['oss'], bi, key, expect, abs_onset, accs2, prefix='o')
            for r in on: r['option'] = 'lower'
            ossia.append({'measureIndex': bi, 'notes': on})
        abs_onset += expect
    out = {'pieceId': piece_id, 'source': 'desk truth kit, by eye with Audiveris heads; proofed by Dann: NO',
           'vocalPart': {'partName': 'Голос'}, 'clef': {'sign': hdr['clef'][0], 'line': hdr['clef'][1]},
           'keySignature': {'fifths': ctx[0][1] if ctx else hdr['key']}, 'measureKeys': mkeys,
           'sungVerseNumbers': [1], 'measureDurations': mdur,
           'verses': [{'verseNumber': 1, 'verseLabel': 'Verse 1', 'notes': notes}]}
    if ossia: out['ossia'] = ossia
    return out

if __name__ == '__main__':
    src = open(sys.argv[1], encoding='utf-8').read(); stem = sys.argv[1].rsplit('.', 1)[0]
    hdr, bars = parse(src); ctx = context(hdr, bars)
    page_open = number_slurs(bars); number_slurs(bars, 'oss')
    for m in check(hdr, bars, ctx): print('CHECK', m)
    open(stem + '.musicxml', 'w', encoding='utf-8').write(to_musicxml(hdr, bars, ctx, show_first_time=hdr['showtime'], slur_out=page_open))
    starts = hdr['systems'] + [len(bars)]
    for si in range(len(starts) - 1):
        a, z = starts[si], starts[si + 1]
        h2 = dict(hdr); h2['anacrusis'] = hdr['anacrusis'] and si == 0
        first = bars[a]
        show = (bool(first['tsig']) and not first['tsig_hidden']) or (si == 0 and hdr['showtime'])
        nxt = bars[z] if z < len(bars) else None
        ck = nxt['key'] if nxt is not None and nxt['key'] is not None else None
        prev_notes = [e for e in flat(bars[a - 1]['events']) if e['kind'] != 'tuplet'] if a > 0 else []
        incoming = bool(prev_notes) and prev_notes[-1]['kind'] == 'note' and prev_notes[-1]['tie']
        prev2 = list(flat(bars[a - 1]['oss'])) if a > 0 and bars[a - 1].get('oss') else []
        incoming2 = bool(prev2) and prev2[-1]['kind'] == 'note' and prev2[-1]['tie']
        open(f'{stem}-s{si + 1}.musicxml', 'w', encoding='utf-8').write(
            to_musicxml(h2, bars[a:z], ctx[a:z], show_first_time=show, courtesy_key=ck, system_end=True, incoming=incoming, incoming2=incoming2,
                        slur_out=bars[z]['events_slur_in'] if z < len(bars) else page_open))
    json.dump(to_truth(hdr, bars, ctx, stem.split('/')[-1]), open(stem + '.truth.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    n = sum(1 for b in bars for e in flat(b['events']) if e['kind'] == 'note')
    s = sum(1 for b in bars for e in flat(b['events']) if e['kind'] == 'note' and e['syl'] and e['syl'] != '-')
    pb = sum(1 for b in bars if b['piano'])
    print(f'{len(bars)} bars, {n} notes, {s} syllables, {pb} piano-only bars, {len(starts) - 1} systems')
    cnt = {}
    for b in bars:
        for e in flat(b['events']):
            cnt['slurs'] = cnt.get('slurs', 0) + len(e.get('slur_start', [])) + sum(1 for s in e.get('slur_stop', []) if s not in [x for bb in bars for ee in flat(bb['events']) for x in ee.get('slur_start', [])])
            for nm, _ in e.get('marks', []): cnt[nm] = cnt.get(nm, 0) + 1
    print('markings:', ' '.join(f'{k}={v}' for k, v in sorted(cnt.items())) or 'none')
