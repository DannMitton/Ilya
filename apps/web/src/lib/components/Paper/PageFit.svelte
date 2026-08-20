<script lang="ts">
	/**
	 * The fitted page (N.73 portrait C, ruled by Dann 2026-08-18; extended to
	 * the marked score by C2, ruled 2026-08-19).
	 *
	 * ONE implementation, two documents. Portrait's arrival view is the real
	 * page scaled down, never a second drawing of the same content, so the
	 * only thing this component adds to a page stack is a scale factor and the
	 * layout height that factor reserves. It changes nothing that is ON the
	 * page. If it drew a lookalike, WYSIWYG would be gone.
	 *
	 * C2 moved this out of `Paper.svelte`, where it served the transcription
	 * alone, so `VoiceProfilePane` gets the same fit by the same mechanism
	 * rather than by a copy that can drift. Both Studio documents miniaturize
	 * identically because they miniaturize through this file.
	 *
	 * THE GUTTER IS NOT HERE. Dann's C2 ruling is that the desk beside the
	 * page and the desk above it are one negative space at one value, so the
	 * gutter is `--portrait-gutter` in `app.css` and it is spent by the desk's
	 * own padding (`+page.svelte`) and by the desk head's
	 * (`DeskHead.svelte`). By the time this component measures its container,
	 * the gutter is already gone from the number, and the page fills what is
	 * left. That is why there is no percentage here: the width follows the
	 * gutter, and one number moves all three sides.
	 */
	import type { Snippet } from 'svelte';

	interface Props {
		/** Fit the page. True in portrait on the phone, false everywhere else. */
		fit: boolean;
		/** The page's true width in px: 816 at letter, 794 at A4. */
		pageWidth: number;
		/** The page stack, at full size. */
		content: Snippet;
	}

	let { fit, pageWidth, content }: Props = $props();

	/** The desk's content width, measured. 0 until the first layout pass. */
	let fitWidth = $state(0);
	/** The stack's own height at full size, measured. Transform-immune. */
	let naturalHeight = $state(0);

	const fitting = $derived(fit && fitWidth > 0);
	/* NEVER ABOVE 1. This fits a page to a desk narrower than the page; it is
	   not a zoom. `fit` is a runtime width test that a caller can hold stale
	   across a resize, and without this clamp a stale `true` on a wide desk
	   would enlarge the page instead of leaving it alone. MEASURED: a stale
	   flag at a 1280px viewport scaled the sheet to 1216 by 1573. The clamp
	   cannot change the phone, where the desk is always narrower than 816. */
	const scale = $derived(fitting ? Math.min(1, fitWidth / pageWidth) : 1);
	/* transform-origin is top left, so the horizontal placement is spent here
	   rather than by auto margins, which cannot centre a box wider than its
	   container. translateX runs in the parent's coordinates because the
	   matrix applies it after the scale. It resolves to 0 while the page fills
	   the desk exactly; the arithmetic stays so a narrower page still centres. */
	const offset = $derived((fitWidth - pageWidth * scale) / 2);
</script>

<div
	class="paper-fit"
	class:fitting
	bind:clientWidth={fitWidth}
	style={fitting ? `height: ${naturalHeight * scale}px;` : ''}
>
	<div
		class="paper-scale"
		class:fitting
		bind:clientHeight={naturalHeight}
		style={fitting
			? `width: ${pageWidth}px; transform: translateX(${offset}px) scale(${scale});`
			: ''}
	>
		{@render content()}
	</div>
</div>

<style>
	/* Off the phone these two are inert: no class, no inline style, no
	   transform, and the stack lays out exactly as it did before N.73. */
	.paper-fit {
		width: 100%;
	}

	.paper-fit.fitting {
		position: relative;
	}

	/* Taken out of flow so its full page width cannot widen the desk or set
	   the desk's scroll width. The visual box is the transformed one, which
	   fits, and .paper-fit's inline height reserves exactly that. */
	.paper-scale.fitting {
		position: absolute;
		top: 0;
		left: 0;
		transform-origin: top left;
	}

	/* PRINT EMITS THE PAGE, WHOLE. The fit is keyed to a width test, so a
	   phone printing in portrait still carries `fitting`, and without this the
	   printer would be handed a page scaled to a third of its size inside a
	   reserved box a third as tall. Every part of the fit is undone here: the
	   reserved height, the absolute placement, the inline page width, and the
	   transform. `!important` beats the inline declarations. What prints is
	   what prints from the desktop. */
	@media print {
		.paper-fit,
		.paper-fit.fitting {
			position: static !important;
			width: auto !important;
			height: auto !important;
		}

		.paper-scale,
		.paper-scale.fitting {
			position: static !important;
			width: auto !important;
			transform: none !important;
		}
	}
</style>
