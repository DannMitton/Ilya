<script lang="ts">
	/**
	 * THE TRANSPOSITION RULER, desktop (N.94 slice 1). Drawing r4, plate 2, accepted by
	 * Dann 2026-09-28: `docs/sessions/drawing-key-ruler_r4_2026-09-28.html`.
	 *
	 * A floating layer over the whole page, NEVER PRINTED (`CONTRACT.md` §6,
	 * ruled 2026-09-28 19:23): the page's print rule hides it, and it is not
	 * part of any page's SVG. The printed key sits in its grey box, the
	 * selection is circled, and the runner-up is dotted. Enharmonic twins
	 * (B and C flat) are separate stops side by side under a faint bracket.
	 * No tick marks.
	 *
	 * THE SELECTION IS SHARED, not held here (`transposition-ruler-state.svelte.ts`):
	 * the pane redraws the page in the selected key while this is open
	 * (ruling 12), so it has to see every tap.
	 * Where it opens is `rulerOpening` in `transposition-ruler.ts`. Nothing evaluative is
	 * said when the selection leaves Ilya's recommendation (ruling 10).
	 *
	 * IT CARRIES ITS OWN ANCHOR: a zero-height sticky box, so it rides over the
	 * page in view while the singer scrolls and takes no room in the page stack.
	 *
	 * THE TWINS (slice 2, Dann 2026-09-28 21:41): of two keys that sound the
	 * same, the one that draws more double accidentals is dimmed. It stays
	 * tappable, and its readout gains the count ("Carries 2 double flats").
	 *
	 * ON A PHONE this hands over to the dock of plate 4
	 * (`TranspositionDock.svelte`), with the same state and the same words.
	 *
	 * NOT DRAWN: the direction row under the stops ("lower, as printed,
	 * higher"), whose words are not in the ruled table.
	 */
	import type { KeyChoice, KeyStop } from '@ilya/score-parser';
	import { t, type Language } from '$lib/i18n';
	import { countLines, isHome, readout, stopGroups, stopId, stopLabel, stopsFor } from './transposition-ruler';
	import type { TranspositionRulerState } from './transposition-ruler-state.svelte';
	import TranspositionDock from './TranspositionDock.svelte';

	interface Props {
		/** Mounted only while `keyRuler.ruler` is set, so it and `printed` are present. */
		keyRuler: TranspositionRulerState;
		/** The page's width, so the ruler spans the page as drawn. */
		width: number;
		language: Language;
	}

	let { keyRuler, width, language }: Props = $props();

	const printed = $derived(keyRuler.printed!);
	const stops: KeyStop[] = $derived(stopsFor(printed));
	const selected = $derived(keyRuler.ruler!.selected);
	const pick = $derived(keyRuler.ruler!.pick);
	const runnerUp = $derived(keyRuler.ruler!.runnerUp);
	const onselect = (stop: KeyChoice) => keyRuler.select(stop);
	const oncancel = () => keyRuler.close();
	/** "Use this key": the selected stop, or null when it is the printed key. */
	const onuse = (choice: KeyChoice | null) => keyRuler.use(choice);

	const same = (a: KeyChoice | null, b: KeyChoice | null) =>
		!!a && !!b && a.semitones === b.semitones && a.fifths === b.fifths;

	/** Runs of stops with the same move: a run of two is a bracketed pair. */
	const groups = $derived(stopGroups(stops));
	const dimmed = $derived(keyRuler.ruler!.dimmed);
	/** A dimmed stop's count lines; empty for any other stop. */
	const counted = (stop: KeyChoice) =>
		dimmed.has(stopId(stop)) ? countLines(keyRuler.ruler!.counts[stopId(stop)], language) : [];

	/** The readout, with "Ilya's recommendation" set apart as the drawing sets it. */
	const line = $derived.by(() => {
		const plain = readout(selected, printed, null, language);
		const full = readout(selected, printed, pick, language);
		return { plain, rest: full.startsWith(plain) ? full.slice(plain.length) : '', counts: counted(selected) };
	});

	const selectedIndex = $derived(stops.findIndex((s) => same(s, selected)));

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			oncancel();
			return;
		}
		const step = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0;
		if (!step) return;
		e.preventDefault();
		const next = stops[Math.min(stops.length - 1, Math.max(0, selectedIndex + step))];
		if (next) onselect(next);
	}

	let strip: HTMLDivElement | undefined = $state();
	// Focus follows the selection, so the arrows keep working after a redraw.
	$effect(() => {
		void selectedIndex;
		strip?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus({ preventScroll: true });
	});
</script>

{#if keyRuler.phone}
	<TranspositionDock {keyRuler} {language} />
{:else}
<div class="transposition-ruler-anchor" style="width: {width}px;">
<div class="transposition-ruler" role="dialog" aria-label={t('key.band.try', language)}>
	<p class="readout" aria-live="polite">
		{line.plain}{#if line.rest}<span class="readout-rest">{line.rest}</span>{/if}
		{#each line.counts as c (c)}<span class="readout-count">{c}</span>{/each}
	</p>
	<!-- svelte-ignore a11y_interactive_supports_focus -->
	<div class="stops" role="radiogroup" aria-label={t('key.band.try', language)} bind:this={strip} {onkeydown}>
		{#each groups as group, g (g)}
			<div class="group" class:pair={group.length > 1}>
				{#each group as stop (stop.semitones + ':' + stop.fifths)}
					{@const isSel = same(stop, selected)}
					<button
						type="button"
						class="stop"
						class:home={stop.semitones === 0 && stop.fifths === printed.fifths}
						class:sel={isSel}
						class:run={same(stop, runnerUp)}
						class:dim={dimmed.has(stopId(stop))}
						role="radio"
						aria-checked={isSel}
						aria-label={[readout(stop, printed, pick, language), ...counted(stop)].join('. ')}
						tabindex={isSel ? 0 : -1}
						onclick={() => onselect(stop)}
					>
						<span class="stop-name">{stopLabel(stop, printed, language)}</span>
					</button>
				{/each}
			</div>
		{/each}
	</div>
	<div class="actions">
		<button type="button" class="pill ghost" onclick={oncancel}>{t('key.ruler.cancel', language)}</button>
		<button type="button" class="pill filled" onclick={() => onuse(isHome(selected, printed) ? null : selected)}>{t('key.ruler.use', language)}</button>
	</div>
</div>
</div>
{/if}

<style>
	/* Values from drawing r4, plate 2. JUDGEMENT, the drawing's own: it says its
	   sizes are approximate. */
	/* Zero height, and the negative margin cancels the page stack's 2rem gap
	   (`.markup-paper-container`), so the ruler moves no page. */
	.transposition-ruler-anchor {
		position: sticky;
		top: 12px;
		height: 0;
		margin-bottom: -2rem;
		z-index: 20;
	}

	.transposition-ruler {
		position: absolute;
		top: 10px;
		left: 14px;
		right: 14px;
		background: rgba(250, 248, 243, 0.97);
		border: 1.4px solid var(--ink-primary);
		border-radius: 12px;
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
		padding: 10px 14px 12px;
		font-family: var(--font-sans);
		color: var(--ink-primary);
	}

	.readout {
		margin: 0 0 6px;
		text-align: center;
		font-size: 14px;
		font-weight: 600;
	}

	.readout-rest {
		font-weight: 400;
		color: var(--ink-tertiary);
	}

	.stops {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		padding: 0 4px;
	}

	.group {
		display: flex;
	}

	/* The faint bracket over a pair of keys that sound the same. */
	.group.pair {
		gap: 2px;
		border-top: 1.5px solid var(--lavender-desk);
		border-radius: 6px 6px 0 0;
		padding-top: 3px;
	}

	.stop {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		min-height: 34px;
		padding: 2px 0;
		border: none;
		border-radius: 6px;
		background: transparent;
		font: inherit;
		font-size: 12px;
		color: var(--ink-tertiary);
		cursor: pointer;
	}

	.group.pair .stop {
		width: 30px;
	}

	.stop.home {
		background: #e8e4dc;
		color: var(--ink-primary);
	}

	.stop.sel .stop-name {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: var(--lavender);
		color: #fff;
	}

	/* The busier twin: faded, never disabled. JUDGEMENT, the desk's value. */
	.stop.dim:not(.sel) {
		opacity: 0.4;
	}

	.readout-count {
		display: block;
		font-size: 12px;
		font-weight: 400;
		color: var(--ink-tertiary);
	}

	.stop.run:not(.sel) .stop-name {
		border-bottom: 2px dotted var(--lavender);
	}

	.stop:focus-visible {
		outline: 2px solid var(--lavender-ink);
		outline-offset: 1px;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 8px;
		margin-top: 10px;
	}

	/* The house pill (`RootPanel.svelte`'s `.action-btn`, ruled 2026-09-03). */
	.pill {
		padding: 0.35rem 0.9rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 600;
		border-radius: 999px;
		cursor: pointer;
	}

	.pill.ghost {
		color: var(--ink-primary);
		background: #fff;
		font-weight: 500;
		border: 1px solid var(--ink-primary);
	}

	.pill.filled {
		color: #fff;
		background: var(--lavender);
		border: 1px solid var(--lavender);
	}

	.pill:hover {
		opacity: 0.85;
	}

	@media print {
		.transposition-ruler-anchor {
			display: none;
		}
	}
</style>
