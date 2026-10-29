/**
 * No test of Ilya rests on a file that breaks the rule (N.135 stage 2b r5, step 8;
 * `CONTRACT.md` §0.1, ONE VOWEL PER NOTE, Dann 2026-10-29 01:18).
 *
 * Two checks, over what is tracked (`git ls-files`):
 *
 * 1. THE RULE. Every tracked MusicXML with Cyrillic lyrics, and every tracked
 *    truth extract, has one vowel on each note of each verse that holds a
 *    Cyrillic letter (`vowelsPerNote`, step 6), and no note anywhere, IPA verse
 *    included, whose text is a mark alone (`#` above all: "An isolated octothrope
 *    is not possible or permissible", Dann 2026-10-29 01:44). A breach that is
 *    not on `ALLOWED` fails. Each entry names the test that needs the breach and
 *    why; an entry that matches no breach fails too, so the list cannot go stale.
 *
 * 2. THE SOURCE. A fixture with a tracked truth extract for the same song is
 *    compared with it note by note (bar, onset, pitch, verse 1 text and syllabic,
 *    verse 2 text and syllabic). A one-vowel check misses a stretch shifted by one
 *    note where every note still holds one vowel (the first repair of the Sunless 1
 *    IPA verse was shifted from bar 4 and broke the rule only at bar 5). Any
 *    difference fails (every bar: step 10 repaired bars 17 and 18 as printed).
 *
 * The 16 truth files under `tools/e16-harness/output/truth/` are not tracked
 * (`tools/e16-harness/.gitignore:2`) and are not read from a test.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { isCyrillicVerse, vowelsPerNote } from '$lib/omr/vowels-per-note';

const ROOT = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: process.cwd() }).toString().trim();
const TRACKED = execFileSync('git', ['ls-files', '-z'], { cwd: ROOT }).toString().split('\0').filter(Boolean);
const FIXTURES = 'apps/web/src/lib/score/ingestion/fixtures';
const SUNLESS = `${FIXTURES}/sunless-01-engraved.musicxml`;
const LONE_V = `${FIXTURES}/sunless-01-finale-lone-v.musicxml`;
const BACKUP = `${FIXTURES}/sunless-01-engraved.musicxml.bak-before-ja-2026-09-20`;
const N188 = 'packages/score-parser/src/fixtures/n188-markings.musicxml';
const TRUTH = `${FIXTURES}/truth-sunless-01-underlay_2026-10-29.json`;

const read = (file: string) => readFileSync(join(ROOT, file), 'utf8');

// ── The lyrics of a MusicXML ───────────────────────────────────────

interface LyricNote {
	file: string;
	bar: number;
	/** The note's ordinal in the file, rests and chords counted as notes. */
	index: number;
	verse: number;
	text: string;
	syllabic: string;
	continuation: boolean;
}

/** Every `<lyric>` of every note of a MusicXML text, in document order. */
export function lyricNotes(file: string, xml: string): LyricNote[] {
	const out: LyricNote[] = [];
	let index = 0;
	for (const m of xml.matchAll(/<measure\b[^>]*?number="(\d+)"[^>]*>([\s\S]*?)<\/measure>/g)) {
		const bar = Number(m[1]);
		for (const n of m[2].matchAll(/<note\b[\s\S]*?<\/note>/g)) {
			index++;
			const continuation = /<tie\s[^>]*type="(?:stop|continue)"/.test(n[0]) || /<tied\s[^>]*type="(?:stop|continue)"/.test(n[0]);
			for (const l of n[0].matchAll(/<lyric\b([^>]*)>([\s\S]*?)<\/lyric>/g)) {
				const verse = Number(/number="(\d+)"/.exec(l[1])?.[1] ?? 1);
				const text = [...l[2].matchAll(/<text\b[^>]*>([^<]*)<\/text>/g)].map((t) => t[1]).join('');
				out.push({ file, bar, index, verse, text, syllabic: /<syllabic>([^<]*)<\/syllabic>/.exec(l[2])?.[1] ?? '', continuation });
			}
		}
	}
	return out;
}

/** The breaches of a list of lyric notes, as `file | bar | verse | text | kind`. */
function breachesOf(notes: LyricNote[]): Breach[] {
	const out: Breach[] = [];
	for (const verse of [...new Set(notes.map((n) => n.verse))]) {
		const mine = notes.filter((n) => n.verse === verse);
		for (const b of vowelsPerNote(mine.map((n, i) => ({ id: i, text: n.text, continuation: n.continuation })), { vowelCount: isCyrillicVerse(mine.map((n) => n.text)) })) {
			out.push({ file: mine[0].file, bar: mine[b.id as number].bar, verse, text: b.text, kind: b.kind });
		}
	}
	return out;
}

interface Breach {
	file: string;
	bar: number;
	verse: number;
	text: string;
	kind: string;
}

// ── The allow-list ─────────────────────────────────────────────────

interface Allowed extends Partial<Breach> {
	file: string;
	/** The test that needs the breach, or null where no test reads the file. */
	test: string | null;
	reason: string;
}

const SHIFTED_READERS =
	'score-seat.test.ts (the three tests of the fold), punctuation-slot.test.ts ("the fold carries the punctuation once"), seated-text.test.ts, waiting-seat.test.ts, several-lines.test.ts ("without the re-key, the fold\'s 60 seats"), replace-seat.test.ts (it splits the eighth m17-5-8 that only the copy has), phrase-ends.test.ts (test g and the sevens case of i), score/typed-words-land.test.ts (LIMIT 1 and LIMIT 3)';

const ALLOWED: Allowed[] = [
	{
		file: LONE_V,
		bar: 8,
		verse: 1,
		text: 'в',
		kind: 'no-vowel',
		test: 'apps/web/src/lib/score/clitic-seat.test.ts',
		reason: `Sunless 1 as Finale printed it, kept byte for byte when sunless-01-engraved.musicxml was repaired. N.111's proof needs «в» alone on a note (the fold seats it with its host and moves the 60 notes after it). The other readers that stay on the copy (${SHIFTED_READERS}) each exist for something only the copy holds: the lone «в» and the clitic fold, N.156's «я.» eighth, or the 39-token layout. Every other reader reads the repaired file (step 10).`,
	},
	{
		file: LONE_V,
		verse: 2,
		text: '#',
		kind: 'mark-alone',
		test: 'apps/web/src/lib/analysis/diction-fold-live.test.ts',
		reason: 'N.171\'s fold repairs a `#` the file left on a note of its own; the test "folds both marks in verse 2 onto the syllable before them" needs those two marks (bar 5 and a second). Octothropes are enclitics (Dann 2026-10-29 01:44); this copy is the only file that still has them alone.',
	},
	{
		file: N188,
		bar: 1,
		verse: 1,
		text: 'знь',
		kind: 'no-vowel',
		test: 'packages/score-parser/src/n188-markings.test.ts',
		reason: 'A breach this test does NOT need. The file is a hand-written slur, fermata, and arc fixture; no assertion reads its lyric text (the test reads `<lyric>` only as the syllables the slurs sit on). Reported to the desk and left unchanged, as the brief directs.',
	},
	{
		file: N188,
		bar: 4,
		verse: 1,
		text: 'в',
		kind: 'no-vowel',
		test: 'packages/score-parser/src/n188-markings.test.ts',
		reason: 'As above: not needed by the test; reported and left unchanged.',
	},
	{
		file: BACKUP,
		test: null,
		reason: 'A backup of the fixture before the «я» change of 2026-09-20 (the same lone «в»), kept by name; no test reads it. Reported to the desk with a question whether to keep it.',
	},
];

/** The sources of truth the fixtures are compared with. */
const PAIRS = [{ fixture: SUNLESS, truth: TRUTH }];

describe('the tracked files', () => {
	const candidates = TRACKED.filter((f) => /\.(musicxml|xml)(\.|$)/i.test(f));
	const withCyrillicLyrics = candidates.filter((f) => {
		const text = read(f);
		return text.includes('<lyric') && /[Ѐ-ӿ]/u.test(text);
	});

	it('finds the lyric-bearing MusicXML it is meant to check, the repaired fixture and its copy among them', () => {
		expect(withCyrillicLyrics).toContain(SUNLESS);
		expect(withCyrillicLyrics).toContain(LONE_V);
		expect(withCyrillicLyrics).toContain(N188);
		expect(withCyrillicLyrics.length).toBeGreaterThanOrEqual(7);
	});

	const found = withCyrillicLyrics.flatMap((f) => breachesOf(lyricNotes(f, read(f))));
	const matches = (a: Allowed, b: Breach) => a.file === b.file && (a.bar === undefined || a.bar === b.bar) && (a.verse === undefined || a.verse === b.verse) && (a.text === undefined || a.text === b.text) && (a.kind === undefined || a.kind === b.kind);

	it('has no breach of one vowel per note, and no note with a mark alone, that is not on the allow-list', () => {
		const loose = found.filter((b) => !ALLOWED.some((a) => matches(a, b)));
		expect(loose.map((b) => `${b.file} bar ${b.bar} verse ${b.verse} «${b.text}» ${b.kind}`)).toEqual([]);
	});

	it('has an allow-list with no stale entry: each matches a breach, and names a test that is tracked or says no test reads the file', () => {
		for (const a of ALLOWED) {
			expect(found.some((b) => matches(a, b)), `${a.file} ${JSON.stringify(a)}`).toBe(true);
			if (a.test !== null) expect(TRACKED, a.test).toContain(a.test);
			expect(a.reason.length).toBeGreaterThan(20);
		}
	});

	it('finds the repaired fixture clean: no breach in either verse', () => {
		expect(found.filter((b) => b.file === SUNLESS)).toEqual([]);
	});

	it('finds the old lone «в» and the two lone «#» in the copy (positive control: the check sees what it is meant to)', () => {
		const copy = found.filter((b) => b.file === LONE_V);
		expect(copy.filter((b) => b.verse === 1).map((b) => [b.bar, b.text, b.kind])).toEqual([[8, 'в', 'no-vowel']]);
		expect(copy.filter((b) => b.verse === 2).map((b) => b.kind)).toEqual(['mark-alone', 'mark-alone']);
	});

	it('lets no allow-list entry permit a lone «#» in the repaired fixture or in any file but the copy', () => {
		for (const a of ALLOWED.filter((x) => x.kind === 'mark-alone' || x.text === '#')) expect(a.file).toBe(LONE_V);
	});

	it('checks the tracked truth extract too: Cyrillic verse 1 one vowel per note, verse 2 no mark alone', () => {
		const truthFiles = TRACKED.filter((f) => /(^|\/)truth-[^/]*\.json$/.test(f));
		expect(truthFiles).toContain(TRUTH);
		let checked = 0;
		for (const f of truthFiles) {
			const notes = (JSON.parse(read(f)) as { notes?: { bar: number; verse1?: string; verse2?: string }[] }).notes;
			// Only an extract of this shape (`notes` with `verse1`): any other tracked file named truth-* is not one.
			if (!notes?.every((n) => 'verse1' in n)) continue;
			checked++;
			for (const verse of ['verse1', 'verse2'] as const) {
				const texts = notes.map((n) => n[verse] ?? null);
				const bad = vowelsPerNote(texts.map((text, id) => ({ id, text })), { vowelCount: isCyrillicVerse(texts) });
				expect(bad.map((b) => `${f} bar ${notes[b.id as number].bar} ${verse} «${b.text}» ${b.kind}`)).toEqual([]);
			}
		}
		expect(checked).toBeGreaterThanOrEqual(1);
	});
});

// ── The source ─────────────────────────────────────────────────────

const STEP: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
/** A fraction of a whole note as «n/d», lowest terms. */
const frac = (n: number, d: number): string => {
	const g = gcd(Math.abs(n), d) || 1;
	return `${n / g}/${d / g}`;
};

interface VoiceNote {
	bar: number;
	onset: string;
	midi: number;
	verse1: string;
	syllabic1: string;
	verse2: string;
	syllabic2: string;
}

/** The sung notes of part P1, in document order, with bar, onset (a fraction of a whole note), pitch, and both verses. */
export function voiceNotesOf(xml: string): VoiceNote[] {
	const start = xml.indexOf('<part id="P1">');
	const part = xml.slice(start, xml.indexOf('</part>', start));
	const out: VoiceNote[] = [];
	let divisions = 0;
	for (const m of part.matchAll(/<measure\b[^>]*?number="(\d+)"[^>]*>([\s\S]*?)<\/measure>/g)) {
		let t = 0; // in divisions
		let last = 0;
		for (const e of m[2].matchAll(/<divisions>(\d+)<\/divisions>|<backup>\s*<duration>(\d+)<\/duration>|<forward>\s*<duration>(\d+)<\/duration>|<note\b[\s\S]*?<\/note>/g)) {
			if (e[1]) divisions = Number(e[1]);
			else if (e[2]) t -= Number(e[2]);
			else if (e[3]) t += Number(e[3]);
			else {
				const note = e[0];
				const dur = Number(/<duration>(\d+)<\/duration>/.exec(note)?.[1] ?? 0);
				const chord = note.includes('<chord');
				const at = chord ? last : t;
				if (!chord) last = t;
				if (!note.includes('<rest') && !note.includes('<grace')) {
					const p = /<step>(\w)<\/step>\s*(?:<alter>(-?\d+)<\/alter>)?\s*<octave>(\d)<\/octave>/.exec(note)!;
					const lyric = (v: number) => {
						const l = new RegExp(`<lyric\\b[^>]*number="${v}"[^>]*>([\\s\\S]*?)</lyric>`).exec(note)?.[1] ?? '';
						return { text: /<text\b[^>]*>([^<]*)<\/text>/.exec(l)?.[1] ?? '', syllabic: /<syllabic>([^<]*)<\/syllabic>/.exec(l)?.[1] ?? '' };
					};
					out.push({
						bar: Number(m[1]),
						onset: frac(at, divisions * 4),
						midi: 12 * (Number(p[3]) + 1) + STEP[p[1]] + Number(p[2] ?? 0),
						verse1: lyric(1).text,
						syllabic1: lyric(1).syllabic,
						verse2: lyric(2).text,
						syllabic2: lyric(2).syllabic,
					});
				}
				if (!chord) t += dur;
			}
		}
	}
	return out;
}

/** The extract's syllabic values are `start` and `whole`; MusicXML's are `begin` and `single`. */
const MXML_SYLLABIC: Record<string, string> = { start: 'begin', whole: 'single', middle: 'middle', end: 'end' };

interface Difference {
	bar: number;
	onset: string;
	what: string;
}

/** Every difference between a fixture's sung notes and the extract's, note by note. */
export function compareWithTruth(xml: string, truth: { notes: { bar: number; onset: string; midi: number; verse1: string; syllabic1: string; verse2: string; syllabic2: string }[] }): Difference[] {
	const mine = voiceNotesOf(xml);
	const key = (n: { bar: number; onset: string; midi: number }) => `${n.bar} ${n.onset} ${n.midi}`;
	const norm = (onset: string) => (onset.includes('/') ? onset : `${onset}/1`);
	const theirs = new Map(truth.notes.map((n) => [key({ ...n, onset: norm(n.onset) }), n]));
	const out: Difference[] = [];
	const seen = new Set<string>();
	for (const n of mine) {
		const k = key({ ...n, onset: norm(n.onset) });
		const t = theirs.get(k);
		if (!t) {
			out.push({ bar: n.bar, onset: n.onset, what: 'a note the extract does not have' });
			continue;
		}
		seen.add(k);
		const want = [t.verse1, MXML_SYLLABIC[t.syllabic1], t.verse2, MXML_SYLLABIC[t.syllabic2]];
		const got = [n.verse1, n.syllabic1, n.verse2, n.syllabic2];
		want.forEach((w, i) => {
			if (w !== got[i]) out.push({ bar: n.bar, onset: n.onset, what: `${['verse 1 text', 'verse 1 syllabic', 'verse 2 text', 'verse 2 syllabic'][i]}: «${got[i]}» for the extract's «${w}»` });
		});
	}
	for (const [k, t] of theirs) if (!seen.has(k)) out.push({ bar: t.bar, onset: norm(t.onset), what: 'a note of the extract the file does not have' });
	return out;
}

describe('the fixtures against their truth', () => {
	const truth = JSON.parse(read(TRUTH));

	it('matches the extract note by note on every bar: bar, onset, pitch, both verses, text and syllabic', () => {
		const diff = compareWithTruth(read(SUNLESS), truth);
		expect(diff.map((d) => `bar ${d.bar} @${d.onset}: ${d.what}`)).toEqual([]);
	});

	it('has the extract\'s 96 notes and the fixture\'s 96, and no difference', () => {
		expect(truth.notes).toHaveLength(96);
		expect(voiceNotesOf(read(SUNLESS))).toHaveLength(96);
		expect(compareWithTruth(read(SUNLESS), truth)).toEqual([]);
	});

	it('sees a shifted stretch: the positive control moves bar 5\'s verse 2 by one note, every note still holding one vowel', () => {
		const xml = read(SUNLESS);
		// Swap verse 2's text between the first two notes of bar 5.
		const bar5 = /(<measure\b[^>]*?number="5"[^>]*>)([\s\S]*?)(<\/measure>)/.exec(xml)!;
		const texts = [...bar5[2].matchAll(/(<lyric\b[^>]*number="2"[^>]*>\s*<syllabic>[^<]*<\/syllabic>\s*<text>)([^<]*)(<\/text>)/g)];
		const [a, b] = [texts[0], texts[1]];
		let shifted = bar5[2];
		shifted = shifted.replace(a[0], `${a[1]}${b[2]}${a[3]}`).replace(b[0], `${b[1]}${a[2]}${b[3]}`);
		expect(breachesOf(lyricNotes('x', bar5[1] + shifted + bar5[3])).length).toBe(0);
		const bad = compareWithTruth(xml.replace(bar5[2], shifted), truth);
		expect(bad.length).toBeGreaterThanOrEqual(2);
	});

	it('does not compare the copy of the old file: it is the shifted engraving, and that is why it is kept', () => {
		expect(compareWithTruth(read(LONE_V), truth).length).toBeGreaterThan(50);
		expect(PAIRS.map((p) => p.fixture)).not.toContain(LONE_V);
	});
});
