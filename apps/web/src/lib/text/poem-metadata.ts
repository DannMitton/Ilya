/**
 * poem-metadata.ts: the song's empty Title, Composer, and Poet fill from a library aria (row 182, step 5).
 *
 * PURE: plain objects in, plain objects out. `poem-offer.svelte.ts` calls it when Poem fills from a libretto entry and when
 * the singer declines or undoes the fill.
 *
 * WHAT IS FILLED, and only for a libretto (an aria's text). A poem fills POEM and nothing else, as before: a poem's title is not
 * the song's, and its author is not a composer.
 *   - TITLE: the entry's title, which is the aria's opening words in Russian (Dann, 2026-11-09 22:13: the title is the first sung
 *     line; the role and the opera sit in their own fields and the card shows them beside it).
 *   - COMPOSER: the opera's composer, a `COMPOSERS` key, written as the dropdown writes it ("Given Surname (dates)", English,
 *     N.78: what reaches storage is always English).
 *   - POET: the librettist, only where the entry's `author` is ONE person who is in `POETS`. Every `author` is a Russian full name
 *     with patronymic ("Александр Сергеевич Пушкин"), and the fields store "Surname, Given" English forms, so an unmatched name
 *     would print raw in both languages on PAPER. A librettist who is not in `POETS`, and every entry with two or more authors,
 *     leaves Poet empty. NOT ESTABLISHED beats a Cyrillic string in a Latin field.
 *   - TRANSLATOR: nothing in the 89 arias has one (`translator` null on every entry), so nothing fills; an entry that had one would
 *     fill it by the same rule as Poet.
 *
 * ONLY EMPTY FIELDS FILL, and nothing she typed changes (a field is empty when it holds nothing but spaces).
 *
 * THE TAG. A library-filled field wears no tag: it is neither typed nor "from score" (`metadata-provenance.ts`), and a "from score"
 * tag would be false. A later score header fills blanks only, so it does not overwrite these fields; `clearScoreFilled` does not
 * touch them. What the fill put is remembered by the offer, for the session, so that "Not this poem" empties exactly those fields
 * that still hold what it put there (a field she has since edited stays hers), and Undo of the decline puts them back.
 */
import { COMPOSERS, POETS, formatNameForPaper } from '$lib/composers-poets';
import type { SongMetadata } from '$lib/types';
import type { PoemEntry, PoemOpera } from './poem-library';
import type { Language } from '$lib/i18n';

export type FillField = 'title' | 'composer' | 'poet' | 'translator';
export type FieldValues = Partial<Record<FillField, string>>;

const isEmpty = (v: string | undefined): boolean => (v ?? '').trim() === '';

/**
 * The `POETS` entry of a single Russian full name ("Given Patronymic Surname"), as the English key, or null. Matches the Cyrillic
 * "Surname, Given" of the list against the first and last words of the name. A name of several people ("A и B") matches nothing.
 */
export function poetKeyOf(author: string): string | null {
	const words = author.trim().split(/\s+/);
	if (words.length < 2 || words.includes('и')) return null;
	const wanted = `${words[words.length - 1]}, ${words[0]}`;
	return POETS.find((p) => p.cyrillic === wanted)?.latin ?? null;
}

/** What a library entry offers to the empty fields: for a libretto, its title, composer, and (where known) poet; for a poem, nothing. */
export function entryFields(entry: PoemEntry): FieldValues {
	if (entry.kind !== 'libretto' || !entry.opera) return {};
	const out: FieldValues = { title: entry.title, composer: formatNameForPaper(entry.opera.composer, COMPOSERS) };
	const poet = poetKeyOf(entry.opera.librettists);
	if (poet) out.poet = formatNameForPaper(poet, POETS);
	const translator = entry.translator ? poetKeyOf(entry.translator) : null;
	if (translator) out.translator = formatNameForPaper(translator, POETS);
	return out;
}

/** Fill each EMPTY field from `fields`; a field she typed stays. `put` is what was written (nothing, where every field was hers). */
export function fillEmpty(metadata: SongMetadata, fields: FieldValues): { metadata: SongMetadata; put: FieldValues } {
	const next = { ...metadata };
	const put: FieldValues = {};
	for (const [key, value] of Object.entries(fields) as Array<[FillField, string]>) {
		if (isEmpty(next[key])) {
			next[key] = value;
			put[key] = value;
		}
	}
	return { metadata: next, put };
}

/** "Not this poem": empty each field that still holds exactly what the fill put there. `emptied` is what went, for Undo. */
export function emptyWhatWasPut(metadata: SongMetadata, put: FieldValues): { metadata: SongMetadata; emptied: FieldValues } {
	const next = { ...metadata };
	const emptied: FieldValues = {};
	for (const [key, value] of Object.entries(put) as Array<[FillField, string]>) {
		if (next[key] === value) {
			next[key] = '';
			emptied[key] = value;
		}
	}
	return { metadata: next, emptied };
}

/** Undo of the decline: fill again, into the fields that are still empty. */
export function putBack(metadata: SongMetadata, emptied: FieldValues): { metadata: SongMetadata; put: FieldValues } {
	return fillEmpty(metadata, emptied);
}

/**
 * What the card prints beside an aria's title (Dann, 2026-11-09 22:13: the role and the opera sit in their own fields, in Russian and
 * English, and the card shows them in the interface language). English: «Yeletsky · Pique Dame (Пиковая дама)». French: the data
 * holds no French name for a role or an opera, and one is not made up here, so French prints the Russian names: «Елецкий · Пиковая дама».
 * No words are added, so there is no string to ratify: a middle dot and a pair of parentheses.
 */
export function operaLine(opera: PoemOpera, language: Language): string {
	return language === 'en' ? `${opera.characterEn} \u00b7 ${opera.operaEn} (${opera.operaRu})` : `${opera.characterRu} \u00b7 ${opera.operaRu}`;
}
