/**
 * exchange.ts — what passes between the vault and a binder file.
 *
 * N.67 step 5, the remainder. Design §5. `binder.ts` knows the FORMAT: what a
 * `.ilya` file is, byte for byte. This file knows the ACTS: which songs go into
 * one, and what happens to each song that comes out of one. They are separate
 * because the format must stay readable by a version of Ilya that has never
 * heard of these rules.
 *
 * **Plain TypeScript, and it lives here rather than in `+page.svelte` for two
 * reasons.** Runes are inert under vitest (`docs/memory/ENVIRONMENT.md`), so a
 * decision written in a component is a decision no gate can reach; and
 * `+page.svelte` is a standing debt that the next thing to touch it was told to
 * shrink. The page keeps the dialog, the anchor, and the file input. Every rule
 * below is here.
 *
 * **NOTHING HERE THROWS AND NOTHING HERE SWALLOWS.** `library.ts`'s contract and
 * N.27's prohibition, kept by construction: every failure comes back as a field
 * on the result, and every caller has something to say about it.
 */
import { autoName, binderFileName, buildBinder, type BinderFailure, type BinderSong } from './binder';
import { uniqueName } from './songs';
import type { SongSummary, SourceBytes } from './driver';
import type { SongRecord } from './types';

/* ── Carrying songs off ─────────────────────────────────────────── */

export interface ExportDeps {
	/** The songs to carry off, in the order they should appear in the manifest. */
	ids: readonly string[];
	/**
	 * The open song's id, and its record AS THE DOCUMENT HOLDS IT.
	 *
	 * THE OPEN SONG COMES FROM THE DOCUMENT AND EVERY OTHER FROM THE VAULT. The
	 * document holds edits the vault has not seen yet, so reading the open song
	 * from storage would export a version of it the singer has already moved
	 * past. Its BYTES still come from the vault, which is where a score lives.
	 */
	openId: string;
	openRecord: SongRecord;
	load: (id: string) => Promise<SongRecord>;
	loadSource: (id: string) => Promise<SourceBytes | null>;
	appVersion: string;
	exportedAt: string;
	/** Today, in the singer's own language, for the naming fallbacks. */
	today: string;
	/** The word for a song that has never been named, in the singer's language. */
	untitled: string;
}

export type ExportResult =
	| { ok: true; bytes: Uint8Array; fileName: string; songs: number }
	| { ok: false };

/**
 * What a binder of more than one song is called.
 *
 * A binder of one song wears that song's name. A binder of the library is not
 * any song, so it wears the tool's name and the day, which is the same shape
 * `binderFileName` and `autoName` already fall back to ("Untitled, 16 August
 * 2026"). NOT a translated string: "Ilya" is the product's own name and reads
 * the same in both languages, so this coins no copy.
 */
export function libraryBinderName(today: string): string {
	return `Ilya, ${today}`;
}

/**
 * Gather songs and write one binder.
 *
 * One format, two uses (design §5): the caller passes one id or all of them,
 * and nothing below branches on which.
 */
export async function exportBinder(deps: ExportDeps): Promise<ExportResult> {
	try {
		const songs: BinderSong[] = [];
		for (const id of deps.ids) {
			const record = id === deps.openId ? deps.openRecord : await deps.load(id);
			const source = await deps.loadSource(id);
			// THE SINGER'S NAME WINS. Recomputing an auto-name here would ignore a
			// rename, which is the one thing the library door exists to let them do.
			const name = record.name || autoName(record, deps.today, deps.untitled);
			songs.push({ record, source, name });
		}
		if (songs.length === 0) return { ok: false };

		const bytes = await buildBinder({
			songs,
			appVersion: deps.appVersion,
			exportedAt: deps.exportedAt,
		});
		const fileName =
			songs.length === 1
				? binderFileName(songs[0].name, deps.today)
				: binderFileName(libraryBinderName(deps.today), deps.today);
		return { ok: true, bytes, fileName, songs: songs.length };
	} catch {
		// A read or a write that refused. Reported, never thrown: the caller has
		// a sentence for this and the singer's library is untouched either way.
		return { ok: false };
	}
}

/* ── Taking songs in ────────────────────────────────────────────── */

/**
 * The three answers of design §5, in the order the dialog offers them.
 *
 * `mine` is the SAFE one and is what an unanswered dialog resolves to: closing
 * without answering changes nothing, because nothing is mutated before the
 * answer.
 */
export type CollisionAnswer = 'take' | 'both' | 'mine';

export interface Collision {
	/** The song in the file. */
	incoming: BinderSong;
	/** The song already in the library that shares its id. */
	mine: SongSummary;
}

export interface ImportDeps {
	songs: readonly BinderSong[];
	/**
	 * The library as it stands, which is where a collision is DETECTED.
	 *
	 * NOT `library.load(id)`, which cannot tell you whether a song exists: an
	 * absent id yields an empty record rather than an error, on purpose
	 * (`index.ts`'s "a pointer naming a song that is not there yields an empty
	 * record"). A check written on `load` would report "no collision" for every
	 * song in the binder and overwrite the lot.
	 */
	existing: readonly SongSummary[];
	save: (record: SongRecord, source: SourceBytes | null) => Promise<{ ok: boolean }>;
	ask: (collision: Collision) => Promise<CollisionAnswer>;
	newId: () => string;
	/** The song the singer is in, which is the only one a reload can be owed to. */
	openId: string;
}

export interface ImportOutcome {
	/** Songs the library did not have before: fresh arrivals and kept-both copies. */
	added: number;
	/** Songs whose stored version was overwritten by the file's. */
	replaced: number;
	/** Songs the singer chose to keep as they were. */
	skipped: number;
	/**
	 * The OPEN song was overwritten, so the live document is stale and the page
	 * owes a reload. The only case that owes one.
	 */
	replacedOpen: boolean;
	/** At least one write refused. The singer is told; the rest still ran. */
	failed: boolean;
}

/**
 * Put a binder's songs into the library, asking about each collision.
 *
 * **AN IMPORT ADDS SONGS. IT NEVER TOUCHES THE SONG THE SINGER IS IN** (Dann's
 * ruling, 2026-08-18), unless they answer "take the one in this file" on that
 * song's own id. That is why the open-song warning that used to guard this is
 * gone: it existed when there was only ever one song to destroy, and songs have
 * been plural since `cb7a15a`. The only question an import raises is the id
 * collision below.
 *
 * Songs are handled IN MANIFEST ORDER, one dialog at a time, and each answer is
 * applied before the next is asked, so the names and ids a "keep both" mints
 * are visible to every song after it.
 */
export async function importBinder(deps: ImportDeps): Promise<ImportOutcome> {
	const outcome: ImportOutcome = {
		added: 0,
		replaced: 0,
		skipped: 0,
		replacedOpen: false,
		failed: false,
	};

	// Both sets GROW as the run proceeds. A binder that carries the same song
	// twice, or two songs sharing a name, must not collide with the library as
	// it was at the start of the run and miss what this run has just put there.
	const byId = new Map(deps.existing.map((song) => [song.id, song]));
	const takenNames = new Set(deps.existing.map((song) => song.name).filter((name) => name !== ''));

	const write = async (record: SongRecord, source: SourceBytes | null): Promise<boolean> => {
		let ok: boolean;
		try {
			ok = (await deps.save(record, source)).ok;
		} catch {
			// The vault reports rather than throws, but that is its promise and
			// not this file's guarantee. Caught here so the contract holds no
			// matter what is handed in.
			ok = false;
		}
		if (!ok) {
			outcome.failed = true;
			return false;
		}
		// Recorded only on a write that landed, so a refused save cannot make a
		// later song think this id or name is spoken for.
		byId.set(record.id, {
			id: record.id,
			name: record.name,
			createdAt: record.createdAt,
			updatedAt: record.updatedAt,
			fingerprint: record.source?.fingerprint || null,
		});
		if (record.name !== '') takenNames.add(record.name);
		return true;
	};

	for (const incoming of deps.songs) {
		const mine = byId.get(incoming.record.id);

		if (!mine) {
			if (await write(incoming.record, incoming.source)) outcome.added++;
			continue;
		}

		let answer: CollisionAnswer;
		try {
			answer = await deps.ask({ incoming, mine });
		} catch {
			// A dialog that failed is not permission to overwrite anything.
			answer = 'mine';
		}

		if (answer === 'mine') {
			outcome.skipped++;
			continue;
		}

		if (answer === 'take') {
			// The SOURCE IS PASSED THROUGH, null and all. `null` deletes the stored
			// bytes and `undefined` leaves them; handing `undefined` here would
			// leave the old score attached to the new record, which is the chimera
			// N.67 step 4a exists to prevent.
			if (await write(incoming.record, incoming.source)) {
				outcome.replaced++;
				if (incoming.record.id === deps.openId) outcome.replacedOpen = true;
			}
			continue;
		}

		if (await write(...keepBoth(incoming, deps.newId(), takenNames))) outcome.added++;
	}

	return outcome;
}

/**
 * "Keep both": the incoming copy is re-identified and its name numbered.
 *
 * **THE ID LIVES IN TWO PLACES.** The record carries it and so does
 * `SourceBytes.songId`, which is the sources store's own key. A copy whose
 * bytes still name the old song attaches its score to the wrong record, and
 * both songs then draw the same music.
 *
 * The numbering is `uniqueName`, design §2.3's collision rule, which the door
 * already uses. There is one of those in this codebase and this is it.
 */
export function keepBoth(
	incoming: BinderSong,
	id: string,
	takenNames: ReadonlySet<string>,
): [SongRecord, SourceBytes | null] {
	// An unnamed song has nothing to number; the list draws it a placeholder.
	const base = incoming.record.name || incoming.name;
	const record: SongRecord = {
		...incoming.record,
		id,
		name: base === '' ? '' : uniqueName(base, takenNames),
	};
	const source = incoming.source ? { ...incoming.source, songId: id } : null;
	return [record, source];
}

/* ── What the singer is told ────────────────────────────────────── */

/**
 * FIVE CONDITIONS, THREE SENTENCES.
 *
 * To a singer, "not an archive" and "an archive that is not Ilya's" are one
 * situation, and "no songs" and "damaged" are another. All three sentences end
 * the same way, so that none of them invites the reader to infer their file was
 * harmed by one of the others. Keys and not copy: the dictionary stays out of
 * this module, the way `songs.ts` keeps it out by taking `untitled` as an
 * argument.
 */
export function binderFailureKey(reason: BinderFailure): string {
	if (reason === 'newer-schema') return 'binder.err.newer';
	if (reason === 'not-a-zip' || reason === 'not-a-binder') return 'binder.err.notIlya';
	return 'binder.err.damaged';
}

/**
 * What to say after an import, and how many to say it about.
 *
 * ONLY ADDITIONS ARE COUNTED. "Take the one in this file" adds nothing; it
 * overwrites, and the song it overwrote moves to the top of the list, which is
 * the change the singer can already see. Two keys rather than a plural
 * mechanism, picked on `n === 1`, which is correct in French and correct in
 * English except at zero. Zero returns NOTHING RATHER THAN A SENTENCE, because
 * "0 songs were added" is a sentence no singer needs.
 */
export function importNoticeKey(outcome: ImportOutcome): { key: string; count: number } | null {
	if (outcome.added === 0) return null;
	return {
		key: outcome.added === 1 ? 'binder.importedOne' : 'binder.importedMany',
		count: outcome.added,
	};
}
