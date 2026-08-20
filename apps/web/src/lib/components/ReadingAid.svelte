<script lang="ts">
	/**
	 * The reading aid (N.73 portrait C, ruled by Dann 2026-08-18, rulings 4
	 * and 5).
	 *
	 * THIS IS NOT THE PAGE AND MUST NEVER LOOK LIKE ONE. Ruling 5: no shadow,
	 * no page edges, no header block, no colophon, and nothing on it prints.
	 * The page owns its dress exclusively. The label says so in words as well,
	 * because a singer who mistakes this for the artefact has been misled by
	 * the tool.
	 *
	 * It renders the SAME word stacks the page renders, through the same
	 * VerseLine and WordStack, so the IPA still comes verbatim from the
	 * GraysonEngine and the clitic and reconstitution rules are not written
	 * twice. Only the dress and the size differ.
	 */
	import type { LineData } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import { t, type Language } from '$lib/i18n';
	import { groupIntoVerses } from '$lib/reading-aid';
	import VerseLine from './Paper/VerseLine.svelte';

	interface Props {
		lines: LineData[];
		notationPrefs: NotationPreferences;
		language: Language;
		showStressDiacritics?: boolean;
		spotReconstitution?: Map<string, boolean>;
		glossOverrides?: Map<string, string>;
		/** Return to the page. */
		onreturn: () => void;
	}

	let {
		lines,
		notationPrefs,
		language,
		showStressDiacritics = false,
		spotReconstitution,
		glossOverrides,
		onreturn,
	}: Props = $props();

	/**
	 * The poem's verses, taken from the singer's own blank lines.
	 *
	 * The grouping is plain TypeScript in `$lib/reading-aid` so a gate can
	 * reach it. `endsStanza` is set once, in `processText`, from the raw
	 * input. A poem pasted as one block is one verse, which is why a document
	 * with no blank lines still closes with an end mark.
	 */
	const verses = $derived(groupIntoVerses(lines));
</script>

<section class="reading-aid" lang={language === 'fr' ? 'fr' : 'en'}>
	<button class="aid-return" type="button" onclick={onreturn}>
		<span class="aid-return-chevron" aria-hidden="true">&lsaquo;</span>
		{t('portrait.thePage', language)}
	</button>

	<p class="aid-label">{t('aid.label', language)}</p>

	<div class="aid-scroll">
		{#each verses as verse, verseIndex}
			{#each verse as line (line.lineNumber)}
				<div class="aid-line">
					<VerseLine
						words={line.words}
						{notationPrefs}
						{showStressDiacritics}
						{language}
						{spotReconstitution}
						{glossOverrides}
					/>
				</div>
			{/each}

			<p class="aid-end">
				{t('aid.endOfVerse', language).replace('%s', String(verseIndex + 1))}
			</p>

			{#if verseIndex < verses.length - 1}
				<hr class="aid-rule" />
			{/if}
		{/each}
	</div>
</section>

<style>
	/* Full bleed, no edges, no radius, no shadow. A page has margins and a
	   boundary; this has neither, which is the fastest way to tell them
	   apart without reading a word. */
	.reading-aid {
		width: 100%;
		background: var(--paper-light, #F5F1E8);
		display: flex;
		flex-direction: column;
	}

	/* ── The return action ─────────────────────────────────── */

	.aid-return {
		flex: 0 0 auto;
		width: 100%;
		border: none;
		border-radius: 0;
		background: var(--ink-primary, #1a1612);
		color: var(--paper-cream, #F0EBE0);
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.85rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		/* 0.9rem either side of a 0.85rem line clears the 44px floor. */
		padding: 0.9rem 0;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
	}

	.aid-return-chevron {
		margin-right: 0.4em;
	}

	.aid-return:focus-visible {
		outline: 2px solid var(--ink-primary, #1a1612);
		outline-offset: -4px;
	}

	/* ── The label that says what this is ──────────────────── */

	.aid-label {
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.7rem;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--ink-tertiary, #6A655F);
		text-align: center;
		margin: 0;
		padding: 0.75rem 1rem 0.25rem;
	}

	/* ── The stacks ────────────────────────────────────────── */

	.aid-scroll {
		padding: 0.5rem 1.25rem 2rem;
	}

	/* VerseLine reads --row-gap for the space between wrapped rows. The page
	   sets it per page from its own row arithmetic; the aid has no rows to
	   budget, so it sets a reading gap once. */
	.aid-line {
		--row-gap: 14px;
		margin-bottom: 0.9rem;
	}

	.aid-rule {
		border: 0;
		border-top: 1px solid var(--color-border, #d6d3d1);
		margin: 0 0 1.25rem;
	}

	.aid-end {
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.7rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-tertiary, #6A655F);
		text-align: center;
		margin: 0;
		padding: 0.5rem 0 1rem;
	}

	/* NOTHING ON THE AID PRINTS (ruling 5). +page.svelte hides it too; this
	   is the component's own guarantee, so the rule travels with the file. */
	@media print {
		.reading-aid {
			display: none !important;
		}
	}
</style>
