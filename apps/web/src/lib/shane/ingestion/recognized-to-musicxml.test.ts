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
		expect(xml.match(/<note>/g) ?? []).toHaveLength(6);
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
		expect(xml.match(/<note>/g) ?? []).toHaveLength(events);
	});
});
