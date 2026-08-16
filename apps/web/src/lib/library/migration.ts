/**
 * migration.ts — the one-way door, walked once.
 *
 * N.67 step 1, design §3. Moves the six per-song localStorage keys into the
 * vault, then removes the five that moved.
 *
 * WRITE, THEN READ BACK, THEN REMOVE. `profileStore.ts:173-205` is the tree's
 * own precedent and this hardens it by one step: the old keys are deleted only
 * after the new record has been read back OUT of IndexedDB and validated,
 * because IndexedDB can fail in ways localStorage does not, and because the
 * brief's words were "nothing may be lost".
 *
 * A FAILED MIGRATION IS A NO-OP, NOT A LOSS. Any failure at any step removes
 * nothing, leaves the flag unset so the next boot tries again, and reports a
 * reason for the notice. The app then runs exactly as it does today, off the
 * keys that are still there.
 *
 * Plain TypeScript, no browser API of its own: the driver and the store are
 * both injected, so every branch here is gate-checked in node.
 */
import type { KeyValueStore, StorageDriver } from './driver';
import { readLegacySync, LEGACY_KEYS } from './driver';
import { validateRecord } from './library';
import type { FailureReason, SongRecord } from './types';

/**
 * The five keys that MOVE. `ilya:openSyllabification` is deliberately not one
 * of them: it stays in localStorage as the default for newly created songs,
 * even though each song also snapshots its own (design §2.2, §3.5).
 */
export const MIGRATED_KEYS = [
	LEGACY_KEYS.poem,
	LEGACY_KEYS.metadata,
	LEGACY_KEYS.fromScore,
	LEGACY_KEYS.glosses,
	LEGACY_KEYS.pairings,
] as const;

export type MigrationOutcome =
	| { kind: 'not-needed' }
	| { kind: 'nothing-to-move' }
	| { kind: 'migrated'; record: SongRecord }
	| { kind: 'failed'; reason: FailureReason };

/** Is there any per-song work in localStorage at all? Design §3.2. */
export function hasLegacyWork(store: KeyValueStore): boolean {
	const poem = store.getItem(LEGACY_KEYS.poem);
	if (poem !== null && poem !== '') return true;
	for (const key of [LEGACY_KEYS.metadata, LEGACY_KEYS.fromScore, LEGACY_KEYS.glosses, LEGACY_KEYS.pairings]) {
		const raw = store.getItem(key);
		// An empty object, an empty list, or an absent key is not work. A fresh
		// install that has merely rendered once must migrate nothing.
		if (raw !== null && raw !== '' && raw !== '{}' && raw !== '[]') return true;
	}
	return false;
}

export interface MigrationDeps {
	store: KeyValueStore | null;
	driver: StorageDriver;
	alreadyMigrated: boolean;
	newId: () => string;
	now: () => string;
}

export async function migrateFromLocalStorage(deps: MigrationDeps): Promise<MigrationOutcome> {
	const { store, driver, alreadyMigrated, newId, now } = deps;
	if (alreadyMigrated) return { kind: 'not-needed' };
	if (!store) return { kind: 'nothing-to-move' };
	if (!hasLegacyWork(store)) return { kind: 'nothing-to-move' };

	// 1. Read the six keys through the same reader the legacy driver uses, so
	//    the migration cannot disagree with step 0 about what a key means.
	const id = newId();
	const read = readLegacySync(id, store);
	const record: SongRecord = { ...read.record, id, createdAt: now(), updatedAt: now() };

	// 2. Write it. `source` stays null: today's app never persisted a score, so
	//    there are no bytes to move and the record says so honestly.
	const written = await driver.save(record);
	if (!written.ok) return { kind: 'failed', reason: written.reason };

	// 3. Read it BACK out of the vault and validate what came back. A write that
	//    reported success and cannot be read is exactly the case this exists for.
	const readBack = await driver.load(id);
	const validated = validateRecord(readBack.record, id, now());
	if (readBack.reason || validated.reason) {
		return { kind: 'failed', reason: readBack.reason ?? validated.reason ?? 'malformed' };
	}
	if (!sameSong(validated.record, record)) return { kind: 'failed', reason: 'malformed' };

	// 4. Only now remove the five keys that moved.
	try {
		for (const key of MIGRATED_KEYS) store.removeItem(key);
	} catch {
		// The song is safe in the vault; failing to tidy up is not a loss, and
		// the next boot's flag stops it being migrated twice.
		return { kind: 'migrated', record: validated.record };
	}
	return { kind: 'migrated', record: validated.record };
}

/**
 * Did the song survive the round trip whole?
 *
 * Compares the singer's own material, field by field, rather than the whole
 * record, because `updatedAt` is stamped by the facade on save and would
 * differ by design.
 */
function sameSong(a: SongRecord, b: SongRecord): boolean {
	return (
		a.poem === b.poem &&
		a.openSyllabification === b.openSyllabification &&
		JSON.stringify(a.metadata) === JSON.stringify(b.metadata) &&
		JSON.stringify([...a.fromScore].sort()) === JSON.stringify([...b.fromScore].sort()) &&
		JSON.stringify(a.glosses) === JSON.stringify(b.glosses) &&
		JSON.stringify(a.pairings) === JSON.stringify(b.pairings)
	);
}
