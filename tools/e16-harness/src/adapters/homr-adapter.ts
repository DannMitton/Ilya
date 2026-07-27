/**
 * homr-adapter: homr's REAL native MusicXML output (v0.6.2, run this session
 * against the harness's own rendered page PNGs) -> `RecognizedOutput`.
 *
 * Built against REAL OBSERVED output, not a guessed/unseen format: 22 real
 * MusicXML files (one per rendered page, all six *Sunless* pieces) are
 * archived alongside ground truth at
 * `output/<piece>/homr-raw/page<N>_300dpi.musicxml`, produced by running
 * `homr <page>.png` directly (homr v0.6.2, ONNX + PyTorch checkpoints
 * downloaded from `github.com/liebharc/homr/releases/download/onnx_checkpoints/`,
 * this session, 2026-07-22/23).
 *
 * WHAT homr ACTUALLY EMITS, verified across all 22 pages:
 *   - ONE `<part>` (id "P1"), instrument name "Piano", with TWO `<staff>`
 *     numbers (1 and 2) -- homr has no concept of "vocal part"; it always
 *     labels a two-staff system as a piano grand staff, regardless of what
 *     the two staves actually are.
 *   - Staff 1 is consistently the TOP staff of the rendered system, staff 2
 *     the bottom -- verified against every page's `<clef number="N">`:
 *     piece 01 has clef sign F on staff 1 (bass clef; matches ground
 *     truth's own `clef: {sign:"F", line:4}` for that piece, the ONE piece
 *     in this corpus whose vocal line is bass-clef); pieces 02, 03, 04, 05,
 *     06 all have clef sign G on staff 1 (matches ground truth's
 *     `clef: {sign:"G", line:2}` for those pieces). This is the basis for
 *     the vocal-staff rule below, cross-checked in run-homr-score.ts
 *     (`vocalStaffClefMatchesGroundTruth`) rather than assumed.
 *   - Measures interleave BOTH staves in one linear stream per part:
 *     staff-1 note(s), then `<backup>`, then staff-2 note(s) -- standard
 *     MusicXML for a 2-staff single part. Handled below via `preserveOrder`
 *     parsing (element order matters for `<backup>`/`<forward>`; a
 *     tag-grouping parser would silently scramble it).
 *   - ZERO `<lyric>` elements anywhere, on any page, any piece. homr proposes
 *     no syllable text at all (matches decision D1: no engine survey
 *     candidate emits usable lyric text).
 *   - ZERO `default-x`/`default-y` (or any other page-position) attributes
 *     anywhere, on any page, any piece. See the coordinate-check verdict in
 *     the memo.
 *
 * VOCAL-STAFF RULE (JUDGEMENT, stated plainly): the vocal line is
 * `<staff>1</staff>` -- the TOP staff of homr's single 2-staff part. This
 * matches the task brief's own instruction ("pick the vocal staff, top
 * staff of the piano-vocal system") AND the actual rendered page images
 * (visually inspected: the top staff carries the lyrics under it in the
 * rendered PNG; the bottom staff is the piano). Staff 2 (piano) is
 * discarded entirely; this adapter never reads it.
 *
 * PITCH MAPPING -- DELIBERATELY LITERAL, NOT "CORRECTED" (JUDGEMENT, stated
 * plainly; this is a real finding about homr, not an adapter bug to paper
 * over): ground truth's clef record shows `octaveChange: -1` for pieces 02,
 * 03, 05, 06 (an octave-treble-clef convention for a low male voice --
 * confirmed VISUALLY on the rendered page: a small "8" sits under the G
 * clef on the vocal staff for those pieces; piece 04's G clef has no "8"
 * and no `octaveChange`; piece 01 is plain bass clef, no octave issue).
 * homr's own MusicXML has NO `<clef-octave-change>` element on ANY page,
 * for ANY piece, including the four that need one. This adapter reads
 * homr's `<pitch>` literally (standard MusicXML step+alter+octave, C4=60),
 * with NO manual octave correction applied. Applying a silent -12
 * correction here would not be "fixing the adapter" -- it would be papering
 * over a real homr limitation (failing to detect/apply a mark that IS
 * visually present on the page) with information the adapter has no
 * legitimate way to know except by reading ground truth itself. The
 * resulting large, systematic pitch error on pieces 02/03/05/06 is real
 * signal about homr, not adapter noise; see the memo's per-piece table.
 *
 * MEASURE / BARLINE RECONCILIATION: homr numbers measures 1..N PER PAGE
 * (restarting at 1 on every page, since it only ever sees one page image at
 * a time). This adapter concatenates pages in page order and re-indexes
 * measures to one continuous 0-based sequence per piece (page 1's measures
 * 1..k become indices 0..k-1; page 2's measures 1..m become indices
 * k..k+m-1; and so on), matching ground truth's own continuous, 0-based
 * `measureIndex`. Whether homr's PER-PAGE measure count total agrees with
 * ground truth's continuous count is checked and reported per piece by
 * run-homr-score.ts (`measureCountsAgree`), not assumed.
 *
 * RHYTHM MAPPING: `<divisions>` (duration units per quarter note) can change
 * within a part and is tracked as running state, updated whenever a new
 * `<divisions>` value is seen and applied to all subsequent notes/rests/
 * backup/forward until next changed. Onset within a measure is a single
 * running cursor (in divisions-units, shared across staves per MusicXML's
 * own single-stream-per-part semantics), advanced by each non-chord note's
 * or rest's duration, adjusted by `<backup>`/`<forward>` (both DO occur in
 * homr's own output, once per measure, to return the cursor to the top of
 * the measure before writing staff 2 -- handled explicitly, not assumed
 * absent), and left unchanged for `<chord/>` notes (which share the onset
 * of the preceding non-chord note). Plain MusicXML semantics, not
 * homr-specific.
 */

import { XMLParser } from 'fast-xml-parser';
import type { RecognizedNote, RecognizedOutput, RecognizedVerse } from '../normalized-format.ts';

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_', preserveOrder: true });

const STEP_SEMITONES: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

function pitchToMidi(step: string, alter: number, octave: number): number {
	return (octave + 1) * 12 + STEP_SEMITONES[step] + alter;
}

/** Find the first child element by tag name within a preserveOrder node array; undefined if absent. */
function findChild(children: any[], tag: string): any | undefined {
	return children.find((c) => Object.prototype.hasOwnProperty.call(c, tag));
}

function findAllChildren(children: any[], tag: string): any[] {
	return children.filter((c) => Object.prototype.hasOwnProperty.call(c, tag));
}

function fraction(numerator: number, denominator: number): { numerator: number; denominator: number } {
	function gcd(a: number, b: number): number {
		return b === 0 ? a : gcd(b, a % b);
	}
	if (numerator === 0) return { numerator: 0, denominator: 1 };
	const g = gcd(Math.abs(numerator), Math.abs(denominator));
	return { numerator: numerator / g, denominator: denominator / g };
}

export interface HomrPageResult {
	measureCount: number;
	notes: Array<{
		measureIndexInPage: number; // 0-based, local to this page
		onset: { numerator: number; denominator: number };
		duration: { numerator: number; denominator: number };
		type: 'note' | 'rest';
		midi?: number;
	}>;
	clefSignOnVocalStaff?: string;
}

/**
 * Parse ONE homr page MusicXML, extracting only events on `vocalStaff`.
 * Measure indices returned are 0-based and LOCAL to this page (the caller
 * offsets them when concatenating pages into one piece).
 */
export function parseHomrPage(xmlText: string, vocalStaff: number): HomrPageResult {
	const doc = parser.parse(xmlText);
	const scorePartwiseEntry = doc.find((n: any) => 'score-partwise' in n);
	const scorePartwiseChildren = scorePartwiseEntry['score-partwise'];
	const partEntry = findChild(scorePartwiseChildren, 'part');
	if (!partEntry) throw new Error('homr-adapter: no <part> found in MusicXML');
	const measureEntries = findAllChildren(partEntry.part, 'measure');

	const notes: HomrPageResult['notes'] = [];
	let divisions = 1; // duration units per quarter note; MusicXML default before any <divisions> is seen
	let clefSignOnVocalStaff: string | undefined;

	measureEntries.forEach((measureEntry, measureIdx) => {
		const children: any[] = measureEntry.measure;
		let cursorUnits = 0; // running position within the measure, in divisions-units, shared across staves
		let lastNonChordOnsetUnits = 0;

		for (const child of children) {
			if ('attributes' in child) {
				const attrChildren: any[] = child.attributes;
				const divisionsNode = findChild(attrChildren, 'divisions');
				if (divisionsNode) {
					const v = divisionsNode.divisions?.[0]?.['#text'];
					if (v !== undefined) divisions = Number(v);
				}
				for (const clefNode of findAllChildren(attrChildren, 'clef')) {
					const clefNumber = Number(clefNode[':@']?.['@_number'] ?? 1);
					const signText = clefNode.clef?.find((c: any) => 'sign' in c)?.sign?.[0]?.['#text'];
					if (clefNumber === vocalStaff && signText !== undefined) clefSignOnVocalStaff = String(signText);
				}
			} else if ('note' in child) {
				const noteChildren: any[] = child.note;
				const isChord = findChild(noteChildren, 'chord') !== undefined;
				const isRest = findChild(noteChildren, 'rest') !== undefined;
				const durationNode = findChild(noteChildren, 'duration');
				const durationUnits = durationNode ? Number(durationNode.duration?.[0]?.['#text'] ?? 0) : 0;
				const staffNode = findChild(noteChildren, 'staff');
				const staffNum = staffNode ? Number(staffNode.staff?.[0]?.['#text'] ?? 1) : 1;

				const effectiveOnsetUnits = isChord ? lastNonChordOnsetUnits : cursorUnits;
				const wholeNoteUnits = divisions * 4;

				if (staffNum === vocalStaff) {
					const onsetFrac = fraction(effectiveOnsetUnits, wholeNoteUnits);
					const durFrac = fraction(durationUnits, wholeNoteUnits);
					if (isRest) {
						notes.push({ measureIndexInPage: measureIdx, onset: onsetFrac, duration: durFrac, type: 'rest' });
					} else {
						const pitchNode = findChild(noteChildren, 'pitch');
						if (pitchNode) {
							const pitchChildren: any[] = pitchNode.pitch;
							const step = String(findChild(pitchChildren, 'step')?.step?.[0]?.['#text']);
							const alterNode = findChild(pitchChildren, 'alter');
							const alter = alterNode ? Number(alterNode.alter?.[0]?.['#text'] ?? 0) : 0;
							const octave = Number(findChild(pitchChildren, 'octave')?.octave?.[0]?.['#text']);
							notes.push({
								measureIndexInPage: measureIdx,
								onset: onsetFrac,
								duration: durFrac,
								type: 'note',
								midi: pitchToMidi(step, alter, octave)
							});
						}
					}
				}

				if (!isChord) {
					lastNonChordOnsetUnits = cursorUnits;
					cursorUnits += durationUnits;
				}
			} else if ('backup' in child) {
				const dur = Number(child.backup?.[0]?.duration?.[0]?.['#text'] ?? 0);
				cursorUnits -= dur;
			} else if ('forward' in child) {
				const dur = Number(child.forward?.[0]?.duration?.[0]?.['#text'] ?? 0);
				cursorUnits += dur;
			}
		}
	});

	return { measureCount: measureEntries.length, notes, clefSignOnVocalStaff };
}

/**
 * Concatenate all of a piece's pages (in page order) into one continuous,
 * 0-based measure sequence and shape it as `RecognizedOutput`. `pageXmlTexts`
 * must be in page order (page 1 first).
 */
export function homrAdaptPiece(
	pieceId: string,
	pageXmlTexts: string[],
	vocalStaff: number,
	primaryVerseNumber: number
): { output: RecognizedOutput; pageMeasureCounts: number[]; clefSigns: (string | undefined)[] } {
	let measureOffset = 0;
	const allNotes: RecognizedNote[] = [];
	const pageMeasureCounts: number[] = [];
	const clefSigns: (string | undefined)[] = [];
	let idCounter = 0;

	for (const xmlText of pageXmlTexts) {
		const page = parseHomrPage(xmlText, vocalStaff);
		pageMeasureCounts.push(page.measureCount);
		clefSigns.push(page.clefSignOnVocalStaff);
		for (const n of page.notes) {
			allNotes.push({
				id: `homr-${pieceId}-${idCounter++}`,
				type: n.type,
				measureIndex: n.measureIndexInPage + measureOffset,
				onset: n.onset,
				duration: n.duration,
				midi: n.midi
				// syllableText intentionally omitted: homr emits zero <lyric> elements on this corpus.
			});
		}
		measureOffset += page.measureCount;
	}

	const verse: RecognizedVerse = { verseNumber: primaryVerseNumber, notes: allNotes };
	return {
		output: { pieceId, verses: [verse] },
		pageMeasureCounts,
		clefSigns
	};
}
