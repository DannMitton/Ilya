/**
 * THE MEASURE SWITCH (N.200 Step 3). With `?measure=open` in the address, a take is read by the open picker (`engine/open-extract.ts`):
 * no vowel, no voice type, and no other singer's voice reaches into it. With `?measure=path` (the exact value), it is read by the path picker
 * (`engine/path-extract.ts`), which reads the take alone by a ladder of ceilings and checks it with no prior (N.200 plan step P2). Read at the session boundary (`captureSessionFor`,
 * `chart/stub-switch.ts`), in every build, so Dann can score it on the lane's deployment and on a release build alike. Step 6
 * makes it the default; until the desk says so, a singer who does not type it is read by the picker the app has always used.
 */
import type { Picker } from '../engine/analyze';

export function measurePicker(search: string = typeof location === 'undefined' ? '' : location.search): Picker {
	const m = new URLSearchParams(search).get('measure');
	return m === 'open' ? 'open' : m === 'path' ? 'path' : 'shipped';
}
