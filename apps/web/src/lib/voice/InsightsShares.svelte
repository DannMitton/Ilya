<script lang="ts">
	/**
	 * "WHAT INSIGHTS SHARES, AND HOW" (N.203 lane 61, Step 1): the second half of what was `InsightsIntake.svelte`, one panel (N.172, Dann
	 * 2026-09-24 23:21), split on Dann's ruling of 2026-11-15 20:20. The topics to comment on, the question on acoustics terms, and how
	 * comments appear (how many suggestions, imagery). Ratified by Dann 2026-09-25 (English 14:32 to 14:45, French 14:46 to 14:51).
	 *
	 * No intro: the station's name says what it holds (DESK DEFAULT, brief r3 section 3 Step 1). Every answer is optional and saves on change.
	 * The component holds no state: the wizard owns the stored voice, and every write is `onchange` with the whole `intake` object
	 * (`intake-answers.ts`).
	 */
	import type { IntakeAnswers, IntakeTopic } from '@ilya/score-parser';
	import { t, type Language } from '$lib/i18n';
	import IntakeScale from './IntakeScale.svelte';
	import { TOPICS, withImagery, withPoint, withSuggestions, withTopic } from './intake-answers';

	interface Props {
		value: IntakeAnswers | undefined;
		language: Language;
		onchange: (next: IntakeAnswers | undefined) => void;
	}
	let { value, language, onchange }: Props = $props();

	const T = (key: string) => t(key, language);
	const topicOn = (topic: IntakeTopic) => value?.topics?.[topic] !== false;
</script>

<div class="intake">
	<fieldset class="intake-question">
		<legend>{T('voiceIntake.topics.stem')}</legend>
		{#each TOPICS as topic (topic)}
			<label class="intake-option">
				<input type="checkbox" checked={topicOn(topic)} onchange={(e) => onchange(withTopic(value, topic, e.currentTarget.checked))} />
				<span>{@html T(`voiceIntake.topic.${topic}`)}</span>
			</label>
		{/each}
	</fieldset>
	<IntakeScale q="acoustics" value={value?.acoustics} {language} onpoint={(p) => onchange(withPoint(value, 'acoustics', p))} />

	<h4 class="intake-heading">{T('voiceIntake.appear.heading')}</h4>
	<fieldset class="intake-question">
		<legend>{T('voiceIntake.appear.count')}</legend>
		{#each ['two', 'all'] as const as n (n)}
			<label class="intake-option">
				<input
					type="radio"
					name="voice-intake-suggestions"
					value={n}
					checked={(value?.suggestions ?? 'two') === n}
					onchange={() => onchange(withSuggestions(value, n))}
				/>
				<span>{T(`voiceIntake.appear.${n}`)}</span>
			</label>
		{/each}
	</fieldset>
	<label class="intake-option">
		<input type="checkbox" checked={value?.imagery !== false} onchange={(e) => onchange(withImagery(value, e.currentTarget.checked))} />
		<span>{T('voiceIntake.appear.imagery')}</span>
	</label>
</div>

<style>
	.intake {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
		text-align: left;
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
