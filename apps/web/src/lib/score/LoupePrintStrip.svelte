<script lang="ts">
	/* THE PRINT STRIP AND THE BAR ROW (row 181 step 6; `OPEN.md` JOINING POEM TO LYRICS ON A SCAN items 8 to 15).

	   Directly under the LOUPE header, above the drawn notes (item 15): the singer's own scan at this bar, cut from the stored scan
	   when the Loupe opens, in a hairline frame, a picture of the print and nothing more (memo finding 3: it is not aligned to the
	   drawn notes, which the Loupe spaces for the finger, and no alignment is sought or tested; Dann 14:18). It is open on every bar
	   of a scanned song (item 13), a running witness to what Ilya replicated, never printed. A song that is not a scan read with
	   bands draws nothing at all.

	   On a bar the banner lists, a row under it: Previous and Next through the listed bars, and "Fill from the poem" where the join
	   has poem words for that bar (`poemJoin.canFill`). The count, «m. 14 · to check, 1 of 3», is the Loupe's tag, replaced for a
	   listed bar by the same string (`loupePrint.tagFor`); the row's hidden twin takes focus when the Loupe opens itself (finding 9).

	   ZOOM. One for the strip and the notes (item 14): the Loupe's minus and plus (`loupeZoom`). Her pinch on the strip, or a
	   trackpad pinch (a wheel with the control key down), or a tap, enlarges the strip alone (item 10), in place, up to the scan's
	   own pixels: it is drawn from the stored scan at its own resolution, never stretched past it. It pans sideways inside its frame.
	   TWO POINTERS ARE A PINCH AND NEVER THE DISMISS SWIPE (`loupe-swipe.svelte.ts`, memo finding 2). On a phone the strip opens at
	   a scale that keeps the print's letters at `MIN_LETTER_PX`, panning, with the pinch to refine (finding 4).

	   NOT RUN IN A BROWSER in the step that wrote it: the build is unit tested for its logic and checked by `svelte-check`; the walk
	   is the desk's. */
	import { onDestroy } from 'svelte';
	import { t, type Language } from '$lib/i18n';
	import { loupePrint, stripScale, type PrintStrip } from '$lib/score/loupe-print.svelte';
	import { loupeZoom } from '$lib/score/loupe-fit.svelte';
	import { poemJoin } from '$lib/text/poem-join.svelte';

	interface Props {
		/** The held bar's number (the song's), or null where the Loupe holds none. */
		bar: number | null;
		/** The Loupe's tag text for the held measure, so the hidden twin reads what the tag reads. */
		tag: string;
		language: Language;
		isPhone: boolean;
	}
	let { bar, tag, language, isPhone }: Props = $props();

	let strip = $state<PrintStrip | null>(null);
	let box = $state<HTMLDivElement | undefined>(undefined);
	let boxW = $state(0);
	let counter = $state<HTMLElement | undefined>(undefined);
	let pinch = $state(1);

	const listed = $derived(bar === null ? null : loupePrint.position(bar));
	const prev = $derived(bar === null ? null : loupePrint.neighbour(bar, -1));
	const next = $derived(bar === null ? null : loupePrint.neighbour(bar, 1));
	const canFill = $derived(bar !== null && listed !== null && poemJoin.canFill(bar));
	const scale = $derived(strip ? stripScale(strip, boxW, { phone: isPhone, zoom: loupeZoom.factor, pinch }) : 1);

	$effect(() => {
		const b = bar;
		pinch = 1;
		strip = null;
		if (b === null) return;
		let live = true;
		void loupePrint.strip(b).then((s) => live && (strip = s));
		return () => (live = false);
	});

	/* The Loupe opened itself: the row's hidden twin takes focus once for each opening. */
	let seen = 0;
	$effect(() => {
		const n = loupePrint.focusRequest;
		if (n > seen && counter) {
			seen = n;
			counter.focus();
		}
	});
	onDestroy(() => loupePrint.closed());

	/* ── The pinch ─────────────────────────────────────────────────────── */
	const down = new Map<number, { x: number; y: number }>();
	let start: { d: number; pinch: number } | null = null;
	let pinched = false;
	const gap = (): number => {
		const [a, b] = [...down.values()];
		return Math.hypot(a.x - b.x, a.y - b.y);
	};
	const limit = (p: number): number => Math.min(strip ? Math.max(1, strip.width / Math.max(1, boxW)) : 1, Math.max(1, p));

	function onDown(e: PointerEvent): void {
		down.set(e.pointerId, { x: e.clientX, y: e.clientY });
		if (down.size === 2) {
			start = { d: gap(), pinch };
			pinched = true;
		}
	}
	function onMove(e: PointerEvent): void {
		if (!down.has(e.pointerId)) return;
		down.set(e.pointerId, { x: e.clientX, y: e.clientY });
		if (down.size === 2 && start && start.d > 0) pinch = limit((start.pinch * gap()) / start.d);
	}
	function onUp(e: PointerEvent): void {
		down.delete(e.pointerId);
		if (down.size < 2) start = null;
		if (down.size === 0) requestAnimationFrame(() => (pinched = false));
	}
	/* A tap enlarges the strip in place and a second tap returns it; a click that ends a pinch is not a tap. */
	function onTap(): void {
		if (pinched) return;
		pinch = pinch > 1 ? 1 : limit(2);
	}
	/* A trackpad pinch arrives as a wheel with the control key down; left alone it would zoom the whole page. */
	$effect(() => {
		const el = box;
		if (!el) return;
		const wheel = (e: WheelEvent): void => {
			if (!e.ctrlKey) return;
			e.preventDefault();
			pinch = limit(pinch * Math.exp(-e.deltaY * 0.01));
		};
		el.addEventListener('wheel', wheel, { passive: false });
		return () => el.removeEventListener('wheel', wheel);
	});
</script>

{#if bar !== null && loupePrint.hasScan()}
	<div class="print">
		<div
			class="strip"
			bind:this={box}
			bind:clientWidth={boxW}
			onpointerdown={onDown}
			onpointermove={onMove}
			onpointerup={onUp}
			onpointercancel={onUp}
			onclick={onTap}
			role="presentation"
		>
			{#if strip}
				<img src={strip.url} alt={loupePrint.altFor(bar, language)} style:width="{boxW * scale}px" draggable="false" />
			{/if}
		</div>
		{#if listed}
			<div class="row">
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<span class="twin" tabindex="-1" bind:this={counter}>{tag}</span>
				<button type="button" class="step" aria-label={t('loupe.checkPrev', language)} disabled={prev === null} onclick={() => prev !== null && loupePrint.goto(prev)}><span aria-hidden="true">&lsaquo;</span></button>
				<button type="button" class="step" aria-label={t('loupe.checkNext', language)} disabled={next === null} onclick={() => next !== null && loupePrint.goto(next)}><span aria-hidden="true">&rsaquo;</span></button>
				{#if canFill}
					<button type="button" class="fill" onclick={() => bar !== null && poemJoin.fillBar(bar)}>{t('loupe.fillFromPoem', language)}</button>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style>
	.print {
		margin: 0 8px 4px;
	}

	/* A hairline frame: a picture of the print, with the bar's two ends at the frame's two ends. It is the scroller, so its own
	   touch-action holds while the card's is none: one finger pans it, two are the pinch (handled above). */
	.strip {
		overflow-x: auto;
		overflow-y: hidden;
		border: 1px solid var(--ink-tertiary);
		border-radius: 3px;
		background: #fff;
		touch-action: pan-x;
		line-height: 0;
		min-height: 2px;
	}

	.strip img {
		display: block;
		max-width: none;
		height: auto;
		user-select: none;
		-webkit-user-drag: none;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-top: 4px;
		min-height: 32px;
	}

	/* Its text is the tag; the tag itself stays where it is, so this is for the focus and the screen reader alone. */
	.twin {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.step,
	.fill {
		font-family: var(--font-sans);
		font-size: 0.8rem;
		color: var(--sage-ink);
		background: none;
		border: 1px solid var(--sage);
		border-radius: 4px;
		min-height: 32px;
		min-width: 32px;
		padding: 0 8px;
		cursor: pointer;
	}

	.step:disabled {
		opacity: 0.4;
		cursor: default;
	}

	.fill {
		margin-left: auto;
	}

	@media (pointer: coarse) {
		.row {
			min-height: 44px;
		}
		.step,
		.fill {
			min-height: 44px;
			min-width: 44px;
		}
	}
</style>
