/**
 * The ё ↔ е toggle on a word's typed spelling: swaps е and ё (either case) at the given positions, counted over the
 * letters of the word with punctuation and dashes skipped (the `cleanWord` index, as the singer's toggles are keyed).
 * Moved out of `pipeline.ts`, unchanged, to pay for the rhyme reading's lines there (`pipeline.ts` is at its ceiling).
 */
export function swapYoAt(cyrillic: string, cleanIndices: readonly number[]): string {
	const chars = Array.from(cyrillic);
	let cleanIdx = 0;
	for (let ci = 0; ci < chars.length; ci++) {
		const isPunct = /[.,!?;:"""''–—\-‐‑«»]/.test(chars[ci]);
		if (isPunct) continue;
		if (cleanIndices.includes(cleanIdx)) {
			switch (chars[ci]) {
				case 'е': chars[ci] = 'ё'; break;
				case 'ё': chars[ci] = 'е'; break;
				case 'Е': chars[ci] = 'Ё'; break;
				case 'Ё': chars[ci] = 'Е'; break;
			}
		}
		cleanIdx++;
	}
	return chars.join('');
}
