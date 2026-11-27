<script lang="ts">
	/**
	 * THE TRANSPOSITION RULER: a detented slider of semitones, -6 to +6
	 * (`docs/memory/OPEN.md`, "N.94 THE RIBBON IS A DETENTED SLIDER OF
	 * SEMITONES", ruled by Dann 2026-11-26; drawing
	 * `docs/sessions/mockup-ribbon-dots_r2_2026-11-26.svg`). Top to bottom, per
	 * node: the integer; a dot on the track, which the thumb rides; the interval
	 * label, `ORIG.` at node zero; and, under the selected node only, both
	 * spellings of a pair, flat left. Node zero's dot is a ring; dots inside the
	 * travelled stretch are white on the filled bar.
	 *
	 * THE TAP IS THE COMMIT. There is no Cancel and no confirm button: a tap, an
	 * arrow key, or a drag's release writes the song's key and the page redraws.
	 * A tap outside or Escape closes and the key stands; Undo takes back the last
	 * commit while the ruler is open.
	 *
	 * THE SPELLING HALVES are invisible regions 96 by 46 px below the interval
	 * labels, wider than their node, clipped only where the card or the screen
	 * ends. The faded one swaps the spelling. Elsewhere in that band a tap
	 * selects the node above.
	 *
	 * Ilya's pick is underlined solid and the runner-up dotted, under the
	 * interval label, until the node is selected. DESK DEFAULT, drawn in no
	 * mockup. Nothing evaluative is said when the selection leaves the
	 * recommendation (ruling 10 of drawing r4).
	 *
	 * A floating layer over the whole page, NEVER PRINTED (`CONTRACT.md` §6,
	 * ruled 2026-09-28 19:23): the print rule hides it, and it is not part of any
	 * page's SVG.
	 *
	 * THE SELECTION IS SHARED, not held here (`transposition-ruler-state.svelte.ts`).
	 * The rules (nodes, snap, window) are in `transposition-ruler.ts`.
	 *
	 * IT CARRIES ITS OWN ANCHOR: a zero-height sticky box, so it rides over the
	 * page in view while the singer scrolls and takes no room in the page stack.
	 * The card runs the page's full width, so that the end nodes' spellings have
	 * room to centre while the track keeps its length.
	 *
	 * ON A PHONE the same readout, slider, and Undo sit in the dock
	 * (`TranspositionDock.svelte`), a window of seven slots; the ribbon slides
	 * only when the thumb would leave slots two to six. At -6 and +6 it travels
	 * one slot past the end, so six nodes and a blank show and the end's pair
	 * has room to centre (`slideWindow`).
	 */
	import { untrack } from 'svelte';
	import type { KeyChoice } from '@ilya/score-parser';
	import { t, type Language } from '$lib/i18n';
	import {
		commitStop,
		countLines,
		isHome,
		readout,
		ribbonNodes,
		sameKey,
		semitoneLabel,
		shortInterval,
		slideWindow,
		snapSemitone,
		stopId,
		stopLabel,
		WINDOW_SLOTS,
		wordedTonic,
		type RibbonNode,
	} from './transposition-ruler';
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
	const nodes = $derived(ribbonNodes(printed));
	const selected = $derived(keyRuler.ruler!.selected);
	const pick = $derived(keyRuler.ruler!.pick);
	const runnerUp = $derived(keyRuler.ruler!.runnerUp);
	const dimmed = $derived(keyRuler.ruler!.dimmed);
	/** Where the thumb and the readout are: the drag's node, else the selection. */
	const shown = $derived(keyRuler.dragged ?? selected);

	const indexOf = (semitones: number) => nodes.findIndex((n) => n.semitones === semitones);
	const selectedIndex = $derived(indexOf(selected.semitones));
	const thumb = $derived(indexOf(shown.semitones));
	const zero = $derived(indexOf(0));

	/** A node's centre along the whole track, as a percentage. */
	const centre = (i: number) => ((i + 0.5) / nodes.length) * 100;

	const counted = (stop: KeyChoice) =>
		dimmed.has(stopId(stop)) ? countLines(keyRuler.ruler!.counts[stopId(stop)], language) : [];
	/** The stop a tap on this node lands on, which is the one its radio names. */
	const lands = (node: RibbonNode) => commitStop(node, selected, dimmed, printed);
	const name = (stop: KeyChoice) =>
		[
			readout(stop, printed, pick, language),
			...counted(stop),
			...(isHome(stop, printed) ? [t('key.band.backToPrinted', language)] : []),
		].join('. ');
	const respell = (stop: KeyChoice) =>
		t('key.ruler.respell', language).replace('{tonic}', stopLabel(stop, printed, language));

	/** The readout, with "Ilya's recommendation" set apart as the drawing sets it. */
	const line = $derived.by(() => {
		const plain = readout(shown, printed, null, language);
		const full = readout(shown, printed, pick, language);
		return { plain, rest: full.startsWith(plain) ? full.slice(plain.length) : '', counts: counted(shown) };
	});

	/** The node index at the phone window's first slot, -1 to 7. Opens centred on node zero, then slides. */
	let first = $state(untrack(() => slideWindow(3, selectedIndex)));
	$effect.pre(() => {
		const i = selectedIndex;
		untrack(() => (first = slideWindow(first, i)));
	});

	let strip: HTMLDivElement | undefined = $state();
	let track: HTMLDivElement | undefined = $state();
	// Focus follows the selection, so the arrows keep working after a commit.
	$effect(() => {
		void selected.semitones;
		void selected.fifths;
		strip?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus({ preventScroll: true });
	});

	function onkeydown(e: KeyboardEvent) {
		const step = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0;
		if (!step) return;
		e.preventDefault();
		const next = nodes[selectedIndex + step];
		if (next) keyRuler.commit(lands(next));
	}

	// ── The drag, and the tap that closes ──

	/** Less travel than this is a tap, which the button's own click commits. */
	const SLOP = 6;
	let gesture: { id: number; x: number; y: number; dragging: boolean } | null = null;
	/** True for the instant after a drag, whose release can also fire a click. */
	let swallow = false;
	/** True when the pointer went down outside the ruler, which makes its click a tap outside. */
	let downOutside = false;

	const inside = (target: EventTarget | null) =>
		target instanceof Element && !!target.closest('[data-transposition-ribbon]');

	function onstripdown(e: PointerEvent) {
		if (!e.isPrimary || e.button !== 0 || (e.target as Element).closest('.spell')) return;
		gesture = { id: e.pointerId, x: e.clientX, y: e.clientY, dragging: false };
	}

	/** The node under the pointer. Off the strip, the drag keeps the one it had. */
	function follow(e: PointerEvent) {
		if (!strip || !track) return;
		const box = strip.getBoundingClientRect();
		if (e.clientY < box.top || e.clientY > box.bottom) return;
		const run = track.getBoundingClientRect();
		const position = (e.clientX - run.left) / (run.width / nodes.length) - 0.5 - zero;
		let i = zero + snapSemitone(position);
		// The phone's drag stays inside the window's slots, so the thumb never leaves.
		if (keyRuler.phone) i = Math.min(first + WINDOW_SLOTS - 1, Math.max(first, i));
		keyRuler.drag(lands(nodes[i]));
	}

	function onpointermove(e: PointerEvent) {
		if (!gesture || e.pointerId !== gesture.id) return;
		if (!gesture.dragging && Math.hypot(e.clientX - gesture.x, e.clientY - gesture.y) < SLOP) return;
		gesture.dragging = true;
		follow(e);
	}

	function onpointerup(e: PointerEvent) {
		if (!gesture || e.pointerId !== gesture.id) return;
		const { dragging } = gesture;
		gesture = null;
		if (!dragging) return;
		follow(e);
		keyRuler.lift();
		swallow = true;
		setTimeout(() => (swallow = false));
	}

	function onpointercancel(e: PointerEvent) {
		if (!gesture || e.pointerId !== gesture.id) return;
		gesture = null;
		keyRuler.drag(null);
	}

	/* A TAP outside closes, never a pointer-down: on a phone a page scroll begins
	   with one, and the singer scrolls to look at the result. A scroll ends in no
	   click. */
	function onclickcapture(e: MouseEvent) {
		if (swallow) {
			swallow = false;
			e.preventDefault();
			e.stopPropagation();
			return;
		}
		const away = downOutside && !inside(e.target);
		downOutside = false;
		if (away) keyRuler.close();
	}

	function onwindowkeydown(e: KeyboardEvent) {
		if (e.key !== 'Escape' || !inside(e.target)) return;
		e.preventDefault();
		keyRuler.close();
	}
</script>

<svelte:window
	{onpointermove}
	{onpointerup}
	{onpointercancel}
	{onclickcapture}
	onpointerdowncapture={(e) => (downOutside = !inside(e.target))}
	onkeydown={onwindowkeydown}
/>

{#snippet body(docked: boolean)}
	<div class="ribbon-body" class:docked>
		<p class="readout" aria-live="polite">
			{line.plain}{#if line.rest}<span class="readout-rest">{line.rest}</span>{/if}
			{#each line.counts as c (c)}<span class="readout-count">{c}</span>{/each}
		</p>
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<div
			class="ribbon"
			role="radiogroup"
			aria-label={t('key.band.try', language)}
			bind:this={strip}
			{onkeydown}
			onpointerdown={onstripdown}
		>
			<div
				class="ribbon-track"
				bind:this={track}
				style={docked ? `transform: translateX(${(-first / nodes.length) * 100}%);` : undefined}
			>
				<div class="rail" aria-hidden="true" style="left: {centre(0)}%; right: {100 - centre(nodes.length - 1)}%;"></div>
				<div
					class="rail-fill"
					aria-hidden="true"
					style="left: {centre(Math.min(zero, thumb))}%; width: {centre(Math.max(zero, thumb)) - centre(Math.min(zero, thumb))}%;"
				></div>
				{#each nodes as node, i (node.semitones)}
					{@const isSel = i === selectedIndex}
					<div class="node" class:sel={isSel}>
						<button
							type="button"
							class="node-hit"
							role="radio"
							aria-checked={isSel}
							aria-label={name(lands(node))}
							tabindex={isSel ? 0 : -1}
							data-semitones={node.semitones}
							onclick={() => keyRuler.commit(lands(node))}
						>
							<span class="num" class:zero={i === zero} class:on={i === thumb} aria-hidden="true">{semitoneLabel(node.semitones)}</span>
							<span class="detent" aria-hidden="true">
								{#if i === thumb}
									<span class="thumb"></span>
								{:else}
									<span
										class="dot"
										class:ring={i === zero}
										class:travelled={i >= Math.min(zero, thumb) && i <= Math.max(zero, thumb)}
									></span>
								{/if}
							</span>
							<span class="interval" aria-hidden="true">
								<span
									class="interval-text"
									class:pick={!isSel && node.stops.some((s) => sameKey(s, pick))}
									class:run={!isSel && node.stops.some((s) => sameKey(s, runnerUp))}
								>{shortInterval(node.semitones, language)}</span>
							</span>
							<span class="band" aria-hidden="true"></span>
						</button>
						{#if isSel && node.stops.length > 1 && !keyRuler.dragged}
							<div class="pair">
								{#each node.stops as stop, side (side)}
									{@const live = sameKey(stop, selected)}
									<button
										type="button"
										class="spell"
										class:flat={side === 0}
										class:sharp={side === 1}
										class:live
										tabindex={live ? -1 : 0}
										aria-hidden={live ? true : undefined}
										aria-label={live ? undefined : respell(stop)}
										onclick={() => keyRuler.commit(stop)}
									>
										<span aria-hidden="true">{wordedTonic(stop, printed, language)}</span>
									</button>
								{/each}
								<span class="slash" aria-hidden="true">/</span>
							</div>
						{/if}
					</div>
				{/each}
			</div>
			{#if docked && first > 0}<div class="fade l" aria-hidden="true"></div>{/if}
			{#if docked && first < nodes.length - WINDOW_SLOTS}<div class="fade r" aria-hidden="true"></div>{/if}
		</div>
		<!-- The dock keeps this row when it is empty: the dock grows from the bottom
		     edge, so a row that came and went would move the slider under the thumb. -->
		{#if docked || keyRuler.canUndo}
			<div class="undo-row">
				{#if keyRuler.canUndo}
					<button type="button" class="undo" onclick={() => keyRuler.undo()}>
						<span aria-hidden="true">↩</span>
						{t('key.ruler.undo', language)}
					</button>
				{/if}
			</div>
		{/if}
	</div>
{/snippet}

{#if keyRuler.phone}
	<TranspositionDock {keyRuler} {language} {body} />
{:else}
	<div class="transposition-ruler-anchor" style="width: {width}px;">
		<div class="transposition-ruler" role="dialog" aria-label={t('key.band.try', language)} data-transposition-ribbon>
			{@render body(false)}
		</div>
	</div>
{/if}

<style>
	/* Values from `mockup-ribbon-dots_r2_2026-11-26.svg` unless a line says
	   otherwise. JUDGEMENT, the drawing's own. */
	/* Zero height, and the negative margin cancels the page stack's 2rem gap
	   (`.markup-paper-container`), so the ruler moves no page. */
	.transposition-ruler-anchor {
		position: sticky;
		top: 12px;
		height: 0;
		margin-bottom: -2rem;
		z-index: 20;
	}

	/* The side padding sets the track: thirteen equal nodes across it leave the
	   end nodes' centres about 50 px inside the card, and 716 px apart on a
	   letter page, the length the stops had. `overflow` clips a spelling half at
	   the card's edge, so a tap past the card is a tap outside. */
	.transposition-ruler {
		position: absolute;
		top: 10px;
		left: 0;
		right: 0;
		overflow: hidden;
		background: rgba(250, 248, 243, 0.97);
		border: 1.4px solid var(--ink-primary);
		border-radius: 12px;
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
		padding: 10px 18.75px;
		font-family: var(--font-sans);
		color: var(--ink-primary);
	}

	.readout {
		margin: 0 0 6px;
		text-align: center;
		font-size: 14px;
		font-weight: 600;
	}

	.docked .readout {
		margin: 4px 0 2px;
		font-size: 12.5px;
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

	/* A drag here is the slider's, never a pan of the page. */
	.ribbon {
		position: relative;
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
	}

	/* The phone's window runs to the screen's edges, past the dock's padding, with
	   seven slots for the thirteen nodes. It never scrolls natively. */
	.docked .ribbon {
		margin: 0 -10px;
		overflow: clip;
	}

	.ribbon-track {
		position: relative;
		display: flex;
	}

	.docked .ribbon-track {
		width: calc(100% * 13 / 7);
		transition: transform 0.2s ease;
	}

	@media (prefers-reduced-motion: reduce) {
		.docked .ribbon-track {
			transition: none;
		}
	}

	/* 18 px of integer, then the 30 px detent row: the bar's middle is at 33 px. */
	.rail,
	.rail-fill {
		position: absolute;
		top: 30px;
		height: 6px;
		border-radius: 3px;
	}

	.rail {
		background: var(--lavender-desk);
	}

	.rail-fill {
		background: var(--lavender-jewel);
		opacity: 0.55;
	}

	.node {
		position: relative;
		flex: 1 1 0;
		min-width: 0;
	}

	.node-hit {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		width: 100%;
		padding: 0;
		border: none;
		border-radius: 8px;
		background: transparent;
		font: inherit;
		color: var(--ink-tertiary);
		cursor: pointer;
	}

	.undo:focus-visible {
		outline: 2px solid var(--lavender-ink);
		outline-offset: -2px;
	}

	/* A spelling half's ring goes round its word. The half is a wide invisible
	   region whose inner edge runs down the middle of the pair, so a ring on it
	   cut through the slash. The word is at full strength while ringed, which
	   keeps the ring's own contrast. */
	.spell:focus-visible {
		outline: none;
	}

	.spell:focus-visible span {
		outline: 2px solid var(--lavender-ink);
		outline-offset: 1px;
		border-radius: 3px;
		opacity: 1;
	}

	/* The node's ring stops at the spelling band. The radio runs under it, so that
	   a tap there selects the node, but a ring round the whole radio ran through
	   the spelling words. A border, so a forced-colours mode still draws it. */
	.node-hit:focus-visible {
		outline: none;
	}

	.node-hit:focus-visible::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 46px;
		left: 0;
		border: 2px solid var(--lavender-ink);
		border-radius: 8px;
		pointer-events: none;
	}

	.num {
		height: 18px;
		font-size: 12px;
		line-height: 18px;
		text-align: center;
	}

	.num.zero {
		color: var(--ink-primary);
	}

	.num.on {
		color: var(--lavender-jewel);
		font-weight: 700;
	}

	.detent {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 30px;
	}

	/* 6 and 10 px for the drawing's 5.2 and 9.3: the odd sizes drew some dots
	   oblong, the nodes sitting between pixels. */
	.dot {
		position: relative;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--lavender);
	}

	.dot.travelled {
		background: #fff;
	}

	.dot.ring {
		box-sizing: border-box;
		width: 10px;
		height: 10px;
		border: 1.7px solid var(--ink-primary);
		background: transparent;
	}

	.dot.ring.travelled {
		border-color: #fff;
	}

	.thumb {
		position: relative;
		width: 24px;
		height: 24px;
		box-sizing: border-box;
		border: 2px solid #fff;
		border-radius: 50%;
		background: var(--lavender-jewel);
	}

	.interval {
		height: 18px;
		font-size: 10px;
		line-height: 14px;
		text-align: center;
		white-space: nowrap;
	}

	/* Ilya's pick and the runner-up. DESK DEFAULT: no mockup draws them. */
	.interval-text {
		display: inline-block;
		border-bottom: 2px solid transparent;
	}

	.interval-text.pick {
		border-bottom-color: var(--lavender-jewel);
	}

	.interval-text.run {
		border-bottom: 2px dotted var(--lavender);
	}

	.interval-text.pick.run {
		border-bottom: 2px solid var(--lavender-jewel);
	}

	/* The spelling row, empty on every node but the selected one. */
	.band {
		height: 46px;
	}

	/* Over the band, which starts below the interval labels, so a neighbour's
	   label is never inside a spelling region. The halves meet under the node. */
	.pair {
		position: absolute;
		left: 50%;
		bottom: 0;
		width: 0;
		height: 46px;
		z-index: 2;
	}

	.spell {
		position: absolute;
		top: 0;
		display: flex;
		align-items: flex-start;
		width: 96px;
		height: 46px;
		padding: 2px 5px 0;
		border: none;
		border-radius: 8px;
		background: transparent;
		font: inherit;
		font-size: 9.5px;
		line-height: 14px;
		white-space: nowrap;
		color: var(--ink-tertiary);
		cursor: pointer;
	}

	.spell.flat {
		right: 0;
		justify-content: flex-end;
	}

	.spell.sharp {
		left: 0;
		justify-content: flex-start;
	}

	.spell span {
		opacity: 0.6;
	}

	.spell.live {
		color: var(--lavender-jewel);
		font-weight: 700;
	}

	.spell.live span {
		opacity: 1;
	}

	.slash {
		position: absolute;
		top: 2px;
		left: 0;
		transform: translateX(-50%);
		font-size: 9.5px;
		line-height: 14px;
		color: var(--ink-tertiary);
		pointer-events: none;
	}

	/* The phone's line continues past the window: a fade on that side only. */
	.fade {
		position: absolute;
		top: 0;
		bottom: 46px;
		width: 24px;
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

	/* Bottom right, as `mockup-ribbon-no-buttons_r2` draws it, on its own row so
	   that it takes no tap from a spelling half. DESK DEFAULT. */
	.undo-row {
		display: flex;
		justify-content: flex-end;
		min-height: 28px;
	}

	.docked .undo-row {
		min-height: 44px;
	}

	.undo {
		display: flex;
		align-items: center;
		gap: 5px;
		min-height: 28px;
		padding: 0 6px;
		border: none;
		border-radius: 6px;
		background: transparent;
		font: inherit;
		font-size: 12px;
		color: var(--ink-primary);
		cursor: pointer;
	}

	.docked .undo {
		min-width: 44px;
		min-height: 44px;
		justify-content: flex-end;
	}

	@media print {
		.transposition-ruler-anchor {
			display: none;
		}
	}
</style>
