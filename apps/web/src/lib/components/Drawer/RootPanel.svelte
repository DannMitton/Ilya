<script lang="ts">
	import type { LoaderState } from '$lib/loader';
	import type { NotationPreferences } from '@ilya/phonology';
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
		language: Language;
		oninput: (text: string) => void;
		ontranscribe: () => void;
		onnotationchange: (prefs: NotationPreferences) => void;
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
		language,
		oninput,
		ontranscribe,
		onnotationchange,
	}: Props = $props();

	const INPUT_WARN_THRESHOLD = 5000;
	const inputLength = $derived(inputText.length);
	const inputWarning = $derived(inputLength > INPUT_WARN_THRESHOLD);

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
			e.preventDefault();
			ontranscribe();
		}
	}

	function togglePref(key: keyof NotationPreferences) {
		const newValue = !notationPrefs[key];
		const updated = { ...notationPrefs, [key]: newValue };

		// Geminates governs Shcha: toggling Geminates cascades to Shcha
		if (key === 'geminate') {
			updated.shcha = newValue;
		}

		onnotationchange(updated);
	}

	const toggleKeys: { key: keyof NotationPreferences; labelKey: string; descKey: string }[] = [
		{ key: 'reducedVowel', labelKey: 'notation.reducedVowel', descKey: 'notation.reducedVowel.desc' },
		{ key: 'palatalNasal', labelKey: 'notation.palatalNasal', descKey: 'notation.palatalNasal.desc' },
		{ key: 'geminate',     labelKey: 'notation.geminates',    descKey: 'notation.geminates.desc' },
		{ key: 'shcha',        labelKey: 'notation.shcha',        descKey: 'notation.shcha.desc' },
		{ key: 'reconstitution', labelKey: 'notation.reconstitution', descKey: 'notation.reconstitution.desc' },
	];
</script>

<div class="root-panel">
	<div class="header">
		<h1>Ilya</h1>
		<p class="subtitle">{t('app.subtitle', language)}</p>
	</div>

	<div class="status-bar">
		{#if loaderState.isLoading}
			<span class="loading">{t('dict.loading', language)}</span>
		{:else if loaderState.error}
			<span class="status-err">✗ {loaderState.error}</span>
		{:else if loaderState.entryCount > 0}
			<span class="status-ok">
				✓ {loaderState.entryCount.toLocaleString()} {t('dict.words', language)}
				{#if loaderState.tier2Loaded}
					+ {loaderState.tier2Count.toLocaleString()} {t('dict.inflections', language)}
				{/if}
			</span>
		{/if}
	</div>

	<div class="input-area">
		<textarea
			value={inputText}
			oninput={(e) => oninput(e.currentTarget.value)}
			onkeydown={handleKeydown}
			placeholder={t('input.placeholder', language)}
			rows="6"
		></textarea>
		{#if inputWarning}
			<p class="input-warning">
				⚠ {inputLength.toLocaleString()} {t('input.warning', language)}
			</p>
		{/if}
		<button
			onclick={ontranscribe}
			disabled={!canTranscribe}
			class="transcribe-btn"
		>
			{loaderState.isLoading ? t('input.transcribeLoading', language) : t('input.transcribe', language)}
		</button>
	</div>

	{#if transcribeError}
		<p class="status-err">{transcribeError}</p>
	{/if}

	{#if hasResults}
		<p class="result-meta">
			{wordCount} {t('result.words', language)} {transcribeMs}ms
		</p>
	{/if}

	<!-- Notation preferences -->
	<div class="notation-section">
		<h2 class="section-label">{t('notation.heading', language)}</h2>
		<div class="toggle-list">
			{#each toggleKeys as toggle}
				<label class="toggle-row" class:subordinate={toggle.key === 'shcha'}>
					<div class="toggle-text">
						<span class="toggle-label">{t(toggle.labelKey, language)}</span>
						<span class="toggle-desc">{t(toggle.descKey, language)}</span>
					</div>
					<button
						class="toggle-switch"
						class:active={notationPrefs[toggle.key]}
						role="switch"
						aria-checked={notationPrefs[toggle.key]}
						onclick={() => togglePref(toggle.key)}
					>
						<span class="toggle-thumb"></span>
					</button>
				</label>
			{/each}
		</div>
	</div>
</div>

<style>
	.root-panel {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.5rem;
		height: 100%;
		overflow-y: auto;
	}

	.header {
		text-align: center;
	}

	h1 {
		font-family: var(--font-serif);
		font-size: 2rem;
		font-weight: 400;
		letter-spacing: 0.05em;
		color: var(--ink-primary);
		margin-bottom: 0.15rem;
	}

	.subtitle {
		font-family: var(--font-serif);
		font-style: italic;
		color: var(--ink-tertiary);
		font-size: 0.9rem;
	}

	.status-bar {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
		flex-wrap: wrap;
		font-size: 0.8rem;
	}

	.status-ok {
		color: var(--sage);
		font-weight: 600;
	}

	.status-err {
		color: #c53030;
		font-weight: 500;
	}

	.loading {
		color: var(--ink-tertiary);
		font-style: italic;
	}

	.input-area {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--stone-300);
		border-radius: 6px;
		font-family: var(--font-serif);
		font-size: 0.95rem;
		resize: vertical;
		line-height: 1.5;
		min-height: 8rem;
		color: var(--ink-primary);
		background: white;
	}

	textarea::placeholder {
		color: var(--ink-tertiary);
	}

	textarea:focus {
		outline: none;
		border-color: var(--sage);
		box-shadow: 0 0 0 2px rgba(139, 154, 125, 0.25);
	}

	.input-warning {
		font-size: 0.8rem;
		color: #b45309;
		margin: -0.25rem 0;
	}

	.transcribe-btn {
		padding: 0.6rem 1.5rem;
		background: var(--ink-primary);
		color: white;
		border: none;
		border-radius: 6px;
		font-family: var(--font-sans);
		font-size: 0.95rem;
		cursor: pointer;
		transition: background 0.15s;
	}

	.transcribe-btn:hover:not(:disabled) {
		background: var(--ink-secondary);
	}

	.transcribe-btn:disabled {
		background: var(--stone-500);
		cursor: not-allowed;
	}

	.result-meta {
		font-size: 0.8rem;
		color: var(--ink-tertiary);
		text-align: center;
	}

	/* ── Notation toggles ────────────────────────────────── */

	.notation-section {
		margin-top: 0.5rem;
		padding-top: 1rem;
		border-top: 1px solid var(--stone-300);
	}

	.section-label {
		font-family: var(--font-sans);
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--sage);
		margin-bottom: 0.75rem;
	}

	.toggle-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.toggle-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		cursor: pointer;
	}

	.toggle-row.subordinate {
		padding-left: 1rem;
	}

	.toggle-text {
		display: flex;
		flex-direction: column;
	}

	.toggle-label {
		font-family: var(--font-sans);
		font-size: 0.85rem;
		color: var(--ink-primary);
	}

	.toggle-desc {
		font-size: 0.7rem;
		color: var(--ink-tertiary);
		font-family: var(--font-sans);
	}

	.toggle-switch {
		position: relative;
		width: 36px;
		height: 20px;
		background: var(--stone-300);
		border: none;
		border-radius: 10px;
		cursor: pointer;
		transition: background 0.2s;
		flex-shrink: 0;
		padding: 0;
	}

	.toggle-switch.active {
		background: var(--sage);
	}

	.toggle-thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 16px;
		height: 16px;
		background: white;
		border-radius: 50%;
		transition: transform 0.2s;
	}

	.toggle-switch.active .toggle-thumb {
		transform: translateX(16px);
	}
</style>
