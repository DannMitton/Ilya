/**
 * Which scan banners the singer has dismissed, for the open score (integration step 12, Dann 2026-11-09 20:28).
 *
 * WHAT IT CHECKS: nothing; it remembers. A banner is identified by its key AND its text argument (the file's name, or the unread bars), so
 * dismissing «This score is Ilya’s synthesis…» never hides the partly-read banner, and a re-read that lists different bars is a different
 * banner and shows. WHY: every scan banner gets a × (`ScanBanner.svelte`), and a stray tap must hide only that banner. WHEN IT FAILS: a
 * warning stays hidden after a new upload, or one dismissal hides another banner. `reset()` is called by the page when a score arrives
 * (an upload or a re-read), when the score is cleared, and when the song changes, which is how "a new upload brings it back" holds.
 * Session memory only, as the Finale banner's own flag is. It relates to `ScanBanner.svelte` (the ×) and `ScoreUploader.svelte`
 * (`bannerDismissed`, the denigma banner's dismissal, whose label it reuses).
 */
export class ScanBannerState {
	#gone = $state<ReadonlySet<string>>(new Set());

	static id(key: string, arg: string): string {
		return `${key}\u0000${arg}`;
	}

	isDismissed(key: string, arg: string): boolean {
		return this.#gone.has(ScanBannerState.id(key, arg));
	}

	dismiss(key: string, arg: string): void {
		this.#gone = new Set([...this.#gone, ScanBannerState.id(key, arg)]);
	}

	reset(): void {
		if (this.#gone.size > 0) this.#gone = new Set();
	}
}

export const scanBanners = new ScanBannerState();
