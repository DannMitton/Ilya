#!/usr/bin/env python3
"""Mechanically derive harness-schema ground truth from fixture-b.musicxml.

Walks the MusicXML source directly. Never consults the rendered image.
Conventions match the close-fixture precedent
(claude/fable-memo-e16-close-fixture-procurement_2026-07-25.md):
  - measureIndex: 0-based over the piece's measure list
  - onset/duration: reduced fractions of a whole note
  - id: m{measureIndex}-{onset.numerator}-{onset.denominator}
  - onsetAbsolute: cumulative whole-note units from piece start (float)
  - rests appear in notes[] with no midi/syllable fields (none in this fixture)

Additive to the close-fixture schema: each measure record also carries
dottedBarlineOffsets, the list of onsets (whole-note fractions from the
measure start) at which a <barline location="middle"><bar-style>dotted
</bar-style></barline> appears in the source. This is provenance for the
dotted-barline grouping capability the fixture exists to exercise; the
measure-sum assertion below does not depend on it.
"""
import json
import xml.etree.ElementTree as ET
from fractions import Fraction

SRC = "fixture-b.musicxml"
OUT = "fixture-b-ground-truth.json"

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
dotted_barlines_by_measure = []
abs_offset = Fraction(0)

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

    onset = Fraction(0)
    dotted_offsets = []
    # walk children in document order so mid-measure <barline> elements are
    # correctly attributed to the running onset at the point they appear
    for child in measure:
        if child.tag == "note":
            dur_divs = int(child.find("duration").text)
            dur = Fraction(dur_divs, 4 * divisions)
            entry = {
                "id": f"m{m_index}-{onset.numerator}-{onset.denominator}",
                "type": "rest" if child.find("rest") is not None else "note",
                "measureIndex": m_index,
                "onset": {"numerator": onset.numerator, "denominator": onset.denominator},
                "duration": {"numerator": dur.numerator, "denominator": dur.denominator},
                "onsetAbsolute": float(abs_offset + onset),
            }
            if entry["type"] == "note":
                p = child.find("pitch")
                step = p.find("step").text
                octave = int(p.find("octave").text)
                alter_el = p.find("alter")
                alter = int(alter_el.text) if alter_el is not None else 0
                entry["midi"] = 12 * (octave + 1) + STEP_SEMITONES[step] + alter
            notes.append(entry)
            onset += dur
        elif child.tag == "barline":
            loc = child.get("location")
            style_el = child.find("bar-style")
            style = style_el.text if style_el is not None else None
            if loc == "middle" and style == "dotted":
                dotted_offsets.append({"numerator": onset.numerator,
                                        "denominator": onset.denominator})

    dotted_barlines_by_measure.append({"index": m_index, "dottedBarlineOffsets": dotted_offsets})

    assert onset == expected, f"measure {m_index} sums to {onset}, expected {expected}"
    abs_offset += expected

ground_truth = {
    "pieceId": "e16-irregular-fixture-b---dotted-barlines",
    "sourceMusxPath": "fixture-b.musicxml (MusicXML source, this procurement; no .musx exists)",
    "parser": {"warnings": 0, "errors": 0, "errorDetail": []},
    "vocalPart": {"partId": "P1", "partName": "Voice"},
    "clef": {"sign": clef_sign, "line": clef_line},
    "keySignature": {"fifths": fifths},
    "tempoMarkings": [],
    "sungVerseNumbers": [1],
    "measureDurations": measure_durations,
    "dottedBarlinesByMeasure": dotted_barlines_by_measure,
    "verses": [{"verseNumber": 1, "verseLabel": "Verse 1", "notes": notes}],
}

with open(OUT, "w") as f:
    json.dump(ground_truth, f, indent=2)

print(f"wrote {OUT}: {len(notes)} notes/rests, {len(measure_durations)} measures, all sums verified")
