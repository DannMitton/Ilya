/**
 * Shane score-parser canonical types.
 *
 * These types define `ParsedScore`, Shane's unified internal representation
 * of a parsed musical score. Two parsers, `MnxScoreParser` and
 * `MusicXmlScoreParser`, both produce `ParsedScore` from their respective
 * source formats. Downstream analysis and rendering consume `ParsedScore`
 * and do not care which format it came from.
 *
 * The shape is closer to MNX than to MusicXML, because MNX maps more
 * directly to Shane's analytical needs (explicit lyric-to-note alignment,
 * JSON-native structure, and a stable lyric subset). MusicXML differences
 * are normalised inside the `MusicXmlScoreParser`, not exposed in the type.
 *
 * Status: Phase 1 draft for review. Authoritative references are
 * `ARCHITECTURE_SPEC_dual_canonical.md` and Round 9 spec §3.8 (multi-verse
 * data-model policy) and §4.2 (data-attribute mandates).
 */

// ── Utility types ──────────────────────────────────────────────────

/**
 * Exact rational number. Used throughout for rhythmic arithmetic, where
 * decimal floats lose precision on tuplets and dotted values.
 *
 * Convention: callers can normalise to lowest terms when comparing,
 * or cross-multiply (a.n * b.d vs b.n * a.d) for ordering.
 */
export interface Fraction {
  numerator: number;
  denominator: number;
}

// ── Top-level: ParsedScore ────────────────────────────────────────

export interface ParsedScore {
  /** Provenance and confidence. Drives Round 9 banner and badge UI. */
  source: ScoreSource;

  /**
   * The vocal part Shane will analyse. Selected by the parser from the
   * source's available parts; in a piano-voice score this is the voice
   * staff.
   */
  vocalPart: VocalPart;

  /**
   * Work-level metadata from the source header, when the source carries
   * any (§A.6/§A.16). Absent when nothing was found.
   */
  workMetadata?: WorkMetadata;

  /**
   * Ordered measures, the score's coordinate system. Time, key, and
   * tempo state at each measure is snapshotted from the change events
   * below for direct access without walking the timeline.
   */
  measures: Measure[];

  /** Initial key signature plus all changes, in measure order. */
  keySignatures: KeySignatureChange[];

  /**
   * Initial clef plus all changes on the vocal staff, in measure order.
   * Parsers that see clef information always set this (empty array =
   * the source carried none). Optional so sources with no clef concept
   * and older fixtures stay valid; absence and emptiness both route
   * downstream clef selection to the tessitura heuristic.
   */
  clefs?: ClefChange[];

  /** Initial time signature plus all changes, in measure order. */
  timeSignatures: TimeSignatureChange[];

  /** Initial tempo plus all changes, in score order. */
  tempoMarkings: TempoMarking[];

  /** The vocal line's ordered events: notes and rests, with attached syllables. */
  vocalLine: VocalLineEvent[];

  /**
   * Optional accompaniment parts, for greyed-out rendering. v1 parsers
   * may leave this undefined; full accompaniment parsing is deferred.
   * The shape is declared here so downstream types do not need to
   * change when accompaniment support lands.
   */
  accompaniment?: AccompanimentLine[];
}

// ── Work metadata (§A.6/§A.16; shape approved by Dann, 2026-07-13) ──

/**
 * Work-level metadata extracted from source headers, mirroring Ilya's
 * drawer `SongMetadata` fields so the §A.6 auto-populate is a straight
 * field-for-field merge (score wins, singer overrides).
 *
 * MusicXML carries these richly (`<work-title>`, `<work-number>`, typed
 * `<creator>` elements). Real denigma MNX carries none (verified against
 * the Sharp Excerpt, 2026-07-13), so MNX extraction is a guarded read
 * that usually returns nothing; downstream merging must tolerate a
 * wholly absent `workMetadata`.
 *
 * `arranger` is preserved for provenance display but deliberately has
 * no drawer slot: a transcriber credit must not masquerade as the poet.
 */
export interface WorkMetadata {
  title?: string;
  /** Opus / catalogue designation (MusicXML `<work-number>`). */
  opus?: string;
  composer?: string;
  /** MusicXML creator types `lyricist` and `poet` both land here. */
  poet?: string;
  translator?: string;
  arranger?: string;
}

// ── Source provenance ────────────────────────────────────────────

export interface ScoreSource {
  /** Which native format the parser consumed. */
  format: 'mnx' | 'musicxml';

  /** Coarse fidelity tier. Drives high-level UI decisions. */
  fidelity: FidelityLevel;

  /**
   * Specific origin path. Drives Round 9 banner copy (spec §2 Item 1)
   * and the metadata-line format text ("Format: Finale .musx → MNX", etc.).
   * Separate from `fidelity` because Round 9 distinguishes sources at
   * the same fidelity level: native MNX gets silent acceptance, while
   * denigma-derived MNX gets a transparency banner, even though both
   * are high-fidelity.
   */
  origin: SourceOrigin;

  /**
   * ISO 639-3 language hint (`'rus'`, `'fra'`, `'deu'`, `'ita'`)
   * detected from source metadata or specified by the user. The analysis
   * layer routes per-syllable transcription to the engine matching this
   * hint. v1 only ships the Russian engine.
   */
  languageHint?: string;

  /**
   * Non-fatal parser observations: dropped elements, dialect quirks,
   * unrecognised structures. User-facing for advanced inspection;
   * these do not block analysis.
   */
  sourceWarnings: string[];
}

/**
 * Coarse fidelity tier. Architecture spec §Layer 1 source table.
 *
 * - `'native'`: direct MNX or MusicXML, no conversion.
 * - `'high'`: lossless conversion from a structured source (denigma
 *   `.musx`, MuseScore CLI `.mscz`, PDFtoMusic Pro vector PDF).
 * - `'medium'`: lossy conversion (homr OMR on raster PDF, MIDI).
 * - `'medium-low'`: image OMR with significant error rate
 *   (photographs, scans).
 */
export type FidelityLevel = 'native' | 'high' | 'medium' | 'medium-low';

/**
 * Specific source-and-tool combination. Used by Round 9 UI to choose
 * banner colour and copy, and to compose the metadata-line format text.
 */
export type SourceOrigin =
  | 'mnx-direct'
  | 'musicxml-direct'
  | 'denigma-mnx-from-musx'
  | 'musescore-cli-musicxml-from-mscz'
  | 'pdftomusic-pro-musicxml-from-vector-pdf'
  | 'homr-musicxml-from-image'
  | 'midi-converted-musicxml';

// ── Vocal part identity ───────────────────────────────────────────

export interface VocalPart {
  /**
   * Stable identifier in the source score (MusicXML `<score-part id>`,
   * MNX part `id` field). Preserved for round-tripping and correction.
   */
  partId: string;

  /**
   * Display name from the source, often `'Voice'`, `'Soprano'`,
   * `'Tenor'`, and similar. The analysis layer may cross-check this
   * against the user's selected voice profile but does not act on it.
   */
  partName: string;

  /**
   * Concert-pitch transposition in semitones. Undefined for
   * non-transposing vocal parts, the common case for vocal music.
   */
  transposition?: number;
}

// ── Measures ──────────────────────────────────────────────────────

export interface Measure {
  /** 0-based sequential index. The canonical reference used by events. */
  index: number;

  /**
   * Display number from the source. Usually `String(index + 1)` but may
   * differ for pickup measures, repeats, or annotated numbering.
   * String rather than number so pickups can be `'0'`, `''`, or `'X'`
   * per publisher convention.
   */
  number: string;

  /** Active time signature for this measure, snapshotted from changes. */
  timeSignature: TimeSignature;

  /** Active key signature for this measure, snapshotted from changes. */
  keySignature: KeySignature;

  /**
   * Active printed clef for this measure, snapshotted from `clefs`.
   * Undefined when the source carries no clef information.
   */
  clef?: Clef;

  /**
   * Expected total duration in whole-note units, derived from
   * `timeSignature`. A regular 4/4 measure is `{numerator: 1, denominator: 1}`.
   */
  expectedDuration: Fraction;

  /** True for an anacrusis (pickup measure shorter than expectedDuration). */
  isPickup?: boolean;

  /** Repeat barline markings, if present in the source. */
  repeatStart?: boolean;
  repeatEnd?: boolean;

  /** Backward-repeat play count from `<repeat times>`; the unfolder defaults to 2 when absent. */
  repeatTimes?: number;

  /**
   * `<repeat after-jump="yes">`: this repeat is re-taken on a da-capo/dal-segno pass.
   * Captured for fidelity; the unfolder does not yet support it and flags instead.
   */
  repeatAfterJump?: boolean;

  /**
   * Ending (volta) membership, resolved to the passes this measure sounds on.
   * `passes` drives performance-order unfolding; `startsHere`/`endsHere` mark the
   * first and last measure of the ending, for drawing the bracket later.
   */
  ending?: {
    passes: number[];
    startsHere?: boolean;
    endsHere?: boolean;
  };

  /**
   * Jump-family navigation for this measure, read from MusicXML `<sound>` control
   * flow only (never printed `<direction-type>` glyphs or words), per §A.78. Drives
   * performance-order unfolding; source-agnostic (an MNX or OMR front end that learns
   * to express jumps would populate the same shape). `segno`/`coda` are destination
   * tokens; `dalSegno`/`toCoda` are origin tokens matched to them by string equality.
   */
  jump?: {
    /** This measure is a segno destination; token from `<sound segno>`. */
    segno?: string;
    /** This measure is a coda destination; token from `<sound coda>`. */
    coda?: string;
    /** Da Capo origin (jump to the top). From `<sound dacapo="yes">`. */
    daCapo?: boolean;
    /** Dal Segno origin; token matching a `segno`. From `<sound dalsegno>`. */
    dalSegno?: string;
    /** To Coda origin; token matching a `coda`. From `<sound tocoda>`. */
    toCoda?: string;
    /** Fine: ends the piece on a da-capo/dal-segno return. From `<sound fine="yes">`. */
    fine?: boolean;
    /** A navigation `<sound>` carried `time-only`; the unfolder does not support it and flags. */
    timeOnly?: boolean;
    /**
     * A printed jump mark (segno/coda glyph, or navigation words) with no `<sound>`
     * to make it playable. The unfolder flags rather than guessing (§A.78).
     */
    markWithoutSound?: boolean;
  };

  /** Optional rehearsal mark text (`'A'`, `'Verse 2'`, and so on). */
  rehearsalMark?: string;
}

export interface TimeSignature {
  /** Numerator. e.g., 3 for 3/4. */
  beats: number;

  /** Denominator. Must be a power of 2. e.g., 4 for 3/4. */
  beatType: number;

  /**
   * Explicit symbol shown in the score, if any.
   * `'common'` is C, `'cut'` is cut-time (¢), `'normal'` is the
   * default numeric display.
   */
  symbol?: 'common' | 'cut' | 'normal';
}

export interface KeySignature {
  /**
   * Fifths from C major. Positive for sharps, negative for flats.
   * Range -7 to +7.
   */
  fifths: number;

  /** Mode for tonal music. Undefined for atonal, modal, or unspecified. */
  mode?: 'major' | 'minor';
}

export interface TimeSignatureChange {
  /** Measure at which this signature begins. */
  measureIndex: number;
  signature: TimeSignature;
}

export interface KeySignatureChange {
  /** Measure at which this key begins. */
  measureIndex: number;
  signature: KeySignature;
}

// ── Clefs ─────────────────────────────────────────────────────────

/**
 * Printed clef, captured from the source when present. Modern vocal
 * scores use treble (G2) and bass (F4) only; a tenor part is written in
 * treble sounding an octave lower, ideally treble-with-8 (Gould
 * extraction v5, rule 76). C clefs are preserved here for source
 * fidelity, but the renderer never draws one: clef selection maps them
 * through the tessitura heuristic instead.
 */
export interface Clef {
  /** Clef sign as printed. */
  sign: 'G' | 'F' | 'C';

  /**
   * Staff line the sign centres on, 1 = bottom line. Standard values:
   * G on 2 (treble), F on 4 (bass), C on 3 (alto) or 4 (tenor).
   */
  line: number;

  /**
   * Printed octave displacement: -1 for the tenor treble-with-8 below,
   * +1 for an octave-up clef. Undefined when none is printed.
   */
  octaveChange?: number;
}

export interface ClefChange {
  /** Measure at which this clef begins. */
  measureIndex: number;
  clef: Clef;
}

// ── Tempo markings ────────────────────────────────────────────────

export interface TempoMarking {
  /** Where this tempo begins. */
  measureIndex: number;
  rhythmicPosition: RhythmicPosition;

  /** Beats per minute. */
  bpm: number;

  /** Note value the BPM refers to. e.g., `'quarter'` for "quarter = 120". */
  beatUnit: NoteBase;

  /** Dots on the beat unit. 0 for plain, 1 for "dotted-quarter = 60". */
  beatUnitDots: number;

  /**
   * Source text as printed (`'Allegro moderato'`, `'q. = 60'`, and so on).
   * Undefined for bare metronome markings with no verbal text.
   */
  text?: string;
}

// ── Vocal-line events ────────────────────────────────────────────

export interface VocalLineEvent {
  /**
   * Stable identifier for this event. Generated by the parser as a UUID v4
   * or a deterministic composite key like
   * `m{measureIndex}-{numerator}-{denominator}-{voice}`. Used as
   * `data-note-id` on the rendered SVG (Round 9 §4.2) and as the anchor
   * for the v1.x cross-tab jump feature.
   */
  id: string;

  /** What kind of event this is. */
  type: 'note' | 'rest';

  /** Measure containing this event. */
  measureIndex: number;

  /** Where within the measure the event begins. */
  rhythmicPosition: RhythmicPosition;

  /** How long the event lasts. */
  duration: Duration;

  /** Pitch info for notes; undefined for rests. */
  pitch?: Pitch;

  /**
   * Tie info if this note is part of a tie chain. Undefined for untied
   * notes and for rests.
   */
  tied?: TieInfo;

  /**
   * Syllable attached to this note. Undefined when:
   *   - the event is a rest,
   *   - this note extends a melisma started on a previous note, or
   *   - no lyrics are present in the source.
   *
   * Melismas are encoded by absence of syllable on subsequent notes,
   * not by an explicit marker (architecture spec §"The ParsedScore
   * canonical type").
   */
  syllable?: SyllableInfo;

  /** Fermata if present on this event. */
  fermata?: FermataInfo;

  /**
   * Articulations attached to this event. v1 analysis primarily attends
   * to `'breath-mark'` and `'caesura'` for phrase boundary detection;
   * others are preserved verbatim for the renderer-output pipeline.
   */
  articulations?: Articulation[];
}

// ── Sub-event detail ─────────────────────────────────────────────

export interface Pitch {
  /** Diatonic step. */
  step: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

  /** Octave number using MIDI convention. Middle C is C4. */
  octave: number;

  /**
   * Chromatic alteration. -2 (double-flat) to +2 (double-sharp).
   * Enharmonic-preserving: B♯4 (step `'B'`, alter +1) and C5 (step `'C'`,
   * alter 0) are distinct values even though they sound the same.
   */
  alter: number;
}

/** Position within a measure, in whole-note units from measure start. */
export interface RhythmicPosition {
  /**
   * For example, `{numerator: 0, denominator: 1}` is the downbeat,
   * `{numerator: 1, denominator: 4}` is one quarter-note in, and
   * `{numerator: 3, denominator: 8}` is three eighth-notes in (the
   * "and of beat 2" in 4/4).
   */
  fraction: Fraction;
}

export interface Duration {
  /** Visual base of the note. */
  base: NoteBase;

  /** Number of augmentation dots (0 to 3). */
  dots: number;

  /** Tuplet info, if this event is part of a tuplet group. */
  tuplet?: TupletInfo;

  /**
   * Effective sounding length in whole-note units. Parser-computed
   * from `base`, `dots`, and `tuplet`, provided as a convenience so
   * downstream code does not duplicate the computation. The source
   * of truth is `base`/`dots`/`tuplet`; this field is derived.
   */
  fraction: Fraction;
}

/**
 * Note-value base used in `Duration` and `TempoMarking.beatUnit`.
 *
 * Matches MusicXML's `<type>` element values. v1 vocal music rarely
 * needs values outside `'whole'` through `'32nd'`; the wider range is
 * included for source-fidelity preservation.
 */
export type NoteBase =
  | '128th'
  | '64th'
  | '32nd'
  | '16th'
  | 'eighth'
  | 'quarter'
  | 'half'
  | 'whole'
  | 'breve';

export interface TupletInfo {
  /** How many notes are in this tuplet group. e.g., 3 for a triplet. */
  actualNotes: number;

  /**
   * What duration those notes occupy in normal time. e.g., 2 for an
   * eighth-note triplet, which is 3 notes in the time of 2.
   */
  normalNotes: number;

  /** The base value of `normalNotes`. e.g., `'eighth'` for an eighth-triplet. */
  normalType: NoteBase;
}

export interface TieInfo {
  /**
   * Role of this note in the tie chain. `'continue'` is for the middle
   * notes of a multi-note tie; `'let-ring'` is l.v. notation (less common
   * in vocal music but preserved for fidelity).
   */
  type: 'start' | 'continue' | 'stop' | 'let-ring';

  /**
   * Optional pointer to the partner event by id, for non-adjacent ties.
   * Most ties are adjacency-based and do not need this field.
   */
  partnerEventId?: string;
}

export interface FermataInfo {
  /**
   * Visual shape. `'normal'` covers the standard semicircle; others
   * are rare but preserved for source fidelity.
   */
  shape?: 'normal' | 'angled' | 'square' | 'double-angled' | 'double-square';

  /** Placement above or below the staff. */
  placement?: 'above' | 'below';
}

/**
 * Articulation marks. v1 analysis primarily uses `'breath-mark'` and
 * `'caesura'` for phrase boundary detection; other articulations are
 * preserved verbatim for the renderer-output pipeline.
 */
export type Articulation =
  | 'accent'
  | 'strong-accent'
  | 'staccato'
  | 'tenuto'
  | 'detached-legato'
  | 'staccatissimo'
  | 'breath-mark'
  | 'caesura'
  | 'stress'
  | 'unstress';

// ── Lyrics ────────────────────────────────────────────────────────

export interface SyllableInfo {
  /**
   * Stable identifier for this syllable. Used as `data-syllable-id` on
   * the rendered SVG (Round 9 §4.2). Parser-generated; persists across
   * re-renders so the v1.x cross-tab jump can target it reliably.
   */
  id: string;

  /**
   * Syllable text as printed in the source. Cyrillic preserved exactly
   * for Russian; no normalisation here. Downstream `processText` in Ilya
   * handles Russian-specific transformations (yo restoration, poetic
   * normalisation, casing).
   */
  text: string;

  /**
   * MNX-style syllabic role. `'whole'` for a standalone single-syllable
   * word, `'start'` for the first syllable of a multi-syllable word,
   * `'middle'` for an internal syllable, `'end'` for the final syllable
   * of a multi-syllable word.
   */
  type: 'whole' | 'start' | 'middle' | 'end';

  /**
   * Verse this syllable belongs to. 1-indexed. v1 UI shows only verse 1
   * (Round 9 spec §3.8), but the data model preserves all verses for
   * v1.x multi-verse analysis.
   *
   * For MNX: assigned from `global.lyrics.lineOrder` when present
   * (canonical), falling back to document-order of first appearance
   * (non-canonical, emits a `'lineorder-missing'` warning). Verse
   * detection itself requires preprocessing: events with only one
   * lyric syllable each are not necessarily a verse structure;
   * verses appear when at least one event carries multiple syllables
   * (Patterson correction, 2026-05-15).
   *
   * For MusicXML: assigned directly from `<lyric number="N">`.
   */
  verseNumber: number;

  /**
   * User-facing verse label from the source, when available.
   * For MNX: read from `global.lyrics.lineMetadata[lineId].label`.
   * For MusicXML: not applicable (the `number` attribute is purely
   * numeric).
   *
   * Examples: "Verse 1", "Refrain", "Coda", or "Verse 2" when the
   * original used non-sequential verse numbering (as in the Patterson
   * sample, where four verses were labeled "Verse 2", "Verse 4",
   * "Verse 6", and "Verse 8"). Preserves the original user-facing
   * identity; `verseNumber` gives canonical 1..N. UI may display
   * `verseLabel ?? \`Verse ${verseNumber}\``.
   */
  verseLabel?: string;

  /**
   * The full word this syllable is part of. Parser-computed by
   * concatenating contiguous syllables of the same word and verse.
   * Used as `data-word-context` on the rendered SVG (Round 9 §4.2)
   * to anchor the v1.x cross-tab jump's "send the whole word to Ilya"
   * behaviour.
   *
   * For `type: 'whole'` syllables, `wordContext` equals `text`.
   */
  wordContext: string;

  /**
   * All verse texts for this event, index 0 = verse 1 (Kimi's multi-verse
   * ruling, 2026-07-12; her `verses?: string[]`, kept in our naming).
   * Absent means single-verse. `text` remains the primary (verse-1) lens
   * that v1 analysis reads. Now derived from `versesInfo`, one text per
   * entry in the same order: kept as a convenience for callers that need
   * only the text, but `versesInfo` is the authoritative per-verse record.
   */
  verses?: string[];

  /**
   * Structured per-verse syllable data for every verse present on this
   * event, ordered by canonical `verseNumber` (Option B, Dann's ruling
   * 2026-07-17, §A.95). Present only when more than one verse sings on the
   * event; absent means single-verse, so read the primary fields above.
   * Includes the primary verse's own entry, so this is a complete,
   * self-describing view: each entry carries its own `verseNumber`, which
   * lets a verse-N reconstruction (`collectScoreWords` generalised) gather
   * a verse across notes without positional guessing, even when verses are
   * sparse. Sparse verses are the core case here, not an edge: on a note
   * where verse 1 holds a melisma but verse 2 sings a new syllable, verse 2
   * is stored as this event's primary while on neighbouring notes it is
   * not, and only a self-describing per-verse record recovers it losslessly.
   * `verses` equals `versesInfo.map((v) => v.text)`.
   *
   * Each entry carries `text` and the syllabic `type`. `type` was
   * previously kept only for the primary verse, which is exactly what
   * blocked reconstructing any verse but verse 1 (§A.95). Per-verse
   * `wordContext`, elision `segments`, and `verseLabel` are deliberately
   * not stored here yet; they are follow-ons for when multi-verse
   * reconstruction and rendering consume this.
   */
  versesInfo?: VerseSyllable[];

  /**
   * Elision segments for the *primary* verse: the two-or-more syllables a
   * composer set on this one note (commoner in Italian, real in Russian).
   * `text` holds the concatenated printed pair; `segments` holds the split
   * (Kimi's ruling, 2026-07-12). For v1 this describes verse 1 only; a
   * future per-verse split (`versesSegments?: SyllableSegment[][]`) has
   * room to grow but is not paid for now. Absent means no elision.
   */
  segments?: SyllableSegment[];

  /**
   * Parser flag surfaced to the correction UI (Kimi's
   * `parseWarning: 'ELIDED_SYLLABLE'`, kept in our lowercase style):
   * `'elided'` marks a syllable whose `text` was detected as an elided
   * pair and auto-split into `segments`. The correction UI offers to
   * accept the split, merge it, or re-segment. Complements the aggregate
   * `ParseWarning[]`; this per-syllable marker lets the UI find the exact
   * token. Extensible to further per-syllable flags.
   */
  parseFlag?: 'elided';
}

/**
 * One verse's syllable on a single event: the minimal self-describing
 * record needed to reconstruct that verse's words independently of the
 * primary verse (Dann's Option B ruling, 2026-07-17, §A.95). Lives in
 * `SyllableInfo.versesInfo`. Deliberately minimal: `wordContext`, elision
 * `segments`, and `verseLabel` are follow-ons, added when a multi-verse
 * consumer needs them.
 */
export interface VerseSyllable {
  /** Canonical 1-indexed verse number this syllable belongs to. */
  verseNumber: number;

  /** Syllable text as printed in the source (same rules as `SyllableInfo.text`). */
  text: string;

  /**
   * MNX-style syllabic role for this verse's syllable on this note: the
   * word-boundary marker word reconstruction walks. Same vocabulary as
   * `SyllableInfo.type`.
   */
  type: 'whole' | 'start' | 'middle' | 'end';
}

/**
 * One segment of an elided syllable (Kimi's `SyllableSegment`, 2026-07-12,
 * in our naming): a composer's two-syllables-on-one-note case split into
 * its parts, each with its own syllabic role and, once Ilya has routed it,
 * its own vowel identity for the acoustic analysis.
 */
export interface SyllableSegment {
  /** The segment's printed text. */
  text: string;

  /** Syllabic role of this segment (same vocabulary as `SyllableInfo.type`). */
  type: 'whole' | 'start' | 'middle' | 'end';

  /**
   * IPA vowel for this segment, from Ilya via `languageHint`, post-routing.
   * Populated by the analysis layer, not the parser; absent at parse time.
   */
  vowelIdentity?: string;
}

// ── Accompaniment (deferred for v1; shape declared for forward compat) ──

/**
 * Accompaniment part. v1 parsers may leave `ParsedScore.accompaniment`
 * undefined; full accompaniment parsing is deferred to a later phase.
 * The shape is declared here so downstream types do not need to change
 * when accompaniment rendering lands.
 */
export interface AccompanimentLine {
  partId: string;
  partName: string;

  /** Number of staves. 1 for monophonic instruments, 2 for piano. */
  staffCount: number;

  /** Events for the part, with per-event staff assignment. */
  events: AccompanimentEvent[];
}

/**
 * A single event in an accompaniment part. Unlike `VocalLineEvent`,
 * supports chords (multiple simultaneous pitches at one rhythmic
 * position) because keyboard accompaniment is rarely monophonic.
 */
export interface AccompanimentEvent {
  id: string;
  type: 'note' | 'rest' | 'chord';
  staffNumber: number;
  measureIndex: number;
  rhythmicPosition: RhythmicPosition;
  duration: Duration;

  /**
   * Single pitch for `'note'`, multiple for `'chord'`, undefined for
   * `'rest'`.
   */
  pitches?: Pitch[];
  tied?: TieInfo;
}

// ── Parser interface ─────────────────────────────────────────────

export interface ScoreParser {
  /**
   * Cheap predicate: does this parser handle this input? Implementations
   * check `input.format` only, not contents.
   */
  canParse(input: ScoreInput): boolean;

  /**
   * Full parse. Async because some implementations may stream the source
   * or rely on async DOM parsing.
   */
  parse(input: ScoreInput): Promise<ParseResult>;
}

export type ScoreInput = MnxScoreInput | MusicXmlScoreInput;

export interface MnxScoreInput {
  format: 'mnx';

  /**
   * Parsed JSON object. The runner (denigma-runner or direct upload
   * handler) is responsible for the `JSON.parse` step before handing
   * the input to the parser.
   */
  data: object;

  /** Optional source path for warning and error location reporting. */
  sourcePath?: string;
}

export interface MusicXmlScoreInput {
  format: 'musicxml';

  /**
   * Either the raw XML string or a pre-parsed DOM Document. The parser
   * accepts both forms and parses the string lazily if needed.
   */
  data: string | Document;

  sourcePath?: string;
}

export interface ParseResult {
  /**
   * The parsed score. Always present, even when warnings or non-fatal
   * errors occurred. If any entry in `errors` has `fatal: true`, the
   * score is partial or unusable; check before using.
   */
  score: ParsedScore;

  /** Non-fatal observations. The score is fully usable. */
  warnings: ParseWarning[];

  /**
   * Errors. If any have `fatal: true`, the score is unusable. Non-fatal
   * errors describe recoverable problems where the parser dropped a
   * specific element but continued processing.
   */
  errors: ParseError[];
}

// ── Parse diagnostics ────────────────────────────────────────────

export interface ParseWarning {
  code: ParseWarningCode;
  message: string;
  location?: ParseLocation;
}

export interface ParseError {
  code: ParseErrorCode;
  message: string;
  location?: ParseLocation;

  /**
   * True if parsing did not complete and the resulting score is partial
   * or unusable. False for recoverable errors where the parser dropped
   * a single element but continued.
   */
  fatal: boolean;
}

export interface ParseLocation {
  measureIndex?: number;
  eventId?: string;
  partId?: string;
}

export type ParseWarningCode =
  | 'unrecognised-element'
  | 'multiple-vocal-parts'
  | 'no-lyrics-found'
  | 'verse-count-mismatch'
  | 'lineorder-missing'
  | 'tuplet-without-normal-type'
  | 'measure-duration-mismatch'
  | 'unsupported-articulation'
  | 'mnx-experimental-feature'
  | 'musicxml-pre-3-1-feature';

export type ParseErrorCode =
  | 'invalid-mnx-json'
  | 'invalid-musicxml'
  | 'no-vocal-part-identified'
  | 'no-measures'
  | 'incompatible-format-version';
