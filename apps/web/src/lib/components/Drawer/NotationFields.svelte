<script lang="ts">
	/* ── NOTATION (item N.7) ────────────────────────────────────────────
	   Extracted from RootPanel.svelte, where this section lived inside the
	   Transcription drawer alone. The state it writes was already
	   document-level and persisted (+page.svelte:135, :344-346, :704-707),
	   and Fit already obeyed it: notationPrefs and openSyllabification reach
	   VoiceProfilePane at +page.svelte:1006-1007. Only the CONTROL was
	   tab-scoped, so its placement lied about the scope of what it governs.

	   Twinned on the MetadataFields precedent: one component, state owned by
	   +page.svelte, rendered once in each panel. See RootPanel.svelte's
	   "shared with the Fit drawer" comment on the metadata block.

	   KNOWN GAP, recorded rather than fixed here. Six of the seven toggles
	   govern both surfaces. The seventh, stress acutes, does not: Fit's
	   VoiceProfilePane is not passed showStressDiacritics
	   (+page.svelte:998-1009), and it is read only at WordStack.svelte:56 and
	   InspectorPanel.svelte:98,201, both Transcription-only. Fit's IPA stress
	   mark is a separate and unconditional thing (pipeline.ts:711). Wiring the
	   Cyrillic acute into Fit's underlay changes the printed page and needs
	   its own walk, so it is a numbered item of its own, not part of N.7.

	   The class names still read `cosmetic`; the heading has read Notation
	   since i18n.ts:48. Renaming the classes is cosmetic churn inside a
	   placement change and is deliberately not done here.
	   ────────────────────────────────────────────────────────────────── */
	import type { NotationPreferences } from '@ilya/phonology';
	import { t, type Language } from '$lib/i18n';

	interface Props {
		notationPrefs: NotationPreferences;
		showStressDiacritics: boolean;
		openSyllabification: boolean;
		language: Language;
		/**
		 * Colour of the section label and of an engaged toggle. Transcription
		 * keeps the default sage; Fit/Shane passes deeper-lavender, that
		 * surface's identity colour (Drawer.svelte:587, HeaderBar.svelte:88).
		 * Twinned on TitleHeader.svelte and PageFooter.svelte, which take their
		 * accents the same way rather than inheriting one.
		 *
		 * Anchored at the foot of the drawer this component renders ONCE, so
		 * the accent follows activeTab rather than being fixed per render site.
		 * Dann's ruling, 2026-08-06: the colour follows the tab. The control is
		 * document-level, but a singer should still see which surface they are
		 * changing.
		 */
		accent?: string;
		onnotationchange: (prefs: NotationPreferences) => void;
		onstressdiacriticschange: (value: boolean) => void;
		onopensyllabificationchange: (value: boolean) => void;
	}

	let {
		notationPrefs,
		showStressDiacritics,
		openSyllabification,
		language,
		accent = 'var(--sage)',
		onnotationchange,
		onstressdiacriticschange,
		onopensyllabificationchange,
	}: Props = $props();

	function handleToggle(key: keyof NotationPreferences, value: boolean) {
		const next = { ...notationPrefs, [key]: value };
		// Geminates/Shcha cascade: toggling geminates also toggles shcha
		if (key === 'geminate') {
			next.shcha = value;
		}
		onnotationchange(next);
	}
</script>

<div class="section cosmetic-section" style="--notation-accent: {accent}">
	<h3 class="section-label">{t('cosmetic.heading', language)}</h3>
	<div class="cosmetic-grid">
		<!-- Stress acutes -->
		<span class="cosmetic-label-left" class:label-inactive={showStressDiacritics}>{t('cosmetic.stressAcutes.left', language)}</span>
		<button
			class="toggle-switch"
			class:active={showStressDiacritics}
			role="switch"
			aria-checked={showStressDiacritics}
			aria-label={t('cosmetic.stressAcutes.right', language)}
			onclick={() => onstressdiacriticschange(!showStressDiacritics)}
		>
			<span class="toggle-thumb"></span>
		</button>
		<span class="cosmetic-label-right" class:label-inactive={!showStressDiacritics}>{t('cosmetic.stressAcutes.right', language)}</span>

		<!-- Reduced vowel -->
		<span class="cosmetic-label-left" class:label-inactive={notationPrefs.reducedVowel}>{t('cosmetic.reducedVowel.left', language)}</span>
		<button
			class="toggle-switch"
			class:active={notationPrefs.reducedVowel}
			role="switch"
			aria-checked={notationPrefs.reducedVowel}
			aria-label={t('cosmetic.reducedVowel.left', language)}
			onclick={() => handleToggle('reducedVowel', !notationPrefs.reducedVowel)}
		>
			<span class="toggle-thumb"></span>
		</button>
		<span class="cosmetic-label-right" class:label-inactive={!notationPrefs.reducedVowel}>{t('cosmetic.reducedVowel.right', language)}</span>

		<!-- Palatal nasal -->
		<span class="cosmetic-label-left" class:label-inactive={notationPrefs.palatalNasal}>{t('cosmetic.palatalNasal.left', language)}</span>
		<button
			class="toggle-switch"
			class:active={notationPrefs.palatalNasal}
			role="switch"
			aria-checked={notationPrefs.palatalNasal}
			aria-label={t('cosmetic.palatalNasal.left', language)}
			onclick={() => handleToggle('palatalNasal', !notationPrefs.palatalNasal)}
		>
			<span class="toggle-thumb"></span>
		</button>
		<span class="cosmetic-label-right" class:label-inactive={!notationPrefs.palatalNasal}>{t('cosmetic.palatalNasal.right', language)}</span>

		<!-- Geminates -->
		<span class="cosmetic-label-left" class:label-inactive={notationPrefs.geminate}>{t('cosmetic.geminates.left', language)}</span>
		<button
			class="toggle-switch"
			class:active={notationPrefs.geminate}
			role="switch"
			aria-checked={notationPrefs.geminate}
			aria-label={t('cosmetic.geminates.left', language)}
			onclick={() => handleToggle('geminate', !notationPrefs.geminate)}
		>
			<span class="toggle-thumb"></span>
		</button>
		<span class="cosmetic-label-right" class:label-inactive={!notationPrefs.geminate}>{t('cosmetic.geminates.right', language)}</span>

		<!-- Shcha -->
		<span class="cosmetic-label-left" class:label-inactive={notationPrefs.shcha}>{t('cosmetic.shcha.left', language)}</span>
		<button
			class="toggle-switch"
			class:active={notationPrefs.shcha}
			role="switch"
			aria-checked={notationPrefs.shcha}
			aria-label={t('cosmetic.shcha.left', language)}
			onclick={() => handleToggle('shcha', !notationPrefs.shcha)}
		>
			<span class="toggle-thumb"></span>
		</button>
		<span class="cosmetic-label-right" class:label-inactive={!notationPrefs.shcha}>{t('cosmetic.shcha.right', language)}</span>

		<!-- Reconstitution -->
		<span class="cosmetic-label-left" class:label-inactive={notationPrefs.reconstitution}>{t('cosmetic.reconstitution.left', language)}</span>
		<button
			class="toggle-switch"
			class:active={notationPrefs.reconstitution}
			role="switch"
			aria-checked={notationPrefs.reconstitution}
			aria-label={t('cosmetic.reconstitution.right', language)}
			onclick={() => handleToggle('reconstitution', !notationPrefs.reconstitution)}
		>
			<span class="toggle-thumb"></span>
		</button>
		<span class="cosmetic-label-right" class:label-inactive={!notationPrefs.reconstitution}>{t('cosmetic.reconstitution.right', language)}</span>

		<!-- Open syllabification -->
		<span class="cosmetic-label-left" class:label-inactive={openSyllabification}>{t('cosmetic.openSyllabification.left', language)}</span>
		<button
			class="toggle-switch"
			class:active={openSyllabification}
			role="switch"
			aria-checked={openSyllabification}
			aria-label={t('cosmetic.openSyllabification.right', language)}
			onclick={() => onopensyllabificationchange(!openSyllabification)}
		>
			<span class="toggle-thumb"></span>
		</button>
		<span class="cosmetic-label-right" class:label-inactive={!openSyllabification}>{t('cosmetic.openSyllabification.right', language)}</span>
	</div>
</div>

<style>
	/* ── Section label (sage smallcaps, matching Drawer and RootPanel) ── */

	.section {
		margin-top: 0;
	}

	.section-label {
		font-family: var(--font-sans);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--notation-accent, var(--sage));
		margin-bottom: 0.4rem;
		font-weight: 600;
	}

	.cosmetic-section {
		margin-top: 0;
	}

	/* ── Cosmetic toggle grid ────────────────────────────── */
	/* Three-column grid: left label | toggle | right label   */

	.cosmetic-grid {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: 0.45rem 0.6rem;
		align-items: center;
	}

	.cosmetic-label-left,
	.cosmetic-label-right {
		font-family: var(--font-sans);
		font-size: 0.8rem;
		color: var(--ink-primary);
		transition: color 0.15s ease;
	}

	.cosmetic-label-left {
		text-align: right;
	}

	.cosmetic-label-right {
		text-align: left;
	}

	.cosmetic-label-left.label-inactive,
	.cosmetic-label-right.label-inactive {
		color: var(--ink-tertiary);
	}

	/* ── Toggle switches ──────────────────────────────────── */

	.toggle-switch {
		position: relative;
		width: 32px;
		height: 18px;
		border-radius: 9px;
		border: none;
		background: var(--stone-300);
		cursor: pointer;
		padding: 0;
		flex-shrink: 0;
		transition: background 0.15s ease;
	}

	.toggle-switch.active {
		background: var(--notation-accent, var(--sage));
	}

	.toggle-thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: white;
		transition: transform 0.15s ease;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
	}

	.toggle-switch.active .toggle-thumb {
		transform: translateX(14px);
	}
</style>
