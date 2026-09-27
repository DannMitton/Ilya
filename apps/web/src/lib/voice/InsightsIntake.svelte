<script lang="ts">
	/**
	 * N.172: the Insights intake, one panel (Dann, 2026-09-24 23:21).
	 *
	 * RATIFIED by Dann 2026-09-25: the English 14:32 to 14:45, the French 14:46
	 * to 14:51 (`docs/sessions/draft-n172-intake-survey_r1_2026-09-24.md` and
	 * `draft-n172-intake-french_r1_2026-09-25.md`). Seven questions, all asked
	 * now (14:27). Each of questions 1 to 5 and 7 is one radio group, points 1
	 * to 5 then "Not sure", with "Clear answer" back to no answer, because a
	 * radio group cannot otherwise be unselected (14:28). Question 6 is
	 * checkboxes, all checked (14:31), and it comes before question 7, which
	 * is about how Insights speaks (14:30). "How comments appear" follows: the
	 * suggestion count as a radio pair (14:42) and the imagery checkbox (14:44).
	 *
	 * Every answer is optional and saves on change, as the Range fields do. The
	 * component holds no state of its own: the wizard owns the stored voice.
	 */
	import type { IntakeAnswers, IntakePoint, IntakeTopic } from '@ilya/score-parser';
	import { t, type Language } from '$lib/i18n';

	interface Props {
		value: IntakeAnswers | undefined;
		language: Language;
		onchange: (next: IntakeAnswers | undefined) => void;
	}

	let { value, language, onchange }: Props = $props();

	const T = (key: string) => t(key, language);

	type Scaled = 'top' | 'bottom' | 'passaggi' | 'sustained' | 'softHigh' | 'acoustics';
	const BEFORE_TOPICS: Scaled[] = ['top', 'bottom', 'passaggi', 'sustained', 'softHigh'];
	const TOPICS: IntakeTopic[] = ['high', 'low', 'passaggi', 'sustained', 'softHigh', 'other'];
	const POINTS: IntakePoint[] = [1, 2, 3, 4, 5, 'not-sure'];

	/* The intro's number counts the questions shown (Dann's edit, 14:30), so it
	   stays true when a question is added. */
	const questionCount = BEFORE_TOPICS.length + 2;
	const intro = $derived(T('voiceIntake.intro').replace('{count}', T(`voiceIntake.count.${questionCount}`)));

	/** Drops empty members so a fully cleared panel stores nothing. */
	function tidy(next: IntakeAnswers): IntakeAnswers | undefined {
		const out: IntakeAnswers = { ...next };
		for (const k of Object.keys(out) as (keyof IntakeAnswers)[]) if (out[k] === undefined) delete out[k];
		if (out.topics && Object.values(out.topics).every((on) => on !== false)) delete out.topics;
		if (out.suggestions === 'two') delete out.suggestions;
		if (out.imagery === true) delete out.imagery;
		return Object.keys(out).length > 0 ? out : undefined;
	}

	function setPoint(q: Scaled, p: IntakePoint | undefined) {
		onchange(tidy({ ...(value ?? {}), [q]: p }));
	}

	function setTopic(topic: IntakeTopic, on: boolean) {
		onchange(tidy({ ...(value ?? {}), topics: { ...(value?.topics ?? {}), [topic]: on } }));
	}

	function label(q: Scaled, p: IntakePoint): string {
		return p === 'not-sure' ? T('voiceIntake.notSure') : T(`voiceIntake.${q}.${p}`);
	}
</script>

{#snippet scale(q: Scaled)}
	<fieldset class="intake-question">
		<legend>{@html T(`voiceIntake.${q}.stem`)}</legend>
		{#each POINTS as p (p)}
			<label class="intake-option">
				<input
					type="radio"
					name="voice-intake-{q}"
					value={String(p)}
					checked={value?.[q] === p}
					onchange={() => setPoint(q, p)}
				/>
				<span>{@html label(q, p)}</span>
			</label>
		{/each}
		{#if value?.[q] !== undefined}
			<button type="button" class="intake-clear" onclick={() => setPoint(q, undefined)}>{T('voiceIntake.clear')}</button>
		{/if}
	</fieldset>
{/snippet}

<div class="intake">
	<p class="intake-intro">{intro}</p>
	{#each BEFORE_TOPICS as q (q)}
		{@render scale(q)}
	{/each}
	<fieldset class="intake-question">
		<legend>{T('voiceIntake.topics.stem')}</legend>
		{#each TOPICS as topic (topic)}
			<label class="intake-option">
				<input
					type="checkbox"
					checked={value?.topics?.[topic] !== false}
					onchange={(e) => setTopic(topic, e.currentTarget.checked)}
				/>
				<span>{@html T(`voiceIntake.topic.${topic}`)}</span>
			</label>
		{/each}
	</fieldset>
	{@render scale('acoustics')}

	<h3 class="intake-heading">{T('voiceIntake.appear.heading')}</h3>
	<fieldset class="intake-question">
		<legend>{T('voiceIntake.appear.count')}</legend>
		{#each ['two', 'all'] as const as n (n)}
			<label class="intake-option">
				<input
					type="radio"
					name="voice-intake-suggestions"
					value={n}
					checked={(value?.suggestions ?? 'two') === n}
					onchange={() => onchange(tidy({ ...(value ?? {}), suggestions: n }))}
				/>
				<span>{T(`voiceIntake.appear.${n}`)}</span>
			</label>
		{/each}
	</fieldset>
	<label class="intake-option">
		<input
			type="checkbox"
			checked={value?.imagery !== false}
			onchange={(e) => onchange(tidy({ ...(value ?? {}), imagery: e.currentTarget.checked }))}
		/>
		<span>{T('voiceIntake.appear.imagery')}</span>
	</label>
</div>

<style>
	/* The characteristics phase's own recipes (`CalibrationWizard.svelte`,
	   `.charx-*`), so the panel reads as part of the phase it sits in. */
	.intake {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
		text-align: left;
	}

	.intake-intro {
		margin: 0;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.8125rem;
		color: var(--ink-tertiary);
		line-height: 1.4;
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

	.intake-heading {
		margin: 0.25rem 0 0;
		font-family: var(--font-sans);
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--ink-tertiary);
		font-weight: 600;
	}
</style>
