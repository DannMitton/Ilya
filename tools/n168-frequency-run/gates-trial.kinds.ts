import type { WatchEntry } from '$lib/analysis/watchlist';

/** Each headline kind on the band, with how many entries carry advice: "passaggio 30 (0 advised)". */
export function advisedKinds(entries: readonly WatchEntry[]): string {
	const by = new Map<string, { n: number; advised: number }>();
	for (const e of entries) {
		const k = by.get(e.kinds[0]) ?? { n: 0, advised: 0 };
		k.n++;
		if (e.advice) k.advised++;
		by.set(e.kinds[0], k);
	}
	return [...by].map(([k, v]) => `${k} ${v.n} (${v.advised} advised)`).join(', ') || 'none';
}
