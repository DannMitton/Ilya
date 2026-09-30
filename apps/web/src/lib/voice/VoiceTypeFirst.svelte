<script lang="ts">
	/**
	 * The one optional question before the first vowel (Dann, 2026-09-30 12:43
	 * and 12:44; brief `brief-code-calibration-first-moments_r1_2026-09-30.md`):
	 * the singer's voice type, asked only when the voice has none yet. The nine
	 * Tier 1 choices, "Not sure" among them and a good answer. Skippable: Begin
	 * stands without an answer. The answer is the same stored `voiceType` the
	 * Voice characteristics step edits (`VoiceTypeIntake.svelte`), so it routes
	 * the plausibility bands from the first take. Finer labels stay in Voice
	 * characteristics.
	 */
	import { t, type Language } from '$lib/i18n';
	import { TIER1, type Tier1Id } from './voiceTypes';

	interface Props {
		value: string | undefined;
		language: Language;
		onchange: (id: Tier1Id) => void;
	}

	let { value, language, onchange }: Props = $props();

	const T = (key: string) => t(key, language);
</script>

<fieldset class="vt-first">
	<legend class="vt-legend">{T('calib.voiceTypeFirst.heading')}</legend>
	<p class="vt-hint">{T('calib.voiceTypeFirst.hint')}</p>
	<div class="vt-choices">
		{#each TIER1 as id (id)}
			<label class="vt-option">
				<input type="radio" name="voice-type-first" value={id} checked={value === id} onchange={() => onchange(id)} />
				<span>{T(`voiceType.type.${id}`)}</span>
			</label>
		{/each}
	</div>
</fieldset>

<style>
	/* `VoiceTypeIntake.svelte`'s recipes, laid in two columns, read downward, so the nine
	   choices do not push Begin off a phone screen. */
	.vt-first {
		margin: 0;
		padding: 0;
		border: 0;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		text-align: left;
		width: 100%;
		max-width: 22rem;
	}
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
	.vt-choices {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		grid-template-rows: repeat(5, auto);
		grid-auto-flow: column; /* reads down, in `TIER1`'s order */
		gap: 0.3rem 1rem;
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
</style>
