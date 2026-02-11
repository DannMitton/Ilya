<script lang="ts">
	import type { LoaderState } from '$lib/loader';
	import type { NotationPreferences } from '@ilya/phonology';

	interface Props {
		inputText: string;
		loaderState: LoaderState;
		canTranscribe: boolean;
		hasResults: boolean;
		wordCount: number;
		transcribeMs: number;
		transcribeError: string;
		notationPrefs: NotationPreferences;
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
		onnotationchange({
			...notationPrefs,
			[key]: !notationPrefs[key],
		});
	}

	const toggles: { key: keyof NotationPreferences; label: string; description: string }[] = [
		{ key: 'reducedVowel', label: 'Reduced vowel', description: 'ʌ → ə' },
		{ key: 'shcha', label: 'Shcha notation', description: 'ʃ²ʃ² → ʃ²ː' },
		{ key: 'palatalNasal', label: 'Palatal nasal', description: 'ɲ → nʲ' },
		{ key: 'geminate', label: 'Geminates', description: 'Show length markers' },
		{ key: 'reconstitution', label: 'Reconstitution', description: 'Show reconstitution' },
	];
</script>

<div class="root-panel">
	<div class="header">
		<h1>Ilya</h1>
		<p class="subtitle">Russian Lyric Diction</p>
	</div>

	<div class="status-bar">
		{#if loaderState.isLoading}
			<span class="loading">Loading dictionary…</span>
		{:else if loaderState.error}
			<span class="status-err">✗ {loaderState.error}</span>
		{:else if loaderState.entryCount > 0}
			<span class="status-ok">
				✓ {loaderState.entryCount.toLocaleString()} words
				{#if loaderState.tier2Loaded}
					+ {loaderState.tier2Count.toLocaleString()} inflections
				{/if}
			</span>
		{/if}
	</div>

	<div class="input-area">
		<textarea
			value={inputText}
			oninput={(e) => oninput(e.currentTarget.value)}
			onkeydown={handleKeydown}
			placeholder="Paste Russian text here…"
			rows="6"
		></textarea>
		{#if inputWarning}
			<p class="input-warning">
				⚠ {inputLength.toLocaleString()} characters. Large texts may be slow to process.
			</p>
		{/if}
		<button
			onclick={ontranscribe}
			disabled={!canTranscribe}
			class="transcribe-btn"
		>
			{loaderState.isLoading ? 'Loading dictionary…' : 'Transcribe'}
		</button>
	</div>

	{#if transcribeError}
		<p class="status-err">{transcribeError}</p>
	{/if}

	{#if hasResults}
		<p class="result-meta">
			{wordCount} words in {transcribeMs}ms
		</p>
	{/if}

	<!-- Notation preferences -->
	<div class="notation-section">
		<h2 class="section-label">Notation</h2>
		<div class="toggle-list">
			{#each toggles as toggle}
				<label class="toggle-row">
					<div class="toggle-text">
						<span class="toggle-label">{toggle.label}</span>
						<span class="toggle-desc">{toggle.description}</span>
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
		font-family: var(--font-body);
		font-size: 2rem;
		font-weight: 400;
		letter-spacing: 0.05em;
		margin-bottom: 0.15rem;
	}

	.subtitle {
		font-family: var(--font-body);
		font-style: italic;
		color: var(--color-text-muted);
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
		color: #2f855a;
		font-weight: 500;
	}

	.status-err {
		color: #c53030;
		font-weight: 500;
	}

	.loading {
		color: var(--color-text-muted);
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
		border: 1px solid var(--color-border);
		border-radius: 6px;
		font-family: var(--font-body);
		font-size: 0.95rem;
		resize: vertical;
		line-height: 1.5;
		min-height: 8rem;
	}

	textarea:focus {
		outline: none;
		border-color: #6b7280;
		box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.2);
	}

	.input-warning {
		font-size: 0.8rem;
		color: #b45309;
		margin: -0.25rem 0;
	}

	.transcribe-btn {
		padding: 0.6rem 1.5rem;
		background: #1a1a1a;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 0.95rem;
		cursor: pointer;
		transition: background 0.15s;
	}

	.transcribe-btn:hover:not(:disabled) {
		background: #333;
	}

	.transcribe-btn:disabled {
		background: #9ca3af;
		cursor: not-allowed;
	}

	.result-meta {
		font-size: 0.8rem;
		color: var(--color-text-muted);
		text-align: center;
	}

	/* ── Notation toggles ─────────────────────────────────────── */

	.notation-section {
		margin-top: 0.5rem;
		padding-top: 1rem;
		border-top: 1px solid var(--color-border);
	}

	.section-label {
		font-family: var(--font-ui);
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-muted);
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

	.toggle-text {
		display: flex;
		flex-direction: column;
	}

	.toggle-label {
		font-size: 0.85rem;
		color: var(--color-text);
	}

	.toggle-desc {
		font-size: 0.7rem;
		color: var(--color-text-muted);
		font-family: var(--font-body);
	}

	.toggle-switch {
		position: relative;
		width: 36px;
		height: 20px;
		background: #d1d5db;
		border: none;
		border-radius: 10px;
		cursor: pointer;
		transition: background 0.2s;
		flex-shrink: 0;
		padding: 0;
	}

	.toggle-switch.active {
		background: var(--color-accent);
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
