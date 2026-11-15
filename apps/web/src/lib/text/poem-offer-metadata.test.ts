/**
 * An aria's text also fills the song's empty Title, Composer, and Poet (row 182, step 5; Dann 2026-11-09 22:13 for the Title).
 *
 * The real library and the real fixtures, as `poem-offer.test.ts` has them. The page lends the controller `metadata`, a getter and a setter
 * on the song's SongMetadata (in the page, `handleMetadataChange`); here a plain object stands in.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import type { PoemSource } from '$lib/library/types';
import type { SongMetadata } from '$lib/types';
import type { LoadedPoemLibrary, PoemEntry } from './poem-library';
import { emptyWhatWasPut, entryFields, fillEmpty, operaLine, poetKeyOf, putBack } from './poem-metadata';
import { PoemOffer, type OfferDoc } from './poem-offer.svelte';

const ROOT = join(__dirname, '../../../../..');
const manifest = JSON.parse(readFileSync(join(ROOT, 'data/dictionary-manifest.json'), 'utf8'));
const library: LoadedPoemLibrary = { ...JSON.parse(readFileSync(join(ROOT, 'data', manifest.poemFiles[0]), 'utf8')), hash: manifest.poemHash };
const entry = (id: string): PoemEntry => library.entries.find((e) => e.id === id)!;
const fixture = (name: string): string => readFileSync(join(ROOT, 'tools/poems/fixtures', `${name}.lyrics.txt`), 'utf8');

const PIMEN = entry('a478c50e41'); // Mussorgsky, Boris Godunov; the librettist is Pushkin, who is in POETS
const TATYANA = entry('b43e7a4fc6'); // Tchaikovsky, Eugene Onegin; two librettists, so no Poet
const SLIPPERS = entry('221d579b08'); // Tchaikovsky, Cherevichki (the title is the first line exactly as printed, with its punctuation, row 182 step 9); the librettist is Polonsky, who is in POETS

const blank = (): SongMetadata => ({ title: '', composer: '', poet: '', translator: '', opus: '', transcriber: '' });

class Song implements OfferDoc {
	readOnly = false;
	inputText = '';
	publishedPoem = '';
	poemSource: PoemSource | null = null;
	constructor(public id: string) {}
}

interface Rig {
	offer: PoemOffer;
	song: Song;
	meta: SongMetadata;
	writes: number;
}

function rig(withMetadata = true): Rig {
	const r: Rig = { offer: new PoemOffer(), song: new Song('song-a'), meta: blank(), writes: 0 };
	r.offer.attach({
		doc: () => r.song,
		library: Promise.resolve(library),
		put: (text) => {
			const before = r.song.publishedPoem;
			r.song.publishedPoem = text;
			r.offer.onPoemEdit(before, text, 'paste');
		},
		setLyrics: (text) => (r.song.inputText = text),
		laid: { get: () => '', set: () => {} },
		...(withMetadata
			? {
					metadata: {
						get: () => r.meta,
						set: (m: SongMetadata) => {
							r.writes += 1;
							r.meta = m;
						},
					},
				}
			: {}),
	});
	return r;
}

async function paste(r: Rig, text: string): Promise<void> {
	r.song.inputText = text;
	await r.offer.offer(text);
}

let r: Rig;
beforeEach(() => {
	r = rig();
});

describe('what a library entry offers to the empty fields (pure)', () => {
	it('a poem offers nothing: its title is not the song’s and its author is not a composer', () => {
		expect(entryFields(entry('0127a63ffe'))).toEqual({});
	});

	it('an aria offers its title (the opening words), its composer as the dropdown writes it, and its poet where the librettist is in POETS', () => {
		expect(entryFields(PIMEN)).toEqual({ title: PIMEN.title, composer: 'Modest Mussorgsky (1839–1881)', poet: 'Alexander Pushkin (1799–1837)' });
		expect(entryFields(SLIPPERS)).toEqual({ title: SLIPPERS.title, composer: 'Pyotr Tchaikovsky (1840–1893)', poet: 'Yakov Polonsky (1819–1898)' });
	});

	it('leaves Poet empty for two librettists, and for one who is not in POETS: never a Cyrillic string', () => {
		expect(entryFields(TATYANA)).toEqual({ title: TATYANA.title, composer: 'Pyotr Tchaikovsky (1840–1893)' });
		const arias = library.entries.filter((e) => e.kind === 'libretto');
		for (const e of arias) expect(entryFields(e).poet ?? '', e.id).not.toMatch(/[А-Яа-яЁё]/);
		expect(arias.filter((e) => entryFields(e).poet).length).toBe(5); // Pushkin four times, Polonsky once; measured on the 89
		expect(arias.filter((e) => entryFields(e).translator).length).toBe(0);
		expect(poetKeyOf('Александр Сергеевич Пушкин')).toBe('Pushkin, Alexander');
		expect(poetKeyOf('Александр Сергеевич Пушкин и Пётр Ильич Чайковский')).toBeNull();
		expect(poetKeyOf('Пушкин')).toBeNull();
		expect(poetKeyOf('Николай Андреевич Римский-Корсаков')).toBeNull();
	});

	it('every aria’s Title is its opening words and its Composer is one of the dropdown’s own entries', () => {
		for (const e of library.entries.filter((x) => x.kind === 'libretto')) {
			const f = entryFields(e);
			expect(f.title, e.id).toBe(e.title);
			expect(f.composer, e.id).toMatch(/^[A-Za-zÀ-ſ.\- ]+ \(\d{4}–\d{4}\)$/);
		}
	});

	it('fills only the empty fields (whitespace counts as empty), and says what it put', () => {
		const out = fillEmpty({ ...blank(), title: 'My title', poet: '   ' }, { title: 'T', composer: 'C', poet: 'P' });
		expect(out.metadata).toMatchObject({ title: 'My title', composer: 'C', poet: 'P' });
		expect(out.put).toEqual({ composer: 'C', poet: 'P' });
	});

	it('empties only what still holds what was put, and puts it back only into empty fields', () => {
		const put = { title: 'T', composer: 'C' };
		const emptied = emptyWhatWasPut({ ...blank(), title: 'T edited', composer: 'C' }, put);
		expect(emptied.metadata.title).toBe('T edited');
		expect(emptied.metadata.composer).toBe('');
		expect(emptied.emptied).toEqual({ composer: 'C' });
		expect(putBack({ ...blank(), composer: 'Typed since' }, { composer: 'C' }).metadata.composer).toBe('Typed since');
		expect(putBack(blank(), { composer: 'C' }).put).toEqual({ composer: 'C' });
	});

	it('the card’s line: English «role · opera (Russian)», French the same shape with the French names (Dann 2026-11-11 22:18)', () => {
		expect(operaLine(PIMEN.opera!, 'en')).toBe('Pimen · Boris Godunov (Борис Годунов)');
		expect(operaLine(PIMEN.opera!, 'fr')).toBe('Pimène · Boris Godounov (Борис Годунов)');
	});

	/* Closing polish lane, step 4: one French line for each of the 29 operas, with one of its roles, pinned as ratified. */
	const FRENCH_LINES: [string, string, string][] = [
		['Алеко', 'Алеко', 'Aleko \u00b7 Aleko (Алеко)'],
		['Аскольдова могила', 'Неизвестный', 'L’Homme inconnu \u00b7 La Tombe d’Askold (Аскольдова могила)'],
		['Борис Годунов', 'Борис', 'Boris \u00b7 Boris Godounov (Борис Годунов)'],
		['Демон', 'Демон', 'Le Démon \u00b7 Le Démon (Демон)'],
		['Дубровский', 'Дубровский', 'Vladimir Doubrovski \u00b7 Doubrovski (Дубровский)'],
		['Евгений Онегин', 'Гремин', 'Grémine \u00b7 Eugène Onéguine (Евгений Онегин)'],
		['Жизнь за Царя', 'Антонида', 'Antonida \u00b7 Une vie pour le tsar (Жизнь за Царя)'],
		['Золотой петушок', 'Шемаханская царица', 'La Reine de Chemakha \u00b7 Le Coq d’or (Золотой петушок)'],
		['Иоланта', 'Водемон', 'Vaudémont \u00b7 Iolanta (Иоланта)'],
		['Каменный гость', 'Лаура', 'Laura \u00b7 Le Convive de pierre (Каменный гость)'],
		['Князь Игорь', 'Владимир Игоревич', 'Vladimir Igorevitch \u00b7 Le Prince Igor (Князь Игорь)'],
		['Мазепа', 'Андрей', 'Andreï \u00b7 Mazeppa (Мазепа)'],
		['Майская ночь', 'Левко', 'Levko \u00b7 Nuit de mai (Майская ночь)'],
		['Ночь перед Рождеством', 'Оксана', 'Oxana \u00b7 La Nuit de Noël (Ночь перед Рождеством)'],
		['Опричник', 'Наталья', 'Natalia \u00b7 L’Opritchnik (Опричник)'],
		['Орестея', 'Клитемнестра', 'Clytemnestre \u00b7 Oresteïa (Орестея)'],
		['Орлеанская дева', 'Иоанна', 'Jeanne d’Arc \u00b7 La Pucelle d’Orléans (Орлеанская дева)'],
		['Пиковая дама', 'Герман', 'Hermann \u00b7 La Dame de pique (Пиковая дама)'],
		['Русалка', 'Княгиня', 'La Princesse \u00b7 La Roussalka (Русалка)'],
		['Руслан и Людмила', 'Баян', 'Bayan \u00b7 Rouslan et Ludmila (Руслан и Людмила)'],
		['Садко', 'Варяжский гость', 'Le Marchand varègue \u00b7 Sadko (Садко)'],
		['Сказка о царе Салтане', 'Царевич Гвидон', 'Tsarévitch Guidon \u00b7 Le Conte du tsar Saltan (Сказка о царе Салтане)'],
		['Снегурочка', 'Лель', 'Lel \u00b7 Snégourotchka (Снегурочка)'],
		['Франческа да Римини', 'Франческа', 'Francesca \u00b7 Francesca da Rimini (Франческа да Римини)'],
		['Хованщина', 'Марфа', 'Marfa \u00b7 La Khovanchtchina (Хованщина)'],
		['Царская невеста', 'Грязной', 'Griaznoï \u00b7 La Fiancée du tsar (Царская невеста)'],
		['Чародейка', 'Князь', 'Le Prince \u00b7 L’Enchanteresse (Чародейка)'],
		['Черевички', 'Вакула', 'Vakoula \u00b7 Les Souliers de la reine (Черевички)'],
		['Сон на Волге', 'Старуха', 'La Vieille \u00b7 Un rêve sur la Volga (Сон на Волге)'],
	];
	it.each(FRENCH_LINES)('French line, %s, %s', (operaRu, characterRu, line) => {
		const e = library.entries.find((x) => x.opera?.operaRu === operaRu && x.opera?.characterRu === characterRu)!;
		expect(e, `${operaRu} / ${characterRu}`).toBeDefined();
		expect(operaLine(e.opera!, 'fr')).toBe(line);
	});
	it('the table holds all 29 operas, and every libretto entry carries a French opera title and role', () => {
		expect(FRENCH_LINES).toHaveLength(29);
		expect(new Set(FRENCH_LINES.map((l) => l[0])).size).toBe(29);
		const libretti = library.entries.filter((e) => e.kind === 'libretto');
		expect(new Set(libretti.map((e) => e.opera!.operaRu)).size).toBe(29);
		for (const e of libretti) expect(`${e.opera!.operaFr}${e.opera!.characterFr}`).not.toMatch(/'|[А-Яа-яЁё]/);
	});
});

describe('the fill, the decline, and the undo (the controller)', () => {
	it('fills POEM and the empty Title, Composer, and Poet from an aria, tagged as nothing', async () => {
		await paste(r, PIMEN.textModern);
		expect(r.song.poemSource!.id).toBe(PIMEN.id);
		expect(r.song.publishedPoem).toBe(PIMEN.textModern);
		expect(r.meta).toEqual({ ...blank(), title: PIMEN.title, composer: 'Modest Mussorgsky (1839–1881)', poet: 'Alexander Pushkin (1799–1837)' });
		expect(r.writes).toBe(1); // one write through the page's own metadata path
	});

	it('changes nothing she typed: a typed Title and Composer stay, and only the empty Poet fills', async () => {
		r.meta = { ...blank(), title: 'My Pimen', composer: 'Modest Mussorgsky (1839–1881)' };
		await paste(r, PIMEN.textModern);
		expect(r.meta.title).toBe('My Pimen');
		expect(r.meta.composer).toBe('Modest Mussorgsky (1839–1881)');
		expect(r.meta.poet).toBe('Alexander Pushkin (1799–1837)');
	});

	it('writes nothing when she has typed every field it could fill', async () => {
		r.meta = { ...blank(), title: 'a', composer: 'b', poet: 'c' };
		await paste(r, PIMEN.textModern);
		expect(r.writes).toBe(0);
		expect(r.song.poemSource).not.toBeNull(); // POEM still fills
	});

	it('leaves Poet empty for an aria with two librettists', async () => {
		await paste(r, TATYANA.textModern);
		expect(r.meta.title).toBe(TATYANA.title);
		expect(r.meta.composer).toBe('Pyotr Tchaikovsky (1840–1893)');
		expect(r.meta.poet).toBe('');
	});

	it('does not touch the metadata for a poem (row 114 song 2 fills «Весёлый час» into POEM alone)', async () => {
		await paste(r, fixture('r114-song2'));
		expect(r.song.poemSource!.id).toBe('0127a63ffe');
		expect(r.meta).toEqual(blank());
		expect(r.writes).toBe(0);
	});

	it('fills POEM alone where the page lends no metadata', async () => {
		const bare = rig(false);
		await paste(bare, PIMEN.textModern);
		expect(bare.song.poemSource!.id).toBe(PIMEN.id);
		expect(bare.meta).toEqual(blank());
	});

	it('does not fill a read-only song, or one that already has a poem', async () => {
		r.song.readOnly = true;
		await paste(r, PIMEN.textModern);
		expect(r.meta).toEqual(blank());
		const other = rig();
		other.song.publishedPoem = 'her own poem';
		await paste(other, PIMEN.textModern);
		expect(other.meta).toEqual(blank());
	});

	it('"Not this poem" empties the fields the fill put, keeps one she edited since, and Undo puts them back', async () => {
		await paste(r, PIMEN.textModern);
		r.meta = { ...r.meta, title: 'My own title' }; // she edited the Title after the fill
		r.offer.decline();
		expect(r.song.poemSource).toBeNull();
		expect(r.meta.title).toBe('My own title');
		expect(r.meta.composer).toBe('');
		expect(r.meta.poet).toBe('');
		r.offer.undo();
		expect(r.song.poemSource!.id).toBe(PIMEN.id);
		expect(r.meta.title).toBe('My own title'); // not overwritten by Undo
		expect(r.meta.composer).toBe('Modest Mussorgsky (1839–1881)');
		expect(r.meta.poet).toBe('Alexander Pushkin (1799–1837)');
	});

	it('Undo does not overwrite a field she typed after the decline', async () => {
		await paste(r, PIMEN.textModern);
		r.offer.decline();
		r.meta = { ...r.meta, composer: 'Someone Else' };
		// typing into a field ends nothing about the poem's Undo; the field she typed stays hers
		r.offer.undo();
		expect(r.meta.composer).toBe('Someone Else');
		expect(r.meta.title).toBe(PIMEN.title);
	});

	it('keeping the poem keeps the fields, and a later decline is not offered', async () => {
		await paste(r, PIMEN.textModern);
		r.offer.keep();
		r.offer.decline(); // answered: nothing happens
		expect(r.meta.title).toBe(PIMEN.title);
		expect(r.song.poemSource).not.toBeNull();
	});

	it('editing the poem makes the fields hers as well: a later decline cannot empty them', async () => {
		await paste(r, PIMEN.textModern);
		r.offer.onPoemEdit(r.song.publishedPoem, r.song.publishedPoem + ' ', 'typing');
		r.song.publishedPoem += ' ';
		r.offer.decline(); // answered by the edit
		expect(r.meta.title).toBe(PIMEN.title);
	});
});
