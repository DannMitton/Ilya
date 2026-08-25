/**
 * MusicXML score parser.
 *
 * Reads MusicXML input (an XML string or a pre-parsed DOM Document) and
 * produces Shane's canonical `ParsedScore`. Supports the partwise MusicXML
 * 3.1 / 4.0 subset Shane needs: the vocal part's notes, rests, ties,
 * lyrics (with verse and elision awareness), articulations, fermatas, the
 * divisions-based duration model, key/time/tempo, and provenance. Features
 * outside that subset are noted via warnings and skipped, never fatal.
 *
 * Conversion paths that feed this parser:
 *   - Direct upload of `.xml` / `.mxl` (origin `'musicxml-direct'`; the
 *     runner unzips `.mxl` before handoff).
 *   - MuseScore export from `.mscz` (origin `'musescore-cli-musicxml-from-mscz'`).
 *   - PDFtoMusic Pro from a vector PDF (origin `'pdftomusic-pro-musicxml-from-vector-pdf'`).
 *   - homr OMR from a raster PDF/image (origin `'homr-musicxml-from-image'`).
 *   - MIDI converter output (origin `'midi-converted-musicxml'`); no lyrics.
 *
 * @invariant Mirrors the MnxScoreParser invariants exactly:
 *   `measures[i].timeSignature` / `keySignature` stay consistent with the
 *   score-wide change arrays; `VocalLineEvent.id` is the deterministic
 *   `m{measureIndex}-{numerator}-{denominator}` composite key, EXCEPT where the
 *   file supplies its own `<note id>` (N.97b, `resolveSuppliedIds`), which the
 *   page reader does and no other source Ilya reads does;
 *   `SyllableInfo.id` is a UUID.
 *
 * @invariant No two events share an id, under any input. A supplied id is
 *   honoured only when every supplied id in the vocal part is unique and none
 *   of them is shaped like a generated one; otherwise the whole line falls back
 *   to generated ids and a `duplicate-note-ids` warning says so.
 *
 * DOM access: the parser reads through a minimal structural `XmlEl`
 * interface (a subset every W3C DOM Element and the test mini-DOM both
 * satisfy), so the package needs no `lib.dom` surface beyond the `Document`
 * type at the input boundary and no XML-library dependency. In the browser
 * a string is parsed with the global `DOMParser`; in Node tests a Document
 * (real or mini) is passed directly.
 *
 * Shared helpers (fraction arithmetic, note-base values, wordContext, the
 * markings map, syllable ids) are duplicated from the MNX parser rather
 * than extracted, to keep this an additive change that does not re-open the
 * already-pushed `mnx-parser.ts`. A future shared `internal.ts` refactor is
 * flagged for the whole-app audit.
 *
 * Ground truth: built against faithful synthetic MusicXML 3.1/4.0 partwise
 * fixtures (see `musicxml-parser.test.ts`); no real copyrighted MusicXML is
 * required, since the format's structure is public and stable.
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
	MusicXmlScoreInput,
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
	TempoWord,
	MetricModulation,
	TimeSignature,
	TimeSignatureChange,
	TupletInfo,
	VocalLineEvent,
	WorkMetadata,
} from './types';

// ── Minimal DOM surface the parser reads ───────────────────────────

interface XmlEl {
	readonly tagName: string;
	getAttribute(name: string): string | null;
	getElementsByTagName(name: string): ArrayLike<XmlEl>;
	readonly children: ArrayLike<XmlEl>;
	readonly textContent: string | null;
}

function kids(el: XmlEl): XmlEl[] {
	return Array.from(el.children);
}
function directChildren(el: XmlEl, tag: string): XmlEl[] {
	return kids(el).filter((c) => c.tagName === tag);
}

/** Parse an <ending number> attribute ("1" or "1,2") into a pass-set; defaults to [1]. */
function parseEndingNumbers(attr: string | null): number[] {
	const out = (attr ?? '')
		.split(',')
		.map((x) => parseInt(x.trim(), 10))
		.filter((x) => Number.isFinite(x) && x > 0);
	return out.length > 0 ? out : [1];
}
function firstChild(el: XmlEl, tag: string): XmlEl | undefined {
	return kids(el).find((c) => c.tagName === tag);
}
function descendants(el: XmlEl, tag: string): XmlEl[] {
	return Array.from(el.getElementsByTagName(tag));
}
function firstDesc(el: XmlEl, tag: string): XmlEl | undefined {
	return descendants(el, tag)[0];
}
function textOf(el: XmlEl | undefined): string {
	return (el?.textContent ?? '').trim();
}
function childText(el: XmlEl, tag: string): string {
	return textOf(firstChild(el, tag));
}
function intAttr(el: XmlEl, name: string): number | undefined {
	const v = el.getAttribute(name);
	if (v === null) return undefined;
	const n = parseInt(v, 10);
	return Number.isFinite(n) ? n : undefined;
}

// ── Jump-family navigation (§A.78: control flow from <sound> only) ──────────────

/** Accumulator for a measure's `<sound>`-derived jump navigation. */
type JumpAcc = NonNullable<Measure['jump']>;

/**
 * Read jump navigation attributes from one `<sound>` element into the accumulator.
 * Returns true if any navigation attribute was present. `<sound>` also carries tempo,
 * dynamics, and other playback data read elsewhere; only the control-flow attributes
 * are our concern here.
 */
function readSoundNav(soundEl: XmlEl, acc: JumpAcc): boolean {
	let found = false;
	const segno = soundEl.getAttribute('segno');
	if (segno) {
		acc.segno = segno;
		found = true;
	}
	const coda = soundEl.getAttribute('coda');
	if (coda) {
		acc.coda = coda;
		found = true;
	}
	if (soundEl.getAttribute('dacapo') === 'yes') {
		acc.daCapo = true;
		found = true;
	}
	const dalsegno = soundEl.getAttribute('dalsegno');
	if (dalsegno) {
		acc.dalSegno = dalsegno;
		found = true;
	}
	const tocoda = soundEl.getAttribute('tocoda');
	if (tocoda) {
		acc.toCoda = tocoda;
		found = true;
	}
	const fine = soundEl.getAttribute('fine');
	if (fine) {
		acc.fine = true;
		found = true;
	}
	if (found && soundEl.getAttribute('time-only') !== null) acc.timeOnly = true;
	return found;
}

/** Printed navigation words ("D.C.", "D.S. al Fine", "To Coda", "Fine", "Coda", …). */
const NAV_WORDS_RE = /\b(d\s*\.?\s*[cs]\s*\.?|da\s+capo|dal\s+segno|to\s+coda|al\s+coda|al\s+fine|fine|coda)\b/i;

/**
 * True when a `<direction>` prints a jump mark: a `<segno>` or `<coda>` glyph, or
 * `<words>` naming a jump. Used only to detect a printed jump with no `<sound>` to
 * make it playable, which the unfolder flags rather than guessing (§A.78).
 */
function directionHasPrintedJumpMark(direction: XmlEl): boolean {
	for (const dt of directChildren(direction, 'direction-type')) {
		if (directChildren(dt, 'segno').length > 0) return true;
		if (directChildren(dt, 'coda').length > 0) return true;
		for (const w of directChildren(dt, 'words')) {
			if (NAV_WORDS_RE.test(textOf(w))) return true;
		}
	}
	return false;
}

// ── Exact rational arithmetic (mirrors mnx-parser.ts) ──────────────

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
	if (denominator === 0) return { numerator: 0, denominator: 1 };
	const g = gcd(numerator, denominator);
	const sign = denominator < 0 ? -1 : 1;
	return { numerator: (sign * numerator) / g, denominator: (sign * denominator) / g };
}
function addFrac(a: Fraction, b: Fraction): Fraction {
	return frac(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);
}
function subFrac(a: Fraction, b: Fraction): Fraction {
	return frac(a.numerator * b.denominator - b.numerator * a.denominator, a.denominator * b.denominator);
}
function fracCompare(a: Fraction, b: Fraction): number {
	return a.numerator * b.denominator - b.numerator * a.denominator;
}
const ZERO: Fraction = { numerator: 0, denominator: 1 };

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
/** Nearest note base for a sounding fraction, when `<type>` is absent. */
function baseFromFraction(f: Fraction): NoteBase {
	let best: NoteBase = 'quarter';
	let bestDiff = Infinity;
	for (const b of Object.keys(BASE_VALUES) as NoteBase[]) {
		const bf = BASE_VALUES[b];
		const diff = Math.abs(bf.numerator / bf.denominator - f.numerator / f.denominator);
		if (diff < bestDiff) {
			bestDiff = diff;
			best = b;
		}
	}
	return best;
}

// ── Articulations (MusicXML uses the same hyphenated names) ─────────

const MARKING_TO_ARTICULATION: Record<string, Articulation> = {
	accent: 'accent',
	'strong-accent': 'strong-accent',
	staccato: 'staccato',
	tenuto: 'tenuto',
	'detached-legato': 'detached-legato',
	staccatissimo: 'staccatissimo',
	'breath-mark': 'breath-mark',
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
		// fall through
	}
	return `syl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function pitchKey(p: Pitch): string {
	return `${p.step}${p.alter}/${p.octave}`;
}

export class MusicXmlScoreParser implements ScoreParser {
	canParse(input: ScoreInput): boolean {
		return input.format === 'musicxml';
	}

	async parse(input: ScoreInput): Promise<ParseResult> {
		if (!this.canParse(input)) {
			throw new Error(`MusicXmlScoreParser cannot parse input of format '${input.format}'`);
		}
		const xmlInput = input as MusicXmlScoreInput;

		const warnings: ParseWarning[] = [];
		const errors: ParseError[] = [];
		const warnedMarkingKeys = new Set<string>();

		const fail = (code: ParseError['code'], message: string): ParseResult => {
			errors.push({ code, message, fatal: true });
			return { score: emptyScore(xmlInput), warnings, errors };
		};

		// 1. Resolve the document root to an XmlEl.
		let doc: XmlEl;
		try {
			doc = resolveDocument(xmlInput.data);
		} catch (e) {
			return fail('invalid-musicxml', e instanceof Error ? e.message : 'Could not read MusicXML input.');
		}
		if (descendants(doc, 'parsererror').length > 0) {
			return fail('invalid-musicxml', 'MusicXML is not well-formed (parser error).');
		}
		const scorePartwise = firstDesc(doc, 'score-partwise') ?? (doc.tagName === 'score-partwise' ? doc : undefined);
		if (!scorePartwise) {
			if (firstDesc(doc, 'score-timewise')) {
				return fail('invalid-musicxml', 'Timewise MusicXML is not supported; convert to partwise first.');
			}
			return fail('invalid-musicxml', 'No <score-partwise> root found.');
		}

		// MusicXML version (attribute on the root). Newer than tested → warn, parse on.
		const version = scorePartwise.getAttribute('version');
		if (version && /^(\d+)/.test(version) && parseInt(version, 10) < 3) {
			warnings.push({
				code: 'musicxml-pre-3-1-feature',
				message: `MusicXML version ${version} predates 3.1; parsing the stable subset.`,
			});
		}

		const parts = descendants(scorePartwise, 'part');
		if (parts.length === 0) {
			return fail('no-vocal-part-identified', 'MusicXML has no <part> elements.');
		}

		// 2. Vocal-part identification: the first part whose notes carry lyrics.
		const lyricParts: number[] = [];
		for (let i = 0; i < parts.length; i++) {
			if (descendants(parts[i], 'lyric').length > 0) lyricParts.push(i);
		}
		let vocalIndex: number;
		if (lyricParts.length === 0) {
			vocalIndex = 0;
			warnings.push({ code: 'no-lyrics-found', message: 'No part carries lyrics; using the first part as the vocal line.' });
		} else {
			vocalIndex = lyricParts[0];
			if (lyricParts.length > 1) {
				warnings.push({
					code: 'multiple-vocal-parts',
					message: `${lyricParts.length} parts carry lyrics; using the first (index ${vocalIndex}).`,
				});
			}
		}
		const vocalPart = parts[vocalIndex];
		const partId = vocalPart.getAttribute('id') ?? `P${vocalIndex + 1}`;
		const partName = resolvePartName(scorePartwise, partId) ?? partId;

		// 3. Verse detection over the vocal part (mirrors the MNX two-stage
		//    logic): the maximum count of distinct verse numbers on any one
		//    note decides whether this is a verse structure at all.
		const seenVersesInOrder: number[] = [];
		let maxVersesPerNote = 0;
		for (const note of descendants(vocalPart, 'note')) {
			const lyrics = directChildren(note, 'lyric');
			if (lyrics.length > maxVersesPerNote) maxVersesPerNote = lyrics.length;
			for (const ly of lyrics) {
				const n = intAttr(ly, 'number') ?? 1;
				if (!seenVersesInOrder.includes(n)) seenVersesInOrder.push(n);
			}
		}
		// Canonical verse numbering: MusicXML's `number` attribute is already
		// 1..N by convention, so we use it directly, remapping to 1-based
		// appearance order only if the numbers are non-sequential.
		const orderedVerses = [...seenVersesInOrder].sort((a, b) => a - b);
		const verseToCanonical = new Map<number, number>();
		orderedVerses.forEach((v, i) => verseToCanonical.set(v, i + 1));

		// 3b. Supplied event ids (N.97b). Decided once, for the whole line,
		//     BEFORE any event is built, so an id can never be honoured on one
		//     event and refused on its twin.
		const supplied = resolveSuppliedIds(vocalPart);
		if (supplied.refusal) {
			warnings.push({
				code: 'duplicate-note-ids',
				message: supplied.refusal,
				location: { partId },
			});
		}

		// 4. Walk the vocal part's measures.
		const measureEls = directChildren(vocalPart, 'measure');
		if (measureEls.length === 0) {
			return fail('no-measures', 'Vocal part has no <measure> elements.');
		}

		const measures: Measure[] = [];
		const timeSignatures: TimeSignatureChange[] = [];
		const keySignatures: KeySignatureChange[] = [];
		const clefs: ClefChange[] = [];
		const tempoMarkings: TempoMarking[] = [];
		const tempoWords: TempoWord[] = [];
		const metricModulations: MetricModulation[] = [];
		const vocalLine: VocalLineEvent[] = [];
		const tieFlags = new Map<string, { start: boolean; stop: boolean }>();

		let divisions = readInitialDivisions(vocalPart) ?? readInitialDivisions(parts[0]);
		if (!divisions || divisions <= 0) {
			divisions = 1;
			warnings.push({ code: 'unrecognised-element', message: 'No <divisions> found; assuming 1 division per quarter note.' });
		}
		let currentTime: TimeSignature | null = null;
		let currentKey: KeySignature | null = null;
		let currentClef: Clef | null = null;
		// Cross-measure ending (volta) state: an ending opened by a start barline
		// stays open, stamping each measure with its pass-set, until a stop closes it.
		let openEnding: { passes: number[] } | null = null;

		for (let mi = 0; mi < measureEls.length; mi++) {
			const measureEl = measureEls[mi];
			let cursor: Fraction = ZERO;
			// Barline markings accumulated across this measure's (possibly two) barlines.
			let mRepeatStart = false;
			let mRepeatEnd = false;
			let mRepeatTimes: number | undefined;
			let mRepeatAfterJump = false;
			let mEndingStartsHere = false;
			let mEndingEndsHere = false;
			// Jump-family navigation accumulated from this measure's <sound> elements.
			const mJump: JumpAcc = {};
			let mHasSoundNav = false;
			let mHasPrintedJumpMark = false;

			for (const child of kids(measureEl)) {
				switch (child.tagName) {
					case 'attributes': {
						const divText = childText(child, 'divisions');
						if (divText) {
							const d = parseInt(divText, 10);
							if (Number.isFinite(d) && d > 0) divisions = d;
						}
						const keyEl = firstChild(child, 'key');
						if (keyEl) {
							const fifths = parseInt(childText(keyEl, 'fifths') || '0', 10);
							const mode = childText(keyEl, 'mode');
							currentKey = { fifths: Number.isFinite(fifths) ? fifths : 0 };
							if (mode === 'major' || mode === 'minor') currentKey.mode = mode;
							keySignatures.push({ measureIndex: mi, signature: currentKey });
						}
						const timeEl = firstChild(child, 'time');
						if (timeEl) {
							const beats = parseInt(childText(timeEl, 'beats') || '0', 10);
							const beatType = parseInt(childText(timeEl, 'beat-type') || '0', 10);
							if (beats > 0 && beatType > 0) {
								currentTime = { beats, beatType };
								const symbol = timeEl.getAttribute('symbol');
								if (symbol === 'common' || symbol === 'cut') currentTime.symbol = symbol;
								timeSignatures.push({ measureIndex: mi, signature: currentTime });
							}
						}
						// Clef: the vocal staff's is the unnumbered one or staff 1
						// (a multi-staff part numbers its clefs; the vocal line
						// lives on staff 1 by MusicXML convention).
						const clefEls = directChildren(child, 'clef')
							.filter((c) => {
								const n = c.getAttribute('number');
								return n === null || n === '1';
							});
						const clefEl = clefEls[0];
						if (clefEl) {
							const sign = childText(clefEl, 'sign');
							if (sign === 'G' || sign === 'F' || sign === 'C') {
								const lineText = childText(clefEl, 'line');
								const lineNum = lineText ? parseInt(lineText, 10) : NaN;
								const defaultLine = sign === 'G' ? 2 : sign === 'F' ? 4 : 3;
								currentClef = {
									sign,
									line: Number.isFinite(lineNum) && lineNum >= 1 && lineNum <= 5 ? lineNum : defaultLine,
								};
								const octText = childText(clefEl, 'clef-octave-change');
								const oct = octText ? parseInt(octText, 10) : 0;
								if (Number.isFinite(oct) && oct !== 0) currentClef.octaveChange = oct;
								clefs.push({ measureIndex: mi, clef: currentClef });
							} else if (sign) {
								warnings.push({
									code: 'unrecognised-element',
									message: `Unsupported clef sign "${sign}"; clef ignored.`,
									location: { measureIndex: mi, partId },
								});
							}
						}
						break;
					}
					case 'direction': {
						const t = readTempo(child, mi, cursor);
						if (t) tempoMarkings.push(t);
						// A printed tempo WORD, kept whether or not a number accompanies it.
						// Five of six corpus scores state a word and no metronome, so
						// dropping these is what left the tempo unresolvable (§E.20).
						const mod = readMetricModulation(child, mi, cursor);
						if (mod) metricModulations.push(mod);
						const dirWords = readDirectionWords(child);
						if (dirWords) tempoWords.push({ measureIndex: mi, rhythmicPosition: { fraction: cursor }, text: dirWords });
						// Control flow from <sound> only; the printed marks are display.
						for (const s of directChildren(child, 'sound')) {
							if (readSoundNav(s, mJump)) mHasSoundNav = true;
						}
						if (directionHasPrintedJumpMark(child)) mHasPrintedJumpMark = true;
						break;
					}
					case 'sound': {
						// A bare <sound> in the measure body (not inside a <direction>).
						if (readSoundNav(child, mJump)) mHasSoundNav = true;
						break;
					}
					case 'backup': {
						const d = parseInt(childText(child, 'duration') || '0', 10);
						if (Number.isFinite(d) && d > 0) {
							cursor = subFrac(cursor, frac(d, divisions * 4));
							if (fracCompare(cursor, ZERO) < 0) cursor = ZERO;
						}
						break;
					}
					case 'forward': {
						const d = parseInt(childText(child, 'duration') || '0', 10);
						if (Number.isFinite(d) && d > 0) cursor = addFrac(cursor, frac(d, divisions * 4));
						break;
					}
					case 'note': {
						cursor = this.readNote(child, mi, cursor, divisions, {
							vocalLine,
							tieFlags,
							warnings,
							errors,
							warnedMarkingKeys,
							verseToCanonical,
							honourSuppliedIds: supplied.honour,
						});
						break;
					}
					case 'barline': {
						for (const rep of directChildren(child, 'repeat')) {
							const dir = rep.getAttribute('direction');
							if (dir === 'forward') mRepeatStart = true;
							else if (dir === 'backward') {
								mRepeatEnd = true;
								const ts = rep.getAttribute('times');
								if (ts) {
									const nt = parseInt(ts, 10);
									if (Number.isFinite(nt) && nt > 0) mRepeatTimes = nt;
								}
								if (rep.getAttribute('after-jump') === 'yes') mRepeatAfterJump = true;
							}
						}
						for (const endEl of directChildren(child, 'ending')) {
							const endType = endEl.getAttribute('type');
							if (endType === 'start') {
								openEnding = { passes: parseEndingNumbers(endEl.getAttribute('number')) };
								mEndingStartsHere = true;
							} else if (endType === 'stop' || endType === 'discontinue') {
								mEndingEndsHere = true;
							}
						}
						break;
					}
					default:
						break;
				}
			}

			// Signature defaults for the first measure if none seen yet.
			if (currentTime === null) {
				currentTime = { beats: 4, beatType: 4 };
				timeSignatures.push({ measureIndex: mi, signature: currentTime });
				warnings.push({ code: 'unrecognised-element', message: 'No initial time signature; assuming 4/4.', location: { measureIndex: mi } });
			}
			if (currentKey === null) {
				currentKey = { fifths: 0 };
				keySignatures.push({ measureIndex: mi, signature: currentKey });
				warnings.push({ code: 'unrecognised-element', message: 'No initial key signature; assuming no sharps or flats.', location: { measureIndex: mi } });
			}

			const numberAttr = measureEl.getAttribute('number');
			const expected = frac(currentTime.beats, currentTime.beatType);
			// Ending (volta) membership for this measure, resolved from the open ending.
			let measureEnding: Measure['ending'] | undefined;
			if (openEnding) {
				measureEnding = {
					passes: openEnding.passes,
					...(mEndingStartsHere ? { startsHere: true } : {}),
					...(mEndingEndsHere ? { endsHere: true } : {}),
				};
			}
			if (mEndingEndsHere) openEnding = null;
			// Jump navigation: <sound> attributes win; a printed mark with no <sound>
			// is recorded as unplayable so the unfolder flags rather than guesses (§A.78).
			let measureJump: Measure['jump'] | undefined;
			if (mHasSoundNav) measureJump = { ...mJump };
			else if (mHasPrintedJumpMark) measureJump = { markWithoutSound: true };
			const measure: Measure = {
				index: mi,
				number: numberAttr && numberAttr.length > 0 ? numberAttr : String(mi + 1),
				timeSignature: currentTime,
				keySignature: currentKey,
				...(currentClef ? { clef: currentClef } : {}),
				expectedDuration: expected,
				...(mRepeatStart ? { repeatStart: true } : {}),
				...(mRepeatEnd ? { repeatEnd: true } : {}),
				...(mRepeatTimes !== undefined ? { repeatTimes: mRepeatTimes } : {}),
				...(mRepeatAfterJump ? { repeatAfterJump: true } : {}),
				...(measureEnding ? { ending: measureEnding } : {}),
				...(measureJump ? { jump: measureJump } : {}),
			};
			// Pickup / mismatch accounting.
			const cmp = fracCompare(cursor, expected);
			if (cmp !== 0 && cursor.numerator > 0) {
				if (mi === 0 && cmp < 0) {
					measure.isPickup = true;
				} else {
					warnings.push({
						code: 'measure-duration-mismatch',
						message: `Measure ${mi} content lasts ${cursor.numerator}/${cursor.denominator} whole notes against an expected ${expected.numerator}/${expected.denominator}.`,
						location: { measureIndex: mi, partId },
					});
				}
			}
			measures.push(measure);
		}

		// 5. Tie resolution: types first, then best-effort partner linkage by
		//    same-pitch adjacency (MusicXML ties are not id-targeted).
		const byId = new Map(vocalLine.map((e) => [e.id, e]));
		for (const ev of vocalLine) {
			const f = tieFlags.get(ev.id);
			if (!f || (!f.start && !f.stop)) continue;
			ev.tied = { type: f.start && f.stop ? 'continue' : f.start ? 'start' : 'stop' };
		}
		const openByPitch = new Map<string, string>();
		for (const ev of vocalLine) {
			if (ev.type !== 'note' || !ev.pitch) continue;
			const f = tieFlags.get(ev.id);
			if (!f) continue;
			const key = pitchKey(ev.pitch);
			if (f.stop) {
				const openId = openByPitch.get(key);
				if (openId) {
					const openEv = byId.get(openId);
					if (openEv && openEv.tied) openEv.tied.partnerEventId = ev.id;
					if (ev.tied) ev.tied.partnerEventId = openId;
					openByPitch.delete(key);
				}
			}
			if (f.start) openByPitch.set(key, ev.id);
		}

		// 6. wordContext per verse (mirrors the MNX pass).
		assignWordContexts(vocalLine, warnings);

		// 7. Provenance and work metadata (§A.6/§A.16).
		const software = readSoftware(scorePartwise);
		const { origin, fidelity } = resolveOrigin(xmlInput.sourcePath, software);
		const workMetadata = readWorkMetadata(scorePartwise);
		const cyrillic = vocalLine.some((e) => e.syllable && e.syllable.verseNumber === 1 && /[Ѐ-ӿ]/.test(e.syllable.text));

		const score: ParsedScore = {
			source: {
				format: 'musicxml',
				fidelity,
				origin,
				...(cyrillic ? { languageHint: 'rus' } : {}),
				sourceWarnings: warnings.map((w) => w.message),
			},
			vocalPart: { partId, partName },
			...(workMetadata ? { workMetadata } : {}),
			measures,
			keySignatures,
			clefs,
			timeSignatures,
			tempoMarkings,
			tempoWords,
			metricModulations,
			vocalLine,
		};

		return { score, warnings, errors };
	}

	/** Read one `<note>` into the vocal line; return the advanced cursor. */
	private readNote(
		note: XmlEl,
		measureIndex: number,
		cursor: Fraction,
		divisions: number,
		ctx: {
			vocalLine: VocalLineEvent[];
			tieFlags: Map<string, { start: boolean; stop: boolean }>;
			warnings: ParseWarning[];
			errors: ParseError[];
			warnedMarkingKeys: Set<string>;
			verseToCanonical: Map<number, number>;
			/** N.97b: honour a `<note id>` where one is present (see `resolveSuppliedIds`). */
			honourSuppliedIds: boolean;
		},
	): Fraction {
		// Grace notes carry no rhythmic duration; skip (v1 attends to sustained events).
		if (firstChild(note, 'grace')) {
			ctx.warnings.push({ code: 'unrecognised-element', message: 'grace note skipped (no rhythmic duration).', location: { measureIndex } });
			return cursor;
		}
		// A chord tone shares the previous note's position; keep the first,
		// warn, do not advance.
		const isChord = !!firstChild(note, 'chord');
		if (isChord) {
			ctx.warnings.push({ code: 'unrecognised-element', message: 'Chord tone in the vocal line ignored (monophonic line expected).', location: { measureIndex } });
			return cursor;
		}

		const durText = childText(note, 'duration');
		const durDivs = parseInt(durText || '', 10);
		if (!Number.isFinite(durDivs) || durDivs <= 0) {
			ctx.errors.push({ code: 'invalid-musicxml', message: 'Note without a readable <duration>; event dropped.', location: { measureIndex }, fatal: false });
			return cursor;
		}
		const soundingFraction = frac(durDivs, divisions * 4);
		const position = frac(cursor.numerator, cursor.denominator);
		// N.97b: a supplied `<note id>` wins; the cursor id is the fallback, and
		// is what every source that carries no ids has always produced.
		const cursorId = `m${measureIndex}-${position.numerator}-${position.denominator}`;
		const suppliedId = ctx.honourSuppliedIds ? note.getAttribute('id') : null;
		const eventId = suppliedId !== null && suppliedId.length > 0 ? suppliedId : cursorId;

		const isRest = !!firstChild(note, 'rest');

		// Duration display fields from <type>/<dot>/<time-modification>;
		// the sounding length is the divisions-derived fraction (source of truth).
		const typeText = childText(note, 'type');
		const base: NoteBase = isNoteBase(typeText) ? typeText : baseFromFraction(soundingFraction);
		if (typeText && !isNoteBase(typeText)) {
			ctx.warnings.push({ code: 'unrecognised-element', message: `Unsupported note <type> '${typeText}'; inferred '${base}'.`, location: { measureIndex, eventId } });
		}
		const dots = directChildren(note, 'dot').length;
		let tuplet: TupletInfo | undefined;
		const tm = firstChild(note, 'time-modification');
		if (tm) {
			const actual = parseInt(childText(tm, 'actual-notes') || '', 10);
			const normal = parseInt(childText(tm, 'normal-notes') || '', 10);
			const normalType = childText(tm, 'normal-type');
			if (Number.isFinite(actual) && Number.isFinite(normal) && actual > 0 && normal > 0) {
				tuplet = { actualNotes: actual, normalNotes: normal, normalType: isNoteBase(normalType) ? normalType : base };
			}
		}
		const duration: Duration = { base, dots, ...(tuplet ? { tuplet } : {}), fraction: soundingFraction };

		let pitch: Pitch | undefined;
		if (!isRest) {
			const pitchEl = firstChild(note, 'pitch');
			const step = pitchEl ? childText(pitchEl, 'step') : '';
			const octaveText = pitchEl ? childText(pitchEl, 'octave') : '';
			const octave = parseInt(octaveText, 10);
			if (!pitchEl || !PITCH_STEPS.has(step) || !Number.isFinite(octave)) {
				ctx.errors.push({ code: 'invalid-musicxml', message: 'Note without a readable <pitch>; event dropped.', location: { measureIndex, eventId }, fatal: false });
				return addFrac(cursor, soundingFraction);
			}
			const alterText = childText(pitchEl!, 'alter');
			const alter = alterText ? parseInt(alterText, 10) : 0;
			pitch = { step: step as Pitch['step'], octave, alter: Number.isFinite(alter) ? alter : 0 };

			// Ties (the sounding <tie>, not the notational <tied>).
			let tieStart = false;
			let tieStop = false;
			for (const tie of directChildren(note, 'tie')) {
				const t = tie.getAttribute('type');
				if (t === 'start') tieStart = true;
				else if (t === 'stop') tieStop = true;
			}
			if (tieStart || tieStop) ctx.tieFlags.set(eventId, { start: tieStart, stop: tieStop });
		}

		// Notations: fermata + articulations.
		let fermata = false;
		let articulations: Articulation[] | undefined;
		const notations = firstChild(note, 'notations');
		if (notations && !isRest) {
			if (firstChild(notations, 'fermata')) fermata = true;
			const artBlock = firstChild(notations, 'articulations');
			if (artBlock) {
				for (const art of kids(artBlock)) {
					const mapped = MARKING_TO_ARTICULATION[art.tagName];
					if (mapped) {
						(articulations ??= []).push(mapped);
					} else if (!ctx.warnedMarkingKeys.has(art.tagName)) {
						ctx.warnedMarkingKeys.add(art.tagName);
						ctx.warnings.push({ code: 'unsupported-articulation', message: `Articulation '${art.tagName}' is not in the v1 set; ignored.`, location: { measureIndex, eventId } });
					}
				}
			}
		}

		// Lyrics: MusicXML carries elision explicitly (a `<lyric>` may hold
		// several `<syllabic>`/`<text>` pairs joined by `<elision>`), so we
		// split into real `segments` with per-part syllabic roles and flag
		// the token `'elided'` (Kimi's ruling, 2026-07-12). The primary
		// syllable is the lowest-canonical verse; all verse texts collect
		// into `verses`.
		let syllable: SyllableInfo | undefined;
		if (!isRest) {
			const verseData = new Map<number, { text: string; type: SyllableInfo['type'] }>();
			let primary: SyllableInfo | undefined;
			for (const ly of directChildren(note, 'lyric')) {
				const segs = readLyricSegments(ly);
				if (segs.length === 0) continue;
				const elided = segs.length > 1;
				const text = elided ? segs.map((s) => s.text).join('‿') : segs[0].text; // U+203F undertie
				const rawVerse = intAttr(ly, 'number') ?? 1;
				const verseNumber = ctx.verseToCanonical.get(rawVerse) ?? rawVerse;
				verseData.set(verseNumber, { text, type: segs[0].type });
				if (elided) {
					ctx.warnings.push({
						code: 'unrecognised-element',
						message: `Elided syllables split on one note ('${text}'); the correction UI can merge or re-segment.`,
						location: { measureIndex, eventId },
					});
				}
				if (primary && verseNumber >= primary.verseNumber) continue;
				primary = {
					id: syllableId(),
					text,
					type: segs[0].type,
					verseNumber,
					wordContext: text,
					...(elided ? { segments: segs, parseFlag: 'elided' as const } : {}),
				};
			}
			if (primary) {
				if (verseData.size > 1) {
					const sorted = [...verseData.entries()].sort((a, b) => a[0] - b[0]);
					primary.versesInfo = sorted.map(([verseNumber, d]) => ({ verseNumber, text: d.text, type: d.type }));
					primary.verses = sorted.map(([, d]) => d.text);
				}
				syllable = primary;
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
			...(fermata ? { fermata: {} } : {}),
			...(articulations ? { articulations } : {}),
		});

		return addFrac(cursor, soundingFraction);
	}
}

// ── Module helpers ─────────────────────────────────────────────────

function resolveDocument(data: string | Document): XmlEl {
	if (typeof data === 'string') {
		const g = globalThis as { DOMParser?: new () => { parseFromString(s: string, t: string): unknown } };
		if (!g.DOMParser) {
			throw new Error('String MusicXML needs a DOM parser; pass a pre-parsed Document in this environment.');
		}
		return new g.DOMParser().parseFromString(data, 'application/xml') as unknown as XmlEl;
	}
	return data as unknown as XmlEl;
}

/**
 * Read a `<lyric>` into ordered elision segments. MusicXML nests the
 * pieces as `<syllabic>`/`<text>` pairs (a bare `<text>` defaults to
 * `whole`), separated by `<elision>` boundaries; a single pair is the
 * common non-elided case.
 */
function readLyricSegments(ly: XmlEl): SyllableSegment[] {
	const out: SyllableSegment[] = [];
	let curType: SyllableSegment['type'] = 'whole';
	for (const c of kids(ly)) {
		if (c.tagName === 'syllabic') {
			const s = textOf(c);
			curType = s === 'begin' ? 'start' : s === 'middle' ? 'middle' : s === 'end' ? 'end' : 'whole';
		} else if (c.tagName === 'text') {
			const t = textOf(c);
			if (t.length > 0) out.push({ text: t, type: curType });
		}
		// <elision> elements are boundaries; nothing to record.
	}
	return out;
}

function readInitialDivisions(part: XmlEl): number | undefined {
	const el = firstDesc(part, 'divisions');
	if (!el) return undefined;
	const n = parseInt(textOf(el), 10);
	return Number.isFinite(n) && n > 0 ? n : undefined;
}

/** The shape of a cursor-built event id, `m{measureIndex}-{num}-{den}`. */
const CURSOR_ID_SHAPE = /^m\d+-\d+-\d+$/;

/**
 * Decide, once and for the whole vocal line, whether `<note id>` attributes are
 * honoured (N.97b, ruled by Dann 2026-08-24).
 *
 * WHY THE DECISION IS MADE HERE, AHEAD OF THE WALK. `VocalLineEvent.id` is what
 * a stored correction and a stored `PairingMap` entry are keyed by, so two
 * events sharing an id is not a cosmetic fault: one singer's correction lands
 * on somebody else's note, silently. A per-note decision cannot see a duplicate
 * that arrives later in the score, so the whole line is decided before the
 * first event is built, and one bad id costs the file its ids rather than
 * costing one event its identity.
 *
 * TWO REFUSALS, and both are needed:
 *
 * - A DUPLICATE. Two `<note>` elements carrying one id. The page reader's own
 *   ids are unique by construction (`run_page2.py` adds an ordinal suffix on a
 *   shared x, measured over 25 corpus pages: 1,118 ids, 47 suffixed, 0
 *   duplicates), but a foreign file writes whatever it likes.
 * - AN ID IN THE FALLBACK'S OWN NAMESPACE. A supplied id shaped exactly like
 *   `m{measureIndex}-{num}-{den}` could collide with the cursor id generated
 *   for a NEIGHBOURING note that carries no id of its own, which no check over
 *   the supplied ids alone would ever see. Refusing that shape closes the mixed
 *   case completely: honoured ids and generated ids then live in disjoint
 *   namespaces.
 *
 * Grace notes and chord tones are skipped, because `readNote` skips them: they
 * never become events, so their ids are not on the vocal line and cannot
 * collide with anything.
 *
 * A file with no `id` attributes at all returns `{ honour: true }` and every
 * event falls back, note by note, to the cursor id. That is the path every
 * existing fixture, and every non-reader source, takes.
 */
function resolveSuppliedIds(vocalPart: XmlEl): { honour: boolean; refusal?: string } {
	const seen = new Set<string>();
	for (const note of descendants(vocalPart, 'note')) {
		if (firstChild(note, 'grace') || firstChild(note, 'chord')) continue;
		const id = note.getAttribute('id');
		if (id === null || id.length === 0) continue;
		if (seen.has(id)) {
			return {
				honour: false,
				refusal: `Two notes carry the id "${id}"; every supplied <note id> is ignored and event ids come from the parser instead.`,
			};
		}
		if (CURSOR_ID_SHAPE.test(id)) {
			return {
				honour: false,
				refusal: `The supplied <note id> "${id}" has the shape this parser generates for notes without one, which could collide; every supplied <note id> is ignored and event ids come from the parser instead.`,
			};
		}
		seen.add(id);
	}
	return { honour: true };
}

function resolvePartName(scorePartwise: XmlEl, partId: string): string | undefined {
	for (const sp of descendants(scorePartwise, 'score-part')) {
		if (sp.getAttribute('id') === partId) {
			const name = childText(sp, 'part-name');
			return name.length > 0 ? name : undefined;
		}
	}
	return undefined;
}

function readTempo(direction: XmlEl, measureIndex: number, cursor: Fraction): TempoMarking | undefined {
	const metronome = firstDesc(direction, 'metronome');
	const soundEl = firstDesc(direction, 'sound');
	let bpm: number | undefined;
	let beatUnit: NoteBase = 'quarter';
	let beatUnitDots = 0;
	if (metronome) {
		const unit = childText(metronome, 'beat-unit');
		if (isNoteBase(unit)) beatUnit = unit;
		beatUnitDots = directChildren(metronome, 'beat-unit-dot').length;
		const per = parseInt(childText(metronome, 'per-minute') || '', 10);
		if (Number.isFinite(per) && per > 0) bpm = per;
	}
	if (bpm === undefined && soundEl) {
		const t = parseFloat(soundEl.getAttribute('tempo') || '');
		if (Number.isFinite(t) && t > 0) bpm = Math.round(t);
	}
	if (bpm === undefined) return undefined;
	const printed = readDirectionWords(direction);
	return {
		measureIndex,
		rhythmicPosition: { fraction: cursor },
		bpm,
		beatUnit,
		beatUnitDots,
		...(printed ? { text: printed } : {}),
	};
}

/**
 * The printed text of a `<direction>`, joining every `<words>` it contains.
 * Returns undefined when the direction prints no words (a bare metronome, a
 * dynamic glyph, a wedge).
 */
function readDirectionWords(direction: XmlEl): string | undefined {
	const parts: string[] = [];
	for (const dt of directChildren(direction, 'direction-type')) {
		for (const w of directChildren(dt, 'words')) {
			const s = textOf(w).trim();
			if (s) parts.push(s);
		}
	}
	const joined = parts.join(' ').replace(/\s+/g, ' ').trim();
	return joined.length > 0 ? joined : undefined;
}

/**
 * A metric modulation from a `<metronome>` with two `<beat-unit>` children and no
 * `<per-minute>`. Returns undefined for an ordinary numbered mark, which
 * `readTempo` handles, and for anything malformed.
 */
function readMetricModulation(
	direction: XmlEl,
	measureIndex: number,
	cursor: Fraction,
): MetricModulation | undefined {
	const metronome = firstDesc(direction, 'metronome');
	if (!metronome) return undefined;
	// A numbered mark is not a modulation.
	if (childText(metronome, 'per-minute')) return undefined;

	// Children in document order: beat-unit [beat-unit-dot...] beat-unit [beat-unit-dot...]
	const beats: Array<{ base: NoteBase; dots: number }> = [];
	const kids = metronome.children;
	for (let i = 0; i < kids.length; i++) {
		const child = kids[i];
		if (child.tagName === 'beat-unit') {
			const v = textOf(child).trim();
			if (!isNoteBase(v)) return undefined;
			beats.push({ base: v, dots: 0 });
		} else if (child.tagName === 'beat-unit-dot' && beats.length > 0) {
			beats[beats.length - 1].dots += 1;
		}
	}
	if (beats.length < 2) return undefined;
	return { measureIndex, rhythmicPosition: { fraction: cursor }, from: beats[0], to: beats[1] };
}

function readSoftware(scorePartwise: XmlEl): string {
	// <identification><encoding><software> may repeat; concatenate.
	return descendants(scorePartwise, 'software').map(textOf).join(' ').toLowerCase();
}

/**
 * Work metadata from the header (§A.6/§A.16): `<work-title>` (falling
 * back to `<movement-title>`), `<work-number>` as the opus slot, and
 * typed `<creator>` elements. Multiple creators of one type join with
 * a comma. Returns undefined when the header carries nothing.
 */
function readWorkMetadata(scorePartwise: XmlEl): WorkMetadata | undefined {
	const clean = (s: string | null | undefined): string | undefined => {
		const t = s?.trim();
		return t && t.length > 0 ? t : undefined;
	};
	const work = firstChild(scorePartwise, 'work');
	const title = clean(work ? childText(work, 'work-title') : undefined) ?? clean(childText(scorePartwise, 'movement-title'));
	const opus = clean(work ? childText(work, 'work-number') : undefined);

	const byType = new Map<string, string[]>();
	for (const c of descendants(scorePartwise, 'creator')) {
		const type = (c.getAttribute('type') ?? '').toLowerCase();
		const text = clean(textOf(c));
		if (!text) continue;
		const list = byType.get(type) ?? [];
		list.push(text);
		byType.set(type, list);
	}
	const joined = (...types: string[]): string | undefined => {
		const all = types.flatMap((t) => byType.get(t) ?? []);
		return all.length > 0 ? all.join(', ') : undefined;
	};

	const meta: WorkMetadata = {};
	if (title) meta.title = title;
	if (opus) meta.opus = opus;
	const composer = joined('composer');
	if (composer) meta.composer = composer;
	const poet = joined('lyricist', 'poet');
	if (poet) meta.poet = poet;
	const translator = joined('translator');
	if (translator) meta.translator = translator;
	const arranger = joined('arranger');
	if (arranger) meta.arranger = arranger;
	return Object.keys(meta).length > 0 ? meta : undefined;
}

function resolveOrigin(
	sourcePath: string | undefined,
	software: string,
): { origin: ParsedScore['source']['origin']; fidelity: ParsedScore['source']['fidelity'] } {
	if (software.includes('homr')) return { origin: 'homr-musicxml-from-image', fidelity: 'medium' };
	if (software.includes('pdftomusic')) return { origin: 'pdftomusic-pro-musicxml-from-vector-pdf', fidelity: 'high' };
	if (software.includes('musescore')) return { origin: 'musescore-cli-musicxml-from-mscz', fidelity: 'high' };
	void sourcePath;
	return { origin: 'musicxml-direct', fidelity: 'native' };
}

/**
 * The wordContext pass (identical logic to the MNX parser): per verse,
 * contiguous start/middle syllables buffer until the word's end syllable,
 * then the concatenation is assigned to every syllable in the word. `whole`
 * syllables are their own word.
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
				if (buffer) buffer.push(s);
				else open.set(s.verseNumber, [s]);
				if (s.type === 'end') flush(s.verseNumber, false);
				break;
			}
		}
	}
	for (const verse of [...open.keys()]) flush(verse, true);
}

function emptyScore(input: MusicXmlScoreInput): ParsedScore {
	const { origin, fidelity } = resolveOrigin(input.sourcePath, '');
	return {
		source: { format: 'musicxml', fidelity, origin, sourceWarnings: [] },
		vocalPart: { partId: '', partName: '' },
		measures: [],
		keySignatures: [],
		timeSignatures: [],
		tempoMarkings: [],
		tempoWords: [],
		metricModulations: [],
		vocalLine: [],
	};
}
