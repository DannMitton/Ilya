<script lang="ts">
	/* THE SCAN'S BANNER, with the bar numbers as links (row 181 step 6; Dann 2026-11-04 12:02 item 8, strings ratified 14:33).
	   It replaces the plain `<p>` the page drew for `noticeText` (the courtesy message of N.55a, in the drawer and not on the page
	   because it names the FILE). Only the two partly-read banners have bars; every other key is the same sentence as before.
	   A tap on a bar number opens the Loupe on that bar (`loupePrint.goto`): the page switches to Markup, lowers the drawer on a
	   phone, sets the cursor, and then opens it, in that order, or the drawer's one-surface rule closes it at once. A bar number is a
	   button, so a keyboard and a screen reader reach it; its name is the bar number and nothing else, the sentence names the rest.
	   Unstyled on purpose beyond the link's own look, for the first walk. */
	import { t, type Language } from '$lib/i18n';
	import { noticeText, type ScanNoticeKey } from '$lib/score/ingestion/ingest';
	import { barPieces } from '$lib/omr/banner-bars';
	import { decodeBars } from '$lib/omr/unread-bars';

	interface Props {
		noticeKey: ScanNoticeKey;
		/** The file's name, or for the partly-read banners the bars as `encodeBars` writes them. */
		arg: string;
		language: Language;
		onbar: (bar: number) => void;
	}
	let { noticeKey, arg, language, onbar }: Props = $props();

	const slot = $derived(noticeKey === 'upload.banner.wordsPartlyRead' ? '{bars}' : noticeKey === 'upload.banner.wordsPartlyReadOne' ? '{bar}' : null);
	const parts = $derived(slot ? t(noticeKey, language).split(slot) : null);
	const pieces = $derived(slot ? barPieces(decodeBars(arg), language) : []);
</script>

{#if parts}
	<p>{parts[0]}{#each pieces as piece, i (i)}{#if piece.bar !== undefined}<button type="button" class="bar-link" onclick={() => onbar(piece.bar!)}>{piece.text}</button>{:else}{piece.text}{/if}{/each}{parts[1] ?? ''}</p>
{:else}
	<p>{noticeText(noticeKey, language, arg)}</p>
{/if}

<style>
	.bar-link {
		font: inherit;
		color: inherit;
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		text-decoration: underline;
		cursor: pointer;
	}

	@media (pointer: coarse) {
		/* A link inside a sentence cannot be 44px tall without breaking the line, so it gets the width and a hit area that grows
		   past its glyphs without moving them. */
		.bar-link {
			position: relative;
		}
		.bar-link::after {
			content: '';
			position: absolute;
			inset: -12px -4px;
		}
	}
</style>
