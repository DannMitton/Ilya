<script lang="ts">
	import { onMount } from 'svelte';
	import { transcribeWord } from '@ilya/phonology';
	import { loadDictionary, type LoaderState } from '$lib/loader';
	import { processText } from '$lib/pipeline';
	import type { LineData, WordStackData } from '$lib/types';

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

	// Derived
	const canTranscribe = $derived(
		inputText.trim().length > 0 && !loaderState.isLoading
	);
	const hasResults = $derived(lines.length > 0);

	function handleTranscribe() {
		if (!canTranscribe) return;
		transcribeError = '';
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
		} catch (e: unknown) {
			transcribeError = e instanceof Error ? e.message : String(e);
			console.error('[Ilya] Transcription error:', e);
		}
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
	<div class="scaffold-confirmation">
		<h1>Ilya</h1>
		<p class="subtitle">Russian Lyric Diction</p>

		<!-- Engine and dictionary status -->
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

		<!-- Input -->
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

		<!-- Error -->
		{#if transcribeError}
			<p class="status-err">{transcribeError}</p>
		{/if}

		<!-- Results -->
		{#if hasResults}
			<div class="results">
				<p class="result-meta">
					{lines.reduce((sum, l) => sum + l.words.length, 0)} words in {transcribeMs}ms
				</p>

				{#each lines as line}
					<div class="verse-line">
						{#each line.words as word}
							<div
								class="word-stack"
								class:proclitic={word.isProclitic}
								class:enclitic={word.isEnclitic}
								class:inferred={word.stressSource === 'inferred'}
							>
								<span class="ipa">{word.ipaDisplay}</span>
								<span class="cyrillic">
									{word.stressedCyrillic}<span class="punct">{word.punctuation}</span>
								</span>
								<span class="gloss">{word.gloss}</span>
								<span class="source">{word.stressSource}</span>
							</div>
						{/each}
					</div>
				{/each}
			</div>
		{/if}

		<p class="version">Phase 2 — Task 3: Text processing pipeline</p>
	</div>
</main>

<style>
	.main-content {
		flex: 1;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 2rem;
		overflow-y: auto;
	}

	.scaffold-confirmation {
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

	/* Input area */
	.input-area {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
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

	/* Results */
	.results {
		text-align: left;
		background: white;
		border-radius: 8px;
		padding: 2rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		margin-bottom: 1.5rem;
	}

	.result-meta {
		font-size: 0.8rem;
		color: var(--color-text-muted);
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.verse-line {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		margin-bottom: 1.5rem;
		align-items: flex-start;
	}

	.word-stack {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.1rem;
		min-width: 2.5rem;
	}

	.word-stack.proclitic,
	.word-stack.enclitic {
		opacity: 0.6;
	}

	.word-stack.inferred {
		border-bottom: 2px dashed #e2a500;
		padding-bottom: 0.15rem;
	}

	.ipa {
		font-family: var(--font-body);
		font-size: 1.1rem;
		letter-spacing: 0.02em;
		white-space: nowrap;
	}

	.cyrillic {
		font-size: 0.85rem;
		color: #374151;
	}

	.punct {
		color: #9ca3af;
	}

	.gloss {
		font-size: 0.7rem;
		color: var(--color-text-muted);
		max-width: 8rem;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.source {
		font-size: 0.6rem;
		color: #9ca3af;
		font-style: italic;
	}

	.version {
		font-size: 0.85rem;
		color: var(--color-text-muted);
	}
</style>
