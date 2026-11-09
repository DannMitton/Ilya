/**
 * Further reading as one list of resources (2026-11-03): each work once, its
 * full reference on its own line, then one line per topic it is cited for. The
 * topic label is a desk draft (`insights.r2.readingTopic`), not ratified.
 */
import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import { furtherReading, readingList } from './further-reading';
import { runsText, type RenderedComment } from './comment-text';
import type { Block } from './singer-blocks';
import SingerBlock from './SingerBlock.svelte';

const rc = (id: string, vowel: string, bar: string, pitch: string, rows: string[]) =>
	({ comment: { eventId: id, measureIndex: 0, vowel }, rows, bar, pitch }) as unknown as RenderedComment & { bar: string; pitch: string };
const inputs = (language: 'en' | 'fr' = 'en') => ({
	language,
	pitchOf: (r: RenderedComment) => (r as unknown as { pitch: string }).pitch,
	barOf: (r: RenderedComment) => (r as unknown as { bar: string }).bar,
});
/** English is compared with ordinary spaces: `pagesText` sets "p.\u00a065" so a page number never parts from its "p.". French is compared exactly. */
const lines = (w: ReturnType<typeof furtherReading>, exact = false) => {
	const n = (s: string) => (exact ? s : s.replace(/\u00a0/g, ' '));
	return w.map((x) => ({ reference: n(runsText(x.reference)), topics: x.topics.map((r) => n(runsText(r))) }));
};
const REID = 'Reid, Cornelius L. Voice: Psyche and Soma. New York: Joseph Patelson Music House, 1975, third printing 1999. ISBN 0-915282-00-3.';

describe('Further reading, one entry per work', () => {
	it('gives a work cited twice by one observation one entry, both passages, one semicolon, in page order (the brief\'s example)', () => {
		const out = lines(furtherReading([rc('a', 'u', '6', 'A3', ['REID-057', 'REID-054'])], inputs()));
		expect(out).toEqual([
			{
				reference: REID,
				topics: ['[u] on A3, bar 6: p. 65, “vowel is incapable of being articulated in the upper tonal regions”; p. 66, “there will be no real reason for modifying the vowel any longer”'],
			},
		]);
	});
	it('gives a work cited by two observations one entry and two topic lines, in the order of the observations, never re-sorted by bar', () => {
		const out = lines(furtherReading([rc('a', 'u', '9', 'D4', ['REID-054']), rc('b', 'u', '6', 'D4', ['REID-057'])], inputs()));
		expect(out).toHaveLength(1);
		expect(out[0].topics).toEqual([expect.stringMatching(/^\[u\] on D4, bar 9: p\. 65,/), expect.stringMatching(/^\[u\] on D4, bar 6: p\. 66,/)]);
	});
	it('merges two observations with the same vowel, pitch, and bar into one topic with the union of their rows, each passage once', () => {
		const out = lines(furtherReading([rc('a', 'u', '6', 'A3', ['REID-054']), rc('b', 'u', '6', 'A3', ['REID-054', 'REID-057'])], inputs()));
		expect(out[0].topics).toHaveLength(1);
		expect(out[0].topics[0].match(/;/g)).toHaveLength(1);
		expect(out[0].topics[0].match(/p\. 65/g)).toHaveLength(1);
	});
	it('prints a row with a heading and no quotation as page and heading, and a row with neither as the page alone', () => {
		const out = lines(furtherReading([rc('a', 'ɛ', '4', 'E♭4', ['KVP2-022', 'PVA2-B-014'])], inputs()));
		expect(out.map((x) => x.topics)).toEqual([[ '[ɛ] on E♭4, bar 4: p. 65' ], [ '[ɛ] on E♭4, bar 4: p. 97, Typical Pitfalls: Timbral Thinness' ]]);
	});
	it('runs the works alphabetically by author then year, and prints each reference once', () => {
		const out = lines(furtherReading([rc('a', 'u', '1', 'D4', ['REID-054', 'PVA2-B-014', 'MIL04-028', 'MIL04-035'])], inputs()));
		expect(out.map((x) => x.reference.split('.')[0])).toEqual(['Bozeman, Kenneth', 'Miller, Richard', 'Reid, Cornelius L']);
		expect(out[1].topics).toHaveLength(1);
	});
	it('gives a page range in the language\'s form, and French quotations in « » with no-break spaces', () => {
		const en = lines(furtherReading([rc('a', 'i', '2', 'E4', ['KVP2-037'])], inputs('en')));
		expect(en[0].topics[0]).toBe('[i] on E4, bar 2: pp. 18 to 19, Maintaining an Open Throat Across Range, “in fairly close vowel posture until the second harmonic being sung turns over”');
		const fr = lines(furtherReading([rc('a', 'i', '2', 'E4', ['KVP2-037'])], inputs('fr')), true);
		expect(fr[0].topics[0]).toBe('[i] sur E4, mesure 2\u00a0: p.\u00a018-19, Maintaining an Open Throat Across Range, «\u00a0in fairly close vowel posture until the second harmonic being sung turns over\u00a0»');
	});
	it('names the topic without a pitch when the note has none, rather than printing "on ,"', () => {
		const out = lines(furtherReading([rc('a', 'u', '6', '', ['REID-054'])], inputs()));
		expect(out[0].topics[0]).toMatch(/^\[u\], bar 6: p\. 65/);
	});
	it('is empty when nothing cites a row', () => {
		expect(furtherReading([rc('a', 'u', '1', 'D4', [])], inputs())).toEqual([]);
	});
});

describe('Further reading, as drawn', () => {
	const works = furtherReading([rc('a', 'u', '6', 'A3', ['REID-054', 'REID-057']), rc('b', 'i', '8', 'E4', ['REID-057', 'KVP2-037'])], inputs());
	const html = (block: Block) => render(SingerBlock, { props: { block, language: 'en', width: 600 } }).body.replace(/<!--.*?-->/gs, '');
	it('draws the reference on its own line and an indented line per topic, with no numbered list', () => {
		const h = html({ kind: 'endnote', heading: 'Further reading', teacher: 'T', ...works[1] });
		expect(h.match(/class="reference[ "]/g)).toHaveLength(1);
		expect(h.match(/class="reading-topic[ "]/g)).toHaveLength(2);
		expect(h).not.toContain('<ol');
		expect(h.indexOf('class="reference')).toBeLessThan(h.indexOf('class="reading-topic'));
	});
});

/* Dann 2026-11-09 12:10: where the whole list serves exactly one topic, its line prints once and each work carries only its
   pages and passages. These check that rule from both sides: one topic shared by five works lifts the label, two topics keep
   today's form (the second case kills a mutant that always lifts), and a list with one topic is not left labelled under every
   work (the first kills one that never lifts). If the rule fails, "[u] on A3, bar 6:" repeats under each work, or a work loses
   the label of a topic of its own. They relate to `furtherReading`, whose form with labels is unchanged. */
describe('Further reading, one topic for the whole list prints once', () => {
	const FIVE = ['REID-054', 'PVA2-B-014', 'MIL04-028', 'KVP2-037', 'KVP2-022'];
	it('prints the label once when five works serve one topic, and each work shows no label', () => {
		const list = readingList([rc('a', 'u', '6', 'A3', FIVE)], inputs());
		expect(list.works.length).toBeGreaterThanOrEqual(4);
		expect(list.sharedTopic).toBe('[u] on A3, bar 6:');
		for (const w of list.works) {
			const topics = w.topics.map((r) => runsText(r));
			expect(topics.length).toBeGreaterThan(0);
			for (const x of topics) expect(x).not.toContain('bar 6');
			expect(runsText(w.reference)).not.toContain('bar 6');
		}
	});
	it('keeps each work listed once, with its passages joined by semicolons as today', () => {
		const list = readingList([rc('a', 'u', '6', 'A3', ['REID-054', 'REID-057'])], inputs());
		expect(list.works).toHaveLength(1);
		expect(runsText(list.works[0].topics[0]).replace(/\u00a0/g, ' ')).toBe('p. 65, “vowel is incapable of being articulated in the upper tonal regions”; p. 66, “there will be no real reason for modifying the vowel any longer”');
	});
	it('names the topic without a pitch in the same way, once', () => {
		expect(readingList([rc('a', 'u', '6', '', ['REID-054'])], inputs()).sharedTopic).toBe('[u], bar 6:');
	});
	it('says the label in French once, with the no-break space before the colon', () => {
		expect(readingList([rc('a', 'u', '6', 'A3', ['REID-054'])], inputs('fr')).sharedTopic).toBe('[u] sur A3, mesure 6\u00a0:');
	});
	it('changes nothing where the list serves two topics: every line keeps its own label and nothing is shared', () => {
		const comments = [rc('a', 'u', '9', 'D4', ['REID-054']), rc('b', 'i', '6', 'E4', ['REID-057'])];
		const list = readingList(comments, inputs());
		expect(list.sharedTopic).toBeNull();
		expect(list.works.map((w) => w.topics.map((r) => runsText(r)))).toEqual(furtherReading(comments, inputs()).map((w) => w.topics.map((r) => runsText(r))));
		expect(runsText(list.works[0].topics[0])).toMatch(/^\[u\] on D4, bar 9:/);
	});
	it('counts two topics across works, though each work serves one of them', () => {
		const list = readingList([rc('a', 'u', '9', 'D4', ['REID-054']), rc('b', 'i', '6', 'E4', ['MIL04-028'])], inputs());
		expect(list.sharedTopic).toBeNull();
		expect(list.works).toHaveLength(2);
		for (const w of list.works) expect(runsText(w.topics[0])).toMatch(/^\[(u|i)\] on /);
	});
	it('is empty, with no shared topic, when nothing cites a row', () => {
		expect(readingList([rc('a', 'u', '1', 'D4', [])], inputs())).toEqual({ sharedTopic: null, works: [] });
	});
	it('draws the shared topic once, after the teacher line and before the first reference', () => {
		const list = readingList([rc('a', 'u', '6', 'A3', FIVE)], inputs());
		const h = render(SingerBlock, { props: { block: { kind: 'endnote', heading: 'Further reading', teacher: 'T', sharedTopic: list.sharedTopic!, ...list.works[0] } as Block, language: 'en', width: 600 } }).body.replace(/<!--.*?-->/gs, '');
		expect(h.match(/class="shared-topic/g)).toHaveLength(1);
		expect(h.indexOf('class="teacher-c')).toBeLessThan(h.indexOf('class="shared-topic'));
		expect(h.indexOf('class="shared-topic')).toBeLessThan(h.indexOf('class="reference'));
		expect(h).toContain('[u] on A3, bar 6:');
	});
});
