<script lang="ts">
	/**
	 * The one optional question before the first vowel (Dann, 2026-09-30 12:43
	 * and 12:44; brief `brief-code-calibration-first-moments_r1_2026-09-30.md`):
	 * the singer's voice type, asked only when the voice has none yet. The nine
	 * Tier 1 choices, "Not sure" among them and a good answer. Skippable: Begin
	 * stands without an answer. The answer is the same stored `voiceType` the
	 * Voice characteristics step edits (`VoiceTypeIntake.svelte`), so it routes
	 * the plausibility bands from the first take. Finer labels stay in Voice
	 * characteristics.
	 */
	import { t, type Language } from '$lib/i18n';
	import { TIER1, voiceTypeBorrowingNote, type Tier1Id } from './voiceTypes';

	interface Props {
		value: string | undefined;
		language: Language;
		onchange: (id: Tier1Id) => void;
	}

	let { value, language, onchange }: Props = $props();

	const T = (key: string) => t(key, language);
	/* The concession at the moment of choice (lane 74, item 4): for contralto, countertenor, and bass-baritone only, shown while that type is selected. */
	const borrowingNote = $derived(voiceTypeBorrowingNote(value, language));
</script>

<fieldset class="vt-first">
	<legend class="vt-legend">{T('calib.voiceTypeFirst.heading')}</legend>
	<p class="vt-hint">{T('calib.voiceTypeFirst.hint')}</p>
	<div class="vt-choices">
		{#each TIER1 as id (id)}
			<label class="vt-option">
				<input type="radio" name="voice-type-first" value={id} checked={value === id} onchange={() => onchange(id)} />
				<span>{T(`voiceType.type.${id}`)}</span>
			</label>
		{/each}
	</div>
	<!-- Below the grid, not inside it: the grid flows in two columns and would place the note by the flow. A polite live region, present before the note arrives; focus stays on the radio. -->
	<div class="vt-note" aria-live="polite">
		{#if borrowingNote}<p class="vt-hint">{borrowingNote}</p>{/if}
	</div>
</fieldset>

<style>
	/* `VoiceTypeIntake.svelte`'s recipes, laid in two columns, read downward, so the nine
	   choices do not push Begin off a phone screen. */
	.vt-first {
		margin: 0;
		padding: 0;
		border: 0;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		text-align: left;
		width: 100%;
		max-width: 22rem;
	}
	.vt-legend {
		padding: 0 0 0.35rem;
		font-family: var(--font-sans);
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--ink-tertiary);
		font-weight: 600;
	}
	.vt-hint {
		margin: 0 0 0.25rem;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.8125rem;
		color: var(--ink-tertiary);
		line-height: 1.4;
	}
	/* The live region stays in the page so the announcement pattern holds, but while it is empty it must not cost a flex gap. */
	.vt-note:empty {
		margin-top: -0.3rem;
	}
	/* BEGIN STAYS IN REACH ON A SHORT PHONE (lane 75, item 3; QUEUE row 167). The welcome screen's Begin follows this picker in the page, and with a note shown it sits 41 to 172 px
	   below the fold at 390 by 667, 375 by 667, and 360 by 640 (English and French). On a short touch screen the picker is laid after Begin instead: `order` on this fieldset, a
	   flex item of the wizard's `.wizard-phase`, so nothing is covered. The source order is not moved, so a keyboard still reaches the picker first; the rule is touch only for that reason.
	   880 is measured: the tallest case (French, 360 wide, note shown) puts Begin's bottom at 812, and the drawer's bottom bar takes the last 56 px of the window, so it needs 868. */
	@media (max-height: 880px) and (pointer: coarse) {
		.vt-first {
			order: 1;
		}
	}
	.vt-choices {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		grid-template-rows: repeat(5, auto);
		grid-auto-flow: column; /* reads down, in `TIER1`'s order */
		gap: 0.3rem 1rem;
	}
	.vt-option {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.8125rem;
		line-height: 1.35;
		color: var(--ink-secondary);
		cursor: pointer;
	}
	.vt-option input {
		margin: 0.15rem 0 0;
		flex-shrink: 0;
	}
</style>
