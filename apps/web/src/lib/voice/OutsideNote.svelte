<script lang="ts">
	/**
	 * The summary's one note (Dann, 2026-09-30 12:43; brief
	 * `docs/sessions/brief-code-calibration-first-moments_r1_2026-09-30.md`).
	 * It names the readings outside the values for the declared type, once, and
	 * offers Keep or Re-take. Strings ratified 12:49, verbatim. Which readings,
	 * and which sentence, come from `outside.ts`; the wizard owns the profile.
	 */
	import type { Snippet } from 'svelte';
	import { t, type Language } from '$lib/i18n';
	import type { Vowel } from './engine/types';
	import { outsideNote } from './outside';

	interface Props {
		vowels: Vowel[];
		voiceType: string | undefined;
		language: Language;
		/** The wizard's `vowelTag`, so a vowel reads here as it does in the roster. */
		tag: Snippet<[Vowel]>;
		onkeep: () => void;
		onretake: () => void;
	}

	let { vowels, voiceType, language, tag, onkeep, onretake }: Props = $props();

	const T = (key: string) => t(key, language);
	/* {type} is the Tier 1 label in lower case; {vowels} is the list of tags. */
	const parts = $derived.by(() => {
		const { key, typeId } = outsideNote(voiceType);
		const type = typeId ? T(`voiceType.type.${typeId}`).toLocaleLowerCase(language) : '';
		const [before, after = ''] = T(key).replace('{type}', type).split('{vowels}');
		return { before, after };
	});
</script>

<div class="outside-note" role="status">
	<p>
		{parts.before}{#each vowels as g, i (g)}{#if i > 0}{', '}{/if}{@render tag(g)}{/each}{parts.after}
	</p>
	<div class="outside-actions">
		<button type="button" onclick={onkeep}>{T('calib.summary.keepAll')}</button>
		<button type="button" onclick={onretake}>{T('calib.common.retake')}</button>
	</div>
</div>

<style>
	/* The wizard's inline banner and its hold actions (`.wizard-inline-banner`,
	   `.wizard-hold-actions` in `CalibrationWizard.svelte`). */
	.outside-note {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-radius: 0.75rem;
		background: var(--drawer-bg);
		border: 1px solid var(--stone-300);
		width: 100%;
		box-sizing: border-box;
	}
	.outside-note p {
		margin: 0;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.875rem;
		color: var(--ink-secondary);
		text-align: center;
		line-height: 1.45;
	}
	.outside-actions {
		display: flex;
		gap: 0.5rem;
	}
	.outside-actions button {
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.8125rem;
		font-weight: 600;
		padding: 0.375rem 0.875rem;
		border-radius: 999px;
		border: 1px solid var(--stone-300);
		background: #ffffff;
		color: var(--ink-secondary);
		cursor: pointer;
	}
	.outside-actions button:hover {
		border-color: var(--sage);
		color: var(--sage);
	}
</style>
