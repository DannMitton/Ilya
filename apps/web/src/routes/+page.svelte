<script lang="ts">
	import { onMount } from 'svelte';
	import { transcribeWord } from '@ilya/phonology';
	import type { NotationPreferences } from '@ilya/phonology';
	import { loadDictionary, type LoaderState } from '$lib/loader';
	import { processText } from '$lib/pipeline';
	import type { LineData, WordStackData } from '$lib/types';
	import Drawer from '$lib/components/Drawer/Drawer.svelte';
	import RootPanel from '$lib/components/Drawer/RootPanel.svelte';
	import InspectorPanel from '$lib/components/Drawer/InspectorPanel.svelte';
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
	let lastFocusedWord = $state<{ line: number; word: number } | null>(null);

	// Notation preferences -- persisted to localStorage
	let notationPrefs = $state<NotationPreferences>({
		reducedVowel: false,
		shcha: false,
		palatalNasal: false,
		geminate: false,
		reconstitution: false,
	});

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
		lastFocusedWord = null;
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
		lastFocusedWord = { line: word.lineIndex, word: word.wordIndex };
		console.log('[Ilya] Selected:', word.cleanWord, word.ipaDisplay, {
			stress: word.stressIndex,
			source: word.stressSource,
			gloss: word.gloss,
			displayLog: word.displayLog,
		});
	}

	function handleInspectorBack() {
		drawerMode = 'root';
		if (lastFocusedWord) {
			requestAnimationFrame(() => {
				const el = document.querySelector<HTMLElement>(
					`[data-word-index="${lastFocusedWord!.line}-${lastFocusedWord!.word}"]`
				);
				el?.focus();
			});
		}
	}

	function handleNotationChange(prefs: NotationPreferences) {
		notationPrefs = prefs;
		try {
			localStorage.setItem('ilya:notationPrefs', JSON.stringify(prefs));
		} catch {
			// localStorage unavailable (private browsing)
		}
	}

	// Persist input text to localStorage
	function handleInput(text: string) {
		inputText = text;
		try {
			localStorage.setItem('ilya:inputText', text);
		} catch {
			// localStorage unavailable
		}
	}

	onMount(() => {
		// Restore persisted state
		try {
			const savedPrefs = localStorage.getItem('ilya:notationPrefs');
			if (savedPrefs) {
				const parsed = JSON.parse(savedPrefs);
				notationPrefs = { ...notationPrefs, ...parsed };
			}
			const savedText = localStorage.getItem('ilya:inputText');
			if (savedText) {
				inputText = savedText;
			}
		} catch {
			// localStorage unavailable
		}

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
			{notationPrefs}
			oninput={handleInput}
			ontranscribe={handleTranscribe}
			onnotationchange={handleNotationChange}
		/>
	{/snippet}
	{#snippet inspectorPanel()}
		{#if selectedWord}
			<InspectorPanel
				word={selectedWord}
				onback={handleInspectorBack}
			/>
		{/if}
	{/snippet}
</Drawer>

<main class="main-content">
	<Paper {lines} {notationPrefs} onwordclick={handleWordClick} />
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
</style>
