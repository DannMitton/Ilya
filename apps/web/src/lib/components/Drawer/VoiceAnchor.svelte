<script lang="ts">
	/**
	 * THE VOICE ANCHOR (N.73 S3 ship one).
	 *
	 * One line, pinned to the foot of the Studio drawer: a lavender dot, what
	 * the voice's state is, and the one control that opens the calibration
	 * takeover. Drawn at `fable-gui-mockup_r1_2026-08-18.html:333-338`; the
	 * architecture it belongs to is that file's own caption, "the voice is
	 * pinned bottom with its lavender kept to that one line."
	 *
	 * LAVENDER'S ONLY CARRIERS IN STUDIO are this line and the calibration
	 * surfaces (`fable-ruling-s0-slate-closed_2026-08-19.md`, ruling 3). The
	 * token is the project's `--deeper-lavender`, not the mockup's
	 * `--lavender: #9B8AA6`, which that file declares a stand-in on its own
	 * line 17.
	 *
	 * This component decides nothing. It renders what it is given and calls
	 * back. Whether the voice HAS readings is `hasAnyReadings` in
	 * `profileStore.ts`, which the calibration wizard reads from the same
	 * place, so the two can never disagree.
	 */
	import { t, type Language } from '$lib/i18n';

	interface Props {
		/** The active voice's name, undefined before first-launch naming. */
		voiceName?: string;
		/** Whether the active voice holds any reading at all. */
		calibrated: boolean;
		language: Language;
		/** Opens the calibration takeover. */
		oncalibrate: () => void;
	}

	let { voiceName = undefined, calibrated, language, oncalibrate }: Props = $props();

	/* The calibrated line names the voice. With readings but no name (which
	   only the pre-naming instant can produce) it falls back to the
	   uncalibrated sentence rather than printing an empty pair of guillemets. */
	const status = $derived(
		calibrated && voiceName
			? t('calib.anchor.named', language).replace('{voice}', voiceName)
			: t('calib.anchor.uncalibrated', language)
	);
	const action = $derived(
		calibrated ? t('calib.anchor.recalibrate', language) : t('calib.anchor.calibrate', language)
	);
</script>

<div class="voice-line">
	<span class="voice-dot" aria-hidden="true"></span>
	<!-- The mockup bolds the state half of this sentence. It is rendered at
	     one weight here instead, because bolding half of it means splitting a
	     ratified string into two, and the approved table has four strings. -->
	<span class="voice-status">{status}</span>
	<button type="button" class="voice-action" onclick={oncalibrate}>{action}</button>
</div>

<style>
	.voice-line {
		display: flex;
		align-items: center;
		gap: 8px;
		/* The mockup's 9px 12px, with 9px kept and the sides given up.
		   N.65 ship one, Dann's walk: `.drawer-anchor-bottom` carries the
		   1rem now, as a MARGIN, so the shelf's rule is inset like every
		   other station rule instead of running full bleed. This line keeps
		   the same left edge it always had; the 1rem just belongs to the
		   shelf rather than to the line. */
		padding: 9px 0;
	}

	.voice-dot {
		width: 10px;
		height: 10px;
		flex-shrink: 0;
		border-radius: 50%;
		background: var(--deeper-lavender);
	}

	.voice-status {
		flex: 1;
		min-width: 0;
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--ink-secondary);
		/* A long voice name never pushes the control off the line. */
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* Matches RootPanel's .action-btn geometry exactly, so the drawer has one
	   button shape. The fill is lavender rather than sage because this is the
	   calibration surface's entry point.

	   MEASURED, not assumed: white on --deeper-lavender is 3.74:1. That is
	   below the 4.5:1 normal-text floor and ABOVE the tree's own shipped
	   precedent, white on --sage at 2.99:1, which .btn-primary has carried
	   since before N.73. Recorded rather than fixed here: darkening a ruled
	   palette token is Dann's, not this ship's. */
	/* PILL ENDS, N.108 increment 4. Ruled by Dann 2026-09-03 from the
	   calibration ritual's own two buttons (`CalibrationWizard.svelte`'s
	   `.wizard-primary` and `.wizard-secondary`, `border-radius: 999px`):
	   "The buttons shown here can form the template. Can we make other
	   buttons share its rounded ends?" Only the corners move; the fill, the
	   border, the type and the padding are untouched. */
	.voice-action {
		flex-shrink: 0;
		padding: 0.45rem 0.7rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 600;
		color: white;
		background: var(--deeper-lavender);
		border: none;
		border-radius: 999px;
		cursor: pointer;
		transition: opacity 0.12s;
	}

	.voice-action:hover {
		opacity: 0.85;
	}

	/* The 44px floor, on the control only. The mockup's small type is the
	   drawn look; the target grows, the type does not. Same device as
	   NotationFields.svelte's .notation-disclosure, which is the tree's own
	   precedent for a drawer control on a coarse pointer. */
	@media (pointer: coarse) {
		.voice-action {
			min-height: 44px;
			min-width: 44px;
		}
	}
</style>
