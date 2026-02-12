<script lang="ts">
	import type { NotationPreferences } from '@ilya/phonology';
	import type { LoaderState } from '$lib/loader';
	import type { SongMetadata, PageSize } from '$lib/types';
	import { t, type Language } from '$lib/i18n';

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
		language: Language;
		metadata: SongMetadata;
		pageSize: PageSize;
		oninput: (text: string) => void;
		ontranscribe: () => void;
		onclear: () => void;
		onprint: () => void;
		onnotationchange: (prefs: NotationPreferences) => void;
		onstressdiacriticschange: (value: boolean) => void;
		onmetadatachange: (meta: SongMetadata) => void;
		onpagesizechange: (size: PageSize) => void;
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
		language,
		metadata,
		pageSize,
		oninput,
		ontranscribe,
		onclear,
		onprint,
		onnotationchange,
		onstressdiacriticschange,
		onmetadatachange,
		onpagesizechange,
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

	<!-- Song Setup (metadata) -->
	<div class="section">
		<h3 class="section-label">{t('meta.heading', language)}</h3>
		<div class="meta-fields">
			<label class="meta-label">
				<span class="meta-key">{t('meta.title', language)}</span>
				<input
					type="text"
					class="meta-input"
					value={metadata.title}
					oninput={(e) => handleMetaField('title', (e.target as HTMLInputElement).value)}
				/>
			</label>
			<label class="meta-label">
				<span class="meta-key">{t('meta.composer', language)}</span>
				<input
					type="text"
					class="meta-input"
					value={metadata.composer}
					oninput={(e) => handleMetaField('composer', (e.target as HTMLInputElement).value)}
				/>
			</label>
			<label class="meta-label">
				<span class="meta-key">{t('meta.poet', language)}</span>
				<input
					type="text"
					class="meta-input"
					value={metadata.poet}
					oninput={(e) => handleMetaField('poet', (e.target as HTMLInputElement).value)}
				/>
			</label>
			<label class="meta-label">
				<span class="meta-key">{t('meta.opus', language)}</span>
				<input
					type="text"
					class="meta-input"
					value={metadata.opus}
					oninput={(e) => handleMetaField('opus', (e.target as HTMLInputElement).value)}
				/>
			</label>
			<label class="meta-label">
				<span class="meta-key">{t('meta.transcriber', language)}</span>
				<input
					type="text"
					class="meta-input"
					value={metadata.transcriber}
					oninput={(e) => handleMetaField('transcriber', (e.target as HTMLInputElement).value)}
				/>
			</label>
		</div>
	</div>

	<!-- Textarea -->
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

	<!-- Three equal-width buttons: Clear | Print | Transcribe -->
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

	<!-- Result summary (character count + timer) -->
	{#if hasResults}
		<p class="result-summary">
			{wordCount} {t('result.words', language)} {transcribeMs}ms
		</p>
	{/if}

	{#if transcribeError}
		<p class="error-text">{transcribeError}</p>
	{/if}

	<!-- Display toggle -->
	<div class="section">
		<h3 class="section-label">{t('display.heading', language)}</h3>
		<div class="cosmetic-grid">
			<span class="cosmetic-label-left">{t('display.stressDiacritics.left', language)}</span>
			<button
				class="toggle-switch"
				class:active={showStressDiacritics}
				role="switch"
				aria-checked={showStressDiacritics}
				aria-label={t('display.stressDiacritics.left', language)}
				onclick={() => onstressdiacriticschange(!showStressDiacritics)}
			>
				<span class="toggle-thumb"></span>
			</button>
			<span class="cosmetic-label-right">{t('display.stressDiacritics.right', language)}</span>
		</div>
	</div>

	<!-- Cosmetic Options (IPA display toggles) -->
	<div class="section">
		<h3 class="section-label">{t('cosmetic.heading', language)}</h3>
		<div class="cosmetic-grid">
			<!-- Reduced vowel -->
			<span class="cosmetic-label-left">{t('cosmetic.reducedVowel.left', language)}</span>
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
			<span class="cosmetic-label-right">{t('cosmetic.reducedVowel.right', language)}</span>

			<!-- Palatal nasal -->
			<span class="cosmetic-label-left">{t('cosmetic.palatalNasal.left', language)}</span>
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
			<span class="cosmetic-label-right">{t('cosmetic.palatalNasal.right', language)}</span>

			<!-- Geminates -->
			<span class="cosmetic-label-left">{t('cosmetic.geminates.left', language)}</span>
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
			<span class="cosmetic-label-right">{t('cosmetic.geminates.right', language)}</span>

			<!-- Shcha -->
			<span class="cosmetic-label-left">{t('cosmetic.shcha.left', language)}</span>
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
			<span class="cosmetic-label-right">{t('cosmetic.shcha.right', language)}</span>

			<!-- Reconstitution -->
			<span class="cosmetic-label-left">{t('cosmetic.reconstitution.left', language)}</span>
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
			<span class="cosmetic-label-right">{t('cosmetic.reconstitution.right', language)}</span>
		</div>
	</div>

	<!-- Page size -->
	<div class="section">
		<h3 class="section-label">{t('pageSize.label', language)}</h3>
		<div class="page-size-toggle">
			<button
				class="size-btn"
				class:active={pageSize === 'letter'}
				onclick={() => onpagesizechange('letter')}
			>
				{t('pageSize.letter', language)}
			</button>
			<button
				class="size-btn"
				class:active={pageSize === 'a4'}
				onclick={() => onpagesizechange('a4')}
			>
				{t('pageSize.a4', language)}
			</button>
		</div>
	</div>
</div>

<style>
	.root-panel {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
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

	/* ── Button row: Clear | Print | Transcribe ────────────── */

	.button-row {
		display: flex;
		gap: 6px;
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

	/* ── Result summary ───────────────────────────────────── */

	.result-summary {
		font-size: 0.75rem;
		color: var(--sage);
		font-family: var(--font-sans);
	}

	.error-text {
		font-size: 0.75rem;
		color: #d97706;
		font-family: var(--font-sans);
	}

	/* ── Section labels ───────────────────────────────────── */

	.section {
		margin-top: 0.5rem;
	}

	.section-label {
		font-family: var(--font-sans);
		font-size: 0.7rem;
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

	.meta-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.meta-key {
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--ink-secondary);
		min-width: 6.5rem;
		flex-shrink: 0;
	}

	.meta-input {
		flex: 1;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		color: var(--ink-primary);
		background: white;
		border: 1px solid var(--stone-300);
		border-radius: 3px;
		padding: 0.2rem 0.4rem;
	}

	.meta-input::placeholder {
		color: var(--ink-tertiary);
	}

	/* ── Cosmetic toggle grid ────────────────────────────── */
	/* Three-column grid: left label | toggle | right label   */
	/* Toggles form a vertical column; labels flank them.     */

	.cosmetic-grid {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: 0.45rem 0.6rem;
		align-items: center;
	}

	.cosmetic-label-left {
		font-family: var(--font-sans);
		font-size: 0.8rem;
		color: var(--ink-primary);
		text-align: right;
	}

	.cosmetic-label-right {
		font-family: var(--font-sans);
		font-size: 0.8rem;
		color: var(--ink-tertiary);
		text-align: left;
	}

	/* ── Page size toggle ─────────────────────────────────── */

	.page-size-toggle {
		display: flex;
		gap: 0;
		border: 1px solid var(--stone-300);
		border-radius: 4px;
		overflow: hidden;
		width: fit-content;
	}

	.size-btn {
		padding: 0.2rem 0.8rem;
		font-family: var(--font-sans);
		font-size: 0.75rem;
		border: none;
		background: white;
		color: var(--ink-secondary);
		cursor: pointer;
		transition: background 0.12s, color 0.12s;
	}

	.size-btn + .size-btn {
		border-left: 1px solid var(--stone-300);
	}

	.size-btn.active {
		background: var(--sage);
		color: white;
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
