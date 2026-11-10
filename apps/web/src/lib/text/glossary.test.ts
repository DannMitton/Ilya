/**
 * Row 179, step 2: the personal glossary (`glossary.ts`, `glossary.svelte.ts`).
 * Brief: `docs/sessions/brief-code-gloss-language-and-reuse_r3_2026-11-03.md`.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { GLOSSARY_KEY, glossaryKey, parseGlossary, readGlossary, serializeGlossary, writeGlossary } from './glossary';
import { GlossaryStore } from './glossary.svelte';
import { glossFor, glossToWrite, resolvedGlosses, type GlossEdit } from './gloss-edit';
import { resetWord } from '$lib/word-reset';
import { fieldsFromRecord, recordFromFields } from '$lib/library/library';
import { emptySongRecord } from '$lib/library/types';

/** A `Storage` stand-in, with a way to refuse. */
function fakeStorage(refuse?: DOMException | Error) {
	const data = new Map<string, string>();
	return {
		data,
		getItem: (k: string) => data.get(k) ?? null,
		setItem: (k: string, v: string) => {
			if (refuse) throw refuse;
			data.set(k, v);
		},
	} as unknown as Storage & { data: Map<string, string> };
}

const you = { cleanWord: 'вас', gloss: '', lemma: 'вы', lineIndex: 0, wordIndex: 0 };

describe('the glossary is keyed by (lemma, language)', () => {
	it('one entry reads on every form of the lemma, in its language only', () => {
		const store = new GlossaryStore(fakeStorage());
		expect(store.set('вы', 'вас', 'fr', 'vous')).toEqual({ ok: true });
		expect(store.get('вы', 'вам', 'fr')).toBe('vous');
		expect(store.get('вы', 'вами', 'fr')).toBe('vous');
		expect(store.get('вы', 'вас', 'en')).toBeUndefined();
	});

	it('stands on the word form where the dictionary found no lemma, folding case and ё', () => {
		const store = new GlossaryStore(fakeStorage());
		store.set('', 'Всё', 'fr', 'tout');
		expect(store.get('', 'всё', 'fr')).toBe('tout');
		expect(store.get('', 'все', 'fr')).toBe('tout');
		expect(store.get('', 'вся', 'fr')).toBeUndefined();
		expect(glossaryKey('', 'вас', 'fr')).not.toBe(glossaryKey('вас', 'вас', 'fr'));
	});

	it('keys a personal pronoun by its form: the dictionary gives them all the lemma я', () => {
		const store = new GlossaryStore(fakeStorage());
		store.set('я', 'вас', 'fr', 'vous');
		expect(store.get('я', 'вас', 'fr')).toBe('vous');
		expect(store.get('я', 'ты', 'fr')).toBeUndefined();
		expect(store.get('я', 'он', 'fr')).toBeUndefined();
		expect(store.get('Я', 'Вас', 'fr')).toBe('vous');
	});
});

describe('the store, on profileStore.ts\'s pattern', () => {
	it('is kept on the device under a versioned key and read back by a new store', () => {
		const storage = fakeStorage();
		new GlossaryStore(storage).set('вы', 'вас', 'fr', 'vous');
		expect(JSON.parse(storage.data.get(GLOSSARY_KEY)!).version).toBe(1);
		expect(new GlossaryStore(storage).get('вы', 'вас', 'fr')).toBe('vous');
	});

	it('is an empty glossary, not an error, where storage is refused or holds damage', () => {
		expect(new GlossaryStore(undefined).get('вы', 'вас', 'fr')).toBeUndefined();
		const damaged = fakeStorage();
		damaged.data.set(GLOSSARY_KEY, '{not json');
		expect(readGlossary(damaged).size).toBe(0);
		damaged.data.set(GLOSSARY_KEY, JSON.stringify({ version: 2, entries: [['lemma', 'вы', 'fr', 'vous']] }));
		expect(readGlossary(damaged).size).toBe(0);
		expect(parseGlossary(JSON.stringify({ version: 1, entries: [['lemma', 'вы', 'de', 'x'], ['lemma', 'вы', 'fr', '']] })).size).toBe(0);
	});

	it('reports why a write was refused and never throws', () => {
		expect(writeGlossary(undefined, new Map())).toEqual({ ok: false, reason: 'no-storage' });
		expect(writeGlossary(fakeStorage(new DOMException('full', 'QuotaExceededError')), new Map())).toEqual({ ok: false, reason: 'quota-exceeded' });
		expect(writeGlossary(fakeStorage(new Error('nope')), new Map())).toEqual({ ok: false, reason: 'write-failed' });
	});

	it('does not make an entry the device did not keep', () => {
		const store = new GlossaryStore(fakeStorage(new DOMException('full', 'QuotaExceededError')));
		expect(store.set('вы', 'вас', 'fr', 'vous')).toEqual({ ok: false, reason: 'quota-exceeded' });
		expect(store.get('вы', 'вас', 'fr')).toBeUndefined();
	});

	it('removes an entry and leaves the others; an empty gloss is not an entry', () => {
		const store = new GlossaryStore(fakeStorage());
		store.set('вы', 'вас', 'fr', 'vous');
		store.set('вы', 'вас', 'en', 'you');
		expect(store.remove('вы', 'вас', 'fr')).toEqual({ ok: true });
		expect(store.get('вы', 'вас', 'fr')).toBeUndefined();
		expect(store.get('вы', 'вас', 'en')).toBe('you');
		store.set('вы', 'вас', 'en', '');
		expect(store.get('вы', 'вас', 'en')).toBeUndefined();
		expect(serializeGlossary(new Map())).toBe('{"version":1,"entries":[]}');
	});
});

describe('the glossary fills a gap and nothing else (walk items 5 and 7)', () => {
	const store = new GlossaryStore(fakeStorage());
	store.set('вы', 'вас', 'fr', 'vous');

	it('reaches the readers as its own source, never as an edit of the song', () => {
		const lines = [{ words: [you, { ...you, wordIndex: 1, cleanWord: 'дом', lemma: 'дом', gloss: 'maison' }] }];
		const shown = resolvedGlosses(lines, new Map(), 'fr', store);
		expect([...shown]).toEqual([['0-0', { text: 'vous', source: 'glossary' }]]);
		expect(glossFor(you, 'fr', undefined, store).source).not.toBe('song');
	});

	it('never replaces a gloss the dictionary has, and does not show in the other language', () => {
		expect(glossFor({ ...you, gloss: 'vous-même' }, 'fr', undefined, store)).toEqual({ text: 'vous-même', source: 'dictionary' });
		expect(glossFor(you, 'en', undefined, store).source).toBe('none');
	});

	it('is set aside by the song\'s own edit, including her empty one', () => {
		expect(glossFor(you, 'fr', { fr: 'tu' }, store)).toEqual({ text: 'tu', source: 'song' });
		expect(glossFor(you, 'fr', { fr: '' }, store)).toEqual({ text: '', source: 'song' });
	});

	it('Reset on an explicit empty edit over a fill shows the fill again', () => {
		const empty = new Map<string, unknown>();
		const edits = new Map<string, GlossEdit>([['0-0', { fr: '' }]]);
		const r = resetWord('0-0', { stress: empty, yo: empty, syllables: empty, spot: empty, glosses: edits, anchors: new Map([['0-0', 'вас']]) });
		expect(r.glosses!.size).toBe(0);
		expect(glossFor(you, 'fr', r.glosses!.get('0-0'), store)).toEqual({ text: 'vous', source: 'glossary' });
	});

	it('a word the singer never edited shows no Reset: the fill is not an edit', () => {
		// `hasOverrides` in the Inspector reads `gloss?.source === 'song'`.
		expect(glossFor(you, 'fr', undefined, store).source === 'song').toBe(false);
		expect(glossFor(you, 'fr', { fr: '' }, store).source === 'song').toBe(true);
	});
});

describe('what the Inspector\'s field writes (walk items 5 and 7)', () => {
	it('blanking a field the glossary fills writes her "no gloss here", and the fill does not come back', () => {
		expect(glossToWrite('', '', 'vous')).toBe('');
	});
	it('blanking a field the dictionary fills, or a field nothing fills, reverts', () => {
		expect(glossToWrite('', 'house', 'maison')).toBeNull();
		expect(glossToWrite('', '', undefined)).toBeNull();
	});
	it('typing the dictionary\'s own gloss reverts; typing anything else is an edit, the glossary\'s own text included', () => {
		expect(glossToWrite('house', 'house', undefined)).toBeNull();
		expect(glossToWrite('home', 'house', undefined)).toBe('home');
		expect(glossToWrite('vous', '', 'vous')).toBe('vous');
	});
});

describe('the glossary is the device\'s and no song\'s', () => {
	it('is not in the song record, the page\'s fields, or a record built from them', () => {
		const store = new GlossaryStore(fakeStorage());
		store.set('вы', 'вас', 'fr', 'vous-glossaire-unique');
		const base = emptySongRecord('x', '2026-11-10T00:00:00.000Z');
		expect(JSON.stringify(recordFromFields(base, fieldsFromRecord(base)))).not.toContain('vous-glossaire-unique');
		expect(Object.keys(fieldsFromRecord(base))).not.toContain('glossary');
	});

	it('is written to localStorage only: the two modules name no network call', () => {
		const NETWORK = /\b(fetch|XMLHttpRequest|sendBeacon|WebSocket|EventSource|navigator\.share)\b\s*\(|new\s+(XMLHttpRequest|WebSocket|EventSource)\b|\bimportScripts\b|indexedDB|sessionStorage|document\.cookie/;
		for (const file of ['glossary.ts', 'glossary.svelte.ts']) {
			const code = readFileSync(join(__dirname, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
			expect(code).not.toMatch(NETWORK);
		}
	});
});
