<script lang="ts">
	import type { WordStackData } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import { applyNotationPreferences } from '@ilya/phonology';
	import { t, type Language } from '$lib/i18n';

	interface Props {
		word: WordStackData;
		notationPrefs: NotationPreferences;
		showStressDiacritics?: boolean;
		language?: Language;
		onwordclick?: (word: WordStackData) => void;
	}

	let { word, notationPrefs, showStressDiacritics = false, language = 'en', onwordclick }: Props = $props();

	// Use reconstituted IPA when toggle is on, otherwise display IPA
	const displayIpa = $derived.by(() => {
		const base = notationPrefs.reconstitution && word.ipaReconstituted
			? word.ipaReconstituted
			: word.ipaDisplay;
		return base ? applyNotationPreferences(base, notationPrefs) : '';
	});

	// Apply combining acute accent to the stressed vowel in Cyrillic
	const displayCyrillic = $derived.by(() => {
		if (!showStressDiacritics || !word.cyrillic) return word.cyrillic;
		if (word.stressIndex === undefined || word.stressIndex < 0) return word.cyrillic;

		const chars = [...word.cyrillic];
		const vowels = 'аеёиоуыэюяАЕЁИОУЫЭЮЯ';
		let vowelCount = 0;

		for (let i = 0; i < chars.length; i++) {
			if (vowels.includes(chars[i])) {
				if (vowelCount === word.stressIndex) {
					// ё and Ё are inherently stressed — never add acute accent
					if (chars[i] !== 'ё' && chars[i] !== 'Ё') {
						chars[i] = chars[i] + '\u0301';
					}
					break;
				}
				vowelCount++;
			}
		}

		return chars.join('');
	});

	// Strip leading subject pronouns from verb glosses, but ONLY when
	// 2+ words remain after stripping (preserves conjugation signal).
	// "we will descend" → "will descend" ✓
	// "I love" → "I love" (kept: single word after strip looks like infinitive)
	const displayGloss = $derived.by(() => {
		if (!word.gloss) return '';
		const pronouns = ['i ', 'you ', 'he ', 'she ', 'it ', 'we ', 'they ', 'one '];
		const lower = word.gloss.toLowerCase();
		for (const p of pronouns) {
			if (lower.startsWith(p)) {
				const remainder = word.gloss.slice(p.length);
				// Only strip if remainder is multi-word (has a space)
				if (remainder.includes(' ')) {
					return remainder;
				}
			}
		}
		return word.gloss;
	});

	const isClitic = $derived(word.stressSource === 'clitic' || word.isProclitic || word.isEnclitic);

	// Show provenance icon only for non-standard sources
	const showProvenance = $derived(
		word.stressSource !== 'dictionary' &&
		word.stressSource !== 'supplement' &&
		word.stressSource !== 'clitic' &&
		word.stressSource !== undefined
	);

	const isInferred = $derived(word.stressSource === 'inferred');

	function handleClick() {
		onwordclick?.(word);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onwordclick?.(word);
		}
	}
</script>

<div
	class="word-stack"
	class:is-clitic={isClitic}
	class:has-provenance={showProvenance && !isInferred}
	class:is-inferred={isInferred}
	role="button"
	tabindex="0"
	data-word-index="{word.lineIndex}-{word.wordIndex}"
	onclick={handleClick}
	onkeydown={handleKeydown}
	aria-label="{word.cyrillic}: {displayIpa}"
>
	{#if showProvenance && !isInferred}
		<span class="provenance-icon" aria-hidden="true">
			{#if word.stressSource === 'user-dictionary'}
				<svg viewBox="0 0 16 16" class="prov-svg"><path d="M2 1.5C2 .67 2.67 0 3.5 0h9c.83 0 1.5.67 1.5 1.5v12c0 .83-.67 1.5-1.5 1.5H4a2 2 0 0 1-2-2V1.5zM3.5 1a.5.5 0 0 0-.5.5V11h9V1.5a.5.5 0 0 0-.5-.5h-9zM3 12v1a1 1 0 0 0 1 1h8.5a.5.5 0 0 0 .5-.5V12H3z" fill="currentColor"/></svg>
			{:else if word.stressSource === 'user-composer'}
				<svg viewBox="0 0 16 16" class="prov-svg"><path d="M9 0a1 1 0 0 1 1 1v5.268l4.562 2.084a1 1 0 0 1 .438.838v5.31a1.5 1.5 0 1 1-3 0V9.81L9 8.268V14.5a1.5 1.5 0 1 1-3 0V1a1 1 0 0 1 1-1h2z" fill="currentColor"/></svg>
			{:else if word.stressSource === 'user-override'}
				<svg viewBox="0 0 16 16" class="prov-svg"><path d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM3 14s-1 0-1-1 1-5 6-5 6 4 6 5-1 1-1 1H3z" fill="currentColor"/></svg>
			{:else if word.stressSource === 'yo-rule' || word.stressSource === 'yo-restored'}
				<span class="yo-icon">ё</span>
			{/if}
		</span>
	{/if}

	<!-- IPA row -->
	<span class="ipa-row" class:clitic-ipa={isClitic}>
		{#if isClitic && word.cliticDirection === 'proclitic'}
			<span class="clitic-arrow">→</span>
		{:else if isClitic && word.cliticDirection === 'enclitic'}
			<span class="clitic-arrow">←</span>
		{:else}
			{displayIpa}
		{/if}
	</span>

	<!-- Cyrillic row -->
	<span class="cyrillic-row">
		{displayCyrillic}
	</span>

	<!-- Gloss row -->
	{#if displayGloss}
		<span class="gloss-row" class:clitic-gloss={isClitic}>
			{displayGloss}
		</span>
	{/if}

	<!-- VERIFY label for inferred stress: sits on the bottom border, interrupting it -->
	{#if isInferred}
		<span class="verify-label">{t('verify.label', language)}</span>
	{/if}
</div>

<style>
	.word-stack {
		display: inline-flex;
		flex-direction: column;
		align-items: flex-start;
		position: relative;
		cursor: pointer;
		padding: 2px 4px;
		border-radius: 2px;
		transition: background-color 150ms ease;
		line-height: 1.3;
	}

	.word-stack:hover {
		background-color: rgba(139, 154, 125, 0.08);
	}

	.word-stack:focus-visible {
		outline: 2px solid var(--sage);
		outline-offset: 2px;
	}

	/* Inferred stress: dashed border box with negative margins
	   to neutralize the extra space so VERIFY stacks align with neighbours.
	   Border: 1.5px, extra padding: 3px top/bottom and 3px left/right,
	   plus the VERIFY label hangs below. Negative margins cancel the expansion. */
	.is-inferred {
		border: 1.5px dashed #78716c;
		padding: 5px 7px;
		margin: -4.5px -4.5px 0 -4.5px;
	}

	/* Override focus ring for inferred words so outline doesn't fight border */
	.is-inferred:focus-visible {
		outline-offset: 4px;
	}

	.ipa-row {
		font-family: var(--font-sans);
		font-size: 1rem;
		color: var(--ink-secondary);
		white-space: nowrap;
	}

	.cyrillic-row {
		font-family: var(--font-serif);
		font-size: 1rem;
		font-weight: 600;
		color: var(--ink-primary);
		white-space: nowrap;
	}

	.gloss-row {
		font-family: var(--font-serif);
		font-size: 0.8rem;
		font-style: italic;
		color: var(--terracotta);
		white-space: nowrap;
	}

	/* Clitic: IPA shows arrow, gloss shows role */
	.clitic-ipa {
		color: var(--ink-tertiary);
	}

	.clitic-arrow {
		color: var(--sage);
		font-size: 0.85rem;
	}

	.clitic-gloss {
		color: var(--ink-tertiary);
		font-style: italic;
	}

	/* Reduced gap for clitics to visually connect with host */
	.is-clitic {
		padding-left: 1px;
		padding-right: 1px;
	}

	/* Provenance icons — top-right with reserved padding to avoid IPA collision */
	.has-provenance .ipa-row {
		padding-right: 12px;
	}

	.provenance-icon {
		position: absolute;
		top: 0;
		right: 0;
		width: 0.5em;
		height: 0.5em;
		color: #78716c;
		opacity: 0.4;
		transition: opacity 150ms ease;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
	}

	.word-stack:hover .provenance-icon {
		opacity: 1;
		color: #44403c;
	}

	.prov-svg {
		width: 100%;
		height: 100%;
	}

	.yo-icon {
		font-family: var(--font-sans);
		font-weight: 700;
		font-size: 10px;
		line-height: 1;
	}

	/* VERIFY label: fieldset-legend pattern.
	   Sits centred on the bottom border, background interrupts the dashed line. */
	.verify-label {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translate(-50%, 50%);
		font-family: var(--font-sans);
		font-size: 11px;
		font-variant-caps: all-small-caps;
		letter-spacing: 0.04em;
		color: #78716c;
		background: var(--paper-cream);
		padding: 0 6px;
		white-space: nowrap;
		line-height: 1;
		z-index: 1;
	}

	@media print {
		.word-stack {
			cursor: default;
			background: transparent !important;
		}
		.word-stack:hover {
			background: transparent;
		}
		.verify-label {
			background: white;
		}
	}
</style>
