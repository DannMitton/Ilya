/**
 * The singer's walk, item by item (poem library, build 1, step 4), on the real library and the real fixtures.
 *
 * The page lends the controller a song, the library, and three functions. Here the song is a plain object and the
 * three functions do what the page's do: `put` writes the Poem and runs the same hook the page runs after a Poem
 * edit, and may re-line Lyrics as `adoptPoemLines` does for a scan. (Runes are inert under this suite, so the class
 * is the logic alone; the card that reads it is step 5's, and its walk is step 6's.)
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import type { PoemSource } from '$lib/library/types';
import { routePoemPage } from './poem-page';
import type { LoadedPoemLibrary } from './poem-library';
import { PoemOffer, type OfferDoc } from './poem-offer.svelte';

const ROOT = join(__dirname, '../../../../..');
const manifest = JSON.parse(readFileSync(join(ROOT, 'data/dictionary-manifest.json'), 'utf8'));
const library: LoadedPoemLibrary = { ...JSON.parse(readFileSync(join(ROOT, 'data', manifest.poemFiles[0]), 'utf8')), hash: manifest.poemHash };
const fixture = (name: string): string => readFileSync(join(ROOT, 'tools/poems/fixtures', `${name}.lyrics.txt`), 'utf8');

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
	/** Songs by id, so a test can switch the open one. */
	open: (id: string) => Song;
	laid: string;
	/** What `put` does to Lyrics, as `adoptPoemLines` does for a score's words: re-line them. */
	reline: ((text: string) => string) | null;
	puts: string[];
	lyricsSets: string[];
	/** Resolve the library promise now. */
	ready: () => void;
}

function rig(lib: LoadedPoemLibrary | null = library, resolveNow = true): Rig {
	const songs = new Map<string, Song>();
	const get = (id: string) => songs.get(id) ?? songs.set(id, new Song(id)).get(id)!;
	let release!: () => void;
	const promise = new Promise<LoadedPoemLibrary | null>((resolve) => (release = () => resolve(lib)));
	const offer = new PoemOffer();
	const r: Rig = {
		offer,
		song: get('song-a'),
		open: (id) => (r.song = get(id)),
		laid: 'laid-before',
		reline: null,
		puts: [],
		lyricsSets: [],
		ready: release,
	};
	offer.attach({
		doc: () => r.song,
		library: promise,
		put: (text) => {
			const before = r.song.publishedPoem;
			r.puts.push(text);
			r.song.publishedPoem = text;
			offer.onPoemEdit(before, text, 'paste'); // the page's hook, which must ignore the library's own fill
			if (r.reline) r.song.inputText = r.reline(r.song.inputText); // adoptPoemLines, for a score's words
			if (r.reline) r.laid = r.song.inputText;
		},
		setLyrics: (text) => {
			r.lyricsSets.push(text);
			r.song.inputText = text;
		},
		laid: { get: () => r.laid, set: (v) => (r.laid = v) },
	});
	if (resolveNow) release();
	return r;
}

/** A paste of these Lyrics into an empty song, as the page does it: set them, then offer. */
async function paste(r: Rig, text: string): Promise<void> {
	r.song.inputText = text;
	await r.offer.offer(text);
}

const SONG2 = fixture('r114-song2');
/** A scan's Lyrics are one line; `adoptPoemLines` re-lines them to the poem's. Four words to a line stands in for that. */
const reflowed = (text: string): string => text.split(/\s+/).filter(Boolean).reduce<string[]>((lines, w, i) => (i % 4 === 0 ? [...lines, w] : [...lines.slice(0, -1), `${lines[lines.length - 1]} ${w}`]), []).join('\n');

let r: Rig;
beforeEach(() => {
	r = rig();
});

describe('walk 1: she sees a card above the field', () => {
	it('row 114 song 2 fills «Весёлый час» into Poem, unanswered, with the poet and the first line', async () => {
		await paste(r, SONG2);
		const src = r.song.poemSource!;
		expect(src).toMatchObject({ work: '0127a63f', id: '0127a63ffe', poemHash: manifest.poemHash, answered: false, edited: false });
		expect(r.song.publishedPoem).toBe(library.entries.find((e) => e.id === '0127a63ffe')!.textModern);
		const now = r.offer.current()!;
		expect(now.resolved.entry.title).toBe('Весёлый час');
		expect(now.resolved.firstLine).toBe('Дайте бокалы!');
		expect(now.resolved.entry.author).toBe('Алексей Васильевич Кольцов');
		expect(now.resolved.entry.translator).toBeNull();
		expect(now.resolved.entry.source.site).toBe('Russian Wikisource');
		expect(now.resolved.entry.spelling).toBe('modern');
		expect(now.resolved.passage).toBe(false);
	});

	it('goes through the path a pasted poem takes (`put`), once, with the poem’s own text', async () => {
		await paste(r, SONG2);
		expect(r.puts).toEqual([r.song.publishedPoem]);
	});

	it('the title and author are looked up by work and never stored', async () => {
		await paste(r, SONG2);
		const stored = JSON.stringify(r.song.poemSource);
		expect(stored).not.toContain('Весёлый');
		expect(stored).not.toContain('Кольцов');
		expect(Object.keys(r.song.poemSource!).sort()).toEqual(['answered', 'edited', 'end', 'id', 'poemHash', 'start', 'work']);
	});

	it('a translator’s Russian carries the translator (the data’s own field)', async () => {
		const heine = library.entries.find((e) => e.translator)!;
		expect(heine.translator).toBe('Фёдор Иванович Тютчев');
		const only: LoadedPoemLibrary = { ...library, entries: [heine, ...library.entries.filter((e) => e.work !== heine.work).slice(0, 2)] };
		r = rig(only);
		await paste(r, heine.textModern);
		expect(r.offer.current()!.resolved.entry.translator).toBe('Фёдор Иванович Тютчев');
	});
});

describe('walk 3: she taps Keep this poem', () => {
	it('answers the card; the poem and Lyrics are untouched', async () => {
		await paste(r, SONG2);
		const poem = r.song.publishedPoem;
		r.offer.keep();
		expect(r.song.poemSource).toMatchObject({ answered: true, edited: false });
		expect(r.song.publishedPoem).toBe(poem);
		expect(r.song.inputText).toBe(SONG2);
		expect(r.offer.current()!.source.answered).toBe(true); // the quiet line reads this
	});

	it('is a no-op with no card, and a second tap changes nothing', async () => {
		r.offer.keep();
		expect(r.song.poemSource).toBeNull();
		await paste(r, SONG2);
		r.offer.keep();
		const once = { ...r.song.poemSource! };
		r.offer.keep();
		expect(r.song.poemSource).toEqual(once);
	});

	it('after Keep, "Not this poem" is not offered: decline does nothing', async () => {
		await paste(r, SONG2);
		r.offer.keep();
		r.offer.decline();
		expect(r.song.publishedPoem).not.toBe('');
		expect(r.song.poemSource!.answered).toBe(true);
	});
});

describe('walk 4: she taps Not this poem', () => {
	it('empties Poem, clears the source, and returns Lyrics byte for byte as they were', async () => {
		r.reline = reflowed;
		await paste(r, SONG2);
		expect(r.song.inputText).not.toBe(SONG2); // the arrival re-lined Lyrics, as a score’s words are
		const lyricsAsFilled = r.song.inputText;
		const laidAsFilled = r.laid;
		r.offer.decline();
		expect(r.song.publishedPoem).toBe('');
		expect(r.song.poemSource).toBeNull();
		expect(r.song.inputText).toBe(SONG2);
		expect(r.laid).toBe('laid-before');
		expect(r.lyricsSets).toEqual([SONG2]);
		expect(lyricsAsFilled).not.toBe(r.song.inputText);
		expect(laidAsFilled).not.toBe(r.laid);
		expect(r.offer.removedFor('song-a')).not.toBeNull(); // "Poem removed." with Undo
	});

	it('leaves Lyrics alone when the fill did not change them (a paste into an empty song)', async () => {
		await paste(r, SONG2);
		r.offer.decline();
		expect(r.song.inputText).toBe(SONG2);
		expect(r.lyricsSets).toEqual([]);
	});

	it('does not offer that poem for that song again this session, but does for another song', async () => {
		await paste(r, SONG2);
		r.offer.decline();
		r.song.inputText = '';
		await paste(r, SONG2); // the same song, the same work
		expect(r.song.poemSource).toBeNull();
		expect(r.song.publishedPoem).toBe('');
		const other = r.open('song-b');
		await paste(r, SONG2); // another song, the same work
		expect(other.poemSource).not.toBeNull();
	});

	it('does not offer the declined work, though another work still fills in that song', async () => {
		await paste(r, SONG2);
		r.offer.decline();
		r.song.inputText = '';
		await paste(r, fixture('r114-song3'));
		expect(r.song.poemSource!.work).toBe('307359f1');
	});

	it('Undo restores the poem, the source, Lyrics as filled, and the card (unanswered)', async () => {
		r.reline = reflowed;
		await paste(r, SONG2);
		const poem = r.song.publishedPoem;
		const source = { ...r.song.poemSource! };
		const lyricsAsFilled = r.song.inputText;
		const laidAsFilled = r.laid;
		r.offer.decline();
		r.offer.undo();
		expect(r.song.publishedPoem).toBe(poem);
		expect(r.song.poemSource).toEqual(source);
		expect(r.song.poemSource!.answered).toBe(false);
		expect(r.song.inputText).toBe(lyricsAsFilled);
		expect(r.laid).toBe(laidAsFilled);
		expect(r.offer.removedFor('song-a')).toBeNull();
	});

	it('Undo makes the poem offerable again only as a poem already there: no second fill', async () => {
		await paste(r, SONG2);
		r.offer.decline();
		r.offer.undo();
		await paste(r, SONG2);
		expect(r.puts).toHaveLength(1);
	});

	it('the line and its Undo stand until she leaves the song', async () => {
		await paste(r, SONG2);
		r.offer.decline();
		expect(r.offer.removedFor('song-a')).not.toBeNull();
		expect(r.offer.removedFor('song-b')).toBeNull();
		r.offer.visit('song-a');
		expect(r.offer.removedFor('song-a')).not.toBeNull();
		r.offer.visit('song-b'); // she opens another song
		r.open('song-a');
		expect(r.offer.removedFor('song-a')).toBeNull(); // ... and comes back
		r.offer.undo();
		expect(r.song.publishedPoem).toBe(''); // nothing to undo
	});

	it('Undo is gone once she has typed in Poem or Lyrics, so it can never overwrite her words', async () => {
		await paste(r, SONG2);
		r.offer.decline();
		r.song.publishedPoem = 'Своё стихотворение';
		expect(r.offer.removedFor('song-a')).toBeNull();
		r.offer.undo();
		expect(r.song.publishedPoem).toBe('Своё стихотворение');
		expect(r.song.poemSource).toBeNull();

		r = rig();
		await paste(r, SONG2);
		r.offer.decline();
		r.song.inputText += ' ещё слово';
		expect(r.offer.removedFor('song-a')).toBeNull();
	});

	it('a decline after a reload has no memory of the earlier Lyrics: Poem empties, Lyrics stays as stored', async () => {
		r.song.inputText = reflowed(SONG2);
		r.song.publishedPoem = 'POEM';
		r.song.poemSource = { id: '0127a63ffe', work: '0127a63f', poemHash: manifest.poemHash, start: 0, end: 375, answered: false, edited: false };
		r.offer.decline();
		expect(r.song.publishedPoem).toBe('');
		expect(r.song.inputText).toBe(reflowed(SONG2));
		expect(r.lyricsSets).toEqual([]);
		expect(r.offer.removedFor('song-a')).not.toBeNull();
	});
});

describe('walk 5: she ignores the card', () => {
	it('the poem stays, nothing is answered, and the stored source still asks on the next visit', async () => {
		await paste(r, SONG2);
		const stored = JSON.parse(JSON.stringify(r.song.poemSource)); // what a save and a load hand back
		expect(stored.answered).toBe(false);
		const reopened = rig();
		reopened.song.inputText = SONG2;
		reopened.song.publishedPoem = r.song.publishedPoem;
		reopened.song.poemSource = stored;
		expect(reopened.offer.current()).toBeNull(); // before the library has loaded, no card
		await reopened.offer.offer('anything'); // (not an arrival) -- and awaiting the library loads it
		const resolved = reopened.offer.current();
		expect(resolved?.source.answered).toBe(false);
		expect(resolved?.resolved.entry.title).toBe('Весёлый час');
		expect(reopened.puts).toEqual([]); // nothing was filled on the way
	});
});

describe('walk 6: she edits the poem', () => {
	beforeEach(async () => {
		await paste(r, SONG2);
	});
	const poemWithTypo = () => r.song.publishedPoem.replace('мгновенье', 'мгновенье!');

	it('a typed key sets edited and answered; the source stays', () => {
		const before = r.song.publishedPoem;
		r.song.publishedPoem = poemWithTypo();
		r.offer.onPoemEdit(before, r.song.publishedPoem, 'typing');
		expect(r.song.poemSource).toMatchObject({ edited: true, answered: true, work: '0127a63f' });
		expect(r.offer.current()!.resolved.entry.title).toBe('Весёлый час'); // "Based on ..." can still name it
	});

	it('a paste that is the poem with her edition’s variant is an edit too', () => {
		const before = r.song.publishedPoem;
		r.song.publishedPoem = before.replace('Радость', 'Радость,');
		r.offer.onPoemEdit(before, r.song.publishedPoem, 'paste');
		expect(r.song.poemSource).toMatchObject({ edited: true, answered: true });
	});

	it('the library’s own fill does not read as her edit: the page’s hook runs inside the fill, with no source yet', () => {
		expect(r.puts).toHaveLength(1); // the rig's `put` ran `onPoemEdit('', fill, 'paste')`, as the page's does
		expect(r.song.poemSource).toMatchObject({ edited: false, answered: false });
	});

	it('an edit ends the memory of the earlier Lyrics: a later decline cannot happen on an answered card', () => {
		const before = r.song.publishedPoem;
		r.song.publishedPoem = poemWithTypo();
		r.offer.onPoemEdit(before, r.song.publishedPoem, 'typing');
		r.offer.decline();
		expect(r.song.publishedPoem).not.toBe('');
	});

	it('emptying Poem ends the source (nothing to be based on)', () => {
		const before = r.song.publishedPoem;
		r.song.publishedPoem = '';
		r.offer.onPoemEdit(before, '', 'typing');
		expect(r.song.poemSource).toBeNull();
	});
});

describe('walk 7: her own poem always wins', () => {
	it('a poem page replaces an unedited library poem with no question', async () => {
		await paste(r, SONG2);
		let asked = false;
		let placed = '';
		routePoemPage('Её собственное стихотворение, не из библиотеки', {
			held: r.offer.heldForGuard(r.song.publishedPoem),
			put: (t) => {
				r.offer.onReplace();
				placed = t;
			},
			ask: () => (asked = true),
			land: () => {},
		});
		expect(asked).toBe(false);
		expect(placed).toBe('Её собственное стихотворение, не из библиотеки');
		expect(r.song.poemSource).toBeNull();
	});

	it('the replace guard still asks over a poem she filled, and over a library poem she edited', async () => {
		const asks = (held: string) => {
			let asked = false;
			routePoemPage('новый текст', { held, put: () => {}, ask: () => (asked = true), land: () => {} });
			return asked;
		};
		r.song.publishedPoem = 'Своё';
		expect(asks(r.offer.heldForGuard(r.song.publishedPoem))).toBe(true); // her own poem, no source
		await (async () => {
			r = rig();
			await paste(r, SONG2);
			const before = r.song.publishedPoem;
			r.song.publishedPoem = before.replace('Радость', 'Радость,');
			r.offer.onPoemEdit(before, r.song.publishedPoem, 'typing');
		})();
		expect(asks(r.offer.heldForGuard(r.song.publishedPoem))).toBe(true); // edited
	});

	it('a pasted poem in the Poem field replaces too, and a pasted variant of the poem edits', async () => {
		await paste(r, SONG2);
		const before = r.song.publishedPoem;
		r.song.publishedPoem = 'Совсем другое стихотворение, которое она вставила';
		r.offer.onPoemEdit(before, r.song.publishedPoem, 'paste');
		expect(r.song.poemSource).toBeNull();
	});

	it('Poem’s Clear ends the source and does not touch Lyrics', async () => {
		await paste(r, SONG2);
		r.song.publishedPoem = '';
		r.offer.onClear();
		expect(r.song.poemSource).toBeNull();
		expect(r.song.inputText).toBe(SONG2);
	});

	it('her own Poem is never filled over, with or without a source', async () => {
		r.song.publishedPoem = 'Её строки';
		await paste(r, SONG2);
		expect(r.song.publishedPoem).toBe('Её строки');
		expect(r.song.poemSource).toBeNull();
		expect(r.puts).toEqual([]);
	});
});

describe('walk 8: her song sets a passage of a long poem', () => {
	it('fixture S fills the stanzas the fish’s song sets, not «Мцыри» whole, and says passage', async () => {
		await paste(r, fixture('S'));
		const mtsyri = library.entries.find((e) => e.title === 'Мцыри')!;
		const poem = r.song.publishedPoem;
		expect(poem.length).toBeGreaterThan(0);
		expect(poem.length).toBeLessThan(mtsyri.textModern.length / 20);
		expect(poem).toContain('Останься здесь со мной');
		expect(poem).not.toContain('Немного лет тому назад');
		const src = r.song.poemSource!;
		expect(mtsyri.textModern.slice(src.start, src.end)).toBe(poem);
		const now = r.offer.current()!;
		expect(now.resolved.passage).toBe(true);
		expect(now.resolved.entry.title).toBe('Мцыри');
		expect(now.resolved.firstLine).toBe('«Дитя моё,');
	});

	it('fixture S declines to Lyrics as they were, and Poem empty', async () => {
		await paste(r, fixture('S'));
		r.offer.decline();
		expect(r.song.publishedPoem).toBe('');
		expect(r.song.inputText).toBe(fixture('S'));
	});
});

describe('walk 9: nothing she did not ask for happens later', () => {
	it('fills nothing for a cycle of several songs', async () => {
		const cycle = ['r114-song1', 'r114-song2', 'r114-song3', 'r114-song4', 'r114-song5'].map(fixture).join('\n');
		await paste(r, cycle);
		expect(r.song.poemSource).toBeNull();
		expect(r.song.publishedPoem).toBe('');
	});

	it('fills nothing for a song with no poem in the library', async () => {
		for (const name of ['U4', 'U5', 'r114-song1']) {
			r = rig();
			await paste(r, fixture(name));
			expect(r.song.poemSource, name).toBeNull();
			expect(r.puts, name).toEqual([]);
		}
	});

	it('fills nothing over a Poem she filled, or a Poem the library filled', async () => {
		r.song.publishedPoem = 'Её';
		await paste(r, SONG2);
		expect(r.puts).toEqual([]);
		r = rig();
		await paste(r, SONG2);
		const first = r.song.publishedPoem;
		await r.offer.offer(fixture('r114-song3')); // another arrival while the card is up
		expect(r.song.publishedPoem).toBe(first);
		expect(r.puts).toHaveLength(1);
	});

	it('fills nothing if she changed the Lyrics while the library was loading', async () => {
		r = rig(library, false);
		r.song.inputText = SONG2;
		const pending = r.offer.offer(SONG2);
		r.song.inputText = 'Совсем другие слова, которые она набрала, пока библиотека грузилась';
		r.ready();
		await pending;
		expect(r.song.poemSource).toBeNull();
		expect(r.puts).toEqual([]);
	});

	it('fills nothing if she switched songs while the library was loading (and nothing lands in the new one)', async () => {
		r = rig(library, false);
		const a = r.song;
		a.inputText = SONG2;
		const pending = r.offer.offer(SONG2);
		const b = r.open('song-b');
		b.inputText = SONG2; // another song with the very same Lyrics: only its id tells it from the one that asked
		r.ready();
		await pending;
		expect(a.poemSource).toBeNull();
		expect(b.poemSource).toBeNull();
		expect(b.publishedPoem).toBe('');
		expect(r.puts).toEqual([]);
	});

	it('fills nothing if she filled Poem herself while the library was loading', async () => {
		r = rig(library, false);
		r.song.inputText = SONG2;
		const pending = r.offer.offer(SONG2);
		r.song.publishedPoem = 'Своё, набранное пока шла загрузка';
		r.ready();
		await pending;
		expect(r.song.publishedPoem).toBe('Своё, набранное пока шла загрузка');
		expect(r.song.poemSource).toBeNull();
	});

	it('tolerates a different line layout of the same Lyrics (a re-lining while it waited)', async () => {
		r = rig(library, false);
		r.song.inputText = SONG2;
		const pending = r.offer.offer(SONG2);
		r.song.inputText = reflowed(SONG2);
		r.ready();
		await pending;
		expect(r.song.poemSource).not.toBeNull();
	});

	it('fills nothing, quietly, when the library never arrived', async () => {
		r = rig(null);
		await paste(r, SONG2);
		expect(r.song.poemSource).toBeNull();
		expect(r.puts).toEqual([]);
		expect(r.offer.current()).toBeNull();
	});

	it('fills nothing in a song that cannot be written (a record that failed to load)', async () => {
		r.song.readOnly = true;
		await paste(r, SONG2);
		expect(r.song.poemSource).toBeNull();
		expect(r.puts).toEqual([]);
	});

	it('does nothing before the page has attached it', async () => {
		const loose = new PoemOffer();
		await loose.offer(SONG2);
		loose.keep();
		loose.decline();
		loose.undo();
		loose.onClear();
		expect(loose.current()).toBeNull();
		expect(loose.heldForGuard('x')).toBe('x');
	});
});

describe('the entry that fills', () => {
	it('is the modern entry of a work with a pre-reform text too (row 114 song 5, «Молитва»)', async () => {
		await paste(r, fixture('r114-song5'));
		expect(r.song.poemSource!.id).toBe('6b51c54db7');
		expect(r.offer.current()!.resolved.entry.spelling).toBe('modern');
	});
});
