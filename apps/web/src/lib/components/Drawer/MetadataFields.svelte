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
	}

	let { metadata, language, onchange }: Props = $props();

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
		<input
			type="text"
			class="meta-input"
			placeholder={t('meta.title', language)}
			value={metadata.title}
			oninput={(e) => handleMetaField('title', (e.target as HTMLInputElement).value)}
		/>

		<input
			type="text"
			class="meta-input"
			placeholder={t('meta.opus', language)}
			value={metadata.opus}
			oninput={(e) => handleMetaField('opus', (e.target as HTMLInputElement).value)}
		/>

		<!-- Composer: searchable dropdown -->
		<SearchableSelect
			entries={COMPOSERS}
			value={metadata.composer}
			placeholder={t('meta.composer', language)}
			{language}
			onchange={handleComposerSelect}
		/>

		<!-- Poet: searchable dropdown -->
		<SearchableSelect
			entries={POETS}
			value={metadata.poet}
			placeholder={t('meta.poet', language)}
			{language}
			onchange={handlePoetSelect}
		/>

		<!-- Translator: searchable dropdown (shares poet data source) -->
		<SearchableSelect
			entries={POETS}
			value={metadata.translator}
			placeholder={t('meta.translator', language)}
			{language}
			onchange={handleTranslatorSelect}
		/>
	</div>
	<div class="meta-reset-row">
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
