<!--
	MetadataFields — the song-metadata block (title, opus, composer, poet,
	translator, reset). Extracted from RootPanel so the Transcription drawer and
	the Fit drawer could render the same chrome, bound to one source of truth
	(handover v35 §E.5b; Kimi's placement ruling, questions 1 and 3).

	N.73 S2 merged the two drawers, so there is ONE instance again, RootPanel's,
	and it serves both of Studio's documents. The two props the Fit instance
	carried alone, `fromScore` and `onrevert`, came with it.
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
		 * that the caller removes on first edit. Optional, and still
		 * optional after N.73 S2: RootPanel passes it, and a caller
		 * with no score header behind it need not.
		 */
		fromScore?: ReadonlySet<string>;
		/**
		 * "Revert to score header" affordance (Kimi's Q2 ruling): shown
		 * only when a score header exists to revert to.
		 */
		onrevert?: () => void;
		/* N.65 ship B's `expanded` and `ontoggle` LEFT AT N.108 increment 1.
		   Piece retracted like every other header while staying pinned, on
		   Dann's ruling of 2026-08-21 ("a retracted anchor is still pinned, it
		   is just short"), and that was the header that gave the middle of the
		   drawer its height back. There is no pinned anchor and no header
		   here now: the Piece band carries the affordance, and this component
		   renders only while it is open. */
	}

	let {
		metadata,
		language,
		onchange,
		fromScore = undefined,
		onrevert = undefined,
	}: Props = $props();

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

<!-- N.108 increment 1. THIS COMPONENT DRAWS NO HEADER. Metadata is the one
     station with no row on the map: its affordance is on the Piece band, drawn
     by `Drawer.svelte`, and this is the body that affordance opens. Design's
     prototype took Metadata off the map at 1366 x 768 alone, where the opening
     state would not otherwise fit; the build brief overrides that and takes it
     off at every size, on the desk's ruling that two desktops must not show
     two maps.

     SO `expanded` AND `ontoggle` LEFT THIS FILE. The band owns both, and the
     component that is only ever rendered when it is open does not need to be
     told that it is. The four fields, the from-score tags, the reset row and
     every rule below are untouched. -->
<div class="metadata-body">
	<div class="meta-fields" id="station-metadata">
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
	/* N.108 increment 1. `.section` is gone with the header. It gave 6px above
	   a label and 6px below a body; there is no label here, and the band above
	   this body is what the old comment's "no rule above" was already
	   describing. The bottom 12px comes from the frame, on
	   `.group :global(.station-body)` in `Drawer.svelte`, and the sides come
	   from `.band-body`'s own 18px inset there. */
	.metadata-body {
		padding-bottom: 12px;
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

	/* PILL ENDS, N.108 increment 4. Ruled by Dann 2026-09-03 from the
	   calibration ritual's own two buttons (`CalibrationWizard.svelte`'s
	   `.wizard-primary` and `.wizard-secondary`, `border-radius: 999px`):
	   "The buttons shown here can form the template. Can we make other
	   buttons share its rounded ends?" Only the corners move; the fill, the
	   border, the type and the padding are untouched. */
	.btn-reset {
		padding: 0.45rem 0.5rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 500;
		border: none;
		border-radius: 999px;
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
