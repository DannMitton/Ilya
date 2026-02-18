<script lang="ts">
	import type { Language } from '$lib/i18n';

	interface Props {
		language: Language;
		onlanguagechange: (lang: Language) => void;
	}

	let { language, onlanguagechange }: Props = $props();

	function switchTo(lang: Language) {
		if (lang !== language) {
			onlanguagechange(lang);
		}
	}

	function handleKeydown(e: KeyboardEvent, lang: Language) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			switchTo(lang);
		}
	}
</script>

<header class="header-bar">
	<div class="sigil" aria-label="Ilya">
		<span class="sigil-bracket">[</span><span class="sigil-name">Ilya</span><span class="sigil-bracket">]</span>
	</div>

	<div class="language-toggle">
		<span
			class="lang-option"
			class:active={language === 'en'}
			role="button"
			tabindex="0"
			aria-pressed={language === 'en'}
			onclick={() => switchTo('en')}
			onkeydown={(e) => handleKeydown(e, 'en')}
		>English</span>
		<span class="lang-separator" aria-hidden="true"></span>
		<span
			class="lang-option"
			class:active={language === 'fr'}
			role="button"
			tabindex="0"
			aria-pressed={language === 'fr'}
			onclick={() => switchTo('fr')}
			onkeydown={(e) => handleKeydown(e, 'fr')}
		>Français</span>
	</div>
</header>

<style>
	.header-bar {
		height: 48px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 16px;
		border-bottom: none;
		background: var(--sage);
	}

	/* ── [Ilya] sigil: matches paper logo size ───────────── */

	.sigil {
		display: flex;
		align-items: baseline;
		gap: 0;
		user-select: none;
	}

	.sigil-bracket {
		font-family: var(--font-mono, 'SF Mono', 'Fira Code', 'Cascadia Code', monospace);
		font-size: 22px;
		color: white;
		font-weight: 400;
	}

	.sigil-name {
		font-family: var(--font-serif);
		font-size: 22px;
		font-style: italic;
		color: white;
		font-weight: 400;
	}

	/* ── Language toggle ─────────────────────────────────── */

	.language-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.lang-option {
		font-family: var(--font-sans);
		font-size: 13px;
		cursor: pointer;
		transition: color 0.15s;
		user-select: none;
		line-height: 1;
	}

	.lang-option.active {
		color: white;
		font-weight: 600;
	}

	.lang-option:not(.active) {
		color: rgba(255, 255, 255, 0.6);
	}

	.lang-option:not(.active):hover {
		text-decoration: underline;
		color: rgba(255, 255, 255, 0.85);
	}

	.lang-option:focus-visible {
		outline: 2px solid white;
		outline-offset: 2px;
		border-radius: 2px;
	}

	.lang-separator {
		width: 1px;
		height: 12px;
		background: rgba(255, 255, 255, 0.4);
	}
</style>
