<script lang="ts">
	/**
	 * THE QUIET LINE for the voice line read an octave up or down for the
	 * singer's range (QUEUE row 47; Dann, 2026-10-08, 01:11 to 01:20). A small
	 * circled 8, the state sentence, a middle dot, and a tap, in Insights and
	 * in Markup. ONE COMPONENT FOR BOTH TABS, so the two cannot say it in two
	 * ways (the row 47 review, amendment 4).
	 *
	 * `shift` is the direction the singer's range asks for (−1 lower, +1
	 * higher), and it is what decides whether the line is drawn at all: the
	 * caller draws it only where a shift WOULD apply. `applied` is whether it
	 * is applied now. Applied, the line says how the song is read and offers
	 * "As written"; as written, it says so and offers "Read for your range".
	 *
	 * The five strings are Dann's, ratified 2026-10-08 01:20 (`octave.*` in
	 * `i18n.ts`). The circle is drawn as Transcribe's legend draws its circles
	 * (`Paper/LegendItems.svelte`, `.legend-circle`): a 16 px ring in the
	 * current ink. The tap is a real button and it is screen only: a printed
	 * copy drops it and its dot (the print rule below), as the page's other
	 * controls are dropped (`CONTRACT.md` §6).
	 *
	 * `interactive` is false for the copy a pane draws only to measure, which
	 * must not take focus.
	 */
	import { t, type Language } from '$lib/i18n';

	interface Props {
		language: Language;
		shift: -1 | 1;
		applied: boolean;
		ontoggle?: () => void;
		interactive?: boolean;
	}

	let { language, shift, applied, ontoggle = undefined, interactive = true }: Props = $props();

	const state = $derived(t(applied ? (shift < 0 ? 'octave.readLower' : 'octave.readHigher') : 'octave.asWrittenState', language));
	const tap = $derived(t(applied ? 'octave.toAsWritten' : 'octave.toForRange', language));
</script>

<p class="octave-line" data-octave-line data-applied={applied ? 'true' : 'false'} data-shift={shift}>
	<span class="octave-circle" aria-hidden="true">8</span>
	<span class="octave-state">{state}</span>
	<span class="octave-dot" aria-hidden="true">{'·'}</span>
	<button type="button" class="octave-tap" tabindex={interactive ? 0 : -1} onclick={() => ontoggle?.()}>{tap}</button>
</p>

<style>
	.octave-line {
		box-sizing: border-box;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35rem 0.45rem;
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-style: italic;
		font-size: 0.92rem;
		line-height: 1.5;
		color: var(--ink-secondary, #4a4540);
	}

	.octave-circle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		flex-shrink: 0;
		box-sizing: border-box;
		border: 1px solid currentColor;
		border-radius: 50%;
		font-family: var(--font-sans);
		font-style: normal;
		font-size: 10px;
		line-height: 1;
	}

	.octave-tap {
		appearance: none;
		margin: 0;
		padding: 0.1rem 0.15rem;
		border: 0;
		background: none;
		font: inherit;
		color: var(--lavender-ink, #6b5b7a);
		text-decoration: underline;
		text-underline-offset: 2px;
		cursor: pointer;
	}

	.octave-tap:focus-visible {
		outline: 2px solid var(--lavender, #9585a2);
		outline-offset: 2px;
		border-radius: 3px;
	}

	@media print {
		.octave-tap,
		.octave-dot {
			display: none;
		}
	}
</style>
