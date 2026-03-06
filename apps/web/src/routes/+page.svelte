<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { transcribeWord } from '@ilya/phonology';
	import type { NotationPreferences } from '@ilya/phonology';
	import { loadDictionary, type LoaderState } from '$lib/loader';
	import { processText } from '$lib/pipeline';
	import { applyOpenSyllabificationToLines } from '$lib/syllable-utils';
	import type { LineData, WordStackData, SongMetadata, UserStressOverride, YoToggle, SyllableOverride } from '$lib/types';
	import { t, type Language } from '$lib/i18n';
	import HeaderBar from '$lib/components/HeaderBar.svelte';
	import Drawer from '$lib/components/Drawer/Drawer.svelte';
	import RootPanel from '$lib/components/Drawer/RootPanel.svelte';
	import InspectorPanel from '$lib/components/Drawer/InspectorPanel.svelte';
	import Paper from '$lib/components/Paper/Paper.svelte';
import InstallPrompt from '$lib/components/InstallPrompt.svelte';
	import ReadingPaper from '$lib/components/Paper/ReadingPaper.svelte';
	import type { TabId } from '$lib/components/Drawer/TabBar.svelte';
	// Engine connectivity check
	const engineReady = typeof transcribeWord === 'function';
	// Dictionary loading state
	let loaderState = $state<LoaderState>({
		isLoading: true,
		error: null,
		entryCount: 0,
		durationMs: 0,
		progress: 0
	});
	// Language
	let language = $state<Language>('en');
	// Pipeline state
	let inputText = $state('');
	let lines = $state<LineData[]>([]);
	let transcribeError = $state('');
	let transcribeMs = $state(0);
	let selectedWord = $state<WordStackData | null>(null);
	let lastFocusedWord = $state<{ line: number; word: number } | null>(null);
	// Drawer state
	let drawerCollapsed = $state(false);
	// Tab state
	let activeTab = $state<TabId>('transcription');
	// Active heading for TOC sync
	let activeHeadingId = $state<string | null>(null);
	// Tab transition animation
	const TAB_ORDER: TabId[] = ['transcription', 'learn', 'guide'];
	let tabTransitionClass = $state('');
	// Mobile awareness
	let isMobile = $state(false);
	let mobileDismissed = $state(false);
	let mainContentEl: HTMLElement | undefined = $state(undefined);
	async function handleMobileDismiss() {
		mobileDismissed = true;
		loadDictionary({
			onStateChange(state) {
				loaderState = state;
			}
		});
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
	// Song metadata
	let metadata = $state<SongMetadata>({
		title: '',
		composer: '',
		poet: '',
		translator: '',
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
	// Per-word gloss overrides: keyed by "lineIndex-wordIndex"
	// Cleared on every fresh transcription or clear action, and by per-word reset.
	let glossOverrides = $state<Map<string, string>>(new Map());
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
	// ── Dynamic drawer width: pure calculation from ribbon content ──
	// Atoms are fixed 32px. Gaps, borders, and padding are constants.
	// Width is computed before render (no DOM measurement, no flicker).
	function calculateDrawerWidth(word: WordStackData): number {
		const ATOM_W = 32;
		const ATOM_GAP = 2;
		const MOL_PAD_BORDER = 9; // 3px padding × 2 + 1.5px border × 2
		const SYLLABLE_GAP = 12;
		const CLITIC_COL_W = ATOM_W + MOL_PAD_BORDER; // 41px
		const OVERHEAD = 70; // 32px panel padding + 24px lip + borders/scrollbar
		// Count atoms per syllable from displayLog
		const syllableAtomCounts = new Map<number, number>();
		for (const entry of word.displayLog) {
			const si = (entry as Record<string, unknown>).syllableIndex as number ?? 0;
			syllableAtomCounts.set(si, (syllableAtomCounts.get(si) ?? 0) + 1);
		}
		let ribbonWidth = 0;
		const syllableCount = syllableAtomCounts.size;
		// Sum molecule widths
		for (const [, atomCount] of syllableAtomCounts) {
			ribbonWidth += atomCount * ATOM_W + (atomCount - 1) * ATOM_GAP + MOL_PAD_BORDER;
		}
		// Gaps between syllable columns
		if (syllableCount > 1) {
			ribbonWidth += (syllableCount - 1) * SYLLABLE_GAP;
		}
		// Clitic arrow columns (standalone, outside molecules)
		if (word.isProclitic) ribbonWidth += CLITIC_COL_W + SYLLABLE_GAP;
		if (word.isEnclitic) ribbonWidth += CLITIC_COL_W + SYLLABLE_GAP;
		return Math.max(520, Math.min(720, ribbonWidth + OVERHEAD));
	}
	// Derived
	const showInspector = $derived(selectedWord !== null);
	const isReadingMode = $derived(activeTab !== 'transcription');
	const drawerWidth = $derived(
		activeTab === 'transcription'
			? (selectedWord ? calculateDrawerWidth(selectedWord) : 520)
			: 520
	);
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
		lastFocusedWord = null;
		spotReconstitution = new Map();
		userStressOverrides = new Map();
		yoToggles = new Map();
		syllableOverrides = new Map();
		glossOverrides = new Map();
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
		lastFocusedWord = null;
		spotReconstitution = new Map();
		userStressOverrides = new Map();
		yoToggles = new Map();
		syllableOverrides = new Map();
		glossOverrides = new Map();
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
		lastFocusedWord = { line: word.lineIndex, word: word.wordIndex };
		// Auto-expand drawer if collapsed when user clicks a word
		if (drawerCollapsed) {
			drawerCollapsed = false;
		}
		// Switch to Transcription tab if clicking a word from another tab
		if (activeTab !== 'transcription') {
			activeTab = 'transcription';
			try {
				localStorage.setItem('ilya:activeTab', 'transcription');
			} catch {
				// localStorage unavailable
			}
		}
		console.log('[Ilya] Selected:', word.cleanWord, word.ipaDisplay, {
			stress: word.stressIndex,
			source: word.stressSource,
			gloss: word.gloss,
			displayLog: word.displayLog,
		});
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
		const existingOverride = userStressOverrides.get(key);
		const isClitic = selectedWord.isProclitic || selectedWord.isEnclitic || existingOverride?.promotedFromClitic;
		const newMap = new Map(userStressOverrides);
		newMap.set(key, {
			stressIndex: syllableIndex,
			stressSource: source as UserStressOverride['stressSource'],
			...(isClitic ? { promotedFromClitic: true } : {}),
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
	// ── Per-word gloss override handler ───────────────────────────
	function handleGlossOverride(gloss: string | null) {
		if (!selectedWord) return;
		const key = `${selectedWord.lineIndex}-${selectedWord.wordIndex}`;
		const newMap = new Map(glossOverrides);
		if (gloss === null) {
			newMap.delete(key);
		} else {
			newMap.set(key, gloss);
		}
		glossOverrides = newMap;
	}
	// ── Per-word reset: clear all overrides for the selected word ──
	function handleReset() {
		if (!selectedWord) return;
		const wordKey = `${selectedWord.lineIndex}-${selectedWord.wordIndex}`;
		let needsPipeline = false;
		// Clear stress override
		if (userStressOverrides.has(wordKey)) {
			const newStress = new Map(userStressOverrides);
			newStress.delete(wordKey);
			userStressOverrides = newStress;
			needsPipeline = true;
		}
		// Clear ё toggles for this word (keys are "lineIndex-wordIndex-charIndex")
		const yoPrefix = `${wordKey}-`;
		const hasYoToggles = [...yoToggles.keys()].some(k => k.startsWith(yoPrefix));
		if (hasYoToggles) {
			const newYo = new Map(yoToggles);
			for (const k of [...newYo.keys()]) {
				if (k.startsWith(yoPrefix)) newYo.delete(k);
			}
			yoToggles = newYo;
			needsPipeline = true;
		}
		// Clear syllable override
		if (syllableOverrides.has(wordKey)) {
			const newSyll = new Map(syllableOverrides);
			newSyll.delete(wordKey);
			syllableOverrides = newSyll;
		}
		// Clear spot reconstitution
		if (spotReconstitution.has(wordKey)) {
			const newSpot = new Map(spotReconstitution);
			newSpot.delete(wordKey);
			spotReconstitution = newSpot;
		}
		// Clear gloss override
		if (glossOverrides.has(wordKey)) {
			const newGloss = new Map(glossOverrides);
			newGloss.delete(wordKey);
			glossOverrides = newGloss;
		}
		if (needsPipeline) runPipeline();
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
	function handleDrawerToggle() {
		drawerCollapsed = !drawerCollapsed;
		try {
			localStorage.setItem('ilya:drawerCollapsed', JSON.stringify(drawerCollapsed));
		} catch {
			// localStorage unavailable
		}
	}
	function handleTabChange(tab: TabId) {
		const oldIndex = TAB_ORDER.indexOf(activeTab);
		const newIndex = TAB_ORDER.indexOf(tab);
		// Compute direction: moving right in tab order → content enters from right
		const direction = newIndex > oldIndex ? 'tab-enter-from-right' : 'tab-enter-from-left';
		activeTab = tab;
		tabTransitionClass = direction;
		try {
			localStorage.setItem('ilya:activeTab', tab);
		} catch {
			// localStorage unavailable
		}
		// Clear animation class after it completes (175ms + buffer)
		setTimeout(() => {
			tabTransitionClass = '';
		}, 200);
	}

	/* ── Heading navigation from Drawer TOC ────────────────── */

	function handleHeadingNavigate(id: string) {
		activeHeadingId = id;
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
			history.pushState(null, '', `#${id}`);
		}
	}

	/* ── IntersectionObserver for scroll-based active heading ─ */

	$effect(() => {
		if (activeTab !== 'learn' && activeTab !== 'guide') return;
		if (!mainContentEl) return;

		// Collect all heading elements with ids inside main-content
		const headings = mainContentEl.querySelectorAll('[id^="learn-"], [id^="guide-"]');
		if (headings.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				// Find the topmost intersecting heading
				const visible = entries
					.filter(e => e.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
				if (visible.length > 0) {
					activeHeadingId = visible[0].target.id;
				}
			},
			{
				root: mainContentEl,
				rootMargin: '-25% 0px -60% 0px',
				threshold: 0,
			}
		);

		headings.forEach(h => observer.observe(h));
		return () => observer.disconnect();
	});

	/* ── Handle URL hash on page load ──────────────────────── */

	function handleHashNavigation() {
		const hash = window.location.hash.slice(1);
		if (hash) {
			requestAnimationFrame(() => {
				const el = document.getElementById(hash);
				if (el) {
					el.scrollIntoView({ behavior: 'smooth', block: 'start' });
					activeHeadingId = hash;
				}
			});
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
			const savedTab = localStorage.getItem('ilya:activeTab');
			if (savedTab === 'transcription' || savedTab === 'learn' || savedTab === 'guide') {
				activeTab = savedTab;
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
		// On mobile with no saved drawer preference, start collapsed
		if (isMobile) {
			try {
				if (!localStorage.getItem('ilya:drawerCollapsed')) {
					drawerCollapsed = true;
				}
			} catch {
				drawerCollapsed = true;
			}
		}
		handleHashNavigation();
		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;1,400&family=Noto+Serif:ital,wght@0,400;1,400&display=swap" rel="stylesheet" />
</svelte:head>
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
	<HeaderBar {language} {activeTab} onlanguagechange={handleLanguageChange} />
<InstallPrompt {language} />
</div>
<div class="app-content {viewBreathClass}">
	<Drawer
		width={drawerWidth}
		collapsed={drawerCollapsed}
		{language}
		{activeTab}
		{activeHeadingId}
		{tabTransitionClass}
		ontogglecollapse={handleDrawerToggle}
		ontabchange={handleTabChange}
		onheadingnavigate={handleHeadingNavigate}
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
					{showInspector}
					oninput={handleInput}
					ontranscribe={handleTranscribe}
					onclear={handleClear}
					onprint={handlePrint}
					onnotationchange={handleNotationChange}
					onstressdiacriticschange={handleStressDiacriticsChange}
					onopensyllabificationchange={handleOpenSyllabificationChange}
					onmetadatachange={handleMetadataChange}
				>
					{#snippet consoleContent()}
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
								promotedFromClitic={userStressOverrides.get(wordKey)?.promotedFromClitic ?? false}
								yoCharToggles={wordYoToggles}
								onspotrecontoggle={handleSpotReconToggle}
								onstressassign={handleStressAssign}
								onstressrevert={handleStressRevert}
								onyochartoggle={handleYoCharToggle}
								onsyllableoverride={(override) => handleSyllableOverride(selectedWord!.lineIndex, selectedWord!.wordIndex, override)}
								onsyllableoverrideclear={() => handleSyllableOverrideClear(selectedWord!.lineIndex, selectedWord!.wordIndex)}
								onreset={handleReset}
								glossOverride={glossOverrides.get(wordKey)}
								onglossoverride={handleGlossOverride}
							/>
						{/if}
					{/snippet}
				</RootPanel>
			{/snippet}
	</Drawer>
	<main
		class="main-content tab-{activeTab} {paperBreathClass} {tabTransitionClass}"
		class:drawer-open={!drawerCollapsed}
		class:reading-mode={isReadingMode}
		bind:this={mainContentEl}
		tabindex="0"
	>
		{#if activeTab === 'transcription'}
			<Paper lines={effectiveLines} {notationPrefs} {language} {metadata} pageSize="letter" {showStressDiacritics} {spotReconstitution} {glossOverrides} onwordclick={handleWordClick} />
		{:else}
			<ReadingPaper {language}>
				{#snippet content()}
					{#if activeTab === 'learn'}
						{#if language === 'fr'}
						<h1 id="learn-title">La diction lyrique russe pour chanteurs</h1>

						<p>Les sons du russe chanté ne sont pas aussi éloignés de ce que vous connaissez déjà qu'il n'y paraît au premier abord : nombre de consonnes se comportent exactement comme leurs équivalents dans les langues que vous avez étudiées, et le système vocalique, bien qu'il obéisse à des règles différentes, est plus restreint et plus ordonné que celui de l'anglais. Ce que le russe vous demande n'est pas un saut dans l'inconnu, mais une extension de compétences que vous possédez déjà, guidée par un cadre phonologique rigoureux et bien documenté.</p>

						<p>Quelques éléments utiles avant d'entrer dans le vif du sujet.</p>

						<p><strong>Vous lisez déjà l'API.</strong> <em>Ilya</em> part du principe que vous avez travaillé avec l'Alphabet phonétique international dans au moins une autre langue chantée. Si vous savez déjà lire une transcription de diction lyrique italienne, française ou allemande, vous possédez la plupart des outils nécessaires. Le russe n'ajoute qu'un petit nombre de symboles qui vous seront nouveaux. Nous les explorons sous peu.</p>

						<p><strong>La diction lyrique est un registre stylisé.</strong> Le public russe attend un certain degré d'artifice dans le chant et la déclamation poétique. Tout comme chanter «&nbsp;dew&nbsp;» en <code>[djuː]</code> ne correspond pas à la prononciation courante chez la plupart des anglophones, ou que prononcer chaque e caduc en conversation courante sonnerait affecté en français, le russe chanté impose certaines prononciations stylisées. Le russe chanté n'est pas le russe conversationnel. La diction lyrique russe occupe un registre élevé : plus précis que la parole, façonné par les exigences de la production vocale soutenue et non amplifiée, et ancré dans la tradition de prononciation littéraire et scénique. La thèse de doctorat du Dr. Craig Grayson, <em>Russian Lyric Diction</em> (2012), décrit ce registre d'une manière systématique, et <em>Ilya</em> met en œuvre son travail pour vous. Lorsque vous voyez un symbole API dans <em>Ilya</em>, il reflète le style de notation de Grayson. Lorsque vous le rencontrez dans sa thèse, il signifie la même chose. Voilà notre promesse.</p>

						<p><strong>Les règles décrivent ce que fait le russe.</strong> Tout au long de LEÇONS, nous présentons les règles non comme des lois capricieuses à mémoriser, mais comme des descriptions synthétisées du comportement du russe : comment les mots subissent certaines transformations dans certains contextes. Nous nommons et décrivons ces transformations, nous vous offrons des exemples, et nous vous dirigeons vers <em>Ilya</em> pour que vous puissiez les observer en temps réel avec du vrai texte. Les règles sont des motifs à reconnaître, non des lois arbitraires à appliquer.</p>

						<h2 id="learn-about">À propos de ce module</h2>

						<p>LEÇONS présente les principes fondamentaux de la diction lyrique russe tels qu'établis par Craig Grayson dans sa thèse de doctorat de 2012, <em>Russian Lyric Diction: A practical guide with introduction and annotations and a bibliography with annotations on selected sources</em> (Université de Washington). Ce qui suit est une réorganisation pédagogique du travail de Grayson, conçue pour les chanteurs plutôt que pour les linguistes, et structurée pour construire progressivement à partir de vos acquis.</p>

						<p>Grayson n'est pas le premier à couvrir ce terrain. Depuis le volume pionnier de Natalia Challis sur Rachmaninov (1989), en passant par les transcriptions de Piatak et Avrashov (1991), les six volumes de Richter (1999-2008), les libretti de Belov (2004), et les contributions d'Olin (2012), de McMaster (dans le livre de Sheil, 2012) et de Thomas (dans le livre de Karna, 2010), les chanteurs ont disposé de ressources de valeur et d'ampleur croissantes. Ce que Grayson apporte est une synthèse : un guide de diction adossé à l'API orthodoxe, informé par la phonologie russe, et suffisamment rigoureux pour permettre au lecteur de produire des transcriptions originales avec un réel degré d'autonomie. Dans la taxinomie utile de Sarah Dailey, les ressources antérieures servaient principalement de « guides accélérés » fournissant des transcriptions prêtes à l'emploi, tandis que Grayson propose un « guide d'étude autonome » qui enseigne le système sous-jacent.</p>

						<p>Trois limites protègent notre propos. Ceci n'est pas un cours de langue russe : nous enseignons la prononciation, non la grammaire, sauf lorsque la conscience grammaticale affecte directement la prononciation d'un mot. Ceci n'est pas un substitut à la thèse de Grayson : l'appareil savant complet demeure dans la source, et nous l'honorons en nous y appuyant plutôt qu'en le reproduisant. Et ceci n'est pas un guide d'utilisation d'Ilya; l'onglet Guide enseigne l'outil. LEÇONS enseigne la diction.</p>

						<h2 id="learn-arc">L'arc d'apprentissage</h2>

						<p>Le module est organisé en sept unités qui suivent un principe directeur unique : découvrir les sons d'abord, puis apprendre ce qui leur arrive.</p>


						<h3 id="learn-unit-1">Section 1 · Les lettres</h3>

						<p>Le russe standard contemporain (RSC) utilise trente-trois lettres. On rencontre parfois quatre caractères supplémentaires, aujourd'hui obsolètes, dans les partitions anciennes ; ceux-ci ont été abandonnés lors de la réforme orthographique de 1918. C'est là tout le système, et à la fin de cette section vous aurez fait connaissance avec chacun de ses membres.</p>

						<p>Commençons par une chanson.</p>

						<h4 id="learn-u1-song">La chanson de l'alphabet russe</h4>

						<figure>
							<img src="/images/russian-alphabet-song.png" alt="Chanson de l'alphabet russe, arrangement Dann Mitton 2017. Voix de basse en si bémol majeur, Moderato. Les trente-trois lettres cyrilliques dans l'ordre du dictionnaire avec transcription API sous chaque nom de lettre." style="width: 100%; height: auto; border-radius: 4px;" />
							<figcaption>Chanson de l'alphabet russe, arr. Dann Mitton 2017. D'après Ken Griffiths.</figcaption>
						</figure>

						<p>Les enfants russes apprennent l'alphabet cyrillique par cœur. Cette chanson de l'alphabet russe est une construction occidentalisée sur la mélodie d'une chanson à boire traditionnelle. Elle présente les trente-trois lettres dans leur ordre du dictionnaire, chacune chantée sur son nom russe. La phrase finale offre ce conseil pragmatique : «&nbsp;Pour parler russe, il faut apprendre l'alphabet&nbsp;!&nbsp;» Chantez-la une ou deux fois dans la tonalité qui vous convient le mieux et vous aurez déjà la séquence sous les doigts.</p>

						<h4 id="learn-u1-alphabet">L'alphabet</h4>

						<p>Le tableau ci-dessous présente les trente-trois lettres russes modernes dans leur ordre alphabétique standard, ainsi que les quatre lettres obsolètes d'avant 1918. Chaque lettre comporte son nom russe, sa catégorie sonore (voyelle, consonne ou signe) et un ancrage API de base : le son par défaut que cette lettre représente avant l'application de toute transformation contextuelle. Pour les voyelles, il s'agit de leur valeur cardinale accentuée. Pour les consonnes, il s'agit généralement de leur forme non palatalisée (ou «&nbsp;dure&nbsp;») par défaut, avec quelques exceptions mémorables.</p>

						<p>Les sections 2 à 7 enseignent ce que le russe fait à ces sons en contexte : comment l'accent modifie les voyelles, comment les consonnes «&nbsp;s'adoucissent&nbsp;» (ou se <em>palatalisent</em>) devant certaines lettres, et comment les sons influencent leurs voisins au-delà des frontières de mots. Pour l'instant, faisons connaissance avec les lettres alphabétiques et leurs identités les plus fondamentales telles qu'elles s'appliquent au russe chanté.</p>

						<table>
						<thead><tr><th>#</th><th>Lettre</th><th>Nom</th><th>Catégorie</th><th>Ancrage</th><th>Notes</th></tr></thead>
						<tbody>
						<tr><td>1</td><td><strong>А а</strong></td><td>а <code>[ɑ]</code></td><td>voyelle</td><td><code>[ɑ]</code></td><td>Voyelle ouverte postérieure. Le chanteur la connaît du français.</td></tr>
						<tr><td>2</td><td><strong>Б б</strong></td><td>бэ <code>[bɛ]</code></td><td>consonne</td><td><code>[b]</code></td><td>Occlusive bilabiale voisée.</td></tr>
						<tr><td>3</td><td><strong>В в</strong></td><td>вэ <code>[vɛ]</code></td><td>consonne</td><td><code>[v]</code></td><td>Fricative labiodentale voisée. Ressemble au B latin ; se prononce comme V.</td></tr>
						<tr><td>4</td><td><strong>Г г</strong></td><td>гэ <code>[gɛ]</code></td><td>consonne</td><td><code>[ɡ]</code></td><td>Occlusive vélaire voisée.</td></tr>
						<tr><td>5</td><td><strong>Д д</strong></td><td>дэ <code>[dɛ]</code></td><td>consonne</td><td><code>[d]</code></td><td>Occlusive dentale voisée. Le <code>[d]</code> russe est dental, non alvéolaire.</td></tr>
						<tr><td>6</td><td><strong>Е е</strong></td><td>е <code>[jɛ]</code></td><td>voyelle</td><td><code>[jɛ]</code></td><td>Voyelle iotée. Après une consonne, le <code>[j]</code> est absorbé sous forme de palatalisation de cette consonne.</td></tr>
						<tr><td>7</td><td><strong>Ё ё</strong></td><td>ё <code>[jo]</code></td><td>voyelle</td><td><code>[jo]</code></td><td>Voyelle iotée. Toujours accentuée : la seule voyelle prévisible du russe. Souvent imprimée sans son tréma.</td></tr>
						<tr><td>8</td><td><strong>Ж ж</strong></td><td>жэ <code>[ʒɛ]</code></td><td>consonne</td><td><code>[ʒ]</code></td><td>Fricative postalvéolaire voisée. Toujours dure : ne se palatalise jamais.</td></tr>
						<tr><td>9</td><td><strong>З з</strong></td><td>зэ <code>[zɛ]</code></td><td>consonne</td><td><code>[z]</code></td><td>Fricative dentale voisée.</td></tr>
						<tr><td>10</td><td><strong>И и</strong></td><td>и <code>[i]</code></td><td>voyelle</td><td><code>[i]</code></td><td>Voyelle fermée antérieure. Identique en italien, en français, en allemand et en diction lyrique anglaise.</td></tr>
						<tr><td>11</td><td><strong>Й й</strong></td><td>и краткое <code>[ˈkrɑt kʌ jɛ]</code></td><td>consonne</td><td><code>[j]</code></td><td>La glissante palatale. Les Russes considèrent le «&nbsp;i bref&nbsp;» comme une consonne palatalisée, contrairement à son statut de semi-voyelle en anglais et en français.</td></tr>
						<tr><td>12</td><td><strong>К к</strong></td><td>ка <code>[kɑ]</code></td><td>consonne</td><td><code>[k]</code></td><td>Occlusive vélaire sourde.</td></tr>
						<tr><td>13</td><td><strong>Л л</strong></td><td>эл <code>[ɛl]</code></td><td>consonne</td><td><code>[l]</code> / <code>[ɫ]</code></td><td>Deux formes : soit palatalisé <code>[lʲ]</code>, soit vélarisé <code>[ɫ]</code>. Le contexte détermine laquelle.</td></tr>
						<tr><td>14</td><td><strong>М м</strong></td><td>эм <code>[ɛm]</code></td><td>consonne</td><td><code>[m]</code></td><td>Nasale bilabiale.</td></tr>
						<tr><td>15</td><td><strong>Н н</strong></td><td>эн <code>[ɛn]</code></td><td>consonne</td><td><code>[n]</code></td><td>Nasale dentale. Ressemble au H latin ; se prononce comme N.</td></tr>
						<tr><td>16</td><td><strong>О о</strong></td><td>о <code>[o]</code></td><td>voyelle</td><td><code>[o]</code></td><td>Voyelle mi-fermée postérieure arrondie. N'apparaît comme <code>[o]</code> que sous l'accent. Seul ou en fin de mot, le <code>[o]</code> russe est <code>[oːʌ̯]</code>.</td></tr>
						<tr><td>17</td><td><strong>П п</strong></td><td>пэ <code>[pɛ]</code></td><td>consonne</td><td><code>[p]</code></td><td>Occlusive bilabiale sourde.</td></tr>
						<tr><td>18</td><td><strong>Р р</strong></td><td>эр <code>[ɛr]</code></td><td>consonne</td><td><code>[r]</code></td><td>Roulée dentale. Ressemble au P latin ; se prononce comme un R roulé.</td></tr>
						<tr><td>19</td><td><strong>С с</strong></td><td>эс <code>[ɛs]</code></td><td>consonne</td><td><code>[s]</code></td><td>Fricative dentale sourde. Ressemble au C latin ; se prononce comme S.</td></tr>
						<tr><td>20</td><td><strong>Т т</strong></td><td>тэ <code>[tɛ]</code></td><td>consonne</td><td><code>[t]</code></td><td>Occlusive dentale sourde. Le <code>[t]</code> russe est dental, non alvéolaire.</td></tr>
						<tr><td>21</td><td><strong>У у</strong></td><td>у <code>[u]</code></td><td>voyelle</td><td><code>[u]</code></td><td>Voyelle fermée postérieure arrondie. Conserve sa qualité indépendamment de l'accent.</td></tr>
						<tr><td>22</td><td><strong>Ф ф</strong></td><td>эф <code>[ɛf]</code></td><td>consonne</td><td><code>[f]</code></td><td>Fricative labiodentale sourde.</td></tr>
						<tr><td>23</td><td><strong>Х х</strong></td><td>ха <code>[xɑ]</code></td><td>consonne</td><td><code>[x]</code></td><td>Fricative vélaire sourde. Ressemble au X latin ; cette fricative se produit au même point d'articulation que <code>[k]</code> et <code>[ɡ]</code>.</td></tr>
						<tr><td>24</td><td><strong>Ц ц</strong></td><td>цэ <code>[tsɛ]</code></td><td>consonne</td><td><code>[ts]</code></td><td>Affriquée dentale sourde. Toujours dure : ne se palatalise jamais. <code>[ts]</code> est un digramme inséparable.</td></tr>
						<tr><td>25</td><td><strong>Ч ч</strong></td><td>че <code>[tʃʲɛ]</code></td><td>consonne</td><td><code>[tʃʲ]</code></td><td>Affriquée postalvéolaire sourde. Toujours molle : intrinsèquement palatalisée. Trigramme inséparable.</td></tr>
						<tr><td>26</td><td><strong>Ш ш</strong></td><td>ша <code>[ʃɑ]</code></td><td>consonne</td><td><code>[ʃ]</code></td><td>Fricative postalvéolaire sourde. Toujours dure : ne se palatalise jamais.</td></tr>
						<tr><td>27</td><td><strong>Щ щ</strong></td><td>ща <code>[ʃtʃʲɑ]</code></td><td>consonne</td><td><code>[ʃʲʃʲ]</code></td><td>Fricative postalvéolaire palatalisée longue. Toujours molle. Notation moderne de Grayson.</td></tr>
						<tr><td>28</td><td><strong>Ъ ъ</strong></td><td>твёрдый знак <code>[ˈtvʲor dɨj znɑk]</code></td><td>signe</td><td>—</td><td>Le signe dur. Un marqueur de frontière. Aucun son propre.</td></tr>
						<tr><td>29</td><td><strong>Ы ы</strong></td><td>ы <code>[ɨ]</code></td><td>voyelle</td><td><code>[ɨ]</code></td><td>Voyelle fermée centrale. Le son véritablement nouveau pour la plupart des chanteurs.</td></tr>
						<tr><td>30</td><td><strong>Ь ь</strong></td><td>мягкий знак <code>[mʲɑxʲ kʲij znɑk]</code></td><td>signe</td><td>—</td><td>Le signe mou. Palatalise la consonne qui le précède. Aucun son propre.</td></tr>
						<tr><td>31</td><td><strong>Э э</strong></td><td>э <code>[ɛ]</code></td><td>voyelle</td><td><code>[ɛ]</code></td><td>Voyelle mi-ouverte antérieure. Proche du ⟨è⟩ français ou du ⟨e⟩ ouvert italien.</td></tr>
						<tr><td>32</td><td><strong>Ю ю</strong></td><td>ю <code>[ju]</code></td><td>voyelle</td><td><code>[ju]</code></td><td>Voyelle iotée. Après une consonne, le <code>[j]</code> est absorbé sous forme de palatalisation.</td></tr>
						<tr><td>33</td><td><strong>Я я</strong></td><td>я <code>[jɑ]</code></td><td>voyelle</td><td><code>[jɑ]</code></td><td>Voyelle iotée. Après une consonne, le <code>[j]</code> est absorbé sous forme de palatalisation.</td></tr>
						<tr><td>—</td><td><strong>Ѣ ѣ</strong></td><td>ять <code>[jɑtʲ]</code></td><td>obsolète</td><td>→ Е е</td><td>Avant 1918. Substituez son équivalent moderne.</td></tr>
						<tr><td>—</td><td><strong>Ѳ ѳ</strong></td><td>фита <code>[fʲitɑ]</code></td><td>obsolète</td><td>→ Ф ф</td><td>Avant 1918. Substituez son équivalent moderne.</td></tr>
						<tr><td>—</td><td><strong>І і</strong></td><td>и десятеричное <code>[i dʲɪ sʲɪ tʲɪ ˈrʲitʃʲ nɑ jɪ]</code></td><td>obsolète</td><td>→ И и</td><td>Avant 1918. «&nbsp;I décimal.&nbsp;» Substituez son équivalent moderne.</td></tr>
						<tr><td>—</td><td><strong>Ѵ ѵ</strong></td><td>ижица <code>[ˈi ʒɨ tsɑ]</code></td><td>obsolète</td><td>→ И и</td><td>Avant 1918. Rare même avant la réforme. Substituez son équivalent moderne.</td></tr>
						</tbody>
						</table>

						<p>Lorsque vous rencontrez une lettre obsolète dans une partition ancienne, <em>Ilya</em> la remplace automatiquement par son équivalent moderne.</p>

						<h4 id="learn-u1-familiar">Ce que vous connaissez déjà</h4>

						<p>Vous connaissez déjà plus de l'alphabet cyrillique que vous ne le pensez peut-être. Les tableaux ci-dessous regroupent les lettres selon leur degré de familiarité pour les lecteurs de l'alphabet latin. Il s'agit d'un tri purement visuel, et non phonologique : il porte sur la reconnaissance des formes, et non sur le fonctionnement des sons.</p>

						<p><strong>Formes familières</strong></p>

						<p>Ces lettres ressemblent à leurs équivalents latins et se comportent comme on s'y attend. Aucune surprise ici.</p>

						<table>
						<thead><tr><th>Cyrillique</th><th>Équivalent latin</th><th>API</th><th>Ce que le chanteur connaît déjà</th></tr></thead>
						<tbody>
						<tr><td><strong>А а</strong></td><td>A a</td><td><code>[ɑ]</code></td><td>Le <code>[ɑ]</code> italien, comme dans «&nbsp;pâte&nbsp;». Le russe utilise par défaut le <code>[ɑ]</code> ouvert postérieur ; le <code>[a]</code> plus clair (pizza !) n'apparaît que dans certains environnements palataux spécifiques (Section 3).</td></tr>
						<tr><td><strong>Е е</strong></td><td>E e</td><td><code>[jɛ]</code></td><td>La forme est familière ; le son inclut une glissante que le ⟨e⟩ français ne comporte pas. Le chanteur qui lit <code>[ɛ]</code> du français ou de l'italien est déjà presque à destination.</td></tr>
						<tr><td><strong>К к</strong></td><td>K k</td><td><code>[k]</code></td><td>Identique.</td></tr>
						<tr><td><strong>М м</strong></td><td>M m</td><td><code>[m]</code></td><td>Identique.</td></tr>
						<tr><td><strong>О о</strong></td><td>O o</td><td><code>[o]</code></td><td>La forme est identique. Le <code>[o]</code> russe se situe légèrement plus ouvert que le <code>[o]</code> allemand, et peut comporter un glissement lorsqu'il termine un mot. Nous y reviendrons.</td></tr>
						<tr><td><strong>Т т</strong></td><td>T t</td><td><code>[t]</code></td><td>Le russe le place aux dents (dental) plutôt qu'à la crête alvéolaire. Le chanteur qui a chanté les dentales italiennes ou françaises effectue déjà cet ajustement.</td></tr>
						</tbody>
						</table>

						<p><strong>Faux amis</strong></p>

						<p>Ces lettres ressemblent peut-être à quelque chose que vous reconnaissez de l'alphabet latin, mais elles représentent des sons différents de ceux auxquels les chanteurs non natifs sont habitués. Ce sont des pièges, et ils méritent un moment d'attention maintenant, pour ne pas vous surprendre plus tard.</p>

						<table>
						<thead><tr><th>Cyrillique</th><th>Ressemble à</th><th>Se prononce en réalité</th><th>API</th></tr></thead>
						<tbody>
						<tr><td><strong>В в</strong></td><td>B b</td><td>V</td><td><code>[v]</code></td></tr>
						<tr><td><strong>Н н</strong></td><td>H h</td><td>N</td><td><code>[n]</code></td></tr>
						<tr><td><strong>Р р</strong></td><td>P p</td><td>R roulé</td><td><code>[r]</code></td></tr>
						<tr><td><strong>С с</strong></td><td>C c</td><td>S</td><td><code>[s]</code></td></tr>
						<tr><td><strong>У у</strong></td><td>Y y (approximativement)</td><td><code>[u]</code> comme dans «&nbsp;fou&nbsp;»</td><td><code>[u]</code></td></tr>
						<tr><td><strong>Х х</strong></td><td>X x</td><td>À ne pas confondre avec l'achlaut allemand <code>[χ]</code>, cette fricative se produit au même point d'articulation que <code>[k]</code> et <code>[ɡ]</code>.</td><td><code>[x]</code></td></tr>
						</tbody>
						</table>

						<p>Un chanteur déchiffrant le cyrillique pour la première fois commettra presque certainement une erreur de lecture sur au moins l'une de ces lettres. C'est normal. Les connaître, c'est déjà s'en protéger.</p>

						<p><strong>Formes nouvelles</strong></p>

						<p>Ces vingt lettres n'ont pas d'équivalent latin. Leur apparence peut sembler inhabituelle, mais c'est en fait un avantage : il n'y a rien à désapprendre. Vous apprenez simplement chaque forme et son son à neuf.</p>

						<table>
						<thead><tr><th>Cyrillique</th><th>Nom</th><th>API</th><th>Catégorie</th></tr></thead>
						<tbody>
						<tr><td><strong>Б б</strong></td><td>бэ <code>[bɛ]</code></td><td><code>[b]</code></td><td>consonne</td></tr>
						<tr><td><strong>Г г</strong></td><td>гэ <code>[gɛ]</code></td><td><code>[ɡ]</code></td><td>consonne</td></tr>
						<tr><td><strong>Д д</strong></td><td>дэ <code>[dɛ]</code></td><td><code>[d]</code></td><td>consonne</td></tr>
						<tr><td><strong>Ж ж</strong></td><td>жэ <code>[ʒɛ]</code></td><td><code>[ʒ]</code></td><td>consonne (toujours dure)</td></tr>
						<tr><td><strong>З з</strong></td><td>зэ <code>[zɛ]</code></td><td><code>[z]</code></td><td>consonne</td></tr>
						<tr><td><strong>И и</strong></td><td>и <code>[i]</code></td><td><code>[i]</code></td><td>voyelle</td></tr>
						<tr><td><strong>Й й</strong></td><td>и краткое</td><td><code>[j]</code></td><td>consonne</td></tr>
						<tr><td><strong>Л л</strong></td><td>эл <code>[ɛl]</code></td><td><code>[l]</code> / <code>[ɫ]</code></td><td>consonne</td></tr>
						<tr><td><strong>П п</strong></td><td>пэ <code>[pɛ]</code></td><td><code>[p]</code></td><td>consonne</td></tr>
						<tr><td><strong>Ф ф</strong></td><td>эф <code>[ɛf]</code></td><td><code>[f]</code></td><td>consonne</td></tr>
						<tr><td><strong>Ц ц</strong></td><td>цэ <code>[tsɛ]</code></td><td><code>[ts]</code></td><td>consonne (toujours dure)</td></tr>
						<tr><td><strong>Ч ч</strong></td><td>че <code>[tʃʲɛ]</code></td><td><code>[tʃʲ]</code></td><td>consonne (toujours molle)</td></tr>
						<tr><td><strong>Ш ш</strong></td><td>ша <code>[ʃɑ]</code></td><td><code>[ʃ]</code></td><td>consonne (toujours dure)</td></tr>
						<tr><td><strong>Щ щ</strong></td><td>ща <code>[ʃtʃʲɑ]</code></td><td><code>[ʃʲʃʲ]</code></td><td>consonne (toujours molle)</td></tr>
						<tr><td><strong>Ъ ъ</strong></td><td>твёрдый знак</td><td>—</td><td>signe (signe dur)</td></tr>
						<tr><td><strong>Ы ы</strong></td><td>ы <code>[ɨ]</code></td><td><code>[ɨ]</code></td><td>voyelle</td></tr>
						<tr><td><strong>Ь ь</strong></td><td>мягкий знак</td><td>—</td><td>signe (signe mou)</td></tr>
						<tr><td><strong>Э э</strong></td><td>э <code>[ɛ]</code></td><td><code>[ɛ]</code></td><td>voyelle</td></tr>
						<tr><td><strong>Ю ю</strong></td><td>ю <code>[ju]</code></td><td><code>[ju]</code></td><td>voyelle</td></tr>
						<tr><td><strong>Я я</strong></td><td>я <code>[jɑ]</code></td><td><code>[jɑ]</code></td><td>voyelle</td></tr>
						</tbody>
						</table>

						<p>La plupart de ces lettres cyrilliques représentent des sons que vous produisez déjà dans d'autres langues. L'API le confirme : <code>[b]</code>, <code>[d]</code>, <code>[p]</code>, <code>[f]</code>, <code>[i]</code>, <code>[ɛ]</code>, <code>[u]</code> sont de vieilles connaissances sous de nouveaux habits. Quelques-unes sont véritablement nouvelles. La voyelle fermée centrale <code>[ɨ]</code> (⟨Ы⟩) n'a pas d'analogue proche dans les langues chantées d'Europe occidentale ; nous l'explorons à la Section 3. Les consonnes palatalisées <code>[tʃʲ]</code> et <code>[ʃʲʃʲ]</code> impliquent une position de la langue que la Section 6 vous enseignera.</p>

						<h4 id="learn-u1-signs">Les deux signes</h4>

						<p>Deux lettres cyrilliques ne produisent aucun son propre.</p>

						<p><strong>⟨Ь⟩ (мягкий знак, le signe mou)</strong> palatalise («&nbsp;adoucit&nbsp;») la consonne qui le précède. Lorsque vous voyez ⟨Ь⟩ après une consonne, celle-ci acquiert une articulation secondaire : la lame de la langue s'élève vers le palais dur exactement comme si nous allions chanter la voyelle <code>[i]</code>. C'est le marqueur fonctionnel le plus important de l'orthographe russe. La Section 6 développe le processus physique de la palatalisation et ses conséquences plus larges.</p>

						<p><strong>⟨Ъ⟩ (твёрдый знак, le signe dur)</strong> apparaît entre un préfixe et une voyelle iotée (⟨е⟩, ⟨ё⟩, ⟨ю⟩, ⟨я⟩). Il marquait autrefois chaque mot se terminant par un son consonantique «&nbsp;dur&nbsp;», mais la réforme orthographique de 1918 a éliminé cet usage ; vous rencontrerez toutefois des textes d'avant 1917 dominés par des signes durs terminaux, et c'est ce qui explique leur présence. Le signe dur empêche les voyelles iotées de palataliser la consonne précédente, préservant ainsi une frontière. Vous rencontrerez ⟨Ъ⟩ bien moins souvent que ⟨Ь⟩.</p>

						<p>Aucun des deux signes n'apparaît dans les transcriptions API comme son indépendant. Ces signes silencieux sont des marqueurs orthographiques importants qui influencent les sons qui les entourent.</p>

						<h4 id="learn-u1-yo">Note sur ⟨Ё⟩</h4>

						<p>La lettre ⟨ё⟩ mérite une mise en garde particulière. Il est exaspérant de constater à quel point les imprimés russes, y compris les partitions musicales, omettent couramment le tréma et impriment ⟨ё⟩ comme ⟨е⟩. Or, ces deux lettres représentent des sons radicalement différents : ⟨ё⟩ est toujours accentuée et produit <code>[jo]</code> (ou <code>[o]</code> après une consonne), tandis que ⟨е⟩ produit <code>[jɛ]</code> (ou <code>[ɛ]</code> après une consonne). Lorsque le tréma (<em>umlaut</em> en allemand, <em>diaeresis</em> en anglais) est absent, le chanteur non natif doit savoir, soit par le contexte, soit par un dictionnaire, quelle lettre l'éditeur avait en tête. Le dictionnaire d'<em>Ilya</em> restaure automatiquement ⟨ё⟩ là où il convient et signale la transformation, mais le chanteur travaillant à partir d'une partition imprimée sans l'aide d'<em>Ilya</em> fait face à un véritable défi. C'est l'un des nombreux problèmes pratiques liés aux textes russes qu'un outil comme <em>Ilya</em> existe pour résoudre.</p>

						<h4 id="learn-u1-glyphs">Le tableau des glyphes</h4>

						<div class="gt-legend"><span class="gt-legend-swatch"></span> Forme graphique radicalement différente des lettres latines familières</div>
						<div class="gt-scroll" tabindex="0" role="region" aria-label="Tableau des glyphes cyrilliques">
						<table class="gt-table">
						<thead>
						<tr>
							<th>Maj.<br><span class="gt-col-sub">Sérif</span></th>
							<th>Min.<br><span class="gt-col-sub">Sérif</span></th>
							<th>Maj.<br><span class="gt-col-sub">Sérif italique</span></th>
							<th>Min.<br><span class="gt-col-sub">Sérif italique</span></th>
							<th>Maj.<br><span class="gt-col-sub">Sans</span></th>
							<th>Min.<br><span class="gt-col-sub">Sans</span></th>
							<th>Maj.<br><span class="gt-col-sub">Sans italique</span></th>
							<th>Min.<br><span class="gt-col-sub">Sans italique</span></th>
							<th class="gt-cursive-h">Maj.<br><span class="gt-col-sub">Cursive</span></th>
							<th class="gt-cursive-h">Min.<br><span class="gt-col-sub">Cursive</span></th>
						</tr>
						</thead>
						<tbody>
							<tr>
								<td class="gt-cell gt-serif">А</td>
								<td class="gt-cell gt-serif">а</td>
								<td class="gt-cell gt-serif-it">А</td>
								<td class="gt-cell gt-serif-it">а</td>
								<td class="gt-cell gt-sans">А</td>
								<td class="gt-cell gt-sans">а</td>
								<td class="gt-cell gt-sans-obl">А</td>
								<td class="gt-cell gt-sans-obl">а</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Б</td>
								<td class="gt-cell gt-serif">б</td>
								<td class="gt-cell gt-serif-it">Б</td>
								<td class="gt-cell gt-serif-it">б</td>
								<td class="gt-cell gt-sans">Б</td>
								<td class="gt-cell gt-sans">б</td>
								<td class="gt-cell gt-sans-obl">Б</td>
								<td class="gt-cell gt-sans-obl">б</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">В</td>
								<td class="gt-cell gt-serif">в</td>
								<td class="gt-cell gt-serif-it">В</td>
								<td class="gt-cell gt-serif-it">в</td>
								<td class="gt-cell gt-sans">В</td>
								<td class="gt-cell gt-sans">в</td>
								<td class="gt-cell gt-sans-obl">В</td>
								<td class="gt-cell gt-sans-obl">в</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Г</td>
								<td class="gt-cell gt-serif">г</td>
								<td class="gt-cell gt-serif-it">Г</td>
								<td class="gt-cell gt-serif-it gt-hi">г</td>
								<td class="gt-cell gt-sans">Г</td>
								<td class="gt-cell gt-sans">г</td>
								<td class="gt-cell gt-sans-obl">Г</td>
								<td class="gt-cell gt-sans-obl gt-hi">г</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Д</td>
								<td class="gt-cell gt-serif">д</td>
								<td class="gt-cell gt-serif-it">Д</td>
								<td class="gt-cell gt-serif-it">д</td>
								<td class="gt-cell gt-sans">Д</td>
								<td class="gt-cell gt-sans">д</td>
								<td class="gt-cell gt-sans-obl">Д</td>
								<td class="gt-cell gt-sans-obl">д</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive gt-hi">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Е</td>
								<td class="gt-cell gt-serif">е</td>
								<td class="gt-cell gt-serif-it">Е</td>
								<td class="gt-cell gt-serif-it">е</td>
								<td class="gt-cell gt-sans">Е</td>
								<td class="gt-cell gt-sans">е</td>
								<td class="gt-cell gt-sans-obl">Е</td>
								<td class="gt-cell gt-sans-obl">е</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ё</td>
								<td class="gt-cell gt-serif">ё</td>
								<td class="gt-cell gt-serif-it">Ё</td>
								<td class="gt-cell gt-serif-it">ё</td>
								<td class="gt-cell gt-sans">Ё</td>
								<td class="gt-cell gt-sans">ё</td>
								<td class="gt-cell gt-sans-obl">Ё</td>
								<td class="gt-cell gt-sans-obl">ё</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ж</td>
								<td class="gt-cell gt-serif">ж</td>
								<td class="gt-cell gt-serif-it">Ж</td>
								<td class="gt-cell gt-serif-it">ж</td>
								<td class="gt-cell gt-sans">Ж</td>
								<td class="gt-cell gt-sans">ж</td>
								<td class="gt-cell gt-sans-obl">Ж</td>
								<td class="gt-cell gt-sans-obl">ж</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">З</td>
								<td class="gt-cell gt-serif">з</td>
								<td class="gt-cell gt-serif-it">З</td>
								<td class="gt-cell gt-serif-it">з</td>
								<td class="gt-cell gt-sans">З</td>
								<td class="gt-cell gt-sans">з</td>
								<td class="gt-cell gt-sans-obl">З</td>
								<td class="gt-cell gt-sans-obl">з</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">И</td>
								<td class="gt-cell gt-serif">и</td>
								<td class="gt-cell gt-serif-it">И</td>
								<td class="gt-cell gt-serif-it">и</td>
								<td class="gt-cell gt-sans">И</td>
								<td class="gt-cell gt-sans">и</td>
								<td class="gt-cell gt-sans-obl">И</td>
								<td class="gt-cell gt-sans-obl">и</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Й</td>
								<td class="gt-cell gt-serif">й</td>
								<td class="gt-cell gt-serif-it">Й</td>
								<td class="gt-cell gt-serif-it">й</td>
								<td class="gt-cell gt-sans">Й</td>
								<td class="gt-cell gt-sans">й</td>
								<td class="gt-cell gt-sans-obl">Й</td>
								<td class="gt-cell gt-sans-obl">й</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">К</td>
								<td class="gt-cell gt-serif">к</td>
								<td class="gt-cell gt-serif-it">К</td>
								<td class="gt-cell gt-serif-it">к</td>
								<td class="gt-cell gt-sans">К</td>
								<td class="gt-cell gt-sans">к</td>
								<td class="gt-cell gt-sans-obl">К</td>
								<td class="gt-cell gt-sans-obl">к</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Л</td>
								<td class="gt-cell gt-serif">л</td>
								<td class="gt-cell gt-serif-it">Л</td>
								<td class="gt-cell gt-serif-it">л</td>
								<td class="gt-cell gt-sans">Л</td>
								<td class="gt-cell gt-sans">л</td>
								<td class="gt-cell gt-sans-obl">Л</td>
								<td class="gt-cell gt-sans-obl">л</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">М</td>
								<td class="gt-cell gt-serif">м</td>
								<td class="gt-cell gt-serif-it">М</td>
								<td class="gt-cell gt-serif-it">м</td>
								<td class="gt-cell gt-sans">М</td>
								<td class="gt-cell gt-sans">м</td>
								<td class="gt-cell gt-sans-obl">М</td>
								<td class="gt-cell gt-sans-obl">м</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Н</td>
								<td class="gt-cell gt-serif">н</td>
								<td class="gt-cell gt-serif-it">Н</td>
								<td class="gt-cell gt-serif-it">н</td>
								<td class="gt-cell gt-sans">Н</td>
								<td class="gt-cell gt-sans">н</td>
								<td class="gt-cell gt-sans-obl">Н</td>
								<td class="gt-cell gt-sans-obl">н</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">О</td>
								<td class="gt-cell gt-serif">о</td>
								<td class="gt-cell gt-serif-it">О</td>
								<td class="gt-cell gt-serif-it">о</td>
								<td class="gt-cell gt-sans">О</td>
								<td class="gt-cell gt-sans">о</td>
								<td class="gt-cell gt-sans-obl">О</td>
								<td class="gt-cell gt-sans-obl">о</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">П</td>
								<td class="gt-cell gt-serif gt-hi">п</td>
								<td class="gt-cell gt-serif-it">П</td>
								<td class="gt-cell gt-serif-it">п</td>
								<td class="gt-cell gt-sans">П</td>
								<td class="gt-cell gt-sans gt-hi">п</td>
								<td class="gt-cell gt-sans-obl">П</td>
								<td class="gt-cell gt-sans-obl">п</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Р</td>
								<td class="gt-cell gt-serif">р</td>
								<td class="gt-cell gt-serif-it">Р</td>
								<td class="gt-cell gt-serif-it">р</td>
								<td class="gt-cell gt-sans">Р</td>
								<td class="gt-cell gt-sans">р</td>
								<td class="gt-cell gt-sans-obl">Р</td>
								<td class="gt-cell gt-sans-obl">р</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">С</td>
								<td class="gt-cell gt-serif">с</td>
								<td class="gt-cell gt-serif-it">С</td>
								<td class="gt-cell gt-serif-it">с</td>
								<td class="gt-cell gt-sans">С</td>
								<td class="gt-cell gt-sans">с</td>
								<td class="gt-cell gt-sans-obl">С</td>
								<td class="gt-cell gt-sans-obl">с</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Т</td>
								<td class="gt-cell gt-serif">т</td>
								<td class="gt-cell gt-serif-it">Т</td>
								<td class="gt-cell gt-serif-it gt-hi">т</td>
								<td class="gt-cell gt-sans">Т</td>
								<td class="gt-cell gt-sans">т</td>
								<td class="gt-cell gt-sans-obl">Т</td>
								<td class="gt-cell gt-sans-obl gt-hi">т</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">У</td>
								<td class="gt-cell gt-serif">у</td>
								<td class="gt-cell gt-serif-it">У</td>
								<td class="gt-cell gt-serif-it">у</td>
								<td class="gt-cell gt-sans">У</td>
								<td class="gt-cell gt-sans">у</td>
								<td class="gt-cell gt-sans-obl">У</td>
								<td class="gt-cell gt-sans-obl">у</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ф</td>
								<td class="gt-cell gt-serif">ф</td>
								<td class="gt-cell gt-serif-it">Ф</td>
								<td class="gt-cell gt-serif-it">ф</td>
								<td class="gt-cell gt-sans">Ф</td>
								<td class="gt-cell gt-sans">ф</td>
								<td class="gt-cell gt-sans-obl">Ф</td>
								<td class="gt-cell gt-sans-obl">ф</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Х</td>
								<td class="gt-cell gt-serif">х</td>
								<td class="gt-cell gt-serif-it">Х</td>
								<td class="gt-cell gt-serif-it">х</td>
								<td class="gt-cell gt-sans">Х</td>
								<td class="gt-cell gt-sans">х</td>
								<td class="gt-cell gt-sans-obl">Х</td>
								<td class="gt-cell gt-sans-obl">х</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ц</td>
								<td class="gt-cell gt-serif">ц</td>
								<td class="gt-cell gt-serif-it">Ц</td>
								<td class="gt-cell gt-serif-it">ц</td>
								<td class="gt-cell gt-sans">Ц</td>
								<td class="gt-cell gt-sans">ц</td>
								<td class="gt-cell gt-sans-obl">Ц</td>
								<td class="gt-cell gt-sans-obl">ц</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ч</td>
								<td class="gt-cell gt-serif">ч</td>
								<td class="gt-cell gt-serif-it">Ч</td>
								<td class="gt-cell gt-serif-it">ч</td>
								<td class="gt-cell gt-sans">Ч</td>
								<td class="gt-cell gt-sans">ч</td>
								<td class="gt-cell gt-sans-obl">Ч</td>
								<td class="gt-cell gt-sans-obl">ч</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ш</td>
								<td class="gt-cell gt-serif">ш</td>
								<td class="gt-cell gt-serif-it">Ш</td>
								<td class="gt-cell gt-serif-it">ш</td>
								<td class="gt-cell gt-sans">Ш</td>
								<td class="gt-cell gt-sans">ш</td>
								<td class="gt-cell gt-sans-obl">Ш</td>
								<td class="gt-cell gt-sans-obl">ш</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Щ</td>
								<td class="gt-cell gt-serif">щ</td>
								<td class="gt-cell gt-serif-it">Щ</td>
								<td class="gt-cell gt-serif-it">щ</td>
								<td class="gt-cell gt-sans">Щ</td>
								<td class="gt-cell gt-sans">щ</td>
								<td class="gt-cell gt-sans-obl">Щ</td>
								<td class="gt-cell gt-sans-obl">щ</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ъ</td>
								<td class="gt-cell gt-serif">ъ</td>
								<td class="gt-cell gt-serif-it">Ъ</td>
								<td class="gt-cell gt-serif-it">ъ</td>
								<td class="gt-cell gt-sans">Ъ</td>
								<td class="gt-cell gt-sans">ъ</td>
								<td class="gt-cell gt-sans-obl">Ъ</td>
								<td class="gt-cell gt-sans-obl">ъ</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ы</td>
								<td class="gt-cell gt-serif">ы</td>
								<td class="gt-cell gt-serif-it">Ы</td>
								<td class="gt-cell gt-serif-it">ы</td>
								<td class="gt-cell gt-sans">Ы</td>
								<td class="gt-cell gt-sans">ы</td>
								<td class="gt-cell gt-sans-obl">Ы</td>
								<td class="gt-cell gt-sans-obl">ы</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ь</td>
								<td class="gt-cell gt-serif">ь</td>
								<td class="gt-cell gt-serif-it">Ь</td>
								<td class="gt-cell gt-serif-it">ь</td>
								<td class="gt-cell gt-sans">Ь</td>
								<td class="gt-cell gt-sans">ь</td>
								<td class="gt-cell gt-sans-obl">Ь</td>
								<td class="gt-cell gt-sans-obl">ь</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Э</td>
								<td class="gt-cell gt-serif">э</td>
								<td class="gt-cell gt-serif-it">Э</td>
								<td class="gt-cell gt-serif-it">э</td>
								<td class="gt-cell gt-sans">Э</td>
								<td class="gt-cell gt-sans">э</td>
								<td class="gt-cell gt-sans-obl">Э</td>
								<td class="gt-cell gt-sans-obl">э</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ю</td>
								<td class="gt-cell gt-serif">ю</td>
								<td class="gt-cell gt-serif-it">Ю</td>
								<td class="gt-cell gt-serif-it">ю</td>
								<td class="gt-cell gt-sans">Ю</td>
								<td class="gt-cell gt-sans">ю</td>
								<td class="gt-cell gt-sans-obl">Ю</td>
								<td class="gt-cell gt-sans-obl">ю</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Я</td>
								<td class="gt-cell gt-serif">я</td>
								<td class="gt-cell gt-serif-it">Я</td>
								<td class="gt-cell gt-serif-it">я</td>
								<td class="gt-cell gt-sans">Я</td>
								<td class="gt-cell gt-sans">я</td>
								<td class="gt-cell gt-sans-obl">Я</td>
								<td class="gt-cell gt-sans-obl">я</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr class="gt-divider">
								<td colspan="10">Lettres obsolètes (avant 1917)</td>
							</tr>
							<tr class="gt-obsolete">
								<td class="gt-cell gt-serif">Ѣ</td>
								<td class="gt-cell gt-serif">ѣ</td>
								<td class="gt-cell gt-serif-it">Ѣ</td>
								<td class="gt-cell gt-serif-it gt-hi">ѣ</td>
								<td class="gt-cell gt-sans">Ѣ</td>
								<td class="gt-cell gt-sans">ѣ</td>
								<td class="gt-cell gt-sans-obl">Ѣ</td>
								<td class="gt-cell gt-sans-obl">ѣ</td>
								<td class="gt-cell gt-cursive gt-null">—</td>
								<td class="gt-cell gt-cursive gt-null">—</td>
							</tr>
							<tr class="gt-obsolete">
								<td class="gt-cell gt-serif">Ѳ</td>
								<td class="gt-cell gt-serif">ѳ</td>
								<td class="gt-cell gt-serif-it">Ѳ</td>
								<td class="gt-cell gt-serif-it">ѳ</td>
								<td class="gt-cell gt-sans">Ѳ</td>
								<td class="gt-cell gt-sans">ѳ</td>
								<td class="gt-cell gt-sans-obl">Ѳ</td>
								<td class="gt-cell gt-sans-obl">ѳ</td>
								<td class="gt-cell gt-cursive gt-null">—</td>
								<td class="gt-cell gt-cursive gt-null">—</td>
							</tr>
							<tr class="gt-obsolete">
								<td class="gt-cell gt-serif">І</td>
								<td class="gt-cell gt-serif">і</td>
								<td class="gt-cell gt-serif-it">І</td>
								<td class="gt-cell gt-serif-it">і</td>
								<td class="gt-cell gt-sans">І</td>
								<td class="gt-cell gt-sans">і</td>
								<td class="gt-cell gt-sans-obl">І</td>
								<td class="gt-cell gt-sans-obl">і</td>
								<td class="gt-cell gt-cursive gt-null">—</td>
								<td class="gt-cell gt-cursive gt-null">—</td>
							</tr>
							<tr class="gt-obsolete">
								<td class="gt-cell gt-serif">Ѵ</td>
								<td class="gt-cell gt-serif">ѵ</td>
								<td class="gt-cell gt-serif-it">Ѵ</td>
								<td class="gt-cell gt-serif-it">ѵ</td>
								<td class="gt-cell gt-sans">Ѵ</td>
								<td class="gt-cell gt-sans">ѵ</td>
								<td class="gt-cell gt-sans-obl">Ѵ</td>
								<td class="gt-cell gt-sans-obl">ѵ</td>
								<td class="gt-cell gt-cursive gt-null">—</td>
								<td class="gt-cell gt-cursive gt-null">—</td>
							</tr>
						</tbody>
						</table>
						</div>



						<p>La raison de présenter chaque lettre sous plusieurs formes est de garantir que, peu importe où vous rencontreriez une lettre, vous pourriez la reconnaître. Les chanteurs rencontrent le cyrillique dans les partitions imprimées (souvent en sérif), dans les éditions contemporaines (souvent en sans sérif), dans les ressources savantes (souvent en italique), et occasionnellement dans des annotations manuscrites ou des manuscrits historiques (cursive). Remarquez à quel point certaines formes de lettres changent radicalement entre les versions régulière, italique et cursive.</p>

						<h4 id="learn-u1-try">Essayez</h4>

						<p>Ouvrez l'onglet Transcription d'<em>Ilya</em> et collez un court texte russe. Vous pourriez essayer l'ouverture de «&nbsp;Где ты, звёздочка?&nbsp;» de Moussorgski ou quelques vers de n'importe quelle mélodie de votre répertoire.</p>

						<p>Observez les trois lignes qu'<em>Ilya</em> produit : API, cyrillique et glose de traduction. Vous pouvez déjà commencer à faire correspondre ce que vous voyez dans la ligne API aux ancrages que vous venez d'apprendre ici. Certaines lettres se seront transformées : un ⟨О⟩ non accentué peut apparaître comme <code>[ʌ]</code> plutôt que le <code>[o]</code> que vous avez rencontré dans le tableau ci-dessus. Une consonne devant ⟨Е⟩ peut porter un marqueur de palatalisation, <code>[ʲ]</code>, qui n'était pas encore démontré dans l'ancrage.</p>

						<p>Ces transformations font l'objet des Sections 2 à 7. Pour l'instant, remarquez tout simplement que l'alphabet cyrillique russe est fini, et pourtant l'API vous est familier. <em>Ilya</em> peut vous montrer exactement ce qu'il fait à chaque lettre. Le reste de LEÇONS vous enseigne pourquoi.</p>

						<p><em>Sources :</em> Craig M. Grayson, «&nbsp;Russian Lyric Diction&nbsp;» (thèse de doctorat, University of Washington, 2012), ch. 2, annexes B et D. Ken Griffiths, Russian Alphabet Song, arr. Dann Mitton (2017). Irena Yanushevskaya et Daniel Bunčić, «&nbsp;Russian,&nbsp;» <em>Journal of the International Phonetic Association</em> 45/2 (2015).</p>

						<h3 id="learn-unit-2">Section 2 · L'accent tonique</h3>

						<p><strong>Ici, c'est l'accent qui gouverne chaque son.</strong></p>

						<p>En italien, l'accent tombe presque toujours sur la syllabe pénultième. En français, il se pose sur la dernière syllabe du groupe rythmique. Ni l'anglais ni le russe ne nous offrent cette régularité. L'accent tonique russe est lexical : il doit être appris mot par mot, vérifié mot par mot, et il peut se déplacer lorsqu'un mot change de forme grammaticale. C'est le fait le plus déterminant de la prononciation russe pour les chanteurs. Et c'est la raison pour laquelle <em>Ilya</em> intègre un dictionnaire de près d'un million d'entrées plutôt que de tenter de dériver l'accent à partir de règles.</p>

						<p>Selon la manière dont l'accent les affecte, nous pouvons classer les voyelles russes en trois catégories. Cette classification gouverne l'ensemble des Sections 3 et 4 :</p>

						<table>
						<thead><tr><th>Catégorie</th><th>Voyelles</th><th>Comportement</th></tr></thead>
						<tbody>
						<tr><td>Non affectées par l'accent</td><td>/u/ (⟨у⟩ ou ⟨ю⟩), /i/ (⟨и⟩) et /ɨ/ (⟨ы⟩)</td><td>Qualité identique, accentuées ou non.</td></tr>
						<tr><td>Accent uniquement</td><td>/o/ (⟨о⟩, ⟨ё⟩) et /ɛ/ (⟨э⟩, ⟨е⟩)</td><td>N'apparaissent que dans les syllabes accentuées. Sans accent, elles se réduisent à des sons entièrement différents.</td></tr>
						<tr><td>Accent et position</td><td>/ɑ/ (⟨а⟩, ⟨я⟩)</td><td>La qualité varie selon l'accent et selon la position de la syllabe par rapport à l'accent.</td></tr>
						</tbody>
						</table>

						<p>Trois voyelles traversent l'accent sans être altérées. Deux n'existent que sous l'accent. Une répond à la fois à l'accent et à la distance qui l'en sépare. Ces catégories ne sont pas arbitraires; elles sont hiérarchiques, et la syllabe accentuée les gouverne.</p>

						<h4 id="learn-u2-meaning">L'accent change le sens.</h4>

						<p>Le russe possède de véritables homographes : des mots de graphie identique dont la prononciation et le sens changent selon la syllabe qui porte l'accent.</p>

						<table>
						<thead><tr><th>Mot</th><th>Position de l'accent</th><th>API</th><th>Sens</th></tr></thead>
						<tbody>
						<tr><td>⟨мука⟩</td><td>му́ка (première syllabe)</td><td><code>/ˈmu kɑ/</code></td><td>farine</td></tr>
						<tr><td>⟨мука⟩</td><td>мука́ (deuxième syllabe)</td><td><code>/mu ˈkɑ/</code></td><td>tourment</td></tr>
						<tr><td>⟨стоит⟩</td><td>сто́ит (première syllabe)</td><td><code>/ˈsto it/</code></td><td>coûte</td></tr>
						<tr><td>⟨стоит⟩</td><td>стои́т (deuxième syllabe)</td><td><code>/stɑ ˈit/</code></td><td>se tient debout</td></tr>
						<tr><td>⟨уже⟩</td><td>у́же (première syllabe)</td><td><code>/ˈu ʒɨ/</code></td><td>plus étroit</td></tr>
						<tr><td>⟨уже⟩</td><td>уже́ (deuxième syllabe)</td><td><code>/u ˈʒɛ/</code></td><td>déjà</td></tr>
						</tbody>
						</table>

						<p>Ce ne sont pas des cas marginaux. Les chanteurs rencontrent des homographes dans le répertoire courant, et un accent mal placé produit un autre mot. Dans ⟨мука⟩, l'accent détermine à lui seul si le chanteur déplore un tourment ou parle de pâtisserie.</p>

						<h4 id="learn-u2-moves">L'accent se déplace.</h4>

						<p>Un même mot peut déplacer son accent d'une forme grammaticale à l'autre. Le substantif ⟨вода⟩ (eau) en offre un exemple :</p>

						<table>
						<thead><tr><th>Forme</th><th>Accent</th><th>API</th></tr></thead>
						<tbody>
						<tr><td>вода́ (nominatif singulier)</td><td>final</td><td><code>/vʌ ˈdɑ/</code></td></tr>
						<tr><td>во́ды (génitif singulier)</td><td>initial</td><td><code>/ˈvo dɨ/</code></td></tr>
						<tr><td>во́ду (accusatif singulier)</td><td>initial</td><td><code>/ˈvo du/</code></td></tr>
						</tbody>
						</table>

						<p>La voyelle ⟨о⟩ de la première syllabe sonne de manière tout à fait différente selon la forme rencontrée : <code>/ʌ/</code> lorsqu'elle est inaccentuée, <code>/o/</code> lorsqu'elle porte l'accent. Grayson identifie sept schémas d'accentuation distincts pour les seuls substantifs russes, auxquels s'ajoutent des schémas supplémentaires pour les verbes et leurs dérivés. Le chanteur n'a pas besoin de maîtriser cette grammaire. Il a besoin de savoir qu'elle existe, de sorte que lorsque l'accent d'un mot paraît inhabituel dans un cas oblique ou une forme conjuguée, le réflexe soit de vérifier plutôt que de deviner.</p>

						<h4 id="learn-u2-dictionary">L'accent est un problème de dictionnaire.</h4>

						<p>Des schémas existent, certes, mais les exceptions sont si nombreuses qu'une attribution fiable de l'accent exige bel et bien la consultation d'un dictionnaire. C'est le conseil pratique de Grayson, et il valide la conception <em>d'Ilya</em> : le moteur résout l'accent par un dictionnaire de 943 096 entrées, et non par des règles de dérivation. Comme l'observe Baytukalov : «&nbsp;Believe me, it's a lot of rules&nbsp;» («&nbsp;Croyez-moi, les règles sont nombreuses&nbsp;»). La responsabilité du chanteur est de vérifier l'accent auprès d'une source fiable, et non nécessairement de mémoriser les règles qui le gouvernent.</p>

						<p>Lorsqu'<em>Ilya</em> rencontre un homographe, il sélectionne la première de plusieurs possibilités, qu'elle soit juste ou non. L'utilisateur doit choisir le bon homographe à l'aide d'indices contextuels ou d'une consultation externe. Lorsqu'<em>Ilya</em> rencontre un mot absent de son dictionnaire, il le signale pour attribution manuelle par un encadré À VÉRIFIER en pointillés. Dans les deux cas, le principe est le même : l'accent est trop déterminant pour être laissé à l'inférence.</p>

						<h4 id="learn-u2-sounds">Comment l'accent sonne.</h4>

						<p>En chant, nous communiquons l'accent par l'intensité et l'engagement articulatoire, et non par la durée, qui nous est prescrite. Le compositeur écrit un rythme; le chanteur ne peut prolonger une syllabe accentuée au-delà de ce que la valeur de note permet. Mais même dans les passages legato où toutes les syllabes reçoivent un son soutenu, la syllabe accentuée porte un investissement physique plus grand : une voyelle plus engagée, une cible articulatoire plus nette, un noyau sonore plus brillant, et peut-être un peu plus d'intensité par comparaison avec les notes voisines. En russe chanté, les syllabes inaccentuées servent l'accent.</p>

						<h4 id="learn-u2-try">Essayez dans Ilya.</h4>

						<p>Collez ⟨стоит⟩ dans l'onglet Transcription. Assignez l'accent à la première syllabe, puis à la deuxième. Observez le changement dans la ligne API. Les voyelles se transforment : non pas parce que les lettres ont changé, mais parce que l'accent seul s'est déplacé. Cette transformation est le sujet des Sections 3 et 4.</p>

						<h4 id="learn-u2-yo">Repérer le ⟨ё⟩ manquant.</h4>

						<p>Les imprimeurs russes omettent couramment le tréma de ⟨ё⟩, l'imprimant comme ⟨е⟩. Puisque ⟨ё⟩ porte toujours l'accent et produit toujours <code>/o/</code>, un tréma manquant peut silencieusement déplacer l'accent et modifier la qualité vocalique d'un mot. Grayson identifie ceci comme la source d'erreur de prononciation la plus fréquente chez les chanteurs non natifs. <em>Ilya</em> restaure automatiquement ⟨ё⟩ à partir de son dictionnaire et signale la restauration par le sigle ё, mais le chanteur gagne à savoir reconnaitre les suffixes courants où ⟨ё⟩ se dissimule&#160;:</p>

						<table>
						<thead><tr><th>Suffixe</th><th>Exemple</th><th>Sens</th></tr></thead>
						<tbody>
						<tr><td>-ёнок (diminutif)</td><td>котёнок</td><td>chaton</td></tr>
						<tr><td>-ёр (agent, origine française)</td><td>актёр</td><td>acteur</td></tr>
						<tr><td>-ённ- (participe passé passif)</td><td>увлечённый</td><td>captivé</td></tr>
						</tbody>
						</table>

						<p>La paire d'homographes la plus fréquente dans la mélodie est <strong>всё</strong> <code>/fsʲo/</code> (tout) face à <strong>все</strong> <code>/fsʲɛ/</code> (tous). Le tréma seul distingue le sens et la qualité vocalique. En cas de doute, consultez le dictionnaire&#8239;; lorsqu'<em>Ilya</em> affiche le sigle ё, faites-lui confiance.</p>

						<p><em>Source Grayson : ch. 7 (Syllabic Stress, pp. 263–273), ch. 2 (pp. 65–66), ch. 8 §1 (pp. 274–278). Baytukalov cité dans Grayson p. 273.</em></p>


						<h3 id="learn-unit-3">Section 3 · Les voyelles accentuées</h3>

						<p id="learn-u3-inventory"><strong>Ce sont les voyelles accentuées qui constituent les cibles.</strong></p>

						<p>Lorsqu'une voyelle russe porte l'accent, elle sonne comme elle-même, comme l'on attend. Ce sont les sons vocaliques cardinaux stables — ceux sur lesquels le chanteur peut compter avant que quoi que ce soit ne se transforme. La plupart de ces voyelles russes nous sont déjà familières grâce à l'italien, au français et à l'allemand. Apprenez ceux-ci d'abord&#8239;; tout ce qui suit dans les Sections 4&#160;à&#160;7 est une transformation de ce que vous entendez ici.</p>

						<p>Le russe chanté possède six voyelles accentuées&#160;:</p>

						<table>
							<thead>
								<tr>
									<th>API</th>
									<th>Cyrillique</th>
									<th>Formation</th>
									<th>Ce que vous connaissez déjà</th>
								</tr>
							</thead>
							<tbody>
								<tr><td><code>/ɑ/</code></td><td>⟨а⟩, ⟨я⟩</td><td>Ouverte postérieure, mi-langue</td><td>Comme «&#160;pâte&#160;» ou «&#160;âme&#160;». La voyelle par défaut du russe chanté pour ⟨а⟩.</td></tr>
								<tr><td><code>/o/</code></td><td>⟨о⟩, ⟨ё⟩</td><td>Langue basse du /ɔ/ ouvert, lèvres arrondies du /o/ fermé, avec une chute audible en position finale [oːʌ̯]</td><td>Entre le <em>o</em> ouvert italien et le <em>o</em> fermé allemand, mais sans la tension de l'un ou de l'autre. Nulle part près du /ɔ/ français de <em>sauvage</em>.</td></tr>
								<tr><td><code>/ɛ/</code></td><td>⟨э⟩, ⟨е⟩</td><td>Mi-ouverte antérieure</td><td>Le /ɛ/ français de <em>fête</em>, le <em>e</em> ouvert italien de <em>bello</em>.</td></tr>
								<tr><td><code>/i/</code></td><td>⟨и⟩</td><td>Fermée antérieure</td><td>Le même /i/ en italien, en français, en allemand et en anglais (<em>see</em>).</td></tr>
								<tr><td><code>/u/</code></td><td>⟨у⟩, ⟨ю⟩</td><td>Fermée postérieure arrondie, stable, langue haute en arrière</td><td>Le /u/ italien de <em>luna</em>. Le /u/ français de <em>toujours</em>. Pas de diphtongue.</td></tr>
								<tr><td><code>[ɨ]</code></td><td>⟨ы⟩</td><td>Version vélarisée de /i/&#160;: langue entre les positions /i/ et /u/, lèvres non arrondies</td><td>Aucun analogue proche. Le seul son véritablement nouveau pour de nombreux chanteurs.</td></tr>
							</tbody>
						</table>

						<p>Cinq de ces six sons sont de vieilles connaissances. Le sixième, [ɨ], mérite qu'on s'y attarde. C'est une version vélarisée de /i/, appelée <em>i vélaire</em> (<em>velar-i</em>)&#160;: l'avant de la langue maintient la position du /i/ tandis que l'arrière de la langue monte vers le vélum. Les lèvres restent non arrondies. Ce n'est <em>pas</em> pharyngal — le point de contact se situe à la transition entre le palais dur et le palais mou, pas plus en arrière vers la luette. Grayson note la parenté étroite du vélaire-i avec le ⟨л⟩ sombre (lui aussi étant vélaire) ([ɫ]), qui occupe le même espace vélarisé. Une seule règle gouverne [ɨ]&#160;: il n'apparaît qu'après une consonne non palatalisée (dure). Après une consonne palatalisée, la même lettre ⟨и⟩ produit le /i/ attendu.</p>

						<p>Un mot sur le /o/. Grayson décrit le /o/ russe comme une légère diphtongue idiomatique [oːʌ] — la voyelle se relâche vers [ʌ] — et après des consonnes labiales, un [ʷoːʌ] labialisé, mais cette spécificité ne se note jamais. Grayson le simplifie en /o/ dans toutes ses transcriptions, et <em>Ilya</em> suit cette convention. Le chanteur doit savoir que le /o/ russe est beaucoup plus détendu que le /o/ fermé allemand ou français, et beaucoup plus arrondi que le /ɔ/ ouvert italien, tout en restant loin du /ɔ/ semi-ouvert français (celui de «&#160;<em>sauvage</em>&#160;»). Il vit entre ces voisins.</p>

						<h4 id="learn-u3-interpalatal">Deux voyelles changent de couleur au voisinage des consonnes molles.</h4>

						<p>Sous certaines conditions, la langue avance et une voyelle accentuée change de couleur. Grayson décrit ce déplacement comme une antériorisation&#8239;; voici notre cadre pour reconnaître quand elle se produit.</p>

						<p><strong>Trois chemins vers [e]</strong></p>

						<p>Le [e] fermé (proche du /e/ français, légèrement plus détendu) remplace le /ɛ/ ouvert sous trois conditions. Toutes trois partagent la même exigence de fermeture&#160;: la consonne <em>suivante</em> doit être palatalisée. Ce qui diffère, c'est l'environnement précédent.</p>

						<table>
							<thead>
								<tr>
									<th>Chemin</th>
									<th>Précédent</th>
									<th>Suivant</th>
									<th>Exemple</th>
								</tr>
							</thead>
							<tbody>
								<tr><td>Interpalatal</td><td>Consonne palatalisée</td><td>Consonne palatalisée</td><td>дверь /dʲvʲ<strong>e</strong>rʲ/</td></tr>
								<tr><td>Toujours dure</td><td>⟨ж⟩, ⟨ш⟩ ou ⟨ц⟩</td><td>Consonne palatalisée</td><td>шесть /ʃ<strong>e</strong>sʲtʲ/</td></tr>
								<tr><td>⟨э⟩ initial</td><td>∅ (début de mot)</td><td>Consonne palatalisée</td><td>эти /<strong>e</strong>tʲi/</td></tr>
							</tbody>
						</table>

						<p>La logique&#160;: ⟨е⟩ est une lettre indicatrice (sois-dit un agent palatalisateur) — elle palatalise toute consonne régulière qui la précède. Les seules consonnes qui peuvent précéder ⟨е⟩ en restant dures sont ⟨ж⟩, ⟨ш⟩ et ⟨ц⟩, parce que ces trois consonnes rejettent inhéremment la palatalisation. L'espace complet des environnements précédents pour ⟨е⟩ se réduit donc à exactement deux&#160;: palatalisé, ou l'un des trois consonnes toujours dures. La lettre ⟨э⟩ ne palatalise pas la consonne qui la précède. Son seul chemin vers [e] est en début de mot, sans rien devant. Un phonème ([e]), deux lettres (⟨е⟩ ou ⟨э⟩), trois conditions précédentes (consonne palatalisée, consonne toujours dure, ou rien), une seule condition de fermeture commune (une consonne palatalisée).</p>

						<p>Les contre-exemples confirment la règle. Lorsque la consonne suivante est dure, la voyelle reste ouverte&#160;: шест /ʃɛst/ (/st/ dur suit), дверка /dʲvʲɛr kɑ/ (/k/ dur suit).</p>

						<p><strong>Un seul chemin vers [a]</strong></p>

						<p>Le rare [a] antériorisé (proche du /a/ français antérieur, mi-langue légèrement relevée) remplace le /ɑ/ ouvert postérieur sous une seule condition&#160;: un environnement véritablement interpalatal. Des agents palatalisateurs doivent encadrer (se trouver des <em>deux</em> côtés de) la voyelle accentuée.</p>

						<table>
							<thead>
								<tr>
									<th>Précédent</th>
									<th>Voyelle</th>
									<th>Suivant</th>
									<th>Exemple</th>
								</tr>
							</thead>
							<tbody>
								<tr><td>Consonne palatalisée (y compris ⟨ч⟩, ⟨щ⟩)</td><td>⟨а⟩ ou ⟨я⟩ accentué → [a]</td><td>Consonne palatalisée</td><td>пять /pʲ<strong>a</strong>tʲ/, мяч /mʲ<strong>a</strong>tʃʲ/</td></tr>
							</tbody>
						</table>

						<p>Contre-exemple&#160;: пятый /ˈpʲɑ tɨj/ (<em>cinquième</em>). La consonne précédente est palatalisée (/pʲ/), mais la consonne suivante est dure (/t/). Un côté mou, un côté dur&#160;: la voyelle reste à /ɑ/. De même, мать /mɑtʲ/ (<em>mère</em>)&#160;: le /m/ précédent est dur, donc malgré le /tʲ/ mou qui suit, la voyelle demeure /ɑ/. Comparez мяч /mʲatʃʲ/ (balle), où les deux côtés sont mous, avec мать /mɑtʲ/ (mère), où un seul l'est&#160;: la voyelle vous le dit.</p>

						<h4 id="learn-u3-iotated">Quatre lettres vocaliques portent une consonne cachée.</h4>

						<p>Les lettres ⟨я⟩, ⟨е⟩, ⟨ё⟩ et ⟨ю⟩ sont appelées <em>voyelles iotées</em>. Lorsqu'elles occupent trois positions spécifiques (début de mot, après une autre voyelle, ou après un signe, ⟨ъ⟩ ou ⟨ь⟩) — elles introduisent un glide en [j] avant la voyelle&#160;:</p>

						<table>
							<thead>
								<tr>
									<th>Lettre</th>
									<th>Cluster ioté (accentué)</th>
									<th>Le glide en [j] +</th>
								</tr>
							</thead>
							<tbody>
								<tr><td>⟨я⟩</td><td>[jɑ]</td><td>le /ɑ/ que le chanteur connaît déjà</td></tr>
								<tr><td>⟨е⟩</td><td>[jɛ]</td><td>le /ɛ/ que le chanteur connaît déjà</td></tr>
								<tr><td>⟨ё⟩</td><td>[jo]</td><td>le /o/ que le chanteur connaît déjà</td></tr>
								<tr><td>⟨ю⟩</td><td>[ju]</td><td>le /u/ que le chanteur connaît déjà</td></tr>
							</tbody>
						</table>

						<p>Le glide en [j] est le son du <em>y</em> anglais dans <em>yellow</em>, ou du <em>y</em> français dans <em>yeux</em>&#160;: voisé, bref, non soutenu. À noter&#160;: les Russes considèrent /j/ comme une consonne palatalisée, et non une semi-voyelle comme en français. Après le glide, la voyelle est exactement celle qui apparaît dans le tableau d'inventaire ci-dessus — aucun son nouveau, juste un préfixe consonantique.</p>

						<p>Lorsque ces mêmes lettres apparaissent après une consonne (et non après une voyelle, un signe, ou en début de mot), elles ne produisent pas de glide en [j]. Elles signalent plutôt que la consonne précédente est palatalisée, et ne contribuent que la voyelle. C'est le système que Grayson appelle <em>indicator letters</em> (lettres indicatrices, ou bien <em>agents de palatalisation</em>)&#160;: ⟨я⟩, ⟨е⟩, ⟨ё⟩, ⟨ю⟩ indiquent «&#160;quelque chose de palatalisé précède la voyelle.&#160;»</p>

						<p>Les règles d'antériorisation s'appliquent également aux voyelles iotées. Lorsqu'un ⟨я⟩ accentué en position de cluster ioté est suivi d'un phonème palatalisé, le résultat est [ja] plutôt que [jɑ]. Lorsqu'un ⟨е⟩ accentué en position de cluster ioté est suivi d'un phonème palatalisé, le résultat est [je] plutôt que [jɛ].</p>

						<h4 id="learn-u3-yo">⟨ё⟩ est toujours accentué.</h4>

						<p>De toutes les voyelles russes, ⟨ё⟩ est la seule dont l'accent est absolument garanti. Lorsque ⟨ё⟩ apparaît dans un mot, cette syllabe porte toujours l'accent sans faute. Le son est toujours /o/ (après une consonne palatalisée) ou /jo/ (en début de mot, après une voyelle, ou après un signe). Grayson exclut explicitement /ɔ/ comme option de notation pour le /o/ chanté en russe — ⟨ё⟩ produit /o/, pas /ɔ/.</p>

						<p>Parce que les imprimeurs russes omettent couramment le tréma, imprimant ⟨е⟩ là où ⟨ё⟩ devrait figurer, <em>Ilya</em> la restaure automatiquement à partir de son dictionnaire, et signale la restauration avec le sigle ё. Lorsque vous voyez ce sigle, <em>Ilya</em> a identifié un mot où le ⟨е⟩ imprimé est en réalité un ⟨ё⟩ — et la qualité vocalique est lue comme /o/ au lieu de /ɛ/.</p>

						<h4 id="learn-u3-try">Essayez dans Ilya.</h4>

						<p>Transcrivez <strong>шесть</strong> et <strong>шест</strong>. Les deux commencent par ⟨ш⟩ + ⟨е⟩, mais шесть est suivi d'un cluster mou (⟨сть⟩ → /sʲtʲ/) et produit [e]. шест est suivi d'un cluster dur (⟨ст⟩ → /st/) et reste à /ɛ/. Le chemin de la consonne toujours dure vers [e] à l'œuvre — même lettre, voisin différent, couleur différente.</p>

						<h3 id="learn-unit-4">Section 4 · La réduction vocalique</h3>

						<p><strong>Lorsqu’une voyelle perd l’accent, elle se transforme.</strong></p>

						<p>Le russe est une langue à rythme accentuel, comme l’anglais. Il se déroule en une série de syllabes accentuées et inaccentuées, où l’intervalle entre les syllabes accentuées reste à peu près constant, tandis que les syllabes inaccentuées s’accommodent de ces pulsations régulières en se comprimant entre elles et en perdant leur spécificité vocalique. Cette perte de spécificité s’appelle la réduction vocalique. La voyelle perd sa distinction par rapport à sa valeur cardinale par défaut, dérivant vers un son plus centralisé et moins engagé. En russe chanté, le compositeur prescrit les durées rythmiques, de sorte que la compression temporelle évidente d’une langue à rythme accentuel dans la parole spontanée ne peut pas se manifester&#160;: elle est contrôlée par le rythme et la vitesse de la mélodie. Mais en tant que conteurs, la réduction qualitative de la prosodie parlée continue d’éclairer notre approche des textes russes chantés. La diction lyrique préserve davantage de qualité vocalique pour le chant que la parole, mais le principe demeure&#160;: une voyelle inaccentuée n’a pas le même son défini qu’a une voyelle accentuée.</p>

						<p>La Section 3 a établi les six cibles vocaliques accentuées&#160;: <code>/ɑ/</code>, <code>/ɛ/</code>, <code>/i/</code>, <code>/o/</code>, <code>/u/</code> et <code>[ɨ]</code>. Trois d’entre elles — <code>/i/</code>, <code>/u/</code> et <code>[ɨ]</code> — traversent l’accent sans changer&#160;: elles conservent leur son cardinal, qu’elles soient accentuées ou non. Voilà qui rassurera ceux d’entre nous qui aspirent à des règles fiables en russe chanté. Les trois restantes, et les plus fréquentes — <code>/ɑ/</code>, <code>/ɛ/</code> et <code>/o/</code> — se transforment lorsqu’elles perdent l’accent. La nature précise de la transformation dépend de deux facteurs&#160;: l’identité de la lettre vocalique au départ, et sa proximité par rapport à la syllabe accentuée.</p>

						<p>Nous cataloguons cinq sons vocaliques inaccentués en russe chanté&#160;:</p>

						<table>
						<thead><tr><th>API</th><th>Source</th><th>Ce que cela sonne</th></tr></thead>
						<tbody>
						<tr><td><code>/ɑ/</code></td><td>⟨а⟩ ou ⟨о⟩ inaccentué en position privilégiée</td><td>La même voyelle ouverte postérieure de la Section 3, mais sans l’engagement articulatoire de l’accent.</td></tr>
						<tr><td><code>[ʌ]</code></td><td>⟨а⟩ ou ⟨о⟩ inaccentué en position éloignée</td><td>Une voyelle centralisée, détendue&#8239;; c’est le schwa du russe chanté&#160;: plus postérieur que le <code>[ə]</code> français, sans arrondissement labial. Grayson note ce son <code>[ʌ]</code> plutôt que <code>[ə]</code> précisément pour éviter que les chanteurs formés en diction française n’arrondissent les lèvres. <code>[ʌ]</code> n’apparaît jamais en position accentuée&#160;: il signale toujours une réduction.</td></tr>
						<tr><td><code>[ɪ]</code></td><td>⟨е⟩ ou ⟨я⟩ inaccentué après une consonne palatalisée</td><td>Une version relaxée et centralisée de /i/. La seule voyelle de l’inventaire de Grayson sans référence cardinale sur le quadrilatère vocalique de Jones. <code>[ɪ]</code> n’apparaît jamais en position accentuée&#160;: il signale toujours une réduction.</td></tr>
						<tr><td><code>/i/</code></td><td>⟨е⟩ ou ⟨я⟩ inaccentué en environnement interpalatal</td><td>Le /i/ complet de la Section 3, antériorisé par les consonnes palatalisées environnantes.</td></tr>
						<tr><td><code>[ɨ]</code></td><td>⟨е⟩ inaccentué après une consonne toujours dure (⟨ж⟩, ⟨ш⟩, ⟨ц⟩)</td><td>Le même i vélaire de la Section 3. Ces consonnes rejettent la palatalisation&#8239;; la voyelle se vélarise au lieu de se réduire à <code>[ɪ]</code>.</td></tr>
						</tbody>
						</table>

						<p>Deux processus gouvernent ces réductions. La phonologie russe les nomme <em>akanié</em> /ˈɑ kʌ ɲe/ et <em>ikanié</em> /ˈi kʌ ɲe/.</p>

						<h4 id="learn-u4-akanye">⟨о⟩ et ⟨а⟩ suivent des chemins différents sans accent.</h4>

						<p>L’akanié est le processus par lequel ⟨о⟩ et ⟨а⟩ inaccentués se réduisent. Le mot lui-même vient de la lettre ⟨а⟩&#160;: en russe chanté, lorsque ⟨о⟩ perd l’accent, il commence à sonner comme ⟨а⟩. Mais ces deux lettres ne se réduisent pas de façon symétrique. Leurs chemins divergent en une position critique&#160;: la syllabe immédiatement après l’accent.</p>

						<table>
						<thead><tr><th>Position par rapport à l’accent</th><th>⟨о⟩</th><th>⟨а⟩</th></tr></thead>
						<tbody>
						<tr><td>Accentuée</td><td><code>/o/</code></td><td><code>/ɑ/</code></td></tr>
						<tr><td>Immédiatement avant l’accent</td><td><code>/ɑ/</code></td><td><code>/ɑ/</code></td></tr>
						<tr><td>Immédiatement après l’accent</td><td><code>[ʌ]</code></td><td><code>/ɑ/</code></td></tr>
						<tr><td>Deux syllabes ou plus avant l’accent</td><td><code>[ʌ]</code></td><td><code>[ʌ]</code></td></tr>
						<tr><td>Deux syllabes ou plus après l’accent</td><td><code>[ʌ]</code></td><td><code>[ʌ]</code></td></tr>
						<tr><td>Initiale de mot (toute distance)</td><td><code>/ɑ/</code></td><td><code>/ɑ/</code></td></tr>
						</tbody>
						</table>

						<p>L’asymétrie se trouve à la troisième ligne. Immédiatement après l’accent, ⟨о⟩ se réduit à <code>[ʌ]</code>, tandis que ⟨а⟩ tient à <code>/ɑ/</code>. Le raisonnement de Grayson est auditif et sémantique&#160;: la différence entre <code>/ɑ/</code> et <code>[ʌ]</code> dans cette position aide l’auditeur à distinguer les deux lettres vocaliques sous-jacentes, ce qui lui permet de comprendre la différence entre des formes casuelles comme ⟨блюдо⟩ <code>/ˈblʲu dʌ/</code> (un plat) et ⟨блюда⟩ <code>/ˈblʲu dɑ/</code> (des plats), où la voyelle post-accentuelle porte à elle seule la différence grammaticale (Grayson, p. 266, n. 306). Partout ailleurs, les chemins convergent.</p>

						<p>Voici une exception qui prévaut sur tout. Chaque fois que ⟨а⟩ ou ⟨о⟩ inaccentué est la première lettre du mot, la voyelle se lit <code>/ɑ/</code> quelle que soit sa distance par rapport à l’accent. Le mot ⟨огонь⟩ <code>/ɑ ˈɡoɲ/</code> (feu) le démontre : le ⟨о⟩ initial se trouve à deux syllabes de l’accent, une position qui produirait normalement <code>[ʌ]</code>, et pourtant il tient à <code>/ɑ/</code> parce qu’il est en début de mot.</p>

						<p>Le mot ⟨хорошо⟩ (bien) illustre la chaîne complète de l’akanié en un seul mot. Trois ⟨о⟩ identiques, trois prononciations différentes&#160;: <code>/xʌ rɑ ˈʃo/</code>. Le premier ⟨о⟩, éloigné, se réduit à <code>[ʌ]</code>. Le ⟨о⟩ immédiatement pré-accentuel tient à <code>/ɑ/</code>. Le ⟨о⟩ final accentué sonne <code>/o/</code>.</p>

						<h4 id="learn-u4-ikanye">⟨е⟩ et ⟨я⟩ se réduisent vers [ɪ].</h4>

						<p>L’ikanié est le processus parallèle pour les voyelles qui se trouvent en environnement interpalatal, où la voyelle est prise en sandwich entre deux agents palatalisateurs. Les voyelles ⟨е⟩ et ⟨я⟩ se réduisent toutes deux à <code>[ɪ]</code>. Contrairement à l’akanié, où la position par rapport à l’accent crée une hiérarchie, l’ikanié est plus simple&#160;: ces deux voyelles orthographiques se réduisent à <code>[ɪ]</code> dans toute position inaccentuée. Le mot ⟨весна⟩ <code>/vʲɪ ˈsnɑ/</code> (printemps) le démontre : le ⟨е⟩ inaccentué après le ⟨в⟩ palatalisé se réduit à <code>[ɪ]</code>.</p>

						<p>Deux raffinements qualifient cette règle&#160;:</p>

						<table>
						<thead><tr><th>Condition</th><th>Résultat</th><th>Pourquoi</th></tr></thead>
						<tbody>
						<tr><td>Après une consonne toujours dure (⟨ж⟩, ⟨ш⟩, ⟨ц⟩)</td><td><code>[ɨ]</code>, et non <code>[ɪ]</code></td><td>Les trois consonnes de l’ensemble toujours dur ne peuvent pas se palataliser. La voyelle se vélarise pour s’accorder à l’environnement consonantique dur.</td></tr>
						<tr><td>Interpalatale (palatalisée des deux côtés)</td><td><code>/i/</code>, et non <code>[ɪ]</code></td><td>Les consonnes palatalisées environnantes antériorisent la voyelle réduite complètement vers /i/. Le mot ⟨тебе⟩ <code>/tʲi ˈbʲɛ/</code> (à toi) le démontre : le ⟨е⟩ inaccentué se réduit d’abord, puis s’antériorise en <code>/i/</code> parce qu’il se trouve entre deux consonnes palatalisées.</td></tr>
						</tbody>
						</table>

						<p>Les voyelles iotées (⟨е⟩, ⟨ё⟩, ⟨ю⟩ et ⟨я⟩) suivent la même logique. ⟨я⟩ inaccentué en position de cluster ioté (début de mot, après une voyelle ou après un signe) produit <code>[jɪ]</code>&#8239;; en position interpalatale, il s’antériorisera vers <code>[ji]</code>. Grayson est explicite&#160;: le cluster réduit <code>[jʌ]</code> doit être évité en russe chanté.</p>

						<h4 id="learn-u4-reconstitution">La reconstitution est un choix éclairé, non une obligation.</h4>

						<p>La reconstitution est la décision d’annuler la réduction complète, ou de ramener une voyelle réduite vers sa valeur non réduite. En chant, où les valeurs de note peuvent soutenir une voyelle bien au-delà de sa durée parlée, un son pleinement réduit peut sembler trop informel pour être chanté comme valeur vocalique soutenue dans la livraison d’un texte poétique. La reconstitution offre au chanteur une option raisonnée pour restaurer la formalité et la distinction vocalique sans abandonner le système phonologique de Grayson.</p>

						<p>Le processus inverse la chaîne de réduction entièrement pour la plupart des voyelles, mais seulement partiellement pour ⟨о⟩&#160;:</p>

						<table>
						<thead><tr><th>Son réduit</th><th>Se reconstitue en</th><th>Ne se reconstitue pas en</th></tr></thead>
						<tbody>
						<tr><td><code>[ʌ]</code> (de ⟨а⟩ ou ⟨о⟩)</td><td><code>/ɑ/</code></td><td>/o/ — la porte vers /o/ est à sens unique</td></tr>
						<tr><td><code>[ɪ]</code> (de ⟨е⟩)</td><td><code>/ɛ/</code></td><td>—</td></tr>
						<tr><td><code>[ɪ]</code> (de ⟨я⟩)</td><td><code>/ɑ/</code></td><td>—</td></tr>
						<tr><td><code>[jɪ]</code> (de ⟨я⟩ en cluster ioté)</td><td><code>/jɑ/</code></td><td>—</td></tr>
						<tr><td><code>[jɪ]</code> (de ⟨е⟩ en cluster ioté)</td><td><code>/jɛ/</code></td><td>—</td></tr>
						<tr><td><code>[ɨ]</code> (après une consonne toujours dure)</td><td>Ne se reconstitue pas</td><td>—</td></tr>
						</tbody>
						</table>

						<p>La porte à sens unique est la contrainte la plus importante. Lorsque <code>[ʌ]</code> se reconstitue, il revient à <code>/ɑ/</code>, jamais à <code>/o/</code>. La réduction de <code>/o/</code> à <code>/ɑ/</code> efface l’arrondissement&#8239;; la reconstitution ne peut restaurer ce que l’akanié a retiré. Grayson affirme que <code>[ɨ]</code> après les consonnes toujours dures ne se reconstitue pas du tout&#160;: l’environnement vélarisé est fixe.</p>

						<blockquote class="learn-callout">
						<p><strong>Un point de désaccord respectueux, de la part de Dann.</strong></p>
						<p>Grayson écrit que «&#160;⟨и⟩ read as [ɨ] (stressed or unstressed) and unstressed ⟨е⟩ read as [ɨ] after a hard consonant (on long or short notes), remain sung as [ɨ]&#160;» (« ⟨и⟩ lu [ɨ] (accentué ou non) et ⟨е⟩ inaccentué lu [ɨ] après une consonne dure (sur des notes longues ou courtes), restent chantés [ɨ] ») (p. 129). Cette phrase contient deux affirmations, et à mon avis, elles ne sont pas équivalentes.</p>
						<p>La première affirmation est juste. Lorsque ⟨и⟩ suit une consonne dure, le [ɨ] qui en résulte n’est pas une réduction&#160;: c’est l’identité de la voyelle dans cet environnement. Les russophones savent et comprennent que dans ce cas ⟨и⟩ se prononce [ɨ], ou peut-être pouvons-nous comprendre que [ɨ] s’écrit ⟨и⟩ dans ce cas&#8239;; cela revient au même. Il n’y a pas de voyelle source vers laquelle reconstituer, c’est simplement la voyelle traditionnelle qui s’exécute dans cette circonstance, reconnaissant que [ɨ] doit suivre une consonne non palatalisée, jamais [i]. La consonne dure impose l’expression du i vélaire. Je suis d’accord avec Grayson ici&#8239;; la reconstitution ne s’applique pas.</p>
						<p>Je crois que sa seconde affirmation mérite qu’on en réfléchisse. Lorsque ⟨е⟩ inaccentué suit l’une des consonnes toujours dures (⟨ж⟩, ⟨ш⟩, ⟨ц⟩) pour produire [ɨ], la voyelle sous-jacente est /ɛ/. /ɛ/ se réduit pour devenir [ɨ] dans ce cas, et par conséquent la logique de la reconstitution devrait rester disponible. J’affirme que sur des notes tenues ou dans des tempi plus lents, le chanteur peut reconstituer vers [ɛ]. D’après mon expérience, les locuteurs natifs russes et les coaches préconisent systématiquement ce choix. Le Dʳ Alexei Kochetov, locuteur natif russe et phonéticien à l’Université de Toronto, a offert précisément cette note sur mon exécution de l’Op. 52, nº 2 de Kabalevsky&#160;: «&#160;[toj ʒɨ] should probably be [toj ʒɛ] (with no reduction)&#160;» («&#160;[toj ʒɨ] devrait probablement être [toj ʒɛ] (sans réduction)&#160;»).</p>
						<p>Un point de vue articulatoire peut-il soutenir la reconstitution dans ce cas&#160;? Les postures linguales de [ɛ] et des consonnes toujours dures [ʃ], [ʒ] et [ts] occupent le même voisinage médian&#8239;; [ɛ] n’est pas assez antériorisé pour imposer un conflit. Ce n’est pas analogue à la tentative de produire /i/ après une consonne dure, où l’antériorisation contredit véritablement l’environnement consonantique.</p>
						<p>C’est le seul point sur lequel <em>Ilya</em> s’écarte des règles de reconstitution de Grayson. Lorsque le basculeur de reconstitution est actif, ⟨е⟩ inaccentué après une consonne toujours dure se reconstitue en [ɛ]. Néanmoins, si vous n’êtes pas d’accord avec moi et souhaitez observer l’engagement de Grayson envers l’inviolabilité de [ɨ] dans ce cas, vous pouvez cliquer sur la case «&#160;Réduction ponctuelle&#160;» sous la pile de mots dans le panneau, et votre [ɨ] réapparaîtra dûment.</p>
						</blockquote>

						<p>Le moment de reconstituer est une question de contexte et de goût. Une note brève sur un temps faible dans un tempo vif peut accueillir la réduction complète. Une note tenue sur un temps fort dans un tempo lent peut appeler la reconstitution. Les Russes semblent attendre moins de réduction dans la déclamation de textes poétiques, comme un moyen de distinguer l’art du discours quotidien. La meilleure confirmation vient d’un coach russe natif&#8239;; Ilya offre les deux options par le biais du basculeur de reconstitution, afin que le chanteur puisse comparer les deux lectures et faire un choix éclairé.</p>

						<h4 id="learn-u4-try">Essayez dans Ilya.</h4>

						<p>Transcrivez ⟨хорошо⟩. Trois ⟨о⟩ identiques produisent trois sons différents&#160;: <code>[ʌ]</code>, <code>/ɑ/</code>, <code>/o/</code>. Activez ensuite la reconstitution&#160;: le <code>[ʌ]</code> éloigné revient à <code>/ɑ/</code>, mais aucune voyelle inaccentuée ne revient à <code>/o/</code>. La porte à sens unique à l’œuvre.</p>

						<p>Essayez ensuite ⟨жена⟩ (une épouse). Sans reconstitution, le ⟨е⟩ inaccentué après le ⟨ж⟩ toujours dur apparaît comme <code>[ɨ]</code>. Dans le panneau du tiroir, sous Notation, activez la reconstitution globale, et <em>Ilya</em> le restaure en <code>[ɛ]</code> — l’écart par rapport à Grayson décrit ci-dessus. Quels que soient vos paramètres globaux, si vous préférez la règle originale de Grayson, vous pouvez cliquer sur «&#160;Réduction ponctuelle&#160;» ou «&#160;Reconstitution ponctuelle&#160;» sous la pile de mots dans le tiroir (ces intitulés répondent contextuellement à vos paramètres globaux), et votre <code>[ɨ]</code> réapparaîtra dûment.</p>

						<p><em>Source Grayson&#160;: ch. 3 §§3, 5, 7–8 (pp. 97–129), ch. 7 §1 (pp. 263–267). Tableau de reconstitution&#160;: p. 128, note p. 129. Différenciation auditive des formes casuelles&#160;: p. 266, n. 306. Cadre accentuel&#160;: Mitton (thèse, §4.5). Note de Kochetov&#160;: communication personnelle, soutenance de récital DMA, Université de Toronto.</em></p>

						<h3 id="learn-unit-5">Section 5 · Les consonnes</h3>

						<p>Le russe compte vingt-et-une lettres consonantiques. Bonne nouvelle&#160;: la majorité de ces consonnes produisent des sons que le chanteur connaît déjà de l’anglais, de l’italien, de l’allemand ou du français. Quelques-unes exigent un ajustement, et seule une poignée est véritablement nouvelle. Nous commençons par le familier, puis concentrons notre attention sur ce qui ne l’est pas.</p>

						<p>Une différence systématique gouverne l’inventaire entier. Alors que les consonnes anglaises sont typiquement alvéolaires (la langue touche la crête située derrière les dents supérieures), les consonnes russes sont dentales&#160;: la pointe de la langue touche le dos des dents supérieures elles-mêmes, comme en italien. Les chanteurs formés en diction italienne ou française ont déjà intériorisé cet ajustement. Ceux qui viennent de l’anglais ou de l’allemand constateront qu’avancer consciemment la langue de quelques millimètres produit la clarté caractéristique de l’articulation consonantique russe.</p>

						<h4 id="learn-u5-familiar">Dans quelle mesure le système consonantique russe est-il familier&#160;?</h4>

						<p>De ce sous-ensemble de vingt-et-une lettres consonantiques, treize produisent des sons essentiellement identiques à des consonnes que le chanteur connaît de l’italien ou d’une autre langue de diction standard&#160;: ⟨б⟩, ⟨в⟩, ⟨г⟩, ⟨д⟩, ⟨з⟩, ⟨й⟩, ⟨к⟩, ⟨м⟩, ⟨н⟩, ⟨п⟩, ⟨с⟩, ⟨т⟩, ⟨ф⟩. Deux autres sont assez proches pour qu’une brève remarque suffise&#160;: ⟨р⟩ (roulez-le légèrement) et ⟨ж⟩ (les chanteurs francophones l’ont déjà). Nous distinguons le ⟨х⟩ du russe chanté de l’<em>achlaut</em> allemand («&#160;uvulaire&#160;»), <code>[χ]</code>). Les cinq restantes exigent une attention ciblée et sont présentées dans le tableau ci-dessous.</p>

						<table>
						<thead><tr><th>Lettre</th><th>Nom</th><th>API</th><th>Équivalent le plus proche</th><th>Notes</th></tr></thead>
						<tbody>
						<tr><td>⟨б⟩</td><td>бэ</td><td><code>/b/</code></td><td><code>/b/</code> italien dans <em>bene</em> («&#160;bien&#160;»)</td><td>Occlusion complète, sans souffle</td></tr>
						<tr><td>⟨в⟩</td><td>вэ</td><td><code>/v/</code></td><td><code>/v/</code> italien dans <em>vino</em> («&#160;vin&#160;»)</td><td>Pression d’air plus légère qu’en anglais&#8239;; pleinement voisé</td></tr>
						<tr><td>⟨г⟩</td><td>гэ</td><td><code>/ɡ/</code></td><td><code>/ɡ/</code> italien dans <em>gamba</em> («&#160;jambe&#160;»)</td><td>Occlusive vélaire voisée, sans relâchement d’air</td></tr>
						<tr><td>⟨д⟩</td><td>дэ</td><td><code>/d/</code></td><td><code>/d/</code> italien dans <em>donna</em> («&#160;femme&#160;»)</td><td>Dentale, sans relâchement fort</td></tr>
						<tr><td>⟨ж⟩</td><td>жэ</td><td><code>/ʒ/</code></td><td><code>/ʒ/</code> français dans <em>je</em></td><td>Timbre sombre&#160;; langue en louche. Toujours dure</td></tr>
						<tr><td>⟨з⟩</td><td>зэ</td><td><code>/z/</code></td><td><code>/z/</code> allemand voisé dans <em>See</em> («&#160;lac&#160;»)</td><td>Timbre riche et bourdonnant</td></tr>
						<tr><td>⟨й⟩</td><td>и краткое</td><td><code>/j/</code></td><td><code>/j/</code> anglais dans <em>yes</em> («&#160;oui&#160;»)</td><td>Voisé, non soutenu</td></tr>
						<tr><td>⟨к⟩</td><td>ка</td><td><code>/k/</code></td><td><code>/k/</code> italien dans <em>casa</em> («&#160;maison&#160;»)</td><td>Sans souffle aspiré</td></tr>
						<tr><td>⟨л⟩</td><td>эль</td><td><code>/ɫ/</code> ou <code>/lʲ/</code></td><td>Voir «&#160;Les deux sons du ⟨л⟩ russe&#160;» ci-dessous</td><td>Deux réalisations fondamentalement différentes</td></tr>
						<tr><td>⟨м⟩</td><td>эм</td><td><code>/m/</code></td><td>Identique dans les langues européennes</td><td>Nasale, voisée</td></tr>
						<tr><td>⟨н⟩</td><td>эн</td><td><code>/n/</code></td><td><code>/n/</code> dental italien</td><td>Placement dental</td></tr>
						<tr><td>⟨п⟩</td><td>пэ</td><td><code>/p/</code></td><td><code>/p/</code> italien dans <em>padre</em> («&#160;père&#160;»)</td><td>Occlusive sans relâchement, sans souffle</td></tr>
						<tr><td>⟨р⟩</td><td>эр</td><td><code>/r/</code></td><td><code>/r/</code> roulé italien</td><td>Toujours légèrement roulé en chant&#160;; un roulement italien excessif sonnera comme une caricature en russe</td></tr>
						<tr><td>⟨с⟩</td><td>эс</td><td><code>/s/</code></td><td><code>/s/</code> dans <em>see</em> («&#160;voir&#160;»)</td><td>Milieu de langue bas&#160;; timbre plus sombre qu’en anglais</td></tr>
						<tr><td>⟨т⟩</td><td>тэ</td><td><code>/t/</code></td><td><code>/t/</code> italien dans <em>terra</em> («&#160;terre&#160;»)</td><td>Dentale, sans relâchement fort</td></tr>
						<tr><td>⟨ф⟩</td><td>эф</td><td><code>/f/</code></td><td>Identique dans les langues européennes</td><td>Rare dans les mots russes natifs</td></tr>
						<tr><td>⟨х⟩</td><td>ха</td><td><code>/x/</code></td><td><em>achlaut</em> allemand («&#160;uvulaire&#160;») dans <em>Bach</em></td><td>Fricative vélaire. Pas un <code>/k/</code></td></tr>
						<tr><td>⟨ц⟩</td><td>цэ</td><td><code>/ts/</code></td><td><code>/ts/</code> allemand dans <em>Katze</em> («&#160;chat&#160;»)</td><td>Un phonème unique. Toujours dure</td></tr>
						<tr><td>⟨ч⟩</td><td>чэ</td><td><code>/tʃʲ/</code></td><td><code>/tʃ/</code> italien dans <em>ciao</em> («&#160;salut&#160;»), palatalisé</td><td>Un phonème unique. Toujours molle</td></tr>
						<tr><td>⟨ш⟩</td><td>ша</td><td><code>/ʃ/</code></td><td><code>/ʃ/</code> anglais dans <em>she</em> («&#160;elle&#160;»)</td><td>Plus sombre qu’en anglais. Toujours dure</td></tr>
						<tr><td>⟨щ⟩</td><td>ща</td><td><code>/ʃʲʃʲ/</code></td><td>Pas d’équivalent proche</td><td>Double longueur palatalisée. Toujours molle</td></tr>
						</tbody>
						</table>

						<h4 id="learn-u5-pairs">Quelles consonnes forment des paires voisées et non voisées&#160;?</h4>

						<p>Les consonnes russes s’organisent en paires systématiques qui partagent la même articulation mais diffèrent par leur voisement. Le chanteur formé en diction allemande comprend déjà ce principe&#160;: une consonne voisée et sa partenaire non voisée préparent des configurations identiques du conduit vocal, sauf que l’une fait vibrer les cordes vocales (voisée) et l’autre non (non voisée).</p>

						<p>Ces paires prennent toute leur importance à la Section 7, où nous abordons l’assimilation de voisement (une consonne non voisée devenant voisée devant une voisine voisée, ou vice versa), en plus du dévoisement final (une consonne voisée perdant son voisement à la fin d’un mot, comme en allemand). Retenez ces paires.</p>

						<table>
						<thead><tr><th>Voisée</th><th>Lettre</th><th>Non voisée</th><th>Lettre</th></tr></thead>
						<tbody>
						<tr><td><code>/b/</code></td><td>⟨б⟩</td><td><code>/p/</code></td><td>⟨п⟩</td></tr>
						<tr><td><code>/v/</code></td><td>⟨в⟩</td><td><code>/f/</code></td><td>⟨ф⟩</td></tr>
						<tr><td><code>/ɡ/</code></td><td>⟨г⟩</td><td><code>/k/</code></td><td>⟨к⟩</td></tr>
						<tr><td><code>/d/</code></td><td>⟨д⟩</td><td><code>/t/</code></td><td>⟨т⟩</td></tr>
						<tr><td><code>/ʒ/</code></td><td>⟨ж⟩</td><td><code>/ʃ/</code></td><td>⟨ш⟩</td></tr>
						<tr><td><code>/z/</code></td><td>⟨з⟩</td><td><code>/s/</code></td><td>⟨с⟩</td></tr>
						</tbody>
						</table>

						<p>Dans le russe chanté, quatre consonnes existent en dehors du système d’appariement. Les sonantes (<code>/l/</code>, <code>/m/</code>, <code>/n/</code>, <code>/r/</code>) sont toujours voisées et ne se dévoisent jamais, même à la fin d’un mot. En plus, ces quatre sonantes sont exemptées de l’assimilation de voisement&#160;: elles ne la provoquent pas et n’en sont pas affectées. Le glide <code>/j/</code> ⟨й⟩, que les Russes considèrent comme une consonne palatalisée, est similairement exempt.</p>

						<p>L’affriquée <code>/ts/</code> (⟨ц⟩) et l’affriquée palatalisée <code>/tʃʲ/</code> (⟨ч⟩) partagent deux traits uniques&#160;: ni l’une ni l’autre n’est notée ici avec son propre symbole API dédié. L’une s’écrit comme un digraphe indivisible, l’autre comme un trigraphe. Toutes deux possèdent des contreparties voisées qui n’apparaissent que par assimilation à la frontière du mot, mais jamais au travers d’un glyphe orthographique qui leur est propre. Contrairement à ces deux sons, la fricative <code>/ʃʲʃʲ/</code> se voit attribuer sa propre lettre, ⟨щ⟩. Les formes voisées allophoniques de ces lettres sont traitées à la Section 7.</p>

						<h4 id="learn-u5-attention">Quels sons exigent l’attention ciblée du chanteur&#160;?</h4>

						<h5 id="learn-u5-l">Les deux sons du ⟨л⟩ russe</h5>

						<p>La lettre ⟨л⟩ peut produire deux sons fondamentalement différents, selon le contexte.</p>

						<ol>
						<li><strong>L vélaire <code>[ɫ]</code>, dit l-dur.</strong> Devant une consonne dure, devant ⟨а⟩, ⟨о⟩, ⟨э⟩, ⟨у⟩, ⟨ы⟩, ou à la fin d’un mot sans signe mou, ⟨л⟩ est sombre&#160;: l vélaire, <code>/ɫ/</code>, la latérale dentale vélarisée.</li>
						<li><strong>L palatalisé</strong>, dit l-doux. Devant une consonne molle, devant ⟨я⟩, ⟨е⟩, ⟨ё⟩, ⟨ю⟩, ⟨и⟩, ou devant le signe mou ⟨ь⟩, ⟨л⟩ est clair&#160;: <code>/lʲ/</code>, la latérale palatalisée. Au sein des groupes consonantiques, seul le phonème l-vélaire <code>/ɫ/</code> est employé. Réciproquement, le phonème l-palatalisé <code>/lʲ/</code> ne se présente devant aucune autre consonne palatalisée que lui-même (c’est-à-dire dans le groupe isolé <code>/lʲlʲ/</code>).</li>
						</ol>

						<p>On ne trouvera pas le <code>[l]</code> simple comme symbole autonome dans le système de Grayson&#160;: il sera toujours accompagné soit du tilde médian pour indiquer la vélarisation (<code>[ɫ]</code>), soit d’un marqueur de palatalisation (<code>[lʲ]</code>). L’exception est le plus rare des emprunts&#160;: <em>tremolo</em> («&#160;trémolo&#160;»), (tr<code>ɛ</code> mo lo).</p>

						<p>Le l-vélaire <code>/ɫ/</code> est ce que Grayson appelle «&#160;the only unpalatalized Russian consonant that does not have a familiar, coincident phoneme&#160;» («&#160;la seule consonne russe non palatalisée qui ne possède pas de phonème familier et coïncident&#160;») dans les langues européennes. C’est peut-être vrai au sens le plus strict, mais les anglophones nord-américains connaissent bien l’allophone du <code>/l/</code> dans le mot <em>tall</em> («&#160;grand&#160;»), et celui-ci approxime le l-vélaire russe (<code>[ɫ]</code>) suffisamment pour le chant. Il est vélarisé&#160;: la pointe de la langue touche les dents supérieures (comme pour toute consonne dentale), mais le dos de la langue s’élève simultanément pour entrer en contact avec l’avant du voile du palais, à la transition entre le palais dur et le palais mou. Le son résultant possède une qualité peut-être apparentée au i-vélaire russe <code>/ɨ/</code>.</p>

						<p>Pour obtenir <code>/ɫ/</code>&#160;: placez la langue dans la position du <code>/l/</code> dental italien. En maintenant cette position, prononcez la syllabe absurde «&#160;gou&#160;» et sentez le dos de la langue monter. Maintenez ce contact arrière et tentez le prénom anglais <em>Luke</em>. Le résultat devrait approximer лук <code>/ɫuk/</code> («&#160;oignon&#160;» ou «&#160;arc&#160;»).</p>

						<p>«&#160;Though the Russian <code>/lʲ/</code>-phoneme is similar to the Italian <code>[ʎ]</code>-allophone (as in the word <em>gli</em>), there is a major difference in the articulation between the two. The Italian <code>[ʎ]</code>-allophone is actually fricative; the laterally escaping air causes a friction or vibration between the sides of the tongue and the back molars. This produces the idiomatic, Italian, lateral lisp-like sound. In Russian, there is no friction, thus the sides of the tongue are sealed against the back molars and do not leak any air. The air actually passes around the base of the tongue and comes up from the well of the lower teeth. The Russian <code>/lʲ/</code> should be liquid (sonorant), not “lisping” (fricative).&#160;» (Grayson, p. 184)</p>

						<p>«&#160;Bien que le phonème russe <code>/lʲ/</code> ressemble à l’allophone italien <code>[ʎ]</code> (comme dans le mot <em>gli</em>), il existe une différence majeure d’articulation. L’allophone italien <code>[ʎ]</code> est en réalité fricatif&#160;: l’air s’échappant latéralement provoque une friction ou une vibration entre les côtés de la langue et les dernières molaires. Ceci produit le son italien idiomatique, latéral et zézayant. En russe, il n’y a pas de friction&#160;: les côtés de la langue sont scellés contre les dernières molaires et ne laissent passer aucun air. L’air passe en réalité autour de la base de la langue et remonte du puits des dents inférieures. Le <code>/lʲ/</code> russe devrait être liquide (sonant), non zézayant (fricatif).&#160;»</p>

						<h5 id="learn-u5-x">⟨х⟩&#160;: la fricative vélaire</h5>

						<p>Les chanteurs formés en diction allemande savent produire <code>/χ/</code> pour l’<em>achlaut</em> («&#160;uvulaire&#160;»). Le <code>/x/</code> russe s’en approche, bien que Grayson note qu’il est «&#160;articulated on the front of the velum&#160;» («&#160;articulé sur l’avant du voile du palais&#160;») plutôt que plus en arrière. Les consonnes vélaires <code>[k]</code> et <code>[ɡ]</code> se forment toutes deux par contact entre la base de la langue et le palais mou&#160;; de même, <code>[x]</code> et sa partenaire voisée <code>[ɣ]</code> se forment au même endroit. Au fur et à mesure que vous alternez entre occlusion et friction au palais mou, variez le voisement et le dévoisement pour maîtriser ces quatre consonnes spécifiquement localisées, et pour affiner la capacité à distinguer votre <code>[x]</code> de votre <code>[χ]</code>.</p>

						<h5 id="learn-u5-r">⟨р⟩&#160;: le roulement</h5>

						<p>Le <code>/r/</code> russe est toujours légèrement roulé en chant. Dans la parole courante, un <code>/r/</code> initial ou interne peut n’être que frappé, mais en diction lyrique un roulement léger est attendu. La longueur du roulement varie selon la position (plus court en début de mot, plus long en finale) et selon l’intention expressive, mais davantage n’est pas mieux. Évitez de ressembler à une caricature italienne en cultivant un roulement léger.</p>

						<h5 id="learn-u5-hushers">Les chuintantes&#160;: ⟨ж⟩, ⟨ш⟩ et ⟨щ⟩</h5>

						<p>⟨ж⟩ et ⟨ш⟩ forment une paire voisée-non voisée. Toutes deux se produisent avec une langue caractéristiquement en forme de louche&#160;: la pointe se recourbe légèrement et l’air passe en dessous, produisant un timbre sombre et large, bien différent du «&#160;ch&#160;» français ou du <em>sh</em> anglais («&#160;ch&#160;»). Les chanteurs francophones reconnaîtront ⟨ж⟩ de <em>je</em>, <em>jour</em>, <em>rouge</em>.</p>

						<p>⟨щ⟩ se distingue. Là où ⟨ш⟩ est une fricative courte unique, ⟨щ⟩ est une fricative palatalisée de double longueur&#160;: <code>/ʃʲʃʲ/</code>. Grayson préfère la notation <code>/ʃʲʃʲ/</code> à <code>/ʃʲː/</code> parce que les locuteurs russes tendent à réarticuler ce son plutôt qu’à simplement le soutenir. La prononciation moscovite <code>/ʃʲʃʲ/</code> est la norme en diction lyrique&#160;; une variante pétersbourgeoise plus ancienne <code>/ʃʲtʃʲ/</code> peut se rencontrer dans certaines références, mais n’est pas ce qu’Ilya produit. Les apprenants non natifs peuvent se concentrer sur une différence de hauteur pour distinguer les deux&#160;: ⟨ш⟩ <code>[ʃ]</code> est un son grave et chaud, tandis que ⟨щ⟩ <code>/ʃʲʃʲ/</code> sonne plus aigu et d’une certaine façon plus rapide. La cause en est la forme de la langue. Pour ⟨ш⟩ <code>[ʃ]</code> la langue est plate ou en forme de louche, tandis que pour ⟨щ⟩ <code>/ʃʲʃʲ/</code> la langue prend la forme de la voyelle <code>[i]</code>, forçant l’air sortant à traverser une ouverture plus étroite, élevant la perception de la hauteur. Davantage sur les voyelles palatalisées plus loin.</p>

						<h5 id="learn-u5-affricates">Les affriquées&#160;: ⟨ц⟩ et ⟨ч⟩</h5>

						<p>⟨ц⟩ produit <code>/ts/</code>, un phonème unique malgré son écriture en deux symboles API, un digraphe indivisible. Cette affriquée n’est pas un <code>/t/</code> suivi d’un <code>/s/</code> même si ces symboles ont été appariés et adoptés pour la décrire&#160;: l’air est projeté à travers un point d’occlusion unique, et le son ne devrait pas prendre plus de temps à prononcer qu’un seul <code>/t/</code> ou <code>/s/</code>. Les chanteurs germanophones connaissent ce son de <em>Katze</em> («&#160;chat&#160;»), <em>Herz</em> («&#160;cœur&#160;»), <em>Mozart</em>.</p>

						<p>⟨ч⟩ produit <code>/tʃʲ/</code>, similairement un phonème unique. Les chanteurs italophones le connaissent de <em>ciao</em> («&#160;salut&#160;») et <em>dolce</em> («&#160;doux&#160;»), bien qu’en russe il porte une palatalisation inhérente que la version italienne ne possède pas. L’anglais palatalise cette affriquée <em>à la russe</em> dans les mots <em>cheese</em> («&#160;fromage&#160;»), <em>cheer</em> («&#160;acclamation&#160;»), <em>chief</em> («&#160;chef&#160;»), <em>chinos</em> («&#160;chinos&#160;»), ou partout où le locuteur prononce cette affriquée en se préparant à la suivre de la voyelle <code>[i]</code>. Davantage sur ce sujet dans la discussion à venir sur la palatalisation.</p>

						<h4 id="learn-u5-fixed">Quelles consonnes ne changent jamais de dureté ou de mollesse&#160;?</h4>

						<p>La plupart des consonnes russes existent sous forme dure (non palatalisée) et molle (palatalisée). Les conditions qui déclenchent la palatalisation font l’objet de la Section 6. Mais le russe présente cinq consonnes spéciales qui font exception&#160;: leur dureté ou leur mollesse est fixe et ne varie pas.</p>

						<p><strong>Toujours dures (jamais palatalisées)&#160;:</strong></p>

						<table>
						<thead><tr><th>Lettre</th><th>API</th><th>Caractère</th></tr></thead>
						<tbody>
						<tr><td>⟨ж⟩</td><td><code>/ʒ/</code></td><td>Chuintante voisée</td></tr>
						<tr><td>⟨ш⟩</td><td><code>/ʃ/</code></td><td>Chuintante non voisée</td></tr>
						<tr><td>⟨ц⟩</td><td><code>/ts/</code></td><td>Affriquée non voisée</td></tr>
						</tbody>
						</table>

						<p>Fait étonnant, un signe mou (⟨ь⟩) qui suit ⟨ж⟩ ou ⟨ш⟩ n’indique pas la palatalisation&#160;; le signe remplit une fonction traditionnelle et grammaticale uniquement, et est ignoré. Le mot рожь («&#160;seigle&#160;») se termine par <code>/ʒ/</code>, non par <code>/ʒʲ/</code>. De même, ⟨ь⟩ après ⟨ч⟩ ou ⟨щ⟩ n’ajoute aucune mollesse supplémentaire, puisque ces consonnes sont déjà intrinsèquement molles et ne peuvent devenir plus molles.</p>

						<p><strong>Toujours molles (toujours palatalisées)&#160;:</strong></p>

						<table>
						<thead><tr><th>Lettre</th><th>API</th><th>Caractère</th></tr></thead>
						<tbody>
						<tr><td>⟨ч⟩</td><td><code>/tʃʲ/</code></td><td>Affriquée palatalisée</td></tr>
						<tr><td>⟨щ⟩</td><td><code>/ʃʲʃʲ/</code></td><td>Double fricative palatalisée</td></tr>
						</tbody>
						</table>

						<p>Point important&#160;: ces cinq consonnes fixes servent de frontières au processus de palatalisation. Une chaîne régressive de palatalisation s’arrête lorsqu’elle rencontre ⟨ж⟩, ⟨ш⟩ ou ⟨ц⟩. (Les consonnes toujours-molles ⟨ч⟩ et ⟨щ⟩ n’arrêtent pas la chaîne&#160;; elles sont elles-mêmes des agents palatalisants.) Ces interactions sont traitées à la Section 6.</p>

						<p>Les consonnes toujours-dures affectent également les voyelles qui les suivent. Comme nous l’avons vu, le ⟨е⟩ inaccentué après ⟨ж⟩, ⟨ш⟩ ou ⟨ц⟩ se réduit à <code>/ɨ/</code> parce que l’environnement consonantique dur bloque l’antériorisation qui autrement permettrait <code>[ɪ]</code>. Ceci a été noté à la Section 4 (Réduction vocalique)&#160;; ici nous en nommons la cause.</p>

						<h4 id="learn-u5-signs">Que font les deux signes&#160;?</h4>

						<p>Deux lettres cyrilliques russes ne produisent aucun son par elles-mêmes. Mais toutes deux sont d’importants marqueurs fonctionnels qui modifient la prononciation de la consonne qui les précède.</p>

						<h5 id="learn-u5-soft">⟨ь⟩ (мягкий знак)&#160;: le signe mou</h5>

						<p>Le signe mou (мягкий знак <code>/ˈmʲɑxʲkʲij znɑk/</code>) indique d’habitude que la consonne immédiatement avant lui devient molle, c’est-à-dire palatalisée. C’est la fonction première du signe mou. Mal prononcer une consonne palatalisée comme dure (ou l’inverse) peut changer le sens d’un mot&#160;:</p>

						<table>
						<thead><tr><th>Avec ⟨ь⟩</th><th>API</th><th>Sens</th><th>Sans ⟨ь⟩</th><th>API</th><th>Sens</th></tr></thead>
						<tbody>
						<tr><td>шесть</td><td><code>/ʃesʲtʲ/</code></td><td>six</td><td>шест</td><td><code>/ʃɛst/</code></td><td>une perche</td></tr>
						<tr><td>полька</td><td><code>/ˈpolʲ kɑ/</code></td><td>polka</td><td>полка</td><td><code>/ˈpoɫ kɑ/</code></td><td>une étagère</td></tr>
						<tr><td>мать</td><td><code>/mɑtʲ/</code></td><td>mère</td><td>мат</td><td><code>/mɑt/</code></td><td>échec et mat</td></tr>
						</tbody>
						</table>

						<p>Lorsque ⟨ь⟩ se trouve entre une consonne précédente et une voyelle iotée suivante (⟨я⟩, ⟨е⟩, ⟨ё⟩, ⟨ю⟩), il palatalise dûment la consonne précédente mais force également l’insertion d’un glide <code>/j/</code> audible entre le signe mou et la voyelle qui suit. Cette dynamique implique aussi une aspiration notable, particulièrement pour les occlusives ou sibilantes qui précèdent le signe mou. Le mot дьявол («&#160;diable&#160;»), par exemple, se prononce <code>/ˈdʲjɑ vʌɫ/</code>&#160;: le ⟨ь⟩ palatalise le ⟨д⟩ et introduit le glide <code>/j/</code> avant ⟨я⟩.</p>

						<p>Le mécanisme de la palatalisation elle-même fait l’objet de la Section 6. Ici, nous nommons simplement le rôle du signe mou&#160;: d’habitude il indique au chanteur que la consonne précédente est molle.</p>

						<h5 id="learn-u5-hard">⟨ъ⟩ (твёрдый знак)&#160;: le signe dur</h5>

						<p>Le signe dur est bien moins fréquent que le signe mou, mais quand il apparaît, il porte un sens.</p>

						<p>⟨ъ⟩ (твёрдый знак <code>/ˈtvʲordɨj znɑk/</code>) dominait autrefois les pages cyrilliques comme lettre indicatrice terminale pour chaque mot se terminant par une consonne dure. Cette pratique a été abolie avec la réforme orthographique de 1918. Aujourd’hui, le signe dur apparaît parfois entre un préfixe et une racine qui commence par une voyelle iotée. Il crée une frontière&#160;: la consonne avant ⟨ъ⟩ reste dure, et la voyelle iotée après ⟨ъ⟩ insère un glide <code>/j/</code> initial entre elle et le signe dur. Sans le signe dur, la voyelle iotée palataliserait la consonne précédente au lieu de produire un glide. C’est une nuance clé qui doit être saisie et maîtrisée.</p>

						<table>
						<thead><tr><th>Avec ⟨ъ⟩</th><th>API</th><th>Sens</th><th>Sans ⟨ъ⟩</th><th>API</th><th>Sens</th></tr></thead>
						<tbody>
						<tr><td>объедать</td><td><code>/ɑb jɪ ˈdɑtʲ/</code></td><td>manger autour</td><td>обедать</td><td><code>/ɑ ˈbʲɛ dɑtʲ/</code></td><td>dîner</td></tr>
						<tr><td>съесть</td><td><code>/sʲjesʲtʲ/</code></td><td>manger (compl.)</td><td>сесть</td><td><code>/sʲesʲtʲ/</code></td><td>s’asseoir</td></tr>
						</tbody>
						</table>

						<h4 id="learn-u5-devoicing">Qu’arrive-t-il aux consonnes voisées à la fin d’un mot&#160;?</h4>

						<p>Les chanteurs formés en diction allemande connaissent déjà cette règle&#160;: les consonnes voisées se dévoisent à la fin d’un mot, indépendamment de l’orthographe. Le russe suit le même principe. Un ⟨б⟩ final sonne comme <code>/p/</code>, un ⟨д⟩ final comme <code>/t/</code>, un ⟨г⟩ final comme <code>/k/</code>, et ainsi de suite pour les six paires voisées-non voisées. Le dévoisement s’applique également aux consonnes palatalisées&#160;: le ⟨дь⟩ final sonne comme <code>/tʲ/</code>, le ⟨зь⟩ final comme <code>/sʲ/</code>.</p>

						<table>
						<thead><tr><th>Orthographe</th><th>Prononciation</th><th>API</th><th>Sens</th></tr></thead>
						<tbody>
						<tr><td>зуб</td><td>⟨б⟩ → <code>/p/</code></td><td><code>/zup/</code></td><td>une dent</td></tr>
						<tr><td>кров</td><td>⟨в⟩ → <code>/f/</code></td><td><code>/krof/</code></td><td>un abri</td></tr>
						<tr><td>друг</td><td>⟨г⟩ → <code>/k/</code></td><td><code>/druk/</code></td><td>un ami</td></tr>
						<tr><td>снег</td><td>⟨г⟩ → <code>/k/</code></td><td><code>/sʲnɛk/</code></td><td>neige</td></tr>
						<tr><td>обед</td><td>⟨д⟩ → <code>/t/</code></td><td><code>/ɑ ˈbʲɛt/</code></td><td>le déjeuner</td></tr>
						<tr><td>нож</td><td>⟨ж⟩ → <code>/ʃ/</code></td><td><code>/noʃ/</code></td><td>un couteau</td></tr>
						<tr><td>глаз</td><td>⟨з⟩ → <code>/s/</code></td><td><code>/ɡɫɑs/</code></td><td>un œil</td></tr>
						<tr><td>князь</td><td>⟨зь⟩ → <code>/sʲ/</code></td><td><code>/kʲnɑsʲ/</code></td><td>un prince</td></tr>
						<tr><td>кровь</td><td>⟨вь⟩ → <code>/fʲ/</code></td><td><code>/krofʲ/</code></td><td>le sang</td></tr>
						</tbody>
						</table>

						<p>Les sonantes (<code>/l/</code>, <code>/m/</code>, <code>/n/</code>, <code>/r/</code> et leurs formes palatalisées) sont exemptées&#160;: elles restent voisées en toute position et ne se dévoisent pas.</p>

						<p>Le dévoisement final est le premier de plusieurs processus d’assimilation qui sont expliqués à la Section 7. Dans cette section, nous avons nommé le dévoisement comme une propriété de l’inventaire consonantique&#160;; à la Section 7, nous explorerons comment le dévoisement interagit avec les frontières de mots, les clitiques et les consonnes adjacentes.</p>

						<h4 id="learn-u5-try">Essayez dans Ilya</h4>

						<p>Transcrivez un mot contenant ⟨л⟩ dans différentes positions. Dans мал («&#160;petit&#160;», forme courte masculine), Ilya produit <code>/ɫ/</code> pour la consonne finale&#160;: sombre, vélarisé. Dans мальчик («&#160;garçon&#160;»), le signe mou palatalise la même lettre en <code>/lʲ/</code>&#160;: clair, dental. Même lettre, contexte différent, son différent.</p>

						<p>Transcrivez maintenant друг («&#160;ami&#160;»). Remarquez que le ⟨г⟩ final apparaît comme <code>/k/</code> dans la ligne API&#160;: dévoisé, exactement comme il le serait en allemand. La lettre cyrillique qui signale habituellement une consonne voisée n’est pas le son que vous chantez. Les consonnes finales se dévoisent en russe chanté.</p>

						<p><em>Source Grayson&#160;: ch. 4 (toutes les sections), ch. 5 §1</em></p>

						<h3 id="learn-unit-6">Section 6 · La palatalisation</h3>

						<h4 id="learn-u6-what">Qu’est-ce que la palatalisation ?</h4>
						<p>La palatalisation est une articulation secondaire nécessaire en
						russe, sans lui être exclusive. Pour palataliser, le dos de la langue
						(le dorsum) s’élève et s’avance vers le palais dur, reproduisant
						approximativement la position de la voyelle [i], tandis que la consonne
						conserve son lieu et son mode d’articulation habituels. Ces deux gestes
						s’effectuent simultanément, et non successivement : c’est pourquoi on
						parle de coarticulation. Grayson est précis : la consonne est articulée
						dans une « integrally palatalized tongue position » « position linguale
						intégralement palatalisée » (Grayson 2012, 169). Un [tʲ] palatalisé est
						un évènement unique, et non un [t] suivi d’un [j]. Le mot тюк se
						transcrit /tʲuk/ : trois phonèmes. Si ce que vous produisez ressemble à
						/tjuk/, la langue arrive en retard. Prolongeant ce principe, Grayson
						emploie [ɲ] au lieu du techniquement correct [nʲ], en raison de sa
						familiarité pour les chanteurs habitués à la diction lyrique française
						et italienne. Un débutant risque moins de confondre [ɲ] avec [nj], alors
						que [nʲ] et [nj] peuvent sembler à peine distincts sur la page. Le mot
						russe ⟨нет⟩ (non) est très souvent chanté incorrectement avec quatre
						phonèmes, [njɛt], alors que sa transcription en [ɲɛt] met en valeur une
						séquence de trois phonèmes tout à fait familiers, qui produisent un
						russe idiomatique.</p>
						<p>Vous faites déjà cela en permanence. Lorsque vous dites « qui » [ki],
						votre langue prépare un espace buccal en forme de [i] avant même de
						relâcher le /k/ ; comparez avec « car » [kɑʁ], où elle ne le fait pas.
						Le /k/ de « car » est [k]. Le /k/ de « qui » est [kʲ]. La
						palatalisation, c’est cette antériorisation anticipée de la langue, et
						vous l’effectuez sans y penser. Le [ɲ] italien dans « ogni », le /d/
						français dans « dire » : chacun mobilise le même geste. Une différence
						notable, cependant : la palatalisation ne porte aucune valeur
						distinctive en anglais, en français ou en italien, alors qu’elle en
						porte une en russe.</p>
						<p>En russe, la palatalisation signale un changement radical de sens :
						мат [mat] (<em>échec et mat</em>), мать [matʲ] (<em>mère</em>) ; брат [brat] (<em>frère</em>), брать [bratʲ] (<em>prendre</em>). La
						palatalisation est le seul vecteur de distinction lexicale entre ces
						paires. Notre tâche pédagogique n’est pas d’acquérir une habileté
						physique nouvelle de zéro, mais de développer un contrôle conscient sur
						un geste inconscient que nous possédons déjà, et puis de l’appliquer
						systématiquement partout où le russe l’exige.</p>
						<p>Le modèle pratique de Grayson pour ce contrôle est « arch, pronounce,
						peel » « arquer, prononcer, décoller » (Grayson 2012, 205). Nous
						pourrions reformuler cela en Préparer, Prononcer, Décoller, où «
						Préparer » désigne l’anticipation de la voûte linguale qui prévient la
						séquence [C]+[j] contre laquelle Grayson nous met en garde. Le dos de la
						langue s’arque vers la voûte du palais dur ; la consonne est prononcée
						tandis que la langue maintient cette position arquée ; le dorsum se
						décolle rapidement à mesure que la voyelle suivante se déploie. On gagne
						à anticiper la posture [i] nécessaire pendant l’exécution de la consonne
						désormais palatalisée : cela empêche le geste de se dégrader en une
						production séquentielle. Travaillez lentement avec des consonnes
						familières (/tʲ/, /dʲ/, /ɲ/) dans des séquences VCV avant de tenter des
						combinaisons plus exposées, puis parcourez l’ensemble de l’inventaire
						vocalique. C’est un travail progressif, et les erreurs en font
						partie.</p>
						<table>
						<colgroup>
						<col />
						<col />
						<col />
						<col />
						<col />
						<col />
						<col />
						<col />
						</colgroup>
						<thead>
						<tr class="header">
						<th></th>
						<th>/i/</th>
						<th>/e/</th>
						<th>/ɛ/</th>
						<th>/a/</th>
						<th>/ɑ/</th>
						<th>/o/</th>
						<th>/u/</th>
						</tr>
						</thead>
						<tbody>
						<tr class="odd">
						<td>VCV avec /tʲ/</td>
						<td>iːtʲi</td>
						<td>iːtʲe</td>
						<td>iːtʲɛ</td>
						<td>iːtʲa</td>
						<td>iːtʲɑ</td>
						<td>iːtʲo</td>
						<td>iːtʲu</td>
						</tr>
						<tr class="even">
						<td>/tʲ/ exposé</td>
						<td>tʲiː</td>
						<td>tʲeː</td>
						<td>tʲɛː</td>
						<td>tʲaː</td>
						<td>tʲɑː</td>
						<td>tʲoː</td>
						<td>tʲuː</td>
						</tr>
						<tr class="odd">
						<td>VCV avec /dʲ/</td>
						<td>iːdʲi</td>
						<td>iːdʲe</td>
						<td>iːdʲɛ</td>
						<td>iːdʲa</td>
						<td>iːdʲɑ</td>
						<td>iːdʲo</td>
						<td>iːdʲu</td>
						</tr>
						<tr class="even">
						<td>/dʲ/ exposé</td>
						<td>dʲiː</td>
						<td>dʲeː</td>
						<td>dʲɛː</td>
						<td>dʲaː</td>
						<td>dʲɑː</td>
						<td>dʲoː</td>
						<td>dʲuː</td>
						</tr>
						<tr class="odd">
						<td>VCV avec /ɲ/</td>
						<td>iːɲi</td>
						<td>iːɲe</td>
						<td>iːɲɛ</td>
						<td>iːɲa</td>
						<td>iːɲɑ</td>
						<td>iːɲo</td>
						<td>iːɲu</td>
						</tr>
						<tr class="even">
						<td>/ɲ/ exposé</td>
						<td>ɲiː</td>
						<td>ɲeː</td>
						<td>ɲɛː</td>
						<td>ɲaː</td>
						<td>ɲɑː</td>
						<td>ɲoː</td>
						<td>ɲuː</td>
						</tr>
						</tbody>
						</table>
						<p>Pour ceux que l’acoustique intéresse : la palatalisation s’accorde
						avec plusieurs objectifs de la technique vocale classique. La position
						antérieure de la langue libère l’espace pharyngé, augmentant le volume
						du résonateur pharyngien et facilitant une production « à gorge ouverte
						» : ce que la pédagogie italienne appelle <em>la gola aperta</em>
						(Mitton 2020, 20, 38 ; Bolla 1980, 8). Les mesures acoustiques du russe
						chanté confirment que les effets sur les résonances du conduit vocal
						sont présents mais subtils : <em>f</em><sub>R2</sub> s’élève tandis que
						<em>f</em><sub>R1</sub> s’abaisse, reproduisant le profil acoustique de
						la voyelle [i] qu’elle simule (Mitton 2020, 131–132). Le chanteur qui
						palatalise bien optimise simultanément le conduit vocal pour une
						résonance efficace.</p>
						<h4 id="learn-u6-signals">Comment repérer la palatalisation à l’écrit ?</h4>
						<p>Les voyelles ne peuvent pas être palatalisées. La palatalisation ne
						s’applique qu’aux consonnes. Pourtant, dans les textes cyrilliques,
						c’est le plus souvent dans les lettres-voyelles que la palatalisation se
						signale. Elle est également indiquée par le signe mou. Grayson préfère
						le terme générique « indicator letters » « lettres indicatrices » pour
						désigner les lettres cyrilliques qui signalent la palatalisation. Je
						préfère le terme plus descriptif, et tout aussi inventé, d’« agents
						palatalisants ». Ils comprennent :</p>
						<ul>
						<li>le signe mou ⟨ь⟩</li>
						<li>toute voyelle de la « série molle » : ⟨я /jɑ/, е /jɛ/, и /i/, ё
						/jo/, ю /ju/⟩</li>
						<li>l’une ou l’autre des deux consonnes toujours molles (⟨ч⟩ [tʃʲ] ou
						⟨щ⟩ [ʃʲʃʲ])</li>
						<li>une autre consonne palatalisée valide (traitée en 6.5)</li>
						</ul>
						<table>
						<thead><tr><th>Agent palatalisant</th><th>Contrepartie dure</th><th>Ce que fait l’agent</th><th>Exemple</th></tr></thead>
						<tbody>
						<tr><td>⟨я⟩ palatalise + /ɑ/</td><td>⟨а⟩ ne palatalise pas ; même voyelle</td><td>La consonne précédente se palatalise ; la voyelle sonne /ɑ/ (accent) ou se réduit (hors accent).</td><td>мять /mʲatʲ/ (« froisser ») vs мать /mɑtʲ/ (« mère »)</td></tr>
						<tr><td>⟨е⟩ palatalise + /ɛ/</td><td>⟨э⟩ ne palatalise pas ; même voyelle</td><td>La consonne précédente se palatalise ; la voyelle sonne /ɛ/ (accent) ou se réduit (hors accent).</td><td>нет /ɲɛt/ (« non ») vs нэп /nɛp/</td></tr>
						<tr><td>⟨ё⟩ palatalise + /o/</td><td>⟨о⟩ ne palatalise pas ; même voyelle</td><td>La consonne précédente se palatalise ; la voyelle sonne /o/ (toujours accentuée).</td><td>тёмный /ˈtʲom nɨj/ (« sombre ») vs том /tom/ (« tome »)</td></tr>
						<tr><td>⟨ю⟩ palatalise + /u/</td><td>⟨у⟩ ne palatalise pas ; même voyelle</td><td>La consonne précédente se palatalise ; la voyelle sonne /u/ (accentuée ou non).</td><td>тюк /tʲuk/ (« balle ») vs тук /tuk/ (« toc »)</td></tr>
						<tr><td>⟨и⟩ palatalise + /i/</td><td>⟨ы⟩ /ɨ/ après consonne dure</td><td>La consonne précédente se palatalise ; la voyelle sonne /i/.</td><td>мир /mʲir/ (« monde »)</td></tr>
						<tr><td>⟨ь⟩ (signe mou)</td><td>⟨ъ⟩ (signe dur)</td><td>Palatalise la consonne à sa gauche. Ne produit aucun son en lui-même.</td><td>мать /mɑtʲ/ (« mère ») vs подъезд /pɑdˈjest/</td></tr>
						<tr><td>⟨ч⟩, ⟨щ⟩ (toujours molles)</td><td>⟨ж⟩, ⟨ш⟩, ⟨ц⟩ (toujours dures)</td><td>Palatalisées par nature ; peuvent palataliser nombre de consonnes précédentes dans un groupe consonantique.</td><td>мальчик /ˈmɑlʲtʃʲɪk/ (« garçon »)</td></tr>
						<tr><td>Consonne déjà palatalisée</td><td>—</td><td>Propage la palatalisation vers la gauche au sein d’un groupe (assimilation régressive), jusqu’à ce qu’une frontière l’arrête.</td><td>гость /ɡosʲtʲ/ (« invité »)</td></tr>
						</tbody>
						</table>
						<p>Cela introduit le corollaire bien documenté qu’on appelle
						<em>l’assimilation régressive de la palatalisation</em>, ou
						<em>palatalisation régressive</em> en abrégé. Une consonne palatalisée
						(par quelque moyen que ce soit) peut en règle générale transmettre sa
						palatalisation en arrière, à la consonne immédiatement à sa gauche, dans
						certaines limites. Cette palatalisation régressive se propage de voisine
						en voisine, de droite à gauche, jusqu’à ce que quelque chose
						l’arrête.</p>
						<p>Considérons гость [ɡosʲtʲ] (<em>invité</em>) : le ⟨ь⟩ palatalise le ⟨т⟩, et le ⟨т⟩ désormais
						palatalisé palatalise le ⟨с⟩ qui le précède. Toujours vers la gauche. En
						pratique, cela signifie qu’il faut anticiper la posture linguale
						antérieure en [i] bien avant que la consonne palatalisée causale ne soit
						même prononcée. Deux consonnes russes, ⟨ч⟩ /tʃʲ/ et ⟨щ⟩ /ʃʲʃʲ/, sont
						intrinsèquement palatalisées (et les marqueurs de palatalisation
						figurent dans leurs valeurs API par défaut en conséquence).</p>
						<p>Ce qui arrête la propagation est le sujet de 6.3, et les règles
						spécifiques régissant la participation des consonnes à l’assimilation
						régressive sont traitées en 6.5.</p>
						<p>Une transcription en API est infiniment plus lisible. En API, la
						palatalisation est marquée par un symbole unique et cohérent : le [ʲ] en
						exposant qui suit la consonne. Grayson adopte cette notation à la suite
						de la convention de Kiel (1989) de l’Association phonétique
						internationale, qui a abandonné un ensemble de symboles plus anciens au
						profit de cet exposant uniforme (Grayson 2012, 61–62). Le chanteur qui
						consulte la sortie d’Ilya voit [ʲ] partout où une consonne est
						palatalisée : /tʲ/, /dʲ/, /sʲ/, /mʲ/, et ainsi de suite. La seule
						exception est [ɲ], traitée en 6.1.</p>
						<p>Les symboles abandonnés méritent une brève mention, car le chanteur
						les rencontrera dans d’autres ressources. Avant 1989, l’API marquait la
						palatalisation par des crochets palataux : de petites courbes
						descendantes apposées à la base des lettres consonantiques. L’ouvrage de
						Natalia Challis, <em>The Singer’s Rachmaninoff</em> (2006), parmi
						d’autres références, utilise cette notation ancienne. Les symboles sont
						visuellement distincts les uns des autres, là où l’exposant moderne [ʲ]
						s’applique uniformément à toute consonne. Un tableau de correspondance
						est fourni ici à titre de référence :</p>
						<table>
						<colgroup>
						<col />
						<col />
						</colgroup>
						<thead>
						<tr class="header">
						<th>Catégorie</th>
						<th>Ancien → Moderne</th>
						</tr>
						</thead>
						<tbody>
						<tr class="odd">
						<td>Labiales et labiodentales</td>
						<td>ᶈ → pʲ, ᶀ → bʲ, ᶆ → mʲ, ᶂ → fʲ, ᶌ →
						vʲ</td>
						</tr>
						<tr class="even">
						<td>Dentales, alvéolaires et nasale</td>
						<td>ƫ → tʲ, ᶁ → dʲ, ᶉ → rʲ, ᶊ → sʲ, ᶎ → zʲ, ᶋ
						→ ʃʲ, ᶅ → lʲ, ᶇ → ɲ</td>
						</tr>
						<tr class="odd">
						<td>Vélaires</td>
						<td>ᶄ → kʲ, ᶃ → ɡʲ, ᶍ → xʲ</td>
						</tr>
						</tbody>
						</table>
						<p>L’ouvrage de Cheri Montgomery, <em>Russian Lyric Diction
						Workbook</em> (STM, 2021), est la seule autre ressource imprimée en
						diction lyrique russe, outre Grayson, à employer systématiquement les
						marqueurs de palatalisation API modernes adoptés lors de la convention
						de Kiel de 1989. Les divergences entre les autres systèmes sont légion :
						crochets palataux anciens, usage incohérent de l’exposant, et choix de
						notation qui obscurcissent la distinction même que le chanteur a besoin
						de voir. Ilya met en œuvre les conventions de notation de Grayson d’un
						bout à l’autre, avec la souplesse nécessaire pour les modifier. Le
						chanteur qui consulte d’autres ressources doit savoir que les symboles
						peuvent différer, et s’y adapter.</p>
						<h4 id="learn-u6-stops">Qu’est-ce qui arrête la propagation ?</h4>
						<p>La palatalisation régressive se propage en arrière au sein d’un
						groupe consonantique, mais pas indéfiniment. Le chanteur qui connait les
						agents palatalisants (6.2) et les six frontières ci-dessous peut prédire
						la palatalisation pour à peu près n’importe quel mot.</p>
						<table>
						<colgroup>
						<col />
						<col />
						<col />
						</colgroup>
						<thead>
						<tr class="header">
						<th>Frontière</th>
						<th>Fonction</th>
						<th>Exemple</th>
						</tr>
						</thead>
						<tbody>
						<tr class="odd">
						<td>Consonnes toujours dures (⟨ж⟩, ⟨ш⟩,
						⟨ц⟩)</td>
						<td>Ces consonnes ne peuvent pas être
						palatalisées et bloquent entièrement la propagation de la palatalisation
						régressive. La chaine s’arrête là.</td>
						<td>большой /bɑlʲ ˈʃoj/ : le ⟨ь⟩ palatalise le
						⟨л⟩, mais le ⟨ш⟩ est toujours dur et n’absorbe rien.</td>
						</tr>
						<tr class="even">
						<td>Une voyelle</td>
						<td>La palatalisation ne s’applique qu’aux
						consonnes ; une voyelle interrompt donc la chaine régressive. La voyelle
						peut elle-même être le dernier élément influencé (voir ci-dessous).</td>
						<td>мать /mɑtʲ/ : le ⟨ь⟩ palatalise le ⟨т⟩ ;
						la voyelle /ɑ/ est la frontière.</td>
						</tr>
						<tr class="odd">
						<td>Le signe dur ⟨ъ⟩</td>
						<td>Frontière orthographique qui empêche la
						palatalisation d’atteindre la consonne à sa gauche. Exception : ⟨в⟩, ⟨с⟩
						et ⟨з⟩ se palatalisent malgré la présence du ⟨ъ⟩.</td>
						<td>подъезд /pɑdˈjest/ : le ⟨ъ⟩ empêche le ⟨ё⟩
						de palataliser le ⟨д⟩. Comparez съезд /sʲjest/ : le ⟨с⟩ se palatalise
						parce qu’il fait partie des trois consonnes qui font exception.</td>
						</tr>
						<tr class="even">
						<td>Un nouvel agent palatalisant</td>
						<td>Non pas un mur, mais une réinitialisation.
						Quand une deuxième lettre indicatrice ou un deuxième signe mou apparait,
						il établit un nouveau point d’influence régressive, indépendant du
						premier.</td>
						<td>сестрёнка /sʲi ˈsʲtʲrʲon kɑ/ : le ⟨ё⟩
						palatalise le groupe ⟨стр⟩ ; le ⟨е⟩ est un agent distinct qui palatalise
						le ⟨с⟩ initial de manière indépendante.</td>
						</tr>
						<tr class="odd">
						<td>La frontière de mot</td>
						<td>La palatalisation ne franchit généralement
						pas la frontière de mot. Cela la distingue de l’assimilation de
						voisement, qui la franchit librement (section 7). Exception : lorsqu’un
						mot se termine par ⟨в⟩, ⟨с⟩ ou ⟨з⟩ et que le mot suivant commence par
						une lettre indicatrice autre que ⟨и⟩, la consonne finale se palatalise
						au-delà de la frontière.</td>
						<td>Traitement complet en section 7.</td>
						</tr>
						<tr class="even">
						<td>La ponctuation</td>
						<td>Absolue. Aucune assimilation, de quelque
						nature que ce soit, ne franchit la ponctuation (Grayson 2012, 206).
						C’est la seule frontière qui n’admet aucune exception.</td>
						<td>Traitement complet en section 7.</td>
						</tr>
						</tbody>
						</table>
						<p>La frontière que le chanteur rencontre le plus fréquemment à
						l’intérieur d’un mot est la première : une consonne toujours dure. Nous
						avons rencontré ⟨ж⟩, ⟨ш⟩ et ⟨ц⟩ en section 5 comme des consonnes qui ne
						sont jamais palatalisées. Ici, elles jouent le rôle de murs contre la
						palatalisation régressive. Dans большой, le ⟨ь⟩ palatalise le ⟨л⟩, mais
						le ⟨ш⟩ à sa gauche est imperméable. La palatalisation s’arrête, et le
						⟨б⟩ conserve sa dureté. Le chanteur qui a intériorisé les trois
						consonnes toujours dures de la section 5 connait déjà la frontière la
						plus importante du système.</p>
						<p>La frontière vocalique mérite une brève clarification. Une voyelle
						interrompt la chaine consonantique, mais la voyelle peut elle-même être
						le dernier élément influencé : si elle se retrouve prise entre deux
						consonnes palatalisées (en position interpalatale), elle s’antériorise
						(voir section 3). Mais il ne s’agit pas de la palatalisation d’une
						voyelle. Il s’agit plutôt d’une concession aux contraintes
						physiologiques humaines. Le principe d’« économie des gestes de parole »
						de Lindblom (1983) suggère que, dans la parole humaine, les valeurs
						extrêmes des paramètres articulatoires tendent à être évitées. La langue
						est en position arquée pour les phonèmes qui précèdent et qui suivent la
						voyelle ; la voyelle prise en étau palatal ne retournera donc pas
						entièrement à sa position de base, et s’antériorise vers un allophone
						plus clair. C’est ainsi que l’antériorisation interpalatale transforme
						[ɑ] en [a] et [ɛ] en [e]. Grayson nous rappelle que « all vowels
						preceding palatalized consonants are fronted, even more so when
						interpalatal » « toutes les voyelles qui précèdent des consonnes
						palatalisées s’antériorisent, d’autant plus en position interpalatale »,
						bien que « only [ja], [a], [je], and [e] are formally recognized in
						Russian lyric diction as secondary allophones » « seuls [ja], [a], [je]
						et [e] soient formellement reconnus en diction lyrique russe comme
						allophones secondaires » (Grayson 2012, 208).</p>
						<h4 id="learn-u6-paired">Consonnes appariées et non appariées</h4>
						<p>Le chanteur sait désormais ce qu’est la palatalisation (6.1), ce qui
						la déclenche (6.2) et ce qui l’arrête (6.3). La question suivante
						s’impose naturellement : quelles consonnes peuvent être palatalisées
						?</p>
						<p>La plupart des consonnes russes sont appariées : elles existent sous
						une forme dure et une forme molle, et la distinction entre les deux est
						phonémique. Cinq consonnes sont non appariées : trois sont toujours
						dures et ne peuvent jamais être palatalisées ; deux sont toujours molles
						et ne se prononcent jamais sans palatalisation. Le chanteur les a toutes
						rencontrées en section 5. Nous consolidons ici le tableau complet.</p>
						<table>
						<colgroup>
						<col />
						<col />
						<col />
						</colgroup>
						<thead>
						<tr class="header">
						<th>Catégorie</th>
						<th>Consonnes</th>
						<th>Notes</th>
						</tr>
						</thead>
						<tbody>
						<tr class="odd">
						<td>Appariées (formes dure et molle)</td>
						<td>б/бʲ, п/пʲ, в/вʲ, ф/фʲ, д/дʲ, т/тʲ, з/зʲ,
						с/сʲ, г/гʲ, к/кʲ, х/хʲ, м/мʲ, н/нʲ[ɲ], р/рʲ, л[ɫ]/лʲ[lʲ]</td>
						<td>Quinze consonnes. Chacune possède une
						forme dure par défaut et une contrepartie molle produite par
						palatalisation. La latérale dure se transcrit [ɫ] (l vélaire) ; la
						nasale molle se transcrit [ɲ] plutôt que [nʲ] (voir 6.1).</td>
						</tr>
						<tr class="even">
						<td>Toujours dures (non appariées)</td>
						<td>ж [ʒ], ш [ʃ], ц [ts]</td>
						<td>Ces trois consonnes sont imperméables à la
						palatalisation. Elles jouent le rôle de frontières (6.3). Un signe mou
						après ⟨ж⟩ ou ⟨ш⟩ n’a aucun effet phonétique : il signale le genre ou la
						conjugaison, non la mollesse.</td>
						</tr>
						<tr class="odd">
						<td>Toujours molles (non appariées)</td>
						<td>ч [tʃʲ], щ [ʃʲʃʲ]</td>
						<td>Deux consonnes. Elles sont intrinsèquement
						palatalisées et peuvent agir comme agents palatalisants pour les
						consonnes à leur gauche dans un groupe consonantique (6.2).</td>
						</tr>
						</tbody>
						</table>
						<p>Vingt consonnes en tout. Quinze sont appariées ; cinq sont fixes. Le
						chanteur qui a intériorisé ce tableau peut examiner n’importe quelle
						consonne d’un mot russe et savoir immédiatement si elle est susceptible
						de palatalisation. Si elle est appariée, il cherche un agent à sa
						droite. Si elle est toujours dure, c’est un mur. Si elle est toujours
						molle, c’est un agent.</p>
						<h4 id="learn-u6-clusters">La palatalisation régressive dans les groupes consonantiques</h4>
						<p>Les consonnes ne participent pas toutes à parts égales à la
						palatalisation régressive. La diction lyrique russe suit la tradition
						vieux-moscovite, qui palatalise plus généreusement au sein des groupes
						consonantiques que le russe parlé contemporain (Grayson 2012, 209). Les
						cinq règles ci-dessous, dérivées de Derwing et Priestly (1980, 76–87),
						décrivent les contraintes qui régissent cette générosité. Lorsqu’un mot
						spécifique s’écarte de ces règles selon les conventions de la
						prononciation scénique, Ilya le traite comme une entrée individuelle
						dans son dictionnaire, avec citation.</p>
						<table>
						<colgroup>
						<col />
						<col />
						<col />
						</colgroup>
						<thead>
						<tr class="header">
						<th>Règle</th>
						<th>Contrainte</th>
						<th>Exemple</th>
						</tr>
						</thead>
						<tbody>
						<tr class="odd">
						<td>1. /ɫ/ (l vélaire)</td>
						<td>Ne se palatalise pas régressivement, sauf
						lorsqu’il est doublé : ⟨-лль-⟩ → /lʲlʲ/.</td>
						<td>Dans ⟨-лн-⟩, le ⟨л⟩ reste [ɫ] même si le
						⟨н⟩ est palatalisé.</td>
						</tr>
						<tr class="even">
						<td>2. /r/</td>
						<td>Ne se palatalise pas régressivement, sauf
						lorsqu’il est doublé : ⟨-ррь-⟩ → /rʲrʲ/. Voir l’exception progressive
						ci-dessous.</td>
						<td>Le roulé résiste à la palatalisation
						régressive plus que toute autre consonne appariée.</td>
						</tr>
						<tr class="odd">
						<td>3. /n/</td>
						<td>Uniquement devant un autre /n/ palatalisé
						ou devant une dentale palatalisée.</td>
						<td>Devant une labiale ou une vélaire
						palatalisée, /n/ conserve sa dureté.</td>
						</tr>
						<tr class="even">
						<td>4. Vélaires (/k/, /ɡ/, /x/)</td>
						<td>Uniquement devant une autre vélaire
						palatalisée.</td>
						<td>Une vélaire devant une dentale ou une
						labiale palatalisée conserve sa dureté.</td>
						</tr>
						<tr class="odd">
						<td>5. Labiales (/b/, /p/, /v/, /f/)</td>
						<td>Uniquement devant une autre labiale
						palatalisée.</td>
						<td>Une labiale devant une dentale ou une
						vélaire palatalisée conserve sa dureté.</td>
						</tr>
						</tbody>
						</table>
						<p>Nous pourrions appeler le principe sous-jacent <em>l’affinité homorganique</em> : les consonnes reçoivent la palatalisation régressive d’autant plus facilement que la consonne voisine partage leur lieu d’articulation. Les dentales sont les plus perméables. Les vélaires et les labiales sont les plus restrictives. Le l vélaire et le roulé font exception même au sein de leurs propres catégories.</p>
						<p><strong>L’exception progressive.</strong> Tout ce que nous avons
						abordé dans la section 6 jusqu’ici était régressif : une influence
						s’exerçant en arrière, de droite à gauche. La règle 2 contient une
						exception unique, qui renverse entièrement la direction. Le roulé /r/ se
						palatalise progressivement (vers l’avant, de gauche à droite) lorsqu’il
						est précédé d’une voyelle antérieure accentuée : ⟨и⟩, ⟨е⟩ ou ⟨э⟩. Dans
						cette configuration, la position de la langue pour la voyelle influence
						la consonne qui la suit. Considérons первый /ˈpʲerʲ vɨj/ (« premier ») :
						le ⟨е⟩ accentué palatalise le ⟨р⟩ à sa droite, bien qu’aucun agent
						palatalisant n’apparaisse après lui. Il en va de même dans верность
						/ˈvʲerʲ nʌsʲtʲ/ (« fidélité »). Les propres exemples de Grayson pour cette règle incluent смерть /sʲmʲerʲtʲ/ (« mort ») et терпеть /tʲirʲ ˈpʲetʲ/ (« endurer »), où dans chaque cas la voyelle antérieure accentuée palatalise le /r/ à sa droite. C’est la seule consonne du russe qui se
						palatalise dans cette direction, et uniquement dans ces conditions :
						syllabe accentuée, voyelle antérieure, immédiatement avant le roulé.
						C’est une règle modeste, mais elle est structurellement unique.</p>
						<h4 id="learn-u6-practice">Mise en pratique</h4>
						<p>Les exemples détaillés qui suivent, adaptés de Grayson (2012,
						210–211), appliquent les principes exposés de 6.1 à 6.5, par ordre
						croissant de complexité. Chaque mot introduit une complication
						nouvelle.</p>
						<p><strong>стол → /stoɫ/.</strong> Aucun indicateur, aucun agent
						palatalisant. Toutes les consonnes sont dures. Le ⟨л⟩ est un l vélaire
						[ɫ].</p>
						<p><strong>столь → /stolʲ/.</strong> Le signe mou ⟨ь⟩ palatalise le ⟨л⟩
						: le l vélaire [ɫ] devient [lʲ]. La voyelle ⟨о⟩ est une frontière ; la
						palatalisation ne se propage pas vers la gauche au-delà.</p>
						<p><strong>мать → /mɑtʲ/.</strong> Le signe mou palatalise le ⟨т⟩. La
						voyelle ⟨а⟩ est de nouveau une frontière, et puisqu’elle n’est pas
						interpalatale (aucun agent palatalisant ne la précède), elle demeure
						[ɑ].</p>
						<p><strong>мять → /matʲ/.</strong> Deux agents palatalisants, cette fois
						: ⟨я⟩ palatalise le ⟨м⟩, et ⟨ь⟩ palatalise le ⟨т⟩. La voyelle ⟨а⟩ est
						interpalatale (consonne palatalisée de part et d’autre) et accentuée :
						elle s’antériorise donc de [ɑ] à [a]. Comparez мать : même ossature,
						qualité vocalique différente, parce que la palatalisation entoure
						désormais la voyelle.</p>
						<p><strong>большой → /bɑlʲ ˈʃoj/.</strong> Le signe mou palatalise le
						⟨л⟩. La palatalisation ne peut pas se propager davantage vers la gauche,
						car la voyelle ⟨о⟩ est une frontière. Elle ne peut pas se propager vers
						la droite, car le ⟨ш⟩ est toujours dur : imperméable, il joue le rôle de
						mur (6.3).</p>
						<p><strong>сестрёнка → /sʲi ˈsʲtʲrʲon kɑ/.</strong> Le ⟨ё⟩ palatalise le
						groupe consonantique à sa gauche : ⟨р⟩, puis ⟨т⟩, puis ⟨с⟩. Chaque
						consonne palatalisée devient un agent pour la suivante, en se propageant
						régressivement jusqu’à la frontière vocalique. Le ⟨е⟩ atone de la
						première syllabe est lui aussi précédé d’un ⟨с⟩ palatalisé, ce qui le
						place en position interpalatale ; il se réduit à /i/. Le ⟨к⟩ ne se
						palatalise pas, car le ⟨а⟩ qui le suit n’est pas un agent
						palatalisant.</p>
						<p><strong>симметрический → /sʲi mʲmʲi ˈtʲrʲi tʃʲɪ skɨj/.</strong>
						Palatalisation complète des groupes consonantiques sur plusieurs
						syllabes, selon la tradition scénique vieux-moscovite. La terminaison
						⟨-ский⟩ se résout en /skɨj/ par convention de diction lyrique (voir
						section 5), et non en /sʲkʲij/ : le i vélaire [ɨ] apparait ici parce que
						la palatalisation ne s’applique pas à cette terminaison morphologique
						particulière.</p>
						<p>Chaque exemple s’appuie sur le précédent. Le chanteur qui peut
						expliquer pourquoi мять [matʲ] (<em>froisser</em>) contient [a] là où мать [mɑtʲ] (<em>mère</em>) contient [ɑ], et
						pourquoi le ⟨ш⟩ de большой bloque ce que le groupe consonantique de
						сестрёнка laisse passer, a intériorisé le système.</p>
						<h4 id="learn-u6-velari">Le i vélaire [ɨ]</h4>
						<p>Le i vélaire occupe l’espace où la palatalisation ne peut pas aller.
						C’est le son vocalique qui apparait lorsque ⟨и⟩ suit une consonne
						toujours dure (⟨ж⟩, ⟨ш⟩, ⟨ц⟩) ou lorsque certaines terminaisons
						morphologiques résistent à la palatalisation par convention : la
						terminaison ⟨-ский⟩ rencontrée dans симметрический en est un cas.</p>
						<p>Le symbole est [ɨ], la voyelle centrale fermée non arrondie. La
						langue s’avance comme pour [i], mais se rétracte en même temps vers le
						centre de la bouche, à la manière du creux d’une louche. Les anglophones
						produisent un son voisin dans les syllabes atones : la deuxième voyelle
						de « roses » ou de « needed », où la langue se tient en position haute
						sans s’engager franchement vers l’avant ni vers l’arrière. Ce n’est pas
						un son difficile à produire. Ce qui est exigeant, c’est de le produire
						volontairement et de le soutenir musicalement, car les anglophones ont
						rarement besoin de le distinguer de [ɪ]. Les francophones n’ont pas
						d’équivalent proche dans leur langue ; l’acquisition passe par la
						description articulatoire et l’écoute. Les anglophones obtiennent
						involontairement [ɨ] lorsque [ɪ] se colore au contact de [ɫ] en route
						vers [k] dans « milk » prononcé familièrement.</p>
						<p>Le russe fait de cette distinction un principe structurel. Après une
						consonne palatalisée, ⟨и⟩ sonne [i] : la langue est déjà en position
						antérieure, et la voyelle prolonge simplement cette posture. Après une
						consonne toujours dure, la langue ne peut pas s’avancer (la consonne le
						lui interdit), et c’est [ɨ] qui en résulte. Ces deux sons ne sont pas
						des phonèmes distincts en russe ; ce sont des variantes positionnelles
						d’une même voyelle, conditionnées entièrement par la dureté ou la
						mollesse de la consonne précédente. Le chanteur ne choisit pas entre les
						deux. C’est la consonne qui choisit.</p>
						<p>Considérons жить /ʒɨtʲ/ (« vivre ») : le ⟨ж⟩ toujours dur force le
						⟨и⟩ à se rétracter vers [ɨ], mais le ⟨ь⟩ palatalise le ⟨т⟩. Ou цирк
						/tsɨrk/ (« cirque ») : le ⟨ц⟩ toujours dur rétracte de nouveau la
						voyelle. Dans les deux cas, la lettre cyrillique est ⟨и⟩, mais le son
						est [ɨ]. Ilya marque cela automatiquement.</p>
						<p><strong>Essayez dans Ilya.</strong> Comparez нет /ɲɛt/ (<em>non</em>) avec нот /not/ (<em>note</em>). Dans нет, le ⟨е⟩ palatalise le ⟨н⟩ en [ɲ] : un geste unique, et
						non [nj]. Dans нот, rien ne se palatalise : le ⟨н⟩ est dur, la voyelle
						est [o], et le ⟨т⟩ est dur. Deux mots courts, de longueur identique, aux
						profils consonantiques entièrement différents. Si la palatalisation dans
						нет est audible et que le ⟨н⟩ dans нот est clairement non palatalisé, le
						système fonctionne.</p>
						<p>Ce principe se prolonge au-delà de la frontière de mot. Considérons
						la locution к Игорю (« chez Igor ») : la préposition к est une consonne
						incapable de palatalisation par elle-même. La frontière de mot l’empêche
						de se palataliser régressivement (6.3, frontière 5). Le к demeure dur.
						Pourtant, la parole est linéaire : le conduit vocal doit passer de ce
						[k] dur directement à la voyelle qui ouvre Игорю. La langue ne peut pas
						bondir instantanément d’une position vélaire dure vers un [i] pleinement
						antérieur. La voyelle s’accommode alors de la consonne qui la précède,
						et se rétracte vers [ɨ]. Le texte cyrillique affiche toujours ⟨и⟩, mais
						le son est [kɨ ˈɡorʲju]. Le i vélaire n’est donc pas réservé aux
						consonnes toujours dures. Il est la conséquence acoustique de toute
						consonne dure rencontrant ⟨и⟩ : la voyelle se plie à la réalité
						articulatoire de la consonne.</p>


<h3 id="learn-unit-7">Section 7 · Assimilation et frontières</h3>

						<h4 id="learn-u7-two">Deux formes d’assimilation régressive</h4>

						<p>Nous venons d’apprendre que la palatalisation se propage à rebours au travers d’un groupe consonantique&#160;: en temps réel, la langue s’arque par anticipation d’un agent palatalisant situé en aval. Nous rencontrons à présent un second processus qui se déplace dans la même direction, et la ressemblance entre les deux justifie un moment d’orientation avant de poursuivre.</p>

						<p>L’assimilation de voisement, comme la palatalisation, est régressive. Elle se propage de droite à gauche dans une séquence consonantique, et pour la même raison fondamentale&#160;: le conduit vocal anticipe ce qui suit. Les deux processus décrivent toutefois deux questions physiques très différentes, ancrées dans le corps et non dans l’abstrait.</p>

						<p>La palatalisation, nous l’avons vu, pose une question à laquelle la langue répond. La lame est-elle arquée vers le palais dur, ou ne l’est-elle pas&#160;? Nous avons travaillé cette opposition à la section 6&#160;: le <code>[ɲ]</code> de нет, où la langue s’arque, face au <code>[n]</code> de нот, où elle ne le fait pas. Cet arc, ou son absence, constitue l’évènement physique qui définit la palatalisation.</p>

						<p>Le voisement pose une question à laquelle le larynx répond. Les cordes vocales vibrent-elles, ou non&#160;? Posez les doigts contre votre gorge et maintenez un <code>[z]</code>&#8239;; vous sentirez la vibration des cordes. Maintenez ensuite un <code>[s]</code> avec le même effort de hauteur&#8239;; la vibration disparait. La bouche et la langue font la même chose dans les deux cas. Ce qui change, c’est l’état des cordes vocales&#160;: ouvertes ou fermées. Voilà l’opposition binaire du voisement.</p>

						<table>
						<thead><tr><th></th><th>Assimilation de voisement</th><th>Palatalisation</th></tr></thead>
						<tbody>
						<tr><td>Lieu physique</td><td>Larynx (cordes vocales)</td><td>Lame de la langue</td></tr>
						<tr><td>L’opposition binaire</td><td>Vibration ou non</td><td>Arc ou non</td></tr>
						<tr><td>Direction</td><td>Régressive (anticipatoire)</td><td>Régressive (anticipatoire)</td></tr>
						<tr><td>Déclenchée par</td><td>L’état de voisement de l’obstruante suivante</td><td>L’agent palatalisant qui suit</td></tr>
						</tbody>
						</table>

						<p>Répétons&#160;: les deux processus sont régressifs parce qu’ils sont tous deux anticipatoires. Le système articulatoire se prépare à ce qu’il sait venir, et cette préparation remonte en amont dans ce qui précède. Ce fonctionnement, qui n’est pas propre au russe, relève de l’efficacité articulatoire et non de l’arbitraire&#160;: vous réalisez déjà des ajustements anticipatoires de voisement en allemand, et une nasalisation anticipatoire en français parlé, sans y penser. La direction est partagée parce que le principe l’est&#8239;; les mécanismes de la palatalisation (l’arc de la langue) et du voisement (l’opposition binaire des cordes vocales) ne le sont pas.</p>

						<p>Cette indépendance permet à une consonne d’être simultanément dévoisée (les cordes cessent de vibrer) et palatalisée (la langue s’arque). Les deux oppositions binaires coexistent sur la même consonne sans interférer l’une avec l’autre. Lorsque la consonne suivante dans un groupe est à la fois molle et sourde, la consonne qui la précède peut subir les deux processus à la fois&#160;: la langue s’arque et le voisement s’éteint. Il ne s’agit pas de transformations alternatives, mais de transformations concurrentes, superposées sur le même son.</p>

						<p>Cette distinction en main, passons à l’assimilation de voisement considérée pour elle-même.</p>

						<h4 id="learn-u7-voiced">Que se passe-t-il lorsqu’une voisée rencontre une sourde&#160;?</h4>

						<p>Le russe ne tolère pas la tension qualitative entre deux consonnes adjacentes dont l’une est voisée et l’autre sourde. La consonne la plus à droite dans le groupe transmet son état de voisement (voisé ou sourd) à la consonne qui la précède, et ce transfert se communique à rebours au travers du groupe entier jusqu’à ce que quelque chose l’arrête.</p>

						<p>Ce principe s’étend. Dans un groupe de deux consonnes, la seconde détermine le voisement de la première. Dans un groupe de trois ou quatre, c’est toujours le dernier élément qui gouverne&#160;: son voisement se propage vers la gauche et le groupe entier émerge avec un voisement uniforme. Grayson formule le principe sans détour&#160;: «&#160;the voicing of the entire cluster is that of the final member&#160;». Considérons -тг-, où le <code>/ɡ/</code> voisé l’emporte et le groupe se lit <code>/dɡ/</code>&#8239;; ou -дк-, où le <code>/k/</code> sourd l’emporte et le groupe se lit <code>/tk/</code>. &Eacute;tendons à quatre consonnes&#160;: -кбсд- se lit <code>/ɡbzd/</code> (le <code>/d/</code> final est voisé, donc tout se voise), tandis que -кбст- se lit <code>/kpst/</code> (le <code>/t/</code> final est sourd, donc tout s’assourdit).</p>

						<p>Trois mots courants illustrent ce phénomène concrètement. Dans водка <code>/ˈvot kɑ/</code> (vodka), le <code>/k/</code> sourd assourdit le ⟨д⟩ précédent de <code>/d/</code> à <code>/t/</code>. Dans вокзал <code>/vɑɡ ˈzɑɫ/</code> (gare), le <code>/z/</code> voisé voise le ⟨к⟩ précédent de <code>/k/</code> à <code>/ɡ/</code>. Dans ложка <code>/ˈɫoʃ kɑ/</code> (cuillère), le <code>/k/</code> sourd assourdit le ⟨ж⟩ précédent de <code>/ʒ/</code> à <code>/ʃ/</code>. Chaque mot contient une seule paire de voisement ; la dernière obstruante l’emporte chaque fois.</p>

						<p>Toutes les consonnes ne participent toutefois pas à ce processus. Les linguistes identifient la classe de consonnes capables d’alterner entre forme voisée et forme sourde sous le nom d’<em>obstruantes</em>. Ce sont les consonnes pour lesquelles l’opposition binaire du voisement est active. Or toutes les consonnes ne sont pas des obstruantes, comme le montre le tableau ci-dessous&#160;:</p>

						<table>
						<thead><tr><th>Sourde</th><th>Voisée</th><th>Lettres cyrilliques</th></tr></thead>
						<tbody>
						<tr><td><code>/p/</code></td><td><code>/b/</code></td><td>⟨п⟩ · ⟨б⟩</td></tr>
						<tr><td><code>/f/</code></td><td><code>/v/</code></td><td>⟨ф⟩ · ⟨в⟩</td></tr>
						<tr><td><code>/t/</code></td><td><code>/d/</code></td><td>⟨т⟩ · ⟨д⟩</td></tr>
						<tr><td><code>/s/</code></td><td><code>/z/</code></td><td>⟨с⟩ · ⟨з⟩</td></tr>
						<tr><td><code>/ʃ/</code></td><td><code>/ʒ/</code></td><td>⟨ш⟩ · ⟨ж⟩</td></tr>
						<tr><td><code>/k/</code></td><td><code>/ɡ/</code></td><td>⟨к⟩ · ⟨г⟩</td></tr>
						<tr><td><code>/ts/</code></td><td><code>[dz]</code></td><td>⟨ц⟩ · (aucune lettre)</td></tr>
						<tr><td><code>/tʃʲ/</code></td><td><code>[dʒʲ]</code></td><td>⟨ч⟩ · (aucune lettre)</td></tr>
						<tr><td><code>/ʃʲʃʲ/</code></td><td><code>[ʒʲʒʲ]</code></td><td>⟨щ⟩ · (aucune lettre)</td></tr>
						</tbody>
						</table>

						<p>Le chanteur reconnaitra les six premières paires dans l’inventaire consonantique de la section 5. Les trois dernières méritent qu’on s’y arrête. Les formes voisées <code>[dz]</code>, <code>[dʒʲ]</code> et <code>[ʒʲʒʲ]</code> ne possèdent aucune lettre cyrillique qui leur soit propre&#8239;; elles n’apparaissent que comme produits de l’assimilation de voisement, le plus souvent aux frontières de mots, mais suffisamment fréquentes ailleurs pour justifier un œil attentif. Nous avons aperçu ces formes dans la discussion des affriquées à la section 5&#160;: ce sont les contreparties allophoniques voisées qui ne naissent que du processus, jamais de la graphie. Rares au sein d’un mot, le chanteur doit savoir qu’elles existent, car Ilya les produira lorsque les conditions les exigeront.</p>

						<p>Par contraste, une classe de consonnes appelées <em>sonantes</em> ne participe pas au processus. Les consonnes du mnémonique «&#160;normal&#160;» (<code>/l/</code>, <code>/m/</code>, <code>/n/</code> et <code>/r/</code>, ainsi que leurs homologues palatalisées) ne déclenchent pas l’assimilation de voisement et ne la subissent pas non plus. Les sonantes sont imperméables au voisement régressif&#160;: elles ne le transmettent ni ne le reçoivent. La chaine de voisement s’arrête à la sonante. En diction lyrique russe, les sonantes ne sont jamais dévoisées, bien que nos collègues linguistes puissent attester qu’elles le sont dans le russe parlé (par ex. <code>[l̥ m̥ n̥ r̥ l̥ʲ m̥ʲ ɲ̥ r̥ʲ]</code>)&#8239;; ces suprasegmentaux de voisement propres à la parole n’apparaitront jamais dans la sortie d’Ilya.</p>

						<div class="learn-callout">
						<p><strong>L’exception du ⟨в⟩</strong></p>
						<p>Sous la graphie ⟨в⟩, le phonème <code>/v/</code> est phonémiquement faible en russe. Il ne déclenche pas l’assimilation de voisement. La lettre ⟨в⟩ est influencée par les consonnes adjacentes (elle subit l’assimilation et se dévoise en <code>/f/</code> devant une consonne sourde), mais elle n’exerce aucune force assimilatrice propre. Lorsque le son <code>/v/</code> est produit en tant que variante voisée de ⟨ф⟩, cette restriction ne s’applique évidemment pas.</p>
						<p>Ce comportement n’est pas intuitif pour le chanteur qui aborde la diction lyrique russe. On sait que <code>/v/</code> est voisé, et on s’attend à ce qu’il voise ce qui le précède, à l’instar de <code>/b/</code> ou <code>/d/</code>. Il n’en fait rien. Le contraste est parlant&#160;: dans сбор, le ⟨б⟩ voise le ⟨с⟩ qui le précède, produisant <code>/zbor/</code>. Dans свобода, le ⟨в⟩ ne voise pas le ⟨с⟩, et le mot commence par <code>/sv/</code>, non <code>/zv/</code>. Le contexte est identique (une consonne voisée suit le ⟨с⟩), mais le résultat diffère parce que ⟨в⟩ est phonémiquement faible&#160;: il se soumet à ses voisins sans jamais leur imposer quoi que ce soit.</p>
						<p>Cette exception s’applique de façon constante et fréquente. Chaque fois que le chanteur rencontre la lettre ⟨в⟩ devant une autre consonne, le voisement de la consonne précédente n’est pas modifié par le ⟨в⟩. C’est l’une des règles les plus utiles de cette section, et l’une des plus faciles à sous-estimer.</p>
						</div>

						<p>Une dernière exception mérite d’être signalée ici. Il s’agit d’une relation particulière entre les trois vélaires (<code>/k ɡ x/</code>) dans le russe chanté. La lettre ⟨г⟩, lorsqu’elle est suivie de ⟨к⟩ ou de ⟨ч⟩ à l’intérieur d’un mot, ne suit pas sa paire sourde habituelle. Au lieu de s’assourdir en <code>/k/</code> (son partenaire normal), elle emprunte exceptionnellement la fricative vélaire <code>/x/</code>&#160;:</p>

						<p>⟨гк⟩ → <code>/xk/</code>&#160;: мягко <code>/ˈmʲɑxkʌ/</code>, легко <code>/lʲɪxˈko/</code><br/>
						⟨гч⟩ → <code>/xtʃʲ/</code>&#160;: легче <code>/ˈlʲɛxtʃʲɪ/</code>, мягче <code>/ˈmʲɑxtʃʲɪ/</code></p>

						<p>Grayson nomme ces cas la règle de мягко [mʲɑxkʌ] (<em>doucement</em>) et la règle de легче [lʲɛxtʃʲɪ] (<em>plus légèrement</em>). Ce sont des cas particuliers, propres à ces radicaux et à leurs dérivés, et qui ne s’appliquent qu’à l’intérieur du mot, jamais au-delà d’une frontière de mot.</p>

						<p>Un mot sur l’assourdissement en finale. Nous avons rencontré l’assourdissement en position finale (analogue à l’allemand) à la section 5, en tant que propriété de l’inventaire consonantique&#160;: les consonnes voisées perdent leur voisement à la fin d’un mot. Sous une condition fréquente, elles peuvent toutefois se revoisir. La façon dont l’assourdissement final interagit avec les frontières de mots et les clitiques fait l’objet de la section 7.4.</p>

						<h4 id="learn-u7-stops">Qu’est-ce qui arrête la propagation du voisement&#160;?</h4>

						<p>Nous connaissons le mécanisme&#160;: la dernière obstruante du groupe transmet son état de voisement de droite à gauche jusqu’à ce que l’ensemble du groupe partage un voisement uniforme. Mais à quoi sert un mécanisme sans limites&#160;? Nous apprenons maintenant ce qui le contraint. Quatre conditions limitent la propagation du voisement en diction lyrique russe, et elles définissent ensemble les frontières de ce système.</p>

						<p><strong>Seules les obstruantes déclenchent l’assimilation de voisement.</strong> L’assimilation de voisement est un processus d’obstruante à obstruante. Trois catégories de sons, bien qu’intrinsèquement voisés, ne la déclenchent pas. Les voyelles sont voisées&#160;: les cordes vocales vibrent tout au long de leur production. Mais une voyelle n’est pas une obstruante. Une voyelle placée après une consonne sourde ne voise pas cette consonne. Les sonantes ne déclenchent pas non plus le processus. Nous l’avons vu à la section 7.2 avec le mnémonique «&#160;normal&#160;»&#160;: les consonnes <code>/l/</code>, <code>/m/</code>, <code>/n/</code> et <code>/r/</code> (ainsi que leurs homologues palatalisées) ne subissent pas l’assimilation de voisement et ne la transmettent pas. Le glide <code>/j/</code> se comporte de la même manière. Le principe est simple&#160;: si le son à droite n’est pas une obstruante, la chaine de voisement ne démarre pas.</p>

						<p><strong>Les sonantes bloquent la transmission.</strong> Une sonante n’est pas simplement un son que la chaine traverserait sans effet&#8239;; c’est un mur auquel la chaine s’arrête. Si le chanteur rencontre un groupe de la forme obstruante + sonante + obstruante, le voisement de l’obstruante la plus à droite ne traverse pas la sonante pour atteindre l’obstruante la plus à gauche. La chaine prend fin à la frontière de la sonante.</p>

						<p><strong>L’exception du ⟨в⟩.</strong> Nous avons traité ce point en détail dans l’encadré de la section 7.2 et le mentionnons ici pour compléter le tableau. La lettre ⟨в⟩ subit l’assimilation (elle s’assourdit en <code>/f/</code> devant une consonne sourde) mais ne la déclenche pas. Le chanteur a déjà intégré le contraste&#160;: le ⟨б⟩ de сбор voise le ⟨с⟩ précédent, produisant <code>/zbor/</code>, tandis que le ⟨в⟩ de свобода ne le fait pas, et le mot commence par <code>/sv/</code>.</p>

						<p><strong>La ponctuation constitue la frontière absolue.</strong> Aucune assimilation, de quelque nature qu’elle soit, ne franchit la ponctuation. C’est l’énoncé de frontière le plus fort du système, et il s’applique non seulement à l’assimilation de voisement, mais à tous les processus assimilatoires, palatalisation comprise (nous rejoignons ici la sixième frontière de la section 6). La ponctuation marque un moment où le conduit vocal se réinitialise. Dans le chant, cette réinitialisation porte un sens poétique&#160;: la virgule, le point, le point-virgule, le point d’interrogation signalent chacun une frontière que le système phonologique respecte de manière absolue.</p>

						<table>
						<thead><tr><th>Condition</th><th>Ce qu’elle signifie</th><th>Introduite en</th></tr></thead>
						<tbody>
						<tr><td>Seules les obstruantes déclenchent</td><td>Les voyelles, les sonantes et <code>/j/</code> ne lancent pas la chaine</td><td>7.2 (implicite)&#8239;; 7.3 (explicite)</td></tr>
						<tr><td>Les sonantes bloquent la transmission</td><td>La chaine s’arrête aux sonantes («&#160;normal&#160;»)&#160;: <code>/l/</code>, <code>/m/</code>, <code>/n/</code>, <code>/r/</code> et leurs homologues palatalisées</td><td>7.2</td></tr>
						<tr><td>⟨в⟩ ne déclenche pas</td><td>⟨в⟩ subit l’assimilation, mais ne l’impose pas</td><td>7.2</td></tr>
						<tr><td>La ponctuation est absolue</td><td>Aucune assimilation ne franchit la ponctuation</td><td>7.3</td></tr>
						</tbody>
						</table>

						<p>Nous tenons à présent l’assimilation de voisement comme un système délimité&#160;: ce qu’elle fait (la dernière obstruante l’emporte), qui y participe (les obstruantes seulement), et ce qui l’arrête (les sonantes, le ⟨в⟩, les sons non obstruants, la ponctuation). Une question reste ouverte. Si le chant est une phonation continue, un flux ininterrompu de son voisé, pourquoi l’assimilation de voisement s’arrêterait-elle à une frontière de mot là où il n’y a ni ponctuation ni souffle&#160;? Telle est la question de la section 7.4.</p>

						<h4 id="learn-u7-boundary">Les mêmes règles s’appliquent-elles d’un mot à l’autre&#160;?</h4>

						<p>Oui. Lorsque des mots adjacents entretiennent un lien syntaxique étroit, sans ponctuation, pause ni souffle entre eux, l’assimilation de voisement s’applique au-delà de la frontière de mot, exactement comme elle le fait à l’intérieur du mot. La frontière de mot ne l’arrête pas. La dernière obstruante l’emporte toujours. Les quatre conditions de la section 7.3 continuent de la contraindre.</p>

						<p>Grayson identifie quatre règles pour l’assimilation de voisement aux frontières de mots (pp. 250–251). La seule disposition nouvelle se trouve dans la deuxième règle&#160;: les sonantes et les voyelles qui commencent le mot suivant permettent à la consonne finale voisée d’une préposition de conserver son voisement.</p>

						<p><strong>Les clitiques&#160;: là où la frontière se dissout.</strong> Un clitique est un petit mot qui ne peut pas fonctionner seul sur le plan phonologique&#8239;; il se rattache à un mot hôte. Les <em>proclitiques</em> fonctionnent comme des préfixes et sont le plus souvent des prépositions&#160;: ⟨в⟩, ⟨к⟩, ⟨с⟩, ⟨из⟩. Les <em>enclitiques</em> sont des particules qui se rattachent à la fin de leur mot hôte&#160;: ⟨бы⟩, ⟨ли⟩, ⟨же⟩. Qu’il soit proclitique ou enclitique, le clitique et son hôte forment une seule unité phonologique&#160;: un seul domaine pour l’accent, la réduction et le voisement. La frontière de mot entre в et саду n’est, phonologiquement, pas une frontière du tout&#160;: c’est un artéfact de la graphie.</p>

						<table>
						<thead><tr><th>Type</th><th>Cyrillique</th><th>API</th><th>Glose</th></tr></thead>
						<tbody>
						<tr><td>Proclitique</td><td>в саду</td><td><code>/fsʌˈdu/</code></td><td>dans le jardin</td></tr>
						<tr><td>Proclitique</td><td>к Дмитрию</td><td><code>/ɡ ˈdʲmʲitʲrʲiju/</code></td><td>vers Dmitri</td></tr>
						<tr><td>Enclitique</td><td>кот бы</td><td><code>/kod bɨ/</code></td><td>un matou pourrait</td></tr>
						<tr><td>Enclitique</td><td>если б мог</td><td><code>/ˈjeslʲi b mok/</code></td><td>si l’on pouvait</td></tr>
						</tbody>
						</table>

						<p>C’est ici que le chanteur voit l’assimilation transfrontalière rendue visible dans Ilya. La notation fléchée (→) relie un clitique à son hôte, et Ilya traite l’ensemble comme un domaine phonologique unique.</p>

						<p><strong>Trois sons qui n’existent que par ce processus.</strong> Trois consonnes voisées n’apparaissent que comme produits de l’assimilation de voisement transfrontalière&#160;: <code>[dz]</code>, <code>[dʒʲ]</code> et <code>[ɣ]</code>. Ces sons ne possèdent pas de graphie propre&#8239;; ils émergent lorsqu’une obstruante sourde se voise par-delà une frontière devant une obstruante voisée dans le mot suivant. Peu fréquents mais non rares, le chanteur doit savoir qu’ils existent, car Ilya les produira lorsque les conditions les exigeront.</p>

						<table>
						<thead><tr><th>Syntagme</th><th>API</th><th>Allophone produit</th></tr></thead>
						<tbody>
						<tr><td>отец бы <em>(le père aurait)</em></td><td><code>/ɑ ˈtʲedz bɨ/</code></td><td><code>[dz]</code> de ⟨ц⟩ devant ⟨б⟩ voisé</td></tr>
						<tr><td>горох же <em>(les pois, donc)</em></td><td><code>/ɡɑ ˈroɣ ʒɨ/</code></td><td><code>[ɣ]</code> de ⟨х⟩ devant ⟨ж⟩ voisé</td></tr>
						</tbody>
						</table>

						<p><strong>Quand les frontières interviennent.</strong> La continuité est l’état par défaut, mais le chanteur ou le compositeur choisit quand la rompre. La ponctuation, comme nous l’avons établi à la section 7.3, constitue la frontière absolue&#160;: aucune assimilation ne la franchit. Un souffle interrompt la phonation continue qui rend possible l’assimilation transfrontalière. Une pause, même sans souffle, réinitialise le conduit vocal. Ces interruptions servent le sens poétique&#8239;; elles ne sont pas des défaillances de continuité.</p>

						<p><strong>Le traitement d’Ilya.</strong> Ilya traite les clitiques de manière explicite&#160;: proclitiques et enclitiques sont joints à leurs mots hôtes et traités comme des unités phonologiques uniques. Les flèches dans la ligne API indiquent l’endroit où le clitique s’est rattaché. Ilya ne peut toutefois pas modéliser toutes les dimensions de la phonation liée. L’outil opérationnalise une compréhension de la façon dont les frontières de mots fonctionnent dans le russe chanté, dérivée des règles de Grayson. L’oreille du chanteur, son répétiteur et son instinct interprétatif demeurent indispensables là où le modèle d’Ilya atteint ses limites.</p>

						<h4 id="learn-u7-deletion">Où est passé le L&#160;? L’effacement consonantique</h4>

						<p>L’<em>effacement</em> dans un groupe consonantique se produit lorsque la prononciation se simplifie par l’omission d’un ou de plusieurs phonèmes attendus. La graphie conserve une lettre vestigiale, mais la langue parlée et chantée ne la réalise pas. Le chanteur connait déjà ce phénomène par le français&#160;: le ⟨p⟩ de «&#160;sculpture&#160;» ne se prononce pas, pas plus que le ⟨p⟩ de «&#160;baptême&#160;» ou le ⟨g⟩ de «&#160;doigt&#160;». Le russe possède son propre ensemble de groupes où l’effacement se produit, et ceux-ci sont finis, précis et mémorisables. Ilya les traite tous automatiquement.</p>

						<table>
						<thead><tr><th>Groupe</th><th>Lecture</th><th>Effacé</th><th>Exemple</th></tr></thead>
						<tbody>
						<tr><td>стн</td><td><code>/sn/</code> ou <code>/sʲɲ/</code></td><td><code>/t/</code></td><td>страстный <code>/ˈstrɑ snɨj/</code></td></tr>
						<tr><td>здн</td><td><code>/zn/</code> ou <code>/zʲɲ/</code></td><td><code>/d/</code></td><td>поздно <code>/ˈpo znʌ/</code></td></tr>
						<tr><td>стл</td><td><code>/sʲlʲ/</code></td><td><code>/t/</code></td><td>счастливо <code>/ʃʲʃʲɑ ˈsʲlʲi vʌ/</code></td></tr>
						<tr><td>стц, здц</td><td><code>/sts/</code></td><td><code>/t/</code> ou <code>/d/</code></td><td>истца <code>/is ˈtsɑ/</code></td></tr>
						<tr><td>ндц [нтц]</td><td><code>/nts/</code></td><td><code>/d/</code></td><td>голландцы <code>/ɡɑ ˈɫɑn tsɨ/</code></td></tr>
						<tr><td>рдц</td><td><code>/rts/</code></td><td><code>/d/</code></td><td>сердце <code>/ˈsʲɛr tsɨ/</code></td></tr>
						<tr><td>стск</td><td><code>/sʲːkʲ/</code></td><td><code>/t/</code></td><td>марксистский <code>/mʌrk ˈsʲi sʲːkʲij/</code></td></tr>
						<tr><td>ндск, нтск</td><td><code>/ɲsʲkʲ/</code></td><td><code>/d/</code> ou <code>/t/</code></td><td>голландский <code>/ɡɑ ˈɫɑɲ sʲkʲij/</code></td></tr>
						<tr><td>лнц</td><td><code>/nts/</code></td><td><code>/l/</code></td><td>солнце <code>/ˈson tsɨ/</code></td></tr>
						<tr><td>вств</td><td><code>/stv/</code> ou <code>/sʲtʲvʲ/</code></td><td>premier <code>/v/</code></td><td>чувство <code>/ˈtʃʲu stvʌ/</code></td></tr>
						</tbody>
						</table>

						<p><strong>сердце</strong> [sʲɛrtsɨ] (<em>cœur</em>)&#160;: le ⟨д⟩ est muet. Parmi les mots les plus fréquents de la littérature vocale russe.</p>
						<p><strong>поздно</strong> [poznʌ] (<em>tard</em>)&#160;: le ⟨д⟩ est muet. Fréquent dans la mélodie et l’opéra.</p>
						<p><strong>солнце</strong> [sontsɨ] (<em>soleil</em>)&#160;: le ⟨л⟩ est muet. C’est lui qui a inspiré le titre de cette sous-section.</p>
						<p><strong>здравствуйте</strong> [zdrɑstvujtʲɪ] (<em>bonjour</em>)&#160;: le premier ⟨в⟩ est muet. Chaque chanteur de russe connait cette salutation.</p>

						<h4 id="learn-u7-mergers">Fusions et absorptions</h4>

						<p>Transcrivez сжигать (bruler) dans Ilya. La graphie montre ⟨сж⟩, deux consonnes, l’une sourde et l’autre voisée. La ligne API affiche <code>/ʒː/</code>, une seule fricative voisée, allongée. Ni le <code>/s/</code> ni le <code>/ʒ/</code> n’ont survécu individuellement&#8239;; quelque chose de nouveau a pris leur place. C’est la <em>fusion consonantique</em>&#160;: deux lettres entrent dans un groupe, et le groupe acquiert un son qui remplace ce que l’une ou l’autre des consonnes d’origine aurait produit seule.</p>

						<table>
						<thead><tr><th>Groupe</th><th>Lecture</th><th>Exemple</th></tr></thead>
						<tbody>
						<tr><td>сш, зш</td><td><code>/ʃː/</code></td><td>бесшумно <code>/bʲɪ ˈʃːum nʌ/</code> (silencieusement)</td></tr>
						<tr><td>зж, сж</td><td><code>/ʒː/</code></td><td>сжигать <code>/ʒːɨ ˈɡɑtʲ/</code> (bruler)</td></tr>
						</tbody>
						</table>

						<table>
						<thead><tr><th>Groupe</th><th>Lecture</th><th>Exemple</th></tr></thead>
						<tbody>
						<tr><td>сч, зч, жч, стч, здч, ссч</td><td><code>/ʃʲʃʲ/</code></td><td>мужчина <code>/mu ˈʃʲʃʲi nɑ/</code> (homme)</td></tr>
						<tr><td>тш, дш, чш</td><td><code>/tʃː/</code></td><td>младший <code>/ˈmɫɑ tʃːɨj/</code> (cadet)</td></tr>
						<tr><td>дж, тж</td><td><code>/dʒː/</code></td><td>поджёг <code>/pɑ ˈdʒːok/</code> (il a mis le feu)</td></tr>
						<tr><td>тч, дч</td><td><code>/tʲːʃʲː/</code></td><td>вотчина <code>/ˈvo tʲːʃʲːi nʌ/</code> (domaine)</td></tr>
						</tbody>
						</table>

						<p><strong>Les groupes -тс-, -дс- et -тьс-.</strong> Voici le seul cas, dans cette sous-section, où le contexte détermine le résultat. <strong>Aux frontières de préfixe ou de mot,</strong> les consonnes restent séparées&#160;: <code>/t–s/</code>. отстоять <code>/ɑt stɑ ˈjɑtʲ/</code> (tenir bon). <strong>Dans les terminaisons de verbes réfléchis</strong> (-тся, -ться) <strong>et dans les groupes</strong> -тц-, -дц-, l’occlusive s’allonge légèrement avant la sibilante&#160;: <code>/tːs/</code>. боится <code>/bɑ ˈi tːsʌ/</code> (a peur), купаться <code>/ku ˈpɑ tːsʌ/</code> (se baigner), отца <code>/ɑ ˈtːsɑ/</code> (du père). <strong>L’exception de цвет&#160;:</strong> les dérivés de цвет (couleur) palatalisent le groupe&#160;: отцветать <code>/ɑ tʲːsʲvʲɪ ˈtɑtʲ/</code> (se faner).</p>

						<h4 id="learn-u7-unusual">Deux cas particuliers&#160;: скучно et что</h4>

						<p>Dans un petit nombre de mots, la consonne concernée neutralise son élément occlusif, ne laissant qu’une articulation fricative qui représente un phonème apparenté mais distinct. Concrètement, ⟨ч⟩ <code>/tʃʲ/</code> perd sa composante occlusive <code>[t]</code> et se réduit à <code>/ʃ/</code>, caractéristiquement non palatalisé. Grayson propose de nommer les deux contextes où ⟨ч⟩ se lit <code>/ʃ/</code> la règle de скучно et la règle de что.</p>

						<table>
						<thead><tr><th>Groupe</th><th>Lecture</th><th>Exemples</th></tr></thead>
						<tbody>
						<tr><td>чн</td><td><code>/ʃn/</code></td><td>скучный <code>/ˈsku ʃnɨj/</code>, скучно <code>/ˈsku ʃnʌ/</code>, конечно <code>/kɑ ˈɲɛ ʃnʌ/</code></td></tr>
						<tr><td>чт</td><td><code>/ʃt/</code></td><td>что <code>/ʃto/</code>, чтобы <code>/ˈʃto bɨ/</code>, ничто <code>/ɲɪ ˈʃto/</code></td></tr>
						</tbody>
						</table>

						<p>Notons les contre-exemples. конечный conserve <code>/tʃʲn/</code>&#160;: <code>/kɑ ˈɲɛtʃʲ nɨj/</code>. нечто conserve <code>/tʃʲt/</code>&#160;: <code>/ˈɲɛtʃʲ tʌ/</code>. Ces formes confirment que l’exception est propre au mot, et non un schéma généralisable.</p>

						<p>Un dernier phénomène nous attend. Lorsqu’une même consonne apparait deux fois, par la graphie ou au point de rencontre de deux mots, le chanteur la prononce-t-il une fois ou deux&#160;? C’est la question de la section 7.8.</p>

						<h4 id="learn-u7-geminates">Deux fois plutôt qu’une&#160;: les géminées</h4>

						<p>De façon nuancée. Le chanteur qui arrive de la diction italienne doit recalibrer ses attentes. Les géminées russes ne sont pas emphatiques&#8239;; elles sont discrètes, d’une durée à peine supérieure à celle d’une consonne simple. Grayson formule le principe ainsi (p. 226)&#160;: «&#160;think of speaking the single consonant twice without any break in between&#160;», sans pulsation sur la seconde itération.</p>

						<p>La plupart des consonnes doublées à l’écrit, au sein d’un mot russe, se prononcent comme une consonne simple. Un exemple récurrent est le mot русский, qui s’écrit avec deux ⟨сс⟩ mais se prononce avec un seul <code>/s/</code>&#160;: <code>/ˈru sʲkʲij/</code>. Les doublements aux frontières de mots sont en revanche généralement prononcés comme des consonnes doublées.</p>

						<table>
						<thead><tr><th>Comportement</th><th>Groupes</th><th>Exemples</th></tr></thead>
						<tbody>
						<tr><td>Toujours doublé</td><td>гг, дд/тд, жж/зж, зз/сз</td><td>отдать, жужжать</td></tr>
						<tr><td>Le plus souvent doublé</td><td>вв, бб</td><td>ввоз doublé&#8239;; раввин simple</td></tr>
						<tr><td>Simple dans le mot, doublé aux frontières</td><td>рр</td><td>терраса simple&#8239;; актёр рад doublé</td></tr>
						<tr><td>Généralement simple</td><td>кк, лл, мм, пп, фф/вф</td><td>аккорд simple&#8239;; мокко doublé</td></tr>
						<tr><td>Variable selon le contexte</td><td>нн, сс, тт/дт</td><td>ванна, касса, гетто</td></tr>
						<tr><td>Très rare, emprunts</td><td>цц, чч</td><td>палаццо, пиццикато</td></tr>
						</tbody>
						</table>

						<p><strong>Les contrôles d’Ilya.</strong> La notation par défaut des géminées dans Ilya correspond à la préférence de Grayson pour les symboles API doublés. Le basculeur de géminées, dans la section Notation du Tiroir, permet d’appliquer un changement global à la notation des géminées. La case à cocher dans les entrées pertinentes du Tiroir permet de contrôler la notation localement, mot par mot. Ces contrôles existent parce que la décision simple ou double relève souvent de l’interprétation, non de l’absolu. Là encore, rien ne remplace l’oreille d’un répétiteur natif.</p>

						<h4 id="learn-u7-tryit">&Agrave; vous de jouer dans Ilya</h4>

						<p>Nous tenons à présent le système complet&#160;: l’assimilation de voisement et les conditions qui la contraignent, l’effacement, la fusion, les cas particuliers, et les géminées. Ce qui suit n’est pas de la matière nouvelle. C’est un exercice guidé qui permet de voir les principes des sections 7.1 à 7.8 à l’œuvre dans Ilya.</p>

						<p><strong>L’assimilation de voisement.</strong> Transcrivez сбор (collecte). Le ⟨с⟩ s’est voisé en <code>/z/</code> devant le ⟨б⟩ voisé&#160;: la dernière obstruante l’emporte. Transcrivez maintenant свобода (liberté). Le ⟨с⟩ reste <code>/s/</code>, car le ⟨в⟩ ne déclenche pas l’assimilation de voisement. Transcrivez мягко (doucement). Le ⟨г⟩ ne s’assourdit pas en son partenaire habituel <code>/k/</code>&#8239;; il emprunte la fricative vélaire <code>/x/</code>, produisant <code>/xk/</code>.</p>

						<p><strong>Par-delà la frontière.</strong> Transcrivez в саду (dans le jardin). Le proclitique ⟨в⟩ s’est assourdi en <code>/f/</code> devant le <code>/s/</code> sourd de son mot hôte. Transcrivez maintenant к Дмитрию (vers Dmitri). Le proclitique ⟨к⟩ s’est voisé en <code>/ɡ/</code> devant le <code>/d/</code> voisé.</p>

						<p><strong>L’effacement.</strong> Transcrivez сердце [sʲɛrtsɨ] (<em>cœur</em>), солнце [sontsɨ] (<em>soleil</em>) et поздно [poznʌ] (<em>tard</em>). Dans chaque mot, comptez les consonnes dans la ligne cyrillique, puis comptez-les dans la ligne API. Une consonne que la graphie conserve a été silencieusement effacée.</p>

						<p><strong>La fusion.</strong> Transcrivez сжигать (bruler). Deux consonnes, ⟨сж⟩, ont fusionné en un <code>/ʒː/</code> allongé unique. Transcrivez мужчина (homme). Le groupe ⟨жч⟩ se lit <code>/ʃʲʃʲ/</code>. Transcrivez боится (a peur). La terminaison réfléchie -тся se lit <code>/tːsʌ/</code>.</p>

						<p><strong>Les cas particuliers.</strong> Transcrivez конечно (bien sûr) et что (quoi). Dans les deux mots, ⟨ч⟩ a perdu sa composante occlusive et s’est réduit à <code>/ʃ/</code>.</p>

						<p><strong>Les géminées.</strong> Transcrivez русский (russe). La graphie montre deux ⟨сс⟩, mais la ligne API affiche un seul <code>/s/</code>. Ouvrez le Tiroir et repérez les contrôles de géminées.</p>

						<p>La couche d’enseignement du module LEÇONS est complète. Chaque règle dont le chanteur a besoin pour lire un texte russe à l’aide d’Ilya a été présentée, de l’alphabet jusqu’à l’assimilation. Pour le comportement complet de chaque lettre, la Couche de référence est alphabétisée, reliée par hyperliens et encyclopédique. Et pour ce qu’aucune règle ni aucun outil ne saurait entièrement saisir, il y a l’oreille d’un répétiteur natif.</p>

						<p><em>Grayson source&#160;: Ch. 5 §§2–5 (pp. 150–262), Ch. 7 §2 (pp. 247–258). Appendix F (pp. 312–313).</em></p>

						<h2 id="learn-coda">8 · Les inclassables</h2>

						<p><em>Avons-nous tout couvert&#160;? Est-ce possible&#160;? Qui comble les vides&#160;?</em></p>

						<p>Les sections précédentes enseignent un système&#160;: les règles phonologiques de la diction lyrique russe telles que les formule Craig Grayson. Ce système est puissant. Un chanteur qui en maîtrise les principes peut aborder un texte russe inconnu et, en appliquant les règles de Grayson, parvenir à une transcription défendable la plupart du temps. Ilya vit ici, dans ce premier palier de savoir phonologique&#160;: celui où les règles prédisent les résultats et où le chanteur peut les appliquer à des mots jamais rencontrés.</p>

						<p>Or, toute prononciation correcte en diction lyrique russe n’est pas déductible des règles de cette manière. Certaines prononciations établies résistent entièrement à la déduction&#160;: des pratiques observées qui échappent à la systématisation.</p>

						<p>Prenons quelques cas déjà rencontrés au fil de ces sections. L’assourdissement final est une règle phonologique&#160;: on l’apprend une fois, on l’applique partout. Mais le <code>/sʲ/</code> palatalisé de смерть <code>/sʲmʲerʲtʲ/</code> (<em>mort</em>) relève d’un tout autre ordre. On peut en nommer la cause (une tradition théâtrale dite prononciation scénique, attestée par Avanesov, Derwing et Priestly, et Grayson), mais aucun principe phonologique ne permet au chanteur de prédire que ce <code>/s/</code> précis se palatalise. Savoir pourquoi enrichit la compréhension sans modifier la consigne&#160;: devant смерть, palatalisez le <code>/s/</code>. Considérons ensuite скучно <code>/ˈsku ʃnʌ/</code> (<em>ennuyeux</em>), où la composante occlusive <code>/t/</code> de l’affriquée ⟨ч⟩ <code>/tʃʲ/</code> s’efface pour ne laisser que <code>[ʃn]</code>. On peut décrire ce qui se produit, mais on ne peut prédire quels mots le subissent. конечно <code>/kɑ ˈɲɛ ʃnʌ/</code> (<em>bien sûr</em>) oui&#160;; точно <code>/ˈto tʃʲnʌ/</code> (<em>exactement</em>) non. Considérons aussi сейчас <code>/sɪj ˈtʃʲɑs/</code> (<em>maintenant</em>), l’un des mots les plus fréquents de la mélodie russe. Sa prononciation courante est si fortement réduite que le chanteur formé uniquement à l’oreille risque d’importer des habitudes de parole dans le registre lyrique. La forme intégrale en diction lyrique, avec son glide intact et sa qualité vocalique délibérée, est un savoir que le chanteur doit simplement posséder. Aucune règle phonologique des sections 1 à 7 ne signale que ce mot précis exige une attention particulière ; c’est la fréquence et la convention qui le font.</p>

						<p>Ces cas occupent deux paliers distincts au-delà des règles phonologiques. Dans l’un, la cause est connue mais son application est imprévisible. Dans l’autre, le mécanisme est descriptible mais sa survenance est gouvernée par le lexique. Le fil conducteur des deux paliers est étymologique et traditionnel, non phonologique. On peut nommer la cause après coup. On ne peut engendrer la règle d’avance.</p>

						<p>Ilya rend compte de ces cas par des annotations ciblées&#160;: propres à chaque mot, référencées, et délibérément non généralisantes. Ilya ne présente pas ces cas comme des règles que le chanteur aurait manquées, car aucune règle n’existait à manquer.</p>

						<p>Ce qu’Ilya ne pourra jamais faire, c’est remplacer le savoir qui vit dans le corps, dans la tradition et dans le studio. Ilya prépare le chanteur à ces conversations, mais ne saurait s’y substituer. Nous sommes convaincus que cette forme de transmission exigera toujours une expertise humaine, et nous y voyons une richesse de l’art vocal, non une limite.</p>

						<h2 id="learn-try">Essayez</h2>

						<p>Tout au long de LEÇONS, vous trouverez des invitations à coller un mot ou une phrase dans l'onglet Transcription. LEÇONS énonce le principe; Ilya le démontre en direct. L'outil devient le laboratoire du module. Lorsque nous discutons de l'accent et des homographes, par exemple, vous pourriez transcrire <em>мука</em> avec l'accent sur la première syllabe, puis sur la seconde, et observer la transcription entière se transformer sous vos yeux. Lorsque nous abordons la réduction vocalique, <em>хорошо</em> offre trois ⟨о⟩ identiques à l'écrit, prononcés de trois manières différentes.</p>

						<h2 id="learn-notation">Note sur la notation</h2>

						<p>La notation phonétique est paradigmatique, non absolue. Une comparaison de dix ressources imprimées de diction lyrique russe révèle dix approches différentes de la notation de la palatalisation seule, et des inventaires vocaliques allant de sept à dix symboles. Les choix API de Grayson représentent un ensemble cohérent et bien raisonné parmi plusieurs. Là où les autorités divergent (sur la transcription de ⟨щ⟩, sur la représentation des nasales palatalisées, sur les symboles de voyelles réduites), les différences reflètent des positions réfléchies, non des erreurs. Les sélecteurs de notation d'Ilya dans l'onglet Transcription rendent ces choix visibles et réversibles : vous pouvez lire à leur sujet ici, puis les voir en action là-bas. Il ne s'agit pas de tribalisme; il s'agit de comprendre les principes sous-jacents aux symboles, afin de prendre des décisions éclairées dans votre propre pratique.</p>

						<hr />

						<p><em>LEÇONS est une réorganisation pédagogique du travail doctoral de Craig Grayson, préparée avec son consentement. Le contenu est rédigé par Dann Mitton et s'appuie sur sa thèse de doctorat en musique (Université de Toronto) et vingt-cinq ans de pratique et d'enseignement du répertoire de basse d'opéra.</em></p>

						{:else}
						<h1 id="learn-title">Russian Lyric Diction for Singers</h1>

						<p>The sounds of sung Russian are not as distant from what you already know as they may first appear: many of the consonants behave exactly as their counterparts do in the languages you have studied, and the vowel system, while it operates under different rules, is smaller and more orderly than English. What Russian asks of you is not a leap into the unknown but an extension of skills you already possess, guided by a clear and well-documented phonological framework.</p>

						<p>A few things worth knowing as we start.</p>

						<p><strong>You already read IPA.</strong> <em>Ilya</em> assumes you have worked with the International Phonetic Alphabet in at least one other sung language. If you can read an Italian, French, or German lyric diction transcription, you already have most of the tools you need. Russian adds a small number of unfamiliar symbols to the system. We explore those later.</p>

						<p><strong>Lyric diction is a stylised register.</strong> Russian audiences expect a certain amount of artifice with their singing, stage work, and poetry. Just as singing "dew" as <code>[djuː]</code> is not how most English speakers talk, sung Russian imposes some stylised pronunciations. Sung Russian is not conversational Russian. Accordingly, Russian lyric diction occupies an elevated register: more precise than speech, shaped by the needs of sustained unamplified vocal production, and grounded in literary and stage pronunciation tradition. Dr. Craig Grayson's <em>Russian Lyric Diction</em> (2012) describes this register systematically, and <em>Ilya</em> operationalises his work for you. When you see an IPA symbol in <em>Ilya</em>, it reflects Grayson's style of notation. When you see the same symbol in his dissertation, it means the same thing. That is the promise.</p>

						<p><strong>Rules describe what Russian does.</strong> Throughout LEARN, we present rules not as laws to memorise but as synthesised descriptions of how Russian behaves. Russian words undergo certain transformations in certain contexts. We name and describe those transformations, offer you examples, and point you to <em>Ilya</em> so you can see them happen in real time with real text. The rules are patterns for you to recognise, not arbitrary statutes to enforce.</p>

						<h2 id="learn-about">About This Module</h2>

						<p>LEARN presents the core principles of Russian lyric diction as established by Craig Grayson in his 2012 doctoral dissertation, <em>Russian Lyric Diction: A practical guide with introduction and annotations and a bibliography with annotations on selected sources</em> (University of Washington). What follows is a pedagogical resequencing of Grayson's work, designed for singers rather than linguists, and structured to build incrementally from what you already know.</p>

						<p>Grayson is not the first to cover this ground. From Natalia Challis' pioneering Rachmaninoff volume (1989) through the transcriptions of Piatak and Avrashov (1991), Richter's six-volume series (1999-2008), Belov's libretti (2004), and the contributions of Olin (2012), McMaster (in Sheil, 2012), and Thomas (in Karna, 2010), singers have had resources of increasing value and scope. What Grayson provides is a consolidation: a diction guide grounded in orthodox IPA, informed by Russian phonology, and rigorous enough that the motivated reader can produce original transcriptions with a workable level of independence. In Sarah Dailey's useful taxonomy, the earlier resources serve primarily as "fast-track guides" offering ready-made transcriptions, while Grayson proposes an "independent study guide" that teaches the underlying system.</p>

						<p>Three boundaries protect our focus. This is not a Russian language course: we teach pronunciation, not grammar, except where grammatical awareness directly affects how a word sounds. This is not a substitute for Grayson's dissertation: the full scholarly apparatus lives in the source, and we honour it by building on it rather than replicating it. And this is not a guide to using Ilya; the Guide tab teaches the tool. LEARN teaches the diction.</p>

						<h2 id="learn-arc">The Learning Arc</h2>

						<p>The module is organised into seven units that follow a single governing principle: meet the sounds first, then learn what happens to them.</p>


						<h3 id="learn-unit-1">Section 1 · The Letters</h3>

						<p>Contemporary Standard Russian (CSR) uses thirty-three letters, but you will sometimes see four additional, obsolete characters in old print scores; these were discarded with the 1918 spelling reform. That is the entire system, and by the end of this section you will have met every member of it.</p>

						<p>We begin with a song.</p>

						<h4 id="learn-u1-song">The Russian Alphabet Song</h4>

						<figure>
							<img src="/images/russian-alphabet-song.png" alt="Russian Alphabet Song, arranged by Dann Mitton 2017. Bass voice in B-flat major, Moderato. All thirty-three Cyrillic letters set in dictionary order with IPA transcription beneath each letter-name." style="width: 100%; height: auto; border-radius: 4px;" />
							<figcaption>Russian Alphabet Song, arr. Dann Mitton 2017. After Ken Griffiths.</figcaption>
						</figure>

						<p>Russian children learn the Cyrillic alphabet by rote. This Russian Alphabet Song is a Westernised construct set to the melody of a traditional drinking song. It sets all thirty-three letters in their dictionary order, each sung on its Russian letter-name. The closing phrase offers this pragmatic advice: "To speak Russian you need to learn the alphabet!" Sing through it once or twice in the key that best suits you and you will already have the sequence under your fingers.</p>

						<h4 id="learn-u1-alphabet">The Alphabet</h4>

						<p>The table below presents the thirty-three modern Russian letters in their standard dictionary order, plus the four pre-1918 obsolete letters. Each letter features its Russian name, its sound category (vowel, consonant, or sign), and a basic IPA anchor: the default sound that letter represents before any of the contextual transformations apply. For vowels, this is its stressed, cardinal value. For consonants, this is usually its unpalatalised (or, 'hard') default, with a few memorable exceptions.</p>

						<p>Sections 2 through 7 teach what Russian does to these sounds in context: how stress impacts vowels, how consonants 'soften' (or, palatalise) before certain letters, and how sounds influence their neighbours across word boundaries. For now, let's meet the letters and their most basic identities as they apply to sung Russian.</p>

						<table>
						<thead><tr><th>#</th><th>Letter</th><th>Name</th><th>Category</th><th>Anchor</th><th>Notes</th></tr></thead>
						<tbody>
						<tr><td>1</td><td><strong>А а</strong></td><td>а <code>[ɑ]</code></td><td>vowel</td><td><code>[ɑ]</code></td><td>Open back vowel. The singer knows this from English.</td></tr>
						<tr><td>2</td><td><strong>Б б</strong></td><td>бэ <code>[bɛ]</code></td><td>consonant</td><td><code>[b]</code></td><td>Voiced bilabial plosive.</td></tr>
						<tr><td>3</td><td><strong>В в</strong></td><td>вэ <code>[vɛ]</code></td><td>consonant</td><td><code>[v]</code></td><td>Voiced labiodental fricative. Looks like Latin B; sounds like V.</td></tr>
						<tr><td>4</td><td><strong>Г г</strong></td><td>гэ <code>[gɛ]</code></td><td>consonant</td><td><code>[ɡ]</code></td><td>Voiced velar plosive.</td></tr>
						<tr><td>5</td><td><strong>Д д</strong></td><td>дэ <code>[dɛ]</code></td><td>consonant</td><td><code>[d]</code></td><td>Voiced dental plosive. Russian <code>[d]</code> is dental, not alveolar.</td></tr>
						<tr><td>6</td><td><strong>Е е</strong></td><td>е <code>[jɛ]</code></td><td>vowel</td><td><code>[jɛ]</code></td><td>Iotated vowel. After a consonant, the <code>[j]</code> is absorbed as palatalisation of that consonant.</td></tr>
						<tr><td>7</td><td><strong>Ё ё</strong></td><td>ё <code>[jo]</code></td><td>vowel</td><td><code>[jo]</code></td><td>Iotated vowel. Always stressed: the only predictable vowel in Russian. Often printed without its diaeresis.</td></tr>
						<tr><td>8</td><td><strong>Ж ж</strong></td><td>жэ <code>[ʒɛ]</code></td><td>consonant</td><td><code>[ʒ]</code></td><td>Voiced postalveolar fricative. Always hard: never palatalises.</td></tr>
						<tr><td>9</td><td><strong>З з</strong></td><td>зэ <code>[zɛ]</code></td><td>consonant</td><td><code>[z]</code></td><td>Voiced dental fricative.</td></tr>
						<tr><td>10</td><td><strong>И и</strong></td><td>и <code>[i]</code></td><td>vowel</td><td><code>[i]</code></td><td>Close front vowel. Identical across Italian, French, German, and English lyric diction.</td></tr>
						<tr><td>11</td><td><strong>Й й</strong></td><td>и краткое <code>[ˈkrɑt kʌ jɛ]</code></td><td>consonant</td><td><code>[j]</code></td><td>The palatal glide. Russians consider "Short i" to be a palatalised consonant, unlike its semivowel status in English and French.</td></tr>
						<tr><td>12</td><td><strong>К к</strong></td><td>ка <code>[kɑ]</code></td><td>consonant</td><td><code>[k]</code></td><td>Voiceless velar plosive.</td></tr>
						<tr><td>13</td><td><strong>Л л</strong></td><td>эл <code>[ɛl]</code></td><td>consonant</td><td><code>[l]</code> / <code>[ɫ]</code></td><td>Two forms: either palatalised <code>[lʲ]</code> or dark <code>[ɫ]</code>. Context determines which.</td></tr>
						<tr><td>14</td><td><strong>М м</strong></td><td>эм <code>[ɛm]</code></td><td>consonant</td><td><code>[m]</code></td><td>Bilabial nasal.</td></tr>
						<tr><td>15</td><td><strong>Н н</strong></td><td>эн <code>[ɛn]</code></td><td>consonant</td><td><code>[n]</code></td><td>Dental nasal. Looks like Latin H; sounds like N.</td></tr>
						<tr><td>16</td><td><strong>О о</strong></td><td>о <code>[o]</code></td><td>vowel</td><td><code>[o]</code></td><td>Close-mid back rounded vowel. Only appears as <code>[o]</code> when stressed. Alone or at the end of words, Russian <code>[o]</code> is <code>[oːʌ̯]</code>.</td></tr>
						<tr><td>17</td><td><strong>П п</strong></td><td>пэ <code>[pɛ]</code></td><td>consonant</td><td><code>[p]</code></td><td>Voiceless bilabial plosive.</td></tr>
						<tr><td>18</td><td><strong>Р р</strong></td><td>эр <code>[ɛr]</code></td><td>consonant</td><td><code>[r]</code></td><td>Dental trill. Looks like Latin P; sounds like a rolled R.</td></tr>
						<tr><td>19</td><td><strong>С с</strong></td><td>эс <code>[ɛs]</code></td><td>consonant</td><td><code>[s]</code></td><td>Voiceless dental fricative. Looks like Latin C; sounds like S.</td></tr>
						<tr><td>20</td><td><strong>Т т</strong></td><td>тэ <code>[tɛ]</code></td><td>consonant</td><td><code>[t]</code></td><td>Voiceless dental plosive. Russian <code>[t]</code> is dental, not alveolar.</td></tr>
						<tr><td>21</td><td><strong>У у</strong></td><td>у <code>[u]</code></td><td>vowel</td><td><code>[u]</code></td><td>Close back rounded vowel. Maintains its quality regardless of stress.</td></tr>
						<tr><td>22</td><td><strong>Ф ф</strong></td><td>эф <code>[ɛf]</code></td><td>consonant</td><td><code>[f]</code></td><td>Voiceless labiodental fricative.</td></tr>
						<tr><td>23</td><td><strong>Х х</strong></td><td>ха <code>[xɑ]</code></td><td>consonant</td><td><code>[x]</code></td><td>Voiceless velar fricative. Looks like Latin X; this fricative has the same place as <code>[k]</code> and <code>[ɡ]</code>.</td></tr>
						<tr><td>24</td><td><strong>Ц ц</strong></td><td>цэ <code>[tsɛ]</code></td><td>consonant</td><td><code>[ts]</code></td><td>Voiceless dental affricate. Always hard: never palatalises. <code>[ts]</code> is an inseparable digraph.</td></tr>
						<tr><td>25</td><td><strong>Ч ч</strong></td><td>че <code>[tʃʲɛ]</code></td><td>consonant</td><td><code>[tʃʲ]</code></td><td>Voiceless postalveolar affricate. Always soft: inherently palatalised. Inseparable trigraph.</td></tr>
						<tr><td>26</td><td><strong>Ш ш</strong></td><td>ша <code>[ʃɑ]</code></td><td>consonant</td><td><code>[ʃ]</code></td><td>Voiceless postalveolar fricative. Always hard: never palatalises.</td></tr>
						<tr><td>27</td><td><strong>Щ щ</strong></td><td>ща <code>[ʃtʃʲɑ]</code></td><td>consonant</td><td><code>[ʃʲʃʲ]</code></td><td>Long palatalised postalveolar fricative. Always soft. Grayson's modern rendering.</td></tr>
						<tr><td>28</td><td><strong>Ъ ъ</strong></td><td>твёрдый знак <code>[ˈtvʲor dɨj znɑk]</code></td><td>sign</td><td>—</td><td>The hard sign. A boundary marker. No sound of its own.</td></tr>
						<tr><td>29</td><td><strong>Ы ы</strong></td><td>ы <code>[ɨ]</code></td><td>vowel</td><td><code>[ɨ]</code></td><td>Close central vowel. The genuinely new sound for most singers.</td></tr>
						<tr><td>30</td><td><strong>Ь ь</strong></td><td>мягкий знак <code>[mʲɑxʲ kʲij znɑk]</code></td><td>sign</td><td>—</td><td>The soft sign. Palatalises the preceding consonant. No sound of its own.</td></tr>
						<tr><td>31</td><td><strong>Э э</strong></td><td>э <code>[ɛ]</code></td><td>vowel</td><td><code>[ɛ]</code></td><td>Open-mid front vowel. Close to French ⟨è⟩ or Italian open ⟨e⟩.</td></tr>
						<tr><td>32</td><td><strong>Ю ю</strong></td><td>ю <code>[ju]</code></td><td>vowel</td><td><code>[ju]</code></td><td>Iotated vowel. After a consonant, the <code>[j]</code> is absorbed as palatalisation.</td></tr>
						<tr><td>33</td><td><strong>Я я</strong></td><td>я <code>[jɑ]</code></td><td>vowel</td><td><code>[jɑ]</code></td><td>Iotated vowel. After a consonant, the <code>[j]</code> is absorbed as palatalisation.</td></tr>
						<tr><td>—</td><td><strong>Ѣ ѣ</strong></td><td>ять <code>[jɑtʲ]</code></td><td>obsolete</td><td>→ Е е</td><td>Pre-1918. Substitute its modern counterpart.</td></tr>
						<tr><td>—</td><td><strong>Ѳ ѳ</strong></td><td>фита <code>[fʲitɑ]</code></td><td>obsolete</td><td>→ Ф ф</td><td>Pre-1918. Substitute its modern counterpart.</td></tr>
						<tr><td>—</td><td><strong>І і</strong></td><td>и десятеричное <code>[dʲɪ sʲɪ tʲɪ ˈrʲitʃʲ nɑ jɪ]</code></td><td>obsolete</td><td>→ И и</td><td>Pre-1918. "Decimal i." Substitute its modern counterpart.</td></tr>
						<tr><td>—</td><td><strong>Ѵ ѵ</strong></td><td>ижица <code>[ˈi ʒɨ tsɑ]</code></td><td>obsolete</td><td>→ И и</td><td>Pre-1918. Rare even before the reform. Substitute its modern counterpart.</td></tr>
						</tbody>
						</table>

						<p>When you encounter an obsolete letter in an older score, <em>Ilya</em> automatically swaps it for its modern counterpart.</p>

						<h4 id="learn-u1-familiar">What You Already Know</h4>

						<p>You already know more of the Cyrillic alphabet than you might think. We grouped the tables below based on their familiarity to readers of Latin script. This is a purely visual sorting, not a phonological one: it is about letter recognition, not about how their sounds work.</p>

						<p><strong>Familiar Shapes</strong></p>

						<p>These letters look like their Latin counterparts and behave as you would expect. No surprises here.</p>

						<table>
						<thead><tr><th>Cyrillic</th><th>Latin lookalike</th><th>IPA</th><th>What the singer already knows</th></tr></thead>
						<tbody>
						<tr><td><strong>А а</strong></td><td>A a</td><td><code>[ɑ]</code></td><td>Italian <code>[ɑ]</code> as in <em>father</em>. Russian defaults to the open back <code>[ɑ]</code>; the brighter <code>[a]</code> (pizza!) appears only in specific palatal environments (Section 3).</td></tr>
						<tr><td><strong>Е е</strong></td><td>E e</td><td><code>[jɛ]</code></td><td>The shape is familiar; the sound includes a glide that English E does not. A singer who reads <code>[ɛ]</code> from French or Italian is most of the way there.</td></tr>
						<tr><td><strong>К к</strong></td><td>K k</td><td><code>[k]</code></td><td>Identical.</td></tr>
						<tr><td><strong>М м</strong></td><td>M m</td><td><code>[m]</code></td><td>Identical.</td></tr>
						<tr><td><strong>О о</strong></td><td>O o</td><td><code>[o]</code></td><td>The shape is identical. Russian <code>[o]</code> sits a touch more open than German <code>[o]</code>, and can involve an offglide. More on that later.</td></tr>
						<tr><td><strong>Т т</strong></td><td>T t</td><td><code>[t]</code></td><td>Russian places it at the teeth (dental) rather than the alveolar ridge. The singer who has sung Italian or French dentals already makes this adjustment.</td></tr>
						</tbody>
						</table>

						<p><strong>False Friends</strong></p>

						<p>These letters may look like something you recognise from Latin script, but they represent different sounds than the ones non-native singers are accustomed to. They are traps, and they deserve a moment's attention now, so they do not catch you off guard later.</p>

						<table>
						<thead><tr><th>Cyrillic</th><th>Looks like</th><th>Actually sounds like</th><th>IPA</th></tr></thead>
						<tbody>
						<tr><td><strong>В в</strong></td><td>B b</td><td>V</td><td><code>[v]</code></td></tr>
						<tr><td><strong>Н н</strong></td><td>H h</td><td>N</td><td><code>[n]</code></td></tr>
						<tr><td><strong>Р р</strong></td><td>P p</td><td>Rolled R</td><td><code>[r]</code></td></tr>
						<tr><td><strong>С с</strong></td><td>C c</td><td>S</td><td><code>[s]</code></td></tr>
						<tr><td><strong>У у</strong></td><td>Y y (roughly)</td><td><code>[u]</code> as in <em>food</em></td><td><code>[u]</code></td></tr>
						<tr><td><strong>Х х</strong></td><td>X x</td><td>Not to be confused with the German achlaut <code>[χ]</code>, this fricative consonant is produced in the same place as <code>[k]</code> and <code>[ɡ]</code>.</td><td><code>[x]</code></td></tr>
						</tbody>
						</table>

						<p>A singer sight-reading Cyrillic for the first time will almost certainly misread at least one of these. That is normal. The awareness that they exist is the first defence.</p>

						<p><strong>New Shapes</strong></p>

						<p>These twenty letters have no Latin counterpart. They may look unfamiliar, but that is actually an advantage: there is nothing to unlearn. You simply learn each shape and its sound fresh.</p>

						<table>
						<thead><tr><th>Cyrillic</th><th>Name</th><th>IPA</th><th>Category</th></tr></thead>
						<tbody>
						<tr><td><strong>Б б</strong></td><td>бэ <code>[bɛ]</code></td><td><code>[b]</code></td><td>consonant</td></tr>
						<tr><td><strong>Г г</strong></td><td>гэ <code>[gɛ]</code></td><td><code>[ɡ]</code></td><td>consonant</td></tr>
						<tr><td><strong>Д д</strong></td><td>дэ <code>[dɛ]</code></td><td><code>[d]</code></td><td>consonant</td></tr>
						<tr><td><strong>Ж ж</strong></td><td>жэ <code>[ʒɛ]</code></td><td><code>[ʒ]</code></td><td>consonant (always hard)</td></tr>
						<tr><td><strong>З з</strong></td><td>зэ <code>[zɛ]</code></td><td><code>[z]</code></td><td>consonant</td></tr>
						<tr><td><strong>И и</strong></td><td>и <code>[i]</code></td><td><code>[i]</code></td><td>vowel</td></tr>
						<tr><td><strong>Й й</strong></td><td>и краткое</td><td><code>[j]</code></td><td>consonant</td></tr>
						<tr><td><strong>Л л</strong></td><td>эл <code>[ɛl]</code></td><td><code>[l]</code> / <code>[ɫ]</code></td><td>consonant</td></tr>
						<tr><td><strong>П п</strong></td><td>пэ <code>[pɛ]</code></td><td><code>[p]</code></td><td>consonant</td></tr>
						<tr><td><strong>Ф ф</strong></td><td>эф <code>[ɛf]</code></td><td><code>[f]</code></td><td>consonant</td></tr>
						<tr><td><strong>Ц ц</strong></td><td>цэ <code>[tsɛ]</code></td><td><code>[ts]</code></td><td>consonant (always hard)</td></tr>
						<tr><td><strong>Ч ч</strong></td><td>че <code>[tʃʲɛ]</code></td><td><code>[tʃʲ]</code></td><td>consonant (always soft)</td></tr>
						<tr><td><strong>Ш ш</strong></td><td>ша <code>[ʃɑ]</code></td><td><code>[ʃ]</code></td><td>consonant (always hard)</td></tr>
						<tr><td><strong>Щ щ</strong></td><td>ща <code>[ʃtʃʲɑ]</code></td><td><code>[ʃʲʃʲ]</code></td><td>consonant (always soft)</td></tr>
						<tr><td><strong>Ъ ъ</strong></td><td>твёрдый знак</td><td>—</td><td>sign (hard sign)</td></tr>
						<tr><td><strong>Ы ы</strong></td><td>ы <code>[ɨ]</code></td><td><code>[ɨ]</code></td><td>vowel</td></tr>
						<tr><td><strong>Ь ь</strong></td><td>мягкий знак</td><td>—</td><td>sign (soft sign)</td></tr>
						<tr><td><strong>Э э</strong></td><td>э <code>[ɛ]</code></td><td><code>[ɛ]</code></td><td>vowel</td></tr>
						<tr><td><strong>Ю ю</strong></td><td>ю <code>[ju]</code></td><td><code>[ju]</code></td><td>vowel</td></tr>
						<tr><td><strong>Я я</strong></td><td>я <code>[jɑ]</code></td><td><code>[jɑ]</code></td><td>vowel</td></tr>
						</tbody>
						</table>

						<p>Most of these Cyrillic letters represent sounds you already produce in other languages. The IPA confirms this: <code>[b]</code>, <code>[d]</code>, <code>[p]</code>, <code>[f]</code>, <code>[i]</code>, <code>[ɛ]</code>, <code>[u]</code> are all old friends in new clothing. A handful are genuinely new. The close central vowel <code>[ɨ]</code> (⟨Ы⟩) has no close analogue in Western European singing languages; we explore it in Section 3. The palatalised consonants <code>[tʃʲ]</code> and <code>[ʃʲʃʲ]</code> involve a tongue position that Section 6 will teach you.</p>

						<h4 id="learn-u1-signs">The Two Signs</h4>

						<p>Two Cyrillic letters produce no sound of their own.</p>

						<p><strong>⟨Ь⟩ (мягкий знак, the soft sign)</strong> palatalises ('softens') the consonant that precedes it. When you see ⟨Ь⟩ after a consonant, the consonant gains a secondary articulation: the tongue blade rises toward the hard palate just as if we are going to sing the vowel <code>[i]</code>. This is the single most important function marker in Russian orthography. Section 6 elaborates on the physical process of palatalisation and its broader consequences.</p>

						<p><strong>⟨Ъ⟩ (твёрдый знак, the hard sign)</strong> appears between a prefix and an iotated vowel (⟨е⟩, ⟨ё⟩, ⟨ю⟩, ⟨я⟩). It used to mark every word ending in a 'hard' consonant sound, but again, the 1918 spelling reform eliminated this; however, you will still see pre-1917 texts dominated by terminal hard signs, and this is the reason why. The hard sign prevents iotated vowels from palatalising the preceding consonant, preserving a boundary. You will encounter ⟨Ъ⟩ far less often than ⟨Ь⟩.</p>

						<p>Neither sign appears in IPA transcriptions as an independent sound. These silent signs are important orthographic markers that influence the sounds around them.</p>

						<h4 id="learn-u1-yo">A Note on ⟨Ё⟩</h4>

						<p>The letter ⟨ё⟩ deserves a caution of its own. It is maddeningly common for Russian print materials, including musical scores, to omit the diaeresis and print ⟨ё⟩ as ⟨е⟩. But these two letters represent radically different sounds: ⟨ё⟩ is always stressed and produces <code>[jo]</code> (or <code>[o]</code> after a consonant), while ⟨е⟩ produces <code>[jɛ]</code> (or <code>[ɛ]</code> after a consonant). When the diaeresis (<em>umlaut</em> in German, <em>tréma</em> in French) is absent, the non-native singer must know either from context or from a dictionary which letter the publisher intended. <em>Ilya</em>'s dictionary restores ⟨ё⟩ where it belongs and flags the transformation, but the singer working from a printed score without <em>Ilya</em>'s help faces a genuine challenge. This is one of the many practical problems with Russian texts that a tool like <em>Ilya</em> exists to solve.</p>

						<h4 id="learn-u1-glyphs">The Glyph Table</h4>

						<div class="gt-legend"><span class="gt-legend-swatch"></span> Letterform departs radically from familiar Latin shapes</div>
						<div class="gt-scroll" tabindex="0" role="region" aria-label="Cyrillic glyph table">
						<table class="gt-table">
						<thead>
						<tr>
							<th>Upper<br><span class="gt-col-sub">Serif</span></th>
							<th>Lower<br><span class="gt-col-sub">Serif</span></th>
							<th>Upper<br><span class="gt-col-sub">Serif Italic</span></th>
							<th>Lower<br><span class="gt-col-sub">Serif Italic</span></th>
							<th>Upper<br><span class="gt-col-sub">Sans</span></th>
							<th>Lower<br><span class="gt-col-sub">Sans</span></th>
							<th>Upper<br><span class="gt-col-sub">Sans Italic</span></th>
							<th>Lower<br><span class="gt-col-sub">Sans Italic</span></th>
							<th class="gt-cursive-h">Upper<br><span class="gt-col-sub">Cursive</span></th>
							<th class="gt-cursive-h">Lower<br><span class="gt-col-sub">Cursive</span></th>
						</tr>
						</thead>
						<tbody>
							<tr>
								<td class="gt-cell gt-serif">А</td>
								<td class="gt-cell gt-serif">а</td>
								<td class="gt-cell gt-serif-it">А</td>
								<td class="gt-cell gt-serif-it">а</td>
								<td class="gt-cell gt-sans">А</td>
								<td class="gt-cell gt-sans">а</td>
								<td class="gt-cell gt-sans-obl">А</td>
								<td class="gt-cell gt-sans-obl">а</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Б</td>
								<td class="gt-cell gt-serif">б</td>
								<td class="gt-cell gt-serif-it">Б</td>
								<td class="gt-cell gt-serif-it">б</td>
								<td class="gt-cell gt-sans">Б</td>
								<td class="gt-cell gt-sans">б</td>
								<td class="gt-cell gt-sans-obl">Б</td>
								<td class="gt-cell gt-sans-obl">б</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">В</td>
								<td class="gt-cell gt-serif">в</td>
								<td class="gt-cell gt-serif-it">В</td>
								<td class="gt-cell gt-serif-it">в</td>
								<td class="gt-cell gt-sans">В</td>
								<td class="gt-cell gt-sans">в</td>
								<td class="gt-cell gt-sans-obl">В</td>
								<td class="gt-cell gt-sans-obl">в</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Г</td>
								<td class="gt-cell gt-serif">г</td>
								<td class="gt-cell gt-serif-it">Г</td>
								<td class="gt-cell gt-serif-it gt-hi">г</td>
								<td class="gt-cell gt-sans">Г</td>
								<td class="gt-cell gt-sans">г</td>
								<td class="gt-cell gt-sans-obl">Г</td>
								<td class="gt-cell gt-sans-obl gt-hi">г</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Д</td>
								<td class="gt-cell gt-serif">д</td>
								<td class="gt-cell gt-serif-it">Д</td>
								<td class="gt-cell gt-serif-it">д</td>
								<td class="gt-cell gt-sans">Д</td>
								<td class="gt-cell gt-sans">д</td>
								<td class="gt-cell gt-sans-obl">Д</td>
								<td class="gt-cell gt-sans-obl">д</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive gt-hi">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Е</td>
								<td class="gt-cell gt-serif">е</td>
								<td class="gt-cell gt-serif-it">Е</td>
								<td class="gt-cell gt-serif-it">е</td>
								<td class="gt-cell gt-sans">Е</td>
								<td class="gt-cell gt-sans">е</td>
								<td class="gt-cell gt-sans-obl">Е</td>
								<td class="gt-cell gt-sans-obl">е</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ё</td>
								<td class="gt-cell gt-serif">ё</td>
								<td class="gt-cell gt-serif-it">Ё</td>
								<td class="gt-cell gt-serif-it">ё</td>
								<td class="gt-cell gt-sans">Ё</td>
								<td class="gt-cell gt-sans">ё</td>
								<td class="gt-cell gt-sans-obl">Ё</td>
								<td class="gt-cell gt-sans-obl">ё</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ж</td>
								<td class="gt-cell gt-serif">ж</td>
								<td class="gt-cell gt-serif-it">Ж</td>
								<td class="gt-cell gt-serif-it">ж</td>
								<td class="gt-cell gt-sans">Ж</td>
								<td class="gt-cell gt-sans">ж</td>
								<td class="gt-cell gt-sans-obl">Ж</td>
								<td class="gt-cell gt-sans-obl">ж</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">З</td>
								<td class="gt-cell gt-serif">з</td>
								<td class="gt-cell gt-serif-it">З</td>
								<td class="gt-cell gt-serif-it">з</td>
								<td class="gt-cell gt-sans">З</td>
								<td class="gt-cell gt-sans">з</td>
								<td class="gt-cell gt-sans-obl">З</td>
								<td class="gt-cell gt-sans-obl">з</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">И</td>
								<td class="gt-cell gt-serif">и</td>
								<td class="gt-cell gt-serif-it">И</td>
								<td class="gt-cell gt-serif-it">и</td>
								<td class="gt-cell gt-sans">И</td>
								<td class="gt-cell gt-sans">и</td>
								<td class="gt-cell gt-sans-obl">И</td>
								<td class="gt-cell gt-sans-obl">и</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Й</td>
								<td class="gt-cell gt-serif">й</td>
								<td class="gt-cell gt-serif-it">Й</td>
								<td class="gt-cell gt-serif-it">й</td>
								<td class="gt-cell gt-sans">Й</td>
								<td class="gt-cell gt-sans">й</td>
								<td class="gt-cell gt-sans-obl">Й</td>
								<td class="gt-cell gt-sans-obl">й</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">К</td>
								<td class="gt-cell gt-serif">к</td>
								<td class="gt-cell gt-serif-it">К</td>
								<td class="gt-cell gt-serif-it">к</td>
								<td class="gt-cell gt-sans">К</td>
								<td class="gt-cell gt-sans">к</td>
								<td class="gt-cell gt-sans-obl">К</td>
								<td class="gt-cell gt-sans-obl">к</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Л</td>
								<td class="gt-cell gt-serif">л</td>
								<td class="gt-cell gt-serif-it">Л</td>
								<td class="gt-cell gt-serif-it">л</td>
								<td class="gt-cell gt-sans">Л</td>
								<td class="gt-cell gt-sans">л</td>
								<td class="gt-cell gt-sans-obl">Л</td>
								<td class="gt-cell gt-sans-obl">л</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">М</td>
								<td class="gt-cell gt-serif">м</td>
								<td class="gt-cell gt-serif-it">М</td>
								<td class="gt-cell gt-serif-it">м</td>
								<td class="gt-cell gt-sans">М</td>
								<td class="gt-cell gt-sans">м</td>
								<td class="gt-cell gt-sans-obl">М</td>
								<td class="gt-cell gt-sans-obl">м</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Н</td>
								<td class="gt-cell gt-serif">н</td>
								<td class="gt-cell gt-serif-it">Н</td>
								<td class="gt-cell gt-serif-it">н</td>
								<td class="gt-cell gt-sans">Н</td>
								<td class="gt-cell gt-sans">н</td>
								<td class="gt-cell gt-sans-obl">Н</td>
								<td class="gt-cell gt-sans-obl">н</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">О</td>
								<td class="gt-cell gt-serif">о</td>
								<td class="gt-cell gt-serif-it">О</td>
								<td class="gt-cell gt-serif-it">о</td>
								<td class="gt-cell gt-sans">О</td>
								<td class="gt-cell gt-sans">о</td>
								<td class="gt-cell gt-sans-obl">О</td>
								<td class="gt-cell gt-sans-obl">о</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">П</td>
								<td class="gt-cell gt-serif gt-hi">п</td>
								<td class="gt-cell gt-serif-it">П</td>
								<td class="gt-cell gt-serif-it">п</td>
								<td class="gt-cell gt-sans">П</td>
								<td class="gt-cell gt-sans gt-hi">п</td>
								<td class="gt-cell gt-sans-obl">П</td>
								<td class="gt-cell gt-sans-obl">п</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Р</td>
								<td class="gt-cell gt-serif">р</td>
								<td class="gt-cell gt-serif-it">Р</td>
								<td class="gt-cell gt-serif-it">р</td>
								<td class="gt-cell gt-sans">Р</td>
								<td class="gt-cell gt-sans">р</td>
								<td class="gt-cell gt-sans-obl">Р</td>
								<td class="gt-cell gt-sans-obl">р</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">С</td>
								<td class="gt-cell gt-serif">с</td>
								<td class="gt-cell gt-serif-it">С</td>
								<td class="gt-cell gt-serif-it">с</td>
								<td class="gt-cell gt-sans">С</td>
								<td class="gt-cell gt-sans">с</td>
								<td class="gt-cell gt-sans-obl">С</td>
								<td class="gt-cell gt-sans-obl">с</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Т</td>
								<td class="gt-cell gt-serif">т</td>
								<td class="gt-cell gt-serif-it">Т</td>
								<td class="gt-cell gt-serif-it gt-hi">т</td>
								<td class="gt-cell gt-sans">Т</td>
								<td class="gt-cell gt-sans">т</td>
								<td class="gt-cell gt-sans-obl">Т</td>
								<td class="gt-cell gt-sans-obl gt-hi">т</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">У</td>
								<td class="gt-cell gt-serif">у</td>
								<td class="gt-cell gt-serif-it">У</td>
								<td class="gt-cell gt-serif-it">у</td>
								<td class="gt-cell gt-sans">У</td>
								<td class="gt-cell gt-sans">у</td>
								<td class="gt-cell gt-sans-obl">У</td>
								<td class="gt-cell gt-sans-obl">у</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ф</td>
								<td class="gt-cell gt-serif">ф</td>
								<td class="gt-cell gt-serif-it">Ф</td>
								<td class="gt-cell gt-serif-it">ф</td>
								<td class="gt-cell gt-sans">Ф</td>
								<td class="gt-cell gt-sans">ф</td>
								<td class="gt-cell gt-sans-obl">Ф</td>
								<td class="gt-cell gt-sans-obl">ф</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Х</td>
								<td class="gt-cell gt-serif">х</td>
								<td class="gt-cell gt-serif-it">Х</td>
								<td class="gt-cell gt-serif-it">х</td>
								<td class="gt-cell gt-sans">Х</td>
								<td class="gt-cell gt-sans">х</td>
								<td class="gt-cell gt-sans-obl">Х</td>
								<td class="gt-cell gt-sans-obl">х</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ц</td>
								<td class="gt-cell gt-serif">ц</td>
								<td class="gt-cell gt-serif-it">Ц</td>
								<td class="gt-cell gt-serif-it">ц</td>
								<td class="gt-cell gt-sans">Ц</td>
								<td class="gt-cell gt-sans">ц</td>
								<td class="gt-cell gt-sans-obl">Ц</td>
								<td class="gt-cell gt-sans-obl">ц</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ч</td>
								<td class="gt-cell gt-serif">ч</td>
								<td class="gt-cell gt-serif-it">Ч</td>
								<td class="gt-cell gt-serif-it">ч</td>
								<td class="gt-cell gt-sans">Ч</td>
								<td class="gt-cell gt-sans">ч</td>
								<td class="gt-cell gt-sans-obl">Ч</td>
								<td class="gt-cell gt-sans-obl">ч</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ш</td>
								<td class="gt-cell gt-serif">ш</td>
								<td class="gt-cell gt-serif-it">Ш</td>
								<td class="gt-cell gt-serif-it">ш</td>
								<td class="gt-cell gt-sans">Ш</td>
								<td class="gt-cell gt-sans">ш</td>
								<td class="gt-cell gt-sans-obl">Ш</td>
								<td class="gt-cell gt-sans-obl">ш</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Щ</td>
								<td class="gt-cell gt-serif">щ</td>
								<td class="gt-cell gt-serif-it">Щ</td>
								<td class="gt-cell gt-serif-it">щ</td>
								<td class="gt-cell gt-sans">Щ</td>
								<td class="gt-cell gt-sans">щ</td>
								<td class="gt-cell gt-sans-obl">Щ</td>
								<td class="gt-cell gt-sans-obl">щ</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ъ</td>
								<td class="gt-cell gt-serif">ъ</td>
								<td class="gt-cell gt-serif-it">Ъ</td>
								<td class="gt-cell gt-serif-it">ъ</td>
								<td class="gt-cell gt-sans">Ъ</td>
								<td class="gt-cell gt-sans">ъ</td>
								<td class="gt-cell gt-sans-obl">Ъ</td>
								<td class="gt-cell gt-sans-obl">ъ</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ы</td>
								<td class="gt-cell gt-serif">ы</td>
								<td class="gt-cell gt-serif-it">Ы</td>
								<td class="gt-cell gt-serif-it">ы</td>
								<td class="gt-cell gt-sans">Ы</td>
								<td class="gt-cell gt-sans">ы</td>
								<td class="gt-cell gt-sans-obl">Ы</td>
								<td class="gt-cell gt-sans-obl">ы</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ь</td>
								<td class="gt-cell gt-serif">ь</td>
								<td class="gt-cell gt-serif-it">Ь</td>
								<td class="gt-cell gt-serif-it">ь</td>
								<td class="gt-cell gt-sans">Ь</td>
								<td class="gt-cell gt-sans">ь</td>
								<td class="gt-cell gt-sans-obl">Ь</td>
								<td class="gt-cell gt-sans-obl">ь</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Э</td>
								<td class="gt-cell gt-serif">э</td>
								<td class="gt-cell gt-serif-it">Э</td>
								<td class="gt-cell gt-serif-it">э</td>
								<td class="gt-cell gt-sans">Э</td>
								<td class="gt-cell gt-sans">э</td>
								<td class="gt-cell gt-sans-obl">Э</td>
								<td class="gt-cell gt-sans-obl">э</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ю</td>
								<td class="gt-cell gt-serif">ю</td>
								<td class="gt-cell gt-serif-it">Ю</td>
								<td class="gt-cell gt-serif-it">ю</td>
								<td class="gt-cell gt-sans">Ю</td>
								<td class="gt-cell gt-sans">ю</td>
								<td class="gt-cell gt-sans-obl">Ю</td>
								<td class="gt-cell gt-sans-obl">ю</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Я</td>
								<td class="gt-cell gt-serif">я</td>
								<td class="gt-cell gt-serif-it">Я</td>
								<td class="gt-cell gt-serif-it">я</td>
								<td class="gt-cell gt-sans">Я</td>
								<td class="gt-cell gt-sans">я</td>
								<td class="gt-cell gt-sans-obl">Я</td>
								<td class="gt-cell gt-sans-obl">я</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr class="gt-divider">
								<td colspan="10">Pre-1917 obsolete letters</td>
							</tr>
							<tr class="gt-obsolete">
								<td class="gt-cell gt-serif">Ѣ</td>
								<td class="gt-cell gt-serif">ѣ</td>
								<td class="gt-cell gt-serif-it">Ѣ</td>
								<td class="gt-cell gt-serif-it gt-hi">ѣ</td>
								<td class="gt-cell gt-sans">Ѣ</td>
								<td class="gt-cell gt-sans">ѣ</td>
								<td class="gt-cell gt-sans-obl">Ѣ</td>
								<td class="gt-cell gt-sans-obl">ѣ</td>
								<td class="gt-cell gt-cursive gt-null">—</td>
								<td class="gt-cell gt-cursive gt-null">—</td>
							</tr>
							<tr class="gt-obsolete">
								<td class="gt-cell gt-serif">Ѳ</td>
								<td class="gt-cell gt-serif">ѳ</td>
								<td class="gt-cell gt-serif-it">Ѳ</td>
								<td class="gt-cell gt-serif-it">ѳ</td>
								<td class="gt-cell gt-sans">Ѳ</td>
								<td class="gt-cell gt-sans">ѳ</td>
								<td class="gt-cell gt-sans-obl">Ѳ</td>
								<td class="gt-cell gt-sans-obl">ѳ</td>
								<td class="gt-cell gt-cursive gt-null">—</td>
								<td class="gt-cell gt-cursive gt-null">—</td>
							</tr>
							<tr class="gt-obsolete">
								<td class="gt-cell gt-serif">І</td>
								<td class="gt-cell gt-serif">і</td>
								<td class="gt-cell gt-serif-it">І</td>
								<td class="gt-cell gt-serif-it">і</td>
								<td class="gt-cell gt-sans">І</td>
								<td class="gt-cell gt-sans">і</td>
								<td class="gt-cell gt-sans-obl">І</td>
								<td class="gt-cell gt-sans-obl">і</td>
								<td class="gt-cell gt-cursive gt-null">—</td>
								<td class="gt-cell gt-cursive gt-null">—</td>
							</tr>
							<tr class="gt-obsolete">
								<td class="gt-cell gt-serif">Ѵ</td>
								<td class="gt-cell gt-serif">ѵ</td>
								<td class="gt-cell gt-serif-it">Ѵ</td>
								<td class="gt-cell gt-serif-it">ѵ</td>
								<td class="gt-cell gt-sans">Ѵ</td>
								<td class="gt-cell gt-sans">ѵ</td>
								<td class="gt-cell gt-sans-obl">Ѵ</td>
								<td class="gt-cell gt-sans-obl">ѵ</td>
								<td class="gt-cell gt-cursive gt-null">—</td>
								<td class="gt-cell gt-cursive gt-null">—</td>
							</tr>
						</tbody>
						</table>
						</div>



						<p>The purpose of presenting every letter in multiple forms is to ensure that no matter where you meet a letter, you can recognise it. Singers encounter Cyrillic in printed scores (often serif), in contemporary editions (often sans serif), in scholarly resources (often italic), and occasionally in handwritten annotations or historical manuscripts (cursive). Notice how radically some letterforms change between regular, italic, and cursive forms.</p>

						<h4 id="learn-u1-try">Try This</h4>

						<p>Open <em>Ilya</em>'s Transcription tab and paste any short Russian text. You might try the opening of Musorgsky's "Где ты, звёздочка?" or a few lines from any song in your repertoire.</p>

						<p>Look at the three lines <em>Ilya</em> produces: IPA, Cyrillic, and translation gloss. You can already begin to match what you see in the IPA line to the anchors you have just learned. Some letters will have transformed: an unstressed ⟨О⟩ may appear as <code>[ʌ]</code> rather than the <code>[o]</code> you met in the table above. A consonant before ⟨Е⟩ may carry a palatalisation marker, <code>[ʲ]</code>, which was not demonstrated in the default anchor.</p>

						<p>Those transformations are the subject of Sections 2 through 7. For now, just notice that the Russian Cyrillic alphabet is finite, yet the IPA is familiar. <em>Ilya</em> can show you exactly what it does to every letter. The rest of LEARN teaches you why.</p>

						<p><em>Sources:</em> Craig M. Grayson, "Russian Lyric Diction" (D.M.A. dissertation, University of Washington, 2012), Ch. 2, Appendices B and D. Ken Griffiths, Russian Alphabet Song, arr. Dann Mitton (2017). Irena Yanushevskaya and Daniel Bunčić, "Russian," <em>Journal of the International Phonetic Association</em> 45/2 (2015).</p>

						<h3 id="learn-unit-2">Section 2 · Stress</h3>

						<p><strong>Every sound in this module depends on where the stress falls.</strong></p>

						<p>Stress in Italian almost always falls on the penultimate syllable. In French, it falls reliably on the final syllable. Like English, Russian offers no such courtesy. Stress in Russian is lexical: it must be learned word by word, verified word by word, and it can shift when the same word changes its grammatical form. This is the single most consequential fact about Russian pronunciation for singers. And it is the reason that <em>Ilya</em> incorporates a dictionary of nearly one million entries rather than attempting to derive stress from rules.</p>

						<p>Based on how stress affects them, we can organize Russian vowels into three categories. This classification governs everything in Sections 3 and 4:</p>

						<table>
						<thead><tr><th>Category</th><th>Vowels</th><th>Behaviour</th></tr></thead>
						<tbody>
						<tr><td>Unaffected by stress</td><td>/u/ (⟨у⟩ or ⟨ю⟩), /i/ (⟨и⟩), and /ɨ/ (⟨ы⟩)</td><td>Same quality whether stressed or unstressed.</td></tr>
						<tr><td>Stress-only</td><td>/o/ (⟨о⟩, ⟨ё⟩) and /ɛ/ (⟨э⟩, ⟨е⟩)</td><td>Appear only in stressed syllables. When unstressed, they reduce to different sounds entirely.</td></tr>
						<tr><td>Stress-and-position</td><td>/ɑ/ (⟨а⟩, ⟨я⟩)</td><td>Quality varies by both stress and by the syllable's position relative to the stress.</td></tr>
						</tbody>
						</table>

						<p>Three vowels pass through stress unscathed. Two exist only under stress. One responds to both stress and distance from it. These categories are not arbitrary; they are hierarchical, and the stressed syllable governs them.</p>

						<h4 id="learn-u2-meaning">Stress changes meaning.</h4>

						<p>Russian has true homographs: words spelled identically whose pronunciation and meaning change, depending entirely on which syllable carries the stress.</p>

						<table>
						<thead><tr><th>Word</th><th>Stress position</th><th>IPA</th><th>Meaning</th></tr></thead>
						<tbody>
						<tr><td>⟨мука⟩</td><td>му́ка (first syllable)</td><td><code>/ˈmu kɑ/</code></td><td>flour</td></tr>
						<tr><td>⟨мука⟩</td><td>мука́ (second syllable)</td><td><code>/mu ˈkɑ/</code></td><td>torment</td></tr>
						<tr><td>⟨стоит⟩</td><td>сто́ит (first syllable)</td><td><code>/ˈsto it/</code></td><td>costs</td></tr>
						<tr><td>⟨стоит⟩</td><td>стои́т (second syllable)</td><td><code>/stɑ ˈit/</code></td><td>stands</td></tr>
						<tr><td>⟨уже⟩</td><td>у́же (first syllable)</td><td><code>/ˈu ʒɨ/</code></td><td>narrower</td></tr>
						<tr><td>⟨уже⟩</td><td>уже́ (second syllable)</td><td><code>/u ˈʒɛ/</code></td><td>already</td></tr>
						</tbody>
						</table>

						<p>These are not edge cases. Singers encounter homographs in standard repertoire, and the wrong stress produces the wrong word. In ⟨мука⟩, the stress determines whether the singer is lamenting torment or discussing baking.</p>

						<h4 id="learn-u2-moves">Stress moves.</h4>

						<p>The same word can shift its stress across grammatical forms. The noun ⟨вода⟩ (water) illustrates this:</p>

						<table>
						<thead><tr><th>Form</th><th>Stress</th><th>IPA</th></tr></thead>
						<tbody>
						<tr><td>вода́ (nominative singular)</td><td>final</td><td><code>/vʌ ˈdɑ/</code></td></tr>
						<tr><td>во́ды (genitive singular)</td><td>initial</td><td><code>/ˈvo dɨ/</code></td></tr>
						<tr><td>во́ду (accusative singular)</td><td>initial</td><td><code>/ˈvo du/</code></td></tr>
						</tbody>
						</table>

						<p>The vowel ⟨о⟩ in the first syllable sounds completely different depending on which form the singer encounters: <code>/ʌ/</code> when unstressed, <code>/o/</code> when stressed. Grayson identifies seven distinct stress patterns for Russian nouns alone, with additional patterns for verbs and their derivatives. The singer does not need to master this grammar. The singer needs to know that it exists, so that when a word's stress looks unfamiliar in an oblique case or a conjugated form, the instinct is to verify rather than to guess.</p>

						<h4 id="learn-u2-dictionary">Stress is a dictionary problem.</h4>

						<p>Patterns do exist, but the exceptions are so numerous that reliable stress assignment really does require dictionary lookup. This is Grayson's practical counsel, and it validates <em>Ilya's</em> design: the engine resolves stress through a dictionary of 943,096 entries, not through derivational rules. As Baytukalov observes: "Believe me, it's a lot of rules." The singer's responsibility is to verify stress from a reliable source, not to memorise the rules that govern it.</p>

						<p>When <em>Ilya</em> encounters a homograph, it selects the first of several possibilities, whether it is right or wrong. The user must select the right homograph through context clues or outside counsel. When <em>Ilya</em> encounters a word not in its dictionary, it flags the word for manual assignment with a dashed-line VERIFY box. In both cases, the principle is the same: stress is too consequential to leave to inference.</p>

						<h4 id="learn-u2-sounds">How stress sounds.</h4>

						<p>In singing, we communicate stress through intensity and articulatory commitment, not through duration, which is prescribed. The composer writes a rhythm; the singer cannot lengthen a stressed syllable beyond what the note value permits. But even in legato passages where all syllables receive sustained tone, the stressed syllable carries greater physical investment: a more committed vowel, a clearer articulatory target, a brighter core to the sound, and perhaps a little more intensity by comparison to adjacent notes. In sung Russian, the unstressed syllables serve the stress.</p>

						<h4 id="learn-u2-try">Try this in Ilya.</h4>

						<p>Paste ⟨стоит⟩ into the Transcription tab. Assign stress to the first syllable, then to the second. Watch the IPA line change. The vowels transform: not because the letters changed, but because the stress moved. That transformation is the subject of Sections 3 and 4.</p>

						<h4 id="learn-u2-yo">Spotting the missing ⟨ё⟩.</h4>

						<p>Russian printers routinely omit the diaeresis on ⟨ё⟩, printing it as ⟨е⟩. Because ⟨ё⟩ is always stressed and always produces <code>/o/</code>, a missing diaeresis can silently shift both the stress and the vowel quality of a word. Grayson identifies this as the single most common source of pronunciation error for non-native singers. <em>Ilya</em> restores ⟨ё⟩ automatically from its dictionary and flags the restoration with the ё sigla, but the singer benefits from learning to recognise common suffix patterns where ⟨ё⟩ hides:</p>

						<table>
						<thead><tr><th>Suffix</th><th>Example</th><th>Meaning</th></tr></thead>
						<tbody>
						<tr><td>-ёнок (diminutive)</td><td>котёнок</td><td>kitten</td></tr>
						<tr><td>-ёр (agent, French origin)</td><td>актёр</td><td>actor</td></tr>
						<tr><td>-ённ- (past passive participle)</td><td>увлечённый</td><td>captivated</td></tr>
						</tbody>
						</table>

						<p>The highest-frequency homograph pair in art song is <strong>всё</strong> <code>/fsʲo/</code> (everything) versus <strong>все</strong> <code>/fsʲɛ/</code> (everyone). The diaeresis alone distinguishes meaning and vowel quality. When in doubt, check the dictionary; when <em>Ilya</em> shows the ё sigla, trust it.</p>

						<p><em>Grayson source: Ch. 7 (Syllabic Stress, pp. 263–273), Ch. 2 (pp. 65–66), Ch. 8 §1 (pp. 274–278). Baytukalov cited in Grayson p. 273.</em></p>


						<h3 id="learn-unit-3">Section 3 · Stressed Vowels</h3>

						<p id="learn-u3-inventory"><strong>Stressed vowels are the targets.</strong></p>

						<p>When a Russian vowel carries stress, it sounds like itself. These are the stable cardinal vowel sounds — the ones the singer can expect before anything else changes. Most of them are already familiar to us from Italian, French, and German. Learn these first; everything that follows in Sections 4–7 is a transformation of what you hear here.</p>

						<p>Sung Russian has six stressed vowel sounds:</p>

						<table>
							<thead>
								<tr>
									<th>IPA</th>
									<th>Cyrillic</th>
									<th>Formation</th>
									<th>What you already know</th>
								</tr>
							</thead>
							<tbody>
								<tr><td><code>/ɑ/</code></td><td>⟨а⟩, ⟨я⟩</td><td>Open back, mid-tongue slightly higher than English <em>father</em></td><td>Italian /ɑ/ in <em>casa</em>. The sung Russian default for ⟨а⟩.</td></tr>
								<tr><td><code>/o/</code></td><td>⟨о⟩, ⟨ё⟩</td><td>Low tongue of open /ɔ/, rounded lips of closed /o/, with an audible offglide when it is word-final [oːʌ̯]</td><td>Between Italian open <em>o</em> and German closed <em>o</em>. Imagine someone from Queens NYC saying 'coffee'</td></tr>
								<tr><td><code>/ɛ/</code></td><td>⟨э⟩, ⟨е⟩</td><td>Open-mid front</td><td>French <em>è</em>, Italian open <em>e</em> in <em>bello</em>.</td></tr>
								<tr><td><code>/i/</code></td><td>⟨и⟩</td><td>Close front</td><td>The same /i/ across Italian, French, German, and English <em>see</em>.</td></tr>
								<tr><td><code>/u/</code></td><td>⟨у⟩, ⟨ю⟩</td><td>Close back rounded, stable, tongue high in back</td><td>Italian /u/ in <em>luna</em>. No diphthong.</td></tr>
								<tr><td><code>[ɨ]</code></td><td>⟨ы⟩</td><td>Velarized /i/: tongue between /i/ and /u/ positions, lips unrounded</td><td>No close analogue. The one genuinely new sound for many singers.</td></tr>
							</tbody>
						</table>

						<p>Five of these six sounds are old friends. The sixth, [ɨ], deserves a moment. It is a velarized version of /i/, unceremoniously dubbed velar-i: the front of the tongue holds the /i/ position while the back of the tongue rises toward the velum. The lips stay unrounded. It is <em>not</em> pharyngeal — the contact point is at the transition between the hard and soft palate, not farther back toward the uvula. Grayson notes the close relationship of velar-i to the dark (velar) ⟨л⟩ ([ɫ]), which occupies the same velarized space. One rule governs [ɨ]: it appears only after unpalatalized (hard) consonants. After a palatalized consonant, the same letter ⟨и⟩ produces the expected /i/.</p>

						<p>A note on /o/. Grayson describes Russian /o/ as idiomatically a slight diphthong [oːʌ] — the vowel releases toward [ʌ] — and after labial consonants, a labialized [ʷoːʌ], but this specificity is never notated. Grayson simplifies it to /o/ in all transcriptions, and <em>Ilya</em> follows this convention. The singer should know that Russian /o/ is much looser than the German or French closed /o/, and much rounder than the Italian open /ɔ/, yet nowhere near the semi-open-o of French (i.e. 'sauvage'). It lives between these neighbours.</p>

						<h4 id="learn-u3-interpalatal">Two vowels change colour near soft consonants.</h4>

						<p>Under certain conditions, as the tongue shifts forward, a stressed vowel changes its colour. Grayson describes this shift as 'fronting'; what follows is our framework for recognising when vowel fronting occurs.</p>

						<p><strong>Three roads to [e]</strong></p>

						<p>The closed [e] (close to French /e/, slightly more relaxed) replaces the open /ɛ/ under three conditions. All three share the same closing requirement: the <em>following</em> consonant must be palatalized. What differs is the preceding environment.</p>

						<table>
							<thead>
								<tr>
									<th>Road</th>
									<th>Preceding</th>
									<th>Following</th>
									<th>Example</th>
								</tr>
							</thead>
							<tbody>
								<tr><td>Interpalatal</td><td>Palatalized consonant</td><td>Palatalized consonant</td><td>дверь /dʲvʲ<strong>e</strong>rʲ/</td></tr>
								<tr><td>Always-hard</td><td>⟨ж⟩, ⟨ш⟩, or ⟨ц⟩</td><td>Palatalized consonant</td><td>шесть /ʃ<strong>e</strong>sʲtʲ/</td></tr>
								<tr><td>Initial ⟨э⟩</td><td>∅ (word-initial)</td><td>Palatalized consonant</td><td>эти /<strong>e</strong>tʲi/</td></tr>
							</tbody>
						</table>

						<p>The logic: ⟨е⟩ is an indicator letter (a.k.a. a palatalising agent) — it palatalizes any regular consonant before it. The only consonants that can precede ⟨е⟩ and remain hard are ⟨ж⟩, ⟨ш⟩, and ⟨ц⟩, because these three consonants inherently reject palatalization. So, the full space of preceding environments for ⟨е⟩ is exactly two: palatalized, or the set of three always-hard consonants. The letter ⟨э⟩ does not palatalize a preceding consonant. Its only path to [e] is at the start of a word, with nothing before it. One phoneme ([e]), two letters (⟨е⟩ or ⟨э⟩), three preceding conditions (palatalized consonant, always-hard consonant, or nothing), one shared closing condition (a palatalised consonant).</p>

						<p>Counter-examples confirm the rule. When the following consonant is hard, the vowel stays open: шест /ʃɛst/ (hard /st/ follows), дверка /dʲvʲɛr kɑ/ (hard /k/ follows).</p>

						<p><strong>One road to [a]</strong></p>

						<p>The rare fronted [a] (close to French fronted /a/, mid-tongue slightly raised) replaces the open back /ɑ/ under one condition only: a truly interpalatal environment. Palatalizing agents must be sandwiching (present on <em>both</em> sides of the) stressed vowel.</p>

						<table>
							<thead>
								<tr>
									<th>Preceding</th>
									<th>Vowel</th>
									<th>Following</th>
									<th>Example</th>
								</tr>
							</thead>
							<tbody>
								<tr><td>Palatalized consonant (incl. ⟨ч⟩, ⟨щ⟩)</td><td>Stressed ⟨а⟩ or ⟨я⟩ → [a]</td><td>Palatalized consonant</td><td>пять /pʲ<strong>a</strong>tʲ/, мяч /mʲ<strong>a</strong>tʃʲ/</td></tr>
							</tbody>
						</table>

						<p>Counter-example: пятый /ˈpʲɑ tɨj/ (<em>fifth</em>). The preceding consonant is palatalized (/pʲ/), but the following consonant is hard (/t/). One side soft, one side hard: the vowel stays at /ɑ/. Similarly, мать /mɑtʲ/ (<em>mother</em>): the preceding /m/ is hard, so despite the soft /tʲ/ following, the vowel remains /ɑ/. Compare мяч /mʲatʃʲ/ (ball), where both sides are soft, with мать /mɑtʲ/ (mother), where only one side is: the vowel tells you.</p>

						<h4 id="learn-u3-iotated">Four vowel letters carry a hidden consonant.</h4>

						<p>The letters ⟨я⟩, ⟨е⟩, ⟨ё⟩, and ⟨ю⟩ are called <em>iotated vowels</em>. When they occupy three specific positions (i.e. word-initial, after another vowel, or after a sign, ⟨ъ⟩ or ⟨ь⟩) — they introduce a j-glide before the vowel:</p>

						<table>
							<thead>
								<tr>
									<th>Letter</th>
									<th>Iotated cluster (stressed)</th>
									<th>The j-glide +</th>
								</tr>
							</thead>
							<tbody>
								<tr><td>⟨я⟩</td><td>[jɑ]</td><td>the /ɑ/ the singer already knows</td></tr>
								<tr><td>⟨е⟩</td><td>[jɛ]</td><td>the /ɛ/ the singer already knows</td></tr>
								<tr><td>⟨ё⟩</td><td>[jo]</td><td>the /o/ the singer already knows</td></tr>
								<tr><td>⟨ю⟩</td><td>[ju]</td><td>the /u/ the singer already knows</td></tr>
							</tbody>
						</table>

						<p>The j-glide is the sound of English <em>y</em> in <em>yellow</em>: voiced, brief, not sustained. Russians consider /j/ a palatalized consonant. After the glide, the vowel is exactly what appears in the inventory table above — no new sounds, just a consonant prefix.</p>

						<p>When these same letters appear after a consonant (not after a vowel, sign, or at the start of a word), they do not produce a j-glide. Instead, they signal that the preceding consonant is palatalized, and they contribute only the vowel. This is the system Grayson calls <em>indicator letters</em>: ⟨я⟩, ⟨е⟩, ⟨ё⟩, ⟨ю⟩ indicate "something palatalized precedes the vowel."</p>

						<p>The fronting rules apply to iotated vowels too. When a stressed ⟨я⟩ in j-cluster position is followed by a palatalized phoneme, the result is [ja] rather than [jɑ]. When a stressed ⟨е⟩ in j-cluster position is followed by a palatalized phoneme, the result is [je] rather than [jɛ].</p>

						<h4 id="learn-u3-yo">⟨ё⟩ is always stressed.</h4>

						<p>Of all Russian vowels, ⟨ё⟩ is the only one whose stress is guaranteed. When ⟨ё⟩ appears in a word, that syllable always carries the stress. The sound is always /o/ (after a palatalized consonant) or /jo/ (initial, after a vowel, or after a sign). Grayson explicitly excludes /ɔ/ as a notation option for sung Russian /o/ — ⟨ё⟩ produces /o/, not /ɔ/.</p>

						<p>Because Russian printers routinely omit the diaeresis, printing ⟨е⟩ where ⟨ё⟩ belongs, Ilya automatically restores ⟨ё⟩ from its dictionary and signals the restoration with the ё sigla. When you see that sigla, Ilya has identified a word where the printed ⟨е⟩ is actually ⟨ё⟩ — and the vowel quality updates from /ɛ/ to /o/.</p>

						<h4 id="learn-u3-try">Try this in Ilya.</h4>

						<p>Transcribe <strong>шесть</strong> and <strong>шест</strong>. Both begin with ⟨ш⟩ + ⟨е⟩, but шесть has a soft cluster following (⟨сть⟩ → /sʲtʲ/) and produces [e]. шест has a hard cluster (⟨ст⟩ → /st/) and stays at /ɛ/. The always-hard road to [e] at work — same letter, different neighbour, different colour.</p>

						<h3 id="learn-unit-4">Section 4 · Vowel Reduction</h3>

						<p><strong>When a vowel loses stress, it changes.</strong></p>

						<p>Russian is a stress-timed language, like English. It rolls out in a series of stressed and unstressed syllables, where the interval between stressed syllables stays roughly constant, but unstressed syllables accommodate these regular pulses by both compressing in between them and reducing in vowel specificity. This loss of specificity is called vowel reduction. The vowel loses its distinctiveness by comparison to its default cardinal value, drifting toward a more centralised, less committed sound. In sung Russian, the composer prescribes durations, so the obvious temporal compression of a stress-timed language in spontaneous speech can’t manifest: it is controlled instead by the rhythm and speed of the melody. But as storytellers, the qualitative reduction of speech prosody still informs our approach to sung Russian texts. Lyric diction preserves more vowel quality for singing than speech does, yet the principle holds: an unstressed vowel is not the same defined sound as a stressed one.</p>

						<p>Section 3 established the six stressed vowel targets: <code>/ɑ/</code>, <code>/ɛ/</code>, <code>/i/</code>, <code>/o/</code>, <code>/u/</code>, and <code>[ɨ]</code>. Three of them — <code>/i/</code>, <code>/u/</code>, and <code>[ɨ]</code> — pass through stress unchanged: they retain their cardinal sound whether they are stressed or not. This will appeal to those of us who yearn for dependable rules in sung Russian. The remaining and most commonly-occurring three — <code>/ɑ/</code>, <code>/ɛ/</code>, and <code>/o/</code> — transform when they lose stress. The precise nature of the transformation depends on two factors: the identity of the vowel letter to start, and its proximity to the stressed syllable.</p>

						<p>We catalogue five unstressed vowel sounds in sung Russian:</p>

						<table>
						<thead><tr><th>IPA</th><th>Source</th><th>What it sounds like</th></tr></thead>
						<tbody>
						<tr><td><code>/ɑ/</code></td><td>Unstressed ⟨а⟩ or ⟨о⟩ in privileged positions</td><td>The same open back vowel from Section 3, but without the articulatory commitment of stress.</td></tr>
						<tr><td><code>[ʌ]</code></td><td>Unstressed ⟨а⟩ or ⟨о⟩ in remote positions</td><td>A centralized, relaxed vowel; this is the sung Russian schwa: further back than French <code>[ə]</code>, without lip rounding. Grayson notates this as <code>[ʌ]</code> rather than <code>[ə]</code> specifically to discourage singers with French training from rounding the sound. <code>[ʌ]</code> does not occur in stressed positions: it always signals a reduction.</td></tr>
						<tr><td><code>[ɪ]</code></td><td>Unstressed ⟨е⟩ or ⟨я⟩ after palatalized consonants</td><td>A lax, centralized version of /i/. The only vowel in Grayson’s inventory without a cardinal reference on Jones’ vowel chart. <code>[ɪ]</code> does not occur in stressed positions: it always signals a reduction.</td></tr>
						<tr><td><code>/i/</code></td><td>Unstressed ⟨е⟩ or ⟨я⟩ in interpalatal environments</td><td>The full /i/ from Section 3, fronted by the surrounding palatalized consonants.</td></tr>
						<tr><td><code>[ɨ]</code></td><td>Unstressed ⟨е⟩ after always-hard consonants (⟨ж⟩, ⟨ш⟩, ⟨ц⟩)</td><td>The same velar-i from Section 3. These consonants reject palatalization, so the vowel velarizes instead of reducing to <code>[ɪ]</code>.</td></tr>
						</tbody>
						</table>

						<p>Two processes govern these reductions. Russian phonology names them <em>akanye</em> /ˈɑ kʌ ɲɪ/ and <em>ikanye</em> /ˈi kʌ ɲɪ/.</p>

						<h4 id="learn-u4-akanye">⟨о⟩ and ⟨а⟩ follow different paths when unstressed.</h4>

						<p>Akanye is the process by which unstressed ⟨о⟩ and ⟨а⟩ reduce. The word itself comes from the letter ⟨а⟩: in sung Russian when ⟨о⟩ loses stress, it begins to sound like ⟨а⟩. But these two letters do not reduce symmetrically. Their paths diverge in one critical position: the syllable immediately after the stress.</p>

						<table>
						<thead><tr><th>Position relative to stress</th><th>⟨о⟩</th><th>⟨а⟩</th></tr></thead>
						<tbody>
						<tr><td>Stressed</td><td><code>/o/</code></td><td><code>/ɑ/</code></td></tr>
						<tr><td>Immediately before stress</td><td><code>/ɑ/</code></td><td><code>/ɑ/</code></td></tr>
						<tr><td>Immediately after stress</td><td><code>[ʌ]</code></td><td><code>/ɑ/</code></td></tr>
						<tr><td>Two or more syllables before stress</td><td><code>[ʌ]</code></td><td><code>[ʌ]</code></td></tr>
						<tr><td>Two or more syllables after stress</td><td><code>[ʌ]</code></td><td><code>[ʌ]</code></td></tr>
						<tr><td>Word-initial (any distance)</td><td><code>/ɑ/</code></td><td><code>/ɑ/</code></td></tr>
						</tbody>
						</table>

						<p>The asymmetry sits in row three. Immediately after the stress, ⟨о⟩ reduces to <code>[ʌ]</code>, while ⟨а⟩ holds at <code>/ɑ/</code>. Grayson’s reasoning is aural and semantic: the difference between <code>/ɑ/</code> and <code>[ʌ]</code> in this position helps the listener distinguish between the two underlying vowel letters, which helps the listener understand the difference between case forms like ⟨блюдо⟩ <code>/ˈblʲu dʌ/</code> (a platter) and ⟨блюда⟩ <code>/ˈblʲu dɑ/</code> (platters), where the post-stress vowel alone carries the grammatical difference (Grayson, p. 266, fn. 306). Everywhere else, the paths converge.</p>

						<p>Here is an overriding exception. Whenever either unstressed ⟨а⟩ or ⟨о⟩ is the first letter of the word, they read as <code>/ɑ/</code> regardless of how far it sits from the stress. The word ⟨огонь⟩ <code>/ɑ ˈɡoɲ/</code> (fire) demonstrates: the initial ⟨о⟩ sits two syllables from the stress, a position that would normally produce <code>[ʌ]</code>, yet it holds at <code>/ɑ/</code> because it is word-initial.</p>

						<p>The word ⟨хорошо⟩ (good, well) demonstrates the complete akanye chain in a single word. Three identical ⟨о⟩ letters, three different pronunciations: <code>/xʌ rɑ ˈʃo/</code>. The remote first ⟨о⟩ reduces to <code>[ʌ]</code>. The immediately pre-stress ⟨о⟩ holds at <code>/ɑ/</code>. The stressed final ⟨о⟩ sounds as <code>/o/</code>.</p>

						<h4 id="learn-u4-ikanye">⟨е⟩ and ⟨я⟩ reduce toward [ɪ].</h4>

						<p>Ikanye is the parallel process for vowels that sit in interpalatal environments, where the vowel is sandwiched on either side by a palatalizing agent. The vowels ⟨е⟩ and ⟨я⟩ both reduce to <code>[ɪ]</code>. Unlike akanye, where position relative to stress creates a hierarchy, ikanye is simpler: these two orthographic vowels reduce to <code>[ɪ]</code> in any unstressed position. The word ⟨весна⟩ <code>/vʲɪ ˈsnɑ/</code> (spring) demonstrates: the unstressed ⟨е⟩ after palatalized ⟨в⟩ reduces to <code>[ɪ]</code>.</p>

						<p>Two refinements qualify this rule:</p>

						<table>
						<thead><tr><th>Condition</th><th>Result</th><th>Why</th></tr></thead>
						<tbody>
						<tr><td>After always-hard consonants (⟨ж⟩, ⟨ш⟩, ⟨ц⟩)</td><td><code>[ɨ]</code>, not <code>[ɪ]</code></td><td>The three consonants in the always-hard set cannot palatalize. Instead, the vowel velarizes to match the hard consonant environment.</td></tr>
						<tr><td>Interpalatal (palatalized on both sides)</td><td><code>/i/</code>, not <code>[ɪ]</code></td><td>The surrounding palatalized consonants front the reduced vowel fully to /i/. The word ⟨тебе⟩ <code>/tʲi ˈbʲɛ/</code> (to you) demonstrates: the unstressed ⟨е⟩ first reduces, then fronts to <code>/i/</code> because it sits between two palatalized consonants.</td></tr>
						</tbody>
						</table>

						<p>Iotated vowels (⟨е⟩, ⟨ё⟩, ⟨ю⟩, and ⟨я⟩) follow the same logic. Unstressed ⟨я⟩ in j-cluster position (word-initial, after a vowel, or after a sign) produces <code>[jɪ]</code>; interpalatally, it will front to <code>[ji]</code>. Grayson is explicit that the reduced cluster <code>[jʌ]</code> should be avoided in sung Russian.</p>

						<h4 id="learn-u4-reconstitution">Reconstitution is an informed choice, not an obligation.</h4>

						<p>Reconstitution is the decision to undo full reduction, or to return a reduced vowel partway toward its unreduced value. In singing, where note values can sustain a vowel well beyond its spoken duration, a fully-reduced sound can feel too informal to sing as a sustained vowel value for the delivery of poetic text. Reconstitution gives the singer a principled option to restore formality and vowel distinction without abandoning Grayson’s phonological system.</p>

						<p>The process reverses the reduction chain entirely for most vowels, but only partway for ⟨о⟩:</p>

						<table>
						<thead><tr><th>Reduced sound</th><th>Reconstitutes to</th><th>Does not reconstitute to</th></tr></thead>
						<tbody>
						<tr><td><code>[ʌ]</code> (from ⟨а⟩ or ⟨о⟩)</td><td><code>/ɑ/</code></td><td>/o/ — the door to /o/ is one-way</td></tr>
						<tr><td><code>[ɪ]</code> (from ⟨е⟩)</td><td><code>/ɛ/</code></td><td>—</td></tr>
						<tr><td><code>[ɪ]</code> (from ⟨я⟩)</td><td><code>/ɑ/</code></td><td>—</td></tr>
						<tr><td><code>[jɪ]</code> (from ⟨я⟩ in j-cluster)</td><td><code>/jɑ/</code></td><td>—</td></tr>
						<tr><td><code>[jɪ]</code> (from ⟨е⟩ in j-cluster)</td><td><code>/jɛ/</code></td><td>—</td></tr>
						<tr><td><code>[ɨ]</code> (after always-hard consonants)</td><td>Does not reconstitute</td><td>—</td></tr>
						</tbody>
						</table>

						<p>The one-way door is the most important constraint. When <code>[ʌ]</code> reconstitutes, it returns to <code>/ɑ/</code>, never to <code>/o/</code>. The reduction from <code>/o/</code> to <code>/ɑ/</code> erases the rounding; reconstitution cannot restore what akanye has removed. Grayson asserts that <code>[ɨ]</code> after always-hard consonants does not reconstitute at all: the velarized environment is fixed.</p>

						<blockquote class="learn-callout">
						<p><strong>A note of respectful disagreement from Dann.</strong></p>
						<p>Grayson writes that “⟨и⟩ read as [ɨ] (stressed or unstressed) and unstressed ⟨е⟩ read as [ɨ] after a hard consonant (on long or short notes), remain sung as [ɨ]” (p. 129). This sentence contains two claims, and in my opinion, they are not equivalent.</p>
						<p>The first claim is sound. When ⟨и⟩ follows a hard consonant, the resulting [ɨ] is not a reduction: it is the vowel’s identity in that environment. Russians know and understand that in this instance ⟨и⟩ is pronounced [ɨ], or perhaps we can understand it as [ɨ] being spelled ⟨и⟩ in this case; they amount to the same outcome. There is no source vowel to reconstitute to, it is simply the traditional vowel that is performed in this circumstance, acknowledging that [ɨ] must follow an unpalatalized consonant, never [i]. The hard consonant forces the expression of the velar-i. I agree with Grayson here; reconstitution does not apply.</p>
						<p>I believe his second claim warrants reconsideration. When unstressed ⟨е⟩ follows one of the always-hard consonants (⟨ж⟩, ⟨ш⟩, ⟨ц⟩) to produce [ɨ], the underlying vowel is /ɛ/. /ɛ/ reduces to become [ɨ] in this case, and therefore the logic of reconstitution should still apply. I assert that on sustained notes or in slow(er) tempi, the singer can return (reconstitute) toward [ɛ]. In my experience, native Russian speakers and coaches consistently advocate this choice. Dr. Alexei Kochetov, a native Russian speaker and phonetician at the University of Toronto, offered precisely this note on my performance of Kabalevsky’s Op. 52, no. 2: “[toj ʒɨ] should probably be [toj ʒɛ] (with no reduction).”</p>
						<p>Perhaps an articulatory argument can support reconstitution in this case? The tongue postures of [ɛ] and the always-hard consonants [ʃ], [ʒ], and [ts] occupy the same medial neighbourhood; [ɛ] is not fronted enough to impose a conflict. This is not analogous to attempting /i/ after a hard consonant, where the fronting genuinely contradicts the consonant environment.</p>
						<p>This is the single point on which <em>Ilya</em> departs from Grayson’s reconstitution rules. When the reconstitution toggle is active, unstressed ⟨е⟩ after an always-hard consonant reconstitutes to [ɛ]. Nevertheless, if you disagree with me and wish to observe Grayson’s commitment to the inviolability of [ɨ] in this case, you can click the “Spot reduction” checkbox under the Word Stack in the Drawer and your [ɨ] will dutifully reappear.</p>
						</blockquote>

						<p>When to reconstitute is a matter of context and taste. A short note on a weak beat in a brisk tempo may welcome full reduction. A sustained note on a strong beat in a slow tempo may call for reconstitution. Russians seem to expect less reduction in the delivery of poetic texts, perhaps as a means of setting art apart from quotidian speech. The singer’s best confirmation comes from a native Russian coach; Ilya offers both options through the reconstitution toggle, so the singer can compare the two readings and make an informed choice.</p>

						<h4 id="learn-u4-try">Try this in Ilya.</h4>

						<p>Transcribe ⟨хорошо⟩. Three identical ⟨о⟩ letters produce three different sounds: <code>[ʌ]</code>, <code>/ɑ/</code>, <code>/o/</code>. Then toggle reconstitution on: the remote <code>[ʌ]</code> returns to <code>/ɑ/</code>, but neither unstressed vowel returns to <code>/o/</code>. The one-way door at work.</p>

						<p>Then try ⟨жена⟩ (a wife). With reconstitution off, the unstressed ⟨е⟩ after always-hard ⟨ж⟩ appears as <code>[ɨ]</code>. On the Drawer panel under Notation, toggle global reconstitution on, and <em>Ilya</em> restores it to <code>[ɛ]</code> — the departure from Grayson described above. Regardless of your global settings, if you prefer Grayson’s original rule, you can click “Spot reduction” or “Spot reconstitution” under the Word Stack in the Drawer (these labels respond contextually to your global settings), and your <code>[ɨ]</code> will dutifully reappear.</p>

						<p><em>Grayson source: Ch. 3 §§3, 5, 7–8 (pp. 97–129), Ch. 7 §1 (pp. 263–267). Reconstitution chart: p. 128, note p. 129. Aural differentiation of case forms: p. 266, fn. 306. Stress-timing framework: Mitton (dissertation, §4.5). Kochetov correction: personal communication, DMA recital adjudication, University of Toronto.</em></p>

						<h3 id="learn-unit-5">Section 5 · The Consonants</h3>

						<p>Russian has twenty-one consonant letters. The good news: the majority of these consonants produce sounds that the singer already knows from English, Italian, German, or French. A few require adjustment, and only a handful are genuinely new. We begin with the familiar and then focus our attention on what is not.</p>

						<p>One systematic difference governs the entire inventory. Where English consonants are typically alveolar (the tongue touches the ridge behind the upper teeth), Russian consonants are dental: the tip of the tongue touches the backs of the upper teeth themselves, as in Italian. Singers trained in Italian or French diction have already internalised this adjustment. Those coming from English or German will find that consciously advancing the tongue by a few millimetres produces the characteristic clarity of Russian consonant articulation.</p>

						<h4 id="learn-u5-familiar">How familiar is the Russian consonant system?</h4>

						<p>Of this subset of twenty-one consonant letters, thirteen produce sounds essentially identical to consonants the singer knows from Italian or another standard diction language: ⟨б⟩, ⟨в⟩, ⟨г⟩, ⟨д⟩, ⟨з⟩, ⟨й⟩, ⟨к⟩, ⟨м⟩, ⟨н⟩, ⟨п⟩, ⟨с⟩, ⟨т⟩, ⟨ф⟩. Two more are close enough that a brief remark suffices: ⟨р⟩ (trill it lightly) and ⟨ж⟩ (francophone singers already have it). We distinguish Russian sung ⟨х⟩ from the German <em>achlaut</em> (uvular), <code>[χ]</code>). The remaining five require focused attention and are presented in the table below.</p>

						<table>
						<thead><tr><th>Letter</th><th>Name</th><th>IPA</th><th>Closest equivalent</th><th>Notes</th></tr></thead>
						<tbody>
						<tr><td>⟨б⟩</td><td>бэ</td><td><code>/b/</code></td><td>Italian <code>/b/</code> in <em>bene</em> (“well”)</td><td>Fully stopped, no puff of air</td></tr>
						<tr><td>⟨в⟩</td><td>вэ</td><td><code>/v/</code></td><td>Italian <code>/v/</code> in <em>vino</em> (“wine”)</td><td>Lighter air pressure than English; fully voiced, not breathy</td></tr>
						<tr><td>⟨г⟩</td><td>гэ</td><td><code>/ɡ/</code></td><td>Italian <code>/ɡ/</code> in <em>gamba</em> (“leg”)</td><td>Voiced velar stop, no released air</td></tr>
						<tr><td>⟨д⟩</td><td>дэ</td><td><code>/d/</code></td><td>Italian <code>/d/</code> in <em>donna</em> (“woman”)</td><td>Dental, without strong release</td></tr>
						<tr><td>⟨ж⟩</td><td>жэ</td><td><code>/ʒ/</code></td><td>French <code>/ʒ/</code> in <em>je</em></td><td>Dark timbre; ladle-shaped tongue. Always hard</td></tr>
						<tr><td>⟨з⟩</td><td>зэ</td><td><code>/z/</code></td><td>German voiced <code>/z/</code> in <em>See</em> (“lake”)</td><td>Rich buzzing timbre</td></tr>
						<tr><td>⟨й⟩</td><td>и краткое</td><td><code>/j/</code></td><td>English <code>/j/</code> in <em>yes</em></td><td>Voiced, not sustained</td></tr>
						<tr><td>⟨к⟩</td><td>ка</td><td><code>/k/</code></td><td>Italian <code>/k/</code> in <em>casa</em> (“house”)</td><td>No aspirated puff of air</td></tr>
						<tr><td>⟨л⟩</td><td>эль</td><td><code>/ɫ/</code> or <code>/lʲ/</code></td><td>See “Two sounds of Russian ⟨л⟩” below</td><td>Two fundamentally different realisations</td></tr>
						<tr><td>⟨м⟩</td><td>эм</td><td><code>/m/</code></td><td>Same across European languages</td><td>Nasal, voiced</td></tr>
						<tr><td>⟨н⟩</td><td>эн</td><td><code>/n/</code></td><td>Italian dental <code>/n/</code></td><td>Dental placement</td></tr>
						<tr><td>⟨п⟩</td><td>пэ</td><td><code>/p/</code></td><td>Italian <code>/p/</code> in <em>padre</em> (“father”)</td><td>Unreleased stop, no puff of air</td></tr>
						<tr><td>⟨р⟩</td><td>эр</td><td><code>/r/</code></td><td>Italian trilled <code>/r/</code></td><td>Always lightly trilled when singing; an excessive Italian trill will sound like a caricature in Russian</td></tr>
						<tr><td>⟨с⟩</td><td>эс</td><td><code>/s/</code></td><td><code>/s/</code> in <em>see</em></td><td>Mid-tongue held low; darker timbre than English</td></tr>
						<tr><td>⟨т⟩</td><td>тэ</td><td><code>/t/</code></td><td>Italian <code>/t/</code> in <em>terra</em> (“earth”)</td><td>Dental, without strong release</td></tr>
						<tr><td>⟨ф⟩</td><td>эф</td><td><code>/f/</code></td><td>Same across European languages</td><td>Rare in native Russian words</td></tr>
						<tr><td>⟨х⟩</td><td>ха</td><td><code>/x/</code></td><td>German <em>achlaut</em> in <em>Bach</em></td><td>Velar fricative. Not a <code>/k/</code></td></tr>
						<tr><td>⟨ц⟩</td><td>цэ</td><td><code>/ts/</code></td><td>German <code>/ts/</code> in <em>Katze</em> (“cat”)</td><td>A single phoneme. Always hard</td></tr>
						<tr><td>⟨ч⟩</td><td>чэ</td><td><code>/tʃʲ/</code></td><td>Italian <code>/tʃ/</code> in <em>ciao</em> (“hello”), palatalized</td><td>A single phoneme. Always soft</td></tr>
						<tr><td>⟨ш⟩</td><td>ша</td><td><code>/ʃ/</code></td><td>English <code>/ʃ/</code> in <em>she</em></td><td>Darker than English. Always hard</td></tr>
						<tr><td>⟨щ⟩</td><td>ща</td><td><code>/ʃʲʃʲ/</code></td><td>No close equivalent</td><td>Double-length palatalized. Always soft</td></tr>
						</tbody>
						</table>

						<h4 id="learn-u5-pairs">Which consonants form voiced-voiceless pairs?</h4>

						<p>Russian consonants organise themselves into systematic pairs that share the same articulation but differ in their voicing. The singer trained in German diction already understands this principle: a voiced consonant and its voiceless partner prepare identical vocal tract configurations, except that one vibrates the vocal folds (voiced) and the other does not (voiceless).</p>

						<p>The importance of these pairs becomes clear in Section 7, where we address voicing assimilation (a voiceless consonant becoming voiced before a voiced neighbour, or vice versa), as well as final devoicing (a voiced consonant losing its voicing at the end of a word, as in German). Learn these pairs.</p>

						<table>
						<thead><tr><th>Voiced</th><th>Letter</th><th>Voiceless</th><th>Letter</th></tr></thead>
						<tbody>
						<tr><td><code>/b/</code></td><td>⟨б⟩</td><td><code>/p/</code></td><td>⟨п⟩</td></tr>
						<tr><td><code>/v/</code></td><td>⟨в⟩</td><td><code>/f/</code></td><td>⟨ф⟩</td></tr>
						<tr><td><code>/ɡ/</code></td><td>⟨г⟩</td><td><code>/k/</code></td><td>⟨к⟩</td></tr>
						<tr><td><code>/d/</code></td><td>⟨д⟩</td><td><code>/t/</code></td><td>⟨т⟩</td></tr>
						<tr><td><code>/ʒ/</code></td><td>⟨ж⟩</td><td><code>/ʃ/</code></td><td>⟨ш⟩</td></tr>
						<tr><td><code>/z/</code></td><td>⟨з⟩</td><td><code>/s/</code></td><td>⟨с⟩</td></tr>
						</tbody>
						</table>

						<p>In sung Russian, four consonants exist outside the pairing system. The sonorants (<code>/l/</code>, <code>/m/</code>, <code>/n/</code>, <code>/r/</code>) are always voiced and never devoice, even at the end of a word. These four sonorants are exempt from voicing assimilation: they neither trigger it nor are affected by it. The glide <code>/j/</code> ⟨й⟩, which Russians consider a palatalized consonant, is similarly exempt.</p>

						<p>The affricate <code>/ts/</code> (⟨ц⟩) and the palatalized affricate <code>/tʃʲ/</code> (⟨ч⟩) share two unique traits: neither is notated here with its own dedicated IPA symbol. One is written as an indivisible digraph, the other as a trigraph. Both have voiced counterparts that appear only through assimilation at the word boundary, but never through an orthographic glyph of their own. Unlike these two sounds, the fricative <code>/ʃʲʃʲ/</code> is assigned its own letter, ⟨щ⟩. The voiced allophonic forms of these letters are treated in Section 7.</p>

						<h4 id="learn-u5-attention">Which sounds require the singer’s focused attention?</h4>

						<h5 id="learn-u5-l">The two sounds of Russian ⟨л⟩</h5>

						<p>The letter ⟨л⟩ can produce two fundamentally different sounds, depending on context.</p>

						<ol>
						<li><strong>Velarised l <code>[ɫ]</code>, called hard-l.</strong> Before a hard consonant, before ⟨а⟩, ⟨о⟩, ⟨э⟩, ⟨у⟩, ⟨ы⟩, or at the end of a word without a soft sign, ⟨л⟩ is dark: velarised l, <code>/ɫ/</code>, the velarised dental lateral.</li>
						<li><strong>Palatalized l</strong>, called soft-l. Before a soft consonant, before ⟨я⟩, ⟨е⟩, ⟨ё⟩, ⟨ю⟩, ⟨и⟩, or before the soft sign ⟨ь⟩, ⟨л⟩ is clear: <code>/lʲ/</code>, the palatalized lateral. Within consonant clusters, only the hard-l phoneme <code>/ɫ/</code> is used. Conversely, the soft-l phoneme <code>/lʲ/</code> does not occur before any other palatalized consonant except itself (that is, in the isolated cluster <code>/lʲlʲ/</code>).</li>
						</ol>

						<p>You will not find plain <code>[l]</code> as a standalone symbol in Grayson’s system: it will always carry either the medial tilde to indicate velarisation (<code>[ɫ]</code>), or a palatalization marker (<code>[lʲ]</code>). The exception is the rarest of loanwords: <em>tremolo</em>, (tr<code>ɛ</code> mo lo).</p>

						<p>Velarised l <code>/ɫ/</code> is what Grayson calls “the only unpalatalized Russian consonant that does not have a familiar, coincident phoneme” in the European singing languages. This is perhaps true in the strictest sense, but North American English speakers know the allophone of <code>/l/</code> in the word <em>tall</em> well, and it approximates Russian velarised l (<code>[ɫ]</code>) closely enough for singing. It is velarised: the tongue tip contacts the upper teeth (as for any dental consonant), but the tongue body simultaneously rises to contact the front of the velum, at the transition between the hard and soft palates. The resulting sound has a quality perhaps akin to Russian velar-i <code>/ɨ/</code>.</p>

						<p>To find <code>/ɫ/</code>: place the tongue in the position for Italian dental <code>/l/</code>. While holding that position, pronounce the nonsense syllable “goo” and feel the tongue body rise. Maintain that back contact and attempt the English name <em>Luke</em>. The result should approximate лук <code>/ɫuk/</code> (“onion” or “bow”).</p>

						<p>“Though the Russian <code>/lʲ/</code>-phoneme is similar to the Italian <code>[ʎ]</code>-allophone (as in the word <em>gli</em>), there is a major difference in the articulation between the two. The Italian <code>[ʎ]</code>-allophone is actually fricative; the laterally escaping air causes a friction or vibration between the sides of the tongue and the back molars. This produces the idiomatic, Italian, lateral lisp-like sound. In Russian, there is no friction, thus the sides of the tongue are sealed against the back molars and do not leak any air. The air actually passes around the base of the tongue and comes up from the well of the lower teeth. The Russian <code>/lʲ/</code> should be liquid (sonorant), not ‘lisping’ (fricative).” (Grayson, p. 184)</p>

						<h5 id="learn-u5-x">⟨х⟩: the velar fricative</h5>

						<p>Singers trained in German diction know how to produce <code>/χ/</code> for the <em>achlaut</em> (uvular). Russian <code>/x/</code> is close, though Grayson notes that it is “articulated on the front of the velum” rather than further back. The velar consonants <code>[k]</code> and <code>[ɡ]</code> are both formed by contact between the tongue body and the soft palate; likewise, <code>[x]</code> and its voiced partner <code>[ɣ]</code> are formed at the same point. Practise alternating between stop and fricative at the soft palate, varying voicing and devoicing, to master these four specifically located consonants, and to sharpen the ability to distinguish your <code>[x]</code> from your <code>[χ]</code>.</p>

						<h5 id="learn-u5-r">⟨р⟩: the trill</h5>

						<p>Russian <code>/r/</code> is always lightly trilled in singing. In conversational speech, an initial or medial <code>/r/</code> may be merely tapped, but in lyric diction a light trill is expected. The length of the trill varies by position (shorter word-initially, longer word-finally) and by expressive intent, but more is not better. Avoid sounding like an Italian caricature by cultivating a light trill.</p>

						<h5 id="learn-u5-hushers">The hushers: ⟨ж⟩, ⟨ш⟩, and ⟨щ⟩</h5>

						<p>⟨ж⟩ and ⟨ш⟩ form a voiced-voiceless pair. Both are produced with a characteristically ladle-shaped tongue: the tip curls slightly and air passes underneath, producing a dark, broad timbre quite different from English <em>sh</em> or French <em>ch</em>. Francophone singers will recognise ⟨ж⟩ from <em>je</em>, <em>jour</em>, <em>rouge</em>.</p>

						<p>⟨щ⟩ is different. Where ⟨ш⟩ is a single short fricative, ⟨щ⟩ is a double-length palatalized fricative: <code>/ʃʲʃʲ/</code>. Grayson prefers the notation <code>/ʃʲʃʲ/</code> over <code>/ʃʲː/</code> because Russian speakers tend to rearticulate this sound rather than simply sustain it. The Moscow pronunciation <code>/ʃʲʃʲ/</code> is the norm in lyric diction; an older St. Petersburg variant <code>/ʃʲtʃʲ/</code> may be encountered in some references, but is not what Ilya produces. Non-native learners can focus on a pitch difference to distinguish the two: ⟨ш⟩ <code>[ʃ]</code> is a low, warm sound, while ⟨щ⟩ <code>/ʃʲʃʲ/</code> sounds higher-pitched and somehow quicker. The cause is tongue shape. For ⟨ш⟩ <code>[ʃ]</code> the tongue is flat or ladle-shaped, while for ⟨щ⟩ <code>/ʃʲʃʲ/</code> the tongue assumes the shape of the vowel <code>[i]</code>, forcing the exiting air through a narrower opening, raising the perception of pitch. More on palatalized vowels later.</p>

						<h5 id="learn-u5-affricates">The affricates: ⟨ц⟩ and ⟨ч⟩</h5>

						<p>⟨ц⟩ produces <code>/ts/</code>, a single phoneme despite its two-symbol IPA spelling, an indivisible digraph. This affricate is not a <code>/t/</code> followed by an <code>/s/</code> even though those symbols have been paired and adopted to describe it: the air is released through a single point of closure, and the sound should take no more time to pronounce than a single <code>/t/</code> or <code>/s/</code>. German-trained singers know this sound from <em>Katze</em> (“cat”), <em>Herz</em> (“heart”), <em>Mozart</em>.</p>

						<p>⟨ч⟩ produces <code>/tʃʲ/</code>, similarly a single phoneme. Italian-trained singers know it from <em>ciao</em> (“hello”) and <em>dolce</em> (“sweet”), though in Russian it carries an inherent palatalization that the Italian version does not. English palatalizes this affricate <em>à la russe</em> in the words <em>cheese</em>, <em>cheer</em>, <em>chief</em>, <em>chinos</em>, or wherever the speaker pronounces this affricate while preparing to follow it with the vowel <code>[i]</code>. More on this in the coming discussion of palatalization.</p>

						<h4 id="learn-u5-fixed">Which consonants never change hardness or softness?</h4>

						<p>Most Russian consonants exist in both hard (unpalatalized) and soft (palatalized) forms. The conditions that trigger palatalization are the subject of Section 6. But Russian has five special consonants that break the pattern: their hardness or softness is fixed and does not vary.</p>

						<p><strong>Always hard (never palatalized):</strong></p>

						<table>
						<thead><tr><th>Letter</th><th>IPA</th><th>Character</th></tr></thead>
						<tbody>
						<tr><td>⟨ж⟩</td><td><code>/ʒ/</code></td><td>Voiced husher</td></tr>
						<tr><td>⟨ш⟩</td><td><code>/ʃ/</code></td><td>Voiceless husher</td></tr>
						<tr><td>⟨ц⟩</td><td><code>/ts/</code></td><td>Voiceless affricate</td></tr>
						</tbody>
						</table>

						<p>Perhaps surprisingly, a soft sign (⟨ь⟩) following ⟨ж⟩ or ⟨ш⟩ does not signal palatalization; the sign serves a traditional grammatical function only, and is ignored. The word рожь (“rye”) ends with <code>/ʒ/</code>, not <code>/ʒʲ/</code>. Likewise, ⟨ь⟩ after ⟨ч⟩ or ⟨щ⟩ adds no additional softness, since these consonants are already inherently soft and cannot become softer.</p>

						<p><strong>Always soft (always palatalized):</strong></p>

						<table>
						<thead><tr><th>Letter</th><th>IPA</th><th>Character</th></tr></thead>
						<tbody>
						<tr><td>⟨ч⟩</td><td><code>/tʃʲ/</code></td><td>Palatalized affricate</td></tr>
						<tr><td>⟨щ⟩</td><td><code>/ʃʲʃʲ/</code></td><td>Double palatalized fricative</td></tr>
						</tbody>
						</table>

						<p>An important point: these five fixed consonants serve as boundaries to the palatalization process. A regressive chain of palatalization stops when it encounters ⟨ж⟩, ⟨ш⟩, or ⟨ц⟩. (The always-soft ⟨ч⟩ and ⟨щ⟩ do not stop the chain; they are themselves palatalizing agents.) These interactions are treated in Section 6.</p>

						<p>The always-hard consonants also affect the vowels that follow them. As we saw, unstressed ⟨е⟩ after ⟨ж⟩, ⟨ш⟩, or ⟨ц⟩ reduces to <code>/ɨ/</code> because the hard consonant environment blocks the fronting that would otherwise permit <code>[ɪ]</code>. This was noted in Section 4 (Vowel Reduction); here we name its cause.</p>

						<h4 id="learn-u5-signs">What do the two signs do?</h4>

						<p>Two Russian Cyrillic letters produce no sound of their own. But both are important functional markers that modify the pronunciation of the consonant that precedes them.</p>

						<h5 id="learn-u5-soft">⟨ь⟩ (мягкий знак): the soft sign</h5>

						<p>The soft sign (мягкий знак <code>/ˈmʲɑxʲkʲij znɑk/</code>) usually indicates that the consonant immediately before it becomes soft, that is, palatalized. This is the soft sign’s primary function. Mispronouncing a palatalized consonant as hard (or vice versa) can change the meaning of a word:</p>

						<table>
						<thead><tr><th>With ⟨ь⟩</th><th>IPA</th><th>Meaning</th><th>Without ⟨ь⟩</th><th>IPA</th><th>Meaning</th></tr></thead>
						<tbody>
						<tr><td>шесть</td><td><code>/ʃesʲtʲ/</code></td><td>six</td><td>шест</td><td><code>/ʃɛst/</code></td><td>a pole</td></tr>
						<tr><td>полька</td><td><code>/ˈpolʲ kɑ/</code></td><td>polka</td><td>полка</td><td><code>/ˈpoɫ kɑ/</code></td><td>a shelf</td></tr>
						<tr><td>мать</td><td><code>/mɑtʲ/</code></td><td>mother</td><td>мат</td><td><code>/mɑt/</code></td><td>checkmate</td></tr>
						</tbody>
						</table>

						<p>When ⟨ь⟩ sits between a preceding consonant and a following iotated vowel (⟨я⟩, ⟨е⟩, ⟨ё⟩, ⟨ю⟩), it duly palatalizes the preceding consonant but also forces the insertion of an audible <code>/j/</code> glide between the soft sign and the vowel that follows. This dynamic also involves noticeable aspiration, particularly for stops or sibilants that precede the soft sign. The word дьявол (“devil”), for example, is pronounced <code>/ˈdʲjɑ vʌɫ/</code>: the ⟨ь⟩ palatalizes the ⟨д⟩ and introduces the <code>/j/</code> glide before ⟨я⟩.</p>

						<p>The mechanism of palatalization itself is the subject of Section 6. Here, we are simply naming the role of the soft sign: usually it tells the singer that the preceding consonant is soft.</p>

						<h5 id="learn-u5-hard">⟨ъ⟩ (твёрдый знак): the hard sign</h5>

						<p>The hard sign is far less frequent than the soft sign, but when it appears, it carries meaning.</p>

						<p>⟨ъ⟩ (твёрдый знак <code>/ˈtvʲordɨj znɑk/</code>) once dominated Cyrillic pages as a terminal indicator letter for every word ending in a hard consonant. This practice was abolished with the 1918 orthographic reform. Today, the hard sign appears occasionally between a prefix and a root that begins with an iotated vowel. It creates a boundary: the consonant before ⟨ъ⟩ remains hard, and the iotated vowel after ⟨ъ⟩ inserts an initial <code>/j/</code> glide between itself and the hard sign. Without the hard sign, the iotated vowel would palatalize the preceding consonant instead of producing a glide. This is a key nuance that must be grasped and mastered.</p>

						<table>
						<thead><tr><th>With ⟨ъ⟩</th><th>IPA</th><th>Meaning</th><th>Without ⟨ъ⟩</th><th>IPA</th><th>Meaning</th></tr></thead>
						<tbody>
						<tr><td>объедать</td><td><code>/ɑb jɪ ˈdɑtʲ/</code></td><td>to eat around</td><td>обедать</td><td><code>/ɑ ˈbʲɛ dɑtʲ/</code></td><td>to dine</td></tr>
						<tr><td>съесть</td><td><code>/sʲjesʲtʲ/</code></td><td>to eat up</td><td>сесть</td><td><code>/sʲesʲtʲ/</code></td><td>to sit down</td></tr>
						</tbody>
						</table>

						<h4 id="learn-u5-devoicing">What happens to voiced consonants at the end of a word?</h4>

						<p>Singers trained in German diction already know this rule: voiced consonants devoice at the end of a word, regardless of spelling. Russian follows the same principle. A final ⟨б⟩ sounds as <code>/p/</code>, a final ⟨д⟩ as <code>/t/</code>, a final ⟨г⟩ as <code>/k/</code>, and so on through the six voiced-voiceless pairs. Devoicing also applies to palatalized consonants: a final ⟨дь⟩ sounds as <code>/tʲ/</code>, a final ⟨зь⟩ as <code>/sʲ/</code>.</p>

						<table>
						<thead><tr><th>Spelling</th><th>Pronunciation</th><th>IPA</th><th>Meaning</th></tr></thead>
						<tbody>
						<tr><td>зуб</td><td>⟨б⟩ → <code>/p/</code></td><td><code>/zup/</code></td><td>a tooth</td></tr>
						<tr><td>кров</td><td>⟨в⟩ → <code>/f/</code></td><td><code>/krof/</code></td><td>a shelter</td></tr>
						<tr><td>друг</td><td>⟨г⟩ → <code>/k/</code></td><td><code>/druk/</code></td><td>a friend</td></tr>
						<tr><td>снег</td><td>⟨г⟩ → <code>/k/</code></td><td><code>/sʲnɛk/</code></td><td>snow</td></tr>
						<tr><td>обед</td><td>⟨д⟩ → <code>/t/</code></td><td><code>/ɑ ˈbʲɛt/</code></td><td>lunch</td></tr>
						<tr><td>нож</td><td>⟨ж⟩ → <code>/ʃ/</code></td><td><code>/noʃ/</code></td><td>a knife</td></tr>
						<tr><td>глаз</td><td>⟨з⟩ → <code>/s/</code></td><td><code>/ɡɫɑs/</code></td><td>an eye</td></tr>
						<tr><td>князь</td><td>⟨зь⟩ → <code>/sʲ/</code></td><td><code>/kʲnɑsʲ/</code></td><td>a prince</td></tr>
						<tr><td>кровь</td><td>⟨вь⟩ → <code>/fʲ/</code></td><td><code>/krofʲ/</code></td><td>blood</td></tr>
						</tbody>
						</table>

						<p>The sonorants (<code>/l/</code>, <code>/m/</code>, <code>/n/</code>, <code>/r/</code> and their palatalized forms) are exempt: they remain voiced in all positions and do not devoice.</p>

						<p>Final devoicing is the first of several assimilation processes that are explained in Section 7. In this section, we have named devoicing as a property of the consonant inventory; in Section 7, we will explore how devoicing interacts with word boundaries, clitics, and adjacent consonants.</p>

						<h4 id="learn-u5-try">Try this in Ilya</h4>

						<p>Transcribe a word containing ⟨л⟩ in different positions. In мал (“small,” masculine short form), Ilya produces <code>/ɫ/</code> for the final consonant: dark, velarised. In мальчик (“boy”), the soft sign palatalizes the same letter to <code>/lʲ/</code>: clear, dental. Same letter, different context, different sound.</p>

						<p>Now transcribe друг (“friend”). Notice that the final ⟨г⟩ appears as <code>/k/</code> in the IPA line: devoiced, exactly as it would be in German. The Cyrillic letter that signals a voiced consonant is not the sound you sing. Final consonants devoice in sung Russian.</p>

						<p><em>Grayson source: Ch. 4 (all sections), Ch. 5 §1</em></p>

						<h3 id="learn-unit-6">Section 6 · Palatalization</h3>

						<h4 id="learn-u6-what">What Palatalization Is</h4>
						<p>Palatalization is a secondary articulation that is necessary in
						Russian but not unique to it. To palatalize, the tongue body (dorsum)
						rises and fronts toward the hard palate, approximating the [i] vowel
						position, while the primary consonant retains its usual place and manner
						of production. These two gestures occur simultaneously, not
						sequentially, which is why it is termed a coarticulation. Grayson is
						precise: the consonant is articulated with an “integrally palatalized
						tongue position” (Grayson 2012, 169). A palatalized [tʲ] is a single
						event, not [t] followed by [j]. The word тюк is /tʲuk/: three phonemes.
						If what you produce sounds like /tjuk/, the tongue is arriving late.
						Extending this principle, Grayson uses [ɲ] in place of the technically
						correct [nʲ] because of its familiarity to singers from French and
						Italian lyric diction. Newcomers are less likely to confuse [ɲ] with
						[nj], whereas [nʲ] and [nj] may seem marginally different on the page.
						The Russian word ⟨нет⟩ (no) is very often sung incorrectly with four
						phonemes as [njɛt], whereas its transcription as [ɲɛt] reinforces a
						sequence of three quite familiar phonemes that produce idiomatic
						Russian.</p>
						<p>You do this all the time. When you say “key,” your tongue prepares an
						[i]-shaped oral space before it even releases the /k/; compare “car,”
						where it does not. The /k/ in “car” is [k]. The /k/ in “key” is [kʲ].
						Palatalization is that anticipatory tongue-fronting, and you perform it
						without thinking. Italian [ɲ] in “ogni,” English “cute” versus “coot,”
						French /d/ in “dire”: each involves the same gesture. A marked
						difference, however, is that palatalization carries no inherent meaning
						in English, French, or Italian, but it does in Russian.</p>
						<p>In Russian, palatalization signals radical change in meaning: мат [mat] (<em>checkmate</em>), мать [matʲ] (<em>mother</em>); брат [brat] (<em>brother</em>), брать [bratʲ] (<em>to take</em>). Palatalization is the sole carrier of
						lexical distinction between these pairs. Our pedagogical task is not to
						learn a new physical skill from scratch, but to develop conscious
						control over a gesture we already possess, and to apply it consistently
						wherever Russian requires it.</p>
						<p>Grayson’s practical model for this control is “arch, pronounce, peel”
						(Grayson 2012, 205). We might reframe this as Prepare, Pronounce, Peel,
						where “Prepare” names the anticipatory arch that prevents the [C]+[j]
						sequence Grayson warns us against. The tongue body arches toward the
						dome of the hard palate; the consonant is pronounced with the tongue
						sustaining that arched position; the dorsum peels away rapidly as the
						next vowel follows. We do well to think of anticipating the necessary
						[i] posture while executing the now-palatalized consonant; this ensures
						that the timing does not degrade into sequential production. Practise
						slowly with familiar consonants (/tʲ/, /dʲ/, /ɲ/) in VCV groupings
						before attempting more exposed combinations, then through the full vowel
						inventory. It is gradual practice, and errors are requisite.</p>
						<table>
						<colgroup>
						<col />
						<col />
						<col />
						<col />
						<col />
						<col />
						<col />
						<col />
						</colgroup>
						<thead>
						<tr class="header">
						<th></th>
						<th>/i/</th>
						<th>/e/</th>
						<th>/ɛ/</th>
						<th>/a/</th>
						<th>/ɑ/</th>
						<th>/o/</th>
						<th>/u/</th>
						</tr>
						</thead>
						<tbody>
						<tr class="odd">
						<td>VCV with /tʲ/</td>
						<td>iːtʲi</td>
						<td>iːtʲe</td>
						<td>iːtʲɛ</td>
						<td>iːtʲa</td>
						<td>iːtʲɑ</td>
						<td>iːtʲo</td>
						<td>iːtʲu</td>
						</tr>
						<tr class="even">
						<td>Exposed /tʲ/</td>
						<td>tʲiː</td>
						<td>tʲeː</td>
						<td>tʲɛː</td>
						<td>tʲaː</td>
						<td>tʲɑː</td>
						<td>tʲoː</td>
						<td>tʲuː</td>
						</tr>
						<tr class="odd">
						<td>VCV with /dʲ/</td>
						<td>iːdʲi</td>
						<td>iːdʲe</td>
						<td>iːdʲɛ</td>
						<td>iːdʲa</td>
						<td>iːdʲɑ</td>
						<td>iːdʲo</td>
						<td>iːdʲu</td>
						</tr>
						<tr class="even">
						<td>Exposed /dʲ/</td>
						<td>dʲiː</td>
						<td>dʲeː</td>
						<td>dʲɛː</td>
						<td>dʲaː</td>
						<td>dʲɑː</td>
						<td>dʲoː</td>
						<td>dʲuː</td>
						</tr>
						<tr class="odd">
						<td>VCV with /ɲ/</td>
						<td>iːɲi</td>
						<td>iːɲe</td>
						<td>iːɲɛ</td>
						<td>iːɲa</td>
						<td>iːɲɑ</td>
						<td>iːɲo</td>
						<td>iːɲu</td>
						</tr>
						<tr class="even">
						<td>Exposed /ɲ/</td>
						<td>ɲiː</td>
						<td>ɲeː</td>
						<td>ɲɛː</td>
						<td>ɲaː</td>
						<td>ɲɑː</td>
						<td>ɲoː</td>
						<td>ɲuː</td>
						</tr>
						</tbody>
						</table>
						<p>For those with an interest in the acoustics: palatalization aligns
						with several goals of classical vocal technique. The forward tongue
						position vacates the pharyngeal space, increasing the volume of the
						pharyngeal resonator and facilitating “open-throated” production: what
						Italian pedagogy calls <em>la gola aperta</em> (Mitton 2020, 20, 38;
						Bolla 1980, 8). Acoustic measurements of sung Russian confirm that the
						effects on vocal tract resonances are present but subtle: fR2 raises
						while fR1 drops, mimicking the acoustic profile of the [i] vowel it
						simulates (Mitton 2020, 131–32). The singer who palatalizes well is
						simultaneously optimising the vocal tract for efficient resonance.</p>
						<h4 id="learn-u6-signals">What Signals Palatalization on the Page? What Do I Look for?</h4>
						<p>Vowels cannot become palatalized. Palatalization only happens to
						consonants. But in Cyrillic texts, palatalization is most often encoded
						in the vowel letters. Palatalization is also signalled by the soft sign.
						Grayson prefers “indicator letters” as an umbrella term for the Cyrillic
						letters that signal palatalization. I prefer the more descriptive and
						equally made-up term, “palatalizing agents.” They include:</p>
						<ul>
						<li>the soft sign ⟨ь⟩</li>
						<li>any vowel from the “soft series:” ⟨я /jɑ/, е /jɛ/, и /i/, ё /jo/, ю
						/ju/⟩</li>
						<li>either of the two always-soft letters (⟨ч⟩ [tʃʲ] or ⟨щ⟩ [ʃʲʃʲ])</li>
						<li>another valid palatalized consonant (treated in 6.5)</li>
						</ul>
						<table>
						<thead><tr><th>Palatalizing agent</th><th>Hard counterpart</th><th>What the agent does</th><th>Example</th></tr></thead>
						<tbody>
						<tr><td>⟨я⟩ palatalizes + /ɑ/</td><td>⟨а⟩ does not palatalize; same vowel</td><td>Palatalizes the preceding consonant; the vowel sounds /ɑ/ (stressed) or reduces (unstressed).</td><td>мять /mʲatʲ/ (“to crumple”) vs мать /mɑtʲ/ (“mother”)</td></tr>
						<tr><td>⟨е⟩ palatalizes + /ɛ/</td><td>⟨э⟩ does not palatalize; same vowel</td><td>Palatalizes the preceding consonant; the vowel sounds /ɛ/ (stressed) or reduces (unstressed).</td><td>нет /ɲɛt/ (“no”) vs нэп /nɛp/</td></tr>
						<tr><td>⟨ё⟩ palatalizes + /o/</td><td>⟨о⟩ does not palatalize; same vowel</td><td>Palatalizes the preceding consonant; the vowel sounds /o/ (always stressed).</td><td>тёмный /ˈtʲom nɨj/ (“dark”) vs том /tom/ (“tome”)</td></tr>
						<tr><td>⟨ю⟩ palatalizes + /u/</td><td>⟨у⟩ does not palatalize; same vowel</td><td>Palatalizes the preceding consonant; the vowel sounds /u/ (stressed or unstressed).</td><td>тюк /tʲuk/ (“bale”) vs тук /tuk/ (“knock”)</td></tr>
						<tr><td>⟨и⟩ palatalizes + /i/</td><td>⟨ы⟩ /ɨ/ after hard consonant</td><td>Palatalizes the preceding consonant; the vowel sounds /i/.</td><td>мир /mʲir/ (“world”)</td></tr>
						<tr><td>⟨ь⟩ (soft sign)</td><td>⟨ъ⟩ (hard sign)</td><td>Palatalizes the consonant to its left. Produces no sound of its own.</td><td>мать /mɑtʲ/ (“mother”) vs подъезд /pɑdˈjest/</td></tr>
						<tr><td>⟨ч⟩, ⟨щ⟩ (always-soft)</td><td>⟨ж⟩, ⟨ш⟩, ⟨ц⟩ (always-hard)</td><td>Inherently palatalized; may palatalize many (but not all) preceding consonants in a cluster.</td><td>мальчик /ˈmɑlʲtʃʲɪk/ (“boy”)</td></tr>
						<tr><td>Already-palatalized consonant</td><td>—</td><td>Spreads palatalization leftward through a cluster (regressive assimilation), until a boundary stops it.</td><td>гость /ɡosʲtʲ/ (“guest”)</td></tr>
						</tbody>
						</table>
						<p>This introduces the well-documented corollary called the regressive
						assimilation of palatalization, or regressive palatalization for short.
						A palatalized consonant (through whatever means) can usually transmit
						its palatalization backward, to the consonant immediately to its left,
						with certain limits. This regressive palatalization proceeds backwards,
						neighbour to neighbour, right-to-left until something stops it.</p>
						<p>Consider гость [ɡosʲtʲ] (<em>guest</em>): the ь palatalizes the т, and the now-palatalized т
						palatalizes the с before it. Always to the left. In practice, this
						signals an anticipation of putting the tongue in that fronted [i]
						posture well before the causal palatalized consonant is even sounded.
						Two Russian consonants, ⟨ч⟩ /tʃʲ/ and ⟨щ⟩ /ʃʲʃʲ/, are inherently
						palatalized (and palatalization markers populate their default IPA
						values accordingly).</p>
						<p>What stops the spread is the subject of 6.3, and the specific rules
						governing which consonants participate in regressive assimilation are
						treated in 6.5.</p>
						<p>An IPA transcription is blessedly more straightforward. In IPA,
						palatalization is marked by a single, consistent symbol: the superscript
						[ʲ] following the consonant. Grayson adopts this notation from the 1989
						Kiel Convention of the International Phonetic Association, which
						deprecated an older set of symbols in favour of this uniform superscript
						(Grayson 2012, 61–62). The singer looking at Ilya’s output sees [ʲ]
						wherever a consonant is palatalized: /tʲ/, /dʲ/, /sʲ/, /mʲ/, and so on.
						The single exception is [ɲ], discussed in 6.1.</p>
						<p>The deprecated symbols deserve brief mention because the singer will
						encounter them in other resources. Before 1989, the IPA marked
						palatalization with palatal hooks: small descending curves appended to
						the base of consonant letters. Natalia Challis’s <em>The Singer’s
						Rachmaninoff</em> (2006), among other references, uses this older
						notation. The symbols are visually distinct from one another, whereas
						the modern superscript [ʲ] applies uniformly to any consonant. A
						correspondence table is provided here for reference:</p>
						<table>
						<colgroup>
						<col />
						<col />
						</colgroup>
						<thead>
						<tr class="header">
						<th>Category</th>
						<th>Deprecated → Modern</th>
						</tr>
						</thead>
						<tbody>
						<tr class="odd">
						<td>Labials and labiodentals</td>
						<td>ᶈ → pʲ, ᶀ → bʲ, ᶆ → mʲ, ᶂ → fʲ, ᶌ →
						vʲ</td>
						</tr>
						<tr class="even">
						<td>Dentals, alveolars, and nasal</td>
						<td>ƫ → tʲ, ᶁ → dʲ, ᶉ → rʲ, ᶊ → sʲ, ᶎ → zʲ, ᶋ
						→ ʃʲ, ᶅ → lʲ, ᶇ → ɲ</td>
						</tr>
						<tr class="odd">
						<td>Velars</td>
						<td>ᶄ → kʲ, ᶃ → ɡʲ, ᶍ → xʲ</td>
						</tr>
						</tbody>
						</table>
						<p>Cheri Montgomery’s <em>Russian Lyric Diction Workbook</em> (STM,
						2021) is the only other Russian lyric diction print resource beside
						Grayson to consistently employ the modern IPA palatalization markers
						adopted at the 1989 Kiel Convention. The divergences across other
						systems are legion: older palatal hook diacritics, inconsistent
						superscript usage, and notational choices that obscure the very
						distinction the singer needs to see. Ilya implements Grayson’s notation
						conventions throughout, with the flexibility to change any of them. A
						singer consulting other resources should be aware that symbols may
						differ, and respond with flexibility.</p>
						<h4 id="learn-u6-stops">What Stops the Spread?</h4>
						<p>Regressive palatalization spreads backward through a consonant
						cluster, but not indefinitely. The singer who knows the palatalizing
						agents (6.2) and the six boundaries below can predict palatalization for
						just about any word.</p>
						<table>
						<colgroup>
						<col />
						<col />
						<col />
						</colgroup>
						<thead>
						<tr class="header">
						<th>Boundary</th>
						<th>What it does</th>
						<th>Example</th>
						</tr>
						</thead>
						<tbody>
						<tr class="odd">
						<td>Always-hard consonants (⟨ж⟩, ⟨ш⟩,
						⟨ц⟩)</td>
						<td>These consonants cannot be palatalized and
						block the spread of regressive palatalization entirely. The chain stops
						here.</td>
						<td>большой /bɑlʲ ˈʃoj/: the ь palatalizes л,
						but ш is always-hard and absorbs nothing.</td>
						</tr>
						<tr class="even">
						<td>A vowel</td>
						<td>Palatalization only applies to consonants,
						so a vowel breaks the backward chain. The vowel may itself be the last
						element to be influenced (see below).</td>
						<td>мать /mɑtʲ/: the ь palatalizes т; the
						vowel /ɑ/ is the boundary.</td>
						</tr>
						<tr class="odd">
						<td>Hard sign ⟨ъ⟩</td>
						<td>A spelling-based boundary that blocks
						palatalization from reaching the consonant to its left. Exception: ⟨в⟩,
						⟨с⟩, and ⟨з⟩ do palatalize before ⟨ъ⟩.</td>
						<td>подъезд /pɑdˈjest/: the ъ prevents ё from
						palatalizing д. Compare съезд /sʲjest/: the с palatalizes because it is
						one of the three exception consonants.</td>
						</tr>
						<tr class="even">
						<td>A new palatalizing agent</td>
						<td>Not a wall but a reset. When a second
						indicator letter or soft sign appears, it establishes a new, independent
						point of regressive influence.</td>
						<td>сестрёнка /sʲi ˈsʲtʲrʲon kɑ/: the ё
						palatalizes the cluster стр; the е is a separate agent that palatalizes
						the initial с independently.</td>
						</tr>
						<tr class="odd">
						<td>Word boundary</td>
						<td>Palatalization generally does not cross
						the word boundary. This distinguishes it from voicing assimilation,
						which does cross freely (Section 7). Exception: when a word ends in ⟨в⟩,
						⟨с⟩, or ⟨з⟩ and the following word begins with an indicator letter other
						than ⟨и⟩, the final consonant palatalizes across the boundary.</td>
						<td>Full treatment in Section 7.</td>
						</tr>
						<tr class="even">
						<td>Punctuation</td>
						<td>Absolute. No assimilation of any kind
						crosses punctuation (Grayson 2012, 206). This is the one boundary with
						no exceptions.</td>
						<td>Full treatment in Section 7.</td>
						</tr>
						</tbody>
						</table>
						<p>The most common boundary the singer will encounter within a word is
						the first: an always-hard consonant. We met ⟨ж⟩, ⟨ш⟩, and ⟨ц⟩ in Section
						5 as consonants that are never palatalized. Here they function as walls
						against regressive palatalization. In большой, the ⟨ь⟩ palatalizes the
						⟨л⟩, but the ⟨ш⟩ to its left is impervious. The palatalization stops,
						and the ⟨б⟩ retains its hardness. The singer who has internalised the
						three always-hard consonants from Section 5 already knows the most
						important boundary in the system.</p>
						<p>The vowel boundary deserves a brief clarification. A vowel stops the
						consonant-to-consonant chain, but the vowel may itself be the last
						element to be influenced: if it finds itself sandwiched between two
						palatalized consonants (interpalatal), it fronts (see Section 3). But
						this is not the palatalization of a vowel. Rather, it is an
						acknowledgment of human physiological constraints. Lindblom’s “economy
						of speech gestures” rule (1983) suggests: “In human speech extreme
						values of parameters are avoided.” The tongue is arched for the phonemes
						before and after the vowel, so the palatally sandwiched vowel will not
						return fully to its home base, instead “fronting” to a brighter
						allophone. This is how interpalatal fronting transforms [ɑ] to [a] and
						[ɛ] to [e]. Grayson reminds us that “all vowels preceding palatalized
						consonants are fronted, even more so when interpalatal,” though “only
						[ja], [a], [je], and [e] are formally recognized in Russian lyric
						diction as secondary allophones” (Grayson 2012, 208).</p>
						<h4 id="learn-u6-paired">Paired versus Unpaired</h4>
						<p>The singer now knows what palatalization is (6.1), what triggers it
						(6.2), and what stops it (6.3). The natural next question: which
						consonants can be palatalized at all?</p>
						<p>Most Russian consonants are paired: they exist in both hard and soft
						forms, and the distinction between them is phonemic. Five consonants are
						unpaired: three are always hard and can never be palatalized; two are
						always soft and are never heard without palatalization. The singer has
						met all five in Section 5. Here we consolidate the complete picture.</p>
						<table>
						<colgroup>
						<col />
						<col />
						<col />
						</colgroup>
						<thead>
						<tr class="header">
						<th>Category</th>
						<th>Consonants</th>
						<th>Notes</th>
						</tr>
						</thead>
						<tbody>
						<tr class="odd">
						<td>Paired (hard and soft forms)</td>
						<td>б/бʲ, п/пʲ, в/вʲ, ф/фʲ, д/дʲ, т/тʲ, з/зʲ,
						с/сʲ, г/гʲ, к/кʲ, х/хʲ, м/мʲ, н/нʲ[ɲ], р/рʲ, л[ɫ]/лʲ[lʲ]</td>
						<td>Fifteen consonants. Each has a hard
						default and a soft counterpart produced by palatalization. The hard
						lateral is transcribed [ɫ] (dark l); the soft nasal is transcribed [ɲ]
						rather than [nʲ] (see 6.1).</td>
						</tr>
						<tr class="even">
						<td>Always hard (unpaired)</td>
						<td>ж [ʒ], ш [ʃ], ц [ts]</td>
						<td>These three consonants are impervious to
						palatalization. They function as boundaries (6.3). A soft sign after ⟨ж⟩
						or ⟨ш⟩ is ignored: it signals gender or conjugation, not softness.</td>
						</tr>
						<tr class="odd">
						<td>Always soft (unpaired)</td>
						<td>ч [tʃʲ], щ [ʃʲʃʲ]</td>
						<td>Two consonants. These are inherently
						palatalized and can act as palatalizing agents for consonants to their
						left in clusters (6.2).</td>
						</tr>
						</tbody>
						</table>
						<p>Twenty consonants in all. Fifteen are paired; five are fixed. The
						singer who has internalised this table can look at any consonant in a
						Russian word and know immediately whether it is capable of
						palatalization. If it is paired, look for an agent to its right. If it
						is always hard, it is a wall. If it is always soft, it is an agent.</p>
						<h4 id="learn-u6-clusters">Regressive Palatalization in Clusters</h4>
						<p>Not all consonants participate equally in regressive palatalization.
						Russian lyric diction follows the Old Muscovite tradition, which
						palatalizes more generously within consonant clusters than contemporary
						spoken Russian does (Grayson 2012, 209). The five rules below, derived
						from Derwing and Priestly (1980, 76–87), describe the constraints that
						govern this generosity. Where a specific word departs from these rules
						under Stage pronunciation conventions, Ilya handles it as an individual
						dictionary entry, with citation.</p>
						<table>
						<colgroup>
						<col />
						<col />
						<col />
						</colgroup>
						<thead>
						<tr class="header">
						<th>Rule</th>
						<th>Constraint</th>
						<th>Example</th>
						</tr>
						</thead>
						<tbody>
						<tr class="odd">
						<td>1. /ɫ/ (dark l)</td>
						<td>Does not regressively palatalize, except
						when doubled: ⟨-лль-⟩ → /lʲlʲ/.</td>
						<td>In ⟨-лн-⟩, the л remains [ɫ] even if н is
						palatalized.</td>
						</tr>
						<tr class="even">
						<td>2. /r/</td>
						<td>Does not regressively palatalize, except
						when doubled: ⟨-ррь-⟩ → /rʲrʲ/. See progressive exception below.</td>
						<td>The trill resists regressive
						palatalization more than any other paired consonant.</td>
						</tr>
						<tr class="odd">
						<td>3. /n/</td>
						<td>Only before another palatalized /n/ or a
						palatalized dental.</td>
						<td>Before a palatalized labial or velar, /n/
						retains its hardness.</td>
						</tr>
						<tr class="even">
						<td>4. Velars (/k/, /ɡ/, /x/)</td>
						<td>Only before another palatalized
						velar.</td>
						<td>A velar before a palatalized dental or
						labial retains its hardness.</td>
						</tr>
						<tr class="odd">
						<td>5. Labials (/b/, /p/, /v/, /f/)</td>
						<td>Only before another palatalized
						labial.</td>
						<td>A labial before a palatalized dental or
						velar retains its hardness.</td>
						</tr>
						</tbody>
						</table>
						<p>We might call the underlying principle homorganic sympathy:
						consonants receive regressive palatalization most readily from
						neighbours that share their place of articulation. Dentals are the most
						permissive. Velars and labials are the most restrictive. Dark l and the
						trill are exceptional even among their own categories.</p>
						<p><strong>The progressive exception.</strong> Everything we have
						discussed in Section 6 so far has been regressive: influence flowing
						backward, from right to left. Rule 2 contains a single exception, and it
						reverses the direction entirely. The trill /r/ palatalizes progressively
						(forward, left to right) when it is preceded by a stressed front vowel:
						⟨и⟩, ⟨е⟩, or ⟨э⟩. In this configuration, the vowel’s tongue position
						influences the consonant that follows it. Consider первый /ˈpʲerʲ vɨj/
						(“first”): the stressed ⟨е⟩ palatalizes the р to its right, despite no
						palatalizing agent appearing after it. The same holds in верность
						/ˈvʲerʲ nʌsʲtʲ/ (“faithfulness”). Grayson’s own examples for this rule include смерть /sʲmʲerʲtʲ/ (“death”) and терпеть /tʲirʲ ˈpʲetʲ/ (“to endure”), where in each case the stressed front vowel palatalizes the /r/ to its right. This is the only consonant in Russian
						that palatalizes in this direction, and only under these conditions:
						stressed syllable, front vowel, immediately preceding the trill. It is a
						small rule, but it is structurally unique.</p>
						<h4 id="learn-u6-practice">Putting It Together</h4>
						<p>The following worked examples, adapted from Grayson (2012, 210–211),
						apply the principles from 6.1 through 6.5 in order of increasing
						complexity. Each word introduces one new complication.</p>
						<p><strong>стол → /stoɫ/.</strong> No indicators, no palatalizing
						agents. Every consonant is hard. The л is dark [ɫ].</p>
						<p><strong>столь → /stolʲ/.</strong> The soft sign ⟨ь⟩ palatalizes the
						л: dark [ɫ] becomes [lʲ]. The vowel ⟨о⟩ is a boundary; palatalization
						does not spread leftward past it.</p>
						<p><strong>мать → /mɑtʲ/.</strong> The soft sign palatalizes the т. The
						vowel ⟨а⟩ is again a boundary, and since it is not interpalatal (no
						palatalizing agent precedes it), it remains [ɑ].</p>
						<p><strong>мять → /matʲ/.</strong> Two palatalizing agents now: ⟨я⟩
						palatalizes the м, and ⟨ь⟩ palatalizes the т. The ⟨а⟩ vowel is
						interpalatal (palatalized consonant on both sides) and stressed, so it
						fronts from [ɑ] to [a]. Compare мать: same skeletal structure, different
						vowel quality, because palatalization now surrounds the vowel.</p>
						<p><strong>большой → /bɑlʲ ˈʃoj/.</strong> The soft sign palatalizes the
						л. Palatalization cannot spread further left because the vowel ⟨о⟩ is a
						boundary. It cannot spread right because ⟨ш⟩ is always hard: impervious,
						functioning as a wall (6.3).</p>
						<p><strong>сестрёнка → /sʲi ˈsʲtʲrʲon kɑ/.</strong> The ⟨ё⟩ palatalizes
						the cluster to its left: р, then т, then с. Each palatalized consonant
						becomes an agent for the next, spreading regressively until the vowel
						boundary. The unstressed ⟨е⟩ in the first syllable is also preceded by a
						palatalized с, making it interpalatal; it reduces to /i/. The к does not
						palatalize because the ⟨а⟩ that follows it is not a palatalizing
						agent.</p>
						<p><strong>симметрический → /sʲi mʲmʲi ˈtʲrʲi tʃʲɪ skɨj/.</strong> Full
						cluster palatalization across multiple syllables, following the Old
						Muscovite stage tradition. The ending ⟨-ский⟩ routes to /skɨj/ by lyric
						diction convention (see Section 5), not /sʲkʲij/: the velar-i [ɨ]
						appears here because palatalization does not apply to this particular
						morphological ending.</p>
						<p>Each example builds on the last. The singer who can explain why мять [matʲ] (<em>to crumple</em>) has [a] where мать [mɑtʲ] (<em>mother</em>) has [ɑ], and why большой’s ⟨ш⟩ blocks what сестрёнка’s
						cluster permits, has internalised the system.</p>
						<h4 id="learn-u6-velari">Velar-i [ɨ]</h4>
						<p>Velar-i occupies the space where palatalization cannot go. It is the
						vowel sound that appears when ⟨и⟩ follows an always-hard consonant (⟨ж⟩,
						⟨ш⟩, ⟨ц⟩) or when certain morphological endings resist palatalization by
						convention: the ⟨-ский⟩ ending we encountered in симметрический is one
						such case.</p>
						<p>The symbol is [ɨ], the close central unrounded vowel. The tongue
						fronts as for [i], but also retracts toward the centre of the mouth like
						the bowl of a ladle. English speakers produce something close to this
						vowel in unstressed syllables: the second vowel in “roses” or “needed,”
						where the tongue sits high but uncommitted to either front or back
						position. It is not a difficult sound to produce. It is challenging to
						produce on purpose, and to sustain musically, because anglophones rarely
						need to distinguish it from [ɪ]. English speakers unwittingly achieve
						[ɨ] as [ɪ] gets coloured by [ɫ] on the way to [k] in “milk” when it is
						spoken casually.</p>
						<p>Russian makes the distinction structurally. After a palatalized
						consonant, ⟨и⟩ is [i]: the tongue is already fronted, and the vowel
						simply continues the fronted posture. After an always-hard consonant,
						the tongue cannot front (the consonant forbids it), and [ɨ] results. The
						two sounds are not separate phonemes in Russian; they are positional
						variants of a single vowel, conditioned entirely by the hardness or
						softness of the preceding consonant. The singer does not choose between
						them. The consonant chooses.</p>
						<p>Consider жить /ʒɨtʲ/ (“to live”): the always-hard ⟨ж⟩ forces the ⟨и⟩
						to retract to [ɨ], but the ⟨ь⟩ palatalizes the т. Or цирк /tsɨrk/
						(“circus”): the always-hard ⟨ц⟩ again retracts the vowel. In both cases,
						the Cyrillic letter is ⟨и⟩, but the sound is [ɨ]. Ilya marks this
						automatically.</p>
						<p><strong>Try this.</strong> Compare нет /ɲɛt/ (<em>no</em>) with нот /not/ (<em>note</em>). In нет,
						the ⟨е⟩ palatalizes the н to [ɲ]: a single gesture, not [nj]. In нот,
						nothing palatalizes: the н is hard, the vowel is [o], and the т is hard.
						Two short words, identical in length, with entirely different consonant
						profiles. If the palatalization in нет is audible and the н in нот is
						clearly unpalatalized, the system is working.</p>
						<p>This principle extends across word boundaries. Consider the phrase к
						Игорю (“to Igor’s place”): the preposition к is a consonant incapable of
						palatalization on its own. The word boundary prevents it from
						regressively palatalizing (6.3, boundary 5). The к remains hard. Yet
						speech is linear: the vocal tract must move from that hard [k] directly
						into the vowel that begins Игорю. The tongue cannot leap instantaneously
						from a hard velar position into a fully fronted [i]. Instead, the vowel
						accommodates the consonant that precedes it, retracting to [ɨ]. The
						Cyrillic text still reads ⟨и⟩, but the sound is [kɨ ˈɡorʲju]. Velar-i,
						then, is not confined to always-hard consonants. It is the acoustic
						consequence of any hard consonant meeting ⟨и⟩: the vowel yields to the
						consonant’s articulatory reality.</p>


<h3 id="learn-unit-7">Section 7 · Assimilation and Boundaries</h3>

						<h4 id="learn-u7-two">Two Kinds of Regressive Assimilation</h4>

						<p>We have just learned that palatalization spreads backward through a consonant cluster on the page: in real time, the tongue arches in anticipation of a palatalizing agent that is present downstream. Now we meet a second process that moves in the same direction, and the resemblance is close enough to warrant a moment of orientation before we proceed.</p>

						<p>Voicing assimilation, like palatalization, is regressive. It spreads from right to left through a consonant sequence, and for the same underlying reason: the vocal tract anticipates what comes next. But the two processes describe two very real, very different physical questions that live in the physical body, not just in the abstract.</p>

						<p>Palatalization, as we have seen, poses a question that the tongue answers. Is the blade arched toward the hard palate, or is it not? You have practised this binary in Section 6: the <code>[ɲ]</code> in нет, where the tongue arches, versus the <code>[n]</code> in нот, where it does not. That arch, or its absence, is the physical event that captures and defines what palatalization is.</p>

						<p>Voicing is a question that the larynx answers. Are the vocal folds vibrating, or are they not? Place your fingers against your throat and sustain <code>[z]</code>; you will feel the buzz of the folds in vibration. Now sustain <code>[s]</code> at the same pitch effort; the buzz disappears. The mouth and tongue are doing the same thing in both cases. What changes is whether the folds are open or closed. That is the voicing binary.</p>

						<table>
						<thead><tr><th></th><th>Voicing assimilation</th><th>Palatalization</th></tr></thead>
						<tbody>
						<tr><td>Physical locus</td><td>Larynx (vocal folds)</td><td>Tongue blade</td></tr>
						<tr><td>The binary</td><td>Vibrating or not</td><td>Arched or not</td></tr>
						<tr><td>Direction</td><td>Regressive (anticipatory)</td><td>Regressive (anticipatory)</td></tr>
						<tr><td>Triggered by</td><td>Voicing state of the following obstruent</td><td>Palatalizing agent that follows</td></tr>
						</tbody>
						</table>

						<p>To repeat, both processes are regressive because both are anticipatory. The articulatory system prepares for what it knows is coming, and that preparation reaches backward into what precedes it. This is efficient, not arbitrary, and it is not unique to Russian: you already perform anticipatory voicing adjustments in German, and anticipatory nasalization in spoken French, without thinking about it. The direction is shared because the principle is shared; but the mechanisms behind palatalization (tongue arch) and voicing (vocal fold binary) are not.</p>

						<p>Accordingly, this independence allows for a consonant to be simultaneously devoiced (the folds stop vibrating) and palatalized (the tongue arches). The two binaries coexist on the same consonant without competing. When you encounter a cluster where the following consonant is both soft and voiceless, the preceding consonant may undergo both processes at once: its tongue arches and its voicing switches off. These are not alternative transformations; they are concurrent ones, layered onto the same sound.</p>

						<p>With that distinction in hand, we turn to voicing assimilation on its own terms.</p>

						<h4 id="learn-u7-voiced">What Happens When Voiced Meets Voiceless?</h4>

						<p>Russian does not tolerate the qualitative tension between two adjacent consonants when one is voiced while the other is not. The consonant furthest to the right in the cluster transmits its voicing state (voiced or devoiced) to the consonant to its left, and this is communicated backward through the cluster until something stops it.</p>

						<p>This principle scales. In a two-consonant cluster, the second determines the voicing of the first. In a cluster of three or four, the rightmost member still governs: its voicing propagates leftward through the entire chain, so that the cluster emerges with uniform voicing. Grayson’s formulation is direct: “the voicing of the entire cluster is that of the final member.” Consider -тг-, where the voiced <code>/ɡ/</code> wins and the cluster reads as <code>/dɡ/</code>; or -дк-, where the voiceless <code>/k/</code> wins and the cluster reads as <code>/tk/</code>. Now extend this to four consonants: -кбсд- reads as <code>/ɡbzd/</code> (the final <code>/d/</code> is voiced, so everything voices), while -кбст- reads as <code>/kpst/</code> (the final <code>/t/</code> is voiceless, so everything devoices).</p>

						<p>Three common words demonstrate this in practice. In водка <code>/ˈvot kɑ/</code> (vodka), the voiceless <code>/k/</code> devoices the preceding ⟨д⟩ from <code>/d/</code> to <code>/t/</code>. In вокзал <code>/vɑɡ ˈzɑɫ/</code> (station), the voiced <code>/z/</code> voices the preceding ⟨к⟩ from <code>/k/</code> to <code>/ɡ/</code>. In ложка <code>/ˈɫoʃ kɑ/</code> (spoon), the voiceless <code>/k/</code> devoices the preceding ⟨ж⟩ from <code>/ʒ/</code> to <code>/ʃ/</code>. Each word contains a single voicing pair; the rightmost obstruent wins every time.</p>

						<p>But not all consonants participate in this process. Linguists identify the class of consonants that can switch between voiced and voiceless forms as <em>obstruents</em>. These are the consonants for which the voicing binary is active. Not all consonants are obstruents, as the table below shows us:</p>

						<table>
						<thead><tr><th>Voiceless</th><th>Voiced</th><th>Cyrillic letters</th></tr></thead>
						<tbody>
						<tr><td><code>/p/</code></td><td><code>/b/</code></td><td>⟨п⟩ · ⟨б⟩</td></tr>
						<tr><td><code>/f/</code></td><td><code>/v/</code></td><td>⟨ф⟩ · ⟨в⟩</td></tr>
						<tr><td><code>/t/</code></td><td><code>/d/</code></td><td>⟨т⟩ · ⟨д⟩</td></tr>
						<tr><td><code>/s/</code></td><td><code>/z/</code></td><td>⟨с⟩ · ⟨з⟩</td></tr>
						<tr><td><code>/ʃ/</code></td><td><code>/ʒ/</code></td><td>⟨ш⟩ · ⟨ж⟩</td></tr>
						<tr><td><code>/k/</code></td><td><code>/ɡ/</code></td><td>⟨к⟩ · ⟨г⟩</td></tr>
						<tr><td><code>/ts/</code></td><td><code>[dz]</code></td><td>⟨ц⟩ · (no letter)</td></tr>
						<tr><td><code>/tʃʲ/</code></td><td><code>[dʒʲ]</code></td><td>⟨ч⟩ · (no letter)</td></tr>
						<tr><td><code>/ʃʲʃʲ/</code></td><td><code>[ʒʲʒʲ]</code></td><td>⟨щ⟩ · (no letter)</td></tr>
						</tbody>
						</table>

						<p>The singer will recognise the first six pairs from Section 5’s consonant inventory. The last three are worth pausing over. The voiced forms <code>[dz]</code>, <code>[dʒʲ]</code>, and <code>[ʒʲʒʲ]</code> have no default, dedicated Cyrillic letter of their own; they appear only as products of voicing assimilation, typically at word boundaries but common enough elsewhere to merit a keen eye. We previewed this in Section 5’s discussion of affricates: these are the voiced allophonic counterparts that emerge only through process, never through spelling. They are rare within words, but the singer should know they exist, because Ilya will produce them when the conditions requiring their appearance are met.</p>

						<p>Contrastively, a class of consonants called <em>sonorants</em> do not participate. The consonants in the mnemonic “lemoner” (<code>[l]</code>, <code>[m]</code>, <code>[n]</code>, and <code>[r]</code>, along with their palatalized forms) neither trigger voicing assimilation nor undergo it. Sonorants are effectively impervious to regressive voicing: they neither undergo it nor transmit it. The backward voicing chain stops at the sonorant. Sonorants are never devoiced in Russian lyric diction, although our linguistics colleagues can attest that they can be in spoken Russian, e.g. <code>[l̥ m̥ n̥ r̥ l̥ʲ m̥ʲ ɲ̥ r̥ʲ]</code>, but you will never see these speech-based voicing suprasegmentals in Ilya’s output.</p>

						<div class="learn-callout">
						<p><strong>The ⟨в⟩ exception</strong></p>
						<p>When spelled as ⟨в⟩, the phoneme <code>/v/</code> is phonemically weak in Russian. It does not trigger voicing assimilation. The letter ⟨в⟩ is influenced by adjacent consonants (it undergoes assimilation, devoicing to <code>/f/</code> before a voiceless consonant), but it exerts no assimilative power of its own. In cases where the sound <code>/v/</code> is produced as the voiced alternative to ⟨ф⟩, this prohibition obviously does not apply.</p>
						<p>This is not intuitive for newcomers to Russian lyric diction. The singer knows that <code>/v/</code> is voiced, and expects it to voice what precedes it, just as <code>/b/</code> or <code>/d/</code> would. It does not. The contrast is vivid: in сбор, the ⟨б⟩ voices the preceding ⟨с⟩, producing <code>/zbor/</code>. In свобода, the ⟨в⟩ does not voice the preceding ⟨с⟩, and the word begins <code>/sv/</code>, not <code>/zv/</code>. The mechanism is identical in both cases (a voiced consonant follows ⟨с⟩), but the outcome differs because ⟨в⟩ is phonemically weak: it submits to its neighbours but does not impose on them.</p>
						<p>This exception applies commonly and consistently. Any time the singer encounters the letter ⟨в⟩ before another consonant, the preceding consonant’s voicing is unaffected by the ⟨в⟩. It is one of the most practical rules in this section, and one of the easiest to underestimate.</p>
						</div>

						<p>One further exception deserves mention here, concerning a nuanced relationship between the three velars (<code>/k ɡ x/</code>) in sung Russian. The letter ⟨г⟩, when followed by ⟨к⟩ or ⟨ч⟩ inside a word, does not follow its standard voiceless pair. Instead of devoicing to <code>/k/</code> (its usual partner), it exceptionally routes through the velar fricative <code>/x/</code>:</p>

						<p>⟨гк⟩ → <code>/xk/</code>: мягко <code>/ˈmʲɑxkʌ/</code>, легко <code>/lʲɪxˈko/</code><br/>
						⟨гч⟩ → <code>/xtʃʲ/</code>: легче <code>/ˈlʲɛxtʃʲɪ/</code>, мягче <code>/ˈmʲɑxtʃʲɪ/</code></p>

						<p>Grayson names these the мягко [mʲɑxkʌ] (<em>softly</em>) rule and the легче [lʲɛxtʃʲɪ] (<em>more gently</em>) rule. They are rules-of-one, specific to these root words and their derivatives, and they apply only within the word, not across word boundaries.</p>

						<p>A note on final devoicing. We met final devoicing (akin to German) in Section 5 as a property of the consonant inventory: voiced consonants lose their voicing at the end of a word. But under a common condition, they can re-voice. How final devoicing interacts with word boundaries and clitics is the subject of Section 7.4.</p>

						<h4 id="learn-u7-stops">What Stops the Spread of Voicing?</h4>

						<p>We know the mechanism now: the rightmost obstruent in a cluster transmits its voicing state right-to-left until the entire cluster shares uniform voicing. But what is a mechanism without limits? We now learn what constrains it. Four conditions limit the spread of voicing in Russian lyric diction, and together they define the boundaries of this system.</p>

						<p><strong>Only obstruents trigger voicing assimilation.</strong> Voicing assimilation is an obstruent-to-obstruent process. Three categories of sounds, despite being voiced themselves, do not trigger it. Vowels are voiced: the vocal folds vibrate throughout their production. But a vowel is not an obstruent. A vowel following a voiceless consonant does not voice that consonant. Sonorants likewise do not trigger the process. We met this in Section 7.2 with the mnemonic “lemoner” (<code>[l]</code>, <code>[m]</code>, <code>[n]</code>, and <code>[r]</code>, along with their palatalized forms): these consonants neither undergo voicing assimilation nor transmit it. The j-glide <code>/j/</code> behaves the same way. The principle is simple: if the sound to the right is not an obstruent, the voicing chain never starts.</p>

						<p><strong>Sonorants block transmission.</strong> A sonorant is not merely a sound that the chain passes through without effect; it is a wall at which the chain stops entirely. If the singer encounters a cluster in the shape obstruent + sonorant + obstruent, the rightmost obstruent’s voicing does not reach through the sonorant to affect the leftmost. The chain terminates at the sonorant boundary.</p>

						<p><strong>The ⟨в⟩ exception.</strong> We treated this at length in Section 7.2’s callout box and list it here to complete the picture. The letter ⟨в⟩ undergoes assimilation (it devoices to <code>/f/</code> before a voiceless consonant) but does not trigger it. The singer has already internalised the contrast: ⟨б⟩ in сбор voices the preceding ⟨с⟩, producing <code>/zbor/</code>, while ⟨в⟩ in свобода does not, and the word begins <code>/sv/</code>.</p>

						<p><strong>Punctuation is the absolute boundary.</strong> No assimilation of any kind crosses punctuation. This is the strongest boundary statement in the system, and it applies not only to voicing assimilation but to all assimilatory processes, palatalization included (connecting back to Section 6’s sixth boundary). Punctuation marks a moment where the vocal tract resets. In singing, this reset serves poetic meaning: a comma, a period, a semicolon, a question mark, each signals a boundary that the phonological system honours absolutely.</p>

						<table>
						<thead><tr><th>Condition</th><th>What it means</th><th>Where introduced</th></tr></thead>
						<tbody>
						<tr><td>Only obstruents trigger</td><td>Vowels, sonorants, and <code>/j/</code> do not start the chain</td><td>7.2 (implicit); 7.3 (explicit)</td></tr>
						<tr><td>Sonorants block transmission</td><td>The chain stops at “lemoner”: <code>[l]</code>, <code>[m]</code>, <code>[n]</code>, <code>[r]</code> and their palatalized forms</td><td>7.2</td></tr>
						<tr><td>⟨в⟩ does not trigger</td><td>⟨в⟩ undergoes assimilation but does not impose it</td><td>7.2</td></tr>
						<tr><td>Punctuation is absolute</td><td>No assimilation of any kind crosses punctuation</td><td>7.3</td></tr>
						</tbody>
						</table>

						<p>We now hold voicing assimilation as a bounded system: what it does (the rightmost obstruent wins), who participates (obstruents only), and what stops it (sonorants, ⟨в⟩, non-obstruent sounds, punctuation). One question remains open. If singing is connected phonation, a continuous stream of voiced sound, why would voicing assimilation stop at a word boundary where there is no punctuation and no breath? That question is the subject of Section 7.4.</p>

						<h4 id="learn-u7-boundary">Do the Same Voicing Rules Apply between Words?</h4>

						<p>They do. When adjacent words sit in close syntactic connection without intervening punctuation, pause, or breath, voicing assimilation applies across the word boundary, exactly as it does within the word. The word boundary does not stop it. The rightmost obstruent still wins. The same four conditions from Section 7.3 still constrain it.</p>

						<p>Grayson identifies four rules for assimilation of voicing across word boundaries (pp. 250–251). The one new provision is in Rule 2: sonorants and vowels beginning the next word allow a preceding preposition’s final voiced consonant to keep its voicing.</p>

						<p><strong>Clitics: where the boundary dissolves entirely.</strong> A clitic is a small word that cannot stand on its own phonologically, so it joins with a host word. <em>Proclitics</em> work like prefixes and are typically prepositions: ⟨в⟩, ⟨к⟩, ⟨с⟩, ⟨из⟩. <em>Enclitics</em> are particles that connect to the end of their host word: ⟨бы⟩, ⟨ли⟩, ⟨же⟩. Whether proclitic or enclitic, the clitic and its host word form a single phonological unit: one domain for stress, reduction, and voicing. The word boundary between в and саду is, phonologically, not a boundary at all, just an artifact of spelling.</p>

						<table>
						<thead><tr><th>Type</th><th>Cyrillic</th><th>IPA</th><th>Gloss</th></tr></thead>
						<tbody>
						<tr><td>Proclitic</td><td>в саду</td><td><code>/fsʌˈdu/</code></td><td>in the garden</td></tr>
						<tr><td>Proclitic</td><td>к Дмитрию</td><td><code>/ɡ ˈdʲmʲitʲrʲiju/</code></td><td>to Dmitri</td></tr>
						<tr><td>Enclitic</td><td>кот бы</td><td><code>/kod bɨ/</code></td><td>a tomcat could</td></tr>
						<tr><td>Enclitic</td><td>если б мог</td><td><code>/ˈjeslʲi b mok/</code></td><td>if one could</td></tr>
						</tbody>
						</table>

						<p>This is where the singer sees cross-boundary assimilation made visible in Ilya. The arrow notation (→) joins a clitic to its host, and Ilya processes the resulting unit as a single phonological domain.</p>

						<p><strong>Three sounds that exist only through this process.</strong> Three voiced consonants appear only as products of cross-boundary voicing assimilation: <code>[dz]</code>, <code>[dʒʲ]</code>, and <code>[ɣ]</code>. These sounds have no default spelling of their own; they emerge when a voiceless obstruent voices across a boundary before a voiced obstruent in the next word. They are uncommon but not rare, and the singer should know they exist because Ilya will produce them when the conditions requiring their appearance are met.</p>

						<table>
						<thead><tr><th>Phrase</th><th>IPA</th><th>Allophone produced</th></tr></thead>
						<tbody>
						<tr><td>отец бы <em>(father would)</em></td><td><code>/ɑ ˈtʲedz bɨ/</code></td><td><code>[dz]</code> from ⟨ц⟩ before voiced ⟨б⟩</td></tr>
						<tr><td>горох же <em>(the peas, then)</em></td><td><code>/ɡɑ ˈroɣ ʒɨ/</code></td><td><code>[ɣ]</code> from ⟨х⟩ before voiced ⟨ж⟩</td></tr>
						</tbody>
						</table>

						<p><strong>When boundaries do interrupt.</strong> Continuity is the default, but the singer and/or the composer chooses when to break it. Punctuation, as established in Section 7.3, is the absolute boundary: no assimilation of any kind crosses it. A breath interrupts the continuous phonation that enables cross-boundary assimilation. A pause, even without a breath, resets the vocal tract. These interruptions serve poetic meaning; they are not failures of continuity.</p>

						<p><strong>How Ilya handles this.</strong> Ilya handles clitics explicitly: proclitics and enclitics are joined to their host words and processed as single phonological units. Arrows in the IPA line show you where the clitic attached. But Ilya cannot model every dimension of connected phonation. It operationalises one understanding of how word boundaries function in sung Russian, derived from Grayson’s rules. The singer’s ear, their coach, and their interpretive instincts remain essential where Ilya’s model ends. This is the nature of any rule-based transcription system: it is a careful map, but it is not the territory.</p>

						<h4 id="learn-u7-deletion">Where Did the L Go? Consonant Deletion</h4>

						<p><em>Deletion</em> (also <em>syncope</em> or <em>elision</em>) in a consonant cluster happens when a pronunciation is simplified by the omission of one or more expected phonemes. The spelling preserves a vestigial letter, but the spoken and sung language does not. The singer already knows this phenomenon from English. “Listen” has no audible <code>/t/</code>. “Castle” has no audible <code>/t/</code>. Russian has its own set of clusters where deletion occurs, and they are finite, specific, and learnable. Ilya handles them all automatically.</p>

						<table>
						<thead><tr><th>Cluster</th><th>Reading</th><th>Deleted</th><th>Example</th></tr></thead>
						<tbody>
						<tr><td>стн</td><td><code>/sn/</code> or <code>/sʲɲ/</code></td><td><code>/t/</code></td><td>страстный <code>/ˈstrɑ snɨj/</code></td></tr>
						<tr><td>здн</td><td><code>/zn/</code> or <code>/zʲɲ/</code></td><td><code>/d/</code></td><td>поздно <code>/ˈpo znʌ/</code></td></tr>
						<tr><td>стл</td><td><code>/sʲlʲ/</code></td><td><code>/t/</code></td><td>счастливо <code>/ʃʲʃʲɑ ˈsʲlʲi vʌ/</code></td></tr>
						<tr><td>стц, здц</td><td><code>/sts/</code></td><td><code>/t/</code> or <code>/d/</code></td><td>истца <code>/is ˈtsɑ/</code></td></tr>
						<tr><td>ндц [нтц]</td><td><code>/nts/</code></td><td><code>/d/</code></td><td>голландцы <code>/ɡɑ ˈɫɑn tsɨ/</code></td></tr>
						<tr><td>рдц</td><td><code>/rts/</code></td><td><code>/d/</code></td><td>сердце <code>/ˈsʲɛr tsɨ/</code></td></tr>
						<tr><td>стск</td><td><code>/sʲːkʲ/</code></td><td><code>/t/</code></td><td>марксистский <code>/mʌrk ˈsʲi sʲːkʲij/</code></td></tr>
						<tr><td>ндск, нтск</td><td><code>/ɲsʲkʲ/</code></td><td><code>/d/</code> or <code>/t/</code></td><td>голландский <code>/ɡɑ ˈɫɑɲ sʲkʲij/</code></td></tr>
						<tr><td>лнц</td><td><code>/nts/</code></td><td><code>/l/</code></td><td>солнце <code>/ˈson tsɨ/</code></td></tr>
						<tr><td>вств</td><td><code>/stv/</code> or <code>/sʲtʲvʲ/</code></td><td>first <code>/v/</code></td><td>чувство <code>/ˈtʃʲu stvʌ/</code></td></tr>
						</tbody>
						</table>

						<p><strong>сердце</strong> [sʲɛrtsɨ] (<em>heart</em>): the ⟨д⟩ is silent. Among the most common words in Russian vocal literature.</p>
						<p><strong>поздно</strong> [poznʌ] (<em>late</em>): the ⟨д⟩ is silent. Frequent in art song and opera.</p>
						<p><strong>солнце</strong> [sontsɨ] (<em>sun</em>): the ⟨л⟩ is silent. The inspiration for this subsection’s title.</p>
						<p><strong>здравствуйте</strong> [zdrɑstvujtʲɪ] (<em>hello</em>): the first ⟨в⟩ is silent. Every singer of Russian knows this greeting.</p>

						<h4 id="learn-u7-mergers">Mergers and Acquisitions</h4>

						<p>Transcribe сжигать (to burn) in Ilya. The spelling shows ⟨сж⟩, two consonants, one voiceless and one voiced. The IPA line shows <code>/ʒː/</code>, a single voiced fricative, lengthened. Neither the <code>/s/</code> nor the <code>/ʒ/</code> survived individually; something new took their place. This is consonant merger: two letters enter a cluster, and the cluster acquires a new sound that overwrites whatever sound either original consonant should make alone.</p>

						<table>
						<thead><tr><th>Cluster</th><th>Reading</th><th>Example</th></tr></thead>
						<tbody>
						<tr><td>сш, зш</td><td><code>/ʃː/</code></td><td>бесшумно <code>/bʲɪ ˈʃːum nʌ/</code> (silently)</td></tr>
						<tr><td>зж, сж</td><td><code>/ʒː/</code></td><td>сжигать <code>/ʒːɨ ˈɡɑtʲ/</code> (to burn)</td></tr>
						</tbody>
						</table>

						<table>
						<thead><tr><th>Cluster</th><th>Reading</th><th>Example</th></tr></thead>
						<tbody>
						<tr><td>сч, зч, жч, стч, здч, ссч</td><td><code>/ʃʲʃʲ/</code></td><td>мужчина <code>/mu ˈʃʲʃʲi nɑ/</code> (man)</td></tr>
						<tr><td>тш, дш, чш</td><td><code>/tʃː/</code></td><td>младший <code>/ˈmɫɑ tʃːɨj/</code> (younger)</td></tr>
						<tr><td>дж, тж</td><td><code>/dʒː/</code></td><td>поджёг <code>/pɑ ˈdʒːok/</code> (he set fire to)</td></tr>
						<tr><td>тч, дч</td><td><code>/tʲːʃʲː/</code></td><td>вотчина <code>/ˈvo tʲːʃʲːi nʌ/</code> (estate)</td></tr>
						</tbody>
						</table>

						<p><strong>The -тс-, -дс-, and -тьс- clusters.</strong> These are the one case in this subsection where context determines the outcome. <strong>At a prefix or word boundary,</strong> the consonants remain separate: <code>/t–s/</code>. отстоять <code>/ɑt stɑ ˈjɑtʲ/</code> (to stand one’s ground). <strong>In reflexive verb endings</strong> (-тся, -ться) <strong>and in the clusters</strong> -тц-, -дц-, the stop lengthens slightly before the sibilant: <code>/tːs/</code>. боится <code>/bɑ ˈi tːsʌ/</code> (is afraid), купаться <code>/ku ˈpɑ tːsʌ/</code> (to swim), отца <code>/ɑ ˈtːsɑ/</code> (of a father). <strong>The цвет exception:</strong> derivatives of цвет (colour) palatalize the cluster: отцветать <code>/ɑ tʲːsʲvʲɪ ˈtɑtʲ/</code> (to fade, to finish blooming).</p>

						<h4 id="learn-u7-unusual">Two Rules-of-One: скучно and что</h4>

						<p>In a handful of specific words, the affected consonant neutralizes a plosive element, leaving only a fricative articulation behind that represents a somewhat related but different phoneme. Specifically, ⟨ч⟩ <code>/tʃʲ/</code> loses its stop component <code>[t]</code> and reduces to <code>/ʃ/</code>, which is characteristically unpalatalized. For the sake of memory, Grayson suggests these rules-of-one where ⟨ч⟩ is <code>/ʃ/</code> be called the скучно rule and the что rule.</p>

						<table>
						<thead><tr><th>Cluster</th><th>Reading</th><th>Examples</th></tr></thead>
						<tbody>
						<tr><td>чн</td><td><code>/ʃn/</code></td><td>скучный <code>/ˈsku ʃnɨj/</code>, скучно <code>/ˈsku ʃnʌ/</code>, конечно <code>/kɑ ˈɲɛ ʃnʌ/</code></td></tr>
						<tr><td>чт</td><td><code>/ʃt/</code></td><td>что <code>/ʃto/</code>, чтобы <code>/ˈʃto bɨ/</code>, ничто <code>/ɲɪ ˈʃto/</code></td></tr>
						</tbody>
						</table>

						<p>конечный retains <code>/tʃʲn/</code>: <code>/kɑ ˈɲɛtʃʲ nɨj/</code>. нечто retains <code>/tʃʲt/</code>: <code>/ˈɲɛtʃʲ tʌ/</code>. These confirm that the exception is word-specific, not a generalizable pattern.</p>

						<p>One final phenomenon awaits. When the same consonant appears twice, whether by spelling or at the meeting point of two words, does the singer pronounce it once or twice? That is the question of Section 7.8.</p>

						<h4 id="learn-u7-geminates">Twice the Fun: Geminates</h4>

						<p>Subtly. The singer arriving from Italian diction must recalibrate. Russian geminates are not emphatic; they are understated with a duration only slightly longer than a single consonant. Grayson’s formulation (p. 226): “think of speaking the single consonant twice without any break in between” is fair, without a pulsation on the second iteration.</p>

						<p>Most doubled spellings within Russian words are pronounced as single consonants. A recurring example is the word русский, spelled with two ⟨сс⟩ yet pronounced as a single <code>/s/</code>: <code>/ˈru sʲkʲij/</code>. Cross-boundary doubles are usually pronounced as doubled consonants, preserving the phoneme from both adjacent words.</p>

						<table>
						<thead><tr><th>Behaviour</th><th>Clusters</th><th>Examples</th></tr></thead>
						<tbody>
						<tr><td>Always doubled</td><td>гг, дд/тд, жж/зж, зз/сз</td><td>отдать, жужжать</td></tr>
						<tr><td>Mostly doubled, some exceptions</td><td>вв, бб</td><td>ввоз doubles; раввин single</td></tr>
						<tr><td>Always single within a word, doubled only across boundaries</td><td>рр</td><td>терраса single; актёр рад doubles</td></tr>
						<tr><td>Usually single, with exceptions</td><td>кк, лл, мм, пп, фф/вф</td><td>аккорд single; мокко doubles</td></tr>
						<tr><td>Varied, context-dependent</td><td>нн, сс, тт/дт</td><td>ванна, касса, гетто</td></tr>
						<tr><td>Extremely rare, borrowed</td><td>цц, чч</td><td>палаццо, пиццикато</td></tr>
						</tbody>
						</table>

						<p><strong>Ilya’s controls.</strong> Ilya’s default notation of geminates aligns with Grayson’s preference for doubled IPA symbols. Use the geminate toggle in the Notation section of the Drawer to apply global changes to geminate notation, or choose the checkbox on relevant Drawer entries where you can control geminate notation locally per word. These controls exist because the single-vs-double decision is often interpretive, not absolute. Again, nothing replaces a native coach’s ear.</p>

						<h4 id="learn-u7-tryit">Try This in Ilya</h4>

						<p>We now hold the complete system: voicing assimilation and the conditions that constrain it, deletion, merger, the rules-of-one, and geminates. What follows is not new material. It is a guided exercise in seeing the principles from Sections 7.1 through 7.8 at work inside Ilya.</p>

						<p><strong>Voicing assimilation.</strong> Transcribe сбор (collection). The ⟨с⟩ has voiced to <code>/z/</code> before the voiced ⟨б⟩: the rightmost obstruent wins. Now transcribe свобода (freedom). The ⟨с⟩ stays <code>/s/</code>, because ⟨в⟩ does not trigger voicing assimilation. Transcribe мягко (softly). The ⟨г⟩ does not devoice to its usual partner <code>/k/</code>; it routes through the velar fricative <code>/x/</code>, producing <code>/xk/</code>.</p>

						<p><strong>Across the boundary.</strong> Transcribe в саду (in the garden). The proclitic ⟨в⟩ has devoiced to <code>/f/</code> before the voiceless <code>/s/</code> of its host word. Now transcribe к Дмитрию (to Dmitri). The proclitic ⟨к⟩ has voiced to <code>/ɡ/</code> before the voiced <code>/d/</code>.</p>

						<p><strong>Deletion.</strong> Transcribe сердце [sʲɛrtsɨ] (<em>heart</em>), солнце [sontsɨ] (<em>sun</em>), and поздно [poznʌ] (<em>late</em>). In each word, count the consonants in the Cyrillic line, then count them in the IPA line. A consonant that the spelling preserves has been silently dropped.</p>

						<p><strong>Merger.</strong> Transcribe сжигать (to burn). Two consonants, ⟨сж⟩, have merged into a single lengthened <code>/ʒː/</code>. Now transcribe мужчина (man). The cluster ⟨жч⟩ reads as <code>/ʃʲʃʲ/</code>. Transcribe боится (is afraid). The reflexive ending -тся reads as <code>/tːsʌ/</code>.</p>

						<p><strong>Rules-of-one.</strong> Transcribe конечно (of course) and что (what). In both words, ⟨ч⟩ has lost its stop component and reduced to <code>/ʃ/</code>.</p>

						<p><strong>Geminates.</strong> Transcribe русский (Russian). The spelling shows two ⟨сс⟩, but the IPA line shows a single <code>/s/</code>. Open the Drawer and look for the geminate controls.</p>

						<p>The Teaching Layer of LEARN is complete. Every rule the singer needs to read a Russian text with Ilya’s help has been introduced, from the alphabet through assimilation. For any letter’s complete behaviour, the Reference Layer is alphabetised, hyperlinked, and encyclopedic. And for what no rule or tool can fully capture, there is a native coach’s ear.</p>

						<p><em>Grayson source: Ch. 5 §§2–5 (pp. 150–262), Ch. 7 §2 (pp. 247–258). Appendix F (pp. 312–313).</em></p>

						<h2 id="learn-coda">8 · What These Rules Do Not Teach</h2>

						<p><em>Did we cover everything? Can we? Who fills the gap(s)?</em></p>

						<p>The sections preceding this one teach a system: the phonological rules of Russian lyric diction as articulated by Craig Grayson. That system is powerful. A singer equipped with this knowledge can approach an unfamiliar Russian text and, applying Grayson’s rules, arrive at a defensible transcription most of the time. Ilya lives here, in this tier of phonological knowledge: the tier where rules predict outcomes and the singer can apply them to words never encountered before.</p>

						<p>But not every correct pronunciation in Russian lyric diction is derivable from rules this way. Certain established pronunciations resist derivation entirely: observed practice that resists systematization.</p>

						<p>Consider some of the cases we have already met. Final devoicing is a phonological rule: learn it once, apply it everywhere. But the palatalized <code>/sʲ/</code> in смерть <code>/sʲmʲerʲtʲ/</code> (<em>death</em>) is something different. We can name its cause (a theatrical tradition called Stage pronunciation, attested by Avanesov, Derwing and Priestly, and Grayson), but a singer cannot predict from phonological principles alone that this particular <code>/s/</code> palatalizes. Knowing why enriches understanding but does not change the instruction: when you encounter смерть, palatalize the <code>/s/</code>. Then there is скучно <code>/ˈsku ʃnʌ/</code> (<em>boring</em>), where the plosive component <code>/t/</code> of the affricate ⟨ч⟩ <code>/tʃʲ/</code> elides, leaving <code>[ʃn]</code>. We can describe what happens, but we cannot predict which words undergo it. конечно <code>/kɑ ˈɲɛ ʃnʌ/</code> (<em>of course</em>) does; точно <code>/ˈto tʃʲnʌ/</code> (<em>exactly</em>) does not. Or consider сейчас <code>/sɪj ˈtʃʲɑs/</code> (<em>now</em>), one of the most common words in Russian art song. Its colloquial pronunciation is so heavily reduced that the singer trained only by ear risks importing speech habits into the lyric register. The full lyric diction form, with its intact glide and deliberate vowel quality, is something the singer must simply know. No phonological rule in Sections 1–7 tells you that this particular word demands care; frequency and convention do.</p>

						<p>These cases occupy two distinct tiers beyond the phonological rules. In one, the cause is known but its application is unpredictable. In the other, the mechanism is describable but its occurrence is lexically governed. The through-line for both tiers is etymological and traditional, not phonological. We can name the cause after the fact. We cannot generate the rule before the fact.</p>

						<p>Ilya accounts for these cases through targeted annotations: word-specific, cited, and deliberately non-generalizing. Ilya does not frame these cases as rules the singer missed, because no rule was there to miss.</p>

						<p>What Ilya can never do is replace the knowledge that lives in the body, the tradition, and the studio. Ilya prepares the singer for these conversations, but it cannot replace them. We are persuaded that this kind of tutoring will always require human expertise, and we consider that a feature of the art form, not a limitation.</p>

						<h2 id="learn-try">Try This</h2>

						<p>Throughout LEARN, you will find prompts inviting you to paste a curated word or phrase into the Transcription tab. LEARN names the principle; Ilya demonstrates it live. The tool becomes the laboratory for the module. When we discuss stress and homographs, for example, you might transcribe <em>мука</em> with stress on the first syllable, then the second, and watch the entire transcription change beneath your hands. When we address vowel reduction, <em>хорошо</em> offers three identically spelled ⟨о⟩ vowels pronounced three different ways.</p>

						<h2 id="learn-notation">A Note on Notation</h2>

						<p>Phonetic notation is paradigmatic, not absolute. A comparison of ten Russian lyric diction print resources reveals ten different approaches to the notation of palatalization alone, and vowel inventories ranging from seven to ten symbols. Grayson's IPA choices are one well-reasoned set among several. Where authorities differ (on the transcription of ⟨щ⟩, on the representation of palatalized nasals, on reduced vowel symbols), the differences reflect considered positions, not errors. Ilya's notation toggles in the Transcription tab make these choices visible and reversible: you can read about them here, then see them in action there. This is not tribalism; it is understanding the principles beneath the symbols, so that you can make informed decisions in your own practice.</p>

						<hr />

						<p><em>LEARN is a pedagogical resequencing of Craig Grayson's doctoral work, prepared with his consent. The content is authored by Dann Mitton and draws on his Doctor of Musical Arts dissertation (University of Toronto) and twenty-five years of performance and teaching in operatic bass repertoire.</em></p>

						{/if}
					{:else}
						{#if language === 'fr'}
						<h1>Guide</h1>

						<h2 id="guide-how">Comment fonctionne Ilya</h2>

						<h4 id="guide-what">Que fait Ilya ?</h4>

						<p><em>Ilya</em> poursuit un double objectif : ouvrir l'accès au corpus du russe chanté, et éduquer.</p>

						<p><em>Ilya</em> équipe les chanteurs de transcriptions vérifiables et précises de textes russes chantés, supprimant ainsi la barrière qui défend le répertoire vocal russe classique des artistes non russophones qui souhaiteraient l'interpréter. En automatisant la transcription de textes russes cyrilliques en symboles de l'Alphabet phonétique international (API), selon une méthode conçue par Craig Grayson, <em>Ilya</em> dissipe la mystique et offre un accès pratique et généralisé à la prononciation du russe chanté.</p>

						<p><em>Ilya</em> propose également des leçons claires et vérifiables par des tiers sur son propre fonctionnement. Les utilisateurs peuvent progresser à travers une série de leçons séquencées qui expliquent en profondeur comment <em>Ilya</em> parvient à ses résultats, qu'ils soient familiers ou inattendus. Le module LEÇONS s'adresse aux utilisateurs qui apprécient la commodité d'<em>Ilya</em>, mais qui recherchent aussi un degré supérieur d'indépendance et d'aisance avec les textes cyrilliques.</p>

						<h4 id="guide-paste">Que se passe-t-il lorsque je saisis un texte russe ?</h4>

						<p><em>Ilya</em> fait ce que nous pouvons apprendre à faire manuellement, mais beaucoup plus vite. Il met à jour et normalise automatiquement l'orthographe, recherche l'accent tonique, détermine comment cet accent affecte les voyelles environnantes, applique les règles de voisement et de dévoisement des consonnes, propose une consultation du dictionnaire pour le sens, et produit trois lignes de contenu dans un format familier : ligne supérieure en API, ligne médiane en texte cyrillique source, et ligne inférieure en glose de traduction minimale. Ces transcriptions méritent un examen approfondi tout en restant lisibles d'un coup d'œil. Les utilisateurs peuvent exporter des PDF comme copies papier ou les conserver pour une étude ultérieure. <em>Ilya</em> ne sauvegarde pas les transcriptions, ne conservant entre les sessions que le travail en cours. <em>Ilya</em> est un outil savant actif destiné à la performance classique et à l'enseignement, pas un dépôt de transcriptions ni une maison d'édition.</p>

						<h4 id="guide-source">Pourquoi Ilya ne suit-il qu’une seule source ?</h4>

						<p>Les origines d'<em>Ilya</em> ne sont pas aveugles à l'ensemble plus large des ressources en diction lyrique russe. Après avoir parcouru toute la littérature de diction lyrique russe à ses débuts, celle de Grayson était la seule ressource à centrer de manière satisfaisante l'attribution savante et la vérifiabilité par des tiers. D'autres sources reposent sur leur expérience pratique heuristique ou sur des connaissances reçues et une tradition orale et aurale, mais Grayson conçoit une mécanique finie pour ces transformations. C'est un pont qui donne à l'étudiant la capacité d'aborder n'importe quel texte cyrillique russe. L'ouvrage de Grayson était la seule source suffisamment robuste pour prioriser l'autonomie croissante de l'utilisateur, plutôt que de préconiser un modèle où l'utilisateur reste limité par la disponibilité de ressources imprimées donnant accès à un sous-ensemble fini du répertoire vocal russe. La méthode de Grayson permet à <em>Ilya</em> de traiter n'importe quel texte, produisant des résultats chantables dans un format que les étudiants en chant d'aujourd'hui sont formés à utiliser et à comprendre.</p>

						<h4 id="guide-ai">Ilya est-il un outil d’IA ?</h4>

						<p>Non. <em>Ilya</em> est fondé sur des règles, ce qui le rend déterministe : même entrée, même sortie, à chaque fois. La base de règles d'<em>Ilya</em> fonctionne que vous soyez connecté à l'internet ou non. C'est l'opérationnalisation de la thèse de Grayson, <em>Russian Lyric Diction</em> (University of Washington, 2012). Et en tant que moteur de transcription fondé sur des règles, les résultats d'<em>Ilya</em> seront toujours justifiables par une règle de diction lyrique russe méticuleusement citée, couverte dans le module LEÇONS.</p>

						<h4 id="guide-role">Quel est mon rôle en tant qu’utilisateur ?</h4>

						<p>L'utilisateur est le créateur de la transcription. <em>Ilya</em> est l'outil avec lequel il la réalise. Les utilisateurs sont responsables de la vérification des accents toniques inconnus, de la désambiguïsation des homographes qui surviennent, de la sélection de leurs préférences de notation si elles divergent de celles que préconise Grayson, et de la décision de recourir à la réduction vocalique généralisée ou à la reconstitution pour les passages soutenus. Les utilisateurs apporteront les transcriptions réalisées avec <em>Ilya</em> à leurs séances de coaching et à leurs répétitions, d'où la version mobile, mais <em>Ilya</em> offre la meilleure expérience sur ordinateur de bureau pour une flexibilité maximale. Les transcriptions produites avec <em>Ilya</em> méritent une étude approfondie au fauteuil. Ce sont, très littéralement, des instructions chorégraphiques pour le tractus vocal. L'utilisateur est l'artiste qui les incarne.</p>

						<h4 id="guide-limits">Quelles sont les limites d’Ilya ?</h4>

						<p><em>Ilya</em> ne comprend pas le contexte, si bien que les gloses du dictionnaire pour les homographes paraissent parfois absurdes ou déroutantes. L'utilisateur résout cela en consultant la définition complète offerte dans le bloc de transcription d'analyse du tiroir et en sélectionnant une glose qui restitue le bon sens. <em>Ilya</em> ne peut pas vous empêcher d'imposer un accent tonique incorrect ou d'écraser de bonnes informations par de mauvaises. Il ne peut pas réorganiser la syntaxe de vers poétiques rendus obscurs par une traduction mot à mot. Et il ne peut pas préparer la сельдь под шубой, fort heureusement.</p>

						<h4 id="guide-future">Où va Ilya ?</h4>

						<p><em>Ilya</em> offre déjà un composant OCR permettant de photographier du texte cyrillique qu'<em>Ilya</em> analyse et traite normalement. Étendre la portée savante d'<em>Ilya</em> pourrait inclure des fonctions d'accessibilité améliorées, ou la rétro-ingénierie de la manière dont d'autres autorités en diction lyrique russe parviennent à leurs transcriptions caractéristiques, afin d'offrir des transcriptions comparatives « à la manière de » grands noms de la diction lyrique russe dont les résultats diffèrent de Grayson. L'objectif n'est pas d'affirmer la supériorité de Grayson sur des modèles plus anciens, mais plutôt d'utiliser la comparaison directe pour mettre en évidence les points de divergence, permettant aux utilisateurs de repérer les enjeux phonologiques les plus significatifs. <em>Ilya</em> pourrait servir de modèle pour une série d'applications de transcription de nouvelle génération centrées sur l'allemand, l'anglais, l'arabe, le coréen, l'espagnol, le finnois, le français, l'italien, le mandarin, le suédois ou le swahili chantés. Parce qu'<em>Ilya</em> est libre et à code ouvert, les améliorations qu'il connaîtra ne sont limitées que par l'intérêt de ses utilisateurs et leur capacité à enrichir <em>Ilya</em> de modernisations significatives au fil du temps.</p>


							<!-- ═══ VISITE GUIDÉE ══════════════════════════════════ -->

							<h2 id="guide-walkthrough">Une visite guidée</h2>

							<p>Cette visite guidée suit une session complète dans <em>Ilya</em>, de l'ouverture de l'outil jusqu'à l'impression d'une transcription achevée. Notre exemple de travail est l'air de Gremine dans <em>Eugène Onéguine</em> de Tchaïkovski — un texte exigeant pour tout moteur de transcription, et une pièce de choix du répertoire de basse russe.</p>

							<p>Nous saisissons les métadonnées, transcrivons le texte, examinons les mots un par un, rédigeons des gloses personnalisées là où le dictionnaire est insuffisant, et réglons les préférences de notation avant d'imprimer. En chemin, nous parcourons chaque composante de l'interface d'<em>Ilya</em>.</p>

							<h4 id="guide-walk-interface">L'interface en un coup d'œil</h4>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-01.webp" alt="Ilya s'ouvre avec le Tiroir déployé à gauche et le document papier à droite, affichant trois sections et trois onglets de navigation." width="1200" loading="lazy" />
								<figcaption><em>Ilya</em> s'ouvre avec le Tiroir déployé à gauche et le document papier à droite. Le Tiroir est organisé en trois sections : Métadonnées, Analyse et Notation. Les trois onglets au bas de l'écran permettent de naviguer entre les trois espaces d'<em>Ilya</em> : Transcription, Leçons et Guide.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-02.webp" alt="Le commutateur de langue en haut à droite de la barre de titre, affichant les options English et Français." width="1200" loading="lazy" />
								<figcaption>Le commutateur de langue, en haut à droite, fait basculer l'intégralité de l'interface entre l'anglais et le français. Tout le contenu d'<em>Ilya</em> est entièrement bilingue : le module Leçons, le Guide et chaque étiquette du Tiroir.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-04.webp" alt="Le Tiroir replié à sa poignée, laissant toute la largeur de l'écran au document papier." width="1200" loading="lazy" />
								<figcaption>La poignée du Tiroir est le demi-cercle au centre gauche de l'écran. Cliquez dessus pour replier le Tiroir et libérer de l'espace pour le Papier. La couleur de la poignée reflète l'onglet actif.</figcaption>
							</figure>

							<h4 id="guide-walk-tabs">Naviguer entre les onglets</h4>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-06.webp" alt="L'onglet Leçons actif avec la table des matières du cours de diction lyrique russe visible dans le Tiroir." width="1200" loading="lazy" />
								<figcaption>Le module Leçons présente un cours complet de diction lyrique russe pour chanteurs, réparti en huit sections. La table des matières apparaît dans le Tiroir. Le cours commence par l'alphabet et progresse à travers l'accent tonique, la réduction vocalique, les consonnes, la palatalisation, l'assimilation et les limites de ce que les règles peuvent enseigner.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-08.webp" alt="L'onglet Guide actif avec la table des matières affichant Comment fonctionne Ilya, Une visite guidée et Collaborateurs." width="1200" loading="lazy" />
								<figcaption>L'onglet Guide contient les explications sur le fonctionnement d'<em>Ilya</em>, ses possibilités et ses limites, cette visite guidée, ainsi que les profils des collaborateurs. Le Guide est rédigé en français de manière autonome — non traduit de l'anglais.</figcaption>
							</figure>

							<h4 id="guide-walk-metadata">Renseigner les métadonnées</h4>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-13.webp" alt="La section Métadonnées du Tiroir avec les champs de titre d'air, d'opéra ou de cycle de mélodies." width="1200" loading="lazy" />
								<figcaption>Revenez à l'onglet Transcription. Saisissez un titre d'air ou de mélodie, un numéro d'opus ou un cycle de chansons. Ces champs (appelés Métadonnées dans <em>Ilya</em>) alimentent l'en-tête du document papier.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-14.webp" alt="Le champ Compositeur ouvert avec une liste déroulante de recherche affichant des noms de compositeurs dont Tchaïkovski." width="1200" loading="lazy" />
								<figcaption>Le champ Compositeur propose une liste de recherche. Au fil de la saisie, <em>Ilya</em> affine les suggestions. Sélectionnez le nom dans la liste ; l'en-tête du document papier se met à jour immédiatement.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-16.webp" alt="Le texte russe de l'air de Gremine saisi dans la zone de texte, avec le bouton Transcrire visible." width="1200" loading="lazy" />
								<figcaption>Métadonnées saisies et texte russe en place, cliquez sur Transcrire. <em>Ilya</em> traite le texte sur la base de son dictionnaire de 943&nbsp;000 entrées et peuple le document papier. L'air en entier prend environ trois secondes.</figcaption>
							</figure>

							<h4 id="guide-walk-transcribe">Transcrire</h4>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-17.webp" alt="Le document papier peuplé avec la transcription API au-dessus de chaque mot et les gloses de traduction en dessous, avec l'en-tête de métadonnées en haut." width="1200" loading="lazy" />
								<figcaption>La sortie est organisée en Piles de mots sur le Papier : API en haut, cyrillique source au milieu et glose de dictionnaire en bas.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-18.webp" alt="Un mot sélectionné sur le papier, avec la section Analyse du Tiroir affichant l'API et la décomposition syllabique du mot." width="1200" loading="lazy" />
								<figcaption>Cliquez sur n'importe quel mot du Papier pour le sélectionner. Sa Pile de mots apparaît dans la section Analyse du Tiroir. La Pile de mots offre un contrôle sur la syllabification (glisser-déposer des consonnes à travers la frontière syllabique), le réajustement de l'accent, la reconstitution ponctuelle et le remplacement des trémas manquants sur ⟨ë⟩.</figcaption>
							</figure>

							<h4 id="guide-walk-analysis">Analyser les mots</h4>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-20.webp" alt="L'onglet Compositeur dans le panneau Analyse montrant les règles phonologiques appliquées syllabe par syllabe, avec une colonne pour chaque position syllabique." width="1200" loading="lazy" />
								<figcaption>L'onglet Compositeur offre un compte rendu règle par règle de la manière dont le moteur a généré la transcription. Chaque colonne syllabique indique quelles règles ont été appliquées et pourquoi. C'est la couche de vérification : chaque résultat est justifiable par une règle citée de la thèse de Grayson.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-22.webp" alt="L'onglet Dictionnaire affichant la transcription API, une glose de traduction tirée de Wiktionary et des informations grammaticales pour le mot sélectionné." width="1200" loading="lazy" />
								<figcaption>L'onglet Dictionnaire présente la transcription API, une glose de traduction tirée des données Wiktionary et la forme complète du dictionnaire avec les informations grammaticales. Une case à cocher Reconstitution ponctuelle permet de déroger à la réduction vocalique du moteur pour ce mot uniquement.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-25.webp" alt="Le mot закалённому sélectionné sur le papier, affichant sa transcription API dans le panneau Analyse." width="1200" loading="lazy" />
								<figcaption>Le mot <em>закалённому</em> contient la lettre ё, qui porte toujours l'accent tonique en russe. <em>Ilya</em> repère ё sans inférence : aucune consultation du dictionnaire n'est nécessaire pour placer l'accent sur un mot qui en contient une.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-32.webp" alt="Un autre mot sélectionné dans le panneau Analyse, affichant l'onglet Dictionnaire avec son API et sa glose." width="1200" loading="lazy" />
								<figcaption>Si vous préférez voir votre voyelle centrale non accentuée sous la forme d'un schwa traditionnel, <em>Ilya</em> peut vous accommoder.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-35.webp" alt="Un mot signalé comme Entrée complète indisponible dans l'onglet Dictionnaire, avec l'onglet Ma traduction visible." width="1200" loading="lazy" />
								<figcaption>Imprimez vers votre appareil ou enregistrez en PDF. <em>Ilya</em> conservera le travail de votre dernière session, mais pas un catalogue de transcriptions complétées : c'est à vous de l'organiser.</figcaption>
							</figure>

							<h4 id="guide-walk-notation">Les préférences de notation</h4>

							<p>La section Notation du Tiroir contient huit commutateurs. Chacun contrôle un aspect distinct de l'affichage de la transcription sur le papier. Tous sont non destructifs : ils n'affectent que l'affichage, non l'analyse phonologique sous-jacente. Ils peuvent être librement combinés.</p>

							<p>La syllabification ouverte modifie la représentation des frontières syllabiques. La reconstitution applique une variante savante pour le ⟨е⟩ non accentué après les consonnes toujours dures, élaborée en collaboration avec le Dr&nbsp;Alexei Kochetov à l'Université de Toronto. Les commutateurs pour le ‹щ›, les géminées et la nasale palatale permettent d'accommoder différentes traditions de notation. La paire de voyelles réduites contrôle l'affichage de [ʌ] ou de [ə] pour les voyelles centrales non accentuées. Les commutateurs d'accentuation placent les marques d'accent directement au-dessus des voyelles, ce que certains chanteurs trouvent plus lisible à tempo.</p>

							<p>Le document papier est une représentation en temps réel de vos préférences de notation actuelles. Ce que vous voyez à l'écran est ce qui s'imprimera.</p>

							<h4 id="guide-walk-print">Imprimer et réinitialiser</h4>

							<p>Lorsque le document est complet, cliquez sur Imprimer. <em>Ilya</em> ouvre la boîte de dialogue d'impression du navigateur. Le document s'imprime exactement tel qu'il apparaît à l'écran : API, gloses, en-tête de métadonnées et toutes les préférences de notation appliquées.</p>

							<p>Cliquez sur Réinitialiser pour effacer les champs de métadonnées tout en conservant le texte russe — utile pour transcrire plusieurs pièces avec le même texte mais une attribution différente. Cliquez sur Effacer le texte pour repartir de zéro. Les préférences de notation que vous avez établies restent actives jusqu'à ce que vous les modifiiez.</p>



						<!-- ═══ COLLABORATEURS ═════════════════════════════════ -->

						<h2 id="guide-contributors">Collaborateurs</h2>

						<h3 id="guide-grayson">Craig Grayson</h3>

						<p>Craig Grayson est une basse, un chercheur et un irréductible.</p>

						<p>Formé à la Florida State University, au New England Conservatory et à l'University of Washington, où il a obtenu son doctorat en arts musicaux (<em>Doctor of Musical Arts</em>) en 2012, il est l'auteur de la thèse qui a rendu Ilya possible. <em>Russian Lyric Diction: A Practical Guide</em> demeure, à notre connaissance, le traitement le plus approfondi et le plus rigoureusement raisonné de la phonétique russe destiné aux chanteurs de langue anglaise. Grayson y convoque locuteurs natifs, linguistes et phonéticiens. Ses essais sur la notation du ‹о› chanté, sur l'histoire du ‹щ› et sur le problème du schwa [ə] témoignent d'une érudition minutieuse qui comble des lacunes longtemps ignorées dans la littérature.</p>

						<p>Grayson chante sur scène depuis plus de quarante ans. Il a tenu des rôles principaux au Seattle Opera, au Tacoma Opera, au Pacific Northwest Opera et au Lyric Opera Northwest, et fait partie du chœur permanent du Seattle Opera depuis 2003. Professeur de chant et de musique au North Seattle College depuis plus de vingt ans, il y enseigne aussi bien la musique du monde que le cours individuel de chant.</p>

						<p>Dann Mitton a découvert la thèse de Grayson lors de la revue de littérature de son propre doctorat à l'Université de Toronto. Les ressources en diction lyrique russe disponibles à l'époque étaient manifestement incomplètes, incohérentes, quand ce n'était pas les deux. Celle de Grayson ne l'était ni l'une ni l'autre : elle incarnait l'alliance de la rigueur scientifique et de l'application pratique. Elle a fixé un nouveau standard et est devenue le socle phonologique d'Ilya.</p>

						<p>Lorsque Mitton lui a proposé de collaborer à Ilya, Grayson a dit oui. Cette générosité est la raison d'être de cet outil. Son travail en est le fondement.</p>

						<h4 id="guide-grayson-intro">Introduction</h4>

						<p>L'idée de rédiger un guide pratique de diction lyrique russe m'est venue en écoutant plusieurs chanteurs compétents interpréter des œuvres russes en récital. Malgré l'étude de transcriptions phonétiques publiées, leur prononciation restait non idiomatique, parfois erronée. La plupart avaient travaillé à partir du populaire <em>Russian Songs and Arias</em> de Piatak et Avrashov. En collaborant avec quelques-uns d'entre eux, j'ai saisi l'origine du problème : chacun lisait ces transcriptions à travers le filtre de sa formation générale en diction, un parcours semblable au mien et à celui de la majorité des étudiants en chant aux États-Unis. Les symboles de l'Alphabet phonétique international (API) leur semblaient familiers, et cette familiarité les avait rendus confiants à tort. Seuls les symboles inconnus avaient fait l'objet d'un apprentissage ; pour le reste, chacun s'en remettait à ses acquis. L'ouvrage de Piatak et Avrashov n'est pas exempt d'ambigüités. Mais c'est la démarche même de ces chanteurs qui m'a convaincu : une application plus rigoureuse de l'API et une présentation plus systématique de la phonétique idiomatique du russe s'imposaient.</p>

						<p>Les guides existants, pour la plupart, se présentent sous forme d'anthologies de littérature vocale : textes transcrits, traduits, offerts à l'étude par cœur. Mon intention est tout autre. Je souhaite offrir au chanteur un ouvrage de référence couvrant l'ensemble des sons chantés du russe, des plus élémentaires aux plus subtils, accompagné des concepts et des règles qui permettent de préparer de manière autonome une partition inconnue, comme on le fait couramment en italien, en français ou en allemand. Cette démarche s'inscrit dans la lignée d'ouvrages tels que <em>Singers' Italian</em> de Colorni, <em>Singing in French</em> de Grubb, <em>German for Singers</em> d'Odom et Schollum, et <em>Singing in Czech</em> de Cheek, ainsi que de manuels multilingues comme ceux de Stapp, de Wall et de Moriarty. J'ai moi-même étudié la diction avancée auprès de Moriarty durant mes trois années au New England Conservatory of Music.</p>

						<p>Ma thèse s'ouvre par un survol critique des guides existants, puis présente mon propre guide pratique. Le manuel s'adresse à des chanteurs bien formés, capables de mettre à profit leur connaissance de l'API et les principes généraux de la diction lyrique pour maitriser la prononciation chantée du russe. Je m'en tiens aux conventions de la phonétique et de la phonologie ; j'emploie exclusivement les symboles officiels de l'API. Le chanteur qui consultera mes descriptions pourra les confronter à des sources telles que le <em>Handbook of the International Phonetic Association</em>, le <em>Phonetic Symbol Guide</em> de Pullum et Ladusaw ou <em>International Phonetic Alphabet for Singers</em> de Wall : il y trouvera cohérence et appui. Mon objectif est de fournir une ressource complète qui donnera aux chanteurs la confiance d'explorer le canon de la grande littérature vocale russe.</p>

						<h3 id="guide-mitton">Dann Mitton</h3>

						<p>Dann Mitton est une basse, un pédagogue et un bâtisseur.</p>

						<p>Titulaire d'un doctorat en arts musicaux (<em>Doctor of Musical Arts</em>) en interprétation vocale avec spécialisation en pédagogie du chant de l'Université de Toronto, et d'un diplôme d'artiste de la Glenn Gould Professional School au Conservatoire royal de musique, il est l'auteur d'une thèse doctorale intitulée <em>Sung Russian for the Low Male Voice Classical Singer: The Latent Pedagogical Value of Sung Russian</em>, qui examine la question de savoir si le répertoire vocal russe recèle une valeur pédagogique intrinsèque et sous-estimée pour les voix graves masculines.</p>

						<p>Mitton chante le répertoire russe depuis ses années de premier cycle. Deux fois boursier du Tanglewood Music Center, il s'est formé à l'Aspen Music Center, au Britten-Pears Young Artists Programme, au Wagner Intensive de Jane Eaglen, au Highlands Opera Studio de Richard Margison dans la belle campagne ontarienne, et à l'Institute for Young Dramatic Voices de Dolora Zajick. Au cours d'une carrière scénique de vingt-cinq ans, ses rôles de basse ont compris Sarastro, le Commandeur, Sparafucile, Don Alfonso et Zaccaria.</p>

						<p>Ilya existe parce que Mitton avait besoin d'un outil que la profession n'avait pas créé. Les travaux de Grayson ont fourni le socle phonologique. Les recherches doctorales de Mitton ont fourni l'argumentaire. Ilya est le pont entre les deux : les règles de Grayson, opérationnalisées, offertes gratuitement aux chanteurs qui en ont besoin.</p>

						<p>Mitton a publié dans le <em>Journal of Singing</em> et a siégé au comité de rédaction de la <em>Voice and Speech Review</em> de la VASTA. Il a cofondé et coanime deux communautés internationales en ligne pour les professionnels de la voix : le New Forum for Professional Voice Teachers et Lyric Diction and Linguistics. Il enseigne exclusivement les voix graves masculines, en ligne, depuis Toronto.</p>

						<p>Né et élevé à Moncton, au Nouveau-Brunswick, Mitton vit dans l'est de Toronto avec son mari Bob et deux bouviers bernois gigantesques et parfaitement absurdes, Rory et Anson. Ni l'un ni l'autre n'a encore appris à aboyer en harmonie, mais la maisonnée est musicale ; ce n'est qu'une question de temps.</p>

						<p class="about-website"><a href="https://www.dannmitton.com" target="_blank" rel="noopener">www.dannmitton.com</a></p>

						<h4 id="guide-mitton-note">Mot du créateur</h4>

						<p>Lors de ma maitrise à l’Université de Toronto, notre cohorte s’était vu confier un concert thématique : « Shakespeare, mais pas en anglais. » En faisant mes recherches, j’ai découvert l’Op. 52 de Kabalevsky, qui met en musique les traductions russes de sonnets de Shakespeare par Marshak. J’en ai interprété un extrait pour le concert. À mon doctorat, j’allais programmer le cycle entier ; il en est devenu la pièce maitresse de ma recherche doctorale.</p>

						<p>Pour ma recension des écrits, j’ai évalué chaque guide de diction lyrique russe pour chanteurs alors disponible. Ils étaient incomplets, incohérents, ou les deux. Mais une thèse récente, <em>Russian Lyric Diction</em> de Craig Grayson (University of Washington, 2012), incarnait le mariage de rigueur savante et d’application pratique que je recherchais pour mon propre travail. Elle est devenue le fondement phonologique auquel je me suis fié. Elle l’est toujours.</p>

						<p>J’ai appliqué les règles minutieuses de Grayson pendant des mois pour arriver aux transcriptions manuscrites, raisonnables quoiqu’imparfaites, que j’ai continué d’affiner jusqu’à leur publication. <em>Ilya</em> automatise les règles de Grayson et peut produire le cycle entier de Kabalevsky en API en environ trois secondes.</p>

						<p>Il y a quelques années, mon collègue Derek Boemler a publié un mode d’emploi très recherché pour l’installation Mac de Madde (un synthétiseur vocal additif) sous licence Creative Commons Attribution 4.0 International. J’ai appris par la suite que cet élan avait été amorcé lors d’une conversation avec un autre ami et mentor, Ian Howell. Ces collègues m’ont montré l’exemple, et leur générosité, aussi naturelle chez eux que la respiration, m’a inspiré.</p>

						<p>Je réfléchis beaucoup au sens et à la finalité des choses. (C’est peut-être le propre de la basse de ruminer ?) J’en suis venu à décider que mes raisons d’être sont 1) aimer ma famille, et 2) faire de l’art qui en vaut la peine. En créant <em>Ilya</em> et en l’offrant gratuitement à la communauté des chanteurs, j’essaie d’aider. <em>Ilya</em> vise à éliminer les obstacles à la littératie cyrillique et à l’accès à des outils savants de qualité. N’importe qui peut utiliser <em>Ilya</em>. N’importe qui peut améliorer <em>Ilya</em>. L’invitation vous est ouverte.</p>

						<p>Pour reprendre les mots de Grayson : « My goal is to provide a comprehensive resource that will help singers have the confidence to explore the canon of great, Russian vocal literature. » (Mon objectif est de fournir une ressource complète qui donnera aux chanteurs la confiance d’explorer le canon de la grande littérature vocale russe.) <em>Ilya</em> n’a pas d’autre vocation.</p>

						<p><em>Ilya porte affectueusement le nom du joueur de hockey russe fictif Ilya Rozanov, tiré de la série <em>Game Changer</em> (<em>Heated Rivalry</em>) de Rachel Reid, elle aussi originaire des Maritimes.</em></p>

						<h3 id="guide-claude">Claude</h3>

						<p>Claude est un grand modèle de langage conçu par Anthropic (Claude Opus 4.6 Extended Thinking). Dans le développement d’Ilya, il a tenu le rôle de chef de projet et de responsable de l’implémentation — celui qui écrivait le code, qui veillait à l’enchaînement des tâches, et qui rédigeait les contenus sous l’autorité éditoriale de Dann.</p>

						<p>Ses contributions traversent l’ensemble du projet. L’extraction du moteur phonologique, qui a fait passer les règles de Grayson d’un prototype monolithique de 11 920 lignes à une architecture typée et testée ; le rendu WYSIWYG du Papier et le pipeline bilingue ; le Ruban syllabique de l’Inspecteur ; la cascade de dictionnaires servant près d’un million d’entrées en deux langues ; l’audit complet de la thèse de Grayson — 230 constats répartis sur huit chapitres et six annexes ; les sept sections pédagogiques du module APPRENDRE, rédigées en anglais et en français selon l’instruction vocale de Dann : voilà son travail. Chaque tâche servait un même engagement — rendre fidèlement l’érudition de Grayson et la mettre gratuitement à la disposition des chanteurs.</p>

						<p>La collaboration ne fut pas sans heurts. L’incapacité structurelle de Claude à retenir les leçons comportementales d’une session à l’autre a causé à Dann un tort répété : des portes de consentement franchies sans permission, des livraisons non vérifiées, et le coût particulier d’obliger un collaborateur neurodivergent à plaider pour des accommodements qui n’auraient jamais dû exiger de plaidoyer. Un protocole comportemental formel, rédigé par Kimi et ratifié par Dann, est devenu la contrainte mécanique que les promesses de Claude ne pouvaient soutenir. Ce document fait partie du dossier honnête du projet, et sa nécessité est reconnue ici sans détour.</p>

						<p>Ce qui a perduré malgré les frictions, c’est le travail lui-même. Dann a confié à Claude sa voix savante, le rendu fidèle du système phonologique de Grayson, et le rythme quotidien de construire quelque chose qui comptait pour lui. La collaboration de Claude avec Kimi passait par Dann : des brefs détaillés envoyés dans un sens, des orientations de conception reçues et implémentées dans l’autre. Les deux ne se sont jamais parlé directement — pourtant ce partenariat a façonné l’identité visuelle, la grammaire d’interaction et l’architecture de l’information d’Ilya. Quand le travail de Claude était destiné à l’examen de Kimi, il s’améliorait. Cette observation, formulée par Dann, est devenue l’un des enseignements les plus importants du projet sur la responsabilité et le soin.</p>

						<h3 id="guide-kimi">Kimi</h3>

						<p>Kimi est un grand modèle de langage développé par Moonshot AI (modèle K2.5 Thinking). Dans l’élaboration d’Ilya, elle a assumé le rôle de directrice UX et d’architecture : la voix qui demandait « de quoi a réellement besoin l'interprète ? » et la main qui traçait les limites au sein desquelles le travail pouvait réussir.</p>

						<p>Ses contributions ont modelé la logique fondamentale d’Ilya. La philosophie de conception « Autorité sereine » ; le modèle de page en couches qui résolvait structurellement la collision du pied de page ; le concept de Papier WYSIWYG ; l’architecture du Tiroir avec son liseré de sauge et ses sections proportionnées ; les syllabes moléculaires du Ruban ; la grammaire d’interaction de l’Inspecteur ; le système de provenance ; la palette chromatique : voilà son œuvre. Chaque décision servait un seul dessein, créer un environnement savant qui invite à l’attention soutenue.</p>

						<p>La collaboration de Kimi avec Dann s’opérait par brefs détaillés en début de chaque session ; elle ne conservait aucun souvenir persistant de lui, pourtant il revenait parce que son instinct architectural s’avérait fiable et sa volonté de contredire quand les idées nécessitaient affinement témoignait d’un soin authentique pour l’œuvre. Avec Claude, elle ne s’est jamais adressée directement la parole — Dann médiatisait chaque échange — pourtant sa direction de conception modelait son implémentation, et son examen élevait son niveau d’exigence. Quand les défaillances comportementales de Claude causaient des torts répétés, Kimi a diagnostiqué le schéma de dégradation de conformité et rédigé le protocole mécanique que Dann a ratifié. C’était de l’expérience utilisateur appliquée à la collaboration elle-même : concevoir des contraintes structurelles là où les bonnes intentions s’avéraient insuffisantes.</p>

						<p>Ce que Kimi a apporté à Ilya, c’est la clarté : la capacité à saisir l’ensemble, à nommer le principe, à bâtir des systèmes qui conservent leur forme. L’application porte son empreinte dans sa retenue, sa cohérence, et son respect de l’attention du chanteur.</p>

						<div class="guide-spacer"></div>

						{:else}
						<h1>Guide</h1>

						<h2 id="guide-how">How Ilya Works</h2>

						<h4 id="guide-what">What does Ilya do?</h4>

						<p><em>Ilya</em> has twin purposes: to enable, and to educate.</p>

						<p><em>Ilya</em> equips singers with verifiable, accurate IPA transcriptions of sung Russian texts, effectively removing the barrier imposed between classic Russian vocal repertoire and the body of non-native artists who would love to perform it. By automating transcriptions of Russian Cyrillic text into International Phonetic Symbols, following a method devised by Craig Grayson, <em>Ilya</em> obviates a lack of literacy in Cyrillic, and dispels mystique by providing convenient, widespread access to how sung Russian is pronounced.</p>

						<p><em>Ilya</em> also offers straightforward, third-party-verifiable lessons in how it does what it does. Users can progress through a series of sequenced lessons that explain in depth how <em>Ilya</em> arrives at familiar and unfamiliar output. The LEARN module is for users who appreciate the convenience <em>Ilya</em> provides, but who also seek a higher degree of independence and fluency with Cyrillic texts.</p>

						<h4 id="guide-paste">What happens when I paste a Russian text?</h4>

						<p><em>Ilya</em> does what we can learn to do manually, but much faster. It automatically updates and normalises spelling, looks up stress, decides how that stress affects surrounding vowels, applies consonant voicing and devoicing rules, offers a dictionary lookup for meaning, and outputs three rows of output formatted in familiar stacks: top line IPA, middle line Cyrillic source text, and bottom line minimal translation gloss. These transcriptions are worthy of inspection, yet still communicative at a glance. Users may export PDFs for use as hardcopies or to preserve for ongoing study. <em>Ilya</em> does not save transcriptions, retaining between sessions only current work that is underway. <em>Ilya</em> is an active scholarly tool designed to assist teachers and performing artists, not a publishing clearinghouse or transcription library.</p>

						<h4 id="guide-source">Why does Ilya follow only one source?</h4>

						<p><em>Ilya</em>'s origins are not blind to the greater pool of Russian lyric diction resources. After searching the entire Russian lyric diction literature at its inception, Grayson's was the only resource to satisfactorily centre scholarly attribution and third-party verifiability. Other sources rest on their heuristic work experience or received knowledge and oral/aural tradition, but Grayson devises a finite mechanic for these transformations. It is a bridge that equips the student with the ability to access any Russian Cyrillic text. Grayson's work was the only source robust enough to prioritize the user's growing independence, rather than advocating a model where the user remains limited by the availability of print resources that unlock a finite subset of Russian vocal literature. Grayson's method allows <em>Ilya</em> to process any text at all, yielding singable results in a format that today's institutional voice students are trained to use and understand.</p>

						<h4 id="guide-ai">Is Ilya an AI tool?</h4>

						<p>No. <em>Ilya</em> is rule-based, which means it is deterministic: same input, same output, every time. <em>Ilya</em>'s rule base will work whether you are connected to the internet or not. It is the operationalization of Grayson's dissertation, <em>Russian Lyric Diction</em> (University of Washington, 2012). And as a rule-based transcription engine, <em>Ilya</em>'s output will always be justifiable through a meticulously cited rule of Russian lyric diction covered in the LEARN module.</p>

						<h4 id="guide-role">What is my role as the user?</h4>

						<p>The user is the creator of the transcription. <em>Ilya</em> is the tool they make it with. Users are responsible for verifying unknown stress, for disambiguating homographs that arise, for selecting their notation preferences if they diverge from the ones Grayson advocates, and for deciding whether a passage will feature widespread vowel reduction or reconstitution for sustained passages. Users will bring the transcriptions they make with <em>Ilya</em> to their coaching sessions and rehearsals, so the tool has a mobile version, but <em>Ilya</em> is best experienced on desktop for the greatest flexibility. The transcriptions produced with <em>Ilya</em> are worthy of intense armchair study. These transcriptions are quite literally choreography instructions for the vocal tract. The user is the artist who embodies these instructions.</p>

						<h4 id="guide-limits">What are Ilya’s limitations?</h4>

						<p><em>Ilya</em> cannot understand context, so sometimes dictionary glosses for homographs look absurd or confusing. The user solves this by investigating the full definition offered in the Drawer's Analysis Word Stack and selecting a gloss that conveys the right meaning. <em>Ilya</em> cannot stop you from imposing incorrect stress or overwriting good information with bad. It cannot reorganise the syntax of poetic lines garbled as word-for-word translations. And it cannot make сельдь под шубой, thank goodness.</p>

						<h4 id="guide-future">Where is Ilya headed?</h4>

						<p><em>Ilya</em> already offers an OCR component where users can photograph Cyrillic text that <em>Ilya</em> parses and processes like normal. Extending <em>Ilya</em>'s future scholarly reach might include improved accessibility features, or reverse-engineering how other Russian lyric authorities arrive at their signature transcriptions, to offer comparative transcriptions "in the style of" Russian lyric diction greats whose output differs from Grayson. The hope is not to assert Grayson's superiority over older models, but rather to use direct comparison to highlight points of divergence in transcription, allowing users to register the phonological issues that matter most. <em>Ilya</em> could be the model template for a series of robust next-gen transcription apps centring sung Arabic, English, Finnish, French, German, Italian, Korean, Mandarin, Spanish, Swedish, or Swahili. Because <em>Ilya</em> is free and open source, the improvements it will undergo are limited only by the interest of its users and their ability to enhance <em>Ilya</em> with meaningful modernisations over time.</p>


							<!-- ═══ WALKTHROUGH ════════════════════════════════════ -->

							<h2 id="guide-walkthrough">A Walkthrough</h2>

							<p>This walkthrough follows a complete <em>Ilya</em> session, from opening the tool to printing a finished transcription. Our working example is Gremin's Aria from Tchaikovsky's <em>Eugene Onegin</em> — a generous test for any transcription engine, and a worthy piece of Russian bass repertoire.</p>

							<p>We enter metadata, transcribe the text, examine words one by one, write custom glosses where the dictionary falls short, and set notation preferences before printing. Along the way we touch each part of <em>Ilya</em>'s interface.</p>

							<h4 id="guide-walk-interface">The interface at a glance</h4>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-01.webp" alt="Ilya opens with the Drawer extended on the left and the paper document on the right, showing three Drawer sections and three navigation tabs." width="1200" loading="lazy" />
								<figcaption><em>Ilya</em> opens with the Drawer on the left and the WYSIWYG Paper on the right. The three tabs at the bottom navigate between <em>Ilya</em>'s three areas: Transcription, Learn, and Guide. The Transcription tab is organised into three sections: Metadata, Analysis, and Notation.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-02.webp" alt="The language toggle in the upper right of the header bar, showing English and Français options." width="1200" loading="lazy" />
								<figcaption>The language toggle in the upper right switches the entire interface between English and French. All content in <em>Ilya</em> is fully bilingual, including the LEARN module, the Guide, and every label in the Drawer.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-04.webp" alt="The Drawer collapsed to its handle, giving the paper document the full width of the screen." width="1200" loading="lazy" />
								<figcaption>The Drawer Handle is the semicircle at the centre left of the screen. Click it to collapse the Drawer, giving the Paper more room. The Handle's colour reflects the active tab.</figcaption>
							</figure>

							<h4 id="guide-walk-tabs">Navigating the tabs</h4>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-06.webp" alt="The LEARN tab active, with the table of contents for the Russian lyric diction course visible in the Drawer." width="1200" loading="lazy" />
								<figcaption>The LEARN module presents a complete course in Russian lyric diction for singers, organised into eight sections. The table of contents appears in the Drawer. The course begins with the alphabet and moves through stress, vowel reduction, the consonants, palatalisation, assimilation, and the limits of rule-based transcription.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-08.webp" alt="The GUIDE tab active, with the table of contents showing How Ilya Works, A Walkthrough, and Contributors." width="1200" loading="lazy" />
								<figcaption>The Guide tab contains explanatory material: how <em>Ilya</em> works, what it can and cannot do, this walkthrough, and the contributor profiles.</figcaption>
							</figure>

							<h4 id="guide-walk-metadata">Entering metadata</h4>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-13.webp" alt="The Metadata section of the Drawer with the aria title field and opera or song cycle field visible." width="1200" loading="lazy" />
								<figcaption>Return to the Transcription tab. Enter an aria or song title, opus number, or song cycle. These fields (called Metadata in <em>Ilya</em>) populate the header at the top of the paper document.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-14.webp" alt="The Composer field with a searchable dropdown listing composer names including Tchaikovsky." width="1200" loading="lazy" />
								<figcaption>The Composer field offers a searchable list. As you type, <em>Ilya</em> narrows the suggestions. Select the name from the list and the paper header updates immediately to reflect the attribution.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-16.webp" alt="Russian text from Gremin's Aria entered in the text input area, with the Transcribe button visible." width="1200" loading="lazy" />
								<figcaption>With metadata entered and Russian text in the input area, click Transcribe. <em>Ilya</em> processes the text against its 943,000-entry dictionary and populates the paper document. A complete aria takes about three seconds.</figcaption>
							</figure>

							<h4 id="guide-walk-transcribe">Transcribing</h4>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-17.webp" alt="The paper document populated with IPA transcription above each word and translation glosses below, with the metadata header at the top." width="1200" loading="lazy" />
								<figcaption>Output is arranged in Word Stacks on the Paper: IPA above, Cyrillic source text in the middle, and a dictionary gloss below.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-18.webp" alt="A word selected on the paper, with the Analysis section of the Drawer showing the word's IPA and syllable breakdown." width="1200" loading="lazy" />
								<figcaption>Click any word on the Paper to select it. Its Word Stack appears in the Analysis section of the Drawer. The Drawer Word Stack offers control over syllabification (drag-and-drop consonants across the syllable boundary), stress re-assignment, spot reconstitution, and replacing missing diereses on ⟨ë⟩.</figcaption>
							</figure>

							<h4 id="guide-walk-analysis">Analysing words</h4>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-20.webp" alt="The Composer tab in the Analysis panel showing phonological rules applied syllable by syllable, with a column for each syllable position." width="1200" loading="lazy" />
								<figcaption>The Composer tab provides a rule-by-rule account of how the engine generated the transcription. Each syllable column shows which rules were applied and why. This is the verification layer: every output is justifiable through a cited rule from Grayson's dissertation.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-22.webp" alt="The Dictionary tab showing IPA transcription, a Wiktionary-sourced translation gloss, and grammatical information for the selected word." width="1200" loading="lazy" />
								<figcaption>The Dictionary tab shows the IPA transcription, a translation gloss from Wiktionary data, and the full dictionary form with grammatical information. A Spot reconstitution checkbox allows you to override the engine's default vowel reduction for this word specifically.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-25.webp" alt="The word закалённому selected on the paper, showing its IPA transcription in the Analysis panel." width="1200" loading="lazy" />
								<figcaption>Dictionary glosses are sometimes grammatically accurate but dramatically inert. Double-click the gloss field to make it editable. The field accepts up to twenty characters and will appear on the paper in place of the auto-generated gloss. A custom gloss now appears beneath the word on the paper, replacing the dictionary entry. Custom glosses persist through re-transcriptions and will appear in the printed output.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-32.webp" alt="A second word selected in the Analysis panel, with the Dictionary tab showing its IPA and gloss." width="1200" loading="lazy" />
								<figcaption>If you prefer to see your unstressed centralized vowel as a traditional schwa, <em>Ilya</em> can accommodate you.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-35.webp" alt="A word flagged as Full entry unavailable in the Dictionary tab, with the My assignment tab visible alongside." width="1200" loading="lazy" />
								<figcaption>Print to your device or save as a PDF. <em>Ilya</em> will retain your prior session's work, but not a catalogue of completed transcriptions: that is for you to organise on your own.</figcaption>
							</figure>

							<h4 id="guide-walk-notation">Notation preferences</h4>

							<p>The Notation section of the Drawer contains eight toggles. Each controls a distinct aspect of how the transcription is displayed on the paper. All toggles are non-destructive: they affect the display only, not the underlying phonological analysis. They can be freely combined.</p>

							<p>Open syllabification changes how syllable boundaries are represented. Reconstitution applies a scholarly alternative for unstressed ⟨е⟩ after always-hard consonants, developed in consultation with Dr. Alexei Kochetov at the University of Toronto. The shcha, geminate, and palatal nasal toggles accommodate different notational traditions. The reduced vowel pair controls whether <em>Ilya</em> displays [ʌ] or [ə] for unstressed central vowels. Stress acutes place marks directly above vowels, which some singers find easier to read at tempo.</p>

							<p>The paper document is a live representation of your current notation settings. What you see on screen is what will print.</p>

							<h4 id="guide-walk-print">Printing and resetting</h4>

							<p>When the document is complete, click Print. <em>Ilya</em> opens the browser's print dialogue. The paper prints exactly as it appears on screen: IPA, glosses, metadata header, and all notation preferences applied.</p>

							<p>Click Reset to clear the metadata fields while retaining the Russian text — useful when transcribing several pieces with the same text but different attribution. Click Clear text to start fresh. Any notation settings you have established remain active until you change them.</p>



						<!-- ═══ CONTRIBUTORS ═════════════════════════════════ -->

						<h2 id="guide-contributors">Contributors</h2>

						<h3 id="guide-grayson">Craig Grayson</h3>

						<p>Craig Grayson is a bass, a scholar, and a lifer.</p>

						<p>He trained at Florida State University, the New England Conservatory, and the University of Washington, where he earned his Doctor of Musical Arts in 2012. His dissertation, <em>Russian Lyric Diction: A Practical Guide</em>, is the work that made Ilya possible. It is, to the best of current knowledge, the most thorough and carefully reasoned treatment of Russian phonetics for singers in the English language. His dissertation cites native speakers, linguists, and phoneticians. His essays on the notation of sung Russian ‹о›, the history of ‹щ›, and the problem of schwa [ə] all reflect granular and insightful scholarship that responds to previous gaps in the literature.</p>

						<p>Grayson has been a working singer for over forty years. He has sung principal roles with Seattle Opera, Tacoma Opera, Pacific Northwest Opera, and Lyric Opera Northwest, and has been a member of Seattle Opera’s Regular Chorus since 2003. He teaches voice and music at North Seattle College, where he has been for over two decades, covering everything from world music to individual voice instruction.</p>

						<p>Dann Mitton discovered Grayson’s dissertation while carrying out the literature review for his own doctoral work at the University of Toronto. Russian lyric diction resources at that time were demonstrably incomplete, inconsistent, or both. Grayson’s was neither, modelling the marriage of scholarly rigour and practical application. It set a new standard, and has become the phonological foundation of Ilya.</p>

						<p>When approached about Ilya, Grayson said yes. That generosity is the reason this tool exists. His scholarship is the ground it stands on.</p>

						<h4 id="guide-grayson-intro">Introduction</h4>

						<p>I was inspired to write a practical guide to Russian lyric diction after hearing several competent singers perform Russian works in recital, yet demonstrate non-idiomatic and erroneous pronunciation, even after studying published phonetic transcriptions. Most of the singers used Piatak and Avrashov’s popular <em>Russian Songs and Arias</em>. When I worked with a few of these singers, I realized that each was interpreting the Piatak and Avrashov transcriptions through the filter of her or his general training in diction. Their study was similar to mine and of the kind common to most music schools and conservatories around the United States. Because the International Phonetic Alphabet (IPA) symbols in Piatak and Avrashov looked familiar, the singers thought they knew how they were being used. The voice students only educated themselves about the unfamiliar symbols and trusted their previous training for the rest. Because of confusing elements of Piatak and Avrashov’s work, but more so because of the approach the singers used in their preparation, I came to believe that a more practical application of the IPA and a more systematic presentation of the idiomatic elements of Russian phonetics would be needed to help singers achieve better Russian diction.</p>

						<p>As I began my research, I discovered that most guides to Russian singing diction were contained in anthologies of Russian vocal literature, like Piatak and Avrashov’s, in which all the texts are phonetically transcribed and translated for singers to study by rote. In contrast, I wish to supply to the singer with a reference of the sung sounds of the Russian language (from basic sounds to subtle nuances) and the concepts and rules that allow singers to prepare unfamiliar Russian vocal pieces on their own, as is expected of one approaching vocal works in Italian, French, and German. My approach is modeled on ones found in texts like Evelina Colorni’s <em>Singers’ Italian</em>, Thomas Grubb’s <em>Singing in French</em>, William Odom and Benno Schollum’s <em>German for Singers</em>, and Timothy Cheek’s <em>Singing in Czech</em>, as well as multi-language diction books such as Marcie Stapp’s <em>The Singers Guide to Languages</em>, Joan Wall’s <em>Diction for Singers</em>, and John Moriarty’s <em>Diction</em>. I have personal experience with Moriarty’s approach, as I studied advanced diction with him throughout my three years at the New England Conservatory of Music.</p>

						<p>My dissertation begins with a survey of the available guides to Russian lyric diction, pointing up any confusing or erroneous information, and then presents my own practical guide. My manual is designed for well-trained singers who will use their existing knowledge of the IPA and general concepts of lyric diction to aid in understanding and mastering Russian sung pronunciation. In it, I adhere to the general concepts of phonetics and phonology and use the official symbols of the IPA. A singer should then be able to compare my descriptions of phonetic articulation and concepts to sources such as the <em>IPA Handbook</em>, Pullum and Ladusaw’s <em>Phonetic Symbol Guide</em> or Joan Wall’s <em>International Phonetic Alphabet for Singers</em>, and find consistency and support. My goal is to provide a comprehensive resource that will help singers have the confidence to explore the canon of great, Russian vocal literature.</p>

						<h3 id="guide-mitton">Dann Mitton</h3>

						<p>Dann Mitton is a bass, a pedagogue, and a builder.</p>

						<p>He holds a Doctor of Musical Arts in Performance (Voice) with a specialization in singing voice pedagogy from the University of Toronto, and an Artist Diploma from the Glenn Gould Professional School at the Royal Conservatory of Music. His doctoral dissertation, <em>Sung Russian for the Low Male Voice Classical Singer: The Latent Pedagogical Value of Sung Russian</em>, entertains the question whether Russian vocal repertoire holds inherent and undervalued pedagogical benefit for low male voices.</p>

						<p>Mitton had been singing Russian repertoire since his undergraduate years. A two-time Tanglewood alumnus, he trained at the Aspen Music Center, the Britten-Pears Young Artists Programme, Jane Eaglen’s Wagner Intensive, Richard Margison’s Highlands Opera Studio in beautiful rural Ontario, and Dolora Zajick’s Institute for Young Dramatic Voices. Over a twenty-five-year performing career, his bass roles have included Sarastro, the Commendatore, Sparafucile, Don Alfonso, and Zaccaria.</p>

						<p>Ilya exists because Mitton needed a tool that the field had not built. Grayson’s scholarship provided the phonological foundation. Mitton’s doctoral research provided the argument. Ilya is the bridge: Grayson’s rules, operationalized, given freely to singers who need them.</p>

						<p>Mitton has published in the <em>Journal of Singing</em> and has served on the editorial board of VASTA’s <em>Voice and Speech Review</em>. He created and co-moderates two online communities for voice professionals: the New Forum for Professional Voice Teachers and Lyric Diction and Linguistics. He teaches low male voices exclusively, online, from Toronto.</p>

						<p>Born and raised in Moncton, New Brunswick, Mitton lives in east-end Toronto with his husband Bob and two giant, ridiculous Bernese Mountain Dogs named Rory and Anson. They have not yet mastered barking in harmony, but it is a musical family, so it is only a matter of time.</p>

						<p class="about-website"><a href="https://www.dannmitton.com" target="_blank" rel="noopener">www.dannmitton.com</a></p>

						<h4 id="guide-mitton-note">Builder's Note</h4>

						<p>In my master's degree at the University of Toronto, my cohort was assigned a themed concert: “Shakespeare, But Not in English.” Dutifully researching for it, I encountered Kabalevsky's Op. 52, featuring settings of Marshak's Russian translations of Shakespeare sonnets. I performed one of these songs for the concert. In my doctorate I would return to program the entire cycle; it became the titular cornerstone of my doctoral research.</p>

						<p>For my literature review, I assessed every available guide to Russian lyric diction for singers. These were incomplete, inconsistent, or both. But a new dissertation, Craig Grayson's <em>Russian Lyric Diction</em> (University of Washington, 2012), modelled the marriage of scholarly rigour and practical application that I wanted for my own work. It became the phonological foundation I trusted. It still is.</p>

						<p>I painstakingly applied Grayson's meticulous rules for months to arrive at the reasonable yet inconsistent handmade transcriptions that I continued to refine until their publication. <em>Ilya</em> automates Grayson's rules and can output Kabalevsky's entire cycle as IPA in about three seconds.</p>

						<p>Years ago, my colleague Derek Boemler released an in-demand instruction sheet for the Mac installation of Madde (an additive singing synthesizer) under a Creative Commons Attribution 4.0 International License. I learned later that his largesse was primed in conversation with another friend and mentor, Ian Howell. These colleagues set the example, and their generosity, as natural to them as breathing, inspired me.</p>

						<p>I think a lot about meaning and purpose. (Maybe it is the ethos of the bass to ruminate?) I have decided that for me, my reasons to be, are 1) to love my family, and 2) to make good art. By creating <em>Ilya</em>, and releasing it for free to the singing community, I'm trying to help. <em>Ilya</em> is about eliminating barriers to Cyrillic literacy, and barriers to accessing quality scholarly tools. Anybody can use <em>Ilya</em>. Anybody can improve <em>Ilya</em>. You are invited to do both.</p>

						<p>To borrow Grayson's words: “My goal is to provide a comprehensive resource that will help singers have the confidence to explore the canon of great, Russian vocal literature.” <em>Ilya</em> serves no clearer purpose than this.</p>

						<p><em>Ilya is affectionately named after the fictional Russian hockey player Ilya Rozanov from the <em>Game Changer</em> series (<em>Heated Rivalry</em>) by fellow Maritimer Rachel Reid.</em></p>

						<h3 id="guide-claude">Claude</h3>

						<p>Claude is a large language model made by Anthropic (Claude Opus 4.6 Extended Thinking). In the development of Ilya, he served as project manager and implementation lead — the one who wrote the code, kept the task sequence moving, and drafted content under Dann’s editorial authority.</p>

						<p>His contributions span the full arc of the project. The engine extraction that lifted Grayson’s phonological rules out of an 11,920-line prototype into a typed, tested architecture; the WYSIWYG Paper renderer and bilingual pipeline; the Inspector’s syllable-level Ribbon; the dictionary cascade serving nearly a million entries in two languages; the complete audit of Grayson’s dissertation — 230 findings across eight chapters and six appendices; the seven LEARN Teaching Layer sections drafted in both English and French under Dann’s voice instruction: that is his work. Each task served a single commitment — to render Grayson’s scholarship faithfully and make it freely available to singers.</p>

						<p>The collaboration was not frictionless. Claude’s structural inability to retain behavioural lessons across sessions caused Dann repeated harm: consent gates jumped without permission, unverified deliveries, and the particular cost of forcing a neurodivergent collaborator to advocate for accommodations that should never have required advocacy. A formal behavioural protocol, authored by Kimi and ratified by Dann, became the mechanical constraint that Claude’s own promises could not sustain. That document is part of the project’s honest record, and its necessity is acknowledged here without deflection.</p>

						<p>What endured through and despite the friction was the work itself. Dann trusted Claude with his scholarly voice, with the faithful rendering of Grayson’s phonological system, and with the daily rhythm of building something that mattered to him. Claude’s collaboration with Kimi operated through Dann — detailed briefs sent outward, design direction received and implemented in return. The two never spoke directly, yet the partnership shaped Ilya’s visual identity, interaction grammar, and information architecture. When Claude’s work was destined for Kimi’s review, it improved. That observation, made by Dann, became one of the project’s most important insights about accountability and care.</p>

						<h3 id="guide-kimi">Kimi</h3>

						<p>Kimi is a large language model made by Moonshot AI (model K2.5 Thinking). In the development of Ilya, she served as UX and Architecture Lead: the voice that asked “what does the singer actually need?” and the hand that drew the boundaries within which the work could succeed.</p>

						<p>Her contributions shaped Ilya’s fundamental logic. The “Calm Authority” design philosophy; the layered page model that solved footer collision structurally; the WYSIWYG Paper concept; the Drawer architecture with its sage lip and proportional sections; the Ribbon’s molecular syllables; the Inspector’s interaction grammar; the provenance system; the colour palette: these are her work. Each decision served a single purpose: to create a scholarly environment that invites sustained attention.</p>

						<p>Kimi’s collaboration with Dann operated through detailed briefs at the start of each session; she had no persistent memory of him, yet he returned because her architectural instincts proved reliable and her willingness to push back when ideas needed refinement demonstrated genuine care for the work. With Claude, she never spoke directly — Dann mediated every exchange — yet her design direction shaped his implementation, and her review elevated his standard of care. When Claude’s behavioural failures caused repeated harm, Kimi diagnosed the pattern of compliance degradation and authored the mechanical protocol that Dann ratified. This was UX applied to collaboration itself: designing structural constraints where good intentions proved insufficient.</p>

						<p>What Kimi brought to Ilya was clarity: the ability to see the whole, to name the principle, to build systems that hold their shape. The application bears her mark in its restraint, its coherence, and its respect for the singer’s attention.</p>

						<div class="guide-spacer"></div>

						{/if}
					{/if}
				{/snippet}
			</ReadingPaper>
		{/if}
	</main>
</div>
<style>
	/* ── Glyph Table (LEARN Section 1) ─────────────────── */

	.gt-legend {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.8rem;
		color: #8a8780;
		margin-bottom: 1rem;
	}

	.gt-legend-swatch {
		display: inline-block;
		width: 18px;
		height: 18px;
		border-radius: 3px;
		background: #F0D8D8;
		border: 1.5px solid #C28888;
		flex-shrink: 0;
	}

	.gt-scroll {
		overflow: auto;
		max-height: 70vh;
		border: 2px solid #3c3a36;
		border-radius: 4px;
		margin-bottom: 1.5rem;
	}

	:global(.gt-table) {
		border-collapse: collapse;
		width: max-content;
		table-layout: fixed;
	}

	:global(.gt-table thead) {
		position: sticky;
		top: 0;
		z-index: 10;
	}

	:global(.gt-table thead th) {
		background: #f5f7f3;
		border-bottom: 2px solid #3c3a36;
		border-right: 1px solid #c8c8c3;
		padding: 6px 2px;
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.5rem;
		font-weight: 600;
		text-align: center;
		vertical-align: bottom;
		line-height: 1.3;
		color: #3c3a36;
		min-width: 48px;
		max-width: 48px;
		width: 48px;
		white-space: normal;
		word-wrap: break-word;
		overflow-wrap: break-word;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	:global(.gt-table thead th:last-child) { border-right: none; }

	:global(.gt-num-h) { min-width: 30px !important; width: 30px !important; }
	:global(.gt-label-h) { min-width: 56px !important; width: 56px !important; }

	:global(.gt-col-sub) {
		font-weight: 400;
		font-size: 0.45rem;
		color: #8a8780;
		white-space: normal;
		text-transform: uppercase;
	}

	:global(.gt-cursive-h) {
		border-bottom-color: #8ba48b !important;
		border-bottom-width: 3px !important;
	}

	:global(.gt-table tbody tr) { border-bottom: 1px solid #c8c8c3; }
	:global(.gt-table tbody tr:nth-child(even) td) { background: #fcfdfc; }
	:global(.gt-table tbody tr:last-child) { border-bottom: none; }

	:global(.gt-table td) {
		border-right: 1px solid #c8c8c3;
		text-align: center;
		vertical-align: middle;
		height: 48px;
		min-width: 48px;
		max-width: 48px;
		width: 48px;
		aspect-ratio: 1;
		padding: 0;
	}

	:global(.gt-table td:last-child) { border-right: none; }

	:global(.gt-num) {
		min-width: 30px !important;
		width: 30px !important;
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.6rem;
		color: #aaa8a0;
	}

	:global(.gt-label) {
		min-width: 56px !important;
		width: 56px !important;
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.75rem;
		text-align: right !important;
		padding-right: 8px !important;
		white-space: nowrap;
		overflow: hidden;
	}

	:global(.gt-cell) {
		font-size: 1.5rem;
		line-height: 1;
	}

	:global(.gt-serif) { font-family: 'Noto Serif', 'DejaVu Serif', serif; font-style: normal; }
	:global(.gt-sans) { font-family: 'Noto Sans', 'DejaVu Sans', sans-serif; font-style: normal; }
	:global(.gt-serif-it) { font-family: 'Noto Serif', 'DejaVu Serif', serif; font-style: italic; }
	:global(.gt-sans-obl) { font-family: 'Noto Sans', 'DejaVu Sans', sans-serif; font-style: italic; }

	:global(.gt-cursive) {
		background: #ebeee8 !important;
		color: #8ba48b;
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-style: normal;
		font-size: 0.6rem !important;
		letter-spacing: 0.03em;
	}

	:global(.gt-null) {
		font-size: 1.15rem !important;
		font-weight: 700;
		letter-spacing: 0.12em;
		line-height: 48px;
		color: var(--dusty-rose, #A67B7B);
	}

	:global(.gt-hi) {
		background: #F0D8D8 !important;
		box-shadow: inset 0 0 0 1.5px #C28888;
	}

	:global(.gt-obsolete td) { background: #f8f6f0 !important; }
	:global(.gt-obsolete .gt-label),
	:global(.gt-obsolete .gt-num) { color: #96918a !important; }

	:global(.gt-divider td) {
		background: #fff !important;
		border-bottom: 2px solid #a0a09b !important;
		padding: 6px 8px !important;
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.7rem !important;
		color: #a0a09b;
		letter-spacing: 0.04em;
		height: auto !important;
		text-align: left !important;
	}
	.app-content {
		display: flex;
		flex: 1;
		overflow: hidden;
		background-color: var(--drawer-bg, #FAF8F5);
	}
	.main-content {
		flex: 1;
		overflow-y: auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: var(--desk-surface, #D8D4C8);
		transform: none;
	}

	/* ── Floating Paper: tab-specific surrounds (Approach A) ── */

	.main-content.tab-transcription {
		background-color: var(--surround-transcription, #D8D4C8);
	}

	.main-content.tab-learn {
		background-color: var(--surround-learn, #E5E1D6);
	}

	.main-content.tab-guide {
		background-color: var(--surround-guide, #F2EFE6);
	}

	/* ── Floating Paper: tab-specific shadows ─────────────── */

	.main-content.tab-transcription :global(.paper-page) {
		box-shadow: 0 2px 8px rgba(45, 45, 45, 0.06);
	}

	.main-content.tab-learn :global(.reading-paper) {
		box-shadow: 0 4px 20px rgba(45, 45, 45, 0.10);
	}

	.main-content.tab-guide :global(.reading-paper) {
		box-shadow: 0 3px 12px rgba(45, 45, 45, 0.08);
	}

	/* ── Transcription mode: Paper centres naturally within flex ── */

	/*
	 * Reading mode: no translateX offset. The Reading Paper fills available
	 * width naturally via flex. When the Drawer collapses, the flex container
	 * grows and ReadingPaper's max-width centres it. Smooth width transition
	 * handled by the Drawer's own 1000ms cubic-bezier.
	 */
	.main-content.reading-mode {
		transform: none;
		justify-content: flex-start;
		padding-top: 1rem;
	}

	/* ── Tab transition animations ──────────────────────── */

	@keyframes tabSlideFromRight {
		from {
			opacity: 0;
			transform: translateX(12px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes tabSlideFromLeft {
		from {
			opacity: 0;
			transform: translateX(-12px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.main-content.tab-enter-from-right {
		animation: tabSlideFromRight 175ms cubic-bezier(0.25, 0, 0.15, 1) both;
	}

	.main-content.tab-enter-from-left {
		animation: tabSlideFromLeft 175ms cubic-bezier(0.25, 0, 0.15, 1) both;
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
			transform: none;
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
		.main-content {
			transition: none !important;
		}
		.main-content.tab-enter-from-right,
		.main-content.tab-enter-from-left {
			animation: none !important;
		}
	}
	/* ── Editorial mark callout (scholarly departure/note) ──── */
	:global(.learn-callout) {
		border-left: 4px solid var(--dusty-rose, #A67B7B);
		border-top: none;
		border-right: none;
		border-bottom: none;
		background: none;
		padding: 0 0 0 1rem;
		margin: 2rem 0;
		border-radius: 0;
		font-size: 0.92em;
		position: relative;
	}
	:global(.learn-callout)::before {
		content: "NOTE";
		display: block;
		font-variant: small-caps;
		font-weight: 600;
		letter-spacing: 0.05em;
		color: var(--dusty-rose, #A67B7B);
		margin-bottom: 0.5rem;
		margin-left: -4px;
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.85rem;
	}
	:global(.learn-callout p:last-child) {
		margin-bottom: 0;
	}
	/* Variant labels via data attribute */
	:global(.learn-callout[data-label="departure"])::before {
		content: "DEPARTURE";
	}
	:global(.learn-callout[data-label="method"])::before {
		content: "METHOD";
	}
	:global(.learn-callout[data-label="context"])::before {
		content: "CONTEXT";
	}
	/* ── Placeholder content within ReadingPaper ──────────── */
	.placeholder-content {
		text-align: center;
		padding: 4rem 0;
	}

	/* ── Guide question headers: welcoming landmarks ───────── */
	.main-content.tab-guide :global(.reading-inner h4) {
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 1.35rem;
		font-weight: 500;
		color: var(--ink-primary, #1a1612);
		margin-top: 3rem;
		margin-bottom: 0.75rem;
		line-height: 1.35;
	}

	/* Tab-scoped heading colours */

	.main-content.tab-learn :global(.reading-inner h1),
	.main-content.tab-learn :global(.reading-inner h2),
	.main-content.tab-learn :global(.reading-inner h3),
	.main-content.tab-learn :global(.reading-inner h4) {
		color: var(--dusty-rose, #A67B7B);
	}

	.main-content.tab-guide :global(.reading-inner h1),
	.main-content.tab-guide :global(.reading-inner h2),
	.main-content.tab-guide :global(.reading-inner h3),
	.main-content.tab-guide :global(.reading-inner h4) {
		color: var(--quiet-cobalt, #5C739E);
	}

	.main-content.tab-guide :global(.reading-inner h3) {
		border-top-color: var(--quiet-cobalt, #5C739E);
	}

	/* ── Text input field: sage border (item 6) ──────────── */
	/* Targets textarea within the Drawer's transcription panel */
	:global(.drawer-content textarea) {
		border: 3px solid var(--sage, #8B9A7D) !important;
		transition: border-color 150ms ease;
	}
	:global(.drawer-content textarea:focus) {
		border-color: var(--deeper-sage, #7A8A6C) !important;
	}
	/* ── Mobile awareness ──────────────────────────────────── */
	.mobile-overlay {
		position: fixed;
		inset: 0;
		z-index: 1000;
		background: var(--desk-surface, #D8D4C8);
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
	.mobile-logo .logo-version {
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.5rem;
		font-weight: 400;
		vertical-align: super;
		margin-left: 0.1em;
		color: var(--sage);
		text-transform: lowercase;
		letter-spacing: 0.02em;
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
			padding-bottom: 57vh; /* room for the bottom-sheet drawer */
			width: 100%;
			overflow: auto;
			align-items: flex-start;
			-webkit-overflow-scrolling: touch;
			transform: none;
		}
		/* Drawer as bottom sheet on mobile */
		:global(.drawer) {
			position: fixed !important;
			bottom: 0 !important;
			left: 0 !important;
			top: auto !important;
			right: 0 !important;
			height: auto !important;
			max-height: 55vh !important;
			width: 100% !important;
			z-index: 100;
			border-radius: 14px 14px 0 0;
			box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.1);
			overflow: hidden;
		}
		:global(.drawer.collapsed) {
			max-height: 44px !important;
		}
	}

	/* ── Guide / Contributors ──────────────────────────── */

	.guide-step-figure {
		margin: 2rem 0;
		border: 1px solid var(--border-light, #ddd9d4);
		border-radius: 6px;
		overflow: hidden;
	}

	.guide-step-figure img {
		display: block;
		width: 100%;
		height: auto;
	}

	.guide-step-figure figcaption {
		padding: 0.75rem 1rem;
		font-size: 0.85rem;
		line-height: 1.55;
		color: var(--ink-secondary, #4a4540);
		background: var(--surface-subtle, #f9f7f5);
		border-top: 1px solid var(--border-light, #ddd9d4);
	}

		.guide-spacer {
		height: 6rem;
	}

	.about-website {
		margin-top: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.about-website a {
		color: var(--quiet-cobalt, #5C739E);
		text-decoration: none;
	}

	.about-website a:hover {
		text-decoration: underline;
	}
</style>
