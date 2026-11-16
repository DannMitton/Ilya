<script lang="ts">
	/**
	 * THE VOICE PANE AT REST (N.203 lane 60, Step 2; plan r4 sections 4.1 and 4.2). It replaces `VoiceAnchor`.
	 *
	 * In order: the voice line (the voice's name with the built switcher and its list, then the voice type, or "Choose a voice type", which
	 * opens the built voice type control in place); the voice's sentence; the doors. With no voice saved it shows the built first-launch form
	 * and nothing else. The one filled control in the pane is that form's Start (`ProfileSwitcher.svelte`), as the Drawer fills one pill at
	 * rest (`docs/memory/PRODUCT.md:522`); every door is quiet, because the next thing on the path is the piece, which INPUT already fills.
	 *
	 * This component decides nothing about the voices: it renders the published seam (`voice/seam.ts`) and calls its commands. The sentence,
	 * the door names, and the vowel-space rule are in `voice-pane.ts`. The pane is never on screen beside the capture screen (the takeover
	 * stows the Drawer's content), so nothing here is inert during a take.
	 */
	import { t, type Language } from '$lib/i18n';
	import ProfileSwitcher from '$lib/voice/ProfileSwitcher.svelte';
	import VoiceTypeIntake from '$lib/voice/VoiceTypeIntake.svelte';
	import type { VoiceRequestKind, VoiceSeam } from '$lib/voice/seam';
	import type { VoiceTypeChoice } from '$lib/voice/profileStore';
	import { paneSentence, recordDoorKey, showVowelSpaceDoor, typeControlLabel } from './voice-pane';

	interface Props {
		language: Language;
		/** What the wizard published; undefined before its first publication. */
		seam: VoiceSeam | undefined;
		/** The active voice's stored voice type and finer answers. */
		voiceType: VoiceTypeChoice | undefined;
		/** `usableReadingCount(voiceFormants)`. */
		usable: number;
		/** Whether the active voice has any stored reading, usable or not. */
		hasStoredReading: boolean;
		/** Whether every vowel left can be worked out (lane 59's `finishEarlyState`); `false` until that lane is merged. */
		restWorkedOut?: boolean;
		onopen: (kind: VoiceRequestKind) => void;
	}
	let { language, seam, voiceType, usable, hasStoredReading, restWorkedOut = false, onopen }: Props = $props();

	let typeOpen = $state(false);
	const typeLabel = $derived(typeControlLabel(voiceType, language));
	const sentence = $derived(paneSentence({ usable, voiceType: voiceType?.voiceType, restWorkedOut }, language));
	const T = (key: string) => t(key, language);
</script>

{#if seam}
	<div class="voice-pane">
		<ProfileSwitcher
			voices={seam.voices}
			activeId={seam.activeId}
			{language}
			nextDefaultName={seam.nextDefaultName}
			onSelect={seam.select}
			onCreate={seam.create}
			onDuplicate={seam.duplicate}
			onRename={seam.rename}
			onDelete={seam.remove}
		/>
		{#if seam.voices.length}
			<button type="button" class="vp-type" aria-expanded={typeOpen} onclick={() => (typeOpen = !typeOpen)}>
				{typeLabel ?? T('calib.pane.chooseType')}
			</button>
			{#if typeOpen}
				<div class="vp-type-body"><VoiceTypeIntake value={voiceType ?? {}} {language} onchange={(next) => seam?.setOwn(next)} /></div>
			{/if}
			<p class="vp-sentence">{sentence}</p>
			<div class="vp-doors">
				<button type="button" class="vp-door" onclick={() => onopen('record')}>{T(recordDoorKey(usable))}</button>
				{#if showVowelSpaceDoor(hasStoredReading, voiceType?.voiceType)}
					<button type="button" class="vp-door" onclick={() => onopen('summary')}>{T('calib.pane.door.space')}</button>
				{/if}
				<button type="button" class="vp-door" onclick={() => onopen('characteristics')}>{T('calib.pane.door.describe')}</button>
				<button type="button" class="vp-door" onclick={() => onopen('characteristics')}>{T('calib.pane.door.insights')}</button>
			</div>
		{/if}
	</div>
{/if}

<style>
	.voice-pane {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.6rem;
		padding: 0.25rem 0 0.5rem;
		font-family: var(--font-sans);
	}
	.vp-type {
		align-self: center;
		background: none;
		border: none;
		padding: 0.25rem 0.5rem;
		font: inherit;
		font-size: 0.8125rem;
		color: var(--lavender-ink);
		text-decoration: underline;
		text-underline-offset: 0.2em;
		cursor: pointer;
	}
	.vp-type-body {
		padding: 0 0.25rem;
	}
	.vp-sentence {
		margin: 0;
		font-size: 0.875rem;
		line-height: 1.45;
		color: var(--ink-secondary);
	}
	.vp-doors {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.4rem;
	}
	/* Quiet pills: nothing in the pane at rest is filled but the first-launch Start. */
	.vp-door {
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.875rem;
		font-weight: 600;
		min-height: 2.5rem;
		padding: 0.45rem 1rem;
		border-radius: 999px;
		border: 1px solid var(--stone-300);
		background: transparent;
		color: var(--ink-secondary);
		cursor: pointer;
	}
	.vp-door:hover {
		border-color: var(--lavender);
		color: var(--lavender-ink);
	}
	.vp-door:focus-visible,
	.vp-type:focus-visible {
		outline: 2px solid var(--ink-primary);
		outline-offset: 2px;
	}
	@media (pointer: coarse) {
		.vp-door {
			min-height: 44px;
		}
		.vp-type {
			min-height: 44px;
		}
	}
</style>
