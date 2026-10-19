<script lang="ts">
	/*
	 * ViewPair.svelte: THE SEGMENTED PAIR, ONE COMPONENT FOR TWO PLACES. ROW 110
	 * (N.186), review r2 amendment 1: Input's Poem | Lyrics (`IntakeViews.svelte`)
	 * and Text's own choice of witness are the same control, so it is written
	 * once. It is `DeskHead.svelte`'s pair (`:113-128` markup, `:179-226`
	 * styles) member for member: `button.pair-member`, `role="tab"`,
	 * `aria-selected`, a roving tabindex, the arrow, Home, and End keys, and the
	 * 0.3 rem by 0.5 rem padding Dann ruled on screen (N.132). The styles moved
	 * here from `IntakeViews.svelte` unchanged, with the 44 px touch strip.
	 *
	 * NO CONTROL IS PART OF THE PRINTED PAGE (`CONTRACT.md` §8), so the pair
	 * does not print wherever it stands.
	 */
	interface Props {
		/** The members, in order. */
		items: { id: string; label: string }[];
		active: string;
		/** Each tab's element id is `{idPrefix}-{id}`. */
		idPrefix: string;
		/** The panel the tabs control, where there is one. */
		controls?: string;
		/** The tablist's accessible name. */
		name: string;
		onchoose: (id: string) => void;
	}

	let { items, active, idPrefix, controls, name, onchoose }: Props = $props();

	function onkeydown(e: KeyboardEvent): void {
		const at = items.findIndex((item) => item.id === active);
		let next = at;
		if (e.key === 'ArrowRight') next = (at + 1) % items.length;
		else if (e.key === 'ArrowLeft') next = (at - 1 + items.length) % items.length;
		else if (e.key === 'Home') next = 0;
		else if (e.key === 'End') next = items.length - 1;
		else return;
		e.preventDefault();
		if (next !== at) {
			onchoose(items[next].id);
			document.getElementById(`${idPrefix}-${items[next].id}`)?.focus();
		}
	}
</script>

<div class="pair" role="tablist" aria-label={name}>
	{#each items as item (item.id)}
		<button
			type="button"
			class="pair-member"
			class:active={active === item.id}
			role="tab"
			id="{idPrefix}-{item.id}"
			aria-selected={active === item.id}
			aria-controls={controls}
			tabindex={active === item.id ? 0 : -1}
			onclick={() => onchoose(item.id)}
			{onkeydown}
		>
			{item.label}
		</button>
	{/each}
</div>

<style>
	/* `overflow: hidden` is DeskHead's, to round the active member's fill. It
	   would also clip the touch hit areas, so the corners are rounded on the
	   members instead: the border's 4px less its own 1px is 3px, which is the
	   curve the clip drew. */
	.pair {
		display: inline-flex;
		border: 1px solid var(--ink-primary, #1a1612);
		border-radius: 4px;
	}

	.pair-member {
		position: relative;
		border: none;
		background: transparent;
		color: var(--ink-primary, #1a1612);
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		/* 0.5 rem, not 0.7, N.132: ruled by Dann 2026-09-13 and on screen
		   2026-09-21. ONE value at every width. */
		padding: 0.3rem 0.5rem;
		cursor: pointer;
	}

	.pair-member:first-child {
		border-radius: 3px 0 0 3px;
	}

	.pair-member:last-child {
		border-radius: 0 3px 3px 0;
	}

	/* THE DIVIDER, at the track's weight and full ink. */
	.pair-member + .pair-member {
		border-left: 1px solid var(--ink-primary, #1a1612);
	}

	/* Treatment C: the card. */
	.pair-member.active {
		background: var(--paper-cream, #F0EBE0);
		cursor: default;
	}

	.pair-member:not(.active):hover {
		background: rgba(26, 22, 18, 0.06);
	}

	/* THE 44px TOUCH FLOOR WITHOUT CHANGING THE DRAWN HEIGHT: a transparent
	   strip 44px tall, centred on the member, taps as the member does. It
	   reaches past the pair's border, which is why `.pair` does not clip. */
	@media (pointer: coarse) {
		.pair-member::after {
			content: '';
			position: absolute;
			left: 0;
			right: 0;
			top: 50%;
			height: 44px;
			transform: translateY(-50%);
		}
	}

	@media print {
		.pair {
			display: none;
		}
	}
</style>
