/**
 * THE SEAM between the VOICE pane at rest and the wizard that holds the voices (N.203 lane 60, Step 1; plan r4 section 7.1, option B).
 *
 * The voices and every write to them live in `CalibrationWizard.svelte` (`store`). The wizard is mounted whenever Studio is up, so the
 * page can hand the pane one published object and one request. Pure, so the rules are tested here and the wizard (at its line ceiling)
 * carries a line for each.
 *
 * No take-running flag crosses this seam (review amendment 3): the takeover stows the whole Drawer content while it is up, so the pane is
 * never on screen beside the capture screen, and every command below that changes the voice ends the flow (`resetFlow`).
 */
import type { assignToVoice } from './profileStore';

/** What the pane's doors ask the wizard to show. "sing" is not a name here: it is the modal part of a take only (Dann 2026-11-16 01:13). */
export type VoiceRequestKind = 'record' | 'summary' | 'characteristics';

export interface VoiceRequest {
	phase: VoiceRequestKind;
	/** Each new `n` is answered once, so the same door pressed twice still lands. */
	n: number;
	/** True when the takeover was not up at the moment of the request, that is, the request came from the Drawer at rest. */
	fromRest: boolean;
}

/** The singer's own answers the wizard saves on every change (`setOwn`): the voice type, its finer label, her own words, the INSIGHTS intake. */
export type OwnAnswers = Parameters<typeof assignToVoice>[1];

/** What the wizard publishes to the page, whole, whenever the list, the active voice, or the next default name changes. */
export interface VoiceSeam {
	voices: { id: string; name: string; createdAt: string }[];
	activeId: string | null;
	/** The smallest unused default name, which the switcher offers in its drafts. */
	nextDefaultName: string;
	select(id: string): void;
	create(name: string): void;
	duplicate(name: string): void;
	rename(name: string): void;
	remove(): void;
	setOwn(patch: OwnAnswers): void;
}

export type Landing = 'welcome' | 'capture' | 'summary' | 'characteristics';

/**
 * Where a request lands. `record` opens Welcome for a voice with no stored reading (`hasAnyReadings`, the wizard's own test), else the
 * capture screen on the next vowel Ilya's order has not got (`openTour`, which gives [i] at ten recorded).
 */
export function landingFor(kind: VoiceRequestKind, hasReadings: boolean): Landing {
	if (kind === 'record') return hasReadings ? 'capture' : 'welcome';
	return kind;
}

/**
 * A request is refused only when it would break into a screen the singer is looking at: INSIGHTS' "Add your range" pressed while the
 * capture screen is showing (today's rule for that link). A request from rest is never refused: the pane is not on screen beside the
 * takeover. A refused request is dropped, never answered later; nothing moves by itself after a take.
 */
export function requestRefused(phase: string, req: Pick<VoiceRequest, 'fromRest'>): boolean {
	return phase === 'capture' && !req.fromRest;
}
