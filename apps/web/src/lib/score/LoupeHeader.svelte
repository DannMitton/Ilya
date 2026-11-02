<script lang="ts">
	/* ── THE LOUPE'S HEADER (row 164) ────────────────────────────────────
	   A solid lavender band across the top of the card, drawn as the drawer's
	   group band is drawn (`Drawer.svelte`, `.group-band` and `.group-score`):
	   the family's head tint, the family's ink for the label, 0.7 rem, 600,
	   0.12 em tracking, uppercase. LOUPE flush left; Undo, Redo, and Close flush
	   right. It lives in its own file because `Loupe.svelte` has no ratchet
	   room (`scripts/ratchets.json`).

	   THE LABEL IS STORED IN CAPITALS (`loupe.title`, `interface-text.md` §3):
	   the value carries them, so a test and the printed page agree. A screen
	   reader hears the ordinary word, because the buttons' `aria-label`s name
	   the place in words. Undo and Redo are the bar's old pair, moved up, with
	   the same words and the same sentences; an empty stack draws nothing.
	   Close is the Loupe's one way out that a pointer can find on a desk. The
	   page's `dismissLoupe` is the only close path: Escape, the Corrections
	   panel's Done, the phone swipe, and this button all call it. */
	import { t, type Language } from '$lib/i18n';
	import { stackActions } from '$lib/components/Drawer/bandState';
	import type { LoupeDrag } from '$lib/score/loupe-drag.svelte';

	interface Props {
		language: Language;
		isPhone: boolean;
		undoLabel: string | null;
		redoLabel: string | null;
		onundo: () => void;
		onredo: () => void;
		onclose: () => void;
		/** The desk's drag (`loupe-drag.svelte.ts`); absent on a phone, where the header is not a handle. */
		drag?: LoupeDrag;
	}

	let { language, isPhone, undoLabel, redoLabel, onundo, onredo, onclose, drag }: Props = $props();

	/* The drag keeps the whole header on screen, so it needs the window's size and the band's height. */
	let vw = $state(0), vh = $state(0), bandH = $state(0);
	$effect(() => {
		if (drag && vw && vh && bandH) Object.assign(drag, { viewWidth: vw, viewHeight: vh, headerHeight: bandH });
	});

	const actions = $derived(stackActions(undoLabel, redoLabel, language));
</script>

<svelte:window bind:innerWidth={vw} bind:innerHeight={vh} />

<!-- A handle for the pointer only: the drag has no key, and the buttons stay the keyboard's way in (`loupe-drag.svelte.ts`). -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="loupe-header"
	class:phone={isPhone}
	class:draggable={!!drag}
	class:grabbing={drag?.active}
	bind:clientHeight={bandH}
	onpointerdown={(e) => drag?.start(e)}
	onpointermove={(e) => drag?.move(e)}
	onpointerup={() => drag?.end()}
	onpointercancel={() => drag?.end()}
>
	<span class="loupe-title">{t('loupe.title', language)}</span>
	<div class="loupe-header-actions">
		{#each actions as action (action.kind)}
			<button type="button" class="loupe-header-button" aria-label={action.sentence} onclick={() => (action.kind === 'undo' ? onundo() : onredo())}>
				<span aria-hidden="true">{action.kind === 'undo' ? '↰' : '↱'}</span>
				<span>{action.verb}</span>
			</button>
		{/each}
		<button type="button" class="loupe-header-button" onclick={onclose}>{t('loupe.close', language)}</button>
	</div>
</div>

<style>
	/* BLEEDS TO THE CARD'S BORDER: the card has no top padding (`.loupe` in
	   `Loupe.svelte`), so the band spans the card's inner width and carries the
	   card's inner corner on top, the border's radius less its 1.4 px. Colours
	   are tokens (`app.css`), the pair the drawer's bands take after row 165. */
	.loupe-header {
		display: flex;
		align-items: stretch;
		justify-content: space-between;
		height: 40px;
		margin: 0 -10px 10px;
		padding: 0 6px 0 12px;
		border-radius: calc(var(--float-radius, 10px) - 1.4px) calc(var(--float-radius, 10px) - 1.4px) 0 0;
		background: var(--lavender-head);
		color: var(--lavender-ink);
		font-family: var(--font-sans, system-ui, sans-serif);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	/* The desk's handle: a grab cursor, and no text selection under a drag. */
	.loupe-header.draggable {
		cursor: grab;
		user-select: none;
	}

	.loupe-header.grabbing {
		cursor: grabbing;
	}

	.loupe-header.draggable .loupe-header-button {
		cursor: pointer;
	}

	/* THE PHONE'S 44 PX FLOOR, for the band and for each of its buttons. */
	.loupe-header.phone {
		height: 44px;
	}

	.loupe-title {
		display: flex;
		align-items: center;
	}

	.loupe-header-actions {
		display: flex;
		align-items: stretch;
	}

	.loupe-header-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4em;
		min-width: 32px;
		padding: 0 8px;
		border: none;
		background: none;
		color: inherit;
		font: inherit;
		letter-spacing: inherit;
		text-transform: inherit;
		cursor: pointer;
	}

	.loupe-header.phone .loupe-header-button {
		min-width: 44px;
		min-height: 44px;
	}

	.loupe-header-button:hover {
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 3px;
	}

	/* The ink, not the drawer band's lavender: `--lavender` on the head tint is
	   under 3:1, and a focus ring below that is not a ring. */
	.loupe-header-button:focus-visible {
		outline: 2px solid var(--lavender-ink);
		outline-offset: -2px;
	}
</style>
