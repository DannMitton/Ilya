<script lang="ts">
	/**
	 * "DESCRIBE YOUR VOICE" (N.203 lane 61, Step 1): the first half of what was `InsightsIntake.svelte` joined to the characteristics screen of
	 * the takeover (`CalibrationWizard.svelte`, retired at Step 2). Dann 2026-11-15 20:03: "in Voice there is a whol intakle apparatus for
	 * self-reposted voice qualities. We need that in our plan." No microphone, no recorded vowel, nothing to submit: every answer saves as it
	 * changes.
	 *
	 * In order: the lede (`calib.characteristics.lede`, built words, a DESK DEFAULT on Fable's recommendation 6.4; Dann may strike or reword it);
	 * the six note pickers (range, comfortable working zone, passaggio; E.5 slice 3, Kimi's Q5 ruling, v39 section A.31: typed-first capture, every
	 * field optional, source 'manual', higher limit first in all three groups, Dann 2026-09-28 15:40); then `voiceIntake.intro` and the five
	 * questions on how the voice is doing (N.172, ratified 2026-09-25).
	 *
	 * The component holds no state. The stored values arrive as props; every write leaves as `onnote(field, pitch)` or `onintake(next)`, the
	 * seam's `setCharacteristic` and `setOwn({ intake })`. It loads the notation font itself: the six pickers share one memoized load, and a
	 * failure falls back to the pickers' primitive shapes, never blocking.
	 */
	import { onMount } from 'svelte';
	import type { IntakeAnswers, Pitch } from '@ilya/score-parser';
	import { t, type Language } from '$lib/i18n';
	import Italics from '$lib/components/Italics.svelte';
	import { loadNotationFont, type LoadedNotationFont } from '$lib/score/notation-fonts';
	import NotePicker from './NotePicker.svelte';
	import IntakeScale from './IntakeScale.svelte';
	import { invertedPairs } from './characteristics-pairs';
	import { BEFORE_TOPICS, withPoint } from './intake-answers';
	import type { CharacteristicField } from './seam';
	import type { VoiceCharacteristics } from './engine/types';

	interface Props {
		characteristics: VoiceCharacteristics | undefined;
		intake: IntakeAnswers | undefined;
		/** The stored Tier 1 voice type id, which picks each picker's clef. */
		voiceType: string | undefined;
		language: Language;
		onnote: (field: CharacteristicField, p: Pitch | undefined) => void;
		onintake: (next: IntakeAnswers | undefined) => void;
	}
	let { characteristics, intake, voiceType, language, onnote, onintake }: Props = $props();

	const T = (key: string) => t(key, language);
	const inverted = $derived(invertedPairs(characteristics));
	/* The intro's number counts the questions shown here (Dann's edit, 14:30), so it stays true when a question is added. */
	const intro = $derived(T('voiceIntake.intro').replace('{count}', T(`voiceIntake.count.${BEFORE_TOPICS.length}`)));

	let notationFont = $state<LoadedNotationFont | null>(null);
	onMount(() => {
		let alive = true;
		loadNotationFont()
			.then((f) => {
				if (alive) notationFont = f;
			})
			.catch(() => {
				/* primitive-mode fallback; the pickers stay fully functional */
			});
		return () => {
			alive = false;
		};
	});
</script>

{#snippet picker(field: CharacteristicField, labelKey: string)}
	<NotePicker
		label={T(labelKey)}
		value={characteristics?.[field]}
		font={notationFont}
		{language}
		{voiceType}
		onchange={(p) => onnote(field, p)}
	/>
{/snippet}

<div class="dv">
	<p class="dv-lede">{T('calib.characteristics.lede')}</p>
	<div class="dv-group" data-describe="range">
		<h4 class="dv-heading">{T('calib.characteristics.rangeHeading')}</h4>
		{@render picker('rangeHigh', 'calib.characteristics.rangeHighLabel')}
		{@render picker('rangeLow', 'calib.characteristics.rangeLowLabel')}
		{#if inverted.range}
			<p class="dv-note" role="status">{T('calib.characteristics.rangeInvertedNote')}</p>
		{/if}
	</div>
	<div class="dv-group">
		<h4 class="dv-heading">{T('calib.characteristics.tessituraHeading')}</h4>
		<p class="dv-hint">{T('calib.characteristics.tessituraHint')}</p>
		{@render picker('tessituraHigh', 'calib.characteristics.tessituraHighLabel')}
		{@render picker('tessituraLow', 'calib.characteristics.tessituraLowLabel')}
		{#if inverted.tessitura}
			<p class="dv-note" role="status">{T('calib.characteristics.tessituraInvertedNote')}</p>
		{/if}
	</div>
	<div class="dv-group">
		<h4 class="dv-heading"><Italics text={T('calib.characteristics.passaggioHeading')} /></h4>
		<p class="dv-hint"><Italics text={T('calib.characteristics.passaggioHint')} /></p>
		{@render picker('passaggioSecondary', 'calib.characteristics.passaggioSecondaryLabel')}
		{@render picker('passaggioPrimary', 'calib.characteristics.passaggioPrimaryLabel')}
	</div>
	<div class="dv-group dv-questions">
		<p class="dv-hint">{intro}</p>
		{#each BEFORE_TOPICS as q (q)}
			<IntakeScale {q} value={intake?.[q]} {language} onpoint={(p) => onintake(withPoint(intake, q, p))} />
		{/each}
	</div>
</div>

<style>
	.dv {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
		text-align: left;
	}
	.dv-lede {
		margin: 0;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.8125rem;
		color: var(--ink-secondary);
		line-height: 1.4;
	}
	/* Groups fence with a quiet rule; the group heading takes a smaller cut of the phase-heading recipe so the hierarchy reads at a glance. */
	.dv-group {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
		padding-top: 0.625rem;
		border-top: 1px solid var(--stone-300);
	}
	.dv-questions {
		gap: 0.875rem;
	}
	.dv-heading {
		margin: 0;
		font-family: var(--font-sans);
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--ink-tertiary);
		font-weight: 600;
		text-align: left;
	}
	.dv-hint {
		margin: 0;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.8125rem;
		color: var(--ink-tertiary);
		line-height: 1.4;
	}
	.dv-note {
		margin: 0;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.8125rem;
		color: var(--prep-amber);
		line-height: 1.4;
	}
</style>
