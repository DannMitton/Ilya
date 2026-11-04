/**
 * 2026-11-03: an observation's other approaches are a plain second paragraph of
 * the same observation, same type, no label, drawn after the first paragraph and
 * before the teacher line. The one snippet draws it on the page and inside
 * "N more observations" alike. The opening sentence is a desk draft.
 */
import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import type { RenderedComment } from './comment-text';
import type { Block } from './singer-blocks';
import SingerBlock from './SingerBlock.svelte';

const rc = (id: string, withHidden: boolean): RenderedComment =>
	({
		comment: { eventId: id, measureIndex: 0, vowel: 'u' },
		frame: [{ text: 'This [u] is sustained.' }],
		consequence: [],
		visible: [{ id: 's1', runs: [{ text: 'First approach.' }] }],
		hidden: withHidden ? [{ id: 's2', runs: [{ text: 'Second approach' }, { text: ' (Reid, ' }, { text: 'Voice', title: true }, { text: ', 1975, p. 66).' }] }] : [],
		otherApproaches: withHidden ? [{ text: 'There is another way in.' }] : [],
		rows: [],
		references: [],
		printedRows: [],
		count: '',
		namedFR1: false,
	}) as unknown as RenderedComment;

const html = (block: Block) => render(SingerBlock, { props: { block, language: 'en', width: 600, open: true } }).body.replace(/<!--.*?-->/gs, '');
const bodies = (h: string) => [...h.matchAll(/<p class="body[^"]*">(.*?)<\/p>/gs)].map((m) => m[1].replace(/<[^>]+>/g, ''));

describe('the second paragraph, as drawn', () => {
	it('follows the first paragraph and precedes the teacher line, with the other approach and its citation', () => {
		const h = html({ kind: 'comment', tag: 'm. 1 · E4', comment: rc('a', true), teacher: 'Discuss this approach with your voice teacher.' });
		const [first, second] = bodies(h);
		expect(first).toBe('This [u] is sustained. First approach.');
		expect(second).toBe('There is another way in. Second approach (Reid, Voice, 1975, p. 66).');
		expect(h.indexOf('There is another way in.')).toBeLessThan(h.indexOf('Discuss this approach'));
		expect(h).not.toContain('class="section-head"');
	});
	it('draws no second paragraph for an observation with nothing hidden', () => {
		expect(bodies(html({ kind: 'comment', tag: 'm. 1 · E4', comment: rc('a', false) }))).toHaveLength(1);
	});
	it('draws it inside "N more observations" as well', () => {
		const h = html({ kind: 'more', label: 'One more observation', comments: [{ tag: 'm. 2 · F4', comment: rc('b', true) }] });
		expect(bodies(h)).toHaveLength(2);
	});
});
