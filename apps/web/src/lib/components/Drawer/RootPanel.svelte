<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { NotationPreferences } from '@ilya/phonology';
	import type { LoaderState } from '$lib/loader';
	import type { SongMetadata } from '$lib/types';
	import { t, type Language } from '$lib/i18n';
	import { COMPOSERS, POETS, type PersonEntry } from '$lib/composers-poets';
	import SearchableSelect from './SearchableSelect.svelte';

	interface Props {
		inputText: string;
		loaderState: LoaderState;
		canTranscribe: boolean;
		hasResults: boolean;
		wordCount: number;
		transcribeMs: number;
		transcribeError: string;
		notationPrefs: NotationPreferences;
		showStressDiacritics: boolean;
		openSyllabification: boolean;
		language: Language;
		metadata: SongMetadata;
		showInspector: boolean;
		consoleContent?: Snippet;
		oninput: (text: string) => void;
		ontranscribe: () => void;
		onclear: () => void;
		onprint: () => void;
		onnotationchange: (prefs: NotationPreferences) => void;
		onstressdiacriticschange: (value: boolean) => void;
		onopensyllabificationchange: (value: boolean) => void;
		onmetadatachange: (meta: SongMetadata) => void;
	}

	let {
		inputText,
		loaderState,
		canTranscribe,
		hasResults,
		wordCount,
		transcribeMs,
		transcribeError,
		notationPrefs,
		showStressDiacritics,
		openSyllabification,
		language,
		metadata,
		showInspector,
		consoleContent,
		oninput,
		ontranscribe,
		onclear,
		onprint,
		onnotationchange,
		onstressdiacriticschange,
		onopensyllabificationchange,
		onmetadatachange,
	}: Props = $props();

	const charCount = $derived(inputText.length);
	const showWarning = $derived(charCount > 5000);
	const dictReady = $derived(loaderState.entryCount > 0 && !loaderState.isLoading);

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
			e.preventDefault();
			ontranscribe();
		}
	}

	function handleToggle(key: keyof NotationPreferences, value: boolean) {
		const next = { ...notationPrefs, [key]: value };
		// Geminates/Shcha cascade: toggling geminates also toggles shcha
		if (key === 'geminate') {
			next.shcha = value;
		}
		onnotationchange(next);
	}

	function handleMetaField(field: keyof SongMetadata, value: string) {
		onmetadatachange({ ...metadata, [field]: value });
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
		onmetadatachange({ ...metadata, title: '', opus: '', composer: '', poet: '', translator: '' });
	}
</script>

<div class="root-panel" class:status-ok={dictReady}>
	<!-- Dictionary loading/error (hidden when ready) -->
	{#if loaderState.isLoading}
		<div class="dict-status">
			<span class="status-dot loading"></span>
			<span class="status-text">{t('dict.loading', language)}</span>
		</div>
	{:else if loaderState.error}
		<div class="dict-status">
			<span class="status-dot error"></span>
			<span class="status-text">{loaderState.error}</span>
		</div>
	{/if}

	<!-- ── 1. Song Setup (metadata) — at the top ──────────── -->
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

			<input
				type="text"
				class="meta-input"
				placeholder={t('meta.transcriber', language)}
				value={metadata.transcriber}
				oninput={(e) => handleMetaField('transcriber', (e.target as HTMLInputElement).value)}
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

	<!-- ── 2. Textarea (reduced to 6 rows: pasting, not composing) ── -->
	<textarea
		class="text-input"
		placeholder={t('input.placeholder', language)}
		value={inputText}
		oninput={(e) => oninput((e.target as HTMLTextAreaElement).value)}
		onkeydown={handleKeydown}
		rows="6"
	></textarea>

	{#if showWarning}
		<p class="char-warning">{charCount.toLocaleString()} {t('input.warning', language)}</p>
	{/if}

	<!-- ── 3. Result summary: always reserves space to prevent layout shift ── -->
	<p class="result-summary" class:result-hidden={!hasResults}>
		{#if hasResults}
			{wordCount} {t('result.words', language)} {transcribeMs}ms
		{:else}
			&nbsp;
		{/if}
	</p>

	{#if transcribeError}
		<p class="error-text">{transcribeError}</p>
	{/if}

	<!-- ── 4. Button row: Clear | Print | Transcribe ───────── -->
	<div class="button-row">
		<button
			class="action-btn btn-secondary"
			onclick={onclear}
		>
			{t('input.clear', language)}
		</button>
		<button
			class="action-btn btn-secondary"
			disabled={!hasResults}
			onclick={onprint}
		>
			{t('input.print', language)}
		</button>
		<button
			class="action-btn btn-primary"
			disabled={!canTranscribe}
			onclick={ontranscribe}
		>
			{loaderState.isLoading ? t('input.transcribeLoading', language) : t('input.transcribe', language)}
		</button>
	</div>

	<!-- ── 5. Word Console section ────────────────────────── -->
	<div class="section console-section">
		<h3 class="section-label">{t('console.placeholder', language)}</h3>
		{#if showInspector && consoleContent}
			{@render consoleContent()}
		{:else}
			<div class="console-placeholder-body">
				<p class="placeholder-hint">
					{language === 'en' ? 'Select a word on the page to analyse it here.' : 'Sélectionnez un mot sur la page pour l\u2019analyser ici.'}
				</p>
			</div>
		{/if}
	</div>

	<!-- ── 6. Cosmetic Options (unified: stress acutes + IPA toggles) ── -->
	<div class="section cosmetic-section">
		<h3 class="section-label">{t('cosmetic.heading', language)}</h3>
		<div class="cosmetic-grid">
			<!-- Stress acutes -->
			<span class="cosmetic-label-left" class:label-inactive={showStressDiacritics}>{t('cosmetic.stressAcutes.left', language)}</span>
			<button
				class="toggle-switch"
				class:active={showStressDiacritics}
				role="switch"
				aria-checked={showStressDiacritics}
				aria-label={t('cosmetic.stressAcutes.right', language)}
				onclick={() => onstressdiacriticschange(!showStressDiacritics)}
			>
				<span class="toggle-thumb"></span>
			</button>
			<span class="cosmetic-label-right" class:label-inactive={!showStressDiacritics}>{t('cosmetic.stressAcutes.right', language)}</span>

			<!-- Reduced vowel -->
			<span class="cosmetic-label-left" class:label-inactive={notationPrefs.reducedVowel}>{t('cosmetic.reducedVowel.left', language)}</span>
			<button
				class="toggle-switch"
				class:active={notationPrefs.reducedVowel}
				role="switch"
				aria-checked={notationPrefs.reducedVowel}
				aria-label={t('cosmetic.reducedVowel.left', language)}
				onclick={() => handleToggle('reducedVowel', !notationPrefs.reducedVowel)}
			>
				<span class="toggle-thumb"></span>
			</button>
			<span class="cosmetic-label-right" class:label-inactive={!notationPrefs.reducedVowel}>{t('cosmetic.reducedVowel.right', language)}</span>

			<!-- Palatal nasal -->
			<span class="cosmetic-label-left" class:label-inactive={notationPrefs.palatalNasal}>{t('cosmetic.palatalNasal.left', language)}</span>
			<button
				class="toggle-switch"
				class:active={notationPrefs.palatalNasal}
				role="switch"
				aria-checked={notationPrefs.palatalNasal}
				aria-label={t('cosmetic.palatalNasal.left', language)}
				onclick={() => handleToggle('palatalNasal', !notationPrefs.palatalNasal)}
			>
				<span class="toggle-thumb"></span>
			</button>
			<span class="cosmetic-label-right" class:label-inactive={!notationPrefs.palatalNasal}>{t('cosmetic.palatalNasal.right', language)}</span>

			<!-- Geminates -->
			<span class="cosmetic-label-left" class:label-inactive={notationPrefs.geminate}>{t('cosmetic.geminates.left', language)}</span>
			<button
				class="toggle-switch"
				class:active={notationPrefs.geminate}
				role="switch"
				aria-checked={notationPrefs.geminate}
				aria-label={t('cosmetic.geminates.left', language)}
				onclick={() => handleToggle('geminate', !notationPrefs.geminate)}
			>
				<span class="toggle-thumb"></span>
			</button>
			<span class="cosmetic-label-right" class:label-inactive={!notationPrefs.geminate}>{t('cosmetic.geminates.right', language)}</span>

			<!-- Shcha -->
			<span class="cosmetic-label-left" class:label-inactive={notationPrefs.shcha}>{t('cosmetic.shcha.left', language)}</span>
			<button
				class="toggle-switch"
				class:active={notationPrefs.shcha}
				role="switch"
				aria-checked={notationPrefs.shcha}
				aria-label={t('cosmetic.shcha.left', language)}
				onclick={() => handleToggle('shcha', !notationPrefs.shcha)}
			>
				<span class="toggle-thumb"></span>
			</button>
			<span class="cosmetic-label-right" class:label-inactive={!notationPrefs.shcha}>{t('cosmetic.shcha.right', language)}</span>

			<!-- Reconstitution -->
			<span class="cosmetic-label-left" class:label-inactive={notationPrefs.reconstitution}>{t('cosmetic.reconstitution.left', language)}</span>
			<button
				class="toggle-switch"
				class:active={notationPrefs.reconstitution}
				role="switch"
				aria-checked={notationPrefs.reconstitution}
				aria-label={t('cosmetic.reconstitution.left', language)}
				onclick={() => handleToggle('reconstitution', !notationPrefs.reconstitution)}
			>
				<span class="toggle-thumb"></span>
			</button>
			<span class="cosmetic-label-right" class:label-inactive={!notationPrefs.reconstitution}>{t('cosmetic.reconstitution.right', language)}</span>

			<!-- Open syllabification -->
			<span class="cosmetic-label-left" class:label-inactive={openSyllabification}>{t('cosmetic.openSyllabification.left', language)}</span>
			<button
				class="toggle-switch"
				class:active={openSyllabification}
				role="switch"
				aria-checked={openSyllabification}
				aria-label={t('cosmetic.openSyllabification.right', language)}
				onclick={() => onopensyllabificationchange(!openSyllabification)}
			>
				<span class="toggle-thumb"></span>
			</button>
			<span class="cosmetic-label-right" class:label-inactive={!openSyllabification}>{t('cosmetic.openSyllabification.right', language)}</span>
		</div>
	</div>
</div>

<style>
	.root-panel {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 20px 1rem 40px;
	}

	/* ── Dictionary status (loading/error only) ──────────────── */

	.dict-status {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.75rem;
	}

	.status-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.status-dot.loading { background: var(--stone-500); animation: pulse 1.5s infinite; }
	.status-dot.error { background: #d97706; }

	.status-text {
		color: var(--ink-tertiary);
		font-family: var(--font-sans);
	}

	/* ── Textarea ─────────────────────────────────────────── */

	.text-input {
		width: 100%;
		font-family: var(--font-serif);
		font-size: 0.9rem;
		color: var(--ink-primary);
		background: white;
		border: 1px solid var(--stone-300);
		border-radius: 4px;
		padding: 0.5rem 0.6rem;
		resize: vertical;
		line-height: 1.5;
		margin-top: 8px;
	}

	.text-input::placeholder {
		color: var(--ink-tertiary);
		font-style: italic;
	}

	.char-warning {
		font-size: 0.7rem;
		color: #d97706;
		font-family: var(--font-sans);
	}

	/* ── Result summary: always reserves space ────────────── */

	.result-summary {
		font-size: 0.75rem;
		color: var(--sage);
		font-family: var(--font-sans);
		margin-top: -4px;
		min-height: 1.2em;
		text-align: right;
	}

	.result-hidden {
		visibility: hidden;
	}

	.error-text {
		font-size: 0.75rem;
		color: #d97706;
		font-family: var(--font-sans);
	}

	/* ── Button row: Clear | Print | Transcribe ────────────── */

	.button-row {
		display: flex;
		gap: 6px;
		margin-top: 4px;
		margin-bottom: 6px;
	}

	.action-btn {
		flex: 1;
		padding: 0.45rem 0.5rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 600;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: opacity 0.12s;
	}

	.btn-primary {
		color: white;
		background: var(--sage);
	}

	.btn-secondary {
		color: var(--ink-secondary);
		background: white;
		border: 1px solid var(--stone-300);
	}

	.action-btn:hover:not(:disabled) {
		opacity: 0.85;
	}

	.action-btn:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	/* ── Section labels (enlarged smallcaps) ──────────────── */

	.section {
		margin-top: 0;
	}

	.section-label {
		font-family: var(--font-sans);
		font-size: 1rem;
		font-variant-caps: all-small-caps;
		letter-spacing: 1.5px;
		color: var(--sage);
		margin-bottom: 0.4rem;
		font-weight: 600;
	}

	/* ── Metadata fields ──────────────────────────────────── */

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
		width: calc((100% - 12px) / 3);
		padding: 0.45rem 0.5rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 600;
		border: 1px solid var(--stone-300);
		border-radius: 4px;
		background: white;
		color: var(--ink-secondary);
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

	/* ── Word Console section ────────────────────────────── */

	.console-section {
		border-top: 2px solid var(--sage);
		border-bottom: 2px solid var(--sage);
		padding: 6px 0 6px 0;
		margin-top: 12px;
		overflow: visible;
	}

	.cosmetic-section {
		margin-top: 0;
	}

	.console-placeholder-body {
		min-height: 365px;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 0 0.5rem;
	}

	.placeholder-hint {
		font-family: var(--font-serif);
		font-size: 0.8rem;
		font-style: italic;
		color: var(--ink-tertiary);
	}

	/* ── Cosmetic toggle grid ────────────────────────────── */
	/* Three-column grid: left label | toggle | right label   */

	.cosmetic-grid {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: 0.45rem 0.6rem;
		align-items: center;
	}

	.cosmetic-label-left,
	.cosmetic-label-right {
		font-family: var(--font-sans);
		font-size: 0.8rem;
		color: var(--ink-primary);
		transition: color 0.15s ease;
	}

	.cosmetic-label-left {
		text-align: right;
	}

	.cosmetic-label-right {
		text-align: left;
	}

	.cosmetic-label-left.label-inactive,
	.cosmetic-label-right.label-inactive {
		color: var(--ink-tertiary);
	}

	/* ── Toggle switches ──────────────────────────────────── */

	.toggle-switch {
		position: relative;
		width: 32px;
		height: 18px;
		border-radius: 9px;
		border: none;
		background: var(--stone-300);
		cursor: pointer;
		padding: 0;
		flex-shrink: 0;
		transition: background 0.15s ease;
	}

	.toggle-switch.active {
		background: var(--sage);
	}

	.toggle-thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: white;
		transition: transform 0.15s ease;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
	}

	.toggle-switch.active .toggle-thumb {
		transform: translateX(14px);
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.4; }
	}
</style>
