<script lang="ts">
	import { tick } from 'svelte';
	import type { LineData, WordStackData } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import type { Language } from '$lib/i18n';
	import { contentWidth, ROW_HEIGHT } from '$lib/page-config';
	import { pieceKey, type PieceMetrics } from '$lib/page-fit';
	import VerseLine from './VerseLine.svelte';
	/*
	 * TextFitProbe.svelte: THE ONE MEASUREMENT TEXT'S PAGES ARE CUT FROM (step 7, part 1; `page-fit.ts` says why).
	 *
	 * It renders the lines it is asked to, once each, in a column as wide as the content window (`contentWidth`) with a
	 * row gap of 0, and reads back, per line: how many visual rows the browser wrapped it to, which displayed word each
	 * row begins with, and its height. WRAP COUNTS AND CUT POINTS, NOT HEIGHTS IN PLACE: a wrapped line's inner row gap
	 * is its page's `--row-gap` (`VerseLine.svelte`), which is 18 to 28 px and differs between pages, so a height taken
	 * on one page is wrong on the next. At a gap of 0 the numbers do not depend on the page, and the pure slicer adds the
	 * page's own gap. From the one-row lines it also reads the two constants a page cannot assume: a row's drawn height
	 * and how far its lowest child box reaches below it.
	 *
	 * WHERE IT STANDS. Never `display: none` on screen, which would measure 0 (the reason `+page.svelte`'s measuring
	 * column is `visibility: hidden` too); `visibility: hidden`, out of flow, fixed, and zero high, so it adds no scroll
	 * and no ink. Hidden in print, where nothing is measured and the last numbers stand: the sheet is 816 by 1056 on every
	 * display and print changes colour only (`TitlePage.svelte`, `SubsequentPage.svelte`, `WordStack.svelte`), so a count
	 * taken on screen holds on paper. It is mounted only while there is something to measure, so its copies of the words
	 * (and their `data-word-index`) are in the document for a moment, not for good. A CSS transform (the phone's fit) scales
	 * every rectangle; the scale is read back and divided out, since `offsetHeight` alone would round 56.3 to 56.
	 *
	 * IT MEASURES ONCE THE FONTS ARE IN (`document.fonts.ready`), because a word's width, and so a wrap, depends on them.
	 */
	interface Props {
		pieces: LineData[];
		pageWidth: number;
		notationPrefs: NotationPreferences;
		language: Language;
		showStressDiacritics?: boolean;
		spotReconstitution?: Map<string, boolean>;
		glossOverrides?: Map<string, string>;
		/** The result: a measurement per piece key, and the two constants where a one-row line was among the pieces. */
		onmeasured: (result: { pieces: Map<string, PieceMetrics>; rowBox?: number; overhang?: number }) => void;
	}
	let { pieces, pageWidth, notationPrefs, language, showStressDiacritics = false, spotReconstitution, glossOverrides, onmeasured }: Props = $props();

	let root = $state<HTMLDivElement | undefined>(undefined);

	$effect(() => {
		const batch = pieces;
		const el = root;
		if (!el || batch.length === 0) return;
		let cancelled = false;
		void (async () => {
			await tick();
			await document.fonts?.ready;
			if (cancelled || !el.isConnected) return;
			onmeasured(read(el, batch));
		})();
		return () => {
			cancelled = true;
		};
	});

	function read(el: HTMLDivElement, batch: LineData[]) {
		const scale = el.offsetWidth > 0 ? el.getBoundingClientRect().width / el.offsetWidth : 1;
		const px = (n: number) => n / (scale || 1);
		const out = new Map<string, PieceMetrics>();
		let rowBox = 0;
		let overhang = -1;
		for (const row of el.querySelectorAll<HTMLElement>('.probe-row')) {
			const key = row.dataset.key!;
			const box = row.getBoundingClientRect();
			// Rows by where the words fall: a word starts a new row when it begins at or below the bottom of the row before it.
			const stacks = [...row.querySelectorAll<HTMLElement>('.verse-line > *')];
			const rowStarts: number[] = [];
			let rowBottom = -Infinity;
			stacks.forEach((s, i) => {
				const r = s.getBoundingClientRect();
				if (i === 0 || r.top >= rowBottom - 0.5) {
					rowStarts.push(i);
					rowBottom = r.bottom;
				} else rowBottom = Math.max(rowBottom, r.bottom);
			});
			const rows = Math.max(1, rowStarts.length);
			out.set(key, { rows, rowStarts: rowStarts.length ? rowStarts : [0], height: px(box.height) });
			if (rows === 1) {
				rowBox = Math.max(rowBox, px(box.height));
				let low = box.bottom;
				for (const d of row.querySelectorAll('*')) {
					const q = d.getBoundingClientRect();
					if (q.height > 0) low = Math.max(low, q.bottom);
				}
				overhang = Math.max(overhang, px(low - box.bottom));
			}
		}
		return { pieces: out, ...(rowBox > 0 ? { rowBox } : {}), ...(overhang >= 0 ? { overhang } : {}) };
	}
</script>

<div class="text-fit-probe" aria-hidden="true" inert bind:this={root} style="width: {contentWidth(pageWidth)}px; --row-gap: 0px; --row-height: {ROW_HEIGHT}px;">
	{#each pieces as piece (pieceKey(piece))}
		<div class="probe-row" data-key={pieceKey(piece)}>
			<VerseLine words={piece.words as WordStackData[]} {notationPrefs} {showStressDiacritics} {language} {spotReconstitution} {glossOverrides} />
		</div>
	{/each}
</div>

<style>
	.text-fit-probe {
		position: fixed;
		top: 0;
		left: 0;
		height: 0;
		overflow: hidden;
		visibility: hidden;
		pointer-events: none;
		box-sizing: content-box;
	}

	/* The page's own `.verse-row`. */
	.probe-row {
		box-sizing: border-box;
		min-height: var(--row-height);
		overflow: visible;
	}

	@media print {
		.text-fit-probe {
			display: none;
		}
	}
</style>
