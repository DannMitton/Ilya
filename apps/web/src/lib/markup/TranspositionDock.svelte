<script lang="ts">
	/**
	 * THE TRANSPOSITION RULER, phone (N.94 slice 2). Drawing r4, plate 4,
	 * accepted by Dann 2026-09-28: `docs/sessions/drawing-key-ruler_r4_2026-09-28.html`.
	 *
	 * The same line as the desk's, docked at the bottom edge as the loupe's dock
	 * is: a window onto the stops, each a full 44 px (the tap floor), with the
	 * edges faded to show the line continues. A swipe slides the line and it
	 * settles on the stop nearest the centre; the page above redraws in it. The
	 * two chips jump to the printed key and to Ilya's pick, so neither is ever
	 * out of reach. The readout and the pills are the desk's.
	 *
	 * The chips sit above the window, as plate 4 draws them. The brief's prose
	 * says "the chips below"; the accepted drawing wins. DESK DEFAULT.
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
	import type { KeyChoice } from '@ilya/score-parser';
	import { t, type Language } from '$lib/i18n';
	import {
		countLines,
		homeStop,
		isHome,
		readout,
		stopGroups,
		stopId,
		stopLabel,
		stopsFor,
	} from './transposition-ruler';
	import type { TranspositionRulerState } from './transposition-ruler-state.svelte';

	interface Props {
		/** Mounted only while `keyRuler.ruler` is set, so it and `printed` are present. */
		keyRuler: TranspositionRulerState;
		language: Language;
	}

	let { keyRuler, language }: Props = $props();

	const printed = $derived(keyRuler.printed!);
	const stops = $derived(stopsFor(printed));
	const groups = $derived(stopGroups(stops));
	const selected = $derived(keyRuler.ruler!.selected);
	const pick = $derived(keyRuler.ruler!.pick);
	const runnerUp = $derived(keyRuler.ruler!.runnerUp);
	const dimmed = $derived(keyRuler.ruler!.dimmed);
	const home = $derived(homeStop(printed));
	const selectedIndex = $derived(stops.findIndex((s) => same(s, selected)));

	const same = (a: KeyChoice | null, b: KeyChoice | null) =>
		!!a && !!b && a.semitones === b.semitones && a.fifths === b.fifths;
	const counted = (stop: KeyChoice) =>
		dimmed.has(stopId(stop)) ? countLines(keyRuler.ruler!.counts[stopId(stop)], language) : [];
	const chip = (key: string, stop: KeyChoice) =>
		t(key, language).replace('{tonic}', stopLabel(stop, printed, language));

	const line = $derived.by(() => {
		const plain = readout(selected, printed, null, language);
		const full = readout(selected, printed, pick, language);
		return { plain, rest: full.startsWith(plain) ? full.slice(plain.length) : '', counts: counted(selected) };
	});

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

	let win: HTMLDivElement | undefined = $state();
	let settleTimer: ReturnType<typeof setTimeout> | undefined;
	let placed = false;

	/** The stop whose centre is nearest the window's centre. */
	function settle() {
		if (!win) return;
		const mid = win.scrollLeft + win.clientWidth / 2;
		let best = -1;
		let bestGap = Infinity;
		win.querySelectorAll<HTMLButtonElement>('[data-stop]').forEach((b, i) => {
			const gap = Math.abs(b.offsetLeft + b.offsetWidth / 2 - mid);
			if (gap < bestGap) [best, bestGap] = [i, gap];
		});
		if (best >= 0 && best !== selectedIndex) keyRuler.select(stops[best]);
	}

	function onscroll() {
		clearTimeout(settleTimer);
		settleTimer = setTimeout(settle, 120);
	}

	// The selection sits in the centre of the window, whoever moved it.
	$effect(() => {
		const b = win?.querySelectorAll<HTMLButtonElement>('[data-stop]')[selectedIndex];
		if (!win || !b) return;
		const left = b.offsetLeft + b.offsetWidth / 2 - win.clientWidth / 2;
		win.scrollTo({ left, behavior: placed ? 'smooth' : 'instant' });
		placed = true;
	});

	$effect(() => () => clearTimeout(settleTimer));

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			keyRuler.close();
			return;
		}
		const step = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0;
		if (!step) return;
		e.preventDefault();
		const next = stops[Math.min(stops.length - 1, Math.max(0, selectedIndex + step))];
		if (next) keyRuler.select(next);
	}
</script>

<div class="dock-host" bind:this={host}>
	<div class="dock" use:toBody bind:this={dock} role="dialog" aria-label={t('key.band.try', language)}>
		<div class="chips">
			<button type="button" class="chip" onclick={() => keyRuler.select(home)}>
				<span class="chip-face">{chip('key.dock.asPrinted', home)}</span>
			</button>
			{#if pick}
				<button type="button" class="chip" onclick={() => keyRuler.select(pick!)}>
					<span class="chip-face pick">{chip('key.dock.pick', pick)}</span>
				</button>
			{/if}
		</div>
		<div class="win-frame">
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<div class="win" role="radiogroup" aria-label={t('key.band.try', language)} bind:this={win} {onscroll} {onkeydown}>
			<div class="strip">
				{#each groups as group, g (g)}
					<div class="group" class:pair={group.length > 1}>
						{#each group as stop (stopId(stop))}
							{@const isSel = same(stop, selected)}
							<button
								type="button"
								class="stop"
								data-stop
								class:home={same(stop, home)}
								class:sel={isSel}
								class:run={same(stop, runnerUp)}
								class:dim={dimmed.has(stopId(stop))}
								role="radio"
								aria-checked={isSel}
								aria-label={[readout(stop, printed, pick, language), ...counted(stop)].join('. ')}
								tabindex={isSel ? 0 : -1}
								onclick={() => keyRuler.select(stop)}
							>
								<span class="stop-name">{stopLabel(stop, printed, language)}</span>
							</button>
						{/each}
					</div>
				{/each}
			</div>
		</div>
		<div class="fade l" aria-hidden="true"></div>
		<div class="fade r" aria-hidden="true"></div>
		</div>
		<p class="readout" aria-live="polite">
			{line.plain}{#if line.rest}<span class="readout-rest">{line.rest}</span>{/if}
			{#each line.counts as c (c)}<span class="readout-count">{c}</span>{/each}
		</p>
		<div class="actions">
			<button type="button" class="pill-hit" onclick={() => keyRuler.close()}>
				<span class="pill ghost">{t('key.ruler.cancel', language)}</span>
			</button>
			<button type="button" class="pill-hit" onclick={() => keyRuler.use(isHome(selected, printed) ? null : selected)}>
				<span class="pill filled">{t('key.ruler.use', language)}</span>
			</button>
		</div>
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
	.chip,
	.pill-hit {
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

	.win {
		position: relative;
		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
		overscroll-behavior-x: contain;
	}

	.win::-webkit-scrollbar {
		display: none;
	}

	/* Half a window of room at each end, so the first and last stops can
	   settle in the centre. */
	.strip {
		display: flex;
		align-items: flex-end;
		width: max-content;
		padding: 0 calc(50vw - 32px);
	}

	.group {
		display: flex;
	}

	.group.pair {
		border-top: 1.5px solid var(--lavender-desk);
		border-radius: 6px 6px 0 0;
	}

	.stop {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		padding: 0;
		border: none;
		border-radius: 8px;
		background: transparent;
		font: inherit;
		font-size: 13px;
		color: var(--ink-tertiary);
		scroll-snap-align: center;
		cursor: pointer;
	}

	.stop.home {
		background: #e8e4dc;
		color: var(--ink-primary);
	}

	.stop.sel .stop-name {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--lavender);
		color: #fff;
		font-weight: 600;
	}

	.stop.run:not(.sel) .stop-name {
		border-bottom: 2px dotted var(--lavender);
	}

	/* The busier twin: faded, never disabled. JUDGEMENT, the desk's value. */
	.stop.dim:not(.sel) {
		opacity: 0.4;
	}

	.stop:focus-visible {
		outline: 2px solid var(--lavender-ink);
		outline-offset: -2px;
	}

	.win-frame {
		position: relative;
	}

	.fade {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 36px;
		pointer-events: none;
	}

	.fade.l {
		left: 0;
		background: linear-gradient(to right, rgba(250, 248, 243, 1), rgba(250, 248, 243, 0));
	}

	.fade.r {
		right: 0;
		background: linear-gradient(to left, rgba(250, 248, 243, 1), rgba(250, 248, 243, 0));
	}

	.readout {
		margin: 4px 0 0;
		text-align: center;
		font-size: 12.5px;
		font-weight: 600;
	}

	.readout-rest {
		font-weight: 400;
		color: var(--ink-tertiary);
	}

	.readout-count {
		display: block;
		font-size: 12px;
		font-weight: 400;
		color: var(--ink-tertiary);
	}

	.actions {
		display: flex;
		justify-content: space-between;
	}

	/* The house pill (`RootPanel.svelte`'s `.action-btn`, ruled 2026-09-03). */
	.pill {
		padding: 0.35rem 0.9rem;
		font-size: 0.8rem;
		font-weight: 600;
		border-radius: 999px;
		white-space: nowrap;
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

	@media print {
		.dock {
			display: none;
		}
	}
</style>
