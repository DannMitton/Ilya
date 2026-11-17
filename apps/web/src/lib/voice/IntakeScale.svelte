<script lang="ts">
	/**
	 * ONE SCALED QUESTION of the intake (N.203 lane 61, Step 1; it was the `scale` snippet in `InsightsIntake.svelte`). Drawn by both stations:
	 * the five questions on how the voice is doing in "Describe your voice", the acoustics question in "What INSIGHTS shares, and how".
	 *
	 * RATIFIED by Dann 2026-09-25 (N.172, `docs/sessions/draft-n172-intake-survey_r1_2026-09-24.md`): each question is one radio group, points 1
	 * to 5 then "Not sure", with "Clear answer" back to no answer, because a radio group cannot otherwise be unselected. The component holds no
	 * state: the answer arrives as `value` and every change leaves as `onpoint`.
	 */
	import type { IntakePoint } from '@ilya/score-parser';
	import { t, type Language } from '$lib/i18n';
	import { SYMBOL_PARTS, stemParts } from './intake-symbols';
	import { POINTS, type Scaled } from './intake-answers';

	interface Props {
		q: Scaled;
		value: IntakePoint | undefined;
		language: Language;
		onpoint: (p: IntakePoint | undefined) => void;
	}
	let { q, value, language, onpoint }: Props = $props();

	const T = (key: string) => t(key, language);
	const label = (p: IntakePoint) => (p === 'not-sure' ? T('voiceIntake.notSure') : T(`voiceIntake.${q}.${p}`));
</script>

<fieldset class="intake-question">
	<legend>{#each stemParts(T(`voiceIntake.${q}.stem`)) as part, k (k)}{#if part.kind === 'symbol'}{@const sym = SYMBOL_PARTS[part.symbol]}<span class="stem-symbol">{sym.before}<i>{sym.italic}</i><sub>{sym.sub}</sub></span>{:else}{@html part.text}{/if}{/each}</legend>
	{#each POINTS as p (p)}
		<label class="intake-option">
			<input type="radio" name="voice-intake-{q}" value={String(p)} checked={value === p} onchange={() => onpoint(p)} />
			<span>{@html label(p)}</span>
		</label>
	{/each}
	{#if value !== undefined}
		<button type="button" class="intake-clear" onclick={() => onpoint(undefined)}>{T('voiceIntake.clear')}</button>
	{/if}
</fieldset>

<style>
	/* The acoustics question's symbols (Titze et al. 2015, Table I): an italic letter and an upright subscript set slightly smaller (Dann 2026-07-10). */
	.stem-symbol i {
		font-style: italic;
	}
	.stem-symbol sub {
		font-style: normal;
		font-size: 0.78em;
		line-height: 1;
	}
	.intake-question {
		margin: 0;
		padding: 0;
		border: 0;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.intake-question legend {
		padding: 0 0 0.35rem;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.875rem;
		font-weight: 600;
		line-height: 1.35;
		color: var(--ink-primary);
	}
	.intake-option {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.8125rem;
		line-height: 1.35;
		color: var(--ink-secondary);
		cursor: pointer;
	}
	.intake-option input {
		margin: 0.15rem 0 0;
		flex-shrink: 0;
	}
	.intake-clear {
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
