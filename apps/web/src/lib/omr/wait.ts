/**
 * The wait for the reader, as numbers and words (`brief-code-wait-on-the-paper_r1_2026-10-07.md`).
 *
 * Pure: no DOM, no timers, no store. `reading-wait.svelte.ts` holds the state
 * and the timers; `ReadingWait.svelte` draws it. Everything a test needs to
 * decide is here.
 */
import type { OmrProgress } from './homr-reader';
import { t, type Language } from '$lib/i18n';
import type { TabId } from '$lib/destinations';

/** What the singer is told. `preparing`: the models are loading, no page has started. */
export interface WaitState {
	phase: 'preparing' | 'reading';
	/** 1-based, 0 before the first page starts. Never falls. */
	page: number;
	pages: number;
	/** 0 to 1: the filled part of the staff. Never falls. */
	fill: number;
}

export const WAIT_START: WaitState = { phase: 'preparing', page: 0, pages: 0, fill: 0 };

/** The read must still be going this long after it began before anything is drawn. */
export const SHOW_AFTER_MS = 1000;
/** On success the complete staff is held this long, then faded over `FADE_MS`. */
export const HOLD_MS = 600;
export const FADE_MS = 300;

/**
 * The next state for one `onProgress` call. The fill is pages done over pages,
 * advanced inside a page by `done / total`, and it only rises: the second pass
 * on WebAssembly (`homr-reader.ts`) restarts at page 1, and the staff holds
 * where it was. The page number holds too, so the line and the staff agree.
 */
export function advanceWait(prev: WaitState, p: OmrProgress): WaitState {
	if (p.stage === 'models' || p.pages < 1) return prev;
	const within = p.total > 0 ? Math.min(1, Math.max(0, p.done / p.total)) : 0;
	const fill = Math.min(1, Math.max(0, (p.page - 1 + within) / p.pages));
	return {
		phase: 'reading',
		page: Math.max(prev.page, p.page),
		pages: Math.max(prev.pages, p.pages),
		fill: Math.max(prev.fill, fill),
	};
}

/** The state when every page is read: the staff is complete. */
export function completeWait(prev: WaitState): WaitState {
	return { ...prev, fill: 1 };
}

/** "Reading your score · page 2 of 3", in the language now, or null before the first page. */
export function readingLine(s: WaitState, language: Language): string | null {
	if (s.phase !== 'reading') return null;
	return t('wait.reading', language).replace('{page}', String(s.page)).replace('{pages}', String(s.pages));
}

/** The line for the Paper's squircle and the drawer's echo: the preparing text until a page starts. */
export function waitLine(s: WaitState, language: Language): string {
	return readingLine(s, language) ?? t('upload.status.preparingReader', language);
}

/** The tab's own desk tint and label ink (`app.css`), for the three documents; null elsewhere. */
export function waitColours(tab: TabId): { fill: string; ink: string } | null {
	switch (tab) {
		case 'text':
			return { fill: 'var(--sage-desk)', ink: 'var(--sage-ink)' };
		case 'markup':
			return { fill: 'var(--lavender-desk)', ink: 'var(--lavender-ink)' };
		case 'insights':
			return { fill: 'var(--rose-desk)', ink: 'var(--rose-ink)' };
		default:
			return null;
	}
}
