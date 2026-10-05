// Added by the Ilya project, 2026-10-05: port of homr main's music_xml_generator.py (commit 560ca5c), used with model 465.
/**
 * Port of homr main's music_xml_generator.py (commit 560ca5c) with the
 * default XmlGeneratorArguments. It differs from the 0.7.0 generator in
 * generate.ts in these ways, each ported as homr main writes it:
 *
 * - Elements are written in the order the code appends them (ElementTree),
 *   not in schema order, so a note reads chord, grace, pitch or rest,
 *   duration, type, dot, time-modification, voice, staff, notations, and a
 *   pitch reads step, octave, alter.
 * - Each position (upper, upper2, lower, lower2, nonote) is its own chord;
 *   chords of rests only come first.
 * - A group's notes start when the earliest still-sounding note ends
 *   (_advance_to_next_group), not after the previous group's shortest note.
 * - Rests in a chord with notes are written after a backup, one rest only.
 * - A `<duration>` is at least 1; a backup is at least 1.
 * - The division counts every note and rest, not each chord's shortest.
 * - A first measure with no time signature gets one, in quarters.
 * - A slur between two adjacent events of a voice on the same pitch becomes a
 *   tie (convert_ties).
 *
 * - Each note carries an `imgpos` comment with the place on the input image
 *   where the transformer was looking (build_image_position).
 */

import { roundHalfEven } from "../image/numeric.js";
import {
  addRatio,
  compareRatio,
  durationOfRhythm,
  mulRatio,
  type Ratio,
  ratio,
  type SymbolDuration,
  ZERO,
} from "../transformer/duration.js";
import type { EncodedSymbol } from "../transformer/symbol.js";
import { EMPTY, isLowerPosition, NONOTE } from "../transformer/vocabulary.js";
import {
  type LogLine,
  MusicXmlError,
  sortTokenChords,
  symbolText,
} from "./generate.js";
import { COMMENT, leaf, writeXmlDocument, XmlElement } from "./xml.js";

type TupletMark = "" | "start" | "stop";

interface SymbolChord {
  readonly symbols: readonly EncodedSymbol[];
  tupletMark: TupletMark;
}

const isNoteOrRest = (rhythm: string): boolean =>
  rhythm.startsWith("note") || rhythm.startsWith("rest");

const subRatio = (a: Ratio, b: Ratio): Ratio =>
  ratio(a.num * b.den - b.num * a.den, a.den * b.den);

const sameRatio = (a: Ratio, b: Ratio): boolean => compareRatio(a, b) === 0;

/** Python's int() of a Fraction: truncation toward zero. */
const truncRatio = (r: Ratio): number => Math.trunc(r.num / r.den);

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const fractionOf = (symbol: EncodedSymbol): Ratio =>
  durationOfRhythm(symbol.rhythm).fraction;

function isBarline(chord: SymbolChord): boolean {
  const first = chord.symbols[0]?.rhythm;
  return (
    first !== undefined &&
    (first.includes("barline") || first.includes("repeat"))
  );
}

/** SymbolChord.get_duration: the shortest note or rest. */
function chordDuration(chord: SymbolChord): Ratio {
  let shortest: Ratio | undefined;
  for (const symbol of chord.symbols) {
    if (isNoteOrRest(symbol.rhythm)) {
      const fraction = fractionOf(symbol);
      if (shortest === undefined || compareRatio(fraction, shortest) < 0) {
        shortest = fraction;
      }
    }
  }
  return shortest ?? ZERO;
}

/** SymbolChord.into_positions: one chord per position in order of first appearance, chords of rests only first. */
function intoPositions(chord: SymbolChord): SymbolChord[] {
  const buckets = new Map<string, EncodedSymbol[]>();
  for (const symbol of chord.symbols) {
    const bucket = buckets.get(symbol.position);
    if (bucket === undefined) {
      buckets.set(symbol.position, [symbol]);
    } else {
      bucket.push(symbol);
    }
  }
  const chords = [...buckets.values()].map((symbols) => ({
    onlyRests: symbols.every((s) => s.rhythm.startsWith("rest")),
    symbols,
  }));
  // Python's stable sort with reverse=True on a boolean key: True first, ties in order.
  const sorted = [
    ...chords.filter((c) => c.onlyRests),
    ...chords.filter((c) => !c.onlyRests),
  ];
  return sorted.map(({ symbols }) => ({
    symbols,
    tupletMark: chord.tupletMark,
  }));
}

/** np.median of Fractions: the middle one, or the exact mean of the two middle ones. */
function medianRatio(values: readonly Ratio[]): Ratio {
  const sorted = [...values].sort(compareRatio);
  const middle = Math.floor(sorted.length / 2);
  const upper = sorted[middle] ?? ZERO;
  if (sorted.length % 2 === 1) {
    return upper;
  }
  return mulRatio(addRatio(sorted[middle - 1] ?? ZERO, upper), ratio(1, 2));
}

/** find_division_and_time_signature_nominator as homr main has it: every note and rest counts towards the division. */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: a line-for-line port of homr main's function, kept in its shape so the two can be compared
function divisionAndNominator(groups: readonly SymbolChord[]): [number, Ratio] {
  const durations: Ratio[] = [ratio(1, 4)];
  const measures: Ratio[] = [];
  let inMeasure = ZERO;
  for (const chord of groups) {
    if (isBarline(chord) && compareRatio(inMeasure, ZERO) > 0) {
      measures.push(inMeasure);
      inMeasure = ZERO;
    } else {
      for (const symbol of chord.symbols) {
        if (isNoteOrRest(symbol.rhythm)) {
          const fraction = fractionOf(symbol);
          if (compareRatio(fraction, ZERO) > 0) {
            durations.push(fraction);
          }
        }
      }
      const duration = chordDuration(chord);
      if (compareRatio(duration, ZERO) > 0) {
        inMeasure = addRatio(inMeasure, duration);
      }
    }
  }
  if (compareRatio(inMeasure, ZERO) > 0) {
    measures.push(inMeasure);
  }
  let division = 1;
  const denominators = durations
    .filter((d) => compareRatio(d, ZERO) > 0)
    .map((d) => d.den);
  if (denominators.length > 0) {
    division = denominators.reduce((a, b) => Math.abs(a * b) / gcd(a, b));
  }
  return [division, measures.length === 0 ? ratio(1) : medianRatio(measures)];
}

/** TupletParser.get_tuplet_duration. */
function tupletDuration(chord: SymbolChord): SymbolDuration | undefined {
  for (const symbol of chord.symbols) {
    if (isNoteOrRest(symbol.rhythm)) {
      const duration = durationOfRhythm(symbol.rhythm);
      if (duration.normalNotes !== duration.actualNotes) {
        return duration;
      }
    }
  }
  return undefined;
}

/** TupletParser.add_tuplets: false when a tuplet in the measure cannot be completed. */
function addTuplets(groups: readonly SymbolChord[]): boolean {
  let cursor = 0;
  while (cursor < groups.length) {
    const first = groups[cursor];
    const duration = first === undefined ? undefined : tupletDuration(first);
    if (duration === undefined) {
      cursor += 1;
      continue;
    }
    const start = cursor;
    while (cursor - start < duration.actualNotes) {
      const group = groups[cursor];
      if (group === undefined) {
        return false;
      }
      const current = tupletDuration(group);
      if (
        current === undefined ||
        current.actualNotes !== duration.actualNotes ||
        current.normalNotes !== duration.normalNotes
      ) {
        return false;
      }
      cursor += 1;
    }
    const opening = groups[start];
    const closing = groups[cursor - 1];
    if (opening !== undefined && closing !== undefined) {
      opening.tupletMark = "start";
      closing.tupletMark = "stop";
    }
  }
  return true;
}

/** TupletParser.parse: per measure, and a measure whose tuplets fail keeps its old marks. */
function addTupletStartStop(groups: SymbolChord[]): SymbolChord[] {
  let measure: SymbolChord[] = [];
  const measures: SymbolChord[][] = [];
  for (const group of groups) {
    measure.push(group);
    if (isBarline(group)) {
      measures.push(measure);
      measure = [];
    }
  }
  if (measure.length > 0) {
    measures.push(measure);
  }
  for (const groupsOfMeasure of measures) {
    const saved = groupsOfMeasure.map((group) => group.tupletMark);
    if (!addTuplets(groupsOfMeasure)) {
      for (const [index, group] of groupsOfMeasure.entries()) {
        group.tupletMark = saved[index] ?? "";
      }
    }
  }
  return groups;
}

class ConversionState {
  /** 4 * constants.duration_of_quarter until a time signature replaces it with the beat count. */
  beats = 64;
  readonly division: number;
  lastVoltaMeasure = -10;
  readonly nominator: Ratio;
  tremoloState: "start" | "stop" = "stop";
  voltaNumber = 1;

  constructor(division: number, nominator: Ratio) {
    this.division = division;
    this.nominator = nominator;
  }

  startVolta(measure: number): number {
    this.voltaNumber =
      measure === this.lastVoltaMeasure + 1 ? this.voltaNumber + 1 : 1;
    return this.voltaNumber;
  }

  stopVolta(measure: number): number {
    this.lastVoltaMeasure = measure;
    return this.voltaNumber;
  }

  toggleTremolo(): "start" | "stop" {
    this.tremoloState = this.tremoloState === "start" ? "stop" : "start";
    return this.tremoloState;
  }
}

const LIFT_TO_ALTER: Readonly<Record<string, number>> = {
  "#": 1,
  "##": 2,
  b: -1,
  bb: -2,
  N: 0,
};

const DURATION_NAMES: Readonly<Record<number, string>> = {
  0: "breve",
  1: "whole",
  2: "half",
  4: "quarter",
  8: "eighth",
  16: "16th",
  32: "32nd",
  64: "64th",
  128: "128th",
};

function durationName(kern: number): string {
  const name = DURATION_NAMES[kern];
  if (name === undefined) {
    throw new MusicXmlError(`KeyError: ${kern}`);
  }
  return name;
}

const staffOf = (symbol: EncodedSymbol): 1 | 2 =>
  isLowerPosition(symbol.position) ? 2 : 1;

/** Four voices per staff: staff 1 is voices 1 to 4, staff 2 voices 5 to 8. */
const xmlVoice = (staff: number, layer: number): number =>
  (staff - 1) * 4 + layer + 1;

function buildArticulations(
  note: XmlElement,
  articulations: string,
  tupletMark: TupletMark,
  state: ConversionState,
  log: LogLine
): void {
  const notations = note.append(new XmlElement("notations"));
  const marks: XmlElement[] = [];
  const ornaments: XmlElement[] = [];
  for (const articulation of articulations.split("_")) {
    switch (articulation) {
      case "":
        break;
      case NONOTE:
        log(`WARNING note without valid articulation ${articulations}`);
        break;
      case "fermata":
      case "arpeggiate":
        notations.append(new XmlElement(articulation));
        break;
      case "accent":
      case "mordent":
      case "staccato":
      case "staccatissimo":
      case "tenuto":
      case "caesura":
      case "doit":
        marks.push(new XmlElement(articulation));
        break;
      case "breathMark":
        marks.push(new XmlElement("breath-mark"));
        break;
      case "tremolo":
        ornaments.push(
          new XmlElement("tremolo", { type: state.toggleTremolo() }, 3)
        );
        break;
      case "trill":
        ornaments.push(new XmlElement("trill-mark"));
        break;
      case "turn":
        ornaments.push(new XmlElement("inverted-turn"));
        break;
      case "slurStart":
      case "slurStop":
        notations.append(
          new XmlElement("slur", {
            type: articulation === "slurStart" ? "start" : "stop",
          })
        );
        break;
      case "tieStart":
      case "tieStop":
        notations.append(
          new XmlElement("tied", {
            type: articulation === "tieStart" ? "start" : "stop",
          })
        );
        break;
      default:
        throw new MusicXmlError(`Unsupported articulation ${articulation}`);
    }
  }
  if (tupletMark !== "") {
    notations.append(new XmlElement("tuplet", { type: tupletMark }));
  }
  if (marks.length > 0) {
    const parent = notations.append(new XmlElement("articulations"));
    for (const mark of marks) {
      parent.append(mark);
    }
  }
  if (ornaments.length > 0) {
    const parent = notations.append(new XmlElement("ornaments"));
    for (const ornament of ornaments) {
      parent.append(ornament);
    }
  }
}

function buildSlurs(
  note: XmlElement,
  slurs: string,
  number: number,
  log: LogLine
): void {
  const notations =
    note.childrenNamed("notations")[0] ??
    note.append(new XmlElement("notations"));
  const slur = (type: string) =>
    notations.append(new XmlElement("slur", { number: String(number), type }));
  if (slurs === EMPTY || slurs === "") {
    return;
  }
  if (slurs === NONOTE) {
    log(`WARNING note without valid articulation ${slurs}`);
  } else if (slurs === "slurStart") {
    slur("start");
  } else if (slurs === "slurStop") {
    slur("stop");
  } else if (slurs === "slurStart_slurStop") {
    slur("stop");
    slur("start");
  } else {
    throw new MusicXmlError(`Unsupported slur ${slurs}`);
  }
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: a line-for-line port of homr main's function, kept in its shape so the two can be compared
function buildNoteOrRest(
  symbol: EncodedSymbol,
  layer: number,
  isChord: boolean,
  state: ConversionState,
  tupletMark: TupletMark,
  log: LogLine
): XmlElement {
  const note = new XmlElement("note");
  if (isChord) {
    note.append(new XmlElement("chord"));
  }
  if (!isNoteOrRest(symbol.rhythm)) {
    log(
      "Warning, invalid symbol in group: Only notes and rests have durations"
    );
  }
  const duration = durationOfRhythm(symbol.rhythm);
  const isGrace = symbol.rhythm.includes("G");
  if (isGrace) {
    note.append(new XmlElement("grace"));
  }
  if (symbol.pitch === EMPTY) {
    note.append(
      new XmlElement(
        "rest",
        duration.fraction.num === 0 ? { measure: "yes" } : {}
      )
    );
  } else if (symbol.pitch === NONOTE) {
    log(`WARNING note without pitch ${symbolText(symbol)}`);
    note.append(new XmlElement("rest"));
  } else {
    const pitch = note.append(new XmlElement("pitch"));
    pitch.append(leaf("step", symbol.pitch[0] ?? ""));
    pitch.append(leaf("octave", symbol.pitch[1] ?? ""));
    if (symbol.lift === NONOTE) {
      log(`WARNING note with invalid lift ${symbolText(symbol)}`);
    } else if (symbol.lift !== EMPTY) {
      const alter = LIFT_TO_ALTER[symbol.lift];
      if (alter === undefined) {
        throw new MusicXmlError(`KeyError: '${symbol.lift}'`);
      }
      pitch.append(leaf("alter", String(alter)));
    }
  }
  const { fraction, kern } = duration;
  if (isGrace) {
    note.append(leaf("type", durationName(kern)));
  } else if (fraction.num > 0) {
    const base = kern === 0 ? 1 : kern;
    note.append(
      leaf(
        "duration",
        String(
          Math.max(1, truncRatio(mulRatio(fraction, ratio(state.division))))
        )
      )
    );
    note.append(leaf("type", durationName(base)));
  } else {
    note.append(leaf("duration", String(state.beats)));
    note.append(leaf("type", durationName(0)));
  }
  for (let i = 0; i < duration.dots; i += 1) {
    note.append(new XmlElement("dot"));
  }
  if (duration.actualNotes !== duration.normalNotes) {
    const modification = note.append(new XmlElement("time-modification"));
    modification.append(leaf("actual-notes", String(duration.actualNotes)));
    modification.append(leaf("normal-notes", String(duration.normalNotes)));
  }
  const staff = staffOf(symbol);
  note.append(leaf("voice", String(xmlVoice(staff, layer))));
  note.append(leaf("staff", String(staff)));
  buildArticulations(note, symbol.articulation, tupletMark, state, log);
  buildSlurs(note, symbol.slur, staff, log);
  // build_image_position: where the transformer was looking, on the input image.
  if (symbol.imageCoordinates !== undefined) {
    const { x, y } = symbol.imageCoordinates;
    note.append(
      new XmlElement(
        COMMENT,
        {},
        ` imgpos: ${roundHalfEven(x)}, ${roundHalfEven(y)} `
      )
    );
  }
  return note;
}

interface DurationGroup {
  readonly fraction: Ratio;
  readonly notes: EncodedSymbol[];
}

/** _group_notes: by duration, ascending, grace notes at 0, a whole-measure rest at the chord's longest. */
function groupNotes(notes: readonly EncodedSymbol[]): DurationGroup[] {
  let longest: Ratio | undefined;
  for (const note of notes) {
    const fraction = fractionOf(note);
    if (longest === undefined || compareRatio(fraction, longest) > 0) {
      longest = fraction;
    }
  }
  const groups: DurationGroup[] = [];
  for (const note of notes) {
    let fraction = fractionOf(note);
    if (note.rhythm.includes("G")) {
      fraction = ZERO;
    } else if (fraction.num === 0) {
      fraction = longest ?? ZERO;
    }
    const group = groups.find((g) => sameRatio(g.fraction, fraction));
    if (group === undefined) {
      groups.push({ fraction, notes: [note] });
    } else {
      group.notes.push(note);
    }
  }
  return [...groups].sort((a, b) => compareRatio(a.fraction, b.fraction));
}

/** build_backup: the duration is at least 1. */
function backup(duration: Ratio, state: ConversionState): XmlElement {
  if (compareRatio(duration, ZERO) <= 0) {
    throw new MusicXmlError("Backup duration must be positive");
  }
  const element = new XmlElement("backup");
  element.append(
    leaf(
      "duration",
      String(Math.max(1, truncRatio(mulRatio(duration, ratio(state.division)))))
    )
  );
  return element;
}

const isRestPitch = (symbol: EncodedSymbol): boolean =>
  symbol.pitch === EMPTY || symbol.pitch === NONOTE;

/** build_note_chord as homr main has it: notes of a layer, then its first rest after a backup, a backup between layers, and back to the chord's own length. */
function buildNoteChord(
  chord: SymbolChord,
  state: ConversionState,
  duration: Ratio,
  log: LogLine
): XmlElement[] {
  const groups = groupNotes(chord.symbols);
  const result: XmlElement[] = [];
  for (const [layer, group] of groups.entries()) {
    const notes = group.notes.filter((n) => !isRestPitch(n));
    const rests = group.notes.filter(isRestPitch);
    for (const [index, note] of notes.entries()) {
      result.push(
        buildNoteOrRest(note, layer, index > 0, state, chord.tupletMark, log)
      );
    }
    const [rest] = rests;
    if (rest !== undefined) {
      if (compareRatio(group.fraction, ZERO) <= 0) {
        throw new MusicXmlError("AssertionError: a rest group lasts 0");
      }
      if (notes.length > 0) {
        result.push(backup(group.fraction, state));
      }
      result.push(
        buildNoteOrRest(rest, layer, false, state, chord.tupletMark, log)
      );
    }
    if (layer !== groups.length - 1 && compareRatio(group.fraction, ZERO) > 0) {
      result.push(backup(group.fraction, state));
    }
  }
  const longest = groups.at(-1)?.fraction ?? ZERO;
  if (compareRatio(duration, longest) < 0) {
    result.push(backup(subRatio(longest, duration), state));
  }
  return result;
}

/**
 * _advance_to_next_group: how far after this group the next one starts. The
 * group's timed notes and rests join the sounding ones, and the next group
 * starts when the earliest of them ends. Grace notes take no time.
 */
function advanceToNextGroup(
  group: SymbolChord,
  clock: Ratio,
  sounding: Ratio[]
): Ratio {
  const timed = group.symbols
    .filter((s) => isNoteOrRest(s.rhythm))
    .map(fractionOf)
    .filter((d) => compareRatio(d, ZERO) > 0);
  if (timed.length === 0) {
    return ZERO;
  }
  for (const d of timed) {
    sounding.push(addRatio(clock, d));
  }
  let earliest: Ratio | undefined;
  for (const end of sounding) {
    if (
      compareRatio(end, clock) > 0 &&
      (earliest === undefined || compareRatio(end, earliest) < 0)
    ) {
      earliest = end;
    }
  }
  return earliest === undefined ? ZERO : subRatio(earliest, clock);
}

const intText = (element: XmlElement | undefined, fallback: number): number =>
  element === undefined ? fallback : Number.parseInt(element.text ?? "", 10);

interface TimedNoteEvent {
  readonly end: number;
  readonly notes: XmlElement[];
  readonly staff: number;
  readonly start: number;
}

/** The first half of rebalance_measure_voices: each note's start and end, a chord's tones joined into one event. */
function timedEvents(measure: XmlElement): TimedNoteEvent[] {
  const events: TimedNoteEvent[] = [];
  let currentTime = 0;
  let lastNoteStart = 0;
  for (const child of measure.children) {
    if (child.name === "backup") {
      currentTime -= intText(child.childrenNamed("duration")[0], 0);
    } else if (child.name === "forward") {
      currentTime += intText(child.childrenNamed("duration")[0], 0);
    } else if (child.name === "note") {
      const duration = intText(child.childrenNamed("duration")[0], 0);
      const staff = intText(child.childrenNamed("staff")[0], 1);
      const isChordTone = child.childrenNamed("chord").length > 0;
      const start = isChordTone ? lastNoteStart : currentTime;
      const end = start + duration;
      const last = events.at(-1);
      if (
        isChordTone &&
        last?.staff === staff &&
        last.start === start &&
        last.end === end
      ) {
        last.notes.push(child);
      } else {
        if (!isChordTone) {
          lastNoteStart = start;
          currentTime += duration;
        }
        events.push({ end, notes: [child], staff, start });
      }
    }
  }
  return events;
}

/** One staff's events in (start, end) order, each given the lowest voice not still sounding. */
function assignVoices(staff: number, events: readonly TimedNoteEvent[]): void {
  const sorted = [...events].sort((a, b) => a.start - b.start || a.end - b.end);
  let active: { end: number; voice: number }[] = [];
  for (const event of sorted) {
    active = active.filter((a) => a.end > event.start);
    const used = new Set(active.map((a) => a.voice));
    let voice = 1;
    while (used.has(voice)) {
      voice += 1;
    }
    active.push({ end: event.end, voice });
    for (const note of event.notes) {
      const [element] = note.childrenNamed("voice");
      if (element !== undefined) {
        element.text = String(xmlVoice(staff, voice - 1));
      }
    }
  }
}

/** rebalance_measure_voices: non-overlapping voices per staff for the whole measure. */
function rebalanceMeasureVoices(measure: XmlElement): void {
  const byStaff = new Map<number, TimedNoteEvent[]>();
  for (const event of timedEvents(measure)) {
    byStaff.set(event.staff, [...(byStaff.get(event.staff) ?? []), event]);
  }
  for (const [staff, events] of byStaff) {
    assignVoices(staff, events);
  }
}

/** get_note_pitch: step, alter and octave joined by "|", or undefined for a rest. */
function notePitch(note: XmlElement): string | undefined {
  const [pitch] = note.childrenNamed("pitch");
  if (pitch === undefined) {
    return undefined;
  }
  return ["step", "alter", "octave"]
    .map((part) => pitch.childrenNamed(part)[0]?.text ?? "")
    .join("|");
}

/** get_slur: the note's first slur of this type and the notations holding it. */
function slurOf(
  note: XmlElement,
  type: string
): { notations: XmlElement; slur: XmlElement } | undefined {
  for (const notations of note.childrenNamed("notations")) {
    for (const slur of notations.childrenNamed("slur")) {
      if (slur.attribute("type") === type) {
        return { notations, slur };
      }
    }
  }
  return undefined;
}

function removeChild(parent: XmlElement, child: XmlElement): void {
  const at = parent.children.indexOf(child);
  if (at >= 0) {
    parent.children.splice(at, 1);
  }
}

/** add_tie: `<tie>` after `<duration>` (or first), `<tied>` first in the notations. */
function addTie(note: XmlElement, type: string, notations: XmlElement): void {
  const [duration] = note.childrenNamed("duration");
  const at = duration === undefined ? 0 : note.children.indexOf(duration) + 1;
  note.children.splice(at, 0, new XmlElement("tie", { type }));
  notations.children.splice(0, 0, new XmlElement("tied", { type }));
}

/** group_into_events: the measure's notes, a chord's tones kept with the note before. */
function groupIntoEvents(measure: XmlElement): XmlElement[][] {
  const events: XmlElement[][] = [];
  for (const note of measure.childrenNamed("note")) {
    const last = events.at(-1);
    if (note.childrenNamed("chord").length > 0 && last !== undefined) {
      last.push(note);
    } else {
      events.push([note]);
    }
  }
  return events;
}

/** tie_event: each slur start in `before` whose pitch has a slur stop in `after` becomes a tie. */
function tieEvent(before: readonly XmlElement[], after: readonly XmlElement[]) {
  for (const startNote of before) {
    const begins = slurOf(startNote, "start");
    if (begins === undefined) {
      continue;
    }
    const pitch = notePitch(startNote);
    if (pitch === undefined) {
      continue;
    }
    for (const stopNote of after) {
      if (notePitch(stopNote) !== pitch) {
        continue;
      }
      const ends = slurOf(stopNote, "stop");
      if (ends === undefined) {
        continue;
      }
      removeChild(begins.notations, begins.slur);
      removeChild(ends.notations, ends.slur);
      addTie(startNote, "start", begins.notations);
      addTie(stopNote, "stop", ends.notations);
      break;
    }
  }
}

/** convert_ties over a whole part: the previous event of each (staff, voice). */
function convertTies(measures: readonly XmlElement[]): void {
  const previous = new Map<string, XmlElement[]>();
  for (const measure of measures) {
    for (const event of groupIntoEvents(measure)) {
      const [first] = event;
      if (first === undefined) {
        continue;
      }
      const key = `${first.childrenNamed("staff")[0]?.text ?? "1"} ${first.childrenNamed("voice")[0]?.text ?? "1"}`;
      const before = previous.get(key);
      previous.set(key, event);
      if (before !== undefined) {
        tieEvent(before, event);
      }
    }
  }
}

function attributesOf(
  measure: XmlElement,
  last: XmlElement | undefined,
  forceNew = false
): XmlElement {
  if (last !== undefined && !forceNew) {
    return last;
  }
  return measure.append(new XmlElement("attributes"));
}

function barlineOf(
  measure: XmlElement,
  location: "left" | "right"
): XmlElement {
  return (
    measure
      .childrenNamed("barline")
      .find((barline) => barline.attribute("location") === location) ??
    measure.append(new XmlElement("barline", { location }))
  );
}

function buildRepeat(rhythm: string, barline: XmlElement, log: LogLine): void {
  if (barline.childrenNamed("repeat").length > 0) {
    log("barline already has a repeat");
    return;
  }
  barline.append(
    new XmlElement("repeat", {
      direction: rhythm === "repeatStart" ? "forward" : "backward",
    })
  );
}

function buildEnding(
  rhythm: string,
  barline: XmlElement,
  number: number
): void {
  let type: string;
  if (rhythm.startsWith("voltaStart")) {
    type = "start";
  } else if (rhythm.startsWith("voltaStop")) {
    type = "stop";
  } else {
    type = "discontinue";
  }
  barline.append(new XmlElement("ending", { number: String(number), type }));
}

/** A part's measures as they are written, the open one last. */
class MeasureList {
  current = new XmlElement("measure", { number: "1" });
  readonly measures: XmlElement[] = [];
  number = 1;
  readonly onClose: () => void;

  constructor(onClose: () => void) {
    this.onClose = onClose;
  }

  barline(location: "left" | "right"): XmlElement {
    return barlineOf(this.current, location);
  }

  /** close_current_measure, then a new measure. */
  next(): void {
    rebalanceMeasureVoices(this.current);
    this.measures.push(this.current);
    this.onClose();
    this.number += 1;
    this.current = new XmlElement("measure", { number: String(this.number) });
  }

  /** The open measure is kept only if anything was written to it. */
  finish(): XmlElement[] {
    if (this.current.children.length > 0) {
      rebalanceMeasureVoices(this.current);
      this.measures.push(this.current);
      this.onClose();
    }
    return this.measures;
  }
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: a line-for-line port of homr main's function, kept in its shape so the two can be compared
function buildMeasures(
  voice: readonly EncodedSymbol[],
  hasTwoStaves: boolean,
  log: LogLine
): XmlElement[] {
  let clock = ZERO;
  let sounding: Ratio[] = [];
  const list = new MeasureList(() => {
    clock = ZERO;
    sounding = [];
  });
  const groups = addTupletStartStop(
    sortTokenChords(voice).map((symbols) => ({ symbols, tupletMark: "" }))
  );
  const [division, nominator] = divisionAndNominator(groups);
  const state = new ConversionState(division, nominator);
  const first = attributesOf(list.current, undefined);
  first.append(leaf("divisions", String(Math.floor(division / 4))));
  if (hasTwoStaves) {
    first.append(leaf("staves", "2"));
    first.append(leaf("part-symbol", "brace"));
  }
  let attributes: XmlElement | undefined = first;
  for (const [groupNo, group] of groups.entries()) {
    const [symbol] = group.symbols;
    const last = attributes;
    attributes = undefined;
    if (symbol === undefined) {
      continue;
    }
    const { rhythm } = symbol;
    if (isNoteOrRest(rhythm)) {
      if (group.symbols.length === 1 && rhythm.endsWith("m")) {
        attributes = attributesOf(list.current, last);
        if (attributes.childrenNamed("measure-style").length > 0) {
          log("Measure already has a multi rest");
        } else {
          const count = (rhythm.split("_")[1] ?? "").replace("m", "");
          attributes
            .append(new XmlElement("measure-style"))
            .append(leaf("multiple-rest", String(Number.parseInt(count, 10))));
        }
      } else {
        const positions = intoPositions(group);
        const advance = advanceToNextGroup(group, clock, sounding);
        clock = addRatio(clock, advance);
        sounding = sounding.filter((end) => compareRatio(end, clock) > 0);
        for (const [index, position] of positions.entries()) {
          const duration = index === positions.length - 1 ? advance : ZERO;
          for (const element of buildNoteChord(
            position,
            state,
            duration,
            log
          )) {
            list.current.append(element);
          }
        }
      }
      continue;
    }
    if (rhythm === "newline") {
      if (groupNo !== groups.length - 1) {
        list.current.append(new XmlElement("print", { "new-system": "yes" }));
      }
    } else if (rhythm.startsWith("clef")) {
      attributes = attributesOf(list.current, last, true);
      for (const clef of group.symbols) {
        if (clef.rhythm.startsWith("clef")) {
          const signAndLine = clef.rhythm.split("_")[1] ?? "";
          const element = attributes.append(
            new XmlElement("clef", { number: String(staffOf(clef)) })
          );
          element.append(leaf("sign", signAndLine[0] ?? ""));
          element.append(leaf("line", signAndLine[1] ?? ""));
        }
      }
    } else if (rhythm.startsWith("keySignature")) {
      attributes = attributesOf(list.current, last);
      attributes
        .append(new XmlElement("key"))
        .append(leaf("fifths", rhythm.split("_")[1] ?? ""));
    } else if (rhythm.startsWith("timeSignature")) {
      attributes = attributesOf(list.current, last);
      const denominator = rhythm.split("/")[1] ?? "";
      const beats = Math.max(
        truncRatio(
          mulRatio(state.nominator, ratio(Number.parseInt(denominator, 10)))
        ),
        1
      );
      const time = attributes.append(new XmlElement("time"));
      time.append(leaf("beats", String(beats)));
      time.append(leaf("beat-type", denominator));
      state.beats = beats;
    } else if (rhythm.includes("barline")) {
      if (rhythm !== "barline") {
        list
          .barline("right")
          .append(
            leaf(
              "bar-style",
              rhythm === "bolddoublebarline" ? "heavy-heavy" : "light-light"
            )
          );
      }
      list.next();
    } else if (rhythm === "repeatStart") {
      list.next();
      buildRepeat(rhythm, list.barline("right"), log);
    } else if (rhythm === "repeatEnd") {
      buildRepeat(rhythm, list.barline("right"), log);
      list.next();
    } else if (rhythm === "repeatEndStart") {
      buildRepeat("repeatEnd", list.barline("right"), log);
      list.next();
      buildRepeat("repeatStart", list.barline("right"), log);
    } else if (rhythm.startsWith("voltaStart")) {
      buildEnding(rhythm, list.barline("left"), state.startVolta(list.number));
    } else if (
      rhythm.startsWith("voltaStop") ||
      rhythm.startsWith("voltaDiscontinue")
    ) {
      buildEnding(rhythm, list.barline("right"), state.stopVolta(list.number));
    } else {
      log(`Symbol isn't supported yet  ${symbolText(symbol)}`);
    }
  }
  const measures = list.finish();
  if (first.childrenNamed("time").length === 0) {
    const time = first.append(new XmlElement("time"));
    time.append(
      leaf(
        "beats",
        String(Math.max(truncRatio(mulRatio(state.nominator, ratio(4))), 1))
      )
    );
    time.append(leaf("beat-type", "4"));
  }
  convertTies(measures);
  return measures;
}

const partId = (index: number): string => `P${index + 1}`;

function buildScorePart(index: number, hasTwoStaves: boolean): XmlElement {
  const [name, sound, program] = hasTwoStaves
    ? ["Piano", "keyboard.piano", 1]
    : ["Voice", "voice", 54];
  const id = partId(index);
  const part = new XmlElement("score-part", { id });
  part.append(leaf("part-name", name));
  const instrument = part.append(
    new XmlElement("score-instrument", { id: `${id}-I1` })
  );
  instrument.append(leaf("instrument-name", name));
  instrument.append(leaf("instrument-sound", sound));
  const midi = part.append(
    new XmlElement("midi-instrument", { id: `${id}-I1` })
  );
  midi.append(leaf("midi-channel", String(index + 1)));
  midi.append(leaf("midi-program", String(program)));
  midi.append(leaf("volume", "100"));
  midi.append(leaf("pan", "0"));
  return part;
}

/**
 * homr main's generate_xml(XmlGeneratorArguments(), voices, title): one part
 * per voice, a part with any lower or lower2 symbol being a two-staff piano
 * part. Throws MusicXmlError where homr raises.
 */
export function generateMusicXmlMain(
  voices: readonly (readonly EncodedSymbol[])[],
  title: string,
  log: LogLine = () => undefined
): string {
  const root = new XmlElement("score-partwise", { version: "4.0" });
  root
    .append(new XmlElement("work"))
    .append(new XmlElement("work-title", {}, title));
  root
    .append(new XmlElement("identification"))
    .append(new XmlElement("encoding"))
    .append(leaf("software", "homr"));
  root.append(new XmlElement("defaults"));
  const twoStaves = voices.map((voice) =>
    voice.some((symbol) => isLowerPosition(symbol.position))
  );
  const partList = root.append(new XmlElement("part-list"));
  for (const [index, hasTwo] of twoStaves.entries()) {
    partList.append(buildScorePart(index, hasTwo));
  }
  for (const [index, voice] of voices.entries()) {
    const part = root.append(new XmlElement("part", { id: partId(index) }));
    for (const measure of buildMeasures(
      voice,
      twoStaves[index] ?? false,
      log
    )) {
      part.append(measure);
    }
  }
  return writeXmlDocument(root);
}
