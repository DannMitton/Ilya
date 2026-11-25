/**
 * Round 2 of cloud-lane-88: Fable's two blockers and six fixes (`review-fable-lane88-as-built_r1_2026-11-24.md`).
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MusicXmlScoreParser, sungVerseNumbers, verseView, type ParsedScore, type ScoreParser, type SyllableInfo, type VocalLineEvent } from '@ilya/score-parser';
import { parseXml } from './mini-dom';
import { ingestScoreFile, type IngestDeps } from './ingest';
import { foldVowelessSyllables } from './vowelless-fold';
import { countUnderlay } from './underlay-count';
import { buildUnderlayResolvers } from '$lib/score/vowel-resolver';
import type { ScoreReader } from '$lib/reader/score-reader';

const syl = (text: string, type: SyllableInfo['type'] = 'whole'): SyllableInfo => ({ id: `s-${text}`, text, type, verseNumber: 1, wordContext: text }) as SyllableInfo;
const note = (id: string, text?: string, type: SyllableInfo['type'] = 'whole', extra: Record<string, unknown> = {}): VocalLineEvent =>
	({ id, type: 'note', measureIndex: 0, ...(text ? { syllable: syl(text, type) } : {}), ...extra }) as unknown as VocalLineEvent;
const scoreOf = (...events: VocalLineEvent[]): ParsedScore => ({ vocalLine: events }) as unknown as ParsedScore;
const texts = (score: ParsedScore) => score.vocalLine.map((e) => e.syllable?.text ?? null);

describe('blocker 1: a later verse is counted only over the notes it owns', () => {
	const dir = fileURLToPath(new URL('../../../../../../packages/score-parser/src/fixtures/', import.meta.url));
	const files = readdirSync(dir).filter((f) => /^(strophic-|repeat-one-verse).*\.musicxml$/.test(f));
	const musicxmlParser: ScoreParser = { canParse: () => true, parse: (i) => new MusicXmlScoreParser().parse({ ...i, data: parseXml(i.data as string) as unknown as Document }) };
	const deps: IngestDeps = { scoreReader: { convert: async () => '', dispose: () => {} } as unknown as ScoreReader, musicxmlParser };
	const arrive = async (f: string): Promise<ParsedScore> => {
		const out = await ingestScoreFile(new File([readFileSync(dir + f, 'utf8')], f), deps);
		if (!out.ok) throw new Error('ingest failed');
		return out.ingested.result.score;
	};

	it('finds the strophic fixtures', () => {
		expect(files.length).toBeGreaterThanOrEqual(9);
	});

	it.each(files)('no record names a note that shows a syllable in that verse\'s view, and a later verse loses no vowel to the record: %s', async (f) => {
		const score = await arrive(f);
		for (const verse of sungVerseNumbers(score)) {
			const view = verseView(score, verse);
			const shows = new Set(view.vocalLine.filter((e) => e.syllable).map((e) => e.id));
			for (const t of view.dictionMarks?.vacatedTailEventIds ?? []) expect(shows.has(t.eventId), `${f} verse ${verse} records ${t.eventId}`).toBe(false);
			if (verse === sungVerseNumbers(score)[0]) continue;
			// A later verse loses a vowel to the record only on a note the BASE verse's own record names (carried through a one-line bar,
			// `verses.ts` `marksOf`): those are the base verse's leftovers, textless in this view too. Anything else is a note the verse owns.
			const baseRecorded = new Set((score.dictionMarks?.vacatedTailEventIds ?? []).filter((t) => t.verseNumber === sungVerseNumbers(score)[0]).map((t) => t.eventId));
			const bare = { ...view, dictionMarks: undefined };
			const withRecord = buildUnderlayResolvers(view, 1);
			const without = buildUnderlayResolvers(bare, 1);
			const lost = view.vocalLine.filter((e) => without.vowel(e) !== undefined && withRecord.vowel(e) === undefined).map((e) => e.id);
			// The other legitimate loss: a textless note, with no evidence, in a bar where THIS verse has words of its own (verse 2 sets fewer
			// syllables than verse 1 on a note). The rule's intended reach, and the verse's own: `strophic-repeat*.musicxml`, bar index 4.
			const ownBars = new Set(score.vocalLine.filter((e) => e.syllable?.versesInfo?.some((v) => v.verseNumber === verse) || e.syllable?.verseNumber === verse).map((e) => e.measureIndex));
			const barOf = new Map(score.vocalLine.map((e) => [e.id, e.measureIndex] as const));
			expect(lost.filter((id) => !baseRecorded.has(id) && !ownBars.has(barOf.get(id) ?? -1)), `${f} verse ${verse}`).toEqual([]);
		}
	});
});

describe('blocker 2: a tie, an extender, or a slur under the gate claims a note, and the close-up does not happen there', () => {
	const tail = ['мо', 'ря'];
	it('control: with nothing claiming it, «знь» fuses backward onto «жи» and the tail closes up onto its note', () => {
		const out = foldVowelessSyllables(scoreOf(note('a', 'жи', 'start'), note('b', 'знь', 'end'), note('c', tail[0]), note('d', tail[1])));
		expect(texts(out.score)).toEqual(['жизнь', 'мо', 'ря', null]);
	});

	it('on a tied note the tail stays where the print put it: the fragment\'s note is left with no syllable', () => {
		const out = foldVowelessSyllables(scoreOf(note('a', 'жи', 'start', { tied: { type: 'start' } }), note('b', 'знь', 'end', { tied: { type: 'stop' } }), note('c', tail[0]), note('d', tail[1])));
		expect(texts(out.score)).toEqual(['жизнь', null, 'мо', 'ря']);
	});

	it('on the last note of a slur, under the count gate, the tail stays where the print put it', () => {
		const slurred = scoreOf(
			note('a', 'жи', 'start', { slurs: [{ type: 'start', number: 1, partnerEventId: 'b' }] }),
			note('b', 'знь', 'end', { slurs: [{ type: 'stop', number: 1 }] }),
			note('c', tail[0]),
			note('d', tail[1]),
		);
		expect(texts(foldVowelessSyllables(slurred).score)).toEqual(['жизнь', null, 'мо', 'ря']);
	});

	it('on the last note of a slur NOT under the gate it is a phrasing mark, and the tail closes up as before', () => {
		const phrasing = scoreOf(
			note('a', 'жи', 'start', { slurs: [{ type: 'start', number: 1, partnerEventId: 'b' }] }),
			note('b', 'знь', 'end', { slurs: [{ type: 'stop', number: 1 }] }),
			note('c', tail[0]),
			note('d', tail[1]),
			note('e', 'до'),
			note('f'),
		);
		// Six sung notes, four syllables, one continuation: 6 - 1 is not 4, so the gate fails and the slur is a phrasing mark.
		expect(texts(foldVowelessSyllables(phrasing).score)).toEqual(['жизнь', 'мо', 'ря', 'до', null, null]);
	});
});

describe('fixes 2, 3: a token with no Cyrillic letter, and a mark alone, stay on their notes and are counted', () => {
	it('a Latin «o» in a Cyrillic verse is not a fragment: nothing fuses, nothing shifts, and the place is counted', () => {
		const score = scoreOf(note('a', 'Я'), note('b', 'o'), note('c', 'дом'));
		const out = foldVowelessSyllables(score);
		expect(out.score).toBe(score);
		expect(out.verses[0].pinned).toMatchObject([{ eventId: 'b', why: 'foreign' }]);
		expect(countUnderlay(out).damaged).toBe(true);
	});

	it('a «—» on a note is not a syllable: the count does not come out even over it', () => {
		const out = foldVowelessSyllables(scoreOf(note('a', 'ты'), note('b', '—'), note('c', 'дом')));
		expect(out.verses[0].pinned).toMatchObject([{ eventId: 'b', why: 'mark' }]);
		const c = countUnderlay(out);
		// Round 3: a note that sings nothing is off the note count, so the count comes out even and the damage is the pinned note itself.
		expect(c.verses[0]).toMatchObject({ sung: 2, syllables: 2 });
		expect(c.verses[0].pinned).toHaveLength(1);
		expect(c.damaged).toBe(true);
	});

	it('the tokens around a pinned one are dealt around it', () => {
		const out = foldVowelessSyllables(scoreOf(note('a', 'в'), note('b', '—'), note('c', 'мир'), note('d', 'дом')));
		expect(texts(out.score)).toEqual([`в мир`, '—', 'дом', null]);
	});
});

describe('fix 4: extender-held notes come off before the slur gate', () => {
	it('a song that mixes an extension line with a slur passes the gate, and both are evidence', () => {
		const events = scoreOf(
			note('a', 'ты', 'whole', { slurs: [{ type: 'start', number: 1, partnerEventId: 'b' }] }),
			note('b', undefined, 'whole', { slurs: [{ type: 'stop', number: 1 }] }),
			note('c', 'мой'),
			note('d'),
			note('e', 'дом'),
		);
		const c = countUnderlay(foldVowelessSyllables(events, new Set(['d'])));
		expect(c.verses[0]).toMatchObject({ slurGate: 'passed', evidenced: ['b', 'd'], unexplained: [], agrees: true });
		expect(c.damaged).toBe(false);
	});
});

describe('fix 6: the record says what happened', () => {
	const deps = (): IngestDeps => ({ scoreReader: { convert: async () => '', dispose: () => {} } as unknown as ScoreReader });
	void deps;
	it('names a token the engine was never asked to divide for what it is', () => {
		const out = foldVowelessSyllables(scoreOf(note('a', 'в мире'), note('b', 'дом')));
		expect(out.verses[0].undivided).toMatchObject([{ why: 'shape' }]);
		const engine = foldVowelessSyllables(scoreOf(note('a', 'тѣни'), note('b', 'я')));
		expect(engine.verses[0].undivided).toMatchObject([{ why: 'engine' }]);
	});
});

describe('fix 5: the seam does not load the pipeline', () => {
	it.each(['vowelless-fold.ts', 'underlay-count.ts', 'melisma-evidence.ts', '../sung-notes.ts'])('%s imports nothing that reaches $lib/pipeline', (f) => {
		const text = readFileSync(fileURLToPath(new URL(f, import.meta.url)), 'utf8');
		const imports = [...text.matchAll(/^import[^;]*?from\s+'([^']+)'/gms)].map((m) => m[1]);
		for (const spec of imports) expect(spec).not.toMatch(/pipeline|vowel-resolver|pairings|slur-seat/);
	});
});

// ── Round 3 ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────

describe('round 3, fix A: the base verse is counted over the bars it shows', () => {
	const dir = fileURLToPath(new URL('../../../../../../packages/score-parser/src/fixtures/', import.meta.url));
	const musicxmlParser: ScoreParser = { canParse: () => true, parse: (i) => new MusicXmlScoreParser().parse({ ...i, data: parseXml(i.data as string) as unknown as Document }) };
	const deps: IngestDeps = { scoreReader: { convert: async () => '', dispose: () => {} } as unknown as ScoreReader, musicxmlParser };

	it('a second ending lettered as verse 2: verse 1 is counted over bars 1 to 3 only, and nothing is recorded for it', async () => {
		const out = await ingestScoreFile(new File([readFileSync(dir + 'second-ending-verse-2.xml', 'utf8')], 'f.musicxml'), deps);
		if (!out.ok) throw new Error('ingest failed');
		const { score, warnings } = out.ingested.result;
		expect(sungVerseNumbers(score)).toEqual([1, 2]);
		// Before the fix: 16 sung notes counted for verse 1 against 12 syllables, the gate failed, and verse 1 recorded bar 4's four notes.
		expect(score.dictionMarks?.vacatedTailEventIds.filter((t) => t.verseNumber === 1) ?? []).toEqual([]);
		expect(warnings.some((w) => w.code === 'slur-evidence-unchecked')).toBe(false);
		const fold = foldVowelessSyllables(score);
		expect(fold.verses.map((v) => [v.verse, v.evidence.scope.length, v.syllables, v.evidence.gate])).toEqual([[1, 12, 12, 'none'], [2, 4, 3, 'passed']]);
		const view = verseView(score, 2);
		const slurred = view.vocalLine[13];
		expect(slurred.syllable).toBeUndefined();
		expect(buildUnderlayResolvers(view, 1).vowel(slurred)).toBeDefined();
	});
});

describe('round 3, fix B: an extender claims the note, and the close-up does not happen there', () => {
	it('a fragment on an extender-held note leaves the note with no syllable and the tail where the print put it', () => {
		const events = scoreOf(note('a', 'жи', 'start'), note('b', 'знь', 'end'), note('c', 'мо'), note('d', 'ря'));
		expect(texts(foldVowelessSyllables(events, new Set(['b'])).score)).toEqual(['жизнь', null, 'мо', 'ря']);
		expect(texts(foldVowelessSyllables(events).score)).toEqual(['жизнь', 'мо', 'ря', null]);
	});
});

describe('round 3, DESK DEFAULT: a pinned note comes off the count before the gate', () => {
	it('a mark alone beside a slurred melisma does not fail the gate', () => {
		const events = scoreOf(
			note('a', 'ты', 'whole', { slurs: [{ type: 'start', number: 1, partnerEventId: 'b' }] }),
			note('b', undefined, 'whole', { slurs: [{ type: 'stop', number: 1 }] }),
			note('c', '—'),
			note('d', 'дом'),
		);
		const c = countUnderlay(foldVowelessSyllables(events));
		expect(c.verses[0]).toMatchObject({ slurGate: 'passed', sung: 3, syllables: 2, agrees: true, evidenced: ['b'] });
		expect(c.damaged).toBe(true);
		expect(c.unchecked).toEqual([]);
	});
});

describe('round 3, the ruling: a failed gate seats the verse as 5594904b seated it, with one record', () => {
	const dir = fileURLToPath(new URL('../../../../../../packages/score-parser/src/fixtures/', import.meta.url));
	const base = JSON.parse(readFileSync(fileURLToPath(new URL('./fixtures/base-5594904b-strophic-seating.json', import.meta.url)), 'utf8')) as Record<string, Record<string, Array<[string, string | null, string | null]>>>;
	const musicxmlParser: ScoreParser = { canParse: () => true, parse: (i) => new MusicXmlScoreParser().parse({ ...i, data: parseXml(i.data as string) as unknown as Document }) };
	const deps: IngestDeps = { scoreReader: { convert: async () => '', dispose: () => {} } as unknown as ScoreReader, musicxmlParser };
	const files = Object.keys(base);

	it.each(files)('every verse keeps the vowels and the IPA that 5594904b gave it: %s', async (f) => {
		const out = await ingestScoreFile(new File([readFileSync(dir + f, 'utf8')], f), deps);
		if (!out.ok) throw new Error('ingest failed');
		const score = out.ingested.result.score;
		for (const verse of sungVerseNumbers(score)) {
			const view = verseView(score, verse);
			const r = buildUnderlayResolvers(view, 1);
			const now = view.vocalLine.filter((e) => e.type === 'note').map((e) => [e.id, (r.vowel(e) as string | undefined) ?? null, (r.ipa(e) as string | undefined) ?? null]);
			expect(now, `${f} verse ${verse}`).toEqual(base[f][String(verse)]);
		}
	});

	it.each(files)('every verse whose gate fails carries exactly one record, and no per-note abstention: %s', async (f) => {
		const text = readFileSync(dir + f, 'utf8');
		const parsed = await musicxmlParser.parse({ format: 'musicxml', data: text, sourcePath: f });
		const extenders = new Set(parsed.warnings.find((w) => w.code === 'extender-notes')?.eventIds ?? []);
		const failing = foldVowelessSyllables(parsed.score, extenders).verses.filter((v) => v.evidence.gate === 'failed').map((v) => v.verse);
		const out = await ingestScoreFile(new File([text], f), deps);
		if (!out.ok) throw new Error('ingest failed');
		const records = out.ingested.result.warnings.filter((w) => w.code === 'slur-evidence-unchecked').map((w) => Number(/verse (\d+)/.exec(w.message)?.[1]));
		expect(records).toEqual(failing);
		for (const v of failing) expect(out.ingested.result.score.dictionMarks?.vacatedTailEventIds.filter((t) => t.verseNumber === v) ?? []).toEqual([]);
	});

	it('the four repeat files do fail the gate in every verse, so the test above has something to hold', async () => {
		for (const f of files.filter((x) => x.startsWith('strophic-repeat'))) {
			const parsed = await musicxmlParser.parse({ format: 'musicxml', data: readFileSync(dir + f, 'utf8'), sourcePath: f });
			expect(foldVowelessSyllables(parsed.score).verses.map((v) => v.evidence.gate), f).toEqual(['failed', 'failed', 'failed']);
		}
	});

	it('where the gate does not fail, the per-note record stands as built in round 2: Tchaikovsky bars 58 and 93', async () => {
		const text = readFileSync(fileURLToPath(new URL('./fixtures/tchaikovsky-op38-3-voice.musicxml', import.meta.url)), 'utf8');
		const out = await ingestScoreFile(new File([text], 't.musicxml'), deps);
		if (!out.ok) throw new Error('ingest failed');
		expect(out.ingested.result.score.dictionMarks?.vacatedTailEventIds).toHaveLength(2);
		expect(out.ingested.result.warnings.some((w) => w.code === 'slur-evidence-unchecked')).toBe(false);
	});
});
