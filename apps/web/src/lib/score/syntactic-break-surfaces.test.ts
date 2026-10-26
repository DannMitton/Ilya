/**
 * QUEUE row 139: where a typed # may show, and where it may not.
 *
 * Dann 2026-10-21 00:26: "We should only see octothorpes in the IPa line, not in the staff or the
 * Cyrillic text." (transcribed as written). One test per surface. A # typed in Lyrics never reaches Poem,
 * a separate field (`IntakeViews.svelte:72-73`), so Poem has no test here.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MusicXmlScoreParser, analyzeScore, demoProfile, renderAnalyzedStaff, type ParsedScore, type ScoreParser } from '@ilya/score-parser';
import { processText } from '$lib/pipeline';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { ingestScoreFile, type IngestDeps } from '$lib/score/ingestion/ingest';
import type { ScoreReader } from '$lib/reader/score-reader';
import { comparePoem, layOutLikePoem, lyricsSegments, poemSegments } from '$lib/text/poem-compare';
import { sameWords } from '$lib/text/same-words';
import { proposeName } from '$lib/library/songs';
import { loadRealData, wordsOf } from '$lib/syntactic-break.support';
import { buildSlotQueue, drawPairings, firstPass, type DrawSwitches } from './pairings';
import { buildUnderlayResolvers } from './vowel-resolver';
import { rekeySeatsToLines, seatScoreWords } from './score-seat';

beforeAll(loadRealData, 60_000);

const OFF: DrawSwitches = { openSyllabification: false, reconstitution: false };
const ON: DrawSwitches = { openSyllabification: true, reconstitution: true };
const TYPED = 'Я # на правду';
const PLAIN = 'Я на правду';

describe('Lyrics, as the singer types it', () => {
	it('the field keeps the # while it is edited: laying the text out in the poem’s lines does not remove it', () => {
		const laid = layOutLikePoem('я# на правду', 'Я на\nправду');
		expect(laid).toContain('#');
	});
	it('the typed text is the field’s own: nothing in the pipeline rewrites the string it was given', () => {
		// `processText` returns lines and words, never text, so the # stays in the field by construction;
		// this pins that the pipeline does not throw on it and finds the same words.
		expect(wordsOf(TYPED).map((w) => w.cleanWord)).toEqual(wordsOf(PLAIN).map((w) => w.cleanWord));
	});
});

describe('Text’s Cyrillic', () => {
	it('prints no # anywhere on a word', () => {
		for (const w of wordsOf('Слух # был, а я# на правду')) {
			for (const f of [w.cyrillic, w.cleanWord, w.punctuation, w.stressedCyrillic]) expect(f ?? '').not.toContain('#');
		}
	});
});

describe('the words under the notes, and the score’s notes', () => {
	const lines = (t: string) => processText(t);
	it('seats the same number of notes with the # as without it', () => {
		expect(buildSlotQueue(lines(TYPED)).length).toBe(buildSlotQueue(lines(PLAIN)).length);
	});
	it('no slot’s Cyrillic holds a #', () => {
		for (const s of buildSlotQueue(lines('Я # на правду, а ты # же дом'))) expect(s.cyrillic).not.toContain('#');
	});
	it('the last slot before the # carries it in its IPA, and no other slot does', () => {
		const q = buildSlotQueue(lines(TYPED));
		expect(q.map((s) => s.ipa.includes('#'))).toEqual([true, false, false, false]);
		expect(q[0].ipa.endsWith('#')).toBe(true);
		expect(q[0].origin.word).toBe('Я');
	});
	it('a # on a word of several syllables lands on its LAST syllable', () => {
		const q = buildSlotQueue(lines('правду # я'));
		expect(q.map((s) => s.ipa.endsWith('#'))).toEqual([false, true, false]);
	});
	it('a vowelless enclitic’s slot carries the # after the enclitic: «друг ж # дом»', () => {
		const q = buildSlotQueue(lines('друг ж # дом'));
		expect(q.map((s) => s.ipa)).toEqual([expect.stringMatching(/ʃ#$/), expect.not.stringContaining('#')]);
		expect(q[0].cyrillic).not.toContain('#');
	});
	it('a vowel-bearing enclitic’s own slot carries it: «Ты же # дом»', () => {
		const q = buildSlotQueue(lines('Ты же # дом'));
		expect(q.map((s) => s.ipa.endsWith('#'))).toEqual([false, true, false]);
	});
});

describe('Lyrics as drawn: what each seated note draws', () => {
	for (const [name, switches] of [['no switches', OFF], ['open syllables and reconstitution', ON]] as const) {
		it(`draws the # in the IPA and not in the Cyrillic (${name})`, () => {
			const ls = processText('Я # на правду');
			const queue = buildSlotQueue(ls);
			const map = firstPass(queue.map((_, i) => `e${i}`), queue);
			const drawn = drawPairings(map, ls, switches);
			expect(Object.keys(drawn)).toHaveLength(queue.length);
			for (const d of Object.values(drawn)) expect(d.cyrillic).not.toContain('#');
			expect(Object.entries(drawn).map(([id, d]) => [id, d.ipa.endsWith('#')])).toEqual([['e0', true], ['e1', false], ['e2', false], ['e3', false]]);
			expect(Object.values(drawn).every((d) => !d.vowel?.includes('#'))).toBe(true);
		});
	}
});

describe('the Lyrics-to-Poem comparison', () => {
	it('colours nothing for a #, trailing or alone', () => {
		for (const lyrics of ['я # на правду', 'я# на правду', 'я #на правду']) {
			const cmp = comparePoem(lyrics, 'я на правду')!;
			expect(cmp.differing).toBe(0);
			expect(cmp.omitted).toBe(0);
			expect(lyricsSegments(lyrics, cmp).every((s) => s.kind === 'plain')).toBe(true);
			expect(poemSegments('я на правду', cmp).every((s) => s.kind === 'plain')).toBe(true);
		}
	});
});

describe('the other readers of typed words', () => {
	it('sameWords folds a typed #, so the `from score` tag and the score’s own seat stay on', () => {
		expect(sameWords('я# на правду', 'я на правду')).toBe(true);
		expect(sameWords('я # на правду', 'я на правду')).toBe(true);
		expect(sameWords('я на правду', 'я# на правду')).toBe(true);
	});
	it('sameWords still tells different words apart', () => {
		expect(sameWords('я# на правду', 'я на правду!')).toBe(false);
		expect(sameWords('я# на правду', 'я на правда')).toBe(false);
	});
	it('a library title built from a Poem ignores a typed #', () => {
		const title = proposeName({ metadata: { composer: '', title: '' }, poem: 'Я# на правду, # а ты', publishedPoem: '' } as never);
		expect(title).toBe('Я на правду, а');
	});
});

/* ── Markup and Insights, through a real folded score ─────────────────── */

const note = (step: string, text?: string, syllabic = 'single') =>
	`<note><pitch><step>${step}</step><octave>3</octave></pitch><duration>1</duration><voice>1</voice><type>quarter</type>${
		text === undefined ? '' : `<lyric number="1"><syllabic>${syllabic}</syllabic><text>${text}</text></lyric>`
	}</note>`;

/** Sunless no. 4, «я на правду», as `diction-fold-live.test.ts` writes it, with the mark in the sung verse. */
const sunless04Shape = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0"><part-list><score-part id="P1"><part-name>Voice</part-name></score-part></part-list>
<part id="P1"><measure number="1"><attributes><divisions>1</divisions><time><beats>5</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>
${note('C', 'я')}${note('D', '#')}${note('E', 'на')}${note('F', 'прав', 'begin')}${note('G', 'ду', 'end')}
</measure></part></score-partwise>`;

const musicxmlParser: ScoreParser = {
	canParse: () => true,
	parse: (input) => new MusicXmlScoreParser().parse({ ...input, data: parseXml(input.data as string) as unknown as Document }),
};
const inertReader: ScoreReader = { convert: async () => { throw new Error('not reached'); }, dispose: () => {} };
const deps: IngestDeps = { scoreReader: inertReader, musicxmlParser };

async function ingest(text: string): Promise<ParsedScore> {
	const out = await ingestScoreFile(new File([text], 'sunless-04-shape.musicxml'), deps);
	if (!out.ok) throw new Error(`ingest failed: ${JSON.stringify(out.error)}`);
	return out.ingested.result.score;
}

/** Every <text> element of the page, its content, in drawing order. */
const textsOf = (svg: string): string[] => [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);

describe('Markup: the staff drawn from the typed Lyrics', () => {
	it('draws the # in the IPA line and in no Cyrillic text, and draws no [#] junction mark', async () => {
		const score = await ingest(sunless04Shape);
		const ids = score.vocalLine.slice(0, 4).map((e) => e.id);
		const ls = processText(TYPED);
		const queue = buildSlotQueue(ls);
		const map = firstPass(ids, queue);
		const drawn = drawPairings(map, ls, OFF);
		const cyrPreview = Object.fromEntries(Object.entries(drawn).map(([id, d]) => [id, d.cyrillic]));
		const ipaPreview = Object.fromEntries(Object.entries(drawn).map(([id, d]) => [id, d.ipa]));
		const analyzed = analyzeScore(score, demoProfile, () => 'ɑ', { generatedAt: '2026-10-26T00:00:00.000Z' });
		const svg = renderAnalyzedStaff(score, analyzed, { cyrPreview, ipaPreview });
		const texts = textsOf(svg);
		const cyrillic = texts.filter((t) => /[а-яё]/i.test(t));
		const withMark = texts.filter((t) => t.includes('#'));
		expect(cyrillic.length).toBeGreaterThan(0);
		expect(cyrillic.some((t) => t.includes('#'))).toBe(false);
		expect(withMark).toHaveLength(1);
		expect(withMark[0]).toMatch(/ˈjɑ#$/u);
		expect(svg).not.toContain('phonation-break');
		expect(svg).not.toContain('[#]');
	});
});

describe('Markup and Insights: the resolvers behind a score whose own text carries the mark', () => {
	it('the IPA line carries the # after the word’s last syllable; the vowels Insights reads carry none', async () => {
		const score = await ingest(sunless04Shape);
		const { ipa, vowel } = buildUnderlayResolvers(score, 1);
		const [ya, na, prav, du] = score.vocalLine;
		expect(ipa(ya)?.endsWith('#')).toBe(true);
		for (const ev of [na, prav, du]) expect(ipa(ev)).not.toContain('#');
		for (const ev of score.vocalLine) expect(vowel(ev) ?? '').not.toContain('#');
	});
});

describe('the score’s own seat: a typed # adds no word and moves no note', () => {
	it('seats the same notes, on the same words, with the # as without it, on one line and on two', async () => {
		const score = await ingest(sunless04Shape);
		const seat = (text: string) => {
			const ls = processText(text);
			const out = seatScoreWords(score, {}, ls);
			return { ...out, seats: rekeySeatsToLines(out.map, ls).map };
		};
		for (const [typed, plain] of [[TYPED, PLAIN], ['Я #\nна правду', 'Я\nна правду'], ['Я # на\nправду #', 'Я на\nправду']]) {
			const [a, b] = [seat(typed), seat(plain)];
			expect(a.seated, typed).toBe(4);
			expect([a.seated, a.withheld]).toEqual([b.seated, b.withheld]);
			const key = (m: typeof a.seats) => Object.entries(m).map(([id, p]) => [id, p.kind === 'syllable' ? p.origin.word : p.kind]);
			expect(key(a.seats)).toEqual(key(b.seats));
			for (const p of Object.values(a.seats)) if (p.kind === 'syllable') expect(p.cyrillic).not.toContain('#');
		}
	});
});
