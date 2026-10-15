/**
 * Why the voice profile's last save refused, or null (N.27).
 *
 * One shared reactive field, set from plain TypeScript by `saveStore` in
 * `profileStore.ts` and read by the page, which hands it to `drawerNotices`.
 * It follows `score/reading-wait.svelte.ts`: a runes module, because the tree
 * keeps shared reactive state in runes and nowhere in `svelte/store`.
 *
 * `saveStore` sets it on every call, `null` on a save that landed, so the
 * notice clears the next time a write succeeds, the way the song's does
 * (`library/document.svelte.ts`, `#write`).
 */
import type { FailureReason } from '$lib/library/types';

export class ProfileSave {
	failure = $state<FailureReason | null>(null);
}

export const profileSave = new ProfileSave();
