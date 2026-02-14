<script lang="ts">
	import type { WordStackData } from '$lib/types';
	import type { DisplayLogEntry } from '@ilya/blurb';
	import { applyNotationPreferences } from '@ilya/phonology';
	import type { NotationPreferences } from '@ilya/phonology';
	import { t, stressSourceLabel, type Language } from '$lib/i18n';

	interface Props {
		word: WordStackData;
		language: Language;
		notationPrefs: NotationPreferences;
		spotReconstituted?: boolean;
		onback: () => void;
		onspotrecontoggle?: () => void;
		onstressassign?: (syllableIndex: number, source: string) => void;
		onstressrevert?: () => void;
		onyotoggle?: () => void;
	}

	let { word, language, notationPrefs, spotReconstituted = false, onback, onspotrecontoggle, onstressassign, onstressrevert, onyotoggle }: Props = $props();

	// ── Reconstitution derivations ──────────────────────────────
	const isSpotActive = $derived(spotReconstituted && !notationPrefs.reconstitution);
	const reconActive = $derived(notationPrefs.reconstitution || isSpotActive);

	// Per-entry reconstituted IPA map (index → reconstituted IPA for entries that differ)
	const reconstitutedIpaMap = $derived.by((): Map<number, string> => {
		if (!word.ipaContent || !word.ipaOwnReconstituted) return new Map();
		if (word.ipaContent === word.ipaOwnReconstituted) return new Map();

		const strip = (s: string) => s.replace(/[\sˈ]/g, '');
		const orig = strip(word.ipaContent);
		const recon = strip(word.ipaOwnReconstituted);

		if (orig.length !== recon.length) return new Map();

		const map = new Map<number, string>();
		let pos = 0;
		for (let i = 0; i < word.displayLog.length; i++) {
			const entryIpa = word.displayLog[i].ipa ?? '';
			if (entryIpa.length === 0) continue;
			const reconIpa = recon.substring(pos, pos + entryIpa.length);
			if (reconIpa !== entryIpa) {
				map.set(i, reconIpa);
			}
			pos += entryIpa.length;
		}
		return map;
	});

	// Header IPA: use ipaContent (pre-merge) for analysis, not ipaDisplay (fused clitic)
	const headerIpa = $derived.by(() => {
		const useReconstituted =
			(notationPrefs.reconstitution && word.ipaOwnReconstituted) ||
			(isSpotActive && word.ipaOwnReconstituted);
		const base = useReconstituted ? word.ipaOwnReconstituted : word.ipaContent;
		return base ? applyNotationPreferences(base, notationPrefs) : '';
	});

	// ── Ribbon interaction state ────────────────────────────────
	let selectedCellIndex = $state(-1);
	let focusedCellIndex = $state(0);

	// Reset selection when the inspected word changes
	$effect(() => {
		void word.cleanWord;
		selectedCellIndex = -1;
		focusedCellIndex = 0;
	});

	// ── Ribbon entries with clitic arrows ────────────────────────
	interface RibbonEntry {
		type: 'character' | 'clitic-arrow';
		entry?: DisplayLogEntry;
		char: string;
		ipa: string;
		index: number;
		direction?: 'proclitic' | 'enclitic';
		syllableIndex: number;
	}

	const isClitic = $derived(word.isProclitic || word.isEnclitic);

	const ribbonEntries = $derived.by((): RibbonEntry[] => {
		const entries: RibbonEntry[] = [];
		let idx = 0;

		if (word.isEnclitic) {
			entries.push({
				type: 'clitic-arrow',
				char: '←',
				ipa: '',
				index: idx,
				direction: 'enclitic',
				syllableIndex: -1,
			});
			idx++;
		}

		for (let di = 0; di < word.displayLog.length; di++) {
			const entry = word.displayLog[di];
			const baseIpa = entry.ipa ?? '';
			const displayIpa = reconActive && reconstitutedIpaMap.has(di)
				? reconstitutedIpaMap.get(di)!
				: baseIpa;
			const si = (entry as Record<string, unknown>).syllableIndex as number ?? 0;
			entries.push({
				type: 'character',
				entry,
				char: entry.char,
				ipa: displayIpa,
				index: idx,
				syllableIndex: si,
			});
			idx++;
		}

		if (word.isProclitic) {
			entries.push({
				type: 'clitic-arrow',
				char: '→',
				ipa: '',
				index: idx,
				direction: 'proclitic',
				syllableIndex: -1,
			});
			idx++;
		}

		return entries;
	});

	// ── Syllable groups for Grayson positional headers ──────────
	interface SyllableGroup {
		syllableIndex: number;
		positionKey: string | null;
		entries: RibbonEntry[];
	}

	function getGraysonPositionKey(syllableIndex: number, stressIndex: number): string | null {
		if (stressIndex < 0) return null;
		if (syllableIndex === stressIndex) return 'ribbon.stressed';
		if (syllableIndex === stressIndex - 1) return 'ribbon.immediatePre';
		if (syllableIndex < stressIndex - 1) return 'ribbon.remotePre';
		if (syllableIndex === stressIndex + 1) return 'ribbon.immediatePost';
		return 'ribbon.remotePost';
	}

	const syllableGroups = $derived.by((): SyllableGroup[] => {
		const charEntries = ribbonEntries.filter(re => re.type === 'character');
		if (charEntries.length === 0) return [];

		const groups: SyllableGroup[] = [];
		let currentGroup: SyllableGroup | null = null;

		for (const re of charEntries) {
			if (!currentGroup || currentGroup.syllableIndex !== re.syllableIndex) {
				currentGroup = {
					syllableIndex: re.syllableIndex,
					positionKey: getGraysonPositionKey(re.syllableIndex, word.stressIndex),
					entries: [],
				};
				groups.push(currentGroup);
			}
			currentGroup.entries.push(re);
		}

		return groups;
	});

	const showSyllableGroups = $derived(syllableGroups.length > 0);

	const selectedRibbonEntry = $derived(
		selectedCellIndex >= 0 && selectedCellIndex < ribbonEntries.length
			? ribbonEntries[selectedCellIndex]
			: null
	);

	// ── Caret positioning via DOM measurement ───────────────
	let caretLeft = $state(0);
	let ribbonEl: HTMLElement | undefined = $state(undefined);

	$effect(() => {
		if (selectedCellIndex < 0 || !ribbonEl) return;
		const cell = ribbonEl.querySelector<HTMLElement>(
			`[data-cell-id="${word.lineIndex}-${word.wordIndex}-${selectedCellIndex}"]`
		);
		if (!cell) return;
		const ribbonRect = ribbonEl.getBoundingClientRect();
		const cellRect = cell.getBoundingClientRect();
		caretLeft = cellRect.left - ribbonRect.left + cellRect.width / 2;
	});

	function handleCellClick(index: number) {
		const entry = ribbonEntries[index];
		// Clitic arrows have no blurb
		if (entry?.type === 'clitic-arrow') return;
		if (selectedCellIndex === index) {
			selectedCellIndex = -1;
		} else {
			selectedCellIndex = index;
		}
		focusedCellIndex = index;
	}

	function handleRibbonKeydown(e: KeyboardEvent) {
		const len = ribbonEntries.length;
		if (len === 0) return;

		switch (e.key) {
			case 'ArrowRight': {
				e.preventDefault();
				const next = focusedCellIndex + 1;
				if (next < len) {
					focusedCellIndex = next;
					focusCellByIndex(next);
				}
				break;
			}
			case 'ArrowLeft': {
				e.preventDefault();
				const prev = focusedCellIndex - 1;
				if (prev >= 0) {
					focusedCellIndex = prev;
					focusCellByIndex(prev);
				}
				break;
			}
			case 'Enter':
			case ' ': {
				e.preventDefault();
				handleCellClick(focusedCellIndex);
				break;
			}
			case 'Escape': {
				if (selectedCellIndex >= 0) {
					e.preventDefault();
					e.stopPropagation();
					selectedCellIndex = -1;
				}
				break;
			}
		}
	}

	function focusCellByIndex(index: number) {
		requestAnimationFrame(() => {
			const el = document.querySelector<HTMLElement>(
				`[data-cell-id="${word.lineIndex}-${word.wordIndex}-${index}"]`
			);
			el?.focus();
		});
	}

	function handlePanelKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && selectedCellIndex < 0) {
			e.preventDefault();
			onback();
		}
	}

	// ── Rubric label HTML with hard line breaks ─────────────────
	function getRubricHtml(positionKey: string, lang: Language): string {
		const text = t(positionKey, lang);
		if (positionKey === 'ribbon.stressed') return text;
		return text.replace(' ', '<br>');
	}

	// ── Stress assignment state ─────────────────────────────────
	const isUserStress = $derived(
		word.stressSource === 'user-dictionary' ||
		word.stressSource === 'user-composer' ||
		word.stressSource === 'user-override'
	);

	const syllableCount = $derived(word.syllables?.length ?? 0);

	const canAssignStress = $derived(
		!word.isProclitic && !word.isEnclitic && syllableCount > 0
	);

	let assigningSyllable = $state<number | null>(null);
	let _prevWord = '';

	function handleSyllableHeaderClick(syllableIndex: number) {
		if (!canAssignStress) return;
		if (word.cleanWord !== _prevWord) {
			_prevWord = word.cleanWord;
			assigningSyllable = null;
		}
		if (syllableIndex === word.stressIndex) {
			assigningSyllable = assigningSyllable === syllableIndex ? null : syllableIndex;
		} else {
			assigningSyllable = syllableIndex;
		}
	}

	function handleProvenanceChoice(syllableIndex: number, source: string) {
		onstressassign?.(syllableIndex, source);
		assigningSyllable = null;
	}

	// ── Blurb helpers ───────────────────────────────────────────
	function hasBlurb(entry: DisplayLogEntry): boolean {
		return !!(entry.blurbData && (
			(entry.blurbData as Record<string, unknown>).en ||
			(entry.blurbData as Record<string, unknown>).fr ||
			(entry.blurbData as Record<string, unknown>).text
		));
	}

	function getBlurbText(entry: DisplayLogEntry, lang: Language): string {
		if (!entry.blurbData) return '';
		const data = entry.blurbData as Record<string, unknown>;
		if (typeof data[lang] === 'string') return data[lang] as string;
		if (typeof data.en === 'string') return data.en;
		if (typeof data.text === 'string') return data.text;
		return '';
	}
</script>

<div
	class="inspector-panel"
	role="region"
	aria-label={word.stressedCyrillic}
	onkeydown={handlePanelKeydown}
	tabindex="-1"
>
	<!-- ═══ 1. Back button (pill) ═══ -->
	<button class="back-btn" onclick={onback}>
		{t('inspector.back', language)}
	</button>

	<!-- ═══ 2. Word header ═══ -->
	<div class="word-header">
		<h2 class="word-cyrillic">{word.stressedCyrillic}</h2>
		<p class="word-ipa">{headerIpa}</p>
		{#if word.gloss}
			<p class="word-gloss">{word.gloss}</p>
		{:else if language === 'fr'}
			<p class="word-gloss-missing">{t('inspector.glossMissing', language)}</p>
		{/if}
	</div>

	<!-- ═══ 3. Organism (ribbon + blurb) ═══ -->
	{#if ribbonEntries.length > 0}
		<div class="organism" class:blurb-open={selectedRibbonEntry !== null}>

			<div
				class="ribbon-body"
				role="listbox"
				aria-label={t('inspector.ribbon', language)}
				aria-orientation="horizontal"
				onkeydown={handleRibbonKeydown}
				bind:this={ribbonEl}
				tabindex="-1"
			>
				<!-- Enclitic arrow (standalone atom, no molecule) -->
				{#if word.isEnclitic}
					{@const arrowEntry = ribbonEntries[0]}
					<div class="syllable-column clitic-column">
						<div class="rubric-spacer" aria-hidden="true"></div>
						<button
							class="atom clitic-atom"
							role="option"
							aria-selected={false}
							aria-label={t('inspector.cliticArrow.enclitic', language)}
							tabindex={focusedCellIndex === arrowEntry.index ? 0 : -1}
							data-cell-id="{word.lineIndex}-{word.wordIndex}-{arrowEntry.index}"
							onclick={() => handleCellClick(arrowEntry.index)}
						>
							<span class="atom-arrow-icon">{arrowEntry.char}</span>
						</button>
						<div class="ordinal-spacer" aria-hidden="true"></div>
					</div>
				{/if}

				<!-- Syllable columns -->
				{#if showSyllableGroups}
					{#each syllableGroups as group, gi}
						<div class="syllable-column" role="group" aria-label="Syllable {group.syllableIndex + 1}">
							<!-- Rubric label (Grayson positional, clickable for stress) -->
							<button
								class="rubric-label"
								class:can-assign={canAssignStress}
								class:is-stressed={group.syllableIndex === word.stressIndex && !isClitic}
								onclick={() => handleSyllableHeaderClick(group.syllableIndex)}
								disabled={!canAssignStress}
								aria-label="Assign stress to syllable {group.syllableIndex + 1}"
							>
								{#if isClitic}
									{t('ribbon.unstressed', language)}
								{:else if group.positionKey}
									{@html getRubricHtml(group.positionKey, language)}
								{/if}
							</button>

							<!-- Molecule (syllable bounding box) -->
							<div
								class="molecule"
								class:is-stressed={group.syllableIndex === word.stressIndex && !isClitic}
							>
								{#each group.entries as re, ai}
									<button
										class="atom"
										class:stressed-vowel={re.entry?.features?.stressed && !isClitic}
										class:selected={selectedCellIndex === re.index}
										class:has-blurb={re.entry ? hasBlurb(re.entry) : false}
										role="option"
										aria-selected={selectedCellIndex === re.index}
										tabindex={focusedCellIndex === re.index ? 0 : -1}
										data-cell-id="{word.lineIndex}-{word.wordIndex}-{re.index}"
										onclick={() => handleCellClick(re.index)}
									>
										<span class="atom-char">{re.char}</span>
										<span class="atom-arrow">↓</span>
										<span class="atom-ipa">{re.ipa || '∅'}</span>
									</button>
								{/each}
							</div>

							<!-- Ordinal with stress dot -->
							<div class="ordinal">
								{#if group.syllableIndex === word.stressIndex && !isClitic}
									<span class="stress-dot" aria-hidden="true"></span>
								{/if}
								<span class="ordinal-num">{group.syllableIndex + 1}</span>
							</div>
						</div>
					{/each}
				{:else}
					<!-- Fallback: flat ribbon when no syllable data -->
					{#each ribbonEntries.filter(re => re.type === 'character') as re}
						<div class="syllable-column">
							<div class="rubric-spacer" aria-hidden="true"></div>
							<div class="molecule">
								<button
									class="atom"
									class:selected={selectedCellIndex === re.index}
									class:has-blurb={re.entry ? hasBlurb(re.entry) : false}
									role="option"
									aria-selected={selectedCellIndex === re.index}
									tabindex={focusedCellIndex === re.index ? 0 : -1}
									data-cell-id="{word.lineIndex}-{word.wordIndex}-{re.index}"
									onclick={() => handleCellClick(re.index)}
								>
									<span class="atom-char">{re.char}</span>
									<span class="atom-arrow">↓</span>
									<span class="atom-ipa">{re.ipa || '∅'}</span>
								</button>
							</div>
							<div class="ordinal-spacer" aria-hidden="true"></div>
						</div>
					{/each}
				{/if}

				<!-- Proclitic arrow (standalone atom, no molecule) -->
				{#if word.isProclitic}
					{@const arrowEntry = ribbonEntries[ribbonEntries.length - 1]}
					<div class="syllable-column clitic-column">
						<div class="rubric-spacer" aria-hidden="true"></div>
						<button
							class="atom clitic-atom"
							role="option"
							aria-selected={false}
							aria-label={t('inspector.cliticArrow.proclitic', language)}
							tabindex={focusedCellIndex === arrowEntry.index ? 0 : -1}
							data-cell-id="{word.lineIndex}-{word.wordIndex}-{arrowEntry.index}"
							onclick={() => handleCellClick(arrowEntry.index)}
						>
							<span class="atom-arrow-icon">{arrowEntry.char}</span>
						</button>
						<div class="ordinal-spacer" aria-hidden="true"></div>
					</div>
				{/if}
			</div>

			<!-- Blurb area (inside organism, below ribbon body) -->
			<div class="blurb-wrapper" class:open={selectedRibbonEntry !== null}>
				<div class="blurb-inner">
					{#if selectedRibbonEntry}
						<div class="blurb-container">
							<!-- SVG caret: 16x10px, sage border on angled sides only -->
							<svg
								class="blurb-caret"
								width="16"
								height="10"
								viewBox="0 0 16 10"
								aria-hidden="true"
								style="left: {caretLeft}px"
							>
								<polygon points="0,10 8,0 16,10" fill="#F5F0E8" />
								<polyline points="0,10 8,0 16,10" fill="none" stroke="var(--sage)" stroke-width="2" stroke-linejoin="round" />
							</svg>
							<div class="blurb-box" aria-live="polite">
								{#if selectedRibbonEntry.entry}
									<p class="blurb-header">
										<span class="blurb-char">{selectedRibbonEntry.char}</span>
										<span class="blurb-arrow-sep">→</span>
										<span class="blurb-ipa">{selectedRibbonEntry.ipa || '∅'}</span>
									</p>
									{#if hasBlurb(selectedRibbonEntry.entry)}
										<p class="blurb-text">{getBlurbText(selectedRibbonEntry.entry, language)}</p>
									{:else}
										<p class="blurb-no-text">{t('inspector.noBlurb', language)}</p>
									{/if}
								{/if}
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- ═══ 4. Provenance section (below organism) ═══ -->
	{#if !isClitic}
	<div class="section provenance-section">
		<h3 class="section-label">{t('inspector.provenance', language)}</h3>
		<div class="provenance-body">
			{#if word.stressIndex >= 0}
				<p class="provenance-status">
					{t('inspector.syllable', language)} {word.stressIndex + 1} · {stressSourceLabel(word.stressSource, language)}
				</p>
			{:else}
				<p class="provenance-status">{t('inspector.unknownStress', language)}</p>
			{/if}

			<!-- ё ↔ е toggle -->
			{#if word.yoAlternation && word.yoAlternateForm}
				<button class="provenance-link yo-link" onclick={() => onyotoggle?.()}>
					{t('inspector.yoToggle', language)}
				</button>
			{:else}
				<span class="provenance-link yo-link disabled" aria-hidden="true">
					{t('inspector.yoToggle', language)}
				</span>
			{/if}

			<!-- Stress assignment: provenance chooser (when assigning) -->
			{#if assigningSyllable !== null}
				<div class="provenance-chooser">
					<span class="provenance-chooser-label">{t('inspector.syllable', language)} {assigningSyllable + 1}:</span>
					<button class="provenance-choice" onclick={() => handleProvenanceChoice(assigningSyllable!, 'user-dictionary')}>
						{t('inspector.stressAssign.dictionary', language)}
					</button>
					<button class="provenance-choice" onclick={() => handleProvenanceChoice(assigningSyllable!, 'user-composer')}>
						{t('inspector.stressAssign.composer', language)}
					</button>
					<button class="provenance-choice" onclick={() => handleProvenanceChoice(assigningSyllable!, 'user-override')}>
						{t('inspector.stressAssign.myAssignment', language)}
					</button>
				</div>
			{/if}

			<!-- Revert link for user-assigned stress -->
			{#if isUserStress}
				<div class="provenance-revert">
					<button class="provenance-link" onclick={() => onstressrevert?.()}>
						{t('inspector.stressAssign.dictionary', language)}
					</button>
				</div>
			{/if}
		</div>
	</div>
	{/if}

	<!-- ═══ 5. Spot reconstitution toggle ═══ -->
	{#if word.ipaReconstituted && word.ipaReconstituted !== word.ipaDisplay}
		<div class="section">
			<h3 class="section-label">{t('inspector.spotRecon.heading', language)}</h3>
			{#if notationPrefs.reconstitution}
				<div class="spot-recon-disabled">
					<div class="spot-recon-row">
						<span class="spot-label left">{t('inspector.spotRecon.left', language)}</span>
						<button
							class="toggle-switch disabled"
							role="switch"
							aria-checked="true"
							aria-label={t('inspector.spotRecon.right', language)}
							disabled
							title={t('inspector.spotRecon.globalOn', language)}
						>
							<span class="toggle-thumb"></span>
						</button>
						<span class="spot-label right">{t('inspector.spotRecon.right', language)}</span>
					</div>
					<p class="spot-hint">{t('inspector.spotRecon.globalOn', language)}</p>
				</div>
			{:else}
				<div class="spot-recon-row">
					<span class="spot-label left" class:active={!spotReconstituted}>{t('inspector.spotRecon.left', language)}</span>
					<button
						class="toggle-switch"
						class:on={spotReconstituted}
						role="switch"
						aria-checked={spotReconstituted}
						aria-label={t('inspector.spotRecon.right', language)}
						onclick={() => onspotrecontoggle?.()}
					>
						<span class="toggle-thumb"></span>
					</button>
					<span class="spot-label right" class:active={spotReconstituted}>{t('inspector.spotRecon.right', language)}</span>
				</div>
			{/if}
		</div>
	{/if}

	<!-- ═══ 6. Notation indicator ═══ -->
	<div class="section notation-indicator">
		<p class="notation-note">{t('inspector.notationDefault', language)}</p>
	</div>
</div>

<style>
	.inspector-panel {
		display: flex;
		flex-direction: column;
		gap: 0;
		padding: 1.5rem;
		height: 100%;
		overflow-y: auto;
		animation: inspectorBreathIn 250ms cubic-bezier(0.4, 0, 0.2, 1) both;
	}

	@keyframes inspectorBreathIn {
		from { opacity: 0; transform: translateY(-2px); }
		to   { opacity: 1; transform: translateY(0); }
	}

	@media (prefers-reduced-motion: reduce) {
		.inspector-panel {
			animation: none;
		}
	}

	/* ═══ 1. Back button (pill) ═══════════════════════════════════ */

	.back-btn {
		background: transparent;
		border: 1.5px solid var(--stone-300);
		border-radius: 999px;
		color: var(--ink-secondary);
		cursor: pointer;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 500;
		padding: 6px 16px;
		margin-bottom: 1rem;
		text-align: left;
		width: fit-content;
		transition: border-color 150ms ease, color 150ms ease;
	}

	.back-btn:hover {
		border-color: var(--stone-500, #78716c);
		color: var(--ink-primary);
	}

	.back-btn:active {
		border-color: var(--sage);
	}

	/* ═══ 2. Word header ═════════════════════════════════════════ */

	.word-header {
		margin-bottom: 1.5rem;
		display: inline-flex;
		flex-direction: column;
		align-items: flex-start;
		border: 1px solid var(--sage);
		border-radius: 2px;
		padding: 0.5rem 0.75rem;
		background: var(--paper-cream);
	}

	.word-cyrillic {
		font-family: var(--font-serif);
		font-size: 1.6rem;
		font-weight: 600;
		color: var(--ink-primary);
		margin-bottom: 0.1rem;
		line-height: 1.3;
	}

	.word-ipa {
		font-family: var(--font-sans);
		font-size: 1.15rem;
		color: var(--ink-secondary);
		margin-bottom: 0.15rem;
		line-height: 1.3;
	}

	.word-gloss {
		font-family: var(--font-serif);
		font-size: 0.85rem;
		color: var(--terracotta);
		font-style: italic;
		line-height: 1.3;
	}

	.word-gloss-missing {
		font-family: var(--font-serif);
		font-size: 0.8rem;
		color: var(--ink-tertiary);
		font-style: italic;
		line-height: 1.4;
	}

	/* ═══ 3. Organism (ribbon frame) ═════════════════════════════ */

	.organism {
		border-top: 1px solid var(--stone-300);
		border-bottom: 1px solid var(--stone-300);
		padding: 12px 0 8px;
		margin-bottom: 1.25rem;
	}

	/* ── Ribbon body: flex row of syllable columns ─────────────── */

	.ribbon-body {
		display: flex;
		align-items: flex-end;
		gap: 12px;
		flex-wrap: wrap;
		row-gap: 8px;
	}

	/* ── Syllable column: rubric + molecule + ordinal ─────────── */

	.syllable-column {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0;
		flex-shrink: 0;
	}

	.clitic-column {
		align-self: flex-end;
	}

	/* ── Rubric labels (Grayson positional headers) ───────────── */

	.rubric-label {
		font-family: var(--font-sans);
		font-size: 0.6rem;
		font-weight: 400;
		font-variant-caps: all-small-caps;
		letter-spacing: 0.08em;
		color: var(--ink-secondary);
		line-height: 1.2;
		text-align: center;
		min-height: 28px;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding: 0 2px 4px;
		background: none;
		border: none;
		border-radius: 3px;
		cursor: default;
		width: 100%;
		transition: background-color 150ms ease;
	}

	.rubric-label.can-assign {
		cursor: pointer;
	}

	.rubric-label.can-assign:hover {
		background: rgba(139, 154, 125, 0.08);
	}

	.rubric-label.is-stressed {
		color: var(--ink-primary);
		font-weight: 500;
	}

	.rubric-spacer {
		min-height: 28px;
		padding-bottom: 4px;
	}

	/* ── Molecules (syllable bounding boxes) ─────────────────── */

	.molecule {
		display: flex;
		gap: 2px;
		padding: 3px;
		border: 1px solid var(--stone-300);
		border-radius: 6px;
		transition: border-color 150ms ease, box-shadow 150ms ease;
	}

	.molecule.is-stressed {
		border: 2px solid var(--sage);
		padding: 2px;
		box-shadow: 0 0 0 2px rgba(139, 154, 125, 0.2);
	}

	/* ── Atoms (glyph cells) ─────────────────────────────────── */

	.atom {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 3px;
		width: 32px;
		min-height: 72px;
		padding: 8px 0;
		background: var(--paper-cream);
		border: 1px solid var(--stone-300);
		border-radius: 4px;
		cursor: pointer;
		font-family: inherit;
		transition: border-color 150ms ease, background-color 150ms ease;
		user-select: none;
	}

	.atom:hover {
		background: #faf8f4;
		border-color: var(--sage);
	}

	.atom:focus-visible {
		outline: 2px solid var(--sage);
		outline-offset: -2px;
		z-index: 1;
	}

	.atom.stressed-vowel {
		background: #fdf6e8;
	}

	.atom.selected {
		background: #FAF7F2;
		border-color: var(--sage);
		box-shadow: inset 0 0 6px rgba(139, 154, 125, 0.15);
	}

	/* Subtle blurb indicator dot */
	.atom.has-blurb::after {
		content: '';
		display: block;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--sage);
		opacity: 0.4;
		margin-top: 1px;
	}

	.atom.selected.has-blurb::after {
		opacity: 0.8;
	}

	.atom-char {
		font-family: var(--font-serif);
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--ink-primary);
		line-height: 1;
	}

	.atom-arrow {
		font-size: 0.6rem;
		color: var(--ink-tertiary);
		line-height: 1;
	}

	.atom-ipa {
		font-family: var(--font-sans);
		font-size: 0.85rem;
		color: var(--ink-secondary);
		line-height: 1;
	}

	/* ── Clitic arrow atom (standalone, no molecule) ──────────── */

	.clitic-atom {
		width: 32px;
		min-height: 72px;
		padding: 8px 0;
		background: transparent;
		border: 1px solid var(--stone-200, #e7e5e4);
		border-radius: 0;
		cursor: default;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: inherit;
	}

	.atom-arrow-icon {
		font-size: 1.1rem;
		color: var(--stone-400, #a8a29e);
		font-weight: 600;
		line-height: 1;
	}

	/* ── Ordinals ────────────────────────────────────────────── */

	.ordinal {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 3px;
		padding-top: 6px;
		padding-left: 2px;
	}

	.ordinal-num {
		font-family: var(--font-sans);
		font-size: 0.6rem;
		color: var(--ink-secondary);
		line-height: 1;
	}

	.ordinal-spacer {
		padding-top: 6px;
		min-height: 12px;
	}

	.stress-dot {
		display: inline-block;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--sage);
		flex-shrink: 0;
	}

	/* ═══ Blurb (inside organism, below ribbon body) ══════════════ */

	.blurb-wrapper {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 250ms ease;
	}

	.blurb-wrapper.open {
		grid-template-rows: 1fr;
	}

	.blurb-inner {
		overflow: hidden;
	}

	.blurb-container {
		position: relative;
		margin-top: 14px;
		padding-bottom: 4px;
		animation: blurbFadeIn 250ms ease both;
	}

	@keyframes blurbFadeIn {
		from {
			opacity: 0;
			transform: scale(0.98) translateY(4px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.blurb-caret {
		position: absolute;
		top: -9px;
		margin-left: -8px;
		z-index: 1;
		overflow: visible;
		transition: left 200ms ease;
	}

	.blurb-box {
		background: #F5F0E8;
		border: 2px solid var(--sage);
		border-radius: 6px;
		padding: 16px;
		max-height: 200px;
		overflow-y: auto;
		box-shadow: 0 4px 12px rgba(26, 22, 18, 0.08);
	}

	.blurb-header {
		display: flex;
		align-items: baseline;
		gap: 0.35rem;
		margin-bottom: 0.5rem;
	}

	.blurb-char {
		font-family: var(--font-serif);
		font-variant-caps: all-small-caps;
		font-size: 13px;
		font-weight: 600;
		color: var(--ink-primary);
		letter-spacing: 0.03em;
	}

	.blurb-arrow-sep {
		font-size: 0.7rem;
		color: var(--ink-tertiary);
	}

	.blurb-ipa {
		font-family: var(--font-sans);
		font-size: 0.95rem;
		color: var(--ink-secondary);
	}

	.blurb-text {
		font-family: var(--font-serif);
		font-size: 15px;
		line-height: 1.6;
		color: var(--ink-secondary);
	}

	.blurb-no-text {
		font-family: var(--font-serif);
		font-size: 0.85rem;
		color: var(--ink-tertiary);
		font-style: italic;
	}

	/* ═══ 4. Provenance section ══════════════════════════════════ */

	.section {
		margin-bottom: 1.25rem;
	}

	.section-label {
		font-family: var(--font-sans);
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--sage);
		margin-bottom: 0.5rem;
	}

	.provenance-section {
		/* Extra top spacing after organism */
	}

	.provenance-body {
		font-family: var(--font-sans);
		font-size: 0.85rem;
		color: var(--ink-primary);
	}

	.provenance-status {
		line-height: 1.4;
	}

	/* ── Provenance text links ───────────────────────────────── */

	.provenance-link {
		background: none;
		border: none;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		color: var(--sage);
		cursor: pointer;
		padding: 0.2rem 0;
		display: inline-block;
		text-align: left;
		transition: color 150ms ease;
	}

	.provenance-link:hover {
		text-decoration: underline;
		color: #6b7d5f;
	}

	.provenance-link.disabled {
		opacity: 0.35;
		cursor: default;
		pointer-events: none;
	}

	.yo-link {
		display: block;
		margin-top: 0.25rem;
	}

	/* ── Provenance chooser (stress source selection) ──────── */

	.provenance-chooser {
		display: flex;
		gap: 0.25rem;
		flex-wrap: wrap;
		align-items: baseline;
		margin-top: 0.5rem;
		padding: 6px 0;
	}

	.provenance-chooser-label {
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--ink-secondary);
		margin-right: 0.25rem;
	}

	.provenance-choice {
		background: var(--paper-cream);
		border: 1px solid var(--stone-300);
		border-radius: 3px;
		font-family: var(--font-sans);
		font-size: 0.7rem;
		color: var(--ink-secondary);
		cursor: pointer;
		padding: 2px 8px;
		white-space: nowrap;
		transition: border-color 150ms ease, background-color 150ms ease;
	}

	.provenance-choice:hover {
		border-color: var(--sage);
		background: #faf8f4;
		color: var(--ink-primary);
	}

	.provenance-revert {
		margin-top: 0.25rem;
	}

	/* ═══ 5. Spot reconstitution toggle ══════════════════════════ */

	.spot-recon-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.spot-label {
		font-family: var(--font-sans);
		font-size: 0.8rem;
		color: var(--ink-tertiary);
		transition: color 150ms ease;
	}

	.spot-label.active {
		color: var(--ink-primary);
		font-weight: 600;
	}

	.toggle-switch {
		position: relative;
		width: 32px;
		height: 18px;
		background: var(--stone-300);
		border: none;
		border-radius: 9px;
		cursor: pointer;
		padding: 0;
		transition: background-color 200ms ease;
		flex-shrink: 0;
	}

	.toggle-switch.on {
		background: var(--sage);
	}

	.toggle-switch.disabled {
		background: var(--stone-300);
		opacity: 0.5;
		cursor: not-allowed;
	}

	.toggle-thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 14px;
		height: 14px;
		background: white;
		border-radius: 50%;
		transition: transform 200ms ease;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
	}

	.toggle-switch.on .toggle-thumb {
		transform: translateX(14px);
	}

	.spot-recon-disabled {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.spot-hint {
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--ink-tertiary);
		font-style: italic;
		line-height: 1.4;
	}

	/* ═══ 6. Notation indicator ══════════════════════════════════ */

	.notation-indicator {
		margin-top: auto;
		padding-top: 1rem;
		border-top: 1px solid var(--stone-300);
	}

	.notation-note {
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--ink-tertiary);
	}
</style>
