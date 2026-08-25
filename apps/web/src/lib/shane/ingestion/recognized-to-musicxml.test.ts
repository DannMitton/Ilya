/**
 * N.59 step 5's proof. Two fixtures convert and parse: a hand-built `ro` that
 * exercises Ruling D's two substitutions deliberately, and a real one captured
 * from the browser run (Musorgsky sunless-01 page 1, read under Pyodide with
 * cv2 4.9.0 / numpy 1.26.4 on 2026-08-16).
 *
 * The captured fixture matters because a hand-built one only ever proves the
 * converter against my own idea of `ro`. This one came out of the Python.
 */
import { describe, expect, it } from 'vitest';
import { MusicXmlScoreParser } from '@ilya/score-parser';
import { recognizedToMusicXml } from './recognized-to-musicxml';
import { applyCorrections, orphanIds } from '../correction';
import type { RecognizedOutput } from './recognized';
import captured from './fixtures/recognized-mussorgsky-01-p1.json';

// ── A tiny, dependency-free XML reader ───────────────────────────
//
// vitest runs in node, where there is no `DOMParser`, and the parser says so
// itself rather than guessing: "String MusicXML needs a DOM parser; pass a
// pre-parsed Document in this environment." This is the same mini-DOM the
// score-parser's own musicxml-parser.test.ts carries, for the same reason, and
// it implements only the small structural surface the parser reads. Copied
// rather than shared because moving it would touch the score-parser package,
// and a refactor of a 444-test suite is not what this step is for.

type MiniNode = { t: 'e'; el: MiniEl } | { t: 't'; s: string };

function decodeEntities(s: string): string {
	return s
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
		.replace(/&amp;/g, '&');
}

class MiniEl {
	tagName: string;
	attrs = new Map<string, string>();
	nodes: MiniNode[] = [];
	constructor(tagName: string) {
		this.tagName = tagName;
	}
	getAttribute(name: string): string | null {
		return this.attrs.has(name) ? (this.attrs.get(name) as string) : null;
	}
	get children(): MiniEl[] {
		return this.nodes.filter((n): n is { t: 'e'; el: MiniEl } => n.t === 'e').map((n) => n.el);
	}
	get textContent(): string {
		return this.nodes.map((n) => (n.t === 't' ? n.s : n.el.textContent)).join('');
	}
	getElementsByTagName(tag: string): MiniEl[] {
		const out: MiniEl[] = [];
		const rec = (el: MiniEl) => {
			for (const c of el.children) {
				if (tag === '*' || c.tagName === tag) out.push(c);
				rec(c);
			}
		};
		rec(this);
		return out;
	}
}

function parseXml(src: string): MiniEl {
	const cleaned = src
		.replace(/<\?xml[\s\S]*?\?>/g, '')
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/<!DOCTYPE[\s\S]*?>/g, '');
	const doc = new MiniEl('#document');
	const stack: MiniEl[] = [doc];
	const attrRe = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
	let pos = 0;
	const addText = (text: string) => {
		if (text.length === 0) return;
		stack[stack.length - 1].nodes.push({ t: 't', s: decodeEntities(text) });
	};
	while (pos < cleaned.length) {
		const lt = cleaned.indexOf('<', pos);
		if (lt < 0) {
			addText(cleaned.slice(pos));
			break;
		}
		if (lt > pos) addText(cleaned.slice(pos, lt));
		const gt = cleaned.indexOf('>', lt);
		if (gt < 0) break;
		const raw = cleaned.slice(lt + 1, gt);
		pos = gt + 1;
		if (raw.startsWith('/')) {
			if (stack.length > 1) stack.pop();
			continue;
		}
		const selfClose = raw.endsWith('/');
		const inner = selfClose ? raw.slice(0, -1) : raw;
		const nameMatch = /^([^\s/]+)([\s\S]*)$/.exec(inner);
		if (!nameMatch) continue;
		const el = new MiniEl(nameMatch[1]);
		attrRe.lastIndex = 0;
		let am: RegExpExecArray | null;
		while ((am = attrRe.exec(nameMatch[2])) !== null) {
			el.attrs.set(am[1], decodeEntities(am[2] !== undefined ? am[2] : am[3]));
		}
		stack[stack.length - 1].nodes.push({ t: 'e', el });
		if (!selfClose) stack.push(el);
	}
	return doc;
}

const parseMusicXml = (xml: string, sourcePath: string) =>
	new MusicXmlScoreParser().parse({
		format: 'musicxml',
		data: parseXml(xml) as unknown as Document,
		sourcePath,
	});

const TREBLE_8VB = {
	clef: { sign: 'G', line: 2 },
	octaveChange: -1,
	fifths: 7,
};

const BASS = { clef: { sign: 'F', line: 4 }, octaveChange: 0, fifths: 2 };

const frac = (numerator: number, denominator: number) => ({ numerator, denominator });

/**
 * A two-measure `ro` built by hand. Measure 0 is confident. Measure 1 opens
 * with a pitch abstention, then a duration abstention, then an onset-lost
 * follower, so both of Ruling D's substitutions and the follower rule are
 * exercised in one fixture.
 */
const handBuilt: RecognizedOutput = {
	pieceId: 'hand-built',
	clef: { sign: 'G', line: 2 },
	keySignature: { fifths: 7 },
	measures: [
		{
			measureIndex: 0,
			metre: { beats: 4, beatType: 4 },
			measureDuration: frac(1, 1),
		},
		{
			measureIndex: 1,
			metre: null,
			measureDuration: null,
			abstain: { metre: 'no_printed_signature_no_inheritance' },
		},
	],
	verses: [
		{
			verseNumber: 1,
			notes: [
				{ id: 'a', type: 'note', measureIndex: 0, onset: frac(0, 1), duration: frac(1, 4), midi: 60 },
				{ id: 'b', type: 'note', measureIndex: 0, onset: frac(1, 4), duration: frac(3, 8), midi: 61 },
				{ id: 'c', type: 'rest', measureIndex: 0, onset: frac(5, 8), duration: frac(1, 8) },
				{
					id: 'd',
					type: 'note',
					measureIndex: 1,
					onset: frac(0, 1),
					duration: frac(1, 2),
					midi: null,
					midiAssumedNatural: 67,
					abstain: { pitch: 'accidental_unresolved' },
				},
				{
					id: 'e',
					type: 'note',
					measureIndex: 1,
					onset: frac(1, 2),
					duration: null,
					midi: 69,
					abstain: { duration: 'beam_scale_ink_no_beam' },
				},
				{
					id: 'f',
					type: 'note',
					measureIndex: 1,
					onset: null,
					duration: frac(1, 8),
					midi: 71,
					abstain: { onset: 'follows_duration_abstention' },
				},
			],
		},
	],
};

describe('recognizedToMusicXml', () => {
	it('emits the singer\'s clef, its octave change, and the key from fifths', () => {
		const { xml } = recognizedToMusicXml(handBuilt, TREBLE_8VB);
		expect(xml).toContain('<sign>G</sign>');
		expect(xml).toContain('<line>2</line>');
		expect(xml).toContain('<clef-octave-change>-1</clef-octave-change>');
		expect(xml).toContain('<fifths>7</fifths>');
	});

	it('omits clef-octave-change when there is none', () => {
		const { xml } = recognizedToMusicXml(handBuilt, { ...TREBLE_8VB, octaveChange: 0 });
		expect(xml).not.toContain('clef-octave-change');
	});

	/**
	 * Found on Dann's own walk, 2026-08-16. The converter used to emit `pieceId`
	 * as <work-title>, and the from-score rule fills BLANK fields, so a singer
	 * with no title yet would have had their song named `page-4d8c1ba2` and
	 * tagged as coming from the score. Ilya does not invent a fact about the
	 * singer's music.
	 */
	it('emits no title at all: a derived id is not a name anyone chose', () => {
		const { xml } = recognizedToMusicXml(handBuilt, TREBLE_8VB);
		expect(xml).not.toContain('work-title');
		expect(xml).not.toContain('hand-built');
	});

	it('emits <time> from a confident metre and none where metre abstained', () => {
		const { xml } = recognizedToMusicXml(handBuilt, TREBLE_8VB);
		expect(xml.match(/<time>/g) ?? []).toHaveLength(1);
		expect(xml).toContain('<beats>4</beats>');
		expect(xml).toContain('<beat-type>4</beat-type>');
	});

	it('engraves midiAssumedNatural where pitch abstained, and counts it', () => {
		const { xml, counts } = recognizedToMusicXml(handBuilt, TREBLE_8VB);
		expect(counts.pitchSubstitutions).toEqual([{ measureIndex: 1, count: 1 }]);
		expect(counts.pitchless).toBe(0);
		// midi 67 is G4, and no event is dropped: six events in, six notes out.
		// `<note ` with a space since N.97b: every event carries its reader id.
		expect(xml.match(/<note[ >]/g) ?? []).toHaveLength(6);
		expect(xml).toContain('<step>G</step>');
	});

	it('forces a quarter note for the abstained duration AND its onset-lost follower', () => {
		const { counts } = recognizedToMusicXml(handBuilt, TREBLE_8VB);
		expect(counts.durationSubstitutions).toEqual([{ measureIndex: 1, count: 2 }]);
	});

	it('makes every emitted duration an integral number of divisions', () => {
		const { xml } = recognizedToMusicXml(handBuilt, TREBLE_8VB);
		const divisions = Number(xml.match(/<divisions>(\d+)<\/divisions>/)![1]);
		expect(Number.isInteger(divisions)).toBe(true);
		for (const m of xml.matchAll(/<duration>(-?\d+)<\/duration>/g)) {
			expect(Number(m[1])).toBeGreaterThan(0);
		}
		// A dotted quarter is 3/8 of a whole note, so with divisions per quarter
		// it must be exactly 1.5 quarters.
		expect(xml).toContain(`<duration>${divisions * 1.5}</duration>`);
	});

	it('spells sharps in sharp keys and flats in flat keys', () => {
		const sharp = recognizedToMusicXml(handBuilt, TREBLE_8VB).xml;
		expect(sharp).toContain('<step>C</step>');
		expect(sharp).toContain('<alter>1</alter>');
		const flat = recognizedToMusicXml(handBuilt, { ...TREBLE_8VB, fifths: -3 }).xml;
		expect(flat).toContain('<alter>-1</alter>');
		expect(flat).toContain('<step>D</step>');
	});

	it('parses, with exactly the no-lyrics-found warning', async () => {
		const { xml } = recognizedToMusicXml(handBuilt, TREBLE_8VB);
		const result = await parseMusicXml(xml, 'hand-built.musicxml');
		expect(result.errors.filter((e) => e.fatal)).toEqual([]);
		expect(result.warnings.map((w) => w.code)).toContain('no-lyrics-found');
		expect(result.score).toBeTruthy();
	});
});

describe('recognizedToMusicXml, on a page actually read in a browser', () => {
	const ro = captured as unknown as RecognizedOutput;

	it('converts the captured read and parses it', async () => {
		const { xml, counts } = recognizedToMusicXml(ro, BASS);
		expect(counts.measures).toBe(12);
		expect(counts.notes + counts.rests).toBe(78);
		expect(counts.pitchless).toBe(0);
		const result = await parseMusicXml(xml, 'mussorgsky-01-p1.musicxml');
		expect(result.errors.filter((e) => e.fatal)).toEqual([]);
		expect(result.warnings.map((w) => w.code)).toContain('no-lyrics-found');
		expect(result.score).toBeTruthy();
	});

	it('keeps every read event: nothing is dropped on the way to the parser', async () => {
		const { xml } = recognizedToMusicXml(ro, BASS);
		const events = ro.verses[0].notes.length;
		expect(xml.match(/<note[ >]/g) ?? []).toHaveLength(events);
	});
});

// ── N.97b: the reader's id survives the MusicXML boundary ────────────
//
// Ruled by Dann 2026-08-24, option 1 of `memo-n97-clef-key_r1_2026-08-24.md`.
// N.97 re-keyed the READER's ids to measure and x, and measured afterwards that
// those ids never reached `VocalLineEvent` at all: the parser assigned its own
// from a running duration cursor, so a correction was still keyed to a cursor
// and still moved when the event population changed. These are the tests that
// hold the two ends of the seam together.

describe('recognizedToMusicXml, N.97b: the reader ids reach VocalLineEvent', () => {
	const ro = captured as unknown as RecognizedOutput;
	/** The parser's own id shape, `m{measureIndex}-{numerator}-{denominator}`. */
	const CURSOR = /^m\d+-\d+-\d+$/;
	const withoutIds = (xml: string) => xml.replace(/<note id="[^"]*"/g, '<note');
	const without = (source: RecognizedOutput, id: string): RecognizedOutput => ({
		...source,
		verses: source.verses.map((v) => ({ ...v, notes: v.notes.filter((n) => n.id !== id) })),
	});

	it('writes every event id as the <note> id attribute', () => {
		const { xml } = recognizedToMusicXml(handBuilt, TREBLE_8VB);
		expect(xml.match(/<note id="[^"]*"/g)).toEqual([
			'<note id="a"',
			'<note id="b"',
			'<note id="c"',
			'<note id="d"',
			'<note id="e"',
			'<note id="f"',
		]);
	});

	it('carries them through the parser, in the reader\'s own order', async () => {
		const { xml } = recognizedToMusicXml(handBuilt, TREBLE_8VB);
		const { score } = await parseMusicXml(xml, 'hand-built.musicxml');
		expect(score.vocalLine.map((e) => e.id)).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
	});

	it('carries all 78 of the captured page\'s ids, unique and in order', async () => {
		const { xml } = recognizedToMusicXml(ro, BASS);
		const { score } = await parseMusicXml(xml, 'mussorgsky-01-p1.musicxml');
		const readerIds = ro.verses[0].notes.map((n) => n.id);
		expect(score.vocalLine.map((e) => e.id)).toEqual(readerIds);
		expect(new Set(readerIds).size).toBe(readerIds.length);
	});

	it('keeps a correction landing when an earlier event in its measure is removed', async () => {
		// `r1-0-1-787` is the first event of the captured page's measure 1;
		// `r1-11-8-1474` is the last of the same measure, and the correction is on
		// it. Removing the first is exactly what N.97's clef-and-key mask does to
		// a real page: it deletes a false positive early in a measure.
		const parse = (source: RecognizedOutput, bare: boolean) => {
			const { xml } = recognizedToMusicXml(source, BASS);
			return parseMusicXml(bare ? withoutIds(xml) : xml, 'mussorgsky-01-p1.musicxml');
		};
		const correction = { 'r1-11-8-1474': { pitch: { step: 'G' as const, alter: 1, octave: 4 } } };
		const after = await parse(without(ro, 'r1-0-1-787'), false);

		expect(after.score.vocalLine).toHaveLength(77);
		expect(orphanIds(after.score.vocalLine, correction)).toEqual([]);
		const corrected = applyCorrections(after.score.vocalLine, correction).find(
			(e) => e.id === 'r1-11-8-1474'
		)!;
		expect(corrected.pitch).toEqual({ step: 'G', alter: 1, octave: 4 });

		// THE COUNTERFACTUAL, the same two documents with the id attributes
		// stripped: the sixth event of measure 1 is renamed by the removal, and a
		// correction keyed to its old name is orphaned. That is what shipped
		// before this change, measured here rather than asserted.
		const bareBefore = await parse(ro, true);
		const bareAfter = await parse(without(ro, 'r1-0-1-787'), true);
		const at = ro.verses[0].notes.findIndex((n) => n.id === 'r1-11-8-1474');
		const oldName = bareBefore.score.vocalLine[at].id;
		const newName = bareAfter.score.vocalLine[at - 1].id;
		expect(oldName).toMatch(CURSOR);
		expect(newName).not.toBe(oldName);
		expect(orphanIds(bareAfter.score.vocalLine, { [oldName]: { deleted: true as const } })).toEqual([
			oldName,
		]);
	});

	it('falls back to the parser\'s ids for the whole line if the reader ever repeats one', async () => {
		// The reader cannot do this today: `run_page2.py` suffixes a shared x, and
		// 1,118 ids over 25 corpus pages carry 0 duplicates. This is the guard for
		// the day it can, and for any foreign file that arrives with sloppy ids.
		const notes = ro.verses[0].notes;
		const broken: RecognizedOutput = {
			...ro,
			verses: [{ ...ro.verses[0], notes: notes.map((n, i) => (i === 3 ? { ...n, id: notes[2].id } : n)) }],
		};
		const { xml } = recognizedToMusicXml(broken, BASS);
		const { score, warnings } = await parseMusicXml(xml, 'mussorgsky-01-p1.musicxml');
		const ids = score.vocalLine.map((e) => e.id);
		for (const id of ids) expect(id).toMatch(CURSOR);
		expect(new Set(ids).size).toBe(ids.length);
		expect(warnings.filter((w) => w.code === 'duplicate-note-ids')).toHaveLength(1);
	});

	it('leaves a `ro` whose events have no ids exactly where it was', async () => {
		// Defensive: `id` is required on `RecognizedNote`, so this is a `ro` from
		// some future or foreign producer. It engraves no attribute at all and
		// parses to the cursor ids, which is the pre-N.97b behaviour byte for byte.
		const idless = {
			...handBuilt,
			verses: [
				{
					...handBuilt.verses[0],
					notes: handBuilt.verses[0].notes.map(({ id: _id, ...rest }) => rest),
				},
			],
		} as unknown as RecognizedOutput;
		const { xml } = recognizedToMusicXml(idless, TREBLE_8VB);
		expect(xml).not.toContain('<note id');
		expect(withoutIds(recognizedToMusicXml(handBuilt, TREBLE_8VB).xml)).toBe(xml);
		const { score, warnings } = await parseMusicXml(xml, 'hand-built.musicxml');
		for (const e of score.vocalLine) expect(e.id).toMatch(CURSOR);
		expect(warnings.some((w) => w.code === 'duplicate-note-ids')).toBe(false);
	});
});
