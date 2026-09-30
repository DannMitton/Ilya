<script lang="ts">
	/**
	 * Voice type slice A (Dann, 2026-09-30): the singer declares a voice type,
	 * the first group of Voice characteristics, before Range, because the
	 * courtesy check (slice B) compares the fields after it against it. The brief is
	 * `docs/sessions/brief-code-voice-type-slice-a_r1_2026-09-30.md`; the ids
	 * and their order are in `voiceTypes.ts`.
	 *
	 * Tier 1 is one radio group, the nine types ending in "Not sure", with
	 * "Clear answer" back to no answer, for the reason `InsightsIntake.svelte`
	 * gives: a radio group cannot otherwise be unselected. "More specific"
	 * appears only after a Tier 1 type that has finer labels, lists only that
	 * type's labels, and ends with Other and its text field. Changing Tier 1
	 * clears a finer label that no longer belongs and keeps Other's text
	 * (`withTier1`). "Not sure" has no finer labels, so under it only Other and
	 * its text field show, without the "More specific" heading (desk default,
	 * 2026-09-30 10:46, `brief-code-small-fixes-before-ship_r1_2026-09-30.md`
	 * item 3). Routing stays with the Tier 1 id, so "Not sure" stays union.
	 *
	 * Every choice is optional and saves on change, as the Range fields do. The
	 * component holds no state of its own: the wizard owns the stored voice.
	 */
	import { t, type Language } from '$lib/i18n';
	import type { VoiceTypeChoice } from './profileStore';
	import { OTHER, TIER1, TIER2, isTier1, withTier1 } from './voiceTypes';

	interface Props {
		value: VoiceTypeChoice;
		language: Language;
		onchange: (next: VoiceTypeChoice) => void;
	}

	let { value, language, onchange }: Props = $props();

	const T = (key: string) => t(key, language);
	/* Only the three fields: the wizard may pass the whole stored voice. */
	const choice = (): VoiceTypeChoice => ({
		voiceType: value.voiceType,
		voiceTypeSpecific: value.voiceTypeSpecific,
		voiceTypeOther: value.voiceTypeOther
	});

	const tier1 = $derived(isTier1(value.voiceType) ? value.voiceType : undefined);
	const specifics = $derived(tier1 ? TIER2[tier1] : []);
	const notSure = $derived(tier1 === 'not-sure');

	function setSpecific(voiceTypeSpecific: string | undefined) {
		onchange({ ...choice(), voiceTypeSpecific });
	}

	/* Typing a label chooses Other; the text is stored as typed, and an empty
	   field stores nothing. */
	function setOther(text: string) {
		onchange({ ...choice(), voiceTypeSpecific: OTHER, voiceTypeOther: text.length > 0 ? text : undefined });
	}
</script>

<div class="voice-type">
	<fieldset class="vt-question">
		<legend class="vt-legend">{T('voiceType.heading')}</legend>
		<p class="vt-hint">{T('voiceType.hint')}</p>
		{#each TIER1 as id (id)}
			<label class="vt-option">
				<input
					type="radio"
					name="voice-type"
					value={id}
					checked={tier1 === id}
					onchange={() => onchange(withTier1(choice(), id))}
				/>
				<span>{T(`voiceType.type.${id}`)}</span>
			</label>
		{/each}
		{#if tier1}
			<button type="button" class="vt-clear" onclick={() => onchange(withTier1(choice(), undefined))}>
				{T('voiceIntake.clear')}
			</button>
		{/if}
	</fieldset>

	{#if tier1}
		<fieldset class="vt-question" aria-label={notSure ? T('voiceType.other') : undefined}>
			{#if !notSure}<legend class="vt-legend">{T('voiceType.more')}</legend>{/if}
			{#each specifics as id (id)}
				<label class="vt-option">
					<input
						type="radio"
						name="voice-type-specific"
						value={id}
						checked={value.voiceTypeSpecific === id}
						onchange={() => setSpecific(id)}
					/>
					<span>{T(`voiceType.specific.${id}`)}</span>
				</label>
			{/each}
			<label class="vt-option">
				<input
					type="radio"
					name="voice-type-specific"
					value={OTHER}
					checked={value.voiceTypeSpecific === OTHER}
					onchange={() => setSpecific(OTHER)}
				/>
				<span>{T('voiceType.other')}</span>
			</label>
			<input
				class="vt-text"
				type="text"
				aria-label={T('voiceType.other')}
				value={value.voiceTypeOther ?? ''}
				oninput={(e) => setOther(e.currentTarget.value)}
			/>
			{#if value.voiceTypeSpecific !== undefined}
				<button type="button" class="vt-clear" onclick={() => setSpecific(undefined)}>
					{T('voiceIntake.clear')}
				</button>
			{/if}
		</fieldset>
	{/if}
</div>

<style>
	/* `InsightsIntake.svelte`'s recipes, so the group reads as part of the
	   phase it sits in. */
	.voice-type {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
		text-align: left;
	}

	.vt-question {
		margin: 0;
		padding: 0;
		border: 0;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	/* The characteristics phase's group heading (`.charx-heading`). */
	.vt-legend {
		padding: 0 0 0.35rem;
		font-family: var(--font-sans);
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--ink-tertiary);
		font-weight: 600;
	}

	.vt-hint {
		margin: 0 0 0.25rem;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.8125rem;
		color: var(--ink-tertiary);
		line-height: 1.4;
	}

	.vt-option {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.8125rem;
		line-height: 1.35;
		color: var(--ink-secondary);
		cursor: pointer;
	}

	.vt-option input {
		margin: 0.15rem 0 0;
		flex-shrink: 0;
	}

	/* The voice-name field's recipe (`ProfileSwitcher.svelte`, `.ps-input`). */
	.vt-text {
		margin: 0 0 0 1.4rem;
		max-width: 16rem;
		font-family: inherit;
		font-size: 0.8125rem;
		padding: 0.375rem 0.625rem;
		border: 1px solid var(--stone-300);
		border-radius: 0.5rem;
		color: var(--ink-primary);
		background: #ffffff;
	}
	.vt-text:focus {
		outline: 2px solid var(--sage);
		outline-offset: 1px;
	}

	.vt-clear {
		align-self: flex-start;
		margin: 0.1rem 0 0 1.4rem;
		padding: 0;
		border: 0;
		background: none;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.75rem;
		color: var(--ink-tertiary);
		text-decoration: underline;
		text-underline-offset: 2px;
		cursor: pointer;
	}
</style>
