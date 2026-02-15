<script lang="ts">
	import { t, type Language } from '$lib/i18n';

	interface Props {
		title: string;
		composer: string;
		poet: string;
		opus: string;
		language: Language;
	}

	let { title, composer, poet, opus, language }: Props = $props();

	/**
	 * Build the metadata line from available fields.
	 * Format: COMPOSER    OPUS    TEXT BY POET
	 * Empty segments omitted (no dangling separators).
	 */
	const metadataLine = $derived.by(() => {
		const parts: string[] = [];
		if (composer.trim()) parts.push(composer.trim().toUpperCase());
		if (opus.trim()) parts.push(opus.trim().toUpperCase());
		if (poet.trim()) parts.push(`${t('meta.textBy', language).toUpperCase()} ${poet.trim().toUpperCase()}`);
		return parts.join('    ');
	});
</script>

<header class="title-header">
	<div class="logo">
		<span class="logo-bracket">[</span><span class="logo-name">Ilya</span><span class="logo-bracket">]</span>
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

	<div class="metadata-line">
		{#if metadataLine}
			{metadataLine}
		{:else}
			<span class="placeholder-text">
				{t('meta.placeholderLine', language)}
			</span>
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

	/* ── Logo ──────────────────────────────────────────────── */

	.logo {
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

	/* ── Song title ────────────────────────────────────────── */

	.song-title {
		font-family: var(--font-serif);
		font-size: 28px;
		font-weight: 400;
		color: var(--ink-primary);
		line-height: 1.2;
		margin-bottom: 6px;
	}

	/* ── Metadata line ─────────────────────────────────────── */

	.metadata-line {
		font-family: var(--font-sans);
		font-size: 11px;
		color: var(--ink-secondary);
		letter-spacing: 1.5px;
		line-height: 1.4;
		margin-bottom: 8px;
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
