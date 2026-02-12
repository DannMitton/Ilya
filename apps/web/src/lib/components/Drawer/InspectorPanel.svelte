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

	// Display IPA in the word header, reflecting spot reconstitution
	const headerIpa = $derived.by(() => {
		const useReconstituted =
			(notationPrefs.reconstitution && word.ipaReconstituted) ||
			(isSpotActive && word.ipaReconstituted);
		const base = useReconstituted ? word.ipaReconstituted : word.ipaDisplay;
		return base ? applyNotationPreferences(base, notationPrefs) : '';
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			onback();
		}
	}

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

	function ribbonLabel(entry: DisplayLogEntry): string {
		if (entry.ipa === '' || entry.ipa === null) return '';
		return entry.ipa;
	}

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
		// Try requested language first, then fall back
		if (typeof data[lang] === 'string') return data[lang] as string;
		if (typeof data.en === 'string') return data.en;
		if (typeof data.text === 'string') return data.text;
		return '';
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="inspector-panel" role="region" aria-label={word.stressedCyrillic} onkeydown={handleKeydown}>
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

	<!-- Ribbon: per-character breakdown -->
	{#if word.displayLog.length > 0}
		<div class="section">
			<h3 class="section-label">{t('inspector.ribbon', language)}</h3>
			<div class="ribbon">
				{#each word.displayLog as entry, i}
					<div class="ribbon-cell" class:stressed={entry.features?.stressed}>
						<span class="ribbon-char">{entry.char}</span>
						<span class="ribbon-arrow">↓</span>
						<span class="ribbon-ipa">{ribbonLabel(entry) || '∅'}</span>
						{#if entry.features?.rule}
							<span class="ribbon-rule">{entry.features.rule}</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Spot reconstitution toggle -->
	{#if word.ipaReconstituted}
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

	<!-- Blurb details -->
	{#if word.displayLog.some(hasBlurb)}
		<div class="section">
			<h3 class="section-label">{t('inspector.blurbs', language)}</h3>
			<div class="blurb-list">
				{#each word.displayLog.filter(hasBlurb) as entry}
					<div class="blurb-entry">
						<span class="blurb-char">{entry.char} → {ribbonLabel(entry) || '∅'}</span>
						<p class="blurb-text">{getBlurbText(entry, language)}</p>
					</div>
				{/each}
			</div>
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

	/* ── Ribbon ────────────────────────────────────────────────── */

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
	}

	.ribbon-cell.stressed {
		background: #fdf6e8;
		border-color: var(--sage);
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

	.ribbon-rule {
		font-family: var(--font-sans);
		font-size: 0.65rem;
		color: var(--ink-tertiary);
		text-align: center;
		max-width: 4rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
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

	/* ── Blurb notes ─────────────────────────────────────────── */

	.blurb-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.blurb-entry {
		font-size: 0.85rem;
	}

	.blurb-char {
		font-family: var(--font-sans);
		font-weight: 600;
		color: var(--ink-secondary);
		display: block;
		margin-bottom: 0.2rem;
	}

	.blurb-text {
		font-family: var(--font-serif);
		color: var(--ink-secondary);
		line-height: 1.5;
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
