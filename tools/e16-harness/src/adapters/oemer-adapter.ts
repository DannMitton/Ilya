/**
 * oemer-adapter: oemer's REAL native MusicXML output (v0.1.5, run this
 * session on Dann's own Mac against the harness's own rendered page PNGs,
 * inside a dedicated venv, after patching two deprecated NumPy aliases and
 * pinning `opencv-python==4.13.0.92` for API compatibility) -> `RecognizedOutput`.
 *
 * Built against ONE real observed file so far: `page1_300dpi.musicxml` for
 * piece `mussorgsky---sunless-01---within-four-walls`, archived at
 * `output/<piece>/page1_300dpi.musicxml` (66265 bytes, produced 2026-07-23).
 * Unlike homr-adapter.ts (verified across all 22 pages of all 6 pieces),
 * this adapter's empirical claims below are verified on THIS ONE PAGE ONLY.
 * They are stated as observed-on-page-1, not assumed to generalize; treat
 * any future page/piece as a fresh check, not a foregone conclusion.
 *
 * WHAT oemer ACTUALLY EMITS, verified on page 1 of piece 01:
 *   - ONE `<part>` (id "P1"), instrument name "Piano", with TWO `<staff>`
 *     numbers (1 and 2) -- same "always a piano grand staff" shape as homr;
 *     oemer also has no concept of a distinct vocal part.
 *   - Staff 1 carries clef sign F, line 4 (bass clef) -- matches ground
 *     truth's own `clef: {sign:"F", line:4}` for piece 01 exactly. Staff 2
 *     carries clef sign G, line 2. Same top-staff-is-vocal convention as
 *     homr, confirmed by clef match on this page (not assumed).
 *   - Key signature `<fifths>2</fifths>` also matches ground truth's
 *     `keySignature.fifths: 2` for this piece.
 *   - Measures interleave both staves in one linear stream per part via
 *     `<backup>`/`<forward>`, same as homr; `<chord/>` marks stacked notes
 *     sharing an onset. Handled below via `preserveOrder` parsing, same
 *     reason as homr-adapter.ts (element order carries meaning).
 *   - ZERO `<lyric>` elements on this page. oemer proposes no syllable text,
 *     same as homr (matches D1: no engine survey candidate emits usable
 *     lyric text).
 *   - ZERO `default-x`/`default-y` (or any other page-position) attributes
 *     on this page. Reinforces, on real oemer output rather than only the
 *     survey's static-analysis reading of oemer's Python source, the D9
 *     finding that no engine emits per-note page coordinates.
 *   - ZERO `<clef-octave-change>` on this page. Piece 01 is plain bass
 *     clef with no octave convention at stake, so this page cannot confirm
 *     or refute how oemer handles the octave-treble-clef convention that
 *     bites 4 of the corpus's other 5 pieces (see homr-adapter.ts's own
 *     note on this); that remains untested for oemer specifically.
 *   - `<divisions>` changes are tracked as running state (2 in measure 1
 *     of this page), same as homr.
 *
 * VOCAL-STAFF RULE (JUDGEMENT, stated plainly, same shape as homr-adapter.ts):
 * the vocal line is `<staff>1</staff>`, confirmed for this one page by its
 * clef matching ground truth. A future page/piece should re-verify this the
 * same way (clef-sign cross-check), not assume it from this one page.
 *
 * PITCH MAPPING: same literal, uncorrected approach as homr-adapter.ts, for
 * the same reason -- reads standard MusicXML step+alter+octave with no
 * manual octave correction. Not yet tested against a piece needing the
 * octave-treble-clef correction (see above).
 *
 * MEASURE / BARLINE RECONCILIATION: oemer numbers measures 1..N per page
 * image, same as homr; this adapter re-indexes to one continuous 0-based
 * sequence when concatenating pages (same function shape as homr-adapter.ts,
 * currently exercised with a single-page array since only page 1 exists).
 * oemer's own page-1 measure count is 12, matching homr's own page-1 count
 * for the same page (both engines agree on where the system breaks fall);
 * ground truth's own measure boundaries for the full piece are 18 (12 + 6
 * across two pages), so a page-1-only score must compare against ONLY
 * ground truth's first 12 measures, never the full piece, or recall looks
 * artificially worse than oemer's actual page-1 performance. The run script
 * enforces this by measure-index filtering, not by re-deriving oemer's own
 * count.
 *
 * RHYTHM MAPPING: identical semantics to homr-adapter.ts (a single running
 * cursor per measure, shared across staves, advanced by non-chord notes and
 * rests, adjusted by backup/forward, unchanged for chord notes). This is
 * plain MusicXML semantics, not engine-specific, so the parsing function
 * below is a faithful re-implementation of homr-adapter.ts's `parseHomrPage`
 * / `homrAdaptPiece`, renamed for oemer, not a redesign.
 */

import { XMLParser } from 'fast-xml-parser';
import type { RecognizedNote, RecognizedOutput, RecognizedVerse } from '../normalized-format.ts';

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_', preserveOrder: true });

const STEP_SEMITONES: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

function pitchToMidi(step: string, alter: number, octave: number): number {
	return (octave + 1) * 12 + STEP_SEMITONES[step] + alter;
}

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

export interface OemerPageResult {
	measureCount: number;
	notes: Array<{
		measureIndexInPage: number;
		onset: { numerator: number; denominator: number };
		duration: { numerator: number; denominator: number };
		type: 'note' | 'rest';
		midi?: number;
	}>;
	clefSignOnVocalStaff?: string;
}

/**
 * Parse ONE oemer page MusicXML, extracting only events on `vocalStaff`.
 * Measure indices returned are 0-based and LOCAL to this page (the caller
 * offsets them when concatenating pages into one piece).
 */
export function parseOemerPage(xmlText: string, vocalStaff: number): OemerPageResult {
	const doc = parser.parse(xmlText);
	const scorePartwiseEntry = doc.find((n: any) => 'score-partwise' in n);
	const scorePartwiseChildren = scorePartwiseEntry['score-partwise'];
	const partEntry = findChild(scorePartwiseChildren, 'part');
	if (!partEntry) throw new Error('oemer-adapter: no <part> found in MusicXML');
	const measureEntries = findAllChildren(partEntry.part, 'measure');

	const notes: OemerPageResult['notes'] = [];
	let divisions = 1;
	let clefSignOnVocalStaff: string | undefined;

	measureEntries.forEach((measureEntry, measureIdx) => {
		const children: any[] = measureEntry.measure;
		let cursorUnits = 0;
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
 * Concatenate all of a piece's AVAILABLE pages (in page order) into one
 * continuous, 0-based measure sequence and shape it as `RecognizedOutput`.
 * `pageXmlTexts` must be in page order (page 1 first). Currently called
 * with a single-element array (page 1 only) for piece 01; the function
 * itself is not limited to that, so later pages slot in unchanged once
 * they exist.
 */
export function oemerAdaptPiece(
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
		const page = parseOemerPage(xmlText, vocalStaff);
		pageMeasureCounts.push(page.measureCount);
		clefSigns.push(page.clefSignOnVocalStaff);
		for (const n of page.notes) {
			allNotes.push({
				id: `oemer-${pieceId}-${idCounter++}`,
				type: n.type,
				measureIndex: n.measureIndexInPage + measureOffset,
				onset: n.onset,
				duration: n.duration,
				midi: n.midi
				// syllableText intentionally omitted: oemer emits zero <lyric> elements, same as homr.
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
