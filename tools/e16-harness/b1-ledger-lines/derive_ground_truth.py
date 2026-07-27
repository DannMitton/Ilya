#!/usr/bin/env python3
"""Mechanically derive harness-schema ground truth from b1-ledger-lines.musicxml.

Walks the MusicXML source directly. Never consults the rendered image.
Same conventions as tools/e16-harness/close-fixture/derive_ground_truth.py,
matched field-for-field against the harness corpus's mussorgsky---sunless-01
ground-truth.json:
  - measureIndex: 0-based over the piece's measure list
  - onset/duration: reduced fractions of a whole note
  - id: m{measureIndex}-{onset.numerator}-{onset.denominator}
  - onsetAbsolute: cumulative whole-note units from piece start (float)
  - rests appear in notes[] with no midi/syllable fields
"""
import json
import xml.etree.ElementTree as ET
from fractions import Fraction

SRC = "b1-ledger-lines.musicxml"
OUT = "b1-ledger-lines-ground-truth.json"

STEP_SEMITONES = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}

tree = ET.parse(SRC)
root = tree.getroot()
part = root.find("part")

divisions = None
beats, beat_type = None, None
clef_sign, clef_line = None, None
fifths = None

notes = []
measure_durations = []
abs_offset = Fraction(0)  # whole-note units from piece start

for m_index, measure in enumerate(part.findall("measure")):
    attrs = measure.find("attributes")
    if attrs is not None:
        d = attrs.find("divisions")
        if d is not None:
            divisions = int(d.text)
        t = attrs.find("time")
        if t is not None:
            beats = int(t.find("beats").text)
            beat_type = int(t.find("beat-type").text)
        c = attrs.find("clef")
        if c is not None:
            clef_sign = c.find("sign").text
            clef_line = int(c.find("line").text)
        k = attrs.find("key")
        if k is not None:
            fifths = int(k.find("fifths").text)

    expected = Fraction(beats, beat_type)
    measure_durations.append({
        "index": m_index,
        "expectedDuration": {"numerator": expected.numerator,
                             "denominator": expected.denominator},
    })

    onset = Fraction(0)  # whole-note units within this measure
    for note in measure.findall("note"):
        dur_divs = int(note.find("duration").text)
        # divisions = divisions per quarter note; whole note = 4 * divisions
        dur = Fraction(dur_divs, 4 * divisions)
        entry = {
            "id": f"m{m_index}-{onset.numerator}-{onset.denominator}",
            "type": "rest" if note.find("rest") is not None else "note",
            "measureIndex": m_index,
            "onset": {"numerator": onset.numerator,
                      "denominator": onset.denominator},
            "duration": {"numerator": dur.numerator,
                         "denominator": dur.denominator},
            "onsetAbsolute": float(abs_offset + onset),
        }
        if entry["type"] == "note":
            p = note.find("pitch")
            step = p.find("step").text
            octave = int(p.find("octave").text)
            alter_el = p.find("alter")
            alter = int(alter_el.text) if alter_el is not None else 0
            entry["midi"] = 12 * (octave + 1) + STEP_SEMITONES[step] + alter
        notes.append(entry)
        onset += dur

    # sanity: measure must sum exactly to the time signature
    assert onset == expected, f"measure {m_index} sums to {onset}, expected {expected}"
    abs_offset += expected

ground_truth = {
    "pieceId": "e16-fixture-b1---ledger-lines-both-directions",
    "sourceMusxPath": "b1-ledger-lines.musicxml (MusicXML source, this procurement; no .musx exists)",
    "parser": {"warnings": 0, "errors": 0, "errorDetail": []},
    "vocalPart": {"partId": "P1", "partName": "Voice"},
    "clef": {"sign": clef_sign, "line": clef_line},
    "keySignature": {"fifths": fifths},
    "tempoMarkings": [],
    "sungVerseNumbers": [1],
    "measureDurations": measure_durations,
    "verses": [{"verseNumber": 1, "verseLabel": "Verse 1", "notes": notes}],
}

with open(OUT, "w") as f:
    json.dump(ground_truth, f, indent=2)

print(f"wrote {OUT}: {len(notes)} note/rest entries over {len(measure_durations)} measures")
