<script lang="ts">
	/**
	 * THE TRANSPOSITION RULER, phone (N.94 slice 2; the slider ruled by Dann
	 * 2026-11-26, panel C of `docs/sessions/mockup-ribbon-dock-390_r1_2026-11-26.svg`).
	 *
	 * The desk's slider, docked at the bottom edge as the loupe's dock is. Seven
	 * of the thirteen nodes show, six and a blank slot while -6 or +6 is chosen;
	 * the ribbon slides only when the thumb would leave slots two to six, and the
	 * window does not scroll natively. The two chips commit the printed key and
	 * Ilya's pick, so neither is ever out of reach. Every route here commits: a tap, a chip, an arrow key, a drag's
	 * release. The readout, the slider, and Undo are `TranspositionRuler.svelte`'s
	 * (`body`), so the two screens show one control.
	 *
	 * The chips sit above the readout. DESK DEFAULT, carried from plate 4 of
	 * drawing r4.
	 *
	 * IT LEAVES THE PAGE STACK FOR THE BODY (`toBody`): on a phone the sheet is
	 * scaled by a transform (`PageFit.svelte`), and a fixed box inside a
	 * transformed one is fixed to that box, not to the screen.
	 *
	 * IT RESERVES ROOM UNDER THE PAGE while it is open (the effect after `scroller`), so
	 * the last system can scroll clear of it and nothing the singer is
	 * judging sits under it. Brief addendum 2026-09-28 23:55, DESK DEFAULT.
	 * The background stays plate 4's 98 %.
	 *
	 * NEVER PRINTED (`CONTRACT.md` §6): the print rule hides it.
	 */
	import type { Snippet } from 'svelte';
	import type { KeyChoice } from '@ilya/score-parser';
	import { t, type Language } from '$lib/i18n';
	import { homeStop, stopLabel } from './transposition-ruler';
	import type { TranspositionRulerState } from './transposition-ruler-state.svelte';

	interface Props {
		/** Mounted only while `keyRuler.ruler` is set, so it and `printed` are present. */
		keyRuler: TranspositionRulerState;
		language: Language;
		/** The readout, the slider, and Undo. */
		body: Snippet<[boolean]>;
	}

	let { keyRuler, language, body }: Props = $props();

	const printed = $derived(keyRuler.printed!);
	const pick = $derived(keyRuler.ruler!.pick);
	const home = $derived(homeStop(printed));
	const chip = (key: string, stop: KeyChoice) =>
		t(key, language).replace('{tonic}', stopLabel(stop, printed, language));

	/** Out of the transformed page stack, onto the body (see the header). */
	function toBody(node: HTMLElement) {
		document.body.appendChild(node);
		return { destroy: () => node.remove() };
	}

	/** The nearest ancestor that scrolls vertically: the page's scroller. */
	function scroller(from: HTMLElement | null): HTMLElement | null {
		for (let el = from; el; el = el.parentElement) {
			if (/(auto|scroll)/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight) return el;
		}
		return null;
	}

	let host: HTMLDivElement | undefined = $state();
	let dock: HTMLDivElement | undefined = $state();

	/* The scroller's bottom padding becomes the dock's height plus portrait
	   C's 0.5rem, the same clearance the drawer's pull gets (`+page.svelte`,
	   `.main-content`). The dock covers the pull while it is open. Set once
	   at once, because a hidden tab never runs a ResizeObserver, then kept
	   in step by one; the scroller's own value comes back on close. */
	$effect(() => {
		const el = scroller(host?.parentElement ?? null);
		if (!el || !dock) return;
		const was = el.style.paddingBottom;
		const reserve = () => (el.style.paddingBottom = `calc(${dock!.offsetHeight}px + 0.5rem)`);
		reserve();
		const ro = new ResizeObserver(reserve);
		ro.observe(dock);
		return () => {
			ro.disconnect();
			el.style.paddingBottom = was;
		};
	});
</script>

<div class="dock-host" bind:this={host}>
	<div class="dock" use:toBody bind:this={dock} role="dialog" aria-label={t('key.band.try', language)} data-transposition-ribbon>
		<div class="chips">
			<button type="button" class="chip" onclick={() => keyRuler.commit(home)}>
				<span class="chip-face">{chip('key.dock.asPrinted', home)}</span>
			</button>
			{#if pick}
				<button type="button" class="chip" onclick={() => keyRuler.commit(pick!)}>
					<span class="chip-face pick">{chip('key.dock.pick', pick)}</span>
				</button>
			{/if}
		</div>
		{@render body(true)}
	</div>
</div>

<style>
	/* Values from drawing r4, plate 4. JUDGEMENT, the drawing's own: it says
	   its sizes are approximate. The 44 px tap floor is the plate's. */
	.dock-host {
		display: contents;
	}

	.dock {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9050;
		background: rgba(250, 248, 243, 0.98);
		border-top: 1.4px solid var(--ink-primary);
		border-radius: 16px 16px 0 0;
		box-shadow: 0 -6px 16px rgba(0, 0, 0, 0.15);
		padding: 6px 10px calc(10px + env(safe-area-inset-bottom, 0px));
		font-family: var(--font-sans);
		color: var(--ink-primary);
	}

	.chips {
		display: flex;
		justify-content: center;
		gap: 6px;
	}

	/* The chip is drawn small; its button is the full 44 px tap target. */
	.chip {
		display: flex;
		align-items: center;
		min-height: 44px;
		padding: 0 2px;
		border: none;
		background: transparent;
		font: inherit;
		cursor: pointer;
	}

	.chip-face {
		border: 1px solid var(--ink-tertiary);
		border-radius: 999px;
		padding: 3px 10px;
		background: #fff;
		font-size: 11px;
		color: var(--ink-primary);
		white-space: nowrap;
	}

	.chip-face.pick {
		border-color: var(--lavender);
		color: var(--lavender-ink);
	}

	@media print {
		.dock {
			display: none;
		}
	}
</style>
