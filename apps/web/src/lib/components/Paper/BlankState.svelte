<script lang="ts">
	/**
	 * THE BLANK STATE OF TEXT, MELODY, AND INSIGHTS: one squircle, drawn by one component (lane 78).
	 *
	 * RULED BY DANN 2026-11-19, 08:45 to 09:25 (`docs/sessions/ratified-blank-state-blurbs_2026-11-19.md`, section 1): each blank page carries
	 * ONE SQUIRCLE, CENTRED VERTICALLY in the space between the title rule and the footer rule (his 08:49); ordinary formatting inside it, RANGED LEFT
	 * (08:51); roman, not italic (the desk's default of 08:55, not overruled). The squircle is the cue that Ilya is speaking. Every section a singer
	 * must visit is a link (08:40), and no sentence names a direction. Dann 2026-11-20 15:41, on his iPhone: "I'm botherd that the page layout between
	 * TEXT, MELODY, and INSIGHTS is dissimilar." One component draws all three so they cannot drift apart again.
	 *
	 * THE SQUIRCLE is `InsightsPane`'s (12 px radius, 1 px accent, padding 16 px 26 px, a 12 px gap), with the accent a prop per page: sage, lavender,
	 * rose. THE WINDOW is one frame (`blankFrame`, lane 79): each page's measured header and footer go in, so the squircle is centred between that
	 * page's own title rule and footer hairline, and the three pages share a left edge and a width. A grid of `1fr auto 1fr` centres the squircle itself, whatever sits under it.
	 *
	 * NOTES sits under the squircle, unboxed (DESK DEFAULT, the companion's own wording). MELODY gives it as `notes` (paragraphs of runs; this component draws
	 * the heading, `insights.r2.notes`); INSIGHTS gives its own notes block as `children`, whose two links stay as built and whose heading it draws itself.
	 *
	 * NOTHING HERE PRINTS (brief, step 4, DESK DEFAULT, Dann's to overrule): the sheet keeps its header and footer, and the squircle is screen only.
	 * The links open the Drawer, so on paper they would point at nothing.
	 */
	import type { Snippet } from 'svelte';
	import { t, type Language } from '$lib/i18n';
	import type { BlankFrame } from '$lib/page-config';
	import { linkParts, type BlankPart, type SectionName } from './blank-state';

	interface Props {
		language: Language;
		/** The squircle's outline, and the ink of the NOTES heading and of the links. */
		accent: string;
		ink: string;
		/** The window of a blank page (`blankFrame`, `page-config.ts`): the one frame all three documents hand in. */
		frame: BlankFrame;
		/** The squircle's paragraphs, in order. A section name in one is a link where `links` has a handler for it. */
		paragraphs: readonly string[];
		links?: Partial<Record<SectionName, () => void>>;
		/** NOTES as paragraphs of runs (MELODY). */
		notes?: readonly (readonly BlankPart[])[];
		/** NOTES as the page's own block (INSIGHTS). */
		children?: Snippet;
		/** Whether `children` has anything to draw: an empty NOTES draws no wrapper. */
		underneath?: boolean;
	}

	let { language, accent, ink, frame, paragraphs, links = {}, notes = [], children, underneath = false }: Props = $props();

	const available = $derived((['input', 'voice'] as const).filter((k) => !!links[k]));
</script>

{#snippet runs(parts: readonly BlankPart[])}{#each parts as p, j (j)}{#if p.kind === 'link'}<button type="button" class="link" data-link={p.to} onclick={() => links[p.to]?.()}>{p.text}</button>{:else if p.kind === 'ipa'}<span class="ipa" aria-hidden="true">{p.text}</span>{:else}{p.text}{/if}{/each}{/snippet}

<div
	class="blank-window"
	style="top: {frame.top}px; bottom: {frame.bottom}px; left: {frame.left}px; right: {frame.right}px; --accent: {accent}; --ink: {ink};"
>
	<div class="blank-state" data-blank-state>
		{#each paragraphs as text, i (i)}
			<p>{@render runs(linkParts(text, language, available))}</p>
		{/each}
	</div>
	{#if notes.length > 0 || (children && underneath)}
		<div class="notes" data-blank-notes>
			{#if notes.length > 0}
				<p class="notes-head">{t('insights.r2.notes', language)}</p>
				{#each notes as paragraph, i (i)}
					<p class="notes-line">{@render runs(paragraph)}</p>
				{/each}
			{/if}
			{#if underneath}{@render children?.()}{/if}
		</div>
	{/if}
</div>

<style>
	.blank-window {
		position: absolute;
		display: grid;
		grid-template-rows: 1fr auto 1fr;
	}

	/* The squircle: `InsightsPane`'s (the watch band's outline), its accent a prop. Roman and left-ranged. */
	.blank-state {
		grid-row: 2;
		box-sizing: border-box;
		border: 1px solid var(--accent);
		border-radius: 12px;
		padding: 16px 26px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		text-align: left;
		font-family: var(--font-serif);
		font-style: normal;
		font-size: 14px;
		line-height: 1.45;
		color: var(--ink-primary);
	}

	.blank-state p,
	.notes p {
		margin: 0;
	}

	/* NOTES: unboxed, under the squircle, which keeps its own centre because the third row is the free half. */
	.notes {
		grid-row: 3;
		align-self: start;
		padding-top: 20px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	/* `SingerBlock`'s `.section-head`, in the page's accent. */
	.notes-head {
		font-family: var(--font-sans);
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 1.5px;
		line-height: 1.5;
		font-variant-caps: all-small-caps;
		color: var(--ink);
		margin-bottom: 2px !important;
	}

	/* `SingerBlock`'s `.source-line`. */
	.notes-line {
		font-family: var(--font-serif);
		font-size: 11.5px;
		line-height: 1.4;
		color: var(--ink-secondary);
	}

	/* The IPA glyphs keep the calibration surfaces' IPA face, with the wizard's 0.3em breath between glyph and informal name. */
	.ipa {
		font-family: 'Lato IPA', sans-serif;
		margin-right: 0.3em;
	}

	.link {
		border: none;
		padding: 0;
		background: none;
		font: inherit;
		color: var(--ink);
		text-decoration: underline;
		cursor: pointer;
	}

	@media print {
		.blank-window {
			display: none;
		}
	}
</style>
