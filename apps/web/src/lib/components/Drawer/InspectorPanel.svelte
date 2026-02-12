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
	}

	let { word, language, notationPrefs, spotReconstituted = false, onback, onspotrecontoggle }: Props = $props();

	// Whether spot reconstitution is effectively active for this word
	const isSpotActive = $derived(spotReconstituted && !notationPrefs.reconstitution);

	// Display IPA in the word header: use ipaContent (pre-merge) for analysis context,
	// not ipaDisplay (which contains fused clitic material on host words).
	const headerIpa = $derived.by(() => {
		const useReconstituted =
			(notationPrefs.reconstitution && word.ipaOwnReconstituted) ||
			(isSpotActive && word.ipaOwnReconstituted);
		const base = useReconstituted ? word.ipaOwnReconstituted : word.ipaContent;
		return base ? applyNotationPreferences(base, notationPrefs) : '';
	});

	// ── Ribbon interaction state ────────────────────────────────
	// Index of the currently selected (revealed) ribbon cell, or -1 if none
	let selectedCellIndex = $state(-1);
	// Index of the cell that has roving tabindex focus
	let focusedCellIndex = $state(0);

	// Reset selection when the inspected word changes
	$effect(() => {
		void word.cleanWord;
		selectedCellIndex = -1;
		focusedCellIndex = 0;
	});

	// ── Ribbon entries with clitic arrow ────────────────────────
	// For clitics, prepend (enclitic) or append (proclitic) a directional arrow cell.
	interface RibbonEntry {
		type: 'character' | 'clitic-arrow';
		entry?: DisplayLogEntry;
		char: string;
		ipa: string;
		index: number;
		direction?: 'proclitic' | 'enclitic';
	}

	const ribbonEntries = $derived.by((): RibbonEntry[] => {
		const entries: RibbonEntry[] = [];
		let idx = 0;

		// Enclitic: arrow first
		if (word.isEnclitic) {
			entries.push({
				type: 'clitic-arrow',
				char: '←',
				ipa: '',
				index: idx,
				direction: 'enclitic',
			});
			idx++;
		}

		// Character cells from displayLog
		for (const entry of word.displayLog) {
			entries.push({
				type: 'character',
				entry,
				char: entry.char,
				ipa: entry.ipa ?? '',
				index: idx,
			});
			idx++;
		}

		// Proclitic: arrow last
		if (word.isProclitic) {
			entries.push({
				type: 'clitic-arrow',
				char: '→',
				ipa: '',
				index: idx,
				direction: 'proclitic',
			});
			idx++;
		}

		return entries;
	});

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

	// ── Provenance icon ─────────────────────────────────────────

	const provenanceIcon = $derived((() => {
		const src = word.stressSource;
		switch (src) {
			case 'dictionary':
				return { type: 'dictionary', colour: '#059669' };
			case 'supplement':
				return { type: 'supplement', colour: '#2563eb' };
			case 'yo-rule':
			case 'yo-restored':
				return { type: 'yo', colour: '#7c3aed' };
			case 'inferred':
				return { type: 'inferred', colour: '#d97706' };
			case 'unknown':
				return { type: 'unknown', colour: '#d97706' };
			default:
				return null;
		}
	})());

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
>
	<!-- Back button -->
	<button class="back-btn" onclick={onback}>
		{t('inspector.back', language)}
	</button>

	<!-- Word header -->
	<div class="word-header">
		<h2 class="word-cyrillic">{word.stressedCyrillic}</h2>
		<p class="word-ipa">{headerIpa}</p>
		{#if word.gloss}
			<p class="word-gloss">{word.gloss}</p>
		{/if}
	</div>

	<!-- Stress provenance -->
	<div class="section">
		<h3 class="section-label">{t('inspector.stress', language)}</h3>
		<div class="stress-info">
			{#if word.stressIndex >= 0}
				<p class="stress-text">
					{#if provenanceIcon}
						<span class="provenance-inline" aria-hidden="true">
							{#if provenanceIcon.type === 'dictionary'}
								<svg width="12" height="12" viewBox="0 0 10 10">
									<path d="M1.5 5.5 L4 8 L8.5 2.5" fill="none" stroke={provenanceIcon.colour} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							{:else if provenanceIcon.type === 'supplement'}
								<svg width="12" height="12" viewBox="0 0 10 10">
									<path d="M5 0.8 L6.1 3.5 L9 3.7 L6.8 5.8 L7.4 8.8 L5 7.3 L2.6 8.8 L3.2 5.8 L1 3.7 L3.9 3.5 Z" fill={provenanceIcon.colour}/>
								</svg>
							{:else if provenanceIcon.type === 'yo'}
								<svg width="12" height="12" viewBox="0 0 10 10">
									<text x="5" y="9" text-anchor="middle" font-size="9" font-weight="600" fill={provenanceIcon.colour}>ё</text>
								</svg>
							{:else if provenanceIcon.type === 'inferred'}
								<svg width="12" height="12" viewBox="0 0 10 10">
									<path d="M1 6 Q3 3.5, 5 6 Q7 8.5, 9 6" fill="none" stroke={provenanceIcon.colour} stroke-width="1.5" stroke-linecap="round"/>
								</svg>
							{:else if provenanceIcon.type === 'unknown'}
								<svg width="12" height="12" viewBox="0 0 10 10">
									<text x="5" y="8.5" text-anchor="middle" font-size="9" font-weight="600" fill={provenanceIcon.colour}>?</text>
								</svg>
							{/if}
						</span>
					{/if}
					{t('inspector.syllable', language)} {word.stressIndex + 1} · {stressSourceLabel(word.stressSource, language)}
				</p>
			{:else if word.stressIndex === -1}
				<p class="stress-text">{t('inspector.clitic', language)}</p>
			{:else}
				<p class="stress-text">
					{#if provenanceIcon}
						<span class="provenance-inline" aria-hidden="true">
							<svg width="12" height="12" viewBox="0 0 10 10">
								<text x="5" y="8.5" text-anchor="middle" font-size="9" font-weight="600" fill={provenanceIcon.colour}>?</text>
							</svg>
						</span>
					{/if}
					{t('inspector.unknownStress', language)}
				</p>
			{/if}
		</div>
	</div>

	<!-- Ribbon: click-to-reveal character breakdown -->
	{#if ribbonEntries.length > 0}
		<div class="section ribbon-section">
			<h3 class="section-label">{t('inspector.ribbon', language)}</h3>
			<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
			<div
				class="ribbon"
				role="listbox"
				aria-label={t('inspector.ribbon', language)}
				aria-orientation="horizontal"
				onkeydown={handleRibbonKeydown}
				bind:this={ribbonEl}
			>
				{#each ribbonEntries as re, i}
					{#if re.type === 'clitic-arrow'}
						<button
							class="ribbon-cell clitic-arrow"
							class:selected={selectedCellIndex === i}
							role="option"
							aria-selected={selectedCellIndex === i}
							aria-label={re.direction === 'enclitic' ? t('inspector.cliticArrow.enclitic', language) : t('inspector.cliticArrow.proclitic', language)}
							tabindex={focusedCellIndex === i ? 0 : -1}
							data-cell-id="{word.lineIndex}-{word.wordIndex}-{i}"
							onclick={() => handleCellClick(i)}
						>
							<span class="ribbon-arrow-icon">{re.char}</span>
						</button>
					{:else}
						<button
							class="ribbon-cell"
							class:stressed={re.entry?.features?.stressed}
							class:selected={selectedCellIndex === i}
							class:has-blurb={re.entry ? hasBlurb(re.entry) : false}
							role="option"
							aria-selected={selectedCellIndex === i}
							tabindex={focusedCellIndex === i ? 0 : -1}
							data-cell-id="{word.lineIndex}-{word.wordIndex}-{i}"
							onclick={() => handleCellClick(i)}
						>
							<span class="ribbon-char">{re.char}</span>
							<span class="ribbon-arrow">↓</span>
							<span class="ribbon-ipa">{re.ipa || '∅'}</span>
						</button>
					{/if}
				{/each}
			</div>

			<!-- Detail box with speech-bubble caret -->
			{#if selectedRibbonEntry}
				<div class="detail-container">
					<div
						class="detail-caret"
						style="left: {caretLeft}px"
					></div>
					<div class="detail-box" aria-live="polite">
						{#if selectedRibbonEntry.type === 'clitic-arrow'}
							<p class="detail-header">
								<span class="detail-char">{selectedRibbonEntry.char}</span>
								<span class="detail-arrow">·</span>
								<span class="detail-ipa">
									{selectedRibbonEntry.direction === 'enclitic'
										? t('inspector.cliticArrow.encliticLabel', language)
										: t('inspector.cliticArrow.procliticLabel', language)}
								</span>
							</p>
							<p class="detail-blurb">
								{selectedRibbonEntry.direction === 'enclitic'
									? t('inspector.cliticArrow.encliticBlurb', language)
									: t('inspector.cliticArrow.procliticBlurb', language)}
							</p>
						{:else if selectedRibbonEntry.entry}
							<p class="detail-header">
								<span class="detail-char">{selectedRibbonEntry.char}</span>
								<span class="detail-arrow">→</span>
								<span class="detail-ipa">{selectedRibbonEntry.ipa || '∅'}</span>
							</p>
							{#if hasBlurb(selectedRibbonEntry.entry)}
								<p class="detail-blurb">{getBlurbText(selectedRibbonEntry.entry, language)}</p>
							{:else}
								<p class="detail-no-blurb">{t('inspector.noBlurb', language)}</p>
							{/if}
						{/if}
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Spot reconstitution toggle: only when reconstituted IPA differs from default -->
	{#if word.ipaReconstituted && word.ipaReconstituted !== word.ipaDisplay}
		<div class="section">
			<h3 class="section-label">{t('inspector.spotRecon.heading', language)}</h3>
			{#if notationPrefs.reconstitution}
				<!-- Global reconstitution is on: show disabled state with explanation -->
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
				<!-- Per-word toggle active -->
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

	<!-- Notation indicator (read-only) -->
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
	}

	/* ── Back button ─────────────────────────────────────────── */

	.back-btn {
		background: none;
		border: none;
		color: var(--sage);
		cursor: pointer;
		font-family: var(--font-sans);
		font-size: 0.85rem;
		padding: 0.25rem 0;
		margin-bottom: 1rem;
		text-align: left;
		width: fit-content;
	}

	.back-btn:hover {
		text-decoration: underline;
	}

	/* ── Word header ─────────────────────────────────────────── */

	.word-header {
		margin-bottom: 1.5rem;
	}

	.word-cyrillic {
		font-family: var(--font-serif);
		font-size: 1.6rem;
		font-weight: 600;
		color: var(--ink-primary);
		margin-bottom: 0.25rem;
	}

	.word-ipa {
		font-family: var(--font-sans);
		font-size: 1.15rem;
		color: var(--ink-secondary);
		margin-bottom: 0.35rem;
	}

	.word-gloss {
		font-family: var(--font-serif);
		font-size: 0.85rem;
		color: var(--terracotta);
		font-style: italic;
	}

	/* ── Sections ──────────────────────────────────────────────── */

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

	/* ── Stress info ─────────────────────────────────────────── */

	.stress-info {
		font-family: var(--font-sans);
		font-size: 0.85rem;
		color: var(--ink-primary);
	}

	.stress-text {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.provenance-inline {
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
	}

	/* ── Ribbon: clickable character cells ─────────────────────── */

	.ribbon {
		display: flex;
		flex-wrap: wrap;
		gap: 0.1rem;
	}

	.ribbon-cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.1rem;
		padding: 0.3rem 0.3rem;
		background: var(--paper-cream);
		border: 1px solid var(--stone-300);
		border-radius: 4px;
		min-width: 1.75rem;
		cursor: pointer;
		font-family: inherit;
		transition: border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease;
	}

	.ribbon-cell:hover {
		border-color: var(--sage);
		background: #faf8f4;
	}

	.ribbon-cell:focus-visible {
		outline: 2px solid var(--sage);
		outline-offset: 1px;
	}

	.ribbon-cell.stressed {
		background: #fdf6e8;
		border-color: var(--sage);
	}

	.ribbon-cell.selected {
		border: 2px solid var(--sage);
		background: #FAF7F2;
		box-shadow: inset 0 0 6px rgba(139, 154, 125, 0.15);
	}

	/* Subtle dot indicator that a cell has a blurb */
	.ribbon-cell.has-blurb::after {
		content: '';
		display: block;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--sage);
		opacity: 0.4;
		margin-top: 1px;
	}

	.ribbon-cell.selected.has-blurb::after {
		opacity: 0.8;
	}

	/* Clitic directional arrow cell */
	.ribbon-cell.clitic-arrow {
		background: transparent;
		border-color: var(--sage);
		border-style: dashed;
		min-width: 1.5rem;
		justify-content: center;
	}

	.ribbon-cell.clitic-arrow.selected {
		background: #FAF7F2;
		border-style: solid;
	}

	.ribbon-arrow-icon {
		font-size: 1.1rem;
		color: var(--sage);
		font-weight: 600;
		line-height: 1;
	}

	.ribbon-char {
		font-family: var(--font-serif);
		font-size: 1rem;
		font-weight: 600;
		color: var(--ink-primary);
	}

	.ribbon-arrow {
		font-size: 0.6rem;
		color: var(--ink-tertiary);
		line-height: 1;
	}

	.ribbon-ipa {
		font-family: var(--font-sans);
		font-size: 0.95rem;
		color: var(--ink-secondary);
	}

	/* ── Detail box with speech-bubble caret ───────────────────── */

	.detail-container {
		position: relative;
		margin-top: 12px;
	}

	.detail-caret {
		position: absolute;
		top: -8px;
		width: 12px;
		height: 8px;
		margin-left: -6px;
		clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
		background: #F5F0E8;
		z-index: 1;
		transition: left 200ms ease;
	}

	.detail-box {
		background: #F5F0E8;
		border: 1px solid var(--stone-300);
		border-radius: 4px;
		padding: 16px;
		max-height: 200px;
		overflow-y: auto;
		animation: detailIn 250ms ease forwards;
	}

	@keyframes detailIn {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.detail-header {
		display: flex;
		align-items: baseline;
		gap: 0.35rem;
		margin-bottom: 0.5rem;
	}

	.detail-char {
		font-family: var(--font-serif);
		font-variant-caps: all-small-caps;
		font-size: 13px;
		font-weight: 600;
		color: var(--ink-primary);
		letter-spacing: 0.03em;
	}

	.detail-arrow {
		font-size: 0.7rem;
		color: var(--ink-tertiary);
	}

	.detail-ipa {
		font-family: var(--font-sans);
		font-size: 0.95rem;
		color: var(--ink-secondary);
	}

	.detail-blurb {
		font-family: var(--font-serif);
		font-size: 15px;
		line-height: 1.6;
		color: var(--ink-secondary);
	}

	.detail-no-blurb {
		font-family: var(--font-serif);
		font-size: 0.85rem;
		color: var(--ink-tertiary);
		font-style: italic;
	}

	/* ── Spot reconstitution toggle ──────────────────────────── */

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

	/* ── Notation indicator ──────────────────────────────────── */

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
