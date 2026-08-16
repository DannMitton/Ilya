/**
 * quota.ts — asking to be kept, and reading what is left.
 *
 * N.67 step 1. `navigator.storage.persist()` and `.estimate()` had NEVER been
 * called anywhere in this tree before this step (zero occurrences across `apps`
 * and `packages`, measured 2026-08-16), so the origin was best-effort and
 * evictable and the real quota on Dann's devices was unread. Both are now read.
 *
 * HONESTY ABOUT WHAT DETECTION CAN DO, design §4. A full eviction takes
 * localStorage, IndexedDB, and the Cache API together, so nothing survives to
 * detect it with and a wiped origin is indistinguishable from a first visit.
 * The defence is `persist()` plus the binder, not detection, and this file does
 * not pretend otherwise.
 */

export interface StorageReading {
	/** Bytes in use, where the browser will say. */
	usage?: number;
	/** Bytes available, where the browser will say. */
	quota?: number;
	/** True if the origin is persistent, false if not, null if unanswerable. */
	persisted: boolean | null;
}

/**
 * Ask for persistence, once, at the first real save.
 *
 * Safari grants or refuses this without a prompt; Chrome may grant it silently
 * on an installed or engaged origin. A refusal is not an error and is not worth
 * a notice on its own: it is what the eviction notice in step 6 is for.
 */
export async function requestPersistence(): Promise<boolean | null> {
	if (typeof navigator === 'undefined' || !navigator.storage?.persist) return null;
	try {
		if (await navigator.storage.persisted?.()) return true;
		return await navigator.storage.persist();
	} catch {
		return null;
	}
}

export async function readStorageEstimate(): Promise<StorageReading> {
	if (typeof navigator === 'undefined' || !navigator.storage?.estimate) {
		return { persisted: null };
	}
	try {
		const estimate = await navigator.storage.estimate();
		let persisted: boolean | null = null;
		try {
			persisted = (await navigator.storage.persisted?.()) ?? null;
		} catch {
			persisted = null;
		}
		return { usage: estimate.usage, quota: estimate.quota, persisted };
	} catch {
		return { persisted: null };
	}
}

/** For a notice, in whole units. `formatBytes(0)` is "0 B", not "". */
export function formatBytes(bytes: number): string {
	const units = ['B', 'KB', 'MB', 'GB'];
	let value = bytes;
	let unit = 0;
	while (value >= 1024 && unit < units.length - 1) {
		value /= 1024;
		unit += 1;
	}
	return `${value >= 10 || unit === 0 ? Math.round(value) : value.toFixed(1)} ${units[unit]}`;
}
