<script lang="ts">
	import type { WordStackData } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import { applyNotationPreferences } from '@ilya/phonology';

	interface Props {
		word: WordStackData;
		notationPrefs: NotationPreferences;
		printMode?: boolean;
		onclick?: (word: WordStackData) => void;
	}

	let { word, notationPrefs, printMode = false, onclick }: Props = $props();

	const displayIpa = $derived((() => {
		// Pick the correct base IPA: reconstituted or standard
		const base = notationPrefs.reconstitution
			? word.ipaReconstituted
			: word.ipaDisplay;
		// Apply string-based notation transforms (includeGeminates = true for Paper)
		return applyNotationPreferences(base, notationPrefs, true);
	})());

	const provenance = $derived((() => {
		if (printMode) return null;
		const src = word.stressSource;
		if (word.isProclitic || word.isEnclitic) return null;
		switch (src) {
			case 'dictionary':
				return { type: 'dictionary', label: 'Stress verified from dictionary', colour: '#059669' };
			case 'supplement':
				return { type: 'supplement', label: 'Stress from singer supplement', colour: '#2563eb' };
			case 'yo-rule':
			case 'yo-restored':
				return { type: 'yo', label: 'Stress derived from ё', colour: '#7c3aed' };
			case 'inferred':
				return { type: 'inferred', label: 'Stress algorithmically inferred', colour: '#d97706' };
			case 'unknown':
				return { type: 'unknown', label: 'Unknown stress — verify manually', colour: '#d97706' };
			default:
				return null;
		}
	})());

	function handleClick() {
		if (!printMode) onclick?.(word);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (printMode) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onclick?.(word);
		}
	}
</script>

<div
	class="word-stack"
	class:proclitic={word.isProclitic}
	class:enclitic={word.isEnclitic}
	class:unknown-stress={word.stressSource === 'inferred' || word.stressSource === 'unknown'}
	class:print-mode={printMode}
	data-word-index="{word.lineIndex}-{word.wordIndex}"
	tabindex={printMode ? -1 : 0}
	role={printMode ? undefined : 'button'}
	aria-label={printMode ? undefined : `${word.cleanWord}, ${displayIpa}`}
	onclick={handleClick}
	onkeydown={handleKeydown}
>
	{#if provenance}
		<span class="provenance provenance-{provenance.type}" aria-label={provenance.label} title={provenance.label}>
			{#if provenance.type === 'dictionary'}
				<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
					<path d="M1.5 5.5 L4 8 L8.5 2.5" fill="none" stroke={provenance.colour} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			{:else if provenance.type === 'supplement'}
				<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
					<path d="M5 0.8 L6.1 3.5 L9 3.7 L6.8 5.8 L7.4 8.8 L5 7.3 L2.6 8.8 L3.2 5.8 L1 3.7 L3.9 3.5 Z" fill={provenance.colour}/>
				</svg>
			{:else if provenance.type === 'yo'}
				<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
					<text x="5" y="9" text-anchor="middle" font-size="9" font-weight="600" fill={provenance.colour}>ё</text>
				</svg>
			{:else if provenance.type === 'inferred'}
				<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
					<path d="M1 6 Q3 3.5, 5 6 Q7 8.5, 9 6" fill="none" stroke={provenance.colour} stroke-width="1.5" stroke-linecap="round"/>
				</svg>
			{:else if provenance.type === 'unknown'}
				<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
					<text x="5" y="8.5" text-anchor="middle" font-size="9" font-weight="600" fill={provenance.colour}>?</text>
				</svg>
			{/if}
		</span>
	{/if}
	<span class="ipa">{displayIpa}</span>
	<span class="cyrillic">
		{word.stressedCyrillic}<span class="punct">{word.punctuation}</span>
	</span>
</div>

<style>
	.word-stack {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.1rem;
		min-width: 2.5rem;
		cursor: pointer;
		border-radius: 4px;
		padding: 0.25rem 0.35rem;
		transition: background 0.12s;
		position: relative;
	}

	.word-stack.print-mode {
		cursor: default;
		padding: 0.15rem 0.25rem;
	}

	.word-stack:hover:not(.print-mode) {
		background: rgba(0, 0, 0, 0.04);
	}

	.word-stack:focus-visible {
		outline: 2px solid #4a90d9;
		outline-offset: 2px;
	}

	.word-stack.proclitic,
	.word-stack.enclitic {
		opacity: 0.6;
	}

	.word-stack.unknown-stress {
		border-bottom: 2px dashed #e2a500;
		padding-bottom: 0.15rem;
	}

	/* ── Provenance icon ─────────────────────────────────────── */

	.provenance {
		position: absolute;
		top: 1px;
		right: 2px;
		width: 10px;
		height: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.55;
		transition: opacity 0.12s;
		pointer-events: none;
	}

	.word-stack:hover .provenance {
		opacity: 0.85;
	}

	.ipa {
		font-size: 1.1rem;
		letter-spacing: 0.02em;
		white-space: nowrap;
	}

	.cyrillic {
		font-size: 0.85rem;
		color: #374151;
	}

	.punct {
		color: #9ca3af;
	}
</style>
