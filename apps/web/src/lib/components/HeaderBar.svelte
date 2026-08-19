<script lang="ts">
	import type { Language } from '$lib/i18n';
	import type { TabId } from '$lib/destinations';

	interface Props {
		language: Language;
		activeTab: TabId;
		onlanguagechange: (lang: Language) => void;
	}

	let { language, activeTab, onlanguagechange }: Props = $props();

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

<header
	class="header-bar"
	class:tab-transcription={activeTab === 'transcription'}
	class:tab-learn={activeTab === 'learn'}
	class:tab-guide={activeTab === 'guide'}
	class:tab-shane={activeTab === 'shane'}
>
	<h1 class="sr-only">{language === 'fr' ? 'Ilya — Diction lyrique russe' : 'Ilya — Russian Lyric Diction'}</h1>
	<div class="sigil" aria-label="Ilya 2026a">
		<span class="sigil-bracket">[</span><span class="sigil-name">Ilya</span><span class="sigil-bracket">]</span><span class="sigil-version">2026a</span>
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
		transition: background-color 300ms ease;
	}

	/* ── Tab-responsive background ────────────────────────── */

	.header-bar.tab-transcription {
		background: var(--sage, #8B9A7D);
	}

	.header-bar.tab-learn {
		background: var(--dusty-rose, #A67B7B);
	}

	.header-bar.tab-guide {
		background: var(--quiet-cobalt, #5C739E);
	}

	/* THREE destinations, not four. Ruled by Dann 2026-08-18: the app bar
	   keys to the destination, and Studio is one destination holding two
	   documents. So the Marked score takes Studio's sage with Transcription,
	   and the lavender that used to sit here is gone from the bar. Lavender's
	   carriers under Studio are the voice anchor and the calibration
	   surfaces, neither of which this bar draws. */
	.header-bar.tab-shane {
		background: var(--sage, #8B9A7D);
	}

	/* ── [Ilya] sigil: version nestled in y descender ─────── */

	.sigil {
		position: relative;
		display: inline-flex;
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

	.sigil-version {
		position: absolute;
		top: 26px;
		left: 34px;
		font-family: var(--font-sans);
		font-size: 10px;
		color: rgba(255, 255, 255, 0.8);
		font-weight: 600;
		font-variant-caps: all-small-caps;
		letter-spacing: 0.04em;
		line-height: 1;
		padding: 0 3px;
		border-radius: 2px;
		transition: background-color 300ms ease;
	}

	.tab-transcription .sigil-version {
		background: var(--deeper-sage, #7A8A6C);
	}

	.tab-learn .sigil-version {
		background: #8F6A6A;
	}

	.tab-guide .sigil-version {
		background: #4D6387;
	}

	/* Deeper shade of --deeper-lavender (#8E7E9B), computed the same way the
	   Learn and Guide deepened badge shades were hand-picked, not a token
	   that exists yet. If Kimi or Dann want a precise locked value, this is
	   the one to revisit. */
	.tab-shane .sigil-version {
		background: #74677F;
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
		transition: color 0.2s ease-out, background-color 0.2s ease-out, text-decoration 0.15s ease;
		user-select: none;
		line-height: 1;
		padding: 4px 12px;
		border-radius: 9999px;
	}

	.lang-option.active {
		color: white;
		font-weight: 500;
		background: rgba(255, 255, 255, 0.15);
	}

	.lang-option:not(.active) {
		color: rgba(255, 255, 255, 0.7);
	}

	.tab-transcription .lang-option:not(.active) {
		background: var(--deeper-sage, #7A8A6C);
	}

	.tab-learn .lang-option:not(.active) {
		background: #8F6A6A;
	}

	.tab-guide .lang-option:not(.active) {
		background: #4D6387;
	}

	.tab-shane .lang-option:not(.active) {
		background: #74677F;
	}

	.lang-option:not(.active):hover {
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 3px;
		color: rgba(255, 255, 255, 0.9);
	}

	.tab-transcription .lang-option:not(.active):hover {
		text-decoration-color: var(--sage, #8B9A7D);
	}

	.tab-learn .lang-option:not(.active):hover {
		text-decoration-color: var(--dusty-rose, #A67B7B);
	}

	.tab-guide .lang-option:not(.active):hover {
		text-decoration-color: var(--quiet-cobalt, #5C739E);
	}

	.tab-shane .lang-option:not(.active):hover {
		text-decoration-color: var(--deeper-lavender, #8E7E9B);
	}

	.lang-option:focus-visible {
		outline: 2px solid white;
		outline-offset: 2px;
		border-radius: 9999px;
	}

	.lang-separator {
		width: 1px;
		height: 12px;
		background: #C5C5C5;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
</style>
