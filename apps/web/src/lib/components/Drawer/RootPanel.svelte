<script lang="ts">
	import type { LoaderState } from '$lib/loader';

	interface Props {
		inputText: string;
		loaderState: LoaderState;
		canTranscribe: boolean;
		hasResults: boolean;
		wordCount: number;
		transcribeMs: number;
		transcribeError: string;
		oninput: (text: string) => void;
		ontranscribe: () => void;
	}

	let {
		inputText,
		loaderState,
		canTranscribe,
		hasResults,
		wordCount,
		transcribeMs,
		transcribeError,
		oninput,
		ontranscribe,
	}: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
			e.preventDefault();
			ontranscribe();
		}
	}
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
</style>
