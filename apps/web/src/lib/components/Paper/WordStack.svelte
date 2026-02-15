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
		spotReconstituted?: boolean;
		onwordclick?: (word: WordStackData) => void;
	}

	let { word, notationPrefs, showStressDiacritics = false, language = 'en', spotReconstituted = false, onwordclick }: Props = $props();

	// Spot reconstitution active: per-word reconstitution is ON and global is OFF
	const isSpotActive = $derived(spotReconstituted && !notationPrefs.reconstitution);

	// Use reconstituted IPA when:
	//   - Global reconstitution toggle is on, OR
	//   - Spot reconstitution is active for this word (and global is off)
	const displayIpa = $derived.by(() => {
		const useReconstituted =
			(notationPrefs.reconstitution && word.ipaReconstituted) ||
			(isSpotActive && word.ipaReconstituted);
		const base = useReconstituted ? word.ipaReconstituted : word.ipaDisplay;
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

	// Show provenance icon only for non-standard sources (not dictionary, supplement, clitic)
	const showProvenance = $derived(
		word.stressSource !== 'dictionary' &&
		word.stressSource !== 'supplement' &&
		word.stressSource !== 'clitic' &&
		word.stressSource !== undefined
	);

	const isInferred = $derived(word.stressSource === 'inferred');

	// Whether any top-right icon is present (provenance or R sigla)
	const hasTopRightIcon = $derived((showProvenance && !isInferred) || isSpotActive);

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
	class:has-top-right-icon={hasTopRightIcon}
	class:is-inferred={isInferred}
	role="button"
	tabindex="0"
	data-word-index="{word.lineIndex}-{word.wordIndex}"
	onclick={handleClick}
	onkeydown={handleKeydown}
	aria-label="{word.cyrillic}: {displayIpa}"
>
	<!-- Top-right icon area: provenance icons and/or R sigla -->
	{#if (showProvenance && !isInferred) || isSpotActive}
		<span class="icon-area" aria-hidden="true">
			{#if showProvenance && !isInferred}
				<span class="provenance-icon">
					{#if word.stressSource === 'user-dictionary'}
						<svg viewBox="0 0 16 16" class="prov-svg"><path d="M8 2C6.5 1 4 .5 1 1v11c3 0 5.5.5 7 2 1.5-1.5 4-2 7-2V1c-3-.5-5.5 0-7 1z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" stroke-width="1"/></svg>
					{:else if word.stressSource === 'user-composer'}
						<svg viewBox="0 0 16 16" class="prov-svg"><ellipse cx="4" cy="13" rx="2.5" ry="1.8" transform="rotate(-20 4 13)" fill="currentColor"/><ellipse cx="11.5" cy="12" rx="2.5" ry="1.8" transform="rotate(-20 11.5 12)" fill="currentColor"/><rect x="5.5" y="1.5" width="1.3" height="11.5" fill="currentColor"/><rect x="12.5" y="1.5" width="1.3" height="10.5" fill="currentColor"/><rect x="5.5" y="1.5" width="8.3" height="2" rx="0.3" fill="currentColor"/></svg>
					{:else if word.stressSource === 'user-override'}
						<svg viewBox="0 0 16 16" class="prov-svg"><path d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM3 14s-1 0-1-1 1-5 6-5 6 4 6 5-1 1-1 1H3z" fill="currentColor"/></svg>
					{:else if word.stressSource === 'yo-rule' || word.stressSource === 'yo-restored'}
						<svg viewBox="0 0 16 16" class="prov-svg"><circle cx="5.5" cy="2.5" r="1.3" fill="currentColor"/><circle cx="10.5" cy="2.5" r="1.3" fill="currentColor"/><path d="M4 10h8c0-3-2-4.5-4-4.5S4 7 4 10c0 2.5 1.5 4.5 4 4.5 1.5 0 3-.5 4-2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
					{/if}
					<!-- Task 4.8 reset sigla (↺): counterclockwise arrow, same visual weight.
					     SVG for reference, to be placed in InspectorPanel:
					     <svg viewBox="0 0 16 16" class="prov-svg"><path d="M3.5 6A5 5 0 1 1 4 10.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M1 5l2.5 1 1-2.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
					-->
				</span>
			{/if}
			{#if isSpotActive}
				<span class="recon-sigla">R</span>
			{/if}
		</span>
	{/if}

	<!-- IPA row: fixed height -->
	<span class="ipa-row" class:clitic-ipa={isClitic}>
		{#if isClitic && word.cliticDirection === 'proclitic'}
			<span class="clitic-arrow">→</span>
		{:else if isClitic && word.cliticDirection === 'enclitic'}
			<span class="clitic-arrow">←</span>
		{:else}
			{displayIpa}
		{/if}
	</span>

	<!-- Cyrillic row: fixed height, anchor row -->
	<span class="cyrillic-row">
		{displayCyrillic}
	</span>

	<!-- Gloss row: ALWAYS rendered to reserve vertical space.
	     Empty glosses produce a blank row at the same height,
	     keeping Cyrillic baseline consistent across all stacks. -->
	<span class="gloss-row" class:clitic-gloss={isClitic && displayGloss}>
		{displayGloss || '\u00A0'}
	</span>

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
		justify-content: flex-end;
		position: relative;
		cursor: pointer;
		padding: 2px 4px;
		border-radius: 2px;
		transition: background-color 150ms ease;
		line-height: 1.15;
		box-sizing: border-box;
		height: 100%;
	}

	.word-stack:hover {
		background-color: rgba(139, 154, 125, 0.08);
	}

	.word-stack:focus-visible {
		outline: 2px solid var(--sage);
		outline-offset: 2px;
	}

	/* Inferred stress: dashed outline box.
	   Outline paints outside the box model — zero layout impact.
	   Content alignment is identical to non-VERIFY stacks. */
	.is-inferred {
		position: relative;
		margin-right: 3px;
	}

	/* Dashed box via pseudo-element for asymmetric sizing.
	   Content fits within 56px row at line-height 1.15 (no overflow).
	   Top: -4px for breathing room. Bottom: -5px to clear gloss descenders.
	   VERIFY label at -6px. Total intrusion = 4 + 6 = 10px < 20px gap. No collisions. */
	.is-inferred::before {
		content: '';
		position: absolute;
		top: -4px;
		left: -2px;
		right: -2px;
		bottom: -5px;
		border: 1.5px dashed #78716c;
		border-radius: 3px;
		pointer-events: none;
	}

	/* Override focus ring for inferred words: sage ring outside the dashed box */
	.is-inferred:focus-visible {
		outline: 2px solid var(--sage);
		outline-offset: 5px;
	}
	.is-inferred:focus-visible::before {
		display: none;
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
		min-height: 1.04rem;
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
		font-style: italic;
	}

	/* Reduced gap for clitics to visually connect with host */
	.is-clitic {
		padding-left: 1px;
		padding-right: 1px;
	}

	/* ── Top-right icon area ──────────────────────────────── */

	/* Reserve right padding when any top-right icon is present */
	.has-top-right-icon .ipa-row {
		padding-right: 14px;
	}

	.icon-area {
		position: absolute;
		top: -12px;
		right: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		color: #78716c;
		opacity: 0.4;
		transition: opacity 150ms ease;
		font-size: 12px;
	}

	.word-stack:hover .icon-area {
		opacity: 1;
		color: #44403c;
	}

	.provenance-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		border: 1px solid currentColor;
		border-radius: 50%;
	}

	.prov-svg {
		width: 9px;
		height: 9px;
	}

	/* R sigla for spot reconstitution: circular, matching provenance icons */
	.recon-sigla {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		border: 1px solid currentColor;
		border-radius: 50%;
		font-family: var(--font-sans);
		font-weight: 700;
		font-size: 9px;
		line-height: 1;
	}

	/* VERIFY label: fieldset-legend pattern.
	   Sits centred on the bottom border, background interrupts the dashed line.
	   10px smallcaps matches pagination weight. */
	.verify-label {
		position: absolute;
		bottom: -6px;
		left: 50%;
		transform: translateX(-50%);
		font-family: var(--font-sans);
		font-size: 10px;
		font-variant-caps: small-caps;
		letter-spacing: 0.04em;
		color: #78716c;
		background: var(--paper-cream);
		padding: 0 4px;
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
