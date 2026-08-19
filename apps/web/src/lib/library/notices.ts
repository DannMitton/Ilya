/**
 * notices.ts — what storage tells the singer, and when.
 *
 * N.67 step 6, design §4. **Plain TypeScript**: no runes, no Svelte, no browser
 * API, so every rule below is gate-checked in node. Runes are inert under this
 * suite (`docs/memory/ENVIRONMENT.md`), which is why a decision written in
 * `+page.svelte` is a decision no gate can reach.
 *
 * KEYS AND NOT COPY. The dictionary stays out of this module, the way
 * `songs.ts` keeps it out by taking `untitled` as an argument and the way
 * `exchange.ts` keeps it out by returning `binder.err.*` keys. The page looks
 * each key up and fills each `%s`.
 *
 * **WHAT THIS MODULE WILL NOT SAY.** Design §4 is explicit that a full eviction
 * takes localStorage, IndexedDB, and the Cache API together, so nothing
 * survives to detect it with and a wiped origin is indistinguishable from a
 * first visit. There is therefore no "your songs were deleted" notice here and
 * there must not be one: it could only ever be a guess, and it would greet a
 * first-time singer with news of a loss they never had.
 */
import type { KeyValueStore } from './driver';
import { formatBytes, type StorageReading } from './quota';
import type { FailureReason } from './types';

/**
 * One sentence to draw, named by its dictionary key.
 *
 * `args` fills the `%s` slots in order. Absent where the string has none.
 */
export interface NoticeLine {
	key: string;
	args?: string[];
}

/**
 * The eviction notice is shown ONCE PER DEVICE, so the fact that it has been
 * shown is a device preference and lives where the other six do: in
 * localStorage, beside `ilya:language` and `ilya:drawerCollapsed` (design
 * §2.2's list). It is not about any song, so it is not in the vault; losing it
 * costs one repeated sentence and never a note of the singer's work.
 */
export const EVICTION_NOTICE_KEY = 'ilya:evictionNoticeShown';

/** What the `ilya:activeSongId` pointer turned out to be, at boot. */
export interface PointerState {
	/**
	 * False on a first visit, where the id was minted a moment ago rather than
	 * read: a pointer this boot invented cannot be evidence that anything was
	 * lost.
	 */
	stored: boolean;
	/** True when the vault holds a record under the pointed id. */
	found: boolean;
	/** How many songs the vault holds. */
	songCount: number;
}

export interface BootFacts {
	/** What the boot load reported, or null where it came back whole. */
	loadFailure: FailureReason | null;
	/** `navigator.storage.persisted()`, or null where the browser would not say. */
	persisted: boolean | null;
	pointer: PointerState;
}

/**
 * Everything storage has to say at boot, in the order the drawer draws it.
 *
 * **THIS FUNCTION WRITES.** "Once" needs somewhere to remember, and the write
 * happens at the moment the notice is decided rather than after it is drawn, so
 * that a singer who reloads before reading it still sees it exactly once. The
 * write is the whole reason the store is a parameter: a null store means the
 * flag cannot be kept, and the honest consequence is that the notice repeats
 * rather than that it is withheld.
 */
export function bootNotices(facts: BootFacts, store: KeyValueStore | null): NoticeLine[] {
	const lines: NoticeLine[] = [];

	// NOTHING CAN BE SAVED AT ALL. Not "IndexedDB refused": the app falls back
	// to localStorage when the vault will not open, and localStorage keeps a
	// song perfectly well, so saying "nothing can be saved" there would be a
	// lie. This fires only where the fallback found no store either, which is
	// the one state in which the sentence is true.
	if (facts.loadFailure === 'no-storage') {
		lines.push({ key: 'storage.none' });
		// Nothing to evict, and nowhere to keep the flag. Saying both would be
		// two warnings about the same absence.
		return lines;
	}

	if (facts.persisted === false && !evictionNoticeShown(store)) {
		markEvictionNoticeShown(store);
		lines.push({ key: 'storage.evictionRisk' });
	}

	// THE PARTIAL-LOSS ODDITY. The pointer was read from this device, the vault
	// answers for other songs, and the one it names is not among them.
	//
	// The empty-vault case is DELIBERATELY EXCLUDED, and design §4 is the
	// reason: with no songs at all, a wiped origin is indistinguishable from a
	// first visit, so the notice would fire on a singer who opened Ilya once,
	// typed nothing, and came back. A vault holding other songs is what makes
	// the absence of this one evidence rather than a guess.
	if (facts.pointer.stored && !facts.pointer.found && facts.pointer.songCount > 0) {
		lines.push({ key: 'storage.partialLoss' });
	}

	return lines;
}

function evictionNoticeShown(store: KeyValueStore | null): boolean {
	try {
		return store?.getItem(EVICTION_NOTICE_KEY) === '1';
	} catch {
		// An unreadable preference costs a repeated sentence, never a song.
		return false;
	}
}

function markEvictionNoticeShown(store: KeyValueStore | null): void {
	try {
		store?.setItem(EVICTION_NOTICE_KEY, '1');
	} catch {
		// Same trade: the notice comes back next boot rather than never.
	}
}

/**
 * What the open song's failed load says, or null when it came back whole.
 *
 * `no-storage` is answered at boot by `bootNotices` and is not repeated here:
 * one absence, one sentence.
 */
export function songNotice(reason: FailureReason | null | undefined): NoticeLine | null {
	if (reason === 'malformed') return { key: 'song.unreadable' };
	if (reason === 'newer-schema') return { key: 'song.newerIlya' };
	if (reason === 'write-failed') return { key: 'storage.loadFailed' };
	return null;
}

/**
 * What a failed save says.
 *
 * TWO SENTENCES FOR QUOTA, NOT ONE. `storage.quotaNumbers` is appended only
 * where `navigator.storage.estimate()` returned real figures: a notice that
 * says "of undefined" is worse than a notice that says nothing about size, and
 * Safari answers the estimate on its own terms.
 */
export function saveNotice(
	reason: FailureReason | null | undefined,
	reading: StorageReading,
): NoticeLine[] {
	if (!reason) return [];
	if (reason === 'no-storage') return [{ key: 'storage.none' }];
	if (reason === 'newer-schema') return [{ key: 'song.newerIlya' }];
	if (reason !== 'quota-exceeded') return [{ key: 'storage.saveFailed.generic' }];

	const lines: NoticeLine[] = [{ key: 'storage.quotaFull' }];
	if (typeof reading.usage === 'number' && typeof reading.quota === 'number') {
		lines.push({
			key: 'storage.quotaNumbers',
			args: [formatBytes(reading.usage), formatBytes(reading.quota)],
		});
	}
	return lines;
}

/**
 * Every sentence the drawer's notice position shows, in the order it shows them.
 *
 * THE PRECEDENCE IS THE ONE THE DRAWER ALREADY HAD: a failed SAVE speaks over a
 * failed LOAD, because the save is what is happening now and the load is what
 * happened at boot. Saying both would tell the singer their work is at risk for
 * two different reasons at once, which reads as two losses rather than one.
 *
 * The boot lines come first because they are about the browser rather than
 * about this song, and a singer who cannot save at all needs to know that
 * before they read why one write refused.
 */
export function drawerNotices(input: {
	boot: readonly NoticeLine[];
	saveFailure: FailureReason | null;
	loadFailure: FailureReason | null;
	reading: StorageReading;
}): NoticeLine[] {
	const lines = [...input.boot];
	if (input.saveFailure) {
		lines.push(...saveNotice(input.saveFailure, input.reading));
	} else {
		const song = songNotice(input.loadFailure);
		if (song) lines.push(song);
	}
	// **NO SENTENCE IS SAID TWICE, AND THIS ONE IS NOT TIDINESS.** A browser with
	// no storage at all reports `no-storage` at boot AND on the first write, so
	// `storage.none` arrived twice and the drawer drew the same paragraph either
	// side of itself. Found on the walk, 2026-08-18, where it did worse than read
	// badly: the template keyed its `{#each}` on the notice key, two identical
	// keys threw `each_key_duplicate`, and the whole notice region died in
	// exactly the state it exists to describe. The template no longer keys on
	// anything, and this is the rule that means it never has to.
	const seen = new Set<string>();
	return lines.filter((line) => (seen.has(line.key) ? false : (seen.add(line.key), true)));
}

/**
 * Fill a notice's `%s` slots, in order.
 *
 * HERE RATHER THAN IN THE PAGE because `String.prototype.replace` takes the
 * FIRST match only, so a two-slot string needs two calls and a page that
 * forgets the second draws a raw `%s` at the singer. One loop, one place.
 */
export function fillNotice(sentence: string, args: readonly string[] = []): string {
	let filled = sentence;
	for (const arg of args) filled = filled.replace('%s', arg);
	return filled;
}
