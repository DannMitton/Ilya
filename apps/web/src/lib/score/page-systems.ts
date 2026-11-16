/**
 * The page's systems as the Loupe counts them (strophic lane A follow-up, fix 2).
 *
 * The Loupe tag prints "system S of T". Each system on the page is one entry, in document order: a system that holds notated
 * bars carries `data-system` and gives the range of them; a system of later-pass bars only carries `data-verse-system`
 * (`render-seam.ts`) and holds no notated bar, so it takes the range -1 to -1, which no measure falls in. It is still a
 * system on the page, so S and T count it. `loupe.ts` owns `parseSystemRange` and `systemIndexOf`, which read these ranges.
 */
import { parseSystemRange, type SystemRange } from './loupe';

/** One entry per system element, each given as its `data-system` value, or null where it has none (a later-pass-only system). */
export function pageSystemRanges(systems: ReadonlyArray<string | null>): SystemRange[] {
	const out: SystemRange[] = [];
	for (const own of systems) {
		const r = own === null ? { fromMeasure: -1, toMeasure: -1 } : parseSystemRange(own);
		if (r) out.push(r);
	}
	return out;
}
