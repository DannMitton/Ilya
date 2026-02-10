<script lang="ts">
	import { onMount } from 'svelte';
	import { transcribeWord } from '@ilya/phonology';
	import { loadDictionary, type LoaderState } from '$lib/loader';
	import { processText } from '$lib/pipeline';
	import type { LineData, WordStackData } from '$lib/types';
	import Paper from '$lib/components/Paper/Paper.svelte';

	// Engine connectivity check
	const engineReady = typeof transcribeWord === 'function';

	// Dictionary loading state
	let loaderState = $state<LoaderState>({
		isLoading: false,
		error: null,
		entryCount: 0,
		durationMs: 0,
		tier2Loaded: false,
		tier2Count: 0
	});

	// Pipeline state
	let inputText = $state('');
	let lines = $state<LineData[]>([]);
	let transcribeError = $state('');
	let transcribeMs = $state(0);
	let selectedWord = $state<WordStackData | null>(null);

	// Derived
	const canTranscribe = $derived(
		inputText.trim().length > 0 && !loaderState.isLoading
	);
	const hasResults = $derived(lines.length > 0);

	function handleTranscribe() {
		if (!canTranscribe) return;
		transcribeError = '';
		selectedWord = null;
		try {
			const start = performance.now();
			const result = processText(inputText);
			transcribeMs = Math.round(performance.now() - start);
			lines = result;

			// Console output for verification
			console.group('[Ilya] Transcription result');
			result.forEach((line, li) => {
				console.group(`Line ${li}`);
				line.words.forEach((w) => {
					console.log(
						`${w.cleanWord} → ${w.ipaDisplay}`,
						{
							stress: w.stressIndex,
							source: w.stressSource,
							boundary: w.rightBoundary,
							proclitic: w.isProclitic,
							enclitic: w.isEnclitic,
							gloss: w.gloss,
						}
					);
				});
				console.groupEnd();
			});
			console.groupEnd();

			// Focus first WordStack after render
			requestAnimationFrame(() => {
				const first = document.querySelector<HTMLElement>('[data-word-index="0-0"]');
				first?.focus();
			});
		} catch (e: unknown) {
			transcribeError = e instanceof Error ? e.message : String(e);
			console.error('[Ilya] Transcription error:', e);
		}
	}

	function handleWordClick(word: WordStackData) {
		selectedWord = word;
		console.log('[Ilya] Selected:', word.cleanWord, word.ipaDisplay, {
			stress: word.stressIndex,
			source: word.stressSource,
			gloss: word.gloss,
			displayLog: word.displayLog,
		});
	}

	onMount(() => {
		loadDictionary({
			onStateChange(state) {
				loaderState = state;
			}
		});
	});
</script>

<main class="main-content">
	<!-- Dev UI: moves into Drawer at Task 6 -->
	<div class="dev-controls">
		<h1>Ilya</h1>
		<p class="subtitle">Russian Lyric Diction</p>

		<div class="status-bar">
			{#if engineReady}
				<span class="status-ok">✓ Engine</span>
			{:else}
				<span class="status-err">✗ Engine</span>
			{/if}

			{#if loaderState.isLoading}
				<span class="loading">Loading dictionary…</span>
			{:else if loaderState.error}
				<span class="status-err">✗ Dictionary: {loaderState.error}</span>
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
				bind:value={inputText}
				placeholder="Paste Russian text here…"
				rows="4"
			></textarea>
			<button
				onclick={handleTranscribe}
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
				{lines.reduce((sum, l) => sum + l.words.length, 0)} words in {transcribeMs}ms
			</p>
		{/if}

		<!-- Temporary selected word display (moves to Inspector at Task 7) -->
		{#if selectedWord}
			<div class="selected-preview">
				<strong>{selectedWord.cleanWord}</strong> → {selectedWord.ipaDisplay}
				<span class="selected-detail">
					stress: {selectedWord.stressIndex} ({selectedWord.stressSource}) · {selectedWord.gloss}
				</span>
			</div>
		{/if}
	</div>

	<!-- Paper: the transcription surface -->
	<Paper {lines} onwordclick={handleWordClick} />

	<p class="version">Phase 2 — Task 5: VerseLine + WordStack</p>
</main>

<style>
	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
		overflow-y: auto;
		gap: 1.5rem;
	}

	/* ── Dev controls (temporary until Drawer) ────────────────── */

	.dev-controls {
		text-align: center;
		max-width: 680px;
		width: 100%;
	}

	h1 {
		font-family: var(--font-body);
		font-size: 3rem;
		font-weight: 400;
		letter-spacing: 0.05em;
		margin-bottom: 0.25rem;
	}

	.subtitle {
		font-family: var(--font-body);
		font-style: italic;
		color: var(--color-text-muted);
		margin-bottom: 1.5rem;
	}

	.status-bar {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
		margin-bottom: 1.5rem;
		font-size: 0.85rem;
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
		margin-bottom: 1rem;
	}

	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-family: var(--font-body);
		font-size: 1rem;
		resize: vertical;
		line-height: 1.5;
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

	.selected-preview {
		margin-top: 0.75rem;
		padding: 0.75rem 1rem;
		background: #f3f4f6;
		border-radius: 6px;
		font-size: 0.9rem;
		text-align: left;
	}

	.selected-detail {
		display: block;
		font-size: 0.8rem;
		color: var(--color-text-muted);
		margin-top: 0.25rem;
	}

	.version {
		font-size: 0.85rem;
		color: var(--color-text-muted);
	}
</style>
