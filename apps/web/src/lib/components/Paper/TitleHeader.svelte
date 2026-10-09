<script lang="ts">
	import { t, type Language } from '$lib/i18n';
	import type { LegendItem } from '$lib/provenance';
	import type { PreparedSmuflFont } from '@ilya/score-parser';
	import LegendItems from './LegendItems.svelte';

	interface Props {
		title: string;
		composer: string;
		poet: string;
		translator: string;
		opus: string;
		language: Language;
		onheightchange?: (height: number) => void;
		/**
		 * Colour of the nestled "2026a" version badge. Transcription pages
		 * keep the default sage; Markup and Insights pass lavender to
		 * harmonize the mark with their palette (Dann's ruling, 2026-07-12).
		 */
		versionAccent?: string;
		/**
		 * Colour of the "[Ilya]" wordmark itself (brackets and name).
		 * Transcription keeps the default sage; Markup and Insights pass
		 * lavender so the whole mark harmonizes, not just the version
		 * badge (Dann's ruling, 2026-07-13).
		 */
		markAccent?: string;
		/**
		 * Colour of the header rule beneath the metadata. Transcription keeps
		 * the default sage; Markup and Insights pass lavender so the header
		 * harmonizes with the footer hairline (Dann's ruling, 2026-07-16).
		 */
		ruleAccent?: string;
		/**
		 * Colour of the metadata lines, the document's label ink. Every
		 * document's label ink is its own family at OKLCH L 0.420 (ruling 4
		 * of 4, 2026-09-13): Text keeps the default sage, Markup passes
		 * lavender, Insights passes rose. It was `--ink-secondary` for every
		 * document until colour stage 4, 2026-09-14.
		 */
		labelInk?: string;
		/**
		 * N.94: one line under the metadata saying the page is in a key the
		 * singer chose, and from which key (drawing r4, plate 3; ruling 13 of
		 * 2026-08-07). Absent on every page as printed, so no other page moves.
		 */
		note?: string;
		/**
		 * The Markup legend (the stems key and, when present, the withheld-syllable
		 * sigla), drawn on the subtitle's line, right-aligned, at the subtitle's
		 * size and in small caps (walk finding 2026-10-09, `OPEN.md` "N.176,
		 * AMENDED 2026-10-09 01:27"). Absent on every other page, so no other
		 * header moves. Where the subtitle and the legend do not fit on one line
		 * the legend's items stack into short lines at the right, still above
		 * the rule.
		 */
		legendItems?: LegendItem[];
		/** The page's notation font, so the stems key draws with the same heads the stave does (N.176). */
		notationFont?: { prepared: PreparedSmuflFont; family: string } | null;
	}

	let { title, composer, poet, translator, opus, language, onheightchange, versionAccent = 'var(--sage)', markAccent = 'var(--sage)', ruleAccent = 'var(--sage)', labelInk = 'var(--sage-ink)', note = undefined, legendItems = [], notationFont = null }: Props = $props();

	/**
	 * Line 1: COMPOSER (DATES)    OPUS
	 * Full formatted composer display name, then opus. Space-separated.
	 */
	const composerLine = $derived.by(() => {
		const parts: string[] = [];
		if (composer.trim()) parts.push(composer.trim().toUpperCase());
		if (opus.trim()) parts.push(opus.trim().toUpperCase());
		return parts.join(' | ');
	});

	/**
	 * Line 2: POET (DATES) | TRANSLATOR (DATES) (TRANSL.)
	 * Full formatted names with dates. Translator only when populated.
	 */
	const attributionLine = $derived.by(() => {
		const parts: string[] = [];
		if (poet.trim()) parts.push(poet.trim().toUpperCase());
		if (translator.trim()) parts.push(`${translator.trim().toUpperCase()} (${t('meta.transl', language)})`);
		return parts.join(' | ');
	});

	/**
	 * ONE LINE OR STACKED. The legend sits beside the subtitle when the subtitle's
	 * natural width, a gap, and the legend's one-line width all fit in the row,
	 * and stacks otherwise. Both widths are MEASURED from hidden probes that
	 * carry the live text and type, never estimated from the string, because the
	 * subtitle carries the singer's own voice name and the legend is bilingual.
	 */
	const LEGEND_GAP = 24;
	let rowWidth = $state(0);
	let subtitleWidth = $state(0);
	let legendWidth = $state(0);
	let stackedWidth = $state(0);
	const fitsOneLine = $derived(subtitleWidth + LEGEND_GAP + legendWidth <= rowWidth);
	/* DESK DEFAULT, outside the ruling: where the subtitle does not fit WHOLE beside even
	   the stacked legend (the French line, or a long voice name), the legend takes its own
	   row under the subtitle, right-aligned and still above the rule, rather than the
	   subtitle being cut with an ellipsis. The subtitle carries the voice's name, and a
	   clipped name is information the old footer placement never cost. It is the same height
	   as stacking (two lines). */
	const stacked = $derived(rowWidth > 0 && !fitsOneLine && subtitleWidth + LEGEND_GAP + stackedWidth <= rowWidth);
	const below = $derived(rowWidth > 0 && !fitsOneLine && !stacked);

	/** Measured height of this header, including all content and the rule. */
	let measuredHeight = $state(0);

	$effect(() => {
		if (measuredHeight > 0) {
			onheightchange?.(measuredHeight);
		}
	});
</script>

<header class="title-header" bind:offsetHeight={measuredHeight}>
	<div class="logo" style="color: {markAccent}">
		<span class="logo-bracket">[</span><span class="logo-name">Ilya</span><span class="logo-bracket">]</span><span class="logo-version" style="color: {versionAccent}">2026a</span>
	</div>

	<div class="song-title">
		{#if title.trim()}
			{title.trim()}
		{:else}
			<span class="placeholder-text">
				{t('meta.title', language)}
			</span>
		{/if}
	</div>

	<div class="metadata-block" style="color: {labelInk}">
		{#if composerLine || attributionLine}
			{#if composerLine && legendItems.length > 0}
				<div class="subtitle-row" class:below bind:clientWidth={rowWidth}>
					<div class="metadata-line">{composerLine}</div>
					<div class="header-legend" class:stacked class:below>
						<LegendItems items={legendItems} {notationFont} />
					</div>
					<span class="subtitle-probe" aria-hidden="true" bind:clientWidth={subtitleWidth}>{composerLine}</span>
					<div class="header-legend legend-probe" aria-hidden="true" bind:clientWidth={legendWidth}>
						<LegendItems items={legendItems} {notationFont} />
					</div>
					<div class="header-legend legend-probe stacked-probe" aria-hidden="true" bind:clientWidth={stackedWidth}>
						<LegendItems items={legendItems} {notationFont} />
					</div>
				</div>
			{:else if composerLine}
				<div class="metadata-line">{composerLine}</div>
			{/if}
			{#if attributionLine}
				<div class="metadata-line">{attributionLine}</div>
			{/if}
		{:else}
			<div class="metadata-line">
				<span class="placeholder-text">
					{t('meta.placeholderLine', language)}
				</span>
			</div>
		{/if}
	</div>

	{#if note}
		<p class="header-note" style="color: {labelInk}">{note}</p>
	{/if}

	<div class="header-rule" style="border-bottom-color: {ruleAccent}"></div>
</header>

<style>
	.title-header {
		position: absolute;
		top: 48px;
		left: 96px;
		right: 96px;
	}

	/* ── Logo: version nestled in y descender ──────────────── */

	.logo {
		position: relative;
		display: inline-block;
		margin-bottom: 8px;
		margin-left: -6px;
		color: var(--sage);
		font-size: 24px;
		line-height: 1;
	}

	.logo-bracket {
		font-family: 'Courier New', Courier, monospace;
	}

	.logo-name {
		font-family: var(--font-serif);
		font-style: italic;
	}

	.logo-version {
		position: absolute;
		top: 21px;
		left: 36px;
		font-family: var(--font-sans);
		font-size: 12px;
		color: var(--sage);
		font-weight: 400;
		font-variant-caps: all-small-caps;
		letter-spacing: 0.04em;
		line-height: 1;
	}

	/* ── Song title ────────────────────────────────────────── */

	.song-title {
		font-family: var(--font-serif);
		font-size: 28px;
		font-weight: 400;
		color: var(--ink-primary);
		line-height: 1.2;
		margin-bottom: 6px;
	}

	/* ── Metadata block ────────────────────────────────────── */

	.metadata-block {
		margin-bottom: 8px;
	}

	.metadata-line {
		font-family: var(--font-sans);
		font-size: 14px;
		font-weight: 600;
		/* colour: inherited from `.metadata-block`, which carries `labelInk` */
		letter-spacing: 1.5px;
		line-height: 1.6;
		font-variant-caps: all-small-caps;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
	}

	/* ── The Markup legend on the subtitle's line (walk finding 2026-10-09) ──
	   The subtitle keeps its own box and ellipsis; the legend takes what it
	   needs at the right, at the subtitle's 14px and in small caps. Stacked, the
	   items are short lines at the right, and a long entry (the withheld-syllable
	   sentence) wraps inside 58 % of the row rather than pushing the subtitle out. */

	.subtitle-row {
		position: relative;
		display: flex;
		align-items: flex-start;
		gap: 24px;
	}

	.subtitle-row .metadata-line {
		flex: 1 1 0;
		min-width: 0;
	}

	.header-legend {
		--legend-font-size: 14px;
		flex: none;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		gap: 4px 12px;
		line-height: 1.6;
	}

	.header-legend:not(.stacked):not(.below) {
		white-space: nowrap;
	}

	.header-legend.stacked {
		flex-direction: column;
		align-items: flex-end;
		gap: 0;
		max-width: 58%;
		text-align: right;
	}

	.subtitle-row.below {
		flex-direction: column;
		align-items: stretch;
		gap: 0;
	}

	.subtitle-row.below .metadata-line {
		flex: none;
	}

	.header-legend.below {
		align-self: flex-end;
		flex-wrap: wrap;
		max-width: 100%;
	}

	/* Measuring only: invisible, out of flow, same type as what it stands for. */
	.subtitle-probe {
		position: absolute;
		visibility: hidden;
		white-space: nowrap;
		pointer-events: none;
		font-family: var(--font-sans);
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 1.5px;
		font-variant-caps: all-small-caps;
	}

	.legend-probe {
		position: absolute;
		visibility: hidden;
		white-space: nowrap;
		pointer-events: none;
	}

	.stacked-probe {
		flex-direction: column;
		align-items: flex-end;
		gap: 0;
	}

	/* ── N.94: the chosen key, in the document's label ink ─── */

	.header-note {
		margin: 0 0 8px;
		font-family: var(--font-serif);
		font-size: 13px;
		line-height: 1.4;
	}

	/* ── Sage horizontal rule ──────────────────────────────── */

	.header-rule {
		border-bottom: 1px solid var(--sage);
	}

	/* ── Placeholder text ──────────────────────────────────── */

	.placeholder-text {
		color: var(--ink-tertiary);
		font-style: italic;
	}

	@media print {
		.placeholder-text {
			display: none;
		}
	}

	/* N.73 portrait C, ruled by Dann 2026-08-18, retires the N.45 rule that
	   stood here. It hid this header on the phone with `visibility: hidden`,
	   on the reasoning that a phone showed a content view rather than a
	   picture of the printed page and the metadata was duplication.

	   Portrait C reverses that reasoning. The header block is named in the
	   ruling as part of the page's dress, the phone shows the page itself,
	   and the metadata is what a singer looking at a document expects to see
	   on it. The measurement note the rule carried is now in TitlePage's own
	   comment, where it belongs: `bind:offsetHeight` is a layout measurement
	   and the portrait scaling cannot move it. */
</style>
