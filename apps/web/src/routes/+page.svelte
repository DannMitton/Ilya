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
	// Tab transition animation
	const TAB_ORDER: TabId[] = ['transcription', 'learn', 'guide'];
	let tabTransitionClass = $state('');
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
	<HeaderBar {language} onlanguagechange={handleLanguageChange} />
</div>
<div class="app-content {viewBreathClass}">
	<div class="screen-only">
		<Drawer
			width={drawerWidth}
			collapsed={drawerCollapsed}
			{language}
			{activeTab}
			{tabTransitionClass}
			ontogglecollapse={handleDrawerToggle}
			ontabchange={handleTabChange}
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
	</div>
	<main
		class="main-content {paperBreathClass} {tabTransitionClass}"
		class:drawer-open={!drawerCollapsed}
		class:reading-mode={isReadingMode}
		bind:this={mainContentEl}
	>
		{#if activeTab === 'transcription'}
			<Paper lines={effectiveLines} {notationPrefs} {language} {metadata} pageSize="letter" {showStressDiacritics} {spotReconstitution} {glossOverrides} onwordclick={handleWordClick} />
		{:else}
			<ReadingPaper {language}>
				{#snippet content()}
					{#if activeTab === 'learn'}
						{#if language === 'fr'}
						<h1 id="learn-title">La diction lyrique russe pour chanteurs</h1>

						<p>Nous partons d'un socle commun. Vous maîtrisez l'Alphabet phonétique international. Vous avez étudié la diction lyrique de l'anglais, du français, de l'italien et de l'allemand. Vous savez lire une transcription phonétique, et vous avez développé la coordination physique nécessaire pour produire les sons que ces transcriptions décrivent.</p>

						<p>La diction lyrique russe s'appuie sur l'ensemble de ces acquis. Les sons du russe chanté ne sont pas aussi éloignés de ce que vous connaissez déjà qu'il n'y paraît au premier abord : nombre de consonnes se comportent exactement comme leurs équivalents dans les langues que vous avez étudiées, et le système vocalique, bien qu'il obéisse à des règles différentes, est plus restreint et plus ordonné que celui de l'anglais. Ce que le russe vous demande n'est pas un saut dans l'inconnu, mais une extension de compétences que vous possédez déjà, guidée par un cadre phonologique rigoureux et bien documenté.</p>

						<h2 id="learn-about">À propos de ce module</h2>

						<p>LEARN présente les principes fondamentaux de la diction lyrique russe tels qu'établis par Craig Grayson dans sa thèse de doctorat de 2012, <em>Russian Lyric Diction: A practical guide with introduction and annotations and a bibliography with annotations on selected sources</em> (Université de Washington). Ce qui suit est une réorganisation pédagogique du travail de Grayson, conçue pour les chanteurs plutôt que pour les linguistes, et structurée pour construire progressivement à partir de vos acquis.</p>

						<p>Grayson n'est pas le premier à couvrir ce terrain. Depuis le volume pionnier de Natalia Challis sur Rachmaninov (1989), en passant par les transcriptions de Piatak et Avrashov (1991), les six volumes de Richter (1999-2008), les libretti de Belov (2004), et les contributions d'Olin (2012), de McMaster (dans le livre de Sheil, 2012) et de Thomas (dans le livre de Karna, 2010), les chanteurs ont disposé de ressources de valeur et d'ampleur croissantes. Ce que Grayson apporte est une synthèse : un guide de diction adossé à l'API orthodoxe, informé par la phonologie russe, et suffisamment rigoureux pour permettre au lecteur de produire des transcriptions originales avec un réel degré d'autonomie. Dans la taxinomie utile de Sarah Dailey, les ressources antérieures servaient principalement de « guides accélérés » fournissant des transcriptions prêtes à l'emploi, tandis que Grayson propose un « guide d'étude autonome » qui enseigne le système sous-jacent.</p>

						<p>Trois limites protègent notre propos. Ceci n'est pas un cours de langue russe : nous enseignons la prononciation, non la grammaire, sauf lorsque la conscience grammaticale affecte directement la prononciation d'un mot. Ceci n'est pas un substitut à la thèse de Grayson : l'appareil savant complet demeure dans la source, et nous l'honorons en nous y appuyant plutôt qu'en le reproduisant. Et ceci n'est pas un guide d'utilisation d'Ilya; l'onglet Guide enseigne l'outil. LEARN enseigne la diction.</p>

						<h2 id="learn-arc">L'arc d'apprentissage</h2>

						<p>Le module est organisé en sept unités qui suivent un principe directeur unique : découvrir les sons d'abord, puis apprendre ce qui leur arrive.</p>


						<h3 id="learn-unit-1">Section 1 · Les lettres</h3>

						<p>Le russe standard contemporain (RSC) utilise trente-trois lettres. On rencontre parfois quatre caractères supplémentaires, aujourd'hui obsolètes, dans les partitions anciennes ; ceux-ci ont été abandonnés lors de la réforme orthographique de 1918. C'est là tout le système, et à la fin de cette section vous aurez fait connaissance avec chacun de ses membres.</p>

						<p>Commençons par une chanson.</p>

						<h4 id="learn-u1-song">La chanson de l'alphabet russe</h4>

						<blockquote><p><em>[Image de la partition : Chanson de l'alphabet russe occidentalisée de Ken Griffiths, arr. Dann Mitton 2017. Voix de basse, si bémol majeur, Moderato (♩ = 72). Présentée sur fond blanc aux proportions Letter (8,5 × 11 po) avec marges standard.]</em></p></blockquote>

						<p>Les enfants russes apprennent l'alphabet cyrillique par cœur. Cette chanson de l'alphabet russe est une construction occidentalisée sur la mélodie d'une chanson à boire traditionnelle. Elle présente les trente-trois lettres dans leur ordre du dictionnaire, chacune chantée sur son nom russe. La phrase finale offre ce conseil pragmatique : «&nbsp;Pour parler russe, il faut apprendre l'alphabet&nbsp;!&nbsp;» Chantez-la une ou deux fois dans la tonalité qui vous convient le mieux et vous aurez déjà la séquence sous les doigts.</p>

						<h4 id="learn-u1-before">Avant de commencer</h4>

						<p>Quelques éléments utiles avant d'entrer dans le vif du sujet.</p>

						<p><strong>Vous lisez déjà l'API.</strong> <em>Ilya</em> part du principe que vous avez travaillé avec l'Alphabet phonétique international dans au moins une autre langue chantée. Si vous savez déjà lire une transcription de diction lyrique italienne, française ou allemande, vous possédez la plupart des outils nécessaires. Le russe n'ajoute qu'un petit nombre de symboles qui vous seront nouveaux. Nous les explorons sous peu.</p>

						<p><strong>La diction lyrique est un registre stylisé.</strong> Le public russe attend un certain degré d'artifice dans le chant et la déclamation poétique. Tout comme chanter «&nbsp;dew&nbsp;» en <code>[djuː]</code> ne correspond pas à la prononciation courante chez la plupart des anglophones, ou que prononcer chaque e caduc en conversation courante sonnerait affecté en français, le russe chanté impose certaines prononciations stylisées. Le russe chanté n'est pas le russe conversationnel. La diction lyrique russe occupe un registre élevé : plus précis que la parole, façonné par les exigences de la production vocale soutenue et non amplifiée, et ancré dans la tradition de prononciation littéraire et scénique. La thèse de doctorat du Dr. Craig Grayson, <em>Russian Lyric Diction</em> (2012), décrit ce registre d'une manière systématique, et <em>Ilya</em> met en œuvre son travail pour vous. Lorsque vous voyez un symbole API dans <em>Ilya</em>, il reflète le style de notation de Grayson. Lorsque vous le rencontrez dans sa thèse, il signifie la même chose. Voilà notre promesse.</p>

						<p><strong>Les règles décrivent ce que fait le russe.</strong> Tout au long de LEARN, nous présentons les règles non comme des lois capricieuses à mémoriser, mais comme des descriptions synthétisées du comportement du russe : comment les mots subissent certaines transformations dans certains contextes. Nous nommons et décrivons ces transformations, nous vous offrons des exemples, et nous vous dirigeons vers <em>Ilya</em> pour que vous puissiez les observer en temps réel avec du vrai texte. Les règles sont des motifs à reconnaître, non des lois arbitraires à appliquer.</p>

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
						<div class="gt-scroll">
						<table class="gt-table">
						<thead>
						<tr>
							<th>Maj.<br><span class="gt-col-sub">Sérif</span></th>
							<th>Min.<br><span class="gt-col-sub">Sérif</span></th>
							<th>Maj.<br><span class="gt-col-sub">Sans</span></th>
							<th>Min.<br><span class="gt-col-sub">Sans</span></th>
							<th>Maj.<br><span class="gt-col-sub">Sérif italique</span></th>
							<th>Min.<br><span class="gt-col-sub">Sérif italique</span></th>
							<th>Maj.<br><span class="gt-col-sub">Sans oblique</span></th>
							<th>Min.<br><span class="gt-col-sub">Sans oblique</span></th>
							<th class="gt-cursive-h">Maj.<br><span class="gt-col-sub">Cursive</span></th>
							<th class="gt-cursive-h">Min.<br><span class="gt-col-sub">Cursive</span></th>
						</tr>
						</thead>
						<tbody>
							<tr>
								<td class="gt-cell gt-serif">А</td>
								<td class="gt-cell gt-serif">а</td>
								<td class="gt-cell gt-sans">А</td>
								<td class="gt-cell gt-sans">а</td>
								<td class="gt-cell gt-serif-it">А</td>
								<td class="gt-cell gt-serif-it">а</td>
								<td class="gt-cell gt-sans-obl">А</td>
								<td class="gt-cell gt-sans-obl">а</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Б</td>
								<td class="gt-cell gt-serif">б</td>
								<td class="gt-cell gt-sans">Б</td>
								<td class="gt-cell gt-sans">б</td>
								<td class="gt-cell gt-serif-it">Б</td>
								<td class="gt-cell gt-serif-it">б</td>
								<td class="gt-cell gt-sans-obl">Б</td>
								<td class="gt-cell gt-sans-obl">б</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">В</td>
								<td class="gt-cell gt-serif">в</td>
								<td class="gt-cell gt-sans">В</td>
								<td class="gt-cell gt-sans">в</td>
								<td class="gt-cell gt-serif-it">В</td>
								<td class="gt-cell gt-serif-it">в</td>
								<td class="gt-cell gt-sans-obl">В</td>
								<td class="gt-cell gt-sans-obl">в</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Г</td>
								<td class="gt-cell gt-serif">г</td>
								<td class="gt-cell gt-sans">Г</td>
								<td class="gt-cell gt-sans">г</td>
								<td class="gt-cell gt-serif-it">Г</td>
								<td class="gt-cell gt-serif-it gt-hi">г</td>
								<td class="gt-cell gt-sans-obl">Г</td>
								<td class="gt-cell gt-sans-obl gt-hi">г</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Д</td>
								<td class="gt-cell gt-serif">д</td>
								<td class="gt-cell gt-sans">Д</td>
								<td class="gt-cell gt-sans">д</td>
								<td class="gt-cell gt-serif-it">Д</td>
								<td class="gt-cell gt-serif-it">д</td>
								<td class="gt-cell gt-sans-obl">Д</td>
								<td class="gt-cell gt-sans-obl">д</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive gt-hi">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Е</td>
								<td class="gt-cell gt-serif">е</td>
								<td class="gt-cell gt-sans">Е</td>
								<td class="gt-cell gt-sans">е</td>
								<td class="gt-cell gt-serif-it">Е</td>
								<td class="gt-cell gt-serif-it">е</td>
								<td class="gt-cell gt-sans-obl">Е</td>
								<td class="gt-cell gt-sans-obl">е</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ё</td>
								<td class="gt-cell gt-serif">ё</td>
								<td class="gt-cell gt-sans">Ё</td>
								<td class="gt-cell gt-sans">ё</td>
								<td class="gt-cell gt-serif-it">Ё</td>
								<td class="gt-cell gt-serif-it">ё</td>
								<td class="gt-cell gt-sans-obl">Ё</td>
								<td class="gt-cell gt-sans-obl">ё</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ж</td>
								<td class="gt-cell gt-serif">ж</td>
								<td class="gt-cell gt-sans">Ж</td>
								<td class="gt-cell gt-sans">ж</td>
								<td class="gt-cell gt-serif-it">Ж</td>
								<td class="gt-cell gt-serif-it">ж</td>
								<td class="gt-cell gt-sans-obl">Ж</td>
								<td class="gt-cell gt-sans-obl">ж</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">З</td>
								<td class="gt-cell gt-serif">з</td>
								<td class="gt-cell gt-sans">З</td>
								<td class="gt-cell gt-sans">з</td>
								<td class="gt-cell gt-serif-it">З</td>
								<td class="gt-cell gt-serif-it">з</td>
								<td class="gt-cell gt-sans-obl">З</td>
								<td class="gt-cell gt-sans-obl">з</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">И</td>
								<td class="gt-cell gt-serif">и</td>
								<td class="gt-cell gt-sans">И</td>
								<td class="gt-cell gt-sans">и</td>
								<td class="gt-cell gt-serif-it">И</td>
								<td class="gt-cell gt-serif-it">и</td>
								<td class="gt-cell gt-sans-obl">И</td>
								<td class="gt-cell gt-sans-obl">и</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Й</td>
								<td class="gt-cell gt-serif">й</td>
								<td class="gt-cell gt-sans">Й</td>
								<td class="gt-cell gt-sans">й</td>
								<td class="gt-cell gt-serif-it">Й</td>
								<td class="gt-cell gt-serif-it">й</td>
								<td class="gt-cell gt-sans-obl">Й</td>
								<td class="gt-cell gt-sans-obl">й</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">К</td>
								<td class="gt-cell gt-serif">к</td>
								<td class="gt-cell gt-sans">К</td>
								<td class="gt-cell gt-sans">к</td>
								<td class="gt-cell gt-serif-it">К</td>
								<td class="gt-cell gt-serif-it">к</td>
								<td class="gt-cell gt-sans-obl">К</td>
								<td class="gt-cell gt-sans-obl">к</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Л</td>
								<td class="gt-cell gt-serif">л</td>
								<td class="gt-cell gt-sans">Л</td>
								<td class="gt-cell gt-sans">л</td>
								<td class="gt-cell gt-serif-it">Л</td>
								<td class="gt-cell gt-serif-it">л</td>
								<td class="gt-cell gt-sans-obl">Л</td>
								<td class="gt-cell gt-sans-obl">л</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">М</td>
								<td class="gt-cell gt-serif">м</td>
								<td class="gt-cell gt-sans">М</td>
								<td class="gt-cell gt-sans">м</td>
								<td class="gt-cell gt-serif-it">М</td>
								<td class="gt-cell gt-serif-it">м</td>
								<td class="gt-cell gt-sans-obl">М</td>
								<td class="gt-cell gt-sans-obl">м</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Н</td>
								<td class="gt-cell gt-serif">н</td>
								<td class="gt-cell gt-sans">Н</td>
								<td class="gt-cell gt-sans">н</td>
								<td class="gt-cell gt-serif-it">Н</td>
								<td class="gt-cell gt-serif-it">н</td>
								<td class="gt-cell gt-sans-obl">Н</td>
								<td class="gt-cell gt-sans-obl">н</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">О</td>
								<td class="gt-cell gt-serif">о</td>
								<td class="gt-cell gt-sans">О</td>
								<td class="gt-cell gt-sans">о</td>
								<td class="gt-cell gt-serif-it">О</td>
								<td class="gt-cell gt-serif-it">о</td>
								<td class="gt-cell gt-sans-obl">О</td>
								<td class="gt-cell gt-sans-obl">о</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">П</td>
								<td class="gt-cell gt-serif gt-hi">п</td>
								<td class="gt-cell gt-sans">П</td>
								<td class="gt-cell gt-sans gt-hi">п</td>
								<td class="gt-cell gt-serif-it">П</td>
								<td class="gt-cell gt-serif-it">п</td>
								<td class="gt-cell gt-sans-obl">П</td>
								<td class="gt-cell gt-sans-obl">п</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Р</td>
								<td class="gt-cell gt-serif">р</td>
								<td class="gt-cell gt-sans">Р</td>
								<td class="gt-cell gt-sans">р</td>
								<td class="gt-cell gt-serif-it">Р</td>
								<td class="gt-cell gt-serif-it">р</td>
								<td class="gt-cell gt-sans-obl">Р</td>
								<td class="gt-cell gt-sans-obl">р</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">С</td>
								<td class="gt-cell gt-serif">с</td>
								<td class="gt-cell gt-sans">С</td>
								<td class="gt-cell gt-sans">с</td>
								<td class="gt-cell gt-serif-it">С</td>
								<td class="gt-cell gt-serif-it">с</td>
								<td class="gt-cell gt-sans-obl">С</td>
								<td class="gt-cell gt-sans-obl">с</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Т</td>
								<td class="gt-cell gt-serif">т</td>
								<td class="gt-cell gt-sans">Т</td>
								<td class="gt-cell gt-sans">т</td>
								<td class="gt-cell gt-serif-it">Т</td>
								<td class="gt-cell gt-serif-it gt-hi">т</td>
								<td class="gt-cell gt-sans-obl">Т</td>
								<td class="gt-cell gt-sans-obl gt-hi">т</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">У</td>
								<td class="gt-cell gt-serif">у</td>
								<td class="gt-cell gt-sans">У</td>
								<td class="gt-cell gt-sans">у</td>
								<td class="gt-cell gt-serif-it">У</td>
								<td class="gt-cell gt-serif-it">у</td>
								<td class="gt-cell gt-sans-obl">У</td>
								<td class="gt-cell gt-sans-obl">у</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ф</td>
								<td class="gt-cell gt-serif">ф</td>
								<td class="gt-cell gt-sans">Ф</td>
								<td class="gt-cell gt-sans">ф</td>
								<td class="gt-cell gt-serif-it">Ф</td>
								<td class="gt-cell gt-serif-it">ф</td>
								<td class="gt-cell gt-sans-obl">Ф</td>
								<td class="gt-cell gt-sans-obl">ф</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Х</td>
								<td class="gt-cell gt-serif">х</td>
								<td class="gt-cell gt-sans">Х</td>
								<td class="gt-cell gt-sans">х</td>
								<td class="gt-cell gt-serif-it">Х</td>
								<td class="gt-cell gt-serif-it">х</td>
								<td class="gt-cell gt-sans-obl">Х</td>
								<td class="gt-cell gt-sans-obl">х</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ц</td>
								<td class="gt-cell gt-serif">ц</td>
								<td class="gt-cell gt-sans">Ц</td>
								<td class="gt-cell gt-sans">ц</td>
								<td class="gt-cell gt-serif-it">Ц</td>
								<td class="gt-cell gt-serif-it">ц</td>
								<td class="gt-cell gt-sans-obl">Ц</td>
								<td class="gt-cell gt-sans-obl">ц</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ч</td>
								<td class="gt-cell gt-serif">ч</td>
								<td class="gt-cell gt-sans">Ч</td>
								<td class="gt-cell gt-sans">ч</td>
								<td class="gt-cell gt-serif-it">Ч</td>
								<td class="gt-cell gt-serif-it">ч</td>
								<td class="gt-cell gt-sans-obl">Ч</td>
								<td class="gt-cell gt-sans-obl">ч</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ш</td>
								<td class="gt-cell gt-serif">ш</td>
								<td class="gt-cell gt-sans">Ш</td>
								<td class="gt-cell gt-sans">ш</td>
								<td class="gt-cell gt-serif-it">Ш</td>
								<td class="gt-cell gt-serif-it">ш</td>
								<td class="gt-cell gt-sans-obl">Ш</td>
								<td class="gt-cell gt-sans-obl">ш</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Щ</td>
								<td class="gt-cell gt-serif">щ</td>
								<td class="gt-cell gt-sans">Щ</td>
								<td class="gt-cell gt-sans">щ</td>
								<td class="gt-cell gt-serif-it">Щ</td>
								<td class="gt-cell gt-serif-it">щ</td>
								<td class="gt-cell gt-sans-obl">Щ</td>
								<td class="gt-cell gt-sans-obl">щ</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ъ</td>
								<td class="gt-cell gt-serif">ъ</td>
								<td class="gt-cell gt-sans">Ъ</td>
								<td class="gt-cell gt-sans">ъ</td>
								<td class="gt-cell gt-serif-it">Ъ</td>
								<td class="gt-cell gt-serif-it">ъ</td>
								<td class="gt-cell gt-sans-obl">Ъ</td>
								<td class="gt-cell gt-sans-obl">ъ</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ы</td>
								<td class="gt-cell gt-serif">ы</td>
								<td class="gt-cell gt-sans">Ы</td>
								<td class="gt-cell gt-sans">ы</td>
								<td class="gt-cell gt-serif-it">Ы</td>
								<td class="gt-cell gt-serif-it">ы</td>
								<td class="gt-cell gt-sans-obl">Ы</td>
								<td class="gt-cell gt-sans-obl">ы</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ь</td>
								<td class="gt-cell gt-serif">ь</td>
								<td class="gt-cell gt-sans">Ь</td>
								<td class="gt-cell gt-sans">ь</td>
								<td class="gt-cell gt-serif-it">Ь</td>
								<td class="gt-cell gt-serif-it">ь</td>
								<td class="gt-cell gt-sans-obl">Ь</td>
								<td class="gt-cell gt-sans-obl">ь</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Э</td>
								<td class="gt-cell gt-serif">э</td>
								<td class="gt-cell gt-sans">Э</td>
								<td class="gt-cell gt-sans">э</td>
								<td class="gt-cell gt-serif-it">Э</td>
								<td class="gt-cell gt-serif-it">э</td>
								<td class="gt-cell gt-sans-obl">Э</td>
								<td class="gt-cell gt-sans-obl">э</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ю</td>
								<td class="gt-cell gt-serif">ю</td>
								<td class="gt-cell gt-sans">Ю</td>
								<td class="gt-cell gt-sans">ю</td>
								<td class="gt-cell gt-serif-it">Ю</td>
								<td class="gt-cell gt-serif-it">ю</td>
								<td class="gt-cell gt-sans-obl">Ю</td>
								<td class="gt-cell gt-sans-obl">ю</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Я</td>
								<td class="gt-cell gt-serif">я</td>
								<td class="gt-cell gt-sans">Я</td>
								<td class="gt-cell gt-sans">я</td>
								<td class="gt-cell gt-serif-it">Я</td>
								<td class="gt-cell gt-serif-it">я</td>
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
								<td class="gt-cell gt-sans">Ѣ</td>
								<td class="gt-cell gt-sans">ѣ</td>
								<td class="gt-cell gt-serif-it">Ѣ</td>
								<td class="gt-cell gt-serif-it gt-hi">ѣ</td>
								<td class="gt-cell gt-sans-obl">Ѣ</td>
								<td class="gt-cell gt-sans-obl">ѣ</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr class="gt-obsolete">
								<td class="gt-cell gt-serif">Ѳ</td>
								<td class="gt-cell gt-serif">ѳ</td>
								<td class="gt-cell gt-sans">Ѳ</td>
								<td class="gt-cell gt-sans">ѳ</td>
								<td class="gt-cell gt-serif-it">Ѳ</td>
								<td class="gt-cell gt-serif-it">ѳ</td>
								<td class="gt-cell gt-sans-obl">Ѳ</td>
								<td class="gt-cell gt-sans-obl">ѳ</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr class="gt-obsolete">
								<td class="gt-cell gt-serif">І</td>
								<td class="gt-cell gt-serif">і</td>
								<td class="gt-cell gt-sans">І</td>
								<td class="gt-cell gt-sans">і</td>
								<td class="gt-cell gt-serif-it">І</td>
								<td class="gt-cell gt-serif-it">і</td>
								<td class="gt-cell gt-sans-obl">І</td>
								<td class="gt-cell gt-sans-obl">і</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr class="gt-obsolete">
								<td class="gt-cell gt-serif">Ѵ</td>
								<td class="gt-cell gt-serif">ѵ</td>
								<td class="gt-cell gt-sans">Ѵ</td>
								<td class="gt-cell gt-sans">ѵ</td>
								<td class="gt-cell gt-serif-it">Ѵ</td>
								<td class="gt-cell gt-serif-it">ѵ</td>
								<td class="gt-cell gt-sans-obl">Ѵ</td>
								<td class="gt-cell gt-sans-obl">ѵ</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
						</tbody>
						</table>
						</div>


						<p><em>Le tableau des glyphes est livré au lancement avec les formes imprimées et italiques. Les colonnes cursives sont réservées à des illustrations commandées dans le style d'écriture scolaire russe standard (прописи), avec les crochets de liaison (соединения) qui distinguent la cursive russe authentique des polices de script décoratives.</em></p>

						<p>La raison de présenter chaque lettre sous plusieurs formes est de garantir que, peu importe où vous rencontreriez une lettre, vous pourriez la reconnaître. Les chanteurs rencontrent le cyrillique dans les partitions imprimées (souvent en sérif), dans les éditions contemporaines (souvent en sans sérif), dans les ressources savantes (souvent en italique), et occasionnellement dans des annotations manuscrites ou des manuscrits historiques (cursive). Remarquez à quel point certaines formes de lettres changent radicalement entre les versions régulière, italique et cursive.</p>

						<h4 id="learn-u1-try">Essayez</h4>

						<p>Ouvrez l'onglet Transcription d'<em>Ilya</em> et collez un court texte russe. Vous pourriez essayer l'ouverture de «&nbsp;Где ты, звёздочка?&nbsp;» de Moussorgski ou quelques vers de n'importe quelle mélodie de votre répertoire.</p>

						<p>Observez les trois lignes qu'<em>Ilya</em> produit : API, cyrillique et glose de traduction. Vous pouvez déjà commencer à faire correspondre ce que vous voyez dans la ligne API aux ancrages que vous venez d'apprendre ici. Certaines lettres se seront transformées : un ⟨О⟩ non accentué peut apparaître comme <code>[ʌ]</code> plutôt que le <code>[o]</code> que vous avez rencontré dans le tableau ci-dessus. Une consonne devant ⟨Е⟩ peut porter un marqueur de palatalisation, <code>[ʲ]</code>, qui n'était pas encore démontré dans l'ancrage.</p>

						<p>Ces transformations font l'objet des Sections 2 à 7. Pour l'instant, remarquez tout simplement que l'alphabet cyrillique russe est fini, et pourtant l'API vous est familier. <em>Ilya</em> peut vous montrer exactement ce qu'il fait à chaque lettre. Le reste de LEARN vous enseigne pourquoi.</p>

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

						<p><em>Source Grayson : ch. 7 (Syllabic Stress, pp. 263–273), ch. 2 (pp. 65–66). Baytukalov cité dans Grayson p. 273.</em></p>


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
								<tr><td>Consonne palatalisée (y compris ⟨ч⟩, ⟨щ⟩)</td><td>⟨а⟩ ou ⟨я⟩ accentué → [a]</td><td>Consonne palatalisée</td><td>пять /pʲ<strong>a</strong>tʲ/</td></tr>
							</tbody>
						</table>

						<p>Contre-exemple&#160;: пятый /ˈpʲɑ tɨj/. La consonne précédente est palatalisée (/pʲ/), mais la consonne suivante est dure (/t/). Un côté mou, un côté dur&#160;: la voyelle reste à /ɑ/. De même, мать /mɑtʲ/&#160;: le /m/ précédent est dur, donc malgré le /tʲ/ mou qui suit, la voyelle demeure /ɑ/.</p>

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

						<h3 id="learn-unit-4">Section 4 &middot; La r&#x00E9;duction vocalique</h3>

						<p><strong>Lorsqu&rsquo;une voyelle perd l&rsquo;accent, elle se transforme.</strong></p>

						<p>Le russe est une langue &#x00E0; rythme accentuel, comme l&rsquo;anglais. Il se d&#x00E9;roule en une s&#x00E9;rie de syllabes accentu&#x00E9;es et inaccentu&#x00E9;es, o&#x00F9; l&rsquo;intervalle entre les syllabes accentu&#x00E9;es reste &#x00E0; peu pr&#x00E8;s constant, tandis que les syllabes inaccentu&#x00E9;es s&rsquo;accommodent de ces pulsations r&#x00E9;guli&#x00E8;res en se comprimant entre elles et en perdant leur sp&#x00E9;cificit&#x00E9; vocalique. Cette perte de sp&#x00E9;cificit&#x00E9; s&rsquo;appelle la r&#x00E9;duction vocalique. La voyelle perd sa distinction par rapport &#x00E0; sa valeur cardinale par d&#x00E9;faut, d&#x00E9;rivant vers un son plus centralis&#x00E9; et moins engag&#x00E9;. En russe chant&#x00E9;, le compositeur prescrit les dur&#x00E9;es rythmiques, de sorte que la compression temporelle &#x00E9;vidente d&rsquo;une langue &#x00E0; rythme accentuel dans la parole spontan&#x00E9;e ne peut pas se manifester&#160;: elle est contr&#x00F4;l&#x00E9;e par le rythme et la vitesse de la m&#x00E9;lodie. Mais en tant que conteurs, la r&#x00E9;duction qualitative de la prosodie parl&#x00E9;e continue d&rsquo;&#x00E9;clairer notre approche des textes russes chant&#x00E9;s. La diction lyrique pr&#x00E9;serve davantage de qualit&#x00E9; vocalique pour le chant que la parole, mais le principe demeure&#160;: une voyelle inaccentu&#x00E9;e n&rsquo;a pas le m&#x00EA;me son d&#x00E9;fini qu&rsquo;a une voyelle accentu&#x00E9;e.</p>

						<p>La Section 3 a &#x00E9;tabli les six cibles vocaliques accentu&#x00E9;es&#160;: <code>/&#x0251;/</code>, <code>/&#x025B;/</code>, <code>/i/</code>, <code>/o/</code>, <code>/u/</code> et <code>[&#x0268;]</code>. Trois d&rsquo;entre elles &mdash; <code>/i/</code>, <code>/u/</code> et <code>[&#x0268;]</code> &mdash; traversent l&rsquo;accent sans changer&#160;: elles conservent leur son cardinal, qu&rsquo;elles soient accentu&#x00E9;es ou non. Voil&#x00E0; qui rassurera ceux d&rsquo;entre nous qui aspirent &#x00E0; des r&#x00E8;gles fiables en russe chant&#x00E9;. Les trois restantes, et les plus fr&#x00E9;quentes &mdash; <code>/&#x0251;/</code>, <code>/&#x025B;/</code> et <code>/o/</code> &mdash; se transforment lorsqu&rsquo;elles perdent l&rsquo;accent. La nature pr&#x00E9;cise de la transformation d&#x00E9;pend de deux facteurs&#160;: l&rsquo;identit&#x00E9; de la lettre vocalique au d&#x00E9;part, et sa proximit&#x00E9; par rapport &#x00E0; la syllabe accentu&#x00E9;e.</p>

						<p>Nous cataloguons cinq sons vocaliques inaccentu&#x00E9;s en russe chant&#x00E9;&#160;:</p>

						<table>
						<thead><tr><th>API</th><th>Source</th><th>Ce que cela sonne</th></tr></thead>
						<tbody>
						<tr><td><code>/&#x0251;/</code></td><td>&#x27E8;&#x0430;&#x27E9; ou &#x27E8;&#x043E;&#x27E9; inaccentu&#x00E9; en position privil&#x00E9;gi&#x00E9;e</td><td>La m&#x00EA;me voyelle ouverte post&#x00E9;rieure de la Section 3, mais sans l&rsquo;engagement articulatoire de l&rsquo;accent.</td></tr>
						<tr><td><code>[&#x028C;]</code></td><td>&#x27E8;&#x0430;&#x27E9; ou &#x27E8;&#x043E;&#x27E9; inaccentu&#x00E9; en position &#x00E9;loign&#x00E9;e</td><td>Une voyelle centralis&#x00E9;e, d&#x00E9;tendue&#8239;; c&rsquo;est le schwa du russe chant&#x00E9;&#160;: plus post&#x00E9;rieur que le <code>[&#x0259;]</code> fran&#x00E7;ais, sans arrondissement labial. Grayson note ce son <code>[&#x028C;]</code> plut&#x00F4;t que <code>[&#x0259;]</code> pr&#x00E9;cis&#x00E9;ment pour &#x00E9;viter que les chanteurs form&#x00E9;s en diction fran&#x00E7;aise n&rsquo;arrondissent les l&#x00E8;vres. <code>[&#x028C;]</code> n&rsquo;appara&#x00EE;t jamais en position accentu&#x00E9;e&#160;: il signale toujours une r&#x00E9;duction.</td></tr>
						<tr><td><code>[&#x026A;]</code></td><td>&#x27E8;&#x0435;&#x27E9; ou &#x27E8;&#x044F;&#x27E9; inaccentu&#x00E9; apr&#x00E8;s une consonne palatalis&#x00E9;e</td><td>Une version relax&#x00E9;e et centralis&#x00E9;e de /i/. La seule voyelle de l&rsquo;inventaire de Grayson sans r&#x00E9;f&#x00E9;rence cardinale sur le quadrilat&#x00E8;re vocalique de Jones. <code>[&#x026A;]</code> n&rsquo;appara&#x00EE;t jamais en position accentu&#x00E9;e&#160;: il signale toujours une r&#x00E9;duction.</td></tr>
						<tr><td><code>/i/</code></td><td>&#x27E8;&#x0435;&#x27E9; ou &#x27E8;&#x044F;&#x27E9; inaccentu&#x00E9; en environnement interpalatal</td><td>Le /i/ complet de la Section 3, ant&#x00E9;rioris&#x00E9; par les consonnes palatalis&#x00E9;es environnantes.</td></tr>
						<tr><td><code>[&#x0268;]</code></td><td>&#x27E8;&#x0435;&#x27E9; inaccentu&#x00E9; apr&#x00E8;s une consonne toujours dure (&#x27E8;&#x0436;&#x27E9;, &#x27E8;&#x0448;&#x27E9;, &#x27E8;&#x0446;&#x27E9;)</td><td>Le m&#x00EA;me i v&#x00E9;laire de la Section 3. Ces consonnes rejettent la palatalisation&#8239;; la voyelle se v&#x00E9;larise au lieu de se r&#x00E9;duire &#x00E0; <code>[&#x026A;]</code>.</td></tr>
						</tbody>
						</table>

						<p>Deux processus gouvernent ces r&#x00E9;ductions. La phonologie russe les nomme <em>akani&#x00E9;</em> /&#x02C8;&#x0251; k&#x028C; &#x0272;e/ et <em>ikani&#x00E9;</em> /&#x02C8;i k&#x028C; &#x0272;e/.</p>

						<h4 id="learn-u4-akanye">&#x27E8;&#x043E;&#x27E9; et &#x27E8;&#x0430;&#x27E9; suivent des chemins diff&#x00E9;rents sans accent.</h4>

						<p>L&rsquo;akani&#x00E9; est le processus par lequel &#x27E8;&#x043E;&#x27E9; et &#x27E8;&#x0430;&#x27E9; inaccentu&#x00E9;s se r&#x00E9;duisent. Le mot lui-m&#x00EA;me vient de la lettre &#x27E8;&#x0430;&#x27E9;&#160;: en russe chant&#x00E9;, lorsque &#x27E8;&#x043E;&#x27E9; perd l&rsquo;accent, il commence &#x00E0; sonner comme &#x27E8;&#x0430;&#x27E9;. Mais ces deux lettres ne se r&#x00E9;duisent pas de fa&#x00E7;on sym&#x00E9;trique. Leurs chemins divergent en une position critique&#160;: la syllabe imm&#x00E9;diatement apr&#x00E8;s l&rsquo;accent.</p>

						<table>
						<thead><tr><th>Position par rapport &#x00E0; l&rsquo;accent</th><th>&#x27E8;&#x043E;&#x27E9;</th><th>&#x27E8;&#x0430;&#x27E9;</th></tr></thead>
						<tbody>
						<tr><td>Accentu&#x00E9;e</td><td><code>/o/</code></td><td><code>/&#x0251;/</code></td></tr>
						<tr><td>Imm&#x00E9;diatement avant l&rsquo;accent</td><td><code>/&#x0251;/</code></td><td><code>/&#x0251;/</code></td></tr>
						<tr><td>Imm&#x00E9;diatement apr&#x00E8;s l&rsquo;accent</td><td><code>[&#x028C;]</code></td><td><code>/&#x0251;/</code></td></tr>
						<tr><td>Deux syllabes ou plus avant l&rsquo;accent</td><td><code>[&#x028C;]</code></td><td><code>[&#x028C;]</code></td></tr>
						<tr><td>Deux syllabes ou plus apr&#x00E8;s l&rsquo;accent</td><td><code>[&#x028C;]</code></td><td><code>[&#x028C;]</code></td></tr>
						<tr><td>Initiale de mot (toute distance)</td><td><code>/&#x0251;/</code></td><td><code>/&#x0251;/</code></td></tr>
						</tbody>
						</table>

						<p>L&rsquo;asym&#x00E9;trie se trouve &#x00E0; la troisi&#x00E8;me ligne. Imm&#x00E9;diatement apr&#x00E8;s l&rsquo;accent, &#x27E8;&#x043E;&#x27E9; se r&#x00E9;duit &#x00E0; <code>[&#x028C;]</code>, tandis que &#x27E8;&#x0430;&#x27E9; tient &#x00E0; <code>/&#x0251;/</code>. Le raisonnement de Grayson est auditif et s&#x00E9;mantique&#160;: la diff&#x00E9;rence entre <code>/&#x0251;/</code> et <code>[&#x028C;]</code> dans cette position aide l&rsquo;auditeur &#x00E0; distinguer les deux lettres vocaliques sous-jacentes, ce qui lui permet de comprendre la diff&#x00E9;rence entre des formes casuelles comme &#x27E8;&#x0431;&#x043B;&#x044E;&#x0434;&#x043E;&#x27E9; <code>/&#x02C8;bl&#x02B2;u d&#x028C;/</code> (un plat) et &#x27E8;&#x0431;&#x043B;&#x044E;&#x0434;&#x0430;&#x27E9; <code>/&#x02C8;bl&#x02B2;u d&#x0251;/</code> (des plats), o&#x00F9; la voyelle post-accentuelle porte &#x00E0; elle seule la diff&#x00E9;rence grammaticale (Grayson, p. 266, n. 306). Partout ailleurs, les chemins convergent.</p>

						<p>Voici une exception qui pr&#x00E9;vaut sur tout. Chaque fois que &#x27E8;&#x0430;&#x27E9; ou &#x27E8;&#x043E;&#x27E9; inaccentu&#x00E9; est la premi&#x00E8;re lettre du mot, la voyelle se lit <code>/&#x0251;/</code> quelle que soit sa distance par rapport &#x00E0; l&rsquo;accent.</p>

						<p>Le mot &#x27E8;&#x0445;&#x043E;&#x0440;&#x043E;&#x0448;&#x043E;&#x27E9; (bien) illustre la cha&#x00EE;ne compl&#x00E8;te de l&rsquo;akani&#x00E9; en un seul mot. Trois &#x27E8;&#x043E;&#x27E9; identiques, trois prononciations diff&#x00E9;rentes&#160;: <code>/x&#x028C; r&#x0251; &#x02C8;&#x0283;o/</code>. Le premier &#x27E8;&#x043E;&#x27E9;, &#x00E9;loign&#x00E9;, se r&#x00E9;duit &#x00E0; <code>[&#x028C;]</code>. Le &#x27E8;&#x043E;&#x27E9; imm&#x00E9;diatement pr&#x00E9;-accentuel tient &#x00E0; <code>/&#x0251;/</code>. Le &#x27E8;&#x043E;&#x27E9; final accentu&#x00E9; sonne <code>/o/</code>.</p>

						<h4 id="learn-u4-ikanye">&#x27E8;&#x0435;&#x27E9; et &#x27E8;&#x044F;&#x27E9; se r&#x00E9;duisent vers [&#x026A;].</h4>

						<p>L&rsquo;ikani&#x00E9; est le processus parall&#x00E8;le pour les voyelles qui se trouvent en environnement interpalatal, o&#x00F9; la voyelle est prise en sandwich entre deux agents palatalisateurs. Les voyelles &#x27E8;&#x0435;&#x27E9; et &#x27E8;&#x044F;&#x27E9; se r&#x00E9;duisent toutes deux &#x00E0; <code>[&#x026A;]</code>. Contrairement &#x00E0; l&rsquo;akani&#x00E9;, o&#x00F9; la position par rapport &#x00E0; l&rsquo;accent cr&#x00E9;e une hi&#x00E9;rarchie, l&rsquo;ikani&#x00E9; est plus simple&#160;: ces deux voyelles orthographiques se r&#x00E9;duisent &#x00E0; <code>[&#x026A;]</code> dans toute position inaccentu&#x00E9;e.</p>

						<p>Deux raffinements qualifient cette r&#x00E8;gle&#160;:</p>

						<table>
						<thead><tr><th>Condition</th><th>R&#x00E9;sultat</th><th>Pourquoi</th></tr></thead>
						<tbody>
						<tr><td>Apr&#x00E8;s une consonne toujours dure (&#x27E8;&#x0436;&#x27E9;, &#x27E8;&#x0448;&#x27E9;, &#x27E8;&#x0446;&#x27E9;)</td><td><code>[&#x0268;]</code>, et non <code>[&#x026A;]</code></td><td>Les trois consonnes de l&rsquo;ensemble toujours dur ne peuvent pas se palataliser. La voyelle se v&#x00E9;larise pour s&rsquo;accorder &#x00E0; l&rsquo;environnement consonantique dur.</td></tr>
						<tr><td>Interpalatale (palatalis&#x00E9;e des deux c&#x00F4;t&#x00E9;s)</td><td><code>/i/</code>, et non <code>[&#x026A;]</code></td><td>Les consonnes palatalis&#x00E9;es environnantes ant&#x00E9;riorisent la voyelle compl&#x00E8;tement vers /i/.</td></tr>
						</tbody>
						</table>

						<p>Les voyelles iot&#x00E9;es (&#x27E8;&#x0435;&#x27E9;, &#x27E8;&#x0451;&#x27E9;, &#x27E8;&#x044E;&#x27E9; et &#x27E8;&#x044F;&#x27E9;) suivent la m&#x00EA;me logique. &#x27E8;&#x044F;&#x27E9; inaccentu&#x00E9; en position de cluster iot&#x00E9; (d&#x00E9;but de mot, apr&#x00E8;s une voyelle ou apr&#x00E8;s un signe) produit <code>[j&#x026A;]</code>&#8239;; en position interpalatale, il s&rsquo;ant&#x00E9;riorisera vers <code>[ji]</code>. Grayson est explicite&#160;: le cluster r&#x00E9;duit <code>[j&#x028C;]</code> doit &#x00EA;tre &#x00E9;vit&#x00E9; en russe chant&#x00E9;.</p>

						<h4 id="learn-u4-reconstitution">La reconstitution est un choix &#x00E9;clair&#x00E9;, non une obligation.</h4>

						<p>La reconstitution est la d&#x00E9;cision d&rsquo;annuler la r&#x00E9;duction compl&#x00E8;te, ou de ramener une voyelle r&#x00E9;duite vers sa valeur non r&#x00E9;duite. En chant, o&#x00F9; les valeurs de note peuvent soutenir une voyelle bien au-del&#x00E0; de sa dur&#x00E9;e parl&#x00E9;e, un son pleinement r&#x00E9;duit peut sembler trop informel pour &#x00EA;tre chant&#x00E9; comme valeur vocalique soutenue dans la livraison d&rsquo;un texte po&#x00E9;tique. La reconstitution offre au chanteur une option raisonn&#x00E9;e pour restaurer la formalit&#x00E9; et la distinction vocalique sans abandonner le syst&#x00E8;me phonologique de Grayson.</p>

						<p>Le processus inverse la cha&#x00EE;ne de r&#x00E9;duction enti&#x00E8;rement pour la plupart des voyelles, mais seulement partiellement pour &#x27E8;&#x043E;&#x27E9;&#160;:</p>

						<table>
						<thead><tr><th>Son r&#x00E9;duit</th><th>Se reconstitue en</th><th>Ne se reconstitue pas en</th></tr></thead>
						<tbody>
						<tr><td><code>[&#x028C;]</code> (de &#x27E8;&#x0430;&#x27E9; ou &#x27E8;&#x043E;&#x27E9;)</td><td><code>/&#x0251;/</code></td><td>/o/ &mdash; la porte vers /o/ est &#x00E0; sens unique</td></tr>
						<tr><td><code>[&#x026A;]</code> (de &#x27E8;&#x0435;&#x27E9;)</td><td><code>/&#x025B;/</code></td><td>&mdash;</td></tr>
						<tr><td><code>[&#x026A;]</code> (de &#x27E8;&#x044F;&#x27E9;)</td><td><code>/&#x0251;/</code></td><td>&mdash;</td></tr>
						<tr><td><code>[j&#x026A;]</code> (de &#x27E8;&#x044F;&#x27E9; en cluster iot&#x00E9;)</td><td><code>/j&#x0251;/</code></td><td>&mdash;</td></tr>
						<tr><td><code>[j&#x026A;]</code> (de &#x27E8;&#x0435;&#x27E9; en cluster iot&#x00E9;)</td><td><code>/j&#x025B;/</code></td><td>&mdash;</td></tr>
						<tr><td><code>[&#x0268;]</code> (apr&#x00E8;s une consonne toujours dure)</td><td>Ne se reconstitue pas</td><td>&mdash;</td></tr>
						</tbody>
						</table>

						<p>La porte &#x00E0; sens unique est la contrainte la plus importante. Lorsque <code>[&#x028C;]</code> se reconstitue, il revient &#x00E0; <code>/&#x0251;/</code>, jamais &#x00E0; <code>/o/</code>. La r&#x00E9;duction de <code>/o/</code> &#x00E0; <code>/&#x0251;/</code> efface l&rsquo;arrondissement&#8239;; la reconstitution ne peut restaurer ce que l&rsquo;akani&#x00E9; a retir&#x00E9;. Grayson affirme que <code>[&#x0268;]</code> apr&#x00E8;s les consonnes toujours dures ne se reconstitue pas du tout&#160;: l&rsquo;environnement v&#x00E9;laris&#x00E9; est fixe.</p>

						<blockquote class="learn-callout">
						<p><strong>Un point de d&#x00E9;saccord respectueux, de la part de Dann.</strong></p>
						<p>Grayson &#x00E9;crit que &#x00AB;&#160;&#x27E8;&#x0438;&#x27E9; read as [&#x0268;] (stressed or unstressed) and unstressed &#x27E8;&#x0435;&#x27E9; read as [&#x0268;] after a hard consonant (on long or short notes), remain sung as [&#x0268;]&#160;&#x00BB; (p. 129). Cette phrase contient deux affirmations, et &#x00E0; mon avis, elles ne sont pas &#x00E9;quivalentes.</p>
						<p>La premi&#x00E8;re affirmation est juste. Lorsque &#x27E8;&#x0438;&#x27E9; suit une consonne dure, le [&#x0268;] qui en r&#x00E9;sulte n&rsquo;est pas une r&#x00E9;duction&#160;: c&rsquo;est l&rsquo;identit&#x00E9; de la voyelle dans cet environnement. Les russophones savent et comprennent que dans ce cas &#x27E8;&#x0438;&#x27E9; se prononce [&#x0268;], ou peut-&#x00EA;tre pouvons-nous comprendre que [&#x0268;] s&rsquo;&#x00E9;crit &#x27E8;&#x0438;&#x27E9; dans ce cas&#8239;; cela revient au m&#x00EA;me. Il n&rsquo;y a pas de voyelle source vers laquelle reconstituer, c&rsquo;est simplement la voyelle traditionnelle qui s&rsquo;ex&#x00E9;cute dans cette circonstance, reconnaissant que [&#x0268;] doit suivre une consonne non palatalis&#x00E9;e, jamais [i]. La consonne dure impose l&rsquo;expression du i v&#x00E9;laire. Je suis d&rsquo;accord avec Grayson ici&#8239;; la reconstitution ne s&rsquo;applique pas.</p>
						<p>Je crois que sa seconde affirmation m&#x00E9;rite qu&rsquo;on en r&#x00E9;fl&#x00E9;chisse. Lorsque &#x27E8;&#x0435;&#x27E9; inaccentu&#x00E9; suit l&rsquo;une des consonnes toujours dures (&#x27E8;&#x0436;&#x27E9;, &#x27E8;&#x0448;&#x27E9;, &#x27E8;&#x0446;&#x27E9;) pour produire [&#x0268;], la voyelle sous-jacente est /&#x025B;/. /&#x025B;/ se r&#x00E9;duit pour devenir [&#x0268;] dans ce cas, et par cons&#x00E9;quent la logique de la reconstitution devrait rester disponible. J&rsquo;affirme que sur des notes tenues ou dans des tempi plus lents, le chanteur peut reconstituer vers [&#x025B;]. D&rsquo;apr&#x00E8;s mon exp&#x00E9;rience, les locuteurs natifs russes et les coaches pr&#x00E9;conisent syst&#x00E9;matiquement ce choix. Le D&#x02B3; Alexei Kochetov, locuteur natif russe et phon&#x00E9;ticien &#x00E0; l&rsquo;Universit&#x00E9; de Toronto, a offert pr&#x00E9;cis&#x00E9;ment cette note sur mon ex&#x00E9;cution de l&rsquo;Op. 52, n&#x00BA; 2 de Kabalevsky&#160;: &#x00AB;&#160;[toj &#x0292;&#x0268;] should probably be [toj &#x0292;&#x025B;] (with no reduction)&#160;&#x00BB; (&#x00AB;&#160;[toj &#x0292;&#x0268;] devrait probablement &#x00EA;tre [toj &#x0292;&#x025B;] (sans r&#x00E9;duction)&#160;&#x00BB;).</p>
						<p>Un point de vue articulatoire peut-il soutenir la reconstitution dans ce cas&#160;? Les postures linguales de [&#x025B;] et des consonnes toujours dures [&#x0283;], [&#x0292;] et [ts] occupent le m&#x00EA;me voisinage m&#x00E9;dian&#8239;; [&#x025B;] n&rsquo;est pas assez ant&#x00E9;rioris&#x00E9; pour imposer un conflit. Ce n&rsquo;est pas analogue &#x00E0; la tentative de produire /i/ apr&#x00E8;s une consonne dure, o&#x00F9; l&rsquo;ant&#x00E9;riorisation contredit v&#x00E9;ritablement l&rsquo;environnement consonantique.</p>
						<p>C&rsquo;est le seul point sur lequel <em>Ilya</em> s&rsquo;&#x00E9;carte des r&#x00E8;gles de reconstitution de Grayson. Lorsque le basculeur de reconstitution est actif, &#x27E8;&#x0435;&#x27E9; inaccentu&#x00E9; apr&#x00E8;s une consonne toujours dure se reconstitue en [&#x025B;]. N&#x00E9;anmoins, si vous n&rsquo;&#x00EA;tes pas d&rsquo;accord avec moi et souhaitez observer l&rsquo;engagement de Grayson envers l&rsquo;inviolabilit&#x00E9; de [&#x0268;] dans ce cas, vous pouvez cliquer sur la case &#x00AB;&#160;R&#x00E9;duction ponctuelle&#160;&#x00BB; sous la pile de mots dans le panneau, et votre [&#x0268;] r&#x00E9;appara&#x00EE;tra d&#x00FB;ment.</p>
						</blockquote>

						<p>Le moment de reconstituer est une question de contexte et de go&#x00FB;t. Une note br&#x00E8;ve sur un temps faible dans un tempo vif peut accueillir la r&#x00E9;duction compl&#x00E8;te. Une note tenue sur un temps fort dans un tempo lent peut appeler la reconstitution. Les Russes semblent attendre moins de r&#x00E9;duction dans la d&#x00E9;clamation de textes po&#x00E9;tiques, comme un moyen de distinguer l&rsquo;art du discours quotidien. La meilleure confirmation vient d&rsquo;un coach russe natif&#8239;; Ilya offre les deux options par le biais du basculeur de reconstitution, afin que le chanteur puisse comparer les deux lectures et faire un choix &#x00E9;clair&#x00E9;.</p>

						<h4 id="learn-u4-try">Essayez dans Ilya.</h4>

						<p>Transcrivez &#x27E8;&#x0445;&#x043E;&#x0440;&#x043E;&#x0448;&#x043E;&#x27E9;. Trois &#x27E8;&#x043E;&#x27E9; identiques produisent trois sons diff&#x00E9;rents&#160;: <code>[&#x028C;]</code>, <code>/&#x0251;/</code>, <code>/o/</code>. Activez ensuite la reconstitution&#160;: le <code>[&#x028C;]</code> &#x00E9;loign&#x00E9; revient &#x00E0; <code>/&#x0251;/</code>, mais aucune voyelle inaccentu&#x00E9;e ne revient &#x00E0; <code>/o/</code>. La porte &#x00E0; sens unique &#x00E0; l&rsquo;&#x0153;uvre.</p>

						<p>Essayez ensuite &#x27E8;&#x0436;&#x0435;&#x043D;&#x0430;&#x27E9; (une &#x00E9;pouse). Sans reconstitution, le &#x27E8;&#x0435;&#x27E9; inaccentu&#x00E9; apr&#x00E8;s le &#x27E8;&#x0436;&#x27E9; toujours dur appara&#x00EE;t comme <code>[&#x0268;]</code>. Dans le panneau du tiroir, sous Notation, activez la reconstitution globale, et <em>Ilya</em> le restaure en <code>[&#x025B;]</code> &mdash; l&rsquo;&#x00E9;cart par rapport &#x00E0; Grayson d&#x00E9;crit ci-dessus. Quels que soient vos param&#x00E8;tres globaux, si vous pr&#x00E9;f&#x00E9;rez la r&#x00E8;gle originale de Grayson, vous pouvez cliquer sur &#x00AB;&#160;R&#x00E9;duction ponctuelle&#160;&#x00BB; ou &#x00AB;&#160;Reconstitution ponctuelle&#160;&#x00BB; sous la pile de mots dans le tiroir (ces intitul&#x00E9;s r&#x00E9;pondent contextuellement &#x00E0; vos param&#x00E8;tres globaux), et votre <code>[&#x0268;]</code> r&#x00E9;appara&#x00EE;tra d&#x00FB;ment.</p>

						<p><em>Source Grayson&#160;: ch. 3 &sect;&sect;3, 5, 7&ndash;8 (pp. 97&ndash;129), ch. 7 &sect;1 (pp. 263&ndash;267). Tableau de reconstitution&#160;: p. 128, note p. 129. Diff&#x00E9;renciation auditive des formes casuelles&#160;: p. 266, n. 306. Cadre accentuel&#160;: Mitton (th&#x00E8;se, &sect;4.5). Note de Kochetov&#160;: communication personnelle, soutenance de r&#x00E9;cital DMA, Universit&#x00E9; de Toronto.</em></p>

						<h3 id="learn-unit-5">Section 5 &middot; Les sons consonantiques</h3>

						<p>Une comparaison de dix auteurs de diction lyrique russe r&#x00E9;v&#x00E8;le une uniformit&#x00E9; remarquable dans la notation de la majorit&#x00E9; des consonnes. Les symboles correspondant aux lettres &#x27E8;b d f g k m n p r s t v x z&#x27E9; font l&rsquo;unanimit&#x00E9;. L&#x00E0; o&#x00F9; les auteurs divergent (sur la lat&#x00E9;rale, sur la nasale palatale, sur les fricatives postalv&#x00E9;olaires), les diff&#x00E9;rences refl&#x00E8;tent des traditions concurrentes plut&#x00F4;t que des erreurs.</p>

						<p>Nous organisons les consonnes &#x00E0; partir de ce que vous savez d&#x00E9;j&#x00E0;, et non selon la relation historique du cyrillique avec d&rsquo;autres syst&#x00E8;mes d&rsquo;&#x00E9;criture, comme le fait Grayson. Les consonnes qui se comportent de mani&#x00E8;re identique &#x00E0; leurs &#x00E9;quivalents viennent en premier. Celles qui sont proches mais pas identiques suivent. Les sons v&#x00E9;ritablement nouveaux arrivent en dernier. En chemin, nous pr&#x00E9;sentons les voyelles iot&#x00E9;es (&#x044F;, &#x0435;, &#x0451;, &#x044E;), les signes mou et dur, et la premi&#x00E8;re rencontre avec la palatalisation comme propri&#x00E9;t&#x00E9; inh&#x00E9;rente de certaines consonnes. La fricative v&#x00E9;laire vois&#x00E9;e <code>[&#x0263;]</code>, la version regressivement vois&#x00E9;e de <code>[x]</code>, fait &#x00E9;galement son apparition ici; il semble que les auteurs qui l&rsquo;incluent dans leur inventaire sont aussi ceux qui se montrent les plus attentifs aux autres aspects nuanc&#x00E9;s de leurs transcriptions.</p>

						<h3 id="learn-unit-6">Section 6 &middot; La palatalisation</h3>

						<p>Le pont entre l&rsquo;inventaire et les processus. Certaines consonnes sont toujours palatalis&#x00E9;es (vous les avez rencontr&#x00E9;es &#x00E0; la Section 5). D&rsquo;autres le deviennent selon leur contexte. L&rsquo;enseignement de la palatalisation comme articulation secondaire appliqu&#x00E9;e &#x00E0; des phon&#x00E8;mes d&#x00E9;j&#x00E0; familiers est une philosophie p&#x00E9;dagogique d&#x00E9;lib&#x00E9;r&#x00E9;e&#160;: le russe ne vous demande pas d&rsquo;apprendre des sons enti&#x00E8;rement nouveaux, mais d&rsquo;ajouter un geste &#x00E0; des sons que vous produisez d&#x00E9;j&#x00E0;.</p>

						<p>Grayson d&#x00E9;crit le processus en trois temps&#160;: &#x00AB;&#160;arch, pronounce, peel&#160;&#x00BB; (cambrer, prononcer, d&#x00E9;coller). Le dos de la langue s&rsquo;arche vers le palais dur en pr&#x00E9;paration, la consonne est prononc&#x00E9;e simultan&#x00E9;ment, puis le dorsum se d&#x00E9;colle du palais. Un exemple simple illustre la diff&#x00E9;rence&#160;: le mot russe <em>&#x043D;&#x0435;&#x0442;</em> (non) se transcrit <code>[&#x0272;&#x025B;t]</code> et non <code>[nj&#x025B;t]</code>. Les trois phon&#x00E8;mes familiers se succ&#x00E8;dent; ce qui a chang&#x00E9; est la nature de la nasale.</p>

						<p>L&rsquo;histoire de la notation de la palatalisation m&#x00E9;rite un d&#x00E9;tour. Avant 1989, l&rsquo;Association phon&#x00E9;tique internationale pr&#x00E9;conisait un sous-ensemble de seize symboles sp&#x00E9;cialis&#x00E9;s int&#x00E9;grant des crochets palataux. L&rsquo;IPA les a abandonn&#x00E9;s lors des r&#x00E9;formes de Kiel, les rempla&#x00E7;ant par le yod en exposant <code>[&#x02B2;]</code> associ&#x00E9; aux symboles consonantiques standard. Parmi les dix auteurs que j&rsquo;ai compar&#x00E9;s, seul Grayson utilise le marqueur de palatalisation approuv&#x00E9; par l&rsquo;API. Les autres r&#x00E9;utilisent des symboles pr&#x00E9;d&#x00E9;finis (demi-anneaux, c&#x00E9;dilles, crochets r&#x00E9;troflexes) qui signifient autre chose dans l&rsquo;usage orthodoxe de l&rsquo;API. Ilya suit Grayson.</p>

						<p>Le sujet connexe du v&#x00E9;laire-i, la voyelle <code>[&#x0268;]</code>, est &#x00E9;galement pr&#x00E9;sent&#x00E9; ici&#160;: une voyelle m&#x00E9;diane, &#x00E0; mi-chemin entre <code>[i]</code> et <code>[u]</code> sur le quadrilat&#x00E8;re vocalique de Jones.</p>

						<h3 id="learn-unit-7">Section 7 · Intégration</h3>

						<p>Ce qui se passe quand les sons se rencontrent : l'assimilation à l'intérieur des mots, aux frontières entre les mots, et à travers les clitiques. Grayson, s'appuyant sur le travail de Derwing et Priestly, pose plusieurs principes pour l'assimilation régressive du voisement dans le russe chanté : la ponctuation stoppe l'assimilation; les sonantes (<code>[l m n r]</code>) et les voyelles n'influencent pas le voisement à travers la frontière du mot; et les phonèmes <code>/v/</code> et <code>/f/</code>, lorsqu'ils sont orthographiés avec un ⟨в⟩, présentent une faiblesse phonémique, n'exerçant aucun pouvoir assimilatif propre tout en étant influencés par les phonèmes adjacents.</p>

						<p>Cette unité aborde les groupes consonantiques, les consonnes muettes, les géminées, et les cas particuliers qui produisent des symboles API inhabituels dans la sortie d'Ilya. Les consonnes doublées en russe chanté sont rares: « les lettres doublées qui représentent des consonnes sont plus souvent lues comme un seul phonème consonantique plutôt que comme une consonne double ou allongée, » note Grayson. À la fin de cette unité, chaque symbole produit par Ilya sera un symbole que vous aurez rencontré et compris.</p>

						<h2 id="learn-try">Essayez</h2>

						<p>Tout au long de LEARN, vous trouverez des invitations à coller un mot ou une phrase dans l'onglet Transcription. LEARN énonce le principe; Ilya le démontre en direct. L'outil devient le laboratoire du module. Lorsque nous discutons de l'accent et des homographes, par exemple, vous pourriez transcrire <em>мука</em> avec l'accent sur la première syllabe, puis sur la seconde, et observer la transcription entière se transformer sous vos yeux. Lorsque nous abordons la réduction vocalique, <em>хорошо</em> offre trois ⟨о⟩ identiques à l'écrit, prononcés de trois manières différentes.</p>

						<h2 id="learn-notation">Note sur la notation</h2>

						<p>La notation phonétique est paradigmatique, non absolue. Une comparaison de dix ressources imprimées de diction lyrique russe révèle dix approches différentes de la notation de la palatalisation seule, et des inventaires vocaliques allant de sept à dix symboles. Les choix API de Grayson représentent un ensemble cohérent et bien raisonné parmi plusieurs. Là où les autorités divergent (sur la transcription de ⟨щ⟩, sur la représentation des nasales palatalisées, sur les symboles de voyelles réduites), les différences reflètent des positions réfléchies, non des erreurs. Les sélecteurs de notation d'Ilya dans l'onglet Transcription rendent ces choix visibles et réversibles : vous pouvez lire à leur sujet ici, puis les voir en action là-bas. Il ne s'agit pas de tribalisme; il s'agit de comprendre les principes sous-jacents aux symboles, afin de prendre des décisions éclairées dans votre propre pratique.</p>

						<hr />

						<p><em>LEARN est une réorganisation pédagogique du travail doctoral de Craig Grayson, préparée avec son consentement. Le contenu est rédigé par Dann Mitton et s'appuie sur sa thèse de doctorat en musique (Université de Toronto) et vingt-cinq ans de pratique et d'enseignement du répertoire de basse d'opéra.</em></p>

						{:else}
						<h1 id="learn-title">Russian Lyric Diction for Singers</h1>

						<p>We begin from a shared foundation. You have studied the International Phonetic Alphabet. You have worked through the lyric diction of English, French, Italian, and German. You know how to read a transcription, and you have developed the physical coordination to produce the sounds those transcriptions describe.</p>

						<p>Russian lyric diction builds on all of that. The sounds of sung Russian are not as distant from what you already know as they may first appear: many of the consonants behave exactly as their counterparts do in the languages you have studied, and the vowel system, while it operates under different rules, is smaller and more orderly than English. What Russian asks of you is not a leap into the unknown but an extension of skills you already possess, guided by a clear and well-documented phonological framework.</p>

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

						<blockquote><p><em>[Score image: Ken Griffiths' Westernised Russian Alphabet Song, arr. Dann Mitton 2017. Bass voice, B♭ major, Moderato (♩ = 72). Presented on a white field at Letter-sized (8.5 × 11″) proportions with standard margins.]</em></p></blockquote>

						<p>Russian children learn the Cyrillic alphabet by rote. This Russian Alphabet Song is a Westernised construct set to the melody of a traditional drinking song. It sets all thirty-three letters in their dictionary order, each sung on its Russian letter-name. The closing phrase offers this pragmatic advice: "To speak Russian you need to learn the alphabet!" Sing through it once or twice in the key that best suits you and you will already have the sequence under your fingers.</p>

						<h4 id="learn-u1-before">Before We Begin</h4>

						<p>A few things worth knowing as we start.</p>

						<p><strong>You already read IPA.</strong> <em>Ilya</em> assumes you have worked with the International Phonetic Alphabet in at least one other sung language. If you can read an Italian, French, or German lyric diction transcription, you already have most of the tools you need. Russian adds a small number of unfamiliar symbols to the system. We explore those later.</p>

						<p><strong>Lyric diction is a stylised register.</strong> Russian audiences expect a certain amount of artifice with their singing, stage work, and poetry. Just as singing "dew" as <code>[djuː]</code> is not how most English speakers talk, sung Russian imposes some stylised pronunciations. Sung Russian is not conversational Russian. Accordingly, Russian lyric diction occupies an elevated register: more precise than speech, shaped by the needs of sustained unamplified vocal production, and grounded in literary and stage pronunciation tradition. Dr. Craig Grayson's <em>Russian Lyric Diction</em> (2012) describes this register systematically, and <em>Ilya</em> operationalises his work for you. When you see an IPA symbol in <em>Ilya</em>, it reflects Grayson's style of notation. When you see the same symbol in his dissertation, it means the same thing. That is the promise.</p>

						<p><strong>Rules describe what Russian does.</strong> Throughout LEARN, we present rules not as laws to memorise but as synthesised descriptions of how Russian behaves. Russian words undergo certain transformations in certain contexts. We name and describe those transformations, offer you examples, and point you to <em>Ilya</em> so you can see them happen in real time with real text. The rules are patterns for you to recognise, not arbitrary statutes to enforce.</p>

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
						<div class="gt-scroll">
						<table class="gt-table">
						<thead>
						<tr>
							<th>Upper<br><span class="gt-col-sub">Serif</span></th>
							<th>Lower<br><span class="gt-col-sub">Serif</span></th>
							<th>Upper<br><span class="gt-col-sub">Sans</span></th>
							<th>Lower<br><span class="gt-col-sub">Sans</span></th>
							<th>Upper<br><span class="gt-col-sub">Serif Italic</span></th>
							<th>Lower<br><span class="gt-col-sub">Serif Italic</span></th>
							<th>Upper<br><span class="gt-col-sub">Sans Oblique</span></th>
							<th>Lower<br><span class="gt-col-sub">Sans Oblique</span></th>
							<th class="gt-cursive-h">Upper<br><span class="gt-col-sub">Cursive</span></th>
							<th class="gt-cursive-h">Lower<br><span class="gt-col-sub">Cursive</span></th>
						</tr>
						</thead>
						<tbody>
							<tr>
								<td class="gt-cell gt-serif">А</td>
								<td class="gt-cell gt-serif">а</td>
								<td class="gt-cell gt-sans">А</td>
								<td class="gt-cell gt-sans">а</td>
								<td class="gt-cell gt-serif-it">А</td>
								<td class="gt-cell gt-serif-it">а</td>
								<td class="gt-cell gt-sans-obl">А</td>
								<td class="gt-cell gt-sans-obl">а</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Б</td>
								<td class="gt-cell gt-serif">б</td>
								<td class="gt-cell gt-sans">Б</td>
								<td class="gt-cell gt-sans">б</td>
								<td class="gt-cell gt-serif-it">Б</td>
								<td class="gt-cell gt-serif-it">б</td>
								<td class="gt-cell gt-sans-obl">Б</td>
								<td class="gt-cell gt-sans-obl">б</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">В</td>
								<td class="gt-cell gt-serif">в</td>
								<td class="gt-cell gt-sans">В</td>
								<td class="gt-cell gt-sans">в</td>
								<td class="gt-cell gt-serif-it">В</td>
								<td class="gt-cell gt-serif-it">в</td>
								<td class="gt-cell gt-sans-obl">В</td>
								<td class="gt-cell gt-sans-obl">в</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Г</td>
								<td class="gt-cell gt-serif">г</td>
								<td class="gt-cell gt-sans">Г</td>
								<td class="gt-cell gt-sans">г</td>
								<td class="gt-cell gt-serif-it">Г</td>
								<td class="gt-cell gt-serif-it gt-hi">г</td>
								<td class="gt-cell gt-sans-obl">Г</td>
								<td class="gt-cell gt-sans-obl gt-hi">г</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Д</td>
								<td class="gt-cell gt-serif">д</td>
								<td class="gt-cell gt-sans">Д</td>
								<td class="gt-cell gt-sans">д</td>
								<td class="gt-cell gt-serif-it">Д</td>
								<td class="gt-cell gt-serif-it">д</td>
								<td class="gt-cell gt-sans-obl">Д</td>
								<td class="gt-cell gt-sans-obl">д</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive gt-hi">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Е</td>
								<td class="gt-cell gt-serif">е</td>
								<td class="gt-cell gt-sans">Е</td>
								<td class="gt-cell gt-sans">е</td>
								<td class="gt-cell gt-serif-it">Е</td>
								<td class="gt-cell gt-serif-it">е</td>
								<td class="gt-cell gt-sans-obl">Е</td>
								<td class="gt-cell gt-sans-obl">е</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ё</td>
								<td class="gt-cell gt-serif">ё</td>
								<td class="gt-cell gt-sans">Ё</td>
								<td class="gt-cell gt-sans">ё</td>
								<td class="gt-cell gt-serif-it">Ё</td>
								<td class="gt-cell gt-serif-it">ё</td>
								<td class="gt-cell gt-sans-obl">Ё</td>
								<td class="gt-cell gt-sans-obl">ё</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ж</td>
								<td class="gt-cell gt-serif">ж</td>
								<td class="gt-cell gt-sans">Ж</td>
								<td class="gt-cell gt-sans">ж</td>
								<td class="gt-cell gt-serif-it">Ж</td>
								<td class="gt-cell gt-serif-it">ж</td>
								<td class="gt-cell gt-sans-obl">Ж</td>
								<td class="gt-cell gt-sans-obl">ж</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">З</td>
								<td class="gt-cell gt-serif">з</td>
								<td class="gt-cell gt-sans">З</td>
								<td class="gt-cell gt-sans">з</td>
								<td class="gt-cell gt-serif-it">З</td>
								<td class="gt-cell gt-serif-it">з</td>
								<td class="gt-cell gt-sans-obl">З</td>
								<td class="gt-cell gt-sans-obl">з</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">И</td>
								<td class="gt-cell gt-serif">и</td>
								<td class="gt-cell gt-sans">И</td>
								<td class="gt-cell gt-sans">и</td>
								<td class="gt-cell gt-serif-it">И</td>
								<td class="gt-cell gt-serif-it">и</td>
								<td class="gt-cell gt-sans-obl">И</td>
								<td class="gt-cell gt-sans-obl">и</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Й</td>
								<td class="gt-cell gt-serif">й</td>
								<td class="gt-cell gt-sans">Й</td>
								<td class="gt-cell gt-sans">й</td>
								<td class="gt-cell gt-serif-it">Й</td>
								<td class="gt-cell gt-serif-it">й</td>
								<td class="gt-cell gt-sans-obl">Й</td>
								<td class="gt-cell gt-sans-obl">й</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">К</td>
								<td class="gt-cell gt-serif">к</td>
								<td class="gt-cell gt-sans">К</td>
								<td class="gt-cell gt-sans">к</td>
								<td class="gt-cell gt-serif-it">К</td>
								<td class="gt-cell gt-serif-it">к</td>
								<td class="gt-cell gt-sans-obl">К</td>
								<td class="gt-cell gt-sans-obl">к</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Л</td>
								<td class="gt-cell gt-serif">л</td>
								<td class="gt-cell gt-sans">Л</td>
								<td class="gt-cell gt-sans">л</td>
								<td class="gt-cell gt-serif-it">Л</td>
								<td class="gt-cell gt-serif-it">л</td>
								<td class="gt-cell gt-sans-obl">Л</td>
								<td class="gt-cell gt-sans-obl">л</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">М</td>
								<td class="gt-cell gt-serif">м</td>
								<td class="gt-cell gt-sans">М</td>
								<td class="gt-cell gt-sans">м</td>
								<td class="gt-cell gt-serif-it">М</td>
								<td class="gt-cell gt-serif-it">м</td>
								<td class="gt-cell gt-sans-obl">М</td>
								<td class="gt-cell gt-sans-obl">м</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Н</td>
								<td class="gt-cell gt-serif">н</td>
								<td class="gt-cell gt-sans">Н</td>
								<td class="gt-cell gt-sans">н</td>
								<td class="gt-cell gt-serif-it">Н</td>
								<td class="gt-cell gt-serif-it">н</td>
								<td class="gt-cell gt-sans-obl">Н</td>
								<td class="gt-cell gt-sans-obl">н</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">О</td>
								<td class="gt-cell gt-serif">о</td>
								<td class="gt-cell gt-sans">О</td>
								<td class="gt-cell gt-sans">о</td>
								<td class="gt-cell gt-serif-it">О</td>
								<td class="gt-cell gt-serif-it">о</td>
								<td class="gt-cell gt-sans-obl">О</td>
								<td class="gt-cell gt-sans-obl">о</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">П</td>
								<td class="gt-cell gt-serif gt-hi">п</td>
								<td class="gt-cell gt-sans">П</td>
								<td class="gt-cell gt-sans gt-hi">п</td>
								<td class="gt-cell gt-serif-it">П</td>
								<td class="gt-cell gt-serif-it">п</td>
								<td class="gt-cell gt-sans-obl">П</td>
								<td class="gt-cell gt-sans-obl">п</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Р</td>
								<td class="gt-cell gt-serif">р</td>
								<td class="gt-cell gt-sans">Р</td>
								<td class="gt-cell gt-sans">р</td>
								<td class="gt-cell gt-serif-it">Р</td>
								<td class="gt-cell gt-serif-it">р</td>
								<td class="gt-cell gt-sans-obl">Р</td>
								<td class="gt-cell gt-sans-obl">р</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">С</td>
								<td class="gt-cell gt-serif">с</td>
								<td class="gt-cell gt-sans">С</td>
								<td class="gt-cell gt-sans">с</td>
								<td class="gt-cell gt-serif-it">С</td>
								<td class="gt-cell gt-serif-it">с</td>
								<td class="gt-cell gt-sans-obl">С</td>
								<td class="gt-cell gt-sans-obl">с</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Т</td>
								<td class="gt-cell gt-serif">т</td>
								<td class="gt-cell gt-sans">Т</td>
								<td class="gt-cell gt-sans">т</td>
								<td class="gt-cell gt-serif-it">Т</td>
								<td class="gt-cell gt-serif-it gt-hi">т</td>
								<td class="gt-cell gt-sans-obl">Т</td>
								<td class="gt-cell gt-sans-obl gt-hi">т</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">У</td>
								<td class="gt-cell gt-serif">у</td>
								<td class="gt-cell gt-sans">У</td>
								<td class="gt-cell gt-sans">у</td>
								<td class="gt-cell gt-serif-it">У</td>
								<td class="gt-cell gt-serif-it">у</td>
								<td class="gt-cell gt-sans-obl">У</td>
								<td class="gt-cell gt-sans-obl">у</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ф</td>
								<td class="gt-cell gt-serif">ф</td>
								<td class="gt-cell gt-sans">Ф</td>
								<td class="gt-cell gt-sans">ф</td>
								<td class="gt-cell gt-serif-it">Ф</td>
								<td class="gt-cell gt-serif-it">ф</td>
								<td class="gt-cell gt-sans-obl">Ф</td>
								<td class="gt-cell gt-sans-obl">ф</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Х</td>
								<td class="gt-cell gt-serif">х</td>
								<td class="gt-cell gt-sans">Х</td>
								<td class="gt-cell gt-sans">х</td>
								<td class="gt-cell gt-serif-it">Х</td>
								<td class="gt-cell gt-serif-it">х</td>
								<td class="gt-cell gt-sans-obl">Х</td>
								<td class="gt-cell gt-sans-obl">х</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ц</td>
								<td class="gt-cell gt-serif">ц</td>
								<td class="gt-cell gt-sans">Ц</td>
								<td class="gt-cell gt-sans">ц</td>
								<td class="gt-cell gt-serif-it">Ц</td>
								<td class="gt-cell gt-serif-it">ц</td>
								<td class="gt-cell gt-sans-obl">Ц</td>
								<td class="gt-cell gt-sans-obl">ц</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ч</td>
								<td class="gt-cell gt-serif">ч</td>
								<td class="gt-cell gt-sans">Ч</td>
								<td class="gt-cell gt-sans">ч</td>
								<td class="gt-cell gt-serif-it">Ч</td>
								<td class="gt-cell gt-serif-it">ч</td>
								<td class="gt-cell gt-sans-obl">Ч</td>
								<td class="gt-cell gt-sans-obl">ч</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ш</td>
								<td class="gt-cell gt-serif">ш</td>
								<td class="gt-cell gt-sans">Ш</td>
								<td class="gt-cell gt-sans">ш</td>
								<td class="gt-cell gt-serif-it">Ш</td>
								<td class="gt-cell gt-serif-it">ш</td>
								<td class="gt-cell gt-sans-obl">Ш</td>
								<td class="gt-cell gt-sans-obl">ш</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Щ</td>
								<td class="gt-cell gt-serif">щ</td>
								<td class="gt-cell gt-sans">Щ</td>
								<td class="gt-cell gt-sans">щ</td>
								<td class="gt-cell gt-serif-it">Щ</td>
								<td class="gt-cell gt-serif-it">щ</td>
								<td class="gt-cell gt-sans-obl">Щ</td>
								<td class="gt-cell gt-sans-obl">щ</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ъ</td>
								<td class="gt-cell gt-serif">ъ</td>
								<td class="gt-cell gt-sans">Ъ</td>
								<td class="gt-cell gt-sans">ъ</td>
								<td class="gt-cell gt-serif-it">Ъ</td>
								<td class="gt-cell gt-serif-it">ъ</td>
								<td class="gt-cell gt-sans-obl">Ъ</td>
								<td class="gt-cell gt-sans-obl">ъ</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ы</td>
								<td class="gt-cell gt-serif">ы</td>
								<td class="gt-cell gt-sans">Ы</td>
								<td class="gt-cell gt-sans">ы</td>
								<td class="gt-cell gt-serif-it">Ы</td>
								<td class="gt-cell gt-serif-it">ы</td>
								<td class="gt-cell gt-sans-obl">Ы</td>
								<td class="gt-cell gt-sans-obl">ы</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ь</td>
								<td class="gt-cell gt-serif">ь</td>
								<td class="gt-cell gt-sans">Ь</td>
								<td class="gt-cell gt-sans">ь</td>
								<td class="gt-cell gt-serif-it">Ь</td>
								<td class="gt-cell gt-serif-it">ь</td>
								<td class="gt-cell gt-sans-obl">Ь</td>
								<td class="gt-cell gt-sans-obl">ь</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Э</td>
								<td class="gt-cell gt-serif">э</td>
								<td class="gt-cell gt-sans">Э</td>
								<td class="gt-cell gt-sans">э</td>
								<td class="gt-cell gt-serif-it">Э</td>
								<td class="gt-cell gt-serif-it">э</td>
								<td class="gt-cell gt-sans-obl">Э</td>
								<td class="gt-cell gt-sans-obl">э</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Ю</td>
								<td class="gt-cell gt-serif">ю</td>
								<td class="gt-cell gt-sans">Ю</td>
								<td class="gt-cell gt-sans">ю</td>
								<td class="gt-cell gt-serif-it">Ю</td>
								<td class="gt-cell gt-serif-it">ю</td>
								<td class="gt-cell gt-sans-obl">Ю</td>
								<td class="gt-cell gt-sans-obl">ю</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr>
								<td class="gt-cell gt-serif">Я</td>
								<td class="gt-cell gt-serif">я</td>
								<td class="gt-cell gt-sans">Я</td>
								<td class="gt-cell gt-sans">я</td>
								<td class="gt-cell gt-serif-it">Я</td>
								<td class="gt-cell gt-serif-it">я</td>
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
								<td class="gt-cell gt-sans">Ѣ</td>
								<td class="gt-cell gt-sans">ѣ</td>
								<td class="gt-cell gt-serif-it">Ѣ</td>
								<td class="gt-cell gt-serif-it gt-hi">ѣ</td>
								<td class="gt-cell gt-sans-obl">Ѣ</td>
								<td class="gt-cell gt-sans-obl">ѣ</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr class="gt-obsolete">
								<td class="gt-cell gt-serif">Ѳ</td>
								<td class="gt-cell gt-serif">ѳ</td>
								<td class="gt-cell gt-sans">Ѳ</td>
								<td class="gt-cell gt-sans">ѳ</td>
								<td class="gt-cell gt-serif-it">Ѳ</td>
								<td class="gt-cell gt-serif-it">ѳ</td>
								<td class="gt-cell gt-sans-obl">Ѳ</td>
								<td class="gt-cell gt-sans-obl">ѳ</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr class="gt-obsolete">
								<td class="gt-cell gt-serif">І</td>
								<td class="gt-cell gt-serif">і</td>
								<td class="gt-cell gt-sans">І</td>
								<td class="gt-cell gt-sans">і</td>
								<td class="gt-cell gt-serif-it">І</td>
								<td class="gt-cell gt-serif-it">і</td>
								<td class="gt-cell gt-sans-obl">І</td>
								<td class="gt-cell gt-sans-obl">і</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
							<tr class="gt-obsolete">
								<td class="gt-cell gt-serif">Ѵ</td>
								<td class="gt-cell gt-serif">ѵ</td>
								<td class="gt-cell gt-sans">Ѵ</td>
								<td class="gt-cell gt-sans">ѵ</td>
								<td class="gt-cell gt-serif-it">Ѵ</td>
								<td class="gt-cell gt-serif-it">ѵ</td>
								<td class="gt-cell gt-sans-obl">Ѵ</td>
								<td class="gt-cell gt-sans-obl">ѵ</td>
								<td class="gt-cell gt-cursive">SVG</td>
								<td class="gt-cell gt-cursive">SVG</td>
							</tr>
						</tbody>
						</table>
						</div>


						<p><em>The glyph table ships at release with print and italic forms populated. Cursive columns are reserved for commissioned artwork in the standard Russian school handwriting (прописи) style, with the connecting hooks (соединения) that distinguish authentic Russian cursive from decorative script fonts.</em></p>

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

						<p><em>Grayson source: Ch. 7 (Syllabic Stress, pp. 263–273), Ch. 2 (pp. 65–66). Baytukalov cited in Grayson p. 273.</em></p>


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
								<tr><td>Palatalized consonant (incl. ⟨ч⟩, ⟨щ⟩)</td><td>Stressed ⟨а⟩ or ⟨я⟩ → [a]</td><td>Palatalized consonant</td><td>пять /pʲ<strong>a</strong>tʲ/</td></tr>
							</tbody>
						</table>

						<p>Counter-example: пятый /ˈpʲɑ tɨj/. The preceding consonant is palatalized (/pʲ/), but the following consonant is hard (/t/). One side soft, one side hard: the vowel stays at /ɑ/. Similarly, мать /mɑtʲ/: the preceding /m/ is hard, so despite the soft /tʲ/ following, the vowel remains /ɑ/.</p>

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

						<h3 id="learn-unit-4">Section 4 &middot; Vowel Reduction</h3>

						<p><strong>When a vowel loses stress, it changes.</strong></p>

						<p>Russian is a stress-timed language, like English. It rolls out in a series of stressed and unstressed syllables, where the interval between stressed syllables stays roughly constant, but unstressed syllables accommodate these regular pulses by both compressing in between them and reducing in vowel specificity. This loss of specificity is called vowel reduction. The vowel loses its distinctiveness by comparison to its default cardinal value, drifting toward a more centralised, less committed sound. In sung Russian, the composer prescribes durations, so the obvious temporal compression of a stress-timed language in spontaneous speech can&rsquo;t manifest: it is controlled instead by the rhythm and speed of the melody. But as storytellers, the qualitative reduction of speech prosody still informs our approach to sung Russian texts. Lyric diction preserves more vowel quality for singing than speech does, yet the principle holds: an unstressed vowel is not the same defined sound as a stressed one.</p>

						<p>Section 3 established the six stressed vowel targets: <code>/&#x0251;/</code>, <code>/&#x025B;/</code>, <code>/i/</code>, <code>/o/</code>, <code>/u/</code>, and <code>[&#x0268;]</code>. Three of them &mdash; <code>/i/</code>, <code>/u/</code>, and <code>[&#x0268;]</code> &mdash; pass through stress unchanged: they retain their cardinal sound whether they are stressed or not. This will appeal to those of us who yearn for dependable rules in sung Russian. The remaining and most commonly-occurring three &mdash; <code>/&#x0251;/</code>, <code>/&#x025B;/</code>, and <code>/o/</code> &mdash; transform when they lose stress. The precise nature of the transformation depends on two factors: the identity of the vowel letter to start, and its proximity to the stressed syllable.</p>

						<p>We catalogue five unstressed vowel sounds in sung Russian:</p>

						<table>
						<thead><tr><th>IPA</th><th>Source</th><th>What it sounds like</th></tr></thead>
						<tbody>
						<tr><td><code>/&#x0251;/</code></td><td>Unstressed &#x27E8;&#x0430;&#x27E9; or &#x27E8;&#x043E;&#x27E9; in privileged positions</td><td>The same open back vowel from Section 3, but without the articulatory commitment of stress.</td></tr>
						<tr><td><code>[&#x028C;]</code></td><td>Unstressed &#x27E8;&#x0430;&#x27E9; or &#x27E8;&#x043E;&#x27E9; in remote positions</td><td>A centralized, relaxed vowel; this is the sung Russian schwa: further back than French <code>[&#x0259;]</code>, without lip rounding. Grayson notates this as <code>[&#x028C;]</code> rather than <code>[&#x0259;]</code> specifically to discourage singers with French training from rounding the sound. <code>[&#x028C;]</code> does not occur in stressed positions: it always signals a reduction.</td></tr>
						<tr><td><code>[&#x026A;]</code></td><td>Unstressed &#x27E8;&#x0435;&#x27E9; or &#x27E8;&#x044F;&#x27E9; after palatalized consonants</td><td>A lax, centralized version of /i/. The only vowel in Grayson&rsquo;s inventory without a cardinal reference on Jones&rsquo; vowel chart. <code>[&#x026A;]</code> does not occur in stressed positions: it always signals a reduction.</td></tr>
						<tr><td><code>/i/</code></td><td>Unstressed &#x27E8;&#x0435;&#x27E9; or &#x27E8;&#x044F;&#x27E9; in interpalatal environments</td><td>The full /i/ from Section 3, fronted by the surrounding palatalized consonants.</td></tr>
						<tr><td><code>[&#x0268;]</code></td><td>Unstressed &#x27E8;&#x0435;&#x27E9; after always-hard consonants (&#x27E8;&#x0436;&#x27E9;, &#x27E8;&#x0448;&#x27E9;, &#x27E8;&#x0446;&#x27E9;)</td><td>The same velar-i from Section 3. These consonants reject palatalization, so the vowel velarizes instead of reducing to <code>[&#x026A;]</code>.</td></tr>
						</tbody>
						</table>

						<p>Two processes govern these reductions. Russian phonology names them <em>akanye</em> /&#x02C8;&#x0251; k&#x028C; &#x0272;&#x026A;/ and <em>ikanye</em> /&#x02C8;i k&#x028C; &#x0272;&#x026A;/.</p>

						<h4 id="learn-u4-akanye">&#x27E8;&#x043E;&#x27E9; and &#x27E8;&#x0430;&#x27E9; follow different paths when unstressed.</h4>

						<p>Akanye is the process by which unstressed &#x27E8;&#x043E;&#x27E9; and &#x27E8;&#x0430;&#x27E9; reduce. The word itself comes from the letter &#x27E8;&#x0430;&#x27E9;: in sung Russian when &#x27E8;&#x043E;&#x27E9; loses stress, it begins to sound like &#x27E8;&#x0430;&#x27E9;. But these two letters do not reduce symmetrically. Their paths diverge in one critical position: the syllable immediately after the stress.</p>

						<table>
						<thead><tr><th>Position relative to stress</th><th>&#x27E8;&#x043E;&#x27E9;</th><th>&#x27E8;&#x0430;&#x27E9;</th></tr></thead>
						<tbody>
						<tr><td>Stressed</td><td><code>/o/</code></td><td><code>/&#x0251;/</code></td></tr>
						<tr><td>Immediately before stress</td><td><code>/&#x0251;/</code></td><td><code>/&#x0251;/</code></td></tr>
						<tr><td>Immediately after stress</td><td><code>[&#x028C;]</code></td><td><code>/&#x0251;/</code></td></tr>
						<tr><td>Two or more syllables before stress</td><td><code>[&#x028C;]</code></td><td><code>[&#x028C;]</code></td></tr>
						<tr><td>Two or more syllables after stress</td><td><code>[&#x028C;]</code></td><td><code>[&#x028C;]</code></td></tr>
						<tr><td>Word-initial (any distance)</td><td><code>/&#x0251;/</code></td><td><code>/&#x0251;/</code></td></tr>
						</tbody>
						</table>

						<p>The asymmetry sits in row three. Immediately after the stress, &#x27E8;&#x043E;&#x27E9; reduces to <code>[&#x028C;]</code>, while &#x27E8;&#x0430;&#x27E9; holds at <code>/&#x0251;/</code>. Grayson&rsquo;s reasoning is aural and semantic: the difference between <code>/&#x0251;/</code> and <code>[&#x028C;]</code> in this position helps the listener distinguish between the two underlying vowel letters, which helps the listener understand the difference between case forms like &#x27E8;&#x0431;&#x043B;&#x044E;&#x0434;&#x043E;&#x27E9; <code>/&#x02C8;bl&#x02B2;u d&#x028C;/</code> (a platter) and &#x27E8;&#x0431;&#x043B;&#x044E;&#x0434;&#x0430;&#x27E9; <code>/&#x02C8;bl&#x02B2;u d&#x0251;/</code> (platters), where the post-stress vowel alone carries the grammatical difference (Grayson, p. 266, fn. 306). Everywhere else, the paths converge.</p>

						<p>Here is an overriding exception. Whenever either unstressed &#x27E8;&#x0430;&#x27E9; or &#x27E8;&#x043E;&#x27E9; is the first letter of the word, they read as <code>/&#x0251;/</code> regardless of how far it sits from the stress.</p>

						<p>The word &#x27E8;&#x0445;&#x043E;&#x0440;&#x043E;&#x0448;&#x043E;&#x27E9; (good, well) demonstrates the complete akanye chain in a single word. Three identical &#x27E8;&#x043E;&#x27E9; letters, three different pronunciations: <code>/x&#x028C; r&#x0251; &#x02C8;&#x0283;o/</code>. The remote first &#x27E8;&#x043E;&#x27E9; reduces to <code>[&#x028C;]</code>. The immediately pre-stress &#x27E8;&#x043E;&#x27E9; holds at <code>/&#x0251;/</code>. The stressed final &#x27E8;&#x043E;&#x27E9; sounds as <code>/o/</code>.</p>

						<h4 id="learn-u4-ikanye">&#x27E8;&#x0435;&#x27E9; and &#x27E8;&#x044F;&#x27E9; reduce toward [&#x026A;].</h4>

						<p>Ikanye is the parallel process for vowels that sit in interpalatal environments, where the vowel is sandwiched on either side by a palatalizing agent. The vowels &#x27E8;&#x0435;&#x27E9; and &#x27E8;&#x044F;&#x27E9; both reduce to <code>[&#x026A;]</code>. Unlike akanye, where position relative to stress creates a hierarchy, ikanye is simpler: these two orthographic vowels reduce to <code>[&#x026A;]</code> in any unstressed position.</p>

						<p>Two refinements qualify this rule:</p>

						<table>
						<thead><tr><th>Condition</th><th>Result</th><th>Why</th></tr></thead>
						<tbody>
						<tr><td>After always-hard consonants (&#x27E8;&#x0436;&#x27E9;, &#x27E8;&#x0448;&#x27E9;, &#x27E8;&#x0446;&#x27E9;)</td><td><code>[&#x0268;]</code>, not <code>[&#x026A;]</code></td><td>The three consonants in the always-hard set cannot palatalize. Instead, the vowel velarizes to match the hard consonant environment.</td></tr>
						<tr><td>Interpalatal (palatalized on both sides)</td><td><code>/i/</code>, not <code>[&#x026A;]</code></td><td>The surrounding palatalized consonants front the vowel fully to /i/.</td></tr>
						</tbody>
						</table>

						<p>Iotated vowels (&#x27E8;&#x0435;&#x27E9;, &#x27E8;&#x0451;&#x27E9;, &#x27E8;&#x044E;&#x27E9;, and &#x27E8;&#x044F;&#x27E9;) follow the same logic. Unstressed &#x27E8;&#x044F;&#x27E9; in j-cluster position (word-initial, after a vowel, or after a sign) produces <code>[j&#x026A;]</code>; interpalatally, it will front to <code>[ji]</code>. Grayson is explicit that the reduced cluster <code>[j&#x028C;]</code> should be avoided in sung Russian.</p>

						<h4 id="learn-u4-reconstitution">Reconstitution is an informed choice, not an obligation.</h4>

						<p>Reconstitution is the decision to undo full reduction, or to return a reduced vowel partway toward its unreduced value. In singing, where note values can sustain a vowel well beyond its spoken duration, a fully-reduced sound can feel too informal to sing as a sustained vowel value for the delivery of poetic text. Reconstitution gives the singer a principled option to restore formality and vowel distinction without abandoning Grayson&rsquo;s phonological system.</p>

						<p>The process reverses the reduction chain entirely for most vowels, but only partway for &#x27E8;&#x043E;&#x27E9;:</p>

						<table>
						<thead><tr><th>Reduced sound</th><th>Reconstitutes to</th><th>Does not reconstitute to</th></tr></thead>
						<tbody>
						<tr><td><code>[&#x028C;]</code> (from &#x27E8;&#x0430;&#x27E9; or &#x27E8;&#x043E;&#x27E9;)</td><td><code>/&#x0251;/</code></td><td>/o/ &mdash; the door to /o/ is one-way</td></tr>
						<tr><td><code>[&#x026A;]</code> (from &#x27E8;&#x0435;&#x27E9;)</td><td><code>/&#x025B;/</code></td><td>&mdash;</td></tr>
						<tr><td><code>[&#x026A;]</code> (from &#x27E8;&#x044F;&#x27E9;)</td><td><code>/&#x0251;/</code></td><td>&mdash;</td></tr>
						<tr><td><code>[j&#x026A;]</code> (from &#x27E8;&#x044F;&#x27E9; in j-cluster)</td><td><code>/j&#x0251;/</code></td><td>&mdash;</td></tr>
						<tr><td><code>[j&#x026A;]</code> (from &#x27E8;&#x0435;&#x27E9; in j-cluster)</td><td><code>/j&#x025B;/</code></td><td>&mdash;</td></tr>
						<tr><td><code>[&#x0268;]</code> (after always-hard consonants)</td><td>Does not reconstitute</td><td>&mdash;</td></tr>
						</tbody>
						</table>

						<p>The one-way door is the most important constraint. When <code>[&#x028C;]</code> reconstitutes, it returns to <code>/&#x0251;/</code>, never to <code>/o/</code>. The reduction from <code>/o/</code> to <code>/&#x0251;/</code> erases the rounding; reconstitution cannot restore what akanye has removed. Grayson asserts that <code>[&#x0268;]</code> after always-hard consonants does not reconstitute at all: the velarized environment is fixed.</p>

						<blockquote class="learn-callout">
						<p><strong>A note of respectful disagreement from Dann.</strong></p>
						<p>Grayson writes that &ldquo;&#x27E8;&#x0438;&#x27E9; read as [&#x0268;] (stressed or unstressed) and unstressed &#x27E8;&#x0435;&#x27E9; read as [&#x0268;] after a hard consonant (on long or short notes), remain sung as [&#x0268;]&rdquo; (p. 129). This sentence contains two claims, and in my opinion, they are not equivalent.</p>
						<p>The first claim is sound. When &#x27E8;&#x0438;&#x27E9; follows a hard consonant, the resulting [&#x0268;] is not a reduction: it is the vowel&rsquo;s identity in that environment. Russians know and understand that in this instance &#x27E8;&#x0438;&#x27E9; is pronounced [&#x0268;], or perhaps we can understand it as [&#x0268;] being spelled &#x27E8;&#x0438;&#x27E9; in this case; they amount to the same outcome. There is no source vowel to reconstitute to, it is simply the traditional vowel that is performed in this circumstance, acknowledging that [&#x0268;] must follow an unpalatalized consonant, never [i]. The hard consonant forces the expression of the velar-i. I agree with Grayson here; reconstitution does not apply.</p>
						<p>I believe his second claim warrants reconsideration. When unstressed &#x27E8;&#x0435;&#x27E9; follows one of the always-hard consonants (&#x27E8;&#x0436;&#x27E9;, &#x27E8;&#x0448;&#x27E9;, &#x27E8;&#x0446;&#x27E9;) to produce [&#x0268;], the underlying vowel is /&#x025B;/. /&#x025B;/ reduces to become [&#x0268;] in this case, and therefore the logic of reconstitution should still apply. I assert that on sustained notes or in slow(er) tempi, the singer can return (reconstitute) toward [&#x025B;]. In my experience, native Russian speakers and coaches consistently advocate this choice. Dr. Alexei Kochetov, a native Russian speaker and phonetician at the University of Toronto, offered precisely this note on my performance of Kabalevsky&rsquo;s Op. 52, no. 2: &ldquo;[toj &#x0292;&#x0268;] should probably be [toj &#x0292;&#x025B;] (with no reduction).&rdquo;</p>
						<p>Perhaps an articulatory argument can support reconstitution in this case? The tongue postures of [&#x025B;] and the always-hard consonants [&#x0283;], [&#x0292;], and [ts] occupy the same medial neighbourhood; [&#x025B;] is not fronted enough to impose a conflict. This is not analogous to attempting /i/ after a hard consonant, where the fronting genuinely contradicts the consonant environment.</p>
						<p>This is the single point on which <em>Ilya</em> departs from Grayson&rsquo;s reconstitution rules. When the reconstitution toggle is active, unstressed &#x27E8;&#x0435;&#x27E9; after an always-hard consonant reconstitutes to [&#x025B;]. Nevertheless, if you disagree with me and wish to observe Grayson&rsquo;s commitment to the inviolability of [&#x0268;] in this case, you can click the &ldquo;Spot reduction&rdquo; checkbox under the Word Stack in the Drawer and your [&#x0268;] will dutifully reappear.</p>
						</blockquote>

						<p>When to reconstitute is a matter of context and taste. A short note on a weak beat in a brisk tempo may welcome full reduction. A sustained note on a strong beat in a slow tempo may call for reconstitution. Russians seem to expect less reduction in the delivery of poetic texts, perhaps as a means of setting art apart from quotidian speech. The singer&rsquo;s best confirmation comes from a native Russian coach; Ilya offers both options through the reconstitution toggle, so the singer can compare the two readings and make an informed choice.</p>

						<h4 id="learn-u4-try">Try this in Ilya.</h4>

						<p>Transcribe &#x27E8;&#x0445;&#x043E;&#x0440;&#x043E;&#x0448;&#x043E;&#x27E9;. Three identical &#x27E8;&#x043E;&#x27E9; letters produce three different sounds: <code>[&#x028C;]</code>, <code>/&#x0251;/</code>, <code>/o/</code>. Then toggle reconstitution on: the remote <code>[&#x028C;]</code> returns to <code>/&#x0251;/</code>, but neither unstressed vowel returns to <code>/o/</code>. The one-way door at work.</p>

						<p>Then try &#x27E8;&#x0436;&#x0435;&#x043D;&#x0430;&#x27E9; (a wife). With reconstitution off, the unstressed &#x27E8;&#x0435;&#x27E9; after always-hard &#x27E8;&#x0436;&#x27E9; appears as <code>[&#x0268;]</code>. On the Drawer panel under Notation, toggle global reconstitution on, and <em>Ilya</em> restores it to <code>[&#x025B;]</code> &mdash; the departure from Grayson described above. Regardless of your global settings, if you prefer Grayson&rsquo;s original rule, you can click &ldquo;Spot reduction&rdquo; or &ldquo;Spot reconstitution&rdquo; under the Word Stack in the Drawer (these labels respond contextually to your global settings), and your <code>[&#x0268;]</code> will dutifully reappear.</p>

						<p><em>Grayson source: Ch. 3 &sect;&sect;3, 5, 7&ndash;8 (pp. 97&ndash;129), Ch. 7 &sect;1 (pp. 263&ndash;267). Reconstitution chart: p. 128, note p. 129. Aural differentiation of case forms: p. 266, fn. 306. Stress-timing framework: Mitton (dissertation, &sect;4.5). Kochetov correction: personal communication, DMA recital adjudication, University of Toronto.</em></p>

						<h3 id="learn-unit-5">Section 5 &middot; The Consonant Sounds</h3>

						<p>A comparison of ten Russian lyric diction authors reveals a remarkable uniformity in the notation of the majority of consonants. The symbols corresponding to the letterforms &#x27E8;b d f g k m n p r s t v x z&#x27E9; are unanimous across all ten sources. Where the authors diverge (on the lateral approximant, on the palatal nasal, on the postalveolar fricatives), the differences reflect competing traditions rather than errors.</p>

						<p>We organise the consonants by what you already know, rather than by the historical relationship of Cyrillic to other writing systems as Grayson does. Consonants that behave identically to their counterparts come first. Consonants that are close but not identical come next. Genuinely unfamiliar sounds come last. Along the way, we introduce the iotated vowels (&#x044F;, &#x0435;, &#x0451;, &#x044E;), the soft and hard signs, and the first encounter with palatalization as an inherent property of certain consonants. The voiced velar fricative <code>[&#x0263;]</code>, the regressively voiced version of <code>[x]</code>, also makes its appearance here; there seems to be a correspondence between sources that include it and those that are also thoughtful about other nuanced aspects of their transcriptions.</p>

						<h3 id="learn-unit-6">Section 6 &middot; Palatalization</h3>

						<p>The bridge between inventory and process. Some consonants are always palatalized (you met them in Section 5). Others become palatalized depending on their context. Teaching palatalization as a secondary articulation applied to already-familiar phonemes is a deliberate pedagogical philosophy: Russian does not ask you to learn entirely new sounds, but to add a gesture to sounds you already produce.</p>

						<p>Grayson describes the process in three steps: &ldquo;arch, pronounce, peel.&rdquo; The body of the tongue arches toward the hard palate in preparation, the consonant is simultaneously pronounced, and the dorsum peels away from the palate. A simple example illustrates the difference: the Russian word <em>&#x043D;&#x0435;&#x0442;</em> (no) is transcribed <code>[&#x0272;&#x025B;t]</code>, not <code>[nj&#x025B;t]</code>. Three familiar phonemes in sequence; what has changed is the nature of the nasal.</p>

						<p>The history of palatalization notation deserves a brief excursion. Before 1989, the International Phonetic Association advocated a specialised subset of sixteen symbols incorporating palatalization hooks. The IPA discontinued these at the Kiel Convention, replacing them with the superscript yod <code>[&#x02B2;]</code> paired with standard consonant symbols. Among the ten authors I compared, Grayson alone uses the IPA-approved palatalization marker. The others repurpose predefined symbols (subscript half-rings, cedillas, retroflex hooks) that mean something else in orthodox IPA usage. This widespread repurposing demands attentive reinterpretation for anyone encountering these singers&rsquo; transcriptions. Ilya follows Grayson.</p>

						<p>The companion topic of velar-i, the vowel <code>[&#x0268;]</code>, is introduced here as well: a medial vowel, halfway between <code>[i]</code> and <code>[u]</code> on Jones&rsquo; vowel quadrilateral.</p>

						<h3 id="learn-unit-7">Section 7 · Integration</h3>

						<p>What happens when sounds meet each other: assimilation within words, across word boundaries, and through the clitics. Grayson, drawing on the work of Derwing and Priestly, lays out several governing principles for the regressive assimilation of voicing in sung Russian: punctuation stops assimilation; sonorants (<code>[l m n r]</code>) and vowels do not influence voicing across the word boundary; and the phonemes <code>/v/</code> and <code>/f/</code>, when spelled with a ⟨в⟩, exhibit phonemic weakness, exerting no assimilative power of their own while being influenced by adjacent phonemes.</p>

						<p>This unit addresses consonant clusters, silent letters, geminates, and the special cases that produce unfamiliar IPA symbols in Ilya's output. Doubled consonants in sung Russian are rare: "Doubled letters that represent consonants are more often read as a single consonant phoneme rather than as a double or elongated consonant," Grayson notes. By the end of this unit, every symbol Ilya produces will be one you have encountered and understood.</p>

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

						<h4>Que fait Ilya ?</h4>

						<p><em>Ilya</em> poursuit un double objectif : ouvrir l'accès au corpus du russe chanté, et éduquer.</p>

						<p><em>Ilya</em> équipe les chanteurs de transcriptions vérifiables et précises de textes russes chantés, supprimant ainsi la barrière qui défend le répertoire vocal russe classique des artistes non russophones qui souhaiteraient l'interpréter. <em>Ilya</em> dissipe la mystique en offrant un accès pratique et généralisé à la prononciation du russe chanté. <em>Ilya</em> automatise la transcription de textes russes cyrilliques en symboles de l'Alphabet phonétique international (API), selon une méthode conçue par Craig Grayson.</p>

						<p><em>Ilya</em> propose également des leçons claires et vérifiables par des tiers sur son propre fonctionnement. Les utilisateurs peuvent progresser à travers une série de leçons séquencées qui expliquent en profondeur comment <em>Ilya</em> parvient à ses résultats, qu'ils soient familiers ou inattendus. Le module LEARN s'adresse aux utilisateurs qui apprécient la commodité d'<em>Ilya</em>, mais qui recherchent aussi un degré supérieur d'indépendance et d'aisance avec les textes cyrilliques.</p>

						<h4>Que se passe-t-il lorsque je saisis un texte russe ?</h4>

						<p><em>Ilya</em> fait ce que nous pouvons apprendre à faire manuellement, mais beaucoup plus vite. Il met à jour et normalise automatiquement l'orthographe, recherche l'accent tonique, détermine comment cet accent affecte les voyelles environnantes, applique les règles de voisement et de dévoisement des consonnes, propose une consultation du dictionnaire pour le sens, et produit trois lignes de contenu dans un format familier : ligne supérieure en API, ligne médiane en texte cyrillique source, et ligne inférieure en glose de traduction minimale. Ces transcriptions méritent un examen approfondi tout en restant lisibles d'un coup d'œil. Les utilisateurs peuvent exporter des PDF comme copies papier ou les conserver pour une étude ultérieure. <em>Ilya</em> ne sauvegarde pas les transcriptions, ne conservant entre les sessions que le travail en cours. <em>Ilya</em> est un outil savant actif destiné à la performance classique et à l'enseignement, pas un dépôt de transcriptions ni une maison d'édition.</p>

						<h4>Pourquoi Ilya ne suit-il qu'une seule source ?</h4>

						<p>Les origines d'<em>Ilya</em> ne sont pas aveugles à l'ensemble plus large des ressources en diction lyrique russe. Après avoir parcouru toute la littérature de diction lyrique russe à ses débuts, celle de Grayson était la seule ressource à centrer de manière satisfaisante l'attribution savante et la vérifiabilité par des tiers. D'autres sources reposent sur leur expérience pratique heuristique ou sur des connaissances reçues et une tradition orale et aurale, mais Grayson conçoit une mécanique finie pour ces transformations. C'est un pont qui donne à l'étudiant la capacité d'aborder n'importe quel texte cyrillique russe. L'ouvrage de Grayson était la seule source suffisamment robuste pour prioriser l'autonomie croissante de l'utilisateur, plutôt que de préconiser un modèle où l'utilisateur reste limité par la disponibilité de ressources imprimées donnant accès à un sous-ensemble fini du répertoire vocal russe. La méthode de Grayson permet à <em>Ilya</em> de traiter n'importe quel texte, produisant des résultats chantables dans un format que les étudiants en chant d'aujourd'hui sont formés à utiliser et à comprendre.</p>

						<h4>Ilya est-il un outil d'IA ?</h4>

						<p>Non. <em>Ilya</em> est fondé sur des règles, ce qui le rend déterministe : même entrée, même sortie, à chaque fois. La base de règles d'<em>Ilya</em> fonctionne que vous soyez connecté à l'internet ou non. C'est l'opérationnalisation de la thèse de Grayson, <em>Russian Lyric Diction</em> (University of Washington, 2012). Et en tant que moteur de transcription fondé sur des règles, les résultats d'<em>Ilya</em> seront toujours justifiables par une règle de diction lyrique russe méticuleusement citée, couverte dans le module LEARN.</p>

						<h4>Quel est mon rôle en tant qu'utilisateur ?</h4>

						<p>L'utilisateur est le créateur de la transcription. <em>Ilya</em> est l'outil avec lequel il la réalise. Les utilisateurs sont responsables de la vérification des accents toniques inconnus, de la désambiguïsation des homographes qui surviennent, de la sélection de leurs préférences de notation si elles divergent de celles que préconise Grayson, et de la décision de recourir à la réduction vocalique généralisée ou à la reconstitution pour les passages soutenus. Les utilisateurs apporteront les transcriptions réalisées avec <em>Ilya</em> à leurs séances de coaching et à leurs répétitions, d'où la version mobile, mais <em>Ilya</em> offre la meilleure expérience sur ordinateur de bureau pour une flexibilité maximale. Les transcriptions produites avec <em>Ilya</em> méritent une étude approfondie au fauteuil. Ce sont, très littéralement, des instructions chorégraphiques pour le tractus vocal. L'utilisateur est l'artiste qui les incarne.</p>

						<h4>Quelles sont les limites d'Ilya ?</h4>

						<p><em>Ilya</em> ne comprend pas le contexte, si bien que les gloses du dictionnaire pour les homographes paraissent parfois absurdes ou déroutantes. L'utilisateur résout cela en consultant la définition complète offerte dans le bloc de transcription d'analyse du tiroir et en sélectionnant une glose qui restitue le bon sens. <em>Ilya</em> ne peut pas vous empêcher d'imposer un accent tonique incorrect ou d'écraser de bonnes informations par de mauvaises. Il ne peut pas réorganiser la syntaxe de vers poétiques rendus obscurs par une traduction mot à mot. Et il ne peut pas préparer la сельдь под шубой, fort heureusement.</p>

						<h4>Où va Ilya ?</h4>

						<p><em>Ilya</em> offre déjà un composant OCR permettant de photographier du texte cyrillique qu'<em>Ilya</em> analyse et traite normalement. Étendre la portée savante d'<em>Ilya</em> pourrait inclure des fonctions d'accessibilité améliorées, ou la rétro-ingénierie de la manière dont d'autres autorités en diction lyrique russe parviennent à leurs transcriptions caractéristiques, afin d'offrir des transcriptions comparatives « à la manière de » grands noms de la diction lyrique russe dont les résultats diffèrent de Grayson. L'objectif n'est pas d'affirmer la supériorité de Grayson sur des modèles plus anciens, mais plutôt d'utiliser la comparaison directe pour mettre en évidence les points de divergence, permettant aux utilisateurs de repérer les enjeux phonologiques les plus significatifs. <em>Ilya</em> pourrait servir de modèle pour une série d'applications de transcription de nouvelle génération centrées sur l'allemand, l'anglais, l'arabe, le coréen, l'espagnol, le finnois, le français, l'italien, le mandarin, le suédois ou le swahili chantés. Parce qu'<em>Ilya</em> est libre et à code ouvert, les améliorations qu'il connaîtra ne sont limitées que par l'intérêt de ses utilisateurs et leur capacité à enrichir <em>Ilya</em> de modernisations significatives au fil du temps.</p>

						{:else}
						<h1>Guide</h1>

						<h2 id="guide-how">How Ilya Works</h2>

						<h4>What does Ilya do?</h4>

						<p><em>Ilya</em> has twin purposes: to enable, and to educate.</p>

						<p><em>Ilya</em> equips singers with verifiable, accurate IPA transcriptions of sung Russian texts, effectively removing the barrier imposed between classic Russian vocal repertoire and the body of non-native artists who would love to perform it. <em>Ilya</em> obviates a lack of literacy in Cyrillic, and dispels mystique by providing convenient, widespread access to how sung Russian is pronounced. <em>Ilya</em> automates transcriptions of Russian Cyrillic source texts into International Phonetic Symbols, following a method devised by Craig Grayson.</p>

						<p><em>Ilya</em> also offers straightforward, third-party-verifiable lessons in how it does what it does. Users can progress through a series of sequenced lessons that explain in depth how <em>Ilya</em> arrives at familiar and unfamiliar output. The LEARN module is for users who appreciate the convenience <em>Ilya</em> provides, but who also seek a higher degree of independence and fluency with Cyrillic texts.</p>

						<h4>What happens when I paste a Russian text?</h4>

						<p><em>Ilya</em> does what we can learn to do manually, but much faster. It automatically updates and normalises spelling, looks up stress, decides how that stress affects surrounding vowels, applies consonant voicing and devoicing rules, offers a dictionary lookup for meaning, and outputs three rows of output formatted in familiar stacks: top line IPA, middle line Cyrillic source text, and bottom line minimal translation gloss. These transcriptions are worthy of inspection, yet still communicative at a glance. Users may export PDFs for use as hardcopies or to preserve for ongoing study. <em>Ilya</em> does not save transcriptions, retaining between sessions only current work that is underway. <em>Ilya</em> is an active scholarly tool designed to assist teachers and performing artists, not a publishing clearinghouse or transcription library.</p>

						<h4>Why does Ilya follow only one source?</h4>

						<p><em>Ilya</em>'s origins are not blind to the greater pool of Russian lyric diction resources. After searching the entire Russian lyric diction literature at its inception, Grayson's was the only resource to satisfactorily centre scholarly attribution and third-party verifiability. Other sources rest on their heuristic work experience or received knowledge and oral/aural tradition, but Grayson devises a finite mechanic for these transformations. It is a bridge that equips the student with the ability to access any Russian Cyrillic text. Grayson's work was the only source robust enough to prioritize the user's growing independence, rather than advocating a model where the user remains limited by the availability of print resources that unlock a finite subset of Russian vocal literature. Grayson's method allows <em>Ilya</em> to process any text at all, yielding singable results in a format that today's institutional voice students are trained to use and understand.</p>

						<h4>Is Ilya an AI tool?</h4>

						<p>No. <em>Ilya</em> is rule-based, which means it is deterministic: same input, same output, every time. <em>Ilya</em>'s rule base will work whether you are connected to the internet or not. It is the operationalization of Grayson's dissertation, <em>Russian Lyric Diction</em> (University of Washington, 2012). And as a rule-based transcription engine, <em>Ilya</em>'s output will always be justifiable through a meticulously cited rule of Russian lyric diction covered in the LEARN module.</p>

						<h4>What is my role as the user?</h4>

						<p>The user is the creator of the transcription. <em>Ilya</em> is the tool they make it with. Users are responsible for verifying unknown stress, for disambiguating homographs that arise, for selecting their notation preferences if they diverge from the ones Grayson advocates, and for deciding whether a passage will feature widespread vowel reduction or reconstitution for sustained passages. Users will bring the transcriptions they make with <em>Ilya</em> to their coaching sessions and rehearsals, so the tool has a mobile version, but <em>Ilya</em> is best experienced on desktop for the greatest flexibility. The transcriptions produced with <em>Ilya</em> are worthy of intense armchair study. These transcriptions are quite literally choreography instructions for the vocal tract. The user is the artist who embodies these instructions.</p>

						<h4>What are Ilya's limitations?</h4>

						<p><em>Ilya</em> cannot understand context, so sometimes dictionary glosses for homographs look absurd or confusing. The user solves this by investigating the full definition offered in the Drawer's Analysis Word Stack and selecting a gloss that conveys the right meaning. <em>Ilya</em> cannot stop you from imposing incorrect stress or overwriting good information with bad. It cannot reorganise the syntax of poetic lines garbled as word-for-word translations. And it cannot make сельдь под шубой, thank goodness.</p>

						<h4>Where is Ilya headed?</h4>

						<p><em>Ilya</em> already offers an OCR component where users can photograph Cyrillic text that <em>Ilya</em> parses and processes like normal. Extending <em>Ilya</em>'s future scholarly reach might include improved accessibility features, or reverse-engineering how other Russian lyric authorities arrive at their signature transcriptions, to offer comparative transcriptions "in the style of" Russian lyric diction greats whose output differs from Grayson. The hope is not to assert Grayson's superiority over older models, but rather to use direct comparison to highlight points of divergence in transcription, allowing users to register the phonological issues that matter most. <em>Ilya</em> could be the model template for a series of robust next-gen transcription apps centring sung Arabic, English, Finnish, French, German, Italian, Korean, Mandarin, Spanish, Swedish, or Swahili. Because <em>Ilya</em> is free and open source, the improvements it will undergo are limited only by the interest of its users and their ability to enhance <em>Ilya</em> with meaningful modernisations over time.</p>

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
		background: #f0dbb8;
		border: 1.5px solid #d4a843;
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

	:global(.gt-hi) {
		background: #f0dbb8 !important;
		box-shadow: inset 0 0 0 1.5px #d4a843;
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
		background-color: #E5E7E3;
	}
	.main-content {
		flex: 1;
		overflow-y: auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #E5E7E3;
		transform: translateX(0);
		transition: transform 2000ms cubic-bezier(0.25, 0, 0.15, 1);
	}

	/* ── Transcription mode: Paper yields gently rightward when drawer is open ── */
	.main-content.drawer-open:not(.reading-mode) {
		transform: translateX(20px);
	}

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
	/* ── LEARN callout box (scholarly disagreement) ────────── */
	:global(.learn-callout) {
		border: 1px solid var(--sage, #8B9A7D);
		background: #f5f3ef;
		padding: 1.25rem 1.5rem;
		margin: 1.5rem 0;
		border-radius: 2px;
		font-size: 0.92em;
	}
	:global(.learn-callout p:last-child) {
		margin-bottom: 0;
	}
	/* ── Placeholder content within ReadingPaper ──────────── */
	.placeholder-content {
		text-align: center;
		padding: 4rem 0;
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
			transform: none;
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
