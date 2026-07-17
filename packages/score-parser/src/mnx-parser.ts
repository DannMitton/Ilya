/**
 * MNX score parser.
 *
 * Reads MNX (Music Notation eXchange) input and produces Shane's canonical
 * `ParsedScore`. Reads the stable lyric subset of MNX (stable since October
 * 2024 per the w3c-cg/mnx repo) and the core musical structure; unrecognised
 * experimental features are noted via warnings and skipped, never fatal
 * (architecture spec, Known risks §3: "target the stable subset and warn or
 * error gracefully on unrecognised structures").
 *
 * Conversion paths that feed this parser:
 *   - Direct upload of `.mnx` or `.json` (origin `'mnx-direct'`).
 *   - denigma CLI/WASM output from `.musx` Finale files (origin
 *     `'denigma-mnx-from-musx'`).
 *
 * Ground truth: this implementation was built against denigma's real MNX
 * v17 output for a vocal score (Kabalevsky Op. 52 No. 8 fixture, converted
 * 2026-07-12 via the repo's own denigma WASM artifact under Node). The
 * fixture demonstrates: `global.lyrics.lineOrder` + `lineMetadata` (two
 * lines, Cyrillic + IPA dual underlay), untyped event content items,
 * `{type:'space'}` spacers with bare `[numerator, denominator]` durations,
 * note-level `ties: [{target, targetType}]`, `markings.breath`, event-level
 * `slurs`/`stemDirection`/`staff` (engraving concerns, not parsed), and
 * note-level `accidentalDisplay` (display concern, not parsed). Structures
 * absent from the fixture (tuplets, grace groups) are implemented to the
 * MNX v17 schema and covered by the synthetic-fixture tests.
 *
 * @invariant The parser must keep `measures[i].timeSignature` and
 *   `measures[i].keySignature` consistent with the score-wide
 *   `timeSignatures[]` and `keySignatures[]` arrays. Any future write
 *   path (correction GUI edits, measure insertion, signature changes)
 *   must update both structures atomically. Per Round 9 review (Kimi),
 *   the parallel-data redundancy is accepted for query performance;
 *   the consistency burden is on the parser and any future mutator.
 *
 * @invariant `VocalLineEvent.id` uses a deterministic composite key
 *   of the form `m{measureIndex}-{numerator}-{denominator}` built from the
 *   event's normalised rhythmic position. Composite keys are reproducible
 *   across re-parses, which matters for testability, renderer regression
 *   tests, and inspecting `data-note-id` in dev tools. `SyllableInfo.id`
 *   uses UUID v4 (via `crypto.randomUUID()` where available, with a
 *   time-random fallback). UUID v4 is sufficient because syllables need
 *   only session-stability for the v1.x cross-tab jump, and correction-GUI
 *   mutations make deterministic syllable keys fragile.
 */

import type {
	Articulation,
	Clef,
	ClefChange,
	Duration,
	Fraction,
	KeySignature,
	KeySignatureChange,
	Measure,
	MnxScoreInput,
	NoteBase,
	ParseError,
	ParseResult,
	ParseWarning,
	ParsedScore,
	Pitch,
	ScoreInput,
	ScoreParser,
	SyllableInfo,
	SyllableSegment,
	TempoMarking,
	TimeSignature,
	TimeSignatureChange,
	TupletInfo,
	VocalLineEvent,
} from './types';

// ── Loose raw shapes for the incoming JSON ─────────────────────────
// These deliberately model only what the parser reads. Every access is
// still guarded at runtime; the shapes exist so the reading code is
// typed without a cast at each property.

interface MnxDocument {
	mnx?: { version?: unknown };
	global?: {
		measures?: MnxGlobalMeasure[];
		lyrics?: {
			lineOrder?: unknown;
			lineMetadata?: Record<string, { label?: unknown }>;
		};
	};
	parts?: MnxPart[];
}

interface MnxGlobalMeasure {
	id?: unknown;
	key?: { fifths?: unknown; mode?: unknown };
	time?: { count?: unknown; unit?: unknown };
	tempos?: Array<{ bpm?: unknown; value?: { base?: unknown; dots?: unknown } }>;
	// ── Control flow (W3C MNX global-measure objects) ──────────────────
	// Verified against the MNX reference (w3c-cg.github.io/mnx, 2026-07-17):
	// `repeatStart`/`repeatEnd` are objects (empty for a bare barline; the
	// backward repeat carries an optional `times`); `ending` declares a volta
	// on ONE measure with a bar-count `duration` and a `numbers` pass array;
	// `segno`/`fine` are marker objects with a `location`; `jump` carries a
	// `type` whose enum is exactly `'segno'` and `'dsalfine'` (no Da Capo, no
	// coda family: the MNX format ceiling, §A.78). Intra-measure `location`
	// is not read here, matching the MusicXML parser's measure-level capture.
	repeatStart?: unknown;
	repeatEnd?: { times?: unknown } | unknown;
	ending?: { numbers?: unknown; duration?: unknown; open?: unknown } | unknown;
	segno?: unknown;
	fine?: unknown;
	jump?: { type?: unknown; location?: unknown } | unknown;
}

/**
 * Synthetic segno token. MNX carries a single, tokenless segno (its jump-type
 * enum references "the" segno positionally, not by a matching string), so we
 * assign one shared token to the segno destination and the dal-segno origin;
 * the source-agnostic unfolder then matches them by the same string-equality
 * rule it applies to MusicXML's `<sound>` tokens. A second segno in one part
 * (malformed for MNX) then correctly trips the unfolder's `multiple-targets`.
 */
const MNX_SEGNO_TOKEN = 'mnx-segno';

interface MnxPart {
	id?: unknown;
	name?: unknown;
	measures?: Array<{
		clefs?: Array<{ clef?: MnxClef; staff?: unknown }>;
		sequences?: Array<{ content?: MnxContentItem[] }>;
	}>;
}

/**
 * Raw MNX clef, as observed in real denigma output (Sharp Excerpt,
 * verified 2026-07-13): `{glyph, sign, staffPosition}`, where
 * `staffPosition` counts staff steps from the MIDDLE line (G clef −2,
 * F clef +2). `octave` is read guardedly for octave-displaced clefs.
 */
interface MnxClef {
	sign?: unknown;
	staffPosition?: unknown;
	octave?: unknown;
}

interface MnxContentItem {
	type?: unknown;
	id?: unknown;
	duration?: unknown;
	rest?: unknown;
	notes?: MnxNote[];
	lyrics?: { lines?: Record<string, { text?: unknown; type?: unknown }> };
	markings?: Record<string, unknown>;
	// Tuplet-shaped items (MNX v17):
	inner?: { duration?: { base?: unknown; dots?: unknown }; multiple?: unknown };
	outer?: { duration?: { base?: unknown; dots?: unknown }; multiple?: unknown };
	content?: MnxContentItem[];
}

interface MnxNote {
	id?: unknown;
	pitch?: { step?: unknown; octave?: unknown; alter?: unknown };
	ties?: Array<{ target?: unknown }>;
}

// ── Exact rational arithmetic ──────────────────────────────────────
// Durations and positions are exact fractions of a whole note
// (types.ts `Fraction`); float arithmetic would drift on dotted values
// and tuplets, which is precisely where analysis needs exactness.

function gcd(a: number, b: number): number {
	let x = Math.abs(a);
	let y = Math.abs(b);
	while (y !== 0) {
		const t = y;
		y = x % y;
		x = t;
	}
	return x === 0 ? 1 : x;
}

function frac(numerator: number, denominator: number): Fraction {
	const g = gcd(numerator, denominator);
	const sign = denominator < 0 ? -1 : 1;
	return { numerator: (sign * numerator) / g, denominator: (sign * denominator) / g };
}

function addFrac(a: Fraction, b: Fraction): Fraction {
	return frac(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);
}

function mulFrac(a: Fraction, b: Fraction): Fraction {
	return frac(a.numerator * b.numerator, a.denominator * b.denominator);
}

function fracCompare(a: Fraction, b: Fraction): number {
	return a.numerator * b.denominator - b.numerator * a.denominator;
}

const ZERO: Fraction = { numerator: 0, denominator: 1 };
const ONE: Fraction = { numerator: 1, denominator: 1 };

/** Whole-note value of each note base (MusicXML/MNX shared vocabulary). */
const BASE_VALUES: Record<NoteBase, Fraction> = {
	breve: { numerator: 2, denominator: 1 },
	whole: { numerator: 1, denominator: 1 },
	half: { numerator: 1, denominator: 2 },
	quarter: { numerator: 1, denominator: 4 },
	eighth: { numerator: 1, denominator: 8 },
	'16th': { numerator: 1, denominator: 16 },
	'32nd': { numerator: 1, denominator: 32 },
	'64th': { numerator: 1, denominator: 64 },
	'128th': { numerator: 1, denominator: 128 },
};

function isNoteBase(x: unknown): x is NoteBase {
	return typeof x === 'string' && x in BASE_VALUES;
}

/**
 * Sounding length of a base + dots, in whole notes. Dots follow the
 * standard geometric sum: n dots multiply by (2^(n+1) - 1) / 2^n.
 */
function baseDotsFraction(base: NoteBase, dots: number): Fraction {
	const b = BASE_VALUES[base];
	const pow = 2 ** dots;
	return frac(b.numerator * (2 * pow - 1), b.denominator * pow);
}

// ── Markings → articulations ───────────────────────────────────────
// MNX marking keys mapped onto the canonical `Articulation` union.
// Keys outside this table produce one `'unsupported-articulation'`
// warning per distinct key and are otherwise preserved nowhere: the
// fixture's engraving-side keys (slurs, stemDirection) are handled
// separately and deliberately not parsed in v1.

const MARKING_TO_ARTICULATION: Record<string, Articulation> = {
	accent: 'accent',
	strongAccent: 'strong-accent',
	staccato: 'staccato',
	tenuto: 'tenuto',
	detachedLegato: 'detached-legato',
	staccatissimo: 'staccatissimo',
	breath: 'breath-mark',
	caesura: 'caesura',
	stress: 'stress',
	unstress: 'unstress',
};

const PITCH_STEPS = new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G']);

function syllableId(): string {
	try {
		if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
			return crypto.randomUUID();
		}
	} catch {
		// fall through to the fallback
	}
	return `syl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Internal note-side bookkeeping for the tie-resolution pass. */
interface TieBookkeeping {
	/** MNX note id → the VocalLineEvent id that carries the note. */
	noteIdToEventId: Map<string, string>;
	/** Tie starts: source event id → target MNX note id. */
	starts: Array<{ eventId: string; targetNoteId: string }>;
}

export class MnxScoreParser implements ScoreParser {
	canParse(input: ScoreInput): boolean {
		return input.format === 'mnx';
	}

	async parse(input: ScoreInput): Promise<ParseResult> {
		if (!this.canParse(input)) {
			throw new Error(`MnxScoreParser cannot parse input of format '${input.format}'`);
		}
		const mnxInput = input as MnxScoreInput;

		const warnings: ParseWarning[] = [];
		const errors: ParseError[] = [];
		const warnedMarkingKeys = new Set<string>();

		const fail = (code: ParseError['code'], message: string): ParseResult => {
			errors.push({ code, message, fatal: true });
			return { score: emptyScore(mnxInput), warnings, errors };
		};

		// 1. Structural validation. A missing or non-object document, or a
		//    missing `mnx` block, is unusable. A version we have not seen
		//    (denigma emits 17) parses with a warning rather than refusing:
		//    the stable lyric subset is the contract, not the version number.
		const doc = mnxInput.data as MnxDocument;
		if (doc === null || typeof doc !== 'object' || Array.isArray(doc)) {
			return fail('invalid-mnx-json', 'MNX input is not a JSON object.');
		}
		if (!doc.mnx || typeof doc.mnx !== 'object') {
			return fail('invalid-mnx-json', "MNX input has no top-level 'mnx' object.");
		}
		const version = doc.mnx.version;
		if (typeof version !== 'number' || !Number.isFinite(version) || version < 1) {
			return fail('incompatible-format-version', `MNX version is missing or invalid: ${String(version)}.`);
		}
		if (version > 17) {
			warnings.push({
				code: 'mnx-experimental-feature',
				message: `MNX version ${version} is newer than the tested version (17); parsing the stable subset.`,
			});
		}

		const globalMeasures = doc.global?.measures;
		if (!Array.isArray(globalMeasures) || globalMeasures.length === 0) {
			return fail('no-measures', 'MNX global.measures is missing or empty.');
		}

		const parts = doc.parts;
		if (!Array.isArray(parts) || parts.length === 0) {
			return fail('no-vocal-part-identified', 'MNX has no parts.');
		}

		// 2. Vocal-part identification: prefer the part whose events carry
		//    `lyrics.lines`. More than one candidate warns and takes the
		//    first (spec TODO order); none falls back to the first part
		//    with a `'no-lyrics-found'` warning.
		const lyricParts: number[] = [];
		for (let i = 0; i < parts.length; i++) {
			if (partHasLyrics(parts[i])) lyricParts.push(i);
		}
		let vocalPartIndex: number;
		if (lyricParts.length === 0) {
			vocalPartIndex = 0;
			warnings.push({
				code: 'no-lyrics-found',
				message: 'No part carries lyrics; using the first part as the vocal line.',
			});
		} else {
			vocalPartIndex = lyricParts[0];
			if (lyricParts.length > 1) {
				warnings.push({
					code: 'multiple-vocal-parts',
					message: `${lyricParts.length} parts carry lyrics; using the first (index ${vocalPartIndex}).`,
				});
			}
		}
		const vocalPart = parts[vocalPartIndex];
		const partId = typeof vocalPart.id === 'string' ? vocalPart.id : `P${vocalPartIndex + 1}`;
		const partName = typeof vocalPart.name === 'string' && vocalPart.name.length > 0 ? vocalPart.name : partId;

		// 3. Verse detection, two stages (Patterson corrections, 2026-05-15).
		//    STAGE 1: the maximum count of distinct lineIds on any single
		//    event decides whether this is a verse structure at all. A
		//    maximum of 1 is a single lyric line — every syllable is verse 1
		//    regardless of how many lineIds appear across the piece.
		//    STAGE 2: order the verse slots canonically. Primary path is
		//    `global.lyrics.lineOrder` (denigma always emits it, Patterson
		//    confirms); the fallback is document-order of first appearance,
		//    with a `'lineorder-missing'` warning. lineIds are arbitrary
		//    per the MNX spec — never parse numbers out of them (the
		//    Patterson sample's four verses were v2, v4, v6, v8).
		const seenLineIdsInOrder: string[] = [];
		let maxLinesPerEvent = 0;
		forEachEvent(vocalPart, (item) => {
			const lines = item.lyrics?.lines;
			if (!lines || typeof lines !== 'object') return;
			const ids = Object.keys(lines);
			if (ids.length > maxLinesPerEvent) maxLinesPerEvent = ids.length;
			for (const id of ids) {
				if (!seenLineIdsInOrder.includes(id)) seenLineIdsInOrder.push(id);
			}
		});

		const lineIdToVerse = new Map<string, number>();
		if (maxLinesPerEvent > 1) {
			const rawOrder = doc.global?.lyrics?.lineOrder;
			let order: string[];
			if (Array.isArray(rawOrder) && rawOrder.every((x) => typeof x === 'string')) {
				order = rawOrder as string[];
				// Any observed lineId missing from lineOrder is appended in
				// first-appearance order so its syllables are not dropped.
				for (const id of seenLineIdsInOrder) {
					if (!order.includes(id)) {
						order = [...order, id];
						warnings.push({
							code: 'verse-count-mismatch',
							message: `Lyric line '${id}' appears on events but not in global.lyrics.lineOrder; appended after the ordered lines.`,
						});
					}
				}
			} else {
				order = seenLineIdsInOrder;
				warnings.push({
					code: 'lineorder-missing',
					message: 'global.lyrics.lineOrder is absent; verse numbers use document order of first appearance.',
				});
			}
			order.forEach((id, i) => lineIdToVerse.set(id, i + 1));
		} else {
			for (const id of seenLineIdsInOrder) lineIdToVerse.set(id, 1);
		}

		const lineMetadata = doc.global?.lyrics?.lineMetadata;
		const verseLabelOf = (lineId: string): string | undefined => {
			const label = lineMetadata?.[lineId]?.label;
			return typeof label === 'string' && label.length > 0 ? label : undefined;
		};

		// 4. Measures: walk global.measures once, carrying running time and
		//    key state so each Measure snapshot stays consistent with the
		//    change arrays (the @invariant above).
		const measures: Measure[] = [];
		const timeSignatures: TimeSignatureChange[] = [];
		const keySignatures: KeySignatureChange[] = [];
		const tempoMarkings: TempoMarking[] = [];

		let currentTime: TimeSignature | null = null;
		let currentKey: KeySignature | null = null;

		// Volta declarations, resolved to per-measure pass membership after the
		// walk: MNX declares an ending on one measure with a bar-count span,
		// unlike MusicXML's start/stop barlines. Coda-family / dsalfine hygiene
		// trackers are used for a fail-loud consistency warning below.
		const endingDecls: Array<{ startIndex: number; span: number; passes: number[] }> = [];
		let sawDsAlFine = false;
		let sawFine = false;

		for (let mi = 0; mi < globalMeasures.length; mi++) {
			const gm = globalMeasures[mi] ?? {};

			const time = gm.time;
			if (time && typeof time === 'object' && typeof time.count === 'number' && typeof time.unit === 'number' && time.unit > 0) {
				currentTime = { beats: time.count, beatType: time.unit };
				timeSignatures.push({ measureIndex: mi, signature: currentTime });
			} else if (currentTime === null) {
				// No initial time signature anywhere before the first measure:
				// assume common time rather than refusing the score.
				currentTime = { beats: 4, beatType: 4 };
				timeSignatures.push({ measureIndex: mi, signature: currentTime });
				warnings.push({
					code: 'unrecognised-element',
					message: 'No initial time signature; assuming 4/4.',
					location: { measureIndex: mi },
				});
			}

			const key = gm.key;
			if (key && typeof key === 'object' && typeof key.fifths === 'number') {
				currentKey = { fifths: key.fifths };
				if (key.mode === 'major' || key.mode === 'minor') currentKey.mode = key.mode;
				keySignatures.push({ measureIndex: mi, signature: currentKey });
			} else if (currentKey === null) {
				currentKey = { fifths: 0 };
				keySignatures.push({ measureIndex: mi, signature: currentKey });
				warnings.push({
					code: 'unrecognised-element',
					message: 'No initial key signature; assuming no sharps or flats.',
					location: { measureIndex: mi },
				});
			}

			if (Array.isArray(gm.tempos)) {
				for (const t of gm.tempos) {
					const bpm = t?.bpm;
					const base = t?.value?.base;
					if (typeof bpm === 'number' && bpm > 0 && isNoteBase(base)) {
						const dots = typeof t.value?.dots === 'number' && t.value.dots > 0 ? Math.floor(t.value.dots) : 0;
						tempoMarkings.push({
							measureIndex: mi,
							rhythmicPosition: { fraction: ZERO },
							bpm,
							beatUnit: base,
							beatUnitDots: dots,
						});
					} else {
						warnings.push({
							code: 'unrecognised-element',
							message: 'Tempo entry missing a valid bpm or beat unit; skipped.',
							location: { measureIndex: mi },
						});
					}
				}
			}

			// Control flow. Repeats and the jump family are measure-local and
			// attached here; endings span a bar count and are resolved after the
			// walk. Read from the structural MNX objects only (§A.78's source-
			// agnostic seam; the MusicXML parser fills the same `Measure` markers).
			let mRepeatStart: true | undefined;
			let mRepeatEnd: true | undefined;
			let mRepeatTimes: number | undefined;
			if (gm.repeatStart !== undefined && gm.repeatStart !== null) mRepeatStart = true;
			const re = gm.repeatEnd;
			if (re !== undefined && re !== null) {
				mRepeatEnd = true;
				const t = (re as { times?: unknown }).times;
				if (typeof t === 'number' && Number.isFinite(t) && t >= 1) mRepeatTimes = Math.floor(t);
			}

			// Jump family. MNX expresses only the dal-segno variants: a `segno`
			// marker (destination), a `fine` marker, and a `jump` whose type is
			// `'segno'` (plain D.S.) or `'dsalfine'` (D.S. al Fine). Da Capo and
			// every coda jump are outside the MNX jump-type enum, and a dropped
			// coda leaves NO trace in the document, so no coda format-ceiling
			// flag is emitted from this parser (§A.79b): there is nothing to read.
			const mJump: NonNullable<Measure['jump']> = {};
			let mHasJumpNav = false;
			if (gm.segno !== undefined && gm.segno !== null) {
				mJump.segno = MNX_SEGNO_TOKEN;
				mHasJumpNav = true;
			}
			if (gm.fine !== undefined && gm.fine !== null) {
				mJump.fine = true;
				mHasJumpNav = true;
				sawFine = true;
			}
			const jmp = gm.jump;
			if (jmp !== undefined && jmp !== null && typeof jmp === 'object') {
				const jtype = (jmp as { type?: unknown }).type;
				if (jtype === 'segno' || jtype === 'dsalfine') {
					mJump.dalSegno = MNX_SEGNO_TOKEN;
					mHasJumpNav = true;
					if (jtype === 'dsalfine') sawDsAlFine = true;
				} else {
					warnings.push({
						code: 'mnx-experimental-feature',
						message: `Unrecognised jump type '${String(jtype)}'; MNX expresses only 'segno' and 'dsalfine', so this jump is ignored and performance order falls back to as-written.`,
						location: { measureIndex: mi },
					});
				}
			}

			// Ending (volta): declared on this measure, spanning `duration` bars
			// (W3C MNX ending-duration: an integer bar count ≥ 1). Collected now,
			// applied to each spanned measure after the walk.
			const end = gm.ending;
			if (end !== undefined && end !== null && typeof end === 'object') {
				const dur = (end as { duration?: unknown }).duration;
				const span = typeof dur === 'number' && Number.isFinite(dur) && dur >= 1 ? Math.floor(dur) : 1;
				if (typeof dur !== 'number' || !Number.isFinite(dur) || dur < 1) {
					warnings.push({
						code: 'unrecognised-element',
						message: `Ending at measure ${mi} has no readable bar-count duration; assuming a single-bar ending.`,
						location: { measureIndex: mi },
					});
				}
				const nums = (end as { numbers?: unknown }).numbers;
				let passes: number[];
				if (
					Array.isArray(nums) &&
					nums.length > 0 &&
					nums.every((x) => typeof x === 'number' && Number.isFinite(x) && x >= 1)
				) {
					passes = (nums as number[]).map((x) => Math.floor(x));
				} else {
					passes = [1];
					if (nums !== undefined) {
						warnings.push({
							code: 'unrecognised-element',
							message: `Ending at measure ${mi} has an unreadable 'numbers' value; defaulting to pass 1.`,
							location: { measureIndex: mi },
						});
					}
				}
				endingDecls.push({ startIndex: mi, span, passes });
			}

			// Display number: derived from the global measure id when it has
			// the denigma/MuseScore `m<number>` shape, else sequential.
			const idText = typeof gm.id === 'string' ? gm.id : '';
			const numberMatch = /^m(\d+)$/.exec(idText);
			measures.push({
				index: mi,
				number: numberMatch ? numberMatch[1] : String(mi + 1),
				timeSignature: currentTime,
				keySignature: currentKey,
				expectedDuration: frac(currentTime.beats, currentTime.beatType),
				...(mRepeatStart ? { repeatStart: true } : {}),
				...(mRepeatEnd ? { repeatEnd: true } : {}),
				...(mRepeatTimes !== undefined ? { repeatTimes: mRepeatTimes } : {}),
				...(mHasJumpNav ? { jump: mJump } : {}),
			});
		}

		// Resolve volta spans into per-measure pass membership. MNX gives one
		// declaration measure plus a bar count; the source-agnostic unfolder
		// consumes the same `ending` shape the MusicXML parser fills from its
		// start/stop barlines. `startsHere`/`endsHere` drive the bracket later.
		for (const decl of endingDecls) {
			const last = Math.min(decl.startIndex + decl.span - 1, measures.length - 1);
			for (let idx = decl.startIndex; idx <= last; idx++) {
				measures[idx].ending = {
					passes: decl.passes,
					...(idx === decl.startIndex ? { startsHere: true } : {}),
					...(idx === last ? { endsHere: true } : {}),
				};
			}
		}

		// Fail-loud hygiene: a `dsalfine` jump with no Fine marker anywhere is a
		// malformed source; the return would silently play to the end (plain D.S.).
		if (sawDsAlFine && !sawFine) {
			warnings.push({
				code: 'unrecognised-element',
				message: "A 'dsalfine' jump is present but no Fine marker was found; the da-capo return will play to the end of the piece.",
			});
		}

		// 5. The vocal line. One rhythmic cursor per measure; content items
		//    are sequential within a sequence (MNX has no explicit event
		//    positions). `space` items advance the cursor silently; tuplet
		//    groups scale their children; unknown item types warn and skip.
		const vocalLine: VocalLineEvent[] = [];
		const ties: TieBookkeeping = { noteIdToEventId: new Map(), starts: [] };

		const partMeasures = Array.isArray(vocalPart.measures) ? vocalPart.measures : [];
		if (partMeasures.length !== globalMeasures.length) {
			warnings.push({
				code: 'unrecognised-element',
				message: `Vocal part has ${partMeasures.length} measures against ${globalMeasures.length} global measures; parsing the overlap.`,
				location: { partId },
			});
		}
		const measureCount = Math.min(partMeasures.length, globalMeasures.length);

		// Clefs live on the PART measures in MNX (verified against real
		// denigma output, 2026-07-13), so they are captured in this walk,
		// not the global one. `staffPosition` counts staff steps from the
		// middle line; our `Clef.line` is 1-based from the bottom line.
		const clefs: ClefChange[] = [];
		let currentClef: Clef | null = null;

		for (let mi = 0; mi < measureCount; mi++) {
			const clefEntries = partMeasures[mi]?.clefs;
			if (Array.isArray(clefEntries)) {
				// The vocal staff's clef is the unnumbered one or staff 1.
				const entry = clefEntries.find((c) => c && typeof c === 'object' && (c.staff === undefined || c.staff === 1));
				const raw = entry?.clef;
				const sign = raw && typeof raw === 'object' ? raw.sign : undefined;
				if (sign === 'G' || sign === 'F' || sign === 'C') {
					const defaultLine = sign === 'G' ? 2 : sign === 'F' ? 4 : 3;
					const sp = raw!.staffPosition;
					const line =
						typeof sp === 'number' && Number.isInteger(sp) && sp % 2 === 0 && sp >= -4 && sp <= 4
							? 3 + sp / 2
							: defaultLine;
					currentClef = { sign, line };
					const oct = raw!.octave;
					if (typeof oct === 'number' && Number.isInteger(oct) && oct !== 0) currentClef.octaveChange = oct;
					clefs.push({ measureIndex: mi, clef: currentClef });
				} else if (sign !== undefined) {
					warnings.push({
						code: 'unrecognised-element',
						message: `Unsupported clef sign "${String(sign)}"; clef ignored.`,
						location: { measureIndex: mi, partId },
					});
				}
			}
			if (currentClef) measures[mi].clef = currentClef;

			const sequences = partMeasures[mi]?.sequences ?? [];
			if (sequences.length > 1) {
				warnings.push({
					code: 'unrecognised-element',
					message: `Vocal part measure ${mi} has ${sequences.length} sequences; using the first (monophonic vocal line expected).`,
					location: { measureIndex: mi, partId },
				});
			}
			const content = sequences[0]?.content ?? [];
			let cursor: Fraction = ZERO;

			cursor = this.walkContent(content, mi, cursor, ONE, undefined, {
				vocalLine,
				ties,
				warnings,
				errors,
				warnedMarkingKeys,
				lineIdToVerse,
				verseLabelOf,
			});

			// Duration accounting: a measure whose content does not fill its
			// time signature is either the anacrusis (measure 0, flagged as
			// pickup below) or a source inconsistency worth a warning.
			const expected = measures[mi].expectedDuration;
			const cmp = fracCompare(cursor, expected);
			if (cmp !== 0 && cursor.numerator > 0) {
				if (mi === 0 && cmp < 0) {
					measures[0].isPickup = true;
				} else {
					warnings.push({
						code: 'measure-duration-mismatch',
						message: `Measure ${mi} content lasts ${cursor.numerator}/${cursor.denominator} whole notes against an expected ${expected.numerator}/${expected.denominator}.`,
						location: { measureIndex: mi, partId },
					});
				}
			}
		}

		// 6. Tie resolution: MNX marks the start side only, via note-level
		//    `ties: [{target}]`. The target note's event becomes the stop
		//    (or a continue, when it starts a further tie of its own).
		const startsByEvent = new Map<string, string>();
		for (const s of ties.starts) startsByEvent.set(s.eventId, s.targetNoteId);
		for (const s of ties.starts) {
			const sourceEvent = vocalLine.find((e) => e.id === s.eventId);
			const targetEventId = ties.noteIdToEventId.get(s.targetNoteId);
			if (!sourceEvent || !targetEventId) {
				warnings.push({
					code: 'unrecognised-element',
					message: `Tie target '${s.targetNoteId}' does not resolve to a vocal-line note; tie dropped.`,
					location: { eventId: s.eventId },
				});
				continue;
			}
			sourceEvent.tied = sourceEvent.tied ?? { type: 'start', partnerEventId: targetEventId };
			const targetEvent = vocalLine.find((e) => e.id === targetEventId);
			if (targetEvent) {
				targetEvent.tied = startsByEvent.has(targetEventId)
					? { type: 'continue', partnerEventId: sourceEvent.id }
					: { type: 'stop', partnerEventId: sourceEvent.id };
			}
		}

		// 7. wordContext: per verse, contiguous start/middle/end syllables
		//    concatenate into the word each of them belongs to; whole
		//    syllables are their own word. Melisma notes carry no syllable
		//    and therefore never interrupt a word (spec: melismas are
		//    encoded by absence).
		assignWordContexts(vocalLine, warnings);

		// 8. Provenance. The origin rule follows the spec TODO: a sourcePath
		//    that names a `.musx` file marks the denigma path; everything
		//    else is direct MNX. languageHint: Cyrillic anywhere in verse 1
		//    marks Russian; Shane v1 ships only the Russian engine, so no
		//    other hint is emitted.
		const fromMusx = typeof mnxInput.sourcePath === 'string' && mnxInput.sourcePath.toLowerCase().endsWith('.musx');
		const cyrillic = vocalLine.some(
			(e) => e.syllable && e.syllable.verseNumber === 1 && /[Ѐ-ӿ]/.test(e.syllable.text),
		);

		// No workMetadata: the MNX format defines no work-title or creator
		// fields anywhere in its document model (spec root and global
		// objects checked 2026-07-13; real denigma output confirms). The
		// §A.6 merge treats MNX scores as carrying no header metadata.
		const score: ParsedScore = {
			source: {
				format: 'mnx',
				fidelity: fromMusx ? 'high' : 'native',
				origin: fromMusx ? 'denigma-mnx-from-musx' : 'mnx-direct',
				...(cyrillic ? { languageHint: 'rus' } : {}),
				sourceWarnings: warnings.map((w) => w.message),
			},
			vocalPart: { partId, partName },
			measures,
			keySignatures,
			clefs,
			timeSignatures,
			tempoMarkings,
			vocalLine,
		};

		if (vocalLine.length > 0 && !vocalLine.some((e) => e.syllable) && lyricParts.length > 0) {
			// Defensive: a lyric part whose syllables all failed to parse.
			warnings.push({ code: 'no-lyrics-found', message: 'The vocal part produced no syllables.' });
		}

		return { score, warnings, errors };
	}

	/**
	 * Walk one content array (a sequence, or a tuplet's children), emitting
	 * vocal-line events and returning the advanced cursor. `scale` carries
	 * the tuplet time-compression ratio (ONE outside tuplets).
	 */
	private walkContent(
		content: MnxContentItem[],
		measureIndex: number,
		cursor: Fraction,
		scale: Fraction,
		tuplet: TupletInfo | undefined,
		ctx: {
			vocalLine: VocalLineEvent[];
			ties: TieBookkeeping;
			warnings: ParseWarning[];
			errors: ParseError[];
			warnedMarkingKeys: Set<string>;
			lineIdToVerse: Map<string, number>;
			verseLabelOf: (lineId: string) => string | undefined;
		},
	): Fraction {
		for (const item of content) {
			if (!item || typeof item !== 'object') continue;
			const kind = item.type;

			// `space`: an invisible spacer that advances rhythmic position.
			// denigma emits these with a bare [numerator, denominator]
			// duration (observed in the Kabalevsky fixture's piano part).
			if (kind === 'space') {
				const d = item.duration;
				if (Array.isArray(d) && d.length === 2 && typeof d[0] === 'number' && typeof d[1] === 'number' && d[1] > 0) {
					cursor = addFrac(cursor, mulFrac(frac(d[0], d[1]), scale));
				} else {
					ctx.warnings.push({
						code: 'unrecognised-element',
						message: 'space item without a readable duration; position may drift.',
						location: { measureIndex },
					});
				}
				continue;
			}

			// Tuplet group: scale children by outer/inner and recurse.
			if (kind === 'tuplet') {
				const innerMultiple = item.inner?.multiple;
				const outerMultiple = item.outer?.multiple;
				const innerBase = item.inner?.duration?.base;
				const outerBase = item.outer?.duration?.base;
				const children = Array.isArray(item.content) ? item.content : [];
				if (
					typeof innerMultiple === 'number' &&
					typeof outerMultiple === 'number' &&
					innerMultiple > 0 &&
					outerMultiple > 0 &&
					isNoteBase(innerBase) &&
					isNoteBase(outerBase)
				) {
					const innerDots = typeof item.inner?.duration?.dots === 'number' ? item.inner.duration.dots : 0;
					const outerDots = typeof item.outer?.duration?.dots === 'number' ? item.outer.duration.dots : 0;
					const innerTotal = mulFrac(frac(innerMultiple, 1), baseDotsFraction(innerBase, innerDots));
					const outerTotal = mulFrac(frac(outerMultiple, 1), baseDotsFraction(outerBase, outerDots));
					const ratio = frac(outerTotal.numerator * innerTotal.denominator, outerTotal.denominator * innerTotal.numerator);
					const info: TupletInfo = {
						actualNotes: innerMultiple,
						normalNotes: outerMultiple,
						normalType: outerBase,
					};
					cursor = this.walkContent(children, measureIndex, cursor, mulFrac(scale, ratio), info, ctx);
				} else {
					ctx.warnings.push({
						code: 'tuplet-without-normal-type',
						message: 'Tuplet without a readable inner/outer ratio; children parsed in normal time.',
						location: { measureIndex },
					});
					cursor = this.walkContent(children, measureIndex, cursor, scale, undefined, ctx);
				}
				continue;
			}

			// Grace groups have no rhythmic duration of their own; v1 skips
			// them (vocal analysis attends to sustained events).
			if (kind === 'grace') {
				ctx.warnings.push({
					code: 'unrecognised-element',
					message: 'grace group skipped (no rhythmic duration).',
					location: { measureIndex },
				});
				continue;
			}

			if (kind !== undefined && kind !== 'event') {
				ctx.warnings.push({
					code: 'mnx-experimental-feature',
					message: `Unrecognised content item type '${String(kind)}' skipped.`,
					location: { measureIndex },
				});
				continue;
			}

			// A plain event: a note or a rest.
			const durationRaw = item.duration;
			const base = durationRaw && typeof durationRaw === 'object' && !Array.isArray(durationRaw)
				? (durationRaw as { base?: unknown; dots?: unknown }).base
				: undefined;
			if (!isNoteBase(base)) {
				ctx.errors.push({
					code: 'invalid-mnx-json',
					message: `Event without a readable duration base ('${String(base)}'); event dropped.`,
					location: { measureIndex },
					fatal: false,
				});
				continue;
			}
			const dotsRaw = (durationRaw as { dots?: unknown }).dots;
			const dots = typeof dotsRaw === 'number' && dotsRaw > 0 ? Math.min(3, Math.floor(dotsRaw)) : 0;
			const soundingFraction = mulFrac(baseDotsFraction(base, dots), scale);
			const duration: Duration = {
				base,
				dots,
				...(tuplet ? { tuplet } : {}),
				fraction: soundingFraction,
			};

			const position = frac(cursor.numerator, cursor.denominator);
			const eventId = `m${measureIndex}-${position.numerator}-${position.denominator}`;

			const isRest = item.rest !== undefined;
			const notes = Array.isArray(item.notes) ? item.notes : [];
			let pitch: Pitch | undefined;

			if (!isRest) {
				if (notes.length === 0) {
					ctx.errors.push({
						code: 'invalid-mnx-json',
						message: 'Event carries neither notes nor a rest; event dropped.',
						location: { measureIndex, eventId },
						fatal: false,
					});
					cursor = addFrac(cursor, soundingFraction);
					continue;
				}
				if (notes.length > 1) {
					ctx.warnings.push({
						code: 'unrecognised-element',
						message: `Chord of ${notes.length} notes in the vocal line; using the first note.`,
						location: { measureIndex, eventId },
					});
				}
				const n = notes[0];
				const step = n.pitch?.step;
				const octave = n.pitch?.octave;
				if (typeof step !== 'string' || !PITCH_STEPS.has(step) || typeof octave !== 'number') {
					ctx.errors.push({
						code: 'invalid-mnx-json',
						message: 'Note without a readable pitch; event dropped.',
						location: { measureIndex, eventId },
						fatal: false,
					});
					cursor = addFrac(cursor, soundingFraction);
					continue;
				}
				const alterRaw = n.pitch?.alter;
				pitch = {
					step: step as Pitch['step'],
					octave,
					alter: typeof alterRaw === 'number' ? alterRaw : 0,
				};

				// Tie bookkeeping (resolution happens after the walk).
				if (typeof n.id === 'string') ctx.ties.noteIdToEventId.set(n.id, eventId);
				if (Array.isArray(n.ties)) {
					for (const t of n.ties) {
						if (t && typeof t.target === 'string') {
							ctx.ties.starts.push({ eventId, targetNoteId: t.target });
						}
					}
				}
			}

			// Lyrics: one syllable per verse line on this event. Verse 1 is
			// what the analysis layer walks in v1 (Round 9 §3.8); the
			// canonical VocalLineEvent carries the verse-1 syllable, and
			// additional verses attach to no event field in types.ts — they
			// are preserved through this same walk when the correction and
			// multi-verse work lands. For now, non-verse-1 syllables are
			// intentionally not dropped silently: the verse structure is
			// recorded through verseNumber on the syllables Shane keeps.
			// The primary syllable is the lowest-verse text (verse 1 for
			// v1 analysis); all verse texts are collected into `verses`
			// (Kimi's multi-verse ruling, 2026-07-12). MNX's stable subset
			// carries no explicit elision markup, so an elided pair arrives
			// as one combined token; `splitElision` detects it heuristically
			// (an undertie or internal whitespace) and fills `segments` +
			// `parseFlag` for the correction UI.
			let syllable: SyllableInfo | undefined;
			const lines = item.lyrics?.lines;
			if (!isRest && lines && typeof lines === 'object') {
				const verseTexts = new Map<number, string>();
				let primary: SyllableInfo | undefined;
				for (const [lineId, line] of Object.entries(lines)) {
					const text = line?.text;
					if (typeof text !== 'string' || text.length === 0) continue;
					const verseNumber = ctx.lineIdToVerse.get(lineId) ?? 1;
					verseTexts.set(verseNumber, text);
					if (primary && verseNumber >= primary.verseNumber) continue;
					const typeRaw = line?.type;
					const type: SyllableInfo['type'] =
						typeRaw === 'start' || typeRaw === 'middle' || typeRaw === 'end' || typeRaw === 'whole'
							? typeRaw
							: 'whole';
					const segments = splitElision(text);
					primary = {
						id: syllableId(),
						text,
						type,
						verseNumber,
						...(ctx.verseLabelOf(lineId) ? { verseLabel: ctx.verseLabelOf(lineId) } : {}),
						wordContext: text, // provisional; the wordContext pass rewrites it
						...(segments ? { segments, parseFlag: 'elided' as const } : {}),
					};
				}
				if (primary) {
					if (verseTexts.size > 1) {
						primary.verses = [...verseTexts.entries()].sort((a, b) => a[0] - b[0]).map(([, t]) => t);
					}
					syllable = primary;
				}
			}

			// Markings → articulations (+ fermata presence).
			let articulations: Articulation[] | undefined;
			let hasFermata = false;
			if (!isRest && item.markings && typeof item.markings === 'object') {
				for (const key of Object.keys(item.markings)) {
					if (key === 'fermata') {
						hasFermata = true;
						continue;
					}
					const mapped = MARKING_TO_ARTICULATION[key];
					if (mapped) {
						(articulations ??= []).push(mapped);
					} else if (!ctx.warnedMarkingKeys.has(key)) {
						ctx.warnedMarkingKeys.add(key);
						ctx.warnings.push({
							code: 'unsupported-articulation',
							message: `Marking '${key}' is not in the v1 articulation set; ignored.`,
							location: { measureIndex, eventId },
						});
					}
				}
			}

			ctx.vocalLine.push({
				id: eventId,
				type: isRest ? 'rest' : 'note',
				measureIndex,
				rhythmicPosition: { fraction: position },
				duration,
				...(pitch ? { pitch } : {}),
				...(syllable ? { syllable } : {}),
				...(hasFermata ? { fermata: {} } : {}),
				...(articulations ? { articulations } : {}),
			});

			cursor = addFrac(cursor, soundingFraction);
		}
		return cursor;
	}
}

/** True when any event in any measure of the part carries lyric lines. */
function partHasLyrics(part: MnxPart): boolean {
	let found = false;
	forEachEvent(part, (item) => {
		const lines = item.lyrics?.lines;
		if (lines && typeof lines === 'object' && Object.keys(lines).length > 0) found = true;
	});
	return found;
}

/** Visit every content item in a part, recursing into tuplet groups. */
function forEachEvent(part: MnxPart, visit: (item: MnxContentItem) => void): void {
	const walk = (items: MnxContentItem[] | undefined): void => {
		if (!Array.isArray(items)) return;
		for (const item of items) {
			if (!item || typeof item !== 'object') continue;
			visit(item);
			if (Array.isArray(item.content)) walk(item.content);
		}
	};
	for (const m of part.measures ?? []) {
		for (const seq of m?.sequences ?? []) {
			walk(seq?.content);
		}
	}
}

/**
 * The wordContext pass: for each verse, buffer contiguous start/middle
 * syllables until the word's end syllable arrives, then assign the
 * concatenation to every syllable in the word. `whole` syllables are
 * their own word. A `start` arriving while a word is open flushes the
 * open word first (malformed source; the flush keeps every syllable
 * carrying the best available context rather than dropping any).
 */
function assignWordContexts(vocalLine: VocalLineEvent[], warnings: ParseWarning[]): void {
	const open = new Map<number, SyllableInfo[]>();

	const flush = (verse: number, malformed: boolean): void => {
		const buffer = open.get(verse);
		if (!buffer || buffer.length === 0) return;
		const word = buffer.map((s) => s.text).join('');
		for (const s of buffer) s.wordContext = word;
		open.delete(verse);
		if (malformed) {
			warnings.push({
				code: 'unrecognised-element',
				message: `A lyric word in verse ${verse} was interrupted before its end syllable; context assigned from the partial word.`,
			});
		}
	};

	for (const event of vocalLine) {
		const s = event.syllable;
		if (!s) continue;
		switch (s.type) {
			case 'whole':
				flush(s.verseNumber, true);
				s.wordContext = s.text;
				break;
			case 'start':
				flush(s.verseNumber, true);
				open.set(s.verseNumber, [s]);
				break;
			case 'middle':
			case 'end': {
				const buffer = open.get(s.verseNumber);
				if (buffer) {
					buffer.push(s);
				} else {
					open.set(s.verseNumber, [s]);
				}
				if (s.type === 'end') flush(s.verseNumber, false);
				break;
			}
		}
	}
	for (const verse of [...open.keys()]) flush(verse, true);
}

/**
 * Conservative heuristic elision split for a combined lyric token (Kimi's
 * parser contract + guardrail, 2026-07-12). MNX's stable subset carries no
 * elision markup, so a composer's two-syllables-on-one-note arrives as one
 * token; this splits it ONLY on unambiguous signals — the Unicode undertie
 * (U+203F) or a hard internal space (U+0020) — and deliberately NOT on a
 * soft hyphen (U+00AD), a hyphen, or a lyric extender. When the signal is
 * absent, it does not split and the caller does not set `parseFlag`,
 * because a false split silently corrupts the lyric-to-note alignment,
 * whereas a missed elision is caught by the singer in the correction UI.
 * Each part is typed `'whole'`, since the combined token carries no
 * per-part syllabic role.
 */
function splitElision(text: string): SyllableSegment[] | undefined {
	const parts = text.split(/[‿ ]+/).filter((p) => p.length > 0);
	if (parts.length <= 1) return undefined;
	return parts.map((p) => ({ text: p, type: 'whole' as const }));
}

/** A minimal, honest empty score for the fatal-error path. */
function emptyScore(input: MnxScoreInput): ParsedScore {
	const fromMusx = typeof input.sourcePath === 'string' && input.sourcePath.toLowerCase().endsWith('.musx');
	return {
		source: {
			format: 'mnx',
			fidelity: fromMusx ? 'high' : 'native',
			origin: fromMusx ? 'denigma-mnx-from-musx' : 'mnx-direct',
			sourceWarnings: [],
		},
		vocalPart: { partId: '', partName: '' },
		measures: [],
		keySignatures: [],
		clefs: [],
		timeSignatures: [],
		tempoMarkings: [],
		vocalLine: [],
	};
}
