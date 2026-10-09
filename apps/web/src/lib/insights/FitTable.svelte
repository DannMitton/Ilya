<script lang="ts">
	/**
	 * The compatibility table: the piece's range, passaggio crossings, and
	 * tessitura against the singer's typed references, with a flag a row. Lifted
	 * out of `InsightsPane.svelte` unchanged (QUEUE row 60, which moved the
	 * closing verdict out from under it and so needed the room), with its helpers
	 * and styles. It reads the model and the language and draws; nothing here is
	 * clickable.
	 */
	import Italics, { italicRuns } from '$lib/components/Italics.svelte';
	import { t, type Language } from '$lib/i18n';
	import type { Pitch } from '@ilya/score-parser';
	import { pitchLabel } from '$lib/voice/note-picker';
	import type { Containment, InsightsModel } from '$lib/insights/insights';
	import { accidentalParts } from '$lib/insights/text-parts';

	interface Props {
		model: InsightsModel;
		language: Language;
	}

	let { model, language }: Props = $props();

	const T = (key: string) => t(key, language);
	const fill = (s: string, vars: Record<string, string | number>) =>
		Object.entries(vars).reduce((out, [k, v]) => out.replaceAll(`{${k}}`, String(v)), s);
	const P = (p: Pitch) => pitchLabel(p);

	function flagWord(flag: Containment | null): string {
		return flag ? T(`insights.flag.${flag}`) : '';
	}
</script>

{#snippet pitched(text: string)}{#each italicRuns(text) as run, i (i)}{#if run.title}<em>{#each accidentalParts(run.text) as part, j (j)}{#if part.acc}<span class="acc">{part.text}</span>{:else}{part.text}{/if}{/each}</em>{:else}{#each accidentalParts(run.text) as part, j (j)}{#if part.acc}<span class="acc">{part.text}</span>{:else}{part.text}{/if}{/each}{/if}{/each}{/snippet}

<div class="fit-table" role="table" aria-label={T('insights.fit.heading')}>
	<div class="fit-row fit-head" role="row">
		<span role="columnheader">{T('insights.fit.colTerm')}</span>
		<span role="columnheader">{T('insights.fit.colMeasured')}</span>
		<span role="columnheader">{T('insights.fit.colReference')}</span>
		<span role="columnheader" class="flag">{T('insights.fit.colFlag')}</span>
	</div>

	<div class="fit-row" role="row">
		<span role="cell" class="term">{T('insights.fit.range')}</span>
		<span role="cell">
			{#if model.range.measured}
				{@render pitched(fill(T('insights.fit.compass'), { low: P(model.range.measured.low), high: P(model.range.measured.high) }))}
			{:else}
				{T('insights.fit.noPitches')}
			{/if}
		</span>
		<span role="cell">
			{#if model.range.reference}
				{@render pitched(fill(T('insights.fit.spanTyped'), { low: P(model.range.reference.low), high: P(model.range.reference.high) }))}
			{:else}
				{T('insights.fit.notTyped')}
			{/if}
		</span>
		<span role="cell" class="flag">{flagWord(model.range.flag)}</span>
	</div>

	<div class="fit-row" role="row">
		<span role="cell" class="term"><Italics text={T('insights.fit.crossings')} /></span>
		<span role="cell">
			{#if model.crossings.measured}
				<Italics text={fill(T('insights.fit.crossingsCount'), model.crossings.measured)} />
			{:else}
				<Italics text={T('insights.fit.crossingsUncounted')} />
			{/if}
		</span>
		<span role="cell">
			{#if model.crossings.reference}
				{@render pitched(fill(T('insights.fit.passaggiTyped'), { primo: P(model.crossings.reference.primo), secondo: P(model.crossings.reference.secondo) }))}
			{:else}
				{T('insights.fit.notTyped')}
			{/if}
		</span>
		<!-- No threshold for a crossing count is ruled anywhere, so the
		     flag says that rather than judging the count. -->
		<span role="cell" class="flag">{model.crossings.measured ? T('insights.flag.noThreshold') : ''}</span>
	</div>

	<div class="fit-row" role="row">
		<span role="cell" class="term">{T('insights.fit.tessitura')}</span>
		<span role="cell">
			{#if model.tessitura.measured}
				{@render pitched(fill(T('insights.fit.span'), { low: P(model.tessitura.measured.low), high: P(model.tessitura.measured.high) }))}<sup>1</sup>
				{#if model.tessitura.measured.basis === 'half-second-maximum'}
					<span class="qualifier">{T('insights.fit.tessituraFallback')}</span>
				{/if}
				{#if model.tessitura.measured.marginal}
					<span class="qualifier">{T('insights.fit.tessituraMarginal')}</span>
				{/if}
			{:else if model.tessitura.withheldFor}
				{fill(
					T(model.tessitura.withheldFor.length === 1 ? 'insights.fit.withheldOne' : 'insights.fit.withheldMany'),
					{ measures: model.tessitura.withheldFor.join(', ') },
				)}
			{:else}
				{T('insights.fit.nothingSung')}
			{/if}
		</span>
		<span role="cell">
			{#if model.tessitura.reference}
				{@render pitched(fill(T('insights.fit.spanTyped'), { low: P(model.tessitura.reference.low), high: P(model.tessitura.reference.high) }))}
			{:else}
				{T('insights.fit.notTyped')}
			{/if}
		</span>
		<span role="cell" class="flag">{flagWord(model.tessitura.flag)}</span>
	</div>
</div>

<style>
	.fit-table {
		display: grid;
		grid-template-columns: 150px 1fr 1fr 88px;
		column-gap: 14px;
		font-family: var(--font-serif);
		font-size: 12.5px;
		line-height: 1.35;
		color: var(--ink-secondary);
	}

	.fit-row {
		display: contents;
	}

	.fit-row > span {
		padding: 5px 0 4px;
		border-top: 1px solid rgba(171, 127, 127, 0.35);
	}

	.fit-head > span {
		padding-top: 0;
		border-top: none;
		font-family: var(--font-sans);
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-tertiary);
	}

	.fit-table .acc {
		font-family: var(--font-sans);
	}

	.fit-row .term {
		color: var(--ink-primary);
	}

	.fit-row .flag {
		text-align: right;
	}

	.fit-row:not(.fit-head) .flag {
		font-family: var(--font-sans);
		font-size: 10.5px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-secondary);
	}

	.qualifier {
		display: block;
		color: var(--ink-tertiary);
	}

	sup {
		font-size: 0.62em;
		line-height: 0;
	}
</style>
