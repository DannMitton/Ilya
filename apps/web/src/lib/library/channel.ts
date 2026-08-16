/**
 * channel.ts — two tabs on the same song.
 *
 * N.67 step 1, socket addendum §4.1. Today is silent last-write-wins: nothing
 * in the app listens for anything (`grep -rn "BroadcastChannel\|'storage'\|
 * navigator.locks" src` returned zero hits before this file). Whole-record
 * writes make that worse, because two tabs interleaving lose entire click
 * sessions rather than single keys.
 *
 * SO: LAST-WRITE-WINS, WITH THE NOTICE. Not a merge, not a lock. A tab with no
 * unsaved changes reloads the record and the two simply stay current; a tab
 * mid-debounce KEEPS THE SINGER'S WORK and shows one sentence. A singer racing
 * themselves across two tabs is rare, and the honest failure is a sentence
 * rather than a subsystem. `navigator.locks` is the named escalation if real
 * conflicts ever show up in practice; a problem smaller than the work is not a
 * finding.
 *
 * `BroadcastChannel` is a platform API and weighs nothing.
 */
export const LIBRARY_CHANNEL = 'ilya-library';

export interface LibraryAnnouncement {
	songId: string;
	updatedAt: string;
}

export interface LibraryChannel {
	/** Say that a record was committed. Called after a write, never before. */
	announce(message: LibraryAnnouncement): void;
	close(): void;
}

const NO_CHANNEL: LibraryChannel = { announce: () => {}, close: () => {} };

export function createLibraryChannel(onRemoteWrite: (message: LibraryAnnouncement) => void): LibraryChannel {
	if (typeof BroadcastChannel === 'undefined') return NO_CHANNEL;
	let channel: BroadcastChannel;
	try {
		channel = new BroadcastChannel(LIBRARY_CHANNEL);
	} catch {
		return NO_CHANNEL;
	}
	channel.onmessage = (event: MessageEvent) => {
		const data = event.data as Partial<LibraryAnnouncement> | null;
		if (!data || typeof data.songId !== 'string' || typeof data.updatedAt !== 'string') return;
		onRemoteWrite({ songId: data.songId, updatedAt: data.updatedAt });
	};
	return {
		announce(message) {
			try {
				channel.postMessage(message);
			} catch {
				// A closed or failed channel costs a notice, never the singer's work.
			}
		},
		close() {
			try {
				channel.close();
			} catch {
				// Already gone.
			}
		},
	};
}
