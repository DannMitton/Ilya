/**
 * THE MEASURE SWITCH (N.200 lane 64, Step 5). With no `measure` in the address, a take is read by the path picker
 * (`engine/path-extract.ts`): it reads the take alone, by a ladder of ceilings, so no vowel, no voice type, and no other singer's values reach into the
 * measurement (Dann 2026-11-13, "Ilya encounters the voice as it is", `docs/memory/PRODUCT.md:1264-1273`). Only the exact values `shipped` and `open`
 * select the other two pickers, kept for comparison and for the scoring tool until a separate lane removes them after the release (DESK DEFAULT);
 * anything else, `?measure=path` included, reads as the path picker. Read at the session boundary (`captureSessionFor`, `chart/stub-switch.ts`),
 * in every build. A reading carries the picker that took it (`engine/analyze.ts`, `picker`), so a reading taken under `shipped` cannot be mistaken
 * for an old one.
 */
import type { Picker } from '../engine/analyze';

export function measurePicker(search: string = typeof location === 'undefined' ? '' : location.search): Picker {
	const m = new URLSearchParams(search).get('measure');
	return m === 'shipped' ? 'shipped' : m === 'open' ? 'open' : 'path';
}
