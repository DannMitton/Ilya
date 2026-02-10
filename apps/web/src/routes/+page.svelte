<script lang="ts">
	import { onMount } from 'svelte';
	import { transcribeWord } from '@ilya/phonology';
	import { loadDictionary, type LoaderState } from '$lib/loader';
	import { processText } from '$lib/pipeline';
	import type { LineData, WordStackData } from '$lib/types';
	import Drawer from '$lib/components/Drawer/Drawer.svelte';
	import RootPanel from '$lib/components/Drawer/RootPanel.svelte';
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
	let drawerMode = $state<'root' | 'inspector'>('root');

	// Derived
	const canTranscribe = $derived(
		inputText.trim().length > 0 && !loaderState.isLoading
	);
	const hasResults = $derived(lines.length > 0);
	const wordCount = $derived(
		lines.reduce((sum, l) => sum + l.words.length, 0)
	);

	function handleTranscribe() {
		if (!canTranscribe) return;
		transcribeError = '';
		selectedWord = null;
		drawerMode = 'root';
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
		drawerMode = 'inspector';
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

<Drawer mode={drawerMode}>
	{#snippet rootPanel()}
		<RootPanel
			{inputText}
			{loaderState}
			{canTranscribe}
			{hasResults}
			{wordCount}
			{transcribeMs}
			{transcribeError}
			oninput={(text) => inputText = text}
			ontranscribe={handleTranscribe}
		/>
	{/snippet}
	{#snippet inspectorPanel()}
		<div class="inspector-placeholder">
			{#if selectedWord}
				<button class="back-btn" onclick={() => drawerMode = 'root'}>
					← Back
				</button>
				<h2>{selectedWord.cleanWord}</h2>
				<p class="inspector-ipa">{selectedWord.ipaDisplay}</p>
				<p class="inspector-detail">
					Stress: {selectedWord.stressIndex} ({selectedWord.stressSource})
				</p>
				<p class="inspector-detail">{selectedWord.gloss}</p>
			{/if}
		</div>
	{/snippet}
</Drawer>

<main class="main-content">
	<Paper {lines} onwordclick={handleWordClick} />
</main>

<style>
	.main-content {
		flex: 1;
		overflow-y: auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	/* Temporary Inspector placeholder (replaced at Task 7) */
	.inspector-placeholder {
		padding: 1.5rem;
	}

	.back-btn {
		background: none;
		border: none;
		color: var(--color-accent);
		cursor: pointer;
		font-size: 0.85rem;
		padding: 0.25rem 0;
		margin-bottom: 1rem;
	}

	.back-btn:hover {
		text-decoration: underline;
	}

	.inspector-placeholder h2 {
		font-family: var(--font-body);
		font-size: 1.5rem;
		font-weight: 400;
		margin-bottom: 0.5rem;
	}

	.inspector-ipa {
		font-size: 1.2rem;
		margin-bottom: 0.75rem;
	}

	.inspector-detail {
		font-size: 0.85rem;
		color: var(--color-text-muted);
		margin-bottom: 0.35rem;
	}
</style>
