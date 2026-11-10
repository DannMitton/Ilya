/**
 * Row 179, step 1: an edited gloss carries its language, and one function says
 * which gloss a word shows (`gloss-edit.ts`). Walk items 6 and 8 of the brief
 * (`docs/sessions/brief-code-gloss-language-and-reuse_r3_2026-11-03.md`).
 */
import { describe, it, expect } from 'vitest';
import { editsFromRows, glossFor, resolvedGlosses, rowsFromEdits, withGlossEdit, type GlossEdit, type GlossaryLookup } from './gloss-edit';
import { resetWord } from '$lib/word-reset';
import { fieldsFromRecord, recordFromFields, validateRecord } from '$lib/library/library';
import { emptySongRecord, type GlossRow } from '$lib/library/types';

const NOW = '2026-11-10T00:00:00.000Z';
const word = { cleanWord: 'вас', gloss: '', lemma: 'вы', lineIndex: 0, wordIndex: 0 };
const noGlossary: GlossaryLookup = { get: () => undefined };

describe('a gloss edit carries its language (walk item 6)', () => {
	it('an English edit shows in English and not in French', () => {
		const edits = new Map<string, GlossEdit>([['0-0', { en: 'you' }]]);
		expect(glossFor(word, 'en', edits.get('0-0'), noGlossary)).toEqual({ text: 'you', source: 'song' });
		expect(glossFor(word, 'fr', edits.get('0-0'), noGlossary)).toEqual({ text: '', source: 'none' });
	});

	it('a French edit shows in French and not in English, and the dictionary stands where it has the language', () => {
		const edit: GlossEdit = { fr: 'vous' };
		expect(glossFor(word, 'fr', edit, noGlossary)).toEqual({ text: 'vous', source: 'song' });
		expect(glossFor(word, 'en', edit, noGlossary)).toEqual({ text: '', source: 'none' });
		expect(glossFor({ ...word, gloss: 'you' }, 'en', edit, noGlossary)).toEqual({ text: 'you', source: 'dictionary' });
	});

	it('an empty edit is the singer\'s "no gloss here", not an absence', () => {
		expect(glossFor({ ...word, gloss: 'you' }, 'en', { en: '' }, noGlossary)).toEqual({ text: '', source: 'song' });
	});

	it('the glossary fills only where the dictionary\'s gloss is empty and the song has no edit of its own', () => {
		const glossary: GlossaryLookup = { get: (lemma, _form, language) => (lemma === 'вы' && language === 'fr' ? 'vous' : undefined) };
		expect(glossFor(word, 'fr', undefined, glossary)).toEqual({ text: 'vous', source: 'glossary' });
		expect(glossFor({ ...word, gloss: 'vous' }, 'fr', undefined, glossary).source).toBe('dictionary');
		expect(glossFor(word, 'fr', { fr: 'tu' }, glossary)).toEqual({ text: 'tu', source: 'song' });
		expect(glossFor(word, 'en', undefined, glossary).source).toBe('none');
	});

	it('the readers receive an entry only for the words the song or the glossary decides', () => {
		const lines = [{ words: [word, { ...word, wordIndex: 1, cleanWord: 'дом', gloss: 'house' }] }];
		const edits = new Map<string, GlossEdit>([['0-1', { fr: 'maison' }]]);
		expect([...resolvedGlosses(lines, edits, 'en', noGlossary)]).toEqual([]);
		expect([...resolvedGlosses(lines, edits, 'fr', noGlossary)]).toEqual([['0-1', { text: 'maison', source: 'song' }]]);
	});
});

describe('the stored row (walk item 6, legacy rows)', () => {
	it('a legacy row, with no fourth element, reads as English and shows nothing in French', () => {
		const { edits } = editsFromRows([['0-0', 'you', 'вас']]);
		expect(edits.get('0-0')).toEqual({ en: 'you' });
		expect(glossFor(word, 'en', edits.get('0-0'), noGlossary).text).toBe('you');
		expect(glossFor(word, 'fr', edits.get('0-0'), noGlossary).source).toBe('none');
	});

	it('a fourth element that is neither en nor fr reads as absent, which is English, and is not malformed', () => {
		const odd = [['0-0', 'you', 'вас', 'de']] as unknown as GlossRow[];
		expect(editsFromRows(odd).edits.get('0-0')).toEqual({ en: 'you' });
		const validated = validateRecord({ glosses: odd }, 'x', NOW);
		expect(validated.reason).toBeUndefined();
		expect(fieldsFromRecord(validated.record).glossOverrides.get('0-0')).toEqual({ en: 'you' });
	});

	it('two rows on one key are one edit in two languages, written back tagged, English then French', () => {
		const rows: GlossRow[] = [['0-0', 'vous', 'вас', 'fr'], ['0-0', 'you', 'вас', 'en']];
		const { edits, anchors } = editsFromRows(rows);
		expect(edits.get('0-0')).toEqual({ fr: 'vous', en: 'you' });
		expect(rowsFromEdits(edits, anchors)).toEqual([['0-0', 'you', 'вас', 'en'], ['0-0', 'vous', 'вас', 'fr']]);
	});

	it('a legacy row is written tagged on the next ordinary save, and nothing else changes', () => {
		const base = { ...emptySongRecord('x', NOW), glosses: [['0-0', 'you', 'вас']] as GlossRow[] };
		const stored = recordFromFields(base, fieldsFromRecord(base));
		expect(stored.glosses).toEqual([['0-0', 'you', 'вас', 'en']]);
	});

	it('survives JSON, as a binder carries the record whole', () => {
		const base = { ...emptySongRecord('x', NOW), glosses: [['0-0', 'vous', 'вас', 'fr']] as GlossRow[] };
		const back = validateRecord(JSON.parse(JSON.stringify(recordFromFields(base, fieldsFromRecord(base)))), 'x', NOW);
		expect(back.record.glosses).toEqual([['0-0', 'vous', 'вас', 'fr']]);
	});
});

describe('withGlossEdit', () => {
	const anchors = new Map([['0-0', 'вас']]);

	it('sets one language and leaves the other', () => {
		const [edits, nextAnchors] = withGlossEdit(new Map([['0-0', { en: 'you' }]]), anchors, '0-0', 'fr', 'vous', 'вас');
		expect(edits.get('0-0')).toEqual({ en: 'you', fr: 'vous' });
		expect(nextAnchors.get('0-0')).toBe('вас');
	});

	it('takes one language away and keeps the key while the other stands; takes the key and its anchor when none does', () => {
		const both = new Map([['0-0', { en: 'you', fr: 'vous' }]]);
		const [one, oneAnchors] = withGlossEdit(both, anchors, '0-0', 'en', null, 'вас');
		expect(one.get('0-0')).toEqual({ fr: 'vous' });
		expect(oneAnchors.has('0-0')).toBe(true);
		const [none, noneAnchors] = withGlossEdit(one, oneAnchors, '0-0', 'fr', null, 'вас');
		expect(none.has('0-0')).toBe(false);
		expect(noneAnchors.has('0-0')).toBe(false);
	});

	it('does not change the maps it was given', () => {
		const given = new Map([['0-0', { en: 'you' }]]);
		withGlossEdit(given, anchors, '0-0', 'en', 'thou', 'вас');
		expect(given.get('0-0')).toEqual({ en: 'you' });
	});
});

describe('Reset (walk item 8)', () => {
	it('clears the word\'s edit in both languages at once, and its anchor', () => {
		const empty = new Map<string, unknown>();
		const r = resetWord('0-0', {
			stress: empty, yo: empty, syllables: empty, spot: empty,
			glosses: new Map<string, GlossEdit>([['0-0', { en: 'you', fr: 'vous' }], ['0-1', { fr: 'dame' }]]),
			anchors: new Map([['0-0', 'вас'], ['0-1', 'дама']]),
		});
		expect([...r.glosses!]).toEqual([['0-1', { fr: 'dame' }]]);
		expect([...r.anchors!]).toEqual([['0-1', 'дама']]);
	});
});
