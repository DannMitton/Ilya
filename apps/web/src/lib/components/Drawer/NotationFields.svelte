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

<div class="section cosmetic-section" style="--notation-accent: {accent}">
	<StationHeader accent={accent} tight={!expanded}>
		<button
			class="notation-disclosure"
			aria-expanded={expanded}
			aria-controls={expanded ? "notation-toggles" : undefined}
			onclick={() => onexpandedchange(!expanded)}
		>
			<span>{t('cosmetic.heading', language)}</span>
			<svg class="chevron-icon" class:expanded width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg>
		</button>
	</StationHeader>
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

	/* The station recipe (RootPanel.svelte's `.section`), which Dann ruled
	   on his walk of ship one: a 2px sage rule, 6px, the label, the body,
	   6px. This rule is the boundary between Piece and Notation, and it is
	   the same one Analysis draws. */
	.section {
		border-top: 2px solid var(--sage);
		padding: 6px 0;
	}

	/* N.43: the whole header row is the control, so the tap target is the
	   control's own visible box. The E.36 touch ruling of 2026-08-10
	   prefers that over an invisible centred region, and says two
	   exemptions exist and a third must not be created silently. This
	   creates none. The 44px floor is twinned on .toc-chevron
	   (Drawer.svelte:1021-1024), the only control in the app that
	   already meets it. The chevron is the TOC's own 10x10 glyph, so no
	   new affordance enters the vocabulary. */
	/* Top-aligned, not centred. Centring a 0.7rem label inside a 44px box
	   put NOTATION's label 25px below its rule while ANALYSIS sat 6px
	   below its own (RootPanel.svelte:495-498). Dann caught the 19px.
	   The target stays 44 by 44 and simply extends downward from the
	   label rather than being centred on it, so no exemption is created. */
	.notation-disclosure {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		width: 100%;
		padding: 0;
		background: none;
		border: none;
		font: inherit;
		color: inherit;
		letter-spacing: inherit;
		text-transform: inherit;
		text-align: left;
		cursor: pointer;
	}

	/* An accordion, not a tree. Dann's correction of 2026-08-11 is the
	   durable rule and it is unchanged: the first pass borrowed
	   .toc-chevron's right-to-down rotation, which is a TREE convention and
	   belongs to a hierarchy, not to a panel. The glyph is still the TOC's;
	   only the rotation differs. .toc-chevron is a different control and
	   keeps its own rotation.

	   THE CHEVRON POINTS THE WAY THE PANEL WILL GROW. That is the rule the
	   two values express, and the two values were traded on 2026-08-20
	   because N.73 S3 moved the panel and the rule then demanded the
	   opposite pair.

	   Bottom-anchored, the panel grew UPWARD: closed pointed up ("more is up
	   there") and open pointed down ("push it back"). S3 pinned NOTATION to
	   the TOP of the drawer, where it grows DOWNWARD, so closed points down
	   and open points up. Found by Dann walking ship one; the two rotations
	   had been left saying the old geometry. */
	.chevron-icon {
		flex-shrink: 0;
		transform: rotate(90deg);
		transition: transform 150ms ease;
	}

	.chevron-icon.expanded {
		transform: rotate(-90deg);
	}

	@media (pointer: coarse) {
		.notation-disclosure {
			min-height: 44px;
		}
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
