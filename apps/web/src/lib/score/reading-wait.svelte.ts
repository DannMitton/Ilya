/**
 * The wait for the reader: one shared state, set by the reading flows
 * (`omr/scan.ts`, `omr/restore.ts`) and read by `ReadingWait.svelte` (the
 * squircle on the Paper) and `ScoreUploader.svelte` (the drawer's echo).
 *
 * It stores numbers, never words, so a language switch mid-wait changes the
 * line (N.167). The squircle appears only where the read is still going
 * `SHOW_AFTER_MS` after it began, so a kept reading, which reopens in about
 * 0.4 s, shows nothing.
 */
import type { OmrProgress } from '$lib/omr/homr-reader';
import type { Language } from '$lib/i18n';
import { advanceWait, completeWait, readingLine, FADE_MS, HOLD_MS, SHOW_AFTER_MS, WAIT_START, type WaitState } from '$lib/omr/wait';

/** What the reading flows ask of the wait. */
export interface WaitHooks {
	begin: () => void;
	progress: (p: OmrProgress) => void;
	/** Every page is read: the staff completes, holds, and fades. */
	complete: () => void;
	/** The read failed or went to the poem route: gone at once. */
	cancel: () => void;
}

export class ReadingWait implements WaitHooks {
	/** True from `begin` to the end of the fade; the drawer's echo reads this. */
	active = $state(false);
	/** True once the squircle is drawn: after the delay, until the fade is done. */
	visible = $state(false);
	/** True while the squircle fades out. */
	leaving = $state(false);
	state = $state<WaitState>(WAIT_START);
	private timers: ReturnType<typeof setTimeout>[] = [];

	private clear() {
		for (const id of this.timers) clearTimeout(id);
		this.timers = [];
	}

	/** The reading line in this language, or null before a page has started. */
	line = (language: Language) => readingLine(this.state, language);

	begin = () => {
		this.clear();
		this.state = WAIT_START;
		this.active = true;
		this.visible = false;
		this.leaving = false;
		this.timers.push(setTimeout(() => (this.visible = true), SHOW_AFTER_MS));
	};

	progress = (p: OmrProgress) => {
		if (this.active) this.state = advanceWait(this.state, p);
	};

	complete = () => {
		if (!this.active) return;
		this.state = completeWait(this.state);
		if (!this.visible) return this.cancel();
		this.clear();
		this.timers.push(
			setTimeout(() => {
				this.leaving = true;
				this.timers.push(setTimeout(() => this.cancel(), FADE_MS));
			}, HOLD_MS),
		);
	};

	cancel = () => {
		this.clear();
		this.active = false;
		this.visible = false;
		this.leaving = false;
	};
}

/** The one wait the app has. */
export const readingWait = new ReadingWait();
