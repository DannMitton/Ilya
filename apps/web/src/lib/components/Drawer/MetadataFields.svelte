<!--
	MetadataFields — the shared song-metadata block (title, opus, composer,
	poet, translator, reset). Extracted from RootPanel so the Transcription
	drawer and the Fit drawer render the same chrome, bound to one source of
	truth (handover v35 §E.5b; Kimi's placement ruling, questions 1 and 3).
	Both tabs pass the same `metadata` state and `onchange`, so edits in either
	tab converge on the same record.
-->
<script lang="ts">
	import { t, type Language } from '$lib/i18n';
	import { COMPOSERS, POETS, type PersonEntry } from '$lib/composers-poets';
	import type { SongMetadata } from '$lib/types';
	import SearchableSelect from './SearchableSelect.svelte';

	interface Props {
		metadata: SongMetadata;
		language: Language;
		onchange: (meta: SongMetadata) => void;
		/**
		 * Fields auto-populated from a score header (§A.6; Kimi's Q1
		 * ruling, 2026-07-13): each carries a subtle "from score" tag
		 * that the caller removes on first edit. Optional; the
		 * Transcription drawer never passes it.
		 */
		fromScore?: ReadonlySet<string>;
		/**
		 * "Revert to score header" affordance (Kimi's Q2 ruling): shown
		 * only when a score header exists to revert to.
		 */
		onrevert?: () => void;
	}

	let { metadata, language, onchange, fromScore = undefined, onrevert = undefined }: Props = $props();

	function handleMetaField(field: keyof SongMetadata, value: string) {
		onchange({ ...metadata, [field]: value });
	}

	function handleComposerSelect(value: string, _entry: PersonEntry | null) {
		handleMetaField('composer', value);
	}

	function handlePoetSelect(value: string, _entry: PersonEntry | null) {
		handleMetaField('poet', value);
	}

	function handleTranslatorSelect(value: string, _entry: PersonEntry | null) {
		handleMetaField('translator', value);
	}

	const hasMetadata = $derived(
		metadata.title !== '' || metadata.opus !== '' ||
		metadata.composer !== '' || metadata.poet !== '' || metadata.translator !== ''
	);

	function resetMetadata() {
		onchange({ ...metadata, title: '', opus: '', composer: '', poet: '', translator: '' });
	}
</script>

<div class="section">
	<h3 class="section-label">{t('meta.heading', language)}</h3>
	<div class="meta-fields">
		<div class="meta-field-wrap">
			<input
				type="text"
				class="meta-input"
				placeholder={t('meta.title', language)}
				value={metadata.title}
				oninput={(e) => handleMetaField('title', (e.target as HTMLInputElement).value)}
			/>
			{#if fromScore?.has('title')}<span class="meta-from-score">{t('meta.fromScore', language)}</span>{/if}
		</div>

		<div class="meta-field-wrap">
			<input
				type="text"
				class="meta-input"
				placeholder={t('meta.opus', language)}
				value={metadata.opus}
				oninput={(e) => handleMetaField('opus', (e.target as HTMLInputElement).value)}
			/>
			{#if fromScore?.has('opus')}<span class="meta-from-score">{t('meta.fromScore', language)}</span>{/if}
		</div>

		<!-- Composer: searchable dropdown -->
		<div class="meta-field-wrap">
			<SearchableSelect
				entries={COMPOSERS}
				value={metadata.composer}
				placeholder={t('meta.composer', language)}
				{language}
				onchange={handleComposerSelect}
			/>
			{#if fromScore?.has('composer')}<span class="meta-from-score meta-from-score-select">{t('meta.fromScore', language)}</span>{/if}
		</div>

		<!-- Poet: searchable dropdown -->
		<div class="meta-field-wrap">
			<SearchableSelect
				entries={POETS}
				value={metadata.poet}
				placeholder={t('meta.poet', language)}
				{language}
				onchange={handlePoetSelect}
			/>
			{#if fromScore?.has('poet')}<span class="meta-from-score meta-from-score-select">{t('meta.fromScore', language)}</span>{/if}
		</div>

		<!-- Translator: searchable dropdown (shares poet data source) -->
		<div class="meta-field-wrap">
			<SearchableSelect
				entries={POETS}
				value={metadata.translator}
				placeholder={t('meta.translator', language)}
				{language}
				onchange={handleTranslatorSelect}
			/>
			{#if fromScore?.has('translator')}<span class="meta-from-score meta-from-score-select">{t('meta.fromScore', language)}</span>{/if}
		</div>
	</div>
	<div class="meta-reset-row">
		{#if onrevert}
			<button class="btn-reset" onclick={onrevert}>
				{t('meta.revertToScore', language)}
			</button>
		{/if}
		<button
			class="btn-reset"
			disabled={!hasMetadata}
			onclick={resetMetadata}
		>
			{t('meta.reset', language)}
		</button>
	</div>
</div>

<style>
	.section {
		margin-top: 0;
	}

	.section-label {
		font-family: var(--font-sans);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--sage);
		margin-bottom: 0.4rem;
		font-weight: 600;
	}

	.meta-fields {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.meta-field-wrap {
		position: relative;
	}

	/* The §A.6 provenance tag: subtle, non-blocking, removed by the
	   caller on the field's first edit (Kimi's Q1 refinement). */
	.meta-from-score {
		position: absolute;
		right: 8px;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
		font-family: var(--font-sans);
		font-size: 0.62rem;
		font-style: italic;
		color: var(--ink-tertiary);
	}

	.meta-from-score-select {
		right: 28px; /* clear of the dropdown chevron */
	}

	.meta-input {
		width: 100%;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		color: var(--ink-primary);
		background: white;
		border: 1px solid var(--stone-300);
		border-radius: 3px;
		padding: 0.2rem 0.4rem;
		box-sizing: border-box;
	}

	.meta-input::placeholder {
		color: var(--ink-tertiary);
	}

	.meta-reset-row {
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
