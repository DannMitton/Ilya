/**
 * The render score (strophic lane A, brief r5, Step 3): D3 and D4 on the Step 1
 * fixtures. Pure code, no browser.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser } from './musicxml-parser';
import { parseXml } from './mini-xml.test-support';
import { derivedId, renderScoreOf } from './render-score';
import type { ParsedScore, VocalLineEvent } from './types';

async function load(name: string): Promise<ParsedScore> {
	const xml = readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document } as never)).score;
}
const sources = (r: ReturnType<typeof renderScoreOf>) => r.bars.map((b) => b.source);
const barEvents = (s: ParsedScore, bar: number): VocalLineEvent[] => s.vocalLine.filter((e) => e.measureIndex === bar);

describe('strophic-repeat.musicxml: D3.1 with three verses and no times', () => {
	it('prints the introduction once, the passage three times, and the ending once', async () => {
		const p = await load('strophic-repeat.musicxml');
		const r = renderScoreOf(p);
		expect(r.path).toBe('repeats');
		const passage = [3, 4, 5, 6, 7, 8];
		expect(sources(r)).toEqual([0, 1, 2, ...passage, ...passage, ...passage, 9, 10]);
		expect(r.score.measures).toHaveLength(23);
		expect(r.score.measures.map((m) => m.index)).toEqual([...Array(23).keys()]);
		expect(r.verses).toEqual([1, 2, 3]);
	});

	it('keeps every bar its printed number, repeating them per pass', async () => {
		const r = renderScoreOf(await load('strophic-repeat.musicxml'));
		expect(r.score.measures.map((m) => m.number).join(' ')).toBe('1 2 3 4 5 6 7 8 9 4 5 6 7 8 9 4 5 6 7 8 9 10 11');
	});

	it('does not draw the repeat that bounds the passage (its markers are gone), and leaves the input alone', async () => {
		const p = await load('strophic-repeat.musicxml');
		const before = JSON.stringify(p);
		const r = renderScoreOf(p);
		expect(r.score.measures.some((m) => m.repeatStart || m.repeatEnd || m.repeatTimes !== undefined)).toBe(false);
		expect(JSON.stringify(p)).toBe(before);
	});

	it('labels the first bar of passes 2 and 3 only, and marks later-pass bars', async () => {
		const r = renderScoreOf(await load('strophic-repeat.musicxml'));
		expect(r.bars.map((b, i) => (b.label ? [i, b.label] : null)).filter(Boolean)).toEqual([[9, 2], [15, 3]]);
		expect(r.bars.map((b) => b.place)).toEqual([1, 1, 1, ...Array(6).fill(1), ...Array(6).fill(2), ...Array(6).fill(3), 1, 1]);
		expect(r.bars.map((b) => b.later)).toEqual([false, false, false, ...Array(6).fill(false), ...Array(12).fill(true), false, false]);
		expect([...r.boundaries].sort((a, b) => a - b)).toEqual([9, 15, 21]);
	});

	it('gives later-pass events derived ids, unique across the score, and keeps pass 1 and outside ids', async () => {
		const p = await load('strophic-repeat.musicxml');
		const r = renderScoreOf(p);
		const ids = r.score.vocalLine.map((e) => e.id);
		expect(new Set(ids).size).toBe(ids.length);
		const src = barEvents(p, 3)[0].id;
		expect(barEvents(r.score, 3)[0].id).toBe(src);
		expect(barEvents(r.score, 9)[0].id).toBe(derivedId(src, 2));
		expect(barEvents(r.score, 15)[0].id).toBe(derivedId(src, 3));
		expect(barEvents(r.score, 21).map((e) => e.id)).toEqual(barEvents(p, 9).map((e) => e.id)); // the ending
		expect(barEvents(r.score, 0).map((e) => e.id)).toEqual(barEvents(p, 0).map((e) => e.id));
		for (const e of r.score.vocalLine) expect(e.measureIndex).toBe(r.score.measures.findIndex((_, i) => barEvents(r.score, i).includes(e)));
	});

	it('carries each pass\'s own verse: bar 3 differs per pass, bars 7 and 8 carry verse 1 in every pass', async () => {
		const r = renderScoreOf(await load('strophic-repeat.musicxml'));
		const first = (bar: number) => barEvents(r.score, bar).filter((e) => e.type === 'note').map((e) => e.syllable?.text ?? null);
		expect(first(3)).toEqual(['Ночь', 'ти', 'ха', 'над']);
		expect(first(9)).toEqual(['День', 'те', 'пел', 'за']);
		expect(first(15)).toEqual(['Мгла', 'ни', 'зка', 'на']);
		for (const bar of [7, 8]) {
			const a = first(bar);
			expect(first(bar + 6)).toEqual(a);
			expect(first(bar + 12)).toEqual(a);
			expect(a.every((w) => w !== null)).toBe(true);
		}
		expect(first(10).slice(0, 2)).toEqual(['Лес', null]); // verse 2, the second passage bar
		expect(first(11).slice(0, 2)).toEqual(['зо', 'лот']); // verse 2, the third passage bar
		for (const e of r.score.vocalLine) if (e.syllable) expect(e.syllable.verseNumber).toBe(1);
	});

	it('puts the tempo mark of the ending on the ending, once, and rebuilds the other lists on printed indices', async () => {
		const p = await load('strophic-repeat.musicxml');
		const r = renderScoreOf(p);
		expect(r.score.tempoMarkings.map((t) => t.measureIndex)).toEqual([21]);
		expect(r.score.keySignatures.map((k) => k.measureIndex)).toEqual([0]);
		expect(r.score.timeSignatures.map((k) => k.measureIndex)).toEqual([0]);
	});

	it('points a later-pass slur at its partner\'s copy in the same pass', async () => {
		const p = await load('strophic-repeat.musicxml');
		const r = renderScoreOf(p);
		const startsIn = (bar: number) => barEvents(r.score, bar).flatMap((e) => (e.slurs ?? []).map((s) => ({ id: e.id, s })));
		const pass1 = startsIn(6);
		expect(pass1).toHaveLength(2);
		const pass2 = startsIn(12);
		const start = pass2.find((x) => x.s.type === 'start')!;
		const stop = pass2.find((x) => x.s.type === 'stop')!;
		expect(start.s.partnerEventId).toBe(stop.id);
		expect(stop.s.partnerEventId).toBe(start.id);
		expect(start.id.endsWith('~v2')).toBe(true);
	});

	it('removes a slur and a tie that would leave its pass, and keeps one that stays', async () => {
		const p = await load('strophic-repeat.musicxml');
		// Source bar 8 is the last of the passage; source bar 9 follows the repeat. A slur and a tie from bar 8's last note to bar 9's first.
		const last = barEvents(p, 8).filter((e) => e.type === 'note').at(-1)!;
		const after = barEvents(p, 9)[0];
		last.slurs = [{ type: 'start', number: 7, partnerEventId: after.id }];
		after.slurs = [{ type: 'stop', number: 7, partnerEventId: last.id }];
		last.tied = { type: 'start' };
		after.tied = { type: 'stop' };
		const r = renderScoreOf(p);
		const lastOf = (bar: number) => barEvents(r.score, bar).filter((e) => e.type === 'note').at(-1)!;
		// Pass 1 (printed bars 3 to 8): the next printed bar is pass 2's first, so both are dropped.
		expect(lastOf(8).slurs?.[0].partnerEventId).toBeUndefined();
		expect(lastOf(8).tied).toBeUndefined();
		expect(lastOf(14).slurs?.[0].partnerEventId).toBeUndefined();
		// Pass 3 (printed 15 to 20): the ending follows directly, so the pointer names the outside copy and the tie stays.
		expect(lastOf(20).slurs?.[0].partnerEventId).toBe(after.id);
		expect(lastOf(20).tied?.type).toBe('start');
		// And the ending's first note points back at the pass-3 copy only.
		expect(barEvents(r.score, 21)[0].slurs?.[0].partnerEventId).toBe(lastOf(20).id);
	});

	it('gives a later-pass principal its grace notes, with the derived principal id plus the grace suffix', async () => {
		const p = await load('strophic-repeat.musicxml');
		const principal = barEvents(p, 4)[2];
		p.graceNotes = [{ id: `${principal.id}~g1`, principalId: principal.id, pitch: { step: 'D', octave: 4, alter: 0 }, base: 'eighth' }];
		const r = renderScoreOf(p);
		const ids = (r.score.graceNotes ?? []).map((g) => [g.id, g.principalId]);
		expect(ids).toEqual([
			[`${principal.id}~g1`, principal.id],
			[`${derivedId(principal.id, 2)}~g1`, derivedId(principal.id, 2)],
			[`${derivedId(principal.id, 3)}~g1`, derivedId(principal.id, 3)],
		]);
		for (const g of r.score.graceNotes ?? []) expect(r.score.vocalLine.some((e) => e.id === g.principalId)).toBe(true);
	});

	it('declines to unfold where an event id in the file already contains ~v', async () => {
		const p = await load('strophic-repeat.musicxml');
		p.vocalLine[0] = { ...p.vocalLine[0], id: 'x~v2' };
		const r = renderScoreOf(p);
		expect(r.path).toBe('notated');
		expect(r.declined).toBe('id-shape');
		expect(r.score).toBe(p);
	});
});

describe.each([
	['strophic-volta.musicxml'],
	['strophic-volta-from-top.musicxml'],
])('%s: D3.1 with endings', (file) => {
	it('prints ending 1 in pass 1 and ending 2 in pass 2, and carries the repeat out', async () => {
		const p = await load(file);
		const r = renderScoreOf(p);
		expect(r.path).toBe('repeats');
		expect(sources(r)).toEqual([0, 1, 2, 3, 0, 1, 2, 4, 5]);
		expect(r.bars.map((b) => b.place)).toEqual([1, 1, 1, 1, 2, 2, 2, 2, 1]);
		expect(r.bars.map((b) => b.later)).toEqual([false, false, false, false, true, true, true, true, false]);
		expect(r.bars.map((b) => b.label)).toEqual([undefined, undefined, undefined, undefined, 2, undefined, undefined, undefined, undefined]);
		expect(r.score.measures.map((m) => m.number).join(' ')).toBe('1 2 3 4 1 2 3 5 6');
		expect(r.score.measures.some((m) => m.ending || m.repeatStart || m.repeatEnd)).toBe(false);
	});

	it('keeps the ids of the one bar after the second ending, and gives it no later mark', async () => {
		const p = await load(file);
		const r = renderScoreOf(p);
		expect(barEvents(r.score, 8).map((e) => e.id)).toEqual(barEvents(p, 5).map((e) => e.id));
		expect(r.bars[8].later).toBe(false);
		expect(barEvents(r.score, 7).every((e) => e.id.endsWith('~v2'))).toBe(true); // ending 2 is a later-pass bar
	});

	it('prints each ending\'s own words: one line of words in an ending reads as verse 1 in every pass', async () => {
		const p = await load(file);
		const r = renderScoreOf(p);
		const words = (bar: number) => barEvents(r.score, bar).filter((e) => e.type === 'note').map((e) => e.syllable?.text ?? null);
		expect(words(3)).toEqual(['Всё', 'тих', 'но', 'ей']);
		expect(words(7)).toEqual(['Вот', 'и', 'ко', 'нец']);
		expect(words(4)).toEqual(['День', 'те', 'пел', 'за']);
	});
});

describe('strophic-stacked.musicxml: D3.2 (no marks)', () => {
	it('prints the passage once per verse, the introduction once before, and the one-line ending once after the last verse', async () => {
		const p = await load('strophic-stacked.musicxml');
		const r = renderScoreOf(p);
		expect(r.path).toBe('stacked');
		const passage = [2, 3, 4, 5];
		expect(sources(r)).toEqual([0, 1, ...passage, ...passage, ...passage, 6, 7]);
		expect(r.bars.map((b) => b.place)).toEqual([1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 1, 1]);
		expect(r.bars.map((b) => b.label).filter(Boolean)).toEqual([2, 3]);
		const words = (bar: number) => barEvents(r.score, bar).filter((e) => e.type === 'note').map((e) => e.syllable?.text);
		expect(words(2)).toEqual(['Ночь', 'ти', 'ха', 'над']);
		expect(words(6)).toEqual(['День', 'те', 'пел', 'за']);
		expect(words(10)).toEqual(['Мгла', 'ни', 'зка', 'на']);
		expect(words(14)).toEqual(['Всё', 'тих', 'но', 'ей']);
	});
});

describe('the cases that print as notated (D3.3)', () => {
	it('a repeat whose words do not vary returns the notated score by reference', async () => {
		const p = await load('repeat-one-verse.musicxml');
		const r = renderScoreOf(p);
		expect(r.path).toBe('notated');
		expect(r.score).toBe(p);
		expect(r.bars.map((b) => b.source)).toEqual([0, 1, 2, 3]);
		expect(r.score.measures[0].repeatStart).toBe(true);
	});

	it('a score with no later verse returns by reference', async () => {
		const p = await load('key-changes.musicxml');
		expect(renderScoreOf(p).score).toBe(p);
	});

	it('a later run that carries no words for its verse is dropped: its bars print once, as notated, and its repeat stays', async () => {
		// A second repeat over the two bars after the passage (indices 8 and 9), where only verse 1 sings.
		const p = await load('strophic-repeat.musicxml');
		p.measures[9] = { ...p.measures[9], repeatStart: true };
		p.measures[10] = { ...p.measures[10], repeatEnd: true };
		const r = renderScoreOf(p);
		const passage = [3, 4, 5, 6, 7, 8];
		expect(sources(r)).toEqual([0, 1, 2, ...passage, ...passage, ...passage, 9, 10]);
		expect(r.bars[21].later).toBe(false);
		expect(r.score.measures[21].repeatStart).toBe(true);
		expect(r.score.measures[22].repeatEnd).toBe(true);
		expect(r.score.measures[8].repeatEnd).toBeUndefined(); // the passage's own repeat was carried out
	});
});

describe('strophic-tacet-boundary.musicxml', () => {
	it('prints bar 4 of one pass beside bar 1 of the next, with a boundary between them', async () => {
		const p = await load('strophic-tacet-boundary.musicxml');
		const r = renderScoreOf(p);
		expect(sources(r)).toEqual([0, 1, 2, 3, 0, 1, 2, 3, 4]);
		expect([...r.boundaries]).toEqual([4, 8]);
	});
});
