<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { transcribeWord } from '@ilya/phonology';
	import type { NotationPreferences } from '@ilya/phonology';
	import { loadDictionary, type LoaderState } from '$lib/loader';
	import { processText } from '$lib/pipeline';
	import { applyOpenSyllabificationToLines } from '$lib/syllable-utils';
	import type { LineData, WordStackData, SongMetadata, PageSize, UserStressOverride, YoToggle, SyllableOverride } from '$lib/types';
	import { t, type Language } from '$lib/i18n';
	import HeaderBar from '$lib/components/HeaderBar.svelte';
	import Drawer from '$lib/components/Drawer/Drawer.svelte';
	import RootPanel from '$lib/components/Drawer/RootPanel.svelte';
	import InspectorPanel from '$lib/components/Drawer/InspectorPanel.svelte';
	import Paper from '$lib/components/Paper/Paper.svelte';

	// Engine connectivity check
	const engineReady = typeof transcribeWord === 'function';

	// Dictionary loading state
	let loaderState = $state<LoaderState>({
		isLoading: true,
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

	// Mobile awareness
	let isMobile = $state(false);
	let mobileDismissed = $state(false);
	let mainContentEl: HTMLElement | undefined = $state(undefined);

	async function handleMobileDismiss() {
		mobileDismissed = true;
		drawerCollapsed = true;
		await tick();
		if (mainContentEl) {
			// Centre the Paper's hint text area in the viewport.
			// Horizontal: centre the content area (96px margin + 624px/2 = 408px).
			// Vertical: hint text sits roughly 400px from page top (header + padding-top 6rem).
			const contentCentreX = 408;
			const hintAreaY = 400;
			const drawerLip = 24;
			const viewportWidth = window.innerWidth - drawerLip;
			const viewportHeight = window.innerHeight;

			const scrollX = Math.max(0, contentCentreX - viewportWidth / 2);
			const scrollY = Math.max(0, hintAreaY - viewportHeight / 2);

			mainContentEl.scrollTo({
				left: scrollX,
				top: scrollY,
				behavior: 'smooth',
			});
		}
	}

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
	let openSyllabification = $state(false);

	// Spot reconstitution: ephemeral per-word overrides, keyed by "lineIndex-wordIndex"
	// Cleared on every transcribe or clear action
	let spotReconstitution = $state<Map<string, boolean>>(new Map());

	// User stress overrides: keyed by "lineIndex-wordIndex"
	// Cleared on every fresh transcription
	let userStressOverrides = $state<Map<string, UserStressOverride>>(new Map());

	// Character-level ё toggles: keyed by "lineIndex-wordIndex-charIndex"
	// Cleared on every fresh transcription
	let yoToggles = $state<Map<string, YoToggle>>(new Map());

	// Per-word syllable boundary overrides: keyed by "lineIndex-wordIndex"
	// Cleared when the global open syllabification toggle changes in either direction,
	// and on every fresh transcription or clear action.
	let syllableOverrides = $state<Map<string, SyllableOverride>>(new Map());

	// Breath animation state
	// paperBreathClass: animates Paper content only (transcription trigger)
	// viewBreathClass: animates entire app content (language toggle)
	let paperBreathClass = $state('');
	let viewBreathClass = $state('');

	function triggerPaperBreathIn() {
		paperBreathClass = 'breath-in';
		setTimeout(() => { paperBreathClass = ''; }, 300);
	}

	function triggerViewBreathCycle(callback: () => void) {
		viewBreathClass = 'breath-out';
		setTimeout(() => {
			callback();
			viewBreathClass = 'breath-in';
			setTimeout(() => { viewBreathClass = ''; }, 300);
		}, 150);
	}

	// Derived
	const canTranscribe = $derived(
		inputText.trim().length > 0 && !loaderState.isLoading && loaderState.entryCount > 0
	);
	const hasResults = $derived(lines.length > 0);
	const wordCount = $derived(
		lines.reduce((sum, l) => sum + l.words.length, 0)
	);

	// Apply open syllabification as a display-time transform (no pipeline re-run).
	// Per-word syllable overrides take precedence when present.
	const effectiveLines = $derived.by(() => {
		if (openSyllabification || syllableOverrides.size > 0) {
			return applyOpenSyllabificationToLines(lines, syllableOverrides, openSyllabification);
		}
		return lines;
	});

	function runPipeline() {
		transcribeError = '';
		try {
			const start = performance.now();
			const result = processText(inputText, {
				language,
				userStressOverrides: userStressOverrides.size > 0 ? userStressOverrides : undefined,
				yoToggles: yoToggles.size > 0 ? yoToggles : undefined,
			});
			transcribeMs = Math.round(performance.now() - start);
			lines = result;
			// Update selected word to reflect new pipeline results
			if (selectedWord) {
				const newWord = result[selectedWord.lineIndex]?.words?.[selectedWord.wordIndex];
				if (newWord) selectedWord = newWord;
			}
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
		spotReconstitution = new Map();
		userStressOverrides = new Map();
		yoToggles = new Map();
		syllableOverrides = new Map();

		runPipeline();

		if (lines.length > 0) {
			// Breath animation: content appears with breath-in
			triggerPaperBreathIn();
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
		spotReconstitution = new Map();
		userStressOverrides = new Map();
		yoToggles = new Map();
		syllableOverrides = new Map();
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

	function handleOpenSyllabificationChange(value: boolean) {
		openSyllabification = value;
		// Spec requirement: toggling global in either direction clears all per-word overrides
		syllableOverrides = new Map();
		try {
			localStorage.setItem('ilya:openSyllabification', JSON.stringify(value));
		} catch {
			// localStorage unavailable
		}
	}

	// Toggle spot reconstitution for the currently selected word
	function handleSpotReconToggle() {
		if (!selectedWord) return;
		const key = `${selectedWord.lineIndex}-${selectedWord.wordIndex}`;
		const newMap = new Map(spotReconstitution);
		if (newMap.has(key)) {
			newMap.delete(key);
		} else {
			newMap.set(key, true);
		}
		spotReconstitution = newMap;
	}

	// ── Stress assignment handler ────────────────────────────────
	function handleStressAssign(syllableIndex: number, source: string) {
		if (!selectedWord) return;
		const key = `${selectedWord.lineIndex}-${selectedWord.wordIndex}`;
		const newMap = new Map(userStressOverrides);
		newMap.set(key, {
			stressIndex: syllableIndex,
			stressSource: source as UserStressOverride['stressSource'],
		});
		userStressOverrides = newMap;
		runPipeline();
	}

	// ── Stress revert handler ────────────────────────────────────
	function handleStressRevert() {
		if (!selectedWord) return;
		const key = `${selectedWord.lineIndex}-${selectedWord.wordIndex}`;
		const newMap = new Map(userStressOverrides);
		newMap.delete(key);
		userStressOverrides = newMap;
		runPipeline();
	}

	// ── Character-level ё toggle handler ─────────────────────────
	function handleYoCharToggle(charIndex: number, source: string | null) {
		if (!selectedWord) return;
		const key = `${selectedWord.lineIndex}-${selectedWord.wordIndex}-${charIndex}`;
		const newMap = new Map(yoToggles);
		if (source === null) {
			// Revert: remove the toggle
			newMap.delete(key);
		} else {
			newMap.set(key, { source: source as YoToggle['source'] });
		}
		yoToggles = newMap;
		runPipeline();
	}

	// ── Per-word syllable override handler ────────────────────────
	function handleSyllableOverride(lineIndex: number, wordIndex: number, override: SyllableOverride) {
		const key = `${lineIndex}-${wordIndex}`;
		const newMap = new Map(syllableOverrides);
		newMap.set(key, override);
		syllableOverrides = newMap;
	}

	// ── Per-word syllable override removal ────────────────────────
	function handleSyllableOverrideClear(lineIndex: number, wordIndex: number) {
		const key = `${lineIndex}-${wordIndex}`;
		const newMap = new Map(syllableOverrides);
		newMap.delete(key);
		syllableOverrides = newMap;
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
		const doSwap = () => {
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
		};

		// If there's content visible, use breath cycle; otherwise swap immediately
		if (hasResults) {
			triggerViewBreathCycle(doSwap);
		} else {
			doSwap();
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
			const savedOpenSyll = localStorage.getItem('ilya:openSyllabification');
			if (savedOpenSyll) {
				openSyllabification = JSON.parse(savedOpenSyll);
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

		// Mobile detection
		function checkMobile() {
			isMobile = window.innerWidth < 768;
		}
		checkMobile();
		window.addEventListener('resize', checkMobile);

		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	});
</script>

{#if isMobile && !mobileDismissed}
<div class="mobile-overlay">
	<div class="mobile-card">
		<div class="mobile-logo">
			<span class="logo-bracket">[</span><span class="logo-ilya">Ilya</span><span class="logo-bracket">]</span>
		</div>
		<h1 class="mobile-heading">{t('mobile.heading', 'en')}</h1>
		<p class="mobile-body">{t('mobile.body', 'en')}</p>
		<button class="mobile-continue" onclick={handleMobileDismiss}>
			{t('mobile.continue', 'en')} / {t('mobile.continue', 'fr')}
		</button>
		<div class="mobile-divider"></div>
		<h1 class="mobile-heading">{t('mobile.heading', 'fr')}</h1>
		<p class="mobile-body">{t('mobile.body', 'fr')}</p>
	</div>
</div>
{/if}

<div class="screen-only">
	<HeaderBar {language} onlanguagechange={handleLanguageChange} />
</div>

<div class="app-content {viewBreathClass}">
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
					{openSyllabification}
					{language}
					{metadata}
					{pageSize}
					oninput={handleInput}
					ontranscribe={handleTranscribe}
					onclear={handleClear}
					onprint={handlePrint}
					onnotationchange={handleNotationChange}
					onstressdiacriticschange={handleStressDiacriticsChange}
					onopensyllabificationchange={handleOpenSyllabificationChange}
					onmetadatachange={handleMetadataChange}
					onpagesizechange={handlePageSizeChange}
				/>
			{/snippet}
			{#snippet inspectorPanel()}
				{#if selectedWord}
					{@const wordKey = `${selectedWord.lineIndex}-${selectedWord.wordIndex}`}
					{@const wordYoToggles = (() => {
						const prefix = `${wordKey}-`;
						const m = new Map<number, import('$lib/types').YoToggle>();
						for (const [k, v] of yoToggles) {
							if (k.startsWith(prefix)) {
								const ci = parseInt(k.substring(prefix.length), 10);
								if (!isNaN(ci)) m.set(ci, v);
							}
						}
						return m;
					})()}
					<InspectorPanel
						word={selectedWord}
						{language}
						{notationPrefs}
						{openSyllabification}
						{showStressDiacritics}
						syllableOverride={syllableOverrides.get(wordKey) ?? null}
						spotReconstituted={spotReconstitution.has(wordKey)}
						yoCharToggles={wordYoToggles}
						onback={handleInspectorBack}
						onspotrecontoggle={handleSpotReconToggle}
						onstressassign={handleStressAssign}
						onstressrevert={handleStressRevert}
						onyochartoggle={handleYoCharToggle}
						onsyllableoverride={(override) => handleSyllableOverride(selectedWord!.lineIndex, selectedWord!.wordIndex, override)}
						onsyllableoverrideclear={() => handleSyllableOverrideClear(selectedWord!.lineIndex, selectedWord!.wordIndex)}
					/>
				{/if}
			{/snippet}
		</Drawer>
	</div>

	<main class="main-content {paperBreathClass}" bind:this={mainContentEl}>
		<Paper lines={effectiveLines} {notationPrefs} {language} {metadata} {pageSize} {showStressDiacritics} {spotReconstitution} onwordclick={handleWordClick} />
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
			display: block;
			flex: none;
			padding: 0;
			overflow: visible;
		}
	}

	/* Breath animation: two-phase CSS transitions for moments of meaning */
	@keyframes breathOut {
		from { opacity: 1; transform: translateY(0); }
		to   { opacity: 0; transform: translateY(-2px); }
	}
	@keyframes breathIn {
		from { opacity: 0; transform: translateY(-2px); }
		to   { opacity: 1; transform: translateY(0); }
	}

	:global(.breath-out) {
		animation: breathOut 150ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}
	:global(.breath-in) {
		animation: breathIn 250ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}

	/* Respect reduced motion preferences */
	@media (prefers-reduced-motion: reduce) {
		:global(.breath-out),
		:global(.breath-in) {
			animation: none !important;
		}
	}

	/* ── Mobile awareness ──────────────────────────────────── */

	.mobile-overlay {
		position: fixed;
		inset: 0;
		z-index: 1000;
		background: var(--app-bg, #eee9e3);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.mobile-card {
		max-width: 360px;
		text-align: center;
	}

	.mobile-logo {
		font-size: 2rem;
		margin-bottom: 1.5rem;
		color: var(--sage);
	}

	.mobile-logo .logo-bracket {
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-weight: 400;
	}

	.mobile-logo .logo-ilya {
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-style: italic;
	}

	.mobile-heading {
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--ink-primary, #1a1612);
		margin-bottom: 0.5rem;
	}

	.mobile-body {
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 0.95rem;
		color: var(--ink-secondary, #4a4540);
		line-height: 1.6;
		margin-bottom: 1rem;
	}

	.mobile-divider {
		width: 40px;
		height: 0;
		border-top: 0.5px solid var(--stone-300, #d6d3d1);
		margin: 0.75rem auto 1.25rem;
	}

	.mobile-continue {
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.85rem;
		color: var(--ink-tertiary, #7a756e);
		background: none;
		border: 1.5px solid var(--sage, #8B9A7D);
		border-radius: 4px;
		padding: 0.5rem 1.25rem;
		margin-top: 1rem;
		cursor: pointer;
		transition: border-color 150ms ease, color 150ms ease;
	}

	.mobile-continue:hover {
		border-color: var(--sage);
		color: var(--ink-primary, #1a1612);
	}

	/* Responsive layout for narrow viewports */
	@media (max-width: 767px) {
		.app-content {
			position: relative;
		}

		.main-content {
			padding: 0.5rem;
			width: 100%;
			overflow: auto;
			align-items: flex-start;
			-webkit-overflow-scrolling: touch;
		}

		/* Drawer overlays from the left on mobile */
		:global(.drawer) {
			position: absolute !important;
			top: 0;
			left: 0;
			height: 100% !important;
			z-index: 100;
		}

		:global(.drawer:not(.collapsed)) {
			width: 100% !important;
		}
	}
</style>
