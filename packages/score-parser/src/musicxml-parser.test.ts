/**
 * MusicXmlScoreParser tests.
 *
 * Faithful synthetic MusicXML 3.1/4.0 partwise fixtures, built to the
 * public, stable structure of the format (no real copyrighted score is
 * needed). A tiny dependency-free XML reader (`parseXml`, below) turns the
 * fixture strings into a mini-DOM implementing the small structural surface
 * the parser reads, so the tests run in the sandbox with no `@xmldom`
 * dependency; in the browser the parser uses the global `DOMParser` on a
 * string instead.
 *
 * The main fixture is the musical twin of the MNX parser's main fixture
 * (same 3/4, one flat, quarter=60, pickup, "погрузись" melisma, tie, and
 * eighth-triplet), so both parsers are asserted to produce the identical
 * `VocalLineEvent` id sequence — a cross-parser agreement check.
 *
 * Sandbox note (handover v30 §13): these run via the node
 * --experimental-strip-types vitest shim in the sandbox; on Dann's machine
 * `pnpm --filter @ilya/score-parser test` is the authoritative run.
 */

import { describe, expect, it } from 'vitest';
import { MusicXmlScoreParser } from './musicxml-parser';
import type { MusicXmlScoreInput, ParseResult } from './types';
import { markersFromMeasures, unfold, type UnfoldResult } from './unfold';

const parser = new MusicXmlScoreParser();

// ── A tiny, dependency-free XML reader for the fixtures ─────────────

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

function xmlInput(src: string, sourcePath?: string): MusicXmlScoreInput {
	return {
		format: 'musicxml',
		data: parseXml(src) as unknown as Document,
		...(sourcePath ? { sourcePath } : {}),
	};
}

// ── The main fixture (twin of the MNX main fixture) ─────────────────
// divisions=12 (per quarter) so the eighth-triplet lands exactly.

function mainFixture(opts: { software?: string; addSecondLyricPart?: boolean } = {}): string {
	const ident = opts.software
		? `<identification><encoding><software>${opts.software}</software></encoding></identification>`
		: '';
	const p2Lyric = opts.addSecondLyricPart
		? `<lyric number="1"><syllabic>single</syllabic><text>ла</text></lyric>`
		: '';
	return `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0">
  ${ident}
  <part-list>
    <score-part id="P1"><part-name>Voice</part-name></score-part>
    <score-part id="P2"><part-name>Piano</part-name></score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>12</divisions>
        <key><fifths>-1</fifths><mode>minor</mode></key>
        <time><beats>3</beats><beat-type>4</beat-type></time>
        <clef><sign>G</sign><line>2</line></clef>
      </attributes>
      <direction><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>60</per-minute></metronome></direction-type><sound tempo="60"/></direction>
      <note>
        <pitch><step>E</step><alter>-1</alter><octave>3</octave></pitch>
        <duration>12</duration><voice>1</voice><type>quarter</type>
        <lyric number="2"><syllabic>single</syllabic><text>tɨ</text></lyric>
        <lyric number="1"><syllabic>single</syllabic><text>Ты</text></lyric>
      </note>
    </measure>
    <measure number="2">
      <note>
        <pitch><step>D</step><octave>3</octave></pitch>
        <duration>9</duration><voice>1</voice><type>eighth</type><dot/>
        <lyric number="1"><syllabic>begin</syllabic><text>по</text></lyric>
        <lyric number="2"><syllabic>begin</syllabic><text>pʌ</text></lyric>
      </note>
      <note>
        <pitch><step>E</step><octave>3</octave></pitch>
        <duration>3</duration><voice>1</voice><type>16th</type>
        <lyric number="1"><syllabic>middle</syllabic><text>гру</text></lyric>
        <lyric number="2"><syllabic>middle</syllabic><text>ɡru</text></lyric>
      </note>
      <note>
        <pitch><step>F</step><octave>3</octave></pitch>
        <duration>6</duration><voice>1</voice><type>eighth</type>
      </note>
      <note>
        <pitch><step>G</step><octave>3</octave></pitch>
        <duration>6</duration><voice>1</voice><type>eighth</type>
        <tie type="start"/>
        <notations><tied type="start"/><articulations><breath-mark/></articulations></notations>
        <lyric number="1"><syllabic>end</syllabic><text>зись</text></lyric>
        <lyric number="2"><syllabic>end</syllabic><text>zisʲ</text></lyric>
      </note>
      <note><rest/><duration>12</duration><voice>1</voice><type>quarter</type></note>
    </measure>
    <measure number="3">
      <note>
        <pitch><step>G</step><octave>3</octave></pitch>
        <duration>24</duration><voice>1</voice><type>half</type>
        <tie type="stop"/><notations><tied type="stop"/></notations>
      </note>
      <note>
        <pitch><step>A</step><octave>3</octave></pitch>
        <duration>4</duration><voice>1</voice><type>eighth</type>
        <time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes><normal-type>eighth</normal-type></time-modification>
      </note>
      <note>
        <rest/><duration>4</duration><voice>1</voice><type>eighth</type>
        <time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes><normal-type>eighth</normal-type></time-modification>
      </note>
      <note>
        <pitch><step>B</step><alter>-1</alter><octave>3</octave></pitch>
        <duration>4</duration><voice>1</voice><type>eighth</type>
        <time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes><normal-type>eighth</normal-type></time-modification>
      </note>
    </measure>
  </part>
  <part id="P2">
    <measure number="1"><attributes><divisions>12</divisions></attributes>${p2Lyric}<note><rest/><duration>36</duration><voice>1</voice><type>half</type><dot/></note></measure>
    <measure number="2"><note><rest/><duration>36</duration><voice>1</voice><type>half</type><dot/></note></measure>
    <measure number="3"><note><rest/><duration>36</duration><voice>1</voice><type>half</type><dot/></note></measure>
  </part>
</score-partwise>`;
}

async function parseMain(opts?: { software?: string; sourcePath?: string; addSecondLyricPart?: boolean }): Promise<ParseResult> {
	return parser.parse(xmlInput(mainFixture(opts), opts?.sourcePath));
}

describe('MusicXmlScoreParser: routing', () => {
	it('canParse accepts musicxml and rejects mnx', () => {
		expect(parser.canParse(xmlInput('<score-partwise/>'))).toBe(true);
		expect(parser.canParse({ format: 'mnx', data: {} })).toBe(false);
	});
});

describe('MusicXmlScoreParser: fatal validation', () => {
	it('rejects XML with no score-partwise root', async () => {
		const r = await parser.parse(xmlInput('<foo><bar/></foo>'));
		expect(r.errors.some((e) => e.fatal && e.code === 'invalid-musicxml')).toBe(true);
	});
	it('rejects timewise MusicXML distinctly', async () => {
		const r = await parser.parse(xmlInput('<score-timewise><measure/></score-timewise>'));
		expect(r.errors.some((e) => e.fatal && /[Tt]imewise/.test(e.message))).toBe(true);
	});
	it('rejects a score with no parts', async () => {
		const r = await parser.parse(xmlInput('<score-partwise version="4.0"><part-list/></score-partwise>'));
		expect(r.errors.some((e) => e.fatal && e.code === 'no-vocal-part-identified')).toBe(true);
	});
});

describe('MusicXmlScoreParser: the main fixture', () => {
	it('parses without warnings or errors', async () => {
		const r = await parseMain();
		expect(r.errors).toHaveLength(0);
		expect(r.warnings).toHaveLength(0);
	});

	it('identifies the lyric-bearing part as the vocal part', async () => {
		const { score } = await parseMain();
		expect(score.vocalPart.partId).toBe('P1');
		expect(score.vocalPart.partName).toBe('Voice');
	});

	it('produces the SAME event-id sequence as the MNX parser (cross-parser agreement)', async () => {
		const { score } = await parseMain();
		expect(score.vocalLine.map((e) => e.id)).toEqual([
			'm0-0-1',
			'm1-0-1',
			'm1-3-16',
			'm1-1-4',
			'm1-3-8',
			'm1-1-2',
			'm2-0-1',
			'm2-1-2',
			'm2-7-12',
			'm2-2-3',
		]);
	});

	it('builds measures with snapshotted signatures and the anacrusis flagged', async () => {
		const { score } = await parseMain();
		expect(score.measures).toHaveLength(3);
		expect(score.measures[0].isPickup).toBe(true);
		expect(score.measures[1].isPickup).toBeUndefined();
		for (const m of score.measures) {
			expect(m.timeSignature).toEqual({ beats: 3, beatType: 4 });
			expect(m.keySignature).toEqual({ fifths: -1, mode: 'minor' });
			expect(m.expectedDuration).toEqual({ numerator: 3, denominator: 4 });
		}
		expect(score.measures.map((m) => m.number)).toEqual(['1', '2', '3']);
	});

	it('maps the tempo marking (metronome preferred)', async () => {
		const { score } = await parseMain();
		expect(score.tempoMarkings).toEqual([
			{ measureIndex: 0, rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } }, bpm: 60, beatUnit: 'quarter', beatUnitDots: 0 },
		]);
	});

	it('computes dotted and tuplet-scaled duration fractions exactly', async () => {
		const { score } = await parseMain();
		const byId = new Map(score.vocalLine.map((e) => [e.id, e]));
		expect(byId.get('m1-0-1')!.duration).toMatchObject({ base: 'eighth', dots: 1, fraction: { numerator: 3, denominator: 16 } });
		const triplet = byId.get('m2-1-2')!;
		expect(triplet.duration.fraction).toEqual({ numerator: 1, denominator: 12 });
		expect(triplet.duration.tuplet).toEqual({ actualNotes: 3, normalNotes: 2, normalType: 'eighth' });
	});

	it('preserves enharmonic pitch spelling and keeps rests bare', async () => {
		const { score } = await parseMain();
		expect(score.vocalLine[0].pitch).toEqual({ step: 'E', octave: 3, alter: -1 });
		const rest = score.vocalLine.find((e) => e.id === 'm1-1-2')!;
		expect(rest.type).toBe('rest');
		expect(rest.pitch).toBeUndefined();
		expect(rest.syllable).toBeUndefined();
		const tripletLast = score.vocalLine.find((e) => e.id === 'm2-2-3')!;
		expect(tripletLast.pitch).toEqual({ step: 'B', octave: 3, alter: -1 });
	});

	it('keeps verse-1 (Cyrillic) primary and collects both verses', async () => {
		const { score } = await parseMain();
		const first = score.vocalLine[0].syllable!;
		expect(first.text).toBe('Ты');
		expect(first.type).toBe('whole');
		expect(first.verseNumber).toBe(1);
		expect(first.verses).toEqual(['Ты', 'tɨ']);
		expect(first.segments).toBeUndefined();
	});

	it('exposes structured versesInfo for every verse on a multi-verse event', async () => {
		const { score } = await parseMain();
		const first = score.vocalLine[0].syllable!;
		expect(first.versesInfo).toEqual([
			{ verseNumber: 1, text: 'Ты', type: 'whole' },
			{ verseNumber: 2, text: 'tɨ', type: 'whole' },
		]);
		// verses stays derivable from versesInfo (same order, text only).
		expect(first.verses).toEqual(first.versesInfo!.map((v) => v.text));
		// The syllabic type is now kept per verse, not only for the primary:
		const start = score.vocalLine.find((e) => e.id === 'm1-0-1')!.syllable!;
		expect(start.versesInfo).toEqual([
			{ verseNumber: 1, text: 'по', type: 'start' },
			{ verseNumber: 2, text: 'pʌ', type: 'start' },
		]);
	});

	it('recovers a verse across notes when verses diverge on a melisma (§A.95)', async () => {
		// Note 1: both verses sing. Note 2: verse 1 holds a melisma (no lyric),
		// verse 2 sings a new syllable, so verse 2 becomes note 2's primary.
		const sparse =
			'<score-partwise version="4.0">' +
			'<part-list><score-part id="P1"><part-name>Voice</part-name></score-part></part-list>' +
			'<part id="P1"><measure number="1">' +
			'<attributes><divisions>1</divisions><time><beats>2</beats><beat-type>4</beat-type></time>' +
			'<clef><sign>G</sign><line>2</line></clef></attributes>' +
			'<note><pitch><step>C</step><octave>4</octave></pitch><duration>1</duration><voice>1</voice><type>quarter</type>' +
			'<lyric number="1"><syllabic>single</syllabic><text>да</text></lyric>' +
			'<lyric number="2"><syllabic>single</syllabic><text>da</text></lyric></note>' +
			'<note><pitch><step>D</step><octave>4</octave></pitch><duration>1</duration><voice>1</voice><type>quarter</type>' +
			'<lyric number="2"><syllabic>single</syllabic><text>ла</text></lyric></note>' +
			'</measure></part></score-partwise>';
		const r = await parser.parse(xmlInput(sparse));
		expect(r.errors).toHaveLength(0);
		const [n1, n2] = r.score.vocalLine;
		// Note 1 carries both verses, each self-describing.
		expect(n1.syllable!.verseNumber).toBe(1);
		expect(n1.syllable!.versesInfo).toEqual([
			{ verseNumber: 1, text: 'да', type: 'whole' },
			{ verseNumber: 2, text: 'da', type: 'whole' },
		]);
		// Note 2: verse 2 is the primary here, and it carries its own verse
		// number, so verse 2 is recoverable across both notes (versesInfo entry
		// on note 1, primary on note 2). Single verse present, so no versesInfo.
		expect(n2.syllable!.verseNumber).toBe(2);
		expect(n2.syllable!.text).toBe('ла');
		expect(n2.syllable!.type).toBe('whole');
		expect(n2.syllable!.versesInfo).toBeUndefined();
	});

	it('encodes the melisma by absence and assigns wordContext across it', async () => {
		const { score } = await parseMain();
		const byId = new Map(score.vocalLine.map((e) => [e.id, e]));
		expect(byId.get('m1-1-4')!.syllable).toBeUndefined();
		for (const id of ['m1-0-1', 'm1-3-16', 'm1-3-8']) {
			expect(byId.get(id)!.syllable!.wordContext).toBe('погрузись');
		}
		expect(byId.get('m0-0-1')!.syllable!.wordContext).toBe('Ты');
	});

	it('resolves the tie chain to start and stop with partner ids', async () => {
		const { score } = await parseMain();
		const byId = new Map(score.vocalLine.map((e) => [e.id, e]));
		expect(byId.get('m1-3-8')!.tied).toEqual({ type: 'start', partnerEventId: 'm2-0-1' });
		expect(byId.get('m2-0-1')!.tied).toEqual({ type: 'stop', partnerEventId: 'm1-3-8' });
	});

	it('maps the breath-mark articulation', async () => {
		const { score } = await parseMain();
		expect(score.vocalLine.find((e) => e.id === 'm1-3-8')!.articulations).toEqual(['breath-mark']);
	});

	it('detects Russian from Cyrillic verse-1 text', async () => {
		const { score } = await parseMain();
		expect(score.source.languageHint).toBe('rus');
	});

	it('defaults provenance to musicxml-direct / native', async () => {
		const { score } = await parseMain();
		expect(score.source).toMatchObject({ format: 'musicxml', origin: 'musicxml-direct', fidelity: 'native' });
	});
});

describe('MusicXmlScoreParser: provenance from the software stamp', () => {
	it('reads homr, PDFtoMusic, and MuseScore origins', async () => {
		expect((await parseMain({ software: 'homr 0.6' })).score.source).toMatchObject({ origin: 'homr-musicxml-from-image', fidelity: 'medium' });
		expect((await parseMain({ software: 'PDFtoMusic Pro 1.7' })).score.source).toMatchObject({ origin: 'pdftomusic-pro-musicxml-from-vector-pdf', fidelity: 'high' });
		expect((await parseMain({ software: 'MuseScore 4.2' })).score.source).toMatchObject({ origin: 'musescore-cli-musicxml-from-mscz', fidelity: 'high' });
	});
});

describe('MusicXmlScoreParser: diagnostics and degraded sources', () => {
	it('warns when multiple parts carry lyrics and keeps the first', async () => {
		const r = await parseMain({ addSecondLyricPart: true });
		expect(r.warnings.some((w) => w.code === 'multiple-vocal-parts')).toBe(true);
		expect(r.score.vocalPart.partId).toBe('P1');
	});

	it('warns no-lyrics-found and still parses when nothing carries lyrics', async () => {
		const doc = `<score-partwise version="4.0"><part-list><score-part id="P1"><part-name>Melody</part-name></score-part></part-list>
      <part id="P1"><measure number="1"><attributes><divisions>4</divisions><time><beats>4</beats><beat-type>4</beat-type></time></attributes>
      <note><pitch><step>C</step><octave>4</octave></pitch><duration>16</duration><type>whole</type></note></measure></part></score-partwise>`;
		const r = await parser.parse(xmlInput(doc));
		expect(r.warnings.some((w) => w.code === 'no-lyrics-found')).toBe(true);
		expect(r.score.vocalLine).toHaveLength(1);
	});

	it('advances position across backup/forward and ignores chord tones', async () => {
		const doc = `<score-partwise version="4.0"><part-list><score-part id="P1"><part-name>V</part-name></score-part></part-list>
      <part id="P1"><measure number="1">
        <attributes><divisions>4</divisions><time><beats>2</beats><beat-type>4</beat-type></time></attributes>
        <note><pitch><step>C</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type>
          <lyric number="1"><syllabic>single</syllabic><text>a</text></lyric></note>
        <note><chord/><pitch><step>E</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type></note>
        <forward><duration>4</duration></forward>
      </measure></part></score-partwise>`;
		const r = await parser.parse(xmlInput(doc));
		expect(r.warnings.some((w) => w.code === 'unrecognised-element' && /[Cc]hord/.test(w.message))).toBe(true);
		expect(r.score.vocalLine.filter((e) => e.type === 'note')).toHaveLength(1);
		expect(r.score.vocalLine[0].id).toBe('m0-0-1');
	});

	it('splits an elided syllable pair into segments and flags it', async () => {
		const doc = `<score-partwise version="4.0"><part-list><score-part id="P1"><part-name>V</part-name></score-part></part-list>
      <part id="P1"><measure number="1"><attributes><divisions>4</divisions><time><beats>1</beats><beat-type>4</beat-type></time></attributes>
        <note><pitch><step>C</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type>
          <lyric number="1"><syllabic>end</syllabic><text>ко</text><elision>‿</elision><syllabic>begin</syllabic><text>я</text></lyric>
        </note></measure></part></score-partwise>`;
		const r = await parser.parse(xmlInput(doc));
		expect(r.warnings.some((w) => w.code === 'unrecognised-element' && /[Ee]lided/.test(w.message))).toBe(true);
		const s = r.score.vocalLine[0].syllable!;
		expect(s.text).toBe('ко‿я');
		expect(s.parseFlag).toBe('elided');
		expect(s.segments).toEqual([
			{ text: 'ко', type: 'end' },
			{ text: 'я', type: 'start' },
		]);
	});

	it('drops a note with an unreadable duration as a non-fatal error', async () => {
		const doc = `<score-partwise version="4.0"><part-list><score-part id="P1"><part-name>V</part-name></score-part></part-list>
      <part id="P1"><measure number="1"><attributes><divisions>4</divisions><time><beats>2</beats><beat-type>4</beat-type></time></attributes>
        <note><pitch><step>C</step><octave>4</octave></pitch><type>quarter</type>
          <lyric number="1"><syllabic>single</syllabic><text>x</text></lyric></note>
        <note><pitch><step>D</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type>
          <lyric number="1"><syllabic>single</syllabic><text>y</text></lyric></note>
      </measure></part></score-partwise>`;
		const r = await parser.parse(xmlInput(doc));
		expect(r.errors.some((e) => !e.fatal && e.code === 'invalid-musicxml')).toBe(true);
		expect(r.score.vocalLine.filter((e) => e.type === 'note')).toHaveLength(1);
	});

	it('reads tempo from <sound> when <metronome> is absent', async () => {
		const doc = `<score-partwise version="4.0"><part-list><score-part id="P1"><part-name>V</part-name></score-part></part-list>
      <part id="P1"><measure number="1"><attributes><divisions>4</divisions><time><beats>2</beats><beat-type>4</beat-type></time></attributes>
        <direction><sound tempo="88"/></direction>
        <note><pitch><step>C</step><octave>4</octave></pitch><duration>8</duration><type>half</type>
          <lyric number="1"><syllabic>single</syllabic><text>a</text></lyric></note>
      </measure></part></score-partwise>`;
		const r = await parser.parse(xmlInput(doc));
		expect(r.score.tempoMarkings[0]).toMatchObject({ bpm: 88, beatUnit: 'quarter' });
	});

	it('warns measure-duration-mismatch on an underfilled interior measure', async () => {
		const doc = `<score-partwise version="4.0"><part-list><score-part id="P1"><part-name>V</part-name></score-part></part-list>
      <part id="P1">
        <measure number="1"><attributes><divisions>4</divisions><time><beats>3</beats><beat-type>4</beat-type></time></attributes>
          <note><pitch><step>C</step><octave>4</octave></pitch><duration>12</duration><type>half</type><dot/>
            <lyric number="1"><syllabic>single</syllabic><text>a</text></lyric></note></measure>
        <measure number="2">
          <note><pitch><step>D</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type>
            <lyric number="1"><syllabic>single</syllabic><text>b</text></lyric></note></measure>
      </part></score-partwise>`;
		const r = await parser.parse(xmlInput(doc));
		expect(r.warnings.some((w) => w.code === 'measure-duration-mismatch' && w.location?.measureIndex === 1)).toBe(true);
	});
});

describe('MusicXmlScoreParser: work metadata (§A.6/§A.16)', () => {
	const HEADER_DOC = (header: string): string => `<score-partwise version="4.0">
      ${header}
      <part-list><score-part id="P1"><part-name>V</part-name></score-part></part-list>
      <part id="P1"><measure number="1"><attributes><divisions>4</divisions><time><beats>1</beats><beat-type>4</beat-type></time></attributes>
        <note><pitch><step>C</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type>
          <lyric number="1"><syllabic>single</syllabic><text>a</text></lyric></note></measure></part></score-partwise>`;

	it('extracts title, opus, and typed creators (the Gretchen header shape)', async () => {
		const r = await parser.parse(xmlInput(HEADER_DOC(`
      <work><work-title>Gretchen am Spinnrade</work-title><work-number>Op. 2, D. 118</work-number></work>
      <identification>
        <creator type="composer">Franz Schubert</creator>
        <creator type="lyricist">Johann Wolfgang von Goethe</creator>
        <creator type="arranger">Transcribed by bradleykunda</creator>
      </identification>`)));
		expect(r.score.workMetadata).toEqual({
			title: 'Gretchen am Spinnrade',
			opus: 'Op. 2, D. 118',
			composer: 'Franz Schubert',
			poet: 'Johann Wolfgang von Goethe',
			arranger: 'Transcribed by bradleykunda',
		});
	});

	it('falls back to movement-title and maps poet and translator creator types', async () => {
		const r = await parser.parse(xmlInput(HEADER_DOC(`
      <movement-title>Ты помнишь ли вечер</movement-title>
      <identification>
        <creator type="poet">Алексей Толстой</creator>
        <creator type="translator">Dann Mitton</creator>
      </identification>`)));
		expect(r.score.workMetadata).toEqual({
			title: 'Ты помнишь ли вечер',
			poet: 'Алексей Толстой',
			translator: 'Dann Mitton',
		});
	});

	it('joins multiple creators of one type and skips empty elements', async () => {
		const r = await parser.parse(xmlInput(HEADER_DOC(`
      <identification>
        <creator type="composer">A. Composer</creator>
        <creator type="composer">B. Composer</creator>
        <creator type="lyricist">   </creator>
      </identification>`)));
		expect(r.score.workMetadata).toEqual({ composer: 'A. Composer, B. Composer' });
	});

	it('leaves workMetadata absent when the header carries nothing (main fixture)', async () => {
		const r = await parseMain();
		expect(r.score.workMetadata).toBeUndefined();
	});
});

describe('MusicXmlScoreParser: clefs (v37 §A.17)', () => {
	it('captures the main fixture treble clef and snapshots it onto every measure', async () => {
		const r = await parseMain();
		expect(r.score.clefs).toEqual([{ measureIndex: 0, clef: { sign: 'G', line: 2 } }]);
		expect(r.score.measures[0].clef).toEqual({ sign: 'G', line: 2 });
		expect(r.score.measures[2].clef).toEqual({ sign: 'G', line: 2 });
	});

	it('captures a bass clef with octave change (treble-with-8 pattern)', async () => {
		const doc = `<score-partwise version="4.0"><part-list><score-part id="P1"><part-name>V</part-name></score-part></part-list>
      <part id="P1"><measure number="1"><attributes><divisions>4</divisions><time><beats>1</beats><beat-type>4</beat-type></time>
        <clef><sign>G</sign><line>2</line><clef-octave-change>-1</clef-octave-change></clef></attributes>
        <note><pitch><step>C</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type>
          <lyric number="1"><syllabic>single</syllabic><text>a</text></lyric></note></measure></part></score-partwise>`;
		const r = await parser.parse(xmlInput(doc));
		expect(r.score.clefs).toEqual([{ measureIndex: 0, clef: { sign: 'G', line: 2, octaveChange: -1 } }]);
	});

	it('defaults the line by sign when <line> is absent (F → 4)', async () => {
		const doc = `<score-partwise version="4.0"><part-list><score-part id="P1"><part-name>V</part-name></score-part></part-list>
      <part id="P1"><measure number="1"><attributes><divisions>4</divisions><time><beats>1</beats><beat-type>4</beat-type></time>
        <clef><sign>F</sign></clef></attributes>
        <note><pitch><step>C</step><octave>3</octave></pitch><duration>4</duration><type>quarter</type>
          <lyric number="1"><syllabic>single</syllabic><text>a</text></lyric></note></measure></part></score-partwise>`;
		const r = await parser.parse(xmlInput(doc));
		expect(r.score.clefs).toEqual([{ measureIndex: 0, clef: { sign: 'F', line: 4 } }]);
	});

	it('records a mid-score clef change and snapshots each measure with its own clef', async () => {
		const doc = `<score-partwise version="4.0"><part-list><score-part id="P1"><part-name>V</part-name></score-part></part-list>
      <part id="P1">
        <measure number="1"><attributes><divisions>4</divisions><time><beats>1</beats><beat-type>4</beat-type></time>
          <clef><sign>F</sign><line>4</line></clef></attributes>
          <note><pitch><step>C</step><octave>3</octave></pitch><duration>4</duration><type>quarter</type>
            <lyric number="1"><syllabic>single</syllabic><text>a</text></lyric></note></measure>
        <measure number="2"><attributes><clef><sign>G</sign><line>2</line></clef></attributes>
          <note><pitch><step>C</step><octave>5</octave></pitch><duration>4</duration><type>quarter</type>
            <lyric number="1"><syllabic>single</syllabic><text>b</text></lyric></note></measure>
      </part></score-partwise>`;
		const r = await parser.parse(xmlInput(doc));
		expect(r.score.clefs).toEqual([
			{ measureIndex: 0, clef: { sign: 'F', line: 4 } },
			{ measureIndex: 1, clef: { sign: 'G', line: 2 } },
		]);
		expect(r.score.measures[0].clef).toEqual({ sign: 'F', line: 4 });
		expect(r.score.measures[1].clef).toEqual({ sign: 'G', line: 2 });
	});

	it('takes the staff-1 clef from a numbered multi-staff attributes block', async () => {
		const doc = `<score-partwise version="4.0"><part-list><score-part id="P1"><part-name>V</part-name></score-part></part-list>
      <part id="P1"><measure number="1"><attributes><divisions>4</divisions><time><beats>1</beats><beat-type>4</beat-type></time>
        <clef number="2"><sign>F</sign><line>4</line></clef><clef number="1"><sign>G</sign><line>2</line></clef></attributes>
        <note><pitch><step>C</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type>
          <lyric number="1"><syllabic>single</syllabic><text>a</text></lyric></note></measure></part></score-partwise>`;
		const r = await parser.parse(xmlInput(doc));
		expect(r.score.clefs).toEqual([{ measureIndex: 0, clef: { sign: 'G', line: 2 } }]);
	});

	it('warns on an unsupported clef sign and leaves clefs empty', async () => {
		const doc = `<score-partwise version="4.0"><part-list><score-part id="P1"><part-name>V</part-name></score-part></part-list>
      <part id="P1"><measure number="1"><attributes><divisions>4</divisions><time><beats>1</beats><beat-type>4</beat-type></time>
        <clef><sign>percussion</sign></clef></attributes>
        <note><pitch><step>C</step><octave>4</octave></pitch><duration>4</duration><type>quarter</type>
          <lyric number="1"><syllabic>single</syllabic><text>a</text></lyric></note></measure></part></score-partwise>`;
		const r = await parser.parse(xmlInput(doc));
		expect(r.warnings.some((w) => w.code === 'unrecognised-element' && /clef sign/i.test(w.message))).toBe(true);
		expect(r.score.clefs).toEqual([]);
		expect(r.score.measures[0].clef).toBeUndefined();
	});
});


describe('barline capture (repeats and voltas)', () => {
  const ATTRS =
    '<attributes><divisions>1</divisions><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>';
  const note = (t: string) =>
    `<note><pitch><step>C</step><octave>4</octave></pitch><duration>4</duration><voice>1</voice><type>whole</type><lyric number="1"><syllabic>single</syllabic><text>${t}</text></lyric></note>`;
  const wrap = (measures: string) =>
    `<?xml version="1.0" encoding="UTF-8"?><score-partwise version="4.0"><part-list><score-part id="P1"><part-name>Voice</part-name></score-part></part-list><part id="P1">${measures}</part></score-partwise>`;
  const seq = (r: UnfoldResult) =>
    r.ok ? r.order.map((o) => `${o.source}.${o.pass}`).join(' ') : `FLAG:${r.flag.code}`;

  it('captures a simple repeat and unfolds it', async () => {
    const r = await parser.parse(
      xmlInput(
        wrap(
          `<measure number="1">${ATTRS}${note('a')}</measure>` +
            `<measure number="2"><barline location="left"><repeat direction="forward"/></barline>${note('b')}</measure>` +
            `<measure number="3">${note('c')}<barline location="right"><repeat direction="backward"/></barline></measure>`
        )
      )
    );
    const m = r.score.measures;
    expect(m[1].repeatStart).toBe(true);
    expect(m[2].repeatEnd).toBe(true);
    expect(seq(unfold(markersFromMeasures(m)))).toBe('0.1 1.1 2.1 1.2 2.2');
  });

  it('captures a two-ending volta and unfolds it', async () => {
    const r = await parser.parse(
      xmlInput(
        wrap(
          `<measure number="1">${ATTRS}${note('a')}</measure>` +
            `<measure number="2"><barline location="left"><repeat direction="forward"/></barline>${note('b')}</measure>` +
            `<measure number="3"><barline location="left"><ending number="1" type="start"/></barline>${note('c')}<barline location="right"><ending number="1" type="stop"/><repeat direction="backward"/></barline></measure>` +
            `<measure number="4"><barline location="left"><ending number="2" type="start"/></barline>${note('d')}<barline location="right"><ending number="2" type="stop"/></barline></measure>`
        )
      )
    );
    const m = r.score.measures;
    expect(m[1].repeatStart).toBe(true);
    expect(m[2].ending?.passes).toEqual([1]);
    expect(m[2].ending?.startsHere).toBe(true);
    expect(m[2].ending?.endsHere).toBe(true);
    expect(m[2].repeatEnd).toBe(true);
    expect(m[3].ending?.passes).toEqual([2]);
    expect(seq(unfold(markersFromMeasures(m)))).toBe('0.1 1.1 2.1 1.2 3.2');
  });
});

describe('jump capture (D.C., D.S., coda, fine from <sound>)', () => {
  const ATTRS =
    '<attributes><divisions>1</divisions><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>';
  const note = (t: string) =>
    `<note><pitch><step>C</step><octave>4</octave></pitch><duration>4</duration><voice>1</voice><type>whole</type><lyric number="1"><syllabic>single</syllabic><text>${t}</text></lyric></note>`;
  const wrap = (measures: string) =>
    `<?xml version="1.0" encoding="UTF-8"?><score-partwise version="4.0"><part-list><score-part id="P1"><part-name>Voice</part-name></score-part></part-list><part id="P1">${measures}</part></score-partwise>`;
  const seq = (r: UnfoldResult) =>
    r.ok ? r.order.map((o) => `${o.source}.${o.pass}`).join(' ') : `FLAG:${r.flag.code}`;

  it('captures a bare <sound> D.C. al Fine and unfolds it', async () => {
    const r = await parser.parse(
      xmlInput(
        wrap(
          `<measure number="1">${ATTRS}${note('a')}</measure>` +
            `<measure number="2">${note('b')}<sound fine="yes"/></measure>` +
            `<measure number="3">${note('c')}<sound dacapo="yes"/></measure>`
        )
      )
    );
    const m = r.score.measures;
    expect(m[1].jump?.fine).toBe(true);
    expect(m[2].jump?.daCapo).toBe(true);
    expect(seq(unfold(markersFromMeasures(m)))).toBe('0.1 1.1 2.1 0.2 1.2');
  });

  it('captures a direction-wrapped <sound> D.C. al Coda (words + sound), and does not flag mark-without-sound', async () => {
    const r = await parser.parse(
      xmlInput(
        wrap(
          `<measure number="1">${ATTRS}${note('a')}</measure>` +
            `<measure number="2">${note('b')}<direction placement="above"><direction-type><words>To Coda</words></direction-type><sound tocoda="c1"/></direction></measure>` +
            `<measure number="3">${note('c')}<direction><direction-type><words>D.C. al Coda</words></direction-type><sound dacapo="yes"/></direction></measure>` +
            `<measure number="4">${note('d')}<direction><direction-type><coda/></direction-type><sound coda="c1"/></direction></measure>`
        )
      )
    );
    const m = r.score.measures;
    expect(m[1].jump?.toCoda).toBe('c1');
    expect(m[1].jump?.markWithoutSound).toBeUndefined();
    expect(m[2].jump?.daCapo).toBe(true);
    expect(m[3].jump?.coda).toBe('c1');
    expect(seq(unfold(markersFromMeasures(m)))).toBe('0.1 1.1 2.1 0.2 1.2 3.1');
  });

  it('captures a D.S. al Fine and unfolds it', async () => {
    const r = await parser.parse(
      xmlInput(
        wrap(
          `<measure number="1">${ATTRS}${note('a')}</measure>` +
            `<measure number="2">${note('b')}<sound segno="s1"/></measure>` +
            `<measure number="3">${note('c')}<sound fine="yes"/></measure>` +
            `<measure number="4">${note('d')}<sound dalsegno="s1"/></measure>`
        )
      )
    );
    const m = r.score.measures;
    expect(m[1].jump?.segno).toBe('s1');
    expect(m[3].jump?.dalSegno).toBe('s1');
    expect(seq(unfold(markersFromMeasures(m)))).toBe('0.1 1.1 2.1 3.1 1.2 2.2');
  });

  it('captures repeat after-jump and flags it in unfolding', async () => {
    const r = await parser.parse(
      xmlInput(
        wrap(
          `<measure number="1">${ATTRS}<barline location="left"><repeat direction="forward"/></barline>${note('a')}</measure>` +
            `<measure number="2">${note('b')}<barline location="right"><repeat direction="backward" after-jump="yes"/></barline></measure>` +
            `<measure number="3">${note('c')}<sound fine="yes"/></measure>` +
            `<measure number="4">${note('d')}<sound dacapo="yes"/></measure>`
        )
      )
    );
    const m = r.score.measures;
    expect(m[1].repeatAfterJump).toBe(true);
    expect(seq(unfold(markersFromMeasures(m)))).toBe('FLAG:after-jump-unsupported');
  });

  it('records a printed jump mark with no <sound> and flags it rather than guessing', async () => {
    const r = await parser.parse(
      xmlInput(
        wrap(
          `<measure number="1">${ATTRS}${note('a')}</measure>` +
            `<measure number="2">${note('b')}<direction><direction-type><words>D.C. al Fine</words></direction-type></direction></measure>`
        )
      )
    );
    const m = r.score.measures;
    expect(m[1].jump?.markWithoutSound).toBe(true);
    expect(seq(unfold(markersFromMeasures(m)))).toBe('FLAG:jump-mark-without-sound');
  });

  it('does not create a jump from a tempo-only <sound>', async () => {
    const r = await parser.parse(
      xmlInput(
        wrap(
          `<measure number="1">${ATTRS}${note('a')}<direction><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>96</per-minute></metronome></direction-type><sound tempo="96"/></direction></measure>`
        )
      )
    );
    expect(r.score.measures[0].jump).toBeUndefined();
  });
});

// ── N.97b: `<note id>` carried through from the page reader ─────────
//
// The reader's ids are the singer's correction keys. Everything here is about
// the one property that matters: no two events may ever share an id, whatever
// the file says. See `resolveSuppliedIds` in the parser.

describe('MusicXmlScoreParser: supplied <note id> attributes (N.97b)', () => {
	const ATTRS =
		'<attributes><divisions>1</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>';
	/** One quarter note, with an id or deliberately without one. */
	const q = (id: string | null, step = 'C') =>
		`<note${id === null ? '' : ` id="${id}"`}><pitch><step>${step}</step><octave>4</octave></pitch>` +
		`<duration>1</duration><voice>1</voice><type>quarter</type>` +
		`<lyric number="1"><syllabic>single</syllabic><text>ла</text></lyric></note>`;
	const wrap = (measures: string) =>
		`<?xml version="1.0" encoding="UTF-8"?><score-partwise version="4.0">` +
		`<part-list><score-part id="P1"><part-name>Voice</part-name></score-part></part-list>` +
		`<part id="P1">${measures}</part></score-partwise>`;
	const oneMeasure = (notes: string) => wrap(`<measure number="1">${ATTRS}${notes}</measure>`);
	const ids = (r: ParseResult) => r.score.vocalLine.map((e) => e.id);

	it('honours a supplied id and falls back to its own where a note has none', async () => {
		const r = await parser.parse(
			xmlInput(oneMeasure(q('r0-100') + q(null) + q('r0-300') + q('r0-400'))),
		);
		expect(ids(r)).toEqual(['r0-100', 'm0-1-4', 'r0-300', 'r0-400']);
		expect(r.warnings).toHaveLength(0);
	});

	it('leaves a document with no ids exactly where it was: the cursor ids, unchanged', async () => {
		const r = await parser.parse(xmlInput(oneMeasure(q(null) + q(null) + q(null) + q(null))));
		expect(ids(r)).toEqual(['m0-0-1', 'm0-1-4', 'm0-1-2', 'm0-3-4']);
		expect(r.warnings).toHaveLength(0);
	});

	it('refuses every supplied id on ONE duplicate, anywhere in the part, and warns', async () => {
		// The duplicate is in the second measure; the first measure's ids are
		// perfectly good and are refused anyway, because a line half-keyed to ink
		// and half to a cursor is the worst of both.
		const r = await parser.parse(
			xmlInput(
				wrap(
					`<measure number="1">${ATTRS}${q('r0-100')}${q('r0-200')}${q('r0-300')}${q('r0-400')}</measure>` +
						`<measure number="2">${q('r1-100')}${q('r1-100')}${q('r1-300')}${q('r1-400')}</measure>`,
				),
			),
		);
		expect(ids(r)).toEqual([
			'm0-0-1',
			'm0-1-4',
			'm0-1-2',
			'm0-3-4',
			'm1-0-1',
			'm1-1-4',
			'm1-1-2',
			'm1-3-4',
		]);
		const warned = r.warnings.filter((w) => w.code === 'duplicate-note-ids');
		expect(warned).toHaveLength(1);
		expect(warned[0].message).toContain('r1-100');
		// Every id is still unique, which is the whole point of refusing.
		expect(new Set(ids(r)).size).toBe(ids(r).length);
	});

	it('refuses a supplied id shaped like a generated one, which could collide with a neighbour', async () => {
		// `m0-1-2` is exactly what the third note would have been given for free.
		// Nothing about the SUPPLIED ids is duplicated here; the collision would
		// have been with a generated id, which is why the shape itself is refused.
		const r = await parser.parse(
			xmlInput(oneMeasure(q('m0-1-2') + q('r0-200') + q(null) + q('r0-400'))),
		);
		expect(ids(r)).toEqual(['m0-0-1', 'm0-1-4', 'm0-1-2', 'm0-3-4']);
		const warned = r.warnings.filter((w) => w.code === 'duplicate-note-ids');
		expect(warned).toHaveLength(1);
		expect(warned[0].message).toContain('m0-1-2');
		expect(new Set(ids(r)).size).toBe(ids(r).length);
	});

	it('keeps a supplied id still when an EARLIER event in its measure is removed', async () => {
		// This is the fragility the carry-through exists to remove. The parser's
		// own id is a running duration cursor, so dropping the second note renames
		// the two after it; a supplied id is a property of the ink and does not move.
		const withIds = async (notes: string) => ids(await parser.parse(xmlInput(oneMeasure(notes))));
		const four = q('r0-100') + q('r0-200') + q('r0-300') + q('r0-400');
		const three = q('r0-100') + q('r0-300') + q('r0-400');
		expect(await withIds(four)).toEqual(['r0-100', 'r0-200', 'r0-300', 'r0-400']);
		expect(await withIds(three)).toEqual(['r0-100', 'r0-300', 'r0-400']);

		// The counterfactual, in the same measure with the ids stripped: the last
		// note is `m0-3-4` before the removal and `m0-1-2` after it, so a
		// correction keyed to it would have stopped landing.
		const bare = (n: number) => Array.from({ length: n }, () => q(null)).join('');
		expect((await withIds(bare(4))).at(-1)).toBe('m0-3-4');
		expect((await withIds(bare(3))).at(-1)).toBe('m0-1-2');
	});

	it('links a tie by the supplied ids, not by the ids they replaced', async () => {
		const tied = (id: string, type: 'start' | 'stop') =>
			`<note id="${id}"><pitch><step>G</step><octave>4</octave></pitch><duration>4</duration>` +
			`<voice>1</voice><type>whole</type><tie type="${type}"/>` +
			`<notations><tied type="${type}"/></notations>` +
			`<lyric number="1"><syllabic>single</syllabic><text>ла</text></lyric></note>`;
		const r = await parser.parse(
			xmlInput(
				wrap(
					`<measure number="1">${ATTRS}${tied('r0-100', 'start')}</measure>` +
						`<measure number="2">${tied('r1-100', 'stop')}</measure>`,
				),
			),
		);
		expect(r.score.vocalLine.map((e) => e.id)).toEqual(['r0-100', 'r1-100']);
		expect(r.score.vocalLine[0].tied).toEqual({ type: 'start', partnerEventId: 'r1-100' });
		expect(r.score.vocalLine[1].tied).toEqual({ type: 'stop', partnerEventId: 'r0-100' });
	});

	it('ignores ids on grace notes and chord tones, which never become events', async () => {
		// Both are skipped by `readNote`, so their ids are not on the vocal line
		// and a duplicate among them costs the real notes nothing.
		const grace = `<note id="dup"><grace/><pitch><step>D</step><octave>4</octave></pitch><voice>1</voice><type>eighth</type></note>`;
		const chordTone = `<note id="dup"><chord/><pitch><step>E</step><octave>4</octave></pitch><duration>1</duration><voice>1</voice><type>quarter</type></note>`;
		const r = await parser.parse(
			xmlInput(oneMeasure(grace + q('r0-100') + chordTone + q('r0-200') + q('r0-300') + q('r0-400'))),
		);
		expect(ids(r)).toEqual(['r0-100', 'r0-200', 'r0-300', 'r0-400']);
		expect(r.warnings.some((w) => w.code === 'duplicate-note-ids')).toBe(false);
	});
});
