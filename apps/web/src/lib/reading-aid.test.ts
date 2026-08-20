/**
 * Tests for the reading aid's verse arithmetic and for the one flag that
 * feeds it (N.73 portrait C, ruled by Dann 2026-08-18, ruling 5).
 *
 * WHY THESE EXIST AS A GATE RATHER THAN AS A WALK. The aid draws a line rule
 * where the poem breaks and closes each verse with an end mark. Before this
 * item nothing in the tree knew where a poem breaks: `processText` drops
 * blank lines at `pipeline.ts` step 1, so the singer's stanza breaks were
 * destroyed before `LineData` existed. The cure is one flag, `endsStanza`,
 * read from the singer's own blank lines. A flag that silently stopped being
 * set would take the rules and the end marks with it and nothing on screen
 * would say so, which is what a gate is for.
 *
 * FIXTURE PROVENANCE. The Russian is the opening of Pushkin's
 * «Я вас любил», which is the app's own test text and already appears in the
 * mockup's exhibit 1. Nothing here asserts a transcription: these tests read
 * only line counts and the stanza flag, so they hold whether or not the
 * dictionary is loaded, and they make no claim about IPA.
 */

import { describe, expect, it } from 'vitest';
import { processText } from './pipeline';
import { groupIntoVerses } from './reading-aid';
import type { LineData } from './types';

/** A line carrying nothing but the flag under test. */
function line(lineNumber: number, endsStanza = false): LineData {
	return { lineNumber, words: [], endsStanza };
}

describe('endsStanza, read from the singer’s own blank lines', () => {
	it('is false through a block with no blank lines, and on the last line', () => {
		const lines = processText('Я вас любил\nВ душе моей\nЯ не хочу');
		expect(lines.map((l) => l.endsStanza)).toEqual([false, false, false]);
	});

	it('is true on the line a blank line follows, and only there', () => {
		const lines = processText('Я вас любил\nВ душе моей\n\nЯ не хочу\nТо робостью');
		expect(lines.map((l) => l.endsStanza)).toEqual([false, true, false, false]);
	});

	it('a run of blank lines is one break, not several', () => {
		const lines = processText('Я вас любил\n\n\n\nЯ не хочу');
		expect(lines.map((l) => l.endsStanza)).toEqual([true, false]);
		expect(lines).toHaveLength(2);
	});

	it('a blank line at the end sets the flag and adds no line', () => {
		const lines = processText('Я вас любил\nВ душе моей\n');
		expect(lines).toHaveLength(2);
		expect(lines[1].endsStanza).toBe(true);
	});

	it('a whitespace-only line counts as blank', () => {
		const lines = processText('Я вас любил\n   \t \nЯ не хочу');
		expect(lines.map((l) => l.endsStanza)).toEqual([true, false]);
	});

	it('blank lines still leave the document itself unchanged', () => {
		const withBreak = processText('Я вас любил\n\nЯ не хочу');
		const without = processText('Я вас любил\nЯ не хочу');
		expect(withBreak.map((l) => l.words.length)).toEqual(without.map((l) => l.words.length));
		expect(withBreak.map((l) => l.lineNumber)).toEqual([0, 1]);
	});
});

describe('groupIntoVerses', () => {
	it('a document with no break is one verse', () => {
		expect(groupIntoVerses([line(0), line(1), line(2)])).toHaveLength(1);
	});

	it('splits at the flag and keeps the flagged line with the verse it closes', () => {
		const verses = groupIntoVerses([line(0), line(1, true), line(2), line(3)]);
		expect(verses.map((v) => v.map((l) => l.lineNumber))).toEqual([[0, 1], [2, 3]]);
	});

	it('a trailing flag opens no empty verse', () => {
		const verses = groupIntoVerses([line(0), line(1, true)]);
		expect(verses).toHaveLength(1);
		expect(verses[0].map((l) => l.lineNumber)).toEqual([0, 1]);
	});

	it('an empty document is no verses, so the aid draws no end mark', () => {
		expect(groupIntoVerses([])).toEqual([]);
	});

	it('end to end: three stanzas of two lines each read as three verses', () => {
		const poem = [
			'Я вас любил: любовь ещё, быть может,',
			'В душе моей угасла не совсем;',
			'',
			'Но пусть она вас больше не тревожит;',
			'Я не хочу печалить вас ничем.',
			'',
			'Я вас любил безмолвно, безнадежно,',
			'То робостью, то ревностью томим;',
		].join('\n');
		const verses = groupIntoVerses(processText(poem));
		expect(verses).toHaveLength(3);
		expect(verses.map((v) => v.length)).toEqual([2, 2, 2]);
	});
});
