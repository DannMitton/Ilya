<script lang="ts">
	/**
	 * Shane calibration wizard (the Drawer-panel surface for the Shane tab).
	 *
	 * Pacifier spec v11 §3: the wizard panel is "the pacifier above and a
	 * coaching field below that populates per active vowel." This component is
	 * that layout shell. The Pacifier carries the calibration interaction and its
	 * own live status caption; the coaching field below renders per-vowel
	 * pedagogical text.
	 *
	 * For this fold-in (Ilya2006B) the coaching field is a placeholder, per spec
	 * §11 ("Dann is editing the coaching content separately; the prototype renders
	 * a placeholder"). The Pacifier runs against its default StubCaptureSession,
	 * so calibration is live against the stub until the real engine lands.
	 *
	 * The score-reader upload surface and the analysis output are a later pass and
	 * are deliberately not part of this component.
	 */
	import Pacifier from '$lib/shane/pacifier/Pacifier.svelte';
	import type { Vowel, VoiceType, CalibratedFormant } from '$lib/shane/engine/types';

	interface CalibrationWizardProps {
		/** Routing key to the Bozeman value-sets; undefined until a selector lands. */
		voiceType?: VoiceType;
		/** Forwarded from the Pacifier, so a future parent can subscribe. */
		onVowelCaptured?: (vowel: Vowel, formant: CalibratedFormant) => void;
		/** Forwarded from the Pacifier, so a future parent can subscribe. */
		onProfileChange?: (formants: Partial<Record<Vowel, CalibratedFormant>>) => void;
	}

	let {
		voiceType = undefined,
		onVowelCaptured,
		onProfileChange
	}: CalibrationWizardProps = $props();
</script>

<section class="calibration-wizard" aria-label="Voice calibration">
	<Pacifier {voiceType} {onVowelCaptured} {onProfileChange} />
	<p class="wizard-coaching">
		Guidance for each vowel will appear here as you calibrate.
	</p>
</section>

<style>
	.calibration-wizard {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
	}

	.wizard-coaching {
		margin: 0;
		max-width: 30rem;
		color: var(--ink-tertiary);
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.9375rem;
		line-height: 1.5;
		text-align: center;
	}
</style>
