<script lang="ts">
	/* ── NOTATION (item N.7) ────────────────────────────────────────────
	   Extracted from RootPanel.svelte, where this section lived inside the
	   Transcription drawer alone. The state it writes was already
	   document-level and persisted (the notationPrefs and openSyllabification declarations),
	   and Fit already obeyed it: notationPrefs and openSyllabification reach
	   VoiceProfilePane through its own props of those names. Only the CONTROL was
	   tab-scoped, so its placement lied about the scope of what it governs.

	   Twinned on the MetadataFields precedent: one component, state owned by
	   +page.svelte, rendered once in each panel. See RootPanel.svelte's
	   "shared with the Fit drawer" comment on the metadata block.

	   KNOWN GAP, recorded rather than fixed here. Six of the seven toggles
	   govern both surfaces. The seventh, stress acutes, does not: Fit's
	   VoiceProfilePane is not passed showStressDiacritics
	   (it is never given that prop), and it is read only at WordStack.svelte:56 and
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
	import StationHeader from './StationHeader.svelte';

	interface Props {
		notationPrefs: NotationPreferences;
		showStressDiacritics: boolean;
		openSyllabification: boolean;
		language: Language;
		/**
		 * Colour of the section label and of an engaged toggle. SAGE, on both
		 * of Studio's documents. Twinned on TitleHeader.svelte and
		 * PageFooter.svelte, which take their accents the same way rather than
		 * inheriting one.
		 *
		 * N.73 S3 ship two settles what S2 named and left. The accent used to
		 * follow the destination, sage on the transcription and
		 * deeper-lavender on the marked score, under Dann's ruling of
		 * 2026-08-06 that the colour follows the tab. Two later rulings ended
		 * that: S2 gave Studio's two documents ONE drawer whose invariant is
		 * that nothing in it appears, disappears, or moves when the singer
		 * flips the pair, and a panel that changes colour on the flip breaks
		 * it; and the S0 slate's ruling 3 of 2026-08-19 keeps lavender in
		 * Studio to the voice anchor and the calibration surfaces alone.
		 * NOTATION is sage, unconditionally, and the caller passes a literal.
		 *
		 * The prop stays a prop rather than becoming a constant, because
		 * TitleHeader and PageFooter take their accents the same way and this
		 * component should not be the one that stops.
		 */
		accent?: string;
		onnotationchange: (prefs: NotationPreferences) => void;
		onstressdiacriticschange: (value: boolean) => void;
		onopensyllabificationchange: (value: boolean) => void;
		/**
		 * N.43. Collapsed state lives in +page.svelte, not here, so it
		 * survives a trip to Learn and back: this component is destroyed
		 * when the drawer's `isStudio` guard closes, which it does on Learn
		 * and Guide. The cited line number was already stale before N.73 S3
		 * moved the anchor, so the guard is NAMED here rather than numbered.
		 */
		expanded: boolean;
		onexpandedchange: (value: boolean) => void;
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
		expanded,
		onexpandedchange,
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

<div class="station cosmetic-section" style="--notation-accent: {accent}">
	<!-- N.65 ship B. THE DISCLOSURE MARKUP LEFT THIS FILE. It was right here
	     and it was right here ALONE, so ship B moved it into `StationHeader`
	     rather than copying it to five more stations. What was a button and a
	     chevron declared in this component is now three props, and the
	     behaviour, the `aria-expanded`, the 44px coarse-pointer floor and the
	     two chevron rotations are unchanged and live there. -->
	<StationHeader
		label={t('cosmetic.heading', language)}
		accent={accent}
		expanded={expanded}
		ontoggle={() => onexpandedchange(!expanded)}
		controls="notation-toggles"
	/>
	{#if expanded}
	<div class="cosmetic-grid" id="notation-toggles">
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
	{/if}
</div>

<style>
	/* N.65 ship one. THE LABEL RECIPE IS NOT HERE ANY MORE. It is
	   `StationHeader.svelte`, the drawer's one owner for a station label,
	   and this component's two differences went with it: the accent is that
	   component's `accent` prop, and the collapsed no-gap variant is its
	   `tight` prop. The reason for the no-gap case is unchanged and is
	   recorded there. */

	/* N.108 increment 1. `.section` AND ITS 2px SAGE RULE ARE GONE. That rule
	   was the boundary between Piece and Notation in the pinned top anchor,
	   and there is no pinned top anchor: Notation is the first station in the
	   TEXT group and the sage band above it is its boundary. The box, the
	   inset and the hairline between it and Analysis are the frame's, on
	   `.group :global(.station)` in `Drawer.svelte`, which is where every
	   station in the drawer reads them from now. */

	/* N.65 ship B. THE DISCLOSURE RULES ARE NOT HERE ANY MORE. The button
	   recipe, the 44px coarse-pointer floor, and the two chevron rotations
	   are `StationHeader.svelte`'s, along with the reasoning each carried:
	   the E.36 touch ruling, Dann's 19px catch on the centred label, and the
	   chevron pointing the way the panel will grow. Every station reads them
	   from there now, which is the whole point of ship B. */

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
