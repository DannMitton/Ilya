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

						<h3 id="learn-unit-1">Unité 1 · Orientation</h3>

						<h4 id="learn-u1-alphabet">La Chanson de l'alphabet russe</h4>

						<p>Commençons par une chanson. Ken Griffiths était mon coach à Tanglewood à l'été de 1999, et la Chanson de l'alphabet russe qu'il m'a fait découvrir demeure le point d'entrée le plus accessible que je connaisse. Précisons que les enfants russes n'apprennent pas cette chanson; ils mémorisent l'alphabet cyrillique par répétition. Mais pour nous, apprenants non russophones, cette mise en musique (empruntée à une chanson à boire russe traditionnelle) sert à nous présenter les trente-trois lettres de l'alphabet cyrillique moderne. La chanson s'achève par une coda dont le sens est à peu près « Pour parler russe, il faut apprendre l'alphabet! » Avant toute complexité phonologique, vous aurez les trente-trois lettres fermement en tête, avec leurs noms.</p>

						<p>Quelques-uns de ces noms méritent une attention particulière d'emblée. Les consonnes suivent un schéma prévisible : la plupart sont nommées en associant le son consonantique à <code>[ɛ]</code> (comme dans <code>[bɛ]</code>, <code>[vɛ]</code>, <code>[dɛ]</code>), tandis qu'un groupe plus restreint inverse l'ordre et place <code>[ɛ]</code> devant la consonne (<code>[ɛl]</code>, <code>[ɛm]</code>, <code>[ɛn]</code>, <code>[ɛr]</code>, <code>[ɛs]</code>, <code>[ɛf]</code>). Cela relève de la convention. Ce qui est moins conventionnel, parce qu'aucune source imprimée ne le mentionne, concerne le comportement de certaines voyelles prononcées isolément. Lorsque la lettre ⟨о⟩ est prononcée seule ou lorsqu'elle apparaît en fin de mot sous l'accent, elle se termine par un léger <em>offglide</em> (détente vocalique) : <code>[oːʌ̯]</code>. De même, lorsque ⟨ы⟩ (le i vélaire) est en position finale, il glisse vers <code>[i]</code> : <code>[ɨːi̯]</code>. J'ai observé que de nombreux locuteurs natifs russes produisent ces glissements de manière inconsciente, tout en niant qu'ils le font. Ces <em>offglides</em> ne sont jamais notés dans les transcriptions API pour chanteurs, mais je les enseigne comme partie intégrante d'une prononciation naturelle et idiomatique.</p>

						<p>L'alphabet cyrillique russe moderne compte trente-trois lettres. Dix d'entre elles sont des voyelles, mais pour nos besoins ces dix voyelles sont nos cinq allophones familiers /a e i o u/ déclinés en deux séries : une série « dure » et une série « molle ». Les consonnes russes sont au nombre de vingt et une. Enfin, deux lettres russes ne sonnent pas du tout : ces signes muets sont le signe dur (⟨ъ⟩, <em>tvyordyĭ znak</em>) et le signe mou (⟨ь⟩, <em>myagkiĭ znak</em>). Nous explorerons les fonctions de ces signes à l'Unité 4. Les chanteurs travaillant à partir de partitions publiées avant 1917 rencontreront quatre caractères supplémentaires (⟨ѣ⟩, ⟨і⟩, ⟨ѵ⟩, ⟨ѳ⟩), rendus obsolètes par des réformes orthographiques historiques. On peut simplement les remplacer par leurs équivalents modernes, et <em>Ilya</em> le fait automatiquement pour vous.</p>

						<h4 id="learn-u1-italian">L'italien et le russe : un socle commun</h4>

						<p>La plupart des chanteurs classiques abordent les mélodies et vocalises italiennes tôt dans leurs études, parce que l'italien chanté emploie un inventaire de sept sons vocaliques cardinaux d'une grande simplicité : <code>[i e ɛ a ɔ o u]</code>. L'inventaire vocalique du russe chanté, quant à lui, comprend dix phonèmes (un nombre qui ne correspond pas aux dix lettres orthographiques, bien que la coïncidence soit frappante). Cet inventaire consolide un seul allophone de /o/, mais englobe les voyelles italiennes en y ajoutant quatre sons : <code>[ɪ ɨ ɑ ʌ]</code>. La ressemblance n'est pas fortuite. La Russie a directement injecté les pratiques du <em>bel canto</em> dans son école de chant solo en important compositeurs, chanteurs et professeurs de chant italiens au XVIIIe siècle. Le russe magistralement chanté présente en conséquence une qualité à l'italienne : une prédilection pour les voyelles musicalement étirées (ce qui risque de surprendre pour une langue slave), le legato et la beauté du timbre hérités de ces influenceurs italiens. Un vieil adage, souvent répété au conservatoire, résume cette parenté : « Pour sonner russe, chantez à l'italienne. »</p>

						<p>Les parallèles ne s'arrêtent pas là. Ni l'italien ni le russe n'emploient de voyelles nasales. Vous qui êtes formés en diction française, vous apprécierez ce que cela implique : l'absence de nasalité s'accorde avec l'objectif classique de maintenir le port nasal scellé par un voile du palais constamment relevé. Ni l'un ni l'autre n'emploie de voyelles rhotiques (colorées par le /r/). Les deux langues reposent sur un équilibre constant de pression sous-glottique (le classique <em>appoggio</em> de la technique <em>bel canto</em>) associé à un flux soutenu de tonalité vibrante (<em>filare la voce</em>) pour maintenir le legato. En termes pratiques, le chanteur qui a intériorisé les coordinations physiques de l'italien chanté possède déjà un avantage considérable, ayant acquis bon nombre des coordinations que le russe chanté exige.</p>

						<p>En 2018, la pédagogue réputée Janice Chapman a observé que les chanteurs italiens bénéficient de ce qu'elle appelle un « <em>marvellous advantage</em> » (un avantage merveilleux) : le réglage lingual de leur langue maternelle est plus élevé et plus reculé que celui de l'anglais ou de l'allemand, ce qui place le chanteur sur un flux d'air soutenu, avec une langue haute, un voile du palais relevé et un larynx abaissé simultanément. Chapman décrit cela comme « <em>the resonant sweet spot</em> » et comme « <em>a sort of pivot point for all the vowels to hang from</em> » (un point pivot autour duquel toutes les voyelles s'organisent). Le russe partage certains aspects de cet avantage. Le « point pivot » que Chapman décrit porte un nom : c'est la <em>base d'articulation</em>.</p>

						<h4 id="learn-u1-basis">La base d'articulation</h4>

						<p>La base d'articulation est un concept linguistique qui fonctionne comme une position de référence propre à chaque langue. Les linguistes l'associent à la posture et aux réglages par défaut du conduit vocal durant les pauses et les voyelles d'hésitation (le « euh... » du français, le « uh... » de l'anglais). Pour le chant, la base d'articulation est l'endroit où repose la masse linguale et la configuration par défaut du conduit vocal lorsque le chanteur expérimenté se prépare à chanter dans chaque langue.</p>

						<p>Beatrice Honikman, dans son essai fondateur de 1964 intitulé « Articulatory Settings », décrit cette posture comme « <em>the gross oral posture and mechanics, both external and internal, requisite as a framework for the comfortable, economic and fluent merging and integrating of the isolated sounds into that harmonious, cognizable whole which constitutes the established pronunciation of a language</em> » (la posture orale globale et la mécanique, tant externe qu'interne, nécessaires pour la fusion confortable, économique et fluide des sons isolés en un tout harmonieux et reconnaissable qui constitue la prononciation établie d'une langue). Elle compare le concept à des vitesses mécaniques. Honikman rapporte une anecdote de son enseignement : elle demandait à ses étudiants « <em>Are you in English gear?</em> » (« Êtes-vous en réglage anglais? »), et lorsqu'elle les entendait glisser vers un accent étranger, elle remarquait : « <em>You're out of gear</em> » (« Vous avez perdu le réglage »). Il convient de noter que l'essai influent d'Honikman s'insère curieusement dans un recueil dédié au russophile Daniel Jones, dont les propres travaux étaient entièrement étrangers au sujet. De surcroît, Honikman ne cite aucune référence corroborante : chaque note de fin est explicative, non référentielle. Peut-être cela donne-t-il l'impression qu'elle improvise sur ses considérables expériences empiriques de l'allemand, de l'anglais, du français, du russe, du turc et de plusieurs autres langues. Le concept demeure contesté parmi les linguistes; Heinrich affirme qu'il est impossible à vérifier instrumentalement. Pourtant, Gick, Wilson, Koch et Cook (2004) fournissent les premières preuves instrumentales, mesurant des différences propres à chaque langue en cinq points du conduit vocal chez des locuteurs anglophones et francophones. Et comme Kedrova et Borissoff l'ont observé en 2013, si l'intérêt des linguistes occidentaux pour la base d'articulation a diminué, chez les linguistes russes il est toujours resté un concept viable et attractif, notamment dans l'enseignement de la phonétique et de la typologie des langues.</p>

						<p>Parmi la constellation des réglages articulatoires, la base d'articulation d'une langue peut être associée à l'un de trois réglages linguaux généralisés : avancé (la masse linguale se tient en avant, comme en français), neutre (la langue est centralisée), ou rétracté (la langue se tient en arrière, comme en anglais nord-américain). Vous qui parlez français connaissez déjà intimement le réglage avancé : c'est la posture que votre langue adopte par défaut. Le russe, lui, présente une base d'articulation neutre : la masse linguale n'est ni avancée ni rétractée. Elle est centralisée. Mais ce qui rend le russe exceptionnel, c'est que sa base d'articulation neutre se manifeste en deux versions alternantes : une configuration non frontée (pour les sons non palatalisés) et une variation frontée (pour les sons palatalisés). Nous y reviendrons à l'Unité 5.</p>

						<p>C'est ici que le lien avec le chant classique devient direct, et qu'un argument technique en faveur du russe chanté commence à se dessiner. Les travaux de Skalozub en cinématographie aux rayons X dans les années 1960 et 1970 montrent que les deux versions de la base d'articulation russe présentent un conduit vocal ouvert par défaut, contrairement aux autres langues examinées dans ses travaux. Cela correspond à l'idéal classique de la <em>gola aperta</em> (la « gorge ouverte »). En tant que posture pré-phonatoire, cette correspondance s'harmonise remarquablement avec la pédagogie vocale classique.</p>

						<p>Deux autres postures orales inhérentes au russe sont également des caractéristiques recherchées par la technique vocale classique. La langue reculée de la voyelle sombre <code>[ɑ]</code>, prédominante en russe chanté, présente une masse linguale centralisée reposant plus bas dans la bouche, favorisant un larynx bas et stable. La version frontée, activée par la palatalisation et la voyelle <code>[i]</code> (fréquente en russe), exige une langue frontée qui s'inscrit dans une stratégie de résonateur convergent. Lorsque la masse linguale avance, le reste de la langue doit suivre, dégageant le pharynx et créant un plus grand espace de résonance. Borissoff le résume ainsi : « <em>the Russian basis of articulation allows to produce both palatalised and non-palatalised sounds while the retracted centering of the English basis of articulation significantly restricts palatalisation</em> ». Autrement dit, le russe offre au chanteur les deux configurations que la technique classique recherche : une posture détendue à larynx bas et un résonateur convergent à gorge ouverte. Les deux peuvent alterner naturellement selon les exigences de la langue.</p>

						<p>Les chanteurs qui apprennent à centraliser leurs articulateurs pour le russe chanté constateront vraisemblablement moins de tension ambiante et une plus grande aisance dans la production vocale. Lorsque les articulateurs sont plus libres de se détendre de manière constructive, l'os hyoïde peut descendre, permettant au larynx de se stabiliser en position basse, en accord avec la base d'articulation neutre. Ces gains techniques sont peut-être transférables à un chant efficace dans d'autres langues. Vous connaissez déjà quatre « réglages ». Le russe en introduit un cinquième, et c'est un réglage qui s'harmonise avec vos objectifs techniques.</p>

						<h4 id="learn-u1-lyric">Diction lyrique et russe parlé</h4>

						<p>Les pratiques de diction lyrique sont antérieures à l'ère de l'amplification. Pour le russe chanté spécifiquement, elles constituent un amalgame du vieux moscovite (Old Muscovite; OM) filtré à travers les conventions de la prononciation <em>literaturnyĭ</em> (littéraire) et <em>stsenicheskoe</em> (scénique). Ce sont des cibles prescriptives stylisées pour la scène, non des descriptions du russe standard contemporain. La diction lyrique russe se satisfait d'une prononciation peut-être recherchée, « d'une autre époque ». Nous pouvons reconnaître cette convention dans la diction lyrique française, où un chanteur prononce le « e » caduc dans des contextes où la parole quotidienne l'efface, ou maintient des liaisons que la conversation courante a abandonnées. Cela fait sens dans le chant, mais sonne recherché dans le discours courant. Cette compréhension mérite d'être établie dès le départ. La prononciation que vous apprendrez avec <em>Ilya</em> n'est pas celle des Russes dans la rue. C'est celle de la scène lyrique. Et elle deviendra la vôtre lorsque vous chanterez en russe.</p>

						<p>La conséquence pratique est que certains phonèmes du russe parlé sont intentionnellement simplifiés en versions plus adaptables au chant : la lettre ⟨щ⟩, par exemple, est rendue en diction lyrique comme <code>[ʃʲː]</code> plutôt que le <code>[ʃʲtʃʲ]</code> que certains locuteurs natifs produiraient dans la parole. Les plosives russes et italiennes <code>[t]</code> et <code>[d]</code> partagent des temps d'attaque vocalique (<em>voice-onset times</em>) similaires, ce qui permet d'utiliser les plosives italiennes familières comme cibles raisonnables pour les plosives russes « dures » (non palatalisées). Ces simplifications constructives favorisent une continuité utile avec les autres langues chantées que vous connaissez déjà, offrant des points d'accès familiers aux chanteurs autrement peu accoutumés aux phonèmes russes. Il est bien entendu que les diagrammes et descriptions conçus pour des phonèmes du niveau de la parole (comme ceux offerts dans le <em>Conspectus of Russian Speech Sounds</em> de Bolla, 1981) n'ont aucune obligation de refléter les configurations convergentes et optimisées pour le chant, destinées à la performance classique. <em>Ilya</em> est un très bon outil, mais pour maîtriser les instantiations adéquates du russe chanté, rien ne remplace l'oreille d'un coach et professeur de chant averti. Préparez avec <em>Ilya</em>, ensuite recherchez l'accompagnement d'un locuteur natif.</p>

						<h4 id="learn-u1-ipa">Conventions API pour ce travail</h4>

						<p>Les choix de symboles API de Grayson forment l'inventaire canonique d'<em>Ilya</em>. Cet inventaire fini est le suivant :</p>

						<p class="ipa-specimen">[ː a ɑ b d e ɛ f ɡ ɣ h i ɪ ɨ j ʲ k l ɫ m n ɲ o p r s ʃ t u v ʌ x z ʒ]</p>

						<p>Trente et un symboles plus la marque de longueur. Certains vous seront immédiatement familiers grâce à votre travail dans d'autres langues : les plosives, les fricatives, les sonantes, les voyelles cardinales. D'autres seront nouveaux ou porteront des valeurs différentes de celles auxquelles vous êtes habitués. La voyelle <code>[o]</code>, comme nous le verrons à l'Unité 3, n'est pas l'allophone allemand étroitement fermé, mais un son beaucoup plus détendu et ouvert, situé entre <code>[ɔ]</code> et <code>[o]</code>; néanmoins, il reste entièrement distinct de l'<code>[o]</code> français mi-ouvert. Le symbole <code>[ʌ]</code> ne représente pas la voyelle anglaise de « strut », mais un <em>schwa</em> russe spécifique, choisi explicitement pour éviter l'arrondissement labial que <code>[ə]</code> invite trop facilement. Vous qui connaissez le <code>[ə]</code> français, vous comprendrez immédiatement le risque : le réflexe d'arrondir les lèvres pour ce symbole est profondément ancré dans votre formation, et c'est précisément ce que le russe n'admet pas ici. Le <code>[ʲ]</code> en exposant est le marqueur de palatalisation secondaire approuvé par l'API, officiellement adopté lors de la Convention de Kiel en 1989. C'est le mécanisme central de l'Unité 5.</p>

						<p>Là où l'inventaire de Grayson s'écarte de ce que vous connaissez actuellement, nous expliquerons la divergence. Là où il s'aligne, nous construirons sur cet alignement. Rappelons que la notation phonétique est paradigmatique, non absolue. Une comparaison de dix ressources de diction lyrique russe révèle dix approches différentes de la notation de la palatalisation seule, ainsi que des inventaires vocaliques allant de sept à dix symboles. Les choix de Grayson représentent un ensemble cohérent et bien raisonné parmi plusieurs, et les sélecteurs de notation d'<em>Ilya</em> dans l'onglet Transcription rendent ces choix à la fois visibles et réversibles.</p>

						<h3 id="learn-unit-2">Unité 2 · L'accent tonique</h3>

						<p>L'accent tonique russe est imprévisible : contrairement à l'italien, où l'accent pénultième est la norme, ou au français, où l'accent tombe sur la dernière syllabe du groupe rythmique, l'accent russe doit être appris pour chaque mot. Les dix auteurs de diction lyrique russe comparés dans ma recherche doctorale s'accordent tous sur ce point : l'accent est suffisamment fondamental pour que chacun d'entre eux le marque, bien qu'ils le fassent avec des conventions différentes (le marqueur de l'API, un diacritique aigu, un accent grave).</p>

						<p>Cette unité établit l'accent comme principe gouvernant l'ensemble du système. Chaque règle en aval (réduction vocalique, assimilation, reconstitution) dépend de la connaissance de la syllabe accentuée. Nous commençons par les homographes pour le démontrer. Le mot <em>мука</em>, par exemple, signifie « tourment » avec l'accent sur la première syllabe et « farine » avec l'accent sur la seconde. L'accent n'est pas un ornement; il change le sens, et il gouverne la prononciation de chaque voyelle du mot.</p>

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

						<h3 id="learn-unit-1">Unit 1 · Orientation</h3>

						<h4 id="learn-u1-alphabet">The Russian Alphabet Song</h4>

						<p>We begin with a song. Ken Griffiths was my coach at Tanglewood in the summer of 1999, and the Westernised Russian Alphabet Song he shared remains the most accessible entry point I know. To be clear, Russian children do not learn this song; they learn by rote. But we non-native learners will use this musical setting (repurposed from a traditional Russian drinking song) to introduce the thirty-three letters of the modern Cyrillic alphabet. The song finishes with a coda that translates roughly as "To speak Russian you need to learn the alphabet!" Before any phonological complexity arrives, you will have all thirty-three letters firmly in mind, with their names.</p>

						<p>A few of these names deserve attention at the outset. The consonants follow a predictable pattern: most are named by pairing the consonant sound with <code>[ɛ]</code> (as in <code>[bɛ]</code>, <code>[vɛ]</code>, <code>[dɛ]</code>), while a smaller group reverses the order and pairs <code>[ɛ]</code> before the consonant (<code>[ɛl]</code>, <code>[ɛm]</code>, <code>[ɛn]</code>, <code>[ɛr]</code>, <code>[ɛs]</code>, <code>[ɛf]</code>). This is conventional. What is less conventional, because it appears in none of the print literature, is what happens when certain vowel letters are pronounced in isolation. When the letter ⟨о⟩ stands alone or occurs at the end of a word, under stress, it finishes with a slight offglide: <code>[oːʌ̯]</code>. Likewise, when ⟨ы⟩ (velar-i) is word-final, it offglides toward <code>[i]</code>: <code>[ɨːi̯]</code>. I have observed that many native Russian speakers unconsciously exhibit these offglides while denying that they do it. These offglides are never notated in singers' IPA transcriptions, but I teach them as part of a natural, idiomatic pronunciation. This is in the same spirit that we teach the idiomatic North American English ⟨o⟩ as <code>[oːʊ̯]</code> rather than as a pure monophthong.</p>

						<p>The modern Russian Cyrillic alphabet uses thirty-three letters. Ten of these letters are vowels, but for our purposes the ten are our familiar five allophones /a e i o u/ rendered twice. Russian vowels are organized in two series: a "hard" series and a "soft" series. The Russian consonants are twenty-one in number. And finally, two Russian letters do not sound at all: these non-sounding signs are the hard sign (⟨ъ⟩, <em>tvyordyĭ znak</em>) and the soft sign (⟨ь⟩, <em>myagkiĭ znak</em>). We will explore the functions and purpose of the signs in Unit 4. Singers working from scores published before 1917 will encounter four additional characters (⟨ѣ⟩, ⟨і⟩, ⟨ѵ⟩, ⟨ѳ⟩), that have been made obsolete by historical spelling reforms. These letters can simply be substituted by their modern counterparts, and <em>Ilya</em> does this automatically for you.</p>

						<h4 id="learn-u1-italian">Italian and Russian: a shared foundation</h4>

						<p>Most classical singers encounter Italian songs and vocalises early in their study, because sung Italian employs a conservative inventory of seven cardinal vowel sounds: <code>[i e ɛ a ɔ o u]</code>. By comparison, sung Russian's ten-phoneme vowel inventory (not the orthographic letters, which coincidentally also number ten) consolidates a single /o/-allophone, but encompasses the remaining Italian set with four notable additions: <code>[ɪ ɨ ɑ ʌ]</code>. The resemblance is not coincidental. Russia directly injected its school of solo singing with <em>bel canto</em> practices by importing Italian composers, singers, and voice teachers in the eighteenth century. Correspondingly, masterfully sung Russian features an Italianate quality: a predilection for musically elongated vowels (which as a Slavic language may seem surprising to some), legato, and beauty of tone inherited from these Italian influencers. There is an old axiom, often repeated in the conservatoire: "To sound Russian, sing like an Italian."</p>

						<p>The parallels extend further. Neither Italian nor Russian employs nasal vowels. This exclusion agrees with classical efforts to keep the nasal port sealed by means of a consistently raised soft palate. Neither employs rhotic (r-coloured) vowels. Both depend on a steady balance of subglottic pressure (the classic <em>appoggio</em> of <em>bel canto</em> technique) paired with a steady flow of vibrant tone (<em>filare la voce</em>) to maintain their legato. In practical terms, the singer who has internalised the physical coordinations of sung Italian has an advantage, having already acquired many of the coordinations that sung Russian requires.</p>

						<p>In a 2018 interview, the renowned pedagogue Janice Chapman observed that Italian singers enjoy what she calls a "marvellous advantage": their language's tongue setting is higher and further back than in either English or German, placing the singer on supported airflow with a high tongue, a raised soft palate, and a low(er) larynx simultaneously. Chapman described this as "the resonant sweet spot" and as "a sort of pivot point for all the vowels to hang from." Russian shares aspects of this advantage. The "pivot point" that Chapman is remarking on has a name: it is called the <em>basis of articulation</em>.</p>

						<h4 id="learn-u1-basis">The basis of articulation</h4>

						<p>The basis of articulation is a linguistics construct that functions as a language-specific home base. Linguists associate this with the default posture and settings of the vocal tract during inter-speech pauses and hesitation vowels (the English "uh..." or "er..."). For singing, the basis of articulation is where the tongue body rests and how the vocal tract is shaped by default as the experienced singer prepares to sing in each language.</p>

						<p>Beatrice Honikman, in her seminal 1964 essay "Articulatory Settings," describes this as "the gross oral posture and mechanics, both external and internal, requisite as a framework for the comfortable, economic and fluent merging and integrating of the isolated sounds into that harmonious, cognizable whole which constitutes the established pronunciation of a language." She likens the concept to mechanical gears. Honikman offers an anecdote from her classroom: she would ask students, "Are you in English gear?" and when she heard them slipping back toward a foreign accent, she would remark, "You're out of gear." It is worth noting, as I observed in my doctoral research, that Honikman's influential essay fits oddly into its festschrift dedicated to Russophile Daniel Jones, whose own work was entirely divorced from its subject matter. Further, Honikman cites no corroborating references at all: every endnote is explanatory, not referential. Perhaps this conveys the impression that she is extemporizing on her considerable empirical experiences across French, English, Russian, German, Turkish, and several other languages. The concept is still contested among linguists today; Heinrich argues it is impossible to verify instrumentally. Yet Gick, Wilson, Koch, and Cook (2004) provide the first instrumental evidence of the basis of articulation, measuring language-specific differences at five locations in the vocal tract across English and French speakers. And as Kedrova and Borissoff observed in 2013, Western linguists' interest in the basis of articulation has waned, but for Russian linguists it has always remained a viable and attractive concept, especially in the teaching of phonetics and language typology.</p>

						<p>Among the constellation of other articulatory settings, a language's basis of articulation can be said to correspond to one of three generalized tongue "settings": advanced (the tongue mass sits forward, as in French), neutral (the tongue is centralized), or retracted (the tongue sits back, as in North American English). Russian features a neutral basis of articulation: the tongue body is neither advanced nor retracted. It is centralized. But what makes Russian exceptional is that its neutral basis of articulation manifests in two alternating versions: a non-fronted configuration (for non-palatalized sounds) and a fronted variation (for palatalized sounds). More on this in Unit 5.</p>

						<p>This is where the connection to classical singing becomes direct, and where a technical case for sung Russian begins to emerge. Skalozub's work with X-ray cinematography in the 1960s and 1970s showed that both versions of the Russian basis of articulation feature a default open vocal tract, as opposed to the other languages examined in her work. This corresponds to the classical ideal of the <em>gola aperta</em> (the "open throat"). As a pre-phonatory posture, this correspondence aligns beautifully with classical voice pedagogy.</p>

						<p>Two more of Russian's inherent oral postures are hallmarks of classical singing technique. The backed tongue of sung Russian's predominant dark-a vowel <code>[ɑ]</code> features a centralized tongue resting lower in the mouth, facilitating a low, stable larynx. The fronted version, activated by palatalization and the frequent <code>[i]</code> vowel, requires a fronted tongue, known to form part of a convergent resonator strategy. When the tongue mass advances, the rest of the tongue must follow, vacating the throat and creating greater resonance space in the pharynx. Borissoff captures this succinctly: "the Russian basis of articulation allows to produce both palatalised and non-palatalised sounds while the retracted centering of the English basis of articulation significantly restricts palatalisation." In other words, Russian gives the singer both configurations that classical technique strives for: a relaxed, low-larynx posture with an open-throated, convergent resonator shape. The two may alternate naturally as the language demands.</p>

						<p>Singers who learn to centralize their articulators for sung Russian are likely to experience less ambient tension and greater ease in tone production. With the articulators freer to constructively relax, the hyoid can descend, allowing the larynx to stabilize in a lower position in agreement with the neutral basis of articulation. These kinds of technical gains may well be portable to efficient singing in other languages. You already know four "gears." Russian introduces a fifth, and it is a gear that aligns with your technical goals.</p>

						<h4 id="learn-u1-lyric">Lyric diction versus spoken Russian</h4>

						<p>Lyric diction practices arise from a time before the advent of amplification devices for public speaking. Specifically for sung Russian, they are an amalgam of the Old Muscovite dialect filtered through <em>literaturnyĭ</em> (literary) and <em>stsenicheskoe</em> (stage) pronunciation conventions. These are stylized prescriptive targets for the stage, not descriptions of Contemporary Standard Russian (CSR). Russian lyric diction contents itself with a perhaps-stilted pronunciation that is 'of a time.' We might recognize this willing suspension of disbelief in English when a singer sings "new" as /njuː/ rather than /nuː/. It makes sense in song, but sounds elevated or even arch in everyday speech. This understanding is worth normalising early. The pronunciation you will learn from <em>Ilya</em> is not how Russians speak on the street. It is how they sing. And it will become how you sing in Russian.</p>

						<p>The practical upshot is that some speech-level phonemes are intentionally simplified into more singable versions: the letter ⟨щ⟩, for instance, is rendered in lyric diction as <code>[ʃʲː]</code> rather than the <code>[ʃʲtʃʲ]</code> that some native speakers would produce in speech. Russian and Italian plosives <code>[t]</code> and <code>[d]</code> share similar voice-onset times, so we can use the familiar Italian plosives to serve as reasonable lyric diction targets for Russian "hard" (unpalatalized) plosives. These constructive simplifications promote a useful continuity with the other sung languages you already know, providing familiar points of access for singers otherwise unaccustomed to Russian phonemes. It is well understood that diagrams and descriptions conceived for speech-level phonemes (such as those offered in Bolla's <em>Conspectus of Russian Speech Sounds</em>, 1981) have no onus to reflect the additional convergent, singing-optimized vocal tract shapes necessary for classical performance. <em>Ilya</em> is a very good tool, but in terms of mastering suitable instantiations for sung Russian, nothing compares to the ear of an informed coach and voice teacher. Prepare with <em>Ilya</em>, then seek coaching from a native speaker.</p>

						<h4 id="learn-u1-ipa">IPA conventions for this work</h4>

						<p>Grayson's choices of IPA symbols form the canonical inventory for <em>Ilya</em>. That finite inventory is:</p>

						<p class="ipa-specimen">[ː a ɑ b d e ɛ f ɡ ɣ h i ɪ ɨ j ʲ k l ɫ m n ɲ o p r s ʃ t u v ʌ x z ʒ]</p>

						<p>Thirty-one symbols plus the length mark. Some of these you will recognise immediately from your work in other languages: the plosives, the fricatives, the sonorants, the cardinal vowels. Others will be new or will carry different values than you are accustomed to. The vowel <code>[o]</code>, as we will see in Unit 3, is not the tightly closed German allophone but a much looser, more open sound between <code>[ɔ]</code> and <code>[o]</code>. The symbol <code>[ʌ]</code> represents not the British English "strut" vowel but a specific Russian <em>schwa</em>, chosen explicitly to avoid the lip-rounding that <code>[ə]</code> too readily invites in singers trained in French. The superscript <code>[ʲ]</code> is the IPA-approved marker for secondary palatalization, officially adopted at the Kiel Convention in 1989. This is the central mechanism of Unit 5.</p>

						<p>Where Grayson's inventory departs from what you currently know, we will explain the departure. Where it aligns, we will build on that alignment. Remember that phonetic notation is paradigmatic, not absolute. A comparison of ten Russian lyric diction resources reveals ten different approaches to the notation of palatalization alone, as well as vowel inventories ranging anywhere from seven to ten symbols. Grayson's choices are one well-reasoned set among several, and <em>Ilya</em>'s notation toggles in the Transcription tab make these choices both visible and reversible.</p>

						<h3 id="learn-unit-2">Unit 2 · Stress</h3>

						<p>Russian word stress is unpredictable: unlike Italian, where penultimate stress is the norm, or French, where stress falls on the final syllable of a phrase, Russian stress must be learned for each word individually. All ten Russian lyric diction authors compared in my doctoral research agree on this point: stress is fundamental enough that every one of them marks it, though they do so with different conventions (the IPA stress marker, an acute diacritic, a grave diacritic).</p>

						<p>This unit establishes stress as the governing principle of the entire system. Every downstream rule in Russian lyric diction (vowel reduction, assimilation, reconstitution) depends on knowing which syllable carries the stress. We begin with homographs to demonstrate this. The word <em>мука</em>, for instance, means "torment" with stress on the first syllable and "flour" with stress on the second. Stress is not cosmetic; it changes meaning, and it governs the pronunciation of every vowel in the word.</p>

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
						<div class="placeholder-content">
							<h1>{language === 'fr' ? 'Guide' : 'Guide'}</h1>
							<p>
								{language === 'fr'
									? 'En préparation. Le Guide offrira un guide d\u2019utilisation, la méthodologie derrière Ilya et un contexte biographique.'
									: 'In preparation. The Guide will offer a user guide, the methodology behind Ilya, and biographical context.'}
							</p>
						</div>
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
