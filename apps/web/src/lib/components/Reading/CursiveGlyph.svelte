<script lang="ts">
	/**
	 * One of Dann's handwritten letters (r4 redraw), for the cursive columns of LEARN's Glyph Table.
	 * The files are `NN-<capital>-<upper|lower>.svg`; the letter is keyed on its capital plus its case.
	 * Drawn inline so `currentColor` takes the cell's colour. Size is set by `:global(.gt-cursive svg)` in `+page.svelte`.
	 */
	interface Props {
		/** The letter in the case the cell shows: `А` for the capital column, `а` for the small one. */
		letter: string;
	}

	let { letter }: Props = $props();

	const files = import.meta.glob('./cursive/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

	const drawings = new Map<string, string>();
	for (const [path, svg] of Object.entries(files)) {
		const m = /\/\d\d-(.)-(upper|lower)\.svg$/u.exec(path);
		if (m) drawings.set(`${m[1]}-${m[2]}`, svg);
	}

	const svg = $derived.by(() => {
		const capital = letter.toUpperCase();
		return drawings.get(`${capital}-${letter === capital ? 'upper' : 'lower'}`) ?? '';
	});
</script>

{@html svg}
