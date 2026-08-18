/**
 * songs.ts — the library door's six operations.
 *
 * N.67 step 4b. Design §2.1, §2.3, and §2.6. **Plain TypeScript**: no runes, no
 * Svelte, no browser API, so every decision here is gate-checked in node. Runes
 * are inert under this suite (`docs/memory/ENVIRONMENT.md`, "Runes under
 * vitest"), which is why nothing that decides anything may live above this line.
 *
 * The vault has been plural since step 1: `LIBRARY_STORES` keys `songs` by `id`
 * and carries a `by-fingerprint` index (`driver.ts`). Nothing above it was.
 * These are the six operations that were absent: list, create, rename, delete,
 * switch, and recognize.
 *
 * NOTHING HERE THROWS TO A CALLER AND NOTHING HERE SWALLOWS, which is
 * `library.ts`'s contract and N.27's prohibition kept by construction.
 */
import type { Library } from './library';
import type { FailureReason, Outcome, SongRecord } from './types';
import { emptySongRecord } from './types';
import type { PluralStore, SongSummary } from './driver';

/* ── Naming (design §2.3 layer 3) ───────────────────────────────── */

/**
 * The name built from the singer's own material, or the empty string when
 * there is no material yet.
 *
 * *Composer, title* first, because that is how a singer names a piece to
 * another singer. Then the poem's opening words, because a song with no score
 * header still has words. An empty answer is honest: a song created a moment
 * ago has nothing to be named after, and inventing something would be the tool
 * asserting what it does not know.
 *
 * Nothing keys on this. It is for human eyes, and the singer may edit it.
 */
export function proposeName(record: SongRecord): string {
	const composer = record.metadata.composer.trim();
	const title = record.metadata.title.trim();
	if (composer && title) return `${composer}, ${title}`;
	if (title) return title;
	if (composer) return composer;
	return record.poem.trim().split(/\s+/).filter(Boolean).slice(0, 4).join(' ');
}

/**
 * What the list shows for a song that has never been named.
 *
 * DERIVED AT DISPLAY TIME AND NEVER STORED, which is CONTRACT §6's rule about
 * derived data applied to the one place it would have been easy to break: a
 * stored "Untitled" would still say Untitled after the singer typed a title.
 * The date is the song's own creation date, in ISO, which reads the same in
 * both languages and cannot be misread as a different day.
 */
export function placeholderName(createdAt: string, untitled: string): string {
	return `${untitled}, ${createdAt.slice(0, 10)}`;
}

/**
 * Design §2.3: on collision, a numeral is appended.
 *
 * Applied when a name is first DERIVED AND STORED, never to what the singer
 * typed. A singer who deliberately gives two songs the same name has said what
 * they meant, and correcting them would be the tool arguing.
 */
export function uniqueName(base: string, taken: ReadonlySet<string>): string {
	if (!taken.has(base)) return base;
	for (let n = 2; n < 1000; n++) {
		const candidate = `${base} (${n})`;
		if (!taken.has(candidate)) return candidate;
	}
	return base;
}

/**
 * Newest work first, which is the order a singer looks for a song in.
 *
 * The tie-breaks make the order TOTAL. Two songs saved in the same millisecond
 * are ordinary (a create writes both the record and the pointer), and a list
 * whose order changes between two reads of the same data is a list that jumps
 * under the hand.
 */
export function sortSongs(songs: readonly SongSummary[]): SongSummary[] {
	return [...songs].sort(
		(a, b) =>
			b.updatedAt.localeCompare(a.updatedAt) ||
			b.createdAt.localeCompare(a.createdAt) ||
			a.id.localeCompare(b.id),
	);
}

export interface SongRow extends SongSummary {
	/** What to draw. The stored name, or a placeholder that is never stored. */
	label: string;
}

/**
 * Sort the library and give every row something to draw.
 *
 * Unnamed songs created on the same day would otherwise read identically, so
 * they are numbered by CREATION ORDER rather than by list position: the
 * numbering must not move when a song is edited and rises to the top.
 */
export function toRows(songs: readonly SongSummary[], untitled: string): SongRow[] {
	const byAge = [...songs].sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
	const labels = new Map<string, string>();
	const seen = new Set<string>();
	for (const song of byAge) {
		const base = song.name !== '' ? song.name : placeholderName(song.createdAt, untitled);
		const label = song.name !== '' ? base : uniqueName(base, seen);
		seen.add(label);
		labels.set(song.id, label);
	}
	return sortSongs(songs).map((song) => ({ ...song, label: labels.get(song.id) ?? song.id }));
}

/**
 * The library as the DRAWER draws it, which is not quite what the vault holds.
 *
 * Two differences, both necessary. The open song's name is taken LIVE, because
 * a rename debounces like every other write and the singer must see it land in
 * the same moment they typed it. And the open song is added when the vault has
 * not seen it: a first visit mints an id and writes nothing until the singer
 * makes something, and that song still belongs in the list, because it is the
 * one they are in.
 */
export function libraryRows(
	stored: readonly SongSummary[],
	open: SongSummary,
	untitled: string,
): SongRow[] {
	const live = stored.map((song) => (song.id === open.id ? { ...song, name: open.name } : song));
	if (!live.some((song) => song.id === open.id)) live.push(open);
	return toRows(live, untitled);
}

/**
 * The name a song takes the FIRST time it has anything to be named after, or
 * the empty string while it still has nothing.
 *
 * Design §2.3 layer 3, both halves in one place: what the name is built from,
 * and the numeral appended when another song already has it.
 */
export function nameFor(record: SongRecord, others: readonly SongSummary[]): string {
	const proposed = proposeName(record);
	if (proposed === '') return '';
	return uniqueName(
		proposed,
		new Set(others.filter((song) => song.id !== record.id).map((song) => song.name)),
	);
}

/* ── The six operations ─────────────────────────────────────────── */

/** Every song, newest work first. A driver that throws is an empty list, never a crash. */
export async function listSongs(store: PluralStore | undefined): Promise<SongSummary[]> {
	if (!store) return [];
	try {
		return sortSongs(await store.list());
	} catch {
		return [];
	}
}

/**
 * A new, empty song, written before it is opened.
 *
 * WRITTEN FIRST, ON PURPOSE. The record is in the vault before the pointer
 * moves to it, so a reload between the two finds a song that is really there.
 * The name is left EMPTY: there is nothing to name it after yet, and it names
 * itself the first time there is (design §2.3, and `proposeName` above).
 */
export async function createSong(deps: {
	library: Library;
	newId: () => string;
	now: () => string;
}): Promise<{ ok: true; record: SongRecord } | { ok: false; reason: FailureReason }> {
	const record = emptySongRecord(deps.newId(), deps.now());
	const outcome = await deps.library.save(record);
	if (!outcome.ok) return { ok: false, reason: outcome.reason };
	return { ok: true, record };
}

/**
 * Rename a song that is not the one currently open.
 *
 * THE OPEN SONG IS RENAMED THROUGH ITS DOCUMENT AND NEVER THROUGH HERE. The
 * document holds the live record and would write its own `name` back over this
 * one on its next autosave, so a rename that went round it would appear to work
 * and then quietly undo itself.
 */
export async function renameSong(library: Library, id: string, name: string): Promise<Outcome> {
	const loaded = await library.load(id);
	if (loaded.reason === 'no-storage') return { ok: false, reason: 'no-storage' };
	return library.save({ ...loaded.record, id, name });
}

/** Remove a song and its bytes together, or neither (design §2.1). */
export async function deleteSong(store: PluralStore | undefined, id: string): Promise<Outcome> {
	if (!store) return { ok: false, reason: 'no-storage' };
	try {
		return await store.remove(id);
	} catch {
		return { ok: false, reason: 'write-failed' };
	}
}

/**
 * Have I met this music before? Design §2.3 layer 2.
 *
 * The answer is always a PROMPT and never an action: a hash may guide, and only
 * the singer decides. The open song is excluded because recognizing the song
 * you are already in is not a recognition, and an empty fingerprint matches
 * nothing at all.
 */
export async function recognize(
	store: PluralStore | undefined,
	fingerprint: string,
	excludeId: string,
): Promise<SongSummary[]> {
	if (!store || fingerprint === '') return [];
	try {
		const found = await store.findByFingerprint(fingerprint);
		return sortSongs(found.filter((song) => song.id !== excludeId));
	} catch {
		return [];
	}
}
