<script lang="ts">
	/**
	 * ONE BLOCK OF THE ROUND 2 PAGE (QUEUE row 66). `singer-blocks.ts` decides
	 * the words; this draws them. The pane draws every block twice: once off
	 * screen to measure it, once on its page. So nothing here holds state of
	 * its own, and the two copies are identical.
	 *
	 * Controls, as built: the range offer's link and decline, and "Try this
	 * key". None of them prints (`CONTRACT.md` §6); on paper the key prints as
	 * the ruler's readout in words.
	 */
	import type { KeyChoice } from '@ilya/score-parser';
	import { t, type Language } from '$lib/i18n';
	import type { Run } from '$lib/insights/comment-sources';
	import type { RenderedComment } from '$lib/insights/comment-text';
	import { richParts, textParts } from '$lib/insights/text-parts';
	import type { Block } from '$lib/insights/singer-blocks';
	import PitchSeconds from '$lib/insights/PitchSeconds.svelte';

	interface Props {
		block: Block;
		language: Language;
		/** The block's printed width, in px. */
		width: number;
		ontry?: (stop: KeyChoice) => void;
		onaddrange?: () => void;
		ondecline?: () => void;
	}

	let { block, language, width, ontry, onaddrange, ondecline }: Props = $props();
	const T = (key: string) => t(key, language);

	/* The ring's circumference at r = 32. */
	const C = 2 * Math.PI * 32;
	/* The vowel track: 300 px on the letter page, narrower on a phone so the text column keeps room. */
	const TRACK = $derived(Math.max(80, Math.min(300, width - 250)));
</script>

{#snippet rich(text: string)}{#each richParts(text) as p, j (j)}{#if p.sub}<sub class:em={p.em}>{p.text}</sub>{:else if p.ipa}<span class="ipa">{p.text}</span>{:else if p.acc}<span class="acc">{p.text}</span>{:else if p.em}<em>{p.text}</em>{:else}{p.text}{/if}{/each}{/snippet}

{#snippet prose(text: string)}{#each textParts(text) as part, j (j)}{#if part.ipa}<span class="ipa">{part.text}</span>{:else if part.acc}<span class="acc">{part.text}</span>{:else}{part.text}{/if}{/each}{/snippet}

{#snippet runs(list: Run[])}{#each list as r, j (j)}{#if r.title}<em>{r.text}</em>{:else if r.sub}<sub>{r.text}</sub>{:else}{@render prose(r.text)}{/if}{/each}{/snippet}

{#snippet heading(text: string | undefined)}{#if text}<p class="section-head">{text}</p>{/if}{/snippet}

{#snippet comment(tag: string, c: RenderedComment, teacher: string | undefined)}
	<div class="comment">
		<p class="tag">{@render prose(tag)}{' · '}<span class="ipa">[{c.comment.vowel}]</span></p>
		<p class="body">{@render runs(c.frame)}{#if c.consequence.length}{' '}{@render runs(c.consequence)}{/if}{#each c.visible as s (s.id)}{' '}{@render runs(s.runs)}{/each}</p>
		{#if teacher}<p class="teacher">{teacher}</p>{/if}
	</div>
{/snippet}

<div class="block block-{block.kind}" class:narrow={width < 520} style="width: {width}px;">
	{#if block.kind === 'frame'}
		<p class="frame">{block.text}</p>
	{:else if block.kind === 'silence'}
		{@render heading(block.heading)}
		{#each block.lines as line, j (j)}<p class="prose">{@render rich(line)}</p>{/each}
		{#if block.withheld}<ul class="withheld">{#each block.withheld as w, j (j)}<li>{@render rich(w)}</li>{/each}</ul>{/if}
	{:else if block.kind === 'conclusion'}
		{@render heading(block.heading)}
		{#if block.offer}
			<p class="verdict">{T('insights.offer.before')}{' '}<button type="button" class="offer-link" onclick={() => onaddrange?.()}>{T('insights.offer.link')}</button>{T('insights.offer.after')}{' '}<button type="button" class="offer-decline" onclick={() => ondecline?.()}>{T('insights.offer.decline')}</button></p>
		{/if}
		{#if block.paragraph}<p class="verdict">{@render rich(block.paragraph)}</p>{/if}
		{#if block.forward}
			{#if block.forward.readout}
				<p class="forward">{@render prose(block.forward.readout)}{#if block.forward.stop && ontry}{' '}<button type="button" class="try-key" onclick={() => ontry?.(block.forward!.stop!)}>{T('insights.tryKey')}</button>{/if}</p>
			{/if}
			{#if block.forward.sentence}<p class="verdict">{@render rich(block.forward.sentence)}</p>{/if}
			{#if block.forward.teacher}<p class="teacher">{block.forward.teacher}</p>{/if}
		{/if}
		{#if block.reasons.length}
			<div class="reasons">
				{#each block.reasons as r (r.label)}
					<p class="reason-label">{r.label}</p>
					<div class="reason-lines">{#each r.lines as line, j (j)}<p>{@render rich(line)}</p>{/each}</div>
				{/each}
			</div>
		{/if}
	{:else if block.kind === 'comment'}
		{@render heading(block.heading)}
		{@render comment(block.tag, block.comment, block.teacher)}
	{:else if block.kind === 'more'}
		<details class="more">
			<summary>{block.label}</summary>
			{#each block.comments as m (m.comment.comment.eventId)}{@render comment(m.tag, m.comment, m.teacher)}{/each}
		</details>
	{:else if block.kind === 'note'}
		{@render heading(block.heading)}
		<p class="remainder">{block.text}</p>
	{:else if block.kind === 'cycles'}
		{@render heading(block.heading)}
		<p class="prose">{block.sentence}</p>
		{#if block.bar}
			<div class="stack" role="img" aria-label={block.legend.join('; ')}>
				<span class="under" style="width: {block.bar.under * 100}%;"></span><span class="within" style="width: {block.bar.within * 100}%;"></span><span class="above" style="width: {block.bar.above * 100}%;"></span>
			</div>
			<ul class="legend">
				<li><span class="swatch under"></span><span>{@render prose(block.legend[0])}</span></li>
				<li><span class="swatch within"></span><span>{@render prose(block.legend[1])}</span></li>
				<li><span class="swatch above"></span><span>{@render prose(block.legend[2])}</span></li>
			</ul>
		{/if}
	{:else if block.kind === 'pitches'}
		{@render heading(block.heading)}
		<p class="caption">{block.caption}</p>
		<PitchSeconds figure={block.figure} typedTessitura={block.typedTessitura} {language} {width} />
	{:else if block.kind === 'vowels'}
		{@render heading(block.heading)}
		<p class="caption">{block.caption}</p>
		<p class="sub-caption">{block.sub}</p>
		{#if block.ring !== null && block.turns.pastShare !== null}
			<div class="ring">
				<svg width="80" height="80" viewBox="0 0 80 80" role="img" aria-label={block.ring}>
					<circle cx="40" cy="40" r="32" class="ring-before"></circle>
					<circle cx="40" cy="40" r="32" class="ring-past" stroke-dasharray="{block.turns.pastShare * C} {C}" transform="rotate(-90 40 40)"></circle>
					<text x="40" y="45" text-anchor="middle">{Math.round(block.turns.pastShare * 100)}%</text>
				</svg>
				<div>
					<p class="prose">{block.ring}</p>
					<ul class="legend">
						<li><span class="swatch before"></span><span>{T('insights.r2.vowels.before')}</span></li>
						<li><span class="swatch past"></span><span>{T('insights.r2.vowels.past')}</span></li>
					</ul>
				</div>
			</div>
		{/if}
		<div class="vowel-rows" style="grid-template-columns: 30px {TRACK}px 1fr;">
			{#each block.rows as row (row.vowel)}
				<span class="vowel ipa">[{row.vowel}]</span>
				<span class="track"><span class="before" style="width: {row.before * TRACK}px;"></span><span class="past" style="width: {row.past * TRACK}px;"></span></span>
				<span class="vowel-text">{row.text}{#if row.turn}{' · '}<b>{@render prose(row.turn)}</b>{/if}</span>
			{/each}
		</div>
	{:else if block.kind === 'prose'}
		{@render heading(block.heading)}
		<p class:prose={!block.small} class:source-line={block.small}>{@render rich(block.text)}</p>
	{:else if block.kind === 'endnote'}
		{@render heading(block.heading)}
		{#if block.teacher}<p class="teacher-c">{block.teacher}</p>{/if}
		<p class="tag">{@render prose(block.tag)}</p>
		{#each block.suggestions as s, j (j)}<p class="body">{@render runs(s)}</p>{/each}
		{#if block.references.length}
			<ol class="references">
				{#each block.references as ref, j (j)}<li>{@render runs(ref)}</li>{/each}
			</ol>
		{/if}
	{/if}
</div>

<style>
	.block {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.block p {
		margin: 0;
	}

	/* `TitleHeader`'s metadata line in rose, as the page's section heads were. */
	.section-head {
		font-family: var(--font-sans);
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 1.5px;
		line-height: 1.5;
		font-variant-caps: all-small-caps;
		color: var(--rose-ink);
		margin-bottom: 2px !important;
	}

	.frame {
		font-family: var(--font-serif);
		font-size: 12.5px;
		line-height: 1.5;
		font-style: italic;
		color: var(--ink-secondary);
		max-width: 600px;
	}

	.verdict,
	.prose,
	.body {
		font-family: var(--font-serif);
		font-size: 14px;
		line-height: 1.45;
		color: var(--ink-primary);
	}

	.forward {
		margin-top: 4px !important;
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--rose-ink);
	}

	.teacher {
		margin-top: 4px !important;
		font-family: var(--font-sans);
		font-size: 11.5px;
		font-weight: 600;
		letter-spacing: 0.02em;
		color: var(--rose-ink);
	}

	.teacher-c {
		font-family: var(--font-serif);
		font-size: 13px;
		line-height: 1.45;
		font-style: italic;
		color: var(--ink-secondary);
		margin-bottom: 4px !important;
	}

	.reasons {
		display: grid;
		grid-template-columns: 150px 1fr;
		column-gap: 16px;
		margin-top: 10px;
	}

	/* On a narrow page each reason's label stands over its lines. */
	.narrow .reasons {
		grid-template-columns: 1fr;
	}

	.narrow .reason-lines {
		border-top: none;
		padding-top: 0;
	}

	.reason-label {
		padding: 7px 0 6px;
		border-top: 1px solid color-mix(in srgb, var(--rose) 50%, transparent);
		font-family: var(--font-sans);
		font-size: 10.5px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		line-height: 1.45;
		color: var(--rose-ink);
	}

	.reason-lines {
		padding: 6px 0;
		border-top: 1px solid color-mix(in srgb, var(--rose) 50%, transparent);
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-family: var(--font-serif);
		font-size: 13.5px;
		line-height: 1.45;
		color: var(--ink-primary);
	}

	.tag {
		font-family: var(--font-sans);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.06em;
		color: var(--ink-tertiary, #6a655f);
	}

	.comment {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.remainder,
	.source-line {
		font-family: var(--font-serif);
		font-size: 11.5px;
		line-height: 1.4;
		color: var(--ink-secondary);
	}

	.caption {
		font-family: var(--font-sans);
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-tertiary, #6a655f);
	}

	.sub-caption {
		font-family: var(--font-sans);
		font-size: 10.5px;
		font-weight: 500;
		letter-spacing: 0.02em;
		color: var(--ink-tertiary, #6a655f);
	}

	.ipa {
		font-family: var(--font-sans);
	}

	.acc {
		font-family: var(--font-sans);
	}

	sub {
		font-size: 0.7em;
	}

	/* ── The cycle dose bar: under, within, above, low to high (Dann 03:42) ── */
	.stack {
		display: flex;
		gap: 1px;
		height: 10px;
		width: 100%;
		margin-top: 6px;
	}

	.under {
		background: #e2d2d2;
		box-shadow: inset 0 0 0 1px #b48a8a;
	}

	.within {
		background: #b48a8a;
	}

	.above,
	.past {
		background: var(--rose-ink);
	}

	.before {
		background: #d9c4c4;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 18px;
		margin: 6px 0 0;
		padding: 0;
		list-style: none;
		font-family: var(--font-sans);
		font-size: 11px;
		color: var(--ink-secondary);
	}

	.legend li {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.swatch {
		display: inline-block;
		width: 12px;
		height: 10px;
		flex: none;
	}

	/* ── Time per vowel: the ring, then one two-shade bar per vowel ── */
	.ring {
		display: flex;
		align-items: center;
		gap: 18px;
		margin: 4px 0;
	}

	.ring svg {
		flex: none;
	}

	.ring-before,
	.ring-past {
		fill: none;
		stroke-width: 12;
	}

	.ring-before {
		stroke: #d9c4c4;
	}

	.ring-past {
		stroke: var(--rose-ink);
	}

	.ring text {
		font-family: var(--font-sans);
		font-size: 15px;
		font-weight: 700;
		fill: var(--ink-primary);
	}

	.vowel-rows {
		display: grid;
		grid-template-columns: 30px 300px 1fr;
		column-gap: 12px;
		row-gap: 5px;
		align-items: center;
		font-family: var(--font-sans);
	}

	.vowel {
		font-size: 13px;
		text-align: right;
	}

	.track {
		display: flex;
		height: 10px;
	}

	.vowel-text {
		font-size: 10.5px;
		color: var(--ink-secondary);
	}

	.vowel-text b {
		font-weight: 600;
		color: var(--rose-ink);
	}

	.references {
		margin: 4px 0 0;
		padding-left: 18px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		font-family: var(--font-serif);
		font-size: 11.5px;
		line-height: 1.4;
		color: var(--ink-secondary);
	}

	.withheld {
		margin: 4px 0 0;
		padding-left: 18px;
		font-family: var(--font-serif);
		font-size: 14px;
	}

	/* ── Controls: never printed ── */
	.try-key,
	.offer-link,
	.offer-decline {
		font: inherit;
		cursor: pointer;
	}

	.try-key {
		margin-left: 8px;
		padding: 1px 10px;
		border: 1px solid var(--ink-primary);
		border-radius: 999px;
		background: transparent;
		font-family: var(--font-sans);
		font-size: 11.5px;
		font-weight: 500;
		color: var(--ink-primary);
	}

	.offer-link {
		border: none;
		padding: 0;
		background: none;
		color: var(--rose-ink);
		text-decoration: underline;
	}

	.offer-decline {
		border: none;
		padding: 0;
		background: none;
		color: var(--ink-secondary);
	}

	.more summary {
		cursor: pointer;
		font-family: var(--font-sans);
		font-size: 11.5px;
		color: var(--rose-ink);
	}

	@media print {
		.try-key,
		.offer-decline,
		.more {
			display: none;
		}

		.offer-link {
			text-decoration: none;
			color: inherit;
		}
	}
</style>
