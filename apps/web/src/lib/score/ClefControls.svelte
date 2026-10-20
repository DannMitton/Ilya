<script lang="ts">
	/**
	 * THE CLEF CONTROLS ON THE PAPER (QUEUE row 144, ruled by Dann 2026-10-20 03:15):
	 * "the user will probably only want this control the first time they view their
	 * score. The control should not persist... a vital control that must recede until
	 * it is needed again. It must also work for mobile."
	 *
	 * THREE PIECES, ONE STATE (`clef-ui.svelte.ts`):
	 *   1. THE CHIP, once per song, floats beside page 1's first clef. It names the
	 *      reading (`octave.readLower` and its siblings) and offers the choices. It
	 *      recedes when the singer chooses, presses Escape, or scrolls the clef out
	 *      of view.
	 *   2. THE CLEF BUTTON, afterwards and always: an invisible button over each
	 *      drawn clef. A tap brings the same choices back.
	 *   3. THE MENU beside the clef on a fine pointer, and a SHEET from the foot of the
	 *      screen on a coarse one, each target at least 44 px tall.
	 *
	 * IT LIVES OUTSIDE THE PAGE'S SCALE. `PageFit` scales the 816 px page by a
	 * transform, so anything inside it would shrink with the page (about 0.48 on a
	 * phone). These are `position: fixed` overlays placed from the clef's own bounding
	 * rect and recomputed on scroll and resize, so a hit area stays at its real size:
	 * under a coarse pointer, at least 44 by 44 CSS px, whatever the page's scale.
	 *
	 * NOTHING PRINTS (`CONTRACT.md` §8): the whole overlay is hidden under
	 * `@media print`. Every string is a ratified one: the reading's sentence, the
	 * choices, and `upload.ask.clef` in the button's name.
	 */
	import { t, type Language } from '$lib/i18n';
	import { CLEF_CHOICE_KEY, clefUi } from './clef-ui.svelte';
	import type { ClefChoice } from './clef-choice';

	let { language, pages }: { language: Language; pages: readonly string[] | null } = $props();

	interface Anchor {
		left: number;
		top: number;
		width: number;
		height: number;
	}

	let anchors = $state<Anchor[]>([]);
	let coarse = $state(false);
	let frame = 0;
	let menuAnchor = $state(0);
	let menuEl: HTMLElement | undefined = $state();
	let opener: HTMLElement | null = null;

	const viewportH = () => (typeof window === 'undefined' ? 0 : window.innerHeight);
	const MIN_HIT = 44;

	/** Reads every drawn clef's place on screen. The clef's group is `data-clef` (`staff-renderer.ts`). */
	function measure(): void {
		const els = [...document.querySelectorAll<SVGGElement>('.markup-paper-container .score-page [data-clef]')];
		const min = coarse ? MIN_HIT : 24;
		anchors = els.map((el) => {
			const r = el.getBoundingClientRect();
			const width = Math.max(r.width + 8, min);
			const height = Math.max(r.height + 8, min);
			return { left: r.left + r.width / 2 - width / 2, top: r.top + r.height / 2 - height / 2, width, height };
		});
		// The chip recedes when page 1's first clef has scrolled wholly out of view.
		if (clefUi.chipOpen && anchors[0] && (anchors[0].top + anchors[0].height < 0 || anchors[0].top > viewportH())) clefUi.dismissChip();
	}

	function schedule(): void {
		if (frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			measure();
		});
	}

	$effect(() => {
		const query = window.matchMedia('(pointer: coarse)');
		const sync = () => {
			coarse = query.matches;
			schedule();
		};
		sync();
		query.addEventListener('change', sync);
		window.addEventListener('resize', schedule);
		document.addEventListener('scroll', schedule, true);
		return () => {
			query.removeEventListener('change', sync);
			window.removeEventListener('resize', schedule);
			document.removeEventListener('scroll', schedule, true);
			if (frame) cancelAnimationFrame(frame);
		};
	});

	// The pages were redrawn, or the voice line arrived: read the clefs again, then raise the chip once.
	$effect(() => {
		void pages;
		void language;
		const id = setTimeout(() => {
			measure();
			if (anchors.length > 0) clefUi.raiseChip();
		}, 0);
		return () => clearTimeout(id);
	});

	$effect(() => {
		if (!clefUi.chipOpen && !clefUi.menuOpen) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key !== 'Escape') return;
			const wasMenu = clefUi.menuOpen;
			clefUi.dismissChip();
			clefUi.closeMenu();
			if (wasMenu) opener?.focus();
		};
		const onDown = (e: PointerEvent) => {
			const target = e.target as Element | null;
			if (target?.closest('[data-clef-surface], [data-clef-hit]')) return;
			clefUi.closeMenu();
		};
		window.addEventListener('keydown', onKey);
		window.addEventListener('pointerdown', onDown);
		return () => {
			window.removeEventListener('keydown', onKey);
			window.removeEventListener('pointerdown', onDown);
		};
	});

	// Focus the choice in force when the menu opens, so the arrows start from it.
	$effect(() => {
		if (!clefUi.menuOpen) return;
		queueMicrotask(() => {
			const current = menuEl?.querySelector<HTMLElement>('[aria-checked="true"]') ?? menuEl?.querySelector<HTMLElement>('button');
			current?.focus();
		});
	});

	function open(i: number, e: Event): void {
		opener = e.currentTarget as HTMLElement;
		menuAnchor = i;
		clefUi.openMenu();
	}

	function arrows(e: KeyboardEvent): void {
		const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'];
		if (!keys.includes(e.key)) return;
		const items = [...(e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('button')];
		const at = items.indexOf(document.activeElement as HTMLElement);
		const next = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? (at + 1) % items.length : (at - 1 + items.length) % items.length;
		items[next]?.focus();
		e.preventDefault();
	}

	/** The overlay is moved to `<body>`, out of every stacking context the page's layout makes, so its z-index means what it says. */
	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return { destroy: () => node.remove() };
	}

	const label = (c: ClefChoice) => t(CLEF_CHOICE_KEY[c], language);
	const buttonName = $derived(`${t('upload.ask.clef', language)}: ${label(clefUi.menu.current)}`);
	const visible = (a: Anchor) => a.top + a.height > 0 && a.top < viewportH();
	/** The chip stands above the first clef where there is room, else below it. */
	const chipStyle = $derived.by(() => {
		const a = anchors[0];
		if (!a) return '';
		const left = Math.max(8, Math.min(a.left, (typeof window === 'undefined' ? 800 : window.innerWidth) - 308));
		return a.top > 120 ? `left:${left}px;bottom:${viewportH() - a.top + 6}px` : `left:${left}px;top:${a.top + a.height + 6}px`;
	});
	const menuStyle = $derived.by(() => {
		const a = anchors[menuAnchor];
		if (!a || coarse) return '';
		return `left:${a.left + a.width + 8}px;top:${Math.max(8, Math.min(a.top, viewportH() - 220))}px`;
	});
</script>

{#snippet choices(kind: 'chip' | 'menu')}
	<p class="sentence">{t(clefUi.sentenceKey, language)}</p>
	<div class="choices" role={kind === 'menu' ? 'menu' : 'group'} aria-label={t('upload.ask.clef', language)} tabindex="-1" onkeydown={arrows}>
		{#each clefUi.menu.options as c (c)}
			<button
				type="button"
				class="choice"
				class:on={c === clefUi.menu.current}
				role={kind === 'menu' ? 'menuitemradio' : undefined}
				aria-checked={kind === 'menu' ? c === clefUi.menu.current : undefined}
				aria-pressed={kind === 'chip' ? c === clefUi.menu.current : undefined}
				data-clef-choice={c}
				onclick={() => clefUi.choose(c)}>{label(c)}</button
			>
		{/each}
	</div>
{/snippet}

{#if clefUi.shown && anchors.length > 0}
	<div class="clef-overlay" data-clef-overlay use:portal>
		{#each anchors as a, i (i)}
			{#if visible(a)}
				<button
					type="button"
					class="clef-hit"
					data-clef-hit
					aria-label={buttonName}
					aria-haspopup="menu"
					aria-expanded={clefUi.menuOpen && menuAnchor === i}
					tabindex={i === 0 ? 0 : -1}
					style="left:{a.left}px;top:{a.top}px;width:{a.width}px;height:{a.height}px"
					onclick={(e) => open(i, e)}
				></button>
			{/if}
		{/each}

		{#if clefUi.chipOpen}
			<div class="chip" data-clef-chip data-clef-surface role="group" aria-label={t('upload.ask.clef', language)} style={chipStyle}>
				{@render choices('chip')}
			</div>
		{/if}

		{#if clefUi.menuOpen}
			<div
				bind:this={menuEl}
				class={coarse ? 'sheet' : 'menu'}
				data-clef-surface
				data-clef-menu={coarse ? 'sheet' : 'menu'}
				role="dialog"
				aria-label={t('upload.ask.clef', language)}
				style={menuStyle}
			>
				{@render choices('menu')}
			</div>
		{/if}
	</div>
{/if}

<style>
	/* No box and so no stacking context of its own (a fixed container would make one): the hit areas sit at 45, under the drawer's 60 so a closed
	   bottom sheet's controls are never reached through it, and the chip, menu, and sheet at 80, over the
	   drawer's pull bar (70) and under the update toast (200) and the loupe (9100). */
	.clef-overlay {
		display: contents;
	}

	.clef-hit {
		position: fixed;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: pointer;
		pointer-events: auto;
		border-radius: 8px;
		z-index: 45;
	}

	.clef-hit:focus-visible {
		outline: 2px solid var(--lavender, #9585a2);
		outline-offset: 2px;
	}

	.chip,
	.menu,
	.sheet {
		position: fixed;
		z-index: 80;
		box-sizing: border-box;
		pointer-events: auto;
		background: var(--paper-cream, #f6f1e6);
		color: var(--ink-primary, #1a1612);
		border: 1px solid var(--lavender, #9585a2);
		box-shadow: 0 6px 24px rgba(26, 22, 18, 0.18);
		font-family: var(--font-sans);
	}

	.chip {
		width: min(300px, calc(100vw - 16px));
		padding: 0.6rem 0.7rem 0.7rem;
		border-radius: 12px;
	}

	.menu {
		width: min(300px, calc(100vw - 16px));
		padding: 0.6rem 0.7rem 0.7rem;
		border-radius: 12px;
	}

	/* On a phone the choices open from the foot of the screen, clear of the home bar. */
	.sheet {
		left: 0;
		right: 0;
		bottom: 0;
		padding: 0.9rem 1rem calc(0.9rem + env(safe-area-inset-bottom, 0px));
		border-radius: 16px 16px 0 0;
	}

	.sentence {
		margin: 0 0 0.5rem;
		font-size: 0.8rem;
		font-style: italic;
		color: var(--ink-secondary, #4a4540);
	}

	.choices {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.sheet .choices,
	.menu .choices {
		flex-direction: column;
		flex-wrap: nowrap;
	}

	.choice {
		appearance: none;
		min-height: 44px;
		padding: 0 0.8rem;
		box-sizing: border-box;
		border: 1px solid var(--lavender, #9585a2);
		border-radius: 10px;
		background: transparent;
		color: inherit;
		font: inherit;
		font-size: 0.85rem;
		text-align: left;
		cursor: pointer;
	}

	.choice.on {
		background: var(--lavender, #9585a2);
		color: #fff;
	}

	.choice:focus-visible {
		outline: 2px solid var(--lavender, #9585a2);
		outline-offset: 2px;
	}

	/* It never prints (`CONTRACT.md` §8). */
	@media print {
		.clef-overlay {
			display: none;
		}
	}
</style>
