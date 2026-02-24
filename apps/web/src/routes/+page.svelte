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

						<blockquote><p><em>[Espace réservé : tableau de 37 lettres. Chaque lettre présentée dans une grille de cellules carrées selon les formes suivantes :]</em></p></blockquote>

						<table>
						<thead><tr><th>Forme</th><th>Police</th><th>Usage</th></tr></thead>
						<tbody>
						<tr><td>Majuscule imprimée</td><td>Sérif (p. ex. Noto Serif)</td><td>Sous-textes de partitions</td></tr>
						<tr><td>Minuscule imprimée</td><td>Sérif</td><td>Sous-textes de partitions</td></tr>
						<tr><td>Majuscule imprimée</td><td>Sans sérif</td><td>Typographie contemporaine</td></tr>
						<tr><td>Minuscule imprimée</td><td>Sans sérif</td><td>Typographie contemporaine</td></tr>
						<tr><td>Majuscule italique</td><td>Sérif italique</td><td>Ressources imprimées tierces</td></tr>
						<tr><td>Minuscule italique</td><td>Sérif italique</td><td>Ressources imprimées tierces</td></tr>
						<tr><td>Majuscule italique</td><td>Sans sérif italique</td><td>Ressources imprimées tierces</td></tr>
						<tr><td>Minuscule italique</td><td>Sans sérif italique</td><td>Ressources imprimées tierces</td></tr>
						<tr><td>Majuscule cursive</td><td>SVG propisi commandé</td><td>Textes manuscrits, culture écrite</td></tr>
						<tr><td>Minuscule cursive</td><td>SVG propisi commandé</td><td>Textes manuscrits, culture écrite</td></tr>
						</tbody>
						</table>

						<p><em>Le tableau des glyphes est livré au lancement avec les formes imprimées et italiques. Les colonnes cursives sont réservées à des illustrations commandées dans le style d'écriture scolaire russe standard (прописи), avec les crochets de liaison (соединения) qui distinguent la cursive russe authentique des polices de script décoratives.</em></p>

						<p>La raison de présenter chaque lettre sous plusieurs formes est de garantir que, peu importe où vous rencontreriez une lettre, vous pourriez la reconnaître. Les chanteurs rencontrent le cyrillique dans les partitions imprimées (souvent en sérif), dans les éditions contemporaines (souvent en sans sérif), dans les ressources savantes (souvent en italique), et occasionnellement dans des annotations manuscrites ou des manuscrits historiques (cursive). Remarquez à quel point certaines formes de lettres changent radicalement entre les versions régulière, italique et cursive.</p>

						<h4 id="learn-u1-try">Essayez</h4>

						<p>Ouvrez l'onglet Transcription d'<em>Ilya</em> et collez un court texte russe. Vous pourriez essayer l'ouverture de «&nbsp;Где ты, звёздочка?&nbsp;» de Moussorgski ou quelques vers de n'importe quelle mélodie de votre répertoire.</p>

						<p>Observez les trois lignes qu'<em>Ilya</em> produit : API, cyrillique et glose de traduction. Vous pouvez déjà commencer à faire correspondre ce que vous voyez dans la ligne API aux ancrages que vous venez d'apprendre ici. Certaines lettres se seront transformées : un ⟨О⟩ non accentué peut apparaître comme <code>[ʌ]</code> plutôt que le <code>[o]</code> que vous avez rencontré dans le tableau ci-dessus. Une consonne devant ⟨Е⟩ peut porter un marqueur de palatalisation, <code>[ʲ]</code>, qui n'était pas encore démontré dans l'ancrage.</p>

						<p>Ces transformations font l'objet des Sections 2 à 7. Pour l'instant, remarquez tout simplement que l'alphabet cyrillique russe est fini, et pourtant l'API vous est familier. <em>Ilya</em> peut vous montrer exactement ce qu'il fait à chaque lettre. Le reste de LEARN vous enseigne pourquoi.</p>

						<p><em>Sources :</em> Craig M. Grayson, «&nbsp;Russian Lyric Diction&nbsp;» (thèse de doctorat, University of Washington, 2012), ch. 2, annexes B et D. Ken Griffiths, Russian Alphabet Song, arr. Dann Mitton (2017). Irena Yanushevskaya et Daniel Bunčić, «&nbsp;Russian,&nbsp;» <em>Journal of the International Phonetic Association</em> 45/2 (2015).</p>

						<h3 id="learn-unit-2">Unité 2 · L'accent tonique</h3>

						<h4 id="learn-u2-rhythm">Rythme accentuel et l'avantage du chanteur</h4>

						<p>Le concept de types rythmiques linguistiques, proposé par Pike en 1945 et abondamment débattu depuis, repose sur une distinction binaire utile : les langues sont soit accentuelles, soit syllabiques. Cette dichotomie est simplifiée (les chercheurs peinent à en produire une preuve empirique constante, et certaines langues résistent à ces classifications nettes), mais elle demeure utile pour les chanteurs parce qu'elle met des mots sur des aspects du langage que nous percevons intuitivement sans toujours pouvoir les nommer.</p>

						<p>Les langues syllabiques comme le français et le coréen accordent à leurs syllabes une durée théoriquement égale, ainsi qu'une réalisation de voyelles distinctes. Les mises en musique de textes en langues syllabiques exploitent cette égalité syllabique inhérente avec une exigence accrue de legato. C'est certainement plausible pour le français chanté et son célèbre style soutenu.</p>

						<p>Les langues accentuelles comme l'anglais, l'allemand et le russe fonctionnent différemment. L'intervalle entre les syllabes accentuées établit une pulsation rythmique dans laquelle les syllabes inaccentuées s'inscrivent. Cela produit deux effets que tout chanteur a déjà expérimentés dans le répertoire anglais et allemand : même dans les passages legato, les syllabes inaccentuées reçoivent moins d'intensité et d'engagement articulatoire que leurs homologues accentuées, et les voyelles inaccentuées subissent une réduction (centralisation) vers une qualité centralisée. Dans la parole, ces différences se manifestent par des contrastes de durée littéraux; dans le chant, le compositeur prescrit le rythme, mais le chanteur communique le poids de l'accent par des micro-ajustements intentionnels, ou automatiques, d'intensité et d'engagement articulatoire à l'intérieur des valeurs rythmiques écrites sur la page. Nous l'entendons dans l'anglais chanté « behold » <code>[bɪ.ˈhoʊld]</code>, où la première syllabe se réduit de <code>[i]</code> vers le <code>[ɪ]</code> plus central. Les deux syllabes inaccentuées de l'allemand chanté « gekommen » <code>[ɡə.ˈkɔm.mən]</code> sont effectivement des <em>schwa</em> réduits.</p>

						<p>Le russe suit le même schéma, mais avec une systématisation plus poussée. Les voyelles accentuées du russe chanté reçoivent davantage d'intensité et d'engagement articulatoire. Les voyelles inaccentuées sont perceptuellement plus légères, subissant une réduction vocalique (centralisation) qui obéit à des règles positionnelles précises. Le mot хорошо (bien, bon) en est la démonstration par excellence : trois lettres ⟨о⟩ identiques, chacune prononcée différemment selon sa proximité avec l'accent tonique. Le ⟨о⟩ final accentué se chante <code>[o]</code>. Le ⟨о⟩ pénultième (immédiatement avant l'accent) se réduit en <code>[ɑ]</code>. Le ⟨о⟩ éloigné (deux syllabes avant l'accent) se réduit davantage en <code>[ʌ]</code>. La transcription complète est <code>[xʌ.ɑ.ˈʃo]</code>. Un seul mot, une seule lettre, trois sons, entièrement gouvernés par la proximité avec l'accent tonique.</p>

						<p>Cette réduction en cascade relève de l'unité 6. Pour l'instant, le constat est plus simple : tant que l'on ne sait pas où tombe l'accent, on ne peut pas vraiment savoir comment la plupart des autres voyelles du mot se prononceront. Le russe comporte tout de même quelques indicateurs fiables d'accent et deux voyelles qui ne se réduisent jamais : nous les verrons dans les leçons suivantes.</p>

						<h4 id="learn-u2-governing">L'accent tonique comme principe directeur</h4>

						<p>La syllabe accentuée est la cible. Tout le reste se rapproche d'elle ou s'en éloigne.</p>

						<p>Cette priorité n'est pas propre au russe. Les chanteurs formés au répertoire anglais et allemand reconnaîtront ce principe immédiatement. Ce qui distingue le russe (également une langue accentuelle) n'est pas ce mécanisme, mais ses conséquences : le degré auquel les voyelles inaccentuées changent de qualité en russe peut être radical. Néanmoins, ces transformations suivent une logique systématique.</p>

						<p>Dans notre discussion du russe chanté, nous travaillons à l'intérieur d'un modèle simplifié qui pose au maximum une syllabe accentuée par mot russe. Cette syllabe accentuée peut aussi être appelée syllabe tonique. Toutes les autres syllabes du mot sont, par définition, inaccentuées. Cette simplification ne tient certes pas dans le russe standard contemporain (RSC) parlé. Les emprunts et les mots composés brouillent les contours de cette règle générale. Néanmoins, dans le russe chanté, c'est la distinction binaire entre accentué et inaccentué qui gouverne toute la cascade phonologique qui suit.</p>

						<p>Sachez où tombe l'accent.</p>

						<h4 id="learn-u2-unpredictable">Un accent imprévisible</h4>

						<p>Nous avons noté plus haut que le russe, comme l'anglais et l'allemand, est une langue accentuelle. Le contraste avec les langues syllabiques mérite qu'on s'y arrête. Dans le français chanté, chaque voyelle exprime sa valeur cardinale sans réduction. Le <em>schwa</em> français <code>[ə]</code> se distingue chez les langues chantées parce qu'il ne représente pas la réduction d'une voyelle autrement cardinale. C'est son propre phonème dans le français chanté, une cible vocalique distincte en soi. L'italien, tout simplement, ne possède pas de <em>schwa</em>, ni même le concept de voyelle réduite.</p>

						<p>Le russe est une langue accentuelle. L'accent tonique en russe est imprévisible, tout comme il l'est en anglais. La position de l'accent doit s'apprendre soit par l'expérience, soit par confirmation auprès d'un locuteur russe natif fiable, soit en consultant un dictionnaire digne de confiance. L'accent russe peut tomber sur n'importe quelle syllabe d'un mot, et il se déplace fréquemment lorsque le même mot apparaît sous une forme grammaticale différente. De plus, une même orthographe peut présenter un sens et une prononciation quand l'accent tombe sur une syllabe, tandis que la même orthographe accentuée sur une autre syllabe communique un sens entièrement différent, une prononciation distincte et une étymologie convergente. Ces mots s'appellent des homographes, et ils sont courants dans les langues accentuelles comme dans les langues syllabiques. Nous y reviendrons dans la section suivante.</p>

						<p>Cette volatilité explique pourquoi toutes les ressources de diction lyrique russe marquent l'accent. Ma comparaison de dix autorités en diction lyrique russe a montré une unanimité sur ce point : l'accent est suffisamment fondamental pour que chacune d'entre elles le marque, quoique selon des conventions différentes. Six utilisent le marqueur d'accent primaire de l'API <code>[ˈ]</code> positionné avant la syllabe accentuée. Trois (Cox, Olin et Richter) placent un accent aigu directement au-dessus de la voyelle accentuée, ce qui me semble être un indice visuel plus immédiat et intuitif pour les chanteurs. (C'est ce qui motive le choix d'offrir un marquage global par accent aigu des textes cyrilliques sources dans <em>Ilya</em>.) Une autorité en diction lyrique russe (McMaster) utilise un accent grave. Quoi qu'il en soit, la diversité de notation reflète une conviction partagée : sans accent, une transcription de russe chanté est incomplète et ne servira pas bien le chanteur.</p>

						<p><em>Ilya</em> peut marquer l'accent au moyen de l'accent aigu combinant (◌́) placé au-dessus de la voyelle cyrillique accentuée du texte source, si vous choisissez cette option en l'activant dans la section Notation au bas du tiroir. Le marqueur d'accent de l'API est aussi le signal de confiance d'<em>Ilya</em> : il n'apparaît que sur les mots dont l'accent a été confirmé par le dictionnaire ou intentionnellement assigné par l'utilisateur. Les mots en attente de vérification ne portent aucun marquage d'accent, affichant plutôt un badge VERIFY en cadre pointillé, impossible à manquer. C'est un choix de conception délibéré : l'absence de marqueur d'accent signale une syllabe légitimement inaccentuée. La présence d'un badge VERIFY en cadre pointillé autour d'un bloc de transcription (les trois lignes superposées : API, cyrillique, glose) signifie l'incertitude, épargnant au chanteur une fausse confiance et attendant que l'utilisateur assigne une syllabe accentuée. Consultez donc un autre dictionnaire.</p>

						<h4 id="learn-u2-homographs">Pourquoi l'accent compte : les homographes</h4>

						<p>Le mot мука démontre pourquoi l'accent n'est pas cosmétique. Accentué sur la première syllabe (му́ка), il signifie « tourment ». Accentué sur la deuxième syllabe (мука́), il signifie « farine ». L'orthographe est identique. Le sens est entièrement différent. Et parce que l'accent gouverne la réduction vocalique, la prononciation de chaque voyelle du mot change lorsque l'accent se déplace.</p>

						<p>Le mot russe стоит est un autre exemple classique d'homographe. C'est la troisième personne du singulier au présent de deux verbes différents, « coûter » et « se tenir debout », selon la syllabe accentuée : « Сколько это сто́ит? (Combien cela coûte-t-il ?) » vs. « На столе стои́т ваза. (Un vase se tient sur la table.) »</p>

						<p>Transcrivez стоит dans <em>Ilya</em> avec l'accent sur la première syllabe : le ⟨о⟩ accentué conserve sa pleine qualité <code>[o]</code>, le и inaccentué ne se réduit pas en règle générale. Déplacez maintenant l'accent sur la deuxième syllabe : le и est désormais accentué, tandis que le ⟨о⟩ se réduit en <code>[ɑ]</code>. La différence est audible, et le sens pivote sur ce seul choix phonologique.</p>

						<p>Les homographes ne sont pas de rares curiosités en russe. La langue en regorge. Lorsqu'<em>Ilya</em> rencontre un mot présentant plusieurs schémas d'accentuation possibles dans son dictionnaire, il sélectionne le premier parmi plusieurs. L'utilisateur doit exercer son jugement pour réassigner la lecture correcte au contexte poétique.</p>

						<h4 id="learn-u2-shifting">Déplacement de l'accent selon les formes grammaticales</h4>

						<p>Les homographes constituent le cas spectaculaire, mais une version plus discrète du même principe opère dans toute la langue. Les noms, verbes et adjectifs russes déplacent fréquemment leur accent lorsqu'ils changent de forme grammaticale. Le cas nominatif d'un nom peut accentuer une syllabe; le cas prépositionnel du même nom peut en accentuer une autre. Un verbe à l'infinitif peut porter l'accent sur une syllabe; sa forme féminine au passé peut le déplacer ailleurs.</p>

						<p>Ce n'est pas un problème que le chanteur doit résoudre par la grammaire. C'est un problème dont le chanteur doit avoir conscience, parce qu'il signifie que reconnaître la racine d'un mot ne garantit pas de savoir où tombe son accent dans la forme parfois même archaïque que le poète a choisie. Le dictionnaire fait autorité. Lorsque le dictionnaire d'<em>Ilya</em> connaît la forme déclinée ou conjuguée précise, il fournit l'accent correct. Lorsqu'il ne connaît que la forme de base (le lemme), il signale le mot pour vérification. C'est une limitation honnête : l'accent morphologique russe est complexe, et aucun système fondé sur des règles ne peut prédire chaque cas. <em>Ilya</em> ne prétend pas le contraire.</p>

						<h4 id="learn-u2-role">Le rôle d'Ilya</h4>

						<p>Timour Baïtoukalov, le créateur de l'outil de transcription API russe en ligne easypronunciation.com, a écrit en correspondance personnelle que la construction de la base de données d'accents pour son excellent moteur de transcription du russe parlé avait exigé un travail considérable : constituer sa propre base à partir du dictionnaire de Zaliznyak, l'adapter à ses besoins, recenser tous les homographes, restaurer la lettre perdue « ё ». Sa conclusion, après avoir conçu l'algorithme de conversion en API : « Croyez-moi, c'est beaucoup de règles. »</p>

						<p><em>Ilya</em> s'inspire de cette approche architecturale. Son dictionnaire, tiré de données Wiktionary et enrichi de corrections curatées, fournit les positions d'accent pour des centaines de milliers de mots russes. Le moteur applique ensuite les règles de Grayson pour dériver la transcription API correcte à partir de cette position d'accent. La tâche du chanteur est de vérifier que l'accent est correct pour le contexte poétique, lui permettant de faire un choix éclairé lorsque le dictionnaire propose des alternatives.</p>

						<p>C'est pourquoi nous commençons ici. L'accent tonique n'est pas un sujet parmi d'autres. C'est le fondement sur lequel repose tout le système.</p>

						<h3 id="learn-unit-3">Unité 3 · Les sons vocaliques</h3>

						<p>Le russe possède dix sons vocaliques chantés distincts dans l'inventaire de Grayson : un ensemble gérable, plus restreint que celui de l'anglais. (D'autres auteurs en emploient de sept à dix, selon le degré de réduction vocalique qu'ils choisissent de transcrire.) Cette unité présente chaque son, établit sa correspondance avec les lettres cyrilliques qui le produisent, et le relie aux voyelles que vous connaissez déjà.</p>

						<p>La voyelle ⟨о⟩ mérite une attention particulière. Grayson consacre un essai entier à ce phonème (« The Story of /o/: Is Russian /o/ open or closed? », pp. 359-397 de sa thèse), menant le lecteur à travers un raisonnement complexe pour conclure que le <code>[o]</code> russe chanté est une voyelle beaucoup plus ouverte et plus détendue que son allophone allemand fermé. Ilya adopte le symbole <code>[o]</code> de Grayson, en sachant que sa réalisation sonore diffère de ce que ce symbole désigne dans vos études de diction allemande.</p>

						<p>Nous abordons également le choix de notation de Grayson pour le schwa russe : <code>[ʌ]</code> plutôt que <code>[ə]</code>. Ce choix est pédagogique: le symbole <code>[ə]</code> est si étroitement associé à la voyelle arrondie du français que les jeunes chanteurs ayant une formation en diction française ajoutent trop facilement un arrondissement des lèvres qui n'appartient pas au russe. L'assimilation contextuelle par laquelle la voyelle par défaut <code>[ɑ]</code> se rapproche en <code>[a]</code> entre deux consonnes palatalisées (le « fronting ») est également présentée ici.</p>

						<h3 id="learn-unit-4">Unité 4 · Les sons consonantiques</h3>

						<p>Une comparaison de dix auteurs de diction lyrique russe révèle une uniformité remarquable dans la notation de la majorité des consonnes. Les symboles correspondant aux lettres ⟨b d f g k m n p r s t v x z⟩ font l'unanimité. Là où les auteurs divergent (sur la latérale, sur la nasale palatale, sur les fricatives postalvéolaires), les différences reflètent des traditions concurrentes plutôt que des erreurs.</p>

						<p>Nous organisons les consonnes à partir de ce que vous savez déjà, et non selon la relation historique du cyrillique avec d'autres systèmes d'écriture, comme le fait Grayson. Les consonnes qui se comportent de manière identique à leurs équivalents viennent en premier. Celles qui sont proches mais pas identiques suivent. Les sons véritablement nouveaux arrivent en dernier. En chemin, nous présentons les voyelles iotées (я, е, ё, ю), les signes mou et dur, et la première rencontre avec la palatalisation comme propriété inhérente de certaines consonnes. La fricative vélaire voisée <code>[ɣ]</code>, la version regressivement voisée de <code>[x]</code>, fait également son apparition ici; il semble que les auteurs qui l'incluent dans leur inventaire sont aussi ceux qui se montrent les plus attentifs aux autres aspects nuancés de leurs transcriptions.</p>

						<h3 id="learn-unit-5">Unité 5 · La palatalisation</h3>

						<p>Le pont entre l'inventaire et les processus. Certaines consonnes sont toujours palatalisées (vous les avez rencontrées à l'Unité 4). D'autres le deviennent selon leur contexte. L'enseignement de la palatalisation comme articulation secondaire appliquée à des phonèmes déjà familiers est une philosophie pédagogique délibérée : le russe ne vous demande pas d'apprendre des sons entièrement nouveaux, mais d'ajouter un geste à des sons que vous produisez déjà.</p>

						<p>Grayson décrit le processus en trois temps : « arch, pronounce, peel » (cambrer, prononcer, décoller). Le dos de la langue s'arche vers le palais dur en préparation, la consonne est prononcée simultanément, puis le dorsum se décolle du palais. Un exemple simple illustre la différence : le mot russe <em>нет</em> (non) se transcrit <code>[ɲɛt]</code> et non <code>[njɛt]</code>. Les trois phonèmes familiers se succèdent; ce qui a changé est la nature de la nasale.</p>

						<p>L'histoire de la notation de la palatalisation mérite un détour. Avant 1989, l'Association phonétique internationale préconisait un sous-ensemble de seize symboles spécialisés intégrant des crochets palataux. L'IPA les a abandonnés lors des réformes de Kiel, les remplaçant par le yod en exposant <code>[ʲ]</code> associé aux symboles consonantiques standard. Parmi les dix auteurs que j'ai comparés, seul Grayson utilise le marqueur de palatalisation approuvé par l'API. Les autres réutilisent des symboles prédéfinis (demi-anneaux, cédilles, crochets rétroflexes) qui signifient autre chose dans l'usage orthodoxe de l'API. Ilya suit Grayson.</p>

						<p>Le sujet connexe du vélaire-i, la voyelle <code>[ɨ]</code>, est également présenté ici : une voyelle médiane, à mi-chemin entre <code>[i]</code> et <code>[u]</code> sur le quadrilatère vocalique de Jones.</p>

						<h3 id="learn-unit-6">Unité 6 · La réduction vocalique</h3>

						<p>Le système se rassemble. Vous connaissez le timbre des voyelles accentuées (Unité 3). Vous savez ce que la palatalisation fait à l'environnement consonantique (Unité 5). Vous savez que l'accent gouverne tout (Unité 2).</p>

						<p>Cette unité complète le tableau en expliquant ce qui arrive aux voyelles inaccentuées. La réduction est hiérarchique et gouvernée par la proximité de l'accent. Considérons le mot <em>хорошо</em> (bien), où chaque ⟨о⟩ s'écrit identiquement, mais chacun se prononce différemment : le ⟨о⟩ accentué de la syllabe finale se chante <code>[o]</code>, le ⟨о⟩ pénultième se chante <code>[ɑ]</code>, et le ⟨о⟩ éloigné (deux syllabes avant l'accent) se réduit davantage à <code>[ʌ]</code>. La phonologie russe appelle ce processus <em>akanie</em>.</p>

						<p>L'<em>ikanie</em> est un processus parallèle qui réduit les voyelles inaccentuées ⟨е⟩ et ⟨я⟩ à <code>[ɪ]</code>. Les amateurs de la prononciation pétersbourgeoise peuvent résister à ce type de réduction, mais elle est légitimée par le dialecte moscovite ancien sur lequel la diction lyrique est fondée.</p>

						<p>La reconstitution vocalique permet aux chanteurs de prendre des décisions éclairées sur le moment de restaurer une voyelle réduite au service du legato ou de la clarté du texte. Par exemple, l'expression <em>то же</em> (aussi) peut se transcrire avec réduction comme <code>[to ʒɨ]</code>, ce qui conviendrait à un tempo vif sur une croche inaccentuée. Mais dans un tempo plus lent, sur une valeur rythmique plus longue, la reconstitution à <code>[to ʒɛ]</code> peut mieux honorer la formalité du texte poétique. La reconstitution est une question de goût, confirmée idéalement par un locuteur natif; il me semble que les Russes attendent moins de réduction dans la déclamation de textes poétiques, comme un moyen de distinguer l'art du discours quotidien.</p>

						<h3 id="learn-unit-7">Unité 7 · Intégration</h3>

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

						<blockquote><p><em>[Placeholder: 37-letter glyph table. Each letter presented in a grid of square cells across the following forms:]</em></p></blockquote>

						<table>
						<thead><tr><th>Form</th><th>Font</th><th>Purpose</th></tr></thead>
						<tbody>
						<tr><td>Uppercase print</td><td>Serif (e.g., Noto Serif)</td><td>Score underlays</td></tr>
						<tr><td>Lowercase print</td><td>Serif</td><td>Score underlays</td></tr>
						<tr><td>Uppercase print</td><td>Sans serif</td><td>Contemporary typesetting</td></tr>
						<tr><td>Lowercase print</td><td>Sans serif</td><td>Contemporary typesetting</td></tr>
						<tr><td>Uppercase italic</td><td>Serif italic</td><td>Third-party print resources</td></tr>
						<tr><td>Lowercase italic</td><td>Serif italic</td><td>Third-party print resources</td></tr>
						<tr><td>Uppercase italic</td><td>Sans serif italic</td><td>Third-party print resources</td></tr>
						<tr><td>Lowercase italic</td><td>Sans serif italic</td><td>Third-party print resources</td></tr>
						<tr><td>Uppercase cursive</td><td>Commissioned propisi-style SVG</td><td>Handwritten texts, cultural literacy</td></tr>
						<tr><td>Lowercase cursive</td><td>Commissioned propisi-style SVG</td><td>Handwritten texts, cultural literacy</td></tr>
						</tbody>
						</table>

						<p><em>The glyph table ships at release with print and italic forms populated. Cursive columns are reserved for commissioned artwork in the standard Russian school handwriting (прописи) style, with the connecting hooks (соединения) that distinguish authentic Russian cursive from decorative script fonts.</em></p>

						<p>The purpose of presenting every letter in multiple forms is to ensure that no matter where you meet a letter, you can recognise it. Singers encounter Cyrillic in printed scores (often serif), in contemporary editions (often sans serif), in scholarly resources (often italic), and occasionally in handwritten annotations or historical manuscripts (cursive). Notice how radically some letterforms change between regular, italic, and cursive forms.</p>

						<h4 id="learn-u1-try">Try This</h4>

						<p>Open <em>Ilya</em>'s Transcription tab and paste any short Russian text. You might try the opening of Musorgsky's "Где ты, звёздочка?" or a few lines from any song in your repertoire.</p>

						<p>Look at the three lines <em>Ilya</em> produces: IPA, Cyrillic, and translation gloss. You can already begin to match what you see in the IPA line to the anchors you have just learned. Some letters will have transformed: an unstressed ⟨О⟩ may appear as <code>[ʌ]</code> rather than the <code>[o]</code> you met in the table above. A consonant before ⟨Е⟩ may carry a palatalisation marker, <code>[ʲ]</code>, which was not demonstrated in the default anchor.</p>

						<p>Those transformations are the subject of Sections 2 through 7. For now, just notice that the Russian Cyrillic alphabet is finite, yet the IPA is familiar. <em>Ilya</em> can show you exactly what it does to every letter. The rest of LEARN teaches you why.</p>

						<p><em>Sources:</em> Craig M. Grayson, "Russian Lyric Diction" (D.M.A. dissertation, University of Washington, 2012), Ch. 2, Appendices B and D. Ken Griffiths, Russian Alphabet Song, arr. Dann Mitton (2017). Irena Yanushevskaya and Daniel Bunčić, "Russian," <em>Journal of the International Phonetic Association</em> 45/2 (2015).</p>

						<h3 id="learn-unit-2">Unit 2 · Stress</h3>

						<h4 id="learn-u2-rhythm">Stress-timed rhythm and the singer's advantage</h4>

						<p>The concept of linguistic rhythm types, first proposed by Pike in 1945 and subsequently debated in the literature, proposes a useful binary: languages are either stress-timed or syllable-timed. This fork in the road is much simplified (scholars have struggled to produce consistent empirical evidence to prove the dichotomy, and some languages resist these neat classification paths), but the construct remains useful for singers because it underwrites aspects of language that we intuit but may not have been able to name.</p>

						<p>Syllable-timed languages like French and Korean give their syllables a theoretically equal duration, as well as distinct vowel realization without reduction. The musical text settings of syllable-timed languages exploit this inherent syllabic equality with a heightened imperative for legato. This certainly seems plausible for sung French and its style soutenu.</p>

						<p>Stress-timed languages like English, German, and Russian work differently. The interval between stressed syllables establishes a rhythmic pulse that unstressed syllables fit themselves into. This leads to two effects that every singer has already experienced in English and German repertoire: even in legato passages, unstressed syllables carry less intensity and articulatory commitment than their stressed counterparts, and unstressed vowels undergo reduction (centralization) toward a centralised quality. In speech, these differences manifest as literal durational contrasts; in singing, the composer prescribes the rhythm, but the singer communicates the weight of stress through intentional, or automatic, micro-adjustments to intensity and articulatory engagement within the rhythmic values on the page. We hear this in the sung English "behold" <code>[bɪ.ˈhoʊld]</code>, where the first syllable reduces from <code>[i]</code> to the more central <code>[ɪ]</code>. Both unstressed syllables in the sung German "gekommen" <code>[ɡə.ˈkɔm.mən]</code> are effectively reduced <em>schwa</em>.</p>

						<p>Russian follows the same pattern, but with greater systematisation. The stressed vowels in sung Russian receive greater intensity and articulatory engagement. The unstressed vowels are perceptually lighter, undergoing vowel reduction (centralization) that follows specific, positional rules. The word хорошо (good) is the textbook demonstration: three identical ⟨о⟩ letters, each being pronounced differently depending on its proximity to the stress. The stressed final ⟨о⟩ is sung as <code>[o]</code>. The penultimate ⟨о⟩ (immediately before the stress) reduces to <code>[ɑ]</code>. The remote ⟨о⟩ (two syllables before the stress) reduces further to <code>[ʌ]</code>. The full transcription is <code>[xʌ.ɑ.ˈʃo]</code>. One word, one letter, three sounds, entirely governed by proximity to stress.</p>

						<p>This cascading reduction is the domain of Unit 6. For now, the point is simpler: until you know where the stress falls, you cannot really know how most other vowels in the word will sound. Russian does feature a few surefire indicators of stress and two vowels that never reduce: we will see these in later lessons.</p>

						<h4 id="learn-u2-governing">Stress as the governing principle</h4>

						<p>The stressed syllable is the target. Everything else moves toward or away from it.</p>

						<p>This priority is not unique to Russian. Singers trained in English and German repertoire will recognise this principle immediately. What distinguishes Russian (also a stress-timed language) is not this mechanism, but its consequences: the degree to which unstressed vowels change their quality in Russian can be radical. Nevertheless, these transformations follow systematic logic.</p>

						<p>In our discussion of sung Russian, we work within a simplified model that assumes one stressed syllable per Russian word, maximum. This stressed syllable can also be called the tonic syllable. All other syllables within the word are, by this definition, unstressed. Admittedly, this simplification does not hold in Contemporary Standard Russian (CSR) speech. Loanwords and compound words blur the boundaries of this blanket statement. Nevertheless, in sung Russian, it is the binary distinction between stressed and unstressed that governs the entire phonological cascade that follows.</p>

						<p>Know where the stress falls.</p>

						<h4 id="learn-u2-unpredictable">Unpredictable stress</h4>

						<p>We noted above that Russian, like English and German, is stress-timed. The contrast with syllable-timed languages is worth pausing on. In sung French, each vowel expresses its cardinal value without reduction. The French <em>schwa</em> <code>[ə]</code> stands out among sung languages because it does not represent the reduction of an otherwise cardinal vowel. It is its own phoneme in sung French, itself a distinct vowel target. Italian simply does not have a <em>schwa</em>, nor the concept of a reduced vowel at all.</p>

						<p>Russian is a stress-timed language. Syllabic stress in Russian is unpredictable, just as it is in English. The location of word stress must be learned either through experience, by confirmation with a reliable native Russian speaker, or by consulting a trustworthy dictionary. Russian stress may fall on any syllable of a word, and stress frequently shifts when the same word appears in a different grammatical form. Further, one spelling may exhibit one meaning and pronunciation when stressing one syllable, while the same spelling stressed on another syllable communicates a completely different meaning, distinctive pronunciation, and convergent etymology. These words are called homographs, and they are common in both stress-timed and syllable-timed languages. More on this in the next section.</p>

						<p>This volatility is the reason that every Russian lyric diction resource marks stress. My comparison of ten Russian lyric diction authorities showed unanimous agreement on this point: stress is fundamental enough that each one of them marks it, though they do so using differing conventions. Six of them use the IPA primary stress marker <code>[ˈ]</code> positioned before the stressed syllable. Three (Cox, Olin, and Richter) place an acute diacritic directly over the stressed vowel, which seems to me to be a more immediate and intuitive visual cue for singers. (This drives the choice to offer global acute markings for Cyrillic source texts in <em>Ilya</em>.) One Russian Lyric Diction authority (McMaster) uses a grave diacritic. Regardless, the diversity of notation reflects a shared conviction: without stress, a transcription of sung Russian is incomplete and will not serve the singer well.</p>

						<p><em>Ilya</em> can mark stress with the combining acute accent (◌́) placed above the stressed Cyrillic source text vowel if you choose that option by toggling it in the Notation section at the bottom of the Drawer. The IPA stress mark is also <em>Ilya</em>'s confidence signal: it appears only on words whose stress has been confirmed by the dictionary or intentionally assigned by the user. Words awaiting verification carry no stress marking, instead featuring an unmistakeable dashed-line box VERIFY badge. This is a deliberate design choice: the absence of a stress mark communicates a legitimately unstressed syllable. The presence of a dashed-line box VERIFY badge around a word stack signifies uncertainty, sparing the singer from false confidence and awaiting user assignment of a stressed syllable. So consult another dictionary.</p>

						<h4 id="learn-u2-homographs">Why stress matters: homographs</h4>

						<p>The word мука demonstrates why stress is not cosmetic. With stress on the first syllable (му́ка), it means "torment." With stress on the second syllable, (мука́) means "flour." The spelling is identical. The meaning is entirely different. And because stress governs vowel reduction, the pronunciation of every vowel in the word changes when the stress moves.</p>

						<p>The Russian word стоит is another classic example of a homograph. It is the third-person singular present tense form of two different verbs "to cost" and "to stand", depending on which syllable is stressed: "Сколько это сто́ит? (How much does this cost?)" vs. "На столе стои́т ваза. (A vase is standing/sitting on the table.)"</p>

						<p>Transcribe стоит in <em>Ilya</em> with first-syllable stress: the stressed ⟨о⟩ preserves its full <code>[o]</code> quality, the unstressed и as a rule does not reduce. Now shift the stress to the second syllable: the и is now stressed, while the ⟨о⟩ reduces to <code>[ɑ]</code>. The difference is audible, and the meaning pivots on that single phonological choice.</p>

						<p>Homographs are not rare curiosities in Russian. The language is full of them. When <em>Ilya</em> encounters a word with multiple possible stress patterns in its dictionary, it selects the first one among potentially several. The user must use their judgment to reassign the correct reading for the poetic context.</p>

						<h4 id="learn-u2-shifting">Shifting stress across grammatical forms</h4>

						<p>Homographs are the dramatic case, but a quieter version of the same principle operates throughout the language. Russian nouns, verbs, and adjectives frequently shift their stress when they change grammatical form. The nominative case of a noun may stress one syllable; the prepositional case of the same noun may stress another. A verb in the infinitive may carry stress on one syllable; its past tense feminine form may shift it elsewhere.</p>

						<p>This is not a problem the singer needs to solve through grammar. It is a problem the singer needs to be aware of, because it means that recognising a word's root does not guarantee knowing where its stress falls in the sometimes even archaic form the poet has chosen. The dictionary is the authority. When <em>Ilya</em>'s dictionary knows the specific declined or conjugated form, it provides the correct stress. When it knows only the base form (the lemma), it flags the word for verification. This is an honest limitation: Russian morphological stress is complex, and no rule-based system can predict every case. <em>Ilya</em> does not pretend otherwise.</p>

						<h4 id="learn-u2-role">Ilya's role</h4>

						<p>Timur Baytukalov, the creator of the online Russian IPA transcription tool easypronunciation.com, wrote in personal correspondence that building the stress database for his excellent speech-based transcription engine required enormous labour: "for stress position in Russian words I created my own database from the dictionary by Zaliznyak... but it took me a lot of time to adopt it to my needs: to find all homographs, recover the lost letter 'ё', etc. I... create an algorithm that converts the text (with stressed vowels) into IPA. Believe me, it's a lot of rules."</p>

						<p><em>Ilya</em> is inspired by this architectural approach. Its dictionary, drawn from Wiktionary data and enriched with curated corrections, provides stress positions for hundreds of thousands of Russian words. The engine then applies Grayson's rules to derive the correct IPA transcription from that stress position. The singer's task is to verify that the stress is correct for the poetic context, allowing them to make an informed choice when the dictionary offers alternatives.</p>

						<p>This is why we begin here. Stress is not one topic among many. It is the foundation on which the entire system rests.</p>

						<h3 id="learn-unit-3">Unit 3 · The Vowel Sounds</h3>

						<p>Russian has ten distinct sung vowel sounds in Grayson's inventory: a manageable set, smaller than English. (Other authors employ as few as seven or as many as ten, depending on the degree of vowel reduction they choose to transcribe.) This unit introduces each sound, maps it to the Cyrillic letters that produce it, and connects it to the vowels you already know from other languages.</p>

						<p>Of particular interest is the vowel ⟨о⟩. Grayson devotes an entire essay to this phoneme ("The Story of /o/: Is Russian /o/ open or closed?", pp. 359-397 of his dissertation), leading the reader through a complex and well-reasoned argument to conclude that the sung Russian <code>[o]</code> is a much looser, much more open vowel than, for example, its tightly closed German allophone. Ilya adopts Grayson's <code>[o]</code> symbol, with the understanding that its sounding realisation differs from what that symbol denotes in your German diction studies.</p>

						<p>We also address Grayson's notation choice for the Russian schwa: <code>[ʌ]</code> rather than <code>[ə]</code>. This choice is pedagogical: the symbol <code>[ə]</code> is so closely associated with the rounded French vowel that young singers with French diction training too readily add lip-rounding that does not belong in Russian. The contextual assimilation by which the default <code>[ɑ]</code> vowel fronts to <code>[a]</code> between two palatalized consonants (what we call "fronting") is also introduced here.</p>

						<h3 id="learn-unit-4">Unit 4 · The Consonant Sounds</h3>

						<p>A comparison of ten Russian lyric diction authors reveals a remarkable uniformity in the notation of the majority of consonants. The symbols corresponding to the letterforms ⟨b d f g k m n p r s t v x z⟩ are unanimous across all ten sources. Where the authors diverge (on the lateral approximant, on the palatal nasal, on the postalveolar fricatives), the differences reflect competing traditions rather than errors.</p>

						<p>We organise the consonants by what you already know, rather than by the historical relationship of Cyrillic to other writing systems as Grayson does. Consonants that behave identically to their counterparts come first. Consonants that are close but not identical come next. Genuinely unfamiliar sounds come last. Along the way, we introduce the iotated vowels (я, е, ё, ю), the soft and hard signs, and the first encounter with palatalization as an inherent property of certain consonants. The voiced velar fricative <code>[ɣ]</code>, the regressively voiced version of <code>[x]</code>, also makes its appearance here; there seems to be a correspondence between sources that include it and those that are also thoughtful about other nuanced aspects of their transcriptions.</p>

						<h3 id="learn-unit-5">Unit 5 · Palatalization</h3>

						<p>The bridge between inventory and process. Some consonants are always palatalized (you met them in Unit 4). Others become palatalized depending on their context. Teaching palatalization as a secondary articulation applied to already-familiar phonemes is a deliberate pedagogical philosophy: Russian does not ask you to learn entirely new sounds, but to add a gesture to sounds you already produce.</p>

						<p>Grayson describes the process in three steps: "arch, pronounce, peel." The body of the tongue arches toward the hard palate in preparation, the consonant is simultaneously pronounced, and the dorsum peels away from the palate. A simple example illustrates the difference: the Russian word <em>нет</em> (no) is transcribed <code>[ɲɛt]</code>, not <code>[njɛt]</code>. Three familiar phonemes in sequence; what has changed is the nature of the nasal.</p>

						<p>The history of palatalization notation deserves a brief excursion. Before 1989, the International Phonetic Association advocated a specialised subset of sixteen symbols incorporating palatalization hooks. The IPA discontinued these at the Kiel Convention, replacing them with the superscript yod <code>[ʲ]</code> paired with standard consonant symbols. Among the ten authors I compared, Grayson alone uses the IPA-approved palatalization marker. The others repurpose predefined symbols (subscript half-rings, cedillas, retroflex hooks) that mean something else in orthodox IPA usage. This widespread repurposing demands attentive reinterpretation for anyone encountering these singers' transcriptions. Ilya follows Grayson.</p>

						<p>The companion topic of velar-i, the vowel <code>[ɨ]</code>, is introduced here as well: a medial vowel, halfway between <code>[i]</code> and <code>[u]</code> on Jones' vowel quadrilateral.</p>

						<h3 id="learn-unit-6">Unit 6 · Vowel Reduction</h3>

						<p>Now the system comes together. You know what the vowels sound like when they are stressed (Unit 3). You know what palatalization does to the consonant environment (Unit 5). You know that stress governs everything (Unit 2).</p>

						<p>This unit completes the picture by explaining what happens to vowels when they are not stressed. Reduction is hierarchical and governed by proximity to stress. Consider the word <em>хорошо</em> (good), in which each ⟨о⟩ is spelled identically yet each is pronounced differently: stressed ⟨о⟩ in the final syllable is sung as <code>[o]</code>, penultimate ⟨о⟩ is sung as <code>[ɑ]</code>, and the remote ⟨о⟩ two syllables before the stress reduces further to <code>[ʌ]</code>. Russian phonology calls this process <em>akanye</em>.</p>

						<p><em>Ikanye</em> is a parallel process that reduces unstressed ⟨е⟩ or ⟨я⟩ to <code>[ɪ]</code>. Aficionados who favour the pronunciation conventions of St. Petersburg may not advocate this kind of reduction, but it is legitimised by the Old Muscovite dialect on which lyric diction is founded.</p>

						<p>Vowel reconstitution is the choice to return a vowel to its unreduced value. In singing, this applies most notably to unstressed ⟨е⟩ or ⟨я⟩ which may reduce to <code>[ɪ]</code>. Reduction in some cases can sound too informal to a Russian speaker expecting the delivery of poetic texts with more formal precision. For example, the expression <em>то же</em> (also) can be transcribed with reduction as <code>[to ʒɨ]</code>, and that choice might agree with a brisk tempo and a short rhythmic value on an unstressed beat. But in a slower tempo, on a longer note, reconstitution to <code>[to ʒɛ]</code> may better honour the formality of the poetic text. Reconstitution is a matter of taste, best confirmed by a native Russian speaker; I have noticed that Russians seem to expect less reduction in the delivery of poetic texts, perhaps as a means of setting art apart from quotidian speech.</p>

						<h3 id="learn-unit-7">Unit 7 · Integration</h3>

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
