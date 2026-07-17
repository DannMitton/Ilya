<script lang="ts">
	/**
	 * The "Textual witnesses" drawer section (reconciliation shell, piece 3).
	 *
	 * A quiet, collapsed-by-default section (Kimi Q1, Q2). It states one summary
	 * line, and on expand lists the surfaced divergences with a measure-number
	 * navigation link and the two witness readings. No chrome badges. Auto-reconciled
	 * trivia (the ё convention) never appears here; the view-model already excludes it.
	 *
	 * All derivable state lives in ./reconciliation/witnesses (tested); this file is
	 * the thin presentational shell, reviewed by eye and gated in the browser, per the
	 * repo convention. It is not yet wired into the live Fit drawer (Option A): the
	 * alignment engine that populates `reconciliation` waits for the research pass, so
	 * with no pass the summary is not-assessed and the section renders nothing.
	 *
	 * The verse-scope note is deliberately absent: verse-1-only (Kimi Q5) was
	 * superseded by Dann's all-verse ruling (2026-07-16), so "analysis uses verse 1"
	 * is not copy we ship. The model still carries the verse fields as honest metadata.
	 *
	 * onNavigate is a hook: following a measure link is the caller's job (switch to the
	 * Transcription tab, scroll, highlight). The shell does not wire it.
	 */
	import { t, type Language } from '$lib/i18n';
	import type { Divergence, Reconciliation } from './reconciliation/types';
	import { witnessesModel } from './reconciliation/witnesses';

	interface Props {
		/** The reconciliation pass, or undefined when none has run (not assessed). */
		reconciliation?: Reconciliation;
		language: Language;
		/** Invoked when the singer follows a measure link. Wiring is the caller's job. */
		onNavigate?: (divergence: Divergence) => void;
		/** Section collapse state, collapsed by default (Kimi Q1). Bindable for parent control. */
		collapsed?: boolean;
	}

	let { reconciliation, language, onNavigate, collapsed = $bindable(true) }: Props = $props();

	const model = $derived(witnessesModel(reconciliation));

	const divergeLine = $derived.by(() => {
		const s = model.summary;
		if (s.kind !== 'diverge') return '';
		const word = t(s.count === 1 ? 'fit.witness.placeOne' : 'fit.witness.placeMany', language);
		return `${t('fit.witness.divergePrefix', language)} ${s.count} ${word}`;
	});
</script>

{#if model.summary.kind === 'agree'}
	<section class="witnesses" aria-label={t('fit.witness.heading', language)}>
		<div class="witnesses-header static">
			<span class="witnesses-title">{t('fit.witness.heading', language)}</span>
			<span class="witnesses-summary">{t('fit.witness.agree', language)}</span>
		</div>
	</section>
{:else if model.summary.kind === 'diverge'}
	<section class="witnesses" aria-label={t('fit.witness.heading', language)}>
		<button
			type="button"
			class="witnesses-header"
			aria-expanded={!collapsed}
			onclick={() => (collapsed = !collapsed)}
		>
			<svg
				class="chevron"
				class:expanded={!collapsed}
				width="10"
				height="10"
				viewBox="0 0 10 10"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<polyline points="3,1.5 7,5 3,8.5" />
			</svg>
			<span class="witnesses-title">{t('fit.witness.heading', language)}</span>
			<span class="witnesses-summary">{divergeLine}</span>
		</button>

		{#if !collapsed}
			<ul class="witnesses-list">
				{#each model.rows as row (row.id)}
					<li class="witnesses-row">
						<button type="button" class="measure-link" onclick={() => onNavigate?.(row)}>
							{t('fit.witness.measureAbbr', language)}&nbsp;{row.location.measure}
						</button>
						<span class="readings">
							{#if row.scoreReads}
								<span class="reading">
									<span class="reading-label">{t('fit.witness.scoreLabel', language)}</span>
									<span class="reading-text">&#171;{row.scoreReads}&#187;</span>
								</span>
							{/if}
							{#if row.ilyaReads}
								<span class="reading">
									<span class="reading-label">{t('fit.witness.poemLabel', language)}</span>
									<span class="reading-text">&#171;{row.ilyaReads}&#187;</span>
								</span>
							{/if}
						</span>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
{/if}

<style>
	.witnesses {
		font-family: var(--font-sans);
		font-size: 12px;
		color: var(--ink-secondary);
	}

	.witnesses-header {
		display: flex;
		align-items: baseline;
		gap: 8px;
		width: 100%;
		padding: 6px 0;
		background: none;
		border: none;
		text-align: left;
		color: inherit;
		font: inherit;
		cursor: pointer;
	}

	.witnesses-header.static {
		cursor: default;
	}

	.witnesses-title {
		font-variant-caps: small-caps;
		letter-spacing: 0.04em;
		color: var(--ink-primary);
	}

	.witnesses-summary {
		color: var(--ink-secondary);
	}

	.chevron {
		flex-shrink: 0;
		align-self: center;
		transition: transform 0.15s ease;
	}

	.chevron.expanded {
		transform: rotate(90deg);
	}

	.witnesses-list {
		list-style: none;
		margin: 0;
		padding: 0 0 4px 18px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.witnesses-row {
		display: flex;
		align-items: baseline;
		gap: 8px;
	}

	.measure-link {
		flex-shrink: 0;
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		color: var(--fit-accent, #8e7e9b);
		cursor: pointer;
		white-space: nowrap;
	}

	.measure-link:hover {
		text-decoration: underline;
	}

	.readings {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 12px;
	}

	.reading-label {
		font-variant-caps: small-caps;
		letter-spacing: 0.04em;
		margin-right: 3px;
	}
</style>
