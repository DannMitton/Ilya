<!--
	EngravingControls — the Fit drawer's engraving-preferences panel
	(Dann's ruling, 2026-07-13: a permanent user feature, seated beside
	the narrowed drop surface; the dropzone is a drag-and-drop target,
	not a typing field, so it can cede the width).

	Three singer-facing controls: stave size, note spacing, and the gap
	between systems. Note spacing moves `minGap` with it at a fixed
	ratio (engraving.ts), so rhythmic spacing stays proportional at any
	density. Reset returns to the Appendix-derived defaults. In dev
	builds only, the raw minGap/leftMargin sliders and a numeric
	readout appear beneath, for tuning sessions.
-->
<script lang="ts">
	import { dev } from '$app/environment';
	import { t, type Language } from '$lib/i18n';
	import { ENGRAVING_DEFAULTS, minGapFor, type EngravingValues } from '$lib/shane/engraving';

	interface Props {
		values: EngravingValues;
		language: Language;
		onchange: (values: EngravingValues) => void;
	}

	let { values, language, onchange }: Props = $props();

	const isDefault = $derived(
		values.lineGap === ENGRAVING_DEFAULTS.lineGap &&
			values.pxPerWhole === ENGRAVING_DEFAULTS.pxPerWhole &&
			values.minGap === ENGRAVING_DEFAULTS.minGap &&
			values.systemGap === ENGRAVING_DEFAULTS.systemGap &&
			values.leftMargin === ENGRAVING_DEFAULTS.leftMargin,
	);

	function set<K extends keyof EngravingValues>(key: K, value: number) {
		const next = { ...values, [key]: value };
		if (key === 'pxPerWhole') next.minGap = minGapFor(value);
		onchange(next);
	}

	function numberOf(e: Event): number {
		return Number((e.target as HTMLInputElement).value);
	}
</script>

<div class="section">
	<h3 class="section-label">{t('engraving.heading', language)}</h3>
	<div class="engraving-fields">
		<label class="engraving-field">
			<span class="engraving-name"
				>{t('engraving.staveSize', language)}<span class="engraving-value">{values.lineGap}</span></span
			>
			<input
				type="range"
				min="5"
				max="16"
				step="0.5"
				value={values.lineGap}
				oninput={(e) => set('lineGap', numberOf(e))}
			/>
		</label>
		<label class="engraving-field">
			<span class="engraving-name"
				>{t('engraving.noteSpacing', language)}<span class="engraving-value">{values.pxPerWhole}</span></span
			>
			<input
				type="range"
				min="60"
				max="300"
				step="5"
				value={values.pxPerWhole}
				oninput={(e) => set('pxPerWhole', numberOf(e))}
			/>
		</label>
		<label class="engraving-field">
			<span class="engraving-name"
				>{t('engraving.systemSpacing', language)}<span class="engraving-value">{values.systemGap}</span></span
			>
			<input
				type="range"
				min="6"
				max="48"
				step="1"
				value={values.systemGap}
				oninput={(e) => set('systemGap', numberOf(e))}
			/>
		</label>

		{#if dev}
			<!-- Dev-only raw knobs for tuning sessions; not part of the
			     shipped surface. -->
			<label class="engraving-field engraving-dev">
				<span class="engraving-name">minGap (dev)<span class="engraving-value">{values.minGap}</span></span>
				<input
					type="range"
					min="10"
					max="60"
					step="1"
					value={values.minGap}
					oninput={(e) => set('minGap', numberOf(e))}
				/>
			</label>
			<label class="engraving-field engraving-dev">
				<span class="engraving-name">leftMargin (dev)<span class="engraving-value">{values.leftMargin}</span></span>
				<input
					type="range"
					min="40"
					max="100"
					step="2"
					value={values.leftMargin}
					oninput={(e) => set('leftMargin', numberOf(e))}
				/>
			</label>
			<p class="engraving-readout">
				lineGap {values.lineGap} · pxPerWhole {values.pxPerWhole} · minGap {values.minGap} · systemGap
				{values.systemGap} · leftMargin {values.leftMargin}
			</p>
		{/if}
	</div>
	<div class="engraving-reset-row">
		<button
			type="button"
			class="btn-reset"
			disabled={isDefault}
			onclick={() => onchange({ ...ENGRAVING_DEFAULTS })}
		>
			{t('engraving.reset', language)}
		</button>
	</div>
</div>

<style>
	.section {
		margin-top: 0;
		min-width: 0;
	}

	/* MetadataFields' section-label recipe, in the tab's accent colour:
	   sage on Ilya, deeper lavender here (the wizard's drawer-kinship
	   convention; Dann's ruling, 2026-07-13). */
	.section-label {
		font-family: var(--font-sans);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--deeper-lavender);
		margin-bottom: 0.4rem;
		font-weight: 600;
	}

	.engraving-fields {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.engraving-field {
		display: block;
	}

	.engraving-name {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		color: var(--ink-primary);
		margin-bottom: 0.1rem;
	}

	.engraving-value {
		font-size: 0.75rem;
		color: var(--ink-tertiary);
		font-variant-numeric: tabular-nums;
	}

	/* Fit's lavender, not the global sage (Dann's ruling, 2026-07-13):
	   the sliders belong to this tab and wear its accent. */
	.engraving-field input[type='range'] {
		width: 100%;
		accent-color: var(--deeper-lavender);
		margin: 0;
	}

	.engraving-dev .engraving-name {
		color: var(--stone-500);
		font-size: 0.72rem;
	}

	.engraving-readout {
		font-family: var(--font-sans);
		font-size: 0.68rem;
		color: var(--stone-500);
		font-variant-numeric: tabular-nums;
		user-select: all;
		margin: 0.2rem 0 0;
	}

	.engraving-reset-row {
		display: flex;
		justify-content: flex-end;
		margin-top: 0.25rem;
	}

	.btn-reset {
		padding: 0.45rem 0.5rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 500;
		border: none;
		border-radius: 4px;
		background: transparent;
		color: var(--stone-500);
		cursor: pointer;
		transition: opacity 0.12s;
	}

	.btn-reset:hover:not(:disabled) {
		opacity: 0.85;
	}

	.btn-reset:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}
</style>
