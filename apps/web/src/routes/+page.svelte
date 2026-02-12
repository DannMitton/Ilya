<script lang="ts">
	import { onMount } from 'svelte';
	import { transcribeWord } from '@ilya/phonology';
	import type { NotationPreferences } from '@ilya/phonology';
	import { loadDictionary, type LoaderState } from '$lib/loader';
	import { processText } from '$lib/pipeline';
	import type { LineData, WordStackData, SongMetadata, PageSize } from '$lib/types';
	import type { Language } from '$lib/i18n';
	import HeaderBar from '$lib/components/HeaderBar.svelte';
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

	// Language
	let language = $state<Language>('en');

	// Pipeline state
	let inputText = $state('');
	let lines = $state<LineData[]>([]);
	let transcribeError = $state('');
	let transcribeMs = $state(0);
	let selectedWord = $state<WordStackData | null>(null);
	let drawerMode = $state<'root' | 'inspector'>('root');
	let lastFocusedWord = $state<{ line: number; word: number } | null>(null);

	// Drawer state
	let drawerCollapsed = $state(false);

	// Page settings
	let pageSize = $state<PageSize>('letter');

	// Song metadata
	let metadata = $state<SongMetadata>({
		title: '',
		composer: '',
		poet: '',
		opus: '',
		transcriber: '',
	});

	// Notation preferences -- persisted to localStorage
	let notationPrefs = $state<NotationPreferences>({
		reducedVowel: false,
		shcha: false,
		palatalNasal: false,
		geminate: false,
		reconstitution: false,
	});

	// Display preferences
	let showStressDiacritics = $state(false);

	// Derived
	const canTranscribe = $derived(
		inputText.trim().length > 0 && !loaderState.isLoading
	);
	const hasResults = $derived(lines.length > 0);
	const wordCount = $derived(
		lines.reduce((sum, l) => sum + l.words.length, 0)
	);

	function runPipeline() {
		transcribeError = '';
		try {
			const start = performance.now();
			const result = processText(inputText, { language });
			transcribeMs = Math.round(performance.now() - start);
			lines = result;
		} catch (e: unknown) {
			transcribeError = e instanceof Error ? e.message : String(e);
			console.error('[Ilya] Transcription error:', e);
		}
	}

	function handleTranscribe() {
		if (!canTranscribe) return;
		transcribeError = '';
		selectedWord = null;
		drawerMode = 'root';
		lastFocusedWord = null;

		runPipeline();

		if (lines.length > 0) {
			// Console output for verification
			console.group('[Ilya] Transcription result');
			lines.forEach((line, li) => {
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
		}
	}

	function handleClear() {
		inputText = '';
		lines = [];
		transcribeError = '';
		transcribeMs = 0;
		selectedWord = null;
		drawerMode = 'root';
		lastFocusedWord = null;
		try {
			localStorage.setItem('ilya:inputText', '');
		} catch {
			// localStorage unavailable
		}
	}

	function handlePrint() {
		window.print();
	}

	function handleWordClick(word: WordStackData) {
		selectedWord = word;
		drawerMode = 'inspector';
		lastFocusedWord = { line: word.lineIndex, word: word.wordIndex };
		// Auto-expand drawer if collapsed when user clicks a word
		if (drawerCollapsed) {
			drawerCollapsed = false;
		}
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

	function handleStressDiacriticsChange(value: boolean) {
		showStressDiacritics = value;
		try {
			localStorage.setItem('ilya:showStressDiacritics', JSON.stringify(value));
		} catch {
			// localStorage unavailable
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

	function handleLanguageChange(lang: Language) {
		language = lang;
		try {
			localStorage.setItem('ilya:language', lang);
		} catch {
			// localStorage unavailable
		}
		// Re-run pipeline to update glosses in the new language
		if (hasResults && inputText.trim().length > 0) {
			runPipeline();
		}
	}

	function handleMetadataChange(meta: SongMetadata) {
		metadata = meta;
		try {
			localStorage.setItem('ilya:metadata', JSON.stringify(meta));
		} catch {
			// localStorage unavailable
		}
	}

	function handlePageSizeChange(size: PageSize) {
		pageSize = size;
		try {
			localStorage.setItem('ilya:pageSize', size);
		} catch {
			// localStorage unavailable
		}
	}

	function handleDrawerToggle() {
		drawerCollapsed = !drawerCollapsed;
		try {
			localStorage.setItem('ilya:drawerCollapsed', JSON.stringify(drawerCollapsed));
		} catch {
			// localStorage unavailable
		}
	}

	onMount(() => {
		// Restore persisted state
		try {
			const savedLang = localStorage.getItem('ilya:language');
			if (savedLang === 'en' || savedLang === 'fr') {
				language = savedLang;
			}
			const savedPrefs = localStorage.getItem('ilya:notationPrefs');
			if (savedPrefs) {
				const parsed = JSON.parse(savedPrefs);
				notationPrefs = { ...notationPrefs, ...parsed };
			}
			const savedText = localStorage.getItem('ilya:inputText');
			if (savedText) {
				inputText = savedText;
			}
			const savedMeta = localStorage.getItem('ilya:metadata');
			if (savedMeta) {
				const parsed = JSON.parse(savedMeta);
				metadata = { ...metadata, ...parsed };
			}
			const savedPageSize = localStorage.getItem('ilya:pageSize');
			if (savedPageSize === 'letter' || savedPageSize === 'a4') {
				pageSize = savedPageSize;
			}
			const savedDiacritics = localStorage.getItem('ilya:showStressDiacritics');
			if (savedDiacritics) {
				showStressDiacritics = JSON.parse(savedDiacritics);
			}
			const savedCollapsed = localStorage.getItem('ilya:drawerCollapsed');
			if (savedCollapsed) {
				drawerCollapsed = JSON.parse(savedCollapsed);
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

<div class="screen-only">
	<HeaderBar {language} onlanguagechange={handleLanguageChange} />
</div>

<div class="app-content">
	<div class="screen-only">
		<Drawer
			mode={drawerMode}
			collapsed={drawerCollapsed}
			{language}
			ontogglecollapse={handleDrawerToggle}
		>
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
					{showStressDiacritics}
					{language}
					{metadata}
					{pageSize}
					oninput={handleInput}
					ontranscribe={handleTranscribe}
					onclear={handleClear}
					onprint={handlePrint}
					onnotationchange={handleNotationChange}
					onstressdiacriticschange={handleStressDiacriticsChange}
					onmetadatachange={handleMetadataChange}
					onpagesizechange={handlePageSizeChange}
				/>
			{/snippet}
			{#snippet inspectorPanel()}
				{#if selectedWord}
					<InspectorPanel
						word={selectedWord}
						{language}
						onback={handleInspectorBack}
					/>
				{/if}
			{/snippet}
		</Drawer>
	</div>

	<main class="main-content">
		<Paper {lines} {notationPrefs} {language} {metadata} {pageSize} {showStressDiacritics} onwordclick={handleWordClick} />
	</main>
</div>

<style>
	.app-content {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	.main-content {
		flex: 1;
		overflow-y: auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	/* screen-only wrappers: visible on screen, hidden in print */
	.screen-only {
		display: contents;
	}

	@media print {
		.screen-only {
			display: none !important;
		}

		.app-content {
			display: block;
			overflow: visible;
		}

		.main-content {
			padding: 0;
			overflow: visible;
		}
	}
</style>
