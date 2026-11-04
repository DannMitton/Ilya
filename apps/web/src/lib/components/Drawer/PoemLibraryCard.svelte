<script lang="ts">
	import { tick } from 'svelte';
	import { t, type Language } from '$lib/i18n';
	import { poemOffer } from '$lib/text/poem-offer.svelte';
	import { cardLine } from '$lib/text/poem-source';
	import { siteName } from '$lib/text/poem-site';
	/*
	 * PoemLibraryCard.svelte: THE CARD THAT SAYS ILYA FILLED POEM FROM ITS LIBRARY
	 * (poem library, build 1, step 5; brief `docs/sessions/brief-code-poem-library-build1_r3_2026-11-03.md`,
	 * the singer's walk, items 1 to 5). Its strings are Dann's, ratified 2026-11-03 20:21 (`i18n.ts`, `intake.poemLibrary.*`; step 7, part 4).
	 *
	 * IT STANDS ABOVE THE FIELD SHE IS LOOKING AT, in LYRICS or in POEM (`IntakeViews.svelte` places it before the
	 * field, so it comes before the field in tab order), and it answers what she wonders in the order she wonders it:
	 * what is this (the title, the first line of the stretch her song sets, the poet), then where is it from (the
	 * source), then what changed in LYRICS, then her choice. Nothing takes her focus when it arrives. It is a
	 * `role="group"` named by its heading; the heading is spoken through a polite live region, so a screen reader
	 * hears it without the page moving.
	 *
	 * IT STANDS ON EVERY VISIT TO THE SONG UNTIL SHE ANSWERS (`doc.poemSource.answered`, stored). "Not this poem"
	 * empties Poem and returns Lyrics as they were, and "Poem removed." with Undo stands in its place until she leaves
	 * the song (`poemOffer.removedFor`). The order of the buttons follows the page's rule that the last answer is the
	 * safe one (`+page.svelte`, `askToReplace`). DESK DEFAULT, open for Dann.
	 *
	 * THE POET IS PRINTED AS THE DATA'S `author` HAS IT, the full name, with no surname derived from it, and with
	 * "translated by" where `translator` is set (review amendments 7 and 8). A first line the data quotes is not
	 * quoted twice (`cardLine`).
	 */
	interface Props {
		language: Language;
		songId: string;
		/** She answered (Keep, or Undo): the card is gone, so the caller puts her focus somewhere that still exists. */
		onanswered?: () => void;
	}
	let { language, songId, onanswered }: Props = $props();

	const shown = $derived(poemOffer.current());
	const card = $derived(shown && !shown.source.answered ? shown : null);
	const removed = $derived(card ? null : poemOffer.removedFor(songId));

	const entry = $derived(card?.resolved.entry);
	const naming = $derived.by(() => {
		if (!card || !entry) return null;
		const quoted = cardLine(card.resolved.firstLine);
		// D1 reaches the card's own title and line (desk default, step 7 part 6): English quotes a Russian title or line in “…”, French keeps « ».
		const [open, close] = language === 'en' ? ['“', '”'] : ['«', '»'];
		return {
			title: `${open}${entry.title}${close}`,
			line: card.resolved.passage ? t('intake.poemLibrary.passage', language).replace('{line}', () => quoted) : `${open}${quoted}${close}`,
			poet: entry.translator ? t('intake.poemLibrary.by', language).replace('{author}', () => entry.author).replace('{translator}', () => entry.translator!) : entry.author,
			source: t(entry.spelling === 'pre-reform' ? 'intake.poemLibrary.cardSourceModernized' : 'intake.poemLibrary.cardSource', language).replace('{site}', () => siteName(entry.source.site, language)),
		};
	});

	/* What a screen reader is told when the card arrives or a poem is removed: the heading alone, as the brief has it. */
	const announcement = $derived(card ? t('intake.poemLibrary.cardHeading', language) : removed ? t('intake.poemLibrary.removed', language) : '');

	let undoEl = $state<HTMLButtonElement | undefined>(undefined);

	function keep(): void {
		poemOffer.keep();
		onanswered?.();
	}
	async function notThis(): Promise<void> {
		poemOffer.decline();
		await tick();
		undoEl?.focus();
	}
	function undo(): void {
		poemOffer.undo();
		onanswered?.();
	}
</script>

<div class="visually-hidden" aria-live="polite" aria-atomic="true">{announcement}</div>

{#if card && naming}
	<div class="card" role="group" aria-labelledby="poem-library-card-heading" data-testid="poem-library-card">
		<p class="heading" id="poem-library-card-heading">{t('intake.poemLibrary.cardHeading', language)}</p>
		<p class="name">{naming.title}</p>
		<p class="line">{naming.line}</p>
		<p class="poet">{naming.poet}</p>
		<p class="small">{naming.source}</p>
		<p class="small">{t('intake.poemLibrary.cardColours', language)}</p>
		<div class="actions">
			<button type="button" class="btn" onclick={() => void notThis()}>{t('intake.poemLibrary.notThis', language)}</button>
			<button type="button" class="btn keep" onclick={keep}>{t('intake.poemLibrary.keep', language)}</button>
		</div>
	</div>
{:else if removed}
	<p class="removed" data-testid="poem-library-removed">
		<span>{t('intake.poemLibrary.removed', language)}</span>
		<button type="button" class="undo" bind:this={undoEl} onclick={undo}>{t('intake.poemLibrary.undo', language)}</button>
	</p>
{/if}

<style>
	/* The card is a quiet sage panel above the field: the field's own hue (sage names the text intake), a hairline
	   border, and the three voices of the drawer: instruction in sans, the poem's words in serif. */
	.card {
		margin-bottom: 8px;
		padding: 0.6rem 0.7rem;
		border: 1px solid var(--sage-head);
		border-radius: 4px;
		background: var(--sage-wash);
	}

	.card p {
		margin: 0;
	}

	.heading {
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--ink-tertiary);
		margin-bottom: 4px;
	}

	.name {
		font-family: var(--font-serif);
		font-size: 1rem;
		line-height: 1.35;
		color: var(--ink-primary);
	}

	.line {
		font-family: var(--font-serif);
		font-size: 0.9rem;
		line-height: 1.4;
		color: var(--ink-primary);
	}

	.poet {
		font-family: var(--font-serif);
		font-size: 0.9rem;
		line-height: 1.4;
		color: var(--ink-secondary);
		margin-bottom: 4px;
	}

	.small {
		font-family: var(--font-sans);
		font-size: 0.75rem;
		line-height: 1.4;
		color: var(--ink-tertiary);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 8px;
	}

	.btn {
		min-height: 32px;
		padding: 0 12px;
		border: 1px solid var(--sage);
		border-radius: 4px;
		background: transparent;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--ink-primary);
		cursor: pointer;
	}

	.btn:hover {
		background: var(--sage-desk);
	}

	.btn.keep {
		border-color: var(--sage-jewel);
		color: var(--sage-ink);
	}

	/* The 44px floor (`PRODUCT.md:595`) on a coarse pointer, as the pair above it keeps it. */
	@media (pointer: coarse) {
		.btn {
			min-height: 44px;
		}
	}

	.removed {
		display: flex;
		align-items: center;
		gap: 4px;
		margin: 0 0 8px;
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--ink-tertiary);
	}

	.undo {
		min-height: 32px;
		padding: 0 8px;
		border: none;
		background: transparent;
		font-family: var(--font-sans);
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--sage-ink);
		text-decoration: underline;
		cursor: pointer;
	}

	@media (pointer: coarse) {
		.undo {
			min-height: 44px;
		}
	}

	/* The same recipe as the drawer's other visually hidden text (`IntakePanel.svelte`). */
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
