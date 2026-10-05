# usage: python3 tables.py results.json  -- prints the markdown tables for the memo
import json, sys
r = json.load(open(sys.argv[1]))
order = ['1', '4', '5', '6', '7']
names = {'1': 'Sunless 1', '4': 'Sunless 4', '5': 'Sunless 5', '6': 'Sunless 6', '7': 'Tchaikovsky'}
T = r['total']['totals']
def g(d, k): return d.get(k, 0)
def row(cells): return '| ' + ' | '.join(str(c) for c in cells) + ' |'
def table(head, rows):
    out = [row(head), row(['---'] * len(head))]
    out += [row(x) for x in rows]
    return '\n'.join(out)
def f1(x): return f'{x:.1f}'
print('### Headline (control)')
print(table(['Song', 'Notes printed', 'Headline'], [[names[k], r[k]['counts']['truthNotes'], f1(r[k]['headline'])] for k in order] + [['All five', T['truthNotes'], f1(r['total']['headlines']['baseline'])]]))
print('\n### A1. Every printed note in one class')
rows = []
for k in order:
    c = r[k]['classes']
    rows.append([names[k], r[k]['counts']['truthNotes'], c['right'], c['notFound'], c['pitchOnly'], c['lengthOnly'], c['both'], r[k]['counts']['extra']])
rows.append(['All five', T['truthNotes'], T['class.right'], T['class.notFound'], T['class.pitchOnly'], T['class.lengthOnly'], T['class.both'], T['extras']])
print(table(['Song', 'Printed', '1 Right', '2 Not found', '3 Pitch only misread', '4 Length only misread', '5 Both misread', 'Extra notes (read, not printed)'], rows))
print('\n### A2. Pitch faults by cause')
for title, key3 in (('Class 3 only (pitch misread, length right)', 'pitchCauseClass3'), ('Every matched note with a pitch fault (classes 3 and 5)', 'pitchCauseAllFaults')):
    tk = 'pitchC3.' if key3 == 'pitchCauseClass3' else 'pitchAll.'
    print('\n' + title + '\n')
    rows = []
    for k in order:
        a = r[k][key3]
        rows.append([names[k], g(a,'a'), g(a,'a-abstained'), g(a,'b'), g(a,'c')])
    rows.append(['All five', T.get(tk+'a',0), T.get(tk+'a-abstained',0), T.get(tk+'b',0), T.get(tk+'c',0)])
    print(table(['Song', '3a sign, read wrong', '3a sign, abstained', '3b staff position', '3c octave'], rows))
print('\nSensitivity of 3a/3b/3c to spelling (non-abstained pitch faults only; sharp spelling is the one used above): flat spelling a/b/c, and either spelling allowed a/b/c')
rows = []
for k in order:
    s = r[k]['pitchCauseSensitivity']
    nb = {x: g(s['sharpSpelling'], x) for x in 'abc'}
    rows.append([names[k], f"{nb['a']}/{nb['b']}/{nb['c']}", f"{g(s['flatSpellingNonAbstained'],'a')}/{g(s['flatSpellingNonAbstained'],'b')}/{g(s['flatSpellingNonAbstained'],'c')}", f"{g(s['lenientEitherSpellingNonAbstained'],'a')}/{g(s['lenientEitherSpellingNonAbstained'],'b')}/{g(s['lenientEitherSpellingNonAbstained'],'c')}"])
print(table(['Song', 'sharp spelling a/b/c', 'flat spelling a/b/c', 'either spelling a/b/c'], rows))
print('\n### A3. Pitch abstentions (every matched note whose pitch abstained)')
for k in order:
    print(f"- {names[k]}: reasons {r[k]['abstainedPitchReasons']}; assumed natural against the truth: {r[k]['abstainedPitchGeometry']}")
print('\n### A4. Length faults by cause')
for title, key4, tk in (('Class 4 only (length misread, pitch right)', 'lengthCauseClass4', 'lenC4.'), ('Every matched note with a length fault (classes 4 and 5)', 'lengthCauseAllFaults', 'lenAll.')):
    print('\n' + title + '\n')
    rows = []
    for k in order:
        a = r[k][key4]
        rows.append([names[k], g(a,'a-abstained'), g(a,'dot'), g(a,'flags'), g(a,'other')])
    rows.append(['All five', T.get(tk+'a-abstained',0), T.get(tk+'dot',0), T.get(tk+'flags',0), T.get(tk+'other',0)])
    print(table(['Song', '4a reader abstained', '4b dot (3:2)', '4c flags or beams (2 or 4)', '4d other'], rows))
print('\n### A5. Length abstention reason codes (all matched notes with a length abstention)')
tot = {}
for k in order:
    print(f"- {names[k]}: {r[k]['abstainedLengthReasonsAll']}")
    for a, b in r[k]['abstainedLengthReasonsAll'].items(): tot[a] = tot.get(a, 0) + b
print('- All five:', dict(sorted(tot.items(), key=lambda x: -x[1])))
print('\n### A6. Converter quarters')
rows = []
for k in order:
    q = r[k]['converterQuarter']
    rows.append([names[k], q['class4OwnLengthReadButOnsetLost'], q['ofThoseTruthNotAQuarter'], q['rightInOwnLengthButOnsetLost'], q['ofThoseTruthNotAQuarter2']])
rows.append(['All five', T['c4OnsetLost'], T['c4OnsetLostQW'], T['rightOnsetLost'], T['rightOnsetLostWrong']])
print(table(['Song', 'Class 4 notes whose own length was read but whose onset was lost', 'of those, truth is not a quarter', 'Notes read right in length but with a lost onset', 'of those, truth is not a quarter (drawn wrong)'], rows))
print('\n### A7. Rests and bars')
rows = []
for k in order:
    s = r[k]['rests']; b = r[k]['bars']
    rows.append([names[k], s['truth'], s['matched'], s['lengthRight'], s['read'] - s['matched'], b['truth'], b['read'], b['read'] - b['truth'], b['allRight']])
rows.append(['All five', T['restsTruth'], T['restsMatched'], T['restsRight'], T['restsRead'] - T['restsMatched'], T['barsTruth'], T['barsRead'], T['barsRead'] - T['barsTruth'], sum(r[k]['bars']['allRight'] for k in order)])
print(table(['Song', 'Rests printed', 'Rests found', 'Rests right in length', 'Extra rests read', 'Bars printed', 'Bars read', 'Read minus printed', 'Bars all right'], rows))
print('\n### A8. Not-found notes and extras')
for k in order:
    print(f"- {names[k]}: not found {r[k]['counts']['missing']}, by printed length {r[k]['notFound']['byTruthDuration']}, first note of its bar {r[k]['notFound']['firstNoteInTruthBar']}, directly after a printed rest {r[k]['notFound']['followsARest']}; extras {r[k]['extras']['notes']}, with length abstained {r[k]['extras']['withLengthAbstained']}, by read length {r[k]['extras']['byReadDuration']}")
print('\n### A9. Accidental misses (3a, abstained included) and bar agreement')
for k in order:
    a = r[k]['accidentalMissesBarBoundary']
    print(f"- {names[k]}: {a['total']} misses; {a['barsDisagree']} sit in a bar where the printed and read bars do not line up (note count differs, or the bar's notes are split over bars); {a['barsAgree']} sit in a bar that lines up")
print('\n### B. Ceilings (headline if that one decision were perfect)')
keys = [('B1', 'B1 accidentals right (sharp spelling)'), ('B1lenient', 'B1 accidentals right (either spelling allowed)'), ('B2', 'B2 staff position and octave right'), ('B1+B2', 'B1+B2 every pitch right'), ('B3', 'B3 lengths right'), ('B4', 'B4 not-found notes put in'), ('B5', 'B5 extras taken out'), ('B6', 'B6 = B1 + B3'), ('B7', 'B7 = B4 + B5'), ('B8', 'B8 all (control)'), ('B8spelled', 'B8 through the spelling rules (diagnostic)'), ('asDrawnByConverter', 'Today, as the converter draws it')]
rows = [['Today (control)'] + [f1(r[k]['headline']) for k in order] + [f1(r['total']['headlines']['baseline'])]]
for key, label in keys:
    rows.append([label] + [f1(r[k]['ceilings'][key]) for k in order] + [f1(r['total']['headlines'][key])])
print(table(['Fix'] + [names[k] for k in order] + ['All five, by notes'], rows))
