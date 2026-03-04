<script lang="ts">
	import { t, type Language } from '$lib/i18n';

	interface Props {
		title: string;
		composer: string;
		poet: string;
		translator: string;
		opus: string;
		language: Language;
		onheightchange?: (height: number) => void;
	}

	let { title, composer, poet, translator, opus, language, onheightchange }: Props = $props();

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

	/** Measured height of this header, including all content and the rule. */
	let measuredHeight = $state(0);

	$effect(() => {
		if (measuredHeight > 0) {
			onheightchange?.(measuredHeight);
		}
	});
</script>

<header class="title-header" bind:offsetHeight={measuredHeight}>
	<div class="logo">
		<span class="logo-bracket">[</span><span class="logo-name">Ilya</span><span class="logo-bracket">]</span><span class="logo-version">2026a</span>
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

	<div class="metadata-block">
		{#if composerLine || attributionLine}
			{#if composerLine}
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

	<div class="header-rule"></div>
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
		color: var(--ink-secondary);
		letter-spacing: 1.5px;
		line-height: 1.6;
		font-variant-caps: all-small-caps;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
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
</style>
